# 🎯 M-CENTER 경영지도센터 - 기업 성장의 든든한 동반자

[![배포 상태](https://img.shields.io/badge/배포-완료-brightgreen.svg)](https://hongik423.github.io/m_center_landingpage/)
[![버전](https://img.shields.io/badge/버전-v2.0.0-blue.svg)](https://github.com/hongik423/m_center_landingpage/releases)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

> **25년 경험의 검증된 노하우로 기업 성장을 이끄는 M-CENTER**

---

## 🚀 **새로운 기능 (v2.0.0)**

### 🤖 **GEMINI AI 챗봇 시스템**
- ✅ **별-AI상담사** 브랜딩으로 전문 상담 제공
- ✅ Gemini 1.5-pro 모델 연결 완료
- ✅ 한국어 자연스러운 대화 및 M-CENTER 서비스 전문 상담
- ✅ 실시간 AI 응답 및 맞춤형 솔루션 제안

### 📄 **강화된 PDF 다운로드 시스템**
- ✅ 온라인 결과보고서와 동일한 내용의 PDF 생성
- ✅ 한글 완벽 지원 및 아름다운 디자인
- ✅ 강화된 오류 처리 및 대안 다운로드 제공
- ✅ 텍스트/HTML 보고서 대안 옵션

### 📊 **완성된 데이터 연계 시스템**
- ✅ 구글시트 자동 연동 (진단신청자/상담신청자 별도 관리)
- ✅ 관리자 메일 자동 발송 (hongik423@gmail.com)
- ✅ 신청자 확인메일 자동 발송
- ✅ GitHub 보안정책 완벽 준수

---

## 🏢 **M-CENTER 6대 핵심 서비스**

| 서비스 | 주요 성과 | 특징 |
|--------|-----------|------|
| 🏆 **BM ZEN 사업분석** | 매출 20-40% 증대 | 독자적 프레임워크, 95% 성공률 |
| 🤖 **AI 생산성향상** | 업무효율 40-60% 향상 | ChatGPT 전문 활용, AI바우처 연계 |
| 🏭 **경매활용 공장구매** | 부동산비용 30-50% 절감 | 25년 경매 노하우, 95% 안전 낙찰률 |
| 🚀 **기술사업화/창업** | 평균 5억원 정부지원 | R&D 과제 78% 선정률, VC 네트워크 |
| 📋 **인증지원** | 연간 5천만원 세제혜택 | ISO/벤처/연구소, 92% 취득률 |
| 🌐 **웹사이트 구축** | 온라인 매출 30% 증대 | SEO 최적화, 전환율 향상 |

---

## 🛠️ **기술 스택**

### **Frontend**
- **Next.js 15.3.4** - 최신 App Router
- **TypeScript 5.0** - 타입 안전성
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **shadcn/ui** - 모던 UI 컴포넌트
- **React Hook Form** - 폼 검증 및 관리

### **Backend & API**
- **Google Gemini 1.5-pro** - AI 챗봇 시스템
- **EmailJS** - 이메일 발송 시스템
- **Google Apps Script** - 구글시트 연동
- **Next.js API Routes** - 서버리스 API

### **배포 & 인프라**
- **GitHub Pages** - 정적 사이트 호스팅
- **GitHub Actions** - CI/CD 자동화
- **Vercel** - 대안 배포 플랫폼

---

## 📁 **프로젝트 구조**

```
m_center_landingpage/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/               # API 라우트
│   │   │   ├── chat/            # 🤖 GEMINI AI 챗봇
│   │   │   ├── consultation/    # 상담 신청 처리
│   │   │   └── simplified-diagnosis/ # 진단 신청 처리
│   │   ├── 📁 services/          # 6대 서비스 페이지
│   │   ├── 📁 chatbot/          # 🤖 AI 챗봇 페이지
│   │   └── 📁 diagnosis/        # 진단 시스템
│   ├── 📁 components/
│   │   ├── 📁 ui/               # shadcn/ui 컴포넌트
│   │   ├── 📁 layout/           # 레이아웃 컴포넌트
│   │   ├── 📁 chatbot/          # 🤖 챗봇 컴포넌트
│   │   └── 📁 diagnosis/        # 진단 시스템 컴포넌트
│   └── 📁 lib/
│       ├── 📁 config/           # 환경설정
│       ├── 📁 stores/           # 상태 관리
│       └── 📁 utils/            # 유틸리티 함수
├── 📁 docs/                     # 📚 문서화
├── 📁 public/                   # 정적 파일
└── 📁 .github/workflows/        # GitHub Actions
```

---

## 🚀 **빠른 시작**

### 1. **환경 설정**

```bash
# 저장소 클론
git clone https://github.com/hongik423/m_center_landingpage.git
cd m_center_landingpage

# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일에 API 키 입력
```

### 2. **환경변수 설정 (.env.local)**

```env
# 🤖 AI 챗봇
GEMINI_API_KEY=your_gemini_api_key

# 📧 이메일 시스템
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# 📊 구글시트 연동
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=your_apps_script_url
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_sheets_id
```

### 3. **개발 서버 실행**

```bash
# 개발 모드
npm run dev

# 빌드 및 배포
npm run build
npm start
```

---

## 🎯 **주요 페이지**

| 페이지 | URL | 설명 |
|--------|-----|------|
| 🏠 **메인** | `/` | 서비스 소개 및 주요 기능 |
| 🤖 **AI 챗봇** | `/chatbot` | 별-AI상담사와 실시간 상담 |
| 📊 **무료 진단** | `/services/diagnosis` | AI 기반 기업 진단 시스템 |
| 💼 **전문가 상담** | `/consultation` | 1:1 맞춤 상담 신청 |
| 📋 **서비스 소개** | `/services/*` | 6대 핵심 서비스 상세 정보 |

---

## 📊 **성능 지표**

- ⚡ **First Load JS**: 102 kB
- 🚀 **빌드 시간**: 4-5초
- 📄 **정적 페이지**: 33개
- 🎯 **Lighthouse 점수**: 95+ (Performance)
- 🔒 **보안 취약점**: 0개

---

## 🔧 **사용 가능한 스크립트**

```bash
npm run dev          # 개발 서버 시작
npm run build        # 프로덕션 빌드
npm run start        # 빌드된 앱 실행
npm run lint         # ESLint 검사
npm run type-check   # TypeScript 타입 검사
```

---

## 📞 **문의 및 지원**

### **M-CENTER 경영지도센터**
- 📍 **주소**: 경기도 성남시 분당구
- 📞 **대표 전화**: 010-9251-9743
- 📧 **이메일**: hongik423@gmail.com
- 🌐 **웹사이트**: [https://hongik423.github.io/m_center_landingpage/](https://hongik423.github.io/m_center_landingpage/)

### **담당자 정보**
- 👨‍💼 **이후경 책임컨설턴트**
- 🏆 **25년 경영컨설팅 경력**
- 📜 **중소벤처기업부 인증 컨설턴트**
- 🎯 **1,000+ 기업 성공 컨설팅 경험**

---

## 📝 **라이선스**

이 프로젝트는 M-CENTER 경영지도센터의 공식 랜딩페이지입니다.

---

## 🎉 **업데이트 히스토리**

### **v2.0.0** (2025-06-20)
- 🤖 GEMINI AI 챗봇 시스템 구축
- 📄 PDF 다운로드 기능 강화
- 🔧 시스템 안정화 및 성능 최적화

### **v1.0.0** (2025-01-15)
- 🚀 초기 랜딩페이지 구축
- 📊 구글시트 연동 시스템
- 📧 이메일 발송 시스템

---

**🎯 M-CENTER - 기업 성장의 든든한 동반자가 되어드리겠습니다!**
