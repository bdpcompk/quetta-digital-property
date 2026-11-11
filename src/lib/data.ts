import type {
  District, PropertyType, Agent, Property, Article, Project, QdaScheme, Area,
  VerificationHistory, Scheme,
} from "./types";
import { supabase } from "./supabase";

export const DISTRICTS: District[] = [
  { name: "Quetta", count: "2,843+", cover: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600" },
  { name: "Gwadar", count: "1,105+", cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
  { name: "Turbat", count: "1,245+", cover: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600" },
  { name: "Khuzdar", count: "962+", cover: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600" },
  { name: "Chaman", count: "754+", cover: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600" },
  { name: "Panjgur", count: "512+", cover: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600" },
  { name: "Lasbela", count: "478+", cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600" },
  { name: "Sibi", count: "435+", cover: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600" },
  { name: "Zhob", count: "389+", cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800" },
  { name: "Kech", count: "356+", cover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600" },
];

/** Unsplash covers used when a district has no valid image (e.g. newly added). */
const DISTRICT_FALLBACK_COVERS = [
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600",
];

export function isImageUrl(url?: string | null): boolean {
  if (!url) return false;
  if (!/^https?:\/\//i.test(url)) return false;
  // Google Maps share links are saved in cover fields by mistake sometimes.
  return !/(share\.google|maps\.google|goo\.gl\/maps|google\.com\/maps)/i.test(url);
}

/** Always return a usable cover image, even for districts added without one. */
export function districtCover(d: { name?: string | null; cover?: string | null }): string {
  if (isImageUrl(d.cover)) return d.cover as string;
  const name = (d.name ?? "").trim();
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return DISTRICT_FALLBACK_COVERS[hash % DISTRICT_FALLBACK_COVERS.length];
}

export const TYPES: PropertyType[] = [
  { name: "Houses", count: "12,458+", icon: "home", color: "#3b82f6", bg: "#eff6ff" },
  { name: "Plots", count: "8,742+", icon: "map", color: "#8b5cf6", bg: "#f5f3ff" },
  { name: "Flats / Apartments", count: "2,156+", icon: "building", color: "#f59e0b", bg: "#fffbeb" },
  { name: "Commercial", count: "1,893+", icon: "store", color: "#ef4444", bg: "#fef2f2" },
  { name: "Agricultural Land", count: "1,245+", icon: "leaf", color: "#22c55e", bg: "#f0fdf4" },
  { name: "Shops / Offices", count: "986+", icon: "briefcase", color: "#ec4899", bg: "#fdf2f8" },
  { name: "Farm Houses", count: "423+", icon: "warehouse", color: "#14b8a6", bg: "#f0fdfa" },
  { name: "Other", count: "312+", icon: "grid", color: "#6366f1", bg: "#eef2ff" },
];

export const AUTHORITIES: Record<string, string> = {
  QDA: "Quetta Development Authority",
  GDA: "Gwadar Development Authority",
  BDA: "Balochistan Development Authority",
  BHTPA: "Balochistan Housing & Town Planning Authority",
};

/* ---------------- data access (Supabase-first, seed fallback) ---------------- */

export function formatPKR(n: number): string {
  if (!n || Number.isNaN(n)) return "";
  const s = Math.round(Math.abs(n)).toString();
  let out: string;
  if (s.length > 3) {
    const last3 = s.slice(-3);
    let rest = s.slice(0, -3);
    const parts: string[] = [];
    while (rest.length > 2) {
      parts.unshift(rest.slice(-2));
      rest = rest.slice(0, -2);
    }
    if (rest) parts.unshift(rest);
    out = parts.join(",") + "," + last3;
  } else {
    out = s;
  }
  return "PKR " + out;
}

export async function getProperties(): Promise<Property[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "active")
      // Featured ads always appear first, then newest listings.
      .order("featured", { ascending: false })
      .order("id", { ascending: false });
    if (!error && data && data.length) return data as Property[];
  }
  return [];
}

export async function getPropertyById(id: number, viewerId?: string | null): Promise<Property | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) {
      const row = data as Property;
      if ((row.status ?? "active") !== "active" && row.created_by !== viewerId) return null;
      return row;
    }
  }
  return null;
}

export async function getSimilarLive(p: Property): Promise<Property[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "active")
      .eq("district", p.district)
      .neq("id", p.id)
      .limit(4);
    if (!error && data && data.length) return data as Property[];
  }
  return [];
}

export async function getAgents(): Promise<Agent[]> {
  if (supabase) {
    const { data, error } = await supabase.from("agents").select("*").order("id", { ascending: false });
    if (!error && data && data.length) return data as Agent[];
  }
  return [];
}

export async function getArticles(): Promise<Article[]> {
  if (supabase) {
    const { data, error } = await supabase.from("articles").select("*").order("id");
    if (!error && data && data.length) return data as Article[];
  }
  return [];
}

export async function getDistricts(): Promise<District[]> {
  if (supabase) {
    const [districtsRes, propsRes] = await Promise.all([
      supabase.from("districts").select("*"),
      supabase.from("properties").select("district").eq("status", "active"),
    ]);
    const { data, error } = districtsRes;
    if (!error && data && data.length) {
      const counts = new Map<string, number>();
      for (const p of (propsRes.data ?? []) as { district?: string | null }[]) {
        const key = (p.district ?? "").trim().toLowerCase();
        if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      const rank = (n: string) => {
        const i = DISTRICTS.findIndex((d) => d.name === n);
        return i === -1 ? 999 : i;
      };
      return [...(data as District[])]
        .sort((a, b) => rank(a.name) - rank(b.name))
        .map((d) => ({
          ...d,
          count: String(counts.get((d.name ?? "").trim().toLowerCase()) ?? 0),
          cover: districtCover(d),
        }));
    }
  }
  return [];
}

export async function getAreas(): Promise<Area[]> {
  if (supabase) {
    const [areasRes, propsRes] = await Promise.all([
      supabase.from("areas").select("*").order("count", { ascending: false }),
      supabase.from("properties").select("district,address").eq("status", "active"),
    ]);
    const { data, error } = areasRes;
    if (!error && data && data.length) {
      const props = (propsRes.data ?? []) as { district?: string | null; address?: string | null }[];
      const counted = (data as Area[]).map((a) => {
        const area = (a.name ?? "").trim().toLowerCase();
        const district = (a.district ?? "").trim().toLowerCase();
        const count = props.filter((p) => {
          const sameDistrict = (p.district ?? "").trim().toLowerCase() === district;
          return sameDistrict && area.length > 0 && (p.address ?? "").toLowerCase().includes(area);
        }).length;
        return { ...a, count };
      });
      return counted.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    }
  }
  return [];
}

export async function getProjects(): Promise<Project[]> {
  if (supabase) {
    const { data, error } = await supabase.from("projects").select("*").order("name");
    if (!error && data && data.length) return data as Project[];
  }
  return [];
}

export async function getQdaSchemes(): Promise<QdaScheme[]> {
  if (supabase) {
    const { data, error } = await supabase.from("qda_schemes").select("*").order("name");
    if (!error && data && data.length) return data as QdaScheme[];
  }
  return [];
}

export async function getVerificationHistory(): Promise<VerificationHistory[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("verification_history")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data && data.length) return data as VerificationHistory[];
  }
  return [];
}

export async function getSchemes(): Promise<Scheme[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("schemes")
      .select("*")
      .eq("status", "Active")
      .order("id", { ascending: false });
    if (!error && data && data.length) return data as Scheme[];
  }
  return [];
}

export async function getSchemeById(id: number): Promise<Scheme | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("schemes")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) return data as Scheme;
  }
  return null;
}
