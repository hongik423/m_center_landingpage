'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Building, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  Lightbulb,
  Award,
  Clock,
  Star,
  FileText,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

export default function BusinessAnalysisCaseStudyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('timeline');

  const timelineData = [
    {
      year: '2019',
      phase: '창업 준비기',
      title: '시장분석 및 사업모델 설계',
      description: '레이저솔드링 기술의 시장 잠재력 분석 및 사업모델 수립',
      analysis: ['시장규모 분석', '경쟁사 분석', '사업모델 캔버스', 'SWOT 분석'],
      results: ['시장기회 발굴', '차별화 전략 수립', '타겟시장 선정'],
      investment: '0.5억원',
      color: 'bg-blue-500'
    },
    {
      year: '2020',
      phase: '사업 검증기',
      title: '고객 니즈 분석 및 제품 검증',
      description: '고객 인터뷰 및 시장 검증을 통한 제품-시장 적합성 확인',
      analysis: ['고객 여정 분석', '페르소나 설정', '제품 검증', '수익모델 분석'],
      results: ['고객 니즈 파악', '제품 개선', 'PMF 달성'],
      investment: '1.2억원',
      color: 'bg-green-500'
    },
    {
      year: '2021',
      phase: '성장 전략기',
      title: '사업 확장 전략 수립',
      description: '시장 점유율 확대를 위한 성장 전략 및 투자 계획 수립',
      analysis: ['시장 세분화', '성장 전략 수립', '투자 계획', '위험 분석'],
      results: ['성장 로드맵', '투자 유치', '사업 확장'],
      investment: '5.8억원',
      color: 'bg-purple-500'
    },
    {
      year: '2022',
      phase: '운영 최적화기',
      title: '운영 효율성 분석 및 개선',
      description: '데이터 기반 운영 분석을 통한 효율성 극대화',
      analysis: ['운영 데이터 분석', '프로세스 최적화', '비용 분석', '품질 분석'],
      results: ['운영비 30% 절감', '품질 개선', '생산성 향상'],
      investment: '12.5억원',
      color: 'bg-orange-500'
    },
    {
      year: '2023-2024',
      phase: '글로벌 확장기',
      title: '해외 진출 전략 분석',
      description: '글로벌 시장 분석 및 해외 진출 전략 수립',
      analysis: ['글로벌 시장 분석', '진출 전략', '현지화 전략', '파트너십 분석'],
      results: ['해외 진출', '글로벌 파트너십', '매출 다각화'],
      investment: '28.7억원',
      color: 'bg-red-500'
    }
  ];

  const analysisTools = [
    {
      category: '시장 분석',
      tools: ['TAM/SAM/SOM 분석', '포터의 5Forces', '시장 세분화', '경쟁사 벤치마킹'],
      impact: '시장 기회 발굴 및 포지셔닝',
      result: '240% 시장 점유율 증가'
    },
    {
      category: '고객 분석',
      tools: ['고객 여정 맵핑', '페르소나 분석', 'VOC 분석', '고객 세분화'],
      impact: '고객 만족도 향상',
      result: '고객 만족도 95% 달성'
    },
    {
      category: '사업 분석',
      tools: ['사업모델 캔버스', '가치 제안 분석', '수익모델 분석', 'SWOT 분석'],
      impact: '사업모델 최적화',
      result: '수익성 180% 개선'
    },
    {
      category: '운영 분석',
      tools: ['프로세스 분석', '비용 분석', '품질 분석', '생산성 분석'],
      impact: '운영 효율성 극대화',
      result: '운영비 30% 절감'
    }
  ];

  const strategicOutcomes = [
    {
      area: '시장 포지셔닝',
      before: '불명확한 시장 위치',
      after: '레이저솔드링 분야 선도기업',
      improvement: '시장 점유율 240% 증가'
    },
    {
      area: '고객 기반',
      before: '소규모 고객층',
      after: '다양한 산업 고객 확보',
      improvement: '고객 수 15배 증가'
    },
    {
      area: '수익성',
      before: '낮은 수익률',
      after: '고수익 구조 확립',
      improvement: '수익률 180% 개선'
    },
    {
      area: '운영 효율성',
      before: '비효율적 운영',
      after: '최적화된 운영 시스템',
      improvement: '운영비 30% 절감'
    }
  ];

  const performanceMetrics = [
    { metric: '매출 성장률', value: '850%', period: '2019-2024' },
    { metric: '시장 점유율', value: '240%', period: '증가' },
    { metric: '고객 만족도', value: '95%', period: '달성' },
    { metric: '운영비 절감', value: '30%', period: '달성' },
    { metric: '수익률 개선', value: '180%', period: '달성' },
    { metric: '총 투자 효과', value: '48.7억원', period: '누적' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto px-4 py-16">
        {/* M-CENTER 고객지원 Q&A 버튼 */}
        <div className="mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/support/qa')}
            className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] px-4 py-2 rounded-md hover:bg-green-50 border-green-300 hover:border-green-600 text-green-700 hover:text-green-600 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <span className="relative flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
              M-CENTER 고객지원 Q&A
            </span>
          </Button>
        </div>

        {/* 헤더 */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            비즈니스 분석 성공사례
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            (주)테크솔루션의 데이터 기반 성장 전략 수립 및 실행
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="outline" className="px-4 py-2">
              <BarChart3 className="w-4 h-4 mr-2" />
              매출 45% 증가
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              수익률 35% 향상
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              ROI 380% 달성
            </Badge>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="timeline">시계열 분석활용</TabsTrigger>
            <TabsTrigger value="tools">분석도구별 활용</TabsTrigger>
            <TabsTrigger value="strategy">전략적 성과</TabsTrigger>
            <TabsTrigger value="outcomes">개선 효과</TabsTrigger>
            <TabsTrigger value="performance">성과 분석</TabsTrigger>
          </TabsList>

          {/* 시계열 분석활용 탭 */}
          <TabsContent value="timeline">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    5단계 시계열 사업분석 활용 과정 (2019-2024)
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
                                  <h4 className="text-lg font-medium text-blue-600 mt-1">
                                    {item.title}
                                  </h4>
                                </div>
                                <Badge variant="secondary" className="px-3 py-1">
                                  투자: {item.investment}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-4">{item.description}</p>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">주요 분석 활동</h5>
                                  <ul className="space-y-1">
                                    {item.analysis.map((activity, idx) => (
                                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        {activity}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">주요 성과</h5>
                                  <ul className="space-y-1">
                                    {item.results.map((result, idx) => (
                                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Award className="w-4 h-4 text-blue-500" />
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

          {/* 분석도구별 활용 탭 */}
          <TabsContent value="tools">
            <div className="grid md:grid-cols-2 gap-6">
              {analysisTools.map((tool, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {tool.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">활용 도구</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {tool.tools.map((t, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">기대 효과</h4>
                        <p className="text-sm text-gray-600">{tool.impact}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-1">달성 결과</h4>
                        <p className="text-sm text-blue-700 font-medium">{tool.result}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 전략적 성과 탭 */}
          <TabsContent value="strategy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  전략적 개선 성과
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {strategicOutcomes.map((outcome, index) => (
                    <div key={index} className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {outcome.area}
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="bg-red-50 p-4 rounded-lg">
                            <h4 className="font-medium text-red-900 mb-2">개선 전</h4>
                            <p className="text-sm text-red-700">{outcome.before}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <ArrowRight className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="text-center">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">개선 후</h4>
                            <p className="text-sm text-green-700">{outcome.after}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <Badge variant="default" className="px-4 py-2">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          {outcome.improvement}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 개선 효과 탭 */}
          <TabsContent value="outcomes">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>사업 성과 지표</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">매출 성장률</span>
                      <span className="text-lg font-bold text-green-600">850%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">시장 점유율</span>
                      <span className="text-lg font-bold text-blue-600">240%↑</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">고객 만족도</span>
                      <span className="text-lg font-bold text-purple-600">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>운영 효율성 지표</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">운영비 절감</span>
                      <span className="text-lg font-bold text-orange-600">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">수익률 개선</span>
                      <span className="text-lg font-bold text-red-600">180%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">생산성 향상</span>
                      <span className="text-lg font-bold text-teal-600">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
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
                  종합 성과 분석 (2019-2024)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
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

                <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">핵심 성과 요약</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">사업 성장</h4>
                      <ul className="space-y-1">
                        <li>• 매출 850% 증가 (2019→2024)</li>
                        <li>• 시장 점유율 240% 확대</li>
                        <li>• 고객 수 15배 증가</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">운영 효율화</h4>
                      <ul className="space-y-1">
                        <li>• 운영비 30% 절감</li>
                        <li>• 수익률 180% 개선</li>
                        <li>• 고객 만족도 95% 달성</li>
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
              className="px-8 py-3 bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group"
              onClick={() => router.push('/consultation')}
            >
              <span className="absolute inset-0 bg-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                비즈니스 분석 상담 신청하기
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="px-8 py-3 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] border-gray-300 hover:border-green-600 text-gray-700 hover:text-green-600 hover:shadow-md relative overflow-hidden group"
              onClick={() => router.push('/services/business-analysis')}
            >
              <span className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
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