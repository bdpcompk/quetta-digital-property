import type { Metadata } from "next";
import PropertiesManager from "@/components/admin/PropertiesManager";

export const metadata: Metadata = { title: "Properties" };

export default function AdminPropertiesPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Properties</h1>
      <p className="mb-5 text-[13px] text-muted">
        Add, edit or remove property listings. Pending properties can be approved with the green
        check button.
      </p>
      <PropertiesManager />
    </div>
  );
}
