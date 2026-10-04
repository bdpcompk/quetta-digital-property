import Hero from "@/components/home/Hero";
import { TypeGrid, DistrictRail } from "@/components/home/HomeSections";
import { FeaturedSection, AgentsSection, GuidesSection } from "@/components/home/FeaturedSections";
import FeaturedSchemes from "@/components/home/FeaturedSchemes";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TypeGrid />
      <DistrictRail />
      <FeaturedSection />
      <FeaturedSchemes />
      <AgentsSection />
      <GuidesSection />
    </>
  );
}
