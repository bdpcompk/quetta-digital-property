import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Balochistan Property Portal | Buy, Rent & Sell Properties",
    template: "%s | Balochistan Property Portal",
  },
  description:
    "Pakistan's most trusted property portal for buying, renting and selling properties across all districts of Balochistan.",
  metadataBase: new URL("https://bdpcompk.github.io"),
  openGraph: {
    title: "Balochistan Property Portal",
    description: "Buy, rent and sell properties across all districts of Balochistan.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
        width: 1200,
        height: 630,
        alt: "Balochistan Property Portal",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
