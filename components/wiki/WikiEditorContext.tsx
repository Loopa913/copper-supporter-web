"use client";

import { createContext, useContext } from "react";
import type { WikiNavItem } from "@/lib/wiki/nav-items";

type WikiEditorContextValue = {
  navItems: WikiNavItem[];
  onNavigate: (slug: string) => void;
  editable: boolean;
};

export const WikiEditorContext = createContext<WikiEditorContextValue | null>(null);

export function useWikiEditorContext() {
  const context = useContext(WikiEditorContext);
  if (!context) {
    throw new Error("useWikiEditorContext must be used within WikiEditorContext.Provider");
  }
  return context;
}
