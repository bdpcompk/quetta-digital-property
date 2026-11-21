import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/siteUrl";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Balochistan Property Portal | Buy, Rent & Sell Properties",
    template: "%s | Balochistan Property Portal",
  },
  description:
    "Pakistan's most trusted property portal for buying, renting and selling properties across all districts of Balochistan.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Balochistan Property Portal",
    description: "Buy, rent and sell properties across all districts of Balochistan.",
    type: "website",
    siteName: "bdp.com.pk",
    images: [
      {
        url: "/og-image.png?v=2",
        width: 1200,
        height: 630,
        alt: "bdp.com.pk - Balochistan's Trusted Property Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Balochistan Property Portal",
    description: "Buy, rent and sell properties across all districts of Balochistan.",
    images: ["/og-image.png?v=2"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
