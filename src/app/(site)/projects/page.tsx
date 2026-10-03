import PageBanner from "@/components/ui/PageBanner";
import ProjectsGrid from "@/components/site/ProjectsGrid";

export const metadata = { title: "New Projects" };

export default function ProjectsPage() {
  return (
    <>
      <PageBanner
        title="New Projects in Balochistan"
        crumbs={[{ label: "Home", href: "/" }, { label: "New Projects" }]}
      />
      <section className="section">
        <div className="wrap">
          <ProjectsGrid />
        </div>
      </section>
    </>
  );
}
