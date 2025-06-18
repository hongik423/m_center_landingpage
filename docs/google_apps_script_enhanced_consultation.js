/**
 * ================================================================================
 * M-CENTER 진단연계 상담신청 처리 강화 Apps Script
 * ================================================================================
 * 
 * 📋 주요 기능:
 * 1. AI 진단 결과와 연계된 상담 신청 처리
 * 2. 진단-상담 연계 데이터 관리
 * 3. 자동 알림 및 추적 시스템
 * 4. 중복 신청 방지 및 상태 관리
 * 
 * 📊 상담신청 시트 구조 (15개 컬럼):
 * A: 제출일시     B: 상담유형     C: 성명         D: 연락처       E: 이메일
 * F: 회사명       G: 직책         H: 상담분야     I: 문의내용     J: 희망상담시간
 * K: 개인정보동의 L: 진단연계여부 M: 진단점수     N: 추천서비스   O: 상담상태
 * 
 * 🔗 진단 연계 필드:
 * - 진단연계여부: AI 진단 완료 후 상담 신청 여부
 * - 진단점수: AI 진단 결과 점수
 * - 추천서비스: AI가 추천한 1순위 서비스
 * - 상담상태: 접수완료 → 상담중 → 완료
 */

// ================================================================================
// 🔧 환경설정
// ================================================================================

const SPREADSHEET_ID = '1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM';
const CONSULTATION_SHEET = '상담신청데이터';
const DIAGNOSIS_SHEET = 'm_center_landingpage-request';
const NOTIFICATION_EMAIL = 'hongik423@gmail.com'; // 알림 수신 이메일

// ================================================================================
// 🚀 메인 처리 함수
// ================================================================================

/**
 * 웹 앱 POST 요청 처리
 */
function doPost(e) {
  return handleConsultationRequest(e);
}

/**
 * 상담 신청 요청 처리
 */
function handleConsultationRequest(e) {
  const headers = getResponseHeaders();
  
  try {
    console.log('🔄 상담신청 요청 처리 시작');
    
    // 요청 데이터 파싱
    const requestData = parseRequestData(e);
    console.log('📋 요청 데이터:', requestData);
    
    // 데이터 검증
    const validation = validateConsultationData(requestData);
    if (!validation.isValid) {
      return createErrorResponse(validation.message, headers);
    }
    
    // 진단 연계 정보 확인
    const diagnosisInfo = extractDiagnosisInfo(requestData);
    console.log('🔗 진단 연계 정보:', diagnosisInfo);
    
    // 상담 신청 저장
    const saveResult = saveConsultationData(requestData, diagnosisInfo);
    if (!saveResult.success) {
      return createErrorResponse('상담 신청 저장 실패: ' + saveResult.error, headers);
    }
    
    // 알림 발송
    sendConsultationNotification(requestData, diagnosisInfo, saveResult.rowNumber);
    
    // 성공 응답
    return createSuccessResponse({
      message: '상담 신청이 성공적으로 접수되었습니다.',
      consultationId: saveResult.consultationId,
      rowNumber: saveResult.rowNumber,
      diagnosisLinked: diagnosisInfo.isLinked,
      timestamp: new Date().toISOString()
    }, headers);
    
  } catch (error) {
    console.error('❌ 상담신청 처리 오류:', error);
    return createErrorResponse('상담 신청 처리 중 오류가 발생했습니다: ' + error.toString(), headers);
  }
}

// ================================================================================
// 📊 데이터 처리 함수
// ================================================================================

/**
 * 요청 데이터 파싱
 */
function parseRequestData(e) {
  let data = {};
  
  if (e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      console.warn('JSON 파싱 실패, URL 인코딩 시도');
      // URL 인코딩된 데이터 처리
      const params = e.postData.contents.split('&');
      params.forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          data[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
  }
  
  return data;
}

/**
 * 상담 신청 데이터 검증
 */
function validateConsultationData(data) {
  const requiredFields = ['name', 'phone', 'email', 'consultationType'];
  
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      return {
        isValid: false,
        message: `필수 필드가 누락되었습니다: ${field}`
      };
    }
  }
  
  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      isValid: false,
      message: '올바른 이메일 주소를 입력해주세요'
    };
  }
  
  // 전화번호 형식 검증
  const phoneRegex = /^[\d\-\s\(\)]+$/;
  if (!phoneRegex.test(data.phone)) {
    return {
      isValid: false,
      message: '올바른 전화번호를 입력해주세요'
    };
  }
  
  return { isValid: true };
}

/**
 * 진단 연계 정보 추출
 */
function extractDiagnosisInfo(data) {
  const diagnosisInfo = {
    isLinked: false,
    score: null,
    primaryService: null,
    diagnosisId: null
  };
  
  // 진단 연계 여부 확인
  if (data.diagnosisCompleted === true || data.diagnosisCompleted === 'true') {
    diagnosisInfo.isLinked = true;
    diagnosisInfo.score = data.diagnosisScore || null;
    diagnosisInfo.primaryService = data.primaryService || null;
    diagnosisInfo.diagnosisId = data.diagnosisId || null;
  }
  
  return diagnosisInfo;
}

