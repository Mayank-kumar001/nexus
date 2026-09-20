import type { ReactNode } from "react";
import { AppHeader } from "@/components/dashboard/app-header";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="flex-1 bg-[#E5E5E5] text-black">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
