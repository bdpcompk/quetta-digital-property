"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ViewCounter({ propertyId }: { propertyId: number }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase || !propertyId) return;
    let cancelled = false;

    (async () => {
      // increment
      const { data: existing } = await supabase
        .from("property_views")
        .select("id, views")
        .eq("property_id", propertyId)
        .maybeSingle();

      if (existing) {
        const { data } = await supabase
          .from("property_views")
          .update({ views: existing.views + 1 })
          .eq("property_id", propertyId)
          .select("views")
          .single();
        if (!cancelled && data) setViews(data.views);
      } else {
        const { data } = await supabase
          .from("property_views")
          .insert({ property_id: propertyId, views: 1 })
          .select("views")
          .single();
        if (!cancelled && data) setViews(data.views);
      }
    })();

    return () => { cancelled = true; };
  }, [propertyId]);

  if (views === null) return null;

  return (
    <span className="flex items-center gap-1.5 text-[13px] text-muted">
      <Eye size={14} className="text-green" />
      {views.toLocaleString()} views
    </span>
  );
}
