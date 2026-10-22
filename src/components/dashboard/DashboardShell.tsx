"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, X, type LucideIcon } from "lucide-react";

export type DashNavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
};

export default function DashboardShell({
  title,
  subtitle,
  roleLabel,
  name,
  initials,
  nav,
  onLogout,
  children,
}: {
  title: string;
  subtitle: string;
  roleLabel: string;
  name: string;
  initials: string;
  nav: DashNavItem[];
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="min-h-screen bg-surface lg:ps-[232px]">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-navy-deep/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 z-50 flex w-[232px] flex-col bg-navy-deep text-white transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center gap-2.5 px-4 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <img
              src={`${basePath}/logo.png`}
              alt="BDP"
              className="h-10 w-10 shrink-0 rounded-lg bg-white object-contain p-1"
            />
            <span className="min-w-0 leading-tight">
              <span className="block text-[17px] font-extrabold">BDP</span>
              <span className="block truncate text-[9.5px] font-medium text-white/55">
                Balochistan Digital Property
              </span>
            </span>
          </Link>
          <button
            type="button"
            className="ms-auto rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-1 flex-1 space-y-0.5 overflow-y-auto px-2.5 pb-4">
          {nav.map((item) => {
            const active = item.label === "Dashboard";
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold transition-colors ${
                  active
                    ? "bg-green text-white shadow-[0_4px_14px_rgba(26,135,84,.35)]"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={17} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9.5px] font-extrabold leading-none text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-2.5">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur lg:px-7">
          <button
            type="button"
            className="rounded-lg p-2 text-navy transition-colors hover:bg-surface lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="ms-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative rounded-lg p-2 text-navy transition-colors hover:bg-surface"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <Link
              href="/profile/"
              className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-2.5 py-1.5 transition-colors hover:bg-surface"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-soft text-[11px] font-extrabold text-green">
                {initials}
              </span>
              <span className="hidden text-start sm:block">
                <span className="block max-w-[150px] truncate text-[12.5px] font-extrabold text-navy">
                  {name}
                </span>
                <span className="block text-[10.5px] font-medium text-muted">{roleLabel}</span>
              </span>
              <ChevronDown size={14} className="text-muted" />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px] px-4 py-6 lg:px-7">
          <h1 className="text-[25px] font-extrabold leading-tight text-navy sm:text-[28px]">
            {title}
          </h1>
          <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>
          <div className="mt-5 space-y-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
