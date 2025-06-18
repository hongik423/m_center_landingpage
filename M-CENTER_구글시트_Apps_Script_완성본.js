/**
 * ================================================================================
 * 기업의별 경영지도센터 랜딩페이지 통합 데이터 처리 Apps Script 완성본
 * ================================================================================
 * 
 * 📋 주요 기능:
 * 1. AI 진단 신청 데이터 자동 저장 → "AI_진단신청" 시트
 * 2. 무료 상담신청 데이터 자동 저장 → "상담신청" 시트
 * 3. AI 진단 결과 업데이트
 * 4. 데이터 조회 및 관리
 * 5. 실시간 모니터링 및 알림
 * 
 * 📊 AI_진단신청 시트 구조 (18개 컬럼):
 * A: 제출일시     B: 회사명       C: 업종         D: 사업담당자   E: 직원수
 * F: 사업성장단계 G: 주요고민사항 H: 예상혜택     I: 진행사업장   J: 담당자명
 * K: 연락처       L: 이메일       M: 개인정보동의 N: 폼타입       O: 진단상태
 * P: AI분석결과   Q: 결과URL      R: 분석완료일시
 * 
 * 📊 상담신청 시트 구조 (15개 컬럼):
 * A: 제출일시     B: 상담유형     C: 성명         D: 연락처       E: 이메일
 * F: 회사명       G: 직책         H: 상담분야     I: 문의내용     J: 희망상담시간
 * K: 개인정보동의 L: 진단연계여부 M: 진단점수     N: 추천서비스   O: 처리상태
 * 
 * 🚀 설치 방법:
 * 1. 구글시트 열기 → 확장 → Apps Script
 * 2. 이 코드 전체 복사하여 붙여넣기
 * 3. SPREADSHEET_ID를 현재 시트 ID로 변경
 * 4. 저장 → 배포 → 새 배포 → 웹 앱으로 배포
 * 5. 실행 권한: 나, 액세스 권한: 모든 사용자
 * 
 * ⚙️ 환경변수 설정 (필수):
 * - SPREADSHEET_ID: 현재 구글시트의 ID
 * - NOTIFICATION_EMAIL: 알림 받을 이메일 (선택)
 */

// ================================================================================
// 🔧 환경설정 (반드시 수정하세요!)
// ================================================================================

/**
 * 현재 구글시트의 ID를 입력하세요
 * URL에서 /spreadsheets/d/[이부분]/edit 부분을 복사
 */
const SPREADSHEET_ID = '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug'; // ✅ 환경변수와 일치

/**
 * 시트명 정의
 */
const SHEET_NAMES = {
  DIAGNOSIS: 'AI_진단신청',      // AI 진단신청 데이터
  CONSULTATION: '상담신청',      // 무료 상담신청 데이터
  LEGACY: 'm_center_landingpage-request' // 기존 시트 (하위 호환성)
};

/**
 * 알림 이메일 (선택사항)
 */
const NOTIFICATION_EMAIL = 'hongik423@gmail.com'; // 신규 신청 시 알림 받을 이메일

/**
 * 자동 응답 이메일 설정 (선택사항)
 */
const AUTO_REPLY_ENABLED = true; // ✅ 자동 응답 활성화

// ================================================================================
// 📡 HTTP 요청 처리 메인 함수
// ================================================================================

/**
 * HTTP POST 요청 처리 메인 함수
 */
function doPost(e) {
  try {
    // CORS 설정
    const headers = getCorsHeaders();

    // OPTIONS 요청 처리 (CORS preflight)
    if (e.parameter && e.parameter.method === 'OPTIONS') {
      return createResponse('OK', headers);
    }

    // POST 데이터 파싱
    let requestData;
    try {
      const postData = e.postData ? e.postData.contents : '{}';
      requestData = JSON.parse(postData);
      logMessage('INFO', '새로운 요청 수신', {
        action: requestData.action,
        formType: requestData.폼타입,
        company: requestData.회사명 || requestData.companyName,
        email: requestData.이메일 || requestData.contactEmail,
        timestamp: getKoreanTime()
      });
    } catch (parseError) {
      logMessage('ERROR', 'JSON 파싱 오류', parseError);
      return createErrorResponse('잘못된 JSON 형식입니다.', headers);
    }

    // 요청 유형에 따른 처리 분기
    switch (requestData.action) {
      case 'saveDiagnosis':
        return saveDiagnosisData(requestData, headers);
      case 'saveConsultation':
        return saveConsultationData(requestData, headers);
      case 'updateDiagnosisResult':
        return updateDiagnosisResults(requestData, headers);
      case 'get':
        return getDiagnosisData(requestData, headers);
      default:
        // action이 없는 경우 폼타입으로 판단
        const formType = requestData.폼타입 || requestData.formType;
        if (formType === '상담신청' || requestData.consultationType || requestData.상담유형) {
          return saveConsultationData(requestData, headers);
        } else {
          return saveDiagnosisData(requestData, headers);
        }
    }

  } catch (error) {
    logMessage('ERROR', 'doPost 전역 오류', error);
    return createErrorResponse('서버 처리 중 오류가 발생했습니다: ' + error.toString(), getCorsHeaders());
  }
}

