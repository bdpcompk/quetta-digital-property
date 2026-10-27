"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const CACHE_KEY = "bdp-site-settings";
const DEFAULT_ON = "on";

let cached: Record<string, string> | null = null;
let inflight: Promise<void> | null = null;
let lastFetchAt = 0;
let watchersStarted = false;
const listeners = new Set<() => void>();

function readCache(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function publish(map: Record<string, string>) {
  cached = map;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(map));
  } catch {}
  listeners.forEach((listener) => listener());
}

async function fetchAll(force = false): Promise<void> {
  if (!supabase) return;
  if (inflight) return inflight;
  if (!force && lastFetchAt && Date.now() - lastFetchAt < 4000) return;
  inflight = (async () => {
    try {
      const { data, error } = await supabase.from("app_settings").select("key, value");
      if (!error && data) {
        const map: Record<string, string> = {};
        for (const row of data) map[row.key] = row.value;
        lastFetchAt = Date.now();
        publish(map);
      }
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/**
 * Force a fresh read of every setting. Called after the admin saves so the
 * change is applied immediately in this tab as well as every open form.
 */
export function refreshSiteSettings(): Promise<void> {
  return fetchAll(true);
}

function applyRealtimeRow(row: { key?: string; value?: string } | null) {
  if (!row?.key) return;
  const base = cached ?? readCache() ?? {};
  publish({ ...base, [row.key]: row.value ?? "" });
}

function startWatchers() {
  if (typeof window === "undefined" || watchersStarted) return;
  watchersStarted = true;

  // Supabase Realtime: settings changes land instantly on every open page.
  if (supabase) {
    supabase
      .channel("bdp-app-settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_settings" },
        (payload) => applyRealtimeRow(payload.new as { key?: string; value?: string } | null)
      )
      .subscribe();
  }

  // Cross-tab fallback + safety net when the websocket is unavailable.
  window.addEventListener("storage", (event) => {
    if (event.key !== CACHE_KEY) return;
    const map = readCache();
    if (map) {
      cached = map;
      listeners.forEach((listener) => listener());
    }
  });
  window.addEventListener("focus", () => fetchAll(true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") fetchAll(true);
  });
  window.setInterval(() => {
    if (document.visibilityState === "visible") fetchAll(true);
  }, 20000);
}

export function useSiteSetting(key: string): boolean {
  const on = useSiteSettingValue(key);
  return on === null ? true : on === DEFAULT_ON;
}

export function useSiteSettingValue(key: string): string | null {
  const [val, setVal] = useState<string | null>(() => {
    const c = cached ?? readCache();
    if (c && key in c) return c[key];
    return null;
  });

  useEffect(() => {
    const update = () => {
      const c = cached ?? readCache();
      if (c && key in c) setVal(c[key]);
    };
    update();
    listeners.add(update);
    startWatchers();
    fetchAll();
    return () => {
      listeners.delete(update);
    };
  }, [key]);

  return val;
}
