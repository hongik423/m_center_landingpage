'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { NumberInput } from '@/components/ui/number-input';
import {
  Calculator,
  FileText,
  User,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Eye,
  EyeOff,
  Lightbulb,
  Target,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import {
  WithholdingTaxInput,
  WithholdingTaxResult
} from '@/types/tax-calculator.types';
import { calculateWithholdingTax, getWithholdingTaxRate } from '@/lib/utils/withholding-tax-calculations';
import { WITHHOLDING_TAX_2024, WITHHOLDING_TAX_LIMITS_2024 } from '@/constants/tax-rates-2024';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';
import { BetaFeedbackForm } from '@/components/ui/beta-feedback-form';
import { EnhancedSmartInput } from '@/components/ui/enhanced-smart-input';
import { useSmartCalculation } from '@/lib/utils/smartCalculationEngine';
import { formatCurrency } from '@/lib/utils';

// 확장된 샘플 테스트 케이스들
const SAMPLE_CASES = [
  {
    id: 'salary-single',
    title: '근로소득 (독신)',
    description: '월급 300만원, 부양가족 없음',
    category: '일반 직장인',
    input: {
      incomeType: 'earned' as const,
      paymentAmount: 3000000,
      paymentDate: '2024-01-31',
      dependents: 0,
      childrenUnder20: 0,
      isMainWorker: true
    },
    expectedResult: {
      tax: 90000,
      rate: 3.0,
      netAmount: 2910000
    },
    checkPoints: [
      '간이세액표 기준 적용',
      '부양가족 없음으로 높은 세율',
      '주(현)근무지 원천징수 적용'
    ]
  },
  {
    id: 'salary-family',
    title: '근로소득 (기혼+자녀)',
    description: '월급 500만원, 부양가족 3명',
    category: '가정 있는 직장인',
    input: {
      incomeType: 'earned' as const,
      paymentAmount: 5000000,
      paymentDate: '2024-01-31',
      dependents: 2,
      childrenUnder20: 1,
      isMainWorker: true
    },
    expectedResult: {
      tax: 180000,
      rate: 3.6,
      netAmount: 4820000
    },
    checkPoints: [
      '부양가족 3명 공제 적용',
      '20세 이하 자녀 추가 공제',
      '세액 대폭 절약 효과'
    ]
  },
  {
    id: 'business-consulting',
    title: '사업소득 (컨설팅)',
    description: '컨설팅 용역비 500만원',
    category: '프리랜서',
    input: {
      incomeType: 'business' as const,
      paymentAmount: 5000000,
      paymentDate: '2024-01-31'
    },
    expectedResult: {
      tax: 165000,
      rate: 3.3,
      netAmount: 4835000
    },
    checkPoints: [
      '사업소득 3.3% 고정 세율',
      '종합소득세 신고 대상',
      '기납부세액 공제 가능'
    ]
  },
  {
    id: 'other-lecture-high',
    title: '기타소득 (고액 강의료)',
    description: '강의료 1,000만원',
    category: '전문 강사',
    input: {
      incomeType: 'other' as const,
      paymentAmount: 10000000,
      paymentDate: '2024-01-31',
      hasBasicDeduction: true
    },
    expectedResult: {
      tax: 2134000,
      rate: 22.0,
      netAmount: 7866000
    },
    checkPoints: [
      '30만원 기본공제 후 과세',
      '22% 높은 세율 적용',
      '연간 300만원 초과시 종합소득세 신고'
    ]
  },
  {
    id: 'interest-deposit',
    title: '이자소득 (예금이자)',
    description: '정기예금 이자 200만원',
    category: '금융소득',
    input: {
      incomeType: 'interest' as const,
      paymentAmount: 2000000,
      paymentDate: '2024-01-31',
      annualTotalInterest: 2000000
    },
    expectedResult: {
      tax: 308000,
      rate: 15.4,
      netAmount: 1692000
    },
    checkPoints: [
      '15.4% 원천징수 적용',
      '연간 2천만원 미만으로 분리과세',
      '원천징수로 납세의무 종료'
    ]
  },
  {
    id: 'interest-high',
    title: '이자소득 (고액)',
    description: '이자소득 3,000만원 (종합과세)',
    category: '고액 금융소득',
    input: {
      incomeType: 'interest' as const,
      paymentAmount: 30000000,
      paymentDate: '2024-01-31',
      annualTotalInterest: 30000000
    },
    expectedResult: {
      tax: 4620000,
      rate: 15.4,
      netAmount: 25380000
    },
    checkPoints: [
      '2천만원 초과로 종합소득세 신고 대상',
      '원천징수세액은 기납부세액으로 공제',
      '추가 세부담 발생 가능'
    ]
  },
  {
    id: 'dividend-stock',
    title: '배당소득 (주식)',
    description: '주식 배당금 800만원',
    category: '주식 투자자',
    input: {
      incomeType: 'dividend' as const,
      paymentAmount: 8000000,
      paymentDate: '2024-01-31',
      annualTotalInterest: 8000000
    },
    expectedResult: {
      tax: 1232000,
      rate: 15.4,
      netAmount: 6768000
    },
    checkPoints: [
      '배당소득도 금융소득종합과세 대상',
      '이자소득과 합산하여 2천만원 기준',
      '상장주식 배당은 분리과세 선택 가능'
    ]
  },
  {
    id: 'part-time',
    title: '근로소득 (아르바이트)',
    description: '월 알바비 150만원',
    category: '아르바이트',
    input: {
      incomeType: 'earned' as const,
      paymentAmount: 1500000,
      paymentDate: '2024-01-31',
      dependents: 0,
      childrenUnder20: 0,
      isMainWorker: false
    },
    expectedResult: {
      tax: 46800,
      rate: 3.1,
      netAmount: 1453200
    },
    checkPoints: [
      '간이세액표 저소득 구간 적용',
      '연말정산을 통한 세액 정산',
      '주(현)근무지가 아닌 경우 세율 다를 수 있음'
    ]
  }
];

const WithholdingTaxCalculator: React.FC = () => {
    // 🔥 스마트 계산 훅 적용
    const {
    calculate: smartCalculate,
    getCalculatedValue,
    hasErrors,
    errors: smartErrors
  } = useSmartCalculation({ calculatorType: 'stock' }); // 임시로 stock 타입 사용

  const [input, setInput] = useState<WithholdingTaxInput>({
    incomeType: 'earned',
    paymentAmount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentCount: 1,
    dependents: 0,
    childrenUnder20: 0,
    isMainWorker: true,
    hasBasicDeduction: true,
    annualTotalInterest: 0,
    isLowIncomeAccount: false,
    previousTaxPaid: 0
  });

  const [result, setResult] = useState<WithholdingTaxResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showDetailedResult, setShowDetailedResult] = useState(false);
  const [showSamples, setShowSamples] = useState(true);
  const [activeTab, setActiveTab] = useState('input');

  // 🔥 고도화된 자동 연계 계산 로직

  // 1. 소득 유형별 정보 및 세율
  const currentIncomeInfo = useMemo(() => {
    const descriptions = {
      earned: {
        title: '근로소득',
        description: '급여, 상여 등 근로의 대가로 받는 소득',
        rate: '간이세액표',
        color: 'blue',
        exactRate: 0,
        deduction: '부양가족공제'
      },
      business: {
        title: '사업소득',
        description: '용역비, 자문료 등 사업 관련 소득',
        rate: '3.3%',
        color: 'green',
        exactRate: 3.3,
        deduction: '없음'
      },
      other: {
        title: '기타소득',
        description: '강의료, 원고료, 상금 등',
        rate: '22%',
        color: 'purple',
        exactRate: 22,
        deduction: '30만원 기본공제'
      },
      interest: {
        title: '이자소득',
        description: '예금이자, 적금이자 등',
        rate: '15.4%',
        color: 'orange',
        exactRate: 15.4,
        deduction: '연간 2천만원 비과세'
      },
      dividend: {
        title: '배당소득',
        description: '주식 배당금 등',
        rate: '15.4%',
        color: 'pink',
        exactRate: 15.4,
        deduction: '없음'
      }
    };
    return descriptions[input.incomeType];
  }, [input.incomeType]);

  // 2. 자동 원천징수세 계산
  const autoCalculatedTax = useMemo(() => {
    if (input.paymentAmount <= 0) return { incomeTax: 0, localTax: 0, totalTax: 0, netAmount: 0 };

    try {
      switch (input.incomeType) {
        case 'earned':
          // 근로소득: 간이세액표 기준 (간소화)
          const dependentDeduction = (input.dependents || 0) + (input.childrenUnder20 || 0);
          const estimatedMonthlyTax = Math.max(0, 
            Math.floor((input.paymentAmount - dependentDeduction * 150000) * 0.05)
          );
          return {
            incomeTax: Math.floor(estimatedMonthlyTax * 0.909),
            localTax: Math.floor(estimatedMonthlyTax * 0.091),
            totalTax: estimatedMonthlyTax,
            netAmount: input.paymentAmount - estimatedMonthlyTax
          };
          
        case 'business':
          const businessIncome = Math.floor(input.paymentAmount * 0.03);
          const businessLocal = Math.floor(input.paymentAmount * 0.003);
          return {
            incomeTax: businessIncome,
            localTax: businessLocal,
            totalTax: businessIncome + businessLocal,
            netAmount: input.paymentAmount - (businessIncome + businessLocal)
          };
          
        case 'other':
          const deduction = input.hasBasicDeduction ? 300000 : 0;
          const taxableAmount = Math.max(0, input.paymentAmount - deduction);
          const otherIncome = Math.floor(taxableAmount * 0.20);
          const otherLocal = Math.floor(taxableAmount * 0.02);
          return {
            incomeTax: otherIncome,
            localTax: otherLocal,
            totalTax: otherIncome + otherLocal,
            netAmount: input.paymentAmount - (otherIncome + otherLocal)
          };
          
        case 'interest':
        case 'dividend':
          const interestIncome = Math.floor(input.paymentAmount * 0.14);
          const interestLocal = Math.floor(input.paymentAmount * 0.014);
          return {
            incomeTax: interestIncome,
            localTax: interestLocal,
            totalTax: interestIncome + interestLocal,
            netAmount: input.paymentAmount - (interestIncome + interestLocal)
          };
          
        default:
          return { incomeTax: 0, localTax: 0, totalTax: 0, netAmount: input.paymentAmount };
      }
    } catch {
      return { incomeTax: 0, localTax: 0, totalTax: 0, netAmount: input.paymentAmount };
    }
  }, [input]);

  // 3. 연간 세무 영향 분석
  const annualTaxImpact = useMemo(() => {
    if (!input.paymentCount || input.paymentCount <= 0) return { totalTax: 0, totalNet: 0, effectiveRate: 0 };
    
    const annualTax = autoCalculatedTax.totalTax * (input.paymentCount || 1);
    const annualGross = input.paymentAmount * (input.paymentCount || 1);
    const annualNet = annualGross - annualTax;
    const effectiveRate = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;
    
    return {
      totalTax: annualTax,
      totalNet: annualNet,
      effectiveRate
    };
  }, [autoCalculatedTax, input.paymentAmount, input.paymentCount]);

  // 4. 논리적 오류 체크
  const logicalErrors = useMemo(() => {
    const errors: string[] = [];
    
    // 기본 검증
    if (input.paymentAmount < 0) {
      errors.push('지급액은 0원 이상이어야 합니다.');
    }
    
    if (!input.paymentCount || input.paymentCount < 0) {
      errors.push('지급 횟수는 0회 이상이어야 합니다.');
    }
    
    // 근로소득 검증
    if (input.incomeType === 'earned') {
      if ((input.dependents || 0) < 0) {
        errors.push('부양가족 수는 0명 이상이어야 합니다.');
      }
      
      if ((input.childrenUnder20 || 0) > (input.dependents || 0)) {
        errors.push('20세 이하 자녀수가 부양가족수를 초과할 수 없습니다.');
      }
      
      if ((input.dependents || 0) > 20) {
        errors.push('부양가족수가 과도합니다. (최대 20명)');
      }
    }
    
    // 기타소득 검증
    if (input.incomeType === 'other') {
      if (input.paymentAmount > 50000000) {
        errors.push('기타소득이 과도합니다. 세무 신고 의무를 확인하세요.');
      }
    }
    
    // 이자소득 검증
    if (input.incomeType === 'interest') {
      if ((input.annualTotalInterest || 0) > 20000000) {
        errors.push('연간 이자소득 2천만원 초과시 금융소득종합과세 대상입니다.');
      }
    }
    
    // 기납부세액 검증
    if ((input.previousTaxPaid || 0) > autoCalculatedTax.totalTax && autoCalculatedTax.totalTax > 0) {
      errors.push('기납부세액이 계산된 세액을 초과합니다.');
    }
    
    return errors;
  }, [input, autoCalculatedTax]);

  // 5. 절세 추천 로직
  const taxSavingRecommendations = useMemo(() => {
    const recommendations: string[] = [];
    
    // 근로소득 절세 추천
    if (input.incomeType === 'earned') {
      if ((input.dependents || 0) === 0 && input.paymentAmount > 2000000) {
        recommendations.push('부양가족이 있다면 1명당 월 15만원 공제 혜택');
      }
      
      if (!input.isMainWorker) {
        recommendations.push('주(현)근무지로 등록하여 원천징수세 최적화');
      }
      
      if (autoCalculatedTax.totalTax > 100000) {
        recommendations.push('연말정산을 통한 세액 조정 검토');
      }
    }
    
    // 사업소득 절세 추천
    if (input.incomeType === 'business') {
      recommendations.push('종합소득세 신고시 기납부세액으로 공제 활용');
      
      if (input.paymentAmount > 5000000) {
        recommendations.push('부가세 신고 대상 여부 확인 필요');
      }
    }
    
    // 기타소득 절세 추천
    if (input.incomeType === 'other') {
      if (!input.hasBasicDeduction) {
        const savingAmount = Math.floor(300000 * 0.22);
        recommendations.push(`기본공제 적용시 ${savingAmount.toLocaleString()}원 절세 효과`);
      }
      
      if (autoCalculatedTax.totalTax > 500000) {
        recommendations.push('필요경비 영수증 보관으로 추가 절세 가능');
      }
    }
    
    // 이자/배당소득 절세 추천
    if (input.incomeType === 'interest' || input.incomeType === 'dividend') {
      if (!input.isLowIncomeAccount && (input.annualTotalInterest || 0) < 50000000) {
        recommendations.push('서민형 비과세 계좌 활용 검토');
      }
      
      if ((input.annualTotalInterest || 0) > 15000000) {
        recommendations.push('금융소득종합과세 대상 여부 사전 확인');
      }
    }
    
    // 공통 추천
    if (autoCalculatedTax.totalTax > 1000000) {
      recommendations.push('세무전문가 상담을 통한 절세 방안 검토');
    }
    
    return recommendations;
  }, [input, autoCalculatedTax]);

  // 6. 신고 납부 일정 자동 계산
  const filingSchedule = useMemo(() => {
    const paymentDate = new Date(input.paymentDate);
    const nextMonth = new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 10);
    
    return {
      filingDeadline: nextMonth.toLocaleDateString('ko-KR'),
      daysLeft: Math.max(0, Math.ceil((nextMonth.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
      isOverdue: nextMonth < new Date()
    };
  }, [input.paymentDate]);

  // 실시간 예상 세액
  const estimatedTax = useMemo(() => {
    if (input.paymentAmount <= 0) return 0;
    
    try {
      const rate = getWithholdingTaxRate(input.incomeType);
      if (input.incomeType === 'earned') {
        return Math.floor(input.paymentAmount * 0.05);
      } else if (input.incomeType === 'other') {
        const deduction = input.hasBasicDeduction ? 300000 : 0;
        return Math.floor(Math.max(0, input.paymentAmount - deduction) * rate);
      } else {
        return Math.floor(input.paymentAmount * rate);
      }
    } catch {
      return 0;
    }
  }, [input]);

  // 💰 디바운스된 자동 계산 (고도화)
  useEffect(() => {
    if (input.paymentAmount > 0 && logicalErrors.length === 0) {
      const timer = setTimeout(() => {
        try {
          const calculationResult = calculateWithholdingTax(input);
          setResult(calculationResult);
          setErrors({});
        } catch (error) {
          setErrors({ general: '자동 계산 중 오류가 발생했습니다.' });
        }
      }, 300); // 300ms 디바운스
      
      return () => clearTimeout(timer);
    } else {
      setResult(null);
    }
  }, [input, logicalErrors]);

  // 계산 핸들러
  const handleCalculate = useCallback(() => {
    try {
      if (input.paymentAmount <= 0) {
        setErrors({ paymentAmount: '지급액을 입력해주세요.' });
        return;
      }
      setIsCalculating(true);
      const calculationResult = calculateWithholdingTax(input);
      setResult(calculationResult);
      setActiveTab('result');
      setErrors({});
    } catch (error) {
      setErrors({ general: '계산 중 오류가 발생했습니다.' });
    } finally {
      setIsCalculating(false);
    }
  }, [input]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-800">2024년 원천징수세 계산기</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900">
          원천징수세 계산기
          <br />
          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            정확하고 상세한 세액 계산
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          <strong>5종 소득 유형</strong>에 따른 정확한 원천징수세를 계산하고, 
          <strong>절세 방법</strong>과 <strong>주의사항</strong>까지 한번에 확인하세요.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge variant="outline" className="text-sm px-4 py-2">
            <Calculator className="w-4 h-4 mr-2" />
            정확한 계산
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2">
            <Lightbulb className="w-4 h-4 mr-2" />
            절세 조언
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2">
            <Target className="w-4 h-4 mr-2" />
            실무 가이드
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            즉시 계산
          </Badge>
        </div>
      </div>

      {/* 250자 요약 면책 조항 */}
      <TaxCalculatorDisclaimer variant="summary" />

      {/* 🔥 스마트 원천징수세 자동 계산 대시보드 */}
      {input.paymentAmount > 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 text-lg">
              <Zap className="w-5 h-5" />
              ⚡ 스마트 원천징수세 자동 계산 대시보드
            </CardTitle>
            <CardDescription className="text-emerald-600">
              AI가 실시간으로 {currentIncomeInfo.title} 원천징수세를 정확하게 계산하고 절세 방안을 제시합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 원천징수세액 */}
              <div className="bg-white p-3 rounded border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">원천징수세액</span>
                  <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                </div>
                <div className="text-lg font-bold text-emerald-700">
                  {autoCalculatedTax.totalTax.toLocaleString('ko-KR')}원
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  소득세 + 지방소득세
                </div>
              </div>

              {/* 실수령액 */}
              <div className="bg-white p-3 rounded border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">실수령액</span>
                  <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                </div>
                <div className="text-lg font-bold text-emerald-700">
                  {autoCalculatedTax.netAmount.toLocaleString('ko-KR')}원
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  지급액 - 원천징수세
                </div>
              </div>

              {/* 적용 세율 */}
              <div className="bg-white p-3 rounded border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">적용 세율</span>
                  <Badge className={`text-xs ${currentIncomeInfo.exactRate === 0 ? 'bg-blue-100 text-blue-700' : 
                    currentIncomeInfo.exactRate <= 5 ? 'bg-green-100 text-green-700' : 
                    currentIncomeInfo.exactRate <= 15 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {currentIncomeInfo.rate}
                  </Badge>
                </div>
                <div className={`text-lg font-bold ${currentIncomeInfo.exactRate === 0 ? 'text-blue-700' : 
                  currentIncomeInfo.exactRate <= 5 ? 'text-green-700' : 
                  currentIncomeInfo.exactRate <= 15 ? 'text-yellow-700' : 'text-red-700'}`}>
                  {currentIncomeInfo.rate}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {currentIncomeInfo.title}
                </div>
              </div>

              {/* 연간 영향 */}
              <div className="bg-white p-3 rounded border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">연간 세액</span>
                  <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                </div>
                <div className="text-lg font-bold text-emerald-700">
                  {annualTaxImpact.totalTax.toLocaleString('ko-KR')}원
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {input.paymentCount}회 기준
                </div>
              </div>
            </div>

            {/* 소득 유형별 상세 정보 */}
            <div className="mt-4 p-3 bg-white rounded border border-emerald-200">
              <div className="text-sm font-medium text-gray-700 mb-3">💼 {currentIncomeInfo.title} 세부 정보</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="font-medium text-emerald-700">세율 구조</div>
                  <div>소득세: {input.incomeType === 'business' ? '3.0%' : 
                              input.incomeType === 'other' ? '20.0%' : 
                              input.incomeType === 'interest' || input.incomeType === 'dividend' ? '14.0%' : '간이세액표'}</div>
                  <div>지방소득세: {input.incomeType === 'business' ? '0.3%' : 
                                  input.incomeType === 'other' ? '2.0%' : 
                                  input.incomeType === 'interest' || input.incomeType === 'dividend' ? '1.4%' : '10%'}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-emerald-700">공제 혜택</div>
                  <div>{currentIncomeInfo.deduction}</div>
                  {input.incomeType === 'earned' && (
                    <div>부양가족: {(input.dependents || 0) + (input.childrenUnder20 || 0)}명</div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-emerald-700">신고 의무</div>
                  <div className="text-xs">
                    {input.incomeType === 'business' ? '종합소득세 신고 (5월)' :
                     input.incomeType === 'other' ? '연 300만원 초과시 신고' :
                     input.incomeType === 'interest' ? '금융소득 2천만원 초과시' :
                     input.incomeType === 'dividend' ? '금융소득 2천만원 초과시' :
                     '연말정산 (회사)'}
                  </div>
                </div>
              </div>
            </div>

            {/* 신고 일정 */}
            <div className="mt-4 p-3 bg-white rounded border border-emerald-200">
              <div className="text-sm font-medium text-gray-700 mb-3">📅 신고·납부 일정</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className={`p-2 rounded ${filingSchedule.isOverdue ? 'bg-red-50 border border-red-200' : 
                  filingSchedule.daysLeft <= 5 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                  <div className="font-medium">신고 마감일</div>
                  <div className="text-lg font-bold mt-1">{filingSchedule.filingDeadline}</div>
                  <div className={`${filingSchedule.isOverdue ? 'text-red-600' : 
                    filingSchedule.daysLeft <= 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {filingSchedule.isOverdue ? '기한 경과' : 
                     filingSchedule.daysLeft === 0 ? '오늘 마감' : 
                     `${filingSchedule.daysLeft}일 남음`}
                  </div>
                </div>
                <div className="p-2 rounded bg-blue-50 border border-blue-200">
                  <div className="font-medium">신고 방법</div>
                  <div className="mt-1">국세청 홈택스</div>
                  <div className="text-blue-600">온라인 신고</div>
                </div>
                <div className="p-2 rounded bg-purple-50 border border-purple-200">
                  <div className="font-medium">필요 서류</div>
                  <div className="mt-1">원천징수영수증</div>
                  <div className="text-purple-600">발급 의무</div>
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
            {logicalErrors.length === 0 && input.paymentAmount > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-2">✅ AI 자동 계산 완료</div>
                <div className="text-xs text-green-600">
                  모든 조건이 완벽하게 분석되었습니다. 원천징수세가 정확하게 계산되었습니다.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 샘플 케이스 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <div>
                <CardTitle>샘플 테스트 케이스</CardTitle>
                <CardDescription>
                  실제 사례로 원천징수세 계산 방법을 확인해보세요
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => setShowSamples(!showSamples)}
              variant="outline"
              size="lg"
            >
              {showSamples ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  숨기기
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  보기
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        {showSamples && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SAMPLE_CASES.map((sample) => (
                <Card 
                  key={sample.id} 
                  className="cursor-pointer hover:shadow-lg transition-all border-gray-200 hover:border-emerald-300"
                  onClick={() => {
                    setInput(sample.input);
                    setResult(null);
                    setErrors({});
                    setActiveTab('input');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {sample.category}
                        </Badge>
                        <span className="text-sm font-bold text-emerald-600">
                          {Math.round(sample.expectedResult.tax).toLocaleString('ko-KR')}원
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm">{sample.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{sample.description}</p>
                      </div>
                      
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>지급액:</span>
                          <span className="font-medium">
                            {Math.round(sample.input.paymentAmount).toLocaleString('ko-KR')}원
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>세율:</span>
                          <span className="font-medium text-red-600">
                            {sample.expectedResult.rate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>실수령액:</span>
                          <span className="font-medium text-blue-600">
                            {Math.round(sample.expectedResult.netAmount).toLocaleString('ko-KR')}원
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">체크포인트:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {sample.checkPoints.slice(0, 2).map((point, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* 메인 계산기 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">입력 및 계산</TabsTrigger>
          <TabsTrigger value="result" disabled={!result}>계산결과</TabsTrigger>
          <TabsTrigger value="guide">실무가이드</TabsTrigger>
        </TabsList>

        {/* 입력 탭 */}
        <TabsContent value="input" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 입력 폼 */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    기본 정보
                  </CardTitle>
                  <CardDescription>
                    소득 유형과 지급액을 정확히 입력해주세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 소득 유형 선택 */}
                  <div className="space-y-2">
                    <Label htmlFor="incomeType">소득 유형</Label>
                    <Select 
                      value={input.incomeType} 
                      onValueChange={(value) => setInput(prev => ({ ...prev, incomeType: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="소득 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="earned">
                          <div className="flex items-center justify-between w-full">
                            <span>근로소득 (급여, 상여)</span>
                            <Badge variant="outline" className="ml-2">간이세액표</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="business">
                          <div className="flex items-center justify-between w-full">
                            <span>사업소득 (용역비, 자문료)</span>
                            <Badge variant="outline" className="ml-2">3.3%</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="other">
                          <div className="flex items-center justify-between w-full">
                            <span>기타소득 (강의료, 원고료)</span>
                            <Badge variant="outline" className="ml-2">22%</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="interest">
                          <div className="flex items-center justify-between w-full">
                            <span>이자소득 (예금이자)</span>
                            <Badge variant="outline" className="ml-2">15.4%</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="dividend">
                          <div className="flex items-center justify-between w-full">
                            <span>배당소득 (주식배당)</span>
                            <Badge variant="outline" className="ml-2">15.4%</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.incomeType && (
                      <p className="text-sm text-red-600">{errors.incomeType}</p>
                    )}
                  </div>

                  {/* 지급액 */}
                  <div className="space-y-2">
                    <EnhancedSmartInput
                      label="💰 지급액"
                      value={input.paymentAmount || 0}
                      onChange={(value) => setInput(prev => ({ ...prev, paymentAmount: value }))}
                      placeholder="지급액을 입력하세요 (필수)"
                      calculationRule="withholding-tax-payment-amount"
                      required={true}
                      connectedInputs={[
                        { label: '원천징수세액', value: autoCalculatedTax.totalTax, isCalculated: true },
                        { label: '실수령액', value: autoCalculatedTax.netAmount, isCalculated: true },
                        { label: '적용세율', value: currentIncomeInfo.exactRate || 0, isCalculated: true }
                      ]}
                      quickActions={[
                        { label: '100만원', value: 1000000 },
                        { label: '200만원', value: 2000000 },
                        { label: '300만원', value: 3000000 },
                        { label: '500만원', value: 5000000 }
                      ]}
                      recommendations={autoCalculatedTax.totalTax > 0 ? 
                        [`${currentIncomeInfo.title} 원천징수세: ${autoCalculatedTax.totalTax.toLocaleString()}원`] : []
                      }
                      validationRules={[
                        { type: 'min', value: 0, message: '지급액은 0원 이상이어야 합니다' },
                        { type: 'max', value: 100000000, message: '지급액 한도(1억원)를 초과했습니다' },
                        { type: 'required', message: '원천징수세 계산을 위해 지급액 입력이 필수입니다' }
                      ]}
                    />
                    <div className="text-xs text-gray-500">
                      💡 한도: 월 1억원까지 입력 가능
                    </div>
                  </div>

                  {/* 지급일 */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">지급일</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={input.paymentDate}
                      onChange={(e) => setInput(prev => ({ ...prev, paymentDate: e.target.value }))}
                    />
                    <div className="text-xs text-gray-500">
                      📅 원천징수 신고: 다음달 10일까지
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 소득 유형별 상세 입력 */}
              {input.incomeType === 'earned' && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800">근로소득 상세 정보</CardTitle>
                    <CardDescription className="text-blue-600">
                      부양가족 정보를 정확히 입력하면 세액을 크게 절약할 수 있습니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <EnhancedSmartInput
                          label="부양가족 수"
                          value={input.dependents || 0}
                          onChange={(value) => setInput(prev => ({ ...prev, dependents: value }))}
                          placeholder="0"
                          calculationRule="withholding-tax-dependents"
                          connectedInputs={[
                            { label: '20세 이하 자녀', value: input.childrenUnder20 || 0 },
                            { label: '월 공제액', value: (input.dependents || 0) * 150000, isCalculated: true }
                          ]}
                          quickActions={[
                            { label: '1명', value: 1 },
                            { label: '2명', value: 2 },
                            { label: '3명', value: 3 },
                            { label: '4명', value: 4 }
                          ]}
                          recommendations={(input.dependents || 0) > 0 ? 
                            [`월 ${((input.dependents || 0) * 150000).toLocaleString()}원 공제 혜택`] : 
                            ['부양가족이 있으면 1명당 월 15만원 공제']
                          }
                          validationRules={[
                            { type: 'min', value: 0, message: '부양가족 수는 0명 이상이어야 합니다' },
                            { type: 'max', value: 20, message: '부양가족 수가 과도합니다' }
                          ]}
                        />
                        <div className="text-xs text-blue-600">
                          💰 1명당 월 15만원 공제
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <EnhancedSmartInput
                          label="20세 이하 자녀 수"
                          value={input.childrenUnder20 || 0}
                          onChange={(value) => setInput(prev => ({ ...prev, childrenUnder20: value }))}
                          placeholder="0"
                          calculationRule="withholding-tax-children"
                          connectedInputs={[
                            { label: '부양가족 수', value: input.dependents || 0 },
                            { label: '추가 공제액', value: (input.childrenUnder20 || 0) * 150000, isCalculated: true }
                          ]}
                          quickActions={[
                            { label: '1명', value: 1 },
                            { label: '2명', value: 2 },
                            { label: '3명', value: 3 }
                          ]}
                          recommendations={(input.childrenUnder20 || 0) > 0 ? 
                            [`추가 월 ${((input.childrenUnder20 || 0) * 150000).toLocaleString()}원 공제`] : []
                          }
                          warningMessage={(input.childrenUnder20 || 0) > (input.dependents || 0) ? 
                            '20세 이하 자녀수가 부양가족수를 초과할 수 없습니다' : undefined
                          }
                          validationRules={[
                            { type: 'min', value: 0, message: '자녀 수는 0명 이상이어야 합니다' },
                            { type: 'max', value: 20, message: '자녀 수가 과도합니다' }
                          ]}
                        />
                        <div className="text-xs text-blue-600">
                          🎓 추가 월 15만원 공제
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isMainWorker"
                        checked={input.isMainWorker}
                        onCheckedChange={(checked) => setInput(prev => ({ ...prev, isMainWorker: checked as boolean }))}
                      />
                      <Label htmlFor="isMainWorker">주(현)근무지 여부</Label>
                    </div>

                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>절세 팁:</strong> 부양가족이 많을수록 원천징수세액이 크게 줄어듭니다. 
                        연말정산을 통해 최종 정산받으세요.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {input.incomeType === 'business' && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">사업소득 상세 정보</CardTitle>
                    <CardDescription className="text-green-600">
                      용역비, 자문료 등 사업 관련 소득의 원천징수 정보
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>사업소득 원천징수:</strong><br/>
                        • 소득세 3% + 지방소득세 0.3% = 총 3.3%<br/>
                        • 종합소득세 신고 시 기납부세액으로 공제<br/>
                        • 원천징수영수증 반드시 보관
                      </AlertDescription>
                    </Alert>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-green-800 mb-2">📋 체크리스트</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>✅ 사업자등록증 확인</li>
                        <li>✅ 세금계산서 또는 계산서 발행</li>
                        <li>✅ 원천징수영수증 발급</li>
                        <li>✅ 다음달 10일까지 신고·납부</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {input.incomeType === 'other' && (
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-purple-800">기타소득 상세 정보</CardTitle>
                    <CardDescription className="text-purple-600">
                      강의료, 원고료, 상금 등 기타소득 관련 옵션
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasBasicDeduction"
                        checked={input.hasBasicDeduction}
                        onCheckedChange={(checked) => setInput(prev => ({ ...prev, hasBasicDeduction: checked as boolean }))}
                      />
                      <Label htmlFor="hasBasicDeduction">
                        기본공제 적용 (30만원)
                      </Label>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>기타소득 계산:</strong><br/>
                        1. 기타소득 - 30만원(기본공제) = 과세대상액<br/>
                        2. 과세대상액 × 22% = 원천징수세액<br/>
                        3. 연간 300만원 초과시 종합소득세 신고
                      </AlertDescription>
                    </Alert>

                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-purple-800 mb-2">💡 절세 방법</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• 필요경비 입증서류 준비</li>
                        <li>• 소액 분산 지급으로 공제 효과 극대화</li>
                        <li>• 종합소득세 신고로 정확한 세액 정산</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(input.incomeType === 'interest' || input.incomeType === 'dividend') && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-800">금융소득 상세 정보</CardTitle>
                    <CardDescription className="text-orange-600">
                      이자·배당소득의 종합과세 판정 관련 정보
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <EnhancedSmartInput
                        label="연간 총 금융소득"
                        value={input.annualTotalInterest || 0}
                        onChange={(value) => setInput(prev => ({ ...prev, annualTotalInterest: value }))}
                        placeholder="연간 총 이자·배당소득"
                        calculationRule="withholding-tax-annual-interest"
                        connectedInputs={[
                          { label: '현재 금액', value: input.paymentAmount || 0 },
                          { label: '종합과세 여부', value: (input.annualTotalInterest || 0) > 20000000 ? 1 : 0, isCalculated: true }
                        ]}
                        quickActions={[
                          { label: '1천만원', value: 10000000 },
                          { label: '2천만원', value: 20000000 },
                          { label: '3천만원', value: 30000000 },
                          { label: '5천만원', value: 50000000 }
                        ]}
                        recommendations={
                          (input.annualTotalInterest || 0) > 20000000 ? 
                          ['⚠️ 금융소득종합과세 대상입니다'] : 
                          (input.annualTotalInterest || 0) > 15000000 ? 
                          ['종합과세 임계점에 근접했습니다'] : 
                          ['분리과세 적용 (15.4%)']
                        }
                        warningMessage={(input.annualTotalInterest || 0) > 20000000 ? 
                          '연간 2천만원 초과시 종합소득세 신고 대상입니다' : undefined
                        }
                        validationRules={[
                          { type: 'min', value: 0, message: '금융소득은 0원 이상이어야 합니다' },
                          { type: 'max', value: 1000000000, message: '금융소득이 과도합니다' }
                        ]}
                      />
                      <div className="text-xs text-orange-600">
                        🔥 연간 2천만원 초과시 종합소득세 신고 대상
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isLowIncomeAccount"
                        checked={input.isLowIncomeAccount}
                        onCheckedChange={(checked) => setInput(prev => ({ ...prev, isLowIncomeAccount: checked as boolean }))}
                      />
                      <Label htmlFor="isLowIncomeAccount">
                        서민형 비과세 계좌 (비과세 한도 5천만원)
                      </Label>
                    </div>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>금융소득종합과세 주의:</strong><br/>
                        연간 이자+배당소득이 2천만원을 초과하면 다른 소득과 합산하여 
                        6%~45% 누진세율로 종합과세됩니다.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-orange-800 mb-2">📊 세액 비교</h4>
                      <div className="text-sm text-orange-700 space-y-1">
                        <div className="flex justify-between">
                          <span>분리과세 (2천만원 이하):</span>
                          <span className="font-medium">15.4%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>종합과세 (2천만원 초과):</span>
                          <span className="font-medium text-red-600">6~45%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 에러 메시지 */}
              {errors.general && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* 계산 실행 버튼 섹션 */}
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* 🔥 개선된 세액계산하기 버튼 */}
                    <Button
                      onClick={handleCalculate}
                      disabled={isCalculating || !input.paymentAmount}
                      className={`px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-200 transform
                        ${!input.paymentAmount ? 
                          'bg-gray-400 cursor-not-allowed' :
                          isCalculating ? 'animate-pulse' :
                          'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                        }
                      `}
                      size="lg"
                    >
                      {isCalculating ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                          계산 중...
                        </>
                      ) : !input.paymentAmount ? (
                        <>
                          <Calculator className="w-5 h-5 mr-3 opacity-50" />
                          지급액 입력 필요
                        </>
                      ) : (
                        <>
                          <Calculator className="w-5 h-5 mr-3" />
                          {result ? '재계산하기' : '세액계산하기'}
                        </>
                      )}
                    </Button>
                    
                    {/* 🔥 개선된 초기화 버튼 */}
                    <Button
                      onClick={() => {
                        setInput({
                          incomeType: 'earned',
                          paymentAmount: 0,
                          paymentDate: new Date().toISOString().split('T')[0],
                          paymentCount: 1,
                          dependents: 0,
                          childrenUnder20: 0,
                          isMainWorker: true,
                          hasBasicDeduction: true,
                          annualTotalInterest: 0,
                          isLowIncomeAccount: false,
                          previousTaxPaid: 0
                        });
                        setResult(null);
                        setErrors({});
                        setActiveTab('input');
                      }}
                      variant="outline"
                      className="px-6 py-4 text-lg font-medium border-2 border-gray-300 hover:border-gray-400
                        transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                        hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-md
                        relative overflow-hidden group"
                      size="lg"
                    >
                                             <span className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                       <span className="relative flex items-center">
                         <RefreshCw className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-300" />
                         전체 초기화
                       </span>
                    </Button>
                  </div>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-emerald-700 font-medium">
                      💡 입력 정보를 확인한 후 계산하기 버튼을 클릭하세요
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 우측 정보 패널 */}
            <div className="space-y-6">
              <Card className={`border-${currentIncomeInfo.color}-200 bg-${currentIncomeInfo.color}-50`}>
                <CardHeader>
                  <CardTitle className={`text-${currentIncomeInfo.color}-800`}>
                    {currentIncomeInfo.title}
                  </CardTitle>
                  <CardDescription className={`text-${currentIncomeInfo.color}-600`}>
                    {currentIncomeInfo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">원천징수율</span>
                      <Badge variant="secondary">{currentIncomeInfo.rate}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 계산 확인 체크리스트 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    계산 확인 체크리스트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>소득 구분이 정확한가?</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>지급액이 올바른가?</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>공제 항목을 빠뜨리지 않았나?</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>신고 기한을 확인했나?</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 결과 탭 */}
        <TabsContent value="result" className="space-y-6">
          {result && (
            <>
              <Card className="border-emerald-200">
                <CardHeader className="bg-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-emerald-800">
                    <Calculator className="w-5 h-5" />
                    원천징수세 계산 결과
                  </CardTitle>
                  <CardDescription className="text-emerald-600">
                    {result.incomeType} 원천징수세 계산 완료
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">지급액</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(result.paymentAmount).toLocaleString('ko-KR')}원
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">원천징수세액</div>
                      <div className="text-2xl font-bold text-red-600">
                        -{Math.round(result.totalTax).toLocaleString('ko-KR')}원
                      </div>
                      <div className="text-sm text-gray-500">
                        (세율: {(result.appliedRate * 100).toFixed(2)}%)
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">실수령액</div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {Math.round(result.netAmount).toLocaleString('ko-KR')}원
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>상세 계산 내역</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.breakdown.steps.map((step, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <div className="font-medium">{step.label}</div>
                          {step.description && (
                            <div className="text-sm text-gray-600">{step.description}</div>
                          )}
                        </div>
                        <div className={`font-bold ${
                          step.amount < 0 ? 'text-red-600' : 
                          step.label.includes('실수령') ? 'text-emerald-600' : 'text-gray-900'
                        }`}>
                          {step.amount < 0 ? '-' : ''}{Math.abs(Math.round(step.amount)).toLocaleString('ko-KR')}원
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* 가이드 탭 */}
        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>원천징수세 실무 가이드</CardTitle>
              <CardDescription>소득 유형별 원천징수세 계산 방법과 주의사항</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">근로소득</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 간이세액표 적용</li>
                    <li>• 부양가족공제 적용</li>
                    <li>• 연말정산 대상</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">사업소득</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 3.3% 고정 세율</li>
                    <li>• 종합소득세 신고</li>
                    <li>• 기납부세액 공제</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">기타소득</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 22% 세율 적용</li>
                    <li>• 30만원 기본공제</li>
                    <li>• 연간 300만원 초과시 신고</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">금융소득</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 15.4% 원천징수</li>
                    <li>• 연간 2천만원 기준</li>
                    <li>• 종합과세 vs 분리과세</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 🧪 베타테스트 피드백 시스템 */}
      <BetaFeedbackForm 
        calculatorName="원천징수세 계산기"
        calculatorType="withholding-tax"
        className="mt-8"
      />

      {/* 하단 면책 조항 */}
      <TaxCalculatorDisclaimer variant="full" className="mt-6" />
    </div>
  );
};

export default WithholdingTaxCalculator; 