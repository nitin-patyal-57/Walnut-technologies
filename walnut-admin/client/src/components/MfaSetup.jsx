import { useEffect, useState } from 'react';
import { FiCopy, FiDownload } from 'react-icons/fi';
import { api } from '../lib/api';
import { Alert, Button, Field, Spinner } from './ui';

// Enrolment: scan QR → confirm a code → save recovery codes.
export default function MfaSetup({ onDone }) {
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState('');
  const [codes, setCodes] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api('/auth/mfa/setup', { method: 'POST' }).then(setSetup).catch((e) => setError(e.message));
  }, []);

  async function confirm(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const d = await api('/auth/mfa/enable', { method: 'POST', body: { code: code.replace(/\s/g, '') } });
      setCodes(d.recoveryCodes);
      setResult(d.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function downloadCodes() {
    const blob = new Blob([`Walnut Admin recovery codes\nEach code works once.\n\n${codes.join('\n')}\n`], { type: 'text/plain' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'walnut-admin-recovery-codes.txt' });
    a.click();
    setSaved(true);
  }

  if (codes) {
    return (
      <div className="space-y-4">
        <Alert tone="ok">Two-factor authentication is on.</Alert>
        <p className="text-muted">
          Save these recovery codes somewhere safe (a password manager is ideal). Each one lets you sign in once if you lose your phone.
          They won't be shown again.
        </p>
        <ul className="grid grid-cols-2 gap-2 rounded-lg bg-subtle p-3 font-mono text-sm">
          {codes.map((c) => <li key={c}>{c}</li>)}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={FiDownload} onClick={downloadCodes}>Download</Button>
          <Button variant="secondary" icon={FiCopy} onClick={() => navigator.clipboard.writeText(codes.join('\n')).then(() => setSaved(true))}>Copy</Button>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--accent))]" />
          I have saved my recovery codes
        </label>
        <Button className="w-full" disabled={!saved} onClick={() => onDone(result)}>Continue</Button>
      </div>
    );
  }

  return (
    <form onSubmit={confirm} className="space-y-4">
      {error && <Alert>{error}</Alert>}
      <ol className="list-decimal space-y-1 pl-5 text-muted">
        <li>Install an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password…).</li>
        <li>Scan this QR code with it.</li>
        <li>Enter the 6-digit code it shows.</li>
      </ol>
      <div className="flex justify-center">
        {setup ? (
          <img src={setup.qrDataUrl} alt="QR code for your authenticator app" className="h-48 w-48 rounded-lg bg-white p-2" />
        ) : (
          <div className="flex h-48 w-48 items-center justify-center"><Spinner /></div>
        )}
      </div>
      {setup && (
        <details className="text-xs text-muted">
          <summary className="cursor-pointer">Can't scan? Enter this key manually</summary>
          <code className="mt-2 block break-all rounded bg-subtle p-2 font-mono text-ink">{setup.secret}</code>
        </details>
      )}
      <Field label="6-digit code" htmlFor="mfa-code">
        <input id="mfa-code" className="input text-center text-lg tracking-[0.3em]" inputMode="numeric" autoComplete="one-time-code" maxLength={7} value={code} onChange={(e) => setCode(e.target.value)} required />
      </Field>
      <Button type="submit" className="w-full" loading={loading} disabled={!setup}>Turn on</Button>
    </form>
  );
}
