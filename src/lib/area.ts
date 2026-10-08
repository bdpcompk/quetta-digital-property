export const MARLA_SQFT = 272.25;
export const KANAL_SQFT = MARLA_SQFT * 20;
export const ACRE_SQFT = 43560;

const comma = (n: number) => n.toLocaleString("en-US");

const trimNum = (n: number) => {
  const r = Math.round(n * 100) / 100;
  return comma(r);
};

export function areaToSqFt(text: string): number | null {
  if (!text) return null;
  const t = String(text).toLowerCase().replace(/,/g, "");
  const num = parseFloat(t);
  if (isNaN(num)) return null;
  if (t.includes("acre")) return num * ACRE_SQFT;
  if (t.includes("kanal")) return num * KANAL_SQFT;
  if (t.includes("marla")) return num * MARLA_SQFT;
  if (t.includes("sq") || t.includes("feet") || t.includes("ft")) return num;
  return null;
}

export function formatArea(text?: string | null): string {
  if (!text) return "";
  const raw = String(text).trim();
  const lower = raw.toLowerCase();

  if (lower.includes("acre")) {
    const num = parseFloat(lower.replace(/,/g, ""));
    if (!isNaN(num)) return `${trimNum(num)} Acre`;
    return raw;
  }

  const sqft = areaToSqFt(raw);
  if (sqft === null) return raw;

  if (sqft >= ACRE_SQFT) return `${trimNum(sqft / ACRE_SQFT)} Acre`;
  return `${comma(Math.round(sqft))} sq ft`;
}

export function formatPlotSizes(text?: string | null): string {
  if (!text) return "";
  const raw = String(text).trim();

  const shared = raw.match(/^([\d.,\s]+?)\s*(marla|kanal|acre)s?$/i);
  if (shared) {
    const nums = shared[1].split(",").map((s) => s.trim()).filter(Boolean);
    if (nums.length > 1) {
      const parts = nums.map((n) => formatArea(`${n} ${shared[2]}`));
      const unit = parts.every((p) => p.endsWith(" sq ft")) ? " sq ft" : "";
      return parts.map((p) => p.replace(/ sq ft$/, "")).join(" / ") + unit;
    }
  }

  return raw
    .split(/,\s+/)
    .map((seg) => formatArea(seg))
    .join(", ");
}
