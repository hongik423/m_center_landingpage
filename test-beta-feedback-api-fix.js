/**
 * 베타 피드백 시트 분류 수정 테스트
 * - action 값이 제대로 전달되는지 확인
 * - 베타피드백 시트로 정확히 분류되는지 검증
 */

const TEST_CONFIG = {
  API_URL: 'http://localhost:3001/api/beta-feedback',
  EXPECTED_SHEET: '베타피드백',
  TEST_EMAIL: 'final-beta-test@example.com'
};

// 🧪 베타 피드백 테스트 데이터
const createTestFeedback = () => ({
  제출일시: new Date().toLocaleString('ko-KR'),
  폼타입: '베타테스트_피드백',
  계산기명: '증여세 계산기',
  계산기유형: 'tax-calculator',
  
  // 사용자 정보
  사용자이메일: TEST_CONFIG.TEST_EMAIL,
  연락선호방식: 'email',
  
  // 피드백 내용
  피드백유형: '🐛 버그 신고',
  문제설명: '[최종 테스트] 베타 피드백 시트 분류 + 개선된 사용자 이메일 발송 테스트',
  기대동작: '베타피드백 전용 시트에 저장 + 친근한 접수 확인 이메일 발송',
  실제동작: '분기 강화 및 이메일 개선 후 최종 검증',
  재현단계: '1. 베타 피드백 폼 작성\n2. 제출 버튼 클릭\n3. 구글시트 및 이메일 확인',
  심각도: '높음',
  추가의견: '다중 조건 분기 + 상세한 관리자/사용자 이메일 시스템 테스트',
  
  // 기술 정보
  브라우저정보: 'Test Environment - Node.js',
  제출경로: 'http://localhost:3000/tax-calculator',
  타임스탬프: Date.now(),
  
  // 메타데이터
  dataSource: '베타테스트_피드백시스템_수정테스트'
});

// 🎯 베타 피드백 제출 테스트
async function testBetaFeedbackSubmission() {
  try {
    console.log('🧪 베타 피드백 시트 분류 수정 테스트 시작...\n');
    
    const testData = createTestFeedback();
    
    console.log('📝 테스트 데이터:', {
      계산기명: testData.계산기명,
      피드백유형: testData.피드백유형,
      이메일: testData.사용자이메일,
      폼타입: testData.폼타입,
      dataSource: testData.dataSource
    });
    
    console.log('\n🚀 베타 피드백 API 호출 중...');
    
    const response = await fetch(TEST_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    console.log('\n📊 API 응답 결과:', {
      status: response.status,
      success: result.success,
      message: result.message?.substring(0, 100) + '...'
    });
    
    if (result.success) {
      console.log('\n✅ 베타 피드백 제출 성공!');
      console.log('📧 처리 완료:', {
        관리자알림: result.data?.emails?.adminNotified || '확인 필요',
        사용자확인: result.data?.emails?.userConfirmed || '확인 필요',
        처리상태: result.data?.status || '확인 필요'
      });
      
      console.log('\n🎯 중요 확인사항:');
      console.log('1. 구글시트에서 "베타피드백" 시트 확인');
      console.log('2. 진단신청 시트가 아닌 베타피드백 시트에 데이터 저장 확인');
      console.log('3. 관리자 이메일(hongik423@gmail.com) 알림 수신 확인');
      console.log(`4. 테스트 이메일(${TEST_CONFIG.TEST_EMAIL}) 접수 확인 메일 수신 확인`);
      
    } else {
      console.log('\n❌ 베타 피드백 제출 실패:');
      console.log('오류 메시지:', result.error);
      console.log('상세 정보:', result.details);
    }
    
  } catch (error) {
    console.error('\n❌ 테스트 실행 오류:', error.message);
    console.error('상세 오류:', error);
  }
}

// 🔍 베타 피드백 시스템 상태 확인
async function checkBetaFeedbackStatus() {
  try {
    console.log('\n🔍 베타 피드백 시스템 상태 확인...');
    
    const response = await fetch(TEST_CONFIG.API_URL, {
      method: 'GET',
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ 시스템 상태: 정상');
      console.log('📊 지원 기능:', result.data.features);
      console.log('🔧 구글시트 연동:', result.data.googleSheets);
    } else {
      console.log('❌ 시스템 상태: 오류');
      console.log('오류 내용:', result.error);
    }
    
  } catch (error) {
    console.error('❌ 상태 확인 오류:', error.message);
  }
}

// 🎯 통합 테스트 실행
async function runCompleteTest() {
  console.log('🧪 M-CENTER 베타 피드백 시트 분류 수정 테스트');
  console.log('=' .repeat(60));
  console.log('목표: 베타 피드백이 진단시트가 아닌 베타피드백 시트로 정확히 분류되는지 확인');
  console.log('수정 사항: action 값을 마지막에 설정하여 덮어쓰기 방지');
  console.log('=' .repeat(60));
  
  // 1. 시스템 상태 확인
  await checkBetaFeedbackStatus();
  
  // 2. 베타 피드백 제출 테스트
  await testBetaFeedbackSubmission();
  
  console.log('\n🎯 테스트 완료! 구글시트에서 결과를 확인해주세요.');
  console.log('📊 구글시트 확인 방법:');
  console.log('1. https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug');
  console.log('2. "베타피드백" 시트 탭 클릭');
  console.log('3. 최신 데이터가 "베타피드백" 시트에 저장되었는지 확인');
  console.log('4. "AI_진단신청" 시트에는 저장되지 않았는지 확인');
}

// 테스트 실행
runCompleteTest().catch(console.error); 