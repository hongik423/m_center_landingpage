/**
 * ================================================================================
 * M-CENTER 완전한 통합 Apps Script (브라우저 오류 해결 버전)
 * ================================================================================
 * 
 * 🔧 해결사항:
 * ✅ AddEventListenerOptions 오류 해결
 * ✅ 완전한 Google Apps Script 환경설정 포함
 * ✅ 진단 질문 키워드 헤더 시스템 포함
 * ✅ 48개 컬럼 확장 진단 시스템 포함
 */

// ================================================================================
// 🔧 Google Apps Script 기본 설정
// ================================================================================

const SPREADSHEET_ID = '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug';

const SHEETS = {
  DIAGNOSIS: 'AI무료진단신청',
  CONSULTATION: '상담신청', 
  BETA_FEEDBACK: '베타피드백'
};

const ADMIN_EMAIL = 'hongik423@gmail.com';

// ================================================================================
// 📧 이메일 설정
// ================================================================================

const EMAIL_CONFIG = {
  ADMIN_EMAIL: 'hongik423@gmail.com',
  FROM_NAME: 'M-CENTER 통합관리시스템',
  DIAGNOSIS_SUBJECT: '[M-CENTER] 새로운 AI 무료진단 신청 알림',
  CONSULTATION_SUBJECT: '[M-CENTER] 새로운 상담 신청 알림',
  BETA_FEEDBACK_SUBJECT: '[M-CENTER] 베타 피드백 신청 알림'
};

