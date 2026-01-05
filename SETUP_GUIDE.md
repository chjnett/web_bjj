# OSJ 청라 주짓수 - 상세 설정 가이드

이 가이드는 프로젝트를 처음부터 설정하는 방법을 단계별로 설명합니다.

## 목차

1. [개발 환경 설정](#1-개발-환경-설정)
2. [Supabase 프로젝트 설정](#2-supabase-프로젝트-설정)
3. [데이터베이스 초기화](#3-데이터베이스-초기화)
4. [이메일 서비스 설정](#4-이메일-서비스-설정)
5. [배포 설정](#5-배포-설정)
6. [관리자 사용 가이드](#6-관리자-사용-가이드)

---

## 1. 개발 환경 설정

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Git

### 프로젝트 설치

```bash
# 프로젝트 디렉토리로 이동
cd 01-청라주짓수

# 의존성 설치
npm install

# 개발 서버 실행 (설정 완료 후)
npm run dev
```

---

## 2. Supabase 프로젝트 설정

### 2.1 Supabase 계정 생성

1. https://supabase.com 접속
2. GitHub 계정으로 로그인 (또는 이메일로 가입)
3. "New Project" 클릭

### 2.2 프로젝트 생성

- **Organization**: 새로 생성하거나 기존 선택
- **Project Name**: `osj-cheongna-jiujitsu`
- **Database Password**: 안전한 비밀번호 생성 (저장 필수!)
- **Region**: `Northeast Asia (Seoul)` 선택 (한국 서버)
- **Pricing Plan**: Free tier로 시작 가능

### 2.3 API 키 확인

프로젝트가 생성되면:

1. 왼쪽 메뉴에서 **Settings** → **API** 클릭
2. 다음 정보 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키

### 2.4 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 3. 데이터베이스 초기화

### 3.1 SQL 스키마 실행

1. Supabase Dashboard → **SQL Editor** 클릭
2. "New Query" 클릭
3. `supabase/schema.sql` 파일의 전체 내용 복사
4. SQL Editor에 붙여넣기
5. "Run" 버튼 클릭

### 3.2 스키마 확인

1. **Table Editor**로 이동
2. 다음 테이블이 생성되었는지 확인:
   - `news_posts`
   - `schedules`
   - `pricing`
   - `inquiries`
   - `analytics`

### 3.3 Storage 버킷 확인

1. **Storage** → **Buckets** 클릭
2. `news-images` 버킷이 생성되고 **Public**으로 설정되어 있는지 확인

---

## 4. 이메일 서비스 설정

### 4.1 Resend 계정 생성

1. https://resend.com 접속
2. 무료 계정 생성 (월 3,000통 무료)
3. API Key 생성:
   - Dashboard → **API Keys** → **Create API Key**
   - 이름: `osj-inquiry-notifications`
   - 권한: **Sending access**
   - API Key 복사 (다시 볼 수 없으니 안전하게 저장!)

### 4.2 도메인 검증 (선택사항)

무료 플랜에서는 `onboarding@resend.dev`에서 이메일이 발송됩니다.
자체 도메인을 사용하려면:

1. Resend Dashboard → **Domains** → **Add Domain**
2. 도메인 입력 (예: `osj-jiujitsu.com`)
3. DNS 레코드 추가 (안내에 따라)
4. 검증 완료

### 4.3 Supabase Edge Function 설정

#### Supabase CLI 설치

```bash
npm install -g supabase
```

#### Supabase 프로젝트 연결

```bash
# Supabase 로그인
supabase login

# 프로젝트 연결 (Project ID 입력 필요)
supabase link --project-ref your-project-ref
```

#### Edge Function 배포

```bash
# Function 배포
supabase functions deploy send-inquiry-email

# Resend API Key 설정
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxx
```

#### Edge Function 코드 수정

`supabase/functions/send-inquiry-email/index.ts`에서 발신 이메일 수정:

```typescript
from: 'OSJ 청라 주짓수 <noreply@your-verified-domain.com>',
```

### 4.4 Database Webhook 설정 (자동 이메일 발송)

1. Supabase Dashboard → **Database** → **Webhooks**
2. "Create a new hook" 클릭
3. 설정:
   - **Name**: `send-inquiry-email`
   - **Table**: `inquiries`
   - **Events**: `INSERT`
   - **Type**: `Supabase Edge Function`
   - **Edge Function**: `send-inquiry-email`
4. "Confirm" 클릭

---

## 5. 배포 설정

### 5.1 Vercel 배포

#### GitHub 연동

1. 프로젝트를 GitHub에 푸시:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/osj-jiujitsu.git
git push -u origin main
```

#### Vercel 프로젝트 생성

1. https://vercel.com 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. **Environment Variables** 추가:
   - `VITE_SUPABASE_URL`: Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase Anon Key
5. "Deploy" 클릭

#### 커스텀 도메인 설정 (선택사항)

1. Vercel Dashboard → **Settings** → **Domains**
2. 도메인 입력 (예: `osj-jiujitsu.com`)
3. DNS 레코드 추가:
   - **Type**: A / CNAME
   - **Name**: @ 또는 www
   - **Value**: Vercel 제공 값

---

## 6. 관리자 사용 가이드

### 6.1 관리자 계정 생성

1. Supabase Dashboard → **Authentication** → **Users**
2. "Add user" 클릭
3. 관리자 이메일 및 비밀번호 입력
4. "Create user" 클릭

### 6.2 첫 로그인

1. 웹사이트의 `/admin/login` 페이지 접속
2. 생성한 관리자 계정으로 로그인

### 6.3 소식 업로드

1. **소식 관리** 탭 클릭
2. "이미지 업로드" 영역에 이미지 드래그 앤 드롭
3. 업로드된 이미지는 자동으로 메인 페이지에 표시

**권장 이미지 사양:**
- 형식: JPG, PNG
- 크기: 1080x1080px (1:1 비율)
- 용량: 2MB 이하

### 6.4 시간표 수정

1. **시간표** 탭 클릭
2. 수정할 수업의 연필 아이콘 클릭
3. 정보 수정:
   - 수업명
   - 시작 시간
   - 종료 시간
   - 설명
4. "저장" 클릭

### 6.5 수업료 수정

1. **수업료** 탭 클릭
2. 수정할 플랜의 연필 아이콘 클릭
3. 정보 수정:
   - 플랜명
   - 가격
4. "저장" 클릭

**참고**: 혜택 내용은 현재 DB에서 직접 수정해야 합니다.

### 6.6 문의 확인

1. **문의** 탭에서 모든 접수된 문의 확인
2. 각 문의는 자동으로 설정한 이메일로 전송됨
3. 상태는 자동으로 "대기 중"으로 표시

---

## 7. 고급 설정

### 7.1 Google Maps 연동

`src/components/ContactSection.jsx`의 iframe src를 실제 위치로 수정:

```javascript
src="https://www.google.com/maps/embed?pb=실제_Google_Maps_Embed_URL"
```

Google Maps Embed URL 생성:
1. Google Maps에서 위치 검색
2. "공유" → "지도 퍼가기" 클릭
3. iframe 코드 복사

### 7.2 Instagram 연동

실제 Instagram 계정 URL로 수정:

```javascript
// src/components/NewsSection.jsx 및 Footer.jsx
href="https://www.instagram.com/your_actual_account"
```

### 7.3 전화번호 업데이트

`src/components/ContactSection.jsx`에서 전화번호 수정:

```javascript
{
  icon: <Phone size={24} />,
  title: '전화',
  content: '032-1234-5678',  // 실제 전화번호
  detail: '운영시간: 평일 14:00 - 22:00',
  link: 'tel:03212345678'  // 하이픈 제거
}
```

---

## 8. 문제 해결

### 빌드 오류

```bash
# node_modules 삭제 및 재설치
rm -rf node_modules package-lock.json
npm install
```

### Supabase 연결 오류

1. `.env` 파일의 URL과 Key 확인
2. Supabase 프로젝트가 활성 상태인지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### Edge Function 오류

```bash
# Function 로그 확인
supabase functions logs send-inquiry-email

# Function 재배포
supabase functions deploy send-inquiry-email --no-verify-jwt
```

### 이미지 업로드 실패

1. Storage 버킷이 public인지 확인
2. Storage policies 확인
3. 관리자로 로그인되어 있는지 확인
4. 이미지 크기 확인 (최대 50MB)

---

## 9. 유지보수

### 정기 백업

Supabase Dashboard → **Database** → **Backups**에서 자동 백업 설정

### 모니터링

1. **Vercel Analytics**: 트래픽 및 성능 모니터링
2. **Supabase Analytics**: 데이터베이스 사용량 확인

### 업데이트

```bash
# 의존성 업데이트 확인
npm outdated

# 의존성 업데이트
npm update
```

---

## 지원

설정 중 문제가 발생하면 다음을 확인하세요:

1. [Supabase Documentation](https://supabase.com/docs)
2. [Vite Documentation](https://vitejs.dev)
3. [Tailwind CSS Documentation](https://tailwindcss.com/docs)
4. [Framer Motion Documentation](https://www.framer.com/motion)

기술 지원이 필요하시면 개발자에게 문의해주세요.
