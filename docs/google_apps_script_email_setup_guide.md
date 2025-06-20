# 🚀 **구글시트 이메일 자동발송 시스템 설정 가이드**

## 📋 **개요**
이 가이드는 EmailJS를 대체하여 **Google Apps Script**를 통해 신청자 자동 회신 이메일과 관리자 알림 이메일을 자동으로 발송하는 시스템을 설정하는 방법을 안내합니다.

## 🎯 **주요 장점**
- ✅ **즉시성**: 구글시트 저장과 동시에 이메일 발송
- ✅ **안정성**: 서버 사이드 제약 없음 
- ✅ **자유도**: Gmail 계정을 통한 직접 발송
- ✅ **맞춤형**: 진단/상담별 맞춤 템플릿
- ✅ **관리편의**: 하나의 시스템에서 통합 관리

## 📝 **설정 단계**

### 1단계: Google Apps Script 프로젝트 생성

1. **Google Apps Script 접속**
   - https://script.google.com 접속
   - 새 프로젝트 생성

2. **프로젝트 설정**
   - 프로젝트명: `M-CENTER 이메일 자동발송 시스템`
   - 설명: `신청자 자동 회신 + 관리자 알림 이메일 자동발송`

### 2단계: 코드 삽입

1. **코드 에디터에서 기존 코드 삭제**
2. **새로운 코드 붙여넣기**
   ```javascript
   // docs/enhanced_google_apps_script_with_email.js 파일의 전체 내용 복사
   ```

### 3단계: 권한 설정

1. **필요한 권한 승인**
   - Gmail 발송 권한
   - Google Sheets 읽기/쓰기 권한
   - 외부 URL 접근 권한

2. **권한 승인 과정**
   ```
   1. 코드 저장 후 실행 버튼 클릭
   2. 권한 요청 팝업에서 "권한 승인" 클릭
   3. Gmail 계정 선택 (hongik423@gmail.com)
   4. "고급" → "프로젝트로 이동" 클릭
   5. 모든 권한 승인
   ```

### 4단계: 웹앱 배포

1. **배포 설정**
   ```
   1. 배포 → 새 배포 클릭
   2. 유형: 웹 앱
   3. 실행 사용자: 나
   4. 액세스 권한: 모든 사용자
   5. 배포 클릭
   ```

2. **웹앱 URL 복사**
   - 배포 완료 후 나타나는 웹앱 URL 복사
   - 형태: `https://script.google.com/macros/s/AKfycbz.../exec`

### 5단계: 환경변수 설정

1. **프로젝트 .env.local 파일 업데이트**
   ```env
   # Google Apps Script 웹앱 URL
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbz.../exec
   
   # 구글시트 ID
   GOOGLE_SHEETS_ID=1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug
   
   # 기타 설정
   NEXT_PUBLIC_ADMIN_EMAIL=hongik423@gmail.com
   ```

### 6단계: 테스트 실행

1. **Apps Script 테스트**
   ```javascript
   // Apps Script 에디터에서 실행
   function testEmailSystem() {
     const testData = {
       회사명: "테스트 회사",
       담당자명: "홍길동",
       이메일: "test@example.com",
       연락처: "010-1234-5678"
     };
     
     const diagnosis = processAIDiagnosis(testData);
     console.log('진단 테스트:', diagnosis);
     
     const consultation = processConsultationForm({
       성명: "홍길동",
       회사명: "테스트 회사",
       이메일: "test@example.com",
       상담유형: "일반상담"
     });
     console.log('상담 테스트:', consultation);
   }
   ```

2. **웹사이트 테스트**
   - 웹사이트에서 실제 진단/상담 신청
   - 구글시트 저장 확인
   - 이메일 발송 확인

## 📧 **이메일 템플릿 설정**

### 진단 신청 자동 회신 템플릿
```html
- 제목: [M-CENTER] AI 진단 신청이 접수되었습니다 - {회사명}
- 내용: 접수 확인, 처리 단계 안내, 혜택 소개
- 발송자: M-CENTER 경영지도센터
- 회신처: hongik423@gmail.com
```

