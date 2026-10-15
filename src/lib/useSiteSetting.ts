"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const CACHE_KEY = "bdp-site-settings";
const DEFAULT_ON = "on";

let cached: Record<string, string> | null = null;
let inflight: Promise<void> | null = null;

function readCache(): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function fetchAll(): Promise<void> {
  if (inflight) return inflight;
  inflight = (async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from("app_settings").select("key, value");
    if (!error && data) {
      const map: Record<string, string> = {};
      for (const row of data) map[row.key] = row.value;
      cached = map;
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(map));
      } catch {}
    }
    inflight = null;
  })();
  return inflight;
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
    const timer = setTimeout(() => {
      const c = cached ?? readCache();
      if (c && key in c) {
        setVal(c[key]);
        return;
      }
      fetchAll().then(() => {
        const cc = cached ?? readCache();
        if (cc && key in cc) setVal(cc[key]);
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [key]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CACHE_KEY) return;
      const map = readCache();
      if (map && key in map) setVal(map[key]);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return val;
}
