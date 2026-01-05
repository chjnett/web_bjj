# 시스템 아키텍처

## 전체 시스템 구조

```
┌─────────────────────────────────────────────────────────────┐
│                        사용자 브라우저                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Landing Page │  │ Admin Login  │  │   Dashboard  │      │
│  │   (Public)   │  │  (Protected) │  │  (Protected) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           │                                 │
│                    React Router                             │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
        ┌───────────────────────────────────────┐
        │         Vercel (Hosting)              │
        │  - Static Site Hosting                │
        │  - Edge Network (CDN)                 │
        │  - Auto SSL/HTTPS                     │
        └───────────────┬───────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    ┌───────────────┐      ┌───────────────┐
    │   Supabase    │      │    Resend     │
    │   Platform    │      │  (Email API)  │
    └───────────────┘      └───────────────┘
```

---

## Supabase 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                     Supabase Platform                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │           PostgreSQL Database              │         │
│  ├────────────────────────────────────────────┤         │
│  │                                            │         │
│  │  Tables:                                   │         │
│  │  ┌──────────────┐  ┌──────────────┐      │         │
│  │  │ news_posts   │  │  schedules   │      │         │
│  │  ├──────────────┤  ├──────────────┤      │         │
│  │  │ pricing      │  │  inquiries   │      │         │
│  │  ├──────────────┤  ├──────────────┤      │         │
│  │  │ analytics    │  │     ...      │      │         │
│  │  └──────────────┘  └──────────────┘      │         │
│  │                                            │         │
│  │  RLS Policies: ✓ Enabled                 │         │
│  │  Indexes: ✓ Optimized                    │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │              Authentication                │         │
│  ├────────────────────────────────────────────┤         │
│  │  - Email/Password Auth                    │         │
│  │  - Session Management                     │         │
│  │  - JWT Tokens                             │         │
│  │  - Admin Role Management                  │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │                 Storage                    │         │
│  ├────────────────────────────────────────────┤         │
│  │  Bucket: news-images (Public)             │         │
│  │  - Image Upload                            │         │
│  │  - Auto Public URL Generation              │         │
│  │  - CDN Distribution                        │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │            Edge Functions                  │         │
│  ├────────────────────────────────────────────┤         │
│  │  Function: send-inquiry-email              │         │
│  │  - Triggered by DB Insert                  │         │
│  │  - Calls Resend API                        │         │
│  │  - Sends HTML Email                        │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 데이터 흐름

### 1. 사용자 방문 (Page Visit)

```
사용자 브라우저
      │
      │ 1. 페이지 접속
      ▼
  Landing Page
      │
      │ 2. 방문 이벤트 추적
      ▼
  supabase.js
  trackEvent('page_visit')
      │
      │ 3. 데이터 저장
      ▼
  Supabase DB
  analytics 테이블
      │
      │ 4. Visitor ID 생성/저장
      ▼
  localStorage
  (osj_visitor_id)
```

### 2. 프로그램 정보 조회

```
Landing Page
      │
      │ 1. 컴포넌트 마운트
      ▼
ProgramsSection.jsx
      │
      │ 2. 데이터 요청
      ▼
  supabase
    .from('schedules')
    .select('*')
      │
      │ 3. RLS 정책 확인
      │    (public read allowed)
      ▼
  Supabase DB
      │
      │ 4. 데이터 반환
      ▼
ProgramsSection.jsx
      │
      │ 5. UI 렌더링
      ▼
시간표 & 수업료 카드 표시
```

### 3. 문의 제출 (Inquiry Submission)

```
ContactSection.jsx
      │
      │ 1. 폼 제출
      ▼
  handleSubmit()
      │
      ├─────────────────┐
      │                 │
      │ 2. 통계 추적    │ 3. 문의 저장
      ▼                 ▼
trackEvent()     supabase.insert()
      │                 │
      ▼                 ▼
  analytics       inquiries 테이블
  테이블                │
                        │ 4. INSERT 트리거
                        ▼
                  Database Webhook
                        │
                        │ 5. Edge Function 호출
                        ▼
              send-inquiry-email
                        │
                        │ 6. Resend API 호출
                        ▼
                    Resend
                        │
                        │ 7. 이메일 발송
                        ▼
            osjchungra@naver.com
                        │
                        ▼
              관리자 수신 확인
```

