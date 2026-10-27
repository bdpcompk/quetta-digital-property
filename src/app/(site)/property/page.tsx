"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, BadgeCheck, Bath, BedDouble, CalendarDays, CheckCircle2, Film, Images, KeyRound, Loader2,
  Mail, MapPin, Phone, Printer, Ruler, SearchX, Tag,
} from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal from "@/components/ui/Reveal";
import Gallery from "@/components/property/Gallery";
import PropertyViewer, { type ViewerTab } from "@/components/property/PropertyViewer";
import InquiryModal from "@/components/site/InquiryModal";
import { getPropertyById, getSimilarLive, getAgent } from "@/lib/data";
import { formatArea } from "@/lib/area";
import { supabase } from "@/lib/supabase";
import type { Property } from "@/lib/types";
import { useSession } from "@/lib/useSession";
import { useGlobalFeature } from "@/lib/useFeatureControl";

function PropertyClient() {
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const { session } = useSession();
  const locationOn = useGlobalFeature("location_map");
  const contactOn = useGlobalFeature("contact_display");
  const whatsappOn = useGlobalFeature("whatsapp_button");
  const [p, setP] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "none">("loading");
  const [inqOpen, setInqOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerTab, setViewerTab] = useState<ViewerTab>("photos");
  const [printView, setPrintView] = useState(false);
  const openViewer = (tab: ViewerTab) => {
    setViewerTab(tab);
    setViewerOpen(true);
  };

  const handlePrint = () => {
    setPrintView(true);
    setTimeout(() => window.print(), 100);
    setTimeout(() => setPrintView(false), 500);
  };

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      const t = setTimeout(() => setState("none"), 0);
      return () => clearTimeout(t);
    }
    let alive = true;
    const t = setTimeout(async () => {
      setState("loading");
      const found = await getPropertyById(id, session?.user.id);
      if (!alive) return;
      if (!found) {
        setState("none");
        return;
      }
      setP(found);
      setState("ok");
      const sims = await getSimilarLive(found);
      if (alive) setSimilar(sims);
    }, 0);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [id, session?.user.id]);

  useEffect(() => {
    if (state === "ok" && p) document.title = `${p.title} | Balochistan Property Portal`;
  }, [state, p]);

  useEffect(() => {
    const sb = supabase;
    if (!sb || !p?.id) return;
    const key = `bdp-pv-${p.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      return;
    }
    sb.rpc("record_property_view", { pid: p.id });
  }, [p]);

  if (state === "loading") {
    return (
      <>
        <PageBanner title="Property Details" crumbs={[{ label: "Home", href: "/" }, { label: "Properties", href: "/listings/" }]} />
        <section className="section">
          <div className="wrap flex items-center justify-center gap-2 rounded-2xl border border-line bg-white p-14 text-[14px] text-muted">
            <Loader2 size={16} className="animate-spin" /> Loading property…
          </div>
        </section>
      </>
    );
  }

  if (state === "none" || !p) {
    return (
      <>
        <PageBanner title="Property Details" crumbs={[{ label: "Home", href: "/" }, { label: "Properties", href: "/listings/" }]} />
        <section className="section">
          <div className="wrap max-w-[480px] rounded-2xl border border-dashed border-line bg-white py-14 text-center">
            <SearchX size={42} className="mx-auto text-line" />
            <h3 className="mt-4 text-[17px] font-bold text-navy">Property Not Found</h3>
            <p className="mt-1 text-[13px] text-muted">
              This listing may have been removed by its owner.
            </p>
            <Link href="/listings/" className="btn-primary mt-5">
              Browse Properties
            </Link>
          </div>
        </section>
      </>
    );
  }

  const isPoster = Boolean(p.phone);
  const videoUrls: string[] = [];
  if (p.video_url) videoUrls.push(p.video_url);
  for (const url of p.video_urls ?? []) {
    if (url && !videoUrls.includes(url)) videoUrls.push(url);
  }
  const photos = p.images?.length ? p.images : [p.img];
  const agent = getAgent(p.agentId);
  const contact = isPoster
    ? { name: p.agent, sub: "Property Owner", avatar: p.agentAvatar, phone: p.phone ?? "", email: "", verified: false }
    : { name: agent.name, sub: agent.type, avatar: agent.avatar, phone: agent.phone, email: agent.email, verified: agent.verified };

  const facts = [
    p.beds > 0 && { Icon: BedDouble, v: String(p.beds), l: "Bedrooms" },
    p.baths > 0 && { Icon: Bath, v: String(p.baths), l: "Bathrooms" },
    { Icon: Ruler, v: formatArea(p.area), l: "Area" },
    { Icon: MapPin, v: p.district, l: "District" },
    { Icon: Tag, v: p.purpose, l: "Status" },
  ].filter(Boolean) as { Icon: typeof BedDouble; v: string; l: string }[];

  const details = [
    ["Property Type", p.type],
    ["Purpose", p.purpose],
    ["Area", formatArea(p.area)],
    ["District", p.district],
    ["Listed", "Recently"],
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

      <section className="section print-hide">
        <div className="wrap grid items-start gap-6 lg:grid-cols-[1fr_340px] print-hide">
          <div className="min-w-0 space-y-6">
            <Reveal>
              <Gallery images={photos} alt={p.title} onOpen={() => openViewer("photos")} />
            </Reveal>

            <Reveal delay={0.03}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => openViewer("photos")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-[12.5px] font-semibold text-navy transition-colors hover:border-green hover:text-green"
                >
                  <Images size={15} className="text-green" /> Photos ({photos.length})
                </button>
                {videoUrls.length > 0 && (
                  <button
                    type="button"
                    onClick={() => openViewer("videos")}
                    className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-[12.5px] font-semibold text-navy transition-colors hover:border-green hover:text-green"
                  >
                    <Film size={15} className="text-green" /> Videos ({videoUrls.length})
                  </button>
                )}
                {locationOn && (
                  <button
                    type="button"
                    onClick={() => openViewer("map")}
                    className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-[12.5px] font-semibold text-navy transition-colors hover:border-green hover:text-green"
                  >
                    <MapPin size={15} className="text-green" /> Map
                  </button>
                )}
              </div>
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
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-[12.5px] font-semibold text-navy transition-colors hover:border-green hover:text-green sm:ml-3"
                  >
                    <Printer size={15} className="text-green" /> Print
                  </button>
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

            {p.features?.length > 0 && (
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
            )}

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
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                    {contact.avatar}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-bold text-navy">{contact.name}</h3>
                    <p className="text-[12.5px] text-muted">{contact.sub}</p>
                  </div>
                </div>

                {contactOn && (
                  <>
                    <div className="mt-4 space-y-2.5">
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2.5 rounded-xl bg-surface px-4 py-3 text-[13.5px] font-medium text-ink transition-colors hover:bg-green-soft"
                      >
                        <Phone size={15} className="text-green" /> {contact.phone}
                      </a>
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-2.5 rounded-xl bg-surface px-4 py-3 text-[13.5px] font-medium text-ink transition-colors hover:bg-green-soft"
                        >
                          <Mail size={15} className="text-green" /> <span className="truncate">{contact.email}</span>
                        </a>
                      )}
                    </div>
                  </>
                )}

                <div className="mt-4 space-y-2.5">
                  {whatsappOn && (
                    <a
                      href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green px-4 py-3 text-[13.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,135,84,.3)]"
                    >
                      <KeyRound size={15} /> WhatsApp
                    </a>
                  )}
                  {contactOn && (
                    <>
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-[13.5px] font-semibold text-ink transition-all hover:border-green hover:text-green"
                      >
                        <Phone size={15} /> Call Now
                      </a>
                      <button
                        type="button"
                        onClick={() => setInqOpen(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-[13.5px] font-semibold text-ink transition-all hover:border-green hover:text-green"
                      >
                        <Mail size={15} /> Send Message
                      </button>
                    </>
                  )}
                </div>

                {contact.verified && (
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
                        href={`/property/?id=${s.id}`}
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

      <PropertyViewer
        open={viewerOpen}
        tab={viewerTab}
        onTabChange={setViewerTab}
        onClose={() => setViewerOpen(false)}
        title={p.title}
        images={photos}
        videoUrls={videoUrls}
        videoThumb={p.video_thumb}
        district={p.district}
        address={p.address}
        lat={p.lat}
        lng={p.lng}
        showMap={locationOn}
        agent={{ name: contact.name, sub: contact.sub, avatar: contact.avatar, verified: contact.verified }}
        similar={similar}
      />

      {printView && (
        <div className="print-only flex flex-col gap-4 p-6">
          <div className="border-b border-navy pb-3 mb-4">
            <h1 className="text-[24px] font-extrabold text-navy">{p.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
              <MapPin size={13} className="text-green" /> {p.address}
            </p>
            <p className="mt-2 text-[20px] font-extrabold text-green">
              {p.priceText}
              {p.purpose === "For Rent" && <span className="text-[14px] font-semibold text-muted"> /month</span>}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.l} className="rounded-xl bg-surface p-3 text-center">
                <f.Icon size={16} className="mx-auto text-green" />
                <p className="mt-1 text-[14px] font-bold text-navy">{f.v}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted">{f.l}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-line pt-4">
            <h2 className="text-[16px] font-bold text-navy">Description</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{p.desc}</p>
          </div>

          {p.features?.length > 0 && (
            <div className="mt-4">
              <h2 className="text-[16px] font-bold text-navy">Features &amp; Amenities</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-[12.5px] text-ink">
                    <CheckCircle2 size={13} className="shrink-0 text-green" /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <h2 className="text-[16px] font-bold text-navy">Property Details</h2>
            <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
              {details.map(([l, v]) => (
                <div key={l} className="flex items-start justify-between border-b border-line py-2 last:border-0 text-[13px]">
                  <span className="text-muted">{l}</span>
                  <span className="font-semibold text-ink">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-[16px] font-bold text-navy">Contact</h2>
            <div className="mt-2 flex items-center gap-3 text-[13px]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                {contact.avatar}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-navy">{contact.name}</p>
                <p className="text-muted">{contact.sub}</p>
                {contact.phone && <p className="text-muted">📞 {contact.phone}</p>}
                {contact.email && <p className="text-muted">✉️ {contact.email}</p>}
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <p className="text-[11px] text-muted text-center">
              Printed from Quetta Digital Property &bull;{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <style>{`
        .print-only {
          display: none;
        }
        @media print {
          .no-print,
          header,
          footer,
          nav,
          [role="dialog"],
          .print-hide {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
            color: #111827 !important;
          }
          .section,
          .wrap {
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          a[href]::after {
            content: none !important;
          }
        }
      `}</style>

      <InquiryModal
        open={inqOpen}
        onClose={() => setInqOpen(false)}
        propertyId={p.id}
        ownerId={p.created_by ?? null}
        title={p.title}
      />
    </>
  );
}

export default function PropertyPage() {
  return (
    <Suspense>
      <PropertyClient />
    </Suspense>
  );
}
