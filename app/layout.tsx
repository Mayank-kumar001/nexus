import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Inter, Oswald } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { AppleNavbar } from "@/components/apple-navbar";
import { HudBackground } from "@/components/hud-background";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { PageTransition } from "@/components/ui/page-transition";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: {
    default: "AARVAK Team Dashboard",
    template: "%s · AARVAK",
  },
  description:
    "Submit, verify, and track team achievements for the AARVAK Tech Journey.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        instrumentSerif.variable,
        oswald.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col text-foreground relative bg-transparent">
        <SmoothScroll>
          <HudBackground />
          <div className="relative z-10 flex min-h-full flex-col flex-1">
            <AppleNavbar />
            <PageTransition>
              {children}
            </PageTransition>
            <Toaster />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
