'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Quote,
  Clock,
  FileText,
  Zap,
  Shield
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - 모바일 최적화 */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Business Model Zen으로<br />
              <span className="text-gradient">기업 성장의 5단계</span>를 완성하세요
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
              AI, 공장구매, 기술창업, 인증, 웹사이트 - 6대 영역 통합 솔루션으로 
              기업별 맞춤 컨설팅을 경험하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto font-semibold shadow-lg touch-manipulation"
                onClick={() => router.push('/services/business-analysis')}
              >
                🌟 BM ZEN 사업분석 시작하기
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button 
                className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto touch-manipulation"
                onClick={() => router.push('/services/diagnosis')}
              >
                ⚡ 무료 AI진단 신청
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button 
                className="btn-secondary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto touch-manipulation"
                onClick={() => router.push('/consultation')}
              >
                전문가 상담 신청
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 🤖 중앙 AI 상담사 섹션 - 신규 추가 */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-3 md:px-4 py-2 rounded-full mb-4 md:mb-6">
              <Brain className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 animate-pulse" />
              <span className="text-xs md:text-sm font-medium text-indigo-800">GEMINI AI 기반 스마트 상담</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              🧠 AI 상담사와 바로 채팅하기
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              <strong>GEMINI AI</strong> 기반의 전문 상담사가 24시간 대기 중입니다.<br />
              기업 성장에 관한 모든 궁금증을 바로 해결해보세요!
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
                  {/* 좌측: AI 상담사 소개 */}
                  <div>
                    <div className="flex items-center mb-4 md:mb-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">M-CENTER AI 상담사</h3>
                        <p className="text-sm md:text-base text-gray-600">GEMINI AI • 24시간 상담 가능</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm md:text-base text-gray-900">전문 분야별 맞춤 상담</p>
                          <p className="text-xs md:text-sm text-gray-600">BM분석, AI활용, 공장구매, 기술창업, 인증, 웹사이트</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm md:text-base text-gray-900">즉시 응답 및 정확한 정보</p>
                          <p className="text-xs md:text-sm text-gray-600">25년 경험 기반 DB + Google GEMINI AI</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm md:text-base text-gray-900">전문가 연결 및 후속 상담</p>
                          <p className="text-xs md:text-sm text-gray-600">필요시 경영지도사 직접 상담 (010-9251-9743)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-2">💬 상담 예시 질문:</h4>
                      <ul className="text-xs md:text-sm text-gray-700 space-y-1">
                        <li>• "우리 회사 매출을 늘리려면 어떻게 해야 하나요?"</li>
                        <li>• "AI 도입으로 업무 효율을 높이고 싶어요"</li>
                        <li>• "공장 구매를 저렴하게 하는 방법이 있나요?"</li>
                        <li>• "정부지원 사업은 어떤 것들이 있나요?"</li>
                      </ul>
                    </div>
                  </div>

                  {/* 우측: 즉시 채팅 시작 */}
                  <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-4 md:p-6 rounded-2xl">
                    <div className="text-center mb-4 md:mb-6">
                      <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">지금 바로 시작하세요!</h4>
                      <p className="text-sm md:text-base text-gray-600">우측 하단 채팅 아이콘을 클릭하거나<br />아래 버튼을 눌러 상담을 시작하세요</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <Button 
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 md:py-4 text-sm md:text-base h-auto shadow-lg"
                        onClick={() => {
                          // 플로팅 챗봇 활성화 (전역 상태나 이벤트 사용)
                          const chatbot = document.querySelector('[data-floating-chatbot]') as HTMLElement;
                          if (chatbot) {
                            chatbot.click();
                          } else {
                            // 플로팅 챗봇이 없으면 챗봇 페이지로 이동
                            router.push('/chatbot');
                          }
                        }}
                      >
                        <Brain className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        AI 상담사와 채팅 시작하기
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 py-2 md:py-3 text-sm md:text-base h-auto"
                        onClick={() => router.push('/consultation')}
                      >
                        📞 전문가 직접 상담 신청 (010-9251-9743)
                      </Button>
                    </div>

                    <div className="bg-white/80 p-3 rounded-xl border border-indigo-200">
                      <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                          <span>24시간</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                          <span>무료</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                          <span>즉시 응답</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6대 핵심서비스 - 모바일 최적화 */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              6대 핵심서비스
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
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
                <CardContent className="p-6 md:p-8">
                  <div className={`w-14 h-14 md:w-16 md:h-16 ${service.color} rounded-lg flex items-center justify-center mb-4 md:mb-6`}>
                    <service.icon className="w-7 h-7 md:w-8 md:h-8" />
                  </div>
                  <h3 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${service.featured ? 'text-blue-600' : 'text-gray-900'}`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                    {service.description}
                  </p>
                  <div className="space-y-2 mb-4 md:mb-6">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-xs md:text-sm text-gray-700">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600 mr-2 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
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

      {/* 성장 단계별 가이드 - 모바일 최적화 */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Business Model Zen 4단계 프레임워크
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              기업의 성장 단계에 맞는 맞춤형 지원으로 지속 가능한 성장을 실현하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {growthStages.map((stage, index) => (
              <Card key={index} className={`${stage.color} border-2 card-hover transition-all duration-300 hover:shadow-lg`}>
                <CardContent className="p-4 md:p-6">
                  <div className="text-center mb-3 md:mb-4">
                    <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                      {stage.step}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mb-2">
                      {stage.period}
                    </div>
                    <h3 className="font-bold text-base md:text-lg text-gray-900">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm mb-3 md:mb-4 text-center">
                    {stage.description}
                  </p>
                  <ul className="space-y-2">
                    {stage.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs md:text-sm text-gray-700">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600 mr-2 flex-shrink-0" />
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

      {/* 실시간 성과 지표 - 모바일 최적화 */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              실시간 성과 지표
            </h2>
            <p className="text-lg md:text-xl text-gray-600 px-4">
              기업의별 경영지도센터와 함께한 기업들의 성과를 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {performanceMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>
      </section>

      {/* 고객 후기 - 모바일 최적화 */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              고객 후기
            </h2>
            <p className="text-lg md:text-xl text-gray-600 px-4">
              실제 고객들의 생생한 경험담을 들어보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center mb-3 md:mb-4">
                    <Quote className="w-6 h-6 md:w-8 md:h-8 text-primary/20" />
                    <div className="flex ml-auto">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t pt-3 md:pt-4">
                    <div className="font-semibold text-gray-900 text-sm md:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      {testimonial.title}, {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 무료 AI진단 신청 섹션 - 모바일 최적화 */}
      <section id="ai-diagnosis" className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 md:px-4 py-2 rounded-full mb-4 md:mb-6">
              <Brain className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <span className="text-xs md:text-sm font-medium text-blue-800">무료 AI진단 신청 시스템</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              ⚡ 무료 AI진단 신청
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              복잡한 20여개 입력 항목을 <strong>8개 핵심 정보</strong>로 간소화!<br />
              2-3주 처리 시간을 <strong>2-3분</strong>으로 혁신한 새로운 AI진단 시스템
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {/* 개선 효과 비교 - 모바일 최적화 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              <Card className="text-center p-4 md:p-6 border-2 border-green-200 bg-green-50">
                <CardContent className="p-0">
                  <Clock className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-green-600" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">⚡ 처리 속도</h3>
                  <div className="space-y-2">
                    <div className="text-gray-500 line-through text-xs md:text-sm">기존: 2-3주</div>
                    <div className="text-green-600 font-bold text-base md:text-lg">신규: 2-3분</div>
                    <div className="text-xs md:text-sm text-green-600">99.9% 단축</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-4 md:p-6 border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-0">
                  <BarChart3 className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-blue-600" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">📝 입력 항목</h3>
                  <div className="space-y-2">
                    <div className="text-gray-500 line-through text-xs md:text-sm">기존: 20+ 항목</div>
                    <div className="text-blue-600 font-bold text-base md:text-lg">신규: 8개 항목</div>
                    <div className="text-xs md:text-sm text-blue-600">60% 간소화</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-4 md:p-6 border-2 border-purple-200 bg-purple-50">
                <CardContent className="p-0">
                  <FileText className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-purple-600" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">📊 보고서</h3>
                  <div className="space-y-2">
                    <div className="text-gray-500 line-through text-xs md:text-sm">기존: 5000자+</div>
                    <div className="text-purple-600 font-bold text-base md:text-lg">신규: AI진단 보고서</div>
                    <div className="text-xs md:text-sm text-purple-600">핵심 정보 집중</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 진단 과정 - 모바일 최적화 */}
            <Card className="mb-6 md:mb-8">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6 md:mb-8">
                  🎯 새로운 진단 과정 (3단계)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <span className="text-xl md:text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <h4 className="font-semibold text-base md:text-lg mb-2">8개 정보 입력</h4>
                    <p className="text-xs md:text-sm text-gray-600">회사명, 업종, 담당자 정보, 직원수, 성장단계, 고민사항, 예상혜택, 기대효과</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <span className="text-xl md:text-2xl font-bold text-green-600">2</span>
                    </div>
                    <h4 className="font-semibold text-base md:text-lg mb-2">AI 분석 수행</h4>
                    <p className="text-xs md:text-sm text-gray-600">SWOT 자동 분석, 현안상황 예측, 6개 서비스 매칭, 성과 예측 분석</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <span className="text-xl md:text-2xl font-bold text-purple-600">3</span>
                    </div>
                    <h4 className="font-semibold text-base md:text-lg mb-2">AI진단 보고서</h4>
                    <p className="text-xs md:text-sm text-gray-600">종합 평가 및 점수, 핵심 강점/기회, 맞춤 서비스 추천, 전문가 상담 안내</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 기대 효과 - 모바일 최적화 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                    즉시 확인 가능한 결과
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                      <span>100점 만점 종합 진단 점수</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                      <span>업계 내 시장 위치 및 성장률</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                      <span>SWOT 기반 핵심 분석</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                      <span>6개 서비스 중 최적 매칭</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-indigo-200 bg-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Award className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                    전문가 수준의 분석
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                      <span>매출 25-40% 증대 예측</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                      <span>업무 효율성 30-50% 향상</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                      <span>3-6개월 내 가시적 성과</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                      <span>즉시 실행 가능한 액션 플랜</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA 섹션 - 모바일 최적화 */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6 md:p-8 text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                  지금 바로 무료 AI진단을 신청하세요!
                </h3>
                <p className="text-blue-100 mb-4 md:mb-6 text-base md:text-lg">
                  8개 정보만 입력하면 2-3분 내에 전문가 수준의 AI진단 보고서를 받아볼 수 있습니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Button 
                onClick={() => router.push('/services/diagnosis')}
                    className="bg-white text-blue-600 hover:bg-gray-50 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto touch-manipulation"
              >
                    <Brain className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                무료 AI진단 신청하기
              </Button>
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm text-blue-100">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 md:w-4 md:h-4" />
                      <span>100% 무료</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span>2-3분 소요</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 md:w-4 md:h-4" />
                      <span>전문가 상담 가능</span>
            </div>
          </div>
        </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
