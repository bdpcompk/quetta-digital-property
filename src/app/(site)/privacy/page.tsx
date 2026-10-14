import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How bdp.com.pk collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageBanner
        title="Privacy Policy"
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      >
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
          Last updated: October 2026
        </p>
      </PageBanner>

      <section className="section">
        <div className="wrap max-w-3xl">
          <div className="space-y-8 text-[14.5px] leading-relaxed text-ink">
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">1. Information We Collect</h2>
              <p className="text-muted">
                When you create an account, we collect your email address and name. When you post a property, we collect listing details including title, price, location, and photos. When you contact an agent, we share your inquiry with them.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">2. How We Use Your Information</h2>
              <p className="text-muted">
                We use your information to provide and improve the Platform, display your listings to other users, facilitate communication between buyers and sellers, and send you service-related notifications.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">3. Data Sharing</h2>
              <p className="text-muted">
                We do not sell your personal information. Listing details (title, price, location, photos, phone number) are publicly visible. Your email address is never shared publicly. We may share data with service providers who help us operate the Platform.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">4. Data Storage</h2>
              <p className="text-muted">
                Your data is stored on secure servers provided by Supabase. We implement industry-standard security measures including encryption in transit and at rest.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">5. Cookies</h2>
              <p className="text-muted">
                We use essential cookies for authentication and session management. We may use analytics cookies to understand how users interact with the Platform.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">6. Your Rights</h2>
              <p className="text-muted">
                You may update your account information at any time through My Account. You may delete your listings. To delete your account entirely, contact us at bdpcompk@gmail.com.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">7. Children&apos;s Privacy</h2>
              <p className="text-muted">
                The Platform is not intended for children under 18. We do not knowingly collect information from children.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">8. Changes to This Policy</h2>
              <p className="text-muted">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-[18px] font-extrabold text-navy">9. Contact</h2>
              <p className="text-muted">
                For privacy-related questions, contact us at <a href="mailto:bdpcompk@gmail.com" className="font-semibold text-green hover:underline">bdpcompk@gmail.com</a> or call <a href="tel:+923047974497" className="font-semibold text-green hover:underline">0304 7974497</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
