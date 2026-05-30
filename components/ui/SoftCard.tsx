"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type SoftCardProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
};

export function SoftCard({
  children,
  interactive = true,
  className,
  ...props
}: SoftCardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        interactive ? "soft-card-interactive" : "soft-card",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
