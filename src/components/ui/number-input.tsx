'use client';

import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { formatNumberInput, parseFormattedNumber, handleNumberInputChange } from '@/lib/utils';

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
  const [localValue, setLocalValue] = useState<string>(
    value && value > 0 ? formatNumberInput(value) : ''
  );
  const [isFocused, setIsFocused] = useState(false);

  // 외부 값이 변경될 때 로컬 값 업데이트
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value && value > 0 ? formatNumberInput(value) : '');
    }
  }, [value, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 천단위 구분기호와 함께 숫자 입력 처리
    const formattedValue = handleNumberInputChange(
      inputValue,
      (num) => {
        // min/max 범위 체크
        let finalValue = num;
        if (min !== undefined && num < min) finalValue = min;
        if (max !== undefined && num > max) finalValue = max;
        
        onChange(finalValue);
      },
      { min, max, allowEmpty: true }
    );
    
    setLocalValue(formattedValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // 포커스 시 원본 숫자만 표시 (편집하기 쉽게)
    const rawNumber = parseFormattedNumber(localValue);
    if (rawNumber > 0) {
      setLocalValue(rawNumber.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 포커스 해제 시 천단위 구분기호 적용
    const rawNumber = parseFormattedNumber(localValue || '0');
    
    if (rawNumber === 0) {
      setLocalValue('');
      onChange(0);
    } else {
      // 범위 체크 후 정규화
      let finalValue = rawNumber;
      if (min !== undefined && rawNumber < min) finalValue = min;
      if (max !== undefined && rawNumber > max) finalValue = max;
      
      setLocalValue(formatNumberInput(finalValue));
      if (finalValue !== rawNumber) {
        onChange(finalValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 음수 허용하지 않는 경우 '-' 키 차단
    if (min !== undefined && min >= 0 && e.key === '-') {
      e.preventDefault();
    }

    // 숫자, 백스페이스, 삭제, 탭, 화살표만 허용 (콤마, 소수점 제외)
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isNumber = /^[0-9]$/.test(e.key);

    if (!allowedKeys.includes(e.key) && !isNumber) {
      e.preventDefault();
    }

    // 엔터 키 처리
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
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
          value={localValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          title={label}
          aria-label={label}
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
          💡 숫자만 입력하세요. 천단위 쉼표는 자동으로 표시됩니다.
          {min !== undefined && ` (최소: ${min.toLocaleString()})`}
          {max !== undefined && ` (최대: ${max.toLocaleString()})`}
        </div>
      )}
    </div>
  );
}

export default NumberInput; 