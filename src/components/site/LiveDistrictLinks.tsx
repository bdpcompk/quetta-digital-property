"use client";

import { useState } from "react";
import Link from "next/link";
import { getDistricts } from "@/lib/data";
import { useLiveRefresh } from "@/lib/useLiveRefresh";

/** All districts straight from Supabase, kept live. */
export default function LiveDistrictLinks() {
  const [districts, setDistricts] = useState<string[]>([]);

  useLiveRefresh(["districts"], () =>
    getDistricts().then((rows) => setDistricts(rows.map((d) => d.name).filter(Boolean)))
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {districts.map((d) => (
        <Link
          key={d}
          href={`/listings/?district=${encodeURIComponent(d)}`}
          className="group rounded-xl border border-line px-4 py-3.5 text-center transition-all hover:border-green hover:bg-green/5"
        >
          <span className="block text-[14px] font-bold text-navy group-hover:text-green">{d}</span>
          <span className="mt-0.5 block text-[11.5px] text-muted">View properties</span>
        </Link>
      ))}
    </div>
  );
}
