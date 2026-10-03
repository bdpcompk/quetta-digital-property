"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, Droplets, ExternalLink, Flame, MapPin, Phone, Plus, Route, Zap,
} from "lucide-react";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SCHEMES, formatPKR, getSchemes } from "@/lib/data";
import type { Scheme } from "@/lib/types";

const FAC: Record<string, { label: string; Icon: typeof Zap }> = {
  bijli: { label: "Bijli", Icon: Zap },
  pani: { label: "Pani", Icon: Droplets },
  gas: { label: "Gas", Icon: Flame },
  road: { label: "Road", Icon: Route },
};

const NOC_CHIP: Record<string, string> = {
  Verified: "bg-green text-white",
  Pending: "bg-amber-400 text-navy",
  No: "bg-red-500 text-white",
};

const STATUS_CHIP: Record<string, string> = {
  Active: "bg-green text-white",
  Sold: "bg-slate-700 text-white",
  Hold: "bg-amber-500 text-white",
};

function SchemeCard({ s }: { s: Scheme }) {
  const [showPhone, setShowPhone] = useState(false);
  const photo = s.photos?.[0] ?? "";
  return (
    <div className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative h-44 bg-surface">
        {photo ? (
          <img src={photo} alt={s.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <MapPin size={30} />
          </div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${NOC_CHIP[s.noc_status] ?? "bg-slate-500 text-white"}`}>
          NOC: {s.noc_status}
        </span>
        {s.verified ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-green px-2.5 py-1 text-[10.5px] font-bold uppercase text-white shadow">
            <BadgeCheck size={12} /> Verified
          </span>
        ) : (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-bold uppercase text-slate-500 shadow">
            Unverified
          </span>
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

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-bold leading-snug text-navy">{s.name}</h3>
        <p className="mt-1 flex items-start gap-1.5 text-[12.5px] text-muted">
          <MapPin size={13} className="mt-0.5 shrink-0 text-green" />
          <span className="flex-1">{s.location}</span>
          {s.map_link && (
            <a
              href={s.map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1 font-semibold text-green hover:underline"
              title="Open in Google Maps"
            >
              Map <ExternalLink size={11} />
            </a>
          )}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(s.facilities ?? []).map((f) => {
            const fac = FAC[f];
            if (!fac) return null;
            return (
              <span
                key={f}
                className="flex items-center gap-1 rounded-lg bg-surface px-2 py-1 text-[11px] font-semibold text-ink"
              >
                <fac.Icon size={11} className="text-green" /> {fac.label}
              </span>
            );
          })}
        </div>

        <div className="mt-3.5 rounded-xl bg-surface p-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">Total Price</p>
          <p className="text-[18px] font-extrabold leading-tight text-green">
            {s.price_total ? `PKR ${formatPKR(s.price_total)}` : "Contact for price"}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-muted">
            {s.price_advance > 0 && <span>Advance: <b className="text-ink">PKR {formatPKR(s.price_advance)}</b></span>}
            {s.price_monthly > 0 && <span>Monthly Qist: <b className="text-ink">PKR {formatPKR(s.price_monthly)}</b></span>}
          </div>
        </div>

        <div className="mt-auto pt-3.5">
          {showPhone ? (
            <a href={`tel:${s.owner_phone.replace(/\s/g, "")}`} className="btn-primary w-full justify-center">
              <Phone size={14} /> {s.owner_phone}
            </a>
          ) : (
            <button onClick={() => setShowPhone(true)} className="btn-ghost w-full justify-center">
              <Phone size={14} /> Contact {s.owner_name || "Owner"}
            </button>
          )}
        </div>
      </div>
    </div>
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
          <Stagger className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((s) => (
              <StaggerItem key={s.id}>
                <SchemeCard s={s} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
