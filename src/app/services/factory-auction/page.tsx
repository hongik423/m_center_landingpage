'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Factory, 
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
  Building,
  Calculator,
  MapPin,
  Gavel
} from 'lucide-react';

export default function FactoryAuctionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: '투자비 40% 절약',
      description: '시장가 대비 최대 40%까지 비용 절감',
      icon: Calculator
    },
    {
      title: '전문가 동행',
      description: '경매 전문가가 처음부터 끝까지 동행',
      icon: Users
    },
    {
      title: '완전 위탁 진행',
      description: '복잡한 경매 절차를 모두 대행',
      icon: Shield
    },
    {
      title: '성공보수제',
      description: '성공했을 때만 수수료 지불',
      icon: Award
    }
  ];

  const auctionProcess = [
    {
      step: '1단계',
      title: '투자 계획 수립',
      description: '고객의 사업 목적과 예산에 맞는 투자 계획 설계',
      duration: '1주',
      details: ['투자 목적 분석', '예산 계획 수립', '입지 조건 설정', '투자 위험 평가']
    },
    {
      step: '2단계',
      title: '물건 선별 및 분석',
      description: '경매 물건 중 최적의 투자 대상 선별 및 분석',
      duration: '2-3주',
      details: ['물건 정보 수집', '현장 실사', '법적 검토', '투자 수익률 분석']
    },
    {
      step: '3단계',
      title: '경매 참여 준비',
      description: '경매 참여를 위한 모든 준비 사항 완료',
      duration: '1주',
      details: ['보증금 준비', '입찰 전략 수립', '필요 서류 준비', '경매 일정 확인']
    },
    {
      step: '4단계',
      title: '경매 참여 및 낙찰',
      description: '전문가가 직접 경매에 참여하여 낙찰 진행',
      duration: '1일',
      details: ['경매 참여', '전략적 입찰', '낙찰 처리', '즉시 결과 통보']
    },
    {
      step: '5단계',
      title: '사후 관리',
      description: '낙찰 후 소유권 이전 및 사업 개시 지원',
      duration: '2-4주',
      details: ['소유권 이전', '인허가 지원', '리모델링 자문', '사업 개시 컨설팅']
    }
  ];

  const successCases = [
    {
      type: '제조업 공장',
      location: '경기도 화성시',
      originalPrice: '25억원',
      finalPrice: '15억원',
      savings: '10억원 (40%)',
      description: '자동차 부품 제조업체의 신규 공장 구매'
    },
    {
      type: '물류센터',
      location: '인천 서구',
      originalPrice: '18억원',
      finalPrice: '12억원',
      savings: '6억원 (33%)',
      description: '온라인 쇼핑몰 물류센터 구축'
    },
    {
      type: '식품 가공공장',
      location: '충남 천안시',
      originalPrice: '12억원',
      finalPrice: '8억원',
      savings: '4억원 (33%)',
      description: '중소 식품 제조업체 생산 확장'
    }
  ];

  const advantages = [
    {
      title: '비용 절감',
      description: '시장가 대비 최대 40% 절약',
      icon: Calculator,
      benefits: ['낮은 진입 비용', '높은 투자 수익률', '자금 부담 완화']
    },
    {
      title: '전문성',
      description: '경매 전문가의 체계적 지원',
      icon: Users,
      benefits: ['경매 시장 전문 지식', '위험 요소 사전 차단', '최적 물건 선별']
    },
    {
      title: '안전성',
      description: '법적 검토 및 위험 관리',
      icon: Shield,
      benefits: ['법적 문제 사전 차단', '완전한 소유권 확보', '투자 위험 최소화']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
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
              <span className="text-orange-600 font-medium">경매활용 공장구매</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-full mb-6">
                  <Gavel className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">시장가 대비 40% 절약</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    경매활용 공장구매
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  경매 활용 <strong>스마트 투자 전략</strong>으로 
                  공장 구매 비용을 최대 40%까지 절약하세요.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge variant="outline" className="px-4 py-2">
                    <Calculator className="w-4 h-4 mr-2" />
                    투자비 40% 절약
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Users className="w-4 h-4 mr-2" />
                    전문가 동행
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    성공보수제
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white px-8 py-4"
                    onClick={() => router.push('/consultation')}
                  >
                    투자 상담 신청
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4"
                    onClick={() => router.push('/diagnosis')}
                  >
                    투자 적합성 진단
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">서비스 개요</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">진행 기간</span>
                      <span className="font-semibold">3-6개월</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">절약 효과</span>
                      <span className="font-semibold text-green-600">최대 40%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">수수료</span>
                      <span className="font-semibold text-orange-600">성공보수제</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">전문가 지원</span>
                      <span className="font-semibold">완전 위탁 진행</span>
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
              { id: 'features', label: '핵심 특징' },
              { id: 'process', label: '진행 과정' },
              { id: 'cases', label: '성공 사례' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-600 text-orange-600'
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
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                경매활용 공장구매의 3가지 핵심 장점
              </h2>
              <div className="grid lg:grid-cols-3 gap-8">
                {advantages.map((advantage, index) => (
                  <Card key={index} className="border-0 shadow-lg text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <advantage.icon className="w-8 h-8 text-orange-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{advantage.title}</CardTitle>
                      <p className="text-gray-600">{advantage.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-left">
                        {advantage.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                서비스 핵심 특징
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center p-6 border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-8 h-8 text-orange-600" />
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
                {auctionProcess.map((step, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
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
                          <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {step.details.map((detail, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {detail}
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

          {activeTab === 'cases' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                성공 사례
              </h2>
              <div className="grid lg:grid-cols-3 gap-8">
                {successCases.map((case_, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-5 h-5 text-orange-600" />
                        <CardTitle className="text-lg text-gray-900">{case_.type}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {case_.location}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">시장가</span>
                          <span className="font-medium text-gray-900">{case_.originalPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">낙찰가</span>
                          <span className="font-medium text-blue-600">{case_.finalPrice}</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-3">
                          <span className="text-sm font-medium text-gray-900">절약 효과</span>
                          <span className="font-bold text-green-600">{case_.savings}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">{case_.description}</p>
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
      <section className="py-16 bg-gradient-to-r from-orange-600 to-yellow-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              스마트한 공장 투자를 시작하세요!
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              경매 전문가와 함께 시장가 대비 40% 절약하고 
              성공보수제로 안전하게 투자하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4"
                onClick={() => router.push('/consultation')}
              >
                <Factory className="w-5 h-5 mr-2" />
                투자 상담 신청
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4"
                onClick={() => router.push('/diagnosis')}
              >
                <Calculator className="w-5 h-5 mr-2" />
                투자 적합성 진단
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 