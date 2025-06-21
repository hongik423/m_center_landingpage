'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InheritanceTaxCalculator, InheritanceTaxInputValidator } from '@/lib/utils/inheritance-tax-calculations';
import { InheritanceTaxInput, InheritanceTaxResult } from '@/types/tax-calculator.types';
import { INHERITANCE_TAX_LIMITS_2024 } from '@/constants/tax-rates-2024';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';
import { formatNumber, formatWon } from '@/lib/utils';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  info?: string;
  limit?: number;
  unit?: string;
  helpMessage?: string;
  dependentValue?: number;
  dynamicInfo?: (value: number, dependentValue?: number) => string;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  info,
  limit,
  unit = '원',
  helpMessage,
  dependentValue,
  dynamicInfo
}) => {
  const [displayValue, setDisplayValue] = useState(formatNumber(value));
  const [hasWarning, setHasWarning] = useState(false);
  const [dynamicMessage, setDynamicMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, '');
    const numericValue = Math.round(parseInt(inputValue) || 0);
    
    setDisplayValue(formatNumber(numericValue));
    
    // 한도 체크
    let finalValue = numericValue;
    let warning = false;
    
    if (limit && numericValue > limit) {
      finalValue = limit;
      warning = true;
      setDisplayValue(formatNumber(limit));
    }
    
    setHasWarning(warning);
    
    // 동적 정보 업데이트
    if (dynamicInfo) {
      setDynamicMessage(dynamicInfo(finalValue, dependentValue));
    }
    
    onChange(finalValue);
  };

  // 초기 동적 메시지 설정
  React.useEffect(() => {
    if (dynamicInfo) {
      setDynamicMessage(dynamicInfo(value, dependentValue));
    }
  }, [dynamicInfo, value, dependentValue]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={label.replace(/\s/g, '')}>{label}</Label>
        {limit && (
          <Badge variant="outline" className="text-xs">
            한도: {formatNumber(limit)}{unit}
          </Badge>
        )}
        {helpMessage && (
          <Badge variant="secondary" className="text-xs">
            💡 도움말
          </Badge>
        )}
      </div>
      <Input
        id={label.replace(/\s/g, '')}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={hasWarning ? 'border-orange-300 bg-orange-50' : ''}
      />
      {hasWarning && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
          <p className="text-sm text-orange-600">
            ⚠️ 한도 초과로 {limit ? formatNumber(limit) : 0}{unit}로 자동 조정되었습니다.
          </p>
        </div>
      )}
      {dynamicMessage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <p className="text-sm text-blue-700">
            💡 {dynamicMessage}
          </p>
        </div>
      )}
      {helpMessage && !dynamicMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
          <p className="text-sm text-green-700">
            ℹ️ {helpMessage}
          </p>
        </div>
      )}
      {info && !dynamicMessage && !helpMessage && (
        <p className="text-sm text-gray-500">{info}</p>
      )}
    </div>
  );
};

