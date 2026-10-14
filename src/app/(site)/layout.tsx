import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/layout/Analytics";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import { CompareProvider } from "@/components/properties/CompareProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CompareProvider>
        <Analytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </CompareProvider>
    </LanguageProvider>
  );
}
