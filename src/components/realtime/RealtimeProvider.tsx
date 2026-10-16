"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";
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

type ToastMsg = {
  href: string;
  label: string;
  title: string;
  sub: string;
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
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCount = useCallback(() => setNewCount(0), []);

  const showToast = useCallback((msg: ToastMsg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);

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
          showToast({
            href: `/property/?id=${p.id}`,
            label: "New Property Listed!",
            title: p.title,
            sub: `${p.priceText} · ${p.district}`,
          });
        }
      )
      .subscribe();

    const schemeCh = sb
      .channel("realtime-schemes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schemes" },
        (payload) => {
          const nw = payload.new as { id?: number; name?: string; status?: string };
          if (!nw.id || !nw.name) return;
          const onAdmin =
            typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
          let msg: ToastMsg | null = null;
          if (payload.eventType === "INSERT" && nw.status === "Pending" && onAdmin) {
            msg = {
              href: `/schemes/?id=${nw.id}`,
              label: "New Scheme Submitted",
              title: nw.name,
              sub: "Pending review — admin approve karein",
            };
          } else if (
            nw.status === "Active" &&
            (payload.eventType === "INSERT" || (payload.eventType === "UPDATE" && !onAdmin))
          ) {
            msg = {
              href: `/schemes/?id=${nw.id}`,
              label: "New Scheme Published",
              title: nw.name,
              sub: "Abhi live hui — dekhein",
            };
          }
          if (msg) showToast(msg);
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
      sb.removeChannel(schemeCh);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [alertsOn, showToast]);

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
              <p className="text-[12px] font-bold text-green">🆕 {t(toast.label)}</p>
              <Link href={toast.href} className="mt-1 block hover:underline">
                <p className="line-clamp-1 text-[13px] font-semibold text-ink">{toast.title}</p>
                <p className="text-[12px] text-muted">{t(toast.sub)}</p>
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
