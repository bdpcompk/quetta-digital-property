import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using bdp.com.pk — Balochistan's property portal.",
};

export default function TermsPage() {
  return (
    <>
      <PageBanner
        title="Terms of Service"
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
      >
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
          Last updated: October 2026
        </p>
      </PageBanner>

      <section className="section">
        <div className="wrap max-w-3xl">
          <div className="space-y-8 text-[14.5px] leading-relaxed text-ink">
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">1. Acceptance of Terms</h2>
              <p className="text-muted">
                By accessing or using bdp.com.pk (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Platform.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">2. Use of the Platform</h2>
              <p className="text-muted">
                bdp.com.pk is a property listing platform for Balochistan, Pakistan. You may browse listings, post properties, contact agents, and use our tools. You agree to use the Platform only for lawful purposes and in a manner that does not infringe the rights of others.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">3. User Accounts</h2>
              <p className="text-muted">
                When you create an account, you are responsible for maintaining the confidentiality of your credentials. You agree to provide accurate information and to update it as necessary. We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">4. Property Listings</h2>
              <p className="text-muted">
                Users who post properties are responsible for the accuracy of their listings. bdp.com.pk does not verify every listing and is not a party to any transaction between users. We reserve the right to remove any listing that is fraudulent, misleading, or violates our policies.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">5. No Warranty</h2>
              <p className="text-muted">
                The Platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy of listings, the availability of properties, or the legitimacy of users. Always conduct your own due diligence before entering into any property transaction.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">6. Limitation of Liability</h2>
              <p className="text-muted">
                bdp.com.pk shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Platform or reliance on any information provided herein.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">7. Changes to Terms</h2>
              <p className="text-muted">
                We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the new terms.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">8. Contact</h2>
              <p className="text-muted">
                For questions about these Terms, contact us at <a href="mailto:bdpcompk@gmail.com" className="font-semibold text-green hover:underline">bdpcompk@gmail.com</a> or call <a href="tel:+923047974497" className="font-semibold text-green hover:underline">0304 7974497</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
