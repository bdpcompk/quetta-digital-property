import { Suspense } from "react";
import PageBanner from "@/components/ui/PageBanner";
import SchemeList from "@/components/site/SchemeList";

export const metadata = { title: "Property Schemes" };

export default function SchemesPage() {
  return (
    <>
      <PageBanner
        title="Property Schemes"
        crumbs={[{ label: "Home", href: "/" }, { label: "Property Schemes" }]}
      />
      <Suspense>
        <SchemeList />
      </Suspense>
    </>
  );
}
