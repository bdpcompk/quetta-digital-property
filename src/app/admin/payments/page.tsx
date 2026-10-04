import { CreditCard } from "lucide-react";
import ComingSoon from "@/components/admin/ComingSoon";

export default function PaymentsPage() {
  return (
    <ComingSoon
      title="Payments"
      desc="Payments, invoices and transaction history."
      Icon={CreditCard}
    />
  );
}
