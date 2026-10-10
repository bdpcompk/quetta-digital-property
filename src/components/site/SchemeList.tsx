"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BadgeCheck, Building2, FileText, Landmark, MapPin, Phone, Plus, ScrollText,
  Search, ShieldCheck, Users,
} from "lucide-react";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import {
  AUTHORITIES, DISTRICTS, QDA_SCHEMES, SCHEMES, formatPKR, getQdaSchemes, getSchemes,
} from "@/lib/data";
import { formatArea } from "@/lib/area";
import type { QdaScheme, Scheme } from "@/lib/types";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800";

const NOC_CHIP: Record<string, string> = {
  Approved: "bg-green text-white",
  "Under Process": "bg-amber-400 text-navy",
  "Not Approved": "bg-red-500 text-white",
  "Not Listed": "bg-red-500 text-white",
};

const STATUS_CHIP: Record<string, string> = {
  Active: "bg-green text-white",
  Sold: "bg-slate-700 text-white",
  Hold: "bg-amber-500 text-white",
  VERIFIED: "bg-green text-white",
  "UNDER VERIFICATION": "bg-amber-400 text-navy",
  "NOT VERIFIED": "bg-red-500 text-white",
  REJECTED: "bg-slate-800 text-white",
};

const STATUS_OPTIONS = ["All", "Approved", "Under Process", "Not Listed", "Not Approved"];
const AUTHORITY_OPTIONS = ["All", "QDA", "BDA", "GDA", "BHTPA", "Other"];

const nocColor = (v?: string) =>
  /not listed|not approved/i.test(v ?? "")
    ? "text-red-500"
    : /under/i.test(v ?? "")
      ? "text-amber-600"
      : "text-green";

