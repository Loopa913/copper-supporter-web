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
  return (
    <section
      id="supporters"
      className="section-white px-5 py-24 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="참여 인원"
          title="서포터즈를 소개합니다"
          description="둥근 프로필과 직관적인 정보로 구성했습니다."
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supporters.map((member, index) => (
            <FadeIn key={member.id} delay={index * 0.05}>
              <SoftCard className="flex flex-col items-center p-8 text-center">
                <div
                  className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold text-white shadow-lg shadow-black/10",
                    member.avatarColor
                  )}
                >
                  {member.name.charAt(0)}
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-text-primary">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-copper">{member.role}</p>
                <p className="mt-4 text-sm font-light leading-loose text-text-secondary">
                  {member.bio}
                </p>
              </SoftCard>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12">
          <div className="soft-card flex items-center justify-center gap-2 border-dashed py-8 text-sm font-light text-text-muted">
            <Users className="h-4 w-4 text-copper" />
            서포터즈 모집은 정기 간담회 안내를 통해 진행됩니다.
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
