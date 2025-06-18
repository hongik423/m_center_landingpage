/**
 * M-CENTER 경영지도센터 - Google Apps Script
 * 업데이트 일자: 2025.6.17
 * 새로운 Google Sheets ID: 1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug
 * Apps Script 프로젝트 ID: 1eq4jLxuXgVfjH76MJRPq6aetIybwNjD2IpvLWgY3wlfDLPW2h2hzEjAC
 * 웹앱 URL: https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec
 */

// 📊 Google Sheets 설정 (2025.6.17 업데이트)
const SPREADSHEET_ID = '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug';
const AI_DIAGNOSIS_SHEET = 'AI_진단신청';
const CONSULTATION_SHEET = '상담신청';

// 📧 이메일 설정
const ADMIN_EMAIL = 'hongik423@gmail.com';
const COMPANY_NAME = 'M-CENTER 경영지도센터';

// 🔧 유틸리티 함수
function getCurrentKoreanTime() {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
  return Utilities.formatDate(koreaTime, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
}

function generateUniqueId() {
  return 'MC' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMddHHmmss') + Math.random().toString(36).substr(2, 4).toUpperCase();
}

function logError(functionName, error, data = null) {
  console.error(`[${functionName}] 오류:`, error.toString());
  if (data) {
    console.error(`[${functionName}] 입력 데이터:`, JSON.stringify(data));
  }
}

// 📊 AI 진단 신청 처리 (기존 기능 유지)
function processAIDiagnosis(data) {
  try {
    console.log('🔵 AI 진단 신청 처리 시작:', data);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(AI_DIAGNOSIS_SHEET);
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = spreadsheet.insertSheet(AI_DIAGNOSIS_SHEET);
      // 헤더 추가
      const headers = [
        '제출일시', '회사명', '업종', '사업담당자', '직원수', '사업성장단계',
        '주요고민사항', '예상혜택', '진행사업장', '담당자명', '연락처', '이메일',
        '개인정보동의', '폼타입', '고유ID', '진단상태', 'AI분석결과', '결과URL',
        '분석완료일시', '상담신청여부', '상담완료일시', '비고'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    // 데이터 준비
    const uniqueId = generateUniqueId();
    const submitTime = getCurrentKoreanTime();
    
    const rowData = [
      submitTime,                                           // A: 제출일시
      data.회사명 || data.companyName || '',                // B: 회사명
      data.업종 || data.industry || '',                     // C: 업종
      data.사업담당자 || data.businessManager || '',         // D: 사업담당자
      data.직원수 || data.employeeCount || '',              // E: 직원수
      data.사업성장단계 || data.establishmentDifficulty || '', // F: 사업성장단계
      data.주요고민사항 || data.mainConcerns || '',           // G: 주요고민사항
      data.예상혜택 || data.expectedBenefits || '',          // H: 예상혜택
      data.진행사업장 || data.businessLocation || '',        // I: 진행사업장
      data.담당자명 || data.contactName || '',              // J: 담당자명
      data.연락처 || data.contactPhone || '',               // K: 연락처
      data.이메일 || data.contactEmail || '',               // L: 이메일
      data.개인정보동의 === true || data.개인정보동의 === '동의' ? '동의' : '미동의', // M: 개인정보동의
      data.폼타입 || 'AI_무료진단',                          // N: 폼타입
      uniqueId,                                            // O: 고유ID
      '접수완료',                                           // P: 진단상태
      '',                                                  // Q: AI분석결과
      '',                                                  // R: 결과URL
      '',                                                  // S: 분석완료일시
      '미신청',                                             // T: 상담신청여부
      '',                                                  // U: 상담완료일시
      ''                                                   // V: 비고
    ];
    
    // 데이터 추가
    sheet.appendRow(rowData);
    const lastRow = sheet.getLastRow();
    
    console.log('✅ AI 진단 신청 저장 완료:', {
      uniqueId: uniqueId,
      row: lastRow,
      company: data.회사명 || data.companyName,
      email: data.이메일 || data.contactEmail
    });
    
    // 관리자 이메일 발송
    try {
      const emailSubject = `[M-CENTER] 새로운 AI 진단 신청 - ${data.회사명 || data.companyName}`;
      const emailBody = `
새로운 AI 진단 신청이 접수되었습니다.

📊 신청 정보:
• 회사명: ${data.회사명 || data.companyName}
• 업종: ${data.업종 || data.industry}
• 담당자: ${data.담당자명 || data.contactName}
• 연락처: ${data.연락처 || data.contactPhone}
• 이메일: ${data.이메일 || data.contactEmail}
• 주요 고민: ${data.주요고민사항 || data.mainConcerns}

⏰ 신청 시간: ${submitTime}
🆔 고유 ID: ${uniqueId}

📋 상세 내용 확인:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit

신속한 AI 진단 처리를 부탁드립니다.

M-CENTER 자동 알림 시스템
      `;
      
      GmailApp.sendEmail(ADMIN_EMAIL, emailSubject, emailBody);
      console.log('📧 관리자 알림 이메일 발송 완료');
    } catch (emailError) {
      console.error('📧 이메일 발송 오류:', emailError);
    }
    
    return {
      success: true,
      message: 'AI 진단 신청이 접수되었습니다.',
      uniqueId: uniqueId,
      row: lastRow,
      timestamp: submitTime
    };
    
  } catch (error) {
    logError('processAIDiagnosis', error, data);
    return {
      success: false,
      error: 'AI 진단 신청 처리 중 오류가 발생했습니다.',
      details: error.toString()
    };
  }
}

// 🎯 상담 신청 처리 (진단-상담 연계 기능 강화)
function processConsultationForm(data) {
  try {
    console.log('🔵 상담 신청 처리 시작:', data);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONSULTATION_SHEET);
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONSULTATION_SHEET);
      // 헤더 추가 (15개 컬럼)
      const headers = [
        '제출일시', '상담유형', '성명', '연락처', '이메일',           // A-E
        '회사명', '직책', '상담분야', '문의내용', '희망상담시간',      // F-J
        '개인정보동의', '진단연계여부', '진단점수', '추천서비스', '상담상태' // K-O
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    // 데이터 준비
    const submitTime = getCurrentKoreanTime();
    const isDiagnosisLinked = data.진단연계여부 === 'Y' || data.isDiagnosisLinked === true;
    
    const rowData = [
      submitTime,                                     // A: 제출일시
      data.상담유형 || data.consultationType || '일반상담', // B: 상담유형
      data.성명 || data.contactName || '',            // C: 성명
      data.연락처 || data.contactPhone || '',         // D: 연락처
      data.이메일 || data.contactEmail || '',         // E: 이메일
      data.회사명 || data.companyName || '',          // F: 회사명
      data.직책 || data.position || '',              // G: 직책
      data.상담분야 || data.consultationField || '',   // H: 상담분야
      data.문의내용 || data.inquiryContent || '',     // I: 문의내용
      data.희망상담시간 || data.preferredTime || '',   // J: 희망상담시간
      data.개인정보동의 === true || data.개인정보동의 === '동의' ? '동의' : '미동의', // K: 개인정보동의
      isDiagnosisLinked ? 'Y' : 'N',                 // L: 진단연계여부
      data.진단점수 || data.diagnosisScore || '',     // M: 진단점수
      data.추천서비스 || data.recommendedService || '', // N: 추천서비스
      '접수완료'                                      // O: 상담상태
    ];
    
    // 데이터 추가
    sheet.appendRow(rowData);
    const lastRow = sheet.getLastRow();
    
    console.log('✅ 상담 신청 저장 완료:', {
      row: lastRow,
      company: data.회사명 || data.companyName,
      email: data.이메일 || data.contactEmail,
      isDiagnosisLinked: isDiagnosisLinked
    });
    
    // 진단 연계인 경우 AI 진단 시트도 업데이트
    if (isDiagnosisLinked && (data.이메일 || data.contactEmail)) {
      try {
        updateDiagnosisConsultationStatus(data.이메일 || data.contactEmail);
      } catch (updateError) {
        console.error('진단 시트 업데이트 오류:', updateError);
      }
    }
    
    // 관리자 이메일 발송
    try {
      const consultationType = isDiagnosisLinked ? '진단연계 상담' : '일반 상담';
      const emailSubject = `[M-CENTER] 새로운 ${consultationType} 신청 - ${data.회사명 || data.companyName}`;
      const emailBody = `
새로운 ${consultationType} 신청이 접수되었습니다.

👤 신청자 정보:
• 성명: ${data.성명 || data.contactName}
• 회사명: ${data.회사명 || data.companyName}
• 직책: ${data.직책 || data.position}
• 연락처: ${data.연락처 || data.contactPhone}
• 이메일: ${data.이메일 || data.contactEmail}

📞 상담 정보:
• 상담유형: ${data.상담유형 || data.consultationType || '일반상담'}
• 상담분야: ${data.상담분야 || data.consultationField}
• 희망시간: ${data.희망상담시간 || data.preferredTime}
• 문의내용: ${data.문의내용 || data.inquiryContent}

${isDiagnosisLinked ? `
🎯 진단 연계 정보:
• 진단점수: ${data.진단점수 || data.diagnosisScore}점
• 추천서비스: ${data.추천서비스 || data.recommendedService}
` : ''}

⏰ 신청 시간: ${submitTime}

📋 상세 내용 확인:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${sheet.getSheetId()}

신속한 상담 일정 조율을 부탁드립니다.

M-CENTER 자동 알림 시스템
      `;
      
      GmailApp.sendEmail(ADMIN_EMAIL, emailSubject, emailBody);
      console.log('📧 상담신청 관리자 알림 이메일 발송 완료');
    } catch (emailError) {
      console.error('📧 이메일 발송 오류:', emailError);
    }
    
    return {
      success: true,
      message: '상담 신청이 접수되었습니다.',
      row: lastRow,
      timestamp: submitTime,
      isDiagnosisLinked: isDiagnosisLinked
    };
    
  } catch (error) {
    logError('processConsultationForm', error, data);
    return {
      success: false,
      error: '상담 신청 처리 중 오류가 발생했습니다.',
      details: error.toString()
    };
  }
}

// 🔄 진단 시트에서 상담 신청 상태 업데이트
function updateDiagnosisConsultationStatus(email) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(AI_DIAGNOSIS_SHEET);
    
    if (!sheet) return;
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // 이메일로 행 찾기 (L열이 이메일)
    for (let i = 1; i < values.length; i++) {
      if (values[i][11] === email) { // L열 (12번째 컬럼, 인덱스 11)
        // T열 (20번째 컬럼, 인덱스 19)에 상담신청 상태 업데이트
        sheet.getRange(i + 1, 20).setValue('신청완료');
        // U열 (21번째 컬럼, 인덱스 20)에 상담신청 일시 기록
        sheet.getRange(i + 1, 21).setValue(getCurrentKoreanTime());
        
        console.log('✅ 진단 시트 상담신청 상태 업데이트 완료:', email);
        break;
      }
    }
  } catch (error) {
    console.error('❌ 진단 시트 상담신청 상태 업데이트 오류:', error);
  }
}

