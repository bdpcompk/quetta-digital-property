"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle, ArrowLeft, Building2, CalendarDays, FileCheck2,
  FileText, Landmark, Loader2, MapPin, ShieldCheck, Users,
} from "lucide-react";
import { QDA_SCHEMES, VERIFICATION_HISTORY, getQdaSchemes, getVerificationHistory } from "@/lib/data";
import { formatArea } from "@/lib/area";
import type { QdaScheme, VerificationHistory } from "@/lib/types";
import SchemeLoanCalculator from "@/components/site/SchemeLoanCalculator";

const STATUS_STYLES: Record<string, string> = {
  VERIFIED: "bg-green text-white",
  "UNDER VERIFICATION": "bg-amber-400 text-navy",
  "NOT VERIFIED": "bg-red-500 text-white",
  REJECTED: "bg-slate-800 text-white",
};

const nocColor = (v?: string) =>
  /not listed/i.test(v ?? "") ? "text-red-500" : /under/i.test(v ?? "") ? "text-amber-600" : "text-green";

const fmtDate = (d: string) => {
  if (!d) return "—";
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) return d;
  return t.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl bg-surface px-3.5 py-3">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 break-words text-[13.5px] font-bold text-navy">{value || "—"}</p>
    </div>
  );
}

const TABS = ["Overview", "Map", "Verification"] as const;
type Tab = (typeof TABS)[number];

