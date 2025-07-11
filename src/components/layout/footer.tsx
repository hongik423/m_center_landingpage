'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, Facebook, Youtube, Instagram, Sparkles } from 'lucide-react';
import { getImagePath, getLogoPath } from '@/lib/utils';

export default function Footer() {
  // 안전한 스크롤 핸들러
  const handleScrollToDiagnosis = () => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        const diagnosisSection = document.getElementById('ai-diagnosis');
        diagnosisSection?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#ai-diagnosis';
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 회사 정보 - 개선된 디자인 */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-200">
                <img 
                  src={getImagePath('/esgr_logo.svg')}
                  alt="ESG 인증원 로고" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xl text-white">ESG 인증원</span>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">KAB</span>
                </div>
                <p className="text-gray-300 text-sm">KAB 인정 ESG 경영시스템 시범 인증기관</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 text-sm leading-relaxed max-w-md">
              공평성, 전문성, 신뢰성을 바탕으로 기업의 지속가능한 경영을 실현하는 
              전문 인증 서비스를 제공합니다.
            </p>
            
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="font-medium text-green-300">010-9251-9743</span>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">24시간 상담</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-green-400" />
                <span>hongik423@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-green-400" />
                <span>서울특별시 강남구</span>
              </div>
            </div>
          </div>

          {/* 핵심 서비스 - 간소화 */}
          <div>
            <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-400" />
              핵심 인증서비스
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link 
                  href="/esg-certification" 
                  className="hover:text-green-400 transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  ESG 경영시스템 인증
                </Link>
              </li>
              <li>
                <Link 
                  href="/esg-certification/process" 
                  className="hover:text-green-400 transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  ISO 9001 품질경영
                </Link>
              </li>
              <li>
                <Link 
                  href="/esg-certification/process" 
                  className="hover:text-green-400 transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  ISO 14001 환경경영
                </Link>
              </li>
              <li>
                <Link 
                  href="/esg-certification/process" 
                  className="hover:text-green-400 transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  ISO 45001 안전보건
                </Link>
              </li>
              <li>
                <Link 
                  href="/esg-certification/education" 
                  className="hover:text-green-400 transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  전문가 교육과정
                </Link>
              </li>
            </ul>
          </div>

          {/* 빠른 링크 및 소셜 미디어 */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">빠른 링크</h4>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li>
                <Link 
                  href="/esg-certification/about" 
                  className="hover:text-green-400 transition-colors text-sm"
                >
                  회사소개
                </Link>
              </li>
              <li>
                <Link 
                  href="/esg-certification/contact" 
                  className="hover:text-green-400 transition-colors text-sm"
                >
                  무료 상담
                </Link>
              </li>
              <li>
                <Link 
                  href="/esg-certification/apply" 
                  className="hover:text-green-400 transition-colors text-sm"
                >
                  온라인 인증 신청
                </Link>
              </li>
            </ul>
            
            {/* 소셜 미디어 - 개선된 디자인 */}
            <div>
              <h5 className="font-medium text-sm mb-3 text-gray-300">팔로우하기</h5>
              <div className="flex space-x-3">
                <Link 
                  href="/support/contact" 
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 touch-target"
                  aria-label="연락처"
                  title="연락처 페이지"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link 
                  href="/cases" 
                  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 touch-target"
                  aria-label="성공사례"
                  title="성공사례 영상"
                >
                  <Youtube className="w-5 h-5" />
                </Link>
                <Link 
                  href="/center-leader" 
                  className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 touch-target"
                  aria-label="센터장프로필"
                  title="센터장 프로필"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 정보 - 깔끔하게 정리 */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2025 ESG 인증원. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                이용약관
              </Link>
              <Link 
                href="/sitemap" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                사이트맵
              </Link>
            </div>
          </div>
          
          {/* 혁신 프레임워크 간단 소개 */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="text-center">
              <h5 className="font-medium text-sm mb-3 text-green-300">ESG 인증원 핵심 가치</h5>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  공평성
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  전문성
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  신뢰성
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  혁신성
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 