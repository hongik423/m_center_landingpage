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
  Phone,
  Trophy,
  ThumbsUp
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 smooth-scroll">
      <Header />
      
      {/* 히어로 섹션 - 모바일 최적화 */}
      <section className="mobile-container py-16 lg:py-24 safe-area-top">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-mobile-3xl lg:text-6xl font-bold text-gray-900 mb-6 mobile-centered">
            <span className="text-overflow-safe">기업의별 M-CENTER</span>
            <br />
            <span className="text-overflow-safe bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              프리미엄 컨설팅 서비스
            </span>
          </h1>
          
          <p className="text-mobile-lg lg:text-xl text-gray-600 mb-8 max-w-4xl mx-auto mobile-text">
            25년 전문가 경험과 최신 AI 기술로 기업의 성장 잠재력을 최대화합니다.<br />
            매출 증대부터 디지털 혁신까지, 맞춤형 솔루션을 제공합니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              className="mobile-button touch-feedback bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl gpu-accelerated"
            >
              <Star className="w-5 h-5 mr-2" />
              <span className="text-overflow-safe">무료 전문가 진단 받기</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="mobile-button touch-feedback border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Phone className="w-5 h-5 mr-2" />
              <span className="text-overflow-safe">전문가 상담 (010-9251-9743)</span>
            </Button>
          </div>
          
          {/* 핵심 지표 - 모바일 그리드 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto">
            {[
              { number: '500+', label: '성공 프로젝트', icon: Trophy },
              { number: '95%', label: '고객 만족도', icon: ThumbsUp },
              { number: '25년', label: '전문가 경험', icon: Award },
              { number: '300%', label: '평균 매출 증대', icon: TrendingUp }
            ].map((stat, index) => (
              <div key={index} className="mobile-card bg-white text-center">
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-mobile-2xl font-bold text-gray-900 mb-1 text-overflow-safe">
                  {stat.number}
                </div>
                <p className="text-mobile-sm text-gray-600 mobile-text">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 카드 섹션 - 완전 모바일 최적화 */}
      <section className="mobile-container py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-mobile-2xl lg:text-4xl font-bold text-gray-900 mb-6 mobile-centered">
            <span className="text-overflow-safe">6대 핵심 서비스</span>
          </h2>
          <p className="text-mobile-base lg:text-lg text-gray-600 max-w-3xl mx-auto mobile-text">
            각 분야 전문가들이 제공하는 검증된 솔루션으로<br />
            확실한 성과를 경험하세요
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="service-card-mobile group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                {/* 서비스 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${service.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-mobile-xs font-bold ${service.badge.bg} ${service.badge.text}`}>
                    <span className="text-overflow-safe">{service.badge.text}</span>
                  </div>
                </div>
                
                {/* 서비스 제목 */}
                <h3 className="text-mobile-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors mobile-centered">
                  <span className="text-overflow-safe">{service.title}</span>
                </h3>
                
                {/* 서비스 설명 */}
                <p className="text-mobile-sm text-gray-600 mb-4 mobile-text leading-relaxed">
                  {service.description}
                </p>
                
                {/* 주요 특징 */}
                <div className="mb-6">
                  <h4 className="text-mobile-sm font-semibold text-gray-800 mb-2 text-overflow-safe">
                    ✨ 주요 특징
                  </h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-mobile-xs text-gray-600">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span className="mobile-text flex-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* 예상 성과 */}
                <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <h4 className="text-mobile-sm font-semibold text-blue-800 mb-2 text-overflow-safe">
                    📊 예상 성과
                  </h4>
                  <div className="space-y-1">
                    {service.expectedResults.map((result, resultIndex) => (
                      <div key={resultIndex} className="flex items-center gap-2 text-mobile-xs text-blue-700">
                        <TrendingUp className="w-3 h-3 flex-shrink-0" />
                        <span className="mobile-text">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 액션 버튼들 */}
                <div className="flex gap-3">
                  <Link href={service.href} className="flex-1">
                    <Button 
                      className="mobile-button w-full font-semibold py-3 transition-all duration-300 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 touch-feedback"
                    >
                      <span className="text-overflow-safe">자세히 보기</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Link href="/consultation" className="flex-1">
                    <Button 
                      className="mobile-button w-full font-semibold py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg touch-feedback"
                    >
                      <Phone className="mr-2 w-4 h-4" />
                      <span className="text-overflow-safe">전문가 상담 신청</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 