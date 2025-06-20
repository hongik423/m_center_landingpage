# 🔐 M-CENTER 보안 가이드라인

## 📖 개요
이 문서는 M-CENTER 랜딩페이지 프로젝트의 보안 정책과 환경변수 관리 방법을 설명합니다.

## 🛡️ 보안 정책

### 1. 환경변수 보안
- **절대 공개 금지**: 실제 API 키나 비밀번호는 GitHub에 업로드하지 않습니다
- **로컬 전용**: `.env.local` 파일은 개발자 로컬 환경에서만 사용됩니다
- **gitignore 적용**: 모든 민감한 정보는 `.gitignore`에 의해 자동 제외됩니다

### 2. GEMINI API 키 관리
```bash
# ❌ 절대 GitHub에 업로드하지 마세요
GEMINI_API_KEY=AIzaSyAP-Qa4TVNmsc-KAPTuQFjLalDNcvMHoiM

# ✅ 대신 .env.local.example에 예시만 제공
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

### 3. 파일 구조
```
프로젝트/
├── .env.local.example     ✅ GitHub 업로드 (예시 값만)
├── .env.local            ❌ GitHub 업로드 금지 (실제 값)
├── .gitignore            ✅ 보안 정책 포함
└── SECURITY_GUIDELINES.md ✅ 이 문서
```

## 🔧 개발자 설정 방법

### 1. 프로젝트 클론 후 설정
```bash
# 1. 저장소 클론
git clone [repository-url]
cd m_center_landingpage

# 2. 의존성 설치
npm install

# 3. 환경변수 파일 생성
cp .env.local.example .env.local

# 4. 실제 API 키 설정
# .env.local 파일을 열어서 your-actual-gemini-api-key-here를 
# 실제 Google AI Studio에서 발급받은 키로 교체
```

### 2. Google AI Studio에서 API 키 발급
1. https://makersuite.google.com/app/apikey 접속
2. 새 API 키 생성
3. 생성된 키를 .env.local 파일에 설정

### 3. 환경변수 검증
```bash
# 개발 서버 실행
npm run dev

# 콘솔에서 다음 메시지 확인
# ✅ Gemini API Key 검증 완료: AIzaSy****Ab12
```

## 🚨 보안 체크리스트

### GitHub 업로드 전 확인사항
- [ ] `.env.local` 파일이 .gitignore에 포함되어 있음
- [ ] 실제 API 키가 코드에 하드코딩되어 있지 않음
- [ ] `.env.local.example`에는 예시 값만 있음
- [ ] 민감한 정보가 포함된 파일들이 모두 .gitignore에 등록됨

### 코드 리뷰 체크사항
- [ ] `process.env`를 통해서만 환경변수 접근
- [ ] API 키 검증 로직이 포함됨
- [ ] 오류 발생 시 폴백 응답 제공
- [ ] 로그에 실제 API 키가 노출되지 않음 (마스킹 처리)

## 📝 환경변수 목록

### 필수 환경변수 (서버 사이드)
```bash
# Google GEMINI AI API (서버 전용)
GEMINI_API_KEY=AIzaSy...

# 개발 환경 설정
NODE_ENV=development
```

### 공개 환경변수 (클라이언트 사이드)
```bash
# EmailJS 설정
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxx

# Google Sheets & Apps Script
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1bAb...
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/...

# 사이트 설정
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 🔄 배포 시 주의사항

### Vercel 배포
1. Vercel 대시보드에서 환경변수 설정
2. `GEMINI_API_KEY`를 Production 환경변수로 추가
3. GitHub에는 실제 키가 업로드되지 않도록 확인

### 기타 플랫폼
- 각 플랫폼의 환경변수 설정 기능 사용
- 절대 GitHub 코드에 하드코딩하지 않음
- 환경변수 검증 로직 활용

## 📞 문의사항
보안 관련 문의나 취약점 발견 시:
- 이메일: hongik423@gmail.com
- 전화: 010-9251-9743 (이후경 경영지도사)

---
**⚠️ 중요**: 이 가이드라인을 준수하여 모든 민감한 정보가 안전하게 관리되도록 해주세요. 