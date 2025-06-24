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
  ArrowLeft
} from 'lucide-react';

export default function BusinessAnalysisPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: '5단계 BM ZEN 프레임워크',
      description: '체계적인 비즈니스 모델 분석 및 최적화',
      icon: Target
    },
    {
      title: '세무사 수익 4배 증가',
      description: '기존 서비스 대비 압도적 수익성 확보',
      icon: TrendingUp
    },
    {
      title: '95% 성공률 보장',
      description: '검증된 방법론으로 높은 성공률 달성',
      icon: Award
    },
    {
      title: '지속적 사후관리',
      description: '프로젝트 완료 후에도 3년간 지원',
      icon: Shield
    }
  ];

  const processSteps = [
    {
      step: '1단계',
      title: '현황 진단',
      description: 'AI 기반 기업 현황 분석 및 문제점 도출',
      duration: '1-2주'
    },
    {
      step: '2단계', 
      title: 'BM 설계',
      description: 'Business Model Zen 프레임워크 적용',
      duration: '2-3주'
    },
    {
      step: '3단계',
      title: '실행 계획',
      description: '단계별 실행 로드맵 및 KPI 설정',
      duration: '1-2주'
    },
    {
      step: '4단계',
      title: '실행 지원',
      description: '전담 컨설턴트의 실행 지원 및 모니터링',
      duration: '3-6개월'
    },
    {
      step: '5단계',
      title: '성과 관리',
      description: '성과 측정 및 지속적 개선 방안 도출',
      duration: '지속'
    }
  ];

  const caseStudies = [
    {
      industry: '세무법인',
      challenge: '전통적 세무 서비스의 한계',
      solution: 'BM ZEN 기반 종합 컨설팅 전환',
      result: '매출 400% 증가, 고객 만족도 95%'
    },
    {
      industry: '회계사무소',
      challenge: '낮은 수익성과 반복 업무',
      solution: 'AI 활용 자동화 및 신규 서비스 개발',
      result: '업무 효율성 60% 향상, 순이익 300% 증가'
    },
    {
      industry: '중소기업',
      challenge: '경영 혁신과 성장 동력 부족',
      solution: '맞춤형 비즈니스 모델 재설계',
      result: '매출 250% 증가, 시장 점유율 확대'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
              <span className="text-blue-600 font-medium">BM ZEN 사업분석</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">신규사업 성공률 95%</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    BM ZEN 사업분석
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  <strong>Business Model Zen</strong> 프레임워크를 활용한 
                  세무사를 위한 비즈니스 혁신 솔루션입니다.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge variant="outline" className="px-4 py-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    95% 성공률 보장
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    수익 4배 증가
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Shield className="w-4 h-4 mr-2" />
                    3년 사후관리
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4"
                    onClick={() => router.push('/consultation')}
                  >
                    지금 상담 신청
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4"
                    onClick={() => router.push('/diagnosis')}
                  >
                    무료 진단 받기
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">서비스 개요</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">진행 기간</span>
                      <span className="font-semibold">6-12개월</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">성공률</span>
                      <span className="font-semibold text-green-600">95%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">ROI</span>
                      <span className="font-semibold text-blue-600">400%+</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">비용</span>
                      <span className="font-semibold">상담 문의</span>
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
              { id: 'overview', label: '서비스 개요' },
              { id: 'features', label: '주요 특징' },
              { id: 'process', label: '진행 과정' },
              { id: 'cases', label: '성공 사례' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
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
                왜 BM ZEN 사업분석인가요?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 border-0 shadow-lg">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-xl text-red-600">기존 방식의 한계</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        단순 세무 서비스로 한정된 수익 구조
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        반복적 업무로 인한 성장 정체
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        체계적인 비즈니스 전략 부재
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        시장 변화에 대한 대응력 부족
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-xl text-blue-600">BM ZEN 솔루션</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        5단계 프레임워크로 체계적 접근
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        AI 기반 데이터 분석 및 인사이트
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        맞춤형 비즈니스 모델 설계
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        지속 가능한 성장 전략 수립
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
                BM ZEN의 핵심 특징
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center p-6 border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                5단계 진행 과정
              </h2>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                성공 사례
              </h2>
              <div className="grid lg:grid-cols-3 gap-8">
                {caseStudies.map((study, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-600">{study.industry}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">도전 과제</h4>
                          <p className="text-gray-600 text-sm">{study.challenge}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">솔루션</h4>
                          <p className="text-gray-600 text-sm">{study.solution}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">성과</h4>
                          <p className="text-green-600 text-sm font-medium">{study.result}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 BM ZEN을 시작하세요!
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              95% 성공률이 검증된 Business Model Zen으로 
              비즈니스를 혁신하고 수익을 4배 증가시키세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4"
                onClick={() => router.push('/consultation')}
              >
                <Users className="w-5 h-5 mr-2" />
                전문가 상담 신청
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
                onClick={() => router.push('/diagnosis')}
              >
                <Brain className="w-5 h-5 mr-2" />
                무료 AI진단 받기
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 