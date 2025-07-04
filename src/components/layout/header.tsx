'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X,
  Home,
  BarChart3,
  Zap,
  Factory,
  Rocket,
  Shield,
  Stethoscope,
  Trophy,
  User,
  Video,
  Headphones,
  Phone,
  Calculator,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Building2,
  TrendingUp,
  DollarSign,
  FileText,
  Crown
} from 'lucide-react';
import { getImagePath } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedTaxMenu, setExpandedTaxMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 페이지 이동 핸들러
  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
    setExpandedTaxMenu(false);
  };

  // 세금계산기 선택 핸들러
  const handleTaxCalculatorSelect = (calculatorId: string) => {
    // URL 파라미터로 특정 계산기 선택
    const url = `/tax-calculator?calculator=${calculatorId}`;
    router.push(url);
    setIsMenuOpen(false);
    setExpandedTaxMenu(false);
  };

  // 모바일 메뉴 닫기 (Esc 키 지원)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        setExpandedTaxMenu(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // 네비게이션 메뉴 데이터
  const navigationItems = [
    { href: '/', label: '홈', icon: Home },
    { href: '/services/business-analysis', label: '사업분석', icon: BarChart3 },
    { href: '/services/ai-productivity', label: 'AI생산성', icon: Zap },
    { href: '/services/factory-auction', label: '공장구매', icon: Factory },
    { href: '/services/tech-startup', label: '기술창업', icon: Rocket },
    { href: '/services/certification', label: '인증지원', icon: Shield },
    { href: '/diagnosis', label: '무료진단', icon: Stethoscope },
    { href: '/cases', label: '성공사례', icon: Trophy },
    { href: '/center-leader', label: '센터장', icon: User },
    { href: '/seminar', label: '세미나', icon: Video },
    { href: '/support', label: '고객지원', icon: Headphones }
  ];

  // 세금계산기 메뉴 데이터
  const taxCalculators = [
    {
      id: 'earned-income',
      title: '근로소득세 계산기',
      description: '급여 소득자를 위한 소득세 계산',
      icon: User,
      color: 'blue'
    },
    {
      id: 'comprehensive-income',
      title: '종합소득세 계산기',
      description: '사업소득, 기타소득 포함 종합소득세',
      icon: FileText,
      color: 'green'
    },
    {
      id: 'capital-gains',
      title: '양도소득세 계산기',
      description: '부동산, 주식 양도소득세 계산',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 'inheritance',
      title: '상속세 계산기',
      description: '상속재산에 대한 상속세 계산',
      icon: Building2,
      color: 'orange'
    },
    {
      id: 'gift',
      title: '증여세 계산기',
      description: '증여재산에 대한 증여세 계산',
      icon: DollarSign,
      color: 'pink'
    },
    {
      id: 'corporate-tax',
      title: '법인세 계산기',
      description: '법인의 소득에 대한 법인세 계산',
      icon: Building2,
      color: 'indigo'
    },
    {
      id: 'vat',
      title: '부가가치세 계산기',
      description: '매출, 매입세액 부가가치세 계산',
      icon: Calculator,
      color: 'cyan'
    },
    {
      id: 'withholding',
      title: '원천징수세 계산기',
      description: '급여, 용역비 원천징수세 계산',
      icon: FileText,
      color: 'emerald'
    },
    {
      id: 'business-inheritance',
      title: '가업상속세 계산기',
      description: '중소기업·중견기업 가업상속공제',
      icon: Crown,
      color: 'violet'
    },
    {
      id: 'stock-transfer',
      title: '주식이동세 계산기',
      description: '주식 매매시 발생하는 양도소득세',
      icon: TrendingUp,
      color: 'pink'
    }
  ];

  const actionButtons = [
    { href: '/diagnosis', label: '무료진단', color: 'blue', icon: Stethoscope },
    { href: '/consultation', label: '상담신청', color: 'green', icon: MessageSquare },
    { href: '/tax-calculator', label: '세금계산', color: 'purple', icon: Calculator }
  ];

  return (
    <>
      {/* 애플스토어 스타일 헤더 */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/20' 
          : 'bg-white/95 backdrop-blur-xl'
      }`}>
        <div className="max-w-screen-2xl mx-auto">
          <nav className="flex items-center justify-between h-11 px-4 lg:px-6">
            
            {/* 애플 로고 스타일 - 왼쪽 */}
            <Link 
              href="/"
              className="flex items-center hover:opacity-70 transition-opacity duration-200"
              aria-label="M-CENTER 홈페이지로 이동"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <img 
                  src={getImagePath('/LOGO.JPG')}
                  alt="M-CENTER" 
                  className="w-6 h-6 object-contain"
                />
              </div>
            </Link>

            {/* 애플스토어 스타일 메인 네비게이션 - 가운데 */}
            <div className="hidden lg:flex items-center space-x-1.5">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 text-sm rounded-full transition-all duration-200 font-normal ${
                    pathname === item.href
                      ? 'text-white bg-gray-800'
                      : 'text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* 애플스토어 스타일 액션 버튼들 - 오른쪽 */}
            <div className="hidden lg:flex items-center space-x-2">
              {actionButtons.map((button) => (
                <button
                  key={button.href}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 font-medium ${
                    button.color === 'blue' 
                      ? 'text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50'
                      : button.color === 'green'
                      ? 'text-green-600 hover:text-white hover:bg-green-600 bg-green-50'
                      : 'text-purple-600 hover:text-white hover:bg-purple-600 bg-purple-50'
                  }`}
                  onClick={() => handleNavigation(button.href)}
                  aria-label={button.label}
                >
                  {button.label}
                </button>
              ))}
            </div>

            {/* 모바일 햄버거 메뉴 버튼 */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              <Menu className="w-4 h-4 text-gray-800" />
            </button>
          </nav>
        </div>
      </header>

      {/* 🔥 개선된 모바일 풀스크린 메뉴 */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* 반투명 배경 */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => {
              setIsMenuOpen(false);
              setExpandedTaxMenu(false);
            }}
            aria-hidden="true"
          />
          
          {/* 메뉴 콘텐츠 */}
          <div className="relative h-full flex flex-col bg-white shadow-2xl">
            
            {/* 🎯 개선된 헤더 */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gray-50">
              <Link 
                href="/"
                className="flex items-center gap-3"
                onClick={() => {
                  setIsMenuOpen(false);
                  setExpandedTaxMenu(false);
                }}
                aria-label="M-CENTER 홈페이지로 이동"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg">
                  <img 
                    src={getImagePath('/LOGO.JPG')}
                    alt="M-CENTER" 
                    className="w-6 h-6 object-contain brightness-0 invert"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900">M-CENTER</div>
                  <div className="text-xs text-gray-600">모바일 메뉴</div>
                </div>
              </Link>
              
              <button
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors duration-200"
                onClick={() => {
                  setIsMenuOpen(false);
                  setExpandedTaxMenu(false);
                }}
                aria-label="메뉴 닫기"
              >
                <X className="w-5 h-5 text-gray-800" />
              </button>
            </div>
            
            {/* 🔥 카테고리별 메뉴 리스트 */}
            <div className="flex-1 overflow-y-auto">
              
              {/* 📱 주요 서비스 섹션 */}
              <div className="px-6 py-6">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  🚀 주요 서비스
                </div>
                <div className="space-y-2">
                  {navigationItems.slice(0, 6).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                        pathname === item.href
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setExpandedTaxMenu(false);
                      }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        pathname === item.href
                          ? 'bg-white/20'
                          : 'bg-white shadow-sm'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          pathname === item.href ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{item.label}</div>
                        <div className={`text-xs ${
                          pathname === item.href ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {item.label === '사업분석' && 'BM ZEN 프레임워크'}
                          {item.label === 'AI생산성' && 'ChatGPT 활용법'}
                          {item.label === '공장구매' && '경매 전문 컨설팅'}
                          {item.label === '기술창업' && 'R&D 정부지원'}
                          {item.label === '인증지원' && '벤처/ISO/ESG'}
                          {item.label === '홈' && '메인 페이지'}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${
                        pathname === item.href ? 'text-white' : 'text-gray-400'
                      }`} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* 🎯 진단 & 정보 섹션 */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  📊 진단 & 정보
                </div>
                <div className="space-y-2">
                  {navigationItems.slice(6).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                        pathname === item.href
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-800 hover:bg-green-50 hover:text-green-700'
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setExpandedTaxMenu(false);
                      }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        pathname === item.href
                          ? 'bg-white/20'
                          : 'bg-white shadow-sm'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          pathname === item.href ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{item.label}</div>
                        <div className={`text-xs ${
                          pathname === item.href ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {item.label === '무료진단' && '5분 간편 진단'}
                          {item.label === '성공사례' && '실제 성공 스토리'}
                          {item.label === '센터장' && '이후경 전문가'}
                          {item.label === '세미나' && '온라인 영상'}
                          {item.label === '고객지원' && '24시간 지원'}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${
                        pathname === item.href ? 'text-white' : 'text-gray-400'
                      }`} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* 🔥 NEW: 세금계산기 전용 섹션 */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  🧮 세금계산기
                </div>
                
                {/* 세금계산기 메인 버튼 */}
                <div className="mb-4">
                  <button
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                      pathname === '/tax-calculator'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-800 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                    onClick={() => setExpandedTaxMenu(!expandedTaxMenu)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      pathname === '/tax-calculator'
                        ? 'bg-white/20'
                        : 'bg-white shadow-sm'
                    }`}>
                      <Calculator className={`w-5 h-5 ${
                        pathname === '/tax-calculator' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">세금계산기</div>
                      <div className={`text-xs ${
                        pathname === '/tax-calculator' ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        10가지 전문 세금계산기
                      </div>
                    </div>
                    <div className="transition-transform duration-200">
                      {expandedTaxMenu ? (
                        <ChevronDown className={`w-4 h-4 ${
                          pathname === '/tax-calculator' ? 'text-white' : 'text-gray-400'
                        }`} />
                      ) : (
                        <ChevronRight className={`w-4 h-4 ${
                          pathname === '/tax-calculator' ? 'text-white' : 'text-gray-400'
                        }`} />
                      )}
                    </div>
                  </button>
                </div>

                {/* 🔥 세금계산기 서브메뉴 */}
                {expandedTaxMenu && (
                  <div className="space-y-1 ml-4 pl-4 border-l-2 border-purple-200">
                    {taxCalculators.map((calc) => (
                      <button
                        key={calc.id}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-sm hover:bg-purple-50 hover:text-purple-700 border ${
                          pathname === `/tax-calculator?calculator=${calc.id}`
                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-200'
                        }`}
                        onClick={() => handleTaxCalculatorSelect(calc.id)}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          pathname === `/tax-calculator?calculator=${calc.id}`
                            ? 'bg-purple-200'
                            : 'bg-gray-100'
                        }`}>
                          <calc.icon className={`w-4 h-4 ${
                            pathname === `/tax-calculator?calculator=${calc.id}`
                              ? 'text-purple-600'
                              : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{calc.title}</div>
                          <div className={`text-xs ${
                            pathname === `/tax-calculator?calculator=${calc.id}`
                              ? 'text-purple-600/80'
                              : 'text-gray-500'
                          }`}>
                            {calc.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 🎯 바로가기 액션 버튼들 */}
              <div className="px-6 py-6 border-t border-gray-100 bg-gray-50">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  ⚡ 바로가기
                </div>
                <div className="space-y-3">
                  {actionButtons.slice(0, 2).map((button) => (
                    <Link
                      key={button.href}
                      href={button.href}
                      className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-sm font-semibold ${
                        button.color === 'blue' 
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setExpandedTaxMenu(false);
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <button.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{button.label}</div>
                        <div className="text-xs text-white/80">
                          {button.label === '무료진단' && '지금 바로 시작'}
                          {button.label === '상담신청' && '전문가 상담'}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/80" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* 📞 연락처 정보 */}
              <div className="px-6 py-6 border-t border-gray-200 bg-white">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-800 mb-2">📞 전화 상담</div>
                  <Link 
                    href="tel:010-9251-9743"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setExpandedTaxMenu(false);
                    }}
                  >
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="font-mono font-bold text-gray-800">010-9251-9743</span>
                  </Link>
                  <div className="text-xs text-gray-500 mt-2">평일 09:00-18:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 헤더 공간 확보 */}
      <div className="h-11" />
    </>
  );
};

export default Header; 