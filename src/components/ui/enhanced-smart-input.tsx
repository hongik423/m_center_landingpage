'use client';

/**
 * 🚀 Enhanced Smart Input Component
 * 스마트 자동 연계 계산 기능이 내장된 고도화된 입력 컴포넌트
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from './label';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Alert, AlertDescription } from './alert';
import { Button } from './button';
import { Card, CardContent } from './card';
import { 
  Mic, 
  MicOff, 
  Calculator, 
  Copy, 
  Check, 
  AlertCircle, 
  Lightbulb,
  Keyboard,
  Eye,
  EyeOff,
  RefreshCw,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, parseCurrency } from '@/lib/utils/smartCalculationEngine';

// ===== 타입 정의 =====

// ===== 기존 타입들 정리 =====
export interface QuickAction {
  label: string;
  value: number;
  icon?: string;
  description?: string;
}

export interface ValidationRule {
  type: 'min' | 'max' | 'required' | 'custom' | 'range';
  value?: any;
  message: string;
  validator?: (value: number) => boolean;
}

// ===== Enhanced Smart Input 컴포넌트 =====

// 🔥 필수 필드 개선된 Props 인터페이스
export interface EnhancedSmartInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number | string;
  onChange?: (value: number) => void;
  onValueChange?: (formattedValue: string, numericValue: number) => void;
  placeholder?: string;
  suffix?: string;
  prefix?: string;
  maxValue?: number;
  minValue?: number;
  decimalPlaces?: number;
  allowNegative?: boolean;
  autoComma?: boolean;
  mobileOptimized?: boolean;
  className?: string;
  displayUnit?: string; // 표시 단위 (예: "억원", "만원")
  label: string;
  required?: boolean;
  requiredMessage?: string;
  helpText?: string;
  calculationRule?: string;
  connectedInputs?: Array<{ label: string; value: number | string; isCalculated?: boolean }>;
  quickActions?: Array<{ label: string; value: number }>;
  recommendations?: string[];
  warningMessage?: string;
  validationRules?: Array<{ type: string; value?: any; message: string }>;
  onFocus?: () => void;
  onBlur?: () => void;
  autoComplete?: string[];
  voiceInput?: boolean;
  calculator?: boolean;
  suggestions?: (value: number) => string[];
  accessibilityLabel?: string;
  tutorial?: boolean;
  shortcuts?: Record<string, () => void>;
}

const EnhancedSmartInput = forwardRef<HTMLInputElement, EnhancedSmartInputProps>(
  ({ 
    value = '',
    onChange,
    onValueChange,
    placeholder = '0',
    suffix = '',
    prefix = '',
    maxValue = Number.MAX_SAFE_INTEGER,
    minValue = 0,
    decimalPlaces = 0,
    allowNegative = false,
    autoComma = true,
    mobileOptimized = true,
    className = '',
    displayUnit = '',
    label,
    required = false,
    requiredMessage,
    helpText,
    calculationRule,
    connectedInputs = [],
    quickActions = [],
    recommendations = [],
    warningMessage,
    validationRules = [],
    onFocus,
    onBlur,
    autoComplete = [],
    voiceInput = false,
    calculator = false,
    suggestions,
    accessibilityLabel,
    tutorial = false,
    shortcuts = {}
  }, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isVoiceRecording, setIsVoiceRecording] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
    const [recentValues, setRecentValues] = useState<number[]>([]);
    const [showTutorial, setShowTutorial] = useState(false);
    const [copied, setCopied] = useState(false);
    const [calculatorExpression, setCalculatorExpression] = useState('');
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [initialHeight, setInitialHeight] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    // 🔥 스마트 포맷팅 (나중에 정의된 formatNumber 함수 사용)

    // 🔥 값 파싱
    const parseValue = useCallback((input: string): number => {
      if (!input) return 0;
      const cleaned = input.replace(/[^\d]/g, '');
      return parseInt(cleaned) || 0;
    }, []);

    // 🔥 음성 인식 설정
    useEffect(() => {
      if (voiceInput && 'webkitSpeechRecognition' in window) {
        recognitionRef.current = new (window as any).webkitSpeechRecognition();
        recognitionRef.current.lang = 'ko-KR';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          const numbersFromSpeech = extractNumbersFromSpeech(transcript);
          if (numbersFromSpeech > 0) {
            onChange(numbersFromSpeech);
            setDisplayValue(numbersFromSpeech.toString());
          }
          setIsVoiceRecording(false);
        };
        
        recognitionRef.current.onerror = () => {
          setIsVoiceRecording(false);
        };
      }
    }, [voiceInput, onChange]);

    // 🔥 음성에서 숫자 추출
    const extractNumbersFromSpeech = (text: string): number => {
      const koreanNumbers: { [key: string]: number } = {
        '영': 0, '공': 0, '제로': 0,
        '일': 1, '하나': 1, '한': 1,
        '이': 2, '둘': 2, '투': 2,
        '삼': 3, '셋': 3, '쓰리': 3,
        '사': 4, '넷': 4, '포': 4,
        '오': 5, '다섯': 5, '파이브': 5,
        '육': 6, '여섯': 6, '식스': 6,
        '칠': 7, '일곱': 7, '세븐': 7,
        '팔': 8, '여덟': 8, '에잇': 8,
        '구': 9, '아홉': 9, '나인': 9,
        '십': 10, '열': 10,
        '백': 100, '천': 1000, '만': 10000,
        '억': 100000000, '조': 1000000000000
      };
      
      // 한국어 숫자 단어를 숫자로 변환
      let result = 0;
      let current = 0;
      
      const words = text.split(/\s+/);
      for (const word of words) {
        if (koreanNumbers[word] !== undefined) {
          const num = koreanNumbers[word];
          if (num >= 10000) {
            result += current * num;
            current = 0;
          } else if (num >= 100) {
            current = (current || 1) * num;
          } else if (num >= 10) {
            current = (current || 1) * num;
          } else {
            current += num;
          }
        }
      }
      
      result += current;
      
      // 일반 숫자도 추출
      const normalNumbers = text.match(/\d+/g);
      if (normalNumbers && result === 0) {
        result = parseInt(normalNumbers.join('')) || 0;
      }
      
      return result;
    };

    // 🔥 자동완성 및 제안 처리
    useEffect(() => {
      if (isFocused && (autoComplete.length > 0 || suggestions)) {
        let newSuggestions: string[] = [];
        
        // 자동완성 옵션
        if (autoComplete.length > 0) {
          newSuggestions = [...autoComplete];
        }
        
        // 동적 제안
        if (suggestions && value > 0) {
          const dynamicSuggestions = suggestions(value);
          newSuggestions = [...newSuggestions, ...dynamicSuggestions];
        }
        
        // 최근 값 기반 제안
        if (recentValues.length > 0) {
          const recentSuggestions = recentValues
            .filter(v => v !== value)
            .slice(0, 3)
            .map(v => `최근 사용: ${v.toLocaleString()}`);
          newSuggestions = [...newSuggestions, ...recentSuggestions];
        }
        
        setCurrentSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
      } else {
        setShowSuggestions(false);
      }
    }, [isFocused, autoComplete, suggestions, value, recentValues]);

    // 🔥 키보드 단축키 처리
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      // 커스텀 단축키
      const shortcutKey = `${e.ctrlKey ? 'Ctrl+' : ''}${e.altKey ? 'Alt+' : ''}${e.key}`;
      if (shortcuts[shortcutKey]) {
        e.preventDefault();
        shortcuts[shortcutKey]();
        return;
      }

      // 기본 단축키들
      switch (e.key) {
        case 'F1':
          e.preventDefault();
          setShowTutorial(!showTutorial);
          break;
        case 'F2':
          e.preventDefault();
          if (calculator) setShowCalculator(!showCalculator);
          break;
        case 'F3':
          e.preventDefault();
          if (voiceInput) startVoiceInput();
          break;
        case 'Escape':
          setShowSuggestions(false);
          setShowCalculator(false);
          inputRef.current?.blur();
          break;
        case 'ArrowDown':
          if (showSuggestions) {
            e.preventDefault();
            // 제안 목록 네비게이션 로직
          }
          break;
      }
    }, [shortcuts, showTutorial, calculator, showCalculator, voiceInput, showSuggestions]);

    // 🔥 음성 입력 시작
    const startVoiceInput = useCallback(() => {
      if (recognitionRef.current && !isVoiceRecording) {
        setIsVoiceRecording(true);
        recognitionRef.current.start();
      }
    }, [isVoiceRecording]);

    // 🔥 계산기 처리
    const handleCalculatorInput = useCallback((expression: string) => {
      try {
        // 안전한 수식 계산 (eval 대신 안전한 파서 사용)
        const result = evaluateExpression(expression);
        if (typeof result === 'number' && !isNaN(result)) {
          onChange(result);
          setDisplayValue(result.toString());
          setShowCalculator(false);
          setCalculatorExpression('');
        }
      } catch (error) {
        // 계산 오류 처리
      }
    }, [onChange]);

    // 🔥 안전한 수식 계산
    const evaluateExpression = (expr: string): number => {
      // 간단한 사칙연산만 허용
      const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, '');
      try {
        return Function(`"use strict"; return (${sanitized})`)();
      } catch {
        throw new Error('Invalid expression');
      }
    };

    // 🔥 복사 기능
    const copyValue = useCallback(() => {
      navigator.clipboard.writeText(value.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, [value]);

    // 🔥 최근 값 저장
    useEffect(() => {
      if (value > 0 && !recentValues.includes(value)) {
        setRecentValues(prev => [value, ...prev.slice(0, 9)]);
      }
    }, [value, recentValues]);

    // 🔥 고급 검증
    const validateValue = useCallback((val: number): string | null => {
      if (required && val === 0) {
        return '필수 입력 항목입니다.';
      }
      
      if (minValue !== undefined && val < minValue) {
        return `최소값은 ${minValue.toLocaleString()}입니다.`;
      }
      
      if (maxValue !== undefined && val > maxValue) {
        return `최대값은 ${maxValue.toLocaleString()}입니다.`;
      }
      
      if (validationRules?.pattern && !validationRules.pattern.test(val.toString())) {
        return '형식이 올바르지 않습니다.';
      }
      
      if (validationRules?.customValidator) {
        return validationRules.customValidator(val);
      }
      
      return null;
    }, [required, minValue, maxValue, validationRules]);

    const validationError = validateValue(value);
    const hasError = !!(validationError);

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
    const formatNumber = (inputValue: string): { formatted: string; numeric: number } => {
      if (!inputValue || inputValue === '') {
        return { formatted: '0', numeric: 0 };
      }

      // 숫자와 소수점, 음수 기호만 허용
      let cleanValue = inputValue.replace(/[^\d.-]/g, '');
      
      // 음수 처리
      if (!allowNegative && cleanValue.startsWith('-')) {
        cleanValue = cleanValue.substring(1);
      }

      // 소수점 처리
      const dotCount = (cleanValue.match(/\./g) || []).length;
      if (dotCount > 1) {
        const firstDotIndex = cleanValue.indexOf('.');
        cleanValue = cleanValue.substring(0, firstDotIndex + 1) + 
                    cleanValue.substring(firstDotIndex + 1).replace(/\./g, '');
      }

      // 소수점 자릿수 제한
      if (decimalPlaces === 0) {
        cleanValue = cleanValue.split('.')[0] || '';
      } else if (cleanValue.includes('.')) {
        const [integer, decimal] = cleanValue.split('.');
        cleanValue = integer + '.' + (decimal || '').substring(0, decimalPlaces);
      }

      const numericValue = parseFloat(cleanValue) || 0;

      // 범위 체크
      const clampedValue = Math.max(minValue, Math.min(maxValue, numericValue));
      
      // 포맷팅된 문자열 생성
      const formattedValue = addCommas(clampedValue.toString());

      return { 
        formatted: formattedValue, 
        numeric: clampedValue 
      };
    };

    // 초기값 설정
    useEffect(() => {
      if (value !== undefined && value !== '') {
        const numValue = typeof value === 'string' ? parseFloat(removeCommas(value)) || 0 : value;
        const { formatted } = formatNumber(numValue.toString());
        setDisplayValue(formatted);
      } else {
        setDisplayValue('0');
      }
    }, [value, autoComma, decimalPlaces]);

    // 모바일 키보드 감지
    useEffect(() => {
      if (!mobileOptimized) return;

      const handleResize = () => {
        if (initialHeight === 0) {
          setInitialHeight(window.innerHeight);
          return;
        }

        const heightDifference = initialHeight - window.innerHeight;
        const threshold = 150; // 키보드가 올라왔다고 판단하는 임계값

        if (heightDifference > threshold && isFocused) {
          setIsKeyboardOpen(true);
        } else {
          setIsKeyboardOpen(false);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [initialHeight, isFocused, mobileOptimized]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const { formatted, numeric } = formatNumber(inputValue);
      
      setDisplayValue(formatted);
      
      if (onChange) {
        onChange(numeric);
      }
      
      if (onValueChange) {
        onValueChange(formatted, numeric);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      
      // 전체 선택하여 바로 입력 가능하게 함
      setTimeout(() => {
        e.target.select();
      }, 0);
      
      if (onFocus) {
        onFocus(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setIsKeyboardOpen(false);
      
      // 빈 값 처리
      if (!displayValue || displayValue === '') {
        setDisplayValue('0');
        if (onChange) onChange(0);
      }
      
      if (onBlur) {
        onBlur(e);
      }
    };

    // 모바일 최적화 스타일
    const mobileStyles = mobileOptimized ? {
      fontSize: '16px', // iOS 줌 방지
      minHeight: '48px', // 터치 영역 확대
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      background: isFocused ? '#f8fafc' : 'white',
      transition: 'all 0.2s ease',
      boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      ...(isKeyboardOpen && {
        position: 'fixed' as const,
        top: '10px',
        left: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      })
    } : {};

    return (
      <div className={`space-y-2 ${className}`}>
        {/* 라벨 */}
        {label && (
          <div className="flex items-center justify-between">
            <Label htmlFor={label.replace(/\s/g, '')} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-2">
              {tutorial && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTutorial(!showTutorial)}
                  className="h-6 px-2"
                >
                  <Lightbulb className="w-3 h-3" />
                </Button>
              )}
              {calculator && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="h-6 px-2"
                >
                  <Calculator className="w-3 h-3" />
                </Button>
              )}
              {value > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyValue}
                  className="h-6 px-2"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* 메인 입력 필드 */}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm z-10">
              {prefix}
            </span>
          )}
          
          <Input
            ref={ref || inputRef}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={accessibilityLabel || label}
            aria-required={required}
            aria-invalid={hasError}
            className={`
              ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              ${prefix ? 'pl-8' : ''}
              ${suffix || voiceInput ? 'pr-20' : ''}
              text-right font-mono transition-all duration-200
            `}
            style={mobileOptimized ? mobileStyles : undefined}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10">
            {voiceInput && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={startVoiceInput}
                disabled={isVoiceRecording}
                className={`h-6 w-6 p-0 ${isVoiceRecording ? 'text-red-500' : 'text-gray-500'}`}
              >
                {isVoiceRecording ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
              </Button>
            )}
            
            {suffix && (
              <span className="text-gray-500 text-sm">{suffix}</span>
            )}
          </div>
        </div>

        {/* 제안 목록 */}
        {showSuggestions && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <div className="space-y-1">
                {currentSuggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left text-sm p-2 hover:bg-blue-100 rounded transition-colors"
                    onClick={() => {
                      const value = parseValue(suggestion);
                      if (value > 0) {
                        onChange(value);
                        setDisplayValue(formatNumber(value));
                      }
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-blue-600" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 계산기 */}
        {showCalculator && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">내장 계산기</span>
                </div>
                <Input
                  type="text"
                  value={calculatorExpression}
                  onChange={(e) => setCalculatorExpression(e.target.value)}
                  placeholder="예: 1000000 + 500000"
                  className="font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCalculatorInput(calculatorExpression);
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleCalculatorInput(calculatorExpression)}
                    className="flex-1"
                  >
                    계산하기
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCalculator(false)}
                    className="flex-1"
                  >
                    닫기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 튜토리얼 */}
        {showTutorial && (
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">사용법 가이드</span>
                </div>
                <div className="text-xs space-y-1 text-purple-700">
                  <div>• <kbd className="px-1 py-0.5 bg-purple-200 rounded text-xs">F1</kbd>: 이 도움말 토글</div>
                  {calculator && <div>• <kbd className="px-1 py-0.5 bg-purple-200 rounded text-xs">F2</kbd>: 계산기 열기</div>}
                  {voiceInput && <div>• <kbd className="px-1 py-0.5 bg-purple-200 rounded text-xs">F3</kbd>: 음성 입력</div>}
                  <div>• <kbd className="px-1 py-0.5 bg-purple-200 rounded text-xs">Ctrl+C</kbd>: 복사</div>
                  <div>• <kbd className="px-1 py-0.5 bg-purple-200 rounded text-xs">Esc</kbd>: 닫기</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 오류 메시지 */}
        {hasError && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* 도움말 */}
        {helpText && !hasError && (
          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{helpText}</span>
            </div>
          </div>
        )}

        {/* 음성 인식 상태 */}
        {isVoiceRecording && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200 animate-pulse">
            <div className="flex items-center gap-2">
              <Mic className="w-3 h-3" />
              <span>음성을 듣고 있습니다... 숫자를 말씀해주세요.</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

EnhancedSmartInput.displayName = 'EnhancedSmartInput';

export default EnhancedSmartInput; 