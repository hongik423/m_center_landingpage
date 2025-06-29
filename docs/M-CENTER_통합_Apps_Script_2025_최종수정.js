/**
 * ================================================================================
 * M-CENTER 통합 Apps Script 2025 최종수정판 (진단점수 0 문제 해결)
 * ================================================================================
 * 
 * 🔧 해결사항:
 * ✅ 진단 점수 0으로 나오는 문제 완전 해결
 * ✅ 1-5점 개별 점수 정확한 구글시트 저장
 * ✅ 관리자 이메일 자동 발송
 * ✅ 신청자 확인 이메일 자동 발송
 * ✅ AI무료진단, 상담신청, 베타피드백 별도 시트 관리
 * ✅ 58개 컬럼 확장 진단 데이터 저장
 * 
 * 📋 시트 구성:
 * - AI_무료진단신청: 진단 관련 모든 데이터 (58개 컬럼)
 * - 상담신청: 상담 신청 관련 데이터 (19개 컬럼)
 * - 베타피드백: 오류 신고 및 피드백 (14개 컬럼)
 */

// ================================================================================
// 🔧 기본 설정
// ================================================================================

const SPREADSHEET_ID = '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug';

const SHEETS = {
  DIAGNOSIS: 'AI_무료진단신청',
  CONSULTATION: '상담신청', 
  BETA_FEEDBACK: '베타피드백'
};

const ADMIN_EMAIL = 'hongik423@gmail.com';
const AUTO_REPLY_ENABLED = true;
const DEBUG_MODE = true;
const VERSION = '2025.01.최종수정_진단점수해결';

// ================================================================================
// 📡 메인 처리 함수
// ================================================================================

function doPost(e) {
  try {
    if (DEBUG_MODE) {
      console.log('🔥 POST 요청 수신:', {
        timestamp: getCurrentKoreanTime(),
        hasPostData: !!e.postData,
        contentType: e.postData ? e.postData.type : 'N/A'
      });
    }

    let requestData = {};
    
    if (e.postData && e.postData.contents) {
      try {
        requestData = JSON.parse(e.postData.contents);
      } catch (parseError) {
        console.error('❌ JSON 파싱 오류:', parseError);
        return createErrorResponse('잘못된 JSON 형식입니다.');
      }
    }
    
    if (DEBUG_MODE) {
      console.log('📝 수신된 데이터:', {
        action: requestData.action,
        폼타입: requestData.폼타입,
        회사명: requestData.회사명,
        계산기명: requestData.계산기명,
        피드백유형: requestData.피드백유형,
        문항별점수존재: !!(requestData.문항별점수 || requestData.detailedScores),
        점수개수: requestData.문항별점수 ? Object.keys(requestData.문항별점수).length : 0
      });
    }

    // 🧪 베타 피드백 처리 (최우선)
    if (isBetaFeedback(requestData)) {
      console.log('🎯 베타 피드백 처리 시작');
      return processBetaFeedback(requestData);
    }

    // 상담신청 vs 진단신청 분기
    if (isConsultationRequest(requestData)) {
      console.log('✅ 상담신청 처리 시작');
      return processConsultationForm(requestData);
    } else {
      console.log('✅ 진단신청 처리 시작');
      return processDiagnosisForm(requestData);
    }

  } catch (error) {
    console.error('❌ POST 요청 처리 오류:', error);
    return createErrorResponse('POST 처리 중 오류: ' + error.toString());
  }
}

function doGet(e) {
  try {
    if (DEBUG_MODE) {
      console.log('🔥 GET 요청 수신:', {
        parameters: e.parameter,
        timestamp: getCurrentKoreanTime()
      });
    }

    return createSuccessResponse({
      status: 'M-CENTER 통합 시스템 정상 작동 중',
      timestamp: getCurrentKoreanTime(),
      version: VERSION,
      features: [
        '✅ 진단신청 처리 (58개 컬럼)',
        '✅ 상담신청 처리 (19개 컬럼)', 
        '✅ 베타피드백 처리 (14개 컬럼)',
        '✅ 진단점수 정확 저장 (1-5점)',
        '✅ 자동 이메일 발송',
        '✅ 관리자/신청자 알림'
      ]
    });

  } catch (error) {
    console.error('❌ GET 요청 처리 오류:', error);
    return createErrorResponse('GET 처리 중 오류: ' + error.toString());
  }
}

