"use client";

import { BadgeCheck } from "lucide-react";
import TableManager, { type ExtraAction } from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";
import { supabase } from "@/lib/supabase";
import { AUTHORITIES, formatPKR } from "@/lib/data";

const table = ADMIN_TABLES.find((t) => t.name === "schemes")!;

function shareText(row: Record<string, unknown>): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const num = (k: string) => Number(row[k] || 0);
  const auth = String(row.authority || "");
  const authFull = AUTHORITIES[auth] ?? "";
  const lines = [
    "✅ *Scheme Verified*",
    `*${String(row.name || "")}*`,
    row.location ? `📍 ${String(row.location)}` : "",
    auth ? `🏛️ Authority: ${auth}${authFull ? ` — ${authFull}` : ""}` : "",
    row.noc_number ? `📄 NOC: ${String(row.noc_number)} (${String(row.noc_status || "")})` : row.noc_status ? `📄 NOC: ${String(row.noc_status)}` : "",
    row.registration_method ? `✍️ Registration: ${String(row.registration_method)}` : "",
    num("price_total") ? `💰 Total: ${formatPKR(num("price_total"))}` : "",
    num("price_advance") ? `Advance: ${formatPKR(num("price_advance"))}` : "",
    num("price_monthly") ? `Monthly Qist: ${formatPKR(num("price_monthly"))}/month` : "",
    row.owner_name || row.owner_phone
      ? `🏢 Owner: ${String(row.owner_name || "")}${row.owner_phone ? ` — ${String(row.owner_phone)}` : ""}`
      : "",
    row.map_link ? `🗺️ ${String(row.map_link)}` : "",
    `🔗 ${window.location.origin}${base}/schemes/`,
  ];
  return lines.filter(Boolean).join("\n");
}

function fireWebhook(row: Record<string, unknown>, message: string) {
  const hook = process.env.NEXT_PUBLIC_WHATSAPP_WEBHOOK;
  if (!hook) return;
  fetch(hook, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "scheme_verified", scheme: String(row.name || ""), message }),
  }).catch(() => {});
}

export default function SchemeManager() {
  const extraAction: ExtraAction = {
    icon: <BadgeCheck size={15} />,
    title: "Mark Verified & open WhatsApp share",
    show: (row) => row.verified !== true,
    onClick: async (row) => {
      if (!supabase) return;
      const win = window.open("about:blank", "_blank");
      const { error } = await supabase
        .from("schemes")
        .update({ verified: true })
        .eq("id", Number(row.id));
      if (error) {
        win?.close();
        alert(`Could not verify scheme: ${error.message}`);
        return;
      }
      const message = shareText(row);
      fireWebhook(row, message);
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      if (win) win.location.href = url;
      else window.open(url, "_blank");
    },
  };

  const track = (oldValue: unknown, row: Record<string, unknown>) => {
    if (oldValue === false && row.verified === true) fireWebhook(row, shareText(row));
  };

  return <TableManager table={table} trackField="verified" onTrackChange={track} extraAction={extraAction} />;
}
