import type { Metadata } from "next";
import TableManager from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";

export const metadata: Metadata = { title: "Verification Log" };
const table = ADMIN_TABLES.find((t) => t.name === "verification_history")!;

export default function AdminHistoryPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Verification Log</h1>
      <p className="mb-5 text-[13px] text-muted">
        Full audit trail of scheme verification status changes. New entries are also appended
        automatically when a scheme&apos;s Final Status changes.
      </p>
      <TableManager table={table} />
    </div>
  );
}
