import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { config } from '../config.js';
import { audit } from '../lib/audit.js';
import { randomToken, sha256 } from '../lib/crypto.js';
import { badRequest, clientIp, forbidden, parse, unauthorized } from '../lib/http.js';
import { resetEmail, sendMail } from '../lib/mailer.js';
import { createEnrolment, generateRecoveryCodes, normalizeRecoveryCode, verifyTotp } from '../lib/mfa.js';
import { checkPasswordPolicy, hashPassword, verifyPassword } from '../lib/password.js';
import { permissionsFor } from '../lib/permissions.js';
import {
  clearAuthCookies, readRefreshCookie, revokeAllSessions, revokeSession, rotateSession,
  signMfaChallenge, startSession, verifyMfaChallenge,
} from '../lib/sessions.js';
import { allowWithoutMfa, requireAuth } from '../middleware/auth.js';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';
import { UserToken } from '../models/UserToken.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Try again in 15 minutes.', code: 'RATE_LIMITED' },
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.', code: 'RATE_LIMITED' },
});

const INVALID_LOGIN = 'Invalid email or password';
const email = z.string().trim().toLowerCase().email().max(254);

const withSecrets = (query) => query.select('+passwordHash +mfa.secretEnc +mfa.pendingSecretEnc +mfa.recoveryCodeHashes +mfa.lastUsedStep');

function profile(user) {
  return {
    ...user.toSafeJSON(),
    permissions: permissionsFor(user.role),
    mfaSetupRequired: user.role === 'superadmin' && !user.mfa?.enabled,
  };
}

async function registerFailure(req, user, reason) {
  user.failedLoginCount = (user.failedLoginCount || 0) + 1;
  if (user.failedLoginCount >= config.maxFailedLogins) {
    user.lockUntil = new Date(Date.now() + config.lockoutMs);
    user.failedLoginCount = 0;
    await audit(req, 'auth.locked', { actor: user, meta: { reason } });
  }
  await user.save();
  await audit(req, 'auth.login_failed', { actor: user, meta: { reason } });
}

async function completeLogin(req, res, user) {
  user.failedLoginCount = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();
  user.lastLoginIp = clientIp(req);
  await user.save();
  await startSession(req, res, user);
  await audit(req, 'auth.login', { actor: user });
  res.json({ user: profile(user) });
}

// ─── Sign in ──────────────────────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
  const body = parse(z.object({ email, password: z.string().min(1).max(200) }), req.body);
  const user = await withSecrets(User.findOne({ email: body.email }));

  // Always run bcrypt so response time doesn't reveal whether the email exists.
  const passwordOk = await verifyPassword(body.password, user?.passwordHash);

  if (!user || user.status !== 'active') {
    if (user) await audit(req, 'auth.login_failed', { actor: user, meta: { reason: user.status } });
    throw unauthorized(INVALID_LOGIN, 'INVALID_CREDENTIALS');
  }
  if (user.isLocked()) {
    throw unauthorized('Account temporarily locked after too many failed attempts. Try again in 15 minutes.', 'LOCKED');
  }
  if (!passwordOk) {
    await registerFailure(req, user, 'bad-password');
    throw unauthorized(INVALID_LOGIN, 'INVALID_CREDENTIALS');
  }

  if (user.mfa?.enabled) {
    return res.json({ mfaRequired: true, challenge: signMfaChallenge(user) });
  }
  await completeLogin(req, res, user);
});

router.post('/login/mfa', loginLimiter, async (req, res) => {
  const body = parse(
    z.object({ challenge: z.string().max(1000), code: z.string().max(20).optional(), recoveryCode: z.string().max(20).optional() }),
    req.body,
  );

  let userId;
  try {
    userId = verifyMfaChallenge(body.challenge);
  } catch {
    throw unauthorized('Sign-in expired. Please start again.', 'CHALLENGE_EXPIRED');
  }

  const user = await withSecrets(User.findById(userId));
  if (!user || user.status !== 'active' || !user.mfa?.enabled) throw unauthorized(INVALID_LOGIN);
  if (user.isLocked()) throw unauthorized('Account temporarily locked. Try again in 15 minutes.', 'LOCKED');

  if (body.recoveryCode) {
    const hash = sha256(normalizeRecoveryCode(body.recoveryCode));
    const idx = user.mfa.recoveryCodeHashes.indexOf(hash);
    if (idx === -1) {
      await registerFailure(req, user, 'bad-recovery-code');
      throw unauthorized('Invalid recovery code', 'INVALID_CODE');
    }
    user.mfa.recoveryCodeHashes.splice(idx, 1);
    await audit(req, 'auth.recovery_code_used', { actor: user, meta: { remaining: user.mfa.recoveryCodeHashes.length } });
  } else {
    const step = verifyTotp(body.code, user.mfa.secretEnc, user.mfa.lastUsedStep);
    if (step === null) {
      await registerFailure(req, user, 'bad-mfa-code');
      throw unauthorized('Invalid code', 'INVALID_CODE');
    }
    user.mfa.lastUsedStep = step;
  }
  await completeLogin(req, res, user);
});

