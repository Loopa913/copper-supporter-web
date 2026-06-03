"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { HomeContent } from "@/lib/cms/types";
import type { WikiContent } from "@/lib/cms/wiki-content";
import { SoftCard } from "@/components/ui/SoftCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { HomeCmsEditor } from "@/components/admin/HomeCmsEditor";
import { RoadmapCmsEditor } from "@/components/admin/RoadmapCmsEditor";
import { SupporterCmsEditor } from "@/components/admin/SupporterCmsEditor";
import { WikiCategoryCmsEditor } from "@/components/admin/WikiCategoryCmsEditor";

type AdminDashboardProps = {
  session: { email: string; role: string };
  homeContent: HomeContent;
  wikiContent: WikiContent;
  supabaseConnected: boolean;
};

export function AdminDashboard({
  session,
  homeContent,
  wikiContent,
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
              {session.email} · {supabaseConnected ? "DB 연결됨" : "로컬 기본값 (DB 연결 필요)"}
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

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <FadeIn delay={0.1}>
              <HomeCmsEditor initialData={homeContent} disabled={!supabaseConnected} />
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <RoadmapCmsEditor initialData={homeContent} disabled={!supabaseConnected} />
            </FadeIn>

            <FadeIn delay={0.3}>
              <SupporterCmsEditor initialData={homeContent} disabled={!supabaseConnected} />
            </FadeIn>
          </div>
          
          <div className="space-y-5">
            <FadeIn delay={0.4}>
              <WikiCategoryCmsEditor
                initialCategories={wikiContent.categories}
                initialPages={wikiContent.pages}
                disabled={!supabaseConnected}
              />
            </FadeIn>

            <FadeIn delay={0.5}>
              <SoftCard interactive={false} className="p-6">
                <p className="text-sm font-light text-text-secondary">
                  로드맵 {homeContent.roadmapEvents.length}건 · 멤버{" "}
                  {homeContent.supporters.length}명
                  <br />
                  위키 카테고리 {wikiContent.categories.length}개 · 문서 {wikiContent.pages.length}개
                </p>
                <Link href="/" target="_blank" className="mt-4 inline-block text-sm font-medium text-copper hover:underline">
                  홈페이지 새 창으로 보기 ↗
                </Link>
              </SoftCard>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
