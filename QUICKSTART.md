# 빠른 시작 가이드

이 가이드는 가장 빠르게 프로젝트를 실행하는 방법을 안내합니다.

## 5분 안에 시작하기

### 1단계: 의존성 설치 (1분)

```bash
npm install
```

### 2단계: Supabase 설정 (2분)

1. https://supabase.com 접속 후 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Settings → API에서 URL과 Key 복사

### 3단계: 환경 변수 설정 (30초)

`.env` 파일 생성:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

### 4단계: 개발 서버 실행 (30초)

```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

### 5단계: 관리자 계정 생성 (1분)

1. Supabase → Authentication → Users
2. 관리자 이메일/비밀번호로 사용자 생성
3. `/admin/login`에서 로그인

## 완료!

이제 다음을 할 수 있습니다:
- ✅ 메인 페이지 확인
- ✅ 관리자 대시보드 접속
- ✅ 소식 이미지 업로드
- ✅ 시간표/수업료 수정

## 다음 단계

### 이메일 알림 설정 (선택사항)

자세한 내용은 [SETUP_GUIDE.md](SETUP_GUIDE.md)의 "4. 이메일 서비스 설정" 참조

### 배포

```bash
# Vercel에 배포
npm install -g vercel
vercel
```

## 도움이 필요하신가요?

- 📖 [README.md](README.md) - 전체 프로젝트 개요
- 📚 [SETUP_GUIDE.md](SETUP_GUIDE.md) - 상세 설정 가이드
