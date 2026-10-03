"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, HeadphonesIcon, ShieldCheck, Sparkles } from "lucide-react";
import { PROPERTIES, AGENTS, ARTICLES, getProperties, getAgents, getArticles } from "@/lib/data";
import type { Property, Agent, Article } from "@/lib/types";
import PropertyCard from "@/components/properties/PropertyCard";
import AgentCard from "@/components/properties/AgentCard";
import ArticleCard from "@/components/properties/ArticleCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";

const TABS = ["All", "Houses", "Plots", "Flats / Apartments", "Commercial", "Agricultural Land"];

export function FeaturedSection() {
  const [tab, setTab] = useState("All");
  const [items, setItems] = useState<Property[]>(PROPERTIES);

  useEffect(() => {
    getProperties().then(setItems);
  }, []);

  const list = (tab === "All" ? items : items.filter((p) => p.type === tab)).slice(0, 8);

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[22px] font-extrabold text-navy sm:text-[26px]">
              Featured Properties
            </h2>
            <div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:w-auto">
              <div className="no-bar flex max-w-full gap-1.5 overflow-x-auto rounded-xl bg-white p-1.5 ring-1 ring-line">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition-all ${
                      tab === t
                        ? "bg-green text-white shadow-[0_4px_12px_rgba(26,135,84,.3)]"
                        : "text-muted hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {t === "Flats / Apartments" ? "Flats" : t}
                  </button>
                ))}
              </div>
              <Link href="/listings/" className="link-more">
                View All Featured →
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {list.map((p) => (
                  <PropertyCard key={p.id} p={p} />
                ))}
              </motion.div>
            </AnimatePresence>
            {list.length === 0 && (
              <p className="rounded-2xl border border-dashed border-line bg-white py-12 text-center text-sm text-muted">
                No properties in this category yet.
              </p>
            )}
          </div>

          <Reveal delay={0.15}>
            <aside className="sticky top-24 flex flex-col rounded-2xl bg-gradient-to-b from-green to-green-dark p-6 text-white">
              <h3 className="text-[19px] font-extrabold leading-snug">
                Your Dream Property Awaits in Balochistan
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/80">
                Explore thousands of verified properties across all districts.
              </p>
              <Link
                href="/sell/"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-[13.5px] font-bold text-green transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Post Your Property →
              </Link>

              <div className="mt-6 space-y-4 border-t border-white/20 pt-5">
                {[
                  { Icon: ShieldCheck, t: "Verified Listings", s: "Safe & Secure" },
                  { Icon: HeadphonesIcon, t: "Direct Contact", s: "Call / WhatsApp" },
                  { Icon: Globe, t: "Wide Coverage", s: "All 36 Districts" },
                  { Icon: Sparkles, t: "Trusted Platform", s: "Since 2025" },
                ].map(({ Icon, t, s }) => (
                  <div key={t} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                      <Icon size={16} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[13px] font-semibold">{t}</p>
                      <p className="text-[11.5px] text-white/70">{s}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function AgentsSection() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);

  useEffect(() => {
    getAgents().then(setAgents);
  }, []);

  return (
    <section className="section section-alt">
      <div className="wrap">
        <Reveal>
          <SectionHeading title="Verified Agents" href="/agents/" linkLabel="View All Agents" />
        </Reveal>
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((a) => (
            <StaggerItem key={a.id}>
              <AgentCard a={a} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function GuidesSection() {
  const [articles, setArticles] = useState<Article[]>(ARTICLES);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            title="Property Guides & Latest Articles"
            href="/guides/"
            linkLabel="View All Articles"
          />
        </Reveal>
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((a) => (
            <StaggerItem key={a.id}>
              <ArticleCard a={a} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
