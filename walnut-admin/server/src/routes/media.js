import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { z } from 'zod';
import { config } from '../config.js';
import { audit } from '../lib/audit.js';
import { deleteFile, saveBuffer } from '../lib/gridfs.js';
import { badRequest, notFound, parse } from '../lib/http.js';
import { requirePermission } from '../middleware/auth.js';
import { Content } from '../models/Content.js';
import { Media } from '../models/Media.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
});

const MAX_WIDTH = 2400;

export const mediaUrl = (m) => `${config.appUrl}/media/${m._id}/${m.filename}`;

const toJSON = (m) => ({
  id: m._id,
  url: mediaUrl(m),
  filename: m.filename,
  originalName: m.originalName,
  alt: m.alt,
  width: m.width,
  height: m.height,
  size: m.size,
  uploadedByName: m.uploadedByName,
  createdAt: m.createdAt,
});

function slugify(name) {
  return name
    .replace(/\.[a-z0-9]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';
}

router.get('/', requirePermission('media:read'), async (req, res) => {
  const { q, page } = parse(
    z.object({ q: z.string().trim().max(100).optional(), page: z.coerce.number().int().min(1).default(1) }),
    req.query,
  );
  const limit = 48;
  const filter = q ? { $or: [{ originalName: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }, { alt: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }] } : {};
  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Media.countDocuments(filter),
  ]);
  res.json({ media: items.map(toJSON), total, page, pages: Math.max(1, Math.ceil(total / limit)) });
});

// Every upload is decoded by sharp (rejects anything that isn't a real image),
// auto-rotated, stripped of metadata, capped at 2400px and stored as WebP.
router.post('/', requirePermission('media:manage'), upload.single('file'), async (req, res) => {
  if (!req.file) throw badRequest('Choose an image to upload');

  let output;
  try {
    output = await sharp(req.file.buffer, { limitInputPixels: 50_000_000 })
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw badRequest('That file is not a supported image (use JPG, PNG, WebP, AVIF or GIF)');
  }

  const filename = `${slugify(req.file.originalname)}.webp`;
  const fileId = await saveBuffer('media', filename, output.data, 'image/webp');
  const media = await Media.create({
    fileId,
    filename,
    originalName: req.file.originalname.slice(0, 200),
    alt: String(req.body.alt || '').slice(0, 200),
    width: output.info.width,
    height: output.info.height,
    size: output.info.size,
    uploadedBy: req.user._id,
    uploadedByName: req.user.name,
  });
  await audit(req, 'media.uploaded', { target: media._id.toString(), meta: { filename } });
  res.status(201).json({ media: toJSON(media) });
});

router.patch('/:id', requirePermission('media:manage'), async (req, res) => {
  const { alt } = parse(z.object({ alt: z.string().trim().max(200) }), req.body);
  const media = await Media.findByIdAndUpdate(req.params.id, { alt }, { new: true });
  if (!media) throw notFound();
  res.json({ media: toJSON(media) });
});

router.delete('/:id', requirePermission('media:manage'), async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw notFound();

  // Refuse to delete an image the website still uses.
  const needle = `/media/${media._id}/`;
  const docs = await Content.find({}, { key: 1, draft: 1, published: 1 });
  const usedIn = docs.filter((d) => JSON.stringify([d.draft, d.published]).includes(needle)).map((d) => d.key);
  if (usedIn.length) {
    throw badRequest(`This image is still used in: ${usedIn.join(', ')}. Replace it there first.`, 'IN_USE');
  }

  await deleteFile('media', media.fileId);
  await media.deleteOne();
  await audit(req, 'media.deleted', { target: media._id.toString(), meta: { filename: media.filename } });
  res.json({ ok: true });
});

export default router;
