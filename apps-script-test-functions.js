/**
 * ================================================================================
 * M-CENTER Apps Script 내장 테스트 함수들
 * ================================================================================
 * 
 * 📖 사용법:
 * 1. 이 코드를 Apps Script 에디터에 추가
 * 2. 함수 선택하여 실행
 * 3. 로그에서 결과 확인
 * 
 * 🎯 주요 테스트 함수:
 * - runTestDiagnosis()      // 진단신청 테스트
 * - runTestConsultation()   // 상담신청 테스트  
 * - runTestBetaFeedback()   // 베타피드백 테스트
 * - runAllTestsInternal()   // 전체 테스트
 * - checkSheetsStructure()  // 시트 구조 확인
 */

// ================================================================================
// 🧪 내장 테스트 데이터
// ================================================================================

function getTestDiagnosisData() {
  return {
    회사명: '[테스트] AI진단기업',
    업종: 'software-development',
    사업담당자: '김AI진단',
    직원수: '10-50명',
    사업성장단계: 'growth',
    주요고민사항: '[테스트] 온라인 마케팅 강화 및 AI 도입을 통한 생산성 향상이 필요합니다',
    예상혜택: '[테스트] 매출 30% 증대와 업무효율 50% 향상을 기대합니다',
    진행사업장: '경기도 성남시',
    담당자명: '김테스트',
    연락처: '010-1234-5678',
    이메일: 'test-diagnosis@example.com',
    개인정보동의: '동의',
    폼타입: 'AI_무료진단',
    dataSource: 'apps-script-internal-test'
  };
}

function getTestConsultationData() {
  return {
    상담유형: 'business-analysis',
    성명: '[테스트] 홍길동',
    연락처: '010-9876-5432',
    이메일: 'test-consultation@example.com',
    회사명: '[테스트] 상담기업',
    직책: '대표이사',
    상담분야: '사업분석',
    문의내용: '[테스트] BM ZEN 사업분석 상담을 통해 매출 증대 방안을 모색하고 싶습니다',
    희망상담시간: '평일 오후 2-4시',
    개인정보동의: '동의',
    폼타입: '전문가상담',
    dataSource: 'apps-script-internal-test'
  };
}

function getTestBetaFeedbackData() {
  return {
    action: 'saveBetaFeedback',
    폼타입: '베타테스트_피드백',
    계산기명: '[테스트] 상속세 계산기',
    피드백유형: '🧪 테스트 피드백',
    사용자이메일: 'test-beta@example.com',
    문제설명: '[테스트] 상속재산을 1억원으로 입력했는데 계산 결과가 음수로 나옵니다',
    기대동작: '[테스트] 양수의 상속세가 정상적으로 계산되어야 합니다',
    실제동작: '[테스트] 계산 결과: -1,000,000원이 표시됩니다',
    재현단계: '[테스트] 1. 상속세 계산기 접속\n2. 상속재산 100,000,000원 입력\n3. 계산 버튼 클릭\n4. 결과 확인',
    심각도: '보통',
    추가의견: '[테스트] 내장 테스트 함수에서 실행된 테스트입니다',
    브라우저정보: 'Apps Script Internal Test',
    제출경로: 'Internal Test Function',
    dataSource: 'apps-script-internal-test'
  };
}

// ================================================================================
// 🧪 개별 테스트 함수들
// ================================================================================

/**
 * 진단신청 테스트 실행
 */
function runTestDiagnosis() {
  console.log('🧪 진단신청 내장 테스트 시작');
  console.log('================================================================================');
  
  try {
    const testData = getTestDiagnosisData();
    console.log('📤 테스트 데이터:', JSON.stringify(testData, null, 2));
    
    // 진단신청 처리 함수 직접 호출
    const result = processDiagnosisForm(testData);
    
    console.log('📥 처리 결과:', result.getContent());
    console.log('✅ 진단신청 테스트 완료');
    
    return result;
    
  } catch (error) {
    console.error('❌ 진단신청 테스트 실패:', error);
    return null;
  }
}

/**
 * 상담신청 테스트 실행
 */
function runTestConsultation() {
  console.log('🧪 상담신청 내장 테스트 시작');
  console.log('================================================================================');
  
  try {
    const testData = getTestConsultationData();
    console.log('📤 테스트 데이터:', JSON.stringify(testData, null, 2));
    
    // 상담신청 처리 함수 직접 호출
    const result = processConsultationForm(testData);
    
    console.log('📥 처리 결과:', result.getContent());
    console.log('✅ 상담신청 테스트 완료');
    
    return result;
    
  } catch (error) {
    console.error('❌ 상담신청 테스트 실패:', error);
    return null;
  }
}

/**
 * 베타피드백 테스트 실행
 */
function runTestBetaFeedback() {
  console.log('🧪 베타피드백 내장 테스트 시작');
  console.log('================================================================================');
  
  try {
    const testData = getTestBetaFeedbackData();
    console.log('📤 테스트 데이터:', JSON.stringify(testData, null, 2));
    
    // 베타피드백 처리 함수 직접 호출
    const result = processBetaFeedback(testData);
    
    console.log('📥 처리 결과:', result.getContent());
    console.log('✅ 베타피드백 테스트 완료');
    
    return result;
    
  } catch (error) {
    console.error('❌ 베타피드백 테스트 실패:', error);
    return null;
  }
}

