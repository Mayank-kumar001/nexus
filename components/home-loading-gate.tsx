"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import LoadingScreen from "@/components/loading-screen";

export function HomeLoadingGate({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
      {children}
    </>
  );
}