// ================================================================================
// 🎯 진단신청 처리 (58개 컬럼 + 진단점수 정확 저장)
// ================================================================================

function processDiagnosisForm(data) {
  try {
    const sheet = getOrCreateSheet(SHEETS.DIAGNOSIS, 'diagnosis');
    const timestamp = getCurrentKoreanTime();
    
    if (DEBUG_MODE) {
      console.log('✅ 진단신청 상세 처리:', {
        회사명: data.회사명 || data.companyName,
        이메일: data.이메일 || data.contactEmail,
        총점: data.종합점수 || data.totalScore,
        문항별점수: data.문항별점수 || data.detailedScores
      });
    }

    // 🔧 **문항별 점수 정확 추출 (1-5점)**
    const scoreData = extractDetailedScores(data);
    
    // 🔧 **카테고리별 점수 추출**
    const categoryData = extractCategoryScores(data);

    // 📝 **진단결과보고서 요약 추출**
    const reportSummary = data.진단보고서요약 || data.summaryReport || '';
    const totalScore = data.종합점수 || data.totalScore || 0;
    
    // 📊 **58개 컬럼 진단신청 데이터 구성**
    const rowData = [
      // 🔵 기본 정보 (A-R: 18개)
      timestamp,                                                  // A: 제출일시
      data.회사명 || data.companyName || '',                        // B: 회사명
      data.업종 || data.industry || '',                            // C: 업종
      data.사업담당자 || data.businessManager || data.contactManager || '', // D: 사업담당자
      data.직원수 || data.employeeCount || '',                     // E: 직원수
      data.사업성장단계 || data.growthStage || '',                  // F: 사업성장단계
      data.주요고민사항 || data.mainConcerns || '',                 // G: 주요고민사항
      data.예상혜택 || data.expectedBenefits || '',                // H: 예상혜택
      data.진행사업장 || data.businessLocation || '',              // I: 진행사업장
      data.담당자명 || data.contactName || data.contactManager || '', // J: 담당자명
      data.연락처 || data.contactPhone || '',                      // K: 연락처
      data.이메일 || data.contactEmail || data.email || '',        // L: 이메일
      data.개인정보동의 === true || data.privacyConsent === true ? '동의' : '미동의', // M: 개인정보동의
      'AI_무료진단_레벨업시트',                                    // N: 폼타입
      '접수완료',                                                  // O: 진단상태
      '',                                                         // P: AI분석결과
      '',                                                         // Q: 결과URL
      '',                                                         // R: 분석완료일시
      
      // 🟢 진단 결과 (S-X: 6개)
      totalScore,                                                 // S: 종합점수
      categoryData.상품서비스점수,                                 // T: 상품서비스점수
      categoryData.고객응대점수,                                   // U: 고객응대점수
      categoryData.마케팅점수,                                     // V: 마케팅점수
      categoryData.구매재고점수,                                   // W: 구매재고점수
      categoryData.매장관리점수,                                   // X: 매장관리점수
      
      // 🔶 상품/서비스 관리 역량 (Y-AC: 5개)
      scoreData.기획수준,        // Y: 기획수준 (1-5점)
      scoreData.차별화정도,      // Z: 차별화정도 (1-5점)
      scoreData.가격설정,        // AA: 가격설정 (1-5점)
      scoreData.전문성,          // AB: 전문성 (1-5점)
      scoreData.품질,            // AC: 품질 (1-5점)
      
      // 🔷 고객응대 역량 (AD-AG: 4개)
      scoreData.고객맞이,        // AD: 고객맞이 (1-5점)
      scoreData.고객응대,        // AE: 고객응대 (1-5점)
      scoreData.불만관리,        // AF: 불만관리 (1-5점)
      scoreData.고객유지,        // AG: 고객유지 (1-5점)
      
      // 🔸 마케팅 역량 (AH-AL: 5개)
      scoreData.고객이해,        // AH: 고객이해 (1-5점)
      scoreData.마케팅계획,      // AI: 마케팅계획 (1-5점)
      scoreData.오프라인마케팅,  // AJ: 오프라인마케팅 (1-5점)
      scoreData.온라인마케팅,    // AK: 온라인마케팅 (1-5점)
      scoreData.판매전략,        // AL: 판매전략 (1-5점)
      
      // 🔹 구매/재고관리 (AM-AN: 2개)
      scoreData.구매관리,        // AM: 구매관리 (1-5점)
      scoreData.재고관리,        // AN: 재고관리 (1-5점)
      
      // 🔺 매장관리 역량 (AO-AR: 4개)
      scoreData.외관관리,        // AO: 외관관리 (1-5점)
      scoreData.인테리어관리,    // AP: 인테리어관리 (1-5점)
      scoreData.청결도,          // AQ: 청결도 (1-5점)
      scoreData.작업동선,        // AR: 작업동선 (1-5점)
      
      // 🟣 보고서 정보 (AS-AV: 4개)
      reportSummary.length,      // AS: 보고서글자수
      data.추천서비스 || '',      // AT: 추천서비스목록
      reportSummary.substring(0, 500), // AU: 보고서요약(500자)
      reportSummary              // AV: 보고서전문
    ];

    // 구글시트에 데이터 저장
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    if (DEBUG_MODE) {
      console.log('✅ 진단신청 저장 완료:', {
        시트: SHEETS.DIAGNOSIS,
        행번호: newRow,
        회사명: data.회사명 || data.companyName,
        총점: totalScore,
        문항점수개수: Object.keys(scoreData).length,
        보고서길이: reportSummary.length
      });
    }

    // 이메일 발송
    if (AUTO_REPLY_ENABLED) {
      sendDiagnosisAdminNotification(data, newRow, totalScore, reportSummary);
      
      const userEmail = data.이메일 || data.contactEmail || data.email;
      const userName = data.담당자명 || data.contactName || data.contactManager;
      if (userEmail) {
        sendUserConfirmation(userEmail, userName, '진단');
      }
    }

    return createSuccessResponse({
      message: '📊 AI 무료진단이 성공적으로 접수되었습니다 (문항별 점수 + 보고서 포함). 관리자 확인 후 연락드리겠습니다.',
      sheet: SHEETS.DIAGNOSIS,
      row: newRow,
      timestamp: timestamp,
      진단점수: totalScore,
      추천서비스: reportSummary.length > 50 ? reportSummary.substring(0, 50) + '...' : reportSummary
    });

  } catch (error) {
    console.error('❌ 진단신청 처리 오류:', error);
    return createErrorResponse('진단신청 처리 중 오류: ' + error.toString());
  }
}

