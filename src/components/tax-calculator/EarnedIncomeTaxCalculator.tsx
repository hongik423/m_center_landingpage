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

// 세금 계산 함수 - 2024년 기준 정확한 계산 로직
const calculateTax = (data: TaxCalculationData): TaxCalculationData['results'] => {
  const { annualSalary, dependents, elderlyDependents, disabledDependents } = data;
  
  // 🔥 1. 근로소득공제 (2024년 기준) - 정수로 반올림
  let earnedIncomeDeduction = 0;
  if (annualSalary <= 5000000) {
    earnedIncomeDeduction = Math.round(annualSalary * 0.7);
  } else if (annualSalary <= 15000000) {
    earnedIncomeDeduction = Math.round(3500000 + (annualSalary - 5000000) * 0.4);
  } else if (annualSalary <= 45000000) {
    earnedIncomeDeduction = Math.round(7500000 + (annualSalary - 15000000) * 0.15);
  } else if (annualSalary <= 100000000) {
    earnedIncomeDeduction = Math.round(12000000 + (annualSalary - 45000000) * 0.05);
  } else {
    earnedIncomeDeduction = Math.round(14750000 + (annualSalary - 100000000) * 0.02);
  }
  
  // 🔥 2. 인적공제 (2024년 기준)
  const personalDeduction = (1 + dependents + elderlyDependents + disabledDependents) * 1500000;
  const additionalDeduction = elderlyDependents * 1000000 + disabledDependents * 2000000;
  
  // 🔥 3. 사회보험료 공제 (2024년 기준 - 상한선 적용)
  const nationalPensionLimit = 5130000; // 연 513만원 상한
  const nationalPension = Math.min(Math.round(annualSalary * 0.045), nationalPensionLimit);
  
  const healthInsurance = Math.round(annualSalary * 0.03545); // 건강보험 3.545%
  const employmentInsurance = Math.round(annualSalary * 0.009); // 고용보험 0.9%
  
  const totalSocialInsurance = nationalPension + healthInsurance + employmentInsurance;
  
  // 🔥 4. 표준공제 (사회보험료 포함하지 않음)
  const standardDeduction = 1300000; // 기본 130만원
  
  // 🔥 5. 특별공제 (여기서는 기본값만 적용)
  const specialDeduction = 0; // 추후 확장 가능
  
  // 🔥 6. 기타공제 (개인연금저축공제 등)
  const otherDeductions = 0; // 추후 확장 가능
  
  const totalDeductions = earnedIncomeDeduction + personalDeduction + additionalDeduction + 
                         totalSocialInsurance + standardDeduction + specialDeduction + otherDeductions;
  
  const taxableIncome = Math.max(0, annualSalary - totalDeductions);
  
  // 🔥 7. 종합소득세 계산 (2024년 기준) - 정수로 반올림
  let incomeTax = 0;
  if (taxableIncome <= 14000000) {
    incomeTax = Math.round(taxableIncome * 0.06);
  } else if (taxableIncome <= 50000000) {
    incomeTax = Math.round(840000 + (taxableIncome - 14000000) * 0.15);
  } else if (taxableIncome <= 88000000) {
    incomeTax = Math.round(6240000 + (taxableIncome - 50000000) * 0.24);
  } else if (taxableIncome <= 150000000) {
    incomeTax = Math.round(15360000 + (taxableIncome - 88000000) * 0.35);
  } else if (taxableIncome <= 300000000) {
    incomeTax = Math.round(37060000 + (taxableIncome - 150000000) * 0.38);
  } else if (taxableIncome <= 500000000) {
    incomeTax = Math.round(94060000 + (taxableIncome - 300000000) * 0.40);
  } else if (taxableIncome <= 1000000000) {
    incomeTax = Math.round(174060000 + (taxableIncome - 500000000) * 0.42);
  } else {
    incomeTax = Math.round(384060000 + (taxableIncome - 1000000000) * 0.45);
  }
  
  // 🔥 8. 지방소득세 (소득세의 10%) - 정수로 반올림
  const localIncomeTax = Math.round(incomeTax * 0.1);
  
  // 🔥 9. 세액공제 (2024년 기준) - 정수로 반올림
  const rentCredit = Math.min(Math.round(data.rentExpense * 12 * 0.12), 750000); // 월세 세액공제 최대 75만원
  
  const donationCredit = Math.round(Math.min(data.donations, taxableIncome * 0.3) * 0.15); // 기부금 세액공제
  
  // 🔥 의료비 세액공제 수정: 총급여의 3% 초과분에 대해 15% 공제
  const medicalThreshold = Math.round(annualSalary * 0.03);
  const medicalDeductible = Math.max(0, data.medicalExpense - medicalThreshold);
  const medicalCredit = Math.round(medicalDeductible * 0.15);
  
  const totalTaxCredits = rentCredit + donationCredit + medicalCredit;
  
  const totalTax = incomeTax + localIncomeTax;
  const finalTax = Math.max(0, totalTax - totalTaxCredits);
  const annualTakeHome = annualSalary - finalTax - totalSocialInsurance; // 사회보험료도 차감
  const monthlyTakeHome = Math.round(annualTakeHome / 12);
  
  return {
    grossIncome: annualSalary,
    totalDeductions,
    taxableIncome,
    calculatedTax: totalTax,
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
                    {Math.round(results.monthlyTakeHome).toLocaleString('ko-KR')}원
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
                    {Math.round(results.finalTax).toLocaleString('ko-KR')}원
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
                    {Math.round(results.annualTakeHome).toLocaleString('ko-KR')}원
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
                <span className="font-medium">{Math.round(results.grossIncome).toLocaleString('ko-KR')}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">총 소득공제</span>
                <span className="font-medium text-blue-600">-{Math.round(results.totalDeductions).toLocaleString('ko-KR')}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">과세표준</span>
                <span className="font-medium">{Math.round(results.taxableIncome).toLocaleString('ko-KR')}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">산출세액</span>
                <span className="font-medium text-red-600">{Math.round(results.calculatedTax).toLocaleString('ko-KR')}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">총 세액공제</span>
                <span className="font-medium text-green-600">-{Math.round(results.totalTaxCredits).toLocaleString('ko-KR')}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 font-bold">
                <span>최종 납부세액</span>
                <span className="text-red-600">{Math.round(results.finalTax).toLocaleString('ko-KR')}원</span>
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
            <NumberInput
              label="연간 총급여액(세전) *"
              value={data.annualSalary}
              onChange={(value) => updateData('annualSalary', value)}
              placeholder="예: 50,000,000"
              suffix="원"
              min={0}
              required={true}
              error={!data.annualSalary ? validation.errors.find(e => e.includes('연봉')) : undefined}
            />

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

            <NumberInput
              label="근무개월수 *"
              value={data.workingMonths}
              onChange={(value) => updateData('workingMonths', value)}
              placeholder="12"
              suffix="개월"
              min={1}
              max={12}
              required={true}
              error={validation.errors.find(e => e.includes('근무개월수'))}
            />
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

            <NumberInput
              label="일반 부양가족 수"
              value={data.dependents}
              onChange={(value) => updateData('dependents', value)}
              placeholder="0"
              suffix="명"
              min={0}
            />

            <NumberInput
              label="만 70세 이상 부양가족 수"
              value={data.elderlyDependents}
              onChange={(value) => updateData('elderlyDependents', value)}
              placeholder="0"
              suffix="명"
              min={0}
            />

            <NumberInput
              label="장애인 부양가족 수"
              value={data.disabledDependents}
              onChange={(value) => updateData('disabledDependents', value)}
              placeholder="0"
              suffix="명"
              min={0}
            />
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

            <NumberInput
              label="월세액 💰"
              value={data.rentExpense}
              onChange={(value) => updateData('rentExpense', value)}
              placeholder="800,000"
              suffix="원/월"
              min={0}
            />

            <NumberInput
              label="기부금액 🤲"
              value={data.donations}
              onChange={(value) => updateData('donations', value)}
              placeholder="1,000,000"
              suffix="원/년"
              min={0}
            />

            <NumberInput
              label="의료비 🏥"
              value={data.medicalExpense}
              onChange={(value) => updateData('medicalExpense', value)}
              placeholder="2,000,000"
              suffix="원/년"
              min={0}
            />
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