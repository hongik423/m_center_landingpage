/**
 * 환경변수 검증 및 보안 관리 시스템
 * Google Apps Script 기반 통합 시스템 (EmailJS 제거됨)
 */

import { z } from 'zod';

// 🔧 **실제 M-CENTER 구글시트 정보**
const DEFAULT_GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec';
const GOOGLE_SHEETS_ID = '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug';

// 환경변수 스키마 정의 (EmailJS 제거됨)
const envSchema = z.object({
  // 고급 분석 API (서버 사이드 전용)
  GEMINI_API_KEY: z.string().min(1, '고급 분석 API Key는 필수입니다').optional(),
  
  // Google Sheets & Apps Script (클라이언트 사이드 허용)
  NEXT_PUBLIC_GOOGLE_SHEETS_ID: z.string().min(1, 'Google Sheets ID는 필수입니다').optional(),
  NEXT_PUBLIC_GOOGLE_SCRIPT_URL: z.string().url('유효한 Google Script URL이 필요합니다').optional(),
  NEXT_PUBLIC_BASE_URL: z.string().optional(),
  
  // 선택적 환경변수
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VERCEL_URL: z.string().optional(),
});

// 타입 정의
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * 서버 사이드 환경변수 검증 및 반환
 */
export function getServerEnv(): EnvConfig {
  try {
    const env = envSchema.parse({
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      NEXT_PUBLIC_GOOGLE_SHEETS_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
      NEXT_PUBLIC_GOOGLE_SCRIPT_URL: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
    });

    return env;
  } catch (error) {
    console.error('환경변수 검증 실패:', error);
    // 개발 환경에서는 기본값으로 계속 진행
    return {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      NEXT_PUBLIC_GOOGLE_SHEETS_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || GOOGLE_SHEETS_ID,
      NEXT_PUBLIC_GOOGLE_SCRIPT_URL: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || DEFAULT_GOOGLE_SCRIPT_URL,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://m-center-landingpage.vercel.app',
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      VERCEL_URL: process.env.VERCEL_URL,
    };
  }
}

/**
 * 클라이언트 사이드 환경변수 (Google Apps Script 기반)
 */
export function getClientEnv() {
  return {
    googleSheetsId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || GOOGLE_SHEETS_ID,
    googleScriptUrl: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || DEFAULT_GOOGLE_SCRIPT_URL,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://m-center-landingpage.vercel.app',
    nodeEnv: process.env.NODE_ENV || 'production',
  };
}

/**
 * 🎯 통합 앱 설정 (appConfig) - emailService.ts에서 사용
 */
export const appConfig = {
  // Google Apps Script 설정
  googleSheetsId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || GOOGLE_SHEETS_ID,
  googleScriptUrl: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || DEFAULT_GOOGLE_SCRIPT_URL,
  
  // 환경 설정
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // 회사 정보
  company: {
    name: 'M-CENTER',
    email: 'hongik423@gmail.com', // 관리자 이메일
    phone: '010-9251-9743',
  },
  
  // 기본 URL
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://m-center-landingpage.vercel.app',
};

/**
 * 고급 분석 API Key (서버 전용) - 보안 강화
 */
export function getGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  
  if (!key) {
    console.warn('⚠️ 고급 분석 API Key가 설정되지 않았습니다.');
    console.info('💡 .env.local 파일에 GEMINI_API_KEY=AIzaSy... 를 추가하세요.');
    console.info('🔗 고급 분석 API 키 발급: https://makersuite.google.com/app/apikey');
    console.info('📝 설정 후 개발 서버를 재시작하세요: npm run dev');
    return ''; // 빈 문자열 반환으로 폴백 모드 활성화
  }
  
  // 개발용 임시 키 체크
  if (key.includes('temp') || key.includes('development') || key.includes('replace') || key.includes('your-')) {
    console.warn('⚠️ 개발용 임시 고급 분석 API Key가 설정되어 있습니다.');
    console.info('💡 실제 Google AI Studio에서 발급받은 API 키로 교체하세요.');
    return ''; // 빈 문자열 반환으로 폴백 모드 활성화
  }
  
  // API 키 형식 검증 (AIza로 시작)
  if (!key.startsWith('AIza')) {
    console.error('❌ 유효하지 않은 고급 분석 API Key 형식입니다.');
    console.error('💡 올바른 형식: AIzaSy... 로 시작하는 키');
    console.error('💡 Google AI Studio (https://makersuite.google.com/app/apikey)에서 발급받으세요.');
    return ''; // 빈 문자열 반환으로 폴백 모드 활성화
  }
  
  // 키 길이 검증 (일반적으로 39자)
  if (key.length < 30 || key.length > 50) {
    console.error('❌ 고급 분석 API Key 길이가 비정상적입니다.');
    console.error('💡 올바른 키인지 확인하세요.');
    return ''; // 빈 문자열 반환으로 폴백 모드 활성화
  }
  
  console.log('✅ 고급 분석 API Key 검증 완료:', maskApiKey(key));
  return key;
}

/**
 * 환경변수 유효성 검사
 */
export function validateEnv(): boolean {
  try {
    getServerEnv();
    return true;
  } catch (error) {
    console.warn('환경변수 검증 경고:', error);
    return true; // 기본값으로 계속 진행
  }
}

/**
 * 개발 환경 여부 확인
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 프로덕션 환경 여부 확인
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * API 키 마스킹 (로깅용)
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '***';
  return `${key.slice(0, 8)}****${key.slice(-4)}`;
}

/**
 * Google Apps Script 연결 테스트
 */
export async function testGoogleScriptConnection(): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}> {
  try {
    const clientEnv = getClientEnv();
    const scriptUrl = clientEnv.googleScriptUrl;
    
    if (!scriptUrl) {
      return {
        success: false,
        message: 'Google Script URL이 설정되지 않았습니다.',
        error: 'NEXT_PUBLIC_GOOGLE_SCRIPT_URL 환경변수를 확인해주세요.'
      };
    }
    
    console.log('🔵 Google Apps Script 연결 테스트 시작:', scriptUrl);
    
    const response = await fetch(scriptUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Google Apps Script 연결 성공:', data);
    
    return {
      success: true,
      message: 'Google Apps Script 연결 테스트 성공',
      data: data
    };
    
  } catch (error) {
    console.error('❌ Google Apps Script 연결 실패:', error);
    
    return {
      success: false,
      message: 'Google Apps Script 연결 테스트 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

/**
 * 환경변수 상태 로깅 (민감한 정보 제외)
 */
export function logEnvStatus(): void {
  if (isDevelopment()) {
    console.log('🔧 환경변수 상태 (Google Apps Script 통합):', {
      nodeEnv: process.env.NODE_ENV,
      hasAnalysisKey: !!process.env.GEMINI_API_KEY,
      hasGoogleSheetsId: !!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
      hasGoogleScriptUrl: !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      analysisKeyMasked: process.env.GEMINI_API_KEY ? maskApiKey(process.env.GEMINI_API_KEY) : 'None',
      googleScriptUrlMasked: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ? 
        `${process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL.slice(0, 50)}...` : 'Default',
    });
  }
} 