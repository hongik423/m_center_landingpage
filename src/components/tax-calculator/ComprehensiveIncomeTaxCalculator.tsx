'use client';

import { useState, useEffect } from 'react';
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
import { formatCurrency, formatNumber } from '@/lib/utils';
import { COMPREHENSIVE_TAX_LIMITS_2024 } from '@/constants/tax-rates-2024';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';

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
  allInputs
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState(value ? formatNumber(value) : '');
  const [isOverLimit, setIsOverLimit] = useState(false);

  useEffect(() => {
    setDisplayValue(value ? formatNumber(value) : '');
    
    // 한도 초과 검사
    if (max && value > max) {
      setIsOverLimit(true);
    } else {
      setIsOverLimit(false);
    }
  }, [value, max]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, '');
    const numValue = Math.round(parseInt(inputValue) || 0);
    
    // 최대값 제한 적용
    let finalValue = numValue;
    if (max && numValue > max) {
      finalValue = max;
      setIsOverLimit(true);
    } else {
      setIsOverLimit(false);
    }
    
    // 최소값 제한 적용
    if (finalValue < min) {
      finalValue = min;
    }
    
    setDisplayValue(finalValue ? formatNumber(finalValue) : '');
    onChange(finalValue);
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
      <Label htmlFor={label} className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
        {limitInfo && (
          <span className="ml-2 text-xs text-blue-600">
            (한도: {limitInfo})
          </span>
        )}
      </Label>
      <div className="relative">
        <Input
          id={label}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-8 ${isOverLimit ? 'border-orange-400 bg-orange-50' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
            {suffix}
          </span>
        )}
      </div>
      
      {/* 동적 안내 메시지 */}
      {dynamicMessage && (
        <p className="text-xs text-blue-600 mt-1">
          💡 {dynamicMessage}
        </p>
      )}
      
      {/* 한도 초과 경고 */}
      {isOverLimit && warningMessage && (
        <p className="text-xs text-orange-600 mt-1">
          ⚠️ {warningMessage}
        </p>
      )}
      
      {/* 고정 한도 정보 */}
      {limitInfo && !dynamicMessage && (
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
    spouseDeduction: false,
    isDisabled: false,
    isElderly: false,
    
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
      spouseDeduction: false,
      isDisabled: false,
      isElderly: false,
      personalPensionContribution: 0,
      pensionSavings: 0,
      housingFund: 0,
      medicalExpenses: 0,
      educationExpenses: 0,
      donationAmount: 0,
      creditCardUsage: 0,
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
      spouseDeduction: true,          // 배우자 있음
      isDisabled: false,
      isElderly: false,
      personalPensionContribution: 4000000,  // 400만원
      pensionSavings: 0,
      housingFund: 240000,            // 24만원
      medicalExpenses: 3000000,       // 300만원
      educationExpenses: 1000000,     // 100만원
      donationAmount: 1000000,        // 100만원
      creditCardUsage: 15000000,      // 1500만원
      childTaxCredit: 0,
      earnedIncomeTaxCredit: 0,
      previousYearTaxPaid: 5000000,   // 기납부세액 500만원
      isSmallBusiness: false
    });
  };

  // 총소득이 있을 때만 자동 계산
  useEffect(() => {
    const totalIncome = inputs.interestIncome + inputs.dividendIncome + inputs.businessIncome + 
                       inputs.realEstateRentalIncome + inputs.earnedIncome + inputs.pensionIncome + inputs.otherIncome;
    
    if (totalIncome > 0) {
      const timer = setTimeout(() => {
        calculate();
      }, 300); // 300ms 디바운스
      
      return () => clearTimeout(timer);
    } else {
      setResults(null);
    }
  }, [inputs]);

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
                    label="이자소득"
                    value={inputs.interestIncome}
                    onChange={(value) => updateInput('interestIncome', value)}
                    placeholder="예적금 이자 등"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="배당소득"
                    value={inputs.dividendIncome}
                    onChange={(value) => updateInput('dividendIncome', value)}
                    placeholder="주식 배당금 등"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="사업소득"
                    value={inputs.businessIncome}
                    onChange={(value) => updateInput('businessIncome', value)}
                    placeholder="사업 수입금액"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="부동산임대소득"
                    value={inputs.realEstateRentalIncome}
                    onChange={(value) => updateInput('realEstateRentalIncome', value)}
                    placeholder="임대료 수입"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="근로소득"
                    value={inputs.earnedIncome}
                    onChange={(value) => updateInput('earnedIncome', value)}
                    placeholder="급여, 상여 등"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="연금소득"
                    value={inputs.pensionIncome}
                    onChange={(value) => updateInput('pensionIncome', value)}
                    placeholder="연금 수급액"
                    max={50000000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="기타소득"
                    value={inputs.otherIncome}
                    onChange={(value) => updateInput('otherIncome', value)}
                    placeholder="강의료, 원고료 등"
                    max={50000000000}
                    allInputs={inputs}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <Separator />

              {/* 필요경비 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">필요경비</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput
                    label="사업소득 필요경비"
                    value={inputs.businessExpenses}
                    onChange={(value) => updateInput('businessExpenses', value)}
                    max={inputs.businessIncome || 50000000000}
                    warningMessage="필요경비는 사업소득을 초과할 수 없습니다"
                    relatedIncome={inputs.businessIncome}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="임대소득 필요경비"
                    value={inputs.rentalExpenses}
                    onChange={(value) => updateInput('rentalExpenses', value)}
                    max={inputs.realEstateRentalIncome || 50000000000}
                    warningMessage="필요경비는 임대소득을 초과할 수 없습니다"
                    relatedIncome={inputs.realEstateRentalIncome}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="근로소득공제"
                    value={inputs.earnedIncomeDeduction}
                    onChange={(value) => updateInput('earnedIncomeDeduction', value)}
                    placeholder="급여 근로소득공제"
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
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spouse"
                        checked={inputs.spouseDeduction}
                        onCheckedChange={(checked) => updateInput('spouseDeduction', checked)}
                      />
                      <Label htmlFor="spouse" className="text-sm">
                        배우자 공제 (150만원)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="disabled"
                        checked={inputs.isDisabled}
                        onCheckedChange={(checked) => updateInput('isDisabled', checked)}
                      />
                      <Label htmlFor="disabled" className="text-sm">
                        장애인 공제 (200만원)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="elderly"
                        checked={inputs.isElderly}
                        onCheckedChange={(checked) => updateInput('isElderly', checked)}
                      />
                      <Label htmlFor="elderly" className="text-sm">
                        경로우대 공제 (100만원)
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 소득공제 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">소득공제</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput
                    label="개인연금"
                    value={inputs.personalPensionContribution}
                    onChange={(value) => updateInput('personalPensionContribution', value)}
                    max={COMPREHENSIVE_TAX_LIMITS_2024.comprehensiveDeductions.pensionInsurance}
                    limitInfo={formatCurrency(COMPREHENSIVE_TAX_LIMITS_2024.comprehensiveDeductions.pensionInsurance)}
                    warningMessage="개인연금 납입한도를 초과했습니다"
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="연금저축"
                    value={inputs.pensionSavings}
                    onChange={(value) => updateInput('pensionSavings', value)}
                    max={COMPREHENSIVE_TAX_LIMITS_2024.taxCredits.pensionSavings}
                    limitInfo={formatCurrency(COMPREHENSIVE_TAX_LIMITS_2024.taxCredits.pensionSavings)}
                    warningMessage="연금저축 납입한도를 초과했습니다"
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="주택청약저축"
                    value={inputs.housingFund}
                    onChange={(value) => updateInput('housingFund', value)}
                    max={2400000}
                    limitInfo="240만원"
                    warningMessage="주택청약저축 납입한도를 초과했습니다"
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="의료비"
                    value={inputs.medicalExpenses}
                    onChange={(value) => updateInput('medicalExpenses', value)}
                    max={100000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="교육비"
                    value={inputs.educationExpenses}
                    onChange={(value) => updateInput('educationExpenses', value)}
                    max={COMPREHENSIVE_TAX_LIMITS_2024.comprehensiveDeductions.educationChild * 10}
                    limitInfo="자녀당 300만원 (본인 무제한)"
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="기부금"
                    value={inputs.donationAmount}
                    onChange={(value) => updateInput('donationAmount', value)}
                    max={500000000}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="신용카드 사용액"
                    value={inputs.creditCardUsage}
                    onChange={(value) => updateInput('creditCardUsage', value)}
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
                  <NumberInput
                    label="자녀세액공제"
                    value={inputs.childTaxCredit}
                    onChange={(value) => updateInput('childTaxCredit', value)}
                    max={COMPREHENSIVE_TAX_LIMITS_2024.taxCredits.childTaxCredit * 10}
                    limitInfo="자녀 1명당 15만원"
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="기타세액공제"
                    value={inputs.earnedIncomeTaxCredit}
                    onChange={(value) => updateInput('earnedIncomeTaxCredit', value)}
                    max={COMPREHENSIVE_TAX_LIMITS_2024.taxCredits.earnedIncomeTaxCreditLimit}
                    limitInfo={formatCurrency(COMPREHENSIVE_TAX_LIMITS_2024.taxCredits.earnedIncomeTaxCreditLimit)}
                    allInputs={inputs}
                  />
                  <NumberInput
                    label="기납부세액"
                    value={inputs.previousYearTaxPaid}
                    onChange={(value) => updateInput('previousYearTaxPaid', value)}
                    placeholder="원천징수세액 등"
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
                      <div className="text-2xl font-bold text-green-900">
                        {formatCurrency(results.determinedTax)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-blue-600">총소득금액</div>
                        <div className="text-base font-semibold text-blue-900">
                          {formatCurrency(results.totalGrossIncome)}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-sm text-purple-600">과세표준</div>
                        <div className="text-base font-semibold text-purple-900">
                          {formatCurrency(results.taxableIncome)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-sm text-red-600">산출세액</div>
                        <div className="text-base font-semibold text-red-900">
                          {formatCurrency(results.progressiveTax)}
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-sm text-yellow-600">지방소득세</div>
                        <div className="text-base font-semibold text-yellow-900">
                          {formatCurrency(results.localIncomeTax)}
                        </div>
                      </div>
                    </div>

                    {/* 추가납부 또는 환급 */}
                    {results.additionalTax > 0 && (
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <div className="text-sm text-orange-600 font-medium">추가납부세액</div>
                        <div className="text-xl font-bold text-orange-900">
                          {formatCurrency(results.additionalTax)}
                        </div>
                      </div>
                    )}

                    {results.refundTax > 0 && (
                      <div className="bg-cyan-50 p-4 rounded-xl">
                        <div className="text-sm text-cyan-600 font-medium">환급세액</div>
                        <div className="text-xl font-bold text-cyan-900">
                          {formatCurrency(results.refundTax)}
                        </div>
                      </div>
                    )}

                    {/* 세율 정보 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Percent className="w-4 h-4 mr-1" />
                          실효세율
                        </div>
                        <div className="text-base font-semibold text-gray-900">
                          {results.effectiveRate.toFixed(2)}%
                        </div>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <div className="text-sm text-indigo-600 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          한계세율
                        </div>
                        <div className="text-base font-semibold text-indigo-900">
                          {results.marginalRate.toFixed(1)}%
                        </div>
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
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      저장
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