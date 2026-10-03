"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import {
  FileText, FolderKanban, History, LayoutDashboard, LayoutGrid, LayoutList, LogOut,
  MessageSquare, Package, ShieldCheck, Users, Loader2, AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/admin/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/properties/", label: "Properties", Icon: Package },
  { href: "/admin/agents/", label: "Agents", Icon: Users },
  { href: "/admin/projects/", label: "Projects", Icon: FolderKanban },
  { href: "/admin/schemes/", label: "Schemes", Icon: LayoutGrid },
  { href: "/admin/qda/", label: "QDA Schemes", Icon: ShieldCheck },
  { href: "/admin/history/", label: "Verification Log", Icon: History },
  { href: "/admin/articles/", label: "Guides", Icon: FileText },
  { href: "/admin/districts/", label: "Districts & Areas", Icon: LayoutList },
  { href: "/admin/messages/", label: "Messages", Icon: MessageSquare },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const cleanPath = (pathname || "").replace(/\/+$/, "");
  const isLogin = cleanPath.endsWith("/admin/login");
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

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

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-60 flex-col bg-navy text-white max-lg:hidden">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green text-sm font-extrabold">Q</span>
          <div className="leading-tight">
            <p className="text-[13.5px] font-bold">QDP Admin</p>
            <p className="text-[10.5px] text-white/50">Balochistan Property Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV.map(({ href, label, Icon }) => {
            const active = cleanPath === href.replace(/\/+$/, "");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  active ? "bg-green text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={17} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <p className="truncate px-3 pb-2 text-[11.5px] text-white/50">{session?.user.email}</p>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
          <Link href="/admin/" className="flex items-center gap-2 font-bold text-navy">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green text-xs font-extrabold text-white">Q</span>
            QDP Admin
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-muted">
            <LogOut size={14} /> Exit
          </button>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
