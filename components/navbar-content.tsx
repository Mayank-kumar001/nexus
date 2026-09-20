"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Badge } from "@/components/ui/badge";
import type { AppUser } from "@/lib/session";
import { USER_ROLES } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/brand";

export function NavbarContent({ user }: { user: AppUser | null }) {
  const pathname = usePathname();
  const isCore = user?.role === USER_ROLES.CORE;

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
    <div className="mx-auto flex w-full max-w-[980px] items-center justify-between">
      {/* Brand/Logo Area */}
      <Brand className="scale-75 origin-left" />

      {/* Center Links */}
      <div className="hidden md:flex items-center space-x-8">
        {user ? (
          links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[12px] font-normal tracking-[-0.12px] transition-all",
                isActive(link.href, link.match)
                  ? "opacity-100 font-medium text-[#1d1d1f]"
                  : "opacity-80 hover:opacity-100 text-[#1d1d1f]"
              )}
            >
              {link.label}
            </Link>
          ))
        ) : (
          <>
            <Link href="/" className="text-[12px] font-normal tracking-[-0.12px] opacity-80 hover:opacity-100 transition-opacity text-[#1d1d1f]">
              Models
            </Link>
            <Link href="/" className="text-[12px] font-normal tracking-[-0.12px] opacity-80 hover:opacity-100 transition-opacity text-[#1d1d1f]">
              Journey
            </Link>
            <Link href="/" className="text-[12px] font-normal tracking-[-0.12px] opacity-80 hover:opacity-100 transition-opacity text-[#1d1d1f]">
              Support
            </Link>
          </>
        )}
      </div>

      {/* Right-aligned cluster */}
      <div className="flex items-center space-x-3">
        {user ? (
          <div className="flex items-center gap-3">
            {isCore ? (
              <Badge className="rounded-none bg-black/10 border-black/10 uppercase tracking-[1px] text-[10px] text-[#1d1d1f]">Core</Badge>
            ) : (
              <Badge variant="outline" className="rounded-none border-black/20 uppercase tracking-[1px] text-[10px] text-[#1d1d1f]/60 bg-transparent">Member</Badge>
            )}
            <span className="hidden max-w-32 truncate text-[12px] font-normal tracking-[-0.12px] text-[#1d1d1f]/90 sm:block md:max-w-40">
              {user.name}
            </span>
            <Link 
              href="/dashboard"
              className="hidden md:inline-flex text-[12px] font-normal tracking-[-0.12px] bg-black/5 text-[#1d1d1f] px-[12px] py-[4px] rounded-[6px] hover:bg-black/10 transition-colors"
            >
              Dashboard
            </Link>
            <div className="scale-75 origin-right">
              <SignOutButton />
            </div>
          </div>
        ) : (
          <>
            <Link 
              href="/sign-in"
              className="text-[12px] font-normal tracking-[-0.12px] bg-black/5 text-[#1d1d1f] px-[12px] py-[4px] rounded-[6px] hover:bg-black/10 transition-colors inline-flex items-center justify-center"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up"
              className="text-[12px] font-normal tracking-[-0.12px] bg-[#0066cc] text-white px-[12px] py-[4px] rounded-[6px] hover:bg-[#0071e3] transition-colors inline-flex items-center justify-center"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
