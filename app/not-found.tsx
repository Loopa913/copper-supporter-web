import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";

export const runtime = "edge";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <FadeIn>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mt-4 text-sm font-light text-text-secondary">
          요청하신 페이지가 존재하지 않거나 주소가 잘못되었습니다.
        </p>
        <Link
          href="/"
          className="btn-copper mt-8 inline-flex px-8 py-3 text-sm"
        >
          홈으로 돌아가기
        </Link>
      </FadeIn>
    </div>
  );
}
