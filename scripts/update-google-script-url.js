#!/usr/bin/env node

/**
 * Google Apps Script URL 업데이트 스크립트
 * 새로운 배포 URL을 환경변수에 자동 업데이트
 */

const fs = require('fs');
const path = require('path');

// 환경변수 파일 경로
const ENV_FILES = [
  '.env.local',
  'env.local.production'
];

/**
 * Google Apps Script URL 업데이트
 */
function updateGoogleScriptUrl(newUrl) {
  console.log('🔧 Google Apps Script URL 업데이트 시작...');
  console.log('🆕 새 URL:', newUrl);
  
  ENV_FILES.forEach(envFile => {
    if (fs.existsSync(envFile)) {
      try {
        let content = fs.readFileSync(envFile, 'utf8');
        
        // 기존 NEXT_PUBLIC_GOOGLE_SCRIPT_URL 라인 찾아서 교체
        const urlRegex = /NEXT_PUBLIC_GOOGLE_SCRIPT_URL=.*/;
        const newLine = `NEXT_PUBLIC_GOOGLE_SCRIPT_URL=${newUrl}`;
        
        if (content.match(urlRegex)) {
          content = content.replace(urlRegex, newLine);
          console.log(`✅ ${envFile} 업데이트 완료`);
        } else {
          // 라인이 없으면 추가
          content += `\n${newLine}\n`;
          console.log(`➕ ${envFile}에 새 URL 추가`);
        }
        
        fs.writeFileSync(envFile, content);
        
      } catch (error) {
        console.error(`❌ ${envFile} 업데이트 실패:`, error.message);
      }
    } else {
      console.log(`⚠️ ${envFile} 파일이 존재하지 않습니다`);
    }
  });
  
  console.log('✅ Google Apps Script URL 업데이트 완료!');
  console.log('📝 다음 단계: npm run build && vercel --prod');
}

// 커맨드라인에서 URL 받기
const newUrl = process.argv[2];

if (!newUrl) {
  console.log('❌ 사용법: node scripts/update-google-script-url.js <새_URL>');
  console.log('📝 예시: node scripts/update-google-script-url.js https://script.google.com/...');
  process.exit(1);
}

// URL 유효성 검사
if (!newUrl.startsWith('https://script.google')) {
  console.error('❌ 잘못된 URL 형식입니다. Google Apps Script URL이어야 합니다.');
  process.exit(1);
}

updateGoogleScriptUrl(newUrl); 