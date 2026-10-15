import { Router } from 'express';
import { loadAllContent, same } from '../lib/content.js';
import { can } from '../lib/permissions.js';
import { AuditLog } from '../models/AuditLog.js';
import { ContentVersion } from '../models/Content.js';
import { Lead } from '../models/Lead.js';

const router = Router();

router.get('/', async (req, res) => {
  const role = req.user.role;
  const out = {};

  const types = [];
  if (can(role, 'leads:read')) types.push('contact', 'quote', 'resource');
  if (can(role, 'applications:read')) types.push('application');

  if (types.length) {
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const monthAgo = new Date(Date.now() - 30 * 86400000);
    const [byType, newCount, weekCount, daily, recent] = await Promise.all([
      Lead.aggregate([{ $match: { type: { $in: types }, status: 'new' } }, { $group: { _id: '$type', count: { $sum: 1 } } }]),
      Lead.countDocuments({ type: { $in: types }, status: 'new' }),
      Lead.countDocuments({ type: { $in: types }, createdAt: { $gte: weekAgo }, status: { $ne: 'spam' } }),
      Lead.aggregate([
        { $match: { type: { $in: types }, createdAt: { $gte: monthAgo }, status: { $ne: 'spam' } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Lead.find({ type: { $in: types }, status: { $ne: 'spam' } }).sort({ createdAt: -1 }).limit(6),
    ]);
    out.leads = {
      newCount,
      weekCount,
      newByType: Object.fromEntries(byType.map((b) => [b._id, b.count])),
      daily: daily.map((d) => ({ date: d._id, count: d.count })),
      recent: recent.map((l) => ({ id: l._id, type: l.type, name: l.name, company: l.company, subject: l.subject || l.jobTitle || l.resourceTitle, status: l.status, createdAt: l.createdAt })),
    };
  }

  if (can(role, 'content:read')) {
    const [docs, lastVersion] = await Promise.all([
      loadAllContent(),
      ContentVersion.findOne({}, { snapshot: 0 }).sort({ createdAt: -1 }),
    ]);
    out.content = {
      pendingChanges: [...docs.values()].filter((d) => !same(d.draft, d.published)).map((d) => d.key),
      lastPublish: lastVersion ? { at: lastVersion.createdAt, by: lastVersion.publishedByName, deploy: lastVersion.deploy } : null,
    };
  }

  if (can(role, 'audit:read')) {
    const recent = await AuditLog.find().sort({ at: -1 }).limit(8);
    out.activity = recent.map((a) => ({ id: a._id, at: a.at, actorEmail: a.actorEmail, action: a.action, target: a.target }));
  }

  res.json(out);
});

export default router;
