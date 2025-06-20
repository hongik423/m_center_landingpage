/**
 * ================================================================================
 * M-CENTER 최종 통합 Apps Script (GitHub 보안 정책 준수)
 * ================================================================================
 * 
 * 📋 주요 기능:
 * ✅ 진단신청자 → "AI_진단신청" 시트 (별도 관리)
 * ✅ 상담신청자 → "상담신청" 시트 (별도 관리)
 * ✅ 관리자 알림 → hongik423@gmail.com
 * ✅ 신청자 확인 메일 자동 발송
 * ✅ GitHub 보안 정책 완전 준수
 * 
 * 🔧 설치 방법:
 * 1. 구글시트 열기 → 확장 → Apps Script
 * 2. 이 코드 복사 → 붙여넣기
 * 3. 아래 SPREADSHEET_ID를 실제 시트 ID로 변경
 * 4. 저장 → 배포 → 웹 앱으로 배포
 * 5. 액세스 권한: "모든 사용자"로 설정
 */

// ================================================================================
// 🔧 환경설정 (GitHub 게시용 - 민감정보 제거됨)
// ================================================================================

// ⚠️ 실제 사용 시 아래 ID를 본인의 구글시트 ID로 변경하세요
const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEETS_ID_HERE';

// 시트명 정의
const SHEETS = {
  DIAGNOSIS: 'AI_진단신청',    // 진단신청자 전용 시트
  CONSULTATION: '상담신청',   // 상담신청자 전용 시트
};

// ⚠️ 실제 사용 시 본인의 관리자 이메일로 변경하세요
const ADMIN_EMAIL = 'your-admin@email.com';

// 자동 응답 활성화
const AUTO_REPLY_ENABLED = true;

// ================================================================================
// 📡 메인 처리 함수
// ================================================================================

/**
 * POST 요청 처리 (웹사이트에서 데이터 수신)
 */
