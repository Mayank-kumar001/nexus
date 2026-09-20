"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-none uppercase tracking-[1.5px] text-[12px] font-bold text-white hover:bg-[#1a1a1a] hover:text-white border-none"
      onClick={async () => {
        await authClient.auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
