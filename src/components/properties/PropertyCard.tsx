"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bath, BedDouble, Heart, MapPin, Ruler, Scale } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatArea } from "@/lib/area";
import { useSession } from "@/lib/useSession";
import { useCompare } from "@/components/properties/CompareProvider";
import { useLang } from "@/components/layout/LanguageProvider";
import { useSiteSetting } from "@/lib/useSiteSetting";

export default function PropertyCard({ p, index = 0 }: { p: Property; index?: number }) {
  const { session, supabase: sb } = useSession();
  const { add: addToCompare, items: compareItems } = useCompare();
  const { t } = useLang();
  const wishlistOn = useSiteSetting("wishlist_enabled");
  const compareOn = useSiteSetting("compare_enabled");
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const inCompare = compareItems.some((c) => c.id === p.id);

  useEffect(() => {
    if (!sb || !session) return;
    let cancelled = false;
    sb.from("saved_properties")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("property_id", p.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setLiked(!!data);
      });
    return () => { cancelled = true; };
  }, [sb, session, p.id]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sb || !session || busy) return;
    setBusy(true);
    if (liked) {
      await sb.from("saved_properties").delete().eq("user_id", session.user.id).eq("property_id", p.id);
      setLiked(false);
    } else {
      await sb.from("saved_properties").insert({ user_id: session.user.id, property_id: p.id });
      setLiked(true);
    }
    setBusy(false);
  };

  return (
    <Link
      href={`/property/?id=${p.id}`}
      className="lift group flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={p.img}
          alt={p.title}
          loading="lazy"
          className="img-zoom h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {p.featured && (
            <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[10.5px] font-bold text-navy shadow">
              {t("Featured")}
            </span>
          )}
          {!p.featured && p.verified && (
            <span className="rounded-md bg-green px-2 py-0.5 text-[10.5px] font-bold text-white shadow">
              ✓ {t("Verified")}
            </span>
          )}
          {p.purpose === "For Rent" && !p.featured && !p.verified && (
            <span className="rounded-md bg-navy px-2 py-0.5 text-[10.5px] font-bold text-white shadow">
              {t("For Rent")}
            </span>
          )}
        </div>
        {wishlistOn && (
          <button
            aria-label={liked ? "Remove from saved" : "Save property"}
            onClick={toggleLike}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-all ${
              liked ? "bg-red-500 text-white" : "bg-white/85 text-muted hover:text-red-500"
            }`}
          >
            <Heart size={15} fill={liked ? "currentColor" : "none"} />
          </button>
        )}
        <span className="absolute bottom-3 left-3 rounded-md bg-navy/85 px-2 py-0.5 text-[10.5px] font-semibold text-white backdrop-blur">
          {t(p.purpose)}
        </span>
        {compareOn && (
          <button
            aria-label="Add to compare"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!inCompare) addToCompare(p);
            }}
            disabled={inCompare}
            className={`absolute right-3 top-12 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-all ${
              inCompare ? "bg-green text-white" : "bg-white/85 text-muted hover:text-green"
            }`}
          >
            <Scale size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="text-[17px] font-extrabold text-navy">{p.priceText}</div>
        <h3 className="mt-1 line-clamp-1 text-[14.5px] font-semibold text-ink">{p.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-muted">
          <MapPin size={13} className="shrink-0 text-green" />
          <span className="line-clamp-1">{p.address}</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-[12px] text-muted">
          {p.beds > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={13} className="text-green" /> {p.beds} {t("Bed")}
            </span>
          )}
          {p.baths > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath size={13} className="text-green" /> {p.baths} {t("Bath")}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Ruler size={13} className="text-green" /> {formatArea(p.area)}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white">
            {p.agentAvatar}
          </span>
          <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">
            {p.agent}
          </span>
          {p.verified && (
            <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-green">
              <Badge /> {t("Verified Agent")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function Badge() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.4 2.1 3.2-.5 1 3.1 2.9 1.5-1.3 3 1.3 3-2.9 1.5-1 3.1-3.2-.5L12 22l-2.4-2.1-3.2.5-1-3.1L2.5 16l1.3-3-1.3-3 2.9-1.5 1-3.1 3.2.5L12 2z" />
    </svg>
  );
}
