"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, translate } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (text: string) => string;
};

const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (x) => x });

export function useLang() {
  return useContext(LangCtx);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("bdp-lang") as Lang | null;
    if (saved === "ur" || saved === "en") {
      setLangState(saved);
      if (saved === "ur") {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ur";
        document.body.classList.add("font-urdu");
      }
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("bdp-lang", l);
    // set html dir for RTL
    document.documentElement.dir = l === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = l;
    // apply Urdu font class to body
    if (l === "ur") {
      document.body.classList.add("font-urdu");
    } else {
      document.body.classList.remove("font-urdu");
    }
  };

  const t = (text: string) => translate(text, lang);

  return (
    <LangCtx.Provider value={{ lang, setLang, t }}>
      {children}
    </LangCtx.Provider>
  );
}
