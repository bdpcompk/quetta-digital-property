"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, ChevronDown, User, Users } from "lucide-react";

const OPTIONS = [
  {
    label: "I am a Common Citizen",
    desc: "Post your own property for sale or rent",
    href: "/sell/",
    icon: User,
  },
  {
    label: "I am an Agent",
    desc: "List properties for your clients",
    href: "/agents/join/",
    icon: Users,
  },
  {
    label: "I am a Scheme Owner",
    desc: "Add or manage a housing scheme",
    href: "/schemes/add/",
    icon: Building2,
  },
];

export default function PostDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="hidden whitespace-nowrap rounded-lg bg-green px-3 py-1.5 text-[15px] font-semibold text-white transition-all hover:bg-green-dark sm:flex sm:items-center sm:gap-1.5"
      >
        Post Your Property <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-[280px] rounded-xl border border-line bg-white p-2 shadow-[0_20px_50px_rgba(13,31,51,.28)]">
          {OPTIONS.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface"
            >
              <o.icon size={18} className="mt-0.5 shrink-0 text-green" />
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold text-ink">{o.label}</span>
                <span className="block text-[11.5px] text-muted">{o.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
