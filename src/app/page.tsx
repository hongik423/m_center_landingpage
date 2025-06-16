'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FloatingChatbot from '@/components/layout/floating-chatbot';
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
  Quote
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
    benefits: ['정부 100% 지원', '20주 집중 프로그램', '업무 효율성 40% 향상']
  },
  {
    id: 'factory-auction',
    title: '경매활용 공장구매',
    subtitle: '시장가 대비 40% 절약',
    description: '경매 활용 스마트 투자 전략',
    icon: Factory,
    color: 'bg-orange-100 text-orange-600',
    href: '/services/factory-auction',
    benefits: ['투자비 40% 절약', '전문가 동행', '완전 위탁 진행']
  },
  {
    id: 'tech-startup',
    title: '기술사업화/기술창업',
    subtitle: '평균 5억원 자금 확보',
    description: '정부지원 연계 기술사업화',
    icon: Rocket,
    color: 'bg-green-100 text-green-600',
    href: '/services/tech-startup',
    benefits: ['평균 5억원 확보', '성공률 85%', '3년 사후관리']
  },
  {
    id: 'certification',
    title: '인증지원',
    subtitle: '연간 5천만원 세제혜택',
    description: '벤처·ISO·ESG 통합 인증',
    icon: Award,
    color: 'bg-blue-100 text-blue-600',
    href: '/services/certification',
    benefits: ['5천만원 세제혜택', '통합 인증 관리', '100% 취득 보장']
  },
  {
    id: 'website',
    title: '웹사이트 구축',
    subtitle: '온라인 매출 30% 증대',
    description: 'AI 기반 디지털 혁신',
    icon: Globe,
    color: 'bg-indigo-100 text-indigo-600',
    href: '/services/website',
    benefits: ['매출 30% 증대', 'AI 기반 최적화', '무료 1년 관리']
  }
];

// 성장 단계 데이터
const growthStages = [
  {
    step: 'Step 1',
    period: '1-3년',
    title: '안정적 기반 구축',
    description: '창업 초기 필수 요소 완성',
    features: ['창업 자금 확보', '기본 인증 취득', '신뢰도 구축'],
    color: 'border-green-200 bg-green-50'
  },
  {
    step: 'Step 2',
    period: '3-7년',
    title: '성장 동력 강화',
    description: '조직 확장과 시스템 구축',
    features: ['조직 확장', '기술 고도화', '매출 확대'],
    color: 'border-blue-200 bg-blue-50'
  },
  {
    step: 'Step 3',
    period: '7-10년',
    title: '시장 주도 지위',
    description: '혁신 도입과 글로벌 진출',
    features: ['혁신 도입', '글로벌 진출', '생태계 구축'],
    color: 'border-purple-200 bg-purple-50'
  },
  {
    step: 'Step 4',
    period: '10년+',
    title: '지속가능 성장',
    description: '미래 지향적 기업 전환',
    features: ['디지털 전환', '사회적 책임', '미래 준비'],
    color: 'border-orange-200 bg-orange-50'
  }
];

// 실시간 지표 데이터
const performanceMetrics = [
  { label: '완료된 진단', value: '1,247', suffix: '건', icon: BarChart3 },
  { label: '성공 프로젝트', value: '324', suffix: '건', icon: Target },
  { label: '고객 절약 효과', value: '127', suffix: '억원', icon: TrendingUp },
  { label: '고객 만족도', value: '94.2', suffix: '%', icon: Star }
];

// 고객 후기 데이터
const testimonials = [
  {
    name: '김세무',
    title: '세무법인 대표',
    company: '○○세무법인',
    content: 'AI 진단을 통해 고객사에게 더 전문적인 솔루션을 제공할 수 있게 되었습니다. 고객 만족도가 크게 향상되었어요.',
    rating: 5
  },
  {
    name: '이창업',
    title: '대표이사',
    company: '스마트제조(주)',
    content: '공장구매 컨설팅으로 40% 이상 투자비를 절약했습니다. 전문가의 체계적인 지원이 정말 도움이 되었습니다.',
    rating: 5
  },
  {
    name: '박기술',
    title: 'CTO',
    company: '혁신테크',
    content: '기술사업화 지원을 받아 5억원 자금을 확보했습니다. 3년 사후관리까지 체계적으로 지원받고 있어요.',
    rating: 5
  }
];

