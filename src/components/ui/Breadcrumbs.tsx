import Link from "next/link";

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-white/70">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-white/40">›</span>}
          {it.href ? (
            <Link href={it.href} className="transition-colors hover:text-white">
              {it.label}
            </Link>
          ) : (
            <span className="text-white">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
