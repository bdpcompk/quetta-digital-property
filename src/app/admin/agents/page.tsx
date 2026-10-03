import type { Metadata } from "next";
import TableManager from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";

export const metadata: Metadata = { title: "Agents" };
const table = ADMIN_TABLES.find((t) => t.name === "agents")!;

export default function AdminAgentsPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Agents</h1>
      <p className="mb-5 text-[13px] text-muted">Real estate agencies and agents.</p>
      <TableManager table={table} />
    </div>
  );
}
