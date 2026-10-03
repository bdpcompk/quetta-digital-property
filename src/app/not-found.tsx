import Link from "next/link";
import { Search } from "lucide-react";
import LegacyRedirect from "@/components/ui/LegacyRedirect";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-navy px-5 pt-16">
      <LegacyRedirect />
      <div className="text-center">
        <p className="text-[80px] font-extrabold leading-none text-green">404</p>
        <h1 className="mt-3 text-[24px] font-bold text-white">Page Not Found</h1>
        <p className="mt-2 text-[14px] text-white/60">
          The property or page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className="btn-primary mt-6">
          <Search size={15} /> Back to Home
        </Link>
      </div>
    </section>
  );
}
