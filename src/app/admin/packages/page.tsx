import PackagesManager from "@/components/admin/PackagesManager";

export default function PackagesPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Packages & Pricing</h1>
      <p className="mb-5 text-[13px] text-muted">
        Plans, prices aur features yahan edit karein. Changes turant Packages page par apply honge.
      </p>
      <PackagesManager />
    </div>
  );
}