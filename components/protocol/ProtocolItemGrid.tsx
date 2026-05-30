"use client";

import { motion } from "framer-motion";
import { SoftCard } from "@/components/ui/SoftCard";
import type { ProtocolItem } from "@/lib/data/protocol";

type ProtocolItemGridProps = {
  items: ProtocolItem[];
};

export function ProtocolItemGrid({ items }: ProtocolItemGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <SoftCard className="p-6">
            <span className="text-xs font-medium text-copper">프로그램</span>
            <h3 className="mt-2 font-semibold tracking-tight text-text-primary">
              {item.title}
            </h3>
            <p className="mt-2 text-sm font-light leading-loose text-text-secondary">
              {item.summary}
            </p>
          </SoftCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
