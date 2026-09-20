"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/brand";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Badge } from "@/components/ui/badge";
import type { AppUser } from "@/lib/session";
import { USER_ROLES } from "@/lib/roles";
import { cn } from "@/lib/utils";

export function AppHeader({ user }: { user: AppUser }) {
  const pathname = usePathname();
  const isCore = user.role === USER_ROLES.CORE;
  const links = [
    { href: "/dashboard", label: "Progress", match: (path: string) => path === "/dashboard" },
    {
      href: "/dashboard/submit",
      label: "Submit",
      match: (path: string) => path.startsWith("/dashboard/submit"),
    },
    ...(isCore
      ? [
          {
            href: "/review",
            label: "Verify",
            match: (path: string) => path === "/review" || path.startsWith("/review/"),
          },
          {
            href: "/review/records",
            label: "Records",
            match: (path: string) => path.startsWith("/review/records"),
          },
        ]
      : []),
  ];

  const isActive = (href: string, match: (path: string) => boolean) => {
    if (href === "/review") {
      return pathname === "/review" || (pathname.startsWith("/review/") && !pathname.startsWith("/review/records"));
    }
    return match(pathname);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#cccccc] bg-[#E5E5E5]/80 backdrop-blur-md">
      <div className="mx-auto flex h-24 sm:h-28 w-full max-w-6xl items-center justify-between gap-2 px-3 sm:px-4">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-none px-3 py-1.5 text-[12px] uppercase tracking-[1.5px] transition-colors font-bold",
                isActive(link.href, link.match)
                  ? "text-black border-b-2 border-black"
                  : "text-[#666666] hover:text-black"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-4">
          {isCore ? <Badge className="rounded-none bg-white border-[#cccccc] uppercase tracking-[1px] text-[10px] text-black">Core</Badge> : <Badge variant="outline" className="rounded-none border-[#cccccc] uppercase tracking-[1px] text-[10px] text-[#666666] bg-transparent">Member</Badge>}
          <span className="hidden max-w-32 truncate text-[12px] font-bold uppercase tracking-[1px] text-black sm:block md:max-w-40">
            {user.name}
          </span>
          <SignOutButton />
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto scrollbar-none border-t border-[#cccccc] px-3 py-1.5 sm:px-4 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-none px-3 py-1.5 text-[10px] uppercase tracking-[1.5px] whitespace-nowrap transition-colors font-bold",
              isActive(link.href, link.match)
                ? "text-black border-b-2 border-black"
                : "text-[#666666] hover:text-black"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
