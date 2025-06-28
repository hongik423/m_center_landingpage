'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calculator,
  FileText,
  Building,
  DollarSign,
  TrendingUp,
  Info,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  PieChart,
  Percent
} from 'lucide-react';
import { ComprehensiveIncomeTaxInput, ComprehensiveIncomeTaxResult } from '@/types/tax-calculator.types';
import { ComprehensiveIncomeTaxCalculator, ComprehensiveTaxInputValidator } from '@/lib/utils/tax-calculations';
import { formatCurrency, formatNumber, formatNumberInput, parseFormattedNumber, handleNumberInputChange } from '@/lib/utils';
import { COMPREHENSIVE_TAX_LIMITS_2024 } from '@/constants/tax-rates-2024';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';
import { BetaFeedbackForm } from '@/components/ui/beta-feedback-form';
import { PDFGenerator } from '@/lib/utils/pdfGenerator';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  suffix?: string;
  disabled?: boolean;
  className?: string;
  max?: number;
  min?: number;
  limitInfo?: string;
  warningMessage?: string;
  incomeType?: string;
  relatedIncome?: number; // 관련 소득 (비교용)
  allInputs?: ComprehensiveIncomeTaxInput; // 전체 입력값 (동적 계산용)
  required?: boolean; // 필수 필드 여부
  requiredMessage?: string; // 필수 필드 메시지
}

function NumberInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  suffix = '원', 
  disabled, 
  className,
  max,
  min = 0,
  limitInfo,
  warningMessage,
  incomeType,
  relatedIncome,
  allInputs,
  required = false,
  requiredMessage = ''
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState(value && value > 0 ? formatNumberInput(value) : '');
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // 🔴 필수 필드 상태 계산
  const isCompleted = required ? value > 0 : true;
  const isRequiredAndEmpty = required && (!value || value === 0);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value && value > 0 ? formatNumberInput(value) : '');
    }
    
    // 한도 초과 검사
    if (max && value > max) {
      setIsOverLimit(true);
    } else {
      setIsOverLimit(false);
    }
  }, [value, max, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 천단위 구분기호와 함께 숫자 입력 처리
    const formattedValue = handleNumberInputChange(
      inputValue,
      (num) => {
        // 최대값 제한 적용
        let finalValue = num;
        if (max && num > max) {
          finalValue = max;
          setIsOverLimit(true);
        } else {
          setIsOverLimit(false);
        }
        
        // 최소값 제한 적용
        if (finalValue < min) {
          finalValue = min;
        }
        
        onChange(finalValue);
      },
      { min, max, allowEmpty: true }
    );
    
    setDisplayValue(formattedValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // 포커스 시 원본 숫자만 표시 (편집하기 쉽게)
    const rawNumber = parseFormattedNumber(displayValue);
    if (rawNumber > 0) {
      setDisplayValue(rawNumber.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 포커스 해제 시 천단위 구분기호 적용
    const rawNumber = parseFormattedNumber(displayValue || '0');
    
    if (rawNumber === 0) {
      setDisplayValue('');
    } else {
      // 범위 체크 후 정규화
      let finalValue = rawNumber;
      if (min !== undefined && rawNumber < min) finalValue = min;
      if (max !== undefined && rawNumber > max) finalValue = max;
      
      setDisplayValue(formatNumberInput(finalValue));
      if (finalValue !== rawNumber) {
        onChange(finalValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 🔥 키보드 단축키 허용 (Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+Z 등)
    if (e.ctrlKey || e.metaKey) {
      return; // 모든 Ctrl/Cmd 조합키 허용
    }

    // 음수 허용하지 않는 경우 '-' 키 차단
    if (min !== undefined && min >= 0 && e.key === '-') {
      e.preventDefault();
      return;
    }
    
    // 기본 허용 키들
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'PageUp', 'PageDown'
    ];
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

  // 동적 안내 메시지 생성
  const getDynamicMessage = () => {
    if (!allInputs) return null;
    
    // 금융소득 종합과세 안내
    if (label.includes('이자소득') || label.includes('배당소득')) {
      const financialCheck = ComprehensiveTaxInputValidator.checkFinancialIncomeComprehensive(
        allInputs.interestIncome, 
        allInputs.dividendIncome
      );
      return financialCheck.message;
    }
    
    // 사업소득 경비율 안내
    if (label.includes('사업소득')) {
      const expenseInfo = ComprehensiveTaxInputValidator.calculateBusinessExpenseRate('general');
      return `일반사업 기준 경비율 ${(expenseInfo.rate * 100)}% 적용 가능`;
    }
    
    // 임대소득 관련 안내
    if (label.includes('임대소득')) {
      const threshold = COMPREHENSIVE_TAX_LIMITS_2024.rentalIncome.smallScaleThreshold;
      return `연 ${formatCurrency(threshold)} 이하 시 소규모 임대사업자 (분리과세 선택 가능)`;
    }
    
    // 임대소득 필요경비 안내
    if (label.includes('임대소득 필요경비') && relatedIncome) {
      const standardExpense = relatedIncome * COMPREHENSIVE_TAX_LIMITS_2024.rentalIncome.standardExpenseRate;
      return `기본 경비율 60% 적용 시: ${formatCurrency(standardExpense)}`;
    }
    
    // 연금소득 공제 안내
    if (label.includes('연금소득') && value > 0) {
      const pensionInfo = ComprehensiveTaxInputValidator.calculatePensionDeduction(value);
      return pensionInfo.message;
    }
    
    // 기타소득 안내
    if (label.includes('기타소득')) {
      const basicDeduction = COMPREHENSIVE_TAX_LIMITS_2024.otherIncome.basicDeduction;
      return `기본공제 ${formatCurrency(basicDeduction)} (300만원 이하 시 비과세)`;
    }
    
    // 의료비 공제 안내
    if (label.includes('의료비') && allInputs) {
      const totalIncome = allInputs.interestIncome + allInputs.dividendIncome + allInputs.businessIncome + 
                         allInputs.realEstateRentalIncome + allInputs.earnedIncome + allInputs.pensionIncome + allInputs.otherIncome;
      if (totalIncome > 0) {
        const threshold = ComprehensiveTaxInputValidator.calculateMedicalExpenseThreshold(totalIncome);
        return `총소득의 3% (${formatCurrency(threshold)}) 초과분만 공제`;
      }
    }
    
    // 기부금 공제 안내
    if (label.includes('기부금') && allInputs) {
      const totalIncome = allInputs.interestIncome + allInputs.dividendIncome + allInputs.businessIncome + 
                         allInputs.realEstateRentalIncome + allInputs.earnedIncome + allInputs.pensionIncome + allInputs.otherIncome;
      if (totalIncome > 0) {
        const limit = ComprehensiveTaxInputValidator.calculateDonationLimit(totalIncome);
        return `소득금액의 30% (최대 ${formatCurrency(limit)})`;
      }
    }
    
    // 연금저축 세액공제 안내
    if (label.includes('연금저축') && value > 0) {
      const pensionInfo = ComprehensiveTaxInputValidator.validatePensionSavings(value);
      return pensionInfo.message;
    }
    
    return null;
  };

  const dynamicMessage = getDynamicMessage();

  return (
    <div className={className}>
      {/* 🔴 개선된 라벨 (필수 필드 강조) */}
      <Label htmlFor={label} className={`
        flex items-center gap-2 text-sm font-medium mb-2
        ${isRequiredAndEmpty ? 'text-red-700 font-semibold' : 
          isCompleted && required ? 'text-green-700 font-semibold' : 'text-gray-700'}
      `}>
        <span>{label}</span>
        
        {/* 🔴 필수 표시 강화 */}
        {required && (
          <div className="flex items-center gap-1">
            <span className="text-red-500 text-lg font-bold">*</span>
            <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300 px-1 py-0">
              필수
            </Badge>
          </div>
        )}
        
        {/* ✅ 완료 표시 */}
        {required && isCompleted && (
          <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
            ✅ 완료
          </Badge>
        )}

        {limitInfo && (
          <span className="ml-2 text-xs text-blue-600">
            (한도: {limitInfo})
          </span>
        )}
      </Label>
      {/* 🔴 개선된 입력 필드 */}
      <div className="relative">
        <Input
          id={label}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={required ? `${placeholder || "숫자를 입력하세요"} (필수)` : placeholder || "숫자를 입력하세요"}
          disabled={disabled}
          autoComplete="off"
          title={label}
          aria-label={label}
          className={`
            ${isRequiredAndEmpty ? 
              'border-red-400 border-2 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' :
              required && isCompleted ? 
              'border-green-500 bg-green-50 focus:border-green-500' :
              isOverLimit ? 'border-orange-400 bg-orange-50' : ''}
            pr-16 text-right font-mono transition-all duration-200
          `}
        />
        
        {/* 🔴 필수 필드 시각적 표시 */}
        {isRequiredAndEmpty && (
          <div className="absolute -right-2 -top-2">
            <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
              !
            </span>
          </div>
        )}
        
        {/* ✅ 완료 표시 */}
        {required && isCompleted && (
          <div className="absolute -right-2 -top-2">
            <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-green-500 rounded-full">
              ✓
            </span>
          </div>
        )}

        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
            {suffix}
          </span>
        )}
      </div>
      
      {/* 포커스 시 사용법 안내 */}
      {isFocused && (
        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border mt-1">
          💡 숫자만 입력하세요. 천단위 쉼표는 자동으로 표시됩니다.
          {min !== undefined && ` (최소: ${formatNumber(min)})`}
          {max !== undefined && ` (최대: ${formatNumber(max)})`}
        </p>
      )}
      
      {/* 동적 안내 메시지 */}
      {!isFocused && dynamicMessage && (
        <p className="text-xs text-blue-600 mt-1">
          💡 {dynamicMessage}
        </p>
      )}
      
      {/* 🔴 필수 필드 오류 메시지 */}
      {isRequiredAndEmpty && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200 mt-1">
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
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200 mt-1">
          ✅ 필수 입력이 완료되었습니다: {formatCurrency(value)}
        </div>
      )}

      {/* 한도 초과 경고 */}
      {isOverLimit && warningMessage && (
        <p className="text-xs text-orange-600 mt-1">
          ⚠️ {warningMessage}
        </p>
      )}
      
      {/* 고정 한도 정보 */}
      {!isFocused && !dynamicMessage && !isRequiredAndEmpty && !isCompleted && limitInfo && (
        <p className="text-xs text-gray-500 mt-1">
          📋 {limitInfo}
        </p>
      )}
    </div>
  );
}

export default function ComprehensiveIncomeTaxCalculatorComponent() {
  const [inputs, setInputs] = useState<ComprehensiveIncomeTaxInput>({
    // 소득별 금액
    interestIncome: 0,
    dividendIncome: 0,
    businessIncome: 0,
    realEstateRentalIncome: 0,
    earnedIncome: 0,
    pensionIncome: 0,
    otherIncome: 0,
    
    // 필요경비 및 공제
    businessExpenses: 0,
    rentalExpenses: 0,
    earnedIncomeDeduction: 0,
    
    // 인적공제
    dependents: 0,
    spouseCount: 0,
    disabledCount: 0,
    elderlyCount: 0,
    childrenCount: 0,
    childrenUnder6Count: 0,
    
    // 소득공제
    personalPensionContribution: 0,
    pensionSavings: 0,
    housingFund: 0,
    medicalExpenses: 0,
    educationExpenses: 0,
    donationAmount: 0,
    creditCardUsage: 0,
    
    // 세액공제
    childTaxCredit: 0,
    earnedIncomeTaxCredit: 0,
    
    // 기타
    previousYearTaxPaid: 0,
    isSmallBusiness: false
  });

  const [results, setResults] = useState<ComprehensiveIncomeTaxResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSavingPDF, setIsSavingPDF] = useState(false);

  const updateInput = (field: keyof ComprehensiveIncomeTaxInput, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculate = async () => {
    setIsCalculating(true);
    try {
      // 실제 환경에서는 서버 API 호출 고려
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 입력값 검증
      const totalIncome = inputs.interestIncome + inputs.dividendIncome + inputs.businessIncome + 
                         inputs.realEstateRentalIncome + inputs.earnedIncome + inputs.pensionIncome + inputs.otherIncome;
      
      if (totalIncome <= 0) {
        console.log('총소득이 0입니다.');
        setResults(null);
        return;
      }
      
      console.log('계산 시작 - 총소득:', totalIncome);
      const result = ComprehensiveIncomeTaxCalculator.calculate(inputs);
      console.log('계산 완료:', result);
      setResults(result);
    } catch (error) {
      console.error('계산 오류:', error);
      console.error('입력값:', inputs);
      // 에러 발생 시 결과 초기화
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const reset = () => {
    setInputs({
      interestIncome: 0,
      dividendIncome: 0,
      businessIncome: 0,
      realEstateRentalIncome: 0,
      earnedIncome: 0,
      pensionIncome: 0,
      otherIncome: 0,
      businessExpenses: 0,
      rentalExpenses: 0,
      earnedIncomeDeduction: 0,
      dependents: 0,
      spouseCount: 0,
      disabledCount: 0,
      elderlyCount: 0,
      personalPensionContribution: 0,
      pensionSavings: 0,
      housingFund: 0,
      medicalExpenses: 0,
      educationExpenses: 0,
      donationAmount: 0,
          creditCardUsage: 0,
    childrenCount: 0,
    childrenUnder6Count: 0,
    childTaxCredit: 0,
    earnedIncomeTaxCredit: 0,
      previousYearTaxPaid: 0,
      isSmallBusiness: false
    });
    setResults(null);
  };

  const loadSampleData = () => {
    setInputs({
      interestIncome: 1000000,        // 100만원
      dividendIncome: 500000,         // 50만원
      businessIncome: 30000000,       // 3000만원
      realEstateRentalIncome: 12000000, // 1200만원
      earnedIncome: 40000000,         // 4000만원
      pensionIncome: 0,
      otherIncome: 2000000,           // 200만원
      businessExpenses: 10000000,     // 1000만원
      rentalExpenses: 3000000,        // 300만원
      earnedIncomeDeduction: 14000000, // 근로소득공제
      dependents: 2,                  // 부양가족 2명
      spouseCount: 1,                 // 배우자 1명
      disabledCount: 0,               // 장애인 0명
      elderlyCount: 0,                // 경로우대자 0명
      personalPensionContribution: 4000000,  // 400만원
      pensionSavings: 0,
      housingFund: 240000,            // 24만원
      medicalExpenses: 3000000,       // 300만원
      educationExpenses: 1000000,     // 100만원
      donationAmount: 1000000,        // 100만원
      creditCardUsage: 15000000,      // 1500만원
      childrenCount: 2,               // 자녀 2명
      childrenUnder6Count: 0,         // 6세 이하 0명  
      childTaxCredit: 0,              // 자동계산
      earnedIncomeTaxCredit: 0,
      previousYearTaxPaid: 5000000,   // 기납부세액 500만원
      isSmallBusiness: false
    });
  };

  // PDF 저장 함수
  const handleSavePDF = async () => {
    if (!results) {
      alert('계산 결과가 없습니다. 먼저 계산을 실행해주세요.');
      return;
    }

    setIsSavingPDF(true);
    try {
      // 세금계산 결과를 진단 형태로 변환
      const taxData = {
        type: 'comprehensive-income-tax',
        title: '종합소득세 계산 결과',
        companyName: '개인납세자',
        results: {
          ...results,
          inputs: inputs
        },
        timestamp: new Date().toLocaleString('ko-KR'),
        summary: {
          totalIncome: results.totalIncome,
          totalGrossIncome: results.totalGrossIncome,
          taxableIncome: results.taxableIncome,
          determinedTax: results.determinedTax,
          localIncomeTax: results.localIncomeTax,
          additionalTax: results.additionalTax,
          refundTax: results.refundTax,
          effectiveRate: results.effectiveRate,
          marginalRate: results.marginalRate
        }
      };

      await PDFGenerator.generateDiagnosisPDF(taxData, {
        title: '종합소득세 계산 결과서',
        companyName: '개인납세자',
        includeDetails: true
      });

      alert('✅ PDF 저장이 완료되었습니다!\n다운로드 폴더를 확인해주세요.');
    } catch (error) {
      console.error('PDF 저장 오류:', error);
      alert('PDF 저장 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.');
    } finally {
      setIsSavingPDF(false);
    }
  };

  // 🔥 고도화된 자동 연계 계산 로직
  
  // 1. 총소득 자동 계산
  const totalIncome = useMemo(() => {
    return inputs.interestIncome + inputs.dividendIncome + inputs.businessIncome + 
           inputs.realEstateRentalIncome + inputs.earnedIncome + inputs.pensionIncome + inputs.otherIncome;
  }, [inputs.interestIncome, inputs.dividendIncome, inputs.businessIncome, 
      inputs.realEstateRentalIncome, inputs.earnedIncome, inputs.pensionIncome, inputs.otherIncome]);

  // 2. 근로소득공제 자동 계산 (2024년 기준)
  const autoEarnedIncomeDeduction = useMemo(() => {
    if (inputs.earnedIncome <= 0) return 0;
    
    if (inputs.earnedIncome <= 5000000) { // 500만원 이하
      return inputs.earnedIncome * 0.7; // 70% 공제
    } else if (inputs.earnedIncome <= 15000000) { // 1500만원 이하
      return 3500000 + (inputs.earnedIncome - 5000000) * 0.4; // 350만원 + 40%
    } else if (inputs.earnedIncome <= 45000000) { // 4500만원 이하
      return 7500000 + (inputs.earnedIncome - 15000000) * 0.15; // 750만원 + 15%
    } else if (inputs.earnedIncome <= 100000000) { // 1억원 이하
      return 12000000 + (inputs.earnedIncome - 45000000) * 0.05; // 1200만원 + 5%
    } else { // 1억원 초과
      return Math.min(14750000 + (inputs.earnedIncome - 100000000) * 0.02, 20000000); // 최대 2천만원
    }
  }, [inputs.earnedIncome]);

  // 3. 인적공제 자동 계산
  const autoPersonalDeductions = useMemo(() => {
    const basicDeduction = 1500000; // 본인 기본공제 150만원
    const spouseDeduction = inputs.spouseCount * 1500000; // 배우자 150만원/명
    const dependentDeduction = inputs.dependents * 1500000; // 부양가족 150만원/명
    const disabledDeduction = inputs.disabledCount * 2000000; // 장애인 200만원/명
    const elderlyDeduction = inputs.elderlyCount * 1000000; // 경로우대 100만원/명
    
    return basicDeduction + spouseDeduction + dependentDeduction + disabledDeduction + elderlyDeduction;
  }, [inputs.spouseCount, inputs.dependents, inputs.disabledCount, inputs.elderlyCount]);

  // 4. 자녀세액공제 자동 계산 (개선)
  const autoChildTaxCredit = useMemo(() => {
    if (inputs.childrenCount <= 0) return 0;
    
    const basicCredit = Math.min(inputs.childrenCount, 2) * 150000; // 첫 2명까지 15만원/명
    const additionalCredit = Math.max(0, inputs.childrenCount - 2) * 300000; // 3명부터 30만원/명
    const under6Credit = Math.min(inputs.childrenUnder6Count, inputs.childrenCount) * 120000; // 6세 이하 추가 12만원/명
    
    return basicCredit + additionalCredit + under6Credit;
  }, [inputs.childrenCount, inputs.childrenUnder6Count]);

  // 5. 논리적 오류 체크
  const logicalErrors = useMemo(() => {
    const errors: string[] = [];
    
    // 필요경비가 해당 소득을 초과하는 경우
    if (inputs.businessExpenses > inputs.businessIncome && inputs.businessIncome > 0) {
      errors.push('사업소득 필요경비가 사업소득을 초과합니다.');
    }
    
    if (inputs.rentalExpenses > inputs.realEstateRentalIncome && inputs.realEstateRentalIncome > 0) {
      errors.push('임대소득 필요경비가 임대소득을 초과합니다.');
    }
    
    // 6세 이하 자녀가 전체 자녀보다 많은 경우
    if (inputs.childrenUnder6Count > inputs.childrenCount) {
      errors.push('6세 이하 자녀수가 전체 자녀수보다 많을 수 없습니다.');
    }
    
    // 배우자가 2명 이상인 경우
    if (inputs.spouseCount > 1) {
      errors.push('배우자는 1명까지만 공제 가능합니다.');
    }
    
    // 공제액이 한도를 초과하는 경우
    if (inputs.personalPensionContribution > 4000000) {
      errors.push('개인연금저축 공제한도(400만원)를 초과했습니다.');
    }
    
    if (inputs.medicalExpenses > totalIncome * 0.03 && totalIncome > 0) {
      // 의료비는 총소득의 3% 초과분만 공제 가능 (실제로는 더 복잡)
      const threshold = totalIncome * 0.03;
      if (inputs.medicalExpenses > threshold + 7000000) { // 초과분 + 700만원 한도
        errors.push('의료비 공제가 한도를 초과할 수 있습니다.');
      }
    }
    
    return errors;
  }, [inputs, totalIncome]);

  // 6. 예상 세율 구간 계산
  const expectedTaxBracket = useMemo(() => {
    if (totalIncome <= 0) return { rate: 0, description: '과세소득 없음' };
    
    // 간단한 추정 (실제로는 더 복잡한 계산 필요)
    const estimatedTaxableIncome = totalIncome - autoPersonalDeductions - inputs.personalPensionContribution;
    
    if (estimatedTaxableIncome <= 14000000) {
      return { rate: 6, description: '6% 구간 (1,400만원 이하)' };
    } else if (estimatedTaxableIncome <= 50000000) {
      return { rate: 15, description: '15% 구간 (5,000만원 이하)' };
    } else if (estimatedTaxableIncome <= 88000000) {
      return { rate: 24, description: '24% 구간 (8,800만원 이하)' };
    } else if (estimatedTaxableIncome <= 150000000) {
      return { rate: 35, description: '35% 구간 (1억 5천만원 이하)' };
    } else if (estimatedTaxableIncome <= 300000000) {
      return { rate: 38, description: '38% 구간 (3억원 이하)' };
    } else if (estimatedTaxableIncome <= 500000000) {
      return { rate: 40, description: '40% 구간 (5억원 이하)' };
    } else if (estimatedTaxableIncome <= 1000000000) {
      return { rate: 42, description: '42% 구간 (10억원 이하)' };
    } else {
      return { rate: 45, description: '45% 구간 (10억원 초과)' };
    }
  }, [totalIncome, autoPersonalDeductions, inputs.personalPensionContribution]);

  // 7. 자동 값 업데이트 (사용자가 수동으로 변경하지 않은 경우만)
  useEffect(() => {
    // 근로소득공제 자동 업데이트
    if (inputs.earnedIncome > 0 && inputs.earnedIncomeDeduction === 0) {
      updateInput('earnedIncomeDeduction', Math.floor(autoEarnedIncomeDeduction));
    }
  }, [autoEarnedIncomeDeduction, inputs.earnedIncome, inputs.earnedIncomeDeduction]);

  useEffect(() => {
    // 자녀세액공제 자동 업데이트
    if (autoChildTaxCredit !== inputs.childTaxCredit) {
      updateInput('childTaxCredit', autoChildTaxCredit);
    }
  }, [autoChildTaxCredit, inputs.childTaxCredit]);

  // 8. 절세 추천 로직
  const taxSavingRecommendations = useMemo(() => {
    const recommendations: string[] = [];
    
    // 연금저축 추천
    if (inputs.personalPensionContribution < 4000000 && totalIncome > 30000000) {
      const savingAmount = Math.min(4000000 - inputs.personalPensionContribution, totalIncome * 0.1);
      if (savingAmount > 1000000) {
        recommendations.push(`연금저축 ${Math.floor(savingAmount / 10000)}만원 추가 납입시 세액공제 혜택`);
      }
    }
    
    // 의료비 공제 추천
    if (totalIncome > 0 && inputs.medicalExpenses === 0) {
      const threshold = Math.floor(totalIncome * 0.03 / 10000);
      if (threshold > 100) {
        recommendations.push(`의료비 ${threshold}만원 초과분 공제 가능 (영수증 준비)`);
      }
    }
    
    // 신용카드 공제 추천
    if (inputs.creditCardUsage === 0 && totalIncome > 20000000) {
      recommendations.push('신용카드 등 사용금액 공제 입력 권장 (소득금액의 25% 초과분 공제)');
    }
    
    // 기부금 공제 추천
    if (inputs.donationAmount === 0 && totalIncome > 50000000) {
      recommendations.push('기부금 납부시 세액공제 15~30% 혜택');
    }
    
    return recommendations;
  }, [inputs, totalIncome]);

  // 9. 디바운스된 자동 계산
  useEffect(() => {
    if (totalIncome > 0) {
      const timer = setTimeout(() => {
        calculate();
      }, 300); // 300ms 디바운스
      
      return () => clearTimeout(timer);
    } else {
      setResults(null);
    }
  }, [inputs, totalIncome]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 계산기 헤더 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-50 p-2 rounded-xl">
                <PieChart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  종합소득세 계산기
                </CardTitle>
                <CardDescription className="text-gray-600">
                  2024년 세율 기준 · 다양한 소득 유형 통합 계산
                </CardDescription>
                <p className="text-sm text-blue-600 mt-2">
                  💡 "샘플 데이터" 버튼을 클릭하여 예시 데이터로 테스트해보세요
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                2024년 적용
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 🧪 베타테스트 피드백 시스템 (면책조항 상단) */}
      <BetaFeedbackForm 
        calculatorName="종합소득세 계산기"
        calculatorType="comprehensive-income-tax"
        className="mb-6"
      />

      {/* 간단한 면책 조항 */}
      <TaxCalculatorDisclaimer variant="summary" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 입력 폼 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Building className="w-5 h-5 mr-2 text-green-600" />
                소득 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 소득별 입력 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">소득 유형별 금액</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput
                    label="이자소득 (연간)"
                    value={inputs.interestIncome}
                    onChange={(value) => updateInput('interestIncome', value)}
                    placeholder="예적금 이자 등"
                    suffix="원/년"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="배당소득 (연간)"
                    value={inputs.dividendIncome}
                    onChange={(value) => updateInput('dividendIncome', value)}
                    placeholder="주식 배당금 등"
                    suffix="원/년"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="사업소득 (연간)"
                    value={inputs.businessIncome}
                    onChange={(value) => updateInput('businessIncome', value)}
                    placeholder="사업 수입금액"
                    suffix="원/년"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="부동산임대소득 (연간)"
                    value={inputs.realEstateRentalIncome}
                    onChange={(value) => updateInput('realEstateRentalIncome', value)}
                    placeholder="임대료 수입"
                    suffix="원/년"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="💼 근로소득 (연간)"
                    value={inputs.earnedIncome}
                    onChange={(value) => updateInput('earnedIncome', value)}
                    placeholder="급여, 상여 등 (필수)"
                    suffix="원/년"
                    max={50000000000}
                    required={true}
                    requiredMessage="종합소득세 계산을 위해 근로소득 입력이 필수입니다"
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="연금소득 (연간)"
                    value={inputs.pensionIncome}
                    onChange={(value) => updateInput('pensionIncome', value)}
                    placeholder="연금 수급액"
                    suffix="원/년"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="기타소득 (연간)"
                    value={inputs.otherIncome}
                    onChange={(value) => updateInput('otherIncome', value)}
                    placeholder="강의료, 원고료 등"
                    suffix="원/년"
                    max={50000000000}
                    allInputs={inputs}
                    className="md:col-span-2"
                  />
                </div>

                                  {/* 🔥 스마트 자동 계산 대시보드 */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700 text-lg">
                      <Calculator className="w-5 h-5" />
                      ⚡ 스마트 자동 계산 대시보드
                    </CardTitle>
                    <CardDescription className="text-purple-600">
                      입력하는 즉시 관련 값들이 자동으로 연계 계산됩니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 총소득 */}
                      <div className="bg-white p-3 rounded border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">총소득</span>
                          <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                        </div>
                        <div className="text-lg font-bold text-purple-700">
                          {totalIncome.toLocaleString('ko-KR')}원
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          연간 종합소득 합계
                        </div>
                      </div>

                      {/* 예상 세율 구간 */}
                      <div className="bg-white p-3 rounded border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">예상 세율</span>
                          <Badge className={`text-xs ${expectedTaxBracket.rate <= 15 ? 'bg-green-100 text-green-700' : 
                            expectedTaxBracket.rate <= 35 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {expectedTaxBracket.rate}%
                          </Badge>
                        </div>
                        <div className={`text-lg font-bold ${expectedTaxBracket.rate <= 15 ? 'text-green-700' : 
                          expectedTaxBracket.rate <= 35 ? 'text-yellow-700' : 'text-red-700'}`}>
                          {expectedTaxBracket.rate}% 구간
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {expectedTaxBracket.description}
                        </div>
                      </div>

                      {/* 자동 인적공제 */}
                      <div className="bg-white p-3 rounded border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">인적공제</span>
                          <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                        </div>
                        <div className="text-lg font-bold text-purple-700">
                          {autoPersonalDeductions.toLocaleString('ko-KR')}원
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          본인+가족 {inputs.dependents + inputs.spouseCount + 1}명
                        </div>
                      </div>

                      {/* 근로소득공제 */}
                      {inputs.earnedIncome > 0 && (
                        <div className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">근로소득공제</span>
                            <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                          </div>
                          <div className="text-lg font-bold text-purple-700">
                            {autoEarnedIncomeDeduction.toLocaleString('ko-KR')}원
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            급여 {Math.round((autoEarnedIncomeDeduction / inputs.earnedIncome) * 100)}% 공제
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 소득별 세부 내역 */}
                    {totalIncome > 0 && (
                      <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                        <div className="text-sm font-medium text-gray-700 mb-3">📊 소득 구성 비율</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {[
                            { label: '이자', value: inputs.interestIncome, color: 'bg-blue-100 text-blue-700' },
                            { label: '배당', value: inputs.dividendIncome, color: 'bg-green-100 text-green-700' },
                            { label: '사업', value: inputs.businessIncome, color: 'bg-purple-100 text-purple-700' },
                            { label: '임대', value: inputs.realEstateRentalIncome, color: 'bg-orange-100 text-orange-700' },
                            { label: '근로', value: inputs.earnedIncome, color: 'bg-indigo-100 text-indigo-700' },
                            { label: '연금', value: inputs.pensionIncome, color: 'bg-gray-100 text-gray-700' },
                            { label: '기타', value: inputs.otherIncome, color: 'bg-pink-100 text-pink-700' }
                          ].filter(item => item.value > 0).map((item, index) => (
                            <div key={index} className={`p-2 rounded ${item.color}`}>
                              <div className="font-medium">{item.label}</div>
                              <div className="font-mono text-right">
                                {item.value.toLocaleString('ko-KR')}
                              </div>
                              <div className="text-right text-xs opacity-75">
                                {((item.value / totalIncome) * 100).toFixed(1)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 자녀세액공제 자동 계산 */}
                    {autoChildTaxCredit > 0 && (
                      <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">👶 자녀세액공제 자동 계산</span>
                          <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                        </div>
                        <div className="text-lg font-bold text-purple-700">
                          {autoChildTaxCredit.toLocaleString('ko-KR')}원
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          자녀 {inputs.childrenCount}명 
                          {inputs.childrenUnder6Count > 0 && ` (6세 이하 ${inputs.childrenUnder6Count}명 포함)`}
                        </div>
                      </div>
                    )}

                    {/* 논리적 오류 실시간 체크 */}
                    {logicalErrors.length > 0 && (
                      <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
                        <div className="text-sm font-medium text-red-700 mb-2">🚨 논리적 오류 감지</div>
                        <div className="space-y-1">
                          {logicalErrors.map((error, index) => (
                            <div key={index} className="text-xs text-red-600 flex items-start gap-2">
                              <span className="text-red-500">•</span>
                              <span>{error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 절세 추천 */}
                    {taxSavingRecommendations.length > 0 && (
                      <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                        <div className="text-sm font-medium text-green-700 mb-2">💡 절세 추천</div>
                        <div className="space-y-1">
                          {taxSavingRecommendations.map((recommendation, index) => (
                            <div key={index} className="text-xs text-green-600 flex items-start gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{recommendation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 계산 준비 상태 */}
                    {logicalErrors.length === 0 && totalIncome > 0 && (
                      <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                        <div className="text-sm font-medium text-green-700 mb-2">✅ 계산 준비 완료</div>
                        <div className="text-xs text-green-600">
                          모든 필수 정보가 올바르게 입력되었습니다. 실시간으로 세금이 계산되고 있습니다.
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* 필요경비 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">필요경비</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput
                    label="사업소득 필요경비 (연간)"
                    value={inputs.businessExpenses}
                    onChange={(value) => updateInput('businessExpenses', value)}
                    suffix="원/년"
                    max={inputs.businessIncome || 50000000000}
                    warningMessage="필요경비는 사업소득을 초과할 수 없습니다"
                    relatedIncome={inputs.businessIncome}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="임대소득 필요경비 (연간)"
                    value={inputs.rentalExpenses}
                    onChange={(value) => updateInput('rentalExpenses', value)}
                    suffix="원/년"
                    max={inputs.realEstateRentalIncome || 50000000000}
                    warningMessage="필요경비는 임대소득을 초과할 수 없습니다"
                    relatedIncome={inputs.realEstateRentalIncome}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="근로소득공제 (연간)"
                    value={inputs.earnedIncomeDeduction}
                    onChange={(value) => updateInput('earnedIncomeDeduction', value)}
                    placeholder="급여 근로소득공제"
                    suffix="원/년"
                    max={20000000}
                    limitInfo="최대 2천만원"
                    allInputs={inputs}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                공제 및 세액공제
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 인적공제 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">인적공제</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput
                    label="부양가족 수"
                    value={inputs.dependents}
                    onChange={(value) => updateInput('dependents', value)}
                    suffix="명"
                  />
                  <div className="space-y-3">
                    <NumberInput
                      label="배우자 수"
                      value={inputs.spouseCount}
                      onChange={(value) => updateInput('spouseCount', value)}
                      suffix="명"
                      min={0}
                      max={1}
                      placeholder="0~1명"
                      limitInfo="150만원/명"
                      allInputs={inputs}
                    />
                    <NumberInput
                      label="장애인 수"
                      value={inputs.disabledCount}
                      onChange={(value) => updateInput('disabledCount', value)}
                      suffix="명"
                      min={0}
                      max={20}
                      placeholder="0명"
                      limitInfo="200만원/명"
                      allInputs={inputs}
                    />
                    <NumberInput
                      label="경로우대자 수 (65세 이상)"
                      value={inputs.elderlyCount}
                      onChange={(value) => updateInput('elderlyCount', value)}
                      suffix="명"
                      min={0}
                      max={20}
                      placeholder="0명"
                      limitInfo="100만원/명"
                      allInputs={inputs}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 소득공제 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">소득공제</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput
                    label="개인연금 (연간)"
                    value={inputs.personalPensionContribution}
                    onChange={(value) => updateInput('personalPensionContribution', value)}
                    suffix="원/년"
                    max={COMPREHENSIVE_TAX_LIMITS_2024.comprehensiveDeductions.pensionInsurance}
                    limitInfo={formatCurrency(COMPREHENSIVE_TAX_LIMITS_2024.comprehensiveDeductions.pensionInsurance)}
                    warningMessage="개인연금 납입한도를 초과했습니다"
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="연금저축 (연간)"
                    value={inputs.pensionSavings}
                    onChange={(value) => updateInput('pensionSavings', value)}
                    suffix="원/년"
                    max={COMPREHENSIVE_TAX_LIMITS_2024.taxCredits.pensionSavings}
                    limitInfo={formatCurrency(COMPREHENSIVE_TAX_LIMITS_2024.taxCredits.pensionSavings)}
                    warningMessage="연금저축 납입한도를 초과했습니다"
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="주택청약저축 (연간)"
                    value={inputs.housingFund}
                    onChange={(value) => updateInput('housingFund', value)}
                    suffix="원/년"
                    max={2400000}
                    limitInfo="240만원"
                    warningMessage="주택청약저축 납입한도를 초과했습니다"
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="의료비 (연간)"
                    value={inputs.medicalExpenses}
                    onChange={(value) => updateInput('medicalExpenses', value)}
                    suffix="원/년"
                    max={100000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="교육비 (연간)"
                    value={inputs.educationExpenses}
                    onChange={(value) => updateInput('educationExpenses', value)}
                    suffix="원/년"
                    max={COMPREHENSIVE_TAX_LIMITS_2024.comprehensiveDeductions.educationChild * 10}
                    limitInfo="자녀당 300만원 (본인 무제한)"
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="기부금 (연간)"
                    value={inputs.donationAmount}
                    onChange={(value) => updateInput('donationAmount', value)}
                    suffix="원/년"
                    max={500000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="신용카드 사용액 (연간)"
                    value={inputs.creditCardUsage}
                    onChange={(value) => updateInput('creditCardUsage', value)}
                    suffix="원/년"
                    max={500000000}
                    allInputs={inputs}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <Separator />

              {/* 세액공제 및 기타 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">세액공제 및 기타</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <NumberInput
                      label="자녀 수"
                      value={inputs.childrenCount}
                      onChange={(value) => updateInput('childrenCount', value)}
                      suffix="명"
                      min={0}
                      max={20}
                      placeholder="0명"
                      limitInfo="15만원/명 (기본)"
                      allInputs={inputs}
                    />
                    <NumberInput
                      label="6세 이하 자녀 수"
                      value={inputs.childrenUnder6Count}
                      onChange={(value) => updateInput('childrenUnder6Count', value)}
                      suffix="명"
                      min={0}
                      max={inputs.childrenCount || 20}
                      placeholder="0명"
                      limitInfo="추가 12만원/명"
                      warningMessage="6세 이하 자녀는 총 자녀 수를 초과할 수 없습니다"
                      allInputs={inputs}
                    />
                  </div>
                  <NumberInput
                    label="기타세액공제 (연간)"
                    value={inputs.earnedIncomeTaxCredit}
                    onChange={(value) => updateInput('earnedIncomeTaxCredit', value)}
                    suffix="원/년"
                    max={COMPREHENSIVE_TAX_LIMITS_2024.taxCredits.earnedIncomeTaxCreditLimit}
                    limitInfo={formatCurrency(COMPREHENSIVE_TAX_LIMITS_2024.taxCredits.earnedIncomeTaxCreditLimit)}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="기납부세액 (연간)"
                    value={inputs.previousYearTaxPaid}
                    onChange={(value) => updateInput('previousYearTaxPaid', value)}
                    placeholder="원천징수세액 등"
                    suffix="원/년"
                    max={100000000}
                    allInputs={inputs}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smallBusiness"
                      checked={inputs.isSmallBusiness}
                      onCheckedChange={(checked) => updateInput('isSmallBusiness', checked)}
                    />
                    <Label htmlFor="smallBusiness" className="text-sm">
                      소규모 사업자 (사업소득 시)
                    </Label>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={calculate} 
                  disabled={isCalculating}
                  className="flex-1"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      계산 중...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      계산하기
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={loadSampleData} size="sm">
                  샘플 데이터
                </Button>
                <Button variant="outline" onClick={reset} size="sm">
                  초기화
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 결과 표시 */}
        <div className="space-y-6">
          {results && (
            <>
              {/* 주요 결과 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    계산 결과
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-sm text-green-600 font-medium">종합소득결정세액</div>
                      <div className="text-2xl font-bold text-green-900 font-mono">
                        {formatCurrency(results.determinedTax)}
                      </div>
                      <div className="text-sm text-green-600 mt-1">최종 납부할 세액</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-blue-600">총수입금액</div>
                        <div className="text-base font-semibold text-blue-900 font-mono">
                          {formatCurrency(results.totalIncome)}
                        </div>
                        <div className="text-xs text-blue-500 mt-1">필요경비 차감 전</div>
                      </div>
                      <div className="bg-cyan-50 p-3 rounded-lg">
                        <div className="text-sm text-cyan-600">총소득금액</div>
                        <div className="text-base font-semibold text-cyan-900 font-mono">
                          {formatCurrency(results.totalGrossIncome)}
                        </div>
                        <div className="text-xs text-cyan-500 mt-1">필요경비 차감 후</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-sm text-purple-600">종합소득공제</div>
                        <div className="text-base font-semibold text-purple-900 font-mono">
                          {formatCurrency(results.totalDeductibleAmount)}
                        </div>
                        <div className="text-xs text-purple-500 mt-1">인적공제+소득공제</div>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <div className="text-sm text-indigo-600">과세표준</div>
                        <div className="text-base font-semibold text-indigo-900 font-mono">
                          {formatCurrency(results.taxableIncome)}
                        </div>
                        <div className="text-xs text-indigo-500 mt-1">세금 계산 기준</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-sm text-red-600">산출세액</div>
                        <div className="text-base font-semibold text-red-900 font-mono">
                          {formatCurrency(results.progressiveTax)}
                        </div>
                        <div className="text-xs text-red-500 mt-1">누진세율 적용</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-sm text-yellow-600">지방소득세</div>
                        <div className="text-base font-semibold text-yellow-900 font-mono">
                          {formatCurrency(results.localIncomeTax)}
                        </div>
                        <div className="text-xs text-yellow-500 mt-1">소득세의 10%</div>
                      </div>
                    </div>

                    {/* 추가납부 또는 환급 */}
                    {results.additionalTax > 0 && (
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <div className="text-sm text-orange-600 font-medium">추가납부세액</div>
                        <div className="text-xl font-bold text-orange-900 font-mono">
                          {formatCurrency(results.additionalTax)}
                        </div>
                        <div className="text-sm text-orange-600 mt-1">기납부세액 대비 부족분</div>
                      </div>
                    )}

                    {results.refundTax > 0 && (
                      <div className="bg-cyan-50 p-4 rounded-xl">
                        <div className="text-sm text-cyan-600 font-medium">환급세액</div>
                        <div className="text-xl font-bold text-cyan-900 font-mono">
                          {formatCurrency(results.refundTax)}
                        </div>
                        <div className="text-sm text-cyan-600 mt-1">기납부세액 대비 초과분</div>
                      </div>
                    )}

                    {/* 세율 정보 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Percent className="w-4 h-4 mr-1" />
                          실효세율
                        </div>
                        <div className="text-base font-semibold text-gray-900 font-mono">
                          {results.effectiveRate.toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">세액 ÷ 총소득</div>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <div className="text-sm text-indigo-600 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          한계세율
                        </div>
                        <div className="text-base font-semibold text-indigo-900 font-mono">
                          {results.marginalRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-indigo-500 mt-1">구간별 최고세율</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      className="flex-1"
                    >
                      {showBreakdown ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          계산과정 숨기기
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          계산과정 보기
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSavePDF}
                      disabled={isSavingPDF || !results}
                    >
                      {isSavingPDF ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          PDF 생성 중...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          PDF 저장
                        </>
                      )}
                    </Button>
                  </div>

                  {/* 결과 관련 면책 조항 */}
                  <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-red-800">
                        <p className="font-medium mb-1">⚠️ 중요 안내</p>
                        <p>위 계산 결과는 <strong>참고용</strong>이며, 실제 세무신고 시에는 반드시 <strong>세무사 상담</strong> 또는 <strong>국세청 홈택스</strong>를 통해 정확한 계산을 확인하시기 바랍니다.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 계산 과정 상세 */}
              {showBreakdown && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      계산 과정
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="breakdown" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="breakdown">단계별 계산</TabsTrigger>
                        <TabsTrigger value="rates">적용 세율</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="breakdown" className="space-y-4">
                        <div className="space-y-3">
                          {results.breakdown.steps.map((step, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-700">
                                {step.label}
                              </span>
                              <span className={`text-sm font-semibold ${
                                step.amount < 0 ? 'text-red-600' : 'text-gray-900'
                              }`}>
                                {step.amount < 0 ? '-' : ''}{formatCurrency(Math.abs(step.amount))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="rates" className="space-y-4">
                        <div className="space-y-3">
                          {results.appliedRates.map((rate, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{rate.range}</span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {(rate.rate * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-right mt-1">
                                <span className="text-sm font-medium text-blue-600">
                                  {formatCurrency(rate.amount)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!results && (
            <Card>
              <CardContent className="p-8 text-center">
                <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  계산 결과가 여기에 표시됩니다
                </h3>
                <p className="text-gray-600">
                  소득 정보를 입력하면 자동으로 계산됩니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 