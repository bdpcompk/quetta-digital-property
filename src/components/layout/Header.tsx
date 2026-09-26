"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Menu, X } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Buy", href: "/listings/" },
  { label: "Rent", href: "/listings/?purpose=rent" },
  { label: "Sell", href: "/sell/" },
  { label: "Agents", href: "/agents/" },
  { label: "QDA Approved Schemes", href: "/qda/", badge: "New" },
  { label: "New Projects", href: "/projects/" },
  { label: "Areas", href: "/areas/" },
  { label: "Guides", href: "/guides/" },
  { label: "Contact", href: "/contact/" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green text-white transition-transform duration-300 group-hover:rotate-[-8deg]">
              <Building2 size={19} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[15px] font-extrabold text-white">
                Balochistan Property Portal
              </span>
              <span className="hidden truncate text-[10.5px] text-white/55 sm:block">
                Balochistan&apos;s Trusted Property Marketplace
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors ${
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
            <button className="hidden rounded-lg border border-white/30 px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-white hover:text-navy sm:block">
              Login
            </button>
            <button className="hidden rounded-lg bg-green px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-green-dark sm:block">
              Sign Up
            </button>
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
                <button className="flex-1 rounded-lg border border-white/30 py-2 text-[13px] font-semibold text-white">
                  Login
                </button>
                <button className="flex-1 rounded-lg bg-green py-2 text-[13px] font-semibold text-white">
                  Sign Up
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
