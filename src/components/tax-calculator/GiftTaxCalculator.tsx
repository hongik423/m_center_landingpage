'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EnhancedSmartInput } from '@/components/ui/enhanced-smart-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Calculator, RefreshCw } from 'lucide-react';
import { GIFT_TAX_2024 } from '@/constants/tax-rates-2024';

interface GiftTaxResult {
  giftAmount: number;
  deduction: number;
  taxableAmount: number;
  taxRate: number;
  progressiveDeduction: number;
  calculatedTax: number;
  effectiveRate: number;
}

export function GiftTaxCalculator() {
  const [giftAmount, setGiftAmount] = useState<number>(0);
  const [relationship, setRelationship] = useState<'spouse' | 'direct' | 'other'>('direct');
  const [result, setResult] = useState<GiftTaxResult | null>(null);

  const calculateGiftTax = useCallback(() => {
    if (giftAmount <= 0) {
      setResult(null);
      return;
    }

    // 증여재산공제 (2024년 기준)
    const deductions = {
      spouse: 600000000, // 배우자: 6억원
      direct: 50000000,  // 직계존비속: 5천만원
      other: 10000000    // 기타: 1천만원
    };

    const deduction = deductions[relationship];
    const taxableAmount = Math.max(0, giftAmount - deduction);

    if (taxableAmount === 0) {
      setResult({
        giftAmount,
        deduction,
        taxableAmount: 0,
        taxRate: 0,
        progressiveDeduction: 0,
        calculatedTax: 0,
        effectiveRate: 0
      });
      return;
    }

    // 증여세율 적용 (2024년 기준)
    let calculatedTax = 0;
    let applicableRate = 0;
    let progressiveDeduction = 0;

    for (const bracket of GIFT_TAX_2024.taxRates) {
      if (taxableAmount > bracket.min && (bracket.max === null || taxableAmount <= bracket.max)) {
        applicableRate = bracket.rate * 100; // rate는 0.1 형태이므로 100을 곱함
        progressiveDeduction = bracket.deduction;
        calculatedTax = taxableAmount * bracket.rate - bracket.deduction;
        break;
      }
    }

    const effectiveRate = giftAmount > 0 ? (calculatedTax / giftAmount) * 100 : 0;

    setResult({
      giftAmount,
      deduction,
      taxableAmount,
      taxRate: applicableRate,
      progressiveDeduction,
      calculatedTax: Math.max(0, calculatedTax),
      effectiveRate
    });
  }, [giftAmount, relationship]);

  const resetCalculator = () => {
    setGiftAmount(0);
    setRelationship('direct');
    setResult(null);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('ko-KR');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Calculator className="w-5 h-5" />
          증여세 계산기
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* 입력 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <EnhancedSmartInput
              label="증여재산 가액"
              value={giftAmount}
              onChange={setGiftAmount}
              placeholder=""
              suffix="원"
              minValue={0}
              maxValue={100000000000}
              autoComma={true}
              required={true}
              helpText="증여받을 재산의 시가를 입력하세요"
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium">증여자와의 관계</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant={relationship === 'spouse' ? 'default' : 'outline'}
                  onClick={() => setRelationship('spouse')}
                  className="justify-start"
                >
                  배우자 (공제: 6억원)
                </Button>
                <Button
                  type="button"
                  variant={relationship === 'direct' ? 'default' : 'outline'}
                  onClick={() => setRelationship('direct')}
                  className="justify-start"
                >
                  직계존비속 (공제: 5천만원)
                </Button>
                <Button
                  type="button"
                  variant={relationship === 'other' ? 'default' : 'outline'}
                  onClick={() => setRelationship('other')}
                  className="justify-start"
                >
                  기타 (공제: 1천만원)
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={calculateGiftTax}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={giftAmount <= 0}
              >
                <Calculator className="w-4 h-4 mr-2" />
                계산하기
              </Button>
              <Button
                onClick={resetCalculator}
                variant="outline"
                size="icon"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* 2024년 증여세율 표 */}
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-semibold">2024년 증여세율</div>
                  <div className="text-xs space-y-1">
                    <div>• 1억원 이하: 10%</div>
                    <div>• 5억원 이하: 20%</div>
                    <div>• 10억원 이하: 30%</div>
                    <div>• 30억원 이하: 40%</div>
                    <div>• 30억원 초과: 50%</div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* 계산 결과 */}
        {result && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
            <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              증여세 계산 결과
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <span className="text-gray-600">증여재산 가액</span>
                  <span className="font-semibold text-purple-800">
                    {formatCurrency(result.giftAmount)}원
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <span className="text-gray-600">증여재산공제</span>
                  <span className="font-semibold text-green-600">
                    -{formatCurrency(result.deduction)}원
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <span className="text-gray-600">과세표준</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(result.taxableAmount)}원
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <span className="text-gray-600">적용세율</span>
                  <span className="font-semibold text-purple-600">
                    {result.taxRate}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <span className="text-gray-600">누진공제</span>
                  <span className="font-semibold text-green-600">
                    -{formatCurrency(result.progressiveDeduction)}원
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50 rounded border-2 border-red-200">
                  <span className="text-gray-800 font-semibold">납부할 증여세</span>
                  <span className="font-bold text-red-600 text-lg">
                    {formatCurrency(result.calculatedTax)}원
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">실효세율</span>
                <span className="font-bold text-blue-600">
                  {result.effectiveRate.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 주의사항 */}
        <Alert className="bg-yellow-50 border-yellow-200">
          <Info className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="space-y-2">
              <div className="font-semibold">증여세 계산 시 주의사항</div>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 증여재산공제는 동일인으로부터 10년간 합산하여 적용됩니다</li>
                <li>• 부동산의 경우 시가 또는 기준시가 중 높은 금액으로 평가됩니다</li>
                <li>• 증여세 신고 및 납부기한은 증여일이 속하는 달의 말일부터 3개월입니다</li>
                <li>• 실제 계산은 전문가와 상담하시기 바랍니다</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
} 