'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
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
  CheckCircle2,
  Phone,
  Bot
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MCenterChatInterface from '@/components/chatbot/MCenterChatInterface';

// 서비스 데이터 - 애플스토어 스타일로 업데이트
const services = [
  {
    id: 'business-analysis',
    title: '프리미엄 사업분석',
    subtitle: '신규사업 성공률 95%',
    description: '차세대 비즈니스 혁신 솔루션',
    icon: Cpu,
    color: 'bg-white text-white',
    bgColor: 'from-blue-50 to-purple-50',
    textColor: 'text-white',
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
    icon: Zap,
    color: 'bg-purple-100 text-purple-600',
    bgColor: 'from-purple-50 to-pink-50',
    textColor: 'text-white',
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
    textColor: 'text-white',
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
    textColor: 'text-white',
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
    textColor: 'text-white',
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
    textColor: 'text-white',
    href: '/services/website',
    benefits: ['매출 30% 증대', '지능형 최적화', '무료 1년 관리'],
    badge: '🌐 디지털'
  }
];

// 성장 단계 데이터 - 애플스토어 스타일로 업데이트
const growthStages = [
  {
    step: '1단계',
    period: '1-3년',
    title: '기반 구축',
    description: '창업 초기 필수 요소 완성',
    features: ['창업 자금 확보', '기본 인증 취득', '신뢰도 구축'],
    color: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    icon: '1'
  },
  {
    step: '2단계',
    period: '3-7년',
    title: '성장 가속화',
    description: '조직 확장과 시스템 구축',
    features: ['조직 확장', '기술 고도화', '매출 확대'],
    color: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    icon: '2'
  },
  {
    step: '3단계',
    period: '7-10년',
    title: '시장 지배력',
    description: '혁신 도입과 글로벌 진출',
    features: ['혁신 도입', '글로벌 진출', '생태계 구축'],
    color: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    icon: '3'
  },
  {
    step: '4단계',
    period: '10년+',
    title: '지속가능 혁신',
    description: '미래 지향적 기업 전환',
    features: ['디지털 전환', '사회적 책임', '미래 준비'],
    color: 'from-orange-50 to-yellow-50',
    borderColor: 'border-orange-200',
    icon: '4'
  }
];

// 실시간 지표 데이터
const performanceMetrics = [
  { label: '완료된 진단', value: '1,247', suffix: '건', icon: BarChart3, color: 'text-blue-600' },
  { label: '성공 프로젝트', value: '324', suffix: '건', icon: Target, color: 'text-green-600' },
  { label: '고객 절약 효과', value: '127', suffix: '억원', icon: TrendingUp, color: 'text-purple-600' },
  { label: '고객 만족도', value: '94.2', suffix: '%', icon: Star, color: 'text-orange-600' }
];

// 고객 후기 데이터
const testimonials = [
  {
    name: '김세무',
    title: '세무법인 대표',
    company: '○○세무법인',
    content: 'AI 진단을 통해 고객사에게 더 전문적인 솔루션을 제공할 수 있게 되었습니다. 고객 만족도가 크게 향상되었어요.',
    rating: 5,
    avatar: 'K'
  },
  {
    name: '이창업',
    title: '대표이사',
    company: '스마트제조(주)',
    content: '공장구매 컨설팅으로 40% 이상 투자비를 절약했습니다. 전문가의 체계적인 지원이 정말 도움이 되었습니다.',
    rating: 5,
    avatar: 'L'
  },
  {
    name: '박기술',
    title: 'CTO',
    company: '혁신테크',
    content: '기술사업화 지원을 받아 5억원 자금을 확보했습니다. 3년 사후관리까지 체계적으로 지원받고 있어요.',
    rating: 5,
    avatar: 'P'
  }
];

// 숫자 카운트업 애니메이션 훅
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

