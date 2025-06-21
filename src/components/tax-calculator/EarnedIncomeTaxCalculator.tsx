'use client';

import React, { useState, useEffect } from 'react';
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
  User,
  DollarSign,
  TrendingDown,
  Info,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  Users,
  RotateCcw
} from 'lucide-react';
import { EarnedIncomeTaxInput, EarnedIncomeTaxResult } from '@/types/tax-calculator.types';
import { EarnedIncomeTaxCalculator, TaxInputValidator } from '@/lib/utils/tax-calculations';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { DEDUCTION_LIMITS_2024 } from '@/constants/tax-rates-2024';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorWrapper } from '@/components/ui/calculator-wrapper';
import { InputGuide } from '@/components/ui/input-guide';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// 계산 단계 정의
const calculatorSteps = [
  {
    id: 'basic-info',
    title: '기본 정보 입력',
    description: '연봉, 근무형태 등 기본 정보를 입력하세요'
  },
  {
    id: 'deductions',
    title: '소득공제 입력',
    description: '부양가족, 보험료 등 소득공제 항목을 입력하세요'
  },
  {
    id: 'tax-credits',
    title: '세액공제 입력',
    description: '월세액, 기부금 등 세액공제 항목을 입력하세요'
  },
  {
    id: 'results',
    title: '계산 결과',
    description: '세금 계산 결과를 확인하세요'
  }
];

// 입력값 인터페이스
interface TaxCalculationData {
  // 기본 정보
  annualSalary: number;
  employmentType: string;
  workingMonths: number;
  
  // 소득공제
  dependents: number;
  elderlyDependents: number;
  disabledDependents: number;
  nationalPension: number;
  healthInsurance: number;
  employmentInsurance: number;
  
  // 세액공제
  rentExpense: number;
  donations: number;
  medicalExpense: number;
  
  // 계산 결과
  results?: {
    grossIncome: number;
    totalDeductions: number;
    taxableIncome: number;
    calculatedTax: number;
    totalTaxCredits: number;
    finalTax: number;
    monthlyTakeHome: number;
    annualTakeHome: number;
  };
}

// 입력값 검증 함수
const validateStep = (step: number, data: TaxCalculationData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  switch (step) {
    case 0: // 기본 정보
      if (!data.annualSalary || data.annualSalary <= 0) {
        errors.push('연봉을 정확히 입력해주세요');
      }
      if (!data.employmentType) {
        errors.push('근무형태를 선택해주세요');
      }
      if (!data.workingMonths || data.workingMonths <= 0 || data.workingMonths > 12) {
        errors.push('근무개월수는 1~12개월 사이여야 합니다');
      }
      break;
    case 1: // 소득공제
      if (data.dependents < 0) {
        errors.push('부양가족 수는 0 이상이어야 합니다');
      }
      break;
    case 2: // 세액공제
      if (data.rentExpense < 0) {
        errors.push('월세액은 0 이상이어야 합니다');
      }
      break;
  }
  
  return { isValid: errors.length === 0, errors };
};

