import PageBanner from "@/components/ui/PageBanner";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";

export const metadata = { title: "Property Trends & Index" };

const INDEX = [
  { city: "Quetta", index: 118.4, qoq: 2.6, yoy: 8.9 },
  { city: "Gwadar", index: 132.7, qoq: 4.1, yoy: 14.2 },
  { city: "Turbat", index: 121.9, qoq: 2.2, yoy: 9.6 },
  { city: "Khuzdar", index: 109.3, qoq: 1.4, yoy: 5.7 },
  { city: "Chaman", index: 114.6, qoq: 3.0, yoy: 10.8 },
  { city: "Lasbela", index: 112.1, qoq: 1.8, yoy: 6.4 },
];

const QUARTERS = [
  { label: "Q1 2025", price: 74500 },
  { label: "Q2 2025", price: 76800 },
  { label: "Q3 2025", price: 78400 },
  { label: "Q4 2025", price: 80100 },
  { label: "Q1 2026", price: 82600 },
  { label: "Q2 2026", price: 85300 },
];

const POPULAR = [
  { area: "Jinnah Town, Quetta", change: 12.4 },
  { area: "Gwadar Expressway", change: 15.8 },
  { area: "Satellite Town, Quetta", change: 7.2 },
  { area: "New Town, Turbat", change: 9.1 },
  { area: "Zarghoon Town, Quetta", change: 6.5 },
  { area: "CDA Zone, Gwadar", change: 11.3 },
];

const maxPrice = Math.max(...QUARTERS.map((q) => q.price));

export default function TrendsIndexPage() {
  return (
    <>
      <PageBanner
        title="Property Trends & Index"
        crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools/" }, { label: "Trends & Index" }]}
      >
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
          Quarterly index of property prices across Balochistan — track how the
          market moves before you buy or sell.
        </p>
      </PageBanner>

      <section className="section">
        <div className="wrap">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { k: "Balochistan Index (Q2 2026)", v: "118.2", d: "+2.8% QoQ", up: true },
              { k: "Avg. Price per Sq Ft", v: "PKR 85,300", d: "+3.3% QoQ", up: true },
              { k: "Avg. Annual Growth", v: "+9.1%", d: "Last 12 months", up: true },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-line bg-white p-5">
                <p className="text-[12.5px] font-semibold text-muted">{s.k}</p>
                <p className="mt-1.5 text-[26px] font-extrabold text-navy">{s.v}</p>
                <p className={`mt-1 inline-flex items-center gap-1 text-[12.5px] font-bold ${s.up ? "text-green" : "text-rose-500"}`}>
                  {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {s.d}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-green" />
                <h2 className="text-[16px] font-bold text-navy">
                  Avg. Price per Sq Ft (Balochistan)
                </h2>
              </div>
              <div className="mt-6 flex h-56 items-end gap-3 sm:gap-5">
                {QUARTERS.map((q) => (
                  <div key={q.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <span className="text-[11px] font-bold text-navy">
                      {(q.price / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-green to-green/60 transition-all"
                      style={{ height: `${(q.price / maxPrice) * 100}%` }}
                    />
                    <span className="text-[10.5px] font-medium text-muted">{q.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[12.5px] text-muted">
                Source: bdp.com.pk listings data (sample). Base year 2024 = 100.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="text-[16px] font-bold text-navy">Fastest Growing Areas</h2>
              <p className="mt-1 text-[13px] text-muted">Year-on-year price growth</p>
              <ul className="mt-4 space-y-3">
                {POPULAR.map((p) => (
                  <li key={p.area} className="flex items-center justify-between border-b border-line/70 pb-3 last:border-0 last:pb-0">
                    <span className="text-[13.5px] font-medium text-ink">{p.area}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green/10 px-2.5 py-1 text-[12.5px] font-bold text-green">
                      <ArrowUpRight size={13} /> {p.change}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="text-[16px] font-bold text-navy">City Index — Q2 2026</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="py-2.5 font-semibold">City</th>
                    <th className="py-2.5 font-semibold">Index (2024 = 100)</th>
                    <th className="py-2.5 font-semibold">Quarter on Quarter</th>
                    <th className="py-2.5 font-semibold">Year on Year</th>
                  </tr>
                </thead>
                <tbody>
                  {INDEX.map((row) => (
                    <tr key={row.city} className="border-b border-line/70 last:border-0">
                      <td className="py-3 font-semibold text-navy">{row.city}</td>
                      <td className="py-3 text-ink">{row.index}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 font-bold text-green">
                          <ArrowUpRight size={13} /> {row.qoq}%
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 font-bold text-green">
                          <ArrowUpRight size={13} /> {row.yoy}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
              The index tracks advertised prices of residential plots and houses
              across Balochistan. It is an indicative market measure and not an
              official government index.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
