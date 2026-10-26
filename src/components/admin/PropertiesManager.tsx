"use client";

import { CheckCircle2 } from "lucide-react";
import TableManager, { type ExtraAction } from "./TableManager";
import { supabase } from "@/lib/supabase";
import { ADMIN_TABLES } from "@/lib/adminTables";

const table = ADMIN_TABLES.find((t) => t.name === "properties")!;

function parseCoords(link: string): { lat: number; lng: number } | null {
  const patterns = [
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/,
  ];
  for (const re of patterns) {
    const m = link.match(re);
    if (!m) continue;
    const lat = Number(m[1]);
    const lng = Number(m[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng };
    }
  }
  return null;
}

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
        const c = parseCoords(link);
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
