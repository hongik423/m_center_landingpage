'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';

interface NumberInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  suffix?: string;
  prefix?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  
  // 🔧 기존 세금계산기 호환성을 위한 추가 props
  limit?: number;                    // max와 동일한 기능
  unit?: string;                     // suffix와 동일한 기능  
  info?: string;                     // helpText와 동일한 기능
  helpMessage?: string;              // helpText와 동일한 기능
  dependentValue?: number;           // 동적 계산을 위한 값
  dynamicInfo?: (value: number, dependentValue?: number) => string;  // 동적 정보 생성
  requiredMessage?: string;          // 커스텀 필수 메시지
}

// 🔧 개선된 유틸리티 함수들
const formatNumberDisplay = (num: number): string => {
  if (num === 0) return '';
  return new Intl.NumberFormat('ko-KR').format(Math.round(num));
};

const parseNumberInput = (input: string): number => {
  if (!input) return 0;
  // 숫자와 쉼표만 허용, 다른 문자 제거
  const cleaned = input.replace(/[^\d,]/g, '').replace(/,/g, '');
  const num = parseInt(cleaned) || 0;
  return num;
};

const isValidNumberInput = (input: string): boolean => {
  // 빈 문자열은 유효
  if (!input) return true;
  // 숫자와 쉼표만 허용
  return /^[\d,]*$/.test(input);
};

