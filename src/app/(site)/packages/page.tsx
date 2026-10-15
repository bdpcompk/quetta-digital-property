import PageBanner from "@/components/ui/PageBanner";
import PlansCheckout from "@/components/site/PlansCheckout";

export const metadata = { title: "Packages & Pricing" };

export default function PackagesPage() {
  return (
    <>
      <PageBanner
        title="Packages & Pricing"
        crumbs={[{ label: "Home", href: "/" }, { label: "Packages" }]}
      />
      <section className="section">
        <div className="wrap max-w-4xl">
          <PlansCheckout />
        </div>
      </section>
    </>
  );
}
