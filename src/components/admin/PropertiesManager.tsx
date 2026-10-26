"use client";

import { CheckCircle2 } from "lucide-react";
import TableManager, { type ExtraAction } from "./TableManager";
import { supabase } from "@/lib/supabase";
import { ADMIN_TABLES } from "@/lib/adminTables";

const table = ADMIN_TABLES.find((t) => t.name === "properties")!;

const approve: ExtraAction = {
  icon: <CheckCircle2 size={14} />,
  title: "Approve (make Active)",
  show: (row) => String(row.status ?? "").toLowerCase() === "pending",
  onClick: async (row) => {
    if (!supabase) return;
    await supabase.from("properties").update({ status: "active" }).eq("id", row.id);
  },
};

export default function PropertiesManager() {
  return <TableManager table={table} extraActions={[approve]} />;
}
