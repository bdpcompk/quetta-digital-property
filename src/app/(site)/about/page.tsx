import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import { Building2, MapPin, Phone, Mail, Shield, Users, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "bdp.com.pk — Balochistan's trusted property marketplace. Buy, rent, and sell property across Quetta, Gwadar, and all districts.",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="About bdp.com.pk"
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      >
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
          Balochistan&apos;s trusted property marketplace — connecting buyers, sellers, and agents across the province.
        </p>
      </PageBanner>

      <section className="section">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6 text-[14.5px] leading-relaxed text-muted">
              <h2 className="text-[22px] font-extrabold text-navy">Who We Are</h2>
              <p>
                bdp.com.pk (Balochistan Digital Property) is the first dedicated property portal for Balochistan, Pakistan. We make it easy to buy, sell, and rent property across Quetta, Gwadar, Turbat, and every district of the province.
              </p>
              <p>
                Founded in 2026, our mission is to bring transparency and accessibility to Balochistan&apos;s real estate market. Whether you&apos;re looking for a house in Jinnah Town, a plot in Gwadar, or commercial space in Quetta — we connect you directly with verified agents and owners.
              </p>
              <p>
                We also provide QDA, BDA, GDA, and BHTPA scheme verification data, so you can invest with confidence in approved housing schemes.
              </p>

              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-white p-5 text-center">
                  <Home size={24} className="mx-auto text-green" />
                  <p className="mt-2 text-[20px] font-extrabold text-navy">500+</p>
                  <p className="text-[12.5px] text-muted">Properties Listed</p>
                </div>
                <div className="rounded-2xl border border-line bg-white p-5 text-center">
                  <Users size={24} className="mx-auto text-green" />
                  <p className="mt-2 text-[20px] font-extrabold text-navy">100+</p>
                  <p className="text-[12.5px] text-muted">Verified Agents</p>
                </div>
                <div className="rounded-2xl border border-line bg-white p-5 text-center">
                  <Building2 size={24} className="mx-auto text-green" />
                  <p className="mt-2 text-[20px] font-extrabold text-navy">30+</p>
                  <p className="text-[12.5px] text-muted">Housing Schemes</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-line bg-white p-6">
                <h3 className="mb-4 text-[16px] font-extrabold text-navy">Why Choose Us</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Shield size={20} className="mt-0.5 shrink-0 text-green" />
                    <div>
                      <p className="text-[14px] font-semibold text-ink">Verified Listings</p>
                      <p className="text-[13px] text-muted">Every agent is verified. Scheme data sourced from QDA, BDA, GDA, and BHTPA.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin size={20} className="mt-0.5 shrink-0 text-green" />
                    <div>
                      <p className="text-[14px] font-semibold text-ink">Complete Coverage</p>
                      <p className="text-[13px] text-muted">From Quetta to Gwadar — all 36 districts of Balochistan covered.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Building2 size={20} className="mt-0.5 shrink-0 text-green" />
                    <div>
                      <p className="text-[14px] font-semibold text-ink">Free to Use</p>
                      <p className="text-[13px] text-muted">Browse, search, and contact agents completely free. Post your property at no cost.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6">
                <h3 className="mb-4 text-[16px] font-extrabold text-navy">Contact Us</h3>
                <div className="space-y-3 text-[14px]">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="shrink-0 text-green" />
                    <span className="text-muted">Jinnah Town, Quetta, Balochistan, Pakistan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="shrink-0 text-green" />
                    <a href="tel:+923047974497" className="font-semibold text-ink hover:text-green">0304 7974497</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="shrink-0 text-green" />
                    <a href="mailto:bdpcompk@gmail.com" className="font-semibold text-ink hover:text-green">bdpcompk@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
