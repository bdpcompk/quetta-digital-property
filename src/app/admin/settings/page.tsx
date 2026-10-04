import { Settings } from "lucide-react";
import ComingSoon from "@/components/admin/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      desc="Site settings, branding and admin preferences."
      Icon={Settings}
    />
  );
}
