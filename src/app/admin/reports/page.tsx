"use client";

import { useCallback, useMemo, useState } from "react";
import {
  BadgeCheck, Building2, Eye, LayoutGrid, Loader2, MessageSquare, RefreshCw, ShieldCheck,
  TrendingUp, Users, Wallet,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLiveRefresh } from "@/lib/useLiveRefresh";
import { formatPKR } from "@/lib/data";
import { Donut, LineChart, type Seg } from "@/components/admin/Charts";

type Prop = {
  id: number; title: string | null; purpose: string | null; status: string | null;
  district: string | null; views: number | null; featured: boolean | null;
  verified: boolean | null; created_at: string | null;
};
type Msg = { id: number; status: string | null; created_at: string | null };
type Pay = { id: number; plan: string | null; amount: number | null; status: string | null; created_at: string | null };
type Role = { role: string | null };
type Scheme = { id: number; name: string | null; verified: boolean | null; created_at: string | null };
type ViewEvent = { property_id: number; created_at: string | null };

const RANGES = [
  { id: "30", label: "30 days", days: 30 },
  { id: "90", label: "90 days", days: 90 },
  { id: "365", label: "12 months", days: 365 },
  { id: "all", label: "All time", days: 0 },
] as const;
type RangeId = (typeof RANGES)[number]["id"];

const ROLE_LABEL: Record<string, string> = {
  agent: "Agent",
  owner: "Scheme Owner",
  common: "Common Person",
  admin: "Admin",
};

const money = (n: number) => (n > 0 ? formatPKR(n) : "PKR 0");

