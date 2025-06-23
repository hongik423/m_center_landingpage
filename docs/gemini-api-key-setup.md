# 🤖 Google Gemini API 키 발급 가이드

## 📋 **1단계: Google AI Studio 접속**

1. 🔗 [Google AI Studio](https://aistudio.google.com/) 접속
2. **Google 계정으로 로그인**
3. **"Get API Key" 버튼** 클릭

## 🔑 **2단계: API 키 생성**

1. **"Create API Key"** 선택
2. **프로젝트 선택** 또는 새 프로젝트 생성
3. **API 키 복사** (안전한 곳에 보관)

## ⚙️ **3단계: 환경변수 설정**

**Windows 환경에서:**
```cmd
# .env.local 파일에 새 API 키 설정
echo GEMINI_API_KEY=여기에_새로운_API키_입력 > .env.local
```

**또는 직접 .env.local 파일 편집:**
```env
GEMINI_API_KEY=여기에_새로운_API키_입력
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1BQVsd0kx7YK-KcPtOlMPnMCO__eiEo1gSv0_qG_Ag6Q
NODE_ENV=development
```

## 🧪 **4단계: 테스트**

```cmd
# 개발 서버 재시작
npm run dev

# API 테스트
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d "{\"message\":\"테스트\"}"
```

## 🔒 **보안 주의사항**

- ✅ API 키는 절대 GitHub에 올리지 마세요
- ✅ .env.local 파일은 .gitignore에 포함되어 있습니다
- ✅ 월간 사용량 제한을 설정하세요

## 💡 **사용량 관리**

- **무료 한도**: 월 60회 요청
- **유료 전환**: 필요시 Google Cloud 결제 설정
- **모니터링**: AI Studio에서 사용량 확인

---

**💻 설정 완료 후 AI 챗봇이 실제 Google Gemini AI로 응답합니다!** 