export function NumberInput({
  label,
  value,
  onChange,
  placeholder = "숫자를 입력하세요",
  min = 0,
  max,
  step = 1,
  disabled = false,
  className = "",
  suffix,
  prefix,
  required = false,
  error,
  helpText,
  
  // 🔧 기존 호환성 props
  limit,
  unit,
  info,
  helpMessage,
  dependentValue,
  dynamicInfo,
  requiredMessage
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [dynamicMessage, setDynamicMessage] = useState('');
  const [hasWarning, setHasWarning] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasRecentChange, setHasRecentChange] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 🔧 props 통합 (기존 호환성)
  const finalMax = max ?? limit;
  const finalSuffix = suffix ?? unit;
  const finalHelpText = helpText ?? helpMessage ?? info;
  const finalError = error;
  
  // 🔴 필수 필드 상태 계산
  const isCompleted = value > 0 && !hasWarning && !finalError;
  const hasError = !!finalError;
  const isRequiredAndEmpty = required && value === 0;

  // 🔧 외부 value 변경 시에만 displayValue 업데이트 (포커스 중이 아닐 때만)
  useEffect(() => {
    if (!isFocused && !isComposing) {
      setDisplayValue(formatNumberDisplay(value));
    }
  }, [value, isFocused, isComposing]);

  // 🔧 컴포넌트 마운트 시 초기값 설정
  useEffect(() => {
    setDisplayValue(formatNumberDisplay(value));
  }, []);

  // 🔧 동적 정보 업데이트
  useEffect(() => {
    if (dynamicInfo) {
      setDynamicMessage(dynamicInfo(value, dependentValue));
    }
  }, [dynamicInfo, value, dependentValue]);

  // 🔥 최근 변경 표시 효과
  useEffect(() => {
    if (value > 0) {
      setHasRecentChange(true);
      const timer = setTimeout(() => setHasRecentChange(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 🔥 IME 입력 중에는 처리하지 않음
    if (isComposing) {
      setDisplayValue(inputValue);
      return;
    }

    // 🔥 유효하지 않은 문자 입력 시 무시
    if (!isValidNumberInput(inputValue)) {
      return;
    }

    // 🔥 displayValue는 즉시 업데이트 (사용자 입력 피드백)
    setDisplayValue(inputValue);
    
    // 🔥 숫자 값 파싱 및 범위 체크
    const numericValue = parseNumberInput(inputValue);
    
    // 범위 체크 및 경고 설정
    let finalValue = numericValue;
    let warning = false;
    
    if (min !== undefined && numericValue < min && numericValue !== 0) {
      finalValue = min;
      warning = true;
    }
    if (finalMax !== undefined && numericValue > finalMax) {
      finalValue = finalMax;
      warning = true;
      // 최대값 초과 시 즉시 표시값도 수정
      setDisplayValue(formatNumberDisplay(finalValue));
    }
    
    setHasWarning(warning);
    
    // 🔥 onChange는 디바운싱 없이 즉시 호출
    onChange(finalValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    
    // 포커스 시 쉼표 제거하여 편집하기 쉽게 만들기
    const rawNumber = parseNumberInput(displayValue);
    if (rawNumber > 0) {
      setDisplayValue(rawNumber.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // 🔥 블러 시 포맷팅 적용 및 범위 재검증
    const numericValue = parseNumberInput(displayValue);
    
    // 범위 체크 후 최종 값 결정
    let finalValue = numericValue;
    let warning = false;
    
    if (min !== undefined && numericValue < min && numericValue !== 0) {
      finalValue = min;
      warning = true;
    }
    if (finalMax !== undefined && numericValue > finalMax) {
      finalValue = finalMax;
      warning = true;
    }
    
    setHasWarning(warning);
    
    // 포맷팅된 값으로 표시
    setDisplayValue(formatNumberDisplay(finalValue));
    
    // 값이 변경되었으면 onChange 호출
    if (finalValue !== numericValue) {
      onChange(finalValue);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleMouseDown = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    // 컴포지션 종료 후 즉시 처리
    handleInputChange(e as any);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 🔥 Ctrl/Cmd 조합키는 모두 허용
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // 🔥 음수 입력 방지 (min이 0 이상인 경우)
    if (min !== undefined && min >= 0 && e.key === '-') {
      e.preventDefault();
      return;
    }

    // 🔥 허용되는 키 목록
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'PageUp', 'PageDown'
    ];
    
    const isNumber = /^[0-9]$/.test(e.key);

    // 허용되지 않는 키 차단
    if (!allowedKeys.includes(e.key) && !isNumber) {
      e.preventDefault();
      return;
    }

    // Enter 키 처리
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // 붙여넣기된 텍스트에서 숫자만 추출
    const numbersOnly = pastedText.replace(/[^\d]/g, '');
    if (numbersOnly) {
      const numericValue = parseInt(numbersOnly) || 0;
      
      // 범위 체크
      let finalValue = numericValue;
      if (min !== undefined && numericValue < min) finalValue = min;
      if (finalMax !== undefined && numericValue > finalMax) finalValue = finalMax;
      
      setDisplayValue(finalValue.toString());
      onChange(finalValue);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 🔴 개선된 라벨 */}
      {label && (
        <div className="flex items-center gap-2">
          <Label 
            htmlFor={label.replace(/\s/g, '')} 
            className={`
              text-sm font-medium flex items-center gap-2 transition-colors duration-200
              ${required && !isCompleted ? 'text-red-700 font-semibold' : 
                required && isCompleted ? 'text-green-700 font-semibold' : 
                'text-gray-700'}
              ${isFocused ? 'text-blue-700' : ''}
            `}
          >
            <span>{label}</span>
            
            {required && (
              <div className="flex items-center gap-1">
                <span className="text-red-500 text-lg font-bold">*</span>
                <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300 px-1 py-0">
                  필수
                </Badge>
              </div>
            )}
            
            {required && isCompleted && (
              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                ✅ 완료
              </Badge>
            )}
            
            {hasError && (
              <Badge variant="destructive" className="text-xs">
                ⚠️ 오류
              </Badge>
            )}
          </Label>
          
          {/* 🔧 한도 표시 (기존 호환성) */}
          {finalMax && (
            <Badge variant="outline" className="text-xs">
              한도: {formatNumberDisplay(finalMax)}{finalSuffix || '원'}
            </Badge>
          )}
          
          {/* 🔧 도움말 표시 */}
          {finalHelpText && (
            <Badge variant="secondary" className="text-xs">
              💡 도움말
            </Badge>
          )}
        </div>
      )}
      
      {/* 🔴 개선된 입력 필드 */}
      <div className="relative group">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm z-10">
            {prefix}
          </span>
        )}
        
        <Input
          ref={inputRef}
          id={label?.replace(/\s/g, '')}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          placeholder={required ? `${placeholder} (필수)` : placeholder}
          disabled={disabled}
          autoComplete="off"
          title={label}
          aria-label={label}
          aria-required={required}
          aria-invalid={hasError}
          className={`
            ${hasError ? 'border-red-500 bg-red-50 focus:border-red-500' :
              hasWarning ? 'border-orange-500 bg-orange-50 focus:border-orange-500' :
              isRequiredAndEmpty ? 'border-red-400 border-2 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' :
              required && isCompleted ? 'border-green-500 bg-green-50 focus:border-green-500' :
              isCompleted ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}
            ${prefix ? 'pl-8' : ''}
            ${finalSuffix ? 'pr-12' : ''}
            text-right font-mono transition-all duration-200
            
            ${isHovered && !disabled ? 'shadow-md scale-[1.01]' : ''}
            ${isFocused ? 'ring-2 ring-blue-200 shadow-lg scale-[1.01]' : ''}
            ${isClicked ? 'scale-[0.99]' : ''}
            ${hasRecentChange ? 'animate-pulse border-green-400' : ''}
            
            transform hover:scale-[1.01] focus:scale-[1.01] active:scale-[0.99]
            hover:shadow-md focus:shadow-lg
          `}
        />
        
        {finalSuffix && (
          <span className={`
            absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm z-10
            transition-colors duration-200
            ${isFocused ? 'text-blue-600' : ''}
          `}>
            {finalSuffix}
          </span>
        )}
        
        {required && !isCompleted && (
          <div className="absolute -right-2 -top-2">
            <span className={`
              inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full
              transition-transform duration-200
              ${isHovered ? 'scale-110' : ''}
            `}>
              !
            </span>
          </div>
        )}
        
        {required && isCompleted && (
          <div className="absolute -right-2 -top-2">
            <span className={`
              inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-green-500 rounded-full
              transition-transform duration-200
              ${isHovered ? 'scale-110' : ''}
              ${hasRecentChange ? 'animate-bounce' : ''}
            `}>
              ✓
            </span>
          </div>
        )}
      </div>

      {/* 🔧 한도 초과 경고 (기존 호환성) */}
      {hasWarning && finalMax && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
          <p className="text-sm text-orange-600">
            ⚠️ 한도 초과로 {formatNumberDisplay(finalMax)}{finalSuffix || '원'}로 자동 조정되었습니다.
          </p>
        </div>
      )}

      {/* 🔴 오류 메시지 */}
      {finalError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">⚠️</span>
            <span>{finalError}</span>
            {required && finalError.includes('필수') && (
              <Badge variant="destructive" className="text-xs ml-2">
                REQUIRED
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* 🔴 필수 필드 오류 메시지 */}
      {required && isRequiredAndEmpty && !finalError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">⚠️</span>
            <span>{requiredMessage || `${label}은(는) 필수 입력 항목입니다.`}</span>
            <Badge variant="destructive" className="text-xs ml-2">
              REQUIRED
            </Badge>
          </div>
        </div>
      )}

      {/* 🔴 필수 필드 완료 안내 */}
      {required && isCompleted && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
          ✅ 필수 입력이 완료되었습니다: {formatNumberDisplay(value)}{finalSuffix || '원'}
        </div>
      )}

      {/* 🔧 동적 메시지 (기존 호환성) */}
      {dynamicMessage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <p className="text-sm text-blue-700">
            💡 {dynamicMessage}
          </p>
        </div>
      )}

      {/* 도움말 */}
      {finalHelpText && !dynamicMessage && !finalError && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          💡 {finalHelpText}
        </div>
      )}

      {/* 포커스 시 사용법 안내 */}
      {isFocused && !finalError && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
          💡 숫자만 입력하세요. 천단위 쉼표는 포커스 해제 시 자동으로 표시됩니다.
          {min !== undefined && ` (최소: ${min.toLocaleString()})`}
          {finalMax !== undefined && ` (최대: ${finalMax.toLocaleString()})`}
        </div>
      )}
    </div>
  );
}

export default NumberInput; 