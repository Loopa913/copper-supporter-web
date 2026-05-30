import { redirect } from "next/navigation";
import Link from "next/link";
import { createClientIfConfigured } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClientIfConfigured();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/admin/dashboard");
  }

  return (
    <div className="section-white mx-auto max-w-lg px-5 py-24 text-center sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
        관리자
      </h1>
      <p className="mt-4 text-sm font-light text-text-secondary">
        콘텐츠 관리 시스템에 로그인하세요.
      </p>
      <Link href="/admin/login" className="btn-copper mt-10">
        로그인
      </Link>
    </div>
  );
}
