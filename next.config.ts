import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // GitHub Pages project site is served under /quetta-digital-property/.
  // CI sets NEXT_PUBLIC_BASE_PATH; local builds serve from the root.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
