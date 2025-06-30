/**
 * ================================================================================
 * M-CENTER Apps Script 통합 시스템 테스트 스크립트
 * ================================================================================
 * 
 * 📋 테스트 대상:
 * ✅ 진단신청 처리
 * ✅ 상담신청 처리  
 * ✅ 베타피드백 처리 (신규)
 * ✅ 이메일 자동 발송
 * ✅ 데이터 저장 확인
 */

// 환경 설정
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/edit';

// ================================================================================
// 🧪 테스트 데이터 정의
// ================================================================================

// 1. 진단신청 테스트 데이터
const diagnosisTestData = {
  action: 'saveDiagnosis',
  폼타입: 'AI_무료진단',
  회사명: '테스트 AI진단기업',
  업종: 'software-development',
  사업담당자: '김AI진단',
  직원수: '10-50명',
  사업성장단계: 'growth',
  주요고민사항: '온라인 마케팅 강화 및 AI 도입을 통한 생산성 향상이 필요합니다',
  예상혜택: '매출 30% 증대와 업무효율 50% 향상을 기대합니다',
  진행사업장: '경기도 성남시',
  담당자명: '김담당',
      연락처: '010-9251-9743',
  이메일: 'aitest@example.com',
  개인정보동의: '동의',
  dataSource: 'test-script',
  timestamp: new Date().toISOString()
};

// 2. 상담신청 테스트 데이터
const consultationTestData = {
  action: 'saveConsultation',
  폼타입: '전문가상담',
  상담유형: 'business-analysis',
  성명: '홍길동',
      연락처: '010-9251-9743',
  이메일: 'consultation@example.com',
  회사명: '테스트상담기업',
  직책: '대표이사',
  상담분야: '사업분석',
  문의내용: 'BM ZEN 사업분석 상담을 통해 매출 증대 방안을 모색하고 싶습니다',
  희망상담시간: '평일 오후 2-4시',
  개인정보동의: '동의',
  dataSource: 'test-script',
  timestamp: new Date().toISOString()
};

// 3. 베타피드백 테스트 데이터 (신규 추가)
const betaFeedbackTestData = {
  action: 'saveBetaFeedback',
  폼타입: '베타테스트_피드백',
  계산기명: '상속세 계산기',
  피드백유형: '🐛 버그 신고',
  사용자이메일: 'beta@example.com',
  문제설명: '상속재산을 1억원으로 입력했는데 계산 결과가 음수로 나옵니다',
  기대동작: '양수의 상속세가 정상적으로 계산되어야 합니다',
  실제동작: '계산 결과: -1,000,000원이 표시됩니다',
  재현단계: '1. 상속세 계산기 접속\n2. 상속재산 100,000,000원 입력\n3. 계산 버튼 클릭\n4. 결과 확인',
  심각도: '높음',
  추가의견: '다른 금액으로도 테스트해봤는데 계속 음수가 나옵니다',
  브라우저정보: 'Chrome 120.0.0.0 Windows 10',
  제출경로: 'https://m-center.co.kr/tax-calculator',
  dataSource: 'test-script',
  timestamp: new Date().toISOString()
};

// ================================================================================
// 📡 테스트 실행 함수들
// ================================================================================

/**
 * HTTP 요청 발송 함수
 */
