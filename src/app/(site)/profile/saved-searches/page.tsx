"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Loader2, Play, Search, Trash2 } from "lucide-react";
import { useLang } from "@/components/layout/LanguageProvider";

type SavedSearch = {
  id: string;
  label: string;
  qs: string;
  at: string;
  when: string;
};

function dateLabel(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
}

export default function SavedSearchesPage() {
  const { t } = useLang();
  const [items, setItems] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem("bdp-saved-searches");
        const parsed = raw ? JSON.parse(raw) : [];
        setItems(
          (Array.isArray(parsed) ? parsed : []).map(
            (s: Omit<SavedSearch, "when">) => ({ ...s, when: dateLabel(s.at) }),
          ),
        );
      } catch {
        setItems([]);
      }
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const remove = (id: string) => {
    const next = items.filter((s) => s.id !== id);
    setItems(next);
    try {
      localStorage.setItem("bdp-saved-searches", JSON.stringify(next));
    } catch {
      setItems(items);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-[14px] text-muted">
        <Loader2 size={16} className="animate-spin" /> {t("Loading…")}
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen bg-surface pb-24 pt-[calc(var(--header-h)+24px)] sm:pb-12">
      <div className="mx-auto w-full max-w-[720px] px-4">
        <Link href="/profile/" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-green hover:underline">
          <ArrowLeft size={15} /> {t("Profile")}
        </Link>
        <h1 className="mt-3 text-[28px] font-extrabold leading-none text-navy">{t("My Saved Searches")}</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          {t("Listings page par filters laga kar Save Search dabayein — wo yahan nazar aayengi.")}
        </p>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-line bg-white p-10 text-center">
            <Search size={38} className="mx-auto text-muted" />
            <p className="mt-4 text-[15px] font-bold text-navy">{t("No saved searches yet")}</p>
            <Link href="/listings/" className="btn-primary mt-5 inline-flex">
              <Bookmark size={15} /> {t("Browse Listings")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
                  <Search size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-bold text-navy">{s.label}</p>
                  <p className="text-[12px] text-muted">{s.when}</p>
                </div>
                <Link
                  href={s.qs ? `/listings/?${s.qs}` : "/listings/"}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-green px-3 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-green-dark"
                >
                  <Play size={13} /> {t("Run")}
                </Link>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-[12.5px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                  aria-label={t("Delete")}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 text-center text-[12px] text-muted">
          {t("Saved searches sirf is device par mafuz hoti hain.")}
        </p>
      </div>
    </div>
  );
}
