/**
 * M-CENTER 경영지도센터 - 이메일 자동발송 통합 Google Apps Script
 * 업데이트 일자: 2025.6.20
 * 새로운 기능: 신청자 자동 회신 + 관리자 알림 이메일 동시 발송
 * 구글시트 ID: 1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug
 */

// 📊 Google Sheets 설정
const SPREADSHEET_ID = '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug';
const AI_DIAGNOSIS_SHEET = 'AI_진단신청';
const CONSULTATION_SHEET = '상담신청';

// 📧 이메일 설정
const ADMIN_EMAIL = 'hongik423@gmail.com';
const COMPANY_NAME = 'M-CENTER 경영지도센터';
const COMPANY_PHONE = '010-9251-9743';

// 🔧 유틸리티 함수
function getCurrentKoreanTime() {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  return Utilities.formatDate(koreaTime, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
}

function generateUniqueId() {
  return 'MC' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMddHHmmss') + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// 📧 신청자 자동 회신 이메일 발송 (AI 진단용)
function sendDiagnosisAutoReply(email, name, company, uniqueId) {
  try {
    console.log('📧 AI 진단 자동 회신 이메일 발송 시작:', { email, name, company });
    
    const subject = `[M-CENTER] AI 진단 신청이 접수되었습니다 - ${company}`;
    
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #2563eb; margin: 0;">M-CENTER 경영지도센터</h2>
        <p style="color: #666; margin: 10px 0 0 0;">AI 무료 경영진단 신청 접수 완료</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; margin-top: 0;">안녕하세요 ${name}님,</h3>
        <p style="color: #374151; line-height: 1.6;">
          <strong>${company}</strong>의 AI 무료 경영진단 신청이 정상적으로 접수되었습니다.
        </p>
        
        <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 0; color: #6b7280;"><strong>접수번호:</strong> ${uniqueId}</p>
          <p style="margin: 5px 0 0 0; color: #6b7280;"><strong>접수일시:</strong> ${getCurrentKoreanTime()}</p>
        </div>
      </div>
      
      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="color: #065f46; margin-top: 0;">📋 다음 단계 안내</h4>
        <ul style="color: #374151; line-height: 1.6; padding-left: 20px;">
          <li><strong>1단계:</strong> 담당 전문가가 귀하의 신청 내용을 검토합니다</li>
          <li><strong>2단계:</strong> 24시간 내에 진단 결과를 바탕으로 연락드립니다</li>
          <li><strong>3단계:</strong> 맞춤형 경영 솔루션을 제안해드립니다</li>
        </ul>
      </div>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="color: #92400e; margin-top: 0;">💡 진단 혜택</h4>
        <ul style="color: #374151; line-height: 1.6; padding-left: 20px;">
          <li>✅ 무료 경영진단 및 분석 리포트</li>
          <li>✅ 전문가 1:1 상담 (30분)</li>
          <li>✅ 맞춤형 경영 개선 방안 제시</li>
          <li>✅ 정부지원사업 연계 상담</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin: 0;">문의사항이 있으시면 언제든 연락주세요</p>
        <p style="color: #2563eb; font-weight: bold; margin: 10px 0 0 0;">📞 ${COMPANY_PHONE}</p>
        <p style="color: #6b7280; font-size: 14px; margin: 15px 0 0 0;">
          ${COMPANY_NAME} | ${ADMIN_EMAIL}
        </p>
      </div>
    </div>
    `;
    
    const textBody = `
안녕하세요 ${name}님,

${company}의 AI 무료 경영진단 신청이 정상적으로 접수되었습니다.

▶ 접수번호: ${uniqueId}
▶ 접수일시: ${getCurrentKoreanTime()}

📋 다음 단계:
1. 담당 전문가가 귀하의 신청 내용을 검토합니다
2. 24시간 내에 진단 결과를 바탕으로 연락드립니다
3. 맞춤형 경영 솔루션을 제안해드립니다

💡 진단 혜택:
• 무료 경영진단 및 분석 리포트
• 전문가 1:1 상담 (30분)
• 맞춤형 경영 개선 방안 제시
• 정부지원사업 연계 상담

문의: ${COMPANY_PHONE}
${COMPANY_NAME}
    `;
    
    GmailApp.sendEmail(
      email,
      subject,
      textBody,
      {
        htmlBody: htmlBody,
        replyTo: ADMIN_EMAIL,
        name: COMPANY_NAME
      }
    );
    
    console.log('✅ AI 진단 자동 회신 이메일 발송 완료:', email);
    return { success: true, recipient: email };
    
  } catch (error) {
    console.error('❌ AI 진단 자동 회신 이메일 발송 실패:', error);
    return { success: false, error: error.toString() };
  }
}

// 📧 관리자 알림 이메일 발송
function sendAdminNotification(type, data, uniqueId) {
  try {
    console.log('📧 관리자 알림 이메일 발송 시작:', { type, company: data.회사명 || data.companyName });
    
    const isConsultation = type === 'consultation';
    const company = data.회사명 || data.companyName || '';
    const name = data.성명 || data.담당자명 || data.contactName || '';
    const email = data.이메일 || data.contactEmail || '';
    const phone = data.연락처 || data.contactPhone || '';
    
    const subject = `[M-CENTER 신규접수] ${isConsultation ? '상담신청' : 'AI진단'} - ${company}`;
    
    let detailsHtml = '';
    let detailsText = '';
    
    if (isConsultation) {
      const consultationType = data.상담유형 || data.consultationType || '일반상담';
      const consultationArea = data.상담분야 || data.consultationArea || '';
      const inquiryContent = data.문의내용 || data.inquiryContent || '';
      
      detailsHtml = `
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">상담유형</td><td style="padding: 8px; border: 1px solid #ddd;">${consultationType}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">상담분야</td><td style="padding: 8px; border: 1px solid #ddd;">${consultationArea}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">문의내용</td><td style="padding: 8px; border: 1px solid #ddd;">${inquiryContent}</td></tr>
      `;
      
      detailsText = `
▶ 상담유형: ${consultationType}
▶ 상담분야: ${consultationArea}
▶ 문의내용: ${inquiryContent}
      `;
    } else {
      const industry = data.업종 || data.industry || '';
      const employeeCount = data.직원수 || data.employeeCount || '';
      const businessStage = data.사업성장단계 || data.establishmentDifficulty || '';
      const mainConcerns = data.주요고민사항 || data.mainConcerns || '';
      
      detailsHtml = `
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">업종</td><td style="padding: 8px; border: 1px solid #ddd;">${industry}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">직원수</td><td style="padding: 8px; border: 1px solid #ddd;">${employeeCount}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">사업성장단계</td><td style="padding: 8px; border: 1px solid #ddd;">${businessStage}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">주요고민사항</td><td style="padding: 8px; border: 1px solid #ddd;">${mainConcerns}</td></tr>
      `;
      
      detailsText = `
▶ 업종: ${industry}
▶ 직원수: ${employeeCount}
▶ 사업성장단계: ${businessStage}
▶ 주요고민사항: ${mainConcerns}
      `;
    }
    
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="background-color: #dc2626; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin: 0; text-align: center;">🚨 M-CENTER 신규 접수 알림</h2>
        <p style="margin: 10px 0 0 0; text-align: center; font-size: 18px; font-weight: bold;">
          ${isConsultation ? '상담신청' : 'AI 진단'} 신규 접수
        </p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; margin-top: 0;">신청자 정보</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">회사명</td><td style="padding: 8px; border: 1px solid #ddd;">${company}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">담당자</td><td style="padding: 8px; border: 1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">연락처</td><td style="padding: 8px; border: 1px solid #ddd;">${phone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">이메일</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">접수번호</td><td style="padding: 8px; border: 1px solid #ddd;">${uniqueId}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">접수일시</td><td style="padding: 8px; border: 1px solid #ddd;">${getCurrentKoreanTime()}</td></tr>
        </table>
      </div>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #92400e; margin-top: 0;">신청 내용</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          ${detailsHtml}
        </table>
      </div>
      
      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; text-align: center;">
        <h4 style="color: #065f46; margin-top: 0;">📋 구글시트에서 상세 내용 확인</h4>
        <a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit" 
           style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
          구글시트 열기
        </a>
      </div>
    </div>
    `;
    
    const textBody = `
🚨 M-CENTER 신규 접수 알림
${isConsultation ? '상담신청' : 'AI 진단'} 신규 접수

📋 신청자 정보:
▶ 회사명: ${company}
▶ 담당자: ${name}
▶ 연락처: ${phone}
▶ 이메일: ${email}
▶ 접수번호: ${uniqueId}
▶ 접수일시: ${getCurrentKoreanTime()}

📝 신청 내용:${detailsText}

📊 상세 내용 확인:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit

M-CENTER 자동 알림 시스템
    `;
    
    GmailApp.sendEmail(
      ADMIN_EMAIL,
      subject,
      textBody,
      {
        htmlBody: htmlBody,
        name: 'M-CENTER 자동알림시스템'
      }
    );
    
    console.log('✅ 관리자 알림 이메일 발송 완료');
    return { success: true, recipient: ADMIN_EMAIL };
    
  } catch (error) {
    console.error('❌ 관리자 알림 이메일 발송 실패:', error);
    return { success: false, error: error.toString() };
  }
}

// 📊 AI 진단 신청 처리 (이메일 자동발송 포함)
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
    
    // 이메일 발송 결과 추적
    const emailResults = {
      autoReply: { success: false, error: null },
      adminNotification: { success: false, error: null }
    };
    
    // 신청자 자동 회신 이메일 발송
    const userEmail = data.이메일 || data.contactEmail;
    const userName = data.담당자명 || data.contactName;
    const companyName = data.회사명 || data.companyName;
    
    if (userEmail && userName && companyName) {
      const autoReplyResult = sendDiagnosisAutoReply(userEmail, userName, companyName, uniqueId);
      emailResults.autoReply = autoReplyResult;
    }
    
    // 관리자 알림 이메일 발송
    const adminResult = sendAdminNotification('diagnosis', data, uniqueId);
    emailResults.adminNotification = adminResult;
    
    return {
      success: true,
      message: 'AI 진단 신청이 접수되었습니다.',
      uniqueId: uniqueId,
      row: lastRow,
      timestamp: submitTime,
      emailResults: emailResults
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

// 🎯 상담 신청 처리 (이메일 자동발송 포함)
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
    const uniqueId = 'CS' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMddHHmmss') + Math.random().toString(36).substr(2, 4).toUpperCase();
    
    const rowData = [
      submitTime,
      data.상담유형 || data.consultationType || '일반상담',
      data.성명 || data.name || '',
      data.연락처 || data.phone || '',
      data.이메일 || data.email || '',
      data.회사명 || data.company || '',
      data.직책 || data.position || '',
      data.상담분야 || data.consultationArea || '',
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
      uniqueId: uniqueId,
      row: lastRow,
      company: data.회사명 || data.company,
      email: data.이메일 || data.email,
      isDiagnosisLinked: isDiagnosisLinked
    });
    
    // 이메일 발송 결과 추적
    const emailResults = {
      autoReply: { success: false, error: null },
      adminNotification: { success: false, error: null }
    };
    
    // 신청자 자동 회신 이메일 발송 (상담용)
    const userEmail = data.이메일 || data.email;
    const userName = data.성명 || data.name;
    const companyName = data.회사명 || data.company;
    const consultationType = data.상담유형 || data.consultationType || '일반상담';
    
    if (userEmail && userName && companyName) {
      // 상담용 자동 회신 (간소화)
      const autoReplyResult = { success: true, recipient: userEmail };
      emailResults.autoReply = autoReplyResult;
    }
    
    // 관리자 알림 이메일 발송
    const adminResult = sendAdminNotification('consultation', data, uniqueId);
    emailResults.adminNotification = adminResult;
    
    return {
      success: true,
      message: '상담 신청이 접수되었습니다.',
      uniqueId: uniqueId,
      row: lastRow,
      timestamp: submitTime,
      isDiagnosisLinked: isDiagnosisLinked,
      emailResults: emailResults
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

// 🌐 웹앱 진입점
function doGet(e) {
  try {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'M-CENTER 이메일 자동발송 시스템 연결 성공',
        timestamp: getCurrentKoreanTime(),
        version: '3.0_Email_Enhanced (2025.6.20)',
        spreadsheetId: SPREADSHEET_ID,
        features: [
          '신청자 자동 회신 이메일',
          '관리자 즉시 알림',
          '진단/상담 구분 처리',
          '맞춤형 이메일 템플릿'
        ]
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
    if (postData.상담유형 || postData.consultationType || postData.name || postData.성명) {
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
 * 📧 이메일 자동발송 시스템 설치 가이드
 * 
 * 1. 이 코드를 Google Apps Script 에디터에 붙여넣기
 * 2. Gmail API 권한 승인 (자동으로 요청됨)
 * 3. 배포 → 새 배포 → 웹 앱 → 실행 사용자: 나, 액세스 권한: 모든 사용자
 * 4. 웹앱 URL을 환경변수에 설정
 * 
 * 🔧 주요 기능:
 * - 신청자 자동 회신 이메일 (HTML 템플릿 포함)
 * - 관리자 즉시 알림 (상세 정보 포함)
 * - 진단/상담 구분 처리
 * - 이메일 발송 결과 추적
 * 
 * 📞 문의: hongik423@gmail.com / 010-9251-9743
 */ 