'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

// 전화번호 포맷팅 함수
const formatPhoneNumber = (input: string): string => {
  // 숫자만 추출
  const numbers = input.replace(/\D/g, '');
  
  // 11자리가 넘으면 자르기
  const limitedNumbers = numbers.slice(0, 11);
  
  // 포맷팅 적용
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
  }
};

// 전화번호에서 숫자만 추출
const extractNumbers = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, '');
};

// 전화번호 유효성 검사
const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const numbers = extractNumbers(phoneNumber);
  return numbers.length === 11 && numbers.startsWith('010');
};

export function PhoneInput({
  label,
  value,
  onChange,
  placeholder = "010-0000-0000",
  disabled = false,
  className = "",
  required = false,
  error,
  helpText
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 외부 value 변경 시 displayValue 업데이트
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatPhoneNumber(value));
    }
  }, [value, isFocused]);

  // 컴포넌트 마운트 시 초기값 설정
  useEffect(() => {
    setDisplayValue(formatPhoneNumber(value));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 포맷팅 적용
    const formattedValue = formatPhoneNumber(inputValue);
    setDisplayValue(formattedValue);
    
    // 상위 컴포넌트에 전달 (숫자만 전달하거나 포맷된 값 전달)
    onChange(formattedValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 블러 시 최종 포맷팅 적용
    const finalFormatted = formatPhoneNumber(displayValue);
    setDisplayValue(finalFormatted);
    onChange(finalFormatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl/Cmd 조합키 허용
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // 허용 키들
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'PageUp', 'PageDown'
    ];
    
    // 숫자 키만 허용
    const isNumber = /^[0-9]$/.test(e.key);
    
    // 허용되지 않는 키 차단
    if (!allowedKeys.includes(e.key) && !isNumber) {
      e.preventDefault();
    }
    
    // 엔터 키 처리
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formattedValue = formatPhoneNumber(pastedText);
    setDisplayValue(formattedValue);
    onChange(formattedValue);
  };

  // 전화번호 유효성 상태
  const isValid = !value || isValidPhoneNumber(value);
  const isCompleted = isValidPhoneNumber(value);
  const isRequiredAndEmpty = required && !value;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label 
          htmlFor={label?.replace(/\s/g, '')}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <Phone className="w-4 h-4 text-green-500" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          id={label?.replace(/\s/g, '')}
          type="text"
          inputMode="tel"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={required ? `${placeholder} (필수)` : placeholder}
          disabled={disabled}
          autoComplete="tel"
          title={label}
          aria-label={label}
          aria-required={required}
          aria-invalid={!isValid}
          className={`
            ${error || (!isValid && value) ? 'border-red-500 bg-red-50 focus:border-red-500' :
              isRequiredAndEmpty ? 'border-red-400 border-2 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' :
              required && isCompleted ? 'border-green-500 bg-green-50 focus:border-green-500' :
              isCompleted ? 'border-green-300 bg-green-50' : ''}
            text-center font-mono transition-all duration-200
          `}
        />
        
        {/* 필수 필드 시각적 표시 */}
        {isRequiredAndEmpty && (
          <div className="absolute -right-2 -top-2">
            <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
              !
            </span>
          </div>
        )}
        
        {/* 완료 표시 */}
        {required && isCompleted && (
          <div className="absolute -right-2 -top-2">
            <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-green-500 rounded-full">
              ✓
            </span>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 필수 필드 오류 메시지 */}
      {isRequiredAndEmpty && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">⚠️</span>
            <span>{`${label || '전화번호'}는 필수 입력 항목입니다.`}</span>
          </div>
        </div>
      )}

      {/* 완료 안내 */}
      {required && isCompleted && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
          ✅ 전화번호 입력이 완료되었습니다: {displayValue}
        </div>
      )}

      {/* 유효하지 않은 전화번호 경고 */}
      {value && !isValid && !error && (
        <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">⚠️</span>
            <span>올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)</span>
          </div>
        </div>
      )}

      {/* 도움말 */}
      {helpText && !error && !isRequiredAndEmpty && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          💡 {helpText}
        </div>
      )}

      {/* 포커스 시 사용법 안내 */}
      {isFocused && !error && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
          💡 숫자만 입력하세요. 하이픈(-)은 자동으로 추가됩니다.
        </div>
      )}
    </div>
  );
} 