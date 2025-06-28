#!/usr/bin/env node

/**
 * 베타피드백 시스템 테스트 스크립트
 * Google Apps Script 적용 후 즉시 테스트
 */

const https = require('https');

// 환경변수에서 Google Script URL 가져오기
require('dotenv').config({ path: '.env.local' });
const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

/**
 * HTTP POST 요청 함수
 */
function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const url = new URL(GOOGLE_SCRIPT_URL);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 베타피드백 테스트 데이터
 */
const testData = {
  // 🧪 베타피드백 테스트
  betaFeedback: {
    action: 'saveBetaFeedback',
    폼타입: '베타테스트_피드백',
    계산기명: '양도소득세 계산기',
    피드백유형: '🐛 버그 신고',
    사용자이메일: 'test@example.com',
    문제설명: '기본공제 250만원이 자동으로 적용되지 않는 문제',
    기대동작: '양도차익에서 자동으로 250만원이 차감되어야 함',
    실제동작: '기본공제가 적용되지 않아 세금이 과도하게 계산됨',
    재현단계: '1. 양도소득세 계산기 접속\n2. 양도가액 1억, 취득가액 7천만원 입력\n3. 계산하기 클릭\n4. 기본공제 없이 계산됨',
    심각도: '높음',
    추가의견: '사용자가 기본공제를 모르고 잘못된 세금을 신뢰할 수 있음',
    브라우저정보: 'Chrome 120.0.0 Windows 10',
    제출경로: 'https://m-center.co.kr/tax-calculator',
    dataSource: 'TEST_SCRIPT'
  },

  // 🎯 진단신청 테스트 (기존 기능 확인)
  diagnosis: {
    회사명: '테스트 베타기업',
    업종: 'software-development',
    사업담당자: '김테스트',
    직원수: '10-50명',
    사업성장단계: 'growth',
    주요고민사항: 'AI 도입 및 세무 최적화 필요',
    예상혜택: '업무효율 50% 향상, 세무비용 30% 절감',
    진행사업장: '서울',
    담당자명: '김담당자',
    연락처: '010-1234-5678',
    이메일: 'diagnosis-test@example.com',
    개인정보동의: true
  },

  // 💬 상담신청 테스트 (기존 기능 확인)
  consultation: {
    상담유형: 'business-analysis',
    성명: '홍길동',
    연락처: '010-9876-5432',
    이메일: 'consultation-test@example.com',
    회사명: '테스트 상담기업',
    직책: '대표',
    상담분야: '세무 최적화',
    문의내용: '양도소득세 절세 방안 상담 요청',
    희망상담시간: '평일 오후',
    개인정보동의: true
  }
};

/**
 * 테스트 실행
 */
async function runTests() {
  console.log('🧪 베타피드백 시스템 테스트 시작');
  console.log('🔗 Google Script URL:', GOOGLE_SCRIPT_URL);
  console.log('==========================================\n');

  if (!GOOGLE_SCRIPT_URL) {
    console.error('❌ GOOGLE_SCRIPT_URL이 설정되지 않았습니다.');
    console.log('📝 .env.local 파일을 확인하세요.');
    process.exit(1);
  }

  const tests = [
    { name: '🧪 베타피드백 테스트', data: testData.betaFeedback },
    { name: '🎯 진단신청 테스트', data: testData.diagnosis },
    { name: '💬 상담신청 테스트', data: testData.consultation }
  ];

  for (const test of tests) {
    console.log(`\n${test.name} 실행 중...`);
    
    try {
      const result = await makeRequest(test.data);
      
      if (result.status === 200 && result.data.success) {
        console.log('✅ 성공:', result.data.message);
        console.log('📊 저장 위치:', result.data.sheet || 'N/A');
        console.log('📝 행 번호:', result.data.row || 'N/A');
      } else {
        console.log('❌ 실패:', result.data.error || result.data);
        console.log('📊 상태 코드:', result.status);
      }
      
    } catch (error) {
      console.error('💥 오류:', error.message);
    }
    
    // 요청 간 1초 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n==========================================');
  console.log('🎉 베타피드백 시스템 테스트 완료!');
  console.log('📋 구글시트 확인: https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/edit');
  console.log('📧 관리자 이메일 확인: hongik423@gmail.com');
}

// 테스트 실행
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testData }; 