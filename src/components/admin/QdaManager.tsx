"use client";

import TableManager from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";
import { supabase } from "@/lib/supabase";

const table = ADMIN_TABLES.find((t) => t.name === "qda_schemes")!;

export default function QdaManager() {
  const track = (_oldValue: unknown, row: Record<string, unknown>) => {
    if (!supabase) return;
    const status = String(row.final_status || "");
    if (!status) return;
    supabase
      .from("verification_history")
      .insert({
        scheme: String(row.name || ""),
        status,
        authority: String(row.authority || ""),
        noc: String(row.qvc_number || row.noc || ""),
        verified_by: "Admin",
        source: String(row.verification_source || "Official Record"),
      })
      .then(({ error }) => {
        if (error) console.error("history log failed:", error.message);
      });
  };

  return <TableManager table={table} trackField="final_status" onTrackChange={track} />;
}
