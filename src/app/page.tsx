'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Shield,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 서비스 데이터 - 프리미엄하고 신비로운 표현
const services = [
  {
    id: 'business-analysis',
    title: '프리미엄 사업분석',
    subtitle: '신규사업 성공률 95%',
    description: '차세대 비즈니스 혁신 솔루션',
    icon: Brain,
    color: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
    bgColor: 'from-blue-50 to-purple-50',
    href: '/services/business-analysis',
    benefits: ['95% 성공률 보장', '매출 4배 증가', '5단계 전략 프레임워크'],
    badge: '⭐ 추천',
    featured: true
  },
  {
    id: 'ai-productivity',
    title: '혁신 AI 솔루션',
    subtitle: '업무 효율성 40% 향상',
    description: '20주 프로그램으로 디지털 혁신 완성',
    icon: Brain,
    color: 'bg-purple-100 text-purple-600',
    bgColor: 'from-purple-50 to-pink-50',
    href: '/services/ai-productivity',
    benefits: ['정부 100% 지원', '20주 집중 프로그램', '업무 효율성 40% 향상'],
    badge: '🎯 정부지원'
  },
  {
    id: 'factory-auction',
    title: '스마트 공장투자',
    subtitle: '시장가 대비 40% 절약',
    description: '경매 활용 지능형 투자 전략',
    icon: Factory,
    color: 'bg-orange-100 text-orange-600',
    bgColor: 'from-orange-50 to-red-50',
    href: '/services/factory-auction',
    benefits: ['투자비 40% 절약', '전문가 동행', '완전 위탁 진행'],
    badge: '💰 절약'
  },
  {
    id: 'tech-startup',
    title: '기술사업화/창업',
    subtitle: '평균 5억원 자금 확보',
    description: '정부지원 연계 기술사업화',
    icon: Rocket,
    color: 'bg-green-100 text-green-600',
    bgColor: 'from-green-50 to-emerald-50',
    href: '/services/tech-startup',
    benefits: ['평균 5억원 확보', '성공률 85%', '3년 사후관리'],
    badge: '🚀 성장'
  },
  {
    id: 'certification',
    title: '프리미엄 인증지원',
    subtitle: '연간 5천만원 세제혜택',
    description: '벤처·ISO·ESG 통합 인증',
    icon: Award,
    color: 'bg-blue-100 text-blue-600',
    bgColor: 'from-blue-50 to-cyan-50',
    href: '/services/certification',
    benefits: ['5천만원 세제혜택', '통합 인증 관리', '100% 취득 보장'],
    badge: '🏆 인증'
  },
  {
    id: 'website',
    title: '디지털 혁신',
    subtitle: '온라인 매출 30% 증대',
    description: '차세대 디지털 솔루션',
    icon: Globe,
    color: 'bg-indigo-100 text-indigo-600',
    bgColor: 'from-indigo-50 to-violet-50',
    href: '/services/website',
    benefits: ['매출 30% 증대', '지능형 최적화', '무료 1년 관리'],
    badge: '🌐 디지털'
  }
];

// 성장 단계 데이터 - 신비롭고 고급스러운 표현
const growthStages = [
  {
    step: '1단계',
    period: '1-3년',
    title: '기반 구축',
    description: '창업 초기 필수 요소 완성',
    features: ['창업 자금 확보', '기본 인증 취득', '신뢰도 구축'],
    color: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50',
    icon: '🌱'
  },
  {
    step: '2단계',
    period: '3-7년',
    title: '성장 가속화',
    description: '조직 확장과 시스템 구축',
    features: ['조직 확장', '기술 고도화', '매출 확대'],
    color: 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50',
    icon: '🚀'
  },
  {
    step: '3단계',
    period: '7-10년',
    title: '시장 지배력',
    description: '혁신 도입과 글로벌 진출',
    features: ['혁신 도입', '글로벌 진출', '생태계 구축'],
    color: 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50',
    icon: '🏆'
  },
  {
    step: '4단계',
    period: '10년+',
    title: '지속가능 혁신',
    description: '미래 지향적 기업 전환',
    features: ['디지털 전환', '사회적 책임', '미래 준비'],
    color: 'border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50',
    icon: '⭐'
  }
];

