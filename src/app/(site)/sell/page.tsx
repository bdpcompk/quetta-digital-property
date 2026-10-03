"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, BadgeCheck, CloudUpload, Eye, Loader2, LogIn, Rocket, Send } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal from "@/components/ui/Reveal";
import { DISTRICTS, formatPKR } from "@/lib/data";
import { initials, useSession } from "@/lib/useSession";

const TYPES = ["Houses", "Plots", "Flats / Apartments", "Commercial", "Agricultural Land", "Shops / Offices", "Farm Houses"];
const SAMPLE_IMG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";

export default function SellPage() {
  const { session, ready, name, supabase: sb } = useSession();
  const [sent, setSent] = useState(false);
  const [postedId, setPostedId] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("For Sale");
  const [type, setType] = useState("Houses");
  const [district, setDistrict] = useState("Quetta");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [desc, setDesc] = useState("");
  const [phone, setPhone] = useState("");
  const [poster, setPoster] = useState("");
  const [img, setImg] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const posterDisplay = poster || name;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb || !session) return;
    setErr("");
    setBusy(true);
    const priceNum = Number(price) || 0;
    let cover = img.trim();
    if (file) {
      const path = `${session.user.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const up = await sb.storage.from("listings").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (up.error) {
        setErr("Photo upload failed: " + up.error.message);
        setBusy(false);
        return;
      }
      cover = sb.storage.from("listings").getPublicUrl(path).data.publicUrl;
    }
    if (!cover) cover = SAMPLE_IMG;
    const who = posterDisplay.trim() || "Property Owner";
    const payload = {
      title: title.trim(),
      price: priceNum,
      priceText: formatPKR(priceNum),
      purpose,
      type,
      beds: Number(beds) || 0,
      baths: Number(baths) || 0,
      area: area.trim(),
      district,
      address: address.trim(),
      agent: who,
      agentAvatar: initials(who),
      verified: false,
      featured: false,
      img: cover,
      images: [cover],
      "desc": desc.trim(),
      features: [],
      phone: phone.trim(),
      created_by: session.user.id,
      status: "pending",
    };
    const { data, error } = await sb.from("properties").insert(payload).select("id").single();
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setPostedId(data?.id ?? null);
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const perks = [
    { Icon: Rocket, t: "Free to Post", s: "List your property free of cost, no hidden charges." },
    { Icon: Eye, t: "Max Exposure", s: "Your listing reaches thousands of buyers in Balochistan." },
    { Icon: BadgeCheck, t: "Quick Verification", s: "Our team verifies your listing within 24 hours." },
  ];

  return (
    <>
      <PageBanner
        title="Post Your Property"
        crumbs={[{ label: "Home", href: "/" }, { label: "Sell / Post Property" }]}
      />
      <section className="section">
        <div className="wrap grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="space-y-4">
              {perks.map(({ Icon, t, s }) => (
                <div key={t} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-navy">{t}</h4>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{s}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl bg-gradient-to-br from-green to-[#0f6b3f] p-6 text-white">
                <h3 className="text-[17px] font-extrabold">Premium Listing Plans</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/85">
                  Boost your property with Featured Ads — appear at the top of search results with a
                  highlight badge.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {!ready ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-white p-12 text-[14px] text-muted">
                <Loader2 size={16} className="animate-spin" /> Checking your session…
              </div>
            ) : !session ? (
              <div className="rounded-2xl border border-line bg-white p-8 text-center">
                <LogIn size={34} className="mx-auto text-green" />
                <h3 className="mt-4 text-[18px] font-bold text-navy">Login Required</h3>
                <p className="mx-auto mt-2 max-w-[380px] text-[13.5px] leading-relaxed text-muted">
                  Please login or create a free account to post your property. It only takes a
                  minute.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link href="/login/?next=%2Fsell%2F" className="btn-primary">
                    Login to Post
                  </Link>
                  <Link href="/signup/?next=%2Fsell%2F" className="btn-ghost">
                    Create Account
                  </Link>
                </div>
              </div>
            ) : sent ? (
              <div className="rounded-2xl border border-line bg-white p-8 text-center">
                <BadgeCheck size={38} className="mx-auto text-green" />
                <h3 className="mt-4 text-[18px] font-bold text-navy">Listing Submitted for Review</h3>
                <p className="mx-auto mt-2 max-w-[400px] text-[13.5px] leading-relaxed text-muted">
                  Thanks! Our team verifies every listing within 24 hours — until then it shows
                  as &quot;Pending&quot; under My Account. You can edit or remove it anytime.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  {postedId !== null && (
                    <Link href={`/property/?id=${postedId}`} className="btn-primary">
                      View Listing
                    </Link>
                  )}
                  <Link href="/my-account/" className="btn-ghost">
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      setSent(false);
                      setTitle("");
                      setPrice("");
                      setArea("");
                      setAddress("");
                      setDesc("");
                      setPhone("");
                      setFile(null);
                      setImg("");
                    }}
                    className="btn-ghost"
                  >
                    Post Another
                  </button>
                </div>
              </div>
            ) : (
              <form className="rounded-2xl border border-line bg-white p-6 sm:p-7" onSubmit={submit}>
                <h3 className="mb-5 text-[18px] font-bold text-navy">Property Details</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="field-label">Property Title</label>
                    <input
                      required
                      className="field"
                      placeholder="e.g. 5 Marla House for Sale in Jinnah Town"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Purpose</label>
                    <select className="field" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                      <option>For Sale</option>
                      <option>For Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Property Type</label>
                    <select className="field" value={type} onChange={(e) => setType(e.target.value)}>
                      {TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">District</label>
                    <select className="field" value={district} onChange={(e) => setDistrict(e.target.value)}>
                      {DISTRICTS.map((d) => <option key={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Full Address / Area</label>
                    <input
                      required
                      className="field"
                      placeholder="e.g. Jinnah Town, Quetta"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Price (PKR)</label>
                    <input
                      required
                      className="field"
                      type="number"
                      min={0}
                      placeholder="e.g. 8500000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    {price && (
                      <p className="mt-1 text-[12px] font-semibold text-green">{formatPKR(Number(price))}</p>
                    )}
                  </div>
                  <div>
                    <label className="field-label">Area Size</label>
                    <input
                      required
                      className="field"
                      placeholder="e.g. 1 Kanal"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Bedrooms</label>
                    <input
                      className="field"
                      type="number"
                      min={0}
                      placeholder="e.g. 4"
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Bathrooms</label>
                    <input
                      className="field"
                      type="number"
                      min={0}
                      placeholder="e.g. 3"
                      value={baths}
                      onChange={(e) => setBaths(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="field-label">Description</label>
                  <textarea
                    rows={4}
                    required
                    className="field resize-y"
                    placeholder="Describe your property..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Your Name</label>
                    <input
                      required
                      className="field"
                      placeholder="Full Name"
                      value={posterDisplay}
                      onChange={(e) => setPoster(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Phone</label>
                    <input
                      required
                      className="field"
                      type="tel"
                      placeholder="+92 300 0000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="field-label">Photos</label>
                  <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-line px-4 py-6 text-center transition-all hover:border-green hover:bg-green-soft/40">
                    <CloudUpload size={28} className="text-muted" />
                    <span className="mt-2 text-[13px] text-muted">
                      {file ? (
                        <span className="font-semibold text-green">{file.name}</span>
                      ) : (
                        <>Drag & drop or <span className="font-semibold text-green">click to browse</span></>
                      )}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <input
                    className="field mt-2"
                    type="url"
                    placeholder="…or paste an image URL"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                  />
                  <p className="mt-1 text-[11.5px] text-muted">
                    Optional — a sample photo is used if left empty.
                  </p>
                </div>

                {err && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" /> {err}
                  </p>
                )}

                <button type="submit" disabled={busy} className="btn-primary mt-5 w-full disabled:opacity-60">
                  <Send size={15} /> {busy ? "Submitting…" : "Submit Listing"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
