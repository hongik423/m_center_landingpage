'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Calculator, TrendingUp, Users, DollarSign, Info, CheckCircle, Clock, PieChart, BarChart3, Target, Lightbulb, Gift, Heart, GraduationCap, Calendar, FileText, PiggyBank, TrendingDown, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GiftTaxCalculator, 
  GiftTaxInputValidator
} from '@/lib/utils/gift-tax-calculations';
import { GiftTaxInput, GiftTaxResult } from '@/types/tax-calculator.types';
import { GIFT_TAX_LIMITS_2024 } from '@/constants/tax-rates-2024';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';
import { BetaFeedbackForm } from '@/components/ui/beta-feedback-form';
import { formatNumber, formatWon } from '@/lib/utils';
import { NumberInput } from '@/components/ui/number-input';

export default function GiftTaxCalculatorComponent() {
  const [input, setInput] = useState<GiftTaxInput>({
    // 기본 증여 정보
    giftAmount: 0,
    giftDate: new Date().toISOString().split('T')[0],
    
    // 증여자 정보
    donorAge: 50,
    donorRelation: 'parent',
    
    // 수증자 정보
    recipientAge: 25,
    isRecipientMinor: false,
    isRecipientDisabled: false,
    
    // 증여 형태
    giftType: 'money',
    isConditionalGift: false,
    giftConditionValue: 0,
    
    // 재산 분류
    cash: 0,
    realEstate: 0,
    stock: 0,
    bond: 0,
    businessAsset: 0,
    other: 0,
    
    // 특수 증여
    marriageGift: false,
    marriageGiftAmount: 0,
    educationGift: false,
    educationGiftAmount: 0,
    
    // 10년 내 기존 증여
    previousGifts: [],
    
    // 공제 및 감면
    familyBusinessDiscount: false,
    farmLandDiscount: false,
    culturalAssetDiscount: false,
    startupDiscount: false,
    
    // 기타
    previousTaxPaid: 0,
    isNonResident: false,
    hasSpecialRelationship: false
  });

  const [result, setResult] = useState<GiftTaxResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCalculating, setIsCalculating] = useState(false);

  // 🔥 고도화된 자동 연계 계산 로직
  
  // 1. 총 증여액 자동 계산
  const totalGiftAmount = useMemo(() => {
    return input.cash + input.realEstate + input.stock + input.bond + 
           input.businessAsset + input.other;
  }, [input.cash, input.realEstate, input.stock, input.bond, 
      input.businessAsset, input.other]);

  // 2. 특수 증여 총액 계산
  const specialGiftTotal = useMemo(() => {
    let total = 0;
    if (input.marriageGift) total += input.marriageGiftAmount;
    if (input.educationGift) total += input.educationGiftAmount;
    return total;
  }, [input.marriageGift, input.marriageGiftAmount, input.educationGift, input.educationGiftAmount]);

  // 3. 관계별 공제한도 자동 계산
  const deductionLimits = useMemo(() => {
    const relationship = input.donorRelation;
    const limits = GIFT_TAX_LIMITS_2024.relationshipLimits;
    
    let basicDeduction = 0;
    let specialDeduction = 0;
    
    switch (relationship) {
      case 'spouse':
        basicDeduction = limits.spouse.annual;
        break;
      case 'parent':
      case 'grandparent':
        basicDeduction = limits.linealAscendant.annual;
        if (input.recipientAge >= 19) {
          basicDeduction = limits.linealAscendant.annual; // 5천만원
        }
        break;
      case 'child':
      case 'grandchild':
        basicDeduction = limits.linealDescendant.annual;
        if (input.isRecipientMinor) {
          basicDeduction = limits.linealDescendant.annual; // 2천만원
        }
        break;
      default:
        basicDeduction = limits.other.annual;
    }
    
    // 특수 공제 (혼인, 교육 등)
    if (input.marriageGift) {
      specialDeduction += 100000000; // 혼인증여 1억원 추가
    }
    if (input.educationGift) {
      specialDeduction += 30000000; // 교육비 증여 3천만원 추가
    }
    
    return {
      basic: basicDeduction,
      special: specialDeduction,
      total: basicDeduction + specialDeduction
    };
  }, [input.donorRelation, input.recipientAge, input.isRecipientMinor, 
      input.marriageGift, input.educationGift]);

  // 4. 10년 내 기존 증여 합산
  const previousGiftTotal = useMemo(() => {
    return input.previousGifts.reduce((sum, gift) => sum + gift.amount, 0);
  }, [input.previousGifts]);

  // 5. 과세표준 자동 계산
  const estimatedTaxableIncome = useMemo(() => {
    const currentGift = Math.max(input.giftAmount, totalGiftAmount);
    const totalGiftWithPrevious = currentGift + previousGiftTotal;
    return Math.max(0, totalGiftWithPrevious - deductionLimits.total);
  }, [input.giftAmount, totalGiftAmount, previousGiftTotal, deductionLimits.total]);

  // 6. 예상 세율 구간 계산
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

  // 7. 논리적 오류 체크
  const logicalErrors = useMemo(() => {
    const errors: string[] = [];
    
    // 증여액 불일치 체크
    if (totalGiftAmount > 0 && Math.abs(totalGiftAmount - input.giftAmount) > 100000) {
      errors.push(`재산별 합계(${formatWon(totalGiftAmount)})와 총 증여액(${formatWon(input.giftAmount)})이 다릅니다.`);
    }
    
    // 미성년자 나이 체크
    if (input.isRecipientMinor && input.recipientAge >= 19) {
      errors.push('19세 이상은 미성년자가 아닙니다.');
    }
    
    // 미래 날짜 체크
    const today = new Date();
    const giftDate = new Date(input.giftDate);
    if (giftDate > today) {
      errors.push('증여일이 미래 날짜로 설정되어 있습니다.');
    }
    
    // 혼인 증여 조건 체크
    if (input.marriageGift && input.marriageGiftAmount === 0) {
      errors.push('혼인 증여를 체크했지만 금액이 입력되지 않았습니다.');
    }
    
    // 교육비 증여 조건 체크
    if (input.educationGift && input.educationGiftAmount === 0) {
      errors.push('교육비 증여를 체크했지만 금액이 입력되지 않았습니다.');
    }
    
    // 특수 관계 체크
    if (input.hasSpecialRelationship && input.donorRelation === 'spouse') {
      errors.push('배우자 관계와 특수관계를 동시에 적용할 수 없습니다.');
    }
    
    return errors;
  }, [input, totalGiftAmount]);

  // 8. 절세 추천 로직
  const taxSavingRecommendations = useMemo(() => {
    const recommendations: string[] = [];
    
    // 공제 한도 활용 추천
    const remainingDeduction = deductionLimits.total - input.giftAmount;
    if (remainingDeduction > 10000000 && input.giftAmount > 0) {
      recommendations.push(`관계별 공제한도 ${formatWon(remainingDeduction)} 추가 활용 가능`);
    }
    
    // 혼인 증여 추천
    if (!input.marriageGift && input.recipientAge >= 18 && input.recipientAge <= 50 && 
        input.donorRelation === 'parent') {
      recommendations.push('혼인 시 1억원 추가 공제 혜택 활용 검토');
    }
    
    // 교육비 증여 추천
    if (!input.educationGift && input.recipientAge <= 30 && 
        (input.donorRelation === 'parent' || input.donorRelation === 'grandparent')) {
      recommendations.push('교육비 명목 3천만원 추가 공제 검토');
    }
    
    // 분할 증여 추천
    if (estimatedTaxableIncome > 500000000) {
      recommendations.push('여러 해에 걸친 분할 증여로 누진세율 부담 완화');
    }
    
    // 가업승계 할인 추천
    if (!input.familyBusinessDiscount && input.businessAsset > 100000000) {
      recommendations.push('가업승계 요건 충족 시 30% 할인 혜택');
    }
    
    // 농지 감면 추천
    if (!input.farmLandDiscount && input.realEstate > 50000000) {
      recommendations.push('농지 증여 시 감면 혜택 검토');
    }
    
    return recommendations;
  }, [input, estimatedTaxableIncome, deductionLimits]);

  // 9. 자동 값 동기화
  useEffect(() => {
    // 재산별 합계가 총 증여액과 다르고, 재산별 입력이 있다면 총 증여액 업데이트
    if (totalGiftAmount > 0 && input.giftAmount === 0) {
      handleInputChange('giftAmount', totalGiftAmount);
    }
  }, [totalGiftAmount, input.giftAmount]);

  const handleInputChange = useCallback((field: keyof GiftTaxInput, value: any) => {
    setInput(prev => {
      const updated = { ...prev, [field]: value };
      
      // 자동 계산되는 값들
      if (field === 'recipientAge') {
        updated.isRecipientMinor = value < 19;
      }
      
      if (field === 'giftAmount' || field === 'marriageGiftAmount' || field === 'educationGiftAmount') {
        // 총 증여액 업데이트는 컴포넌트에서 자동으로 처리됨
      }
      
      return updated;
    });
  }, []);

  const handleCalculate = () => {
    setIsCalculating(true);
    setErrors({});
    
    try {
      // 입력값 검증
      const validationErrors = GiftTaxInputValidator.validate(input);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsCalculating(false);
        return;
      }

      // 입력값 정규화
      const validatedInput = GiftTaxInputValidator.validateAndApplyLimits(input);
      
      // 계산 실행
      const calculator = new GiftTaxCalculator(validatedInput);
      const calculationResult = calculator.calculate();
      
      setResult(calculationResult);
    } catch (error) {
      console.error('증여세 계산 오류:', error);
      setErrors({ general: '계산 중 오류가 발생했습니다.' });
    } finally {
      setIsCalculating(false);
    }
  };

  const loadSampleData = () => {
    setInput({
      // 기본 증여 정보
      giftAmount: 80000000, // 8천만원
      giftDate: '2024-01-15',
      
      // 증여자 정보
      donorAge: 60,
      donorRelation: 'parent',
      
      // 수증자 정보
      recipientAge: 30,
      isRecipientMinor: false,
      isRecipientDisabled: false,
      
      // 증여 형태
      giftType: 'money',
      isConditionalGift: false,
      giftConditionValue: 0,
      
      // 재산 분류
      cash: 80000000,
      realEstate: 0,
      stock: 0,
      bond: 0,
      businessAsset: 0,
      other: 0,
      
      // 특수 증여
      marriageGift: false,
      marriageGiftAmount: 0,
      educationGift: false,
      educationGiftAmount: 0,
      
      // 10년 내 기존 증여
      previousGifts: [
        {
          date: '2022-03-10',
          amount: 30000000,
          taxPaid: 0
        }
      ],
      
      // 공제 및 감면
      familyBusinessDiscount: false,
      farmLandDiscount: false,
      culturalAssetDiscount: false,
      startupDiscount: false,
      
      // 기타
      previousTaxPaid: 0,
      isNonResident: false,
      hasSpecialRelationship: false
    });
  };

  const resetInputs = () => {
    setInput({
      giftAmount: 0,
      giftDate: new Date().toISOString().split('T')[0],
      donorAge: 50,
      donorRelation: 'parent',
      recipientAge: 25,
      isRecipientMinor: false,
      isRecipientDisabled: false,
      giftType: 'money',
      isConditionalGift: false,
      giftConditionValue: 0,
      cash: 0,
      realEstate: 0,
      stock: 0,
      bond: 0,
      businessAsset: 0,
      other: 0,
      marriageGift: false,
      marriageGiftAmount: 0,
      educationGift: false,
      educationGiftAmount: 0,
      previousGifts: [],
      familyBusinessDiscount: false,
      farmLandDiscount: false,
      culturalAssetDiscount: false,
      startupDiscount: false,
      previousTaxPaid: 0,
      isNonResident: false,
      hasSpecialRelationship: false
    });
    setResult(null);
    setErrors({});
  };

  // 자동 계산 (입력값 변경 시)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.giftAmount > 0) {
        handleCalculate();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Gift className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">증여세 계산기</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          증여재산의 종류와 관계에 따른 정확한 증여세를 계산해보세요. 
          10년 합산과세와 각종 공제를 반영하여 정밀하게 계산됩니다.
        </p>
      </div>

      {/* 면책 조항 */}
      <TaxCalculatorDisclaimer variant="summary" />

      {/* 🔥 스마트 자동 계산 대시보드 */}
      <Card className="border-pink-200 bg-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-700 text-lg">
            <Gift className="w-5 h-5" />
            ⚡ 스마트 증여세 자동 계산 대시보드
          </CardTitle>
          <CardDescription className="text-pink-600">
            입력하는 즉시 관련 값들이 자동으로 연계 계산되고 절세 방안이 제시됩니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 총 증여액 */}
            <div className="bg-white p-3 rounded border border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">총 증여액</span>
                <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
              </div>
              <div className="text-lg font-bold text-pink-700">
                {formatWon(Math.max(input.giftAmount, totalGiftAmount))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                재산별 합계 또는 직접 입력
              </div>
            </div>

            {/* 적용 공제액 */}
            <div className="bg-white p-3 rounded border border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">적용 공제액</span>
                <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
              </div>
              <div className="text-lg font-bold text-pink-700">
                {formatWon(deductionLimits.total)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                관계별 + 특수공제
              </div>
            </div>

            {/* 예상 세율 구간 */}
            <div className="bg-white p-3 rounded border border-pink-200">
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

            {/* 과세표준 */}
            <div className="bg-white p-3 rounded border border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">과세표준</span>
                <Badge className="text-xs bg-green-100 text-green-700 border-green-300">자동</Badge>
              </div>
              <div className="text-lg font-bold text-pink-700">
                {formatWon(estimatedTaxableIncome)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                (증여액+10년내기존) - 공제
              </div>
            </div>
          </div>

          {/* 공제 세부 내역 */}
          {deductionLimits.total > 0 && (
            <div className="mt-4 p-3 bg-white rounded border border-pink-200">
              <div className="text-sm font-medium text-gray-700 mb-3">🎁 공제 세부 내역</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-green-50 border border-green-200">
                  <div className="font-medium text-green-800">기본공제</div>
                  <div className="font-mono text-right text-green-700">
                    {formatWon(deductionLimits.basic)}
                  </div>
                  <div className="text-right text-xs text-green-600">
                    {input.donorRelation === 'spouse' ? '배우자' :
                     input.donorRelation === 'parent' ? '부모' :
                     input.donorRelation === 'child' ? '자녀' : '기타'} 관계
                  </div>
                </div>
                
                {deductionLimits.special > 0 && (
                  <>
                    {input.marriageGift && input.marriageGiftAmount > 0 && (
                      <div className="p-2 rounded bg-pink-50 border border-pink-200">
                        <div className="font-medium text-pink-800 flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          혼인공제
                        </div>
                        <div className="font-mono text-right text-pink-700">
                          {formatWon(Math.min(input.marriageGiftAmount, 100000000))}
                        </div>
                        <div className="text-right text-xs text-pink-600">
                          평생 1회
                        </div>
                      </div>
                    )}
                    
                    {input.educationGift && input.educationGiftAmount > 0 && (
                      <div className="p-2 rounded bg-blue-50 border border-blue-200">
                        <div className="font-medium text-blue-800 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          교육비공제
                        </div>
                        <div className="font-mono text-right text-blue-700">
                          {formatWon(Math.min(input.educationGiftAmount, 50000000))}
                        </div>
                        <div className="text-right text-xs text-blue-600">
                          연간한도
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* 재산 구성 분석 */}
          {totalGiftAmount > 0 && (
            <div className="mt-4 p-3 bg-white rounded border border-pink-200">
              <div className="text-sm font-medium text-gray-700 mb-3">📊 증여재산 구성</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {[
                  { label: '현금', value: input.cash, color: 'bg-green-100 text-green-700', icon: '💰' },
                  { label: '부동산', value: input.realEstate, color: 'bg-orange-100 text-orange-700', icon: '🏠' },
                  { label: '주식', value: input.stock, color: 'bg-blue-100 text-blue-700', icon: '📈' },
                  { label: '채권', value: input.bond, color: 'bg-purple-100 text-purple-700', icon: '📋' },
                  { label: '사업자산', value: input.businessAsset, color: 'bg-gray-100 text-gray-700', icon: '🏢' },
                  { label: '기타', value: input.other, color: 'bg-yellow-100 text-yellow-700', icon: '🎯' }
                ].filter(item => item.value > 0).map((item, index) => (
                  <div key={index} className={`p-2 rounded ${item.color}`}>
                    <div className="font-medium flex items-center gap-1">
                      <span>{item.icon}</span>
                      {item.label}
                    </div>
                    <div className="font-mono text-right">
                      {formatWon(item.value)}
                    </div>
                    <div className="text-right text-xs opacity-75">
                      {((item.value / totalGiftAmount) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 증여액 검증 */}
              {Math.abs(totalGiftAmount - input.giftAmount) > 100000 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                  ⚠️ 재산별 합계({formatWon(totalGiftAmount)})와 총 증여액({formatWon(input.giftAmount)})이 다릅니다.
                </div>
              )}
            </div>
          )}

          {/* 10년 내 기존 증여 내역 */}
          {previousGiftTotal > 0 && (
            <div className="mt-4 p-3 bg-white rounded border border-pink-200">
              <div className="text-sm font-medium text-gray-700 mb-3">📅 10년 내 기존 증여</div>
              <div className="space-y-2">
                {input.previousGifts.map((gift, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{gift.date}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{formatWon(gift.amount)}</div>
                      <div className="text-gray-500">세액: {formatWon(gift.taxPaid)}</div>
                    </div>
                  </div>
                ))}
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-sm font-medium text-blue-700">
                    10년 합산액: {formatWon(previousGiftTotal + Math.max(input.giftAmount, totalGiftAmount))}
                  </div>
                  <div className="text-xs text-blue-600">
                    누진세율이 적용되어 세부담이 증가할 수 있습니다.
                  </div>
                </div>
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
          {logicalErrors.length === 0 && (input.giftAmount > 0 || totalGiftAmount > 0) && (
            <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
              <div className="text-sm font-medium text-green-700 mb-2">✅ 계산 준비 완료</div>
              <div className="text-xs text-green-600">
                모든 필수 정보가 올바르게 입력되었습니다. 실시간으로 증여세가 계산되고 있습니다.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <div className="space-y-6">
          {/* 컨트롤 버튼 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                계산 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {/* 🔥 개선된 샘플 데이터 버튼 */}
                <Button 
                  onClick={loadSampleData}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                    bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100
                    border-orange-200 text-orange-700 hover:border-orange-300 hover:shadow-md
                    relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-100 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center gap-2">
                    <FileText className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    샘플 데이터
                  </span>
                </Button>
                
                {/* 🔥 개선된 초기화 버튼 */}
                <Button 
                  onClick={resetInputs}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                    hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-md
                    relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                    초기화
                  </span>
                </Button>
                
                {/* 🔥 개선된 계산하기 버튼 */}
                <Button 
                  onClick={handleCalculate}
                  size="sm"
                  disabled={isCalculating || !input.giftAmount}
                  className={`flex items-center gap-2 transition-all duration-200 transform
                    ${!input.giftAmount ? 
                      'bg-gray-400 cursor-not-allowed' :
                      isCalculating ? 'animate-pulse' :
                      'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    }
                  `}
                >
                  {isCalculating ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : !input.giftAmount ? (
                    <Calculator className="w-4 h-4 opacity-50" />
                  ) : (
                    <Calculator className="w-4 h-4" />
                  )}
                  {isCalculating ? '계산 중...' :
                   !input.giftAmount ? '증여금액 입력 필요' :
                   (result ? '재계산하기' : '계산하기')
                  }
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 입력 탭 */}
          <Card>
            <CardHeader>
              <CardTitle>증여 정보 입력</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">기본정보</TabsTrigger>
                  <TabsTrigger value="parties">당사자</TabsTrigger>
                  <TabsTrigger value="assets">재산분류</TabsTrigger>
                  <TabsTrigger value="special">특수사항</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <NumberInput
                      label="총 증여재산"
                      value={input.giftAmount}
                      onChange={(value) => handleInputChange('giftAmount', value)}
                      placeholder="증여하는 총 재산가액"
                      limit={GIFT_TAX_LIMITS_2024.maxGiftAmount}
                      // 기존 계산기 호환성 유지

                      helpMessage={GIFT_TAX_LIMITS_2024.messages.relationshipDeduction}
                      required={true}
                      requiredMessage="증여세 계산을 위해 총 증여재산 입력이 필수입니다"
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        
                        // 관계별 공제 한도 확인
                        const relationshipLimit = GIFT_TAX_LIMITS_2024.relationshipLimits;
                        let applicableLimit = 0;
                        let relationshipName = '';
                        
                        switch (input.donorRelation) {
                          case 'spouse':
                            applicableLimit = relationshipLimit.spouse.annual;
                            relationshipName = '배우자';
                            break;
                          case 'parent':
                          case 'grandparent':
                            applicableLimit = relationshipLimit.linealAscendant.annual;
                            if (input.isRecipientMinor) {
                              applicableLimit += relationshipLimit.linealDescendant.minorBonus;
                            }
                            relationshipName = '직계존속';
                            break;
                          case 'child':
                          case 'grandchild':
                            applicableLimit = relationshipLimit.linealDescendant.annual;
                            relationshipName = '직계비속';
                            break;
                          default:
                            applicableLimit = relationshipLimit.other.annual;
                            relationshipName = '기타';
                        }
                        
                        if (value <= applicableLimit) {
                          return `${relationshipName} 관계로 ${applicableLimit.toLocaleString()}원까지 공제 가능합니다.`;
                        } else if (value <= 100000000) {
                          return `공제 한도 초과로 증여세 10%가 적용됩니다.`;
                        } else if (value <= 500000000) {
                          return `증여세 20%가 적용됩니다. 분할증여를 고려해보세요.`;
                        } else if (value <= 1000000000) {
                          return `증여세 30%가 적용됩니다. 전문가 상담을 권장합니다.`;
                        } else {
                          return `⚠️ 고액 증여로 최대 50% 세율 적용 가능. 반드시 전문가 상담 필요!`;
                        }
                      }}
                    />
                    
                    <div className="space-y-2">
                      <Label htmlFor="giftDate">증여일</Label>
                      <Input
                        id="giftDate"
                        type="date"
                        value={input.giftDate}
                        onChange={(e) => handleInputChange('giftDate', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      <p className="text-sm text-gray-500">
                        ℹ️ {GIFT_TAX_LIMITS_2024.messages.filingDeadline}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="giftType">증여재산 유형</Label>
                      <Select 
                        value={input.giftType} 
                        onValueChange={(value: any) => handleInputChange('giftType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="증여재산 유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="money">현금·예금</SelectItem>
                          <SelectItem value="realEstate">부동산</SelectItem>
                          <SelectItem value="stock">주식·증권</SelectItem>
                          <SelectItem value="business">사업용자산</SelectItem>
                          <SelectItem value="other">기타재산</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Checkbox
                        id="isConditionalGift"
                        checked={input.isConditionalGift}
                        onCheckedChange={(checked) => handleInputChange('isConditionalGift', checked)}
                      />
                      <Label htmlFor="isConditionalGift" className="font-medium">부담부증여</Label>
                      <Badge variant="outline" className="text-xs text-yellow-700">
                        채무승계 등
                      </Badge>
                    </div>

                    {input.isConditionalGift && (
                      <NumberInput
                        label="부담액"
                        value={input.giftConditionValue}
                        onChange={(value) => handleInputChange('giftConditionValue', value)}
                        placeholder="수증자가 부담하는 채무 등"
                        limit={input.giftAmount * 2}

                        helpMessage={GIFT_TAX_LIMITS_2024.conditionalGiftLimits.description}
                        dynamicInfo={(value) => {
                          if (value === 0) return '';
                          
                          const giftAmount = input.giftAmount;
                          const burdenRatio = value / giftAmount;
                          const netGift = giftAmount - value;
                          const minNetGift = giftAmount * GIFT_TAX_LIMITS_2024.conditionalGiftLimits.minGiftRatio;
                          
                          if (value >= giftAmount) {
                            return '🚨 부담액이 증여액과 같거나 초과하면 증여로 인정받지 못합니다.';
                          } else if (burdenRatio >= 0.8) {
                            return `⚠️ 부담비율 ${(burdenRatio * 100).toFixed(1)}%로 증여 인정에 문제가 있을 수 있습니다.`;
                          } else if (netGift < minNetGift) {
                            return `⚠️ 순증여액이 20% 미만입니다. 최소 ${minNetGift.toLocaleString()}원은 순증여되어야 합니다.`;
                          } else {
                            return `✅ 실질 증여액: ${netGift.toLocaleString()}원 (부담비율: ${(burdenRatio * 100).toFixed(1)}%)`;
                          }
                        }}
                      />
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="parties" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <NumberInput
                        label="증여자 나이"
                        value={input.donorAge}
                        onChange={(value) => handleInputChange('donorAge', value)}
                        placeholder="증여자 만 나이"
                        unit="세"
                        limit={GIFT_TAX_LIMITS_2024.ageRestrictions.maxAge}
                        helpMessage="증여하는 사람의 만 나이"
                        dynamicInfo={(value) => {
                          if (value === 0) return '';
                          if (value >= GIFT_TAX_LIMITS_2024.ageRestrictions.seniorAge) {
                            return `고령자(${GIFT_TAX_LIMITS_2024.ageRestrictions.seniorAge}세 이상)로 조기 증여 시 절세 효과가 큽니다.`;
                          }
                          return '증여시기가 빠를수록 미래 가치 상승분에 대한 절세 효과가 있습니다.';
                        }}
                      />

                      <NumberInput
                        label="수증자 나이"
                        value={input.recipientAge}
                        onChange={(value) => handleInputChange('recipientAge', value)}
                        placeholder="수증자 만 나이"
                        unit="세"
                        limit={GIFT_TAX_LIMITS_2024.ageRestrictions.maxAge}
                        // 나이 제한 적용
                        helpMessage="증여받는 사람의 만 나이 (특별공제 조건에 영향)"
                        dynamicInfo={(value) => {
                          if (value === 0) return '';
                          
                          const messages = [];
                          
                          // 미성년 여부
                          if (value < GIFT_TAX_LIMITS_2024.ageRestrictions.minorAge) {
                            messages.push(`✅ 미성년자로 추가 ${GIFT_TAX_LIMITS_2024.relationshipLimits.linealDescendant.minorBonus.toLocaleString()}원 공제 가능`);
                          } else {
                            messages.push(`성인으로 기본 공제만 적용`);
                          }
                          
                          // 교육비 공제 가능 여부
                          if (value <= GIFT_TAX_LIMITS_2024.ageRestrictions.educationMaxAge) {
                            messages.push(`✅ 교육비공제 가능(${GIFT_TAX_LIMITS_2024.ageRestrictions.educationMaxAge}세 이하)`);
                          } else if (value <= GIFT_TAX_LIMITS_2024.ageRestrictions.startupMaxAge) {
                            messages.push(`⚠️ 교육비공제 불가, 창업자금공제는 가능`);
                          } else {
                            messages.push(`⚠️ 교육비공제, 창업자금공제 모두 불가`);
                          }
                          
                          return messages.join(' | ');
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="donorRelation">증여자와의 관계</Label>
                      <Select 
                        value={input.donorRelation} 
                        onValueChange={(value: any) => handleInputChange('donorRelation', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="관계 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">배우자 (6억원 공제)</SelectItem>
                          <SelectItem value="parent">부모 (5천만원 공제)</SelectItem>
                          <SelectItem value="grandparent">조부모 (5천만원 공제)</SelectItem>
                          <SelectItem value="child">자녀 (5천만원 공제)</SelectItem>
                          <SelectItem value="grandchild">손자녀 (5천만원 공제)</SelectItem>
                          <SelectItem value="other">기타 (1천만원 공제)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        ℹ️ 관계에 따라 공제액이 달라집니다.
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isRecipientDisabled"
                          checked={input.isRecipientDisabled}
                          onCheckedChange={(checked) => handleInputChange('isRecipientDisabled', checked)}
                        />
                        <Label htmlFor="isRecipientDisabled">장애인</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isNonResident"
                          checked={input.isNonResident}
                          onCheckedChange={(checked) => handleInputChange('isNonResident', checked)}
                        />
                        <Label htmlFor="isNonResident">비거주자</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="assets" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <NumberInput
                      label="현금·예금"
                      value={input.cash}
                      onChange={(value) => handleInputChange('cash', value)}
                      placeholder="현금, 예적금 등"
                    />
                    
                    <NumberInput
                      label="부동산"
                      value={input.realEstate}
                      onChange={(value) => handleInputChange('realEstate', value)}
                      placeholder="토지, 건물 등"
                    />
                    
                    <NumberInput
                      label="주식·증권"
                      value={input.stock}
                      onChange={(value) => handleInputChange('stock', value)}
                      placeholder="상장주식, 비상장주식 등"
                    />
                    
                    <NumberInput
                      label="채권"
                      value={input.bond}
                      onChange={(value) => handleInputChange('bond', value)}
                      placeholder="국공채, 회사채 등"
                    />
                    
                    <NumberInput
                      label="사업용자산"
                      value={input.businessAsset}
                      onChange={(value) => handleInputChange('businessAsset', value)}
                      placeholder="사업장, 기계설비 등"
                    />
                    
                    <NumberInput
                      label="기타재산"
                      value={input.other}
                      onChange={(value) => handleInputChange('other', value)}
                      placeholder="골프회원권, 예술품 등"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="special" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                      <Checkbox
                        id="marriageGift"
                        checked={input.marriageGift}
                        onCheckedChange={(checked) => handleInputChange('marriageGift', checked)}
                      />
                      <Label htmlFor="marriageGift" className="font-medium">혼인증여</Label>
                      <Badge variant="outline" className="text-xs text-pink-700">
                        최대 1억원 공제
                      </Badge>
                    </div>

                    {input.marriageGift && (
                      <NumberInput
                        label="혼인증여 금액"
                        value={input.marriageGiftAmount}
                        onChange={(value) => handleInputChange('marriageGiftAmount', value)}
                        placeholder="혼인 시 증여받은 금액"
                        limit={
                          input.donorRelation === 'child' || input.donorRelation === 'grandchild' 
                            ? GIFT_TAX_LIMITS_2024.specialDeductionLimits.marriage.child
                            : GIFT_TAX_LIMITS_2024.specialDeductionLimits.marriage.otherLineal
                        }
                        // 혼인 증여 특별 공제

                        helpMessage={GIFT_TAX_LIMITS_2024.specialDeductionLimits.marriage.description}
                        dynamicInfo={(value) => {
                          if (value === 0) return '';
                          
                          const isChild = input.donorRelation === 'child' || input.donorRelation === 'grandchild';
                          const limit = isChild 
                            ? GIFT_TAX_LIMITS_2024.specialDeductionLimits.marriage.child
                            : GIFT_TAX_LIMITS_2024.specialDeductionLimits.marriage.otherLineal;
                          
                          if (value > limit) {
                            return `⚠️ ${isChild ? '자녀' : '기타 직계비속'} 혼인증여공제 한도(${limit.toLocaleString()}원)를 초과했습니다.`;
                          }
                          
                          const remaining = limit - value;
                          return `${isChild ? '자녀' : '기타 직계비속'} 혼인증여공제 ${remaining.toLocaleString()}원 남음 (평생 1회 한정)`;
                        }}
                      />
                    )}

                    <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Checkbox
                        id="educationGift"
                        checked={input.educationGift}
                        onCheckedChange={(checked) => handleInputChange('educationGift', checked)}
                      />
                      <Label htmlFor="educationGift" className="font-medium">교육비증여</Label>
                      <Badge variant="outline" className="text-xs text-blue-700">
                        국내 3천만원, 해외 5천만원 공제
                      </Badge>
                      {input.recipientAge > GIFT_TAX_LIMITS_2024.ageRestrictions.educationMaxAge && (
                        <Badge variant="destructive" className="text-xs">
                          나이 제한 초과
                        </Badge>
                      )}
                    </div>

                    {input.educationGift && (
                      <NumberInput
                        label="교육비 금액"
                        value={input.educationGiftAmount}
                        onChange={(value) => handleInputChange('educationGiftAmount', value)}
                        placeholder="교육비로 증여받은 금액"
                        limit={GIFT_TAX_LIMITS_2024.specialDeductionLimits.education.foreign} // 해외 기준 최대
                        // 교육비 특별 공제

                        helpMessage={GIFT_TAX_LIMITS_2024.specialDeductionLimits.education.description}
                        dynamicInfo={(value) => {
                          if (value === 0) return '';
                          
                          const domesticLimit = GIFT_TAX_LIMITS_2024.specialDeductionLimits.education.domestic;
                          const foreignLimit = GIFT_TAX_LIMITS_2024.specialDeductionLimits.education.foreign;
                          const ageLimit = GIFT_TAX_LIMITS_2024.specialDeductionLimits.education.ageLimit;
                          
                          if (input.recipientAge > ageLimit) {
                            return `🚨 수증자가 ${ageLimit}세를 초과하여 교육비공제를 받을 수 없습니다.`;
                          }
                          
                          if (value <= domesticLimit) {
                            return `✅ 국내 교육비 공제 범위 (${(domesticLimit - value).toLocaleString()}원 남음)`;
                          } else if (value <= foreignLimit) {
                            return `✅ 해외 교육비 공제 범위 (${(foreignLimit - value).toLocaleString()}원 남음)`;
                          } else {
                            return `⚠️ 교육비공제 한도(해외 ${foreignLimit.toLocaleString()}원)를 초과했습니다.`;
                          }
                        }}
                      />
                    )}

                    <div className="space-y-3">
                      <Label className="text-base font-medium">감면 혜택</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="familyBusinessDiscount"
                            checked={input.familyBusinessDiscount}
                            onCheckedChange={(checked) => handleInputChange('familyBusinessDiscount', checked)}
                          />
                          <Label htmlFor="familyBusinessDiscount">가족기업 감면</Label>
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
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="startupDiscount"
                            checked={input.startupDiscount}
                            onCheckedChange={(checked) => handleInputChange('startupDiscount', checked)}
                          />
                          <Label htmlFor="startupDiscount">창업자금 감면</Label>
                        </div>
                      </div>
                    </div>

                    <NumberInput
                      label="기납부 증여세"
                      value={input.previousTaxPaid}
                      onChange={(value) => handleInputChange('previousTaxPaid', value)}
                      placeholder="이전에 납부한 증여세"
                      helpMessage="동일 증여에 대한 기납부세액"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 중요 경고 메시지 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                ⚠️ 중요 주의사항
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {input.giftAmount > 100000000 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>{GIFT_TAX_LIMITS_2024.warnings.excessiveAmount}</strong>
                    <br />분할증여를 통해 세율 부담을 줄일 수 있습니다.
                  </AlertDescription>
                </Alert>
              )}
              
              {input.previousGifts.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>{GIFT_TAX_LIMITS_2024.warnings.cumulativeRisk}</strong>
                    <br />10년 내 증여 이력: {input.previousGifts.length}건
                  </AlertDescription>
                </Alert>
              )}
              
              {input.isConditionalGift && input.giftConditionValue / input.giftAmount > 0.7 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>{GIFT_TAX_LIMITS_2024.warnings.conditionalGift}</strong>
                    <br />부담비율: {((input.giftConditionValue / input.giftAmount) * 100).toFixed(1)}%
                  </AlertDescription>
                </Alert>
              )}
              
              {(input.marriageGift || input.educationGift || input.startupDiscount) && (
                <Alert className="border-purple-200 bg-purple-50">
                  <Info className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    <strong>{GIFT_TAX_LIMITS_2024.warnings.specialRequirements}</strong>
                    <br />특별공제 신청 시 요건 충족 여부를 사전에 확인하세요.
                  </AlertDescription>
                </Alert>
              )}
              
              <Alert className="border-blue-200 bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>{GIFT_TAX_LIMITS_2024.warnings.filingRequired}</strong>
                  <br />증여일: {input.giftDate} → 신고기한: {new Date(new Date(input.giftDate).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 절세 조언 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <PiggyBank className="w-5 h-5" />
                💡 절세 전략 조언
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-green-800 mb-2">📅 분할증여 전략</h4>
                <p className="text-sm text-green-700">
                  {GIFT_TAX_LIMITS_2024.messages.taxSaving}
                </p>
                {input.donorRelation && (
                  <p className="text-xs text-green-600 mt-1">
                    현재 관계 연간 한도: {
                      input.donorRelation === 'spouse' ? GIFT_TAX_LIMITS_2024.relationshipLimits.spouse.annual :
                      ['parent', 'grandparent'].includes(input.donorRelation) ? GIFT_TAX_LIMITS_2024.relationshipLimits.linealAscendant.annual :
                      ['child', 'grandchild'].includes(input.donorRelation) ? GIFT_TAX_LIMITS_2024.relationshipLimits.linealDescendant.annual :
                      GIFT_TAX_LIMITS_2024.relationshipLimits.other.annual
                    }원
                  </p>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">⏰ 증여 타이밍</h4>
                <p className="text-sm text-blue-700">
                  {GIFT_TAX_LIMITS_2024.messages.timing}
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <h4 className="font-medium text-purple-800 mb-2">📈 누진세율 회피</h4>
                <p className="text-sm text-purple-700">
                  {GIFT_TAX_LIMITS_2024.messages.progressiveRate}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded">
                    <span className="font-medium">1억원 이하:</span> 10%
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="font-medium">5억원 이하:</span> 20%
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="font-medium">10억원 이하:</span> 30%
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="font-medium">30억원 초과:</span> 50%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 오류 표시 */}
          {Object.keys(errors).length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* 결과 영역 */}
        <div className="space-y-6">
          {result && (
            <>
              {/* 계산 결과 요약 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-purple-600" />
                    증여세 계산 결과
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">총 증여재산</p>
                      <p className="text-xl font-bold text-blue-800">
                        {result.grossGift.toLocaleString()}원
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">공제액</p>
                      <p className="text-xl font-bold text-green-800">
                        {result.giftDeductions.toLocaleString()}원
                      </p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600 mb-1">과세표준</p>
                      <p className="text-xl font-bold text-orange-800">
                        {result.taxableGift.toLocaleString()}원
                      </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600 mb-1">최종 납부세액</p>
                      <p className="text-2xl font-bold text-red-800">
                        {result.determinedTax.toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  {result.cumulativeTaxation.previousGifts > 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>📊 10년 합산과세 적용:</strong><br />
                                                  • 기존 증여액: {Math.round(result.cumulativeTaxation.previousGifts).toLocaleString('ko-KR')}원<br />
                          • 이번 증여액: {Math.round(result.cumulativeTaxation.currentGift).toLocaleString('ko-KR')}원<br />
                          • 총 합산액: {Math.round(result.cumulativeTaxation.totalGifts).toLocaleString('ko-KR')}원<br />
                          • 기납부 세액: {Math.round(result.cumulativeTaxation.previousTaxPaid).toLocaleString('ko-KR')}원
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">실효세율</span>
                      <span className="text-lg font-bold">
                        {(result.effectiveRate * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">적용세율</span>
                      <span className="text-lg font-bold">
                        {(result.marginalRate * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 공제 상세 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    공제 상세
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>{result.relationshipDeduction.type}</span>
                    <span className="font-medium">
                      {result.relationshipDeduction.amount.toLocaleString()}원
                    </span>
                  </div>
                  
                  {result.specialDeductions.marriage > 0 && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>혼인증여공제</span>
                      <span className="font-medium">
                        {result.specialDeductions.marriage.toLocaleString()}원
                      </span>
                    </div>
                  )}
                  
                  {result.specialDeductions.education > 0 && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>교육비공제</span>
                      <span className="font-medium">
                        {result.specialDeductions.education.toLocaleString()}원
                      </span>
                    </div>
                  )}
                  
                  {result.specialDeductions.startup > 0 && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>창업자금공제</span>
                      <span className="font-medium">
                        {result.specialDeductions.startup.toLocaleString()}원
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 font-bold text-lg">
                    <span>총 공제액</span>
                    <span className="text-green-600">
                      {result.giftDeductions.toLocaleString()}원
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* 신고 및 납부 안내 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    신고 및 납부 안내
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>신고기한</span>
                    <span className="font-medium">
                      {result.filingDueDate.toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>납부기한</span>
                    <span className="font-medium">
                      {result.paymentDueDate.toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  
                  {result.installmentAvailable && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>분할납부 가능:</strong> 200만원 이상으로 최대 5회 분할납부가 가능합니다.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <p className="text-sm text-gray-500 border-t pt-3">
                    ℹ️ {GIFT_TAX_LIMITS_2024.messages.filingDeadline}
                  </p>
                </CardContent>
              </Card>

              {/* 절세 조언 */}
              {result.taxSavingAdvice.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBank className="w-5 h-5 text-yellow-600" />
                      💰 맞춤형 절세 조언
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.taxSavingAdvice.map((advice, index) => (
                      <Alert key={index} className="border-green-200 bg-green-50">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>🎯 {advice.type}:</strong><br />
                          {advice.description}
                          {advice.expectedSaving > 0 && (
                            <div className="mt-2 p-2 bg-green-100 rounded border">
                              <span className="font-medium text-green-900">
                                💵 예상 절세액: {advice.expectedSaving.toLocaleString()}원
                              </span>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                    
                    {/* 추가 절세 전략 */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-bold text-blue-900 mb-3">🚀 추가 절세 전략</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded border">
                          <h5 className="font-medium text-blue-800 mb-1">📅 연도별 분할증여</h5>
                          <p className="text-sm text-blue-700">
                            {input.donorRelation === 'spouse' ? '매년 6억원씩' :
                             ['parent', 'grandparent'].includes(input.donorRelation) ? '매년 5천만원씩' :
                             ['child', 'grandchild'].includes(input.donorRelation) ? '매년 5천만원씩' :
                             '매년 1천만원씩'} 분할하여 증여세 부담 최소화
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <h5 className="font-medium text-purple-800 mb-1">🎯 타이밍 최적화</h5>
                          <p className="text-sm text-purple-700">
                            재산 가치가 낮은 시점에 증여하여 미래 상승분 절세
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <h5 className="font-medium text-orange-800 mb-1">🏠 부동산 전략</h5>
                          <p className="text-sm text-orange-700">
                            토지 먼저 증여 후 건물 신축으로 가치 상승분 회피
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <h5 className="font-medium text-green-800 mb-1">👥 가족 단위 증여</h5>
                          <p className="text-sm text-green-700">
                            배우자, 자녀 등 다수에게 분산 증여로 전체 세부담 감소
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!result && (
            <Card>
              <CardContent className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  증여 정보를 입력하면 계산 결과가 표시됩니다.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 종합 조언 및 체크리스트 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <CheckCircle className="w-5 h-5" />
            📋 증여세 신고 체크리스트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 신고 전 준비사항 */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 mb-3">📝 신고 전 준비사항</h4>
              <div className="space-y-2">
                {[
                  '증여계약서 또는 증여확인서 작성',
                  '부동산의 경우 등기부등본 및 공시지가 확인',
                  '주식의 경우 주주명부 및 평가명세서',
                  '부담부증여시 부담내용 명세서',
                  '특별공제 요건 충족 증빙서류',
                  '기존 증여세 신고서류 (10년 내)',
                  '신분증 및 가족관계증명서'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 신고 시 주의사항 */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 mb-3">⚠️ 신고 시 주의사항</h4>
              <div className="space-y-2">
                {[
                  '증여일로부터 3개월 이내 신고 필수',
                  '신고 누락 시 20% 가산세 부과',
                  '특별공제는 신고해야만 적용',
                  '부담부증여는 정확한 부담액 산정',
                  '재산 평가는 증여일 기준 시가',
                  '세무서 방문 또는 홈택스 온라인 신고',
                  '납부는 신고와 동시에 완료'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 연락처 정보 */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-3">📞 도움받을 수 있는 곳</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-blue-800">국세청 콜센터</div>
                <div className="text-blue-600">126</div>
                <div className="text-xs text-blue-500">24시간 상담</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-800">홈택스</div>
                <div className="text-green-600">hometax.go.kr</div>
                <div className="text-xs text-green-500">온라인 신고</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-purple-800">전문 세무사</div>
                <div className="text-purple-600">개인 상담</div>
                <div className="text-xs text-purple-500">복잡한 사안</div>
              </div>
            </div>
          </div>
          
          {/* 최종 알림 */}
          <Alert className="mt-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>🚨 중요 안내:</strong><br />
              본 계산 결과는 참고용이며, 실제 신고 시에는 반드시 세무 전문가의 검토를 받으시기 바랍니다.
              개인별 특수 상황이나 최신 세법 변경사항이 반영되지 않을 수 있습니다.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 🧪 베타테스트 피드백 시스템 (면책조항 상단) */}
      <BetaFeedbackForm 
        calculatorName="증여세 계산기"
        calculatorType="gift-tax"
        className="mb-6"
      />

      {/* 하단 면책 조항 */}
      <TaxCalculatorDisclaimer variant="full" className="mt-8" />
    </div>
  );
} 