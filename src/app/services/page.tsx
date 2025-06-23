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
  Factory, 
  Rocket, 
  Award, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Zap,
  Shield
} from 'lucide-react';

// 서비스 데이터
const services = [
  {
    id: 'business-analysis',
    title: 'BM ZEN 사업분석',
    subtitle: '신규사업 성공률 95%',
    description: '세무사를 위한 비즈니스 혁신 솔루션',
    icon: Brain,
    color: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    href: '/services/business-analysis',
    benefits: ['95% 성공률 보장', '세무사 수익 4배 증가', '5단계 BM ZEN 프레임워크'],
    price: '상담 문의',
    duration: '6-12개월',
    featured: true
  },
  {
    id: 'ai-productivity',
    title: 'AI 활용 생산성향상',
    subtitle: '업무 효율성 40% 향상',
    description: '20주 프로그램으로 AI 혁신 완성',
    icon: Brain,
    color: 'bg-purple-100 text-purple-600',
    href: '/services/ai-productivity',
    benefits: ['정부 100% 지원', '20주 집중 프로그램', '업무 효율성 40% 향상'],
    price: '무료 (정부지원)',
    duration: '20주'
  },
  {
    id: 'factory-auction',
    title: '경매활용 공장구매',
    subtitle: '시장가 대비 40% 절약',
    description: '경매 활용 스마트 투자 전략',
    icon: Factory,
    color: 'bg-orange-100 text-orange-600',
    href: '/services/factory-auction',
    benefits: ['투자비 40% 절약', '전문가 동행', '완전 위탁 진행'],
    price: '성공보수제',
    duration: '3-6개월'
  },
  {
    id: 'tech-startup',
    title: '기술사업화/기술창업',
    subtitle: '평균 5억원 자금 확보',
    description: '정부지원 연계 기술사업화',
    icon: Rocket,
    color: 'bg-green-100 text-green-600',
    href: '/services/tech-startup',
    benefits: ['평균 5억원 확보', '성공률 85%', '3년 사후관리'],
    price: '성공보수제',
    duration: '6-12개월'
  },
  {
    id: 'certification',
    title: '인증지원',
    subtitle: '연간 5천만원 세제혜택',
    description: '벤처·ISO·ESG 통합 인증',
    icon: Award,
    color: 'bg-blue-100 text-blue-600',
    href: '/services/certification',
    benefits: ['5천만원 세제혜택', '통합 인증 관리', '100% 취득 보장'],
    price: '300만원~',
    duration: '2-4개월'
  },
  {
    id: 'website',
    title: '웹사이트 구축',
    subtitle: '온라인 매출 30% 증대',
    description: 'AI 기반 디지털 혁신',
    icon: Globe,
    color: 'bg-indigo-100 text-indigo-600',
    href: '/services/website',
    benefits: ['매출 30% 증대', 'AI 기반 최적화', '무료 1년 관리'],
    price: '500만원~',
    duration: '1-3개월'
  }
];

// 실시간 성과 지표
const performanceMetrics = [
  { label: '완료 프로젝트', value: '324', suffix: '건', icon: Target },
  { label: '고객 만족도', value: '94.2', suffix: '%', icon: Star },
  { label: '성공률', value: '89', suffix: '%', icon: TrendingUp },
  { label: '절약 효과', value: '127', suffix: '억원', icon: BarChart3 }
];

export default function ServicesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 카테고리 필터링
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.id.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      {/* Hero Section - 모바일 최적화 */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 md:px-4 py-2 rounded-full mb-4 md:mb-6">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <span className="text-xs md:text-sm font-medium text-blue-800">6대 핵심 서비스</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
              기업 성장을 위한
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                맞춤형 솔루션
              </span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
              <strong>Business Model Zen</strong> 프레임워크를 기반으로 한 
              <strong>6대 핵심 서비스</strong>로 기업의 성장 단계별 맞춤 솔루션을 제공합니다.
            </p>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-4">
              <Badge variant="outline" className="text-xs md:text-sm px-2 py-1 md:px-4 md:py-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                맞춤형 컨설팅
              </Badge>
              <Badge variant="outline" className="text-xs md:text-sm px-2 py-1 md:px-4 md:py-2">
                <Shield className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                성과 보장
              </Badge>
              <Badge variant="outline" className="text-xs md:text-sm px-2 py-1 md:px-4 md:py-2">
                <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                전문가 지원
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 실시간 성과 지표 - 모바일 최적화 */}
      <section className="py-8 md:py-12 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
              실시간 성과 지표
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              기업의별 경영지도센터와 함께한 기업들의 성과
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="text-center p-4 md:p-6 card-hover border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <metric.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {metric.value}
                    <span className="text-sm md:text-base ml-1">{metric.suffix}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 목록 - 모바일 최적화 */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              6대 핵심 서비스
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              기업 성장 단계별 맞춤형 솔루션으로 경쟁력을 확보하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className={`card-hover border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  service.featured ? 'ring-2 ring-blue-500 ring-opacity-50 transform scale-105' : ''
                } relative`}
              >
                {service.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold">
                      ⭐ 추천 서비스
                    </div>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className={`w-14 h-14 md:w-16 md:h-16 ${service.color} rounded-lg flex items-center justify-center mb-4 md:mb-6`}>
                    <service.icon className="w-7 h-7 md:w-8 md:h-8" />
                  </div>
                  <CardTitle className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${service.featured ? 'text-blue-600' : 'text-gray-900'}`}>
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4 md:mb-6">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-xs md:text-sm text-gray-700">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600 mr-2 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  
                  {/* 서비스 정보 */}
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
                    <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                      <div>
                        <span className="text-gray-500 block mb-1">기간</span>
                        <span className="font-medium text-gray-900">{service.duration}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">비용</span>
                        <span className="font-medium text-gray-900">{service.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`font-semibold mb-3 md:mb-4 text-sm md:text-base ${service.featured ? 'text-blue-600' : 'text-primary'}`}>
                    ✓ {service.subtitle}
                  </div>
                  
                  <Button 
                    className={`w-full text-sm md:text-base py-2 md:py-3 h-auto touch-manipulation ${
                      service.featured 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                    onClick={() => router.push(service.href)}
                  >
                    {service.featured ? '지금 시작하기' : '자세히 보기'}
                    <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 - 모바일 최적화 */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              지금 바로 시작하세요!
            </h2>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-blue-100 px-4">
              무료 AI진단으로 우리 기업에 가장 적합한 서비스를 찾아보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-50 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto touch-manipulation"
                onClick={() => router.push('/diagnosis')}
              >
                <Brain className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                무료 AI진단 시작
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto touch-manipulation"
                onClick={() => router.push('/consultation')}
              >
                전문가 상담 신청
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 