// 세금 계산 함수
const calculateTax = (data: TaxCalculationData): TaxCalculationData['results'] => {
  const { annualSalary, dependents, elderlyDependents, disabledDependents } = data;
  
  // 근로소득공제 (2024년 기준)
  let earnedIncomeDeduction = 0;
  if (annualSalary <= 5000000) {
    earnedIncomeDeduction = annualSalary * 0.7;
  } else if (annualSalary <= 15000000) {
    earnedIncomeDeduction = 3500000 + (annualSalary - 5000000) * 0.4;
  } else if (annualSalary <= 45000000) {
    earnedIncomeDeduction = 7500000 + (annualSalary - 15000000) * 0.15;
  } else if (annualSalary <= 100000000) {
    earnedIncomeDeduction = 12000000 + (annualSalary - 45000000) * 0.05;
  } else {
    earnedIncomeDeduction = 14750000 + (annualSalary - 100000000) * 0.02;
  }
  
  // 인적공제
  const personalDeduction = (1 + dependents + elderlyDependents + disabledDependents) * 1500000;
  const additionalDeduction = elderlyDependents * 1000000 + disabledDependents * 2000000;
  
  // 사회보험료 (추정치)
  const socialInsurance = annualSalary * 0.087; // 국민연금 4.5% + 건강보험 3.545% + 고용보험 0.9%
  
  // 표준공제 (건보료, 국민연금 등)
  const standardDeduction = Math.max(socialInsurance, 1300000); // 최소 130만원
  
  const totalDeductions = earnedIncomeDeduction + personalDeduction + additionalDeduction + standardDeduction;
  const taxableIncome = Math.max(0, annualSalary - totalDeductions);
  
  // 종합소득세 계산 (2024년 기준)
  let calculatedTax = 0;
  if (taxableIncome <= 14000000) {
    calculatedTax = taxableIncome * 0.06;
  } else if (taxableIncome <= 50000000) {
    calculatedTax = 840000 + (taxableIncome - 14000000) * 0.15;
  } else if (taxableIncome <= 88000000) {
    calculatedTax = 6240000 + (taxableIncome - 50000000) * 0.24;
  } else if (taxableIncome <= 150000000) {
    calculatedTax = 15360000 + (taxableIncome - 88000000) * 0.35;
  } else if (taxableIncome <= 300000000) {
    calculatedTax = 37060000 + (taxableIncome - 150000000) * 0.38;
  } else if (taxableIncome <= 500000000) {
    calculatedTax = 94060000 + (taxableIncome - 300000000) * 0.40;
  } else if (taxableIncome <= 1000000000) {
    calculatedTax = 174060000 + (taxableIncome - 500000000) * 0.42;
  } else {
    calculatedTax = 384060000 + (taxableIncome - 1000000000) * 0.45;
  }
  
  // 지방소득세 (소득세의 10%)
  const localIncomeTax = calculatedTax * 0.1;
  
  // 세액공제
  const totalTaxCredits = Math.min(data.rentExpense * 12 * 0.12, 750000) + // 월세 세액공제
                         Math.min(data.donations, taxableIncome * 0.3) * 0.15 + // 기부금 세액공제
                         Math.min(data.medicalExpense, Math.max(0, annualSalary * 0.03)) * 0.15; // 의료비 세액공제
  
  const finalTax = Math.max(0, calculatedTax + localIncomeTax - totalTaxCredits);
  const annualTakeHome = annualSalary - finalTax;
  const monthlyTakeHome = annualTakeHome / 12;
  
  return {
    grossIncome: annualSalary,
    totalDeductions,
    taxableIncome,
    calculatedTax: calculatedTax + localIncomeTax,
    totalTaxCredits,
    finalTax,
    monthlyTakeHome,
    annualTakeHome
  };
};