// ================================================================================
// 📊 메인 진입점 함수 (웹앱 요청 처리)
// ================================================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || '알 수 없는 요청';
    
    console.log(`📋 요청 처리 시작: ${action}`);
    console.log('📥 받은 데이터:', JSON.stringify(data, null, 2));
    
    switch (action) {
      case 'saveDiagnosis':
        return handleDiagnosisRequest(data);
      case 'saveConsultation':
        return handleConsultationRequest(data);
      case 'saveBetaFeedback':
        return handleBetaFeedbackRequest(data);
      default:
        throw new Error(`지원하지 않는 액션: ${action}`);
    }
    
  } catch (error) {
    console.error('❌ POST 요청 처리 실패:', error);
    return createResponse(false, '요청 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action || 'test';
    
    if (action === 'test') {
      return createResponse(true, 'Google Apps Script가 정상 작동 중입니다.');
    }
    
    return createResponse(false, 'GET 요청은 지원하지 않습니다.');
    
  } catch (error) {
    console.error('❌ GET 요청 처리 실패:', error);
    return createResponse(false, 'GET 요청 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// ================================================================================
// 📊 진단 신청 처리 (확장된 48개 컬럼 지원)
// ================================================================================

function handleDiagnosisRequest(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let diagnosisSheet = spreadsheet.getSheetByName(SHEETS.DIAGNOSIS);
    
    // 시트가 없으면 생성
    if (!diagnosisSheet) {
      diagnosisSheet = spreadsheet.insertSheet(SHEETS.DIAGNOSIS);
      setupHeaders(diagnosisSheet, 'diagnosisEnhanced');
      console.log('📋 새로운 진단 시트 생성 및 헤더 설정 완료');
    }
    
    // 헤더가 없거나 부족하면 설정
    const lastColumn = diagnosisSheet.getLastColumn();
    if (lastColumn < 48) {
      setupHeaders(diagnosisSheet, 'diagnosisEnhanced');
      console.log('📋 기존 시트 헤더 업데이트 완료');
    }
    
    // 📊 확장된 진단 데이터 준비 (48개 컬럼)
    const rowData = [
      // 🔵 기본 정보 (A-R: 18개)
      data.제출일시 || new Date().toLocaleString('ko-KR'),
      data.회사명 || data.companyName || '',
      data.업종 || data.industry || '',
      data.사업담당자 || data.businessManager || '',
      data.직원수 || data.employeeCount || '',
      data.사업성장단계 || data.businessStage || '',
      data.주요고민사항 || data.mainConcerns || '',
      data.예상혜택 || data.expectedBenefits || '',
      data.진행사업장 || data.businessLocation || '',
      data.담당자명 || data.contactManager || '',
      data.연락처 || data.phone || '',
      data.이메일 || data.email || '',
      data.개인정보동의 || data.privacyConsent || false,
      data.폼타입 || 'AI_무료진단_확장된레벨업시트',
      '처리대기',
      data.AI분석결과 || '',
      data.결과URL || '',
      '',
      
      // 🟢 진단 결과 (S-X: 6개)
      data.총점 || 0,
      data.상품서비스점수 || 0,
      data.고객응대점수 || 0,
      data.마케팅점수 || 0,
      data.구매재고점수 || 0,
      data.매장관리점수 || 0,
      
      // 🔶 상품/서비스 관리 역량 (Y-AC: 5개)
      data.기획수준 || data.planning_level || 0,
      data.차별화정도 || data.differentiation_level || 0,
      data.가격설정 || data.pricing_level || 0,
      data.전문성 || data.expertise_level || 0,
      data.품질 || data.quality_level || 0,
      
      // 🔷 고객응대 역량 (AD-AG: 4개)
      data.고객맞이 || data.customer_greeting || 0,
      data.고객응대 || data.customer_service || 0,
      data.불만관리 || data.complaint_management || 0,
      data.고객유지 || data.customer_retention || 0,
      
      // 🔸 마케팅 역량 (AH-AL: 5개)
      data.고객이해 || data.customer_understanding || 0,
      data.마케팅계획 || data.marketing_planning || 0,
      data.오프라인마케팅 || data.offline_marketing || 0,
      data.온라인마케팅 || data.online_marketing || 0,
      data.판매전략 || data.sales_strategy || 0,
      
      // 🔹 구매/재고관리 (AM-AN: 2개)
      data.구매관리 || data.purchase_management || 0,
      data.재고관리 || data.inventory_management || 0,
      
      // 🔺 매장관리 역량 (AO-AR: 4개)
      data.외관관리 || data.exterior_management || 0,
      data.인테리어관리 || data.interior_management || 0,
      data.청결도 || data.cleanliness || 0,
      data.작업동선 || data.work_flow || 0,
      
      // 🟣 보고서 정보 (AS-AV: 4개)
      data.보고서글자수 || data.보고서길이 || 0,
      data.추천서비스목록 || data.추천서비스 || '',
      data.보고서요약 || '',
      data.보고서전문 || data.보고서 || ''
    ];
    
    // 시트에 데이터 추가
    const nextRow = diagnosisSheet.getLastRow() + 1;
    diagnosisSheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    // 📧 관리자 이메일 발송
    const emailBody = createDiagnosisEmailBody(data);
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: EMAIL_CONFIG.DIAGNOSIS_SUBJECT,
      htmlBody: emailBody
    });
    
    console.log('✅ 확장된 진단 신청 처리 완료');
    console.log(`📊 총 ${rowData.length}개 컬럼 데이터 저장`);
    
    return createResponse(true, '📊 AI 무료진단이 완료되었습니다 (문항별 점수 + 보고서 포함). 관리자 확인 후 연락드리겠습니다.', {
      진단점수: data.총점 || 0,
      추천서비스: data.추천서비스 || ''
    });
    
  } catch (error) {
    console.error('❌ 진단 신청 처리 실패:', error);
    return createResponse(false, '진단 신청 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// ================================================================================
// 📊 시트 헤더 설정 (진단 질문 키워드 포함)
// ================================================================================

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
      '보고서전문 (2000자 미만)'
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
  headerRange.setWrap(true);
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
    
    console.log('📊 진단 질문 키워드 포함 헤더 설정 완료 (48개 컬럼)');
    console.log('🎨 카테고리별 색상 구분 적용 완료');
  }
  
  console.log(`📋 ${type} 시트 헤더 설정 완료: ${headers.length}개 컬럼`);
}

// ================================================================================
// 📧 상담 신청 처리
// ================================================================================

function handleConsultationRequest(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let consultationSheet = spreadsheet.getSheetByName(SHEETS.CONSULTATION);
    
    if (!consultationSheet) {
      consultationSheet = spreadsheet.insertSheet(SHEETS.CONSULTATION);
      setupHeaders(consultationSheet, 'consultation');
    }
    
    const rowData = [
      new Date().toLocaleString('ko-KR'),
      data.consultationType || '',
      data.name || '',
      data.phone || '',
      data.email || '',
      data.companyName || '',
      data.position || '',
      data.consultationField || '',
      data.inquiryContent || '',
      data.preferredTime || '',
      data.privacyConsent || false,
      data.diagnosisLinked || false,
      data.diagnosisScore || '',
      data.recommendedServices || '',
      '처리대기'
    ];
    
    const nextRow = consultationSheet.getLastRow() + 1;
    consultationSheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    const emailBody = createConsultationEmailBody(data);
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: EMAIL_CONFIG.CONSULTATION_SUBJECT,
      htmlBody: emailBody
    });
    
    console.log('✅ 상담 신청 처리 완료');
    
    return createResponse(true, '상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
    
  } catch (error) {
    console.error('❌ 상담 신청 처리 실패:', error);
    return createResponse(false, '상담 신청 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// ================================================================================
// 📧 베타 피드백 처리
// ================================================================================

function handleBetaFeedbackRequest(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let betaSheet = spreadsheet.getSheetByName(SHEETS.BETA_FEEDBACK);
    
    if (!betaSheet) {
      betaSheet = spreadsheet.insertSheet(SHEETS.BETA_FEEDBACK);
      setupHeaders(betaSheet, 'betaFeedback');
    }
    
    const rowData = [
      new Date().toLocaleString('ko-KR'),
      data.calculatorName || '',
      data.feedbackType || '',
      data.userEmail || '',
      data.problemDescription || '',
      data.expectedBehavior || '',
      data.actualBehavior || '',
      data.stepsToReproduce || '',
      data.severity || '',
      data.additionalComments || '',
      data.browserInfo || '',
      data.submitPath || '',
      '처리대기',
      ''
    ];
    
    const nextRow = betaSheet.getLastRow() + 1;
    betaSheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    const emailBody = createBetaFeedbackEmailBody(data);
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: EMAIL_CONFIG.BETA_FEEDBACK_SUBJECT,
      htmlBody: emailBody
    });
    
    console.log('✅ 베타 피드백 처리 완료');
    
    return createResponse(true, '베타 피드백이 성공적으로 접수되었습니다. 소중한 의견 감사합니다!');
    
  } catch (error) {
    console.error('❌ 베타 피드백 처리 실패:', error);
    return createResponse(false, '베타 피드백 처리 중 오류가 발생했습니다: ' + error.toString());
  }
}

