"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Building2, ChevronDown, Clock, Home, UserCog, Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

type Pending = { requested_role: "agent" | "owner"; status: string } | null;

export default function PostDropdown() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("common");
  const [pending, setPending] = useState<Pending>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { session, ready } = useSession();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const sb = supabase;
    if (!sb || !session?.user?.id) return;
    let alive = true;
    const timer = setTimeout(async () => {
      const [r, q] = await Promise.all([
        sb.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle(),
        sb
          .from("role_requests")
          .select("requested_role, status")
          .eq("user_id", session.user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1),
      ]);
      if (!alive) return;
      if (r.data?.role) setRole(String(r.data.role));
      if (q.data && q.data[0]) setPending(q.data[0] as Pending);
    }, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [session?.user?.id]);

  const isAgent = role === "agent";
  const isOwner = role === "owner";

  const postOption = {
    label: "Post a Property",
    desc: isAgent ? "List a property for your client" : "Post your own property for sale or rent",
    href: "/sell/",
    icon: Home,
  };

  const roleOptions = [
    {
      label: "Register as Agent",
      desc: "Get verified to list properties for clients",
      href: "/become-agent/",
      icon: UserCog,
      hidden: isAgent || pending?.requested_role === "agent",
    },
    {
      label: "Register as Scheme Owner",
      desc: "Add and manage your housing scheme",
      href: "/become-owner/",
      icon: Building2,
      hidden: isOwner || pending?.requested_role === "owner",
    },
    {
      label: "Add a Scheme",
      desc: "Publish your housing scheme",
      href: "/schemes/add/",
      icon: Building2,
      hidden: !isOwner,
    },
  ].filter((o) => !o.hidden);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="hidden whitespace-nowrap rounded-lg bg-green px-3 py-1.5 text-[15px] font-semibold text-white transition-all hover:bg-green-dark sm:flex sm:items-center sm:gap-1.5"
      >
        Post Your Property <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-[300px] rounded-xl border border-line bg-white p-2 shadow-[0_20px_50px_rgba(13,31,51,.28)]">
          <Link
            href={postOption.href}
            onClick={() => setOpen(false)}
            className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface"
          >
            <postOption.icon size={18} className="mt-0.5 shrink-0 text-green" />
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold text-ink">{postOption.label}</span>
              <span className="block text-[11.5px] text-muted">{postOption.desc}</span>
            </span>
          </Link>

          {roleOptions.length > 0 && (
            <>
              <div className="my-1.5 border-t border-line" />
              <p className="px-3 pb-1 pt-0.5 text-[10.5px] font-bold uppercase tracking-wide text-muted">
                Become a Professional
              </p>
              {roleOptions.map((o) => (
                <Link
                  key={o.href + o.label}
                  href={o.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface"
                >
                  <o.icon size={18} className="mt-0.5 shrink-0 text-green" />
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-semibold text-ink">{o.label}</span>
                    <span className="block text-[11.5px] text-muted">{o.desc}</span>
                  </span>
                </Link>
              ))}
            </>
          )}

          {pending && (
            <>
              <div className="my-1.5 border-t border-line" />
              <p className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-[12px] font-semibold text-amber-700">
                <Clock size={14} />{" "}
                {pending.requested_role === "agent" ? "Agent" : "Scheme Owner"} request under review
              </p>
            </>
          )}

          {ready && isAgent && (
            <p className="mt-1 flex items-center gap-2 px-3 pb-1 text-[11.5px] font-semibold text-green">
              <Users size={13} /> You are registered as an Agent
            </p>
          )}
        </div>
      )}
    </div>
  );
}
