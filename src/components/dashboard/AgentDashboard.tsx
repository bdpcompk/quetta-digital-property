"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import {
  BarChart3, Building2, Eye, Heart, Headphones, Inbox, Landmark, LayoutDashboard,
  Loader2, MessageSquare, Pencil, PlusCircle, Search, Star, TrendingUp, UserCog, Users, Wrench,
  HardHat, FileSearch,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { initials } from "@/lib/useSession";
import { formatPKR } from "@/lib/data";
import DashboardShell, { type DashNavItem } from "./DashboardShell";
import PerformanceChart from "./PerformanceChart";

type Listing = {
  id: number;
  title: string;
  img: string | null;
  type: string | null;
  purpose: string | null;
  district: string | null;
  price: number;
  status: string | null;
  views: number | null;
  created_at: string;
};

type Lead = {
  id: number;
  name: string;
  phone: string | null;
  message: string | null;
  status: string;
  property_id: number | null;
  created_at: string;
  ago?: string;
  propertyTitle?: string;
};

type AgentRow = {
  id: number;
  name: string;
  type: string | null;
  rating: number | null;
  reviews: string | null;
  verified: boolean | null;
  location: string | null;
};

const DAY = 86400000;

function timeAgo(iso: string, now: number) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${Math.max(1, m)}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1d ago" : `${d}d ago`;
}

function seriesFromRows(rows: { created_at: string }[], now: number, days = 30) {
  const out = Array(days).fill(0) as number[];
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  for (const r of rows) {
    const d = new Date(r.created_at);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - d.getTime()) / DAY);
    if (diff >= 0 && diff < days) out[days - 1 - diff] += 1;
  }
  return out;
}

function seriesLabels(now: number, days = 30) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now - (days - 1 - i) * DAY);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
}

const TONE: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-soft text-green",
  orange: "bg-orange-50 text-orange-500",
  violet: "bg-violet-50 text-violet-600",
};