// 숫자 카운트업 애니메이션 훅
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

// 메트릭 카드 컴포넌트
function MetricCard({ metric }: { metric: typeof performanceMetrics[0] }) {
  const count = useCountUp(parseInt(metric.value.replace('.', '')));
  const displayValue = metric.label === '고객 만족도' 
    ? (count / 10).toFixed(1) 
    : count.toLocaleString();

  return (
    <Card className="text-center p-6 card-hover">
      <CardContent className="p-0">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <metric.icon className="w-8 h-8 text-primary" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {displayValue}
          <span className="text-lg ml-1">{metric.suffix}</span>
        </div>
        <p className="text-gray-600 font-medium">{metric.label}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Business Model Zen으로<br />
              <span className="text-gradient">기업 성장의 5단계</span>를 완성하세요
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              AI, 공장구매, 기술창업, 인증, 웹사이트 - 5대 영역 통합 솔루션으로 
              기업별 맞춤 컨설팅을 경험하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4 font-semibold shadow-lg"
                onClick={() => window.location.href = '/services/business-analysis'}
              >
                🌟 BM ZEN 사업분석 시작하기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                className="btn-primary text-lg px-8 py-4"
                onClick={() => window.location.href = '/diagnosis'}
              >
                무료 진단 받기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button className="btn-secondary text-lg px-8 py-4">
                전문가 상담 신청
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5대 핵심 서비스 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              5대 핵심 서비스
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              기업 성장 단계별 맞춤형 솔루션으로 경쟁력을 확보하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className={`card-hover border-0 shadow-lg ${
                  service.featured ? 'ring-2 ring-blue-500 ring-opacity-50 transform scale-105' : ''
                } relative`}
              >
                {service.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      ⭐ 추천 서비스
                    </div>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${service.color} rounded-lg flex items-center justify-center mb-6`}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${service.featured ? 'text-blue-600' : 'text-gray-900'}`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  <div className={`font-semibold mb-4 ${service.featured ? 'text-blue-600' : 'text-primary'}`}>
                    ✓ {service.subtitle}
                  </div>
                  <Button 
                    className={`w-full ${
                      service.featured 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                    onClick={() => window.location.href = service.href}
                  >
                    {service.featured ? '지금 시작하기' : '자세히 보기'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 성장 단계별 가이드 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Business Model Zen 4단계 프레임워크
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              기업의 성장 단계에 맞는 맞춤형 지원으로 지속 가능한 성장을 실현하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthStages.map((stage, index) => (
              <Card key={index} className={`${stage.color} border-2 card-hover`}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {stage.step}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {stage.period}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 text-center">
                    {stage.description}
                  </p>
                  <ul className="space-y-2">
                    {stage.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 실시간 성과 지표 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              실시간 성과 지표
            </h2>
            <p className="text-xl text-gray-600">
              기업의별 경영지도센터와 함께한 기업들의 성과를 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>
      </section>

      {/* 고객 후기 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              고객 후기
            </h2>
            <p className="text-xl text-gray-600">
              실제 고객들의 생생한 경험담을 들어보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-primary/20" />
                    <div className="flex ml-auto">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.title}, {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 빠른 진단 CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              지금 바로 무료 진단을 받아보세요
            </h2>
            <p className="text-xl mb-8 opacity-90">
              단 15분 투자로 귀하의 기업에 맞는 맞춤형 성장 전략을 확인하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                onClick={() => window.location.href = '/services/diagnosis'}
              >
                무료 진단 시작하기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 text-lg"
                onClick={() => window.location.href = '/consultation'}
              >
                전문가와 상담하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* 플로팅 챗봇 */}
      <FloatingChatbot />
    </div>
  );
}
