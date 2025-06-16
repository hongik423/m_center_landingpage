'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Globe
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

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo-gyeongji.svg"
                alt="기업의별 로고"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
              <span className="font-bold text-lg text-gray-900 hidden sm:block">
                경영지도센터
              </span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary font-medium"
            >
              홈
            </Link>
            {/* 서비스소개 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-primary font-medium">
                서비스소개
                <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-2">
                {services.map((service) => (
                  <DropdownMenuItem key={service.id} asChild>
                    <Link
                      href={service.href}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <service.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {service.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {service.description}
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/diagnosis"
              className="text-gray-700 hover:text-primary font-medium"
            >
              진단및상담
            </Link>
            <Link
              href="/cases"
              className="text-gray-700 hover:text-primary font-medium"
            >
              성공사례
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary font-medium"
            >
              회사소개
            </Link>
            <Link
              href="/support"
              className="text-gray-700 hover:text-primary font-medium"
            >
              고객지원
            </Link>
          </div>

          {/* 액션 버튼들 */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              className="btn-primary gap-2"
              onClick={() => window.location.href = '/consultation'}
            >
              <Phone className="w-4 h-4" />
              무료상담신청
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300"
              onClick={() => window.location.href = '/chatbot'}
            >
              <Bot className="w-4 h-4" />
              AI챗봇
            </Button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="py-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">서비스소개</h3>
                    <div className="space-y-2">
                      {services.map((service) => (
                        <Link
                          key={service.id}
                          href={service.href}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <service.icon className="w-5 h-5 text-primary mr-3" />
                          <div>
                            <div className="font-medium text-sm">{service.title}</div>
                            <div className="text-xs text-gray-600">{service.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Link
                      href="/"
                      className="block py-2 text-gray-700 hover:text-primary font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      홈
                    </Link>
                    <Link
                      href="/diagnosis"
                      className="block py-2 text-gray-700 hover:text-primary font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      진단및상담
                    </Link>
                    <Link
                      href="/cases"
                      className="block py-2 text-gray-700 hover:text-primary font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      성공사례
                    </Link>
                    <Link
                      href="/about"
                      className="block py-2 text-gray-700 hover:text-primary font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      회사소개
                    </Link>
                    <Link
                      href="/support"
                      className="block py-2 text-gray-700 hover:text-primary font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      고객지원
                    </Link>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <Button className="w-full btn-primary gap-2">
                      <Phone className="w-4 h-4" />
                      무료상담신청
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700"
                    >
                      <Bot className="w-4 h-4" />
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
  );
} 