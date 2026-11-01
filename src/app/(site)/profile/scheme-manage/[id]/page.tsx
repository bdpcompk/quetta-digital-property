"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Building2, CheckCircle2, Loader2, MapPin, Minus, Plus, Save,
  Trash2, Wallet, AlertCircle, Info, PlusCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import { useLang } from "@/components/layout/LanguageProvider";
import { formatPKR } from "@/lib/data";
import DashboardShell from "@/components/dashboard/DashboardShell";

type BlockRow = {
  name?: string;
  total?: string;
  available?: string;
  reserved?: string;
  sold?: string;
  map_img?: string;
};

function num(v: string | number | null | undefined) {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function SchemeManagePage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const { session, ready, supabase: sb, name } = useSession();
  const { t } = useLang();
  const [scheme, setScheme] = useState<any>(null);
  const [blocks, setBlocks] = useState<BlockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!sb || !session || !id) {
      setLoading(false);
      return;
    }
    let alive = true;
    const fetchScheme = async () => {
      const { data, error } = await sb
        .from("schemes")
        .select("*")
        .eq("id", id)
        .eq("created_by", session.user.id)
        .maybeSingle();
      if (!alive) return;
      if (error || !data) {
        setErr(error?.message || "Scheme nahi mila ya aap iske owner nahi hain.");
        setLoading(false);
        return;
      }
      setScheme(data);
      let b: BlockRow[] = [];
      if (Array.isArray(data.blocks)) {
        b = data.blocks;
      } else if (typeof data.blocks === "string" && data.blocks.trim()) {
        try {
          b = JSON.parse(data.blocks);
        } catch {
          b = [];
        }
      }
      setBlocks(
        b.map((bl: any) => ({
          name: bl.name || "",
          total: String(bl.total ?? ""),
          available: String(bl.available ?? ""),
          reserved: String(bl.reserved ?? ""),
          sold: String(bl.sold ?? ""),
          map_img: bl.map_img || "",
        }))
      );
      setLoading(false);
    };
    fetchScheme();
    // Realtime: if the scheme row updates elsewhere, reload.
    const ch = sb.channel(`scheme-manage-${id}`);
    ch.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "schemes", filter: `id=eq.${id}` },
      () => fetchScheme()
    )
      .subscribe();
    return () => {
      alive = false;
      sb.removeChannel(ch);
    };
  }, [sb, session, id]);

  const setField = (i: number, field: keyof BlockRow, value: string) => {
    setBlocks((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  // Mark one plot as sold: available -1, sold +1
  const markSold = (i: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      const b = next[i];
      const available = num(b.available);
      const sold = num(b.sold);
      if (available > 0) {
        next[i] = { ...b, available: String(available - 1), sold: String(sold + 1) };
      }
      return next;
    });
  };

  const markAvailable = (i: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      const b = next[i];
      const sold = num(b.sold);
      const available = num(b.available);
      if (sold > 0) {
        next[i] = { ...b, sold: String(sold - 1), available: String(available + 1) };
      }
      return next;
    });
  };

  const addBlock = () => {
    setBlocks((prev) => [
      ...prev,
      { name: "", total: "", available: "", reserved: "", sold: "" },
    ]);
  };

  const removeBlock = (i: number) => {
    setBlocks((prev) => prev.filter((_, idx) => idx !== i));
  };

  const save = async () => {
    if (!sb || !session) return;
    setSaving(true);
    setMsg("");
    setErr("");
    // Validate: available + reserved + sold <= total
    for (const b of blocks) {
      const total = num(b.total);
      const avail = num(b.available);
      const res = num(b.reserved);
      const sold = num(b.sold);
      if (avail + res + sold > total) {
        setErr(
          `${b.name || "Block"}: Available + Reserved + Sold, Total plots se zyada nahi ho sakte.`
        );
        setSaving(false);
        return;
      }
    }
    const { error } = await sb
      .from("schemes")
      .update({ blocks: JSON.stringify(blocks) })
      .eq("id", id)
      .eq("created_by", session.user.id);
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setMsg("Plot stock save ho gaya. Available / Sold counts update ho gaye hain.");
  };

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-green" size={28} />
      </div>
    );
  }
  if (err) {
    return (
      <div className="mx-auto min-h-screen bg-surface pt-[calc(var(--header-h)+40px)] sm:pt-12 px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle size={32} className="mx-auto text-red-500 mb-3" />
          <h3 className="text-[16px] font-bold text-navy">{err}</h3>
          <Link
            href="/profile/schemes/"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-[12.5px] font-semibold text-navy hover:bg-surface"
          >
            <ArrowLeft size={13} /> {t("Back to My Schemes")}
          </Link>
        </div>
      </div>
    );
  }
  if (!scheme) {
    return (
      <div className="mx-auto min-h-screen bg-surface pt-[calc(var(--header-h)+40px)] sm:pt-12 px-4">
        <div className="max-w-md rounded-2xl border border-line bg-white p-6 text-center">
          <Building2 size={32} className="mx-auto text-muted mb-3" />
          <h3 className="text-[16px] font-bold text-navy">Scheme nahi mila</h3>
          <Link
            href="/profile/schemes/"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-[12.5px] font-semibold text-navy hover:bg-surface"
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
    <DashboardShell
      title="Manage Scheme Plots"
      subtitle={`Plot stock manage karein — available, reserved aur sold counts update karein.`}
      roleLabel="Scheme Owner"
      name={name}
      initials={name ? name.split(" ").map((w) => w[0]).join("") : ""}
      nav={[
        { label: "Dashboard", icon: Building2, href: "/dashboard/" },
        { label: "My Schemes", icon: Building2, href: "/profile/schemes/" },
        { label: "Plot Stock", icon: Wallet, href: `#blocks` },
        { label: "Add New Scheme", icon: PlusCircle, href: "/schemes/add/" },
      ]}
      onLogout={() => {
        if (sb) void sb.auth.signOut();
        router.push("/");
      }}
    >
      {/* Header + stats */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] font-extrabold leading-tight text-navy">
            {scheme.name}
          </h1>
          <p className="mt-0.5 text-[13px] text-muted">
            {scheme.location} • {t("Plot Stock Management")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/scheme/?id=${scheme.id}`}
            className="rounded-lg border border-line px-3.5 py-2 text-[12.5px] font-bold text-navy transition-colors hover:bg-surface"
          >
            {t("View Scheme")}
          </Link>
          <Link
            href="/profile/schemes/"
            className="rounded-lg border border-line px-3.5 py-2 text-[12.5px] font-bold text-navy transition-colors hover:bg-surface"
          >
            <ArrowLeft size={13} /> {t("Back to My Schemes")}
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

      {err && (
        <p className="mb-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
          <AlertCircle size={14} className="mr-2 shrink-0" /> {err}
        </p>
      )}
      {msg && (
        <p className="mb-3 rounded-xl bg-green-soft px-3.5 py-2.5 text-[13px] font-semibold text-green">
          <CheckCircle2 size={14} className="mr-2 shrink-0" /> {msg}
        </p>
      )}

      {/* Blocks table */}
      <section id="blocks" className="rounded-2xl border border-line bg-white overflow-hidden">
        <div className="border-b border-line bg-white px-4 py-3">
          <h2 className="text-[15px] font-extrabold text-navy">{t("Blocks & Plot Stock")}</h2>
          <p className="mt-0.5 text-[12px] text-muted">
            {t("Jab koi plot sell ho jaye to 'Sold' barhayein — Available khud kam ho jayegi.")}
          </p>
        </div>

        {blocks.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-[12.5px] text-muted">
              {t("Is scheme me abhi koi block add nahi hua.")}
            </p>
            <button
              type="button"
              onClick={addBlock}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12.5px] font-semibold text-navy hover:bg-surface"
            >
              <PlusCircle size={13} /> {t("Add Block")}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-line text-[10.5px] uppercase tracking-wide text-muted bg-surface">
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
                    <td className="px-4 py-2.5 font-bold text-navy">
                      {b.name || `<Unnamed Block>`}
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
                        className="field w-full text-center"
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
                        className="field w-full text-center"
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
                          className="flex-1 items-center rounded-md border border-red-200 px-2 py-1.5 text-[10.5px] font-bold text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
                          title={t("Mark 1 plot as sold")}
                        >
                          <Minus size={11} /> {t("Sell 1")}
                        </button>
                        <button
                          type="button"
                          onClick={() => markAvailable(i)}
                          disabled={num(b.sold) <= 0}
                          className="flex-1 items-center rounded-md border border-green-200 px-2 py-1.5 text-[10.5px] font-bold text-green hover:bg-green-50 disabled:opacity-40 transition-colors"
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
                        disabled={blocks.length <= 1}
                        className="flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
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
        <div className="border-t border-line bg-white px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={addBlock}
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12.5px] font-semibold text-green hover:bg-green-soft/60"
          >
            <Plus size={13} /> {t("Add Block")}
          </button>
          <Info size={14} className="text-muted" />
          <span className="text-[11.5px] text-muted">
            {t("Total plots >= Available + Reserved + Sold hona chahiye.")}
          </span>
        </div>
      </section>

      {/* Save */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-xl bg-green px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-green-dark disabled:opacity-60"
        >
          {saving ? (
            <span className="flex items-center gap-1.5">
              <Loader2 size={14} className="animate-spin" />
              {t("Saving…")}
            </span>
          ) : (
            <>
              <Save size={15} /> {t("Save Changes")}
            </>
          )}
        </button>
      </div>
    </DashboardShell>
  );
}