export default function QdaSchemeDetail() {
  const params = useSearchParams();
  const name = params?.get("name") ?? "";
  const [q, setQ] = useState<QdaScheme | null>(null);
  const [hist, setHist] = useState<VerificationHistory[]>(VERIFICATION_HISTORY);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("Overview");

  useEffect(() => {
    getQdaSchemes().then((all) => {
      setQ(all.find((x) => x.name === name) ?? null);
      setLoaded(true);
    });
    getVerificationHistory().then(setHist);
  }, [name]);

  if (!loaded) {
    return (
      <div className="flex justify-center py-28">
        <Loader2 className="animate-spin text-green" size={30} />
      </div>
    );
  }

  if (!q) {
    return (
      <div className="wrap py-24 text-center">
        <p className="text-[15px] font-bold text-navy">Scheme not found</p>
        <Link href="/schemes/" className="btn-ghost mt-4 inline-flex">
          <ArrowLeft size={15} /> Back to Schemes
        </Link>
      </div>
    );
  }

  const final = q.final_status ?? "UNDER VERIFICATION";
  const isNegative = final === "NOT VERIFIED" || final === "REJECTED";
  const schemeHist = hist.filter((h) => h.scheme === q.name);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const mapQuery = q.location || `${q.district}, Balochistan, Pakistan`;

  return (
    <section className="section pt-[calc(var(--header-h)+24px)]">
      <div className="wrap">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/schemes/" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-green">
            <ArrowLeft size={15} /> All Schemes
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase ${STATUS_STYLES[final] ?? STATUS_STYLES["UNDER VERIFICATION"]}`}>
              {final}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[11px] font-bold uppercase ring-1 ring-line ${nocColor(q.status)}`}>
              <ShieldCheck size={12} /> NOC: {q.status}
            </span>
            <span className="inline-flex rounded-full bg-navy px-3 py-1.5 text-[11px] font-bold uppercase text-white">
              {q.authority || "QDA"}
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
          <img
            src={q.img || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"}
            alt={q.name}
            className="h-64 w-full object-cover sm:h-96"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"; }}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="text-[26px] font-extrabold leading-tight text-navy">{q.name}</h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-[13.5px] text-muted">
              <MapPin size={15} className="text-green" /> {q.location || q.district}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-lg bg-navy px-2.5 py-1 text-[11.5px] font-semibold text-white">
                {q.authority || "QDA"} Approved Scheme
              </span>
              <span className="rounded-lg bg-green-soft px-2.5 py-1 text-[11.5px] font-semibold text-green">
                {q.registration_method || "Registered Scheme"}
              </span>
            </div>

            <div className="mt-5 flex gap-1 border-b border-line">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
                    tab === t ? "text-green" : "text-muted hover:text-navy"
                  }`}
                >
                  {t}
                  {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-green" />}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {tab === "Overview" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Scheme / Project Name" value={q.name} />
                  <Field label="Scheme ID" value={q.scheme_id} />
                  <Field label="District" value={q.district} />
                  <Field label="Tehsil" value={q.tehsil} />
                  <Field label="Location" value={q.location} />
                  <Field label="Developer / Sponsor" value={q.developer} />
                  <Field label="Relevant Authority" value={q.authority || "QDA"} />
                  <Field label="Registration Method" value={q.registration_method} />
                  <Field label="NOC Status" value={q.noc_status || q.status} />
                  <Field label="NOC Number" value={q.noc} />
                  <Field label="Total Area" value={formatArea(q.totalArea)} />
                  <Field label="Residential Plots" value={q.resPlots} />
                  <Field label="Commercial Plots" value={q.comPlots} />
                  <Field label="Last Verified" value={q.last_verified} />
                </div>
              )}

              {tab === "Map" && (
                <div className="overflow-hidden rounded-2xl border border-line">
                  <iframe
                    title={`Map — ${q.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                    className="h-72 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="border-t border-line bg-white px-4 py-3">
                    <p className="text-[12.5px] text-muted">{mapQuery}</p>
                  </div>
                </div>
              )}

              {tab === "Verification" && (
                <div>
                  {isNegative && (
                    <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <AlertTriangle size={17} className="mt-0.5 shrink-0 text-red-500" />
                      <p className="text-[12.5px] leading-relaxed text-red-700">
                        This scheme&apos;s approval could not be confirmed from official records
                        available at this time. This status is not by itself conclusive proof of
                        fraud — it means verification is pending or the record could not be located.
                      </p>
                    </div>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="QVC Status" value={q.qvc_status} />
                    <Field label="QVC Number" value={q.qvc_number} />
                    <Field label="QVC Date" value={q.qvc_date} />
                    <Field label="NRC Status" value={q.nrc_status} />
                    <Field label="NRC Number" value={q.nrc_number} />
                    <Field label="NRC Date" value={q.nrc_date} />
                    <Field label="PC-I Status" value={q.pci_status} />
                    <Field label="Verification Source" value={q.verification_source} />
                  </div>
                  <div className="mt-4 rounded-xl border border-line p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Remarks</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{q.remarks || "—"}</p>
                  </div>

                  <h4 className="mt-5 flex items-center gap-2 text-[14.5px] font-bold text-navy">
                    <FileCheck2 size={16} className="text-green" /> Verification History
                  </h4>
                  {schemeHist.length ? (
                    <ol className="mt-3 space-y-3 border-l-2 border-line pl-4">
                      {schemeHist.map((h) => (
                        <li key={h.id} className="relative">
                          <span className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green" />
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[12.5px] font-bold text-ink">{fmtDate(h.created_date)}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[h.status] ?? STATUS_STYLES["UNDER VERIFICATION"]}`}>
                              {h.status}
                            </span>
                          </div>
                          <p className="mt-1 text-[12.5px] text-muted">
                            {h.authority && <>Authority: {h.authority} · </>}
                            {h.noc && <>NOC: {h.noc} · </>}
                            Verified by: {h.verified_by || "Admin"} · Source: {h.source || "Official Record"}
                          </p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-2 text-[13px] text-muted">No history entries yet.</p>
                  )}

                  {q.document && (
                    <a href={`${basePath}${q.document}`} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 inline-flex">
                      <FileText size={15} /> View Official Document
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">Verification</p>
              <p className={`mt-1.5 text-[20px] font-extrabold ${final === "VERIFIED" ? "text-green" : "text-amber-600"}`}>
                {final}
              </p>
              <div className="mt-3 space-y-2 border-t border-line pt-3 text-[13px]">
                <p className="flex justify-between text-muted">
                  <span className="flex items-center gap-1.5"><Landmark size={14} /> Authority</span>
                  <b className="text-ink">{q.authority || "QDA"}</b>
                </p>
                <p className="flex justify-between text-muted">
                  <span className="flex items-center gap-1.5"><Users size={14} /> Developer</span>
                  <b className="text-ink">{q.developer || "—"}</b>
                </p>
                <p className="flex justify-between text-muted">
                  <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Last Verified</span>
                  <b className="text-ink">{q.last_verified || "—"}</b>
                </p>
                <p className="flex justify-between text-muted">
                  <span className="flex items-center gap-1.5"><Building2 size={14} /> Total Area</span>
                  <b className="text-ink">{formatArea(q.totalArea) || "—"}</b>
                </p>
              </div>
            </div>

            <SchemeLoanCalculator />

            <p className="flex items-start gap-2 rounded-2xl border border-line bg-white p-4 text-[11.5px] leading-relaxed text-muted">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-green" />
              Verification is performed against official records of the relevant authority.
              &quot;Verified&quot; is only claimed when the record number, date and project name all match.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
