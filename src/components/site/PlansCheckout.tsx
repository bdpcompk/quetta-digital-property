"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, Banknote, CheckCircle2, Loader2, LogIn, Upload, X,
} from "lucide-react";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { useSession } from "@/lib/useSession";
import { useSiteSetting, useSiteSettingValue } from "@/lib/useSiteSetting";
import { useLang } from "@/components/layout/LanguageProvider";

type Plan = {
  id: string;
  name: string;
  price: number;
  period: string;
  desc: string;
  features: string[];
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    period: "hamesha ke liye free",
    desc: "Bilkul free — shuru karne ke liye perfect.",
    features: ["5 properties post karein", "Basic analytics", "Community support", "Normal placement"],
  },
  {
    id: "featured",
    name: "Featured",
    price: 2999,
    period: "har mahine",
    desc: "Sab se zyada log yahi choose karte hain — aap ki listing upar dikhe.",
    features: ["25 properties post karein", "Featured badge (alag pehchan)", "Homepage carousel mein", "Priority support", "Advanced analytics"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 7999,
    period: "har mahine",
    desc: "Agencies ke liye — maximum exposure, full power.",
    features: ["Unlimited listings", "Search mein sab se upar", "Verified agent badge", "Dedicated account manager", "Video listings", "Full analytics suite"],
  },
];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const METHODS = [
  {
    id: "easypaisa",
    name: "Easypaisa",
    defaultNumber: "0345 1234567",
    logo: `${basePath}/logos/easypaisa.png`,
    hint: "Apne Easypaisa app se aasanai se bhejein",
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    defaultNumber: "0300 1234567",
    logo: `${basePath}/logos/jazzcash.png`,
    hint: "Apne JazzCash app se aasanai se bhejein",
  },
] as const;

function uploadPath(userId: string, name: string) {
  return `${userId}/${Date.now()}-${name.replace(/[^\w.-]/g, "_")}`;
}

function fill(text: string, vars: Record<string, string>) {
  let out = text;
  for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(v);
  return out;
}

