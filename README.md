# 🏢 M-CENTER 기업 진단 및 컨설팅 플랫폼

> **Google Apps Script 통합 완료** ✅  
> EmailJS 제거 및 단일 시스템 통합으로 안정성 향상

## 📋 시스템 개요

M-CENTER는 중소기업 대상 AI 기반 무료 진단 및 전문 컨설팅 서비스를 제공하는 Next.js 기반 웹 플랫폼입니다.

### 🎯 주요 기능
- **AI 무료 진단**: 20개 항목 객관식 + AI 분석
- **전문가 상담**: 진단 결과 기반 맞춤형 상담
- **6대 전문 서비스**: 사업분석, AI생산성, 공장경매, 기술창업, 인증지원, 웹사이트구축
- **실시간 데이터 연동**: Google Apps Script 기반 통합 시스템

## 🚀 시스템 아키텍처

### 핵심 기술 스택
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS, Shadcn/ui
- **AI**: Google Gemini API
- **데이터**: Google Sheets + Apps Script
- **배포**: Vercel

### 🔗 통합 이메일 시스템 (Google Apps Script)
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   웹 신청폼     │───▶│ Google Apps      │───▶│   구글시트      │
│                 │    │ Script           │    │   자동저장      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌──────────────────┐
                       │   자동 이메일    │
                       │ • 관리자 알림    │
                       │ • 신청자 확인    │
                       └──────────────────┘
```

## 🛠️ 설치 및 설정

### 1. 프로젝트 설정
```bash
# 저장소 클론
git clone https://github.com/hongik423/m_center_landingpage.git
cd m_center_landingpage

# 의존성 설치
npm install

# 환경변수 설정
cp env.local.example .env.local
```

### 2. 환경변수 설정 (.env.local)
```bash
# 🔧 Google Apps Script 연동 (필수)
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_google_sheets_id
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=your_google_script_url

# 🤖 AI API 키 (운영환경 필수)
GEMINI_API_KEY=your_gemini_api_key

# 🚀 기본 URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 3. Google Apps Script 설정

#### 필수 단계:
1. **구글시트 생성**: [템플릿 시트](https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/copy) 복사
2. **Apps Script 배포**: `M-CENTER_구글시트_Apps_Script_완성본.js` 파일 사용
3. **웹앱 배포**: 실행 권한(나), 액세스 권한(모든 사용자)
4. **URL 복사**: 배포된 웹앱 URL을 환경변수에 설정

## 🚀 실행

```bash
# 개발 서버 실행
npm run dev

# 빌드 및 배포
npm run build
npm start

# Vercel 배포
vercel --prod
```

## 📊 서비스 구성

### 🎯 AI 진단 시스템
- **20개 객관식 문항**: 5개 카테고리별 역량 평가
- **AI 분석 엔진**: Gemini API 기반 종합 분석
- **맞춤형 보고서**: PDF 다운로드 지원
- **서비스 추천**: 진단 결과 기반 자동 매칭

### 💼 6대 전문 서비스
1. **BM ZEN 사업분석**: 비즈니스 모델 혁신
2. **AI 생산성향상**: 업무 자동화 및 효율성
3. **경매활용 공장구매**: 부동산 투자 컨설팅
4. **기술사업화/창업**: 기술 상용화 지원
5. **인증지원**: 각종 기업 인증 획득
6. **웹사이트 구축**: 디지털 전환 지원

## 🔧 시스템 특징

### ✅ 안정성
- **단일 시스템**: Google Apps Script 통합으로 복잡성 제거
- **오프라인 백업**: 네트워크 장애 시 로컬 백업
- **에러 핸들링**: 단계별 fallback 처리

### 📈 확장성
- **모듈화**: 기능별 독립적 컴포넌트
- **타입 안전성**: TypeScript 전면 적용
- **성능 최적화**: Next.js 15 + React 19

### 🔒 보안
- **환경변수 분리**: 민감 정보 보호
- **CORS 설정**: 안전한 API 통신
- **데이터 검증**: Zod 스키마 검증

## 📋 API 엔드포인트

```
GET  /                          # 메인 페이지
GET  /diagnosis                 # AI 진단 페이지
POST /api/simplified-diagnosis  # 진단 신청 처리
POST /api/consultation          # 상담 신청 처리
GET  /test-email               # 시스템 연결 테스트
```

## 🔍 테스트 및 모니터링

### 시스템 상태 확인
```bash
# Google Apps Script 연결 테스트
curl https://your-domain.com/test-email

# API 상태 확인
curl https://your-domain.com/api/consultation
```

### 개발 도구
- **타입 체크**: `npm run type-check`
- **린트**: `npm run lint`
- **보안 감사**: `npm run security-audit`

## 📞 문의 및 지원

- **관리자**: 이후경 경영지도사
- **연락처**: 010-9251-9743
- **이메일**: hongik423@gmail.com
- **GitHub**: [hongik423/m_center_landingpage](https://github.com/hongik423/m_center_landingpage)

## 📈 버전 히스토리

### v2.0.0 (2025.01.XX) - Google Apps Script 통합
- ✅ EmailJS 완전 제거
- ✅ Google Apps Script 단일 시스템 통합
- ✅ 안정성 및 성능 향상
- ✅ 환경변수 단순화

### v1.0.0 (2024.12.XX) - 초기 버전
- 기본 AI 진단 시스템
- EmailJS 기반 이메일 시스템
- 6대 서비스 소개 페이지

---

💡 **M-CENTER**: 중소기업 성장과 혁신을 위한 AI 기반 통합 컨설팅 플랫폼
