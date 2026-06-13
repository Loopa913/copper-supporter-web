export type RoadmapEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  tag?: string;
};

export type Supporter = {
  id: string;
  name: string;
  role: string;
  bio: string;
  group?: "서포터즈" | "시드 플레이어";
  avatarColor?: string;
  studioLink?: string;
  imageUrl?: string;
};

export const PROJECT_TAGLINE =
  "함께 만드는 스트리머 프로젝트 — 서포터즈와 함께 성장하는 RPG형 커뮤니티";

export const HERO_SUMMARY = `카퍼 서포터즈는 스트리머의 퀄리티와 인지도를 동시에 키우는
협력 프로젝트입니다. 정기 간담회, 로드맵 공유, 굿즈·위키·마크 서버까지
한곳에서 투명하게 운영됩니다.`;

export const ROADMAP_DESCRIPTION = "카퍼 포인트와 부드러운 연결선으로 이어지는 모던 타임라인입니다.";

export const ROADMAP_EVENTS: RoadmapEvent[] = [
  {
    id: "1",
    date: "2025.03",
    title: "프로젝트 킥오프",
    description: "서포터즈 모집 및 비전 공유 간담회",
    status: "completed",
    tag: "시작",
  },
  {
    id: "2",
    date: "2025.05",
    title: "마크 서버 오픈",
    description: "카퍼 위키 베타와 함께 커뮤니티 허브 구축",
    status: "completed",
    tag: "인프라",
  },
  {
    id: "3",
    date: "2025.08",
    title: "콘텐츠 이벤트 시즌",
    description: "협업 방송·게임 대회·로열티 지원 론칭",
    status: "current",
    tag: "진행중",
  },
  {
    id: "4",
    date: "2025.11",
    title: "굿즈 1차 라인업",
    description: "일러스트·굿즈 제작 지원 및 샵 오픈",
    status: "upcoming",
    tag: "굿즈",
  },
  {
    id: "5",
    date: "2025.12",
    title: "연말 팝업스토어",
    description: "오프라인 팝업 & 팬 미팅",
    status: "upcoming",
    tag: "오프라인",
  },
  {
    id: "6",
    date: "2026.02",
    title: "성장 프로토콜 v2",
    description: "인지도·퀄리티 목표 확장 및 리뉴얼",
    status: "upcoming",
    tag: "로드맵",
  },
];

export const SUPPORTERS_DESCRIPTION = "서포터즈 그룹에 대한 설명입니다.";
export const SEED_PLAYERS_DESCRIPTION = "시드 플레이어 그룹에 대한 설명입니다.";
export const SUPPORTER_SECTION_DESCRIPTION = "스트리머 프로젝트와 함께하는 그룹 멤버들입니다.";

export const SUPPORTERS: Supporter[] = [
  {
    id: "1",
    name: "카퍼",
    role: "스트리머 / 프로젝트 리드",
    bio: "서포터즈와 함께 성장하는 메인 스트리머",
    group: "서포터즈",
  },
  {
    id: "2",
    name: "루나",
    role: "콘텐츠 기획",
    bio: "이벤트·방송 일정 및 로드맵 운영",
    group: "서포터즈",
  },
  {
    id: "3",
    name: "아크",
    role: "마크 서버 운영",
    bio: "서버·위키 인프라 및 기술 지원",
    group: "서포터즈",
  },
  {
    id: "4",
    name: "미라",
    role: "굿즈·디자인",
    bio: "일러스트·굿즈 라인업 큐레이션",
    group: "시드 플레이어",
  },
  {
    id: "5",
    name: "제로",
    role: "커뮤니티",
    bio: "서포터즈 소통·간담회 진행",
    group: "시드 플레이어",
  },
  {
    id: "6",
    name: "세이지",
    role: "미디어",
    bio: "영상·SNS·홍보 콘텐츠 제작",
    group: "시드 플레이어",
  },
];
