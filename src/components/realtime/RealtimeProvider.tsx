"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, X } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/components/layout/LanguageProvider";
import { useSiteSetting } from "@/lib/useSiteSetting";

type NewProperty = {
  id: number;
  title: string;
  priceText: string;
  district: string;
  type: string;
  img: string;
};

type Ctx = {
  newCount: number;
  latest: NewProperty[];
  clearCount: () => void;
};

const RealtimeCtx = createContext<Ctx>({ newCount: 0, latest: [], clearCount: () => {} });

export function useRealtime() {
  return useContext(RealtimeCtx);
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const alertsOn = useSiteSetting("realtime_alerts_enabled");
  const [newCount, setNewCount] = useState(0);
  const [latest, setLatest] = useState<NewProperty[]>([]);
  const [toast, setToast] = useState<NewProperty | null>(null);

  const clearCount = useCallback(() => setNewCount(0), []);

  useEffect(() => {
    if (!supabase || !alertsOn) return;
    const sb = supabase;

    const channel = sb
      .channel("realtime-properties")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "properties" },
        (payload) => {
          const p = payload.new as NewProperty;
          setNewCount((c) => c + 1);
          setLatest((l) => [p, ...l.slice(0, 9)]);
          setToast(p);
          setTimeout(() => setToast(null), 6000);
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [alertsOn]);

  // Toast notification
  useEffect(() => {
    if (!toast) return;
  }, [toast]);

  return (
    <RealtimeCtx.Provider value={{ newCount, latest, clearCount }}>
      {children}

      {/* Live toast */}
      {toast && (
        <div className="fixed right-4 top-20 z-[60] w-[320px] animate-[slideIn_0.3s_ease-out] rounded-2xl border border-line bg-white p-4 shadow-[0_16px_48px_rgba(13,31,51,.2)]">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-soft">
              <Bell size={16} className="text-green" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-green">🆕 {t("New Property Listed!")}</p>
              <Link href={`/property/?id=${toast.id}`} className="mt-1 block hover:underline">
                <p className="line-clamp-1 text-[13px] font-semibold text-ink">{toast.title}</p>
                <p className="text-[12px] text-muted">{toast.priceText} · {toast.district}</p>
              </Link>
            </div>
            <button onClick={() => setToast(null)} className="shrink-0 text-muted hover:text-ink">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Live badge in corner */}
      {newCount > 0 && (
        <button
          onClick={clearCount}
          className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-green px-4 py-2 text-[13px] font-bold text-white shadow-[0_8px_24px_rgba(26,135,84,.4)] transition-transform hover:scale-105"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          {newCount} {newCount === 1 ? t("new listing") : t("new listings")}
        </button>
      )}

      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </RealtimeCtx.Provider>
  );
}
