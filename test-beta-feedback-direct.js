#!/usr/bin/env node

/**
 * 🧪 M-CENTER 베타피드백 API 직접 테스트
 * 실행: node test-beta-feedback-direct.js
 */

const http = require('http');

// 포트 3000으로 수정 (Next.js 기본 포트)
const API_BASE_URL = 'http://localhost:3000';

// 🎯 테스트 데이터
const testData = {
  action: 'saveBetaFeedback',
  제출일시: new Date().toISOString(),
  폼타입: '베타테스트_피드백',
  계산기명: '[테스트] 상속세 계산기',
  피드백유형: '🧪 테스트 피드백',
  사용자이메일: 'test-beta@example.com',
  문제설명: 'Direct Node.js 테스트를 통한 베타피드백 시스템 검증',
  기대동작: '정상적인 처리 및 구글시트 저장',
  실제동작: '테스트 진행 중',
  재현단계: '1. Node.js 스크립트 실행\n2. API 호출\n3. 결과 확인',
  심각도: '보통',
  추가의견: 'Direct API 테스트',
  브라우저정보: 'Node.js ' + process.version,
  제출경로: API_BASE_URL + '/api/beta-feedback',
  타임스탬프: Date.now(),
  dataSource: 'direct-nodejs-test'
};

/**
 * HTTP 요청 함수
 */
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3000, // 포트 3000으로 수정
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
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
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
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
 * 메인 테스트 함수
 */
async function runTest() {
  console.log('🧪 M-CENTER 베타피드백 Direct API 테스트 시작');
  console.log('=======================================================');
  
  try {
    // 1. API 상태 확인
    console.log('🔍 1단계: API 상태 확인...');
    const statusResponse = await makeRequest('GET', '/api/beta-feedback');
    
    if (statusResponse.statusCode === 200) {
      console.log('✅ API 상태 확인 성공');
      console.log('   상태:', statusResponse.data.success ? '정상' : '오류');
    } else {
      console.log('❌ API 상태 확인 실패, 상태 코드:', statusResponse.statusCode);
    }
    
    // 2. 베타 피드백 제출 테스트
    console.log('\n🚀 2단계: 베타피드백 제출 테스트...');
    console.log('📝 테스트 데이터:', {
      계산기명: testData.계산기명,
      피드백유형: testData.피드백유형,
      이메일: testData.사용자이메일
    });
    
    const submitResponse = await makeRequest('POST', '/api/beta-feedback', testData);
    
    console.log(`\n📊 제출 응답 상태: ${submitResponse.statusCode}`);
    
    if (submitResponse.statusCode === 200) {
      console.log('✅ 베타피드백 제출 성공!');
      console.log('📋 응답 데이터:', JSON.stringify(submitResponse.data, null, 2));
    } else {
      console.log('❌ 베타피드백 제출 실패');
      console.log('응답:', submitResponse.data);
    }
    
    console.log('\n=======================================================');
    console.log('🎯 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 테스트 실행 오류:', error.message);
    console.log('\n⚠️ 개발 서버가 실행 중인지 확인해주세요:');
    console.log('   npm run dev');
  }
}

// 테스트 실행
runTest(); 