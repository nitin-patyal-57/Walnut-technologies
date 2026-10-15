import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiMonitor } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import MfaSetup from '../components/MfaSetup';
import { Alert, Badge, Button, Card, Field, Modal, PageHeader, useToast } from '../components/ui';
import { api } from '../lib/api';
import { describeUserAgent, ROLE_LABELS, timeAgo } from '../lib/format';

function ChangePassword() {
  const toast = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const mutation = useMutation({
    mutationFn: () => api('/auth/password', { method: 'POST', body: { currentPassword: form.currentPassword, newPassword: form.newPassword } }),
    onSuccess: () => {
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      setError('');
      toast('Password changed. Other sessions were signed out.');
    },
    onError: (e) => setError(e.message),
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <Card title="Password">
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="grid gap-4 sm:max-w-sm">
        {error && <Alert>{error}</Alert>}
        <Field label="Current password" htmlFor="cur">
          <input id="cur" type="password" className="input" autoComplete="current-password" value={form.currentPassword} onChange={set('currentPassword')} required />
        </Field>
        <Field label="New password" htmlFor="new" help="At least 10 characters, with letters and numbers or symbols.">
          <input id="new" type="password" className="input" autoComplete="new-password" minLength={10} value={form.newPassword} onChange={set('newPassword')} required />
        </Field>
        <Field label="Confirm new password" htmlFor="conf" error={form.confirm && form.confirm !== form.newPassword ? 'Passwords do not match' : ''}>
          <input id="conf" type="password" className="input" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} required />
        </Field>
        <div>
          <Button type="submit" loading={mutation.isPending} disabled={!form.newPassword || form.newPassword !== form.confirm}>Change password</Button>
        </div>
      </form>
    </Card>
  );
}

function TwoFactor() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState(null); // setup | disable | codes
  const [form, setForm] = useState({ password: '', code: '' });
  const [error, setError] = useState('');
  const [newCodes, setNewCodes] = useState(null);

  const close = () => { setMode(null); setForm({ password: '', code: '' }); setError(''); setNewCodes(null); };

  const disable = useMutation({
    mutationFn: () => api('/auth/mfa/disable', { method: 'POST', body: form }),
    onSuccess: (d) => { updateUser(d.user); toast('Two-factor authentication turned off'); close(); },
    onError: (e) => setError(e.message),
  });
  const regenerate = useMutation({
    mutationFn: () => api('/auth/mfa/recovery-codes', { method: 'POST', body: { code: form.code } }),
    onSuccess: (d) => setNewCodes(d.recoveryCodes),
    onError: (e) => setError(e.message),
  });

  return (
    <Card title="Two-factor authentication" actions={user.mfaEnabled ? <Badge tone="ok">On</Badge> : <Badge tone="warn">Off</Badge>}>
      <p className="text-muted">
        {user.mfaEnabled
          ? 'Signing in requires a code from your authenticator app.'
          : 'Add a second step to sign-in using an authenticator app on your phone. Strongly recommended.'}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {user.mfaEnabled ? (
          <>
            <Button variant="secondary" onClick={() => setMode('codes')}>New recovery codes</Button>
            {user.role !== 'superadmin' && <Button variant="secondary" onClick={() => setMode('disable')}>Turn off</Button>}
          </>
        ) : (
          <Button onClick={() => setMode('setup')}>Set up</Button>
        )}
      </div>

      <Modal open={mode === 'setup'} onClose={close} title="Set up two-factor authentication">
        <MfaSetup onDone={(u) => { updateUser(u); close(); toast('Two-factor authentication is on'); }} />
      </Modal>

      <Modal
        open={mode === 'disable'}
        onClose={close}
        title="Turn off two-factor authentication"
        footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button variant="danger" loading={disable.isPending} onClick={() => disable.mutate()}>Turn off</Button></>}
      >
        <div className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <Field label="Password" htmlFor="d-pw"><input id="d-pw" type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
          <Field label="Authenticator code" htmlFor="d-code"><input id="d-code" className="input" inputMode="numeric" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
        </div>
      </Modal>

      <Modal
        open={mode === 'codes'}
        onClose={close}
        title="New recovery codes"
        footer={newCodes ? <Button onClick={close}>Done</Button> : <><Button variant="secondary" onClick={close}>Cancel</Button><Button loading={regenerate.isPending} onClick={() => regenerate.mutate()}>Generate</Button></>}
      >
        {newCodes ? (
          <div className="space-y-3">
            <Alert tone="warn">Your old codes no longer work. Save these now — they won't be shown again.</Alert>
            <ul className="grid grid-cols-2 gap-2 rounded-lg bg-subtle p-3 font-mono text-sm">{newCodes.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        ) : (
          <div className="space-y-4">
            {error && <Alert>{error}</Alert>}
            <Field label="Authenticator code" htmlFor="r-code"><input id="r-code" className="input" inputMode="numeric" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
          </div>
        )}
      </Modal>
    </Card>
  );
}

function Sessions() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data } = useQuery({ queryKey: ['sessions'], queryFn: () => api('/auth/sessions') });
  const revoke = useMutation({
    mutationFn: (id) => api(`/auth/sessions/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sessions'] }); toast('Session signed out'); },
  });

  return (
    <Card title="Signed-in devices" padded={false}>
      <ul className="divide-y divide-line">
        {data?.sessions.map((s) => (
          <li key={s.id} className="flex items-center gap-3 px-4 py-3">
            <FiMonitor className="h-5 w-5 shrink-0 text-muted" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {describeUserAgent(s.userAgent)} {s.current && <Badge tone="accent" className="ml-1">This device</Badge>}
              </p>
              <p className="text-xs text-muted">IP {s.ip} · active {timeAgo(s.lastUsedAt)}</p>
            </div>
            {!s.current && <Button variant="secondary" size="sm" loading={revoke.isPending && revoke.variables === s.id} onClick={() => revoke.mutate(s.id)}>Sign out</Button>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function Security() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Account security" description={`${user.name} · ${user.email} · ${ROLE_LABELS[user.role]}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ChangePassword />
        <div className="space-y-6">
          <TwoFactor />
          <Sessions />
        </div>
      </div>
    </>
  );
}
