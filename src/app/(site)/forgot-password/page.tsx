"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setErr("");
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${base}/reset-password/`,
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setDone(true);
  };

  return (
    <>
      <PageBanner
        title="Reset Your Password"
        crumbs={[{ label: "Home", href: "/" }, { label: "Forgot Password" }]}
      />
      <section className="section">
        <div className="wrap max-w-[440px]">
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            {done ? (
              <>
                <CheckCircle2 size={34} className="text-green" />
                <h2 className="mt-4 text-[20px] font-extrabold text-navy">Check Your Email</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                  We&apos;ve sent a password reset link to <b className="text-ink">{email}</b>.
                  Open it on this device and choose a new password. Didn&apos;t get it? Check
                  your spam folder.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/login/" className="btn-primary">Back to Login</Link>
                  <button onClick={() => setDone(false)} className="btn-ghost">Try another email</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-[20px] font-extrabold text-navy">Forgot Password?</h2>
                <p className="mt-1 text-[13.5px] text-muted">
                  Enter your account email and we&apos;ll send you a reset link.
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

                  {err && (
                    <p className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                      <AlertCircle size={15} className="mt-0.5 shrink-0" /> {err}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={busy || !supabase}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    <Mail size={15} /> {busy ? "Sending…" : "Send Reset Link"}
                  </button>
                </form>

                <p className="mt-5 text-center text-[13.5px] text-muted">
                  Remembered it?{" "}
                  <Link href="/login/" className="font-bold text-green hover:underline">
                    Back to login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
