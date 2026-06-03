"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { GoodsItem } from "@/lib/data/shop";
import { cn } from "@/lib/utils/cn";

const AUTOPLAY_MS = 3000;

export function GoodsSlider({ items }: { items: GoodsItem[] }) {
  const [index, setIndex] = useState(0);
  const total = items.length;
  const item = items[index];

  useEffect(() => {
    if (total <= 1) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [total]);

  if (total === 0) return null;

  return (
    <div className="relative mx-auto mt-16 max-w-4xl">
      <SoftCardShell>
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-warm sm:aspect-[21/9]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                <p className="text-xs font-medium text-white/80">
                  {index + 1} / {total}
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {item.name}
                </h3>
                <p className="mt-2 max-w-lg text-sm font-light leading-relaxed text-white/90">
                  {item.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </SoftCardShell>

      <div className="mt-6 flex items-center justify-center gap-2">
        {items.map((g, i) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300 ease-in-out",
              i === index
                ? "w-8 bg-copper"
                : "w-2 bg-border hover:bg-copper/40"
            )}
            aria-label={`${g.name} 보기`}
            aria-current={i === index}
          />
        ))}
      </div>

      {/* 썸네일 프리뷰 */}
      <ul className="mt-8 hidden gap-3 sm:grid sm:grid-cols-4">
        {items.map((g, i) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "soft-card-interactive w-full overflow-hidden p-1 transition-all duration-300",
                i === index && "ring-2 ring-copper/40 ring-offset-2"
              )}
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-warm">
                <Image
                  src={g.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
              <p className="mt-2 truncate px-1 pb-1 text-left text-xs font-medium text-text-secondary">
                {g.name}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SoftCardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg shadow-black/5">
      {children}
    </div>
  );
}
