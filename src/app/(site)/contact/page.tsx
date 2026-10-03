"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal from "@/components/ui/Reveal";

const INFO = [
  { Icon: MapPin, t: "Office Address", s: "Zarghoon Road, Quetta, Balochistan, Pakistan" },
  { Icon: Phone, t: "Phone", s: "+92 81 1234567  •  +92 300 1234567" },
  { Icon: Mail, t: "Email", s: "info@balochistanproperty.pk" },
  { Icon: Clock, t: "Working Hours", s: "Mon – Sat: 9:00 AM – 6:00 PM" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageBanner
        title="Get in Touch"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="section">
        <div className="wrap grid items-start gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="space-y-4">
              {INFO.map(({ Icon, t, s }) => (
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
              <h3 className="mb-5 text-[18px] font-bold text-navy">Send Us a Message</h3>

              <div className="grid gap-4 sm:grid-cols-2">
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
                <label className="field-label">Email</label>
                <input className="field" type="email" placeholder="you@example.com" />
              </div>

              <div className="mt-4">
                <label className="field-label">Subject</label>
                <select className="field">
                  <option>General Inquiry</option>
                  <option>Property Listing</option>
                  <option>QDA Approved Schemes</option>
                  <option>Advertising</option>
                  <option>Report an Issue</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="field-label">Message</label>
                <textarea required rows={5} className="field resize-y" placeholder="Write your message here..." />
              </div>

              <button type="submit" className="btn-primary mt-5 w-full sm:w-auto">
                <Send size={15} /> {sent ? "Message Sent ✓" : "Send Message"}
              </button>
              {sent && (
                <p className="mt-3 text-[13px] text-green">
                  Thank you! Your message has been sent — we&apos;ll reply within 24 hours.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
