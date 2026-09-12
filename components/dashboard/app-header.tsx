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
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-24 sm:h-28 w-full max-w-6xl items-center justify-between gap-2 px-3 sm:px-4">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                isActive(link.href, link.match)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isCore ? <Badge>Core</Badge> : <Badge variant="outline">Member</Badge>}
          <span className="hidden max-w-32 truncate text-xs text-muted-foreground sm:block md:max-w-40 md:text-sm">
            {user.name}
          </span>
          <SignOutButton />
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto scrollbar-none border-t border-border/60 px-3 py-1.5 sm:px-4 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-3 py-1 text-xs sm:text-sm whitespace-nowrap transition-colors",
              isActive(link.href, link.match)
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
