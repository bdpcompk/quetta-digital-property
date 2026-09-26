import Link from "next/link";
import {
  BadgeCheck, Building2, CalendarDays, CheckCircle2, Clock, FileText, Handshake, KeyRound,
  Map as MapIcon, MapPin, Search, Store, UserCog, Users,
} from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { QDA_SCHEMES, TYPES } from "@/lib/data";

export const metadata = { title: "QDA Approved Schemes" };

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  home: MapIcon, map: MapIcon, building: Building2, store: Store,
  leaf: FileText, briefcase: UserCog, warehouse: KeyRound, grid: Users,
};

const RELATED = [
  { label: "Properties for Sale", href: "/listings/", icon: MapIcon },
  { label: "Properties for Rent", href: "/listings/?purpose=rent", icon: KeyRound },
  { label: "New Projects", href: "/projects/", icon: Building2 },
  { label: "Top Agents", href: "/agents/", icon: Users },
  { label: "Areas & Localities", href: "/areas/", icon: MapPin },
  { label: "Property Guides", href: "/guides/", icon: FileText },
];

export default function QdaPage() {
  return (
    <>
      <PageBanner
        title={
          <>
            QDA Approved <span className="text-[#34e89e]">Housing Schemes</span>
          </>
        }
        crumbs={[{ label: "Home", href: "/" }, { label: "QDA Approved Schemes" }]}
      >
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-white/70">
          Verified scheme information from Quetta Development Authority records — find approved
          housing schemes, NOC status, layout details and available plots with confidence.
        </p>
      </PageBanner>

      {/* search bar */}
      <section className="relative z-10 -mt-5">
        <div className="wrap">
          <Reveal>
            <div className="rounded-2xl bg-white p-4 shadow-[0_18px_44px_rgba(13,31,51,.12)] sm:p-5">
              <div className="flex flex-wrap gap-1.5">
                <span className="flex items-center gap-1.5 rounded-lg bg-green px-4 py-2 text-[13px] font-semibold text-white">
                  <MapIcon size={14} /> Property Type
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-surface px-4 py-2 text-[13px] font-semibold text-muted">
                  <Store size={14} /> Buy
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-surface px-4 py-2 text-[13px] font-semibold text-muted">
                  <KeyRound size={14} /> Rent
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-surface px-4 py-2 text-[13px] font-semibold text-muted">
                  <BadgeCheck size={14} /> Sell
                </span>
              </div>
              <div className="mt-3.5 grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_auto]">
                <label className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 transition-all focus-within:border-green focus-within:shadow-[0_0_0_3px_rgba(26,135,84,.12)]">
                  <Search size={16} className="text-green" />
                  <input className="w-full bg-transparent text-[13.5px] outline-none" placeholder="Search by city, area or property name..." />
                </label>
                <label className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 transition-all focus-within:border-green">
                  <MapPin size={16} className="text-green" />
                  <select className="w-full bg-transparent text-[13.5px] outline-none">
                    <option>Select District</option><option>Quetta</option><option>Gwadar</option><option>Kech</option><option>Khuzdar</option>
                  </select>
                </label>
                <label className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 transition-all focus-within:border-green">
                  <Building2 size={16} className="text-green" />
                  <select className="w-full bg-transparent text-[13.5px] outline-none">
                    <option>Select City/Area</option><option>Quetta</option><option>Turbat</option><option>Gwadar</option>
                  </select>
                </label>
                <button className="btn-primary px-6">
                  <Search size={15} /> Search
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* property types */}
      <section className="section-sm">
        <div className="wrap">
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {TYPES.map((t) => {
              const Icon = TYPE_ICONS[t.icon] ?? MapIcon;
              return (
                <StaggerItem key={t.name}>
                  <Link
                    href={`/listings/?type=${encodeURIComponent(t.name)}`}
                    className="lift flex h-full flex-col items-center rounded-2xl border border-line bg-white px-2 py-5 text-center"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: t.bg, color: t.color }}>
                      <Icon size={20} />
                    </span>
                    <h4 className="mt-3 text-[12.5px] font-semibold leading-tight text-navy">{t.name}</h4>
                    <span className="mt-1 text-[11.5px] text-muted">{t.count}</span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* QDA banner + filters */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-gradient-to-r from-green to-[#0f6b3f] p-7 text-white md:flex-row md:items-center">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
                    <CheckCircle2 size={13} /> QDA Approved
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[12px] font-bold text-navy">
                    <Clock size={13} /> Under Process
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-[12px] font-semibold">
                    ✕ Not Listed
                  </span>
                </div>
                <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[30px]">
                  QDA Approved
                  <br />
                  Housing Schemes
                </h2>
                <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-white/80">
                  Verified scheme information from QDA records. Find approved housing schemes,
                  check details, location and available properties with confidence.
                </p>
              </div>
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-[26px] font-extrabold text-green shadow-lg">
                QDA
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
              <div>
                <label className="field-label">Status</label>
                <select className="field"><option>🟢 QDA Approved</option><option>Under Process</option><option>Not Listed</option></select>
              </div>
              <div>
                <label className="field-label">District</label>
                <select className="field"><option>All Districts</option><option>Quetta</option><option>Kech</option><option>Pishin</option></select>
              </div>
              <div>
                <label className="field-label">Search Scheme</label>
                <input className="field" placeholder="Enter scheme name..." />
              </div>
              <button className="btn-primary h-[42px]"><Search size={15} /> Search</button>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="ml-auto mt-4 w-full max-w-[260px] overflow-hidden rounded-2xl border border-line bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400"
                alt="Scheme map preview"
                className="h-24 w-full rounded-xl object-cover"
              />
              <Link href="/areas/" className="mt-1.5 block py-1.5 text-center text-[12.5px] font-semibold text-green hover:underline">
                View on Map →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* featured schemes */}
      <section className="section section-alt">
        <div className="wrap">
          <Reveal>
            <SectionHeading title="Featured QDA Approved Schemes" href="/projects/" linkLabel="View All Schemes" />
          </Reveal>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
            {QDA_SCHEMES.map((s) => (
              <StaggerItem key={s.name}>
                <div className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={s.img} alt={s.name} loading="lazy" className="img-zoom h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-green px-2 py-1 text-[10.5px] font-bold text-white">
                      <CheckCircle2 size={12} /> QDA Approved
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-[15.5px] font-bold text-navy">{s.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                      <MapPin size={13} className="text-green" /> {s.district}
                    </p>
                    <div className="mt-3 space-y-1.5 text-[12.5px] text-muted">
                      <p className="flex items-center gap-2"><CalendarDays size={13} className="text-green" /> NOC Issued: {s.noc}</p>
                      <p className="flex items-center gap-2"><UserCog size={13} className="text-green" /> Developer: {s.developer}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-1.5 border-t border-line pt-3 text-center text-[11px] text-muted">
                      <div><p className="font-bold text-navy">{s.totalArea}</p>Area</div>
                      <div><p className="font-bold text-navy">{s.resPlots}</p>Res. Plots</div>
                      <div><p className="font-bold text-navy">{s.comPlots}</p>Com. Plots</div>
                    </div>
                    <button className="btn-primary mt-4 w-full">View Scheme →</button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* trust badges */}
      <section className="section">
        <div className="wrap">
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: BadgeCheck, t: "100% Verified Information", s: "From QDA official records" },
              { Icon: MapPin, t: "View on Map", s: "Check exact location" },
              { Icon: FileText, t: "Official Documents", s: "NOC, Layout & more" },
              { Icon: Handshake, t: "Safe Investment", s: "Buy with confidence" },
            ].map(({ Icon, t, s }) => (
              <StaggerItem key={t}>
                <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
                    <Icon size={19} />
                  </span>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-navy">{t}</h4>
                    <p className="text-[12px] text-muted">{s}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* related */}
      <section className="section section-alt">
        <div className="wrap">
          <Reveal>
            <SectionHeading
              title="Other Related Sections"
              sub="Explore more property options and services on our platform."
            />
          </Reveal>
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {RELATED.map(({ label, href, icon: Icon }) => (
              <StaggerItem key={label}>
                <Link href={href} className="lift flex h-full flex-col rounded-2xl border border-line bg-white p-4">
                  <Icon size={20} className="text-green" />
                  <h4 className="mt-3 text-[13.5px] font-bold text-navy">{label}</h4>
                  <p className="mt-1 text-[11.5px] text-muted">Explore now →</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
