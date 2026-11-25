import type { Metadata } from "next";
import Link from "next/link";
import TableManager from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";

export const metadata: Metadata = { title: "Agents" };
const table = ADMIN_TABLES.find((t) => t.name === "agents")!;

export default function AdminAgentsPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Agents</h1>
      <p className="mb-3 text-[13px] text-muted">Real estate agencies and agents.</p>
      <Link
        href="/admin/users-roles/?tab=users&role=agent"
        className="mb-5 inline-flex items-center gap-1.5 rounded-lg bg-green-soft px-3 py-2 text-[12.5px] font-bold text-green transition-colors hover:bg-green hover:text-white"
      >
        Agent accounts — Block / Unblock / Delete →
      </Link>
      <TableManager table={table} />
    </div>
  );
}