router.post('/refresh', async (req, res) => {
  try {
    const { user } = await rotateSession(req, res, (id) => User.findById(id));
    res.json({ user: profile(user) });
  } catch (reason) {
    if (reason instanceof Error) throw reason;
    clearAuthCookies(res);
    if (reason === 'reuse') console.warn('[auth] refresh token reuse detected from', clientIp(req));
    throw unauthorized('Session ended. Please sign in again.', 'SESSION_ENDED');
  }
});

router.post('/logout', async (req, res) => {
  const token = readRefreshCookie(req);
  if (token) {
    const session = await Session.findOne({ tokenHash: sha256(token) }).populate('user');
    if (session) {
      await revokeSession(session._id, 'logout');
      await audit(req, 'auth.logout', { actor: session.user });
    }
  }
  clearAuthCookies(res);
  res.json({ ok: true });
});

router.get('/me', allowWithoutMfa, requireAuth, (req, res) => {
  res.json({ user: profile(req.user) });
});

// ─── Password reset ───────────────────────────────────────────────────
router.post('/forgot', emailLimiter, async (req, res) => {
  const body = parse(z.object({ email }), req.body);
  const user = await User.findOne({ email: body.email, status: 'active' });
  if (user) {
    const token = randomToken();
    await UserToken.create({ user: user._id, type: 'reset', tokenHash: sha256(token), expiresAt: new Date(Date.now() + config.resetTtlMs) });
    const link = `${config.appUrl}${config.adminPath}/reset-password?token=${token}`;
    await sendMail({ to: user.email, ...resetEmail({ name: user.name, link }) });
    await audit(req, 'auth.reset_requested', { actor: user });
  }
  // Same answer either way so this can't be used to discover accounts.
  res.json({ ok: true, message: 'If that email belongs to an account, a reset link has been sent.' });
});

async function consumeToken(type, token) {
  const record = await UserToken.findOne({ tokenHash: sha256(token || ''), type });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw badRequest('This link is invalid or has expired. Ask for a new one.', 'TOKEN_INVALID');
  }
  const user = await User.findById(record.user);
  if (!user || user.status === 'disabled') throw badRequest('This account is disabled.', 'TOKEN_INVALID');
  return { record, user };
}

router.post('/reset', loginLimiter, async (req, res) => {
  const body = parse(z.object({ token: z.string().max(200), password: z.string().max(200) }), req.body);
  const { record, user } = await consumeToken('reset', body.token);
  const problem = checkPasswordPolicy(body.password, user.email);
  if (problem) throw badRequest(problem, 'WEAK_PASSWORD');

  user.passwordHash = await hashPassword(body.password);
  user.passwordChangedAt = new Date();
  user.failedLoginCount = 0;
  user.lockUntil = undefined;
  await user.save();
  record.usedAt = new Date();
  await record.save();
  await revokeAllSessions(user._id, 'password-reset');
  await audit(req, 'auth.password_reset', { actor: user });
  res.json({ ok: true });
});

// ─── Invitations ──────────────────────────────────────────────────────
router.get('/invite/:token', async (req, res) => {
  const { user } = await consumeToken('invite', req.params.token);
  res.json({ name: user.name, email: user.email });
});

router.post('/accept-invite', loginLimiter, async (req, res) => {
  const body = parse(z.object({ token: z.string().max(200), password: z.string().max(200) }), req.body);
  const { record, user } = await consumeToken('invite', body.token);
  if (user.status !== 'invited') throw badRequest('This invitation was already used.', 'TOKEN_INVALID');
  const problem = checkPasswordPolicy(body.password, user.email);
  if (problem) throw badRequest(problem, 'WEAK_PASSWORD');

  user.passwordHash = await hashPassword(body.password);
  user.passwordChangedAt = new Date();
  user.status = 'active';
  await user.save();
  record.usedAt = new Date();
  await record.save();
  await audit(req, 'auth.invite_accepted', { actor: user });
  await completeLogin(req, res, user);
});

