'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Home, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Calculator,
  FileText,
  Download,
  RotateCcw,
  Lightbulb,
  Users,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { TaxCalculatorDisclaimer } from './TaxCalculatorDisclaimer';
import { BetaFeedbackForm } from '@/components/ui/beta-feedback-form';
import { EnhancedSmartInput } from '@/components/ui/enhanced-smart-input';
import { useSmartCalculation } from '@/lib/utils/smartCalculationEngine';
import { 
  CapitalGainsTaxInput, 
  CapitalGainsTaxResult, 
  CapitalGainsTaxCalculator as TaxCalculator,
  formatNumber
} from '@/lib/utils/tax-calculations';
import { formatCurrency } from '@/lib/utils/smartCalculationEngine';

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
  helpText?: string;
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
  helpText
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState(value ? formatNumber(value) : '');
  const [isOverLimit, setIsOverLimit] = useState(false);

  useEffect(() => {
    setDisplayValue(value ? formatNumber(value) : '');
    
    if (max && value > max) {
      setIsOverLimit(true);
    } else {
      setIsOverLimit(false);
    }
  }, [value, max]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, '');
    const numValue = Math.round(parseInt(inputValue) || 0);
    
    let finalValue = numValue;
    if (max && numValue > max) {
      finalValue = max;
      setIsOverLimit(true);
    } else {
      setIsOverLimit(false);
    }
    
    if (finalValue < min) {
      finalValue = min;
    }
    
    setDisplayValue(finalValue ? formatNumber(finalValue) : '');
    onChange(finalValue);
  };

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
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={(e) => {
            // 🔥 키보드 단축키 허용 (Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+Z 등)
            if (e.ctrlKey || e.metaKey) {
              return; // 모든 Ctrl/Cmd 조합키 허용
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
          }}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          title={label}
          aria-label={label}
          className={`pr-8 text-right font-mono ${isOverLimit ? 'border-orange-400 bg-orange-50' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
            {suffix}
          </span>
        )}
      </div>
      
      {helpText && (
        <p className="text-xs text-blue-600 mt-1">
          💡 {helpText}
        </p>
      )}
      
      {isOverLimit && warningMessage && (
        <p className="text-xs text-orange-600 mt-1">
          ⚠️ {warningMessage}
        </p>
      )}
      
      {limitInfo && !helpText && (
        <p className="text-xs text-gray-500 mt-1">
          📋 {limitInfo}
        </p>
      )}
    </div>
  );
}

export default function CapitalGainsTaxCalculatorComponent() {
      // 🔥 스마트 계산 훅 적용
  const {
    calculate: smartCalculate,
    getCalculatedValue,
    isAutoCalculated,
    hasErrors,
    errors
  } = useSmartCalculation({ calculatorType: 'capital' });

  const [inputs, setInputs] = useState<CapitalGainsTaxInput>({
    propertyType: 'apartment' as const,
    salePrice: 0,
    saleDate: '',
    acquisitionPrice: 0,
    acquisitionDate: '',
    acquisitionCosts: 0,
    improvementCosts: 0,
    transferCosts: 0,
    isOneHouseOneFamily: false,
    residenceYears: 0,
    holdingPeriodYears: 0,
    isDualUse: false,
    hasSchoolDistrict: false,
    isReconstructionArea: false,
    isMultipleHouses: false,
    age: 35,
    householdMembers: 1,
    totalHousesOwned: 1,
    isNonResident: false,
    isForeignerExemption: false,
    isForeclosure: false,
    previousYearTaxPaid: 0,
    specialCases: {
      isGiftProperty: false as boolean,
      isInheritedProperty: false as boolean,
      isSelfConstruction: false as boolean,
      isPublicLandCompensation: false as boolean
    }
  });

  // 추가 상태: 계산된 값들
  const [calculatedValues, setCalculatedValues] = useState({
    holdingPeriodYears: 0,
    holdingPeriodMonths: 0,
    holdingPeriodDays: 0,
    isLongTermHolding: false,
    autoDetectedHeavyTax: {
      isMultipleHouses: false,
      isSpeculationArea: false,
      isAdjustmentArea: false,
      heavyTaxRate: 0
    }
  });

  const [results, setResults] = useState<CapitalGainsTaxResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateInput = (field: keyof CapitalGainsTaxInput, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const updateSpecialCase = (field: keyof typeof inputs.specialCases, value: boolean) => {
    setInputs(prev => ({
      ...prev,
      specialCases: {
        ...prev.specialCases,
        [field]: value
      }
    }));
  };

  // 🔄 자동 계산 로직 함수들
  const calculateHoldingPeriod = useCallback((acquisitionDate: string, saleDate: string) => {
    if (!acquisitionDate || !saleDate) return { years: 0, months: 0, days: 0 };
    
    const acquisition = new Date(acquisitionDate);
    const sale = new Date(saleDate);
    
    if (sale <= acquisition) return { years: 0, months: 0, days: 0 };
    
    let years = sale.getFullYear() - acquisition.getFullYear();
    let months = sale.getMonth() - acquisition.getMonth();
    let days = sale.getDate() - acquisition.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(sale.getFullYear(), sale.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months, days };
  }, []);

  // 🏠 자동 중과세 판정 로직
  const autoDetectHeavyTax = useCallback((totalHouses: number, holdingYears: number, propertyType: string) => {
    const heavyTaxInfo = {
      isMultipleHouses: totalHouses >= 2,
      isSpeculationArea: false, // 사용자가 직접 체크
      isAdjustmentArea: false, // 사용자가 직접 체크
      heavyTaxRate: 0
    };

    // 다주택자 중과세 계산
    if (totalHouses >= 3) {
      heavyTaxInfo.heavyTaxRate += 30; // 3주택 이상: +30%p
    } else if (totalHouses >= 2) {
      heavyTaxInfo.heavyTaxRate += 20; // 2주택: +20%p
    }

    // 단기 보유 중과세 (투기 목적 추정)
    if (holdingYears < 1) {
      heavyTaxInfo.heavyTaxRate = Math.max(heavyTaxInfo.heavyTaxRate, 70); // 1년 미만: 70%
    } else if (holdingYears < 2) {
      heavyTaxInfo.heavyTaxRate = Math.max(heavyTaxInfo.heavyTaxRate, 60); // 2년 미만: 60%
    }

    return heavyTaxInfo;
  }, []);

  // 📊 1세대1주택 비과세 자동 판정
  const checkOneHouseExemption = useCallback((
    totalHouses: number, 
    residenceYears: number, 
    salePrice: number,
    age: number
  ) => {
    const requirements = {
      isOneHouse: totalHouses === 1,
      hasResidenceYears: residenceYears >= 2,
      isPriceEligible: salePrice <= 1200000000, // 12억원 이하
      isAgeEligible: age >= 18,
      exemptionType: 'none' as 'full' | 'partial' | 'none'
    };

    if (requirements.isOneHouse && requirements.hasResidenceYears) {
      if (salePrice <= 1200000000) {
        requirements.exemptionType = 'full'; // 완전 비과세
      } else if (salePrice <= 3000000000) {
        requirements.exemptionType = 'partial'; // 일부 과세
      }
    }

    return requirements;
  }, []);

  const calculate = useCallback(async () => {
    setIsCalculating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!inputs.salePrice || !inputs.acquisitionPrice || !inputs.saleDate || !inputs.acquisitionDate) {
        console.log('필수 정보가 부족합니다.');
        setResults(null);
        return;
      }
      
      console.log('양도소득세 계산 시작:', inputs);
      const result = TaxCalculator.calculate(inputs);
      console.log('계산 완료:', result);
      setResults(result);
    } catch (error) {
      console.error('계산 오류:', error);
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [inputs]);

  const reset = () => {
    setInputs({
      propertyType: 'apartment' as const,
      salePrice: 0,
      saleDate: '',
      acquisitionPrice: 0,
      acquisitionDate: '',
      acquisitionCosts: 0,
      improvementCosts: 0,
      transferCosts: 0,
      isOneHouseOneFamily: false,
      residenceYears: 0,
      holdingPeriodYears: 0,
      isDualUse: false,
      hasSchoolDistrict: false,
      isReconstructionArea: false,
      isMultipleHouses: false,
      age: 35,
      householdMembers: 1,
      totalHousesOwned: 1,
      isNonResident: false,
      isForeignerExemption: false,
      isForeclosure: false,
      previousYearTaxPaid: 0,
      specialCases: {
        isGiftProperty: false as boolean,
        isInheritedProperty: false as boolean,
        isSelfConstruction: false as boolean,
        isPublicLandCompensation: false as boolean
      }
    });
    setCalculatedValues({
      holdingPeriodYears: 0,
      holdingPeriodMonths: 0,
      holdingPeriodDays: 0,
      isLongTermHolding: false,
      autoDetectedHeavyTax: {
        isMultipleHouses: false,
        isSpeculationArea: false,
        isAdjustmentArea: false,
        heavyTaxRate: 0
      }
    });
    setResults(null);
  };

  const loadSampleData = () => {
    setInputs({
      propertyType: 'apartment' as const,
      salePrice: 1200000000,         // 12억원
      saleDate: '2024-12-01',
      acquisitionPrice: 800000000,   // 8억원
      acquisitionDate: '2020-01-01',
      acquisitionCosts: 30000000,    // 3천만원
      improvementCosts: 50000000,    // 5천만원
      transferCosts: 20000000,       // 2천만원
      isOneHouseOneFamily: true,
      residenceYears: 3,
      holdingPeriodYears: 4,
      isDualUse: false,
      hasSchoolDistrict: false,
      isReconstructionArea: false,
      isMultipleHouses: false,
      age: 45,
      householdMembers: 4,
      totalHousesOwned: 1,
      isNonResident: false,
      isForeignerExemption: false,
      isForeclosure: false,
      previousYearTaxPaid: 0,
      specialCases: {
        isGiftProperty: false as boolean,
        isInheritedProperty: false as boolean,
        isSelfConstruction: false as boolean,
        isPublicLandCompensation: false as boolean
      }
    });
    
    // 샘플 데이터의 자동 계산 값도 설정
    setTimeout(() => {
      const holdingPeriod = calculateHoldingPeriod('2020-01-01', '2024-12-01');
      setCalculatedValues(prev => ({
        ...prev,
        holdingPeriodYears: holdingPeriod.years,
        holdingPeriodMonths: holdingPeriod.months,
        holdingPeriodDays: holdingPeriod.days,
        isLongTermHolding: holdingPeriod.years >= 2,
        autoDetectedHeavyTax: {
          isMultipleHouses: false,
          isSpeculationArea: false,
          isAdjustmentArea: false,
          heavyTaxRate: 0
        }
      }));
    }, 100);
  };

  // 🔥 고도화된 자동 연계 계산 로직
  
  // 1. 양도차익 자동 계산  
  const capitalGain = useMemo(() => {
    return Math.max(0, inputs.salePrice - inputs.acquisitionPrice - inputs.acquisitionCosts - inputs.improvementCosts - inputs.transferCosts);
  }, [inputs.salePrice, inputs.acquisitionPrice, inputs.acquisitionCosts, inputs.improvementCosts, inputs.transferCosts]);

  // 2. 실시간 보유기간 계산
  const realTimeHoldingPeriod = useMemo(() => {
    if (!inputs.acquisitionDate || !inputs.saleDate) return { years: 0, months: 0, days: 0 };
    
    const acquisitionDate = new Date(inputs.acquisitionDate);
    const saleDate = new Date(inputs.saleDate);
    const diffTime = saleDate.getTime() - acquisitionDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const remainingDays = diffDays % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;
    
    return { years, months, days };
  }, [inputs.acquisitionDate, inputs.saleDate]);

  // 3. 자동 세율 구간 계산
  const expectedTaxBracket = useMemo(() => {
    if (capitalGain <= 0) return { rate: 0, description: '양도차익 없음' };
    
    // 🔥 1세대1주택 비과세 우선 체크
    if (inputs.isOneHouseOneFamily && 
        inputs.totalHousesOwned === 1 && 
        inputs.residenceYears >= 2 && 
        realTimeHoldingPeriod.years >= 2) {
      return { rate: 0, description: '1세대1주택 비과세' };
    }
    
    // 🔥 단기양도 중과세 (보유기간별)
    if (realTimeHoldingPeriod.years < 1) {
      return { rate: 70, description: '1년 미만 보유 (단기양도 중과세 70%)' };
    } else if (realTimeHoldingPeriod.years < 2) {
      return { rate: 60, description: '2년 미만 보유 (단기양도 중과세 60%)' };
    } else {
      // 🔥 2년 이상 보유: 일반 누진세율 적용
      if (capitalGain <= 14000000) {
        return { rate: 6, description: '6% 구간 (1,400만원 이하)' };
      } else if (capitalGain <= 50000000) {
        return { rate: 15, description: '15% 구간 (5,000만원 이하)' };
      } else if (capitalGain <= 88000000) {
        return { rate: 24, description: '24% 구간 (8,800만원 이하)' };
      } else if (capitalGain <= 150000000) {
        return { rate: 35, description: '35% 구간 (1억 5천만원 이하)' };
      } else if (capitalGain <= 300000000) {
        return { rate: 38, description: '38% 구간 (3억원 이하)' };
      } else if (capitalGain <= 500000000) {
        return { rate: 40, description: '40% 구간 (5억원 이하)' };
      } else if (capitalGain <= 1000000000) {
        return { rate: 42, description: '42% 구간 (10억원 이하)' };
      } else {
        return { rate: 45, description: '45% 구간 (10억원 초과)' };
      }
    }
  }, [capitalGain, realTimeHoldingPeriod.years, inputs.isOneHouseOneFamily, inputs.totalHousesOwned, inputs.residenceYears]);

  // 4. 1세대1주택 자동 판정
  const oneHouseExemption = useMemo(() => {
    const isQualified = inputs.totalHousesOwned === 1 && 
                       inputs.residenceYears >= 2 && 
                       realTimeHoldingPeriod.years >= 2;
    
    const exemptionAmount = isQualified ? 
      (inputs.salePrice <= 900000000 ? inputs.salePrice : 
       inputs.salePrice <= 1200000000 ? 900000000 : 0) : 0;
    
    return {
      isQualified,
      exemptionAmount,
      requirements: [
        { name: '1세대 1주택', met: inputs.totalHousesOwned === 1 },
        { name: '2년 이상 거주', met: inputs.residenceYears >= 2 },
        { name: '2년 이상 보유', met: realTimeHoldingPeriod.years >= 2 },
      ]
    };
  }, [inputs.totalHousesOwned, inputs.residenceYears, realTimeHoldingPeriod.years, inputs.salePrice]);

  // 5. 장기보유특별공제 자동 계산
  const longTermDiscount = useMemo(() => {
    if (realTimeHoldingPeriod.years < 3) return 0;
    
    // 3년 이상부터 연 8%씩 공제 (최대 30%)
    const discountRate = Math.min((realTimeHoldingPeriod.years - 2) * 8, 30);
    return Math.floor(capitalGain * discountRate / 100);
  }, [realTimeHoldingPeriod.years, capitalGain]);

  // 6. 논리적 오류 체크
  const logicalErrors = useMemo(() => {
    const errors: string[] = [];
    
    // 양도가액이 취득가액보다 낮은 경우
    if (inputs.salePrice > 0 && inputs.acquisitionPrice > 0 && inputs.salePrice < inputs.acquisitionPrice) {
      errors.push('양도가액이 취득가액보다 낮습니다. (양도손실)');
    }
    
    // 취득일이 양도일보다 나중인 경우
    if (inputs.acquisitionDate && inputs.saleDate && inputs.acquisitionDate > inputs.saleDate) {
      errors.push('취득일이 양도일보다 나중일 수 없습니다.');
    }
    
    // 거주기간이 보유기간보다 긴 경우
    if (inputs.residenceYears > realTimeHoldingPeriod.years && realTimeHoldingPeriod.years > 0) {
      errors.push('거주기간이 보유기간을 초과할 수 없습니다.');
    }
    
    // 부대비용이 과도한 경우
    const totalCosts = inputs.acquisitionCosts + inputs.improvementCosts + inputs.transferCosts;
    if (totalCosts > inputs.salePrice * 0.5 && inputs.salePrice > 0) {
      errors.push('부대비용이 양도가액의 50%를 초과합니다.');
    }
    
    // 1세대1주택인데 주택수가 2채 이상인 경우
    if (inputs.isOneHouseOneFamily && inputs.totalHousesOwned > 1) {
      errors.push('1세대1주택 특례 적용 시 보유주택은 1채여야 합니다.');
    }
    
    return errors;
  }, [inputs, realTimeHoldingPeriod.years]);

  // 7. 절세 추천 로직
  const taxSavingRecommendations = useMemo(() => {
    const recommendations: string[] = [];
    
    // 1세대1주택 추천
    if (!inputs.isOneHouseOneFamily && inputs.totalHousesOwned === 1 && inputs.residenceYears >= 2) {
      if (realTimeHoldingPeriod.years >= 2) {
        recommendations.push('1세대1주택 비과세 특례 적용 가능! 체크박스를 확인하세요.');  
      } else {
        const remainingDays = (2 * 365) - (realTimeHoldingPeriod.years * 365 + realTimeHoldingPeriod.months * 30 + realTimeHoldingPeriod.days);
        recommendations.push(`${Math.ceil(remainingDays / 30)}개월 더 보유하면 1세대1주택 비과세 적용 가능`);
      }
    }
    
    // 장기보유특별공제 추천
    if (realTimeHoldingPeriod.years >= 3) {
      recommendations.push(`장기보유특별공제 ${Math.min((realTimeHoldingPeriod.years - 2) * 8, 30)}% 적용 가능`);
    }
    
    // 취득세 증빙 추천
    if (inputs.acquisitionCosts === 0 && inputs.acquisitionPrice > 0) {
      const estimatedCosts = Math.floor(inputs.acquisitionPrice * 0.05); // 약 5% 추정
      recommendations.push(`취득비용 증빙 보완 시 약 ${estimatedCosts.toLocaleString()}원 절세 효과`);
    }
    
    // 개량비 증빙 추천
    if (inputs.improvementCosts === 0 && realTimeHoldingPeriod.years >= 5) {
      recommendations.push('개량비(리모델링 등) 영수증 보관 시 필요경비 인정 가능');
    }
    
    // 다주택자 양도순서 추천
    if (inputs.totalHousesOwned > 1 && !inputs.isOneHouseOneFamily) {
      recommendations.push('다주택자는 양도순서 계획으로 세부담 최적화 가능');
    }
    
    return recommendations;
  }, [inputs, realTimeHoldingPeriod, capitalGain, longTermDiscount]);

  // 🔄 실시간 자동 계산 시스템
  useEffect(() => {
    // 보유기간 자동 업데이트
    if (inputs.acquisitionDate && inputs.saleDate) {
      setCalculatedValues(prev => ({
        ...prev,
        holdingPeriodYears: realTimeHoldingPeriod.years,
        holdingPeriodMonths: realTimeHoldingPeriod.months,
        holdingPeriodDays: realTimeHoldingPeriod.days,
        isLongTermHolding: realTimeHoldingPeriod.years >= 2
      }));

      // inputs에도 보유기간 업데이트
      setInputs(prev => ({
        ...prev,
        holdingPeriodYears: realTimeHoldingPeriod.years
      }));
    }
  }, [inputs.acquisitionDate, inputs.saleDate, realTimeHoldingPeriod]);

  // 🏠 자동 중과세 판정 시스템
  useEffect(() => {
    const heavyTaxInfo = autoDetectHeavyTax(
      inputs.totalHousesOwned, 
      calculatedValues.holdingPeriodYears, 
      inputs.propertyType
    );
    
    setCalculatedValues(prev => ({
      ...prev,
      autoDetectedHeavyTax: heavyTaxInfo
    }));

    // 자동으로 다주택자 체크박스 업데이트
    if (heavyTaxInfo.isMultipleHouses !== inputs.isMultipleHouses) {
      setInputs(prev => ({
        ...prev,
        isMultipleHouses: heavyTaxInfo.isMultipleHouses
      }));
    }
  }, [inputs.totalHousesOwned, calculatedValues.holdingPeriodYears, inputs.propertyType, autoDetectHeavyTax, inputs.isMultipleHouses]);

  // 📊 1세대1주택 자동 판정 시스템  
  useEffect(() => {
    const exemptionCheck = checkOneHouseExemption(
      inputs.totalHousesOwned,
      inputs.residenceYears,
      inputs.salePrice,
      inputs.age
    );

    // 1세대1주택 조건 충족 시 자동 체크
    if (exemptionCheck.isOneHouse && !inputs.isOneHouseOneFamily) {
      setInputs(prev => ({
        ...prev,
        isOneHouseOneFamily: true
      }));
    } else if (!exemptionCheck.isOneHouse && inputs.isOneHouseOneFamily) {
      setInputs(prev => ({
        ...prev,
        isOneHouseOneFamily: false
      }));
    }
  }, [inputs.totalHousesOwned, inputs.residenceYears, inputs.salePrice, inputs.age, checkOneHouseExemption, inputs.isOneHouseOneFamily]);

  // 💰 디바운스된 자동 계산 (고도화)
  useEffect(() => {
    if (capitalGain > 0 && inputs.saleDate && inputs.acquisitionDate) {
      const timer = setTimeout(() => {
        calculate();
      }, 300); // 300ms 디바운스
      
      return () => clearTimeout(timer);
    } else {
      setResults(null);
    }
  }, [inputs, capitalGain, calculate]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 계산기 헤더 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-50 p-2 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  🤖 AI 자동판정 양도소득세 계산기
                </CardTitle>
                <CardDescription className="text-gray-600">
                  2024년 최신 세율 기준 · 실시간 자동 계산 및 판정 시스템
                </CardDescription>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-blue-600">
                    💡 "샘플 데이터" 버튼을 클릭하여 예시 데이터로 테스트해보세요
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-green-600">
                    <span>🔄 보유기간 자동계산</span>
                    <span>🏠 1세대1주택 자동판정</span>
                    <span>⚠️ 중과세 자동감지</span>
                    <span>📊 실시간 세율 미리보기</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                2024년 적용
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 🧪 베타테스트 피드백 시스템 (면책조항 상단) */}
      <BetaFeedbackForm 
        calculatorName="양도소득세 계산기"
        calculatorType="capital-gains-tax"
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
                <Home className="w-5 h-5 mr-2 text-purple-600" />
                부동산 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">기본 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700 mb-2 block">
                      부동산 유형
                    </Label>
                    <Select value={inputs.propertyType} onValueChange={(value) => updateInput('propertyType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="부동산 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">🏢 아파트</SelectItem>
                        <SelectItem value="house">🏠 단독주택</SelectItem>
                        <SelectItem value="commercial">🏪 상업용 부동산</SelectItem>
                        <SelectItem value="land">🏞️ 토지</SelectItem>
                        <SelectItem value="stock">📈 주식</SelectItem>
                        <SelectItem value="other">📦 기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <EnhancedSmartInput
                    label="보유주택 수"
                    value={inputs.totalHousesOwned}
                    onChange={(value) => updateInput('totalHousesOwned', value)}
                    placeholder="1"
                    calculationRule="capital-gains-house-count"
                    connectedInputs={[
                      { label: '1세대1주택 여부', value: oneHouseExemption.isQualified ? 1 : 0, isCalculated: true }
                    ]}
                    quickActions={[
                      { label: '1채 (1세대1주택)', value: 1 },
                      { label: '2채', value: 2 },
                      { label: '3채', value: 3 }
                    ]}
                    recommendations={inputs.totalHousesOwned === 1 ? 
                      ['1세대1주택 비과세 혜택 가능성 검토'] : 
                      inputs.totalHousesOwned > 1 ? 
                      ['다주택자 중과세 적용 가능성'] : []
                    }
                    validationRules={[
                      { type: 'min', value: 1, message: '최소 1채 이상이어야 합니다' },
                      { type: 'max', value: 20, message: '20채를 초과할 수 없습니다' }
                    ]}
                  />
                </div>
              </div>

              {/* 부동산 유형별 상세 정보 */}
              {inputs.propertyType && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">
                    {inputs.propertyType === 'apartment' && '🏢 아파트 상세 정보'}
                    {inputs.propertyType === 'house' && '🏠 단독주택 상세 정보'}
                    {inputs.propertyType === 'commercial' && '🏪 상업용 부동산 상세 정보'}
                    {inputs.propertyType === 'land' && '🏞️ 토지 상세 정보'}
                    {inputs.propertyType === 'stock' && '📈 주식 상세 정보'}
                    {inputs.propertyType === 'other' && '📦 기타 부동산 상세 정보'}
                  </h4>
                  
                  {/* 아파트 전용 필드 */}
                  {inputs.propertyType === 'apartment' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                      <NumberInput
                        label="전용면적"
                        value={0}
                        onChange={() => {}}
                        suffix="㎡"
                        helpText="등기부등본 기준 전용면적"
                      />
                      <NumberInput
                        label="공급면적"
                        value={0}
                        onChange={() => {}}
                        suffix="㎡"
                        helpText="분양계약서 기준 공급면적"
                      />
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          아파트 규모
                        </Label>
                        <Select defaultValue="">
                          <SelectTrigger>
                            <SelectValue placeholder="선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">60㎡ 이하 (소형)</SelectItem>
                            <SelectItem value="medium">60㎡~85㎡ (중형)</SelectItem>
                            <SelectItem value="large">85㎡ 초과 (대형)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* 단독주택 전용 필드 */}
                  {inputs.propertyType === 'house' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 p-4 rounded-lg">
                      <NumberInput
                        label="건물면적"
                        value={0}
                        onChange={() => {}}
                        suffix="㎡"
                        helpText="등기부등본 기준 건물면적"
                      />
                      <NumberInput
                        label="토지면적"
                        value={0}
                        onChange={() => {}}
                        suffix="㎡"
                        helpText="등기부등본 기준 토지면적"
                      />
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          주택 유형
                        </Label>
                        <Select defaultValue="">
                          <SelectTrigger>
                            <SelectValue placeholder="선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="detached">단독주택</SelectItem>
                            <SelectItem value="multi-family">다가구주택</SelectItem>
                            <SelectItem value="townhouse">연립주택</SelectItem>
                            <SelectItem value="villa">빌라</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* 상업용 부동산 전용 필드 */}
                  {inputs.propertyType === 'commercial' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-purple-50 p-4 rounded-lg">
                      <NumberInput
                        label="연면적"
                        value={0}
                        onChange={() => {}}
                        suffix="㎡"
                        helpText="건물 전체 연면적"
                      />
                      <NumberInput
                        label="임대수익"
                        value={0}
                        onChange={() => {}}
                        suffix="원/월"
                        helpText="월 임대수익 (해당시)"
                      />
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          상업용 유형
                        </Label>
                        <Select defaultValue="">
                          <SelectTrigger>
                            <SelectValue placeholder="선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="office">사무용</SelectItem>
                            <SelectItem value="retail">상가</SelectItem>
                            <SelectItem value="warehouse">창고</SelectItem>
                            <SelectItem value="factory">공장</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* 토지 전용 필드 */}
                  {inputs.propertyType === 'land' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-yellow-50 p-4 rounded-lg">
                      <NumberInput
                        label="토지면적"
                        value={0}
                        onChange={() => {}}
                        suffix="㎡"
                        helpText="등기부등본 기준 면적"
                      />
                      <NumberInput
                        label="공시지가"
                        value={0}
                        onChange={() => {}}
                        suffix="원/㎡"
                        helpText="최근 공시지가"
                      />
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          토지 구분
                        </Label>
                        <Select defaultValue="">
                          <SelectTrigger>
                            <SelectValue placeholder="선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">주거용지</SelectItem>
                            <SelectItem value="commercial">상업용지</SelectItem>
                            <SelectItem value="industrial">공업용지</SelectItem>
                            <SelectItem value="agricultural">농지</SelectItem>
                            <SelectItem value="forest">임야</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* 🔥 스마트 자동 계산 대시보드 */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 text-lg">
                    <Calculator className="w-5 h-5" />
                    ⚡ 스마트 양도소득세 자동 계산 대시보드
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    AI가 실시간으로 보유기간, 세율, 특례 적용을 자동 판정하고 최적의 절세 방안을 제시합니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 양도차익 */}
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">양도차익</span>
                        <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                      </div>
                      <div className="text-lg font-bold text-purple-700">
                        {capitalGain.toLocaleString('ko-KR')}원
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        양도가액 - 취득가액 - 비용
                      </div>
                    </div>

                    {/* 보유기간 */}
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">보유기간</span>
                        <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                      </div>
                      <div className="text-lg font-bold text-purple-700">
                        {realTimeHoldingPeriod.years}년 {realTimeHoldingPeriod.months}개월
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {realTimeHoldingPeriod.years >= 2 ? '✅ 장기보유' : '⚠️ 단기보유'}
                      </div>
                    </div>

                    {/* 🔥 기본공제 자동적용 안내 */}
                    <div className="bg-white p-3 rounded border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">기본공제</span>
                        <Badge className="text-xs bg-green-100 text-green-700 border-green-300">✅ 법정</Badge>
                      </div>
                      <div className="text-lg font-bold text-green-700">
                        250만원
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        자동 적용 (법정공제)
                      </div>
                    </div>

                    {/* 예상 세율 */}
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">예상 세율</span>
                        <Badge className={`text-xs ${expectedTaxBracket.rate === 0 ? 'bg-green-100 text-green-700' : 
                          expectedTaxBracket.rate <= 15 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {expectedTaxBracket.rate}%
                        </Badge>
                      </div>
                      <div className={`text-lg font-bold ${expectedTaxBracket.rate === 0 ? 'text-green-700' : 
                        expectedTaxBracket.rate <= 15 ? 'text-yellow-700' : 'text-red-700'}`}>
                        {expectedTaxBracket.rate}% 구간
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {expectedTaxBracket.description}
                      </div>
                    </div>

                    {/* 1세대1주택 판정 */}
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">1세대1주택</span>
                        <Badge className={`text-xs ${oneHouseExemption.isQualified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {oneHouseExemption.isQualified ? '적용' : '미적용'}
                        </Badge>
                      </div>
                      <div className={`text-lg font-bold ${oneHouseExemption.isQualified ? 'text-green-700' : 'text-gray-700'}`}>
                        {oneHouseExemption.isQualified ? '비과세' : '일반과세'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        자동 요건 판정
                      </div>
                    </div>
                  </div>

                  {/* 1세대1주택 요건 체크 */}
                  {oneHouseExemption.requirements.length > 0 && (
                    <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                      <div className="text-sm font-medium text-gray-700 mb-3">🏠 1세대1주택 요건 자동 체크</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {oneHouseExemption.requirements.map((req, index) => (
                          <div key={index} className={`p-2 rounded text-xs ${req.met ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                            <div className="font-medium flex items-center gap-1">
                              {req.met ? '✅' : '❌'} {req.name}
                            </div>
                            <div className="mt-1 opacity-75">
                              {req.met ? '조건 충족' : '조건 미충족'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 장기보유특별공제 */}
                  {longTermDiscount > 0 && (
                    <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">🎯 장기보유특별공제</span>
                        <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                      </div>
                      <div className="text-lg font-bold text-purple-700">
                        {longTermDiscount.toLocaleString('ko-KR')}원
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {realTimeHoldingPeriod.years}년 보유 × {Math.min((realTimeHoldingPeriod.years - 2) * 8, 30)}% 공제
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
                  {logicalErrors.length === 0 && capitalGain > 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                      <div className="text-sm font-medium text-green-700 mb-2">✅ AI 자동 계산 완료</div>
                      <div className="text-xs text-green-600">
                        모든 조건이 완벽하게 분석되었습니다. 실시간으로 최적의 양도소득세가 계산되고 있습니다.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Separator />

              {/* 양도 및 취득 정보 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">💰 양도 및 취득 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EnhancedSmartInput
                    label="💰 양도가액"
                    value={inputs.salePrice}
                    onChange={(value) => updateInput('salePrice', value)}
                    placeholder="매매계약서상 금액 (필수)"
                    calculationRule="capital-gains-sale-price"
                    required={true}
                    connectedInputs={[
                      { label: '취득가액', value: inputs.acquisitionPrice },
                      { label: '양도차익', value: capitalGain, isCalculated: true }
                    ]}
                    recommendations={capitalGain > 0 ? [`양도차익: ${capitalGain.toLocaleString()}원`] : []}
                    validationRules={[
                      { type: 'min', value: 0, message: '양도가액은 0원 이상이어야 합니다' },
                      { type: 'max', value: 100000000000, message: '양도가액이 너무 큽니다' },
                      { type: 'required', message: '양도소득세 계산을 위해 양도가액 입력이 필수입니다' }
                    ]}
                  />
                  
                  <div className="space-y-2">
                    {/* 🔴 개선된 라벨 (필수 필드 강조) */}
                    <Label htmlFor="saleDate" className={`
                      flex items-center gap-2 text-sm font-medium
                      ${!inputs.saleDate ? 'text-red-700 font-semibold' : 'text-green-700 font-semibold'}
                    `}>
                      <span>📅 양도일</span>
                      
                      {/* 🔴 필수 표시 강화 */}
                      <div className="flex items-center gap-1">
                        <span className="text-red-500 text-lg font-bold">*</span>
                        <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300 px-1 py-0">
                          필수
                        </Badge>
                      </div>
                      
                      {/* ✅ 완료 표시 */}
                      {inputs.saleDate && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                          ✅ 완료
                        </Badge>
                      )}
                    </Label>
                    
                    {/* 🔴 개선된 입력 필드 */}
                    <div className="relative">
                      <Input
                        id="saleDate"
                        type="date"
                        value={inputs.saleDate}
                        onChange={(e) => updateInput('saleDate', e.target.value)}
                        className={`
                          ${!inputs.saleDate ? 
                            'border-red-400 border-2 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' :
                            'border-green-500 bg-green-50 focus:border-green-500'}
                          text-right font-mono transition-all duration-200
                        `}
                      />
                      
                      {/* 🔴 필수 필드 시각적 표시 */}
                      {!inputs.saleDate && (
                        <div className="absolute -right-2 -top-2">
                          <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                            !
                          </span>
                        </div>
                      )}
                      
                      {/* ✅ 완료 표시 */}
                      {inputs.saleDate && (
                        <div className="absolute -right-2 -top-2">
                          <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-green-500 rounded-full">
                            ✓
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* 🔴 필수 필드 오류 메시지 */}
                    {!inputs.saleDate && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        <div className="flex items-start gap-2">
                          <span className="text-red-500 font-bold">⚠️</span>
                          <span>양도일은 필수 입력 항목입니다.</span>
                          <Badge variant="destructive" className="text-xs ml-2">
                            REQUIRED
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {/* 🔴 필수 필드 완료 안내 */}
                    {inputs.saleDate && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                        ✅ 필수 입력이 완료되었습니다: {inputs.saleDate}
                      </div>
                    )}
                  </div>

                  <EnhancedSmartInput
                    label="🏷️ 취득가액"
                    value={inputs.acquisitionPrice}
                    onChange={(value) => updateInput('acquisitionPrice', value)}
                    placeholder="원시취득가액 (필수)"
                    calculationRule="capital-gains-acquisition-price"
                    required={true}
                    connectedInputs={[
                      { label: '양도가액', value: inputs.salePrice },
                      { label: '양도차익', value: capitalGain, isCalculated: true }
                    ]}
                    recommendations={inputs.acquisitionCosts === 0 ? ['취득비용 입력을 권장합니다'] : []}
                    validationRules={[
                      { type: 'min', value: 0, message: '취득가액은 0원 이상이어야 합니다' },
                      { type: 'max', value: 100000000000, message: '취득가액이 너무 큽니다' },
                      { type: 'required', message: '양도소득세 계산을 위해 취득가액 입력이 필수입니다' }
                    ]}
                  />
                  
                  <div className="space-y-2">
                    {/* 🔴 개선된 라벨 (필수 필드 강조) */}
                    <Label htmlFor="acquisitionDate" className={`
                      flex items-center gap-2 text-sm font-medium
                      ${!inputs.acquisitionDate ? 'text-red-700 font-semibold' : 'text-green-700 font-semibold'}
                    `}>
                      <span>📅 취득일</span>
                      
                      {/* 🔴 필수 표시 강화 */}
                      <div className="flex items-center gap-1">
                        <span className="text-red-500 text-lg font-bold">*</span>
                        <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300 px-1 py-0">
                          필수
                        </Badge>
                      </div>
                      
                      {/* ✅ 완료 표시 */}
                      {inputs.acquisitionDate && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                          ✅ 완료
                        </Badge>
                      )}
                    </Label>
                    
                    {/* 🔴 개선된 입력 필드 */}
                    <div className="relative">
                      <Input
                        id="acquisitionDate"
                        type="date"
                        value={inputs.acquisitionDate}
                        onChange={(e) => updateInput('acquisitionDate', e.target.value)}
                        className={`
                          ${!inputs.acquisitionDate ? 
                            'border-red-400 border-2 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' :
                            'border-green-500 bg-green-50 focus:border-green-500'}
                          text-right font-mono transition-all duration-200
                        `}
                      />
                      
                      {/* 🔴 필수 필드 시각적 표시 */}
                      {!inputs.acquisitionDate && (
                        <div className="absolute -right-2 -top-2">
                          <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                            !
                          </span>
                        </div>
                      )}
                      
                      {/* ✅ 완료 표시 */}
                      {inputs.acquisitionDate && (
                        <div className="absolute -right-2 -top-2">
                          <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-green-500 rounded-full">
                            ✓
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* 🔴 필수 필드 오류 메시지 */}
                    {!inputs.acquisitionDate && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        <div className="flex items-start gap-2">
                          <span className="text-red-500 font-bold">⚠️</span>
                          <span>취득일은 필수 입력 항목입니다.</span>
                          <Badge variant="destructive" className="text-xs ml-2">
                            REQUIRED
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {/* 🔴 필수 필드 완료 안내 */}
                    {inputs.acquisitionDate && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                        ✅ 필수 입력이 완료되었습니다: {inputs.acquisitionDate}
                      </div>
                    )}
                  </div>
                </div>

                {/* 📊 실시간 보유기간 디스플레이 */}
                {inputs.acquisitionDate && inputs.saleDate && (
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-800">실시간 보유기간 계산</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-indigo-900">
                          {calculatedValues.holdingPeriodYears}년 {calculatedValues.holdingPeriodMonths}개월 {calculatedValues.holdingPeriodDays}일
                        </div>
                        <div className="text-xs text-indigo-600">
                          {calculatedValues.isLongTermHolding ? '✅ 장기보유 (2년 이상)' : '⚠️ 단기보유 (2년 미만)'}
                        </div>
                      </div>
                    </div>
                    
                    {/* 🔥 보유기간별 세율 미리보기 (수정됨) */}
                    <div className="mt-3 pt-3 border-t border-indigo-200">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-indigo-700">적용세율</div>
                          <div className={`text-indigo-900 font-bold ${
                            calculatedValues.holdingPeriodYears < 1 ? 'text-red-700' :
                            calculatedValues.holdingPeriodYears < 2 ? 'text-orange-700' : 'text-indigo-900'
                          }`}>
                            {calculatedValues.holdingPeriodYears < 1 ? '70%' : 
                             calculatedValues.holdingPeriodYears < 2 ? '60%' : '6~45%'}
                          </div>
                          <div className="text-xs text-indigo-600 mt-1">
                            {calculatedValues.holdingPeriodYears < 1 ? '단기양도 중과세' :
                             calculatedValues.holdingPeriodYears < 2 ? '단기양도 중과세' : '일반 누진세율'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-indigo-700">장기보유공제</div>
                          <div className="text-indigo-900">
                            {calculatedValues.holdingPeriodYears >= 3 ? 
                              Math.min((calculatedValues.holdingPeriodYears - 2) * 8, 80) : 0}%
                          </div>
                          <div className="text-xs text-indigo-600 mt-1">
                            {calculatedValues.holdingPeriodYears >= 3 ? '적용가능' : '3년 이상 필요'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-indigo-700">양도차익</div>
                          <div className="text-indigo-900">
                            {inputs.salePrice > inputs.acquisitionPrice ? 
                              formatCurrency(inputs.salePrice - inputs.acquisitionPrice) : '0원'}
                          </div>
                          <div className="text-xs text-indigo-600 mt-1">
                            {inputs.salePrice > inputs.acquisitionPrice ? '과세대상' : '양도손실'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 부대비용 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">부대비용</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EnhancedSmartInput
                    label="취득비용"
                    value={inputs.acquisitionCosts}
                    onChange={(value) => updateInput('acquisitionCosts', value)}
                    placeholder="등록세, 중개수수료 등"
                    calculationRule="capital-gains-acquisition-costs"
                    connectedInputs={[
                      { label: '취득가액', value: inputs.acquisitionPrice },
                      { label: '양도차익', value: capitalGain, isCalculated: true }
                    ]}
                    quickActions={[
                      { label: '취득가액의 3%', value: Math.floor(inputs.acquisitionPrice * 0.03) },
                      { label: '취득가액의 5%', value: Math.floor(inputs.acquisitionPrice * 0.05) }
                    ]}
                    recommendations={inputs.acquisitionPrice > 0 && inputs.acquisitionCosts === 0 ? 
                      [`일반적으로 취득가액의 3-5% 수준`] : []
                    }
                    validationRules={[
                      { type: 'min', value: 0, message: '취득비용은 0원 이상이어야 합니다' },
                      { type: 'max', value: 1000000000, message: '취득비용이 너무 큽니다' }
                    ]}
                  />
                  
                  <EnhancedSmartInput
                    label="개량비"
                    value={inputs.improvementCosts}
                    onChange={(value) => updateInput('improvementCosts', value)}
                    placeholder="리모델링 비용 등"
                    calculationRule="capital-gains-improvement-costs"
                    connectedInputs={[
                      { label: '취득가액', value: inputs.acquisitionPrice },
                      { label: '양도차익', value: capitalGain, isCalculated: true }
                    ]}
                    recommendations={realTimeHoldingPeriod.years >= 5 && inputs.improvementCosts === 0 ? 
                      ['장기보유 시 개량비 영수증 보관 권장'] : []
                    }
                    validationRules={[
                      { type: 'min', value: 0, message: '개량비는 0원 이상이어야 합니다' },
                      { type: 'max', value: 5000000000, message: '개량비가 너무 큽니다' }
                    ]}
                  />
                  
                  <EnhancedSmartInput
                    label="양도비용"
                    value={inputs.transferCosts}
                    onChange={(value) => updateInput('transferCosts', value)}
                    placeholder="중개수수료, 인지세 등"
                    calculationRule="capital-gains-transfer-costs"
                    connectedInputs={[
                      { label: '양도가액', value: inputs.salePrice },
                      { label: '양도차익', value: capitalGain, isCalculated: true }
                    ]}
                    quickActions={[
                      { label: '양도가액의 1%', value: Math.floor(inputs.salePrice * 0.01) },
                      { label: '양도가액의 2%', value: Math.floor(inputs.salePrice * 0.02) }
                    ]}
                    recommendations={inputs.salePrice > 0 && inputs.transferCosts === 0 ? 
                      [`일반적으로 양도가액의 1-2% 수준`] : []
                    }
                    validationRules={[
                      { type: 'min', value: 0, message: '양도비용은 0원 이상이어야 합니다' },
                      { type: 'max', value: 1000000000, message: '양도비용이 너무 큽니다' }
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                특례 및 공제 요건
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 종합적인 부동산 소유정보 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">📊 종합 부동산 소유정보 및 자동 판정</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <NumberInput
                      label="세대주 나이"
                      value={inputs.age}
                      onChange={(value) => updateInput('age', value)}
                      suffix="세"
                      max={120}
                      min={18}
                      helpText="세대주 기준 나이"
                    />
                    <NumberInput
                      label="세대원 수"
                      value={inputs.householdMembers}
                      onChange={(value) => updateInput('householdMembers', value)}
                      suffix="명"
                      max={20}
                      min={1}
                      helpText="주민등록상 세대원 수"
                    />
                    <NumberInput
                      label="전체 보유주택 수"
                      value={inputs.totalHousesOwned}
                      onChange={(value) => updateInput('totalHousesOwned', value)}
                      suffix="채"
                      max={20}
                      min={1}
                      helpText="세대 전체 주택 보유 현황"
                    />
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        자동계산 보유기간 🔄
                      </Label>
                      <div className="h-10 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-end">
                        <span className="text-sm font-mono text-blue-900">
                          {calculatedValues.holdingPeriodYears}년 {calculatedValues.holdingPeriodMonths}개월
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        💡 양도일-취득일 기준 자동계산
                      </p>
                    </div>
                  </div>

                  {/* 🤖 AI 자동 판정 결과 */}
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">실시간 자동 판정 결과</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 1세대1주택 판정 */}
                      <div className={`p-3 rounded-lg border-2 ${
                        inputs.totalHousesOwned === 1 ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                      }`}>
                        <div className="text-xs font-medium mb-1">
                          {inputs.totalHousesOwned === 1 ? '✅ 1세대1주택' : '❌ 다주택자'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {inputs.totalHousesOwned === 1 ? 
                            `비과세 가능성: ${inputs.salePrice <= 1200000000 ? '높음' : '일부'}` :
                            `중과세 적용: +${calculatedValues.autoDetectedHeavyTax.heavyTaxRate}%p`
                          }
                        </div>
                      </div>

                      {/* 보유기간 판정 */}
                      <div className={`p-3 rounded-lg border-2 ${
                        calculatedValues.isLongTermHolding ? 'border-blue-300 bg-blue-50' : 'border-orange-300 bg-orange-50'
                      }`}>
                        <div className="text-xs font-medium mb-1">
                          {calculatedValues.isLongTermHolding ? '✅ 장기보유' : '⚠️ 단기보유'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {calculatedValues.isLongTermHolding ? 
                            `장기보유공제: ${calculatedValues.holdingPeriodYears >= 3 ? Math.min((calculatedValues.holdingPeriodYears - 2) * 8, 80) : 0}%` :
                            `단기양도 중과세: ${calculatedValues.holdingPeriodYears < 1 ? '70%' : '60%'}`
                          }
                        </div>
                      </div>

                      {/* 중과세 위험도 판정 */}
                      <div className={`p-3 rounded-lg border-2 ${
                        calculatedValues.autoDetectedHeavyTax.heavyTaxRate === 0 ? 'border-green-300 bg-green-50' : 
                        calculatedValues.autoDetectedHeavyTax.heavyTaxRate <= 20 ? 'border-yellow-300 bg-yellow-50' :
                        'border-red-300 bg-red-50'
                      }`}>
                        <div className="text-xs font-medium mb-1">
                          {calculatedValues.autoDetectedHeavyTax.heavyTaxRate === 0 ? '✅ 일반과세' : 
                           calculatedValues.autoDetectedHeavyTax.heavyTaxRate <= 20 ? '⚠️ 경미한 중과세' : '🚨 높은 중과세'}
                        </div>
                        <div className="text-xs text-gray-600">
                          추가세율: +{calculatedValues.autoDetectedHeavyTax.heavyTaxRate}%p
                        </div>
                      </div>
                    </div>

                    {/* 상세 분석 */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span>🏠 주택 보유 현황:</span>
                          <span className="font-medium">
                            {inputs.totalHousesOwned}채 보유
                            {inputs.totalHousesOwned >= 2 && ` (${inputs.totalHousesOwned >= 3 ? '3주택 이상' : '2주택'})`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>📅 보유 기간:</span>
                          <span className="font-medium">
                            {calculatedValues.holdingPeriodYears}년 {calculatedValues.holdingPeriodMonths}개월
                            {calculatedValues.isLongTermHolding ? ' (장기)' : ' (단기)'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>💰 예상 세율:</span>
                          <span className={`font-medium ${
                            calculatedValues.holdingPeriodYears < 2 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {calculatedValues.holdingPeriodYears < 1 ? '70% (단기양도)' : 
                             calculatedValues.holdingPeriodYears < 2 ? '60% (단기양도)' : '6~45% (누진세율)'}
                            {calculatedValues.holdingPeriodYears >= 2 && calculatedValues.autoDetectedHeavyTax.heavyTaxRate > 0 && 
                              ` (+${calculatedValues.autoDetectedHeavyTax.heavyTaxRate}%p)`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1세대1주택 관련 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">🏠 1세대1주택 특례</h4>
                <div className="bg-green-50 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="oneHouse"
                          checked={inputs.isOneHouseOneFamily}
                          onCheckedChange={(checked) => updateInput('isOneHouseOneFamily', checked)}
                        />
                        <Label htmlFor="oneHouse" className="text-sm font-semibold">
                          1세대1주택 해당 ✨
                        </Label>
                      </div>
                      <div className="text-xs text-green-700 ml-6">
                        • 12억원 이하: 완전 비과세 (2024년 기준)<br/>
                        • 12억원~30억원: 일부 과세<br/>
                        • 30억원 초과: 전액 과세
                      </div>
                    </div>
                    
                    <EnhancedSmartInput
                      label="실거주 연수"
                      value={inputs.residenceYears}
                      onChange={(value) => updateInput('residenceYears', value)}
                      placeholder="2"
                      calculationRule="capital-gains-residence-years"
                      connectedInputs={[
                        { label: '보유기간', value: realTimeHoldingPeriod.years, isCalculated: true },
                        { label: '1세대1주택 요건', value: oneHouseExemption.isQualified ? 1 : 0, isCalculated: true }
                      ]}
                      quickActions={[
                        { label: '2년 (최소요건)', value: 2 },
                        { label: '3년', value: 3 },
                        { label: '5년', value: 5 },
                        { label: '10년', value: 10 }
                      ]}
                      recommendations={inputs.residenceYears < 2 ? 
                        ['1세대1주택 비과세를 위해 최소 2년 이상 거주 필요'] : 
                        inputs.residenceYears >= 2 && inputs.totalHousesOwned === 1 ? 
                        ['1세대1주택 거주 요건 충족!'] : []
                      }
                      warningMessage={inputs.residenceYears > realTimeHoldingPeriod.years && realTimeHoldingPeriod.years > 0 ? 
                        '거주기간이 보유기간을 초과할 수 없습니다' : undefined
                      }
                      validationRules={[
                        { type: 'min', value: 0, message: '거주기간은 0년 이상이어야 합니다' },
                        { type: 'max', value: 50, message: '거주기간이 너무 깁니다' }
                      ]}
                    />
                  </div>

                  {/* 1세대1주택 요건 체크리스트 */}
                  {inputs.isOneHouseOneFamily && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-800 mb-2">📋 비과세 요건 체크리스트</div>
                      <div className="space-y-2 text-xs text-green-700">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${inputs.totalHousesOwned === 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span>1세대 1주택 보유: {inputs.totalHousesOwned === 1 ? '✅ 충족' : '❌ 미충족'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${inputs.residenceYears >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span>2년 이상 실거주: {inputs.residenceYears >= 2 ? '✅ 충족' : '❌ 미충족'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${inputs.salePrice <= 1200000000 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span>양도가액 12억원 이하: {inputs.salePrice <= 1200000000 ? '✅ 완전비과세' : '⚠️ 일부과세'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* 2024년 기준 중과세 및 특별 규정 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">⚠️ 2024년 중과세 및 특별 규정</h4>
                <div className="bg-red-50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-red-700">
                      📢 2024년 주요 변경사항: 1세대1주택 비과세 한도 9억원 → 12억원 상향 조정
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-1"></div>
                      <span className="text-gray-600">AI 자동 판정 적용</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className={`bg-white p-3 rounded-lg border-2 ${
                        calculatedValues.autoDetectedHeavyTax.isMultipleHouses ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-red-800">🏘️ 다주택자 중과세</div>
                          {calculatedValues.autoDetectedHeavyTax.isMultipleHouses && (
                            <div className="flex items-center text-xs">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                              <span className="text-red-600 font-medium">자동 감지</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="multipleHouses"
                              checked={inputs.isMultipleHouses}
                              onCheckedChange={(checked) => updateInput('isMultipleHouses', checked)}
                              disabled={calculatedValues.autoDetectedHeavyTax.isMultipleHouses}
                            />
                            <Label htmlFor="multipleHouses" className="text-xs">
                              2주택 이상 보유 (기본세율 + 20%p)
                              {calculatedValues.autoDetectedHeavyTax.isMultipleHouses && (
                                <span className="ml-2 text-red-600 font-medium">[자동 적용됨]</span>
                              )}
                            </Label>
                          </div>
                          <div className="text-xs text-red-600 ml-6">
                            • 2주택: 기본세율 + 20%p<br/>
                            • 3주택 이상: 기본세율 + 30%p<br/>
                            {calculatedValues.autoDetectedHeavyTax.isMultipleHouses && (
                              <span className="font-medium text-red-700">
                                → 현재 {inputs.totalHousesOwned}주택으로 +{calculatedValues.autoDetectedHeavyTax.heavyTaxRate >= 30 ? '30' : '20'}%p 적용
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <div className="text-sm font-semibold text-red-800 mb-2">📍 조정대상지역</div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="schoolDistrict"
                              checked={inputs.hasSchoolDistrict}
                              onCheckedChange={(checked) => updateInput('hasSchoolDistrict', checked)}
                            />
                            <Label htmlFor="schoolDistrict" className="text-xs">
                              조정대상지역 소재 (기본세율 + 20%p)
                            </Label>
                          </div>
                          <div className="text-xs text-red-600 ml-6">
                            • 서울 강남3구, 송파, 서초 등<br/>
                            • 경기 성남, 용인 등 지정지역
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <div className="text-sm font-semibold text-red-800 mb-2">🏗️ 투기 관련</div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="reconstruction"
                              checked={inputs.isReconstructionArea}
                              onCheckedChange={(checked) => updateInput('isReconstructionArea', checked)}
                            />
                            <Label htmlFor="reconstruction" className="text-xs">
                              투기과열지구/투기지역 (최대 70%)
                            </Label>
                          </div>
                          <div className="text-xs text-red-600 ml-6">
                            • 1년 미만 보유: 70% 세율<br/>
                            • 2년 미만 보유: 60% 세율
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <div className="text-sm font-semibold text-red-800 mb-2">🌍 비거주자</div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="nonResident"
                              checked={inputs.isNonResident}
                              onCheckedChange={(checked) => updateInput('isNonResident', checked)}
                            />
                            <Label htmlFor="nonResident" className="text-xs">
                              비거주자 (일괄 30% 또는 일반세율)
                            </Label>
                          </div>
                          <div className="text-xs text-red-600 ml-6">
                            • 국내 거주자가 아닌 경우<br/>
                            • 30% 또는 일반세율 중 유리한 것 선택
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 중과세 적용 시 세율 안내 */}
                  {(inputs.isMultipleHouses || inputs.hasSchoolDistrict || inputs.isReconstructionArea) && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                      <div className="text-sm font-medium text-yellow-800 mb-2">📊 예상 적용 세율</div>
                      <div className="text-xs text-yellow-700">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium">보유기간별 기본세율:</div>
                            <div>• 1년 미만: 70%</div>
                            <div>• 1년~2년: 60%</div>
                            <div>• 2년 이상: 6%~45% (소득구간별)</div>
                          </div>
                          <div>
                            <div className="font-medium">중과세 추가:</div>
                            <div>• 다주택자: +20%p~30%p</div>
                            <div>• 조정대상지역: +20%p</div>
                            <div>• 투기지역: 최대 70%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* 기납부세액 및 특수상황 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">💰 기납부세액 및 특수상황</h4>
                <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EnhancedSmartInput
                      label="기납부세액"
                      value={inputs.previousYearTaxPaid}
                      onChange={(value) => updateInput('previousYearTaxPaid', value)}
                      placeholder="중간예납세액 등"
                      calculationRule="capital-gains-prepaid-tax"
                      connectedInputs={[
                        { label: '예상세액', value: results?.totalTax || 0, isCalculated: true }
                      ]}
                      recommendations={results && results.totalTax > 0 && inputs.previousYearTaxPaid === 0 ? 
                        ['중간예납을 했다면 기납부세액을 입력하세요'] : []
                      }
                      validationRules={[
                        { type: 'min', value: 0, message: '기납부세액은 0원 이상이어야 합니다' },
                        { type: 'max', value: 1000000000, message: '기납부세액이 너무 큽니다' }
                      ]}
                    />
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-blue-800">🌏 특수상황</div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="foreignerExemption"
                            checked={inputs.isForeignerExemption}
                            onCheckedChange={(checked) => updateInput('isForeignerExemption', checked)}
                          />
                          <Label htmlFor="foreignerExemption" className="text-xs">
                            외국인 비과세 대상
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="foreclosure"
                            checked={inputs.isForeclosure}
                            onCheckedChange={(checked) => updateInput('isForeclosure', checked)}
                          />
                          <Label htmlFor="foreclosure" className="text-xs">
                            경매/공매 취득
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2024년 특별 감면 및 혜택 */}
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-800 mb-2">🎁 2024년 특별 감면 혜택</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="specialCaseGift"
                          checked={inputs.specialCases.isGiftProperty}
                          onCheckedChange={(checked) => updateSpecialCase('isGiftProperty', Boolean(checked))}
                        />
                        <Label htmlFor="specialCaseGift" className="text-xs">
                          증여받은 부동산 (증여세 납부 시 감면)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="specialCaseInheritance"
                          checked={inputs.specialCases.isInheritedProperty}
                          onCheckedChange={(checked) => updateSpecialCase('isInheritedProperty', Boolean(checked))}
                        />
                        <Label htmlFor="specialCaseInheritance" className="text-xs">
                          상속받은 부동산 (상속세 납부 시 감면)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="specialCaseSelfConstruction"
                          checked={inputs.specialCases.isSelfConstruction}
                          onCheckedChange={(checked) => updateSpecialCase('isSelfConstruction', Boolean(checked))}
                        />
                        <Label htmlFor="specialCaseSelfConstruction" className="text-xs">
                          자가건설 (건축비 등 추가 공제)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="specialCaseCompensation"
                          checked={inputs.specialCases.isPublicLandCompensation}
                          onCheckedChange={(checked) => updateSpecialCase('isPublicLandCompensation', Boolean(checked))}
                        />
                        <Label htmlFor="specialCaseCompensation" className="text-xs">
                          공익사업 보상 (대토보상 등 특례)
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* 절세 팁 */}
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <div className="text-sm font-medium text-emerald-800 mb-2">💡 2024년 절세 팁</div>
                    <div className="text-xs text-emerald-700 space-y-1">
                      <div>• <strong>기본공제 250만원</strong>: 모든 양도소득에 자동 적용 (별도 신청 불필요)</div>
                      <div>• 장기보유특별공제: 3년 이상 보유 시 연 4%씩 최대 80% 공제</div>
                      <div>• 취득세 및 개량비 영수증 보관으로 필요경비 최대화</div>
                      <div>• 1세대1주택 요건 충족 시 12억원까지 완전 비과세</div>
                      <div>• 양도소득 발생 시 다음 해 5월 31일까지 신고납부</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={calculate} 
                  disabled={isCalculating || (!inputs.acquisitionPrice || !inputs.disposalPrice)}
                  className={`flex-1 transition-all duration-200 transform
                    ${(!inputs.acquisitionPrice || !inputs.disposalPrice) ? 
                      'bg-gray-400 cursor-not-allowed' :
                      isCalculating ? 'animate-pulse' :
                      'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    }
                  `}
                >
                  {isCalculating ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      계산 중...
                    </>
                  ) : (!inputs.acquisitionPrice || !inputs.disposalPrice) ? (
                    <>
                      <Calculator className="w-4 h-4 mr-2 opacity-50" />
                      가격 정보 입력 필요
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      {results ? '재계산하기' : '계산하기'}
                    </>
                  )}
                </Button>
                
                {/* 🔥 개선된 샘플 데이터 버튼 */}
                <Button 
                  variant="outline" 
                  onClick={loadSampleData} 
                  size="sm"
                  className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                    bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100
                    border-orange-200 text-orange-700 hover:border-orange-300 hover:shadow-md
                    relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-100 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <span className="mr-1 text-lg">📋</span>
                    샘플
                  </span>
                </Button>
                
                {/* 🔥 개선된 초기화 버튼 */}
                <Button 
                  variant="outline" 
                  onClick={reset} 
                  size="sm"
                  className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                    hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-md
                    relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <RotateCcw className="w-4 h-4 mr-1 group-hover:rotate-180 transition-transform duration-300" />
                    초기화
                  </span>
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
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    계산 결과
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 비과세 적용 시 */}
                  {results.taxExemption.isExempt ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="text-sm text-green-600 font-medium flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          비과세 적용
                        </div>
                        <div className="text-2xl font-bold text-green-900">
                          납부세액 없음
                        </div>
                        <div className="text-sm text-green-700 mt-1">
                          {results.taxExemption.reason}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-blue-600">양도차익</div>
                        <div className="text-base font-semibold text-blue-900">
                          {formatCurrency(results.transferIncome)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 과세 적용 시
                    <div className="space-y-4">
                      {/* 🔥 기본공제 자동적용 안내 메시지 */}
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <div className="text-sm font-medium text-green-800">
                            ✅ 기본공제 250만원 자동 적용됨
                          </div>
                        </div>
                        <div className="text-xs text-green-700 mt-1">
                          양도소득세는 법정 기본공제 250만원이 자동으로 차감되어 계산됩니다.
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-xl">
                        <div className="text-sm text-purple-600 font-medium">총 납부세액</div>
                        <div className="text-2xl font-bold text-purple-900">
                          {formatCurrency(results.totalTax)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm text-blue-600">양도차익</div>
                          <div className="text-base font-semibold text-blue-900">
                            {formatCurrency(results.transferIncome)}
                          </div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-sm text-green-600">과세표준</div>
                          <div className="text-base font-semibold text-green-900">
                            {formatCurrency(results.taxableGain)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-red-50 p-3 rounded-lg">
                          <div className="text-sm text-red-600">양도소득세</div>
                          <div className="text-base font-semibold text-red-900">
                            {formatCurrency(results.basicTax + results.heavyTax)}
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
                      {results.additionalPayment > 0 && (
                        <div className="bg-orange-50 p-4 rounded-xl">
                          <div className="text-sm text-orange-600 font-medium">추가납부세액</div>
                          <div className="text-xl font-bold text-orange-900">
                            {formatCurrency(results.additionalPayment)}
                          </div>
                        </div>
                      )}

                      {results.refundAmount > 0 && (
                        <div className="bg-cyan-50 p-4 rounded-xl">
                          <div className="text-sm text-cyan-600 font-medium">환급세액</div>
                          <div className="text-xl font-bold text-cyan-900">
                            {formatCurrency(results.refundAmount)}
                          </div>
                        </div>
                      )}

                      {/* 세율 정보 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600 flex items-center">
                            <Lightbulb className="w-4 h-4 mr-1" />
                            적용세율
                          </div>
                          <div className="text-base font-semibold text-gray-900">
                            {(results.appliedTaxRate * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="text-sm text-indigo-600 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            실효세율
                          </div>
                          <div className="text-base font-semibold text-indigo-900">
                            {results.effectiveRate.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {/* 보유기간 정보 */}
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <div className="text-sm text-emerald-600 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          보유기간
                        </div>
                        <div className="text-base font-semibold text-emerald-900">
                          {results.holdingYears}년 {results.holdingMonths % 12}개월
                        </div>
                      </div>

                      {/* 중과세 정보 */}
                      {results.heavyTaxInfo.isApplied && (
                        <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                            <div className="text-sm font-medium text-orange-800">
                              중과세 적용: {results.heavyTaxInfo.reason}
                            </div>
                          </div>
                          <div className="text-sm text-orange-700 mt-1">
                            추가세율: {(results.heavyTaxInfo.additionalRate * 100)}%p
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    {/* 🔥 개선된 계산과정 보기/숨기기 버튼 */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      className="flex-1 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                        bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100
                        border-blue-200 text-blue-700 hover:border-blue-300 hover:shadow-md
                        relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      <span className="relative flex items-center">
                        {showBreakdown ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                            계산과정 숨기기
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                            계산과정 보기
                          </>
                        )}
                      </span>
                    </Button>
                    
                    {/* 🔥 개선된 저장 버튼 */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                        bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100
                        border-green-200 text-green-700 hover:border-green-300 hover:shadow-md
                        relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      <span className="relative flex items-center">
                        <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        저장
                      </span>
                    </Button>
                  </div>

                  {/* 결과 관련 면책 조항 */}
                  <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Users className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
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
                        {/* 🔥 기본공제 자동적용 안내 메시지 */}
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <div className="text-sm font-medium text-green-800">
                              ✅ 기본공제 250만원이 자동으로 적용되었습니다
                            </div>
                          </div>
                          <div className="text-xs text-green-700 mt-1">
                            양도소득세법에 따라 모든 양도소득에는 기본공제 250만원이 자동으로 차감됩니다.
                          </div>
                        </div>

                        <div className="space-y-3">
                          {results.calculationDetails.steps.map((step, index) => (
                            <div key={index} className={`flex justify-between items-center py-2 border-b border-gray-100 ${
                              step.label === '기본공제' ? 'bg-green-50 px-2 rounded' : ''
                            }`}>
                              <div>
                                <span className="text-sm font-medium text-gray-700">
                                  {step.label}
                                  {step.label === '기본공제' && (
                                    <Badge className="ml-2 text-xs bg-green-100 text-green-700 border-green-300">법정 자동적용</Badge>
                                  )}
                                </span>
                                {step.description && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {step.description}
                                    {step.label === '기본공제' && ' (법정 기본공제로 자동 차감)'}
                                  </div>
                                )}
                              </div>
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
                          {results.calculationDetails.taxRates.map((rate, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{rate.bracket}</span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {(rate.rate * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-right mt-1">
                                <span className="text-sm font-medium text-purple-600">
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
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  계산 결과가 여기에 표시됩니다
                </h3>
                <p className="text-gray-600">
                  부동산 정보를 입력하면 자동으로 계산됩니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 