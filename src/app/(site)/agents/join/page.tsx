"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, BadgeCheck, Loader2, Send, Users } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import { useSession } from "@/lib/useSession";

export default function AgentJoinPage() {
  const { session, ready, supabase: sb } = useSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb || !session) return;
    setErr("");
    setBusy(true);

    const agentData = {
      id: Date.now() % 100000,
      name: name.trim(),
      type: specialization || "Agent",
      rating: 5,
      reviews: "0",
      location: city,
      verified: false,
      phone: phone.trim(),
      email: session.user.email || "",
      avatar: "",
    };

    const { error } = await sb.from("agents").insert(agentData);
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  };

  if (!ready) {
    return (
      <div className="flex justify-center py-28">
        <Loader2 className="animate-spin text-green" size={30} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="wrap py-24 text-center">
        <p className="text-[15px] font-bold text-navy">Please login to join as an agent</p>
        <Link href="/login/" className="btn-primary mt-4 inline-flex">
          Login <ArrowLeft size={15} className="rotate-180" />
        </Link>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="wrap py-24 text-center">
        <BadgeCheck size={48} className="mx-auto text-green" />
        <h1 className="mt-4 text-[22px] font-extrabold text-navy">Agent Registration Submitted!</h1>
        <p className="mt-2 text-[14px] text-muted">Our team will review your profile and get back to you.</p>
        <Link href="/agents/" className="btn-primary mt-6 inline-flex">
          <Users size={15} /> View All Agents
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageBanner
        title="Join as a Real Estate Agent"
        crumbs={[{ label: "Home", href: "/" }, { label: "Agents", href: "/agents/" }, { label: "Join as Agent" }]}
      >
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
          Create your agent profile and start listing properties for your clients across Balochistan.
        </p>
      </PageBanner>

      <section className="section">
        <div className="wrap max-w-2xl">
          <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            <h2 className="text-[18px] font-extrabold text-navy">Agent Information</h2>
            <p className="mt-1 text-[13px] text-muted">Fill in your details to create your agent profile.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-ink">Full Name *</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]"
                  placeholder="Your full name"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-ink">Phone Number *</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]"
                  placeholder="0304 7974497"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-ink">City / District *</span>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]"
                  placeholder="e.g. Quetta, Gwadar"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-ink">Specialization</span>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] font-medium text-ink outline-none transition-colors focus:border-green focus:shadow-[0_0_0_3px_rgba(26,135,84,.12)]"
                >
                  <option value="">Select specialization</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Plots">Plots</option>
                  <option value="Agricultural">Agricultural Land</option>
                  <option value="All">All Types</option>
                </select>
              </label>
            </div>

            {err && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">
                <AlertCircle size={15} /> {err}
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-primary mt-6 w-full justify-center">
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {busy ? "Submitting..." : "Submit Agent Registration"}
            </button>

            <p className="mt-4 text-center text-[12px] text-muted">
              Already an agent? <Link href="/agents/" className="font-semibold text-green hover:underline">View existing agents</Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
