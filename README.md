# 카퍼 서포터즈 웹

다크 판타지/RPG 감성의 서포터즈 프로젝트 웹사이트입니다.

## 스택

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase (Auth / DB — 후속 연동)

## 시작하기 (요약)

```powershell
Set-Location -LiteralPath 'C:\Users\user\Desktop\프로젝트 웹'
npm install
npm run dev
```

브라우저: **http://localhost:3000**

> **처음이시라면** DB·Supabase·배포까지 단계별 설명: **[docs/SETUP.md](docs/SETUP.md)** 를 먼저 읽어 주세요.

### Supabase (DB·로그인 준비)

1. [supabase.com](https://supabase.com)에서 프로젝트 생성
2. `.env.example`을 복사해 `.env.local` 만들고 URL·anon 키 입력
3. SQL Editor에서 `supabase/schema.sql` 실행

## 현재 구현 범위

- [x] 기본 레이아웃 (Navbar, Footer, 코스믹 4레이어 배경)
- [x] 메인 — 프로젝트 소개 (Hero, 로드맵, 서포터즈) + Supabase `site_content` 연동(폴백)
- [x] 성장 프로토콜 — 탭·카드·패럴랙스 상세 (뼈대)
- [x] 굿즈샵 — 슬라이더·CTA (뼈대)
- [x] 카퍼 위키 — 사이드바 트리·에디터 플레이스홀더 (뼈대)
- [x] 관리자 — 로그인·대시보드 (미리보기), CMS 저장 UI는 다음 단계
- [ ] BlockNote 위키 에디터
- [ ] 관리자 폼 저장·이미지 업로드

## 프로젝트 구조

```
app/                 # 라우트
components/
  home/              # 메인 페이지 섹션
  layout/            # Navbar, Footer, MainLayout
  ui/                # GlowCard, SectionHeader
lib/
  constants/         # 네비게이션
  data/              # 정적 콘텐츠 (추후 Supabase로 이전)
```
