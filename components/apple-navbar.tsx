import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

import { NavbarContent } from "./navbar-content";

export async function AppleNavbar() {
  const user = await getCurrentUser();

  return (
    <nav className="sticky top-0 z-50 w-full h-[44px] bg-[rgba(251,251,253,0.8)] backdrop-saturate-[180%] backdrop-blur-[20px] border-b border-black/10 text-[#1d1d1f] flex items-center px-4 sm:px-6">
      <NavbarContent user={user} />
    </nav>
  );
}