export default function EarnedIncomeTaxCalculatorComponent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [data, setData] = useState<TaxCalculationData>({
    annualSalary: 0,
    employmentType: '',
    workingMonths: 12,
    dependents: 0,
    elderlyDependents: 0,
    disabledDependents: 0,
    nationalPension: 0,
    healthInsurance: 0,
    employmentInsurance: 0,
    rentExpense: 0,
    donations: 0,
    medicalExpense: 0
  });
  
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] }>({
    isValid: false,
    errors: []
  });

  // 현재 단계 검증
  useEffect(() => {
    const result = validateStep(currentStep, data);
    setValidation(result);
  }, [currentStep, data]);

  // 데이터 업데이트 함수
  const updateData = (field: keyof TaxCalculationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // 계산 실행
  const handleCalculate = () => {
    const results = calculateTax(data);
    setData(prev => ({ ...prev, results }));
    setShowResults(true);
  };

  // 🔥 초기화 함수
  const resetAllData = () => {
    const confirmReset = window.confirm('모든 입력값을 초기화하시겠습니까?');
    if (confirmReset) {
      setData({
        annualSalary: 0,
        employmentType: '',
        workingMonths: 12,
        dependents: 0,
        elderlyDependents: 0,
        disabledDependents: 0,
        nationalPension: 0,
        healthInsurance: 0,
        employmentInsurance: 0,
        rentExpense: 0,
        donations: 0,
        medicalExpense: 0
      });
      setCurrentStep(0);
      setShowResults(false);
      console.log('근로소득세 계산기가 초기화되었습니다.');
    }
  };

  // 결과 컴포넌트
  const ResultsComponent = () => {
    if (!data.results) return null;
    
    const { results } = data;
    const taxRate = (results.finalTax / results.grossIncome * 100).toFixed(1);
    const takeHomeRate = (results.annualTakeHome / results.grossIncome * 100).toFixed(1);
    
    return (
      <div className="space-y-6">
        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">월 실수령액</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {results.monthlyTakeHome.toLocaleString()}원
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">총 세금</p>
                  <p className="text-2xl font-bold text-red-900">
                    {results.finalTax.toLocaleString()}원
                  </p>
                  <p className="text-xs text-red-600">실효세율: {taxRate}%</p>
                </div>
                <Calculator className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">연 실수령액</p>
                  <p className="text-2xl font-bold text-green-900">
                    {results.annualTakeHome.toLocaleString()}원
                  </p>
                  <p className="text-xs text-green-600">수령률: {takeHomeRate}%</p>
                </div>
                <TrendingDown className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 상세 계산 내역 */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              상세 계산 내역
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">연간 총소득</span>
                <span className="font-medium">{results.grossIncome.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">총 소득공제</span>
                <span className="font-medium text-blue-600">-{results.totalDeductions.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">과세표준</span>
                <span className="font-medium">{results.taxableIncome.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">산출세액</span>
                <span className="font-medium text-red-600">{results.calculatedTax.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">총 세액공제</span>
                <span className="font-medium text-green-600">-{results.totalTaxCredits.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 font-bold">
                <span>최종 납부세액</span>
                <span className="text-red-600">{results.finalTax.toLocaleString()}원</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 절세 팁 */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              절세 팁
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• 연말정산 시 누락된 소득공제 항목을 꼼꼼히 확인하세요</li>
              <li>• 월세 거주자는 월세액 세액공제(연 최대 75만원)를 놓치지 마세요</li>
              <li>• 의료비, 기부금 등 세액공제 항목을 적극 활용하세요</li>
              <li>• 부양가족 등록 시 소득요건을 확인하여 공제 혜택을 받으세요</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  // 단계별 입력 폼 렌더링
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // 기본 정보
        return (
          <div className="space-y-6">
            <InputGuide
              label="연간 총급여액(세전)"
              description="연말정산 급여명세서상의 총급여액을 입력하세요"
              required
              value={data.annualSalary}
              unit="원"
              example="5,000만원"
              hint="보너스, 상여금 포함 연간 총액을 입력하세요"
              error={!data.annualSalary ? validation.errors.find(e => e.includes('연봉')) : undefined}
              success={data.annualSalary > 0 ? '입력 완료' : undefined}
            >
              <Input
                type="number"
                placeholder="예: 50000000"
                value={data.annualSalary || ''}
                onChange={(e) => updateData('annualSalary', Number(e.target.value))}
                className="text-right"
              />
            </InputGuide>

            <InputGuide
              label="근무형태"
              description="현재 근무하고 있는 형태를 선택하세요"
              required
              value={data.employmentType}
              error={!data.employmentType ? validation.errors.find(e => e.includes('근무형태')) : undefined}
              success={data.employmentType ? '선택 완료' : undefined}
            >
              <Select value={data.employmentType} onValueChange={(value) => updateData('employmentType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="근무형태를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">정규직</SelectItem>
                  <SelectItem value="contract">계약직</SelectItem>
                  <SelectItem value="temporary">임시직</SelectItem>
                  <SelectItem value="daily">일용직</SelectItem>
                </SelectContent>
              </Select>
            </InputGuide>

            <InputGuide
              label="근무개월수"
              description="해당 연도에 근무한 개월수를 입력하세요"
              required
              value={data.workingMonths}
              unit="개월"
              hint="신입사원이나 중도입사자는 실제 근무개월수를 입력하세요"
              error={validation.errors.find(e => e.includes('근무개월수'))}
              success={data.workingMonths > 0 && data.workingMonths <= 12 ? '입력 완료' : undefined}
            >
              <Input
                type="number"
                min="1"
                max="12"
                placeholder="12"
                value={data.workingMonths || ''}
                onChange={(e) => updateData('workingMonths', Number(e.target.value))}
              />
            </InputGuide>
          </div>
        );

      case 1: // 소득공제
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5" />
                인적공제 정보
              </h3>
              <p className="text-sm text-blue-700">
                부양가족 1명당 연 150만원 소득공제 혜택을 받을 수 있습니다.
              </p>
            </div>

            <InputGuide
              label="일반 부양가족 수"
              description="만 20세 이하 직계비속, 만 60세 이상 직계존속 등"
              value={data.dependents}
              unit="명"
              hint="연간 소득 100만원 이하인 부양가족만 해당"
              example="배우자, 자녀, 부모님 등"
            >
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={data.dependents || ''}
                onChange={(e) => updateData('dependents', Number(e.target.value))}
              />
            </InputGuide>

            <InputGuide
              label="만 70세 이상 부양가족 수"
              description="추가공제 100만원이 적용됩니다"
              value={data.elderlyDependents}
              unit="명"
              hint="경로우대 추가공제 대상"
            >
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={data.elderlyDependents || ''}
                onChange={(e) => updateData('elderlyDependents', Number(e.target.value))}
              />
            </InputGuide>

            <InputGuide
              label="장애인 부양가족 수"
              description="추가공제 200만원이 적용됩니다"
              value={data.disabledDependents}
              unit="명"
              hint="장애인등록증 또는 장애인증명서 보유자"
            >
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={data.disabledDependents || ''}
                onChange={(e) => updateData('disabledDependents', Number(e.target.value))}
              />
            </InputGuide>
          </div>
        );

      case 2: // 세액공제
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                세액공제 정보
              </h3>
              <p className="text-sm text-green-700">
                세액공제는 계산된 세금에서 직접 차감되어 절세 효과가 큽니다.
              </p>
            </div>

            <InputGuide
              label="월세액"
              description="월세 거주자의 경우 연간 월세액의 12% 세액공제"
              value={data.rentExpense}
              unit="원/월"
              hint="연 최대 75만원까지 공제 가능"
              example="80만원"
            >
              <Input
                type="number"
                placeholder="800000"
                value={data.rentExpense || ''}
                onChange={(e) => updateData('rentExpense', Number(e.target.value))}
                className="text-right"
              />
            </InputGuide>

            <InputGuide
              label="기부금액"
              description="연간 기부한 총액 (종교단체, 사회복지법인 등)"
              value={data.donations}
              unit="원"
              hint="소득의 30% 한도 내에서 15% 세액공제"
            >
              <Input
                type="number"
                placeholder="1000000"
                value={data.donations || ''}
                onChange={(e) => updateData('donations', Number(e.target.value))}
                className="text-right"
              />
            </InputGuide>

            <InputGuide
              label="의료비"
              description="본인 및 부양가족의 의료비 (총급여의 3% 초과분)"
              value={data.medicalExpense}
              unit="원"
              hint="초과분에 대해 15% 세액공제"
            >
              <Input
                type="number"
                placeholder="2000000"
                value={data.medicalExpense || ''}
                onChange={(e) => updateData('medicalExpense', Number(e.target.value))}
                className="text-right"
              />
            </InputGuide>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <CalculatorWrapper
      title="근로소득세 계산기"
      description="2024년 세율 기준 정확한 근로소득세 계산"
      icon={User}
      steps={calculatorSteps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onCalculate={handleCalculate}
      showResults={showResults}
      results={<ResultsComponent />}
      canCalculate={validation.isValid}
      onBack={() => {
        setShowResults(false);
        setCurrentStep(0);
      }}
    >
      {renderStepContent()}
      
      {/* 검증 오류 표시 */}
      {validation.errors.length > 0 && (
        <Card className="border-red-200 bg-red-50 mt-4">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 mb-2">입력값을 확인해주세요</h4>
                <ul className="space-y-1 text-sm text-red-700">
                  {validation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 🔥 초기화 버튼 */}
      {!showResults && (
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAllData}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
        </div>
      )}


    </CalculatorWrapper>
  );
} 