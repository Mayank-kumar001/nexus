import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/logo2.png"
        alt="Nexus logo"
        width={96}
        height={96}
        className="size-20 object-contain sm:size-24"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-sm font-semibold tracking-[0.18em]">AARVAK</span>
        <span className="text-[10px] text-muted-foreground tracking-[0.22em] uppercase">
          Team Nexus
        </span>
      </span>
    </Link>
  );
}
