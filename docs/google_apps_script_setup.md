# Google Apps Script 배포 가이드

## 📋 개요
진단 신청 데이터를 Google Sheets에 자동으로 저장하기 위한 Google Apps Script 설정 및 배포 가이드입니다.

## 🚀 단계별 설정 방법

### 1단계: Google Sheets 준비
1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트 생성
3. 제목을 "기업의별_진단신청데이터"로 변경
4. URL에서 스프레드시트 ID 복사
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```

### 2단계: Google Apps Script 프로젝트 생성
1. [Google Apps Script](https://script.google.com) 접속
2. "새 프로젝트" 클릭
3. 프로젝트 이름을 "기업의별_진단신청_API"로 변경
4. `Code.gs` 파일에 `docs/google_apps_script.js` 내용 복사/붙여넣기

### 3단계: 스크립트 설정
1. 스크립트 상단의 `SPREADSHEET_ID` 변수를 실제 스프레드시트 ID로 변경
   ```javascript
   const SPREADSHEET_ID = '1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM'; // 실제 ID로 변경
   ```

2. 권한 설정을 위해 `testFunction` 함수 실행
   - 함수 선택: `testFunction`
   - "실행" 버튼 클릭
   - 권한 승인 팝업에서 "승인" 클릭

### 4단계: 웹 앱으로 배포
1. 스크립트 편집기에서 "배포" > "새 배포" 클릭
2. 배포 설정:
   - **유형**: 웹 앱
   - **설명**: "진단 신청 데이터 수집 API v1.0"
   - **실행 권한**: 나
   - **액세스 권한**: 모든 사용자
3. "배포" 버튼 클릭
4. **웹 앱 URL 복사** (이것이 `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`에 들어갈 값)

### 5단계: 환경변수 설정
프로젝트 루트에 `.env.local` 파일 생성하고 다음 추가:
```bash
# Google Apps Script 웹 앱 URL
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzXXXXXXXXXXX/exec

# Google Sheets ID (선택사항)
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM
```

## 🧪 테스트 방법

### 1. Google Apps Script에서 직접 테스트
```javascript
// 스크립트 편집기에서 실행
function runTest() {
  const result = testFunction();
  console.log(result);
}
```

### 2. 웹 앱 URL 테스트 (GET)
브라우저에서 웹 앱 URL 접속하여 다음 응답 확인:
```json
{
  "status": "active",
  "message": "기업의별 경영지도센터 Google Apps Script가 정상 작동 중입니다.",
  "timestamp": "2024-12-19T...",
  "version": "1.0.0"
}
```

### 3. Next.js 앱에서 테스트
```bash
npm run dev
```
- 무료 진단 페이지 접속
- 테스트 데이터로 폼 제출
- Google Sheets에서 데이터 확인

## 📊 Google Sheets 구조

자동 생성되는 헤더:
| 제출일시 | 회사명 | 업종 | 사업단계 | 직원수 | 설립년도 | 주요고민 | 예상예산 | 진행시급성 | 담당자명 | 연락처 | 이메일 |
|---------|-------|------|---------|-------|---------|---------|---------|-----------|---------|-------|-------|

## 🔧 트러블슈팅

### ❌ 권한 오류
```
액세스가 거부되었습니다. 스프레드시트에 대한 권한이 없습니다.
```
**해결방법**: 스크립트에서 `testFunction` 실행하여 권한 승인

### ❌ CORS 오류
```
Access to fetch has been blocked by CORS policy
```
**해결방법**: Google Apps Script 배포 시 "액세스 권한"을 "모든 사용자"로 설정

### ❌ 404 오류
```
Script function not found
```
**해결방법**: 
1. 웹 앱 URL 확인
2. 새 배포 생성 (버전 업데이트)

### ❌ 데이터가 저장되지 않음
**확인사항**:
1. 스프레드시트 ID 정확성
2. 필수 필드 누락 여부
3. Google Apps Script 로그 확인

## 🔄 업데이트 방법

스크립트 수정 후:
1. 스크립트 저장
2. "배포" > "배포 관리"
3. 새 버전으로 업데이트
4. 웹 앱 URL은 동일하게 유지됨

## 🔒 보안 고려사항

1. **스프레드시트 접근 권한**: 필요한 사용자에게만 공유
2. **웹 앱 URL**: 공개되어도 안전하지만 무분별한 공유 금지
3. **데이터 검증**: 스크립트에서 필수 필드 검증 수행
4. **로그 모니터링**: 정기적으로 실행 로그 확인

## 📈 모니터링

### Google Apps Script 실행 로그 확인
1. Apps Script 대시보드 접속
2. "실행" 탭에서 최근 실행 내역 확인
3. 오류 발생 시 로그 상세 확인

### Google Sheets 데이터 확인
- 실시간으로 새 데이터 추가 확인
- 중복 데이터 방지를 위한 정기 점검
- 데이터 백업 (다운로드 또는 별도 시트 복사)

## 🎯 다음 단계

1. ✅ Google Apps Script 배포 완료
2. ✅ 환경변수 설정 완료
3. ✅ 웹 앱 테스트 완료
4. 🔄 EmailJS 템플릿 설정
5. 🔄 프로덕션 배포

## 🚀 새로운 AI 무료진단기 연동 설정

### 1. 스프레드시트 생성 및 설정

1. **Google 스프레드시트 생성**
   - Google Drive에서 새 스프레드시트 생성
   - 이름: `m_center_landingpage-request`

2. **시트 구조 설정**
   - 시트명: `m_center_landingpage-request`
   - 첫 번째 행에 다음 헤더 추가:
     ```
     제출일시 | 회사명 | 업종 | 사업담당 | 직원수 | 설립난도 | 주요고민 | 예상혜택 | 진행사업장 | 담당자명 | 연락처 | 이메일 | 개인정보처리동의
     ```

### 2. Google Apps Script 설정

1. **스크립트 에디터 열기**
   - 스프레드시트에서 `확장 프로그램` > `Apps Script` 클릭

2. **코드 복사 및 붙여넣기**
   - `docs/google_apps_script.js` 파일의 내용을 복사
   - Apps Script 에디터에 붙여넣기

3. **스프레드시트 ID 설정**
   ```javascript
   // 현재 스프레드시트의 ID로 변경
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
   ```

### 3. 웹앱 배포 설정

1. **배포 설정**
   - Apps Script 에디터에서 `배포` > `새 배포` 클릭
   - 유형: `웹앱` 선택

2. **권한 설정** ⚠️ **중요**
   - **실행 권한**: 나
   - **액세스 권한**: `누구든지` 또는 `모든 사용자`
   - 이렇게 설정해야 외부에서 API 호출이 가능합니다.

3. **배포 완료**
   - `배포` 버튼 클릭
   - 생성된 웹앱 URL 복사
   - 형식: `https://script.google.com/macros/s/{배포ID}/exec`

