import type { Metadata } from "next";
import Link from "next/link";
import MergedSchemeManager from "@/components/admin/MergedSchemeManager";

export const metadata: Metadata = { title: "Schemes" };

export default function AdminSchemesPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Schemes</h1>
      <p className="mb-3 text-[13px] leading-relaxed text-muted">
        Normal schemes and QDA schemes together in one table. Use <b className="text-green">✎ Edit</b>
        to change source (Normal / QDA) or any field. <b className="text-red-500">🗑 Delete</b>
        removes from the correct table.
      </p>
      <Link
        href="/admin/users-roles/?tab=users&role=owner"
        className="mb-5 inline-flex items-center gap-1.5 rounded-lg bg-green-soft px-3 py-2 text-[12.5px] font-bold text-green transition-colors hover:bg-green hover:text-white"
      >
        Scheme owner accounts — Block / Unblock / Delete →
      </Link>
      <MergedSchemeManager />
    </div>
  );
}
