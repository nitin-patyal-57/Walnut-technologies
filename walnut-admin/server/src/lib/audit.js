import { AuditLog } from '../models/AuditLog.js';
import { clientIp } from './http.js';

// Records who did what. Never throws — auditing must not break the action.
export async function audit(req, action, { target, meta, actor } = {}) {
  const user = actor || req.user;
  try {
    await AuditLog.create({
      actor: user?._id,
      actorEmail: user?.email,
      action,
      target,
      meta,
      ip: clientIp(req),
      userAgent: req.get('user-agent')?.slice(0, 300),
    });
  } catch (err) {
    console.error('[audit] failed to write', action, err.message);
  }
}
