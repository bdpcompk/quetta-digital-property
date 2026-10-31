"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Search, Star, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Property = {
  id: number;
  title: string;
  district: string | null;
  price: number | null;
  priceText: string | null;
  purpose: string | null;
  status: string | null;
  featured: boolean;
  img: string | null;
};

export default function FeaturedAdsManager() {
  const [rows, setRows] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "featured" | "not">("all");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setErr("Backend not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, district, price, priceText, purpose, status, featured, img")
      .order("id", { ascending: false });
    if (error) setErr(error.message);
    else setRows((data ?? []) as Property[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  const toggleFeatured = async (row: Property) => {
    if (!supabase) return;
    setBusyId(row.id);
    const next = !row.featured;
    const { error } = await supabase
      .from("properties")
      .update({ featured: next })
      .eq("id", row.id);
    setBusyId(null);
    if (error) {
      setErr(error.message);
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, featured: next } : r)));
  };

  const q = query.trim().toLowerCase();
  const list = rows.filter((r) => {
    if (filter === "featured" && !r.featured) return false;
    if (filter === "not" && r.featured) return false;
    if (!q) return true;
    return (
      String(r.id).includes(q) ||
      (r.title || "").toLowerCase().includes(q) ||
      (r.district || "").toLowerCase().includes(q)
    );
  });

  const featuredCount = rows.filter((r) => r.featured).length;

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-white px-4 py-3.5">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Total Properties</p>
          <p className="mt-1 text-[19px] font-extrabold text-navy">{rows.length}</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-4 py-3.5">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Featured</p>
          <p className="mt-1 text-[19px] font-extrabold text-amber-600">{featuredCount}</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-4 py-3.5">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Not Featured</p>
          <p className="mt-1 text-[19px] font-extrabold text-navy">{rows.length - featuredCount}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, district, id…"
            className="field w-full py-1.5 pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "featured", "not"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold capitalize transition-all ${
                filter === f ? "bg-navy text-white" : "bg-surface text-muted hover:text-navy"
              }`}
            >
              {f === "not" ? "Not featured" : f}
            </button>
          ))}
        </div>
        <button onClick={load} className="btn-ghost" disabled={loading}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : null} Refresh
        </button>
      </div>

      {err && <p className="mb-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">{err}</p>}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-green" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white py-16 text-center">
          <Star size={38} className="mx-auto text-muted" />
          <p className="mt-3 text-[15px] font-bold text-navy">No properties found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-line bg-surface text-start text-[11.5px] uppercase tracking-wide text-muted">
                <th className="px-4 py-3 text-start">#</th>
                <th className="px-4 py-3 text-start">Title</th>
                <th className="px-4 py-3 text-start">District</th>
                <th className="px-4 py-3 text-start">Price</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-start">Featured</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-bold text-navy">#{r.id}</td>
                  <td className="px-4 py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      {r.img ? (
                        <img src={r.img} alt="" className="h-8 w-10 rounded object-cover" />
                      ) : null}
                      <span className="line-clamp-1">{r.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{r.district || "—"}</td>
                  <td className="px-4 py-3 font-bold text-green">
                    {r.priceText || (r.price ? `PKR ${Number(r.price).toLocaleString()}` : "—")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold capitalize ${r.status === "active" ? "bg-green-soft text-green" : "bg-amber-100 text-amber-700"}`}>
                      {r.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(r)}
                      disabled={busyId === r.id}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${r.featured ? "bg-amber-500" : "bg-slate-300"} disabled:opacity-60`}
                      aria-label="Toggle featured"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${r.featured ? "translate-x-6" : "translate-x-1"}`}
                      />
                      {busyId === r.id && <Loader2 size={12} className="absolute inset-0 m-auto animate-spin text-white" />}
                    </button>
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
