# 🚀 M-CENTER 별-AI상담사 GitHub 배포 가이드

## ⭐ **Gemini AI 기반 별-AI상담사 활성화**

M-CENTER 웹사이트의 **별-AI상담사**가 정상적으로 작동하려면 **Gemini API 키 설정**이 필수입니다.

---

## 🎯 1. Gemini API 키 발급 (필수)

### 1단계: Google AI Studio 접속
1. [Google AI Studio](https://aistudio.google.com/) 접속
2. Google 계정으로 로그인
3. **"Get API Key"** 또는 **"API 키 받기"** 클릭

### 2단계: API 키 생성
1. **"Create API Key"** 클릭
2. 프로젝트 선택 (없으면 새로 생성)
3. API 키 복사 (형식: `AIzaSy...`)

### 3단계: API 키 확인
- 키가 `AIzaSy`로 시작하는지 확인
- 키 길이가 39자 정도인지 확인
- 안전한 곳에 저장

---

## 🔧 2. GitHub 배포 환경변수 설정

### Option A: Vercel 배포 (권장 ⭐)

1. **Vercel Dashboard 접속**
   - [Vercel.com](https://vercel.com) 로그인
   - GitHub 저장소 연결

2. **환경변수 설정**
   - 프로젝트 → **Settings** → **Environment Variables**
   - 다음 변수들 추가:

```bash
# 🤖 AI 상담사 핵심 설정 (필수)
GEMINI_API_KEY=발급받은_실제_키_입력

# 📧 EmailJS 설정 (이미 구성됨)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qd9eycz
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=268NPLwN54rPvEias

# 📊 Google Apps Script 설정 (이미 구성됨)
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec

# 🌐 사이트 설정
NEXT_PUBLIC_BASE_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

3. **자동 배포**
   - GitHub에 코드 푸시하면 자동 배포
   - 몇 분 후 AI 상담사 활성화 확인

### Option B: GitHub Pages 배포

⚠️ **주의**: GitHub Pages는 서버리스 환경으로 AI 기능에 제한이 있습니다.

1. **GitHub Actions 설정**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build:github
           env:
             GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

2. **GitHub Secrets 설정**
   - Repository → Settings → Secrets and variables → Actions
   - **New repository secret** 클릭
   - Name: `GEMINI_API_KEY`
   - Value: 발급받은 API 키 입력

---

## 🧪 3. AI 상담사 테스트

### 로컬 개발 환경 테스트
```bash
# 환경변수 파일 생성
echo "GEMINI_API_KEY=발급받은_키" > .env.local

# 개발 서버 실행
npm run dev

# 브라우저에서 테스트
# http://localhost:3000/chatbot
```

### 배포 환경 테스트
1. 배포된 사이트 접속
2. 우하단 **별-AI상담사** 아이콘 클릭
3. 테스트 메시지 전송: "안녕하세요"
4. AI 응답 확인

---

## 🎯 4. 배포 완료 체크리스트

### ✅ 필수 확인사항
- [ ] Gemini API 키 정상 발급 및 설정
- [ ] 환경변수 `GEMINI_API_KEY` 설정 완료
- [ ] 배포 환경에서 AI 상담사 정상 작동
- [ ] 모든 서비스 페이지 정상 로딩
- [ ] 진단 및 상담 신청 기능 테스트

### 🔍 AI 상담사 기능 확인
- [ ] 챗봇 아이콘 표시 및 클릭 가능
- [ ] 환영 메시지 정상 표시
- [ ] 사용자 메시지 전송 가능
- [ ] AI 응답 정상 수신
- [ ] M-CENTER 서비스 정보 정확 제공
- [ ] 상담 연결 정보 제공

---

## 🚨 5. 문제 해결

### AI 상담사가 응답하지 않는 경우
1. **API 키 확인**
   ```bash
   # 로컬에서 확인
   node -e "console.log('API Key:', process.env.GEMINI_API_KEY?.slice(0,8) + '...')"
   ```

2. **콘솔 로그 확인**
   - 브라우저 개발자 도구 열기
   - Console 탭에서 오류 메시지 확인

3. **일반적인 해결책**
   - API 키 재확인 및 재설정
   - 환경변수 오타 확인
   - 배포 환경 재빌드

### 폴백 모드 작동
- API 키가 없으면 자동으로 폴백 응답 제공
- 기본 상담 정보 및 연락처 안내 유지

---

## 💡 6. 추가 최적화

### 성능 향상
- Vercel 배포 권장 (서버리스 함수 지원)
- CDN 캐싱 활용
- 이미지 최적화 적용

### 보안 강화
- API 키는 환경변수로만 관리
- 클라이언트 코드에 노출 금지
- HTTPS 연결 필수

### 모니터링
- Vercel Analytics 활용
- 에러 로깅 시스템 구축
- AI 응답 품질 모니터링

---

## 📞 7. 지원 및 문의

### 기술 지원
- **개발 문의**: GitHub Issues 등록
- **긴급 상담**: 010-9251-9743 (이후경 경영지도사)
- **이메일**: hongik423@gmail.com

### 참고 자료
- [Google AI Studio 가이드](https://aistudio.google.com/app/apikey)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [Next.js 환경변수 가이드](https://nextjs.org/docs/basic-features/environment-variables)

---

## 🎉 배포 성공!

**별-AI상담사**가 성공적으로 활성화되면:
- ⭐ 24시간 자동 상담 서비스 제공
- 🧠 GEMINI AI 기반 정확한 답변
- 📈 고객 만족도 및 전환율 향상
- 🚀 M-CENTER 경쟁력 강화

**M-CENTER의 디지털 혁신이 완성되었습니다!** 🎊 