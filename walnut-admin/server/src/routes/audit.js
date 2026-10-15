import { Router } from 'express';
import { z } from 'zod';
import { parse } from '../lib/http.js';
import { requirePermission } from '../middleware/auth.js';
import { AuditLog } from '../models/AuditLog.js';

const router = Router();
router.use(requirePermission('audit:read'));

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res) => {
  const query = parse(
    z.object({
      action: z.string().trim().max(60).optional(),
      actor: z.string().trim().max(254).optional(),
      page: z.coerce.number().int().min(1).default(1),
    }),
    req.query,
  );
  const limit = 50;
  const filter = {};
  if (query.action) filter.action = { $regex: `^${escape(query.action)}` };
  if (query.actor) filter.actorEmail = { $regex: escape(query.actor), $options: 'i' };

  const [items, total] = await Promise.all([
    AuditLog.find(filter).sort({ at: -1 }).skip((query.page - 1) * limit).limit(limit),
    AuditLog.countDocuments(filter),
  ]);
  res.json({ entries: items, total, page: query.page, pages: Math.max(1, Math.ceil(total / limit)) });
});

export default router;
