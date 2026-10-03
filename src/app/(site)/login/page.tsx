"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, LogIn } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const { session, ready } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

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
                <label className="field-label">Password</label>
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
