"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Building2,
  Check,
  ClipboardList,
  Film,
  Globe,
  Image as ImageIcon,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  Settings2,
  SlidersHorizontal,
  Star,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { refreshSiteSettings } from "@/lib/useSiteSetting";
import {
  ACCESS_COLUMNS,
  FEATURES,
  GLOBAL_DEFAULTS,
  LEGACY_KEY,
  MEDIA_DEFAULTS,
  MEDIA_KEYS,
  ROLES,
  ROLE_DEFAULTS,
  globalKey,
  roleKey,
  type FeatureId,
} from "@/lib/featureControl";

const FEATURE_ICONS: Record<FeatureId, LucideIcon> = {
  image_upload: ImageIcon,
  video_upload: Video,
  location_map: MapPin,
  featured_ads: Star,
  scheme_listing: Building2,
  contact_display: Phone,
  whatsapp_button: MessageCircle,
  video_gallery: Film,
};

const TONE_BG: Record<string, string> = {
  green: "bg-green",
  blue: "bg-blue-600",
  purple: "bg-purple-600",
};

const NOTES = [
  "Media upload ki permission har role ke liye alag set ki ja sakti hai.",
  "Agar kisi role ke liye feature off hoga to us user ko wo option nazar nahi aayega.",
  "Featured ads ke liye payment zaruri hogi.",
  "Video upload ki file size aur format settings neeche Media Settings mein configure karein.",
  "Auto Compress photos ko resize/compress karta hai; videos select hone ke baad as-is upload hoti hain.",
  "Global setting se aap ek hi jagah se sabhi roles ke liye feature control kar sakte hain.",
];

function Switch({
  on,
  onChange,
  tone = "green",
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  tone?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? TONE_BG[tone] ?? "bg-green" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-muted">{label}</label>
      {children}
    </div>
  );
}

const selectCls =
  "w-full rounded-lg border border-line bg-white px-2.5 py-2 text-[12.5px] font-medium text-ink outline-none focus:border-green";

