import type { Metadata } from "next";
import MergedSchemeManager from "@/components/admin/MergedSchemeManager";

export const metadata: Metadata = { title: "Schemes" };

export default function AdminSchemesPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Schemes</h1>
      <p className="mb-5 text-[13px] leading-relaxed text-muted">
        Normal schemes and QDA schemes together in one table. Use <b className="text-green">✎ Edit</b>
        to change source (Normal / QDA) or any field. <b className="text-red-500">🗑 Delete</b>
        removes from the correct table.
      </p>
      <MergedSchemeManager />
    </div>
  );
}
