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

// Apple Store 스타일 서비스 데이터
const services = [
  {
    id: 'business-analysis',
    title: 'BM ZEN 사업분석',
    description: 'AI 기반 성장전략 컨설팅',
    icon: Brain,
    href: '/services/business-analysis'
  },
  {
    id: 'ai-productivity',
    title: 'AI 활용 생산성향상',
    description: '업무 효율성 40% 향상',
    icon: Brain,
    href: '/services/ai-productivity'
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
    href: '/services/tech-startup'
  },
  {
    id: 'certification',
    title: '인증지원',
    description: '연간 5천만원 세제혜택',
    icon: Award,
    href: '/services/certification'
  },
  {
    id: 'website',
    title: '웹사이트 구축',
    description: '온라인 매출 30% 증대',
    icon: Globe,
    href: '/services/website'
  }
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

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
      {/* Apple Store 스타일 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-apple">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center justify-between h-16">
            {/* 브랜드 로고 */}
            <div className="flex items-center">
              <Link href="/" className="group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-apple-button">
                    <img 
                      src={getImagePath('/company-star-logo.svg')} 
                      alt="경영지도센터 로고" 
                      className="w-6 h-6 object-contain filter brightness-0 invert"
                    />
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    경영지도센터
                  </span>
                </div>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                홈
              </Link>
              
              {/* BM Zen 프로필링크 - 직접 링크 */}
              <Link href="/services/business-analysis" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center">
                <Brain className="w-4 h-4 mr-1" />
                BM Zen 프로필링크
              </Link>
              
              {/* 서비스 드롭다운 */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group">
                  서비스
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96 p-6 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-apple-hover rounded-apple">
                  <div className="grid grid-cols-2 gap-3">
                    {services.map((service) => (
                      <DropdownMenuItem key={service.id} asChild>
                        <Link href={service.href} className="flex items-start p-3 rounded-apple-sm hover:bg-gray-50 transition-colors duration-200">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                            <service.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm mb-1">
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
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/cases" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                성공사례
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                회사소개
              </Link>
              <Link href="/support" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                고객지원
              </Link>
            </div>

            {/* 액션 버튼들 - Apple Store 스타일 */}
            <div className="hidden md:flex lg:flex items-center space-x-3">
              <Button 
                variant="outline"
                className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-full font-medium transition-all duration-200"
                onClick={() => handleNavigation('/tax-calculator')}
              >
                <Calculator className="w-4 h-4 mr-2" />
                세금계산기
              </Button>
              
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium shadow-apple-button hover:shadow-apple-button-hover transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => handleNavigation('/diagnosis')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                무료AI진단
              </Button>
              
              <Button 
                variant="outline"
                className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-full font-medium transition-all duration-200"
                onClick={() => handleNavigation('/consultation')}
              >
                <Phone className="w-4 h-4 mr-2" />
                상담
              </Button>
              
              <Button 
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full font-medium shadow-apple-button transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => handleNavigation('/chatbot')}
              >
                <Bot className="w-4 h-4 mr-2" />
                AI챗봇
              </Button>
            </div>

            {/* 모바일 햄버거 메뉴 */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200"
              >
                {/* 모바일 메뉴 헤더 */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <img 
                        src={getImagePath('/company-star-logo.svg')} 
                        alt="경영지도센터 로고" 
                        className="w-4 h-4 object-contain filter brightness-0 invert"
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">메뉴</h2>
                      <p className="text-xs text-gray-600">경영지도센터</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-full hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* 인기 서비스 섹션 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">인기 서비스</h3>
                    
                    <div className="space-y-3">
                      {/* BM Zen 프로필링크 - 모바일 */}
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-apple-button hover:shadow-apple-button-hover transform hover:-translate-y-0.5 transition-all duration-200 rounded-apple-sm p-4 h-auto"
                        onClick={() => handleMobileNavigation('/services/business-analysis')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white">BM Zen 프로필링크</div>
                            <div className="text-sm text-blue-100">AI 성장전략 컨설팅</div>
                          </div>
                        </div>
                      </Button>
                      
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-apple-button hover:shadow-apple-button-hover transform hover:-translate-y-0.5 transition-all duration-200 rounded-apple-sm p-4 h-auto"
                        onClick={() => handleMobileNavigation('/tax-calculator')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                            <Calculator className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white">세금계산기</div>
                            <div className="text-sm text-blue-100">11개 전문 계산기</div>
                          </div>
                        </div>
                      </Button>
                      
                      <Button 
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white shadow-apple-button hover:shadow-apple-button-hover transform hover:-translate-y-0.5 transition-all duration-200 rounded-apple-sm p-4 h-auto"
                        onClick={() => handleMobileNavigation('/diagnosis')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white">무료AI진단</div>
                            <div className="text-sm text-gray-300">맞춤 분석 리포트</div>
                          </div>
                        </div>
                      </Button>

                      <Button 
                        variant="outline"
                        className="w-full border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 rounded-apple-sm p-4 h-auto transition-all duration-200"
                        onClick={() => handleMobileNavigation('/consultation')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Phone className="w-5 h-5 text-gray-700" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold">무료상담</div>
                            <div className="text-sm text-gray-600">전문가 1:1 상담</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 rounded-apple-sm p-4 h-auto transition-all duration-200"
                        onClick={() => handleMobileNavigation('/chatbot')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Bot className="w-5 h-5 text-gray-700" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold">AI챗봇</div>
                            <div className="text-sm text-gray-600">24시간 상담</div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="border-t border-gray-200"></div>
                  
                  {/* 페이지 메뉴 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">페이지 메뉴</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { href: '/', label: '홈', icon: '🏠' },
                        { href: '/services', label: '서비스', icon: '🛠️' },
                        { href: '/cases', label: '성공사례', icon: '🏆' },
                        { href: '/about', label: '회사소개', icon: '🏢' }
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex flex-col items-center p-3 rounded-apple-sm hover:bg-gray-50 transition-colors duration-200 border border-gray-200 hover:border-blue-600 group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-600 group-hover:text-white rounded-lg flex items-center justify-center mb-2 transition-colors">
                            <span className="text-lg">{item.icon}</span>
                          </div>
                          <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* 하단 연락처 */}
                  <div className="bg-gray-50 rounded-apple p-4 border border-gray-200">
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-2">전문가 직접 상담</h4>
                      <div className="text-sm text-gray-600 mb-3">
                        <p>평일 9:00-18:00</p>
                        <p className="font-semibold text-blue-600">010-9251-9743</p>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2 text-sm"
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
      
      {/* 헤더 공간 확보 */}
      <div className="h-16" />
    </>
  );
} 