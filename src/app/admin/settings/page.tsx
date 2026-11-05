"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, BarChart3, Bell, Clapperboard, CreditCard, FileText, Heart, Landmark, Languages,
  Loader2, MessageSquare, Save, Scale, Send, Smartphone, Video,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { refreshSiteSettings } from "@/lib/useSiteSetting";

const FEATURES = [
  { key: "land_records_enabled", label: "Land Record Pages", desc: "Show or hide Land Record Pages in the Tools menu and on the site.", Icon: FileText, color: "bg-blue-50 text-blue-600" },
  { key: "reviews_enabled", label: "Reviews & Ratings", desc: "Show reviews and star ratings on scheme and agent pages.", Icon: MessageSquare, color: "bg-violet-50 text-violet-600" },
  { key: "compare_enabled", label: "Property Compare", desc: "Allow users to compare up to 3 properties side by side.", Icon: Scale, color: "bg-cyan-50 text-cyan-600" },
  { key: "wishlist_enabled", label: "Wishlist / Saved Properties", desc: "Show the heart save button on property cards.", Icon: Heart, color: "bg-rose-50 text-rose-600" },
  { key: "ai_translation_enabled", label: "AI Urdu Translation", desc: "Auto-translate untranslated text to Urdu via AI when the Urdu button is clicked.", Icon: Languages, color: "bg-emerald-50 text-emerald-600" },
  { key: "whatsapp_enabled", label: "Floating WhatsApp Button", desc: "Show the floating WhatsApp chat button on all pages.", Icon: Send, color: "bg-green-50 text-green-600" },
  { key: "realtime_alerts_enabled", label: "Realtime Property Alerts", desc: "Show live notifications when a new property is listed.", Icon: Bell, color: "bg-amber-50 text-amber-600" },
  { key: "video_upload_enabled", label: "Video Upload on Schemes", desc: "Allow scheme owners to upload a promotional video.", Icon: Video, color: "bg-indigo-50 text-indigo-600" },
  { key: "analytics_enabled", label: "Analytics (Google)", desc: "Enable Google Analytics tracking on the site.", Icon: BarChart3, color: "bg-orange-50 text-orange-600" },
  { key: "post_property_enabled", label: "Post Your Property", desc: "Show the Post Your Property dropdown in the header.", Icon: Clapperboard, color: "bg-teal-50 text-teal-600" },
  { key: "payments_enabled", label: "Payments (Easypaisa & Bank)", desc: "Show the Packages & Pricing page with Easypaisa / Bank Transfer checkout.", Icon: CreditCard, color: "bg-pink-50 text-pink-600" },
] as const;

const WALLET_KEYS = [
  { key: "easypaisa_number", label: "Easypaisa Number", placeholder: "03XX XXXXXXX", Icon: Smartphone, color: "bg-green-600", kind: "phone" },
  { key: "bank_account_title", label: "Bank Account Title", placeholder: "e.g. BDP Balochistan Digital Property", Icon: Landmark, color: "bg-navy", kind: "title" },
  { key: "bank_iban", label: "Bank IBAN Number", placeholder: "PK36SCBL0000001123456702", Icon: CreditCard, color: "bg-blue-600", kind: "iban" },
] as const;

const digitsOnly = (value: string) => value.replace(/\D/g, "").slice(0, 11);
const isValidWallet = (value: string) => /^03\d{9}$/.test(value);
const ibanOnly = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 24);
const isValidIban = (value: string) => /^PK\d{2}[A-Z]{4}[A-Z0-9]{16}$/.test(value);
const isValidTitle = (value: string) => value.trim().length >= 2;

