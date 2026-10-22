"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgentJoinPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/become-agent/");
  }, [router]);
  return null;
}
