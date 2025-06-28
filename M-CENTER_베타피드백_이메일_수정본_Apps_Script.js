/**
 * ================================================================================
 * M-CENTER 베타 피드백 이메일 발송 수정본 (이메일 발송 문제 해결)
 * ================================================================================
 * 
 * 🐛 수정 사항:
 * ✅ AUTO_REPLY_ENABLED 강제로 true 설정
 * ✅ 이메일 발송 조건 체크 강화
 * ✅ 이메일 발송 실패 시 자세한 로그 기록
 * ✅ Gmail API 권한 체크 추가
 * ✅ 이메일 주소 검증 강화
 * 
 * 🔧 설치 방법:
 * 1. 구글시트(1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug) 열기
 * 2. 확장 → Apps Script → 이 코드로 교체
 * 3. 저장 → 배포 → 웹 앱으로 배포 (새 배포 생성)
 * 4. 액세스 권한: "모든 사용자"로 설정
 */

// ================================================================================
// 🔧 강화된 환경설정
// ================================================================================

const SPREADSHEET_ID = '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug';

const SHEETS = {
  DIAGNOSIS: 'AI_진단신청',
  CONSULTATION: '상담신청', 
  BETA_FEEDBACK: '베타피드백'
};

const ADMIN_EMAIL = 'hongik423@gmail.com';

// 🚨 이메일 발송 강제 활성화
const AUTO_REPLY_ENABLED = true;  // 반드시 true로 설정
const FORCE_EMAIL_SEND = true;    // 강제 이메일 발송 모드

const EMAIL_CONFIG = {
  FROM_NAME: 'M-CENTER 베타테스트팀',
  REPLY_TO: 'hongik423@gmail.com',
  ADMIN_EMAIL: 'hongik423@gmail.com'
};

// ================================================================================
// 📡 메인 처리 함수
// ================================================================================

