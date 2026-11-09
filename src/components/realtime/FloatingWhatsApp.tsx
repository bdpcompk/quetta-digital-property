"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/layout/LanguageProvider";
import { useGlobalFeature } from "@/lib/useFeatureControl";

export default function FloatingWhatsApp() {
  const { t } = useLang();
  const pathname = usePathname();
  const enabled = useGlobalFeature("whatsapp_button");
  // Profile/dashboard pages have their own fixed bottom tab bar on mobile.
  const aboveBottomNav = pathname?.startsWith("/profile") || pathname?.startsWith("/dashboard");

  if (!enabled) return null;

  return (
    <a
      href="https://wa.me/923047974497"
      target="_blank"
      rel="noopener noreferrer"
      title={t("Chat on WhatsApp")}
      aria-label={t("Chat on WhatsApp")}
      className={`fixed right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,.45)] transition-transform hover:scale-110 sm:bottom-5 sm:right-6 sm:h-14 sm:w-14 ${
        aboveBottomNav
          ? "bottom-[calc(76px+env(safe-area-inset-bottom))]"
          : "bottom-[calc(16px+env(safe-area-inset-bottom))]"
      }`}
    >
      <MessageCircle size={22} fill="currentColor" />
      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-red-500" />
    </a>
  );
}
