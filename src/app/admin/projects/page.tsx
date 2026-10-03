import type { Metadata } from "next";
import TableManager from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";

export const metadata: Metadata = { title: "Projects" };
const table = ADMIN_TABLES.find((t) => t.name === "projects")!;

export default function AdminProjectsPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">New Projects</h1>
      <p className="mb-5 text-[13px] text-muted">Housing projects and developments.</p>
      <TableManager table={table} />
    </div>
  );
}
