"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, FolderKanban, LayoutList, Loader2, Package, ShieldCheck, Users, ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ADMIN_TABLES } from "@/lib/adminTables";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  properties: Package, agents: Users, projects: FolderKanban,
  qda_schemes: ShieldCheck, articles: FileText, districts: LayoutList, areas: LayoutList,
};

const HREF: Record<string, string> = {
  properties: "/admin/properties/", agents: "/admin/agents/", projects: "/admin/projects/",
  qda_schemes: "/admin/qda/", articles: "/admin/articles/",
  districts: "/admin/districts/", areas: "/admin/districts/",
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? ""));
    (async () => {
      const entries = await Promise.all(
        ADMIN_TABLES.map(async (t) => {
          const { count } = await sb
            .from(t.name)
            .select("*", { count: "exact", head: true });
          return [t.name, count ?? null] as const;
        })
      );
      setCounts(Object.fromEntries(entries));
      setLoading(false);
    })();
  }, []);

  const cards = [
    { name: "properties", title: "Properties" },
    { name: "agents", title: "Agents" },
    { name: "projects", title: "Projects" },
    { name: "qda_schemes", title: "QDA Schemes" },
    { name: "articles", title: "Guides" },
    { name: "districts", title: "Districts" },
    { name: "areas", title: "Areas" },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-navy">Dashboard</h1>
          <p className="text-[13px] text-muted">Signed in as {email}</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="btn-ghost">
          <ExternalLink size={14} /> View Site
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green" size={28} /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {cards.map((c) => {
              const Icon = ICONS[c.name] ?? Package;
              return (
                <Link key={c.name} href={HREF[c.name]} className="lift rounded-2xl border border-line bg-white p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-soft text-green">
                    <Icon size={19} />
                  </span>
                  <p className="mt-3 text-[26px] font-extrabold leading-none text-navy">
                    {counts[c.name] ?? "—"}
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-muted">{c.title}</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-5">
            <h2 className="text-[15px] font-bold text-navy">Quick actions</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/admin/properties/" className="btn-primary"><Package size={15} /> Manage Properties</Link>
              <Link href="/admin/qda/" className="btn-ghost"><ShieldCheck size={15} /> QDA Schemes</Link>
              <Link href="/admin/articles/" className="btn-ghost"><FileText size={15} /> Guides</Link>
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
              Changes here appear on the site listings immediately (data is served live from
              Supabase). Homepage hero/sections still use the bundled list until the next sync.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
