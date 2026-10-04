"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, BadgeCheck, Building2, ExternalLink, FileText, Heart, Landmark, Loader2,
  MapPin, Phone, ScrollText, ShieldCheck, Users, Wallet,
} from "lucide-react";
import { AUTHORITIES, SCHEMES, formatPKR, getSchemes } from "@/lib/data";
import type { Scheme } from "@/lib/types";

const FAC: Record<string, string> = { bijli: "Bijli", pani: "Pani", gas: "Gas", road: "Road" };

const NOC_CHIP: Record<string, string> = {
  Approved: "bg-green text-white",
  "Under Process": "bg-amber-400 text-navy",
  "Not Approved": "bg-red-500 text-white",
};

function Field({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="rounded-xl bg-surface px-3.5 py-3">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center gap-1 break-words text-[13.5px] font-bold text-navy hover:text-green"
        >
          {value} <ExternalLink size={12} className="shrink-0" />
        </a>
      ) : (
        <p className="mt-1 break-words text-[13.5px] font-bold text-navy">{value}</p>
      )}
    </div>
  );
}

const TABS = ["Overview", "Map", "Facilities"] as const;
type Tab = (typeof TABS)[number];

export default function SchemeDetail() {
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const [s, setS] = useState<Scheme | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [photo, setPhoto] = useState(0);
  const [tab, setTab] = useState<Tab>("Overview");
  const [showContact, setShowContact] = useState(false);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (!id) return;
    getSchemes().then((all) => {
      setS(all.find((x) => x.id === id) ?? null);
      setLoaded(true);
    });
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
        <p className="text-[15px] font-bold text-navy">Scheme not found</p>
        <Link href="/schemes/" className="btn-ghost mt-4 inline-flex">
          <ArrowLeft size={15} /> Back to Schemes
        </Link>
      </div>
    );
  }

  const photos = s.photos ?? [];
  const authFull = AUTHORITIES[s.authority] ?? "";
  const nocChip = NOC_CHIP[s.noc_status] ?? "bg-slate-500 text-white";
  const mapQuery = s.location || "Balochistan, Pakistan";

  return (
    <section className="section pt-[calc(var(--header-h)+24px)]">
      <div className="wrap">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/schemes/" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-green">
            <ArrowLeft size={15} /> All Schemes
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase ${nocChip}`}>
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
            <span className="inline-flex rounded-full bg-navy px-3 py-1.5 text-[11px] font-bold uppercase text-white">
              {s.status}
            </span>
          </div>
        </div>

        {/* gallery */}
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
          {photos.length > 0 ? (
            <>
              <img src={photos[photo] ?? photos[0]} alt={s.name} className="h-64 w-full object-cover sm:h-96" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"; }} />
              <span className="absolute left-4 top-4 rounded-full bg-navy/80 px-3 py-1 text-[11px] font-bold text-white">
                {photo + 1} / {photos.length}
              </span>
            </>
          ) : (
            <div className="flex h-64 items-center justify-center text-muted sm:h-96">
              <MapPin size={44} />
            </div>
          )}
          <button
            onClick={() => setFav((v) => !v)}
            aria-label="Save scheme"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-105"
          >
            <Heart size={17} className={fav ? "fill-red-500 text-red-500" : "text-navy"} />
          </button>
        </div>
        {photos.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {photos.map((p, i) => (
              <button
                key={p + i}
                onClick={() => setPhoto(i)}
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  i === photo ? "border-green" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={p} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* main */}
          <div className="lg:col-span-2">
            <h1 className="text-[26px] font-extrabold leading-tight text-navy">{s.name}</h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-[13.5px] text-muted">
              <MapPin size={15} className="text-green" /> {s.location}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {(s.facilities ?? []).map((f) => (
                <span key={f} className="rounded-lg bg-green-soft px-2.5 py-1 text-[11.5px] font-semibold text-green">
                  {FAC[f] ?? f}
                </span>
              ))}
              {s.authority && (
                <span className="rounded-lg bg-navy px-2.5 py-1 text-[11.5px] font-semibold text-white">
                  {s.authority} Verified
                </span>
              )}
            </div>

            {/* tabs */}
            <div className="mt-5 flex gap-1 border-b border-line">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
                    tab === t ? "text-green" : "text-muted hover:text-navy"
                  }`}
                >
                  {t}
                  {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-green" />}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {tab === "Overview" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Owner Name" value={s.owner_name || "—"} />
                  <Field
                    label="NOC Status"
                    value={s.noc_status}
                  />
                  <Field label="Approving Authority" value={s.authority ? `${s.authority} — ${authFull}` : "—"} />
                  <Field label="NOC Number" value={s.noc_number || "—"} />
                  <Field label="Registration Method" value={s.registration_method || "—"} />
                  <Field label="Listing Status" value={s.status} />
                  {s.total_area && <Field label="Total Area" value={s.total_area} />}
                  {s.total_plots && <Field label="Total Plots" value={s.total_plots} />}
                  {s.development_status && <Field label="Development Status" value={s.development_status} />}
                  <Field
                    label="Owner Contact"
                    value={s.owner_phone || "—"}
                    href={s.owner_phone ? `tel:${s.owner_phone.replace(/\s/g, "")}` : undefined}
                  />
                </div>
              )}

              {tab === "Map" && (
                <div className="overflow-hidden rounded-2xl border border-line">
                  <iframe
                    title={`Map — ${s.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                    className="h-72 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-white px-4 py-3">
                    <p className="text-[12.5px] text-muted">{s.location}</p>
                    {s.map_link && (
                      <a href={s.map_link} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                        <ExternalLink size={14} /> View on Google Maps
                      </a>
                    )}
                  </div>
                </div>
              )}

              {tab === "Facilities" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(s.facilities ?? []).length === 0 ? (
                    <p className="text-[13px] text-muted">No facilities listed.</p>
                  ) : (
                    (s.facilities ?? []).map((f) => (
                      <div key={f} className="flex items-center gap-2.5 rounded-xl bg-green-soft px-3.5 py-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green text-[12px] font-bold text-white">
                          ✓
                        </span>
                        <span className="text-[13.5px] font-bold text-navy">{FAC[f] ?? f}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">Total Price</p>
              <p className="mt-1 text-[24px] font-extrabold leading-none text-green">
                {s.price_total ? formatPKR(s.price_total) : "Contact for price"}
              </p>
              <div className="mt-3 space-y-2 border-t border-line pt-3 text-[13px]">
                {s.price_advance > 0 && (
                  <p className="flex items-center justify-between text-muted">
                    <span className="flex items-center gap-1.5"><Wallet size={14} /> Advance</span>
                    <b className="text-ink">{formatPKR(s.price_advance)}</b>
                  </p>
                )}
                {s.price_monthly > 0 && (
                  <p className="flex items-center justify-between text-muted">
                    <span className="flex items-center gap-1.5"><Wallet size={14} /> Monthly Qist</span>
                    <b className="text-ink">{formatPKR(s.price_monthly)}</b>
                  </p>
                )}
                <p className="flex items-center justify-between text-muted">
                  <span className="flex items-center gap-1.5"><Users size={14} /> Owner</span>
                  <b className="text-ink">{s.owner_name || "—"}</b>
                </p>
                <p className="flex items-center justify-between text-muted">
                  <span className="flex items-center gap-1.5"><Building2 size={14} /> Authority</span>
                  <b className="text-ink">{s.authority || "—"}</b>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-green/30 bg-green-soft p-5">
              <p className="text-[13px] font-bold text-navy">Interested in this scheme?</p>
              <p className="mt-1 text-[12.5px] text-muted">Contact the owner directly for plots, prices and site visits.</p>
              {showContact ? (
                <div className="mt-3 space-y-2">
                  <a
                    href={`https://wa.me/${(s.owner_phone || "").replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center"
                  >
                    WhatsApp: {s.owner_phone || "—"}
                  </a>
                  <a href={`tel:${(s.owner_phone || "").replace(/\s/g, "")}`} className="btn-ghost w-full justify-center">
                    <Phone size={14} /> Call Owner
                  </a>
                </div>
              ) : (
                <button onClick={() => setShowContact(true)} className="btn-primary mt-3 w-full justify-center">
                  <Phone size={15} /> Contact Owner
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 text-[12.5px] text-muted">
              <p className="flex items-center gap-2 font-bold text-navy">
                <Landmark size={15} className="text-green" /> Scheme ID #{s.id}
              </p>
              <p className="mt-2 flex items-start gap-2">
                <FileText size={14} className="mt-0.5 shrink-0" />
                {s.registration_method || "Registration details not provided"}
              </p>
              <p className="mt-2 flex items-start gap-2">
                <ScrollText size={14} className="mt-0.5 shrink-0" />
                NOC {s.noc_number ? `#${s.noc_number}` : "number not provided"} — {s.noc_status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
