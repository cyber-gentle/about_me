'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { useAdmin } from './admin-context';
import { Button, Card, EmptyState, Field, Modal, Spinner, TextArea, TextInput, Toggle, inputCls } from './ui';

export type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'range' | 'tags' | 'color' | 'checkbox' | 'select' | 'image';
  required?: boolean;
  placeholder?: string;
  help?: string;
  maxLength?: number;
  options?: { value: string; label: string }[];
};

type Row = Record<string, unknown> & { id: string; sort_order: number };

type Props = {
  table: string;
  itemLabel: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  /** Rows are scoped to these column values (also applied to new rows). */
  filter?: Record<string, string>;
  renderRow: (row: Row) => React.ReactNode;
  onChanged?: () => void;
  compact?: boolean;
};

const ACCENTS = ['#4F8BFF', '#8A5CFF', '#7FE7FF', '#5EE6A8', '#FFB86B', '#FF6B9A'];

export function ResourceManager({ table, itemLabel, fields, defaults, filter, renderRow, onChanged, compact }: Props) {
  const { sb, publish, notify } = useAdmin();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const filterKey = JSON.stringify(filter ?? {});

  const load = useCallback(async () => {
    let q = sb.from(table).select('*');
    for (const [k, v] of Object.entries(JSON.parse(filterKey) as Record<string, string>)) q = q.eq(k, v);
    const { data, error } = await q.order('sort_order').order('created_at');
    if (error) notify(`Could not load ${itemLabel.toLowerCase()}s: ${error.message}`, 'error');
    setRows((data as Row[]) ?? []);
  }, [sb, table, filterKey, itemLabel, notify]);

  useEffect(() => {
    load();
  }, [load]);

  const afterChange = async () => {
    await load();
    onChanged?.();
    publish();
  };

  const save = async () => {
    if (!draft) return;
    for (const f of fields) {
      if (f.required && !String(draft[f.key] ?? '').trim()) {
        notify(`${f.label} is required.`, 'error');
        return;
      }
    }
    setSaving(true);
    const { id, created_at: _created, ...payload } = draft;
    for (const f of fields) {
      if ((f.type === 'url' || f.type === 'image') && payload[f.key] === '') payload[f.key] = null;
    }
    const res = id
      ? await sb.from(table).update(payload).eq('id', id as string)
      : await sb.from(table).insert({
          ...payload,
          ...(filter ?? {}),
          sort_order: rows && rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0,
        });
    setSaving(false);
    if (res.error) return notify(res.error.message, 'error');
    notify(`${itemLabel} ${id ? 'updated' : 'added'}.`);
    setDraft(null);
    afterChange();
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete this ${itemLabel.toLowerCase()}? This cannot be undone.`)) return;
    setBusyId(row.id);
    const { error } = await sb.from(table).delete().eq('id', row.id);
    setBusyId(null);
    if (error) return notify(error.message, 'error');
    notify(`${itemLabel} deleted.`);
    afterChange();
  };

  const move = async (index: number, dir: -1 | 1) => {
    if (!rows) return;
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const reordered = [...rows];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setRows(reordered);
    const changed = reordered.map((r, i) => ({ r, i })).filter(({ r, i }) => r.sort_order !== i);
    const results = await Promise.all(changed.map(({ r, i }) => sb.from(table).update({ sort_order: i }).eq('id', r.id)));
    const failed = results.find((x) => x.error);
    if (failed?.error) notify(failed.error.message, 'error');
    afterChange();
  };

  if (!rows) return <Spinner />;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={compact ? 'secondary' : 'primary'} size={compact ? 'sm' : 'md'} onClick={() => setDraft({ ...defaults })}>
          <Plus size={16} aria-hidden="true" /> Add {itemLabel.toLowerCase()}
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState title={`No ${itemLabel.toLowerCase()}s yet`}>Click “Add {itemLabel.toLowerCase()}” to create one.</EmptyState>
      ) : (
        <Card className="divide-y divide-white/10">
          {rows.map((row, i) => (
            <div key={row.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="rounded p-0.5 text-white/50 hover:text-white disabled:opacity-20"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1}
                  aria-label="Move down"
                  className="rounded p-0.5 text-white/50 hover:text-white disabled:opacity-20"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
              <div className="min-w-0 flex-1">{renderRow(row)}</div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="sm" onClick={() => setDraft({ ...row })} aria-label="Edit">
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => remove(row)} loading={busyId === row.id} aria-label="Delete">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Modal
        open={!!draft}
        title={draft?.id ? `Edit ${itemLabel.toLowerCase()}` : `New ${itemLabel.toLowerCase()}`}
        onClose={() => setDraft(null)}
        footer={
          <>
            <Button onClick={() => setDraft(null)}>Cancel</Button>
            <Button variant="primary" onClick={save} loading={saving}>
              Save
            </Button>
          </>
        }
      >
        {draft && (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            {fields.map((f) => (
              <FieldInput key={f.key} field={f} value={draft[f.key]} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
            ))}
            <button type="submit" hidden />
          </form>
        )}
      </Modal>
    </div>
  );
}

function FieldInput({ field: f, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const id = useId();
  const label = f.required ? `${f.label} *` : f.label;

  switch (f.type) {
    case 'textarea':
      return (
        <TextArea label={label} help={f.help} placeholder={f.placeholder} maxLength={f.maxLength}
          value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
      );
    case 'checkbox':
      return <Toggle label={f.label} help={f.help} checked={!!value} onChange={onChange} />;
    case 'range': {
      const n = Number(value ?? 0);
      return (
        <Field label={`${f.label}: ${n}%`} help={f.help} htmlFor={id}>
          <div className="flex items-center gap-3">
            <input id={id} type="range" min={0} max={100} value={n} onChange={(e) => onChange(Number(e.target.value))}
              className="flex-1 accent-[#4F8BFF]" />
            <input type="number" min={0} max={100} value={n} aria-label={`${f.label} value`}
              onChange={(e) => onChange(Math.max(0, Math.min(100, Number(e.target.value))))}
              className={`${inputCls} w-20`} />
          </div>
        </Field>
      );
    }
    case 'tags':
      return (
        <TagsInput label={label} help={f.help ?? 'Press Enter or comma to add.'} value={(value as string[]) ?? []} onChange={onChange} />
      );
    case 'color':
      return (
        <Field label={label} help={f.help} htmlFor={id}>
          <div className="flex flex-wrap items-center gap-2">
            {ACCENTS.map((c) => (
              <button key={c} type="button" onClick={() => onChange(c)} aria-label={`Use colour ${c}`}
                className={`h-7 w-7 rounded-full border-2 ${value === c ? 'border-white' : 'border-transparent'}`}
                style={{ background: c }} />
            ))}
            <input id={id} type="color" value={(value as string) || '#4F8BFF'} onChange={(e) => onChange(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded border border-white/10 bg-transparent" aria-label="Custom colour" />
          </div>
        </Field>
      );
    case 'select':
      return (
        <Field label={label} help={f.help} htmlFor={id}>
          <select id={id} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls}>
            {f.options?.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#0c0c0f]">
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      );
    case 'image':
      return <ImageInput label={label} help={f.help} value={(value as string) ?? ''} onChange={onChange} />;
    default:
      return (
        <TextInput label={label} help={f.help} placeholder={f.placeholder} maxLength={f.maxLength}
          type={f.type === 'url' ? 'url' : 'text'} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
      );
  }
}

function TagsInput({ label, help, value, onChange }: { label: string; help?: string; value: string[]; onChange: (v: string[]) => void }) {
  const id = useId();
  const [text, setText] = useState('');
  const add = () => {
    const parts = text.split(',').map((t) => t.trim()).filter(Boolean);
    if (parts.length) onChange(Array.from(new Set([...value, ...parts])));
    setText('');
  };
  return (
    <Field label={label} help={help} htmlFor={id}>
      <div className={`${inputCls} flex flex-wrap items-center gap-1.5`}>
        {value.map((t) => (
          <span key={t} className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/85">
            {t}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`}
              className="text-white/50 hover:text-white">
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add();
            } else if (e.key === 'Backspace' && !text && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={add}
          className="min-w-[100px] flex-1 bg-transparent text-sm outline-none"
        />
      </div>
    </Field>
  );
}

