"use client";

import { useState } from "react";
import { Building2, Home, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLiveRefresh } from "@/lib/useLiveRefresh";

type Stats = { properties: number; agents: number; schemes: number };

export default function LiveAboutStats() {
  const [stats, setStats] = useState<Stats>({ properties: 0, agents: 0, schemes: 0 });
  const [ready, setReady] = useState(false);

  useLiveRefresh(["properties", "agents", "schemes"], async () => {
    if (!supabase) return;
    const [p, a, s] = await Promise.all([
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("agents").select("*", { count: "exact", head: true }).eq("verified", true),
      supabase.from("schemes").select("*", { count: "exact", head: true }).eq("status", "Active"),
    ]);
    setStats({
      properties: p.count ?? 0,
      agents: a.count ?? 0,
      schemes: s.count ?? 0,
    });
    setReady(true);
  });

  const cards = [
    { Icon: Home, value: stats.properties, label: "Properties Listed" },
    { Icon: Users, value: stats.agents, label: "Verified Agents" },
    { Icon: Building2, value: stats.schemes, label: "Housing Schemes" },
  ];

  return (
    <div className="grid gap-4 pt-4 sm:grid-cols-3">
      {cards.map(({ Icon, value, label }) => (
        <div key={label} className="rounded-2xl border border-line bg-white p-5 text-center">
          <Icon size={24} className="mx-auto text-green" />
          <p className="mt-2 text-[20px] font-extrabold text-navy">
            {ready ? value.toLocaleString() : "—"}
          </p>
          <p className="text-[12.5px] text-muted">{label}</p>
        </div>
      ))}
    </div>
  );
}
