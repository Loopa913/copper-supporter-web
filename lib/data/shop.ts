export type GoodsItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

export const SHOP_INTRO = {
  title: "서포터즈 굿즈샵",
  description:
    "일러스트·굿즈 제작 지원 프로그램으로 만든 라인업을 소개합니다. 공식 샵 링크는 아래 버튼에서 이동할 수 있습니다.",
  supportNote:
    "굿즈 제작 지원: 디자인·샘플·소량 제작까지 서포터즈 미디어팀이 큐레이션합니다.",
};

export const GOODS_ITEMS: GoodsItem[] = [
  {
    id: "1",
    name: "카퍼 엠블럼 키링",
    description: "카퍼 포인트 메탈 키링",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
  },
  {
    id: "2",
    name: "성좌 로고 후드",
    description: "카퍼 톤 자수 · 프리미엄 후드",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
  },
  {
    id: "3",
    name: "아크릴 스탠드",
    description: "일러스트 기반 아크릴",
    imageUrl:
      "https://images.unsplash.com/photo-1633173529314-8b1c4a4c8c8c?w=600&q=80",
  },
  {
    id: "4",
    name: "포토카드 세트",
    description: "홀로그램 코팅 3종",
    imageUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
  },
];

export const SHOP_CTA = {
  label: "공식 굿즈샵 바로가기",
  href: "https://example.com/shop",
};