/**
 * HTTP GET 요청 처리 (상태 확인용)
 */
function doGet(e) {
  const headers = getCorsHeaders();
  
  try {
    const status = {
      status: '기업의별 경영지도센터 통합 데이터 처리 웹앱이 정상 작동 중입니다.',
      timestamp: getKoreanTime(),
      sheets: {
        diagnosis: SHEET_NAMES.DIAGNOSIS,
        consultation: SHEET_NAMES.CONSULTATION
      },
      version: '4.0',
      features: [
        'AI 진단 신청 저장 (AI_진단신청 시트)',
        '무료 상담신청 저장 (상담신청 시트)',
        'AI 진단 결과 업데이트',
        '데이터 조회 및 검색',
        '실시간 모니터링',
        '자동 알림 시스템'
      ]
    };

    return createResponse(JSON.stringify(status), headers);
  } catch (error) {
    return createErrorResponse('상태 확인 중 오류가 발생했습니다.', headers);
  }
}

// ================================================================================
// 💾 AI 진단 데이터 저장 함수
// ================================================================================

/**
 * AI 진단 신청 데이터 저장 → "AI_진단신청" 시트
 */
function saveDiagnosisData(data, headers) {
  try {
    const sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSIS, 'diagnosis');
    
    // 데이터 검증
    const validation = validateDiagnosisData(data);
    if (!validation.isValid) {
      return createErrorResponse(validation.message, headers);
    }

    // 중복 신청 확인
    if (isDuplicateRequest(sheet, data.contactEmail || data.이메일)) {
      logMessage('WARNING', 'AI 진단 중복 신청 감지', { email: data.contactEmail || data.이메일 });
    }

    // 현재 시간 생성
    const now = getKoreanTime();
    const uniqueId = generateUniqueId();

    // 새 행 데이터 구성 (AI 진단용)
    const rowData = [
      data.제출일시 || now,                                    // A: 제출일시
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
      data.개인정보동의 || (data.privacyConsent ? '동의' : '미동의'), // M: 개인정보동의
      'AI_무료진단',                                           // N: 폼타입
      '접수완료',                                              // O: 진단상태
      '',                                                     // P: AI분석결과
      '',                                                     // Q: 결과URL
      ''                                                      // R: 분석완료일시
    ];

    // 데이터 저장
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    // 새 행 스타일링
    formatNewRow(sheet, newRow);

    logMessage('SUCCESS', 'AI 진단 데이터 저장 완료', {
      sheet: SHEET_NAMES.DIAGNOSIS,
      row: newRow,
      company: data.companyName || data.회사명,
      email: data.contactEmail || data.이메일
    });

    // 알림 발송
    if (NOTIFICATION_EMAIL) {
      sendNotificationEmail(data, newRow, 'AI 진단신청');
    }

    // 자동 응답 이메일
    if (AUTO_REPLY_ENABLED && (data.contactEmail || data.이메일)) {
      sendAutoReplyEmail(data.contactEmail || data.이메일, data.contactName || data.담당자명, 'diagnosis');
    }

    return createResponse(JSON.stringify({
      success: true,
      message: 'AI 진단신청 데이터가 성공적으로 저장되었습니다.',
      sheet: SHEET_NAMES.DIAGNOSIS,
      row: newRow,
      uniqueId: uniqueId,
      timestamp: now
    }), headers);

  } catch (error) {
    logMessage('ERROR', 'AI 진단 데이터 저장 오류', error);
    return createErrorResponse('AI 진단 데이터 저장 중 오류가 발생했습니다: ' + error.toString(), headers);
  }
}

// ================================================================================
// 💾 상담신청 데이터 저장 함수
// ================================================================================

/**
 * 무료 상담신청 데이터 저장 → "상담신청" 시트
 */