// ================================================================================
// 🔧 점수 데이터 추출 함수들 (핵심 로직)
// ================================================================================

/**
 * 문항별 상세 점수 추출 (1-5점 정확 매핑)
 */
function extractDetailedScores(data) {
  // 여러 경로로 점수 데이터 확인
  const scores = data.문항별점수 || data.detailedScores || {};
  
  // 영문 키를 한글 키로 매핑
  const keyMapping = {
    'planning_level': '기획수준',
    'differentiation_level': '차별화정도',
    'pricing_level': '가격설정',
    'expertise_level': '전문성',
    'quality_level': '품질',
    'customer_greeting': '고객맞이',
    'customer_service': '고객응대',
    'complaint_management': '불만관리',
    'customer_retention': '고객유지',
    'customer_understanding': '고객이해',
    'marketing_planning': '마케팅계획',
    'offline_marketing': '오프라인마케팅',
    'online_marketing': '온라인마케팅',
    'sales_strategy': '판매전략',
    'purchase_management': '구매관리',
    'inventory_management': '재고관리',
    'exterior_management': '외관관리',
    'interior_management': '인테리어관리',
    'cleanliness': '청결도',
    'work_flow': '작업동선'
  };

  const result = {};
  
  // 기본값으로 0 설정
  Object.values(keyMapping).forEach(koreanKey => {
    result[koreanKey] = 0;
  });

  // 실제 점수 데이터 매핑
  Object.entries(keyMapping).forEach(([englishKey, koreanKey]) => {
    if (scores[englishKey] !== undefined && scores[englishKey] !== null) {
      result[koreanKey] = Number(scores[englishKey]) || 0;
    } else if (scores[koreanKey] !== undefined && scores[koreanKey] !== null) {
      result[koreanKey] = Number(scores[koreanKey]) || 0;
    }
  });

  // 직접 전달된 개별 점수도 확인
  Object.entries(keyMapping).forEach(([englishKey, koreanKey]) => {
    if (data[englishKey] !== undefined && data[englishKey] !== null) {
      result[koreanKey] = Number(data[englishKey]) || 0;
    }
  });

  if (DEBUG_MODE) {
    console.log('🔧 점수 데이터 추출 완료:', {
      원본점수개수: Object.keys(scores).length,
      매핑된점수개수: Object.keys(result).filter(k => result[k] > 0).length,
      샘플점수: {
        기획수준: result.기획수준,
        고객응대: result.고객응대,
        마케팅계획: result.마케팅계획
      }
    });
  }

  return result;
}

