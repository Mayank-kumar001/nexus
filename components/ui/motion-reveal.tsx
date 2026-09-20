"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, Variants, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────── shared defaults ─────────────────────── */

const defaultViewport = { once: true, margin: "-80px" as any };
const ease = [0.22, 1, 0.36, 1] as const; // custom ease-out expo

/* ═══════════════════════════ FadeUp ═══════════════════════════════ */

interface FadeUpProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  y?: number;
}

export function FadeUp({
  children,
  delay = 0,
  duration = 0.7,
  className,
  y = 40,
  ...rest
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease }}
      viewport={defaultViewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════ FadeIn ═══════════════════════════════ */

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  className,
  ...rest
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration, delay, ease }}
      viewport={defaultViewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════ SlideInLeft ══════════════════════════ */

interface SlideProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
}

export function SlideInLeft({
  children,
  delay = 0,
  duration = 0.8,
  className,
  distance = 60,
  ...rest
}: SlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -distance }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration, delay, ease }}
      viewport={defaultViewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════ SlideInRight ═════════════════════════ */

export function SlideInRight({
  children,
  delay = 0,
  duration = 0.8,
  className,
  distance = 60,
  ...rest
}: SlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: distance }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration, delay, ease }}
      viewport={defaultViewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════ ScaleIn ══════════════════════════════ */

interface ScaleInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  initialScale?: number;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.7,
  className,
  initialScale = 0.85,
  ...rest
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease }}
      viewport={defaultViewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════ StaggerContainer + Item ═════════════════ */

interface StaggerContainerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
}

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export function StaggerContainer({
  children,
  staggerDelay = 0.15,
  delayChildren = 0.1,
  className,
  ...rest
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className, ...rest }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.6, ease },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════ TextReveal ═══════════════════════════ */

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}

export function TextReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.03,
  as: Tag = "h2",
}: TextRevealProps) {
  // Split text into lines (by <br/> marker "||") then chars
  const lines = text.split("||");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      className={cn("overflow-hidden", className)}
    >
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block overflow-hidden">
          {line.split("").map((char, charIdx) => {
            const globalIdx =
              lines.slice(0, lineIdx).reduce((a, l) => a + l.length, 0) + charIdx;
            return (
              <motion.span
                key={`${lineIdx}-${charIdx}`}
                className="inline-block"
                style={{ whiteSpace: char === " " ? "pre" : undefined }}
                variants={{
                  hidden: {
                    y: "100%",
                    opacity: 0,
                  },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.5,
                      delay: delay + globalIdx * staggerDelay,
                      ease,
                    },
                  },
                }}
              >
                {char}
              </motion.span>
            );
          })}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════ CountUp ══════════════════════════════ */

interface CountUpProps {
  /** The target display string, e.g. "100%", "0.4s", "24/7", "50+" */
  target: string;
  className?: string;
  duration?: number;
}

export function CountUp({ target, className, duration = 2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Extract the numeric portion and the suffix
    const match = target.match(/^([\d.]+)(.*)$/);
    if (!match) {
      setDisplay(target);
      return;
    }

    const endNum = parseFloat(match[1]);
    const suffix = match[2];
    const isDecimal = match[1].includes(".");
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = eased * endNum;

      if (isDecimal) {
        setDisplay(current.toFixed(1) + suffix);
      } else {
        setDisplay(Math.round(current) + suffix);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  // Special case for non-numeric targets like "24/7"
  const isNonNumeric = !/^[\d.]/.test(target);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease }}
      viewport={defaultViewport}
      className={className}
    >
      {isNonNumeric ? (isInView ? target : "") : display}
    </motion.span>
  );
}

/* ═══════════════════════════ BlurReveal ═══════════════════════════ */

interface BlurRevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function BlurReveal({
  children,
  delay = 0,
  className,
  ...rest
}: BlurRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(12px)", y: 10 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.8, delay, ease }}
      viewport={defaultViewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
