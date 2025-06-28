'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Calculator,
  Clock,
  Shield,
  Target,
  Info,
  RefreshCw
} from 'lucide-react';
import { BusinessInheritanceInput, BusinessInheritanceResult, PracticalChecklist } from '@/types/tax-calculator.types';
import { BusinessInheritanceCalculator } from '@/lib/utils/business-inheritance-calculations';
import BusinessInheritanceManagementSystem from './BusinessInheritanceManagementSystem';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';
import { BetaFeedbackForm } from '@/components/ui/beta-feedback-form';

const BusinessInheritanceCalculatorComponent: React.FC = () => {
  const [inputs, setInputs] = useState<BusinessInheritanceInput>({
    // 기본 상속 정보
    totalInheritanceValue: 0,
    businessAssetValue: 0,
    personalAssetValue: 0,
    debtsAndExpenses: 0,
    
    // 가업 정보
    businessType: 'small',
    businessPeriod: 0,
    employeeCount: 0,
    annualRevenue: 0,
    
    // 상속인 정보
    inheritorsCount: 1,
    spouseExists: false,
    directDescendants: 0,
    relationshipToDeceased: 'child',
    
    // 사후관리 계획
    continuousManagement: false,
    employmentMaintenance: false,
    businessLocationMaintenance: false,
    
    // 기타 공제
    hasDisabledPerson: false,
    hasElderlyPerson: false,
    hasMinorChildren: false
  });

  const [result, setResult] = useState<BusinessInheritanceResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [checklist, setChecklist] = useState<PracticalChecklist | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  // 🔥 고도화된 자동 연계 계산 로직
  
  // 1. 순 상속재산 자동 계산
  const netInheritanceValue = useMemo(() => {
    return Math.max(0, inputs.totalInheritanceValue - inputs.debtsAndExpenses);
  }, [inputs.totalInheritanceValue, inputs.debtsAndExpenses]);

  // 2. 가업승계 대상 자산 비율 자동 계산
  const businessAssetRatio = useMemo(() => {
    if (inputs.totalInheritanceValue === 0) return 0;
    return (inputs.businessAssetValue / inputs.totalInheritanceValue) * 100;
  }, [inputs.businessAssetValue, inputs.totalInheritanceValue]);

  // 3. 가업승계 요건 자동 판정
  const successionRequirements = useMemo(() => {
    const requirements = {
      businessPeriodCheck: inputs.businessPeriod >= 10, // 10년 이상 영위
      businessAssetRatioCheck: businessAssetRatio >= 50, // 가업용 자산 50% 이상
      employeeCountCheck: inputs.employeeCount >= 10, // 직원 10명 이상
      revenueCheck: inputs.annualRevenue >= 300000000, // 연매출 3억원 이상
      successionPlanCheck: inputs.continuousManagement && inputs.employmentMaintenance, // 사후관리 계획
    };

    const passedCount = Object.values(requirements).filter(Boolean).length;
    const totalCount = Object.keys(requirements).length;

    return {
      ...requirements,
      overallScore: (passedCount / totalCount) * 100,
      isQualified: passedCount >= 4 // 5개 중 4개 이상 충족
    };
  }, [inputs, businessAssetRatio]);

  // 4. 상속세 공제한도 자동 계산
  const inheritanceDeductions = useMemo(() => {
    const basicDeduction = 200000000; // 기초공제 2억원
    let personalDeduction = 0;

    // 인적공제 계산
    if (inputs.spouseExists) personalDeduction += 500000000; // 배우자 5억원
    personalDeduction += inputs.directDescendants * 50000000; // 직계비속 1인당 5천만원
    
    // 추가 공제
    let additionalDeduction = 0;
    if (inputs.hasDisabledPerson) additionalDeduction += 10000000; // 장애인 1천만원
    if (inputs.hasElderlyPerson) additionalDeduction += 50000000; // 경로우대 5천만원
    if (inputs.hasMinorChildren) additionalDeduction += 50000000; // 미성년자 5천만원

    const totalDeduction = basicDeduction + personalDeduction + additionalDeduction;

    return {
      basicDeduction,
      personalDeduction,
      additionalDeduction,
      totalDeduction
    };
  }, [inputs]);

  // 5. 가업승계 공제 자동 계산 (2024년 기준)
  const businessSuccessionDeduction = useMemo(() => {
    if (!successionRequirements.isQualified) return 0;

    let maxDeduction = 0;
    
    // 중소기업 vs 중견기업 기준
    const isSmallBusiness = inputs.annualRevenue <= 12000000000 && inputs.employeeCount <= 300;
    
    if (isSmallBusiness) {
      // 중소기업: 최대 300억원 (100% 공제)
      maxDeduction = Math.min(inputs.businessAssetValue, 30000000000);
    } else {
      // 중견기업: 최대 200억원 (80% 공제)
      maxDeduction = Math.min(inputs.businessAssetValue * 0.8, 20000000000);
    }

    return maxDeduction;
  }, [inputs, successionRequirements.isQualified]);

  // 6. 예상 상속세 자동 계산
  const estimatedInheritanceTax = useMemo(() => {
    const taxableAmount = Math.max(0, netInheritanceValue - inheritanceDeductions.totalDeduction - businessSuccessionDeduction);
    
    if (taxableAmount === 0) return 0;

    // 2024년 상속세율 구간별 계산
    let tax = 0;
    if (taxableAmount <= 100000000) { // 1억원 이하
      tax = taxableAmount * 0.1;
    } else if (taxableAmount <= 500000000) { // 5억원 이하
      tax = 10000000 + (taxableAmount - 100000000) * 0.2;
    } else if (taxableAmount <= 1000000000) { // 10억원 이하
      tax = 90000000 + (taxableAmount - 500000000) * 0.3;
    } else if (taxableAmount <= 3000000000) { // 30억원 이하
      tax = 240000000 + (taxableAmount - 1000000000) * 0.4;
    } else { // 30억원 초과
      tax = 1040000000 + (taxableAmount - 3000000000) * 0.5;
    }

    return Math.round(tax);
  }, [netInheritanceValue, inheritanceDeductions.totalDeduction, businessSuccessionDeduction]);

  // 7. 세금 절약 효과 자동 계산
  const taxSavingEffect = useMemo(() => {
    // 가업승계 공제 없을 때의 세금
    const taxWithoutSuccession = (() => {
      const taxableAmount = Math.max(0, netInheritanceValue - inheritanceDeductions.totalDeduction);
      if (taxableAmount === 0) return 0;
      
      let tax = 0;
      if (taxableAmount <= 100000000) {
        tax = taxableAmount * 0.1;
      } else if (taxableAmount <= 500000000) {
        tax = 10000000 + (taxableAmount - 100000000) * 0.2;
      } else if (taxableAmount <= 1000000000) {
        tax = 90000000 + (taxableAmount - 500000000) * 0.3;
      } else if (taxableAmount <= 3000000000) {
        tax = 240000000 + (taxableAmount - 1000000000) * 0.4;
      } else {
        tax = 1040000000 + (taxableAmount - 3000000000) * 0.5;
      }
      return Math.round(tax);
    })();

    const savingAmount = taxWithoutSuccession - estimatedInheritanceTax;
    const savingRate = taxWithoutSuccession > 0 ? (savingAmount / taxWithoutSuccession) * 100 : 0;

    return {
      originalTax: taxWithoutSuccession,
      reducedTax: estimatedInheritanceTax,
      savingAmount,
      savingRate
    };
  }, [netInheritanceValue, inheritanceDeductions.totalDeduction, estimatedInheritanceTax]);

  const updateInput = useCallback((field: keyof BusinessInheritanceInput, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const validateInputs = useCallback((): boolean => {
    if (inputs.totalInheritanceValue <= 0) {
      setError('총 상속재산 가액을 입력해주세요.');
      return false;
    }
    if (inputs.businessAssetValue <= 0) {
      setError('가업용 자산 가액을 입력해주세요.');
      return false;
    }
    if (inputs.businessPeriod < 0) {
      setError('업력을 정확히 입력해주세요.');
      return false;
    }
    if (inputs.employeeCount < 0) {
      setError('종업원 수를 정확히 입력해주세요.');
      return false;
    }
    return true;
  }, [inputs]);

  const handleCalculate = useCallback(async () => {
    if (!validateInputs()) return;

    setIsCalculating(true);
    setError('');

    try {
      const calculationResult = BusinessInheritanceCalculator.calculate(inputs);
      const checklistResult = BusinessInheritanceCalculator.generatePracticalChecklist(inputs);
      setResult(calculationResult);
      setChecklist(checklistResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '계산 중 오류가 발생했습니다.');
    } finally {
      setIsCalculating(false);
    }
  }, [inputs, validateInputs]);

  const handleReset = () => {
    setInputs({
      totalInheritanceValue: 0,
      businessAssetValue: 0,
      personalAssetValue: 0,
      debtsAndExpenses: 0,
      businessType: 'small',
      businessPeriod: 0,
      employeeCount: 0,
      annualRevenue: 0,
      inheritorsCount: 1,
      spouseExists: false,
      directDescendants: 0,
      relationshipToDeceased: 'child',
      continuousManagement: false,
      employmentMaintenance: false,
      businessLocationMaintenance: false,
      hasDisabledPerson: false,
      hasElderlyPerson: false,
      hasMinorChildren: false
    });
    setResult(null);
    setError('');
    setChecklist(null);
    setShowDetailedAnalysis(false);
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getWarningBadgeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      default: return 'secondary';
    }
  };

  const getImportanceBadgeColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'destructive';
      case 'important': return 'default';
      case 'optional': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 헤더 강화 */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full">
          <Building2 className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">가업상속 특례 계산 (2024년 기준)</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          가업상속세금 계산기
          <span className="text-2xl block mt-2 text-blue-600 font-normal">
            실무용 고도화 시스템
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          중소기업과 중견기업의 <strong className="text-purple-600">가업상속공제</strong>를 적용한 상속세 계산과 
          <strong className="text-blue-600">10년 사후관리 시스템</strong>을 통합 제공합니다.<br />
          실무에서 바로 활용 가능한 <strong className="text-green-600">체크리스트</strong>, 
          <strong className="text-orange-600">리스크 관리</strong>, 
          <strong className="text-red-600">일정 관리</strong> 기능을 지원합니다.
        </p>
        
        {/* 실무 특징 강조 */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Badge variant="outline" className="text-sm px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            실무 검증된 계산식
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2">
            <Calendar className="w-4 h-4 mr-2" />
            10년 일정 자동 관리
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2">
            <AlertTriangle className="w-4 h-4 mr-2" />
            실시간 리스크 모니터링
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            전문가 상담 연결
          </Badge>
        </div>
      </div>

      {/* 250자 요약 면책 조항 */}
      <TaxCalculatorDisclaimer variant="summary" />

      {/* 🔥 스마트 자동 계산 대시보드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            <span>⚡ 스마트 가업승계 자동 계산 대시보드</span>
          </CardTitle>
          <CardDescription>
            입력하는 즉시 가업승계 요건, 공제액, 절세효과가 자동으로 분석됩니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* 순 상속재산 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-1">💰 순 상속재산 (자동계산)</div>
              <div className="text-xl font-bold text-blue-800">
                {formatCurrency(netInheritanceValue)}원
              </div>
              <div className="text-xs text-gray-500 mt-1">총재산 - 채무</div>
              {netInheritanceValue === 0 && (
                <div className="text-xs text-orange-500 mt-1">⚠️ 상속재산 없음</div>
              )}
            </div>

            {/* 가업자산 비율 */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
              <div className="text-xs text-purple-600 font-medium mb-1">📊 가업자산 비율 (자동계산)</div>
              <div className="text-xl font-bold text-purple-800">
                {businessAssetRatio.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">가업자산 ÷ 총재산</div>
              <div className={`text-xs mt-1 ${businessAssetRatio >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                {businessAssetRatio >= 50 ? '✅ 요건 충족' : '❌ 50% 미달'}
              </div>
            </div>

            {/* 가업승계 공제액 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="text-xs text-green-600 font-medium mb-1">🎯 가업승계 공제 (자동계산)</div>
              <div className="text-xl font-bold text-green-800">
                {formatCurrency(businessSuccessionDeduction)}원
              </div>
              <div className="text-xs text-gray-500 mt-1">
                최대 {inputs.businessType === 'small' ? '300억' : '500억'}원
              </div>
              {!successionRequirements.isQualified && (
                <div className="text-xs text-red-500 mt-1">❌ 요건 미충족</div>
              )}
            </div>

            {/* 예상 상속세 */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <div className="text-xs text-orange-600 font-medium mb-1">💳 예상 상속세 (자동계산)</div>
              <div className="text-xl font-bold text-orange-800">
                {formatCurrency(estimatedInheritanceTax)}원
              </div>
              <div className="text-xs text-gray-500 mt-1">가업승계 적용</div>
              {estimatedInheritanceTax === 0 && (
                <div className="text-xs text-green-500 mt-1">✅ 납부세액 없음</div>
              )}
            </div>
          </div>

          {/* 가업승계 요건 체크 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <h4 className="text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
              📋 가업승계 요건 자동 체크 
              <Badge variant={successionRequirements.isQualified ? "secondary" : "destructive"} className="text-xs">
                {successionRequirements.overallScore.toFixed(0)}점 / 100점
              </Badge>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className={`flex items-center space-x-2 text-sm ${successionRequirements.businessPeriodCheck ? 'text-green-700' : 'text-red-700'}`}>
                {successionRequirements.businessPeriodCheck ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>업력 10년 이상: {inputs.businessPeriod}년</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${successionRequirements.businessAssetRatioCheck ? 'text-green-700' : 'text-red-700'}`}>
                {successionRequirements.businessAssetRatioCheck ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>가업자산 50% 이상: {businessAssetRatio.toFixed(1)}%</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${successionRequirements.employeeCountCheck ? 'text-green-700' : 'text-red-700'}`}>
                {successionRequirements.employeeCountCheck ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>직원 10명 이상: {inputs.employeeCount}명</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${successionRequirements.revenueCheck ? 'text-green-700' : 'text-red-700'}`}>
                {successionRequirements.revenueCheck ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>연매출 3억 이상: {formatCurrency(inputs.annualRevenue)}원</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${successionRequirements.successionPlanCheck ? 'text-green-700' : 'text-red-700'}`}>
                {successionRequirements.successionPlanCheck ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>사후관리 계획: {inputs.continuousManagement && inputs.employmentMaintenance ? '완료' : '미완료'}</span>
              </div>
            </div>
          </div>

          {/* 세금 절약 효과 */}
          {taxSavingEffect.savingAmount > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-3">💰 세금 절약 효과 (자동 계산)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">일반 상속세:</span>
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency(taxSavingEffect.originalTax)}원
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">가업승계 적용세:</span>
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(taxSavingEffect.reducedTax)}원
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">절약 효과:</span>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(taxSavingEffect.savingAmount)}원
                  </div>
                  <div className="text-xs text-green-700">
                    ({taxSavingEffect.savingRate.toFixed(1)}% 절약)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 상속세 공제 내역 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">📋 상속세 공제 내역 (자동 계산)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">기초공제:</span>
                <div className="font-medium text-blue-700">
                  {formatCurrency(inheritanceDeductions.basicDeduction)}원
                </div>
              </div>
              <div>
                <span className="text-gray-600">인적공제:</span>
                <div className="font-medium text-blue-700">
                  {formatCurrency(inheritanceDeductions.personalDeduction)}원
                </div>
              </div>
              <div>
                <span className="text-gray-600">추가공제:</span>
                <div className="font-medium text-blue-700">
                  {formatCurrency(inheritanceDeductions.additionalDeduction)}원
                </div>
              </div>
              <div>
                <span className="text-gray-600">총 공제:</span>
                <div className="font-medium text-blue-700">
                  {formatCurrency(inheritanceDeductions.totalDeduction)}원
                </div>
              </div>
            </div>
          </div>

          {/* 실시간 분석 요약 */}
          {(inputs.totalInheritanceValue > 0 || inputs.businessAssetValue > 0) && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <h4 className="text-sm font-semibold text-yellow-800 mb-3">📊 실시간 분석 요약</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">기업 분류:</span>
                  <span className="ml-2 font-medium">
                    {inputs.businessType === 'small' ? '중소기업' : '중견기업'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">요건 충족률:</span>
                  <span className="ml-2 font-medium text-purple-600">
                    {successionRequirements.overallScore.toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">예상 절세율:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {taxSavingEffect.savingRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 주요 특징 강화 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-purple-200 bg-purple-50 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-900">최대 500억 공제</h3>
            <p className="text-sm text-purple-700">중견기업 기준 최대 500억원</p>
            <div className="text-xs text-purple-600 mt-1 font-medium">중소기업 300억</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-900">10년 사후관리</h3>
            <p className="text-sm text-blue-700">계속 경영 및 고용 유지</p>
            <div className="text-xs text-blue-600 mt-1 font-medium">자동 일정 관리</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900">대폭 절세</h3>
            <p className="text-sm text-green-700">일반 상속세 대비 최대 90%</p>
            <div className="text-xs text-green-600 mt-1 font-medium">실시간 계산</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-orange-900">리스크 관리</h3>
            <p className="text-sm text-orange-700">위험 요소 실시간 모니터링</p>
            <div className="text-xs text-orange-600 mt-1 font-medium">예방 중심 관리</div>
          </CardContent>
        </Card>
      </div>

      {/* 실무 가이드라인 강화 */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-center mb-6 text-blue-900">
            🎯 실무 활용 가이드라인 (2024년 기준)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                📋 사전 준비사항
              </h4>
              <ul className="text-sm space-y-2 text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>3년 이상 업력 확인 (사업자등록증 기준)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>중소·중견기업 해당성 검토 (매출액·자산·인원 기준)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>가업용 자산 정확한 평가 (감정평가서 필수)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>고용현황 정리 (4대보험 가입자 기준)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>최근 3년간 재무제표 준비</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                ⚠️ 핵심 주의사항
              </h4>
              <ul className="text-sm space-y-2 text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>10년간 사후관리 의무 (위반 시 전액 추징)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>계속경영 의무 (사업 중단 금지)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>고용유지 의무 (10명 이상 시 80% 유지)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>매년 3월 31일 사후관리신고 필수</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>전문가 상담 및 관리 체계 구축</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                🚀 성공 전략
              </h4>
              <ul className="text-sm space-y-2 text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>전문 세무사와 10년 관리계약</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>월별 고용현황 모니터링</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>연간 컴플라이언스 점검</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>비상 상황 대응 매뉴얼 작성</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>경영승계 계획 수립</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* 추가 실무 팁 */}
          <Separator className="my-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong className="text-blue-800">💡 실무 팁:</strong> 
                가업상속공제 신청 전 "가업상속공제 사전심사제도"를 활용하여 
                적격성을 미리 확인받을 수 있습니다.
              </AlertDescription>
            </Alert>
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong className="text-blue-800">⏰ 일정 관리:</strong> 
                매년 1월부터 사후관리 준비를 시작하여 3월 31일 
                신고 마감일을 여유있게 대비하세요.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* 입력 폼 */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">기본정보</TabsTrigger>
          <TabsTrigger value="business">가업정보</TabsTrigger>
          <TabsTrigger value="heirs">상속인</TabsTrigger>
          <TabsTrigger value="management">사후관리</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                상속재산 정보
              </CardTitle>
              <CardDescription>상속받을 재산의 가액을 입력해주세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {/* 🔴 개선된 라벨 (필수 필드 강조) */}
                  <Label htmlFor="totalInheritanceValue" className={`
                    flex items-center gap-2 text-sm font-medium
                    ${!inputs.totalInheritanceValue || inputs.totalInheritanceValue === 0 ? 'text-red-700 font-semibold' : 'text-green-700 font-semibold'}
                  `}>
                    <span>💰 총 상속재산 가액 (원)</span>
                    
                    {/* 🔴 필수 표시 강화 */}
                    <div className="flex items-center gap-1">
                      <span className="text-red-500 text-lg font-bold">*</span>
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300 px-1 py-0">
                        필수
                      </Badge>
                    </div>
                    
                    {/* ✅ 완료 표시 */}
                    {inputs.totalInheritanceValue > 0 && (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                        ✅ 완료
                      </Badge>
                    )}
                  </Label>
                  
                  {/* 🔴 개선된 입력 필드 */}
                  <div className="relative">
                    <Input
                      id="totalInheritanceValue"
                      type="text"
                      inputMode="numeric"
                      value={inputs.totalInheritanceValue || ''}
                      onChange={(e) => updateInput('totalInheritanceValue', Math.round(Number(e.target.value)))}
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
                      placeholder="예: 5000000000 (필수)"
                      autoComplete="off"
                      className={`
                        ${!inputs.totalInheritanceValue || inputs.totalInheritanceValue === 0 ? 
                          'border-red-400 border-2 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' :
                          'border-green-500 bg-green-50 focus:border-green-500'}
                        text-right font-mono transition-all duration-200
                      `}
                    />
                    
                    {/* 🔴 필수 필드 시각적 표시 */}
                    {(!inputs.totalInheritanceValue || inputs.totalInheritanceValue === 0) && (
                      <div className="absolute -right-2 -top-2">
                        <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                          !
                        </span>
                      </div>
                    )}
                    
                    {/* ✅ 완료 표시 */}
                    {inputs.totalInheritanceValue > 0 && (
                      <div className="absolute -right-2 -top-2">
                        <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-green-500 rounded-full">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* 🔴 필수 필드 오류 메시지 */}
                  {(!inputs.totalInheritanceValue || inputs.totalInheritanceValue === 0) && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      <div className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">⚠️</span>
                        <span>총 상속재산 가액은 필수 입력 항목입니다.</span>
                        <Badge variant="destructive" className="text-xs ml-2">
                          REQUIRED
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {/* 🔴 필수 필드 완료 안내 */}
                  {inputs.totalInheritanceValue > 0 && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                      ✅ 필수 입력이 완료되었습니다: {formatCurrency(inputs.totalInheritanceValue)}원
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {/* 🔴 개선된 라벨 (필수 필드 강조) */}
                  <Label htmlFor="businessAssetValue" className={`
                    flex items-center gap-2 text-sm font-medium
                    ${!inputs.businessAssetValue || inputs.businessAssetValue === 0 ? 'text-red-700 font-semibold' : 'text-green-700 font-semibold'}
                  `}>
                    <span>🏢 가업용 자산 가액 (원)</span>
                    
                    {/* 🔴 필수 표시 강화 */}
                    <div className="flex items-center gap-1">
                      <span className="text-red-500 text-lg font-bold">*</span>
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300 px-1 py-0">
                        필수
                      </Badge>
                    </div>
                    
                    {/* ✅ 완료 표시 */}
                    {inputs.businessAssetValue > 0 && (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                        ✅ 완료
                      </Badge>
                    )}
                  </Label>
                  
                  {/* 🔴 개선된 입력 필드 */}
                  <div className="relative">
                    <Input
                      id="businessAssetValue"
                      type="text"
                      inputMode="numeric"
                      value={inputs.businessAssetValue || ''}
                      onChange={(e) => updateInput('businessAssetValue', Math.round(Number(e.target.value)))}
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
                      placeholder="예: 4000000000 (필수)"
                      autoComplete="off"
                      className={`
                        ${!inputs.businessAssetValue || inputs.businessAssetValue === 0 ? 
                          'border-red-400 border-2 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' :
                          'border-green-500 bg-green-50 focus:border-green-500'}
                        text-right font-mono transition-all duration-200
                      `}
                    />
                    
                    {/* 🔴 필수 필드 시각적 표시 */}
                    {(!inputs.businessAssetValue || inputs.businessAssetValue === 0) && (
                      <div className="absolute -right-2 -top-2">
                        <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                          !
                        </span>
                      </div>
                    )}
                    
                    {/* ✅ 완료 표시 */}
                    {inputs.businessAssetValue > 0 && (
                      <div className="absolute -right-2 -top-2">
                        <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-green-500 rounded-full">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* 🔴 필수 필드 오류 메시지 */}
                  {(!inputs.businessAssetValue || inputs.businessAssetValue === 0) && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      <div className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">⚠️</span>
                        <span>가업용 자산 가액은 필수 입력 항목입니다.</span>
                        <Badge variant="destructive" className="text-xs ml-2">
                          REQUIRED
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {/* 🔴 필수 필드 완료 안내 */}
                  {inputs.businessAssetValue > 0 && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                      ✅ 필수 입력이 완료되었습니다: {formatCurrency(inputs.businessAssetValue)}원
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="personalAssetValue">개인 자산 가액 (원)</Label>
                  <Input
                    id="personalAssetValue"
                    type="text"
                    inputMode="numeric"
                    value={inputs.personalAssetValue || ''}
                    onChange={(e) => updateInput('personalAssetValue', Math.round(Number(e.target.value)))}
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
                    placeholder="예: 1000000000"
                    autoComplete="off"
                    className="text-right font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="debtsAndExpenses">채무 및 공과금 (원)</Label>
                  <Input
                    id="debtsAndExpenses"
                    type="text"
                    inputMode="numeric"
                    value={inputs.debtsAndExpenses || ''}
                    onChange={(e) => updateInput('debtsAndExpenses', Math.round(Number(e.target.value)))}
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
                    placeholder="예: 200000000"
                    autoComplete="off"
                    className="text-right font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                가업 정보
              </CardTitle>
              <CardDescription>가업상속공제를 받을 사업체의 정보를 입력해주세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessType">기업 구분</Label>
                  <Select value={inputs.businessType} onValueChange={(value) => updateInput('businessType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="기업 구분 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">중소기업 (공제한도 300억)</SelectItem>
                      <SelectItem value="medium">중견기업 (공제한도 500억)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  {/* 🔴 개선된 라벨 (필수 필드 강조) */}
                  <Label htmlFor="businessPeriod" className={`
                    flex items-center gap-2 text-sm font-medium
                    ${inputs.businessPeriod < 10 ? 'text-red-700 font-semibold' : 'text-green-700 font-semibold'}
                  `}>
                    <span>📅 업력 (년)</span>
                    
                    {/* 🔴 필수 표시 강화 */}
                    <div className="flex items-center gap-1">
                      <span className="text-red-500 text-lg font-bold">*</span>
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300 px-1 py-0">
                        10년 이상 필수
                      </Badge>
                    </div>
                    
                    {/* ✅ 완료 표시 */}
                    {inputs.businessPeriod >= 10 && (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                        ✅ 요건 충족
                      </Badge>
                    )}
                  </Label>
                  
                  {/* 🔴 개선된 입력 필드 */}
                  <div className="relative">
                    <Input
                      id="businessPeriod"
                      type="text"
                      inputMode="numeric"
                      value={inputs.businessPeriod || ''}
                      onChange={(e) => updateInput('businessPeriod', Math.round(Number(e.target.value)))}
                      onKeyDown={(e) => {
                        if (e.ctrlKey || e.metaKey) return;
                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
                        const isNumber = /^[0-9]$/.test(e.key);
                        if (!allowedKeys.includes(e.key) && !isNumber) e.preventDefault();
                      }}
                      placeholder="예: 10 (10년 이상 필수)"
                      autoComplete="off"
                      className={`
                        ${inputs.businessPeriod < 10 ? 
                          'border-red-400 border-2 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' :
                          'border-green-500 bg-green-50 focus:border-green-500'}
                        text-right font-mono transition-all duration-200
                      `}
                    />
                    
                    {/* 🔴 필수 필드 시각적 표시 */}
                    {inputs.businessPeriod < 10 && (
                      <div className="absolute -right-2 -top-2">
                        <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                          !
                        </span>
                      </div>
                    )}
                    
                    {/* ✅ 완료 표시 */}
                    {inputs.businessPeriod >= 10 && (
                      <div className="absolute -right-2 -top-2">
                        <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-green-500 rounded-full">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* 🔴 필수 필드 오류 메시지 */}
                  {inputs.businessPeriod < 10 && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      <div className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">⚠️</span>
                        <span>가업승계공제를 위해 업력 10년 이상이 필요합니다.</span>
                        <Badge variant="destructive" className="text-xs ml-2">
                          REQUIRED
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {/* 🔴 필수 필드 완료 안내 */}
                  {inputs.businessPeriod >= 10 && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                      ✅ 가업승계 업력 요건을 충족합니다: {inputs.businessPeriod}년
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="employeeCount">종업원 수 (명)</Label>
                  <Input
                    id="employeeCount"
                    type="text"
                    inputMode="numeric"
                    value={inputs.employeeCount || ''}
                    onChange={(e) => updateInput('employeeCount', Math.round(Number(e.target.value)))}
                    onKeyDown={(e) => {
                      if (e.ctrlKey || e.metaKey) return;
                      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
                      const isNumber = /^[0-9]$/.test(e.key);
                      if (!allowedKeys.includes(e.key) && !isNumber) e.preventDefault();
                    }}
                    placeholder="예: 50"
                    autoComplete="off"
                    className="text-right font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="annualRevenue">연간 매출액 (원)</Label>
                  <Input
                    id="annualRevenue"
                    type="text"
                    inputMode="numeric"
                    value={inputs.annualRevenue || ''}
                    onChange={(e) => updateInput('annualRevenue', Math.round(Number(e.target.value)))}
                    onKeyDown={(e) => {
                      if (e.ctrlKey || e.metaKey) return;
                      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
                      const isNumber = /^[0-9]$/.test(e.key);
                      if (!allowedKeys.includes(e.key) && !isNumber) e.preventDefault();
                    }}
                    placeholder="예: 10000000000"
                    autoComplete="off"
                    className="text-right font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heirs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                상속인 정보
              </CardTitle>
              <CardDescription>상속받을 사람들에 대한 정보를 입력해주세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inheritorsCount">상속인 수 (명)</Label>
                  <Input
                    id="inheritorsCount"
                    type="text"
                    inputMode="numeric"
                    value={inputs.inheritorsCount || ''}
                    onChange={(e) => updateInput('inheritorsCount', Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.ctrlKey || e.metaKey) return;
                      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
                      const isNumber = /^[0-9]$/.test(e.key);
                      if (!allowedKeys.includes(e.key) && !isNumber) e.preventDefault();
                    }}
                    placeholder="예: 3"
                    autoComplete="off"
                    className="text-right font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="directDescendants">직계비속 수 (명)</Label>
                  <Input
                    id="directDescendants"
                    type="text"
                    inputMode="numeric"
                    value={inputs.directDescendants || ''}
                    onChange={(e) => updateInput('directDescendants', Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.ctrlKey || e.metaKey) return;
                      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
                      const isNumber = /^[0-9]$/.test(e.key);
                      if (!allowedKeys.includes(e.key) && !isNumber) e.preventDefault();
                    }}
                    placeholder="예: 2"
                    autoComplete="off"
                    className="text-right font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="relationshipToDeceased">피상속인과의 관계</Label>
                  <Select value={inputs.relationshipToDeceased} onValueChange={(value) => updateInput('relationshipToDeceased', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="관계 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">배우자</SelectItem>
                      <SelectItem value="child">자녀</SelectItem>
                      <SelectItem value="parent">부모</SelectItem>
                      <SelectItem value="sibling">형제자매</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">추가 공제 대상</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="spouseExists"
                      checked={inputs.spouseExists}
                      onCheckedChange={(checked) => updateInput('spouseExists', checked)}
                    />
                    <Label htmlFor="spouseExists">배우자 존재</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasElderlyPerson"
                      checked={inputs.hasElderlyPerson}
                      onCheckedChange={(checked) => updateInput('hasElderlyPerson', checked)}
                    />
                    <Label htmlFor="hasElderlyPerson">65세 이상 상속인</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasDisabledPerson"
                      checked={inputs.hasDisabledPerson}
                      onCheckedChange={(checked) => updateInput('hasDisabledPerson', checked)}
                    />
                    <Label htmlFor="hasDisabledPerson">장애인 상속인</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasMinorChildren"
                      checked={inputs.hasMinorChildren}
                      onCheckedChange={(checked) => updateInput('hasMinorChildren', checked)}
                    />
                    <Label htmlFor="hasMinorChildren">미성년자 상속인</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                사후관리 계획
              </CardTitle>
              <CardDescription>가업상속공제 사후관리 의무사항에 대한 계획을 입력해주세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  가업상속공제를 받은 후 10년간 아래 의무사항을 준수해야 합니다. 
                  위반 시 공제받은 세액의 일부를 추가 납부해야 할 수 있습니다.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="continuousManagement"
                    checked={inputs.continuousManagement}
                    onCheckedChange={(checked) => updateInput('continuousManagement', checked)}
                  />
                  <Label htmlFor="continuousManagement">계속 경영 의사 (필수)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="employmentMaintenance"
                    checked={inputs.employmentMaintenance}
                    onCheckedChange={(checked) => updateInput('employmentMaintenance', checked)}
                  />
                  <Label htmlFor="employmentMaintenance">고용 유지 계획 (종업원 10명 이상 시 필수)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="businessLocationMaintenance"
                    checked={inputs.businessLocationMaintenance}
                    onCheckedChange={(checked) => updateInput('businessLocationMaintenance', checked)}
                  />
                  <Label htmlFor="businessLocationMaintenance">사업장 소재지 유지</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 에러 메시지 */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 계산 버튼 */}
      <div className="flex justify-center space-x-4">
        {/* 🔥 개선된 가업상속세 계산하기 버튼 */}
        <Button
          onClick={handleCalculate}
          disabled={isCalculating || !inputs.businessValue}
          className={`px-8 py-2 transition-all duration-200 transform
            ${!inputs.businessValue ? 
              'bg-gray-400 cursor-not-allowed' :
              isCalculating ? 'animate-pulse' :
              'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
          size="lg"
        >
          {isCalculating ? (
            <>
              <Calculator className="w-4 h-4 mr-2 animate-spin" />
              계산 중...
            </>
          ) : !inputs.businessValue ? (
            <>
              <Calculator className="w-4 h-4 mr-2 opacity-50" />
              사업체 가치 입력 필요
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              {result ? '재계산하기' : '가업상속세 계산하기'}
            </>
          )}
        </Button>
        
        {/* 🔥 개선된 입력 초기화 버튼 */}
        <Button 
          variant="outline" 
          onClick={handleReset} 
          size="lg"
          className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
            hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-md
            relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <span className="relative flex items-center">
            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            입력 초기화
          </span>
        </Button>
      </div>

      {/* 계산 결과 */}
      {result && (
        <div className="space-y-6">
          <Separator />
          
          {/* 적격성 검토 결과 */}
          {result.breakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  적격성 검토 결과
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 주의사항 및 경고 */}
                {result.breakdown && result.breakdown.steps.length > 0 && (
                  <div className="space-y-3">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>가업상속공제 적격성 검토를 완료했습니다.</strong> 
                        아래 요건을 모두 충족해야 공제 혜택을 받을 수 있습니다.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* 주요 결과 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                계산 결과 요약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.totalTax)}원
                  </div>
                  <div className="text-sm text-gray-600">최종 상속세</div>
                  <div className="text-xs text-blue-700 mt-1">
                    (지방소득세 포함)
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(result.businessInheritanceDeduction)}원
                  </div>
                  <div className="text-sm text-gray-600">가업상속공제액</div>
                  <div className="text-xs text-green-700 mt-1">
                    (최대 {inputs.businessType === 'small' ? '300억' : '500억'})
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-purple-50">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(result.taxSavingAmount)}원
                  </div>
                  <div className="text-sm text-gray-600">절세 효과</div>
                  <div className="text-xs text-purple-700 mt-1">
                    vs 일반 상속세
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-orange-50">
                  <div className="text-2xl font-bold text-orange-600">
                    {result.taxSavingRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">절세율</div>
                  <div className="text-xs text-orange-700 mt-1">
                    세부담 감소 비율
                  </div>
                </div>
              </div>
              
              {/* 일반 상속세 vs 가업상속공제 비교 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-center">💰 세부담 비교 분석</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      일반 상속세: {formatCurrency(result.regularInheritanceTax)}원
                    </div>
                    <div className="text-sm text-gray-600">가업상속공제 미적용 시</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      가업상속세: {formatCurrency(result.totalTax)}원
                    </div>
                    <div className="text-sm text-gray-600">가업상속공제 적용 시</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상세 분석 토글 버튼 */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {showDetailedAnalysis ? '상세 분석 숨기기' : '상세 분석 보기'}
            </Button>
          </div>

          {showDetailedAnalysis && (
            <>
              {/* 실무 체크리스트 */}
              {checklist && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      실무 체크리스트
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="pre-application" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="pre-application">신청 전</TabsTrigger>
                        <TabsTrigger value="during-application">신고 중</TabsTrigger>
                        <TabsTrigger value="post-application">신고 후</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="pre-application" className="mt-4">
                        <div className="space-y-3">
                          {checklist.preApplication.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <div className="mt-0.5">
                                {item.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{item.item}</span>
                                  {item.required && (
                                    <Badge variant="destructive" className="text-xs">필수</Badge>
                                  )}
                                </div>
                                {item.note && (
                                  <div className="text-sm text-gray-600 mt-1">{item.note}</div>
                                )}
                                {item.deadline && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    📅 {item.deadline}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="during-application" className="mt-4">
                        <div className="space-y-3">
                          {checklist.duringApplication.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <div className="mt-0.5">
                                {item.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Clock className="w-5 h-5 text-yellow-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{item.item}</span>
                                  {item.required && (
                                    <Badge variant="destructive" className="text-xs">필수</Badge>
                                  )}
                                </div>
                                {item.note && (
                                  <div className="text-sm text-gray-600 mt-1">{item.note}</div>
                                )}
                                {item.deadline && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    📅 {item.deadline}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="post-application" className="mt-4">
                        <div className="space-y-3">
                          {checklist.postApplication.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <div className="mt-0.5">
                                <Clock className="w-5 h-5 text-blue-500" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{item.item}</span>
                                  {item.required && (
                                    <Badge variant="destructive" className="text-xs">필수</Badge>
                                  )}
                                </div>
                                {item.note && (
                                  <div className="text-sm text-gray-600 mt-1">{item.note}</div>
                                )}
                                {item.deadline && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    📅 {item.deadline}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* 필요서류 안내 */}
              {checklist && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      필요서류 안내
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {checklist.requiredDocuments.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h4 className="font-semibold mb-3 text-lg border-b pb-2">
                            📋 {category.category}
                          </h4>
                          <div className="space-y-2">
                            {category.documents.map((doc, docIndex) => (
                              <div key={docIndex} className="flex items-start space-x-3 p-2 border rounded">
                                <div className="mt-0.5">
                                  {doc.required ? (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                  ) : (
                                    <Info className="w-4 h-4 text-blue-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{doc.name}</span>
                                    {doc.required && (
                                      <Badge variant="destructive" className="text-xs">필수</Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    용도: {doc.purpose} | 발급기관: {doc.issuer}
                                  </div>
                                  {doc.validityPeriod && (
                                    <div className="text-xs text-orange-600">
                                      유효기간: {doc.validityPeriod}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* 사후관리 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                사후관리 의무사항
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>10년간 사후관리 의무를 철저히 이행해야 합니다.</strong> 
                  위반 시 공제받은 세액의 일부 또는 전액을 추징당할 수 있습니다.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Label className="text-blue-800">관리 기간</Label>
                  <div className="text-lg font-semibold text-blue-900">{result.managementPeriod}년간</div>
                  <div className="text-sm text-blue-700">상속개시일부터 계산</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Label className="text-green-800">고용 유지 의무</Label>
                  <div className="text-lg font-semibold text-green-900">
                    {result.employmentMaintenanceRequired}명 이상
                  </div>
                  <div className="text-sm text-green-700">
                    현재 인원의 80% 수준
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-3 block font-semibold">⚠️ 위반 시 추징 위험도</Label>
                <div className="space-y-3">
                  {result.penaltyRisk.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Badge variant={getRiskBadgeColor(risk.riskLevel)} className="min-w-[60px]">
                          {risk.riskLevel === 'high' ? '높음' : risk.riskLevel === 'medium' ? '보통' : '낮음'}
                        </Badge>
                        <div>
                          <div className="font-medium">{risk.violationType}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">
                          {formatCurrency(risk.penaltyAmount)}원
                        </div>
                        <div className="text-sm text-gray-600">
                          (공제액의 {(risk.penaltyRate * 100).toFixed(0)}% 추징)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 사후관리 추천사항 */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 사후관리 성공 팁</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 매년 3월 31일 사후관리신고서 제출 일정을 미리 캘린더에 등록</li>
                  <li>• 4대보험 가입자 명단을 정기적으로 관리하여 고용현황 추적</li>
                  <li>• 사업장 이전이 필요한 경우 사전에 세무서와 협의</li>
                  <li>• 전문 세무사와 연간 사후관리 점검 서비스 계약 검토</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 분할납부 계획 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                분할납부 계획 (5년 분할)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  상속세가 200만원 이상인 경우 최대 5년간 분할납부가 가능합니다. 
                  분할납부 시 연 2.5% 이자가 발생합니다.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                {result.installmentPlan.map((installment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="min-w-[80px] justify-center">
                        {index + 1}차년도
                      </Badge>
                      <div>
                        <div className="font-medium">납부 예정일: {installment.dueDate}</div>
                        <div className="text-sm text-gray-600">
                          {installment.year}년 납부분
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">
                        {formatCurrency(installment.amount)}원
                      </div>
                      <div className="text-sm text-gray-600">
                        이자율 {(installment.interestRate * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-800">총 납부세액:</span>
                  <span className="text-lg font-bold text-blue-900">
                    {formatCurrency(result.totalTax)}원
                  </span>
                </div>
                <div className="text-sm text-blue-700 mt-2">
                  💡 일시납부 vs 분할납부 총액 차이는 분할납부 이자 수준에 따라 결정됩니다.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 실무 관리 시스템 */}
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Shield className="w-5 h-5" />
                실무 사후관리 시스템
              </CardTitle>
              <CardDescription>
                10년간의 사후관리 의무를 체계적으로 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessInheritanceManagementSystem
                businessData={{
                  businessType: inputs.businessType,
                  businessPeriod: inputs.businessPeriod,
                  employeeCount: inputs.employeeCount,
                  annualRevenue: inputs.annualRevenue,
                  deductionAmount: result.businessInheritanceDeduction,
                  managementStartDate: new Date().toISOString().split('T')[0]
                }}
                onRiskAlert={(risks) => {
                  console.log('위험 알림:', risks);
                }}
                onScheduleUpdate={(schedule) => {
                  console.log('일정 업데이트:', schedule);
                }}
              />
            </CardContent>
          </Card>

          {/* 전문가 조언 */}
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Shield className="w-5 h-5" />
                전문가 조언 및 주의사항
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">🚨 필수 확인사항</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• 본 계산기는 참고용이며, 실제 세무신고 시에는 반드시 전문 세무사 상담 필요</li>
                  <li>• 가업용 자산의 정확한 평가를 위해 감정평가 등 전문기관 평가 권장</li>
                  <li>• 중소기업·중견기업 해당 여부는 매출액, 자산총액, 종업원 수를 종합 판단</li>
                  <li>• 사후관리 기간 중 요건 위반 시 전액 추징 위험이 있으므로 철저한 관리 필요</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ 성공 포인트</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 상속개시 전 미리 가업상속공제 요건 정비 (업력, 고용현황 등)</li>
                  <li>• 전문 세무사와 장기 사후관리 파트너십 구축</li>
                  <li>• 매년 정기적인 요건 충족 현황 점검 및 관리</li>
                  <li>• 사업 확장이나 구조조정 시 가업상속공제 영향도 사전 검토</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📞 추가 상담 권장</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 절세액이 큰 경우: 세무 전문가와 정밀 검토</li>
                  <li>• 복잡한 사업구조: 구조조정을 통한 추가 절세 방안</li>
                  <li>• 가족 경영승계: 중장기 경영승계 계획 수립</li>
                  <li>• 사후관리 부담: 전문기관 위탁관리 서비스 검토</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 🧪 베타테스트 피드백 시스템 */}
      <BetaFeedbackForm 
        calculatorName="사업승계세 계산기"
        calculatorType="business-inheritance-tax"
        className="mt-8"
      />

      {/* 하단 면책 조항 */}
      <TaxCalculatorDisclaimer variant="full" className="mt-6" />
    </div>
  );
};

export default BusinessInheritanceCalculatorComponent; 