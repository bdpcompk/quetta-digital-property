"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Loader2, MapPin, Plus } from "lucide-react";
import { useSession } from "@/lib/useSession";
import { useLang } from "@/components/layout/LanguageProvider";
import type { Property } from "@/lib/types";

export default function DraftsPage() {
  const { session, ready, supabase: sb } = useSession();
  const { t } = useLang();
  const [rows, setRows] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      if (!sb || !session) {
        if (alive) setLoading(false);
        return;
      }
      const { data } = await sb
        .from("properties")
        .select("*")
        .eq("created_by", session.user.id)
        .eq("status", "pending")
        .order("id", { ascending: false });
      if (alive) setRows((data as Property[]) ?? []);
      if (alive) setLoading(false);
    }, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [sb, session]);

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
          <ClipboardList size={34} className="mx-auto text-green" />
          <h3 className="mt-4 text-[18px] font-bold text-navy">{t("Login to see your profile")}</h3>
          <Link href="/login/?next=%2Fprofile%2Fdrafts%2F" className="btn-primary mt-5 inline-flex">
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
        <h1 className="mt-3 text-[28px] font-extrabold leading-none text-navy">{t("Drafts")}</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          {t("Ye aap ki pending listings hain — admin approve karte hi live ho jayengi.")}
        </p>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-line bg-white p-10 text-center">
            <ClipboardList size={38} className="mx-auto text-muted" />
            <p className="mt-4 text-[15px] font-bold text-navy">{t("No pending listings")}</p>
            <p className="mt-1 text-[13px] text-muted">
              {t("Koi nayi property post karein — wahi aap ka pehla draft ban jaye gi.")}
            </p>
            <Link href="/sell/" className="btn-primary mt-5 inline-flex">
              <Plus size={15} /> {t("Post an Ad")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {rows.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="h-20 w-28 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[16px] font-extrabold text-navy">
                    {p.priceText}
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-amber-700">
                      {t("Pending Review")}
                    </span>
                  </p>
                  <h3 className="mt-0.5 truncate text-[14px] font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                    <MapPin size={12} className="shrink-0 text-green" />
                    <span className="truncate">{p.address}</span>
                  </p>
                </div>
                <Link
                  href={`/property/?id=${p.id}`}
                  className="shrink-0 rounded-lg border border-line px-3.5 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-green hover:text-green"
                >
                  {t("View")}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
