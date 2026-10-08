"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, BarChart3, Loader2, Lock, Mail, MessageSquare, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const FEATURES = [
  { Icon: BarChart3, text: "Dashboard with live analytics" },
  { Icon: Building2, text: "Properties, schemes & verification" },
  { Icon: MessageSquare, text: "Inquiries, users & payments" },
  { Icon: ShieldCheck, text: "Role-based secure access" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { setError("Backend not configured."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError(err.message);
    else router.replace("/admin/");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* navy brand panel */}
      <aside className="relative hidden w-[44%] max-w-[560px] flex-col justify-between overflow-hidden bg-navy p-10 md:flex">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/90 to-navy/70" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-green/15 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white px-1.5 py-1 shadow-[0_2px_10px_rgba(0,0,0,.25)]">
            <img src={`${basePath}/logo.png`} alt="BDP.com logo" className="h-full w-auto" />
          </span>
          <div className="leading-tight">
            <p className="text-[16px] font-extrabold text-white">bdp.com.pk</p>
            <p className="text-[12px] font-semibold text-amber-400">Admin Console</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-[34px] font-extrabold leading-tight text-white">
            Welcome, <span className="text-amber-400">Admin</span>
          </h1>
          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/70">
            Manage properties, schemes, verification records and inquiries — all from one
            console backed by live data.
          </p>
          <ul className="mt-7 space-y-3.5">
            {FEATURES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[13.5px] font-medium text-white/85">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-amber-400">
                  <Icon size={15} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[12px] text-white/45">
          Balochistan&apos;s Trusted Property Marketplace
        </p>
      </aside>

      {/* form panel */}
      <main className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-3 md:hidden">
            <span className="flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-navy px-1.5 py-1">
              <img src={`${basePath}/logo.png`} alt="BDP.com logo" className="h-full w-auto" />
            </span>
            <div className="leading-tight">
              <p className="text-[14px] font-extrabold text-navy">bdp.com.pk</p>
              <p className="text-[11px] font-semibold text-amber-500">Admin Console</p>
            </div>
          </div>

          <h2 className="mt-8 text-[26px] font-extrabold text-navy md:mt-0">Sign In</h2>
          <p className="mt-1.5 text-[13.5px] text-muted">
            Authorised access only. All actions are logged.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-3 transition-all focus-within:border-amber-400 focus-within:shadow-[0_0_0_3px_rgba(251,191,36,.18)]">
              <Mail size={16} className="text-muted" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[13.5px] outline-none"
              />
            </label>
            <label className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-3 transition-all focus-within:border-amber-400 focus-within:shadow-[0_0_0_3px_rgba(251,191,36,.18)]">
              <Lock size={16} className="text-muted" />
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[13.5px] outline-none"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-[14px] font-bold text-navy transition-colors hover:bg-amber-300 disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-[11.5px] text-muted">
            © bdp.com.pk — Balochistan Property Portal
          </p>
        </div>
      </main>
    </div>
  );
}
