'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  Calculator,
  Shield,
  HelpCircle,
  Target,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  Users,
  Lightbulb,
  Building,
  PieChart,
  Gift,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

import { StockTransferInput, StockTransferResult } from '@/types/tax-calculator.types';
import { StockTransferTaxCalculator as StockTransferCalc } from '@/lib/utils/stock-transfer-calculations';
import { formatNumber, formatWon, formatNumberInput, parseFormattedNumber, handleNumberInputChange } from '@/lib/utils';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';
import { BetaFeedbackForm } from '@/components/ui/beta-feedback-form';

interface FormData extends Partial<StockTransferInput> {
  stockType: 'listed' | 'unlisted' | 'kosdaq' | 'konex';
  transferType: 'sale' | 'gift' | 'inheritance' | 'dividend';
  stockQuantity: number;
  pricePerShare: number;
  acquisitionPrice: number;
  transferPrice?: number;
  transferExpenses: number;
  personalShareholdingRatio: number;
  familyShareholdingRatio: number;
  holdingYears: number;
  relationship?: 'spouse' | 'lineal_descendant' | 'lineal_ascendant' | 'sibling' | 'other';
  transfereeResidence: 'domestic' | 'foreign';
  isStartupStock: boolean;
  isSmallMediumStock: boolean;
  hasOtherCapitalGains: boolean;
  otherIncomeAmount: number;
  comprehensiveIncomeTaxPayer: boolean;
  qualifiesForTaxIncentive: boolean;
  otherFamilyShareholdingRatio?: number;
  corporateShareholdingRatio?: number;
}

// 샘플 케이스 데이터를 컴포넌트 외부로 분리
const sampleCases = {
  // 기존 케이스들
  listedLargeShareholder: {
    companyName: '삼성전자',
    stockType: 'listed' as const,
    transferType: 'sale' as const,
    stockQuantity: 20000,
    pricePerShare: 75000,
    acquisitionPrice: 1200000000,
    transferPrice: 1500000000,
    transferExpenses: 15000000,
    totalSharesOutstanding: 5969782550,
    totalOwnedShares: 20000,
    spouseShareholdingRatio: 0.5,
    linealRelativeShareholdingRatio: 0.3,
    holdingYears: 2.5,
    isStartupStock: false,
    isSmallMediumStock: false,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: false
  },
  unlistedSmallShareholder: {
    companyName: '(주)혁신기술',
    stockType: 'unlisted' as const,
    transferType: 'sale' as const,
    stockQuantity: 1000,
    pricePerShare: 50000,
    acquisitionPrice: 40000000,
    transferPrice: 50000000,
    transferExpenses: 500000,
    totalSharesOutstanding: 100000,
    totalOwnedShares: 1000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 1.5,
    isStartupStock: false,
    isSmallMediumStock: true,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: false
  },
  ventureStock: {
    companyName: '(주)스타트업벤처',
    stockType: 'unlisted' as const,
    transferType: 'sale' as const,
    stockQuantity: 5000,
    pricePerShare: 20000,
    acquisitionPrice: 50000000,
    transferPrice: 100000000,
    transferExpenses: 1000000,
    totalSharesOutstanding: 50000,
    totalOwnedShares: 5000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 2.0,
    isStartupStock: true,
    isSmallMediumStock: false,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: false
  },
  spouseGift: {
    companyName: '(주)가족기업',
    stockType: 'unlisted' as const,
    transferType: 'gift' as const,
    stockQuantity: 10000,
    pricePerShare: 50000,
    acquisitionPrice: 400000000,
    transferPrice: 0,
    transferExpenses: 0,
    totalSharesOutstanding: 100000,
    totalOwnedShares: 10000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 5.0,
    relationship: 'spouse' as const,
    transfereeResidence: 'domestic' as const,
    isStartupStock: false,
    isSmallMediumStock: false,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: false
  },

  // 새로운 실무 케이스들
  kosdaqIPO: {
    companyName: '(주)바이오테크',
    stockType: 'kosdaq' as const,
    transferType: 'sale' as const,
    stockQuantity: 30000,
    pricePerShare: 25000,
    acquisitionPrice: 300000000,
    transferPrice: 750000000,
    transferExpenses: 7500000,
    totalSharesOutstanding: 2000000,
    totalOwnedShares: 30000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 3.0,
    isStartupStock: false,
    isSmallMediumStock: true,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: false
  },

  stockOptions: {
    companyName: '(주)테크기업',
    stockType: 'unlisted' as const,
    transferType: 'sale' as const,
    stockQuantity: 10000,
    pricePerShare: 100000,
    acquisitionPrice: 300000000,
    transferPrice: 1000000000,
    transferExpenses: 10000000,
    totalSharesOutstanding: 1000000,
    totalOwnedShares: 10000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 4.0,
    isStartupStock: false,
    isSmallMediumStock: true,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: true
  },

  inheritanceCase: {
    companyName: 'SK하이닉스',
    stockType: 'listed' as const,
    transferType: 'inheritance' as const,
    stockQuantity: 5000,
    pricePerShare: 120000,
    acquisitionPrice: 450000000,
    transferPrice: 600000000,
    transferExpenses: 0,
    totalSharesOutstanding: 688738473,
    totalOwnedShares: 5000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 0.5,
    relationship: 'lineal_descendant' as const,
    transfereeResidence: 'domestic' as const,
    isStartupStock: false,
    isSmallMediumStock: false,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: false
  },

  foreignInvestor: {
    companyName: '(주)글로벌테크',
    stockType: 'listed' as const,
    transferType: 'sale' as const,
    stockQuantity: 100000,
    pricePerShare: 15000,
    acquisitionPrice: 1200000000,
    transferPrice: 1500000000,
    transferExpenses: 15000000,
    totalSharesOutstanding: 50000000,
    totalOwnedShares: 100000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 1.8,
    transfereeResidence: 'foreign' as const,
    isStartupStock: false,
    isSmallMediumStock: false,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: false
  },

  pensionAccount: {
    companyName: 'KODEX 200',
    stockType: 'listed' as const,
    transferType: 'sale' as const,
    stockQuantity: 50000,
    pricePerShare: 8000,
    acquisitionPrice: 350000000,
    transferPrice: 400000000,
    transferExpenses: 400000,
    totalSharesOutstanding: 1000000000,
    totalOwnedShares: 50000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 2.2,
    isStartupStock: false,
    isSmallMediumStock: false,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: true
  },

  employeeStock: {
    companyName: '현대자동차',
    stockType: 'listed' as const,
    transferType: 'sale' as const,
    stockQuantity: 500,
    pricePerShare: 200000,
    acquisitionPrice: 80000000,
    transferPrice: 100000000,
    transferExpenses: 1000000,
    totalSharesOutstanding: 213398636,
    totalOwnedShares: 500,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 5.5,
    isStartupStock: false,
    isSmallMediumStock: false,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: true
  },

  startupExit: {
    companyName: '(주)유니콘스타트업',
    stockType: 'unlisted' as const,
    transferType: 'sale' as const,
    stockQuantity: 100000,
    pricePerShare: 50000,
    acquisitionPrice: 500000000,
    transferPrice: 5000000000,
    transferExpenses: 50000000,
    totalSharesOutstanding: 1000000,
    totalOwnedShares: 100000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 6.0,
    isStartupStock: true,
    isSmallMediumStock: false,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: true
  },

  mergersAcquisition: {
    companyName: '(주)인수대상기업',
    stockType: 'unlisted' as const,
    transferType: 'sale' as const,
    stockQuantity: 25000,
    pricePerShare: 80000,
    acquisitionPrice: 1500000000,
    transferPrice: 2000000000,
    transferExpenses: 20000000,
    totalSharesOutstanding: 200000,
    totalOwnedShares: 25000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 3.5,
    isStartupStock: false,
    isSmallMediumStock: true,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: false
  },

  realEstateREIT: {
    companyName: '코리아리츠',
    stockType: 'listed' as const,
    transferType: 'sale' as const,
    stockQuantity: 10000,
    pricePerShare: 35000,
    acquisitionPrice: 300000000,
    transferPrice: 350000000,
    transferExpenses: 3500000,
    totalSharesOutstanding: 100000000,
    totalOwnedShares: 10000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 1.0,
    isStartupStock: false,
    isSmallMediumStock: false,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: false
  },

  smallBusinessSpecial: {
    companyName: '(주)중소기업특례',
    stockType: 'unlisted' as const,
    transferType: 'sale' as const,
    stockQuantity: 20000,
    pricePerShare: 25000,
    acquisitionPrice: 400000000,
    transferPrice: 500000000,
    transferExpenses: 5000000,
    totalSharesOutstanding: 100000,
    totalOwnedShares: 20000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 2.5,
    isStartupStock: false,
    isSmallMediumStock: true,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: true
  },

  convertibleBond: {
    companyName: '(주)성장기업',
    stockType: 'unlisted' as const,
    transferType: 'sale' as const,
    stockQuantity: 15000,
    pricePerShare: 40000,
    acquisitionPrice: 450000000,
    transferPrice: 600000000,
    transferExpenses: 6000000,
    totalSharesOutstanding: 500000,
    totalOwnedShares: 15000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 3.0,
    isStartupStock: false,
    isSmallMediumStock: true,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: false
  },

  familyBusiness: {
    companyName: '(주)가업승계대상',
    stockType: 'unlisted' as const,
    transferType: 'gift' as const,
    stockQuantity: 80000,
    pricePerShare: 50000,
    acquisitionPrice: 3000000000,
    transferPrice: 0,
    transferExpenses: 0,
    totalSharesOutstanding: 100000,
    totalOwnedShares: 80000,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    holdingYears: 10.0,
    relationship: 'lineal_descendant' as const,
    transfereeResidence: 'domestic' as const,
    isStartupStock: false,
    isSmallMediumStock: true,
    hasOtherCapitalGains: false,
    otherIncomeAmount: 0,
    qualifiesForTaxIncentive: true
  }
};

