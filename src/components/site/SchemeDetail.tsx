"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, BadgeCheck, Building2, Calendar, Check, ChevronRight, Droplets,
  ExternalLink, FileText, Flame, Heart, Landmark, Loader2, MapPin, Phone, Play,
  Route, ScrollText, ShieldCheck, Users, Wallet, Zap,
} from "lucide-react";
import { AUTHORITIES, formatPKR, getSchemeById } from "@/lib/data";
import { useSession } from "@/lib/useSession";
import { formatArea } from "@/lib/area";
import { useLang } from "@/components/layout/LanguageProvider";
import type { Scheme } from "@/lib/types";
import Reviews from "@/components/site/Reviews";

const FAC: Record<string, string> = { bijli: "Bijli", pani: "Pani", gas: "Gas", road: "Road" };
const FAC_ICON: Record<string, typeof Zap> = { bijli: Zap, pani: Droplets, gas: Flame, road: Route };

const NOC_CHIP: Record<string, string> = {
  Approved: "bg-green text-white",
  "Under Process": "bg-amber-400 text-navy",
  "Not Approved": "bg-red-500 text-white",
};

const TAB_LIST = [
  "Overview", "Blocks & Plots", "Facilities", "Payment Plan",
  "Location & Map", "Documents", "Gallery", "Reviews",
] as const;
type Tab = (typeof TAB_LIST)[number];

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-surface px-3.5 py-3">
      <span className="mt-0.5 text-green">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 break-words text-[13.5px] font-bold text-navy">{value}</p>
      </div>
    </div>
  );
}

