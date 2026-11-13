"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLang } from "@/components/layout/LanguageProvider";
import LiveDistrictCount from "@/components/site/LiveDistrictCount";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const SOCIAL_PATHS = [
  {
    href: "https://www.facebook.com/share/1JrkWATKhF/",
    label: "Facebook",
    d: "M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V11H8v3h2v7h3v-7h2.2l.5-3H13v-1.2c0-.5.2-.8.5-.8z",
  },
  {
    href: "https://www.tiktok.com/@bdp.com.pk?_r=1&_t=ZS-9BMPoQHO0Sk",
    label: "TikTok",
    d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.31 0 .6.05.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z",
  },
];

const COLS = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Buy", href: "/listings/" },
      { label: "Rent", href: "/listings/?purpose=rent" },
      { label: "Sell", href: "/sell/" },
      { label: "Property Schemes", href: "/schemes/" },
      { label: "Agents", href: "/agents/" },
      { label: "Packages & Pricing", href: "/packages/" },
      { label: "Home Loan Calculator", href: "/tools/home-loan-calculator/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Areas & Locations", href: "/areas/" },
      { label: "Property Guides", href: "/guides/" },
      { label: "Blog", href: "/blog/" },
      { label: "Land Records", href: "/tools/land-records/" },
      { label: "Contact Us", href: "/contact/" },
    ],
  },
  {
    title: "Our Coverage",
    links: [
      { label: "All Districts (40)", href: "/areas/" },
      { label: "Quetta", href: "/listings/?district=Quetta" },
      { label: "Gwadar", href: "/listings/?district=Gwadar" },
      { label: "Turbat", href: "/listings/?district=Turbat" },
      { label: "Khuzdar", href: "/listings/?district=Khuzdar" },
      { label: "View All Districts →", href: "/areas/" },
    ],
  },
];

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-auto bg-navy-deep text-white">
      <div className="wrap py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white px-1.5 py-1">
                <img
                  src={`${basePath}/logo.png`}
                  alt="BDP.com — Balochistan Property Portal logo"
                  className="h-full w-auto"
                />
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-extrabold">bdp.com.pk</span>
                <span className="text-[10.5px] text-white/50">{t("Your Trusted Property Marketplace")}</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/60">
              {t("Pakistan's most trusted property portal for buying, renting and selling properties across all districts of Balochistan.")}
            </p>

            <div className="mt-4 space-y-2 text-[13px] text-white/60">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-green" />
                <span>{t("Jinnah Town, Quetta, Balochistan")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-green" />
                <a href="tel:+923047974497" className="hover:text-green">0304 7974497</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-green" />
                <a href="mailto:bdpcompk@gmail.com" className="hover:text-green">bdpcompk@gmail.com</a>
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              {SOCIAL_PATHS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-green hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={s.d} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold">{t(col.title)}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-white/60 transition-colors hover:text-green"
                    >
                      {l.label.startsWith("All Districts (") ? (
                        <>{t("All Districts")} (<LiveDistrictCount />)</>
                      ) : l.label.endsWith("→") ? (
                        `${t(l.label.slice(0, -2).trim())} →`
                      ) : (
                        t(l.label)
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-sm font-bold">{t("Get In Touch")}</h4>
            <p className="text-[13px] leading-relaxed text-white/60">
              {t("Have a question or want to list your property? Reach out to us directly.")}
            </p>
            <a href="tel:+923047974497" className="btn-primary mt-4 inline-flex text-[13px]">
              <Phone size={14} /> {t("Call Now")}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12.5px] text-white/50 md:flex-row">
          <span>© 2026 bdp.com.pk. {t("All rights reserved.")}</span>
          <div className="flex gap-5">
            <Link href="/terms/" className="hover:text-white">{t("Terms & Conditions")}</Link>
            <Link href="/privacy/" className="hover:text-white">{t("Privacy Policy")}</Link>
            <Link href="/about/" className="hover:text-white">{t("About Us")}</Link>
          </div>
          <span className="text-green/80">{t("Together for a Stronger Balochistan")}</span>
        </div>
      </div>
    </footer>
  );
}
