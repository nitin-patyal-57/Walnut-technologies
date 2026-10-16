import { useState } from 'react';
import { FiArrowDown, FiArrowUp, FiChevronDown, FiChevronRight, FiCopy, FiImage, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import MediaPicker from './MediaPicker';
import { Button, cx } from './ui';

// Where website-relative image paths (/images/...) are previewed from.
export const WEBSITE_URL = (import.meta.env.VITE_WEBSITE_URL || 'https://walnut-technologies.vercel.app').replace(/\/$/, '');
export const previewSrc = (src) => (src?.startsWith('/') ? WEBSITE_URL + src : src);

// Empty value for a field definition (used when adding list items).
export function emptyValue(field) {
  switch (field.type) {
    case 'tags':
    case 'list':
      return [];
    case 'object':
      return Object.fromEntries(field.fields.map((f) => [f.name, emptyValue(f)]));
    case 'number':
      return null;
    default:
      return '';
  }
}

export const emptyItem = (fields) => Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]));

// ─── Tailwind gradient preview ────────────────────────────────────────
const TW = {
  slate: ['#64748b', '#475569'], gray: ['#6b7280', '#4b5563'], red: ['#ef4444', '#dc2626'], orange: ['#f97316', '#ea580c'],
  amber: ['#f59e0b', '#d97706'], yellow: ['#eab308', '#ca8a04'], lime: ['#84cc16', '#65a30d'], green: ['#22c55e', '#16a34a'],
  emerald: ['#10b981', '#059669'], teal: ['#14b8a6', '#0d9488'], cyan: ['#06b6d4', '#0891b2'], sky: ['#0ea5e9', '#0284c7'],
  blue: ['#3b82f6', '#2563eb'], indigo: ['#6366f1', '#4f46e5'], violet: ['#8b5cf6', '#7c3aed'], purple: ['#a855f7', '#9333ea'],
  pink: ['#ec4899', '#db2777'], rose: ['#f43f5e', '#e11d48'],
};
function twColor(cls) {
  const m = /-(\w+)-(\d+)$/.exec(cls || '');
  if (!m || !TW[m[1]]) return null;
  return TW[m[1]][Number(m[2]) >= 600 ? 1 : 0];
}
function gradientCss(value) {
  const parts = (value || '').split(/\s+/);
  const from = twColor(parts.find((p) => p.startsWith('from-')));
  const to = twColor(parts.find((p) => p.startsWith('to-')));
  return from ? `linear-gradient(135deg, ${from}, ${to || from})` : undefined;
}

// ─── Individual inputs ────────────────────────────────────────────────
function TagsInput({ id, value = [], onChange, max }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...value, ...parts]);
    setDraft('');
  };
  return (
    <div className="rounded-lg border border-line bg-surface p-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25">
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {value.map((tag, i) => (
            <li key={`${tag}-${i}`} className="inline-flex items-center gap-1 rounded-md bg-subtle py-1 pl-2 pr-1 text-xs font-medium">
              {tag}
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded p-0.5 text-muted hover:bg-line hover:text-ink" aria-label={`Remove ${tag}`}>
                <FiX className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        className="w-full bg-transparent px-1 text-sm outline-none placeholder:text-muted/70"
        placeholder="Type and press Enter (or paste comma-separated)"
        value={draft}
        maxLength={max ? max * 10 : undefined}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
          if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
      />
    </div>
  );
}

function ImageInput({ id, value, onChange }) {
  const [picking, setPicking] = useState(false);
  const [broken, setBroken] = useState(false);
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setPicking(true)}
        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-subtle hover:border-accent"
        aria-label="Choose image"
      >
        {value && !broken ? (
          <img src={previewSrc(value)} alt="" className="h-full w-full object-contain" onError={() => setBroken(true)} onLoad={() => setBroken(false)} />
        ) : (
          <FiImage className="h-6 w-6 text-muted" />
        )}
      </button>
      <div className="min-w-0 flex-1 space-y-2">
        <input id={id} className="input font-mono text-xs" placeholder="/images/products/name.webp" value={value || ''} onChange={(e) => { setBroken(false); onChange(e.target.value); }} />
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setPicking(true)}>Choose or upload</Button>
          {value && <Button variant="ghost" size="sm" onClick={() => onChange('')}>Clear</Button>}
        </div>
        {broken && value && <p className="text-xs text-warn">Preview unavailable — check the path.</p>}
      </div>
      <MediaPicker open={picking} onClose={() => setPicking(false)} onSelect={(url) => { setBroken(false); onChange(url); setPicking(false); }} />
    </div>
  );
}

