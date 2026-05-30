"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROTOCOL_TABS, type ProtocolTabKey } from "@/lib/data/protocol";
import { FilterChipTabs } from "@/components/protocol/FilterChipTabs";
import { ProtocolItemGrid } from "@/components/protocol/ProtocolItemGrid";
import { ProtocolAccordion } from "@/components/protocol/ProtocolAccordion";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ProtocolTabs() {
  const [active, setActive] = useState<ProtocolTabKey>("quality");
  const tab = PROTOCOL_TABS[active];

  return (
    <div className="section-white px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="성장 프로토콜"
          title="서포터즈 성장 프로토콜"
          description="필터 칩으로 카테고리를 선택하고, 아코디언에서 상세 내용을 확인하세요."
          align="center"
        />

        <div className="mt-12">
          <FilterChipTabs active={active} onChange={setActive} />
        </div>

        <p className="mt-8 text-center text-sm font-light text-text-secondary">
          {tab.description}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <ProtocolItemGrid items={tab.items} />
            <ProtocolAccordion details={tab.details} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