export default function MediaFeatureControlPage() {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [base, setBase] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [quickFeature, setQuickFeature] = useState<FeatureId>("image_upload");

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    (async () => {
      const { data } = await supabase.from("app_settings").select("key, value");
      if (!alive) return;
      const map: Record<string, string> = { ...ROLE_DEFAULTS, ...GLOBAL_DEFAULTS, ...MEDIA_DEFAULTS };
      (data || []).forEach((r) => {
        if (r.key.startsWith("fc_") || r.key.startsWith("media_")) map[r.key] = r.value;
      });
      setVals(map);
      setBase(map);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const dirty = useMemo(
    () => Object.keys(vals).filter((k) => vals[k] !== base[k]).length,
    [vals, base]
  );

  const setVal = (key: string, value: string) =>
    setVals((v) => ({ ...v, [key]: value }));

  const isOn = (key: string) => vals[key] === "on";

  const save = async () => {
    if (!supabase) return;
    setSaving(true);
    setMsg("");
    const changed = Object.keys(vals).filter((k) => vals[k] !== base[k]);
    const rows = changed.map((k) => ({ key: k, value: vals[k] }));
    // keep legacy keys in sync so existing components stay in step
    FEATURES.forEach((f) => {
      const legacy = LEGACY_KEY[f.id];
      if (!legacy) return;
      const key = globalKey(f.id);
      if (vals[key] !== base[key]) rows.push({ key: legacy, value: vals[key] });
    });
    if (rows.length) {
      const { error } = await supabase.from("app_settings").upsert(rows);
      if (error) {
        setMsg("Save nahi hua: " + error.message);
        setSaving(false);
        return;
      }
    }
    setBase(vals);
    // Push the fresh values to every open form immediately (same tab + realtime).
    await refreshSiteSettings();
    setMsg("Changes live ho gaye ✓ — public forms par foran apply ho gaye hain.");
    setSaving(false);
    setTimeout(() => setMsg(""), 3500);
  };

  const setAllRoles = (feature: FeatureId, on: boolean) => {
    setVals((v) => {
      const next = { ...v };
      ROLES.forEach((r) => (next[roleKey(r.id, feature)] = on ? "on" : "off"));
      return next;
    });
  };

  const setEverything = (on: boolean) => {
    setVals((v) => {
      const next = { ...v };
      FEATURES.forEach((f) => {
        ROLES.forEach((r) => (next[roleKey(r.id, f.id)] = on ? "on" : "off"));
        next[globalKey(f.id)] = on ? "on" : "off";
      });
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[14px] text-muted">
        Loading settings…
      </div>
    );
  }

  const roleAllOn = (feature: FeatureId) =>
    ROLES.every((r) => isOn(roleKey(r.id, feature))) && isOn(globalKey(feature));
  const roleAnyOn = (feature: FeatureId) =>
    ROLES.some((r) => isOn(roleKey(r.id, feature))) || isOn(globalKey(feature));

  return (
    <div className="pb-10">
      {/* Breadcrumb */}
      <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted">
        <Link href="/admin/" className="hover:text-green">Dashboard</Link>
        <span>&gt;</span>
        <Link href="/admin/settings/" className="hover:text-green">Settings</Link>
        <span>&gt;</span>
        <span className="font-semibold text-navy">Media &amp; Feature Control</span>
      </nav>

      {/* Title row */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
            <Settings2 size={22} />
          </span>
          <div>
            <h1 className="text-[22px] font-extrabold text-navy">Media &amp; Feature Control</h1>
            <p className="mt-0.5 text-[13px] text-muted">
              Yahan se aap media upload (photo/video/location) aur special features ko on/off kar sakte hain.
            </p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-green px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-green-dark disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving…" : "Save Changes"}
          {dirty > 0 && (
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-extrabold">{dirty}</span>
          )}
        </button>
      </div>

      {msg && (
        <p className="mb-4 rounded-xl bg-green-soft px-4 py-2.5 text-[13px] font-semibold text-green">{msg}</p>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Feature matrix */}
        <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-navy">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-soft text-green">
                  <SlidersHorizontal size={16} />
                </span>
                Account Roles se Features Control
              </h2>
              <p className="mt-1 text-[12.5px] text-muted">
                Har role ke liye alag media aur features ki permission set karein.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {ROLES.map((r) => (
                <span key={r.id} className="flex items-center gap-1.5 text-[12px] font-semibold text-navy">
                  <span className={`h-3.5 w-3.5 rounded-full ${TONE_BG[r.tone]}`} />
                  {r.label}
                  <span className="font-normal text-muted">{r.sub}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-surface text-[12.5px]">
                  <th className="px-3 py-3 font-extrabold text-navy">Feature / Media</th>
                  {ROLES.map((r) => (
                    <th key={r.id} className="px-3 py-3 text-center font-extrabold" style={{ color: r.tone === "green" ? "#1a8754" : r.tone === "blue" ? "#2563eb" : "#7e22ce" }}>
                      {r.label}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center font-extrabold text-navy">
                    Global Setting
                    <Info size={13} className="ml-1 inline text-muted" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((f) => {
                  const Icon = FEATURE_ICONS[f.id];
                  return (
                    <tr key={f.id} className="border-b border-line last:border-0">
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-soft text-green">
                            <Icon size={17} />
                          </span>
                          <span>
                            <span className="block text-[13.5px] font-bold text-navy">{f.label}</span>
                            <span className="block text-[11.5px] text-muted">{f.desc}</span>
                          </span>
                        </div>
                      </td>
                      {ROLES.map((r) => (
                        <td key={r.id} className="px-3 py-3.5 text-center">
                          <div className="flex justify-center">
                            <Switch
                              tone={r.tone}
                              label={`${f.label} — ${r.label}`}
                              on={isOn(roleKey(r.id, f.id))}
                              onChange={(v) => setVal(roleKey(r.id, f.id), v ? "on" : "off")}
                            />
                          </div>
                        </td>
                      ))}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            tone="green"
                            label={`${f.label} — global`}
                            on={isOn(globalKey(f.id))}
                            onChange={(v) => setVal(globalKey(f.id), v ? "on" : "off")}
                          />
                          <span className="text-[11.5px] font-semibold text-muted">
                            ({isOn(globalKey(f.id)) ? "On" : "Off"})
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right column */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <h3 className="flex items-center gap-2 text-[14.5px] font-extrabold text-blue-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Info size={16} />
              </span>
              Important Notes
            </h3>
            <ul className="mt-3 space-y-2">
              {NOTES.map((n) => (
                <li key={n} className="flex gap-2 text-[12.5px] leading-relaxed text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  {n}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4">
            <h3 className="flex items-center gap-2 text-[14.5px] font-extrabold text-navy">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-soft text-green">
                <Bell size={16} />
              </span>
              Quick Toggle (All Roles)
            </h3>
            <p className="mt-1 text-[12px] text-muted">
              Sabhi roles ke liye selected feature ko ek hi bar on/off karne ke liye.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <select
                className={selectCls}
                value={quickFeature}
                onChange={(e) => setQuickFeature(e.target.value as FeatureId)}
              >
                {FEATURES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
              <Switch
                tone="green"
                label="Quick toggle"
                on={roleAllOn(quickFeature)}
                onChange={(v) => setAllRoles(quickFeature, v)}
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setEverything(true)}
                className="rounded-lg bg-green px-3 py-2.5 text-[12.5px] font-extrabold text-white transition-colors hover:bg-green-dark"
              >
                Enable All
              </button>
              <button
                onClick={() => setEverything(false)}
                className="rounded-lg bg-red-500 px-3 py-2.5 text-[12.5px] font-extrabold text-white transition-colors hover:bg-red-600"
              >
                Disable All
              </button>
            </div>
            <p className="mt-2 text-[11.5px] text-muted">
              {roleAnyOn(quickFeature)
                ? "Ye feature abhi active hai."
                : "Ye feature abhi band hai."}
            </p>
          </section>
        </div>
      </div>

      {/* Media settings + role-wise status */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-navy">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-soft text-green">
              <ImageIcon size={16} />
            </span>
            Media Settings
          </h2>
          <p className="mt-1 text-[12.5px] text-muted">
            Upload files ki size, format aur allowed types set karein.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-surface p-3.5">
              <h4 className="mb-3 flex items-center gap-2 text-[13px] font-extrabold text-navy">
                <ImageIcon size={15} className="text-green" /> Image Settings
              </h4>
              <div className="space-y-3">
                <Field label="Max File Size (Image)">
                  <select
                    className={selectCls}
                    value={vals[MEDIA_KEYS.maxImageMb] ?? "5"}
                    onChange={(e) => setVal(MEDIA_KEYS.maxImageMb, e.target.value)}
                  >
                    {["1", "2", "5", "10", "15"].map((v) => (
                      <option key={v} value={v}>
                        {v} MB
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Allowed Formats">
                  <select
                    className={selectCls}
                    value={vals[MEDIA_KEYS.imageFormats] ?? "JPG, PNG, JPEG, WEBP"}
                    onChange={(e) => setVal(MEDIA_KEYS.imageFormats, e.target.value)}
                  >
                    {["JPG, PNG, JPEG, WEBP", "JPG, PNG, JPEG", "PNG, WEBP", "JPG, PNG"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Max Images per Listing">
                  <select
                    className={selectCls}
                    value={vals[MEDIA_KEYS.maxImages] ?? "20"}
                    onChange={(e) => setVal(MEDIA_KEYS.maxImages, e.target.value)}
                  >
                    {["5", "10", "15", "20", "30"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface p-3.5">
              <h4 className="mb-3 flex items-center gap-2 text-[13px] font-extrabold text-navy">
                <Video size={15} className="text-purple-600" /> Video Settings
              </h4>
              <div className="space-y-3">
                <Field label="Max File Size (Video)">
                  <select
                    className={selectCls}
                    value={vals[MEDIA_KEYS.maxVideoMb] ?? "100"}
                    onChange={(e) => setVal(MEDIA_KEYS.maxVideoMb, e.target.value)}
                  >
                    {["25", "50", "100", "150", "200"].map((v) => (
                      <option key={v} value={v}>
                        {v} MB
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Allowed Formats">
                  <select
                    className={selectCls}
                    value={vals[MEDIA_KEYS.videoFormats] ?? "MP4, MOV, WEBM"}
                    onChange={(e) => setVal(MEDIA_KEYS.videoFormats, e.target.value)}
                  >
                    {["MP4, MOV, WEBM", "MP4", "MP4, WEBM", "MP4, MOV"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Max Videos per Listing">
                  <select
                    className={selectCls}
                    value={vals[MEDIA_KEYS.maxVideos] ?? "5"}
                    onChange={(e) => setVal(MEDIA_KEYS.maxVideos, e.target.value)}
                  >
                    {["1", "3", "5", "8", "10"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface p-3.5">
              <h4 className="mb-3 flex items-center gap-2 text-[13px] font-extrabold text-navy">
                <MapPin size={15} className="text-blue-600" /> Additional Options
              </h4>
              <div className="space-y-3">
                <Field label="Max Video Duration">
                  <select
                    className={selectCls}
                    value={vals[MEDIA_KEYS.maxDuration] ?? "5"}
                    onChange={(e) => setVal(MEDIA_KEYS.maxDuration, e.target.value)}
                  >
                    {["1", "2", "3", "5", "10"].map((v) => (
                      <option key={v} value={v}>
                        {v} Minutes
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-semibold text-muted">Auto Compress Photos</span>
                  <Switch
                    tone="green"
                    label="Auto compress photos"
                    on={isOn(MEDIA_KEYS.autoCompress)}
                    onChange={(v) => setVal(MEDIA_KEYS.autoCompress, v ? "on" : "off")}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-semibold text-muted">Video Thumbnail</span>
                  <Switch
                    tone="green"
                    label="Video thumbnail"
                    on={isOn(MEDIA_KEYS.thumbnail)}
                    onChange={(v) => setVal(MEDIA_KEYS.thumbnail, v ? "on" : "off")}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-navy">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-soft text-green">
              <ClipboardList size={16} />
            </span>
            Role-wise Media Access
            <span className="text-[12px] font-normal text-muted">(Current Status)</span>
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-2.5 pr-3 font-extrabold text-navy">Role</th>
                  {ACCESS_COLUMNS.map((c) => (
                    <th key={c.id} className="px-2 py-2.5 text-center font-extrabold text-navy">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROLES.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="py-3 pr-3">
                      <span className="flex items-center gap-2 font-bold text-navy">
                        <span className={`h-3 w-3 rounded-full ${TONE_BG[r.tone]}`} />
                        {r.label}
                      </span>
                    </td>
                    {ACCESS_COLUMNS.map((c) => {
                      const allowed = isOn(roleKey(r.id, c.id)) && isOn(globalKey(c.id));
                      return (
                        <td key={c.id} className="px-2 py-3 text-center">
                          {allowed ? (
                            <Check size={16} className="mx-auto text-green" />
                          ) : (
                            <X size={16} className="mx-auto text-red-500" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-green-100 bg-green-soft/60 px-4 py-3 text-[12.5px] font-semibold text-ink">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-white">
              <Check size={14} />
            </span>
            <span>
              Aap in settings ko baad mein kisi bhi waqt change kar sakte hain. Changes turant apply ho
              jayen gi.
            </span>
          </div>
        </section>
      </div>

      {/* quick links */}
      <div className="mt-5 flex flex-wrap gap-2 text-[12.5px]">
        <Link href="/admin/settings/" className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 font-semibold text-navy hover:border-green">
          <Settings2 size={14} /> General Settings
        </Link>
        <Link href="/admin/packages/" className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 font-semibold text-navy hover:border-green">
          <Star size={14} /> Payment Settings
        </Link>
        <Link href="/admin/districts/" className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 font-semibold text-navy hover:border-green">
          <MapPin size={14} /> Location Settings
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 font-semibold text-navy">
          <Globe size={14} /> Email &amp; SMS Settings
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 font-semibold text-navy">
          <Mail size={14} /> System Logs
        </span>
      </div>
    </div>
  );
}
