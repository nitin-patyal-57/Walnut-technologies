import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { config } from '../config.js';
import { safeEqual } from '../lib/crypto.js';
import { saveBuffer, streamFile } from '../lib/gridfs.js';
import { forbidden, notFound, parse } from '../lib/http.js';
import { publishedSnapshot } from '../lib/content.js';
import { LEAD_TYPES, Lead } from '../models/Lead.js';
import { Media } from '../models/Media.js';

// ─── /api/public — called by the website, not by the admin UI ─────────
export const publicApi = Router();

publicApi.use((req, res, next) => {
  const origin = req.get('origin');
  if (origin && config.publicCorsOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  next();
});

// Published content only — drafts never leave the admin.
// The website build (scripts/fetch-content.mjs) calls this.
publicApi.get('/content', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ generatedAt: new Date().toISOString(), content: await publishedSnapshot() });
});

const ingestLimiter = rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: 'draft-7', legacyHeaders: false });

const optional = (max) => z.string().trim().max(max).optional().default('');
const leadInput = z.object({
  type: z.enum(LEAD_TYPES),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: optional(20),
  company: optional(100),
  subject: optional(200),
  message: optional(4000),
  quantity: optional(50),
  resourceTitle: optional(200),
  jobTitle: optional(200),
  ip: optional(60),
  resume: z
    .object({ filename: z.string().max(200), content: z.string().max(4.5 * 1024 * 1024) })
    .nullable()
    .optional(),
});

// Server-to-server: the website's /api/contact function forwards each
// submission here with the shared LEADS_INGEST_KEY.
publicApi.post('/leads', ingestLimiter, express.json({ limit: '6mb' }), async (req, res) => {
  if (!safeEqual(req.get('x-ingest-key') || '', config.leadsIngestKey)) throw forbidden('Invalid ingest key');
  const { resume, ...data } = parse(leadInput, req.body);

  let resumeRef;
  if (resume?.content) {
    const buffer = Buffer.from(resume.content, 'base64');
    const filename = resume.filename.replace(/[^\w.\- ]/g, '_').slice(0, 120) || 'resume';
    const fileId = await saveBuffer('resumes', filename, buffer, 'application/octet-stream');
    resumeRef = { fileId, filename, size: buffer.length };
  }

  const lead = await Lead.create({ ...data, resume: resumeRef });
  res.status(201).json({ ok: true, id: lead._id });
});

// ─── /media/:id/:filename — public image delivery for the website ─────
export const mediaFiles = Router();

mediaFiles.get('/:id/:filename', async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw notFound();
  res.setHeader('Content-Type', media.contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  streamFile('media', media.fileId).on('error', () => res.status(404).end()).pipe(res);
});