// 실시간 지표 데이터 - 업데이트
const performanceMetrics = [
  { label: '완료된 진단', value: '1,247', suffix: '건', icon: BarChart3, color: 'text-blue-600' },
  { label: '성공 프로젝트', value: '324', suffix: '건', icon: Target, color: 'text-green-600' },
  { label: '고객 절약 효과', value: '127', suffix: '억원', icon: TrendingUp, color: 'text-purple-600' },
  { label: '고객 만족도', value: '94.2', suffix: '%', icon: Star, color: 'text-orange-600' }
];

// 고객 후기 데이터 - 업데이트
const testimonials = [
  {
    name: '김세무',
    title: '세무법인 대표',
    company: '○○세무법인',
    content: 'AI 진단을 통해 고객사에게 더 전문적인 솔루션을 제공할 수 있게 되었습니다. 고객 만족도가 크게 향상되었어요.',
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    name: '이창업',
    title: '대표이사',
    company: '스마트제조(주)',
    content: '공장구매 컨설팅으로 40% 이상 투자비를 절약했습니다. 전문가의 체계적인 지원이 정말 도움이 되었습니다.',
    rating: 5,
    avatar: '👨‍🔧'
  },
  {
    name: '박기술',
    title: 'CTO',
    company: '혁신테크',
    content: '기술사업화 지원을 받아 5억원 자금을 확보했습니다. 3년 사후관리까지 체계적으로 지원받고 있어요.',
    rating: 5,
    avatar: '👨‍💻'
  }
];

// 숫자 카운트업 애니메이션 훅 - 개선
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutQuart 이징 적용
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  // 교차 관찰자로 화면에 보일 때 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => setHasStarted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return count;
}

