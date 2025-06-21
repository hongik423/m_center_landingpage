import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 숫자를 한국어 천 단위 구분기호로 포맷팅
 */
export const formatNumber = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  return new Intl.NumberFormat('ko-KR').format(num);
};

/**
 * 숫자를 한국 원화 통화 형식으로 포맷팅
 */
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * 숫자를 한국어 천 단위 구분기호와 함께 "원" 단위로 포맷팅
 */
export const formatWon = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  return `${formatNumber(num)}원`;
};

/**
 * 퍼센트를 한국어 형식으로 포맷팅
 */
export const formatPercent = (rate: number, precision: number = 2): string => {
  return `${rate.toFixed(precision)}%`;
};

// 추가된 숫자 입력 필드 전용 함수들

/**
 * 입력된 문자열에서 숫자만 추출하여 반환
 */
export const extractNumbers = (value: string): string => {
  return value.replace(/[^\d]/g, '');
};

/**
 * 숫자 입력 필드용 포맷팅 (실시간 천원 단위 구분자 적용)
 */
export const formatNumberInput = (value: string | number): string => {
  if (!value) return '';
  const numStr = typeof value === 'string' ? extractNumbers(value) : value.toString();
  const num = parseInt(numStr) || 0;
  return num === 0 ? '' : formatNumber(num);
};

/**
 * 포맷팅된 숫자 문자열을 순수 숫자로 파싱
 */
export const parseFormattedNumber = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  const numStr = extractNumbers(formattedValue);
  return parseInt(numStr) || 0;
};

/**
 * 숫자 입력 필드의 변경사항을 처리하는 헬퍼 함수
 */
export const handleNumberInputChange = (
  inputValue: string,
  onChange: (value: number) => void,
  options?: {
    min?: number;
    max?: number;
    allowEmpty?: boolean;
  }
): string => {
  const { min = 0, max, allowEmpty = true } = options || {};
  
  // 빈 값 처리
  if (!inputValue && allowEmpty) {
    onChange(0);
    return '';
  }
  
  // 숫자만 추출
  const numericValue = extractNumbers(inputValue);
  let num = parseInt(numericValue) || 0;
  
  // 최소값/최대값 제한
  if (num < min) num = min;
  if (max && num > max) num = max;
  
  // 콜백 호출
  onChange(num);
  
  // 포맷팅된 값 반환
  return num === 0 && allowEmpty ? '' : formatNumber(num);
};

/**
 * 숫자 입력 필드 유효성 검사
 */
export const validateNumberInput = (
  value: number,
  options?: {
    min?: number;
    max?: number;
    required?: boolean;
  }
): { isValid: boolean; errorMessage?: string } => {
  const { min = 0, max, required = false } = options || {};
  
  if (required && (!value || value === 0)) {
    return { isValid: false, errorMessage: '필수 입력 항목입니다.' };
  }
  
  if (value < min) {
    return { isValid: false, errorMessage: `최소값은 ${formatNumber(min)}원입니다.` };
  }
  
  if (max && value > max) {
    return { isValid: false, errorMessage: `최대값은 ${formatNumber(max)}원입니다.` };
  }
  
  return { isValid: true };
};

// 🔧 GitHub Pages 호환 이미지 경로 처리
export function getImagePath(imagePath: string): string {
  // 클라이언트 사이드에서만 실행
  if (typeof window === 'undefined') {
    return imagePath;
  }
  
  // 이미 전체 URL이면 그대로 반환
  if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
    return imagePath;
  }
  
  // 절대 경로가 아니면 / 추가
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // 환경변수에서 base path 가져오기
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  return `${basePath}${cleanPath}`;
}
