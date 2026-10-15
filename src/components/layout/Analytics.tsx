"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSiteSetting } from "@/lib/useSiteSetting";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  const pathname = usePathname();
  const enabled = useSiteSetting("analytics_enabled");

  useEffect(() => {
    if (!enabled || !GA_ID || typeof window === "undefined") return;
    // @ts-expect-error gtag is loaded dynamically
    if (typeof window.gtag === "function") {
      // @ts-expect-error gtag
      window.gtag("config", GA_ID, { page_path: pathname });
    }
  }, [pathname, enabled]);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
        }}
      />
    </>
  );
}
