"use client";

import { cn } from "@/lib/utils/cn";
import type { ProtocolTabKey } from "@/lib/data/protocol";
import { PROTOCOL_TABS } from "@/lib/data/protocol";

const TAB_KEYS: ProtocolTabKey[] = ["quality", "awareness"];

type FilterChipTabsProps = {
  active: ProtocolTabKey;
  onChange: (key: ProtocolTabKey) => void;
};

export function FilterChipTabs({ active, onChange }: FilterChipTabsProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-3"
      role="tablist"
      aria-label="성장 프로토콜 카테고리"
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
          {PROTOCOL_TABS[key].label}
        </button>
      ))}
    </div>
  );
}
