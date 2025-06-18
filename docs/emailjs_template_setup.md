# 📧 EmailJS 템플릿 설정 가이드

## 🔧 EmailJS 계정 설정

### 1단계: EmailJS 계정 생성
1. [EmailJS 웹사이트](https://www.emailjs.com/) 접속
2. 회원가입 진행
3. 서비스 ID: `service_qd9eycz` 확인
4. Public Key: `268NPLwN54rPvEias` 확인

### 2단계: 이메일 서비스 연결
1. EmailJS 대시보드 → Email Services
2. Gmail 또는 원하는 이메일 서비스 추가
3. 서비스 ID가 `service_qd9eycz`인지 확인

## 📝 필수 템플릿 생성 (1개만 사용)

### ✅ 사용하는 템플릿: template_diagnosis_confirmation (진단 신청 확인)

**템플릿 ID**: `template_diagnosis_confirmation`

**제목**: `[M-CENTER] AI 무료진단 신청이 접수되었습니다 - {{company_name}}`

**내용**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #4285f4; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .content { padding: 20px 0; }
        .info-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .step { display: flex; align-items: center; margin: 10px 0; }
        .step-number { background: #4285f4; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; }
        .contact-info { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>M-CENTER 경영지도센터</h1>
            <p>AI 무료진단 신청 접수 완료</p>
        </div>
        
        <div class="content">
            <p>안녕하세요, <strong>{{to_name}}</strong>님!</p>
            
            <p>M-CENTER 경영지도센터입니다. AI 무료진단 신청이 성공적으로 접수되었습니다.</p>
            
            <div class="info-box">
                <h3>📋 신청 정보</h3>
                <ul>
                    <li><strong>회사명:</strong> {{company_name}}</li>
                    <li><strong>업종:</strong> {{industry}}</li>
                    <li><strong>담당자:</strong> {{contact_name}}</li>
                    <li><strong>연락처:</strong> {{contact_phone}}</li>
                    <li><strong>접수일시:</strong> {{submit_date}}</li>
                </ul>
            </div>
            
            <h3>🔄 진행 절차</h3>
            <div class="step">
                <div class="step-number">1</div>
                <div>✅ <strong>신청 접수 완료</strong> (현재 단계)</div>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <div>🤖 AI 분석 진행 (약 5-10분 소요)</div>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <div>📊 맞춤형 진단 결과 생성</div>
            </div>
            <div class="step">
                <div class="step-number">4</div>
                <div>📧 진단 결과 이메일 발송</div>
            </div>
            <div class="step">
                <div class="step-number">5</div>
                <div>💬 전문가 상담 연결</div>
            </div>
            
            <div class="contact-info">
                <h3>📞 문의사항</h3>
                <p>궁금한 점이 있으시면 언제든 연락주세요:</p>
                <ul>
                    <li>📧 이메일: {{admin_email}}</li>
                    <li>📞 전화: 010-9251-9743</li>
                    <li>🏢 담당자: 이후경 책임컨설턴트</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>M-CENTER 경영지도센터</strong></p>
            <p>기업의 성장을 위한 전문 경영지도 서비스</p>
        </div>
    </div>
</body>
</html>
```

### ❌ 사용하지 않는 템플릿: template_diagnosis_result (진단 결과 발송)

**템플릿 ID**: `template_diagnosis_result`  
**📋 운영 방식**: 진단 결과는 이메일 발송 대신 **다운로드 방식**으로 제공

~~**제목**: `[M-CENTER] {{company_name}} AI 무료진단 결과가 완료되었습니다!`~~

**내용**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .result-box { background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #4285f4; }
        .service-box { background: #fff; border: 2px solid #4285f4; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .cta-button { display: inline-block; background: #4285f4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; text-align: center; }
        .consultant-info { background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .next-steps { background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 AI 무료진단 완료!</h1>
            <p>{{company_name}}의 맞춤형 분석 결과</p>
        </div>
        
        <div class="content">
            <p>안녕하세요, <strong>{{to_name}}</strong>님!</p>
            
            <p>M-CENTER 경영지도센터입니다. <strong>{{company_name}}</strong>의 AI 무료진단이 완료되었습니다!</p>
            
            <div class="result-box">
                <h3>📊 진단 결과 요약</h3>
                <div class="service-box">
                    <h4>🎯 우선 추천 서비스</h4>
                    <p><strong>{{primary_service}}</strong></p>
                </div>
                <div class="service-box">
                    <h4>➕ 추가 추천 서비스</h4>
                    <p>{{additional_services}}</p>
                </div>
            </div>
            
            <div class="result-box">
                <h3>📈 기대 효과</h3>
                <p>{{expected_results}}</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{result_url}}" class="cta-button">📄 상세 진단 결과 보기</a>
            </div>
            
            <div class="consultant-info">
                <h3>👨‍💼 전문가 상담 예약</h3>
                <ul>
                    <li><strong>담당 컨설턴트:</strong> {{consultant_name}}</li>
                    <li><strong>직통 전화:</strong> {{consultant_phone}}</li>
                    <li><strong>이메일:</strong> {{consultant_email}}</li>
                </ul>
                <p><em>지금 바로 연락주시면 30분 무료 상담을 받으실 수 있습니다!</em></p>
            </div>
            
            <div class="next-steps">
                <h3>💡 다음 단계</h3>
                <ol>
                    <li>상세 진단 결과 검토</li>
                    <li>전문가와 무료 상담 (30분)</li>
                    <li>맞춤형 실행 계획 수립</li>
                    <li>서비스 시작 및 성과 모니터링</li>
                </ol>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>M-CENTER 경영지도센터</strong></p>
            <p>귀하의 성공적인 사업 발전을 함께 하겠습니다</p>
        </div>
    </div>
</body>
</html>
```

### ❌ 사용하지 않는 템플릿: template_admin_notification (관리자 알림)

**템플릿 ID**: `template_admin_notification`  
**📋 운영 방식**: 관리자 알림은 **구글 Apps Script**에서 자동 처리

~~**제목**: `[M-CENTER] 새로운 AI 진단 신청 - {{company_name}}`~~

**내용**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .urgent { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .client-info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .action-button { display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 신규 진단 신청 알림</h1>
            <p>즉시 후속 상담 진행 필요</p>
        </div>
        
        <div class="content">
            <div class="urgent">
                <h3>⏰ 긴급 알림</h3>
                <p>새로운 AI 무료진단 신청이 접수되었습니다. 빠른 후속 상담을 진행해 주세요.</p>
            </div>
            
            <div class="client-info">
                <h3>📋 신청자 정보</h3>
                <ul>
                    <li><strong>회사명:</strong> {{company_name}}</li>
                    <li><strong>업종:</strong> {{industry}}</li>
                    <li><strong>담당자:</strong> {{contact_name}}</li>
                    <li><strong>이메일:</strong> {{contact_email}}</li>
                    <li><strong>연락처:</strong> {{contact_phone}}</li>
                    <li><strong>신청일시:</strong> {{submit_date}}</li>
                </ul>
                
                <h4>💬 주요 고민사항</h4>
                <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545;">
                    {{main_concerns}}
                </p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{google_sheet_url}}" class="action-button">📊 구글시트에서 전체 정보 확인</a>
            </div>
            
            <div class="urgent">
                <h3>📞 추천 후속 조치</h3>
                <ol>
                    <li>30분 내 첫 연락 시도</li>
                    <li>상담 일정 조율</li>
                    <li>맞춤형 제안서 준비</li>
                    <li>구글시트에 상담 진행 상황 기록</li>
                </ol>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>M-CENTER AI 진단 시스템</strong></p>
            <p>자동 알림 서비스</p>
        </div>
    </div>
</body>
</html>
```

## ⚙️ 설정 체크리스트

### EmailJS 대시보드에서 확인할 항목:
- [ ] 서비스 ID: `service_qd9eycz` 활성화
- [ ] Public Key: `268NPLwN54rPvEias` 설정
- [ ] **템플릿 1개만 생성**: `template_diagnosis_confirmation` (진단 신청 확인)
- [ ] 이메일 서비스 연결 (Gmail 권장)
- [ ] 발송 테스트 완료

### 운영 방식 요약:
- ✅ **EmailJS**: `template_diagnosis_confirmation` (신청자 확인 이메일)
- ❌ **관리자 알림**: 구글 Apps Script에서 자동 처리
- ❌ **진단 결과**: 다운로드 방식으로 제공 (이메일 발송 안 함)

### 환경변수 확인:
```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qd9eycz
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=268NPLwN54rPvEias
ADMIN_EMAIL=hongik423@gmail.com
```

## 🧪 테스트 방법

### 1. 로컬 테스트
```bash
npm run dev
# http://localhost:3000/diagnosis 접속하여 테스트
```

### 2. EmailJS 직접 테스트
EmailJS 대시보드에서 각 템플릿의 "Test" 기능 사용

### 3. 전체 플로우 테스트
1. AI 무료진단 신청
2. ✅ **신청 확인 이메일 수신 확인** (EmailJS)
3. ✅ **관리자 알림 확인** (구글 Apps Script - 구글 시트 또는 이메일)
4. ✅ **진단 결과 확인** (웹페이지 다운로드)

---

**📧 이메일 발송이 안 되는 경우:**
1. EmailJS 계정 활성화 상태 확인
2. 템플릿 ID 정확성 확인
3. 환경변수 설정 확인
4. Gmail 보안 설정 확인 (앱 비밀번호 사용) 