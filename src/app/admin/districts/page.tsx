import type { Metadata } from "next";
import TableManager from "@/components/admin/TableManager";
import { ADMIN_TABLES } from "@/lib/adminTables";

export const metadata: Metadata = { title: "Districts & Areas" };
const districts = ADMIN_TABLES.find((t) => t.name === "districts")!;
const areas = ADMIN_TABLES.find((t) => t.name === "areas")!;

export default function AdminDistrictsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-1 text-[22px] font-extrabold text-navy">Districts</h1>
        <p className="mb-5 text-[13px] text-muted">All 36 districts of Balochistan (coverage list).</p>
        <TableManager table={districts} />
      </div>
      <div>
        <h2 className="mb-1 text-[18px] font-extrabold text-navy">Areas & Localities</h2>
        <p className="mb-5 text-[13px] text-muted">Cities, towns and neighbourhoods.</p>
        <TableManager table={areas} />
      </div>
    </div>
  );
}
