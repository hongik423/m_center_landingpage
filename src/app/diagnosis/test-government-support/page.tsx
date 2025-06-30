'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ServiceRecommendationEngine, 
  GovernmentSupportReportGenerator,
  MCENTER_SERVICES,
  ServiceRecommendation 
} from '@/lib/utils/serviceRecommendationEngine';

export default function TestGovernmentSupportPage() {
  const [formData, setFormData] = useState({
    companyName: '혁신테크',
    industry: 'IT',
    businessManager: '김대표',
    employeeCount: '10-30명',
    establishmentDifficulty: '성장기',
    businessLocation: '서울시 강남구',
    mainConcerns: '정책자금을 활용한 AI 도입으로 생산성을 향상시키고 싶습니다',
    expectedBenefits: '정부지원을 받아 효율성을 높이고 매출을 증대시키고 싶습니다',
    contactName: '김대표',
    contactPhone: '010-9251-9743',
    contactEmail: 'ceo@innovtech.com',
    privacyConsent: true
  });

  const [recommendation, setRecommendation] = useState<ServiceRecommendation | null>(null);
  const [report, setReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const runRecommendationEngine = () => {
    setIsLoading(true);
    
    try {
      console.log('🚀 서비스 추천 엔진 테스트 시작:', formData);
      
      // 추천 엔진 실행
      const result = ServiceRecommendationEngine.recommendForGovernmentSupport(formData);
      setRecommendation(result);
      
      // 보고서 생성
      const generatedReport = GovernmentSupportReportGenerator.generateGovernmentSupportReport(formData, result);
      setReport(generatedReport);
      
      console.log('✅ 추천 결과:', result);
      
    } catch (error) {
      console.error('❌ 추천 엔진 오류:', error);
      alert('추천 시스템 실행 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const testCases = [
    {
      name: '제조업 + 정책자금',
      data: {
        companyName: '스마트제조',
        industry: '제조업',
        mainConcerns: '정책자금을 활용한 공장 현대화와 AI 도입이 필요합니다',
        expectedBenefits: '정부지원을 받아 생산성 향상과 비용 절감을 하고 싶습니다'
      }
    },
    {
      name: 'IT기업 + 기술혁신',
      data: {
        companyName: 'AI솔루션',
        industry: 'IT',
        mainConcerns: '기술사업화를 위한 R&D 지원과 정부지원이 필요합니다',
        expectedBenefits: '창업지원과 벤처확인을 통해 투자유치를 하고 싶습니다'
      }
    },
    {
      name: '서비스업 + 디지털전환',
      data: {
        companyName: '디지털서비스',
        industry: '서비스업',
        mainConcerns: '디지털전환지원을 받아 온라인 마케팅을 강화하고 싶습니다',
        expectedBenefits: '정부지원으로 웹사이트 구축과 AI 활용을 하고 싶습니다'
      }
    }
  ];

  const loadTestCase = (testCase: any) => {
    setFormData(prev => ({
      ...prev,
      ...testCase.data
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏛️ 정책자금 활용 서비스 추천 시스템 테스트
        </h1>
        <p className="text-xl text-gray-600">
          경영지도센터 6개 서비스영역 중 가장 적합한 1개 추천 엔진 테스트
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 입력 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📝 테스트 데이터 입력
              <Badge variant="outline">6개 서비스 → 1개 추천</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 빠른 테스트 케이스 */}
            <div>
              <Label className="text-sm font-medium">빠른 테스트 케이스</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {testCases.map((testCase, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadTestCase(testCase)}
                  >
                    {testCase.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* 기업 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">회사명</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="industry">업종</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="제조업">제조업</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="서비스업">서비스업</SelectItem>
                    <SelectItem value="건설업">건설업</SelectItem>
                    <SelectItem value="유통업">유통업</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeCount">직원 수</Label>
                <Select value={formData.employeeCount} onValueChange={(value) => handleInputChange('employeeCount', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10명 이하">10명 이하</SelectItem>
                    <SelectItem value="10-30명">10-30명</SelectItem>
                    <SelectItem value="30-50명">30-50명</SelectItem>
                    <SelectItem value="50명 이상">50명 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stage">경영 단계</Label>
                <Select value={formData.establishmentDifficulty} onValueChange={(value) => handleInputChange('establishmentDifficulty', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="창업기">창업기</SelectItem>
                    <SelectItem value="성장기">성장기</SelectItem>
                    <SelectItem value="확장기">확장기</SelectItem>
                    <SelectItem value="안정기">안정기</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 주요 고민 (정책자금 키워드 포함) */}
            <div>
              <Label htmlFor="concerns">주요 고민사항 (정책자금 키워드 포함)</Label>
              <Textarea
                id="concerns"
                value={formData.mainConcerns}
                onChange={(e) => handleInputChange('mainConcerns', e.target.value)}
                placeholder="정책자금, 정부지원, AI도입, 디지털전환 등의 키워드를 포함해주세요"
                rows={3}
              />
            </div>

            {/* 기대 효과 */}
            <div>
              <Label htmlFor="benefits">기대 효과</Label>
              <Textarea
                id="benefits"
                value={formData.expectedBenefits}
                onChange={(e) => handleInputChange('expectedBenefits', e.target.value)}
                placeholder="정부지원을 통해 달성하고 싶은 효과를 작성해주세요"
                rows={3}
              />
            </div>

            {/* 실행 버튼 */}
            <Button 
              onClick={runRecommendationEngine}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isLoading ? '분석 중...' : '🎯 서비스 추천 엔진 실행'}
            </Button>
          </CardContent>
        </Card>

        {/* 결과 표시 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏆 추천 결과
              {recommendation && (
                <Badge variant="default">
                  {recommendation.primaryService.name}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!recommendation ? (
              <div className="text-center py-8 text-gray-500">
                좌측 폼을 작성하고 추천 엔진을 실행해주세요
              </div>
            ) : (
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="summary">요약</TabsTrigger>
                  <TabsTrigger value="services">서비스 비교</TabsTrigger>
                  <TabsTrigger value="actionplan">액션플랜</TabsTrigger>
                  <TabsTrigger value="report">전체 보고서</TabsTrigger>
                </TabsList>

                {/* 요약 탭 */}
                <TabsContent value="summary" className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">🥇 1순위 추천 서비스</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {recommendation.primaryService.name}
                    </div>
                    <p className="text-gray-700 mb-3">
                      {recommendation.primaryService.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">예상 효과:</span> {recommendation.primaryService.expectedOutcome}
                      </div>
                      <div>
                        <span className="font-medium">실행 기간:</span> {recommendation.primaryService.timeframe}
                      </div>
                      <div>
                        <span className="font-medium">투자 규모:</span> {recommendation.primaryService.investment}
                      </div>
                      <div>
                        <span className="font-medium">투자 수익률:</span> {recommendation.primaryService.roi}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">추천 이유</h4>
                    <ul className="space-y-1">
                      {recommendation.reasons.map((reason, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          • {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* 서비스 비교 탭 */}
                <TabsContent value="services">
                  <div className="space-y-4">
                    <h3 className="font-bold">📊 6개 서비스영역 비교</h3>
                    
                    {/* 1순위 서비스 */}
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-600">1순위</Badge>
                          <h4 className="font-bold">{recommendation.primaryService.name}</h4>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {recommendation.primaryService.description}
                        </p>
                        <div className="text-sm">
                          <span className="font-medium">예상 효과:</span> {recommendation.primaryService.expectedOutcome}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 2-3순위 서비스 */}
                    {recommendation.secondaryServices.map((service, index) => (
                      <Card key={service.id} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{index + 2}순위</Badge>
                            <h4 className="font-medium">{service.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {service.description}
                          </p>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">예상 효과:</span> {service.expectedOutcome}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* 나머지 서비스들 */}
                    {MCENTER_SERVICES
                      .filter(service => 
                        service.id !== recommendation.primaryService.id &&
                        !recommendation.secondaryServices.some(s => s.id === service.id)
                      )
                      .map((service, index) => (
                        <Card key={service.id} className="border-gray-100 opacity-60">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{index + 4}순위</Badge>
                              <h4 className="font-medium text-gray-500">{service.name}</h4>
                            </div>
                            <p className="text-sm text-gray-500">
                              현재 상황에 덜 적합한 서비스
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    }
                  </div>
                </TabsContent>

                {/* 액션플랜 탭 */}
                <TabsContent value="actionplan">
                  <div className="space-y-4">
                    <h3 className="font-bold">⚡ 30일 내 핵심 과제 액션플랜</h3>
                    
                    {Object.entries(recommendation.actionPlan).map(([phase, plan], index) => (
                      <Card key={phase} className={index === 1 ? 'border-red-200 bg-red-50' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={index === 1 ? 'bg-red-600' : 'bg-gray-600'}>
                              Phase {index + 1}
                            </Badge>
                            <h4 className="font-bold">{plan.period}</h4>
                            {index === 1 && <Badge variant="destructive">핵심 과제</Badge>}
                          </div>
                          
                          <div className="space-y-2">
                            <h5 className="font-medium">실행 과제:</h5>
                            <ul className="space-y-1">
                              {plan.tasks.map((task: string, taskIndex: number) => (
                                <li key={taskIndex} className="text-sm">
                                  ✅ {task}
                                </li>
                              ))}
                            </ul>
                            
                            <div className="mt-3 p-2 bg-green-50 rounded">
                              <span className="font-medium text-green-700">목표: </span>
                              <span className="text-green-700">{plan.milestone}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* 전체 보고서 탭 */}
                <TabsContent value="report">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">📋 정책자금 활용 전체 보고서</h3>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const blob = new Blob([report], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${formData.companyName}_정책자금활용보고서.md`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        📥 다운로드
                      </Button>
                    </div>
                    
                    <Card>
                      <CardContent className="p-4">
                        <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96 bg-gray-50 p-4 rounded">
                          {report}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 시스템 정보 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🔧 시스템 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-bold mb-2">📊 추천 엔진 특징</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 6개 서비스영역 중 1개 명확 추천</li>
                <li>• 업종별/규모별/단계별 맞춤 분석</li>
                <li>• 정책자금 키워드 자동 감지</li>
                <li>• 정부지원 프로그램 자동 연계</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">🎯 핵심 기능</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 30일 내 핵심 과제 명시</li>
                <li>• 서비스 우선순위 자동 산정</li>
                <li>• ROI 기반 효과 예측</li>
                <li>• 단계별 액션플랜 제공</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">📋 출력 결과</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 1순위 서비스 명확 추천</li>
                <li>• 정책자금 활용 전용 보고서</li>
                <li>• 6개 서비스 비교 분석</li>
                <li>• 즉시 실행 가능한 액션플랜</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 