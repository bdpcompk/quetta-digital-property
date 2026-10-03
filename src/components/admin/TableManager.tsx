"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle, BadgeCheck, ImageIcon, Loader2, Pencil, Plus, Search, Trash2, X, CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { AdminTable } from "@/lib/adminTables";

type Row = Record<string, unknown>;

export type ExtraAction = {
  icon: ReactNode;
  title: string;
  show?: (row: Row) => boolean;
  onClick: (row: Row) => void | Promise<void>;
};

type TableManagerProps = {
  table: AdminTable;
  trackField?: string;
  onTrackChange?: (oldValue: unknown, row: Row) => void;
  extraAction?: ExtraAction;
};

function defaultRow(t: AdminTable): Row {
  const r: Row = {};
  for (const f of t.fields) {
    if (f.type === "bool") r[f.key] = false;
    else if (f.type === "number") r[f.key] = 0;
    else if (f.type === "array") r[f.key] = [];
    else r[f.key] = "";
  }
  if (t.fields.find((f) => f.key === t.pk)?.type === "number") {
    r[t.pk] = null; // filled on save with max+1
  }
  return r;
}

export default function TableManager({ table, trackField, onTrackChange, extraAction }: TableManagerProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Row | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from(table.name)
      .select("*")
      .order(table.orderCol, { ascending: true });
    if (err) setError(err.message);
    else {
      setRows(data ?? []);
      setError("");
    }
    setLoading(false);
  }, [table]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(s));
  }, [rows, q]);

  const openNew = () => { setEditing(defaultRow(table)); setIsNew(true); };
  const openEdit = (r: Row) => { setEditing({ ...r }); setIsNew(false); };

  const save = async () => {
    if (!supabase || !editing) return;
    setSaving(true);
    setError("");
    const payload: Row = { ...editing };
    for (const f of table.fields) {
      if (f.type === "number") payload[f.key] = payload[f.key] === "" || payload[f.key] === null ? null : Number(payload[f.key]);
      if (f.type === "array" && typeof payload[f.key] === "string") {
        payload[f.key] = String(payload[f.key]).split("\n").map((x) => x.trim()).filter(Boolean);
      }
      if (f.required && (payload[f.key] === "" || payload[f.key] === null || payload[f.key] === undefined)) {
        setError(`${f.label} is required.`);
        setSaving(false);
        return;
      }
    }
    // auto id for numeric pk
    if (isNew && table.fields.find((f) => f.key === table.pk)?.type === "number" && (payload[table.pk] === null || payload[table.pk] === undefined)) {
      const max = rows.reduce((m, r) => Math.max(m, Number(r[table.pk]) || 0), 0);
      payload[table.pk] = max + 1;
    }

    let err;
    const orig = isNew ? null : (rows.find((r) => r[table.pk] === payload[table.pk]) ?? null);
    if (isNew) {
      ({ error: err } = await supabase.from(table.name).insert(payload));
    } else {
      ({ error: err } = await supabase.from(table.name).update(payload).eq(table.pk, payload[table.pk]));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    if (!isNew && trackField && orig && orig[trackField] !== payload[trackField]) {
      onTrackChange?.(orig[trackField], payload);
    }
    setEditing(null);
    setNotice(isNew ? `${table.singular} created.` : `${table.singular} updated.`);
    setTimeout(() => setNotice(""), 2500);
    load();
  };

  const remove = async () => {
    if (!supabase || !confirmDel) return;
    setError("");
    const { error: err } = await supabase.from(table.name).delete().eq(table.pk, confirmDel[table.pk]);
    setConfirmDel(null);
    if (err) { setError(err.message); return; }
    setNotice(`${table.singular} deleted.`);
    setTimeout(() => setNotice(""), 2500);
    load();
  };

  const previewUrl = (r: Row) => {
    const urlF = table.fields.find((x) => x.type === "url" && /img|image|photo|cover/.test(x.key));
    if (urlF) return String(r[urlF.key] || "");
    const arrF = table.fields.find((x) => x.type === "array" && /photo|img|image/.test(x.key));
    const arrVal = arrF ? r[arrF.key] : undefined;
    if (Array.isArray(arrVal) && arrVal.length) return String(arrVal[0] || "");
    return "";
  };
  const hasPreviewCol =
    table.fields.some((f) => f.type === "url" && /img|image|photo|cover/.test(f.key)) ||
    table.fields.some((f) => f.type === "array" && /photo|img|image/.test(f.key));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 focus-within:border-green sm:max-w-xs">
          <Search size={15} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${table.title.toLowerCase()}…`}
            className="w-full bg-transparent text-[13px] outline-none"
          />
        </div>
        <span className="text-[12.5px] text-muted">{filtered.length} of {rows.length}</span>
        <button onClick={openNew} className="btn-primary ml-auto">
          <Plus size={15} /> New {table.singular}
        </button>
      </div>

      {error && (
        <p className="mb-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-600">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {error}
        </p>
      )}
      {notice && (
        <p className="mb-3 flex items-center gap-2 rounded-lg bg-green-soft px-3 py-2 text-[12.5px] font-medium text-green">
          <CheckCircle2 size={14} /> {notice}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-green" size={26} /></div>
        ) : filtered.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted">No {table.title.toLowerCase()} found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-line bg-surface text-[11.5px] uppercase tracking-wide text-muted">
                  <th className="px-4 py-2.5 font-semibold">#</th>
                  <th className="px-4 py-2.5 font-semibold">{hasPreviewCol ? "Preview" : "Name"}</th>
                  <th className="px-4 py-2.5 font-semibold">Title</th>
                  <th className="px-4 py-2.5 font-semibold">Details</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const url = previewUrl(r);
                  const title = String(r.title ?? r.name ?? r[table.pk] ?? `Row ${i + 1}`);
                  const details = table.fields
                    .filter((f) => ["text", "number", "select"].includes(f.type) && f.key !== table.pk && f.key !== "title" && f.key !== "name")
                    .slice(0, 3)
                    .map((f) => `${f.label}: ${String(r[f.key] ?? "—")}`)
                    .join(" · ");
                  return (
                    <tr key={String(r[table.pk])} className="border-b border-line/70 last:border-0 hover:bg-surface/60">
                      <td className="px-4 py-3 font-mono text-[12px] text-muted">{String(r[table.pk])}</td>
                      <td className="px-4 py-3">
                        {url ? (
                          <img src={url} alt="" className="h-10 w-14 rounded-md border border-line object-cover" loading="lazy" />
                        ) : (
                          <span className="flex h-10 w-14 items-center justify-center rounded-md bg-surface text-muted"><ImageIcon size={15} /></span>
                        )}
                      </td>
                      <td className="max-w-[260px] truncate px-4 py-3 font-semibold text-navy">
                        {title}
                        {r.verified === true && (
                          <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-green-soft px-1.5 py-px align-middle text-[9.5px] font-bold uppercase text-green">
                            <BadgeCheck size={9} /> Verified
                          </span>
                        )}
                      </td>
                      <td className="hidden max-w-[340px] truncate px-4 py-3 text-muted md:table-cell">{details}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          {extraAction && (!extraAction.show || extraAction.show(r)) && (
                            <button
                              onClick={async () => {
                                try { await extraAction.onClick(r); } finally { load(); }
                              }}
                              className="rounded-lg border border-green/50 bg-green-soft p-1.5 text-green transition-colors hover:bg-green hover:text-white"
                              title={extraAction.title}
                            >
                              {extraAction.icon}
                            </button>
                          )}
                          <button onClick={() => openEdit(r)} className="rounded-lg border border-line p-1.5 text-muted transition-colors hover:border-green hover:text-green" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setConfirmDel(r)} className="rounded-lg border border-line p-1.5 text-muted transition-colors hover:border-red-400 hover:text-red-500" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* editor modal */}
      {editing && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-navy-deep/60 p-4 sm:p-6">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="text-[15px] font-bold text-navy">
                {isNew ? `New ${table.singular}` : `Edit ${table.singular}`}
              </h3>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1.5 text-muted hover:bg-surface"><X size={17} /></button>
            </div>
            <div className="grid max-h-[70vh] gap-4 overflow-y-auto p-5 sm:grid-cols-2">
              {table.fields.map((f) => {
                const val = editing[f.key];
                const base = "field w-full";
                if (f.type === "bool") {
                  return (
                    <label key={f.key} className="flex cursor-pointer items-center gap-2.5 sm:col-span-1">
                      <input
                        type="checkbox"
                        checked={Boolean(val)}
                        onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })}
                        className="h-4 w-4 accent-[#1a8754]"
                      />
                      <span className="text-[13px] font-medium text-ink">{f.label}</span>
                    </label>
                  );
                }
                if (f.type === "select") {
                  return (
                    <div key={f.key}>
                      <label className="field-label">{f.label}{f.required ? " *" : ""}</label>
                      <select className={base} value={String(val ?? "")} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}>
                        <option value="">Select…</option>
                        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  );
                }
                if (f.type === "textarea" || f.type === "array") {
                  return (
                    <div key={f.key} className="sm:col-span-2">
                      <label className="field-label">{f.label}{f.required ? " *" : ""}</label>
                      <textarea
                        rows={f.type === "array" ? 3 : 4}
                        className={base + " resize-y"}
                        value={Array.isArray(val) ? val.join("\n") : String(val ?? "")}
                        onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                      />
                    </div>
                  );
                }
                return (
                  <div key={f.key}>
                    <label className="field-label">{f.label}{f.required ? " *" : ""}</label>
                    <input
                      type={f.type === "number" ? "number" : f.type === "url" ? "text" : "text"}
                      className={base}
                      value={val === null ? "" : String(val ?? "")}
                      placeholder={f.placeholder}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [f.key]: f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value,
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
              <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? "Saving…" : isNew ? "Create" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* delete confirm */}
      {confirmDel && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy-deep/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-[15px] font-bold text-navy">Delete {table.singular}?</h3>
            <p className="mt-1.5 text-[13px] text-muted">
              <span className="font-semibold text-ink">{String(confirmDel.title ?? confirmDel.name ?? confirmDel[table.pk])}</span> will be permanently removed.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirmDel(null)} className="btn-ghost">Cancel</button>
              <button onClick={remove} className="rounded-lg bg-red-600 px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
