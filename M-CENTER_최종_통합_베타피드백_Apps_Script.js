/**
 * ================================================================================
 * M-CENTER 최종 통합 Apps Script + 베타 피드백 시스템 (완전 통합본)
 * ================================================================================
 * 
 * 📋 통합 기능:
 * ✅ 진단신청자 → "AI_진단신청" 시트
 * ✅ 상담신청자 → "상담신청" 시트  
 * ✅ 베타피드백 → "베타피드백" 시트 (신규 추가)
 * ✅ 관리자 통합 알림 시스템 (hongik423@gmail.com 통일)
 * ✅ 신청자/피드백자 확인 메일 자동 발송
 * ✅ 충돌 없는 통합 처리
 * 
 * 🔧 설치 방법:
 * 1. 구글시트(1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM) 열기
 * 2. 확장 → Apps Script → 이 코드 복사
 * 3. 저장 → 배포 → 웹 앱으로 배포
 * 4. 액세스 권한: "모든 사용자"로 설정
 */

// ================================================================================
// 🔧 통합 환경설정
// ================================================================================

// 통합 구글시트 ID (기존 작동 확인된 ID)
const SPREADSHEET_ID = '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug';

// 시트명 정의 (기존 + 베타피드백)
const SHEETS = {
  DIAGNOSIS: 'AI_진단신청',    // 진단신청자 전용 시트
  CONSULTATION: '상담신청',   // 상담신청자 전용 시트
  BETA_FEEDBACK: '베타피드백', // 베타피드백 전용 시트 (신규)
  ALL_DATA: '전체데이터'      // 통합 데이터 시트 (선택)
};

// 관리자 이메일 통일 (베타 피드백도 동일한 관리자)
const ADMIN_EMAIL = 'hongik423@gmail.com';

// 이메일 발송 설정
const AUTO_REPLY_ENABLED = true;
const EMAIL_CONFIG = {
  FROM_NAME: 'M-CENTER 통합시스템',
  REPLY_TO: 'hongik423@gmail.com'  // 회신 주소도 통일
};

// ================================================================================
// 📡 메인 처리 함수 (통합 라우팅)
// ================================================================================

/**
 * POST 요청 처리 (기존 구조 + 베타 피드백 추가)
 */
function doPost(e) {
  try {
    // POST 데이터 파싱
    const postData = e.postData ? e.postData.contents : '{}';
    const requestData = JSON.parse(postData);
    
    console.log('📝 새로운 신청 수신 - 전체 데이터:', {
      action: requestData.action || '자동감지',
      폼타입: requestData.폼타입,
      company: requestData.회사명 || requestData.company,
      email: requestData.이메일 || requestData.email || requestData.사용자이메일,
      계산기명: requestData.계산기명,
      피드백유형: requestData.피드백유형,
      dataSource: requestData.dataSource,
      timestamp: getCurrentKoreanTime()
    });

    // 🧪 베타 피드백 처리 (최우선 조건으로 강화)
    const isBetaFeedback = requestData.action === 'saveBetaFeedback' || 
                          requestData.폼타입 === '베타테스트_피드백' || 
                          (requestData.피드백유형 && requestData.사용자이메일 && requestData.계산기명);
    
    if (isBetaFeedback) {
      console.log('🎯 베타 피드백 강제 분기 진입 - 최우선 처리');
      console.log('🔍 베타 피드백 감지 조건 상세:', {
        action: requestData.action,
        hasActionMatch: requestData.action === 'saveBetaFeedback',
        폼타입: requestData.폼타입,
        hasFormTypeMatch: requestData.폼타입 === '베타테스트_피드백',
        피드백유형: requestData.피드백유형,
        hasFeedbackType: !!requestData.피드백유형,
        사용자이메일: requestData.사용자이메일 ? requestData.사용자이메일.substring(0,5) + '***' : null,
        hasUserEmail: !!requestData.사용자이메일,
        계산기명: requestData.계산기명,
        hasCalculator: !!requestData.계산기명,
        isBetaFeedback: isBetaFeedback
      });
      return processBetaFeedback(requestData);
    }

    // 상담신청 확인
    if (isConsultationRequest(requestData)) {
      console.log('✅ 상담신청 분기 진입 - 상담신청 처리 시작');
      return processConsultationForm(requestData);
    } else {
      console.log('✅ 진단신청 분기 진입 - 진단신청 처리 시작');
      return processDiagnosisForm(requestData);
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
    status: 'M-CENTER 통합 데이터 처리 시스템 + 베타피드백 작동 중',
    timestamp: getCurrentKoreanTime(),
    version: '2025.01.통합베타_안정화',
    admin: 'hongik423@gmail.com',
    features: [
      '✅ 진단신청 처리',
      '✅ 상담신청 처리', 
      '✅ 베타피드백 처리 (신규)',
      '✅ 자동 이메일 발송',
      '✅ 데이터 관리'
    ],
    sheets: [SHEETS.DIAGNOSIS, SHEETS.CONSULTATION, SHEETS.BETA_FEEDBACK],
    spreadsheetId: SPREADSHEET_ID
  });
}

