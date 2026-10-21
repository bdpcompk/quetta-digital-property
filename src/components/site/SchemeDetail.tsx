"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Building, Building2, Calendar, CheckCircle2, ChevronLeft, ChevronRight,
  Compass, Droplets, ExternalLink, FileText, Flame, GraduationCap, Heart, History, Home, Landmark,
  Leaf, Loader2, MapPin, Phone, Play, Road, Route, Share2, ShieldCheck, Users, Zap,
} from "lucide-react";
import { AUTHORITIES, getSchemeById } from "@/lib/data";
import { useSession } from "@/lib/useSession";
import { useLang } from "@/components/layout/LanguageProvider";
import type { Scheme } from "@/lib/types";
import Reviews from "@/components/site/Reviews";

type FacItem = { label: string; Icon: typeof Zap };

const FAC_MAP: Record<string, FacItem> = {
  bijli: { label: "Electricity", Icon: Zap },
  pani: { label: "Water Supply", Icon: Droplets },
  gas: { label: "Gas Supply", Icon: Flame },
  road: { label: "Road Network", Icon: Route },
};

const FEAT_MAP: Record<string, FacItem> = {
  "Gated Community": { label: "Security", Icon: ShieldCheck },
  "Parks & Playgrounds": { label: "Parks & Green Belts", Icon: Leaf },
  Mosque: { label: "Mosque", Icon: Landmark },
  School: { label: "School", Icon: GraduationCap },
  Hospital: { label: "Hospital", Icon: Heart },
};

const NOC_CHIP: Record<string, string> = {
  Approved: "bg-green text-white",
  "Under Process": "bg-amber-400 text-navy",
  "Not Approved": "bg-red-500 text-white",
};

const TAB_LIST = [
  { label: "Overview", id: "sec-overview" },
  { label: "Blocks & Plots", id: "sec-blocks" },
  { label: "Facilities", id: "sec-facilities" },
  { label: "Payment Plan", id: "sec-payment" },
  { label: "Location & Map", id: "sec-location" },
  { label: "Documents", id: "sec-documents" },
  { label: "Gallery", id: "sec-gallery" },
  { label: "Reviews", id: "sec-reviews" },
] as const;

function pkrs(v?: string | number): string {
  if (v === undefined || v === null || v === "") return "—";
  const n = Number(v);
  return Number.isNaN(n) ? String(v) : `Rs. ${n.toLocaleString("en-PK")}`;
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="shrink-0 text-[12px] font-semibold text-muted">{label}</span>
      <span className="min-w-0 break-words text-right text-[13px] font-bold text-navy">{value}</span>
    </div>
  );
}