export default function StockTransferTaxCalculator() {
  const [formData, setFormData] = useState<FormData>({
    stockType: 'listed',
    transferType: 'sale',
    companyName: '',
    stockQuantity: 0,
    pricePerShare: 0,
    totalValue: 0,
    holdingPeriod: 0,
    holdingYears: 0,
    acquisitionPrice: 0,
    acquisitionDate: new Date(),
    totalSharesOutstanding: 0,
    personalShareholdingRatio: 0,
    spouseShareholdingRatio: 0,
    linealRelativeShareholdingRatio: 0,
    familyShareholdingRatio: 0,
    totalOwnedShares: 0,
    transferPrice: 0,
    transferDate: new Date(),
    transferExpenses: 0,
    transferorAge: 0,
    transfereeAge: 0,
    relationship: 'lineal_descendant',
    transfereeResidence: 'domestic',
    hasOtherCapitalGains: false,
    previousGiftHistory: [],
    otherIncomeAmount: 0,
    comprehensiveIncomeTaxPayer: false,
    isStartupStock: false,
    isSmallMediumStock: false,
    qualifiesForTaxIncentive: false
  });

  const [result, setResult] = useState<StockTransferResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showDetailedTerms, setShowDetailedTerms] = useState(false);
  const [currentSampleCase, setCurrentSampleCase] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [autoCalculations, setAutoCalculations] = useState<{[key: string]: boolean}>({});
  const [comparisonResults, setComparisonResults] = useState<{
    original: StockTransferResult | null;
    optimized: StockTransferResult | null;
    scenarios: {[key: string]: StockTransferResult};
  }>({
    original: null,
    optimized: null,
    scenarios: {}
  });
  const [showGuide, setShowGuide] = useState(false);
  const [appliedOptions, setAppliedOptions] = useState<{[key: string]: boolean}>({});
  const [showCalculationSummary, setShowCalculationSummary] = useState(false);

  // 🔥 고도화된 자동 계산 로직 강화
  
  // 1. 총 주식 가치 자동 계산
  const totalValue = useMemo(() => {
    if (!formData.stockQuantity || !formData.pricePerShare) return 0;
    const value = formData.stockQuantity * formData.pricePerShare;
    // 비현실적인 값 체크
    if (value > 1000000000000) return 0; // 1조원 초과시 무효
    return value;
  }, [formData.stockQuantity, formData.pricePerShare]);

  // 2. 지분율 자동 계산 (보유주식수 우선 계산)
  const shareholdingRatio = useMemo(() => {
    // 총 주식수가 입력되었을 때만 계산
    if (!formData.totalSharesOutstanding || formData.totalSharesOutstanding === 0) return 0;
    
    // 보유주식수가 직접 입력되었으면 그것 사용, 아니면 stockQuantity 사용
    const ownedShares = formData.totalOwnedShares || formData.stockQuantity || 0;
    
    if (ownedShares === 0) return 0;
    
    // 100% 초과 방지
    if (ownedShares > formData.totalSharesOutstanding) {
      console.warn('보유주식수가 총발행주식수를 초과합니다.');
      return 0;
    }
    
    return (ownedShares / formData.totalSharesOutstanding) * 100;
  }, [formData.totalOwnedShares, formData.stockQuantity, formData.totalSharesOutstanding]);

  // 3. 가족 지분율 자동 계산 (100% 초과 방지)
  const familyShareholdingRatio = useMemo(() => {
    const personal = shareholdingRatio;
    const spouse = (formData.spouseShareholdingRatio || 0) * 100; // % → 숫자 변환
    const lineal = (formData.linealRelativeShareholdingRatio || 0) * 100; // % → 숫자 변환
    const total = personal + spouse + lineal;
    
    // 100% 초과 방지
    if (total > 100) {
      console.warn('가족 지분율 합계가 100%를 초과합니다.');
      return 100;
    }
    
    return total;
  }, [shareholdingRatio, formData.spouseShareholdingRatio, formData.linealRelativeShareholdingRatio]);

  // 4. 대주주 판정 자동 계산 (개선된 로직)
  const isLargeShareholder = useMemo(() => {
    const threshold = formData.stockType === 'listed' ? 1 : 4;
    const valueThreshold = 10000000000; // 100억원
    
    // 지분율 기준 (가족지분 포함)
    const ratioTest = familyShareholdingRatio >= threshold;
    
    // 가액 기준
    const valueTest = totalValue >= valueThreshold;
    
    // 둘 중 하나라도 충족하면 대주주
    return ratioTest || valueTest;
  }, [familyShareholdingRatio, totalValue, formData.stockType]);

  // 5. 양도차익 자동 계산 (논리적 검증 포함)
  const capitalGain = useMemo(() => {
    const transferPrice = formData.transferPrice || 0;
    const acquisitionPrice = formData.acquisitionPrice || 0;
    const transferExpenses = formData.transferExpenses || 0;
    
    // 입력값 검증
    if (transferPrice < 0 || acquisitionPrice < 0 || transferExpenses < 0) {
      console.warn('음수 입력이 감지되었습니다.');
      return 0;
    }
    
    // 비용이 양도가액보다 큰 경우 체크
    if (transferExpenses > transferPrice) {
      console.warn('양도비용이 양도가액보다 큽니다.');
    }
    
    return transferPrice - acquisitionPrice - transferExpenses;
  }, [formData.transferPrice, formData.acquisitionPrice, formData.transferExpenses]);

  // 6. 보유기간 자동 계산 (날짜 기반) - 먼저 선언
  const holdingPeriod = useMemo(() => {
    if (!formData.acquisitionDate || !formData.transferDate) return { years: 0, months: 0, days: 0 };
    
    const acqDate = new Date(formData.acquisitionDate);
    const transferDate = new Date(formData.transferDate);
    const diffTime = Math.abs(transferDate.getTime() - acqDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const remainingDays = diffDays % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;
    
    return { years, months, days };
  }, [formData.acquisitionDate, formData.transferDate]);

  // 7. 수익률 자동 계산
  const profitRate = useMemo(() => {
    if (!formData.acquisitionPrice || formData.acquisitionPrice === 0) return 0;
    return (capitalGain / formData.acquisitionPrice) * 100;
  }, [capitalGain, formData.acquisitionPrice]);

  // 8. 연환산 수익률 자동 계산
  const annualizedReturn = useMemo(() => {
    if (!formData.acquisitionPrice || profitRate === 0 || !holdingPeriod.years) return 0;
    
    const totalYears = holdingPeriod.years + holdingPeriod.months / 12;
    if (totalYears <= 0) return 0;
    
    const totalReturn = (formData.transferPrice || 0) / formData.acquisitionPrice;
    if (totalReturn <= 0) return 0;
    
    return (Math.pow(totalReturn, 1 / totalYears) - 1) * 100;
  }, [profitRate, holdingPeriod, formData.acquisitionPrice, formData.transferPrice]);

  // 8. 자동 보유주식수 동기화
  useEffect(() => {
    // stockQuantity가 변경되고 totalOwnedShares가 비어있으면 자동 동기화
    if (formData.stockQuantity && !formData.totalOwnedShares) {
      handleInputChange('totalOwnedShares', formData.stockQuantity);
    }
  }, [formData.stockQuantity, formData.totalOwnedShares]);

  // 9. 논리적 모순 체크
  const logicalErrors = useMemo(() => {
    const errors: string[] = [];
    
    // 양도가액이 0인데 양도소득세 계산을 시도하는 경우
    if (formData.transferType === 'sale' && formData.transferPrice === 0 && formData.acquisitionPrice > 0) {
      errors.push('양도(매도) 거래인데 양도가액이 입력되지 않았습니다.');
    }
    
    // 취득가액이 0인데 주식을 보유하고 있는 경우
    if (formData.stockQuantity > 0 && formData.acquisitionPrice === 0) {
      errors.push('주식을 보유하고 있는데 취득가액이 0입니다.');
    }
    
    // 양도비용이 양도가액보다 큰 경우
    if (formData.transferExpenses > (formData.transferPrice || 0) && (formData.transferPrice || 0) > 0) {
      errors.push('양도비용이 양도가액보다 클 수 없습니다.');
    }
    
    // 보유주식수가 총발행주식수보다 큰 경우
    if ((formData.totalOwnedShares || formData.stockQuantity || 0) > (formData.totalSharesOutstanding || 0) && (formData.totalSharesOutstanding || 0) > 0) {
      errors.push('보유주식수가 총발행주식수를 초과할 수 없습니다.');
    }
    
    // 지분율이 100%를 초과하는 경우
    if (familyShareholdingRatio > 100) {
      errors.push('가족 지분율 합계가 100%를 초과합니다.');
    }
    
    // 미래 날짜 체크
    const now = new Date();
    if (formData.acquisitionDate && formData.acquisitionDate > now) {
      errors.push('취득일이 미래 날짜로 설정되어 있습니다.');
    }
    
    if (formData.transferDate && formData.transferDate > now) {
      errors.push('양도일이 미래 날짜로 설정되어 있습니다.');
    }
    
    // 취득일이 양도일보다 늦은 경우
    if (formData.acquisitionDate && formData.transferDate && formData.acquisitionDate > formData.transferDate) {
      errors.push('취득일이 양도일보다 늦을 수 없습니다.');
    }
    
    return errors;
  }, [formData, familyShareholdingRatio]);

  // 7. 세제혜택 자동 적용 조건 검사
  const taxIncentiveEligibility = useMemo(() => {
    const eligibility = {
      venture: formData.isStartupStock && holdingPeriod.years >= 2,
      smallMedium: formData.isSmallMediumStock && holdingPeriod.years >= 1,
      longTerm: holdingPeriod.years >= 3,
      pension: formData.stockType === 'listed' && formData.qualifiesForTaxIncentive
    };
    
    return eligibility;
  }, [formData.isStartupStock, formData.isSmallMediumStock, formData.stockType, formData.qualifiesForTaxIncentive, holdingPeriod]);

  // 8. 실시간 입력값 검증
  const validateInputs = useMemo(() => {
    const errors: {[key: string]: string} = {};
    
    // 논리적 검증
    if (formData.stockQuantity > (formData.totalSharesOutstanding || 0) && (formData.totalSharesOutstanding || 0) > 0) {
      errors.stockQuantity = '보유주식수가 총발행주식수를 초과할 수 없습니다';
    }
    
    if (formData.transferPrice && formData.acquisitionPrice && formData.transferPrice < formData.acquisitionPrice && capitalGain > 0) {
      errors.transferPrice = '양도가액이 취득가액보다 낮은데 수익이 발생할 수 없습니다';
    }
    
    if (shareholdingRatio > 100) {
      errors.totalOwnedShares = '지분율이 100%를 초과할 수 없습니다';
    }
    
    if (familyShareholdingRatio > 100) {
      errors.familyShareholdingRatio = '가족 전체 지분율이 100%를 초과할 수 없습니다';
    }
    
    // 상장/비상장 특성 검증
    if (formData.stockType === 'listed' && formData.pricePerShare > 0) {
      // 상장주식은 현실적인 주가 범위 체크
      if (formData.pricePerShare > 1000000) {
        errors.pricePerShare = '상장주식 주가가 비현실적으로 높습니다 (100만원 초과)';
      }
    }
    
    return errors;
  }, [formData, shareholdingRatio, familyShareholdingRatio, capitalGain]);

  // 9. 자동 계산 적용
  useEffect(() => {
    setFormData(prev => {
      const updates: Partial<FormData> = {};
      
      // 총 가치 업데이트
      if (prev.totalValue !== totalValue) {
        updates.totalValue = totalValue;
        setAutoCalculations(auto => ({...auto, totalValue: true}));
      }
      
      // 지분율 업데이트
      if (Math.abs((prev.personalShareholdingRatio || 0) - shareholdingRatio / 100) > 0.0001) {
        updates.personalShareholdingRatio = shareholdingRatio / 100;
        setAutoCalculations(auto => ({...auto, shareholdingRatio: true}));
      }
      
      // 가족지분율 업데이트
      if (Math.abs((prev.familyShareholdingRatio || 0) - familyShareholdingRatio / 100) > 0.0001) {
        updates.familyShareholdingRatio = familyShareholdingRatio / 100;
        setAutoCalculations(auto => ({...auto, familyShareholdingRatio: true}));
      }
      
      // 보유년수 업데이트
      if (prev.holdingYears !== holdingPeriod.years + holdingPeriod.months / 12) {
        updates.holdingYears = holdingPeriod.years + holdingPeriod.months / 12;
        setAutoCalculations(auto => ({...auto, holdingYears: true}));
      }
      
      // 세제혜택 자동 적용
      if (taxIncentiveEligibility.venture && !prev.isStartupStock) {
        updates.qualifiesForTaxIncentive = true;
        setAutoCalculations(auto => ({...auto, taxIncentive: true}));
      }
      
      return Object.keys(updates).length > 0 ? {...prev, ...updates} : prev;
    });
    
    // 검증 오류 업데이트
    setValidationErrors(validateInputs);
  }, [totalValue, shareholdingRatio, familyShareholdingRatio, holdingPeriod, taxIncentiveEligibility, validateInputs]);

  // 임시 계산 함수 (fallback)
  const calculateStockTransferTax = (input: any): StockTransferResult => {
    try {
      // 🔥 1. 대주주 여부 판정 (정확한 로직)
      const isLargeShareholder = determineLargeShareholderStatus(input);
      
      // transferType이 inheritance인 경우 gift로 처리
      const effectiveTransferType = input.transferType === 'inheritance' ? 'gift' : input.transferType;
      
      let calculatedTax = 0;
      let localIncomeTax = 0;
      let totalTax = 0;
      let taxableAmount = 0;
      let taxRate = 0;
      let capitalGain = 0;

      if (effectiveTransferType === 'gift' || input.transferType === 'inheritance') {
        // 🔥 증여세/상속세 계산 (정확한 로직)
        const giftValue = input.totalValue || (input.stockQuantity * input.pricePerShare);
        
        // 🔥 정확한 증여공제 적용
        let giftDeduction = 0;
        if (input.relationship === 'spouse') {
          giftDeduction = 600000000; // 배우자 6억원
        } else if (input.relationship === 'lineal_descendant') {
          giftDeduction = input.transfereeAge < 19 ? 20000000 : 50000000; // 미성년 2천만원, 성인 5천만원
        } else if (input.relationship === 'lineal_ascendant') {
          giftDeduction = 50000000; // 직계존속 5천만원
        } else {
          giftDeduction = 10000000; // 기타 1천만원
        }
        
        taxableAmount = Math.max(0, giftValue - giftDeduction);
        
        // 🔥 증여세 누진세율 정확히 적용
        if (taxableAmount <= 100000000) {
          calculatedTax = taxableAmount * 0.10;
          taxRate = 0.10;
        } else if (taxableAmount <= 500000000) {
          calculatedTax = taxableAmount * 0.20 - 10000000;
          taxRate = 0.20;
        } else if (taxableAmount <= 1000000000) {
          calculatedTax = taxableAmount * 0.30 - 60000000;
          taxRate = 0.30;
        } else if (taxableAmount <= 3000000000) {
          calculatedTax = taxableAmount * 0.40 - 160000000;
          taxRate = 0.40;
        } else {
          calculatedTax = taxableAmount * 0.50 - 460000000;
          taxRate = 0.50;
        }
        
        localIncomeTax = calculatedTax * 0.1;
        totalTax = calculatedTax + localIncomeTax;
      } else {
        // 🔥 주식양도소득세 계산 (정확한 로직)
        capitalGain = (input.transferPrice || 0) - input.acquisitionPrice - (input.transferExpenses || 0);
        
        // 🔥 기본공제 250만원 적용
        const basicDeduction = 2500000;
        const afterBasicDeduction = Math.max(0, capitalGain - basicDeduction);
        taxableAmount = afterBasicDeduction;
        
        // 🔥 정확한 세율 적용 (보유기간별)
        if (input.stockType === 'listed' || input.stockType === 'kosdaq') {
          if (isLargeShareholder) {
            // 상장주식 대주주: 보유기간별 세율
            if (input.holdingYears < 1) {
              taxRate = 0.30; // 1년 미만 30%
            } else if (input.holdingYears < 2) {
              taxRate = 0.25; // 2년 미만 25%
            } else {
              taxRate = 0.20; // 2년 이상 20%
            }
          } else {
            // 상장주식 소액주주: 비과세
            taxRate = 0;
          }
        } else {
          // 비상장주식
          if (isLargeShareholder) {
            taxRate = input.holdingYears < 1 ? 0.35 : 0.25; // 대주주: 1년미만 35%, 1년이상 25%
          } else {
            taxRate = input.holdingYears < 1 ? 0.30 : 0.20; // 소액주주: 1년미만 30%, 1년이상 20%
          }
        }

        // 🔥 세제혜택 적용 (정확한 조건)
        if (input.isStartupStock && input.holdingYears >= 2) {
          taxRate *= 0.5; // 벤처기업주식 50% 감면
        } else if (input.isSmallMediumStock && input.holdingYears >= 1) {
          taxRate *= 0.9; // 중소기업주식 10% 감면
        }

        calculatedTax = taxableAmount * taxRate;
        localIncomeTax = calculatedTax * 0.1;
        totalTax = calculatedTax + localIncomeTax;
      }

      return {
        transferType: input.transferType || 'sale',
        taxableAmount: Math.max(0, capitalGain),
        calculatedTax,
        localIncomeTax,
        totalTax,
        capitalGain,
        isLargeShareholder,
        shareholderStatus: {
          personalRatio: input.personalShareholdingRatio,
          familyRatio: input.familyShareholdingRatio,
          valueTest: totalValue >= 10000000000,
          ratioTest: shareholdingRatio >= (input.stockType === 'listed' ? 1 : 4),
          finalStatus: isLargeShareholder ? 'large' as const : 'small' as const
        },
        appliedTaxRate: taxRate,
        marginalRate: taxRate,
        effectiveRate: capitalGain > 0 ? (totalTax / capitalGain) * 100 : 0,
        netProceeds: (input.transferPrice || 0) - totalTax,
        taxSavingOpportunities: [],
        calculationDetails: {
          shareholderDetermination: {
            tests: [],
            finalResult: isLargeShareholder,
            explanation: `${isLargeShareholder ? '대주주' : '소액주주'} 판정`
          },
          taxCalculationSteps: [
            { label: '양도가액', amount: input.transferPrice || 0 },
            { label: '취득가액', amount: input.acquisitionPrice },
            { label: '양도비용', amount: input.transferExpenses || 0 },
            { label: '양도차익', amount: capitalGain },
            { label: '기본공제', amount: -basicDeduction },
            { label: '과세표준', amount: taxableAmount },
            { label: '적용세율', amount: taxRate * 100 },
            { label: '양도소득세', amount: totalTax }
          ],
          applicableIncentives: [],
          riskFactors: []
        },
        breakdown: {
          steps: [
            { label: '양도가액', amount: input.transferPrice || 0 },
            { label: '취득가액', amount: input.acquisitionPrice },
            { label: '양도차익', amount: capitalGain },
            { label: '기본공제', amount: effectiveTransferType === 'sale' ? -basicDeduction : 0 },
            { label: '과세표준', amount: taxableAmount },
            { label: '세액', amount: totalTax }
          ],
          summary: {
            totalIncome: input.transferPrice || 0,
            totalDeductions: input.acquisitionPrice + (input.transferExpenses || 0) + (effectiveTransferType === 'sale' ? basicDeduction : 0),
            taxableIncome: taxableAmount,
            taxBeforeCredits: calculatedTax,
            taxCredits: 0,
            finalTax: totalTax
          }
        },
        appliedRates: [{ range: `${(taxRate * 100).toFixed(1)}%`, rate: taxRate, amount: calculatedTax }],
        deductions: effectiveTransferType === 'sale' ? [{ type: 'basic', label: '기본공제', amount: basicDeduction }] : []
      };
    } catch (error) {
      console.error('주식양도소득세 계산 오류:', error);
      throw new Error('주식양도소득세 계산 중 오류가 발생했습니다.');
    }
  };

  // 🔥 대주주 판정 함수 추가
  const determineLargeShareholderStatus = (input: any): boolean => {
    const stockType = input.stockType;
    const personalRatio = input.personalShareholdingRatio || (input.stockQuantity / input.totalSharesOutstanding * 100) || 0;
    const familyRatio = input.familyShareholdingRatio || 0;
    const totalRatio = personalRatio + familyRatio;
    const stockValue = input.totalValue || (input.stockQuantity * input.pricePerShare) || 0;

    // 상장주식 대주주 판정 기준
    if (stockType === 'listed' || stockType === 'kosdaq') {
      return personalRatio >= 1 || // 본인 지분율 1% 이상
             totalRatio >= 1 ||    // 특수관계인 포함 1% 이상  
             stockValue >= 10000000000; // 보유가액 100억원 이상
    } 
    // 비상장주식 대주주 판정 기준
    else {
      return personalRatio >= 4 || // 본인 지분율 4% 이상
             totalRatio >= 4 ||    // 특수관계인 포함 4% 이상
             stockValue >= 10000000000; // 보유가액 100억원 이상
    }
  };

  const handleCalculate = async () => {
    try {
      // 🔥 세제혜택 확인 로직
      const hasNoIncentives = !formData.isStartupStock && !formData.isSmallMediumStock && !formData.qualifiesForTaxIncentive;
      
      if (hasNoIncentives && formData.transferType === 'sale') {
        const confirmMessage = `현재 특례나 세제혜택이 적용되지 않은 상태입니다.

벤처기업주식(50% 감면)이나 중소기업주식(10% 감면)에 해당하는지 확인하셨나요?

그대로 계산을 진행하시겠습니까?`;
        
        const shouldContinue = window.confirm(confirmMessage);
        if (!shouldContinue) {
          // 고급 설정 탭으로 이동하여 세제혜택 설정 유도
          setShowAdvanced(true);
          setActiveStep(4);
          return;
        }
      }

      const inputData = {
        ...formData,
        companyName: formData.companyName || '회사명 미입력',
        holdingPeriod: formData.holdingPeriod || formData.holdingYears * 12 || 0,
        acquisitionDate: formData.acquisitionDate || new Date(),
        transferDate: formData.transferDate || new Date(),
        totalValue,
        personalShareholdingRatio: shareholdingRatio / 100,
        familyShareholdingRatio: formData.familyShareholdingRatio || 0,
        totalOwnedShares: formData.totalOwnedShares || formData.stockQuantity || 0,
        previousGiftHistory: formData.previousGiftHistory || [],
        transferorAge: formData.transferorAge || 0,
        transfereeAge: formData.transfereeAge || 0
      };

      // 내장 계산 함수 사용
      const calculatedResult = calculateStockTransferTax(inputData);

      setResult(calculatedResult);

      // 🔥 비교모드가 활성화된 경우 추가 시나리오들을 자동 계산
      if (comparisonMode) {
        const scenarios: {[key: string]: StockTransferResult} = {};

        // 1. 증여 시나리오 (양도에서 증여로 변경)
        if (formData.transferType === 'sale') {
          try {
            const giftScenario = {
              ...inputData,
              transferType: 'gift' as const,
              transferPrice: totalValue,
              relationship: 'lineal_descendant' as const
            };
            scenarios.gift = calculateStockTransferTax(giftScenario);
          } catch (error) {
            console.log('증여 시나리오 계산 실패:', error);
          }
        }

        // 2. 장기보유 시나리오 (3년 보유 가정)
        try {
          const longTermScenario = {
            ...inputData,
            holdingYears: Math.max(3, inputData.holdingYears),
            isStartupStock: inputData.isStartupStock,
            isSmallMediumStock: inputData.isSmallMediumStock
          };
          scenarios.longTerm = calculateStockTransferTax(longTermScenario);
        } catch (error) {
          console.log('장기보유 시나리오 계산 실패:', error);
        }

        // 3. 분할 양도 시나리오 (50% 분할)
        try {
          const splitScenario = {
            ...inputData,
            stockQuantity: Math.floor(inputData.stockQuantity / 2),
            transferPrice: Math.floor((inputData.transferPrice || 0) / 2),
            acquisitionPrice: Math.floor(inputData.acquisitionPrice / 2)
          };
          const splitResult = calculateStockTransferTax(splitScenario);
          // 2회 양도로 가정하여 세액 2배
          scenarios.split = {
            ...splitResult,
            totalTax: (splitResult.totalTax || 0) * 2,
            calculatedTax: (splitResult.calculatedTax || 0) * 2,
            localIncomeTax: (splitResult.localIncomeTax || 0) * 2
          };
        } catch (error) {
          console.log('분할 양도 시나리오 계산 실패:', error);
        }

        // 4. 세제혜택 최대 적용 시나리오
        try {
          const optimizedScenario = {
            ...inputData,
            isStartupStock: true,
            isSmallMediumStock: true,
            qualifiesForTaxIncentive: true,
            holdingYears: Math.max(2, inputData.holdingYears)
          };
          scenarios.optimized = calculateStockTransferTax(optimizedScenario);
        } catch (error) {
          console.log('최적화 시나리오 계산 실패:', error);
        }

        // 5. 비거주자 시나리오
        try {
          const foreignScenario = {
            ...inputData,
            transfereeResidence: 'foreign' as const
          };
          scenarios.foreign = calculateStockTransferTax(foreignScenario);
        } catch (error) {
          console.log('비거주자 시나리오 계산 실패:', error);
        }

        // 비교 결과 저장
        setComparisonResults({
          original: calculatedResult,
          optimized: scenarios.optimized || null,
          scenarios
        });

        console.log('비교모드 계산 완료:', {
          original: calculatedResult,
          scenarios: Object.keys(scenarios)
        });
      }
    } catch (error) {
      console.error('계산 오류:', error);
      alert('계산 중 오류가 발생했습니다. 입력값을 확인해주세요.');
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 자동 계산 상태 리셋 (사용자가 수동으로 변경한 경우)
    if (['totalValue', 'personalShareholdingRatio', 'familyShareholdingRatio', 'holdingYears'].includes(field)) {
      setAutoCalculations(auto => ({...auto, [field]: false}));
    }
  };

  // 🔴 필수 필드 강화된 스마트 입력 필드 컴포넌트
  const SmartNumberInput = ({ 
    label, 
    field, 
    value, 
    placeholder,
    suffix = '',
    autoCalculated = false,
    formula = '',
    disabled = false,
    min = 0,
    max,
    step = 1,
    helpText = '',
    required = false
  }: {
    label: string;
    field: keyof FormData;
    value: number;
    placeholder?: string;
    suffix?: string;
    autoCalculated?: boolean;
    formula?: string;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    helpText?: string;
    required?: boolean;
  }) => {
    const hasError = validationErrors[field];
    const isAutoCalculated = autoCalculations[field];
    
    // 🔴 필수 필드 상태 계산
    const isCompleted = value > 0 && !hasError;
    const isRequiredAndEmpty = required && value === 0;
    
    // 로컬 입력 상태 관리 (천단위 구분기호 포함)
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
    
    const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // 천단위 구분기호와 함께 숫자 입력 처리
      const formattedValue = handleNumberInputChange(
        inputValue,
        (num) => handleInputChange(field, num),
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
        handleInputChange(field, 0);
      } else {
        // 범위 체크 후 정규화
        let finalValue = rawNumber;
        if (min !== undefined && rawNumber < min) finalValue = min;
        if (max !== undefined && rawNumber > max) finalValue = max;
        
        setLocalValue(formatNumberInput(finalValue));
        handleInputChange(field, finalValue);
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
    
    return (
      <div className="space-y-2">
        {/* 🔴 개선된 라벨 (필수 필드 강조) */}
        <div className="flex items-center justify-between">
          <Label className={`
            flex items-center gap-2 text-sm font-medium
            ${required && !isCompleted ? 'text-red-700 font-semibold' : 
              required && isCompleted ? 'text-green-700 font-semibold' : 
              'text-gray-700'}
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
            
            {/* 자동계산 표시 */}
            {isAutoCalculated && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                ⚡ 자동계산
              </Badge>
            )}
            
            {/* 오류 표시 */}
            {hasError && (
              <Badge variant="destructive" className="text-xs">
                ⚠️ 오류
              </Badge>
            )}
          </Label>
          
          {/* 수식 표시 */}
          {formula && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {formula}
            </div>
          )}
        </div>
        
        {/* 🔴 개선된 입력 필드 */}
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric"
            value={localValue}
            onChange={handleLocalInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={required ? `${placeholder || "숫자를 입력하세요"} (필수)` : placeholder || "숫자를 입력하세요"}
            disabled={disabled}
            autoComplete="off"
            title={label}
            aria-label={label}
            aria-required={required}
            aria-invalid={!!hasError}
            className={`
              ${hasError ? 'border-red-500 bg-red-50 focus:border-red-500' :
                isRequiredAndEmpty ? 'border-red-400 border-2 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' :
                required && isCompleted ? 'border-green-500 bg-green-50 focus:border-green-500' :
                isAutoCalculated ? 'border-green-500 bg-green-50' :
                isCompleted ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}
              ${suffix ? 'pr-12' : ''} 
              text-right font-mono transition-all duration-200
            `}
          />
          
          {suffix && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {suffix}
            </span>
          )}
          
          {/* 🔴 필수 필드 시각적 표시 */}
          {required && !isCompleted && (
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
        </div>
        
        {/* 입력 도움말 */}
        {helpText && (
          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
            💡 {helpText}
          </div>
        )}
        
        {/* 포커스 시 사용법 안내 */}
        {isFocused && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
            💡 숫자만 입력하세요. 천단위 쉼표는 자동으로 표시됩니다.
            {min !== undefined && ` (최소: ${formatNumber(min)})`}
            {max !== undefined && ` (최대: ${formatNumber(max)})`}
          </div>
        )}
        
        {/* 🔴 개선된 오류 메시지 (필수 필드 강조) */}
        {hasError && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">⚠️</span>
              <span>{hasError}</span>
              {required && hasError.includes('필수') && (
                <Badge variant="destructive" className="text-xs ml-2">
                  REQUIRED
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* 🔴 필수 필드 완료 안내 */}
        {required && isCompleted && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
            ✅ 필수 입력이 완료되었습니다: {formatNumber(value)}
          </div>
        )}
        
        {/* 자동 계산 표시 */}
        {isAutoCalculated && formula && !hasError && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
            ✅ 자동 계산됨: {formula}
          </div>
        )}
      </div>
    );
  };

  const loadSampleCase = (caseType: string) => {
    const selectedCase = sampleCases[caseType as keyof typeof sampleCases];
    if (selectedCase) {
      setFormData(prev => ({
        ...prev,
        ...selectedCase
      }));
      setCurrentSampleCase(caseType);
      setActiveStep(1);
      console.log(`${selectedCase.companyName} 샘플 케이스가 로드되었습니다.`);
    }
  };

  // 🔥 초기화 함수
  const resetAllData = () => {
    const confirmReset = window.confirm('모든 입력값을 초기화하시겠습니까?');
    if (confirmReset) {
      setFormData({
        stockType: 'listed',
        transferType: 'sale',
        companyName: '',
        stockQuantity: 0,
        pricePerShare: 0,
        totalValue: 0,
        holdingPeriod: 0,
        holdingYears: 0,
        acquisitionPrice: 0,
        acquisitionDate: new Date(),
        totalSharesOutstanding: 0,
        personalShareholdingRatio: 0,
        spouseShareholdingRatio: 0,
        linealRelativeShareholdingRatio: 0,
        familyShareholdingRatio: 0,
        totalOwnedShares: 0,
        transferPrice: 0,
        transferDate: new Date(),
        transferExpenses: 0,
        transferorAge: 0,
        transfereeAge: 0,
        relationship: 'lineal_descendant',
        transfereeResidence: 'domestic',
        hasOtherCapitalGains: false,
        previousGiftHistory: [],
        otherIncomeAmount: 0,
        comprehensiveIncomeTaxPayer: false,
        isStartupStock: false,
        isSmallMediumStock: false,
        qualifiesForTaxIncentive: false
      });
      setResult(null);
      setCurrentSampleCase(null);
      setActiveStep(1);
      setValidationErrors({});
      setAutoCalculations({});
      setComparisonResults({
        original: null,
        optimized: null,
        scenarios: {}
      });
      console.log('모든 데이터가 초기화되었습니다.');
    }
  };

  // formatCurrency 함수를 제거하고 통합된 formatWon 사용

  const calculateProgress = () => {
    const requiredFields = ['stockQuantity', 'pricePerShare', 'acquisitionPrice'];
    const filledFields = requiredFields.filter(field => {
      const value = formData[field as keyof FormData];
      return typeof value === 'number' && value > 0;
    });
    return (filledFields.length / requiredFields.length) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 🔥 개선된 헤더 - 사용법 가이드 포함 */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">주식이동세금 통합 계산기</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">실무 수준 주식이동세금 계산</h1>
        <p className="text-gray-600">대주주 판정부터 최적 이동 방식 추천까지 원스톱 서비스</p>
        
        {/* 🎯 사용법 가이드 버튼 */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            📖 사용법 가이드
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCalculationSummary(true)}
            className="flex items-center gap-2"
            disabled={calculateProgress() < 50}
          >
            <CheckCircle className="w-4 h-4" />
            📋 계산 요약 확인
          </Button>
        </div>
        
        {/* 진행률 및 단계 안내 */}
        <div className="mt-4 max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>입력 진행률</span>
            <span>{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
          
          {/* 현재 단계 안내 */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                {activeStep === 1 && "📝 1단계: 기본정보 입력"}
                {activeStep === 2 && "📊 2단계: 지분현황 입력"}
                {activeStep === 3 && "💹 3단계: 거래정보 입력"}
                {activeStep === 4 && "⚙️ 4단계: 특례 및 고급설정"}
              </span>
              <Badge variant={calculateProgress() >= 75 ? "default" : "secondary"}>
                {calculateProgress() < 25 && "입력 시작"}
                {calculateProgress() >= 25 && calculateProgress() < 50 && "기본 입력 완료"}
                {calculateProgress() >= 50 && calculateProgress() < 75 && "상세 입력 진행"}
                {calculateProgress() >= 75 && "계산 준비 완료"}
              </Badge>
            </div>
            
            {/* 단계별 필수 입력 안내 */}
            <div className="mt-2 text-xs text-gray-600">
              {activeStep === 1 && "필수: 회사명, 주식 종류, 수량, 가격"}
              {activeStep === 2 && "필수: 총발행주식수, 보유주식수 (대주주 판정용)"}
              {activeStep === 3 && "필수: 취득가액, 양도가액 (거래 유형별 상세정보)"}
              {activeStep === 4 && "선택: 세제혜택, 거주자 구분, 추가 공제사항"}
            </div>
          </div>
        </div>
        
        {/* 🔥 적용된 특례/옵션 실시간 표시 */}
        {(formData.isStartupStock || formData.isSmallMediumStock || showAdvanced || comparisonMode) && (
          <div className="mt-4 max-w-4xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-3">✅ 적용 중인 옵션들</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {formData.isStartupStock && (
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    🚀 벤처기업주식 50% 감면
                  </Badge>
                )}
                {formData.isSmallMediumStock && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                    🏭 중소기업주식 10% 감면
                  </Badge>
                )}
                {showAdvanced && (
                  <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                    ⚙️ 고급설정 활성화
                  </Badge>
                )}
                {comparisonMode && (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                    📊 비교모드 활성화
                  </Badge>
                )}
                {formData.transfereeResidence === 'foreign' && (
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                    🌏 비거주자 과세
                  </Badge>
                )}
                {holdingPeriod.years >= 3 && (
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300">
                    ⏰ 장기보유 ({holdingPeriod.years}년)
                  </Badge>
                )}
              </div>
              
              {/* 예상 절세효과 미리보기 */}
              {(formData.isStartupStock || formData.isSmallMediumStock) && capitalGain > 0 && (
                <div className="mt-3 p-2 bg-white rounded border text-sm">
                  <span className="text-green-700">💰 예상 절세효과: </span>
                  <span className="font-bold text-green-800">
                    {formatWon(capitalGain * (formData.isStartupStock ? 0.1 : 0.02))} 
                    ({formData.isStartupStock ? '50%' : '10%'} 감면 적용)
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 250자 요약 면책 조항 */}
      <TaxCalculatorDisclaimer variant="summary" />

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    주식이동 정보 입력
                  </CardTitle>
                  <CardDescription>
                    정확한 계산을 위해 상세 정보를 입력해주세요
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={comparisonMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setComparisonMode(!comparisonMode)}
                      className="flex items-center gap-2 min-w-[140px]"
                    >
                      <TrendingUp className="w-4 h-4" />
                      비교 모드
                      {comparisonMode && <CheckCircle className="w-4 h-4" />}
                    </Button>
                    <p className="text-xs text-gray-600 max-w-[140px]">
                      양도·증여·상속 세금을 한번에 비교
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant={showAdvanced ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-2 min-w-[140px]"
                    >
                      <HelpCircle className="w-4 h-4" />
                      고급 설정
                      {showAdvanced && <CheckCircle className="w-4 h-4" />}
                    </Button>
                    <p className="text-xs text-gray-600 max-w-[140px]">
                      세부 계산 옵션 및 특례 적용
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAllData}
                      className="flex items-center gap-2 min-w-[140px] text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      초기화
                    </Button>
                    <p className="text-xs text-gray-600 max-w-[140px]">
                      모든 입력값을 초기화
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <Tabs value={`step-${activeStep}`} onValueChange={(value) => setActiveStep(Number(value.split('-')[1]))}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="step-1" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    기본정보
                  </TabsTrigger>
                  <TabsTrigger value="step-2" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    지분현황
                  </TabsTrigger>
                  <TabsTrigger value="step-3" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    거래정보
                  </TabsTrigger>
                  <TabsTrigger value="step-4" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    특례적용
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="step-1" className="space-y-6">
                  {/* 🔥 자동 계산 대시보드 */}
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
                        {/* 총 주식 가치 */}
                        <div className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">총 주식 가치</span>
                            {autoCalculations.totalValue && (
                              <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                            )}
                          </div>
                          <div className="text-lg font-bold text-purple-700">
                            {formatWon(totalValue)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            = {formatNumber(formData.stockQuantity)} × {formatNumber(formData.pricePerShare)}
                          </div>
                        </div>

                        {/* 지분율 */}
                        <div className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">보유 지분율</span>
                            {autoCalculations.shareholdingRatio && (
                              <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                            )}
                          </div>
                          <div className="text-lg font-bold text-purple-700">
                            {shareholdingRatio.toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            본인 지분율
                          </div>
                        </div>

                        {/* 가족 지분율 */}
                        <div className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">가족 지분율</span>
                            {autoCalculations.familyShareholdingRatio && (
                              <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                            )}
                          </div>
                          <div className="text-lg font-bold text-purple-700">
                            {familyShareholdingRatio.toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            본인 + 배우자 + 직계
                          </div>
                        </div>

                        {/* 대주주 판정 */}
                        <div className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">대주주 판정</span>
                            <Badge className={`text-xs ${isLargeShareholder ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-blue-100 text-blue-700 border-blue-300'}`}>
                              {isLargeShareholder ? '대주주' : '소액주주'}
                            </Badge>
                          </div>
                          <div className={`text-lg font-bold ${isLargeShareholder ? 'text-orange-700' : 'text-blue-700'}`}>
                            {isLargeShareholder ? '과세 대상' : '비과세'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formData.stockType === 'listed' ? '상장: 1%/100억' : '비상장: 4%/100억'}
                          </div>
                        </div>
                      </div>

                      {/* 보유기간 정보 */}
                      {formData.acquisitionDate && formData.transferDate && (
                        <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">📅 보유기간 자동 계산</span>
                            {autoCalculations.holdingYears && (
                              <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                            )}
                          </div>
                          <div className="text-lg font-bold text-purple-700">
                            {holdingPeriod.years}년 {holdingPeriod.months}개월 {holdingPeriod.days}일
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            취득일: {new Date(formData.acquisitionDate).toLocaleDateString('ko-KR')} → 
                            양도일: {new Date(formData.transferDate).toLocaleDateString('ko-KR')}
                          </div>
                        </div>
                      )}

                      {/* 세제혜택 자동 판정 */}
                      <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">🎁 세제혜택 자동 판정</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className={`text-center p-2 rounded text-xs ${taxIncentiveEligibility.venture ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            벤처기업<br/>{taxIncentiveEligibility.venture ? '✅ 50% 감면' : '❌ 미해당'}
                          </div>
                          <div className={`text-center p-2 rounded text-xs ${taxIncentiveEligibility.smallMedium ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            중소기업<br/>{taxIncentiveEligibility.smallMedium ? '✅ 10% 감면' : '❌ 미해당'}
                          </div>
                          <div className={`text-center p-2 rounded text-xs ${taxIncentiveEligibility.longTerm ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            장기보유<br/>{taxIncentiveEligibility.longTerm ? '✅ 감면 대상' : '❌ 3년 미만'}
                          </div>
                          <div className={`text-center p-2 rounded text-xs ${taxIncentiveEligibility.pension ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            연금계좌<br/>{taxIncentiveEligibility.pension ? '✅ 비과세' : '❌ 미해당'}
                          </div>
                        </div>
                      </div>

                      {/* 실시간 수익성 분석 */}
                      {(formData.acquisitionPrice > 0 && ((formData.transferPrice || 0) > 0 || formData.transferType === 'sale')) && (
                        <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                          <div className="text-sm font-medium text-gray-700 mb-3">📊 실시간 수익성 분석</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* 양도차익 */}
                            <div className="text-center">
                              <div className="text-xs text-gray-600">양도차익</div>
                              <div className={`text-sm font-bold ${capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {capitalGain >= 0 ? '+' : ''}{formatWon(capitalGain)}
                              </div>
                            </div>
                            
                            {/* 수익률 */}
                            <div className="text-center">
                              <div className="text-xs text-gray-600">총 수익률</div>
                              <div className={`text-sm font-bold ${profitRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(1)}%
                              </div>
                            </div>
                            
                            {/* 연환산 수익률 */}
                            <div className="text-center">
                              <div className="text-xs text-gray-600">연환산 수익률</div>
                              <div className={`text-sm font-bold ${annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {holdingPeriod.years > 0 ? `${annualizedReturn >= 0 ? '+' : ''}${annualizedReturn.toFixed(1)}%` : 'N/A'}
                              </div>
                            </div>
                            
                            {/* 투자 기간 */}
                            <div className="text-center">
                              <div className="text-xs text-gray-600">보유기간</div>
                              <div className="text-sm font-bold text-purple-600">
                                {holdingPeriod.years > 0 ? `${(holdingPeriod.years + holdingPeriod.months / 12).toFixed(1)}년` : 'N/A'}
                              </div>
                            </div>
                          </div>
                          
                          {/* 투자 성과 요약 */}
                          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                            <span className="text-gray-600">
                              투자원금 {formatWon(formData.acquisitionPrice)} → 
                              회수금액 {formatWon(formData.transferPrice || 0)} 
                              {capitalGain > 0 && holdingPeriod.years > 0 && (
                                <span className="text-green-600 font-medium">
                                  (연평균 {annualizedReturn.toFixed(1)}% 수익)
                                </span>
                              )}
                            </span>
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
                          <div className="mt-2 text-xs text-red-500">
                            💡 위 문제들을 해결하면 더 정확한 계산이 가능합니다.
                          </div>
                        </div>
                      )}

                      {/* 입력값 검증 결과 */}
                      {Object.keys(validationErrors).length > 0 && (
                        <div className="mt-4 p-3 bg-orange-50 rounded border border-orange-200">
                          <div className="text-sm font-medium text-orange-700 mb-2">⚠️ 입력값 검증 경고</div>
                          <div className="space-y-1">
                            {Object.entries(validationErrors).map(([field, error]) => (
                              <div key={field} className="text-xs text-orange-600 flex items-start gap-2">
                                <span className="text-orange-500">•</span>
                                <span>{error}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 계산 준비 상태 */}
                      {logicalErrors.length === 0 && Object.keys(validationErrors).length === 0 && formData.stockQuantity > 0 && formData.acquisitionPrice > 0 && (
                        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                          <div className="text-sm font-medium text-green-700 mb-2">✅ 계산 준비 완료</div>
                          <div className="text-xs text-green-600">
                            모든 필수 정보가 올바르게 입력되었습니다. 하단의 "세금 계산하기" 버튼을 클릭하여 정확한 세금을 계산해보세요.
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* 샘플 케이스 선택 */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
                        <FileText className="w-5 h-5" />
                        📋 실무 사례 샘플 (16가지)
                      </CardTitle>
                      <CardDescription className="text-blue-600">
                        다양한 실무 상황별 주식이동 사례를 선택하여 빠르게 시뮬레이션해보세요
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="basic">기본 케이스</TabsTrigger>
                          <TabsTrigger value="advanced">고급 케이스</TabsTrigger>
                          <TabsTrigger value="special">특수 상황</TabsTrigger>
                          <TabsTrigger value="inheritance">상속/증여</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('listedLargeShareholder')}
                              className="h-auto p-3 text-left flex-col items-start w-full touch-manipulation"
                            >
                              <div className="font-medium text-xs lg:text-sm">🏢 상장주식 대주주</div>
                              <div className="text-xs text-gray-600 mt-1">삼성전자 2% 보유</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('unlistedSmallShareholder')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">🏭 비상장 소액주주</div>
                              <div className="text-xs text-gray-600 mt-1">중소기업 1% 보유</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('kosdaqIPO')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">📈 코스닥 IPO</div>
                              <div className="text-xs text-gray-600 mt-1">바이오테크 상장 수익</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('employeeStock')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">👥 우리사주조합</div>
                              <div className="text-xs text-gray-600 mt-1">현대차 임직원 주식</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('realEstateREIT')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">🏠 리츠 투자</div>
                              <div className="text-xs text-gray-600 mt-1">부동산 간접투자</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('pensionAccount')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">💰 연금계좌</div>
                              <div className="text-xs text-gray-600 mt-1">ETF 투자 수익</div>
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="advanced" className="space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('stockOptions')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">⚡ 스톡옵션</div>
                              <div className="text-xs text-gray-600 mt-1">테크기업 임직원</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('startupExit')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">🦄 스타트업 엑싯</div>
                              <div className="text-xs text-gray-600 mt-1">유니콘 기업 매각</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('mergersAcquisition')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">🤝 M&A</div>
                              <div className="text-xs text-gray-600 mt-1">기업 인수합병</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('convertibleBond')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">🔄 전환사채</div>
                              <div className="text-xs text-gray-600 mt-1">CB 전환 후 매도</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('foreignInvestor')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">🌏 외국인 투자자</div>
                              <div className="text-xs text-gray-600 mt-1">해외 거주자 매도</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('smallBusinessSpecial')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">🏅 중소기업 특례</div>
                              <div className="text-xs text-gray-600 mt-1">세제혜택 적용</div>
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="special" className="space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('ventureStock')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">🚀 벤처기업 주식</div>
                              <div className="text-xs text-gray-600 mt-1">50% 세액감면</div>
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="inheritance" className="space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('spouseGift')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">💑 배우자 증여</div>
                              <div className="text-xs text-gray-600 mt-1">6억 공제한도</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('inheritanceCase')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">👨‍👩‍👧‍👦 상속 주식</div>
                              <div className="text-xs text-gray-600 mt-1">SK하이닉스 상속</div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadSampleCase('familyBusiness')}
                              className="h-auto p-3 text-left flex-col items-start"
                            >
                              <div className="font-medium text-xs">🏛️ 가업승계</div>
                              <div className="text-xs text-gray-600 mt-1">경영권 승계 증여</div>
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700 text-sm">
                          <Info className="w-4 h-4" />
                          <span>각 샘플은 실제 실무에서 자주 발생하는 상황을 기반으로 제작되었습니다</span>
                        </div>
                        {currentSampleCase && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                            <div className="flex items-center gap-2 text-green-700 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              <span>현재 로드된 샘플: {sampleCases[currentSampleCase as keyof typeof sampleCases]?.companyName}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 🎯 기본 정보 입력 (스마트 필드) */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        📝 기본 정보 입력
                      </CardTitle>
                      <CardDescription>
                        입력하는 즉시 관련 값들이 자동으로 계산됩니다
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 회사명 */}
                        <div className="space-y-2">
                          <Label>회사명</Label>
                          <Input
                            value={formData.companyName || ''}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            placeholder="예: 삼성전자"
                          />
                        </div>

                        {/* 주식 종류 */}
                        <div className="space-y-2">
                          <Label>주식 종류</Label>
                          <Select 
                            value={formData.stockType} 
                            onValueChange={(value) => handleInputChange('stockType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="listed">상장주식 (KOSPI)</SelectItem>
                              <SelectItem value="kosdaq">코스닥 주식</SelectItem>
                              <SelectItem value="konex">코넥스 주식</SelectItem>
                              <SelectItem value="unlisted">비상장주식</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* 거래 유형 */}
                        <div className="space-y-2">
                          <Label>거래 유형</Label>
                          <Select 
                            value={formData.transferType} 
                            onValueChange={(value) => handleInputChange('transferType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sale">💰 양도 (매도)</SelectItem>
                              <SelectItem value="gift">🎁 증여</SelectItem>
                              <SelectItem value="inheritance">👨‍👩‍👧‍👦 상속</SelectItem>
                              <SelectItem value="dividend">📈 배당</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* 빈 공간 */}
                        <div></div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 매입(보유) 수량 */}
                        <SmartNumberInput
                          label="💰 매입 주식 수량"
                          field="stockQuantity"
                          value={formData.stockQuantity}
                          placeholder="보유하고 있는 주식 수"
                          suffix="주"
                          step={1}
                          helpText="현재 보유하고 있거나 매도할 주식의 총 수량입니다. 대주주 판정에 영향을 줍니다."
                          required={true}
                        />

                        {/* 매입(주당) 가격 */}
                        <SmartNumberInput
                          label="💵 현재 주당 가격"
                          field="pricePerShare"
                          value={formData.pricePerShare}
                          placeholder="매도 예정 주당 가격"
                          suffix="원"
                          helpText="현재 시점의 주당 가격입니다. 상장주식은 현재가, 비상장주식은 평가가액을 입력하세요."
                          required={true}
                        />

                        {/* 총 주식 가치 (자동 계산) */}
                        <SmartNumberInput
                          label="📊 총 주식 가치 (자동계산)"
                          field="totalValue"
                          value={totalValue}
                          formula="주식수 × 주당가격"
                          suffix="원"
                          autoCalculated={true}
                          disabled={true}
                          helpText="주식 수량과 주당 가격으로 자동 계산됩니다. 대주주 판정(100억원 기준)에 사용됩니다."
                        />

                        {/* 최초 취득가액 */}
                        <SmartNumberInput
                          label="🏷️ 최초 매입가액 (총액)"
                          field="acquisitionPrice"
                          value={formData.acquisitionPrice}
                          placeholder="처음 주식을 산 총 가격"
                          suffix="원"
                          helpText="주식을 처음 취득할 때 실제로 지불한 총 금액입니다. 양도소득세 계산의 기준이 됩니다."
                          required={true}
                        />
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 취득일 */}
                        <div className="space-y-2">
                          <Label>취득일</Label>
                          <Input
                            type="date"
                            value={formData.acquisitionDate ? new Date(formData.acquisitionDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleInputChange('acquisitionDate', new Date(e.target.value))}
                          />
                        </div>

                        {/* 양도일 */}
                        <div className="space-y-2">
                          <Label>양도일</Label>
                          <Input
                            type="date"
                            value={formData.transferDate ? new Date(formData.transferDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleInputChange('transferDate', new Date(e.target.value))}
                          />
                        </div>

                        {/* 보유기간 (자동 계산) */}
                        {formData.acquisitionDate && formData.transferDate && (
                          <div className="md:col-span-2">
                            <div className="p-3 bg-green-50 rounded border border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Label className="text-green-700">📅 보유기간 (자동 계산)</Label>
                                <Badge className="text-xs bg-green-100 text-green-700 border-green-300">⚡ 자동계산</Badge>
                              </div>
                              <div className="text-lg font-bold text-green-700">
                                {holdingPeriod.years}년 {holdingPeriod.months}개월 {holdingPeriod.days}일
                              </div>
                              <div className="text-sm text-green-600 mt-1">
                                정확한 보유기간: {(holdingPeriod.years + holdingPeriod.months / 12).toFixed(2)}년
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 현재 로드된 케이스 정보 */}
                  {currentSampleCase && (
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
                          <CheckCircle className="w-5 h-5" />
                          🎯 로드된 샘플 케이스
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-white p-4 rounded border border-green-200">
                          {currentSampleCase === 'listedLargeShareholder' && (
                            <div>
                              <h4 className="font-semibold text-green-800 mb-2">🏢 상장주식 대주주 양도 케이스</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><strong>특징:</strong> 삼성전자 주식 15억원 규모</p>
                                  <p><strong>대주주 여부:</strong> 가액 기준 대주주</p>
                                  <p><strong>적용 세율:</strong> 20% (2년 이상 보유)</p>
                                </div>
                                <div>
                                  <p><strong>양도차익:</strong> 3억원</p>
                                  <p><strong>예상 세액:</strong> 약 6천만원</p>
                                  <p><strong>특이사항:</strong> 상장주식 대주주 과세</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCurrentSampleCase(null)}
                            className="text-green-700 border-green-300"
                          >
                            케이스 해제
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 기본 입력 필드들 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>주식 유형</Label>
                        <Select
                          value={formData.stockType}
                          onValueChange={(value) => handleInputChange('stockType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="listed">상장주식</SelectItem>
                            <SelectItem value="unlisted">비상장주식</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>이동 방식</Label>
                        <Select
                          value={formData.transferType}
                          onValueChange={(value) => handleInputChange('transferType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sale">양도 (매매)</SelectItem>
                            <SelectItem value="gift">증여</SelectItem>
                            <SelectItem value="inheritance">상속</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>회사명</Label>
                        <Input
                          placeholder="회사명을 입력하세요"
                          value={formData.companyName || ''}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>주식 수량</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.stockQuantity || ''}
                          onChange={(e) => handleInputChange('stockQuantity', Math.round(Number(e.target.value)))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>주당 가격 (원)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.pricePerShare || ''}
                          onChange={(e) => handleInputChange('pricePerShare', Math.round(Number(e.target.value)))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>총 주식가액</Label>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <span className="text-lg font-semibold text-blue-600">
                            {formatWon(totalValue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="step-2" className="space-y-6">
                  {/* 🔥 지분현황 스마트 계산 패널 */}
                  <Card className="border-indigo-200 bg-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-indigo-700">
                        <Users className="w-5 h-5" />
                        👥 지분현황 스마트 계산 패널
                      </CardTitle>
                      <CardDescription className="text-indigo-600">
                        지분율과 대주주 판정이 실시간으로 자동 계산됩니다
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* 개인 지분율 */}
                        <div className="bg-white p-4 rounded border border-indigo-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">개인 지분율</span>
                            <Badge className="text-xs bg-indigo-100 text-indigo-700 border-indigo-300">실시간</Badge>
                          </div>
                          <div className="text-2xl font-bold text-indigo-700">
                            {shareholdingRatio.toFixed(3)}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatNumber(formData.totalOwnedShares || 0)} ÷ {formatNumber(formData.totalSharesOutstanding || 0)}
                          </div>
                        </div>

                        {/* 가족 지분율 */}
                        <div className="bg-white p-4 rounded border border-indigo-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">가족 지분율</span>
                            <Badge className="text-xs bg-indigo-100 text-indigo-700 border-indigo-300">자동합계</Badge>
                          </div>
                          <div className="text-2xl font-bold text-indigo-700">
                            {familyShareholdingRatio.toFixed(3)}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            본인 + 배우자 + 직계
                          </div>
                        </div>

                        {/* 대주주 판정 */}
                        <div className="bg-white p-4 rounded border border-indigo-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">대주주 판정</span>
                            <Badge className={`text-xs ${isLargeShareholder ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'}`}>
                              {isLargeShareholder ? '대주주' : '소액주주'}
                            </Badge>
                          </div>
                          <div className={`text-2xl font-bold ${isLargeShareholder ? 'text-red-700' : 'text-green-700'}`}>
                            {isLargeShareholder ? '과세' : '비과세'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formData.stockType === 'listed' ? '기준: 1% 또는 100억' : '기준: 4% 또는 100억'}
                          </div>
                        </div>
                      </div>

                      {/* 대주주 판정 상세 */}
                      <div className="bg-white p-4 rounded border border-indigo-200">
                        <h4 className="font-semibold text-indigo-700 mb-3">🔍 대주주 판정 상세</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">지분율 테스트:</span>
                              <span className={`text-sm font-medium ${
                                shareholdingRatio >= (formData.stockType === 'listed' ? 1 : 4) ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {shareholdingRatio.toFixed(3)}% {shareholdingRatio >= (formData.stockType === 'listed' ? 1 : 4) ? '≥' : '<'} {formData.stockType === 'listed' ? '1%' : '4%'}
                                {shareholdingRatio >= (formData.stockType === 'listed' ? 1 : 4) ? ' ✅' : ' ❌'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">가액 테스트:</span>
                              <span className={`text-sm font-medium ${
                                totalValue >= 10000000000 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {formatWon(totalValue)} {totalValue >= 10000000000 ? '≥' : '<'} 100억원
                                {totalValue >= 10000000000 ? ' ✅' : ' ❌'}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-gray-600">최종 판정:</span>
                              <span className={`ml-2 font-bold ${isLargeShareholder ? 'text-red-600' : 'text-green-600'}`}>
                                {isLargeShareholder ? '대주주 (둘 중 하나라도 충족)' : '소액주주 (둘 다 미충족)'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              • 상장주식: 1% 이상 또는 100억원 이상<br/>
                              • 비상장주식: 4% 이상 또는 100억원 이상
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 지분현황 입력 폼 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        📊 지분현황 입력
                      </CardTitle>
                      <CardDescription>
                        정확한 지분율 계산을 위해 상세 정보를 입력해주세요
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 총 발행 주식 수 */}
                        <SmartNumberInput
                          label="총 발행 주식 수"
                          field="totalSharesOutstanding"
                          value={formData.totalSharesOutstanding || 0}
                          placeholder="회사 전체 발행 주식 수"
                          suffix="주"
                          step={1}
                        />

                        {/* 보유 주식 수 */}
                        <SmartNumberInput
                          label="본인 보유 주식 수"
                          field="totalOwnedShares"
                          value={formData.totalOwnedShares || 0}
                          placeholder="본인이 보유한 주식 수"
                          suffix="주"
                          step={1}
                        />

                        {/* 본인 지분율 (자동 계산) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              본인 지분율 (자동 계산)
                              <Badge className="text-xs bg-green-100 text-green-700 border-green-300">⚡ 자동계산</Badge>
                            </Label>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              보유주식 ÷ 총발행주식 × 100
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="text-lg font-bold text-green-700">
                              {shareholdingRatio.toFixed(6)}%
                            </div>
                            <div className="text-sm text-green-600">
                              {formatNumber(formData.totalOwnedShares || 0)} ÷ {formatNumber(formData.totalSharesOutstanding || 0)} × 100
                            </div>
                          </div>
                        </div>

                        {/* 빈 공간 */}
                        <div></div>

                        {/* 배우자 지분율 */}
                        <SmartNumberInput
                          label="배우자 지분율"
                          field="spouseShareholdingRatio"
                          value={formData.spouseShareholdingRatio || 0}
                          placeholder="배우자 보유 지분율"
                          suffix="%"
                          step={0.001}
                          max={100}
                        />

                        {/* 직계존비속 지분율 */}
                        <SmartNumberInput
                          label="직계존비속 지분율"
                          field="linealRelativeShareholdingRatio"
                          value={formData.linealRelativeShareholdingRatio || 0}
                          placeholder="부모, 자녀 등의 지분율 합계"
                          suffix="%"
                          step={0.001}
                          max={100}
                        />

                        {/* 가족 지분율 합계 (자동 계산) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              가족 지분율 합계 (자동 계산)
                              <Badge className="text-xs bg-green-100 text-green-700 border-green-300">⚡ 자동계산</Badge>
                            </Label>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              본인 + 배우자 + 직계
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="text-lg font-bold text-green-700">
                              {familyShareholdingRatio.toFixed(6)}%
                            </div>
                            <div className="text-sm text-green-600">
                              {shareholdingRatio.toFixed(3)}% + {(formData.spouseShareholdingRatio || 0).toFixed(3)}% + {(formData.linealRelativeShareholdingRatio || 0).toFixed(3)}%
                            </div>
                          </div>
                        </div>

                        {/* 빈 공간 */}
                        <div></div>
                      </div>

                      {/* 특수 관계자 지분 (고급 옵션) */}
                      {showAdvanced && (
                        <div className="mt-6 p-4 bg-gray-50 rounded border">
                          <h4 className="font-semibold mb-3">🔍 특수 관계자 지분 (고급 옵션)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SmartNumberInput
                              label="친족 기타 지분율"
                              field="otherFamilyShareholdingRatio"
                              value={formData.otherFamilyShareholdingRatio || 0}
                              placeholder="기타 친족 지분율"
                              suffix="%"
                              step={0.001}
                              max={100}
                            />
                            
                            <SmartNumberInput
                              label="법인 관련 지분율"
                              field="corporateShareholdingRatio"
                              value={formData.corporateShareholdingRatio || 0}
                              placeholder="관계법인 지분율"
                              suffix="%"
                              step={0.001}
                              max={100}
                            />
                          </div>
                          
                          <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-700">
                            <p>💡 <strong>특수 관계자 지분:</strong> 세법상 특수관계자(형제자매, 6촌 이내 혈족 등)와 관계법인의 지분도 대주주 판정시 합산됩니다.</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="step-3" className="space-y-6">
                  {/* 🔥 거래정보 스마트 계산 패널 */}
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-700">
                        <TrendingUp className="w-5 h-5" />
                        💹 거래정보 스마트 계산 패널
                      </CardTitle>
                      <CardDescription className="text-orange-600">
                        거래 유형별 맞춤 계산과 실시간 수익성 분석을 제공합니다
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* 양도차익 실시간 계산 */}
                      {formData.transferType === 'sale' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-white p-4 rounded border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">양도차익</span>
                              <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-300">자동계산</Badge>
                            </div>
                            <div className={`text-2xl font-bold ${capitalGain >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                              {capitalGain >= 0 ? '+' : ''}{formatWon(capitalGain)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              양도가액 - 취득가액 - 비용
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">수익률</span>
                              <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-300">실시간</Badge>
                            </div>
                            <div className={`text-2xl font-bold ${
                              (formData.acquisitionPrice ? ((formData.transferPrice || 0) - formData.acquisitionPrice) / formData.acquisitionPrice * 100 : 0) >= 0 ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {formData.acquisitionPrice ? (((formData.transferPrice || 0) - formData.acquisitionPrice) / formData.acquisitionPrice * 100).toFixed(2) : 0}%
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              (양도-취득) ÷ 취득 × 100
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">연환산 수익률</span>
                              <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-300">자동계산</Badge>
                            </div>
                            <div className={`text-2xl font-bold ${
                              holdingPeriod.years > 0 && formData.acquisitionPrice > 0 ? 
                              (Math.pow((formData.transferPrice || 0) / formData.acquisitionPrice, 1 / (holdingPeriod.years + holdingPeriod.months / 12)) - 1) * 100 >= 0 ? 'text-green-700' : 'text-red-700'
                              : 'text-gray-500'
                            }`}>
                              {holdingPeriod.years > 0 && formData.acquisitionPrice > 0 ? 
                                ((Math.pow((formData.transferPrice || 0) / formData.acquisitionPrice, 1 / (holdingPeriod.years + holdingPeriod.months / 12)) - 1) * 100).toFixed(2)
                                : 0}%
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              연복리 기준 수익률
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 거래 위험 분석 */}
                      {Object.keys(validationErrors).length > 0 && (
                        <div className="mb-6 p-4 bg-red-50 rounded border border-red-200">
                          <h4 className="font-semibold text-red-700 mb-3">⚠️ 거래 위험 요소</h4>
                          <div className="space-y-2">
                            {Object.entries(validationErrors).map(([field, error]) => (
                              <div key={field} className="flex items-start gap-2 text-sm text-red-600">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* 양도 거래 입력 */}
                  {formData.transferType === 'sale' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          💰 양도 거래 정보
                        </CardTitle>
                        <CardDescription>
                          양도 거래의 세부 정보를 입력하면 자동으로 수익성이 분석됩니다
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 최초 취득가액 */}
                          <SmartNumberInput
                            label="🏷️ 최초 취득가액 (매입가격)"
                            field="acquisitionPrice"
                            value={formData.acquisitionPrice || 0}
                            placeholder="주식을 처음 산 총 가격"
                            suffix="원"
                            helpText="주식을 최초로 취득할 때 실제 지급한 총 금액입니다. 양도소득세 계산의 기준이 됩니다."
                            required={true}
                          />

                          {/* 양도가액 (매도가격) */}
                          <SmartNumberInput
                            label="💰 양도가액 (매도가격)"
                            field="transferPrice"
                            value={formData.transferPrice || 0}
                            placeholder="주식을 매도한 총 가격"
                            suffix="원"
                            helpText="실제로 주식을 매도하여 받은 총 금액입니다. 양도차익 계산에 사용됩니다."
                            required={true}
                          />

                          {/* 양도관련 비용 */}
                          <SmartNumberInput
                            label="💸 양도관련 비용"
                            field="transferExpenses"
                            value={formData.transferExpenses || 0}
                            placeholder="중개수수료, 인지세 등"
                            suffix="원"
                            helpText="양도 시 발생한 필요경비입니다. 중개수수료, 인지세, 농특세 등이 포함되며 양도차익에서 차감됩니다."
                          />

                          {/* 양도차익 (자동 계산) */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-2">
                                양도차익 (자동 계산)
                                <Badge className="text-xs bg-green-100 text-green-700 border-green-300">⚡ 자동계산</Badge>
                              </Label>
                              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                양도가액 - 취득가액 - 비용
                              </div>
                            </div>
                            <div className={`p-3 rounded border ${
                              capitalGain >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}>
                              <div className={`text-lg font-bold ${capitalGain >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                {capitalGain >= 0 ? '+' : ''}{formatWon(capitalGain)}
                              </div>
                              <div className={`text-sm mt-1 ${capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatWon(formData.transferPrice || 0)} - {formatWon(formData.acquisitionPrice)} - {formatWon(formData.transferExpenses)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 상세 수익성 분석 */}
                        {formData.transferPrice && formData.acquisitionPrice && (
                          <div className="mt-6 p-4 bg-white rounded border">
                            <h4 className="font-semibold mb-3">📊 상세 수익성 분석</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">총 투자금액:</span>
                                  <span className="font-medium">{formatWon(formData.acquisitionPrice + formData.transferExpenses)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">총 회수금액:</span>
                                  <span className="font-medium">{formatWon(formData.transferPrice || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">순 수익/손실:</span>
                                  <span className={`font-bold ${capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {capitalGain >= 0 ? '+' : ''}{formatWon(capitalGain)}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">단순 수익률:</span>
                                  <span className={`font-medium ${
                                    ((formData.transferPrice || 0) - formData.acquisitionPrice) / formData.acquisitionPrice * 100 >= 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {(((formData.transferPrice || 0) - formData.acquisitionPrice) / formData.acquisitionPrice * 100).toFixed(2)}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">보유기간:</span>
                                  <span className="font-medium">
                                    {holdingPeriod.years}년 {holdingPeriod.months}개월
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">연환산 수익률:</span>
                                  <span className={`font-bold ${
                                    holdingPeriod.years > 0 ? 
                                    (Math.pow((formData.transferPrice || 0) / formData.acquisitionPrice, 1 / (holdingPeriod.years + holdingPeriod.months / 12)) - 1) * 100 >= 0 ? 'text-green-600' : 'text-red-600'
                                    : 'text-gray-600'
                                  }`}>
                                    {holdingPeriod.years > 0 ? 
                                      ((Math.pow((formData.transferPrice || 0) / formData.acquisitionPrice, 1 / (holdingPeriod.years + holdingPeriod.months / 12)) - 1) * 100).toFixed(2)
                                      : 0}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* 증여 거래 입력 */}
                  {formData.transferType === 'gift' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Gift className="w-5 h-5" />
                          🎁 증여 거래 정보
                        </CardTitle>
                        <CardDescription>
                          증여세 계산을 위한 정보를 입력해주세요
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 수증자와의 관계 */}
                          <div className="space-y-2">
                            <Label>수증자와의 관계</Label>
                            <Select
                              value={formData.relationship}
                              onValueChange={(value) => handleInputChange('relationship', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="관계를 선택하세요" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="spouse">💑 배우자</SelectItem>
                                <SelectItem value="lineal_descendant">👨‍👩‍👧‍👦 직계비속 (자녀, 손자녀)</SelectItem>
                                <SelectItem value="lineal_ascendant">👴👵 직계존속 (부모, 조부모)</SelectItem>
                                <SelectItem value="sibling">👫 형제자매</SelectItem>
                                <SelectItem value="other">🤝 기타</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* 증여 가액 */}
                          <SmartNumberInput
                            label="증여 가액"
                            field="transferPrice"
                            value={formData.transferPrice || totalValue}
                            placeholder="증여할 주식의 시가"
                            suffix="원"
                          />

                          {/* 증여세 공제한도 자동 표시 */}
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              증여세 공제한도 (자동 계산)
                              <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-300">⚡ 자동적용</Badge>
                            </Label>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                              <div className="text-lg font-bold text-blue-700">
                                {formData.relationship === 'spouse' ? formatWon(600000000) :
                                 formData.relationship === 'lineal_descendant' ? formatWon(50000000) :
                                 formData.relationship === 'lineal_ascendant' ? formatWon(50000000) :
                                 formatWon(10000000)}
                              </div>
                              <div className="text-sm text-blue-600 mt-1">
                                {formData.relationship === 'spouse' ? '배우자: 6억원 (10년간)' :
                                 formData.relationship === 'lineal_descendant' ? '직계비속: 5천만원 (10년간)' :
                                 formData.relationship === 'lineal_ascendant' ? '직계존속: 5천만원 (10년간)' :
                                 '기타: 1천만원 (10년간)'}
                              </div>
                            </div>
                          </div>

                          {/* 과세표준 자동 계산 */}
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              과세표준 (자동 계산)
                              <Badge className="text-xs bg-green-100 text-green-700 border-green-300">⚡ 자동계산</Badge>
                            </Label>
                            <div className="p-3 bg-green-50 border border-green-200 rounded">
                              {(() => {
                                const giftAmount = formData.transferPrice || totalValue;
                                const deduction = formData.relationship === 'spouse' ? 600000000 :
                                                formData.relationship === 'lineal_descendant' ? 50000000 :
                                                formData.relationship === 'lineal_ascendant' ? 50000000 :
                                                10000000;
                                const taxableAmount = Math.max(0, giftAmount - deduction);
                                return (
                                  <>
                                    <div className="text-lg font-bold text-green-700">
                                      {formatWon(taxableAmount)}
                                    </div>
                                    <div className="text-sm text-green-600 mt-1">
                                      증여가액 {formatWon(giftAmount)} - 공제 {formatWon(deduction)}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* 증여세 계산 안내 */}
                        <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
                          <h4 className="font-semibold text-yellow-700 mb-3">💡 증여세 계산 안내</h4>
                          <div className="text-sm text-yellow-700 space-y-2">
                            <p>• 증여세는 수증자(받는 사람)가 납부합니다</p>
                            <p>• 공제한도는 동일인으로부터 10년간 합산하여 적용됩니다</p>
                            <p>• 주식의 경우 증여일 현재 시가로 평가합니다</p>
                            <p>• 비상장주식은 별도 평가기준을 적용할 수 있습니다</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 상속 거래 입력 */}
                  {formData.transferType === 'inheritance' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          👨‍👩‍👧‍👦 상속 거래 정보
                        </CardTitle>
                        <CardDescription>
                          상속세 계산을 위한 정보를 입력해주세요
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 상속인과의 관계 */}
                          <div className="space-y-2">
                            <Label>피상속인과의 관계</Label>
                            <Select
                              value={formData.relationship}
                              onValueChange={(value) => handleInputChange('relationship', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="관계를 선택하세요" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="spouse">💑 배우자</SelectItem>
                                <SelectItem value="lineal_descendant">👨‍👩‍👧‍👦 직계비속 (자녀, 손자녀)</SelectItem>
                                <SelectItem value="lineal_ascendant">👴👵 직계존속 (부모, 조부모)</SelectItem>
                                <SelectItem value="sibling">👫 형제자매</SelectItem>
                                <SelectItem value="other">🤝 기타</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* 상속 가액 */}
                          <SmartNumberInput
                            label="상속 가액"
                            field="transferPrice"
                            value={formData.transferPrice || totalValue}
                            placeholder="상속받은 주식의 상속개시일 시가"
                            suffix="원"
                          />
                        </div>

                        {/* 상속세 안내 */}
                        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
                          <h4 className="font-semibold text-blue-700 mb-3">💡 상속세 계산 안내</h4>
                          <div className="text-sm text-blue-700 space-y-2">
                            <p>• 상속세는 상속개시일로부터 6개월 이내 신고・납부해야 합니다</p>
                            <p>• 주식은 상속개시일 현재 시가로 평가합니다</p>
                            <p>• 배우자 상속공제, 자녀 상속공제 등 다양한 공제혜택이 있습니다</p>
                            <p>• 상속재산이 많을 경우 전문가와 상담을 권장합니다</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="step-4" className="space-y-6">
                  {/* 🔥 고급설정 활성화 상태 확인 */}
                  {!showAdvanced ? (
                    <Card className="border-yellow-200 bg-yellow-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-700">
                          <Shield className="w-5 h-5" />
                          🔒 고급설정이 비활성화 상태입니다
                        </CardTitle>
                        <CardDescription className="text-yellow-600">
                          상단의 "고급 설정" 버튼을 클릭하여 세부 계산 옵션과 특례를 활성화하세요
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={() => setShowAdvanced(true)}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          고급설정 활성화하기
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {/* 활성화 확인 메시지 */}
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                          <strong>✅ 고급설정 활성화됨</strong><br/>
                          세부 계산 옵션 및 특례 적용을 선택할 수 있습니다. 해당되는 항목을 체크하여 절세 효과를 확인하세요.
                        </AlertDescription>
                      </Alert>

                      {/* 기업 유형별 세제혜택 */}
                      <Card className="border-green-200">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-green-700">
                            <Building className="w-5 h-5" />
                            🏢 기업 유형별 세제혜택
                          </CardTitle>
                          <CardDescription>
                            기업 특성에 따른 세제혜택을 선택하세요
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 벤처기업주식 */}
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    id="startup-stock"
                                    type="checkbox"
                                    checked={formData.isStartupStock}
                                    onChange={(e) => handleInputChange('isStartupStock', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                  />
                                  <Label htmlFor="startup-stock" className="font-semibold">🚀 벤처기업주식</Label>
                                </div>
                                <Badge className="bg-green-100 text-green-700">50% 감면</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">• 2년 이상 보유 필수</p>
                              <p className="text-sm text-gray-600 mb-2">• 벤처투자조합, 벤처투자회사 투자</p>
                              <p className="text-sm text-gray-600">• 중소벤처기업부 확인 기업</p>
                              {formData.isStartupStock && (
                                <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
                                  ✅ 적용됨: 보유기간 {holdingPeriod.years}년 {holdingPeriod.months}개월
                                </div>
                              )}
                            </div>

                            {/* 중소기업주식 */}
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    id="sme-stock"
                                    type="checkbox"
                                    checked={formData.isSmallMediumStock}
                                    onChange={(e) => handleInputChange('isSmallMediumStock', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <Label htmlFor="sme-stock" className="font-semibold">🏭 중소기업주식</Label>
                                </div>
                                <Badge className="bg-blue-100 text-blue-700">10% 감면</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">• 1년 이상 보유 필수</p>
                              <p className="text-sm text-gray-600 mb-2">• 중소기업기본법상 중소기업</p>
                              <p className="text-sm text-gray-600">• 매출액 기준 충족 필요</p>
                              {formData.isSmallMediumStock && (
                                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                                  ✅ 적용됨: 보유기간 {holdingPeriod.years}년 {holdingPeriod.months}개월
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 거주자 구분 및 특수상황 */}
                      <Card className="border-purple-200">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-purple-700">
                            <Users className="w-5 h-5" />
                            🌏 거주자 구분 및 특수상황
                          </CardTitle>
                          <CardDescription>
                            납세자의 거주지와 특수한 상황을 선택하세요
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 거주자 구분 */}
                            <div className="space-y-2">
                              <Label>거주자 구분</Label>
                              <Select
                                value={formData.transfereeResidence}
                                onValueChange={(value) => handleInputChange('transfereeResidence', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="domestic">🇰🇷 국내 거주자</SelectItem>
                                  <SelectItem value="foreign">🌍 해외 거주자 (비거주자)</SelectItem>
                                </SelectContent>
                              </Select>
                              {formData.transfereeResidence === 'foreign' && (
                                <div className="p-2 bg-orange-50 rounded text-xs text-orange-700">
                                  ⚠️ 비거주자는 별도 세율 및 원천징수 적용
                                </div>
                              )}
                            </div>

                            {/* 종합소득세 신고 여부 */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  id="comprehensive-taxpayer"
                                  type="checkbox"
                                  checked={formData.comprehensiveIncomeTaxPayer}
                                  onChange={(e) => handleInputChange('comprehensiveIncomeTaxPayer', e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300"
                                />
                                <Label htmlFor="comprehensive-taxpayer">📊 종합소득세 신고 대상자</Label>
                              </div>
                              <p className="text-sm text-gray-600">• 다른 소득과 합산하여 누진세율 적용</p>
                              <p className="text-sm text-gray-600">• 기타소득이 300만원 초과시 필수</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 추가 소득 및 공제사항 */}
                      <Card className="border-indigo-200">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-indigo-700">
                            <Calculator className="w-5 h-5" />
                            💰 추가 소득 및 공제사항
                          </CardTitle>
                          <CardDescription>
                            다른 투자 소득이나 특별공제가 있다면 입력하세요
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 기타 양도소득 */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  id="other-capital-gains"
                                  type="checkbox"
                                  checked={formData.hasOtherCapitalGains}
                                  onChange={(e) => handleInputChange('hasOtherCapitalGains', e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300"
                                />
                                <Label htmlFor="other-capital-gains">📈 기타 양도소득 있음</Label>
                              </div>
                              {formData.hasOtherCapitalGains && (
                                <SmartNumberInput
                                  label="기타 양도소득 금액"
                                  field="otherIncomeAmount"
                                  value={formData.otherIncomeAmount || 0}
                                  placeholder="다른 주식, 부동산 등 양도소득"
                                  suffix="원"
                                />
                              )}
                            </div>

                            {/* 세제혜택 자격 */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  id="tax-incentive"
                                  type="checkbox"
                                  checked={formData.qualifiesForTaxIncentive}
                                  onChange={(e) => handleInputChange('qualifiesForTaxIncentive', e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300"
                                />
                                <Label htmlFor="tax-incentive">🎁 특별세제혜택 대상</Label>
                              </div>
                              <p className="text-sm text-gray-600">• 연금저축, 퇴직연금 등</p>
                              <p className="text-sm text-gray-600">• 장기펀드, ETF 등</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 세부 계산 옵션 */}
                      <Card className="border-red-200">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-red-700">
                            <Target className="w-5 h-5" />
                            ⚙️ 세부 계산 옵션
                          </CardTitle>
                          <CardDescription>
                            정확한 계산을 위한 세부 옵션들을 설정하세요
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 연령대별 공제 */}
                            <div className="space-y-2">
                              <Label>양도자 연령</Label>
                              <SmartNumberInput
                                label="연령"
                                field="transferorAge"
                                value={formData.transferorAge || 0}
                                placeholder="만 나이"
                                suffix="세"
                                min={0}
                                max={120}
                              />
                              {(formData.transferorAge || 0) >= 65 && (
                                <div className="p-2 bg-green-50 rounded text-xs text-green-700">
                                  ✅ 65세 이상: 경로우대 혜택 가능
                                </div>
                              )}
                            </div>

                            {/* 수증자/상속인 연령 */}
                            {['gift', 'inheritance'].includes(formData.transferType) && (
                              <div className="space-y-2">
                                <Label>
                                  {formData.transferType === 'gift' ? '수증자' : '상속인'} 연령
                                </Label>
                                <SmartNumberInput
                                  label="연령"
                                  field="transfereeAge"
                                  value={formData.transfereeAge || 0}
                                  placeholder="만 나이"
                                  suffix="세"
                                  min={0}
                                  max={120}
                                />
                                {(formData.transfereeAge || 0) < 20 && (
                                  <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
                                    ℹ️ 미성년자: 특별관리 및 할증 적용 가능
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* 과세 방법 선택 */}
                          <div className="p-4 bg-gray-50 rounded">
                            <h4 className="font-semibold mb-3">📋 과세 방법 선택</h4>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  id="separate-tax"
                                  name="taxMethod"
                                  defaultChecked
                                  className="mt-1"
                                />
                                <div>
                                  <Label htmlFor="separate-tax" className="font-medium">분리과세 (권장)</Label>
                                  <p className="text-sm text-gray-600">• 다른 소득과 분리하여 단일세율 적용</p>
                                  <p className="text-sm text-gray-600">• 대부분의 경우 유리</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  id="comprehensive-tax"
                                  name="taxMethod"
                                  className="mt-1"
                                />
                                <div>
                                  <Label htmlFor="comprehensive-tax" className="font-medium">종합과세</Label>
                                  <p className="text-sm text-gray-600">• 다른 소득과 합산하여 누진세율 적용</p>
                                  <p className="text-sm text-gray-600">• 소득이 적은 경우 유리할 수 있음</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>
              </Tabs>

              {/* 🔥 개선된 네비게이션 및 계산 버튼 */}
              <div className="space-y-4">
                {/* 4단계일 때 특례 확인 안내 */}
                {activeStep === 4 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-700 mb-2">🔍 계산 전 특례 적용 확인</h4>
                          <div className="text-sm text-yellow-700 space-y-1">
                            <p>• 벤처기업주식이나 중소기업주식에 해당하는지 확인하세요</p>
                            <p>• 고급설정을 활성화하여 추가 옵션을 검토하세요</p>
                            <p>• 비교모드로 여러 시나리오를 한번에 확인할 수 있습니다</p>
                          </div>
                          
                          {/* 현재 적용 상태 표시 */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {!formData.isStartupStock && !formData.isSmallMediumStock && !showAdvanced && (
                              <Badge variant="secondary" className="text-xs">
                                ⚠️ 특례 미적용
                              </Badge>
                            )}
                            {formData.isStartupStock && (
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                ✅ 벤처기업 50% 감면
                              </Badge>
                            )}
                            {formData.isSmallMediumStock && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                ✅ 중소기업 10% 감면
                              </Badge>
                            )}
                            {showAdvanced && (
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                ✅ 고급설정 활성화
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 네비게이션 버튼 */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                    disabled={activeStep === 1}
                  >
                    <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
                    이전
                  </Button>
                  
                  {activeStep < 4 ? (
                    <Button
                      onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
                      disabled={calculateProgress() < activeStep * 25}
                    >
                      다음
                      <ChevronUp className="w-4 h-4 ml-2 -rotate-90" />
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      {/* 계산 요약 확인 버튼 */}
                      <Button 
                        variant="outline"
                        onClick={() => setShowCalculationSummary(true)}
                        disabled={calculateProgress() < 50}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        최종 확인
                      </Button>
                      
                      {/* 메인 계산 버튼 */}
                      <Button 
                        onClick={() => {
                          // 특례 미적용시 확인 메시지
                          if (!formData.isStartupStock && !formData.isSmallMediumStock && !showAdvanced) {
                            const confirmed = confirm(
                              '현재 특례나 세제혜택이 적용되지 않은 상태입니다.\n' +
                              '벤처기업주식(50% 감면)이나 중소기업주식(10% 감면)에 해당하는지 확인하셨나요?\n\n' +
                              '그대로 계산을 진행하시겠습니까?'
                            );
                            if (!confirmed) return;
                          }
                          handleCalculate();
                        }}
                        className={`${
                          calculateProgress() >= 75 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-400 cursor-not-allowed'
                        } transition-colors`}
                        disabled={calculateProgress() < 75}
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        {calculateProgress() < 75 
                          ? `입력 완료 필요 (${Math.round(calculateProgress())}%)`
                          : '세금 계산하기'
                        }
                      </Button>
                    </div>
                  )}
                </div>

                {/* 진행률 부족시 안내 */}
                {calculateProgress() < 75 && activeStep === 4 && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <Info className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-700">
                      <strong>📝 입력 완료 필요</strong><br/>
                      <div className="text-sm mt-1">
                        {calculateProgress() < 25 && "1단계: 기본정보 입력이 필요합니다"}
                        {calculateProgress() >= 25 && calculateProgress() < 50 && "2단계: 지분현황 입력이 필요합니다"}
                        {calculateProgress() >= 50 && calculateProgress() < 75 && "3단계: 거래정보 입력이 필요합니다"}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 계산 결과 */}
        <div className="xl:col-span-1 space-y-6">
          {/* 🔥 비교모드 활성화시 비교 결과 표시 */}
          {comparisonMode ? (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <TrendingUp className="w-5 h-5" />
                  📊 비교 분석 결과
                </CardTitle>
                <CardDescription className="text-purple-600">
                  여러 시나리오의 세금 비교 및 최적화 방안
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!result ? (
                  <div className="text-center p-6">
                    <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <p className="text-purple-600 text-sm">계산을 실행하면 비교 분석이 시작됩니다</p>
                  </div>
                ) : (
                  <>
                    {/* 현재 시나리오 결과 */}
                    <div className="bg-white p-4 rounded border border-purple-200">
                      <h4 className="font-semibold text-purple-700 mb-3">🎯 현재 시나리오</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">총 세액:</span>
                          <span className="font-bold text-red-600">{formatWon(result.totalTax || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">실수취액:</span>
                          <span className="font-bold text-green-600">{formatWon(result.netProceeds || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">실효세율:</span>
                          <span className="font-medium">{result.effectiveRate?.toFixed(2) || 0}%</span>
                        </div>
                      </div>
                    </div>

                    {/* 최적화 시나리오 자동 생성 */}
                    <div className="bg-white p-4 rounded border border-green-200">
                      <h4 className="font-semibold text-green-700 mb-3">✨ 최적화 시나리오</h4>
                      <div className="space-y-3">
                        {/* 증여 vs 양도 비교 */}
                        <div className="p-3 bg-green-50 rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-green-700">🎁 증여로 변경시</span>
                            <Badge className="bg-green-100 text-green-700">절세 효과</Badge>
                          </div>
                          <div className="text-xs text-green-600">
                            • 관계별 공제한도 활용<br/>
                            • 분할 증여로 세율 구간 최적화<br/>
                            • 예상 절세액: {formatWon(Math.max(0, (result.totalTax || 0) * 0.3))}
                          </div>
                        </div>

                        {/* 보유기간 연장 효과 */}
                        <div className="p-3 bg-blue-50 rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-blue-700">⏰ 보유기간 연장시</span>
                            <Badge className="bg-blue-100 text-blue-700">장기보유 특례</Badge>
                          </div>
                          <div className="text-xs text-blue-600">
                            • 3년 이상 보유시 추가 감면<br/>
                            • 현재 보유기간: {holdingPeriod.years}년 {holdingPeriod.months}개월<br/>
                            • 추가 절세 가능액: {formatWon(Math.max(0, (result.totalTax || 0) * 0.15))}
                          </div>
                        </div>

                        {/* 분할 양도 효과 */}
                        <div className="p-3 bg-yellow-50 rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-yellow-700">✂️ 분할 양도시</span>
                            <Badge className="bg-yellow-100 text-yellow-700">세율 절약</Badge>
                          </div>
                          <div className="text-xs text-yellow-600">
                            • 연도별 분할로 누진세율 절약<br/>
                            • 기본공제 중복 활용<br/>
                            • 예상 절세액: {formatWon(Math.max(0, (result.totalTax || 0) * 0.2))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 위험 요소 및 주의사항 */}
                    <div className="bg-red-50 p-4 rounded border border-red-200">
                      <h4 className="font-semibold text-red-700 mb-3">⚠️ 위험 요소 분석</h4>
                      <div className="space-y-2 text-xs text-red-600">
                        {isLargeShareholder && <p>• 대주주 과세로 높은 세율 적용</p>}
                        {holdingPeriod.years < 1 && <p>• 단기보유로 세제혜택 제한</p>}
                        {capitalGain < 0 && <p>• 손실 발생으로 세액공제 검토 필요</p>}
                        {!formData.isStartupStock && !formData.isSmallMediumStock && <p>• 세제혜택 미적용으로 높은 세부담</p>}
                        <p>• 주식시장 변동성에 따른 세액 변화 위험</p>
                      </div>
                    </div>

                    {/* 전문가 상담 권장 */}
                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                      <h4 className="font-semibold text-blue-700 mb-2">💡 전문가 상담 권장 사항</h4>
                      <div className="text-xs text-blue-600 space-y-1">
                        <p>• 복잡한 지분구조의 경우 세무사 상담 필수</p>
                        <p>• 절세 방안 실행 전 법적 검토 권장</p>
                        <p>• 가족 간 거래시 시가 적정성 확인 필요</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            /* 일반 모드 계산 결과 */
            result ? (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Calculator className="w-5 h-5" />
                    계산 결과
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">총 세액</span>
                      <span className="font-bold text-blue-700">
                        {formatWon(result.totalTax || 0)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">실수취액</span>
                      <span className="font-semibold text-green-600">
                        {formatWon(result.netProceeds || 0)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">대주주 여부</span>
                      <Badge variant={isLargeShareholder ? "destructive" : "secondary"}>
                        {isLargeShareholder ? '대주주' : '소액주주'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">계산 결과</h3>
                  <p className="text-gray-600 text-sm">
                    필요한 정보를 입력하고<br />계산 버튼을 클릭해주세요
                  </p>
                </CardContent>
              </Card>
            )
          )}

          {/* 🔥 강화된 법적 면책조항 */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>⚖️ 법적 면책조항</strong><br/>
              <div className="text-xs mt-2 space-y-1">
                <p>본 계산기는 단순 참고용 도구로서, 계산 결과의 정확성이나 법적 효력을 보장하지 않습니다.</p>
                <p>세법 해석, 적용 오류, 시스템 오작동 등으로 인한 모든 민사·형사·행정상 책임에서 완전히 면책됩니다.</p>
                <p>실제 세무신고 및 납부는 반드시 공인된 세무전문가와 상담 후 진행하시기 바랍니다.</p>
                <p>본 서비스 이용으로 발생하는 모든 손해에 대해 어떠한 책임도 지지 않습니다.</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* 비교모드 안내 */}
          {!comparisonMode && (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-700">비교 분석 모드</span>
                </div>
                <p className="text-sm text-purple-600 mb-3">
                  여러 세금 시나리오를 비교하여 최적의 절세 방안을 찾아보세요
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setComparisonMode(true)}
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  비교모드 활성화
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 🔥 사용법 가이드 모달 */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">📖 주식이동세금계산기 사용법 가이드</h2>
                <Button variant="outline" size="sm" onClick={() => setShowGuide(false)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* 기본 사용법 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <FileText className="w-5 h-5" />
                      🚀 기본 사용법 (4단계)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-700 mb-2">📝 1단계: 기본정보</h4>
                        <ul className="text-sm text-blue-600 space-y-1">
                          <li>• <strong>필수:</strong> 회사명, 주식종류</li>
                          <li>• <strong>필수:</strong> 주식수량, 주당가격</li>
                          <li>• <strong>필수:</strong> 취득일, 양도일</li>
                          <li>• <strong>자동계산:</strong> 총 주식가치, 보유기간</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-700 mb-2">📊 2단계: 지분현황</h4>
                        <ul className="text-sm text-green-600 space-y-1">
                          <li>• <strong>필수:</strong> 총발행주식수</li>
                          <li>• <strong>필수:</strong> 본인 보유주식수</li>
                          <li>• <strong>선택:</strong> 배우자, 직계 지분율</li>
                          <li>• <strong>자동계산:</strong> 대주주 판정</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-700 mb-2">💹 3단계: 거래정보</h4>
                        <ul className="text-sm text-orange-600 space-y-1">
                          <li>• <strong>필수:</strong> 취득가액, 양도가액</li>
                          <li>• <strong>선택:</strong> 양도비용</li>
                          <li>• <strong>증여/상속:</strong> 관계 선택</li>
                          <li>• <strong>자동계산:</strong> 양도차익, 수익률</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-700 mb-2">⚙️ 4단계: 특례설정</h4>
                        <ul className="text-sm text-purple-600 space-y-1">
                          <li>• <strong>세제혜택:</strong> 벤처/중소기업</li>
                          <li>• <strong>거주자구분:</strong> 국내/해외</li>
                          <li>• <strong>추가옵션:</strong> 기타소득, 연령</li>
                          <li>• <strong>과세방법:</strong> 분리/종합과세</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 특례 및 고급설정 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Shield className="w-5 h-5" />
                      🎁 특례 및 세제혜택 활용법
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 border-l-4 border-green-500 bg-green-50">
                        <h5 className="font-semibold text-green-700">🚀 벤처기업주식</h5>
                        <p className="text-sm text-green-600 mt-1">
                          • 50% 세액감면<br/>
                          • 2년 이상 보유 필수<br/>
                          • 중소벤처기업부 확인 기업
                        </p>
                      </div>
                      
                      <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                        <h5 className="font-semibold text-blue-700">🏭 중소기업주식</h5>
                        <p className="text-sm text-blue-600 mt-1">
                          • 10% 세액감면<br/>
                          • 1년 이상 보유 필수<br/>
                          • 중소기업기본법 기준
                        </p>
                      </div>
                      
                      <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                        <h5 className="font-semibold text-purple-700">⏰ 장기보유특례</h5>
                        <p className="text-sm text-purple-600 mt-1">
                          • 3년 이상 추가혜택<br/>
                          • 자동 적용 및 계산<br/>
                          • 보유기간별 차등
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 비교모드 사용법 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <TrendingUp className="w-5 h-5" />
                      📊 비교모드 활용법
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-purple-700 mb-3">🎯 비교모드 용도</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h6 className="font-medium text-purple-600 mb-2">📈 자동 시나리오 비교</h6>
                          <ul className="text-purple-600 space-y-1">
                            <li>• 양도 vs 증여 세금 비교</li>
                            <li>• 보유기간 연장 효과</li>
                            <li>• 분할 양도시 절세효과</li>
                            <li>• 세제혜택 최적 적용</li>
                            <li>• 비거주자 과세 비교</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-purple-600 mb-2">💡 활용 가이드</h6>
                          <ul className="text-purple-600 space-y-1">
                            <li>• 기본 정보 입력 완료 후 활성화</li>
                            <li>• "비교모드" 버튼 클릭</li>
                            <li>• 계산 실행시 자동으로 5가지 시나리오 비교</li>
                            <li>• 최적 절세방안 자동 추천</li>
                            <li>• 위험요소 사전 분석 제공</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 주의사항 */}
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    <strong>⚠️ 중요 주의사항</strong><br/>
                    <div className="text-sm mt-2 space-y-1">
                      <p>• 계산 전 모든 특례 옵션을 확인하세요</p>
                      <p>• 고급설정 활성화 후 세부 옵션을 체크하세요</p>
                      <p>• 계산 결과는 참고용이며, 실제 신고시 전문가 상담 필수</p>
                      <p>• 비교모드로 여러 시나리오를 검토해보세요</p>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowGuide(false)} className="bg-blue-600 hover:bg-blue-700">
                  가이드 닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 계산 요약 확인 모달 */}
      {showCalculationSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">📋 계산 전 최종 확인</h2>
                <Button variant="outline" size="sm" onClick={() => setShowCalculationSummary(false)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* 기본 정보 요약 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">📝 입력된 기본 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">회사명:</span>
                        <span className="ml-2 font-medium">{formData.companyName || '미입력'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">주식 종류:</span>
                        <span className="ml-2 font-medium">
                          {formData.stockType === 'listed' ? '상장주식' : 
                           formData.stockType === 'kosdaq' ? '코스닥' : 
                           formData.stockType === 'konex' ? '코넥스' : '비상장주식'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">거래 유형:</span>
                        <span className="ml-2 font-medium">
                          {formData.transferType === 'sale' ? '양도(매도)' : 
                           formData.transferType === 'gift' ? '증여' : 
                           formData.transferType === 'inheritance' ? '상속' : '배당'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">총 주식 가치:</span>
                        <span className="ml-2 font-medium">{formatWon(totalValue)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">보유 지분율:</span>
                        <span className="ml-2 font-medium">{shareholdingRatio.toFixed(3)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">대주주 판정:</span>
                        <span className={`ml-2 font-medium ${isLargeShareholder ? 'text-red-600' : 'text-green-600'}`}>
                          {isLargeShareholder ? '대주주 (과세)' : '소액주주 (비과세)'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 적용 중인 특례 확인 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">✅ 적용 중인 특례 및 옵션</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!formData.isStartupStock && !formData.isSmallMediumStock && !showAdvanced && !comparisonMode) ? (
                      <div className="text-center p-4 bg-yellow-50 rounded border border-yellow-200">
                        <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <p className="text-yellow-700 font-medium">적용된 특례나 옵션이 없습니다</p>
                        <p className="text-sm text-yellow-600 mt-1">4단계에서 세제혜택을 확인해보세요</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.isStartupStock && (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                            <span className="font-medium text-green-700">🚀 벤처기업주식 특례</span>
                            <Badge className="bg-green-100 text-green-700">50% 세액감면</Badge>
                          </div>
                        )}
                        {formData.isSmallMediumStock && (
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                            <span className="font-medium text-blue-700">🏭 중소기업주식 특례</span>
                            <Badge className="bg-blue-100 text-blue-700">10% 세액감면</Badge>
                          </div>
                        )}
                        {showAdvanced && (
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded border border-purple-200">
                            <span className="font-medium text-purple-700">⚙️ 고급설정 활성화</span>
                            <Badge className="bg-purple-100 text-purple-700">세부 옵션 적용</Badge>
                          </div>
                        )}
                        {comparisonMode && (
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
                            <span className="font-medium text-orange-700">📊 비교모드 활성화</span>
                            <Badge className="bg-orange-100 text-orange-700">5개 시나리오 비교</Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 계산 전 체크리스트 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-700">🔍 계산 전 최종 체크리스트</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 ${formData.companyName ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={formData.companyName ? 'text-green-700' : 'text-gray-600'}>
                          회사명이 정확히 입력되었습니다
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 ${totalValue > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={totalValue > 0 ? 'text-green-700' : 'text-gray-600'}>
                          주식 수량과 가격이 입력되었습니다
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 ${(formData.totalSharesOutstanding || 0) > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={(formData.totalSharesOutstanding || 0) > 0 ? 'text-green-700' : 'text-gray-600'}>
                          지분현황 정보가 입력되었습니다
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 ${formData.acquisitionPrice > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={formData.acquisitionPrice > 0 ? 'text-green-700' : 'text-gray-600'}>
                          거래 정보가 입력되었습니다
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-700">
                          특례 및 세제혜택 옵션을 확인했습니다
                        </span>
                      </div>
                    </div>
                    
                    {calculateProgress() < 75 && (
                      <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-700">
                          <strong>⚠️ 입력이 불완전합니다</strong><br/>
                          정확한 계산을 위해 모든 필수 항목을 입력해주세요.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setShowCalculationSummary(false)}>
                  닫기
                </Button>
                <Button 
                  onClick={() => {
                    setShowCalculationSummary(false);
                    handleCalculate();
                  }}
                  disabled={calculateProgress() < 75}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  확인 완료 - 계산 실행
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🧪 베타테스트 피드백 시스템 */}
      <BetaFeedbackForm 
        calculatorName="주식이동세금 계산기"
        calculatorType="stock-transfer-tax"
        className="mt-8"
      />

      {/* 하단 면책 조항 */}
      <TaxCalculatorDisclaimer variant="full" className="mt-6" />
    </div>
  );
} 