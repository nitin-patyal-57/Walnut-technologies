import { useState } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiRotateCcw, FiUploadCloud } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import { Alert, Badge, Button, Card, ConfirmModal, EmptyState, PageHeader, PageLoader, useToast } from '../components/ui';
import { api } from '../lib/api';
import { fmtDateTime, timeAgo } from '../lib/format';

// Human summary of what differs between published and draft.
function summarize(def, draft, published) {
  if (def.kind === 'list') {
    const labelKey = def.itemLabel || def.fields[0].name;
    const keyOf = (x) => x?.id ?? x?.[labelKey];
    const before = new Map((published || []).map((x) => [keyOf(x), x]));
    const after = new Map((draft || []).map((x) => [keyOf(x), x]));
    const name = (map) => (k) => map.get(k)?.[labelKey] || k;
    const added = [...after.keys()].filter((k) => !before.has(k));
    const removed = [...before.keys()].filter((k) => !after.has(k));
    const edited = [...after.keys()].filter((k) => before.has(k) && JSON.stringify(before.get(k)) !== JSON.stringify(after.get(k)));
    const reordered = !added.length && !removed.length && (draft || []).map(keyOf).join('|') !== (published || []).map(keyOf).join('|');
    const out = [];
    if (added.length) out.push(`Added: ${added.map(name(after)).join(', ')}`);
    if (removed.length) out.push(`Removed: ${removed.map(name(before)).join(', ')}`);
    if (edited.length) out.push(`Edited: ${edited.map(name(after)).join(', ')}`);
    if (reordered) out.push('Order changed');
    return out;
  }
  return def.fields
    .filter((f) => JSON.stringify(draft?.[f.name] ?? null) !== JSON.stringify(published?.[f.name] ?? null))
    .map((f) => `Changed: ${f.label}`);
}

const DEPLOY_TONE = { triggered: 'ok', skipped: 'neutral', failed: 'danger' };

export default function Publish() {
  const { can } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();
  const [note, setNote] = useState('');
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const overview = useQuery({ queryKey: ['content'], queryFn: () => api('/content') });
  const versions = useQuery({ queryKey: ['versions'], queryFn: () => api('/content/versions') });
  const changedKeys = (overview.data?.collections || []).filter((c) => c.changed).map((c) => c.key);
  const details = useQueries({ queries: changedKeys.map((k) => ({ queryKey: ['content', k], queryFn: () => api(`/content/${k}`) })) });

  const afterPublish = (d) => {
    setLastResult(d.deploy);
    setNote('');
    qc.invalidateQueries({ queryKey: ['content'] });
    qc.invalidateQueries({ queryKey: ['versions'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const publish = useMutation({
    mutationFn: () => api('/content/publish', { method: 'POST', body: { note: note || undefined } }),
    onSuccess: (d) => { afterPublish(d); toast('Published'); },
    onError: (e) => toast(e.message, 'danger'),
  });
  const restore = useMutation({
    mutationFn: (id) => api(`/content/versions/${id}/restore`, { method: 'POST' }),
    onSuccess: (d) => { afterPublish(d); setRestoreTarget(null); toast('Version restored'); },
    onError: (e) => toast(e.message, 'danger'),
  });

  if (overview.isLoading) return <PageLoader />;
  const canPublish = can('content:publish');

  return (
    <>
      <PageHeader title="Publish & History" description="Push saved drafts to the live website, or roll back to an earlier version." />

      {lastResult && (
        <Alert tone={lastResult.status === 'triggered' ? 'ok' : lastResult.status === 'failed' ? 'danger' : 'warn'} className="mb-6">
          {lastResult.detail}
        </Alert>
      )}

      <Card title="Ready to publish" className="mb-6">
        {changedKeys.length === 0 ? (
          <EmptyState icon={FiCheckCircle} title="Everything is live">There are no unpublished drafts.</EmptyState>
        ) : (
          <>
            <ul className="mb-5 divide-y divide-line rounded-lg border border-line">
              {changedKeys.map((k, i) => {
                const d = details[i]?.data;
                const meta = overview.data.collections.find((c) => c.key === k);
                const lines = d ? summarize(d.definition, d.draft, d.published) : [];
                return (
                  <li key={k} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <Link to={`/content/${k}`} className="font-semibold hover:text-accent">{meta.label}</Link>
                      <span className="text-xs text-muted">edited {timeAgo(meta.draftUpdatedAt)}</span>
                    </div>
                    {lines.length > 0 && (
                      <ul className="mt-1 space-y-0.5 text-xs text-muted">
                        {lines.map((l) => <li key={l} className="truncate">{l}</li>)}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            {canPublish ? (
              <form onSubmit={(e) => { e.preventDefault(); publish.mutate(); }} className="flex flex-col gap-3 sm:flex-row">
                <label className="flex-1">
                  <span className="sr-only">Note</span>
                  <input className="input" placeholder="What changed? (optional, shown in history)" maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} />
                </label>
                <Button type="submit" icon={FiUploadCloud} loading={publish.isPending}>Publish to website</Button>
              </form>
            ) : (
              <Alert tone="info">Only Editors and Super Admins can publish.</Alert>
            )}
          </>
        )}
      </Card>

      <Card title="History" padded={false}>
        {versions.isLoading ? (
          <PageLoader />
        ) : (
          <ol className="divide-y divide-line">
            {versions.data.versions.map((v, i) => (
              <li key={v._id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
                <FiClock className="hidden h-4 w-4 shrink-0 text-muted sm:block" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {v.note || (v.changedKeys.length ? `Updated ${v.changedKeys.join(', ')}` : 'Published')}
                    {i === 0 && <Badge tone="accent" className="ml-2">Live</Badge>}
                  </p>
                  <p className="text-xs text-muted">
                    {fmtDateTime(v.createdAt)} · {v.publishedByName || 'System'}
                    {v.deploy?.status && <> · <Badge tone={DEPLOY_TONE[v.deploy.status]}>{v.deploy.status === 'triggered' ? 'site rebuilt' : `deploy ${v.deploy.status}`}</Badge></>}
                  </p>
                </div>
                {i > 0 && canPublish && (
                  <Button variant="secondary" size="sm" icon={FiRotateCcw} onClick={() => setRestoreTarget(v)}>Restore</Button>
                )}
              </li>
            ))}
          </ol>
        )}
      </Card>

      <ConfirmModal
        open={Boolean(restoreTarget)}
        title="Restore this version?"
        tone="primary"
        confirmLabel="Restore and publish"
        loading={restore.isPending}
        onConfirm={() => restore.mutate(restoreTarget._id)}
        onClose={() => setRestoreTarget(null)}
      >
        The whole website content goes back to how it was on {restoreTarget && fmtDateTime(restoreTarget.createdAt)} and is published immediately.
        Any unpublished drafts are replaced. The current version stays in history, so you can undo this.
      </ConfirmModal>
    </>
  );
}
