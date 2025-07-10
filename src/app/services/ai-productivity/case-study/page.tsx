'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Cpu, 
  Zap, 
  Target, 
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Calendar,
  TrendingUp,
  Users,
  Building,
  Lightbulb,
  BarChart3
} from 'lucide-react';

export default function AIProductivityCaseStudyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('timeline');

  const timelineData = [
    {
      year: '2019',
      phase: 'AI 도입 준비기',
      title: '기초 데이터 수집 및 AI 전략 수립',
      description: '생산 데이터 수집 체계 구축 및 AI 도입 로드맵 설계',
      aiSolutions: ['데이터 수집 시스템', '기본 분석 도구', 'AI 전략 수립'],
      results: ['데이터 기반 의사결정', '분석 역량 구축', 'AI 준비 완료'],
      productivity: '15%',
      investment: '0.8억원',
      color: 'bg-blue-500'
    },
    {
      year: '2020',
      phase: 'AI 기반 자동화 도입',
      title: '생산 공정 자동화 및 품질 관리 AI',
      description: '레이저솔드링 공정의 AI 자동화 및 실시간 품질 검사 시스템',
      aiSolutions: ['공정 자동화 AI', '품질 검사 AI', '예측 유지보수'],
      results: ['생산 효율 35% 향상', '불량률 60% 감소', '유지보수 비용 40% 절감'],
      productivity: '35%',
      investment: '2.5억원',
      color: 'bg-green-500'
    },
    {
      year: '2021',
      phase: 'AI 최적화 확장',
      title: '공급망 최적화 및 수요 예측 AI',
      description: 'AI 기반 공급망 관리 및 수요 예측 시스템으로 운영 최적화',
      aiSolutions: ['공급망 최적화 AI', '수요 예측 AI', '재고 관리 AI'],
      results: ['재고 비용 25% 절감', '납기 준수율 95%', '공급망 효율성 향상'],
      productivity: '55%',
      investment: '4.2억원',
      color: 'bg-purple-500'
    },
    {
      year: '2022',
      phase: 'AI 통합 플랫폼 구축',
      title: '통합 AI 플랫폼 및 스마트 팩토리',
      description: '전사 AI 플랫폼 구축으로 모든 업무 프로세스 지능화',
      aiSolutions: ['통합 AI 플랫폼', '스마트 팩토리', '비즈니스 인텔리전스'],
      results: ['전사 생산성 70% 향상', '의사결정 속도 3배 향상', '운영비 30% 절감'],
      productivity: '70%',
      investment: '8.5억원',
      color: 'bg-orange-500'
    },
    {
      year: '2023-2024',
      phase: 'AI 혁신 생태계',
      title: '생성형 AI 및 자율 운영 시스템',
      description: '생성형 AI 활용 및 완전 자율 운영 시스템 구축',
      aiSolutions: ['생성형 AI', '자율 운영 AI', 'AI 기반 R&D'],
      results: ['완전 자율 운영', '혁신 속도 5배 향상', '새로운 비즈니스 모델'],
      productivity: '120%',
      investment: '15.8억원',
      color: 'bg-red-500'
    }
  ];

  const aiSolutionsByCategory = [
    {
      category: '생산 자동화',
      solutions: ['공정 자동화 AI', '품질 검사 AI', '예측 유지보수', '스마트 팩토리'],
      impact: '생산 효율성 극대화',
      result: '생산성 70% 향상, 불량률 60% 감소',
      roi: '450%'
    },
    {
      category: '운영 최적화',
      solutions: ['공급망 최적화', '수요 예측', '재고 관리', '비즈니스 인텔리전스'],
      impact: '운영 효율성 및 비용 절감',
      result: '운영비 30% 절감, 재고 비용 25% 절감',
      roi: '380%'
    },
    {
      category: '의사결정 지원',
      solutions: ['데이터 분석 AI', '예측 분석', '리포팅 자동화', '대시보드'],
      impact: '데이터 기반 의사결정',
      result: '의사결정 속도 3배 향상',
      roi: '320%'
    },
    {
      category: '혁신 가속화',
      solutions: ['생성형 AI', 'R&D 지원 AI', '자동화 설계', '혁신 관리'],
      impact: '혁신 속도 및 품질 향상',
      result: '혁신 속도 5배 향상, 신제품 개발 시간 50% 단축',
      roi: '600%'
    }
  ];

  const productivityImprovements = [
    {
      area: '생산 효율성',
      before: '수작업 중심의 생산',
      after: 'AI 자동화 생산',
      improvement: '생산성 70% 향상'
    },
    {
      area: '품질 관리',
      before: '사후 품질 검사',
      after: '실시간 AI 품질 모니터링',
      improvement: '불량률 60% 감소'
    },
    {
      area: '운영 비용',
      before: '높은 운영 비용',
      after: 'AI 최적화 운영',
      improvement: '운영비 30% 절감'
    },
    {
      area: '의사결정',
      before: '경험 기반 의사결정',
      after: 'AI 기반 데이터 의사결정',
      improvement: '의사결정 속도 3배 향상'
    }
  ];

  const performanceMetrics = [
    { metric: '전체 생산성', value: '120%', period: '향상' },
    { metric: '생산 효율성', value: '70%', period: '향상' },
    { metric: '품질 개선', value: '60%', period: '불량률 감소' },
    { metric: '운영비 절감', value: '30%', period: '절감' },
    { metric: '의사결정 속도', value: '3배', period: '향상' },
    { metric: '총 AI 투자', value: '31.8억원', period: '누적' },
    { metric: '투자 수익률', value: '420%', period: '달성' },
    { metric: '혁신 속도', value: '5배', period: '향상' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        {/* Q&A로 돌아가기 버튼 */}
        <div className="mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/support/qa')}
            className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] px-4 py-2 rounded-md hover:bg-purple-50 border-purple-300 hover:border-purple-600 text-purple-700 hover:text-purple-600 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <span className="relative flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
              Q&A로 돌아가기
            </span>
          </Button>
        </div>

        {/* 헤더 */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI생산성향상 활용사례
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            (주)ABC기업의 AI 도입을 통한 시계열 생산성 혁신 스토리
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="outline" className="px-4 py-2">
              <Bot className="w-4 h-4 mr-2" />
              AI 자동화
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              생산성 120% 향상
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              ROI 420% 달성
            </Badge>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="timeline">시계열 AI도입</TabsTrigger>
            <TabsTrigger value="solutions">AI솔루션별 활용</TabsTrigger>
            <TabsTrigger value="productivity">생산성 개선</TabsTrigger>
            <TabsTrigger value="improvements">혁신 효과</TabsTrigger>
            <TabsTrigger value="performance">성과 분석</TabsTrigger>
          </TabsList>

          {/* 시계열 AI도입 탭 */}
          <TabsContent value="timeline">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    5단계 시계열 AI 도입 과정 (2019-2024)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {timelineData.map((item, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-start gap-6">
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full ${item.color}`} />
                            {index < timelineData.length - 1 && (
                              <div className="w-0.5 h-20 bg-gray-300 mt-2" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="bg-white rounded-lg p-6 shadow-sm border">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    {item.year} - {item.phase}
                                  </h3>
                                  <h4 className="text-lg font-medium text-purple-600 mt-1">
                                    {item.title}
                                  </h4>
                                </div>
                                <div className="text-right">
                                  <Badge variant="secondary" className="px-3 py-1 mb-2">
                                    투자: {item.investment}
                                  </Badge>
                                  <div className="text-sm text-green-600 font-medium">
                                    생산성 {item.productivity} 향상
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-4">{item.description}</p>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">도입 AI 솔루션</h5>
                                  <ul className="space-y-1">
                                    {item.aiSolutions.map((solution, idx) => (
                                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Bot className="w-4 h-4 text-purple-500" />
                                        {solution}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">주요 성과</h5>
                                  <ul className="space-y-1">
                                    {item.results.map((result, idx) => (
                                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Award className="w-4 h-4 text-green-500" />
                                        {result}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI솔루션별 활용 탭 */}
          <TabsContent value="solutions">
            <div className="grid md:grid-cols-2 gap-6">
              {aiSolutionsByCategory.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="w-5 h-5" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">AI 솔루션</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {category.solutions.map((solution, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs justify-start">
                              <Bot className="w-3 h-3 mr-1" />
                              {solution}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">기대 효과</h4>
                        <p className="text-sm text-gray-600">{category.impact}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-1">달성 결과</h4>
                        <p className="text-sm text-purple-700 font-medium mb-2">{category.result}</p>
                        <div className="text-right">
                          <Badge variant="default" className="bg-purple-600">
                            ROI {category.roi}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 생산성 개선 탭 */}
          <TabsContent value="productivity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI 기반 생산성 개선 성과
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {productivityImprovements.map((improvement, index) => (
                    <div key={index} className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {improvement.area}
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="bg-red-50 p-4 rounded-lg">
                            <h4 className="font-medium text-red-900 mb-2">AI 도입 전</h4>
                            <p className="text-sm text-red-700">{improvement.before}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <ArrowRight className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className="text-center">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">AI 도입 후</h4>
                            <p className="text-sm text-green-700">{improvement.after}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <Badge variant="default" className="px-4 py-2 bg-purple-600">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          {improvement.improvement}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 혁신 효과 탭 */}
          <TabsContent value="improvements">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>생산성 지표</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">전체 생산성</span>
                      <span className="text-lg font-bold text-purple-600">120%↑</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">생산 효율성</span>
                      <span className="text-lg font-bold text-green-600">70%↑</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">품질 개선</span>
                      <span className="text-lg font-bold text-blue-600">60%↑</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>비용 효율성</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">운영비 절감</span>
                      <span className="text-lg font-bold text-orange-600">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">유지보수 비용</span>
                      <span className="text-lg font-bold text-red-600">40%↓</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">재고 비용</span>
                      <span className="text-lg font-bold text-teal-600">25%↓</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 성과 분석 탭 */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  종합 AI 성과 분석 (2019-2024)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="text-center bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {metric.value}
                      </div>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {metric.metric}
                      </div>
                      <div className="text-xs text-gray-600">
                        {metric.period}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">AI 혁신 성과 요약</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">생산성 혁신</h4>
                      <ul className="space-y-1">
                        <li>• 전체 생산성 120% 향상</li>
                        <li>• 생산 효율성 70% 개선</li>
                        <li>• 품질 불량률 60% 감소</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">비용 최적화</h4>
                      <ul className="space-y-1">
                        <li>• 운영비 30% 절감</li>
                        <li>• 유지보수 비용 40% 절감</li>
                        <li>• 재고 비용 25% 절감</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">혁신 가속화</h4>
                      <ul className="space-y-1">
                        <li>• 의사결정 속도 3배 향상</li>
                        <li>• 혁신 속도 5배 향상</li>
                        <li>• 투자 수익률 420% 달성</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 하단 액션 */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group"
              onClick={() => router.push('/consultation')}
            >
              <span className="absolute inset-0 bg-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI생산성향상 상담 신청하기
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="px-8 py-3 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] border-gray-300 hover:border-purple-600 text-gray-700 hover:text-purple-600 hover:shadow-md relative overflow-hidden group"
              onClick={() => router.push('/services/ai-productivity')}
            >
              <span className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
                서비스 상세 보기
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 