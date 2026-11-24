"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Loader2, Users, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPKR } from "@/lib/data";
import type { Property } from "@/lib/types";

type Account = {
  user_id: string;
  email: string;
  role: string;
};

type AgentInfo = {
  user_id: string;
  name: string;
  email: string;
};

export default function AgentListingsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const [accRes, agentRes, propRes] = await Promise.all([
      supabase.rpc("admin_list_users"),
      supabase.from("agents").select("user_id, name, email"),
      supabase.from("properties").select("*").order("id", { ascending: false }),
    ]);
    const agentAccounts: Account[] = Array.isArray(accRes.data)
      ? (accRes.data as Account[]).filter(
          (a) => a.role === "agent" && a.email !== "bdpcompk@gmail.com",
        )
      : [];
    const agentRows = (agentRes.data as { user_id: string | null; name: string; email: string }[]) || [];
    const nameByUser = new Map<string, string>();
    for (const a of agentRows) {
      if (a.user_id) nameByUser.set(a.user_id, a.name || a.email);
    }
    const list: AgentInfo[] = agentAccounts.map((a) => ({
      user_id: a.user_id,
      name: nameByUser.get(a.user_id) || a.email.split("@")[0],
      email: a.email,
    }));
    setAgents(list);
    setProperties((propRes.data as Property[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    if (selectedAgent !== "all") {
      setOpen((prev) => ({ ...prev, [selectedAgent]: true }));
    }
  }, [selectedAgent]);

  const grouped = useMemo(() => {
    const map = new Map<string, Property[]>();
    for (const p of properties) {
      const key = p.created_by || "__unassigned__";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return map;
  }, [properties]);

  const filteredAgents = useMemo(() => {
    let list = agents;
    if (selectedAgent !== "all") {
      list = list.filter((a) => a.user_id === selectedAgent);
    }
    if (!q.trim()) return list;
    const s = q.toLowerCase();
    return list.filter(
      (a) => a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s),
    );
  }, [agents, q, selectedAgent]);

  const unassigned = grouped.get("__unassigned__") || [];

  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Agent Listings</h1>
      <p className="mb-5 text-[13px] leading-relaxed text-muted">
        Har agent ki alag listings yahan grouped hain. Agent khud{" "}
        <Link href="/my-account/" className="font-semibold text-green hover:underline">
          My Account
        </Link>{" "}
        se apni listings manage karta hai; admin yahan check kar sakta hai.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 focus-within:border-green sm:max-w-xs">
          <Search size={15} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search agent by name/email…"
            className="w-full bg-transparent text-[13px] outline-none"
          />
        </div>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-[13px] font-semibold text-navy outline-none focus:border-green"
        >
          <option value="all">All agents</option>
          {agents.map((a) => (
            <option key={a.user_id} value={a.user_id}>
              {a.name} ({(grouped.get(a.user_id) || []).length})
            </option>
          ))}
        </select>
        <span className="text-[12.5px] text-muted">
          {agents.length} agents · {properties.length} properties
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-green" size={28} />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAgents.map((a) => {
            const list = grouped.get(a.user_id) || [];
            const isOpen =
              selectedAgent === a.user_id
                ? true
                : open[a.user_id] ?? list.length <= 5;
            const shown = isOpen ? list : list.slice(0, 5);
            return (
              <div key={a.user_id} className="overflow-hidden rounded-2xl border border-line bg-white">
                <button
                  onClick={() =>
                    setOpen((prev) => ({ ...prev, [a.user_id]: !isOpen }))
                  }
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface/60"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-soft text-green">
                    <Users size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold text-navy">{a.name}</p>
                    <p className="truncate text-[12px] text-muted">{a.email}</p>
                  </div>
                  <span className="text-[12px] font-semibold text-green">
                    {isOpen ? "Close ▲" : "View listings ▼"}
                  </span>
                  <span className="rounded-full bg-navy/5 px-3 py-1 text-[12px] font-bold text-navy">
                    {list.length} {list.length === 1 ? "listing" : "listings"}
                  </span>
                </button>
                {list.length > 0 && (
                  <div className="border-t border-line">
                    <ul className="divide-y divide-line">
                      {shown.map((p) => (
                        <li key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                          <Building2 size={14} className="shrink-0 text-muted" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold text-navy">
                              {p.title}
                            </p>
                            <p className="text-[11.5px] text-muted">
                              {p.district || p.address || "—"} · {formatPKR(p.price)}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase ${
                              String(p.status || "").toLowerCase() === "active"
                                ? "bg-green-soft text-green"
                                : String(p.status || "").toLowerCase() === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {p.status || "—"}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {list.length > 5 && (
                      <button
                        onClick={() =>
                          setOpen((prev) => ({ ...prev, [a.user_id]: !isOpen }))
                        }
                        className="w-full border-t border-line px-4 py-2 text-[12px] font-semibold text-green hover:bg-green-soft"
                      >
                        {isOpen ? "Show less" : `Show all ${list.length}`}
                      </button>
                    )}
                  </div>
                )}
                {list.length === 0 && (
                  <p className="border-t border-line px-4 py-3 text-[12.5px] text-muted">
                    Is agent ka abhi koi listing nahi.
                  </p>
                )}
              </div>
            );
          })}

          {filteredAgents.length === 0 && (
            <p className="rounded-2xl border border-line bg-white px-6 py-14 text-center text-[14px] text-muted">
              Koi agent nahi mila.
            </p>
          )}

          {unassigned.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/40">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Building2 size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-navy">Unassigned properties</p>
                  <p className="text-[12px] text-muted">created_by nahi (legacy/demo data)</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-bold text-amber-700">
                  {unassigned.length}
                </span>
              </div>
              <ul className="divide-y divide-amber-100 border-t border-amber-200 bg-white">
                {unassigned.slice(0, 20).map((p) => (
                  <li key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                    <Building2 size={14} className="shrink-0 text-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-navy">{p.title}</p>
                      <p className="text-[11.5px] text-muted">
                        {p.district || p.address || "—"} · {formatPKR(p.price)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-bold uppercase text-slate-600">
                      {p.status || "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
