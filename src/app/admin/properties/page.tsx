import type { Metadata } from "next";
import TableManager from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";

export const metadata: Metadata = { title: "Properties" };
const table = ADMIN_TABLES.find((t) => t.name === "properties")!;

export default function AdminPropertiesPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Properties</h1>
      <p className="mb-5 text-[13px] text-muted">Add, edit or remove property listings.</p>
      <TableManager table={table} />
    </div>
  );
}
