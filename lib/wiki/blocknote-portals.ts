import type { PortalElementsMap } from "@blocknote/react";

export const WIKI_BLOCKNOTE_PORTAL_ELEMENTS: PortalElementsMap = {
  // Use BlockNote's default mounting behavior (inside bn-container).
  // Custom overriding with document.body or a dedicated div breaks
  // certain floating elements and extensions depending on DOM hierarchy.
};
