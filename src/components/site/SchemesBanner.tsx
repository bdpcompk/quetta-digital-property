import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Building2, ShieldCheck } from "lucide-react";

const AUTHORITIES = [
  { code: "QDA", name: "Quetta Development Authority" },
  { code: "BDA", name: "Balochistan Development Authority" },
  { code: "GDA", name: "Gwadar Development Authority" },
  { code: "BHTPA", name: "Balochistan Housing & Town Planning Agency" },
];

const STATUS_PILLS = [
  { label: "Approved", cls: "bg-green text-white" },
  { label: "Under Process", cls: "bg-amber-400 text-navy" },
  { label: "Not Listed", cls: "bg-red-500 text-white" },
];

export default function SchemesBanner() {
  return (
    <section className="relative overflow-hidden bg-navy pb-10 pt-[calc(var(--header-h)+30px)]">
      <img
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/75 to-navy/92" />
      <div className="wrap relative">
        <div className="rounded-2xl bg-white/95 p-5 shadow-[0_20px_50px_rgba(13,31,51,.25)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green shadow-[0_8px_20px_rgba(26,135,84,.35)]">
                  <ShieldCheck size={26} className="text-white" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-green">
                    QDA · BDA · GDA · BHTPA
                  </p>
                  <h1 className="mt-1 text-[26px] font-extrabold leading-tight text-navy sm:text-[30px]">
                    Approved
                    <br className="hidden sm:block" /> Housing Schemes
                  </h1>
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted">
                Verified scheme information from official QDA, GDA, BDA &amp; BHTPA records.
                Every scheme lists its approving authority, NOC status and registration
                method — find approved housing schemes and invest with confidence.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {AUTHORITIES.map((a) => (
                  <span
                    key={a.code}
                    className="inline-flex items-center gap-2 rounded-full bg-navy px-3.5 py-1.5 text-[12px] text-white"
                  >
                    <b className="text-green">{a.code}</b>
                    <span className="text-white/85">{a.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
              <div className="flex flex-wrap gap-2">
                {STATUS_PILLS.map((p) => (
                  <span
                    key={p.label}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold ${p.cls}`}
                  >
                    {p.label === "Approved" && <ShieldCheck size={13} />}
                    {p.label}
                  </span>
                ))}
              </div>
              <span className="hidden h-14 w-14 items-center justify-center rounded-full border border-green/40 bg-green/10 lg:flex">
                <Building2 size={24} className="text-green" />
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Schemes" }]} />
        </div>
      </div>
    </section>
  );
}
