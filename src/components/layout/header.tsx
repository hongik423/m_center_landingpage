'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Bot, 
  Phone,
  Brain,
  Factory,
  Rocket,
  Award,
  Globe,
  Sparkles,
  X,
  Mail,
  Target,
  User,
  Users
} from 'lucide-react';
import { getImagePath } from '@/lib/utils';

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
      {/* 완전한 애플 스타일 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            {/* 브랜드 로고 - SVG 로고로 교체 */}
            <div className="flex items-center">
              <button onClick={() => handleNavigation('/')} className="flex items-center space-x-3 hover:opacity-70 transition-opacity duration-200">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img 
                    src="/LOGO.svg" 
                    alt="M-CENTER 로고" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 text-sm leading-tight">
                    M-CENTER
                  </div>
                </div>
              </button>
            </div>

            {/* 데스크톱 네비게이션 - 완전한 애플 스타일 */}
            <div className="hidden lg:flex items-center space-x-10">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors duration-200"
              >
                홈
              </Link>
              
              <button 
                className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors duration-200"
                onClick={() => handleNavigation('/services/business-analysis')}
              >
                사업분석
              </button>
              
              <button 
                className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors duration-200"
                onClick={() => handleNavigation('/services/ai-productivity')}
              >
                AI생산성
              </button>
              
              <button 
                className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors duration-200 hidden xl:flex"
                onClick={() => handleNavigation('/diagnosis')}
              >
                진단
              </button>
              
              <button 
                className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors duration-200 hidden xl:flex"
                onClick={() => handleNavigation('/services/factory-auction')}
              >
                공장구매
              </button>
              
              <button 
                className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors duration-200 hidden xl:flex"
                onClick={() => handleNavigation('/services/tech-startup')}
              >
                기술창업
              </button>
              
              <button 
                className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors duration-200"
                onClick={() => handleNavigation('/services/certification')}
              >
                인증지원
              </button>
              
              <button 
                className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors duration-200"
                onClick={() => handleNavigation('/services/website')}
              >
                웹사이트
              </button>
              
              <Link 
                href="/center-leader" 
                className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors duration-200 whitespace-nowrap"
              >
                센터장
              </Link>
              
              <Link 
                href="/cases" 
                className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors duration-200 whitespace-nowrap"
              >
                성공사례
              </Link>
            </div>

            {/* 액션 버튼들 - 애플 스타일 아이콘 */}
            <div className="hidden md:flex lg:flex items-center space-x-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => handleNavigation('/tax-calculator')}
              >
                세금계산
              </Button>
              
              <Button 
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => handleNavigation('/diagnosis')}
              >
                무료진단
              </Button>
              
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => handleNavigation('/consultation')}
              >
                상담신청
              </Button>
            </div>

            {/* 모바일 햄버거 메뉴 */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden w-10 h-10 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200"
              >
                {/* 모바일 메뉴 헤더 - SVG 로고로 교체 */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img 
                        src="/LOGO.svg" 
                        alt="M-CENTER 로고" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-900">M-CENTER</h2>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* 주요 서비스 메뉴 - 완전한 애플 스타일 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      서비스
                    </h3>
                    <div className="space-y-1">
                      {[
                        { href: '/services/business-analysis', label: 'BM ZEN 사업분석' },
                        { href: '/services/ai-productivity', label: 'AI 생산성향상' },
                        { href: '/diagnosis', label: '3분 AI 진단' },
                        { href: '/services/factory-auction', label: '공장구매 절약' },
                        { href: '/services/tech-startup', label: '기술창업' },
                        { href: '/services/certification', label: '인증지원' },
                        { href: '/services/website', label: '웹사이트 구축' }
                      ].map((item) => (
                        <button
                          key={item.href}
                          className="w-full text-left py-3 text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                          onClick={() => handleMobileNavigation(item.href)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200"></div>
                  
                  {/* 페이지 메뉴 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">정보</h3>
                    <div className="space-y-1">
                      {[
                        { href: '/', label: '홈' },
                        { href: '/center-leader', label: '센터장' },
                        { href: '/cases', label: '성공사례' },
                        { href: '/tax-calculator', label: '세금계산기' }
                      ].map((item) => (
                        <button
                          key={item.href}
                          className="w-full text-left py-3 text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                          onClick={() => handleMobileNavigation(item.href)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200"></div>

                  {/* 연락처 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">문의</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">010-9251-9743</div>
                        <div className="text-xs text-gray-500">이후경 경영지도사</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">hongik423@gmail.com</div>
                        <div className="text-xs text-gray-500">24시간 이메일 접수</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 모바일 액션 버튼들 */}
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      className="flex-1 bg-black hover:bg-gray-800 text-white transition-colors duration-200 rounded-lg"
                      onClick={() => handleMobileNavigation('/diagnosis')}
                    >
                      무료 진단
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex-1 border-gray-300 hover:border-gray-400 text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-lg"
                      onClick={() => handleMobileNavigation('/consultation')}
                    >
                      전문가 상담
                    </Button>
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