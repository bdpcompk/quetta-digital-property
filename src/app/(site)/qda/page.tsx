"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QdaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/schemes/");
  }, [router]);

  return null;
}
