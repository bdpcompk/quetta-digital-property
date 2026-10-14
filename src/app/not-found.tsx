"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import LegacyRedirect from "@/components/ui/LegacyRedirect";

export default function NotFound() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/listings/?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-navy px-5 pt-16">
      <LegacyRedirect />
      <div className="text-center">
        <p className="text-[80px] font-extrabold leading-none text-green">404</p>
        <h1 className="mt-3 text-[24px] font-bold text-white">Page Not Found</h1>
        <p className="mt-2 text-[14px] text-white/60">
          The property or page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <form onSubmit={search} className="mx-auto mt-6 flex max-w-md gap-2">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search properties, areas, schemes..."
            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[14px] text-white placeholder:text-white/40 outline-none focus:border-green"
          />
          <button type="submit" className="btn-primary px-4">
            <Search size={16} />
          </button>
        </form>
        <Link href="/" className="btn-ghost mt-4 inline-flex border-white/25 text-white hover:bg-white/10 hover:text-white">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
