import PageBanner from "@/components/ui/PageBanner";
import ToolsHub from "@/components/tools/ToolsHub";

export const metadata = { title: "Property Tools & Calculators" };

export default function ToolsPage() {
  return (
    <>
      <PageBanner
        title="Property Tools & Calculators"
        crumbs={[{ label: "Home", href: "/" }, { label: "Tools" }]}
      >
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
          Free tools to help you plan your property purchase, conversion and
          construction — built for the Balochistan market.
        </p>
      </PageBanner>
      <section className="section">
        <div className="wrap">
          <ToolsHub />
        </div>
      </section>
    </>
  );
}
