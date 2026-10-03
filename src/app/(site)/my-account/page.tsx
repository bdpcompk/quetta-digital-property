"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, Loader2, LogIn, MapPin, Pencil, Plus, Trash2,
} from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { formatPKR } from "@/lib/data";
import type { Property } from "@/lib/types";
import { useSession } from "@/lib/useSession";

const inputCls = "w-full rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] focus:border-green focus:outline-none";

export default function MyAccountPage() {
  const { session, ready, name, supabase } = useSession();
  const [rows, setRows] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState<Property | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!supabase || !session) return;
    setLoading(true);
    const { data, error: e } = await supabase
      .from("properties")
      .select("*")
      .eq("created_by", session.user.id)
      .order("id", { ascending: false });
    if (e) setErr(e.message);
    else setRows((data as Property[]) ?? []);
    setLoading(false);
  }, [supabase, session]);

  useEffect(() => {
    if (!ready || !session) return;
    const t = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(t);
  }, [ready, session, load]);

  const remove = async (id: number) => {
    if (!supabase || !confirm("Delete this listing? This cannot be undone.")) return;
    const { error: e } = await supabase.from("properties").delete().eq("id", id);
    if (e) setErr(e.message);
    else setRows((r) => r.filter((x) => x.id !== id));
  };

  const save = async () => {
    if (!supabase || !editing) return;
    setBusy(true);
    const priceNum = Number(editing.price) || 0;
    const { error: e } = await supabase
      .from("properties")
      .update({
        title: editing.title,
        price: priceNum,
        priceText: formatPKR(priceNum),
        area: editing.area,
        address: editing.address,
        desc: editing.desc,
        phone: editing.phone ?? "",
      })
      .eq("id", editing.id);
    setBusy(false);
    if (e) {
      setErr(e.message);
      return;
    }
    setEditing(null);
    load();
  };

  if (ready && !session) {
    return (
      <>
        <PageBanner title="My Account" crumbs={[{ label: "Home", href: "/" }, { label: "My Account" }]} />
        <section className="section">
          <div className="wrap max-w-[440px] rounded-2xl border border-line bg-white p-8 text-center">
            <LogIn size={34} className="mx-auto text-green" />
            <h3 className="mt-4 text-[18px] font-bold text-navy">Login Required</h3>
            <p className="mt-2 text-[13.5px] text-muted">
              Login to see and manage your property listings.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/login/?next=%2Fmy-account%2F" className="btn-primary">Login</Link>
              <Link href="/signup/?next=%2Fmy-account%2F" className="btn-ghost">Sign Up</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner title="My Account" crumbs={[{ label: "Home", href: "/" }, { label: "My Account" }]} />
      <section className="section">
        <div className="wrap">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-extrabold text-navy">My Listings</h2>
              <p className="mt-0.5 text-[13.5px] text-muted">
                {name ? `Logged in as ${name}` : ""}
              </p>
            </div>
            <Link href="/sell/" className="btn-primary">
              <Plus size={15} /> Post New Property
            </Link>
          </div>

          {err && (
            <p className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /> {err}
            </p>
          )}

          {!ready || loading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-white p-12 text-[14px] text-muted">
              <Loader2 size={16} className="animate-spin" /> Loading your listings…
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white py-14 text-center">
              <h3 className="text-[16px] font-bold text-navy">You haven&apos;t posted anything yet</h3>
              <p className="mt-1 text-[13px] text-muted">Post your first property — it&apos;s free.</p>
              <Link href="/sell/" className="btn-primary mt-5">
                <Plus size={15} /> Post Property
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {rows.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center"
                >
                  <Link href={`/property/?id=${p.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="h-20 w-28 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-[16px] font-extrabold text-navy">{p.priceText}</p>
                      <h3 className="mt-0.5 truncate text-[14px] font-semibold text-ink">{p.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                        <MapPin size={12} className="shrink-0 text-green" />
                        <span className="truncate">{p.address}</span>
                      </p>
                    </div>
                  </Link>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => setEditing({ ...p })}
                      className="flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-green hover:text-green"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-[12.5px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {editing && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-[520px] overflow-y-auto rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[17px] font-bold text-navy">Edit Listing</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="field-label">Title</label>
                <input
                  className={inputCls}
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Price (PKR)</label>
                  <input
                    className={inputCls}
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="field-label">Area</label>
                  <input
                    className={inputCls}
                    value={editing.area}
                    onChange={(e) => setEditing({ ...editing, area: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="field-label">Address</label>
                <input
                  className={inputCls}
                  value={editing.address}
                  onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Phone</label>
                <input
                  className={inputCls}
                  value={editing.phone ?? ""}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Description</label>
                <textarea
                  rows={4}
                  className={inputCls + " resize-y"}
                  value={editing.desc}
                  onChange={(e) => setEditing({ ...editing, desc: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2.5">
              <button onClick={() => setEditing(null)} className="btn-ghost">
                Cancel
              </button>
              <button onClick={save} disabled={busy} className="btn-primary disabled:opacity-60">
                {busy ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
