"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ProtocolDetail } from "@/lib/data/protocol";
import { cn } from "@/lib/utils/cn";

type ProtocolAccordionProps = {
  details: ProtocolDetail[];
};

export function ProtocolAccordion({ details }: ProtocolAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(details[0]?.id ?? null);

  return (
    <div className="mt-16">
      <h3 className="text-lg font-semibold tracking-tight text-text-primary">
        상세 안내
      </h3>
      <ul className="mt-6 space-y-3">
        {details.map((detail) => {
          const isOpen = openId === detail.id;

          return (
            <li key={detail.id} className="soft-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : detail.id)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-300 hover:bg-surface-warm"
                aria-expanded={isOpen}
              >
                <span className="font-semibold tracking-tight text-text-primary">
                  {detail.title}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-text-muted transition-transform duration-300",
                    isOpen && "rotate-180 text-copper"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border px-6 pb-6 pt-2">
                      <p className="text-sm font-light leading-loose text-text-secondary whitespace-pre-wrap">
                        {detail.body}
                      </p>
                      {detail.imageHint && (
                        <p className="mt-4 rounded-2xl border border-dashed border-border bg-surface-warm px-4 py-10 text-center text-xs font-light text-text-muted">
                          {detail.imageHint}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
