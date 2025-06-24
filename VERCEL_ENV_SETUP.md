# 🚀 Vercel 환경변수 설정 가이드

## 📋 필수 환경변수 목록

Vercel 프로젝트 설정에서 다음 환경변수들을 추가하세요:

### 🔧 Google Apps Script 연동 (필수)
```
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec
```

### 🤖 AI API 키 (운영환경 필수)
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 🌍 환경 설정
```
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=M-CENTER 경영지도센터
NEXT_PUBLIC_APP_DESCRIPTION=Business Model Zen 프레임워크 기반 기업 성장 솔루션
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
```

### 📧 이메일 서비스 (선택사항)
```
ADMIN_EMAIL=hongik423@gmail.com
NOTIFICATION_ENABLED=true
AUTO_REPLY_ENABLED=true
```

## 🔧 환경변수 추가 방법

1. **Vercel 프로젝트 대시보드** 접속
2. **"Settings"** 탭 클릭
3. **"Environment Variables"** 메뉴 선택
4. 위의 환경변수들을 하나씩 추가:
   - **Name**: 변수명 입력
   - **Value**: 실제 값 입력
   - **Environment**: `Production`, `Preview`, `Development` 모두 선택
   - **"Add"** 클릭

## ✅ 환경변수 설정 완료 체크리스트

- [ ] NEXT_PUBLIC_GOOGLE_SHEETS_ID
- [ ] NEXT_PUBLIC_GOOGLE_SCRIPT_URL  
- [ ] GEMINI_API_KEY
- [ ] NODE_ENV=production
- [ ] NEXT_PUBLIC_APP_NAME
- [ ] NEXT_PUBLIC_APP_DESCRIPTION
- [ ] NEXT_PUBLIC_BASE_URL

## 🚀 배포 실행

환경변수 설정 완료 후:
1. GitHub에 최신 코드 push
2. Vercel에서 자동 배포 시작
3. 배포 완료 후 도메인 확인

## 📞 문의

배포 과정에서 문제 발생 시:
- **담당자**: 이후경 경영지도사
- **이메일**: hongik423@gmail.com
- **전화**: 010-9251-9743 