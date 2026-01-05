# OSJ 청라 주짓수 - 랜딩 페이지 & 관리 시스템

> 차이를 인정하며 함께 성장하는 열린 공동체

프리미엄 주짓수 도장 브랜드를 위한 미니멀리즘 디자인의 랜딩 페이지와 통합 관리 시스템입니다.

## 주요 기능

### 사용자 페이지
- **히어로 섹션**: Framer Motion을 활용한 로고 애니메이션
- **브랜드 스토리**: 칼 포퍼의 '열린 사회' 철학과 10년 전통 소개
- **지도자 프로필**: IBJJF 공인 블랙벨트 이현준 관장 소개
- **프로그램 안내**: 시간표 및 수업료 정보 (Supabase DB 연동)
- **최근 소식**: Instagram 스타일 3열 그리드 갤러리
- **문의 폼**: 실시간 문의 접수 및 이메일 자동 발송

### 관리자 대시보드
- **통계 분석**: 방문자 수, 문의 클릭 로그 시각화
- **콘텐츠 관리**: 소식 이미지 업로드 및 관리
- **스케줄 관리**: 시간표 실시간 수정
- **수업료 관리**: 가격 및 혜택 정보 업데이트
- **문의 관리**: 접수된 문의 확인 및 아카이빙

## 기술 스택

- **Frontend**: React.js, Vite, Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Charts**: Recharts
- **Deployment**: Vercel

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Storage에서 `news-images` 버킷이 자동 생성되었는지 확인

### 3. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일에 Supabase 정보 입력:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 관리자 계정 생성

Supabase Dashboard → Authentication → Users에서 관리자 이메일 계정 생성

### 5. Edge Function 배포 (이메일 알림)

```bash
# Supabase CLI 설치
npm install -g supabase

# Supabase 로그인
supabase login

# Edge Function 배포
supabase functions deploy send-inquiry-email

# Resend API 키 설정 (또는 다른 이메일 서비스)
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

**참고**: Edge Function은 [Resend](https://resend.com) 서비스를 사용합니다. 무료 플랜으로 시작할 수 있습니다.

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

## 배포

### Vercel 배포

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 Import
3. 환경 변수 설정:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy 클릭

```bash
# 또는 Vercel CLI 사용
npm install -g vercel
vercel
```

## 사용 가이드

### 관리자 로그인

1. `/admin/login` 페이지 접속
2. Supabase에서 생성한 관리자 이메일로 로그인

### 소식 업로드

1. 관리자 대시보드 → 소식 관리 탭
2. 이미지 드래그 앤 드롭 또는 클릭하여 업로드
3. 업로드된 이미지는 자동으로 메인 페이지에 표시

### 시간표/수업료 수정

1. 해당 탭으로 이동
2. 수정 아이콘 클릭
3. 내용 수정 후 저장

### 문의 확인

1. 문의 탭에서 모든 접수된 문의 확인
2. 각 문의는 자동으로 관리자 이메일로 전송됨

## 데이터베이스 구조

### Tables

- **news_posts**: 소식 게시물
- **schedules**: 수업 시간표
- **pricing**: 수업료 정보
- **inquiries**: 문의 내역
- **analytics**: 방문자 통계

자세한 스키마는 `supabase/schema.sql` 참조

## 디자인 컨셉

- **컬러**: White (#FFFFFF), Black (#000000), Red (#E53E3E)
- **타이포그래피**: Inter 폰트
- **스타일**: 미니멀리즘, 고품격
- **애니메이션**: 부드러운 페이드인/슬라이드 효과

## 프로젝트 구조

```
01-청라주짓수/
├── public/
│   ├── image.png              # OSJ 로고
│   └── OSJ청라주짓수+랜딩홈페이지+제작+가안.docx
├── src/
│   ├── components/
│   │   ├── Header.jsx         # 네비게이션 헤더
│   │   ├── HeroSection.jsx    # 히어로 섹션
│   │   ├── AboutSection.jsx   # 소개 섹션
│   │   ├── ProgramsSection.jsx # 프로그램 안내
│   │   ├── NewsSection.jsx    # 소식 그리드
│   │   ├── ContactSection.jsx # 문의 폼
│   │   └── Footer.jsx         # 푸터
│   ├── pages/
│   │   ├── LandingPage.jsx    # 메인 랜딩 페이지
│   │   ├── AdminLogin.jsx     # 관리자 로그인
│   │   └── AdminDashboard.jsx # 관리자 대시보드
│   ├── lib/
│   │   └── supabase.js        # Supabase 클라이언트
│   ├── App.jsx                # 라우터 설정
│   ├── main.jsx               # 엔트리 포인트
│   └── index.css              # 글로벌 스타일
├── supabase/
│   ├── schema.sql             # DB 스키마
│   └── functions/
│       └── send-inquiry-email/ # 이메일 Edge Function
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 커스터마이징

### 연락처 정보 수정

[src/components/ContactSection.jsx](src/components/ContactSection.jsx) 파일에서 다음 정보 수정:

- 주소
- 전화번호
- 이메일
- 인스타그램 링크

### 로고 변경

`public/image.png` 파일을 원하는 로고 이미지로 교체

### 색상 변경

[tailwind.config.js](tailwind.config.js)의 `theme.extend.colors` 섹션 수정

## 문제 해결

### Edge Function이 작동하지 않을 때

1. Supabase Dashboard → Edge Functions에서 함수 배포 확인
2. Secrets 설정 확인 (`RESEND_API_KEY`)
3. Function 로그 확인

### 이미지가 업로드되지 않을 때

1. Storage → news-images 버킷이 public으로 설정되었는지 확인
2. Storage Policies가 올바르게 설정되었는지 확인
3. 관리자로 로그인되어 있는지 확인

### 데이터가 표시되지 않을 때

1. Supabase Table Editor에서 데이터 확인
2. RLS (Row Level Security) 정책 확인
3. 브라우저 콘솔에서 에러 확인

## 라이선스

이 프로젝트는 OSJ 청라 주짓수 전용으로 제작되었습니다.

## 문의

기술 지원이 필요하시면 개발자에게 문의해주세요.