// ================================================================================
// 🚀 통합 테스트 함수
// ================================================================================

/**
 * 모든 테스트를 순차적으로 실행
 */
function runAllTestsInternal() {
  console.log('🚀 M-CENTER Apps Script 통합 내장 테스트 시작');
  console.log('================================================================================');
  console.log(`📅 테스트 시작 시간: ${getCurrentKoreanTime()}`);
  console.log(`📋 구글시트 ID: ${SPREADSHEET_ID}`);
  console.log('================================================================================');
  
  const results = [];
  
  // 1. 진단신청 테스트
  console.log('\n1️⃣ 진단신청 테스트');
  const diagnosisResult = runTestDiagnosis();
  results.push({
    test: '진단신청',
    success: diagnosisResult !== null,
    result: diagnosisResult
  });
  
  // 잠시 대기
  Utilities.sleep(1000);
  
  // 2. 상담신청 테스트
  console.log('\n2️⃣ 상담신청 테스트');
  const consultationResult = runTestConsultation();
  results.push({
    test: '상담신청',
    success: consultationResult !== null,
    result: consultationResult
  });
  
  // 잠시 대기
  Utilities.sleep(1000);
  
  // 3. 베타피드백 테스트
  console.log('\n3️⃣ 베타피드백 테스트');
  const betaResult = runTestBetaFeedback();
  results.push({
    test: '베타피드백',
    success: betaResult !== null,
    result: betaResult
  });
  
  // 4. 결과 정리
  printInternalTestResults(results);
  
  return results;
}

/**
 * 내장 테스트 결과 출력
 */
