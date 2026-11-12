"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Options = {
  /** Auto-refresh interval in ms. Set to 0/false to disable. Default 30s. */
  pollMs?: number;
  /** Debounce for realtime bursts, default 350ms. */
  debounceMs?: number;
  /** Re-run the initial load when this key changes (e.g. route id / user id). */
  refreshKey?: string | number;
};

/**
 * Keeps any Supabase-backed view live: reloads on realtime row changes,
 * on tab focus/visibility and with a slow polling safety net.
 */
export function useLiveRefresh(
  tables: string[],
  load: () => void | Promise<void>,
  options: Options = {}
) {
  const { pollMs = 30000, debounceMs = 350, refreshKey = "" } = options;
  const loadRef = useRef(load);
  const tablesKey = tables.join("|");

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    const list = tablesKey.split("|").filter(Boolean);
    if (list.length === 0) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let active = true;

    const run = () => {
      if (active) void loadRef.current();
    };
    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, debounceMs);
    };

    let channel = sb.channel(
      `live-${list.slice(0, 3).join("-")}-${Math.random().toString(36).slice(2, 8)}`
    );
    for (const table of list) {
      channel = channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        refresh
      );
    }
    channel.subscribe();

    // Initial load (deferred so effects stay side-effect-only).
    const initial = window.setTimeout(run, 0);

    const onFocus = () => refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);

    const poll =
      pollMs && pollMs > 0
        ? window.setInterval(() => {
            if (document.visibilityState === "visible") run();
          }, pollMs)
        : undefined;

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      window.clearTimeout(initial);
      if (poll) window.clearInterval(poll);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      void sb.removeChannel(channel);
    };
  }, [tablesKey, pollMs, debounceMs, refreshKey]);
}
