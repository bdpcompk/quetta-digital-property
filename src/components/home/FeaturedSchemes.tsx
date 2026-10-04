"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SCHEMES, formatPKR, getSchemes } from "@/lib/data";
import type { Scheme } from "@/lib/types";

export default function FeaturedSchemes() {
  const [list, setList] = useState<Scheme[]>(SCHEMES);

  useEffect(() => {
    getSchemes().then(setList);
  }, []);

  const featured = list.filter((s) => s.verified).slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[26px] font-extrabold text-navy sm:text-[30px]">
                Featured <span className="text-green">Verified</span> Schemes
              </h2>
              <p className="mt-1.5 max-w-xl text-[14px] text-muted">
                NOC-verified housing schemes across Balochistan — checked by our team.
              </p>
            </div>
            <Link href="/schemes/" className="btn-ghost">
              View All Schemes <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => (
            <StaggerItem key={s.id}>
              <Link
                href={`/scheme/?id=${s.id}`}
                className="lift group block overflow-hidden rounded-2xl border border-line bg-white"
              >
                <div className="relative h-40 bg-surface">
                  {s.photos?.[0] ? (
                    <img src={s.photos[0]} alt={s.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted"><MapPin size={30} /></div>
                  )}
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-green px-2.5 py-1 text-[10.5px] font-bold uppercase text-white">
                    <BadgeCheck size={11} /> Verified
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="truncate text-[15.5px] font-extrabold text-navy">{s.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-[12.5px] text-muted">
                    <MapPin size={12} className="shrink-0 text-green" /> {s.location}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
                    <span className="flex items-center gap-1 rounded-lg bg-navy px-2 py-1 text-[10.5px] font-bold text-white">
                      <ShieldCheck size={11} /> {s.authority || "NOC"} Verified
                    </span>
                    <p className="text-[13.5px] font-extrabold text-green">
                      {s.price_total ? `PKR ${formatPKR(s.price_total)}` : "Contact"}
                    </p>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
