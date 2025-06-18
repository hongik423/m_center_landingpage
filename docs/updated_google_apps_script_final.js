/**
 * M-CENTER 경영지도센터 - Google Apps Script (최종 업데이트)
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
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  return Utilities.formatDate(koreaTime, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
}

function generateUniqueId() {
  return 'MC' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMddHHmmss') + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// 📊 AI 진단 신청 처리
function processAIDiagnosis(data) {
  try {
    console.log('🔵 AI 진단 신청 처리 시작:', data);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(AI_DIAGNOSIS_SHEET);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(AI_DIAGNOSIS_SHEET);
      const headers = [
        '제출일시', '회사명', '업종', '사업담당자', '직원수', '사업성장단계',
        '주요고민사항', '예상혜택', '진행사업장', '담당자명', '연락처', '이메일',
        '개인정보동의', '폼타입', '고유ID', '진단상태', 'AI분석결과', '결과URL',
        '분석완료일시', '상담신청여부', '상담완료일시', '비고'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    const uniqueId = generateUniqueId();
    const submitTime = getCurrentKoreanTime();
    
    const rowData = [
      submitTime,
      data.회사명 || data.companyName || '',
      data.업종 || data.industry || '',
      data.사업담당자 || data.businessManager || '',
      data.직원수 || data.employeeCount || '',
      data.사업성장단계 || data.establishmentDifficulty || '',
      data.주요고민사항 || data.mainConcerns || '',
      data.예상혜택 || data.expectedBenefits || '',
      data.진행사업장 || data.businessLocation || '',
      data.담당자명 || data.contactName || '',
      data.연락처 || data.contactPhone || '',
      data.이메일 || data.contactEmail || '',
      data.개인정보동의 === true || data.개인정보동의 === '동의' ? '동의' : '미동의',
      data.폼타입 || 'AI_무료진단',
      uniqueId,
      '접수완료',
      '',
      '',
      '',
      '미신청',
      '',
      ''
    ];
    
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

⏰ 신청 시간: ${submitTime}
🆔 고유 ID: ${uniqueId}

📋 상세 내용 확인:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit

M-CENTER 자동 알림 시스템
      `;
      
      GmailApp.sendEmail(ADMIN_EMAIL, emailSubject, emailBody);
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
    console.error('❌ AI 진단 신청 처리 오류:', error);
    return {
      success: false,
      error: 'AI 진단 신청 처리 중 오류가 발생했습니다.',
      details: error.toString()
    };
  }
}

// 🎯 상담 신청 처리
function processConsultationForm(data) {
  try {
    console.log('🔵 상담 신청 처리 시작:', data);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONSULTATION_SHEET);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONSULTATION_SHEET);
      const headers = [
        '제출일시', '상담유형', '성명', '연락처', '이메일',
        '회사명', '직책', '상담분야', '문의내용', '희망상담시간',
        '개인정보동의', '진단연계여부', '진단점수', '추천서비스', '상담상태'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    const submitTime = getCurrentKoreanTime();
    const isDiagnosisLinked = data.진단연계여부 === 'Y' || data.isDiagnosisLinked === true;
    
    const rowData = [
      submitTime,
      data.상담유형 || data.consultationType || '일반상담',
      data.성명 || data.contactName || '',
      data.연락처 || data.contactPhone || '',
      data.이메일 || data.contactEmail || '',
      data.회사명 || data.companyName || '',
      data.직책 || data.position || '',
      data.상담분야 || data.consultationField || '',
      data.문의내용 || data.inquiryContent || '',
      data.희망상담시간 || data.preferredTime || '',
      data.개인정보동의 === true || data.개인정보동의 === '동의' ? '동의' : '미동의',
      isDiagnosisLinked ? 'Y' : 'N',
      data.진단점수 || data.diagnosisScore || '',
      data.추천서비스 || data.recommendedService || '',
      '접수완료'
    ];
    
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
• 연락처: ${data.연락처 || data.contactPhone}
• 이메일: ${data.이메일 || data.contactEmail}

📞 상담 정보:
• 상담유형: ${data.상담유형 || data.consultationType || '일반상담'}
• 상담분야: ${data.상담분야 || data.consultationField}
• 문의내용: ${data.문의내용 || data.inquiryContent}

${isDiagnosisLinked ? `
🎯 진단 연계 정보:
• 진단점수: ${data.진단점수 || data.diagnosisScore}점
• 추천서비스: ${data.추천서비스 || data.recommendedService}
` : ''}

⏰ 신청 시간: ${submitTime}

📋 상세 내용 확인:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit

M-CENTER 자동 알림 시스템
      `;
      
      GmailApp.sendEmail(ADMIN_EMAIL, emailSubject, emailBody);
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
    console.error('❌ 상담 신청 처리 오류:', error);
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
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][11] === email) {
        sheet.getRange(i + 1, 20).setValue('신청완료');
        sheet.getRange(i + 1, 21).setValue(getCurrentKoreanTime());
        console.log('✅ 진단 시트 상담신청 상태 업데이트 완료:', email);
        break;
      }
    }
  } catch (error) {
    console.error('❌ 진단 시트 상담신청 상태 업데이트 오류:', error);
  }
}

// 🌐 웹앱 진입점
function doGet(e) {
  try {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'M-CENTER Google Apps Script 연결 성공',
        timestamp: getCurrentKoreanTime(),
        version: '2.0 (2025.6.17)',
        spreadsheetId: SPREADSHEET_ID
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    console.log('🔵 POST 요청 수신');
    
    let postData = {};
    
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (parseError) {
        return ContentService
          .createTextOutput(JSON.stringify({ 
            success: false, 
            error: 'JSON 파싱 오류' 
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } else {
      postData = e.parameter;
    }
    
    let result = {};
    
    // 상담신청인지 AI진단인지 구분
    if (postData.상담유형 || postData.consultationType) {
      result = processConsultationForm(postData);
    } else {
      result = processAIDiagnosis(postData);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ POST 요청 처리 오류:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'POST 요청 처리 중 오류가 발생했습니다.',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 📋 설치 및 설정 가이드
 * 
 * 1. 이 코드를 Google Apps Script에 붙여넣기
 * 2. SPREADSHEET_ID를 실제 Google Sheets ID로 변경: 1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug
 * 3. 배포 → 새 배포 → 웹 앱 → 실행 사용자: 나, 액세스 권한: 모든 사용자
 * 4. 웹앱 URL을 환경변수에 설정: NEXT_PUBLIC_GOOGLE_SCRIPT_URL
 * 
 * 📞 문의: hongik423@gmail.com / 010-9251-9743
 */ 