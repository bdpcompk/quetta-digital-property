"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import {
  BarChart3, Building2, CheckCircle2, Clock, Download, ExternalLink, FileText,
  Headphones, Images, LayoutDashboard, LayoutGrid, Loader2, MessageSquare, PlusCircle,
  ShieldCheck, UserCog, Wallet, MapPin, Video,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { initials } from "@/lib/useSession";
import { formatPKR } from "@/lib/data";
import DashboardShell, { type DashNavItem } from "./DashboardShell";

type Block = {
  name: string;
  total?: string;
  sold?: string;
  reserved?: string;
  available?: string;
  map_img?: string;
};

type Plan = { down?: string; total?: string; plan_type?: string; installment?: string };

type SchemeRow = {
  id: number;
  name: string;
  location: string | null;
  authority: string | null;
  noc_number: string | null;
  noc_status: string | null;
  verified: boolean | null;
  verified_on: string | null;
  approval_date: string | null;
  approval_doc: string | null;
  photos: string[] | null;
  video_url: string | null;
  facilities: string[] | null;
  description: string | null;
  total_area: string | null;
  res_plots: string | null;
  com_plots: string | null;
  total_plots: string | null;
  blocks: Block[] | null;
  payment_plans: Plan[] | null;
  map_link: string | null;
  registration_method: string | null;
  development_status: string | null;
  created_at: string;
};

type Lead = {
  id: number;
  name: string;
  phone: string | null;
  message: string | null;
  status: string;
  property_id: number | null;
  scheme_id: number | null;
  created_at: string;
  ago?: string;
  interested?: string;
};

type OwnerDocs = {
  registration_doc: string | null;
  cnic_copy: string | null;
  logo_doc: string | null;
  extra_docs: string | null;
};

function timeAgo(iso: string, now: number) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${Math.max(1, m)}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1d ago" : `${d}d ago`;
}

function num(v: string | number | null | undefined) {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function plotTotals(s: SchemeRow | undefined) {
  if (!s) return { total: 0, available: 0, sold: 0 };
  const blocks = s.blocks ?? [];
  if (blocks.length) {
    return {
      total: blocks.reduce((a, b) => a + num(b.total), 0),
      available: blocks.reduce((a, b) => a + num(b.available), 0),
      sold: blocks.reduce((a, b) => a + num(b.sold), 0),
    };
  }
  const total = num(s.total_plots) || num(s.res_plots) + num(s.com_plots);
  return { total, available: total, sold: 0 };
}

const TONE: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-soft text-green",
  orange: "bg-orange-50 text-orange-500",
  violet: "bg-violet-50 text-violet-600",
};