export function ImageInput({
  label,
  help,
  value,
  onChange,
  folder = 'projects',
  accept = 'image/png,image/jpeg,image/webp,image/gif',
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (v: string) => void;
  folder?: string;
  accept?: string;
}) {
  const { sb, notify } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const id = useId();
  const isImage = accept.startsWith('image');

  const upload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return notify('File must be under 5 MB.', 'error');
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await sb.storage.from('portfolio').upload(path, file, { cacheControl: '31536000', contentType: file.type });
    setUploading(false);
    if (error) return notify(`Upload failed: ${error.message}`, 'error');
    onChange(sb.storage.from('portfolio').getPublicUrl(path).data.publicUrl);
  };

  return (
    <Field label={label} help={help ?? 'Upload a file (max 5 MB) or paste a URL.'} htmlFor={id}>
      {isImage && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mb-2 h-32 w-full rounded-lg border border-white/10 object-cover" />
      )}
      <div className="flex gap-2">
        <input id={id} type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" className={inputCls} />
        <label className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/85 hover:bg-white/10">
          <Upload size={14} aria-hidden="true" />
          {uploading ? 'Uploading…' : 'Upload'}
          <input type="file" accept={accept} className="sr-only" disabled={uploading}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
      </div>
    </Field>
  );
}
