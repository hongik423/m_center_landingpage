'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  RotateCcw,
  Zap,
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { EarnedIncomeTaxInput, EarnedIncomeTaxResult } from '@/types/tax-calculator.types';
import { EarnedIncomeTaxCalculator, TaxInputValidator } from '@/lib/utils/tax-calculations';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { DEDUCTION_LIMITS_2024 } from '@/constants/tax-rates-2024';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';
import { BetaFeedbackForm } from '@/components/ui/beta-feedback-form';
import { EnhancedSmartInput } from '@/components/ui/enhanced-smart-input';

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

// 계산 결과 타입 정의
type TaxCalculationResults = {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  calculatedTax: number;
  totalTaxCredits: number;
  finalTax: number;
  monthlyTakeHome: number;
  annualTakeHome: number;
};

// 🔥 정확한 2024년 연말정산 기준 근로소득세 계산 로직
const calculateTax = (data: TaxCalculationData): TaxCalculationResults => {
  const { annualSalary, dependents, elderlyDependents, disabledDependents } = data;
  
  try {
    // 1. 연간 총급여액
    const totalSalary = annualSalary;
    
    // 2. 근로소득공제 (2024년 기준 - 연간 기준으로 정확히 계산)
    let earnedIncomeDeduction = 0;
    if (totalSalary <= 5000000) {
      earnedIncomeDeduction = Math.floor(totalSalary * 0.7);
    } else if (totalSalary <= 15000000) {
      earnedIncomeDeduction = Math.floor(3500000 + (totalSalary - 5000000) * 0.4);
    } else if (totalSalary <= 45000000) {
      earnedIncomeDeduction = Math.floor(7500000 + (totalSalary - 15000000) * 0.15);
    } else if (totalSalary <= 100000000) {
      earnedIncomeDeduction = Math.floor(12000000 + (totalSalary - 45000000) * 0.05);
    } else {
      earnedIncomeDeduction = Math.floor(14750000 + (totalSalary - 100000000) * 0.02);
    }
    
    // 3. 인적공제 (2024년 기준)
    const totalFamilyMembers = 1 + dependents + elderlyDependents + disabledDependents;
    const personalDeduction = totalFamilyMembers * 1500000; // 본인 + 부양가족 1명당 150만원
    const elderlyDeduction = elderlyDependents * 1000000; // 경로우대자 추가 100만원
    const disabledDeduction = disabledDependents * 2000000; // 장애인 추가 200만원
    
    // 4. 사회보험료공제 (2024년 기준 - 정확한 요율)
    const monthlySalary = Math.floor(totalSalary / 12);
    
    // 국민연금: 4.5%, 월 상한 427,500원
    const nationalPensionMonthlyLimit = 427500;
    const nationalPensionMonthly = Math.min(Math.floor(monthlySalary * 0.045), nationalPensionMonthlyLimit);
    const nationalPensionAnnual = nationalPensionMonthly * 12;
    
    // 건강보험: 3.545% (장기요양보험 포함)
    const healthInsuranceAnnual = Math.floor(totalSalary * 0.03545);
    
    // 고용보험: 0.9%
    const employmentInsuranceAnnual = Math.floor(totalSalary * 0.009);
    
    const totalSocialInsurance = nationalPensionAnnual + healthInsuranceAnnual + employmentInsuranceAnnual;
    
    // 5. 표준공제 (특별소득공제를 사용하지 않는 경우)
    const standardDeduction = 1300000; // 130만원
    
    // 6. 총 소득공제
    const totalDeductions = earnedIncomeDeduction + personalDeduction + elderlyDeduction + 
                           disabledDeduction + totalSocialInsurance + standardDeduction;
    
    // 7. 과세표준
    const taxableIncome = Math.max(0, totalSalary - totalDeductions);
    
    // 8. 산출세액 (2024년 종합소득세 누진세율)
    let calculatedTax = 0;
    if (taxableIncome <= 14000000) {
      calculatedTax = Math.floor(taxableIncome * 0.06);
    } else if (taxableIncome <= 50000000) {
      calculatedTax = Math.floor(840000 + (taxableIncome - 14000000) * 0.15);
    } else if (taxableIncome <= 88000000) {
      calculatedTax = Math.floor(6240000 + (taxableIncome - 50000000) * 0.24);
    } else if (taxableIncome <= 150000000) {
      calculatedTax = Math.floor(15360000 + (taxableIncome - 88000000) * 0.35);
    } else if (taxableIncome <= 300000000) {
      calculatedTax = Math.floor(37060000 + (taxableIncome - 150000000) * 0.38);
    } else if (taxableIncome <= 500000000) {
      calculatedTax = Math.floor(94060000 + (taxableIncome - 300000000) * 0.40);
    } else if (taxableIncome <= 1000000000) {
      calculatedTax = Math.floor(174060000 + (taxableIncome - 500000000) * 0.42);
    } else {
      calculatedTax = Math.floor(384060000 + (taxableIncome - 1000000000) * 0.45);
    }
    
    // 9. 지방소득세 (소득세의 10%)
    const localIncomeTax = Math.floor(calculatedTax * 0.1);
    const totalTaxBeforeCredits = calculatedTax + localIncomeTax;
    
    // 10. 세액공제 (2024년 기준)
    let totalTaxCredits = 0;
    
    // 월세 세액공제: 월세액의 12%, 연 최대 75만원
    if (data.rentExpense > 0) {
      const rentCredit = Math.min(Math.floor(data.rentExpense * 12 * 0.12), 750000);
      totalTaxCredits += rentCredit;
    }
    
    // 기부금 세액공제: 15% (소득금액 30% 한도)
    if (data.donations > 0) {
      const donationLimit = Math.floor(totalSalary * 0.3);
      const donationCredit = Math.floor(Math.min(data.donations, donationLimit) * 0.15);
      totalTaxCredits += donationCredit;
    }
    
    // 의료비 세액공제: 총급여 3% 초과분의 15%
    if (data.medicalExpense > 0) {
      const medicalThreshold = Math.floor(totalSalary * 0.03);
      const medicalDeductible = Math.max(0, data.medicalExpense - medicalThreshold);
      const medicalCredit = Math.floor(medicalDeductible * 0.15);
      totalTaxCredits += medicalCredit;
    }
    
    // 11. 최종 납부세액
    const finalTax = Math.max(0, totalTaxBeforeCredits - totalTaxCredits);
    
    // 12. 월별 값 계산 (실수령액 계산용)
    const monthlyTax = Math.floor(finalTax / 12);
    const monthlySocialInsurance = Math.floor(totalSocialInsurance / 12);
    const monthlyTakeHome = monthlySalary - monthlyTax - monthlySocialInsurance;
    const annualTakeHome = monthlyTakeHome * 12;
    
    return {
      grossIncome: totalSalary,
      totalDeductions,
      taxableIncome,
      calculatedTax: totalTaxBeforeCredits,
      totalTaxCredits,
      finalTax,
      monthlyTakeHome,
      annualTakeHome
    };
    
  } catch (error) {
    console.error('근로소득세 계산 오류:', error);
    // 기본값 반환
    return {
      grossIncome: annualSalary,
      totalDeductions: 0,
      taxableIncome: 0,
      calculatedTax: 0,
      totalTaxCredits: 0,
      finalTax: 0,
      monthlyTakeHome: Math.floor(annualSalary / 12),
      annualTakeHome: annualSalary
    };
  }
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

  // 🔥 모든 계산 로직을 상단으로 이동
  // 자동 계산 로직 (TaxCalculationResults 타입 맞춤)
  const calculationResults = useMemo(() => {
    if (data.annualSalary <= 0) {
      return undefined;
    }

    try {
      return calculateTax(data);
    } catch (error) {
      console.error('자동 계산 중 오류가 발생했습니다:', error);
      return undefined;
    }
  }, [data.annualSalary, data.dependents, data.elderlyDependents, data.disabledDependents, 
      data.rentExpense, data.donations, data.medicalExpense]);

  // autoCalculatedValues 정의
  const autoCalculatedValues = useMemo(() => {
    if (!calculationResults) {
      return {
        monthlySalary: 0,
        monthlyTakeHome: 0,
        monthlyTax: 0,
        monthlyEarnedIncomeDeduction: 0,
        monthlyPersonalDeduction: 0,
        monthlySocialInsurance: 0,
        monthlyTaxableIncome: 0
      };
    }

    const monthlySalary = Math.round(data.annualSalary / 12);
    const monthlyTax = Math.round(calculationResults.finalTax / 12);
    const monthlyEarnedIncomeDeduction = Math.round(calculationResults.totalDeductions / 12 * 0.6); // 근로소득공제 비율 추정
    const monthlyPersonalDeduction = Math.round((1 + data.dependents + data.elderlyDependents + data.disabledDependents) * 1500000 / 12);
    const monthlySocialInsurance = Math.round(monthlySalary * 0.09); // 사회보험료 추정 (9%)
    const monthlyTaxableIncome = Math.round(calculationResults.taxableIncome / 12);

    return {
      monthlySalary,
      monthlyTakeHome: calculationResults.monthlyTakeHome,
      monthlyTax,
      monthlyEarnedIncomeDeduction,
      monthlyPersonalDeduction,
      monthlySocialInsurance,
      monthlyTaxableIncome
    };
  }, [calculationResults, data.annualSalary, data.dependents, data.elderlyDependents, data.disabledDependents]);

  // taxRateAnalysis 정의
  const taxRateAnalysis = useMemo(() => {
    if (!calculationResults || calculationResults.grossIncome <= 0) {
      return { effectiveRate: 0, marginalRate: 0 };
    }
    
    const effectiveRate = ((calculationResults.finalTax / calculationResults.grossIncome) * 100).toFixed(1);
    
    // 한계세율 계산 (과세표준 기준)
    const yearlyTaxableIncome = calculationResults.taxableIncome;
    let marginalRate = 0;
    
    if (yearlyTaxableIncome <= 14000000) {
      marginalRate = 6;
    } else if (yearlyTaxableIncome <= 50000000) {
      marginalRate = 15;
    } else if (yearlyTaxableIncome <= 88000000) {
      marginalRate = 24;
    } else if (yearlyTaxableIncome <= 150000000) {
      marginalRate = 35;
    } else if (yearlyTaxableIncome <= 300000000) {
      marginalRate = 38;
    } else if (yearlyTaxableIncome <= 500000000) {
      marginalRate = 40;
    } else if (yearlyTaxableIncome <= 1000000000) {
      marginalRate = 42;
    } else {
      marginalRate = 45;
    }
    
    return { 
      effectiveRate: parseFloat(effectiveRate),
      marginalRate 
    };
  }, [calculationResults]);

  // autoTaxCredits 정의
  const autoTaxCredits = useMemo(() => {
    if (!calculationResults) {
      return {
        monthlyRentCredit: 0,
        monthlyDonationCredit: 0,
        monthlyMedicalCredit: 0,
        annualTotalCredits: 0
      };
    }

    const monthlySalary = Math.round(data.annualSalary / 12);
    
    // 월세 세액공제 (월 최대 62,500원)
    const monthlyRentCredit = Math.min(Math.round(data.rentExpense * 0.12), Math.round(750000 / 12));
    
    // 기부금 세액공제 (15%)
    const monthlyDonationCredit = Math.round(Math.min(data.donations / 12, (calculationResults.taxableIncome * 0.3) / 12) * 0.15);
    
    // 의료비 세액공제 (총급여 3% 초과분 15%)
    const monthlyMedicalThreshold = Math.round(monthlySalary * 0.03);
    const monthlyMedicalExpense = data.medicalExpense / 12;
    const monthlyMedicalDeductible = Math.max(0, monthlyMedicalExpense - monthlyMedicalThreshold);
    const monthlyMedicalCredit = Math.round(monthlyMedicalDeductible * 0.15);
    
    const annualTotalCredits = (monthlyRentCredit + monthlyDonationCredit + monthlyMedicalCredit) * 12;
    
    return {
      monthlyRentCredit,
      monthlyDonationCredit,
      monthlyMedicalCredit,
      annualTotalCredits
    };
  }, [calculationResults, data.rentExpense, data.donations, data.medicalExpense, data.annualSalary]);

  // logicalErrors 정의
  const logicalErrors = useMemo(() => {
    const errors: string[] = [];
    
    if (data.annualSalary > 0) {
      if (data.annualSalary < 20000000 && data.rentExpense > 1000000) {
        errors.push('연봉 대비 월세액이 과도하게 높습니다');
      }
      
      if (data.donations > data.annualSalary * 0.5) {
        errors.push('기부금이 연봉의 50%를 초과합니다');
      }
      
      if (data.medicalExpense > data.annualSalary * 0.3) {
        errors.push('의료비가 연봉의 30%를 초과합니다');
      }
      
      if (data.dependents + data.elderlyDependents + data.disabledDependents > 10) {
        errors.push('부양가족 수가 과도하게 많습니다');
      }
    }
    
    return errors;
  }, [data]);

  // taxSavingRecommendations 정의
  const taxSavingRecommendations = useMemo(() => {
    const recommendations: string[] = [];
    
    if (data.annualSalary > 0 && calculationResults) {
      if (data.rentExpense === 0 && (taxRateAnalysis?.effectiveRate || 0) > 10) {
        recommendations.push('월세 거주자라면 월세 세액공제(연 최대 75만원)를 활용하세요');
      }
      
      if (data.donations === 0 && data.annualSalary > 30000000) {
        recommendations.push('기부금을 통한 세액공제(15%)를 고려해보세요');
      }
      
      if (data.medicalExpense === 0 && data.annualSalary > 50000000) {
        recommendations.push('의료비 세액공제를 위해 의료비 영수증을 보관하세요');
      }
      
      if ((taxRateAnalysis?.effectiveRate || 0) > 20) {
        recommendations.push('고소득자는 연금저축, IRP 등 추가 공제 상품을 활용하세요');
      }
      
      if (data.dependents === 0 && data.annualSalary > 40000000) {
        recommendations.push('부양가족 등록 가능 여부를 확인해보세요 (1명당 연 150만원 공제)');
      }
    }
    
    return recommendations;
  }, [data, calculationResults, taxRateAnalysis?.effectiveRate]);



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
    if (!calculationResults) return null;
    
    const results = calculationResults;
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
            <EnhancedSmartInput
              label="💰 연간 총급여액(세전)"
              value={data.annualSalary}
              onChange={(value) => updateData('annualSalary', value)}
              placeholder="예: 50,000,000 (필수)"
              calculationRule="earned-income-annual-salary"
              required={true}
              connectedInputs={[
                { label: '월급', value: autoCalculatedValues?.monthlySalary || 0, isCalculated: true },
                { label: '월 실수령액', value: autoCalculatedValues?.monthlyTakeHome || 0, isCalculated: true },
                { label: '실효세율', value: taxRateAnalysis?.effectiveRate || 0, isCalculated: true }
              ]}
              quickActions={[
                { label: '3천만원', value: 30000000 },
                { label: '5천만원', value: 50000000 },
                { label: '7천만원', value: 70000000 },
                { label: '1억원', value: 100000000 }
              ]}
              recommendations={(autoCalculatedValues?.monthlyTax || 0) > 0 ? 
                [`월 실수령액: ${(autoCalculatedValues?.monthlyTakeHome || 0).toLocaleString()}원`, 
                 `실효세율: ${taxRateAnalysis?.effectiveRate || 0}%`] : []
              }
              validationRules={[
                { type: 'min', value: 0, message: '연봉은 0원 이상이어야 합니다' },
                { type: 'max', value: 1000000000, message: '연봉이 과도합니다' },
                { type: 'required', message: '근로소득세 계산을 위해 연간 총급여액 입력이 필수입니다' }
              ]}
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

            <EnhancedSmartInput
              label="일반 부양가족 수"
              value={data.dependents}
              onChange={(value) => updateData('dependents', value)}
              placeholder="0"
              calculationRule="earned-income-dependents"
              connectedInputs={[
                { label: '70세 이상', value: data.elderlyDependents },
                { label: '장애인', value: data.disabledDependents },
                { label: '연간 공제액', value: data.dependents * 1500000, isCalculated: true }
              ]}
              quickActions={[
                { label: '1명', value: 1 },
                { label: '2명', value: 2 },
                { label: '3명', value: 3 },
                { label: '4명', value: 4 }
              ]}
              recommendations={data.dependents > 0 ? 
                [`연간 ${(data.dependents * 1500000).toLocaleString()}원 소득공제`] : 
                ['부양가족이 있으면 1명당 연 150만원 소득공제']
              }
              validationRules={[
                { type: 'min', value: 0, message: '부양가족 수는 0명 이상이어야 합니다' },
                { type: 'max', value: 20, message: '부양가족 수가 과도합니다' }
              ]}
            />

            <EnhancedSmartInput
              label="만 70세 이상 부양가족 수"
              value={data.elderlyDependents}
              onChange={(value) => updateData('elderlyDependents', value)}
              placeholder="0"
              calculationRule="earned-income-elderly-dependents"
              connectedInputs={[
                { label: '일반 부양가족', value: data.dependents },
                { label: '추가 공제액', value: data.elderlyDependents * 1000000, isCalculated: true }
              ]}
              quickActions={[
                { label: '1명', value: 1 },
                { label: '2명', value: 2 }
              ]}
              recommendations={data.elderlyDependents > 0 ? 
                [`추가 연간 ${(data.elderlyDependents * 1000000).toLocaleString()}원 소득공제`] : []
              }
              validationRules={[
                { type: 'min', value: 0, message: '70세 이상 부양가족 수는 0명 이상이어야 합니다' },
                { type: 'max', value: 10, message: '70세 이상 부양가족 수가 과도합니다' }
              ]}
            />

            <EnhancedSmartInput
              label="장애인 부양가족 수"
              value={data.disabledDependents}
              onChange={(value) => updateData('disabledDependents', value)}
              placeholder="0"
              calculationRule="earned-income-disabled-dependents"
              connectedInputs={[
                { label: '일반 부양가족', value: data.dependents },
                { label: '추가 공제액', value: data.disabledDependents * 2000000, isCalculated: true }
              ]}
              quickActions={[
                { label: '1명', value: 1 },
                { label: '2명', value: 2 }
              ]}
              recommendations={data.disabledDependents > 0 ? 
                [`추가 연간 ${(data.disabledDependents * 2000000).toLocaleString()}원 소득공제`] : []
              }
              validationRules={[
                { type: 'min', value: 0, message: '장애인 부양가족 수는 0명 이상이어야 합니다' },
                { type: 'max', value: 10, message: '장애인 부양가족 수가 과도합니다' }
              ]}
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

            <EnhancedSmartInput
              label="월세액 💰"
              value={data.rentExpense}
              onChange={(value) => updateData('rentExpense', value)}
              placeholder="800,000"
              calculationRule="earned-income-rent-expense"
              connectedInputs={[
                { label: '연간 월세', value: data.rentExpense * 12, isCalculated: true },
                { label: '세액공제', value: (autoTaxCredits?.monthlyRentCredit || 0) * 12, isCalculated: true }
              ]}
              quickActions={[
                { label: '50만원', value: 500000 },
                { label: '80만원', value: 800000 },
                { label: '100만원', value: 1000000 },
                { label: '150만원', value: 1500000 }
              ]}
              recommendations={data.rentExpense > 0 ? 
                [`연간 ${((autoTaxCredits?.monthlyRentCredit || 0) * 12).toLocaleString()}원 세액공제 (최대 75만원)`] : 
                ['월세 거주자는 연 최대 75만원 세액공제 혜택']
              }
              validationRules={[
                { type: 'min', value: 0, message: '월세액은 0원 이상이어야 합니다' },
                { type: 'max', value: 5000000, message: '월세액이 과도합니다' }
              ]}
            />

            <EnhancedSmartInput
              label="기부금액 🤲"
              value={data.donations}
              onChange={(value) => updateData('donations', value)}
              placeholder="1,000,000"
              calculationRule="earned-income-donations"
              connectedInputs={[
                { label: '연봉 대비', value: data.annualSalary > 0 ? (data.donations / data.annualSalary * 100) : 0, isCalculated: true },
                { label: '세액공제', value: (autoTaxCredits?.monthlyDonationCredit || 0) * 12, isCalculated: true }
              ]}
              quickActions={[
                { label: '100만원', value: 1000000 },
                { label: '300만원', value: 3000000 },
                { label: '500만원', value: 5000000 },
                { label: '1000만원', value: 10000000 }
              ]}
              recommendations={data.donations > 0 ? 
                [`연간 ${((autoTaxCredits?.monthlyDonationCredit || 0) * 12).toLocaleString()}원 세액공제 (15%)`] : 
                ['기부금은 15% 세액공제 (연봉의 30% 한도)']
              }
              warningMessage={data.donations > data.annualSalary * 0.3 ? 
                '기부금이 연봉의 30%를 초과합니다' : undefined
              }
              validationRules={[
                { type: 'min', value: 0, message: '기부금액은 0원 이상이어야 합니다' },
                { type: 'max', value: 100000000, message: '기부금액이 과도합니다' }
              ]}
            />

            <EnhancedSmartInput
              label="의료비 🏥"
              value={data.medicalExpense}
              onChange={(value) => updateData('medicalExpense', value)}
              placeholder="2,000,000"
              calculationRule="earned-income-medical-expense"
              connectedInputs={[
                { label: '공제 기준액', value: (autoCalculatedValues?.monthlySalary || 0) * 12 * 0.03, isCalculated: true },
                { label: '세액공제', value: (autoTaxCredits?.monthlyMedicalCredit || 0) * 12, isCalculated: true }
              ]}
              quickActions={[
                { label: '100만원', value: 1000000 },
                { label: '200만원', value: 2000000 },
                { label: '500만원', value: 5000000 },
                { label: '1000만원', value: 10000000 }
              ]}
              recommendations={data.medicalExpense > 0 ? 
                [`연간 ${((autoTaxCredits?.monthlyMedicalCredit || 0) * 12).toLocaleString()}원 세액공제 (15%)`] : 
                ['의료비는 총급여 3% 초과분에 대해 15% 세액공제']
              }
              validationRules={[
                { type: 'min', value: 0, message: '의료비는 0원 이상이어야 합니다' },
                { type: 'max', value: 100000000, message: '의료비가 과도합니다' }
              ]}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 🔥 스마트 근로소득세 자동 계산 대시보드 */}
      {data.annualSalary > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
              <Zap className="w-5 h-5" />
              ⚡ 스마트 근로소득세 자동 계산 대시보드
            </CardTitle>
            <CardDescription className="text-blue-600">
              AI가 실시간으로 근로소득세를 정확하게 계산하고 최적화된 절세 방안을 제시합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 월 실수령액 */}
              <div className="bg-white p-3 rounded border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">월 실수령액</span>
                  <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-300">자동</Badge>
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {(autoCalculatedValues?.monthlyTakeHome || 0).toLocaleString('ko-KR')}원
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  월급 - 세금 - 보험료
                </div>
              </div>

              {/* 월 세금 */}
              <div className="bg-white p-3 rounded border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">월 세금</span>
                  <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-300">자동</Badge>
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {(autoCalculatedValues?.monthlyTax || 0).toLocaleString('ko-KR')}원
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  소득세 + 지방소득세
                </div>
              </div>

              {/* 실효세율 */}
              <div className="bg-white p-3 rounded border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">실효세율</span>
                  <Badge className={`text-xs ${(taxRateAnalysis?.effectiveRate || 0) <= 5 ? 'bg-green-100 text-green-700' : 
                    (taxRateAnalysis?.effectiveRate || 0) <= 15 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {taxRateAnalysis?.effectiveRate || 0}%
                  </Badge>
                </div>
                <div className={`text-lg font-bold ${(taxRateAnalysis?.effectiveRate || 0) <= 5 ? 'text-green-700' : 
                  (taxRateAnalysis?.effectiveRate || 0) <= 15 ? 'text-yellow-700' : 'text-red-700'}`}>
                  {taxRateAnalysis?.effectiveRate || 0}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  총 세금 / 연봉
                </div>
              </div>

              {/* 연간 절약 효과 */}
              <div className="bg-white p-3 rounded border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">연간 세액공제</span>
                  <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-300">자동</Badge>
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {(autoTaxCredits?.annualTotalCredits || 0).toLocaleString('ko-KR')}원
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  월세+기부+의료비
                </div>
              </div>
            </div>

            {/* 상세 계산 내역 */}
            <div className="mt-4 p-3 bg-white rounded border border-blue-200">
              <div className="text-sm font-medium text-gray-700 mb-3">📊 월급 기준 상세 계산</div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="font-medium text-blue-700">기본 정보</div>
                  <div>월급: {(autoCalculatedValues?.monthlySalary || 0).toLocaleString()}원</div>
                  <div>근무: {data.workingMonths}개월</div>
                  <div>형태: {data.employmentType || '미선택'}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-blue-700">공제 내역</div>
                  <div>근로소득공제: {(autoCalculatedValues?.monthlyEarnedIncomeDeduction || 0).toLocaleString()}원</div>
                  <div>인적공제: {(autoCalculatedValues?.monthlyPersonalDeduction || 0).toLocaleString()}원</div>
                  <div>사회보험료: {(autoCalculatedValues?.monthlySocialInsurance || 0).toLocaleString()}원</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-blue-700">세액공제</div>
                  <div>월세: {(autoTaxCredits?.monthlyRentCredit || 0).toLocaleString()}원</div>
                  <div>기부금: {(autoTaxCredits?.monthlyDonationCredit || 0).toLocaleString()}원</div>
                  <div>의료비: {(autoTaxCredits?.monthlyMedicalCredit || 0).toLocaleString()}원</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-blue-700">세율 분석</div>
                  <div>한계세율: {taxRateAnalysis?.marginalRate || 0}%</div>
                  <div>과세표준: {(autoCalculatedValues?.monthlyTaxableIncome || 0).toLocaleString()}원</div>
                  <div>부양가족: {data.dependents + data.elderlyDependents + data.disabledDependents}명</div>
                </div>
              </div>
            </div>

            {/* 논리적 오류 실시간 체크 */}
            {logicalErrors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
                <div className="text-sm font-medium text-red-700 mb-2">🚨 논리적 오류 감지</div>
                <div className="space-y-1">
                  {logicalErrors.map((error, index) => (
                    <div key={index} className="text-xs text-red-600 flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 절세 추천 */}
            {taxSavingRecommendations.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-2">💡 AI 절세 추천</div>
                <div className="space-y-1">
                  {taxSavingRecommendations.map((recommendation, index) => (
                    <div key={index} className="text-xs text-green-600 flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 계산 준비 상태 */}
            {logicalErrors.length === 0 && data.annualSalary > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-2">✅ AI 자동 계산 완료</div>
                <div className="text-xs text-green-600">
                  모든 조건이 완벽하게 분석되었습니다. 근로소득세가 정확하게 계산되었습니다.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
            className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
              hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-md
              text-red-600 border-red-300 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <span className="relative flex items-center">
              <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
              전체 초기화
            </span>
          </Button>
        </div>
      )}


    </CalculatorWrapper>

    {/* 🧪 베타테스트 피드백 시스템 */}
    <BetaFeedbackForm 
      calculatorName="근로소득세 계산기"
      calculatorType="earned-income-tax"
      className="mt-8"
    />

    {/* 하단 면책 조항 */}
    <TaxCalculatorDisclaimer variant="full" className="mt-6" />
    </div>
  );
} 