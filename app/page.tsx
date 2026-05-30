import { ProjectIntro } from "@/components/home/ProjectIntro";
import { getHomeContent } from "@/lib/cms/home-content";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "edge";

export default async function HomePage() {
  const content = await getHomeContent();

  return (
    <>
      {!isSupabaseConfigured() && (
        <p className="sr-only">콘텐츠: 로컬 기본값 (Supabase 미연결)</p>
      )}
      <ProjectIntro content={content} />
    </>
  );
}