function Kpi({
  icon: Icon, bg, label, value, sub, live = true,
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  bg: string; label: string; value: string; sub?: string; live?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${bg}`}>
          <Icon size={18} />
        </span>
        {live && <span className="mt-1 h-2 w-2 rounded-full bg-green" />}
      </div>
      <p className="mt-3 text-[12px] font-medium text-muted sm:text-[13px]">{label}</p>
      <p className="mt-0.5 text-[22px] font-extrabold leading-tight text-navy sm:text-[26px]">{value}</p>
      {sub ? <p className="mt-1 text-[11px] font-medium text-muted">{sub}</p> : null}
    </div>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function ReportsPage() {
  const [props, setProps] = useState<Prop[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [pays, setPays] = useState<Pay[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [viewEvents, setViewEvents] = useState<ViewEvent[]>([]);
  const [counts, setCounts] = useState({ projects: 0, qda: 0, agents: 0 });
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [range, setRange] = useState<RangeId>("all");

  const load = useCallback(async (silent = false) => {
    const sb = supabase;
    if (!sb) return;
    if (!silent) setLoading(true);
    const [pr, mr, payr, rr, sr, vr, projr, qdar, agr] = await Promise.all([
      sb.from("properties")
        .select("id,title,purpose,status,district,views,featured,verified,created_at")
        .order("id", { ascending: false })
        .limit(2000),
      sb.from("contact_messages").select("id,status,created_at").order("id", { ascending: false }).limit(2000),
      sb.from("payments").select("id,plan,amount,status,created_at").order("id", { ascending: false }).limit(2000),
      sb.from("user_roles").select("role"),
      sb.from("schemes").select("id,name,verified,created_at").limit(1000),
      sb.from("property_views").select("property_id,created_at").limit(20000),
      sb.from("projects").select("name", { count: "exact", head: true }),
      sb.from("qda_schemes").select("name", { count: "exact", head: true }),
      sb.from("agents").select("id", { count: "exact", head: true }),
    ]);
    setProps((pr.data ?? []) as Prop[]);
    setMsgs((mr.data ?? []) as Msg[]);
    setPays((payr.data ?? []) as Pay[]);
    setRoles((rr.data ?? []) as Role[]);
    setSchemes((sr.data ?? []) as Scheme[]);
    setViewEvents((vr.data ?? []) as ViewEvent[]);
    setCounts({
      projects: projr.count ?? 0,
      qda: qdar.count ?? 0,
      agents: agr.count ?? 0,
    });
    setUpdatedAt(new Date());
    setLoading(false);
  }, []);

  useLiveRefresh(
    ["properties", "contact_messages", "payments", "user_roles", "schemes", "property_views", "projects", "qda_schemes", "agents"],
    () => load(true),
    { pollMs: 15000 }
  );

  const cutoff = useMemo(() => {
    const cfg = RANGES.find((r) => r.id === range)!;
    return cfg.days === 0 ? 0 : Date.now() - cfg.days * 86400000;
  }, [range]);

  const inRange = useCallback(
    (s: string | null) => (cutoff === 0 ? true : !!s && new Date(s).getTime() >= cutoff),
    [cutoff]
  );

  const fProps = useMemo(() => props.filter((p) => inRange(p.created_at)), [props, inRange]);
  const fMsgs = useMemo(() => msgs.filter((m) => inRange(m.created_at)), [msgs, inRange]);
  const fPays = useMemo(() => pays.filter((p) => inRange(p.created_at)), [pays, inRange]);
  const fSchemes = useMemo(() => schemes.filter((s) => inRange(s.created_at)), [schemes, inRange]);

  const forSale = fProps.filter((p) => p.purpose === "For Sale").length;
  const forRent = fProps.filter((p) => p.purpose === "For Rent").length;
  const sold = fProps.filter((p) => p.status === "sold").length;
  const active = fProps.filter((p) => p.status !== "sold").length;
  const verified = fProps.filter((p) => p.verified).length;
  const propIds = useMemo(() => new Set(props.map((p) => p.id)), [props]);
  const fViewEvents = useMemo(
    () => viewEvents.filter((v) => propIds.has(v.property_id) && inRange(v.created_at)),
    [viewEvents, propIds, inRange]
  );
  const viewCount = fViewEvents.length;

  const approved = fPays.filter((p) => p.status === "approved");
  const pendingPays = fPays.filter((p) => p.status === "pending");
  const revenue = approved.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingRevenue = pendingPays.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const purposeSegs: Seg[] = [
    { label: "For Sale", value: forSale, color: "#2563eb" },
    { label: "For Rent", value: forRent, color: "#16a34a" },
  ];
  const statusSegs: Seg[] = [
    { label: "Active", value: active, color: "#2563eb" },
    { label: "Sold", value: sold, color: "#f59e0b" },
  ];
  const msgSegs: Seg[] = [
    { label: "New", value: fMsgs.filter((m) => (m.status || "New") === "New").length, color: "#2563eb" },
    { label: "Pending", value: fMsgs.filter((m) => m.status === "Pending").length, color: "#f59e0b" },
    { label: "Closed", value: fMsgs.filter((m) => m.status === "Closed").length, color: "#94a3b8" },
  ];

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - (11 - i));
        return {
          label: d.toLocaleDateString("en-US", { month: "short" }),
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        };
      }),
    []
  );

  const propSeries = months.map((m) => ({
    label: m.label,
    value: props.filter((p) => p.created_at?.slice(0, 7) === m.key).length,
  }));
  const msgSeries = months.map((m) => ({
    label: m.label,
    value: msgs.filter((x) => x.created_at?.slice(0, 7) === m.key).length,
  }));
  const revSeries = months.map((m) => ({
    label: m.label,
    value: pays
      .filter((p) => p.status === "approved" && p.created_at?.slice(0, 7) === m.key)
      .reduce((sum, p) => sum + Number(p.amount || 0), 0),
  }));
  const revMax = Math.max(1, ...revSeries.map((r) => r.value));

  const topDistricts = useMemo(() => {
    const map = new Map<string, number>();
    fProps.forEach((p) => {
      const d = p.district?.trim() || "Other";
      map.set(d, (map.get(d) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [fProps]);
  const districtMax = Math.max(1, ...topDistricts.map(([, n]) => n));

  const topViewed = useMemo(() => {
    const counts = new Map<number, number>();
    fViewEvents.forEach((v) => counts.set(v.property_id, (counts.get(v.property_id) ?? 0) + 1));
    const byId = new Map(props.map((p) => [p.id, p]));
    return [...counts.entries()]
      .map(([id, n]) => ({ prop: byId.get(id), n }))
      .filter((x): x is { prop: Prop; n: number } => Boolean(x.prop))
      .sort((a, b) => b.n - a.n)
      .slice(0, 8);
  }, [fViewEvents, props]);

  const roleRows = useMemo(() => {
    const map = new Map<string, number>();
    roles.forEach((r) => {
      const k = r.role || "common";
      map.set(k, (map.get(k) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [roles]);

  const planRows = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    approved.forEach((p) => {
      const k = p.plan || "Other";
      const cur = map.get(k) ?? { total: 0, count: 0 };
      cur.total += Number(p.amount || 0);
      cur.count += 1;
      map.set(k, cur);
    });
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [approved]);

  const rangeLabel = RANGES.find((r) => r.id === range)!.label;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-green" size={30} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-navy">Reports &amp; Analytics</h1>
          <p className="text-[13px] text-muted">
            Live data — har table change par khud update hota hai. Showing: <b>{rangeLabel}</b>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg bg-green-soft px-2.5 py-1.5 text-[11.5px] font-bold text-green">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green" /> LIVE
          </span>
          <div className="flex overflow-hidden rounded-lg border border-line bg-white">
            {RANGES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                className={`px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                  range === r.id ? "bg-navy text-white" : "text-muted hover:bg-surface"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => load(false)}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-navy hover:border-green hover:text-green"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <span className="text-[11px] text-muted">
            {updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : ""}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi icon={Building2} bg="bg-blue-500" label="Properties" value={String(fProps.length)} sub={`${active} active · ${sold} sold`} />
        <Kpi icon={MessageSquare} bg="bg-navy" label="Inquiries" value={String(fMsgs.length)} sub={`${msgSegs[0].value} new · ${msgSegs[1].value} pending`} />
        <Kpi icon={Users} bg="bg-green-500" label="Total Users" value={String(roles.length)} sub={`${roleRows.map(([r, n]) => `${ROLE_LABEL[r] || r} ${n}`).join(" · ")}`} />
        <Kpi icon={Wallet} bg="bg-amber-500" label="Revenue (Approved)" value={money(revenue)} sub={pendingRevenue > 0 ? `${money(pendingRevenue)} pending` : "No pending payments"} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi icon={Eye} bg="bg-indigo-500" label="Total Views" value={viewCount.toLocaleString()} sub="Existing listings only" />
        <Kpi icon={BadgeCheck} bg="bg-teal-500" label="Verified Properties" value={String(verified)} sub={`${Math.round((verified / (fProps.length || 1)) * 100)}% of shown`} />
        <Kpi icon={LayoutGrid} bg="bg-sky-600" label="Schemes" value={String(fSchemes.length)} sub={`${fSchemes.filter((s) => s.verified).length} verified`} />
        <Kpi icon={ShieldCheck} bg="bg-rose-500" label="QDA Approved" value={String(counts.qda)} sub={`${counts.projects} projects · ${counts.agents} agents`} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Properties by Purpose">
          <Donut segs={purposeSegs} total={fProps.length} />
        </Card>
        <Card title="Properties by Status">
          <Donut segs={statusSegs} total={fProps.length} />
        </Card>
        <Card title="Inquiries by Status">
          <Donut segs={msgSegs} total={fMsgs.length} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Properties Added — Last 12 Months" action={<span className="text-[11.5px] text-muted">{propSeries.reduce((s, x) => s + x.value, 0)} total</span>}>
          <LineChart data={propSeries} />
        </Card>
        <Card title="Inquiries — Last 12 Months" action={<span className="text-[11.5px] text-muted">{msgSeries.reduce((s, x) => s + x.value, 0)} total</span>}>
          <LineChart data={msgSeries} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Top Districts" action={<span className="text-[11.5px] text-muted">{rangeLabel}</span>}>
          {topDistricts.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-muted">No properties in this period.</p>
          ) : (
            <ul className="space-y-3">
              {topDistricts.map(([name, n]) => (
                <li key={name}>
                  <div className="mb-1 flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-ink">{name}</span>
                    <span className="text-muted">{n}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div className="h-full rounded-full bg-green" style={{ width: `${(n / districtMax) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Revenue — Last 12 Months">
          {revSeries.every((r) => r.value === 0) ? (
            <p className="py-6 text-center text-[13px] text-muted">No approved payments in the last 12 months.</p>
          ) : (
            <div className="flex h-48 items-end gap-1.5">
              {revSeries.map((r) => (
                <div key={r.label} className="flex flex-1 flex-col items-center gap-1" title={`${r.label}: ${money(r.value)}`}>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-amber-400"
                      style={{ height: `${Math.max(r.value > 0 ? 4 : 0, (r.value / revMax) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[9.5px] text-muted">{r.label}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Users by Role">
          {roleRows.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-muted">No users yet.</p>
          ) : (
            <ul className="space-y-3">
              {roleRows.map(([role, n]) => (
                <li key={role}>
                  <div className="mb-1 flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-ink">{ROLE_LABEL[role] || role}</span>
                    <span className="text-muted">{n}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${(n / roles.length) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[12px]">
            <span className="text-muted">Total registered</span>
            <span className="font-bold text-navy">{roles.length}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Top Properties by Views" action={<span className="text-[11.5px] text-muted">{rangeLabel}</span>}>
          {topViewed.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-muted">No property views in this period.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
                    <th className="py-2 pr-3 font-semibold">Property</th>
                    <th className="py-2 pr-3 font-semibold">District</th>
                    <th className="py-2 text-right font-semibold">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topViewed.map(({ prop, n }) => (
                    <tr key={prop.id} className="border-b border-line/70 last:border-0">
                      <td className="max-w-[220px] truncate py-2 pr-3 font-medium text-ink">{prop.title || `#${prop.id}`}</td>
                      <td className="py-2 pr-3 text-muted">{prop.district || "—"}</td>
                      <td className="py-2 text-right font-bold text-navy">{n.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Revenue by Plan" action={<span className="text-[11.5px] text-muted">{rangeLabel}</span>}>
          {planRows.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-muted">No approved payments in this period.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
                    <th className="py-2 pr-3 font-semibold">Plan</th>
                    <th className="py-2 pr-3 text-right font-semibold">Payments</th>
                    <th className="py-2 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {planRows.map(([plan, v]) => (
                    <tr key={plan} className="border-b border-line/70 last:border-0">
                      <td className="py-2 pr-3 font-medium capitalize text-ink">{plan}</td>
                      <td className="py-2 pr-3 text-right text-muted">{v.count}</td>
                      <td className="py-2 text-right font-bold text-navy">{money(v.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3">
            <div>
              <p className="text-[11px] text-muted">Approved</p>
              <p className="text-[15px] font-extrabold text-green">{money(revenue)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-muted">Pending</p>
              <p className="text-[15px] font-extrabold text-amber-600">{money(pendingRevenue)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-white px-5 py-4 text-[12.5px] text-muted">
        <span className="flex items-center gap-2">
          <TrendingUp size={15} className="text-green" />
          Data live hai — properties, inquiries, payments, users, schemes, projects aur QDA tables par.
        </span>
        <span>Auto-refresh: 15s + instant on change</span>
      </div>
    </div>
  );
}