export default function PlansCheckout() {
  const { session, ready, supabase: sb } = useSession();
  const { t } = useLang();
  const paymentsOn = useSiteSetting("payments_enabled");
  const easypaisaNumber = useSiteSettingValue("easypaisa_number");
  const jazzcashNumber = useSiteSettingValue("jazzcash_number");
  const [selected, setSelected] = useState("featured");
  const [method, setMethod] = useState<"easypaisa" | "jazzcash">("easypaisa");
  const [trxId, setTrxId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [errDetail, setErrDetail] = useState("");
  const [done, setDone] = useState(false);

  const plan = PLANS.find((p) => p.id === selected)!;
  const baseMethod = METHODS.find((m) => m.id === method)!;
  const activeMethod = {
    ...baseMethod,
    number:
      method === "easypaisa"
        ? easypaisaNumber || baseMethod.defaultNumber
        : jazzcashNumber || baseMethod.defaultNumber,
  };

  const pickScreenshot = (list: FileList | null) => {
    if (!list || !list[0]) return;
    const f = list[0];
    if (!f.type.startsWith("image/")) {
      setErrDetail("");
      setErr("Screenshot must be an image");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrDetail("");
      setErr("Screenshot must be under 5MB");
      return;
    }
    setErr("");
    setErrDetail("");
    setScreenshot(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb || !session) return;
    setErr("");
    setErrDetail("");
    setBusy(true);

    let screenshotUrl = "";
    if (screenshot) {
      const path = uploadPath(session.user.id, screenshot.name);
      const up = await sb.storage.from("listings").upload(path, screenshot, {
        contentType: screenshot.type,
        upsert: false,
      });
      if (up.error) {
        setErr("Screenshot upload nahi hui — internet check kar ke dobara try karein ya screenshot ke baghair submit kar dein.");
        setBusy(false);
        return;
      }
      screenshotUrl = sb.storage.from("listings").getPublicUrl(path).data.publicUrl;
    }

    const { error } = await sb.from("payments").insert({
      user_id: session.user.id,
      plan: plan.id,
      amount: plan.price,
      method,
      trx_id: trxId.trim(),
      sender_number: senderNumber.trim(),
      screenshot_url: screenshotUrl || null,
      status: "pending",
    });
    setBusy(false);
    if (error) {
      setErr("Submit nahi ho saka — thora ruk ke dobara try karein.");
      setErrDetail(error.message);
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!paymentsOn) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center">
        <Banknote size={38} className="mx-auto text-muted" />
        <h3 className="mt-4 text-[18px] font-bold text-navy">{t("Payments abhi setup ho rahe hain")}</h3>
        <p className="mx-auto mt-2 max-w-[420px] text-[13.5px] leading-relaxed text-muted">
          {t("Thora sabr — online payments jald shuru ho rahe hain. Filhaal plan khareedne ke liye humein message kar dein, hum khud madad kar denge.")}
        </p>
        <Link href="/contact/" className="btn-primary mt-5 inline-flex">{t("Hum Se Rabta Karein")}</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <BadgeCheck size={40} className="mx-auto text-green" />
        <h3 className="mt-4 text-[20px] font-extrabold text-navy">{t("Shukriya! Payment mil gayi 🎉")}</h3>
        <p className="mx-auto mt-2 max-w-[460px] text-[13.5px] leading-relaxed text-muted">
          {fill(
            t("Aap ka {plan} plan — PKR {amount} ({method} se) humein mil gaya hai. Hamari team ab isay verify kar rahi hai (aam tor par 2-4 ghante) aur verify hote hi aap ka plan foran activate ho jaye ga. Tension na lein — sab ho jaye ga! 😊"),
            {
              plan: plan.name,
              amount: plan.price.toLocaleString(),
              method: activeMethod.name,
            },
          )}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/my-account/" className="btn-primary">{t("Mera Account")}</Link>
          <Link href="/listings/" className="btn-ghost">{t("Listings Dekhein")}</Link>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-white p-12 text-[14px] text-muted">
        <Loader2 size={16} className="animate-spin" /> {t("Checking your session…")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plans */}
      <Reveal>
        <Stagger className="grid gap-5 sm:grid-cols-3">
          {PLANS.map((p) => (
            <StaggerItem key={p.id}>
              <button
                onClick={() => setSelected(p.id)}
                className={`relative flex h-full w-full flex-col rounded-2xl border-2 p-5 text-left transition-all ${
                  selected === p.id
                    ? "border-green bg-green-soft/40 shadow-[0_8px_28px_rgba(26,135,84,.12)]"
                    : "border-line bg-white hover:border-green/50"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green px-3 py-1 text-[10.5px] font-bold uppercase text-white">
                    {t("Most Popular")}
                  </span>
                )}
                <span className="text-[15px] font-extrabold text-navy">{t(p.name)}</span>
                <span className="mt-2 block text-[26px] font-extrabold text-green">
                  {p.price === 0 ? t("Free") : `PKR ${p.price.toLocaleString()}`}
                </span>
                <span className="text-[11.5px] text-muted">{t(p.period)}</span>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{t(p.desc)}</p>
                <ul className="mt-3 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[12.5px] text-ink">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-green" /> {t(f)}
                    </li>
                  ))}
                </ul>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>

      {/* Checkout */}
      <Reveal>
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h3 className="text-[17px] font-extrabold text-navy">{t("Chaliye, plan choose kar lete hain 👇")}</h3>
          <p className="mt-1 text-[13px] text-muted">
            {t("Koi bhi plan select karein — payment sirf 2 minute mein.")}
          </p>

          {!session ? (
            <div className="mt-5 text-center">
              <LogIn size={32} className="mx-auto text-green" />
              <p className="mt-3 text-[13.5px] text-muted">
                {t("Plan khareedne ke liye pehle login kar lein — takes less than a minute! 🙂")}
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Link href="/login/?next=%2Fpackages%2F" className="btn-primary">{t("Login")}</Link>
                <Link href="/signup/?next=%2Fpackages%2F" className="btn-ghost">{t("Naya Account")}</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-5">
              {/* Method */}
              <div>
                <label className="field-label">{t("Payment ka tareeqa chunein")}</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-all ${
                        method === m.id ? "border-green bg-green-soft/40" : "border-line hover:border-green/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="method"
                        className="sr-only"
                        checked={method === m.id}
                        onChange={() => setMethod(m.id as "easypaisa" | "jazzcash")}
                      />
                      <span className="flex h-11 w-[72px] shrink-0 items-center justify-center rounded-lg border border-line bg-white p-1.5">
                        <img src={m.logo} alt={`${m.name} logo`} className="max-h-full max-w-full object-contain" />
                      </span>
                      <span>
                        <span className="block text-[14px] font-bold text-navy">{m.name}</span>
                        <span className="block text-[12px] text-muted">{t(m.hint)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Send money to */}
              <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-green/50 bg-green-soft/30 px-4 py-3.5">
                <img
                  src={activeMethod.logo}
                  alt={`${activeMethod.name} logo`}
                  className="h-8 w-auto shrink-0 rounded bg-white p-1"
                />
                <div>
                  <p className="text-[12.5px] text-muted">{t("Is number par bhejein")}</p>
                  <p className="text-[17px] font-extrabold text-navy">
                    PKR {plan.price.toLocaleString()}
                  </p>
                </div>
                <div className="ms-auto text-end">
                  <p className="text-[12.5px] text-muted">{fill(t("{name} number"), { name: activeMethod.name })}</p>
                  <p className="text-[15px] font-extrabold tracking-wide text-green">
                    {activeMethod.number}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">{fill(t("Aap ka {name} number *"), { name: activeMethod.name })}</label>
                  <input
                    required
                    className="field"
                    type="tel"
                    placeholder={t("jaise 0300 1234567")}
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                  />
                  <p className="mt-1 text-[11.5px] text-muted">{t("Wohi number jis se aap ne paise bheje")}</p>
                </div>
                <div>
                  <label className="field-label">{t("Transaction ID (TrxID) *")}</label>
                  <input
                    required
                    className="field"
                    placeholder={t("jaise 9F2K5LMN8P")}
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  />
                  <p className="mt-1 text-[11.5px] text-muted">{t("SMS mein aayi TrxID copy kar lein")}</p>
                </div>
              </div>

              <div>
                <label className="field-label">{t("Payment ki screenshot (optional — par madad karti hai!)")}</label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-line px-4 py-4 transition-all hover:border-green hover:bg-green-soft/40">
                  <Upload size={22} className="text-muted" />
                  <span className="text-[13px] text-muted">
                    {screenshot ? (
                      <span className="font-semibold text-green">{screenshot.name} ✓</span>
                    ) : (
                      <>{t("Screenshot yahan drop karein ya click kar ke browse karein")}</>
                    )}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => pickScreenshot(e.target.files)} />
                  {screenshot && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setScreenshot(null);
                      }}
                      className="ms-auto text-muted hover:text-red-500"
                    >
                      <X size={15} />
                    </button>
                  )}
                </label>
              </div>

              {err && (
                <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                  {t(err)}{errDetail ? ` (${errDetail})` : ""}
                </p>
              )}

              <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
                {busy ? <Loader2 size={15} className="animate-spin" /> : <BadgeCheck size={15} />}
                {busy ? t("Bhej rahe hain…") : t("Ho gaya! Payment submit karein ✓")}
              </button>
              <p className="text-center text-[11.5px] text-muted">
                {t("Bas itna hi! Hamari team verify kar ke plan foran activate kar degi — aam tor par 2-4 ghante.")}
              </p>
              <p className="text-center text-[11.5px] text-muted">
                {t("Koi masla ho to WhatsApp par baat kar lein — hum madad karte hain 😊")}
              </p>
            </form>
          )}
        </div>
      </Reveal>
    </div>
  );
}
