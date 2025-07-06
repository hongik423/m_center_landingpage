'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ChevronDown
} from 'lucide-react';
import { getImagePath } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems = [
    { href: '/', label: 'HOME' },
    { href: '/services/business-analysis', label: '사업분석' },
    { href: '/services/ai-productivity', label: 'AI일터혁신' },
    { href: '/services/policy-funding', label: '정책자금' },
    { href: '/services/tech-startup', label: '기술경영' },
    { href: '/services/certification', label: '벤처/ISO/인증' },
    { href: '/services/website', label: '매출증대웹사이트' },
    { href: '/cases', label: '성공사례' },
    { href: '/center-leader', label: '센터장' },
    { href: '/seminar', label: '세미나' },
    { href: '/support', label: '고객지원' },
  ];

  const actionItems: Array<{
    href: string;
    label: string;
    highlight?: boolean;
    special?: boolean;
  }> = [
    { href: '/diagnosis', label: '무료진단', highlight: true },
    { href: '/consultation', label: '상담신청', highlight: true },
    { href: '/tax-calculator', label: '세금계산기', highlight: false, special: true },
    { href: '/services/policy-funding', label: '정책자금투자타당성분석기', highlight: false, special: true },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/98 backdrop-blur-xl shadow-md border-b border-gray-100' 
        : 'bg-white/95 backdrop-blur-xl border-b border-gray-100'
    }`}>
      <div className="w-full px-1 lg:px-2">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src={getImagePath('/LOGO.svg')} 
              alt="M-Center Logo" 
              className="h-7 w-auto transition-opacity duration-300 hover:opacity-70"
            />
          </Link>

          {/* Desktop Navigation - Enhanced Apple Store Style */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-2">
            <div className="flex items-center space-x-3">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs font-medium transition-all duration-300 whitespace-nowrap px-1.5 py-1 rounded-md ${
                      isActive
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Desktop Action Items - Right Aligned with Enhanced Visibility */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            {actionItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-semibold transition-all duration-300 whitespace-nowrap px-2 py-1.5 rounded-full border ${
                    item.highlight
                      ? isActive
                        ? 'bg-blue-600 text-white shadow-lg border-blue-600 transform scale-105'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white hover:shadow-lg border-blue-200 hover:transform hover:scale-105'
                      : item.special
                        ? isActive
                          ? 'bg-orange-600 text-white shadow-lg border-orange-600 transform scale-105'
                          : 'bg-orange-500 text-white hover:bg-orange-600 border-orange-500 shadow-md hover:shadow-lg hover:transform hover:scale-105'
                        : isActive
                          ? 'text-gray-900 bg-gray-100 border-gray-200'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button - Enhanced for touch */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden touch-target-enhanced ios-touch-feedback mobile-menu-button p-2 -mr-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="메뉴 열기"
            style={{ minWidth: '40px', minHeight: '40px' }}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation - Enhanced with touch optimization */}
        {isMenuOpen && (
          <nav className="lg:hidden mobile-menu-overlay absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl smooth-scroll-ios">
            <div className="mobile-menu-content max-h-[calc(100vh-3.5rem)] overflow-y-auto">
              <div className="py-2">
                {/* Main Navigation Items */}
                <div className="mobile-menu-section px-4 py-2">
                  <div className="mobile-menu-section-title text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    서비스
                  </div>
                  {mainNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`mobile-menu-item-enhanced ios-touch-feedback block py-4 px-2 text-base transition-all duration-300 rounded-lg ${
                          isActive
                            ? 'text-gray-900 font-semibold bg-blue-50'
                            : 'text-gray-700 active:text-gray-900'
                        }`}
                        style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Action Items */}
                <div className="mobile-menu-section px-4 py-2 border-t border-gray-200">
                  <div className="mobile-menu-section-title text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">
                    바로가기
                  </div>
                  {actionItems.map((item) => {
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`mobile-menu-item-enhanced ios-touch-feedback block py-4 px-2 text-base transition-all duration-300 rounded-lg ${
                          item.highlight
                            ? 'text-blue-700 font-semibold bg-blue-50 border-l-4 border-blue-500'
                            : item.special
                              ? isActive
                                ? 'text-white font-bold bg-orange-500 border-l-4 border-orange-600 shadow-md'
                                : 'text-white font-semibold bg-orange-500 border-l-4 border-orange-600 shadow-sm hover:shadow-md'
                              : isActive
                                ? 'text-gray-900 font-semibold bg-gray-50'
                                : 'text-gray-700 active:text-gray-900'
                        }`}
                        style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
} 