import PageBanner from "@/components/ui/PageBanner";
import PlansCheckout from "@/components/site/PlansCheckout";

export const metadata = { title: "Packages & Pricing" };

export default function PackagesPage() {
  return (
    <>
      <PageBanner
        title="Packages & Pricing"
        crumbs={[{ label: "Home", href: "/" }, { label: "Packages" }]}
      >
        <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-white/80">
          Aasan 3 plans, saaf-suthra payment — koi hidden charges nahi. Jo plan aap ka kaam
          poori kare, wahi chunein! 😊
        </p>
      </PageBanner>
      <section className="section">
        <div className="wrap max-w-4xl">
          <PlansCheckout />
        </div>
      </section>
    </>
  );
}
