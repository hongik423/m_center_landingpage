'use client';

import React, { useState, useCallback } from 'react';
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
  Info
} from 'lucide-react';
import { BusinessInheritanceInput, BusinessInheritanceResult, PracticalChecklist } from '@/types/tax-calculator.types';
import { BusinessInheritanceCalculator } from '@/lib/utils/business-inheritance-calculations';
import BusinessInheritanceManagementSystem from './BusinessInheritanceManagementSystem';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';

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
                <div>
                  <Label htmlFor="totalInheritanceValue">총 상속재산 가액 (원)</Label>
                  <Input
                    id="totalInheritanceValue"
                    type="number"
                    value={inputs.totalInheritanceValue || ''}
                    onChange={(e) => updateInput('totalInheritanceValue', Number(e.target.value))}
                    placeholder="예: 5000000000"
                  />
                </div>
                <div>
                  <Label htmlFor="businessAssetValue">가업용 자산 가액 (원)</Label>
                  <Input
                    id="businessAssetValue"
                    type="number"
                    value={inputs.businessAssetValue || ''}
                    onChange={(e) => updateInput('businessAssetValue', Number(e.target.value))}
                    placeholder="예: 4000000000"
                  />
                </div>
                <div>
                  <Label htmlFor="personalAssetValue">개인 자산 가액 (원)</Label>
                  <Input
                    id="personalAssetValue"
                    type="number"
                    value={inputs.personalAssetValue || ''}
                    onChange={(e) => updateInput('personalAssetValue', Number(e.target.value))}
                    placeholder="예: 1000000000"
                  />
                </div>
                <div>
                  <Label htmlFor="debtsAndExpenses">채무 및 공과금 (원)</Label>
                  <Input
                    id="debtsAndExpenses"
                    type="number"
                    value={inputs.debtsAndExpenses || ''}
                    onChange={(e) => updateInput('debtsAndExpenses', Number(e.target.value))}
                    placeholder="예: 200000000"
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
                <div>
                  <Label htmlFor="businessPeriod">업력 (년)</Label>
                  <Input
                    id="businessPeriod"
                    type="number"
                    value={inputs.businessPeriod || ''}
                    onChange={(e) => updateInput('businessPeriod', Number(e.target.value))}
                    placeholder="예: 10"
                  />
                </div>
                <div>
                  <Label htmlFor="employeeCount">종업원 수 (명)</Label>
                  <Input
                    id="employeeCount"
                    type="number"
                    value={inputs.employeeCount || ''}
                    onChange={(e) => updateInput('employeeCount', Number(e.target.value))}
                    placeholder="예: 50"
                  />
                </div>
                <div>
                  <Label htmlFor="annualRevenue">연간 매출액 (원)</Label>
                  <Input
                    id="annualRevenue"
                    type="number"
                    value={inputs.annualRevenue || ''}
                    onChange={(e) => updateInput('annualRevenue', Number(e.target.value))}
                    placeholder="예: 10000000000"
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
                    type="number"
                    value={inputs.inheritorsCount || ''}
                    onChange={(e) => updateInput('inheritorsCount', Number(e.target.value))}
                    placeholder="예: 3"
                  />
                </div>
                <div>
                  <Label htmlFor="directDescendants">직계비속 수 (명)</Label>
                  <Input
                    id="directDescendants"
                    type="number"
                    value={inputs.directDescendants || ''}
                    onChange={(e) => updateInput('directDescendants', Number(e.target.value))}
                    placeholder="예: 2"
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
        <Button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="px-8 py-2"
          size="lg"
        >
          {isCalculating ? (
            <>
              <Calculator className="w-4 h-4 mr-2 animate-spin" />
              계산 중...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              가업상속세 계산하기
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleReset} size="lg">
          입력 초기화
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
    </div>
  );
};

export default BusinessInheritanceCalculatorComponent; 