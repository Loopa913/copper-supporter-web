"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SoftCard } from "@/components/ui/SoftCard";
import { FadeIn } from "@/components/ui/FadeIn";

const ERROR_MESSAGES: Record<string, string> = {
  not_admin: "관리자 권한이 없는 계정입니다.",
  supabase_not_configured: ".env.local에 Supabase 설정이 필요합니다.",
  auth_failed: "이메일 또는 비밀번호가 올바르지 않습니다.",
};

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const redirectTo = searchParams.get("redirect") ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorCode ? (ERROR_MESSAGES[errorCode] ?? "로그인에 실패했습니다.") : null
  );

  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) {
      setError(ERROR_MESSAGES.supabase_not_configured);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(ERROR_MESSAGES.auth_failed);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <FadeIn>
      <SoftCard interactive={false} className="mx-auto w-full max-w-md p-8">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          관리자 로그인
        </h1>
        <p className="mt-2 text-sm font-light text-text-secondary">
          콘텐츠 관리 시스템
        </p>

        {!configured && (
          <p className="mt-4 rounded-2xl bg-copper-muted p-4 text-sm font-light text-copper">
            Supabase 미연결
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-text-muted">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-border px-4 py-3 text-sm transition-all duration-300 focus:border-copper/40 focus:outline-none focus:ring-2 focus:ring-copper/15"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-text-muted">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-border px-4 py-3 text-sm transition-all duration-300 focus:border-copper/40 focus:outline-none focus:ring-2 focus:ring-copper/15"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !configured}
            className="btn-copper w-full disabled:opacity-50"
          >
            {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "로그인"}
          </button>
        </form>
      </SoftCard>
    </FadeIn>
  );
}
