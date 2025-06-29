/**
 * 📊 구글시트 헤더 즉시 업데이트 스크립트
 * 
 * 🚀 사용법:
 * 1. Google Apps Script 편집기에서 이 함수 실행
 * 2. 또는 웹앱에서 GET 요청으로 실행: 
 *    https://script.google.com/.../exec?action=updateHeaders
 */

// 📋 업데이트된 헤더를 즉시 적용하는 함수
function updateDiagnosisSheetHeaders() {
  try {
    console.log('🔄 진단시트 헤더 업데이트 시작...');
    
    // 스프레드시트 열기
    const SPREADSHEET_ID = '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug';
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const diagnosisSheet = spreadsheet.getSheetByName('AI_진단신청');
    
    if (!diagnosisSheet) {
      throw new Error('AI_진단신청 시트를 찾을 수 없습니다.');
    }
    
    // 📊 **새로운 진단 질문 키워드 헤더 (48개)**
    const newHeaders = [
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
      
      // 🔶 상품/서비스 관리 역량 (Y-AC: 5개)
      '기획수준 (상품/서비스 기획 수준이 어느 정도인가요?)', 
      '차별화정도 (경쟁업체 대비 차별화 정도는?)', 
      '가격설정 (가격 설정의 합리성은?)', 
      '전문성 (업무 전문성 수준은?)', 
      '품질 (상품/서비스 품질 수준은?)',
      
      // 🔷 고객응대 역량 (AD-AG: 4개)
      '고객맞이 (고객 맞이의 친절함은?)', 
      '고객응대 (고객 응대 능력은?)', 
      '불만관리 (고객 불만 처리 능력은?)', 
      '고객유지 (고객 유지 관리 능력은?)',
      
      // 🔸 마케팅 역량 (AH-AL: 5개)
      '고객이해 (고객 특성 이해도는?)', 
      '마케팅계획 (마케팅 계획 수립 능력은?)', 
      '오프라인마케팅 (오프라인 마케팅 실행 능력은?)', 
      '온라인마케팅 (온라인 마케팅 활용 능력은?)', 
      '판매전략 (판매 전략 수립 및 실행 능력은?)',
      
      // 🔹 구매/재고관리 (AM-AN: 2개)
      '구매관리 (구매 관리의 체계성은?)', 
      '재고관리 (재고 관리의 효율성은?)',
      
      // 🔺 매장관리 역량 (AO-AR: 4개)
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
    
    // 📝 **2행 설명 헤더**
    const descriptionHeaders = [
      // 기본 정보 (18개)
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      // 진단 결과 (6개)
      '5점→100점환산', '상품서비스평균', '고객응대평균', '마케팅평균', '구매재고평균', '매장관리평균',
      // 상품/서비스 관리 (5개)
      '1-5점척도', '1-5점척도', '1-5점척도', '1-5점척도', '1-5점척도',
      // 고객응대 (4개)
      '1-5점척도', '1-5점척도', '1-5점척도', '1-5점척도',
      // 마케팅 (5개)
      '1-5점척도', '1-5점척도', '1-5점척도', '1-5점척도', '1-5점척도',
      // 구매/재고관리 (2개)
      '1-5점척도', '1-5점척도',
      // 매장관리 (4개)
      '1-5점척도', '1-5점척도', '1-5점척도', '1-5점척도',
      // 보고서 정보 (4개)
      '글자수', '서비스명', '요약내용', '전체보고서'
    ];
    
    // 📋 **1행: 새로운 헤더 적용**
    diagnosisSheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    
    // 📝 **2행: 설명 헤더 적용**
    diagnosisSheet.getRange(2, 1, 1, descriptionHeaders.length).setValues([descriptionHeaders]);
    
    // 🎨 **1행 스타일링**
    const headerRange = diagnosisSheet.getRange(1, 1, 1, newHeaders.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    headerRange.setWrap(true);
    
    // 🎨 **2행 스타일링**
    const descRange = diagnosisSheet.getRange(2, 1, 1, descriptionHeaders.length);
    descRange.setBackground('#f5f5f5');
    descRange.setFontColor('#666666');
    descRange.setFontStyle('italic');
    descRange.setFontSize(10);
    descRange.setHorizontalAlignment('center');
    
    // 🔵 기본 정보 영역 (A-R: 18개) - 파란색
    const basicInfoRange = diagnosisSheet.getRange(1, 1, 1, 18);
    basicInfoRange.setBackground('#4285f4');
    basicInfoRange.setFontColor('#ffffff');
    
    // 🟢 진단 결과 영역 (S-X: 6개) - 초록색
    const resultRange = diagnosisSheet.getRange(1, 19, 1, 6);
    resultRange.setBackground('#34a853');
    resultRange.setFontColor('#ffffff');
    
    // 🔶 상품/서비스 관리 역량 (Y-AC: 5개) - 주황색
    const productServiceRange = diagnosisSheet.getRange(1, 25, 1, 5);
    productServiceRange.setBackground('#ff9800');
    productServiceRange.setFontColor('#ffffff');
    
    // 🔷 고객응대 역량 (AD-AG: 4개) - 파란색 계열
    const customerServiceRange = diagnosisSheet.getRange(1, 30, 1, 4);
    customerServiceRange.setBackground('#2196f3');
    customerServiceRange.setFontColor('#ffffff');
    
    // 🔸 마케팅 역량 (AH-AL: 5개) - 보라색
    const marketingRange = diagnosisSheet.getRange(1, 34, 1, 5);
    marketingRange.setBackground('#9c27b0');
    marketingRange.setFontColor('#ffffff');
    
    // 🔹 구매/재고관리 (AM-AN: 2개) - 갈색
    const procurementRange = diagnosisSheet.getRange(1, 39, 1, 2);
    procurementRange.setBackground('#795548');
    procurementRange.setFontColor('#ffffff');
    
    // 🔺 매장관리 역량 (AO-AR: 4개) - 청록색
    const storeManagementRange = diagnosisSheet.getRange(1, 41, 1, 4);
    storeManagementRange.setBackground('#009688');
    storeManagementRange.setFontColor('#ffffff');
    
    // 🟣 보고서 정보 (AS-AV: 4개) - 진한 보라색
    const reportRange = diagnosisSheet.getRange(1, 45, 1, 4);
    reportRange.setBackground('#673ab7');
    reportRange.setFontColor('#ffffff');
    
    // 📏 컬럼 폭 자동 조정
    diagnosisSheet.autoResizeColumns(1, newHeaders.length);
    
    // 🔒 헤더 행 고정
    diagnosisSheet.setFrozenRows(2);
    
    console.log('✅ 진단시트 헤더 업데이트 완료!');
    console.log(`📊 ${newHeaders.length}개 컬럼 헤더 적용됨`);
    console.log('🎨 카테고리별 색상 구분 적용됨');
    console.log('📝 2행에 설명 추가됨');
    
    return '✅ 진단 질문 키워드 헤더 업데이트 성공!';
    
  } catch (error) {
    console.error('❌ 헤더 업데이트 실패:', error);
    throw new Error('헤더 업데이트 실패: ' + error.toString());
  }
}

// 📡 웹앱에서 GET 요청으로 헤더 업데이트 실행
function doGet(e) {
  if (e.parameter && e.parameter.action === 'updateHeaders') {
    try {
      const result = updateDiagnosisSheetHeaders();
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: result,
          timestamp: new Date().toLocaleString('ko-KR')
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleString('ko-KR')
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService
    .createTextOutput('📊 M-CENTER 구글시트 헤더 업데이트 시스템\n\n사용법: ?action=updateHeaders')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 📖 사용법:
 * 
 * 방법 1: Apps Script 편집기에서 직접 실행
 * - updateDiagnosisSheetHeaders() 함수 실행
 * 
 * 방법 2: 웹앱 URL로 실행
 * - https://script.google.com/.../exec?action=updateHeaders
 * 
 * 📊 업데이트 내용:
 * - 1행: 진단 질문 키워드 포함 헤더 (48개)
 * - 2행: 각 항목별 설명 (점수 척도 등)
 * - 카테고리별 색상 구분 (8개 영역)
 * - 텍스트 줄바꿈 및 가독성 개선
 */ 