function Toggle({ on, onChange, disabled }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
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
  const [values, setValues] = useState<Record<string, string>>({});
  const [base, setBase] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(() => Boolean(supabase));
  const [savingKey, setSavingKey] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(() => (supabase ? "" : "Backend not configured."));
  const savedRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("app_settings")
      .select("key, value")
      .then(({ data, error }) => {
        if (data) {
          const map: Record<string, string> = {};
          for (const row of data) map[row.key] = row.value;
          savedRef.current = map;
          setValues(map);
          setBase(map);
        }
        if (error) setErr(error.message);
        setLoading(false);
      });
  }, []);

  const saveValue = async (key: string, value: string): Promise<boolean> => {
    if (!supabase) return false;
    setSavingKey(key);
    setMsg("");
    setErr("");
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key, value }, { onConflict: "key" });
    setSavingKey("");
    if (error) {
      setErr(error.message);
      return false;
    }
    // Keep the input in sync with what was actually stored, then push the new
    // value to every open page immediately.
    savedRef.current = { ...savedRef.current, [key]: value };
    setValues((prev) => ({ ...prev, [key]: value }));
    setBase((prev) => ({ ...prev, [key]: value }));
    setMsg("Saved. Changes are live.");
    void refreshSiteSettings();
    return true;
  };

  const toggle = async (key: string, value: boolean) => {
    const next = value ? "on" : "off";
    setValues((prev) => ({ ...prev, [key]: next }));
    const saved = await saveValue(key, next);
    if (!saved) {
      // Roll the switch back so the UI never shows an unsaved state.
      setValues((prev) => ({ ...prev, [key]: savedRef.current[key] ?? "on" }));
    }
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
        <h2 className="text-[15.5px] font-bold text-navy">Feature Toggles</h2>
        <p className="mt-1 text-[13px] text-muted">
          Turn site features on or off. Settings save automatically when toggled.
        </p>

        <div className="mt-4 space-y-3">
          {FEATURES.map(({ key, label, desc, Icon, color }) => (
            <div key={key} className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-4">
              <span className="flex min-w-0 items-start gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
                  <Icon size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold text-navy">{label}</span>
                  <span className="block text-[12.5px] leading-relaxed text-muted">{desc}</span>
                </span>
              </span>
              <Toggle
                on={(values[key] ?? "on") === "on"}
                onChange={(v) => toggle(key, v)}
                disabled={loading || savingKey === key}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-[12.5px]">
          {savingKey && (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <Loader2 size={13} className="animate-spin" /> Saving…
            </span>
          )}
          {msg && <span className="font-semibold text-green">{msg}</span>}
          {err && <span className="font-semibold text-rose-500">{err}</span>}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-[12.5px] text-muted">
          <Save size={14} className="text-green" />
          Toggles save automatically; wallet / bank details save with the green Save button.
        </div>
      </div>

      {/* Payment wallet numbers */}
      <div className="mt-5 max-w-2xl rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="text-[15.5px] font-bold text-navy">Payment Wallet / Bank Details</h2>
        <p className="mt-1 text-[13px] text-muted">
          Easypaisa number, bank account title and IBAN shown to buyers on the Packages checkout page.
        </p>

        <div className="mt-4 space-y-3">
          {WALLET_KEYS.map(({ key, label, placeholder, Icon, color, kind }) => {
            const raw = values[key] ?? "";
            const value =
              kind === "phone" ? digitsOnly(raw) : kind === "iban" ? ibanOnly(raw) : raw.slice(0, 60);
            const valid =
              kind === "phone"
                ? isValidWallet(value)
                : kind === "iban"
                  ? isValidIban(value)
                  : isValidTitle(value);
            const dirty = value !== (base[key] ?? "");
            const showError = value.length > 0 && !valid;
            return (
              <div key={key} className="rounded-xl border border-line px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white ${color}`}>
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-bold text-navy">{label}</span>
                    <input
                      type="text"
                      inputMode={kind === "phone" ? "numeric" : "text"}
                      autoComplete="off"
                      maxLength={kind === "phone" ? 11 : kind === "iban" ? 24 : 60}
                      className={`field mt-1.5 w-full ${showError ? "border-red-400" : ""}`}
                      placeholder={placeholder}
                      value={value}
                      disabled={loading || savingKey === key}
                      onFocus={(e) => e.currentTarget.select()}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && valid && dirty) void saveValue(key, value);
                      }}
                    />
                  </span>
                  <button
                    type="button"
                    disabled={loading || savingKey === key || !dirty || !valid}
                    onClick={() => saveValue(key, value)}
                    className="shrink-0 rounded-lg bg-green px-3 py-2 text-[12px] font-bold text-white transition-colors hover:bg-green-dark disabled:opacity-40"
                  >
                    {savingKey === key ? "Saving..." : "Save"}
                  </button>
                </div>
                {showError ? (
                  <p className="mt-1.5 text-[11.5px] font-semibold text-red-500">
                    {kind === "phone"
                      ? "Poora 11-digit number likhein — jaise 0300 1234567"
                      : kind === "iban"
                        ? "Sahi Pakistani IBAN likhein — 24 characters, PK se shuru (jaise PK36SCBL0000001123456702)"
                        : "Bank account title likhein (kam az kam 2 characters)."}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[11.5px] text-muted">
                    {kind === "iban"
                      ? "Spaces khud hat jayengi. Save dabane ke baad checkout par foran update ho jayega."
                      : "Type karte waqt field select rehti hai — naya number likh kar Save dabayein."}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-[12.5px]">
          {savingKey && (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <Loader2 size={13} className="animate-spin" /> Saving…
            </span>
          )}
          {msg && <span className="font-semibold text-green">{msg}</span>}
          {err && <span className="font-semibold text-rose-500">{err}</span>}
        </div>
      </div>
    </div>
  );
}
