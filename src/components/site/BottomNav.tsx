"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Heart, Home, Search, User } from "lucide-react";
import { useLang } from "@/components/layout/LanguageProvider";

const ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Building2, label: "Projects", href: "/projects/" },
  { icon: Search, label: "Search", href: "/listings/" },
  { icon: Heart, label: "Favorites", href: "/my-account/?tab=saved" },
  { icon: User, label: "Profile", href: "/profile/" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-white/95 backdrop-blur sm:hidden">
      {ITEMS.map((item) => {
        const path = item.href.split("?")[0];
        const active = path === "/" ? pathname === "/" : pathname.startsWith(path);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-bold transition-colors ${
              active ? "text-green" : "text-muted hover:text-ink"
            }`}
          >
            <item.icon size={20} strokeWidth={active ? 2.4 : 1.8} />
            {t(item.label)}
          </Link>
        );
      })}
    </nav>
  );
}
