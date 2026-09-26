import Link from "next/link";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import type { Agent } from "@/lib/types";

export default function AgentCard({ a }: { a: Agent }) {
  return (
    <div className="lift flex flex-col rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
          {a.avatar}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold text-navy">{a.name}</h3>
          <p className="text-[12.5px] text-muted">{a.type}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-muted">
        <span className="flex items-center gap-1">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <b className="text-ink">{a.rating}</b> ({a.reviews})
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={13} className="text-green" /> {a.location}
        </span>
        {a.verified && (
          <span className="flex items-center gap-1 font-medium text-green">
            <BadgeCheck size={13} /> Verified
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1 text-[12.5px] text-muted">
        <p>{a.phone}</p>
        <p className="truncate">{a.email}</p>
      </div>

      <Link
        href={`/listings/?district=${a.location.split(",")[0]}`}
        className="btn-ghost mt-4 w-full"
      >
        View Listings →
      </Link>
    </div>
  );
}
