import type { HomeContent } from "@/lib/cms/types";
import { HeroSection } from "@/components/home/HeroSection";
import { ModernRoadmap } from "@/components/home/ModernRoadmap";
import { SupporterCards } from "@/components/home/SupporterCards";

type ProjectIntroProps = {
  content: HomeContent;
};

/** 서버 컴포넌트 — 인터랙션은 하위 클라이언트 컴포넌트에서 처리 */
export function ProjectIntro({ content }: ProjectIntroProps) {
  return (
    <>
      <HeroSection
        tagline={content.tagline}
        heroSummary={content.heroSummary}
        videoId={content.videoId}
      />
      <ModernRoadmap events={content.roadmapEvents} />
      <SupporterCards supporters={content.supporters} />
    </>
  );
}
