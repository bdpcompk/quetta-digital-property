"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle, BadgeCheck, CloudUpload, Droplets, Film, Flame, Loader2, LogIn,
  MapPin, Plus, Route, Send, X, Zap,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import LocationPicker from "@/components/ui/LocationPicker";
import { AUTHORITIES, formatPKR } from "@/lib/data";
import { BlockRow, PaymentPlanRow } from "@/lib/types";
import { useSession } from "@/lib/useSession";
import { useRoleFeature, useMediaSettings } from "@/lib/useFeatureControl";
import { acceptAttribute, compressImage, isFormatAllowed, makeVideoThumbnail, readVideoDuration, toBytes } from "@/lib/media";

const FACILITIES: { key: string; label: string; Icon: typeof Zap }[] = [
  { key: "bijli", label: "Bijli (Electricity)", Icon: Zap },
  { key: "pani", label: "Pani (Water)", Icon: Droplets },
  { key: "gas", label: "Gas", Icon: Flame },
  { key: "road", label: "Road", Icon: Route },
];

const NOC_OPTIONS = ["Approved", "Under Process", "Not Approved"];

const KEY_FEATURES = [
  "Gated Community",
  "Parks & Playgrounds",
  "Mosque",
  "School",
  "Hospital",
  "Underground Electricity & Water",
  "Easy Access Routes",
];

type SelectedVideo = { file: File; url: string; thumb: File | null; thumbUrl: string | null };