export default function AgentDashboard({
  session,
  name,
  embedded = false,
}: {
  session: Session;
  name: string;
  embedded?: boolean;
}) {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [agent, setAgent] = useState<AgentRow | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewsSeries, setViewsSeries] = useState<number[]>([]);
  const [inqSeries, setInqSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    let alive = true;
    const timer = setTimeout(async () => {
      const uid = session.user.id;
      const now = Date.now();
      const since = new Date(now - 29 * DAY).toISOString();
      const [agentQ, propsQ, leadsQ] = await Promise.all([
        sb
          .from("agents")
          .select("id,name,type,rating,reviews,verified,location")
          .eq("user_id", uid)
          .maybeSingle(),
        sb
          .from("properties")
          .select("id,title,img,type,purpose,district,price,status,views,created_at")
          .eq("created_by", uid)
          .order("created_at", { ascending: false }),
        sb
          .from("inquiries")
          .select("id,name,phone,message,status,property_id,created_at")
          .eq("owner_id", uid)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      if (!alive) return;

      const props = (propsQ.data ?? []) as Listing[];
      const leadRows = (leadsQ.data ?? []) as Lead[];

      let viewRows: { created_at: string }[] = [];
      if (props.length) {
        const viewQ = await sb
          .from("property_views")
          .select("created_at")
          .in("property_id", props.map((p) => p.id))
          .gte("created_at", since)
          .limit(5000);
        if (!alive) return;
        viewRows = (viewQ.data ?? []) as { created_at: string }[];
      }

      const titleMap = new Map(props.map((p) => [p.id, p.title]));
      setListings(props);
      setAgent((agentQ.data ?? null) as AgentRow | null);
      setLeads(
        leadRows.map((l) => ({
          ...l,
          ago: timeAgo(l.created_at, now),
          propertyTitle: l.property_id ? titleMap.get(l.property_id) : undefined,
        })),
      );
      setViewsSeries(seriesFromRows(viewRows, now));
      setInqSeries(seriesFromRows(leadRows, now));
      setLabels(seriesLabels(now));
      setLoaded(true);
    }, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [session]);

  const logout = async () => {
    const sb = supabase;
    if (sb) await sb.auth.signOut();
    router.push("/");
  };

  const total = listings.length;
  const active = listings.filter((l) => (l.status ?? "active") === "active").length;
  const totalViews = listings.reduce((s, l) => s + Number(l.views ?? 0), 0);
  const newLeads = leads.filter((l) => l.status === "new").length;
  const rating = agent?.rating != null ? Number(agent.rating).toFixed(1) : "—";
  const reviewsNote = agent?.reviews
    ? /review/i.test(String(agent.reviews))
      ? String(agent.reviews)
      : `${agent.reviews} reviews`
    : "no reviews yet";

  const nav: DashNavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/" },
    { label: "My Profile", icon: UserCog, href: "/profile/" },
    { label: "My Listings", icon: Building2, href: "#listings" },
    { label: "Add Property", icon: PlusCircle, href: "/sell/" },
    { label: "Leads & Inquiries", icon: Inbox, href: "#leads", badge: newLeads },
    { label: "Messages", icon: MessageSquare, href: "#messages", badge: newLeads },
    { label: "Favorites", icon: Heart, href: "/my-account/?tab=saved" },
    { label: "Analytics", icon: BarChart3, href: "#performance" },
    { label: "Scheme Listings", icon: Landmark, href: "/schemes/" },
    { label: "Tools", icon: Wrench, href: "/tools/" },
    { label: "Support", icon: Headphones, href: "/contact/" },
  ];

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-green" size={28} />
      </div>
    );
  }

  return (
    <DashboardShell
      title="Agent Dashboard"
      subtitle="Manage your listings, leads and clients all in one place."
      roleLabel={agent?.type || "Property Agent"}
      name={name}
      initials={initials(name)}
      nav={nav}
      onLogout={logout}
      embedded={embedded}
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={Building2} label="Total Listings" value={String(total)} note={`${active} active right now`} tone="blue" />
        <StatCard icon={Users} label="Active Leads" value={String(newLeads)} note={`${leads.length} total inquiries`} tone="green" />
        <StatCard icon={Eye} label="Total Views" value={totalViews.toLocaleString()} note="across your listings" tone="orange" />
        <StatCard icon={Star} label="Profile Rating" value={rating} note={reviewsNote} tone="violet" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section id="performance" className="rounded-2xl border border-line bg-white p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[15px] font-extrabold text-navy">Listing Performance (Last 30 Days)</h2>
            <div className="flex items-center gap-4 text-[11px] font-semibold text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Views
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green" /> Inquiries
              </span>
            </div>
          </div>
          <PerformanceChart views={viewsSeries} inquiries={inqSeries} labels={labels} />
        </section>

        <Card id="leads" title="Recent Leads" action={<AnchorLink href="#leads" label="View All" />}>
          {leads.length === 0 ? (
            <Empty text="Abhi koi lead nahi aayi. Apni listings share karein taake buyers rabta karein." />
          ) : (
            <div className="divide-y divide-line">
              {leads.slice(0, 5).map((l) => (
                <div key={l.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-extrabold text-navy">
                    {initials(l.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-navy">{l.name}</p>
                    <p className="truncate text-[11px] text-muted">
                      {l.propertyTitle || "Property inquiry"}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10.5px] font-medium text-muted">{l.ago}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card id="listings" title="My Listings" action={<Link href="/my-account/?tab=listings" className="text-[11.5px] font-bold text-green hover:underline">View All</Link>}>
        {listings.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-[12.5px] text-muted">Abhi tak koi property list nahi ki.</p>
            <Link href="/sell/" className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-green px-4 py-2 text-[12.5px] font-bold text-white hover:bg-green-dark">
              <PlusCircle size={14} /> Add New Property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-line text-[10.5px] uppercase tracking-wide text-muted">
                  <th className="pb-2 pe-3 text-start font-bold">Image</th>
                  <th className="pb-2 pe-3 text-start font-bold">Property Details</th>
                  <th className="pb-2 pe-3 text-start font-bold">Type</th>
                  <th className="pb-2 pe-3 text-start font-bold">Location</th>
                  <th className="pb-2 pe-3 text-start font-bold">Price</th>
                  <th className="pb-2 pe-3 text-start font-bold">Status</th>
                  <th className="pb-2 text-start font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {listings.slice(0, 5).map((l) => (
                  <tr key={l.id} className="text-[12px]">
                    <td className="py-2.5 pe-3">
                      {l.img ? (
                        <img src={l.img} alt={l.title} className="h-10 w-14 rounded-lg object-cover" />
                      ) : (
                        <span className="flex h-10 w-14 items-center justify-center rounded-lg bg-surface text-muted">
                          <Building2 size={16} />
                        </span>
                      )}
                    </td>
                    <td className="pe-3">
                      <p className="max-w-[220px] truncate font-bold text-navy">{l.title}</p>
                      <p className="text-[10.5px] text-muted">{l.purpose || "Sale"}</p>
                    </td>
                    <td className="pe-3">
                      <TypeChip type={l.type} />
                    </td>
                    <td className="pe-3 text-muted">{l.district || "—"}</td>
                    <td className="pe-3 font-bold text-navy">{formatPKR(l.price)}</td>
                    <td className="pe-3">
                      <StatusChip status={l.status} />
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Link href={`/property/?id=${l.id}`} className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface hover:text-green" aria-label="View">
                          <Eye size={14} />
                        </Link>
                        <Link href="/my-account/?tab=listings" className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface hover:text-green" aria-label="Edit">
                          <Pencil size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card id="messages" title="Latest Messages" action={<AnchorLink href="#messages" label="View All" />}>
          {leads.filter((l) => l.message).length === 0 ? (
            <Empty text="Abhi koi message nahi aaya." />
          ) : (
            <div className="divide-y divide-line">
              {leads
                .filter((l) => l.message)
                .slice(0, 5)
                .map((l) => (
                  <div key={l.id} className="flex items-start gap-3 py-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-extrabold text-navy">
                      {initials(l.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-bold text-navy">{l.name}</p>
                      <p className="truncate text-[11px] text-muted">{l.message}</p>
                    </div>
                    <span className="shrink-0 text-[10.5px] font-medium text-muted">{l.ago}</span>
                  </div>
                ))}
            </div>
          )}
        </Card>

        <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-[15px] font-extrabold text-navy">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <QuickAction href="/sell/" label="Add New Property" icon={PlusCircle} tone="blue" sub="List a new property" />
            <QuickAction href="/listings/" label="Search Properties" icon={Search} tone="green" sub="Find properties" />
            <QuickAction href="#leads" label="View Leads" icon={Users} tone="violet" sub="Manage your leads" />
            <QuickAction href="/my-account/" label="Update Profile" icon={UserCog} tone="orange" sub="Keep your profile fresh" />
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <h2 className="mb-3 text-[15px] font-extrabold text-navy">Tools &amp; Resources</h2>
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <ToolLink href="/tools/construction-cost-calculator/" label="Construction Calculator" sub="Estimate construction cost" icon={HardHat} tone="blue" />
          <ToolLink href="/tools/land-records/" label="Land Record Search" sub="Check land record (Balochistan)" icon={FileSearch} tone="green" />
          <ToolLink href="/tools/trends-and-index/" label="Market Analytics" sub="View market insights" icon={BarChart3} tone="orange" />
          <ToolLink href="/contact/" label="Support Center" sub="Get help & FAQs" icon={Headphones} tone="violet" />
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-gradient-to-r from-navy to-navy-soft p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
            <TrendingUp size={21} />
          </span>
          <div>
            <p className="text-[15px] font-extrabold text-white">Increase Your Reach</p>
            <p className="text-[12px] text-white/70">
              Apni profile complete karein aur zyada buyers aur sellers tak pohanchein.
            </p>
          </div>
        </div>
        <Link href="/my-account/" className="rounded-xl bg-green px-5 py-2.5 text-[12.5px] font-bold text-white transition-colors hover:bg-green-dark">
          Update Profile
        </Link>
      </section>
    </DashboardShell>
  );
}

function Card({
  id,
  title,
  action,
  children,
}: {
  id?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="rounded-2xl border border-line bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-extrabold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function AnchorLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="text-[11.5px] font-bold text-green hover:underline">
      {label}
    </a>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl bg-surface px-4 py-5 text-center text-[12px] text-muted">{text}</p>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  tone,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  note: string;
  tone: keyof typeof TONE;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE[tone]}`}>
        <Icon size={19} />
      </span>
      <p className="mt-3 text-[11.5px] font-semibold text-muted">{label}</p>
      <p className="mt-0.5 text-[23px] font-extrabold leading-none text-navy">{value}</p>
      <p className="mt-1.5 flex items-center gap-1 text-[10.5px] font-semibold text-green">
        <TrendingUp size={11} /> {note}
      </p>
    </div>
  );
}

function TypeChip({ type }: { type: string | null }) {
  const v = (type ?? "").toLowerCase();
  const cls =
    v.includes("house") || v.includes("home")
      ? "bg-green-soft text-green"
      : v.includes("plot") || v.includes("land")
        ? "bg-blue-50 text-blue-600"
        : v.includes("shop") || v.includes("commercial")
          ? "bg-orange-50 text-orange-500"
          : "bg-violet-50 text-violet-600";
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-[10.5px] font-bold ${cls}`}>
      {type || "Property"}
    </span>
  );
}

function StatusChip({ status }: { status: string | null }) {
  const active = (status ?? "active").toLowerCase() === "active";
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-[10.5px] font-bold ${
        active ? "bg-green-soft text-green" : "bg-orange-50 text-orange-500"
      }`}
    >
      {active ? "Active" : "Pending"}
    </span>
  );
}

function QuickAction({
  href,
  label,
  sub,
  icon: Icon,
  tone,
}: {
  href: string;
  label: string;
  sub: string;
  icon: typeof PlusCircle;
  tone: keyof typeof TONE;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start gap-2 rounded-xl border border-line bg-white p-3 transition-all hover:border-green hover:shadow-sm"
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${TONE[tone]}`}>
        <Icon size={17} />
      </span>
      <span className="text-[12px] font-bold leading-tight text-navy">{label}</span>
      <span className="text-[10.5px] leading-tight text-muted">{sub}</span>
    </Link>
  );
}

function ToolLink({
  href,
  label,
  sub,
  icon: Icon,
  tone,
}: {
  href: string;
  label: string;
  sub: string;
  icon: typeof HardHat;
  tone: keyof typeof TONE;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-3 transition-all hover:border-green hover:shadow-sm"
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${TONE[tone]}`}>
        <Icon size={17} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[11.5px] font-bold text-navy">{label}</span>
        <span className="block truncate text-[10px] text-muted">{sub}</span>
      </span>
    </Link>
  );
}
