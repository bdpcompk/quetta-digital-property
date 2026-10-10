"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Construction } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LandRecordGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "on" | "off">(() =>
    supabase ? "loading" : "on"
  );

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("app_settings")
      .select("value")
      .eq("key", "land_records_enabled")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setState("on");
        else setState(data && data.value === "off" ? "off" : "on");
      });
  }, []);

  if (state === "loading") {
    return (
      <section className="section">
        <div className="wrap">
          <div className="h-40 animate-pulse rounded-2xl bg-surface" />
        </div>
      </section>
    );
  }

  if (state === "off") {
    return (
      <section className="section">
        <div className="wrap">
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
              <Construction size={26} />
            </span>
            <h1 className="mt-4 text-[18px] font-extrabold text-navy">
              Land Record Pages are currently disabled
            </h1>
            <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
              Our team is updating the land record information. Please check the
              other tools in the meantime.
            </p>
            <Link href="/tools/" className="btn-primary mt-5">
              Browse Tools <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
