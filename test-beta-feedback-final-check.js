/**
 * 베타 피드백 시스템 최종 테스트
 * 분기 조건이 제대로 작동하는지 확인
 */

async function testBetaFeedbackFinal() {
  console.log('🧪 베타 피드백 최종 테스트 시작');
  
  const testData = {
    action: 'saveBetaFeedback',
    폼타입: '베타테스트_피드백',
    계산기명: '상속세 계산기',
    피드백유형: '🐛 버그 신고',
    사용자이메일: 'final-test@example.com',
    문제설명: '계산 결과가 NaN으로 표시됩니다',
    기대동작: '정확한 상속세 금액이 표시되어야 합니다',
    실제동작: 'NaN원이 결과로 나타납니다',
    재현단계: '1. 상속재산 5억원 입력\n2. 계산 버튼 클릭\n3. 결과 확인',
    심각도: '높음',
    추가의견: '여러 번 시도해도 동일한 문제가 발생합니다',
    브라우저정보: 'Chrome 120.0.0 Windows 11',
    제출경로: 'https://m-center.co.kr/tax-calculator'
  };
  
  console.log('📤 테스트 데이터:', {
    action: testData.action,
    폼타입: testData.폼타입,
    계산기명: testData.계산기명,
    피드백유형: testData.피드백유형,
    사용자이메일: testData.사용자이메일?.substring(0, 5) + '***'
  });
  
  try {
    const response = await fetch('http://localhost:3000/api/beta-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('📨 응답 상태:', response.status);
    console.log('📋 응답 데이터:', JSON.stringify(result, null, 2));
    
    // 성공 여부 판단
    if (result.success) {
      console.log('✅ 베타 피드백 테스트 성공!');
      
      // 시트가 올바른지 확인
      if (result.sheet === '베타피드백') {
        console.log('🎯 베타피드백 시트에 정확히 저장됨!');
      } else {
        console.log('❌ 잘못된 시트에 저장됨:', result.sheet);
      }
    } else {
      console.log('❌ 베타 피드백 테스트 실패:', result.error);
    }
    
  } catch (error) {
    console.error('❌ 테스트 실행 오류:', error);
  }
}

// 테스트 실행
testBetaFeedbackFinal(); 