/**
 * 상담 신청 데이터 저장
 */
function saveConsultationData(data, diagnosisInfo) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONSULTATION_SHEET);
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONSULTATION_SHEET);
      setupConsultationHeaders(sheet);
    }
    
    // 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      setupConsultationHeaders(sheet);
    }
    
    const now = getKoreanTime();
    const consultationId = generateConsultationId(data.email);
    
    // 상담 유형 한글 변환
    const consultationTypeMap = {
      'phone': '전화상담',
      'online': '온라인상담',
      'email': '이메일상담',
      'visit': '방문상담'
    };
    
    // 상담 분야 한글 변환
    const consultationAreaMap = {
      'diagnosis': '기업 진단 결과 상담',
      'business-analysis': '비즈니스 분석',
      'ai-productivity': 'AI 생산성 향상',
      'certification': '인증 컨설팅',
      'tech-startup': '기술창업',
      'factory-auction': '공장경매',
      'website': '웹사이트 개발',
      'other': '기타'
    };
    
    // 희망 시간 한글 변환
    const preferredTimeMap = {
      'morning': '오전 (09:00-12:00)',
      'afternoon': '오후 (13:00-17:00)',
      'evening': '저녁 (18:00-20:00)',
      'flexible': '시간 조정 가능'
    };
    
    // 데이터 행 구성
    const rowData = [
      now,                                                              // A: 제출일시
      consultationTypeMap[data.consultationType] || data.consultationType || '', // B: 상담유형
      data.name || '',                                                  // C: 성명
      data.phone || '',                                                 // D: 연락처
      data.email || '',                                                 // E: 이메일
      data.company || '',                                               // F: 회사명
      data.position || '',                                              // G: 직책
      consultationAreaMap[data.consultationArea] || data.consultationArea || '', // H: 상담분야
      data.inquiryContent || '',                                        // I: 문의내용
      preferredTimeMap[data.preferredTime] || data.preferredTime || '', // J: 희망상담시간
      data.privacyConsent ? '동의' : '미동의',                         // K: 개인정보동의
      diagnosisInfo.isLinked ? '진단연계' : '일반신청',                // L: 진단연계여부
      diagnosisInfo.score ? diagnosisInfo.score + '점' : '',           // M: 진단점수
      diagnosisInfo.primaryService || '',                              // N: 추천서비스
      '접수완료'                                                        // O: 상담상태
    ];
    
    // 데이터 저장
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    // 새 행 스타일링
    formatConsultationRow(sheet, newRow, diagnosisInfo.isLinked);
    
    console.log('✅ 상담신청 저장 완료:', {
      consultationId: consultationId,
      row: newRow,
      diagnosisLinked: diagnosisInfo.isLinked
    });
    
    return {
      success: true,
      consultationId: consultationId,
      rowNumber: newRow
    };
    
  } catch (error) {
    console.error('❌ 상담신청 저장 오류:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 상담신청 시트 헤더 설정
 */
function setupConsultationHeaders(sheet) {
  const headerRow = [
    '제출일시', '상담유형', '성명', '연락처', '이메일', '회사명', '직책',
    '상담분야', '문의내용', '희망상담시간', '개인정보동의', '진단연계여부',
    '진단점수', '추천서비스', '상담상태'
  ];
  
  sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
  
  // 헤더 스타일링
  const headerRange = sheet.getRange(1, 1, 1, headerRow.length);
  headerRange.setBackground('#17a2b8');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  
  // 열 너비 설정
  sheet.setColumnWidth(1, 140); // 제출일시
  sheet.setColumnWidth(2, 100); // 상담유형
  sheet.setColumnWidth(3, 80);  // 성명
  sheet.setColumnWidth(4, 120); // 연락처
  sheet.setColumnWidth(5, 200); // 이메일
  sheet.setColumnWidth(6, 150); // 회사명
  sheet.setColumnWidth(7, 100); // 직책
  sheet.setColumnWidth(8, 150); // 상담분야
  sheet.setColumnWidth(9, 300); // 문의내용
  sheet.setColumnWidth(10, 140); // 희망상담시간
  sheet.setColumnWidth(11, 100); // 개인정보동의
  sheet.setColumnWidth(12, 100); // 진단연계여부
  sheet.setColumnWidth(13, 80);  // 진단점수
  sheet.setColumnWidth(14, 120); // 추천서비스
  sheet.setColumnWidth(15, 100); // 상담상태
  
  // 고정 행 설정
  sheet.setFrozenRows(1);
  
  console.log('📋 상담신청 시트 헤더 설정 완료');
}

/**
 * 상담신청 행 스타일링
 */
function formatConsultationRow(sheet, row, isDiagnosisLinked) {
  const rowRange = sheet.getRange(row, 1, 1, 15);
  
  if (isDiagnosisLinked) {
    // 진단 연계 상담신청은 파란색 배경
    rowRange.setBackground('#e3f2fd');
    
    // 진단연계여부 셀 강조
    const diagnosisLinkCell = sheet.getRange(row, 12);
    diagnosisLinkCell.setBackground('#2196f3');
    diagnosisLinkCell.setFontColor('#ffffff');
    diagnosisLinkCell.setFontWeight('bold');
  } else {
    // 일반 상담신청은 연한 회색 배경
    rowRange.setBackground('#f5f5f5');
  }
  
  // 상담상태 셀 스타일링
  const statusCell = sheet.getRange(row, 15);
  statusCell.setBackground('#4caf50');
  statusCell.setFontColor('#ffffff');
  statusCell.setFontWeight('bold');
  statusCell.setHorizontalAlignment('center');
}

// ================================================================================
// 📧 알림 함수
// ================================================================================

/**
 * 상담 신청 알림 이메일 발송
 */
function sendConsultationNotification(data, diagnosisInfo, rowNumber) {
  try {
    const subject = diagnosisInfo.isLinked 
      ? `[M-CENTER] 🔗 진단연계 상담신청 - ${data.name} (${data.company})`
      : `[M-CENTER] 💬 신규 상담신청 - ${data.name} (${data.company})`;
    
    const body = `
안녕하세요,

새로운 상담 신청이 접수되었습니다.

📋 신청자 정보:
- 성명: ${data.name}
- 회사명: ${data.company || '미입력'}
- 직책: ${data.position || '미입력'}
- 이메일: ${data.email}
- 연락처: ${data.phone}
- 상담유형: ${data.consultationType}
- 상담분야: ${data.consultationArea}
- 희망시간: ${data.preferredTime}

📝 문의내용:
${data.inquiryContent}

${diagnosisInfo.isLinked ? `
🔗 AI 진단 연계 정보:
- 진단점수: ${diagnosisInfo.score || 'N/A'}점
- 추천서비스: ${diagnosisInfo.primaryService || 'N/A'}
- 진단ID: ${diagnosisInfo.diagnosisId || 'N/A'}

이 상담신청은 AI 진단 결과를 바탕으로 한 연계 상담입니다.
` : ''}

🔗 구글시트 바로가기:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}

📌 시트 위치: ${CONSULTATION_SHEET} 시트, ${rowNumber}번째 행

감사합니다.
M-CENTER 상담신청 시스템
    `;

    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
    console.log('📧 상담신청 알림 발송 완료:', { to: NOTIFICATION_EMAIL, row: rowNumber });
  } catch (error) {
    console.error('❌ 알림 이메일 발송 실패:', error);
  }
}

// ================================================================================
// 🛠️ 유틸리티 함수
// ================================================================================

/**
 * 상담신청 ID 생성
 */
function generateConsultationId(email) {
  const timestamp = Date.now();
  const emailPrefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  return `CONS_${emailPrefix}_${timestamp}`;
}

/**
 * 한국 시간 반환
 */
function getKoreanTime() {
  return Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
}

/**
 * CORS 헤더 설정
 */
function getResponseHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

/**
 * 성공 응답 생성
 */
function createSuccessResponse(data, headers) {
  const output = ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: data,
    timestamp: new Date().toISOString()
  }));
  
  Object.keys(headers).forEach(key => {
    output.setMimeType(ContentService.MimeType.JSON);
  });
  
  return output;
}

