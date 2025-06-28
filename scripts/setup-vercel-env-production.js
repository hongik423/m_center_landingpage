#!/usr/bin/env node

/**
 * 🚀 M-CENTER Vercel 배포용 환경변수 설정 스크립트
 * 
 * 사용법:
 * 1. npm install -g vercel
 * 2. vercel login
 * 3. node scripts/setup-vercel-env-production.js
 */

const { execSync } = require('child_process');

// 🔧 환경변수 설정 목록 (통합 베타 피드백 시스템)
const ENV_VARS = {
  // Google Gemini API 키
  'GEMINI_API_KEY': 'AIzaSyAP-Qa4TVNmsc-KAPTuQFjLalDNcvMHoiM',
  
  // Google Apps Script 설정 (통합 시스템)
  'NEXT_PUBLIC_GOOGLE_SCRIPT_URL': 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjlPkXAy1JSZCxhJy00AazUvHbWwR5mpbJwY8Wo7EdJAPvSFn7bPZwZZcVf0icXh1inySn7aEpws1y4Kae-L2ZIajbzwY5iHEBnOznoKkS91UkNIm-OId2C7eZPR3CHSINoNdcskUwA1HhhC2hKgXqsazD9gtX_lAuioR1yMwsawhbpHF5MzGKYvcEVOtkdH2BqWu00sbHtebiNaADZNvsxuZZ2k6IpRruov5jg4BzpFxttmoTdAQTdIe0EQLnM7OCuGNf5gK1fruLiT4CKagjC04WJTQ&lib=MSO6FP3_fOVcXPyKa1j-76EzN9sd4IQmq',
  'NEXT_PUBLIC_GOOGLE_SCRIPT_ID': '1eq4jLxuXgVfjH76MJRPq6aetIybwNjD2IpvLWgY3wlfDLPW2h2hzEjAC',
  'NEXT_PUBLIC_GOOGLE_SCRIPT_DEPLOYMENT_ID': 'AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX',
  'NEXT_PUBLIC_GOOGLE_SHEETS_ID': '1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM',
  'NEXT_PUBLIC_GOOGLE_SHEETS_URL': 'https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/edit?usp=sharing',
  
  // 회사 정보
  'NEXT_PUBLIC_COMPANY_NAME': 'M-CENTER',
  'NEXT_PUBLIC_COMPANY_EMAIL': 'admin@m-center.co.kr',
  'NEXT_PUBLIC_SUPPORT_EMAIL': 'support@m-center.co.kr',
  
  // 배포 환경
  'NODE_ENV': 'production',
  'NEXT_PUBLIC_BASE_URL': 'https://m-center.co.kr',
  
  // 베타 피드백 시스템
  'BETA_FEEDBACK_ADMIN_EMAIL': 'admin@m-center.co.kr',
  'BETA_FEEDBACK_REPLY_EMAIL': 'support@m-center.co.kr'
};

console.log('🚀 M-CENTER Vercel 환경변수 설정을 시작합니다...\n');

function execCommand(command) {
  try {
    const result = execSync(command, { encoding: 'utf8' });
    return { success: true, output: result.trim() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function setEnvironmentVariable(key, value, environment = 'production') {
  console.log(`📝 ${key} 설정 중...`);
  
  const command = `vercel env add ${key} ${environment}`;
  
  try {
    const child = require('child_process').spawn('vercel', ['env', 'add', key, environment], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // 값 입력
    child.stdin.write(value + '\n');
    child.stdin.end();
    
    return new Promise((resolve) => {
      let output = '';
      let error = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log(`  ✅ ${key} 설정 완료`);
          resolve({ success: true });
        } else {
          console.log(`  ❌ ${key} 설정 실패:`, error);
          resolve({ success: false, error });
        }
      });
    });
  } catch (error) {
    console.log(`  ❌ ${key} 설정 실패:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  // 1. Vercel CLI 설치 확인
  const vercelCheck = execCommand('vercel --version');
  if (!vercelCheck.success) {
    console.log('❌ Vercel CLI가 설치되지 않았습니다.');
    console.log('💡 설치 방법: npm install -g vercel');
    process.exit(1);
  }
  
  console.log(`✅ Vercel CLI 확인됨: ${vercelCheck.output}\n`);
  
  // 2. 로그인 상태 확인
  const whoAmI = execCommand('vercel whoami');
  if (!whoAmI.success) {
    console.log('❌ Vercel에 로그인되지 않았습니다.');
    console.log('💡 로그인 방법: vercel login');
    process.exit(1);
  }
  
  console.log(`✅ Vercel 로그인 확인됨: ${whoAmI.output}\n`);
  
  // 3. 프로젝트 링크 확인
  const linkCheck = execCommand('vercel ls');
  console.log('📋 연결된 Vercel 프로젝트:', linkCheck.output || '프로젝트 목록을 확인할 수 없습니다.\n');
  
  // 4. 환경변수 설정
  console.log('🔧 환경변수 설정을 시작합니다...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [key, value] of Object.entries(ENV_VARS)) {
    const result = await setEnvironmentVariable(key, value);
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // 잠시 대기 (API 제한 방지)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 5. 결과 요약
  console.log('\n📊 환경변수 설정 결과:');
  console.log(`  ✅ 성공: ${successCount}개`);
  console.log(`  ❌ 실패: ${failCount}개`);
  console.log(`  📋 전체: ${Object.keys(ENV_VARS).length}개\n`);
  
  if (failCount > 0) {
    console.log('⚠️  일부 환경변수 설정에 실패했습니다.');
    console.log('🔧 Vercel 대시보드에서 수동으로 설정해주세요.');
    console.log('🌐 https://vercel.com/dashboard\n');
  }
  
  // 6. 배포 안내
  console.log('🚀 환경변수 설정이 완료되었습니다!');
  console.log('');
  console.log('다음 단계:');
  console.log('1. vercel --prod (프로덕션 배포)');
  console.log('2. 베타 피드백 시스템 테스트');
  console.log('3. Google Apps Script 연동 확인');
  console.log('');
  console.log('🔗 유용한 링크:');
  console.log(`📊 Google Sheets: ${ENV_VARS.NEXT_PUBLIC_GOOGLE_SHEETS_URL}`);
  console.log('🌐 Vercel 대시보드: https://vercel.com/dashboard');
  console.log('📧 베타 피드백 테스트: /tax-calculator (오류신고 버튼)');
}

// 스크립트 실행
main().catch(error => {
  console.error('❌ 스크립트 실행 중 오류 발생:', error);
  process.exit(1);
}); 