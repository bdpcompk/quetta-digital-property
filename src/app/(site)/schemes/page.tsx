import { Suspense } from "react";
import SchemesBanner from "@/components/site/SchemesBanner";
import SchemeList from "@/components/site/SchemeList";

export const metadata = { title: "Property Schemes" };

export default function SchemesPage() {
  return (
    <>
      <SchemesBanner />
      <Suspense>
        <SchemeList />
      </Suspense>
    </>
  );
}
