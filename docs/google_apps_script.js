/**
 * AI-CAMP 맞춤진단 및 상담신청 데이터 수집 웹앱
 * CORS 문제 해결 및 에러 처리 개선
 * 개인정보동의 체크박스 반영
 * AI 무료진단기 지원 추가 - 새로운 필드 구조 반영
 */

// 스프레드시트 ID 설정 (실제 스프레드시트 ID로 변경 필요)
const SPREADSHEET_ID = '1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM';
const SHEET_NAME = '진단신청데이터';
const AI_DIAGNOSIS_SHEET = 'm_center_landingpage-request';

/**
 * 웹 앱으로 POST 요청을 받아 처리하는 메인 함수
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * GET 요청 처리 (테스트용)
 */
function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // CORS 헤더 설정
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // POST 요청인 경우 데이터 처리
    if (e && e.postData && e.postData.contents) {
      let data;
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        Logger.log('JSON 파싱 오류: ' + parseError.toString());
        return output.setContent(JSON.stringify({
          success: false, 
          error: 'Invalid JSON format'
        }));
      }
      
      // 개인정보 동의 확인 (더 관대한 체크)
      const hasConsent = 
        data.개인정보처리동의 === '동의' || 
        data.privacyConsent === true || 
        data.privacyConsent === 'true' ||
        (typeof data.privacyConsent === 'string' && data.privacyConsent.toLowerCase() === 'true');
      
      Logger.log('개인정보 동의 체크:', {
        개인정보처리동의: data.개인정보처리동의,
        privacyConsent: data.privacyConsent,
        privacyConsentType: typeof data.privacyConsent,
        hasConsent: hasConsent
      });
      
      if (!hasConsent) {
        Logger.log('개인정보 동의 확인 실패 - 모든 조건 확인 결과:', {
          '개인정보처리동의 === 동의': data.개인정보처리동의 === '동의',
          'privacyConsent === true': data.privacyConsent === true,
          'privacyConsent === "true"': data.privacyConsent === 'true',
          'typeof privacyConsent': typeof data.privacyConsent,
          '실제 privacyConsent 값': data.privacyConsent
        });
        return output.setContent(JSON.stringify({
          success: false,
          error: '개인정보 수집 및 이용에 동의가 필요합니다.'
        }));
      }
      
      // 스프레드시트 열기
      let spreadsheet;
      try {
        spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      } catch (sheetError) {
        Logger.log('스프레드시트 접근 오류: ' + sheetError.toString());
        return output.setContent(JSON.stringify({
          success: false, 
          error: 'Cannot access spreadsheet'
        }));
      }
      
      // 폼 타입에 따라 적절한 시트 선택 또는 생성
      const formType = determineFormType(data);
      let sheet;
      
      try {
        if (formType === 'ai_diagnosis') {
          sheet = getOrCreateSheet(spreadsheet, AI_DIAGNOSIS_SHEET);
          return processAIDiagnosisForm(sheet, data, output);
        } else if (formType === 'diagnosis') {
          sheet = getOrCreateSheet(spreadsheet, '기업진단신청');
          return processDiagnosisForm(sheet, data, output);
        } else if (formType === 'consultation') {
          sheet = getOrCreateSheet(spreadsheet, '상담신청');
          return processConsultationForm(sheet, data, output);
        } else {
          return output.setContent(JSON.stringify({
            success: false,
            error: 'Unknown form type'
          }));
        }
      } catch (processError) {
        Logger.log('데이터 처리 오류: ' + processError.toString());
        return output.setContent(JSON.stringify({
          success: false, 
          error: 'Failed to process data: ' + processError.toString()
        }));
      }
    }
    
    // GET 요청이거나 POST 데이터가 없는 경우
    return output.setContent(JSON.stringify({
      success: false,
      error: 'No data provided'
    }));
    
  } catch (error) {
    Logger.log('전체 처리 오류: ' + error.toString());
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    return output.setContent(JSON.stringify({
      success: false,
      error: 'Server error: ' + error.toString()
    }));
  }
}

/**
 * 데이터를 기반으로 폼 타입 결정
 */
