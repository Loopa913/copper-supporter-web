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
import { SoftCard } from "@/components/ui/SoftCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils/cn";
import type { ProtocolContent } from "@/lib/cms/protocol-content";

export function ProtocolTabs({ content }: { content: ProtocolContent }) {
  const [active, setActive] = useState<ProtocolTabKey>("awareness");
  const tab = content.tabs[active];

  // 트랙(Track)용 상태
  const [activeTrackId, setActiveTrackId] = useState<string>(content.processTracks?.[0]?.id || "");
  const activeTrack = content.processTracks?.find(t => t.id === activeTrackId) || content.processTracks?.[0];

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
            <div className="flex flex-col items-center">
              {/* 트랙 필터 칩 */}
              <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
                {content.processTracks.map((track) => {
                  const isActive = activeTrack?.id === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => setActiveTrackId(track.id)}
                      className={cn(
                        "chip",
                        isActive && "chip-active"
                      )}
                    >
                      {track.title}
                    </button>
                  );
                })}
              </div>

              {/* 활성화된 트랙의 스텝 (로드맵 스타일 넓은 카드) */}
              {activeTrack && activeTrack.steps && activeTrack.steps.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTrack.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-3xl space-y-6 text-left relative"
                  >
                    {activeTrack.steps.map((step, idx) => (
                      <div key={step.id} className="relative">
                        {/* 연결선 (마지막 항목 제외) */}
                        {idx < activeTrack.steps.length - 1 && (
                          <div className="absolute left-8 top-16 bottom-[-24px] w-px bg-copper/30 sm:left-10" />
                        )}
                        
                        <SoftCard className="relative z-10 flex flex-col sm:flex-row gap-6 p-6 sm:p-8 transition-colors hover:border-copper/30">
                          <div className="flex shrink-0 items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-copper-muted border-2 border-copper/20 shadow-inner">
                            <span className="text-xl sm:text-2xl font-bold text-copper">{idx + 1}</span>
                          </div>
                          <div className="flex-1 space-y-2 flex flex-col justify-center">
                            <h4 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                              {step.title}
                            </h4>
                            {step.description && (
                              <p className="text-sm sm:text-base font-light leading-relaxed text-text-secondary whitespace-pre-wrap">
                                {step.description}
                              </p>
                            )}
                          </div>
                        </SoftCard>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
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
