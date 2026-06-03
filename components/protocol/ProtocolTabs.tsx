"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProtocolTabKey } from "@/lib/data/protocol";
import { FilterChipTabs } from "@/components/protocol/FilterChipTabs";
import { ProtocolItemGrid } from "@/components/protocol/ProtocolItemGrid";
import { ProtocolAccordion } from "@/components/protocol/ProtocolAccordion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ProtocolContent } from "@/lib/cms/protocol-content";

export function ProtocolTabs({ content }: { content: ProtocolContent }) {
  const [active, setActive] = useState<ProtocolTabKey>("awareness");
  const tab = content.tabs[active];

  return (
    <div className="section-white px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="스트리머 지원 프로토콜"
          title="서포터즈 스트리머 지원 프로토콜"
          description="필터 칩으로 카테고리를 선택하고, 아코디언에서 상세 내용을 확인하세요."
          align="center"
        />

        <div className="mt-12 text-center">
          {content.processImageUrl && (
            <div className="mb-12 flex justify-center">
              <img
                src={content.processImageUrl}
                alt="프로젝트 프로세스"
                className="max-h-[400px] w-auto rounded-2xl object-contain shadow-lg border border-border"
              />
            </div>
          )}
          <FilterChipTabs active={active} onChange={setActive} tabs={content.tabs} />
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
