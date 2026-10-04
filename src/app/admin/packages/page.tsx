import { Package } from "lucide-react";
import ComingSoon from "@/components/admin/ComingSoon";

export default function PackagesPage() {
  return (
    <ComingSoon
      title="Packages & Pricing"
      desc="Agent plans, listing packages and pricing tiers."
      Icon={Package}
    />
  );
}
