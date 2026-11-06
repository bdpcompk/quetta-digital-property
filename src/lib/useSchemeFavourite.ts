"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useSession";

type Args = {
  schemeId?: number | null;
  schemeName?: string | null;
  kind?: "scheme" | "qda";
};

/** Persist a scheme favourite per user and keep the heart state in sync. */
export function useSchemeFavourite({ schemeId, schemeName, kind = "scheme" }: Args) {
  const { session, supabase: sb, ready } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!sb || !session) {
      queueMicrotask(() => {
        if (!cancelled) setSaved(false);
      });
      return () => {
        cancelled = true;
      };
    }
    let q = sb.from("saved_schemes").select("id").eq("user_id", session.user.id);
    if (schemeId) q = q.eq("scheme_id", schemeId);
    else if (schemeName) q = q.eq("scheme_name", schemeName);
    else return;
    q.maybeSingle().then(({ data }) => {
      if (!cancelled) setSaved(!!data);
    });
    return () => {
      cancelled = true;
    };
  }, [sb, session, schemeId, schemeName]);

  const toggle = useCallback(async () => {
    if (!schemeId && !schemeName) return;
    if (!session) {
      const next =
        typeof window !== "undefined" ? window.location.pathname + window.location.search : "/schemes/";
      router.push(`/login/?next=${encodeURIComponent(next)}`);
      return;
    }
    if (!sb || busy) return;
    setBusy(true);
    try {
      if (saved) {
        let q = sb.from("saved_schemes").delete().eq("user_id", session.user.id);
        if (schemeId) q = q.eq("scheme_id", schemeId);
        else q = q.eq("scheme_name", schemeName);
        await q;
        setSaved(false);
      } else {
        const { error } = schemeId
          ? await sb.from("saved_schemes").insert({
              user_id: session.user.id,
              scheme_id: schemeId,
              kind,
            })
          : await sb.from("saved_schemes").insert({
              user_id: session.user.id,
              scheme_name: schemeName as string,
              kind,
            });
        if (!error) setSaved(true);
      }
    } finally {
      setBusy(false);
    }
  }, [sb, session, busy, saved, schemeId, schemeName, kind, router]);

  return { saved, busy, toggle, ready, loggedIn: !!session };
}
