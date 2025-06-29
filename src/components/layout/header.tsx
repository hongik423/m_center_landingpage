'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X
} from 'lucide-react';
import { getImagePath } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
  };

  return (
    <>
      {/* 애플스토어 스타일 헤더 */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/20' 
          : 'bg-white/95 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center justify-between h-11 px-6 lg:px-8">
            
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
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                href="/"
                className="px-4 py-2 text-sm text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-normal"
              >
                홈
              </Link>
              
              <Link
                href="/services/business-analysis"
                className="px-4 py-2 text-sm text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-normal"
              >
                사업분석
              </Link>
              
              <Link
                href="/services/ai-productivity"
                className="px-4 py-2 text-sm text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-normal"
              >
                AI생산성
              </Link>
              
              <Link
                href="/services/factory-auction"
                className="px-4 py-2 text-sm text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-normal"
              >
                공장구매
              </Link>
              
              <Link
                href="/services/tech-startup"
                className="px-4 py-2 text-sm text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-normal"
              >
                기술창업
              </Link>
              
              <Link
                href="/services/certification"
                className="px-4 py-2 text-sm text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-normal"
              >
                인증지원
              </Link>
              
              <Link
                href="/diagnosis"
                className="px-4 py-2 text-sm text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-normal"
              >
                무료진단
              </Link>
              
              <Link
                href="/cases"
                className="px-4 py-2 text-sm text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-normal"
              >
                성공사례
              </Link>
              
              <Link
                href="/center-leader"
                className="px-4 py-2 text-sm text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-normal"
              >
                센터장
              </Link>
              
              <Link
                href="/support"
                className="px-4 py-2 text-sm text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-normal"
              >
                고객지원
              </Link>
            </div>

            {/* 애플스토어 스타일 액션 버튼들 - 오른쪽 */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                className="px-3 py-1.5 text-sm text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 rounded-full transition-all duration-200 font-medium"
                onClick={() => handleNavigation('/diagnosis')}
                aria-label="무료진단"
              >
                무료진단
              </button>
              
              <button
                className="px-3 py-1.5 text-sm text-green-600 hover:text-white hover:bg-green-600 bg-green-50 rounded-full transition-all duration-200 font-medium"
                onClick={() => handleNavigation('/consultation')}
                aria-label="상담신청"
              >
                상담신청
              </button>
              
              <button
                className="px-3 py-1.5 text-sm text-purple-600 hover:text-white hover:bg-purple-600 bg-purple-50 rounded-full transition-all duration-200 font-medium"
                onClick={() => handleNavigation('/tax-calculator')}
                aria-label="세금계산"
              >
                세금계산
              </button>
            </div>

            {/* 모바일 햄버거 메뉴 버튼 */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="메뉴 열기"
            >
              <Menu className="w-4 h-4 text-gray-800" />
            </button>
          </nav>
        </div>
      </header>

      {/* 모바일 풀스크린 메뉴 */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* 배경 */}
          <div className="absolute inset-0 bg-white" />
          
          {/* 메뉴 콘텐츠 */}
          <div className="relative h-full flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between h-11 px-6 border-b border-gray-200">
              <Link 
                href="/"
                className="flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <img 
                    src={getImagePath('/LOGO.JPG')}
                    alt="M-CENTER" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </Link>
              
              <button
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
                aria-label="메뉴 닫기"
              >
                <X className="w-4 h-4 text-gray-800" />
              </button>
            </div>
            
            {/* 메뉴 리스트 */}
            <div className="flex-1 px-6 py-8">
              <div className="space-y-4">
                <Link
                  href="/"
                  className="block px-6 py-4 text-xl text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-light text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  홈
                </Link>
                
                <Link
                  href="/services/business-analysis"
                  className="block px-6 py-4 text-xl text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-light text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  사업분석
                </Link>
                
                <Link
                  href="/services/ai-productivity"
                  className="block px-6 py-4 text-xl text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-light text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AI생산성
                </Link>
                
                <Link
                  href="/services/factory-auction"
                  className="block px-6 py-4 text-xl text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-light text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  공장구매
                </Link>
                
                <Link
                  href="/services/tech-startup"
                  className="block px-6 py-4 text-xl text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-light text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  기술창업
                </Link>
                
                <Link
                  href="/services/certification"
                  className="block px-6 py-4 text-xl text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-light text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  인증지원
                </Link>
                
                <Link
                  href="/diagnosis"
                  className="block px-6 py-4 text-xl text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-light text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  무료진단
                </Link>
                
                <Link
                  href="/cases"
                  className="block px-6 py-4 text-xl text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-light text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  성공사례
                </Link>
                
                <Link
                  href="/center-leader"
                  className="block px-6 py-4 text-xl text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-light text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  센터장
                </Link>
                
                <Link
                  href="/support"
                  className="block px-6 py-4 text-xl text-gray-800 hover:text-white hover:bg-gray-800 bg-gray-100 rounded-full transition-all duration-200 font-light text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  고객지원
                </Link>
                
                <div className="border-t border-gray-200 pt-6 mt-8 space-y-4">
                  <Link
                    href="/diagnosis"
                    className="block px-6 py-4 text-lg text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-100 rounded-full transition-all duration-200 font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    무료진단
                  </Link>
                  
                  <Link
                    href="/consultation"
                    className="block px-6 py-4 text-lg text-green-600 hover:text-white hover:bg-green-600 bg-green-100 rounded-full transition-all duration-200 font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    상담신청
                  </Link>
                  
                  <Link
                    href="/tax-calculator"
                    className="block px-6 py-4 text-lg text-purple-600 hover:text-white hover:bg-purple-600 bg-purple-100 rounded-full transition-all duration-200 font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    세금계산
                  </Link>
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