"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, BadgeCheck, Building, Building2, Calendar, CheckCircle2, ChevronLeft, ChevronRight,
  Droplets, ExternalLink, FileText, Flame, GraduationCap, Heart, Home, Landmark, Leaf, Loader2,
  MapPin, Phone, Road, Route, Share2, ShieldCheck, Users, Zap,
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
  "Overview", "Blocks & Plots", "Facilities", "Payment Plan",
  "Location & Map", "Documents", "Gallery", "Reviews",
] as const;
type Tab = (typeof TAB_LIST)[number];

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
  const [tab, setTab] = useState<Tab>("Overview");
  const [fav, setFav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [blockFilter, setBlockFilter] = useState("");

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
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
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

  const visibleTabs = TAB_LIST.filter((tb) => {
    if (tb === "Blocks & Plots") return blocks.length > 0;
    if (tb === "Facilities") return facItems.length > 0;
    if (tb === "Payment Plan") return paymentPlans.length > 0 || hasPrices;
    if (tb === "Documents") return !!s.approval_doc;
    if (tb === "Gallery") return photos.length > 0 || !!s.video_url;
    return true;
  });
  const activeTab: Tab = visibleTabs.includes(tab) ? tab : "Overview";

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
                  onClick={() => setTab("Gallery")}
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
              <iframe
                title={`Map — ${s.name}`}
                src={mapEmbed}
                className="mt-3 h-40 w-full rounded-xl border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
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
                  key={tb}
                  onClick={() => setTab(tb)}
                  className={`relative shrink-0 px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
                    activeTab === tb ? "text-green" : "text-muted hover:text-navy"
                  }`}
                >
                  {t(tb)}
                  {activeTab === tb && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-green" />}
                </button>
              ))}
            </div>

            <div className="mt-5">
              {activeTab === "Overview" && (
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
              )}

              {activeTab === "Blocks & Plots" && (
                <div>
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Facilities" && (
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
              )}

              {activeTab === "Payment Plan" && (
                <div className="rounded-2xl border border-line bg-white p-5">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left">
                      <thead>
                        <tr className="border-b border-line text-[11px] font-semibold uppercase tracking-wide text-muted">
                          <th className="px-3 py-3">{t("Plan Type")}</th>
                          <th className="px-3 py-3">{t("Down Payment")}</th>
                          <th className="px-3 py-3">{t("Installment")}</th>
                          <th className="px-3 py-3">{t("Total Price")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {paymentPlans.length > 0 ? (
                          paymentPlans.map((p, i) => {
                            const inst = pkrs(p.installment);
                            return (
                              <tr key={i} className="text-[13.5px]">
                                <td className="px-3 py-3 font-bold text-navy">{p.plan_type || "—"}</td>
                                <td className="px-3 py-3 text-muted">{pkrs(p.down)}</td>
                                <td className="px-3 py-3 text-muted">{inst === "—" ? inst : `${inst} (${t("Monthly")})`}</td>
                                <td className="px-3 py-3 font-semibold text-navy">{pkrs(p.total)}</td>
                              </tr>
                            );
                          })
                        ) : (
                          summaryRows.map((r) => (
                            <tr key={r.label} className="text-[13.5px]">
                              <td className="px-3 py-3 font-bold text-navy">{r.label}</td>
                              <td colSpan={3} className="px-3 py-3 font-semibold text-navy">{pkrs(r.value)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-[12px] text-muted">
                    {t("Note: Prices are subject to change. Please confirm with the scheme owner.")}
                  </p>
                </div>
              )}

              {activeTab === "Location & Map" && (
                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                  <iframe
                    title={`Map — ${s.name}`}
                    src={mapEmbed}
                    className="h-72 w-full rounded-xl border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3">
                    <p className="text-[12.5px] text-muted">{s.location}</p>
                    <a href={s.map_link || mapSearch} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      <ExternalLink size={14} /> {t("View on Google Maps")}
                    </a>
                  </div>
                </div>
              )}

              {activeTab === "Documents" && (
                <div className="rounded-2xl border border-line bg-white p-5">
                  {s.approval_doc ? (
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
                  ) : (
                    <p className="text-[13px] text-muted">{t("No approval document uploaded yet.")}</p>
                  )}
                  {(s.approval_date || s.expiry_date) && (
                    <div className="mt-4 divide-y divide-line border-t border-line">
                      {s.approval_date && <KV label={t("Approval Date")} value={s.approval_date} />}
                      {s.expiry_date && <KV label={t("Expiry Date")} value={s.expiry_date} />}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Gallery" && (
                <div>
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
                </div>
              )}

              {activeTab === "Reviews" && <Reviews targetType="scheme" targetId={s.id} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
