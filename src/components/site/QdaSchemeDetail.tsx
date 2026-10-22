"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle, BadgeCheck, Building2, CalendarDays, CheckCircle2, Compass, ExternalLink,
  FileCheck2, FileText, History, Landmark, Loader2, MapPin, Route, Share2, ShieldCheck,
  Users, Heart,
} from "lucide-react";
import { VERIFICATION_HISTORY, getQdaSchemes, getVerificationHistory } from "@/lib/data";
import { formatArea } from "@/lib/area";
import type { QdaScheme, VerificationHistory } from "@/lib/types";
import SchemeLoanCalculator from "@/components/site/SchemeLoanCalculator";

const STATUS_STYLES: Record<string, string> = {
  VERIFIED: "bg-green text-white",
  "UNDER VERIFICATION": "bg-amber-400 text-navy",
  "NOT VERIFIED": "bg-red-500 text-white",
  REJECTED: "bg-slate-800 text-white",
};

const nocColor = (v?: string) =>
  /not listed/i.test(v ?? "") ? "text-red-500" : /under/i.test(v ?? "") ? "text-amber-600" : "text-green";

const fmtDate = (d?: string) => {
  if (!d) return "â€”";
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) return d;
  return t.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const TABS = [
  { label: "Overview", id: "sec-overview" },
  { label: "Verification", id: "sec-verification" },
  { label: "Documents", id: "sec-documents" },
] as const;

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white px-3.5 py-3">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 break-words text-[13.5px] font-bold text-navy">{value || "â€”"}</p>
    </div>
  );
}

