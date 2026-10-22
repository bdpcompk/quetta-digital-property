"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, BadgeCheck, Building2, CheckCircle2, IdCard, Image as ImageIcon, Info,
  Loader2, Mail, MapPin, Phone, Upload, User, Users, X, FileText,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import {
  AGENCY_TYPES, CITIES, DOC_BUCKET, DOC_LIMITS, docPath,
} from "@/lib/roleRequests";

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-green";

const labelCls = "mb-1.5 block text-[12.5px] font-semibold text-navy";

export default function BecomeAgentPage() {
  const router = useRouter();
  const { session, ready, supabase: sb } = useSession();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [fullName, setFullName] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [agencyType, setAgencyType] = useState(AGENCY_TYPES[0]);
  const [experience, setExperience] = useState("");
  const [files, setFiles] = useState<Record<string, File | null>>({
    registrationDoc: null,
    profilePhoto: null,
    cnicCopy: null,
    logoDoc: null,
    extraDocs: null,
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (ready && !session) {
    router.replace("/login/?next=%2Fbecome-agent%2F");
  }

  const pick = (slot: string, list: FileList | null) => {
    if (!list || !list[0]) return;
    const f = list[0];
    const limit = DOC_LIMITS[slot as keyof typeof DOC_LIMITS] ?? 5;
    if (f.size > limit * 1024 * 1024) {
      setErr(`${f.name} ${limit}MB se bari hai`);
      return;
    }
    setErr("");
    setFiles((p) => ({ ...p, [slot]: f }));
  };

  const upload = async (slot: string, file: File) => {
    if (!sb || !session) return null;
    const path = docPath(session.user.id, slot, file.name);
    const { error } = await sb.storage.from(DOC_BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error(error.message);
    return sb.storage.from(DOC_BUCKET).getPublicUrl(path).data.publicUrl;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb || !session) return;
    setErr("");
    if (!files.registrationDoc) {
      setErr("Registration Authority / License upload karna zaroori hai");
      return;
    }
    if (!files.cnicCopy) {
      setErr("CNIC copy upload karna zaroori hai");
      return;
    }
    setBusy(true);
    try {
      const [regDoc, photo, cnicCopy, logo, extra] = await Promise.all([
        files.registrationDoc ? upload("registrationDoc", files.registrationDoc) : null,
        files.profilePhoto ? upload("profilePhoto", files.profilePhoto) : null,
        files.cnicCopy ? upload("cnicCopy", files.cnicCopy) : null,
        files.logoDoc ? upload("logoDoc", files.logoDoc) : null,
        files.extraDocs ? upload("extraDocs", files.extraDocs) : null,
      ]);

      const { error } = await sb.from("role_requests").insert({
        user_id: session.user.id,
        email: session.user.email ?? email,
        requested_role: "agent",
        full_name: fullName.trim(),
        phone: phone.trim(),
        cnic: cnic.trim(),
        address: address.trim(),
        city,
        agency_name: agencyName.trim(),
        agency_type: agencyType,
        experience: experience.trim(),
        registration_doc: regDoc,
        profile_photo: photo,
        cnic_copy: cnicCopy,
        logo_doc: logo,
        extra_docs: extra,
        status: "pending",
      });
      if (error) throw new Error(error.message);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e2) {
      setErr("Submit nahi ho saka: " + (e2 as Error).message);
    }
    setBusy(false);
  };

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-green" size={30} />
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-surface px-4 py-16">
        <div className="mx-auto max-w-[520px] rounded-2xl border border-line bg-white p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-soft">
            <CheckCircle2 size={34} className="text-green" />
          </span>
          <h1 className="mt-5 text-[22px] font-extrabold text-navy">Registration Submitted!</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            Aap ka agent registration request admin ke paas pahunch gaya hai. Verification ke baad
            aap ko email aur WhatsApp par inform kiya jayega — typically 24-48 ghante me.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/profile/" className="rounded-xl bg-green px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-green-dark">
              My Profile
            </Link>
            <Link href="/agents/" className="rounded-xl border border-line px-5 py-3 text-[14px] font-bold text-navy transition-colors hover:bg-surface">
              View All Agents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-8">
      <div className="mx-auto max-w-[640px]">
        <Link
          href="/profile/"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-navy"
        >
          <ArrowLeft size={15} /> Back
        </Link>

        <h1 className="mt-5 text-[26px] font-extrabold text-navy">Agent Registration</h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
          Fillhouse the typs and upload the required documents to get verified as a property agent.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-5">
          {/* Personal & Business Information */}
          <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
            <h2 className="text-[14.5px] font-extrabold text-green">Personal &amp; Business Information</h2>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className={labelCls}>Full Name *</label>
                <div className="relative">
                  <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/70" />
                  <input
                    required
                    className={`${inputCls} pl-9`}
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>CNIC Number *</label>
                <div className="relative">
                  <IdCard size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/70" />
                  <input
                    required
                    className={`${inputCls} pl-9`}
                    placeholder="e.g. 42101-1234567-1"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Email Address *</label>
                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/70" />
                  <input
                    required
                    type="email"
                    className={`${inputCls} pl-9`}
                    placeholder="you@example.com"
                    value={email || session?.user?.email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Contact Number *</label>
                <div className="relative">
                  <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/70" />
                  <input
                    required
                    type="tel"
                    className={`${inputCls} pl-9`}
                    placeholder="03XX-XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Address *</label>
                <div className="relative">
                  <MapPin size={15} className="pointer-events-none absolute left-3 top-3 text-muted/70" />
                  <textarea
                    required
                    rows={2}
                    className={`${inputCls} resize-none pl-9`}
                    placeholder="Enter your complete address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Location / City *</label>
                <div className="relative">
                  <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/70" />
                  <select
                    required
                    className={`${inputCls} appearance-none pl-9`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">
                      Select city
                    </option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Agency / Business Name</label>
                <div className="relative">
                  <Building2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/70" />
                  <input
                    className={`${inputCls} pl-9`}
                    placeholder="e.g. Khan Property Advisors"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Type of Business *</label>
                <div className="relative">
                  <Users size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/70" />
                  <select
                    className={`${inputCls} appearance-none pl-9`}
                    value={agencyType}
                    onChange={(e) => setAgencyType(e.target.value)}
                  >
                    {AGENCY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Years of Experience</label>
                <input
                  className={inputCls}
                  placeholder="e.g. 5 years"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <UploadSlot
                slot="registrationDoc"
                title="Registration Authority / License *"
                hint="PDF, JPG, PNG (Max 5MB)"
                file={files.registrationDoc}
                required
                onPick={pick}
                onClear={() => setFiles((p) => ({ ...p, registrationDoc: null }))}
                refCb={(el) => (fileRefs.current.registrationDoc = el)}
              />

              <UploadSlot
                slot="profilePhoto"
                title="Your Profile Photo (Optional)"
                hint="JPG, PNG (Max 2MB)"
                file={files.profilePhoto}
                onPick={pick}
                onClear={() => setFiles((p) => ({ ...p, profilePhoto: null }))}
                refCb={(el) => (fileRefs.current.profilePhoto = el)}
              />
            </div>
          </section>

          {/* Verification documents */}
          <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
            <h2 className="text-[14.5px] font-extrabold text-green">Agent Verification Documents</h2>

            <div className="mt-4 space-y-4">
              <UploadSlot
                slot="cnicCopy"
                title="CNIC Copy *"
                hint="Upload CNIC (Front & Back) — PDF, JPG, PNG (Max 5MB)"
                file={files.cnicCopy}
                required
                onPick={pick}
                onClear={() => setFiles((p) => ({ ...p, cnicCopy: null }))}
                refCb={(el) => (fileRefs.current.cnicCopy = el)}
              />

              <UploadSlot
                slot="logoDoc"
                title="Monogram / Agency Logo (Optional)"
                hint="JPG, PNG (Max 5MB)"
                file={files.logoDoc}
                onPick={pick}
                onClear={() => setFiles((p) => ({ ...p, logoDoc: null }))}
                refCb={(el) => (fileRefs.current.logoDoc = el)}
              />

              <UploadSlot
                slot="extraDocs"
                title="Additional Documents (If Any)"
                hint="PDF, JPG, PNG (Max 5MB)"
                file={files.extraDocs}
                onPick={pick}
                onClear={() => setFiles((p) => ({ ...p, extraDocs: null }))}
                refCb={(el) => (fileRefs.current.extraDocs = el)}
              />
            </div>
          </section>

          {err && (
            <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
              <Info size={15} className="mt-0.5 shrink-0" /> {err}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green py-3.5 text-[15px] font-extrabold text-white transition-colors hover:bg-green-dark disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <BadgeCheck size={16} />}
            {busy ? "Submitting…" : "Register as Agent"}
          </button>

          <p className="text-center text-[13px] text-muted">
            Already have an account?{" "}
            <Link href="/login/" className="font-bold text-green hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function UploadSlot({
  slot,
  title,
  hint,
  file,
  required,
  onPick,
  onClear,
  refCb,
}: {
  slot: string;
  title: string;
  hint: string;
  file: File | null;
  required?: boolean;
  onPick: (slot: string, list: FileList | null) => void;
  onClear: () => void;
  refCb: (el: HTMLInputElement | null) => void;
}) {
  const isImg = slot === "profilePhoto" || slot === "logoDoc";
  return (
    <div>
      <label className={labelCls}>
        {title} {required && <span className="text-green">*</span>}
      </label>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-green/40 bg-green-soft px-4 py-3.5">
          {isImg ? (
            <ImageIcon size={18} className="shrink-0 text-green" />
          ) : (
            <FileText size={18} className="shrink-0 text-green" />
          )}
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-navy">
            {file.name}
          </span>
          <span className="text-[11.5px] text-muted">
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </span>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-muted transition-colors hover:text-red-500"
            aria-label="Remove file"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-surface px-4 py-5 text-center transition-colors hover:border-green/60 hover:bg-green/5">
          <Upload size={20} className="text-muted" />
          <span className="mt-2 text-[13px] font-semibold text-navy">
            {isImg ? "Upload Profile Picture" : slot === "extraDocs" ? "Upload Additional Documents" : "Upload File"}
          </span>
          <span className="mt-0.5 text-[11.5px] text-muted">{hint}</span>
          <input
            ref={refCb}
            type="file"
            accept={isImg ? "image/png,image/jpeg" : "application/pdf,image/png,image/jpeg"}
            className="hidden"
            onChange={(e) => onPick(slot, e.target.files)}
          />
        </label>
      )}
    </div>
  );
}
