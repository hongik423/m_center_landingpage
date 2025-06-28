# 🚀 M-CENTER Vercel 배포 완전 가이드

## 📋 개요

이 가이드는 **M-CENTER 세무계산기 베타 피드백 시스템**을 포함한 전체 애플리케이션을 Vercel에 배포하는 완전한 과정을 안내합니다.

### ✅ 배포 후 작동 기능
- 🧪 **베타테스트 UI/UX** - 베타 배지 및 피드백 폼
- 📊 **구글시트 자동 저장** - 실시간 데이터 저장
- 📧 **관리자 알림 이메일** - 피드백 접수 시 즉시 통보
- 📨 **사용자 접수 확인 이메일** - 피드백 제출자 확인 메일
- 🎯 **11개 세무계산기** - 필수 필드 UI/UX 개선 포함

---

## 🔧 1단계: 사전 준비

### 1.1 필수 도구 설치

```bash
# Vercel CLI 설치
npm install -g vercel

# 버전 확인
vercel --version
```

### 1.2 Vercel 계정 로그인

```bash
# Vercel 로그인
vercel login

# 로그인 확인
vercel whoami
```

### 1.3 프로젝트 링크

```bash
# 프로젝트 루트에서 실행
vercel

# 또는 기존 프로젝트에 링크
vercel link
```

---

## 🌐 2단계: 환경변수 설정

### 2.1 자동 환경변수 설정 (권장)

```bash
# 모든 환경변수 자동 설정
npm run vercel:env
```

### 2.2 수동 환경변수 설정 (필요시)

Vercel 대시보드에서 다음 환경변수들을 설정:

```bash
# Google Apps Script 설정
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjlPkXAy1JSZCxhJy00AazUvHbWwR5mpbJwY8Wo7EdJAPvSFn7bPZwZZcVf0icXh1inySn7aEpws1y4Kae-L2ZIajbzwY5iHEBnOznoKkS91UkNIm-OId2C7eZPR3CHSINoNdcskUwA1HhhC2hKgXqsazD9gtX_lAuioR1yMwsawhbpHF5MzGKYvcEVOtkdH2BqWu00sbHtebiNaADZNvsxuZZ2k6IpRruov5jg4BzpFxttmoTdAQTdIe0EQLnM7OCuGNf5gK1fruLiT4CKagjC04WJTQ&lib=MSO6FP3_fOVcXPyKa1j-76EzN9sd4IQmq

NEXT_PUBLIC_GOOGLE_SCRIPT_ID=1eq4jLxuXgVfjH76MJRPq6aetIybwNjD2IpvLWgY3wlfDLPW2h2hzEjAC

NEXT_PUBLIC_GOOGLE_SCRIPT_DEPLOYMENT_ID=AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX

NEXT_PUBLIC_GOOGLE_SHEETS_ID=1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM

NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/edit?usp=sharing

# AI 챗봇 설정
GEMINI_API_KEY=AIzaSyAP-Qa4TVNmsc-KAPTuQFjLalDNcvMHoiM

# 회사 정보
NEXT_PUBLIC_COMPANY_NAME=M-CENTER
NEXT_PUBLIC_COMPANY_EMAIL=admin@m-center.co.kr
NEXT_PUBLIC_SUPPORT_EMAIL=support@m-center.co.kr

# 배포 환경
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://m-center.co.kr

# 베타 피드백 시스템
BETA_FEEDBACK_ADMIN_EMAIL=admin@m-center.co.kr
BETA_FEEDBACK_REPLY_EMAIL=support@m-center.co.kr
```

---

## 📊 3단계: Google Apps Script 설정

### 3.1 Apps Script 프로젝트 생성