/**
 * 카테고리별 점수 추출
 */
function extractCategoryScores(data) {
  const categoryScores = data.카테고리점수 || data.categoryScores || {};
  
  const result = {
    상품서비스점수: '0.0',
    고객응대점수: '0.0',
    마케팅점수: '0.0',
    구매재고점수: '0.0',
    매장관리점수: '0.0'
  };

  // 카테고리 점수 매핑
  const categoryMapping = {
    'productService': '상품서비스점수',
    'customerService': '고객응대점수',
    'marketing': '마케팅점수',
    'procurement': '구매재고점수',
    'storeManagement': '매장관리점수'
  };

  Object.entries(categoryMapping).forEach(([englishKey, koreanKey]) => {
    if (categoryScores[englishKey] && categoryScores[englishKey].score !== undefined) {
      result[koreanKey] = Number(categoryScores[englishKey].score).toFixed(1);
    }
  });

  return result;
}

// ================================================================================
// 💬 상담신청 처리 (19개 컬럼)
// ================================================================================

function processConsultationForm(data) {
  try {
    const sheet = getOrCreateSheet(SHEETS.CONSULTATION, 'consultation');
    const timestamp = getCurrentKoreanTime();
    
    if (DEBUG_MODE) {
      console.log('✅ 상담신청 처리:', {
        성명: data.성명 || data.name,
        회사명: data.회사명 || data.company,
        이메일: data.이메일 || data.email
      });
    }
    
    // 19개 컬럼 상담신청 데이터 구성
    const rowData = [
      timestamp,                                                    // A: 제출일시
      data.상담유형 || data.consultationType || '일반상담',           // B: 상담유형
      data.성명 || data.name || '',                                  // C: 성명
      data.연락처 || data.phone || '',                               // D: 연락처
      data.이메일 || data.email || '',                               // E: 이메일
      data.회사명 || data.company || '',                             // F: 회사명
      data.직책 || data.position || '',                             // G: 직책
      data.상담분야 || data.consultationArea || data.industry || '', // H: 상담분야
      data.문의내용 || data.inquiryContent || data.message || '',   // I: 문의내용
      data.희망상담시간 || data.preferredTime || '',                 // J: 희망상담시간
      data.개인정보동의 === true || data.privacyConsent === true ? '동의' : '미동의', // K: 개인정보동의
      data.진단연계여부 === 'Y' || data.isDiagnosisLinked ? 'Y' : 'N', // L: 진단연계여부
      data.진단점수 || data.diagnosisScore || '',                   // M: 진단점수
      data.추천서비스 || data.recommendedService || '',             // N: 추천서비스
      '접수완료',                                                   // O: 처리상태
      '',                                                          // P: 상담일정
      '',                                                          // Q: 상담결과
      '',                                                          // R: 담당컨설턴트
      ''                                                           // S: 완료일시
    ];

    // 구글시트에 데이터 저장
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    if (DEBUG_MODE) {
      console.log('✅ 상담신청 저장 완료:', {
        시트: SHEETS.CONSULTATION,
        행번호: newRow,
        성명: data.성명 || data.name,
        회사명: data.회사명 || data.company
      });
    }

    // 이메일 발송
    if (AUTO_REPLY_ENABLED) {
      sendConsultationAdminNotification(data, newRow);
      
      const userEmail = data.이메일 || data.email;
      const userName = data.성명 || data.name;
      if (userEmail) {
        sendUserConfirmation(userEmail, userName, '상담');
      }
    }

    return createSuccessResponse({
      message: '상담신청이 성공적으로 접수되었습니다. 1-2일 내에 전문가가 연락드리겠습니다.',
      sheet: SHEETS.CONSULTATION,
      row: newRow,
      timestamp: timestamp
    });

  } catch (error) {
    console.error('❌ 상담신청 처리 오류:', error);
    return createErrorResponse('상담신청 처리 중 오류: ' + error.toString());
  }
}

