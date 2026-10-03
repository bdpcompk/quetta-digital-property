"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import PropertyCard from "@/components/properties/PropertyCard";
import Reveal from "@/components/ui/Reveal";
import { DISTRICTS, PROPERTIES, getProperties } from "@/lib/data";
import type { Property } from "@/lib/types";

const TYPES = ["Houses", "Plots", "Flats / Apartments", "Commercial", "Agricultural Land", "Shops / Offices", "Farm Houses"];
const AMENITIES = ["Parking", "Garden", "Security", "Water Tank", "Boundary Wall"];

function ListingsClient() {
  const params = useSearchParams();
  const [items, setItems] = useState<Property[]>(PROPERTIES);
  const [districtSel, setDistrictSel] = useState<string | null>(null);
  const [typeSel, setTypeSel] = useState<string | null>(null);
  const [purposeSel, setPurposeSel] = useState<string | null>(null);
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [beds, setBeds] = useState("");
  const [amens, setAmens] = useState<string[]>([]);
  const [sort, setSort] = useState("new");
  const [showFilters, setShowFilters] = useState(false);

  const district = districtSel ?? params.get("district") ?? "";
  const type = typeSel ?? params.get("type") ?? "";
  const purpose = purposeSel ?? (params.get("purpose") === "rent" ? "For Rent" : "");

  useEffect(() => {
    getProperties().then(setItems);
  }, []);

  const results = useMemo(() => {
    let list = [...items];
    if (district) list = list.filter((p) => p.district === district);
    if (type) list = list.filter((p) => p.type === type);
    if (purpose) list = list.filter((p) => p.purpose === purpose);
    if (minP) list = list.filter((p) => p.price >= Number(minP));
    if (maxP) list = list.filter((p) => p.price <= Number(maxP));
    if (beds) {
      const b = Number(beds);
      list = list.filter((p) => (b === 5 ? p.beds >= 5 : p.beds === b));
    }
    if (amens.length)
      list = list.filter((p) => amens.some((a) => p.features.some((f) => f.toLowerCase().includes(a.toLowerCase()))));

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "area-desc")
      list.sort((a, b) => parseFloat(b.area.replace(/,/g, "")) - parseFloat(a.area.replace(/,/g, "")));
    return list;
  }, [items, district, type, purpose, minP, maxP, beds, amens, sort]);

  const clearAll = () => {
    setDistrictSel(""); setTypeSel(""); setPurposeSel(""); setMinP(""); setMaxP("");
    setBeds(""); setAmens([]); setSort("new");
  };

  const filterPanel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[15px] font-bold text-navy">
          <SlidersHorizontal size={16} className="text-green" /> Filters
        </h3>
        <button onClick={clearAll} className="flex items-center gap-1 text-[12px] font-medium text-green hover:underline">
          <RotateCcw size={12} /> Clear All
        </button>
      </div>

      <div>
        <label className="field-label">District</label>
        <select className="field" value={district} onChange={(e) => setDistrictSel(e.target.value)}>
          <option value="">All Districts</option>
          {DISTRICTS.map((d) => <option key={d.name}>{d.name}</option>)}
        </select>
      </div>

      <div>
        <label className="field-label">Property Type</label>
        <select className="field" value={type} onChange={(e) => setTypeSel(e.target.value)}>
          <option value="">All Types</option>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="field-label">Purpose</label>
        <select className="field" value={purpose} onChange={(e) => setPurposeSel(e.target.value)}>
          <option value="">Buy & Rent</option>
          <option>For Sale</option>
          <option>For Rent</option>
        </select>
      </div>

      <div>
        <label className="field-label">Price Range (PKR)</label>
        <div className="grid grid-cols-2 gap-2.5">
          <input className="field" type="number" placeholder="Min" value={minP} onChange={(e) => setMinP(e.target.value)} />
          <input className="field" type="number" placeholder="Max" value={maxP} onChange={(e) => setMaxP(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="field-label">Bedrooms</label>
        <div className="flex flex-wrap gap-1.5">
          {[["", "Any"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5+"]].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setBeds(v)}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition-all ${
                beds === v ? "bg-green text-white" : "border border-line bg-white text-muted hover:border-green hover:text-green"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="field-label">Amenities</label>
        <div className="space-y-2">
          {AMENITIES.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink">
              <input
                type="checkbox"
                checked={amens.includes(a)}
                onChange={() =>
                  setAmens(amens.includes(a) ? amens.filter((x) => x !== a) : [...amens, a])
                }
                className="h-4 w-4 accent-green"
              />
              {a}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageBanner
        title={purpose === "For Rent" ? "Properties for Rent" : "Properties for Sale"}
        crumbs={[{ label: "Home", href: "/" }, { label: "Properties" }]}
      />

      <section className="section">
        <div className="wrap grid items-start gap-6 lg:grid-cols-[280px_1fr]">
          {/* desktop sidebar */}
          <aside className="sticky top-24 hidden rounded-2xl border border-line bg-white p-5 lg:block">
            {filterPanel}
          </aside>

          {/* mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-ghost flex items-center justify-center gap-2 lg:hidden"
          >
            <SlidersHorizontal size={15} /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          {showFilters && (
            <div className="rounded-2xl border border-line bg-white p-5 lg:hidden">{filterPanel}</div>
          )}

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-5 py-3.5">
              <p className="text-[13.5px] text-muted">
                Showing <b className="text-ink">{results.length} properties</b>{" "}
                {district ? `in ${district}` : "in Balochistan"}
              </p>
              <select
                className="field w-auto py-1.5"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="new">Sort: Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area-desc">Area: Large to Small</option>
              </select>
            </div>

            <Reveal>
              {results.length ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((p, i) => <PropertyCard key={p.id} p={p} index={i} />)}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center">
                  <Search size={42} className="mx-auto text-line" />
                  <h3 className="mt-4 text-[16px] font-bold text-navy">No properties found</h3>
                  <p className="mt-1 text-[13px] text-muted">Try adjusting your filters</p>
                  <button onClick={clearAll} className="btn-primary mt-5">Clear Filters</button>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsClient />
    </Suspense>
  );
}
