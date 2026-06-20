"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  getVisibleProtocolDetails,
  hasProtocolDetailContent,
  isProtocolImageUrl,
  type ProtocolDetail,
} from "@/lib/data/protocol";
import { cn } from "@/lib/utils/cn";

type ProtocolAccordionProps = {
  details: ProtocolDetail[];
};

export function ProtocolAccordion({ details }: ProtocolAccordionProps) {
  const visibleDetails = useMemo(() => getVisibleProtocolDetails(details), [details]);
  const [openId, setOpenId] = useState<string | null>(visibleDetails[0]?.id ?? null);

  if (!hasProtocolDetailContent(details)) {
    return null;
  }

  return (
    <div className="mt-16">
      <h3 className="text-lg font-semibold tracking-tight text-text-primary">
        상세 안내
      </h3>
      <ul className="mt-6 space-y-3">
        {visibleDetails.map((detail) => {
          const isOpen = openId === detail.id;
          const imageUrl = isProtocolImageUrl(detail.imageHint) ? detail.imageHint!.trim() : null;

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
                      {detail.body.trim() && (
                        <p className="text-sm font-light leading-loose text-text-secondary whitespace-pre-wrap">
                          {detail.body}
                        </p>
                      )}
                      {imageUrl && (
                        <div className={cn(detail.body.trim() && "mt-4")}>
                          <img
                            src={imageUrl}
                            alt={detail.title || "상세 안내 이미지"}
                            className="max-h-[420px] w-full rounded-2xl border border-border object-contain"
                          />
                        </div>
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