function doPost(e) {
  try {
    const headers = getCorsHeaders();
    
    // POST 데이터 파싱
    const postData = e.postData ? e.postData.contents : '{}';
    const requestData = JSON.parse(postData);
    
    console.log('📝 새로운 신청 수신:', {
      type: requestData.action || '자동감지',
      company: requestData.회사명 || requestData.company,
      email: requestData.이메일 || requestData.email,
      timestamp: getCurrentKoreanTime()
    });

    // 요청 유형 자동 감지 및 처리
    if (isConsultationRequest(requestData)) {
      return processConsultationForm(requestData, headers);
    } else {
      return processDiagnosisForm(requestData, headers);
    }

  } catch (error) {
    console.error('❌ 요청 처리 오류:', error);
    return createErrorResponse('처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

/**
 * GET 요청 처리 (상태 확인)
 */
function doGet(e) {
  return createSuccessResponse({
    status: 'M-CENTER 통합 데이터 처리 시스템 작동 중',
    timestamp: getCurrentKoreanTime(),
    features: ['진단신청 처리', '상담신청 처리', '자동 이메일 발송', '데이터 관리'],
    sheets: [SHEETS.DIAGNOSIS, SHEETS.CONSULTATION],
    version: '2025.01'
  });
}

// ================================================================================
// 🎯 진단신청 처리 (AI_진단신청 시트)
// ================================================================================

function processDiagnosisForm(data, headers) {
  try {
    const sheet = getOrCreateSheet(SHEETS.DIAGNOSIS, 'diagnosis');
    const timestamp = getCurrentKoreanTime();
    
    // 진단신청 데이터 행 구성 (18개 컬럼)
    const rowData = [
      timestamp,                                              // A: 제출일시
      data.회사명 || data.companyName || '',                    // B: 회사명
      data.업종 || data.industry || '',                        // C: 업종
      data.사업담당자 || data.businessManager || '',            // D: 사업담당자
      data.직원수 || data.employeeCount || '',                 // E: 직원수
      data.사업성장단계 || data.establishmentDifficulty || '', // F: 사업성장단계
      data.주요고민사항 || data.mainConcerns || '',             // G: 주요고민사항
      data.예상혜택 || data.expectedBenefits || '',            // H: 예상혜택
      data.진행사업장 || data.businessLocation || '',          // I: 진행사업장
      data.담당자명 || data.contactName || '',                 // J: 담당자명
      data.연락처 || data.contactPhone || '',                  // K: 연락처
      data.이메일 || data.contactEmail || '',                  // L: 이메일
      data.개인정보동의 === true || data.개인정보동의 === '동의' ? '동의' : '미동의', // M: 개인정보동의
      'AI_무료진단',                                           // N: 폼타입
      '접수완료',                                              // O: 진단상태
      '',                                                     // P: AI분석결과
      '',                                                     // Q: 결과URL
      ''                                                      // R: 분석완료일시
    ];

    // 데이터 저장
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    console.log('✅ 진단신청 저장 완료:', {
      sheet: SHEETS.DIAGNOSIS,
      row: newRow,
      company: data.회사명 || data.companyName,
      email: data.이메일 || data.contactEmail
    });

    // 관리자 이메일 발송
    sendAdminNotification(data, newRow, '진단신청');
    
    // 신청자 확인 이메일 발송
    if (data.이메일 || data.contactEmail) {
      sendUserConfirmation(data.이메일 || data.contactEmail, data.담당자명 || data.contactName, '진단');
    }

    return createSuccessResponse({
      message: '진단신청이 성공적으로 접수되었습니다.',
      sheet: SHEETS.DIAGNOSIS,
      row: newRow,
      timestamp: timestamp
    }, headers);

  } catch (error) {
    console.error('❌ 진단신청 처리 오류:', error);
    return createErrorResponse('진단신청 처리 중 오류가 발생했습니다.', headers);
  }
}

// ================================================================================
// 💬 상담신청 처리 (상담신청 시트)
// ================================================================================

function processConsultationForm(data, headers) {
  try {
    const sheet = getOrCreateSheet(SHEETS.CONSULTATION, 'consultation');
    const timestamp = getCurrentKoreanTime();
    
    // 상담신청 데이터 행 구성 (15개 컬럼)
    const rowData = [
      timestamp,                                              // A: 제출일시
      data.상담유형 || data.consultationType || '일반상담',     // B: 상담유형
      data.성명 || data.name || '',                            // C: 성명
      data.연락처 || data.phone || '',                         // D: 연락처
      data.이메일 || data.email || '',                         // E: 이메일
      data.회사명 || data.company || '',                       // F: 회사명
      data.직책 || data.position || '',                       // G: 직책
      data.상담분야 || data.consultationArea || '',           // H: 상담분야
      data.문의내용 || data.inquiryContent || '',             // I: 문의내용
      data.희망상담시간 || data.preferredTime || '',           // J: 희망상담시간
      data.개인정보동의 === true || data.개인정보동의 === '동의' ? '동의' : '미동의', // K: 개인정보동의
      data.진단연계여부 === 'Y' || data.isDiagnosisLinked ? 'Y' : 'N', // L: 진단연계여부
      data.진단점수 || data.diagnosisScore || '',              // M: 진단점수
      data.추천서비스 || data.recommendedService || '',        // N: 추천서비스
      '접수완료'                                               // O: 처리상태
    ];

    // 데이터 저장
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    console.log('✅ 상담신청 저장 완료:', {
      sheet: SHEETS.CONSULTATION,
      row: newRow,
      name: data.성명 || data.name,
      company: data.회사명 || data.company,
      email: data.이메일 || data.email
    });

    // 관리자 이메일 발송
    sendAdminNotification(data, newRow, '상담신청');
    
    // 신청자 확인 이메일 발송
    if (data.이메일 || data.email) {
      sendUserConfirmation(data.이메일 || data.email, data.성명 || data.name, '상담');
    }

    return createSuccessResponse({
      message: '상담신청이 성공적으로 접수되었습니다.',
      sheet: SHEETS.CONSULTATION,
      row: newRow,
      timestamp: timestamp
    }, headers);

  } catch (error) {
    console.error('❌ 상담신청 처리 오류:', error);
    return createErrorResponse('상담신청 처리 중 오류가 발생했습니다.', headers);
  }
}

// ================================================================================
// 📧 이메일 발송 함수
// ================================================================================

/**
 * 관리자 알림 이메일 발송
 */
function sendAdminNotification(data, rowNumber, type) {
  try {
    const isConsultation = type === '상담신청';
    const subject = `[M-CENTER] 새로운 ${type} 접수 - ${isConsultation ? (data.회사명 || data.company) : (data.회사명 || data.companyName)}`;
    
    const emailBody = `
📋 새로운 ${type}이 접수되었습니다.

👤 신청자 정보:
• 성명: ${isConsultation ? (data.성명 || data.name) : (data.담당자명 || data.contactName)}
• 회사명: ${isConsultation ? (data.회사명 || data.company) : (data.회사명 || data.companyName)}
• 연락처: ${isConsultation ? (data.연락처 || data.phone) : (data.연락처 || data.contactPhone)}
• 이메일: ${isConsultation ? (data.이메일 || data.email) : (data.이메일 || data.contactEmail)}

${isConsultation ? `
💬 상담 정보:
• 상담유형: ${data.상담유형 || data.consultationType}
• 상담분야: ${data.상담분야 || data.consultationArea}
• 문의내용: ${data.문의내용 || data.inquiryContent}
• 희망시간: ${data.희망상담시간 || data.preferredTime}
` : `
🔍 진단 정보:
• 업종: ${data.업종 || data.industry}
• 직원수: ${data.직원수 || data.employeeCount}
• 성장단계: ${data.사업성장단계 || data.establishmentDifficulty}
• 주요고민: ${data.주요고민사항 || data.mainConcerns}
`}

⏰ 접수시간: ${getCurrentKoreanTime()}
📊 시트 위치: ${isConsultation ? SHEETS.CONSULTATION : SHEETS.DIAGNOSIS} 시트 ${rowNumber}행

📋 구글시트 바로가기:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit

빠른 연락 부탁드립니다.
M-CENTER 자동알림시스템
    `;

    GmailApp.sendEmail(ADMIN_EMAIL, subject, emailBody);
    console.log('📧 관리자 알림 이메일 발송 완료');
    
  } catch (error) {
    console.error('❌ 관리자 이메일 발송 실패:', error);
  }
}

/**
 * 신청자 확인 이메일 발송
 */
function sendUserConfirmation(email, name, type) {
  try {
    const isConsultation = type === '상담';
    const subject = `[M-CENTER] ${isConsultation ? '상담' : '진단'} 신청이 접수되었습니다`;
    
    const emailBody = `
안녕하세요 ${name || '고객'}님,

기업의별 M-CENTER에서 알려드립니다.

✅ ${isConsultation ? '전문가 상담' : 'AI 무료 진단'} 신청이 성공적으로 접수되었습니다.

📞 담당 전문가가 1-2일 내에 연락드리겠습니다.

▣ 담당 컨설턴트 정보
• 성명: 이후경 경영지도사
• 경력: 25년 경영컨설팅 전문가
• 전화: 010-9251-9743
• 이메일: hongik423@gmail.com

▣ M-CENTER 6대 핵심 서비스
• BM ZEN 사업분석 (매출 20-40% 증대)
• AI 생산성향상 (업무효율 40-60% 향상)
• 경매활용 공장구매 (부동산비용 30-50% 절감)
• 기술사업화/창업 (평균 5억원 정부지원)
• 인증지원 (연간 5천만원 세제혜택)
• 웹사이트 구축 (온라인 문의 300% 증가)

문의사항이 있으시면 언제든 연락주세요.

감사합니다.
기업의별 M-CENTER
    `;

    GmailApp.sendEmail(email, subject, emailBody);
    console.log('📧 신청자 확인 이메일 발송 완료:', email);
    
  } catch (error) {
    console.error('❌ 신청자 이메일 발송 실패:', error);
  }
}

// ================================================================================
// 🛠️ 유틸리티 함수
// ================================================================================

/**
 * 요청 유형 감지 (상담신청 vs 진단신청)
 */
function isConsultationRequest(data) {
  return !!(
    data.상담유형 || data.consultationType ||
    data.성명 || data.name ||
    data.문의내용 || data.inquiryContent ||
    data.action === 'saveConsultation'
  );
}

/**
 * 시트 가져오기 또는 생성
 */
function getOrCreateSheet(sheetName, type) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    setupHeaders(sheet, type);
    console.log('📋 새 시트 생성:', sheetName);
  }
  
  return sheet;
}

/**
 * 시트 헤더 설정
 */
function setupHeaders(sheet, type) {
  let headers;
  
  if (type === 'consultation') {
    // 상담신청 시트 헤더 (15개)
    headers = [
      '제출일시', '상담유형', '성명', '연락처', '이메일', '회사명', '직책',
      '상담분야', '문의내용', '희망상담시간', '개인정보동의',
      '진단연계여부', '진단점수', '추천서비스', '처리상태'
    ];
  } else {
    // 진단신청 시트 헤더 (18개)
    headers = [
      '제출일시', '회사명', '업종', '사업담당자', '직원수', '사업성장단계',
      '주요고민사항', '예상혜택', '진행사업장', '담당자명', '연락처', '이메일',
      '개인정보동의', '폼타입', '진단상태', 'AI분석결과', '결과URL', '분석완료일시'
    ];
  }
  
  // 헤더 행 설정
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // 헤더 스타일링
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // 고정 행 설정
  sheet.setFrozenRows(1);
}

/**
 * 한국 시간 가져오기
 */
function getCurrentKoreanTime() {
  return Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
}

/**
 * CORS 헤더 설정
 */
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

/**
 * 성공 응답 생성
 */
function createSuccessResponse(data, headers = getCorsHeaders()) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, ...data }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