function SchemeCard({ s }: { s: Scheme }) {
  const photo = s.photos?.[0] ?? "";
  const authFull = AUTHORITIES[s.authority] ?? "";
  const nocChip = NOC_CHIP[s.noc_status] ?? "bg-slate-500 text-white";

  return (
    <Link href={`/scheme/?id=${s.id}`} className="lift block overflow-hidden rounded-2xl border border-line bg-white transition-colors hover:border-green/40">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 shrink-0 bg-surface sm:h-auto sm:w-60">
          {photo ? (
            <img src={photo} alt={s.name} className="h-full w-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <MapPin size={30} />
            </div>
          )}
          {s.status !== "Active" && (
            <span className={`absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase ${STATUS_CHIP[s.status] ?? "bg-slate-600 text-white"}`}>
              {s.status}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <h3 className="text-[18px] font-extrabold leading-snug text-navy">{s.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[13.5px] text-muted">
                <MapPin size={13} className="shrink-0 text-green" /> {s.location}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-wide ${nocChip}`}>
                <ShieldCheck size={12} /> NOC: {s.noc_status}
              </span>
              {s.verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green px-3 py-1.5 text-[11px] font-bold uppercase text-white">
                  <BadgeCheck size={12} /> Verified
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-surface px-3 py-1.5 text-[11px] font-bold uppercase text-slate-500 ring-1 ring-line">
                  Unverified
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13.5px]">
              <Landmark size={13} className="mt-0.5 shrink-0 text-green" />
              <span className="text-muted">Authority: <b className="text-navy">{s.authority ? `${s.authority} — ${authFull}` : "—"}</b></span>
            </p>
            <p className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13.5px]">
              <FileText size={13} className="mt-0.5 shrink-0 text-green" />
              <span className="text-muted">NOC No: <b className="text-navy">{s.noc_number || "—"}</b></span>
            </p>
            <p className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13.5px]">
              <ScrollText size={13} className="mt-0.5 shrink-0 text-green" />
              <span className="text-muted">Registration: <b className="text-navy">{s.registration_method || "—"}</b></span>
            </p>
            <p className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13.5px]">
              <Phone size={13} className="mt-0.5 shrink-0 text-green" />
              <span className="text-muted">Contact: <b className="text-navy">{s.owner_name || "Owner"}</b></span>
            </p>
          </div>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-line pt-3.5">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Total Price</p>
              <p className="text-[20px] font-extrabold leading-tight text-green">
                {s.price_total ? formatPKR(s.price_total) : "Contact for price"}
              </p>
            </div>
            <span className="btn-ghost">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function QdaCard({ q }: { q: QdaScheme }) {
  const nocChip = NOC_CHIP[q.status] ?? "bg-slate-500 text-white";
  const finalChip = STATUS_CHIP[q.final_status ?? "UNDER VERIFICATION"] ?? STATUS_CHIP["UNDER VERIFICATION"];

  return (
    <Link href={`/qda-scheme/?name=${encodeURIComponent(q.name)}`} className="lift block overflow-hidden rounded-2xl border border-line bg-white transition-colors hover:border-green/40">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 shrink-0 bg-surface sm:h-auto sm:w-60">
          <img src={q.img || FALLBACK_IMG} alt={q.name} className="h-full w-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase ${finalChip}`}>
            {q.final_status ?? "UNDER VERIFICATION"}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <h3 className="text-[18px] font-extrabold leading-snug text-navy">{q.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[13.5px] text-muted">
                <MapPin size={13} className="shrink-0 text-green" /> {q.location || q.district}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-wide ${nocChip}`}>
                <ShieldCheck size={12} /> NOC: {q.status}
              </span>
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13.5px]">
              <Building2 size={13} className="mt-0.5 shrink-0 text-green" />
              <span className="text-muted">Authority: <b className="text-navy">{q.authority || "QDA"}</b></span>
            </p>
            <p className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13.5px]">
              <FileText size={13} className="mt-0.5 shrink-0 text-green" />
              <span className="text-muted">NOC: <b className={nocColor(q.noc_status || q.status)}>{q.noc || q.noc_status || "—"}</b></span>
            </p>
            <p className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13.5px]">
              <ScrollText size={13} className="mt-0.5 shrink-0 text-green" />
              <span className="text-muted">Registration: <b className="text-navy">{q.registration_method || "—"}</b></span>
            </p>
            <p className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13.5px]">
              <Users size={13} className="mt-0.5 shrink-0 text-green" />
              <span className="text-muted">Plots: <b className="text-navy">{q.resPlots} Res · {q.comPlots} Com</b></span>
            </p>
          </div>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-line pt-3.5">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Total Area</p>
              <p className="text-[20px] font-extrabold leading-tight text-green">{formatArea(q.totalArea) || "—"}</p>
            </div>
            <span className="btn-ghost">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SchemeList() {
  const params = useSearchParams();
  const [schemes, setSchemes] = useState<Scheme[]>(SCHEMES);
  const [qdaList, setQdaList] = useState<QdaScheme[]>(QDA_SCHEMES);
  const [verifiedOnly, setVerifiedOnly] = useState(params?.get("verified") === "1");
  const [status, setStatus] = useState(params?.get("status") ?? "All");
  const [authority, setAuthority] = useState(params?.get("authority") ?? "All");
  const [district, setDistrict] = useState(params?.get("district") ?? "All");
  const [qInput, setQInput] = useState(params?.get("q") ?? "");
  const [search, setSearch] = useState(params?.get("q") ?? "");

  useEffect(() => {
    getSchemes().then(setSchemes);
    getQdaSchemes().then(setQdaList);
  }, []);

  const matches = (name: string, loc: string) => {
    if (!search) return true;
    const t = search.toLowerCase();
    return name.toLowerCase().includes(t) || loc.toLowerCase().includes(t);
  };

  const shownSchemes = schemes.filter((s) => {
    if (status !== "All" && s.noc_status !== status) return false;
    if (authority !== "All" && s.authority !== authority) return false;
    if (district !== "All" && !s.location.toLowerCase().includes(district.toLowerCase())) return false;
    if (verifiedOnly && !s.verified) return false;
    return matches(s.name, s.location);
  });

  const shownQda = qdaList.filter((q) => {
    if (status !== "All" && q.status !== status) return false;
    if (authority !== "All" && (q.authority || "QDA") !== authority) return false;
    if (district !== "All" && q.district !== district) return false;
    if (verifiedOnly && (q.final_status ?? "UNDER VERIFICATION") !== "VERIFIED") return false;
    return matches(q.name, q.location || q.district);
  });

  const total = shownSchemes.length + shownQda.length;
  const selCls =
    "w-full cursor-pointer rounded-xl border border-line bg-white px-3 py-2.5 text-[14.5px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]";

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setSearch(qInput);
  };

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
            <form onSubmit={onSearch} className="grid gap-3 md:grid-cols-[repeat(3,1fr)_1.4fr_auto]">
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">Status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={selCls}>
                  {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o === "All" ? "All Statuses" : o}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">Authority</span>
                <select value={authority} onChange={(e) => setAuthority(e.target.value)} className={selCls}>
                  {AUTHORITY_OPTIONS.map((o) => <option key={o} value={o}>{o === "All" ? "All Authorities" : o}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">District</span>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selCls}>
                  <option value="All">All Districts</option>
                  {DISTRICTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">Search Scheme</span>
                <input
                  value={qInput}
                  onChange={(e) => setQInput(e.target.value)}
                  placeholder="Enter scheme name..."
                  className={selCls}
                />
              </label>
              <div className="flex items-end">
                <button type="submit" className="btn-primary h-[42px] w-full justify-center md:w-auto">
                  <Search size={15} /> Search
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <label className="flex cursor-pointer select-none items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="h-4.5 w-4.5 accent-[#1a8754]"
                />
                <span className="text-[14px] font-semibold text-navy">
                  Verified only
                  <span className="ml-1.5 text-[13px] font-normal text-muted">({total} schemes)</span>
                </span>
              </label>
              <Link href="/schemes/add/" className="btn-primary">
                <Plus size={15} /> Add Scheme
              </Link>
            </div>
          </div>
        </Reveal>

        {total === 0 ? (
          <p className="mt-8 rounded-2xl border border-line bg-white py-14 text-center text-sm text-muted">
            No schemes found matching this filter.
          </p>
        ) : (
          <Stagger className="mt-6 grid gap-5" gap={0.1}>
            {shownQda.map((q) => (
              <StaggerItem key={`qda-${q.name}`}>
                <QdaCard q={q} />
              </StaggerItem>
            ))}
            {shownSchemes.map((s) => (
              <StaggerItem key={`scheme-${s.id}`}>
                <SchemeCard s={s} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
