'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Brain, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Zap,
  Shield,
  Award,
  Clock,
  DollarSign,
  ArrowLeft,
  Lightbulb,
  Rocket,
  Settings
} from 'lucide-react';

export default function AIProductivityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: '정부 100% 지원',
      description: '모든 비용을 정부에서 지원하는 무료 프로그램',
      icon: Award
    },
    {
      title: '20주 집중 프로그램',
      description: '체계적인 단계별 AI 도입 및 활용 교육',
      icon: Clock
    },
    {
      title: '업무 효율성 40% 향상',
      description: 'AI 도구 활용으로 업무 생산성 대폭 개선',
      icon: TrendingUp
    },
    {
      title: '실무 적용 중심',
      description: '이론이 아닌 실제 업무에 바로 적용 가능',
      icon: Settings
    }
  ];

  const curriculum = [
    {
      week: '1-4주',
      title: 'AI 기초 및 도구 소개',
      description: 'ChatGPT, Claude, 미드저니 등 주요 AI 도구 사용법 습득',
      topics: ['AI 개념 이해', 'ChatGPT 활용법', '프롬프트 엔지니어링', '미드저니 활용']
    },
    {
      week: '5-8주',
      title: '업무별 AI 활용',
      description: '문서 작성, 데이터 분석, 마케팅 등 업무별 AI 적용',
      topics: ['문서 자동화', '데이터 분석', '마케팅 자동화', '고객 서비스']
    },
    {
      week: '9-12주',
      title: '고급 AI 활용',
      description: '워크플로우 자동화 및 맞춤형 AI 솔루션 구축',
      topics: ['워크플로우 자동화', 'API 연동', '맞춤형 봇 개발', '성과 측정']
    },
    {
      week: '13-16주',
      title: '실전 프로젝트',
      description: '실제 업무 환경에서 AI 도입 프로젝트 수행',
      topics: ['프로젝트 설계', '팀 협업', '문제 해결', '성과 분석']
    },
    {
      week: '17-20주',
      title: '최종 발표 및 평가',
      description: '프로젝트 성과 발표 및 향후 계획 수립',
      topics: ['성과 발표', '피드백', '개선 계획', '지속 활용']
    }
  ];

  const benefits = [
    {
      category: '개인 역량',
      items: ['AI 도구 활용 능력 향상', '업무 효율성 40% 증가', '창의적 문제 해결 능력', '디지털 리터러시 향상']
    },
    {
      category: '기업 성과',
      items: ['운영 비용 30% 절감', '고객 만족도 25% 향상', '업무 자동화 구현', '경쟁력 확보']
    },
    {
      category: '미래 준비',
      items: ['AI 트렌드 대응', '새로운 비즈니스 모델', '혁신 문화 조성', '지속 성장 기반']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/services')}
                className="p-0 h-auto font-normal"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                서비스 목록
              </Button>
              <span>/</span>
              <span className="text-purple-600 font-medium">AI 활용 생산성향상</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-6">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">정부 100% 지원</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    AI 활용 생산성향상
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  <strong>20주 집중 프로그램</strong>으로 AI 혁신을 완성하고 
                  업무 효율성을 40% 향상시키세요.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge variant="outline" className="px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    정부 100% 지원
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    효율성 40% 향상
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Clock className="w-4 h-4 mr-2" />
                    20주 프로그램
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4"
                    onClick={() => router.push('/consultation')}
                  >
                    지금 신청하기
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4"
                    onClick={() => router.push('/diagnosis')}
                  >
                    적합성 진단받기
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">프로그램 개요</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">진행 기간</span>
                      <span className="font-semibold">20주</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">지원 대상</span>
                      <span className="font-semibold text-purple-600">중소기업</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">지원 비율</span>
                      <span className="font-semibold text-green-600">100%</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">참가 비용</span>
                      <span className="font-semibold text-red-600">무료</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: '프로그램 개요' },
              { id: 'features', label: '주요 특징' },
              { id: 'curriculum', label: '커리큘럼' },
              { id: 'benefits', label: '기대 효과' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {activeTab === 'overview' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                AI 시대, 생산성 혁신의 필수 과정
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 border-0 shadow-lg">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-xl text-red-600">현재 상황</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        반복적인 업무로 인한 시간 낭비
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        AI 도구 활용법을 모르는 직원들
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        경쟁사 대비 생산성 격차 확대
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        디지털 전환 시대에 뒤처짐
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-xl text-purple-600">AI 생산성 혁신</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        체계적인 AI 도구 활용 교육
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        실무 중심의 실전 프로젝트
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        업무 자동화 및 효율성 향상
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        미래형 인재 양성 및 경쟁력 확보
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                프로그램 핵심 특징
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center p-6 border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                20주 체계적 커리큘럼
              </h2>
              <div className="space-y-6">
                {curriculum.map((item, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {item.week}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.topics.map((topic, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                기대 효과
              </h2>
              <div className="grid lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-600">{benefit.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {benefit.items.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              AI 생산성 혁신, 지금 시작하세요!
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              정부 100% 지원으로 완전 무료! 
              20주 만에 업무 효율성을 40% 향상시키는 기회를 놓치지 마세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4"
                onClick={() => router.push('/consultation')}
              >
                <Rocket className="w-5 h-5 mr-2" />
                지금 신청하기
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4"
                onClick={() => router.push('/diagnosis')}
              >
                <Brain className="w-5 h-5 mr-2" />
                적합성 진단받기
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 