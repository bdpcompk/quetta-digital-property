"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Heart, Home, Plus, Search, User } from "lucide-react";
import { useLang } from "@/components/layout/LanguageProvider";

const ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Building2, label: "Projects", href: "/projects/" },
  { icon: Search, label: "Search", href: "/listings/" },
  { icon: Plus, label: "Post", href: "/sell/", highlight: true },
  { icon: Heart, label: "Favorites", href: "/my-account/?tab=saved" },
  { icon: User, label: "Profile", href: "/profile/" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
      {ITEMS.map((item) => {
        const path = item.href.split("?")[0];
        const active = path === "/" ? pathname === "/" : pathname.startsWith(path);
        const highlight = "highlight" in item && item.highlight;
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            className={`flex flex-col items-center gap-1 py-2 text-[10px] font-bold transition-colors ${
              highlight
                ? "text-green"
                : active
                  ? "text-green"
                  : "text-muted hover:text-ink"
            }`}
          >
            {highlight ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green text-white shadow-[0_4px_12px_rgba(26,135,84,0.35)]">
                <item.icon size={16} strokeWidth={3} />
              </span>
            ) : (
              <item.icon size={20} strokeWidth={active ? 2.4 : 1.8} />
            )}
            <span className="leading-none">{t(item.label)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