// 애플스토어 스타일 메트릭 카드 컴포넌트
function MetricCard({ metric }: { metric: typeof performanceMetrics[0] }) {
  const count = useCountUp(parseInt(metric.value.replace('.', '')));
  const displayValue = metric.label === '고객 만족도' 
    ? (count / 10).toFixed(1) 
    : count.toLocaleString();

  return (
    <div className="apple-card apple-animation-scale touch-target">
      <div className="text-center">
        <div className={`apple-icon-large bg-gradient-to-br from-blue-100 to-purple-100 mx-auto mb-4 
                        group-hover:scale-110 transition-transform duration-300`}>
          <metric.icon className={`w-8 h-8 ${metric.color}`} />
        </div>
        <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 ${metric.color} font-mono`}>
          <span className="text-overflow-safe">{displayValue}</span>
          <span className="text-lg ml-1 text-gray-500">{metric.suffix}</span>
        </div>
        <p className="apple-caption text-overflow-safe">{metric.label}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleChatbotConnect = () => {
    setIsConnecting(true);
    
    // "M센터장 챗봇과 연결하기...." 메시지 표시
    setTimeout(() => {
      setIsConnecting(false);
      setIsChatOpen(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 🍎 애플스토어 스타일 Hero Section */}
      <section className="apple-section bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-400 rounded-full blur-xl"></div>
        </div>
        
        <div className="mobile-container relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* 상단 배지 */}
            <div className="apple-badge-primary mb-8 apple-animation-fadeIn">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="font-semibold text-overflow-safe">프리미엄 비즈니스 혁신 프레임워크</span>
            </div>
            
            <h1 className="apple-title apple-animation-slideUp mobile-centered">
              <span className="block text-overflow-safe">기업 성장의 새로운 차원을</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-overflow-safe">
                경험하세요
              </span>
            </h1>
            
            <p className="apple-body max-w-3xl mx-auto apple-animation-slideUp mobile-text" 
               style={{ animationDelay: '0.2s' }}>
              <strong className="text-gray-800">혁신 AI, 스마트 투자, 기술창업, 프리미엄 인증, 디지털 혁신</strong> - 
              6대 영역 통합 솔루션으로 차원이 다른 비즈니스 성과를 만나보세요
            </p>
            
            <div className="apple-spacing-xs apple-animation-slideUp"
                 style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/services">
                  <button className="apple-button-primary mobile-full-width">
                    <Sparkles className="w-5 h-5 mr-2" />
                    <span className="text-overflow-safe">프리미엄 사업분석 시작하기</span>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </Link>
                
                <Link href="/diagnosis">
                  <button className="apple-button-secondary mobile-full-width">
                    <Zap className="w-5 h-5 mr-2" />
                    <span className="text-overflow-safe">무료 전문가 진단</span>
                  </button>
                </Link>
                
                <Link href="/consultation">
                  <button className="apple-button-outline mobile-full-width">
                    <Users className="w-5 h-5 mr-2" />
                    <span className="text-overflow-safe">전문가 상담 신청</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🍎 애플스토어 스타일 AI 상담사 섹션 */}
      <section className="apple-section bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="mobile-container">
          <div className="text-center mb-16">
            <div className="apple-badge-primary mb-8 apple-animation-fadeIn">
              <Cpu className="w-5 h-5 mr-2" />
              <span className="font-semibold text-overflow-safe">차세대 지능형 상담 시스템</span>
            </div>
            
            <h2 className="apple-subtitle apple-animation-slideUp mobile-centered">
              <span className="text-4xl mr-3">🤖</span>
              <span className="text-overflow-safe">M센터장과 바로 대화하기</span>
            </h2>
            
            <p className="apple-body max-w-4xl mx-auto mobile-text">
              <strong className="text-blue-600">최첨단 AI 기술</strong>로 무장한 전문 상담사가 24시간 대기 중입니다.<br />
              기업 성장에 관한 모든 궁금증을 지금 바로 해결해보세요!
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            {/* 애플스토어 스타일 - 완전히 새로운 디자인 */}
            <div className="bg-white rounded-none shadow-none relative overflow-hidden min-h-[80vh] flex items-center">
              
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* 좌측: 텍스트 콘텐츠 */}
                <div className="space-y-8 order-2 lg:order-1">
                  {/* 작은 라벨 */}
                  <div className="text-center lg:text-left">
                    <span className="inline-block text-lg font-medium text-gray-600 mb-4">
                      업무 혁신
                    </span>
                  </div>
                  
                  {/* 메인 타이틀 - 애플 스타일 */}
                  <div className="text-center lg:text-left">
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight tracking-tight mb-6">
                      완전히 새로운<br />
                      <span className="text-blue-600">AI 상담 경험</span>
                    </h2>
                  </div>
                  
                  {/* 설명 텍스트 */}
                  <div className="text-center lg:text-left max-w-lg mx-auto lg:mx-0">
                    <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                      안녕하세요, 이후경 경영지도사입니다. 28년간 쌓인 재무·인사·생산·마케팅의 
                      통합적 솔루션에 AI 기술을 접목하여 실무에서 전략까지 
                      폭발적인 일터혁신을 이끌어내는 성과중심 컨설팅을 제공합니다. 
                      <br /><br />
                      BM ZEN 사업분석, AI 생산성혁신, 공장경매, 기술창업, 인증지원, 
                      웹사이트구축 등 6대 핵심서비스를 통해 귀하의 기업이 
                      차원이 다른 성장을 경험할 수 있도록 직접 지도해드리겠습니다.
                    </p>
                  </div>
                  
                  {/* 애플 스타일 버튼 */}
                  <div className="text-center lg:text-left">
                    <button 
                      className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                      onClick={handleChatbotConnect}
                      disabled={isConnecting || isChatOpen}
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          M센터장 챗봇과 연결하기...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">+</span>
                          무료 체험해보기 및 자세히 알아보기
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 우측: 비주얼 영역 */}
                <div className="order-1 lg:order-2 relative">
                  <div className="relative w-full h-[500px] lg:h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl overflow-hidden shadow-2xl">
                    
                    {/* 배경 그라데이션 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20"></div>
                    
                    {/* 모니터 시뮬레이션 */}
                    <div className="absolute inset-8 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                      {/* 화면 내용 */}
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 relative">
                        
                        {/* 상단 메뉴바 */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800/50 backdrop-blur-sm flex items-center px-4">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 text-center">
                            <span className="text-white/70 text-xs">M-CENTER AI 상담 시스템</span>
                          </div>
                        </div>
                        
                        {/* 중앙 콘텐츠 */}
                        <div className="absolute inset-0 top-8 flex items-center justify-center p-8">
                          <div className="text-center text-white space-y-6">
                            {/* AI 아이콘 */}
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                              <Cpu className="w-10 h-10 text-white" />
                            </div>
                            
                            {/* 실시간 대화 시뮬레이션 */}
                            <div className="space-y-3 max-w-md">
                              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-left">
                                <p className="text-sm text-white/90">안녕하세요! M-CENTER M센터장입니다.</p>
                              </div>
                              <div className="bg-blue-500/80 backdrop-blur-sm rounded-2xl p-4 text-right ml-8">
                                <p className="text-sm text-white">우리 회사 매출 증대 방법을 알고 싶어요</p>
                              </div>
                              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-left">
                                <p className="text-sm text-white/90">BM ZEN 사업분석으로 20-40% 매출 성장이 가능합니다!</p>
                              </div>
                            </div>
                            
                            {/* 기능 배지들 */}
                            <div className="flex flex-wrap gap-2 justify-center">
                              <span className="px-3 py-1 bg-blue-500/30 backdrop-blur-sm rounded-full text-xs text-white/90">Advanced AI</span>
                              <span className="px-3 py-1 bg-green-500/30 backdrop-blur-sm rounded-full text-xs text-white/90">24시간</span>
                              <span className="px-3 py-1 bg-purple-500/30 backdrop-blur-sm rounded-full text-xs text-white/90">즉시응답</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 하단 상태바 */}
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-800/30 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white/50 text-xs">🟢 온라인 • 즉시 상담 가능</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 플로팅 엘리먼트들 */}
                    <div className="absolute top-20 right-8 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-bounce">
                      <span className="text-2xl">💡</span>
                    </div>
                    <div className="absolute bottom-20 left-8 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse">
                      <span className="text-xl">⚡</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                  
            
            {/* 애플스토어 스타일 하단 섹션 - 간단한 특징들 */}
            <div className="mt-24 pt-16 border-t border-gray-200">
              <div className="max-w-4xl mx-auto text-center space-y-16">
                
                {/* 핵심 특징들 - 애플 스타일 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">전문 분야별 맞춤 상담</h3>
                    <p className="text-gray-600 leading-relaxed">
                      사업분석, AI혁신, 공장구매, 기술창업, 인증, 웹사이트 등 6개 전문 분야
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">
                      <Zap className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">즉시 응답 및 정확한 분석</h3>
                    <p className="text-gray-600 leading-relaxed">
                      25년 전문가 경험과 차세대 AI 기술의 완벽한 융합
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-orange-100 rounded-2xl flex items-center justify-center">
                      <Phone className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">전문가 연결 및 후속 상담</h3>
                    <p className="text-gray-600 leading-relaxed">
                      필요시 이후경 M센터장 직접 상담 (010-9251-9743)
                    </p>
                  </div>
                </div>
                
                {/* 추가 액션 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/consultation">
                    <button className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white text-lg font-medium rounded-full transition-all duration-200">
                      상담신청하기
                    </button>
                  </Link>
                  
                  <a href="tel:010-9251-9743">
                    <button className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-900 text-lg font-medium rounded-full transition-all duration-200">
                      전화상담 (010-9251-9743)
                    </button>
                  </a>
                </div>
                
                {/* 상태 인디케이터 */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>24시간 상담</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>무료 진단</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>즉시 응답</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6대 핵심서비스 - 사용자 중심 개선 */}
      <section className="section-padding bg-white relative">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 bg-blue-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-400 rounded-full blur-2xl"></div>
        </div>
        
        <div className="mobile-container relative z-10">
          <div className="text-center mb-16">
            <div className="badge-primary mb-6 animate-bounce-gentle">
              <Star className="w-5 h-5 mr-2" />
              <span className="font-semibold text-overflow-safe">기업 성장 솔루션</span>
            </div>
            
            <h2 className="text-h1 text-gray-900 mb-4 mobile-centered">
              <span className="text-overflow-safe">6대 핵심서비스</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-4xl mx-auto mobile-text">
              기업 단계별 맞춤 솔루션으로 <strong className="text-blue-600">확실한 성과</strong>를 경험하세요<br />
              25년 전문가 경험 + 최신 AI 기술 = <strong className="text-purple-600">검증된 결과</strong>
            </p>
          </div>
          
          {/* 🔥 사용자 중심 서비스 그리드 - 우선순위 기반 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`service-card-mobile group relative overflow-hidden cursor-pointer
                           ${service.featured ? 'ring-2 ring-blue-400 ring-opacity-50 scale-[1.02] md:scale-105' : ''} 
                           bg-gradient-to-br ${service.bgColor} hover:shadow-2xl hover:-translate-y-3 
                           transition-all duration-300 animate-scale-in gpu-accelerated`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 🌟 특별 추천 배지 */}
                {service.featured && (
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                                    px-4 py-1.5 rounded-full text-xs font-bold shadow-xl animate-pulse">
                      최고 추천
                    </div>
                  </div>
                )}
                
                <CardContent className="p-6 h-full flex flex-col">
                  {/* 🎯 서비스 헤더 - 간소화 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${service.color} shadow-lg 
                                    group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <service.icon className="w-8 h-8" />
                    </div>
                    <Badge className="bg-white/90 text-gray-700 font-bold text-xs shadow-md">
                      {service.badge}
                    </Badge>
                  </div>
                  
                  {/* 📝 서비스 정보 - 핵심만 */}
                  <div className="mb-6 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 
                                   transition-colors mobile-centered leading-tight">
                      <span className="text-overflow-safe">{service.title}</span>
                    </h3>
                    
                    <div className="text-sm font-semibold text-blue-600 mb-3 mobile-text">
                      <span className="text-overflow-safe">{service.subtitle}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 mobile-text leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* 🎁 핵심 혜택 - 3개만 표시 */}
                    <div className="space-y-2">
                      {service.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 mobile-text font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 🚀 액션 버튼 - 명확한 CTA */}
                  <div className="space-y-3">
                    <Link href={service.href}>
                      <Button 
                        className={`mobile-button w-full font-semibold py-3 transition-all duration-300 
                                   shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]
                                   ${service.featured 
                                     ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                                     : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-400'
                                   } touch-feedback`}
                      >
                        <span className="text-overflow-safe">자세히 보기</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    
                    {/* 💬 빠른 상담 버튼 */}
                    <button 
                      className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium 
                                py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 touch-feedback"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const chatbot = document.querySelector('[data-floating-chatbot]') as HTMLElement;
                          if (chatbot) {
                            chatbot.click();
                          } else {
                            router.push('/consultation');
                          }
                        }
                      }}
                    >
                      💬 M센터장에게 바로 문의하기
                    </button>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>

          {/* 🎯 빠른 액션 섹션 */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mobile-centered">
                <span className="text-overflow-safe">어떤 서비스가 필요한지 모르겠다면?</span>
              </h3>
              <p className="text-gray-600 mb-6 mobile-text">
                AI 진단으로 맞춤형 솔루션을 추천받으세요 (소요시간: 3분)
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <Link href="/diagnosis">
                  <Button 
                    className="mobile-button btn-hero bg-gradient-to-r from-green-500 to-emerald-600 
                              hover:from-green-600 hover:to-emerald-700 text-white shadow-xl w-full sm:w-auto"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    <span className="text-overflow-safe">3분 무료 AI 진단</span>
                  </Button>
                </Link>
                
                <Link href="/consultation">
                  <Button 
                    className="mobile-button btn-secondary w-full sm:w-auto"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    <span className="text-overflow-safe">전문가 직접 상담</span>
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>무료 진단</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>즉시 결과</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>전문가 검증</span>
                </div>
              </div>
            </div>
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
      <section className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="mobile-container">
          <div className="text-center mb-16">
            <h2 className="text-h1 text-gray-900 mb-4 mobile-centered">
              <span className="text-overflow-safe">실시간 성과 지표</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto mobile-text">
              M-CENTER와 함께한 기업들의 실제 성과를 확인하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {performanceMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>
      </section>

      {/* 고객 추천 후기 - 토스 스타일 */}
      <section className="section-padding bg-white">
        <div className="mobile-container">
          <div className="text-center mb-16">
            <h2 className="text-h1 text-gray-900 mb-4 mobile-centered">
              <span className="text-overflow-safe">고객 성공 스토리</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto mobile-text">
              M-CENTER를 선택한 기업들의 진솔한 경험담을 들어보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="service-card-mobile bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 
                                    rounded-full flex items-center justify-center text-2xl mr-4">
                      {testimonial.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-gray-900 text-overflow-safe">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 text-overflow-safe">{testimonial.title}</p>
                      <p className="text-xs text-blue-600 font-medium text-overflow-safe">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-blue-200 mb-4" />
                  <p className="text-gray-700 italic leading-relaxed mobile-text">
                    {testimonial.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 기업 성장 단계별 맞춤 전략 */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mobile-container">
          <div className="text-center mb-16">
            <h2 className="text-h1 text-gray-900 mb-4 mobile-centered">
              <span className="text-overflow-safe">기업 성장 단계별 맞춤 전략</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-4xl mx-auto mobile-text">
              창업부터 지속가능한 혁신까지, 각 단계에 최적화된 솔루션을 제공합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {growthStages.map((stage, index) => (
              <Card key={index} className={`service-card-mobile text-center ${stage.color} hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{stage.icon}</div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 mb-4 inline-block">
                    <span className="text-sm font-bold text-gray-700 text-overflow-safe">{stage.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 text-overflow-safe">{stage.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 mobile-text">{stage.description}</p>
                  <div className="text-xs text-blue-600 font-medium mb-4 text-overflow-safe">{stage.period}</div>
                  
                  <div className="space-y-2">
                    {stage.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700 justify-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-overflow-safe">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-200 max-w-4xl mx-auto">
              <h3 className="text-h3 text-gray-900 mb-4 mobile-centered">
                <span className="text-overflow-safe">단계별 맞춤 전략 설계</span>
              </h3>
              <p className="text-gray-600 mb-6 mobile-text">
                귀하의 기업이 현재 어느 단계에 있든, M-CENTER는 다음 성장을 위한 
                최적의 로드맵을 제시합니다
              </p>
              <Link href="/diagnosis">
                {/* 🔥 개선된 우리 기업 성장 단계 진단받기 버튼 */}
                <Button className="mobile-button btn-hero bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <Target className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    <span className="text-overflow-safe">우리 기업 성장 단계 진단받기</span>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 무료 전문가 진단 섹션 - 프리미엄 표현 */}
      <section id="ai-diagnosis" className="section-padding bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Cpu className="w-5 h-5" />
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
                { icon: FileText, title: '보고서', before: '기존: 5000자+', after: '신규: 전문가 진단보고서', improvement: '핵심 정보 집중', color: 'from-purple-400 to-pink-500' }
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
                    {/* 🔥 개선된 무료 전문가 진단 신청하기 버튼 */}
                    <Button 
                      className="btn-hero bg-white text-blue-600 hover:bg-gray-50 shadow-xl transform hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      <span className="relative flex items-center">
                        <Cpu className="w-5 h-5 mr-2 group-hover:animate-pulse transition-transform duration-200" />
                        무료 전문가 진단 신청하기
                      </span>
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

      {/* M센터장 챗봇 인터페이스 */}
      <MCenterChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onMinimize={() => setIsChatOpen(false)}
      />

      {/* 연결 중 로딩 오버레이 */}
      {isConnecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">M센터장 챗봇과 연결하기...</h3>
            <p className="text-gray-600 mb-4">잠시만 기다려 주세요</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
