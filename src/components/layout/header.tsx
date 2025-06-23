'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  ChevronDown, 
  Menu, 
  Bot, 
  Phone,
  Brain,
  Factory,
  Rocket,
  Award,
  Globe,
  Zap,
  Sparkles,
  Calculator,
  MessageCircle,
  FileText,
  X
} from 'lucide-react';
import { getImagePath } from '@/lib/utils';

// 수정된 서비스 데이터 - 실제 존재하는 페이지로 연결
const services = [
  {
    id: 'business-analysis',
    title: 'BM ZEN 사업분석',
    description: '신규사업 성공률 95%',
    icon: Brain,
    href: '/services'
  },
  {
    id: 'ai-productivity',
    title: 'AI 활용 생산성향상',
    description: '업무 효율성 40% 향상',
    icon: Brain,
    href: '/chatbot'
  },
  {
    id: 'factory-auction',
    title: '경매활용 공장구매',
    description: '시장가 대비 40% 절약',
    icon: Factory,
    href: '/services'
  },
  {
    id: 'tech-startup',
    title: '기술사업화/기술창업',
    description: '평균 5억원 자금 확보',
    icon: Rocket,
    href: '/services'
  },
  {
    id: 'certification',
    title: '인증지원',
    description: '연간 5천만원 세제혜택',
    icon: Award,
    href: '/services'
  },
  {
    id: 'website',
    title: '웹사이트 구축',
    description: '온라인 매출 30% 증대',
    icon: Globe,
    href: '/services'
  }
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // 안전한 네비게이션 핸들러
  const handleNavigation = (path: string) => {
    if (typeof window !== 'undefined') {
      router.push(path);
    }
  };

  const handleMobileNavigation = (path: string) => {
    if (typeof window !== 'undefined') {
      setIsMobileMenuOpen(false);
      setTimeout(() => {
        router.push(path);
      }, 100);
    }
  };

  return (
    <>
      {/* 현대적 플로팅 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* 브랜드 로고 - 모바일 최적화 */}
            <div className="flex items-center">
              <Link href="/" className="group">
                <div className="relative">
                  {/* 메인 브랜드 텍스트 */}
                  <div className="flex flex-col">
                    <div className="flex items-end space-x-2 md:space-x-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                        <img 
                          src={getImagePath('/company-star-logo.svg')} 
                          alt="경영지도센터 로고" 
                          className="w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-xs md:text-sm font-black text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-1 md:mb-1.5">
                        경영지도센터
                      </span>
                    </div>
                  </div>
                  
                  {/* 호버 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                </div>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 - 현대적 스타일 */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link href="/" className="nav-item">
                🏠 홈
              </Link>
              
              {/* 서비스소개 드롭다운 - 현대적 스타일 */}
              <DropdownMenu>
                <DropdownMenuTrigger className="nav-item flex items-center group" suppressHydrationWarning>
                  🛠️ 서비스소개
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[420px] p-4 bg-white border border-gray-200 shadow-2xl rounded-2xl">
                  <div className="grid grid-cols-2 gap-3">
                    {services.map((service) => (
                      <DropdownMenuItem key={service.id} asChild>
                        <Link href={service.href} className="service-card">
                          <div className="service-icon mr-3">
                            <service.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 text-sm mb-1">
                              {service.title}
                            </div>
                            <div className="text-xs text-gray-600 leading-relaxed">
                              {service.description}
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  
                  {/* 하단 CTA */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2">더 많은 서비스를 확인하세요</p>
                      <Link href="/services" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                        전체 서비스 보기 →
                      </Link>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/cases" className="nav-item">
                🏆 성공사례
              </Link>
              <Link href="/about" className="nav-item">
                🏢 회사소개
              </Link>
              <Link href="/support" className="nav-item">
                💬 고객지원
              </Link>
            </div>

            {/* 액션 버튼들 - AI 챗봇 가장 오른쪽 배치 */}
            <div className="hidden md:flex lg:flex items-center space-x-2 lg:space-x-3">
              <Button 
                className="action-btn-outline text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 h-auto"
                onClick={() => handleNavigation('/tax-calculator')}
                suppressHydrationWarning
              >
                <Calculator className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">세금계산기</span>
                <span className="md:hidden">계산기</span>
              </Button>
              
              <Button 
                className="action-btn-primary text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 h-auto"
                onClick={() => handleNavigation('/diagnosis')}
                suppressHydrationWarning
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">무료AI진단</span>
                <span className="md:hidden">AI진단</span>
              </Button>
              
              <Button 
                className="action-btn-secondary text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 h-auto"
                onClick={() => handleNavigation('/consultation')}
                suppressHydrationWarning
              >
                <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden lg:inline">무료상담</span>
                <span className="lg:hidden">상담</span>
              </Button>
              
              {/* 🤖 AI챗봇 버튼 - 가장 오른쪽 배치 */}
              <Button 
                className="action-btn-ai text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 h-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => handleNavigation('/chatbot')}
                suppressHydrationWarning
              >
                <Bot className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">AI챗봇</span>
                <span className="md:hidden">AI</span>
              </Button>
            </div>

            {/* 모바일 햄버거 메뉴 - 완전히 새로운 디자인 */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden w-10 h-10 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border border-gray-200/50 shadow-sm active:scale-95"
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-80 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-l border-gray-200/50 backdrop-blur-md"
              >
                {/* 모바일 메뉴 헤더 */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <img 
                        src={getImagePath('/company-star-logo.svg')} 
                        alt="경영지도센터 로고" 
                        className="w-6 h-6 object-contain filter brightness-0 invert"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 text-lg">메뉴</h2>
                      <p className="text-xs text-gray-600">경영지도센터</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-lg hover:bg-gray-100/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>

                <div className="space-y-6 pb-6">
                  {/* ⭐ 인기 서비스 섹션 - 최상단 */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-2 shadow-md">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">인기 서비스</h3>
                      <div className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                        HOT
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {/* 🔥 세금계산기 - 특별 강조 */}
                      <Button 
                        className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 h-auto p-4 rounded-2xl border-0"
                        onClick={() => handleMobileNavigation('/tax-calculator')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 shadow-lg">
                            <Calculator className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-black text-white text-base flex items-center space-x-2">
                              <span>🔥 세금계산기</span>
                              <span className="text-yellow-200 text-xs bg-white/20 px-2 py-0.5 rounded-full animate-bounce">NEW!</span>
                            </div>
                            <div className="text-sm text-orange-100 mt-1 font-semibold">11개 전문 계산기 무료!</div>
                          </div>
                          <div className="text-white/80">
                            <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                          </div>
                        </div>
                      </Button>
                      
                      {/* ⭐ 무료AI진단 */}
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-auto p-3.5 rounded-xl"
                        onClick={() => handleMobileNavigation('/diagnosis')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 shadow-md">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-bold text-white text-sm">⭐ 무료AI진단</div>
                            <div className="text-xs text-purple-100 mt-0.5">맞춤 분석 리포트</div>
                          </div>
                          <div className="text-white/70">
                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                          </div>
                        </div>
                      </Button>

                      {/* 📞 무료상담 */}
                      <Button 
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-auto p-3 rounded-xl"
                        onClick={() => handleMobileNavigation('/consultation')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 shadow-md">
                            <Phone className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-bold text-white text-sm">📞 무료상담</div>
                            <div className="text-xs text-green-100">전문가 1:1 상담</div>
                          </div>
                          <div className="text-white/70">
                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                          </div>
                        </div>
                      </Button>

                      {/* 🤖 AI챗봇 */}
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-auto p-3 rounded-xl"
                        onClick={() => handleMobileNavigation('/chatbot')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 shadow-md">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-bold text-white text-sm">🤖 AI챗봇</div>
                            <div className="text-xs text-indigo-100">24시간 상담 지원</div>
                          </div>
                          <div className="text-white/70">
                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="border-t border-gray-200/50"></div>
                  
                  {/* 페이지 메뉴 - 컴팩트 디자인 */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-600" />
                      페이지 메뉴
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/"
                        className="flex flex-col items-center p-3 rounded-xl hover:bg-white/60 transition-all duration-200 border border-gray-100/50 hover:border-blue-200 hover:shadow-md group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-2 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                          <span className="text-lg">🏠</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">홈</span>
                      </Link>
                      
                      <Link
                        href="/services"
                        className="flex flex-col items-center p-3 rounded-xl hover:bg-white/60 transition-all duration-200 border border-gray-100/50 hover:border-blue-200 hover:shadow-md group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-2 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                          <span className="text-lg">🛠️</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">서비스</span>
                      </Link>
                      
                      <Link
                        href="/cases"
                        className="flex flex-col items-center p-3 rounded-xl hover:bg-white/60 transition-all duration-200 border border-gray-100/50 hover:border-blue-200 hover:shadow-md group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center mb-2 group-hover:from-yellow-200 group-hover:to-orange-200 transition-colors">
                          <span className="text-lg">🏆</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">성공사례</span>
                      </Link>
                      
                      <Link
                        href="/about"
                        className="flex flex-col items-center p-3 rounded-xl hover:bg-white/60 transition-all duration-200 border border-gray-100/50 hover:border-blue-200 hover:shadow-md group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center mb-2 group-hover:from-green-200 group-hover:to-teal-200 transition-colors">
                          <span className="text-lg">🏢</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">회사소개</span>
                      </Link>
                    </div>
                  </div>

                  {/* 하단 연락처 정보 */}
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
                    <div className="text-center">
                      <h4 className="font-bold text-gray-900 text-sm mb-2">📞 전문가 직접 상담</h4>
                      <div className="text-xs text-gray-600 mb-3">
                        <p>평일 9:00-18:00</p>
                        <p className="font-bold text-blue-600 text-sm mt-1">010-9251-9743</p>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs py-2 rounded-xl shadow-md"
                        onClick={() => handleMobileNavigation('/support/contact')}
                      >
                        <MessageCircle className="w-3 h-3 mr-2" />
                        1:1 문의하기
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>
      
      {/* 헤더 공간 확보 - 모바일 최적화 */}
      <div className="h-16 md:h-20" />
    </>
  );
} 