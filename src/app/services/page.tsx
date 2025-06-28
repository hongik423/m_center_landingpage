'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';

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
  Shield,
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  Phone
} from 'lucide-react';

// 서비스 데이터 - 토스 스타일 업데이트
const services = [
  {
    id: 'business-analysis',
    title: 'BM ZEN 사업분석',
    subtitle: '신규사업 성공률 95%',
    description: '세무사를 위한 비즈니스 혁신 솔루션',
    icon: Brain,
    color: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
    bgColor: 'from-blue-50 to-purple-50',
    href: '/services/business-analysis',
    benefits: ['95% 성공률 보장', '세무사 수익 4배 증가', '5단계 BM ZEN 프레임워크'],
    duration: '6-12개월',
    badge: '⭐ 추천',
    featured: true,
    features: [
      '시장분석 및 경쟁력 진단',
      '수익모델 최적화 설계',
      '고객세그먼트 재정의',
      '디지털 전환 로드맵',
      '성과측정 체계 구축'
    ],
    expectedResults: [
      '신규사업 성공률 95% 달성',
      '세무사 평균 수익 4배 증가',
      '고객 만족도 30% 향상',
      '업무 프로세스 50% 효율화'
    ]
  },
  {
    id: 'ai-productivity',
    title: 'AI 활용 생산성향상',
    subtitle: '업무 효율성 40% 향상',
    description: '20주 프로그램으로 AI 혁신 완성',
    icon: Brain,
    color: 'bg-purple-100 text-purple-600',
    bgColor: 'from-purple-50 to-pink-50',
    href: '/services/ai-productivity',
    benefits: ['정부 100% 지원', '20주 집중 프로그램', '업무 효율성 40% 향상'],
    duration: '20주',
    badge: '🎯 정부지원',
    features: [
      'ChatGPT & Copilot 실무 활용',
      'AI 도구 통합 워크플로우',
      '자동화 프로세스 구축',
      '데이터 분석 AI 활용',
      '맞춤형 AI 도구 개발'
    ],
    expectedResults: [
      '업무 처리 시간 40% 단축',
      '문서 작성 효율 60% 향상',
      '데이터 분석 속도 3배 증가',
      '반복 업무 80% 자동화'
    ]
  },
  {
    id: 'factory-auction',
    title: '경매활용 공장구매',
    subtitle: '시장가 대비 40% 절약',
    description: '경매 활용 스마트 투자 전략',
    icon: Factory,
    color: 'bg-orange-100 text-orange-600',
    bgColor: 'from-orange-50 to-red-50',
    href: '/services/factory-auction',
    benefits: ['투자비 40% 절약', '전문가 동행', '완전 위탁 진행'],
    duration: '3-6개월',
    badge: '💰 절약',
    features: [
      '경매 물건 사전 조사',
      '법무/세무 리스크 검토',
      '현장 실사 및 평가',
      '입찰 전략 수립',
      '사후 관리 및 지원'
    ],
    expectedResults: [
      '시장가 대비 30-50% 절약',
      '법무 리스크 99% 해결',
      '투자 회수 기간 30% 단축',
      '추가 투자 기회 발굴'
    ]
  },
  {
    id: 'tech-startup',
    title: '기술사업화/기술창업',
    subtitle: '평균 5억원 자금 확보',
    description: '정부지원 연계 기술사업화',
    icon: Rocket,
    color: 'bg-green-100 text-green-600',
    bgColor: 'from-green-50 to-emerald-50',
    href: '/services/tech-startup',
    benefits: ['평균 5억원 확보', '성공률 85%', '3년 사후관리'],
    duration: '6-12개월',
    badge: '🚀 성장',
    features: [
      '기술 사업성 검토',
      '정부과제 기획 및 신청',
      '투자유치 지원',
      '특허 및 IP 전략',
      '사업화 실행 지원'
    ],
    expectedResults: [
      '정부지원금 평균 5억원',
      '기술사업화 성공률 85%',
      '매출 증대 300% 달성',
      '기업가치 10배 증가'
    ]
  },
  {
    id: 'certification',
    title: '인증지원',
    subtitle: '연간 5천만원 세제혜택',
    description: '벤처·ISO·ESG 통합 인증',
    icon: Award,
    color: 'bg-blue-100 text-blue-600',
    bgColor: 'from-blue-50 to-cyan-50',
    href: '/services/certification',
    benefits: ['5천만원 세제혜택', '통합 인증 관리', '100% 취득 보장'],
    duration: '2-4개월',
    badge: '🏆 인증',
    features: [
      '벤처기업 인증',
      'ISO 9001/14001 인증',
      'ESG 경영 체계 구축',
      '연구개발전담부서 인정',
      '기업부설연구소 설립'
    ],
    expectedResults: [
      '연간 세제혜택 5천만원',
      '정부과제 우선 선정',
      '대기업 납품 자격 확보',
      '기업 신뢰도 300% 향상'
    ]
  },
  {
    id: 'website',
    title: '웹사이트 구축',
    subtitle: '온라인 매출 30% 증대',
    description: 'AI 기반 디지털 혁신',
    icon: Globe,
    color: 'bg-indigo-100 text-indigo-600',
    bgColor: 'from-indigo-50 to-violet-50',
    href: '/services/website',
    benefits: ['매출 30% 증대', 'AI 기반 최적화', '1년 관리 포함'],
    duration: '1-3개월',
    badge: '🌐 디지털',
    features: [
      'SEO 최적화 웹사이트',
      'AI 챗봇 통합',
      '반응형 모바일 디자인',
      '구글 애널리틱스 연동',
      '마케팅 자동화 시스템'
    ],
    expectedResults: [
      '온라인 매출 300% 증가',
      '구글 검색 상위 노출',
      '고객 문의 500% 증가',
      '브랜드 인지도 대폭 향상'
    ]
  }
];

