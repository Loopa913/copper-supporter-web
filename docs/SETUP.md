# 카퍼 서포터즈 — 처음부터 끝까지 설정 가이드

홈페이지를 처음 만드는 분을 위해, **내 PC에서 보기** → **DB(Supabase) 만들기** → **인터넷에 올리기** 순서로 정리했습니다.

---

## 0. 한눈에 보는 구조

```
[브라우저]  →  http://localhost:3000  (또는 배포 URL)
      ↓
[Next.js 웹앱]  ←  지금 만든 프로젝트 폴더
      ↓
[Supabase]  ←  회원 로그인 + DB 저장 (관리자·위키용, 단계적으로 연결)
```

| 구분 | 지금 상태 | 어디서 수정? |
|------|-----------|--------------|
| 메인 화면 글·로드맵·멤버 | **코드 파일**에 저장됨 | `lib/data/home.ts` |
| Supabase DB | **준비만 됨** (env 연결) | Supabase 대시보드 + `.env.local` |
| 관리자 CMS | 아직 미구현 | 다음 개발 단계 |

**지금 당장** 홈페이지만 보려면 Supabase 없이도 됩니다.  
**나중에** 관리자 페이지에서 글/이미지를 바꾸려면 Supabase 설정이 필요합니다.

---

## 1. 미리 설치할 것

### 1-1. Node.js (필수)

웹 프로젝트를 실행하는 프로그램입니다.

1. https://nodejs.org 접속
2. **LTS** 버전 다운로드 후 설치 (기본 옵션 그대로 Next)
3. 설치 확인 — **PowerShell** 또는 **명령 프롬프트** 열고:

```powershell
node -v
npm -v
```

`v20` 이상처럼 버전 숫자가 나오면 성공입니다.

### 1-2. 코드 편집기 (권장)

- **Cursor** 또는 **VS Code** — 프로젝트 폴더를 열어서 파일 수정

### 1-3. Git (선택)

배포(Vercel)할 때 편합니다. 없어도 ZIP 업로드 등 다른 방법은 가능합니다.

---

## 2. 내 컴퓨터에서 홈페이지 열기 (가장 먼저)

### 2-1. 프로젝트 폴더로 이동

PowerShell에서:

```powershell
Set-Location -LiteralPath 'C:\Users\user\Desktop\프로젝트 웹'
```

> 폴더 경로가 다르면 본인 PC에 있는 `프로젝트 웹` 폴더 경로로 바꿉니다.

### 2-2. 패키지 설치 (최초 1회)

```powershell
npm install
```

1~3분 걸릴 수 있습니다. `node_modules` 폴더가 생깁니다.

### 2-3. 개발 서버 실행

```powershell
npm run dev
```

아래처럼 나오면 성공:

```
▲ Next.js ...
- Local: http://localhost:3000
```

### 2-4. 브라우저로 접속

1. Chrome / Edge 등 열기
2. 주소창에 입력: **`http://localhost:3000`**
3. 카퍼 서포터즈 메인 화면이 보이면 완료

### 2-5. 서버 끄기

터미널에서 `Ctrl + C`

### 2-6. 화면 글만 바꾸고 싶을 때 (DB 없이)

파일: **`lib/data/home.ts`**

- `HERO_SUMMARY` — 히어로 설명
- `ROADMAP_EVENTS` — 로드맵 일정
- `SUPPORTERS` — 서포터즈 카드

수정 후 저장 → 브라우저 **새로고침(F5)** 하면 반영됩니다. (`npm run dev` 가 켜져 있어야 함)

영상 URL: **`components/home/HeroSection.tsx`** 안의 `YOUTUBE_EMBED_ID` 값을 본인 유튜브 영상 ID로 변경합니다.

> 유튜브 URL 예: `https://www.youtube.com/watch?v=ABC123xyz` → ID는 `ABC123xyz`

---

## 3. Supabase — DB + 로그인 준비

관리자 로그인·위키·CMS에 쓸 **클라우드 DB**입니다. 무료 티어로 시작 가능합니다.

### 3-1. 계정 & 프로젝트 생성

1. https://supabase.com 가입 (GitHub 로그인 가능)
2. **New Project** 클릭
3. 입력 예:
   - **Name**: `copper-supporter` (아무 이름)
   - **Database Password**: 강한 비밀번호 **꼭 메모** (나중에 DB 직접 접속 시 필요)
   - **Region**: `Northeast Asia (Seoul)` 권장
4. **Create new project** — 1~2분 대기

### 3-2. API 키 복사 (웹앱 연결용)

1. 왼쪽 메뉴 **Project Settings** (톱니바퀴)
2. **API** 메뉴
3. 아래 두 값을 복사해 둡니다:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public** 키 (긴 문자열)

> `service_role` 키는 **절대** 웹페이지·GitHub에 넣지 마세요. 서버 전용입니다.

### 3-3. 프로젝트에 환경 변수 넣기

1. 프로젝트 폴더에 **`.env.local`** 파일 생성 (`.env.example` 복사해도 됨)
2. 내용 예시:

