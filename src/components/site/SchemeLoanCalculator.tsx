"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { formatPKR } from "@/lib/data";

export default function SchemeLoanCalculator({ defaultPrice }: { defaultPrice?: number }) {
  const [price, setPrice] = useState(defaultPrice && defaultPrice > 0 ? defaultPrice : 5000000);
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(18);

  const result = useMemo(() => {
    const p = Math.max(price || 0, 0);
    const down = p * (Math.min(Math.max(downPct, 0), 100) / 100);
    const loan = p - down;
    const r = Math.max(rate, 0) / 1200;
    const n = Math.max(years, 1) * 12;
    let emi = 0;
    if (loan > 0 && r > 0) {
      const pow = Math.pow(1 + r, n);
      emi = (loan * r * pow) / (pow - 1);
    } else if (loan > 0) {
      emi = loan / n;
    }
    return { loan, emi, total: emi * n, n };
  }, [price, downPct, years, rate]);

  const inputCls =
    "w-full rounded-lg border border-line bg-white px-3 py-2 text-[14px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]";

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="flex items-center gap-2 text-[15.5px] font-bold text-navy">
        <Calculator size={16} className="text-green" /> Loan Calculator
      </p>
      <p className="mt-1 text-[13.5px] text-muted">Plan your monthly installment automatically.</p>

      <label className="mt-3.5 block">
        <span className="mb-1 block text-[12px] font-semibold text-muted">Property Price (PKR)</span>
        <input
          type="number"
          min={0}
          step={100000}
          value={Number.isFinite(price) ? price : ""}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className={inputCls}
        />
      </label>

      <div className="mt-2.5 grid grid-cols-3 gap-2">
        <label className="block">
          <span className="mb-1 block text-[12px] font-semibold text-muted">Down %</span>
          <input
            type="number"
            min={0}
            max={100}
            value={downPct}
            onChange={(e) => setDownPct(parseFloat(e.target.value))}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] font-semibold text-muted">Years</span>
          <input
            type="number"
            min={1}
            max={30}
            value={years}
            onChange={(e) => setYears(parseFloat(e.target.value))}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] font-semibold text-muted">Rate %</span>
          <input
            type="number"
            min={0}
            max={40}
            step={0.25}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className={inputCls}
          />
        </label>
      </div>

      <div className="mt-3.5 rounded-xl bg-green px-4 py-3.5">
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-white/85">
          Monthly Installment
        </p>
        <p className="mt-0.5 text-[24px] font-extrabold leading-tight text-white">
          {formatPKR(result.emi) || "PKR 0"}
        </p>
      </div>

      <dl className="mt-3 space-y-2 text-[13.5px]">
        <div className="flex justify-between">
          <dt className="text-muted">Loan Amount</dt>
          <dd className="font-bold text-navy">{formatPKR(result.loan) || "PKR 0"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Total Payment</dt>
          <dd className="font-bold text-navy">{formatPKR(result.total) || "PKR 0"}</dd>
        </div>
      </dl>

      <p className="mt-3 text-[12px] leading-relaxed text-muted">
        Estimate only — actual installment depends on bank terms.
      </p>
    </div>
  );
}
