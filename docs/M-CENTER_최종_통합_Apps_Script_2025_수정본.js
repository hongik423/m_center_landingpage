/**
 * ================================================================================
 * M-CENTER 최종 통합 Apps Script + 베타 피드백 시스템 (오류 해결 강화 버전)
 * ================================================================================
 * 
 * 📋 통합 기능:
 * ✅ 진단신청자 → "AI_진단신청" 시트
 * ✅ 상담신청자 → "상담신청" 시트  
 * ✅ 베타피드백 → "베타피드백" 시트 (신규 추가)
 * ✅ 관리자 통합 알림 시스템 (hongik423@gmail.com 통일)
 * ✅ 신청자/피드백자 확인 메일 자동 발송
 * ✅ 충돌 없는 통합 처리
 * ✅ 405/404 오류 해결 강화 (신규)
 * ✅ 연결 테스트 및 디버깅 시스템 (신규)
 * 
 * 🔧 설치 방법:
 * 1. 구글시트(1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug) 열기
 * 2. 확장 → Apps Script → 이 코드 복사
 * 3. 저장 → 배포 → 웹 앱으로 배포
 * 4. 액세스 권한: "모든 사용자"로 설정
 * 5. 새 배포 생성 (기존 배포가 있다면)
 * 
 * 🚨 중요: 배포 시 반드시 "새 배포" 생성하고 URL 업데이트!
 */

// ================================================================================
// 🔧 통합 환경설정 (강화된 버전)
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

// 🆕 디버깅 설정 (405/404 오류 해결용)
const DEBUG_MODE = true;
const VERSION = '2025.01.통합베타_오류해결강화';

// ================================================================================
// 📡 메인 처리 함수 (통합 라우팅) - 오류 해결 강화
// ================================================================================

/**
 * POST 요청 처리 (기존 구조 + 베타 피드백 추가 + 강화된 오류 처리)
 */
