"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { HomeContent } from "@/lib/cms/types";
import { SoftCard } from "@/components/ui/SoftCard";
import { FadeIn } from "@/components/ui/FadeIn";

type AdminDashboardProps = {
  session: { email: string; role: string };
  homeContent: HomeContent;
  supabaseConnected: boolean;
};

export function AdminDashboard({
  session,
  homeContent,
  supabaseConnected,
}: AdminDashboardProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="section-warm min-h-[70vh] px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <FadeIn className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">관리자 대시보드</h1>
            <p className="mt-2 text-sm font-light text-text-secondary">
              {session.email} · {supabaseConnected ? "DB 연결됨" : "로컬 기본값"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-ghost inline-flex gap-2"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </FadeIn>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <SoftCard className="p-6">
            <h2 className="font-semibold text-copper">홈 CMS</h2>
            <p className="mt-2 text-sm font-light text-text-secondary">다음 단계</p>
          </SoftCard>
          <SoftCard className="p-6">
            <h2 className="font-semibold text-copper">위키</h2>
            <p className="mt-2 text-sm font-light text-text-secondary">다음 단계</p>
          </SoftCard>
        </div>

        <SoftCard interactive={false} className="mt-8 p-6">
          <p className="text-sm font-light text-text-secondary">
            로드맵 {homeContent.roadmapEvents.length}건 · 멤버{" "}
            {homeContent.supporters.length}명
          </p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium text-copper hover:underline">
            메인 보기
          </Link>
        </SoftCard>
      </div>
    </div>
  );
}
