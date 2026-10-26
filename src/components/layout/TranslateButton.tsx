"use client";

import { Languages, Loader2 } from "lucide-react";
import { useLang } from "@/components/layout/LanguageProvider";

export default function TranslateButton() {
  const { lang, setLang, translating } = useLang();
  const label = lang === "en" ? "اردو" : "English";

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "ur" : "en")}
      title={lang === "en" ? "اردو میں دیکھیں" : "View in English"}
      aria-label={lang === "en" ? "Switch to Urdu" : "Switch to English"}
      className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/30 px-2.5 text-[13px] font-semibold text-white transition-all hover:bg-white hover:text-navy"
    >
      {translating ? <Loader2 size={14} className="animate-spin" /> : <Languages size={15} />}
      <span>{label}</span>
    </button>
  );
}
