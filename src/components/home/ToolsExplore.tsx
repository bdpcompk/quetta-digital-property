"use client";

import Link from "next/link";
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
import { useLang } from "@/components/layout/LanguageProvider";
import { useSiteSettingValue } from "@/lib/useSiteSetting";

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
    href: "/schemes/?authority=QDA",
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
  const { t } = useLang();
  const landRaw = useSiteSettingValue("land_records_enabled");
  const landRecords = landRaw === null ? true : landRaw === "on";

  const visible = ITEMS.filter((i) => !i.gated || landRecords);

  return (
    <section className="section-sm bg-white">
      <div className="wrap">
        <h2 className="text-[22px] font-extrabold text-navy sm:text-[26px]">
          {t("Explore more on")} <span className="text-green">bdp.com.pk</span>
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-7 lg:grid-cols-4">
          {visible.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="group flex flex-col gap-3 rounded-2xl border border-line bg-white p-3.5 transition-all hover:border-green/40 hover:shadow-sm sm:flex-row sm:items-start sm:gap-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:hover:shadow-none"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 sm:h-[68px] sm:w-[68px] sm:rounded-2xl ${i.tile}`}
              >
                <i.icon size={22} className={`sm:hidden ${i.color}`} />
                <i.icon size={30} className={`hidden sm:block ${i.color}`} />
              </span>
              <span className="min-w-0 sm:pt-1">
                <span className="block text-[13px] font-bold leading-snug text-navy group-hover:text-green sm:text-[15px]">
                  {t(i.title)}
                </span>
                <span className="mt-1 block text-[11.5px] leading-relaxed text-muted sm:text-[13px]">
                  {t(i.desc)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
