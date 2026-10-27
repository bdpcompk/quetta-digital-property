"use client";

import { useEffect, useState } from "react";
import { useSiteSetting, useSiteSettingValue } from "@/lib/useSiteSetting";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import {
  MEDIA_DEFAULTS,
  MEDIA_KEYS,
  globalKey,
  roleKey,
  type FeatureId,
  type RoleId,
} from "@/lib/featureControl";
import { parseMediaFormats, type MediaSettings } from "@/lib/media";

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

const numberSetting = (raw: string | null, fallback: string, min = 1) => {
  const value = Number(raw ?? fallback);
  return Number.isFinite(value) ? Math.max(min, value) : Number(fallback);
};

/** All Media Settings resolved with the admin defaults, ready for upload forms. */
export function useMediaSettings(): MediaSettings {
  const maxImageMb = useSiteSettingValue(MEDIA_KEYS.maxImageMb);
  const imageFormats = useSiteSettingValue(MEDIA_KEYS.imageFormats);
  const maxImages = useSiteSettingValue(MEDIA_KEYS.maxImages);
  const maxVideoMb = useSiteSettingValue(MEDIA_KEYS.maxVideoMb);
  const videoFormats = useSiteSettingValue(MEDIA_KEYS.videoFormats);
  const maxVideos = useSiteSettingValue(MEDIA_KEYS.maxVideos);
  const maxDuration = useSiteSettingValue(MEDIA_KEYS.maxDuration);
  const autoCompress = useSiteSettingValue(MEDIA_KEYS.autoCompress);
  const thumbnail = useSiteSettingValue(MEDIA_KEYS.thumbnail);

  return {
    maxImageMb: numberSetting(maxImageMb, MEDIA_DEFAULTS[MEDIA_KEYS.maxImageMb]),
    imageFormats: parseMediaFormats(imageFormats, MEDIA_DEFAULTS[MEDIA_KEYS.imageFormats]),
    maxImages: numberSetting(maxImages, MEDIA_DEFAULTS[MEDIA_KEYS.maxImages]),
    maxVideoMb: numberSetting(maxVideoMb, MEDIA_DEFAULTS[MEDIA_KEYS.maxVideoMb]),
    videoFormats: parseMediaFormats(videoFormats, MEDIA_DEFAULTS[MEDIA_KEYS.videoFormats]),
    maxVideos: numberSetting(maxVideos, MEDIA_DEFAULTS[MEDIA_KEYS.maxVideos]),
    maxDuration: numberSetting(maxDuration, MEDIA_DEFAULTS[MEDIA_KEYS.maxDuration]),
    autoCompress: (autoCompress ?? MEDIA_DEFAULTS[MEDIA_KEYS.autoCompress]) === "on",
    thumbnail: (thumbnail ?? MEDIA_DEFAULTS[MEDIA_KEYS.thumbnail]) === "on",
  };
}
