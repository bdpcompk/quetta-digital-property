/**
 * Public origin of the site. Set NEXT_PUBLIC_SITE_URL at build time when the
 * domain changes (Cloudflare Pages preview, bdp.com.pk, etc.).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://quetta-digital-property.pages.dev"
).replace(/\/+$/, "");
