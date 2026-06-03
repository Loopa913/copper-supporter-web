export type WikiCategory = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  children?: WikiCategory[];
};

export type WikiPage = {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  parentSlug?: string;
  excerpt: string;
  content?: string;
};

export const WIKI_CATEGORIES: WikiCategory[] = [
  {
    id: "1",
    title: "시작하기",
    slug: "getting-started",
    children: [
      { id: "1-1", title: "서버 접속", slug: "join-server" },
      { id: "1-2", title: "규칙 요약", slug: "rules" },
    ],
  },
  {
    id: "2",
    title: "월드 가이드",
    slug: "world",
    children: [
      { id: "2-1", title: "스폰 & NPC", slug: "spawn-npc" },
      { id: "2-2", title: "던전", slug: "dungeons" },
    ],
  },
  {
    id: "3",
    title: "서포터즈",
    slug: "supporters",
    children: [{ id: "3-1", title: "FAQ", slug: "faq" }],
  },
];

export const WIKI_PAGES: WikiPage[] = [
  {
    id: "p1",
    slug: "join-server",
    title: "서버 접속 방법",
    categorySlug: "getting-started",
    excerpt: "런처 버전, IP, 화이트리스트 안내가 이 문서에 들어갑니다.",
  },
  {
    id: "p2",
    slug: "rules",
    title: "커뮤니티 규칙",
    categorySlug: "getting-started",
    excerpt: "채팅·건설·PVP 관련 기본 규칙 요약.",
  },
  {
    id: "p3",
    slug: "spawn-npc",
    title: "스폰 & NPC",
    categorySlug: "world",
    excerpt: "스폰 위치, 상점 NPC, 퀘스트 허브 설명.",
  },
];

export const DEFAULT_WIKI_SLUG = "join-server";
