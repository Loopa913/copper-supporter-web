-- 카퍼 서포터즈 — Supabase 초기 스키마
-- Supabase 대시보드 → SQL Editor → 붙여넣기 → Run

-- Extensions
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- 관리자 프로필 (auth.users 와 1:1)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

create policy "Admins can read own profile"
  on public.admin_profiles for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 홈페이지 CMS 콘텐츠 (키-값 형태)
-- section: hero | roadmap | supporters | shop | protocol ...
-- key: title | summary | video_id | banner_url ...
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  id uuid primary key default uuid_generate_v4(),
  section text not null,
  key text not null,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id),
  unique (section, key)
);

alter table public.site_content enable row level security;

create policy "Anyone can read site content"
  on public.site_content for select
  using (true);

create policy "Admins can insert site content"
  on public.site_content for insert
  with check (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role in ('admin', 'editor')
    )
  );

create policy "Admins can update site content"
  on public.site_content for update
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role in ('admin', 'editor')
    )
  );

create policy "Admins can delete site content"
  on public.site_content for delete
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- 위키 카테고리 (계층형)
-- ---------------------------------------------------------------------------
create table if not exists public.wiki_categories (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references public.wiki_categories (id) on delete set null,
  title text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wiki_categories enable row level security;

create policy "Anyone can read wiki categories"
  on public.wiki_categories for select
  using (true);

create policy "Admins can manage wiki categories"
  on public.wiki_categories for all
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role in ('admin', 'editor')
    )
  );

-- ---------------------------------------------------------------------------
-- 위키 문서
-- content: BlockNote / Editor.js JSON
-- ---------------------------------------------------------------------------
create table if not exists public.wiki_pages (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.wiki_categories (id) on delete set null,
  title text not null,
  slug text not null unique,
  content jsonb not null default '[]',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

alter table public.wiki_pages enable row level security;

create policy "Anyone can read published wiki pages"
  on public.wiki_pages for select
  using (published = true);

create policy "Admins can read all wiki pages"
  on public.wiki_pages for select
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role in ('admin', 'editor')
    )
  );

create policy "Admins can manage wiki pages"
  on public.wiki_pages for insert
  with check (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role in ('admin', 'editor')
    )
  );

create policy "Admins can update wiki pages"
  on public.wiki_pages for update
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role in ('admin', 'editor')
    )
  );

create policy "Admins can delete wiki pages"
  on public.wiki_pages for delete
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- 샘플 홈 콘텐츠 (선택 — 삭제해도 됨)
-- ---------------------------------------------------------------------------
insert into public.site_content (section, key, value) values
  (
    'hero',
    'tagline',
    '"함께 만드는 스트리머 프로젝트 — 서포터즈와 함께 성장하는 RPG형 커뮤니티"'::jsonb
  ),
  (
    'hero',
    'summary',
    '"카퍼 서포터즈는 스트리머의 퀄리티와 인지도를 동시에 키우는 협력 프로젝트입니다."'::jsonb
  ),
  ('hero', 'video_id', '"dQw4w9WgXcQ"'::jsonb)
on conflict (section, key) do nothing;

-- 로드맵·서포터즈 전체는 관리자 CMS 저장 UI 연동 후 site_content에 JSON으로 저장
-- (미설정 시 앱은 lib/data/home.ts 기본값 사용)
