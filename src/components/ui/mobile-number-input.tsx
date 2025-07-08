'use client';

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MobileNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number | string;
  onChange?: (value: number) => void;
  placeholder?: string;
  suffix?: string;
  prefix?: string;
  maxValue?: number;
  minValue?: number;
  allowDecimals?: boolean;
  autoComma?: boolean;
  className?: string;
  displayUnit?: string; // "억원", "만원" 등
  unitDivider?: number; // 억원 변환을 위한 나눗수 (100000000)
  mobileOptimized?: boolean;
}

const MobileNumberInput = forwardRef<HTMLInputElement, MobileNumberInputProps>(
  ({ 
    value = '',
    onChange,
    placeholder = '0',
    suffix = '',
    prefix = '',
    maxValue = Number.MAX_SAFE_INTEGER,
    minValue = 0,
    allowDecimals = false,
    autoComma = true,
    className = '',
    displayUnit = '',
    unitDivider = 100000000,
    mobileOptimized = true,
    ...props 
  }, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // 숫자에 천단위 쉼표 추가
    const addCommas = (num: string): string => {
      if (!autoComma) return num;
      const parts = num.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    };

    // 쉼표 제거하고 숫자만 추출
    const removeCommas = (str: string): string => {
      return str.replace(/,/g, '');
    };

    // 숫자 유효성 검사 및 포맷팅
    const formatInput = (inputValue: string): { formatted: string; numeric: number } => {
      if (!inputValue || inputValue === '') {
        return { formatted: '0', numeric: 0 };
      }

      // 숫자와 소수점만 허용 (allowDecimals 설정에 따라)
      let cleanValue = allowDecimals ? 
        inputValue.replace(/[^\d.]/g, '') : 
        inputValue.replace(/[^\d]/g, '');

      // 소수점 중복 제거
      if (allowDecimals) {
        const dotCount = (cleanValue.match(/\./g) || []).length;
        if (dotCount > 1) {
          const firstDotIndex = cleanValue.indexOf('.');
          cleanValue = cleanValue.substring(0, firstDotIndex + 1) + 
                      cleanValue.substring(firstDotIndex + 1).replace(/\./g, '');
        }
      }

      // 빈 문자열 처리
      if (!cleanValue || cleanValue === '.') {
        return { formatted: '', numeric: 0 };
      }

      // 0으로 시작하는 숫자 (예: "010", "022") 처리
      // 이런 경우는 포맷팅 없이 그대로 반환하고 numeric 값은 0으로 설정
      if (cleanValue.startsWith('0') && cleanValue.length > 1 && !allowDecimals) {
        // 전화번호나 코드 형태로 간주하여 그대로 표시
        return { 
          formatted: cleanValue, 
          numeric: 0 
        };
      }

      const numericValue = parseFloat(cleanValue) || 0;

      // 범위 체크 (0으로 시작하지 않는 경우만)
      const clampedValue = Math.max(minValue, Math.min(maxValue, numericValue));
      
      // 포맷팅된 문자열 생성
      let formattedValue = clampedValue.toString();
      if (autoComma && !allowDecimals) {
        formattedValue = addCommas(Math.floor(clampedValue).toString());
      } else if (autoComma && allowDecimals) {
        formattedValue = addCommas(clampedValue.toString());
      }

      return { 
        formatted: formattedValue, 
        numeric: clampedValue 
      };
    };

    // 초기값 설정
    useEffect(() => {
      if (value !== undefined && value !== '') {
        const numValue = typeof value === 'string' ? parseFloat(removeCommas(value)) || 0 : value;
        const { formatted } = formatInput(numValue.toString());
        setDisplayValue(formatted);
      } else {
        setDisplayValue('0');
      }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const { formatted, numeric } = formatInput(inputValue);
      
      setDisplayValue(formatted);
      
      if (onChange) {
        onChange(numeric);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      
      // 전체 선택하여 바로 입력 가능하게 함
      setTimeout(() => {
        e.target.select();
      }, 0);
      
      if (props.onFocus) {
        props.onFocus(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      // 빈 값 처리
      if (!displayValue || displayValue === '') {
        setDisplayValue('0');
        if (onChange) onChange(0);
      }
      
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    // 단위 변환 표시 (예: 억원)
    const getConvertedUnit = (): string => {
      if (!displayUnit || !displayValue) return '';
      const numValue = parseFloat(removeCommas(displayValue)) || 0;
      const converted = numValue / unitDivider;
      return `${converted.toFixed(1)}${displayUnit}`;
    };

    return (
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none z-10">
            {prefix}
          </span>
        )}
        
        <Input
          ref={ref || inputRef}
          type="text"
          inputMode={allowDecimals ? "decimal" : "numeric"}
          pattern="[0-9]*"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "transition-all duration-200 text-right font-mono",
            prefix && "pl-8",
            suffix && "pr-16",
            mobileOptimized && [
              "text-base", // iOS 줌 방지를 위한 최소 16px
              "min-h-[48px]", // 터치 친화적 최소 높이
              "touch-manipulation", // 터치 최적화
              "border-2",
              isFocused && "ring-2 ring-blue-500 ring-opacity-20 border-blue-500"
            ],
            className
          )}
          style={mobileOptimized ? {
            fontSize: '16px', // iOS 줌 방지
            minHeight: '48px', // 터치 영역 확대
            padding: '12px 16px',
            WebkitAppearance: 'none',
            appearance: 'none'
          } : undefined}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          {...props}
        />
        
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            {suffix}
          </span>
        )}
        
        {/* 단위 변환 표시 */}
        {displayUnit && displayValue && (
          <div className="mt-1 text-xs text-gray-600 text-right">
            💰 {getConvertedUnit()}
          </div>
        )}
        
        {/* 모바일 입력 도움말 */}
        {isFocused && mobileOptimized && (
          <div className="absolute -bottom-6 left-0 right-0 text-center z-10">
            <div className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full animate-fade-in">
              💡 {autoComma ? '천단위 쉼표 자동추가' : '숫자만 입력하세요'}
            </div>
          </div>
        )}
      </div>
    );
  }
);

MobileNumberInput.displayName = 'MobileNumberInput';

export default MobileNumberInput; 