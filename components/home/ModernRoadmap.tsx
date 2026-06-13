"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import type { RoadmapEvent } from "@/lib/data/home";
import { cn } from "@/lib/utils/cn";

const statusDot: Record<RoadmapEvent["status"], string> = {
  completed: "bg-copper ring-4 ring-copper/20",
  current: "bg-copper-dark ring-4 ring-copper/30 scale-110",
  upcoming: "bg-white border-2 border-copper/40 ring-4 ring-copper/10",
};

type ModernRoadmapProps = {
  description?: string;
  events: RoadmapEvent[];
};

export function ModernRoadmap({ description = "카퍼 포인트와 부드러운 연결선으로 이어지는 모던 타임라인입니다.", events }: ModernRoadmapProps) {
  return (
    <section
      id="roadmap"
      className="section-warm px-5 py-24 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="일정"
          title="프로젝트 로드맵"
          description={description}
          align="center"
        />

        <ol className="relative mt-16 space-y-0">
          {/* 중앙 연결선 */}
          <span
            className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-copper/50 via-copper/25 to-transparent sm:left-1/2 sm:-ml-px"
            aria-hidden
          />

          {events.map((event, index) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={cn(
                "relative flex gap-6 pb-14 sm:gap-0",
                index % 2 === 0
                  ? "sm:flex-row sm:items-start"
                  : "sm:flex-row-reverse sm:items-start"
              )}
            >
              {/* 도트 */}
              <div className="relative z-10 flex shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                <span
                  className={cn(
                    "block h-4 w-4 rounded-full transition-transform duration-300",
                    statusDot[event.status]
                  )}
                />
              </div>

              <div
                className={cn(
                  "min-w-0 flex-1 sm:w-[calc(50%-2.5rem)]",
                  index % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12 sm:text-left"
                )}
              >
                <SoftCard className="p-6 text-left">
                  <span className="text-xs font-medium text-copper">
                    {event.date}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-text-primary">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-loose text-text-secondary">
                    {event.description}
                  </p>
                  {event.tag && (
                    <span className="mt-3 inline-block rounded-full bg-copper-muted px-3 py-1 text-xs font-medium text-copper">
                      {event.tag}
                    </span>
                  )}
                </SoftCard>
              </div>

              {/* 모바일용 오른쪽 여백 */}
              <div className="hidden w-4 sm:block sm:w-0" />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
