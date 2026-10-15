import { Router } from 'express';
import { z } from 'zod';
import { audit } from '../lib/audit.js';
import { loadAllContent, publishedSnapshot, same, triggerDeploy } from '../lib/content.js';
import { badRequest, conflict, notFound, parse } from '../lib/http.js';
import { COLLECTIONS, getCollection, validateCollection } from '../content/schemas.js';
import { requirePermission } from '../middleware/auth.js';
import { Content, ContentVersion } from '../models/Content.js';

const router = Router();

function definitionOr404(key) {
  const def = getCollection(key);
  if (!def) throw notFound('Unknown content section');
  return def;
}

const countOf = (def, value) => (def.kind === 'list' ? (value || []).length : null);

router.get('/schemas', requirePermission('content:read'), (req, res) => {
  res.json({ collections: COLLECTIONS });
});

router.get('/', requirePermission('content:read'), async (req, res) => {
  const docs = await loadAllContent();
  res.json({
    collections: COLLECTIONS.map((def) => {
      const doc = docs.get(def.key);
      return {
        key: def.key,
        label: def.label,
        group: def.group,
        kind: def.kind,
        description: def.description,
        count: countOf(def, doc?.draft),
        changed: doc ? !same(doc.draft, doc.published) : false,
        draftUpdatedAt: doc?.draftUpdatedAt,
        publishedAt: doc?.publishedAt,
      };
    }),
  });
});

router.get('/versions', requirePermission('content:read'), async (req, res) => {
  const versions = await ContentVersion.find({}, { snapshot: 0 }).sort({ createdAt: -1 }).limit(50);
  res.json({ versions });
});

router.post('/publish', requirePermission('content:publish'), async (req, res) => {
  const { note } = parse(z.object({ note: z.string().trim().max(300).optional() }), req.body || {});
  const docs = await loadAllContent();
  const changed = [...docs.values()].filter((d) => !same(d.draft, d.published));
  if (!changed.length) throw badRequest('There are no unpublished changes', 'NOTHING_TO_PUBLISH');

  const now = new Date();
  for (const doc of changed) {
    doc.published = doc.draft;
    doc.publishedAt = now;
    doc.markModified('published');
    await doc.save();
  }

  const deploy = await triggerDeploy();
  const version = await ContentVersion.create({
    snapshot: await publishedSnapshot(),
    changedKeys: changed.map((d) => d.key),
    note,
    publishedBy: req.user._id,
    publishedByName: req.user.name,
    deploy,
  });
  await audit(req, 'content.published', { target: version._id.toString(), meta: { changed: version.changedKeys, deploy: deploy.status } });
  res.json({ version: { ...version.toObject(), snapshot: undefined }, deploy });
});

router.post('/versions/:id/restore', requirePermission('content:publish'), async (req, res) => {
  const source = await ContentVersion.findById(req.params.id);
  if (!source) throw notFound('Version not found');

  const docs = await loadAllContent();
  const changedKeys = [];
  const now = new Date();
  for (const def of COLLECTIONS) {
    if (!(def.key in source.snapshot)) continue;
    const value = source.snapshot[def.key];
    const doc = docs.get(def.key) || new Content({ key: def.key });
    if (!same(doc.published, value) || !same(doc.draft, value)) changedKeys.push(def.key);
    doc.published = value;
    doc.draft = value;
    doc.publishedAt = now;
    doc.draftUpdatedAt = now;
    doc.draftUpdatedBy = req.user._id;
    doc.markModified('published');
    doc.markModified('draft');
    await doc.save();
  }

  const deploy = await triggerDeploy();
  const version = await ContentVersion.create({
    snapshot: await publishedSnapshot(),
    changedKeys,
    note: `Restored version from ${source.createdAt.toISOString().slice(0, 16).replace('T', ' ')}`,
    publishedBy: req.user._id,
    publishedByName: req.user.name,
    restoredFrom: source._id,
    deploy,
  });
  await audit(req, 'content.restored', { target: source._id.toString(), meta: { changed: changedKeys, deploy: deploy.status } });
  res.json({ version: { ...version.toObject(), snapshot: undefined }, deploy });
});

router.get('/:key', requirePermission('content:read'), async (req, res) => {
  const def = definitionOr404(req.params.key);
  const doc = await Content.findOne({ key: def.key });
  const empty = def.kind === 'list' ? [] : {};
  res.json({
    definition: def,
    draft: doc?.draft ?? empty,
    published: doc?.published ?? empty,
    changed: doc ? !same(doc.draft, doc.published) : false,
    draftUpdatedAt: doc?.draftUpdatedAt,
    publishedAt: doc?.publishedAt,
  });
});

router.put('/:key', requirePermission('content:edit'), async (req, res) => {
  const def = definitionOr404(req.params.key);
  const { data, error } = validateCollection(def, req.body?.data);
  if (error) throw badRequest(error, 'VALIDATION');

  // Optimistic locking: the client echoes the draftUpdatedAt it loaded. If the
  // draft moved on underneath (another editor saved, published or restored),
  // answer 409 instead of silently overwriting their work. Every writer must
  // send the field — omitting it is a client bug, not "overwrite anything".
  if (!req.body || !('baseUpdatedAt' in req.body)) {
    throw badRequest('baseUpdatedAt is required — send the draftUpdatedAt you loaded, or null for a never-saved section', 'VALIDATION');
  }
  const base = req.body.baseUpdatedAt;
  if (base !== null && typeof base !== 'string') {
    throw badRequest('baseUpdatedAt must be an ISO date or null', 'VALIDATION');
  }
  const baseDate = base === null ? null : new Date(base);
  if (baseDate !== null && Number.isNaN(baseDate.getTime())) {
    throw badRequest('baseUpdatedAt must be an ISO date or null', 'VALIDATION');
  }

  let doc;
  try {
    // Compare-and-swap: the filter carries the version the editor loaded, so a
    // concurrent save can never be silently clobbered (duplicate key on `key`
    // means someone else holds a different version → 409 below).
    doc = await Content.findOneAndUpdate(
      { key: def.key, draftUpdatedAt: baseDate },
      { $set: { draft: data, draftUpdatedAt: new Date(), draftUpdatedBy: req.user._id } },
      { new: true, upsert: true },
    );
  } catch (err) {
    if (err?.code !== 11000) throw err;
    const current = await Content.findOne({ key: def.key }).populate('draftUpdatedBy', 'name');
    throw conflict(
      `${current?.draftUpdatedBy?.name || 'Someone else'} saved this section while you were editing. Reload to get their version, or overwrite with yours.`,
      { draftUpdatedAt: current?.draftUpdatedAt ?? null, draftUpdatedBy: current?.draftUpdatedBy?.name || null },
    );
  }

  await audit(req, 'content.saved', { target: def.key, meta: { count: countOf(def, data) } });
  res.json({ draft: doc.draft, changed: !same(doc.draft, doc.published), draftUpdatedAt: doc.draftUpdatedAt });
});

router.post('/:key/discard', requirePermission('content:edit'), async (req, res) => {
  const def = definitionOr404(req.params.key);
  const doc = await Content.findOne({ key: def.key });
  if (!doc) throw notFound();
  doc.draft = doc.published;
  doc.draftUpdatedAt = new Date();
  doc.draftUpdatedBy = req.user._id;
  doc.markModified('draft');
  await doc.save();
  await audit(req, 'content.discarded', { target: def.key });
  res.json({ draft: doc.draft, changed: false });
});

export default router;
