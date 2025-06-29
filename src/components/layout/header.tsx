'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  Users,
  Calculator,
  MessageCircle,
  ChevronDown,
  Zap,
  Star
} from 'lucide-react';
import { getImagePath } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모바일 메뉴 토글
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsServicesOpen(false);
  };

  // 페이지 이동 핸들러
  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  // 서비스 메뉴 데이터
  const services = [
    {
      title: '사업분석',
      desc: '혁신 프레임워크',
      href: '/services/business-analysis',
      icon: <Brain className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'AI 생산성',
      desc: '정부 100% 지원',
      href: '/services/ai-productivity',
      icon: <Bot className="w-5 h-5 text-purple-600" />
    },
    {
      title: '공장구매',
      desc: '40% 비용절감',
      href: '/services/factory-auction',
      icon: <Factory className="w-5 h-5 text-orange-600" />
    },
    {
      title: '기술창업',
      desc: '5억원 자금확보',
      href: '/services/tech-startup',
      icon: <Rocket className="w-5 h-5 text-green-600" />
    },
    {
      title: '인증지원',
      desc: '5천만원 혜택',
      href: '/services/certification',
      icon: <Award className="w-5 h-5 text-cyan-600" />
    },
    {
      title: '웹사이트',
      desc: '매출 30% 증대',
      href: '/services/website',
      icon: <Globe className="w-5 h-5 text-indigo-600" />
    }
  ];

  return (
    <>
      {/* 🍎 애플스토어 스타일 헤더 */}
      <header className={`mobile-nav-improved transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="mobile-container">
          <div className="flex items-center justify-between h-16">
            {/* 🍎 애플스토어 스타일 브랜드 로고 */}
            <Link 
              href="/"
              className="flex items-center space-x-3 group touch-target"
              aria-label="M-CENTER 홈페이지로 이동"
            >
              <div className="apple-icon bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-110 transition-transform duration-200">
                <img 
                  src={getImagePath('/LOGO.JPG')}
                  alt="M-CENTER 로고" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  M-CENTER
                </span>
                <div className="apple-badge bg-blue-100 text-blue-800 text-xs ml-2 px-2 py-0.5">
                  프리미엄
                </div>
              </div>
            </Link>

            {/* 🍎 데스크탑 네비게이션 */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* 서비스 드롭다운 */}
              <div className="relative">
                <button
                  className="apple-button-ghost flex items-center gap-1"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                >
                  <span>서비스</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    isServicesOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* 🍎 서비스 드롭다운 메뉴 */}
                {isServicesOpen && (
                  <div 
                    className="absolute top-full left-0 w-96 mt-2 bg-white/95 backdrop-blur-xl 
                               border border-gray-100/50 shadow-2xl rounded-3xl p-6 z-50"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <div className="apple-grid-2">
                      {services.map((service, index) => (
                        <Link
                          key={index}
                          href={service.href}
                          className="apple-card p-4 hover:scale-[1.02] transition-all duration-200"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="apple-icon bg-gray-100">
                              {service.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm text-overflow-safe">
                                {service.title}
                              </h3>
                              <p className="text-xs text-gray-500 text-overflow-safe">
                                {service.desc}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                className="apple-button-ghost"
                onClick={() => handleNavigation('/cases')}
              >
                성공사례
              </button>

              <button
                className="apple-button-ghost"
                onClick={() => handleNavigation('/center-leader')}
              >
                센터장
              </button>

              <button
                className="apple-button-ghost"
                onClick={() => handleNavigation('/support')}
              >
                고객지원
              </button>
            </nav>

            {/* 🍎 액션 버튼들 - 애플스토어 스타일 */}
            <div className="hidden lg:flex items-center space-x-3">
              <button 
                className="apple-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                onClick={() => handleNavigation('/tax-calculator')}
              >
                세금계산
              </button>
              
              <button 
                className="apple-button bg-black hover:bg-gray-800 text-white px-4 py-2"
                onClick={() => handleNavigation('/diagnosis')}
              >
                무료진단
              </button>
              
              <button 
                className="apple-button bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                onClick={() => handleNavigation('/consultation')}
              >
                상담신청
              </button>
            </div>

            {/* 🍎 모바일 메뉴 버튼 */}
            <button
              className="lg:hidden apple-button-ghost p-2"
              onClick={toggleMenu}
              aria-label="메뉴 열기"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 🍎 모바일 메뉴 오버레이 */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* 🍎 애플스토어 스타일 모바일 메뉴 */}
          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white/95 backdrop-blur-xl 
                          border-l border-gray-100/50 shadow-2xl overflow-y-auto">
            <div className="p-6">
              {/* 메뉴 헤더 */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="apple-icon bg-gradient-to-br from-blue-500 to-purple-600">
                    <img 
                      src={getImagePath('/LOGO.JPG')}
                      alt="M-CENTER 로고" 
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <span className="font-bold text-lg text-gray-900">M-CENTER</span>
                </div>
                <button
                  className="apple-button-ghost p-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 🍎 주요 액션 버튼들 */}
              <div className="apple-spacing-sm mb-8">
                <button 
                  className="apple-button-primary mobile-full-width"
                  onClick={() => handleNavigation('/diagnosis')}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  무료진단
                </button>
                
                <button 
                  className="apple-button-secondary mobile-full-width"
                  onClick={() => handleNavigation('/consultation')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  상담신청
                </button>
                
                <button 
                  className="apple-button-outline mobile-full-width"
                  onClick={() => handleNavigation('/tax-calculator')}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  세금계산
                </button>
              </div>

              {/* 🍎 서비스 섹션 */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-overflow-safe">핵심 서비스</h3>
                <div className="apple-spacing-xs">
                  {services.map((service, index) => (
                    <button
                      key={index}
                      className="apple-card w-full p-4 text-left hover:scale-[1.02] transition-all duration-200"
                      onClick={() => handleNavigation(service.href)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="apple-icon bg-gray-100">
                          {service.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-overflow-safe">
                            {service.title}
                          </h4>
                          <p className="text-sm text-gray-500 text-overflow-safe">
                            {service.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 🍎 기타 메뉴 */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-overflow-safe">더 알아보기</h3>
                <div className="apple-spacing-xs">
                  {[
                    { title: '성공사례', href: '/cases', icon: <Star className="w-5 h-5 text-yellow-500" /> },
                    { title: '센터장 소개', href: '/center-leader', icon: <User className="w-5 h-5 text-blue-500" /> },
                    { title: '고객지원', href: '/support', icon: <MessageCircle className="w-5 h-5 text-green-500" /> },
                    { title: '챗봇상담', href: '/chatbot', icon: <Bot className="w-5 h-5 text-purple-500" /> }
                  ].map((item, index) => (
                    <button
                      key={index}
                      className="apple-card w-full p-4 text-left hover:scale-[1.02] transition-all duration-200"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="apple-icon bg-gray-100">
                          {item.icon}
                        </div>
                        <span className="font-medium text-gray-900 text-overflow-safe">
                          {item.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 🍎 연락처 */}
              <div className="apple-card bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2 text-overflow-safe">전문가 직접 상담</h4>
                  <p className="text-sm text-gray-600 mb-4 text-overflow-safe">이후경 M센터장</p>
                  <div className="apple-spacing-xs">
                    <a href="tel:010-9251-9743">
                      <button className="apple-button-primary mobile-full-width">
                        <Phone className="w-4 h-4 mr-2" />
                        010-9251-9743
                      </button>
                    </a>
                    <a href="mailto:hongik423@gmail.com">
                      <button className="apple-button-outline mobile-full-width">
                        <Mail className="w-4 h-4 mr-2" />
                        이메일 문의
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 