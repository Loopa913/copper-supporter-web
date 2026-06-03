"use client";

import { Users } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Supporter } from "@/lib/data/home";
import { cn } from "@/lib/utils/cn";

type SupporterCardsProps = {
  supporters: Supporter[];
};

export function SupporterCards({ supporters }: SupporterCardsProps) {
  // 그룹별 필터링 (명시되지 않은 경우 기본값으로 서포터즈에 포함)
  const regularSupporters = supporters.filter(s => !s.group || s.group === "서포터즈");
  const seedPlayers = supporters.filter(s => s.group === "시드 플레이어");

  const renderGroup = (title: string, groupSupporters: Supporter[], delayOffset: number) => {
    if (groupSupporters.length === 0) return null;
    
    return (
      <div className="mt-14">
        <h3 className="mb-6 text-xl font-bold text-center text-text-primary">{title}</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groupSupporters.map((member, index) => (
            <FadeIn key={member.id} delay={delayOffset + index * 0.05}>
              <SoftCard className="flex flex-col items-center p-8 text-center">
                <h4 className="text-lg font-semibold tracking-tight text-text-primary">
                  {member.name}
                </h4>
                <p className="mt-1 text-sm font-medium text-copper">{member.role}</p>
                <p className="mt-4 text-sm font-light leading-loose text-text-secondary">
                  {member.bio}
                </p>
              </SoftCard>
            </FadeIn>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section
      id="supporters"
      className="section-white px-5 py-24 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="서포터즈 및 시드 플레이어"
          title="참여 멤버를 소개합니다"
          description="스트리머 프로젝트와 함께하는 그룹 멤버들입니다."
          align="center"
        />

        {renderGroup("서포터즈", regularSupporters, 0)}
        {renderGroup("시드 플레이어", seedPlayers, regularSupporters.length * 0.05)}

        <FadeIn className="mt-16">
          <div className="soft-card flex items-center justify-center gap-2 border-dashed py-8 text-sm font-light text-text-muted">
            <Users className="h-4 w-4 text-copper" />
            멤버 모집은 정기 간담회 안내를 통해 진행됩니다.
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
