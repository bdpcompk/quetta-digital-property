import type { Metadata } from "next";
import SchemeManager from "@/components/admin/SchemeManager";

export const metadata: Metadata = { title: "Schemes" };

export default function AdminSchemesPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Schemes</h1>
      <p className="mb-5 text-[13px] leading-relaxed text-muted">
        All property schemes. User-submitted schemes arrive as <b className="text-amber-600">Pending</b> —
        use the row actions to <b className="text-green">✓ Approve</b> (goes live instantly) or{" "}
        <b className="text-red-500">✗ Reject</b>. The green tick marks a scheme Verified and
        auto-shares it to WhatsApp.
      </p>
      <SchemeManager />
    </div>
  );
}
