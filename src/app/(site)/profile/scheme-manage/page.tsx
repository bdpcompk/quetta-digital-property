"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Building2, Camera, CheckCircle2, FileText, Info, Loader2, MapPin, Minus, Plus,
  PlusCircle, Save, Trash2, Wallet, AlertCircle, LogIn,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import { useLang } from "@/components/layout/LanguageProvider";
import { compressImage } from "@/lib/media";
import type { BlockRow } from "@/lib/types";

type SchemeRow = {
  id: number;
  name: string;
  location?: string | null;
  total_plots?: string | null;
  res_plots?: string | null;
  com_plots?: string | null;
  blocks?: unknown;
  approval_doc?: string | null;
  approval_date?: string | null;
  expiry_date?: string | null;
  noc_status?: string | null;
};

function num(v: string | number | null | undefined) {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function text(v: unknown) {
  return v === null || v === undefined ? "" : String(v);
}

/** Scheme `blocks` is sometimes a JSON string, sometimes an array. */
function blocksFrom(raw: unknown): BlockRow[] {
  let list: unknown = raw;
  if (typeof raw === "string") {
    if (!raw.trim()) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      list = parsed;
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];
  return list.map((item) => {
    const b = (item ?? {}) as Record<string, unknown>;
    return {
      name: text(b.name),
      total: text(b.total),
      available: text(b.available),
      reserved: text(b.reserved),
      sold: text(b.sold),
      map_img: text(b.map_img),
    };
  });
}

const EMPTY_BLOCK: BlockRow = {
  name: "",
  total: "",
  available: "",
  reserved: "",
  sold: "",
  map_img: "",
};

/** Normalise block rows before storing them in the schemes.blocks JSON column. */
function blocksPayload(list: BlockRow[]) {
  return list.map((b, i) => ({
    name: b.name?.trim() || `Block ${i + 1}`,
    total: String(num(b.total)),
    available: String(num(b.available)),
    reserved: String(num(b.reserved)),
    sold: String(num(b.sold)),
    map_img: b.map_img ?? "",
  }));
}

/** Inner component that uses useSearchParams — must live under Suspense. */
function SchemeManageInner() {
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const { session, ready, supabase: sb } = useSession();
  const { t } = useLang();

  const [scheme, setScheme] = useState<SchemeRow | null>(null);
  const [blocks, setBlocks] = useState<BlockRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadErr, setLoadErr] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [approvalDate, setApprovalDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [nocStatus, setNocStatus] = useState("Under Process");
  const [docDirty, setDocDirty] = useState(false);
  const [docSaving, setDocSaving] = useState(false);
  const [docNotice, setDocNotice] = useState("");
  const [docErr, setDocErr] = useState("");
  const [picUploading, setPicUploading] = useState<number | null>(null);
  const [picNotice, setPicNotice] = useState("");
  const [picErr, setPicErr] = useState("");

  useEffect(() => {
    if (!sb || !session || !id) return;
    let alive = true;

    const fetchScheme = async () => {
      const { data, error } = await sb
        .from("schemes")
        .select("id,name,location,total_plots,res_plots,com_plots,blocks,approval_doc,approval_date,expiry_date,noc_status")
        .eq("id", id)
        .eq("created_by", session.user.id)
        .maybeSingle();
      if (!alive) return;
      if (error) {
        setLoadErr(error.message);
        setLoaded(true);
        return;
      }
      if (!data) {
        setLoadErr("Scheme nahi mila ya aap iske owner nahi hain.");
        setLoaded(true);
        return;
      }
      const row = data as SchemeRow;
      setScheme(row);
      setBlocks(blocksFrom(row.blocks));
      setDocUrl(row.approval_doc ?? "");
      setApprovalDate(row.approval_date ?? "");
      setExpiryDate(row.expiry_date ?? "");
      setNocStatus(row.noc_status || "Under Process");
      setDocDirty(false);
      setDirty(false);
      setLoaded(true);
    };

    void fetchScheme();

    const ch = sb
      .channel(`scheme-manage-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "schemes", filter: `id=eq.${id}` },
        () => {
          void fetchScheme();
        }
      )
      .subscribe();

    return () => {
      alive = false;
      void sb.removeChannel(ch);
    };
  }, [sb, session, id]);

  // Quick Actions link to #documents / #blocks — scroll once the scheme is loaded.
  useEffect(() => {
    if (!loaded) return;
    const hash = window.location.hash;
    if (!hash) return;
    const timer = window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [loaded]);

  const touch = () => {
    setDirty(true);
    setNotice("");
    setSaveErr("");
  };

  const setField = (i: number, field: keyof BlockRow, value: string) => {
    setBlocks((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
    touch();
  };

  /** Ek plot sold: available -1, sold +1. */
  const markSold = (i: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      const b = next[i];
      const available = num(b.available);
      if (available > 0) {
        next[i] = {
          ...b,
          available: String(available - 1),
          sold: String(num(b.sold) + 1),
        };
      }
      return next;
    });
    touch();
  };

  /** Galti se sold ho gaya ho to wapas available: sold -1, available +1. */
  const markAvailable = (i: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      const b = next[i];
      const sold = num(b.sold);
      if (sold > 0) {
        next[i] = {
          ...b,
          sold: String(sold - 1),
          available: String(num(b.available) + 1),
        };
      }
      return next;
    });
    touch();
  };

  const addBlock = () => {
    setBlocks((prev) => [...prev, { ...EMPTY_BLOCK }]);
    touch();
  };

  const removeBlock = (i: number) => {
    setBlocks((prev) => prev.filter((_, idx) => idx !== i));
    touch();
  };

  const totalFromScheme =
    num(scheme?.total_plots) || num(scheme?.res_plots) + num(scheme?.com_plots);

  const seedBlock = () => {
    setBlocks([
      {
        name: "Block A",
        total: totalFromScheme ? String(totalFromScheme) : "",
        available: totalFromScheme ? String(totalFromScheme) : "",
        reserved: "0",
        sold: "0",
        map_img: "",
      },
    ]);
    touch();
  };

  const save = async () => {
    if (!sb || !session) return;
    setSaveErr("");
    setNotice("");

    for (const b of blocks) {
      const total = num(b.total);
      const used = num(b.available) + num(b.reserved) + num(b.sold);
      if (used > total) {
        setSaveErr(
          `${b.name || "Block"}: Available + Reserved + Sold (${used}) Total (${total}) se zyada nahi ho sakte.`
        );
        return;
      }
    }

    const payload = blocksPayload(blocks);

    setSaving(true);
    const { error } = await sb
      .from("schemes")
      .update({ blocks: JSON.stringify(payload) })
      .eq("id", id)
      .eq("created_by", session.user.id);
    setSaving(false);

    if (error) {
      setSaveErr(error.message);
      return;
    }
    setBlocks(payload);
    setDirty(false);
    setNotice("Plot stock save ho gaya — Available aur Sold counts update ho gaye hain.");
  };

  const persistBlockImages = async (next: BlockRow[], message: string) => {
    if (!sb || !session) return;
    setPicErr("");
    setPicNotice("");
    const payload = blocksPayload(next);
    const { error } = await sb
      .from("schemes")
      .update({ blocks: JSON.stringify(payload) })
      .eq("id", id)
      .eq("created_by", session.user.id);
    if (error) {
      setPicErr(error.message);
      setDirty(true);
      return;
    }
    setBlocks(payload);
    setDirty(false);
    setPicNotice(message);
  };

  const uploadBlockImage = async (i: number, file?: File) => {
    if (!file || !sb || !session) return;
    setPicErr("");
    setPicNotice("");
    if (!file.type.startsWith("image/")) {
      setPicErr("Picture ke liye image file chunein (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPicErr("Picture 5MB se choti honi chahiye.");
      return;
    }
    setPicUploading(i);
    const ready = await compressImage(file, 1600, 0.8);
    const path = `${session.user.id}/blocks/${id}-${Date.now()}-${ready.name.replace(/[^\w.-]/g, "_")}`;
    const up = await sb.storage.from("listings").upload(path, ready, {
      contentType: ready.type,
      upsert: false,
    });
    if (up.error) {
      setPicUploading(null);
      setPicErr("Picture upload failed: " + up.error.message);
      return;
    }
    const url = sb.storage.from("listings").getPublicUrl(path).data.publicUrl;
    const next = blocks.map((b, idx) => (idx === i ? { ...b, map_img: url } : b));
    await persistBlockImages(next, `${next[i]?.name?.trim() || `Block ${i + 1}`} ki picture save ho gayi.`);
    setPicUploading(null);
  };

  const removeBlockImage = async (i: number) => {
    const next = blocks.map((b, idx) => (idx === i ? { ...b, map_img: "" } : b));
    setPicNotice("");
    setPicErr("");
    await persistBlockImages(next, `${next[i]?.name?.trim() || `Block ${i + 1}`} ki picture hata di gayi.`);
  };

  const saveDocs = async () => {
    if (!sb || !session) return;
    setDocErr("");
    setDocNotice("");
    setDocSaving(true);
    const { error } = await sb
      .from("schemes")
      .update({
        approval_doc: docUrl.trim(),
        approval_date: approvalDate.trim(),
        expiry_date: expiryDate.trim(),
        noc_status: nocStatus,
      })
      .eq("id", id)
      .eq("created_by", session.user.id);
    setDocSaving(false);
    if (error) {
      setDocErr(error.message);
      return;
    }
    setDocDirty(false);
    setDocNotice("Documents update ho gaye — scheme page par foran show honge.");
  };

  if (!ready || (session && !!id && !loaded && !loadErr)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-green" size={28} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-surface px-4 text-center">
        <Building2 size={34} className="mb-3 text-muted" />
        <h1 className="text-[18px] font-extrabold text-navy">
          {t("Login to manage plot stock")}
        </h1>
        <Link
          href="/login/"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-green px-4 py-2.5 text-[13px] font-bold text-white hover:bg-green-dark"
        >
          <LogIn size={15} /> {t("Login")}
        </Link>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-surface px-4 text-center">
        <AlertCircle size={34} className="mb-3 text-amber-500" />
        <h1 className="text-[18px] font-extrabold text-navy">{t("Scheme not selected")}</h1>
        <p className="mt-1 text-[13px] text-muted">
          {t("Manage Scheme button se scheme kholen.")}
        </p>
        <Link
          href="/profile/schemes/"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-[13px] font-bold text-navy hover:bg-white"
        >
          <ArrowLeft size={15} /> {t("My Schemes")}
        </Link>
      </div>
    );
  }

  if (loadErr) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-surface px-4 text-center">
        <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-6">
          <AlertCircle size={32} className="mx-auto mb-3 text-red-500" />
          <h3 className="text-[16px] font-bold text-navy">{loadErr}</h3>
          <Link
            href="/profile/schemes/"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-[12.5px] font-semibold text-navy hover:bg-surface"
          >
            <ArrowLeft size={13} /> {t("Back to My Schemes")}
          </Link>
        </div>
      </div>
    );
  }

  const totals = {
    total: blocks.reduce((a, b) => a + num(b.total), 0),
    available: blocks.reduce((a, b) => a + num(b.available), 0),
    reserved: blocks.reduce((a, b) => a + num(b.reserved), 0),
    sold: blocks.reduce((a, b) => a + num(b.sold), 0),
  };

  return (
    <div className="mx-auto min-h-screen bg-surface pb-24 pt-[calc(var(--header-h)+24px)] sm:pb-12">
      <div className="mx-auto w-full max-w-[980px] px-4">
        <Link
          href="/profile/schemes/"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-green hover:underline"
        >
          <ArrowLeft size={15} /> {t("My Schemes")}
        </Link>
        <h1 className="mt-3 text-[28px] font-extrabold leading-none text-navy">
          {t("Manage Scheme")}
        </h1>
        <p className="mt-1 text-[13px] text-muted">
          {t("Plot stock, documents aur approvals yahan se update karein.")}
        </p>

        <div className="mt-5 space-y-5">
          {/* Scheme header + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
            <div className="min-w-0">
              <h2 className="truncate text-[18px] font-extrabold leading-tight text-navy">
                {scheme?.name}
              </h2>
              <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-muted">
                <MapPin size={12} /> {scheme?.location || t("Location not set")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/scheme/?id=${scheme?.id}`}
                className="rounded-lg border border-line px-3.5 py-2 text-[12.5px] font-bold text-navy transition-colors hover:bg-surface"
              >
                {t("View Scheme")}
              </Link>
              <Link
                href="/profile/schemes/"
                className="rounded-lg border border-line px-3.5 py-2 text-[12.5px] font-bold text-navy transition-colors hover:bg-surface"
              >
                <span className="inline-flex items-center gap-1.5">
                  <ArrowLeft size={13} /> {t("My Schemes")}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving || !dirty}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green px-4 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-green-dark disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? t("Saving…") : t("Save Changes")}
              </button>
            </div>
          </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Building2 size={18} />
          </span>
          <p className="mt-3 text-[11.5px] font-semibold text-muted">{t("Total Plots")}</p>
          <p className="mt-0.5 text-[24px] font-extrabold text-navy">
            {totals.total.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-soft text-green">
            <MapPin size={18} />
          </span>
          <p className="mt-3 text-[11.5px] font-semibold text-muted">{t("Available")}</p>
          <p className="mt-0.5 text-[24px] font-extrabold text-green">
            {totals.available.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Wallet size={18} />
          </span>
          <p className="mt-3 text-[11.5px] font-semibold text-muted">{t("Sold")}</p>
          <p className="mt-0.5 text-[24px] font-extrabold text-red-600">
            {totals.sold.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Plus size={18} />
          </span>
          <p className="mt-3 text-[11.5px] font-semibold text-muted">{t("Reserved")}</p>
          <p className="mt-0.5 text-[24px] font-extrabold text-amber-600">
            {totals.reserved.toLocaleString()}
          </p>
        </div>
      </div>

      {saveErr && (
        <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
          <AlertCircle size={15} className="shrink-0" /> {saveErr}
        </p>
      )}
      {notice && (
        <p className="flex items-center gap-2 rounded-xl border border-green/30 bg-green-soft px-3.5 py-2.5 text-[13px] font-semibold text-green">
          <CheckCircle2 size={15} className="shrink-0" /> {notice}
        </p>
      )}

      {/* Blocks table */}
      <section id="blocks" className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-white px-4 py-3">
          <div>
            <h2 className="text-[15px] font-extrabold text-navy">{t("Blocks & Plot Stock")}</h2>
            <p className="mt-0.5 text-[12px] text-muted">
              {t("Jab plot sell ho to 'Sell 1' dabayein — Available kam, Sold zyada ho jayega.")}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold ${
              dirty ? "bg-amber-100 text-amber-700" : "bg-green-soft text-green"
            }`}
          >
            {dirty ? t("Unsaved changes") : t("Saved")}
          </span>
        </div>

        {blocks.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-[12.5px] text-muted">
              {t("Is scheme me abhi koi block add nahi hua.")}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={addBlock}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12.5px] font-semibold text-navy hover:bg-surface"
              >
                <PlusCircle size={13} /> {t("Add Block")}
              </button>
              {totalFromScheme > 0 && (
                <button
                  type="button"
                  onClick={seedBlock}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green px-3 py-2 text-[12.5px] font-bold text-white hover:bg-green-dark"
                >
                  <PlusCircle size={13} />{" "}
                  {t("Create Block A with")} {totalFromScheme.toLocaleString()} {t("plots")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-line bg-surface text-[10.5px] uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 text-start font-bold">{t("Block")}</th>
                  <th className="px-4 py-3 text-start font-bold">{t("Total")}</th>
                  <th className="px-4 py-3 text-start font-bold">{t("Available")}</th>
                  <th className="px-4 py-3 text-start font-bold">{t("Reserved")}</th>
                  <th className="px-4 py-3 text-start font-bold">{t("Sold")}</th>
                  <th className="px-4 py-3 text-start font-bold">{t("Quick Action")}</th>
                  <th className="px-4 py-3 text-start font-bold">{t("Action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {blocks.map((b, i) => (
                  <tr key={i} className="text-[12px] hover:bg-green-soft/5">
                    <td className="px-4 py-2.5">
                      <input
                        type="text"
                        className="field w-full min-w-[120px] font-bold text-navy"
                        placeholder={`Block ${i + 1}`}
                        value={b.name || ""}
                        onChange={(e) => setField(i, "name", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min={0}
                        className="field w-full text-center"
                        value={b.total || ""}
                        onChange={(e) => setField(i, "total", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min={0}
                        className="field w-full text-center font-bold text-green"
                        value={b.available || ""}
                        onChange={(e) => setField(i, "available", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min={0}
                        className="field w-full text-center"
                        value={b.reserved || ""}
                        onChange={(e) => setField(i, "reserved", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min={0}
                        className="field w-full text-center font-bold text-red-600"
                        value={b.sold || ""}
                        onChange={(e) => setField(i, "sold", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => markSold(i)}
                          disabled={num(b.available) <= 0}
                          className="inline-flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-red-200 px-2 py-1.5 text-[10.5px] font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
                          title={t("Mark 1 plot as sold")}
                        >
                          <Minus size={11} /> {t("Sell 1")}
                        </button>
                        <button
                          type="button"
                          onClick={() => markAvailable(i)}
                          disabled={num(b.sold) <= 0}
                          className="inline-flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-green-200 px-2 py-1.5 text-[10.5px] font-bold text-green transition-colors hover:bg-green-50 disabled:opacity-40"
                          title={t("Mark 1 plot as available again")}
                        >
                          <Plus size={11} /> {t("Unsell 1")}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => removeBlock(i)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                        title={t("Delete block")}
                      >
                        <Trash2 size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-line bg-white px-4 py-3">
          <button
            type="button"
            onClick={addBlock}
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12.5px] font-semibold text-green hover:bg-green-soft/60"
          >
            <Plus size={13} /> {t("Add Block")}
          </button>
          <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
            <Info size={14} /> {t("Total plots >= Available + Reserved + Sold hona chahiye.")}
          </span>
        </div>
      </section>

      <section id="pictures" className="scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-white">
        <div className="border-b border-line px-4 py-3">
          <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
            <Camera size={16} className="text-green" /> {t("Block Pictures")}
          </h2>
          <p className="mt-0.5 text-[12px] text-muted">
            {t("Har block ki picture upload karein — scheme page ke Blocks & Plots section me show hogi.")}
          </p>
        </div>
        {blocks.length === 0 ? (
          <p className="px-4 py-6 text-center text-[12px] text-muted">
            {t("Pehle block add karein, phir uski picture upload karein.")}
          </p>
        ) : (
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {blocks.map((b, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-line">
                <div className="relative h-32 bg-surface">
                  {b.map_img ? (
                    <img
                      src={b.map_img}
                      alt={b.name || `Block ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2 size={26} className="text-muted" />
                    </div>
                  )}
                  {b.map_img && (
                    <button
                      type="button"
                      onClick={() => void removeBlockImage(i)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-red-600"
                      title={t("Remove picture")}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                  <span className="truncate text-[12px] font-bold text-navy">
                    {b.name?.trim() || `Block ${i + 1}`}
                  </span>
                  <label
                    className={`inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border px-2 py-1.5 text-[10.5px] font-bold transition-colors ${
                      picUploading === i
                        ? "cursor-wait border-line text-muted"
                        : "border-green-200 text-green hover:bg-green-50"
                    }`}
                  >
                    {picUploading === i ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Camera size={11} />
                    )}
                    {picUploading === i
                      ? t("Uploading…")
                      : b.map_img
                        ? t("Change")
                        : t("Add Picture")}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={picUploading === i}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        void uploadBlockImage(i, file);
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
        {(picNotice || picErr) && (
          <div className="border-t border-line px-4 py-2.5 text-[12px] font-semibold">
            {picNotice && <span className="text-green">{picNotice}</span>}
            {picErr && <span className="text-red-500">{picErr}</span>}
          </div>
        )}
      </section>

      <section id="documents" className="scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-white">
        <div className="border-b border-line px-4 py-3">
          <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
            <FileText size={16} className="text-green" /> {t("Upload / Update Documents")}
          </h2>
          <p className="mt-0.5 text-[12px] text-muted">
            {t("Approval letter / NOC ka link aur dates update karein — scheme page par foran show honge.")}
          </p>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="field-label">{t("Approval Document URL (PDF / image link)")}</span>
            <input
              type="url"
              className="field w-full"
              placeholder="https://example.com/approval-letter.pdf"
              value={docUrl}
              onChange={(e) => {
                setDocUrl(e.target.value);
                setDocDirty(true);
                setDocNotice("");
                setDocErr("");
              }}
            />
          </label>
          <label>
            <span className="field-label">{t("Approval Date")}</span>
            <input
              className="field w-full"
              placeholder="15 Sep 2021"
              value={approvalDate}
              onChange={(e) => {
                setApprovalDate(e.target.value);
                setDocDirty(true);
                setDocNotice("");
                setDocErr("");
              }}
            />
          </label>
          <label>
            <span className="field-label">{t("Expiry Date")}</span>
            <input
              className="field w-full"
              placeholder="15 Sep 2026"
              value={expiryDate}
              onChange={(e) => {
                setExpiryDate(e.target.value);
                setDocDirty(true);
                setDocNotice("");
                setDocErr("");
              }}
            />
          </label>
          <label>
            <span className="field-label">{t("NOC Status")}</span>
            <select
              className="field w-full"
              value={nocStatus}
              onChange={(e) => {
                setNocStatus(e.target.value);
                setDocDirty(true);
                setDocNotice("");
                setDocErr("");
              }}
            >
              <option value="Approved">Approved</option>
              <option value="Under Process">Under Process</option>
              <option value="Not Approved">Not Approved</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3">
          <button
            type="button"
            onClick={() => void saveDocs()}
            disabled={docSaving || !docDirty}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green px-4 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-green-dark disabled:opacity-50"
          >
            {docSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {docSaving ? t("Saving…") : t("Save Documents")}
          </button>
          {docNotice && <span className="text-[12px] font-semibold text-green">{docNotice}</span>}
          {docErr && <span className="text-[12px] font-semibold text-red-500">{docErr}</span>}
        </div>
      </section>

          {dirty && (
            <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-navy-deep px-4 py-3 text-white shadow-[0_10px_30px_rgba(0,0,0,.25)]">
              <span className="text-[12.5px] font-semibold">{t("Aap ke changes save nahi hue.")}</span>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green px-4 py-2 text-[12.5px] font-bold text-white hover:bg-green-dark disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? t("Saving…") : t("Save Changes")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SchemeManagePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface">
          <Loader2 className="animate-spin text-green" size={24} />
        </div>
      }
    >
      <SchemeManageInner />
    </Suspense>
  );
}
