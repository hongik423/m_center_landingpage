/**
 * 🏢 M-CENTER 베타 피드백 이메일 발송 시스템
 * Google Apps Script 기반 통합 처리
 * 
 * ✅ 주요 기능:
 * 1. 베타 피드백 구글시트 저장
 * 2. 관리자 알림 이메일 자동 발송
 * 3. 피드백 제출자 접수 확인 이메일 자동 발송
 */

// 🔧 설정 정보
const CONFIG = {
  // 구글시트 ID (실제 ID 적용)
  SPREADSHEET_ID: '1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM',
  
  // 시트 이름
  SHEETS: {
    BETA_FEEDBACK: '베타피드백',
    ALL_DATA: '전체데이터'
  },
  
  // 이메일 설정
  EMAILS: {
    ADMIN: 'admin@m-center.co.kr',  // 관리자 이메일
    FROM_NAME: 'M-CENTER 베타테스트팀',
    REPLY_TO: 'support@m-center.co.kr'
  },
  
  // 이메일 템플릿 설정
  EMAIL_TEMPLATES: {
    ADMIN_SUBJECT: '[M-CENTER] 세금계산기 베타 피드백 접수',
    USER_SUBJECT: '[M-CENTER] 베타 피드백 접수 확인'
  }
};

/**
 * 🎯 메인 진입점 - POST 요청 처리
 */
