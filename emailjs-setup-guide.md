# 📧 EmailJS 템플릿 설정 완전 가이드

## 🎯 개요

기업의별 M-CENTER에서 사용할 **두 가지 EmailJS 템플릿**이 준비되었습니다:

1. **진단신청 확인 템플릿** (`template_diagnosis_conf`)
2. **상담신청 확인 템플릿** (`template_consultation_conf`)

---

## 📋 1. EmailJS 대시보드 설정

### 1단계: EmailJS 로그인
```
https://www.emailjs.com/
```
- 계정 로그인 또는 신규 가입

### 2단계: 서비스 확인
- **현재 서비스 ID**: `service_qd9eycz`
- **Public Key**: `268NPLwN54rPvEias`

### 3단계: 템플릿 생성

#### 📊 템플릿 1: 진단신청 확인 (template_diagnosis_conf)
1. **EmailJS 대시보드** → **Email Templates** → **Create New Template**
2. **Template ID**: `template_diagnosis_conf`
3. **Template Name**: `AI 무료진단 신청 확인`
4. **Subject**: `[기업의별 M-CENTER] AI 무료진단 신청이 접수되었습니다 - {{company_name}}`
5. **Content**: `emailjs-template-diagnosis.html` 파일의 전체 HTML 코드 복사

#### 🤝 템플릿 2: 상담신청 확인 (template_consultation_conf)
1. **EmailJS 대시보드** → **Email Templates** → **Create New Template**
2. **Template ID**: `template_consultation_conf`
3. **Template Name**: `전문가 상담 신청 확인`
4. **Subject**: `[기업의별 M-CENTER] 전문가 상담 신청이 접수되었습니다 - {{company_name}}`
5. **Content**: `emailjs-template-consultation.html` 파일의 전체 HTML 코드 복사

---

## 🔧 2. 템플릿 변수 매핑

### 📊 진단신청 템플릿 변수 (template_diagnosis_conf)

| 변수명 | 설명 | 예시 값 |
|--------|------|---------|
| `{{to_name}}` | 수신자 이름 | 홍길동 |
| `{{to_email}}` | 수신자 이메일 | hongik1@daum.net |
| `{{company_name}}` | 회사명 | 테스트회사 |
| `{{diagnosis_date}}` | 진단 신청일 | 2025. 6. 20. |
| `{{service_name}}` | 서비스명 | AI 무료진단 |
| `{{consultant_name}}` | 컨설턴트 이름 | 이후경 경영지도사 |
| `{{consultant_phone}}` | 컨설턴트 전화 | 010-9251-9743 |
| `{{consultant_email}}` | 컨설턴트 이메일 | hongik423@gmail.com |
| `{{reply_message}}` | 추가 메시지 | 상세한 진단 결과를... |

### 🤝 상담신청 템플릿 변수 (template_consultation_conf)

| 변수명 | 설명 | 예시 값 |
|--------|------|---------|
| `{{to_name}}` | 수신자 이름 | 김상담 |
| `{{to_email}}` | 수신자 이메일 | consultation@test.com |
| `{{company_name}}` | 회사명 | 상담테스트회사 |
| `{{consultation_type}}` | 상담 유형 | 전화 상담 |
| `{{consultation_area}}` | 상담 분야 | BM ZEN 사업분석 |
| `{{preferred_time}}` | 희망 시간 | 오후 (13:00-17:00) |
| `{{inquiry_content}}` | 문의 내용 | 사업 분석에 대해... |
| `{{consultation_date}}` | 상담 신청일 | 2025. 6. 20. |
| `{{consultant_name}}` | 컨설턴트 이름 | 이후경 경영지도사 |
| `{{consultant_phone}}` | 컨설턴트 전화 | 010-9251-9743 |
| `{{consultant_email}}` | 컨설턴트 이메일 | hongik423@gmail.com |
| `{{reply_message}}` | 추가 메시지 | 담당자가 연락드리겠습니다... |

---

## 📤 3. 코드에서 EmailJS 호출 방법

### 진단신청 이메일 발송
```javascript
const templateParams = {
  to_email: 'hongik1@daum.net',
  to_name: '홍길동',
  company_name: '테스트회사',
  diagnosis_date: '2025. 6. 20.',
  service_name: 'AI 무료진단',
  consultant_name: '이후경 경영지도사',
  consultant_phone: '010-9251-9743',
  consultant_email: 'hongik423@gmail.com',
  reply_message: 'AI 진단 결과를 2-3일 내에 연락드리겠습니다.'
};

emailjs.send('service_qd9eycz', 'template_diagnosis_conf', templateParams);
```

