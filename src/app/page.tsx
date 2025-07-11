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

// 서비스 데이터 - 경영지도센터 6대 서비스
const services = [
  {
    id: 'business-analysis',
    title: '사업분석 컨설팅',
    subtitle: '체계적 사업 분석',
    description: '데이터 기반 사업 분석으로 성장 전략 수립',
    icon: BarChart3,
    color: 'bg-white text-white',
    bgColor: 'from-green-50 to-emerald-50',
    textColor: 'text-white',
    href: '/services/business-analysis',
    benefits: ['수익성 분석', '시장 분석', '경쟁력 강화'],
    badge: '추천',
    featured: true
  },
  {
    id: 'ai-productivity',
    title: 'AI 일터혁신',
    subtitle: '디지털 전환 지원',
    description: 'AI 기술 도입으로 생산성 극대화',
    icon: Cpu,
    color: 'bg-blue-100 text-blue-600',
    bgColor: 'from-blue-50 to-cyan-50',
    textColor: 'text-white',
    href: '/services/ai-productivity',
    benefits: ['생산성 향상', '업무 자동화', '디지털 혁신'],
    badge: '혁신'
  },
  {
    id: 'policy-funding',
    title: '정책자금 지원',
    subtitle: '맞춤형 자금 조달',
    description: '정부 정책자금 및 투자 유치 지원',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-600',
    bgColor: 'from-green-50 to-emerald-50',
    textColor: 'text-white',
    href: '/services/policy-funding',
    benefits: ['정책자금 확보', '투자 유치', '자금 조달'],
    badge: '자금'
  },
  {
    id: 'tech-startup',
    title: '기술창업 지원',
    subtitle: '창업 생태계 구축',
    description: '기술 기반 창업 및 사업화 지원',
    icon: Rocket,
    color: 'bg-orange-100 text-orange-600',
    bgColor: 'from-orange-50 to-red-50',
    textColor: 'text-white',
    href: '/services/tech-startup',
    benefits: ['창업 지원', '사업화 지원', '기술 개발'],
    badge: '창업'
  },
  {
    id: 'certification',
    title: '벤처/ISO/인증',
    subtitle: '전문 인증 서비스',
    description: '벤처기업 인증 및 ISO 인증 지원',
    icon: Award,
    color: 'bg-purple-100 text-purple-600',
    bgColor: 'from-purple-50 to-pink-50',
    textColor: 'text-white',
    href: '/services/certification',
    benefits: ['벤처 인증', 'ISO 인증', '품질 인증'],
    badge: '인증'
  },
  {
    id: 'website',
    title: '매출증대웹페이지',
    subtitle: '디지털 마케팅',
    description: '매출 증대를 위한 웹사이트 구축',
    icon: Globe,
    color: 'bg-indigo-100 text-indigo-600',
    bgColor: 'from-indigo-50 to-violet-50',
    textColor: 'text-white',
    href: '/services/website',
    benefits: ['매출 증대', '온라인 마케팅', '웹사이트 구축'],
    badge: '매출'
  }
];

// 인증 단계 데이터 - ESG 인증원 프로세스
const certificationStages = [
  {
    step: '1단계',
    period: '1-2주',
    title: '신청 및 접수',
    description: '인증 신청서 제출 및 검토',
    features: ['온라인 신청', '서류 검토', '계약 체결'],
    color: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    icon: '1'
  },
  {
    step: '2단계',
    period: '2-4주',
    title: '문서 심사',
    description: '경영시스템 문서 검토',
    features: ['문서 검토', '부적합 사항 도출', '개선 요청'],
    color: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    icon: '2'
  },
  {
    step: '3단계',
    period: '1-2일',
    title: '현장 심사',
    description: '실제 현장에서 시스템 운영 확인',
    features: ['현장 방문', '시스템 확인', '심사 보고서 작성'],
    color: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    icon: '3'
  },
  {
    step: '4단계',
    period: '1-2주',
    title: '인증서 발급',
    description: '최종 검토 후 인증서 발급',
    features: ['최종 검토', '인증서 발급', '사후 관리 시작'],
    color: 'from-orange-50 to-yellow-50',
    borderColor: 'border-orange-200',
    icon: '4'
  }
];

