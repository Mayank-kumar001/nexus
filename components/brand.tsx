import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-8 items-center justify-center rounded-xl bg-primary font-heading text-sm font-semibold tracking-tight text-primary-foreground">
        A
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-sm font-semibold tracking-[0.18em]">AARVAK</span>
        <span className="text-[10px] text-muted-foreground tracking-[0.22em] uppercase">
          Team Nexus
        </span>
      </span>
    </Link>
  );
}
