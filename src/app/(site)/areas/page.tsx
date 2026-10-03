import PageBanner from "@/components/ui/PageBanner";
import AreasSections from "@/components/site/AreasSections";

export const metadata = { title: "Areas & Districts" };

export default function AreasPage() {
  return (
    <>
      <PageBanner
        title="Explore Areas in Balochistan"
        crumbs={[{ label: "Home", href: "/" }, { label: "Areas & Districts" }]}
      />
      <AreasSections />
    </>
  );
}
