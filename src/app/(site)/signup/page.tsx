"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import { useLang } from "@/components/layout/LanguageProvider";

function SignupClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/profile/";
  const { session, ready } = useSession();
  const { t } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && session) router.replace(next);
  }, [ready, session, next, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setErr("");
    setSent("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role: "common" },
        emailRedirectTo: `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/profile/`,
      },
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    if (data.session) {
      await saveRole(data.session.user.id, email);
      router.replace(next);
      return;
    }
    setSent(
      `Account created! A confirmation link has been sent to ${email}. Confirm your email, then login.`
    );
  };

  const saveRole = async (userId: string, userEmail: string) => {
    if (!supabase) return;
    try {
      await supabase
        .from("user_roles")
        .upsert({ user_id: userId, email: userEmail, role: "common" });
    } catch {}
  };

  if (sent) {
    return (
      <section className="section">
        <div className="wrap max-w-[440px]">
          <div className="rounded-2xl border border-line bg-white p-6 text-center sm:p-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-soft">
              <CheckCircle2 size={30} className="text-green" />
            </span>
            <h2 className="mt-4 text-[20px] font-extrabold text-navy">
              {t("Account created â€” welcome!")}
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              {t("We sent a confirmation link to your email. Open it and you will land straight on your Profile page.")}
            </p>
            <p className="mt-2 text-[12.5px] text-muted">{sent}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/profile/" className="btn-primary">{t("Open My Profile")}</Link>
              <Link href="/login/" className="btn-ghost">{t("Login")}</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageBanner
        title="Create Your Account"
        crumbs={[{ label: "Home", href: "/" }, { label: "Sign Up" }]}
      />
      <section className="section">
        <div className="wrap max-w-[440px]">
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            <h2 className="text-[20px] font-extrabold text-navy">Register Free</h2>
            <p className="mt-1 text-[13.5px] text-muted">
              Post properties, and manage your listings â€” free forever.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="field-label">Full Name</label>
                <input
                  className="field"
                  required
                  autoComplete="name"
                  placeholder="e.g. Ali Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {err && (
                <p className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" /> {err}
                </p>
              )}
              {sent && (
                <p className="flex items-start gap-2 rounded-xl bg-green-soft px-3.5 py-2.5 text-[13px] text-green">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" /> {sent}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !supabase}
                className="btn-primary w-full disabled:opacity-60"
              >
                <UserPlus size={15} /> {loading ? "Creating accountâ€¦" : "Create Account"}
              </button>
            </form>

            <p className="mt-5 text-center text-[13.5px] text-muted">
              Already have an account?{" "}
              <Link href={`/login/?next=${encodeURIComponent(next)}`} className="font-bold text-green hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupClient />
    </Suspense>
  );
}
