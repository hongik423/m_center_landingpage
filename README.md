# 🏢 기업의별 경영지도센터 랜딩페이지

> AI 기반 기업 진단 및 컨설팅 서비스를 제공하는 경영지도센터의 공식 웹사이트

## 🚀 최신 업데이트 (2025.6.17)

### 📊 구글시트 연동 개선
- ✅ 새로운 구글시트 URL 적용
- ✅ Apps Script 스크립트 ID 업데이트  
- ✅ 서버/클라이언트 호환성 문제 해결
- ✅ 이메일 발송 기능 안정화
- ✅ 구글시트 연동 테스트 API 추가

### 🔧 주요 개선사항
- **구글시트 URL**: `https://script.google.com/macros/s/AKfycbzaGieoJnM2Et662p-0QD-3s9KXz-a0QdxYUuvrS1ZU_4LQvwcEj7-rBU4uWXH5aQH1/exec`
- **구글시트 ID**: `1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM`
- **Apps Script ID**: `1wO3g-xpGXZVEMYcXd1qYbO_nTExximzjAgaDoLToEsz38Z7-6LWsrKoY`

## 🎯 주요 기능

### 🤖 AI 무료진단 시스템
- **실시간 AI 분석**: 기업 정보 입력 시 즉시 맞춤형 솔루션 제공
- **구글시트 자동 저장**: 모든 신청 데이터가 실시간으로 구글시트에 저장
- **이메일 자동 발송**: 신청 확인 및 결과 이메일 자동 송부
- **진단 결과 URL**: 개별 맞춤형 진단 결과 페이지 생성

### 📋 서비스 소개
- **BM ZEN 사업분석**: Business Model Zen 프레임워크 기반 체계적 분석
- **AI 활용 생산성향상**: 인공지능 도구 도입 및 최적화 컨설팅
- **경매활용 공장구매**: 공장 부동산 경매 전문 컨설팅
- **기술사업화/기술창업**: 기술 기반 창업 및 사업화 지원
- **인증지원**: 각종 기업 인증 취득 지원
- **웹사이트 구축**: 기업 맞춤형 웹사이트 개발

### 💬 AI 챗봇
- **24시간 상담**: 언제든지 궁금한 점 문의 가능
- **실시간 응답**: OpenAI GPT 기반 즉시 답변 제공
- **상담 연결**: 필요시 전문가와 직접 연결

## ⚙️ 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **AI**: OpenAI GPT API
- **Database**: Google Sheets (Apps Script)
- **Email**: EmailJS
- **Deployment**: Vercel

## 🔧 환경변수 설정 (중요!)

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 입력하세요:

```bash
# 구글시트 연동 (필수) - 2025.6.17 업데이트
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzaGieoJnM2Et662p-0QD-3s9KXz-a0QdxYUuvrS1ZU_4LQvwcEj7-rBU4uWXH5aQH1/exec
NEXT_PUBLIC_GOOGLE_SCRIPT_ID=1wO3g-xpGXZVEMYcXd1qYbO_nTExximzjAgaDoLToEsz38Z7-6LWsrKoY
NEXT_PUBLIC_GOOGLE_SCRIPT_DEPLOYMENT_ID=AKfycbzaGieoJnM2Et662p-0QD-3s9KXz-a0QdxYUuvrS1ZU_4LQvwcEj7-rBU4uWXH5aQH1
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM
NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM/edit?usp=sharing

# EmailJS 설정
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qd9eycz
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=268NPLwN54rPvEias

# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here

# 기본 설정
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_EMAIL=hongik423@gmail.com
NOTIFICATION_ENABLED=true
AUTO_REPLY_ENABLED=true
```

## 🚀 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 🧪 구글시트 연동 테스트

구글시트 연동이 정상적으로 작동하는지 확인하려면:

### 1. 연결 상태 확인
```bash
curl http://localhost:3000/api/test-googlesheets
```

### 2. 테스트 데이터 저장
```bash
curl -X POST http://localhost:3000/api/test-googlesheets \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "테스트회사",
    "contactEmail": "test@example.com",
    "contactName": "홍길동"
  }'
```

