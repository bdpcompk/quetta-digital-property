"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile/?view=dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <Loader2 className="animate-spin text-green" size={28} />
    </div>
  );
}
