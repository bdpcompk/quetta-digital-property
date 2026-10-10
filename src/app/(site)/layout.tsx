import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TranslateScript from "@/components/layout/TranslateScript";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TranslateScript />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
