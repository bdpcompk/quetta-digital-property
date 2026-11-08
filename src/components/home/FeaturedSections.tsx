"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Globe, HeadphonesIcon, ShieldCheck, TrendingUp } from "lucide-react";
import { PROPERTIES, AGENTS, ARTICLES, getProperties, getAgents, getArticles } from "@/lib/data";
import type { Property, Agent, Article } from "@/lib/types";
import PropertyCard from "@/components/properties/PropertyCard";
import AgentCard from "@/components/properties/AgentCard";
import ArticleCard from "@/components/properties/ArticleCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { useLang } from "@/components/layout/LanguageProvider";
import LiveDistrictCount from "@/components/site/LiveDistrictCount";
import { supabase } from "@/lib/supabase";

const TABS = ["All", "Houses", "Plots", "Flats / Apartments", "Commercial", "Agricultural Land"];

export function FeaturedSection() {
  const { t } = useLang();
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
              {t("Featured Properties")}
            </h2>
            <div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:w-auto">
              <div className="no-bar flex max-w-full gap-1.5 overflow-x-auto rounded-xl bg-white p-1.5 ring-1 ring-line">
                {TABS.map((tabName) => (
                  <button
                    key={tabName}
                    onClick={() => setTab(tabName)}
                    className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition-all ${
                      tab === tabName
                        ? "bg-green text-white shadow-[0_4px_12px_rgba(26,135,84,.3)]"
                        : "text-muted hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {tabName === "Flats / Apartments" ? t("Flats") : t(tabName)}
                  </button>
                ))}
              </div>
              <Link href="/listings/" className="link-more">
                {t("View All Featured")} →
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
                {t("No properties in this category yet.")}
              </p>
            )}
          </div>

          <Reveal delay={0.15}>
            <aside className="sticky top-24 flex flex-col rounded-2xl bg-gradient-to-b from-green to-green-dark p-6 text-white">
              <h3 className="text-[19px] font-extrabold leading-snug">
                {t("Your Dream Property Awaits in Balochistan")}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/80">
                {t("Explore thousands of verified properties across all districts.")}
              </p>
              <Link
                href="/sell/"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-[13.5px] font-bold text-green transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("Post Your Property")} →
              </Link>

              <div className="mt-6 space-y-4 border-t border-white/20 pt-5">
                {[
                  { Icon: ShieldCheck, t: "Verified Listings", s: "Safe & Secure" },
                  { Icon: HeadphonesIcon, t: "Direct Contact", s: "Call / WhatsApp" },
                  { Icon: Globe, t: "Wide Coverage", s: "All 40 Districts" },
                  { Icon: TrendingUp, t: "New Listings Daily", s: "Fresh Properties" },
                ].map(({ Icon, t: label, s }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                      <Icon size={16} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[13px] font-semibold">{t(label)}</p>
                      <p className="text-[11.5px] text-white/70">
                        {s === "All 40 Districts" ? (
                          <>All <LiveDistrictCount /> Districts</>
                        ) : (
                          t(s)
                        )}
                      </p>
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
  const { t } = useLang();
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  // Live agents: new registrations appear without a page reload.
  useEffect(() => {
    let alive = true;
    const load = () => {
      getAgents().then((rows) => {
        if (alive) setAgents(rows);
      });
    };
    load();

    const ch = supabase
      ?.channel("home-agents-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "agents" }, load)
      .subscribe();

    const onFocus = () => load();
    const onVis = () => {
      if (document.visibilityState === "visible") load();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      if (ch) supabase?.removeChannel(ch);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const go = useCallback(
    (index: number) => {
      const el = scroller.current;
      const count = agents.length;
      if (!el || count === 0) return;
      const i = ((index % count) + count) % count;
      const card = el.children[i] as HTMLElement | undefined;
      if (card) el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
      activeRef.current = i;
      setActive(i);
    },
    [agents.length]
  );

  // Auto-slide every 3 seconds; resumes after the 3-second pause on touch/hover.
  useEffect(() => {
    if (paused || agents.length <= 1) return;
    const timer = window.setTimeout(() => go(activeRef.current + 1), 3000);
    return () => window.clearTimeout(timer);
  }, [active, paused, agents.length, go]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    let best = 0;
    let min = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const card = el.children[i] as HTMLElement;
      const distance = Math.abs(card.offsetLeft - el.scrollLeft);
      if (distance < min) {
        min = distance;
        best = i;
      }
    }
    activeRef.current = best;
    setActive(best);
  };

  return (
    <section className="section section-alt">
      <div className="wrap">
        <Reveal>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[22px] font-extrabold text-navy sm:text-[26px]">
              {t("Verified Agents")}
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => go(active - 1)}
                  aria-label="Previous agent"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors hover:border-green hover:text-green"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1)}
                  aria-label="Next agent"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors hover:border-green hover:text-green"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
              <Link href="/agents/" className="link-more shrink-0">
                {t("View All Agents")} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            ref={scroller}
            onScroll={onScroll}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
            className="no-bar relative flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          >
            {agents.map((a) => (
              <div
                key={a.id}
                className="w-[86%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
              >
                <AgentCard a={a} />
              </div>
            ))}
          </div>
        </Reveal>

        {agents.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {agents.length <= 10 ? (
              agents.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show agent ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-6 bg-green" : "w-1.5 bg-line hover:bg-green/50"
                  }`}
                />
              ))
            ) : (
              <span className="text-[11.5px] font-semibold text-muted">
                {active + 1} / {agents.length}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function GuidesSection() {
  const { t } = useLang();
  const [articles, setArticles] = useState<Article[]>(ARTICLES);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            title={t("Property Guides & Latest Articles")}
            href="/guides/"
            linkLabel={t("View All Articles")}
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
