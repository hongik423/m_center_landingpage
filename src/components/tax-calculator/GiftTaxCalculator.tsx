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

  // 총 증여액 자동 계산
  const totalGiftAmount = useMemo(() => {
    return input.cash + input.realEstate + input.stock + input.bond + 
           input.businessAsset + input.other;
  }, [input.cash, input.realEstate, input.stock, input.bond, 
      input.businessAsset, input.other]);

  const handleInputChange = useCallback((field: keyof GiftTaxInput, value: any) => {
    setInput(prev => {
      const updated = { ...prev, [field]: value };
      
      // 자동 계산되는 값들
      if (field === 'recipientAge') {
        updated.isRecipientMinor = value < 19;
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
                <Button 
                  onClick={resetInputs}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  초기화
                </Button>
                
                <Button 
                  onClick={handleCalculate}
                  size="sm"
                  disabled={isCalculating || !input.giftAmount}
                  className="flex items-center gap-2"
                >
                  {isCalculating ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Calculator className="w-4 h-4" />
                  )}
                  {isCalculating ? '계산 중...' : '계산하기'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 입력 폼 */}
          <Card>
            <CardHeader>
              <CardTitle>증여 정보 입력</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">기본정보</TabsTrigger>
                  <TabsTrigger value="parties">당사자</TabsTrigger>
                  <TabsTrigger value="assets">재산분류</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <NumberInput
                      label="총 증여재산"
                      value={input.giftAmount}
                      onChange={(value) => handleInputChange('giftAmount', value)}
                      placeholder="증여하는 총 재산가액"
                      required={true}
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
                          <SelectItem value="business">사업자지분</SelectItem>
                          <SelectItem value="other">기타재산</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="parties" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <NumberInput
                        label="증여자 나이"
                        value={input.donorAge}
                        onChange={(value) => handleInputChange('donorAge', value)}
                        placeholder="증여자의 나이"
                        unit="세"
                      />

                      <NumberInput
                        label="수증자 나이"
                        value={input.recipientAge}
                        onChange={(value) => handleInputChange('recipientAge', value)}
                        placeholder="수증자의 나이"
                        unit="세"
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
                          <SelectItem value="spouse">배우자(6억원 공제)</SelectItem>
                          <SelectItem value="parent">부모(5천만원 공제)</SelectItem>
                          <SelectItem value="grandparent">조부모(5천만원 공제)</SelectItem>
                          <SelectItem value="child">자녀(5천만원 공제)</SelectItem>
                          <SelectItem value="grandchild">손자녀(5천만원 공제)</SelectItem>
                          <SelectItem value="other">기타(1천만원 공제)</SelectItem>
                        </SelectContent>
                      </Select>
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
                      placeholder="국채, 회사채 등"
                    />
                    
                    <NumberInput
                      label="사업자산"
                      value={input.businessAsset}
                      onChange={(value) => handleInputChange('businessAsset', value)}
                      placeholder="사업권, 기계설비 등"
                    />
                    
                    <NumberInput
                      label="기타재산"
                      value={input.other}
                      onChange={(value) => handleInputChange('other', value)}
                      placeholder="골프회원권, 예술품 등"
                    />
                  </div>
                </TabsContent>
              </Tabs>
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

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">유효세율</span>
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
                        <strong>분할납부 가능</strong> 200만원 이상으로 최대 5년 분할납부가 가능합니다.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 