"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type GlowCardProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  className?: string;
  glowColor?: "purple" | "cyan" | "gold";
};

const glassVariants = {
  purple: "glass-card",
  cyan: "glass-card glass-card-cyan",
  gold: "glass-card glass-card-gold",
};

const hoverGlow = {
  purple:
    "hover:shadow-[0_0_0_1px_rgba(167,139,250,0.5),0_0_40px_rgba(139,92,246,0.35),0_0_60px_rgba(34,211,238,0.1)]",
  cyan: "hover:shadow-[0_0_0_1px_rgba(103,232,249,0.5),0_0_40px_rgba(34,211,238,0.3),0_0_50px_rgba(139,92,246,0.1)]",
  gold: "hover:shadow-[0_0_0_1px_rgba(251,191,36,0.45),0_0_36px_rgba(251,191,36,0.2),0_0_48px_rgba(139,92,246,0.08)]",
};

export function GlowCard({
  children,
  className,
  glowColor = "purple",
  ...props
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        glassVariants[glowColor],
        "transition-shadow duration-300",
        hoverGlow[glowColor],
        className
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-glow-purple/5 via-transparent to-glow-cyan/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      {children}
    </motion.div>
  );
}