export default function AddSchemeForm() {
  const { session, ready, name, supabase: sb } = useSession();
  const videoOn = useRoleFeature("video_upload");
  const imageOn = useRoleFeature("image_upload");
  const media = useMediaSettings();
  const maxPhotos = media.maxImages;
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [schemeName, setSchemeName] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
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
  const [files, setFiles] = useState<File[]>([]);
  const [videos, setVideos] = useState<SelectedVideo[]>([]);

  const [description, setDescription] = useState("");
  const [resPlots, setResPlots] = useState("");
  const [comPlots, setComPlots] = useState("");
  const [possession, setPossession] = useState("");
  const [developer, setDeveloper] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [approvalDate, setApprovalDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [verifiedOn, setVerifiedOn] = useState("");
  const [approvalDoc, setApprovalDoc] = useState("");
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<BlockRow[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlanRow[]>([]);

  const toggleFac = (key: string) =>
    setFacilities((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]));

  const toggleKeyFeature = (label: string) =>
    setKeyFeatures((prev) => (prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]));

  const addBlock = () =>
    setBlocks((prev) => [...prev, { name: "", total: "", available: "", reserved: "", sold: "" }]);

  const removeBlock = (i: number) =>
    setBlocks((prev) => prev.filter((_, idx) => idx !== i));

  const setBlockField = (i: number, field: keyof BlockRow, value: string) =>
    setBlocks((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });

  const addPlan = () =>
    setPaymentPlans((prev) => [...prev, { plan_type: "", down: "", installment: "", total: "" }]);

  const removePlan = (i: number) =>
    setPaymentPlans((prev) => prev.filter((_, idx) => idx !== i));

  const setPlanField = (i: number, field: keyof PaymentPlanRow, value: string) =>
    setPaymentPlans((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });

  const pickFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    const room = maxPhotos - files.length;
    if (room <= 0) {
      setErr(`Maximum ${maxPhotos} photos allowed`);
      return;
    }
    const accepted: File[] = [];
    const rejected: string[] = [];
    for (const file of Array.from(list)) {
      if (accepted.length >= room) {
        rejected.push(`${file.name}: max ${maxPhotos} photos`);
        continue;
      }
      if (!isFormatAllowed(file, media.imageFormats)) {
        rejected.push(`${file.name}: format not allowed (${media.imageFormats.join(", ")})`);
        continue;
      }
      if (file.size > toBytes(media.maxImageMb)) {
        rejected.push(`${file.name}: over ${media.maxImageMb}MB`);
        continue;
      }
      accepted.push(media.autoCompress ? await compressImage(file) : file);
    }
    setFiles((prev) => [...prev, ...accepted]);
    setErr(rejected.length ? rejected.slice(0, 3).join(" · ") : "");
  };

  const pickVideos = async (list: FileList | null) => {
    if (!list?.length) return;
    const room = media.maxVideos - videos.length;
    if (room <= 0) {
      setErr(`Maximum ${media.maxVideos} video${media.maxVideos > 1 ? "s" : ""} allowed`);
      return;
    }
    const accepted: SelectedVideo[] = [];
    const rejected: string[] = [];
    for (const file of Array.from(list)) {
      if (accepted.length >= room) {
        rejected.push(`${file.name}: max ${media.maxVideos} video${media.maxVideos > 1 ? "s" : ""}`);
        continue;
      }
      if (!isFormatAllowed(file, media.videoFormats)) {
        rejected.push(`${file.name}: format not allowed (${media.videoFormats.join(", ")})`);
        continue;
      }
      if (file.size > toBytes(media.maxVideoMb)) {
        rejected.push(`${file.name}: over ${media.maxVideoMb}MB`);
        continue;
      }
      const duration = await readVideoDuration(file);
      if (duration != null && duration > media.maxDuration * 60 + 1) {
        rejected.push(`${file.name}: longer than ${media.maxDuration} minute${media.maxDuration > 1 ? "s" : ""}`);
        continue;
      }
      const thumb = media.thumbnail ? await makeVideoThumbnail(file) : null;
      accepted.push({
        file,
        url: URL.createObjectURL(file),
        thumb,
        thumbUrl: thumb ? URL.createObjectURL(thumb) : null,
      });
    }
    setVideos((prev) => [...prev, ...accepted]);
    setErr(rejected.length ? rejected.slice(0, 3).join(" · ") : "");
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => {
      const target = prev[index];
      if (target) {
        URL.revokeObjectURL(target.url);
        if (target.thumbUrl) URL.revokeObjectURL(target.thumbUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb || !session) return;
    setErr("");
    setBusy(true);

    if (files.length > maxPhotos) {
      setErr(`Media Settings ke mutabiq maximum ${maxPhotos} photos allowed hain.`);
      setBusy(false);
      return;
    }
    const badPhoto = files.find(
      (file) => !isFormatAllowed(file, media.imageFormats) || file.size > toBytes(media.maxImageMb)
    );
    if (badPhoto) {
      setErr(`Photo "${badPhoto.name}" media limits ke mutabiq nahi hai.`);
      setBusy(false);
      return;
    }
    if (videos.length > media.maxVideos) {
      setErr(`Media Settings ke mutabiq maximum ${media.maxVideos} videos allowed hain.`);
      setBusy(false);
      return;
    }
    const badVideo = videos.find(
      (item) => !isFormatAllowed(item.file, media.videoFormats) || item.file.size > toBytes(media.maxVideoMb)
    );
    if (badVideo) {
      setErr(`Video "${badVideo.file.name}" media limits ke mutabiq nahi hai.`);
      setBusy(false);
      return;
    }

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

    const videoUrls: string[] = [];
    let videoThumbUrl = "";
    for (const [index, item] of videos.entries()) {
      const vpath = `${session.user.id}/${Date.now()}-${index}-video-${item.file.name.replace(/[^\w.-]/g, "_")}`;
      const vup = await sb.storage.from("listings").upload(vpath, item.file, {
        contentType: item.file.type,
        upsert: false,
      });
      if (vup.error) {
        setErr("Video upload failed: " + vup.error.message);
        setBusy(false);
        return;
      }
      videoUrls.push(sb.storage.from("listings").getPublicUrl(vpath).data.publicUrl);
      if (index === 0 && item.thumb) {
        const tpath = `${session.user.id}/${Date.now()}-video-thumb.jpg`;
        const tup = await sb.storage.from("listings").upload(tpath, item.thumb, {
          contentType: "image/jpeg",
          upsert: false,
        });
        if (!tup.error) {
          videoThumbUrl = sb.storage.from("listings").getPublicUrl(tpath).data.publicUrl;
        }
      }
    }

    const { error } = await sb.from("schemes").insert({
      name: schemeName.trim(),
      location: location.trim(),
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
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
      video_url: videoUrls[0] || null,
      video_urls: videoUrls,
      video_thumb: videoThumbUrl || null,
      status: "Pending",
      verified: false,
      created_by: session.user.id,
      description: description.trim(),
      res_plots: resPlots.trim(),
      com_plots: comPlots.trim(),
      possession: possession.trim(),
      developer: developer.trim(),
      contact_person: contactPerson.trim(),
      owner_email: ownerEmail.trim(),
      approval_date: approvalDate.trim(),
      expiry_date: expiryDate.trim(),
      approval_doc: approvalDoc.trim(),
      verified_on: verifiedOn.trim(),
      blocks: JSON.stringify(blocks),
      payment_plans: JSON.stringify(paymentPlans),
      key_features: keyFeatures,
      updates: [],
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
    setCoords(null);
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
    setFiles([]);
    setVideos([]);
    setDescription("");
    setResPlots("");
    setComPlots("");
    setPossession("");
    setDeveloper("");
    setContactPerson("");
    setOwnerEmail("");
    setApprovalDate("");
    setExpiryDate("");
    setVerifiedOn("");
    setApprovalDoc("");
    setKeyFeatures([]);
    setBlocks([]);
    setPaymentPlans([]);
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
        <h3 className="mt-4 text-[18px] font-bold text-navy">Scheme Submitted — Review Pending</h3>
        <p className="mx-auto mt-2 max-w-[440px] text-[13.5px] leading-relaxed text-muted">
          Shukriya! Aap ki scheme <b className="text-amber-600">Pending Review</b> par hai. Admin
          team review kar ke approve karegi — approve hote hi ye publicly live ho jaye gi. Status
          aap &ldquo;My Schemes&rdquo; mein dekh sakte hain.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/profile/schemes/" className="btn-primary">View My Schemes</Link>
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
          <div className="sm:col-span-2">
            <label className="field-label">Exact Location (map par click karein ya search karein)</label>
            <LocationPicker
              lat={coords?.lat ?? null}
              lng={coords?.lng ?? null}
              locationText={location}
              onChange={(la, ln) => setCoords({ lat: la, lng: ln })}
            />
            {coords && (
              <p className="mt-1 text-[12px] font-semibold text-green">
                Location set: {coords.lat}, {coords.lng}
              </p>
            )}
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

          <div className="sm:col-span-2">
            <label className="field-label">Description</label>
            <textarea
              className="field"
              rows={3}
              placeholder="Scheme overview, highlights, and notes…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Residential Plots</label>
            <input
              className="field"
              placeholder="e.g. 500"
              value={resPlots}
              onChange={(e) => setResPlots(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Commercial Plots</label>
            <input
              className="field"
              placeholder="e.g. 50"
              value={comPlots}
              onChange={(e) => setComPlots(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Possession</label>
            <input
              className="field"
              placeholder="e.g. Immediate / 2026"
              value={possession}
              onChange={(e) => setPossession(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Developer</label>
            <input
              className="field"
              placeholder="e.g. QDA / Private Developer"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Contact Person</label>
            <input
              className="field"
              placeholder="Name"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Owner Email</label>
            <input
              className="field"
              type="email"
              placeholder="owner@example.com"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Approval Date</label>
            <input
              className="field"
              type="text"
              placeholder="YYYY-MM-DD"
              value={approvalDate}
              onChange={(e) => setApprovalDate(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Expiry Date</label>
            <input
              className="field"
              type="text"
              placeholder="YYYY-MM-DD"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Verified On</label>
            <input
              className="field"
              type="text"
              placeholder="YYYY-MM-DD"
              value={verifiedOn}
              onChange={(e) => setVerifiedOn(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Approval Document (URL)</label>
            <input
              className="field"
              type="url"
              placeholder="https://…"
              value={approvalDoc}
              onChange={(e) => setApprovalDoc(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Key Features</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {KEY_FEATURES.map((label) => {
                const on = keyFeatures.includes(label);
                return (
                  <label
                    key={label}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-[12.5px] font-semibold transition-all ${
                      on ? "border-green bg-green-soft text-green" : "border-line text-muted hover:border-green"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#1a8754]"
                      checked={on}
                      onChange={() => toggleKeyFeature(label)}
                    />
                    {label}
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

          {imageOn && (
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <label className="field-label">Photos (up to {maxPhotos})</label>
                {files.length > 0 && (
                  <span className="text-[11.5px] font-semibold text-green">
                    {files.length}/{maxPhotos} selected
                  </span>
                )}
              </div>
              <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-line px-4 py-6 text-center transition-all hover:border-green hover:bg-green-soft/40">
                <CloudUpload size={28} className="text-muted" />
                <span className="mt-2 text-[13px] text-muted">
                  {files.length ? (
                    <span className="font-semibold text-green">
                      {files.length} photo(s) selected — click to add more
                    </span>
                  ) : (
                    <>Drag & drop or <span className="font-semibold text-green">click to browse</span></>
                  )}
                </span>
                <span className="mt-1 text-[11px] text-muted">
                  {media.imageFormats.join(", ")} · max {media.maxImageMb}MB each
                  {media.autoCompress ? " · auto-compressed" : ""}
                </span>
                <input
                  type="file"
                  accept={acceptAttribute(media.imageFormats, "image")}
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    void pickFiles(e.target.files);
                    e.currentTarget.value = "";
                  }}
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
          )}

          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-[13px] font-semibold text-navy">Blocks</h4>
              <button
                type="button"
                onClick={addBlock}
                className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-green hover:bg-green-soft/60"
              >
                <Plus size={14} /> Add Block
              </button>
            </div>
            {blocks.length === 0 && (
              <p className="text-[12.5px] text-muted">No blocks added yet.</p>
            )}
            {blocks.map((b, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-5 items-end">
                <input
                  className="field"
                  placeholder="Block name"
                  value={b.name || ""}
                  onChange={(e) => setBlockField(i, "name", e.target.value)}
                />
                <input
                  className="field"
                  type="number"
                  min={0}
                  placeholder="Total"
                  value={b.total || ""}
                  onChange={(e) => setBlockField(i, "total", e.target.value)}
                />
                <input
                  className="field"
                  type="number"
                  min={0}
                  placeholder="Available"
                  value={b.available || ""}
                  onChange={(e) => setBlockField(i, "available", e.target.value)}
                />
                <input
                  className="field"
                  type="number"
                  min={0}
                  placeholder="Reserved"
                  value={b.reserved || ""}
                  onChange={(e) => setBlockField(i, "reserved", e.target.value)}
                />
                <div className="flex items-end gap-2">
                  <input
                    className="field"
                    type="number"
                    min={0}
                    placeholder="Sold"
                    value={b.sold || ""}
                    onChange={(e) => setBlockField(i, "sold", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeBlock(i)}
                    className="text-muted hover:text-red-500"
                    title="Remove block"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {blocks.map((b, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-line bg-white p-3"
                >
                  <div className="mb-2 text-[13px] font-semibold text-navy">
                    {b.name || "Unnamed Block"}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded-xl border border-line px-2.5 py-1 text-[11.5px] text-muted">
                      Total: {b.total || "—"}
                    </span>
                    <span className="rounded-xl border border-line px-2.5 py-1 text-[11.5px] text-muted">
                      Available: {b.available || "—"}
                    </span>
                    <span className="rounded-xl border border-line px-2.5 py-1 text-[11.5px] text-muted">
                      Reserved: {b.reserved || "—"}
                    </span>
                    <span className="rounded-xl border border-line px-2.5 py-1 text-[11.5px] text-muted">
                      Sold: {b.sold || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {videoOn && (
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <label className="field-label">Videos (up to {media.maxVideos})</label>
              {videos.length > 0 && (
                <span className="text-[11.5px] font-semibold text-green">
                  {videos.length}/{media.maxVideos} selected
                </span>
              )}
            </div>
            <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-line px-4 py-6 text-center transition-all hover:border-green hover:bg-green-soft/40">
              <Film size={28} className="text-muted" />
              <span className="mt-2 text-[13px] text-muted">
                {videos.length ? (
                  <span className="font-semibold text-green">
                    {videos.length} video{videos.length > 1 ? "s" : ""} selected — click to add more
                  </span>
                ) : (
                  <>Drag & drop or <span className="font-semibold text-green">click to browse</span></>
                )}
              </span>
              <span className="mt-1 text-[11px] text-muted">
                {media.videoFormats.join(", ")} · max {media.maxVideoMb}MB each · up to{" "}
                {media.maxDuration} minute{media.maxDuration > 1 ? "s" : ""}
              </span>
              <input
                type="file"
                accept={acceptAttribute(media.videoFormats, "video")}
                multiple
                className="hidden"
                onChange={(e) => {
                  void pickVideos(e.target.files);
                  e.currentTarget.value = "";
                }}
              />
            </label>
            {videos.length > 0 && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {videos.map((item, index) => (
                  <div key={item.url} className="relative overflow-hidden rounded-xl border border-line bg-black">
                    {item.thumbUrl ? (
                      <img src={item.thumbUrl} alt="" className="h-32 w-full object-cover" />
                    ) : (
                      <video src={item.url} className="h-32 w-full object-cover" controls />
                    )}
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Video {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      title="Remove video"
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy/80 text-white transition-colors hover:bg-red-500"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-1 text-[11.5px] text-muted">
              The first video is shown first on the scheme page.
              {media.thumbnail ? " A thumbnail is generated automatically." : ""}
            </p>
          </div>
          )}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-[13px] font-semibold text-navy">Payment Plans</h4>
              <button
                type="button"
                onClick={addPlan}
                className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-green hover:bg-green-soft/60"
              >
                <Plus size={14} /> Add Plan
              </button>
            </div>
            {paymentPlans.length === 0 && (
              <p className="text-[12.5px] text-muted">No payment plans added yet.</p>
            )}
            {paymentPlans.map((p, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-4 items-end">
                <input
                  className="field"
                  placeholder="e.g. 5 Marla / 10 Marla"
                  value={p.plan_type || ""}
                  onChange={(e) => setPlanField(i, "plan_type", e.target.value)}
                />
                <input
                  className="field"
                  type="number"
                  min={0}
                  placeholder="Down"
                  value={p.down || ""}
                  onChange={(e) => setPlanField(i, "down", e.target.value)}
                />
                <input
                  className="field"
                  type="number"
                  min={0}
                  placeholder="Installment"
                  value={p.installment || ""}
                  onChange={(e) => setPlanField(i, "installment", e.target.value)}
                />
                <div className="flex items-end gap-2">
                  <input
                    className="field"
                    type="number"
                    min={0}
                    placeholder="Total"
                    value={p.total || ""}
                    onChange={(e) => setPlanField(i, "total", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removePlan(i)}
                    className="text-muted hover:text-red-500"
                    title="Remove plan"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {err && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
            <AlertCircle size={15} className="mt-0.5 shrink-0" /> {err}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-primary mt-5 w-full disabled:opacity-60">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          {busy ? "Submitting…" : "Submit for Review"}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-muted">
          <MapPin size={12} className="text-green" />
          Submitted schemes go through admin review first — they appear publicly only after approval.
        </p>
      </form>
    </Reveal>
  );
}
