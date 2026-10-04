"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Map, MapPin, Search, Store, Tag } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const HERO =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600";
const BUNGALOW =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200";

const FIELDS = [
  { label: "Property Type", icon: Map, name: "type", options: ["Houses", "Bungalow", "Plots", "Flats / Apartments", "Commercial", "Agricultural Land", "Shops / Offices", "Farm Houses"] },
  { label: "District", icon: MapPin, name: "district", options: ["Quetta", "Gwadar", "Turbat", "Khuzdar", "Chaman", "Panjgur", "Lasbela", "Sibi", "Zhob", "Kech"] },
  { label: "City / Tehsil", icon: Store, name: "city", options: ["Satellite Town", "Jinnah Town", "Samungli", "Zarghoon Road"] },
  { label: "Price Range", icon: Tag, name: "price", options: ["PKR 1 Lac - 10 Lac", "PKR 10 Lac - 50 Lac", "PKR 50 Lac - 1 Crore", "PKR 1 Crore+"] },
];

export default function Hero() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<"Buy" | "Rent">("Buy");
  const [vals, setVals] = useState<Record<string, string>>({});

  const search = () => {
    const qs = new URLSearchParams();
    if (vals.type) qs.set("type", vals.type);
    if (vals.district) qs.set("district", vals.district);
    if (vals.city) qs.set("q", vals.city);
    if (purpose === "Rent") qs.set("purpose", "rent");
    router.push(`/listings/${qs.toString() ? `?${qs}` : ""}`);
  };

  const ease = [0.21, 0.65, 0.35, 1] as const;

  return (
    <section className="relative overflow-hidden bg-navy pb-14 pt-[calc(var(--header-h)+28px)]">
      <img
        src={HERO}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <img
        src={BUNGALOW}
        alt=""
        aria-hidden
        className="absolute inset-y-0 left-0 hidden h-full w-[55%] object-cover md:block"
        style={{
          maskImage: "linear-gradient(to right, black 30%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, black 30%, transparent 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/25 to-navy/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/40 to-navy/5" />
      <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-green/20 blur-3xl" />

      <div className="wrap relative">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Buy", href: "/listings/" },
              { label: "Rent", href: "/listings/?purpose=rent" },
              { label: "Sell", href: "/sell/" },
            ]}
          />
        </motion.div>

        <motion.h1
          className="mt-5 text-[34px] font-extrabold leading-[1.12] text-white sm:text-[44px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
        >
          Find Property for Sale and Rent
          <br />
          in <span className="text-green">Balochistan</span>
        </motion.h1>

        <motion.p
          className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease }}
        >
          Pakistan&apos;s most trusted property portal for buying, renting and selling
          properties across all districts of Balochistan.
        </motion.p>

        {/* search card */}
        <motion.div
          className="mt-7 rounded-2xl bg-white p-4 shadow-[0_24px_60px_rgba(0,0,0,.25)] sm:p-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.26, ease }}
        >
          <div className="flex gap-1.5">
            {(["Buy", "Rent"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setPurpose(t)}
                className={`rounded-lg px-6 py-2 text-[13.5px] font-semibold transition-all ${
                  purpose === t
                    ? "bg-green text-white shadow-[0_6px_16px_rgba(26,135,84,.3)]"
                    : "bg-surface text-muted hover:bg-line/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[repeat(4,1fr)_auto]">
            {FIELDS.map((f, i) => (
              <motion.label
                key={f.name}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 transition-all hover:border-green/60 focus-within:border-green focus-within:shadow-[0_0_0_3px_rgba(26,135,84,.12)]"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.36 + i * 0.06, ease }}
              >
                <f.icon size={17} className="shrink-0 text-green" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[10.5px] font-semibold text-muted">{f.label}</span>
                  <select
                    aria-label={f.label}
                    value={vals[f.name] ?? ""}
                    onChange={(e) => setVals({ ...vals, [f.name]: e.target.value })}
                    className="w-full cursor-pointer truncate bg-transparent text-[13px] font-medium text-ink outline-none"
                  >
                    <option value="">Select {f.label}</option>
                    {f.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </span>
              </motion.label>
            ))}

            <motion.button
              onClick={search}
              className="btn-primary h-[50px] whitespace-nowrap px-6"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.66, ease }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Search size={16} /> Search Property
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
