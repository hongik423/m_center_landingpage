# 🤖 M-CENTER AI 자동화 시스템 가이드

## 📋 개요

M-CENTER AI 자동화 시스템은 OpenAI GPT-4를 활용하여 자동 진단 보고서 생성과 AI 상담사 챗봇을 구현한 차세대 경영컨설팅 플랫폼입니다.

## 🚀 주요 기능

### 1. 🤖 AI 자동 진단 보고서 생성
- **고도화된 AI 엔진**: OpenAI GPT-4 기반 지능형 기업 진단
- **6가지 핵심 지표**: 비즈니스모델, 시장위치, 운영효율성, 성장잠재력, 디지털준비도, 재무건전성
- **실시간 분석**: 병렬 AI 분석으로 빠른 결과 제공
- **프리미엄 보고서**: 전문 디자인의 인쇄 가능한 HTML 보고서

### 2. 🎤 향상된 AI 상담사 챗봇
- **25년 경험 수준**: 경영지도사 수준의 전문 상담
- **음성 인식**: 한국어 음성 입력 지원
- **감정 분석**: 고객 감정 상태 분석 및 맞춤 응답
- **서비스 추천**: AI 기반 개인화된 서비스 제안

### 3. 📊 GitHub Actions 자동화
- **주간 보고서**: 매주 자동 생성되는 비즈니스 리포트
- **챗봇 훈련**: 지속적인 AI 학습 데이터 업데이트
- **성과 분석**: 자동 성과 분석 및 개선 제안

## 🛠️ 설치 및 설정

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_organization_id (선택사항)

# EmailJS 설정 (이메일 자동화용)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Google Sheets API (데이터 저장용)
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
```

### 2. AI 스크립트 설정

```bash
# AI 관련 패키지 설치
npm run setup:ai

