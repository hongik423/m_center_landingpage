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
  Calculator,
  MessageCircle,
  X,
  Mail,
  Target,
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
      {/* Apple Store 스타일 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-apple">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center justify-between h-16">
            {/* 브랜드 로고 */}
            <div className="flex items-center">
              <Link href="/" className="group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-apple-button border border-gray-200">
                    <img 
                      src={getImagePath('/LOGO.JPG')} 
                      alt="M-CENTER 로고" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 text-sm">
                          M-CENTER
                        </div>
                        <div className="text-xs text-gray-600 group-hover:text-blue-500 transition-colors duration-200">
                          경영지도센터장
                        </div>
                      </div>
                </div>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 - 서비스 직접 표시 */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200">
                홈
              </Link>
              
              {/* 핵심 서비스들을 직접 표시 */}
              <Link href="/services/business-analysis" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200 flex items-center whitespace-nowrap">
                <Brain className="w-3.5 h-3.5 mr-1 text-blue-500" />
                사업분석
              </Link>
              
              <Link href="/services/ai-productivity" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200 flex items-center whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-500" />
                AI솔루션
              </Link>
              
              <Link href="/services/factory-auction" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200 flex items-center whitespace-nowrap hidden xl:flex">
                <Factory className="w-3.5 h-3.5 mr-1 text-orange-500" />
                공장구매
              </Link>
              
              <Link href="/services/tech-startup" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200 flex items-center whitespace-nowrap hidden xl:flex">
                <Rocket className="w-3.5 h-3.5 mr-1 text-green-500" />
                기술창업
              </Link>
              
              <Link href="/services/certification" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200 flex items-center whitespace-nowrap">
                <Award className="w-3.5 h-3.5 mr-1 text-red-500" />
                ISO/벤처
              </Link>
              
              <Link href="/services/website" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200 flex items-center whitespace-nowrap">
                <Globe className="w-3.5 h-3.5 mr-1 text-cyan-500" />
                웹사이트
              </Link>
              
              <Link href="/center-leader" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200 whitespace-nowrap">
                센터장프로필
              </Link>
              
              <Link href="/cases" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200 whitespace-nowrap">
                성공사례
              </Link>
            </div>

            {/* 액션 버튼들 - Apple Store 스타일 */}
            <div className="hidden md:flex lg:flex items-center space-x-2">
              <Button 
                variant="outline"
                className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                onClick={() => handleNavigation('/tax-calculator')}
              >
                <Calculator className="w-3.5 h-3.5 mr-1.5" />
                세금계산기
              </Button>
              
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-apple-button hover:shadow-apple-button-hover transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => handleNavigation('/diagnosis')}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                무료진단
              </Button>
              
              <Button 
                variant="outline"
                className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                onClick={() => handleNavigation('/consultation')}
              >
                <Phone className="w-3.5 h-3.5 mr-1.5" />
                상담
              </Button>
              
              <Button 
                className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-apple-button transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => handleNavigation('/chatbot')}
              >
                <Bot className="w-3.5 h-3.5 mr-1.5" />
                AI상담
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
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <img 
                        src={getImagePath('/LOGO.JPG')} 
                        alt="M-CENTER 로고" 
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">메뉴</h2>
                      <p className="text-xs text-gray-600">M-CENTER</p>
                      <p className="text-xs text-gray-500">경영지도센터장</p>
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
                  {/* 주요 서비스 메뉴 - 간소화 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-overflow-safe">⭐ 주요 서비스</h3>
                    <div className="space-y-3">
                      {[
                        { href: '/services/business-analysis', label: '프리미엄 사업분석', icon: '🎯', badge: '추천' },
                        { href: '/services/ai-productivity', label: 'AI 생산성향상', icon: '🤖', badge: '정부지원' },
                        { href: '/services/factory-auction', label: '공장구매 컨설팅', icon: '🏭', badge: '절약' },
                        { href: '/tax-calculator', label: '세금계산기', icon: '🧮', badge: '무료' }
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center p-3 rounded-apple-sm hover:bg-gray-50 transition-colors duration-200 border border-gray-200 hover:border-blue-600 group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-600 group-hover:text-white rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <span className="text-lg">{item.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 text-overflow-safe">{item.label}</span>
                            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                              <span className="text-overflow-safe">{item.badge}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200"></div>
                  
                  {/* 페이지 메뉴 - 간소화 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-overflow-safe">페이지 메뉴</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { href: '/', label: '홈', icon: '🏠' },
                        { href: '/services', label: '서비스', icon: '🛠️' },
                        { href: '/center-leader', label: '센터장프로필', icon: '👨‍💼' },
                        { href: '/cases', label: '성공사례', icon: '🏆' },
                        { href: '/diagnosis', label: 'AI진단', icon: '🔍' }
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
                          <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 text-center text-overflow-safe">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* 하단 연락처 */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-apple-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3 text-center">
                                                <span className="text-overflow-safe">📞 상담신청</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div className="text-center">
                          <div className="font-bold text-blue-600 text-overflow-safe">010-9251-9743</div>
                          <div className="text-xs text-gray-600 text-overflow-safe">이후경 경영지도사</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div className="text-center">
                          <div className="font-medium text-gray-900 text-overflow-safe">hongik423@gmail.com</div>
                          <div className="text-xs text-gray-600 text-overflow-safe">24시간 이메일 접수</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 모바일 액션 버튼들 */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button 
                      className="mobile-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={() => handleMobileNavigation('/diagnosis')}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      <span className="text-overflow-safe">무료 진단</span>
                    </Button>
                    <Button 
                      className="mobile-button bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      onClick={() => handleMobileNavigation('/consultation')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-overflow-safe">전문가 상담</span>
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