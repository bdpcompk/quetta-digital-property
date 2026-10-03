import PageBanner from "@/components/ui/PageBanner";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import ArticleCard from "@/components/properties/ArticleCard";
import { ARTICLES } from "@/lib/data";

export const metadata = { title: "Property Guides & Articles" };

export default function GuidesPage() {
  const all = [...ARTICLES, ...ARTICLES, ...ARTICLES.slice(0, 4)];
  return (
    <>
      <PageBanner
        title="Property Guides & Latest Articles"
        crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }]}
      />
      <section className="section">
        <div className="wrap">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {all.map((a, i) => (
              <StaggerItem key={`${a.id}-${i}`}>
                <ArticleCard a={a} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
