"use client";

import Link from "next/link";
import {
  FadeUp,
  FadeIn,
  SlideInLeft,
  SlideInRight,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  TextReveal,
  CountUp,
  BlurReveal,
} from "@/components/ui/motion-reveal";
import { motion } from "framer-motion";

interface HomeAnimatedContentProps {
  isLoggedIn: boolean;
}

export function HomeAnimatedContent({ isLoggedIn }: HomeAnimatedContentProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#FFFFFF] w-full selection:bg-[#FF3B00] selection:text-white font-sans overflow-hidden">

      {/* ═══════════ Hero Section ═══════════ */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-end px-6 lg:px-24 pb-24">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#FF3B00] opacity-[0.03] rounded-full blur-[120px]"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.03 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#ffffff] opacity-[0.02] rounded-full blur-[100px]"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.02 }}
            transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col gap-12">
          {/* Tagline */}
          <SlideInLeft delay={0.2}>
            <div className="flex items-center gap-4">
              <motion.div
                className="h-[1px] w-12 bg-[#FF3B00]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
              />
              <span className="text-[12px] md:text-[14px] font-bold tracking-[4px] uppercase text-[#FF3B00]">
                Beyond Code. Built with Vision.
              </span>
            </div>
          </SlideInLeft>

          {/* Massive Title — character-by-character reveal */}
          <div className="text-[64px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-bold leading-[0.85] uppercase tracking-tighter text-[#F5F5F5] font-[family-name:var(--font-oswald)]">
            <TextReveal
              text="AARVAK"
              delay={0.3}
              staggerDelay={0.04}
              className="text-[64px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-bold leading-[0.85] uppercase tracking-tighter text-[#F5F5F5] font-[family-name:var(--font-oswald)]"
            />
            <TextReveal
              text="SOCIETY"
              delay={0.55}
              staggerDelay={0.04}
              className="text-[64px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-bold leading-[0.85] uppercase tracking-tighter text-[#333333] font-[family-name:var(--font-oswald)]"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mt-8">
            <FadeUp delay={0.6} y={30}>
              <p className="text-[18px] md:text-[24px] font-light leading-[1.4] text-[#888888] max-w-xl">
                Submit, verify, and track team achievements. Engineered for precision and uncompromising quality.
              </p>
            </FadeUp>

            <ScaleIn delay={0.8}>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/sign-up"}
                  className="group relative inline-flex items-center justify-center px-[40px] h-[64px] bg-[#FF3B00] text-white text-[14px] font-bold uppercase tracking-[2px] rounded-full overflow-hidden transition-transform hover:scale-105 duration-500"
                >
                  <span className="relative z-10">{isLoggedIn ? "Open Dashboard" : "Join The Team"}</span>
                  <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                  <span className="absolute inset-0 z-10 flex items-center justify-center text-black translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                    {isLoggedIn ? "Open Dashboard" : "Join The Team"}
                  </span>
                </Link>
                {!isLoggedIn && (
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center px-[40px] h-[64px] bg-transparent text-white border border-[#333333] text-[14px] font-bold uppercase tracking-[2px] rounded-full hover:border-white transition-colors duration-500"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* ═══════════ Narrative Statement Section ═══════════ */}
      <section className="relative w-full py-[120px] lg:py-[200px] px-6 lg:px-24 bg-[#050505]">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col md:flex-row gap-12 lg:gap-32">
          <div className="md:w-1/3">
            <SlideInLeft>
              <h2 className="text-[14px] font-bold tracking-[3px] uppercase text-[#666666] sticky top-32">
                Our Mission
              </h2>
            </SlideInLeft>
          </div>
          <div className="md:w-2/3">
            <BlurReveal delay={0.15}>
              <h3 className="text-[32px] sm:text-[48px] lg:text-[64px] font-medium leading-[1.1] tracking-tight text-[#E5E5E5]">
                We believe in <span className="text-[#FF3B00] italic font-[family-name:var(--font-instrument-serif)]">relentless</span> progression.
                Our platform ensures every technical achievement is verified, tracked, and celebrated with absolute precision.
              </h3>
            </BlurReveal>
          </div>
        </div>
      </section>

      {/* ═══════════ Pipeline / Project Cards (Sticky Layout) ═══════════ */}
      <section className="relative w-full py-[120px] px-6 lg:px-24 bg-[#121212] border-t border-[#222222]">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-16 lg:gap-24 relative">

          {/* Sticky Left Column */}
          <div className="lg:w-1/3 relative">
            <div className="sticky top-32 flex flex-col gap-6">
              <ScaleIn>
                <div className="w-12 h-12 bg-[#FF3B00] rounded-full flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </ScaleIn>
              <SlideInLeft delay={0.1}>
                <h2 className="text-[48px] lg:text-[72px] font-bold leading-[0.9] uppercase tracking-tighter text-white font-[family-name:var(--font-oswald)]">
                  CORE<br />SYSTEMS
                </h2>
              </SlideInLeft>
              <FadeUp delay={0.25}>
                <p className="text-[16px] text-[#888888] font-light leading-[1.5] max-w-sm mt-4">
                  Explore the foundational pillars that drive our tech society forward. Transparency, performance, and community.
                </p>
              </FadeUp>
            </div>
          </div>

          {/* Right Column Scrolling Cards — staggered */}
          <StaggerContainer className="lg:w-2/3 flex flex-col gap-8 lg:gap-16" staggerDelay={0.2} delayChildren={0.1}>

            {/* Card 1 */}
            <StaggerItem>
              <div className="group relative w-full rounded-[24px] overflow-hidden bg-[#1A1A1A] p-8 lg:p-12 border border-[#333333] hover:border-[#FF3B00] transition-colors duration-500">
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="text-[12px] font-bold tracking-[2px] uppercase text-[#FF3B00]">01 — Pipeline</div>
                  <h3 className="text-[32px] lg:text-[40px] font-bold leading-[1.1] text-white">Proof of Work</h3>
                  <p className="text-[18px] font-light text-[#A0A0A0] leading-[1.5] max-w-md">
                    Submit your technical achievements through our secure pipeline. Our core members review every submission to ensure accurate point distribution.
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-[#222222] to-transparent opacity-50 translate-x-12 translate-y-12 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-700 rounded-tl-[100px]" />
              </div>
            </StaggerItem>

            {/* Card 2 */}
            <StaggerItem>
              <div className="group relative w-full rounded-[24px] overflow-hidden bg-[#1A1A1A] p-8 lg:p-12 border border-[#333333] hover:border-[#FF3B00] transition-colors duration-500">
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="text-[12px] font-bold tracking-[2px] uppercase text-[#FF3B00]">02 — Performance</div>
                  <h3 className="text-[32px] lg:text-[40px] font-bold leading-[1.1] text-white">Metrics Tracking</h3>
                  <p className="text-[18px] font-light text-[#A0A0A0] leading-[1.5] max-w-md">
                    Real-time leaderboards and analytics. Compete with your peers and push the boundaries of what is possible within the society.
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-[#222222] to-transparent opacity-50 translate-x-12 translate-y-12 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-700 rounded-tl-[100px]" />
              </div>
            </StaggerItem>

            {/* Card 3 */}
            <StaggerItem>
              <div className="group relative w-full rounded-[24px] overflow-hidden bg-[#1A1A1A] p-8 lg:p-12 border border-[#333333] hover:border-[#FF3B00] transition-colors duration-500">
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="text-[12px] font-bold tracking-[2px] uppercase text-[#FF3B00]">03 — Community</div>
                  <h3 className="text-[32px] lg:text-[40px] font-bold leading-[1.1] text-white">Elite Network</h3>
                  <p className="text-[18px] font-light text-[#A0A0A0] leading-[1.5] max-w-md">
                    Connect with elite tech talent. Join a network of driven individuals all striving for technical excellence and continuous improvement.
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-[#222222] to-transparent opacity-50 translate-x-12 translate-y-12 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-700 rounded-tl-[100px]" />
              </div>
            </StaggerItem>

          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════ Metrics Section (Why Us) ═══════════ */}
      <section className="relative py-[120px] bg-[#050505] px-6 lg:px-24">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="flex flex-col items-center text-center mb-24">
            <ScaleIn initialScale={0.7} duration={0.9}>
              <h2 className="text-[64px] sm:text-[96px] lg:text-[140px] font-bold uppercase leading-[0.85] tracking-tighter text-[#1A1A1A] font-[family-name:var(--font-oswald)]">
                NUMBERS<br />DON&apos;T LIE
              </h2>
            </ScaleIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-[#222222]" staggerDelay={0.12}>
            {[
              { value: "100%", label: "System Uptime" },
              { value: "0.4s", label: "Avg Response" },
              { value: "24/7", label: "Verification" },
              { value: "50+", label: "Active Members" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-[#050505] p-12 flex flex-col items-center text-center group hover:bg-[#0A0A0A] transition-colors">
                  <div className="text-[56px] font-bold leading-[1] text-white font-[family-name:var(--font-oswald)] group-hover:text-[#FF3B00] transition-colors">
                    <CountUp target={stat.value} />
                  </div>
                  <div className="text-[12px] font-bold uppercase tracking-[2px] text-[#666666] mt-6">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════ Massive CTA Footer ═══════════ */}
      <footer className="relative bg-[#FF3B00] text-black pt-[120px] pb-[40px] px-6 lg:px-24 overflow-hidden">
        {/* Background Noise on Footer */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        <div className="relative z-10 max-w-[1440px] mx-auto w-full flex flex-col items-center text-center">
          <TextReveal
            text="LET'S WORK||TOGETHER"
            delay={0}
            staggerDelay={0.035}
            className="text-[64px] sm:text-[100px] lg:text-[160px] font-bold uppercase leading-[0.8] tracking-tighter text-black font-[family-name:var(--font-oswald)] mb-12"
          />

          <ScaleIn delay={0.3}>
            <Link
              href="/sign-up"
              className="group relative inline-flex items-center justify-center px-[48px] h-[72px] bg-black text-white text-[16px] font-bold uppercase tracking-[2px] rounded-full overflow-hidden transition-transform hover:scale-105 duration-500 mb-24"
            >
              <span className="relative z-10">Explore Opportunities</span>
              <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              <span className="absolute inset-0 z-10 flex items-center justify-center text-black translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                Explore Opportunities
              </span>
            </Link>
          </ScaleIn>

          <FadeUp delay={0.4}>
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-black/20">
              <p className="text-[14px] font-bold uppercase tracking-[1px] text-black/60">
                © {new Date().getFullYear()} AARVAK · TECH SOCIETY
              </p>
              <div className="flex items-center gap-8 text-[14px] font-bold uppercase tracking-[1px] text-black">
                <Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link>
                <Link href="/sign-up" className="hover:text-white transition-colors">Sign up</Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </footer>

    </div>
  );
}
