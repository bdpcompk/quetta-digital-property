"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** Live district count, kept in sync through Supabase Realtime. */
export function useDistrictCount(fallback = 40) {
  const [count, setCount] = useState(fallback);

  useEffect(() => {
    if (!supabase) return;
    const sb = supabase;
    let alive = true;

    const load = async () => {
      const { count: total, error } = await sb
        .from("districts")
        .select("*", { count: "exact", head: true });
      if (!error && alive && typeof total === "number") setCount(total);
    };

    void load();
    const channel = sb
      .channel(`district-count-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "districts" },
        () => {
          void load();
        }
      )
      .subscribe();

    return () => {
      alive = false;
      void sb.removeChannel(channel);
    };
  }, []);

  return count;
}
