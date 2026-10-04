"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle, BadgeCheck, CloudUpload, Droplets, Flame, Loader2, LogIn,
  MapPin, Route, Send, X, Zap,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { AUTHORITIES, formatPKR } from "@/lib/data";
import { useSession } from "@/lib/useSession";

const FACILITIES: { key: string; label: string; Icon: typeof Zap }[] = [
  { key: "bijli", label: "Bijli (Electricity)", Icon: Zap },
  { key: "pani", label: "Pani (Water)", Icon: Droplets },
  { key: "gas", label: "Gas", Icon: Flame },
  { key: "road", label: "Road", Icon: Route },
];

const NOC_OPTIONS = ["Approved", "Under Process", "Not Approved"];

const MAX_PHOTOS = 5;

export default function AddSchemeForm() {
  const { session, ready, name, supabase: sb } = useSession();
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [schemeName, setSchemeName] = useState("");
  const [location, setLocation] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [authority, setAuthority] = useState("QDA");
  const [nocNumber, setNocNumber] = useState("");
  const [nocStatus, setNocStatus] = useState("Under Process");
  const [registration, setRegistration] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [facilities, setFacilities] = useState<string[]>(["bijli", "pani", "road"]);
  const [priceTotal, setPriceTotal] = useState("");
  const [priceAdvance, setPriceAdvance] = useState("");
  const [priceMonthly, setPriceMonthly] = useState("");
  const [status, setStatus] = useState("Active");
  const [files, setFiles] = useState<File[]>([]);

  const toggleFac = (key: string) =>
    setFacilities((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]));

  const pickFiles = (list: FileList | null) => {
    if (!list) return;
    const imgs = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles(imgs.slice(0, MAX_PHOTOS));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb || !session) return;
    setErr("");
    setBusy(true);

    const photos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = `${session.user.id}/${Date.now()}-${i}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const up = await sb.storage.from("listings").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (up.error) {
        setErr("Photo upload failed: " + up.error.message);
        setBusy(false);
        return;
      }
      photos.push(sb.storage.from("listings").getPublicUrl(path).data.publicUrl);
    }

    const { error } = await sb.from("schemes").insert({
      name: schemeName.trim(),
      location: location.trim(),
      map_link: mapLink.trim(),
      authority,
      noc_number: nocNumber.trim(),
      noc_status: nocStatus,
      registration_method: registration.trim(),
      owner_name: ownerName.trim() || name || "Owner",
      owner_phone: ownerPhone.trim(),
      facilities,
      price_total: Number(priceTotal) || 0,
      price_advance: Number(priceAdvance) || 0,
      price_monthly: Number(priceMonthly) || 0,
      photos,
      status,
      verified: false,
      created_by: session.user.id,
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setSent(false);
    setSchemeName("");
    setLocation("");
    setMapLink("");
    setAuthority("QDA");
    setNocNumber("");
    setNocStatus("Under Process");
    setRegistration("");
    setOwnerName("");
    setOwnerPhone("");
    setFacilities(["bijli", "pani", "road"]);
    setPriceTotal("");
    setPriceAdvance("");
    setPriceMonthly("");
    setStatus("Active");
    setFiles([]);
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-white p-12 text-[14px] text-muted">
        <Loader2 size={16} className="animate-spin" /> Checking your session…
      </div>
    );
  }
  if (!session) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <LogIn size={34} className="mx-auto text-green" />
        <h3 className="mt-4 text-[18px] font-bold text-navy">Login Required</h3>
        <p className="mx-auto mt-2 max-w-[380px] text-[13.5px] leading-relaxed text-muted">
          Please login or create a free account to add a scheme. It only takes a minute.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/login/?next=%2Fschemes%2Fadd%2F" className="btn-primary">
            Login to Continue
          </Link>
          <Link href="/signup/?next=%2Fschemes%2Fadd%2F" className="btn-ghost">
            Create Account
          </Link>
        </div>
      </div>
    );
  }
  if (sent) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <BadgeCheck size={38} className="mx-auto text-green" />
        <h3 className="mt-4 text-[18px] font-bold text-navy">Scheme Submitted</h3>
        <p className="mx-auto mt-2 max-w-[420px] text-[13.5px] leading-relaxed text-muted">
          Thanks! Your scheme is now listed as <b className="text-ink">Unverified</b>. Our team
          verifies every scheme and marks trusted ones with a green Verified tick.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/schemes/" className="btn-primary">View Schemes</Link>
          <button onClick={reset} className="btn-ghost">Add Another Scheme</button>
        </div>
      </div>
    );
  }

  return (
    <Reveal>
      <form className="rounded-2xl border border-line bg-white p-6 sm:p-7" onSubmit={submit}>
        <h3 className="mb-5 text-[18px] font-bold text-navy">Scheme Details</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label">Scheme Name *</label>
            <input
              required
              className="field"
              placeholder="e.g. Jinnah Town"
              value={schemeName}
              onChange={(e) => setSchemeName(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Location *</label>
            <input
              required
              className="field"
              placeholder="e.g. Jinnah Town, Quetta-Sibi Highway Road, Quetta"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Google Map Link</label>
            <input
              className="field"
              type="url"
              placeholder="https://maps.google.com/?q=…"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Owner Name *</label>
            <input
              required
              className="field"
              placeholder="Full Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Owner Number *</label>
            <input
              required
              className="field"
              type="tel"
              placeholder="+92 300 1234567"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Approving Authority (منظور کرنے والا ادارہ) *</label>
            <select className="field" value={authority} onChange={(e) => setAuthority(e.target.value)}>
              {Object.keys(AUTHORITIES).map((a) => (
                <option key={a} value={a}>{a} — {AUTHORITIES[a]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">NOC Number</label>
            <input
              className="field"
              placeholder="e.g. QDA/HOUSING/2023/123"
              value={nocNumber}
              onChange={(e) => setNocNumber(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">NOC Status (NOC کی حیثیت) *</label>
            <div className="flex flex-wrap gap-2">
              {NOC_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all ${
                    nocStatus === opt
                      ? opt === "Approved"
                        ? "border-green bg-green-soft text-green"
                        : opt === "Under Process"
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-red-400 bg-red-50 text-red-600"
                      : "border-line text-muted hover:border-green"
                  }`}
                >
                  <input
                    type="radio"
                    name="noc_status"
                    className="sr-only"
                    checked={nocStatus === opt}
                    onChange={() => setNocStatus(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Registration Method (رجسٹریشن کا طریقہ) *</label>
            <input
              required
              className="field"
              placeholder="e.g. Sub-Registrar Office, Quetta"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
            />
            <p className="mt-1 text-[11.5px] text-muted">
              Where buyers complete the plot/file transfer or registration.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Facilities</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FACILITIES.map(({ key, label, Icon }) => {
                const on = facilities.includes(key);
                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-[12.5px] font-semibold transition-all ${
                      on ? "border-green bg-green-soft text-green" : "border-line text-muted hover:border-green"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#1a8754]"
                      checked={on}
                      onChange={() => toggleFac(key)}
                    />
                    <Icon size={14} /> {label}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="field-label">Price — Total (PKR) *</label>
            <input
              required
              className="field"
              type="number"
              min={0}
              placeholder="e.g. 4500000"
              value={priceTotal}
              onChange={(e) => setPriceTotal(e.target.value)}
            />
            {priceTotal && Number(priceTotal) > 0 && (
              <p className="mt-1 text-[12px] font-semibold text-green">{formatPKR(Number(priceTotal))}</p>
            )}
          </div>
          <div>
            <label className="field-label">Price — Advance (PKR)</label>
            <input
              className="field"
              type="number"
              min={0}
              placeholder="e.g. 900000"
              value={priceAdvance}
              onChange={(e) => setPriceAdvance(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Price — Monthly Qist (PKR)</label>
            <input
              className="field"
              type="number"
              min={0}
              placeholder="e.g. 65000"
              value={priceMonthly}
              onChange={(e) => setPriceMonthly(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Status *</label>
            <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Active</option>
              <option>Sold</option>
              <option>Hold</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Photos (up to {MAX_PHOTOS})</label>
            <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-line px-4 py-6 text-center transition-all hover:border-green hover:bg-green-soft/40">
              <CloudUpload size={28} className="text-muted" />
              <span className="mt-2 text-[13px] text-muted">
                {files.length ? (
                  <span className="font-semibold text-green">{files.length} photo(s) selected</span>
                ) : (
                  <>Drag & drop or <span className="font-semibold text-green">click to browse</span></>
                )}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => pickFiles(e.target.files)}
              />
            </label>
            {files.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <span
                    key={`${f.name}-${i}`}
                    className="flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 text-[11.5px] font-semibold text-ink"
                  >
                    {f.name}
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-muted hover:text-red-500"
                      title="Remove"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {err && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
            <AlertCircle size={15} className="mt-0.5 shrink-0" /> {err}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-primary mt-5 w-full disabled:opacity-60">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          {busy ? "Submitting…" : "Submit Scheme"}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-muted">
          <MapPin size={12} className="text-green" />
          New schemes are listed as Unverified until our team verifies them.
        </p>
      </form>
    </Reveal>
  );
}
