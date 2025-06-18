# 🔒 **보안 정책 (Security Policy)**

## 🛡️ **지원되는 버전 (Supported Versions)**

| 버전 | 보안 지원 |
| --- | --- |
| 1.0.x | ✅ |
| < 1.0 | ❌ |

## 🚨 **보안 취약점 신고 (Reporting Security Vulnerabilities)**

보안 취약점을 발견하셨다면 **공개 이슈로 보고하지 마세요**. 대신 다음 방법으로 비공개 신고해 주세요:

- 📧 **이메일**: hongik423@gmail.com
- 🔒 **제목**: `[SECURITY] 보안 취약점 신고`
- 📝 **내용**: 취약점 상세 설명 및 재현 방법

## 🔐 **환경변수 보안 (Environment Variables Security)**

### **✅ 안전한 환경변수 설정**

```bash
# .env.local (GitHub에 절대 업로드 금지)
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_sheets_id_here
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
OPENAI_API_KEY=sk-proj-...
```

### **🚫 절대 하지 말 것**
- ❌ API 키를 코드에 직접 입력
- ❌ `.env.local` 파일을 Git에 커밋
- ❌ Discord, Slack 등에 API 키 공유
- ❌ 스크린샷에 API 키 노출

## 🛡️ **GitHub Secrets 설정**

### **Repository Secrets 설정 방법**
1. GitHub 저장소 > Settings > Secrets and variables > Actions
2. 다음 Secrets 추가:

```
OPENAI_API_KEY           # OpenAI API 키
EMAILJS_SERVICE_ID       # EmailJS 서비스 ID  
EMAILJS_PUBLIC_KEY       # EmailJS 공개 키
GOOGLE_SHEETS_ID         # Google Sheets ID
GOOGLE_SCRIPT_URL        # Google Apps Script 웹앱 URL
VERCEL_TOKEN            # Vercel 배포 토큰 (배포 시)
```

### **환경별 Secrets 관리**

- **Development**: `.env.local` (로컬만)
- **Staging**: GitHub Secrets + 별도 API 키
- **Production**: GitHub Secrets + 프로덕션 API 키

## 🔒 **API 키 보안 정책**

### **OpenAI API 키**
- 🔐 서버 사이드에서만 사용
- 🔍 API 키 형식 검증 (`sk-` 시작)
- ⏰ 정기적인 키 rotation
- 💰 사용량 모니터링 및 제한

### **Google Apps Script URL**
- 🌐 환경변수로 관리 (**하드코딩 금지**)
- 🔒 스크립트 접근 권한 제한
- 📊 데이터 수집 목적으로만 사용
- 🕐 정기적인 스크립트 접근 권한 검토

### **EmailJS 설정**
- 🔓 클라이언트 사이드 사용 가능
- 📧 이메일 템플릿 보안 검증
- 🚫 스팸 방지 정책 적용
- 📈 사용량 모니터링

## 🔍 **자동 보안 검사**

### **GitHub Actions 보안 워크플로우**
```yaml
name: Security Check
on: [push, pull_request]
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Secret Detection
        run: |
          # API 키 하드코딩 검사
          if grep -r "sk-proj-" src/; then
            echo "❌ OpenAI API 키가 하드코딩되어 있습니다!"
            exit 1
          fi
          
          # 비밀번호 하드코딩 검사  
          if grep -r "password\s*=" src/; then
            echo "❌ 비밀번호가 하드코딩되어 있습니다!"
            exit 1
          fi
          
          echo "✅ 보안 검사 통과"
```

### **의존성 취약점 검사**
```bash
# 정기적인 보안 감사
npm audit
npm audit fix

# Snyk를 통한 고급 취약점 스캔
npx snyk test
```

## 🔧 **보안 모범 사례**

### **코드 작성 시**
- ✅ 환경변수 사용으로 민감한 정보 분리
- ✅ 입력값 검증 및 sanitization
- ✅ HTTPS 통신 강제
- ✅ CSP (Content Security Policy) 적용
- ✅ API 요청 rate limiting

### **배포 시**
- ✅ 프로덕션 환경변수 분리
- ✅ 최소 권한 원칙 적용
- ✅ 정기적인 보안 업데이트
- ✅ 접근 로그 모니터링
- ✅ 백업 데이터 암호화

### **운영 시**
- ✅ 정기적인 API 키 rotation
- ✅ 사용량 모니터링 및 알림
- ✅ 보안 패치 적용
- ✅ 접근 권한 정기 검토
- ✅ 인시던트 대응 계획

## 🚨 **긴급 보안 대응**

### **API 키 노출 시**
1. 🔴 **즉시 키 무효화**
2. 🔄 **새 키 생성 및 교체**
3. 📧 **관련자에게 알림**
4. 📝 **인시던트 기록**
5. 🔍 **원인 분석 및 개선**

### **데이터 유출 의심 시**
1. 🛑 **서비스 일시 중단**
2. 🔍 **영향 범위 조사**
3. 👥 **사용자 알림**
4. 🔧 **취약점 수정**
5. 📊 **복구 및 모니터링**

## 📞 **연락처**

- 🔒 **보안 문의**: hongik423@gmail.com
- 📧 **일반 문의**: hongik423@gmail.com
- 📞 **긴급 연락**: 010-9251-9743

## 📋 **보안 체크리스트**

### **개발자용**
- [ ] ✅ 환경변수 설정 확인
- [ ] ✅ API 키 하드코딩 없음 확인
- [ ] ✅ `.gitignore`에 민감한 파일 등록
- [ ] ✅ 보안 검사 워크플로우 통과
- [ ] ✅ 의존성 취약점 검사 완료

### **배포용**
- [ ] ✅ 프로덕션 환경변수 설정
- [ ] ✅ GitHub Secrets 설정 완료
- [ ] ✅ HTTPS 적용 확인
- [ ] ✅ 접근 권한 최소화
- [ ] ✅ 모니터링 설정 완료

## 🔄 **보안 정책 업데이트**

이 보안 정책은 다음과 같은 경우 업데이트됩니다:
- 새로운 보안 위협 발견 시
- 기술 스택 변경 시  
- 법적 요구사항 변경 시
- 정기 검토 (분기별)

**마지막 업데이트**: 2024년 12월 18일

---

**⚠️ 중요**: 이 문서의 보안 지침을 반드시 준수해주세요. 보안은 모든 기여자의 책임입니다! 