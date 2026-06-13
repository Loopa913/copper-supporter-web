"use client";

import { useState } from "react";
import { Users, ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Supporter } from "@/lib/data/home";
import { cn } from "@/lib/utils/cn";

type SupporterCardsProps = {
  supporters: Supporter[];
  supporterDescription?: string;
  seedPlayerDescription?: string;
};

export function SupporterCards({ supporters, supporterDescription = "서포터즈 그룹에 대한 설명입니다.", seedPlayerDescription = "시드 플레이어 그룹에 대한 설명입니다." }: SupporterCardsProps) {
  const [visibleSupporters, setVisibleSupporters] = useState(6);
  const [visibleSeedPlayers, setVisibleSeedPlayers] = useState(6);

  // 그룹별 필터링 (명시되지 않은 경우 기본값으로 서포터즈에 포함)
  const regularSupporters = supporters.filter(s => !s.group || s.group === "서포터즈");
  const seedPlayers = supporters.filter(s => s.group === "시드 플레이어");

  const renderGroup = (
    title: string, 
    description: string, 
    groupSupporters: Supporter[], 
    visibleCount: number, 
    setVisibleCount: React.Dispatch<React.SetStateAction<number>>, 
    delayOffset: number
  ) => {
    if (groupSupporters.length === 0) return null;
    
    const visibleMembers = groupSupporters.slice(0, visibleCount);
    const hasMore = visibleCount < groupSupporters.length;
    
    return (
      <div className="mt-14">
        <h3 className="mb-2 text-xl font-bold text-center text-text-primary">{title}</h3>
        <p className="mb-6 text-sm text-center text-text-secondary whitespace-pre-wrap">{description}</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleMembers.map((member, index) => {
            const CardContent = (
              <SoftCard className="flex flex-col items-center p-8 text-center h-full transition-colors hover:border-copper/30">
                {member.imageUrl && (
                  <div className="mb-4 h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border/50 bg-surface-warm shadow-sm">
                    <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                  </div>
                )}
                <h4 className="text-lg font-semibold tracking-tight text-text-primary">
                  {member.name}
                </h4>
                <p className="mt-1 text-sm font-medium text-copper">{member.role}</p>
                <p className="mt-4 text-sm font-light leading-loose text-text-secondary whitespace-pre-wrap">
                  {member.bio}
                </p>
              </SoftCard>
            );

            return (
              <FadeIn key={member.id} delay={delayOffset + index * 0.05} className="h-full">
                {member.studioLink ? (
                  <a href={member.studioLink} target="_blank" rel="noopener noreferrer" className="block h-full cursor-pointer">
                    {CardContent}
                  </a>
                ) : (
                  <div className="h-full">
                    {CardContent}
                  </div>
                )}
              </FadeIn>
            );
          })}
        </div>
        
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="btn-ghost flex items-center gap-2 px-6 py-2.5 text-sm"
            >
              멤버 더보기
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
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

        {renderGroup("서포터즈", supporterDescription, regularSupporters, visibleSupporters, setVisibleSupporters, 0)}
        {renderGroup("시드 플레이어", seedPlayerDescription, seedPlayers, visibleSeedPlayers, setVisibleSeedPlayers, regularSupporters.length * 0.05)}

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
