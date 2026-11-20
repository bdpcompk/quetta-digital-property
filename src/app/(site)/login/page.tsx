"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  LogIn,
} from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/profile/";
  const { session, ready } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (ready && session && !resolving) router.replace(next);
  }, [ready, session, next, resolving, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setErr("");
    setResolving(true);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setResolving(false);
      if (/invalid login credentials/i.test(error.message)) {
        setErr("Incorrect email or password. Please try again.");
      } else if (/rate limit|too many/i.test(error.message)) {
        setErr("Too many attempts. Please wait a minute and try again.");
      } else {
        setErr(
          error.message === "Email not confirmed"
            ? "Please confirm your email first — check your inbox (and spam folder)."
            : error.message
        );
      }
      return;
    }
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
    if (!supabase) return;
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
              disabled={loading || !supabase}
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
