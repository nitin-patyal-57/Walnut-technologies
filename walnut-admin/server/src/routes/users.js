import { Router } from 'express';
import { z } from 'zod';
import { config } from '../config.js';
import { audit } from '../lib/audit.js';
import { randomToken, sha256 } from '../lib/crypto.js';
import { badRequest, notFound, parse } from '../lib/http.js';
import { inviteEmail, sendMail } from '../lib/mailer.js';
import { ROLES } from '../lib/permissions.js';
import { revokeAllSessions } from '../lib/sessions.js';
import { requirePermission } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { UserToken } from '../models/UserToken.js';

const router = Router();
router.use(requirePermission('users:manage'));

function assertAllowedDomain(email) {
  const domains = config.allowedEmailDomains;
  if (domains.length && !domains.includes(email.split('@')[1])) {
    throw badRequest(`Only ${domains.map((d) => '@' + d).join(', ')} addresses can be invited`, 'DOMAIN_NOT_ALLOWED');
  }
}

async function sendInvite(user, inviter) {
  await UserToken.deleteMany({ user: user._id, type: 'invite', usedAt: null });
  const token = randomToken();
  await UserToken.create({ user: user._id, type: 'invite', tokenHash: sha256(token), expiresAt: new Date(Date.now() + config.inviteTtlMs) });
  const link = `${config.appUrl}${config.adminPath}/accept-invite?token=${token}`;
  const delivered = await sendMail({ to: user.email, ...inviteEmail({ name: user.name, inviterName: inviter.name, link }) });
  return { link, delivered };
}

async function otherActiveSuperadmins(userId) {
  return User.countDocuments({ _id: { $ne: userId }, role: 'superadmin', status: 'active' });
}

async function loadUser(id) {
  const user = await User.findById(id);
  if (!user) throw notFound('User not found');
  return user;
}

router.get('/', async (req, res) => {
  const users = await User.find().sort({ status: 1, name: 1 });
  res.json({ users: users.map((u) => u.toSafeJSON()) });
});

router.post('/invite', async (req, res) => {
  const body = parse(
    z.object({
      name: z.string().trim().min(2).max(100),
      email: z.string().trim().toLowerCase().email().max(254),
      role: z.enum(ROLES),
    }),
    req.body,
  );
  assertAllowedDomain(body.email);
  if (await User.exists({ email: body.email })) throw badRequest('A user with this email already exists', 'DUPLICATE');

  const user = await User.create({ ...body, status: 'invited', invitedBy: req.user._id });
  const { link, delivered } = await sendInvite(user, req.user);
  await audit(req, 'user.invited', { target: user.email, meta: { role: user.role } });
  // The link is returned whenever the email wasn't actually sent (local dev, or
  // Resend rejected it), so the admin can still pass the invitation on manually.
  res.status(201).json({ user: user.toSafeJSON(), inviteLink: delivered ? undefined : link });
});

router.post('/:id/resend-invite', async (req, res) => {
  const user = await loadUser(req.params.id);
  if (user.status !== 'invited') throw badRequest('This user has already accepted their invitation');
  const { link, delivered } = await sendInvite(user, req.user);
  await audit(req, 'user.invite_resent', { target: user.email });
  res.json({ ok: true, inviteLink: delivered ? undefined : link });
});

router.patch('/:id', async (req, res) => {
  const body = parse(
    z.object({
      name: z.string().trim().min(2).max(100).optional(),
      role: z.enum(ROLES).optional(),
      status: z.enum(['active', 'disabled']).optional(),
    }),
    req.body,
  );
  const user = await loadUser(req.params.id);
  const isSelf = user._id.equals(req.user._id);

  if (isSelf && (body.role && body.role !== user.role)) throw badRequest('You cannot change your own role');
  if (isSelf && body.status === 'disabled') throw badRequest('You cannot disable your own account');
  if (body.status === 'active' && user.status === 'invited') throw badRequest('Invited users become active when they accept the invitation');

  const losingSuperadmin = user.role === 'superadmin' && ((body.role && body.role !== 'superadmin') || body.status === 'disabled');
  if (losingSuperadmin && (await otherActiveSuperadmins(user._id)) === 0) {
    throw badRequest('There must always be at least one active Super Admin');
  }

  const before = { name: user.name, role: user.role, status: user.status };
  Object.assign(user, body);
  await user.save();

  if (body.status === 'disabled' || (body.role && body.role !== before.role)) {
    await revokeAllSessions(user._id, body.status === 'disabled' ? 'user-disabled' : 'role-changed');
  }
  await audit(req, 'user.updated', { target: user.email, meta: { before, after: body } });
  res.json({ user: user.toSafeJSON() });
});

router.post('/:id/unlock', async (req, res) => {
  const user = await loadUser(req.params.id);
  user.lockUntil = undefined;
  user.failedLoginCount = 0;
  await user.save();
  await audit(req, 'user.unlocked', { target: user.email });
  res.json({ user: user.toSafeJSON() });
});

router.post('/:id/reset-mfa', async (req, res) => {
  const user = await loadUser(req.params.id);
  if (user._id.equals(req.user._id)) throw badRequest('Use your own Security page to manage your two-factor authentication');
  user.mfa = { enabled: false };
  await user.save();
  await revokeAllSessions(user._id, 'mfa-reset-by-admin');
  await audit(req, 'user.mfa_reset', { target: user.email });
  res.json({ user: user.toSafeJSON() });
});

router.post('/:id/sign-out', async (req, res) => {
  const user = await loadUser(req.params.id);
  await revokeAllSessions(user._id, 'signed-out-by-admin', user._id.equals(req.user._id) ? req.session._id : undefined);
  await audit(req, 'user.signed_out', { target: user.email });
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  const user = await loadUser(req.params.id);
  if (user.status !== 'invited') throw badRequest('Active users cannot be deleted — disable them instead to keep the audit trail');
  await UserToken.deleteMany({ user: user._id });
  await user.deleteOne();
  await audit(req, 'user.invite_revoked', { target: user.email });
  res.json({ ok: true });
});

export default router;