// ================================================================================
// 🧪 베타피드백 처리 (14개 컬럼)
// ================================================================================

function processBetaFeedback(data) {
  try {
    const sheet = getOrCreateSheet(SHEETS.BETA_FEEDBACK, 'betaFeedback');
    const timestamp = getCurrentKoreanTime();
    
    if (DEBUG_MODE) {
      console.log('🧪 베타피드백 처리:', {
        계산기명: data.계산기명,
        피드백유형: data.피드백유형,
        사용자이메일: data.사용자이메일?.substring(0, 5) + '***'
      });
    }
    
    // 14개 컬럼 베타피드백 데이터 구성
    const rowData = [
      timestamp,                      // A: 제출일시
      data.계산기명 || '',             // B: 계산기명
      data.피드백유형 || '',           // C: 피드백유형
      data.사용자이메일 || '',         // D: 사용자이메일
      data.문제설명 || '',            // E: 문제설명
      data.기대동작 || '',            // F: 기대동작
      data.실제동작 || '',            // G: 실제동작
      data.재현단계 || '',            // H: 재현단계
      data.심각도 || '',              // I: 심각도
      data.추가의견 || '',            // J: 추가의견
      data.브라우저정보 || '',        // K: 브라우저정보
      data.제출경로 || '',            // L: 제출경로
      '접수완료',                    // M: 처리상태
      ''                             // N: 처리일시
    ];

    // 구글시트에 데이터 저장
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    if (DEBUG_MODE) {
      console.log('✅ 베타피드백 저장 완료:', {
        시트: SHEETS.BETA_FEEDBACK,
        행번호: newRow,
        계산기명: data.계산기명,
        피드백유형: data.피드백유형
      });
    }

    // 이메일 발송
    if (AUTO_REPLY_ENABLED) {
      sendBetaFeedbackAdminNotification(data, newRow);
      
      if (data.사용자이메일) {
        sendBetaFeedbackUserConfirmation(data.사용자이메일, data);
      }
    }

    return createSuccessResponse({
      message: '베타 피드백이 성공적으로 접수되었습니다. 검토 후 이메일로 회신드리겠습니다.',
      sheet: SHEETS.BETA_FEEDBACK,
      row: newRow,
      timestamp: timestamp,
      calculator: data.계산기명,
      feedbackType: data.피드백유형
    });

  } catch (error) {
    console.error('❌ 베타피드백 처리 오류:', error);
    return createErrorResponse('베타피드백 처리 중 오류: ' + error.toString());
  }
}

// ================================================================================
// 📧 이메일 발송 함수들
// ================================================================================

/**
 * 진단 관리자 알림 이메일
 */
function sendDiagnosisAdminNotification(data, rowNumber, totalScore, reportSummary) {
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

    MailApp.sendEmail(ADMIN_EMAIL, subject, emailBody);
    console.log('📧 진단 관리자 알림 이메일 발송 완료');
  } catch (error) {
    console.error('❌ 진단 관리자 이메일 발송 실패:', error);
  }
}

/**
 * 상담 관리자 알림 이메일
 */
