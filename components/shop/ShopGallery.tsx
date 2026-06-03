"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { GoodsSlider } from "@/components/shop/GoodsSlider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import type { ShopContent } from "@/lib/cms/shop-content";

export function ShopGallery({ content }: { content: ShopContent }) {
  const intro = content.intro;
  const cta = content.cta;
  return (
    <div className="section-white px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="굿즈 제작 지원"
          title={intro.title}
          description={intro.description}
          align="center"
        />

        <FadeIn className="mx-auto mt-10 max-w-2xl">
          <p className="soft-card p-6 text-center text-sm font-light leading-loose text-text-secondary whitespace-pre-wrap">
            {intro.supportNote}
          </p>
        </FadeIn>

        <GoodsSlider items={content.goods} />

        <FadeIn className="mt-16 text-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-copper inline-flex gap-2 px-10 py-4 text-base"
            >
              {cta.label}
              <ExternalLink className="h-5 w-5" />
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </div>
  );
}