### 상담 신청 자동 회신 템플릿
```html
- 제목: [M-CENTER] {상담유형} 상담신청이 접수되었습니다 - {회사명}
- 내용: 접수 확인, 상담 진행 안내, 서비스 소개
- 발송자: M-CENTER 경영지도센터
- 회신처: hongik423@gmail.com
```

### 관리자 알림 템플릿
```html
- 제목: [M-CENTER 신규접수] {유형} - {회사명}
- 내용: 신청자 정보, 신청 내용, 구글시트 링크
- 수신자: hongik423@gmail.com
- 발송자: M-CENTER 자동알림시스템
```

## 🔧 **고급 설정**

### 이메일 발송 제한 설정
```javascript
// 일일 발송 제한 (Gmail 기본: 100통/일)
const DAILY_EMAIL_LIMIT = 100;

// 발송 간격 제한 (스팸 방지)
const EMAIL_INTERVAL = 1000; // 1초
```

### 오류 처리 및 재시도
```javascript
// 이메일 발송 실패 시 재시도
const MAX_RETRY = 3;
const RETRY_DELAY = 5000; // 5초
```

### 로그 기록
```javascript
// 이메일 발송 기록을 별도 시트에 저장
const EMAIL_LOG_SHEET = '이메일발송기록';
```

## 🚨 **주의사항**

### Gmail 발송 제한
- **일일 한도**: 100통/일 (일반 Gmail 계정)
- **시간당 한도**: 20통/시간
- **대량 발송**: Google Workspace 계정 권장

### 스팸 방지
- **발송자 정보**: 명확한 발송자 이름 설정
- **수신거부**: 수신거부 링크 포함 권장
- **내용 검토**: 스팸 키워드 사용 주의

### 보안 관리
- **Apps Script 액세스**: 제한된 사용자만 접근
- **환경변수**: 민감한 정보 보호
- **정기 점검**: 월 1회 시스템 점검

## 📊 **모니터링**

### 발송 상태 확인
```javascript
// Apps Script 실행 기록 확인
1. Apps Script 에디터 → 실행 → 로그 보기
2. 이메일 발송 성공/실패 확인
3. 오류 발생 시 원인 분석
```

### 통계 대시보드
```javascript
// 이메일 발송 통계 함수
function getEmailStats() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const logSheet = sheet.getSheetByName(EMAIL_LOG_SHEET);
  
  // 일일/월간 발송 통계
  // 성공률 계산
  // 오류 분석
}
```

## 🆘 **문제 해결**

### 이메일 발송 실패
```javascript
// 일반적인 원인
1. Gmail 발송 한도 초과
2. 잘못된 이메일 주소
3. 스팸 필터링
4. Apps Script 권한 문제

// 해결 방법
1. 발송 한도 확인
2. 이메일 주소 검증
3. 발송자 정보 명확화
4. 권한 재승인
```

### 구글시트 연동 오류
```javascript
// 확인 사항
1. 시트 ID 정확성
2. 시트 접근 권한
3. 컬럼 구조 일치
4. 데이터 형식 호환성
```

## 📞 **지원 및 문의**

### 기술 지원
- **이메일**: hongik423@gmail.com
- **전화**: 010-9251-9743
- **업무시간**: 평일 09:00-18:00

### 업데이트 정보
- **현재 버전**: v3.0_Email_Enhanced
- **최종 업데이트**: 2025.6.20
- **다음 업데이트**: 필요 시 통지

---

## 🎉 **완료 확인**

설정 완료 후 다음 사항을 확인하세요:
- ✅ 구글시트에 데이터 저장됨
- ✅ 신청자에게 자동 회신 이메일 발송됨
- ✅ 관리자에게 알림 이메일 발송됨
- ✅ 이메일 내용이 올바르게 표시됨
- ✅ 발송자 정보가 정확함

**🎯 모든 체크가 완료되면 시스템이 정상 작동합니다!** 