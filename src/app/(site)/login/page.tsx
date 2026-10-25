"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Briefcase,
  Building2,
  ChevronRight,
  Clock,
  Loader2,
  LogIn,
  User,
} from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

const DEMO_ACCOUNTS = [
  {
    role: "Buyer / User",
    email: "user.demo@bdpcompk.com",
    password: "UserDemo2026!",
    next: "/profile/",
    icon: User,
  },
  {
    role: "Property Agent",
    email: "agent.demo@bdpcompk.com",
    password: "AgentDemo2026!",
    next: "/profile/?view=dashboard",
    icon: Briefcase,
  },
  {
    role: "Scheme Owner",
    email: "owner.demo@bdpcompk.com",
    password: "OwnerDemo2026!",
    next: "/profile/?view=dashboard",
    icon: Building2,
  },
];

const LOCK_KEY = "bdp-login-lock";

function formatWait(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/profile/";
  const { session, ready } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState("");
  const [demoNext, setDemoNext] = useState("");
  const [resolving, setResolving] = useState(false);
  const [lockLeft, setLockLeft] = useState(0);
  const locked = lockLeft > 0;

  useEffect(() => {
    if (ready && session && !resolving) router.replace(demoNext || next);
  }, [ready, session, next, demoNext, resolving, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(LOCK_KEY);
        if (!raw) return;
        const until = Number(JSON.parse(raw).until) || 0;
        if (until > Date.now()) setLockLeft(Math.ceil((until - Date.now()) / 1000));
      } catch {
        localStorage.removeItem(LOCK_KEY);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => setLockLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [locked]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || locked) return;
    setErr("");
    setResolving(true);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setResolving(false);
      if (/invalid login credentials/i.test(error.message)) {
        let fails = 0;
        try {
          fails = Number(JSON.parse(localStorage.getItem(LOCK_KEY) || "{}").fails) || 0;
        } catch {
          fails = 0;
        }
        fails += 1;
        if (fails >= 3) {
          const mins = fails >= 5 ? 3 : fails === 4 ? 2 : 1;
          const secs = mins * 60;
          localStorage.setItem(LOCK_KEY, JSON.stringify({ fails, until: Date.now() + secs * 1000 }));
          setLockLeft(secs);
          setErr("");
        } else {
          localStorage.setItem(LOCK_KEY, JSON.stringify({ fails, until: 0 }));
          setErr("Incorrect email or password. Please try again.");
        }
      } else {
        setErr(
          error.message === "Email not confirmed"
            ? "Please confirm your email first — check your inbox (and spam folder)."
            : error.message
        );
      }
      return;
    }
    localStorage.removeItem(LOCK_KEY);
    let target = next;
    if (!params.get("next") && data.user) {
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (roleRow?.role === "agent" || roleRow?.role === "owner") {
        target = "/profile/?view=dashboard";
      }
    }
    router.replace(target);
  };

  const googleLogin = async () => {
    if (!supabase || locked) return;
    setErr("");
    setResolving(true);
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${base}${next}` },
    });
    if (error) {
      setResolving(false);
      setErr(error.message);
    }
  };

  const demoLogin = async (demo: (typeof DEMO_ACCOUNTS)[number]) => {
    if (!supabase) return;
    setErr("");
    setDemoNext(demo.next);
    setDemoLoading(demo.email);
    const { error } = await supabase.auth.signInWithPassword({
      email: demo.email,
      password: demo.password,
    });
    setDemoLoading("");
    if (error) {
      setDemoNext("");
      setErr(error.message);
      return;
    }
    router.replace(demo.next);
  };

  return (
    <>
      <PageBanner
        title="Login to Your Account"
        crumbs={[{ label: "Home", href: "/" }, { label: "Login" }]}
      />
      <section className="section">
        <div className="wrap max-w-[440px]">
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            <h2 className="text-[20px] font-extrabold text-navy">Welcome Back</h2>
            <p className="mt-1 text-[13.5px] text-muted">
              Login to post properties and manage your listings.
            </p>

            <button
              type="button"
              onClick={googleLogin}
              disabled={loading || locked || !supabase}
              className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-[13.5px] font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
            >
              <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.7 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.5 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.6c-.3 2.1-1.6 5.2-4.6 7.3l7.6 5.9c4.5-4.1 6.5-10.2 6.5-16.9z" />
                <path fill="#FBBC05" d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.2C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.2z" />
                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.6l-7.6-5.9c-2.1 1.4-4.8 2.4-7.6 2.4-6.3 0-11.6-4-13.5-9.9l-7.9 6.2C6.5 42.6 14.6 48 24 48z" />
              </svg>
              Continue with Gmail
            </button>
            <div className="relative my-5 text-center">
              <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
              <span className="relative bg-white px-3 text-[10.5px] font-semibold uppercase tracking-wide text-muted">
                or login with email
              </span>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="field-label">Email</label>
                <input
                  className="field"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="field-label">Password</label>
                  <Link
                    href="/forgot-password/"
                    className="text-[12.5px] font-semibold text-green hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  className="field"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {locked ? (
                <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-[13px] font-medium text-amber-700">
                  <Clock size={15} className="mt-0.5 shrink-0" />
                  <span>
                    Too many failed attempts. Please wait <b>{formatWait(lockLeft)}</b> before trying
                    again.
                  </span>
                </p>
              ) : (
                err && (
                  <p className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" /> {err}
                  </p>
                )
              )}

              <button
                type="submit"
                disabled={loading || locked || !supabase}
                className="btn-primary w-full disabled:opacity-60"
              >
                {locked ? <Clock size={15} /> : <LogIn size={15} />}{" "}
                {locked ? `Try again in ${formatWait(lockLeft)}` : loading ? "Logging in…" : "Login"}
              </button>
            </form>

            <p className="mt-5 text-center text-[13.5px] text-muted">
              New to the portal?{" "}
              <Link href={`/signup/?next=${encodeURIComponent(next)}`} className="font-bold text-green hover:underline">
                Create an account
              </Link>
            </p>

            <div className="mt-6 border-t border-line pt-5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold text-navy">Demo Accounts</p>
                <span className="rounded-full bg-green-soft px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-green">
                  For testing
                </span>
              </div>
              <p className="mt-1 text-[12px] text-muted">
                One-click login with sample data already added.
              </p>
              <div className="mt-3 space-y-2">
                {DEMO_ACCOUNTS.map((demo) => {
                  const Icon = demo.icon;
                  return (
                    <button
                      key={demo.email}
                      type="button"
                      onClick={() => demoLogin(demo)}
                      disabled={!!demoLoading}
                      className="flex w-full items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5 text-left transition-colors hover:border-green hover:bg-green-soft disabled:opacity-60"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-soft text-green">
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-bold text-navy">{demo.role}</span>
                        <span className="block truncate text-[11.5px] text-muted">{demo.email}</span>
                      </span>
                      {demoLoading === demo.email ? (
                        <Loader2 size={15} className="shrink-0 animate-spin text-green" />
                      ) : (
                        <ChevronRight size={15} className="shrink-0 text-muted" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
