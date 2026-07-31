import type { PortalElementsMap } from "@blocknote/react";

/** 
 * BlockNote floating UI를 document.body로 보내 
 * 위키 스크롤/overflow stacking 문제를 피합니다. 
 */
export const WIKI_BLOCKNOTE_PORTAL_ELEMENTS: PortalElementsMap = {
  default: null,
  formattingToolbar: null,
  linkToolbar: null,
  slashMenu: null,
  emojiPicker: null,
  sideMenu: ".wiki-blocknote .bn-container", // 사이드 메뉴는 에디터 내부에 두어 hover 브리지가 끊기지 않게 함
  filePanel: null,
  tableHandles: null,
  comments: null,
};
