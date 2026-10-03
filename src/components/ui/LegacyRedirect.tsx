"use client";

import { useEffect } from "react";

export default function LegacyRedirect() {
  useEffect(() => {
    const m = window.location.pathname.match(/\/property\/(\d+)\/?$/);
    if (m) {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      window.location.replace(`${base}/property/?id=${m[1]}`);
    }
  }, []);
  return null;
}