export default function QdaSchemeDetail() {
  const params = useSearchParams();
  const name = params?.get("name") ?? "";
  const [q, setQ] = useState<QdaScheme | null>(null);
  const [hist, setHist] = useState<VerificationHistory[]>(VERIFICATION_HISTORY);
  const [loaded, setLoaded] = useState(false);
  const [activeSec, setActiveSec] = useState<string>("sec-overview");
  const [liked, setLiked] = useState(false);
  const activeLock = useRef(false);

  useEffect(() => {
    getQdaSchemes().then((all) => {
      setQ(all.find((x) => x.name === name) ?? null);
      setLoaded(true);
    });
    getVerificationHistory().then(setHist);
  }, [name]);

  useEffect(() => {
    if (!q) return;
    const ids = TABS.map((tb) => tb.id);
    const els = ids
      .map((secId) => document.getElementById(secId))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inView.add(entry.target.id);
          else inView.delete(entry.target.id);
        });
        if (activeLock.current) return;
        const first = ids.find((secId) => inView.has(secId));
        if (first) setActiveSec(first);
      },
      { rootMargin: "-100px 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [q]);

  if (!loaded) {
    return (
      <div className="flex justify-center py-28">
        <Loader2 className="animate-spin text-green" size={30} />
      </div>
    );
  }

  if (!q) {
    return (
      <div className="wrap py-24 text-center">
        <p className="text-[15px] font-bold text-navy">Scheme not found</p>
        <Link href="/schemes/" className="btn-ghost mt-4 inline-flex">
          Back to Schemes
        </Link>
      </div>
    );
  }

  const final = q.final_status ?? "UNDER VERIFICATION";
  const isNegative = final === "NOT VERIFIED" || final === "REJECTED";
  const schemeHist = hist.filter((h) => h.scheme === q.name);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const mapQuery = q.location || `${q.district}, Balochistan, Pakistan`;
const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&hl=en&output=embed`;
const mapSearch = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}`;
  const heroImg =
    q.img || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200";
  const totalPlots =
    (Number(String(q.resPlots ?? "").replace(/[^\d]/g, "")) || 0) +
    (Number(String(q.comPlots ?? "").replace(/[^\d]/g, "")) || 0);

  const stats = [
    { label: "Total Area", value: formatArea(q.totalArea) || "â€”", Icon: Building2 },
    { label: "Total Plots", value: totalPlots ? totalPlots.toLocaleString() : "â€”", Icon: Route },
    { label: "Residential Plots", value: q.resPlots || "â€”", Icon: Users },
    { label: "Commercial Plots", value: q.comPlots || "â€”", Icon: Building2 },
    { label: "Last Verified", value: q.last_verified || "â€”", Icon: CalendarDays },
  ];

  const keyFacts = [
    `${q.authority || "QDA"} Approved Scheme`,
    q.registration_method ? `Registered: ${q.registration_method}` : "",
    q.noc ? `NOC: ${q.noc}` : "",
    q.noc_status || q.status ? `NOC Status: ${q.noc_status || q.status}` : "",
    q.developer ? `Developer: ${q.developer}` : "",
    q.last_verified ? `Last verified: ${q.last_verified}` : "",
  ].filter(Boolean);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: q.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {}
  };

  return (
    <section className="section pt-[calc(var(--header-h)+24px)]">
      <div className="wrap">
        {/* top row */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/schemes/" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-green">
            â† All Schemes
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase ${STATUS_STYLES[final] ?? STATUS_STYLES["UNDER VERIFICATION"]}`}>
              {final}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[11px] font-bold uppercase ring-1 ring-line ${nocColor(q.status)}`}>
              <ShieldCheck size={12} /> NOC: {q.status}
            </span>
            <span className="inline-flex rounded-full bg-navy px-3 py-1.5 text-[11px] font-bold uppercase text-white">
              {q.authority || "QDA"}
            </span>
          </div>
        </div>

        {/* hero */}
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
          <img
            src={heroImg}
            alt={q.name}
            className="h-72 w-full object-cover sm:h-[420px]"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200";
            }}
          />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-green px-3 py-1.5 text-[11.5px] font-bold uppercase text-white shadow">
            <BadgeCheck size={13} /> {q.authority || "QDA"} Approved Scheme
          </span>
        </div>

        {/* title row */}
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-white">
                <img src={heroImg} alt="" className="h-full w-full object-cover" />
              </span>
              <div className="min-w-0">
                <h1 className="text-[26px] font-extrabold leading-tight text-navy sm:text-[30px]">{q.name}</h1>
                <p className="mt-0.5 flex items-center gap-1.5 text-[13.5px] text-muted">
                  <MapPin size={14} className="text-green" /> {q.location || q.district}
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-[760px] text-[13.5px] leading-relaxed text-muted">
              {q.remarks ||
                `${q.name} is a ${q.authority || "QDA"} approved housing scheme in ${q.district}. Scheme records, NOC details and plot availability are listed below for verification.`}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-lg bg-navy px-2.5 py-1 text-[11.5px] font-semibold text-white">
                {q.authority || "QDA"} Approved Scheme
              </span>
              <span className="rounded-lg bg-green-soft px-2.5 py-1 text-[11.5px] font-semibold text-green">
                {q.registration_method || "Registered Scheme"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLiked((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-[13px] font-bold transition-colors ${
                liked ? "border-green bg-green-soft text-green" : "border-line bg-white text-navy hover:border-green"
              }`}
            >
              <Heart size={15} className={liked ? "fill-green" : ""} /> Save Scheme
            </button>
            <button
              onClick={share}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-bold text-navy transition-colors hover:border-green"
            >
              <Share2 size={15} /> Share
            </button>
          </div>
        </div>

        {/* stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-navy bg-navy px-4 py-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/65">
                <s.Icon size={13} className="text-white" /> {s.label}
              </p>
              <p className="mt-1 text-[17px] font-extrabold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="mt-6 flex flex-wrap gap-1 border-b border-line">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => {
                activeLock.current = true;
                setActiveSec(tb.id);
                document.getElementById(tb.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                setTimeout(() => (activeLock.current = false), 900);
              }}
              className={`relative px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
                activeSec === tb.id ? "text-green" : "text-muted hover:text-navy"
              }`}
            >
              {tb.label}
              {activeSec === tb.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-green" />}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* main column */}
          <div className="min-w-0 space-y-8">
            <section id="sec-overview" className="scroll-mt-24">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <h2 className="text-[15.5px] font-extrabold text-navy">Scheme Overview</h2>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
                    {q.remarks ||
                      `${q.name} is registered with ${q.registration_method || "the concerned office"} in ${q.tehsil || q.district}. The ${q.authority || "QDA"} record status, plot numbers and area are shown here as per official records.`}
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-white p-5">
                  <h2 className="text-[15.5px] font-extrabold text-navy">Key Facts</h2>
                  <ul className="mt-2.5 space-y-2">
                    {keyFacts.map((k) => (
                      <li key={k} className="flex items-start gap-2 text-[13px] text-ink">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-green" /> {k}
                      </li>
                    ))}
                    {keyFacts.length === 0 && (
                      <li className="text-[13px] text-muted">Record details are being updated.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Scheme / Project Name" value={q.name} />
                <Field label="Scheme ID" value={q.scheme_id} />
                <Field label="District" value={q.district} />
                <Field label="Tehsil" value={q.tehsil} />
                <Field label="Location" value={q.location} />
                <Field label="Developer / Sponsor" value={q.developer} />
                <Field label="Relevant Authority" value={q.authority || "QDA"} />
                <Field label="Registration Method" value={q.registration_method} />
                <Field label="NOC Status" value={q.noc_status || q.status} />
                <Field label="NOC Number" value={q.noc} />
                <Field label="Total Area" value={formatArea(q.totalArea)} />
                <Field label="Residential Plots" value={q.resPlots} />
                <Field label="Commercial Plots" value={q.comPlots} />
              </div>
            </section>

            <section id="sec-verification" className="scroll-mt-24">
              <div className="rounded-2xl border border-line bg-white p-5">
                <h2 className="flex items-center gap-2 text-[15.5px] font-extrabold text-navy">
                  <FileCheck2 size={17} className="text-green" /> Verification Records
                </h2>

                {isNegative && (
                  <div className="mt-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertTriangle size={17} className="mt-0.5 shrink-0 text-red-500" />
                    <p className="text-[12.5px] leading-relaxed text-red-700">
                      This scheme&apos;s approval could not be confirmed from official records
                      available at this time. This status is not by itself conclusive proof of
                      fraud â€” it means verification is pending or the record could not be located.
                    </p>
                  </div>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="QVC Status" value={q.qvc_status} />
                  <Field label="QVC Number" value={q.qvc_number} />
                  <Field label="QVC Date" value={fmtDate(q.qvc_date)} />
                  <Field label="NRC Status" value={q.nrc_status} />
                  <Field label="NRC Number" value={q.nrc_number} />
                  <Field label="NRC Date" value={fmtDate(q.nrc_date)} />
                  <Field label="PC-I Status" value={q.pci_status} />
                  <Field label="Verification Source" value={q.verification_source} />
                  <Field label="Last Verified" value={q.last_verified} />
                </div>

                {q.remarks && (
                  <div className="mt-4 rounded-xl border border-line p-4">
                    <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Remarks</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{q.remarks}</p>
                  </div>
                )}

                <h3 className="mt-5 flex items-center gap-2 text-[14.5px] font-bold text-navy">
                  <History size={16} className="text-green" /> Verification History
                </h3>
                {schemeHist.length ? (
                  <ol className="mt-3 space-y-3 border-l-2 border-line pl-4">
                    {schemeHist.map((h) => (
                      <li key={h.id} className="relative">
                        <span className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green" />
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[12.5px] font-bold text-ink">{fmtDate(h.created_date)}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[h.status] ?? STATUS_STYLES["UNDER VERIFICATION"]}`}>
                            {h.status}
                          </span>
                        </div>
                        <p className="mt-1 text-[12.5px] text-muted">
                          {h.authority && <>Authority: {h.authority} Â· </>}
                          {h.noc && <>NOC: {h.noc} Â· </>}
                          Verified by: {h.verified_by || "Admin"} Â· Source: {h.source || "Official Record"}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-[13px] text-muted">No history entries yet.</p>
                )}
              </div>
            </section>

            <section id="sec-location" className="scroll-mt-24">
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative h-72 w-full bg-[#e8f0e5]">
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                      backgroundSize: "44px 44px",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green text-white shadow-[0_8px_20px_rgba(26,135,84,.35)]">
                      <MapPin size={22} />
                    </span>
                    <span className="rounded-lg bg-white/95 px-3 py-1.5 text-[13px] font-bold text-navy shadow">
                      {q.name}
                    </span>
                    <span className="text-[11.5px] text-muted">{mapQuery}</span>
                  </div>
                  <iframe
                    title={`Map - ${q.name}`}
                    src={mapEmbed}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3">
                  <p className="text-[12.5px] text-muted">{mapQuery}</p>
                  <a href={mapSearch} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    <ExternalLink size={14} /> View on Google Maps
                  </a>
                </div>
              </div>
            </section>

            <section id="sec-documents" className="scroll-mt-24">
              <div className="rounded-2xl border border-line bg-white p-5">
                <h2 className="flex items-center gap-2 text-[15.5px] font-extrabold text-navy">
                  <FileText size={16} className="text-green" /> Documents
                </h2>
                {q.document ? (
                  <a
                    href={`${basePath}${q.document}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-3 rounded-xl bg-surface px-4 py-4 transition-colors hover:bg-green-soft"
                  >
                    <FileText size={20} className="shrink-0 text-green" />
                    <span className="flex-1 text-[14px] font-bold text-navy">View Official Document</span>
                    <ExternalLink size={15} className="shrink-0 text-muted" />
                  </a>
                ) : (
                  <p className="mt-2 text-[13px] text-muted">
                    Official document for this scheme is not uploaded yet.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-white p-5">
              <h2 className="flex items-center gap-2 text-[15.5px] font-extrabold text-navy">
                <Compass size={16} className="text-green" /> Explore the Scheme
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="relative h-28 overflow-hidden rounded-xl">
                  <img src={heroImg} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-navy/70 px-2 py-1.5 text-center text-[11px] font-bold text-white">
                    Aerial View
                  </span>
                </div>
                <div className="relative h-28 overflow-hidden rounded-xl">
                  <img src={heroImg} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-navy/70 px-2 py-1.5 text-center text-[11px] font-bold text-white">
                    Site Tour
                  </span>
                </div>
                <a
                  href={mapSearch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl bg-surface ring-1 ring-line transition-colors hover:bg-green-soft"
                >
                  <MapPin size={22} className="text-green" />
                  <span className="text-[12.5px] font-bold text-navy">Map View</span>
                </a>
              </div>
            </section>
          </div>

          {/* sidebar */}
          <div className="min-w-0 space-y-4">
            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                <ShieldCheck size={16} className="text-green" /> Scheme Verification Status
              </p>
              <div
                className={`mt-3 flex items-center gap-2 rounded-xl px-3.5 py-3 ${
                  final === "VERIFIED" ? "bg-green-soft" : "bg-amber-50"
                }`}
              >
                <BadgeCheck size={17} className={final === "VERIFIED" ? "text-green" : "text-amber-500"} />
                <span className="text-[14px] font-extrabold text-navy">{final}</span>
              </div>
              {q.last_verified && (
                <p className="mt-2 text-[12px] text-muted">
                  Verified on: <b className="text-ink">{q.last_verified}</b>
                </p>
              )}
              <div className="mt-3 space-y-2 border-t border-line pt-3 text-[13px]">
                <p className="flex justify-between gap-3 text-muted">
                  <span className="flex items-center gap-1.5">
                    <Landmark size={14} /> Approved By
                  </span>
                  <b className="text-right text-ink">{q.authority || "QDA"}</b>
                </p>
                <p className="flex justify-between gap-3 text-muted">
                  <span className="flex items-center gap-1.5">
                    <FileCheck2 size={14} /> Approval No.
                  </span>
                  <b className="text-right text-ink">{q.noc || "â€”"}</b>
                </p>
                <p className="flex justify-between gap-3 text-muted">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} /> Last Verified
                  </span>
                  <b className="text-right text-ink">{q.last_verified || "â€”"}</b>
                </p>
                <p className="flex justify-between gap-3 text-muted">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} /> Total Area
                  </span>
                  <b className="text-right text-ink">{formatArea(q.totalArea) || "â€”"}</b>
                </p>
                <p className="flex justify-between gap-3 text-muted">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} /> NOC Status
                  </span>
                  <b className={`text-right ${nocColor(q.noc_status || q.status)}`}>
                    {q.noc_status || q.status || "â€”"}
                  </b>
                </p>
              </div>
              {q.document && (
                <a
                  href={`${basePath}${q.document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-[13px] font-bold text-navy transition-colors hover:border-green hover:text-green"
                >
                  <FileText size={15} /> View Approval Documents
                </a>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                <Building2 size={16} className="text-green" /> Scheme Owner / Developer
              </p>
              <p className="mt-2.5 text-[15px] font-extrabold text-navy">{q.developer || "â€”"}</p>
              <div className="mt-2 space-y-1.5 text-[13px] text-muted">
                <p className="flex items-center gap-2">
                  <Landmark size={14} className="text-green" /> Authority: {q.authority || "QDA"}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={14} className="text-green" /> Registration: {q.registration_method || "â€”"}
                </p>
              </div>
              <Link
                href="/contact/"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green px-4 py-3 text-[13.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,135,84,.3)]"
              >
                <FileText size={15} /> Contact Now
              </Link>
            </div>

            <SchemeLoanCalculator />

            <p className="flex items-start gap-2 rounded-2xl border border-line bg-white p-4 text-[11.5px] leading-relaxed text-muted">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-green" />
              Verification is performed against official records of the relevant authority.
              &quot;Verified&quot; is only claimed when the record number, date and project name all match.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
