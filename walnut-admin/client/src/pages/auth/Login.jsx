import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Alert, Button, Field } from '../../components/ui';
import { api } from '../../lib/api';
import AuthShell from './AuthShell';

export default function Login() {
  const { signedIn, notice, clearNotice } = useAuth();
  const [step, setStep] = useState('password'); // password | mfa
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [challenge, setChallenge] = useState('');
  const [code, setCode] = useState('');
  const [useRecovery, setUseRecovery] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submitPassword(e) {
    e.preventDefault();
    setError('');
    clearNotice();
    setLoading(true);
    try {
      const d = await api('/auth/login', { method: 'POST', body: { email, password } });
      if (d.mfaRequired) {
        setChallenge(d.challenge);
        setStep('mfa');
        setPassword('');
      } else {
        signedIn(d.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitCode(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = useRecovery ? { challenge, recoveryCode: code } : { challenge, code: code.replace(/\s/g, '') };
      const d = await api('/auth/login/mfa', { method: 'POST', body });
      signedIn(d.user);
    } catch (err) {
      setError(err.message);
      if (err.code === 'CHALLENGE_EXPIRED') setStep('password');
      setCode('');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'mfa') {
    return (
      <AuthShell
        title="Two-factor authentication"
        subtitle={useRecovery ? 'Enter one of your saved recovery codes.' : 'Enter the 6-digit code from your authenticator app.'}
      >
        <form onSubmit={submitCode} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <Field label={useRecovery ? 'Recovery code' : 'Code'} htmlFor="code">
            <input
              id="code"
              className="input text-center text-lg tracking-[0.3em]"
              inputMode={useRecovery ? 'text' : 'numeric'}
              autoComplete="one-time-code"
              maxLength={useRecovery ? 11 : 7}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              required
            />
          </Field>
          <Button type="submit" className="w-full" loading={loading}>Verify</Button>
          <div className="flex justify-between text-xs">
            <button type="button" className="text-accent hover:underline" onClick={() => { setUseRecovery(!useRecovery); setCode(''); setError(''); }}>
              {useRecovery ? 'Use authenticator code' : 'Use a recovery code'}
            </button>
            <button type="button" className="text-muted hover:underline" onClick={() => { setStep('password'); setError(''); }}>
              Back
            </button>
          </div>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Sign in" subtitle="Use your Walnut Technologies account.">
      <form onSubmit={submitPassword} className="space-y-4">
        {notice && <Alert tone="info">{notice}</Alert>}
        {error && <Alert>{error}</Alert>}
        <Field label="Email" htmlFor="email">
          <input id="email" type="email" className="input" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
        </Field>
        <Field label="Password" htmlFor="password">
          <input id="password" type="password" className="input" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
        <p className="text-center text-xs">
          <Link to="/forgot-password" className="text-accent hover:underline">Forgot password?</Link>
        </p>
      </form>
    </AuthShell>
  );
}
