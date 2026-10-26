"use client";

import { CheckCircle2 } from "lucide-react";
import TableManager, { type ExtraAction } from "./TableManager";
import { supabase } from "@/lib/supabase";
import { ADMIN_TABLES } from "@/lib/adminTables";
import { parseGoogleMapsCoords } from "@/lib/maps";

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
  return (
    <TableManager
      table={table}
      extraActions={[approve]}
      beforeSave={(row) => {
        const link = String(row.mapLink ?? "").trim();
        delete row.mapLink;
        if (!link) return row;
        const c = parseGoogleMapsCoords(link);
        if (!c) {
          return "Google Maps link se coordinates nahi mile. Map par click karein ya lat/lng manually daalein.";
        }
        row.lat = c.lat;
        row.lng = c.lng;
        return row;
      }}
    />
  );
}
