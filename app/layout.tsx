import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/MainLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "카퍼 서포터즈 | 함께 만드는 스트리머 프로젝트",
  description:
    "함께 만드는 스트리머 프로젝트 공식 홈페이지. 일정, 스트리머 지원 프로토콜, 굿즈, 위키 안내.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-pretendard">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