function saveConsultationData(data, headers) {
  try {
    const sheet = getOrCreateSheet(SHEET_NAMES.CONSULTATION, 'consultation');
    
    // 데이터 검증
    const validation = validateConsultationData(data);
    if (!validation.isValid) {
      return createErrorResponse(validation.message, headers);
    }

    // 중복 신청 확인
    if (isDuplicateRequest(sheet, data.email || data.이메일)) {
      logMessage('WARNING', '상담신청 중복 신청 감지', { email: data.email || data.이메일 });
    }

    // 현재 시간 생성
    const now = getKoreanTime();
    const uniqueId = generateUniqueId();

    // 새 행 데이터 구성 (상담신청용)
    const rowData = [
      data.제출일시 || now,                                    // A: 제출일시
      data.상담유형 || data.consultationType || '일반상담',     // B: 상담유형
      data.성명 || data.name || '',                            // C: 성명
      data.연락처 || data.phone || '',                         // D: 연락처
      data.이메일 || data.email || '',                         // E: 이메일
      data.회사명 || data.company || '',                       // F: 회사명
      data.직책 || data.position || '',                       // G: 직책
      data.상담분야 || data.consultationArea || '',           // H: 상담분야
      data.문의내용 || data.inquiryContent || '',             // I: 문의내용
      data.희망상담시간 || data.preferredTime || '',           // J: 희망상담시간
      data.개인정보동의 || (data.privacyConsent ? '동의' : '미동의'), // K: 개인정보동의
      data.진단연계여부 || (data.isDiagnosisLinked ? 'Y' : 'N'), // L: 진단연계여부
      data.진단점수 || data.diagnosisScore || '',              // M: 진단점수
      data.추천서비스 || data.recommendedService || '',        // N: 추천서비스
      '접수완료'                                               // O: 처리상태
    ];

    // 데이터 저장
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    // 새 행 스타일링
    formatNewRow(sheet, newRow);

    logMessage('SUCCESS', '상담신청 데이터 저장 완료', {
      sheet: SHEET_NAMES.CONSULTATION,
      row: newRow,
      name: data.name || data.성명,
      company: data.company || data.회사명,
      email: data.email || data.이메일
    });

    // 알림 발송
    if (NOTIFICATION_EMAIL) {
      sendNotificationEmail(data, newRow, '무료상담신청');
    }

    // 자동 응답 이메일
    if (AUTO_REPLY_ENABLED && (data.email || data.이메일)) {
      sendAutoReplyEmail(data.email || data.이메일, data.name || data.성명, 'consultation');
    }

    return createResponse(JSON.stringify({
      success: true,
      message: '상담신청 데이터가 성공적으로 저장되었습니다.',
      sheet: SHEET_NAMES.CONSULTATION,
      row: newRow,
      uniqueId: uniqueId,
      timestamp: now
    }), headers);

  } catch (error) {
    logMessage('ERROR', '상담신청 데이터 저장 오류', error);
    return createErrorResponse('상담신청 데이터 저장 중 오류가 발생했습니다: ' + error.toString(), headers);
  }
}

// ================================================================================
// 🔄 AI 진단 결과 업데이트 함수
// ================================================================================

/**
 * AI 진단 결과 업데이트
 */
function updateDiagnosisResults(data, headers) {
  try {
    const sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSIS, 'diagnosis');
    
    // 이메일로 해당 행 찾기
    const targetRow = findRowByEmail(sheet, data.searchEmail);
    
    if (targetRow === -1) {
      return createErrorResponse('해당 이메일의 진단 신청을 찾을 수 없습니다.', headers);
    }

    // 업데이트할 데이터 구성
    const updates = [];
    
    if (data.진단상태) {
      sheet.getRange(targetRow, 15).setValue(data.진단상태); // O열
      updates.push('진단상태');
    }
    
    if (data.AI분석결과) {
      // JSON 객체인 경우 문자열로 변환
      const resultData = typeof data.AI분석결과 === 'object' 
        ? JSON.stringify(data.AI분석결과, null, 2) 
        : data.AI분석결과;
      sheet.getRange(targetRow, 16).setValue(resultData); // P열
      updates.push('AI분석결과');
    }
    
    if (data.결과URL) {
      sheet.getRange(targetRow, 17).setValue(data.결과URL); // Q열
      updates.push('결과URL');
    }
    
    if (data.분석완료일시) {
      sheet.getRange(targetRow, 18).setValue(data.분석완료일시); // R열
      updates.push('분석완료일시');
    } else if (updates.length > 0) {
      // 업데이트가 있으면 현재 시간을 분석완료일시로 설정
      sheet.getRange(targetRow, 18).setValue(getKoreanTime());
      updates.push('분석완료일시');
    }

    // 상태에 따른 행 색상 변경
    updateRowColor(sheet, targetRow, data.진단상태);

    logMessage('SUCCESS', '진단 결과 업데이트 완료', {
      row: targetRow,
      email: data.searchEmail,
      updates: updates
    });

    return createResponse(JSON.stringify({
      success: true,
      message: '진단 결과가 성공적으로 업데이트되었습니다.',
      row: targetRow,
      updatedFields: updates,
      timestamp: getKoreanTime()
    }), headers);

  } catch (error) {
    logMessage('ERROR', '결과 업데이트 오류', error);
    return createErrorResponse('결과 업데이트 중 오류가 발생했습니다: ' + error.toString(), headers);
  }
}

// ================================================================================
// 🔍 데이터 조회 함수
// ================================================================================

/**
 * 진단 데이터 조회
 */
function getDiagnosisData(data, headers) {
  try {
    const sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSIS, 'diagnosis');
    
    if (data.email) {
      // 특정 이메일의 데이터 조회
      return getSingleDiagnosisData(sheet, data.email, headers);
    } else {
      // 전체 데이터 조회
      return getAllDiagnosisData(sheet, headers);
    }
  } catch (error) {
    logMessage('ERROR', '데이터 조회 오류', error);
    return createErrorResponse('데이터 조회 중 오류가 발생했습니다: ' + error.toString(), headers);
  }
}

/**
 * 특정 이메일의 진단 데이터 조회
 */
