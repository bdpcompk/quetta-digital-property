"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, BadgeCheck, CheckCircle2, ImageIcon, Loader2, Pencil, Plus, Search, Trash2, X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AUTHORITIES } from "@/lib/data";

type Src = "schemes" | "qda_schemes";

type Row = Record<string, unknown> & {
  _source: Src;
  _pkCol: "id" | "name";
  _pk: string | number;
  name: string;
  location: string;
  authority: string;
  status: string;
  verified: boolean;
  photo: string;
};

const STATUS_CHIP: Record<string, string> = {
  Active: "bg-green text-white",
  Sold: "bg-slate-700 text-white",
  Hold: "bg-amber-500 text-white",
  VERIFIED: "bg-green text-white",
  "UNDER VERIFICATION": "bg-amber-400 text-navy",
  "NOT VERIFIED": "bg-red-500 text-white",
  REJECTED: "bg-slate-800 text-white",
  Approved: "bg-green text-white",
  "Under Process": "bg-amber-400 text-navy",
  "Not Listed": "bg-red-500 text-white",
  "Not Approved": "bg-red-500 text-white",
  Pending: "bg-amber-400 text-navy",
};

function toRow(src: Src, r: Record<string, unknown>): Row {
  const isQda = src === "qda_schemes";
  const pkCol: "id" | "name" = isQda ? "name" : "id";
  const pkVal = isQda ? String(r.name || "") : Number(r.id ?? 0);
  return {
    _source: src,
    _pkCol: pkCol,
    _pk: pkVal,
    name: String(r.name || ""),
    location: isQda ? String(r.district || r.location || "") : String(r.location || ""),
    authority: String(r.authority || "QDA"),
    status: isQda
      ? String(r.final_status || r.status || "UNDER VERIFICATION")
      : String(r.noc_status || r.status || "Pending"),
    verified: isQda ? String(r.final_status || "") === "VERIFIED" : Boolean(r.verified),
    photo: isQda ? String(r.img || "") : String((r.photos as unknown[] | null)?.[0] || ""),
    ...r,
  };
}

