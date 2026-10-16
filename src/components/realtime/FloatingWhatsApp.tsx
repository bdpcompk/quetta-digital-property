"use client";

import { MessageCircle } from "lucide-react";
import { useLang } from "@/components/layout/LanguageProvider";
import { useSiteSetting } from "@/lib/useSiteSetting";

export default function FloatingWhatsApp() {
  const { t } = useLang();
  const enabled = useSiteSetting("whatsapp_enabled");

  if (!enabled) return null;

  return (
    <a
      href="https://wa.me/923047974497"
      target="_blank"
      rel="noopener noreferrer"
      title={t("Chat on WhatsApp")}
      className="fixed bottom-20 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,.45)] transition-transform hover:scale-110 sm:bottom-4"
    >
      <MessageCircle size={24} fill="currentColor" />
      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-red-500" />
    </a>
  );
}
