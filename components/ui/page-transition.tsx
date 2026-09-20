"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const ease = [0.22, 1, 0.36, 1] as const;

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, filter: "blur(8px)", scale: 0.98, y: 15 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
        exit={{ opacity: 0, filter: "blur(8px)", scale: 1.02, y: -15 }}
        transition={{ duration: 0.5, ease }}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