// 메트릭 카드 컴포넌트 - 토스 스타일 적용
function MetricCard({ metric }: { metric: typeof performanceMetrics[0] }) {
  const count = useCountUp(parseInt(metric.value.replace('.', '')));
  const displayValue = metric.label === '고객 만족도' 
    ? (count / 10).toFixed(1) 
    : count.toLocaleString();

  return (
    <Card className="result-card group cursor-pointer animate-scale-in">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl 
                        flex items-center justify-center mx-auto mb-4 
                        group-hover:scale-110 transition-transform duration-300">
          <metric.icon className={`w-8 h-8 ${metric.color}`} />
        </div>
        <div className={`text-4xl font-bold mb-2 ${metric.color} font-mono`}>
          {displayValue}
          <span className="text-lg ml-1 text-gray-500">{metric.suffix}</span>
        </div>
        <p className="text-gray-600 font-medium text-sm">{metric.label}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 신비롭고 고급스러운 표현 */}
      <section className="gradient-bg-hero section-padding relative overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-400 rounded-full blur-xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* 상단 배지 */}
            <div className="inline-flex items-center gap-2 badge-primary mb-6 animate-bounce-gentle">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">프리미엄 비즈니스 혁신 프레임워크</span>
            </div>
            
            <h1 className="text-hero text-gray-900 mb-6 leading-tight animate-slide-in">
              <span className="block">기업 성장의 새로운 차원을</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                경험하세요
              </span>
            </h1>
            
            <p className="text-body-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed px-4 animate-slide-in" 
               style={{ animationDelay: '0.2s' }}>
              <strong className="text-gray-800">혁신 AI, 스마트 투자, 기술창업, 프리미엄 인증, 디지털 혁신</strong> - 
              6대 영역 통합 솔루션으로 차원이 다른 비즈니스 성과를 만나보세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 animate-slide-in"
                 style={{ animationDelay: '0.4s' }}>
              <Link href="/services">
                <Button 
                  className="btn-hero bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                            text-white shadow-xl hover:shadow-2xl"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  프리미엄 사업분석 시작하기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link href="/diagnosis">
                <Button 
                  className="btn-primary bg-green-500 hover:bg-green-600"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  무료 전문가 진단
                </Button>
              </Link>
              
              <Link href="/consultation">
                <Button 
                  className="btn-secondary"
                >
                  <Users className="w-5 h-5 mr-2" />
                  전문가 상담 신청
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI 상담사 섹션 - 신비롭고 고급스러운 표현으로 변경 */}
      <section className="section-padding bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="badge-primary mb-6 animate-bounce-gentle">
              <Brain className="w-5 h-5 mr-2 animate-pulse" />
              <span className="font-semibold">차세대 지능형 상담 시스템</span>
            </div>
            
            <h2 className="text-h1 text-gray-900 mb-4 animate-slide-in">
              <span className="text-4xl mr-3">🧠</span>
              AI 전문 상담사와 바로 대화하기
            </h2>
            
            <p className="text-body-lg text-gray-600 max-w-4xl mx-auto">
              <strong className="text-blue-600">최첨단 AI 기술</strong>로 무장한 전문 상담사가 24시간 대기 중입니다.<br />
              기업 성장에 관한 모든 궁금증을 지금 바로 해결해보세요!
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Card className="result-card bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* 좌측: AI 상담사 소개 */}
                  <div className="animate-slide-in">
                    <div className="flex items-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 
                                      rounded-3xl flex items-center justify-center mr-6 shadow-lg">
                        <Brain className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-h3 text-gray-900 mb-1">M-CENTER 전문 AI 상담사</h3>
                        <div className="flex items-center gap-2">
                          <span className="badge-primary">Advanced AI</span>
                          <span className="badge-success">24시간 상담</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      {[
                        {
                          title: '전문 분야별 맞춤 상담',
                          desc: '사업분석, AI혁신, 공장구매, 기술창업, 인증, 웹사이트'
                        },
                        {
                          title: '즉시 응답 및 정확한 분석',
                          desc: '25년 전문가 경험 + 차세대 AI 기술 융합'
                        },
                        {
                          title: '전문가 연결 및 후속 상담',
                          desc: '필요시 경영지도사 직접 상담 (010-9251-9743)'
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        상담 예시 질문:
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        {[
                          "우리 회사 매출을 늘리려면 어떻게 해야 하나요?",
                          "혁신적인 기술 도입으로 경쟁력을 높이고 싶어요",
                          "공장 구매를 저렴하게 하는 방법이 있나요?",
                          "정부지원 사업은 어떤 것들이 있나요?"
                        ].map((question, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>"{question}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 우측: 즉시 채팅 시작 */}
                  <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-8 rounded-3xl animate-scale-in"
                       style={{ animationDelay: '0.3s' }}>
                    <div className="text-center mb-8">
                      <h4 className="text-h4 text-gray-900 mb-3">지금 바로 시작하세요!</h4>
                      <p className="text-gray-600">우측 하단 채팅 아이콘을 클릭하거나<br />아래 버튼을 눌러 상담을 시작하세요</p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <Button 
                        className="w-full btn-hero bg-gradient-to-r from-indigo-500 to-purple-600 
                                  hover:from-indigo-600 hover:to-purple-700"
                        onClick={() => {
                          const chatbot = document.querySelector('[data-floating-chatbot]') as HTMLElement;
                          if (chatbot) {
                            chatbot.click();
                          } else {
                            router.push('/chatbot');
                          }
                        }}
                      >
                        <Star className="w-5 h-5 mr-2 text-yellow-400" />
                        별-AI상담사와 채팅 시작하기
                      </Button>
                      
                      <Link href="/consultation">
                        <Button 
                          className="w-full btn-secondary"
                        >
                          <Users className="w-5 h-5 mr-2" />
                          전문가 직접 상담 신청 (010-9251-9743)
                        </Button>
                      </Link>
                    </div>

                    <div className="bg-white/90 p-4 rounded-2xl border border-indigo-200">
                      <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className="font-medium">24시간</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span className="font-medium">무료</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-green-500" />
                          <span className="font-medium">즉시 응답</span>
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

      {/* 6대 핵심서비스 - 토스 스타일 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-h1 text-gray-900 mb-4">
              6대 핵심서비스
            </h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              기업 성장 단계별 맞춤형 솔루션으로 경쟁력을 확보하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className={`service-card group relative overflow-hidden
                           ${service.featured ? 'ring-2 ring-blue-400 ring-opacity-50 scale-105' : ''} 
                           bg-gradient-to-br ${service.bgColor}`}
              >
                {service.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                                    px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      {service.badge}
                    </div>
                  </div>
                )}
                
                {/* 배경 아이콘 */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <service.icon className="w-16 h-16" />
                </div>
                
                <CardContent className="p-8 relative z-10">
                  <div className={`w-20 h-20 ${service.color} rounded-3xl flex items-center justify-center 
                                  mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-10 h-10" />
                  </div>
                  
                  <div className="text-center mb-6">
                    <span className="badge-primary mb-3 inline-block">{service.badge}</span>
                    <h3 className={`text-h4 mb-3 ${service.featured ? 'text-blue-600' : 'text-gray-900'}`}>
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  
                  <div className={`font-bold mb-6 text-center p-3 rounded-xl
                                  ${service.featured ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}>
                    ✓ {service.subtitle}
                  </div>
                  
                  <div className="space-y-3">
                    <Link href={service.href}>
                      <Button 
                        className={`w-full font-semibold py-3 transition-all duration-300 ${
                          service.featured 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg' 
                            : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg'
                        }`}
                      >
                        지금 시작하기
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <Link href={service.href}>
                      <Button 
                        variant="outline"
                        className="w-full font-semibold py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
                      >
                        자세히 보기
                        <FileText className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 성장 단계별 가이드 - 프리미엄 표현 */}
      <section className="section-padding gradient-bg-primary">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-h1 text-gray-900 mb-4">
              기업 성장 4단계 혁신 프레임워크
            </h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              기업의 성장 단계에 맞는 맞춤형 지원으로 지속 가능한 성장을 실현하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthStages.map((stage, index) => (
              <Card key={index} className={`card-hover border-2 transition-all duration-300 
                                          hover:shadow-xl ${stage.color} group`}>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stage.icon}
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {stage.step}
                    </div>
                    <div className="text-sm text-gray-600 mb-3 badge-primary">
                      {stage.period}
                    </div>
                    <h3 className="text-h4 text-gray-900 mb-3">
                      {stage.title}
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {stage.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-3">
                    {stage.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
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

      {/* 실시간 성과 지표 - 토스 스타일 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-h1 text-gray-900 mb-4">
              실시간 성과 지표
            </h2>
            <p className="text-body-lg text-gray-600">
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

      {/* 고객 후기 - 토스 스타일 */}
      <section className="section-padding gradient-bg-primary">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-h1 text-gray-900 mb-4">
              고객 후기
            </h2>
            <p className="text-body-lg text-gray-600">
              실제 고객들의 생생한 경험담을 들어보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="result-card group">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <Quote className="w-8 h-8 text-blue-300 mb-4" />
                  
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="border-t pt-4">
                    <div className="font-bold text-gray-900 text-lg">
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

      {/* 무료 전문가 진단 섹션 - 프리미엄 표현 */}
      <section id="ai-diagnosis" className="section-padding bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">차세대 지능형 진단 시스템</span>
            </div>
            
            <h2 className="text-h1 mb-6">
              <Zap className="inline-block w-12 h-12 mr-4 text-yellow-400" />
              무료 전문가 진단 신청
            </h2>
            
            <p className="text-body-lg max-w-4xl mx-auto text-blue-100">
              복잡한 20여개 입력 항목을 <strong className="text-white">8개 핵심 정보</strong>로 혁신적 간소화!<br />
              2-3주 처리 시간을 <strong className="text-white">2-3분</strong>으로 혁명적 단축
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* 개선 효과 비교 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Clock, title: '⚡ 처리 속도', before: '기존: 2-3주', after: '신규: 2-3분', improvement: '99.9% 단축', color: 'from-green-400 to-emerald-500' },
                { icon: BarChart3, title: '📝 입력 항목', before: '기존: 20+ 항목', after: '신규: 8개 항목', improvement: '60% 간소화', color: 'from-blue-400 to-cyan-500' },
                { icon: FileText, title: '📊 보고서', before: '기존: 5000자+', after: '신규: 전문가 진단보고서', improvement: '핵심 정보 집중', color: 'from-purple-400 to-pink-500' }
              ].map((item, index) => (
                <Card key={index} className={`text-center p-6 bg-gradient-to-br ${item.color} text-white border-0`}>
                  <CardContent className="p-0">
                    <item.icon className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <div className="space-y-2">
                      <div className="text-white/70 line-through text-sm">{item.before}</div>
                      <div className="font-bold text-lg">{item.after}</div>
                      <div className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full inline-block">
                        {item.improvement}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA 섹션 */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-h2 mb-4">
                  지금 바로 무료 전문가 진단을 신청하세요!
                </h3>
                <p className="text-blue-100 mb-8 text-lg">
                  8개 정보만 입력하면 2-3분 내에 전문가 수준의 진단 보고서를 받아볼 수 있습니다.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Link href="/diagnosis">
                    <Button 
                      className="btn-hero bg-white text-blue-600 hover:bg-gray-50 shadow-xl"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      무료 전문가 진단 신청하기
                    </Button>
                  </Link>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
                  {[
                    { icon: Shield, text: '100% 무료' },
                    { icon: Clock, text: '2-3분 소요' },
                    { icon: Users, text: '전문가 상담 가능' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
