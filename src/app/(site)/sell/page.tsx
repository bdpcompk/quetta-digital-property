"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, BadgeCheck, CheckCircle2, CloudUpload, Eye, Film, Loader2, LogIn, Rocket, Send, X } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal from "@/components/ui/Reveal";
import LocationPicker from "@/components/ui/LocationPicker";
import { DISTRICTS, formatPKR } from "@/lib/data";
import { initials, useSession } from "@/lib/useSession";
import { useRoleFeature, useMediaSettings } from "@/lib/useFeatureControl";
import { acceptAttribute, compressImage, isFormatAllowed, makeVideoThumbnail, readVideoDuration, toBytes } from "@/lib/media";

const TYPES = ["Houses", "Plots", "Flats / Apartments", "Commercial", "Agricultural Land", "Shops / Offices", "Farm Houses"];
const SAMPLE_IMG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";

type SelectedVideo = { file: File; url: string; thumb: File | null; thumbUrl: string | null };

export default function SellPage() {
  const { session, ready, name, supabase: sb } = useSession();
  const imageOn = useRoleFeature("image_upload");
  const videoOn = useRoleFeature("video_upload");
  const media = useMediaSettings();
  const maxPhotos = media.maxImages;
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
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [videos, setVideos] = useState<SelectedVideo[]>([]);
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);

  const posterDisplay = poster || name;

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

  const pickPhotos = async (list: FileList | null) => {
    if (!list?.length) return;
    const room = maxPhotos - photos.length;
    if (room <= 0) {
      setErr(`Maximum ${maxPhotos} photos allowed`);
      return;
    }
    const accepted: { file: File; url: string }[] = [];
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
      const ready = media.autoCompress ? await compressImage(file) : file;
      accepted.push({ file: ready, url: URL.createObjectURL(ready) });
    }
    setPhotos((prev) => [...prev, ...accepted]);
    setErr(rejected.length ? rejected.slice(0, 3).join(" · ") : "");
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
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
    const coords = picked;
    const priceNum = Number(price) || 0;
    if (photos.length > maxPhotos) {
      setErr(`Media Settings ke mutabiq maximum ${maxPhotos} photos allowed hain.`);
      setBusy(false);
      return;
    }
    const badPhoto = photos.find(
      (p) => !isFormatAllowed(p.file, media.imageFormats) || p.file.size > toBytes(media.maxImageMb)
    );
    if (badPhoto) {
      setErr(`Photo "${badPhoto.file.name}" media limits ke mutabiq nahi hai.`);
      setBusy(false);
      return;
    }
    if (videos.length > media.maxVideos) {
      setErr(`Media Settings ke mutabiq maximum ${media.maxVideos} videos allowed hain.`);
      setBusy(false);
      return;
    }
    const badVideo = videos.find(
      (v) => !isFormatAllowed(v.file, media.videoFormats) || v.file.size > toBytes(media.maxVideoMb)
    );
    if (badVideo) {
      setErr(`Video "${badVideo.file.name}" media limits ke mutabiq nahi hai.`);
      setBusy(false);
      return;
    }
    const imageUrls: string[] = [];
    for (const [index, photo] of photos.entries()) {
      const path = `${session.user.id}/${Date.now()}-${index}-${photo.file.name.replace(/[^\w.-]/g, "_")}`;
      const up = await sb.storage.from("listings").upload(path, photo.file, {
        contentType: photo.file.type,
        upsert: false,
      });
      if (up.error) {
        setErr(`Photo ${index + 1} upload failed: ` + up.error.message);
        setBusy(false);
        return;
      }
      imageUrls.push(sb.storage.from("listings").getPublicUrl(path).data.publicUrl);
    }
    if (img.trim() && imageUrls.length < maxPhotos) imageUrls.push(img.trim());
    if (!imageUrls.length) imageUrls.push(SAMPLE_IMG);
    const cover = imageUrls[0];
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
      lat: coords ? coords.lat : null,
      lng: coords ? coords.lng : null,
      agent: who,
      agentAvatar: initials(who),
      verified: false,
      featured: false,
      img: cover,
      images: imageUrls,
      video_url: videoUrls[0] || null,
      video_urls: videoUrls,
      video_thumb: videoThumbUrl || null,
      "desc": desc.trim(),
      features: [],
      phone: phone.trim(),
      created_by: session.user.id,
      status: "active",
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
    { Icon: BadgeCheck, t: "Instant Live Listing", s: "Your property goes live immediately — no waiting for approval." },
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
                <h3 className="mt-4 text-[18px] font-bold text-navy">Your Listing is Live!</h3>
                <p className="mx-auto mt-2 max-w-[400px] text-[13.5px] leading-relaxed text-muted">
                  Your property is now live and visible to buyers. You can edit or remove it
                  anytime from My Account.
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
                      setPicked(null);
                      setDesc("");
                      setPhone("");
                      photos.forEach((p) => URL.revokeObjectURL(p.url));
                      setPhotos([]);
                      videos.forEach((v) => {
                        URL.revokeObjectURL(v.url);
                        if (v.thumbUrl) URL.revokeObjectURL(v.thumbUrl);
                      });
                      setVideos([]);
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
                  <div className="sm:col-span-2">
                    <label className="field-label">
                      Exact Location (map par click karein ya search karein)
                    </label>
                    <LocationPicker
                      lat={picked?.lat ?? null}
                      lng={picked?.lng ?? null}
                      locationText={[address.trim(), district].filter(Boolean).join(", ")}
                      onChange={(la, ln) => setPicked({ lat: la, lng: ln })}
                    />
                    {picked ? (
                      <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-green">
                        <CheckCircle2 size={13} /> Location set: {picked.lat}, {picked.lng}
                      </p>
                    ) : (
                      <p className="mt-1 text-[12px] text-muted">
                        District ya address change karne par pin khud move ho jata hai — map par click kar ke exact pin bhi laga sakte hain.
                      </p>
                    )}
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
                      placeholder="e.g. 1,361 sq ft or 1 Acre"
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

                {imageOn && (
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-2">
                    <label className="field-label">Photos (up to {maxPhotos})</label>
                    {photos.length > 0 && (
                      <span className="text-[11.5px] font-semibold text-green">
                        {photos.length}/{maxPhotos} selected
                      </span>
                    )}
                  </div>
                  <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-line px-4 py-6 text-center transition-all hover:border-green hover:bg-green-soft/40">
                    <CloudUpload size={28} className="text-muted" />
                    <span className="mt-2 text-[13px] text-muted">
                      {photos.length > 0 ? (
                        <>
                          <span className="font-semibold text-green">
                            {photos.length} photo{photos.length > 1 ? "s" : ""} selected
                          </span>{" "}
                          — click to add more
                        </>
                      ) : (
                        <>Select multiple photos or <span className="font-semibold text-green">click to browse</span></>
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
                        void pickPhotos(e.target.files);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                  {photos.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {photos.map((p, index) => (
                        <div key={p.url} className="group relative aspect-square overflow-hidden rounded-lg border border-line">
                          <img src={p.url} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            title="Remove photo"
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy/80 text-white transition-colors hover:bg-red-500"
                          >
                            <X size={13} />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1.5 left-1.5 rounded bg-green px-1.5 py-0.5 text-[10px] font-bold text-white">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-[11.5px] text-muted">
                    Select multiple photos — the first photo will be the cover.
                  </p>
                  <input
                    className="field mt-2"
                    type="url"
                    placeholder="…or paste an image URL (optional)"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                  />
                  <p className="mt-1 text-[11.5px] text-muted">
                    Optional — counts toward the photo limit. A sample photo is used if empty.
                  </p>
                </div>
                )}

                {videoOn && (
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-2">
                    <label className="field-label">
                      Videos (up to {media.maxVideos})
                    </label>
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
                        <>
                          <span className="font-semibold text-green">
                            {videos.length} video{videos.length > 1 ? "s" : ""} selected
                          </span>{" "}
                          — click to add more
                        </>
                      ) : (
                        <>Select video{videoOn ? "s" : ""} or <span className="font-semibold text-green">click to browse</span></>
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
                    The first video is shown first on the property page.
                    {media.thumbnail ? " A thumbnail is generated automatically." : ""}
                  </p>
                </div>
                )}

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
