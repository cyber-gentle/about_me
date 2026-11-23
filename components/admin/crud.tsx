'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/* ------------------------------------------------------------------ */
/* CRUD hook - list + create + update + delete + reorder               */
/* ------------------------------------------------------------------ */

export type CrudRow = { id: string; sort_order: number };

export function useCrud<T extends CrudRow>(table: string) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from(table)
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (err) setError(err.message);
    else setRows((data ?? []) as T[]);
    setLoading(false);
  }, [table]);

  useEffect(() => {
    load();
  }, [load]);

  const nextSort = () =>
    rows.reduce((m, r) => Math.max(m, r.sort_order), -1) + 1;

  const create = async (values: Record<string, unknown>) => {
    setError('');
    const { error: err } = await supabase
      .from(table)
      .insert({ ...values, sort_order: nextSort() });
    if (err) {
      setError(err.message);
      return false;
    }
    await load();
    return true;
  };

  const update = async (id: string, values: Record<string, unknown>) => {
    setError('');
    const { error: err } = await supabase
      .from(table)
      .update(values)
      .eq('id', id);
    if (err) {
      setError(err.message);
      return false;
    }
    await load();
    return true;
  };

  const remove = async (id: string) => {
    setError('');
    const { error: err } = await supabase.from(table).delete().eq('id', id);
    if (err) {
      setError(err.message);
      return false;
    }
    await load();
    return true;
  };

  /** Swap sort_order with the neighbour above/below, then reload */
  const move = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= rows.length) return;
    const a = rows[index];
    const b = rows[j];
    setError('');
    const [r1, r2] = await Promise.all([
      supabase.from(table).update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from(table).update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    if (r1.error || r2.error) {
      setError(r1.error?.message || r2.error?.message || 'Move failed');
      return;
    }
    await load();
  };

  return { rows, loading, error, load, create, update, remove, move, nextSort };
}

/* ------------------------------------------------------------------ */
/* UI primitives                                                       */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/50">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-[#4F8BFF]/60 focus:bg-white/[0.05]"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/50">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-[#4F8BFF]/60 focus:bg-white/[0.05]"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/50">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-[#4F8BFF]/60 [&>option]:bg-[#0a0a12]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Btn({
  children,
  onClick,
  variant = 'ghost',
  disabled,
  title,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit';
}) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const styles = {
    primary:
      'bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF] text-white shadow-[0_4px_20px_rgba(79,139,255,0.35)] hover:shadow-[0_6px_28px_rgba(79,139,255,0.5)]',
    ghost:
      'border border-white/10 bg-white/5 text-white/80 hover:border-white/25 hover:bg-white/10 hover:text-white',
    danger:
      'border border-red-500/30 bg-red-500/10 text-red-300 hover:border-red-500/50 hover:bg-red-500/20',
  } as const;
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      {message}
    </div>
  );
}

export function ItemCard({
  title,
  subtitle,
  index,
  count,
  busy,
  onUp,
  onDown,
  onEdit,
  onDelete,
  children,
}: {
  title: string;
  subtitle?: string;
  index: number;
  count: number;
  busy: boolean;
  onUp: () => void;
  onDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl glass-card p-4 transition-all hover:border-white/20">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-white/30">
              #{index + 1}
            </span>
            <h3 className="truncate font-display text-sm font-semibold text-white">
              {title}
            </h3>
            {subtitle && (
              <span className="truncate font-mono text-[10px] text-white/40">
                {subtitle}
              </span>
            )}
          </div>
          {children}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            title="Move up"
            disabled={busy || index === 0}
            onClick={onUp}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/25 hover:text-white disabled:opacity-30"
          >
            <ArrowUp size={12} />
          </button>
          <button
            title="Move down"
            disabled={busy || index === count - 1}
            onClick={onDown}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/25 hover:text-white disabled:opacity-30"
          >
            <ArrowDown size={12} />
          </button>
          <button
            title="Edit"
            onClick={onEdit}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/60 transition-all hover:border-[#4F8BFF]/50 hover:text-[#7FE7FF]"
          >
            <Pencil size={12} />
          </button>
          <button
            title="Delete"
            disabled={busy}
            onClick={onDelete}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-red-500/20 bg-red-500/5 text-red-300/70 transition-all hover:border-red-500/50 hover:bg-red-500/15 hover:text-red-300 disabled:opacity-30"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoadingRows() {
  return (
    <div className="flex items-center justify-center py-10 text-white/40">
      <Loader2 size={22} className="animate-spin text-[#7FE7FF]" />
    </div>
  );
}

export function EmptyHint({ what }: { what: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center">
      <p className="text-sm text-white/50">
        Nothing in the database yet for {what}.
      </p>
      <p className="mt-1 text-xs text-white/30">
        The public site is showing built-in defaults. Add your first entry
        below to take control.
      </p>
    </div>
  );
}

export function DeleteConfirm({
  onConfirm,
  onCancel,
  busy,
  what,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  busy: boolean;
  what: string;
}) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
      <p className="mb-2 text-xs text-red-200">
        Delete &ldquo;{what}&rdquo;? This cannot be undone.
      </p>
      <div className="flex gap-2">
        <Btn variant="danger" onClick={onConfirm} disabled={busy}>
          {busy ? <Loader2 size={12} className="animate-spin" /> : null}
          Delete
        </Btn>
        <Btn onClick={onCancel} disabled={busy}>
          Cancel
        </Btn>
      </div>
    </div>
  );
}