```env
NEXT_PUBLIC_SUPABASE_URL=https://여기프로젝트ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기_anon_public_키_붙여넣기
```

3. 저장 후 **개발 서버를 껐다가 다시** `npm run dev` 실행  
   (env 파일은 서버 시작할 때만 읽습니다)

### 3-4. DB 테이블 만들기 (SQL 한 번 실행)

1. Supabase 대시보드 → **SQL Editor**
2. **New query**
3. 프로젝트 안 **`supabase/schema.sql`** 파일 내용 전체 복사 → 붙여넣기
4. **Run** 클릭 → Success 나오면 완료

만든 테이블 요약:

| 테이블 | 용도 |
|--------|------|
| `site_content` | 홈 화면 텍스트·이미지 URL 등 |
| `wiki_categories` | 위키 카테고리 (트리) |
| `wiki_pages` | 위키 문서 본문 |
| `admin_profiles` | 관리자 권한 표시 |

### 3-5. Storage (이미지 업로드용 버킷)

1. Supabase → **Storage**
2. **New bucket**
   - Name: `uploads`
   - **Public bucket**: 체크 (위키/배너 이미지 공개 URL용)
3. 생성 후 **Policies** — 개발 초기에는 대시보드에서 “Allow public read” 정책을 추가하거나, 나중에 관리자만 업로드하도록 RLS를 조정합니다.

(정교한 보안 정책은 관리자 CMS 구현 시 같이 맞춥니다.)

### 3-6. 로그인(관리자) 계정 만들기

1. Supabase → **Authentication** → **Users**
2. **Add user** → 이메일 + 비밀번호 입력 (테스트용 관리자)
3. 같은 이메일을 SQL Editor에서 관리자로 등록:

```sql
insert into public.admin_profiles (user_id, email, role)
select id, email, 'admin'
from auth.users
where email = '관리자@이메일.com';
```

> `관리자@이메일.com`을 위에서 만든 이메일로 바꿉니다.

**참고:** 관리자 **로그인 화면**은 아직 개발 전입니다. 지금은 DB·계정만 준비해 두는 단계입니다.

---

## 4. 연결이 잘 됐는지 확인

### 4-1. env 확인

`.env.local` 두 줄이 비어 있지 않은지 확인합니다.

### 4-2. (선택) 브라우저 콘솔

개발자 도구(F12) → Console.  
Supabase URL이 비어 있으면 나중에 CMS 붙일 때 오류가 납니다. 지금은 메인 페이지만 볼 때는 **없어도 화면은 뜹니다**.

### 4-3. Supabase Table Editor

**Table Editor**에서 `site_content` 등 테이블이 보이면 DB 생성 성공입니다.

---

## 5. 인터넷에 공개하기 (배포)

로컬(`localhost`)은 **본인 PC에서만** 보입니다. 다른 사람에게 URL을 주려면 배포가 필요합니다.

### 5-1. Vercel (Next.js에 가장 흔함)

1. https://vercel.com 가입
2. **Add New Project** → GitHub에 코드 올렸다면 저장소 Import  
   (Git 없으면 Vercel CLI 또는 수동 업로드 문서 참고)
3. **Environment Variables**에 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy 완료 후 `https://프로젝트명.vercel.app` 같은 주소가 생깁니다

### 5-2. Supabase 쪽 추가 설정 (배포 후 로그인 쓸 때)

**Authentication** → **URL Configuration**

- **Site URL**: `https://본인-vercel주소.vercel.app`
- **Redirect URLs**에 같은 주소 추가

---

## 6. 자주 하는 실수

| 증상 | 해결 |
|------|------|
| `next`를 찾을 수 없음 | 프로젝트 폴더에서 `npm install` 다시 실행 |
| `Missing script: build` | 잘못된 폴더에서 명령 실행 → `프로젝트 웹` 폴더로 이동 |
| 화면이 안 바뀜 | `npm run dev` 켜진 상태에서 저장 후 F5 |
| env 반영 안 됨 | `.env.local` 수정 후 서버 재시작 (`Ctrl+C` → `npm run dev`) |
| 포트 사용 중 | 다른 터미널에서 dev 서버 끄거나 `npm run dev -- -p 3001` |
| 한글 경로 문제 | PowerShell에서 `Set-Location -LiteralPath '전체경로'` 사용 |

---

## 7. 앞으로 할 일 (개발 로드맵)

1. **지금**: `npm run dev` + `lib/data/home.ts` 로 내용 수정  
2. **Supabase**: `schema.sql` 실행 + `.env.local` + 관리자 유저  
3. **다음 개발**: 관리자 로그인 → `site_content`를 읽어 홈 화면 표시 → 위키·CMS

---

## 8. 명령어 치트시트

```powershell
# 폴더 이동
Set-Location -LiteralPath 'C:\Users\user\Desktop\프로젝트 웹'

# 의존성 설치 (최초 / package.json 변경 후)
npm install

# 개발 서버 (로컬 접속)
npm run dev

# 빌드 테스트 (배포 전 확인)
npm run build
npm run start
```

로컬 접속 주소: **http://localhost:3000**