export default function MergedSchemeManager() {
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
    try {
      const [sRes, qRes] = await Promise.all([
        supabase.from("schemes").select("*").order("id", { ascending: true }),
        supabase.from("qda_schemes").select("*").order("name", { ascending: true }),
      ]);
      if (sRes.error) throw sRes.error;
      if (qRes.error) throw qRes.error;

      const schemes: Row[] = (sRes.data || []).map((r) => toRow("schemes", r));
      const qdas: Row[] = (qRes.data || []).map((r) => toRow("qda_schemes", r));
      setRows([...schemes, ...qdas]);
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    if (!supabase) return;
    const sb = supabase;
    const ch1 = sb
      .channel("merged-schemes-schemes")
      .on("postgres_changes", { event: "*", schema: "public", table: "schemes" }, () => load())
      .subscribe();
    const ch2 = sb
      .channel("merged-schemes-qda")
      .on("postgres_changes", { event: "*", schema: "public", table: "qda_schemes" }, () => load())
      .subscribe();
    return () => {
      sb.removeChannel(ch1);
      sb.removeChannel(ch2);
    };
  }, [load]);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.location.toLowerCase().includes(s) ||
        r.authority.toLowerCase().includes(s) ||
        r.status.toLowerCase().includes(s),
    );
  }, [rows, q]);

  const tableOf = (src: Src) => (src === "schemes" ? "schemes" : "qda_schemes");

  const newRow = (): Row => ({
    _source: "schemes",
    _pkCol: "id",
    _pk: 0,
    name: "",
    location: "",
    authority: "QDA",
    status: "Pending",
    verified: false,
    photo: "",
  });

  const openNew = () => {
    setEditing(newRow());
    setIsNew(true);
  };

  const openEdit = (r: Row) => {
    setEditing({ ...r });
    setIsNew(false);
  };

  const save = async () => {
    if (!supabase || !editing) return;
    setSaving(true);
    setError("");

    const src = editing._source;
    const table = tableOf(src);
    const pkCol = editing._pkCol;
    const { _source, _pkCol, _pk } = editing;
    const rest: Record<string, unknown> = {};
    for (const k of Object.keys(editing)) {
      if (k !== "_source" && k !== "_pkCol" && k !== "_pk") rest[k] = editing[k];
    }
    let payload: Record<string, unknown> = { ...rest };

    // Build payload for the correct table only
    if (src === "qda_schemes") {
      if (payload.location) payload.district = payload.location;
      const drop = [
        "location", "status", "verified", "photos", "video_url", "noc_number", "noc_status",
        "price_total", "price_advance", "price_monthly", "description", "res_plots", "com_plots",
        "possession", "developer", "contact_person", "owner_email", "approval_date", "expiry_date",
        "verified_on", "approval_doc",
      ];
      payload = Object.fromEntries(
        Object.entries(payload).filter(([k]) => !drop.includes(k)),
      );
    } else {
      const drop = [
        "district", "final_status", "img", "qvc_number", "verification_source", "remarks",
        "document", "resPlots", "comPlots", "totalArea",
      ];
      payload = Object.fromEntries(
        Object.entries(payload).filter(([k]) => !drop.includes(k)),
      );
    }

    let err;
    if (isNew) {
      ({ error: err } = await supabase.from(table).insert(payload));
    } else {
      ({ error: err } = await supabase
        .from(table)
        .update(payload)
        .eq(pkCol, editing._pk));
    }

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setNotice(`${src === "schemes" ? "Scheme" : "QDA Scheme"} saved.`);
    setTimeout(() => setNotice(""), 2500);
    setEditing(null);
    load();
  };

  const remove = async () => {
    if (!supabase || !confirmDel) return;
    setError("");
    const src = confirmDel._source;
    const table = tableOf(src);
    const { error: err } = await supabase
      .from(table)
      .delete()
      .eq(confirmDel._pkCol, confirmDel._pk);
    setConfirmDel(null);
    if (err) {
      setError(err.message);
      return;
    }
    setNotice(`${src === "schemes" ? "Scheme" : "QDA Scheme"} deleted.`);
    setTimeout(() => setNotice(""), 2500);
    load();
  };

  const chipCls = (v: string) => STATUS_CHIP[v] || "bg-slate-600 text-white";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 focus-within:border-green sm:max-w-xs">
          <Search size={15} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search schemes / QDA schemes…"
            className="w-full bg-transparent text-[13px] outline-none"
          />
        </div>
        <span className="text-[12.5px] text-muted">
          {filtered.length} of {rows.length}
        </span>
        <button onClick={openNew} className="btn-primary ml-auto">
          <Plus size={15} /> New Scheme
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
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-green" size={26} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted">No schemes found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-line bg-surface text-[11.5px] uppercase tracking-wide text-muted">
                  <th className="px-4 py-2.5 font-semibold">Source</th>
                  <th className="px-4 py-2.5 font-semibold">Name</th>
                  <th className="px-4 py-2.5 font-semibold">Location</th>
                  <th className="px-4 py-2.5 font-semibold">Authority</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const srcLabel = r._source === "schemes" ? "Scheme" : "QDA";
                  const srcCls =
                    r._source === "schemes"
                      ? "bg-blue-soft text-blue"
                      : "bg-green-soft text-green";
                  return (
                    <tr
                      key={`${r._source}-${r._pk}`}
                      className="border-b border-line/70 last:border-0 hover:bg-surface/60"
                    >
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${srcCls}`}>
                          {srcLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[240px] truncate font-semibold text-navy">
                        {r.name}
                        {r.verified === true && (
                          <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-green-soft px-1.5 py-px align-middle text-[9.5px] font-bold uppercase text-green">
                            <BadgeCheck size={9} /> Verified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted max-w-[200px] truncate">
                        {r.location || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {AUTHORITIES[r.authority as keyof typeof AUTHORITIES] || r.authority}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase ${chipCls(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(r)}
                            className="rounded-lg border border-line p-1.5 text-muted transition-colors hover:border-green hover:text-green"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmDel(r)}
                            className="rounded-lg border border-line p-1.5 text-muted transition-colors hover:border-red-400 hover:text-red-500"
                            title="Delete"
                          >
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
                {isNew ? "New Scheme" : "Edit Scheme"}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-1.5 text-muted hover:bg-surface"
              >
                <X size={17} />
              </button>
            </div>
            <div className="grid gap-4 overflow-y-auto p-5 sm:grid-cols-2 max-h-[70vh]">
              <div>
                <label className="field-label">Source *</label>
                <select
                  className="w-full border border-line rounded-lg px-3 py-2 text-[13px]"
                  value={editing._source}
                  onChange={(e) =>
                    setEditing({ ...editing, _source: e.target.value as Src })
                  }
                >
                  <option value="schemes">Normal Scheme</option>
                  <option value="qda_schemes">QDA Scheme</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Scheme Name *</label>
                <input
                  className="w-full border border-line rounded-lg px-3 py-2 text-[13px]"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Jinnah Town"
                />
              </div>
              <div>
                <label className="field-label">Location / District *</label>
                <input
                  className="w-full border border-line rounded-lg px-3 py-2 text-[13px]"
                  value={editing.location}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  placeholder="e.g. Quetta / Mastung"
                />
              </div>
              <div>
                <label className="field-label">Approving Authority *</label>
                <select
                  className="w-full border border-line rounded-lg px-3 py-2 text-[13px]"
                  value={editing.authority}
                  onChange={(e) => setEditing({ ...editing, authority: e.target.value })}
                >
                  {Object.entries(AUTHORITIES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {code} — {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Status *</label>
                <select
                  className="w-full border border-line rounded-lg px-3 py-2 text-[13px]"
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                >
                  {Object.entries(STATUS_CHIP).map(([status]) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Verified (green tick)</label>
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.verified)}
                    onChange={(e) =>
                      setEditing({ ...editing, verified: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#1a8754]"
                  />
                  <span className="text-[13px] font-medium text-ink">Mark Verified</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
              <button onClick={() => setEditing(null)} className="btn-ghost">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="btn-primary"
              >
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
            <h3 className="text-[15px] font-bold text-navy">Delete Scheme?</h3>
            <p className="mt-1.5 text-[13px] text-muted">
              <span className="font-semibold text-ink">{confirmDel.name}</span>
              will be permanently removed.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDel(null)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={remove}
                className="rounded-lg bg-red-600 px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
