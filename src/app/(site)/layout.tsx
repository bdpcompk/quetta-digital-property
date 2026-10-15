import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/layout/Analytics";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import { CompareProvider } from "@/components/properties/CompareProvider";
import { RealtimeProvider } from "@/components/realtime/RealtimeProvider";
import FloatingWhatsApp from "@/components/realtime/FloatingWhatsApp";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <RealtimeProvider>
        <CompareProvider>
          <Analytics />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </CompareProvider>
      </RealtimeProvider>
    </LanguageProvider>
  );
}
