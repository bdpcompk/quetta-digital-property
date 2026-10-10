"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

export default function TranslateButton() {
  const [lang, setLang] = useState<"en" | "ur">("en");

  useEffect(() => {
    const cookie = document.cookie.split("; ").find(c => c.startsWith("googtrans="));
    if (cookie && cookie.includes("/ur")) setLang("ur");
  }, []);

  const toggle = () => {
    const next = lang === "en" ? "ur" : "en";
    // set cookie for all paths + host
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${next}; path=/`;
    document.cookie = `googtrans=/en/${next}; path=/; domain=${domain}`;
    if (domain.includes(".")) {
      document.cookie = `googtrans=/en/${next}; path=/; domain=.${domain}`;
    }
    // reload so Google Translate picks up the cookie
    window.location.reload();
  };

  return (
    <button
      onClick={toggle}
      title={lang === "en" ? "اردو میں دیکھیں" : "View in English"}
      className="flex items-center gap-1 rounded-lg border border-white/30 px-2.5 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-white hover:text-navy"
    >
      <Languages size={14} />
      <span className="hidden sm:inline">{lang === "en" ? "اردو" : "English"}</span>
    </button>
  );
}