// ─── Generic field renderer ───────────────────────────────────────────
export function FieldInput({ field, value, onChange, idPrefix, readOnly, data }) {
  const id = `${idPrefix}-${field.name}`;
  const common = { id, disabled: readOnly };

  // `when` hides a field until its controlling field has the right value, so a
  // block editor only shows the inputs that apply to the chosen block type.
  if (field.when && data) {
    const current = data[field.when.field];
    const wanted = Array.isArray(field.when.equals) ? field.when.equals : [field.when.equals];
    if (!wanted.includes(current)) return null;
  }

  let input;
  switch (field.type) {
    case 'textarea':
      input = <textarea {...common} className="input min-h-[96px]" maxLength={field.max} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'number':
      input = <input {...common} type="number" className="input sm:max-w-[160px]" min={field.min} max={field.max} value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />;
      break;
    case 'select':
      input = (
        <select {...common} className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {!field.required && <option value="">—</option>}
          {field.required && !value && <option value="" disabled>Choose…</option>}
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
      break;
    case 'tags':
      input = readOnly ? <p>{(value || []).join(', ')}</p> : <TagsInput id={id} value={value} onChange={onChange} max={field.max} />;
      break;
    case 'image':
      input = readOnly ? <img src={previewSrc(value)} alt="" className="h-20 w-20 rounded-lg border border-line object-contain" /> : <ImageInput id={id} value={value} onChange={onChange} />;
      break;
    case 'gradient':
      input = (
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 shrink-0 rounded-lg border border-line" style={{ background: gradientCss(value) }} aria-hidden />
          <input {...common} className="input font-mono text-xs" maxLength={field.max} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
      break;
    case 'object':
      return (
        <fieldset className="rounded-lg border border-line p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">{field.label}</legend>
          <FieldGroup fields={field.fields} value={value || {}} onChange={onChange} idPrefix={id} readOnly={readOnly} />
        </fieldset>
      );
    case 'list':
      return <ListEditor field={field} value={value || []} onChange={onChange} idPrefix={id} readOnly={readOnly} nested />;
    default:
      input = (
        <input
          {...common}
          type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
          className="input"
          maxLength={field.max}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }

  const length = typeof value === 'string' && field.max && ['text', 'textarea'].includes(field.type || 'text') ? value.length : null;
  return (
    <div>
      <label htmlFor={id} className="label flex items-baseline justify-between gap-2">
        <span>{field.label}{field.required && <span className="text-danger"> *</span>}</span>
        {length !== null && length > field.max * 0.8 && <span className="font-normal normal-case tracking-normal">{length}/{field.max}</span>}
      </label>
      {input}
      {field.help && <p className="mt-1 text-xs text-muted">{field.help}</p>}
    </div>
  );
}

export function FieldGroup({ fields, value, onChange, idPrefix, readOnly }) {
  return (
    <div className="grid gap-4">
      {fields.map((f) => (
        <FieldInput key={f.name} field={f} data={value} value={value?.[f.name]} onChange={(v) => onChange({ ...value, [f.name]: v })} idPrefix={idPrefix} readOnly={readOnly} />
      ))}
    </div>
  );
}

// ─── Repeatable list (top-level collections and nested lists) ─────────
export function ListEditor({ field, value, onChange, idPrefix, readOnly, nested }) {
  const [openIndex, setOpenIndex] = useState(nested ? null : null);
  const labelKey = field.itemLabel || field.fields[0].name;

  const move = (i, dir) => {
    const next = [...value];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
    if (openIndex === i) setOpenIndex(i + dir);
  };
  const remove = (i) => {
    const label = value[i]?.[labelKey] || `item ${i + 1}`;
    if (!window.confirm(`Remove "${label}"? You can still discard the draft before publishing.`)) return;
    onChange(value.filter((_, j) => j !== i));
    setOpenIndex(null);
  };
  const duplicate = (i) => {
    const copy = structuredClone(value[i]);
    if ('id' in copy && typeof copy.id === 'string') copy.id = `${copy.id}-copy`;
    const next = [...value];
    next.splice(i + 1, 0, copy);
    onChange(next);
    setOpenIndex(i + 1);
  };
  const add = () => {
    onChange([...value, emptyItem(field.fields)]);
    setOpenIndex(value.length);
  };

  const iconBtn = 'rounded-md p-1.5 text-muted hover:bg-subtle hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent';

  return (
    <div>
      {nested && <p className="label">{field.label} <span className="font-normal normal-case tracking-normal">({value.length})</span></p>}
      <ul className={cx('divide-y divide-line overflow-hidden rounded-lg border border-line', !value.length && 'hidden')}>
        {value.map((item, i) => {
          const open = openIndex === i;
          const title = item?.[labelKey] || <span className="italic text-muted">Untitled</span>;
          const thumb = field.fields.find((f) => f.type === 'image');
          return (
            <li key={i} className={open ? 'bg-subtle/40' : ''}>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <button type="button" onClick={() => setOpenIndex(open ? null : i)} className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left hover:text-accent" aria-expanded={open}>
                  {open ? <FiChevronDown className="h-4 w-4 shrink-0" /> : <FiChevronRight className="h-4 w-4 shrink-0" />}
                  {thumb && item?.[thumb.name] && <img src={previewSrc(item[thumb.name])} alt="" className="h-7 w-7 shrink-0 rounded border border-line bg-white object-contain" />}
                  <span className="truncate font-medium">{title}</span>
                </button>
                {!readOnly && (
                  <div className="flex shrink-0 items-center">
                    <button type="button" className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><FiArrowUp className="h-4 w-4" /></button>
                    <button type="button" className={iconBtn} disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><FiArrowDown className="h-4 w-4" /></button>
                    <button type="button" className={cx(iconBtn, 'hidden sm:block')} onClick={() => duplicate(i)} aria-label="Duplicate"><FiCopy className="h-4 w-4" /></button>
                    <button type="button" className={cx(iconBtn, 'hover:!text-danger')} onClick={() => remove(i)} aria-label="Remove"><FiTrash2 className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
              {open && (
                <div className="border-t border-line bg-surface p-4">
                  <FieldGroup fields={field.fields} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} idPrefix={`${idPrefix}-${i}`} readOnly={readOnly} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {!readOnly && (
        <Button variant="secondary" size="sm" icon={FiPlus} className={value.length ? 'mt-2' : ''} onClick={add}>
          Add {nested ? field.label.replace(/s$/, '').toLowerCase() : 'item'}
        </Button>
      )}
    </div>
  );
}