// 📊 진단 결과 업데이트 (기존 기능 유지)
function updateDiagnosisResults(email, diagnosisResult, resultUrl) {
  try {
    console.log('🔵 진단 결과 업데이트 시작:', { email, hasResult: !!diagnosisResult, resultUrl });
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(AI_DIAGNOSIS_SHEET);
    
    if (!sheet) {
      throw new Error('AI 진단 시트를 찾을 수 없습니다.');
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // 이메일로 해당 행 찾기
    for (let i = 1; i < values.length; i++) {
      if (values[i][11] === email) { // L열이 이메일
        // 진단 상태 업데이트 (P열, 16번째 컬럼)
        sheet.getRange(i + 1, 16).setValue('분석완료');
        
        // AI 분석 결과 업데이트 (Q열, 17번째 컬럼)
        const resultText = typeof diagnosisResult === 'object' 
          ? JSON.stringify(diagnosisResult) 
          : diagnosisResult;
        sheet.getRange(i + 1, 17).setValue(resultText);
        
        // 결과 URL 업데이트 (R열, 18번째 컬럼)
        if (resultUrl) {
          sheet.getRange(i + 1, 18).setValue(resultUrl);
        }
        
        // 분석 완료 일시 업데이트 (S열, 19번째 컬럼)
        sheet.getRange(i + 1, 19).setValue(getCurrentKoreanTime());
        
        console.log('✅ 진단 결과 업데이트 완료:', email);
        return {
          success: true,
          message: '진단 결과가 업데이트되었습니다.',
          row: i + 1
        };
      }
    }
    
    console.warn('⚠️ 해당 이메일로 진단 신청 데이터를 찾을 수 없습니다:', email);
    return {
      success: false,
      error: '해당 이메일로 진단 신청 데이터를 찾을 수 없습니다.'
    };
    
  } catch (error) {
    logError('updateDiagnosisResults', error, { email, resultUrl });
    return {
      success: false,
      error: '진단 결과 업데이트 중 오류가 발생했습니다.',
      details: error.toString()
    };
  }
}

// 📖 진단 데이터 조회
function getDiagnosisData(email) {
  try {
    console.log('🔵 진단 데이터 조회 시작:', email);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(AI_DIAGNOSIS_SHEET);
    
    if (!sheet) {
      throw new Error('AI 진단 시트를 찾을 수 없습니다.');
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // 이메일로 해당 행 찾기
    for (let i = 1; i < values.length; i++) {
      if (values[i][11] === email) { // L열이 이메일
        const rowData = {
          제출일시: values[i][0],
          회사명: values[i][1],
          업종: values[i][2],
          사업담당자: values[i][3],
          직원수: values[i][4],
          사업성장단계: values[i][5],
          주요고민사항: values[i][6],
          예상혜택: values[i][7],
          진행사업장: values[i][8],
          담당자명: values[i][9],
          연락처: values[i][10],
          이메일: values[i][11],
          개인정보동의: values[i][12],
          폼타입: values[i][13],
          고유ID: values[i][14],
          진단상태: values[i][15],
          AI분석결과: values[i][16],
          결과URL: values[i][17],
          분석완료일시: values[i][18],
          상담신청여부: values[i][19],
          상담완료일시: values[i][20],
          비고: values[i][21]
        };
        
        console.log('✅ 진단 데이터 조회 완료:', email);
        return {
          success: true,
          data: rowData,
          row: i + 1
        };
      }
    }
    
    console.warn('⚠️ 해당 이메일로 진단 데이터를 찾을 수 없습니다:', email);
    return {
      success: false,
      error: '해당 이메일로 진단 데이터를 찾을 수 없습니다.'
    };
    
  } catch (error) {
    logError('getDiagnosisData', error, email);
    return {
      success: false,
      error: '진단 데이터 조회 중 오류가 발생했습니다.',
      details: error.toString()
    };
  }
}

// 🔗 연결 테스트
function testConnection() {
  try {
    const testTime = getCurrentKoreanTime();
    console.log('🔵 연결 테스트 시작:', testTime);
    
    return {
      success: true,
      message: 'Google Apps Script 연결 성공',
      timestamp: testTime,
      spreadsheetId: SPREADSHEET_ID,
      version: '2.0 (2025.6.17)'
    };
  } catch (error) {
    logError('testConnection', error);
    return {
      success: false,
      error: '연결 테스트 실패',
      details: error.toString()
    };
  }
}

// 🌐 웹앱 진입점 (doGet/doPost)
function doGet(e) {
  try {
    console.log('🔵 GET 요청 수신:', e.parameter);
    
    // 기본 연결 테스트
    if (!e.parameter.action) {
      return ContentService
        .createTextOutput(JSON.stringify(testConnection()))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 특정 액션 처리
    let result = {};
    switch (e.parameter.action) {
      case 'test':
        result = testConnection();
        break;
      case 'get':
        result = getDiagnosisData(e.parameter.email);
        break;
      default:
        result = { success: false, error: '지원하지 않는 액션입니다.' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    logError('doGet', error, e.parameter);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'GET 요청 처리 중 오류가 발생했습니다.',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    console.log('🔵 POST 요청 수신');
    
    let postData = {};
    
    // 요청 데이터 파싱
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
        console.log('📦 파싱된 데이터:', Object.keys(postData));
      } catch (parseError) {
        console.error('❌ JSON 파싱 오류:', parseError);
        return ContentService
          .createTextOutput(JSON.stringify({ 
            success: false, 
            error: 'JSON 파싱 오류' 
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } else {
      console.log('📦 폼 데이터 사용:', e.parameter);
      postData = e.parameter;
    }
    
    let result = {};
    
    // 액션 기반 처리
    if (postData.action) {
      switch (postData.action) {
        case 'update':
          result = updateDiagnosisResults(
            postData.searchEmail,
            postData.AI분석결과,
            postData.결과URL
          );
          break;
        case 'get':
          result = getDiagnosisData(postData.email);
          break;
        case 'consultation':
          result = processConsultationForm(postData);
          break;
        default:
          result = processAIDiagnosis(postData);
      }
    } else {
      // 기본: AI 진단 또는 상담신청 처리
      if (postData.상담유형 || postData.consultationType) {
        result = processConsultationForm(postData);
      } else {
        result = processAIDiagnosis(postData);
      }
    }
    
    console.log('✅ 처리 완료:', result.success ? 'SUCCESS' : 'FAILED');
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    logError('doPost', error, e.postData);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'POST 요청 처리 중 오류가 발생했습니다.',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 🧪 테스트 함수들
function testAIDiagnosis() {
  const testData = {
    회사명: '테스트기업(주)',
    업종: 'IT/소프트웨어',
    사업담당자: '김테스트',
    직원수: '6-10명',
    사업성장단계: '2단계 프로토타입단계',
    주요고민사항: '매출 성장 정체',
    예상혜택: '월 매출 30% 증가',
    진행사업장: '서울시 강남구',
    담당자명: '홍길동',
    연락처: '010-1234-5678',
    이메일: 'test@company.com',
    개인정보동의: true
  };
  
  return processAIDiagnosis(testData);
}

function testConsultation() {
  const testData = {
    상담유형: '진단연계상담',
    성명: '이상담',
    연락처: '010-9876-5432',
    이메일: 'consultation@company.com',
    회사명: '상담테스트기업',
    직책: '대표이사',
    상담분야: 'BM ZEN 사업분석',
    문의내용: 'AI 진단 결과에 따른 사업분석 상담을 요청드립니다.',
    희망상담시간: '평일 오후 2-5시',
    개인정보동의: true,
    진단연계여부: 'Y',
    진단점수: '82점',
    추천서비스: 'BM ZEN 사업분석'
  };
  
  return processConsultationForm(testData);
}

function testAllFunctions() {
  console.log('🧪 전체 기능 테스트 시작');
  
  console.log('1. 연결 테스트:', testConnection());
  console.log('2. AI 진단 테스트:', testAIDiagnosis());
  console.log('3. 상담신청 테스트:', testConsultation());
  
  console.log('🧪 전체 기능 테스트 완료');
}

/**
 * 📋 설치 및 설정 가이드
 * 
 * 1. 이 코드를 Google Apps Script 프로젝트에 복사
 * 2. SPREADSHEET_ID를 실제 Google Sheets ID로 변경
 * 3. ADMIN_EMAIL을 관리자 이메일로 변경
 * 4. 프로젝트 저장 후 배포 → 새 배포 → 웹 앱
 * 5. 실행 사용자: 나, 액세스 권한: 모든 사용자
 * 6. 배포 후 웹앱 URL을 Next.js 환경변수에 설정
 * 
 * 📞 문의: hongik423@gmail.com / 010-9251-9743
 */ 