"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, Droplets, ExternalLink, FileText, Flame, Landmark, MapPin, Phone,
  Plus, Route, ScrollText, ShieldCheck, Zap,
} from "lucide-react";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { AUTHORITIES, SCHEMES, formatPKR, getSchemes } from "@/lib/data";
import type { Scheme } from "@/lib/types";

const FAC: Record<string, { label: string; Icon: typeof Zap }> = {
  bijli: { label: "Bijli", Icon: Zap },
  pani: { label: "Pani", Icon: Droplets },
  gas: { label: "Gas", Icon: Flame },
  road: { label: "Road", Icon: Route },
};

const NOC_CHIP: Record<string, string> = {
  Approved: "bg-green text-white",
  "Under Process": "bg-amber-400 text-navy",
  "Not Approved": "bg-red-500 text-white",
};

const STATUS_CHIP: Record<string, string> = {
  Active: "bg-green text-white",
  Sold: "bg-slate-700 text-white",
  Hold: "bg-amber-500 text-white",
};

function DetailRow({
  Icon, label, value, href,
}: {
  Icon: typeof Zap; label: string; value: string; href?: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-surface px-3 py-2.5">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-green ring-1 ring-line">
        <Icon size={12} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 flex items-center gap-1 break-words text-[13px] font-bold text-navy hover:text-green"
          >
            {value} <ExternalLink size={11} className="shrink-0" />
          </a>
        ) : (
          <p className="mt-0.5 break-words text-[13px] font-bold text-navy">{value}</p>
        )}
      </div>
    </div>
  );
}

function SchemeRow({ s }: { s: Scheme }) {
  const [showPhone, setShowPhone] = useState(false);
  const photo = s.photos?.[0] ?? "";
  const authFull = AUTHORITIES[s.authority] ?? "";
  const nocChip = NOC_CHIP[s.noc_status] ?? "bg-slate-500 text-white";

  return (
    <article className="lift overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex flex-col sm:flex-row">
        {/* photo */}
        <div className="relative h-48 shrink-0 bg-surface sm:h-auto sm:w-64">
          {photo ? (
            <img src={photo} alt={s.name} className="h-full w-full object-cover" loading="lazy" />
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
          {(s.photos?.length ?? 0) > 1 && (
            <span className="absolute bottom-3 left-3 rounded-full bg-navy/75 px-2 py-0.5 text-[10.5px] font-semibold text-white">
              1 / {s.photos.length} photos
            </span>
          )}
        </div>

        {/* details */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <h3 className="text-[17px] font-extrabold leading-snug text-navy">{s.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                <MapPin size={13} className="shrink-0 text-green" /> {s.location}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${nocChip}`}>
                <ShieldCheck size={12} /> NOC: {s.noc_status}
              </span>
              {s.verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green px-3 py-1.5 text-[11px] font-bold uppercase text-white">
                  <BadgeCheck size={12} /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-surface px-3 py-1.5 text-[11px] font-bold uppercase text-slate-500 ring-1 ring-line">
                  Unverified
                </span>
              )}
            </div>
          </div>

          {/* 4 mandatory fields */}
          <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
            <DetailRow
              Icon={MapPin}
              label="Location"
              value={s.location}
              href={s.map_link || undefined}
            />
            <DetailRow
              Icon={Landmark}
              label="Approving Authority (منظور کرنے والا ادارہ)"
              value={s.authority ? `${s.authority} — ${authFull}` : "—"}
            />
            <DetailRow
              Icon={FileText}
              label="NOC Number"
              value={s.noc_number || "—"}
            />
            <DetailRow
              Icon={ScrollText}
              label="Registration Method (رجسٹریشن کا طریقہ)"
              value={s.registration_method || "—"}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {(s.facilities ?? []).map((f) => {
              const fac = FAC[f];
              if (!fac) return null;
              return (
                <span key={f} className="flex items-center gap-1 rounded-lg bg-green-soft px-2.5 py-1 text-[11.5px] font-semibold text-green">
                  <fac.Icon size={12} /> {fac.label}
                </span>
              );
            })}
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-line pt-3.5">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">Total Price</p>
              <p className="text-[20px] font-extrabold leading-tight text-green">
                {s.price_total ? `PKR ${formatPKR(s.price_total)}` : "Contact for price"}
              </p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[11.5px] text-muted">
                {s.price_advance > 0 && <span>Advance: <b className="text-ink">PKR {formatPKR(s.price_advance)}</b></span>}
                {s.price_monthly > 0 && <span>Monthly Qist: <b className="text-ink">PKR {formatPKR(s.price_monthly)}</b></span>}
              </div>
            </div>
            {showPhone ? (
              <a href={`tel:${s.owner_phone.replace(/\s/g, "")}`} className="btn-primary">
                <Phone size={14} /> {s.owner_phone}
              </a>
            ) : (
              <button onClick={() => setShowPhone(true)} className="btn-ghost">
                <Phone size={14} /> Contact {s.owner_name || "Owner"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SchemeList() {
  const [list, setList] = useState<Scheme[]>(SCHEMES);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    getSchemes().then(setList);
  }, []);

  const shown = verifiedOnly ? list.filter((s) => s.verified) : list;
  const verifiedCount = list.filter((s) => s.verified).length;

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 sm:p-5">
            <label className="flex cursor-pointer select-none items-center gap-3">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="h-4.5 w-4.5 accent-[#1a8754]"
              />
              <span className="text-[13.5px] font-semibold text-navy">
                Show Verified Schemes Only
                <span className="ml-2 text-[12px] font-normal text-muted">
                  ({verifiedCount} verified)
                </span>
              </span>
            </label>
            <div className="flex items-center gap-3">
              <span className="hidden text-[12.5px] text-muted sm:block">
                {shown.length} scheme{shown.length === 1 ? "" : "s"}
              </span>
              <Link href="/schemes/add/" className="btn-primary">
                <Plus size={15} /> Add Scheme
              </Link>
            </div>
          </div>
        </Reveal>

        {shown.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-line bg-white py-14 text-center text-sm text-muted">
            No schemes found{verifiedOnly ? " matching this filter" : ""}.
          </p>
        ) : (
          <Stagger className="mt-5 grid gap-5">
            {shown.map((s) => (
              <StaggerItem key={s.id}>
                <SchemeRow s={s} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
