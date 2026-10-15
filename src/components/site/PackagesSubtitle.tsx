"use client";

import { useLang } from "@/components/layout/LanguageProvider";

export default function PackagesSubtitle() {
  const { t } = useLang();
  return (
    <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-white/80">
      {t("Aasan 3 plans, saaf-suthra payment — koi hidden charges nahi. Jo plan aap ka kaam poori kare, wahi chunein! 😊")}
    </p>
  );
}
