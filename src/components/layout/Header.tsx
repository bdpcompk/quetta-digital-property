"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSession } from "@/lib/useSession";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Buy", href: "/listings/" },
  { label: "Rent", href: "/listings/?purpose=rent" },
  { label: "Sell", href: "/sell/" },
  { label: "Schemes", href: "/schemes/" },
  { label: "Agents", href: "/agents/" },
  { label: "QDA Schemes", href: "/qda/", badge: "New" },
  { label: "New Projects", href: "/projects/" },
  { label: "Areas", href: "/areas/" },
  { label: "Guides", href: "/guides/" },
  { label: "Contact", href: "/contact/" },
];
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready, name, supabase } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <Link href="/" className="group flex min-w-0 items-center gap-2.5">
            <span className="flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white px-1.5 py-1 shadow-[0_2px_10px_rgba(0,0,0,.25)]">
              <img
                src={`${basePath}/logo.png`}
                alt="BDP.com — Balochistan Property Portal logo"
                className="h-full w-auto"
              />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[15px] font-extrabold text-white">
                bdp.com
              </span>
              <span className="hidden truncate text-[10.5px] text-white/55 sm:block">
                Balochistan&apos;s Trusted Property Marketplace
              </span>
            </span>
          </Link>

          <nav className="hidden min-w-0 items-center gap-0 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative whitespace-nowrap rounded-md px-2 py-2 text-[13px] font-medium transition-colors ${
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
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {ready && session ? (
              <>
                <Link
                  href="/sell/"
                  className="hidden rounded-lg bg-green px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-green-dark sm:block"
                >
                  + Post Property
                </Link>
                <Link
                  href="/my-account/"
                  className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[13px] font-bold text-white transition-colors hover:bg-white hover:text-navy sm:flex"
                  title={name}
                  aria-label={name}
                >
                  {(name || "U").charAt(0).toUpperCase()}
                </Link>
                <button
                  onClick={signOut}
                  className="hidden rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-white/80 transition-colors hover:text-white sm:block"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login/"
                  className="hidden rounded-lg border border-white/30 px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-white hover:text-navy sm:block"
                >
                  Login
                </Link>
                <Link
                  href="/signup/"
                  className="hidden rounded-lg bg-green px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-green-dark sm:block"
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
              </nav>
              <div className="flex gap-2 border-t border-white/10 p-4">
                {ready && session ? (
                  <>
                    <Link
                      href="/sell/"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg bg-green py-2 text-center text-[13px] font-semibold text-white"
                    >
                      Post Property
                    </Link>
                    <Link
                      href="/my-account/"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg border border-white/30 py-2 text-center text-[13px] font-semibold text-white"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={signOut}
                      className="rounded-lg px-3 py-2 text-[13px] font-semibold text-white/80 hover:text-white"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login/"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg border border-white/30 py-2 text-center text-[13px] font-semibold text-white"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup/"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg bg-green py-2 text-center text-[13px] font-semibold text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