function determineFormType(data) {
  // AI 무료진단 폼 고유 필드들 확인 (새로운 필드 구조 반영)
  if (data.formType === 'AI_무료진단' || 
      data.사업담당 || data.businessManager || 
      data.설립난도 || data.establishmentDifficulty ||
      data.예상혜택 || data.expectedBenefits ||
      data.진행사업장 || data.businessLocation) {
    return 'ai_diagnosis';
  }
  // 상담 신청 폼 고유 필드들이 있는지 확인
  if (data.consultationType || data.consultationArea || data.inquiryContent) {
    return 'consultation';
  }
  // 진단 폼 고유 필드들이 있는지 확인
  if (data.companyName || data.industry || data.businessStage) {
    return 'diagnosis';
  }
  // 기본값은 진단 폼으로 처리
  return 'diagnosis';
}

/**
 * 시트 가져오기 또는 생성
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

/**
 * AI 무료진단 폼 데이터 처리 - 새로운 필드 구조
 */
function processAIDiagnosisForm(sheet, data, output) {
  try {
    // 헤더가 없으면 헤더 추가 (새로운 필드 구조에 맞게)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '제출일시',
        '회사명',
        '업종',
        '사업담당',
        '직원수',
        '사업성장단계',
        '주요고민',
        '예상혜택',
        '진행사업장',
        '담당자명',
        '연락처',
        '이메일',
        '개인정보처리동의'
      ]);
      
      // 헤더 스타일 설정
      const headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }
    
    // 업종 한글 변환
    const industryMap = {
      'manufacturing': '제조업',
      'it': 'IT/소프트웨어',
      'service': '서비스업',
      'retail': '유통/소매',
      'construction': '건설업',
      'food': '식품/외식',
      'healthcare': '의료/헬스케어',
      'education': '교육',
      'finance': '금융/보험',
      'logistics': '물류/운송',
      'consulting': '컨설팅',
      'other': '기타'
    };
    
    // 직원수 정규화
    const employeeCountMap = {
      '1명': '1명 (개인사업자)',
      '2-5명': '2-5명',
      '6-10명': '6-10명',
      '11-19명': '11-19명',
      '20-30명': '20-30명',
      '31-50명': '31-50명',
      '51-100명': '51-100명',
      '100명이상': '100명 이상'
    };
    
    // 사업성장단계 정규화
    const businessStageMap = {
      '1단계': '1단계 아이디어단계 (Pre-Seed)',
      '2단계': '2단계 프로토타입단계 (Seed단계)',
      '3단계': '3단계 상용화단계 (Series A)',
      '4단계': '4단계 확장 단계 (Series B+)',
      // 기존 값들도 호환성을 위해 유지 (점진적 마이그레이션)
      '매우쉬움': '1단계 아이디어단계 (Pre-Seed)',
      '쉬움': '2단계 프로토타입단계 (Seed단계)',
      '보통': '3단계 상용화단계 (Series A)',
      '어려움': '4단계 확장 단계 (Series B+)',
      '매우어려움': '4단계 확장 단계 (Series B+)'
    };
    
    // 데이터 추가 (새로운 필드 구조에 맞게)
    sheet.appendRow([
      data.제출일시 || data.submitDate || new Date().toLocaleString('ko-KR'),
      data.회사명 || data.companyName || '',
      industryMap[data.업종 || data.industry] || data.업종 || data.industry || '',
      data.사업담당 || data.businessManager || '',
      employeeCountMap[data.직원수 || data.employeeCount] || data.직원수 || data.employeeCount || '',
      businessStageMap[data.사업성장단계 || data.설립난도 || data.establishmentDifficulty] || data.사업성장단계 || data.설립난도 || data.establishmentDifficulty || '',
      data.주요고민 || data.mainConcerns || data.mainChallenge || '',
      data.예상혜택 || data.expectedBenefits || data.goal || '',
      data.진행사업장 || data.businessLocation || '',
      data.담당자명 || data.contactName || '',
      data.연락처 || data.contactPhone || '',
      data.이메일 || data.contactEmail || '',
      (data.개인정보처리동의 === '동의' || data.privacyConsent === true) ? '동의' : '미동의'
    ]);
    
    // 자동 크기 조정
    sheet.autoResizeColumns(1, 13);
    
    Logger.log('AI 무료진단 데이터 저장 성공: ' + JSON.stringify(data));
    
    return output.setContent(JSON.stringify({
      success: true,
      message: 'AI 무료진단 신청이 성공적으로 저장되었습니다.',
      formType: 'ai_diagnosis',
      timestamp: new Date().toISOString(),
      rowCount: sheet.getLastRow()
    }));
    
  } catch (saveError) {
    Logger.log('AI 무료진단 데이터 저장 오류: ' + saveError.toString());
    return output.setContent(JSON.stringify({
      success: false, 
      error: 'Failed to save AI diagnosis data: ' + saveError.toString()
    }));
  }
}

