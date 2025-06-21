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
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-1.5 rounded-xl shadow-sm border border-blue-100/50 group-hover:shadow-md transition-all duration-300 animate-toss-glow">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/LOGO.JPG`}
                    alt="경영지도센터 M-CENTER 로고"
                    width={36}
                    height={36}
                    className="h-9 w-9 hover:scale-105 transition-transform duration-300 object-contain rounded-lg"
                    style={{ width: "auto", height: "auto" }}
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-title text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
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
                <div className="py-8">
                  <div className="space-y-8">
                    {/* 모바일 서비스 목록 */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">서비스소개</h3>
                      <div className="space-y-3">
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={service.href}
                            className="toss-service-card"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                              <service.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-gray-900">{service.title}</div>
                              <div className="text-xs text-gray-600 mt-0.5">{service.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    {/* 모바일 네비게이션 */}
                    <div className="space-y-2">
                      <Link
                        href="/"
                        className="toss-nav-item block"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        홈
                      </Link>
                      <Link
                        href="/cases"
                        className="toss-nav-item block"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        성공사례
                      </Link>
                      <Link
                        href="/about"
                        className="toss-nav-item block"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        회사소개
                      </Link>
                      <Link
                        href="/support"
                        className="toss-nav-item block"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        고객지원
                      </Link>
                    </div>

                    {/* 모바일 액션 버튼들 */}
                    <div className="space-y-3 pt-6 border-t border-gray-100">
                      <Button 
                        className="w-full toss-button-outline"
                        onClick={() => {
                          router.push('/tax-calculator');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        세금계산기
                      </Button>
                      
                      <Button 
                        className="w-full toss-button-primary"
                        onClick={() => {
                          router.push('/services/diagnosis');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        무료AI진단신청
                      </Button>
                      
                      <Button 
                        className="w-full toss-button-secondary"
                        onClick={() => {
                          router.push('/consultation');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        무료상담신청
                      </Button>
                      
                      <Button
                        className="w-full toss-button-outline"
                        onClick={() => {
                          router.push('/chatbot');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        AI챗봇
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
      <div className="h-20" />
    </>
  );
} 