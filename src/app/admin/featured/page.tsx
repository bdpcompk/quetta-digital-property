import { Star } from "lucide-react";
import ComingSoon from "@/components/admin/ComingSoon";

export default function FeaturedAdsPage() {
  return (
    <ComingSoon
      title="Featured Ads"
      desc="Featured, hot and super-featured listings."
      Icon={Star}
    />
  );
}
