'use client';

/**
 * 🚀 통합 스마트 자동 연계 계산 엔진
 * 모든 세금계산기의 입력 오류를 최소화하고 사용자 편의성을 극대화합니다.
 */

import { useMemo, useCallback, useEffect, useState } from 'react';

// ===== 타입 정의 =====

export interface CalculationRule {
  id: string;
  name: string;
  formula: string;
  dependencies: string[];
  validator?: (inputs: any) => boolean;
  priority: number; // 계산 순서 (낮을수록 먼저 계산)
}

export interface SmartField {
  id: string;
  label: string;
  value: number;
  autoCalculated: boolean;
  formula?: string;
  dependencies: string[];
  validationRules?: ValidationRule[];
  min?: number;
  max?: number;
  required?: boolean;
  helpText?: string;
  formatOptions?: {
    currency?: boolean;
    percentage?: boolean;
    decimal?: number;
  };
}

export interface ValidationRule {
  type: 'min' | 'max' | 'required' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any, allInputs: any) => boolean;
}

export interface CalculationResult {
  success: boolean;
  values: Record<string, number>;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  calculations: Record<string, string>; // 계산 과정 설명
}

// ===== 계산 규칙 정의 =====

// 주식이동세 계산 규칙
export const stockTransferRules: CalculationRule[] = [
  {
    id: 'totalStockValue',
    name: '총 주식가치',
    formula: 'stockQuantity × pricePerShare',
    dependencies: ['stockQuantity', 'pricePerShare'],
    priority: 1
  },
  {
    id: 'personalShareRatio',
    name: '본인 지분율',
    formula: '(stockQuantity ÷ totalShares) × 100',
    dependencies: ['stockQuantity', 'totalShares'],
    validator: (inputs) => inputs.totalShares > 0,
    priority: 2
  },
  {
    id: 'capitalGain',
    name: '양도차익',
    formula: 'transferPrice - acquisitionPrice - expenses',
    dependencies: ['transferPrice', 'acquisitionPrice', 'expenses'],
    priority: 3
  },
  {
    id: 'profitRate',
    name: '수익률',
    formula: '(capitalGain ÷ acquisitionPrice) × 100',
    dependencies: ['capitalGain', 'acquisitionPrice'],
    validator: (inputs) => inputs.acquisitionPrice > 0,
    priority: 4
  }
];

// 상속세 계산 규칙
export const inheritanceRules: CalculationRule[] = [
  {
    id: 'totalAssets',
    name: '총 상속재산',
    formula: 'realEstate + deposit + stock + bond + insurance + other',
    dependencies: ['realEstate', 'deposit', 'stock', 'bond', 'insurance', 'other'],
    priority: 1
  },
  {
    id: 'netInheritance',
    name: '순 상속재산',
    formula: 'totalAssets - debts - funeralExpenses',
    dependencies: ['totalAssets', 'debts', 'funeralExpenses'],
    priority: 2
  },
  {
    id: 'basicDeduction',
    name: '기초공제',
    formula: '200000000', // 기본 2억원
    dependencies: [],
    priority: 3
  },
  {
    id: 'personalDeduction',
    name: '인적공제',
    formula: 'spouse × 500000000 + children × 50000000 + parents × 50000000',
    dependencies: ['spouse', 'children', 'parents'],
    priority: 4
  }
];

// 증여세 계산 규칙
export const giftTaxRules: CalculationRule[] = [
  {
    id: 'totalGiftValue',
    name: '총 증여재산',
    formula: 'cash + realEstate + stock + bond + businessAsset + other',
    dependencies: ['cash', 'realEstate', 'stock', 'bond', 'businessAsset', 'other'],
    priority: 1
  },
  {
    id: 'deductionLimit',
    name: '증여공제한도',
    formula: 'relationship === "spouse" ? 600000000 : relationship === "child" ? 50000000 : 10000000',
    dependencies: ['relationship'],
    priority: 2
  },
  {
    id: 'taxableAmount',
    name: '과세표준',
    formula: 'Math.max(0, totalGiftValue - deductionLimit)',
    dependencies: ['totalGiftValue', 'deductionLimit'],
    priority: 3
  }
];

// 법인세 계산 규칙
export const corporateRules: CalculationRule[] = [
  {
    id: 'operatingIncome',
    name: '영업소득',
    formula: 'revenue - operatingExpenses',
    dependencies: ['revenue', 'operatingExpenses'],
    priority: 1
  },
  {
    id: 'netIncome',
    name: '순소득',
    formula: 'operatingIncome + nonOperatingIncome - nonOperatingExpenses',
    dependencies: ['operatingIncome', 'nonOperatingIncome', 'nonOperatingExpenses'],
    priority: 2
  },
  {
    id: 'taxableIncome',
    name: '과세표준',
    formula: 'Math.max(0, netIncome - carryForwardLoss)',
    dependencies: ['netIncome', 'carryForwardLoss'],
    priority: 3
  }
];

