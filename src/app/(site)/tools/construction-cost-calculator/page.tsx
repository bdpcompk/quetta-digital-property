"use client";

import { useMemo, useState } from "react";
import { HardHat } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { formatPKR } from "@/lib/data";
import { MARLA_SQFT } from "@/lib/area";

const QUALITIES = [
  { key: "economy", label: "Economy", rate: 2200, desc: "Basic finishes, standard materials" },
  { key: "standard", label: "Standard", rate: 2800, desc: "Good finishes, branded fittings" },
  { key: "premium", label: "Premium", rate: 3500, desc: "High-end finishes, imported materials" },
] as const;

type QualityKey = (typeof QUALITIES)[number]["key"];

const AREA_UNITS = [
  { key: "sqft", label: "Square Feet (Sq Ft)" },
  { key: "marla", label: "Marla" },
] as const;

type AreaUnitKey = (typeof AREA_UNITS)[number]["key"];

export default function ConstructionCostCalculatorPage() {
  const [area, setArea] = useState(1000);
  const [areaUnit, setAreaUnit] = useState<AreaUnitKey>("sqft");
  const [quality, setQuality] = useState<QualityKey>("standard");
  const [floors, setFloors] = useState(1);

  const result = useMemo(() => {
    const sqft = Math.max(area || 0, 0) * (areaUnit === "marla" ? MARLA_SQFT : 1);
    const q = QUALITIES.find((x) => x.key === quality)!;
    const perFloor = sqft * q.rate;
    const total = perFloor * Math.max(floors, 1);
    return {
      sqft,
      rate: q.rate,
      structure: total * 0.6,
      finishing: total * 0.4,
      total,
      perMarla: total / (sqft > 0 ? sqft / MARLA_SQFT : 1),
    };
  }, [area, areaUnit, quality, floors]);

  return (
    <>
      <PageBanner
        title="Construction Cost Calculator"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools/" },
          { label: "Construction Cost Calculator" },
        ]}
      />
      <section className="section">
        <div className="wrap">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="text-[16px] font-bold text-navy">Project Details</h2>
              <p className="mt-1 text-[13px] text-muted">
                Get a realistic construction cost estimate for Balochistan region.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-ink">Covered Area</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={Number.isFinite(area) ? area : ""}
                    onChange={(e) => setArea(parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[14.5px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-ink">Unit</span>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as AreaUnitKey)}
                    className="w-full cursor-pointer rounded-xl border border-line bg-white px-3 py-2.5 text-[14.5px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]"
                  >
                    {AREA_UNITS.map((u) => (
                      <option key={u.key} value={u.key}>{u.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-ink">Number of Floors</span>
                  <select
                    value={floors}
                    onChange={(e) => setFloors(parseInt(e.target.value, 10))}
                    className="w-full cursor-pointer rounded-xl border border-line bg-white px-3 py-2.5 text-[14.5px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]"
                  >
                    {[1, 2, 3].map((f) => (
                      <option key={f} value={f}>{f} Floor{f > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </label>
              </div>

              <fieldset className="mt-5">
                <legend className="mb-2 text-[12.5px] font-semibold text-ink">Construction Quality</legend>
                <div className="grid gap-2.5">
                  {QUALITIES.map((q) => (
                    <label
                      key={q.key}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                        quality === q.key
                          ? "border-green bg-green/5"
                          : "border-line hover:border-green/40"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="quality"
                          className="accent-green"
                          checked={quality === q.key}
                          onChange={() => setQuality(q.key)}
                        />
                        <span>
                          <span className="block text-[14px] font-bold text-navy">{q.label}</span>
                          <span className="block text-[12px] text-muted">{q.desc}</span>
                        </span>
                      </span>
                      <span className="text-[13px] font-bold text-green">
                        {q.rate.toLocaleString("en-US")} PKR/sq ft
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="rounded-2xl bg-navy p-5 text-white sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green">
                  <HardHat size={18} />
                </span>
                <h2 className="text-[16px] font-bold">Estimated Cost</h2>
              </div>

              <div className="mt-5 rounded-xl bg-green px-5 py-5 shadow-[0_14px_34px_rgba(26,135,84,.35)]">
                <p className="text-[12.5px] font-semibold uppercase tracking-wide text-white/85">
                  Total Construction Cost
                </p>
                <p className="mt-1 text-[30px] font-extrabold leading-tight">
                  {formatPKR(result.total) || "PKR 0"}
                </p>
              </div>

              <dl className="mt-5 space-y-3 text-[13.5px]">
                {[
                  ["Covered Area", `${Math.round(result.sqft).toLocaleString("en-US")} sq ft`],
                  ["Structure (60%)", formatPKR(result.structure) || "PKR 0"],
                  ["Finishing (40%)", formatPKR(result.finishing) || "PKR 0"],
                  ["Cost per Marla", formatPKR(result.perMarla) || "PKR 0"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <dt className="text-white/65">{k}</dt>
                    <dd className="font-bold text-white">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-[11.5px] leading-relaxed text-white/55">
                Estimate only. Rates are indicative for Balochistan and may change
                with material prices, labour charges and site conditions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
