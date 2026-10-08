"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import {
  BarChart3, Bell, Building2, ChevronDown, CreditCard, FileText, FolderKanban, History,
  LayoutDashboard, LayoutGrid, LogOut, MapPin, Menu, MessageSquare, Package, Plus,
  Search, Settings, ShieldCheck, Star, Users, X, Loader2, AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type NavItem = { href?: string; label: string; Icon: React.ComponentType<{ size?: number; className?: string }>; children?: { href: string; label: string; Icon: NavItem["Icon"] }[] };

const NAV: NavItem[] = [
  { href: "/admin/", label: "Dashboard", Icon: LayoutDashboard },
  {
    label: "Properties", Icon: Building2,
    children: [
      { href: "/admin/properties/", label: "All Properties", Icon: Building2 },
      { href: "/admin/schemes/", label: "Schemes", Icon: LayoutGrid },
      { href: "/admin/qda/", label: "QDA Approved", Icon: ShieldCheck },
      { href: "/admin/projects/", label: "Projects", Icon: FolderKanban },
      { href: "/admin/history/", label: "Verification Log", Icon: History },
    ],
  },
  { href: "/admin/messages/", label: "Inquiries", Icon: MessageSquare },
  { href: "/admin/agents/", label: "Users & Agents", Icon: Users },
  { href: "/admin/packages/", label: "Packages & Pricing", Icon: Package },
  { href: "/admin/payments/", label: "Payments", Icon: CreditCard },
  { href: "/admin/featured/", label: "Featured Ads", Icon: Star },
  { href: "/admin/reports/", label: "Reports & Analytics", Icon: BarChart3 },
  { href: "/admin/districts/", label: "Locations", Icon: MapPin },
  { href: "/admin/articles/", label: "Pages", Icon: FileText },
  { href: "/admin/settings/", label: "Settings", Icon: Settings },
];

const PROPS_PREFIXES = ["/admin/properties", "/admin/schemes", "/admin/qda", "/admin/projects", "/admin/history"];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const cleanPath = (pathname || "").replace(/\/+$/, "");
  const isLogin = cleanPath.endsWith("/admin/login");
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [propsOpen, setPropsOpen] = useState(() =>
    PROPS_PREFIXES.some((p) => cleanPath.startsWith(p))
  );
  const [newInquiries, setNewInquiries] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!ready || isLogin) return;
    if (!supabase) return;
    if (!session) router.replace("/admin/login/");
  }, [ready, isLogin, session, router]);

  useEffect(() => {
    if (!session || !supabase) return;
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "New")
      .then(({ count }) => setNewInquiries(count ?? 0));
  }, [session]);

  if (isLogin) return <>{children}</>;

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6">
        <div className="max-w-md rounded-2xl border border-line bg-white p-6 text-center">
          <AlertTriangle size={28} className="mx-auto text-amber-500" />
          <h1 className="mt-3 text-lg font-bold text-navy">Backend not configured</h1>
          <p className="mt-1.5 text-sm text-muted">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to use the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (!ready || (!session && !isLogin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-green" size={30} />
      </div>
    );
  }

  const logout = async () => {
    await supabase?.auth.signOut();
    router.replace("/admin/login/");
  };

  const active = (href: string) => cleanPath === href.replace(/\/+$/, "");
  const propsActive = PROPS_PREFIXES.some((p) => cleanPath.startsWith(p));

  const navLinks = (dense: boolean) =>
    NAV.map((item) => {
      if (item.children) {
        return (
          <div key={item.label}>
            <button
              onClick={() => setPropsOpen((v) => !v)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                propsActive ? "bg-amber-400 font-semibold text-navy" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.Icon size={17} />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown size={14} className={`transition-transform ${propsOpen ? "rotate-180" : ""}`} />
            </button>
            {propsOpen && (
              <div className="mt-0.5 space-y-0.5 pl-4">
                {item.children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={() => setDrawer(false)}
                    className={`flex items-center gap-2.5 rounded-lg py-2 pl-6 pr-3 text-[12.5px] transition-colors ${
                      active(c.href) ? "bg-white/10 font-semibold text-amber-300" : "text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <c.Icon size={14} /> {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      }
      const isActive = active(item.href!);
      return (
        <Link
          key={item.href}
          href={item.href!}
          onClick={() => setDrawer(false)}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
            isActive ? "bg-amber-400 font-semibold text-navy" : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <item.Icon size={17} /> {item.label}
        </Link>
      );
    });

  const sidebar = (
    <>
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
        <span className="flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white px-1 py-0.5">
          <img src={`${basePath}/logo.png`} alt="bdp.com.pk" className="h-full w-auto" />
        </span>
        <div className="leading-tight">
          <p className="text-[14px] font-extrabold text-white">bdp.com.pk</p>
          <p className="text-[10.5px] text-amber-400">Admin Console</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">{navLinks(false)}</nav>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-navy">
            <Users size={16} />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[13px] font-bold text-white">Super Admin</p>
            <p className="truncate text-[10.5px] text-white/50">Balochistan Property Portal</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Online
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy text-white lg:flex">{sidebar}</aside>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close menu" onClick={() => setDrawer(false)} className="absolute inset-0 bg-black/50" />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-navy text-white shadow-2xl">
            <button onClick={() => setDrawer(false)} className="absolute right-3 top-4 text-white/60 hover:text-white">
              <X size={18} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-white">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button onClick={() => setDrawer(true)} className="text-muted lg:hidden" aria-label="Open menu">
              <Menu size={20} />
            </button>
            <p className="hidden shrink-0 text-[15px] font-bold text-navy sm:block">
              Welcome, <span className="text-amber-500">Admin</span>
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/admin/properties/");
              }}
              className="hidden min-w-0 flex-1 justify-center md:flex"
            >
              <label className="relative w-full max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search properties, users, inquiries..."
                  className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-3 text-[13px] text-ink outline-none transition-all placeholder:text-muted/70 focus:border-green focus:bg-white"
                />
              </label>
            </form>
            <div className="ml-auto flex items-center gap-2.5 sm:gap-3.5">
              <Link
                href="/admin/properties/"
                className="flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy/90 sm:px-4"
              >
                <Plus size={15} /> <span className="hidden sm:inline">Add Property</span>
              </Link>
              <button
                onClick={() => router.push("/admin/messages/")}
                className="relative rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-navy"
                aria-label="Inquiries"
              >
                <Bell size={19} />
                {newInquiries !== null && newInquiries > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9.5px] font-bold text-white">
                    {newInquiries > 99 ? "99+" : newInquiries}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-white">
                  A
                </span>
                <div className="hidden leading-tight sm:block">
                  <p className="text-[12.5px] font-bold text-navy">Admin</p>
                  <p className="text-[10.5px] text-muted">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
