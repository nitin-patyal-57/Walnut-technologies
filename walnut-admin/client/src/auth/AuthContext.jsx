import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, onSessionEnded, refreshSession } from '../lib/api';

const AuthContext = createContext(null);

const IDLE_LIMIT_MS = 30 * 60 * 1000; // matches the server's idle timeout

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | signed-in | signed-out
  const [notice, setNotice] = useState('');
  const queryClient = useQueryClient();

  const signedOut = useCallback((message = '') => {
    setUser(null);
    setStatus('signed-out');
    setNotice(message);
    queryClient.clear();
  }, [queryClient]);

  // Restore an existing session on load.
  useEffect(() => {
    api('/auth/me')
      .then((d) => { setUser(d.user); setStatus('signed-in'); })
      .catch(async () => {
        try {
          const d = await refreshSession();
          setUser(d.user);
          setStatus('signed-in');
        } catch {
          setStatus('signed-out');
        }
      });
  }, []);

  useEffect(() => onSessionEnded(() => signedOut('Your session has ended. Please sign in again.')), [signedOut]);

  // Sign out after 30 minutes without keyboard/mouse activity.
  useEffect(() => {
    if (status !== 'signed-in') return undefined;
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await api('/auth/logout', { method: 'POST' }).catch(() => {});
        signedOut('You were signed out after 30 minutes of inactivity.');
      }, IDLE_LIMIT_MS);
    };
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [status, signedOut]);

  const value = useMemo(() => ({
    user,
    status,
    notice,
    clearNotice: () => setNotice(''),
    signedIn: (u) => { setUser(u); setStatus('signed-in'); setNotice(''); },
    updateUser: (u) => setUser(u),
    can: (perm) => Boolean(user && (user.permissions.includes('*') || user.permissions.includes(perm))),
    logout: async () => {
      await api('/auth/logout', { method: 'POST' }).catch(() => {});
      signedOut('');
    },
  }), [user, status, notice, signedOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
