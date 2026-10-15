import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import { LeadStatusBadge } from './Leads';
import { Alert, Badge, Card, EmptyState, PageHeader, PageLoader } from '../components/ui';
import { api } from '../lib/api';
import { LEAD_TYPE_LABELS, timeAgo } from '../lib/format';

function Stat({ label, value, hint, to }) {
  const body = (
    <div className="card h-full p-4 transition hover:border-accent/40">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      {hint && <p className="mt-1 truncate text-xs text-muted">{hint}</p>}
    </div>
  );
  return to ? <Link to={to} className="block">{body}</Link> : body;
}

// 30-day bar chart of enquiries, newest on the right.
function LeadsChart({ daily }) {
  const days = [];
  const byDate = Object.fromEntries(daily.map((d) => [d.date, d.count]));
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    days.push({ key, count: byDate[key] || 0, label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) });
  }
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((s, d) => s + d.count, 0);

  return (
    <Card title="Enquiries — last 30 days" actions={<span className="text-sm font-semibold tabular-nums">{total}</span>}>
      <div className="flex h-32 items-end gap-[3px]" role="img" aria-label={`${total} enquiries in the last 30 days`}>
        {days.map((d) => (
          <div key={d.key} className="group relative flex h-full flex-1 items-end">
            <div className="w-full rounded-t-sm bg-accent/80 transition group-hover:bg-accent" style={{ height: d.count ? `${Math.max(6, (d.count / max) * 100)}%` : '2px', opacity: d.count ? 1 : 0.25 }} />
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] text-bg group-hover:block">
              {d.label}: {d.count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        <span>{days[0].label}</span>
        <span>Today</span>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard'], queryFn: () => api('/dashboard') });

  if (isLoading) return <PageLoader />;
  if (error) return <Alert>{error.message}</Alert>;

  const firstName = user.name.split(' ')[0];
  const { leads, content, activity } = data;

  return (
    <>
      <PageHeader title={`Hello, ${firstName}`} description="Here's what's happening with the website." />

      {content?.pendingChanges.length > 0 && (
        <Alert tone="warn" className="mb-6">
          {content.pendingChanges.length} section{content.pendingChanges.length > 1 ? 's have' : ' has'} unpublished changes.{' '}
          <Link to="/publish" className="font-semibold underline">Review and publish</Link>
        </Alert>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {leads && (
          <>
            <Stat label="New leads" value={leads.newCount} hint={Object.entries(leads.newByType).map(([t, n]) => `${n} ${LEAD_TYPE_LABELS[t].toLowerCase()}`).join(' · ') || 'All caught up'} to="/leads?status=new" />
            <Stat label="Last 7 days" value={leads.weekCount} hint="Enquiries received" to="/leads" />
          </>
        )}
        {content && (
          <>
            <Stat label="Unpublished" value={content.pendingChanges.length} hint="Sections with draft changes" to="/publish" />
            <Stat
              label="Last publish"
              value={content.lastPublish ? timeAgo(content.lastPublish.at) : 'Never'}
              hint={content.lastPublish ? `by ${content.lastPublish.by}` : undefined}
              to="/publish"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {leads && <LeadsChart daily={leads.daily} />}

        {leads && (
          <Card title="Latest enquiries" padded={false} actions={<Link to="/leads" className="flex items-center gap-1 text-xs font-semibold text-accent">All <FiArrowRight /></Link>}>
            {leads.recent.length ? (
              <ul className="divide-y divide-line">
                {leads.recent.map((l) => (
                  <li key={l.id}>
                    <Link to={`/leads/${l.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-subtle">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{l.name}{l.company && <span className="text-muted"> · {l.company}</span>}</p>
                        <p className="truncate text-xs text-muted">{LEAD_TYPE_LABELS[l.type]}{l.subject && ` — ${l.subject}`}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <LeadStatusBadge status={l.status} />
                        <span className="text-[11px] text-muted">{timeAgo(l.createdAt)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No enquiries yet">Website form submissions will appear here.</EmptyState>
            )}
          </Card>
        )}

        {activity && (
          <Card title="Recent activity" padded={false} className="lg:col-span-2" actions={<Link to="/audit" className="flex items-center gap-1 text-xs font-semibold text-accent">Audit log <FiArrowRight /></Link>}>
            <ul className="divide-y divide-line">
              {activity.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                  <Badge>{a.action}</Badge>
                  <span className="min-w-0 flex-1 truncate text-muted">{a.actorEmail || 'system'}{a.target && ` → ${a.target}`}</span>
                  <span className="shrink-0 text-xs text-muted">{timeAgo(a.at)}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </>
  );
}
