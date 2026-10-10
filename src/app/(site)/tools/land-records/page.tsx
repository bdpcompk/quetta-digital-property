import Link from "next/link";
import PageBanner from "@/components/ui/PageBanner";
import LandRecordGate from "@/components/tools/LandRecordGate";
import { ShieldCheck, FileSearch, ScrollText, BadgeCheck } from "lucide-react";

export const metadata = { title: "Land Record Pages" };

const INFO = [
  {
    icon: ScrollText,
    title: "Ownership Record (Fard)",
    desc: "Check the current owner details, area and identity of a land piece.",
  },
  {
    icon: FileSearch,
    title: "Mutation (Intiqal)",
    desc: "Track transfer of ownership records after a sale or inheritance.",
  },
  {
    icon: ShieldCheck,
    title: "Khasra & Girdawari",
    desc: "Verify cultivated area, land use and possession entries.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Documents",
    desc: "Computerised records reduce fraud and ownership disputes.",
  },
];

export default function LandRecordsPage() {
  return (
    <LandRecordGate>
      <PageBanner
        title="Balochistan Land Records"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools/" },
          { label: "Land Record Pages" },
        ]}
      >
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
          Get verified land record information with digital convenience — before
          you buy, sell or invest anywhere in Balochistan.
        </p>
      </PageBanner>

      <section className="section">
        <div className="wrap">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-line bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green/10 text-green">
                <ShieldCheck size={24} />
              </span>
              <h2 className="mt-4 text-[18px] font-extrabold text-navy">Balochistan</h2>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted">
                Land record details for districts of Balochistan, maintained by
                the Board of Revenue and district record rooms. Search by district
                to see record types and offices.
              </p>
              <Link href="/tools/land-records/balochistan/" className="btn-primary mt-5 self-start">
                Balochistan Land Records
              </Link>
            </div>

            <div className="flex flex-col rounded-2xl border border-dashed border-line bg-surface p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <FileSearch size={24} />
              </span>
              <h2 className="mt-4 text-[18px] font-extrabold text-navy">
                Other Provinces
              </h2>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted">
                Punjab and Sindh land records are available on their official
                portals (PLRA and Sindh BoR). We are working on adding them here
                soon.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 self-start rounded-lg bg-white px-3.5 py-2 text-[12.5px] font-semibold text-muted ring-1 ring-line">
                Coming soon
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="text-[16px] font-bold text-navy">
              Information available in Land Records
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {INFO.map((i) => (
                <div key={i.title} className="rounded-xl bg-surface p-4">
                  <i.icon size={20} className="text-green" />
                  <h3 className="mt-2.5 text-[14px] font-bold text-navy">{i.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{i.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="text-[16px] font-bold text-navy">About Land Record Pages</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              Land record digitisation helps prevent forgeries and resolves
              ownership disputes by providing computerised, original record
              entries. Our land record pages summarise publicly available
              information so that buyers and sellers can verify property details
              before finalising a transaction. Always confirm the final record
              from the relevant government record room before payment.
            </p>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-[12.5px] leading-relaxed text-amber-800">
                <span className="font-bold">Disclaimer:</span> Information is
                provided for reference only. bdp.com.pk does not guarantee
                accuracy or legal validity of these records. Always verify from
                the official source.
              </p>
            </div>
          </div>
        </div>
      </section>
    </LandRecordGate>
  );
}
