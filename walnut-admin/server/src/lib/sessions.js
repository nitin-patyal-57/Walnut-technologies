import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { Session } from '../models/Session.js';
import { randomToken, sha256 } from './crypto.js';
import { clientIp } from './http.js';

const ACCESS_COOKIE = 'wa_access';
const REFRESH_COOKIE = 'wa_refresh';
const MFA_PURPOSE = 'mfa-challenge';

const cookieBase = () => ({
  httpOnly: true,
  secure: config.isProd,
  sameSite: 'strict',
});

// The cookie Path must match the path the browser actually requests. On the
// website's domain the API is served at /admin/api (see vercel.json), so scope
// the cookies there instead of the standalone /api mount.
const API_PATH = `${config.adminPath}/api`;

export function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_COOKIE, accessToken, { ...cookieBase(), path: API_PATH, maxAge: config.accessTokenTtlSec * 1000 });
  res.cookie(REFRESH_COOKIE, refreshToken, { ...cookieBase(), path: `${API_PATH}/auth`, maxAge: config.refreshTokenTtlMs });
}

export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE, { ...cookieBase(), path: API_PATH });
  res.clearCookie(REFRESH_COOKIE, { ...cookieBase(), path: `${API_PATH}/auth` });
}

export const readAccessCookie = (req) => req.cookies?.[ACCESS_COOKIE];
export const readRefreshCookie = (req) => req.cookies?.[REFRESH_COOKIE];

function signAccess(user, session) {
  return jwt.sign({ sid: session._id.toString(), role: user.role }, config.jwtAccessSecret, {
    subject: user._id.toString(),
    expiresIn: config.accessTokenTtlSec,
    algorithm: 'HS256',
  });
}

export function verifyAccess(token) {
  return jwt.verify(token, config.jwtAccessSecret, { algorithms: ['HS256'] });
}

// Creates a new browser session and sets cookies.
export async function startSession(req, res, user) {
  const refreshToken = randomToken(48);
  const session = await Session.create({
    user: user._id,
    tokenHash: sha256(refreshToken),
    expiresAt: new Date(Date.now() + config.refreshTokenTtlMs),
    ip: clientIp(req),
    userAgent: req.get('user-agent')?.slice(0, 300),
  });
  setAuthCookies(res, signAccess(user, session), refreshToken);
  return session;
}

// Rotates the refresh token. Returns { user, session } or throws a reason string.
export async function rotateSession(req, res, loadUser) {
  const token = readRefreshCookie(req);
  if (!token) throw 'missing';
  const hash = sha256(token);

  const session = await Session.findOne({ tokenHash: hash });
  if (!session) {
    // An already-rotated token was replayed: whoever holds it stole it.
    const reused = await Session.findOne({ prevTokenHash: hash, revokedAt: null });
    if (reused) {
      reused.revokedAt = new Date();
      reused.revokeReason = 'refresh-token-reuse';
      await reused.save();
      throw 'reuse';
    }
    throw 'unknown';
  }
  if (!session.isActive(config.sessionIdleMs)) throw 'expired';

  const user = await loadUser(session.user);
  if (!user || user.status !== 'active') {
    session.revokedAt = new Date();
    session.revokeReason = 'user-inactive';
    await session.save();
    throw 'inactive';
  }

  const next = randomToken(48);
  session.prevTokenHash = hash;
  session.tokenHash = sha256(next);
  session.lastUsedAt = new Date();
  await session.save();

  setAuthCookies(res, signAccess(user, session), next);
  return { user, session };
}

export async function revokeSession(sessionId, reason) {
  await Session.updateOne({ _id: sessionId, revokedAt: null }, { revokedAt: new Date(), revokeReason: reason });
}

export async function revokeAllSessions(userId, reason, exceptSessionId) {
  const filter = { user: userId, revokedAt: null };
  if (exceptSessionId) filter._id = { $ne: exceptSessionId };
  await Session.updateMany(filter, { revokedAt: new Date(), revokeReason: reason });
}

// Short-lived token proving the password step passed; exchanged for a session with a TOTP code.
export function signMfaChallenge(user) {
  return jwt.sign({ purpose: MFA_PURPOSE }, config.jwtAccessSecret, {
    subject: user._id.toString(),
    expiresIn: 5 * 60,
    algorithm: 'HS256',
  });
}

export function verifyMfaChallenge(token) {
  const payload = jwt.verify(token, config.jwtAccessSecret, { algorithms: ['HS256'] });
  if (payload.purpose !== MFA_PURPOSE) throw new Error('wrong token purpose');
  return payload.sub;
}
