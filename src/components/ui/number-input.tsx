'use client';

import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';

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
}

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
  error
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState<string>(value?.toString() || '');
  const [isFocused, setIsFocused] = useState(false);

  // 외부 값이 변경될 때 로컬 값 업데이트
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value?.toString() || '');
    }
  }, [value, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // 숫자와 콤마만 허용하는 정규식으로 필터링
    const filteredValue = inputValue.replace(/[^0-9,]/g, '');
    setLocalValue(filteredValue);

    // 빈 문자열이면 0으로 설정
    if (filteredValue === '' || filteredValue === ',') {
      onChange(0);
      return;
    }

    // 콤마 제거 후 숫자로 변환
    const cleanValue = filteredValue.replace(/,/g, '');
    const numValue = parseFloat(cleanValue);
    
    if (!isNaN(numValue)) {
      // min/max 범위 체크 후 정수로 반올림
      let finalValue = Math.round(numValue);
      if (min !== undefined && finalValue < min) finalValue = min;
      if (max !== undefined && finalValue > max) finalValue = max;
      
      onChange(finalValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 콤마 제거 후 숫자로 변환
    const cleanValue = localValue.replace(/,/g, '');
    const numValue = parseFloat(cleanValue);
    
    if (isNaN(numValue) || cleanValue === '') {
      setLocalValue('0');
      onChange(0);
    } else {
      // 범위 체크 후 정수로 반올림
      let finalValue = Math.round(numValue);
      if (min !== undefined && finalValue < min) finalValue = min;
      if (max !== undefined && finalValue > max) finalValue = max;
      
      setLocalValue(finalValue.toString());
      onChange(finalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 음수 허용하지 않는 경우 '-' 키 차단
    if (min !== undefined && min >= 0 && e.key === '-') {
      e.preventDefault();
    }

    // 숫자, 백스페이스, 삭제, 탭, 화살표, 콤마만 허용 (소수점 제거)
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isNumber = /^[0-9]$/.test(e.key);
    const isComma = e.key === ',';

    if (!allowedKeys.includes(e.key) && !isNumber && !isComma) {
      e.preventDefault();
    }

    // 엔터 키 처리
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const formatDisplayValue = (val: string) => {
    // 천 단위 쉼표 추가 (포커스되지 않았을 때만)
    if (!isFocused && val && !isNaN(parseFloat(val))) {
      const numValue = parseFloat(val);
      // 정수로 반올림하여 소수점 제거
      return Math.round(numValue).toLocaleString('ko-KR');
    }
    return val;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {prefix}
          </span>
        )}
        
        <Input
          type="text"
          inputMode="numeric"
          value={isFocused ? localValue : formatDisplayValue(localValue)}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={`
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-12' : ''}
            text-right font-mono
          `}
        />
        
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          ⚠️ {error}
        </div>
      )}

      {isFocused && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
          💡 숫자만 입력하세요. 범위: {min}
          {max !== undefined && ` ~ ${max.toLocaleString()}`}
        </div>
      )}
    </div>
  );
}

export default NumberInput; 