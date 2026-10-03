import PageBanner from "@/components/ui/PageBanner";
import GuidesGrid from "@/components/site/GuidesGrid";

export const metadata = { title: "Property Guides & Articles" };

export default function GuidesPage() {
  return (
    <>
      <PageBanner
        title="Property Guides & Latest Articles"
        crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }]}
      />
      <section className="section">
        <div className="wrap">
          <GuidesGrid />
        </div>
      </section>
    </>
  );
}
