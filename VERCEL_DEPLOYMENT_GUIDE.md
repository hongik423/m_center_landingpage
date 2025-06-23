# 🚀 Vercel 자동 배포 가이드

M-CENTER 랜딩페이지를 Vercel에 자동 배포하는 완전한 가이드입니다.

## 📋 **배포 전 체크리스트**

- ✅ GitHub에 코드 push 완료
- ✅ 빌드 테스트 성공 (`npm run build`)
- ✅ 환경변수 준비 완료
- ✅ Vercel 계정 준비

## 🔗 **1단계: GitHub 연동**

### 1.1 Vercel 계정 생성/로그인
1. [vercel.com](https://vercel.com)에 접속
2. **"Sign Up"** 또는 **"Login"** 클릭
3. **"Continue with GitHub"** 선택하여 GitHub 계정으로 로그인

### 1.2 프로젝트 가져오기
1. Vercel 대시보드에서 **"New Project"** 클릭
2. **"Import Git Repository"** 섹션에서 GitHub 검색
3. `hongik423/m_center_landingpage` 저장소 선택
4. **"Import"** 클릭

## ⚙️ **2단계: 환경변수 설정**

### 2.1 필수 환경변수

Vercel 프로젝트 설정에서 다음 환경변수들을 추가하세요:

```bash
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Google Sheets 연동
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_google_sheets_id
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=your_google_apps_script_url

# 기본 설정
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_APP_NAME=M-CENTER 경영지도센터
NEXT_PUBLIC_APP_DESCRIPTION=Business Model Zen 프레임워크 기반 기업 성장 솔루션

# 이메일 서비스 (EmailJS)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# 개발 환경
NODE_ENV=production
```

### 2.2 환경변수 추가 방법

1. Vercel 프로젝트 대시보드 이동
2. **"Settings"** 탭 클릭
3. **"Environment Variables"** 메뉴 선택
4. 위의 환경변수들을 하나씩 추가:
   - **Name**: 변수명 입력
   - **Value**: 실제 값 입력
   - **Environment**: `Production`, `Preview`, `Development` 모두 선택
   - **"Add"** 클릭

### 2.3 환경변수 값 확인 방법

```bash
# 현재 설정된 환경변수 확인
echo $GEMINI_API_KEY
echo $NEXT_PUBLIC_GOOGLE_SHEETS_ID
```

## 🔧 **3단계: 배포 설정 최적화**

### 3.1 빌드 명령어 확인
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci"
}
```

### 3.2 도메인 설정 (선택사항)
1. **"Settings"** → **"Domains"** 메뉴
2. 커스텀 도메인 추가 가능
3. DNS 설정 안내 따라 진행

## 🚀 **4단계: 자동 배포 활성화**

### 4.1 Git 기반 자동 배포
- ✅ **main/master 브랜치** push 시 자동 프로덕션 배포
- ✅ **다른 브랜치** push 시 프리뷰 배포
- ✅ **Pull Request** 시 프리뷰 URL 자동 생성

### 4.2 배포 트리거
```bash
# 배포 실행
git add .
git commit -m "feat: Vercel 배포 설정 완료"
git push origin master
```

## 📊 **5단계: 배포 모니터링**

### 5.1 배포 상태 확인
1. Vercel 대시보드에서 **"Deployments"** 탭 확인
2. 빌드 로그 실시간 모니터링
3. 에러 발생 시 로그에서 원인 파악

### 5.2 성능 모니터링
- **Core Web Vitals** 자동 측정
- **Analytics** 사용자 데이터 수집
- **Speed Insights** 성능 최적화 제안

## 🔍 **6단계: 문제 해결**

### 6.1 일반적인 오류 해결

**1. 빌드 실패**
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 확인 후 수정
npm run lint
npm run type-check
```

**2. 환경변수 오류**
- Vercel 대시보드에서 환경변수 재확인
- 변수명 대소문자 정확히 입력
- `NEXT_PUBLIC_` 접두사 확인

**3. 런타임 오류**
- Vercel Functions 로그 확인
- API 라우트 경로 확인
- CORS 설정 점검

### 6.2 디버깅 도구

```bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 로컬에서 Vercel 환경 테스트
vercel dev

# 배포 로그 확인
vercel logs
```

## 📈 **7단계: 최적화 팁**

### 7.1 성능 최적화
- ✅ Next.js Image 컴포넌트 사용
- ✅ 동적 import로 코드 분할
- ✅ Edge Runtime 활용
- ✅ ISR(Incremental Static Regeneration) 설정

### 7.2 SEO 최적화
- ✅ `next/head`로 메타태그 설정
- ✅ 구조화된 데이터 추가
- ✅ sitemap.xml 자동 생성
- ✅ robots.txt 설정

### 7.3 보안 강화
- ✅ 환경변수로 민감 정보 관리
- ✅ CORS 설정
- ✅ CSP(Content Security Policy) 적용
- ✅ HTTPS 강제 리다이렉션

## 🎯 **완료 확인**

### ✅ 배포 성공 체크리스트

- [ ] Vercel 대시보드에서 "Ready" 상태 확인
- [ ] 배포 URL 접속하여 사이트 정상 작동 확인
- [ ] AI 챗봇 기능 테스트
- [ ] 세금계산기 모바일 테스트
- [ ] 구글 시트 연동 테스트
- [ ] 이메일 전송 기능 테스트

### 🔗 **유용한 링크**

- **Vercel 대시보드**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **배포된 사이트**: `https://your-project-name.vercel.app`
- **GitHub 저장소**: [github.com/hongik423/m_center_landingpage](https://github.com/hongik423/m_center_landingpage)
- **Vercel 문서**: [vercel.com/docs](https://vercel.com/docs)

## 🆘 **지원 및 문의**

배포 과정에서 문제가 발생하면:

1. **Vercel 로그 확인** → 구체적인 에러 메시지 파악
2. **GitHub Issues** → 커뮤니티 도움 요청
3. **Vercel Support** → 플랫폼 관련 기술 지원

---

## 🎉 **축하합니다!**

M-CENTER 랜딩페이지가 성공적으로 Vercel에 배포되었습니다!

이제 GitHub에 코드를 push할 때마다 자동으로 배포되며, 
전 세계 사용자들이 빠르고 안정적으로 서비스를 이용할 수 있습니다.

**다음 단계**: 사용자 피드백을 수집하고 지속적으로 개선해보세요! 🚀 