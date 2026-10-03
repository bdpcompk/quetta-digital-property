"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, KeyRound, Loader2 } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(() => (supabase ? null : false));
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setHasSession(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (alive) setHasSession(!!s);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.replace("/my-account/"), 1800);
  };

  return (
    <>
      <PageBanner
        title="Choose a New Password"
        crumbs={[{ label: "Home", href: "/" }, { label: "Reset Password" }]}
      />
      <section className="section">
        <div className="wrap max-w-[440px]">
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            {hasSession === null ? (
              <div className="flex items-center justify-center gap-2 py-6 text-[14px] text-muted">
                <Loader2 size={16} className="animate-spin text-green" /> Verifying reset link…
              </div>
            ) : !hasSession ? (
              <>
                <AlertCircle size={32} className="text-amber-500" />
                <h2 className="mt-4 text-[19px] font-extrabold text-navy">Reset Link Required</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                  Open the reset link we emailed you (it expires after a while), then come back
                  here to set a new password.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/forgot-password/" className="btn-primary">Send a New Link</Link>
                  <Link href="/login/" className="btn-ghost">Login</Link>
                </div>
              </>
            ) : done ? (
              <>
                <h2 className="text-[19px] font-extrabold text-green">Password Updated ✓</h2>
                <p className="mt-2 text-[13.5px] text-muted">
                  Taking you to your account…
                </p>
                <Link href="/my-account/" className="btn-primary mt-5 inline-flex">
                  Go to My Account
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-[20px] font-extrabold text-navy">Set New Password</h2>
                <p className="mt-1 text-[13.5px] text-muted">
                  Choose a strong password for your account.
                </p>
                <form onSubmit={submit} className="mt-6 space-y-4">
                  <div>
                    <label className="field-label">New Password</label>
                    <input
                      className="field"
                      type="password"
                      required
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Confirm Password</label>
                    <input
                      className="field"
                      type="password"
                      required
                      autoComplete="new-password"
                      placeholder="Repeat the password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>

                  {err && (
                    <p className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                      <AlertCircle size={15} className="mt-0.5 shrink-0" /> {err}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    <KeyRound size={15} /> {busy ? "Updating…" : "Update Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
