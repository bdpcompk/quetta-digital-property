"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Package, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { refreshSiteSettings } from "@/lib/useSiteSetting";
import { DEFAULT_PLANS, parsePlans, PACKAGES_CONFIG_KEY, type PackagePlan } from "@/lib/packages";

type PaymentStat = { plan: string; count: number; revenue: number };

export default function PackagesManager() {
  const [plans, setPlans] = useState<PackagePlan[]>(DEFAULT_PLANS.map((p) => ({ ...p, features: [...p.features] })));
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

  const updatePlan = (id: string, patch: Partial<PackagePlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
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
  };

  const resetDefaults = () => {
    setPlans(DEFAULT_PLANS.map((p) => ({ ...p, features: [...p.features] })));
    setMsg("");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={28} className="animate-spin text-green" />
      </div>
    );
  }

  return (
    <div>
      {err && <p className="mb-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">{err}</p>}
      {msg && <p className="mb-3 rounded-xl bg-green-soft px-3.5 py-2.5 text-[13px] font-semibold text-green">{msg}</p>}

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.length === 0 ? (
          <div className="col-span-full rounded-xl border border-line bg-white px-4 py-3.5 text-[13px] text-muted">
            No payment records yet.
          </div>
        ) : (
          stats.map((s) => (
            <div key={s.plan} className="rounded-xl border border-line bg-white px-4 py-3.5">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">{s.plan || "unknown"}</p>
              <p className="mt-1 text-[19px] font-extrabold text-navy">{s.count} payments</p>
              <p className="text-[12px] text-green">Revenue: PKR {s.revenue.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-4">
        {plans.map((p) => (
          <div key={p.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-green" />
                <h3 className="text-[16px] font-extrabold text-navy">{p.name}</h3>
                <span className="text-[11px] text-muted">({p.id})</span>
              </div>
              <label className="flex items-center gap-2 text-[12.5px] font-semibold text-navy">
                <input
                  type="checkbox"
                  checked={p.enabled !== false}
                  onChange={(e) => updatePlan(p.id, { enabled: e.target.checked })}
                />
                Enabled
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="field-label text-[11.5px]">Price (PKR)</label>
                <input
                  type="number"
                  className="field"
                  value={p.price}
                  onChange={(e) => updatePlan(p.id, { price: Number(e.target.value || 0) })}
                />
              </div>
              <div>
                <label className="field-label text-[11.5px]">Period</label>
                <input
                  type="text"
                  className="field"
                  value={p.period}
                  onChange={(e) => updatePlan(p.id, { period: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-[12.5px] font-semibold text-navy">
                  <input
                    type="checkbox"
                    checked={!!p.popular}
                    onChange={(e) => updatePlan(p.id, { popular: e.target.checked })}
                  />
                  Popular (highlighted)
                </label>
              </div>
            </div>
            <div className="mt-3">
              <label className="field-label text-[11.5px]">Description</label>
              <input
                type="text"
                className="field"
                value={p.desc}
                onChange={(e) => updatePlan(p.id, { desc: e.target.value })}
              />
            </div>
            <div className="mt-3">
              <label className="field-label text-[11.5px]">Features (one per line)</label>
              <textarea
                className="field min-h-[90px]"
                value={p.features.join("\n")}
                onChange={(e) =>
                  updatePlan(p.id, { features: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-xl bg-green px-4 py-2 text-[13px] font-bold text-white hover:bg-green-dark disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save All Packages
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
  );
}
