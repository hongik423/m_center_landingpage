'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  X,
  MessageSquare,
  ChevronUp
} from 'lucide-react';

interface FloatingErrorReportButtonProps {
  calculatorName: string;
  onReportClick: () => void;
  className?: string;
}

export function FloatingErrorReportButton({ 
  calculatorName, 
  onReportClick, 
  className 
}: FloatingErrorReportButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  // 스크롤 감지하여 버튼 표시
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300); // 300px 이상 스크롤하면 표시
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 주기적 펄스 애니메이션
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseCount(prev => prev + 1);
    }, 8000); // 8초마다 펄스

    return () => clearInterval(pulseInterval);
  }, []);

  // 확장된 상태에서 5초 후 자동으로 축소
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  if (!isVisible) return null;

  const handleButtonClick = () => {
    console.log('🔥 플로팅 오류신고 버튼 클릭됨');
    
    // 즉시 확장 상태 해제
    setIsExpanded(false);
    
    try {
      // 베타 피드백 폼이 있는 위치로 스크롤
      const feedbackSection = document.querySelector('[data-beta-feedback]');
      console.log('📍 베타 피드백 섹션 찾기:', feedbackSection);
      
      if (feedbackSection) {
        // 먼저 스크롤
        feedbackSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        console.log('📜 베타 피드백 섹션으로 스크롤 완료');
        
        // 베타 피드백 폼 자동 열기 (여러 방법으로 시도)
        setTimeout(() => {
          console.log('🔍 베타 피드백 버튼 찾기 시작...');
          
                     // 첫 번째 시도: 바로 텍스트 매칭으로 시작 (CSS :contains()는 표준이 아니므로 제외)
           let feedbackButton: HTMLButtonElement | null = null;
          
          // 두 번째 시도: 더 정확한 텍스트 매칭
          if (!feedbackButton) {
            const buttons = feedbackSection.querySelectorAll('button');
            console.log(`🔍 총 ${buttons.length}개 버튼 발견, 검색 중...`);
            
            buttons.forEach((button, index) => {
              const buttonText = button.textContent || '';
              console.log(`버튼 ${index + 1}: "${buttonText}"`);
              
              if (buttonText.includes('오류 신고') || 
                  buttonText.includes('신고하기') || 
                  buttonText.includes('🚨') ||
                  buttonText.includes('Bug') ||
                  button.innerHTML.includes('Bug')) {
                feedbackButton = button as HTMLButtonElement;
                console.log(`✅ 매칭된 버튼 발견: "${buttonText}"`);
              }
            });
          }
          
          // 세 번째 시도: Bug 아이콘이 있는 버튼 찾기
          if (!feedbackButton) {
            const bugButtons = feedbackSection.querySelectorAll('button svg[class*="lucide-bug"], button svg[data-testid="bug"]');
            if (bugButtons.length > 0) {
              feedbackButton = bugButtons[0].closest('button') as HTMLButtonElement;
              console.log('🐛 Bug 아이콘으로 버튼 발견');
            }
          }
          
          // 네 번째 시도: 클래스명으로 찾기
          if (!feedbackButton) {
            feedbackButton = feedbackSection.querySelector('button[class*="red"], button[class*="error"], button[class*="report"]') as HTMLButtonElement;
            console.log('🎨 클래스명으로 버튼 찾기 시도');
          }
          
          // 버튼 클릭
          if (feedbackButton) {
            console.log('🎯 베타 피드백 버튼 클릭 시도');
            feedbackButton.click();
            console.log('✅ 베타 피드백 폼 자동 열기 성공!');
          } else {
            console.warn('⚠️ 베타 피드백 버튼을 찾을 수 없음 - 모든 selector 실패');
            
            // 최후의 수단: 사용자에게 수동 클릭 안내
            alert('🚨 오류신고를 위해 페이지 하단의 "오류 신고하기" 버튼을 클릭해주세요!');
          }
        }, 800); // 스크롤 완료 후 약간 더 기다림
      } else {
        console.warn('⚠️ 베타 피드백 섹션을 찾을 수 없음');
        
        // 대안 1: onReportClick 함수 실행
        if (onReportClick) {
          console.log('🔄 onReportClick 함수 실행');
          onReportClick();
        }
        
        // 대안 2: 페이지 하단으로 스크롤
        setTimeout(() => {
          console.log('📜 페이지 하단으로 스크롤');
          window.scrollTo({
            top: document.body.scrollHeight - window.innerHeight,
            behavior: 'smooth'
          });
          
          // 3초 후 사용자에게 안내
          setTimeout(() => {
            alert('🚨 오류신고를 위해 화면 하단의 "오류 신고하기" 버튼을 찾아 클릭해주세요!');
          }, 3000);
        }, 500);
      }
    } catch (error) {
      console.error('❌ 플로팅 버튼 클릭 중 오류:', error);
      
      // 오류 발생 시 onReportClick 함수 실행
      if (onReportClick) {
        console.log('🔄 오류 발생으로 onReportClick 함수 실행');
        onReportClick();
      }
    }
  };

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[9998] ${className}`}>
      {/* 확장된 정보 패널 */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 mb-2 w-80 max-w-[calc(100vw-3rem)] bg-white border border-red-200 rounded-lg shadow-xl p-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800 text-sm">오류 신고</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
              onClick={toggleExpanded}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2 text-xs text-gray-700">
            <p className="font-medium text-red-700">
              🎯 <strong>{calculatorName}</strong>에서 문제 발견?
            </p>
            <div className="space-y-1">
              <div>• 🔢 계산 결과가 이상함</div>
              <div>• 🖱️ 버튼이 작동하지 않음</div>
              <div>• 📱 모바일에서 화면 깨짐</div>
              <div>• 💸 세율 적용 오류</div>
            </div>
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <div className="text-blue-800 font-medium text-xs">
                ⚡ <strong>빠른 처리:</strong> 1-2일 내 수정 후 이메일 회신
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 플로팅 버튼 */}
      <div className="relative">
        <Button
          onClick={handleButtonClick}
          className={`
            relative h-14 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
            text-white font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 
            transition-all duration-300 border-0 rounded-full group
            ${pulseCount > 0 ? 'animate-pulse' : ''}
          `}
          style={{
            animation: pulseCount > 0 && pulseCount % 2 === 1 ? 'pulse 2s infinite' : 'none'
          }}
        >
          <Bug className="w-5 h-5 mr-2 group-hover:animate-bounce" />
          <span className="hidden sm:inline">오류신고</span>
          <span className="sm:hidden">신고</span>
          
          {/* 펄스 링 애니메이션 */}
          <div className="absolute inset-0 rounded-full border-2 border-red-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
        </Button>

        {/* 확장/축소 버튼 */}
        <Button
          onClick={toggleExpanded}
          variant="ghost"
          size="sm"
          className="absolute -top-2 -right-1 h-6 w-6 p-0 bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ChevronUp className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>

        {/* BETA 뱃지 */}
        <Badge 
          variant="outline" 
          className="absolute -top-3 -left-2 bg-yellow-100 text-yellow-700 border-yellow-300 text-xs font-bold animate-pulse"
        >
          🧪 BETA
        </Badge>

        {/* 알림 도트 */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse border-2 border-white"></div>
      </div>
    </div>
  );
} 