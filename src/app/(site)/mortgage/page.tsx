"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Home, Info, TrendingUp } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal from "@/components/ui/Reveal";

const YEARS = [1, 3, 5, 10, 15, 20, 25];

const fmt = (n: number) =>
  "PKR " + Math.round(n).toLocaleString("en-PK");

export default function MortgagePage() {
  const [price, setPrice] = useState(5000000);
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(18);

  const down = (price * downPct) / 100;
  const principal = Math.max(price - down, 0);
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthly = r > 0 ? (principal * r) / (1 - Math.pow(1 + r, -n)) : principal / n;
  const total = monthly * n;
  const interest = total - principal;

  return (
    <>
      <PageBanner
        title="Mortgage Calculator"
        crumbs={[{ label: "Home", href: "/" }, { label: "Mortgage Calculator" }]}
      />
      <section className="section">
        <div className="wrap grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="rounded-2xl border border-line bg-white p-6 sm:p-7">
              <h2 className="flex items-center gap-2 text-[17px] font-bold text-navy">
                <Calculator size={18} className="text-green" /> Estimate Your Monthly Installment
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                Adjust the values below — results update instantly.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="field-label">Property Price (PKR)</label>
                  <input
                    className="field"
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Math.max(Number(e.target.value) || 0, 0))}
                  />
                  <input
                    type="range"
                    min={500000}
                    max={100000000}
                    step={500000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-3 w-full accent-green"
                  />
                </div>

                <div>
                  <label className="field-label">Down Payment: {downPct}% ({fmt(down)})</label>
                  <input
                    type="range"
                    min={0}
                    max={90}
                    step={5}
                    value={downPct}
                    onChange={(e) => setDownPct(Number(e.target.value))}
                    className="w-full accent-green"
                  />
                </div>

                <div>
                  <label className="field-label">Loan Tenure</label>
                  <div className="flex flex-wrap gap-1.5">
                    {YEARS.map((y) => (
                      <button
                        key={y}
                        onClick={() => setYears(y)}
                        className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition-all ${
                          years === y
                            ? "bg-green text-white"
                            : "border border-line bg-white text-muted hover:border-green hover:text-green"
                        }`}
                      >
                        {y} {y === 1 ? "Year" : "Years"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="field-label">Annual Interest Rate: {rate}%</label>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={0.5}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full accent-green"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-green to-[#0f6b3f] p-6 text-white">
                <p className="text-[13px] text-white/80">Monthly Installment</p>
                <p className="mt-1 text-[30px] font-extrabold leading-tight">{fmt(monthly)}</p>
                <p className="mt-1 text-[12.5px] text-white/70">
                  for {years} {years === 1 ? "year" : "years"} at {rate}% per annum
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-navy">
                  <TrendingUp size={16} className="text-green" /> Payment Breakdown
                </h3>
                <dl className="space-y-3 text-[14px]">
                  {[
                    ["Property Price", fmt(price)],
                    ["Down Payment", fmt(down)],
                    ["Loan Amount", fmt(principal)],
                    ["Total Payable", fmt(total)],
                    ["Total Interest", fmt(interest)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between border-b border-line pb-2.5 last:border-0 last:pb-0">
                      <dt className="text-muted">{k}</dt>
                      <dd className="font-bold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className="flex h-full"
                    style={{ width: "100%" }}
                  >
                    <div
                      className="bg-green"
                      style={{ width: `${principal > 0 ? (principal / Math.max(total, 1)) * 100 : 100}%` }}
                    />
                    <div className="flex-1 bg-amber-400" />
                  </div>
                </div>
                <div className="mt-2 flex gap-4 text-[12px] text-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-green" /> Principal
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Interest
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-5">
                <Info size={16} className="mt-0.5 shrink-0 text-green" />
                <p className="text-[12.5px] leading-relaxed text-muted">
                  Indicative only — actual installments depend on bank policy, processing fees
                  and insurance. Most banks in Pakistan charge 1–2% processing fee on approval.
                </p>
              </div>

              <Link href="/listings/" className="btn-primary flex w-full items-center justify-center gap-2">
                <Home size={15} /> Browse Properties in Your Budget
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
