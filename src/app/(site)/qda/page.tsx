import Link from "next/link";
import {
  BadgeCheck, Briefcase, Building2, CalendarDays, CheckCircle2, ChevronDown, ChevronRight,
  CircleDollarSign, Clock, FileText, Handshake, Home, KeyRound, Landmark, LayoutGrid, Leaf,
  Map as MapIcon, MapPin, Search, ShieldCheck, Store, Tag, UserCog, Users, Warehouse,
} from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { QDA_SCHEMES, TYPES } from "@/lib/data";

export const metadata = { title: "QDA Approved Schemes" };

const HERO_BG = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600";
const HERO_HOUSE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900";
const MAP_IMG = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600";

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  home: Home, map: MapIcon, building: Building2, store: Store, leaf: Leaf,
  briefcase: Briefcase, warehouse: Warehouse, grid: LayoutGrid,
};

const QDA_COUNTS: Record<string, string> = {
  Houses: "1.2K+", Plots: "2.5K+", "Flats / Apartments": "2.1K+", Commercial: "1.4K+",
  "Agricultural Land": "1.4K+", "Shops / Offices": "950+", "Farm Houses": "620+", Other: "270+",
};

const RELATED = [
  { label: "Properties for Sale", href: "/listings/", icon: MapIcon },
  { label: "Properties for Rent", href: "/listings/?purpose=rent", icon: KeyRound },
  { label: "New Projects", href: "/projects/", icon: Building2 },
  { label: "Top Agents", href: "/agents/", icon: Users },
  { label: "Areas & Localities", href: "/areas/", icon: MapPin },
  { label: "Property Guides", href: "/guides/", icon: FileText },
];

const STATUS_PILLS: {
  label: string; cls: string; prefix?: string;
  Icon: React.ComponentType<{ size?: number }>;
}[] = [
  { label: "QDA Approved", cls: "bg-green text-white", Icon: ShieldCheck },
  { label: "Under Process", cls: "bg-amber-400 text-navy", Icon: Clock },
  { label: "Not Listed", cls: "bg-red-500 text-white", prefix: "✕", Icon: ShieldCheck },
];

export default function QdaPage() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-navy pb-14 pt-[calc(var(--header-h)+28px)]">
        <img src={HERO_BG} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/95" />
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-green/20 blur-3xl" />
        <img
          src={HERO_HOUSE}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[46%] max-w-[600px] object-cover md:block"
          style={{
            maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)",
          }}
        />
        <div className="wrap relative">
          <Reveal>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "QDA Approved Schemes" }]} />
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.12] text-white sm:text-[44px]">
              Find Your Property in
              <br />
              <span className="text-green">Balochistan</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/70">
              Pakistan&apos;s most trusted property portal for buying, renting and investing in
              properties across all districts of Balochistan.
            </p>
          </Reveal>
        </div>
      </section>

      {/* search bar */}
      <section className="relative z-10 -mt-6">
        <div className="wrap">
          <Reveal>
            <div className="rounded-2xl bg-white p-4 shadow-[0_18px_44px_rgba(13,31,51,.12)] sm:p-5">
              <div className="flex flex-wrap gap-1.5">
                <span className="flex items-center gap-1.5 rounded-lg bg-green px-4 py-2 text-[13px] font-semibold text-white">
                  Property Type <ChevronDown size={14} />
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-surface px-4 py-2 text-[13px] font-semibold text-muted">
                  <Home size={14} /> Buy
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-surface px-4 py-2 text-[13px] font-semibold text-muted">
                  <KeyRound size={14} /> Rent
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-surface px-4 py-2 text-[13px] font-semibold text-muted">
                  <CircleDollarSign size={14} /> Sell
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
                <button className="btn-primary whitespace-nowrap px-6">
                  <Search size={15} /> Search Property
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
                    <span className="mt-1 text-[11.5px] text-muted">{QDA_COUNTS[t.name] ?? t.count}</span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* QDA banner + filters */}
      <section className="section pt-2">
        <div className="wrap">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-line bg-white">
              <img src={HERO_BG} alt="" aria-hidden className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-45" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/50" />
              <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-7">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green text-white shadow-[0_10px_24px_rgba(26,135,84,.35)]">
                  <ShieldCheck size={30} />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                    <h2 className="text-[26px] font-extrabold leading-[1.15] text-navy sm:text-[30px]">
                      QDA Approved
                      <br />
                      Housing Schemes
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_PILLS.map((p) => (
                        <span key={p.label} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${p.cls}`}>
                          {p.prefix ? p.prefix : <p.Icon size={13} />} {p.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted">
                    Verified scheme information from QDA records. Find approved housing schemes,
                    check details, location and available properties with confidence.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2.5 sm:flex-col sm:items-end">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-soft text-green ring-2 ring-green/30">
                    <Landmark size={26} />
                  </span>
                  <div className="sm:text-right">
                    <p className="text-[20px] font-extrabold leading-none text-green">QDA</p>
                    <p className="mt-1 text-[10.5px] font-semibold leading-tight text-muted">
                      Quetta Development
                      <br />
                      Authority
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_300px]">
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-line bg-white p-5">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.4fr_auto] xl:items-end">
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
                  <button className="btn-primary h-[42px] whitespace-nowrap"><Search size={15} /> Search</button>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="h-full overflow-hidden rounded-2xl border border-line bg-white p-2">
                <div className="relative">
                  <img src={MAP_IMG} alt="Scheme map preview" className="h-[140px] w-full rounded-xl object-cover" />
                  <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <MapPin size={34} className="drop-shadow-[0_3px_5px_rgba(0,0,0,.35)] text-green" fill="currentColor" />
                    <span className="mt-0.5 rounded-md bg-white px-2 py-0.5 text-[11.5px] font-bold text-navy shadow">Quetta</span>
                  </span>
                  <Link
                    href="/areas/"
                    className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[11.5px] font-bold text-green shadow-md transition-colors hover:text-green-dark"
                  >
                    View on Map <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
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
                      <ShieldCheck size={12} /> QDA Approved
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
                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                      <div className="rounded-lg bg-surface px-1 py-2 text-center">
                        <p className="text-[9.5px] font-medium leading-tight text-muted">Total Area</p>
                        <p className="mt-0.5 text-[12px] font-bold text-navy">{s.totalArea}</p>
                      </div>
                      <div className="rounded-lg bg-surface px-1 py-2 text-center">
                        <p className="text-[9.5px] font-medium leading-tight text-muted">Residential Plots</p>
                        <p className="mt-0.5 flex items-center justify-center gap-1 text-[12px] font-bold text-navy">
                          <Users size={11} className="text-green" /> {s.resPlots}
                        </p>
                      </div>
                      <div className="rounded-lg bg-surface px-1 py-2 text-center">
                        <p className="text-[9.5px] font-medium leading-tight text-muted">Commercial Plots</p>
                        <p className="mt-0.5 flex items-center justify-center gap-1 text-[12px] font-bold text-navy">
                          <Building2 size={11} className="text-green" /> {s.comPlots}
                        </p>
                      </div>
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
                <Link href={href} className="lift relative flex h-full flex-col rounded-2xl border border-line bg-white p-4 pr-9">
                  <Icon size={20} className="text-green" />
                  <h4 className="mt-3 text-[13.5px] font-bold text-navy">{label}</h4>
                  <p className="mt-1 text-[11.5px] text-muted">Explore now →</p>
                  <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/70" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