function getSingleDiagnosisData(sheet, email, headers) {
  const targetRow = findRowByEmail(sheet, email);
  
  if (targetRow === -1) {
    return createErrorResponse('해당 이메일의 진단 신청을 찾을 수 없습니다.', headers);
  }

  const rowData = sheet.getRange(targetRow, 1, 1, 18).getValues()[0];
  const headerRow = sheet.getRange(1, 1, 1, 18).getValues()[0];
  
  const result = {};
  headerRow.forEach((header, index) => {
    result[header] = rowData[index];
  });

  return createResponse(JSON.stringify({
    success: true,
    data: result,
    row: targetRow,
    timestamp: getKoreanTime()
  }), headers);
}

/**
 * 모든 진단 데이터 조회 (관리용)
 */
function getAllDiagnosisData(sheet, headers) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  if (values.length < 2) {
    return createResponse(JSON.stringify({
      success: true,
      data: [],
      count: 0,
      message: '저장된 데이터가 없습니다.',
      timestamp: getKoreanTime()
    }), headers);
  }

  // 헤더와 데이터 분리
  const headerRow = values[0];
  const dataRows = values.slice(1);
  
  const results = dataRows.map((row, index) => {
    const rowData = { _row: index + 2 }; // 시트의 실제 행 번호
    headerRow.forEach((header, colIndex) => {
      rowData[header] = row[colIndex];
    });
    return rowData;
  });

  return createResponse(JSON.stringify({
    success: true,
    data: results,
    count: results.length,
    timestamp: getKoreanTime()
  }), headers);
}

// ================================================================================
// 🛠️ 유틸리티 함수
// ================================================================================

/**
 * 시트 가져오기 또는 생성 (헤더 자동 확인 및 추가)
 */
function getOrCreateSheet(sheetName, type = 'diagnosis') {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    // 새 시트 생성
    sheet = spreadsheet.insertSheet(sheetName);
    setupSheetHeaders(sheet, type);
    logMessage('INFO', '새 시트 생성 및 헤더 설정 완료', { sheetName: sheetName, type: type });
  } else {
    // 기존 시트 헤더 확인 및 설정
    const needsHeader = checkAndSetupHeaders(sheet, type);
    if (needsHeader) {
      logMessage('INFO', '기존 시트에 헤더 추가 완료', { sheetName: sheetName, type: type });
    }
  }
  
  return sheet;
}

/**
 * 기존 시트의 헤더 확인 및 필요시 설정
 */
function checkAndSetupHeaders(sheet, type = 'diagnosis') {
  const lastRow = sheet.getLastRow();
  
  // 시트가 비어있거나 1행만 있는 경우
  if (lastRow === 0) {
    setupSheetHeaders(sheet, type);
    return true;
  }
  
  // 1행의 내용 확인
  const firstRowRange = sheet.getRange(1, 1, 1, Math.min(18, sheet.getLastColumn()));
  const firstRowValues = firstRowRange.getValues()[0];
  
  // 예상 헤더 정의
  let expectedHeaders;
  if (type === 'consultation') {
    expectedHeaders = [
      '제출일시', '상담유형', '성명', '연락처', '이메일', '회사명', '직책',
      '상담분야', '문의내용', '희망상담시간', '개인정보동의', 
      '진단연계여부', '진단점수', '추천서비스', '처리상태'
    ];
  } else {
    expectedHeaders = [
      '제출일시', '회사명', '업종', '사업담당자', '직원수', '사업성장단계',
      '주요고민사항', '예상혜택', '진행사업장', '담당자명', '연락처', '이메일',
      '개인정보동의', '폼타입', '진단상태', 'AI분석결과', '결과URL', '분석완료일시'
    ];
  }
  
  // 헤더가 올바른지 확인 (첫 3개 컬럼만 확인)
  const isValidHeader = expectedHeaders.slice(0, 3).every((header, index) => 
    firstRowValues[index] === header
  );
  
  if (!isValidHeader) {
    // 헤더가 없으면 기존 데이터를 한 행 아래로 이동하고 헤더 추가
    if (lastRow > 0) {
      // 기존 데이터를 한 행씩 아래로 이동
      sheet.insertRowBefore(1);
      logMessage('INFO', '기존 데이터를 한 행 아래로 이동', { 
        sheetName: sheet.getName(), 
        movedRows: lastRow 
      });
    }
    
    setupSheetHeaders(sheet, type);
    return true;
  }
  
  return false;
}

/**
 * 시트 헤더 설정 (타입별)
 */
