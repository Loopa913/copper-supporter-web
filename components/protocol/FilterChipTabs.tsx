"use client";

import { cn } from "@/lib/utils/cn";
import type { ProtocolTabKey } from "@/lib/data/protocol";
import type { ProtocolContent } from "@/lib/cms/protocol-content";

const TAB_KEYS: ProtocolTabKey[] = ["awareness", "quality"];

type FilterChipTabsProps = {
  active: ProtocolTabKey;
  onChange: (key: ProtocolTabKey) => void;
  tabs: ProtocolContent["tabs"];
};

export function FilterChipTabs({ active, onChange, tabs }: FilterChipTabsProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-3"
      role="tablist"
      aria-label="스트리머 지원 프로토콜 카테고리"
    >
      {TAB_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className={cn(
            "chip",
            active === key && "chip-active"
          )}
        >
          {tabs[key].label}
        </button>
      ))}
    </div>
  );
}
