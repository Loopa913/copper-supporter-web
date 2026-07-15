import type { PortalElementsMap } from "@blocknote/react";

export const WIKI_BLOCKNOTE_PORTAL_ID = "wiki-blocknote-portals";

/** 위키 에디터 위에 뜨는 BlockNote floating UI 전용 레이어 */
export const WIKI_BLOCKNOTE_PORTAL_ELEMENTS: PortalElementsMap = {
  formattingToolbar: `#${WIKI_BLOCKNOTE_PORTAL_ID}`,
  linkToolbar: `#${WIKI_BLOCKNOTE_PORTAL_ID}`,
  slashMenu: `#${WIKI_BLOCKNOTE_PORTAL_ID}`,
  emojiPicker: `#${WIKI_BLOCKNOTE_PORTAL_ID}`,
  sideMenu: `#${WIKI_BLOCKNOTE_PORTAL_ID}`,
  filePanel: `#${WIKI_BLOCKNOTE_PORTAL_ID}`,
  tableHandles: `#${WIKI_BLOCKNOTE_PORTAL_ID}`,
};
