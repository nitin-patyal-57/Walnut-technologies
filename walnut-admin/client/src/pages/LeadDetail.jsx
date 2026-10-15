import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiMail, FiPhone, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import { Alert, Button, Card, ConfirmModal, Field, PageLoader, useToast } from '../components/ui';
import { api, download } from '../lib/api';
import { fmtBytes, fmtDateTime, LEAD_STATUS_LABELS, LEAD_TYPE_LABELS, timeAgo } from '../lib/format';
import { LeadStatusBadge } from './Leads';

function Row({ label, children }) {
  if (!children) return null;
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[140px_1fr]">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const { can } = useAuth();
  const [note, setNote] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data, isLoading, error } = useQuery({ queryKey: ['lead', id], queryFn: () => api(`/leads/${id}`) });
  const { data: assignees } = useQuery({ queryKey: ['assignees'], queryFn: () => api('/leads/assignees') });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['lead', id] });
    qc.invalidateQueries({ queryKey: ['leads'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const update = useMutation({
    mutationFn: (body) => api(`/leads/${id}`, { method: 'PATCH', body }),
    onSuccess: () => { refresh(); toast('Lead updated'); },
    onError: (e) => toast(e.message, 'danger'),
  });
  const addNote = useMutation({
    mutationFn: () => api(`/leads/${id}/notes`, { method: 'POST', body: { text: note } }),
    onSuccess: () => { setNote(''); refresh(); },
    onError: (e) => toast(e.message, 'danger'),
  });
  const remove = useMutation({
    mutationFn: () => api(`/leads/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); toast('Lead deleted'); navigate('/leads', { replace: true }); },
    onError: (e) => toast(e.message, 'danger'),
  });

  if (isLoading) return <PageLoader />;
  if (error) return <Alert>{error.message}</Alert>;

  const { lead, canManage } = data;
  const mailSubject = encodeURIComponent(`Re: ${lead.subject || lead.jobTitle || lead.resourceTitle || 'Your enquiry'} — Walnut Technologies`);

  return (
    <>
      <Link to="/leads" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><FiArrowLeft /> Leads</Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold sm:text-2xl">{lead.name}</h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="mt-1 text-muted">{LEAD_TYPE_LABELS[lead.type]} · received {fmtDateTime(lead.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${lead.email}?subject=${mailSubject}`} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:opacity-90"><FiMail /> Reply</a>
          {lead.phone && <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-subtle"><FiPhone /> Call</a>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card title="Details">
            <dl className="divide-y divide-line">
              <Row label="Email"><a href={`mailto:${lead.email}`} className="text-accent hover:underline">{lead.email}</a></Row>
              <Row label="Phone">{lead.phone}</Row>
              <Row label="Company">{lead.company}</Row>
              <Row label="Subject">{lead.subject}</Row>
              <Row label="Quantity">{lead.quantity}</Row>
              <Row label="Resource">{lead.resourceTitle}</Row>
              <Row label="Role applied">{lead.jobTitle}</Row>
              <Row label="Message"><p className="whitespace-pre-wrap">{lead.message}</p></Row>
              <Row label="Résumé">
                {lead.resume && (
                  <Button variant="secondary" size="sm" icon={FiDownload} onClick={() => download(`/leads/${id}/resume`, lead.resume.filename).catch((e) => toast(e.message, 'danger'))}>
                    {lead.resume.filename} ({fmtBytes(lead.resume.size)})
                  </Button>
                )}
              </Row>
              <Row label="Source IP">{lead.ip}</Row>
            </dl>
          </Card>

          <Card title={`Notes (${lead.notes.length})`}>
            {lead.notes.length > 0 && (
              <ul className="mb-4 space-y-3">
                {lead.notes.map((n) => (
                  <li key={n._id} className="rounded-lg bg-subtle p-3">
                    <p className="whitespace-pre-wrap">{n.text}</p>
                    <p className="mt-1 text-xs text-muted">{n.authorName} · {timeAgo(n.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
            {canManage ? (
              <form onSubmit={(e) => { e.preventDefault(); addNote.mutate(); }} className="space-y-2">
                <textarea className="input min-h-[80px]" placeholder="Add an internal note — call summary, next step…" value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} />
                <Button type="submit" size="sm" loading={addNote.isPending} disabled={!note.trim()}>Add note</Button>
              </form>
            ) : lead.notes.length === 0 && <p className="text-muted">No notes.</p>}
          </Card>
        </div>

        <div className="space-y-6">
          {canManage && (
            <Card title="Manage">
              <div className="space-y-4">
                <Field label="Status" htmlFor="status">
                  <select id="status" className="input" value={lead.status} onChange={(e) => update.mutate({ status: e.target.value })} disabled={update.isPending}>
                    {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Assigned to" htmlFor="assignee">
                  <select id="assignee" className="input" value={lead.assignedTo?.id || ''} onChange={(e) => update.mutate({ assignedTo: e.target.value || null })} disabled={update.isPending}>
                    <option value="">Unassigned</option>
                    {assignees?.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </Field>
              </div>
            </Card>
          )}
          {can('leads:delete') && (
            <Card title="Danger zone">
              <p className="mb-3 text-muted">Permanently delete this lead and any attached résumé (e.g. on a data-deletion request).</p>
              <Button variant="danger" size="sm" icon={FiTrash2} onClick={() => setConfirmDelete(true)}>Delete lead</Button>
            </Card>
          )}
        </div>
      </div>

      <ConfirmModal open={confirmDelete} title="Delete this lead?" confirmLabel="Delete permanently" loading={remove.isPending} onConfirm={() => remove.mutate()} onClose={() => setConfirmDelete(false)}>
        {lead.name}'s submission{lead.resume ? ' and résumé' : ''} will be removed. This can't be undone.
      </ConfirmModal>
    </>
  );
}
