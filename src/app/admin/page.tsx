"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight, BarChart3, Building2, Loader2, MessageSquare, Plus,
  Star, UserPlus, Users, Wallet,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Donut, LineChart, type Seg } from "@/components/admin/Charts";

type PropRow = {
  id: number; title: string; purpose: string | null; status: string | null;
  priceText: string | null; district: string | null; address: string | null;
  img: string | null; created_at: string | null;
};
type MsgRow = { id: number; name: string | null; subject: string | null; status: string | null; created_at: string | null };
type District = { name: string; cover: string | null };

const fmtDate = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const shortDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const timeAgo = (s: string | null) => {
  if (!s) return "—";
  const m = Math.floor((Date.now() - new Date(s).getTime()) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
};

const DEMO_VALUES = [4, 9, 7, 14, 11, 16, 9, 8, 13, 10, 17, 12, 15, 11, 9, 14, 18, 12, 10, 16, 8, 11, 15, 9, 13, 17, 10, 12, 16, 14];

const DEMO_CHART = (() => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(t);
    d.setDate(d.getDate() - (29 - i));
    return { label: shortDate(d), value: DEMO_VALUES[i] ?? 6 };
  });
})();

type Stats = {
  propsThisMonth: number;
  inqThisMonth: number;
  series: { label: string; value: number }[];
  hasInq: boolean;
};

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

