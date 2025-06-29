/**
 * ================================================================================
 * M-CENTER 최종 통합 Apps Script + 진단 질문 키워드 헤더 (업데이트 버전)
 * ================================================================================
 * 
 * 📋 주요 업데이트:
 * ✅ 구글시트 첫 번째 행에 진단 질문 키워드 추가
 * ✅ 20개 문항별 상세 질문 내용 표시
 * ✅ 5개 카테고리별 그룹화 및 색상 구분
 * ✅ 가독성 향상을 위한 헤더 포맷팅
 */

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
  headerRange.setWrap(true); // 텍스트 줄바꿈 허용
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
    
    // 📝 **2행에 카테고리 설명 추가**
    const categoryDescriptions = [
      // 기본 정보 (18개)
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      // 진단 결과 (6개)
      '5점 척도→100점 환산', '상품서비스 평균점수', '고객응대 평균점수', '마케팅 평균점수', '구매재고 평균점수', '매장관리 평균점수',
      // 상품/서비스 관리 (5개)
      '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도',
      // 고객응대 (4개)
      '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도',
      // 마케팅 (5개)
      '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도',
      // 구매/재고관리 (2개)
      '1-5점 척도', '1-5점 척도',
      // 매장관리 (4개)
      '1-5점 척도', '1-5점 척도', '1-5점 척도', '1-5점 척도',
      // 보고서 정보 (4개)
      '글자 수', '추천서비스명', '요약 내용', '전체 보고서'
    ];
    
    sheet.getRange(2, 1, 1, categoryDescriptions.length).setValues([categoryDescriptions]);
    const descriptionRange = sheet.getRange(2, 1, 1, categoryDescriptions.length);
    descriptionRange.setBackground('#f5f5f5');
    descriptionRange.setFontColor('#666666');
    descriptionRange.setFontStyle('italic');
    descriptionRange.setFontSize(10);
    descriptionRange.setHorizontalAlignment('center');
    
    // 🔒 **헤더 행 보호 (옵션)**
    sheet.setFrozenRows(2); // 설명 행도 고정
    
    console.log('📊 진단 질문 키워드 포함 헤더 설정 완료 (48개 컬럼 + 설명)');
    console.log('🎨 카테고리별 색상 구분 적용 완료');
    console.log('📝 2행에 카테고리 설명 추가 완료');
  }
  
  console.log(`📋 ${type} 시트 헤더 설정 완료: ${headers.length}개 컬럼`);
}

// ================================================================================
// 📊 진단 질문 키워드 매핑 (참고용)
// ================================================================================

const DIAGNOSIS_QUESTIONS = {
  // 상품/서비스 관리 역량 (5개)
  기획수준: "상품/서비스 기획 수준이 어느 정도인가요?",
  차별화정도: "경쟁업체 대비 차별화 정도는?",
  가격설정: "가격 설정의 합리성은?",
  전문성: "업무 전문성 수준은?",
  품질: "상품/서비스 품질 수준은?",
  
  // 고객응대 역량 (4개)
  고객맞이: "고객 맞이의 친절함은?",
  고객응대: "고객 응대 능력은?",
  불만관리: "고객 불만 처리 능력은?",
  고객유지: "고객 유지 관리 능력은?",
  
  // 마케팅 역량 (5개)
  고객이해: "고객 특성 이해도는?",
  마케팅계획: "마케팅 계획 수립 능력은?",
  오프라인마케팅: "오프라인 마케팅 실행 능력은?",
  온라인마케팅: "온라인 마케팅 활용 능력은?",
  판매전략: "판매 전략 수립 및 실행 능력은?",
  
  // 구매/재고관리 (2개)
  구매관리: "구매 관리의 체계성은?",
  재고관리: "재고 관리의 효율성은?",
  
  // 매장관리 역량 (4개)
  외관관리: "매장 외관 관리 상태는?",
  인테리어관리: "내부 인테리어 관리 상태는?",
  청결도: "매장 청결도는?",
  작업동선: "작업 동선의 효율성은?"
};

const CATEGORY_INFO = {
  상품서비스관리: {
    name: "상품/서비스 관리 역량",
    weight: "25%",
    color: "#ff9800",
    items: ["기획수준", "차별화정도", "가격설정", "전문성", "품질"]
  },
  고객응대: {
    name: "고객응대 역량", 
    weight: "20%",
    color: "#2196f3",
    items: ["고객맞이", "고객응대", "불만관리", "고객유지"]
  },
  마케팅: {
    name: "마케팅 역량",
    weight: "25%", 
    color: "#9c27b0",
    items: ["고객이해", "마케팅계획", "오프라인마케팅", "온라인마케팅", "판매전략"]
  },
  구매재고: {
    name: "구매 및 재고관리",
    weight: "15%",
    color: "#795548", 
    items: ["구매관리", "재고관리"]
  },
  매장관리: {
    name: "매장관리 역량",
    weight: "15%",
    color: "#009688",
    items: ["외관관리", "인테리어관리", "청결도", "작업동선"]
  }
};

// ================================================================================
// 📊 헤더 업데이트 전용 함수 (기존 시트 업데이트용)
// ================================================================================

function updateExistingSheetHeaders() {
  try {
    console.log('🔄 기존 시트 헤더 업데이트 시작...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const diagnosisSheet = spreadsheet.getSheetByName(SHEETS.DIAGNOSIS);
    
    if (diagnosisSheet) {
      // 기존 헤더 백업 (3행에 이동)
      const existingHeaders = diagnosisSheet.getRange(1, 1, 1, diagnosisSheet.getLastColumn()).getValues()[0];
      diagnosisSheet.getRange(3, 1, 1, existingHeaders.length).setValues([existingHeaders]);
      
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
 * 1. **새로운 시트 생성 시**: 자동으로 진단 질문 키워드 포함 헤더 적용됨
 * 2. **기존 시트 업데이트**: updateExistingSheetHeaders() 함수 실행
 * 3. **수동 테스트**: Apps Script 편집기에서 updateExistingSheetHeaders() 실행
 * 
 * 📊 헤더 구성:
 * - 🔵 기본정보 (18개): 파란색
 * - 🟢 진단결과 (6개): 초록색  
 * - 🔶 상품/서비스 (5개): 주황색
 * - 🔷 고객응대 (4개): 파란색 계열
 * - 🔸 마케팅 (5개): 보라색
 * - 🔹 구매/재고 (2개): 갈색
 * - 🔺 매장관리 (4개): 청록색
 * - 🟣 보고서 (4개): 진한 보라색
 */ 