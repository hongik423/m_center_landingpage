#!/usr/bin/env node

/**
 * Vercel 환경 변수 자동 설정 스크립트
 * M-CENTER Google Apps Script 기반 통합 시스템
 */

import { execSync } from 'child_process';

const envVars = [
  {
    name: 'NEXT_PUBLIC_GOOGLE_SHEETS_ID',
    value: '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug',
    description: 'Google Sheets ID (구글시트 데이터 저장)'
  },
  {
    name: 'NEXT_PUBLIC_GOOGLE_SCRIPT_URL',
    value: 'https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec',
    description: 'Google Apps Script URL (이메일 발송 및 데이터 처리)'
  },
  {
    name: 'NEXT_PUBLIC_BASE_URL',
    value: 'https://m-center-landingpage.vercel.app',
    description: '사이트 기본 URL'
  }
];

console.log('🚀 M-CENTER Google Apps Script 통합 시스템 환경 변수 설정 시작...\n');

function setVercelEnv(name, value, description) {
  try {
    console.log(`📝 설정 중: ${name} (${description})`);
    
    // Vercel에 환경 변수 추가 (Production과 Preview 환경)
    execSync(`vercel env add ${name}`, {
      input: `${value}\n1\n2\n`, // value, production, preview
      stdio: ['pipe', 'inherit', 'inherit'],
      encoding: 'utf8'
    });
    
    console.log(`✅ ${name} 설정 완료\n`);
  } catch (error) {
    console.error(`❌ ${name} 설정 실패:`, error.message);
  }
}

async function setupEnvironment() {
  // 기본 환경 변수들 설정
  for (const envVar of envVars) {
    setVercelEnv(envVar.name, envVar.value, envVar.description);
    
    // 각 설정 사이에 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('📧 이메일 시스템: Google Apps Script 통합 완료!');
  console.log('   ✅ 구글시트 자동 저장');
  console.log('   ✅ 관리자 알림 이메일');
  console.log('   ✅ 신청자 확인 이메일');
  console.log('');
  console.log('⚠️  중요: GEMINI_API_KEY는 수동으로 설정해야 합니다!');
  console.log('📋 다음 명령어를 실행하세요:');
  console.log('');
  console.log('vercel env add GEMINI_API_KEY');
  console.log('그리고 Google AI Studio에서 발급받은 API 키를 입력하세요.');
  console.log('');
  console.log('🔗 Google AI Studio: https://makersuite.google.com/app/apikey');
  console.log('');
  console.log('🎯 설정 완료 후 배포:');
  console.log('vercel --prod');
  console.log('');
  console.log('✨ EmailJS 제거 완료 - 이제 Google Apps Script만으로 안정적 운영!');
}

setupEnvironment().catch(console.error); 