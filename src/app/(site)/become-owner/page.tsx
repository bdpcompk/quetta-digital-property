"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, BadgeCheck, Building2, CheckCircle2, FileText, Image as ImageIcon, Info,
  Landmark, Loader2, Mail, MapPin, Phone, Upload, User, X,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import { AUTHORITIES, CITIES, DOC_BUCKET, DOC_LIMITS, docPath } from "@/lib/roleRequests";

const inputCls =
  "w-full rounded-lg border border-white/15 bg-navy-deep/60 px-3.5 py-2.5 text-[14px] text-white placeholder:text-white/35 outline-none transition-colors focus:border-green focus:bg-navy-deep/80";

const labelCls = "mb-1.5 block text-[12.5px] font-semibold text-white/85";

export default function BecomeOwnerPage() {
  const router = useRouter();
  const { session, ready, supabase: sb } = useSession();

  const [orgName, setOrgName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [schemeName, setSchemeName] = useState("");
  const [schemeLocation, setSchemeLocation] = useState("");
  const [authority, setAuthority] = useState(AUTHORITIES[0]);
  const [nocNumber, setNocNumber] = useState("");
  const [files, setFiles] = useState<Record<string, File | null>>({
    logoDoc: null,
    nocDoc: null,
    authorityDoc: null,
    schemeDocs: null,
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (ready && !session) {
    router.replace("/login/?next=%2Fbecome-owner%2F");
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
    if (!files.nocDoc) {
      setErr("NC (No Objection Certificate) upload karna zaroori hai");
      return;
    }
    if (!files.authorityDoc) {
      setErr("Authority Letter upload karna zaroori hai");
      return;
    }
    setBusy(true);
    try {
      const [logo, noc, authDoc, docs] = await Promise.all([
        files.logoDoc ? upload("logoDoc", files.logoDoc) : null,
        files.nocDoc ? upload("nocDoc", files.nocDoc) : null,
        files.authorityDoc ? upload("authorityDoc", files.authorityDoc) : null,
        files.schemeDocs ? upload("schemeDocs", files.schemeDocs) : null,
      ]);

      const { error } = await sb.from("role_requests").insert({
        user_id: session.user.id,
        email: session.user.email ?? email,
        requested_role: "owner",
        full_name: contactPerson.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city,
        owner_org: orgName.trim(),
        contact_person: contactPerson.trim(),
        scheme_name: schemeName.trim(),
        scheme_location: schemeLocation.trim(),
        authority,
        noc_number: nocNumber.trim(),
        logo_doc: logo,
        cnic_copy: noc,
        registration_doc: authDoc,
        extra_docs: docs,
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
      <div className="flex min-h-[60vh] items-center justify-center bg-navy-deep">
        <Loader2 className="animate-spin text-green" size={30} />
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-navy px-4 py-16">
        <div className="mx-auto max-w-[520px] rounded-2xl border border-white/10 bg-navy-deep/60 p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green/15">
            <CheckCircle2 size={34} className="text-green" />
          </span>
          <h1 className="mt-5 text-[22px] font-extrabold text-white">Registration Submitted!</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-white/70">
            Aap ka scheme owner request admin ke paas pahunch gaya hai. Documents verify hone ke
            baad aap ko scheme add karne ka access mil jayega — usually 24-48 ghante me.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/profile/" className="rounded-xl bg-green px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-green-dark">
              My Profile
            </Link>
            <Link href="/schemes/" className="rounded-xl border border-white/20 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-navy-deep/80">
              View All Schemes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy px-4 py-8">
      <div className="mx-auto max-w-[640px]">
        <Link
          href="/profile/"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft size={15} /> Back
        </Link>

        <h1 className="mt-5 text-[26px] font-extrabold text-white">Scheme Owner Registration</h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/65">
          Provide your scheme details and upload the required documents to get verified as a scheme
          owner.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-5">
          {/* Owner / Organization */}
          <section className="rounded-2xl border border-white/10 bg-navy-deep/50 p-4 sm:p-5">
            <h2 className="text-[14.5px] font-extrabold text-green">Owner / Organization Information</h2>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className={labelCls}>Owner / Organization Name *</label>
                <div className="relative">
                  <Building2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    required
                    className={`${inputCls} pl-9`}
                    placeholder="Enter owner or organization name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Contact Person Name *</label>
                <div className="relative">
                  <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    required
                    className={`${inputCls} pl-9`}
                    placeholder="Enter contact person name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Contact Number *</label>
                <div className="relative">
                  <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
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
                <label className={labelCls}>Email Address *</label>
                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
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
                <label className={labelCls}>Address *</label>
                <div className="relative">
                  <MapPin size={15} className="pointer-events-none absolute left-3 top-3 text-white/35" />
                  <textarea
                    required
                    rows={2}
                    className={`${inputCls} resize-none pl-9`}
                    placeholder="Enter complete address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Location / City *</label>
                <div className="relative">
                  <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <select
                    required
                    className={`${inputCls} appearance-none pl-9`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="" className="bg-navy-deep">
                      Select city
                    </option>
                    {CITIES.map((c) => (
                      <option key={c} value={c} className="bg-navy-deep">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Housing Scheme Details */}
          <section className="rounded-2xl border border-white/10 bg-navy-deep/50 p-4 sm:p-5">
            <h2 className="text-[14.5px] font-extrabold text-green">Housing Scheme Details</h2>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className={labelCls}>Scheme Name *</label>
                <div className="relative">
                  <Building2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    required
                    className={`${inputCls} pl-9`}
                    placeholder="Enter scheme name"
                    value={schemeName}
                    onChange={(e) => setSchemeName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Scheme Location *</label>
                <div className="relative">
                  <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    required
                    className={`${inputCls} pl-9`}
                    placeholder="Enter location / area"
                    value={schemeLocation}
                    onChange={(e) => setSchemeLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Approving Authority</label>
                <div className="relative">
                  <Landmark size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <select
                    className={`${inputCls} appearance-none pl-9`}
                    value={authority}
                    onChange={(e) => setAuthority(e.target.value)}
                  >
                    {AUTHORITIES.map((a) => (
                      <option key={a} value={a} className="bg-navy-deep">
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>NC / NOC Number</label>
                <input
                  className={inputCls}
                  placeholder="e.g. QDA/NOC/2024/1123"
                  value={nocNumber}
                  onChange={(e) => setNocNumber(e.target.value)}
                />
              </div>

              <UploadSlot
                slot="logoDoc"
                title="Monogram / Scheme Logo (Optional)"
                hint="JPG, PNG (Max 5MB)"
                file={files.logoDoc}
                onPick={pick}
                onClear={() => setFiles((p) => ({ ...p, logoDoc: null }))}
              />

              <UploadSlot
                slot="nocDoc"
                title="NC (No Objection Certificate) *"
                hint="PDF, JPG, PNG (Max 5MB)"
                file={files.nocDoc}
                required
                onPick={pick}
                onClear={() => setFiles((p) => ({ ...p, nocDoc: null }))}
              />

              <UploadSlot
                slot="authorityDoc"
                title="Authority Letter *"
                hint="PDF, JPG, PNG (Max 5MB)"
                file={files.authorityDoc}
                required
                onPick={pick}
                onClear={() => setFiles((p) => ({ ...p, authorityDoc: null }))}
              />

              <UploadSlot
                slot="schemeDocs"
                title="Scheme Documents (Plans, Brochure, etc.)"
                hint="PDF, JPG, PNG (Max 10MB)"
                file={files.schemeDocs}
                onPick={pick}
                onClear={() => setFiles((p) => ({ ...p, schemeDocs: null }))}
              />
            </div>
          </section>

          {err && (
            <p className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-200">
              <Info size={15} className="mt-0.5 shrink-0" /> {err}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green py-3.5 text-[15px] font-extrabold text-white transition-colors hover:bg-green-dark disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <BadgeCheck size={16} />}
            {busy ? "Submitting…" : "Register as Scheme Owner"}
          </button>

          <p className="text-center text-[13px] text-white/60">
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
}: {
  slot: string;
  title: string;
  hint: string;
  file: File | null;
  required?: boolean;
  onPick: (slot: string, list: FileList | null) => void;
  onClear: () => void;
}) {
  const isImg = slot === "logoDoc";
  return (
    <div>
      <label className={labelCls}>
        {title} {required && <span className="text-green">*</span>}
      </label>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-green/40 bg-green/10 px-4 py-3.5">
          {isImg ? (
            <ImageIcon size={18} className="shrink-0 text-green" />
          ) : (
            <FileText size={18} className="shrink-0 text-green" />
          )}
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-white">
            {file.name}
          </span>
          <span className="text-[11.5px] text-white/50">
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </span>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-white/50 transition-colors hover:text-red-400"
            aria-label="Remove file"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-navy-deep/40 px-4 py-5 text-center transition-colors hover:border-green/60 hover:bg-green/5">
          <Upload size={20} className="text-white/60" />
          <span className="mt-2 text-[13px] font-semibold text-white/85">
            {isImg ? "Upload Scheme Logo" : slot === "schemeDocs" ? "Upload Scheme Documents" : "Upload Document"}
          </span>
          <span className="mt-0.5 text-[11.5px] text-white/45">{hint}</span>
          <input
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
