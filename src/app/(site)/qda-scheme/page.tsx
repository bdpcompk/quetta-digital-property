import { Suspense } from "react";
import QdaSchemeDetail from "@/components/site/QdaSchemeDetail";

export const metadata = { title: "Scheme Details" };

export default function QdaSchemePage() {
  return (
    <Suspense>
      <QdaSchemeDetail />
    </Suspense>
  );
}