// 양도소득세 계산 규칙
export const capitalGainsRules: CalculationRule[] = [
  {
    id: 'transferGain',
    name: '양도차익',
    formula: 'transferPrice - acquisitionPrice - improvementCost - transferCost',
    dependencies: ['transferPrice', 'acquisitionPrice', 'improvementCost', 'transferCost'],
    priority: 1
  },
  {
    id: 'longTermDeduction',
    name: '장기보유특별공제',
    formula: 'holdingYears >= 3 ? transferGain × 0.1 × Math.min(holdingYears - 2, 8) : 0',
    dependencies: ['transferGain', 'holdingYears'],
    priority: 2
  },
  {
    id: 'taxableCapitalGain',
    name: '과세표준',
    formula: 'Math.max(0, transferGain - longTermDeduction - basicDeduction)',
    dependencies: ['transferGain', 'longTermDeduction', 'basicDeduction'],
    priority: 3
  }
];

// ===== 스마트 계산 엔진 =====

export class SmartCalculationEngine {
  private rules: CalculationRule[];
  private fields: Record<string, SmartField>;
  
  constructor(rules: CalculationRule[], fields: Record<string, SmartField> = {}) {
    this.rules = rules.sort((a, b) => a.priority - b.priority);
    this.fields = fields;
  }

  /**
   * 입력값을 기반으로 모든 연계 계산 실행
   */
  calculate(inputs: Record<string, any>): CalculationResult {
    const result: CalculationResult = {
      success: true,
      values: { ...inputs },
      errors: {},
      warnings: {},
      calculations: {}
    };

    try {
      // 1. 입력 검증
      this.validateInputs(inputs, result);

      // 2. 규칙 기반 계산 실행 (우선순위 순)
      for (const rule of this.rules) {
        try {
          if (this.canExecuteRule(rule, result.values)) {
            const calculatedValue = this.executeRule(rule, result.values);
            result.values[rule.id] = calculatedValue;
            result.calculations[rule.id] = `${rule.name}: ${rule.formula} = ${this.formatNumber(calculatedValue)}`;
          }
        } catch (error) {
          result.errors[rule.id] = `${rule.name} 계산 오류: ${error}`;
          result.success = false;
        }
      }

      // 3. 결과 검증 및 경고 생성
      this.generateWarnings(result);

    } catch (error) {
      result.success = false;
      result.errors['general'] = `계산 오류: ${error}`;
    }

    return result;
  }

  /**
   * 규칙 실행 가능 여부 확인
   */
  private canExecuteRule(rule: CalculationRule, values: Record<string, any>): boolean {
    // 모든 의존성 필드가 존재하고 유효한 값인지 확인
    for (const dep of rule.dependencies) {
      if (values[dep] === undefined || values[dep] === null) {
        return false;
      }
    }

    // 커스텀 검증자가 있다면 실행
    if (rule.validator && !rule.validator(values)) {
      return false;
    }

    return true;
  }

  /**
   * 계산 규칙 실행
   */
  private executeRule(rule: CalculationRule, values: Record<string, any>): number {
    try {
      // 안전한 수식 평가를 위한 컨텍스트 생성
      const context = { ...values, Math };
      
      // 기본 수식들을 함수로 변환하여 실행
      const result = this.evaluateFormula(rule.formula, context);
      
      return typeof result === 'number' ? result : 0;
    } catch (error) {
      console.error(`규칙 ${rule.id} 실행 오류:`, error);
      return 0;
    }
  }

  /**
   * 안전한 수식 평가
   */
  private evaluateFormula(formula: string, context: Record<string, any>): number {
    try {
      // 기본 산술 연산과 조건문만 허용하는 안전한 평가
      const safeFormula = formula
        .replace(/(\w+)/g, (match) => {
          if (match === 'Math' || ['min', 'max', 'abs', 'round', 'floor', 'ceil'].includes(match)) {
            return match;
          }
          return context[match] !== undefined ? context[match].toString() : '0';
        });

      return Function('"use strict"; return (' + safeFormula + ')')();
    } catch (error) {
      console.error('수식 평가 오류:', error);
      return 0;
    }
  }

