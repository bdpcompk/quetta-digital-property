"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
    <div className="flex min-h-screen items-center justify-center bg-navy p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-10 h-72 w-72 rounded-full bg-green/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-green/10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green text-lg font-extrabold text-white">Q</span>
          <div>
            <h1 className="text-[17px] font-extrabold text-navy">QDP Admin Panel</h1>
            <p className="text-[12.5px] text-muted">Balochistan Property Portal</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 transition-all focus-within:border-green focus-within:shadow-[0_0_0_3px_rgba(26,135,84,.12)]">
            <Mail size={16} className="text-green" />
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
          <label className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 transition-all focus-within:border-green focus-within:shadow-[0_0_0_3px_rgba(26,135,84,.12)]">
            <Lock size={16} className="text-green" />
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

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-[11.5px] text-muted">
          Authorised access only. All actions are logged.
        </p>
      </div>
    </div>
  );
}
