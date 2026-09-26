import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, BadgeCheck, Bath, BedDouble, CalendarDays, CheckCircle2, KeyRound, Mail, MapPin, Phone, Ruler, Tag,
} from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal from "@/components/ui/Reveal";
import Gallery from "@/components/property/Gallery";
import { PROPERTIES, getAgent, getSimilar } from "@/lib/data";

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = PROPERTIES.find((x) => x.id === Number(id));
  return { title: p ? p.title : "Property" };
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = PROPERTIES.find((x) => x.id === Number(id));
  if (!p) notFound();

  const agent = getAgent(p.agentId);
  const similar = getSimilar(p);

  const facts = [
    p.beds > 0 && { Icon: BedDouble, v: String(p.beds), l: "Bedrooms" },
    p.baths > 0 && { Icon: Bath, v: String(p.baths), l: "Bathrooms" },
    { Icon: Ruler, v: p.area, l: "Area" },
    { Icon: MapPin, v: p.district, l: "District" },
    { Icon: Tag, v: p.purpose, l: "Status" },
  ].filter(Boolean) as { Icon: typeof BedDouble; v: string; l: string }[];

  const details = [
    ["Property Type", p.type],
    ["Purpose", p.purpose],
    ["Area", p.area],
    ["District", p.district],
    ["Listed", "2 Weeks Ago"],
    ["Verified", p.verified ? "Yes" : "No"],
  ];

  return (
    <>
      <PageBanner
        title="Property Details"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/listings/" },
          { label: p.title },
        ]}
      />

      <section className="section">
        <div className="wrap grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-6">
            <Reveal>
              <Gallery images={p.images} alt={p.title} />
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-line bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-[22px] font-extrabold text-navy">{p.title}</h1>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[13.5px] text-muted">
                      <MapPin size={14} className="text-green" /> {p.address}
                    </p>
                  </div>
                  <p className="text-[24px] font-extrabold text-green">
                    {p.priceText}
                    {p.purpose === "For Rent" && (
                      <span className="text-[14px] font-semibold text-muted"> /month</span>
                    )}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {facts.map((f) => (
                    <div key={f.l} className="rounded-xl bg-surface px-3 py-4 text-center">
                      <f.Icon size={18} className="mx-auto text-green" />
                      <p className="mt-1.5 text-[14.5px] font-bold text-navy">{f.v}</p>
                      <p className="text-[11px] uppercase tracking-wide text-muted">{f.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-line bg-white p-6">
                <h2 className="text-[16.5px] font-bold text-navy">Description</h2>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">{p.desc}</p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-line bg-white p-6">
                <h2 className="text-[16.5px] font-bold text-navy">Features & Amenities</h2>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {p.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 rounded-lg bg-surface px-3.5 py-2.5 text-[13px] text-ink"
                    >
                      <CheckCircle2 size={15} className="shrink-0 text-green" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-line bg-white p-6">
                <h2 className="mb-4 text-[16.5px] font-bold text-navy">Property Details</h2>
                <div className="grid gap-x-10 sm:grid-cols-2">
                  {details.map(([l, v]) => (
                    <div
                      key={l}
                      className="flex items-center justify-between border-b border-line py-3 text-[13.5px] last:border-0 sm:last:border-b"
                    >
                      <span className="text-muted">{l}</span>
                      <span className="font-semibold text-ink">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* sidebar */}
          <div className="min-w-0 space-y-5 lg:sticky lg:top-24">
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                    {agent.avatar}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-navy">{agent.name}</h3>
                    <p className="text-[12.5px] text-muted">{agent.type}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-2.5 rounded-xl bg-surface px-4 py-3 text-[13.5px] font-medium text-ink transition-colors hover:bg-green-soft">
                    <Phone size={15} className="text-green" /> {agent.phone}
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-2.5 rounded-xl bg-surface px-4 py-3 text-[13.5px] font-medium text-ink transition-colors hover:bg-green-soft">
                    <Mail size={15} className="text-green" /> <span className="truncate">{agent.email}</span>
                  </a>
                </div>

                <div className="mt-4 space-y-2.5">
                  <a
                    href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green px-4 py-3 text-[13.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,135,84,.3)]"
                  >
                    <KeyRound size={15} /> WhatsApp
                  </a>
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-[13.5px] font-semibold text-ink transition-all hover:border-green hover:text-green"
                  >
                    <Phone size={15} /> Call Now
                  </a>
                  <Link
                    href="/contact/"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-[13.5px] font-semibold text-ink transition-all hover:border-green hover:text-green"
                  >
                    <Mail size={15} /> Send Message
                  </Link>
                </div>

                {agent.verified && (
                  <p className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-green">
                    <BadgeCheck size={14} /> Verified Agent
                  </p>
                )}
              </div>
            </Reveal>

            {similar.length > 0 && (
              <Reveal delay={0.15}>
                <div className="rounded-2xl border border-line bg-white p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-navy">
                    <CalendarDays size={15} className="text-green" />
                    Similar Properties in {p.district}
                  </h3>
                  <div className="space-y-3">
                    {similar.map((s) => (
                      <Link
                        key={s.id}
                        href={`/property/${s.id}/`}
                        className="group flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-surface"
                      >
                        <img
                          src={s.img}
                          alt={s.title}
                          className="h-12 w-16 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <h4 className="truncate text-[13px] font-semibold text-ink group-hover:text-green">
                            {s.title}
                          </h4>
                          <p className="text-[12.5px] font-bold text-green">{s.priceText}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            <Link href="/listings/" className="btn-ghost flex items-center justify-center gap-2">
              <ArrowLeft size={15} /> Back to Listings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
