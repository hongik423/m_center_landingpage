# 🤖 M-CENTER AI 기능 활성화 가이드

M-CENTER 랜딩페이지의 AI 기능을 활성화하여 채팅봇과 AI 진단 시스템을 정상적으로 작동시키는 방법을 안내합니다.

## 📋 현재 상태 확인

현재 **AI 기능이 비활성화**되어 있어서 다음과 같은 현상이 발생하고 있습니다:

```
⚠️ GEMINI_API_KEY가 설정되지 않았습니다.
⚠️ Gemini API Key가 설정되지 않았습니다. 폴백 모드로 동작합니다.
❌ GEMINI API 오류 (503): "The model is overloaded. Please try again later."
```

## 🚀 빠른 해결 방법

### 방법 1: 자동 설정 스크립트 실행 (권장)

1. **자동 설정 스크립트 실행**:
   ```cmd
   setup-env-ai.bat
   ```

2. **Gemini API 키 발급 및 입력**:
   - Google AI Studio 접속: https://makersuite.google.com/app/apikey
   - 새 API 키 생성
   - 스크립트에서 API 키 입력

3. **개발 서버 재시작**:
   ```cmd
   npm run dev
   ```

### 방법 2: 수동 설정

1. **`.env.local` 파일 생성** (프로젝트 루트):
   ```env
   # M-CENTER 랜딩페이지 환경변수 설정

   # 🔧 Google Apps Script 연동 (필수)
   NEXT_PUBLIC_GOOGLE_SHEETS_ID=1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec

   # 🚀 기본 URL 설정
   NEXT_PUBLIC_BASE_URL=https://m-center-landingpage.vercel.app

   # 🤖 AI API 키 (실제 키로 교체 필요)
   GEMINI_API_KEY=여기에_실제_Gemini_API_키를_입력하세요

   # 🌍 환경 설정
   NODE_ENV=development

   # 🔐 보안 설정
   JWT_SECRET=m-center-jwt-secret-key-2024

   # 관리자 설정
   ADMIN_EMAIL=admin@m-center.com

   # 기능 활성화/비활성화
   NOTIFICATION_ENABLED=true
   AUTO_REPLY_ENABLED=true
   ```

2. **Gemini API 키 발급**:
   - https://makersuite.google.com/app/apikey 접속
   - "Create API Key" 클릭
   - 발급된 키를 복사 (AIzaSy로 시작)

3. **API 키 설정**:
   ```env
   GEMINI_API_KEY=AIzaSyABC123...실제_발급받은_키
   ```

4. **개발 서버 재시작**:
   ```cmd
   npm run dev
   ```

## ✅ 설정 완료 확인

설정이 완료되면 다음과 같은 메시지가 표시됩니다:

```cmd
✅ Gemini API Key 검증 완료: AIzaSyAP****HoiM
🚀 GEMINI API 호출 시작: { messageLength: 5, hasApiKey: true }
✅ GEMINI API 성공: { responseLength: 1024, retryCount: 0 }
```

## 🧪 기능 테스트

### 1. 채팅봇 테스트
- 주소: http://localhost:3000/chatbot
- 아무 메시지나 입력하여 AI 응답 확인

### 2. AI 진단 테스트
- 주소: http://localhost:3000/services/diagnosis
- 진단 폼 작성 후 AI 기반 보고서 생성 확인

### 3. 세금계산기 (AI 기능 불필요)
- 주소: http://localhost:3000/tax-calculator
- 11개 전문 세금계산기 정상 작동

## ⚠️ 문제 해결

### 1. API 키 형식 오류
```
❌ 유효하지 않은 Gemini API Key 형식입니다.
```
**해결책**: API 키가 `AIza`로 시작하는지 확인

### 2. 503 오류 (서버 과부하)
```
❌ GEMINI API 오류 (503): "The model is overloaded"
```
**해결책**: Google Gemini 서버 과부하 - 자동 재시도됨 (정상)

### 3. 환경변수 읽기 실패
```
⚠️ GEMINI_API_KEY가 설정되지 않았습니다.
```
**해결책**: 
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 개발 서버 재시작 (`npm run dev`)
3. 브라우저 캐시 삭제

## 🔒 보안 주의사항

1. **API 키 보안**:
   - `.env.local` 파일을 Git에 커밋하지 마세요
   - API 키를 코드에 직접 하드코딩하지 마세요

2. **사용량 관리**:
   - Google AI Studio에서 API 사용량 모니터링
   - 필요시 사용량 제한 설정

## 📞 추가 지원

설정에 문제가 있거나 추가 도움이 필요하시면:

- **이메일**: hongik423@gmail.com
- **전화**: 010-9251-9743 (이후경 경영지도사)
- **카카오톡**: M-CENTER 검색

## 🎯 활성화 후 주요 기능

### 1. 지능형 채팅봇
- 25년 경험의 경영컨설팅 노하우 기반
- 6대 핵심 서비스 전문 상담
- 실시간 맞춤형 솔루션 제안

### 2. AI 기반 기업 진단
- 심층적인 시장 분석
- SWOT 분석 및 전략 매트릭스
- 맞춤형 서비스 추천
- 단계별 실행 계획 제공

### 3. 통합 세금계산기
- 11개 전문 계산기 제공
- 2024년 최신 세법 반영
- 실시간 정확한 계산
- 절세 방안 자동 제안

---

**💡 설정 완료 후 AI 기능이 정상 작동하여 더욱 전문적이고 개인화된 서비스를 제공할 수 있습니다!** 