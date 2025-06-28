/**
 * ================================================================================
 * Google Apps Script URL 긴급 업데이트 스크립트
 * ================================================================================
 * 
 * 사용법:
 * node scripts/update-google-script-url-urgent.js [새로운_URL]
 * 
 * 예시:
 * node scripts/update-google-script-url-urgent.js https://script.google.com/macros/s/AKfycbz.../exec
 */

const fs = require('fs');
const path = require('path');

function updateGoogleScriptUrl(newUrl) {
  try {
    console.log('🔄 Google Apps Script URL 긴급 업데이트 시작...');
    
    // 환경변수 파일 경로
    const envPath = path.join(__dirname, '..', '.env.local');
    
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env.local 파일이 존재하지 않습니다.');
      console.log('💡 파일을 생성하고 다음 내용을 추가하세요:');
      console.log(`NEXT_PUBLIC_GOOGLE_SCRIPT_URL=${newUrl}`);
      return;
    }
    
    // 기존 환경변수 파일 읽기
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // 기존 NEXT_PUBLIC_GOOGLE_SCRIPT_URL 라인 찾아서 교체
    const urlRegex = /NEXT_PUBLIC_GOOGLE_SCRIPT_URL=.*/;
    const newLine = `NEXT_PUBLIC_GOOGLE_SCRIPT_URL=${newUrl}`;
    
    if (envContent.match(urlRegex)) {
      // 기존 라인 교체
      envContent = envContent.replace(urlRegex, newLine);
      console.log('✅ 기존 URL 업데이트됨');
    } else {
      // 새 라인 추가
      envContent = envContent.trim() + '\n' + newLine + '\n';
      console.log('✅ 새 URL 추가됨');
    }
    
    // 파일 저장
    fs.writeFileSync(envPath, envContent);
    
    console.log('🎯 Google Apps Script URL 업데이트 완료!');
    console.log(`📝 새 URL: ${newUrl.substring(0, 50)}...`);
    console.log('');
    console.log('🚀 다음 단계:');
    console.log('1. npm run dev (개발 서버 재시작)');
    console.log('2. http://localhost:3005/test-email 에서 테스트');
    console.log('3. Google Apps Script 연결 테스트 실행');
    
  } catch (error) {
    console.error('❌ URL 업데이트 실패:', error.message);
  }
}

// URL 검증 함수 (Google Apps Script 웹앱 URL 형식 지원)
function validateUrl(url) {
  const execPattern = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
  const userContentPattern = /^https:\/\/script\.googleusercontent\.com\/macros\/echo\?user_content_key=.+$/;
  return execPattern.test(url) || userContentPattern.test(url);
}

// 메인 실행
const newUrl = process.argv[2];

if (!newUrl) {
  console.log('🔧 Google Apps Script URL 긴급 업데이트 도구');
  console.log('');
  console.log('사용법:');
  console.log('  node scripts/update-google-script-url-urgent.js [새로운_URL]');
  console.log('');
  console.log('예시:');
  console.log('  node scripts/update-google-script-url-urgent.js https://script.google.com/macros/s/AKfycbz.../exec');
  console.log('');
  console.log('🚨 현재 상태: Google Apps Script 연결 실패 (404 오류)');
  console.log('📋 해결 방법:');
  console.log('1. Google Apps Script에서 "새 배포" 생성');
  console.log('2. 새 웹앱 URL 복사');
  console.log('3. 이 스크립트로 URL 업데이트');
  process.exit(1);
}

if (!validateUrl(newUrl)) {
  console.error('❌ 올바르지 않은 Google Apps Script URL 형식입니다.');
  console.log('💡 올바른 형식: https://script.google.com/macros/s/[스크립트ID]/exec');
  process.exit(1);
}

updateGoogleScriptUrl(newUrl); 