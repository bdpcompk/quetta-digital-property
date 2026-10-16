"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Loader2, MapPin, Plus } from "lucide-react";
import { useSession } from "@/lib/useSession";
import { useLang } from "@/components/layout/LanguageProvider";
import { formatPKR } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Scheme } from "@/lib/types";

const STATUS_CHIP: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Active: "bg-green-soft text-green",
  Rejected: "bg-red-100 text-red-600",
  Sold: "bg-slate-200 text-slate-700",
  Hold: "bg-amber-100 text-amber-700",
};

export default function MySchemesPage() {
  const { session, ready, supabase: sb } = useSession();
  const { t } = useLang();
  const [rows, setRows] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      if (!sb || !session) {
        if (alive) setLoading(false);
        return;
      }
      const { data } = await sb
        .from("schemes")
        .select("*")
        .eq("created_by", session.user.id)
        .order("id", { ascending: false });
      if (alive) setRows((data as Scheme[]) ?? []);
      if (alive) setLoading(false);
    }, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [sb, session]);

  useEffect(() => {
    if (!supabase || !session) return;
    const client = supabase;
    const uid = session.user.id;
    const fetchRows = async () => {
      const { data } = await client
        .from("schemes")
        .select("*")
        .eq("created_by", uid)
        .order("id", { ascending: false });
      setRows((data as Scheme[]) ?? []);
    };
    const ch = client
      .channel("realtime-my-schemes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schemes", filter: `created_by=eq.${uid}` },
        () => {
          fetchRows();
        }
      )
      .subscribe();
    return () => {
      client.removeChannel(ch);
    };
  }, [session]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-[14px] text-muted">
        <Loader2 size={16} className="animate-spin" /> {t("Loading…")}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-[440px] px-4 pb-24 pt-[calc(var(--header-h)+40px)]">
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <Building2 size={34} className="mx-auto text-green" />
          <h3 className="mt-4 text-[18px] font-bold text-navy">{t("Login to see your profile")}</h3>
          <Link href="/login/?next=%2Fprofile%2Fschemes%2F" className="btn-primary mt-5 inline-flex">
            {t("Login")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen bg-surface pb-24 pt-[calc(var(--header-h)+24px)] sm:pb-12">
      <div className="mx-auto w-full max-w-[720px] px-4">
        <Link href="/profile/" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-green hover:underline">
          <ArrowLeft size={15} /> {t("Profile")}
        </Link>
        <h1 className="mt-3 text-[28px] font-extrabold leading-none text-navy">
          {t("My Schemes")}
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          {t("Ye aap ki submitted schemes hain — admin approve karte hi publicly live ho jayengi.")}
        </p>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-line bg-white p-10 text-center">
            <Building2 size={38} className="mx-auto text-muted" />
            <p className="mt-4 text-[15px] font-bold text-navy">{t("No schemes yet")}</p>
            <p className="mt-1 text-[13px] text-muted">
              {t("Abhi tak koi scheme submit nahi ki. Pehli scheme add karein!")}
            </p>
            <Link href="/schemes/add/" className="btn-primary mt-5 inline-flex">
              <Plus size={15} /> {t("Add a Scheme")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {rows.map((s) => {
              const status = String(s.status || "Pending");
              const chip = STATUS_CHIP[status] ?? "bg-slate-200 text-slate-700";
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4"
                >
                  {s.photos && s.photos[0] ? (
                    <img
                      src={s.photos[0]}
                      alt={s.name}
                      className="h-20 w-28 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
                      <Building2 size={26} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[15px] font-extrabold text-navy">
                      {s.name}
                      <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${chip}`}>
                        {status === "Pending" ? t("Pending Review") : t(status)}
                      </span>
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                      <MapPin size={12} className="shrink-0 text-green" />
                      <span className="truncate">{s.location}</span>
                    </p>
                    <p className="mt-0.5 text-[12.5px] font-semibold text-green">
                      {s.price_total ? formatPKR(s.price_total) : ""}
                    </p>
                  </div>
                  <Link
                    href={`/schemes/?id=${s.id}`}
                    className="shrink-0 rounded-lg border border-line px-3.5 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-green hover:text-green"
                  >
                    {t("View")}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
