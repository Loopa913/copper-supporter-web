import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Home,
  Shield,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "프로젝트 소개",
    href: "/",
    icon: Home,
    description: "함께 만드는 스트리머 프로젝트",
  },
  {
    label: "성장 프로토콜",
    href: "/protocol",
    icon: Sparkles,
    description: "서포터즈 성장 목표",
  },
  {
    label: "굿즈샵",
    href: "/shop",
    icon: ShoppingBag,
    description: "서포터즈 굿즈",
  },
  {
    label: "카퍼 위키",
    href: "/wiki",
    icon: BookOpen,
    description: "마크 서버 위키",
  },
  {
    label: "관리자",
    href: "/admin",
    icon: Shield,
    description: "CMS 관리",
  },
];
