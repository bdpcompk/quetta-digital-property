import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TranslateScript from "@/components/layout/TranslateScript";
import Analytics from "@/components/layout/Analytics";
import { CompareProvider } from "@/components/properties/CompareProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      <Analytics />
      <TranslateScript />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CompareProvider>
  );
}
