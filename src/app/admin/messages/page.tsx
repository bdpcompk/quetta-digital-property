import type { Metadata } from "next";
import TableManager from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";

export const metadata: Metadata = { title: "Messages" };
const table = ADMIN_TABLES.find((t) => t.name === "contact_messages")!;

export default function AdminMessagesPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Messages</h1>
      <p className="mb-5 text-[13px] text-muted">
        Inquiries sent from the contact page.
      </p>
      <TableManager table={table} />
    </div>
  );
}
