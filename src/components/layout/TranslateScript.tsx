"use client";

import { useEffect } from "react";

export default function TranslateScript() {
  useEffect(() => {
    // define init before loading the script
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).googleTranslateElementInit = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ur",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // load Google Translate script
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div id="google_translate_element" className="pointer-events-none fixed -left-[9999px] h-0 w-0 overflow-hidden opacity-0" />
  );
}
