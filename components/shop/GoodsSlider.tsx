"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GoodsItem } from "@/lib/data/shop";
import { cn } from "@/lib/utils/cn";

const AUTOPLAY_MS = 3000;

export function GoodsSlider({ items }: { items: GoodsItem[] }) {
  const [index, setIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  
  const total = items.length;
  const item = items[index];

  const urls = item?.imageUrls?.length ? item.imageUrls : (item?.imageUrl ? [item.imageUrl] : []);
  const currentUrl = urls[imgIndex] || "";

  useEffect(() => {
    setImgIndex(0);
  }, [index]);

  useEffect(() => {
    if (total <= 1 && urls.length <= 1) return;

    const timer = setInterval(() => {
      setImgIndex((prevImgIndex) => {
        if (prevImgIndex + 1 < urls.length) {
          return prevImgIndex + 1;
        } else {
          setIndex((i) => (i + 1) % total);
          return 0;
        }
      });
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [total, urls.length]);

  if (total === 0) return null;

  return (
    <div className="relative mx-auto mt-16 max-w-2xl">
      <SoftCardShell>
        <div className="relative aspect-square overflow-hidden bg-surface-warm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-hidden"
            >
              <img
                src={currentUrl}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {urls.length > 1 && (
                <div className="absolute top-4 right-4 flex gap-1.5 z-10 rounded-full bg-black/20 p-1.5 backdrop-blur-sm">
                  {urls.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIndex(idx);
                      }}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        idx === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                      )}
                      aria-label={`${item.name} 사진 ${idx + 1} 보기`}
                    />
                  ))}
                </div>
              )}

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
                <img
                  src={g.imageUrls?.length ? g.imageUrls[0] : (g.imageUrl || "")}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
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