export default function SchemeDetail() {
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const { t } = useLang();
  const { session, ready } = useSession();
  const [s, setS] = useState<Scheme | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [photo, setPhoto] = useState(0);
  const [tab, setTab] = useState<Tab>("Overview");
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    getSchemeById(id).then((sch) => {
      if (!alive) return;
      setS(sch);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  if (id && !loaded) {
    return (
      <div className="flex justify-center py-28">
        <Loader2 className="animate-spin text-green" size={30} />
      </div>
    );
  }

  if (!s) {
    return (
      <div className="wrap py-24 text-center">
        <p className="text-[15px] font-bold text-navy">{t("Scheme not found")}</p>
        <Link href="/schemes/" className="btn-ghost mt-4 inline-flex">
          <ArrowLeft size={15} /> {t("Back to Schemes")}
        </Link>
      </div>
    );
  }

  const isOwner = !!session && !!s.created_by && s.created_by === session.user.id;
  if (s.status !== "Active" && !isOwner) {
    if (!ready) {
      return (
        <div className="flex justify-center py-28">
          <Loader2 className="animate-spin text-green" size={30} />
        </div>
      );
    }
    return (
      <div className="wrap py-24 text-center">
        <p className="text-[15px] font-bold text-navy">
          {session ? t("Scheme not published yet") : t("Scheme not found")}
        </p>
        <p className="mx-auto mt-2 max-w-[440px] text-[13.5px] leading-relaxed text-muted">
          {session
            ? t("This scheme is currently under admin review. It will appear publicly once approved.")
            : t("This scheme is currently not available.")}
        </p>
        <Link href="/schemes/" className="btn-ghost mt-4 inline-flex">
          <ArrowLeft size={15} /> {t("Back to Schemes")}
        </Link>
      </div>
    );
  }

  const photos = s.photos ?? [];
  const blocks = s.blocks ?? [];
  const paymentPlans = s.payment_plans ?? [];
  const keyFeatures = s.key_features ?? [];
  const updates = s.updates ?? [];
  const authFull = AUTHORITIES[s.authority] ?? s.authority;
  const nocChip = NOC_CHIP[s.noc_status] ?? "bg-slate-500 text-white";
  const mapQuery = s.location || "Balochistan, Pakistan";
  const mediaCount = photos.length + (s.video_url ? 1 : 0);
  const idx = photos.length ? Math.min(photo, photos.length - 1) : 0;
  const hasPrices = s.price_total > 0 || s.price_advance > 0 || s.price_monthly > 0;

  const stats: { label: string; value: string }[] = [];
  if (s.total_area) stats.push({ label: t("Total Area"), value: formatArea(s.total_area) });
  if (s.total_plots) stats.push({ label: t("Total Plots"), value: s.total_plots });
  if (s.res_plots) stats.push({ label: t("Residential Plots"), value: s.res_plots });
  if (s.com_plots) stats.push({ label: t("Commercial Plots"), value: s.com_plots });
  if (s.possession) stats.push({ label: t("Expected Possession"), value: s.possession });

  const visibleTabs = TAB_LIST.filter((tb) => {
    if (tb === "Blocks & Plots") return blocks.length > 0;
    if (tb === "Payment Plan") return paymentPlans.length > 0 || hasPrices;
    if (tb === "Documents") return !!s.approval_doc;
    if (tb === "Gallery") return photos.length > 0 || !!s.video_url;
    return true;
  });
  const activeTab: Tab = visibleTabs.includes(tab) ? tab : "Overview";

  const prevPhoto = () => setPhoto((i) => (i - 1 + photos.length) % photos.length);
  const nextPhoto = () => setPhoto((i) => (i + 1) % photos.length);

  return (
    <section className="section pt-[calc(var(--header-h)+24px)]">
      <div className="wrap">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/schemes/" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-green">
            <ArrowLeft size={15} /> {t("All Schemes")}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase ${nocChip}`}>
              <ShieldCheck size={12} /> {t("NOC")}: {s.noc_status}
            </span>
            {s.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green px-3 py-1.5 text-[11px] font-bold uppercase text-white">
                <BadgeCheck size={12} /> {t("Verified")}
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-surface px-3 py-1.5 text-[11px] font-bold uppercase text-slate-500 ring-1 ring-line">
                {t("Unverified")}
              </span>
            )}
            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold uppercase text-white ${
                s.status === "Pending" ? "bg-amber-500" : s.status === "Rejected" ? "bg-red-500" : "bg-navy"
              }`}
            >
              {s.status}
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
          {photos.length > 0 ? (
            <>
              <img
                src={photos[idx]}
                alt={s.name}
                className="h-64 w-full object-cover sm:h-[420px]"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200";
                }}
              />
              <span className="absolute left-4 top-4 rounded-full bg-navy/80 px-3 py-1 text-[11px] font-bold text-white">
                {idx + 1} / {photos.length}
              </span>
              {mediaCount > 1 && (
                <span className="absolute bottom-4 left-4 rounded-full bg-green px-3 py-1.5 text-[11.5px] font-bold text-white">
                  +{mediaCount} {t("Photos & Videos")}
                </span>
              )}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    aria-label={t("Previous photo")}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-105"
                  >
                    <ArrowLeft size={18} className="rotate-180 text-navy" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    aria-label={t("Next photo")}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-105"
                  >
                    <ChevronRight size={18} className="text-navy" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex h-64 items-center justify-center text-muted sm:h-[420px]">
              <MapPin size={44} />
            </div>
          )}
          <button
            onClick={() => setFav((v) => !v)}
            aria-label={t("Save scheme")}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-105"
          >
            <Heart size={17} className={fav ? "fill-red-500 text-red-500" : "text-navy"} />
          </button>
        </div>

        {photos.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {photos.map((p, i) => (
              <button
                key={p + i}
                onClick={() => setPhoto(i)}
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  i === idx ? "border-green" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={p} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {s.video_url && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-black">
            <video src={s.video_url} className="h-64 w-full object-cover sm:h-96" controls playsInline />
          </div>
        )}

        {stats.length > 0 && (
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {stats.map((st) => (
              <div key={st.label} className="shrink-0 rounded-xl border border-line bg-white px-4 py-2.5">
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{st.label}</p>
                <p className="mt-0.5 text-[15px] font-extrabold text-navy">{st.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <h1 className="text-[26px] font-extrabold leading-tight text-navy sm:text-[30px]">{s.name}</h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-muted">
            <MapPin size={15} className="text-green" /> {s.location}
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <aside className="space-y-4 lg:order-2 lg:col-span-2">
            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                <ShieldCheck size={16} className="text-green" /> {t("Scheme Verification Status")}
              </p>
              {s.verified ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-soft px-3.5 py-3">
                  <BadgeCheck size={20} className="shrink-0 text-green" />
                  <div>
                    <p className="text-[13.5px] font-bold text-navy">{t("Verified")}</p>
                    {s.verified_on && (
                      <p className="text-[11.5px] text-muted">{t("Verified on")}: {s.verified_on}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-3 rounded-xl bg-surface px-3.5 py-3 text-[13px] font-semibold text-slate-500">
                  {t("Not Verified")}
                </p>
              )}
              <div className="mt-3 space-y-2.5">
                <InfoRow icon={<Landmark size={16} />} label={t("Approving Authority")} value={authFull || "—"} />
                <InfoRow icon={<ScrollText size={16} />} label={t("NOC Status")} value={s.noc_status || "—"} />
                <InfoRow icon={<FileText size={16} />} label={t("Approval No.")} value={s.noc_number || "—"} />
                {s.approval_date && (
                  <InfoRow icon={<Calendar size={16} />} label={t("Approval Date")} value={s.approval_date} />
                )}
                {s.expiry_date && (
                  <InfoRow icon={<Calendar size={16} />} label={t("Expiry Date")} value={s.expiry_date} />
                )}
              </div>
              {s.approval_doc && (
                <a
                  href={s.approval_doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost mt-3 w-full"
                >
                  <FileText size={14} /> {t("View Approval Documents")} <ExternalLink size={13} />
                </a>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                <Users size={16} className="text-green" /> {t("Scheme Owner / Developer")}
              </p>
              <p className="mt-3 text-[16px] font-extrabold text-ink">{s.developer || s.owner_name || "—"}</p>
              <div className="mt-3 space-y-2.5">
                {s.contact_person && <InfoRow icon={<Users size={16} />} label={t("Contact Person")} value={s.contact_person} />}
                {s.owner_phone && (
                  <InfoRow icon={<Phone size={16} />} label={t("Phone")} value={s.owner_phone} />
                )}
                {s.owner_email && (
                  <InfoRow icon={<FileText size={16} />} label={t("Email")} value={s.owner_email} />
                )}
              </div>
              {s.owner_phone && (
                <div className="mt-4 grid gap-2">
                  <a href={`tel:${s.owner_phone.replace(/\s/g, "")}`} className="btn-primary w-full">
                    <Phone size={15} /> {t("Contact Now")}
                  </a>
                  <a
                    href={`https://wa.me/${s.owner_phone.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost w-full"
                  >
                    {t("WhatsApp")}
                  </a>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                <MapPin size={16} className="text-green" /> {t("Location")}
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{s.location}</p>
              {s.map_link && (
                <a href={s.map_link} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-3 w-full">
                  <ExternalLink size={14} /> {t("View on Map")}
                </a>
              )}
            </div>
          </aside>

          <div className="lg:order-1 lg:col-span-3">
            <div className="flex flex-wrap items-end gap-x-1 border-b border-line">
              {visibleTabs.map((tb) => (
                <button
                  key={tb}
                  onClick={() => setTab(tb)}
                  className={`relative shrink-0 px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
                    activeTab === tb ? "text-green" : "text-muted hover:text-navy"
                  }`}
                >
                  {t(tb)}
                  {activeTab === tb && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-green" />}
                </button>
              ))}
            </div>

            <div className="mt-5">
              {activeTab === "Overview" && (
                <div>
                  <h3 className="text-[16px] font-extrabold text-navy">{t("Description")}</h3>
                  <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-muted">
                    {s.description || t("No description available yet.")}
                  </p>

                  {keyFeatures.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-[16px] font-extrabold text-navy">{t("Key Features")}</h3>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {keyFeatures.map((f, i) => (
                          <li key={f + i} className="flex items-center gap-2 rounded-xl bg-green-soft px-3.5 py-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green">
                              <Check size={12} className="text-white" />
                            </span>
                            <span className="text-[13.5px] font-semibold text-navy">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {updates.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-[16px] font-extrabold text-navy">{t("Latest Updates")}</h3>
                      <div className="mt-3 space-y-2.5">
                        {updates.map((u, i) => (
                          <div key={i} className="rounded-xl border border-line bg-white p-4">
                            <div className="flex items-center gap-2 text-[12px] font-semibold text-green">
                              <Calendar size={13} /> {u.date || "—"}
                            </div>
                            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{u.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Blocks & Plots" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {blocks.map((b, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
                      {b.map_img ? (
                        <img src={b.map_img} alt={b.name || ""} className="h-36 w-full object-cover" />
                      ) : (
                        <div className="flex h-36 w-full items-center justify-center bg-surface">
                          <Building2 size={30} className="text-muted" />
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-[15px] font-extrabold text-navy">{b.name || "—"}</p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {b.total && (
                            <span className="rounded-lg bg-navy px-2.5 py-1 text-[11px] font-bold text-white">
                              {t("Total")}: {b.total}
                            </span>
                          )}
                          {b.available && (
                            <span className="rounded-lg bg-green-soft px-2.5 py-1 text-[11px] font-bold text-green">
                              {t("Available")}: {b.available}
                            </span>
                          )}
                          {b.reserved && (
                            <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                              {t("Reserved")}: {b.reserved}
                            </span>
                          )}
                          {b.sold && (
                            <span className="rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                              {t("Sold")}: {b.sold}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Facilities" && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(s.facilities ?? []).length === 0 ? (
                    <p className="text-[13px] text-muted">{t("No facilities listed.")}</p>
                  ) : (
                    (s.facilities ?? []).map((f) => {
                      const Icon = FAC_ICON[f] ?? Building2;
                      return (
                        <div key={f} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-soft">
                            <Icon size={18} className="text-green" />
                          </span>
                          <span className="text-[14px] font-bold text-navy">{FAC[f] ?? f}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === "Payment Plan" && (
                <div>
                  {hasPrices && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {s.price_total > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-green-soft px-3.5 py-2 text-[13px] font-bold text-green">
                          <Wallet size={14} /> {t("Total Price")}: {formatPKR(s.price_total)}
                        </span>
                      )}
                      {s.price_advance > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface px-3.5 py-2 text-[13px] font-bold text-navy">
                          <Wallet size={14} /> {t("Down Payment")}: {formatPKR(s.price_advance)}
                        </span>
                      )}
                      {s.price_monthly > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface px-3.5 py-2 text-[13px] font-bold text-navy">
                          <Wallet size={14} /> {t("Monthly Installment")}: {formatPKR(s.price_monthly)}
                        </span>
                      )}
                    </div>
                  )}
                  {paymentPlans.length > 0 ? (
                    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
                      <table className="w-full min-w-[540px] text-left">
                        <thead className="bg-surface">
                          <tr className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                            <th className="px-4 py-3">{t("Plan Type")}</th>
                            <th className="px-4 py-3">{t("Down Payment")}</th>
                            <th className="px-4 py-3">{t("Installment")}</th>
                            <th className="px-4 py-3">{t("Total Price")}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {paymentPlans.map((p, i) => (
                            <tr key={i} className="text-[13.5px]">
                              <td className="px-4 py-3 font-bold text-navy">{p.plan_type || "—"}</td>
                              <td className="px-4 py-3 text-muted">{p.down || "—"}</td>
                              <td className="px-4 py-3 text-muted">{p.installment || "—"}</td>
                              <td className="px-4 py-3 font-semibold text-ink">{p.total || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-[13px] text-muted">{t("No payment plan details available.")}</p>
                  )}
                </div>
              )}

              {activeTab === "Location & Map" && (
                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                  <iframe
                    title={`Map — ${s.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                    className="h-72 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3">
                    <p className="text-[12.5px] text-muted">{s.location}</p>
                    <a
                      href={s.map_link || `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      <ExternalLink size={14} /> {t("View on Google Maps")}
                    </a>
                  </div>
                </div>
              )}

              {activeTab === "Documents" && (
                <div className="rounded-2xl border border-line bg-white p-5">
                  <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
                    <FileText size={16} className="text-green" /> {t("Documents")}
                  </p>
                  {s.approval_doc ? (
                    <a
                      href={s.approval_doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-3 rounded-xl bg-surface px-4 py-3.5 transition-colors hover:bg-green-soft"
                    >
                      <FileText size={18} className="shrink-0 text-green" />
                      <span className="flex-1 text-[13.5px] font-bold text-navy">{t("View Approval Documents")}</span>
                      <ExternalLink size={14} className="shrink-0 text-muted" />
                    </a>
                  ) : (
                    <p className="mt-3 text-[13px] text-muted">{t("No approval document uploaded yet.")}</p>
                  )}
                </div>
              )}

              {activeTab === "Gallery" && (
                <div>
                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {photos.map((p, i) => (
                        <button
                          key={p + i}
                          onClick={() => {
                            setPhoto(i);
                            setTab("Overview");
                          }}
                          className="overflow-hidden rounded-xl border border-line transition-transform hover:scale-[1.02]"
                        >
                          <img src={p} alt="" className="h-28 w-full object-cover sm:h-36" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-muted">{t("No photos or videos available.")}</p>
                  )}
                  {s.video_url && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-black">
                      <div className="relative">
                        <video src={s.video_url} className="h-64 w-full object-cover sm:h-96" controls playsInline />
                        <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1 text-[11px] font-bold text-white">
                          <Play size={11} /> {t("Video")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Reviews" && <Reviews targetType="scheme" targetId={s.id} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
