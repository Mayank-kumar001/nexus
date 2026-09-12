import Link from "next/link";
import { Brand } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_42%)]" />

      {/* ── Header ── */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
        <Brand />
        {user ? (
          <Link href="/dashboard" className={buttonVariants()}>
            Open dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
              Sign in
            </Link>
            <Link href="/sign-up" className={buttonVariants()}>
              Join the team
            </Link>
          </div>
        )}
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-10 px-4 py-10 sm:gap-14 sm:px-6 sm:py-14">

        {/* Hero */}
        <div className="flex w-full flex-col items-center text-center">
          <h1 className="font-heading text-4xl font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Tech Journey
          </h1>
          <p className="mt-3 font-serif text-3xl text-balance text-foreground/90 sm:text-4xl lg:text-5xl">
            Team Nexus
          </p>
          <Link
            href={user ? "/dashboard" : "/sign-up"}
            className={buttonVariants({ size: "lg", className: "mt-6 px-5 text-xs tracking-widest sm:px-8 sm:text-sm sm:tracking-[0.18em]" })}
          >
            <span className="sm:hidden">AARVAK · JOIN NOW</span>
            <span className="hidden sm:inline">AARVAK OFFICIAL · TECH SOCIETY OF VSET</span>
          </Link>
        </div>

        {/* ── Dashboard Mockup ── */}
        <div className="w-full overflow-hidden rounded-xl border border-border/60 bg-[oklch(0.13_0.006_228)] shadow-2xl ring-1 ring-foreground/10 sm:rounded-2xl">

          {/* Title bar */}
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5 sm:gap-2 sm:px-4 sm:py-3">
            <span className="size-2.5 rounded-full bg-red-500/80 sm:size-3" />
            <span className="size-2.5 rounded-full bg-yellow-500/80 sm:size-3" />
            <span className="size-2.5 rounded-full bg-green-500/80 sm:size-3" />
            <span className="ml-3 font-mono text-[10px] text-white/30 tracking-widest uppercase sm:ml-4 sm:text-[11px]">
              AARVAK · Workflow
            </span>
          </div>

          <div className="flex min-h-0">

            {/* Sidebar — hidden on mobile, compact on sm, full on md+ */}
            <div className="hidden w-36 shrink-0 flex-col gap-0.5 border-r border-white/10 px-2 py-3 sm:flex md:w-44 md:px-3 md:py-4">
              <p className="mb-1.5 px-2 font-mono text-[9px] tracking-widest text-white/25 uppercase md:text-[10px]">
                Navigation
              </p>
              {[
                { label: "Progress", active: false },
                { label: "Submit", active: true },
                { label: "Verify", active: false },
                { label: "Records", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium md:rounded-lg md:px-3 md:py-2 md:text-xs ${
                    item.active ? "bg-primary/20 text-primary" : "text-white/35"
                  }`}
                >
                  {item.label}
                </div>
              ))}
              <div className="mt-auto pt-6">
                <div className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2 py-1.5">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/30 text-[9px] font-semibold text-primary md:size-6 md:text-[10px]">
                    A
                  </div>
                  <span className="truncate text-[10px] text-white/45 md:text-[11px]">Member</span>
                </div>
              </div>
            </div>

            {/* Main area */}
            <div className="relative flex flex-1 flex-col items-center justify-center px-3 py-12 sm:px-5 sm:py-16 md:px-8 md:py-20">

              {/* Grid bg */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right,white 1px,transparent 1px),linear-gradient(to bottom,white 1px,transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <p className="relative mb-5 font-mono text-[9px] tracking-widest text-white/25 uppercase sm:mb-6 sm:text-[10px]">
                Verification Pipeline
              </p>

              {/* ── Node graph ── */}
              {/* Desktop / tablet: horizontal row */}
              <div className="relative hidden w-full max-w-xl items-center justify-between sm:flex">
                {/* Node 1 */}
                <div className="z-10 flex flex-col items-center gap-2">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 shadow-lg shadow-primary/10 ring-1 ring-primary/20 md:size-14">
                    <svg className="size-5 text-primary md:size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[9px] font-semibold text-primary/80 uppercase tracking-widest">01</p>
                    <p className="mt-0.5 text-xs font-semibold text-white/90 md:text-sm">Submit</p>
                    <p className="mt-0.5 max-w-[90px] text-[10px] leading-3.5 text-white/35 md:max-w-[110px] md:text-[11px] md:leading-4">
                      Name, dept, date, proof
                    </p>
                  </div>
                </div>

                {/* Connector 1→2 */}
                <div className="relative mx-2 flex flex-1 items-center justify-center">
                  <svg className="w-full" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
                    <line x1="0" y1="1" x2="100" y2="1" stroke="oklch(0.514 0.222 16.935)" strokeWidth="1.5" strokeDasharray="5 4" strokeOpacity="0.45" />
                  </svg>
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-[oklch(0.13_0.006_228)] px-1.5 py-px font-mono text-[8px] text-primary/55 uppercase tracking-wide">
                    review
                  </span>
                </div>

                {/* Node 2 */}
                <div className="z-10 flex flex-col items-center gap-2">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 shadow-lg ring-1 ring-white/10 md:size-14">
                    <svg className="size-5 text-white/65 md:size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[9px] font-semibold text-white/35 uppercase tracking-widest">02</p>
                    <p className="mt-0.5 text-xs font-semibold text-white/90 md:text-sm">Verify</p>
                    <p className="mt-0.5 max-w-[90px] text-[10px] leading-3.5 text-white/35 md:max-w-[110px] md:text-[11px] md:leading-4">
                      Core members approve
                    </p>
                  </div>
                </div>

                {/* Connector 2→3 */}
                <div className="relative mx-2 flex flex-1 items-center justify-center">
                  <svg className="w-full" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
                    <line x1="0" y1="1" x2="100" y2="1" stroke="white" strokeWidth="1.5" strokeDasharray="5 4" strokeOpacity="0.2" />
                  </svg>
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[oklch(0.13_0.006_228)] px-1.5 py-px font-mono text-[8px] text-white/30 uppercase tracking-wide">
                    export
                  </span>
                </div>

                {/* Node 3 */}
                <div className="z-10 flex flex-col items-center gap-2">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 shadow-lg ring-1 ring-white/10 md:size-14">
                    <svg className="size-5 text-white/65 md:size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[9px] font-semibold text-white/35 uppercase tracking-widest">03</p>
                    <p className="mt-0.5 text-xs font-semibold text-white/90 md:text-sm">Connect</p>
                    <p className="mt-0.5 max-w-[90px] text-[10px] leading-3.5 text-white/35 md:max-w-[110px] md:text-[11px] md:leading-4">
                      Export-ready for AARVAK
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile: vertical stack */}
              <div className="flex w-full max-w-xs flex-col items-center gap-0 sm:hidden">
                {[
                  {
                    step: "01", label: "Submit", desc: "Name, dept, date, proof image", accent: true,
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />,
                    connector: "review",
                  },
                  {
                    step: "02", label: "Verify", desc: "Core members approve proof", accent: false,
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
                    connector: "export",
                  },
                  {
                    step: "03", label: "Connect", desc: "Export-ready for AARVAK", accent: false,
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />,
                    connector: null,
                  },
                ].map((item) => (
                  <div key={item.step} className="flex w-full flex-col items-center">
                    <div className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
                      <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${item.accent ? "border border-primary/40 bg-primary/10 shadow-primary/10 ring-1 ring-primary/20" : "border border-white/15 bg-white/5 ring-1 ring-white/10"}`}>
                        <svg className={`size-4 ${item.accent ? "text-primary" : "text-white/60"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          {item.icon}
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-[9px] font-semibold uppercase tracking-widest ${item.accent ? "text-primary/80" : "text-white/35"}`}>{item.step}</span>
                          <span className="text-xs font-semibold text-white/90">{item.label}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] leading-3.5 text-white/35">{item.desc}</p>
                      </div>
                    </div>
                    {item.connector && (
                      <div className="relative flex h-6 w-px items-center justify-center">
                        <svg className="h-full w-px" viewBox="0 0 2 24" preserveAspectRatio="none">
                          <line x1="1" y1="0" x2="1" y2="24" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.2" />
                        </svg>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[8px] text-white/25 uppercase tracking-wide">
                          {item.connector}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Status bar */}
              <div className="relative mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 sm:mt-6 sm:gap-x-4 sm:px-4 sm:py-2">
                <span className="flex items-center gap-1.5 font-mono text-[9px] text-white/40 sm:text-[10px]">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Pipeline Active
                </span>
                <span className="hidden font-mono text-[10px] text-white/20 sm:inline">·</span>
                <span className="font-mono text-[9px] text-white/35 sm:text-[10px]">Points calculated fairly</span>
                <span className="hidden font-mono text-[10px] text-white/20 sm:inline">·</span>
                <span className="font-mono text-[9px] text-white/35 sm:text-[10px]">All records signed</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border/50">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 sm:px-6">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} AARVAK · Tech Society of VSET
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/sign-in" className="transition-colors hover:text-foreground">Sign in</Link>
            <Link href="/sign-up" className="transition-colors hover:text-foreground">Sign up</Link>
            {user && (
              <Link href="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

