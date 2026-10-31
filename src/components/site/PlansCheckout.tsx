"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, Banknote, Camera, CheckCircle2, Home, Info, Loader2, LogIn, Receipt, Upload, X,
} from "lucide-react";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { useSession } from "@/lib/useSession";
import { useSiteSetting, useSiteSettingValue } from "@/lib/useSiteSetting";
import { useLang } from "@/components/layout/LanguageProvider";
import { parsePlans, PACKAGES_CONFIG_KEY, type PackagePlan } from "@/lib/packages";

const PLAN_UR: Record<string, string> = {
  basic: "بنیادی",
  featured: "فیچرڈ",
  premium: "پریمی엄",
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const METHODS = [
  {
    id: "easypaisa",
    name: "Easypaisa",
    urName: "ایزی پیسہ",
    defaultNumber: "0345 1234567",
    logo: `${basePath}/logos/easypaisa.png`,
    stripe: "bg-green",
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    urName: "جیز کیش",
    defaultNumber: "0300 1234567",
    logo: `${basePath}/logos/jazzcash.png`,
    stripe: "bg-navy",
  },
] as const;

const STEPS = [
  {
    n: 1,
    en: "Payment Receipt Screen",
    ur: "رسید ادائیگی کی اسکرین",
    descEn: "Complete the payment inside your Easypaisa / JazzCash app",
    descUr: "اپنے ایزی پیسہ / جیز کیش ایپ کے اندر ادائیگی مکمل کریں",
    icon: Receipt,
  },
  {
    n: 2,
    en: "Take Screenshot",
    ur: "اسکرین شاٹ لیں",
    descEn: "Press Power + Volume Down together to capture the receipt",
    descUr: "رسید کی تصویر کے لیے پاور + ولیوم ڈاؤن ایک ساتھ دبائیں",
    icon: Camera,
  },
  {
    n: 3,
    en: "Upload on BDP Website",
    ur: "ویب سائٹ پر اسکرین شاٹ اپ لوڈ کریں",
    descEn: "Upload it in the Payment Details box above",
    descUr: "اوپر والے پیمنٹ ڈیٹیلز خانے میں اپ لوڈ کریں",
    icon: Upload,
  },
  {
    n: 4,
    en: "Success Message",
    ur: "کامیابی کا پیغام",
    descEn: "We verify and activate your plan — usually within hours",
    descUr: "ہم تصدیق کر کے آپ کا پلان فعال کرتے ہیں — عام طور پر چند گھنٹوں میں",
    icon: BadgeCheck,
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

function qrUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(data)}`;
}

function Bi({ en, ur }: { en: string; ur: string }) {
  return (
    <>
      {en} <span className="font-medium text-muted">•</span>{" "}
      <span dir="rtl">{ur}</span>
    </>
  );
}

export default function PlansCheckout() {
  const { session, ready, supabase: sb } = useSession();
  const { t } = useLang();
  const paymentsOn = useSiteSetting("payments_enabled");
  const easypaisaNumber = useSiteSettingValue("easypaisa_number");
  const jazzcashNumber = useSiteSettingValue("jazzcash_number");
  const packagesConfigRaw = useSiteSettingValue(PACKAGES_CONFIG_KEY);
  const PLANS = useMemo(
    () => parsePlans(packagesConfigRaw).filter((p) => p.enabled !== false),
    [packagesConfigRaw]
  );
  const [selected, setSelected] = useState("featured");
  const [method, setMethod] = useState<"easypaisa" | "jazzcash">("easypaisa");
  const [trxId, setTrxId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [errDetail, setErrDetail] = useState("");
  const [done, setDone] = useState(false);

  const plan = PLANS.find((p) => p.id === selected) ?? PLANS[0];
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
        <h3 className="mt-4 text-[18px] font-bold text-navy">
          <Bi en="Payments Coming Soon" ur="ادائیگیاں جلد آ رہی ہیں" />
        </h3>
        <p className="mx-auto mt-2 max-w-[460px] text-[13.5px] leading-relaxed text-muted">
          Online payments are being set up — filhaal plan khareedne ke liye humein message
          kar dein, hum khud madad kar denge.{" "}
          <span dir="rtl">آن لائن ادائیگیاں ترتیب دی جا رہی ہیں — ہمیں پیغام دیں، ہم مدد کر دیں گے۔</span>
        </p>
        <Link href="/contact/" className="btn-primary mt-5 inline-flex">
          <Bi en="Contact Us" ur="ہم سے رابطہ کریں" />
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-soft">
          <BadgeCheck size={40} className="text-green" />
        </span>
        <h3 className="mt-4 text-[20px] font-extrabold text-navy">
          <Bi en="Success! Payment Proof Submitted" ur="آپ کا پروف کامیابی سے جمع ہو گیا" />
        </h3>
        <p className="mx-auto mt-2 max-w-[480px] text-[13.5px] leading-relaxed text-muted">
          Confirmation will be sent via SMS /{" "}
          <span dir="rtl">آپ کو ایس ایم ایس ذریعے تصدیق موصول ہو جائے گی</span>
        </p>
        <p className="mx-auto mt-2 max-w-[480px] text-[13.5px] leading-relaxed text-muted">
          {fill(
            t("Aap ka {plan} plan — PKR {amount} ({method} se) humein mil gaya hai. Hamari team ab isay verify kar rahi hai (aam tor par 2-4 ghante) aur verify hote hi aap ka plan foran activate ho jaye ga. Tension na lein — sab ho jaye ga! 😊"),
            {
              plan: plan.name,
              amount: plan.price.toLocaleString(),
              method: activeMethod.name,
            },
          )}
        </p>
        <p className="mx-auto mt-3 flex max-w-[420px] items-center justify-center gap-2 rounded-xl bg-green-soft/50 px-4 py-2.5 text-[13px] font-bold text-green">
          <BadgeCheck size={15} /> <Bi en="Safe & Verified" ur="محفوظ اور تصدیق شدہ" />
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
          {/* Secure banner */}
          <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-navy via-green-dark to-green p-4 sm:p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/95 text-green">
              <Home size={24} />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-extrabold text-white">
                Secure Payment for Property Services
              </p>
              <p className="text-[13px] font-medium text-white/95" dir="rtl">
                پراپرٹی خدمات کے لیے محفوظ اور فوری ادائیگی
              </p>
            </div>
          </div>

          {!session ? (
            <div className="mt-6 text-center">
              <LogIn size={32} className="mx-auto text-green" />
              <p className="mt-3 text-[14px] font-semibold text-navy">
                <Bi en="Login to purchase a plan" ur="پلان خریدنے کے لیے لاگ اِن کریں" />
              </p>
              <p className="mt-1 text-[12.5px] text-muted">Takes less than a minute! 🙂</p>
              <div className="mt-4 flex justify-center gap-3">
                <Link href="/login/?next=%2Fpackages%2F" className="btn-primary">{t("Login")}</Link>
                <Link href="/signup/?next=%2Fpackages%2F" className="btn-ghost">{t("Naya Account")}</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              {/* Method heading */}
              <h3 className="mt-5 text-[16px] font-extrabold text-navy">
                <Bi en="Choose Payment Method" ur="ادائیگی کا طریقہ منتخب کریں" />
              </h3>

              {/* Method cards */}
              <div className="mt-4 space-y-4">
                {METHODS.map((m) => {
                  const active = method === m.id;
                  const badgeNavy = plan.id === "premium";
                  return (
                    <button
                      type="button"
                      key={m.id}
                      aria-pressed={active}
                      onClick={() => setMethod(m.id as "easypaisa" | "jazzcash")}
                      className={`block w-full overflow-hidden rounded-2xl border-2 text-left transition-all ${
                        active
                          ? "border-green shadow-[0_8px_28px_rgba(26,135,84,.14)]"
                          : "border-line hover:border-green/50"
                      }`}
                    >
                      <span className={`block h-1.5 w-full ${m.stripe}`} />
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <img src={m.logo} alt={`${m.name} logo`} className="h-9 w-auto shrink-0" />
                          <span
                            className={`rounded-full px-3 py-1 text-[11.5px] font-bold text-white ${
                              badgeNavy ? "bg-navy" : "bg-green"
                            }`}
                          >
                            {plan.name} Plan • <span dir="rtl">{PLAN_UR[plan.id]}</span> پلان
                          </span>
                          <span className="ms-auto text-end">
                            <span className="block text-[26px] font-extrabold leading-none text-green">
                              Rs. {plan.price.toLocaleString()}
                            </span>
                            <span className="mt-1 block text-[13px] font-semibold text-green-dark" dir="rtl">
                              {plan.price.toLocaleString()} روپے
                            </span>
                          </span>
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-[148px_1fr]">
                          <div className="rounded-xl border-2 border-dashed border-line bg-slate-50 p-2 text-center">
                            <img
                              src={qrUrl(
                                `${m.name} payment - BDP Balochistan Digital Property, Amount: PKR ${plan.price}, Number: ${m.id === "easypaisa" ? easypaisaNumber || m.defaultNumber : jazzcashNumber || m.defaultNumber}`,
                              )}
                              alt={`${m.name} QR code`}
                              className="mx-auto h-[120px] w-[120px] bg-white"
                            />
                            <p className="mt-1.5 text-[11.5px] font-semibold text-muted">
                              <Bi en="Scan QR Code" ur="کوڈ اسکین کریں" />
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-bold text-navy">
                              <Bi en={`${m.name} Number`} ur={`${m.urName} نمبر`} />
                            </p>
                            <p className="mt-1 text-[26px] font-extrabold tracking-wide text-navy">
                              {m.id === "easypaisa"
                                ? easypaisaNumber || m.defaultNumber
                                : jazzcashNumber || m.defaultNumber}
                            </p>
                            <p className="mt-1 text-[12.5px] text-muted">
                              Send Rs. {plan.price.toLocaleString()} to this number
                            </p>
                            <p className="text-[12.5px] text-muted" dir="rtl">
                              اس نمبر پر {plan.price.toLocaleString()} روپے بھیجیں
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Payment details */}
              <div className="mt-5 rounded-2xl bg-slate-100 p-4 sm:p-5">
                <h4 className="text-[15px] font-extrabold text-navy">
                  <Bi en="Payment Details" ur="ادائیگی کی تفصیلات" />
                </h4>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="field-label">
                      <Bi en="Transaction ID (TID)" ur="ٹرانزیکشن آئی ڈی" />
                    </label>
                    <input
                      required
                      className="field bg-white"
                      placeholder="Enter TID here • یہاں درج کریں"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    />
                  </div>

                  <div>
                    <label className="field-label">
                      <Bi en="Sender Mobile Number" ur="بھیجنے والا موبائل نمبر" />
                    </label>
                    <input
                      required
                      className="field bg-white"
                      type="tel"
                      placeholder="03XX-XXXXXX"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3.5 text-[14px] font-extrabold text-white transition-all hover:bg-navy-deep">
                      <Upload size={17} />
                      <Bi en="Upload Screenshot" ur="اسکرین شاٹ اپ لوڈ کریں" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => pickScreenshot(e.target.files)} />
                    </label>
                    {screenshot && (
                      <p className="mt-2 flex items-center gap-2 rounded-lg bg-green-soft/60 px-3 py-2 text-[12.5px] font-semibold text-green">
                        <CheckCircle2 size={14} /> {screenshot.name} ✓
                        <button
                          type="button"
                          onClick={() => setScreenshot(null)}
                          className="ms-auto text-muted hover:text-red-500"
                          aria-label="Remove screenshot"
                        >
                          <X size={14} />
                        </button>
                      </p>
                    )}
                    <p className="mt-2 flex items-start gap-1.5 text-[12px] text-muted">
                      <Info size={14} className="mt-0.5 shrink-0" />
                      <span>
                        Please upload the payment proof screenshot after sending payment —{" "}
                        <span dir="rtl">ادائیگی کے بعد اسکرین شاٹ اپ لوڈ کریں</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {err && (
                <p className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                  {t(err)}{errDetail ? ` (${errDetail})` : ""}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="mt-4 w-full rounded-xl bg-green py-4 text-[15px] font-extrabold text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                {busy ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Submitting… • جمع ہو رہا ہے…
                  </span>
                ) : (
                  <Bi en="Approve & Submit" ur="منظوری دیں" />
                )}
              </button>

              {/* Footer */}
              <p className="mt-4 text-center text-[12px] font-bold text-navy">
                BDP © 2024 – Balochistan Digital Property — Secure &amp; Verified Payments
              </p>
              <p className="mt-1 text-center text-[12px] text-muted">
                Need help? support@bdp.pk <span className="text-muted">•</span>{" "}
                <span dir="rtl">مدد کے لیے support@bdp.pk</span>
              </p>
            </form>
          )}
        </div>
      </Reveal>

      {/* Upload guide */}
      <Reveal>
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="text-center">
            <p className="text-[16px] font-extrabold text-navy">
              <Bi en="Payment Proof Upload Guide" ur="ادائیگی کا ثبوت اپ لوڈ گائیڈ" />
            </p>
            <p className="mt-1 text-[12.5px] text-muted">
              <Bi en="Simple 4-Step Guide" ur="قدم پر قدم گائیڈ" />
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-3 rounded-2xl border border-line bg-slate-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green text-[16px] font-extrabold text-white">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-extrabold text-navy">
                    <Bi en={`Step ${s.n}: ${s.en}`} ur={`قدم ${s.n}: ${s.ur}`} />
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                    {s.descEn}
                    <br />
                    <span dir="rtl">{s.descUr}</span>
                  </p>
                  <span className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-soft text-green">
                    <s.icon size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-xl bg-green-soft/60 px-4 py-3 text-[12.5px] font-semibold text-green">
            <Info size={15} className="mt-0.5 shrink-0" />
            <span>
              <b>Tip • ٹپ:</b> Make sure your screenshot clearly shows Transaction ID &amp; Amount
              for faster verification —{" "}
              <span dir="rtl">تیز تصدیق کے لیے اسکرین شاٹ پر ٹرانزیکشن آئی ڈی اور رقم واضح نظر آنی چاہیے</span>
            </span>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
