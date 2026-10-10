"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Calculator,
  FileCheck2,
  FileText,
  HardHat,
  Ruler,
  TrendingUp,
  Map as MapIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Item = {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  tile: string;
  color: string;
  gated?: boolean;
};

const ITEMS: Item[] = [
  {
    title: "New Projects",
    desc: "The best investment opportunities",
    href: "/projects/",
    icon: Building2,
    tile: "bg-amber-50",
    color: "text-amber-500",
  },
  {
    title: "Construction Cost Calculator",
    desc: "Get construction cost estimate",
    href: "/tools/construction-cost-calculator/",
    icon: HardHat,
    tile: "bg-blue-50",
    color: "text-blue-500",
  },
  {
    title: "Home Loan Calculator",
    desc: "Find affordable loan packages",
    href: "/tools/home-loan-calculator/",
    icon: Calculator,
    tile: "bg-green-50",
    color: "text-green",
  },
  {
    title: "QDA Schemes",
    desc: "QDA, GDA & BDA approved schemes",
    href: "/qda/",
    icon: FileCheck2,
    tile: "bg-rose-50",
    color: "text-rose-500",
  },
  {
    title: "Land Record Pages",
    desc: "Verified land record information",
    href: "/tools/land-records/",
    icon: FileText,
    tile: "bg-teal-50",
    color: "text-teal-600",
    gated: true,
  },
  {
    title: "Property Schemes",
    desc: "Explore verified housing schemes",
    href: "/schemes/",
    icon: MapIcon,
    tile: "bg-emerald-50",
    color: "text-emerald-600",
  },
  {
    title: "Area Unit Calculator",
    desc: "Convert any area unit instantly",
    href: "/tools/area-unit-converter/",
    icon: Ruler,
    tile: "bg-cyan-50",
    color: "text-cyan-600",
  },
  {
    title: "Trends & Index",
    desc: "Track changes in property prices",
    href: "/tools/trends-and-index/",
    icon: TrendingUp,
    tile: "bg-violet-50",
    color: "text-violet-600",
  },
];

export default function ToolsExplore() {
  const [landRecords, setLandRecords] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("app_settings")
      .select("value")
      .eq("key", "land_records_enabled")
      .maybeSingle()
      .then(({ data }) => {
        if (data) setLandRecords(data.value === "on");
      });
  }, []);

  const visible = ITEMS.filter((i) => !i.gated || landRecords);

  return (
    <section className="section-sm bg-white">
      <div className="wrap">
        <h2 className="text-[22px] font-extrabold text-navy sm:text-[26px]">
          Explore more on <span className="text-green">bdp.com.pk</span>
        </h2>
        <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((i) => (
            <Link key={i.href} href={i.href} className="group flex items-start gap-4">
              <span
                className={`flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${i.tile}`}
              >
                <i.icon size={30} className={i.color} />
              </span>
              <span className="min-w-0 pt-1">
                <span className="block text-[15px] font-bold leading-snug text-navy group-hover:text-green">
                  {i.title}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-muted">
                  {i.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
