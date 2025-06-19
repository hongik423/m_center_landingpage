/**
 * GitHub Pages 환경에서 안전한 데이터 접근을 위한 유틸리티 함수들
 * 
 * @description 정적 배포 환경에서 발생할 수 있는 데이터 접근 오류를 방지하고
 *              안전한 데이터 처리를 위한 헬퍼 함수들을 제공합니다.
 */

/**
 * 안전한 깊은 객체 접근
 * @param obj 접근할 객체
 * @param path 점 표기법으로 된 경로 (예: 'data.diagnosis.companyName')
 * @param defaultValue 기본값
 * @returns 안전하게 접근된 값 또는 기본값
 */
export function safeGet<T = any>(obj: any, path: string, defaultValue: T = undefined as T): T {
  try {
    if (!obj || typeof obj !== 'object') {
      return defaultValue;
    }

    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[key];
    }

    return current !== undefined ? current : defaultValue;
  } catch (error) {
    console.warn(`⚠️ safeGet 오류: ${path}`, error);
    return defaultValue;
  }
}

/**
 * API 응답 데이터 검증 및 정규화
 * @param response API 응답
 * @returns 정규화된 응답 객체
 */
export function validateApiResponse(response: any): {
  isValid: boolean;
  data: any;
  error: string | null;
} {
  try {
    if (!response) {
      return {
        isValid: false,
        data: null,
        error: '응답 데이터가 없습니다'
      };
    }

    // 다양한 응답 구조 처리
    if (response.success !== undefined && response.data) {
      // 표준 구조: { success: boolean, data: any }
      return {
        isValid: Boolean(response.success),
        data: response.data,
        error: response.success ? null : (response.error || '알 수 없는 오류')
      };
    }

    if (response.response && typeof response.response === 'string') {
      // AI 챗봇 응답 구조: { response: string }
      return {
        isValid: true,
        data: response,
        error: null
      };
    }

    if (response.diagnosis || response.summaryReport) {
      // 진단 응답 구조: { diagnosis: any, summaryReport: string }
      return {
        isValid: true,
        data: response,
        error: null
      };
    }

    // 일반적인 객체
    return {
      isValid: true,
      data: response,
      error: null
    };

  } catch (error) {
    console.error('❌ API 응답 검증 중 오류:', error);
    return {
      isValid: false,
      data: null,
      error: error instanceof Error ? error.message : '응답 검증 실패'
    };
  }
}

/**
 * GitHub Pages 환경 감지
 * @returns GitHub Pages 환경 여부
 */
export function isGitHubPages(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.location.hostname.includes('github.io') ||
         window.location.hostname.includes('githubpages.com');
}

/**
 * 브라우저 환경 감지
 * @returns 브라우저 환경 정보
 */
export function getBrowserInfo() {
  if (typeof window === 'undefined') {
    return {
      isBrowser: false,
      userAgent: 'server',
      isGitHubPages: false,
      supportsLocalStorage: false
    };
  }

  return {
    isBrowser: true,
    userAgent: navigator.userAgent,
    isGitHubPages: isGitHubPages(),
    supportsLocalStorage: !!window.localStorage
  };
}

/**
 * 안전한 로컬스토리지 접근
 * @param key 키
 * @param defaultValue 기본값
 * @returns 저장된 값 또는 기본값
 */
export function safeLocalStorageGet(key: string, defaultValue: any = null): any {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }

    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }

    return JSON.parse(item);
  } catch (error) {
    console.warn(`⚠️ localStorage 읽기 오류 (${key}):`, error);
    return defaultValue;
  }
}

/**
 * 안전한 로컬스토리지 저장
 * @param key 키
 * @param value 값
 * @returns 저장 성공 여부
 */
export function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`⚠️ localStorage 저장 오류 (${key}):`, error);
    return false;
  }
}

/**
 * 안전한 URL 생성 (GitHub Pages basePath 고려)
 * @param path 경로
 * @returns 완전한 URL
 */
export function createSafeUrl(path: string): string {
  if (typeof window === 'undefined') {
    return path;
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // 이미 절대 URL인 경우
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 상대 경로 처리
  if (path.startsWith('/')) {
    return `${basePath}${path}`;
  }

  return `${basePath}/${path}`;
}

/**
 * 오류 정보 수집 (디버깅용)
 * @param error 오류 객체
 * @param context 추가 컨텍스트
 * @returns 구조화된 오류 정보
 */
export function collectErrorInfo(error: any, context?: Record<string, any>) {
  const browserInfo = getBrowserInfo();
  
  return {
    timestamp: new Date().toISOString(),
    error: {
      message: error?.message || String(error),
      name: error?.name || 'Unknown',
      stack: error?.stack || null
    },
    browser: browserInfo,
    context: context || {},
    url: browserInfo.isBrowser ? window.location.href : 'server',
    userAgent: browserInfo.userAgent
  };
}

/**
 * GitHub Pages 환경에서 API 호출 안전성 체크
 * @param url API URL
 * @returns 호출 가능 여부와 권장 사항
 */
export function checkApiCompatibility(url: string): {
  canCall: boolean;
  recommendation: string;
  fallbackAction: string;
} {
  const browserInfo = getBrowserInfo();
  
  if (!browserInfo.isBrowser) {
    return {
      canCall: false,
      recommendation: '서버 환경에서는 API 호출 불가',
      fallbackAction: '클라이언트 사이드 처리 권장'
    };
  }

  if (browserInfo.isGitHubPages && url.startsWith('/api/')) {
    return {
      canCall: false,
      recommendation: 'GitHub Pages는 API 라우트를 지원하지 않음',
      fallbackAction: '클라이언트 사이드 로직으로 대체 또는 외부 API 사용'
    };
  }

  return {
    canCall: true,
    recommendation: 'API 호출 가능',
    fallbackAction: '없음'
  };
}

/**
 * 데이터 타입 안전 검증
 * @param data 검증할 데이터
 * @param expectedType 예상 타입
 * @returns 타입 검증 결과
 */
export function validateDataType(data: any, expectedType: string): {
  isValid: boolean;
  actualType: string;
  message: string;
} {
  const actualType = Array.isArray(data) ? 'array' : typeof data;
  
  if (actualType === expectedType) {
    return {
      isValid: true,
      actualType,
      message: '타입 검증 성공'
    };
  }

  return {
    isValid: false,
    actualType,
    message: `예상 타입: ${expectedType}, 실제 타입: ${actualType}`
  };
} 