import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiCopy, FiMoreVertical, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import { Alert, Badge, Button, ConfirmModal, Field, Modal, PageHeader, PageLoader, useToast } from '../components/ui';
import { api } from '../lib/api';
import { ROLE_HELP, ROLE_LABELS, timeAgo } from '../lib/format';

const STATUS_TONE = { active: 'ok', invited: 'accent', disabled: 'neutral' };

function RoleSelect({ id, value, onChange }) {
  return (
    <>
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <p className="mt-1 text-xs text-muted">{ROLE_HELP[value]}</p>
    </>
  );
}

function InviteModal({ open, onClose }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', role: 'editor' });
  const [error, setError] = useState('');
  const [link, setLink] = useState('');

  const close = () => { setForm({ name: '', email: '', role: 'editor' }); setError(''); setLink(''); onClose(); };
  const invite = useMutation({
    mutationFn: () => api('/users/invite', { method: 'POST', body: form }),
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      if (d.inviteLink) setLink(d.inviteLink);
      else { toast(`Invitation emailed to ${form.email}`); close(); }
    },
    onError: (e) => setError(e.message),
  });

  return (
    <Modal
      open={open}
      onClose={close}
      title="Invite a team member"
      footer={link ? <Button onClick={close}>Done</Button> : (
        <>
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button loading={invite.isPending} onClick={() => invite.mutate()} disabled={!form.name || !form.email}>Send invitation</Button>
        </>
      )}
    >
      {link ? (
        <div className="space-y-3">
          <Alert tone="warn">Email isn't configured yet, so send this one-time link to {form.name} yourself (valid 72 hours):</Alert>
          <div className="flex gap-2">
            <input className="input font-mono text-xs" readOnly value={link} onFocus={(e) => e.target.select()} />
            <Button variant="secondary" icon={FiCopy} aria-label="Copy link" onClick={() => navigator.clipboard.writeText(link).then(() => toast('Link copied'))} />
          </div>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); invite.mutate(); }}>
          {error && <Alert>{error}</Alert>}
          <Field label="Full name" htmlFor="inv-name"><input id="inv-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></Field>
          <Field label="Work email" htmlFor="inv-email"><input id="inv-email" type="email" className="input" placeholder="name@walnutmedical.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Role" htmlFor="inv-role"><RoleSelect id="inv-role" value={form.role} onChange={(role) => setForm({ ...form, role })} /></Field>
          <button type="submit" className="hidden" />
        </form>
      )}
    </Modal>
  );
}

