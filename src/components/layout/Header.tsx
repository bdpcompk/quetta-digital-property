"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Calculator,
  ChevronDown,
  FileText,
  HardHat,
  Menu,
  Ruler,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import { supabase } from "@/lib/supabase";
import PostDropdown from "@/components/layout/PostDropdown";
import type { LucideIcon } from "lucide-react";

type NavItem = { label: string; href: string; badge?: string; tools?: boolean };
type ToolItem = { label: string; desc: string; href: string; icon: LucideIcon; gated?: boolean };

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Buy", href: "/listings/" },
  { label: "Rent", href: "/listings/?purpose=rent" },
  { label: "Sell", href: "/sell/" },
  { label: "Schemes", href: "/schemes/" },
  { label: "Agents", href: "/agents/" },
  { label: "Tools", href: "/tools/", tools: true },
  { label: "Areas", href: "/areas/" },
  { label: "Guides", href: "/guides/" },
  { label: "Contact", href: "/contact/" },
];

const TOOLS: ToolItem[] = [
  { label: "Home Loan Calculator", desc: "Estimate your monthly installments", href: "/tools/home-loan-calculator/", icon: Calculator },
  { label: "Area Unit Calculator", desc: "Marla, Kanal, Acre & Sq Ft converter", href: "/tools/area-unit-converter/", icon: Ruler },
  { label: "Land Record Pages", desc: "Verified land record information", href: "/tools/land-records/", icon: FileText, gated: true },
  { label: "Construction Cost Calculator", desc: "Estimate your construction cost", href: "/tools/construction-cost-calculator/", icon: HardHat },
  { label: "Trends & Index", desc: "Track Balochistan property prices", href: "/tools/trends-and-index/", icon: TrendingUp },
];
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready, name, supabase } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [landRecords, setLandRecords] = useState(true);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("app_settings")
      .select("value")
      .eq("key", "land_records_enabled")
      .maybeSingle()
      .then(({ data }) => {
        if (data) setLandRecords(data.value === "on");
      });
  }, []);

  const signOut = async () => {
    setOpen(false);
    await supabase?.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const matchesPath = (href: string) => {
    const p = href.split("?")[0];
    return p === "/" ? pathname === "/" : pathname.startsWith(p);
  };
  const activeIdx = NAV.findIndex((it) => matchesPath(it.href));
  const isActive = (item: (typeof NAV)[number]) => NAV.indexOf(item) === activeIdx;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy shadow-[0_6px_24px_rgba(13,31,51,.25)]"
            : "bg-navy/95 backdrop-blur-sm"
        }`}
        style={{ transform: scrolled ? "translateY(0)" : "translateY(0)" }}
      >
        <div className="wrap flex h-16 items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-2.5">
            <span className="flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white px-1.5 py-1 shadow-[0_2px_10px_rgba(0,0,0,.25)]">
              <img
                src={`${basePath}/logo.png`}
                alt="BDP.com — Balochistan Property Portal logo"
                className="h-full w-auto"
              />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[18px] font-extrabold text-white">
                bdp.com.pk
              </span>
              <span className="hidden truncate text-[12px] text-white/55 sm:block">
                Balochistan&apos;s Trusted Property Marketplace
              </span>
            </span>
          </Link>

          <nav className="hidden min-w-0 items-center gap-0 xl:flex">
            {NAV.map((item) => {
              if (item.tools) {
                const active = pathname.startsWith("/tools/");
                return (
                  <div key="tools" className="group relative">
                    <button
                      className={`relative flex items-center gap-0.5 whitespace-nowrap rounded-md px-1 py-2 text-[14px] font-medium transition-colors ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/75 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      Tools <ChevronDown size={12} className="transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="invisible absolute left-0 top-full z-50 w-[310px] translate-y-1 opacity-0 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="mt-1.5 rounded-xl border border-line bg-white p-2 shadow-[0_20px_50px_rgba(13,31,51,.28)]">
                        {TOOLS.filter((t) => !t.gated || landRecords).map((t) => (
                          <Link
                            key={t.href}
                            href={t.href}
                            className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface"
                          >
                            <t.icon size={16} className="mt-0.5 shrink-0 text-green" />
                            <span className="min-w-0">
                              <span className="block text-[13.5px] font-semibold text-ink">{t.label}</span>
                              <span className="block text-[11px] text-muted">{t.desc}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative whitespace-nowrap rounded-md px-1 py-2 text-[14px] font-medium transition-colors ${
                    isActive(item)
                      ? "bg-white/10 text-white"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1 py-px text-[8.5px] font-bold text-navy">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {ready && session ? (
              <>
                <PostDropdown />
                <Link
                  href="/my-account/"
                  className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[14px] font-bold text-white transition-colors hover:bg-white hover:text-navy sm:flex"
                  title={name}
                  aria-label={name}
                >
                  {(name || "U").charAt(0).toUpperCase()}
                </Link>                <button
                  onClick={signOut}
                  className="hidden rounded-lg px-2.5 py-1.5 text-[14px] font-semibold text-white/80 transition-colors hover:text-white sm:block"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <PostDropdown />
                <Link
                  href="/login/"
                  className="hidden whitespace-nowrap rounded-lg border border-white/30 px-3 py-1.5 text-[14px] font-semibold text-white transition-all hover:bg-white hover:text-navy sm:block"
                >
                  Login
                </Link>
                <Link
                  href="/signup/"
                  className="hidden whitespace-nowrap rounded-lg bg-green px-3 py-1.5 text-[14px] font-semibold text-white transition-all hover:bg-green-dark sm:block"
                >
                  Sign Up
                </Link>
              </>
            )}
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 xl:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-full w-[300px] max-w-[85vw] flex-col bg-navy-deep"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="text-sm font-bold text-white">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-3">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.035 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] transition-colors ${
                        isActive(item)
                          ? "bg-green/15 font-semibold text-green"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.label}
                      {item.badge && (
                        <span className="rounded-full bg-amber-400 px-1.5 py-px text-[9px] font-bold text-navy">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-2 border-t border-white/10 pt-2">
                  <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
                    Tools
                  </p>
                  {TOOLS.filter((t) => !t.gated || landRecords).map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] transition-colors ${
                        pathname.startsWith("/tools/")
                          ? "font-semibold text-green"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <t.icon size={16} className="shrink-0 opacity-70" />
                      {t.label}
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="border-t border-white/10 p-4">
                <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wide text-white/50">Post Your Property</p>
                <div className="space-y-2">
                  <Link
                    href="/sell/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg bg-green px-3 py-2.5 text-[13.5px] font-semibold text-white"
                  >
                    <User size={16} className="shrink-0" />
                    I am a Common Citizen
                  </Link>
                  <Link
                    href="/agents/join/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg border border-white/25 px-3 py-2.5 text-[13.5px] font-semibold text-white"
                  >
                    <Users size={16} className="shrink-0" />
                    I am an Agent
                  </Link>
                  <Link
                    href="/schemes/add/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg border border-white/25 px-3 py-2.5 text-[13.5px] font-semibold text-white"
                  >
                    <Building2 size={16} className="shrink-0" />
                    I am a Scheme Owner
                  </Link>
                </div>
                {ready && session ? (
                  <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                    <Link
                      href="/my-account/"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg border border-white/30 py-2 text-center text-[13.5px] font-semibold text-white"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={signOut}
                      className="rounded-lg px-3 py-2 text-[13.5px] font-semibold text-white/80 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                    <Link
                      href="/login/"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg border border-white/30 py-2 text-center text-[13.5px] font-semibold text-white"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup/"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg bg-green py-2 text-center text-[13.5px] font-semibold text-white"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
