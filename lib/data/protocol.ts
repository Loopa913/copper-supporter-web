export type ProtocolItem = {
  id: string;
  title: string;
  summary: string;
};

export type ProtocolDetail = {
  id: string;
  title: string;
  body: string;
  imageHint?: string;
};

export const RECRUITING_BOX_TEXT = "멤버 모집은 정기 간담회 안내를 통해 진행됩니다.";
export const RECRUITING_BOX_LINK = "";

export const PROCESS_SECTION_DESCRIPTION = "스트리머 프로젝트와 함께하는 성장 프로세스입니다.";
export const PROTOCOL_SECTION_DESCRIPTION = "필터 칩으로 카테고리를 선택하고, 아코디언에서 상세 내용을 확인하세요.";

export type ProcessTrackStep = {
  id: string;
  title: string;
  description?: string;
};

export type ProcessTrack = {
  id: string;
  title: string;
  parentGroup?: string;
  steps: ProcessTrackStep[];
};

export const PROTOCOL_PROCESS_TRACKS: ProcessTrack[] = [
  {
    id: "t2",
    parentGroup: "프로젝트 지원자",
    title: "서포터즈",
    steps: [
      { id: "s2-1", title: "튜토리얼 및 가이드라인 진행", description: "활동을 위한 기본 튜토리얼과 가이드라인을 확인합니다." },
      { id: "s2-2", title: "성장협약서 작성", description: "상호 성장 목표를 설정하고 협약서를 작성합니다." },
      { id: "s2-3", title: "체크리스트 및 활동 보고서 진행", description: "정기적인 체크리스트 달성 및 활동 보고서를 통해 성장을 기록합니다." },
      { id: "s2-4", title: "로열티 및 프로젝트 지원 계약서 작성", description: "일정 기준 달성 시 로열티 지급 및 정식 계약을 체결합니다." },
    ],
  },
  {
    id: "t3",
    parentGroup: "프로젝트 지원자",
    title: "시드 플레이어",
    steps: [
      { id: "s3-1", title: "튜토리얼 및 시드 퀘스트 진행", description: "시드 플레이어 전용 튜토리얼과 초기 퀘스트를 수행합니다." },
      { id: "s3-2", title: "컨텐츠 지원안내", description: "기획 및 제작에 필요한 지원 항목과 범위를 안내받습니다." },
      { id: "s3-3", title: "컨텐츠 활동 진행", description: "기획된 컨텐츠를 바탕으로 본격적인 방송 및 활동을 진행합니다." },
      { id: "s3-4", title: "서포터즈 성장 지원", description: "서포터즈의 성장을 돕고 커뮤니티 활성화에 기여합니다." },
    ],
  },
  {
    id: "t1",
    title: "일반 스트리머",
    steps: [
      { id: "s1-1", title: "컨텐츠 / 이벤트 참여", description: "커뮤니티 내의 다양한 컨텐츠와 이벤트에 자유롭게 참여할 수 있습니다." }
    ],
  },
];

export const PROTOCOL_TABS = {
  awareness: {
    label: "스트리머 인지도",
    description: "오프라인·굿즈·홍보 확장",
    items: [
      { id: "a1", title: "팝업스토어", summary: "연말 오프라인 팝업 & 팬 미팅" },
      { id: "a2", title: "일러스트", summary: "캐릭터·키비주얼 제작 지원" },
      { id: "a3", title: "개인광고", summary: "SNS·영상 광고 캠페인" },
      { id: "a4", title: "개인 서버 제작", summary: "브랜딩용 웹·커뮤니티 인프라" },
      { id: "a5", title: "굿즈 제작 지원", summary: "일러스트 기반 굿즈 라인업" },
    ] as ProtocolItem[],
    details: [
      {
        id: "a-detail-1",
        title: "일러스트 안내",
        body: "서포터즈 미디어팀과 협업해 키비주얼·굿즈용 일러스트를 제작합니다. 스타일 가이드는 관리자 CMS에서 추후 공개됩니다.",
        imageHint: "일러스트 샘플 영역",
      },
      {
        id: "a-detail-2",
        title: "연말 오프라인 팝업스토어",
        body: "12월 연말 시즌 오프라인 팝업스토어를 진행합니다. 입장권·굿즈·포토존 일정은 로드맵과 함께 업데이트됩니다.",
        imageHint: "팝업스토어 비주얼",
      },
    ] as ProtocolDetail[],
  },
  quality: {
    label: "스트리머 퀄리티",
    description: "콘텐츠·서버·대회·지원 프로그램",
    items: [
      { id: "q1", title: "콘텐츠 이벤트", summary: "협업 방송·시즌 이벤트 기획" },
      { id: "q2", title: "마크 서버", summary: "카퍼 서버 운영 및 위키 연동" },
      { id: "q3", title: "게임 대회", summary: "서포터즈 참여형 토너먼트" },
      { id: "q4", title: "로열티 지원", summary: "장비·소프트웨어·방송 환경" },
      { id: "q5", title: "의류 지원", summary: "방송·오프라인용 의상 지원" },
    ] as ProtocolItem[],
    details: [
      {
        id: "q-detail-1",
        title: "콘텐츠 이벤트 시즌",
        body: "분기별 테마 이벤트와 서포터즈 공동 기획 방송을 운영합니다. 일정과 규칙은 로드맵에 맞춰 공개됩니다.",
      },
      {
        id: "q-detail-2",
        title: "마크 서버 & 위키",
        body: "커뮤니티 허브로 마크 서버와 카퍼 위키를 연동합니다. 가이드·규칙·맵 정보는 위키에서 관리됩니다.",
      },
    ] as ProtocolDetail[],
  },
} as const;

export type ProtocolTabKey = keyof typeof PROTOCOL_TABS;
