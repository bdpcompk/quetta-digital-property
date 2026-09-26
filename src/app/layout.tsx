import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Balochistan Property Portal | Buy, Rent & Sell Properties",
    template: "%s | Balochistan Property Portal",
  },
  description:
    "Pakistan's most trusted property portal for buying, renting and selling properties across all districts of Balochistan.",
  metadataBase: new URL("https://stellarsagency.github.io"),
  openGraph: {
    title: "Balochistan Property Portal",
    description: "Buy, rent and sell properties across all districts of Balochistan.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
