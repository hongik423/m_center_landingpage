'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, PieChart, Users, Building, Shield, AlertTriangle, CheckCircle, RotateCcw, RefreshCw } from 'lucide-react';
import { InheritanceTaxCalculator, InheritanceTaxInputValidator } from '@/lib/utils/inheritance-tax-calculations';
import { InheritanceTaxInput, InheritanceTaxResult } from '@/types/tax-calculator.types';
import { INHERITANCE_TAX_LIMITS_2024 } from '@/constants/tax-rates-2024';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';
import { BetaFeedbackForm } from '@/components/ui/beta-feedback-form';
import { formatNumber, formatWon, formatNumberInput, parseFormattedNumber, handleNumberInputChange } from '@/lib/utils';
import { NumberInput } from '@/components/ui/number-input';

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

  // 🔥 고도화된 자동 연계 계산 로직
  
  // 1. 총 재산 자동 계산
  const totalAssets = useMemo(() => {
    return input.realEstate + input.deposit + input.stock + input.bond + 
           input.insurance + input.pension + input.other;
  }, [input.realEstate, input.deposit, input.stock, input.bond, 
      input.insurance, input.pension, input.other]);

  // 2. 순 상속재산 자동 계산
  const netInheritance = useMemo(() => {
    return Math.max(0, input.totalInheritance - input.debtLiabilities - input.funeralExpenses);
  }, [input.totalInheritance, input.debtLiabilities, input.funeralExpenses]);

  // 3. 자동 공제 계산
  const autoDeductions = useMemo(() => {
    const basicDeduction = 200000000; // 기초공제 2억원
    const spouseDeduction = input.spouse ? Math.max(500000000, netInheritance * 0.5) : 0; // 배우자공제
    const childrenDeduction = input.children * 50000000; // 자녀공제 5천만원/명
    const minorDeduction = input.minorChildren * 10 * 10000000; // 미성년자공제 (평균 10년)
    const disabledDeduction = input.disabledHeirs * 35 * 10000000; // 장애인공제 (평균 35년)
    const elderlyDeduction = input.elderlyHeirs * 5000000; // 65세 이상 공제

    return {
      basic: basicDeduction,
      spouse: spouseDeduction,
      children: childrenDeduction,
      minor: minorDeduction,
      disabled: disabledDeduction,
      elderly: elderlyDeduction,
      total: basicDeduction + spouseDeduction + childrenDeduction + minorDeduction + disabledDeduction + elderlyDeduction
    };
  }, [input.spouse, input.children, input.minorChildren, input.disabledHeirs, input.elderlyHeirs, netInheritance]);

  // 4. 예상 과세표준 계산
  const estimatedTaxableIncome = useMemo(() => {
    const addedInheritance = netInheritance + input.giftWithin10Years; // 10년 내 증여재산 합산
    return Math.max(0, addedInheritance - autoDeductions.total);
  }, [netInheritance, input.giftWithin10Years, autoDeductions.total]);

  // 5. 예상 세율 구간 계산
  const expectedTaxBracket = useMemo(() => {
    if (estimatedTaxableIncome <= 0) {
      return { rate: 0, description: '비과세 (공제액 내)' };
    } else if (estimatedTaxableIncome <= 100000000) {
      return { rate: 10, description: '10% 구간 (1억원 이하)' };
    } else if (estimatedTaxableIncome <= 500000000) {
      return { rate: 20, description: '20% 구간 (5억원 이하)' };
    } else if (estimatedTaxableIncome <= 1000000000) {
      return { rate: 30, description: '30% 구간 (10억원 이하)' };
    } else if (estimatedTaxableIncome <= 3000000000) {
      return { rate: 40, description: '40% 구간 (30억원 이하)' };
    } else {
      return { rate: 50, description: '50% 구간 (30억원 초과)' };
    }
  }, [estimatedTaxableIncome]);

  // 6. 논리적 오류 체크
  const logicalErrors = useMemo(() => {
    const errors: string[] = [];
    
    // 재산 구성 검증
    if (totalAssets > 0 && Math.abs(totalAssets - input.totalInheritance) > 1000000) {
      const diff = Math.abs(totalAssets - input.totalInheritance);
      if (diff / Math.max(totalAssets, input.totalInheritance) > 0.1) { // 10% 이상 차이
        errors.push(`재산별 합계(${formatWon(totalAssets)})와 총 상속재산(${formatWon(input.totalInheritance)})이 ${formatWon(diff)} 차이납니다.`);
      }
    }
    
    // 채무가 상속재산보다 큰 경우
    if (input.debtLiabilities > input.totalInheritance && input.totalInheritance > 0) {
      errors.push('채무가 상속재산보다 클 수 없습니다.');
    }
    
    // 미성년자 수가 전체 자녀보다 많은 경우
    if (input.minorChildren > input.children) {
      errors.push('미성년자 자녀수가 전체 자녀수보다 많을 수 없습니다.');
    }
    
    // 상속비율이 100% 초과
    if (input.inheritanceRatio > 1) {
      errors.push('상속비율이 100%를 초과할 수 없습니다.');
    }
    
    // 배우자가 체크되었는데 나이가 0인 경우
    if (input.spouse && input.spouseAge === 0) {
      errors.push('배우자가 존재한다면 나이를 입력해주세요.');
    }
    
    // 장례비용이 상속재산의 50% 초과
    if (input.funeralExpenses > input.totalInheritance * 0.5 && input.totalInheritance > 0) {
      errors.push('장례비용이 상속재산의 50%를 초과합니다.');
    }
    
    return errors;
  }, [input, totalAssets]);

  // 7. 절세 추천 로직
  const taxSavingRecommendations = useMemo(() => {
    const recommendations: string[] = [];
    
    // 배우자공제 활용 추천
    if (!input.spouse && estimatedTaxableIncome > 500000000) {
      recommendations.push('배우자가 있다면 최소 5억원 공제가 가능합니다.');
    }
    
    // 가업승계 할인 추천
    if (!input.familyBusinessDiscount && input.businessInheritance > 0) {
      const discount = Math.min(input.businessInheritance * 0.3, 2000000000);
      recommendations.push(`가업승계 할인 적용시 약 ${formatWon(discount)} 절세 효과`);
    }
    
    // 분할 상속 추천
    if (estimatedTaxableIncome > 1000000000 && input.children > 1) {
      recommendations.push('자녀들에게 분할 상속하면 누진세율 부담을 줄일 수 있습니다.');
    }
    
    // 증여 사전 증여 추천
    if (estimatedTaxableIncome > 3000000000 && input.children > 0) {
      recommendations.push('생전 증여를 통해 상속세 부담을 분산시킬 수 있습니다.');
    }
    
    // 납세유예 활용 추천
    if (!input.taxDeferralRequest && estimatedTaxableIncome > 500000000 && input.realEstate > input.totalInheritance * 0.7) {
      recommendations.push('부동산 비중이 높아 납세유예를 검토해보세요.');
    }
    
    return recommendations;
  }, [input, estimatedTaxableIncome]);

  // 8. 자동 재산 구성 동기화
  useEffect(() => {
    // 재산별 합계가 총 상속재산과 다르고, 재산별 입력이 있다면 총 상속재산을 업데이트
    if (totalAssets > 0 && input.totalInheritance === 0) {
      handleInputChange('totalInheritance', totalAssets);
    }
  }, [totalAssets, input.totalInheritance]);

  // 9. 디바운스된 자동 계산
  useEffect(() => {
    if (netInheritance > 0) {
      const timer = setTimeout(() => {
        handleCalculate();
      }, 500); // 500ms 디바운스
      
      return () => clearTimeout(timer);
    } else {
      setResult(null);
    }
  }, [input, netInheritance]);

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
                        {/* 순 상속재산 */}
                        <div className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">순 상속재산</span>
                            <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                          </div>
                          <div className="text-lg font-bold text-purple-700">
                            {formatWon(netInheritance)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            총재산 - 채무 - 장례비용
                          </div>
                        </div>

                        {/* 예상 세율 구간 */}
                        <div className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">예상 세율</span>
                            <Badge className={`text-xs ${expectedTaxBracket.rate === 0 ? 'bg-green-100 text-green-700' : 
                              expectedTaxBracket.rate <= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                              {expectedTaxBracket.rate}%
                            </Badge>
                          </div>
                          <div className={`text-lg font-bold ${expectedTaxBracket.rate === 0 ? 'text-green-700' : 
                            expectedTaxBracket.rate <= 20 ? 'text-yellow-700' : 'text-red-700'}`}>
                            {expectedTaxBracket.rate}% 구간
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {expectedTaxBracket.description}
                          </div>
                        </div>

                        {/* 자동 공제 합계 */}
                        <div className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">총 공제액</span>
                            <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                          </div>
                          <div className="text-lg font-bold text-purple-700">
                            {formatWon(autoDeductions.total)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            기초+배우자+자녀 등 공제
                          </div>
                        </div>

                        {/* 예상 과세표준 */}
                        <div className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">과세표준</span>
                            <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
                          </div>
                          <div className="text-lg font-bold text-purple-700">
                            {formatWon(estimatedTaxableIncome)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            (순재산+10년내증여) - 공제
                          </div>
                        </div>
                      </div>

                      {/* 재산 구성 분석 */}
                      {totalAssets > 0 && (
                        <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                          <div className="text-sm font-medium text-gray-700 mb-3">📊 재산 구성 분석</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            {[
                              { label: '부동산', value: input.realEstate, color: 'bg-orange-100 text-orange-700' },
                              { label: '예금', value: input.deposit, color: 'bg-blue-100 text-blue-700' },
                              { label: '주식', value: input.stock, color: 'bg-green-100 text-green-700' },
                              { label: '채권', value: input.bond, color: 'bg-purple-100 text-purple-700' },
                              { label: '보험', value: input.insurance, color: 'bg-indigo-100 text-indigo-700' },
                              { label: '연금', value: input.pension, color: 'bg-gray-100 text-gray-700' },
                              { label: '기타', value: input.other, color: 'bg-pink-100 text-pink-700' }
                            ].filter(item => item.value > 0).map((item, index) => (
                              <div key={index} className={`p-2 rounded ${item.color}`}>
                                <div className="font-medium">{item.label}</div>
                                <div className="font-mono text-right">
                                  {formatWon(item.value)}
                                </div>
                                <div className="text-right text-xs opacity-75">
                                  {((item.value / totalAssets) * 100).toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* 총합 검증 */}
                          {Math.abs(totalAssets - input.totalInheritance) > 1000000 && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                              ⚠️ 재산별 합계({formatWon(totalAssets)})와 총 상속재산({formatWon(input.totalInheritance)})이 다릅니다.
                            </div>
                          )}
                        </div>
                      )}

                      {/* 공제 세부 내역 */}
                      {autoDeductions.total > 0 && (
                        <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                          <div className="text-sm font-medium text-gray-700 mb-3">🎁 공제 세부 내역</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                            {[
                              { label: '기초공제', value: autoDeductions.basic, desc: '일반' },
                              { label: '배우자공제', value: autoDeductions.spouse, desc: input.spouse ? '적용' : '미적용' },
                              { label: '자녀공제', value: autoDeductions.children, desc: `${input.children}명` },
                              { label: '미성년자공제', value: autoDeductions.minor, desc: `${input.minorChildren}명` },
                              { label: '장애인공제', value: autoDeductions.disabled, desc: `${input.disabledHeirs}명` },
                              { label: '65세이상공제', value: autoDeductions.elderly, desc: `${input.elderlyHeirs}명` }
                            ].filter(item => item.value > 0).map((item, index) => (
                              <div key={index} className="p-2 rounded bg-green-50 border border-green-200">
                                <div className="font-medium text-green-800">{item.label}</div>
                                <div className="font-mono text-right text-green-700">
                                  {formatWon(item.value)}
                                </div>
                                <div className="text-right text-xs text-green-600">
                                  {item.desc}
                                </div>
                              </div>
                            ))}
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
                          <div className="text-sm font-medium text-green-700 mb-2">💡 절세 추천</div>
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
                      {logicalErrors.length === 0 && netInheritance > 0 && (
                        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                          <div className="text-sm font-medium text-green-700 mb-2">✅ 계산 준비 완료</div>
                          <div className="text-xs text-green-600">
                            모든 필수 정보가 올바르게 입력되었습니다. 실시간으로 상속세가 계산되고 있습니다.
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 gap-4">
                    <NumberInput
                      label="총 상속재산"
                      value={input.totalInheritance}
                      onChange={(value) => handleInputChange('totalInheritance', value)}
                      placeholder="상속받은 총 재산 입력"
                      limit={INHERITANCE_TAX_LIMITS_2024.maxInheritanceAmount}
                      helpMessage={INHERITANCE_TAX_LIMITS_2024.messages.basicDeduction}
                      required={true}
                      requiredMessage="상속세 계산을 위해 총 상속재산 입력이 필수입니다"
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
                      required={true}
                      requiredMessage="공제 계산을 위해 자녀 수 입력이 필요합니다 (없으면 0 입력)"
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
                      required={true}
                      requiredMessage="개인별 상속세 계산을 위해 상속비율 입력이 필수입니다"
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
                  disabled={isCalculating || !input.totalInheritance}
                  className={`flex-1 transition-all duration-200 transform
                    ${!input.totalInheritance ? 
                      'bg-gray-400 cursor-not-allowed' :
                      isCalculating ? 'animate-pulse' :
                      'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    }
                  `}
                >
                  {isCalculating ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      계산 중...
                    </>
                  ) : !input.totalInheritance ? (
                    <>
                      <Calculator className="w-4 h-4 mr-2 opacity-50" />
                      상속재산 입력 필요
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      {result ? '재계산하기' : '상속세 계산'}
                    </>
                  )}
                </Button>
                
                {/* 🔥 개선된 샘플 데이터 버튼 */}
                <Button 
                  variant="outline" 
                  onClick={loadSampleData}
                  className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                    bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100
                    border-orange-200 text-orange-700 hover:border-orange-300 hover:shadow-md
                    relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-100 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <span className="mr-1 text-lg">📋</span>
                    샘플 데이터
                  </span>
                </Button>
                
                {/* 🔥 개선된 초기화 버튼 */}
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                    hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-md
                    relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <RefreshCw className="w-4 h-4 mr-1 group-hover:rotate-180 transition-transform duration-300" />
                    초기화
                  </span>
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

      {/* 🧪 베타테스트 피드백 시스템 (면책조항 상단) */}
      <BetaFeedbackForm 
        calculatorName="상속세 계산기"
        calculatorType="inheritance-tax"
        className="mb-6"
      />

      {/* 하단 면책 조항 */}
      <TaxCalculatorDisclaimer variant="full" />
    </div>
  );
}; 