"use client";

import Link from "next/link";
import {
  Briefcase, Building, Grid3x3, Home as HomeIcon, Leaf, Map as MapIcon, Store, Warehouse,
} from "lucide-react";
import { TYPES, DISTRICTS } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  home: HomeIcon, map: MapIcon, building: Building, store: Store,
  leaf: Leaf, briefcase: Briefcase, warehouse: Warehouse, grid: Grid3x3,
};

export function TypeGrid() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <SectionHeading title="Browse by Property Type" href="/listings/" linkLabel="View All" />
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {TYPES.map((t) => {
            const Icon = ICONS[t.icon] ?? HomeIcon;
            return (
              <StaggerItem key={t.name}>
                <Link
                  href={`/listings/?type=${encodeURIComponent(t.name)}`}
                  className="lift flex h-full flex-col items-center rounded-2xl border border-line bg-white px-2 py-5 text-center"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: t.bg, color: t.color }}
                  >
                    <Icon size={20} />
                  </span>
                  <h4 className="mt-3 text-[12.5px] font-semibold leading-tight text-navy">
                    {t.name}
                  </h4>
                  <span className="mt-1 text-[11.5px] text-muted">{t.count}</span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

export function DistrictRail() {
  return (
    <section className="section section-alt">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            title="Popular Locations in Balochistan"
            href="/areas/"
            linkLabel="View All Districts"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="no-bar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2">
            {DISTRICTS.map((d) => (
              <Link
                key={d.name}
                href={`/listings/?district=${d.name}`}
                className="group relative h-[140px] w-[170px] shrink-0 overflow-hidden rounded-2xl"
              >
                <img
                  src={d.cover}
                  alt={d.name}
                  loading="lazy"
                  className="img-zoom h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3.5">
                  <h3 className="text-[15px] font-bold text-white">{d.name}</h3>
                  <p className="text-[11.5px] text-white/70">{d.count} Properties</p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