function setupSheetHeaders(sheet, type = 'diagnosis') {
  let headerRow;
  
  if (type === 'consultation') {
    // 상담신청 시트 헤더
    headerRow = [
      '제출일시', '상담유형', '성명', '연락처', '이메일', '회사명', '직책',
      '상담분야', '문의내용', '희망상담시간', '개인정보동의', 
      '진단연계여부', '진단점수', '추천서비스', '처리상태'
    ];
  } else {
    // AI 진단신청 시트 헤더 (기본값)
    headerRow = [
      '제출일시', '회사명', '업종', '사업담당자', '직원수', '사업성장단계',
      '주요고민사항', '예상혜택', '진행사업장', '담당자명', '연락처', '이메일',
      '개인정보동의', '폼타입', '진단상태', 'AI분석결과', '결과URL', '분석완료일시'
    ];
  }
  
  sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
  
  // 헤더 스타일링
  const headerRange = sheet.getRange(1, 1, 1, headerRow.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  
  // 열 너비 자동 조정
  sheet.autoResizeColumns(1, headerRow.length);
  
  // 고정 행 설정
  sheet.setFrozenRows(1);
  
  logMessage('INFO', '시트 헤더 설정 완료', { 
    type: type,
    headers: headerRow.length,
    sheetName: sheet.getName()
  });
}

/**
 * 새 행 스타일링
 */
function formatNewRow(sheet, rowNumber) {
  const range = sheet.getRange(rowNumber, 1, 1, 18);
  
  // 교대로 배경색 설정
  if (rowNumber % 2 === 0) {
    range.setBackground('#f8f9fa');
  }
  
  // 테두리 설정
  range.setBorder(true, true, true, true, false, false);
  
  // 진단상태 열 색상 설정
  const statusCell = sheet.getRange(rowNumber, 15);
  statusCell.setBackground('#e8f5e8');
  statusCell.setFontWeight('bold');
}

/**
 * 상태에 따른 행 색상 업데이트
 */
function updateRowColor(sheet, rowNumber, status) {
  const statusCell = sheet.getRange(rowNumber, 15);
  
  switch (status) {
    case '완료':
      statusCell.setBackground('#d4edda');
      statusCell.setFontColor('#155724');
      break;
    case '처리중':
      statusCell.setBackground('#fff3cd');
      statusCell.setFontColor('#856404');
      break;
    case '오류':
      statusCell.setBackground('#f8d7da');
      statusCell.setFontColor('#721c24');
      break;
    default:
      statusCell.setBackground('#e8f5e8');
      statusCell.setFontColor('#333333');
  }
}

/**
 * 이메일로 행 찾기
 */
function findRowByEmail(sheet, email) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  const emailColumn = 12; // L열 (이메일)
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][emailColumn - 1] === email) {
      return i + 1; // 1-based index
    }
  }
  
  return -1;
}

/**
 * 중복 신청 확인
 */
function isDuplicateRequest(sheet, email) {
  if (!email) return false;
  
  const today = new Date();
  const todayStr = Utilities.formatDate(today, 'Asia/Seoul', 'yyyy-MM-dd');
  
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  for (let i = 1; i < values.length; i++) {
    const rowEmail = values[i][11]; // L열 (이메일)
    const rowDate = values[i][0]; // A열 (제출일시)
    
    if (rowEmail === email && rowDate && rowDate.toString().includes(todayStr)) {
      return true;
    }
  }
  
  return false;
}

/**
 * 요청 데이터 검증 - AI 진단
 */
function validateDiagnosisData(data) {
  const requiredFields = [
    { field: '회사명', altField: 'companyName' },
    { field: '이메일', altField: 'contactEmail' },
    { field: '담당자명', altField: 'contactName' }
  ];
  
  for (const req of requiredFields) {
    if (!data[req.field] && !data[req.altField]) {
      return {
        isValid: false,
        message: `AI 진단신청 필수 필드가 누락되었습니다: ${req.field}`
      };
    }
  }
  
  return { isValid: true };
}

/**
 * 요청 데이터 검증 - 상담신청
 */
function validateConsultationData(data) {
  const requiredFields = [
    { field: '성명', altField: 'name' },
    { field: '이메일', altField: 'email' },
    { field: '연락처', altField: 'phone' }
  ];
  
  for (const req of requiredFields) {
    if (!data[req.field] && !data[req.altField]) {
      return {
        isValid: false,
        message: `상담신청 필수 필드가 누락되었습니다: ${req.field}`
      };
    }
  }
  
  return { isValid: true };
}

/**
 * 한국 시간 반환
 */
function getKoreanTime() {
  return Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy. M. d. a h:mm:ss');
}

/**
 * 고유 ID 생성
 */
function generateUniqueId() {
  return Utilities.getUuid().slice(0, 8);
}

/**
 * CORS 헤더 반환
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
 * 응답 생성
 */
