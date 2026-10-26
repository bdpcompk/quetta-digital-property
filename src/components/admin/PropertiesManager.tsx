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
    const { data, error } = await supabase
      .from("properties")
      .update({ status: "active" })
      .eq("id", row.id)
      .select("id");
    if (error) {
      window.alert("Approve failed: " + error.message);
    } else if (!data || data.length === 0) {
      window.alert("Approve failed — database permission issue. Please contact support.");
    }
  },
};

export default function PropertiesManager() {
  return <TableManager table={table} extraActions={[approve]} />;
}