### 4. 관리자 로그인 (Admin Login)

```
AdminLogin.jsx
      │
      │ 1. 이메일/비밀번호 입력
      ▼
  handleLogin()
      │
      │ 2. 인증 요청
      ▼
supabase.auth
  .signInWithPassword()
      │
      │ 3. 자격 증명 검증
      ▼
  Supabase Auth
      │
      ├─────────────┬─────────────┐
      │ Success     │   Failure   │
      ▼             ▼
  JWT Token    Error Message
  생성               │
      │             ▼
      │      로그인 실패 표시
      │
      │ 4. 세션 저장
      ▼
  localStorage
  (supabase.auth.token)
      │
      │ 5. 리다이렉트
      ▼
/admin/dashboard
```

### 5. 소식 이미지 업로드 (Image Upload)

```
AdminDashboard.jsx
      │
      │ 1. 이미지 선택
      ▼
handleImageUpload()
      │
      │ 2. 파일명 생성
      │    (timestamp.ext)
      ▼
supabase.storage
  .from('news-images')
  .upload()
      │
      │ 3. Storage 정책 확인
      │    (authenticated user)
      ▼
  Supabase Storage
  news-images 버킷
      │
      │ 4. Public URL 생성
      ▼
supabase.storage
  .getPublicUrl()
      │
      │ 5. DB에 URL 저장
      ▼
supabase
  .from('news_posts')
  .insert({ image_url })
      │
      │ 6. 데이터 갱신
      ▼
  fetchAllData()
      │
      │ 7. UI 업데이트
      ▼
관리자 대시보드
소식 그리드에 표시
      │
      │ 8. 사용자에게도 즉시 반영
      ▼
  Landing Page
  NewsSection.jsx
```

---

## 보안 레이어

```
┌─────────────────────────────────────────┐
│           Security Layers               │
├─────────────────────────────────────────┤
│                                         │
│  Layer 1: Network Security              │
│  ┌────────────────────────────────┐    │
│  │ - HTTPS/SSL (Vercel)           │    │
│  │ - CORS (Supabase)              │    │
│  └────────────────────────────────┘    │
│                                         │
│  Layer 2: Authentication                │
│  ┌────────────────────────────────┐    │
│  │ - JWT Tokens                   │    │
│  │ - Session Management           │    │
│  │ - Protected Routes             │    │
│  └────────────────────────────────┘    │
│                                         │
│  Layer 3: Database Security             │
│  ┌────────────────────────────────┐    │
│  │ - Row Level Security (RLS)     │    │
│  │ - Role-based Policies          │    │
│  │ - SQL Injection Prevention     │    │
│  └────────────────────────────────┘    │
│                                         │
│  Layer 4: Application Security          │
│  ┌────────────────────────────────┐    │
│  │ - XSS Prevention (React)       │    │
│  │ - Input Validation             │    │
│  │ - Environment Variables        │    │
│  └────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

## RLS (Row Level Security) 정책

```sql
-- Public Read Access
┌─────────────────────────────────────┐
│  Anyone can SELECT from:            │
│  - news_posts                       │
│  - schedules                        │
│  - pricing                          │
└─────────────────────────────────────┘

-- Public Write Access
┌─────────────────────────────────────┐
│  Anyone can INSERT into:            │
│  - inquiries                        │
│  - analytics                        │
└─────────────────────────────────────┘