export const InheritanceTaxCalculatorComponent: React.FC = () => {
  const [input, setInput] = useState<InheritanceTaxInput>({
    // 상속재산 관련
    totalInheritance: 1000000000,
    debtLiabilities: 0,
    funeralExpenses: 5000000,
    
    // 피상속인 정보
    deceasedAge: 70,
    deceasedSpouse: true,
    
    // 상속인 정보
    spouse: true,
    spouseAge: 65,
    children: 2,
    minorChildren: 0,
    disabledHeirs: 0,
    elderlyHeirs: 0,
    
    // 상속 형태
    inheritanceRatio: 0.5,
    jointInheritance: true,
    
    // 재산 분류
    realEstate: 800000000,
    deposit: 100000000,
    stock: 50000000,
    bond: 30000000,
    insurance: 20000000,
    pension: 0,
    other: 0,
    
    // 특수 상황
    giftWithin10Years: 0,
    premaritalGift: 0,
    businessInheritance: 0,
    nonResidentInheritance: 0,
    
    // 감면 관련
    familyBusinessDiscount: false,
    farmLandDiscount: false,
    culturalAssetDiscount: false,
    
    // 납세의무 관련
    taxDeferralRequest: false,
    installmentPayment: false,
    
    // 기타
    previousTaxPaid: 0,
    isNonResident: false,
  });

  const [result, setResult] = useState<InheritanceTaxResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = useCallback((field: keyof InheritanceTaxInput, value: any) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleCalculate = useCallback(async () => {
    setIsCalculating(true);
    setErrors({});

    try {
      // 입력값 검증
      const validationErrors = InheritanceTaxInputValidator.validate(input);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsCalculating(false);
        return;
      }

      // 한도 적용
      const validatedInput = InheritanceTaxInputValidator.validateAndApplyLimits(input);
      
      // 계산 실행
      const calculator = new InheritanceTaxCalculator(validatedInput);
      const calculationResult = calculator.calculate();
      
      setResult(calculationResult);
    } catch (error) {
      console.error('상속세 계산 오류:', error);
      setErrors({ general: '계산 중 오류가 발생했습니다.' });
    } finally {
      setIsCalculating(false);
    }
  }, [input]);

  const loadSampleData = useCallback(() => {
    setInput({
      // 상속재산 관련
      totalInheritance: 2000000000, // 20억원
      debtLiabilities: 100000000,   // 1억원 채무
      funeralExpenses: 5000000,     // 500만원
      
      // 피상속인 정보
      deceasedAge: 75,
      deceasedSpouse: true,
      
      // 상속인 정보
      spouse: true,
      spouseAge: 70,
      children: 2,
      minorChildren: 0,
      disabledHeirs: 0,
      elderlyHeirs: 1,
      
      // 상속 형태
      inheritanceRatio: 0.5,
      jointInheritance: true,
      
      // 재산 분류
      realEstate: 1500000000,
      deposit: 300000000,
      stock: 150000000,
      bond: 50000000,
      insurance: 0,
      pension: 0,
      other: 0,
      
      // 특수 상황
      giftWithin10Years: 100000000, // 10년 내 증여 1억원
      premaritalGift: 0,
      businessInheritance: 0,
      nonResidentInheritance: 0,
      
      // 감면 관련
      familyBusinessDiscount: false,
      farmLandDiscount: false,
      culturalAssetDiscount: false,
      
      // 납세의무 관련
      taxDeferralRequest: false,
      installmentPayment: true,
      
      // 기타
      previousTaxPaid: 0,
      isNonResident: false,
    });
  }, []);

  const resetForm = useCallback(() => {
    setInput({
      totalInheritance: 0,
      debtLiabilities: 0,
      funeralExpenses: 0,
      deceasedAge: 70,
      deceasedSpouse: false,
      spouse: false,
      spouseAge: 65,
      children: 0,
      minorChildren: 0,
      disabledHeirs: 0,
      elderlyHeirs: 0,
      inheritanceRatio: 0,
      jointInheritance: false,
      realEstate: 0,
      deposit: 0,
      stock: 0,
      bond: 0,
      insurance: 0,
      pension: 0,
      other: 0,
      giftWithin10Years: 0,
      premaritalGift: 0,
      businessInheritance: 0,
      nonResidentInheritance: 0,
      familyBusinessDiscount: false,
      farmLandDiscount: false,
      culturalAssetDiscount: false,
      taxDeferralRequest: false,
      installmentPayment: false,
      previousTaxPaid: 0,
      isNonResident: false,
    });
    setResult(null);
    setErrors({});
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 면책 조항 */}
      <TaxCalculatorDisclaimer variant="summary" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 폼 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏛️ 상속세 계산기
              </CardTitle>
              <CardDescription>
                2024년 세법 기준으로 상속세를 계산합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">기본정보</TabsTrigger>
                  <TabsTrigger value="heirs">상속인</TabsTrigger>
                  <TabsTrigger value="assets">재산분류</TabsTrigger>
                  <TabsTrigger value="special">특수사항</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <NumberInput
                      label="총 상속재산"
                      value={input.totalInheritance}
                      onChange={(value) => handleInputChange('totalInheritance', value)}
                      placeholder="상속받은 총 재산 입력"
                      limit={INHERITANCE_TAX_LIMITS_2024.maxInheritanceAmount}
                      helpMessage={INHERITANCE_TAX_LIMITS_2024.messages.basicDeduction}
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        if (value <= 200000000) return '기초공제 2억원이 적용되어 상속세가 발생하지 않을 수 있습니다.';
                        if (value <= 500000000) return '기초공제와 배우자공제 등을 고려하면 상속세 부담이 적을 수 있습니다.';
                        if (value <= 1000000000) return '10억원 이하로 상속세율 10~20%가 적용됩니다.';
                        if (value <= 3000000000) return '30억원 이하로 상속세율 20~40%가 적용됩니다.';
                        return '30억원 초과로 최대 50% 상속세율이 적용됩니다.';
                      }}
                    />
                    
                    <NumberInput
                      label="채무 및 공과금"
                      value={input.debtLiabilities}
                      onChange={(value) => handleInputChange('debtLiabilities', value)}
                      placeholder="채무, 세금 등"
                      limit={INHERITANCE_TAX_LIMITS_2024.maxDebtAmount}
                      helpMessage="상속받은 채무, 미납세금, 공과금 등은 상속재산에서 차감됩니다."
                      dynamicInfo={(value, totalInheritance) => {
                        if (value === 0) return '';
                        const ratio = (value / (totalInheritance || input.totalInheritance)) * 100;
                        if (ratio > 50) return '채무가 상속재산의 50%를 초과합니다. 상속재산이 부족할 수 있습니다.';
                        if (ratio > 30) return `채무가 상속재산의 ${ratio.toFixed(1)}%입니다. 상속세 부담이 크게 줄어듭니다.`;
                        return `채무가 상속재산의 ${ratio.toFixed(1)}%로 상속세 절약 효과가 있습니다.`;
                      }}
                      dependentValue={input.totalInheritance}
                    />
                    
                    <NumberInput
                      label="장례비용"
                      value={input.funeralExpenses}
                      onChange={(value) => handleInputChange('funeralExpenses', value)}
                      placeholder="장례식 관련 비용"
                      limit={INHERITANCE_TAX_LIMITS_2024.funeralExpenseLimit}
                      helpMessage={INHERITANCE_TAX_LIMITS_2024.messages.funeralExpense}
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        if (value >= 5000000) return '장례비용이 한도(5백만원)에 도달했습니다.';
                        return `장례비용 ${formatWon(5000000 - value)}을 추가로 공제받을 수 있습니다.`;
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="heirs" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Checkbox
                        id="spouse"
                        checked={input.spouse}
                        onCheckedChange={(checked) => handleInputChange('spouse', checked)}
                      />
                      <Label htmlFor="spouse" className="font-medium">배우자 존재</Label>
                      <Badge variant="outline" className="text-xs text-blue-700">
                        최소 5억원 공제
                      </Badge>
                    </div>

                    {input.spouse && (
                      <NumberInput
                        label="배우자 나이"
                        value={input.spouseAge}
                        onChange={(value) => handleInputChange('spouseAge', value)}
                        placeholder="배우자 만 나이"
                        unit="세"
                        limit={INHERITANCE_TAX_LIMITS_2024.maxAge}
                        helpMessage={INHERITANCE_TAX_LIMITS_2024.messages.spouseDeduction}
                      />
                    )}

                    <NumberInput
                      label="자녀 수"
                      value={input.children}
                      onChange={(value) => handleInputChange('children', value)}
                      placeholder="직계비속 수"
                      unit="명"
                      limit={INHERITANCE_TAX_LIMITS_2024.maxChildren}
                      helpMessage={INHERITANCE_TAX_LIMITS_2024.messages.childrenDeduction}
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        const deduction = value * 50000000;
                        return `자녀 ${value}명으로 총 ${formatWon(deduction)} 공제가 적용됩니다.`;
                      }}
                    />

                    <NumberInput
                      label="미성년자 자녀 수"
                      value={input.minorChildren}
                      onChange={(value) => {
                        const maxMinor = Math.min(value, input.children);
                        handleInputChange('minorChildren', maxMinor);
                      }}
                      placeholder="19세 미만 자녀"
                      unit="명"
                      limit={Math.min(INHERITANCE_TAX_LIMITS_2024.maxMinorChildren, input.children)}
                      helpMessage={INHERITANCE_TAX_LIMITS_2024.messages.minorDeduction}
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        if (value > input.children) return '미성년자 수는 전체 자녀 수를 초과할 수 없습니다.';
                        const avgYears = 10; // 평균 미성년 연수
                        const deduction = value * avgYears * 10000000;
                        return `미성년자 ${value}명으로 약 ${formatWon(deduction)} 공제 예상됩니다.`;
                      }}
                    />

                    <NumberInput
                      label="장애인 상속인 수"
                      value={input.disabledHeirs}
                      onChange={(value) => handleInputChange('disabledHeirs', value)}
                      placeholder="장애인 상속인"
                      unit="명"
                      limit={INHERITANCE_TAX_LIMITS_2024.maxDisabledHeirs}
                      helpMessage={INHERITANCE_TAX_LIMITS_2024.messages.disabledDeduction}
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        const avgLifeExpectancy = 35; // 평균 기대여명
                        const deduction = value * avgLifeExpectancy * 10000000;
                        return `장애인 ${value}명으로 약 ${formatWon(deduction)} 공제 예상됩니다.`;
                      }}
                    />

                    <NumberInput
                      label="65세 이상 상속인 수"
                      value={input.elderlyHeirs}
                      onChange={(value) => handleInputChange('elderlyHeirs', value)}
                      placeholder="65세 이상"
                      unit="명"
                      limit={INHERITANCE_TAX_LIMITS_2024.maxElderlyHeirs}
                      helpMessage={INHERITANCE_TAX_LIMITS_2024.messages.elderlyDeduction}
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        const deduction = value * 5000000;
                        return `65세 이상 ${value}명으로 총 ${formatWon(deduction)} 공제가 적용됩니다.`;
                      }}
                    />

                    <NumberInput
                      label="상속비율"
                      value={input.inheritanceRatio * 100}
                      onChange={(value) => {
                        const ratio = Math.max(0, Math.min(100, value)) / 100;
                        handleInputChange('inheritanceRatio', ratio);
                      }}
                      placeholder="상속비율 (%)"
                      unit="%"
                      limit={100}
                      helpMessage="본인이 상속받는 비율을 입력하세요 (0~100%)"
                      dynamicInfo={(value, totalInheritance) => {
                        if (value === 0) return '';
                        const ratio = value / 100;
                        const inheritedAmount = (totalInheritance || input.totalInheritance) * ratio;
                        return `상속비율 ${value}%로 약 ${formatWon(inheritedAmount)}을 상속받게 됩니다.`;
                      }}
                      dependentValue={input.totalInheritance}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="assets" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <NumberInput
                      label="부동산"
                      value={input.realEstate}
                      onChange={(value) => handleInputChange('realEstate', value)}
                      placeholder="토지, 건물 등"
                    />

                    <NumberInput
                      label="예금"
                      value={input.deposit}
                      onChange={(value) => handleInputChange('deposit', value)}
                      placeholder="은행예금, 적금 등"
                    />

                    <NumberInput
                      label="주식"
                      value={input.stock}
                      onChange={(value) => handleInputChange('stock', value)}
                      placeholder="상장주식, 비상장주식"
                    />

                    <NumberInput
                      label="채권"
                      value={input.bond}
                      onChange={(value) => handleInputChange('bond', value)}
                      placeholder="국채, 회사채 등"
                    />

                    <NumberInput
                      label="보험금"
                      value={input.insurance}
                      onChange={(value) => handleInputChange('insurance', value)}
                      placeholder="생명보험금 등"
                    />

                    <NumberInput
                      label="퇴직금·연금"
                      value={input.pension}
                      onChange={(value) => handleInputChange('pension', value)}
                      placeholder="퇴직금, 연금수급권"
                    />

                    <NumberInput
                      label="기타재산"
                      value={input.other}
                      onChange={(value) => handleInputChange('other', value)}
                      placeholder="골프회원권, 자동차 등"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="special" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <NumberInput
                      label="10년 내 증여재산"
                      value={input.giftWithin10Years}
                      onChange={(value) => handleInputChange('giftWithin10Years', value)}
                      placeholder="10년 내 증여받은 재산"
                      limit={INHERITANCE_TAX_LIMITS_2024.maxGiftAmount}
                      helpMessage={INHERITANCE_TAX_LIMITS_2024.messages.giftAddition}
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        if (value > 0) return '10년 내 증여재산은 상속재산에 합산되어 누진세율이 적용됩니다.';
                        return '';
                      }}
                    />

                    <NumberInput
                      label="혼인증여재산"
                      value={input.premaritalGift}
                      onChange={(value) => handleInputChange('premaritalGift', value)}
                      placeholder="혼인 시 증여받은 재산"
                      limit={INHERITANCE_TAX_LIMITS_2024.maxGiftAmount}
                      helpMessage="혼인 시 증여받은 재산은 별도 관리됩니다."
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        return '혼인증여재산은 일정 한도 내에서 공제 혜택을 받을 수 있습니다.';
                      }}
                    />

                    <NumberInput
                      label="사업승계재산"
                      value={input.businessInheritance}
                      onChange={(value) => handleInputChange('businessInheritance', value)}
                      placeholder="가업승계 대상 재산"
                      limit={INHERITANCE_TAX_LIMITS_2024.maxGiftAmount}
                      helpMessage="가업승계 요건을 만족하면 30% 공제 및 최대 20억원 한도 적용"
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        if (input.familyBusinessDiscount) {
                          const discount = Math.min(value * 0.30, 2000000000);
                          return `가업승계 공제로 약 ${formatWon(discount)} 세액 절약 가능합니다.`;
                        }
                        return '가업승계 할인을 체크하면 30% 공제 혜택을 받을 수 있습니다.';
                      }}
                    />

                    <NumberInput
                      label="국외재산"
                      value={input.nonResidentInheritance}
                      onChange={(value) => handleInputChange('nonResidentInheritance', value)}
                      placeholder="해외 소재 재산"
                      limit={INHERITANCE_TAX_LIMITS_2024.maxGiftAmount}
                      helpMessage="국외재산은 10억원 초과 시 별도 신고가 필요합니다."
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        if (value > 1000000000) return '10억원 초과로 국외재산 별도 신고가 필요합니다.';
                        return '국외재산은 국내세율이 적용되며 외국납부세액 공제를 받을 수 있습니다.';
                      }}
                    />
                    
                    <div className="space-y-3">
                      <Label>감면 및 할인</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="familyBusinessDiscount"
                            checked={input.familyBusinessDiscount}
                            onCheckedChange={(checked) => handleInputChange('familyBusinessDiscount', checked)}
                          />
                          <Label htmlFor="familyBusinessDiscount">가족기업 할인</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="farmLandDiscount"
                            checked={input.farmLandDiscount}
                            onCheckedChange={(checked) => handleInputChange('farmLandDiscount', checked)}
                          />
                          <Label htmlFor="farmLandDiscount">농지 감면</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="culturalAssetDiscount"
                            checked={input.culturalAssetDiscount}
                            onCheckedChange={(checked) => handleInputChange('culturalAssetDiscount', checked)}
                          />
                          <Label htmlFor="culturalAssetDiscount">문화재 감면</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>납세 옵션</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="installmentPayment"
                            checked={input.installmentPayment}
                            onCheckedChange={(checked) => handleInputChange('installmentPayment', checked)}
                          />
                          <Label htmlFor="installmentPayment">분할납부 신청</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="taxDeferralRequest"
                            checked={input.taxDeferralRequest}
                            onCheckedChange={(checked) => handleInputChange('taxDeferralRequest', checked)}
                          />
                          <Label htmlFor="taxDeferralRequest">납세유예 신청</Label>
                        </div>
                      </div>
                    </div>

                    <NumberInput
                      label="기납부세액"
                      value={input.previousTaxPaid}
                      onChange={(value) => handleInputChange('previousTaxPaid', value)}
                      placeholder="이미 납부한 세액"
                      info="중간예납세액 등"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              <div className="flex gap-3">
                <Button 
                  onClick={handleCalculate} 
                  disabled={isCalculating}
                  className="flex-1"
                >
                  {isCalculating ? '계산 중...' : '상속세 계산'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={loadSampleData}
                >
                  샘플 데이터
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  초기화
                </Button>
              </div>

              {Object.keys(errors).length > 0 && (
                <Alert className="mt-4">
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 계산 결과 */}
        <div className="space-y-6">
          {result && (
            <>
              {/* 세액 요약 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">💰 상속세 계산 결과</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">총 상속재산</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatWon(result.grossInheritance)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">과세표준</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatWon(result.taxableInheritance)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600">산출세액</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatWon(result.calculatedTax)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">납부세액</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatWon(result.determinedTax)}
                      </p>
                    </div>
                  </div>

                  {result.additionalPayment > 0 && (
                    <Alert>
                      <AlertDescription>
                        추가 납부세액: <strong>{formatWon(result.additionalPayment)}</strong>
                      </AlertDescription>
                    </Alert>
                  )}

                  {result.refundAmount > 0 && (
                    <Alert>
                      <AlertDescription>
                        환급세액: <strong>{formatWon(result.refundAmount)}</strong>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* 공제 내역 */}
              <Card>
                <CardHeader>
                  <CardTitle>📊 공제 내역</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.lumpSumDeduction > 0 ? (
                      <div className="flex justify-between">
                        <span>일괄공제</span>
                        <span className="font-medium">{formatWon(result.lumpSumDeduction)}</span>
                      </div>
                    ) : (
                      <>
                        {result.personalDeductions.basic > 0 && (
                          <div className="flex justify-between">
                            <span>기초공제</span>
                            <span className="font-medium">{formatWon(result.personalDeductions.basic)}</span>
                          </div>
                        )}
                        {result.personalDeductions.spouse > 0 && (
                          <div className="flex justify-between">
                            <span>배우자공제</span>
                            <span className="font-medium">{formatWon(result.personalDeductions.spouse)}</span>
                          </div>
                        )}
                        {result.personalDeductions.children > 0 && (
                          <div className="flex justify-between">
                            <span>자녀공제</span>
                            <span className="font-medium">{formatWon(result.personalDeductions.children)}</span>
                          </div>
                        )}
                        {result.personalDeductions.minorChildren > 0 && (
                          <div className="flex justify-between">
                            <span>미성년자공제</span>
                            <span className="font-medium">{formatWon(result.personalDeductions.minorChildren)}</span>
                          </div>
                        )}
                        {result.personalDeductions.disabled > 0 && (
                          <div className="flex justify-between">
                            <span>장애인공제</span>
                            <span className="font-medium">{formatWon(result.personalDeductions.disabled)}</span>
                          </div>
                        )}
                        {result.personalDeductions.elderly > 0 && (
                          <div className="flex justify-between">
                            <span>65세이상공제</span>
                            <span className="font-medium">{formatWon(result.personalDeductions.elderly)}</span>
                          </div>
                        )}
                        {result.propertyDeductions.funeralExpenses > 0 && (
                          <div className="flex justify-between">
                            <span>장례비공제</span>
                            <span className="font-medium">{formatWon(result.propertyDeductions.funeralExpenses)}</span>
                          </div>
                        )}
                        {result.propertyDeductions.debts > 0 && (
                          <div className="flex justify-between">
                            <span>채무공제</span>
                            <span className="font-medium">{formatWon(result.propertyDeductions.debts)}</span>
                          </div>
                        )}
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>총 공제액</span>
                      <span>{formatWon(result.inheritanceDeductions)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 세율 정보 */}
              {result.appliedRates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>📈 적용 세율</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.appliedRates.map((rate, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{rate.range}</span>
                          <span>{(rate.rate * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>실효세율</span>
                        <span>{(result.effectiveRate * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 상속인별 분할 */}
              {result.inheritanceDistribution.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>👨‍👩‍👧‍👦 상속인별 분할</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.inheritanceDistribution.map((heir, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{heir.heir}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({(heir.ratio * 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              상속: {formatWon(heir.inheritedAmount)}
                            </div>
                            <div className="text-sm text-red-600">
                              세액: {formatWon(heir.taxAmount)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 납부 일정 */}
              <Card>
                <CardHeader>
                  <CardTitle>📅 납부 일정</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>신고납부기한</span>
                      <span className="font-medium">
                        {result.paymentSchedule.dueDate.toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    
                    {result.paymentSchedule.installmentAvailable && (
                      <div className="flex justify-between">
                        <span>분할납부 가능</span>
                        <Badge variant="outline" className="bg-green-50">가능</Badge>
                      </div>
                    )}
                    
                    {result.paymentSchedule.deferralAvailable && (
                      <div className="flex justify-between">
                        <span>납세유예 가능</span>
                        <Badge variant="outline" className="bg-blue-50">가능</Badge>
                      </div>
                    )}

                    {result.paymentSchedule.installmentPlan && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">분할납부 계획</h4>
                        <div className="space-y-1 text-sm">
                          {result.paymentSchedule.installmentPlan.map((plan) => (
                            <div key={plan.installment} className="flex justify-between">
                              <span>{plan.installment}회차</span>
                              <span>
                                {plan.dueDate.toLocaleDateString('ko-KR')} - {formatWon(plan.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* 하단 면책 조항 */}
      <TaxCalculatorDisclaimer variant="full" />
    </div>
  );
}; 