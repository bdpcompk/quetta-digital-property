"use client";

import { useEffect, useState } from "react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import AgentCard from "@/components/properties/AgentCard";
import { AGENTS, getAgents } from "@/lib/data";
import type { Agent } from "@/lib/types";

export default function AgentsPage() {
  const [sort, setSort] = useState("rating");
  const [all, setAll] = useState<Agent[]>(AGENTS);

  useEffect(() => {
    getAgents().then(setAll);
  }, []);

  const list = [...all].sort((a, b) =>
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
              <p className="text-[13.5px] text-muted">
                Showing <b className="text-ink">{list.length} verified agents</b>
              </p>
              <select className="field w-auto py-1.5" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="rating">Sort: Top Rated</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </Reveal>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((a) => (
              <StaggerItem key={a.id}>
                <AgentCard a={a} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
