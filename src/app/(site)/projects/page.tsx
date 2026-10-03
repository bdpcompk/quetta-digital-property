import Link from "next/link";
import { CalendarDays, MapPin, Home as HomeIcon } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal, { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { PROJECTS } from "@/lib/data";

export const metadata = { title: "New Projects" };

const STATUS_STYLE: Record<string, string> = {
  Completed: "bg-green",
  "Launching Soon": "bg-amber-400 text-navy",
  "Under Development": "bg-navy",
};

export default function ProjectsPage() {
  return (
    <>
      <PageBanner
        title="New Projects in Balochistan"
        crumbs={[{ label: "Home", href: "/" }, { label: "New Projects" }]}
      />
      <section className="section">
        <div className="wrap">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <StaggerItem key={p.name}>
                <article className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={p.img} alt={p.name} loading="lazy" className="img-zoom h-full w-full object-cover" />
                    <span
                      className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10.5px] font-bold text-white ${
                        STATUS_STYLE[p.status] ?? "bg-navy"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[17px] font-bold text-navy">{p.name}</h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted">
                      <MapPin size={14} className="text-green" /> {p.location}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-muted">
                      <span className="flex items-center gap-1.5"><HomeIcon size={13} className="text-green" /> {p.plotSizes}</span>
                      <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-green" /> {p.timeline}</span>
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
                      <div>
                        <p className="text-[11px] text-muted">Starting From</p>
                        <p className="whitespace-nowrap text-[17px] font-extrabold text-green">{p.priceFrom}</p>
                      </div>
                      <Link href="/contact/" className="btn-ghost whitespace-nowrap">
                        Get Details →
                      </Link>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
