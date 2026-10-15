"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, URDU } from "@/lib/i18n";
import { loadAiCache, saveAiCache, collectVisibleText, batchTranslate } from "@/lib/aiTranslate";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (text: string) => string;
  translating: boolean;
};

const LangCtx = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (x) => x,
  translating: false,
});

export function useLang() {
  return useContext(LangCtx);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [aiDict, setAiDict] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const cache = loadAiCache();
      if (Object.keys(cache).length) setAiDict(cache);

      const saved = localStorage.getItem("bdp-lang") as Lang | null;
      if (saved === "ur") {
        setLangState("ur");
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ur";
        document.body.classList.add("font-urdu");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const setLang = (l: Lang) => {
    if (l === "ur") {
      // Switch immediately with dictionary translations
      setLangState("ur");
      localStorage.setItem("bdp-lang", "ur");
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ur";
      document.body.classList.add("font-urdu");

      // Then translate missing texts in background
      const cache = loadAiCache();
      const missing = collectVisibleText().filter(
        (txt) => !URDU[txt] && !cache[txt]
      );
      if (missing.length > 0) {
        setTranslating(true);
        batchTranslate(missing)
          .then((translated) => {
            const merged = { ...cache, ...translated };
            saveAiCache(merged);
            setAiDict(merged);
          })
          .finally(() => setTranslating(false));
      }
      return;
    }

    setLangState(l);
    localStorage.setItem("bdp-lang", l);
    document.documentElement.dir = "ltr";
    document.documentElement.lang = l;
    document.body.classList.remove("font-urdu");
  };

  const t = (text: string) => {
    if (lang === "en") return text;
    return URDU[text] ?? aiDict[text] ?? text;
  };

  return (
    <LangCtx.Provider value={{ lang, setLang, t, translating }}>
      {children}
    </LangCtx.Provider>
  );
}
