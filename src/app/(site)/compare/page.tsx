"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bath, BedDouble, MapPin, Ruler, Scale, X } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { getProperties } from "@/lib/data";
import { formatArea } from "@/lib/area";
import type { Property } from "@/lib/types";

function CompareInner() {
  const params = useSearchParams();
  const ids = (params.get("ids") || "").split(",").map(Number).filter(Boolean);
  const [props, setProps] = useState<Property[]>([]);

  useEffect(() => {
    let cancelled = false;
    getProperties().then((all) => {
      if (!cancelled) setProps(all.filter((p) => ids.includes(p.id)));
    });
    return () => { cancelled = true; };
  }, [ids]);

  const rows: { label: string; render: (p: Property) => React.ReactNode }[] = [
    { label: "Price", render: (p) => <span className="text-[16px] font-extrabold text-navy">{p.priceText}</span> },
    { label: "Purpose", render: (p) => <span className="rounded-full bg-surface px-2.5 py-1 text-[12px] font-semibold text-ink">{p.purpose}</span> },
    { label: "Type", render: (p) => p.type },
    { label: "Bedrooms", render: (p) => (p.beds > 0 ? `${p.beds}` : "—") },
    { label: "Bathrooms", render: (p) => (p.baths > 0 ? `${p.baths}` : "—") },
    { label: "Area", render: (p) => formatArea(p.area) },
    { label: "District", render: (p) => p.district },
    { label: "Address", render: (p) => <span className="line-clamp-2">{p.address}</span> },
    { label: "Agent", render: (p) => p.agent },
    { label: "Verified", render: (p) => (p.verified ? "✓ Yes" : "No") },
  ];

  return (
    <>
      <PageBanner
        title="Compare Properties"
        crumbs={[{ label: "Home", href: "/" }, { label: "Compare" }]}
      >
        <p className="mt-3 text-[14.5px] text-white/70">
          Side-by-side comparison of {props.length} propert{props.length === 1 ? "y" : "ies"}.
        </p>
      </PageBanner>

      <section className="section">
        <div className="wrap">
          {props.length < 2 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center">
              <Scale size={36} className="mx-auto text-line" />
              <h3 className="mt-3 text-[17px] font-bold text-navy">Not enough properties to compare</h3>
              <p className="mt-1 text-[13.5px] text-muted">Select at least 2 properties from the listings page.</p>
              <Link href="/listings/" className="btn-primary mt-5">Browse Properties</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr>
                    <th className="w-[140px] border-b border-line p-3 text-left text-[13px] font-semibold text-muted">Feature</th>
                    {props.map((p) => (
                      <th key={p.id} className="border-b border-line p-3 text-left">
                        <Link href={`/property/?id=${p.id}`} className="group block">
                          <img src={p.img} alt={p.title} className="h-28 w-full rounded-xl object-cover" />
                          <p className="mt-2 line-clamp-1 text-[13.5px] font-semibold text-ink group-hover:text-green">{p.title}</p>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-b border-line">
                      <td className="p-3 text-[13px] font-semibold text-muted">{row.label}</td>
                      {props.map((p) => (
                        <td key={p.id} className="p-3 text-[13.5px] text-ink">
                          {row.render(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-3" />
                    {props.map((p) => (
                      <td key={p.id} className="p-3">
                        <Link href={`/property/?id=${p.id}`} className="btn-primary inline-flex px-3 py-1.5 text-[12.5px]">
                          View Details
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareInner />
    </Suspense>
  );
}
