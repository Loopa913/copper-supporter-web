"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <FadeIn
      className={cn(
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-medium tracking-wide text-copper">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base font-light leading-loose text-text-secondary whitespace-pre-wrap">
          {description}
        </p>
      )}
    </FadeIn>
  );
}
