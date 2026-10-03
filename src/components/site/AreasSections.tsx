"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { AREAS, DISTRICTS, getAreas, getDistricts } from "@/lib/data";
import type { Area, District } from "@/lib/types";

export default function AreasSections() {
  const [districts, setDistricts] = useState<District[]>(DISTRICTS);
  const [areas, setAreas] = useState<Area[]>(AREAS);

  useEffect(() => {
    getDistricts().then(setDistricts);
    getAreas().then(setAreas);
  }, []);

  const quettaAreas = areas.filter((a) => a.district === "Quetta");
  const otherAreas = areas.filter((a) => a.district !== "Quetta");

  return (
    <>
      <section className="section section-alt">
        <div className="wrap">
          <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {districts.map((d) => (
              <StaggerItem key={d.name}>
                <Link
                  href={`/listings/?district=${d.name}`}
                  className="group relative block h-[150px] overflow-hidden rounded-2xl"
                >
                  <img src={d.cover} alt={d.name} loading="lazy" className="img-zoom h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3.5">
                    <h3 className="text-[15px] font-bold text-white">{d.name}</h3>
                    <p className="text-[11.5px] text-white/70">{d.count} Properties</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal>
            <SectionHeading title="Popular Areas in Quetta" />
          </Reveal>
          <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(quettaAreas.length ? quettaAreas : areas).map((a) => (
              <StaggerItem key={`${a.name}-${a.district}`}>
                <Link
                  href={`/listings/?district=${a.district}`}
                  className="lift flex items-center gap-4 rounded-2xl border border-line bg-white p-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <h4 className="text-[14.5px] font-semibold text-navy">{a.name}</h4>
                    <p className="text-[12.5px] text-muted">
                      {a.district} • {a.count} Properties
                    </p>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-muted" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          {otherAreas.length > 0 && (
            <>
              <Reveal>
                <SectionHeading title="Areas in Other Districts" />
              </Reveal>
              <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {otherAreas.map((a) => (
                  <StaggerItem key={`${a.name}-${a.district}`}>
                    <Link
                      href={`/listings/?district=${a.district}`}
                      className="lift flex items-center gap-4 rounded-2xl border border-line bg-white p-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
                        <MapPin size={18} />
                      </span>
                      <div>
                        <h4 className="text-[14.5px] font-semibold text-navy">{a.name}</h4>
                        <p className="text-[12.5px] text-muted">
                          {a.district} • {a.count} Properties
                        </p>
                      </div>
                      <ArrowRight size={16} className="ml-auto text-muted" />
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </>
          )}
        </div>
      </section>
    </>
  );
}