// 고객 후기 데이터
const testimonials = [
  {
    name: '김대표',
    title: '제조업체 대표',
    company: '○○제조(주)',
    content: 'ISO 9001 인증을 통해 품질관리 시스템을 체계화했습니다. 고객 신뢰도가 크게 향상되었고 해외 수출도 확대되었어요.',
    rating: 5,
    avatar: 'K'
  },
  {
    name: '이부장',
    title: '품질관리부장',
    company: '○○건설(주)',
    content: 'ESG 경영시스템 인증으로 지속가능경영을 실현했습니다. 전문적인 심사와 사후관리까지 체계적으로 지원받았습니다.',
    rating: 5,
    avatar: 'L'
  },
  {
    name: '박과장',
    title: '환경안전과장',
    company: '○○화학(주)',
    content: 'ISO 14001, 45001 통합 인증을 받았습니다. 환경과 안전 리스크가 크게 감소했고 직원들의 만족도도 높아졌어요.',
    rating: 5,
    avatar: 'P'
  }
];

export default function Home() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleChatbotConnect = () => {
    setIsConnecting(true);
    
    // "ESG 인증 전문가와 연결하기...." 메시지 표시
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
        
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-20 md:py-24 lg:py-32 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* 상단 배지 */}
            <div className="apple-badge-primary mb-8 apple-animation-fadeIn">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="font-semibold text-overflow-safe">경영지도센터 6대 핵심 서비스</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight apple-animation-slideUp mobile-centered">
              <span className="block text-overflow-safe">기업 성장의 새로운 패러다임을</span>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-overflow-safe">
                제시합니다
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed apple-animation-slideUp mobile-text" 
               style={{ animationDelay: '0.2s' }}>
              <strong className="text-gray-800">사업분석, AI일터혁신, 정책자금, 기술창업, 벤처인증, 매출증대웹페이지</strong> - 6대 핵심 서비스로 기업의 지속가능한 성장을 지원합니다
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 apple-animation-slideUp"
                 style={{ animationDelay: '0.4s' }}>
              <Link href="/services/business-analysis">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    6대 서비스 시작하기
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Button>
              </Link>
              
              <Link href="/consultation">
                <Button 
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-green-600 text-gray-700 hover:text-green-600 hover:bg-green-50 transform hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    무료 상담 신청
                  </span>
                </Button>
              </Link>
              
              <Link href="/diagnosis">
                <Button 
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-2 border-emerald-300 hover:border-emerald-600 text-emerald-700 hover:text-emerald-600 hover:bg-emerald-50 transform hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    무료 진단 신청
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🍎 애플스토어 스타일 AI 상담사 섹션 */}
      <section className="apple-section bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-20 md:py-24 lg:py-32">
          <div className="text-center mb-16">
            <div className="apple-badge-primary mb-8 apple-animation-fadeIn">
              <Cpu className="w-5 h-5 mr-2" />
              <span className="font-semibold text-overflow-safe">차세대 지능형 상담 시스템</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 apple-animation-slideUp mobile-centered">
              <span className="text-overflow-safe">경영지도센터 전문가와 바로 대화하기</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed mobile-text">
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
                      <span className="text-green-600">성장 코칭 경험</span>
                    </h2>
                  </div>
                  
                  {/* 설명 텍스트 */}
                  <div className="text-center lg:text-left max-w-lg mx-auto lg:mx-0">
                    <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                      안녕하세요, 경영지도센터 이후경 경영지도사입니다. 25년간 500개 이상 기업의 성장을 지원한 
                      전문가로서 공평성, 전문성, 신뢰성을 바탕으로 최고 수준의 경영지도 서비스를 제공합니다. 
                      <br /><br />
                      사업분석, AI일터혁신, 정책자금, 기술창업, 벤처인증, 매출증대웹페이지 등 
                      6대 핵심 서비스를 통해 귀하의 기업이 
                      지속가능한 성장을 경험할 수 있도록 전문적으로 지원해드리겠습니다.
                    </p>
                  </div>
                  
                  {/* 애플 스타일 버튼 */}
                  <div className="text-center lg:text-left">
                    <button 
                      className="touch-target-enhanced ios-touch-feedback mobile-button-enhanced inline-flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                      onClick={handleChatbotConnect}
                      disabled={isConnecting || isChatOpen}
                      style={{ minHeight: '48px', touchAction: 'manipulation' }}
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ESG 인증 전문가와 연결하기...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">+</span>
                          무료 경영지도 상담 시작하기
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
                            <span className="text-white/70 text-xs">ESG 인증원 상담 시스템</span>
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
                                <p className="text-sm text-white/90">안녕하세요! 경영지도센터 이후경 경영지도사입니다.</p>
                              </div>
                              <div className="bg-green-500/80 backdrop-blur-sm rounded-2xl p-4 text-right ml-8">
                                <p className="text-sm text-white">사업분석을 받고 싶은데 어떻게 시작해야 하나요?</p>
                              </div>
                              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-left">
                                <p className="text-sm text-white/90">6대 핵심 서비스로 기업 성장을 지원해드리겠습니다!</p>
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
                                              <span className="text-2xl">✓</span>
                    </div>
                                          <div className="absolute bottom-20 left-8 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse">
                        <span className="text-xl">✓</span>
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
              ESG 경영시스템, ISO 9001, ISO 14001, ISO 45001 등 인증 전문 분야
            </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">
                      <Zap className="w-8 h-8 text-green-600" />
                    </div>
                                <h3 className="text-xl font-semibold text-gray-900">즉시 응답 및 정확한 분석</h3>
            <p className="text-gray-600 leading-relaxed">
              ESG 인증 전문가 경험과 체계적인 인증 프로세스의 완벽한 융합
            </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-orange-100 rounded-2xl flex items-center justify-center">
                      <Phone className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">전문가 연결 및 후속 상담</h3>
                    <p className="text-gray-600 leading-relaxed">
                      필요시 이후경 경영지도사 직접 상담 (010-9251-9743)
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
        
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-20 md:py-24 lg:py-32 relative z-10">
          <div className="text-center mb-16">
            <div className="badge-primary mb-6 animate-bounce-gentle">
              <Award className="w-5 h-5 mr-2" />
              <span className="font-semibold text-overflow-safe">ESG 인증 솔루션</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 mobile-centered">
              <span className="text-overflow-safe">6대 핵심 인증서비스</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-4xl mx-auto mobile-text">
              기업 맞춤형 인증 솔루션으로 <strong className="text-green-600">지속가능경영</strong>을 경험하세요<br />
              KAB 인정기관 전문성 + 체계적 프로세스 = <strong className="text-emerald-600">신뢰받는 인증</strong>
            </p>
          </div>
          
                                    {/* 사용자 중심 서비스 그리드 - 우선순위 기반 */}
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
                                  {/* 특별 추천 배지 */}
                {service.featured && (
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                                    px-4 py-1.5 rounded-full text-xs font-bold shadow-xl animate-pulse">
                      최고 추천
                    </div>
                  </div>
                )}
                
                <CardContent className="p-6 h-full flex flex-col">
                  {/* 서비스 헤더 - 간소화 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${service.color} shadow-lg 
                                    group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <service.icon className="w-8 h-8" />
                    </div>
                    <Badge className="bg-white/90 text-gray-700 font-bold text-xs shadow-md">
                      {service.badge}
                    </Badge>
                  </div>
                  
                                      {/* 서비스 정보 - 핵심만 */}
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
                    
                                          {/* 핵심 혜택 - 3개만 표시 */}
                    <div className="space-y-2">
                      {service.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 mobile-text font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                                      {/* 액션 버튼 - 명확한 CTA */}
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
                    
                                          {/* 빠른 상담 버튼 */}
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
                      ESG 인증 전문가에게 바로 문의하기
                    </button>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>

          {/* 빠른 액션 섹션 */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl border border-blue-200 mx-4 sm:mx-6 lg:mx-8 xl:mx-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mobile-centered">
                <span className="text-overflow-safe">어떤 인증이 필요한지 모르겠다면?</span>
              </h3>
              <p className="text-gray-600 mb-6 mobile-text">
                전문가 상담으로 맞춤형 인증 솔루션을 추천받으세요 (소요시간: 30분)
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <Link href="/esg-certification/contact">
                  <Button 
                    className="mobile-button btn-hero bg-gradient-to-r from-green-500 to-emerald-600 
                              hover:from-green-600 hover:to-emerald-700 text-white shadow-xl w-full sm:w-auto"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    <span className="text-overflow-safe">무료 인증 상담</span>
                  </Button>
                </Link>
                
                <Link href="/esg-certification/apply">
                  <Button 
                    className="mobile-button btn-secondary w-full sm:w-auto"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    <span className="text-overflow-safe">온라인 인증 신청</span>
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>무료 상담</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>맞춤형 솔루션</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>KAB 인정기관</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 성장 단계별 가이드 - 프리미엄 표현 */}
      <section className="section-padding gradient-bg-primary">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-20 md:py-24 lg:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              ESG 인증 4단계 프로세스
            </h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              체계적인 인증 프로세스로 기업의 지속가능한 경영을 실현하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificationStages.map((stage, index) => (
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

      {/* 고객 추천 후기 - 토스 스타일 */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-20 md:py-24 lg:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 mobile-centered">
              <span className="text-overflow-safe">고객 성공 스토리</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto mobile-text">
              ESG 인증원을 선택한 기업들의 진솔한 경험담을 들어보세요
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
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-20 md:py-24 lg:py-32">
                      <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 mobile-centered">
              <span className="text-overflow-safe">ESG 인증 단계별 맞춤 전략</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-4xl mx-auto mobile-text">
              신청부터 인증서 발급까지, 각 단계에 최적화된 전문 서비스를 제공합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {certificationStages.map((stage, index) => (
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
                <span className="text-overflow-safe">단계별 맞춤 인증 전략</span>
              </h3>
              <p className="text-gray-600 mb-6 mobile-text">
                귀하의 기업이 현재 어느 단계에 있든, ESG 인증원은 최적의 
                인증 프로세스를 제시합니다
              </p>
              <Link href="/diagnosis">
                {/* 개선된 우리 기업 성장 단계 진단받기 버튼 */}
                <Button className="mobile-button btn-hero bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <Target className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    <span className="text-overflow-safe">우리 기업 인증 준비도 진단받기</span>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 무료 전문가 진단 섹션 - 프리미엄 표현 */}
      <section id="ai-diagnosis" className="section-padding bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-20 md:py-24 lg:py-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Award className="w-5 h-5" />
              <span className="font-semibold">ESG 인증 전문 상담 시스템</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <Users className="inline-block w-12 h-12 mr-4 text-yellow-400" />
              무료 ESG 인증 상담 신청
            </h2>
            
            <p className="text-body-lg max-w-4xl mx-auto text-blue-100">
              복잡한 인증 절차를 <strong className="text-white">전문가 상담</strong>으로 간소화!<br />
              체계적인 프로세스로 <strong className="text-white">신뢰받는 인증</strong>을 보장합니다
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* 개선 효과 비교 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Clock, title: '처리 속도', before: '기존: 2-3주', after: '신규: 2-3분', improvement: '99.9% 단축', color: 'from-green-400 to-emerald-500' },
                { icon: BarChart3, title: '입력 항목', before: '기존: 20+ 항목', after: '신규: 8개 항목', improvement: '60% 간소화', color: 'from-blue-400 to-cyan-500' },
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
                  지금 바로 무료 ESG 인증 상담을 신청하세요!
                </h3>
                <p className="text-blue-100 mb-8 text-lg">
                  전문가와 상담하여 귀하의 기업에 최적화된 인증 솔루션을 제안받으세요.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Link href="/esg-certification/contact">
                    {/* 개선된 무료 ESG 인증 상담 신청하기 버튼 */}
                    <Button 
                      className="btn-hero bg-white text-blue-600 hover:bg-gray-50 shadow-xl transform hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      <span className="relative flex items-center">
                        <Users className="w-5 h-5 mr-2 group-hover:animate-pulse transition-transform duration-200" />
                        무료 ESG 인증 상담 신청하기
                      </span>
                    </Button>
                  </Link>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
                  {[
                    { icon: Shield, text: '100% 무료' },
                    { icon: Award, text: 'KAB 인정기관' },
                    { icon: Users, text: '전문가 직접 상담' }
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">이후경 경영지도사와 연결하기...</h3>
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
