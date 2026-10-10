"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { MARLA_SQFT, KANAL_SQFT, ACRE_SQFT } from "@/lib/area";

const UNITS = [
  { key: "sqft", label: "Square Feet (Sq Ft)" },
  { key: "sqyard", label: "Square Yard (Sq Yd)" },
  { key: "sqm", label: "Square Metre (Sq m)" },
  { key: "marla", label: "Marla" },
  { key: "kanal", label: "Kanal" },
  { key: "acre", label: "Acre" },
] as const;

type UnitKey = (typeof UNITS)[number]["key"];

const TO_SQFT: Record<UnitKey, number> = {
  sqft: 1,
  sqyard: 9,
  sqm: 10.7639,
  marla: MARLA_SQFT,
  kanal: KANAL_SQFT,
  acre: ACRE_SQFT,
};

const fmt = (n: number) =>
  n >= 100 ? Math.round(n).toLocaleString("en-US") : (Math.round(n * 100) / 100).toLocaleString("en-US");

export default function AreaUnitConverterPage() {
  const [value, setValue] = useState(10);
  const [unit, setUnit] = useState<UnitKey>("marla");

  const sqft = useMemo(() => Math.max(value || 0, 0) * TO_SQFT[unit], [value, unit]);

  const results = UNITS.map((u) => ({ ...u, out: sqft / TO_SQFT[u.key] }));

  return (
    <>
      <PageBanner
        title="Area Unit Calculator"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools/" },
          { label: "Area Unit Calculator" },
        ]}
      />
      <section className="section">
        <div className="wrap">
          <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="text-[16px] font-bold text-navy">Convert Area</h2>
              <p className="mt-1 text-[13px] text-muted">
                Enter a value and pick its unit to convert instantly.
              </p>

              <label className="mt-5 block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-ink">Value</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={Number.isFinite(value) ? value : ""}
                  onChange={(e) => setValue(parseFloat(e.target.value))}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[15px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]"
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-ink">Unit</span>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as UnitKey)}
                  className="w-full cursor-pointer rounded-xl border border-line bg-white px-3 py-2.5 text-[14.5px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]"
                >
                  {UNITS.map((u) => (
                    <option key={u.key} value={u.key}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5 rounded-xl bg-surface px-4 py-3 text-[13px] text-muted">
                {value || 0} {UNITS.find((u) => u.key === unit)?.label} ={" "}
                <span className="font-bold text-navy">{fmt(sqft)} Sq Ft</span>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="text-[16px] font-bold text-navy">Results</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {results.map((u) => (
                  <div
                    key={u.key}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3.5 transition-colors ${
                      u.key === unit
                        ? "border-green bg-green/5"
                        : "border-line bg-white"
                    }`}
                  >
                    <span className="text-[13px] font-medium text-muted">{u.label}</span>
                    <span className="text-[16px] font-extrabold text-navy">{fmt(u.out)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="text-[15.5px] font-bold text-navy">Quick Reference</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="py-2.5 font-semibold">Unit</th>
                    <th className="py-2.5 font-semibold">Square Feet</th>
                    <th className="py-2.5 font-semibold">Marla</th>
                    <th className="py-2.5 font-semibold">Kanal</th>
                  </tr>
                </thead>
                <tbody className="text-ink">
                  <tr className="border-b border-line/70">
                    <td className="py-2.5 font-medium">1 Marla</td>
                    <td className="py-2.5">{MARLA_SQFT}</td>
                    <td className="py-2.5">1</td>
                    <td className="py-2.5">0.05</td>
                  </tr>
                  <tr className="border-b border-line/70">
                    <td className="py-2.5 font-medium">1 Kanal</td>
                    <td className="py-2.5">{KANAL_SQFT.toLocaleString("en-US")}</td>
                    <td className="py-2.5">20</td>
                    <td className="py-2.5">1</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">1 Acre</td>
                    <td className="py-2.5">{ACRE_SQFT.toLocaleString("en-US")}</td>
                    <td className="py-2.5">160</td>
                    <td className="py-2.5">8</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 flex items-center gap-2 text-[12.5px] text-muted">
              <ArrowRight size={14} className="text-green" /> 1 Acre = 8 Kanal = 160
              Marla = 43,560 Sq Ft (Pakistani standard measurements)
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
