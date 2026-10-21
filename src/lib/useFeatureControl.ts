"use client";

import { useEffect, useState } from "react";
import { useSiteSetting, useSiteSettingValue } from "@/lib/useSiteSetting";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import {
  globalKey,
  roleKey,
  type FeatureId,
  type RoleId,
} from "@/lib/featureControl";

/** Global (site-wide) switch for a feature */
export function useGlobalFeature(feature: FeatureId): boolean {
  return useSiteSetting(globalKey(feature));
}

/** Role of the signed-in user (defaults to "common") */
export function useUserRole(): RoleId {
  const { session } = useSession();
  const [role, setRole] = useState<RoleId>("common");

  useEffect(() => {
    const sb = supabase;
    if (!sb || !session?.user?.id) return;
    let alive = true;
    const timer = setTimeout(async () => {
      const { data } = await sb
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (!alive) return;
      if (data?.role) {
        setRole(data.role as RoleId);
        return;
      }
      // no row yet — provision from signup metadata
      const meta = (session.user.user_metadata?.role as RoleId | undefined) ?? "common";
      setRole(meta);
      try {
        await sb.from("user_roles").upsert({
          user_id: session.user.id,
          email: session.user.email,
          role: meta,
        });
      } catch {}
    }, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [session?.user?.id, session?.user?.email, session?.user?.user_metadata?.role]);

  return role;
}

/**
 * Feature permission for the current user:
 * global switch AND the role-specific switch must both be on.
 */
export function useRoleFeature(feature: FeatureId): boolean {
  const globalOn = useGlobalFeature(feature);
  const role = useUserRole();
  const roleOn = useSiteSetting(roleKey(role, feature));
  return globalOn && roleOn;
}

/** Media limits (image size, formats, counts...) as raw settings values */
export function useMediaSetting(key: string): string | null {
  return useSiteSettingValue(key);
}
