import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiSearch, FiUpload } from 'react-icons/fi';
import { api } from '../lib/api';
import { Alert, Button, Modal, Spinner } from './ui';

export function useUpload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file) => {
      const form = new FormData();
      form.append('file', file);
      return api('/media-library', { method: 'POST', form });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });
}

// Modal to pick an image from the library or upload a new one.
export default function MediaPicker({ open, onClose, onSelect }) {
  const [q, setQ] = useState('');
  const fileRef = useRef(null);
  const upload = useUpload();
  const { data, isLoading } = useQuery({
    queryKey: ['media', q, 1],
    queryFn: () => api(`/media-library?q=${encodeURIComponent(q)}`),
    enabled: open,
  });

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const d = await upload.mutateAsync(file).catch(() => null);
    if (d) onSelect(d.media.url);
  }

  return (
    <Modal open={open} onClose={onClose} title="Choose an image" wide>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search images</span>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder="Search by file name or alt text" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        <Button icon={FiUpload} loading={upload.isPending} onClick={() => fileRef.current?.click()}>Upload new</Button>
      </div>
      {upload.error && <Alert className="mb-4">{upload.error.message}</Alert>}
      {isLoading ? (
        <div className="flex justify-center py-10 text-muted"><Spinner /></div>
      ) : data?.media.length ? (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {data.media.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => onSelect(m.url)} className="group block w-full text-left">
                <span className="block aspect-square overflow-hidden rounded-lg border border-line bg-subtle group-hover:border-accent group-focus-visible:border-accent">
                  <img src={m.url} alt={m.alt} loading="lazy" className="h-full w-full object-contain" />
                </span>
                <span className="mt-1 block truncate text-[11px] text-muted">{m.originalName}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-muted">No images yet — upload one. Existing website images can still be used by typing their path (e.g. /images/products/name.webp).</p>
      )}
    </Modal>
  );
}