-- Authenticated Access
┌─────────────────────────────────────┐
│  Authenticated users can:           │
│  - INSERT/UPDATE/DELETE news_posts  │
│  - UPDATE schedules                 │
│  - UPDATE pricing                   │
│  - SELECT inquiries                 │
│  - SELECT analytics                 │
└─────────────────────────────────────┘
```

---

## 성능 최적화 전략

### Frontend Optimization

```
┌─────────────────────────────────────┐
│  1. Vite Build Optimization         │
│     - Tree shaking                  │
│     - Code minification             │
│     - Asset optimization            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  2. React Performance               │
│     - Component memoization         │
│     - Lazy loading (routes)         │
│     - useInView (animations)        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  3. Asset Management                │
│     - Image lazy loading            │
│     - Supabase CDN                  │
│     - Vercel Edge Network           │
└─────────────────────────────────────┘
```

### Backend Optimization

```
┌─────────────────────────────────────┐
│  1. Database Queries                │
│     - Indexed columns               │
│     - Query limits (.limit())       │
│     - Optimized SELECT fields       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  2. Caching                         │
│     - Visitor ID (localStorage)     │
│     - Supabase client cache         │
│     - Browser caching (Vercel)      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  3. Edge Functions                  │
│     - Geographically distributed    │
│     - Fast cold starts              │
│     - Async email sending           │
└─────────────────────────────────────┘
```

---

## 배포 아키텍처

```
┌────────────────────────────────────────────────────┐
│                  Developer                         │
└───────────────────┬────────────────────────────────┘
                    │
                    │ git push
                    ▼
            ┌───────────────┐
            │    GitHub     │
            │  Repository   │
            └───────┬───────┘
                    │
                    │ Auto Deploy
                    ▼
            ┌───────────────┐
            │    Vercel     │
            │  Build System │
            ├───────────────┤
            │ 1. npm install│
            │ 2. npm build  │
            │ 3. Deploy     │
            └───────┬───────┘
                    │
                    │ Distribution
                    ▼
        ┌───────────────────────┐
        │   Vercel Edge Network │
        │    (Global CDN)       │
        ├───────────────────────┤
        │  - Americas           │
        │  - Europe             │
        │  - Asia Pacific       │
        └───────────────────────┘
                    │
                    │ HTTPS
                    ▼
            ┌───────────────┐
            │  End Users    │
            │  (Worldwide)  │
            └───────────────┘
```

---

## 모니터링 및 로깅

```
┌─────────────────────────────────────────┐
│           Monitoring Stack              │
├─────────────────────────────────────────┤
│                                         │
│  Vercel Dashboard                       │
│  ├─ Deployment Status                  │
│  ├─ Build Logs                          │
│  ├─ Function Logs                       │
│  └─ Analytics (optional)                │
│                                         │
│  Supabase Dashboard                     │
│  ├─ Database Stats                      │
│  ├─ API Requests                        │
│  ├─ Storage Usage                       │
│  ├─ Auth Logs                           │
│  └─ Edge Function Logs                  │
│                                         │
│  Browser DevTools                       │
│  ├─ Console Errors                      │
│  ├─ Network Requests                    │
│  └─ Performance Metrics                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 백업 및 복구 전략

```
┌─────────────────────────────────────────┐
│          Backup Strategy                │
├─────────────────────────────────────────┤
│                                         │
│  Database (Supabase)                    │
│  ├─ Auto Daily Backups (7 days)        │
│  ├─ Point-in-time Recovery             │
│  └─ Manual Export (SQL dump)           │
│                                         │
│  Storage (Supabase)                     │
│  ├─ CDN Replication                    │
│  └─ Manual Download                     │
│                                         │
│  Code (GitHub)                          │
│  ├─ Version Control                     │
│  ├─ Branch Protection                   │
│  └─ Release Tags                        │
│                                         │
│  Environment Variables                  │
│  ├─ Vercel Dashboard                    │
│  └─ Secure Documentation                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 스케일링 계획

### Current Capacity
- **Users**: ~10,000 visits/month
- **Database**: 500MB (Free tier)
- **Storage**: 1GB (Free tier)
- **Bandwidth**: Unlimited (Vercel)

### Scaling Options

```
┌─────────────────────────────────────────┐
│  If traffic increases:                  │
├─────────────────────────────────────────┤
│  1. Upgrade Supabase to Pro ($25/mo)   │
│     - 8GB Database                      │
│     - 100GB Storage                     │
│     - Auto Scaling                      │
│                                         │
│  2. Optimize Queries                    │
│     - Add database indexes              │
│     - Implement pagination              │
│     - Enable query caching              │
│                                         │
│  3. CDN Optimization                    │
│     - Image optimization                │
│     - Static asset caching              │
│     - Edge function optimization        │
│                                         │
└─────────────────────────────────────────┘
```

---

이 문서는 시스템의 전체 아키텍처를 시각적으로 설명합니다.
추가 질문이나 명확한 설명이 필요한 부분이 있으시면 개발자에게 문의하세요.
