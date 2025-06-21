'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Sparkles
} from 'lucide-react';

const services = [
  {
    id: 'business-analysis',
    title: 'BM ZEN 사업분석',
    description: '신규사업 성공률 95%',
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
    href: '/services/factory-auction'
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

  return (
    <>
      {/* 토스 스타일 플로팅 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 toss-header-blur">
        <div className="container mx-auto px-4 lg:px-6">
          <nav className="flex items-center justify-between h-20">
            {/* 로고 섹션 - 토스 스타일 */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-1 rounded-lg shadow-sm border border-blue-100/50 group-hover:shadow-md transition-all duration-300 animate-toss-glow">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/LOGO.JPG`}
                    alt="경영지도센터 M-CENTER 로고"
                    width={28}
                    height={28}
                    className="h-7 w-7 hover:scale-105 transition-transform duration-300 object-contain rounded-md"
                    style={{ width: "auto", height: "auto" }}
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-title text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    경영지도센터
                  </span>
                  <span className="text-xs font-medium text-gray-500 -mt-0.5">
                    M-CENTER
                  </span>
                </div>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 - 토스 스타일 */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link href="/" className="toss-nav-item">
                홈
              </Link>
              
              {/* 서비스소개 드롭다운 - 토스 스타일 */}
              <DropdownMenu>
                <DropdownMenuTrigger className="toss-nav-item flex items-center group">
                  서비스소개
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96 toss-dropdown">
                  <div className="grid grid-cols-1 gap-2">
                    {services.map((service) => (
                      <DropdownMenuItem key={service.id} asChild>
                        <Link href={service.href} className="toss-service-card">
                          <div className="toss-service-icon mr-4">
                            <service.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-sm mb-1">
                              {service.title}
                            </div>
                            <div className="text-xs text-gray-600">
                              {service.description}
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/cases" className="toss-nav-item">
                성공사례
              </Link>
              <Link href="/about" className="toss-nav-item">
                회사소개
              </Link>
              <Link href="/support" className="toss-nav-item">
                고객지원
              </Link>
            </div>

            {/* 액션 버튼들 - 토스 스타일 */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button 
                className="toss-button-outline text-sm"
                onClick={() => router.push('/tax-calculator')}
              >
                <Zap className="w-4 h-4 mr-2" />
                세금계산기
              </Button>
              
              <Button 
                className="toss-button-primary text-sm"
                onClick={() => router.push('/services/diagnosis')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                무료AI진단
              </Button>
              
              <Button 
                className="toss-button-secondary text-sm"
                onClick={() => router.push('/consultation')}
              >
                <Phone className="w-4 h-4 mr-2" />
                무료상담
              </Button>
              
              <Button
                className="toss-button-outline text-sm"
                onClick={() => router.push('/chatbot')}
              >
                <Bot className="w-4 h-4 mr-2" />
                AI챗봇
              </Button>
            </div>

            {/* 모바일 메뉴 버튼 - 토스 스타일 */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden w-10 h-10 rounded-xl hover:bg-blue-50/50 transition-colors duration-200"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 toss-mobile-menu">
                <div className="py-6">
                  <div className="space-y-6">
                    {/* 🏆 주요 기능 - 최상단 배치 */}
                    <div>
                      <div className="flex items-center mb-4">
                        <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                        <h3 className="font-bold text-gray-900 text-lg">인기 서비스</h3>
                      </div>
                      <div className="space-y-3">
                        {/* 세금계산기 - 특별 강조 */}
                        <Button 
                          className="w-full toss-button-primary text-left justify-start h-auto p-4 relative overflow-hidden"
                          onClick={() => {
                            router.push('/tax-calculator');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"></div>
                          <div className="relative flex items-center w-full">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                              <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-bold text-white text-base">🔥 세금계산기</div>
                              <div className="text-xs text-blue-100 mt-0.5">모든 세금 계산을 한 번에!</div>
                            </div>
                          </div>
                        </Button>
                        
                        {/* 무료AI진단 */}
                        <Button 
                          className="w-full toss-button-secondary text-left justify-start h-auto p-3.5"
                          onClick={() => {
                            router.push('/services/diagnosis');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white text-sm">⭐ 무료AI진단</div>
                            <div className="text-xs text-indigo-200 mt-0.5">기업 맞춤 분석 리포트</div>
                          </div>
                        </Button>

                        {/* 무료상담 */}
                        <Button 
                          className="w-full toss-button-outline text-left justify-start h-auto p-3"
                          onClick={() => {
                            router.push('/consultation');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                            <Phone className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-900 text-sm">📞 무료상담</div>
                            <div className="text-xs text-gray-600">전문가 1:1 상담</div>
                          </div>
                        </Button>

                        {/* AI챗봇 */}
                        <Button
                          className="w-full toss-button-outline text-left justify-start h-auto p-3"
                          onClick={() => {
                            router.push('/chatbot');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-900 text-sm">🤖 AI챗봇</div>
                            <div className="text-xs text-gray-600">24시간 상담 지원</div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* 구분선 */}
                    <div className="border-t border-gray-200"></div>
                    
                    {/* 페이지 메뉴 */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 text-base">📚 페이지 메뉴</h3>
                      <div className="space-y-2">
                        <Link
                          href="/"
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-blue-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="mr-3">🏠</span>
                          홈
                        </Link>
                        <Link
                          href="/cases"
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-blue-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="mr-3">🏆</span>
                          성공사례
                        </Link>
                        <Link
                          href="/about"
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-blue-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="mr-3">🏢</span>
                          회사소개
                        </Link>
                        <Link
                          href="/support"
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-blue-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="mr-3">💬</span>
                          고객지원
                        </Link>
                      </div>
                    </div>

                    {/* 구분선 */}
                    <div className="border-t border-gray-200"></div>
                    
                    {/* 전체 서비스 목록 */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 text-base">🛠️ 전체 서비스</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={service.href}
                            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-2 shadow-sm">
                              <service.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-xs text-gray-900 leading-tight mb-1">
                                {service.title}
                              </div>
                              <div className="text-xs text-gray-500 leading-tight">
                                {service.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>
      
      {/* 헤더 공간 확보 */}
      <div className="h-20" />
    </>
  );
} 