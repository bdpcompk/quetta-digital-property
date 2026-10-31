export type PackagePlan = {
  id: string;
  name: string;
  price: number;
  period: string;
  desc: string;
  features: string[];
  popular?: boolean;
  enabled?: boolean;
};

export const DEFAULT_PLANS: PackagePlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    period: "hamesha ke liye free",
    desc: "Bilkul free — shuru karne ke liye perfect.",
    features: ["5 properties post karein", "Basic analytics", "Community support", "Normal placement"],
    popular: false,
    enabled: true,
  },
  {
    id: "featured",
    name: "Featured",
    price: 2999,
    period: "har mahine",
    desc: "Sab se zyada log yahi choose karte hain — aap ki listing upar dikhe.",
    features: ["25 properties post karein", "Featured badge (alag pehchan)", "Homepage carousel mein", "Priority support", "Advanced analytics"],
    popular: true,
    enabled: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 7999,
    period: "har mahine",
    desc: "Agencies ke liye — maximum exposure, full power.",
    features: ["Unlimited listings", "Search mein sab se upar", "Verified agent badge", "Dedicated account manager", "Video listings", "Full analytics suite"],
    popular: false,
    enabled: true,
  },
];

export const PACKAGES_CONFIG_KEY = "packages_config";

export function parsePlans(raw: string | null): PackagePlan[] {
  if (!raw) return DEFAULT_PLANS.map((p) => ({ ...p, features: [...p.features] }));
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PLANS.map((p) => ({ ...p, features: [...p.features] }));
    // Merge with defaults so new fields/ids are never lost.
    const byId = new Map(DEFAULT_PLANS.map((p) => [p.id, p]));
    return parsed.map((p) => {
      const base = byId.get(p.id) ?? {};
      return {
        ...base,
        ...p,
        features: Array.isArray(p.features) ? p.features : (base as PackagePlan).features ?? [],
        enabled: p.enabled !== false,
      } as PackagePlan;
    });
  } catch {
    return DEFAULT_PLANS.map((p) => ({ ...p, features: [...p.features] }));
  }
}