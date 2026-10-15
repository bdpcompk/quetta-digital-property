"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, BadgeCheck, Banknote, CheckCircle2, ExternalLink, Loader2,
  RefreshCw, Search, XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Payment = {
  id: number;
  user_id: string | null;
  plan: string;
  amount: number;
  method: string;
  trx_id: string | null;
  sender_number: string | null;
  screenshot_url: string | null;
  status: string;
  created_at: string;
};

const STATUS_CHIP: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-soft text-green",
  rejected: "bg-red-50 text-red-600",
};

export default function PaymentsPage() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setErr("Backend not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErr(error.message);
    else setRows((data ?? []) as Payment[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: number, status: string) => {
    if (!supabase) return;
    setBusyId(id);
    const { error } = await supabase
      .from("payments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    setBusyId(null);
    if (error) {
      setErr(error.message);
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const q = query.trim().toLowerCase();
  const list = rows.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      (!q ||
        String(r.id).includes(q) ||
        r.plan.toLowerCase().includes(q) ||
        r.method.toLowerCase().includes(q) ||
        (r.trx_id || "").toLowerCase().includes(q) ||
        (r.sender_number || "").toLowerCase().includes(q))
  );

  const stats = {
    total: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    revenue: rows.filter((r) => r.status === "approved").reduce((s, r) => s + r.amount, 0),
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-navy">Payments</h1>
          <p className="text-[13px] text-muted">Easypaisa & JazzCash transactions awaiting verification.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} className="btn-ghost" disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refresh
          </button>
          <Link href="/admin/" className="btn-ghost">
            <ArrowLeft size={14} /> Dashboard
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total },
          { label: "Pending", value: stats.pending },
          { label: "Approved", value: stats.approved },
          { label: "Revenue", value: `PKR ${stats.revenue.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-white px-4 py-3.5">
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">{s.label}</p>
            <p className="mt-1 text-[19px] font-extrabold text-navy">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by TrxID, plan, number…"
            className="field w-full py-1.5 pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold capitalize transition-all ${
                filter === f ? "bg-navy text-white" : "bg-surface text-muted hover:text-navy"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {err && <p className="mb-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">{err}</p>}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-green" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white py-16 text-center">
          <Banknote size={38} className="mx-auto text-muted" />
          <p className="mt-3 text-[15px] font-bold text-navy">No payments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-line bg-surface text-start text-[11.5px] uppercase tracking-wide text-muted">
                <th className="px-4 py-3 text-start">#</th>
                <th className="px-4 py-3 text-start">Plan</th>
                <th className="px-4 py-3 text-start">Amount</th>
                <th className="px-4 py-3 text-start">Method</th>
                <th className="px-4 py-3 text-start">TrxID</th>
                <th className="px-4 py-3 text-start">Sender</th>
                <th className="px-4 py-3 text-start">Date</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-start">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-bold text-navy">#{r.id}</td>
                  <td className="px-4 py-3 font-semibold capitalize">{r.plan}</td>
                  <td className="px-4 py-3 font-bold text-green">PKR {r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase text-white ${r.method === "jazzcash" ? "bg-red-600" : "bg-green-600"}`}>
                      {r.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px]">{r.trx_id || "—"}</td>
                  <td className="px-4 py-3">{r.sender_number || "—"}</td>
                  <td className="px-4 py-3 text-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold capitalize ${STATUS_CHIP[r.status] || ""}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {r.screenshot_url && (
                        <a href={r.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-green" title="View screenshot">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {r.status === "pending" && (
                        <>
                          <button
                            onClick={() => setStatus(r.id, "approved")}
                            disabled={busyId === r.id}
                            className="rounded-lg bg-green px-2.5 py-1 text-[11.5px] font-bold text-white hover:bg-green-dark disabled:opacity-60"
                          >
                            {busyId === r.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} className="inline" />} Approve
                          </button>
                          <button
                            onClick={() => setStatus(r.id, "rejected")}
                            disabled={busyId === r.id}
                            className="rounded-lg bg-red-500 px-2.5 py-1 text-[11.5px] font-bold text-white hover:bg-red-600 disabled:opacity-60"
                          >
                            <XCircle size={12} className="inline" /> Reject
                          </button>
                        </>
                      )}
                      {r.status !== "pending" && (
                        <button
                          onClick={() => setStatus(r.id, r.status === "approved" ? "rejected" : "approved")}
                          disabled={busyId === r.id}
                          className="rounded-lg bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-muted hover:text-navy disabled:opacity-60"
                        >
                          {busyId === r.id ? <Loader2 size={12} className="animate-spin" /> : <BadgeCheck size={12} className="inline" />} Switch
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
