'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calculator,
  TrendingUp,
  Home,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Percent,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { CapitalGainsTaxInput, CapitalGainsTaxResult } from '@/types/tax-calculator.types';
import { CapitalGainsTaxCalculator } from '@/lib/utils/tax-calculations';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { CAPITAL_GAINS_TAX_2024 } from '@/constants/tax-rates-2024';
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
    age: 0,
    householdMembers: 0,
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
      const result = CapitalGainsTaxCalculator.calculate(inputs);
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
      age: 0,
      householdMembers: 0,
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
  };

  // 유효한 데이터가 있을 때만 자동 계산
  useEffect(() => {
    if (inputs.salePrice > 0 && inputs.acquisitionPrice > 0 && inputs.saleDate && inputs.acquisitionDate) {
      const timer = setTimeout(() => {
        calculate();
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setResults(null);
    }
  }, [inputs, calculate]);

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
                  양도소득세 계산기
                </CardTitle>
                <CardDescription className="text-gray-600">
                  2024년 세율 기준 · 부동산 양도소득세 계산
                </CardDescription>
                <p className="text-sm text-blue-600 mt-2">
                  💡 "샘플 데이터" 버튼을 클릭하여 예시 데이터로 테스트해보세요
                </p>
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
                        <SelectItem value="apartment">아파트</SelectItem>
                        <SelectItem value="house">단독주택</SelectItem>
                        <SelectItem value="commercial">상업용 부동산</SelectItem>
                        <SelectItem value="land">토지</SelectItem>
                        <SelectItem value="stock">주식</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <NumberInput
                    label="보유주택 수"
                    value={inputs.totalHousesOwned}
                    onChange={(value) => updateInput('totalHousesOwned', value)}
                    suffix="채"
                    max={20}
                    helpText="본인 및 세대원 전체 보유주택 수"
                  />
                </div>
              </div>

              <Separator />

              {/* 양도 및 취득 정보 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">양도 및 취득 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput
                    label="양도가액"
                    value={inputs.salePrice}
                    onChange={(value) => updateInput('salePrice', value)}
                    placeholder="매매계약서상 금액"
                    max={100000000000}
                    helpText="매매계약서에 기재된 실제 거래가격"
                  />
                  
                  <div>
                    <Label htmlFor="saleDate" className="text-sm font-medium text-gray-700 mb-2 block">
                      양도일
                    </Label>
                    <Input
                      id="saleDate"
                      type="date"
                      value={inputs.saleDate}
                      onChange={(e) => updateInput('saleDate', e.target.value)}
                    />
                  </div>

                  <NumberInput
                    label="취득가액"
                    value={inputs.acquisitionPrice}
                    onChange={(value) => updateInput('acquisitionPrice', value)}
                    placeholder="원시취득가액"
                    max={100000000000}
                    helpText="처음 매입한 가격 (등기부상 금액)"
                  />
                  
                  <div>
                    <Label htmlFor="acquisitionDate" className="text-sm font-medium text-gray-700 mb-2 block">
                      취득일
                    </Label>
                    <Input
                      id="acquisitionDate"
                      type="date"
                      value={inputs.acquisitionDate}
                      onChange={(e) => updateInput('acquisitionDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 부대비용 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">부대비용</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NumberInput
                    label="취득비용"
                    value={inputs.acquisitionCosts}
                    onChange={(value) => updateInput('acquisitionCosts', value)}
                    placeholder="등록세, 중개수수료 등"
                    max={1000000000}
                    helpText="등록세, 중개수수료, 법무사 수수료 등"
                  />
                  
                  <NumberInput
                    label="개량비"
                    value={inputs.improvementCosts}
                    onChange={(value) => updateInput('improvementCosts', value)}
                    placeholder="리모델링 비용 등"
                    max={5000000000}
                    helpText="리모델링, 증축 등 자본적 지출"
                  />
                  
                  <NumberInput
                    label="양도비용"
                    value={inputs.transferCosts}
                    onChange={(value) => updateInput('transferCosts', value)}
                    placeholder="중개수수료, 인지세 등"
                    max={1000000000}
                    helpText="매매 시 발생한 중개수수료, 인지세 등"
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
              {/* 1세대1주택 관련 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">1세대1주택 관련</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="oneHouse"
                        checked={inputs.isOneHouseOneFamily}
                        onCheckedChange={(checked) => updateInput('isOneHouseOneFamily', checked)}
                      />
                      <Label htmlFor="oneHouse" className="text-sm">
                        1세대1주택 해당 (9억원 이하 비과세 가능)
                      </Label>
                    </div>
                  </div>
                  
                  <NumberInput
                    label="실거주 연수"
                    value={inputs.residenceYears}
                    onChange={(value) => updateInput('residenceYears', value)}
                    suffix="년"
                    max={50}
                    helpText="최소 2년 이상 거주 시 비과세 요건 충족"
                  />
                </div>
              </div>

              <Separator />

              {/* 중과세 관련 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">중과세 관련</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="multipleHouses"
                        checked={inputs.isMultipleHouses}
                        onCheckedChange={(checked) => updateInput('isMultipleHouses', checked)}
                      />
                      <Label htmlFor="multipleHouses" className="text-sm">
                        다주택자 (기본세율 + 20%p)
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="schoolDistrict"
                        checked={inputs.hasSchoolDistrict}
                        onCheckedChange={(checked) => updateInput('hasSchoolDistrict', checked)}
                      />
                      <Label htmlFor="schoolDistrict" className="text-sm">
                        조정대상지역 (기본세율 + 20%p)
                      </Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reconstruction"
                        checked={inputs.isReconstructionArea}
                        onCheckedChange={(checked) => updateInput('isReconstructionArea', checked)}
                      />
                      <Label htmlFor="reconstruction" className="text-sm">
                        재개발지역 (기본세율 + 20%p)
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nonResident"
                        checked={inputs.isNonResident}
                        onCheckedChange={(checked) => updateInput('isNonResident', checked)}
                      />
                      <Label htmlFor="nonResident" className="text-sm">
                        비거주자 (일괄 30% 세율)
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 기납부세액 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">기타</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput
                    label="기납부세액"
                    value={inputs.previousYearTaxPaid}
                    onChange={(value) => updateInput('previousYearTaxPaid', value)}
                    placeholder="중간예납세액 등"
                    max={1000000000}
                    helpText="이미 납부한 중간예납세액"
                  />
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="foreignerExemption"
                        checked={inputs.isForeignerExemption}
                        onCheckedChange={(checked) => updateInput('isForeignerExemption', checked)}
                      />
                      <Label htmlFor="foreignerExemption" className="text-sm">
                        외국인 비과세 대상
                      </Label>
                    </div>
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
                            <Percent className="w-4 h-4 mr-1" />
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
                          <Calendar className="w-4 h-4 mr-1" />
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
                          {results.calculationDetails.steps.map((step, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <div>
                                <span className="text-sm font-medium text-gray-700">
                                  {step.label}
                                </span>
                                {step.description && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {step.description}
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