function createResponse(content, headers) {
  return ContentService
    .createTextOutput(content)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

/**
 * 오류 응답 생성
 */
function createErrorResponse(message, headers) {
  return createResponse(JSON.stringify({
    success: false,
    error: message,
    timestamp: getKoreanTime()
  }), headers);
}

/**
 * 로그 메시지 기록
 */
function logMessage(level, message, data = null) {
  const timestamp = getKoreanTime();
  const logData = data ? JSON.stringify(data, null, 2) : '';
  console.log(`[${timestamp}] [${level}] ${message} ${logData}`);
}

// ================================================================================
// 📧 이메일 알림 함수
// ================================================================================

/**
 * 신규 신청 알림 이메일 발송
 */
function sendNotificationEmail(data, rowNumber, type) {
  try {
    const subject = `[M-CENTER] 새로운 ${type} 신청 - ${data.companyName || data.회사명}`;
    const body = `
안녕하세요,

새로운 ${type} 신청이 접수되었습니다.

📋 신청 정보:
- 회사명: ${data.companyName || data.회사명}
- 담당자: ${data.contactName || data.담당자명}
- 이메일: ${data.contactEmail || data.이메일}
- 연락처: ${data.contactPhone || data.연락처}
- 업종: ${data.industry || data.업종}
- 직원수: ${data.employeeCount || data.직원수}
- 시트 행번호: ${rowNumber}

🔗 구글시트 바로가기:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}

감사합니다.
M-CENTER AI 진단 시스템
    `;

    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
    logMessage('INFO', '알림 이메일 발송 완료', { to: NOTIFICATION_EMAIL, row: rowNumber, type: type });
  } catch (error) {
    logMessage('ERROR', '알림 이메일 발송 실패', error);
  }
}

/**
 * 자동 응답 이메일 발송
 */
function sendAutoReplyEmail(email, name, type) {
  try {
    const subject = `[기업의별 경영지도센터] ${type} 신청이 접수되었습니다`;
    const body = `
${name}님, 안녕하세요!

기업의별 경영지도센터 ${type} 신청이 성공적으로 접수되었습니다.

📋 처리 절차:
1. ✅ 신청 접수 완료 (현재 단계)
2. 🔄 AI 분석 진행 (약 5-10분 소요)
3. 📊 결과 생성 및 이메일 발송
4. 💬 전문가 상담 연결

📞 문의사항이 있으시면 언제든 연락주세요:
- 이메일: hongik423@gmail.com
- 전화: 010-9251-9743

감사합니다.

기업의별 경영지도센터
이후경 경영지도센터장
    `;

    MailApp.sendEmail(email, subject, body);
    logMessage('INFO', '자동 응답 이메일 발송 완료', { to: email, type: type });
  } catch (error) {
    logMessage('ERROR', '자동 응답 이메일 발송 실패', error);
  }
}

// ================================================================================
// 🧪 테스트 및 관리 함수
// ================================================================================

/**
 * 테스트 데이터 생성 (개발용)
 */
function createTestData() {
  const testData = {
    companyName: '테스트기업(주)',
    industry: 'IT/소프트웨어',
    businessManager: '김테스트',
    employeeCount: '6-10명',
    establishmentDifficulty: '2단계 프로토타입단계 (Seed단계)',
    mainConcerns: '매출 성장이 정체되어 있고, 신규 고객 확보가 어렵습니다. AI 기술을 활용한 업무 효율성 개선이 필요합니다.',
    expectedBenefits: '월 매출 30% 증가, 고객 만족도 향상, 업무 효율성 40% 개선',
    businessLocation: '서울시 강남구',
    contactName: '홍길동',
    contactPhone: '010-1234-5678',
    contactEmail: 'test@company.com',
    privacyConsent: true
  };

  console.log('테스트 데이터 생성 시작...');
  
  const result = saveDiagnosisData(testData, getCorsHeaders());
  console.log('테스트 결과:', result.getContent());
  
  return '테스트 데이터 생성 완료';
}

/**
 * 테스트 결과 업데이트 (개발용)
 */
function createTestResultUpdate() {
  const updateData = {
    action: 'update',
    searchEmail: 'test@company.com',
    진단상태: '완료',
    AI분석결과: JSON.stringify({
      우선추천서비스: 'BM ZEN 사업분석',
      추가추천서비스: ['AI 활용 생산성향상', '웹사이트 구축'],
      예상성과: {
        매출증가: '30%',
        효율성개선: '40%',
        완료예상시간: '6개월'
      },
      우선순위: 1,
      분석점수: 85,
      세부추천사항: [
        '비즈니스 모델 재설계를 통한 수익 구조 최적화',
        'AI 도구 도입으로 반복 업무 자동화',
        '온라인 마케팅 채널 다변화'
      ]
    }),
    결과URL: `https://m-center-diagnosis.com/results/${generateUniqueId()}`,
    분석완료일시: getKoreanTime()
  };

  console.log('테스트 업데이트 시작...');
  
  const result = updateDiagnosisResults(updateData, getCorsHeaders());
  console.log('업데이트 결과:', result.getContent());
  
  return '테스트 업데이트 완료';
}

/**
 * 시트 초기화 (관리용)
 */
function resetSheet() {
  const sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSIS, 'diagnosis');
  
  // 데이터 행만 삭제 (헤더 유지)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  logMessage('INFO', '시트 초기화 완료', { deletedRows: lastRow - 1 });
  return '시트 초기화 완료';
}

/**
 * 데이터 백업 (관리용)
 */
function createBackup() {
  try {
    const sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSIS, 'diagnosis');
    const backupName = `${SHEET_NAMES.DIAGNOSIS}_backup_${Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd_HHmmss')}`;
    
    const newSheet = sheet.copyTo(SpreadsheetApp.openById(SPREADSHEET_ID));
    newSheet.setName(backupName);
    
    logMessage('INFO', '백업 생성 완료', { backupName: backupName });
    return `백업 생성 완료: ${backupName}`;
  } catch (error) {
    logMessage('ERROR', '백업 생성 실패', error);
    return '백업 생성 실패: ' + error.toString();
  }
}

