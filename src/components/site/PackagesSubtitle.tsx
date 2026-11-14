"use client";

import { useMemo } from "react";
import { useLang } from "@/components/layout/LanguageProvider";
import { parsePlans, PACKAGES_CONFIG_KEY } from "@/lib/packages";
import { useSiteSettingValue } from "@/lib/useSiteSetting";

export default function PackagesSubtitle() {
  const { t } = useLang();
  const raw = useSiteSettingValue(PACKAGES_CONFIG_KEY);
  const count = useMemo(
    () => parsePlans(raw).filter((p) => p.enabled !== false).length,
    [raw]
  );

  if (count === 0) {
    return (
      <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-white/80">
        {t("Naye plans jald aa rahe hain — thori der baad dobara check karein.")}{" "}
        <span dir="rtl">نئے پلانز جلد آ رہے ہیں — تھوڑی دیر بعد دوبارہ دیکھیں۔</span>
      </p>
    );
  }

  return (
    <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-white/80">
      {t(
        `Aasan ${count} plans, saaf-suthra payment — koi hidden charges nahi. Jo plan aap ka kaam poori kare, wahi chunein! 😊`
      )}
    </p>
  );
}
