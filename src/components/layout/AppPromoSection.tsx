"use client";

import { Apple, Play } from "lucide-react";
import { useLang } from "@/components/layout/LanguageProvider";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const NAV_ITEMS: { label: string; active?: boolean }[] = [
  { label: "Home", active: true },
  { label: "Search" },
  { label: "Saved" },
  { label: "Profile" },
];

export default function AppPromoSection() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-[#f6faf7]">
      {/* soft white → green wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#ffffff_0%,#f5fbf7_55%,#eaf6ee_100%)]" />

      {/* faint heritage / landmark silhouette */}
      <svg
        aria-hidden
        viewBox="0 0 900 240"
        preserveAspectRatio="xMaxYMax meet"
        className="pointer-events-none absolute bottom-0 right-0 h-[88%] w-[82%] text-[#0f6b3f] opacity-[0.07]"
      >
        <g fill="currentColor">
          <rect x="0" y="150" width="900" height="90" />
          {/* left tower */}
          <rect x="78" y="96" width="62" height="60" />
          <rect x="70" y="86" width="78" height="14" rx="3" />
          <path d="M90 86V70c0-11 9-20 20-20s20 9 20 20v16z" />
          <rect x="132" y="72" width="10" height="84" />
          <path d="M132 72l5-14 5 14z" />
          {/* main dome */}
          <path d="M330 150v-30c0-16 13-29 29-29h122c16 0 29 13 29 29v30z" />
          <ellipse cx="420" cy="91" rx="82" ry="42" />
          <rect x="414" y="26" width="12" height="26" rx="4" />
          <circle cx="420" cy="22" r="6" />
          {/* minarets */}
          <rect x="295" y="66" width="16" height="90" />
          <rect x="290" y="58" width="26" height="10" rx="3" />
          <path d="M303 58V46c0-7 5-12 12-12v24z" />
          <rect x="529" y="66" width="16" height="90" />
          <rect x="524" y="58" width="26" height="10" rx="3" />
          <path d="M537 58V46c0-7 5-12 12-12v24z" />
          {/* right wing */}
          <rect x="618" y="112" width="126" height="44" />
          <path d="M638 112V96c0-12 10-22 22-22h42c12 0 22 10 22 22v16z" />
          <rect x="700" y="58" width="10" height="54" />
          <path d="M700 58l5-14 5 14z" />
          {/* far right tower */}
          <rect x="800" y="58" width="72" height="98" />
          <path d="M796 58l40-34 40 34z" />
          <rect x="832" y="16" width="8" height="14" rx="3" />
        </g>
      </svg>

      <div className="wrap relative">
        <div className="grid items-center gap-6 py-7 sm:py-9 lg:grid-cols-[1fr_1.05fr_1fr] lg:gap-3 lg:py-8">
          {/* left copy */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-soft px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-green">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
              {t("Mobile App • Coming Soon")}
            </span>
            <h2 className="mt-2.5 text-[30px] font-black leading-[1.04] tracking-tight text-green sm:text-[36px] lg:text-[34px] xl:text-[38px]">
              {t("Get the BDP App")}
            </h2>
            <p className="mx-auto mt-2 max-w-[290px] text-[13.5px] font-medium leading-relaxed text-navy/75 sm:text-[14.5px] lg:mx-0">
              {t("Buy and Rent Property faster and better using our app.")}
            </p>
          </div>

          {/* phone mockup */}
          <div className="relative flex justify-center lg:-mb-12">
            <div className="relative w-[196px] rotate-[10deg] transition-transform duration-500 hover:rotate-[6deg] sm:w-[228px] lg:w-[242px]">
              <div className="absolute -inset-2 rounded-[3rem] bg-green/15 blur-xl" />
              <div className="relative overflow-hidden rounded-[2rem] border-[5px] border-[#0b1520] bg-[#0b1520] shadow-[0_24px_60px_rgba(15,31,51,.32)]">
                {/* app header */}
                <div className="bg-green px-2.5 pb-2.5 pt-1.5 text-white">
                  <div className="flex items-center justify-between text-[6px] font-bold text-white/85">
                    <span>9:41</span>
                    <span className="flex items-center gap-0.5">
                      <span className="h-1 w-2 rounded-sm bg-white/70" />
                      <span className="h-1 w-2 rounded-sm bg-white/70" />
                      <span className="h-1.5 w-2.5 rounded-sm bg-white/90" />
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1">
                    <img
                      src={`${basePath}/logo.png`}
                      alt=""
                      className="h-4 w-4 rounded bg-white object-contain p-0.5"
                    />
                    <div className="leading-none">
                      <p className="text-[6.5px] font-black tracking-tight">BDP.COM</p>
                      <p className="mt-0.5 text-[4px] font-medium text-white/70">
                        {t("Property Marketplace")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex rounded-full bg-white/15 p-0.5">
                    {["BUY", "RENT", "SELL"].map((tab, i) => (
                      <span
                        key={tab}
                        className={`flex-1 rounded-full py-0.5 text-center text-[5px] font-extrabold tracking-wide ${
                          i === 0 ? "bg-white text-green" : "text-white/85"
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 rounded-full bg-white px-1.5 py-1">
                    <span className="text-[5px] text-slate-400">{t("Search area or address")}</span>
                    <span className="ml-auto flex h-3 w-3 items-center justify-center rounded-full bg-green text-[4px] text-white">
                      ⌕
                    </span>
                  </div>
                </div>

                {/* app body */}
                <div className="bg-[#f7faf8] px-2 pb-2 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[6px] font-extrabold text-navy">{t("Popular Properties")}</p>
                    <p className="text-[5px] font-bold text-green">{t("See All")}</p>
                  </div>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                      <img
                        src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=180&q=60"
                        alt=""
                        className="h-10 w-full object-cover"
                      />
                      <div className="p-1">
                        <p className="text-[5px] font-extrabold text-navy">{t("Houses")}</p>
                        <p className="text-[4px] text-slate-500">3 Beds · Quetta</p>
                        <p className="text-[5px] font-extrabold text-green">PKR 1.9 Cr</p>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                      <img
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=180&q=60"
                        alt=""
                        className="h-10 w-full object-cover"
                      />
                      <div className="p-1">
                        <p className="text-[5px] font-extrabold text-navy">{t("Apartments")}</p>
                        <p className="text-[4px] text-slate-500">2 Beds · Quetta</p>
                        <p className="text-[5px] font-extrabold text-green">PKR 3.09 Cr</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between rounded-t-lg bg-white px-1.5 py-1 shadow-[0_-2px_8px_rgba(15,31,51,.05)]">
                    {NAV_ITEMS.map((item) => (
                      <span
                        key={item.label}
                        className={`text-[4.5px] font-semibold ${
                          item.active ? "text-green" : "text-slate-400"
                        }`}
                      >
                        {t(item.label)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* store badges + QR */}
          <div className="flex flex-col items-center gap-3 lg:items-end">
            <div className="flex flex-wrap justify-center gap-2.5">
              <button
                type="button"
                disabled
                title={t("Coming soon")}
                className="inline-flex cursor-default items-center gap-2 rounded-[9px] bg-black px-3 py-1.5 text-left text-white shadow-sm"
              >
                <Apple size={21} className="shrink-0" />
                <span className="leading-tight">
                  <span className="block text-[7px] uppercase tracking-wide text-white/70">
                    {t("Download on the")}
                  </span>
                  <span className="block text-[13px] font-bold">App Store</span>
                </span>
              </button>
              <button
                type="button"
                disabled
                title={t("Coming soon")}
                className="inline-flex cursor-default items-center gap-2 rounded-[9px] bg-black px-3 py-1.5 text-left text-white shadow-sm"
              >
                <Play size={18} className="shrink-0 fill-white text-white" />
                <span className="leading-tight">
                  <span className="block text-[7px] uppercase tracking-wide text-white/70">
                    {t("GET IT ON")}
                  </span>
                  <span className="block text-[13px] font-bold">Google Play</span>
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <p className="max-w-[125px] text-right text-[11.5px] font-semibold leading-snug text-navy/80">
                {t("Scan the QR code to get the app")}
              </p>
              <svg
                aria-hidden
                viewBox="0 0 44 34"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-10 shrink-0 text-green"
              >
                <path d="M4 5c11 2 19 9 22 21" />
                <path d="M19 20l7 7 6-6" />
              </svg>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=https://bdpcompk.github.io/quetta-digital-property/"
                alt="QR code"
                loading="lazy"
                decoding="async"
                className="h-[74px] w-[74px] rounded-md border border-line bg-white p-1 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
