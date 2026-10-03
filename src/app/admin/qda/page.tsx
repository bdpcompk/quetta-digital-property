import type { Metadata } from "next";
import QdaManager from "@/components/admin/QdaManager";

export const metadata: Metadata = { title: "QDA Schemes" };

export default function AdminQdaPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">QDA Schemes</h1>
      <p className="mb-5 text-[13px] text-muted">
        Schemes with verification records — changing Final Status automatically appends an
        entry to the Verification Log.
      </p>
      <QdaManager />
    </div>
  );
}
