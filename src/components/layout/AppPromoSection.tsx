"use client";

import Link from "next/link";
import {
  Apple, BatteryFull, Bell, Building2, Globe, Heart, Home, KeyRound, MapPin, Menu,
  Phone, Play, Search, Signal, User, Wifi,
} from "lucide-react";
import { useLang } from "@/components/layout/LanguageProvider";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const APP_CARDS = [
  {
    title: "Houses",
    meta: "3 Beds · Quetta",
    price: "$190,000",
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=320&q=70",
  },
  {
    title: "Apartments",
    meta: "2 Beds · Quetta",
    price: "$309,000",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=320&q=70",
  },
];

/** Big mobile-app promo shown directly above the footer on every page. */
export default function AppPromoSection() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-[#07131f] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 85% 18%, rgba(26,135,84,.42), transparent 55%), radial-gradient(ellipse at 8% 82%, rgba(26,135,84,.28), transparent 50%), linear-gradient(160deg,#07131f 0%,#0b2236 45%,#0a3b2a 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-green/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="wrap relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-[1.02fr_.98fr]">
          <div>
            <Link href="/" className="flex w-fit items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-lg shadow-black/30">
                <img src={`${basePath}/logo.png`} alt="BDP.com logo" className="h-full w-auto" />
              </span>
              <span className="leading-tight">
                <span className="block text-[18px] font-extrabold">bdp.com.pk</span>
                <span className="text-[11px] text-white/60">{t("Your Trusted Property Marketplace")}</span>
              </span>
            </Link>

            <span className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#07131f] shadow-lg shadow-orange-500/25">
              {t("Launching Soon")}
            </span>

            <h2 className="mt-4 text-[34px] font-black leading-[0.95] tracking-tight sm:text-[44px] lg:text-[52px]">
              <span className="block text-white">{t("Mobile App")}</span>
              <span className="block text-[#f5b940]">{t("Coming")}</span>
              <span className="block text-[#42bc79]">{t("Soon!")}</span>
            </h2>

            <p className="mt-4 max-w-xl text-[17px] font-extrabold leading-tight sm:text-[20px]">
              {t("Buy, Sell & Rent Properties on the Go!")}
            </p>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-white/65">
              {t("Pakistan's trusted property portal is coming to Android and iOS.")}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2.5 rounded-xl border border-white/25 bg-black px-4 py-2.5 shadow-lg shadow-black/25">
                <Apple size={23} className="shrink-0" />
                <span className="text-left leading-tight">
                  <span className="block text-[8.5px] uppercase tracking-wide text-white/70">
                    {t("Download on the")}
                  </span>
                  <span className="block text-[15px] font-bold">App Store</span>
                </span>
              </span>
              <span className="inline-flex items-center gap-2.5 rounded-xl border border-white/25 bg-black px-4 py-2.5 shadow-lg shadow-black/25">
                <Play size={20} className="shrink-0 fill-white text-white" />
                <span className="text-left leading-tight">
                  <span className="block text-[8.5px] uppercase tracking-wide text-white/70">{t("GET IT ON")}</span>
                  <span className="block text-[15px] font-bold">Google Play</span>
                </span>
              </span>
              <span className="hidden rounded-lg bg-green px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-green/25 sm:inline-flex">
                {t("Coming Soon")}
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-[252px] sm:w-[298px] lg:w-[272px] lg:ml-auto">
            <div className="absolute -inset-10 rounded-full bg-green/20 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -inset-7 rounded-[3.5rem] border border-white/10" aria-hidden />
            <div className="pointer-events-none absolute -inset-16 rounded-full border border-white/[0.06]" aria-hidden />

            <MapPin className="absolute -left-8 top-16 h-7 w-7 -rotate-12 text-emerald-300/80" strokeWidth={2.5} />
            <MapPin className="absolute -right-5 top-36 h-4 w-4 text-cyan-300/70" strokeWidth={2.5} />
            <KeyRound className="absolute -right-7 bottom-28 h-6 w-6 rotate-12 text-amber-300" />
            <div className="relative">
              <div className="rounded-[2.9rem] border-[9px] border-[#0a0f18] bg-[#0a0f18] shadow-[0_35px_90px_rgba(0,0,0,.6)]">
                <div className="relative overflow-hidden rounded-[2.25rem] bg-[#eef2ee]">
                  <div className="absolute left-1/2 top-2.5 z-20 h-[20px] w-[92px] -translate-x-1/2 rounded-full bg-[#0a0f18]" />
                  <div className="px-3 pb-0 pt-8">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[8px] font-extrabold text-navy">9:41</span>
                      <span className="flex items-center gap-1 text-navy">
                        <Signal size={8} />
                        <Wifi size={8} />
                        <BatteryFull size={9} />
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img src={`${basePath}/logo.png`} alt="" className="h-7 w-7 object-contain" />
                        <div className="leading-none">
                          <p className="text-[8px] font-black tracking-tight text-green">BDP.COM</p>
                          <p className="mt-0.5 text-[5.5px] font-medium text-slate-400">Property Marketplace</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Bell size={10} />
                        <Menu size={11} />
                      </div>
                    </div>

                    <div className="mt-3 flex rounded-full bg-white p-1 shadow-[0_2px_8px_rgba(15,31,51,.08)]">
                      {["BUY", "SELL", "RENT"].map((tab, i) => (
                        <span
                          key={tab}
                          className={`flex-1 rounded-full py-1.5 text-center text-[6.5px] font-extrabold tracking-wide ${
                            i === 0 ? "bg-green text-white" : "text-slate-500"
                          }`}
                        >
                          {tab}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-[8px] font-extrabold text-navy">{t("Listing Rents")}</p>
                      <p className="text-[6px] font-semibold text-green">{t("See All")}</p>
                    </div>

                    <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                      {APP_CARDS.map((card) => (
                        <div key={card.title} className="overflow-hidden rounded-lg bg-white shadow-[0_2px_6px_rgba(15,31,51,.08)]">
                          <div className="relative h-[52px] w-full">
                            <img src={card.img} alt="" className="h-full w-full object-cover" />
                            <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/90">
                              <Heart size={6} className="text-slate-500" />
                            </span>
                          </div>
                          <div className="p-1.5">
                            <p className="text-[6.5px] font-extrabold text-navy">{t(card.title)}</p>
                            <p className="mt-0.5 text-[5.5px] text-slate-500">{card.meta}</p>
                            <p className="mt-0.5 text-[6.5px] font-extrabold text-green">{card.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center gap-1 rounded-lg bg-white p-1 shadow-[0_2px_6px_rgba(15,31,51,.08)]">
                      <span className="flex-1 px-1 text-[6.5px] text-slate-400">{t("Search map search")}</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-green text-white">
                        <Search size={8} />
                      </span>
                    </div>

                    <div className="relative mt-2 h-[86px] overflow-hidden rounded-lg">
                      <img
                        src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/12/1687/2809"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <MapPin size={16} className="fill-green text-green drop-shadow" />
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between rounded-t-lg bg-white px-2 py-1.5 shadow-[0_-2px_8px_rgba(15,31,51,.05)]">
                      {[
                        { Icon: Home, label: "Home", active: true },
                        { Icon: Building2, label: "Projects" },
                        { Icon: Search, label: "Search" },
                        { Icon: Heart, label: "Favorites" },
                        { Icon: User, label: "Profile" },
                      ].map(({ Icon, label, active }) => (
                        <span
                          key={label}
                          className={`flex flex-col items-center gap-0.5 ${active ? "text-green" : "text-slate-400"}`}
                        >
                          <Icon size={9} />
                          <span className="text-[5px] font-semibold">{label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-bold text-white shadow-lg backdrop-blur">
              <span className="flex items-center gap-1">
                <MapPin size={10} className="text-green" /> All 40 Districts
              </span>
            </span>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <a
            href="https://www.bdp.com.pk"
            className="flex items-center gap-2 text-[13px] font-semibold text-white/75 transition-colors hover:text-green"
          >
            <Globe size={16} className="text-green" /> www.bdp.com.pk
          </a>
          <a
            href="tel:+923047974497"
            className="flex items-center gap-2 text-[13px] font-semibold text-white/75 transition-colors hover:text-green"
          >
            <Phone size={16} className="text-green" /> 0304 7974497
          </a>
        </div>
      </div>
    </section>
  );
}
