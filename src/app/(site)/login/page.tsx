"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Briefcase,
  Building2,
  ChevronRight,
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
    next: "/dashboard/",
    icon: Briefcase,
  },
  {
    role: "Scheme Owner",
    email: "owner.demo@bdpcompk.com",
    password: "OwnerDemo2026!",
    next: "/dashboard/",
    icon: Building2,
  },
];

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

  useEffect(() => {
    if (ready && session) router.replace(next);
  }, [ready, session, next, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(
        error.message === "Email not confirmed"
          ? "Please confirm your email first — check your inbox (and spam folder)."
          : error.message
      );
      return;
    }
    router.replace(next);
  };

  const demoLogin = async (demo: (typeof DEMO_ACCOUNTS)[number]) => {
    if (!supabase) return;
    setErr("");
    setDemoLoading(demo.email);
    const { error } = await supabase.auth.signInWithPassword({
      email: demo.email,
      password: demo.password,
    });
    setDemoLoading("");
    if (error) {
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

            <form onSubmit={submit} className="mt-6 space-y-4">
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

              {err && (
                <p className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" /> {err}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !supabase}
                className="btn-primary w-full disabled:opacity-60"
              >
                <LogIn size={15} /> {loading ? "Logging in…" : "Login"}
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