# 스크립트 실행 권한 확인
chmod +x scripts/*.js
```

### 3. GitHub Secrets 설정

GitHub Repository Settings > Secrets and variables > Actions에서 다음 시크릿을 추가하세요:

- `OPENAI_API_KEY`: OpenAI API 키
- `EMAILJS_SERVICE_ID`: EmailJS 서비스 ID
- `EMAILJS_TEMPLATE_ID`: EmailJS 템플릿 ID
- `EMAILJS_PUBLIC_KEY`: EmailJS 공개 키
- `GOOGLE_SHEETS_API_KEY`: Google Sheets API 키

## 📋 사용 방법

### AI 자동 보고서 생성

```bash
# 수동으로 주간 보고서 생성
npm run ai:generate-report

# 결과: reports/weekly-report-YYYY-MM-DD.html 파일 생성
```

### AI 챗봇 훈련

```bash
# 챗봇 학습 데이터 업데이트
npm run ai:train-chatbot

# 결과: training-data/ 폴더에 학습 데이터 및 분석 보고서 생성
```

### 성과 분석

```bash
# AI 기반 성과 분석 실행
npm run ai:analyze-performance

# 전체 자동화 프로세스 실행
npm run ai:full-automation
```

### 챗봇 테스트

```bash
# 챗봇 성능 테스트
npm run test:chatbot
```

## 🔧 개발자 가이드

### AI 진단 엔진 커스터마이징

`src/lib/utils/enhancedDiagnosisEngine.ts`에서 다음을 수정할 수 있습니다:

```typescript
// 업종별 기본 점수 조정
const industryScores: Record<string, number> = {
  'manufacturing': 75,
  'it': 80,
  // ... 추가 업종
};

// AI 프롬프트 커스터마이징
const prompt = `사용자 정의 프롬프트...`;
```

### 챗봇 응답 개선

`src/components/chatbot/EnhancedChatbot.tsx`에서 빠른 응답 버튼을 수정:

```typescript
const QUICK_RESPONSES = [
  {
    text: "새로운 질문",
    icon: <Icon className="w-4 h-4" />,
    category: "custom"
  }
  // ... 추가 응답
];
```

### 자동화 스크립트 수정

`scripts/` 폴더의 JavaScript 파일들을 수정하여 자동화 로직을 커스터마이징할 수 있습니다.

## 📊 AI 분석 결과 해석

### 진단 점수 기준

- **90-100점**: 업계 최상위 (Excellent)
- **80-89점**: 업계 상위권 (Good)
- **70-79점**: 업계 평균 (Average)
- **60-69점**: 개선 필요 (Needs Improvement)
- **60점 미만**: 즉시 조치 필요 (Critical)

### 신뢰도 점수

- **90% 이상**: 매우 높은 신뢰도
- **80-89%**: 높은 신뢰도
- **70-79%**: 보통 신뢰도
- **70% 미만**: 추가 정보 필요

## 🔄 GitHub Actions 워크플로우

### 자동 실행 스케줄

- **주간 보고서**: 매주 월요일 오전 9시
- **챗봇 훈련**: 코드 변경 시 자동 실행
- **성과 분석**: 수동 실행 또는 스케줄 설정

### 워크플로우 트리거

```yaml
# 수동 실행
on:
  workflow_dispatch:

# 스케줄 실행
on:
  schedule:
    - cron: '0 9 * * MON'

# 코드 변경 시
on:
  push:
    paths:
      - 'src/app/api/**'
      - 'src/lib/utils/**'
```

## 🛡️ 보안 고려사항

### API 키 관리

- **절대 금지**: 코드에 API 키 하드코딩
- **GitHub Secrets 사용**: 모든 민감 정보는 GitHub Secrets로 관리
- **로컬 개발**: `.env.local` 파일 사용 (`.gitignore`에 포함됨)

### 비용 모니터링

```javascript
// OpenAI API 사용량 제한 설정
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini', // 비용 효율적인 모델 사용
  max_tokens: 1000,     // 토큰 수 제한
  temperature: 0.7      // 적절한 창의성 수준
});
```

## 📈 성능 최적화

### 병렬 처리

```javascript
// 여러 AI 분석을 병렬로 실행
const [analysis1, analysis2, analysis3] = await Promise.all([
  generateMarketAnalysis(input),
  generateRiskAssessment(input),
  generateOpportunityMapping(input)
]);
```

### 캐싱 전략

```javascript
// 결과 캐싱으로 API 호출 최소화
const cacheKey = `diagnosis_${companyHash}`;
const cachedResult = await redis.get(cacheKey);
if (cachedResult) {
  return JSON.parse(cachedResult);
}
```

## 🐛 문제 해결

### 일반적인 오류

1. **OpenAI API 키 오류**
   ```
   Error: API key not found
   ```
   → `.env.local`에서 `OPENAI_API_KEY` 확인

2. **GitHub Actions 실패**
   ```
   Error: secrets.OPENAI_API_KEY not found
   ```
   → GitHub Repository Secrets 설정 확인

3. **음성 인식 미지원**
   ```
   브라우저에서 음성 인식을 지원하지 않습니다
   ```
   → Chrome/Edge 브라우저 사용 권장

### 로그 확인

```bash
# 개발 환경에서 상세 로그 활성화
DEBUG=true npm run dev

# 프로덕션 로그 확인
npm run build
npm start
```

## 🔮 향후 개발 계획

### Phase 1 (현재)
- ✅ AI 자동 진단 시스템
- ✅ 향상된 챗봇
- ✅ GitHub Actions 자동화

### Phase 2 (예정)
- 🔄 실시간 데이터 연동
- 🔄 다국어 지원
- 🔄 모바일 앱 연동

### Phase 3 (장기)
- 🔄 AI 예측 분석
- 🔄 블록체인 보안
- 🔄 메타버스 상담

## 📞 지원 및 문의

- **기술 지원**: GitHub Issues를 통한 문의
- **비즈니스 문의**: 010-9251-9743 (이후경 경영지도사)
- **이메일**: lhk@injc.kr

---

© 2025 M-CENTER 경영지도센터 | AI 자동화 시스템 v2.0 