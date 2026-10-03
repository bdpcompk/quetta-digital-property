import PageBanner from "@/components/ui/PageBanner";
import AddSchemeForm from "@/components/site/AddSchemeForm";

export const metadata = { title: "Add Scheme" };

export default function AddSchemePage() {
  return (
    <>
      <PageBanner
        title="Add Your Scheme"
        crumbs={[{ label: "Home", href: "/" }, { label: "Property Schemes", href: "/schemes/" }, { label: "Add Scheme" }]}
      />
      <section className="section">
        <div className="wrap max-w-3xl">
          <AddSchemeForm />
        </div>
      </section>
    </>
  );
}
