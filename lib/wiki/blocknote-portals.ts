import type { PortalElementsMap } from "@blocknote/react";

/** BlockNote floating UI를 document.body로 보내 위키 스크롤/overflow stacking 문제를 피합니다. */
export const WIKI_BLOCKNOTE_PORTAL_ELEMENTS: PortalElementsMap = {
  default: null,
  formattingToolbar: null,
  linkToolbar: null,
  slashMenu: null,
  emojiPicker: null,
  sideMenu: null,
  filePanel: null,
  tableHandles: null,
  comments: null,
};
