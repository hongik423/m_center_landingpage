'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  Building2, 
  TrendingUp, 
  Users, 
  Target, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Lightbulb,
  Calendar,
  FileText,
  HelpCircle,
  Shield,
  AlertTriangle,
  DollarSign,
  Factory,
  Briefcase,
  RefreshCw
} from 'lucide-react';

import { CorporateTaxInput, CorporateTaxResult, CorporateTaxValidation } from '@/types/tax-calculator.types';
import { CorporateTaxCalculator, CorporateTaxInputValidator } from '@/lib/utils/corporate-tax-calculations';
import { CORPORATE_TAX_LIMITS_2024, CORPORATE_TAX_2024 } from '@/constants/tax-rates-2024';
import { TaxCalculatorDisclaimer } from './TaxCalculatorDisclaimer';
import { BetaFeedbackForm } from '@/components/ui/beta-feedback-form';
import { formatNumber, formatWon } from '@/lib/utils';

// NumberInput 컴포넌트 (실시간 검증 및 한도 표시)
interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  suffix?: string;
  maxValue?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  helpText?: string;
  warningText?: string;
  isRequired?: boolean;
  className?: string;
}

function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder = "0",
  suffix = "원",
  maxValue,
  warningThreshold,
  criticalThreshold,
  helpText,
  warningText,
  isRequired = false,
  className = ""
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState(value ? formatNumber(value) : '');
  const [isFocused, setIsFocused] = useState(false);

  // 🔴 필수 필드 상태 계산
  const hasError = false; // 기존 에러 로직 유지
  const isCompleted = value > 0 && !hasError;
  const isRequiredAndEmpty = isRequired && value === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(rawValue) || 0;
    
    // 최대값 제한
    const finalValue = maxValue ? Math.min(numericValue, maxValue) : numericValue;
    
    setDisplayValue(formatNumber(finalValue));
    onChange(finalValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value?.toString() || '');
  };

  const handleBlur = () => {
    setIsFocused(false);
    setDisplayValue(value ? formatNumber(value) : '');
  };

  // 상태 판정
  const getStatus = () => {
    if (value === 0) return 'empty';
    if (criticalThreshold && value >= criticalThreshold) return 'critical';
    if (warningThreshold && value >= warningThreshold) return 'warning';
    if (maxValue && value >= maxValue * 0.8) return 'near-limit';
    return 'normal';
  };

  const status = getStatus();
  const getStatusColor = () => {
    switch (status) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'near-limit': return 'border-orange-500 bg-orange-50';
      case 'normal': return 'border-green-500 bg-green-50';
      default: return '';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'near-limit': return <Info className="h-4 w-4 text-orange-500" />;
      case 'normal': return value > 0 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : null;
      default: return null;
    }
  };

  const getProgressPercentage = () => {
    if (!maxValue || value === 0) return 0;
    return Math.min((value / maxValue) * 100, 100);
  };

      return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <Label 
            htmlFor={id} 
            className={`
              text-sm font-medium flex items-center gap-2
              ${isRequired && !isCompleted ? 'text-red-700 font-semibold' : 
                isRequired && isCompleted ? 'text-green-700 font-semibold' : 
                'text-gray-700'}
            `}
          >
            <span>{label}</span>
            
            {/* 🔴 필수 표시 강화 */}
            {isRequired && (
              <div className="flex items-center gap-1">
                <span className="text-red-500 text-lg font-bold">*</span>
                <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300 px-1 py-0">
                  필수
                </Badge>
              </div>
            )}
            
            {/* ✅ 완료 표시 */}
            {isRequired && isCompleted && (
              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                ✅ 완료
              </Badge>
            )}
            
            {helpText && (
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {helpText}
                </div>
              </div>
            )}
          </Label>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            {maxValue && (
              <span className="text-xs text-gray-500">
                한도: {formatNumber(maxValue)}{suffix}
              </span>
            )}
          </div>
        </div>
      
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          value={isFocused ? displayValue.replace(/,/g, '') : displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          autoComplete="off"
          title={label}
          aria-label={label}
          className={`${getStatusColor()} ${className} text-right font-mono`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
      </div>

      {/* 진행률 바 (최대값이 있을 때) */}
      {maxValue && value > 0 && (
        <div className="space-y-1">
          <Progress value={getProgressPercentage()} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>사용: {((value / maxValue) * 100).toFixed(1)}%</span>
            <span>남은 한도: {formatNumber(maxValue - value)}{suffix}</span>
          </div>
        </div>
      )}

      {/* 상태별 메시지 */}
      {status === 'critical' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            <strong>한도 초과:</strong> 입력값이 제한을 초과했습니다. 자동으로 조정됩니다.
          </AlertDescription>
        </Alert>
      )}

      {status === 'warning' && warningText && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700">
            <strong>주의:</strong> {warningText}
          </AlertDescription>
        </Alert>
      )}

      {status === 'near-limit' && maxValue && (
        <Alert className="border-orange-200 bg-orange-50">
          <Info className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700">
            한도의 80%에 근접했습니다. 추가 입력 시 제한될 수 있습니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 🔴 필수 필드 오류 메시지 */}
      {isRequired && isRequiredAndEmpty && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">⚠️</span>
            <span>{label}은(는) 필수 입력 항목입니다.</span>
            <Badge variant="destructive" className="text-xs ml-2">
              REQUIRED
            </Badge>
          </div>
        </div>
      )}

      {/* 🔴 필수 필드 완료 안내 */}
      {isRequired && isCompleted && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
          ✅ 필수 입력이 완료되었습니다: {formatNumber(value)}{suffix}
        </div>
      )}
    </div>
  );
}

