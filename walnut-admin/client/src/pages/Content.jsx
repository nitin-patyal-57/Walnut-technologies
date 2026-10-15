import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useBlocker, useParams } from 'react-router-dom';
import { FiArrowLeft, FiChevronRight, FiRotateCcw, FiSave } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import { FieldGroup, ListEditor } from '../components/fields';
import { Alert, Badge, Button, ConfirmModal, PageHeader, PageLoader, useToast } from '../components/ui';
import { api } from '../lib/api';
import { timeAgo } from '../lib/format';

export function ContentIndex() {
  const { data, isLoading, error } = useQuery({ queryKey: ['content'], queryFn: () => api('/content') });

  const groups = useMemo(() => {
    const map = new Map();
    for (const c of data?.collections || []) {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group).push(c);
    }
    return [...map];
  }, [data]);

  if (isLoading) return <PageLoader />;
  if (error) return <Alert>{error.message}</Alert>;
  const changed = data.collections.filter((c) => c.changed).length;

  return (
    <>
      <PageHeader
        title="Website Content"
        description="Edit text, lists and images used on walnutmedical.in. Changes are saved as drafts until you publish."
        actions={changed > 0 && <Link to="/publish" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:opacity-90">Publish {changed} change{changed > 1 ? 's' : ''}</Link>}
      />
      <div className="space-y-8">
        {groups.map(([group, items]) => (
          <section key={group}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{group}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <li key={c.key}>
                  <Link to={`/content/${c.key}`} className="card flex h-full flex-col p-4 transition hover:border-accent/50">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{c.label}</h3>
                      {c.changed ? <Badge tone="warn">Draft</Badge> : <FiChevronRight className="mt-0.5 h-4 w-4 text-muted" />}
                    </div>
                    <p className="mt-1 flex-1 text-xs text-muted">{c.description}</p>
                    <p className="mt-3 text-[11px] text-muted">
                      {c.count !== null && `${c.count} item${c.count === 1 ? '' : 's'} · `}
                      {c.changed ? `edited ${timeAgo(c.draftUpdatedAt)}` : `published ${timeAgo(c.publishedAt)}`}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

export function ContentEdit() {
  const { key } = useParams();
  const { can } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();
  const readOnly = !can('content:edit');

  const { data, isLoading, error } = useQuery({ queryKey: ['content', key], queryFn: () => api(`/content/${key}`) });
  const [value, setValue] = useState(null);
  const [baseline, setBaseline] = useState('');
  const [saveError, setSaveError] = useState('');
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  // 409 from the server: someone else saved this section while we were editing.
  // Holds { draftUpdatedBy, draftUpdatedAt } and blocks saving until resolved.
  const [conflict, setConflict] = useState(null);

  useEffect(() => {
    if (data) {
      setValue(structuredClone(data.draft));
      setBaseline(JSON.stringify(data.draft));
    }
  }, [data]);

  const dirty = value !== null && JSON.stringify(value) !== baseline;

  // Warn before leaving with unsaved edits (tab close and in-app navigation).
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['content'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const save = useMutation({
    // Echo the version we loaded (draftUpdatedAt) so the server can reject a
    // stale write with 409 instead of clobbering a colleague's save.
    mutationFn: (opts = {}) =>
      api(`/content/${key}`, {
        method: 'PUT',
        body: {
          data: value,
          baseUpdatedAt: opts.baseUpdatedAt !== undefined ? opts.baseUpdatedAt : (data?.draftUpdatedAt ?? null),
        },
      }),
    onSuccess: (d) => {
      setValue(structuredClone(d.draft));
      setBaseline(JSON.stringify(d.draft));
      setSaveError('');
      setConflict(null);
      qc.setQueryData(['content', key], (old) => ({ ...old, draft: d.draft, changed: d.changed, draftUpdatedAt: d.draftUpdatedAt }));
      invalidate();
      toast('Draft saved — publish to make it live');
    },
    onError: (e) => {
      if (e.code === 'CONFLICT') {
        setSaveError('');
        setConflict(e.meta || {});
      } else {
        setSaveError(e.message);
      }
    },
  });

  // Conflict, choice 1: throw our local edits away and load the colleague's version.
  const loadTheirs = async () => {
    setSaveError('');
    try {
      const fresh = await api(`/content/${key}`);
      setConflict(null);
      qc.setQueryData(['content', key], fresh);
      setValue(structuredClone(fresh.draft));
      setBaseline(JSON.stringify(fresh.draft));
      toast('Loaded the latest version — your local edits were replaced');
    } catch (e) {
      setSaveError(e.message);
    }
  };

  // Conflict, choice 2: keep our edits and write them over their version. The
  // base is their save's timestamp from the 409 response, so this only succeeds
  // if nobody has saved yet another time since (then we 409 again → new choice).
  const overwriteWithMine = () => save.mutate({ baseUpdatedAt: conflict?.draftUpdatedAt ?? null });

  const discard = useMutation({
    mutationFn: () => api(`/content/${key}/discard`, { method: 'POST' }),
    onSuccess: (d) => {
      setValue(structuredClone(d.draft));
      setBaseline(JSON.stringify(d.draft));
      setConfirmDiscard(false);
      qc.setQueryData(['content', key], (old) => ({ ...old, draft: d.draft, changed: false }));
      invalidate();
      toast('Draft discarded');
    },
  });

  // Ctrl/Cmd+S saves.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (dirty && !save.isPending && !readOnly && !conflict) save.mutate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, save, readOnly, conflict]);

  if (isLoading || value === null) return error ? <Alert>{error.message}</Alert> : <PageLoader />;
  const def = data.definition;

  return (
    <div className="pb-24">
      <Link to="/content" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><FiArrowLeft /> Website Content</Link>
      <PageHeader
        title={<span className="flex flex-wrap items-center gap-2">{def.label} {data.changed && <Badge tone="warn">Unpublished draft</Badge>}</span>}
        description={def.description}
      />

      {readOnly && <Alert tone="info" className="mb-4">You have view-only access.</Alert>}

      {conflict && (
        <Alert tone="warn" className="mb-4">
          <p>
            <strong>{conflict.draftUpdatedBy || 'Someone else'}</strong> saved this section while you were editing.
            Your changes are not saved yet — pick how to continue.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" onClick={loadTheirs}>Load their version</Button>
            <Button size="sm" variant="ghost" onClick={overwriteWithMine} disabled={save.isPending}>Overwrite with mine</Button>
          </div>
        </Alert>
      )}

      <div className="card p-4 sm:p-6">
        {def.kind === 'list' ? (
          <ListEditor field={def} value={value} onChange={setValue} idPrefix={key} readOnly={readOnly} />
        ) : (
          <FieldGroup fields={def.fields} value={value} onChange={setValue} idPrefix={key} readOnly={readOnly} />
        )}
      </div>

      {!readOnly && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0 flex-1 text-sm">
              {saveError ? <span className="text-danger">{saveError}</span>
                : conflict ? <span className="font-medium text-danger">Save blocked — someone else changed this section</span>
                : dirty ? <span className="font-medium text-warn">Unsaved changes</span>
                : data.changed ? <span className="text-muted">Draft saved · not yet live</span>
                : <span className="text-muted">Matches the live website</span>}
            </div>
            {data.changed && !dirty && <Button variant="ghost" icon={FiRotateCcw} onClick={() => setConfirmDiscard(true)}>Discard draft</Button>}
            {dirty && <Button variant="ghost" onClick={() => { setValue(JSON.parse(baseline)); setSaveError(''); }}>Undo edits</Button>}
            {data.changed && !dirty && can('content:publish') && <Link to="/publish" className="inline-flex items-center rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-subtle">Go to publish</Link>}
            <Button icon={FiSave} loading={save.isPending} disabled={!dirty || !!conflict} onClick={() => save.mutate()}>Save draft</Button>
          </div>
        </div>
      )}

      <ConfirmModal open={confirmDiscard} title="Discard draft?" confirmLabel="Discard" loading={discard.isPending} onConfirm={() => discard.mutate()} onClose={() => setConfirmDiscard(false)}>
        This section will go back to what's currently live on the website.
      </ConfirmModal>

      <ConfirmModal open={blocker.state === 'blocked'} title="Leave without saving?" confirmLabel="Leave" onConfirm={() => blocker.proceed?.()} onClose={() => blocker.reset?.()}>
        Your unsaved edits to {def.label} will be lost.
      </ConfirmModal>
    </div>
  );
}