// ─── Signed-in account security ───────────────────────────────────────
router.post('/password', requireAuth, async (req, res) => {
  const body = parse(z.object({ currentPassword: z.string().max(200), newPassword: z.string().max(200) }), req.body);
  const user = await withSecrets(User.findById(req.user._id));
  if (!(await verifyPassword(body.currentPassword, user.passwordHash))) {
    throw badRequest('Current password is incorrect', 'INVALID_CREDENTIALS');
  }
  const problem = checkPasswordPolicy(body.newPassword, user.email);
  if (problem) throw badRequest(problem, 'WEAK_PASSWORD');

  user.passwordHash = await hashPassword(body.newPassword);
  user.passwordChangedAt = new Date();
  await user.save();
  await revokeAllSessions(user._id, 'password-changed', req.session._id);
  await audit(req, 'auth.password_changed');
  res.json({ ok: true });
});

router.post('/mfa/setup', allowWithoutMfa, requireAuth, async (req, res) => {
  if (req.user.mfa?.enabled) throw badRequest('Two-factor authentication is already on');
  const { secret, secretEnc, qrDataUrl } = await createEnrolment(req.user.email);
  await User.updateOne({ _id: req.user._id }, { 'mfa.pendingSecretEnc': secretEnc });
  res.json({ qrDataUrl, secret });
});

router.post('/mfa/enable', allowWithoutMfa, requireAuth, async (req, res) => {
  const body = parse(z.object({ code: z.string().max(10) }), req.body);
  const user = await withSecrets(User.findById(req.user._id));
  if (!user.mfa.pendingSecretEnc) throw badRequest('Start the setup again');
  const step = verifyTotp(body.code, user.mfa.pendingSecretEnc);
  if (step === null) throw badRequest('That code is not correct. Check your phone clock and try again.', 'INVALID_CODE');

  const { codes, hashes } = generateRecoveryCodes();
  user.mfa.enabled = true;
  user.mfa.secretEnc = user.mfa.pendingSecretEnc;
  user.mfa.pendingSecretEnc = undefined;
  user.mfa.recoveryCodeHashes = hashes;
  user.mfa.lastUsedStep = step;
  await user.save();
  await revokeAllSessions(user._id, 'mfa-enabled', req.session._id);
  await audit(req, 'auth.mfa_enabled');
  res.json({ recoveryCodes: codes, user: profile(user) });
});

router.post('/mfa/disable', requireAuth, async (req, res) => {
  if (req.user.role === 'superadmin') throw forbidden('Two-factor authentication is mandatory for Super Admins');
  const body = parse(z.object({ password: z.string().max(200), code: z.string().max(10) }), req.body);
  const user = await withSecrets(User.findById(req.user._id));
  if (!(await verifyPassword(body.password, user.passwordHash))) throw badRequest('Password is incorrect');
  if (verifyTotp(body.code, user.mfa.secretEnc, user.mfa.lastUsedStep) === null) throw badRequest('Invalid code');

  user.mfa = { enabled: false };
  await user.save();
  await audit(req, 'auth.mfa_disabled');
  res.json({ user: profile(user) });
});

router.post('/mfa/recovery-codes', requireAuth, async (req, res) => {
  const body = parse(z.object({ code: z.string().max(10) }), req.body);
  const user = await withSecrets(User.findById(req.user._id));
  if (!user.mfa?.enabled) throw badRequest('Two-factor authentication is off');
  const step = verifyTotp(body.code, user.mfa.secretEnc, user.mfa.lastUsedStep);
  if (step === null) throw badRequest('Invalid code');

  const { codes, hashes } = generateRecoveryCodes();
  user.mfa.recoveryCodeHashes = hashes;
  user.mfa.lastUsedStep = step;
  await user.save();
  await audit(req, 'auth.recovery_codes_regenerated');
  res.json({ recoveryCodes: codes });
});

router.get('/sessions', requireAuth, async (req, res) => {
  const sessions = await Session.find({ user: req.user._id, revokedAt: null, expiresAt: { $gt: new Date() } }).sort({ lastUsedAt: -1 });
  res.json({
    sessions: sessions
      .filter((s) => s.isActive(config.sessionIdleMs))
      .map((s) => ({
        id: s._id,
        ip: s.ip,
        userAgent: s.userAgent,
        createdAt: s.createdAt,
        lastUsedAt: s.lastUsedAt,
        current: s._id.equals(req.session._id),
      })),
  });
});

router.delete('/sessions/:id', requireAuth, async (req, res) => {
  await Session.updateOne({ _id: req.params.id, user: req.user._id, revokedAt: null }, { revokedAt: new Date(), revokeReason: 'signed-out-remotely' });
  await audit(req, 'auth.session_revoked', { target: req.params.id });
  res.json({ ok: true });
});

export default router;