// 중소기업 판정 기준 안내 컴포넌트
function SmallBusinessCriteriaGuide({ businessType, revenue, assets, employees }: {
  businessType: string;
  revenue: number;
  assets: number;
  employees: number;
}) {
  const criteria = CORPORATE_TAX_2024.smallBusinessCriteria;
  const salesLimit = criteria.salesCriteria[businessType as keyof typeof criteria.salesCriteria] || 
                    criteria.salesCriteria.other;
  const employeeLimit = criteria.employeeCriteria[businessType as keyof typeof criteria.employeeCriteria] || 
                       criteria.employeeCriteria.other;
  const assetLimit = criteria.assetCriteria;

  const checks = [
    {
      label: '매출액 기준',
      current: revenue,
      limit: salesLimit,
      unit: '원',
      passed: revenue <= salesLimit
    },
    {
      label: '자산총액 기준',
      current: assets,
      limit: assetLimit,
      unit: '원',
      passed: assets <= assetLimit
    },
    {
      label: '직원수 기준',
      current: employees,
      limit: employeeLimit,
      unit: '명',
      passed: employees <= employeeLimit
    }
  ];

  const allPassed = checks.every(check => check.passed);

  return (
    <Card className={`border-2 ${allPassed ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Factory className="h-5 w-5" />
          <span>중소기업 판정 기준</span>
          <Badge variant={allPassed ? "default" : "secondary"} className="ml-2">
            {allPassed ? '중소기업' : '일반기업'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={`${allPassed ? 'bg-green-100 border-green-300' : 'bg-orange-100 border-orange-300'}`}>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>중소기업 혜택:</strong> 더 낮은 세율(10%/20%/22%)과 다양한 세액공제 혜택
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                {check.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <p className="font-medium">{check.label}</p>
                  <p className="text-sm text-gray-600">
                    현재: {formatNumber(check.current)}{check.unit} / 
                    한도: {formatNumber(check.limit)}{check.unit}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Progress 
                  value={(check.current / check.limit) * 100} 
                  className="w-20 h-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {((check.current / check.limit) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {!allPassed && (
          <Alert className="bg-blue-50 border-blue-200">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>절세 제안:</strong> 중소기업 요건을 충족하면 세율이 25%에서 최대 22%로 낮아집니다.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// 세액공제 안내 컴포넌트
function TaxCreditGuide({ isSmallBusiness }: { isSmallBusiness: boolean }) {
  const credits = CORPORATE_TAX_2024.taxCredits;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <span>세액공제 안내</span>
          <Badge variant={isSmallBusiness ? "default" : "secondary"}>
            {isSmallBusiness ? '중소기업' : '대기업'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 연구개발비 세액공제 */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              <Briefcase className="h-4 w-4 text-purple-600" />
              <h4 className="font-semibold">연구개발비 세액공제</h4>
            </div>
            <div className="space-y-2 text-sm">
              {isSmallBusiness ? (
                <>
                  <div className="flex justify-between">
                    <span>일반 R&D:</span>
                    <span className="font-semibold text-green-600">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>신성장동력:</span>
                    <span className="font-semibold text-green-600">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>원천기술:</span>
                    <span className="font-semibold text-green-600">40%</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    최대 한도: {formatWon(credits.rdCredit.smallBusiness.maxCredit)}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>일반 R&D:</span>
                    <span className="font-semibold text-blue-600">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>신성장동력:</span>
                    <span className="font-semibold text-blue-600">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>원천기술:</span>
                    <span className="font-semibold text-blue-600">30%</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    최대 한도: {formatWon(credits.rdCredit.largeBusiness.maxCredit)}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 설비투자 세액공제 */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              <Factory className="h-4 w-4 text-orange-600" />
              <h4 className="font-semibold">설비투자 세액공제</h4>
            </div>
            <div className="space-y-2 text-sm">
              {isSmallBusiness ? (
                <>
                  <div className="flex justify-between">
                    <span>일반설비:</span>
                    <span className="font-semibold text-green-600">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>안전설비:</span>
                    <span className="font-semibold text-green-600">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>환경설비:</span>
                    <span className="font-semibold text-green-600">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>에너지절약:</span>
                    <span className="font-semibold text-green-600">20%</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>일반설비:</span>
                    <span className="font-semibold text-blue-600">7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>안전설비:</span>
                    <span className="font-semibold text-blue-600">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>환경설비:</span>
                    <span className="font-semibold text-blue-600">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>에너지절약:</span>
                    <span className="font-semibold text-blue-600">10%</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 고용증대 세액공제 */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold">고용증대 세액공제</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>청년 정규직:</span>
                <span className="font-semibold text-green-600">
                  {formatWon(credits.employmentCredit.regularEmployee.young)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>장애인:</span>
                <span className="font-semibold text-green-600">
                  {formatWon(credits.employmentCredit.regularEmployee.disabled)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>일반:</span>
                <span className="font-semibold text-green-600">
                  {formatWon(credits.employmentCredit.regularEmployee.general)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>고령자:</span>
                <span className="font-semibold text-green-600">
                  {formatWon(credits.employmentCredit.regularEmployee.elderly)}
                </span>
              </div>
            </div>
          </div>

          {/* 창업기업 세액공제 */}
          {isSmallBusiness && (
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold">창업기업 세액공제</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>공제율:</span>
                  <span className="font-semibold text-purple-600">50%</span>
                </div>
                <div className="flex justify-between">
                  <span>최대 한도:</span>
                  <span className="font-semibold text-purple-600">
                    {formatWon(credits.startupCredit.smallBusiness.maxCredit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>적용 기간:</span>
                  <span className="font-semibold text-purple-600">
                    {credits.startupCredit.smallBusiness.period}년간
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  설립 후 3년 이내, 최소 투자액 1억원 필요
                </div>
              </div>
            </div>
          )}
        </div>

        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            <strong>주의사항:</strong> 세액공제는 까다로운 요건이 있으므로 사전에 충족 여부를 확인하세요.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

// 신고 관련 주의사항 컴포넌트
function FilingWarningsGuide() {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span>신고 관련 주의사항</span>
          <Badge variant="destructive">중요</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 신고 기한 */}
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold text-red-800">신고 기한</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>법인세 신고:</span>
                <span className="font-semibold text-red-600">3개월 이내</span>
              </div>
              <div className="flex justify-between">
                <span>중간예납:</span>
                <span className="font-semibold text-red-600">2개월 이내</span>
              </div>
              <div className="text-xs text-red-700 mt-2">
                사업연도 종료일 기준으로 계산됩니다
              </div>
            </div>
          </div>

          {/* 가산세 */}
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold text-red-800">가산세 정보</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>무신고:</span>
                <span className="font-semibold text-red-600">20~40%</span>
              </div>
              <div className="flex justify-between">
                <span>과소신고:</span>
                <span className="font-semibold text-red-600">10~40%</span>
              </div>
              <div className="flex justify-between">
                <span>납부지연:</span>
                <span className="font-semibold text-red-600">일 0.025%</span>
              </div>
              <div className="text-xs text-red-700 mt-2">
                부정한 방법 시 가산세율이 높아집니다
              </div>
            </div>
          </div>

          {/* 필수 서류 */}
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold text-red-800">필수 제출서류</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span>법인세 신고서</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span>재무제표 (손익계산서, 대차대조표)</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span>부가가치세 신고서 사본</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span>세액공제 관련 증빙서류</span>
              </div>
            </div>
          </div>

          {/* 세무조사 대비 */}
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold text-red-800">세무조사 대비</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-1">
                <Info className="h-3 w-3 text-blue-600" />
                <span>모든 거래 증빙서류 보관 (5년)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Info className="h-3 w-3 text-blue-600" />
                <span>세액공제 요건 충족 증명자료</span>
              </div>
              <div className="flex items-center space-x-1">
                <Info className="h-3 w-3 text-blue-600" />
                <span>회계처리 기준 일관성 유지</span>
              </div>
              <div className="flex items-center space-x-1">
                <Info className="h-3 w-3 text-blue-600" />
                <span>정관, 주주총회의사록 보관</span>
              </div>
            </div>
          </div>
        </div>

        <Alert className="border-red-300 bg-red-100">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>긴급 연락처:</strong> 국세청 상담센터 126번 | 
            <strong>홈택스:</strong> hometax.go.kr | 
            <strong>세무서:</strong> 관할 세무서 방문상담
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

// 위험도 평가 컴포넌트
function RiskAssessmentGuide({ input, result }: { 
  input: CorporateTaxInput; 
  result: CorporateTaxResult | null; 
}) {
  const assessRisk = () => {
    let riskScore = 0;
    const risks = [];

    // 재무 비율 위험도
    if (input.revenue > 0) {
      const profitMargin = ((input.revenue - input.operatingExpenses) / input.revenue) * 100;
      if (profitMargin < 5) {
        riskScore += 20;
        risks.push("낮은 영업이익률 (5% 미만)");
      }
    }

    // 급격한 성장
    if (input.revenue > 10000000000) { // 100억원 초과
      riskScore += 15;
      risks.push("대규모 매출 (세무조사 관심 대상)");
    }

    // 세액공제 과다
    if (result) {
      const creditRatio = (result.taxCredits.totalCredits / Math.max(result.taxBeforeCredits, 1)) * 100;
      if (creditRatio > 30) {
        riskScore += 25;
        risks.push("과도한 세액공제 비율 (30% 초과)");
      }
    }

    // 업종별 위험도
    const highRiskBusinesses = ['construction', 'realestate', 'finance'];
    if (highRiskBusinesses.includes(input.businessType)) {
      riskScore += 10;
      risks.push("세무조사 빈발 업종");
    }

    // 이월결손금 과다
    if (input.carryForwardLoss > input.revenue * 0.5) {
      riskScore += 15;
      risks.push("과도한 이월결손금");
    }

    return { score: Math.min(riskScore, 100), risks };
  };

  const { score, risks } = assessRisk();
  
  const getRiskLevel = () => {
    if (score < 20) return { level: 'LOW', color: 'green', label: '낮음' };
    if (score < 50) return { level: 'MEDIUM', color: 'yellow', label: '보통' };
    if (score < 80) return { level: 'HIGH', color: 'orange', label: '높음' };
    return { level: 'CRITICAL', color: 'red', label: '매우 높음' };
  };

  const riskLevel = getRiskLevel();

  return (
    <Card className={`border-${riskLevel.color}-200 bg-${riskLevel.color}-50`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className={`h-5 w-5 text-${riskLevel.color}-600`} />
          <span>세무 위험도 평가</span>
          <Badge variant={riskLevel.level === 'LOW' ? 'default' : 'destructive'}>
            {riskLevel.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">위험도 점수</span>
              <span className={`text-lg font-bold text-${riskLevel.color}-600`}>
                {score}/100
              </span>
            </div>
            <Progress value={score} className="h-3" />
          </div>
        </div>

        {risks.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-gray-800">주요 위험 요인</h4>
            <div className="space-y-2">
              {risks.map((risk, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <AlertTriangle className={`h-4 w-4 text-${riskLevel.color}-600 mt-0.5`} />
                  <span className="text-sm text-gray-700">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800">권장 대응방안</h4>
          <div className="space-y-1 text-sm text-gray-700">
            {riskLevel.level === 'LOW' && (
              <>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>현재 상태 양호, 정기적인 모니터링 권장</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>증빙서류 체계적 관리</span>
                </div>
              </>
            )}
            {(riskLevel.level === 'MEDIUM' || riskLevel.level === 'HIGH') && (
              <>
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span>세무사 자문 권장</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span>내부 회계관리 강화</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span>세액공제 요건 재검토</span>
                </div>
              </>
            )}
            {riskLevel.level === 'CRITICAL' && (
              <>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span>즉시 전문 세무사 상담 필요</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span>세무조사 대비 철저한 준비</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span>모든 거래 증빙 재점검</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 체크리스트 컴포넌트
function TaxChecklistGuide() {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const handleCheck = (itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const checklistSections = [
    {
      title: "신고 준비사항",
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      items: [
        { id: "financial_statements", text: "재무제표 작성 완료" },
        { id: "tax_base", text: "과세표준 계산 검토" },
        { id: "deductions", text: "소득공제 항목 확인" },
        { id: "tax_credits", text: "세액공제 요건 검토" },
        { id: "carry_forward", text: "이월결손금 계산 확인" },
        { id: "supporting_docs", text: "증빙서류 정리 완료" }
      ]
    },
    {
      title: "신고서 작성",
      icon: <Building2 className="h-4 w-4 text-green-600" />,
      items: [
        { id: "form_completion", text: "법인세 신고서 작성" },
        { id: "attachment", text: "첨부서류 확인" },
        { id: "signature", text: "대표자 서명/날인" },
        { id: "review", text: "최종 검토 완료" },
        { id: "submission_method", text: "제출 방법 확정" }
      ]
    },
    {
      title: "납부 준비",
      icon: <DollarSign className="h-4 w-4 text-purple-600" />,
      items: [
        { id: "tax_calculation", text: "납부세액 최종 확인" },
        { id: "payment_method", text: "납부 방법 선택" },
        { id: "installment_check", text: "분할납부 가능 여부 확인" },
        { id: "account_balance", text: "납부 계좌 잔액 확인" },
        { id: "receipt", text: "납부 영수증 보관 준비" }
      ]
    },
    {
      title: "사후 관리",
      icon: <Shield className="h-4 w-4 text-orange-600" />,
      items: [
        { id: "document_filing", text: "신고서류 파일링" },
        { id: "backup", text: "전자파일 백업" },
        { id: "calendar", text: "다음 신고일정 달력 등록" },
        { id: "improvement", text: "개선사항 정리" }
      ]
    }
  ];

  const getProgress = () => {
    const totalItems = checklistSections.reduce((sum, section) => sum + section.items.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return (checkedCount / totalItems) * 100;
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>법인세 신고 체크리스트</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">진행률</div>
            <div className="text-lg font-bold text-blue-600">
              {getProgress().toFixed(0)}%
            </div>
          </div>
        </CardTitle>
        <Progress value={getProgress()} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {checklistSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <div className="flex items-center space-x-2 font-semibold text-gray-800">
              {section.icon}
              <span>{section.title}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {section.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={checkedItems[item.id] || false}
                    onCheckedChange={() => handleCheck(item.id)}
                  />
                  <Label 
                    htmlFor={item.id} 
                    className={`text-sm cursor-pointer ${
                      checkedItems[item.id] ? 'text-gray-500 line-through' : 'text-gray-700'
                    }`}
                  >
                    {item.text}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>팁:</strong> 신고 전 모든 항목을 체크하여 누락사항이 없는지 확인하세요. 
            체크리스트는 브라우저에 자동 저장됩니다.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

// 메인 컴포넌트
const CorporateTaxCalculatorComponent: React.FC = () => {
  const [input, setInput] = useState<CorporateTaxInput>({
    companyName: '',
    businessType: '',
    establishmentDate: '',
    fiscalYearEnd: new Date().getFullYear() + '-12-31',
    revenue: 0,
    operatingExpenses: 0,
    nonOperatingIncome: 0,
    nonOperatingExpenses: 0,
    specialIncome: 0,
    specialExpenses: 0,
    totalAssets: 0,
    numberOfEmployees: 0,
    carryForwardLoss: 0,
    rdExpenses: 0,
    equipmentInvestment: 0,
    equipmentType: 'general',
    employmentIncrease: 0,
    youngEmployees: 0,
    disabledEmployees: 0,
    charitableDonation: 0,
    isStartup: false,
    startupYears: 0,
    previousYearTax: 0,
    foreignTaxCredit: 0
  });

  const [result, setResult] = useState<CorporateTaxResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validation, setValidation] = useState<CorporateTaxValidation>({ 
    isValid: true, 
    errors: {}, 
    warnings: {} 
  });
  const [activeGuideTab, setActiveGuideTab] = useState('checklist');

  // 🔥 고도화된 자동 연계 계산 로직
  
  // 1. 영업소득 자동 계산
  const operatingIncome = useMemo(() => {
    return Math.max(0, input.revenue - input.operatingExpenses);
  }, [input.revenue, input.operatingExpenses]);

  // 2. 순소득 자동 계산
  const netIncome = useMemo(() => {
    return operatingIncome + input.nonOperatingIncome - input.nonOperatingExpenses + input.specialIncome - input.specialExpenses;
  }, [operatingIncome, input.nonOperatingIncome, input.nonOperatingExpenses, input.specialIncome, input.specialExpenses]);

  // 3. 과세표준 자동 계산
  const taxableIncome = useMemo(() => {
    return Math.max(0, netIncome - input.carryForwardLoss);
  }, [netIncome, input.carryForwardLoss]);

  // 4. 중소기업 판정 자동 계산
  const isSmallMediumBusiness = useMemo(() => {
    // 중소기업 기준: 매출액 120억 이하 또는 자산 50억 이하
    return input.revenue <= 12000000000 || input.totalAssets <= 5000000000;
  }, [input.revenue, input.totalAssets]);

  // 5. 벤처기업 혜택 자동 계산
  const ventureDiscount = useMemo(() => {
    if (input.isStartup && input.startupYears <= 3 && isSmallMediumBusiness) {
      return Math.min(taxableIncome * 0.5, 200000000); // 최대 2억원
    }
    return 0;
  }, [input.isStartup, input.startupYears, isSmallMediumBusiness, taxableIncome]);

  // 6. 고용증대 세액공제 자동 계산
  const employmentTaxCredit = useMemo(() => {
    let credit = 0;
    credit += input.employmentIncrease * 7700000; // 일반근로자 770만원/명
    credit += input.youngEmployees * 11000000; // 청년근로자 1,100만원/명
    credit += input.disabledEmployees * 15400000; // 장애인근로자 1,540만원/명
    return Math.min(credit, taxableIncome * 0.1); // 산출세액의 10% 한도
  }, [input.employmentIncrease, input.youngEmployees, input.disabledEmployees, taxableIncome]);

  // 7. R&D 세액공제 자동 계산
  const rdTaxCredit = useMemo(() => {
    if (input.rdExpenses > 0) {
      const creditRate = isSmallMediumBusiness ? 0.3 : 0.25; // 중소기업 30%, 대기업 25%
      return Math.min(input.rdExpenses * creditRate, taxableIncome * 0.25);
    }
    return 0;
  }, [input.rdExpenses, isSmallMediumBusiness, taxableIncome]);

  // 8. 설비투자 세액공제 자동 계산
  const equipmentTaxCredit = useMemo(() => {
    if (input.equipmentInvestment > 0) {
      let creditRate = 0.03; // 기본 3%
      if (input.equipmentType === 'smart') creditRate = 0.1; // 스마트팩토리 10%
      else if (input.equipmentType === 'safety') creditRate = 0.1; // 안전설비 10%
      else if (input.equipmentType === 'environment') creditRate = 0.1; // 환경보전설비 10%
      
      return Math.min(input.equipmentInvestment * creditRate, taxableIncome * 0.1);
    }
    return 0;
  }, [input.equipmentInvestment, input.equipmentType, taxableIncome]);

  // 입력값 변경 처리
  const handleInputChange = useCallback((field: keyof CorporateTaxInput, value: any) => {
    setInput(prev => {
      const newInput = { ...prev, [field]: value };
      
      // 실시간 검증
      const validation = CorporateTaxInputValidator.validate(newInput);
      setValidation(validation);
      
      return newInput;
    });
  }, []);

  // 숫자 입력 처리 (NumberInput 컴포넌트용)
  const handleNumericInputChange = useCallback((field: keyof CorporateTaxInput) => {
    return (value: number) => {
      handleInputChange(field, value);
    };
  }, [handleInputChange]);

  // 중소기업 판정 실시간 계산
  const getSmallBusinessStatus = useCallback(() => {
    const criteria = CORPORATE_TAX_2024.smallBusinessCriteria;
    const salesLimit = criteria.salesCriteria[input.businessType as keyof typeof criteria.salesCriteria] || 
                      criteria.salesCriteria.other;
    const employeeLimit = criteria.employeeCriteria[input.businessType as keyof typeof criteria.employeeCriteria] || 
                         criteria.employeeCriteria.other;
    const assetLimit = criteria.assetCriteria;

    return {
      salesCheck: input.revenue <= salesLimit,
      assetCheck: input.totalAssets <= assetLimit,
      employeeCheck: input.numberOfEmployees <= employeeLimit,
      isSmallBusiness: input.revenue <= salesLimit && input.totalAssets <= assetLimit && input.numberOfEmployees <= employeeLimit
    };
  }, [input.revenue, input.totalAssets, input.numberOfEmployees, input.businessType]);

  // 계산 실행
  const calculateTax = useCallback(() => {
    setIsCalculating(true);
    
    try {
      const validation = CorporateTaxInputValidator.validate(input);
      setValidation(validation);
      
      if (!validation.isValid) {
        setIsCalculating(false);
        return;
      }
      
      const validatedInput = CorporateTaxInputValidator.validateAndApplyLimits(input);
      const calculator = new CorporateTaxCalculator(validatedInput);
      const result = calculator.calculate();
      
      setResult(result);
    } catch (error) {
      console.error('법인세 계산 오류:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [input]);

  // 샘플 데이터 로드
  const loadSampleData = useCallback(() => {
    const sampleData: CorporateTaxInput = {
      companyName: '(주)테크인사이트',
      businessType: 'software',
      establishmentDate: '2020-03-15',
      fiscalYearEnd: '2024-12-31',
      revenue: 5000000000,        // 50억원
      operatingExpenses: 3500000000, // 35억원
      nonOperatingIncome: 50000000,  // 5천만원
      nonOperatingExpenses: 30000000, // 3천만원
      specialIncome: 0,
      specialExpenses: 0,
      totalAssets: 8000000000,    // 80억원
      numberOfEmployees: 45,
      carryForwardLoss: 200000000, // 2억원
      rdExpenses: 800000000,      // 8억원
      equipmentInvestment: 300000000, // 3억원
      equipmentType: 'general',
      employmentIncrease: 5,
      youngEmployees: 3,
      disabledEmployees: 1,
      charitableDonation: 20000000, // 2천만원
      isStartup: false,
      startupYears: 4,
      previousYearTax: 250000000,  // 2.5억원
      foreignTaxCredit: 0
    };
    
    setInput(sampleData);
  }, []);

  // 입력 초기화
  const resetInput = useCallback(() => {
    setInput({
      companyName: '',
      businessType: '',
      establishmentDate: '',
      fiscalYearEnd: new Date().getFullYear() + '-12-31',
      revenue: 0,
      operatingExpenses: 0,
      nonOperatingIncome: 0,
      nonOperatingExpenses: 0,
      specialIncome: 0,
      specialExpenses: 0,
      totalAssets: 0,
      numberOfEmployees: 0,
      carryForwardLoss: 0,
      rdExpenses: 0,
      equipmentInvestment: 0,
      equipmentType: 'general',
      employmentIncrease: 0,
      youngEmployees: 0,
      disabledEmployees: 0,
      charitableDonation: 0,
      isStartup: false,
      startupYears: 0,
      previousYearTax: 0,
      foreignTaxCredit: 0
    });
    setResult(null);
    setValidation({ isValid: true, errors: {}, warnings: {} } as CorporateTaxValidation);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">법인세 계산기</h1>
        </div>
        <p className="text-lg text-gray-600">
          2024년 세법 기준으로 법인세를 정확하게 계산하고 절세 방안을 제공합니다
        </p>
        
        {/* 면책 조항 */}
        <TaxCalculatorDisclaimer variant="summary" />
      </div>

      {/* 🔥 스마트 자동 계산 대시보드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-green-600" />
            <span>⚡ 스마트 자동 계산 대시보드</span>
          </CardTitle>
          <CardDescription>
            입력하는 즉시 관련 값들이 자동으로 연계 계산되고 세무 혜택이 분석됩니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* 영업소득 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="text-xs text-green-600 font-medium mb-1">📊 영업소득 (자동계산)</div>
              <div className="text-xl font-bold text-green-800">
                {operatingIncome.toLocaleString('ko-KR')}원
              </div>
              <div className="text-xs text-gray-500 mt-1">매출 - 영업비용</div>
              {operatingIncome < 0 && (
                <div className="text-xs text-red-500 mt-1">⚠️ 영업손실 발생</div>
              )}
            </div>

            {/* 순소득 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-1">💰 순소득 (자동계산)</div>
              <div className="text-xl font-bold text-blue-800">
                {netIncome.toLocaleString('ko-KR')}원
              </div>
              <div className="text-xs text-gray-500 mt-1">영업 + 영업외 + 특별</div>
              {netIncome < 0 && (
                <div className="text-xs text-red-500 mt-1">⚠️ 순손실 발생</div>
              )}
            </div>

            {/* 과세표준 */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
              <div className="text-xs text-purple-600 font-medium mb-1">📋 과세표준 (자동계산)</div>
              <div className="text-xl font-bold text-purple-800">
                {taxableIncome.toLocaleString('ko-KR')}원
              </div>
              <div className="text-xs text-gray-500 mt-1">순소득 - 이월결손금</div>
              {taxableIncome === 0 && (
                <div className="text-xs text-orange-500 mt-1">⚠️ 과세표준 없음</div>
              )}
            </div>

            {/* 기업 분류 */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <div className="text-xs text-orange-600 font-medium mb-1">🏢 기업 분류 (자동판정)</div>
              <div className="text-xl font-bold text-orange-800">
                {isSmallMediumBusiness ? '중소기업' : '대기업'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {isSmallMediumBusiness ? '중소기업 혜택 적용' : '일반세율 적용'}
              </div>
              <div className="text-xs text-blue-500 mt-1">
                세율: {isSmallMediumBusiness ? '10~22%' : '22~25%'}
              </div>
            </div>
          </div>

          {/* 세액공제 혜택 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 고용증대 세액공제 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
              <div className="text-xs text-emerald-600 font-medium mb-1">👥 고용증대 공제</div>
              <div className="text-lg font-bold text-emerald-800">
                {employmentTaxCredit.toLocaleString('ko-KR')}원
              </div>
              <div className="text-xs text-gray-500 mt-1">
                증가인원: {input.employmentIncrease + input.youngEmployees + input.disabledEmployees}명
              </div>
              <div className="text-xs text-blue-500 mt-1">
                일반 {input.employmentIncrease}명 · 청년 {input.youngEmployees}명 · 장애인 {input.disabledEmployees}명
              </div>
            </div>

            {/* R&D 세액공제 */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-lg border border-violet-200">
              <div className="text-xs text-violet-600 font-medium mb-1">🔬 R&D 공제</div>
              <div className="text-lg font-bold text-violet-800">
                {rdTaxCredit.toLocaleString('ko-KR')}원
              </div>
              <div className="text-xs text-gray-500 mt-1">
                연구개발비: {input.rdExpenses.toLocaleString('ko-KR')}원
              </div>
              <div className="text-xs text-blue-500 mt-1">
                공제율: {isSmallMediumBusiness ? '30%' : '25%'}
              </div>
            </div>

            {/* 설비투자 세액공제 */}
            <div className="bg-gradient-to-br from-cyan-50 to-sky-50 p-4 rounded-lg border border-cyan-200">
              <div className="text-xs text-cyan-600 font-medium mb-1">🏭 설비투자 공제</div>
              <div className="text-lg font-bold text-cyan-800">
                {equipmentTaxCredit.toLocaleString('ko-KR')}원
              </div>
              <div className="text-xs text-gray-500 mt-1">
                투자금액: {input.equipmentInvestment.toLocaleString('ko-KR')}원
              </div>
              <div className="text-xs text-blue-500 mt-1">
                {input.equipmentType === 'smart' ? '스마트팩토리 10%' : 
                 input.equipmentType === 'safety' ? '안전설비 10%' :
                 input.equipmentType === 'environment' ? '환경보전 10%' : '일반 3%'}
              </div>
            </div>

            {/* 벤처기업 혜택 */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
              <div className="text-xs text-rose-600 font-medium mb-1">🚀 벤처기업 혜택</div>
              <div className="text-lg font-bold text-rose-800">
                {ventureDiscount.toLocaleString('ko-KR')}원
              </div>
              <div className="text-xs text-gray-500 mt-1">
                창업 {input.startupYears}년차
              </div>
              <div className="text-xs text-blue-500 mt-1">
                {input.isStartup && input.startupYears <= 3 && isSmallMediumBusiness ? '50% 감면 적용' : '해당없음'}
              </div>
            </div>
          </div>

          {/* 실시간 계산 요약 */}
          {(input.revenue > 0 || input.operatingExpenses > 0) && (
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
              <h4 className="text-sm font-semibold text-indigo-800 mb-3">📊 실시간 계산 요약</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">영업이익률:</span>
                  <span className="ml-2 font-medium">
                    {input.revenue > 0 ? ((operatingIncome / input.revenue) * 100).toFixed(1) : '0.0'}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">순이익률:</span>
                  <span className="ml-2 font-medium">
                    {input.revenue > 0 ? ((netIncome / input.revenue) * 100).toFixed(1) : '0.0'}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">총 세액공제:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {(employmentTaxCredit + rdTaxCredit + equipmentTaxCredit + ventureDiscount).toLocaleString('ko-KR')}원
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 안내 시스템 탭 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>법인세 완벽 가이드</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeGuideTab} onValueChange={setActiveGuideTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="checklist">체크리스트</TabsTrigger>
              <TabsTrigger value="warnings">주의사항</TabsTrigger>
              <TabsTrigger value="risk">위험도 평가</TabsTrigger>
              <TabsTrigger value="credits">세액공제 안내</TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="mt-6">
              <TaxChecklistGuide />
            </TabsContent>

            <TabsContent value="warnings" className="mt-6">
              <FilingWarningsGuide />
            </TabsContent>

            <TabsContent value="risk" className="mt-6">
              <RiskAssessmentGuide input={input} result={result} />
            </TabsContent>

            <TabsContent value="credits" className="mt-6">
              <TaxCreditGuide isSmallBusiness={getSmallBusinessStatus().isSmallBusiness} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>법인세 계산 입력</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">기본정보</TabsTrigger>
                  <TabsTrigger value="financial">재무정보</TabsTrigger>
                  <TabsTrigger value="credits">세액공제</TabsTrigger>
                  <TabsTrigger value="others">기타</TabsTrigger>
                </TabsList>

                {/* 기본 정보 탭 */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">회사명</Label>
                      <Input
                        id="companyName"
                        value={input.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="예: (주)테크인사이트"
                        className={validation.errors.companyName ? 'border-red-500' : ''}
                      />
                      {validation.errors.companyName && (
                        <p className="text-sm text-red-500 mt-1">{validation.errors.companyName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="businessType">업종</Label>
                      <Select value={input.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                        <SelectTrigger className={validation.errors.businessType ? 'border-red-500' : ''}>
                          <SelectValue placeholder="업종을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CORPORATE_TAX_LIMITS_2024.businessTypes).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {validation.errors.businessType && (
                        <p className="text-sm text-red-500 mt-1">{validation.errors.businessType}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="establishmentDate">설립일</Label>
                      <Input
                        id="establishmentDate"
                        type="date"
                        value={input.establishmentDate}
                        onChange={(e) => handleInputChange('establishmentDate', e.target.value)}
                        className={validation.errors.establishmentDate ? 'border-red-500' : ''}
                      />
                      {validation.errors.establishmentDate && (
                        <p className="text-sm text-red-500 mt-1">{validation.errors.establishmentDate}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="fiscalYearEnd">사업연도 종료일</Label>
                      <Input
                        id="fiscalYearEnd"
                        type="date"
                        value={input.fiscalYearEnd}
                        onChange={(e) => handleInputChange('fiscalYearEnd', e.target.value)}
                      />
                    </div>

                    <NumberInput
                      id="totalAssets"
                      label="자산총액"
                      value={input.totalAssets}
                      onChange={handleNumericInputChange('totalAssets')}
                      maxValue={CORPORATE_TAX_LIMITS_2024.maxAssets}
                      warningThreshold={CORPORATE_TAX_2024.smallBusinessCriteria.assetCriteria * 0.8}
                      criticalThreshold={CORPORATE_TAX_2024.smallBusinessCriteria.assetCriteria}
                      helpText="중소기업 기준: 500억원 이하"
                      warningText="중소기업 자산총액 기준에 근접했습니다"
                      isRequired
                    />

                    <NumberInput
                      id="numberOfEmployees"
                      label="직원수"
                      value={input.numberOfEmployees}
                      onChange={handleNumericInputChange('numberOfEmployees')}
                      maxValue={CORPORATE_TAX_LIMITS_2024.maxEmployees}
                      suffix="명"
                      helpText="업종별로 중소기업 기준이 다름 (50~300명)"
                      isRequired
                    />
                  </div>

                  {/* 중소기업 판정 실시간 안내 */}
                  {(input.revenue > 0 || input.totalAssets > 0 || input.numberOfEmployees > 0) && input.businessType && (
                    <div className="mt-6">
                      <SmallBusinessCriteriaGuide
                        businessType={input.businessType}
                        revenue={input.revenue}
                        assets={input.totalAssets}
                        employees={input.numberOfEmployees}
                      />
                    </div>
                  )}
                </TabsContent>

                {/* 재무 정보 탭 */}
                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NumberInput
                      id="revenue"
                      label="매출액"
                      value={input.revenue}
                      onChange={handleNumericInputChange('revenue')}
                      maxValue={CORPORATE_TAX_LIMITS_2024.maxRevenue}
                      helpText="법인의 총 매출액을 입력하세요"
                      isRequired
                    />

                    <NumberInput
                      id="operatingExpenses"
                      label="영업비용"
                      value={input.operatingExpenses}
                      onChange={handleNumericInputChange('operatingExpenses')}
                      maxValue={CORPORATE_TAX_LIMITS_2024.maxExpense}
                      warningThreshold={input.revenue * 1.5}
                      helpText="매출원가, 판관비 등 영업활동 관련 비용"
                      warningText="영업비용이 매출액 대비 매우 높습니다"
                    />

                    <NumberInput
                      id="nonOperatingIncome"
                      label="영업외수익"
                      value={input.nonOperatingIncome}
                      onChange={handleNumericInputChange('nonOperatingIncome')}
                      helpText="이자수익, 배당금, 임대료 등"
                    />

                    <NumberInput
                      id="nonOperatingExpenses"
                      label="영업외비용"
                      value={input.nonOperatingExpenses}
                      onChange={handleNumericInputChange('nonOperatingExpenses')}
                      helpText="이자비용, 외환손실 등"
                    />

                    <NumberInput
                      id="specialIncome"
                      label="특별이익"
                      value={input.specialIncome}
                      onChange={handleNumericInputChange('specialIncome')}
                      helpText="자산처분이익, 채무면제이익 등"
                    />

                    <NumberInput
                      id="specialExpenses"
                      label="특별손실"
                      value={input.specialExpenses}
                      onChange={handleNumericInputChange('specialExpenses')}
                      helpText="자산처분손실, 재해손실 등"
                    />

                    <NumberInput
                      id="carryForwardLoss"
                      label="이월결손금"
                      value={input.carryForwardLoss}
                      onChange={handleNumericInputChange('carryForwardLoss')}
                      helpText="10년간 이월 가능한 과거 결손금"
                    />

                    <NumberInput
                      id="previousYearTax"
                      label="직전연도 법인세"
                      value={input.previousYearTax}
                      onChange={handleNumericInputChange('previousYearTax')}
                      helpText="중간예납세액 계산에 사용됩니다"
                    />
                  </div>

                  {/* 재무 상태 경고 */}
                  {input.revenue > 0 && input.operatingExpenses > input.revenue && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <AlertDescription className="text-red-700">
                        <strong>주의:</strong> 영업비용이 매출액을 초과합니다. 영업손실이 발생할 수 있습니다.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                {/* 세액공제 탭 */}
                <TabsContent value="credits" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NumberInput
                      id="rdExpenses"
                      label="연구개발비"
                      value={input.rdExpenses}
                      onChange={handleNumericInputChange('rdExpenses')}
                      warningThreshold={input.revenue * 0.3}
                      helpText={`${getSmallBusinessStatus().isSmallBusiness ? '중소기업 30~40%' : '대기업 20~30%'} 세액공제`}
                      warningText="연구개발비가 매출액 대비 매우 높습니다"
                    />

                    <NumberInput
                      id="equipmentInvestment"
                      label="설비투자금액"
                      value={input.equipmentInvestment}
                      onChange={handleNumericInputChange('equipmentInvestment')}
                      helpText="설비 종류에 따라 7~20% 세액공제"
                    />

                    <div>
                      <Label htmlFor="equipmentType">설비 종류</Label>
                      <Select value={input.equipmentType} onValueChange={(value) => handleInputChange('equipmentType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">일반설비 ({getSmallBusinessStatus().isSmallBusiness ? '10%' : '7%'})</SelectItem>
                          <SelectItem value="safety">안전설비 ({getSmallBusinessStatus().isSmallBusiness ? '20%' : '10%'})</SelectItem>
                          <SelectItem value="environment">환경설비 ({getSmallBusinessStatus().isSmallBusiness ? '20%' : '10%'})</SelectItem>
                          <SelectItem value="energy">에너지절약설비 ({getSmallBusinessStatus().isSmallBusiness ? '20%' : '10%'})</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <NumberInput
                      id="employmentIncrease"
                      label="고용증가 인원"
                      value={input.employmentIncrease}
                      onChange={handleNumericInputChange('employmentIncrease')}
                      suffix="명"
                      helpText="전년도 대비 증가한 정규직 인원"
                    />

                    <NumberInput
                      id="youngEmployees"
                      label="청년 고용 인원"
                      value={input.youngEmployees}
                      onChange={handleNumericInputChange('youngEmployees')}
                      maxValue={input.employmentIncrease}
                      suffix="명"
                      helpText="15~29세 청년 정규직, 1인당 110만원 공제"
                    />

                    <NumberInput
                      id="disabledEmployees"
                      label="장애인 고용 인원"
                      value={input.disabledEmployees}
                      onChange={handleNumericInputChange('disabledEmployees')}
                      maxValue={input.employmentIncrease}
                      suffix="명"
                      helpText="장애인 정규직, 1인당 180만원 공제"
                    />
                  </div>
                </TabsContent>

                {/* 기타 탭 */}
                <TabsContent value="others" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NumberInput
                      id="charitableDonation"
                      label="공익법인 기부금"
                      value={input.charitableDonation}
                      onChange={handleNumericInputChange('charitableDonation')}
                      helpText="공익법인 등에 지급하는 기부금 (전액 손금산입)"
                    />

                    <NumberInput
                      id="foreignTaxCredit"
                      label="외국납부세액공제"
                      value={input.foreignTaxCredit}
                      onChange={handleNumericInputChange('foreignTaxCredit')}
                      maxValue={input.previousYearTax}
                      helpText="외국에서 납부한 법인세액"
                    />

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isStartup"
                        checked={input.isStartup}
                        onCheckedChange={(checked) => handleInputChange('isStartup', checked)}
                      />
                      <Label htmlFor="isStartup">창업기업 여부</Label>
                    </div>

                    {input.isStartup && (
                      <NumberInput
                        id="startupYears"
                        label="창업 후 경과년수"
                        value={input.startupYears}
                        onChange={handleNumericInputChange('startupYears')}
                        maxValue={10}
                        warningThreshold={5}
                        suffix="년"
                        helpText="창업 후 5년 이내 50% 세액공제"
                        warningText="5년 초과 시 창업기업 세액공제 불가"
                      />
                    )}
                  </div>

                  {/* 창업기업 혜택 안내 */}
                  {input.isStartup && getSmallBusinessStatus().isSmallBusiness && (
                    <Alert className="border-purple-200 bg-purple-50">
                      <Lightbulb className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-700">
                        <strong>창업기업 혜택:</strong> 중소기업이면서 창업 후 5년 이내일 때 법인세의 50% 세액공제 (최대 10억원)
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              {/* 버튼 영역 */}
              <div className="flex flex-wrap gap-3">
                {/* 🔥 개선된 계산하기 버튼 */}
                <Button
                  onClick={calculateTax}
                  disabled={isCalculating || !validation.isValid}
                  className={`flex items-center space-x-2 transition-all duration-200 transform
                    ${!validation.isValid ? 
                      'bg-gray-400 cursor-not-allowed' :
                      isCalculating ? 'animate-pulse' :
                      'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    }
                  `}
                >
                  <Calculator className="h-4 w-4" />
                  <span>
                    {isCalculating ? '계산 중...' : 
                     !validation.isValid ? '입력값 확인 필요' :
                     (result ? '재계산하기' : '법인세 계산')
                    }
                  </span>
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
                    <Target className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    샘플 데이터
                  </span>
                </Button>
                
                {/* 🔥 개선된 초기화 버튼 */}
                <Button 
                  variant="outline" 
                  onClick={resetInput}
                  className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                    hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-md
                    relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                    초기화
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 결과 영역 */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* 중소기업 판정 결과 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>중소기업 판정 결과</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      {result.isSmallBusiness ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-semibold">
                        {result.isSmallBusiness ? '중소기업' : '일반기업'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        {result.smallBusinessCriteria.salesCheck ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>매출액 기준</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {result.smallBusinessCriteria.assetCheck ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>자산총액 기준</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {result.smallBusinessCriteria.employeeCheck ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>직원수 기준</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 세액 계산 결과 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>법인세 계산 결과</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">총수입금액</p>
                        <p className="text-lg font-semibold">{Math.round(result.grossIncome).toLocaleString('ko-KR')}원</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">총비용</p>
                        <p className="text-lg font-semibold">{Math.round(result.totalExpenses).toLocaleString('ko-KR')}원</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">과세표준</p>
                        <p className="text-lg font-semibold">{Math.round(result.taxableIncome).toLocaleString('ko-KR')}원</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">세액공제 전 법인세</p>
                        <p className="text-lg font-semibold">{Math.round(result.taxBeforeCredits).toLocaleString('ko-KR')}원</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-semibold">세액공제 내역</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>연구개발비:</span>
                          <span>{Math.round(result.taxCredits.rdCredit).toLocaleString('ko-KR')}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>설비투자:</span>
                          <span>{Math.round(result.taxCredits.equipmentCredit).toLocaleString('ko-KR')}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>고용증대:</span>
                          <span>{Math.round(result.taxCredits.employmentCredit).toLocaleString('ko-KR')}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>창업기업:</span>
                          <span>{Math.round(result.taxCredits.startupCredit).toLocaleString('ko-KR')}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>외국납부세액:</span>
                          <span>{Math.round(result.taxCredits.foreignCredit).toLocaleString('ko-KR')}원</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>총 세액공제:</span>
                          <span>{Math.round(result.taxCredits.totalCredits).toLocaleString('ko-KR')}원</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">최종 법인세:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {Math.round(result.finalTax).toLocaleString('ko-KR')}원
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>지방소득세 (10%):</span>
                        <span className="font-semibold">{Math.round(result.localIncomeTax).toLocaleString('ko-KR')}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">총 납부세액:</span>
                        <span className="text-xl font-bold text-red-600">
                          {Math.round(result.totalTax).toLocaleString('ko-KR')}원
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>실효세율:</span>
                        <span>{(result.effectiveRate * 100).toFixed(2)}%</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">중간예납세액</p>
                        <p className="font-semibold">{Math.round(result.interimPayment).toLocaleString('ko-KR')}원</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">추가 납부세액</p>
                        <p className="font-semibold">{Math.round(result.finalPayment).toLocaleString('ko-KR')}원</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 신고 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>신고 및 납부 정보</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>신고기한:</span>
                      <span className="font-semibold">{result.filingInfo.filingDeadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>중간예납 기한:</span>
                      <span className="font-semibold">{result.filingInfo.interimDeadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>분할납부:</span>
                      <span className="font-semibold">
                        {result.filingInfo.canInstallment ? 
                          `가능 (최대 ${result.filingInfo.maxInstallments}회)` : 
                          '불가능'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 절세 조언 */}
              {result.taxSavingAdvice.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5" />
                      <span>절세 조언</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.taxSavingAdvice.map((advice, index) => (
                        <Alert key={index}>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-2">
                              <div className="font-semibold">{advice.type}</div>
                              <div className="text-sm">{advice.description}</div>
                              {advice.expectedSaving > 0 && (
                                <div className="text-sm font-semibold text-green-600">
                                  예상 절세액: {Math.round(advice.expectedSaving).toLocaleString('ko-KR')}원
                                </div>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>좌측에서 법인 정보를 입력하고 계산 버튼을 클릭하세요.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 🧪 베타테스트 피드백 시스템 */}
      <BetaFeedbackForm 
        calculatorName="법인세 계산기"
        calculatorType="corporate-tax"
        className="mb-6"
      />

      {/* 하단 면책 조항 */}
      <TaxCalculatorDisclaimer variant="full" />
    </div>
  );
};

export default CorporateTaxCalculatorComponent; 