# 🔐 환경변수 설정 가이드

## 🔧 설정 방법

1. 프로젝트 루트에 `.env.local` 파일을 생성하세요
2. 아래 템플릿을 복사하여 실제 값으로 변경하세요
3. **🚨 절대 GitHub에 실제 API 키를 업로드하지 마세요!**

## 📝 환경변수 템플릿

```bash
# ===========================================
# M-CENTER 경영지도센터 - 환경변수 설정
# ===========================================

# ===========================================
# Google Apps Script 설정 (필수 - 실시간 데이터 수집)
# ===========================================
# Google Apps Script 웹앱 URL (2025.6.17 업데이트)
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjlPkXAy1JSZCxhJy00AazUvHbWwR5mpbJwY8Wo7EdJAPvSFn7bPZwZZcVf0icXh1inySn7aEpws1y4Kae-L2ZIajbzwY5iHEBnOznoKkS91UkNIm-OId2C7eZPR3CHSINoNdcskUwA1HhhC2hKgXqsazD9gtX_lAuioR1yMwsawhbpHF5MzGKYvcEVOtkdH2BqWu00sbHtebiNaADZNvsxuZZ2k6IpRruov5jg4BzpFxttmoTdAQTdIe0EQLnM7OCuGNf5gK1fruLiT4CKagjC04WJTQ&lib=MSO6FP3_fOVcXPyKa1j-76EzN9sd4IQmq

# Google Apps Script 스크립트 ID
NEXT_PUBLIC_GOOGLE_SCRIPT_ID=1eq4jLxuXgVfjH76MJRPq6aetIybwNjD2IpvLWgY3wlfDLPW2h2hzEjAC

# Google Apps Script 배포 ID  
NEXT_PUBLIC_GOOGLE_SCRIPT_DEPLOYMENT_ID=AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX

# ===========================================
# Google Sheets 설정 (필수)
# ===========================================
# 진단/상담 신청 데이터를 저장할 Google Sheets ID (2025.6.17 업데이트)
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM

# Google Sheets 공유 URL
NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/edit?usp=sharing

# ===========================================
# EmailJS 설정 (이메일 자동 송부용)
# ===========================================
# EmailJS 서비스 ID
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qd9eycz

# EmailJS Public Key  
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=268NPLwN54rPvEias

# ===========================================
# Gemini AI API 설정 (AI 챗봇용) - 필수
# ===========================================
# Google Gemini API 키 (AI 상담사 챗봇용)
GEMINI_API_KEY=your_gemini_api_key_here

# ===========================================
# OpenAI API 설정 (AI 진단용)
# ===========================================
# OpenAI API 키
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE

# ===========================================
# 개발/배포 환경 설정
# ===========================================
NODE_ENV=development

# API 설정
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# 기본 URL (배포 시 실제 도메인으로 변경)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ===========================================
# 추가 보안 설정
# ===========================================
# JWT Secret (향후 인증 기능용)
JWT_SECRET=mcenter-jwt-secret-key-2025

# M-CENTER 관리자 이메일
ADMIN_EMAIL=hongik423@gmail.com

# 알림 설정
NOTIFICATION_ENABLED=true
AUTO_REPLY_ENABLED=true
```

## 🎯 실제 운영 환경변수 (복사해서 .env.local에 붙여넣으세요)

```bash
# M-CENTER 운영 환경변수 (실제 API 키 포함) - 2025.6.17 업데이트
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjlPkXAy1JSZCxhJy00AazUvHbWwR5mpbJwY8Wo7EdJAPvSFn7bPZwZZcVf0icXh1inySn7aEpws1y4Kae-L2ZIajbzwY5iHEBnOznoKkS91UkNIm-OId2C7eZPR3CHSINoNdcskUwA1HhhC2hKgXqsazD9gtX_lAuioR1yMwsawhbpHF5MzGKYvcEVOtkdH2BqWu00sbHtebiNaADZNvsxuZZ2k6IpRruov5jg4BzpFxttmoTdAQTdIe0EQLnM7OCuGNf5gK1fruLiT4CKagjC04WJTQ&lib=MSO6FP3_fOVcXPyKa1j-76EzN9sd4IQmq
NEXT_PUBLIC_GOOGLE_SCRIPT_ID=1eq4jLxuXgVfjH76MJRPq6aetIybwNjD2IpvLWgY3wlfDLPW2h2hzEjAC
NEXT_PUBLIC_GOOGLE_SCRIPT_DEPLOYMENT_ID=AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM
NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/edit?usp=sharing
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qd9eycz
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=268NPLwN54rPvEias
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=mcenter-jwt-secret-key-2025
ADMIN_EMAIL=hongik423@gmail.com
NOTIFICATION_ENABLED=true
AUTO_REPLY_ENABLED=true
```

