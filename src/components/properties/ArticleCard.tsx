import type { Article } from "@/lib/types";

export default function ArticleCard({ a }: { a: Article }) {
  return (
    <a href="#" className="lift group block overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={a.img} alt={a.title} loading="lazy" className="img-zoom h-full w-full object-cover" />
        <span
          className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10.5px] font-bold ${a.tagColor}`}
        >
          {a.cat}
        </span>
      </div>
      <div className="p-4">
        <h4 className="line-clamp-2 text-[14.5px] font-semibold leading-snug text-navy">{a.title}</h4>
        <p className="mt-2.5 text-[12px] text-muted">
          {a.date} • {a.read}
        </p>
      </div>
    </a>
  );
}