export default function OwnerDashboard({ session, name }: { session: Session; name: string }) {
  const router = useRouter();
  const [schemes, setSchemes] = useState<SchemeRow[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [docs, setDocs] = useState<OwnerDocs | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [blockTab, setBlockTab] = useState("All Blocks");
  const [detailTab, setDetailTab] = useState("Overview");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    let alive = true;
    const timer = setTimeout(async () => {
      const uid = session.user.id;
      const now = Date.now();
      const [schemesQ, leadsQ, docsQ, propsQ] = await Promise.all([
        sb.from("schemes").select("*").eq("created_by", uid).order("created_at", { ascending: false }),
        sb
          .from("inquiries")
          .select("id,name,phone,message,status,property_id,scheme_id,created_at")
          .eq("owner_id", uid)
          .order("created_at", { ascending: false })
          .limit(50),
        sb
          .from("role_requests")
          .select("registration_doc,cnic_copy,logo_doc,extra_docs")
          .eq("user_id", uid)
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(1),
        sb.from("properties").select("id,title").eq("created_by", uid),
      ]);
      if (!alive) return;
      const rows = (schemesQ.data ?? []) as SchemeRow[];
      const leadRows = (leadsQ.data ?? []) as Lead[];
      const propMap = new Map(
        ((propsQ.data ?? []) as { id: number; title: string }[]).map((p) => [p.id, p.title]),
      );
      const schemeMap = new Map(rows.map((s) => [s.id, s.name]));
      setSchemes(rows);
      setActiveId(rows[0]?.id ?? null);
      setDocs((docsQ.data?.[0] as OwnerDocs | undefined) ?? null);
      setLeads(
        leadRows.map((l) => ({
          ...l,
          ago: timeAgo(l.created_at, now),
          interested:
            (l.property_id ? propMap.get(l.property_id) : undefined) ||
            (l.scheme_id ? schemeMap.get(l.scheme_id) : undefined) ||
            "General inquiry",
        })),
      );
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

  const scheme = schemes.find((s) => s.id === activeId) ?? schemes[0];
  const totals = plotTotals(scheme);
  const totalPlots = schemes.reduce((a, s) => a + plotTotals(s).total, 0);
  const availablePlots = schemes.reduce((a, s) => a + plotTotals(s).available, 0);
  const newLeads = leads.filter((l) => l.status === "new").length;

  const checks = scheme
    ? [
        { label: "Application Form", ok: !!(docs?.registration_doc || scheme.approval_doc) },
        {
          label: "Authority / NOC Approval",
          ok: (scheme.noc_status ?? "").toLowerCase().includes("approved"),
        },
        { label: "Documents Upload", ok: !!(scheme.approval_doc || docs?.registration_doc) },
        { label: "On-site Verification", ok: !!scheme.verified },
        { label: "Profile Verified", ok: true },
      ]
    : [];
  const pct = checks.length
    ? Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
    : 0;

  const docList: { label: string; url: string }[] = [];
  if (docs?.registration_doc) docList.push({ label: "Application Form", url: docs.registration_doc });
  if (docs?.cnic_copy) docList.push({ label: "CNIC Copy", url: docs.cnic_copy });
  if (docs?.logo_doc) docList.push({ label: "Monogram / Logo", url: docs.logo_doc });
  if (scheme?.approval_doc) docList.push({ label: "Approval Letter / NOC", url: scheme.approval_doc });
  if (docs?.extra_docs) docList.push({ label: "Additional Documents", url: docs.extra_docs });

  const nav: DashNavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/" },
    { label: "My Schemes", icon: Building2, href: "/profile/schemes/" },
    { label: "Add New Scheme", icon: PlusCircle, href: "/schemes/add/" },
    { label: "Plots Management", icon: LayoutGrid, href: "#blocks" },
    { label: "Documents & Approvals", icon: ShieldCheck, href: "#documents" },
    { label: "Sales & Bookings", icon: Wallet, href: "#inquiries" },
    { label: "Analytics & Reports", icon: BarChart3, href: "#overview" },
    { label: "Messages", icon: MessageSquare, href: "#inquiries", badge: newLeads },
    { label: "Profile Settings", icon: UserCog, href: "/my-account/#settings" },
    { label: "Support", icon: Headphones, href: "/contact/" },
  ];

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-green" size={28} />
      </div>
    );
  }

  const blocks = scheme?.blocks ?? [];
  const shownBlocks =
    blockTab === "All Blocks" ? blocks : blocks.filter((b) => b.name === blockTab);
  const plan = scheme?.payment_plans?.[0];

  return (
    <DashboardShell
      title="Scheme Owner Dashboard"
      subtitle="Manage your scheme, plots, documents and approvals."
      roleLabel="Scheme Owner"
      name={name}
      initials={initials(name)}
      nav={nav}
      onLogout={logout}
    >
      {schemes.length === 0 ? (
        <section className="rounded-2xl border border-line bg-white p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-soft text-green">
            <Building2 size={30} />
          </span>
          <h2 className="mt-4 text-[18px] font-extrabold text-navy">Abhi tak koi scheme nahi</h2>
          <p className="mx-auto mt-1.5 max-w-[420px] text-[12.5px] text-muted">
            Apni pehli housing scheme add karein — plots, documents aur approval details manage
            karein.
          </p>
          <Link
            href="/schemes/add/"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-green px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-green-dark"
          >
            <PlusCircle size={15} /> Add New Scheme
          </Link>
        </section>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard icon={Building2} label="Total Schemes" value={String(schemes.length)} note="registered with BDP" tone="blue" />
            <StatCard icon={LayoutGrid} label="Total Plots" value={totalPlots.toLocaleString()} note="in your schemes" tone="green" />
            <StatCard icon={ShieldCheck} label="Available Plots" value={availablePlots.toLocaleString()} note="ready for booking" tone="orange" />
            <StatCard icon={MessageSquare} label="Total Inquiries" value={String(leads.length)} note={`${newLeads} new`} tone="violet" />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
            <section id="overview" className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[15px] font-extrabold text-navy">Scheme Overview</h2>
                {schemes.length > 1 && (
                  <select
                    value={scheme?.id ?? ""}
                    onChange={(e) => {
                      setActiveId(Number(e.target.value));
                      setBlockTab("All Blocks");
                    }}
                    className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-navy outline-none focus:border-green"
                  >
                    {schemes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                {scheme?.photos?.[0] ? (
                  <img
                    src={scheme.photos[0]}
                    alt={scheme.name}
                    className="h-36 w-full rounded-xl object-cover sm:w-48"
                  />
                ) : (
                  <span className="flex h-36 w-full items-center justify-center rounded-xl bg-surface text-muted sm:w-48">
                    <Building2 size={34} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[16px] font-extrabold text-navy">
                    {scheme?.name}
                    {scheme?.verified && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-green-soft px-2 py-0.5 text-[10px] font-bold text-green">
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    )}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[12px] text-muted">
                    <MapPin size={12} className="text-green" /> {scheme?.location || "—"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-surface px-2 py-0.5 text-[10.5px] font-semibold text-muted">
                      {scheme?.development_status || "Residential"}
                    </span>
                    <span className="rounded-md bg-surface px-2 py-0.5 text-[10.5px] font-semibold text-muted">
                      {num(scheme?.res_plots) + num(scheme?.com_plots)} plots
                    </span>
                    {scheme?.total_area && (
                      <span className="rounded-md bg-surface px-2 py-0.5 text-[10.5px] font-semibold text-muted">
                        {scheme.total_area}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 space-y-1 text-[11.5px] text-muted">
                    <p>
                      <span className="font-semibold text-navy">Approved by:</span>{" "}
                      {scheme?.authority || "—"}
                    </p>
                    <p>
                      <span className="font-semibold text-navy">Approval No:</span>{" "}
                      {scheme?.noc_number || "—"}
                    </p>
                    <p>
                      <span className="font-semibold text-navy">Approval Date:</span>{" "}
                      {scheme?.approval_date || scheme?.verified_on || "—"}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/scheme/?id=${scheme?.id}`}
                      className="rounded-lg bg-green px-3.5 py-2 text-[11.5px] font-bold text-white transition-colors hover:bg-green-dark"
                    >
                      View Details
                    </Link>
                    <Link
                      href="/profile/schemes/"
                      className="rounded-lg border border-line px-3.5 py-2 text-[11.5px] font-bold text-navy transition-colors hover:bg-surface"
                    >
                      Manage Scheme
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <h2 className="mb-3 text-[15px] font-extrabold text-navy">Verification Status</h2>
              <div className="flex flex-col items-center gap-3 sm:flex-row xl:flex-col">
                <div className="flex flex-col items-center">
                  <Donut pct={pct} />
                  <p className="mt-1 text-[11px] font-semibold text-muted">Scheme Verified</p>
                </div>
                <div className="w-full flex-1 space-y-2">
                  {checks.map((c) => (
                    <div key={c.label} className="flex items-center justify-between gap-2 text-[11.5px]">
                      <span className="text-ink">{c.label}</span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10.5px] font-bold ${
                          c.ok ? "text-green" : "text-orange-500"
                        }`}
                      >
                        {c.ok ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {c.ok ? "Verified" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section id="blocks" className="rounded-2xl border border-line bg-white p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[15px] font-extrabold text-navy">Blocks &amp; Plots</h2>
              <div className="flex flex-wrap gap-1.5">
                {["All Blocks", ...blocks.map((b) => b.name)].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setBlockTab(tab)}
                    className={`rounded-lg px-2.5 py-1 text-[10.5px] font-bold transition-colors ${
                      blockTab === tab
                        ? "bg-green text-white"
                        : "border border-line bg-white text-muted hover:text-navy"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {shownBlocks.length === 0 ? (
              <p className="rounded-xl bg-surface px-4 py-5 text-center text-[12px] text-muted">
                Is scheme me abhi koi block/plot structure add nahi hua.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead>
                    <tr className="border-b border-line text-[10.5px] uppercase tracking-wide text-muted">
                      <th className="pb-2 pe-3 text-start font-bold">Block</th>
                      <th className="pb-2 pe-3 text-start font-bold">Total Plots</th>
                      <th className="pb-2 pe-3 text-start font-bold">Available</th>
                      <th className="pb-2 pe-3 text-start font-bold">Sold Out</th>
                      <th className="pb-2 pe-3 text-start font-bold">Price (PKR)</th>
                      <th className="pb-2 pe-3 text-start font-bold">Installment Plan</th>
                      <th className="pb-2 text-start font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {shownBlocks.map((b) => (
                      <tr key={b.name} className="text-[12px]">
                        <td className="py-2.5 pe-3 font-bold text-navy">{b.name}</td>
                        <td className="pe-3 text-muted">{num(b.total).toLocaleString()}</td>
                        <td className="pe-3 font-bold text-green">{num(b.available).toLocaleString()}</td>
                        <td className="pe-3 text-muted">{num(b.sold).toLocaleString()}</td>
                        <td className="pe-3 font-semibold text-navy">
                          {plan?.total ? formatPKR(num(plan.total)) : "—"}
                        </td>
                        <td className="pe-3 text-muted">
                          {plan?.installment ? `${formatPKR(num(plan.installment))}/mo` : "—"}
                        </td>
                        <td>
                          <Link
                            href={`/scheme/?id=${scheme?.id}`}
                            className="text-[11px] font-bold text-green hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
            <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <h2 className="mb-3 text-[15px] font-extrabold text-navy">Scheme Details</h2>
              <div className="flex flex-wrap gap-1.5 border-b border-line pb-2.5">
                {["Overview", "Facilities", "Location Map", "Video & Gallery"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDetailTab(tab)}
                    className={`rounded-lg px-2.5 py-1 text-[10.5px] font-bold transition-colors ${
                      detailTab === tab
                        ? "bg-navy text-white"
                        : "text-muted hover:bg-surface hover:text-navy"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {detailTab === "Overview" && (
                <div className="mt-3 grid gap-x-6 sm:grid-cols-2">
                  {[
                    ["Scheme Name", scheme?.name || "—"],
                    ["Location", scheme?.location || "—"],
                    ["Total Area", scheme?.total_area || "—"],
                    ["Development Type", scheme?.development_status || "—"],
                    ["Approval Status", scheme?.noc_status || "—"],
                    ["Approving Authority", scheme?.authority || "—"],
                    ["Approval No", scheme?.noc_number || "—"],
                    ["Approval Date", scheme?.approval_date || scheme?.verified_on || "—"],
                    ["University Approval", scheme?.verified ? "Yes" : "Pending"],
                    ["Facilities", scheme?.facilities?.join(", ") || "—"],
                  ].map(([l, v]) => (
                    <div
                      key={l}
                      className="flex items-start justify-between gap-3 border-b border-line py-2.5 text-[11.5px] last:border-0"
                    >
                      <span className="shrink-0 text-muted">{l}</span>
                      <span className="text-end font-semibold text-navy">{v}</span>
                    </div>
                  ))}
                  {scheme?.description && (
                    <p className="mt-2 rounded-xl bg-surface p-3 text-[11.5px] leading-relaxed text-muted sm:col-span-2">
                      {scheme.description}
                    </p>
                  )}
                </div>
              )}

              {detailTab === "Facilities" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(scheme?.facilities ?? []).length === 0 ? (
                    <p className="text-[12px] text-muted">Koi facilities add nahi ki gayin.</p>
                  ) : (
                    (scheme?.facilities ?? []).map((f) => (
                      <span
                        key={f}
                        className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[11.5px] font-semibold capitalize text-navy"
                      >
                        {f}
                      </span>
                    ))
                  )}
                </div>
              )}

              {detailTab === "Location Map" && (
                <div className="mt-3">
                  <p className="flex items-center gap-1.5 text-[12px] text-muted">
                    <MapPin size={13} className="text-green" /> {scheme?.location || "—"}
                  </p>
                  {scheme?.map_link ? (
                    <a
                      href={scheme.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-[11.5px] font-bold text-navy transition-colors hover:bg-surface"
                    >
                      <ExternalLink size={13} /> Open in Google Maps
                    </a>
                  ) : (
                    <p className="mt-3 text-[11.5px] text-muted">Map link add nahi hua.</p>
                  )}
                </div>
              )}

              {detailTab === "Video & Gallery" && (
                <div className="mt-3">
                  {scheme?.video_url ? (
                    <a
                      href={scheme.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-[11.5px] font-bold text-navy transition-colors hover:bg-surface"
                    >
                      <Video size={13} /> Watch Video
                    </a>
                  ) : (
                    <p className="text-[11.5px] text-muted">Video add nahi hui.</p>
                  )}
                  {(scheme?.photos ?? []).length > 0 ? (
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {(scheme?.photos ?? []).slice(0, 8).map((p) => (
                        <img key={p} src={p} alt={scheme?.name} className="h-16 w-full rounded-lg object-cover" />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-muted">
                      <Images size={13} /> Gallery images nahi hain.
                    </p>
                  )}
                </div>
              )}
            </section>

            <section id="documents" className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <h2 className="mb-3 text-[15px] font-extrabold text-navy">Scheme Documents</h2>
              {docList.length === 0 ? (
                <p className="rounded-xl bg-surface px-4 py-5 text-center text-[12px] text-muted">
                  Abhi koi document upload nahi hua.
                </p>
              ) : (
                <div className="space-y-2">
                  {docList.map((d) => (
                    <div key={d.label} className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                        <FileText size={15} />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-navy">
                        {d.label}
                      </span>
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 text-[10.5px] font-bold text-green hover:underline"
                      >
                        <Download size={12} /> Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
            <section id="inquiries" className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-[15px] font-extrabold text-navy">Recent Inquiries</h2>
                <span className="text-[11px] font-semibold text-muted">{leads.length} total</span>
              </div>
              {leads.length === 0 ? (
                <p className="rounded-xl bg-surface px-4 py-5 text-center text-[12px] text-muted">
                  Abhi koi inquiry nahi aayi.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px]">
                    <thead>
                      <tr className="border-b border-line text-[10.5px] uppercase tracking-wide text-muted">
                        <th className="pb-2 pe-3 text-start font-bold">Name</th>
                        <th className="pb-2 pe-3 text-start font-bold">Contact</th>
                        <th className="pb-2 pe-3 text-start font-bold">Interested In</th>
                        <th className="pb-2 pe-3 text-start font-bold">Date</th>
                        <th className="pb-2 text-start font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {leads.slice(0, 5).map((l) => (
                        <tr key={l.id} className="text-[11.5px]">
                          <td className="py-2.5 pe-3 font-bold text-navy">{l.name}</td>
                          <td className="pe-3 text-muted">{l.phone || "—"}</td>
                          <td className="pe-3 text-muted">
                            <span className="block max-w-[160px] truncate">{l.interested}</span>
                          </td>
                          <td className="pe-3 text-muted">
                            {new Date(l.created_at).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td>
                            <InquiryStatus status={l.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <h2 className="mb-3 text-[15px] font-extrabold text-navy">Quick Actions</h2>
              <div className="grid gap-2.5">
                <QuickAction href="/schemes/add/" label="Add New Scheme" sub="Register a new scheme" icon={PlusCircle} tone="blue" />
                <QuickAction href="/become-owner/" label="Upload Documents" sub="Add approvals & files" icon={FileText} tone="green" />
                <QuickAction href="#blocks" label="Manage Plots" sub="Update block availability" icon={LayoutGrid} tone="orange" />
                <QuickAction href="/profile/schemes/" label="View Reports" sub="Check your submissions" icon={BarChart3} tone="violet" />
              </div>
            </section>
          </div>
        </>
      )}
    </DashboardShell>
  );
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
      <p className="mt-1.5 text-[10.5px] font-semibold text-green">{note}</p>
    </div>
  );
}

function Donut({ pct }: { pct: number }) {
  const R = 40;
  const C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 110 110" className="h-[112px] w-[112px]">
      <circle cx="55" cy="55" r={R} fill="none" stroke="#e5e7eb" strokeWidth="9" />
      <circle
        cx="55"
        cy="55"
        r={R}
        fill="none"
        stroke="#1a8754"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * C} ${C}`}
        transform="rotate(-90 55 55)"
      />
      <text x="55" y="60" textAnchor="middle" fontSize="21" fontWeight="800" fill="#16294a">
        {pct}%
      </text>
    </svg>
  );
}

function InquiryStatus({ status }: { status: string }) {
  const v = (status ?? "new").toLowerCase();
  const cls = v.includes("new")
    ? "bg-blue-50 text-blue-600"
    : v.includes("contact")
      ? "bg-green-soft text-green"
      : "bg-orange-50 text-orange-500";
  const label = v.includes("new") ? "New" : v.includes("contact") ? "Contacted" : "In Progress";
  return <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${cls}`}>{label}</span>;
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
