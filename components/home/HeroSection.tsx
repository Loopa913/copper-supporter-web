"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import type { HomeContent } from "@/lib/cms/types";

type HeroSectionProps = Pick<HomeContent, "tagline" | "heroSummary" | "videoId">;

export function HeroSection({ tagline, heroSummary, videoId }: HeroSectionProps) {
  return (
    <section className="section-white px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <p className="text-sm font-medium tracking-wide text-copper">
            공식 프로젝트 · Supporter Project
          </p>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-[2.75rem]">
            함께 만드는
            <br />
            <span className="text-copper">스트리머 프로젝트</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-loose text-text-secondary">
            {tagline}
          </p>
          <p className="soft-card mx-auto mt-8 max-w-2xl p-6 text-left text-sm font-light leading-loose text-text-secondary sm:text-base whitespace-pre-wrap">
            {heroSummary}
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-16">
          <div className="soft-card overflow-hidden p-2">
            <p className="mb-3 text-xs font-medium text-text-muted">
              프로젝트 소개 영상
            </p>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-warm">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title="프로젝트 소개 영상"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
