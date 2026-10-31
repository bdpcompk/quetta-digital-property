"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2, Loader2, PlusCircle, Save, Settings, ToggleLeft, ToggleRight, Trash2, X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { refreshSiteSettings } from "@/lib/useSiteSetting";
import {
  DEFAULT_PLANS, parsePlans, PACKAGES_CONFIG_KEY, type PackagePlan,
} from "@/lib/packages";

type PaymentStat = { plan: string; count: number; revenue: number };

export default function PackagesManager() {
  const [plans, setPlans] = useState<PackagePlan[]>(DEFAULT_PLANS.map((p) => ({ ...p, features: [...p.features] })));
  const [editing, setEditing] = useState<PackagePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [stats, setStats] = useState<PaymentStat[]>([]);

  const load = useCallback(async () => {
    if (!supabase) {
      setErr("Backend not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr("");
    const { data: settings } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", PACKAGES_CONFIG_KEY)
      .maybeSingle();
    setPlans(parsePlans(settings?.value ?? null));

    const { data: payments } = await supabase
      .from("payments")
      .select("plan, amount, status");
    const map = new Map<string, PaymentStat>();
    for (const p of payments ?? []) {
      const key = String(p.plan || "").toLowerCase();
      const cur = map.get(key) ?? { plan: key, count: 0, revenue: 0 };
      cur.count += 1;
      if (p.status === "approved") cur.revenue += Number(p.amount || 0);
      map.set(key, cur);
    }
    setStats([...map.values()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  const updateField = (id: string, patch: Partial<PackagePlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    if (editing?.id === id) setEditing((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const toggleEnabled = (id: string) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: p.enabled !== false } : p)));
    if (editing?.id === id) setEditing((prev) => (prev ? { ...prev, enabled: prev.enabled !== false } : prev));
  };

  const saveAll = async () => {
    if (!supabase) return;
    setSaving(true);
    setErr("");
    setMsg("");
    const value = JSON.stringify(plans);
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: PACKAGES_CONFIG_KEY, value }, { onConflict: "key" });
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    await refreshSiteSettings();
    setMsg("Packages saved. Changes are live on the Packages page.");
    setEditing(null);
  };

  const resetDefaults = () => {
    setPlans(DEFAULT_PLANS.map((p) => ({ ...p, features: [...p.features] })));
    setEditing(null);
    setMsg("");
  };

  const addPlan = () => {
    const next: PackagePlan = {
      id: `plan-${Date.now()}`,
      name: "New Plan",
      price: 0,
      period: "7 Days",
      desc: "Naya plan — features edit karein.",
      features: ["Feature 1", "Feature 2"],
      popular: false,
      enabled: true,
    };
    setPlans((prev) => [...prev, next]);
    setEditing(next);
  };

  const deletePlan = async (id: string) => {
    if (!window.confirm("Is plan ko delete karna chahte hain? Plan use karne wale users par asar parega.")) return;
    setPlans((prev) => prev.filter((p) => p.id !== id));
    if (editing?.id === id) setEditing(null);
    setMsg("Plan delete ho gaya. Save karein taake changes live hon.");
  };

  const list = plans;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={28} className="animate-spin text-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-1 text-[22px] font-extrabold text-navy">Featured Ads – Plans & Settings</h1>
        <p className="text-[13px] text-muted">
          Manage featured ads plans, pricing, duration and display settings for BTP.com.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-white px-4 py-3.5">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Total Plans</p>
          <p className="mt-1 text-[19px] font-extrabold text-navy">{plans.length}</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-4 py-3.5">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Enabled</p>
          <p className="mt-1 text-[19px] font-extrabold text-green">{plans.filter((p) => p.enabled !== false).length}</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-4 py-3.5">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Total Payments</p>
          <p className="mt-1 text-[19px] font-extrabold text-navy">{stats.reduce((a, s) => a + s.count, 0)}</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-4 py-3.5">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Revenue</p>
          <p className="mt-1 text-[19px] font-extrabold text-green">PKR {stats.reduce((a, s) => a + s.revenue, 0).toLocaleString()}</p>
        </div>
      </div>

      {err && <p className="mb-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">{err}</p>}
      {msg && <p className="mb-3 rounded-xl bg-green-soft px-3.5 py-2.5 text-[13px] font-semibold text-green">{msg}</p>}

      {/* Plan cards grid (Image 2 style) */}
      <div className="mb-6 rounded-2xl border border-line bg-white p-1 sm:p-2">
        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const priceText = p.price === 0 ? "Rs. 0" : `Rs. ${p.price.toLocaleString()}`;
            const badge = p.price === 0 ? (
              <span className="ml-2 inline-flex h-6 items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">FREE</span>
            ) : (
              <span className={`ml-2 inline-flex h-6 items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${p.id === "featured" || p.id === "basic" ? "bg-green-100 text-green" : p.id === "standard" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                {p.id === "featured" || p.id === "basic" ? "Basic" : p.id === "standard" ? "Standard" : "Premium"}
              </span>
            );
            const popularTag = p.popular ? (
              <span className="ml-auto flex h-6 items-center rounded-full bg-green px-2 py-1 text-[9px] font-bold uppercase text-white shadow-sm">
                Most Popular
              </span>
            ) : null;
            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-4 sm:p-5 text-left transition-all ${
                  editing?.id === p.id
                    ? "border-green shadow-[0_8px_28px_rgba(26,135,84,.14)] bg-green-soft/20"
                    : "border-line hover:border-green/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[15px] font-extrabold text-navy`}>{p.name}</span>
                    {badge}
                  </div>
                  {popularTag}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[22px] font-extrabold text-green">{priceText}</span>
                  <span className="text-[12px] font-semibold text-muted text-navy">{p.price === 0 ? "صفر" : `${p.price.toLocaleString()} روپے`}</span>
                </div>
                <p className="mt-1 block text-[11px] font-semibold text-muted">{p.period}</p>
                <ul className="mt-2 space-y-1">
                  {p.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[11.5px] text-ink">
                      <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-green" /> {f}
                    </li>
                  ))}
                  {p.features.length > 4 && (
                    <li className="flex items-start gap-1.5 text-[11.5px] text-muted">
                      <span className="mt-0.5 shrink-0 text-muted">…</span> {p.features.length - 4} aur features
                    </li>
                  )}
                </ul>
                <div className="mt-3 flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[12px] font-semibold text-navy select-none">
                    <span
                      className={`relative inline-flex h-5 w-5 shrink-0 rounded-full border-2 transition-colors ${
                        p.enabled !== false ? "bg-green" : "border-line bg-white"
                      }`}
                    >
                      <span className={`pointer-events-none absolute left-1 top-1 rounded-full h-3 w-3 bg-white shadow transition-all ${
                        p.enabled !== false ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </span>
                    {p.enabled !== false ? "Active" : "Disabled"}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      toggleEnabled(p.id);
                      setMsg("");
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-[11px] text-muted hover:bg-green hover:text-white transition-colors"
                    title={p.enabled !== false ? "Disable plan" : "Enable plan"}
                  >
                    {p.enabled !== false ? <ToggleRight size={10} /> : <ToggleLeft size={10} />}
                  </button>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditing(p)}
                    className="flex-1 items-center rounded-md border border-line px-3 py-1.5 text-[11.5px] font-semibold text-navy hover:bg-green hover:text-white transition-colors"
                  >
                    <Settings size={12} className="mr-1" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePlan(p.id)}
                    disabled={plans.length <= 1}
                    className="flex-1 items-center rounded-md border border-red-200 px-3 py-1.5 text-[11.5px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    title={plans.length <= 1 ? "Cannot delete last plan" : "Delete plan"}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={addPlan}
            className="col-span-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-white px-4 py-3 text-[12.5px] font-semibold text-navy hover:bg-green hover:text-white transition-colors"
          >
            <PlusCircle size={14} /> Add New Plan
          </button>
        </div>
      </div>

      {/* Plan Settings form (Image 2 style) */}
      {editing && (
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-extrabold text-navy">
              <Settings size={14} className="mr-2 text-green" /> Plan Settings (Edit / Add Plan)
            </h2>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-[12px] font-semibold text-navy hover:bg-green hover:text-white transition-colors"
            >
              <X size={12} /> Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Basic Information */}
            <div className="col-span-full rounded-xl border border-line bg-slate-50 p-4 sm:p-5">
              <h3 className="mb-3 text-[13px] font-extrabold text-navy uppercase tracking-wide">Basic Information</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="field-label text-[11.5px]">Plan Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="field w-full"
                    value={editing.name}
                    onChange={(e) => updateField(editing.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="field-label text-[11.5px]">Price (PKR) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    className="field w-full"
                    value={editing.price}
                    onChange={(e) => updateField(editing.id, { price: Number(e.target.value || 0) })}
                  />
                </div>
                <div>
                  <label className="field-label text-[11.5px]">Duration (Days) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    className="field w-full"
                    value={editing.period.replace(/\D/g, "") || "7"}
                    onChange={(e) => updateField(editing.id, { period: `${e.target.value || "7"} Days` })}
                  />
                </div>
                <div>
                  <label className="field-label text-[11.5px]">Plan Type</label>
                  <select className="field w-full" value={editing.popular ? "Featured Ads" : "Basic"} onChange={(e) => updateField(editing.id, { popular: e.target.value === "Featured Ads" })}>
                    <option value="Basic">Basic Plan</option>
                    <option value="Featured Ads">Featured Ads</option>
                  </select>
                </div>
                <div>
                  <label className="field-label text-[11.5px]">Status</label>
                  <select className="field w-full" value={editing.enabled !== false ? "Active" : "Disabled"} onChange={(e) => toggleEnabled(editing.id)}>
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="field-label text-[11.5px]">Plan Badge (Optional)</label>
                  <p className="text-[11px] text-muted">Badge text shown on plan card (e.g. Rs. 499, Popular, etc.)</p>
                  <input
                    type="text"
                    className="field w-full"
                    placeholder="Rs. 499"
                    onChange={(e) => updateField(editing.id, { price: editing.price })}
                  />
                </div>
                <div className="col-span-full">
                  <label className="field-label text-[11.5px]">Short Description</label>
                  <textarea
                    className="field w-full min-h-[80px]"
                    value={editing.desc}
                    onChange={(e) => updateField(editing.id, { desc: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Plan Features & Display Settings */}
            <div className="col-span-full rounded-xl border border-line bg-slate-50 p-4 sm:p-5">
              <h3 className="mb-3 text-[13px] font-extrabold text-navy uppercase tracking-wide">Plan Features & Display Settings</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-start gap-2">
                  <input
                    id="featured-badge"
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 shrink-0 rounded border-navy text-green focus:ring-green"
                  />
                  <label htmlFor="featured-badge" className="text-[12.5px] text-navy cursor-pointer">Featured Ad Badge</label>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    id="homepage-display"
                    type="checkbox"
                    defaultChecked={editing.popular}
                    className="mt-0.5 shrink-0 rounded border-navy text-green focus:ring-green"
                  />
                  <label htmlFor="homepage-display" className="text-[12.5px] text-navy cursor-pointer">Homepage Section Display</label>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    id="listings-limit"
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 shrink-0 rounded border-navy text-green focus:ring-green"
                  />
                  <label htmlFor="listings-limit" className="text-[12.5px] text-navy cursor-pointer">Property Listings Limit</label>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    id="images-limit"
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 shrink-0 rounded border-navy text-green focus:ring-green"
                  />
                  <label htmlFor="images-limit" className="text-[12.5px] text-navy cursor-pointer">Images Limit</label>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    id="priority-support"
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 shrink-0 rounded border-navy text-green focus:ring-green"
                  />
                  <label htmlFor="priority-support" className="text-[12.5px] text-navy cursor-pointer">Priority Support</label>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    id="higher-ranking"
                    type="checkbox"
                    defaultChecked={editing.popular}
                    className="mt-0.5 shrink-0 rounded border-navy text-green focus:ring-green"
                  />
                  <label htmlFor="higher-ranking" className="text-[12.5px] text-navy cursor-pointer">Higher Ranking</label>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="field-label text-[11.5px]">Display Order</label>
                  <input
                    type="number"
                    className="field w-full"
                    value={1}
                    disabled
                  />
                  <p className="text-[10px] text-muted">Lower number = higher priority</p>
                </div>
                <div>
                  <label className="field-label text-[11.5px]">Icon Class (Font Awesome)</label>
                  <input
                    type="text"
                    className="field w-full"
                    placeholder="fa-star"
                    disabled
                  />
                  <p className="text-[10px] text-muted">Example: fa-star, fa-crown, fa-bolt</p>
                </div>
                <div>
                  <label className="field-label text-[11.5px]">Color Theme</label>
                  <select className="field w-full" defaultValue="Green">
                    <option>Green</option>
                    <option>Blue</option>
                    <option>Purple</option>
                    <option>Amber</option>
                  </select>
                  <p className="text-[10px] text-muted">Plan card color</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveAll}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-green px-4 py-2 text-[13px] font-bold text-white hover:bg-green-dark disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Changes
            </button>
            <button
              type="button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-[13px] font-bold text-navy hover:bg-surface"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}

      {/* Plans List table */}
      <div className="rounded-2xl border border-line bg-white overflow-hidden">
        <div className="border-b border-line bg-white px-4 py-3">
          <h3 className="text-[13px] font-extrabold text-navy uppercase tracking-wide">Featured Ads Plans List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-line bg-surface text-start text-[11px] uppercase tracking-wide text-muted">
                <th className="px-4 py-3 text-start">#</th>
                <th className="px-4 py-3 text-start">Plan Name</th>
                <th className="px-4 py-3 text-start">Price</th>
                <th className="px-4 py-3 text-start">Duration</th>
                <th className="px-4 py-3 text-start">Listings Limit</th>
                <th className="px-4 py-3 text-start">Images Limit</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-start">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p, i) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-bold text-navy">#{i + 1}</td>
                  <td className="px-4 py-3 font-semibold capitalize">{p.name}</td>
                  <td className="px-4 py-3 font-bold text-green">{p.price === 0 ? "Rs. 0" : `Rs. ${p.price.toLocaleString()}`}</td>
                  <td className="px-4 py-3 text-muted">{p.period}</td>
                  <td className="px-4 py-3 text-muted">{p.features.find((f) => /listing/i.test(f))?.match(/\d+/) || "—"}</td>
                  <td className="px-4 py-3 text-muted">{p.features.find((f) => /image/i.test(f))?.match(/\d+/) || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold capitalize ${p.enabled !== false ? "bg-green-soft text-green" : "bg-amber-100 text-amber-700"}`}>
                      {p.enabled !== false ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditing(p)}
                        className="flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-[11px] font-semibold text-navy hover:bg-green hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Settings size={11} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePlan(p.id)}
                        disabled={plans.length <= 1}
                        className="flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line bg-white px-4 py-3 text-[12px] text-muted">
          Showing {list.length} to {list.length} of {plans.length} plans
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2">
        <button
          type="button"
          onClick={() => { load(); }}
          title="Refresh"
          className="flex items-center justify-center rounded-lg border border-line bg-white px-3 py-2 text-[13px] font-semibold text-navy hover:bg-surface"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
