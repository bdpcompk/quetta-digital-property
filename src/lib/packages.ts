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
    id: "free",
    name: "Free Plan",
    price: 0,
    period: "7 Days",
    desc: "Bilkul free — shuru karne ke liye perfect.",
    features: ["Basic listing visibility", "Standard search results", "1 property listing", "Up to 5 images", "Basic support"],
    popular: false,
    enabled: true,
  },
  {
    id: "basic",
    name: "Basic Plan",
    price: 499,
    period: "7 Days",
    desc: "Sab se zyada log yahi choose karte hain — aap ki listing upar dikhe.",
    features: ["Featured ad badge", "Higher visibility", "Up to 3 property listings", "Up to 10 images", "Priority support"],
    popular: false,
    enabled: true,
  },
  {
    id: "standard",
    name: "Standard Plan",
    price: 999,
    period: "15 Days",
    desc: "More exposure. More inquiries. Faster results.",
    features: ["Featured ad badge", "Homepage section display", "Up to 10 property listings", "Up to 20 images", "Better visibility & ranking", "Priority support"],
    popular: true,
    enabled: true,
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 2000,
    period: "30 Days",
    desc: "The best choice for maximum results.",
    features: ["Premium featured ad badge", "Top homepage placement", "Up to 25 property listings", "Up to 50 images", "Maximum visibility", "Dedicated support"],
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