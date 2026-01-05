# 문제 해결 가이드 (Troubleshooting)

이 문서는 자주 발생하는 문제와 해결 방법을 정리합니다.

---

## 목차

1. [개발 환경 문제](#1-개발-환경-문제)
2. [Supabase 연결 문제](#2-supabase-연결-문제)
3. [빌드 및 배포 문제](#3-빌드-및-배포-문제)
4. [인증 문제](#4-인증-문제)
5. [데이터베이스 문제](#5-데이터베이스-문제)
6. [Storage 문제](#6-storage-문제)
7. [이메일 발송 문제](#7-이메일-발송-문제)
8. [UI/UX 문제](#8-uiux-문제)

---

## 1. 개발 환경 문제

### ❌ `npm install` 실패

**증상**: 의존성 설치 중 오류 발생

**원인**:
- Node.js 버전 불일치
- npm 캐시 손상
- 네트워크 문제

**해결 방법**:

```bash
# Node.js 버전 확인 (18 이상 필요)
node --version

# npm 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### ❌ 개발 서버가 시작되지 않음

**증상**: `npm run dev` 실행 시 오류

**해결 방법**:

```bash
# 포트가 이미 사용 중인지 확인
# Windows
netstat -ano | findstr :3000

# 프로세스 종료 후 재시작
# 또는 다른 포트 사용
# vite.config.js에서 포트 변경
```

### ❌ Hot Module Replacement (HMR) 작동 안 함

**증상**: 코드 수정 시 자동 새로고침 안 됨

**해결 방법**:

```bash
# 개발 서버 재시작
# Ctrl+C로 종료 후 다시 실행
npm run dev

# 또는 브라우저 수동 새로고침
```

---

## 2. Supabase 연결 문제

### ❌ "Failed to fetch" 오류

**증상**: Supabase API 호출 시 네트워크 오류

**원인**:
- 환경 변수 미설정
- 잘못된 API URL/Key
- CORS 문제

**해결 방법**:

```bash
# 1. .env 파일 확인
cat .env

# 2. 환경 변수가 올바른지 확인
VITE_SUPABASE_URL=https://xxxxx.supabase.co  # ✓ 올바름
VITE_SUPABASE_URL=xxxxx.supabase.co          # ✗ https:// 없음

# 3. 개발 서버 재시작 (환경 변수 변경 시 필수)
npm run dev
```

**추가 확인**:
1. Supabase Dashboard → Settings → API
2. URL과 anon key 재확인
3. 브라우저 콘솔에서 실제 요청 URL 확인

### ❌ "Invalid API key" 오류

**증상**: 401 Unauthorized 오류

**해결 방법**:

```bash
# 1. anon key (public) 사용 확인 (service_role key 아님!)
# .env 파일에서 확인

# 2. key에 공백이나 특수문자가 없는지 확인
# 복사 시 앞뒤 공백 주의

# 3. 환경 변수 이름 확인
VITE_SUPABASE_ANON_KEY=eyJ...  # ✓ VITE_ 접두사 필수
SUPABASE_ANON_KEY=eyJ...       # ✗ 잘못됨
```

---

## 3. 빌드 및 배포 문제

### ❌ 빌드 실패 (Build Failed)

**증상**: `npm run build` 실행 시 오류

**일반적인 오류**:

```bash
# 1. ESLint 오류
npm run build -- --no-lint

# 2. TypeScript 타입 오류 (jsx 파일이므로 해당 없음)

# 3. 환경 변수 없음
# Vercel에서 빌드 시 환경 변수 설정 확인
```

**해결 방법**:

```bash
# 로컬에서 빌드 테스트
npm run build

# dist 폴더 확인
ls dist/

# 빌드 결과 미리보기
npm run preview
```

### ❌ Vercel 배포 후 빈 화면

**증상**: 배포는 성공했으나 사이트가 표시되지 않음

**원인**:
- 환경 변수 미설정
- 빌드 경로 오류

**해결 방법**:

1. Vercel Dashboard → Project → Settings → Environment Variables
2. 환경 변수 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deployments → Redeploy

### ❌ 배포 후 404 오류 (페이지를 찾을 수 없음)

**증상**: `/admin/login` 등 라우트에서 404

**해결 방법**:

Vercel에서 SPA 리다이렉트 설정:

```bash
# vercel.json 파일 생성 (프로젝트 루트)
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

그 후 다시 배포

---

## 4. 인증 문제

### ❌ 로그인 안 됨

**증상**: 올바른 이메일/비밀번호인데 로그인 실패

**해결 방법**:

1. Supabase Dashboard → Authentication → Users
2. 사용자 계정이 존재하는지 확인
3. 이메일 확인 여부 체크 (Confirm Email)
4. 비밀번호 재설정

```javascript
// 브라우저 콘솔에서 테스트
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'your-email@example.com',
  password: 'your-password'
})
console.log({ data, error })
```

### ❌ 로그인 후 자동 로그아웃

**증상**: 로그인 후 페이지 새로고침 시 로그아웃됨

**원인**: Session 저장 문제

**해결 방법**:

```javascript
// src/lib/supabase.js 확인
// persistSession이 true인지 확인
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true  // ← 이 부분 확인
    }
  }
)
```

### ❌ 관리자 페이지 접근 불가

**증상**: `/admin/dashboard`에서 계속 로그인 페이지로 리다이렉트

**해결 방법**:

```javascript
// 브라우저 콘솔에서 세션 확인
const { data: { session } } = await supabase.auth.getSession()
console.log(session)

// null이 나오면 다시 로그인
```

---

## 5. 데이터베이스 문제

### ❌ 데이터가 표시되지 않음

**증상**: 시간표/수업료 등이 빈 화면

**원인**:
- 테이블 미생성
- RLS 정책 문제
- 데이터 없음

**해결 방법**:

```sql
-- Supabase SQL Editor에서 확인

-- 1. 테이블 존재 확인
SELECT * FROM schedules;
SELECT * FROM pricing;

-- 2. 데이터 있는지 확인
SELECT COUNT(*) FROM schedules;

-- 3. RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'schedules';
```

**데이터가 없으면**:

```sql
-- schema.sql의 INSERT 문 다시 실행
INSERT INTO schedules (class_name, start_time, end_time, description) VALUES
('키즈 1부', '14:30', '15:30', '초등 저학년'),
-- ... 나머지
```

### ❌ "permission denied" 오류

**증상**: RLS 정책으로 인한 접근 거부

**해결 방법**:

```sql
-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- 공개 읽기 정책이 있는지 확인
-- 없으면 schema.sql에서 정책 부분 다시 실행
```

### ❌ INSERT/UPDATE 실패

**증상**: 관리자도 데이터 수정 불가

**해결 방법**:

```javascript
// 1. 로그인 상태 확인
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)  // null이면 로그인 필요

// 2. RLS 정책 확인 (authenticated 역할 필요)
```

---

## 6. Storage 문제

### ❌ 이미지 업로드 실패

**증상**: 이미지 선택 후 업로드 안 됨

**원인**:
- Storage 버킷 없음
- 정책 미설정
- 파일 크기 초과
- 로그인 안 됨

**해결 방법**:

```javascript
// 1. 버킷 존재 확인
const { data: buckets } = await supabase.storage.listBuckets()
console.log(buckets)  // 'news-images' 있는지 확인

// 2. 수동으로 버킷 생성
// Supabase Dashboard → Storage → New Bucket
// Name: news-images
// Public: true

// 3. 정책 확인
// Storage → news-images → Policies
// SELECT, INSERT, DELETE 정책 확인
```

### ❌ 업로드된 이미지가 표시되지 않음

**증상**: 업로드는 성공했으나 이미지 깨짐

**원인**: Public URL 생성 문제

**해결 방법**:

```javascript
// Public URL이 올바른지 확인
const { data } = supabase.storage
  .from('news-images')
  .getPublicUrl('filename.jpg')

console.log(data.publicUrl)
// https://xxxxx.supabase.co/storage/v1/object/public/news-images/filename.jpg

// 브라우저에서 직접 URL 접속해보기
```

### ❌ 이미지 삭제 안 됨

**증상**: 삭제 버튼 클릭해도 이미지 남아있음

**해결 방법**:

```javascript
// 1. Storage에서 수동 삭제
// Supabase Dashboard → Storage → news-images
// 파일 선택 후 Delete

// 2. DB에서도 삭제
DELETE FROM news_posts WHERE image_url LIKE '%filename.jpg%';
```

---

## 7. 이메일 발송 문제

### ❌ 문의 제출 후 이메일 안 옴

**증상**: 문의 폼 제출은 성공했으나 이메일 수신 안 됨

**원인**:
- Edge Function 미배포
- Webhook 미설정
- Resend API Key 오류
- 스팸함 행

**해결 방법**:

```bash
# 1. Edge Function 배포 확인
supabase functions list

# 2. Function 로그 확인
supabase functions logs send-inquiry-email

# 3. Webhook 확인
# Supabase Dashboard → Database → Webhooks
# send-inquiry-email 있는지 확인

# 4. Secrets 확인
supabase secrets list
# RESEND_API_KEY 있는지 확인
```

**수동 테스트**:

```bash
# Edge Function 수동 호출
curl -X POST \
  'https://xxxxx.supabase.co/functions/v1/send-inquiry-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"record": {"sender_name": "테스트", "phone": "010-1234-5678", "message": "테스트 문의"}}'
```

### ❌ Edge Function 배포 오류

**증상**: `supabase functions deploy` 실패

**해결 방법**:

```bash
# 1. Supabase CLI 최신 버전인지 확인
supabase --version

# 2. 프로젝트 연결 확인
supabase link --project-ref your-project-ref

# 3. Function 재배포
supabase functions deploy send-inquiry-email --no-verify-jwt

# 4. Deno 런타임 오류 시
# supabase/functions/send-inquiry-email/index.ts
# import 경로 확인
```

---

## 8. UI/UX 문제

### ❌ 애니메이션 작동 안 함

**증상**: Framer Motion 애니메이션이 표시되지 않음

**해결 방법**:

```bash
# 1. framer-motion 설치 확인
npm list framer-motion

# 2. 미설치 시
npm install framer-motion

# 3. 개발 서버 재시작
```

### ❌ 반응형 레이아웃 깨짐

**증상**: 모바일에서 레이아웃이 이상함

**해결 방법**:

1. 브라우저 개발자 도구 → Device Toolbar (Ctrl+Shift+M)
2. 다양한 화면 크기에서 테스트
3. Tailwind CSS 브레이크포인트 확인:
   - `sm:` 640px
   - `md:` 768px
   - `lg:` 1024px

### ❌ 스타일이 적용되지 않음

**증상**: Tailwind CSS 클래스가 작동 안 함

**해결 방법**:

```bash
# 1. Tailwind CSS 빌드 확인
npm run build

# 2. tailwind.config.js의 content 경로 확인
content: [
  "./index.html",
  "./src/**/*.{js,jsx}",  // ← 이 경로가 맞는지 확인
]

# 3. PostCSS 설정 확인
# postcss.config.js 파일 존재 확인
```

### ❌ 폰트가 로드되지 않음

**증상**: Inter 폰트 대신 기본 폰트 표시

**해결 방법**:

```html
<!-- index.html에서 Google Fonts 링크 확인 -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## 일반적인 디버깅 팁

### 브라우저 개발자 도구 활용

```javascript
// 1. Console 로그 확인
console.log('Debug:', data)

// 2. Network 탭에서 API 요청 확인
// - Status Code (200, 401, 500 등)
// - Response 내용
// - Request Headers

// 3. Application 탭에서 저장된 데이터 확인
// - localStorage
// - sessionStorage
// - Cookies
```

### Supabase 로그 확인

1. Supabase Dashboard → Logs
2. API Logs, Database Logs, Auth Logs 확인
3. 시간대별 오류 추적

### Vercel 로그 확인

1. Vercel Dashboard → Project → Logs
2. Runtime Logs 확인
3. Build Logs 확인

---

## 긴급 복구 절차

### 전체 시스템 재설정

```bash
# 1. 로컬 환경 초기화
rm -rf node_modules package-lock.json dist
npm install
npm run build

# 2. Supabase 재설정
# - SQL Editor에서 schema.sql 재실행
# - Storage 버킷 재생성
# - RLS 정책 재적용

# 3. Vercel 재배포
git add .
git commit -m "Reset: Clean deployment"
git push origin main
```

### 데이터베이스 복구

```sql
-- 1. 백업에서 복구 (Supabase Dashboard → Database → Backups)

-- 2. 수동 데이터 재입력
-- schema.sql의 INSERT 문 실행
```

---

## 도움이 더 필요하신가요?

### 문제가 해결되지 않으면

1. 오류 메시지를 정확히 복사
2. 브라우저 콘솔 스크린샷
3. 네트워크 탭 스크린샷
4. 수행한 단계 기록

위 정보를 개발자에게 전달하면 빠르게 해결할 수 있습니다.

### 유용한 리소스

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [Vercel Documentation](https://vercel.com/docs)