// 실시간 성과 지표 - 업데이트
const performanceMetrics = [
  { label: '완료 프로젝트', value: '324', suffix: '건', icon: Target, color: 'text-green-600', bgColor: 'bg-green-100' },
  { label: '고객 만족도', value: '94.2', suffix: '%', icon: Star, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { label: '성공률', value: '89', suffix: '%', icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { label: '절약 효과', value: '127', suffix: '억원', icon: BarChart3, color: 'text-purple-600', bgColor: 'bg-purple-100' }
];

// 카운트업 애니메이션 훅
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
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  useEffect(() => {
    const timer = setTimeout(() => setHasStarted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return count;
}

// 메트릭 카드 컴포넌트
function MetricCard({ metric, delay = 0 }: { metric: typeof performanceMetrics[0], delay?: number }) {
  const count = useCountUp(parseInt(metric.value.replace('.', '')), 2000);
  const displayValue = metric.label === '고객 만족도' 
    ? (count / 10).toFixed(1) 
    : count.toLocaleString();

  return (
    <Card className="result-card group cursor-pointer animate-scale-in" 
          style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-6 text-center">
        <div className={`w-16 h-16 ${metric.bgColor} rounded-2xl 
                        flex items-center justify-center mx-auto mb-4 
                        group-hover:scale-110 transition-transform duration-300`}>
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

export default function ServicesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 카테고리 필터링
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.id.includes(selectedCategory));

  return (
    <div className="min-h-screen gradient-bg-hero">
      <Header />
      
      {/* Hero Section - 토스 스타일 */}
      <section className="section-padding relative overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 bg-blue-400 rounded-full blur-2xl"></div>
          <div className="absolute top-10 right-20 w-60 h-60 bg-purple-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-1/3 w-50 h-50 bg-green-400 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* 상단 배지 */}
            <div className="badge-primary mb-6 animate-bounce-gentle">
              <Zap className="w-5 h-5 mr-2" />
              <span className="font-semibold">6대 핵심 서비스</span>
            </div>
            
            <h1 className="text-hero text-gray-900 mb-6 leading-tight animate-slide-in">
              기업 성장을 위한
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                맞춤형 솔루션
              </span>
            </h1>
            
            <p className="text-body-lg text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-slide-in"
               style={{ animationDelay: '0.2s' }}>
              <strong className="text-gray-800">Business Model Zen</strong> 프레임워크를 기반으로 한 
              <strong className="text-blue-600">6대 핵심 서비스</strong>로 기업의 성장 단계별 맞춤 솔루션을 제공합니다.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-in"
                 style={{ animationDelay: '0.4s' }}>
              {[
                { icon: CheckCircle2, text: '맞춤형 컨설팅' },
                { icon: Shield, text: '성과 보장' },
                { icon: Users, text: '전문가 지원' },
                { icon: Star, text: '95% 만족도' }
              ].map((item, index) => (
                <div key={index} className="badge-primary">
                  <item.icon className="w-4 h-4 mr-2" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 실시간 성과 지표 - 토스 스타일 */}
      <section className="py-12 bg-white/90 backdrop-blur-sm">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 text-gray-900 mb-3">
              실시간 성과 지표
            </h2>
            <p className="text-body text-gray-600">
              기업의별 경영지도센터와 함께한 기업들의 성과
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {performanceMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 목록 - 토스 스타일 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-h1 text-gray-900 mb-4">
              6대 핵심 서비스
            </h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              기업 성장 단계별 맞춤형 솔루션으로 경쟁력을 확보하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className={`service-card group relative overflow-hidden p-0
                           ${service.featured ? 'ring-2 ring-blue-400 ring-opacity-50' : ''} 
                           bg-gradient-to-br ${service.bgColor} hover:shadow-2xl`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {service.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                                    px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {service.badge}
                    </div>
                  </div>
                )}
                
                {/* 배경 아이콘 */}
                <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <service.icon className="w-24 h-24" />
                </div>
                
                <CardContent className="p-8 relative z-10">
                  {/* 헤더 섹션 */}
                  <div className="flex items-start gap-6 mb-8">
                    <div className={`w-20 h-20 ${service.color} rounded-3xl flex items-center justify-center 
                                    shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <service.icon className="w-10 h-10" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge-primary text-xs">{service.badge}</span>
                      </div>
                      <h3 className={`text-h3 mb-2 ${service.featured ? 'text-blue-600' : 'text-gray-900'}`}>
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {service.description}
                      </p>
                      <div className={`font-bold text-lg ${service.featured ? 'text-blue-600' : 'text-green-600'}`}>
                        ✓ {service.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* 서비스 정보 */}
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    <div className="bg-white/80 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">진행 기간</span>
                      </div>
                      <span className="font-semibold text-gray-900">{service.duration}</span>
                    </div>
                  </div>

                  {/* 주요 기능 */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      주요 서비스
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 기대 효과 */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      기대 효과
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {service.expectedResults.map((result, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <Star className="w-4 h-4 text-orange-500 mr-3 flex-shrink-0" />
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 버튼 그룹 */}
                  <div className="flex gap-3">
                    <Link href={service.href} className="flex-1">
                      <Button 
                        className="w-full font-semibold py-3 transition-all duration-300 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                      >
                        자세히 보기
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <Link href="/consultation" className="flex-1">
                      <Button 
                        className="w-full font-semibold py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                      >
                        전문가 상담 신청
                        <Phone className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 프로세스 섹션 */}
      <section className="section-padding gradient-bg-primary">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-h1 text-gray-900 mb-4">
              서비스 프로세스
            </h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              체계적이고 투명한 프로세스로 최고의 결과를 보장합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '1단계',
                title: '무료 진단',
                description: 'AI 기반 현황 분석과 전문가 상담',
                icon: '🔍',
                color: 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50'
              },
              {
                step: '2단계',
                title: '맞춤 제안',
                description: '기업별 최적 솔루션 설계',
                icon: '📋',
                color: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
              },
              {
                step: '3단계',
                title: '실행 지원',
                description: '전문가 팀과 함께 단계별 실행',
                icon: '🚀',
                color: 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
              },
              {
                step: '4단계',
                title: '성과 관리',
                description: '지속적인 모니터링과 개선',
                icon: '📈',
                color: 'border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50'
              }
            ].map((process, index) => (
              <Card key={index} className={`card-hover border-2 transition-all duration-300 
                                          hover:shadow-xl ${process.color} group`}>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {process.icon}
                  </div>
                  
                  <div className="badge-primary mb-4 inline-block">
                    {process.step}
                  </div>
                  
                  <h3 className="text-h4 text-gray-900 mb-3">
                    {process.title}
                  </h3>
                  
                  <p className="text-gray-700 text-sm">
                    {process.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 - 토스 스타일 */}
      <section className="section-padding bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-h1 mb-6">
              지금 바로 시작하세요!
            </h2>
            <p className="text-body-lg mb-8 text-blue-100">
              무료 AI진단으로 우리 기업에 가장 적합한 서비스를 찾아보세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/diagnosis">
                <Button 
                  className="btn-hero bg-white text-blue-600 hover:bg-gray-50 shadow-xl"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  무료 AI진단 시작
                </Button>
              </Link>
              <Link href="/consultation">
                <Button 
                  className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  전문가 상담 신청
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
              {[
                { icon: Shield, text: '100% 만족 보장' },
                { icon: Clock, text: '신속한 대응' },
                { icon: Users, text: '전문가 팀 지원' },
                { icon: Star, text: '검증된 성과' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 