/**
 * 통계 정보 조회 (관리용)
 */
function getStatistics() {
  try {
    const sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSIS, 'diagnosis');
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length < 2) {
      return { totalRequests: 0, todayRequests: 0, completedRequests: 0 };
    }

    const data = values.slice(1); // 헤더 제외
    const today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
    
    const stats = {
      totalRequests: data.length,
      todayRequests: data.filter(row => row[0] && row[0].toString().includes(today)).length,
      completedRequests: data.filter(row => row[14] === '완료').length,
      processingRequests: data.filter(row => row[14] === '처리중').length,
      byIndustry: {},
      byEmployeeCount: {}
    };

    // 업종별 통계
    data.forEach(row => {
      const industry = row[2] || '미분류';
      stats.byIndustry[industry] = (stats.byIndustry[industry] || 0) + 1;
    });

    // 직원수별 통계
    data.forEach(row => {
      const employeeCount = row[4] || '미분류';
      stats.byEmployeeCount[employeeCount] = (stats.byEmployeeCount[employeeCount] || 0) + 1;
    });

    logMessage('INFO', '통계 조회 완료', stats);
    return stats;
  } catch (error) {
    logMessage('ERROR', '통계 조회 실패', error);
    return { error: error.toString() };
  }
}

// ================================================================================
// 🚀 설치 완료 후 실행할 함수
// ================================================================================

/**
 * 초기 설정 함수 (설치 후 한 번 실행)
 */
function initialize() {
  console.log('M-CENTER Apps Script 초기화 시작...');
  
  try {
    // 시트 생성 및 설정
    const sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSIS, 'diagnosis');
    console.log('✅ 시트 생성 완료');
    
    // 테스트 데이터 생성 (선택사항)
    // createTestData();
    // console.log('✅ 테스트 데이터 생성 완료');
    
    console.log('🎉 M-CENTER Apps Script 초기화 완료!');
    console.log('📋 다음 단계:');
    console.log('1. 배포 → 새 배포 → 웹 앱');
    console.log('2. 실행 계정: 나');
    console.log('3. 액세스 권한: 모든 사용자');
    console.log('4. 배포 URL을 웹사이트 환경변수에 설정');
    
    return '초기화 완료';
  } catch (error) {
    console.error('❌ 초기화 실패:', error);
    return '초기화 실패: ' + error.toString();
  }
}

// ================================================================================
// 📝 사용법 가이드
// ================================================================================

/**
 * 사용법 가이드를 콘솔에 출력
 */
function showUsageGuide() {
  console.log(`
================================================================================
📋 M-CENTER Apps Script 사용법 가이드
================================================================================

🔧 1. 환경설정 (필수)
   - SPREADSHEET_ID: 현재 시트 ID로 변경
   - NOTIFICATION_EMAIL: 알림 받을 이메일 설정

🚀 2. 배포 방법
   1) 저장 → 배포 → 새 배포
   2) 유형: 웹 앱
   3) 실행 계정: 나
   4) 액세스 권한: 모든 사용자
   5) 배포 → URL 복사

📡 3. API 엔드포인트
   - POST /: 새로운 진단 신청 저장
   - POST / (action: update): AI 진단 결과 업데이트
   - POST / (action: get): 데이터 조회
   - GET /: 시스템 상태 확인

🧪 4. 테스트 함수
   - initialize(): 초기 설정
   - createTestData(): 테스트 데이터 생성
   - createTestResultUpdate(): 테스트 결과 업데이트
   - getStatistics(): 통계 정보 조회

📊 5. 관리 함수
   - resetSheet(): 시트 초기화
   - createBackup(): 데이터 백업
   - getAllDiagnosisData(): 전체 데이터 조회

📧 6. 이메일 알림
   - 신규 신청 시 관리자 알림
   - 신청자 자동 응답 (선택사항)

================================================================================
  `);
}

/**
 * Apps Script 버전 정보
 */
function getVersionInfo() {
  return {
    version: '4.0',
    lastUpdated: '2025-01-27',
    features: [
      'AI 진단 신청 저장 (AI_진단신청 시트)',
      '무료 상담신청 저장 (상담신청 시트)',
      'AI 진단 결과 업데이트',
      '데이터 조회 및 검색',
      '실시간 모니터링',
      '자동 알림 시스템'
    ],
    author: 'M-CENTER Development Team',
    contact: 'hongik423@gmail.com'
  };
}

// ================================================================================
// 🛠️ 관리 및 유지보수 함수
// ================================================================================

/**
 * 수동으로 AI 진단신청 시트에 헤더 추가 (즉시 실행용)
 */
