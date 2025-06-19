/**
 * 간단한 구글시트 연동 테스트
 */

const https = require('https');

// env.example.md에서 확인한 실제 URL들
const TEST_URLS = [
  'https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec',
  'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjlPkXAy1JSZCxhJy00AazUvHbWwR5mpbJwY8Wo7EdJAPvSFn7bPZwZZcVf0icXh1inySn7aEpws1y4Kae-L2ZIajbzwY5iHEBnOznoKkS91UkNIm-OId2C7eZPR3CHSINoNdcskUwA1HhhC2hKgXqsazD9gtX_lAuioR1yMwsawhbpHF5MzGKYvcEVOtkdH2BqWu00sbHtebiNaADZNvsxuZZ2k6IpRruov5jg4BzpFxttmoTdAQTdIe0EQLnM7OCuGNf5gK1fruLiT4CKagjC04WJTQ&lib=MSO6FP3_fOVcXPyKa1j-76EzN9sd4IQmq'
];

// GET 요청으로 연결 확인
function testConnection(url) {
  return new Promise((resolve) => {
    console.log(`\n🔗 테스트 URL: ${url.substring(0, 60)}...`);
    
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📡 응답 상태: ${res.statusCode}`);
        console.log(`📄 응답 미리보기: ${data.substring(0, 200)}...`);
        
        if (res.statusCode === 200) {
          if (data.includes('기업의별') || data.includes('M-CENTER') || data.includes('status')) {
            console.log('✅ 연결 성공! Apps Script가 정상 작동 중입니다.');
            resolve({ success: true, url, data });
          } else {
            console.log('⚠️ 응답은 받았으나 예상과 다른 내용입니다.');
            resolve({ success: false, url, data });
          }
        } else {
          console.log('❌ HTTP 오류');
          resolve({ success: false, url, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ 연결 오류:', error.message);
      resolve({ success: false, url, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('❌ 연결 시간 초과');
      resolve({ success: false, url, error: 'timeout' });
    });
  });
}

// POST 요청으로 실제 데이터 전송 테스트
function testDataSubmission(url) {
  return new Promise((resolve) => {
    const testData = {
      action: 'saveDiagnosis',
      폼타입: 'AI_무료진단',
      회사명: `연결테스트_${Date.now()}`,
      업종: 'IT',
      이메일: `test_${Date.now()}@mcenter.test`,
      개인정보동의: '동의'
    };

    const postData = JSON.stringify(testData);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log(`\n📤 POST 데이터 전송 테스트: ${url.substring(0, 60)}...`);
    console.log(`📋 테스트 데이터:`, testData);

    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📡 POST 응답 상태: ${res.statusCode}`);
        console.log(`📄 POST 응답: ${data.substring(0, 300)}...`);
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.success) {
            console.log('✅ 데이터 저장 성공!');
            resolve({ success: true, url, response: parsed });
          } else {
            console.log('❌ 데이터 저장 실패');
            resolve({ success: false, url, response: parsed });
          }
        } catch (parseError) {
          if (data.includes('success') || data.includes('저장') || data.includes('완료')) {
            console.log('✅ 데이터 저장 성공 (텍스트 응답)');
            resolve({ success: true, url, response: data });
          } else {
            console.log('❌ JSON 파싱 실패 또는 저장 실패');
            resolve({ success: false, url, response: data, parseError });
          }
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ POST 요청 오류:', error.message);
      resolve({ success: false, url, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

// 메인 테스트 실행
async function runSimpleTest() {
  console.log('🚀 === 구글시트 간단 연결 테스트 ===\n');

  const results = [];

  // 모든 URL에 대해 연결 테스트
  for (const url of TEST_URLS) {
    const connectionResult = await testConnection(url);
    results.push(connectionResult);
    
    // 연결 성공 시 데이터 전송도 테스트
    if (connectionResult.success) {
      const submissionResult = await testDataSubmission(url);
      results.push(submissionResult);
    }
  }

  // 결과 요약
  console.log('\n📊 === 테스트 결과 요약 ===');
  
  const successfulUrls = results.filter(r => r.success);
  
  if (successfulUrls.length > 0) {
    console.log(`✅ 성공한 URL 개수: ${successfulUrls.length}`);
    successfulUrls.forEach(result => {
      console.log(`  - ${result.url.substring(0, 60)}...`);
    });
    
    console.log('\n🎉 구글시트 연동이 성공적으로 작동합니다!');
    console.log('💡 성공한 URL을 .env.local에 NEXT_PUBLIC_GOOGLE_SCRIPT_URL로 설정하세요.');
    
    // 환경변수 파일 생성
    const workingUrl = successfulUrls[0].url;
    console.log(`\n📝 추천 환경변수 설정:`);
    console.log(`NEXT_PUBLIC_GOOGLE_SCRIPT_URL=${workingUrl}`);
    
  } else {
    console.log('❌ 모든 URL에서 연결 실패');
    console.log('\n🔧 문제 해결 방법:');
    console.log('1. Google Apps Script가 올바르게 배포되었는지 확인');
    console.log('2. 웹앱 권한이 "모든 사용자"로 설정되었는지 확인');
    console.log('3. 새 배포 생성 후 새 URL 사용');
  }

  console.log('\n🔗 구글시트 직접 확인:');
  console.log('https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/edit');
}

// 스크립트 실행
if (require.main === module) {
  runSimpleTest().catch(console.error);
}

module.exports = { runSimpleTest }; 