// ================================================================================
// 📧 이메일 본문 생성 함수들
// ================================================================================

function createDiagnosisEmailBody(data) {
  return `
    <h2>🏢 새로운 AI 무료진단 신청</h2>
    <h3>📋 기본 정보</h3>
    <ul>
      <li><strong>회사명:</strong> ${data.회사명 || data.companyName || ''}</li>
      <li><strong>담당자:</strong> ${data.담당자명 || data.contactManager || ''}</li>
      <li><strong>연락처:</strong> ${data.연락처 || data.phone || ''}</li>
      <li><strong>이메일:</strong> ${data.이메일 || data.email || ''}</li>
      <li><strong>업종:</strong> ${data.업종 || data.industry || ''}</li>
      <li><strong>직원수:</strong> ${data.직원수 || data.employeeCount || ''}</li>
    </ul>
    
    <h3>📊 진단 결과</h3>
    <ul>
      <li><strong>총점:</strong> ${data.총점 || 0}점 (100점 만점)</li>
      <li><strong>추천서비스:</strong> ${data.추천서비스 || '없음'}</li>
      <li><strong>보고서 길이:</strong> ${data.보고서길이 || 0}자</li>
    </ul>
    
    <h3>🎯 주요 고민사항</h3>
    <p>${data.주요고민사항 || data.mainConcerns || '없음'}</p>
    
    <h3>💼 기대 혜택</h3>
    <p>${data.예상혜택 || data.expectedBenefits || '없음'}</p>
    
    <p><strong>제출일시:</strong> ${data.제출일시 || new Date().toLocaleString('ko-KR')}</p>
  `;
}

function createConsultationEmailBody(data) {
  return `
    <h2>💼 새로운 상담 신청</h2>
    <ul>
      <li><strong>상담유형:</strong> ${data.consultationType || ''}</li>
      <li><strong>성명:</strong> ${data.name || ''}</li>
      <li><strong>연락처:</strong> ${data.phone || ''}</li>
      <li><strong>이메일:</strong> ${data.email || ''}</li>
      <li><strong>회사명:</strong> ${data.companyName || ''}</li>
      <li><strong>직책:</strong> ${data.position || ''}</li>
      <li><strong>상담분야:</strong> ${data.consultationField || ''}</li>
      <li><strong>희망상담시간:</strong> ${data.preferredTime || ''}</li>
    </ul>
    
    <h3>📝 문의내용</h3>
    <p>${data.inquiryContent || ''}</p>
    
    <p><strong>제출일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
  `;
}

