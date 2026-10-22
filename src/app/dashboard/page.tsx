"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";

export default function DashboardPage() {
  const { session, ready, name } = useSession();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const sb = supabase;
    if (!sb || !ready) return;
    if (!session) {
      router.replace("/login/?next=%2Fdashboard%2F");
      return;
    }
    let alive = true;
    const timer = setTimeout(async () => {
      const { data } = await sb
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (!alive) return;
      const r = String(data?.role ?? "common");
      setRole(r);
      if (r !== "agent" && r !== "owner") router.replace("/profile/");
    }, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [ready, session, router]);

  if (!ready || !session || !role || (role !== "agent" && role !== "owner")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-green" size={28} />
      </div>
    );
  }

  return role === "agent" ? (
    <AgentDashboard session={session} name={name} />
  ) : (
    <OwnerDashboard session={session} name={name} />
  );
}
