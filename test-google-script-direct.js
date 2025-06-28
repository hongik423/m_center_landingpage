/**
 * Google Apps Script 직접 연결 테스트
 */

async function testGoogleScriptDirect() {
  console.log('🔗 Google Apps Script 직접 연결 테스트 시작');
  
  // env.local.example에서 확인한 실제 URL
  const scriptUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjlPkXAy1JSZCxhJy00AazUvHbWwR5mpbJwY8Wo7EdJAPvSFn7bPZwZZcVf0icXh1inySn7aEpws1y4Kae-L2ZIajbzwY5iHEBnOznoKkS91UkNIm-OId2C7eZPR3CHSINoNdcskUwA1HhhC2hKgXqsazD9gtX_lAuioR1yMwsawhbpHF5MzGKYvcEVOtkdH2BqWu00sbHtebiNaADZNvsxuZZ2k6IpRruov5jg4BzpFxttmoTdAQTdIe0EQLnM7OCuGNf5gK1fruLiT4CKagjC04WJTQ&lib=MSO6FP3_fOVcXPyKa1j-76EzN9sd4IQmq';
  
  // 1. GET 요청으로 시스템 상태 확인
  try {
    console.log('📡 GET 요청으로 시스템 상태 확인...');
    const getResponse = await fetch(scriptUrl, {
      method: 'GET'
    });
    
    console.log('📊 GET 응답 상태:', getResponse.status);
    const getResult = await getResponse.text();
    console.log('📋 GET 응답 내용:', getResult.substring(0, 500));
    
  } catch (error) {
    console.error('❌ GET 요청 실패:', error);
  }
  
  // 2. POST 요청으로 베타 피드백 테스트
  try {
    console.log('\n📤 POST 요청으로 베타 피드백 테스트...');
    
    const testPayload = {
      action: 'saveBetaFeedback',
      폼타입: '베타테스트_피드백',
      계산기명: '증여세 계산기',
      피드백유형: '🐛 버그 신고',
      사용자이메일: 'direct-test@example.com',
      문제설명: 'Google Apps Script 직접 연결 테스트',
      기대동작: '베타피드백 시트에 저장되어야 함',
      실제동작: '테스트 진행 중',
      심각도: '낮음',
      브라우저정보: 'Node.js Test',
      제출경로: 'direct-test',
      제출일시: new Date().toISOString()
    };
    
    console.log('📦 전송 데이터:', {
      action: testPayload.action,
      폼타입: testPayload.폼타입,
      계산기명: testPayload.계산기명,
      피드백유형: testPayload.피드백유형
    });
    
    const postResponse = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('📊 POST 응답 상태:', postResponse.status);
    const postResult = await postResponse.json();
    console.log('📋 POST 응답 데이터:', JSON.stringify(postResult, null, 2));
    
    // 응답 분석
    if (postResult.success) {
      console.log('✅ Google Apps Script 연결 성공!');
      if (postResult.sheet === '베타피드백') {
        console.log('🎯 베타피드백 시트에 정확히 저장됨!');
      } else {
        console.log('⚠️ 다른 시트에 저장됨:', postResult.sheet);
      }
    } else {
      console.log('❌ Google Apps Script 처리 실패:', postResult.error);
    }
    
  } catch (error) {
    console.error('❌ POST 요청 실패:', error);
  }
}

// 테스트 실행
testGoogleScriptDirect(); 