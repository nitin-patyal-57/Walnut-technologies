import { useRef, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiCopy, FiImage, FiSearch, FiTrash2, FiUpload } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import { useUpload } from '../components/MediaPicker';
import { Alert, Button, ConfirmModal, EmptyState, Field, Modal, PageHeader, Pagination, Spinner, useToast } from '../components/ui';
import { api } from '../lib/api';
import { fmtBytes, fmtDateTime } from '../lib/format';

export default function Media() {
  const { can } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();
  const fileRef = useRef(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [alt, setAlt] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dragging, setDragging] = useState(false);
  const manage = can('media:manage');

  const { data, isLoading } = useQuery({
    queryKey: ['media', q, page],
    queryFn: () => api(`/media-library?q=${encodeURIComponent(q)}&page=${page}`),
    placeholderData: keepPreviousData,
  });
  const upload = useUpload();

  async function uploadFiles(files) {
    let ok = 0;
    for (const file of files) {
      try {
        await upload.mutateAsync(file);
        ok++;
      } catch (e) {
        toast(`${file.name}: ${e.message}`, 'danger');
      }
    }
    if (ok) toast(`${ok} image${ok > 1 ? 's' : ''} uploaded and optimised`);
  }

  const saveAlt = useMutation({
    mutationFn: () => api(`/media-library/${selected.id}`, { method: 'PATCH', body: { alt } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media'] }); toast('Saved'); setSelected(null); },
    onError: (e) => toast(e.message, 'danger'),
  });
  const remove = useMutation({
    mutationFn: () => api(`/media-library/${selected.id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media'] }); toast('Image deleted'); setConfirmDelete(false); setSelected(null); },
    onError: (e) => { setConfirmDelete(false); toast(e.message, 'danger'); },
  });

  const open = (m) => { setSelected(m); setAlt(m.alt || ''); };

  return (
    <div
      onDragOver={(e) => { if (manage) { e.preventDefault(); setDragging(true); } }}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setDragging(false); }}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (manage) uploadFiles([...e.dataTransfer.files]); }}
    >
      <PageHeader
        title="Media Library"
        description="Images are automatically resized (max 2400px), converted to WebP and stripped of metadata on upload."
        actions={manage && (
          <>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { uploadFiles([...e.target.files]); e.target.value = ''; }} />
            <Button icon={FiUpload} loading={upload.isPending} onClick={() => fileRef.current?.click()}>Upload images</Button>
          </>
        )}
      />

      <label className="relative mb-4 block sm:max-w-sm">
        <span className="sr-only">Search</span>
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input className="input pl-9" placeholder="Search by file name or alt text" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
      </label>

      <div className={`card overflow-hidden transition ${dragging ? 'border-accent ring-2 ring-accent/30' : ''}`}>
        {isLoading ? (
          <div className="flex justify-center py-12 text-muted"><Spinner /></div>
        ) : data?.media.length ? (
          <>
            <ul className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {data.media.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => open(m)} className="group block w-full text-left">
                    <span className="block aspect-square overflow-hidden rounded-lg border border-line bg-subtle group-hover:border-accent">
                      <img src={m.url} alt={m.alt} loading="lazy" className="h-full w-full object-contain" />
                    </span>
                    <span className="mt-1 block truncate text-xs font-medium">{m.originalName}</span>
                    <span className="block text-[11px] text-muted">{m.width}×{m.height} · {fmtBytes(m.size)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <Pagination page={data.page} pages={data.pages} onChange={setPage} />
          </>
        ) : (
          <EmptyState icon={FiImage} title={q ? 'No images match' : 'No images yet'}>
            {manage && !q && 'Upload images or drag and drop them here.'}
          </EmptyState>
        )}
      </div>

      <Modal
        open={Boolean(selected) && !confirmDelete}
        onClose={() => setSelected(null)}
        title={selected?.originalName || 'Image'}
        wide
        footer={manage && (
          <>
            <Button variant="danger" icon={FiTrash2} className="mr-auto" onClick={() => setConfirmDelete(true)}>Delete</Button>
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            <Button loading={saveAlt.isPending} onClick={() => saveAlt.mutate()}>Save</Button>
          </>
        )}
      >
        {selected && (
          <div className="grid gap-5 md:grid-cols-[1fr_280px]">
            <div className="flex items-center justify-center rounded-lg border border-line bg-subtle p-2">
              <img src={selected.url} alt={selected.alt} className="max-h-[50vh] w-auto object-contain" />
            </div>
            <div className="space-y-4">
              <Field label="Image URL" help="Paste this into any image field, or use “Choose or upload” in the editor.">
                <div className="flex gap-2">
                  <input className="input font-mono text-xs" readOnly value={selected.url} onFocus={(e) => e.target.select()} />
                  <Button variant="secondary" icon={FiCopy} aria-label="Copy URL" onClick={() => navigator.clipboard.writeText(selected.url).then(() => toast('URL copied'))} />
                </div>
              </Field>
              <Field label="Alt text" htmlFor="alt" help="Describe the image for screen readers and SEO.">
                <textarea id="alt" className="input min-h-[72px]" maxLength={200} value={alt} onChange={(e) => setAlt(e.target.value)} disabled={!manage} />
              </Field>
              <dl className="space-y-1 text-xs text-muted">
                <div>{selected.width}×{selected.height}px · {fmtBytes(selected.size)} WebP</div>
                <div>Uploaded {fmtDateTime(selected.createdAt)} by {selected.uploadedByName}</div>
              </dl>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal open={confirmDelete} title="Delete image?" confirmLabel="Delete" loading={remove.isPending} onConfirm={() => remove.mutate()} onClose={() => setConfirmDelete(false)}>
        Images still used on the website can't be deleted — you'll be told where it's used.
      </ConfirmModal>
      {upload.isPending && <Alert tone="info" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 shadow-pop">Uploading…</Alert>}
    </div>
  );
}
