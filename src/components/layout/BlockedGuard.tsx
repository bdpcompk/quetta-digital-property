"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

export default function BlockedGuard() {
  const { session, ready } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const sb = supabase;
    if (!sb || !ready || !session) return;
    let alive = true;
    (async () => {
      const { data } = await sb
        .from("user_roles")
        .select("blocked")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (!alive || !data?.blocked) return;
      await sb.auth.signOut();
      if (!pathname.startsWith("/login")) {
        window.location.href = "/login/?blocked=1";
      }
    })();
    return () => {
      alive = false;
    };
  }, [ready, session, pathname]);

  return null;
}
