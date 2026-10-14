"use client";

import { Languages } from "lucide-react";
import { useLang } from "@/components/layout/LanguageProvider";

export default function TranslateButton() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ur" : "en")}
      title={lang === "en" ? "اردو میں دیکھیں" : "View in English"}
      className="flex items-center gap-1 rounded-lg border border-white/30 px-2.5 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-white hover:text-navy"
    >
      <Languages size={14} />
      <span className="hidden sm:inline">{lang === "en" ? "اردو" : "English"}</span>
    </button>
  );
}