/**
 * 오류 응답 생성
 */
function createErrorResponse(message, headers = getCorsHeaders()) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, error: message }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

// ================================================================================
// 🧪 테스트 및 관리 함수
// ================================================================================

/**
 * 테스트 데이터 생성
 */
function createTestData() {
  console.log('🧪 테스트 데이터 생성 시작');
  
  // 진단신청 테스트
  const diagnosisTest = {
    회사명: '테스트 회사',
    업종: 'manufacturing',
    담당자명: '홍길동',
    이메일: 'test@test.com',
    연락처: '010-1234-5678',
    직원수: '10-49명',
    사업성장단계: '성장기',
    주요고민사항: '매출 증대',
    예상혜택: '수익성 향상',
    진행사업장: '서울',
    개인정보동의: true
  };
  
  // 상담신청 테스트
  const consultationTest = {
    상담유형: '일반상담',
    성명: '김철수',
    이메일: 'kim@test.com',
    연락처: '010-9876-5432',
    회사명: '테스트 기업',
    직책: '대표',
    상담분야: '사업분석',
    문의내용: '매출 증대 방안 문의',
    희망상담시간: '오전',
    개인정보동의: true
  };
  
  processDiagnosisForm(diagnosisTest);
  processConsultationForm(consultationTest);
  
  console.log('✅ 테스트 데이터 생성 완료');
}

/**
 * 초기화 함수 (필요시 실행)
 */
function initializeSheets() {
  console.log('🔧 시트 초기화 시작');
  
  getOrCreateSheet(SHEETS.DIAGNOSIS, 'diagnosis');
  getOrCreateSheet(SHEETS.CONSULTATION, 'consultation');
  
  console.log('✅ 시트 초기화 완료');
}

// ================================================================================
// 📝 사용법 가이드
// ================================================================================

/**
 * 📖 사용법 가이드
 * 
 * 1. SPREADSHEET_ID를 실제 구글시트 ID로 변경
 * 2. ADMIN_EMAIL을 실제 관리자 이메일로 변경
 * 3. 저장 후 배포 → 웹 앱 → 액세스 권한: "모든 사용자"
 * 4. 배포 URL을 웹사이트 환경변수에 설정
 * 
 * 🔧 환경변수 설정:
 * NEXT_PUBLIC_GOOGLE_SCRIPT_URL=배포된_웹앱_URL
 * NEXT_PUBLIC_GOOGLE_SHEETS_ID=구글시트_ID
 */ 