function printInternalTestResults(results) {
  console.log('\n================================================================================');
  console.log('📊 내장 테스트 결과 요약');
  console.log('================================================================================');
  
  let successCount = 0;
  const totalCount = results.length;
  
  results.forEach((item, index) => {
    const status = item.success ? '✅ 성공' : '❌ 실패';
    console.log(`${index + 1}. ${item.test}: ${status}`);
    
    if (item.success) {
      successCount++;
      
      // 성공한 경우 결과 요약 출력
      try {
        const resultContent = JSON.parse(item.result.getContent());
        console.log(`   📋 시트: ${resultContent.sheet || 'N/A'}`);
        console.log(`   📍 행: ${resultContent.row || 'N/A'}`);
        console.log(`   ⏰ 시간: ${resultContent.timestamp || 'N/A'}`);
      } catch (e) {
        console.log('   📋 결과 파싱 실패, 하지만 처리는 성공');
      }
    }
  });
  
  console.log('================================================================================');
  console.log(`🎯 전체 결과: ${successCount}/${totalCount} 성공 (성공률: ${Math.round(successCount/totalCount*100)}%)`);
  console.log(`📅 테스트 완료 시간: ${getCurrentKoreanTime()}`);
  console.log('================================================================================');
  
  if (successCount === totalCount) {
    console.log('🎉 모든 내장 테스트가 성공적으로 완료되었습니다!');
    console.log('📋 다음 단계: 구글시트에서 데이터 저장 확인');
    console.log(`🔗 구글시트 바로가기: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
  } else {
    console.log('⚠️ 일부 테스트가 실패했습니다. 오류 로그를 확인해 주세요.');
  }
}

// ================================================================================
// 🔍 시스템 상태 확인 함수들
// ================================================================================

/**
 * 구글시트 구조 확인
 */
function checkSheetsStructure() {
  console.log('🔍 구글시트 구조 확인 시작');
  console.log('================================================================================');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log(`📊 스프레드시트 이름: ${spreadsheet.getName()}`);
    console.log(`🔗 스프레드시트 URL: ${spreadsheet.getUrl()}`);
    
    const sheets = spreadsheet.getSheets();
    console.log(`📋 총 시트 개수: ${sheets.length}`);
    
    sheets.forEach((sheet, index) => {
      const sheetName = sheet.getName();
      const lastRow = sheet.getLastRow();
      const lastColumn = sheet.getLastColumn();
      
      console.log(`\n${index + 1}. 시트명: ${sheetName}`);
      console.log(`   📏 데이터 범위: ${lastRow}행 x ${lastColumn}열`);
      console.log(`   📊 데이터 개수: ${Math.max(0, lastRow - 1)}개 (헤더 제외)`);
      
      // 헤더 확인 (첫 번째 행)
      if (lastRow > 0 && lastColumn > 0) {
        const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
        console.log(`   📋 헤더: ${headers.join(', ')}`);
      }
    });
    
    console.log('\n================================================================================');
    console.log('✅ 시트 구조 확인 완료');
    
    return {
      success: true,
      spreadsheetName: spreadsheet.getName(),
      sheetCount: sheets.length,
      sheets: sheets.map(sheet => ({
        name: sheet.getName(),
        rows: sheet.getLastRow(),
        columns: sheet.getLastColumn()
      }))
    };
    
  } catch (error) {
    console.error('❌ 시트 구조 확인 실패:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 환경 설정 확인
 */
function checkEnvironmentConfig() {
  console.log('🔧 환경 설정 확인 시작');
  console.log('================================================================================');
  
  try {
    console.log(`📊 구글시트 ID: ${SPREADSHEET_ID}`);
    console.log(`📧 관리자 이메일: ${ADMIN_EMAIL}`);
    console.log(`⚙️ 자동 이메일 발송: ${AUTO_REPLY_ENABLED ? '활성화' : '비활성화'}`);
    console.log(`📋 진단시트명: ${SHEETS.DIAGNOSIS}`);
    console.log(`📋 상담시트명: ${SHEETS.CONSULTATION}`);
    console.log(`📋 베타피드백시트명: ${SHEETS.BETA_FEEDBACK}`);
    
    // 시간 함수 테스트
    const currentTime = getCurrentKoreanTime();
    console.log(`🕐 현재 한국시간: ${currentTime}`);
    
    console.log('================================================================================');
    console.log('✅ 환경 설정 확인 완료');
    
    return {
      success: true,
      spreadsheetId: SPREADSHEET_ID,
      adminEmail: ADMIN_EMAIL,
      autoReplyEnabled: AUTO_REPLY_ENABLED,
      currentTime: currentTime
    };
    
  } catch (error) {
    console.error('❌ 환경 설정 확인 실패:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 전체 시스템 상태 확인
 */
function checkSystemHealth() {
  console.log('🏥 시스템 헬스체크 시작');
  console.log('================================================================================');
  
  const healthChecks = [];
  
  // 1. 환경 설정 확인
  const envCheck = checkEnvironmentConfig();
  healthChecks.push({ name: '환경 설정', result: envCheck });
  
  // 2. 시트 구조 확인
  const sheetCheck = checkSheetsStructure();
  healthChecks.push({ name: '시트 구조', result: sheetCheck });
  
  // 3. 함수 존재 확인
  const functionCheck = {
    success: true,
    functions: []
  };
  
  const requiredFunctions = [
    'processDiagnosisForm',
    'processConsultationForm',
    'processBetaFeedback',
    'sendAdminNotification',
    'sendUserConfirmation'
  ];
  
  requiredFunctions.forEach(funcName => {
    try {
      const func = eval(funcName);
      functionCheck.functions.push(`✅ ${funcName}: 존재함`);
    } catch (error) {
      functionCheck.success = false;
      functionCheck.functions.push(`❌ ${funcName}: 누락됨`);
    }
  });
  
  healthChecks.push({ name: '함수 존재성', result: functionCheck });
  
  // 결과 정리
  console.log('\n📊 헬스체크 결과:');
  console.log('================================================================================');
  
  let overallSuccess = true;
  healthChecks.forEach((check, index) => {
    const status = check.result.success ? '✅ 정상' : '❌ 오류';
    console.log(`${index + 1}. ${check.name}: ${status}`);
    
    if (!check.result.success) {
      overallSuccess = false;
      console.log(`   오류: ${check.result.error || '상세 오류 정보 없음'}`);
    }
  });
  
  console.log('================================================================================');
  console.log(`🎯 전체 시스템 상태: ${overallSuccess ? '✅ 정상' : '❌ 일부 오류'}`);
  console.log(`📅 체크 완료 시간: ${getCurrentKoreanTime()}`);
  
  return {
    success: overallSuccess,
    checks: healthChecks,
    timestamp: getCurrentKoreanTime()
  };
}

// ================================================================================
// 📖 사용 가이드
// ================================================================================

/**
 * 사용 가이드 출력
 */
function showUsageGuide() {
  console.log(`
================================================================================
📖 M-CENTER Apps Script 내장 테스트 사용 가이드
================================================================================

🧪 개별 테스트 함수:
   • runTestDiagnosis()      → 진단신청 테스트
   • runTestConsultation()   → 상담신청 테스트  
   • runTestBetaFeedback()   → 베타피드백 테스트

🚀 통합 테스트:
   • runAllTestsInternal()   → 모든 테스트 실행

🔍 시스템 확인:
   • checkSheetsStructure()  → 시트 구조 확인
   • checkEnvironmentConfig() → 환경 설정 확인
   • checkSystemHealth()     → 전체 시스템 상태 확인

📖 가이드:
   • showUsageGuide()        → 이 가이드 출력

================================================================================
🎯 테스트 실행 방법:
1. Apps Script 에디터에서 함수 선택
2. 실행 버튼 클릭 (▶️)
3. 로그에서 결과 확인 (View → Logs)

🔗 주요 정보:
• 구글시트 ID: ${SPREADSHEET_ID}
• 관리자 이메일: ${ADMIN_EMAIL}
• 현재 시간: ${getCurrentKoreanTime()}

================================================================================
  `);
}

// 자동으로 가이드 출력
showUsageGuide(); 