  /**
   * 입력값 검증
   */
  private validateInputs(inputs: Record<string, any>, result: CalculationResult): void {
    Object.entries(this.fields).forEach(([fieldId, field]) => {
      const value = inputs[fieldId];

      // 필수 필드 검증
      if (field.required && (value === undefined || value === null || value === '')) {
        result.errors[fieldId] = `${field.label}은(는) 필수 입력 항목입니다.`;
        result.success = false;
      }

      // 숫자형 필드 검증
      if (value !== undefined && value !== null) {
        const numValue = Number(value);
        
        if (isNaN(numValue)) {
          result.errors[fieldId] = `${field.label}에는 숫자만 입력할 수 있습니다.`;
          result.success = false;
        } else {
          // 범위 검증
          if (field.min !== undefined && numValue < field.min) {
            result.errors[fieldId] = `${field.label}은(는) ${this.formatNumber(field.min)} 이상이어야 합니다.`;
            result.success = false;
          }
          
          if (field.max !== undefined && numValue > field.max) {
            result.errors[fieldId] = `${field.label}은(는) ${this.formatNumber(field.max)} 이하여야 합니다.`;
            result.success = false;
          }
        }
      }

      // 커스텀 검증 규칙
      if (field.validationRules) {
        field.validationRules.forEach(rule => {
          if (rule.type === 'custom' && rule.validator) {
            if (!rule.validator(value, inputs)) {
              result.errors[fieldId] = rule.message;
              result.success = false;
            }
          }
        });
      }
    });
  }

  /**
   * 경고 메시지 생성
   */
  private generateWarnings(result: CalculationResult): void {
    // 세금 절약 팁이나 주의사항 등의 경고 메시지 생성
    // 각 계산기별로 다른 로직 적용 가능
  }

  /**
   * 숫자 포맷팅
   */
  private formatNumber(value: number): string {
    return new Intl.NumberFormat('ko-KR').format(value);
  }
}

// ===== React Hook =====

export interface UseSmartCalculationOptions {
  calculatorType: 'stock' | 'inheritance' | 'gift' | 'corporate' | 'capital' | 'vat' | 'business';
  initialInputs?: Record<string, any>;
  autoCalculate?: boolean;
  debounceMs?: number;
}

export const useSmartCalculation = (options: UseSmartCalculationOptions) => {
  const { calculatorType, initialInputs = {}, autoCalculate = true, debounceMs = 300 } = options;
  
  const [inputs, setInputs] = useState<Record<string, any>>(initialInputs);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 계산기 타입별 규칙 선택
  const rules = useMemo(() => {
    switch (calculatorType) {
      case 'stock': return stockTransferRules;
      case 'inheritance': return inheritanceRules;
      case 'gift': return giftTaxRules;
      case 'corporate': return corporateRules;
      case 'capital': return capitalGainsRules;
      default: return [];
    }
  }, [calculatorType]);

  // 계산 엔진 인스턴스
  const engine = useMemo(() => new SmartCalculationEngine(rules), [rules]);

  // 입력값 업데이트
  const updateInput = useCallback((field: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 여러 입력값 한번에 업데이트
  const updateInputs = useCallback((newInputs: Record<string, any>) => {
    setInputs(prev => ({
      ...prev,
      ...newInputs
    }));
  }, []);

  // 계산 실행
  const calculate = useCallback(() => {
    setIsCalculating(true);
    try {
      const calculationResult = engine.calculate(inputs);
      setResult(calculationResult);
    } catch (error) {
      console.error('계산 오류:', error);
      setResult({
        success: false,
        values: inputs,
        errors: { general: '계산 중 오류가 발생했습니다.' },
        warnings: {},
        calculations: {}
      });
    } finally {
      setIsCalculating(false);
    }
  }, [engine, inputs]);

  // 자동 계산 (디바운스 적용)
  useEffect(() => {
    if (!autoCalculate) return;

    const timer = setTimeout(() => {
      calculate();
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputs, calculate, autoCalculate, debounceMs]);

  // 계산된 값 가져오기
  const getCalculatedValue = useCallback((field: string): number => {
    return result?.values[field] ?? inputs[field] ?? 0;
  }, [result, inputs]);

  // 필드가 자동 계산되었는지 확인
  const isAutoCalculated = useCallback((field: string): boolean => {
    return rules.some(rule => rule.id === field) && result?.values[field] !== undefined;
  }, [rules, result]);

  // 계산 설명 가져오기
  const getCalculationDescription = useCallback((field: string): string => {
    return result?.calculations[field] ?? '';
  }, [result]);

  return {
    inputs,
    result,
    isCalculating,
    updateInput,
    updateInputs,
    calculate,
    getCalculatedValue,
    isAutoCalculated,
    getCalculationDescription,
    
    // 유틸리티 함수들
    hasErrors: result ? Object.keys(result.errors).length > 0 : false,
    hasWarnings: result ? Object.keys(result.warnings).length > 0 : false,
    errors: result?.errors ?? {},
    warnings: result?.warnings ?? {},
  };
};

// ===== 유틸리티 함수들 =====

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(value);
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('ko-KR').format(value);
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
};

// 기본 내보내기
export default SmartCalculationEngine; 