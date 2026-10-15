import { config } from '../config.js';
import { forbidden, unauthorized } from '../lib/http.js';
import { can } from '../lib/permissions.js';
import { readAccessCookie, verifyAccess } from '../lib/sessions.js';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';

// Verifies the access cookie AND re-checks the session and user in the database,
// so revoking a session, disabling a user or changing a role applies immediately.
export async function requireAuth(req, res, next) {
  const token = readAccessCookie(req);
  if (!token) throw unauthorized();

  let payload;
  try {
    payload = verifyAccess(token);
  } catch {
    throw unauthorized('Session expired', 'TOKEN_EXPIRED');
  }

  const [session, user] = await Promise.all([Session.findById(payload.sid), User.findById(payload.sub)]);
  if (!session || !session.isActive(config.sessionIdleMs) || !session.user.equals(payload.sub)) {
    throw unauthorized('Session ended. Please sign in again.', 'SESSION_ENDED');
  }
  if (!user || user.status !== 'active') throw unauthorized('Account is disabled', 'SESSION_ENDED');

  req.user = user;
  req.session = session;

  // Super admins must have MFA. Until they enrol, only the MFA setup routes work.
  if (user.role === 'superadmin' && !user.mfa?.enabled && !req.allowWithoutMfa) {
    throw forbidden('Set up two-factor authentication to continue', 'MFA_SETUP_REQUIRED');
  }
  next();
}

// Marks a route as usable before mandatory MFA enrolment (place before requireAuth).
export function allowWithoutMfa(req, res, next) {
  req.allowWithoutMfa = true;
  next();
}

export const requirePermission = (...permissions) => (req, res, next) => {
  if (!req.user) throw unauthorized();
  if (!permissions.some((p) => can(req.user.role, p))) throw forbidden();
  next();
};

// CSRF defence in depth on top of SameSite=strict cookies: browsers cannot add
// custom headers to cross-site requests without a CORS preflight we never allow.
export function requireCsrfHeader(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('x-requested-with') !== 'walnut-admin') throw forbidden('Missing request header', 'CSRF');
  next();
}