### 4. 권한 승인

1. **첫 실행 시 권한 요청**
   - 스크립트 실행 시 Google 계정 권한 요청
   - `고급` > `{프로젝트명}(으)로 이동(안전하지 않음)` 클릭
   - `허용` 클릭

2. **필요한 권한**
   - Google Sheets 읽기/쓰기
   - 웹앱 실행

### 5. 테스트 함수 실행

Apps Script 에디터에서 테스트 함수 실행:

```javascript
function testAIDiagnosisFunction() {
  // 테스트 데이터로 실행
}
```

### 6. 환경변수 설정

프로젝트의 `.env.local` 파일에 웹앱 URL 추가:

```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbyNt7cHONKsZCFV0AA43tY_RewRpzooz8sHdUicoy0Z49nozUHe2M5zNumc8Lpv4wIK/exec
```

## 🔧 트러블슈팅

### 문제 1: 302 리다이렉트 오류
**원인**: 웹앱 액세스 권한이 제한적으로 설정됨
**해결**: 배포 설정에서 액세스 권한을 `누구든지`로 변경

### 문제 2: 403 Forbidden 오류
**원인**: 스크립트 실행 권한 부족
**해결**: Google 계정으로 스크립트에 대한 권한 승인

### 문제 3: CORS 오류
**원인**: 브라우저에서 직접 호출 시 CORS 제한
**해결**: Next.js API 라우트를 통해 서버 사이드에서 호출

### 문제 4: 스프레드시트 접근 오류
**원인**: 스프레드시트 ID가 잘못되거나 접근 권한 부족
**해결**: 올바른 스프레드시트 ID 설정 및 소유자 계정으로 스크립트 실행

## 📊 데이터 필드 매핑

| 웹앱 필드 | 스프레드시트 컬럼 | 타입 | 필수 |
|----------|----------------|------|------|
| 제출일시 | A | Date | ✅ |
| 회사명 | B | String | ✅ |
| 업종 | C | String | ✅ |
| 사업담당 | D | String | ✅ |
| 직원수 | E | String | ✅ |
| 설립난도 | F | String | ✅ |
| 주요고민 | G | Text | ✅ |
| 예상혜택 | H | Text | ✅ |
| 진행사업장 | I | String | ✅ |
| 담당자명 | J | String | ✅ |
| 연락처 | K | String | ✅ |
| 이메일 | L | Email | ✅ |
| 개인정보처리동의 | M | String | ✅ |

## 🚨 보안 주의사항

1. **스프레드시트 공유 설정**: 필요한 사람에게만 접근 권한 부여
2. **웹앱 URL 보안**: 환경변수로 관리, 코드에 하드코딩 금지
3. **개인정보 보호**: 수집된 데이터의 안전한 관리
4. **접근 로그 모니터링**: 비정상적인 접근 패턴 감지

## ✅ 설정 완료 확인

1. **테스트 스크립트 실행**: `node test-google-sheets.js`
2. **웹 인터페이스 테스트**: AI 무료진단기에서 실제 데이터 입력
3. **스프레드시트 확인**: 데이터가 올바르게 저장되는지 확인

설정이 완료되면 AI 무료진단기에서 수집된 데이터가 실시간으로 구글시트에 저장됩니다. 