import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-static";

const PAGES: Array<[string, number]> = [
  ["/", 1],
  ["/listings/", 0.9],
  ["/sell/", 0.8],
  ["/schemes/", 0.8],
  ["/projects/", 0.7],
  ["/agents/", 0.7],
  ["/guides/", 0.6],
  ["/packages/", 0.6],
  ["/about/", 0.5],
  ["/contact/", 0.5],
  ["/areas/", 0.6],
  ["/tools/", 0.6],
  ["/tools/home-loan-calculator/", 0.5],
  ["/tools/area-unit-converter/", 0.5],
  ["/tools/construction-cost-calculator/", 0.5],
  ["/tools/trends-and-index/", 0.5],
  ["/tools/land-records/", 0.5],
  ["/terms/", 0.3],
  ["/privacy/", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority,
  }));
}
