"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Calculator, FileText, HardHat, Ruler, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tool = {
  title: string;
  desc: string;
  href: string;
  icon: typeof Calculator;
  tint: string;
  gated?: boolean;
};

const TOOLS: Tool[] = [
  {
    title: "Home Loan Calculator",
    desc: "Estimate your monthly installments, total payment and interest before you apply for a housing loan.",
    href: "/tools/home-loan-calculator/",
    icon: Calculator,
    tint: "bg-green/10 text-green",
  },
  {
    title: "Area Unit Calculator",
    desc: "Convert between Marla, Kanal, Acre, Sq Ft, Sq Yard and Sq Metre instantly.",
    href: "/tools/area-unit-converter/",
    icon: Ruler,
    tint: "bg-amber-50 text-amber-500",
  },
  {
    title: "Land Record Pages",
    desc: "Check verified land record information for districts across Balochistan.",
    href: "/tools/land-records/",
    icon: FileText,
    tint: "bg-blue-50 text-blue-600",
    gated: true,
  },
  {
    title: "Construction Cost Calculator",
    desc: "Get a realistic construction cost estimate for your plot in Balochistan.",
    href: "/tools/construction-cost-calculator/",
    icon: HardHat,
    tint: "bg-rose-50 text-rose-500",
  },
  {
    title: "Trends & Index",
    desc: "Track Balochistan property prices with the quarterly index and market trends.",
    href: "/tools/trends-and-index/",
    icon: TrendingUp,
    tint: "bg-violet-50 text-violet-600",
  },
];

export default function ToolsHub() {
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

  const visible = TOOLS.filter((t) => !t.gated || landRecords);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="group rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-green/40 hover:shadow-[0_14px_36px_rgba(13,31,51,.10)]"
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${t.tint}`}
          >
            <t.icon size={22} />
          </span>
          <h2 className="mt-4 text-[16px] font-bold text-navy">{t.title}</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{t.desc}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-green">
            Open tool <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </div>
  );
}
