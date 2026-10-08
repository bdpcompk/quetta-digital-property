"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle, Building2, CalendarDays, FileCheck2, FileText, MapPin,
  ScrollText, ShieldCheck, UserCog, Users, X,
} from "lucide-react";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { QDA_SCHEMES, VERIFICATION_HISTORY, getQdaSchemes, getVerificationHistory } from "@/lib/data";
import { formatArea } from "@/lib/area";
import type { QdaScheme, VerificationHistory } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  VERIFIED: "bg-green text-white",
  "UNDER VERIFICATION": "bg-amber-500 text-white",
  "NOT VERIFIED": "bg-red-500 text-white",
  REJECTED: "bg-slate-800 text-white",
};

const STATUS_DOTS: Record<string, string> = {
  VERIFIED: "bg-white",
  "UNDER VERIFICATION": "bg-white",
  "NOT VERIFIED": "bg-white",
  REJECTED: "bg-white",
};

const fmtDate = (d: string) => {
  if (!d) return "—";
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) return d;
  return t.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

function StatusBadge({ status, size = "sm" }: { status: string; size?: "sm" | "lg" }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES["UNDER VERIFICATION"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wide ${
        size === "lg" ? "px-3 py-1.5 text-[12px]" : "px-2.5 py-1 text-[10.5px]"
      } ${s}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status] ?? "bg-white"}`} />
      {status}
    </span>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl bg-surface px-3.5 py-3">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 break-words text-[13px] font-bold text-navy">{value || "—"}</p>
    </div>
  );
}

export default function QdaSchemes() {
  const [list, setList] = useState<QdaScheme[]>(QDA_SCHEMES);
  const [hist, setHist] = useState<VerificationHistory[]>(VERIFICATION_HISTORY);
  const [open, setOpen] = useState<QdaScheme | null>(null);

  useEffect(() => {
    getQdaSchemes().then(setList);
    getVerificationHistory().then(setHist);
  }, []);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const final = open?.final_status ?? "UNDER VERIFICATION";
  const isNegative = final === "NOT VERIFIED" || final === "REJECTED";
  const schemeHist = open ? hist.filter((h) => h.scheme === open.name) : [];

  return (
    <section className="section section-alt">
      <div className="wrap">
        <Reveal>
          <SectionHeading title="Scheme Verification & Approval Status" href="/projects/" linkLabel="View All Schemes" />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mb-6 max-w-3xl text-[13.5px] leading-relaxed text-muted">
            Every scheme below carries an independent verification record — approval is only
            claimed when it is backed by an official record (NOC / QVC / NRC number, date and
            issuing authority), not by the advertiser&apos;s word alone.
          </p>
        </Reveal>

        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
          {list.map((s) => (
            <StaggerItem key={s.name}>
              <div className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={s.img} alt={s.name} loading="lazy" className="img-zoom h-full w-full object-cover" />
                  <span className="absolute left-3 top-3">
                    <StatusBadge status={s.final_status ?? "UNDER VERIFICATION"} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-[15.5px] font-bold text-navy">{s.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                    <MapPin size={13} className="text-green" /> {s.district}
                  </p>
                  <div className="mt-3 space-y-1.5 text-[12.5px] text-muted">
                    <p className="flex items-center gap-2">
                      <Building2 size={13} className="text-green" /> Authority: {s.authority || "QDA"}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays size={13} className="text-green" /> NOC Issued: {s.noc}
                    </p>
                    <p className="flex items-center gap-2">
                      <UserCog size={13} className="text-green" /> Developer: {s.developer}
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    <div className="rounded-lg bg-surface px-1 py-2 text-center">
                      <p className="text-[9.5px] font-medium leading-tight text-muted">Total Area</p>
                      <p className="mt-0.5 text-[12px] font-bold text-navy">{formatArea(s.totalArea)}</p>
                    </div>
                    <div className="rounded-lg bg-surface px-1 py-2 text-center">
                      <p className="text-[9.5px] font-medium leading-tight text-muted">Residential Plots</p>
                      <p className="mt-0.5 flex items-center justify-center gap-1 text-[12px] font-bold text-navy">
                        <Users size={11} className="text-green" /> {s.resPlots}
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface px-1 py-2 text-center">
                      <p className="text-[9.5px] font-medium leading-tight text-muted">Commercial Plots</p>
                      <p className="mt-0.5 flex items-center justify-center gap-1 text-[12px] font-bold text-navy">
                        <Building2 size={11} className="text-green" /> {s.comPlots}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setOpen(s)} className="btn-primary mt-4 w-full">
                    <ScrollText size={15} /> View Verification Record
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-10"
          onClick={() => setOpen(null)}
        >
          <div
            className="w-full max-w-[720px] rounded-2xl bg-white p-6 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[19px] font-extrabold leading-snug text-navy">{open.name}</h3>
                <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                  Project / Scheme ID: <b className="text-ink">{open.scheme_id || "—"}</b>
                </p>
              </div>
              <button
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="shrink-0 rounded-lg border border-line p-2 text-muted transition-colors hover:border-green hover:text-green"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StatusBadge status={final} size="lg" />
              <span className="text-[13px] text-muted">
                Last verified: <b className="text-ink">{open.last_verified || "—"}</b>
              </span>
            </div>

            {isNegative && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertTriangle size={17} className="mt-0.5 shrink-0 text-red-500" />
                <p className="text-[12.5px] leading-relaxed text-red-700">
                  This scheme&apos;s approval could not be confirmed from official records available
                  at this time. <b>This status is not by itself conclusive proof of fraud</b> — it
                  means verification is pending or the record could not be located.
                </p>
              </div>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Field label="Scheme / Project Name" value={open.name} />
              <Field label="District" value={open.district} />
              <Field label="Tehsil" value={open.tehsil} />
              <Field label="Location" value={open.location} />
              <Field label="Developer / Sponsor" value={open.developer} />
              <Field label="Relevant Authority" value={open.authority || "QDA"} />
              <Field label="QVC Status" value={open.qvc_status} />
              <Field label="QVC Number" value={open.qvc_number} />
              <Field label="QVC Date" value={open.qvc_date} />
              <Field label="NRC Status" value={open.nrc_status} />
              <Field label="NRC Number" value={open.nrc_number} />
              <Field label="NRC Date" value={open.nrc_date} />
              <Field label="PC-I Status" value={open.pci_status} />
              <Field label="NOC Status" value={open.noc_status} />
              <Field label="Verification Source" value={open.verification_source} />
              <Field label="Last Verified" value={open.last_verified} />
            </div>

            <div className="mt-4 rounded-xl border border-line p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Remarks</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink">
                {open.remarks || "—"}
              </p>
            </div>

            <div className="mt-5">
              <h4 className="flex items-center gap-2 text-[14.5px] font-bold text-navy">
                <FileCheck2 size={16} className="text-green" /> Verification History
              </h4>
              {schemeHist.length ? (
                <ol className="mt-3 space-y-3 border-l-2 border-line pl-4">
                  {schemeHist.map((h) => (
                    <li key={h.id} className="relative">
                      <span className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green" />
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12.5px] font-bold text-ink">{fmtDate(h.created_date)}</span>
                        <StatusBadge status={h.status} />
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
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {open.document ? (
                <a
                  href={`${basePath}${open.document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <FileText size={15} /> View Official Document
                </a>
              ) : (
                <span className="flex items-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-[13px] text-muted">
                  <FileText size={15} /> No official document on file
                </span>
              )}
              <button onClick={() => setOpen(null)} className="btn-ghost">
                Close
              </button>
            </div>

            <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-muted">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-green" />
              Verification is performed against official records of the relevant authority
              (QDA / GDA / concerned department). &quot;Verified&quot; is only claimed when the
              record number, date and project name all match.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
