"use client";

import Link from "next/link";
import { Apple, Play } from "lucide-react";
import { useLang } from "@/components/layout/LanguageProvider";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function AppPromoSection() {
  const { t } = useLang();

  const NAV_ITEMS: { label: string; active?: boolean }[] = [
    { label: "Home", active: true },
    { label: "Projects" },
    { label: "Search" },
    { label: "Favorites" },
    { label: "Profile" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#07131f] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-green/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="wrap relative py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

          {/* Left: heading + subtext */}
          <div className="flex-1 max-w-[520px]">
            <Link href="/" className="flex w-fit items-center gap-2 mb-6">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-lg shadow-black/30">
                <img src={`${basePath}/logo.png`} alt="BDP.com logo" className="h-full w-auto" />
              </span>
              <span className="text-[16px] font-extrabold leading-none">bdp.com.pk</span>
            </Link>

            <h2 className="text-[32px] font-black leading-[1.05] tracking-tight sm:text-[40px]">
              <span className="block text-white">{t("Get the BDP App")}</span>
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/80 sm:text-[17px]">
              {t("Buy and Rent Property faster and better using our app.")}
            </p>
          </div>

          {/* Right: phone mockup + store buttons + QR */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 w-full lg:w-auto max-w-xs lg:max-w-none">

            {/* Phone mockup */}
            <div className="relative mx-auto">
              <div className="absolute -inset-1.5 rounded-[3rem] bg-green/20 blur-2xl" />
              <div className="relative rounded-[2.75rem] border border-[#0a0f18] bg-[#0a0f18] shadow-[0_30px_80px_rgba(0,0,0,.6)] overflow-hidden">
                <div className="h-6 bg-[#0a0f18]" />
                <div className="px-3 pt-3 pb-1">
                  <div className="flex items-center justify-between text-[7px] font-extrabold text-navy">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 flex items-center gap-0.5">
                        <span className="w-2 h-1 rounded-full bg-slate-400" />
                        <span className="w-2 h-1 rounded-full bg-slate-400" />
                        <span className="w-2 h-1 rounded-full bg-slate-400" />
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <img src={`${basePath}/logo.png`} alt="" className="h-5 w-5 object-contain" />
                    <div className="leading-none">
                      <p className="text-[6px] font-black tracking-tight text-green">BDP.COM</p>
                      <p className="mt-0.5 text-[4px] font-medium text-slate-400">Property Marketplace</p>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="text-[5px]">🔔</span>
                      <span className="text-[5px]">≡</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex rounded-full bg-white p-0.5">
                    {["BUY", "RENT", "SELL"].map((tab, i) => (
                      <span
                        key={tab}
                        className={`flex-1 rounded-full py-0.5 text-[5.5px] font-extrabold tracking-wide ${
                          i === 0 ? "bg-green text-white" : "text-slate-500"
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between px-1">
                    <p className="text-[5.5px] font-extrabold text-navy">{t("Listing Rents")}</p>
                    <p className="text-[4px] font-semibold text-green">{t("See All")}</p>
                  </div>
                  <div className="mt-1.5 grid grid-cols-2 gap-1">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                      <div className="relative h-[44px]">
                        <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=160&q=60" className="h-full w-full object-cover" alt="" />
                      </div>
                      <div className="p-1">
                        <p className="text-[5px] font-extrabold text-navy">Houses</p>
                        <p className="text-[4px] text-slate-500">3 Beds · Quetta</p>
                        <p className="text-[5px] font-extrabold text-green">$190,000</p>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                      <div className="relative h-[44px]">
                        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=160&q=60" className="h-full w-full object-cover" alt="" />
                      </div>
                      <div className="p-1">
                        <p className="text-[5px] font-extrabold text-navy">Apartments</p>
                        <p className="text-[4px] text-slate-500">2 Beds · Quetta</p>
                        <p className="text-[5px] font-extrabold text-green">$309,000</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 rounded-lg bg-white p-0.5 shadow-sm">
                    <span className="flex-1 px-1 text-[5px] text-slate-400">{t("Search map search")}</span>
                    <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-green text-white">
                      <span className="text-[4px]">🔍</span>
                    </span>
                  </div>
                  <div className="relative mt-2 h-[60px] overflow-hidden rounded-lg">
                    <img
                      src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/12/1687/2809"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white drop-shadow-lg">
                        <span className="text-[8px] text-green">📍</span>
                      </span>
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between rounded-t-lg bg-white px-1.5 py-1 shadow-[0_-2px_8px_rgba(15,31,51,.05)]">
                    {NAV_ITEMS.map((item) => (
                      <span
                        key={item.label}
                        className={`flex flex-col items-center gap-0.5 ${item.active ? "text-green" : "text-slate-400"}`}
                      >
                        <span className="text-[4.5px] font-semibold">{item.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/20 bg-white/10 px-2.5 py-1 text-[8px] font-bold text-white shadow-lg backdrop-blur">
                <span className="flex items-center gap-0.5">
                  <span className="text-[7px] text-green">📍</span> All 40 Districts
                </span>
              </span>
            </div>

            {/* Store buttons + QR code */}
            <div className="flex flex-col items-center gap-3 text-center sm:text-left">
              <div className="flex gap-3 sm:gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black px-3.5 py-2 shadow-lg shadow-black/25"
                >
                  <Apple size={19} className="shrink-0" />
                  <span className="text-left leading-tight">
                    <span className="block text-[7px] uppercase tracking-wide text-white/70">{t("Download on the")}</span>
                    <span className="block text-[12px] font-bold">App Store</span>
                  </span>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black px-3.5 py-2 shadow-lg shadow-black/25"
                >
                  <Play size={16} className="shrink-0 fill-white text-white" />
                  <span className="text-left leading-tight">
                    <span className="block text-[7px] uppercase tracking-wide text-white/70">{t("GET IT ON")}</span>
                    <span className="block text-[12px] font-bold">Google Play</span>
                  </span>
                </a>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-[11px] font-bold text-white/90">{t("Scan the QR code to get the app")}</p>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=0&data=https://bdpcompk.github.io/quetta-digital-property/"
                  alt="QR code"
                  className="w-20 h-20 rounded-sm shadow-md"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <a
            href="https://www.bdp.com.pk"
            className="flex items-center gap-1.5 text-[12px] font-semibold text-white/75 transition-colors hover:text-green"
          >
            <span className="text-green">🌐</span> www.bdp.com.pk
          </a>
          <a
            href="tel:+923047974497"
            className="flex items-center gap-1.5 text-[12px] font-semibold text-white/75 transition-colors hover:text-green"
          >
            <span className="text-green">📞</span> 0304 7974497
          </a>
        </div>
      </div>
    </section>
  );
}
