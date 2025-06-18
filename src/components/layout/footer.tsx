import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/logo-gyeongji.svg"
                alt="기업의별 로고"
                width={120}
                height={32}
                className="h-8 w-auto brightness-0 invert"
                style={{ width: 'auto', height: '32px' }}
              />
            </div>
            <div className="mb-2">
              <span className="font-bold text-lg">기업의별</span>
              <span className="text-sm text-gray-400 ml-2">경영지도센터</span>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Business Model Zen 프레임워크로 기업 성장을 지원하는 
              전문 컨설팅 기업입니다.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hongik423@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>서울특별시 강남구</span>
              </div>
            </div>
          </div>

          {/* 서비스 링크 */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">서비스</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link 
                  href="/services/ai-productivity" 
                  className="hover:text-white transition-colors text-sm"
                >
                  AI 활용 생산성향상
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/factory-auction" 
                  className="hover:text-white transition-colors text-sm"
                >
                  경매활용 공장구매
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/tech-startup" 
                  className="hover:text-white transition-colors text-sm"
                >
                  기술사업화/기술창업
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/certification" 
                  className="hover:text-white transition-colors text-sm"
                >
                  인증지원
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/website" 
                  className="hover:text-white transition-colors text-sm"
                >
                  웹사이트 구축
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">고객지원</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link 
                  href="/support/faq" 
                  className="hover:text-white transition-colors text-sm"
                >
                  자주묻는질문
                </Link>
              </li>
              <li>
                <Link 
                  href="/support/notices" 
                  className="hover:text-white transition-colors text-sm"
                >
                  공지사항
                </Link>
              </li>
              <li>
                <Link 
                  href="/support/downloads" 
                  className="hover:text-white transition-colors text-sm"
                >
                  자료실
                </Link>
              </li>
              <li>
                <Link 
                  href="/support/contact" 
                  className="hover:text-white transition-colors text-sm"
                >
                  1:1 문의
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      const diagnosisSection = document.getElementById('ai-diagnosis');
                      diagnosisSection?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#ai-diagnosis';
                    }
                  }}
                  className="hover:text-white transition-colors text-sm text-left"
                >
                  무료진단
                </button>
              </li>
            </ul>
          </div>

          {/* 소셜 미디어 및 기타 */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">팔로우하기</h4>
            <div className="flex space-x-3 mb-6">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Business Model Zen</h5>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>🔍 가치 발견</li>
                <li>💡 가치 창출</li>
                <li>🚀 가치 제공</li>
                <li>💰 가치 포착</li>
                <li>🔄 가치 교정</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2025 기업의별 경영지도센터. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              이용약관
            </Link>
            <Link 
              href="/sitemap" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              사이트맵
            </Link>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-sm text-gray-500 text-center">
            사업자등록번호: 123-45-67890 | 대표자: 이후경 | 
            주소: 서울특별시 강남구 테헤란로 123, 4층 | 
            통신판매업신고번호: 제2024-서울강남-1234호
          </p>
        </div>
      </div>
    </footer>
  );
} 