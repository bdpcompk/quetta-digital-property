"use client";

import { useEffect, useState } from "react";
import {
  Building2, CalendarDays, MapPin, ShieldCheck, UserCog, Users,
} from "lucide-react";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { QDA_SCHEMES, getQdaSchemes } from "@/lib/data";
import type { QdaScheme } from "@/lib/types";

export default function QdaSchemes() {
  const [list, setList] = useState<QdaScheme[]>(QDA_SCHEMES);

  useEffect(() => {
    getQdaSchemes().then(setList);
  }, []);

  return (
    <section className="section section-alt">
      <div className="wrap">
        <Reveal>
          <SectionHeading title="Featured QDA Approved Schemes" href="/projects/" linkLabel="View All Schemes" />
        </Reveal>
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
          {list.map((s) => (
            <StaggerItem key={s.name}>
              <div className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={s.img} alt={s.name} loading="lazy" className="img-zoom h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-green px-2 py-1 text-[10.5px] font-bold text-white">
                    <ShieldCheck size={12} /> QDA Approved
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-[15.5px] font-bold text-navy">{s.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                    <MapPin size={13} className="text-green" /> {s.district}
                  </p>
                  <div className="mt-3 space-y-1.5 text-[12.5px] text-muted">
                    <p className="flex items-center gap-2"><CalendarDays size={13} className="text-green" /> NOC Issued: {s.noc}</p>
                    <p className="flex items-center gap-2"><UserCog size={13} className="text-green" /> Developer: {s.developer}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    <div className="rounded-lg bg-surface px-1 py-2 text-center">
                      <p className="text-[9.5px] font-medium leading-tight text-muted">Total Area</p>
                      <p className="mt-0.5 text-[12px] font-bold text-navy">{s.totalArea}</p>
                    </div>
                    <div className="rounded-lg bg-surface px-1 py-2 text-center">
                      <p className="text-[9.5px] font-medium leading-tight text-muted">Residential Plots</p>
                      <p className="mt-0.5 flex items-center justify-center gap-1 text-[12px] font-bold text-navy">
                        <Users size={11} className="text-green" /> {s.resPlots}
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface px-1 py-2 text-center">
                      <p className="text-[9.5px] font-medium leading-tight text-muted">Commercial Plots</p>
                      <p className="mt-0.5 flex items-center justify-center gap-1 text-[12px] font-bold text-navy">
                        <Building2 size={11} className="text-green" /> {s.comPlots}
                      </p>
                    </div>
                  </div>
                  <button className="btn-primary mt-4 w-full">View Scheme →</button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