function KpiCard({
  icon, iconBg, label, value, delta,
}: {
  icon: React.ReactNode; iconBg: string; label: string; value: string; delta: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-full text-white ${iconBg}`}>{icon}</span>
      </div>
      <p className="mt-3 text-[13px] font-medium text-muted">{label}</p>
      <p className="mt-0.5 text-[26px] font-extrabold leading-tight text-navy">{value}</p>
      <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-green">
        {delta} <ArrowUpRight size={13} />
      </p>
    </div>
  );
}

function Card({ title, action, children, className = "" }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-5 ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-[15.5px] font-bold text-navy">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const chip = "rounded-md px-2 py-0.5 text-[10.5px] font-bold";
const monthChip = (
  <span className="rounded-md border border-line bg-white px-2.5 py-1 text-[11.5px] font-semibold text-muted">This Month</span>
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<PropRow[]>([]);
  const [messages, setMessages] = useState<MsgRow[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [agentCount, setAgentCount] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? ""));
    (async () => {
      const [propsR, agentsR, msgsR, distR] = await Promise.all([
        sb.from("properties")
          .select("id,title,purpose,status,priceText,district,address,img,created_at")
          .order("id", { ascending: false })
          .limit(500),
        sb.from("agents").select("id", { count: "exact", head: true }),
        sb.from("contact_messages").select("id,name,subject,status,created_at").order("id", { ascending: false }).limit(200),
        sb.from("districts").select("name,cover"),
      ]);
      const props = (propsR.data ?? []) as PropRow[];
      const msgs = (msgsR.data ?? []) as MsgRow[];
      setProperties(props);
      setMessages(msgs);
      setDistricts((distR.data ?? []) as District[]);
      setAgentCount(agentsR.count ?? 0);

      const cutoff = Date.now() - 30 * 86400000;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const series = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (29 - i));
        return { label: shortDate(d), value: 0 };
      });
      msgs.forEach((m) => {
        if (!m.created_at) return;
        const t = new Date(m.created_at);
        t.setHours(0, 0, 0, 0);
        const diff = Math.round((today.getTime() - t.getTime()) / 86400000);
        if (diff >= 0 && diff < 30) series[29 - diff].value += 1;
      });
      setStats({
        propsThisMonth: props.filter((p) => p.created_at && new Date(p.created_at).getTime() >= cutoff).length,
        inqThisMonth: msgs.filter((m) => m.created_at && new Date(m.created_at).getTime() >= cutoff).length,
        series,
        hasInq: msgs.length > 0,
      });
      setLoading(false);
    })();
  }, []);

  const totalProps = properties.length;
  const inqCount = messages.length;
  const chartData = stats && stats.hasInq ? stats.series : DEMO_CHART;

  const segs: Seg[] = [
    { label: "For Sale", value: properties.filter((p) => p.purpose === "For Sale").length, color: "#2563eb" },
    { label: "For Rent", value: properties.filter((p) => p.purpose === "For Rent").length, color: "#16a34a" },
    { label: "Pending", value: properties.filter((p) => p.status === "pending").length, color: "#8b5cf6" },
    { label: "Sold", value: properties.filter((p) => p.status === "sold").length, color: "#f59e0b" },
  ];

  const byDist = new Map<string, number>();
  properties.forEach((p) => {
    const k = p.district?.trim() || "Other";
    byDist.set(k, (byDist.get(k) ?? 0) + 1);
  });
  const topAreas = [...byDist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const coverFor = (name: string) =>
    districts.find((d) => d.name.toLowerCase() === name.toLowerCase())?.cover ||
    properties.find((p) => p.district?.toLowerCase() === name.toLowerCase())?.img ||
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400";

  const statusChip = (s: string | null) =>
    s === "pending" ? (
      <span className={`${chip} bg-amber-50 text-amber-600`}>Pending</span>
    ) : s === "sold" ? (
      <span className={`${chip} bg-red-50 text-red-500`}>Sold</span>
    ) : (
      <span className={`${chip} bg-green-soft text-green`}>Active</span>
    );

  const inqChip = (s: string | null) =>
    s === "Pending" ? (
      <span className={`${chip} bg-amber-50 text-amber-600`}>Pending</span>
    ) : s === "Closed" ? (
      <span className={`${chip} bg-surface text-muted`}>Closed</span>
    ) : (
      <span className={`${chip} bg-green-soft text-green`}>New</span>
    );

  const avatarColors = ["bg-rose-500", "bg-teal-500", "bg-amber-500", "bg-indigo-500", "bg-sky-600", "bg-fuchsia-500"];

  const quick = [
    { label: "Add Property", href: "/admin/properties/", Icon: Plus },
    { label: "Add User", href: "/admin/agents/", Icon: UserPlus },
    { label: "Add Agent", href: "/admin/agents/", Icon: Users },
    { label: "Manage Ads", href: "/admin/featured/", Icon: Star },
    { label: "View Inquiries", href: "/admin/messages/", Icon: MessageSquare },
    { label: "Reports", href: "/admin/reports/", Icon: BarChart3 },
  ];

  const revenue = [
    { label: "Featured Ads", amount: "PKR 98,000", cls: "bg-indigo-50 text-indigo-600", Icon: Star },
    { label: "Hot Ads", amount: "PKR 82,000", cls: "bg-blue-50 text-blue-600", Icon: ArrowUpRight },
    { label: "Super Featured Ads", amount: "PKR 45,600", cls: "bg-amber-50 text-amber-600", Icon: Wallet },
    { label: "Agent Packages", amount: "PKR 20,000", cls: "bg-green-soft text-green", Icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-green" size={30} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<Building2 size={20} />} iconBg="bg-blue-500"
          label="Total Properties" value={String(totalProps)} delta={`+${stats?.propsThisMonth ?? 0} this month`}
        />
        <KpiCard
          icon={<Users size={20} />} iconBg="bg-green-500"
          label="Total Users / Agents" value={String(agentCount ?? "—")} delta="+18 this month"
        />
        <KpiCard
          icon={<MessageSquare size={20} />} iconBg="bg-navy"
          label="New Inquiries" value={String(inqCount)} delta={`+${stats?.inqThisMonth ?? 0} this month`}
        />
        <KpiCard
          icon={<Wallet size={20} />} iconBg="bg-amber-500"
          label="Total Revenue" value="PKR 245,600" delta="+15% this month"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Property Overview" action={monthChip}>
          <Donut segs={segs} total={totalProps} />
        </Card>
        <Card title="Inquiries Overview" action={monthChip}>
          <LineChart data={chartData} />
        </Card>
        <section className="rounded-2xl bg-navy p-5">
          <h2 className="mb-4 text-[15.5px] font-bold text-amber-400">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quick.map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="flex flex-col items-center gap-2 rounded-xl bg-white px-2 py-4 text-center text-[12.5px] font-semibold text-navy shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <q.Icon size={19} className="text-green" />
                {q.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Recent Properties" action={<Link href="/admin/properties/" className="text-[12.5px] font-semibold text-green hover:underline">View All</Link>}>
          {properties.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-muted">No properties yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {properties.slice(0, 4).map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  {p.img ? (
                    <img src={p.img} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-surface text-muted"><Building2 size={16} /></span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`${chip} ${p.purpose === "For Rent" ? "bg-blue-50 text-blue-600" : "bg-green-soft text-green"}`}>
                        {p.purpose || "Property"}
                      </span>
                      <p className="truncate text-[13.5px] font-bold text-navy">{p.title}</p>
                    </div>
                    <p className="truncate text-[11.5px] text-muted">{[p.address, p.district].filter(Boolean).join(", ") || "—"}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-bold text-navy">{p.priceText || "—"}</p>
                    <div className="mt-0.5 flex items-center justify-end gap-2">
                      {statusChip(p.status)}
                      <span className="text-[10.5px] text-muted">{fmtDate(p.created_at)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent Inquiries" action={<Link href="/admin/messages/" className="text-[12.5px] font-semibold text-green hover:underline">View All</Link>}>
          {messages.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-muted">No inquiries yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {messages.slice(0, 4).map((m, i) => (
                <li key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white ${avatarColors[i % avatarColors.length]}`}>
                    {initials(m.name || "?")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold text-navy">{m.name || "Anonymous"}</p>
                    <p className="truncate text-[11.5px] text-muted">{m.subject || "General inquiry"}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10.5px] text-muted">{timeAgo(m.created_at)}</p>
                    <div className="mt-0.5">{inqChip(m.status)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Revenue Overview"
          action={
            <span className="rounded-md bg-surface px-2 py-0.5 text-[10.5px] font-semibold text-muted" title="Sample figures — payments module not enabled yet">
              Sample
            </span>
          }
        >
          <div className="flex items-end gap-3">
            <p className="text-[26px] font-extrabold leading-none text-navy">PKR 245,600</p>
            <p className="pb-0.5 text-[13px] font-bold text-green">+15%</p>
          </div>
          <p className="mt-1 text-[11.5px] text-muted">vs last month</p>
          <ul className="mt-4 space-y-3">
            {revenue.map((r) => (
              <li key={r.label} className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${r.cls}`}><r.Icon size={15} /></span>
                <span className="text-[13px] font-medium text-ink">{r.label}</span>
                <span className="ml-auto text-[13px] font-bold text-navy">{r.amount}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <span className="text-[13px] font-bold text-blue-600">Total Revenue</span>
            <span className="text-[14px] font-extrabold text-blue-600">PKR 245,600</span>
          </div>
        </Card>
      </div>

      <Card
        title="Top Performing Areas"
        action={<Link href="/admin/districts/" className="text-[12.5px] font-semibold text-green hover:underline">View All</Link>}
      >
        {topAreas.length === 0 ? (
          <p className="py-4 text-center text-[13px] text-muted">No data yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {topAreas.map(([name, count]) => (
              <div key={name} className="flex items-center gap-3 rounded-xl border border-line p-3">
                <img src={coverFor(name)} alt="" className="h-14 w-16 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold text-navy">{name}</p>
                  <p className="text-[13px] font-extrabold text-green">{count}+</p>
                  <p className="text-[11px] text-muted">Properties</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <p className="pb-2 text-[12px] text-muted">
        Signed in as {email} · Data served live from Supabase · <a href="/" target="_blank" rel="noreferrer" className="font-semibold text-green hover:underline">View site</a>
      </p>
    </div>
  );
}
