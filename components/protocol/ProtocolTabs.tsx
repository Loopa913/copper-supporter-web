"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, ArrowDown } from "lucide-react";
import type { ProtocolTabKey } from "@/lib/data/protocol";
import { FilterChipTabs } from "@/components/protocol/FilterChipTabs";
import { ProtocolItemGrid } from "@/components/protocol/ProtocolItemGrid";
import { ProtocolAccordion } from "@/components/protocol/ProtocolAccordion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageNavigation } from "@/components/ui/PageNavigation";
import { FadeIn } from "@/components/ui/FadeIn";
import type { ProtocolContent } from "@/lib/cms/protocol-content";

export function ProtocolTabs({ content }: { content: ProtocolContent }) {
  const [active, setActive] = useState<ProtocolTabKey>("awareness");
  const tab = content.tabs[active];

  return (
    <div className="section-white px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section 1: 프로젝트 프로세스 */}
        <SectionHeader
          eyebrow="스트리머 지원 프로토콜"
          title="프로젝트 프로세스"
          description={content.processSectionDescription}
          align="center"
        />

        <div className="mt-12 mb-24 text-center">
          {content.processImageUrl && (
            <div className="mb-12 flex justify-center">
              <img
                src={content.processImageUrl}
                alt="프로젝트 프로세스"
                className="max-h-[400px] w-auto rounded-2xl object-contain shadow-lg border border-border"
              />
            </div>
          )}

          {/* 프로세스 순서도 다중 트랙 영역 */}
          {content.processTracks && content.processTracks.length > 0 && (
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-center">
              {content.processTracks.map((track) => (
                <div key={track.id} className="flex flex-col items-center flex-1 w-full max-w-sm mx-auto">
                  <div className="mb-4 text-sm font-semibold text-copper/80 tracking-widest h-5">
                    {track.parentGroup ? `[ ${track.parentGroup} ]` : ""}
                  </div>
                  <div className="soft-card w-full px-6 py-4 text-center mb-6 border-copper/30 bg-copper/5">
                    <h3 className="text-lg font-bold text-copper tracking-tight">{track.title}</h3>
                  </div>
                  
                  <div className="flex flex-col gap-4 w-full">
                    {track.steps.map((step, stepIdx) => (
                      <div key={step.id} className="flex flex-col items-center">
                        <div className="soft-card w-full px-6 py-4 text-center transition-all hover:border-copper/40 flex items-center justify-center min-h-[80px]">
                          <p className="text-sm font-medium text-text-primary whitespace-pre-wrap leading-relaxed">
                            {step.title}
                          </p>
                        </div>
                        {stepIdx < track.steps.length - 1 && (
                          <ArrowDown className="mt-4 text-copper/40 h-5 w-5 animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: 스트리머 지원 프로토콜 */}
        <div className="pt-24 border-t border-border/50">
          <SectionHeader
            title="스트리머 지원 프로토콜"
            description={content.protocolSectionDescription}
            align="center"
          />

          <div className="mt-12 text-center">
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

        <FadeIn className="mt-20">
          {content.recruitingBoxLink ? (
            <a href={content.recruitingBoxLink} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
              <div className="soft-card flex items-center justify-center gap-2 border-dashed py-8 text-sm font-medium text-copper transition-colors hover:border-copper/40 hover:bg-copper/5">
                <Users className="h-5 w-5" />
                {content.recruitingBoxText}
              </div>
            </a>
          ) : (
            <div className="soft-card flex items-center justify-center gap-2 border-dashed py-8 text-sm font-light text-text-muted">
              <Users className="h-4 w-4 text-copper" />
              {content.recruitingBoxText}
            </div>
          )}
        </FadeIn>

        <PageNavigation 
          prev={{ title: "프로젝트 소개", href: "/" }}
          next={{ title: "굿즈 제작 지원", href: "/shop" }}
        />
      </div>
    </div>
  );
}
