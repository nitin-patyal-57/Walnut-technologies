import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  FiActivity, FiEdit3, FiGrid, FiImage, FiInbox, FiLogOut, FiMenu, FiMoon,
  FiShield, FiSun, FiUploadCloud, FiUsers, FiX,
} from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import { ROLE_LABELS } from '../lib/format';
import { cx } from './ui';

const NAV = [
  { to: '/', label: 'Dashboard', icon: FiGrid, end: true, perm: 'dashboard:view' },
  { to: '/leads', label: 'Leads', icon: FiInbox, perm: ['leads:read', 'applications:read'] },
  { to: '/content', label: 'Website Content', icon: FiEdit3, perm: 'content:read' },
  { to: '/publish', label: 'Publish & History', icon: FiUploadCloud, perm: 'content:read' },
  { to: '/media', label: 'Media Library', icon: FiImage, perm: 'media:read' },
  { to: '/users', label: 'Users', icon: FiUsers, perm: 'users:manage' },
  { to: '/audit', label: 'Audit Log', icon: FiActivity, perm: 'audit:read' },
];

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('wa-theme', dark ? 'dark' : 'light'); } catch { /* storage blocked */ }
  }, [dark]);
  return [dark, setDark];
}

export default function Layout() {
  const { user, can, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useTheme();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  const items = NAV.filter((n) => [].concat(n.perm).some(can));
  const initials = user.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="Main">
      <div className="flex items-center gap-2 px-5 py-5">
        <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Walnut Technologies" className="h-9 w-auto dark:invert" />
      </div>
      <ul className="flex-1 space-y-0.5 px-3">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => cx(
                'flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition',
                isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-subtle hover:text-ink',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="border-t border-line p-3">
        <NavLink
          to="/security"
          className={({ isActive }) => cx('flex items-center gap-3 rounded-lg px-3 py-2 transition', isActive ? 'bg-accent/10' : 'hover:bg-subtle')}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">{initials}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold">{user.name}</span>
            <span className="block truncate text-xs text-muted">{ROLE_LABELS[user.role]}</span>
          </span>
          <FiShield className="h-4 w-4 text-muted" aria-label="Account security" />
        </NavLink>
        <div className="mt-2 flex gap-1">
          <button type="button" onClick={() => setDark(!dark)} className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-muted hover:bg-subtle hover:text-ink">
            {dark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            {dark ? 'Light' : 'Dark'}
          </button>
          <button type="button" onClick={logout} className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-muted hover:bg-subtle hover:text-ink">
            <FiLogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-line bg-surface shadow-pop">
            <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-md p-1.5 text-muted hover:bg-subtle" aria-label="Close menu">
              <FiX className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setOpen(true)} className="rounded-md p-1.5 hover:bg-subtle" aria-label="Open menu">
            <FiMenu className="h-5 w-5" />
          </button>
          <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Walnut Technologies" className="h-6 w-auto dark:invert" />
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