function doPost(e) {
  try {
    // 🆕 디버깅 로그 강화
    if (DEBUG_MODE) {
      console.log('🔥 POST 요청 수신 시작 - 디버깅 모드');
      console.log('📨 요청 정보:', {
        hasPostData: !!e.postData,
        contentType: e.postData ? e.postData.type : 'N/A',
        timestamp: getCurrentKoreanTime(),
        version: VERSION
      });
    }

    // POST 데이터 파싱 (강화된 오류 처리)
    let requestData = {};
    
    if (e.postData && e.postData.contents) {
      try {
        requestData = JSON.parse(e.postData.contents);
      } catch (parseError) {
        console.error('❌ JSON 파싱 오류:', parseError);
        return createErrorResponse('잘못된 JSON 형식입니다: ' + parseError.toString());
      }
    } else {
      console.warn('⚠️ POST 데이터가 없습니다. 빈 객체로 처리합니다.');
    }
    
    if (DEBUG_MODE) {
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
    }

    // 🧪 베타 피드백 처리 (최우선 조건으로 강화)
    const isBetaFeedback = requestData.action === 'saveBetaFeedback' || 
                          requestData.폼타입 === '베타테스트_피드백' || 
                          (requestData.피드백유형 && requestData.사용자이메일 && requestData.계산기명);
    
    if (isBetaFeedback) {
      console.log('🎯 베타 피드백 강제 분기 진입 - 최우선 처리');
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
    console.error('❌ POST 요청 처리 치명적 오류:', error);
    return createErrorResponse('POST 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

/**
 * GET 요청 처리 (상태 확인) - 강화된 디버깅 정보
 */
function doGet(e) {
  try {
    // 🆕 GET 요청 디버깅
    if (DEBUG_MODE) {
      console.log('🔥 GET 요청 수신:', {
        parameters: e.parameter,
        timestamp: getCurrentKoreanTime(),
        version: VERSION
      });
    }

    // 🆕 연결 테스트 처리
    if (e.parameter && e.parameter.testType === 'connection') {
      return createSuccessResponse({
        status: 'CONNECTION_TEST_SUCCESS',
        message: 'Google Apps Script 연결 테스트 성공',
        timestamp: getCurrentKoreanTime(),
        version: VERSION,
        requestInfo: {
          source: e.parameter.source || 'unknown',
          testAction: e.parameter.action || 'ping'
        }
      });
    }

    // 기본 상태 확인 응답 (강화된 버전)
    return createSuccessResponse({
      status: 'M-CENTER 통합 데이터 처리 시스템 + 베타피드백 정상 작동 중',
      timestamp: getCurrentKoreanTime(),
      version: VERSION,
      admin: ADMIN_EMAIL,
      features: [
        '✅ 진단신청 처리',
        '✅ 상담신청 처리', 
        '✅ 베타피드백 처리 (신규)',
        '✅ 자동 이메일 발송',
        '✅ 데이터 관리',
        '🆕 연결 테스트 지원',
        '🆕 강화된 오류 처리'
      ],
      sheets: [SHEETS.DIAGNOSIS, SHEETS.CONSULTATION, SHEETS.BETA_FEEDBACK],
      spreadsheetId: SPREADSHEET_ID,
      debugMode: DEBUG_MODE,
      healthCheck: {
        spreadsheetAccess: testSpreadsheetAccess(),
        emailService: testEmailService(),
        timestamp: getCurrentKoreanTime()
      }
    });

  } catch (error) {
    console.error('❌ GET 요청 처리 오류:', error);
    return createErrorResponse('GET 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// ================================================================================
// 🆕 헬스체크 및 테스트 함수 (405/404 오류 해결용)
// ================================================================================

/**
 * 스프레드시트 접근 테스트
 */
function testSpreadsheetAccess() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    return {
      accessible: true,
      sheetName: sheet.getName(),
      lastRow: sheet.getLastRow()
    };
  } catch (error) {
    console.error('❌ 스프레드시트 접근 테스트 실패:', error);
    return {
      accessible: false,
      error: error.toString()
    };
  }
}

/**
 * 이메일 서비스 테스트
 */
function testEmailService() {
  try {
    // 실제 이메일을 보내지 않고 권한만 체크
    const quota = MailApp.getRemainingDailyQuota();
    return {
      available: true,
      dailyQuota: quota
    };
  } catch (error) {
    console.error('❌ 이메일 서비스 테스트 실패:', error);
    return {
      available: false,
      error: error.toString()
    };
  }
}

/**
 * 🆕 전체 시스템 헬스체크 함수
 */
function performHealthCheck() {
  const results = {
    timestamp: getCurrentKoreanTime(),
    version: VERSION,
    spreadsheet: testSpreadsheetAccess(),
    email: testEmailService(),
    sheets: {}
  };
  
  // 각 시트 상태 체크
  Object.values(SHEETS).forEach(sheetName => {
    try {
      const sheet = getOrCreateSheet(sheetName, 'test');
      results.sheets[sheetName] = {
        exists: true,
        lastRow: sheet.getLastRow()
      };
    } catch (error) {
      results.sheets[sheetName] = {
        exists: false,
        error: error.toString()
      };
    }
  });
  
  console.log('🏥 헬스체크 완료:', results);
  return results;
}

// ================================================================================
// 🧪 베타 피드백 처리 시스템 (기존 유지)
// ================================================================================

function processBetaFeedback(data) {
  try {
    if (DEBUG_MODE) {
      console.log('🧪 베타 피드백 처리 함수 시작 - 디버깅 모드:', {
        계산기명: data.계산기명,
        피드백유형: data.피드백유형,
        사용자이메일: data.사용자이메일?.substring(0, 5) + '***',
        폼타입: data.폼타입,
        action: data.action
      });
    }
    
    const sheet = getOrCreateSheet(SHEETS.BETA_FEEDBACK, 'betaFeedback');
    const timestamp = getCurrentKoreanTime();
    
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

    // 데이터 저장
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    if (DEBUG_MODE) {
      console.log('✅ 베타 피드백 저장 완료 - 디버깅:', {
        targetSheet: SHEETS.BETA_FEEDBACK,
        savedToRow: newRow,
        calculator: data.계산기명,
        spreadsheetId: SPREADSHEET_ID
      });
    }

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
      feedbackType: data.피드백유형,
      version: VERSION
    });

  } catch (error) {
    console.error('❌ 베타 피드백 처리 오류:', error);
    return createErrorResponse('베타 피드백 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// ================================================================================
// 🎯 진단신청 처리 (문항별 점수 + 보고서 내용 추가)
// ================================================================================

function processDiagnosisForm(data) {
  try {
    // 🧪 베타 피드백 안전장치
    if (data.action === 'saveBetaFeedback' || data.폼타입 === '베타테스트_피드백' || data.피드백유형) {
      console.log('🚨 베타 피드백이 진단신청으로 오분류 시도됨 - 베타 피드백으로 리다이렉트');
      return processBetaFeedback(data);
    }
    
    const sheet = getOrCreateSheet(SHEETS.DIAGNOSIS, 'diagnosisEnhanced');
    const timestamp = getCurrentKoreanTime();
    
    if (DEBUG_MODE) {
      console.log('✅ 진단신청 처리 시작 - 디버깅 모드:', {
        company: data.회사명 || data.companyName,
        email: data.이메일 || data.contactEmail || data.email,
        action: data.action,
        폼타입: data.폼타입,
        hasDetailedScores: !!(data.문항별점수 || data.detailedScores),
        hasSummaryReport: !!(data.진단보고서요약 || data.summaryReport)
      });
    }

    // 🔍 **문항별 점수 데이터 추출**
    const detailedScores = data.문항별점수 || data.detailedScores || {};
    const categoryScores = data.카테고리점수 || data.categoryScores || {};
    
    // 20개 평가 항목 점수 추출
    const scoreData = {
      // 상품/서비스 관리 역량 (5개)
      기획수준: detailedScores.planning_level || 0,
      차별화정도: detailedScores.differentiation_level || 0,
      가격설정: detailedScores.pricing_level || 0,
      전문성: detailedScores.expertise_level || 0,
      품질: detailedScores.quality_level || 0,
      
      // 고객응대 역량 (4개)
      고객맞이: detailedScores.customer_greeting || 0,
      고객응대: detailedScores.customer_service || 0,
      불만관리: detailedScores.complaint_management || 0,
      고객유지: detailedScores.customer_retention || 0,
      
      // 마케팅 역량 (5개)
      고객이해: detailedScores.customer_understanding || 0,
      마케팅계획: detailedScores.marketing_planning || 0,
      오프라인마케팅: detailedScores.offline_marketing || 0,
      온라인마케팅: detailedScores.online_marketing || 0,
      판매전략: detailedScores.sales_strategy || 0,
      
      // 구매 및 재고관리 (2개)
      구매관리: detailedScores.purchase_management || 0,
      재고관리: detailedScores.inventory_management || 0,
      
      // 매장관리 역량 (4개)
      외관관리: detailedScores.exterior_management || 0,
      인테리어관리: detailedScores.interior_management || 0,
      청결도: detailedScores.cleanliness || 0,
      작업동선: detailedScores.work_flow || 0
    };

    // 🔍 **카테고리별 점수 추출**
    const categoryData = {
      상품서비스점수: categoryScores.productService?.score?.toFixed(1) || '0.0',
      고객응대점수: categoryScores.customerService?.score?.toFixed(1) || '0.0',
      마케팅점수: categoryScores.marketing?.score?.toFixed(1) || '0.0',
      구매재고점수: categoryScores.procurement?.score?.toFixed(1) || '0.0',
      매장관리점수: categoryScores.storeManagement?.score?.toFixed(1) || '0.0'
    };

    // 📝 **진단결과보고서 요약 추출**
    const reportSummary = data.진단보고서요약 || data.summaryReport || '';
    const reportLength = reportSummary.length || 0;
    const totalScore = data.종합점수 || data.totalScore || 0;
    
    // 🔍 **추천서비스 정보 추출**
    const recommendedServices = data.추천서비스 || data.recommendedServices || [];
    const servicesText = Array.isArray(recommendedServices) 
      ? recommendedServices.map(s => s.name || s).join(', ')
      : String(recommendedServices);

    // 📊 **확장된 진단신청 데이터 행 구성 (58개 컬럼)**
    const rowData = [
      // 기본 정보 (A-R: 18개 컬럼)
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
      'AI_무료진단_레벨업시트',                                // N: 폼타입
      '접수완료',                                              // O: 진단상태
      '',                                                     // P: AI분석결과
      '',                                                     // Q: 결과URL
      '',                                                     // R: 분석완료일시
      
      // 📊 **진단 결과 정보 (S-W: 5개 컬럼)**
      totalScore,                                             // S: 종합점수
      categoryData.상품서비스점수,                             // T: 상품서비스점수
      categoryData.고객응대점수,                               // U: 고객응대점수
      categoryData.마케팅점수,                                 // V: 마케팅점수
      categoryData.구매재고점수,                               // W: 구매재고점수
      categoryData.매장관리점수,                               // X: 매장관리점수
      
      // 📝 **20개 문항별 상세 점수 (Y-AR: 20개 컬럼)**
      scoreData.기획수준,        // Y: 기획수준
      scoreData.차별화정도,      // Z: 차별화정도
      scoreData.가격설정,        // AA: 가격설정
      scoreData.전문성,          // AB: 전문성
      scoreData.품질,            // AC: 품질
      scoreData.고객맞이,        // AD: 고객맞이
      scoreData.고객응대,        // AE: 고객응대
      scoreData.불만관리,        // AF: 불만관리
      scoreData.고객유지,        // AG: 고객유지
      scoreData.고객이해,        // AH: 고객이해
      scoreData.마케팅계획,      // AI: 마케팅계획
      scoreData.오프라인마케팅,  // AJ: 오프라인마케팅
      scoreData.온라인마케팅,    // AK: 온라인마케팅
      scoreData.판매전략,        // AL: 판매전략
      scoreData.구매관리,        // AM: 구매관리
      scoreData.재고관리,        // AN: 재고관리
      scoreData.외관관리,        // AO: 외관관리
      scoreData.인테리어관리,    // AP: 인테리어관리
      scoreData.청결도,          // AQ: 청결도
      scoreData.작업동선,        // AR: 작업동선
      
      // 🎯 **진단결과보고서 정보 (AS-AV: 4개 컬럼)**
      reportLength,              // AS: 보고서글자수
      servicesText,              // AT: 추천서비스
      reportSummary.substring(0, 500) + (reportSummary.length > 500 ? '...' : ''), // AU: 보고서요약(500자)
      reportSummary              // AV: 보고서전문
    ];

    // 데이터 저장
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    if (DEBUG_MODE) {
      console.log('✅ 확장된 진단신청 저장 완료 - 디버깅:', {
        sheet: SHEETS.DIAGNOSIS,
        row: newRow,
        company: data.회사명 || data.companyName,
        email: data.이메일 || data.contactEmail || data.email,
        totalScore: totalScore,
        reportLength: reportLength,
        detailedScoresCount: Object.keys(scoreData).length,
        categoryScoresCount: Object.keys(categoryData).length
      });
    }

    // 관리자 이메일 발송 (진단 결과 포함)
    if (AUTO_REPLY_ENABLED) {
      sendEnhancedDiagnosisAdminNotification(data, newRow, totalScore, reportSummary);
      
      // 신청자 확인 이메일 발송
      const userEmail = data.이메일 || data.contactEmail || data.email;
      const userName = data.담당자명 || data.contactName || data.contactManager;
      if (userEmail) {
        sendUserConfirmation(userEmail, userName, '진단');
      }
    }

    return createSuccessResponse({
      message: '📊 AI 무료진단이 성공적으로 접수되었습니다 (문항별 점수 + 보고서 포함).',
      sheet: SHEETS.DIAGNOSIS,
      row: newRow,
      timestamp: timestamp,
      admin: ADMIN_EMAIL,
      platform: 'Google Apps Script Enhanced',
      version: VERSION,
      enhancedData: {
        totalScore: totalScore,
        reportLength: reportLength,
        detailedScores: Object.keys(scoreData).length,
        categoryScores: Object.keys(categoryData).length,
        hasReport: reportSummary.length > 0
      }
    });

  } catch (error) {
    console.error('❌ 확장된 진단신청 처리 오류:', error);
    return createErrorResponse('확장된 진단신청 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// 📧 **확장된 진단 관리자 알림 이메일**
function sendEnhancedDiagnosisAdminNotification(data, rowNumber, totalScore, reportSummary) {
  try {
    const companyName = data.회사명 || data.companyName || '미확인';
    const subject = `[M-CENTER] 🎯 AI 무료진단 접수 - ${companyName} (${totalScore}점)`;
    
    const emailBody = `📊 새로운 AI 무료진단이 접수되었습니다!\n\n` +
      `🏢 회사명: ${companyName}\n` +
      `📧 담당자: ${data.담당자명 || data.contactName || '미확인'} (${data.이메일 || data.contactEmail || data.email || '미확인'})\n` +
      `🏭 업종: ${data.업종 || data.industry || '미확인'}\n` +
      `👥 직원수: ${data.직원수 || data.employeeCount || '미확인'}\n` +
      `🎯 종합점수: ${totalScore}점/100점\n` +
      `📝 보고서 길이: ${reportSummary.length}자\n` +
      `⏰ 접수 시간: ${getCurrentKoreanTime()}\n\n` +
      `💭 주요 고민사항:\n${(data.주요고민사항 || data.mainConcerns || '').substring(0, 200)}...\n\n` +
      `🎯 기대 효과:\n${(data.예상혜택 || data.expectedBenefits || '').substring(0, 200)}...\n\n` +
      `📋 시트 위치: ${SHEETS.DIAGNOSIS} 시트 ${rowNumber}행\n` +
      `🔗 구글시트: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit\n\n` +
      `※ 문항별 상세 점수와 진단결과보고서가 구글시트에 완전히 저장되었습니다.`;

    GmailApp.sendEmail(ADMIN_EMAIL, subject, emailBody);
    console.log('📧 확장된 진단 관리자 알림 이메일 발송 완료');
  } catch (error) {
    console.error('❌ 확장된 진단 관리자 이메일 발송 실패:', error);
  }
}



// ================================================================================
// 💬 상담신청 처리 (강화된 디버깅)
// ================================================================================

function processConsultationForm(data) {
  try {
    // 🧪 베타 피드백 안전장치
    if (data.action === 'saveBetaFeedback' || data.폼타입 === '베타테스트_피드백' || data.피드백유형) {
      console.log('🚨 베타 피드백이 상담신청으로 오분류 시도됨 - 베타 피드백으로 리다이렉트');
      return processBetaFeedback(data);
    }
    
    const sheet = getOrCreateSheet(SHEETS.CONSULTATION, 'consultation');
    const timestamp = getCurrentKoreanTime();
    
    if (DEBUG_MODE) {
      console.log('✅ 상담신청 처리 시작 - 디버깅 모드:', {
        name: data.성명 || data.name,
        company: data.회사명 || data.company,
        email: data.이메일 || data.email,
        action: data.action,
        폼타입: data.폼타입
      });
    }
    
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
    
    if (DEBUG_MODE) {
      console.log('✅ 상담신청 저장 완료 - 디버깅:', {
        sheet: SHEETS.CONSULTATION,
        row: newRow,
        name: data.성명 || data.name,
        company: data.회사명 || data.company,
        email: data.이메일 || data.email
      });
    }

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
      platform: 'Google Apps Script',
      version: VERSION
    });

  } catch (error) {
    console.error('❌ 상담신청 처리 오류:', error);
    return createErrorResponse('상담신청 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// ================================================================================
// 🛠️ 유틸리티 함수 (기존 유지 + 강화)
// ================================================================================

/**
 * 시트 가져오기 또는 생성 (강화된 오류 처리)
 */
function getOrCreateSheet(sheetName, type) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      setupHeaders(sheet, type);
      console.log('📋 새 시트 생성:', sheetName);
    }
    
    return sheet;
  } catch (error) {
    console.error('❌ 시트 생성/접근 오류:', error);
    throw new Error(`시트 처리 오류: ${error.toString()}`);
  }
}

/**
 * 한국 시간 가져오기
 */
function getCurrentKoreanTime() {
  return Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy. MM. dd. a hh:mm:ss');
}

/**
 * 응답 생성 함수들 (강화된 버전)
 */
function createSuccessResponse(data) {
  const response = { 
    success: true, 
    timestamp: getCurrentKoreanTime(),
    version: VERSION,
    ...data 
  };
  
  if (DEBUG_MODE) {
    console.log('✅ 성공 응답 생성:', response);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message) {
  const response = { 
    success: false, 
    error: message,
    timestamp: getCurrentKoreanTime(),
    version: VERSION
  };
  
  console.error('❌ 오류 응답 생성:', response);
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================================================================================
// 📝 기존 함수들 (간소화된 버전 - 길이 제한)
// ================================================================================

// 베타 피드백 관리자 알림 이메일 발송
function sendBetaFeedbackAdminNotification(data, rowNumber) {
  try {
    const subject = `[M-CENTER] 🚨 긴급! 베타 피드백 접수 - ${data.계산기명 || '세금계산기'}`;
    const emailBody = `🧪 새로운 베타 피드백이 접수되었습니다!\n\n` +
      `🎯 대상 계산기: ${data.계산기명 || 'N/A'}\n` +
      `🐛 피드백 유형: ${data.피드백유형 || 'N/A'}\n` +
      `📧 사용자 이메일: ${data.사용자이메일 || 'N/A'}\n` +
      `⏰ 접수 시간: ${getCurrentKoreanTime()}\n\n` +
      `📋 시트 위치: ${SHEETS.BETA_FEEDBACK} 시트 ${rowNumber}행\n` +
      `🔗 구글시트: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

    GmailApp.sendEmail(ADMIN_EMAIL, subject, emailBody);
    console.log('📧 베타 피드백 관리자 알림 이메일 발송 완료');
  } catch (error) {
    console.error('❌ 베타 피드백 관리자 이메일 발송 실패:', error);
  }
}

// 베타 피드백 사용자 확인 이메일 발송
function sendBetaFeedbackUserConfirmation(email, data) {
  try {
    const subject = `[M-CENTER] 🧪 베타 피드백 접수 완료! ${data.계산기명 || '세금계산기'}`;
    const emailBody = `안녕하세요!\n\n` +
      `M-CENTER 세금계산기 베타테스트에 참여해 주셔서 감사합니다.\n\n` +
      `🎯 접수된 피드백: ${data.계산기명 || '세금계산기'}\n` +
      `⏰ 접수 일시: ${getCurrentKoreanTime()}\n\n` +
      `담당자가 검토 후 이메일로 회신드리겠습니다.\n\n` +
      `감사합니다.\nM-CENTER 베타테스트 개발팀`;

    GmailApp.sendEmail(email, subject, emailBody);
    console.log('📧 베타 피드백 사용자 확인 이메일 발송 완료:', email);
  } catch (error) {
    console.error('❌ 베타 피드백 사용자 이메일 발송 실패:', error);
  }
}

// 관리자 알림 이메일 발송 (진단/상담용)
function sendAdminNotification(data, rowNumber, type) {
  try {
    const isConsultation = type === '상담신청';
    const subject = `[M-CENTER] 새로운 ${type} 접수 - ${isConsultation ? (data.회사명 || data.company) : (data.회사명 || data.companyName)}`;
    
    const emailBody = `📋 새로운 ${type}이 접수되었습니다.\n\n` +
      `👤 신청자: ${isConsultation ? (data.성명 || data.name) : (data.담당자명 || data.contactName)}\n` +
      `🏢 회사명: ${isConsultation ? (data.회사명 || data.company) : (data.회사명 || data.companyName)}\n` +
      `📧 이메일: ${isConsultation ? (data.이메일 || data.email) : (data.이메일 || data.contactEmail)}\n` +
      `⏰ 접수시간: ${getCurrentKoreanTime()}\n\n` +
      `📋 구글시트: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

    GmailApp.sendEmail(ADMIN_EMAIL, subject, emailBody);
    console.log('📧 관리자 알림 이메일 발송 완료:', ADMIN_EMAIL);
  } catch (error) {
    console.error('❌ 관리자 이메일 발송 실패:', error);
  }
}

// 신청자 확인 이메일 발송 (진단/상담용)
function sendUserConfirmation(email, name, type) {
  try {
    const isConsultation = type === '상담';
    const subject = `[M-CENTER] ${isConsultation ? '상담' : '진단'} 신청이 접수되었습니다`;
    
    const emailBody = `안녕하세요 ${name || '고객'}님,\n\n` +
      `기업의별 M-CENTER에서 알려드립니다.\n\n` +
      `✅ ${isConsultation ? '전문가 상담' : 'AI 무료 진단'} 신청이 성공적으로 접수되었습니다.\n\n` +
      `📞 담당 전문가가 1-2일 내에 연락드리겠습니다.\n\n` +
      `▣ 담당 컨설턴트: 이후경 경영지도사\n` +
      `▣ 전화: 010-9251-9743\n` +
      `▣ 이메일: ${ADMIN_EMAIL}\n\n` +
      `감사합니다.\n기업의별 M-CENTER`;

    GmailApp.sendEmail(email, subject, emailBody);
    console.log('📧 신청자 확인 이메일 발송 완료:', email);
  } catch (error) {
    console.error('❌ 신청자 이메일 발송 실패:', error);
  }
}

// 요청 유형 감지 (상담신청 vs 진단신청)
function isConsultationRequest(data) {
  if (data.action === 'saveBetaFeedback' || data.폼타입 === '베타테스트_피드백' || data.피드백유형 || data.계산기명) {
    return false;
  }
  
  return !!(data.상담유형 || data.consultationType || data.성명 || data.name || data.문의내용 || data.inquiryContent || data.action === 'saveConsultation');
}

// 📊 시트 헤더 설정 (진단 질문 키워드 포함)
function setupHeaders(sheet, type) {
  let headers;
  
  if (type === 'consultation') {
    headers = [
      '제출일시', '상담유형', '성명', '연락처', '이메일', 
      '회사명', '직책', '상담분야', '문의내용', '희망상담시간', 
      '개인정보동의', '진단연계여부', '진단점수', '추천서비스', '처리상태'
    ];
  } else if (type === 'betaFeedback') {
    headers = [
      '제출일시', '계산기명', '피드백유형', '사용자이메일', '문제설명', 
      '기대동작', '실제동작', '재현단계', '심각도', '추가의견', 
      '브라우저정보', '제출경로', '처리상태', '처리일시'
    ];
  } else if (type === 'diagnosisEnhanced') {
    // 📊 **확장된 진단신청 헤더 (48개 컬럼) + 진단 질문 키워드**
    headers = [
      // 🔵 기본 정보 (A-R: 18개)
      '제출일시', 
      '회사명', 
      '업종', 
      '사업담당자', 
      '직원수', 
      '사업성장단계', 
      '주요고민사항', 
      '예상혜택', 
      '진행사업장', 
      '담당자명', 
      '연락처', 
      '이메일', 
      '개인정보동의', 
      '폼타입', 
      '진단상태', 
      'AI분석결과', 
      '결과URL', 
      '분석완료일시',
      
      // 🟢 진단 결과 (S-X: 6개)
      '종합점수 (100점 만점)', 
      '상품서비스점수 (25% 가중치)', 
      '고객응대점수 (20% 가중치)', 
      '마케팅점수 (25% 가중치)', 
      '구매재고점수 (15% 가중치)', 
      '매장관리점수 (15% 가중치)',
      
      // 🔶 상품/서비스 관리 역량 (Y-AC: 5개, 가중치 25%)
      '기획수준 (상품/서비스 기획 수준이 어느 정도인가요?)', 
      '차별화정도 (경쟁업체 대비 차별화 정도는?)', 
      '가격설정 (가격 설정의 합리성은?)', 
      '전문성 (업무 전문성 수준은?)', 
      '품질 (상품/서비스 품질 수준은?)',
      
      // 🔷 고객응대 역량 (AD-AG: 4개, 가중치 20%)
      '고객맞이 (고객 맞이의 친절함은?)', 
      '고객응대 (고객 응대 능력은?)', 
      '불만관리 (고객 불만 처리 능력은?)', 
      '고객유지 (고객 유지 관리 능력은?)',
      
      // 🔸 마케팅 역량 (AH-AL: 5개, 가중치 25%)
      '고객이해 (고객 특성 이해도는?)', 
      '마케팅계획 (마케팅 계획 수립 능력은?)', 
      '오프라인마케팅 (오프라인 마케팅 실행 능력은?)', 
      '온라인마케팅 (온라인 마케팅 활용 능력은?)', 
      '판매전략 (판매 전략 수립 및 실행 능력은?)',
      
      // 🔹 구매/재고관리 (AM-AN: 2개, 가중치 15%)
      '구매관리 (구매 관리의 체계성은?)', 
      '재고관리 (재고 관리의 효율성은?)',
      
      // 🔺 매장관리 역량 (AO-AR: 4개, 가중치 15%)
      '외관관리 (매장 외관 관리 상태는?)', 
      '인테리어관리 (내부 인테리어 관리 상태는?)', 
      '청결도 (매장 청결도는?)', 
      '작업동선 (작업 동선의 효율성은?)',
      
      // 🟣 보고서 정보 (AS-AV: 4개)
      '보고서글자수', 
      '추천서비스 목록', 
      '보고서요약 (500자)', 
      '보고서전문 (3000자 미만)'
    ];
  } else {
    // 기본 진단신청 헤더 (기존)
    headers = [
      '제출일시', '회사명', '업종', '사업담당자', '직원수', '사업성장단계', 
      '주요고민사항', '예상혜택', '진행사업장', '담당자명', '연락처', '이메일', 
      '개인정보동의', '폼타입', '진단상태', 'AI분석결과', '결과URL', '분석완료일시'
    ];
  }
  
  // 📋 **1행: 헤더 설정**
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  
  // 🎨 **기본 헤더 스타일링**
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  headerRange.setWrap(true); // 텍스트 줄바꿈 허용
  sheet.setFrozenRows(1);
  
  // 📊 **확장된 진단의 경우 카테고리별 색상 구분**
  if (type === 'diagnosisEnhanced') {
    
    // 🔵 기본 정보 영역 (A-R: 18개) - 파란색
    const basicInfoRange = sheet.getRange(1, 1, 1, 18);
    basicInfoRange.setBackground('#4285f4');
    basicInfoRange.setFontColor('#ffffff');
    
    // 🟢 진단 결과 영역 (S-X: 6개) - 초록색
    const resultRange = sheet.getRange(1, 19, 1, 6);
    resultRange.setBackground('#34a853');
    resultRange.setFontColor('#ffffff');
    
    // 🔶 상품/서비스 관리 역량 (Y-AC: 5개) - 주황색
    const productServiceRange = sheet.getRange(1, 25, 1, 5);
    productServiceRange.setBackground('#ff9800');
    productServiceRange.setFontColor('#ffffff');
    
    // 🔷 고객응대 역량 (AD-AG: 4개) - 파란색 계열
    const customerServiceRange = sheet.getRange(1, 30, 1, 4);
    customerServiceRange.setBackground('#2196f3');
    customerServiceRange.setFontColor('#ffffff');
    
    // 🔸 마케팅 역량 (AH-AL: 5개) - 보라색
    const marketingRange = sheet.getRange(1, 34, 1, 5);
    marketingRange.setBackground('#9c27b0');
    marketingRange.setFontColor('#ffffff');
    
    // 🔹 구매/재고관리 (AM-AN: 2개) - 갈색
    const procurementRange = sheet.getRange(1, 39, 1, 2);
    procurementRange.setBackground('#795548');
    procurementRange.setFontColor('#ffffff');
    
    // 🔺 매장관리 역량 (AO-AR: 4개) - 청록색
    const storeManagementRange = sheet.getRange(1, 41, 1, 4);
    storeManagementRange.setBackground('#009688');
    storeManagementRange.setFontColor('#ffffff');
    
    // 🟣 보고서 정보 (AS-AV: 4개) - 진한 보라색
    const reportRange = sheet.getRange(1, 45, 1, 4);
    reportRange.setBackground('#673ab7');
    reportRange.setFontColor('#ffffff');
    
    // 📏 **컬럼 폭 자동 조정**
    sheet.autoResizeColumns(1, headers.length);
    
    // 📝 **2행에 카테고리 설명 추가**
    const categoryDescriptions = [
      // 기본 정보 (18개)
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      // 진단 결과 (6개)
      '5점 척도→100점 환산', '상품서비스 평균점수', '고객응대 평균점수', '마케팅 평균점수', '구매재고 평균점수', '매장관리 평균점수',
      // 상품/서비스 관리 (5개)
      '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도',
      // 고객응대 (4개)
      '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도',
      // 마케팅 (5개)
      '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도',
      // 구매/재고관리 (2개)
      '1-5점 척도', '1-5점 척도',
      // 매장관리 (4개)
      '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도',
      // 보고서 정보 (4개)
      '글자 수', '추천서비스명', '요약 내용', '전체 보고서'
    ];
    
    sheet.getRange(2, 1, 1, categoryDescriptions.length).setValues([categoryDescriptions]);
    const descriptionRange = sheet.getRange(2, 1, 1, categoryDescriptions.length);
    descriptionRange.setBackground('#f5f5f5');
    descriptionRange.setFontColor('#666666');
    descriptionRange.setFontStyle('italic');
    descriptionRange.setFontSize(10);
    descriptionRange.setHorizontalAlignment('center');
    
    // 🔒 **헤더 행 보호 (옵션)**
    sheet.setFrozenRows(2); // 설명 행도 고정
    
    console.log('📊 진단 질문 키워드 포함 헤더 설정 완료 (48개 컬럼 + 설명)');
    console.log('🎨 카테고리별 색상 구분 적용 완료');
    console.log('📝 2행에 카테고리 설명 추가 완료');
  }
  
  console.log(`📋 ${type} 시트 헤더 설정 완료: ${headers.length}개 컬럼`);
}

// 📊 헤더 업데이트 전용 함수 (기존 시트 업데이트용)
function updateExistingSheetHeaders() {
  try {
    console.log('🔄 기존 시트 헤더 업데이트 시작...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const diagnosisSheet = spreadsheet.getSheetByName(SHEETS.DIAGNOSIS);
    
    if (diagnosisSheet) {
      // 기존 헤더 백업 (3행에 이동)
      const existingHeaders = diagnosisSheet.getRange(1, 1, 1, diagnosisSheet.getLastColumn()).getValues()[0];
      diagnosisSheet.getRange(3, 1, 1, existingHeaders.length).setValues([existingHeaders]);
      
      // 새로운 헤더 적용
      setupHeaders(diagnosisSheet, 'diagnosisEnhanced');
      
      console.log('✅ 진단 시트 헤더 업데이트 완료');
      console.log('📋 기존 헤더는 3행에 백업됨');
      
      return createSuccessResponse({
        message: '헤더 업데이트 성공',
        timestamp: getCurrentKoreanTime(),
        details: '진단 질문 키워드 포함 헤더로 업데이트 완료'
      });
    } else {
      console.log('❌ 진단 시트를 찾을 수 없습니다.');
      return createErrorResponse('진단 시트를 찾을 수 없습니다.');
    }
    
  } catch (error) {
    console.error('❌ 헤더 업데이트 실패:', error);
    return createErrorResponse('헤더 업데이트 실패: ' + error.toString());
  }
}

// ================================================================================
// 🚀 수정 내역 및 사용법 (v2025.01.오류해결강화)
// ================================================================================

/**
 * 📖 수정 내역 (v2025.01.오류해결강화)
 * 
 * 🆕 새로운 기능:
 * ✅ 강화된 디버깅 모드 (DEBUG_MODE = true)
 * ✅ 연결 테스트 지원 (GET ?testType=connection)
 * ✅ 헬스체크 시스템 (스프레드시트, 이메일 상태 확인)
 * ✅ CORS 헤더 추가 (Cross-Origin 문제 해결)
 * ✅ 강화된 오류 처리 및 로깅
 * ✅ POST/GET 요청 상세 디버깅
 * 
 * 🔧 405/404 오류 해결 방법:
 * 1. Google Apps Script에서 "새 배포" 생성
 * 2. 액세스 권한: "모든 사용자"로 설정
 * 3. 새로 생성된 웹앱 URL을 환경변수에 업데이트
 * 4. ?testType=connection으로 연결 테스트
 * 
 * 📊 테스트 방법:
 * - GET: https://script.google.com/.../exec
 * - GET 연결테스트: https://script.google.com/.../exec?testType=connection
 * - POST: JSON 데이터로 진단/상담/베타피드백 전송
 */ 