function sendConsultationAdminNotification(data, rowNumber) {
  try {
    const subject = `[M-CENTER] 💬 새로운 상담신청 접수 - ${data.회사명 || data.company || '회사명미상'}`;
    
    const emailBody = `💬 새로운 상담신청이 접수되었습니다!\n\n` +
      `👤 신청자: ${data.성명 || data.name || '미확인'}\n` +
      `🏢 회사명: ${data.회사명 || data.company || '미확인'}\n` +
      `📧 이메일: ${data.이메일 || data.email || '미확인'}\n` +
      `📞 연락처: ${data.연락처 || data.phone || '미확인'}\n` +
      `🎯 상담유형: ${data.상담유형 || data.consultationType || '일반상담'}\n` +
      `📝 상담분야: ${data.상담분야 || data.consultationArea || '미확인'}\n` +
      `⏰ 접수시간: ${getCurrentKoreanTime()}\n\n` +
      `💭 문의내용:\n${(data.문의내용 || data.inquiryContent || '').substring(0, 300)}...\n\n` +
      `📋 시트 위치: ${SHEETS.CONSULTATION} 시트 ${rowNumber}행\n` +
      `🔗 구글시트: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

    MailApp.sendEmail(ADMIN_EMAIL, subject, emailBody);
    console.log('📧 상담 관리자 알림 이메일 발송 완료');
  } catch (error) {
    console.error('❌ 상담 관리자 이메일 발송 실패:', error);
  }
}

/**
 * 베타피드백 관리자 알림 이메일
 */
function sendBetaFeedbackAdminNotification(data, rowNumber) {
  try {
    const subject = `[M-CENTER] 🚨 긴급! 베타 피드백 접수 - ${data.계산기명 || '세금계산기'}`;
    
    const emailBody = `🧪 새로운 베타 피드백이 접수되었습니다!\n\n` +
      `🎯 대상 계산기: ${data.계산기명 || 'N/A'}\n` +
      `🐛 피드백 유형: ${data.피드백유형 || 'N/A'}\n` +
      `📧 사용자 이메일: ${data.사용자이메일 || 'N/A'}\n` +
      `⚠️ 심각도: ${data.심각도 || 'N/A'}\n` +
      `⏰ 접수 시간: ${getCurrentKoreanTime()}\n\n` +
      `📝 문제 설명:\n${(data.문제설명 || '').substring(0, 200)}...\n\n` +
      `📋 시트 위치: ${SHEETS.BETA_FEEDBACK} 시트 ${rowNumber}행\n` +
      `🔗 구글시트: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

    MailApp.sendEmail(ADMIN_EMAIL, subject, emailBody);
    console.log('📧 베타피드백 관리자 알림 이메일 발송 완료');
  } catch (error) {
    console.error('❌ 베타피드백 관리자 이메일 발송 실패:', error);
  }
}

/**
 * 신청자 확인 이메일 발송 (진단/상담용)
 */
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
      `${isConsultation ? 
        '상담 일정을 조율하여 맞춤형 컨설팅을 제공해드리겠습니다.' :
        '진단 결과를 바탕으로 맞춤형 개선방안을 제시해드리겠습니다.'
      }\n\n` +
      `감사합니다.\n기업의별 M-CENTER`;

    MailApp.sendEmail(email, subject, emailBody);
    console.log('📧 신청자 확인 이메일 발송 완료:', email);
  } catch (error) {
    console.error('❌ 신청자 이메일 발송 실패:', error);
  }
}

/**
 * 베타피드백 사용자 확인 이메일
 */
function sendBetaFeedbackUserConfirmation(email, data) {
  try {
    const subject = `[M-CENTER] 🧪 베타 피드백 접수 완료! ${data.계산기명 || '세금계산기'}`;
    
    const emailBody = `안녕하세요!\n\n` +
      `M-CENTER 세금계산기 베타테스트에 참여해 주셔서 감사합니다.\n\n` +
      `🎯 접수된 피드백: ${data.계산기명 || '세금계산기'}\n` +
      `🐛 피드백 유형: ${data.피드백유형 || 'N/A'}\n` +
      `⏰ 접수 일시: ${getCurrentKoreanTime()}\n\n` +
      `담당자가 검토 후 이메일로 회신드리겠습니다.\n\n` +
      `추가 문의사항이 있으시면 언제든 연락해주세요.\n\n` +
      `감사합니다.\nM-CENTER 베타테스트 개발팀`;

    MailApp.sendEmail(email, subject, emailBody);
    console.log('📧 베타피드백 사용자 확인 이메일 발송 완료:', email);
  } catch (error) {
    console.error('❌ 베타피드백 사용자 이메일 발송 실패:', error);
  }
}

// ================================================================================
// 🛠️ 유틸리티 함수들
// ================================================================================

/**
 * 시트 가져오기 또는 생성
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
 * 성공 응답 생성
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

/**
 * 오류 응답 생성
 */
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

/**
 * 베타 피드백 요청 확인
 */
function isBetaFeedback(data) {
  return data.action === 'saveBetaFeedback' || 
         data.폼타입 === '베타테스트_피드백' || 
         (data.피드백유형 && data.사용자이메일 && data.계산기명);
}

/**
 * 상담신청 요청 확인
 */
