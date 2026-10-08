"use client";

import { useState } from "react";
import { AlertCircle, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Reveal from "@/components/ui/Reveal";
import { supabase } from "@/lib/supabase";

const INFO = [
  { Icon: MapPin, t: "Office Address", s: "Jinnah Town, Quetta, Balochistan, Pakistan" },
  { Icon: Phone, t: "Contact", s: "0304 7974497" },
  { Icon: Mail, t: "Email", s: "bdpcompk@gmail.com" },
  { Icon: Clock, t: "Working Hours", s: "Mon – Sat: 9:00 AM – 6:00 PM" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "General Inquiry", message: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErr("Backend not configured.");
      return;
    }
    setBusy(true);
    setErr("");
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject,
      message: form.message.trim(),
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
  };

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
            <form className="rounded-2xl border border-line bg-white p-6 sm:p-7" onSubmit={submit}>
              <h3 className="mb-5 text-[18px] font-bold text-navy">Send Us a Message</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Your Name</label>
                  <input required className="field" placeholder="Full Name" value={form.name} onChange={set("name")} />
                </div>
                <div>
                  <label className="field-label">Phone</label>
                  <input required className="field" type="tel" placeholder="+92 300 0000000" value={form.phone} onChange={set("phone")} />
                </div>
              </div>

              <div className="mt-4">
                <label className="field-label">Email</label>
                <input className="field" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
              </div>

              <div className="mt-4">
                <label className="field-label">Subject</label>
                <select className="field" value={form.subject} onChange={set("subject")}>
                  <option>General Inquiry</option>
                  <option>Property Listing</option>
                  <option>QDA Approved Schemes</option>
                  <option>Advertising</option>
                  <option>Report an Issue</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="field-label">Message</label>
                <textarea required rows={5} className="field resize-y" placeholder="Write your message here..." value={form.message} onChange={set("message")} />
              </div>

              {err && (
                <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" /> {err}
                </p>
              )}

              <button type="submit" disabled={busy} className="btn-primary mt-5 w-full sm:w-auto disabled:opacity-60">
                <Send size={15} /> {busy ? "Sending…" : sent ? "Message Sent ✓" : "Send Message"}
              </button>
              {sent && (
                <p className="mt-3 text-[13px] text-green">
                  Thank you! Your message has been received — we&apos;ll reply within 24 hours.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