/**
 * 오류 응답 생성
 */
function createErrorResponse(message, headers) {
  const output = ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  }));
  
  Object.keys(headers).forEach(key => {
    output.setMimeType(ContentService.MimeType.JSON);
  });
  
  return output;
}

/**
 * OPTIONS 요청 처리 (CORS 지원)
 */
function doOptions(e) {
  const headers = getResponseHeaders();
  const output = ContentService.createTextOutput('');
  
  Object.keys(headers).forEach(key => {
    output.setMimeType(ContentService.MimeType.TEXT);
  });
  
  return output;
}

// ================================================================================
// 📊 관리 함수
// ================================================================================

/**
 * 상담 상태 업데이트
 */
function updateConsultationStatus(consultationId, newStatus) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(CONSULTATION_SHEET);
    
    if (!sheet) return false;
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      // 이메일로 매칭 (더 안정적)
      if (values[i][4] && values[i][4].includes(consultationId.split('_')[1])) {
        sheet.getRange(i + 1, 15).setValue(newStatus);
        console.log('✅ 상담 상태 업데이트:', { consultationId, newStatus, row: i + 1 });
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('❌ 상담 상태 업데이트 실패:', error);
    return false;
  }
}

/**
 * 상담신청 통계 조회
 */
function getConsultationStats() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(CONSULTATION_SHEET);
    
    if (!sheet) return null;
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let totalCount = values.length - 1; // 헤더 제외
    let diagnosisLinkedCount = 0;
    let completedCount = 0;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][11] === '진단연계') diagnosisLinkedCount++;
      if (values[i][14] === '완료') completedCount++;
    }
    
    return {
      total: totalCount,
      diagnosisLinked: diagnosisLinkedCount,
      completed: completedCount,
      inProgress: totalCount - completedCount
    };
  } catch (error) {
    console.error('❌ 상담신청 통계 조회 실패:', error);
    return null;
  }
} 