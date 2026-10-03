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
  const [editFile, setEditFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [dispName, setDispName] = useState("");
  const [newPass, setNewPass] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [profBusy, setProfBusy] = useState(false);

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

  useEffect(() => {
    if (name && !dispName) {
      const t = setTimeout(() => setDispName(name), 0);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const saveProfile = async () => {
    if (!supabase || !dispName.trim()) return;
    setProfBusy(true);
    setProfileErr("");
    setProfileMsg("");
    const { error: e } = await supabase.auth.updateUser({ data: { full_name: dispName.trim() } });
    setProfBusy(false);
    setProfileMsg(e ? "" : "Profile updated ✓");
    if (e) setProfileErr(e.message);
  };

  const savePassword = async () => {
    if (!supabase || newPass.length < 6) {
      setProfileErr("Password must be at least 6 characters.");
      setProfileMsg("");
      return;
    }
    setProfBusy(true);
    setProfileErr("");
    setProfileMsg("");
    const { error: e } = await supabase.auth.updateUser({ password: newPass });
    setProfBusy(false);
    if (e) setProfileErr(e.message);
    else {
      setProfileMsg("Password changed ✓");
      setNewPass("");
    }
  };

  const remove = async (id: number) => {
    if (!supabase || !confirm("Delete this listing? This cannot be undone.")) return;
    const { error: e } = await supabase.from("properties").delete().eq("id", id);
    if (e) setErr(e.message);
    else setRows((r) => r.filter((x) => x.id !== id));
  };

  const save = async () => {
    if (!supabase || !editing || !session) return;
    setBusy(true);
    const priceNum = Number(editing.price) || 0;
    const patch: Record<string, unknown> = {
      title: editing.title,
      price: priceNum,
      priceText: formatPKR(priceNum),
      area: editing.area,
      address: editing.address,
      desc: editing.desc,
      phone: editing.phone ?? "",
    };
    if (editFile) {
      const path = `${session.user.id}/${Date.now()}-${editFile.name.replace(/[^\w.-]/g, "_")}`;
      const up = await supabase.storage.from("listings").upload(path, editFile, {
        contentType: editFile.type,
        upsert: false,
      });
      if (up.error) {
        setErr("Photo upload failed: " + up.error.message);
        setBusy(false);
        return;
      }
      const url = supabase.storage.from("listings").getPublicUrl(path).data.publicUrl;
      patch.img = url;
      patch.images = [url];
    }
    const { error: e } = await supabase
      .from("properties")
      .update(patch)
      .eq("id", editing.id);
    setBusy(false);
    if (e) {
      setErr(e.message);
      return;
    }
    setEditing(null);
    setEditFile(null);
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
                      <p className="flex flex-wrap items-center gap-2 text-[16px] font-extrabold text-navy">
                        {p.priceText}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${
                            p.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-soft text-green"
                          }`}
                        >
                          {p.status === "pending" ? "Pending Review" : "Active"}
                        </span>
                      </p>
                      <h3 className="mt-0.5 truncate text-[14px] font-semibold text-ink">{p.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                        <MapPin size={12} className="shrink-0 text-green" />
                        <span className="truncate">{p.address}</span>
                      </p>
                    </div>
                  </Link>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => {
                        setEditing({ ...p });
                        setEditFile(null);
                      }}
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

          <div className="mt-10 rounded-2xl border border-line bg-white p-6 sm:p-7">
            <h2 className="text-[18px] font-extrabold text-navy">Account Settings</h2>
            <p className="mt-0.5 text-[13px] text-muted">
              {session?.user.email ? session.user.email : ""}
            </p>

            {profileMsg && (
              <p className="mt-4 rounded-xl bg-green-soft px-3.5 py-2.5 text-[13px] font-medium text-green">
                {profileMsg}
              </p>
            )}
            {profileErr && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                <AlertCircle size={15} className="mt-0.5 shrink-0" /> {profileErr}
              </p>
            )}

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="field-label">Display Name</label>
                <input
                  className={inputCls}
                  value={dispName}
                  onChange={(e) => setDispName(e.target.value)}
                  placeholder="Your full name"
                />
                <button
                  onClick={saveProfile}
                  disabled={profBusy || !dispName.trim()}
                  className="btn-primary mt-3 disabled:opacity-60"
                >
                  {profBusy ? "Saving…" : "Save Profile"}
                </button>
              </div>
              <div>
                <label className="field-label">New Password</label>
                <input
                  className={inputCls}
                  type="password"
                  autoComplete="new-password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="At least 6 characters"
                />
                <button
                  onClick={savePassword}
                  disabled={profBusy || !newPass}
                  className="btn-ghost mt-3 disabled:opacity-60"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
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
                <label className="field-label">Replace Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className={inputCls}
                  onChange={(e) => setEditFile(e.target.files?.[0] ?? null)}
                />
                {editFile && <p className="mt-1 text-[12px] font-medium text-green">{editFile.name}</p>}
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
              <button
                onClick={() => {
                  setEditing(null);
                  setEditFile(null);
                }}
                className="btn-ghost"
              >
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
