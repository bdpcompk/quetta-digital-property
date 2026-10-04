import { Suspense } from "react";
import SchemeDetail from "@/components/site/SchemeDetail";

export const metadata = { title: "Scheme Details" };

export default function SchemePage() {
  return (
    <Suspense>
      <SchemeDetail />
    </Suspense>
  );
}
