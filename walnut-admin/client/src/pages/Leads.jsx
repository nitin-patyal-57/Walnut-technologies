import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { FiDownload, FiInbox, FiPaperclip, FiSearch } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import { Alert, Badge, Button, EmptyState, PageHeader, Pagination, Spinner, useToast } from '../components/ui';
import { api, download } from '../lib/api';
import { fmtDateTime, LEAD_STATUS_LABELS, LEAD_TYPE_LABELS, timeAgo } from '../lib/format';

const STATUS_TONE = { new: 'accent', contacted: 'warn', qualified: 'warn', won: 'ok', lost: 'neutral', spam: 'danger' };

export function LeadStatusBadge({ status }) {
  return <Badge tone={STATUS_TONE[status]}>{LEAD_STATUS_LABELS[status]}</Badge>;
}

export default function Leads() {
  const { can } = useAuth();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [exporting, setExporting] = useState(false);

  const filters = Object.fromEntries(['type', 'status', 'assigned', 'q', 'from', 'to', 'page'].map((k) => [k, params.get(k) || '']));
  const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['leads', qs],
    queryFn: () => api(`/leads?${qs}`),
    placeholderData: keepPreviousData,
  });
  const { data: assignees } = useQuery({ queryKey: ['assignees'], queryFn: () => api('/leads/assignees') });

  // Debounced search box → URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== (params.get('q') || '')) setFilter('q', search);
    }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  function setFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next, { replace: true });
  }

  const types = [
    ...(can('leads:read') ? ['contact', 'quote', 'resource'] : []),
    ...(can('applications:read') ? ['application'] : []),
  ];

  async function exportCsv() {
    setExporting(true);
    try {
      const exportQs = new URLSearchParams(Object.entries(filters).filter(([k, v]) => v && k !== 'page')).toString();
      await download(`/leads/export.csv?${exportQs}`, 'walnut-leads.csv');
    } catch (e) {
      toast(e.message, 'danger');
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Leads"
        description="Every form submitted on the website — contact, quotes, resource requests and job applications."
        actions={<Button variant="secondary" icon={FiDownload} loading={exporting} onClick={exportCsv}>Export CSV</Button>}
      />

      <div className="card mb-4 grid grid-cols-2 gap-2 p-3 sm:gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto_auto]">
        <label className="relative col-span-2 lg:col-span-1">
          <span className="sr-only">Search</span>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder="Search name, email, company, message…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <select className="input" value={filters.type} onChange={(e) => setFilter('type', e.target.value)} aria-label="Type">
          <option value="">All types</option>
          {types.map((t) => <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>)}
        </select>
        <select className="input" value={filters.status} onChange={(e) => setFilter('status', e.target.value)} aria-label="Status">
          <option value="">Open (not spam)</option>
          {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="input" value={filters.assigned} onChange={(e) => setFilter('assigned', e.target.value)} aria-label="Assigned to">
          <option value="">Anyone</option>
          <option value="me">Assigned to me</option>
          <option value="none">Unassigned</option>
          {assignees?.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <input type="date" className="input" value={filters.from} onChange={(e) => setFilter('from', e.target.value)} aria-label="From date" />
        <input type="date" className="input" value={filters.to} onChange={(e) => setFilter('to', e.target.value)} aria-label="To date" />
      </div>

      {error && <Alert className="mb-4">{error.message}</Alert>}

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-xs text-muted">
          <span>{data ? `${data.total} result${data.total === 1 ? '' : 's'}` : ' '}</span>
          {isFetching && <Spinner className="h-4 w-4" />}
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12 text-muted"><Spinner /></div>
        ) : data?.leads.length ? (
          <>
            {/* Table on wide screens */}
            <table className="hidden w-full text-left md:table">
              <thead className="bg-subtle/60 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2 font-semibold">Name</th>
                  <th className="px-4 py-2 font-semibold">Type</th>
                  <th className="px-4 py-2 font-semibold">About</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">Assigned</th>
                  <th className="px-4 py-2 text-right font-semibold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.leads.map((l) => (
                  <tr key={l.id} className="hover:bg-subtle/60">
                    <td className="max-w-[220px] px-4 py-3">
                      <Link to={`/leads/${l.id}`} className="block truncate font-semibold hover:text-accent">{l.name}</Link>
                      <span className="block truncate text-xs text-muted">{l.company || l.email}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{LEAD_TYPE_LABELS[l.type]}</td>
                    <td className="max-w-[260px] px-4 py-3">
                      <span className="flex items-center gap-1.5 truncate">
                        {l.hasResume && <FiPaperclip className="h-3.5 w-3.5 shrink-0 text-muted" aria-label="Has resume" />}
                        <span className="truncate">{l.subject || '—'}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3"><LeadStatusBadge status={l.status} /></td>
                    <td className="px-4 py-3 text-muted">{l.assignedTo?.name || '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-muted" title={fmtDateTime(l.createdAt)}>{timeAgo(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Cards on phones */}
            <ul className="divide-y divide-line md:hidden">
              {data.leads.map((l) => (
                <li key={l.id}>
                  <Link to={`/leads/${l.id}`} className="block px-4 py-3 hover:bg-subtle">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 truncate font-semibold">{l.name}</p>
                      <LeadStatusBadge status={l.status} />
                    </div>
                    <p className="truncate text-xs text-muted">{LEAD_TYPE_LABELS[l.type]} · {l.subject || l.email}</p>
                    <p className="mt-1 text-[11px] text-muted">{timeAgo(l.createdAt)}{l.assignedTo && ` · ${l.assignedTo.name}`}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <Pagination page={data.page} pages={data.pages} onChange={(p) => setFilter('page', String(p))} />
          </>
        ) : (
          <EmptyState icon={FiInbox} title="No leads match">Try clearing a filter.</EmptyState>
        )}
      </div>
    </>
  );
}