function doPost(e) {
  try {
    console.log('📨 베타 피드백 POST 요청 수신');
    
    const postData = JSON.parse(e.postData.contents);
    console.log('📄 수신 데이터:', JSON.stringify(postData, null, 2));
    
    // action에 따른 분기 처리
    switch (postData.action) {
      case 'saveBetaFeedback':
        return handleBetaFeedback(postData);
      
      default:
        console.warn('⚠️ 알 수 없는 action:', postData.action);
        return ContentService
          .createTextOutput(JSON.stringify({
            success: false,
            error: '알 수 없는 요청 타입입니다.'
          }))
          .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('❌ POST 요청 처리 오류:', error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: '서버 오류가 발생했습니다.',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 🧪 베타 피드백 처리 함수
 */
function handleBetaFeedback(data) {
  try {
    console.log('🧪 베타 피드백 처리 시작');
    
    // 1. 구글시트에 저장
    const sheetResult = saveBetaFeedbackToSheet(data);
    
    if (!sheetResult.success) {
      throw new Error('구글시트 저장 실패: ' + sheetResult.error);
    }
    
    // 2. 이메일 발송 (관리자 + 사용자)
    const emailResults = {
      admin: sendAdminNotificationEmail(data),
      user: sendUserConfirmationEmail(data)
    };
    
    console.log('✅ 베타 피드백 처리 완료');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '베타 피드백이 성공적으로 처리되었습니다.',
        data: {
          timestamp: new Date().toISOString(),
          sheetRow: sheetResult.row,
          emails: emailResults
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ 베타 피드백 처리 오류:', error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: '베타 피드백 처리 중 오류가 발생했습니다.',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 📊 구글시트에 베타 피드백 저장
 */
function saveBetaFeedbackToSheet(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    
    // 베타 피드백 전용 시트 확인/생성
    let sheet;
    try {
      sheet = spreadsheet.getSheetByName(CONFIG.SHEETS.BETA_FEEDBACK);
    } catch (e) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEETS.BETA_FEEDBACK);
      
      // 헤더 행 생성
      const headers = [
        '제출일시', '계산기명', '피드백유형', '사용자이메일', '문제설명', 
        '기대동작', '실제동작', '재현단계', '심각도', '추가의견', 
        '브라우저정보', '제출경로', '처리상태', '처리일시'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    // 데이터 행 추가
    const rowData = [
      new Date(data.제출일시 || new Date()),
      data.계산기명 || '',
      data.피드백유형 || '',
      data.사용자이메일 || '',
      data.문제설명 || '',
      data.기대동작 || '',
      data.실제동작 || '',
      data.재현단계 || '',
      data.심각도 || '',
      data.추가의견 || '',
      data.브라우저정보 || '',
      data.제출경로 || '',
      '접수완료',
      new Date()
    ];
    
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    console.log('✅ 베타 피드백 구글시트 저장 완료, 행:', newRow);
    
    return {
      success: true,
      row: newRow,
      sheetName: CONFIG.SHEETS.BETA_FEEDBACK
    };
    
  } catch (error) {
    console.error('❌ 구글시트 저장 오류:', error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 📧 관리자 알림 이메일 발송
 */
function sendAdminNotificationEmail(data) {
  try {
    const subject = CONFIG.EMAIL_TEMPLATES.ADMIN_SUBJECT;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🧪 베타테스트 피드백 접수</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📊 피드백 정보</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #fff;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 150px;">계산기명</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.계산기명 || 'N/A'}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">피드백 유형</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.피드백유형 || 'N/A'}</td>
            </tr>
            <tr style="background: #fff;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">사용자 이메일</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.사용자이메일 || 'N/A'}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">제출일시</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.제출일시 || 'N/A'}</td>
            </tr>
          </table>
          
          <h3 style="color: #dc3545; margin-top: 25px;">🐛 문제 설명</h3>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #dc3545; margin: 10px 0;">
            ${data.문제설명 || 'N/A'}
          </div>
          
          ${data.기대동작 ? `
          <h3 style="color: #28a745;">✅ 기대 동작</h3>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #28a745; margin: 10px 0;">
            ${data.기대동작}
          </div>
          ` : ''}
          
          ${data.실제동작 ? `
          <h3 style="color: #ffc107;">⚠️ 실제 동작</h3>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #ffc107; margin: 10px 0;">
            ${data.실제동작}
          </div>
          ` : ''}
          
          ${data.재현단계 ? `
          <h3 style="color: #17a2b8;">🔄 재현 단계</h3>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #17a2b8; margin: 10px 0;">
            ${data.재현단계}
          </div>
          ` : ''}
          
          <h3 style="color: #6c757d;">💻 기술 정보</h3>
          <ul style="background: #fff; padding: 15px; margin: 10px 0; border-radius: 5px;">
            <li><strong>브라우저:</strong> ${data.브라우저정보 || 'N/A'}</li>
            <li><strong>제출 경로:</strong> ${data.제출경로 || 'N/A'}</li>
            <li><strong>심각도:</strong> ${data.심각도 || 'N/A'}</li>
          </ul>
          
          ${data.추가의견 ? `
          <h3 style="color: #6f42c1;">💬 추가 의견</h3>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #6f42c1; margin: 10px 0;">
            ${data.추가의견}
          </div>
          ` : ''}
        </div>
        
        <div style="background: #343a40; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0;">이 피드백에 대한 답변은 사용자 이메일(${data.사용자이메일})로 회신해주세요.</p>
        </div>
      </div>
    `;
    
    GmailApp.sendEmail(
      CONFIG.EMAILS.ADMIN,
      subject,
      '', // 텍스트 버전은 비움
      {
        htmlBody: htmlBody,
        name: CONFIG.EMAILS.FROM_NAME,
        replyTo: CONFIG.EMAILS.REPLY_TO
      }
    );
    
    console.log('✅ 관리자 알림 이메일 발송 완료');
    return { success: true, type: 'admin_notification' };
    
  } catch (error) {
    console.error('❌ 관리자 이메일 발송 오류:', error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * 📧 사용자 접수 확인 이메일 발송
 */
function sendUserConfirmationEmail(data) {
  try {
    const subject = CONFIG.EMAIL_TEMPLATES.USER_SUBJECT;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">✅ 피드백 접수 확인</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #333;">안녕하세요!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            <strong>${data.계산기명 || '세금계산기'}</strong>에 대한 베타테스트 피드백을 보내주셔서 감사합니다.
          </p>
          
          <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">📋 접수된 피드백 정보</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>피드백 유형:</strong> ${data.피드백유형}</li>
              <li><strong>접수 일시:</strong> ${new Date().toLocaleString('ko-KR')}</li>
              <li><strong>계산기:</strong> ${data.계산기명}</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">🔄 처리 절차</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li>개발팀에서 접수된 피드백을 검토합니다</li>
              <li>문제 재현 및 분석을 진행합니다</li>
              <li>수정사항이 있을 경우 업데이트를 진행합니다</li>
              <li>처리 결과를 이메일로 회신드립니다</li>
            </ol>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">⏰ 예상 처리 시간</h3>
            <p style="margin: 0; color: #856404;">
              일반적으로 <strong>1-3 영업일</strong> 내에 검토 후 회신드립니다.<br>
              긴급한 버그의 경우 더 빠른 처리가 가능합니다.
            </p>
          </div>
          
          <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0; text-align: center;">
            <h3 style="color: #333; margin-top: 0;">📞 추가 문의</h3>
            <p style="margin-bottom: 15px;">추가 질문이나 상세한 문의사항이 있으시면 언제든 연락주세요.</p>
            <div style="display: inline-block; padding: 10px 20px; background: #667eea; color: white; border-radius: 5px; text-decoration: none;">
              <strong>📧 ${CONFIG.EMAILS.REPLY_TO}</strong>
            </div>
          </div>
        </div>
        
        <div style="background: #343a40; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            M-CENTER 세금계산기 베타테스트에 참여해 주셔서 감사합니다! 🎉
          </p>
        </div>
      </div>
    `;
    
    GmailApp.sendEmail(
      data.사용자이메일,
      subject,
      '', // 텍스트 버전은 비움
      {
        htmlBody: htmlBody,
        name: CONFIG.EMAILS.FROM_NAME,
        replyTo: CONFIG.EMAILS.REPLY_TO
      }
    );
    
    console.log('✅ 사용자 확인 이메일 발송 완료:', data.사용자이메일);
    return { success: true, type: 'user_confirmation' };
    
  } catch (error) {
    console.error('❌ 사용자 이메일 발송 오류:', error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * 🔍 GET 요청 처리 - 시스템 상태 확인
 */
function doGet(e) {
  try {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'M-CENTER 베타 피드백 이메일 시스템 정상 작동 중',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        features: [
          '✅ 베타 피드백 구글시트 저장',
          '✅ 관리자 알림 이메일 발송',
          '✅ 사용자 접수 확인 이메일 발송',
          '✅ HTML 이메일 템플릿 지원'
        ]
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ GET 요청 처리 오류:', error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 🧪 테스트 함수 - 이메일 발송 테스트
 */
function testBetaFeedbackEmail() {
  const testData = {
    계산기명: '상속세 계산기',
    피드백유형: '🐛 버그 신고',
    사용자이메일: 'test@example.com',
    문제설명: '계산 결과가 이상하게 나옵니다.',
    기대동작: '정확한 상속세가 계산되어야 합니다.',
    실제동작: '음수 값이 나옵니다.',
    재현단계: '1. 상속재산 1억 입력\n2. 계산 버튼 클릭\n3. 결과 확인',
    심각도: '높음',
    브라우저정보: 'Chrome 120.0.0 Windows',
    제출경로: 'https://test.com/tax-calculator',
    제출일시: new Date().toISOString()
  };
  
  console.log('🧪 베타 피드백 이메일 테스트 시작');
  
  try {
    const adminResult = sendAdminNotificationEmail(testData);
    const userResult = sendUserConfirmationEmail(testData);
    
    console.log('📧 관리자 이메일 결과:', adminResult);
    console.log('📧 사용자 이메일 결과:', userResult);
    
    return {
      success: true,
      adminEmail: adminResult,
      userEmail: userResult
    };
    
  } catch (error) {
    console.error('❌ 이메일 테스트 오류:', error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
} 