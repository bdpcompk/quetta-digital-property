"use client";

import { useDistrictCount } from "@/lib/useDistrictCount";

/** Renders the current district count and updates live when districts change. */
export default function LiveDistrictCount({ fallback = 40 }: { fallback?: number }) {
  return <>{useDistrictCount(fallback)}</>;
}
