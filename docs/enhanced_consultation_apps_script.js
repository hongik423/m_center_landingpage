/**
 * ================================================================================
 * M-CENTER 진단연계 상담신청 처리 강화 Apps Script
 * ================================================================================
 * 
 * 📋 주요 기능:
 * 1. AI 진단 결과와 연계된 상담 신청 처리
 * 2. 진단-상담 연계 데이터 관리
 * 3. 자동 알림 및 추적 시스템
 * 
 * 📊 상담신청 시트 구조:
 * A: 제출일시     B: 상담유형     C: 성명         D: 연락처       E: 이메일
 * F: 회사명       G: 직책         H: 상담분야     I: 문의내용     J: 희망상담시간
 * K: 개인정보동의 L: 진단연계여부 M: 진단점수     N: 추천서비스   O: 상담상태
 */

// 환경설정
const SPREADSHEET_ID = '1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM';
const CONSULTATION_SHEET = '상담신청데이터';
const NOTIFICATION_EMAIL = 'hongik423@gmail.com';

/**
 * 상담 신청 요청 처리 (기존 doPost에 추가)
 */
function processConsultationWithDiagnosis(data, diagnosisInfo) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONSULTATION_SHEET);
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONSULTATION_SHEET);
    }
    
    // 헤더 설정
    if (sheet.getLastRow() === 0) {
      const headers = [
        '제출일시', '상담유형', '성명', '연락처', '이메일', '회사명', '직책',
        '상담분야', '문의내용', '희망상담시간', '개인정보동의', '진단연계여부',
        '진단점수', '추천서비스', '상담상태'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 헤더 스타일링
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#17a2b8');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
    }
    
    // 데이터 저장
    const rowData = [
      new Date().toLocaleString('ko-KR'),                    // A: 제출일시
      getConsultationTypeKorean(data.consultationType),      // B: 상담유형
      data.name || '',                                       // C: 성명
      data.phone || '',                                      // D: 연락처
      data.email || '',                                      // E: 이메일
      data.company || '',                                    // F: 회사명
      data.position || '',                                   // G: 직책
      getConsultationAreaKorean(data.consultationArea),     // H: 상담분야
      data.inquiryContent || '',                             // I: 문의내용
      getPreferredTimeKorean(data.preferredTime),           // J: 희망상담시간
      data.privacyConsent ? '동의' : '미동의',              // K: 개인정보동의
      diagnosisInfo.isLinked ? '진단연계' : '일반신청',     // L: 진단연계여부
      diagnosisInfo.score ? diagnosisInfo.score + '점' : '', // M: 진단점수
      diagnosisInfo.primaryService || '',                   // N: 추천서비스
      '접수완료'                                             // O: 상담상태
    ];
    
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    // 진단 연계 상담인 경우 행 강조
    if (diagnosisInfo.isLinked) {
      const rowRange = sheet.getRange(newRow, 1, 1, rowData.length);
      rowRange.setBackground('#e3f2fd');
    }
    
    // 알림 발송
    sendConsultationNotification(data, diagnosisInfo, newRow);
    
    Logger.log('✅ 상담신청 저장 완료 - 행: ' + newRow);
    return { success: true, rowNumber: newRow };
    
  } catch (error) {
    Logger.log('❌ 상담신청 저장 오류: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * 상담 유형 한글 변환
 */
function getConsultationTypeKorean(type) {
  const typeMap = {
    'phone': '전화상담',
    'online': '온라인상담',
    'email': '이메일상담',
    'visit': '방문상담'
  };
  return typeMap[type] || type;
}

/**
 * 상담 분야 한글 변환
 */
function getConsultationAreaKorean(area) {
  const areaMap = {
    'diagnosis': '기업 진단 결과 상담',
    'business-analysis': '비즈니스 분석',
    'ai-productivity': 'AI 생산성 향상',
    'certification': '인증 컨설팅',
    'tech-startup': '기술창업',
    'factory-auction': '공장경매',
    'website': '웹사이트 개발',
    'other': '기타'
  };
  return areaMap[area] || area;
}

/**
 * 희망 시간 한글 변환
 */
function getPreferredTimeKorean(time) {
  const timeMap = {
    'morning': '오전 (09:00-12:00)',
    'afternoon': '오후 (13:00-17:00)',
    'evening': '저녁 (18:00-20:00)',
    'flexible': '시간 조정 가능'
  };
  return timeMap[time] || time;
}

/**
 * 상담 신청 알림 이메일 발송
 */
function sendConsultationNotification(data, diagnosisInfo, rowNumber) {
  try {
    const subject = diagnosisInfo.isLinked 
      ? `[M-CENTER] 🔗 진단연계 상담신청 - ${data.name}`
      : `[M-CENTER] 💬 신규 상담신청 - ${data.name}`;
    
    const body = `
새로운 상담 신청이 접수되었습니다.

📋 신청자 정보:
- 성명: ${data.name}
- 회사명: ${data.company || '미입력'}
- 이메일: ${data.email}
- 연락처: ${data.phone}
- 상담유형: ${getConsultationTypeKorean(data.consultationType)}
- 상담분야: ${getConsultationAreaKorean(data.consultationArea)}

📝 문의내용:
${data.inquiryContent}

${diagnosisInfo.isLinked ? `
🔗 AI 진단 연계 정보:
- 진단점수: ${diagnosisInfo.score || 'N/A'}점
- 추천서비스: ${diagnosisInfo.primaryService || 'N/A'}

※ 이 상담신청은 AI 진단 결과를 바탕으로 한 연계 상담입니다.
` : ''}

🔗 구글시트: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}
📌 시트 위치: ${CONSULTATION_SHEET}, ${rowNumber}행

M-CENTER 상담신청 시스템
    `;

    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
    Logger.log('📧 상담신청 알림 발송 완료');
  } catch (error) {
    Logger.log('❌ 알림 발송 실패: ' + error.toString());
  }
} 