function UserActions({ user, isSelf, onEdit }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [link, setLink] = useState('');

  const act = useMutation({
    mutationFn: ({ path, method = 'POST', body }) => api(`/users/${user.id}${path}`, { method, body }),
    onSuccess: (d, v) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setConfirm(null);
      if (d?.inviteLink) setLink(d.inviteLink);
      else toast(v.done);
    },
    onError: (e) => { setConfirm(null); toast(e.message, 'danger'); },
  });

  const items = [
    { label: 'Edit name / role', run: onEdit },
    user.status === 'invited' && { label: 'Resend invitation', run: () => act.mutate({ path: '/resend-invite', done: 'Invitation re-sent' }) },
    user.locked && { label: 'Unlock account', run: () => act.mutate({ path: '/unlock', done: 'Account unlocked' }) },
    user.mfaEnabled && !isSelf && { label: 'Reset two-factor', danger: true, confirm: { title: `Reset two-factor for ${user.name}?`, body: 'They will be signed out and must set up their authenticator again (Super Admins are forced to on next sign-in). Only do this after verifying who they are.', action: { path: '/reset-mfa', done: 'Two-factor reset' } } },
    user.status === 'active' && { label: 'Sign out everywhere', confirm: { title: `Sign ${user.name} out of all devices?`, body: 'Every session they have will end immediately.', action: { path: '/sign-out', done: 'Signed out of all devices' } } },
    user.status === 'active' && !isSelf && { label: 'Disable account', danger: true, confirm: { title: `Disable ${user.name}?`, body: 'They will be signed out immediately and cannot sign in again until re-enabled. Their history stays in the audit log.', action: { path: '', method: 'PATCH', body: { status: 'disabled' }, done: 'User disabled' } } },
    user.status === 'disabled' && { label: 'Re-enable account', run: () => act.mutate({ path: '', method: 'PATCH', body: { status: 'active' }, done: 'User re-enabled' }) },
    user.status === 'invited' && { label: 'Revoke invitation', danger: true, confirm: { title: 'Revoke invitation?', body: `${user.email} will no longer be able to use their invitation link.`, action: { path: '', method: 'DELETE', done: 'Invitation revoked' } } },
  ].filter(Boolean);

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="rounded-md p-1.5 text-muted hover:bg-subtle hover:text-ink" aria-label={`Actions for ${user.name}`} aria-expanded={open}>
        <FiMoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-pop">
            {items.map((it) => (
              <li key={it.label}>
                <button
                  type="button"
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-subtle ${it.danger ? 'text-danger' : ''}`}
                  onClick={() => { setOpen(false); if (it.confirm) setConfirm(it.confirm); else it.run(); }}
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <ConfirmModal open={Boolean(confirm)} title={confirm?.title} confirmLabel="Confirm" loading={act.isPending} onConfirm={() => act.mutate(confirm.action)} onClose={() => setConfirm(null)}>
        {confirm?.body}
      </ConfirmModal>
      <Modal open={Boolean(link)} onClose={() => setLink('')} title="New invitation link" footer={<Button onClick={() => setLink('')}>Done</Button>}>
        <p className="mb-2 text-muted">Email isn't configured, so send this link yourself:</p>
        <input className="input font-mono text-xs" readOnly value={link} onFocus={(e) => e.target.select()} />
      </Modal>
    </div>
  );
}

function EditModal({ user, onClose }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || '', role: user?.role || 'viewer' });
  const [error, setError] = useState('');
  const save = useMutation({
    mutationFn: () => api(`/users/${user.id}`, { method: 'PATCH', body: form }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast('User updated'); onClose(); },
    onError: (e) => setError(e.message),
  });
  return (
    <Modal open onClose={onClose} title={`Edit ${user.name}`} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={save.isPending} onClick={() => save.mutate()}>Save</Button></>}>
      <div className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <Field label="Full name" htmlFor="ed-name"><input id="ed-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Role" htmlFor="ed-role"><RoleSelect id="ed-role" value={form.role} onChange={(role) => setForm({ ...form, role })} /></Field>
        {form.role !== user.role && <Alert tone="info">Changing the role signs {user.name} out so the new permissions apply immediately.</Alert>}
      </div>
    </Modal>
  );
}

export default function Users() {
  const { user: me } = useAuth();
  const [inviting, setInviting] = useState(false);
  const [editing, setEditing] = useState(null);
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: () => api('/users') });

  if (isLoading) return <PageLoader />;

  return (
    <>
      <PageHeader
        title="Users"
        description="Invite-only. People sign in with their @walnutmedical.in email and a password, plus two-factor where enabled."
        actions={<Button icon={FiUserPlus} onClick={() => setInviting(true)}>Invite</Button>}
      />

      <div className="card divide-y divide-line">
        {data.users.map((u) => (
          <div key={u.id} className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-subtle text-xs font-bold">
              {u.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{u.name}{u.id === me.id && <span className="font-normal text-muted"> (you)</span>}</p>
              <p className="truncate text-xs text-muted">{u.email}</p>
            </div>
            <div className="hidden flex-wrap items-center justify-end gap-1.5 sm:flex">
              <Badge>{ROLE_LABELS[u.role]}</Badge>
              <Badge tone={STATUS_TONE[u.status]}>{u.status}</Badge>
              {u.mfaEnabled && <Badge tone="ok">2FA</Badge>}
              {u.locked && <Badge tone="danger">Locked</Badge>}
            </div>
            <span className="hidden w-28 text-right text-xs text-muted md:block">{u.lastLoginAt ? `seen ${timeAgo(u.lastLoginAt)}` : 'never signed in'}</span>
            <UserActions user={u} isSelf={u.id === me.id} onEdit={() => setEditing(u)} />
          </div>
        ))}
      </div>

      <InviteModal open={inviting} onClose={() => setInviting(false)} />
      {editing && <EditModal user={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
