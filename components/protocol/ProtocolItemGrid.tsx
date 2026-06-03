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
      className="mt-10 flex flex-wrap justify-center gap-5"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
        >
          <SoftCard className="h-full p-6">
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
