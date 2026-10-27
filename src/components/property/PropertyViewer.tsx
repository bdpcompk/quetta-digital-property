"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  BadgeCheck, ChevronLeft, ChevronRight, ExternalLink, Film, Images, MapPin, X,
} from "lucide-react";
import MapCard from "@/components/property/MapCard";
import { getVideoEmbed } from "@/lib/video";
import type { Property } from "@/lib/types";

export type ViewerTab = "photos" | "videos" | "map";

type AgentInfo = {
  name: string;
  sub: string;
  avatar: string;
  verified?: boolean;
};

type PropertyViewerProps = {
  open: boolean;
  tab: ViewerTab;
  onTabChange: (tab: ViewerTab) => void;
  onClose: () => void;
  title: string;
  images: string[];
  videoUrls: string[];
  videoThumb?: string | null;
  district: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  showMap: boolean;
  agent: AgentInfo;
  similar: Property[];
};

export default function PropertyViewer(props: PropertyViewerProps) {
  if (!props.open || typeof document === "undefined") return null;
  return <ViewerShell {...props} />;
}

function ViewerShell({
  open,
  tab,
  onTabChange,
  onClose,
  title,
  images,
  videoUrls,
  videoThumb,
  district,
  address,
  lat,
  lng,
  showMap,
  agent,
  similar,
}: PropertyViewerProps) {
  const [index, setIndex] = useState(0);
  const hasCoords = lat != null && lng != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
  const mapSearch = hasCoords
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps?q=${encodeURIComponent(`${address || district}, Pakistan`)}`;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0));
      if (e.key === "ArrowRight") setIndex((i) => (images.length ? (i + 1) % images.length : 0));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, images.length]);

  if (!open || typeof document === "undefined") return null;

  const photos = images.length ? images : [""];
  const idx = Math.min(index, photos.length - 1);
  const tabs: { key: ViewerTab; label: string }[] = [
    { key: "photos", label: `Photos (${images.length})` },
    ...(videoUrls.length ? [{ key: "videos" as ViewerTab, label: `Videos (${videoUrls.length})` }] : []),
    ...(showMap ? [{ key: "map" as ViewerTab, label: "Map" }] : []),
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-navy/75 p-2 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} media`}
      onClick={onClose}
    >
      <div
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-stretch border-b border-line">
          <div className="flex flex-1 overflow-x-auto no-bar">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => onTabChange(t.key)}
                className={`relative shrink-0 px-5 py-3.5 text-[13.5px] font-semibold transition-colors sm:px-8 ${
                  tab === t.key ? "text-green" : "text-muted hover:text-navy"
                }`}
              >
                {t.label}
                {tab === t.key && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-green" />}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close media viewer"
            className="flex w-12 shrink-0 items-center justify-center text-muted transition-colors hover:bg-surface hover:text-navy"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1 overflow-y-auto">
            {tab === "photos" && (
              <div>
                <div className="relative flex items-center justify-center bg-black">
                  <img
                    src={photos[idx]}
                    alt={`${title} — photo ${idx + 1}`}
                    className="max-h-[58vh] w-full object-contain"
                  />
                  {photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous photo"
                        onClick={() => setIndex((idx - 1 + photos.length) % photos.length)}
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow transition-colors hover:bg-white"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        aria-label="Next photo"
                        onClick={() => setIndex((idx + 1) % photos.length)}
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow transition-colors hover:bg-white"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-navy/85 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur">
                        <Images size={13} /> {idx + 1}/{photos.length}
                      </span>
                    </>
                  )}
                </div>
                {photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-3 no-bar">
                    {photos.map((im, i) => (
                      <button
                        key={`${im}-${i}`}
                        type="button"
                        onClick={() => setIndex(i)}
                        className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          i === idx ? "border-green" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={im} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "videos" && (
              <div className="space-y-4 p-4">
                {videoUrls.map((url, i) => {
                  const embed = getVideoEmbed(url);
                  return (
                    <div key={`${url}-${i}`} className="overflow-hidden rounded-xl bg-black">
                      {embed?.kind === "iframe" ? (
                        <iframe
                          src={embed.src}
                          title={`${title} video ${i + 1}`}
                          className="aspect-video w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : embed?.kind === "file" ? (
                        <video
                          src={embed.src}
                          poster={i === 0 ? videoThumb ?? undefined : undefined}
                          className="aspect-video w-full"
                          controls
                          playsInline
                        />
                      ) : (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex aspect-video w-full items-center justify-center gap-2 text-[14px] font-semibold text-white transition-colors hover:text-green"
                        >
                          <Film size={18} /> Watch Property Video {i + 1}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {tab === "map" && (
              <div className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-navy">
                    <MapPin size={15} className="text-green" /> {address || district}
                  </p>
                  <a
                    href={mapSearch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-green hover:underline"
                  >
                    Open in Google Maps <ExternalLink size={13} />
                  </a>
                </div>
                <MapCard district={district} address={address} lat={lat} lng={lng} />
              </div>
            )}
          </div>

          <aside className="hidden w-[250px] shrink-0 flex-col border-l border-line lg:flex">
            <div className="border-b border-line px-4 py-3.5">
              <h3 className="text-[13.5px] font-bold text-navy">Other Properties</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-muted">
                Agent: <span className="font-semibold text-ink">{agent.name}</span>
                {agent.verified && <BadgeCheck size={13} className="text-green" />}
              </p>
            </div>
            <div className="flex-1 space-y-1.5 overflow-y-auto p-2.5">
              {similar.map((s) => (
                <Link
                  key={s.id}
                  href={`/property/?id=${s.id}`}
                  onClick={onClose}
                  className="group flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-surface"
                >
                  <img src={s.img} alt={s.title} className="h-11 w-14 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-ink group-hover:text-green">{s.title}</p>
                    <p className="text-[11.5px] font-bold text-green">{s.priceText}</p>
                  </div>
                </Link>
              ))}
              {!similar.length && <p className="px-2 py-6 text-center text-[12px] text-muted">No other properties yet.</p>}
            </div>
            <div className="border-t border-line p-2.5">
              <Link
                href="/listings/"
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-[12px] font-semibold text-navy transition-colors hover:bg-green-soft"
              >
                View all properties <ChevronRight size={13} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>,
    document.body
  );
}
