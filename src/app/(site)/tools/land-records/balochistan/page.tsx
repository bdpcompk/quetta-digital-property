import Link from "next/link";
import PageBanner from "@/components/ui/PageBanner";
import LandRecordGate from "@/components/tools/LandRecordGate";
import { FileText, MapPin, Landmark, Info } from "lucide-react";

export const metadata = { title: "Balochistan Land Records" };

const DISTRICTS = [
  "Quetta",
  "Gwadar",
  "Turbat",
  "Khuzdar",
  "Chaman",
  "Panjgur",
  "Lasbela",
  "Sibi",
  "Zhob",
  "Kech",
];

const RECORD_TYPES = [
  { name: "Fard Badar", desc: "Statement of land ownership with current holder details." },
  { name: "Intiqal / Mutation", desc: "Record of ownership transfer after sale, gift or inheritance." },
  { name: "Khasra Report", desc: "Plot/parcel number, area and cultivator details." },
  { name: "Girdawari", desc: "Season-wise cultivation and possession record." },
  { name: "Sanad (Title Deed)", desc: "Official ownership certificate issued by the record room." },
  { name: "No Objection Certificate", desc: "NOC status for transfers and regulated transactions." },
];

const STEPS = [
  { t: "Find your district", d: "Select your district below to locate the nearest record room office." },
  { t: "Prepare documents", d: "Carry CNIC, property papers, attested copies and the required fee." },
  { t: "Request the record", d: "Submit a request for Fard, Intiqal or Khasra at the official office." },
  { t: "Verify before payment", d: "Cross-check the record with the seller's documents before any payment." },
];

export default function BalochistanLandRecordsPage() {
  return (
    <LandRecordGate>
      <PageBanner
        title="Balochistan Land Records"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools/" },
          { label: "Land Records", href: "/tools/land-records/" },
          { label: "Balochistan" },
        ]}
      >
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
          Verified land record information for districts of Balochistan, with
          digital convenience.
        </p>
      </PageBanner>

      <section className="section">
        <div className="wrap">
          <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-[16px] font-bold text-navy">
              <MapPin size={18} className="text-green" /> Browse by District
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {DISTRICTS.map((d) => (
                <Link
                  key={d}
                  href={`/listings/?district=${encodeURIComponent(d)}`}
                  className="group rounded-xl border border-line px-4 py-3.5 text-center transition-all hover:border-green hover:bg-green/5"
                >
                  <span className="block text-[14px] font-bold text-navy group-hover:text-green">
                    {d}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-muted">View properties</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-[16px] font-bold text-navy">
              <FileText size={18} className="text-green" /> Record Types
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RECORD_TYPES.map((r) => (
                <div key={r.name} className="rounded-xl bg-surface p-4">
                  <h3 className="text-[14px] font-bold text-navy">{r.name}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-[16px] font-bold text-navy">
                <Landmark size={18} className="text-green" /> How to Get a Land Record
              </h2>
              <ol className="mt-4 space-y-4">
                {STEPS.map((s, i) => (
                  <li key={s.t} className="flex gap-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green text-[13px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[14px] font-bold text-navy">{s.t}</span>
                      <span className="block text-[13px] leading-relaxed text-muted">{s.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-[16px] font-bold text-navy">
                <Info size={18} className="text-green" /> Offices &amp; Useful Links
              </h2>
              <ul className="mt-4 space-y-3 text-[13.5px]">
                {[
                  ["Board of Revenue, Balochistan", "Quetta — land record and mutation matters"],
                  ["District Record Room", "Tehsil offices for Khasra, Girdawari and Fard"],
                  ["Sub-Registrar Office", "Property registration and Intiqal processing"],
                ].map(([t, d]) => (
                  <li key={t} className="border-b border-line/70 pb-3 last:border-0 last:pb-0">
                    <span className="block font-bold text-navy">{t}</span>
                    <span className="block text-[12.5px] text-muted">{d}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3">
                <Info size={17} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-[12.5px] leading-relaxed text-amber-800">
                  Records are for reference only. Confirm the final document from
                  the official record room before any transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LandRecordGate>
  );
}
