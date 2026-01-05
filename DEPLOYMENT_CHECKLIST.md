# 배포 체크리스트

프로덕션 배포 전에 확인해야 할 항목들입니다.

## 필수 설정

### Supabase

- [ ] 프로젝트 생성 완료
- [ ] `schema.sql` 실행 완료
- [ ] 모든 테이블 생성 확인 (5개)
- [ ] Storage 버킷 `news-images` 생성 및 Public 설정
- [ ] Row Level Security (RLS) 정책 활성화 확인
- [ ] 관리자 계정 생성

### 환경 변수

- [ ] `.env` 파일 생성
- [ ] `VITE_SUPABASE_URL` 설정
- [ ] `VITE_SUPABASE_ANON_KEY` 설정
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인

### 연락처 정보 업데이트

- [ ] `ContactSection.jsx` - 실제 주소 입력
- [ ] `ContactSection.jsx` - 실제 전화번호 입력
- [ ] `ContactSection.jsx` - 실제 이메일 주소 확인
- [ ] `ContactSection.jsx` - Google Maps iframe URL 업데이트
- [ ] `NewsSection.jsx` - Instagram URL 업데이트
- [ ] `Footer.jsx` - Instagram URL 업데이트

### 로고 및 이미지

- [ ] `public/image.png` - 최종 로고 파일 확인
- [ ] 파비콘 설정 확인

## 선택 설정

### 이메일 알림

- [ ] Resend 계정 생성
- [ ] API Key 생성
- [ ] Edge Function 배포
- [ ] Webhook 설정
- [ ] 테스트 이메일 발송 확인

### 분석 및 모니터링

- [ ] Google Analytics 설정 (선택사항)
- [ ] Vercel Analytics 활성화

### SEO 최적화

- [ ] `index.html` - meta description 확인
- [ ] `index.html` - title 확인
- [ ] Open Graph 태그 추가 (선택사항)

## Vercel 배포

### 배포 전

- [ ] `npm run build` 로컬 빌드 테스트
- [ ] 빌드 오류 없는지 확인
- [ ] GitHub에 코드 푸시

### Vercel 설정

- [ ] Vercel 프로젝트 생성
- [ ] GitHub 저장소 연동
- [ ] 환경 변수 설정
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] 첫 배포 성공 확인

### 도메인 설정 (선택사항)

- [ ] 커스텀 도메인 추가
- [ ] DNS 레코드 설정
- [ ] SSL 인증서 자동 발급 확인

## 배포 후 테스트

### 기능 테스트

- [ ] 메인 페이지 로딩 확인
- [ ] 네비게이션 작동 확인
- [ ] 모든 섹션 스크롤 확인
- [ ] 반응형 디자인 확인 (모바일, 태블릿)

### 관리자 기능

- [ ] `/admin/login` 로그인 확인
- [ ] 대시보드 통계 표시 확인
- [ ] 소식 이미지 업로드 테스트
- [ ] 시간표 수정 테스트
- [ ] 수업료 수정 테스트

### 문의 기능

- [ ] 문의 폼 작성 및 제출 테스트
- [ ] Supabase `inquiries` 테이블에 데이터 저장 확인
- [ ] 이메일 수신 확인 (Edge Function 설정한 경우)
- [ ] 관리자 대시보드에서 문의 확인

### 성능 테스트

- [ ] Lighthouse 점수 확인 (Performance, Accessibility, SEO)
- [ ] 이미지 최적화 확인
- [ ] 페이지 로드 속도 확인

### 브라우저 호환성

- [ ] Chrome 테스트
- [ ] Safari 테스트
- [ ] Firefox 테스트
- [ ] Edge 테스트
- [ ] 모바일 브라우저 테스트

## 보안 체크

- [ ] Supabase RLS 정책 활성화 확인
- [ ] API Keys는 환경 변수로만 관리
- [ ] `.env` 파일이 Git에 커밋되지 않았는지 확인
- [ ] 관리자 비밀번호 강도 확인
- [ ] HTTPS 연결 확인

## 백업 및 복구

- [ ] Supabase 자동 백업 설정
- [ ] 데이터베이스 수동 백업 방법 숙지
- [ ] 환경 변수 백업 (안전한 곳에 저장)

## 문서화

- [ ] README.md 최종 확인
- [ ] 관리자에게 사용 가이드 전달
- [ ] 긴급 연락처 정보 정리

## 런칭 후

- [ ] 운영 환경 모니터링 시작
- [ ] 사용자 피드백 수집 계획
- [ ] 정기 업데이트 일정 수립

---

## 체크리스트 사용 방법

1. 위에서부터 순서대로 체크
2. 각 항목 완료 시 `[ ]`를 `[x]`로 변경
3. 모든 필수 항목 완료 후 배포
4. 선택 항목은 필요에 따라 진행

## 문제 발생 시

1. [SETUP_GUIDE.md](SETUP_GUIDE.md)의 "문제 해결" 섹션 참조
2. Supabase/Vercel 로그 확인
3. 브라우저 개발자 도구 콘솔 확인

---

**축하합니다! 모든 체크리스트를 완료하셨다면 프로덕션 배포 준비가 완료되었습니다!** 🎉