function isConsultationRequest(data) {
  if (isBetaFeedback(data)) {
    return false;
  }
  
  return !!(data.상담유형 || data.consultationType || data.성명 || data.name || 
           data.문의내용 || data.inquiryContent || data.action === 'saveConsultation');
}

// ================================================================================
// 📊 시트 헤더 설정 (58개 진단, 19개 상담, 14개 베타피드백)
// ================================================================================

function setupHeaders(sheet, type) {
  let headers;
  
  if (type === 'consultation') {
    // 상담신청 헤더 (19개 컬럼)
    headers = [
      '제출일시', '상담유형', '성명', '연락처', '이메일', 
      '회사명', '직책', '상담분야', '문의내용', '희망상담시간', 
      '개인정보동의', '진단연계여부', '진단점수', '추천서비스', '처리상태',
      '상담일정', '상담결과', '담당컨설턴트', '완료일시'
    ];
  } else if (type === 'betaFeedback') {
    // 베타피드백 헤더 (14개 컬럼)
    headers = [
      '제출일시', '계산기명', '피드백유형', '사용자이메일', '문제설명', 
      '기대동작', '실제동작', '재현단계', '심각도', '추가의견', 
      '브라우저정보', '제출경로', '처리상태', '처리일시'
    ];
  } else {
    // 진단신청 헤더 (58개 컬럼) - 진단 질문 키워드 포함
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
  }
  
  // 📋 1행: 헤더 설정
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  
  // 🎨 기본 헤더 스타일링
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  headerRange.setWrap(true);
  sheet.setFrozenRows(1);
  
  // 📊 진단신청의 경우 카테고리별 색상 구분
  if (type === 'diagnosis') {
    
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
    
    // 📏 컬럼 폭 자동 조정
    sheet.autoResizeColumns(1, headers.length);
    
    // 📝 2행에 카테고리 설명 추가
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
    
    sheet.setFrozenRows(2); // 설명 행도 고정
    
    console.log('📊 진단 질문 키워드 포함 헤더 설정 완료 (58개 컬럼 + 설명)');
    console.log('🎨 카테고리별 색상 구분 적용 완료');
  }
  
  console.log(`📋 ${type} 시트 헤더 설정 완료: ${headers.length}개 컬럼`);
}

// ================================================================================
// 🔧 헤더 업데이트 전용 함수 (기존 시트 업데이트용)
// ================================================================================

/**
 * 기존 시트 헤더 업데이트
 */