/**
 * 기업 진단 폼 데이터 처리
 */
function processDiagnosisForm(sheet, data, output) {
  try {
    // 헤더가 없으면 헤더 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '제출일시',
        '회사명',
        '업종',
        '사업단계',
        '직원수',
        '설립년도',
        '주요고민',
        '예상예산',
        '진행시급성',
        '담당자명',
        '연락처',
        '이메일',
        '개인정보동의여부'
      ]);
    }
    
    // 데이터 추가
    sheet.appendRow([
      new Date().toLocaleString('ko-KR'),
      data.companyName || '',
      data.industry || '',
      data.businessStage || '',
      data.employeeCount || '',
      data.establishedYear || '',
      data.mainConcerns || '',
      data.expectedBudget || '',
      data.urgency || '',
      data.contactName || '',
      data.contactPhone || data.contact || '',
      data.contactEmail || data.email || '',
      data.privacyConsent ? '동의' : '미동의'
    ]);
    
    Logger.log('기업진단 데이터 저장 성공: ' + JSON.stringify(data));
    
    return output.setContent(JSON.stringify({
      success: true,
      message: '기업 진단 신청이 성공적으로 저장되었습니다.',
      formType: 'diagnosis',
      timestamp: new Date().toISOString()
    }));
    
  } catch (saveError) {
    Logger.log('기업진단 데이터 저장 오류: ' + saveError.toString());
    return output.setContent(JSON.stringify({
      success: false, 
      error: 'Failed to save diagnosis data: ' + saveError.toString()
    }));
  }
}

/**
 * 상담 신청 폼 데이터 처리
 */
function processConsultationForm(sheet, data, output) {
  try {
    // 헤더가 없으면 헤더 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '제출일시',
        '상담유형',
        '성명',
        '연락처',
        '이메일',
        '회사명',
        '직책',
        '상담분야',
        '문의내용',
        '희망상담시간',
        '개인정보동의여부'
      ]);
    }
    
    // 상담 유형 한글 변환
    const consultationTypeMap = {
      'phone': '전화상담',
      'online': '온라인상담',
      'visit': '방문상담'
    };
    
    // 상담 분야 한글 변환
    const consultationAreaMap = {
      'business-analysis': '비즈니스 분석',
      'ai-productivity': 'AI 생산성',
      'certification': '인증 컨설팅',
      'tech-startup': '기술창업',
      'factory-auction': '공장경매',
      'website': '웹사이트 개발',
      'diagnosis': '기업 진단',
      'other': '기타'
    };
    
    // 희망 시간 한글 변환
    const preferredTimeMap = {
      'morning': '오전 (09:00-12:00)',
      'afternoon': '오후 (13:00-17:00)',
      'evening': '저녁 (18:00-20:00)',
      'flexible': '시간 조정 가능'
    };
    
    // 데이터 추가
    sheet.appendRow([
      new Date().toLocaleString('ko-KR'),
      consultationTypeMap[data.consultationType] || data.consultationType || '',
      data.name || '',
      data.phone || '',
      data.email || '',
      data.company || '',
      data.position || '',
      consultationAreaMap[data.consultationArea] || data.consultationArea || '',
      data.inquiryContent || '',
      preferredTimeMap[data.preferredTime] || data.preferredTime || '',
      data.privacyConsent ? '동의' : '미동의'
    ]);
    
    Logger.log('상담신청 데이터 저장 성공: ' + JSON.stringify(data));
    
    return output.setContent(JSON.stringify({
      success: true,
      message: '상담 신청이 성공적으로 저장되었습니다.',
      formType: 'consultation',
      timestamp: new Date().toISOString()
    }));
    
  } catch (saveError) {
    Logger.log('상담신청 데이터 저장 오류: ' + saveError.toString());
    return output.setContent(JSON.stringify({
      success: false, 
      error: 'Failed to save consultation data: ' + saveError.toString()
    }));
  }
}

/**
 * 스프레드시트 데이터 조회 (관리자용)
 */
function getAllData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return { success: false, error: '시트를 찾을 수 없습니다.' };
    }

    const data = sheet.getDataRange().getValues();
    
    return {
      success: true,
      data: data,
      totalRows: data.length
    };

  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * AI 무료진단 데이터 조회 (관리자용)
 */