function addHeadersToExistingSheet() {
  try {
    console.log('🔧 AI 진단신청 시트 헤더 추가 시작...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES.DIAGNOSIS);
    
    if (!sheet) {
      console.log('❌ AI_진단신청 시트를 찾을 수 없습니다.');
      return '시트를 찾을 수 없습니다.';
    }
    
    const lastRow = sheet.getLastRow();
    console.log(`📊 현재 시트 상태: ${lastRow}개 행`);
    
    // 기존 데이터가 있으면 맨 위에 행 삽입
    if (lastRow > 0) {
      sheet.insertRowBefore(1);
      console.log('📝 기존 데이터를 아래로 이동');
    }
    
    // 헤더 행 추가
    const headerRow = [
      '제출일시', '회사명', '업종', '사업담당자', '직원수', '사업성장단계',
      '주요고민사항', '예상혜택', '진행사업장', '담당자명', '연락처', '이메일',
      '개인정보동의', '폼타입', '진단상태', 'AI분석결과', '결과URL', '분석완료일시'
    ];
    
    sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
    
    // 헤더 스타일링
    const headerRange = sheet.getRange(1, 1, 1, headerRow.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    
    // 열 너비 자동 조정
    sheet.autoResizeColumns(1, headerRow.length);
    
    // 고정 행 설정
    sheet.setFrozenRows(1);
    
    console.log('✅ AI 진단신청 시트 헤더 추가 완료!');
    console.log(`📋 헤더 컬럼 수: ${headerRow.length}개`);
    console.log('🎨 스타일링 적용 완료 (파란 배경, 흰색 글자, 굵게)');
    console.log('📌 1행 고정 설정 완료');
    
    logMessage('SUCCESS', 'AI 진단신청 시트 헤더 수동 추가 완료', {
      sheetName: SHEET_NAMES.DIAGNOSIS,
      headerColumns: headerRow.length,
      existingRows: lastRow
    });
    
    return '✅ AI 진단신청 시트 헤더 추가 완료!';
    
  } catch (error) {
    console.error('❌ 헤더 추가 중 오류:', error);
    logMessage('ERROR', 'AI 진단신청 시트 헤더 추가 실패', error);
    return `❌ 헤더 추가 실패: ${error.toString()}`;
  }
}

/**
 * 상담신청 시트에도 헤더 추가 (필요시)
 */
function addHeadersToConsultationSheet() {
  try {
    console.log('🔧 상담신청 시트 헤더 추가 시작...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES.CONSULTATION);
    
    if (!sheet) {
      console.log('❌ 상담신청 시트를 찾을 수 없습니다.');
      return '시트를 찾을 수 없습니다.';
    }
    
    const lastRow = sheet.getLastRow();
    console.log(`📊 현재 시트 상태: ${lastRow}개 행`);
    
    // 기존 데이터가 있으면 맨 위에 행 삽입
    if (lastRow > 0) {
      sheet.insertRowBefore(1);
      console.log('📝 기존 데이터를 아래로 이동');
    }
    
    // 헤더 행 추가 (상담신청용)
    const headerRow = [
      '제출일시', '상담유형', '성명', '연락처', '이메일', '회사명', '직책',
      '상담분야', '문의내용', '희망상담시간', '개인정보동의', 
      '진단연계여부', '진단점수', '추천서비스', '처리상태'
    ];
    
    sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
    
    // 헤더 스타일링
    const headerRange = sheet.getRange(1, 1, 1, headerRow.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    
    // 열 너비 자동 조정
    sheet.autoResizeColumns(1, headerRow.length);
    
    // 고정 행 설정
    sheet.setFrozenRows(1);
    
    console.log('✅ 상담신청 시트 헤더 추가 완료!');
    
    logMessage('SUCCESS', '상담신청 시트 헤더 수동 추가 완료', {
      sheetName: SHEET_NAMES.CONSULTATION,
      headerColumns: headerRow.length,
      existingRows: lastRow
    });
    
    return '✅ 상담신청 시트 헤더 추가 완료!';
    
  } catch (error) {
    console.error('❌ 헤더 추가 중 오류:', error);
    logMessage('ERROR', '상담신청 시트 헤더 추가 실패', error);
    return `❌ 헤더 추가 실패: ${error.toString()}`;
  }
}

/**
 * 모든 시트에 헤더 추가 (일괄 처리)
 */
function addHeadersToAllSheets() {
  console.log('🚀 모든 시트 헤더 추가 시작...');
  
  const results = [];
  
  // AI 진단신청 시트
  const diagnosisResult = addHeadersToExistingSheet();
  results.push(`AI 진단신청: ${diagnosisResult}`);
  
  // 상담신청 시트
  const consultationResult = addHeadersToConsultationSheet();
  results.push(`상담신청: ${consultationResult}`);
  
  console.log('✅ 모든 시트 헤더 추가 완료!');
  console.log('📋 결과 요약:');
  results.forEach(result => console.log(`  - ${result}`));
  
  return `모든 시트 헤더 추가 완료:\n${results.join('\n')}`;
}

// ================================================================================
// 🏁 초기화 실행 (주석 해제하여 사용)
// ================================================================================

// 설치 후 한 번만 실행하세요
// initialize(); 