import type { RoadmapEvent, Supporter } from "@/lib/data/home";

export type HeroContent = {
  tagline: string;
  summary: string;
  videoId: string;
};

export type HomeContent = {
  tagline: string;
  heroSummary: string;
  videoId: string;
  roadmapDescription: string;
  roadmapEvents: RoadmapEvent[];
  supporterDescription: string;
  seedPlayerDescription: string;
  supporters: Supporter[];
};

export type SiteContentRow = {
  section: string;
  key: string;
  value: unknown;
};