function getAIDiagnosisData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(AI_DIAGNOSIS_SHEET);
    
    if (!sheet) {
      return { success: false, error: 'AI 진단 시트를 찾을 수 없습니다.' };
    }

    const data = sheet.getDataRange().getValues();
    
    return {
      success: true,
      data: data,
      totalRows: data.length
    };

  } catch (error) {
    console.error('AI 진단 데이터 조회 오류:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 테스트 함수 (스크립트 편집기에서 직접 실행 가능) - 새로운 필드 구조
 */
function testAIDiagnosisFunction() {
  const testData = {
    제출일시: new Date().toLocaleString('ko-KR'),
    submitDate: new Date().toLocaleString('ko-KR'),
    formType: 'AI_무료진단',
    회사명: '테스트 AI 진단 회사',
    companyName: '테스트 AI 진단 회사',
    업종: 'it',
    industry: 'it',
    사업담당: '김사업',
    businessManager: '김사업',
    직원수: '6-10명',
    employeeCount: '6-10명',
    설립난도: '보통',
    establishmentDifficulty: '보통',
    주요고민: '매출 성장 정체와 신규 고객 확보의 어려움, 디지털 전환 필요성',
    mainConcerns: '매출 성장 정체와 신규 고객 확보의 어려움, 디지털 전환 필요성',
    예상혜택: '매출 30% 증가 및 신규 시장 진출, 업무 효율성 향상',
    expectedBenefits: '매출 30% 증가 및 신규 시장 진출, 업무 효율성 향상',
    진행사업장: '서울시 강남구',
    businessLocation: '서울시 강남구',
    담당자명: '홍길동',
    contactName: '홍길동',
    연락처: '010-1234-5678',
    contactPhone: '010-1234-5678',
    이메일: 'test@aitest.com',
    contactEmail: 'test@aitest.com',
    개인정보처리동의: '동의',
    privacyConsent: true
  };

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(spreadsheet, AI_DIAGNOSIS_SHEET);
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    const result = processAIDiagnosisForm(sheet, testData, output);
    console.log('AI 진단 테스트 결과:', result);
    
    return result;
  } catch (error) {
    console.error('AI 진단 테스트 오류:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * 테스트 함수 (스크립트 편집기에서 직접 실행 가능)
 */
function testFunction() {
  const testData = {
    제출일시: new Date().toLocaleString('ko-KR'),
    회사명: '테스트 회사',
    업종: 'IT/소프트웨어',
    사업단계: '스타트업',
    직원수: '10명 이하',
    설립년도: '2024',
    주요고민: '디지털 전환과 마케팅 전략 수립',
    예상예산: '500만원 이하',
    진행시급성: '1개월 이내',
    담당자명: '홍길동',
    연락처: '010-1234-5678',
    이메일: 'test@example.com'
  };

  const result = addToSpreadsheet(testData);
  console.log('테스트 결과:', result);
  
  return result;
}

/**
 * 스프레드시트에 데이터 추가
 */
function addToSpreadsheet(data) {
  try {
    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // 헤더 추가
      const headers = [
        '제출일시', '회사명', '업종', '사업단계', '직원수', '설립년도',
        '주요고민', '예상예산', '진행시급성', '담당자명', '연락처', '이메일'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 헤더 스타일 설정
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }

    // 새 행 데이터 준비
    const rowData = [
      data.제출일시 || '',
      data.회사명 || '',
      data.업종 || '',
      data.사업단계 || '',
      data.직원수 || '',
      data.설립년도 || '',
      data.주요고민 || '',
      data.예상예산 || '',
      data.진행시급성 || '',
      data.담당자명 || '',
      data.연락처 || '',
      data.이메일 || ''
    ];

    // 다음 빈 행 찾기
    const lastRow = sheet.getLastRow();
    const newRowNumber = lastRow + 1;

    // 데이터 추가
    sheet.getRange(newRowNumber, 1, 1, rowData.length).setValues([rowData]);

    // 자동 크기 조정
    sheet.autoResizeColumns(1, rowData.length);

    console.log(`데이터 저장 완료: ${data.회사명} (행 ${newRowNumber})`);

    return {
      success: true,
      rowNumber: newRowNumber
    };

  } catch (error) {
    console.error('스프레드시트 저장 오류:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
} 