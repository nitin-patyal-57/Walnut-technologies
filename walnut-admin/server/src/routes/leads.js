import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { audit } from '../lib/audit.js';
import { deleteFile, streamFile } from '../lib/gridfs.js';
import { badRequest, forbidden, notFound, parse } from '../lib/http.js';
import { can } from '../lib/permissions.js';
import { requirePermission } from '../middleware/auth.js';
import { LEAD_STATUSES, LEAD_TYPES, Lead } from '../models/Lead.js';
import { User } from '../models/User.js';

const router = Router();

// Sales sees enquiries, HR sees job applications, Super Admin sees everything.
function readableTypes(role) {
  const types = [];
  if (can(role, 'leads:read')) types.push('contact', 'quote', 'resource');
  if (can(role, 'applications:read')) types.push('application');
  return types;
}

function assertCan(role, lead, action) {
  const perm = lead.type === 'application' ? `applications:${action}` : `leads:${action}`;
  if (!can(role, perm)) throw forbidden();
}

async function loadLead(req, action) {
  const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
  if (!lead) throw notFound('Lead not found');
  assertCan(req.user.role, lead, action);
  return lead;
}

const listQuery = z.object({
  type: z.enum(LEAD_TYPES).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  assigned: z.string().optional(), // user id, "me" or "none"
  q: z.string().trim().max(100).optional(),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

function buildFilter(req, query) {
  const allowed = readableTypes(req.user.role);
  if (!allowed.length) throw forbidden();
  if (query.type && !allowed.includes(query.type)) throw forbidden();

  const filter = { type: query.type || { $in: allowed } };
  if (query.status) filter.status = query.status;
  else filter.status = { $ne: 'spam' };
  if (query.assigned === 'me') filter.assignedTo = req.user._id;
  else if (query.assigned === 'none') filter.assignedTo = null;
  else if (query.assigned && mongoose.isValidObjectId(query.assigned)) filter.assignedTo = query.assigned;
  if (query.q) filter.$text = { $search: query.q };
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lt = new Date(new Date(query.to).getTime() + 86400000);
  }
  return filter;
}

const summary = (l) => ({
  id: l._id,
  type: l.type,
  status: l.status,
  name: l.name,
  email: l.email,
  company: l.company,
  subject: l.subject || l.jobTitle || l.resourceTitle,
  assignedTo: l.assignedTo ? { id: l.assignedTo._id, name: l.assignedTo.name } : null,
  hasResume: Boolean(l.resume?.fileId),
  createdAt: l.createdAt,
});

router.get('/', async (req, res) => {
  const query = parse(listQuery, req.query);
  const filter = buildFilter(req, query);
  const [items, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit).populate('assignedTo', 'name'),
    Lead.countDocuments(filter),
  ]);
  res.json({ leads: items.map(summary), total, page: query.page, pages: Math.max(1, Math.ceil(total / query.limit)) });
});

router.get('/assignees', async (req, res) => {
  if (!readableTypes(req.user.role).length) throw forbidden();
  const users = await User.find({ status: 'active', role: { $in: ['superadmin', 'sales', 'hr'] } }, 'name role').sort({ name: 1 });
  res.json({ users: users.map((u) => ({ id: u._id, name: u.name, role: u.role })) });
});

function csvCell(value) {
  let s = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
}

router.get('/export.csv', async (req, res) => {
  const query = parse(listQuery, req.query);
  const filter = buildFilter(req, query);
  const leads = await Lead.find(filter).sort({ createdAt: -1 }).limit(10000).populate('assignedTo', 'name');
  const cols = ['createdAt', 'type', 'status', 'name', 'email', 'phone', 'company', 'subject', 'quantity', 'resourceTitle', 'jobTitle', 'message', 'assignedTo'];
  const rows = leads.map((l) => cols.map((c) => csvCell(
    c === 'assignedTo' ? l.assignedTo?.name : c === 'createdAt' ? l.createdAt.toISOString() : l[c],
  )).join(','));

  await audit(req, 'leads.exported', { meta: { count: leads.length, filter: req.query } });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="walnut-leads-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send('﻿' + [cols.join(','), ...rows].join('\r\n'));
});

router.get('/:id', async (req, res) => {
  const lead = await loadLead(req, 'read');
  res.json({
    lead: {
      ...lead.toObject(),
      id: lead._id,
      resume: lead.resume?.fileId ? { filename: lead.resume.filename, size: lead.resume.size } : null,
      assignedTo: lead.assignedTo ? { id: lead.assignedTo._id, name: lead.assignedTo.name } : null,
    },
    canManage: can(req.user.role, lead.type === 'application' ? 'applications:manage' : 'leads:manage'),
  });
});

router.patch('/:id', async (req, res) => {
  const body = parse(
    z.object({ status: z.enum(LEAD_STATUSES).optional(), assignedTo: z.string().nullable().optional() }),
    req.body,
  );
  const lead = await loadLead(req, 'manage');
  const before = { status: lead.status, assignedTo: lead.assignedTo?._id?.toString() || null };

  if (body.status) lead.status = body.status;
  if (body.assignedTo !== undefined) {
    if (body.assignedTo && !(await User.exists({ _id: body.assignedTo, status: 'active' }))) throw badRequest('Unknown user');
    lead.assignedTo = body.assignedTo || null;
  }
  await lead.save();
  await audit(req, 'lead.updated', { target: lead._id.toString(), meta: { before, after: body } });
  res.json({ ok: true });
});

router.post('/:id/notes', async (req, res) => {
  const { text } = parse(z.object({ text: z.string().trim().min(1).max(2000) }), req.body);
  const lead = await loadLead(req, 'manage');
  lead.notes.push({ author: req.user._id, authorName: req.user.name, text });
  await lead.save();
  await audit(req, 'lead.note_added', { target: lead._id.toString() });
  res.status(201).json({ notes: lead.notes });
});

router.get('/:id/resume', async (req, res) => {
  const lead = await loadLead(req, 'read');
  if (!lead.resume?.fileId) throw notFound('No resume attached');
  await audit(req, 'lead.resume_downloaded', { target: lead._id.toString() });
  const safeName = (lead.resume.filename || 'resume').replace(/[^\w.\- ]/g, '_');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  streamFile('resumes', lead.resume.fileId).on('error', () => res.status(404).end()).pipe(res);
});

router.delete('/:id', requirePermission('leads:delete'), async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw notFound('Lead not found');
  if (lead.resume?.fileId) await deleteFile('resumes', lead.resume.fileId);
  await lead.deleteOne();
  await audit(req, 'lead.deleted', { target: lead._id.toString(), meta: { type: lead.type, email: lead.email } });
  res.json({ ok: true });
});

export default router;