### 3. 브라우저에서 테스트
1. `http://localhost:3000/services/diagnosis` 접속
2. AI 무료진단 신청 폼 작성
3. 구글시트에 데이터 저장 확인: [구글시트 보기](https://docs.google.com/spreadsheets/d/1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM/edit?usp=sharing)

## 📊 구글시트 Apps Script 정보

- **스크립트 ID**: `1wO3g-xpGXZVEMYcXd1qYbO_nTExximzjAgaDoLToEsz38Z7-6LWsrKoY`
- **웹앱 URL**: `https://script.google.com/macros/s/AKfycbzaGieoJnM2Et662p-0QD-3s9KXz-a0QdxYUuvrS1ZU_4LQvwcEj7-rBU4uWXH5aQH1/exec`
- **시트명**: `m_center_landingpage-request`

### 저장되는 데이터 구조
- 제출일시, 회사명, 업종, 사업담당자
- 직원수, 사업성장단계, 주요고민사항, 예상혜택
- 진행사업장, 담당자명, 연락처, 이메일
- 개인정보동의, 폼타입, 진단상태, AI분석결과, 결과URL

## 🔍 문제 해결

### 구글시트 연동 오류
1. **환경변수 확인**: `.env.local` 파일의 URL이 정확한지 확인
2. **Apps Script 권한**: 구글 Apps Script에서 웹앱 배포 상태 확인
3. **CORS 정책**: 구글 Apps Script에서 모든 도메인 허용 설정 확인

### 이메일 발송 오류
1. **EmailJS 설정**: Service ID와 Public Key 확인
2. **템플릿 설정**: EmailJS 대시보드에서 템플릿 존재 여부 확인

### SyntaxError 문제
1. **서버 재시작**: `npm run dev` 재실행
2. **캐시 클리어**: `.next` 폴더 삭제 후 재빌드
3. **한글 인코딩**: UTF-8 인코딩 확인

## 📱 반응형 디자인

- **모바일**: 320px~768px
- **태블릿**: 768px~1024px  
- **데스크톱**: 1024px 이상

## 🔐 보안 특징

- **환경변수 관리**: 민감한 정보는 환경변수로 보호
- **데이터 검증**: 모든 입력 데이터 유효성 검사
- **HTTPS 지원**: 프로덕션 환경에서 SSL 인증서 적용
- **개인정보 보호**: GDPR 준수 개인정보 처리 방침

## 📝 API 문서

### 주요 엔드포인트

- `GET /api/test-googlesheets` - 구글시트 연결 테스트
- `POST /api/test-googlesheets` - 테스트 데이터 저장
- `POST /api/process-diagnosis` - AI 진단 처리
- `POST /api/ai-diagnosis` - AI 분석 실행
- `POST /api/chat` - AI 챗봇 대화

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 연락처

- **이메일**: hongik423@gmail.com
- **전화**: 010-9251-9743
- **웹사이트**: [기업의별 경영지도센터](https://m-center-landingpage.vercel.app)

## 📄 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🎯 기업의별 경영지도센터** - 기업의별, 성공을 설계하다

# 경영지도센터 통합 플랫폼

Business Model Zen 프레임워크를 기반으로 한 기업 성장 단계별 맞춤형 경영지도 서비스를 제공하는 통합 디지털 플랫폼입니다.

## 🚀 새로운 기능: 정책자금 활용 서비스 추천 시스템

### ✨ 핵심 기능
AI 기반 종합 경영진단에서 **"정책자금 및 정부지원 활용"** 결과가 나왔을 때, 경영지도센터 6개 서비스영역 중 가장 적합한 **1개만 추천**하는 지능형 시스템입니다.

### 🎯 주요 특징

#### 1. 6개 서비스영역 중 1개 명확 추천
- **BM ZEN 사업분석**: 비즈니스 모델 최적화
- **AI 활용 생산성향상**: ChatGPT, 업무자동화 도구 활용
- **경매활용 공장구매**: 부동산 경매를 통한 고정비 절감
- **기술사업화/기술창업**: 기술 기반 사업화 지원
- **인증지원**: 벤처/이노비즈 등 각종 인증 취득
- **웹사이트 구축**: 전문 웹사이트를 통한 온라인 마케팅

#### 2. 30일 내 핵심 과제 자동 생성
```
📅 Phase 1 (1-10일): 서비스 착수 준비 완료
🎯 Phase 2 (11-30일): 경영지도센터 6개 서비스영역 중 [추천 서비스] 1개 최종 선택 및 착수 ⭐ 핵심 과제
🚀 Phase 3 (31-90일): 첫 번째 가시적 성과 창출
```

#### 3. 지능형 추천 알고리즘
- **키워드 매칭**: 정책자금 관련 키워드 자동 감지
- **업종별 가중치**: 제조업, IT, 서비스업 등 업종별 최적화
- **기업 규모 고려**: 10명 이하 ~ 50명 이상 규모별 맞춤 추천
- **경영 단계 분석**: 창업기, 성장기, 확장기별 차별화

#### 4. 정부지원 프로그램 자동 연계
- **사업재편지원**: 최대 5,000만원 (70% 지원)
- **AI도입지원**: 최대 3,000만원 (80% 지원)
- **기술사업화지원**: TIPS 프로그램 최대 3억원
- **벤처확인지원**: 연간 5,000만원 세제혜택

### 🔧 시스템 구조

```
src/lib/utils/serviceRecommendationEngine.ts
├── ServiceRecommendationEngine        # 핵심 추천 엔진
├── GovernmentSupportReportGenerator   # 전용 보고서 생성기
├── MCENTER_SERVICES                   # 6개 서비스 정의
├── GOVERNMENT_SUPPORT_MAPPINGS        # 정책자금 매핑 규칙
└── ActionPlan / ExpectedResults       # 액션플랜 & 예상 결과

src/app/api/process-diagnosis/route.ts
├── checkForGovernmentSupportKeywords  # 키워드 감지 함수
├── generateOptimizedGovernmentSupportDiagnosis  # 특화 진단 생성
└── POST handler 통합                 # AI + 추천엔진 통합 처리
```

### 📊 테스트 환경

방문: `/diagnosis/test-government-support`

#### 테스트 케이스
1. **제조업 + 정책자금**: 공장 현대화 + AI 도입 → 경매활용 공장구매 추천
2. **IT기업 + 기술혁신**: R&D 지원 + 정부지원 → 기술사업화/기술창업 추천  
3. **서비스업 + 디지털전환**: 온라인 마케팅 강화 → 웹사이트 구축 추천

### 🎯 사용 방법

#### 1. 자동 감지 (권장)
진단 신청 시 다음 키워드가 포함되면 자동으로 특화 시스템 실행:
```
정책자금, 정부지원, 정부사업, 지원사업, 창업지원, 
중소기업지원, 기술개발지원, R&D지원, 벤처지원, 
사업재편, AI지원, 디지털전환지원 등
```

#### 2. 수동 테스트
```typescript
import { ServiceRecommendationEngine } from '@/lib/utils/serviceRecommendationEngine';

const recommendation = ServiceRecommendationEngine.recommendForGovernmentSupport(diagnosisData);
```

### 📋 출력 결과

#### 1. 서비스 우선순위 매트릭스
```
🥇 1순위: [최적 서비스] - 즉시 적용 가능한 핵심 서비스
🥈 2순위: [보조 서비스] - 1차 완료 후 연계 서비스  
🥉 3순위: [추가 서비스] - 장기 전략 차원의 보완 서비스
```

#### 2. 정책자금 활용 전용 보고서
- 진단 개요 및 기업 특성 분석
- **6개 서비스영역 비교 분석표**
- **30일 내 핵심 과제 액션플랜** ⭐
- 정부지원 프로그램 연계 방안
- 예상 성과 및 정량적 효과
- 최종 결론 및 권고사항

#### 3. 즉시 실행 가능한 액션플랜
```
✅ 7일 내: 무료 상담 신청 및 현황 진단
🔥 30일 내: 경영지도센터 6개 서비스영역 중 [추천 서비스] 1개 최종 선택 및 착수
📈 90일 내: 첫 번째 가시적 성과 측정 및 보고
```

### 🏆 기대 효과

#### 사용자 관점
- **명확한 방향성**: 6개 중 1개 명확한 추천으로 선택 고민 해결
- **빠른 의사결정**: 30일 내 핵심 과제로 신속한 실행 가능
- **정부지원 연계**: 최대 100% 정부지원으로 비용 부담 최소화

#### 경영지도센터 관점  
- **상담 효율성**: 체계적 추천으로 상담 시간 단축
- **성공률 향상**: 맞춤 추천으로 프로젝트 성공률 증대
- **일관성 보장**: 동일 조건에서 항상 동일한 추천 결과

### 🔄 일관성 보장 규칙 시스템

#### 추천 규칙의 우선순위
1. **정책자금 키워드 매칭** (최우선)
2. **업종별 적합성** (제조업 → 공장구매, IT → AI활용)
3. **기업 규모** (소규모 → AI/웹사이트, 대규모 → 공장/기술창업)
4. **경영 단계** (창업기 → 기술창업, 성장기 → 사업분석)

#### 점수 산정 시스템
```typescript
// 정책자금 매핑: 90점
// 업종 보너스: 최대 25점  
// 규모 보너스: 최대 15점
// 단계 보너스: 최대 20점
// → 총 150점 만점으로 객관적 순위 결정
```

---

## 💡 기존 기능

### 🎯 핵심 서비스
- **AI 활용 생산성향상**: 업무 효율성 40% 향상
- **경매활용 공장구매**: 시장가 대비 40% 절약
- **기술사업화/기술창업**: 평균 5억원 자금 확보
- **인증지원**: 연간 5,000만원 세제혜택
- **웹사이트 구축**: 온라인 매출 30-50% 증대

### 🤖 AI 진단 시스템
- 자동화된 종합 진단
- 업종별 맞춤 분석
- 실시간 리포트 생성

### 📊 성장 단계별 지원
- Step 1 (1-3년): 안정적 기반 구축
- Step 2 (3-7년): 성장 동력 강화  
- Step 3 (7-10년): 시장 주도 지위
- Step 4 (10년+): 지속가능 성장

## 🛠️ 기술 스택

### Frontend
- **React 18** + **TypeScript**
- **Next.js 14** (App Router)
- **Tailwind CSS** + **shadcn/ui**
- **Zustand** (상태관리)

### Backend
- **Next.js API Routes**
- **Node.js** 백엔드 서비스
- **Google Sheets API** (데이터 저장)

### AI & 분석
- **OpenAI GPT** (AI 진단)
- **Custom Recommendation Engine** (서비스 추천)
- **실시간 분석 시스템**

## 🚀 빠른 시작

### 설치
```bash
npm install
```

### 환경 설정
```bash
cp env.example.md .env.local
```

### 개발 서버 실행
```bash
npm run dev
```

### 테스트
```bash
# 정책자금 추천 시스템 테스트
http://localhost:3000/diagnosis/test-government-support

# 일반 진단 테스트  
http://localhost:3000/diagnosis/test-enhanced-v2
```

## 📞 문의

- **담당자**: 이후경 책임컨설턴트
- **이메일**: hongik423@gmail.com
- **전화**: 010-9251-9743
- **회사**: 경영지도센터

---

*이 시스템은 "정책자금 및 정부지원 활용" 결과에 대해 경영지도센터 6개 서비스영역 중 가장 적합한 1개를 추천하여 30일 내 핵심 과제 실행을 지원하는 일관성 있는 규칙 시스템입니다.*

# 🏆 M-CENTER 기업의별 경영지도센터 

> 25년 검증된 전문성 | 95% 성공률 | 정부지원 전문기관

## 🤖 **AI 챗봇 기능**

### ✨ **주요 특징**
- 🎯 **실시간 AI 상담**: OpenAI GPT 모델 기반 지능형 상담
- 🚀 **플로팅 챗봇**: 모든 페이지에서 접근 가능한 드래그 가능한 챗봇
- 💬 **전용 챗봇 페이지**: `/chatbot` 경로의 전체 화면 상담
- 📱 **반응형 디자인**: 모바일/데스크톱 최적화

### 🔧 **기술 스택**
- **Frontend**: Next.js 15, React 18, TypeScript
- **AI Engine**: OpenAI GPT-4 API
- **UI Components**: shadcn/ui, Tailwind CSS
- **상태 관리**: React Hooks

### 🌐 **AI 챗봇 체험하기**

#### 1. **플로팅 챗봇**
- 모든 페이지 우측 하단의 원형 버튼 클릭
- 드래그로 위치 조정 가능
- 빠른 액션 버튼 제공

#### 2. **전용 챗봇 페이지**
```
https://hongik423.github.io/m_center_landingpage/chatbot
```

### 💡 **AI 상담 가능 분야**
- ✅ **BM ZEN 사업분석** - 독자적 프레임워크
- ✅ **AI 생산성향상** - 업무효율 40-60% 증대
- ✅ **경매활용 공장구매** - 부동산비용 30-50% 절감
- ✅ **기술사업화/창업** - 정부과제 선정률 78%
- ✅ **인증지원** - 취득률 92% 업계 최고
- ✅ **웹사이트 구축** - SEO 상위노출 보장

## 🚀 **빠른 시작**

### 로컬 개발 환경 설정

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# OPENAI_API_KEY 설정 필요

# 개발 서버 시작
npm run dev
```

### 환경변수 설정
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📱 **주요 페이지**

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 메인 | `/` | 랜딩페이지 및 무료 진단 |
| AI 챗봇 | `/chatbot` | 실시간 AI 상담 |
| 서비스 | `/services/*` | 6개 핵심 서비스 |
| 상담신청 | `/consultation` | 전문가 직접 상담 |
| 진단 | `/diagnosis` | AI 무료 기업진단 |

## 🔗 **GitHub 기능**

### GitHub Pages 자동 배포
- ✅ GitHub Actions 워크플로우 설정됨
- ✅ `master` 브랜치 푸시 시 자동 배포
- ✅ 환경변수 보안 관리

### 브랜치 전략
```
master (main) → 프로덕션 배포
└── feature/* → 기능 개발
└── hotfix/* → 긴급 수정
```

## 📞 **문의 및 지원**

- **AI 챗봇**: 웹사이트 내 실시간 상담
- **전문가 상담**: 010-9251-9743 (이후경 경영지도사)
- **이메일**: hongik423@gmail.com
- **GitHub Issues**: 기술적 문의 및 버그 리포트

## 🏅 **M-CENTER 독보적 우수성**

> 대한민국 최고 수준의 경영컨설팅 기관으로서 AI 기술을 활용한 혁신적인 상담 서비스를 제공합니다.

---

**🤖 AI 상담사가 24시간 대기 중입니다. 지금 바로 상담을 시작해보세요!**
