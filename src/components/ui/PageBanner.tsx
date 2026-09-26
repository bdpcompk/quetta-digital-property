import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function PageBanner({
  title,
  crumbs,
  children,
}: {
  title: React.ReactNode;
  crumbs: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy pb-10 pt-[calc(var(--header-h)+30px)]">
      <img
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/85 to-navy/95" />
      <div className="wrap relative">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-4 text-[28px] font-extrabold text-white sm:text-[34px]">{title}</h1>
        {children}
      </div>
    </section>
  );
}
