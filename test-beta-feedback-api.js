#!/usr/bin/env node

/**
 * 🧪 M-CENTER 베타피드백 API 자동 테스트 스크립트
 * 
 * 실행: node test-beta-feedback-api.js
 */

const http = require('http');

const API_BASE_URL = 'http://localhost:3003';

// 🎯 테스트 데이터 (실제 베타피드백 폼과 동일한 구조)
const testFeedbackData = {
  action: 'saveBetaFeedback',
  제출일시: new Date().toISOString(),
  폼타입: '베타테스트_피드백',
  계산기명: '상속세 계산기',
  피드백유형: '🐛 버그 신고',
  사용자이메일: 'test@example.com',
  문제설명: 'Node.js 스크립트를 통한 베타피드백 시스템 자동 테스트입니다.',
  기대동작: '정상적인 계산 결과가 표시되어야 합니다.',
  실제동작: '테스트 진행 중 - 자동화된 검증',
  재현단계: '1. Node.js 테스트 스크립트 실행\n2. API 호출\n3. 결과 확인',
  심각도: '낮음',
  추가의견: '자동 테스트를 통한 베타피드백 시스템 전체 검증. 구글시트 저장 및 이메일 발송까지 포함된 통합 테스트입니다.',
  브라우저정보: 'Node.js ' + process.version + ' Test Script',
  제출경로: API_BASE_URL + '/api/beta-feedback',
  타임스탬프: Date.now(),
  dataSource: 'nodejs-test-script'
};

/**
 * HTTP 요청 함수
 */
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3003,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'M-CENTER-Beta-Test-Script/1.0'
      }
    };
    
    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

/**
 * 1단계: API 상태 확인
 */
async function testApiStatus() {
  console.log('🔍 1단계: API 상태 확인 중...');
  
  try {
    const response = await makeRequest('GET', '/api/beta-feedback');
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ API 상태 확인 성공');
      console.log(`   📋 환경: ${response.data.data.environment}`);
      console.log(`   🔗 구글시트 연동: ${response.data.data.googleSheets.configured ? '✅ 설정 완료' : '❌ 미설정'}`);
      console.log(`   📧 지원 기능: ${response.data.data.features.length}개`);
      console.log(`   🎯 피드백 유형: ${response.data.data.supportedFeedbackTypes.length}개`);
      return true;
    } else {
      console.log('❌ API 상태 확인 실패');
      console.log('   응답:', response);
      return false;
    }
  } catch (error) {
    console.log('❌ API 연결 실패:', error.message);
    return false;
  }
}

/**
 * 2단계: 베타피드백 제출 테스트
 */
async function testBetaFeedbackSubmission() {
  console.log('\n🚀 2단계: 베타피드백 제출 테스트 중...');
  console.log('📝 테스트 데이터:');
  console.log(`   계산기: ${testFeedbackData.계산기명}`);
  console.log(`   유형: ${testFeedbackData.피드백유형}`);
  console.log(`   이메일: ${testFeedbackData.사용자이메일}`);
  
  try {
    const response = await makeRequest('POST', '/api/beta-feedback', testFeedbackData);
    
    console.log(`\n📊 응답 상태: ${response.statusCode}`);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ 베타피드백 제출 성공!');
      console.log('📋 처리 결과:');
      console.log(`   메시지: ${response.data.message}`);
      
      if (response.data.data) {
        console.log(`   피드백 ID: ${response.data.data.feedbackId || 'N/A'}`);
        console.log(`   제출 시간: ${response.data.data.submittedAt || 'N/A'}`);
        console.log(`   처리 상태: ${response.data.data.status || 'N/A'}`);
        
        if (response.data.data.emails) {
          console.log('📧 이메일 발송 상태:');
          console.log(`   관리자 알림: ${response.data.data.emails.adminNotified || 'N/A'}`);
          console.log(`   사용자 확인: ${response.data.data.emails.userConfirmed || 'N/A'}`);
        }
      }
      
      if (response.data.features) {
        console.log('🔧 처리된 기능:');
        response.data.features.forEach((feature, index) => {
          console.log(`   ${index + 1}. ${feature}`);
        });
      }
      
      return true;
    } else {
      console.log('❌ 베타피드백 제출 실패');
      console.log('📝 오류 정보:');
      console.log(`   오류: ${response.data.error || 'N/A'}`);
      console.log(`   세부사항: ${response.data.details || 'N/A'}`);
      console.log('📊 전체 응답:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ 요청 처리 실패:', error.message);
    return false;
  }
}

/**
 * 🎯 메인 테스트 실행
 */
async function runAllTests() {
  console.log('🧪 M-CENTER 베타피드백 시스템 자동 테스트 시작');
  console.log('=' .repeat(60));
  
  // 1단계: API 상태 확인
  const step1Success = await testApiStatus();
  
  if (!step1Success) {
    console.log('\n❌ 테스트 중단: API 상태 확인 실패');
    process.exit(1);
  }
  
  // 2단계: 베타피드백 제출
  const step2Success = await testBetaFeedbackSubmission();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎉 테스트 완료!');
  
  if (step1Success && step2Success) {
    console.log('✅ 모든 테스트 성공');
    console.log('📋 확인 사항:');
    console.log('   1. 구글시트에 새 데이터 행 추가 확인');
    console.log('   2. 관리자 이메일(hongik423@gmail.com) 수신 확인');
    console.log('   3. 테스트 이메일(test@example.com) 접수 확인 메일 수신 확인');
  } else {
    console.log('❌ 일부 테스트 실패');
    process.exit(1);
  }
  
  console.log('\n🔗 추가 확인 URL:');
  console.log(`   API 상태: ${API_BASE_URL}/api/beta-feedback`);
  console.log(`   테스트 페이지: ${API_BASE_URL}/test-beta-feedback.html`);
}

// 스크립트 실행
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testApiStatus,
  testBetaFeedbackSubmission,
  runAllTests
}; 