async function sendTestRequest(url, data, testName) {
  try {
    console.log(`\n🧪 ${testName} 테스트 시작...`);
    console.log('📤 전송 데이터:', JSON.stringify(data, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    console.log(`📥 ${testName} 응답:`, result);
    
    if (result.success) {
      console.log(`✅ ${testName} 성공!`);
      return { success: true, data: result };
    } else {
      console.log(`❌ ${testName} 실패:`, result.error);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error(`❌ ${testName} 오류:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * GET 요청으로 시스템 상태 확인
 */
async function checkSystemStatus(url) {
  try {
    console.log('\n🔍 시스템 상태 확인 중...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    console.log('📊 시스템 상태:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ 시스템 상태 확인 실패:', error);
    return { error: error.message };
  }
}

// ================================================================================
// 🚀 메인 테스트 실행
// ================================================================================

/**
 * 전체 테스트 실행
 */
async function runAllTests() {
  console.log('================================================================================');
  console.log('🚀 M-CENTER Apps Script 통합 시스템 테스트 시작');
  console.log('================================================================================');
  console.log(`📅 테스트 시작 시간: ${new Date().toLocaleString('ko-KR')}`);
  console.log(`🔗 구글시트 URL: ${SPREADSHEET_URL}`);
  console.log('================================================================================');

  const results = [];
  
  // 1. 시스템 상태 확인
  const statusCheck = await checkSystemStatus(APPS_SCRIPT_URL);
  results.push({ test: '시스템 상태 확인', result: statusCheck });
  
  // 잠시 대기 (API 요청 간격 조정)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 2. 진단신청 테스트
  const diagnosisResult = await sendTestRequest(APPS_SCRIPT_URL, diagnosisTestData, '진단신청');
  results.push({ test: '진단신청', result: diagnosisResult });
  
  // 잠시 대기
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 3. 상담신청 테스트
  const consultationResult = await sendTestRequest(APPS_SCRIPT_URL, consultationTestData, '상담신청');
  results.push({ test: '상담신청', result: consultationResult });
  
  // 잠시 대기
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 4. 베타피드백 테스트
  const betaResult = await sendTestRequest(APPS_SCRIPT_URL, betaFeedbackTestData, '베타피드백');
  results.push({ test: '베타피드백', result: betaResult });
  
  // 5. 테스트 결과 정리
  printTestResults(results);
}

/**
 * 테스트 결과 출력
 */
function printTestResults(results) {
  console.log('\n================================================================================');
  console.log('📊 테스트 결과 요약');
  console.log('================================================================================');
  
  let successCount = 0;
  let totalCount = results.length;
  
  results.forEach((item, index) => {
    const status = item.result.success !== false ? '✅ 성공' : '❌ 실패';
    const details = item.result.error ? ` (${item.result.error})` : '';
    
    console.log(`${index + 1}. ${item.test}: ${status}${details}`);
    
    if (item.result.success !== false) {
      successCount++;
    }
  });
  
  console.log('================================================================================');
  console.log(`🎯 전체 결과: ${successCount}/${totalCount} 성공 (성공률: ${Math.round(successCount/totalCount*100)}%)`);
  console.log(`📅 테스트 완료 시간: ${new Date().toLocaleString('ko-KR')}`);
  console.log('================================================================================');
  
  if (successCount === totalCount) {
    console.log('🎉 모든 테스트가 성공적으로 완료되었습니다!');
    console.log('📋 다음 단계: 구글시트에서 데이터 저장 확인');
    console.log(`🔗 구글시트 확인: ${SPREADSHEET_URL}`);
  } else {
    console.log('⚠️ 일부 테스트가 실패했습니다. 로그를 확인해 주세요.');
  }
}

// ================================================================================
// 🔧 개별 테스트 함수들 (필요시 개별 실행)
// ================================================================================

/**
 * 진단신청만 테스트
 */
async function testDiagnosisOnly() {
  console.log('🧪 진단신청 단독 테스트');
  await sendTestRequest(APPS_SCRIPT_URL, diagnosisTestData, '진단신청');
}

/**
 * 상담신청만 테스트
 */
async function testConsultationOnly() {
  console.log('🧪 상담신청 단독 테스트');
  await sendTestRequest(APPS_SCRIPT_URL, consultationTestData, '상담신청');
}

/**
 * 베타피드백만 테스트
 */
async function testBetaFeedbackOnly() {
  console.log('🧪 베타피드백 단독 테스트');
  await sendTestRequest(APPS_SCRIPT_URL, betaFeedbackTestData, '베타피드백');
}

// ================================================================================
// 📝 사용 가이드
// ================================================================================

console.log(`
================================================================================
📖 M-CENTER Apps Script 테스트 사용법
================================================================================

1️⃣ Apps Script URL 설정 필요:
   - APPS_SCRIPT_URL 변수에 실제 배포된 웹앱 URL 입력

2️⃣ 전체 테스트 실행:
   runAllTests()

3️⃣ 개별 테스트 실행:
   - testDiagnosisOnly()     // 진단신청 테스트
   - testConsultationOnly()  // 상담신청 테스트  
   - testBetaFeedbackOnly()  // 베타피드백 테스트

4️⃣ 시스템 상태만 확인:
   checkSystemStatus(APPS_SCRIPT_URL)

5️⃣ 테스트 완료 후 확인 사항:
   - 구글시트 데이터 저장 확인
   - 관리자 이메일 수신 확인
   - 테스트 사용자 이메일 수신 확인

================================================================================
🔗 주요 링크:
- 구글시트: ${SPREADSHEET_URL}
- 관리자 이메일: hongik423@gmail.com
================================================================================
`);

// Node.js 환경에서 실행 시
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testDiagnosisOnly,
    testConsultationOnly,
    testBetaFeedbackOnly,
    checkSystemStatus
  };
} 