1. [Google Apps Script](https://script.google.com) 접속
2. **새 프로젝트** 클릭
3. 프로젝트 이름: `M-CENTER 베타피드백 이메일시스템`

### 3.2 스크립트 코드 복사

`M-CENTER_베타피드백_이메일_Apps_Script.js` 파일의 내용을 `Code.gs`에 복사

### 3.3 권한 설정

```javascript
// 테스트 함수 실행으로 권한 승인
testBetaFeedbackEmail()
```

1. **저장** (Ctrl+S)
2. **실행** 버튼 클릭
3. 권한 요청 시 **허용** 클릭

### 3.4 웹 앱 배포

1. **배포** > **새 배포** 클릭
2. **유형**: 웹 앱
3. **설명**: `M-CENTER 베타피드백 시스템 v1.0`
4. **실행 대상**: 나
5. **액세스 권한**: 모든 사용자
6. **배포** 클릭

---

## 🚀 4단계: Vercel 배포

### 4.1 빠른 배포 (권장)

```bash
# 환경변수 설정 + 배포 한번에
npm run vercel:setup
```

### 4.2 단계별 배포

```bash
# 1. 빌드 테스트
npm run build

# 2. 프로덕션 배포
npm run vercel:deploy

# 또는
vercel --prod
```

### 4.3 배포 상태 확인

```bash
# 배포 목록 확인
vercel ls

# 배포 로그 확인
vercel logs
```

---

## ✅ 5단계: 시스템 테스트

### 5.1 배포 완료 확인

```bash
# 배포된 URL에서 접근 테스트
curl https://YOUR_VERCEL_URL.vercel.app/api/beta-feedback
```

### 5.2 베타 피드백 시스템 테스트

1. **배포된 사이트 접속**: `https://YOUR_DOMAIN.vercel.app`
2. **세무계산기 페이지** 이동: `/tax-calculator`
3. **오류신고 버튼** 클릭
4. **실제 이메일로 피드백 제출**

### 5.3 확인 사항

- ✅ 구글시트에 데이터 저장 확인
- ✅ 관리자 이메일(`admin@m-center.co.kr`) 수신 확인
- ✅ 제출자 접수 확인 이메일 수신 확인
- ✅ 베타 UI/UX 표시 확인

---

## 🔧 6단계: 도메인 설정 (선택사항)

### 6.1 커스텀 도메인 추가

```bash
# 도메인 추가
vercel domains add m-center.co.kr

# 도메인 확인
vercel domains ls
```

### 6.2 DNS 설정

도메인 제공업체에서 다음 설정 추가:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

## 📊 7단계: 모니터링 및 관리

### 7.1 Vercel 대시보드 활용

- 🌐 **URL**: https://vercel.com/dashboard
- 📊 **Analytics**: 트래픽 및 성능 모니터링
- 🔧 **Settings**: 환경변수 및 도메인 관리
- 📋 **Functions**: API 로그 확인

### 7.2 Google Sheets 모니터링

- 📊 **베타 피드백 데이터**: [Google Sheets 링크](https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/edit?usp=sharing)
- 📧 **이메일 발송 로그**: Apps Script 실행 기록
- 🔄 **실시간 데이터 확인**: 새 피드백 접수 모니터링

---

## 🛠️ 문제 해결

### 8.1 자주 발생하는 문제

#### 1️⃣ 환경변수 누락
```bash
# 환경변수 확인
vercel env ls

# 누락된 환경변수 추가
vercel env add VARIABLE_NAME production
```

#### 2️⃣ Google Apps Script 오류
- Apps Script 실행 기록 확인
- 권한 재승인
- 구글시트 편집 권한 확인

#### 3️⃣ 빌드 실패
```bash
# 로컬 빌드 테스트
npm run build

# 타입스크립트 오류 확인
npm run type-check

# ESLint 오류 확인
npm run lint
```

#### 4️⃣ API 응답 오류
```bash
# Vercel Functions 로그 확인
vercel logs --follow

# API 엔드포인트 테스트
curl https://YOUR_DOMAIN/api/beta-feedback
```

### 8.2 디버깅 도구

```bash
# 개발 서버 로컬 실행
npm run dev

# 프로덕션 빌드 로컬 테스트
npm run build && npm run start

# 환경변수 로컬 테스트
npm run setup:env && npm run dev
```

---

## 📈 성능 최적화

### 9.1 Vercel 설정 최적화

- ✅ **Edge Functions**: API 응답 속도 개선
- ✅ **ISR (Incremental Static Regeneration)**: 페이지 로딩 최적화
- ✅ **Image Optimization**: 자동 이미지 최적화

### 9.2 모니터링 설정

```javascript
// vercel.json에 추가 가능한 설정
{
  "regions": ["icn1"], // 한국 서버 우선
  "functions": {
    "app/api/beta-feedback/route.js": {
      "maxDuration": 30
    }
  }
}
```

---

## 🎉 배포 완료 체크리스트

### ✅ 필수 확인 사항

- [ ] Vercel 배포 성공
- [ ] 환경변수 모두 설정됨
- [ ] Google Apps Script 연동 작동
- [ ] 베타 피드백 폼 정상 작동
- [ ] 관리자 이메일 수신 확인
- [ ] 사용자 접수 확인 이메일 수신
- [ ] 구글시트 데이터 저장 확인
- [ ] 11개 세무계산기 모두 작동
- [ ] 모바일 반응형 UI 확인

### 🔗 주요 링크

- 🌐 **배포된 사이트**: `https://YOUR_DOMAIN.vercel.app`
- 📊 **Vercel 대시보드**: https://vercel.com/dashboard
- 📋 **Google Sheets**: https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/edit?usp=sharing
- ⚙️ **Apps Script**: https://script.google.com
- 📧 **베타 피드백 테스트**: `/tax-calculator` 페이지

---

## 🚀 다음 단계

배포가 완료되면:

1. **📊 실제 사용자 피드백 수집 시작**
2. **🔄 지속적인 개선사항 적용**
3. **📈 사용량 및 성능 모니터링**
4. **🎯 추가 계산기 기능 확장**

**M-CENTER 세무계산기 베타테스트 시스템이 성공적으로 배포되었습니다!** 🎉 