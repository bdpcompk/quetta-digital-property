"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { formatPKR } from "@/lib/data";

const nf = new Intl.NumberFormat("en-US");

function Field({
  label,
  prefix,
  suffix,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink">{label}</span>
      <span className="flex items-center rounded-xl border border-line bg-white px-3 py-2.5 transition-colors focus-within:border-green focus-within:shadow-[0_0_0_3px_rgba(26,135,84,.12)]">
        {prefix && <span className="mr-2 text-[13px] font-semibold text-muted">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full bg-transparent text-[14.5px] font-medium text-ink outline-none"
        />
        {suffix && <span className="ml-2 text-[13px] font-semibold text-muted">{suffix}</span>}
      </span>
    </label>
  );
}

export default function HomeLoanCalculatorPage() {
  const [price, setPrice] = useState(5000000);
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(18);

  const r = useMemo(() => Math.max(rate, 0) / 1200, [rate]);
  const n = useMemo(() => Math.max(years, 1) * 12, [years]);

  const result = useMemo(() => {
    const safePrice = Math.max(price || 0, 0);
    const down = safePrice * (Math.min(Math.max(downPct, 0), 100) / 100);
    const loan = safePrice - down;
    let emi = 0;
    if (loan > 0 && r > 0) {
      const pow = Math.pow(1 + r, n);
      emi = (loan * r * pow) / (pow - 1);
    } else if (loan > 0) {
      emi = loan / n;
    }
    const total = emi * n;
    return {
      down,
      loan,
      emi,
      total,
      interest: Math.max(total - loan, 0),
    };
  }, [price, downPct, r, n]);

  return (
    <>
      <PageBanner
        title="Home Loan Calculator"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools/" },
          { label: "Home Loan Calculator" },
        ]}
      />
      <section className="section">
        <div className="wrap">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="text-[16px] font-bold text-navy">Loan Details</h2>
              <p className="mt-1 text-[13px] text-muted">
                Adjust the values below to estimate your monthly installment.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Property Price" prefix="PKR" value={price} onChange={setPrice} min={0} step={100000} />
                <Field label="Down Payment" suffix="%" value={downPct} onChange={setDownPct} min={0} max={100} step={1} />
                <Field label="Loan Period" suffix="Years" value={years} onChange={setYears} min={1} max={30} step={1} />
                <Field label="Interest Rate" suffix="% p.a." value={rate} onChange={setRate} min={0} max={40} step={0.25} />
              </div>
              <div className="mt-5 rounded-xl bg-surface px-4 py-3 text-[13px] text-muted">
                Loan amount:{" "}
                <span className="font-bold text-navy">{formatPKR(result.loan)}</span>
                {"  •  "}Down payment:{" "}
                <span className="font-bold text-navy">{formatPKR(result.down)}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-navy p-5 text-white sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green">
                  <Calculator size={18} />
                </span>
                <h2 className="text-[16px] font-bold">Your Estimate</h2>
              </div>

              <div className="mt-5 rounded-xl bg-green px-5 py-5 shadow-[0_14px_34px_rgba(26,135,84,.35)]">
                <p className="text-[12.5px] font-semibold uppercase tracking-wide text-white/85">
                  Monthly Installment
                </p>
                <p className="mt-1 text-[30px] font-extrabold leading-tight">
                  {formatPKR(result.emi) || "PKR 0"}
                </p>
              </div>

              <dl className="mt-5 space-y-3 text-[13.5px]">
                {[
                  ["Loan Amount", formatPKR(result.loan) || "PKR 0"],
                  ["Total Payment", formatPKR(result.total) || "PKR 0"],
                  ["Total Interest", formatPKR(result.interest) || "PKR 0"],
                  ["Number of Installments", nf.format(n)],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <dt className="text-white/65">{k}</dt>
                    <dd className="font-bold text-white">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-[11.5px] leading-relaxed text-white/55">
                Estimate only. Actual installment depends on bank terms, markup
                rate and processing charges.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="text-[15.5px] font-bold text-navy">How to use this calculator</h2>
            <div className="mt-3 grid gap-4 text-[13.5px] leading-relaxed text-muted sm:grid-cols-3">
              <p>
                <span className="font-semibold text-ink">1. Property Price:</span>{" "}
                Enter the total price of the property you want to buy.
              </p>
              <p>
                <span className="font-semibold text-ink">2. Down Payment:</span>{" "}
                The percentage you will pay upfront. Higher down payment reduces
                your monthly installment.
              </p>
              <p>
                <span className="font-semibold text-ink">3. Loan Period &amp; Rate:</span>{" "}
                Choose the tenure in years and expected annual markup rate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
