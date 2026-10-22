"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2, ChevronRight, ClipboardList, Globe, Heart, Home, Loader2, LogIn, Phone, PieChart,
  Search, Settings, User, UserCog, Landmark, Clock,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import { useLang } from "@/components/layout/LanguageProvider";
import { useSiteSetting } from "@/lib/useSiteSetting";
import BottomNav from "@/components/site/BottomNav";
import { type RequestRole } from "@/lib/roleRequests";

const TILES = [
  { icon: Settings, label: "Profile Settings", href: "/my-account/#settings" },
  { icon: Search, label: "My Saved Searches", href: "/profile/saved-searches/" },
  { icon: Heart, label: "My Favorites", href: "/my-account/?tab=saved" },
  { icon: Home, label: "My Properties", href: "/my-account/?tab=listings" },
  { icon: ClipboardList, label: "Drafts", href: "/profile/drafts/" },
  { icon: PieChart, label: "Quota and Credits", href: "/packages/" },
];

const ROLE_NAME: Record<string, string> = {
  common: "Common Person",
  agent: "Agent",
  owner: "Scheme Owner",
};

export default function ProfilePage() {
  const { session, ready, name, supabase: sb } = useSession();
  const { t, lang, setLang } = useLang();
  const postOn = useSiteSetting("post_property_enabled");
  const [plan, setPlan] = useState("BASIC");
  const [role, setRole] = useState("common");
  const [req, setReq] = useState<{
    id: number;
    requested_role: RequestRole;
    status: string;
    admin_note?: string | null;
  } | null>(null);

  useEffect(() => {
    if (!sb || !session) return;
    let alive = true;
    const timer = setTimeout(async () => {
      const [pay, roles, reqs] = await Promise.all([
        sb
          .from("payments")
          .select("plan")
          .eq("user_id", session.user.id)
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(1),
        sb.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle(),
        sb
          .from("role_requests")
          .select("id, requested_role, status, admin_note")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);
      if (!alive) return;
      if (pay.data && pay.data[0] && pay.data[0].plan) {
        setPlan(String(pay.data[0].plan).toUpperCase());
      }
      if (roles.data?.role) setRole(String(roles.data.role));
      if (reqs.data && reqs.data[0]) setReq(reqs.data[0] as typeof req);
    }, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [sb, session]);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-[14px] text-muted">
        <Loader2 size={16} className="animate-spin" /> {t("Checking your session…")}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-[440px] px-4 pb-24 pt-[calc(var(--header-h)+40px)]">
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <LogIn size={34} className="mx-auto text-green" />
          <h3 className="mt-4 text-[18px] font-bold text-navy">
            {t("Login to see your profile")}
          </h3>
          <p className="mt-2 text-[13.5px] text-muted">
            {t("Plan khareedne ke liye pehle login kar lein — takes less than a minute! 🙂")}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/login/?next=%2Fprofile%2F" className="btn-primary">{t("Login")}</Link>
            <Link href="/signup/?next=%2Fprofile%2F" className="btn-ghost">{t("Naya Account")}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen bg-surface pb-24 pt-[calc(var(--header-h)+24px)] sm:pb-12">
      <div className="mx-auto w-full max-w-[720px] px-4">
        <h1 className="text-[32px] font-extrabold leading-none text-navy">{t("Profile")}</h1>

        <div className="mt-5 flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[23px] font-extrabold text-navy">{name || session.user.email}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-lg border border-green bg-green-soft px-3 py-1 text-[12px] font-extrabold uppercase tracking-wide text-green">
                {plan}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1 text-[12px] font-extrabold uppercase tracking-wide text-navy">
                <UserCog size={13} className="text-green" />
                {ROLE_NAME[role] ?? "Common Person"}
              </span>
            </div>
          </div>
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-soft text-green">
            <User size={34} strokeWidth={1.8} />
          </span>
        </div>

        {/* Role upgrade / status */}
        {role === "common" && (
          <div className="mt-5 rounded-2xl border border-line bg-white p-5">
            <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy">
              <Landmark size={17} className="text-green" /> {t("Become a Professional")}
            </p>
            <p className="mt-1 text-[12.5px] text-muted">
              {t("Register as an Agent or Scheme Owner — our team verifies your documents and activates your account.")}
            </p>

            {req && req.status === "pending" && (
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700">
                <Clock size={15} /> {t("Your request is under review — we will notify you soon.")}
              </p>
            )}
            {req && req.status === "rejected" && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {t("Your last request was not approved.")} {req.admin_note ? `— ${req.admin_note}` : ""}
              </p>
            )}

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <Link
                href="/become-agent/"
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13.5px] font-bold transition-colors ${
                  req?.status === "pending" && req.requested_role === "agent"
                    ? "pointer-events-none bg-surface text-muted"
                    : "bg-green text-white hover:bg-green-dark"
                }`}
              >
                <UserCog size={15} /> {t("Register as Agent")}
              </Link>
              <Link
                href="/become-owner/"
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13.5px] font-bold transition-colors ${
                  req?.status === "pending" && req.requested_role === "owner"
                    ? "pointer-events-none bg-surface text-muted"
                    : "border border-green bg-white text-green hover:bg-green-soft"
                }`}
              >
                <Building2 size={15} /> {t("Register as Scheme Owner")}
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
          {TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-white px-2 py-6 text-center transition-all hover:border-green hover:shadow-[0_6px_20px_rgba(22,41,74,.07)]"
            >
              <tile.icon size={28} className="text-green" strokeWidth={1.6} />
              <span className="text-[13.5px] font-bold leading-tight text-navy">{t(tile.label)}</span>
            </Link>
          ))}
        </div>

        {postOn && (
          <div className="mt-6 rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-soft text-green">
                <Building2 size={32} strokeWidth={1.6} />
              </span>
              <p className="text-[16px] font-extrabold leading-snug text-navy">
                {t("Looking to sell or rent out your property?")}
              </p>
            </div>
            <Link
              href="/sell/"
              className="mt-4 block rounded-xl bg-green-soft py-3.5 text-center text-[15px] font-extrabold text-green transition-colors hover:bg-green hover:text-white"
            >
              {t("Post an Ad")}
            </Link>
          </div>
        )}

        <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          <Link
            href="/profile/schemes/"
            className="flex w-full items-center gap-3 px-4 py-4 transition-colors hover:bg-surface"
          >
            <Building2 size={22} className="shrink-0 text-green" />
            <span className="text-[15px] font-bold text-navy">{t("My Schemes")}</span>
            <ChevronRight size={18} className="ms-auto shrink-0 text-muted" />
          </Link>
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "ur" : "en")}
            className="flex w-full items-center gap-3 px-4 py-4 text-start transition-colors hover:bg-surface"
          >
            <Globe size={22} className="shrink-0 text-green" />
            <span className="min-w-0">
              <span className="block text-[12.5px] text-muted">{t("Language")}</span>
              <span className="block text-[15px] font-bold text-green">{lang === "en" ? "English" : "اردو"}</span>
            </span>
            <ChevronRight size={18} className="ms-auto shrink-0 text-muted" />
          </button>
          <Link
            href="/contact/"
            className="flex w-full items-center gap-3 px-4 py-4 transition-colors hover:bg-surface"
          >
            <Phone size={22} className="shrink-0 text-green" />
            <span className="text-[15px] font-bold text-navy">{t("Contact Us")}</span>
            <ChevronRight size={18} className="ms-auto shrink-0 text-muted" />
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
