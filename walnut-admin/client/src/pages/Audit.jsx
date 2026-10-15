import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Badge, EmptyState, PageHeader, Pagination, Spinner } from '../components/ui';
import { api } from '../lib/api';
import { describeUserAgent, fmtDateTime } from '../lib/format';

const ACTIONS = [
  ['', 'All actions'],
  ['auth.', 'Sign-in & security'],
  ['auth.login_failed', 'Failed sign-ins'],
  ['user.', 'User management'],
  ['content.', 'Content'],
  ['media.', 'Media'],
  ['lead', 'Leads'],
];

const tone = (action) => (/failed|locked|reuse|deleted|disabled|reset/.test(action) ? 'danger' : action.startsWith('content.published') ? 'ok' : 'neutral');

export default function Audit() {
  const [action, setAction] = useState('');
  const [actor, setActor] = useState('');
  const [page, setPage] = useState(1);
  const qs = new URLSearchParams({ ...(action && { action }), ...(actor && { actor }), page }).toString();
  const { data, isLoading, isFetching } = useQuery({ queryKey: ['audit', qs], queryFn: () => api(`/audit?${qs}`), placeholderData: keepPreviousData });

  return (
    <>
      <PageHeader title="Audit Log" description="Every sign-in, edit, publish and permission change. Kept for one year." />
      <div className="card mb-4 grid gap-3 p-3 sm:grid-cols-2">
        <select className="input" value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} aria-label="Action">
          {ACTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input className="input" placeholder="Filter by user email" value={actor} onChange={(e) => { setActor(e.target.value); setPage(1); }} aria-label="User" />
      </div>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-xs text-muted">
          <span>{data ? `${data.total} entries` : ' '}</span>
          {isFetching && <Spinner className="h-4 w-4" />}
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12 text-muted"><Spinner /></div>
        ) : data.entries.length ? (
          <>
            <ul className="divide-y divide-line">
              {data.entries.map((e) => (
                <li key={e._id} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[170px_200px_1fr] sm:items-center sm:gap-4">
                  <span className="text-xs text-muted">{fmtDateTime(e.at)}</span>
                  <span><Badge tone={tone(e.action)}>{e.action}</Badge></span>
                  <span className="min-w-0 text-sm">
                    <span className="font-medium">{e.actorEmail || 'system'}</span>
                    {e.target && <span className="text-muted"> → {e.target}</span>}
                    <span className="block truncate text-xs text-muted" title={e.meta ? JSON.stringify(e.meta) : ''}>
                      {e.ip} · {describeUserAgent(e.userAgent)}{e.meta && ` · ${JSON.stringify(e.meta)}`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <Pagination page={data.page} pages={data.pages} onChange={setPage} />
          </>
        ) : (
          <EmptyState title="No entries" />
        )}
      </div>
    </>
  );
}
