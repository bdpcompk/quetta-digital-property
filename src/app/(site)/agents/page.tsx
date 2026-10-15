"use client";

import { useEffect, useState } from "react";
import { Search, UserX } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import AgentCard from "@/components/properties/AgentCard";
import { AGENTS, getAgents } from "@/lib/data";
import { useLang } from "@/components/layout/LanguageProvider";
import type { Agent } from "@/lib/types";

export default function AgentsPage() {
  const { t } = useLang();
  const [sort, setSort] = useState("rating");
  const [query, setQuery] = useState("");
  const [all, setAll] = useState<Agent[]>(AGENTS);

  useEffect(() => {
    getAgents().then(setAll);
  }, []);

  const q = query.trim().toLowerCase();
  const list = [...all]
    .filter((a) =>
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      (a.location || "").toLowerCase().includes(q)
    )
    .sort((a, b) =>
      sort === "reviews" ? b.reviews.length - a.reviews.length : b.rating - a.rating
    );

  return (
    <>
      <PageBanner
        title="Verified Agents in Balochistan"
        crumbs={[{ label: "Home", href: "/" }, { label: "Agents" }]}
      />
      <section className="section">
        <div className="wrap">
          <Reveal>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-5 py-3.5">
              <div className="relative min-w-[220px] flex-1">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("Search agents by name, type or location...")}
                  className="field w-full py-1.5 pl-9 pr-8"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                    title={t("Clear")}
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="text-[13.5px] text-muted">
                {t("Showing")} <b className="text-ink">{list.length} {t("verified agents")}</b>
              </p>
              <select className="field w-auto py-1.5" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="rating">{t("Sort: Top Rated")}</option>
                <option value="reviews">{t("Most Reviews")}</option>
              </select>
            </div>
          </Reveal>
          {list.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white py-16 text-center">
              <UserX size={40} className="mx-auto text-muted" />
              <p className="mt-4 text-[16px] font-bold text-navy">{t("No agents found")}</p>
              <p className="mt-1.5 text-[13.5px] text-muted">{t("Try a different name, agency or city")}</p>
              <button onClick={() => setQuery("")} className="btn-ghost mt-4 inline-flex">
                {t("Clear Filters")}
              </button>
            </div>
          ) : (
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((a) => (
                <StaggerItem key={a.id}>
                  <AgentCard a={a} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </>
  );
}
