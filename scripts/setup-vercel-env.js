#!/usr/bin/env node

/**
 * Vercel 환경 변수 자동 설정 스크립트
 * M-CENTER 별-AI상담사 Gemini API 활성화
 */

const { execSync } = require('child_process');

const envVars = [
  {
    name: 'NEXT_PUBLIC_EMAILJS_SERVICE_ID',
    value: 'service_qd9eycz',
    description: 'EmailJS 서비스 ID'
  },
  {
    name: 'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY',
    value: '268NPLwN54rPvEias',
    description: 'EmailJS 공개 키'
  },
  {
    name: 'NEXT_PUBLIC_EMAILJS_TEMPLATE_DIAGNOSIS',
    value: 'template_diagnosis_conf',
    description: 'EmailJS 진단 템플릿'
  },
  {
    name: 'NEXT_PUBLIC_EMAILJS_TEMPLATE_CONSULTATION',
    value: 'template_consultation_conf',
    description: 'EmailJS 상담 템플릿'
  },
  {
    name: 'NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN',
    value: 'template_admin_notification',
    description: 'EmailJS 관리자 템플릿'
  },
  {
    name: 'NEXT_PUBLIC_GOOGLE_SHEETS_ID',
    value: '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug',
    description: 'Google Sheets ID'
  },
  {
    name: 'NEXT_PUBLIC_GOOGLE_SCRIPT_URL',
    value: 'https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec',
    description: 'Google Apps Script URL'
  },
  {
    name: 'NEXT_PUBLIC_GOOGLE_SCRIPT_ID',
    value: 'AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX',
    description: 'Google Apps Script ID'
  },
  {
    name: 'NEXT_PUBLIC_BASE_URL',
    value: 'https://m-center-landingpage.vercel.app',
    description: '사이트 기본 URL'
  }
];

console.log('🚀 M-CENTER 별-AI상담사 Vercel 환경 변수 설정 시작...\n');

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
}

setupEnvironment().catch(console.error); 