function createBetaFeedbackEmailBody(data) {
  return `
    <h2>🧪 새로운 베타 피드백</h2>
    <ul>
      <li><strong>계산기명:</strong> ${data.calculatorName || ''}</li>
      <li><strong>피드백유형:</strong> ${data.feedbackType || ''}</li>
      <li><strong>사용자이메일:</strong> ${data.userEmail || ''}</li>
      <li><strong>심각도:</strong> ${data.severity || ''}</li>
    </ul>
    
    <h3>🔍 문제설명</h3>
    <p>${data.problemDescription || ''}</p>
    
    <h3>🎯 기대동작</h3>
    <p>${data.expectedBehavior || ''}</p>
    
    <h3>⚠️ 실제동작</h3>
    <p>${data.actualBehavior || ''}</p>
    
    <h3>🔄 재현단계</h3>
    <p>${data.stepsToReproduce || ''}</p>
    
    <h3>💬 추가의견</h3>
    <p>${data.additionalComments || ''}</p>
    
    <p><strong>브라우저 정보:</strong> ${data.browserInfo || ''}</p>
    <p><strong>제출일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
  `;
}

// ================================================================================
// 🔧 유틸리티 함수들
// ================================================================================

function createResponse(success, message, data = {}) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toLocaleString('ko-KR'),
    ...data
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================================================================================
// 🧪 테스트 함수들
// ================================================================================

function testDiagnosisSystem() {
  const testData = {
    action: 'saveDiagnosis',
    회사명: '테스트회사',
    담당자명: '홍길동',
    연락처: '010-1234-5678',
    이메일: 'test@test.com',
    업종: 'technology',
    직원수: '11-30',
    주요고민사항: '테스트 고민사항',
    예상혜택: '테스트 혜택',
    총점: 85,
    기획수준: 4,
    차별화정도: 4,
    가격설정: 4,
    전문성: 5,
    품질: 4,
    추천서비스: '온라인 마케팅 강화',
    보고서길이: 1500
  };
  
  try {
    const result = handleDiagnosisRequest(testData);
    console.log('✅ 테스트 성공:', result);
    return result;
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    return error.toString();
  }
}

function updateExistingSheetHeaders() {
  try {
    console.log('🔄 기존 시트 헤더 업데이트 시작...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const diagnosisSheet = spreadsheet.getSheetByName(SHEETS.DIAGNOSIS);
    
    if (diagnosisSheet) {
      // 기존 헤더 백업 (3행에 이동)
      const lastColumn = diagnosisSheet.getLastColumn();
      if (lastColumn > 0) {
        const existingHeaders = diagnosisSheet.getRange(1, 1, 1, lastColumn).getValues()[0];
        diagnosisSheet.getRange(3, 1, 1, existingHeaders.length).setValues([existingHeaders]);
      }
      
      // 새로운 헤더 적용
      setupHeaders(diagnosisSheet, 'diagnosisEnhanced');
      
      console.log('✅ 진단 시트 헤더 업데이트 완료');
      console.log('📋 기존 헤더는 3행에 백업됨');
      
      return '헤더 업데이트 성공';
    } else {
      console.log('❌ 진단 시트를 찾을 수 없습니다.');
      return '진단 시트 없음';
    }
    
  } catch (error) {
    console.error('❌ 헤더 업데이트 실패:', error);
    return '헤더 업데이트 실패: ' + error.toString();
  }
}

/**
 * 📖 사용법:
 * 
 * 1. **Google Apps Script 편집기에서 이 전체 코드를 붙여넣기**
 * 2. **웹 앱으로 배포 (모든 사용자가 액세스 가능하도록 설정)**
 * 3. **기존 시트 업데이트**: updateExistingSheetHeaders() 함수 실행
 * 4. **테스트**: testDiagnosisSystem() 함수 실행
 * 
 * 🔧 해결된 문제:
 * - AddEventListenerOptions 오류 완전 제거
 * - 완전한 Google Apps Script 환경 설정
 * - 48개 컬럼 확장 진단 시스템 완전 지원
 * - 카테고리별 색상 구분 시스템
 */ 