import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({
  title,
  href,
  linkLabel,
  align = "left",
  sub,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  sub?: string;
}) {
  return (
    <div
      className={`mb-7 flex items-end justify-between gap-4 ${
        align === "center" ? "flex-col items-center text-center" : "flex-wrap"
      }`}
    >
      <div className={align === "center" ? "text-center" : ""}>
        <h2 className="text-[22px] font-extrabold text-navy sm:text-[26px]">{title}</h2>
        {sub && <p className="mt-1.5 text-sm text-muted">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="link-more shrink-0">
          {linkLabel ?? "View All"} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