## 🚀 빠른 설정 가이드

### 1단계: .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 위의 운영 환경변수를 복사하여 붙여넣으세요.

### 2단계: 의존성 설치
```bash
npm install emailjs-com openai
```

### 3단계: 개발 서버 실행
```bash
npm run dev
```

### 4단계: 기능 테스트
- AI 무료진단 신청 테스트
- 구글시트 데이터 저장 확인
- 이메일 자동 발송 확인

## 🔑 API 키 발급 방법

### 🤖 Google Gemini API 키 발급 (AI 상담사용 - 필수)
1. [Google AI Studio](https://aistudio.google.com/) 접속
2. "Get API Key" 클릭
3. 새 프로젝트 생성 또는 기존 프로젝트 선택
4. "Create API Key" 클릭하여 키 생성
5. 생성된 키를 복사하여 `GEMINI_API_KEY`에 설정

### 🚀 Google Apps Script 설정 (필수)
1. [Google Apps Script](https://script.google.com/) 접속
2. 새 프로젝트 생성 후 제공된 코드 입력
3. **배포** → **새 배포** → **웹 앱** 선택
4. **실행 사용자**: 나, **액세스 권한**: 모든 사용자
5. 생성된 웹앱 URL을 `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`에 설정

### 📊 Google Sheets 설정 (필수)
1. [Google Sheets](https://sheets.google.com/) 에서 새 시트 생성
2. URL에서 시트 ID 추출: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
3. `NEXT_PUBLIC_GOOGLE_SHEETS_ID`에 설정

### 🔑 OpenAI API Key (선택사항)
1. [OpenAI Platform](https://platform.openai.com/) 접속
2. API Keys 메뉴로 이동
3. "Create new secret key" 클릭
4. 생성된 키를 `OPENAI_API_KEY`에 설정

### 📧 EmailJS 설정 (선택사항)
1. [EmailJS Dashboard](https://www.emailjs.com/) 접속
2. Service ID와 Public Key 확인
3. 각각 `NEXT_PUBLIC_EMAILJS_SERVICE_ID`와 `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`에 설정

## 🔒 보안 주의사항

### ❌ 절대 하지 말 것
- `.env.local` 파일을 Git에 커밋
- Discord, Slack 등에 API 키 공유
- 코드에 API 키 하드코딩
- 클라이언트 코드에서 `OPENAI_API_KEY` 사용
- 스크린샷에 API 키 노출

### ✅ 권장사항
- 환경변수로 모든 민감한 정보 관리
- 프로덕션과 개발 환경 키 분리
- 정기적인 API 키 rotation (3-6개월)
- GitHub Secrets 사용 (배포 시)
- 최소 권한 원칙 적용

## 🔍 보안 검증

### 자동 검증 기능
- 🔍 환경변수 존재 여부 확인
- 🔍 API 키 형식 검증 (`sk-` 시작)
- 🔍 개발 환경에서만 상세 로깅
- 🔍 프로덕션에서는 마스킹된 정보만 출력
- 🔍 GitHub Actions 자동 보안 검사

### 로컬 검증 방법
```bash
# 환경변수 설정 확인
npm run dev

# 보안 검사 실행
npm audit
npm run lint
npx tsc --noEmit

# 빌드 테스트
npm run build
```

## 🧪 설정 확인 방법

1. 환경변수 설정 후 `npm run dev` 실행
2. 브라우저 개발자 도구 콘솔에서 환경변수 상태 확인
3. 무료 진단 폼 테스트로 Google Sheets 연동 확인
4. AI 챗봇 테스트 (OpenAI API 키 설정 시)

## 🚀 배포 시 설정

### Vercel 배포
1. Vercel 대시보드에서 프로젝트 선택
2. Settings > Environment Variables 이동
3. 각 환경변수를 개별적으로 추가

### GitHub Secrets 설정
```yaml
# Repository > Settings > Secrets and variables > Actions
GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
GOOGLE_SCRIPT_URL: ${{ secrets.GOOGLE_SCRIPT_URL }}
GOOGLE_SHEETS_ID: ${{ secrets.GOOGLE_SHEETS_ID }}
EMAILJS_SERVICE_ID: ${{ secrets.EMAILJS_SERVICE_ID }}
EMAILJS_PUBLIC_KEY: ${{ secrets.EMAILJS_PUBLIC_KEY }}
```

## 🔧 트러블슈팅

### 환경변수가 인식되지 않는 경우
1. `.env.local` 파일명 확인
2. 변수명 오타 확인 (`NEXT_PUBLIC_` 접두사 포함)
3. 서버 재시작 (`npm run dev` 재실행)
4. 브라우저 캐시 클리어

### API 키 오류가 발생하는 경우
1. API 키 형식 확인 (OpenAI: `sk-` 시작)
2. API 키 유효성 확인
3. 계정 크레딧 잔액 확인
4. Rate limit 확인

### Google Apps Script 연동 오류
1. 웹앱 URL 정확성 확인
2. 스크립트 배포 상태 확인
3. 접근 권한 설정 확인 (모든 사용자)
4. CORS 정책 확인

## 🚨 보안 긴급 대응

### API 키 노출 시
1. 🔴 **즉시 키 무효화**
2. 🔄 **새 키 생성 및 교체**
3. 📧 **팀원에게 알림**
4. 📝 **인시던트 기록**
5. 🔍 **보안 정책 재검토**

## 📞 지원

- 📧 **기술 지원**: hongik423@gmail.com
- 🔒 **보안 문의**: hongik423@gmail.com (비공개)
- 📞 **긴급 연락**: 010-9251-9743

---

**⚠️ 중요**: 환경변수 설정은 보안의 핵심입니다. 이 가이드를 정확히 따라 설정해 주세요!

## 구글시트 설정 정보

- **배포 ID**: `AKfycbyNt7cHONKsZCFV0AA43tY_RewRpzooz8sHdUicoy0Z49nozUHe2M5zNumc8Lpv4wIK`
- **웹앱 URL**: https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjlPkXAy1JSZCxhJy00AazUvHbWwR5mpbJwY8Wo7EdJAPvSFn7bPZwZZcVf0icXh1inySn7aEpws1y4Kae-L2ZIajbzwY5iHEBnOznoKkS91UkNIm-OId2C7eZPR3CHSINoNdcskUwA1HhhC2hKgXqsazD9gtX_lAuioR1yMwsawhbpHF5MzGKYvcEVOtkdH2BqWu00sbHtebiNaADZNvsxuZZ2k6IpRruov5jg4BzpFxttmoTdAQTdIe0EQLnM7OCuGNf5gK1fruLiT4CKagjC04WJTQ&lib=MSO6FP3_fOVcXPyKa1j-76EzN9sd4IQmq
- **시트명**: `m_center_landingpage-request`

## 필드 구조

AI 무료진단기에서 수집하는 데이터 필드:

1. **제출일시** - 데이터 제출 시간
2. **회사명** - 기업명
3. **업종** - 사업 업종
4. **사업담당** - 사업담당자명
5. **직원수** - 직원 규모
6. **설립난도** - 사업 설립 어려움 정도
7. **주요고민** - 현재 주요 고민사항
8. **예상혜택** - 기대하는 혜택
9. **진행사업장** - 사업장 위치
10. **담당자명** - 연락 담당자명
11. **연락처** - 전화번호
12. **이메일** - 이메일 주소
13. **개인정보처리동의** - 개인정보 동의 여부

## 테스트 방법

### 1. Node.js 직접 테스트
```bash
node test-google-sheets.js
```

### 2. 웹 인터페이스 테스트
```bash
npm run dev
# http://localhost:3000 접속 후 AI 무료진단기 사용
```

### 3. API 직접 호출 테스트
```bash
curl -X POST http://localhost:3000/api/save-diagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "submitDate": "2024-01-01 10:00:00",
    "formType": "AI_무료진단",
    "companyName": "테스트회사",
    "industry": "it",
    "businessManager": "김담당",
    "employeeCount": "6-10명",
    "establishmentDifficulty": "보통",
    "mainConcerns": "테스트 고민",
    "expectedBenefits": "테스트 혜택",
    "businessLocation": "서울시",
    "contactName": "홍길동",
    "contactPhone": "010-1234-5678",
    "contactEmail": "test@test.com",
    "privacyConsent": true
  }'
```