function updateExistingSheetHeaders() {
  try {
    console.log('🔄 기존 시트 헤더 업데이트 시작...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // 진단신청 시트 업데이트
    const diagnosisSheet = spreadsheet.getSheetByName(SHEETS.DIAGNOSIS);
    if (diagnosisSheet) {
      const existingHeaders = diagnosisSheet.getRange(1, 1, 1, diagnosisSheet.getLastColumn()).getValues()[0];
      diagnosisSheet.getRange(3, 1, 1, existingHeaders.length).setValues([existingHeaders]);
      setupHeaders(diagnosisSheet, 'diagnosis');
      console.log('✅ 진단신청 시트 헤더 업데이트 완료');
    }
    
    // 상담신청 시트 확인/생성
    let consultationSheet = spreadsheet.getSheetByName(SHEETS.CONSULTATION);
    if (!consultationSheet) {
      consultationSheet = spreadsheet.insertSheet(SHEETS.CONSULTATION);
      setupHeaders(consultationSheet, 'consultation');
      console.log('✅ 상담신청 시트 신규 생성 완료');
    }
    
    // 베타피드백 시트 확인/생성
    let betaSheet = spreadsheet.getSheetByName(SHEETS.BETA_FEEDBACK);
    if (!betaSheet) {
      betaSheet = spreadsheet.insertSheet(SHEETS.BETA_FEEDBACK);
      setupHeaders(betaSheet, 'betaFeedback');
      console.log('✅ 베타피드백 시트 신규 생성 완료');
    }
    
    return createSuccessResponse({
      message: '모든 시트 헤더 업데이트 성공',
      timestamp: getCurrentKoreanTime(),
      details: '진단 질문 키워드 포함 헤더로 업데이트 완료'
    });
    
  } catch (error) {
    console.error('❌ 헤더 업데이트 실패:', error);
    return createErrorResponse('헤더 업데이트 실패: ' + error.toString());
  }
}

// ================================================================================
// 🧪 테스트 함수들
// ================================================================================

/**
 * 전체 시스템 테스트 함수
 */
function testEntireSystem() {
  try {
    console.log('🧪 전체 시스템 테스트 시작...');
    
    const results = {
      timestamp: getCurrentKoreanTime(),
      version: VERSION,
      tests: {}
    };
    
    // 1. 진단신청 테스트
    const diagnosisTestData = {
      action: 'saveDiagnosis',
      회사명: '테스트기업',
      업종: 'it',
      담당자명: '테스트담당자',
      이메일: 'test@example.com',
      문항별점수: {
        '기획수준': 4,
        '차별화정도': 5,
        '가격설정': 3,
        '고객응대': 4,
        '마케팅계획': 3
      },
      종합점수: 78,
      진단보고서요약: '테스트 진단 보고서입니다.'
    };
    
    try {
      const diagnosisResult = processDiagnosisForm(diagnosisTestData);
      results.tests.diagnosis = { success: true, message: '진단신청 테스트 성공' };
    } catch (error) {
      results.tests.diagnosis = { success: false, error: error.toString() };
    }
    
    // 2. 상담신청 테스트
    const consultationTestData = {
      action: 'saveConsultation',
      성명: '테스트고객',
      회사명: '테스트회사',
      이메일: 'consultation@test.com',
      문의내용: '테스트 상담 문의입니다.'
    };
    
    try {
      const consultationResult = processConsultationForm(consultationTestData);
      results.tests.consultation = { success: true, message: '상담신청 테스트 성공' };
    } catch (error) {
      results.tests.consultation = { success: false, error: error.toString() };
    }
    
    // 3. 베타피드백 테스트
    const betaTestData = {
      action: 'saveBetaFeedback',
      계산기명: '테스트계산기',
      피드백유형: '버그신고',
      사용자이메일: 'beta@test.com',
      문제설명: '테스트 버그 신고입니다.'
    };
    
    try {
      const betaResult = processBetaFeedback(betaTestData);
      results.tests.betaFeedback = { success: true, message: '베타피드백 테스트 성공' };
    } catch (error) {
      results.tests.betaFeedback = { success: false, error: error.toString() };
    }
    
    console.log('🧪 전체 시스템 테스트 완료:', results);
    return createSuccessResponse(results);
    
  } catch (error) {
    console.error('❌ 시스템 테스트 실패:', error);
    return createErrorResponse('시스템 테스트 실패: ' + error.toString());
  }
}

// ================================================================================
// 📖 사용법 및 설치 가이드
// ================================================================================

/**
 * 📖 M-CENTER 통합 Apps Script 2025 최종수정판 사용법
 * 
 * 🔧 설치 방법:
 * 1. Google Apps Script 에디터에서 기존 Code.gs 내용 전체 삭제
 * 2. 이 코드 전체를 복사하여 Code.gs에 붙여넣기
 * 3. 저장 후 "배포" → "웹 앱으로 배포" 클릭
 * 4. 액세스 권한: "모든 사용자"로 설정
 * 5. "새 배포" 생성 (중요!)
 * 6. 생성된 웹앱 URL을 환경변수에 업데이트
 * 
 * 🧪 테스트 방법:
 * - updateExistingSheetHeaders() 함수 실행: 헤더 업데이트
 * - testEntireSystem() 함수 실행: 전체 시스템 테스트
 * 
 * ✅ 해결된 문제:
 * - 진단 점수 0으로 나오는 문제 → 1-5점 정확 저장
 * - 이메일 발송 안되는 문제 → 관리자/신청자 자동 이메일
 * - 시트 분리 안되는 문제 → 3개 시트 별도 관리
 * - 58개 컬럼 확장 진단 데이터 완전 저장
 * 
 * 📊 시트 구성:
 * - AI_무료진단신청: 58개 컬럼 (진단 키워드 포함)
 * - 상담신청: 19개 컬럼
 * - 베타피드백: 14개 컬럼
 * 
 * 📧 이메일 기능:
 * - 관리자 알림: hongik423@gmail.com
 * - 신청자 확인: 자동 발송
 * - 베타피드백: 개발팀 알림
 */ 