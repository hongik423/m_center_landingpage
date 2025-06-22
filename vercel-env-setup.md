# Vercel 환경 변수 설정 가이드

## ⭐ 별-AI상담사 Gemini API 설정

### 1. Google AI Studio에서 API 키 발급
1. https://makersuite.google.com/app/apikey 접속
2. "Create API Key" 클릭
3. API 키 복사 (AIzaSy... 형태)

### 2. Vercel 환경 변수 설정 (3가지 방법)

#### 방법 1: Vercel 웹사이트에서 설정
1. https://vercel.com/dashboard 접속
2. 프로젝트 선택 → Settings → Environment Variables
3. 다음 변수들 추가:

```
Name: GEMINI_API_KEY
Value: AIzaSy-YOUR-ACTUAL-GEMINI-API-KEY-HERE
Environment: Production, Preview

Name: NEXT_PUBLIC_EMAILJS_SERVICE_ID  
Value: service_qd9eycz
Environment: Production, Preview

Name: NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
Value: 268NPLwN54rPvEias  
Environment: Production, Preview

Name: NEXT_PUBLIC_GOOGLE_SHEETS_ID
Value: 1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug
Environment: Production, Preview

Name: NEXT_PUBLIC_GOOGLE_SCRIPT_URL
Value: https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec
Environment: Production, Preview
```

#### 방법 2: Vercel CLI로 설정
```bash
vercel env add GEMINI_API_KEY
# AIzaSy-YOUR-ACTUAL-GEMINI-API-KEY-HERE 입력

vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID
# service_qd9eycz 입력

vercel env add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  
# 268NPLwN54rPvEias 입력

vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_ID
# 1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug 입력

vercel env add NEXT_PUBLIC_GOOGLE_SCRIPT_URL
# https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec 입력
```

#### 방법 3: .env 파일 사용
로컬에서 `.env.local` 파일 생성 후 `vercel env pull` 사용

### 3. 배포 및 확인
```bash
vercel --prod
```

### 4. 테스트
배포된 사이트에서 AI 상담사 테스트:
- 챗봇 아이콘 클릭
- 질문 입력
- Gemini AI 응답 확인

## 🔧 트러블슈팅

### GEMINI_API_KEY 오류 시
- API 키가 AIzaSy로 시작하는지 확인
- Google AI Studio에서 API 사용 활성화 확인
- 키 길이가 39자 정도인지 확인

### API 호출 실패 시  
- Vercel 함수 로그 확인
- 환경 변수 설정 재확인
- 빌드 및 재배포 