import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Alert, Button, Field, PageLoader } from '../../components/ui';
import { api } from '../../lib/api';
import AuthShell from './AuthShell';

const POLICY = 'At least 10 characters, with letters and numbers or symbols.';

function NewPasswordFields({ password, setPassword, confirm, setConfirm }) {
  return (
    <>
      <Field label="New password" htmlFor="pw" help={POLICY}>
        <input id="pw" type="password" className="input" autoComplete="new-password" minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} autoFocus required />
      </Field>
      <Field label="Confirm password" htmlFor="pw2" error={confirm && confirm !== password ? 'Passwords do not match' : ''}>
        <input id="pw2" type="password" className="input" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      </Field>
    </>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const d = await api('/auth/forgot', { method: 'POST', body: { email } });
      setSent(d.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Reset password" subtitle="We'll email you a link to choose a new password.">
      {sent ? (
        <div className="space-y-4">
          <Alert tone="ok">{sent}</Alert>
          <Link to="/login" className="block text-center text-sm text-accent hover:underline">Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <Field label="Email" htmlFor="email">
            <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
          </Field>
          <Button type="submit" className="w-full" loading={loading}>Send reset link</Button>
          <Link to="/login" className="block text-center text-xs text-muted hover:underline">Back to sign in</Link>
        </form>
      )}
    </AuthShell>
  );
}

export function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    setError('');
    try {
      await api('/auth/reset', { method: 'POST', body: { token: params.get('token'), password } });
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Choose a new password">
      {done ? (
        <Alert tone="ok">Password updated. All other sessions were signed out. Redirecting to sign in…</Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <NewPasswordFields {...{ password, setPassword, confirm, setConfirm }} />
          <Button type="submit" className="w-full" loading={loading} disabled={!password || password !== confirm}>Update password</Button>
        </form>
      )}
    </AuthShell>
  );
}

export function AcceptInvite() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { signedIn } = useAuth();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api(`/auth/invite/${encodeURIComponent(token || '')}`).then(setInvite).catch((err) => setLoadError(err.message));
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    setError('');
    try {
      const d = await api('/auth/accept-invite', { method: 'POST', body: { token, password } });
      signedIn(d.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!invite && !loadError) return <PageLoader />;

  return (
    <AuthShell title="Welcome to Walnut Admin" subtitle={invite ? `Hi ${invite.name}, set a password for ${invite.email}.` : undefined}>
      {loadError ? (
        <div className="space-y-4">
          <Alert>{loadError}</Alert>
          <Link to="/login" className="block text-center text-sm text-accent hover:underline">Go to sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <NewPasswordFields {...{ password, setPassword, confirm, setConfirm }} />
          <Button type="submit" className="w-full" loading={loading} disabled={!password || password !== confirm}>Create account</Button>
        </form>
      )}
    </AuthShell>
  );
}