### 상담신청 이메일 발송
```javascript
const templateParams = {
  to_email: 'consultation@test.com',
  to_name: '김상담',
  company_name: '상담테스트회사',
  consultation_type: '전화 상담',
  consultation_area: 'BM ZEN 사업분석',
  preferred_time: '오후 (13:00-17:00)',
  inquiry_content: '비즈니스 모델 분석에 대해 상담받고 싶습니다.',
  consultation_date: '2025. 6. 20.',
  consultant_name: '이후경 경영지도사',
  consultant_phone: '010-9251-9743',
  consultant_email: 'hongik423@gmail.com',
  reply_message: '담당 컨설턴트가 24시간 내에 연락드리겠습니다.'
};

emailjs.send('service_qd9eycz', 'template_consultation_conf', templateParams);
```

---

## 🧪 4. 테스트 방법

### 브라우저 직접 테스트
1. `test-emailjs-both-templates.html` 파일 열기
2. 수신자 정보 입력
3. 원하는 템플릿 선택하여 발송 테스트

### API 통합 테스트
```bash
# 진단신청 테스트
curl -X POST http://localhost:3002/api/simplified-diagnosis \
  -H "Content-Type: application/json" \
  -d '{"companyName":"테스트회사","contactEmail":"hongik1@daum.net",...}'

# 상담신청 테스트  
curl -X POST http://localhost:3002/api/consultation \
  -H "Content-Type: application/json" \
  -d '{"name":"홍길동","email":"hongik1@daum.net",...}'
```

---

## 🎨 5. 템플릿 디자인 특징

### 📊 진단신청 템플릿
- **색상**: 파란색 계열 (#007bff)
- **아이콘**: 📊 (진단), 🚀 (다음단계)
- **강조**: AI 진단 결과, 분석 프로세스
- **톤앤매너**: 전문적, 분석적

### 🤝 상담신청 템플릿  
- **색상**: 녹색 계열 (#28a745)
- **아이콘**: 🤝 (상담), 📅 (일정)
- **강조**: 상담 진행 절차, 컨설턴트 정보
- **톤앤매너**: 친근함, 신뢰감

---

## ⚙️ 6. 환경변수 설정

### .env.local 파일
```bash
# EmailJS 설정
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qd9eycz
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=268NPLwN54rPvEias

# 템플릿 ID (참고용)
NEXT_PUBLIC_EMAILJS_DIAGNOSIS_TEMPLATE_ID=template_diagnosis_conf
NEXT_PUBLIC_EMAILJS_CONSULTATION_TEMPLATE_ID=template_consultation_conf
```

---

## 🔧 7. 문제 해결

### 템플릿이 적용되지 않는 경우
1. **템플릿 ID 확인**: `template_diagnosis_conf`, `template_consultation_conf`
2. **변수명 확인**: `{{변수명}}` 형식 정확히 사용
3. **EmailJS 대시보드**: 템플릿 저장 및 활성화 확인

### 이메일이 발송되지 않는 경우
1. **서비스 설정**: EmailJS 서비스 상태 확인
2. **API 키**: Public Key 정확성 확인
3. **브라우저 환경**: 서버가 아닌 클라이언트에서 실행

### 디자인이 깨지는 경우
1. **HTML 완전성**: 전체 HTML 코드 복사 확인
2. **CSS 포함**: 인라인 스타일 누락 확인
3. **이메일 클라이언트**: 다양한 메일 앱에서 테스트

---

## 🚀 8. 프로덕션 배포

### Vercel/Netlify 환경변수 설정
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qd9eycz
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=268NPLwN54rPvEias
```

### 도메인 확인
- EmailJS 대시보드에서 허용 도메인 설정
- 프로덕션 도메인 추가

---

## 📋 9. 체크리스트

### EmailJS 설정 완료 체크
- [ ] 두 개 템플릿 생성 완료
- [ ] 템플릿 ID 정확히 설정
- [ ] 모든 변수 매핑 확인
- [ ] 테스트 이메일 발송 성공
- [ ] 디자인 정상 표시 확인

### 코드 통합 완료 체크
- [ ] 환경변수 설정 완료
- [ ] API 라우트 수정 완료
- [ ] 클라이언트 사이드 구현
- [ ] 오류 처리 로직 추가
- [ ] 로그 및 모니터링 설정

---

## 🎉 완료!

이제 **진단신청자**와 **상담신청자**에게 각각 다른 디자인과 내용의 전문적인 확인 이메일을 자동으로 발송할 수 있습니다!

**hongik1@daum.net**으로 실제 테스트해보시기 바랍니다! 📧✨ 