import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

export default function ComingSoon({
  title,
  desc,
  Icon,
}: {
  title: string;
  desc: string;
  Icon: LucideIcon;
}) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-navy">{title}</h1>
          <p className="text-[13px] text-muted">{desc}</p>
        </div>
        <Link href="/admin/" className="btn-ghost">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <Icon size={26} />
        </span>
        <h2 className="mt-4 text-[16px] font-bold text-navy">Coming soon</h2>
        <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-muted">
          Ye module abhi enable nahi hai. Jab aap ready hon (pricing plans, payment
          gateway ya ads billing), to yahan integrate ho jayega.
        </p>
      </div>
    </div>
  );
}
