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
  X
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
                  {/* 핵심 서비스 섹션 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">핵심 서비스</h3>
                    
                    <div className="space-y-3">
                      {/* 사업분석 - 모바일 */}
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-apple-button hover:shadow-apple-button-hover transform hover:-translate-y-0.5 transition-all duration-200 rounded-apple-sm p-4 h-auto"
                        onClick={() => handleMobileNavigation('/services/business-analysis')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white">프리미엄 사업분석</div>
                            <div className="text-sm text-blue-100">전략적 성장 솔루션</div>
                          </div>
                        </div>
                      </Button>
                      
                      {/* AI솔루션 - 모바일 */}
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-apple-button hover:shadow-apple-button-hover transform hover:-translate-y-0.5 transition-all duration-200 rounded-apple-sm p-4 h-auto"
                        onClick={() => handleMobileNavigation('/services/ai-productivity')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white">AI 혁신 솔루션</div>
                            <div className="text-sm text-purple-100">차세대 비즈니스 도구</div>
                          </div>
                        </div>
                      </Button>
                      
                      {/* 인증지원 - 모바일 */}
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-apple-button hover:shadow-apple-button-hover transform hover:-translate-y-0.5 transition-all duration-200 rounded-apple-sm p-4 h-auto"
                        onClick={() => handleMobileNavigation('/services/certification')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white">ISO/벤처</div>
                            <div className="text-sm text-orange-100">연간 5천만원 세제혜택</div>
                          </div>
                        </div>
                      </Button>
                      
                      {/* 웹사이트 - 모바일 */}
                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-apple-button hover:shadow-apple-button-hover transform hover:-translate-y-0.5 transition-all duration-200 rounded-apple-sm p-4 h-auto"
                        onClick={() => handleMobileNavigation('/services/website')}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white">웹사이트</div>
                            <div className="text-sm text-cyan-100">매출증대 웹사이트구축</div>
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
                            <div className="font-semibold text-white">무료 진단</div>
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
                            <div className="font-semibold">AI상담</div>
                            <div className="text-sm text-gray-600">24시간 상담</div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="border-t border-gray-200"></div>
                  
                  {/* 페이지 메뉴 - 간소화 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">페이지 메뉴</h3>
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
                        onClick={() => handleMobileNavigation('/consultation')}
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