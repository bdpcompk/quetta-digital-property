import type { Metadata } from "next";
import SchemeManager from "@/components/admin/SchemeManager";

export const metadata: Metadata = { title: "Schemes" };

export default function AdminSchemesPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Schemes</h1>
      <p className="mb-5 text-[13px] text-muted">
        All property schemes. Use the green tick to mark a scheme Verified — it auto-shares
        the scheme to WhatsApp.
      </p>
      <SchemeManager />
    </div>
  );
}
