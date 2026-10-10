"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

function Toggle({
  on,
  onChange,
  disabled,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        on ? "bg-green" : "bg-line"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [landRecords, setLandRecords] = useState(true);
  const [loading, setLoading] = useState(() => !supabase);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(() => (supabase ? "" : "Backend not configured."));

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("app_settings")
      .select("value")
      .eq("key", "land_records_enabled")
      .maybeSingle()
      .then(({ data, error }) => {
        if (data) setLandRecords(data.value === "on");
        if (error) setErr(error.message);
        setLoading(false);
      });
  }, []);

  const save = async (value: boolean) => {
    if (!supabase) return;
    setLandRecords(value);
    setSaving(true);
    setMsg("");
    setErr("");
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: "land_records_enabled", value: value ? "on" : "off" });
    setSaving(false);
    if (error) setErr(error.message);
    else setMsg("Saved. Changes are live.");
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-navy">Settings</h1>
          <p className="text-[13px] text-muted">Site settings and feature toggles.</p>
        </div>
        <Link href="/admin/" className="btn-ghost">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-2xl rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="text-[15.5px] font-bold text-navy">Tools</h2>
        <p className="mt-1 text-[13px] text-muted">
          Control which public tools are visible on the site.
        </p>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-4">
          <span className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileText size={17} />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-bold text-navy">
                Land Record Pages
              </span>
              <span className="block text-[12.5px] leading-relaxed text-muted">
                Show or hide Land Record Pages in the Tools menu and on the site.
              </span>
            </span>
          </span>
          <Toggle on={landRecords} onChange={save} disabled={loading || saving} />
        </div>

        <div className="mt-4 flex items-center gap-2 text-[12.5px]">
          {saving && (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <Loader2 size={13} className="animate-spin" /> Saving…
            </span>
          )}
          {msg && <span className="font-semibold text-green">{msg}</span>}
          {err && <span className="font-semibold text-rose-500">{err}</span>}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-[12.5px] text-muted">
          <Save size={14} className="text-green" />
          Settings save automatically when toggled.
        </div>
      </div>
    </div>
  );
}
