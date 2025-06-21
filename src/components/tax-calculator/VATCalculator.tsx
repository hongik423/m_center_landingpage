'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NumberInput } from '@/components/ui/number-input';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Building2,
  Clock
} from 'lucide-react';
import { VATInput, VATResult } from '@/types/tax-calculator.types';
import { calculateVAT, determineBusinessType, getVATRateByBusiness, VAT_RATES, SIMPLIFIED_THRESHOLD, EXEMPT_THRESHOLD } from '@/lib/utils/vat-calculations';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';

// 업종 선택 옵션
const BUSINESS_CATEGORIES = [
  '제조업',
  '도소매업', 
  '음식점업',
  '서비스업',
  '건설업',
  '부동산임대업',
  '운수업',
  '기타'
];

export default function VATCalculator() {
  // 입력 상태
  const [inputs, setInputs] = useState<VATInput>({
    outputVAT: 0,
    inputVAT: 0,
    businessType: 'general',
    taxPeriod: 'first'
  });

  // 추가 정보 상태 (고도화)
  const [additionalInfo, setAdditionalInfo] = useState({
    annualSales: 0,
    businessCategory: '기타',
    periodSales: 0,        // 과세기간 매출액 (간이과세자용)
    showDetail: false,
    showSamples: false     // 샘플 케이스 표시
  });

  // 계산 결과 상태
  const [result, setResult] = useState<VATResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof VATInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 추가 정보 변경 핸들러
  const handleAdditionalInfoChange = (field: string, value: string | number) => {
    setAdditionalInfo(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? (field === 'businessCategory' ? value : parseFloat(value) || 0) : value
    }));
  };

  // 입력값 검증 (고도화)
  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 간이과세자의 경우 매출액 검증
    if (inputs.businessType === 'simplified') {
      if (additionalInfo.periodSales <= 0) {
        newErrors.periodSales = '과세기간 매출액을 입력해주세요.';
      }
      if (additionalInfo.periodSales > 50000000000) {
        newErrors.periodSales = '매출액이 너무 큽니다. (최대 500억원)';
      }
    } else {
      // 일반과세자의 경우 매출세액 검증
      if (inputs.outputVAT < 0) {
        newErrors.outputVAT = '매출세액은 0 이상이어야 합니다.';
      }
      if (inputs.outputVAT > 100000000000) {
        newErrors.outputVAT = '매출세액이 너무 큽니다. (최대 1000억원)';
      }
    }

    // 매입세액 검증 (면세사업자 제외)
    if (inputs.businessType !== 'exempt') {
      if (inputs.inputVAT < 0) {
        newErrors.inputVAT = '매입세액은 0 이상이어야 합니다.';
      }
      if (inputs.inputVAT > 100000000000) {
        newErrors.inputVAT = '매입세액이 너무 큽니다. (최대 1000억원)';
      }
    }

    // 간이과세자 특별 검증
    if (inputs.businessType === 'simplified' && additionalInfo.periodSales > 0) {
      const expectedVAT = Math.floor(additionalInfo.periodSales * getVATRateByBusiness(additionalInfo.businessCategory));
      if (inputs.inputVAT > expectedVAT * 2) {
        newErrors.inputVAT = `매입세액이 과도합니다. 예상 부가가치세액(${expectedVAT.toLocaleString()}원)을 참고하세요.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 사업자 유형 자동 판정
  useEffect(() => {
    if (additionalInfo.annualSales > 0) {
      const suggestedType = determineBusinessType(additionalInfo.annualSales, additionalInfo.businessCategory);
      if (suggestedType !== inputs.businessType) {
        setInputs(prev => ({ ...prev, businessType: suggestedType }));
      }
    }
  }, [additionalInfo.annualSales, additionalInfo.businessCategory]);

  // 계산 실행 (고도화)
  const handleCalculate = async () => {
    if (!validateInputs()) return;

    setIsCalculating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 계산 시뮬레이션
      
      // 간이과세자의 경우 매출액과 업종 정보 전달
      const salesAmount = inputs.businessType === 'simplified' ? additionalInfo.periodSales : undefined;
      const businessCategory = inputs.businessType === 'simplified' ? additionalInfo.businessCategory : undefined;
      
      const calculationResult = calculateVAT(inputs, salesAmount, businessCategory);
      setResult(calculationResult);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : '계산 중 오류가 발생했습니다.'
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // 초기화
  const handleReset = () => {
    setInputs({
      outputVAT: 0,
      inputVAT: 0,
      businessType: 'general',
      taxPeriod: 'first'
    });
    setAdditionalInfo({
      annualSales: 0,
      businessCategory: '기타',
      periodSales: 0,
      showDetail: false,
      showSamples: false
    });
    setResult(null);
    setErrors({});
  };

  // 매출액으로부터 매출세액 계산
  const calculateOutputVATFromSales = (sales: number): number => {
    return Math.floor(sales * VAT_RATES.STANDARD);
  };

  // 사업자 유형 안내 메시지
  const getBusinessTypeGuide = () => {
    switch (inputs.businessType) {
      case 'general':
        return '매출세액에서 매입세액을 차감하여 계산합니다.';
      case 'simplified':
        return `매출액에 부가가치율(${(getVATRateByBusiness(additionalInfo.businessCategory) * 100).toFixed(1)}%)을 적용하여 계산합니다.`;
      case 'exempt':
        return '면세 사업으로 부가가치세 납부의무가 없습니다.';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 px-4 py-2 rounded-full mb-4">
          <Calculator className="w-5 h-5 text-cyan-600" />
          <span className="text-sm font-medium text-cyan-800">2024년 기준</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          부가가치세 계산기
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          매출세액과 매입세액을 입력하여 납부할 부가가치세를 정확하게 계산해보세요.
          <br />
          <strong>일반과세자, 간이과세자, 면세사업자</strong> 모두 지원합니다.
        </p>
      </div>

      {/* 250자 요약 면책 조항 */}
      <TaxCalculatorDisclaimer variant="summary" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 폼 */}
        <div className="space-y-6">
          {/* 사업 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                사업 정보
              </CardTitle>
              <CardDescription>
                사업자 유형 판정을 위한 기본 정보를 입력하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <NumberInput
                    label="연매출액 💰"
                    value={additionalInfo.annualSales || 0}
                    onChange={(value) => handleAdditionalInfoChange('annualSales', value)}
                    placeholder="50,000,000"
                    suffix="원/년"
                    min={0}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    사업자 유형 자동 판정에 사용됩니다
                  </p>
                </div>

                <div>
                  <Label htmlFor="businessCategory">업종</Label>
                  <Select
                    value={additionalInfo.businessCategory}
                    onValueChange={(value) => handleAdditionalInfoChange('businessCategory', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 사업자 유형 판정 결과 */}
              {additionalInfo.annualSales > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>판정 결과:</strong> {
                      additionalInfo.annualSales <= EXEMPT_THRESHOLD ? '면세사업자' :
                      additionalInfo.annualSales <= (
                        ['제조업', '도소매업'].includes(additionalInfo.businessCategory) 
                          ? SIMPLIFIED_THRESHOLD.GOODS 
                          : SIMPLIFIED_THRESHOLD.SERVICES
                      ) ? '간이과세자' : '일반과세자'
                    }
                    <br />
                    <span className="text-sm text-gray-600">
                      {
                        additionalInfo.annualSales <= EXEMPT_THRESHOLD ? 
                          `연매출 ${(EXEMPT_THRESHOLD / 10000).toFixed(0)}만원 이하` :
                        additionalInfo.annualSales <= (
                          ['제조업', '도소매업'].includes(additionalInfo.businessCategory) 
                            ? SIMPLIFIED_THRESHOLD.GOODS 
                            : SIMPLIFIED_THRESHOLD.SERVICES
                        ) ? 
                          `간이과세 기준: ${(['제조업', '도소매업'].includes(additionalInfo.businessCategory) ? '8천만원' : '4천만원')} 이하` :
                          '일반과세자 대상'
                      }
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* 부가가치세 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                부가가치세 정보
              </CardTitle>
              <CardDescription>
                {getBusinessTypeGuide()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessType">사업자 구분</Label>
                  <Select
                    value={inputs.businessType}
                    onValueChange={(value) => handleInputChange('businessType', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">일반과세자</SelectItem>
                      <SelectItem value="simplified">간이과세자</SelectItem>
                      <SelectItem value="exempt">면세사업자</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="taxPeriod">과세기간</Label>
                  <Select
                    value={inputs.taxPeriod}
                    onValueChange={(value) => handleInputChange('taxPeriod', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first">1기 (1~6월)</SelectItem>
                      <SelectItem value="second">2기 (7~12월)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {/* 간이과세자 매출액 입력 */}
                {inputs.businessType === 'simplified' && (
                  <div>
                    <NumberInput
                      label="과세기간 매출액 📊"
                      value={additionalInfo.periodSales || 0}
                      onChange={(value) => handleAdditionalInfoChange('periodSales', value)}
                      placeholder="30,000,000"
                      suffix="원"
                      min={0}
                      error={errors.periodSales}
                    />
                    <div className="text-sm text-blue-600 mt-1">
                      <p>• {inputs.taxPeriod === 'first' ? '1~6월' : '7~12월'} 매출액을 입력하세요</p>
                      <p>• 부가가치율 {(getVATRateByBusiness(additionalInfo.businessCategory) * 100).toFixed(1)}% 적용 → 
                         예상세액: {additionalInfo.periodSales > 0 ? 
                           Math.floor(additionalInfo.periodSales * getVATRateByBusiness(additionalInfo.businessCategory)).toLocaleString('ko-KR') : 0}원
                      </p>
                    </div>
                  </div>
                )}

                {/* 일반과세자 매출세액 입력 */}
                {inputs.businessType === 'general' && (
                  <div>
                    <NumberInput
                      label="매출세액 💸"
                      value={inputs.outputVAT || 0}
                      onChange={(value) => handleInputChange('outputVAT', value)}
                      placeholder="5,000,000"
                      suffix="원"
                      min={0}
                      error={errors.outputVAT}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      매출액 × 10% = 매출세액
                    </p>
                  </div>
                )}

                <div>
                  <NumberInput
                    label="매입세액 🛒"
                    value={inputs.inputVAT || 0}
                    onChange={(value) => handleInputChange('inputVAT', value)}
                    placeholder="1,000,000"
                    suffix="원"
                    min={0}
                    error={errors.inputVAT}
                    disabled={inputs.businessType === 'exempt'}
                  />
                  {inputs.businessType !== 'exempt' && (
                    <p className="text-sm text-gray-500 mt-1">
                      매입액 × 10% = 매입세액
                    </p>
                  )}
                </div>
              </div>

              {/* 간이과세자 안내 */}
              {inputs.businessType === 'simplified' && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>간이과세자:</strong> 실제로는 매출액에 업종별 부가가치율
                    ({(getVATRateByBusiness(additionalInfo.businessCategory) * 100).toFixed(1)}%)을 
                    적용하여 계산합니다. 간편 계산을 위해 매출세액을 직접 입력하세요.
                  </AlertDescription>
                </Alert>
              )}

              {/* 면세사업자 안내 */}
              {inputs.businessType === 'exempt' && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>면세사업자:</strong> 연매출 3천만원 이하로 부가가치세 납부의무가 없습니다.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

                        {/* 샘플 케이스 버튼 */}
              <div className="mb-4">
                <Button
                  variant="outline"
                  onClick={() => setAdditionalInfo(prev => ({ ...prev, showSamples: !prev.showSamples }))}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {additionalInfo.showSamples ? '샘플 케이스 숨기기' : '샘플 케이스 보기'}
                </Button>
              </div>

              {/* 샘플 케이스 */}
              {additionalInfo.showSamples && (
                <Card className="mb-6 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-900 text-lg">📋 샘플 테스트 케이스</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 일반과세자 샘플 */}
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-2">🏢 일반과세자 (서비스업)</h4>
                        <div className="text-sm space-y-1">
                          <p>• 과세기간 매출액: 1억원</p>
                          <p>• 매출세액: 1,000만원 (1억 × 10%)</p>
                          <p>• 매입세액: 300만원</p>
                          <p>• <strong>납부세액: 700만원</strong> (1,000만원 - 300만원)</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            setInputs({
                              ...inputs,
                              businessType: 'general',
                              outputVAT: 10000000,
                              inputVAT: 3000000
                            });
                          }}
                        >
                          이 값으로 계산하기
                        </Button>
                      </div>

                      {/* 간이과세자 샘플 */}
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-2">🍽️ 간이과세자 (음식점업)</h4>
                        <div className="text-sm space-y-1">
                          <p>• 과세기간 매출액: 3천만원</p>
                          <p>• 부가가치율: 4% (음식점업)</p>
                          <p>• 부가가치세액: 120만원 (3천만원 × 4%)</p>
                          <p>• 매입세액: 80만원</p>
                          <p>• <strong>납부세액: 40만원</strong> (120만원 - 80만원)</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            setInputs({
                              ...inputs,
                              businessType: 'simplified',
                              inputVAT: 800000
                            });
                            setAdditionalInfo(prev => ({
                              ...prev,
                              periodSales: 30000000,
                              businessCategory: '음식점업'
                            }));
                          }}
                        >
                          이 값으로 계산하기
                        </Button>
                      </div>

                      {/* 환급 케이스 */}
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-2">💰 환급 케이스 (일반과세자)</h4>
                        <div className="text-sm space-y-1">
                          <p>• 수출기업 (영세율 적용)</p>
                          <p>• 매출세액: 0원 (영세율)</p>
                          <p>• 매입세액: 500만원</p>
                          <p>• <strong>환급세액: 500만원</strong></p>
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            setInputs({
                              ...inputs,
                              businessType: 'general',
                              outputVAT: 0,
                              inputVAT: 5000000
                            });
                          }}
                        >
                          이 값으로 계산하기
                        </Button>
                      </div>

                      {/* 매입세액 한도 초과 케이스 */}
                      <div className="p-4 bg-white rounded-lg border border-orange-200 bg-orange-50">
                        <h4 className="font-semibold text-orange-900 mb-2">⚠️ 매입세액 한도 초과 (간이과세자)</h4>
                        <div className="text-sm space-y-1 text-orange-800">
                          <p>• 간이과세자 (제조업)</p>
                          <p>• 과세기간 매출액: 2천만원</p>
                          <p>• 부가가치세액: 30만원 (2천만원 × 1.5%)</p>
                          <p>• 매입세액: 50만원 (한도 초과)</p>
                          <p>• <strong>실제 공제: 30만원</strong> (납부할 세액 한도)</p>
                          <p>• <strong>납부세액: 0원</strong> (환급 불가)</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            setInputs({
                              ...inputs,
                              businessType: 'simplified',
                              inputVAT: 500000
                            });
                            setAdditionalInfo(prev => ({
                              ...prev,
                              periodSales: 20000000,
                              businessCategory: '제조업'
                            }));
                          }}
                        >
                          이 값으로 계산하기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 계산 버튼 */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleCalculate}
                  disabled={isCalculating || inputs.businessType === 'exempt'}
                  className="flex-1"
                  size="lg"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      계산 중...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      세액 계산하기
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} size="lg">
                  초기화
                </Button>
              </div>

          {/* 일반 에러 표시 */}
          {errors.general && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* 계산 결과 */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* 결과 요약 */}
              <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-900">
                    <DollarSign className="w-5 h-5" />
                    부가가치세 계산 결과
                  </CardTitle>
                  <CardDescription className="text-cyan-700">
                    {inputs.taxPeriod === 'first' ? '1기 (1~6월)' : '2기 (7~12월)'} 
                    {inputs.businessType === 'general' ? ' 일반과세' : 
                     inputs.businessType === 'simplified' ? ' 간이과세' : ' 면세'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 최종 결과 */}
                    <div className="text-center p-6 bg-white rounded-lg border border-cyan-200">
                      {result.vatPayable > 0 ? (
                        <>
                          <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 mb-2">납부할 세액</p>
                          <p className="text-3xl font-bold text-red-600">
                            {Math.round(result.vatPayable).toLocaleString('ko-KR')}원
                          </p>
                        </>
                      ) : result.vatRefundable > 0 ? (
                        <>
                          <TrendingDown className="w-12 h-12 text-green-500 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 mb-2">환급받을 세액</p>
                          <p className="text-3xl font-bold text-green-600">
                            {Math.round(result.vatRefundable).toLocaleString('ko-KR')}원
                          </p>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 mb-2">신고대상</p>
                          <p className="text-3xl font-bold text-blue-600">
                            납부세액 없음
                          </p>
                        </>
                      )}
                    </div>

                    {/* 계산 내역 (고도화) */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">📊 상세 계산 내역</h4>
                      {result.breakdown.steps.map((step, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-900">{step.label}</span>
                            <span className="font-bold text-lg">
                              {Math.round(step.amount).toLocaleString('ko-KR')}원
                            </span>
                          </div>
                          {step.formula && (
                            <p className="text-sm text-blue-600 mb-1">
                              <strong>계산식:</strong> {step.formula}
                            </p>
                          )}
                          {step.note && (
                            <p className="text-sm text-gray-600">
                              <strong>설명:</strong> {step.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 중요 체크포인트 */}
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="font-semibold text-yellow-800 mb-2">🔍 계산 검증 체크포인트</h5>
                      <div className="space-y-2 text-sm text-yellow-700">
                        {inputs.businessType === 'general' && (
                          <>
                            <p>✓ 일반과세자는 적격 세금계산서상 매입세액 전액 공제</p>
                            <p>✓ 매출세액 &gt; 매입세액 → 납부, 매출세액 &lt; 매입세액 → 환급</p>
                            <p>✓ 수출기업은 영세율 적용으로 매출세액 0원</p>
                          </>
                        )}
                        {inputs.businessType === 'simplified' && (
                          <>
                            <p>✓ 간이과세자는 업종별 부가가치율 적용</p>
                            <p>✓ 매입세액공제는 납부할 세액 범위 내에서만 가능</p>
                            <p>✓ 매입세액이 부가가치세액보다 커도 환급 불가</p>
                            <p>✓ {additionalInfo.businessCategory} 부가가치율: {(getVATRateByBusiness(additionalInfo.businessCategory) * 100).toFixed(1)}%</p>
                          </>
                        )}
                        {inputs.businessType === 'exempt' && (
                          <>
                            <p>✓ 연매출 3천만원 이하 면세사업자</p>
                            <p>✓ 부가가치세 납부의무 없음</p>
                            <p>✓ 매입세액공제 불가</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 신고 안내 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    신고 및 납부 안내
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>신고기한</span>
                      <span className="font-semibold">
                        {inputs.taxPeriod === 'first' ? '7월 25일' : '1월 25일'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>납부기한</span>
                      <span className="font-semibold">
                        {inputs.taxPeriod === 'first' ? '7월 25일' : '1월 25일'}
                      </span>
                    </div>
                    <Separator />
                    <div className="text-sm text-gray-600">
                      <p>• 부가가치세는 홈택스(www.hometax.go.kr)에서 신고하실 수 있습니다.</p>
                      <p>• 신고기한 내 신고·납부하지 않으면 가산세가 부과됩니다.</p>
                      {inputs.businessType === 'simplified' && (
                        <p>• 간이과세자는 업종별 부가가치율이 적용됩니다.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 절세 팁 및 주의사항 (고도화) */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <FileText className="w-5 h-5" />
                    💡 절세 전략 & 주의사항
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-green-800">
                  <div className="space-y-4">
                    {/* 일반 절세 팁 */}
                    <div>
                      <h5 className="font-semibold mb-2">📈 절세 전략</h5>
                      <div className="space-y-2 text-sm">
                        <p>• <strong>적격 세금계산서 수취:</strong> 매입세액공제를 위해 반드시 적격 세금계산서 수취</p>
                        <p>• <strong>전자세금계산서 활용:</strong> 연매출 3억 이상시 의무, 수수료 절약 효과</p>
                        <p>• <strong>사업자 유형 최적화:</strong> 매출 규모에 따른 유리한 사업자 유형 선택</p>
                        {inputs.businessType === 'simplified' && (
                          <p>• <strong>일반과세자 전환 고려:</strong> 매입세액이 많은 경우 일반과세자 전환 검토</p>
                        )}
                        {result && result.vatRefundable > 0 && (
                          <p>• <strong>환급 신청:</strong> 환급세액 {result.vatRefundable.toLocaleString()}원 적극 신청</p>
                        )}
                      </div>
                    </div>

                    {/* 사업자 유형별 팁 */}
                    <div>
                      <h5 className="font-semibold mb-2">🎯 사업자 유형별 팁</h5>
                      <div className="space-y-2 text-sm">
                        {inputs.businessType === 'general' && (
                          <>
                            <p>• <strong>매입세액 관리:</strong> 모든 매입에 대해 세금계산서 수취 철저</p>
                            <p>• <strong>수출기업 혜택:</strong> 영세율 적용으로 매입세액 전액 환급 가능</p>
                            <p>• <strong>신용카드 매입:</strong> 신용카드 매입분도 세금계산서 발급 요청</p>
                          </>
                        )}
                        {inputs.businessType === 'simplified' && (
                          <>
                            <p>• <strong>매입세액 한도 관리:</strong> 납부할 세액 범위 내에서만 공제 가능</p>
                            <p>• <strong>업종 변경 시 신고:</strong> 업종 변경시 부가가치율 변동으로 신고 필요</p>
                            <p>• <strong>일반과세자 전환 검토:</strong> 매입비중이 높으면 일반과세자가 유리</p>
                          </>
                        )}
                        {inputs.businessType === 'exempt' && (
                          <>
                            <p>• <strong>매출 관리:</strong> 연매출 3천만원 초과시 과세사업자로 전환</p>
                            <p>• <strong>과세사업자 선택:</strong> 매입세액이 많으면 과세사업자 선택 고려</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 주의사항 */}
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-2">⚠️ 필수 주의사항</h5>
                      <div className="space-y-1 text-sm text-red-700">
                        <p>• <strong>신고기한 엄수:</strong> {inputs.taxPeriod === 'first' ? '7월 25일' : '1월 25일'}까지 신고·납부</p>
                        <p>• <strong>가산세 방지:</strong> 무신고시 20%, 과소신고시 10% 가산세 부과</p>
                        <p>• <strong>세금계산서 발급:</strong> 지연발급시 1% 가산세 부과</p>
                        {inputs.businessType === 'simplified' && (
                          <p>• <strong>환급 불가:</strong> 간이과세자는 매입세액 초과분 환급 불가</p>
                        )}
                        <p>• <strong>사업자등록 의무:</strong> 과세사업자는 사업 개시 20일 이내 등록</p>
                      </div>
                    </div>

                    {/* 실무 체크리스트 */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">📋 실무 체크리스트</h5>
                      <div className="space-y-1 text-sm text-blue-700">
                        <p>□ 세금계산서 수취 및 보관 (5년)</p>
                        <p>□ 매입/매출 장부 작성</p>
                        <p>□ 홈택스 전자신고 준비</p>
                        <p>□ 은행 납부 계좌 확인</p>
                        {inputs.businessType === 'simplified' && (
                          <p>□ 업종별 부가가치율 확인</p>
                        )}
                        <p>□ 이월 미공제 매입세액 확인</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* 초기 안내 */
            <Card className="border-dashed border-gray-300">
              <CardContent className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  부가가치세 계산 준비 완료
                </h3>
                <p className="text-gray-600 mb-6">
                  매출세액과 매입세액을 입력한 후<br />
                  계산하기 버튼을 눌러주세요
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-semibold text-blue-900 mb-2">🏢 일반과세자</div>
                      <div className="text-blue-700 space-y-1">
                        <p>• 매출세액 - 매입세액</p>
                        <p>• 표준세율 10% 적용</p>
                        <p>• 매입세액 전액 공제</p>
                        <p>• 환급 가능</p>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="font-semibold text-amber-900 mb-2">🏪 간이과세자</div>
                      <div className="text-amber-700 space-y-1">
                        <p>• 매출액 × 부가가치율</p>
                        <p>• 업종별 차등 세율</p>
                        <p>• 매입세액 한도 적용</p>
                        <p>• 환급 불가</p>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-semibold text-green-900 mb-2">🏠 면세사업자</div>
                      <div className="text-green-700 space-y-1">
                        <p>• 납부세액 없음</p>
                        <p>• 연매출 3천만원 이하</p>
                        <p>• 매입세액공제 불가</p>
                        <p>• 세금계산서 발급 불가</p>
                      </div>
                    </div>
                  </div>

                  {/* 업종별 부가가치율 안내 */}
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-3">📊 간이과세 업종별 부가가치율</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium">제조업</div>
                        <div className="text-blue-600 font-bold">1.5%</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium">도소매업</div>
                        <div className="text-blue-600 font-bold">2.5%</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium">건설업</div>
                        <div className="text-blue-600 font-bold">2.0%</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium">부동산임대</div>
                        <div className="text-blue-600 font-bold">3.0%</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium">운수업</div>
                        <div className="text-blue-600 font-bold">3.0%</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium">음식점업</div>
                        <div className="text-blue-600 font-bold">4.0%</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium">서비스업</div>
                        <div className="text-blue-600 font-bold">4.0%</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium">기타</div>
                        <div className="text-blue-600 font-bold">4.0%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 