// ================================================================================
// 🧪 베타 피드백 처리 시스템 (신규 추가)
// ================================================================================

// ================================================================================
// 🧪 베타 피드백 처리 (베타피드백 시트) - 신규 추가
// ================================================================================

function processBetaFeedback(data) {
  try {
    console.log('🧪 베타 피드백 처리 함수 시작 - 데이터 확인:', {
      계산기명: data.계산기명,
      피드백유형: data.피드백유형,
      사용자이메일: data.사용자이메일?.substring(0, 5) + '***',
      폼타입: data.폼타입,
      action: data.action
    });
    
    const sheet = getOrCreateSheet(SHEETS.BETA_FEEDBACK, 'betaFeedback');
    const timestamp = getCurrentKoreanTime();
    
    console.log('📋 베타피드백 시트 확인 완료:', {
      sheetName: SHEETS.BETA_FEEDBACK,
      sheetExists: !!sheet,
      lastRow: sheet.getLastRow()
    });
    
    // 베타 피드백 데이터 행 구성 (14개 컬럼)
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

    console.log('📝 베타 피드백 데이터 행 구성 완료:', {
      rowLength: rowData.length,
      calculator: rowData[1],
      feedbackType: rowData[2],
      email: rowData[3]?.substring(0, 5) + '***'
    });

    // 데이터 저장
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    console.log('✅ 베타 피드백 저장 완료 - 베타피드백 시트:', {
      targetSheet: SHEETS.BETA_FEEDBACK,
      savedToRow: newRow,
      calculator: data.계산기명,
      email: data.사용자이메일?.substring(0, 5) + '***',
      spreadsheetId: SPREADSHEET_ID
    });

    // 관리자 이메일 발송
    if (AUTO_REPLY_ENABLED) {
      sendBetaFeedbackAdminNotification(data, newRow);
      
      // 사용자 확인 이메일 발송
      if (data.사용자이메일) {
        sendBetaFeedbackUserConfirmation(data.사용자이메일, data);
      }
    }

    return createSuccessResponse({
      message: '베타 피드백이 성공적으로 접수되었습니다. 검토 후 이메일로 회신드리겠습니다.',
      sheet: SHEETS.BETA_FEEDBACK,
      row: newRow,
      timestamp: timestamp,
      platform: 'Google Apps Script 베타피드백 처리 완료',
      type: '베타피드백',
      calculator: data.계산기명,
      feedbackType: data.피드백유형
    });

  } catch (error) {
    console.error('❌ 베타 피드백 처리 오류:', error);
    return createErrorResponse('베타 피드백 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

/**
 * 베타 피드백 관리자 알림 이메일 발송 (개선된 버전)
 */
function sendBetaFeedbackAdminNotification(data, rowNumber) {
  try {
    const subject = `[M-CENTER] 🚨 긴급! 베타 피드백 접수 - ${data.계산기명 || '세금계산기'} (${data.피드백유형 || '의견'})`;
    
    const emailBody = `
🧪 새로운 베타 피드백이 접수되었습니다! 빠른 처리가 필요합니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 피드백 기본 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 대상 계산기: ${data.계산기명 || 'N/A'}
🐛 피드백 유형: ${data.피드백유형 || 'N/A'}
📧 사용자 이메일: ${data.사용자이메일 || 'N/A'}
⚡ 심각도: ${data.심각도 || 'N/A'}
⏰ 접수 시간: ${getCurrentKoreanTime()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐛 상세 문제 설명
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.문제설명 || '상세 설명 없음'}

${data.기대동작 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 사용자가 기대한 동작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.기대동작}
` : ''}

${data.실제동작 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 실제 발생한 동작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.실제동작}
` : ''}

${data.재현단계 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 문제 재현 단계
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.재현단계}
` : ''}

${data.추가의견 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 추가 의견
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.추가의견}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💻 기술 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 브라우저: ${data.브라우저정보 || 'N/A'}
📍 제출 경로: ${data.제출경로 || 'N/A'}
📄 데이터 소스: ${data.dataSource || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 관리 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 시트 위치: ${SHEETS.BETA_FEEDBACK} 시트 ${rowNumber}행
🔗 구글시트 바로가기:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ 처리 요청 사항
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ 문제 재현 및 원인 분석
2️⃣ 수정 작업 진행 (필요시)
3️⃣ 사용자에게 처리 결과 회신:
   📧 회신 이메일: ${data.사용자이메일}
   
📧 회신 메일 발송 시 포함 내용:
• 문제 확인 여부
• 수정 작업 내용 (있는 경우)
• 업데이트 일정 안내
• 추가 테스트 요청 (필요시)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 M-CENTER 베타테스트 자동알림시스템
📧 시스템 관리: hongik423@gmail.com
🕐 알림 시간: ${getCurrentKoreanTime()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    GmailApp.sendEmail(ADMIN_EMAIL, subject, emailBody);
    console.log('📧 베타 피드백 관리자 알림 이메일 발송 완료 (개선된 버전)');
    
  } catch (error) {
    console.error('❌ 베타 피드백 관리자 이메일 발송 실패:', error);
  }
}

/**
 * 베타 피드백 사용자 확인 이메일 발송 (개선된 버전)
 */
function sendBetaFeedbackUserConfirmation(email, data) {
  try {
    const subject = `[M-CENTER] 🧪 베타 피드백 접수 완료! ${data.계산기명 || '세금계산기'} 개선에 도움 주셔서 감사합니다`;
    
    const emailBody = `
안녕하세요! 👋

M-CENTER 세금계산기 베타테스트에 참여해 주셔서 진심으로 감사합니다.
여러분의 소중한 의견이 더 나은 서비스를 만드는 원동력이 됩니다.

🎯 접수된 오류 의견 정보:
────────────────────────────────────────
• 📊 대상 계산기: ${data.계산기명 || '세금계산기'}
• 🐛 피드백 유형: ${data.피드백유형 || '의견 제출'}
• ⏰ 접수 일시: ${getCurrentKoreanTime()}
• 📧 회신 이메일: ${email}
────────────────────────────────────────

${data.문제설명 ? `
📝 접수된 문제 내용:
"${data.문제설명}"
` : ''}

🔄 처리 절차 안내:
────────────────────────────────────────
1️⃣ 개발팀에서 접수된 피드백을 상세히 검토합니다
2️⃣ 문제 재현 및 원인 분석을 진행합니다
3️⃣ 수정이 필요한 경우 즉시 업데이트를 진행합니다
4️⃣ 처리 결과를 이 이메일로 상세히 회신드립니다

⚡ 예상 처리 시간:
• 🐛 일반 버그: 1-2 영업일 내 회신
• 🚨 긴급 버그: 당일 처리 (영업시간 내)
• 💡 개선 제안: 2-3 영업일 내 검토 완료

🎁 베타테스트 참여 혜택:
────────────────────────────────────────
✅ 개선된 계산기 우선 체험
✅ 세무 관련 무료 상담 기회 제공
✅ M-CENTER 서비스 할인 혜택 (추후 안내)

📞 담당 개발 및 세무 전문가:
────────────────────────────────────────
👨‍💼 이후경 경영지도사
• 경력: 25년 경영컨설팅 및 세무 전문가
• 직통: 010-9251-9743
• 이메일: hongik423@gmail.com
• 전문분야: 세무계산, 경영진단, 사업분석

💬 추가 문의나 긴급한 사항:
위 연락처로 언제든 연락주세요. 빠른 시일 내에 답변드리겠습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 M-CENTER (기업의별)
🌐 https://m-center.co.kr
📧 hongik423@gmail.com
📞 010-9251-9743

"중소기업의 성장 파트너, M-CENTER와 함께 성공하세요!"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

다시 한번 베타테스트 참여와 소중한 피드백에 감사드립니다. 🙏
더 정확하고 편리한 세금계산기를 만들기 위해 최선을 다하겠습니다.

감사합니다.
M-CENTER 베타테스트 개발팀
    `;

    GmailApp.sendEmail(email, subject, emailBody);
    console.log('📧 베타 피드백 사용자 확인 이메일 발송 완료 (개선된 버전):', email);
    
  } catch (error) {
    console.error('❌ 베타 피드백 사용자 이메일 발송 실패:', error);
  }
}

// ================================================================================
// 🎯 진단신청 처리 (기존 유지)
// ================================================================================

function processDiagnosisForm(data) {
  try {
    // 🧪 베타 피드백 안전장치: 베타 피드백이 진단으로 오분류되는 것 방지
    if (data.action === 'saveBetaFeedback' || data.폼타입 === '베타테스트_피드백' || data.피드백유형) {
      console.log('🚨 베타 피드백이 진단신청으로 오분류 시도됨 - 베타 피드백으로 리다이렉트');
      return processBetaFeedback(data);
    }
    
    const sheet = getOrCreateSheet(SHEETS.DIAGNOSIS, 'diagnosis');
    const timestamp = getCurrentKoreanTime();
    
    console.log('✅ 진단신청 처리 시작 - 정상 분기:', {
      company: data.회사명 || data.companyName,
      email: data.이메일 || data.contactEmail || data.email,
      action: data.action,
      폼타입: data.폼타입
    });
    
    // 진단신청 데이터 행 구성 (18개 컬럼)
    const rowData = [
      timestamp,                                              // A: 제출일시
      data.회사명 || data.companyName || '',                    // B: 회사명
      data.업종 || data.industry || '',                        // C: 업종
      data.사업담당자 || data.businessManager || data.contactManager || '',  // D: 사업담당자
      data.직원수 || data.employeeCount || '',                 // E: 직원수
      data.사업성장단계 || data.establishmentDifficulty || '', // F: 사업성장단계
      data.주요고민사항 || data.mainConcerns || '',             // G: 주요고민사항
      data.예상혜택 || data.expectedBenefits || '',            // H: 예상혜택
      data.진행사업장 || data.businessLocation || '',          // I: 진행사업장
      data.담당자명 || data.contactName || '',                 // J: 담당자명
      data.연락처 || data.contactPhone || '',                  // K: 연락처
      data.이메일 || data.contactEmail || data.email || '',    // L: 이메일
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
      email: data.이메일 || data.contactEmail || data.email
    });

    // 관리자 이메일 발송
    if (AUTO_REPLY_ENABLED) {
      sendAdminNotification(data, newRow, '진단신청');
      
      // 신청자 확인 이메일 발송
      const userEmail = data.이메일 || data.contactEmail || data.email;
      const userName = data.담당자명 || data.contactName || data.contactManager;
      if (userEmail) {
        sendUserConfirmation(userEmail, userName, '진단');
      }
    }

    return createSuccessResponse({
      message: '진단신청이 성공적으로 접수되었습니다.',
      sheet: SHEETS.DIAGNOSIS,
      row: newRow,
      timestamp: timestamp,
      admin: ADMIN_EMAIL,
      platform: 'Vercel 호환 모드'
    });

  } catch (error) {
    console.error('❌ 진단신청 처리 오류:', error);
    return createErrorResponse('진단신청 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// ================================================================================
// 💬 상담신청 처리 (기존 유지)
// ================================================================================

function processConsultationForm(data) {
  try {
    // 🧪 베타 피드백 안전장치: 베타 피드백이 상담으로 오분류되는 것 방지
    if (data.action === 'saveBetaFeedback' || data.폼타입 === '베타테스트_피드백' || data.피드백유형) {
      console.log('🚨 베타 피드백이 상담신청으로 오분류 시도됨 - 베타 피드백으로 리다이렉트');
      return processBetaFeedback(data);
    }
    
    const sheet = getOrCreateSheet(SHEETS.CONSULTATION, 'consultation');
    const timestamp = getCurrentKoreanTime();
    
    console.log('✅ 상담신청 처리 시작 - 정상 분기:', {
      name: data.성명 || data.name,
      company: data.회사명 || data.company,
      email: data.이메일 || data.email,
      action: data.action,
      폼타입: data.폼타입
    });
    
    // 상담신청 데이터 행 구성 (15개 컬럼)
    const rowData = [
      timestamp,                                              // A: 제출일시
      data.상담유형 || data.consultationType || '일반상담',     // B: 상담유형
      data.성명 || data.name || '',                            // C: 성명
      data.연락처 || data.phone || '',                         // D: 연락처
      data.이메일 || data.email || '',                         // E: 이메일
      data.회사명 || data.company || '',                       // F: 회사명
      data.직책 || data.position || '',                       // G: 직책
      data.상담분야 || data.consultationArea || data.industry || '', // H: 상담분야
      data.문의내용 || data.inquiryContent || data.message || '', // I: 문의내용
      data.희망상담시간 || data.preferredTime || '',           // J: 희망상담시간
      data.개인정보동의 === true || data.개인정보동의 === '동의' || data.privacyConsent === true ? '동의' : '미동의', // K: 개인정보동의
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
    if (AUTO_REPLY_ENABLED) {
      sendAdminNotification(data, newRow, '상담신청');
      
      // 신청자 확인 이메일 발송
      const userEmail = data.이메일 || data.email;
      const userName = data.성명 || data.name;
      if (userEmail) {
        sendUserConfirmation(userEmail, userName, '상담');
      }
    }

    return createSuccessResponse({
      message: '상담신청이 성공적으로 접수되었습니다.',
      sheet: SHEETS.CONSULTATION,
      row: newRow,
      timestamp: timestamp,
      admin: ADMIN_EMAIL,
      platform: 'Vercel 호환 모드'
    });

  } catch (error) {
    console.error('❌ 상담신청 처리 오류:', error);
    return createErrorResponse('상담신청 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// ================================================================================
// 📧 기존 이메일 발송 함수 (유지)
// ================================================================================

/**
 * 관리자 알림 이메일 발송 (진단/상담용)
 */
function sendAdminNotification(data, rowNumber, type) {
  try {
    const isConsultation = type === '상담신청';
    const subject = `[M-CENTER] 새로운 ${type} 접수 - ${isConsultation ? (data.회사명 || data.company) : (data.회사명 || data.companyName)}`;
    
    const emailBody = `
📋 새로운 ${type}이 접수되었습니다.

👤 신청자 정보:
• 성명: ${isConsultation ? (data.성명 || data.name) : (data.담당자명 || data.contactName || data.contactManager)}
• 회사명: ${isConsultation ? (data.회사명 || data.company) : (data.회사명 || data.companyName)}
• 연락처: ${isConsultation ? (data.연락처 || data.phone) : (data.연락처 || data.contactPhone)}
• 이메일: ${isConsultation ? (data.이메일 || data.email) : (data.이메일 || data.contactEmail || data.email)}

${isConsultation ? `
💬 상담 정보:
• 상담유형: ${data.상담유형 || data.consultationType}
• 상담분야: ${data.상담분야 || data.consultationArea}
• 문의내용: ${data.문의내용 || data.inquiryContent || data.message}
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
    console.log('📧 관리자 알림 이메일 발송 완료:', ADMIN_EMAIL);
    
  } catch (error) {
    console.error('❌ 관리자 이메일 발송 실패:', error);
  }
}

/**
 * 신청자 확인 이메일 발송 (진단/상담용)
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
• 이메일: ${ADMIN_EMAIL}

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
 * 요청 유형 감지 (상담신청 vs 진단신청) - 베타 피드백 제외 강화
 */
function isConsultationRequest(data) {
  // 🧪 베타 피드백은 여러 조건으로 명시적 제외
  if (data.action === 'saveBetaFeedback' || 
      data.폼타입 === '베타테스트_피드백' ||
      data.피드백유형 ||
      data.계산기명) {
    console.log('🚨 isConsultationRequest: 베타 피드백으로 감지, 상담신청 아님');
    return false;
  }
  
  const isConsultation = !!(
    data.상담유형 || data.consultationType ||
    data.성명 || data.name ||
    data.문의내용 || data.inquiryContent ||
    data.action === 'saveConsultation'
  );
  
  console.log('🔍 상담신청 감지 결과:', {
    isConsultation,
    action: data.action,
    폼타입: data.폼타입,
    피드백유형: data.피드백유형
  });
  
  return isConsultation;
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
 * 시트 헤더 설정 (베타피드백 추가)
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
  } else if (type === 'betaFeedback') {
    // 베타피드백 시트 헤더 (14개) - 신규 추가
    headers = [
      '제출일시', '계산기명', '피드백유형', '사용자이메일', '문제설명',
      '기대동작', '실제동작', '재현단계', '심각도', '추가의견',
      '브라우저정보', '제출경로', '처리상태', '처리일시'
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
// 🧪 테스트 및 관리 함수 (통합)
// ================================================================================

/**
 * 테스트 데이터 생성 (베타 피드백 포함)
 */
function createTestData() {
  console.log('🧪 테스트 데이터 생성 시작');
  
  // 진단신청 테스트
  const diagnosisTest = {
    companyName: '테스트 AI진단기업',
    industry: 'software-development',
    contactManager: '김AI진단',
    email: 'aitest@example.com',
    employeeCount: '10-50명',
    businessLocation: '경기도',
    mainConcerns: '온라인 마케팅 강화 및 AI 도입을 통한 생산성 향상이 필요합니다',
    expectedBenefits: '매출 30% 증대와 업무효율 50% 향상을 기대합니다',
    privacyConsent: true
  };
  
  // 상담신청 테스트
  const consultationTest = {
    consultationType: 'business-analysis',
    name: '홍길동',
    phone: '010-1234-5678',
    email: 'test@example.com',
    company: '테스트기업',
    industry: 'manufacturing',
    employeeCount: '10-50명',
    urgency: 'urgent',
    message: 'BM ZEN 사업분석 상담 요청',
    privacyConsent: true
  };
  
  // 베타피드백 테스트 - 신규 추가
  const betaFeedbackTest = {
    action: 'saveBetaFeedback',
    계산기명: '상속세 계산기',
    피드백유형: '🐛 버그 신고',
    사용자이메일: 'beta@example.com',
    문제설명: '계산 결과가 음수로 나옵니다',
    기대동작: '양수의 상속세가 계산되어야 합니다',
    실제동작: '-1000000원이 결과로 나옵니다',
    재현단계: '1. 상속재산 1억 입력\n2. 계산 버튼 클릭\n3. 결과 확인',
    심각도: '높음',
    브라우저정보: 'Chrome 120.0.0 Windows',
    제출경로: 'https://m-center.co.kr/tax-calculator'
  };
  
  processDiagnosisForm(diagnosisTest);
  processConsultationForm(consultationTest);
  processBetaFeedback(betaFeedbackTest);
  
  console.log('✅ 테스트 데이터 생성 완료 (진단+상담+베타피드백)');
}

/**
 * 초기화 함수 (베타 피드백 시트 포함)
 */
function initializeSheets() {
  console.log('🔧 시트 초기화 시작');
  
  getOrCreateSheet(SHEETS.DIAGNOSIS, 'diagnosis');
  getOrCreateSheet(SHEETS.CONSULTATION, 'consultation');
  getOrCreateSheet(SHEETS.BETA_FEEDBACK, 'betaFeedback'); // 신규 추가
  
  console.log('✅ 시트 초기화 완료 (3개 시트)');
}

// ================================================================================
// 📝 통합 버전 가이드 및 수정 내역
// ================================================================================

/**
 * 📖 수정 내역 (v2025.01.통합베타_안정화)
 * 
 * ✅ 베타 피드백 시스템 안전하게 통합
 * ✅ 구글시트 ID 통일 (1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug)
 * ✅ 관리자 이메일 통일 (hongik423@gmail.com)
 * ✅ 기존 진단/상담 기능 100% 보존 (검증된 구조 유지)
 * ✅ 베타피드백 전용 시트 및 이메일 시스템
 * ✅ 기존 로직에 영향 없는 안전한 추가
 * ✅ 간단하고 안정적인 구조 유지
 * 
 * 🔧 사용법:
 * 1. 구글시트(1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug) 열기
 * 2. 확장 → Apps Script → 이 코드로 교체
 * 3. 저장 후 배포 → 웹 앱으로 배포
 * 4. 액세스 권한: "모든 사용자"로 설정
 * 5. 기존 URL 그대로 사용 가능 (완전 호환)
 * 
 * 📊 지원 요청 타입:
 * - action: 'saveBetaFeedback' → 베타 피드백 처리 (신규)
 * - 기존 요청 → 기존 로직으로 자동 처리 (변경 없음)
 * 
 * 📧 관리자 이메일:
 * - 모든 알림: hongik423@gmail.com (통일)
 */ 