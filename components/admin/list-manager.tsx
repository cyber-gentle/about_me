'use client';

import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import {
  useCrud,
  Field,
  TextArea,
  SelectField,
  Btn,
  ErrorBanner,
  ItemCard,
  LoadingRows,
  EmptyHint,
  DeleteConfirm,
  type CrudRow,
} from '@/components/admin/crud';

export type FieldDef = {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  rows?: number;
  required?: boolean;
  /** Parse the raw string input into the DB value (e.g. comma-split arrays) */
  parse?: (v: string) => unknown;
  half?: boolean;
  /** Prefill for new rows */
  default?: string;
};

function draftFrom(fields: FieldDef[], row?: Record<string, unknown>) {
  const draft: Record<string, string> = {};
  for (const f of fields) {
    if (row && row[f.key] !== null && row[f.key] !== undefined) {
      const v = row[f.key];
      draft[f.key] = Array.isArray(v) ? v.join(', ') : String(v);
    } else {
      draft[f.key] = f.default ?? '';
    }
  }
  return draft;
}

function buildValues(
  fields: FieldDef[],
  draft: Record<string, string>
): { values: Record<string, unknown>; missing: string } {
  const values: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = (draft[f.key] ?? '').trim();
    if (f.required && !raw) return { values: {}, missing: f.label };
    if (f.parse) {
      values[f.key] = f.parse(raw);
    } else if (f.type === 'number') {
      values[f.key] = Number.isNaN(Number(raw)) ? 0 : Number(raw);
    } else {
      values[f.key] = raw;
    }
  }
  return { values, missing: '' };
}

export function ListManager<T extends CrudRow>({
  table,
  what,
  fields,
  titleOf,
  subtitleOf,
  detail,
}: {
  table: string;
  what: string;
  fields: FieldDef[];
  titleOf: (row: T) => string;
  subtitleOf?: (row: T) => string;
  detail?: (row: T) => React.ReactNode;
}) {
  const crud = useCrud<T>(table);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const openAdd = () => {
    setDraft(draftFrom(fields));
    setFormError('');
    setAdding(true);
  };

  const submitAdd = async () => {
    const { values, missing } = buildValues(fields, draft);
    if (missing) {
      setFormError(`${missing} is required.`);
      return;
    }
    setBusy(true);
    setFormError('');
    if (await crud.create(values)) {
      setAdding(false);
    } else {
      setFormError(crud.error);
    }
    setBusy(false);
  };

  const openEdit = (row: T) => {
    setEditingId(row.id);
    setEditDraft(draftFrom(fields, row as unknown as Record<string, unknown>));
    setFormError('');
  };

  const submitEdit = async () => {
    if (!editingId) return;
    const { values, missing } = buildValues(fields, editDraft);
    if (missing) {
      setFormError(`${missing} is required.`);
      return;
    }
    setBusy(true);
    setFormError('');
    if (await crud.update(editingId, values)) {
      setEditingId(null);
    } else {
      setFormError(crud.error);
    }
    setBusy(false);
  };

  const doDelete = async (id: string) => {
    setBusy(true);
    await crud.remove(id);
    setBusy(false);
    setConfirmId(null);
  };

  const renderFields = (
    values: Record<string, string>,
    onChange: (key: string, v: string) => void
  ) => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.type === 'textarea' || !f.half ? 'sm:col-span-2' : ''}>
          {f.type === 'textarea' ? (
            <TextArea
              label={f.label}
              rows={f.rows ?? 3}
              placeholder={f.placeholder}
              value={values[f.key] ?? ''}
              onChange={(v) => onChange(f.key, v)}
            />
          ) : f.type === 'select' ? (
            <SelectField
              label={f.label}
              value={values[f.key] ?? ''}
              onChange={(v) => onChange(f.key, v)}
              options={f.options ?? []}
            />
          ) : (
            <Field
              label={f.label}
              type={f.type === 'number' ? 'number' : 'text'}
              placeholder={f.placeholder}
              value={values[f.key] ?? ''}
              onChange={(v) => onChange(f.key, v)}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">{what}</h2>
          <p className="text-xs text-white/40">
            {crud.rows.length} entr{crud.rows.length === 1 ? 'y' : 'ies'} in the
            database. Use arrows to arrange.
          </p>
        </div>
        <Btn variant="primary" onClick={openAdd} disabled={adding || busy}>
          <Plus size={13} />
          Add {what.replace(/s$/, '').toLowerCase()}
        </Btn>
      </div>

      <ErrorBanner message={crud.error || formError} />

      {crud.loading ? (
        <LoadingRows />
      ) : crud.rows.length === 0 ? (
        <EmptyHint what={what.toLowerCase()} />
      ) : (
        <div className="flex flex-col gap-3">
          {crud.rows.map((row, i) =>
            editingId === row.id ? (
              <div key={row.id} className="rounded-2xl glass-card p-4">
                {renderFields(editDraft, (k, v) =>
                  setEditDraft((d) => ({ ...d, [k]: v }))
                )}
                <div className="mt-3 flex gap-2">
                  <Btn variant="primary" onClick={submitEdit} disabled={busy}>
                    {busy ? <Loader2 size={12} className="animate-spin" /> : null}
                    Save
                  </Btn>
                  <Btn onClick={() => setEditingId(null)} disabled={busy}>
                    <X size={12} />
                    Cancel
                  </Btn>
                </div>
              </div>
            ) : confirmId === row.id ? (
              <div key={row.id}>
                <DeleteConfirm
                  what={titleOf(row)}
                  busy={busy}
                  onConfirm={() => doDelete(row.id)}
                  onCancel={() => setConfirmId(null)}
                />
              </div>
            ) : (
              <ItemCard
                key={row.id}
                title={titleOf(row)}
                subtitle={subtitleOf?.(row)}
                index={i}
                count={crud.rows.length}
                busy={busy}
                onUp={() => crud.move(i, -1)}
                onDown={() => crud.move(i, 1)}
                onEdit={() => openEdit(row)}
                onDelete={() => setConfirmId(row.id)}
              >
                {detail?.(row)}
              </ItemCard>
            )
          )}
        </div>
      )}

      {adding && (
        <div className="mt-4 rounded-2xl glass-card p-4">
          <h3 className="mb-3 font-display text-sm font-semibold text-[#7FE7FF]">
            New entry
          </h3>
          {renderFields(draft, (k, v) => setDraft((d) => ({ ...d, [k]: v })))}
          <div className="mt-3 flex gap-2">
            <Btn variant="primary" onClick={submitAdd} disabled={busy}>
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              Add
            </Btn>
            <Btn onClick={() => setAdding(false)} disabled={busy}>
              <X size={12} />
              Cancel
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
