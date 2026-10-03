"use client";

import { useState } from "react";
import { BadgeCheck, CloudUpload, Eye, Rocket, Send } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal from "@/components/ui/Reveal";
import { DISTRICTS } from "@/lib/data";

const TYPES = ["Houses", "Plots", "Flats / Apartments", "Commercial", "Agricultural Land", "Shops / Offices", "Farm Houses"];

export default function SellPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageBanner
        title="Post Your Property"
        crumbs={[{ label: "Home", href: "/" }, { label: "Sell / Post Property" }]}
      />
      <section className="section">
        <div className="wrap grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="space-y-4">
              {[
                { Icon: Rocket, t: "Free to Post", s: "List your property free of cost, no hidden charges." },
                { Icon: Eye, t: "Max Exposure", s: "Your listing reaches thousands of buyers in Balochistan." },
                { Icon: BadgeCheck, t: "Quick Verification", s: "Our team verifies your listing within 24 hours." },
              ].map(({ Icon, t, s }) => (
                <div key={t} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-navy">{t}</h4>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{s}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl bg-gradient-to-br from-green to-[#0f6b3f] p-6 text-white">
                <h3 className="text-[17px] font-extrabold">Premium Listing Plans</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/85">
                  Boost your property with Featured Ads — appear at the top of search results with a
                  highlight badge.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              className="rounded-2xl border border-line bg-white p-6 sm:p-7"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <h3 className="mb-5 text-[18px] font-bold text-navy">Property Details</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Purpose</label>
                  <select className="field"><option>For Sale</option><option>For Rent</option></select>
                </div>
                <div>
                  <label className="field-label">Property Type</label>
                  <select className="field">{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
                </div>
                <div>
                  <label className="field-label">District</label>
                  <select className="field">
                    <option>Select District</option>
                    {DISTRICTS.map((d) => <option key={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Full Address / Area</label>
                  <input required className="field" placeholder="e.g. Jinnah Town, Quetta" />
                </div>
                <div>
                  <label className="field-label">Price (PKR)</label>
                  <input required className="field" type="number" placeholder="e.g. 8500000" />
                </div>
                <div>
                  <label className="field-label">Area Size</label>
                  <input required className="field" placeholder="e.g. 1 Kanal" />
                </div>
                <div>
                  <label className="field-label">Bedrooms</label>
                  <input className="field" type="number" placeholder="e.g. 4" />
                </div>
                <div>
                  <label className="field-label">Bathrooms</label>
                  <input className="field" type="number" placeholder="e.g. 3" />
                </div>
              </div>

              <div className="mt-4">
                <label className="field-label">Description</label>
                <textarea rows={4} className="field resize-y" placeholder="Describe your property..." />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Your Name</label>
                  <input required className="field" placeholder="Full Name" />
                </div>
                <div>
                  <label className="field-label">Phone</label>
                  <input required className="field" type="tel" placeholder="+92 300 0000000" />
                </div>
              </div>

              <div className="mt-4">
                <label className="field-label">Upload Photos (optional)</label>
                <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-line px-4 py-7 text-center transition-all hover:border-green hover:bg-green-soft/40">
                  <CloudUpload size={30} className="text-muted" />
                  <span className="mt-2 text-[13px] text-muted">
                    Drag & drop photos or <span className="font-semibold text-green">click to browse</span>
                  </span>
                  <input type="file" accept="image/*" multiple className="hidden" />
                </label>
              </div>

              <button type="submit" className="btn-primary mt-5 w-full">
                <Send size={15} /> {sent ? "Listing Submitted ✓" : "Submit Listing"}
              </button>
              {sent && (
                <p className="mt-3 text-center text-[13px] text-green">
                  Your property listing has been submitted for verification!
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
