import { useAuth } from '../../auth/AuthContext';
import MfaSetup from '../../components/MfaSetup';
import AuthShell from './AuthShell';

// Super Admins land here until they enrol in two-factor authentication.
export default function MfaRequired() {
  const { updateUser, logout } = useAuth();
  return (
    <AuthShell title="Set up two-factor authentication" subtitle="Required for Super Admin accounts. It takes about a minute.">
      <MfaSetup onDone={updateUser} />
      <button type="button" onClick={logout} className="mt-4 block w-full text-center text-xs text-muted hover:underline">
        Sign out
      </button>
    </AuthShell>
  );
}
