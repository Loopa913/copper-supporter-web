"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import type { WikiPage } from "@/lib/data/wiki";

type WikiEditorPlaceholderProps = {
  page: WikiPage;
};

export function WikiEditorPlaceholder({ page }: WikiEditorPlaceholderProps) {
  return (
    <FadeIn className="mx-auto w-full max-w-[720px] flex-1 px-8 py-12 sm:px-12">
      <p className="text-sm font-light text-text-muted">{page.excerpt}</p>

      <article className="mt-10 space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
          {page.title}
        </h2>
        <p className="font-light leading-loose text-text-secondary">
          노션 라이트 모드와 유사한 읽기 전용 문서 영역입니다. 블록 에디터 연동 시
          표·이미지·드롭다운이 이곳에 표시됩니다.
        </p>

        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-warm">
              <tr>
                <th className="border-b border-border px-4 py-2.5 font-medium text-text-primary">
                  항목
                </th>
                <th className="border-b border-border px-4 py-2.5 font-medium text-text-primary">
                  설명
                </th>
              </tr>
            </thead>
            <tbody className="font-light">
              <tr>
                <td className="border-b border-border px-4 py-2.5">접속</td>
                <td className="border-b border-border px-4 py-2.5 text-text-secondary">
                  버전 및 IP
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">문의</td>
                <td className="px-4 py-2.5 text-text-secondary">커뮤니티 채널</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-surface-warm px-6 py-16 text-center text-sm font-light text-text-muted">
          이미지 · 유튜브 블록 영역
        </div>
      </article>
    </FadeIn>
  );
}