export default function SchemeDetail() {
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const { t } = useLang();
  const { session, ready } = useSession();
  const [s, setS] = useState<Scheme | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [photo, setPhoto] = useState(0);
  const [activeSec, setActiveSec] = useState("sec-overview");
  const [fav, setFav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [blockFilter, setBlockFilter] = useState("");
  const activeLock = useRef(false);
  const scrollTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    getSchemeById(id).then((sch) => {
      if (!alive) return;
      setS(sch);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!s) return;
    const ids = TAB_LIST.map((tb) => tb.id);
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
    return () => {
      observer.disconnect();
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    };
  }, [s]);

  if (id && !loaded) {
    return (
      <div className="flex justify-center py-28">
        <Loader2 className="animate-spin text-green" size={30} />
      </div>
    );
  }

  if (!s) {
    return (
      <div className="wrap py-24 text-center">
        <p className="text-[15px] font-bold text-navy">{t("Scheme not found")}</p>
        <Link href="/schemes/" className="btn-ghost mt-4 inline-flex">
          <ArrowLeft size={15} /> {t("Back to Schemes")}
        </Link>
      </div>
    );
  }

  const isOwner = !!session && !!s.created_by && s.created_by === session.user.id;
  if (s.status !== "Active" && !isOwner) {
    if (!ready) {
      return (
        <div className="flex justify-center py-28">
          <Loader2 className="animate-spin text-green" size={30} />
        </div>
      );
    }
    return (
      <div className="wrap py-24 text-center">
        <p className="text-[15px] font-bold text-navy">
          {session ? t("Scheme not published yet") : t("Scheme not found")}
        </p>
        <p className="mx-auto mt-2 max-w-[440px] text-[13.5px] leading-relaxed text-muted">
          {session
            ? t("This scheme is currently under admin review. It will appear publicly once approved.")
            : t("This scheme is currently not available.")}
        </p>
        <Link href="/schemes/" className="btn-ghost mt-4 inline-flex">
          <ArrowLeft size={15} /> {t("Back to Schemes")}
        </Link>
      </div>
    );
  }

  const photos = s.photos ?? [];
  const blocks = s.blocks ?? [];
  const paymentPlans = s.payment_plans ?? [];
  const keyFeatures = s.key_features ?? [];
  const updates = s.updates ?? [];
  const authFull = AUTHORITIES[s.authority] ?? s.authority;
  const nocChip = NOC_CHIP[s.noc_status] ?? "bg-slate-500 text-white";
  const mapQuery = `${s.location || "Balochistan"}, Pakistan`;
const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&hl=en&output=embed`;
const mapSearch = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}`;
  const mediaCount = photos.length + (s.video_url ? 1 : 0);
  const extraMedia = mediaCount - 3;
  const idx = photos.length ? Math.min(photo, photos.length - 1) : 0;
  const hasPrices = s.price_total > 0 || s.price_advance > 0 || s.price_monthly > 0;

  const facItems: FacItem[] = [];
  const seenLabels = new Set<string>();
  for (const f of s.facilities ?? []) {
    const m = FAC_MAP[f];
    if (m && !seenLabels.has(m.label)) {
      seenLabels.add(m.label);
      facItems.push(m);
    }
  }
  for (const f of keyFeatures) {
    const m = FEAT_MAP[f];
    if (m && !seenLabels.has(m.label)) {
      seenLabels.add(m.label);
      facItems.push(m);
    }
  }

  const stats: { label: string; value: string; Icon: typeof Zap }[] = [
    { label: t("Total Area"), value: s.total_area ?? "", Icon: Building2 },
    { label: t("Total Plots"), value: s.total_plots ?? "", Icon: Home },
    { label: t("Residential Plots"), value: s.res_plots ?? "", Icon: Users },
    { label: t("Commercial Plots"), value: s.com_plots ?? "", Icon: Building },
    { label: t("Expected Possession"), value: s.possession ?? "", Icon: Calendar },
  ].filter((st) => st.value);

  const hasPayment = paymentPlans.length > 0 || hasPrices;

  const visibleTabs = TAB_LIST.filter((tb) => {
    if (tb.label === "Blocks & Plots") return blocks.length > 0;
    if (tb.label === "Facilities") return facItems.length > 0;
    if (tb.label === "Payment Plan") return hasPayment;
    if (tb.label === "Documents") return !!s.approval_doc;
    if (tb.label === "Gallery") return photos.length > 0 || !!s.video_url;
    return true;
  });

  const filteredBlocks = blockFilter ? blocks.filter((b) => b.name === blockFilter) : blocks;

  const summaryRows = [
    { label: t("Down Payment"), value: s.price_advance },
    { label: t("Monthly Installment"), value: s.price_monthly },
    { label: t("Total Price"), value: s.price_total },
  ].filter((r) => r.value > 0);

  const progressBullets: React.ReactNode[] = [];
  if (s.development_status)
    progressBullets.push(
      <li key="dev" className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
        <span>{t("Development")}: <span className="font-semibold text-navy">{s.development_status}</span></span>
      </li>
    );
  if (s.possession)
    progressBullets.push(
      <li key="pos" className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
        <span>{t("Expected possession")}: <span className="font-semibold text-navy">{s.possession}</span></span>
      </li>
    );
  if (updates.length > 0 && updates[0].text)
    progressBullets.push(
      <li key="upd" className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
        <span>
          {t("Latest")}: <span className="font-semibold text-navy">{updates[0].text}</span>
          {updates[0].date && <span className="mt-0.5 block text-[11.5px]">{updates[0].date}</span>}
        </span>
      </li>
    );

  const prevPhoto = () => setPhoto((i) => (i - 1 + photos.length) % photos.length);
  const nextPhoto = () => setPhoto((i) => (i + 1) % photos.length);

  const onShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const goTo = (secId: string) => {
    document.getElementById(secId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSec(secId);
    activeLock.current = true;
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      activeLock.current = false;
    }, 800);
  };

  return (
    <section className="section pt-[calc(var(--header-h)+24px)]">
      <div className="wrap">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/schemes/" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-green">
            <ArrowLeft size={15} /> {t("All Schemes")}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase ${nocChip}`}>
              <ShieldCheck size={12} /> {t("NOC")}: {s.noc_status}
            </span>
            {s.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green px-3 py-1.5 text-[11px] font-bold uppercase text-white">
                <BadgeCheck size={12} /> {t("Verified")}
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-surface px-3 py-1.5 text-[11px] font-bold uppercase text-slate-500 ring-1 ring-line">
                {t("Unverified")}
              </span>
            )}
            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold uppercase text-white ${
                s.status === "Pending" ? "bg-amber-500" : s.status === "Rejected" ? "bg-red-500" : "bg-navy"
              }`}
            >
              {s.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface lg:w-[72%]">
            {photos.length > 0 ? (
              <>
                <img
                  src={photos[idx]}
                  alt={s.name}
                  className="h-64 w-full object-cover sm:h-[420px]"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200";
                  }}
                />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[11.5px] font-bold ${
                    s.noc_status === "Approved" ? "bg-green text-white" : "bg-navy/85 text-white"
                  }`}
                >
                  {s.noc_status === "Approved" ? `${s.authority} ${t("Approved")}` : s.noc_status}
                </span>
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      aria-label={t("Previous photo")}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-105"
                    >
                      <ChevronLeft size={18} className="text-navy" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      aria-label={t("Next photo")}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-105"
                    >
                      <ChevronRight size={18} className="text-navy" />
                    </button>
                  </>
                )}
                {photos.length > 1 && (
                  <span className="absolute bottom-4 right-4 rounded-full bg-navy/80 px-3 py-1 text-[11.5px] font-bold text-white">
                    {idx + 1}/{photos.length}
                  </span>
                )}
              </>
            ) : (
              <div className="flex h-64 items-center justify-center text-muted sm:h-[420px]">
                <MapPin size={44} />
              </div>
            )}
          </div>

          {(photos.length > 1 || extraMedia > 0) && (
            <div className="flex flex-row gap-3 lg:w-[28%] lg:flex-col">
              {[1, 2].map((i) =>
                photos[i] ? (
                  <button
                    key={i}
                    onClick={() => setPhoto(i)}
                    className={`h-24 min-w-0 flex-1 overflow-hidden rounded-xl border-2 transition-all lg:h-auto lg:flex-1 ${
                      idx === i ? "border-green" : "border-line opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img src={photos[i]} alt="" className="h-full w-full object-cover" />
                  </button>
                ) : null
              )}
              {extraMedia > 0 && (
                <button
                  onClick={() => goTo("sec-gallery")}
                  className="flex h-24 min-w-0 flex-1 items-center justify-center rounded-xl bg-navy px-2 text-center text-[12px] font-bold leading-tight text-white transition-colors hover:bg-navy/90 lg:h-auto lg:flex-1"
                >
                  +{extraMedia} {t("Photos & Videos")}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-soft">
            {photos[0] ? (
              <img src={photos[0]} alt="" className="h-11 w-11 rounded-full object-cover" />
            ) : (
              <Building2 size={20} className="text-green" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-[24px] font-extrabold leading-tight text-navy sm:text-[28px]">{s.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-[13.5px] text-muted">
              <MapPin size={14} className="shrink-0 text-green" /> {s.location}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setFav((v) => !v)} className="btn-ghost">
              <Heart size={15} className={fav ? "fill-red-500 text-red-500" : ""} /> {t("Save Scheme")}
            </button>
            <button onClick={onShare} className="btn-ghost">
              <Share2 size={15} /> {copied ? t("Copied!") : t("Share")}
            </button>
          </div>
        </div>

        {s.description && (
          <p className="mt-3 text-[14px] leading-relaxed text-muted lg:line-clamp-2">{s.description}</p>
        )}

        {stats.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {stats.map((st) => (
              <div key={st.label} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                <st.Icon size={18} className="shrink-0 text-green" />
                <div className="min-w-0">
                  <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{st.label}</p>
                  <p className="mt-0.5 text-[14.5px] font-extrabold text-navy">{st.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <aside className="space-y-4 lg:order-2 lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                <ShieldCheck size={16} className="text-green" /> {t("Scheme Verification Status")}
              </p>
              {s.verified ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-soft px-3.5 py-3">
                  <BadgeCheck size={20} className="shrink-0 text-green" />
                  <div>
                    <p className="text-[13.5px] font-bold text-navy">{t("Verified")}</p>
                    {s.verified_on && (
                      <p className="text-[11.5px] text-muted">{t("Verified on")}: {s.verified_on}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-3 rounded-xl bg-surface px-3.5 py-3 text-[13px] font-semibold text-slate-500">
                  {t("Not Verified")}
                </p>
              )}
              <div className="mt-3 divide-y divide-line">
                <KV label={t("Approved By")} value={authFull || "—"} />
                <KV label={t("Approval No.")} value={s.noc_number || "—"} />
                {s.approval_date && <KV label={t("Approval Date")} value={s.approval_date} />}
                {s.expiry_date && <KV label={t("Expiry Date")} value={s.expiry_date} />}
                <KV
                  label={t("NOC Status")}
                  value={
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${nocChip}`}>
                      {s.noc_status || "—"}
                    </span>
                  }
                />
              </div>
              {s.approval_doc && (
                <a
                  href={s.approval_doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost mt-3 w-full"
                >
                  <FileText size={14} /> {t("View Approval Documents")} <ExternalLink size={13} />
                </a>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                <Users size={16} className="text-green" /> {t("Scheme Owner / Developer")}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-soft">
                  <Building2 size={20} className="text-green" />
                </span>
                <p className="min-w-0 break-words text-[15px] font-extrabold text-navy">{s.developer || s.owner_name || "—"}</p>
              </div>
              <div className="mt-3 divide-y divide-line">
                {s.contact_person && <KV label={t("Contact Person")} value={s.contact_person} />}
                <KV label={t("Phone")} value={s.owner_phone || "—"} />
                {s.owner_email && <KV label={t("Email")} value={s.owner_email} />}
              </div>
              {s.owner_phone && (
                <div className="mt-4 grid gap-2">
                  <a href={`tel:${s.owner_phone.replace(/\s/g, "")}`} className="btn-primary w-full">
                    <Phone size={15} /> {t("Contact Now")}
                  </a>
                  <a
                    href={`https://wa.me/${s.owner_phone.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost w-full"
                  >
                    {t("WhatsApp")}
                  </a>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                <MapPin size={16} className="text-green" /> {t("Location")}
              </p>
              <div className="relative mt-3 h-40 w-full overflow-hidden rounded-xl bg-[#e8f0e5]">
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                    backgroundSize: "34px 34px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green text-white shadow-[0_6px_16px_rgba(26,135,84,.35)]">
                    <MapPin size={18} />
                  </span>
                </div>
                <iframe
                  title={`Map — ${s.name}`}
                  src={mapEmbed}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">{s.location}</p>
              <a href={s.map_link || mapSearch} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-3 w-full">
                <ExternalLink size={14} /> {t("View on Map")}
              </a>
            </div>

            {progressBullets.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-5">
                <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                  <Road size={16} className="text-green" /> {t("Project Progress")}
                </p>
                <ul className="mt-3 space-y-2.5">{progressBullets}</ul>
              </div>
            )}
          </aside>

          <div className="lg:order-1 lg:col-span-3">
            <div className="flex flex-wrap items-end gap-x-1 border-b border-line">
              {visibleTabs.map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => goTo(tb.id)}
                  className={`relative shrink-0 px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
                    activeSec === tb.id ? "text-green" : "text-muted hover:text-navy"
                  }`}
                >
                  {t(tb.label)}
                  {activeSec === tb.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-green" />}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <section id="sec-overview" className="scroll-mt-24">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <h3 className="text-[15.5px] font-extrabold text-navy">{t("Scheme Overview")}</h3>
                    <p className="mt-2.5 whitespace-pre-line text-[13.5px] leading-relaxed text-muted">
                      {s.description || t("No description available yet.")}
                    </p>
                  </div>
                  {keyFeatures.length > 0 && (
                    <div className="rounded-2xl border border-line bg-white p-5">
                      <h3 className="text-[15.5px] font-extrabold text-navy">{t("Key Features")}</h3>
                      <ul className="mt-2.5 space-y-2">
                        {keyFeatures.map((f, i) => (
                          <li key={f + i} className="flex items-center gap-2.5 text-[13.5px] font-semibold text-navy">
                            <CheckCircle2 size={16} className="shrink-0 text-green" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {blocks.length > 0 && (
                <section id="sec-blocks" className="mt-8 scroll-mt-24">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setBlockFilter("")}
                      className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-colors ${
                        !blockFilter ? "bg-green text-white" : "border border-line bg-white text-muted hover:text-navy"
                      }`}
                    >
                      {t("All Blocks")}
                    </button>
                    {blocks.map((b, i) => (
                      <button
                        key={(b.name || "") + i}
                        onClick={() => setBlockFilter(b.name ?? "")}
                        className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-colors ${
                          blockFilter === b.name ? "bg-green text-white" : "border border-line bg-white text-muted hover:text-navy"
                        }`}
                      >
                        {b.name || "—"}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {filteredBlocks.map((b, i) => (
                      <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
                        {b.map_img ? (
                          <img src={b.map_img} alt={b.name || ""} className="h-32 w-full object-cover" />
                        ) : (
                          <div className="flex h-32 w-full items-center justify-center bg-surface">
                            <Building2 size={30} className="text-muted" />
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-[15px] font-extrabold text-navy">{b.name || "—"}</p>
                          <div className="mt-2.5 space-y-1.5">
                            <p className="text-[13px] font-semibold text-navy">
                              {t("Total Plots")} {b.total}
                            </p>
                            <p className="flex items-center gap-2 text-[13px] text-muted">
                              <span className="h-2 w-2 shrink-0 rounded-full bg-green" /> {t("Available")} {b.available}
                            </p>
                            <p className="flex items-center gap-2 text-[13px] text-muted">
                              <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" /> {t("Reserved")} {b.reserved}
                            </p>
                            <p className="flex items-center gap-2 text-[13px] text-muted">
                              <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" /> {t("Sold")} {b.sold}
                            </p>
                          </div>
                          <a
                            href="#sec-blocks"
                            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-line py-2 text-[12.5px] font-bold text-green transition-colors hover:bg-green-soft"
                          >
                            {t("View Details")} <ArrowRight size={13} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(hasPayment || facItems.length > 0) && (
                <div
                  id={hasPayment ? "sec-payment" : undefined}
                  className={`mt-8 grid gap-4 scroll-mt-24 ${hasPayment && facItems.length > 0 ? "lg:grid-cols-2" : ""}`}
                >
                  {hasPayment && (
                    <div className="rounded-2xl border border-line bg-white p-5">
                      <p className="mb-2 text-[15px] font-extrabold text-navy">{t("Payment Plan")}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[360px] text-left">
                          <thead>
                            <tr className="border-b border-line text-[10.5px] font-semibold uppercase tracking-wide text-muted">
                              <th className="px-2 py-2.5">{t("Plan Type")}</th>
                              <th className="px-2 py-2.5">{t("Down Payment")}</th>
                              <th className="px-2 py-2.5">{t("Installment")}</th>
                              <th className="px-2 py-2.5">{t("Total Price")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-line">
                            {paymentPlans.length > 0 ? (
                              paymentPlans.map((p, i) => {
                                const inst = pkrs(p.installment);
                                return (
                                  <tr key={i} className="text-[12.5px]">
                                    <td className="px-2 py-3 font-bold text-navy">{p.plan_type || "—"}</td>
                                    <td className="px-2 py-3 text-muted">{pkrs(p.down)}</td>
                                    <td className="px-2 py-3 text-muted">
                                      {inst === "—" ? inst : (
                                        <>
                                          {inst}
                                          <span className="block text-[10.5px] text-muted">({t("Monthly")})</span>
                                        </>
                                      )}
                                    </td>
                                    <td className="px-2 py-3 font-semibold text-navy">{pkrs(p.total)}</td>
                                  </tr>
                                );
                              })
                            ) : (
                              summaryRows.map((r) => (
                                <tr key={r.label} className="text-[12.5px]">
                                  <td className="px-2 py-3 font-bold text-navy">{r.label}</td>
                                  <td colSpan={3} className="px-2 py-3 font-semibold text-navy">{pkrs(r.value)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-3 text-[11.5px] text-muted">
                        {t("Note: Prices are subject to change. Please confirm with the scheme owner.")}
                      </p>
                    </div>
                  )}
                  {facItems.length > 0 && (
                    <div id="sec-facilities" className="scroll-mt-24 rounded-2xl border border-line bg-white p-5">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {facItems.map((f) => (
                          <div key={f.label} className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white px-3 py-5 text-center">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-soft">
                              <f.Icon size={20} className="text-green" />
                            </span>
                            <span className="text-[12.5px] font-bold leading-tight text-navy">{t(f.label)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <section id="sec-location" className="mt-8 scroll-mt-24">
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
                        {s.name}
                      </span>
                      <span className="text-[11.5px] text-muted">{s.location}</span>
                    </div>
                    <iframe
                      title={`Map — ${s.name}`}
                      src={mapEmbed}
                      className="absolute inset-0 h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3">
                    <p className="text-[12.5px] text-muted">{s.location}</p>
                    <a href={s.map_link || mapSearch} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      <ExternalLink size={14} /> {t("View on Google Maps")}
                    </a>
                  </div>
                </div>
              </section>

              {s.approval_doc && (
                <section id="sec-documents" className="mt-8 scroll-mt-24">
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <a
                      href={s.approval_doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-surface px-4 py-4 transition-colors hover:bg-green-soft"
                    >
                      <FileText size={20} className="shrink-0 text-green" />
                      <span className="flex-1 text-[14px] font-bold text-navy">{t("View Approval Documents")}</span>
                      <ExternalLink size={15} className="shrink-0 text-muted" />
                    </a>
                    {(s.approval_date || s.expiry_date) && (
                      <div className="mt-4 divide-y divide-line border-t border-line">
                        {s.approval_date && <KV label={t("Approval Date")} value={s.approval_date} />}
                        {s.expiry_date && <KV label={t("Expiry Date")} value={s.expiry_date} />}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {(photos.length > 0 || s.video_url) && (
                <section id="sec-gallery" className="mt-8 scroll-mt-24">
                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                      {photos.map((p, i) => (
                        <img
                          key={p + i}
                          src={p}
                          alt=""
                          className="h-32 w-full rounded-xl border border-line object-cover sm:h-40"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-muted">{t("No photos or videos available.")}</p>
                  )}
                  {s.video_url && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-black">
                      <video src={s.video_url} className="h-64 w-full object-cover sm:h-96" controls playsInline />
                    </div>
                  )}
                </section>
              )}

              <section id="sec-updates" className="mt-8 scroll-mt-24">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                    <History size={16} className="text-green" /> {t("Latest Updates & Documents")}
                  </p>
                  {updates.length > 0 ? (
                    <ul className="mt-3 divide-y divide-line">
                      {updates.map((u, i) => (
                        <li key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green" />
                          <div className="min-w-0">
                            {u.date && <p className="text-[12.5px] font-bold text-navy">{u.date}</p>}
                            <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{u.text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-[13px] text-muted">{t("No updates yet.")}</p>
                  )}
                  {s.approval_doc && (
                    <a
                      href={s.approval_doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-3 rounded-xl bg-surface px-4 py-3.5 transition-colors hover:bg-green-soft"
                    >
                      <FileText size={18} className="shrink-0 text-green" />
                      <span className="flex-1 text-[13.5px] font-bold text-navy">{t("View Approval Documents")}</span>
                      <ExternalLink size={14} className="shrink-0 text-muted" />
                    </a>
                  )}
                </div>
              </section>

              <section id="sec-explore" className="mt-8 scroll-mt-24">
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                      <Compass size={16} className="text-green" /> {t("Explore the Scheme")}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {s.video_url && (
                        <a
                          href={s.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex h-28 items-center justify-center overflow-hidden rounded-xl bg-navy"
                        >
                          {photos[0] && (
                            <img src={photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
                          )}
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-transform group-hover:scale-110">
                            <Play size={18} className="ml-0.5 fill-white text-white" />
                          </span>
                          <span className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1.5 text-center text-[11px] font-bold text-white">
                            {t("Scheme Introduction Video")}
                          </span>
                        </a>
                      )}
                      {photos.slice(0, 3).map((p, i) => (
                        <div key={p + i} className="relative h-28 overflow-hidden rounded-xl">
                          <img src={p} alt="" className="h-full w-full object-cover" />
                          <span className="absolute inset-x-0 bottom-0 bg-navy/70 px-2 py-1.5 text-center text-[11px] font-bold text-white">
                            {i === 0 ? t("Aerial View") : i === 1 ? t("Site Tour") : t("Gallery")}
                          </span>
                        </div>
                      ))}
                      <a
                        href={s.map_link || mapSearch}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl bg-surface ring-1 ring-line transition-colors hover:bg-green-soft"
                      >
                        <MapPin size={22} className="text-green" />
                        <span className="text-[12.5px] font-bold text-navy">{t("Map View")}</span>
                      </a>
                    </div>
                  </div>
                </section>

              <section id="sec-reviews" className="mt-8 scroll-mt-24">
                <Reviews targetType="scheme" targetId={s.id} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