function doPost(e) {
  try {
    const postData = e.postData ? e.postData.contents : '{}';
    const requestData = JSON.parse(postData);
    
    console.log('📝 베타 피드백 수신 데이터:', {
      action: requestData.action,
      계산기명: requestData.계산기명,
      피드백유형: requestData.피드백유형,
      사용자이메일: requestData.사용자이메일?.substring(0, 5) + '***',
      이메일발송설정: AUTO_REPLY_ENABLED,
      강제발송모드: FORCE_EMAIL_SEND
    });

    // 베타 피드백 감지 및 처리
    const isBetaFeedback = requestData.action === 'saveBetaFeedback' || 
                          requestData.폼타입 === '베타테스트_피드백' || 
                          (requestData.피드백유형 && requestData.사용자이메일 && requestData.계산기명);
    
    if (isBetaFeedback) {
      console.log('🎯 베타 피드백 처리 시작');
      return processBetaFeedbackWithEnhancedEmail(requestData);
    }

    // 기타 요청 처리
    if (isConsultationRequest(requestData)) {
      return processConsultationForm(requestData);
    } else {
      return processDiagnosisForm(requestData);
    }

  } catch (error) {
    console.error('❌ 요청 처리 오류:', error);
    return createErrorResponse('처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

function doGet(e) {
  return createSuccessResponse({
    status: 'M-CENTER 베타 피드백 이메일 수정본 작동 중',
    timestamp: getCurrentKoreanTime(),
    version: '2025.01.이메일수정본',
    emailSettings: {
      autoReplyEnabled: AUTO_REPLY_ENABLED,
      forceEmailSend: FORCE_EMAIL_SEND,
      adminEmail: ADMIN_EMAIL
    },
    features: [
      '✅ 베타 피드백 처리',
      '✅ 강화된 이메일 발송 시스템',
      '✅ 이메일 발송 실패 시 상세 로그',
      '✅ Gmail API 권한 체크'
    ]
  });
}

// ================================================================================
// 🧪 강화된 베타 피드백 처리 + 이메일 발송
// ================================================================================

function processBetaFeedbackWithEnhancedEmail(data) {
  try {
    console.log('🧪 강화된 베타 피드백 처리 시작');
    
    // 1️⃣ 구글시트 저장
    const sheet = getOrCreateSheet(SHEETS.BETA_FEEDBACK, 'betaFeedback');
    const timestamp = getCurrentKoreanTime();
    
    const rowData = [
      timestamp,                          // A: 제출일시
      data.계산기명 || '',                 // B: 계산기명
      data.피드백유형 || '',               // C: 피드백유형
      data.사용자이메일 || '',             // D: 사용자이메일
      data.문제설명 || '',                // E: 문제설명
      data.기대동작 || '',                // F: 기대동작
      data.실제동작 || '',                // G: 실제동작
      data.재현단계 || '',                // H: 재현단계
      data.심각도 || '',                  // I: 심각도
      data.추가의견 || '',                // J: 추가의견
      data.브라우저정보 || '',            // K: 브라우저정보
      data.제출경로 || '',                // L: 제출경로
      '접수완료',                        // M: 처리상태
      ''                                 // N: 처리일시
    ];

    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    console.log('✅ 구글시트 저장 완료:', {
      sheet: SHEETS.BETA_FEEDBACK,
      row: newRow,
      calculator: data.계산기명,
      email: data.사용자이메일?.substring(0, 5) + '***'
    });

    // 2️⃣ 강화된 이메일 발송
    const emailResults = sendEnhancedBetaFeedbackEmails(data, newRow);
    
    return createSuccessResponse({
      message: '베타 피드백이 성공적으로 접수되었습니다.',
      sheet: SHEETS.BETA_FEEDBACK,
      row: newRow,
      timestamp: timestamp,
      emailResults: emailResults,
      emailSettings: {
        autoReplyEnabled: AUTO_REPLY_ENABLED,
        forceEmailSend: FORCE_EMAIL_SEND
      }
    });

  } catch (error) {
    console.error('❌ 베타 피드백 처리 오류:', error);
    return createErrorResponse('베타 피드백 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// ================================================================================
// 📧 강화된 이메일 발송 시스템
// ================================================================================

function sendEnhancedBetaFeedbackEmails(data, rowNumber) {
  const results = {
    adminEmail: { sent: false, error: null },
    userEmail: { sent: false, error: null },
    settings: {
      autoReplyEnabled: AUTO_REPLY_ENABLED,
      forceEmailSend: FORCE_EMAIL_SEND,
      adminEmail: ADMIN_EMAIL
    }
  };

  console.log('📧 강화된 이메일 발송 시작:', {
    사용자이메일: data.사용자이메일?.substring(0, 5) + '***',
    관리자이메일: ADMIN_EMAIL,
    자동응답설정: AUTO_REPLY_ENABLED,
    강제발송모드: FORCE_EMAIL_SEND
  });

  // 🚨 이메일 발송 조건 체크 (강제 모드일 때는 무조건 발송)
  if (!AUTO_REPLY_ENABLED && !FORCE_EMAIL_SEND) {
    console.log('⚠️ 이메일 발송이 비활성화되어 있습니다.');
    results.adminEmail.error = '이메일 발송 비활성화';
    results.userEmail.error = '이메일 발송 비활성화';
    return results;
  }

  // 1️⃣ 관리자 알림 이메일 발송
  try {
    console.log('📧 관리자 알림 이메일 발송 시도...');
    sendEnhancedAdminNotification(data, rowNumber);
    results.adminEmail.sent = true;
    console.log('✅ 관리자 알림 이메일 발송 성공');
  } catch (error) {
    console.error('❌ 관리자 이메일 발송 실패:', error);
    results.adminEmail.error = error.toString();
  }

  // 2️⃣ 사용자 확인 이메일 발송
  if (data.사용자이메일) {
    try {
      console.log('📧 사용자 확인 이메일 발송 시도:', data.사용자이메일?.substring(0, 5) + '***');
      
      // 이메일 주소 검증
      if (!isValidEmail(data.사용자이메일)) {
        throw new Error('유효하지 않은 이메일 주소: ' + data.사용자이메일);
      }
      
      sendEnhancedUserConfirmation(data.사용자이메일, data);
      results.userEmail.sent = true;
      console.log('✅ 사용자 확인 이메일 발송 성공:', data.사용자이메일?.substring(0, 5) + '***');
    } catch (error) {
      console.error('❌ 사용자 이메일 발송 실패:', error);
      results.userEmail.error = error.toString();
    }
  } else {
    console.log('⚠️ 사용자 이메일 주소가 없습니다.');
    results.userEmail.error = '사용자 이메일 주소 없음';
  }

  console.log('📧 이메일 발송 결과:', results);
  return results;
}

/**
 * 강화된 관리자 알림 이메일
 */
function sendEnhancedAdminNotification(data, rowNumber) {
  const subject = `[M-CENTER 🚨] 베타 피드백 접수 - ${data.계산기명 || '세금계산기'} (${data.피드백유형 || '의견'})`;
  
  const emailBody = `
🧪 새로운 베타 피드백이 접수되었습니다!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 피드백 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 계산기: ${data.계산기명 || 'N/A'}
🐛 유형: ${data.피드백유형 || 'N/A'}
📧 이메일: ${data.사용자이메일 || 'N/A'}
⚡ 심각도: ${data.심각도 || 'N/A'}
⏰ 시간: ${getCurrentKoreanTime()}

🐛 문제 설명:
${data.문제설명 || '없음'}

📋 시트: ${SHEETS.BETA_FEEDBACK} 시트 ${rowNumber}행
🔗 바로가기: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit

⚡ 즉시 처리 요청!
- 회신 이메일: ${data.사용자이메일}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 M-CENTER 베타테스트 자동알림
📧 hongik423@gmail.com | ⏰ ${getCurrentKoreanTime()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;

  // 🚨 Gmail API로 이메일 발송 (권한 체크 포함)
  try {
    GmailApp.sendEmail(ADMIN_EMAIL, subject, emailBody);
    console.log('📧 관리자 이메일 Gmail API 발송 성공');
  } catch (error) {
    console.error('❌ Gmail API 발송 실패, 대안 방법 시도:', error);
    
    // 대안: MailApp 사용
    try {
      MailApp.sendEmail(ADMIN_EMAIL, subject, emailBody);
      console.log('📧 관리자 이메일 MailApp 발송 성공');
    } catch (mailError) {
      console.error('❌ MailApp 발송도 실패:', mailError);
      throw new Error('모든 이메일 발송 방법 실패: ' + mailError.toString());
    }
  }
}

/**
 * 강화된 사용자 확인 이메일
 */
function sendEnhancedUserConfirmation(email, data) {
  const subject = `[M-CENTER] 🧪 베타 피드백 접수완료! ${data.계산기명 || '세금계산기'} 개선에 감사드립니다`;
  
  const emailBody = `
안녕하세요! 👋

M-CENTER 세금계산기 베타테스트에 참여해 주셔서 진심으로 감사합니다.

🎯 접수된 피드백 정보:
────────────────────────────────────────
• 📊 계산기: ${data.계산기명 || '세금계산기'}
• 🐛 유형: ${data.피드백유형 || '의견 제출'}
• ⏰ 접수시간: ${getCurrentKoreanTime()}
• 📧 회신주소: ${email}
────────────────────────────────────────

📝 접수된 내용:
"${data.문제설명 || '피드백을 주셔서 감사합니다'}"

🔄 처리 절차:
────────────────────────────────────────
1️⃣ 개발팀 즉시 검토 시작
2️⃣ 문제 재현 및 분석 진행  
3️⃣ 수정 작업 진행 (필요시)
4️⃣ 처리 결과 이메일 회신

⚡ 처리 시간:
• 🐛 일반 버그: 1-2일 내 회신
• 🚨 긴급 버그: 당일 처리
• 💡 개선 제안: 2-3일 내 검토

📞 담당자 직통 연락처:
────────────────────────────────────────
👨‍💼 이후경 경영지도사
• 📧 hongik423@gmail.com
• 📱 010-9251-9743
• 🏢 M-CENTER (기업의별)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 M-CENTER (기업의별)
🌐 https://m-center.co.kr
📧 hongik423@gmail.com

베타테스트 참여에 다시 한번 감사드립니다! 🙏
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;

  // 🚨 Gmail API로 이메일 발송 (권한 체크 포함)
  try {
    GmailApp.sendEmail(email, subject, emailBody);
    console.log('📧 사용자 이메일 Gmail API 발송 성공:', email?.substring(0, 5) + '***');
  } catch (error) {
    console.error('❌ Gmail API 발송 실패, 대안 방법 시도:', error);
    
    // 대안: MailApp 사용
    try {
      MailApp.sendEmail(email, subject, emailBody);
      console.log('📧 사용자 이메일 MailApp 발송 성공:', email?.substring(0, 5) + '***');
    } catch (mailError) {
      console.error('❌ MailApp 발송도 실패:', mailError);
      throw new Error('모든 이메일 발송 방법 실패: ' + mailError.toString());
    }
  }
}

// ================================================================================
// 🛠️ 유틸리티 함수들
// ================================================================================

/**
 * 이메일 주소 검증
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 상담신청 여부 확인
 */
function isConsultationRequest(data) {
  if (data.action === 'saveBetaFeedback' || data.폼타입 === '베타테스트_피드백' || data.피드백유형) {
    return false;
  }
  
  return !!(data.상담유형 || data.consultationType || data.성명 || data.name || data.문의내용);
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
  
  if (type === 'betaFeedback') {
    headers = [
      '제출일시', '계산기명', '피드백유형', '사용자이메일', '문제설명',
      '기대동작', '실제동작', '재현단계', '심각도', '추가의견',
      '브라우저정보', '제출경로', '처리상태', '처리일시'
    ];
  }
  
  if (headers) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
  }
}

/**
 * 한국 시간 가져오기
 */
function getCurrentKoreanTime() {
  return Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy. MM. dd. a hh:mm:ss');
}

/**
 * 응답 생성 함수들
 */
function createSuccessResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, ...data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, error: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================================================================================
// 🧪 테스트 함수
// ================================================================================

/**
 * 이메일 발송 테스트
 */
function testEmailSending() {
  console.log('🧪 이메일 발송 테스트 시작');
  
  const testData = {
    계산기명: '테스트 계산기',
    피드백유형: '🐛 버그 신고', 
    사용자이메일: 'test@example.com',
    문제설명: '이메일 발송 테스트입니다',
    심각도: '보통',
    브라우저정보: 'Test Browser'
  };
  
  try {
    const emailResults = sendEnhancedBetaFeedbackEmails(testData, 999);
    console.log('✅ 이메일 발송 테스트 완료:', emailResults);
    return emailResults;
  } catch (error) {
    console.error('❌ 이메일 발송 테스트 실패:', error);
    return { error: error.toString() };
  }
}

/**
 * Gmail API 권한 체크
 */
function checkGmailPermissions() {
  try {
    // Gmail API 접근 테스트
    const drafts = GmailApp.getDrafts();
    console.log('✅ Gmail API 권한 정상:', drafts.length);
    return { hasPermission: true, draftCount: drafts.length };
  } catch (error) {
    console.error('❌ Gmail API 권한 없음:', error);
    return { hasPermission: false, error: error.toString() };
  }
} 