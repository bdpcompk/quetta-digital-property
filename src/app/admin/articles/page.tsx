import type { Metadata } from "next";
import TableManager from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";

export const metadata: Metadata = { title: "Guides & Articles" };
const table = ADMIN_TABLES.find((t) => t.name === "articles")!;

export default function AdminArticlesPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Guides & Articles</h1>
      <p className="mb-5 text-[13px] text-muted">Property guides, tips and market articles.</p>
      <TableManager table={table} />
    </div>
  );
}
