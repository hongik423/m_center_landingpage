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
    setLocalValue(inputValue);

    // 빈 문자열이면 0으로 설정
    if (inputValue === '') {
      onChange(0);
      return;
    }

    // 숫자로 변환 가능한 경우에만 업데이트
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      // min/max 범위 체크
      let finalValue = numValue;
      if (min !== undefined && numValue < min) finalValue = min;
      if (max !== undefined && numValue > max) finalValue = max;
      
      onChange(finalValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 포커스 해제 시 유효한 숫자가 아니면 0으로 설정
    const numValue = parseFloat(localValue);
    if (isNaN(numValue) || localValue === '') {
      setLocalValue('0');
      onChange(0);
    } else {
      // 범위 체크 후 정규화
      let finalValue = numValue;
      if (min !== undefined && numValue < min) finalValue = min;
      if (max !== undefined && numValue > max) finalValue = max;
      
      setLocalValue(finalValue.toString());
      onChange(finalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 음수 허용하지 않는 경우 '-' 키 차단
    if (min !== undefined && min >= 0 && e.key === '-') {
      e.preventDefault();
    }

    // 숫자, 백스페이스, 삭제, 탭, 화살표, 소수점만 허용
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isNumber = /^[0-9]$/.test(e.key);
    const isDecimal = e.key === '.';
    const isMinus = e.key === '-';

    if (!allowedKeys.includes(e.key) && !isNumber && !isDecimal && !isMinus) {
      e.preventDefault();
    }

    // 소수점이 이미 있으면 추가 소수점 차단
    if (isDecimal && localValue.includes('.')) {
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
      return parseFloat(val).toLocaleString('ko-KR');
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