import type { Metadata } from "next";
import TableManager from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";

export const metadata: Metadata = { title: "QDA Schemes" };
const table = ADMIN_TABLES.find((t) => t.name === "qda_schemes")!;

export default function AdminQdaPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">QDA Schemes</h1>
      <p className="mb-5 text-[13px] text-muted">QDA approved housing schemes.</p>
      <TableManager table={table} />
    </div>
  );
}
