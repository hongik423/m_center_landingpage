/**
 * 환경변수 검증 및 보안 관리 시스템
 * GitHub 보안 정책 준수
 */

import { z } from 'zod';

// 환경변수 스키마 정의
const envSchema = z.object({
  // Gemini API (서버 사이드 전용)
  GEMINI_API_KEY: z.string().min(1, 'Gemini API Key는 필수입니다'),
  
  // EmailJS (클라이언트 사이드 허용)
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: z.string().min(1, 'EmailJS Service ID는 필수입니다'),
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: z.string().min(1, 'EmailJS Public Key는 필수입니다'),
  
  // Google Sheets & Apps Script (클라이언트 사이드 허용)
  NEXT_PUBLIC_GOOGLE_SHEETS_ID: z.string().min(1, 'Google Sheets ID는 필수입니다'),
  NEXT_PUBLIC_GOOGLE_SCRIPT_URL: z.string().url('유효한 Google Script URL이 필요합니다').optional(),
  NEXT_PUBLIC_GOOGLE_SCRIPT_ID: z.string().optional(),
  
  // 선택적 환경변수
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().optional(),
});

// 타입 정의
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * 서버 사이드 환경변수 검증 및 반환
 * 민감한 정보는 서버에서만 접근 가능
 */
export function getServerEnv(): EnvConfig {
  try {
    const env = envSchema.parse({
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      NEXT_PUBLIC_GOOGLE_SHEETS_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
      NEXT_PUBLIC_GOOGLE_SCRIPT_URL: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL,
      NEXT_PUBLIC_GOOGLE_SCRIPT_ID: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_ID,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    });

    return env;
  } catch (error) {
    console.error('환경변수 검증 실패:', error);
    throw new Error('환경변수 설정을 확인해주세요');
  }
}

/**
 * 클라이언트 사이드 환경변수 (공개 가능한 것만)
 * NEXT_PUBLIC_ 접두사가 붙은 것만 클라이언트에서 접근 가능
 */
export function getClientEnv() {
  return {
    emailJsServiceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    emailJsPublicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    googleSheetsId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
    googleScriptUrl: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL,
    googleScriptId: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_ID,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    nodeEnv: process.env.NODE_ENV,
  };
}

/**
 * Gemini API Key (서버 전용)
 * 클라이언트에서 절대 접근 불가
 */
export function getGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  
  if (!key) {
    console.warn('⚠️ GEMINI_API_KEY가 설정되지 않았습니다. 클라이언트 사이드 응답을 사용합니다.');
    console.info('💡 실제 Gemini API를 사용하려면: 프로젝트 루트에 .env.local 파일을 생성하고');
    console.info('   GEMINI_API_KEY=your-actual-api-key 를 추가하세요.');
    throw new Error('GEMINI_API_KEY가 설정되지 않았습니다. 클라이언트 응답 모드로 작동합니다.');
  }
  
  // 개발용 임시 키 체크
  if (key.includes('temp') || key.includes('development') || key.includes('replace')) {
    console.warn('⚠️ 개발용 임시 Gemini API Key가 설정되어 있습니다. 클라이언트 사이드 응답을 사용합니다.');
    console.info('💡 실제 Gemini API를 사용하려면 실제 API 키로 교체하세요.');
    throw new Error('개발용 임시 키입니다. 클라이언트 응답 모드로 작동합니다.');
  }
  
  // API 키 형식 검증 (Gemini API 키는 AIza로 시작)
  if (!key.startsWith('AIza')) {
    console.error('❌ 유효하지 않은 Gemini API Key 형식입니다.');
    console.error('💡 올바른 형식: AIza... 로 시작하는 키');
    throw new Error('유효하지 않은 Gemini API Key 형식입니다');
  }
  
  console.log('✅ Gemini API Key 설정 완료:', maskApiKey(key));
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
    console.error('환경변수 검증 실패:', error);
    return false;
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
    console.log('🔧 환경변수 상태:', {
      nodeEnv: process.env.NODE_ENV,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasEmailJSConfig: !!(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY),
      hasGoogleSheetsId: !!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
      hasGoogleScriptUrl: !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL,
      hasGoogleScriptId: !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_ID,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      geminiKeyMasked: process.env.GEMINI_API_KEY ? maskApiKey(process.env.GEMINI_API_KEY) : 'None',
      googleScriptUrlMasked: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ? 
        `${process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL.slice(0, 50)}...` : 'None',
    });
  }
} 