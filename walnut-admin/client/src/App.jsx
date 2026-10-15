import { Link, Navigate, Outlet, createBrowserRouter, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { useAuth } from './auth/AuthContext';
import Layout from './components/Layout';
import { EmptyState, PageLoader } from './components/ui';
import Audit from './pages/Audit';
import { ContentEdit, ContentIndex } from './pages/Content';
import Dashboard from './pages/Dashboard';
import LeadDetail from './pages/LeadDetail';
import Leads from './pages/Leads';
import Media from './pages/Media';
import Publish from './pages/Publish';
import Security from './pages/Security';
import Users from './pages/Users';
import Login from './pages/auth/Login';
import MfaRequired from './pages/auth/MfaRequired';
import { AcceptInvite, ForgotPassword, ResetPassword } from './pages/auth/PasswordPages';

function RequireAuth() {
  const { status, user } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <PageLoader />;
  if (status === 'signed-out') return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (user.mfaSetupRequired) return <MfaRequired />;
  return <Outlet />;
}

function SignedOutOnly() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <PageLoader />;
  if (status === 'signed-in') return <Navigate to={location.state?.from || '/'} replace />;
  return <Outlet />;
}

function Allow({ perm, children }) {
  const { can } = useAuth();
  if (![].concat(perm).some(can)) {
    return (
      <EmptyState icon={FiLock} title="No access">
        Your role doesn't include this area. Ask a Super Admin if you need it. <Link to="/" className="text-accent underline">Go to dashboard</Link>
      </EmptyState>
    );
  }
  return children;
}

function NotFound() {
  return <EmptyState title="Page not found"><Link to="/" className="text-accent underline">Back to dashboard</Link></EmptyState>;
}

export const router = createBrowserRouter([
  {
    element: <SignedOutOnly />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
    ],
  },
  // Reachable whether or not someone is signed in on this browser.
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/accept-invite', element: <AcceptInvite /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/leads', element: <Allow perm={['leads:read', 'applications:read']}><Leads /></Allow> },
          { path: '/leads/:id', element: <Allow perm={['leads:read', 'applications:read']}><LeadDetail /></Allow> },
          { path: '/content', element: <Allow perm="content:read"><ContentIndex /></Allow> },
          { path: '/content/:key', element: <Allow perm="content:read"><ContentEdit /></Allow> },
          { path: '/publish', element: <Allow perm="content:read"><Publish /></Allow> },
          { path: '/media', element: <Allow perm="media:read"><Media /></Allow> },
          { path: '/users', element: <Allow perm="users:manage"><Users /></Allow> },
          { path: '/audit', element: <Allow perm="audit:read"><Audit /></Allow> },
          { path: '/security', element: <Security /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
  ],
  { basename: '/admin' },
);
