'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  X, 
  Send, 
  Phone,
  FileText,
  Minimize2,
  Maximize2,
  Sparkles,
  GripVertical
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Position {
  x: number;
  y: number;
}

// 빠른 액션 버튼
const quickActions = [
  { text: '상담신청', icon: Phone, action: '/consultation' },
  { text: '무료진단', icon: FileText, action: '/#ai-diagnosis' },
  { text: '서비스안내', icon: Sparkles, action: '/services/ai-productivity' }
];

// 초기 메시지
const getWelcomeMessage = (): Message => ({
  id: '1',
  content: `👋 **기업의별 AI상담사**입니다!

💡 **빠른 도움받기:**
• 실시간 상담 가능
• 정부지원사업 안내
• 무료 기업진단

궁금한 점을 메시지로 보내거나 아래 버튼을 눌러보세요! ⚡`,
  sender: 'bot',
  timestamp: new Date()
});

export default function FloatingChatbot() {
  // 기본 상태
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // 🔵 **오른쪽 고정, 수직 드래그만 가능한 상태**
  const [position, setPosition] = useState<Position>({ x: 0, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  
  // 🚀 **드래그 로그 최적화를 위한 throttle**
  const [lastLogTime, setLastLogTime] = useState(0);
  const LOG_THROTTLE_MS = 500; // 0.5초마다 한번만 로그

  // 🔵 **모바일 감지**
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔥 **모바일 감지 로직**
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
                           /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 메시지 추가
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // 자동 스크롤
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // 🔵 **오른쪽 끝에 고정된 초기 위치 설정 (모바일 최적화)**
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updatePosition = () => {
        const mobileOffset = isMobile ? 10 : 20; // 모바일에서 여백 줄임
        const buttonSize = isMobile ? 60 : 64; // 모바일에서 버튼 크기 조정
        const chatWidth = isMobile ? Math.min(window.innerWidth - 20, 380) : 420; // 모바일에서 채팅창 크기 조정
        
        setPosition(prev => ({
          x: window.innerWidth - (isOpen ? chatWidth + 10 : buttonSize + mobileOffset),
          y: prev.y
        }));
      };
      
      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isOpen, isMobile]);

  // 🔥 **수직 드래그 시작 (모바일 터치 지원)**
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragStart({
      x: clientX,
      y: clientY - position.y
    });
    
    console.log('🎯 수직 드래그 시작:', { y: position.y, isMobile });
  };

  // 🔥 **수직 드래그 이벤트 처리 (터치 지원)**
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const newY = clientY - dragStart.y;
      
      // Y축 경계 체크 (모바일 최적화)
      const mobileOffset = isMobile ? 10 : 20;
      const buttonHeight = isMobile ? 60 : 64;
      const chatHeight = isOpen ? (isMinimized ? 80 : (isMobile ? 480 : 520)) : buttonHeight;
      const maxY = window.innerHeight - chatHeight - mobileOffset;
      const boundedY = Math.max(mobileOffset, Math.min(newY, maxY));
      
      // X축은 항상 오른쪽 끝에 고정 (모바일 최적화)
      const chatWidth = isMobile ? Math.min(window.innerWidth - 20, 380) : 420;
      const buttonSize = isMobile ? 60 : 64;
      const sideOffset = isMobile ? 10 : 20;
      const fixedX = window.innerWidth - (isOpen ? chatWidth + 10 : buttonSize + sideOffset);
      
      setPosition({
        x: fixedX,
        y: boundedY
      });
      
      // 🚀 **로그 throttling으로 스팸 방지**
      const now = Date.now();
      if (now - lastLogTime > LOG_THROTTLE_MS) {
        console.log('🚀 수직 드래그 중:', { y: boundedY, isMobile, throttled: true });
        setLastLogTime(now);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        console.log('✅ 드래그 종료 - 최종 위치:', { y: position.y, isMobile });
      }
    };

    if (isDragging) {
      // 터치 이벤트도 지원
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragStart, isOpen, isMinimized, lastLogTime, position.y, isMobile]);

  // 메시지 전송
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      // 개발 환경에서만 API 호출
      if (process.env.NODE_ENV === 'development') {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: messages.slice(-5)
          }),
        });

        if (!response.ok) throw new Error('서버 오류');

        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        
        addMessage(botMessage);
      } else {
        // 프로덕션 환경에서는 클라이언트 사이드 응답
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateClientResponse(text),
          sender: 'bot',
          timestamp: new Date()
        };
        
        // 실제 응답 시간을 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        addMessage(botMessage);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `❌ 죄송합니다. 일시적으로 AI 기능을 사용할 수 없습니다.\n\n📞 **즉시 상담을 원하시면:**\n• 전화: 010-9251-9743\n• 이메일: lhk@injc.kr\n\n⚡ **무료 서비스 안내:**\n• [무료 AI진단 신청](/#ai-diagnosis)\n• [전문가 상담 신청](/consultation)\n• [서비스 안내](/services/business-analysis)`,
        sender: 'bot',
        timestamp: new Date()
      };
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  }, [messages, addMessage]);

  // 클라이언트 사이드 응답 생성 함수
  const generateClientResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // 기본 응답 템플릿
    const responses = {
      greeting: `👋 안녕하세요! **기업의별 M-CENTER** AI상담사입니다.\n\n🏆 **대한민국 최고의 경영컨설팅 전문기관**으로 25년간 검증된 노하우를 바탕으로 도움드리겠습니다!`,
      
      services: `🚀 **M-CENTER 6대 핵심서비스**\n\n1. **BM ZEN 사업분석** - 매출 20-40% 증대\n2. **AI 생산성향상** - 업무효율 40-60% 향상  \n3. **경매활용 공장구매** - 부동산비용 30-50% 절감\n4. **기술사업화/창업** - 평균 5억원 정부지원\n5. **인증지원** - 연간 세제혜택 5천만원\n6. **웹사이트 구축** - 온라인 매출 30% 증대`,
      
      consultation: `💬 **전문가 무료 상담 안내**\n\n📞 **즉시 상담:**\n• 전화: 010-9251-9743 (이후경 경영지도사)\n• 이메일: lhk@injc.kr\n\n⚡ **온라인 신청:**\n• [무료 AI진단](/diagnosis)\n• [전문가 상담](/consultation)\n• [서비스 안내](/services/business-analysis)`,
      
      general: `✨ **기업의별 M-CENTER**가 도움드리겠습니다!\n\n🎯 **맞춤형 솔루션을 위해** 다음 중 관심 있는 분야를 알려주세요:\n\n• 📈 **매출 증대** - BM ZEN 사업분석\n• 🤖 **업무 효율화** - AI 생산성향상\n• 🏭 **공장/부동산** - 경매활용 구매\n• 🚀 **기술창업** - 사업화 지원\n• 📋 **인증/세제혜택** - 각종 인증\n• 🌐 **온라인 마케팅** - 웹사이트 구축\n\n📞 **즉시 상담: 010-9251-9743**`
    };

    // 키워드 매칭
    if (lowerMessage.includes('안녕') || lowerMessage.includes('처음') || lowerMessage.includes('시작')) {
      return responses.greeting;
    }
    
    if (lowerMessage.includes('서비스') || lowerMessage.includes('사업') || lowerMessage.includes('컨설팅')) {
      return responses.services;
    }
    
    if (lowerMessage.includes('상담') || lowerMessage.includes('연락') || lowerMessage.includes('전화')) {
      return responses.consultation;
    }
    
    if (lowerMessage.includes('매출') || lowerMessage.includes('수익')) {
      return `💰 **매출 증대 전문 컨설팅**\n\n🏆 **BM ZEN 사업분석 서비스**\n• 독자적 프레임워크로 95% 성공률\n• 평균 20-40% 매출 증대 보장\n• 3개월 내 가시적 성과\n\n📊 **실제 성과:**\n• 제조업체: 8개월 만에 45% 매출 증가\n• IT서비스: 6개월 만에 수익률 60% 개선\n\n📞 **무료 상담: 010-9251-9743**\n⚡ [무료 AI진단 신청](/#ai-diagnosis)`;
    }
    
    if (lowerMessage.includes('AI') || lowerMessage.includes('효율') || lowerMessage.includes('자동화')) {
      return `🤖 **AI 생산성향상 컨설팅**\n\n✨ **ChatGPT 전문 활용법**\n• 업무효율 40-60% 향상 보장\n• 인건비 25% 절감 효과\n• 실무진 1:1 맞춤 교육\n\n🎯 **정부지원 연계:**\n• AI 바우처 최대 2천만원 지원\n• 100% 정부지원 가능\n\n📞 **상담: 010-9251-9743**\n⚡ [서비스 상세보기](/services/ai-productivity)`;
    }
    
    if (lowerMessage.includes('공장') || lowerMessage.includes('부동산') || lowerMessage.includes('임대')) {
      return `🏭 **경매활용 공장구매 컨설팅**\n\n💎 **25년 경매 전문 노하우**\n• 부동산비용 30-50% 절감\n• 평균 40% 저가 매입 성공\n• 95% 안전 낙찰률 보장\n\n🎯 **실제 성과:**\n• 15억 공장을 9억에 낙찰 (40% 절약)\n• 연간 임대료 3억 → 자가 소유 전환\n\n📞 **상담: 010-9251-9743**\n⚡ [상세 정보](/services/factory-auction)`;
    }
    
    return responses.general;
  };

  // 빠른 액션 처리
  const handleQuickAction = (action: string) => {
    if (action.startsWith('/')) {
      window.location.href = action;
    } else if (action.startsWith('/#')) {
      if (window.location.pathname === '/') {
        document.querySelector(action.substring(1))?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = action;
      }
    }
    setIsOpen(false);
  };

  // 🎯 **드래그 중 클릭 방지**
  const handleToggle = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsOpen(true);
  };

  // 🔥 **확실한 닫기 기능**
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔴 채팅창 닫기');
    setIsOpen(false);
  };

  // 🔥 **최소화/확대 기능**
  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* 🔵 **원형 플로팅 챗봇 버튼 (모바일 최적화)** */}
      {!isOpen && (
        <div 
          className={`fixed z-50 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            transition: isDragging ? 'none' : 'all 0.2s ease'
          }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          onClick={handleToggle}
        >
          {/* 🔵 **원형 버튼 (모바일 최적화)** */}
          <div className={`relative ${isMobile ? 'w-14 h-14' : 'w-16 h-16'} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group ${isDragging ? 'scale-110 shadow-2xl ring-4 ring-blue-300/50' : 'hover:scale-110'}`}>
            
            {/* 메인 AI 아이콘 */}
            <Bot className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} text-white`} />
            
            {/* 온라인 상태 표시 */}
            <div className={`absolute -top-1 -right-1 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'} bg-green-400 rounded-full border-2 border-white animate-pulse shadow-sm`}></div>
            
            {/* 🔥 **드래그 힌트 도트들 (모바일 최적화)** */}
            {isDragging && (
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/60 animate-spin-slow">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
              </div>
            )}
            
            {/* 드래그 중 수직 인디케이터 (모바일 최적화) */}
            {isDragging && !isMobile && (
              <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-blue-600/95 text-white text-xs px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-3 h-3 animate-pulse" />
                  <div className="flex flex-col space-y-0.5">
                    <div className="w-0 h-0 border-l-1.5 border-r-1.5 border-b-2 border-transparent border-b-white"></div>
                    <div className="w-0 h-0 border-l-1.5 border-r-1.5 border-t-2 border-transparent border-t-white"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 호버 툴팁 (데스크톱만) */}
            {!isDragging && !isMobile && (
              <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900/95 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <Bot className="w-3 h-3" />
                  <span className="font-medium">AI상담사</span>
                </div>
                <div className="text-xs text-gray-300 mt-1 flex items-center space-x-1">
                  <GripVertical className="w-2 h-2" />
                  <span>드래그로 이동</span>
                </div>
                {/* 툴팁 화살표 */}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95"></div>
              </div>
            )}
            
            {/* 펄스 효과 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 animate-ping"></div>
          </div>
        </div>
      )}

      {/* 🎯 **오른쪽 고정 채팅창 (모바일 최적화)** */}
      {isOpen && (
        <div 
          className="fixed z-50"
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            width: isMobile ? `${Math.min(window.innerWidth - 20, 380)}px` : '400px',
            height: isMinimized ? '60px' : (isMobile ? '480px' : '520px'),
            transition: isDragging ? 'none' : 'all 0.2s ease'
          }}
        >
          <Card className={`h-full shadow-2xl border-2 bg-white rounded-lg overflow-hidden ${isDragging ? 'border-blue-500 shadow-2xl' : 'border-gray-300'}`}>
            {/* 🟦 **확장된 채팅창 드래그 헤더 (모바일 최적화)** */}
            <CardHeader 
              className={`${isMobile ? 'p-2' : 'p-3'} bg-gradient-to-r from-blue-500 to-purple-600 text-white select-none relative transition-all duration-200 ${isDragging ? 'cursor-grabbing bg-blue-600 shadow-2xl' : 'cursor-move hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700'}`}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              title={isMobile ? "헤더 터치로 이동" : "헤더를 드래그해서 위아래로 이동하세요"}
            >
              {/* 🔥 **최상위 닫기 버튼 (모바일 최적화)** */}
              <div
                className="absolute -top-2 -right-2 z-[60] cursor-pointer"
                onClick={handleClose}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} bg-red-500 hover:bg-red-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-all duration-200 hover:scale-110`}>
                  <X className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-white font-bold`} />
                </div>
              </div>

              {/* 🎯 **드래그 핸들 바 (상단)** */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                <div className="flex space-x-1">
                  <div className={`${isMobile ? 'w-6 h-1' : 'w-8 h-1'} bg-white/40 rounded-full`}></div>
                  <div className={`${isMobile ? 'w-6 h-1' : 'w-8 h-1'} bg-white/40 rounded-full`}></div>
                  <div className={`${isMobile ? 'w-6 h-1' : 'w-8 h-1'} bg-white/40 rounded-full`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bot className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  <span className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>기업의별 AI상담사</span>
                  
                  {/* 🎯 **강화된 드래그 가이드 (데스크톱만)** */}
                  {!isMobile && (
                    <div className={`flex items-center space-x-2 text-xs px-3 py-1 rounded-full transition-all duration-200 ${isDragging ? 'bg-white/30 scale-105' : 'bg-white/10 hover:bg-white/20'}`}>
                      <GripVertical className={`w-3 h-3 ${isDragging ? 'animate-pulse' : ''}`} />
                      <span className="font-medium">드래그 이동</span>
                      <div className="flex flex-col space-y-0.5">
                        <div className="w-0 h-0 border-l-1.5 border-r-1.5 border-b-2 border-transparent border-b-white/80"></div>
                        <div className="w-0 h-0 border-l-1.5 border-r-1.5 border-t-2 border-transparent border-t-white/80"></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 🔥 **강화된 컨트롤 버튼들 (모바일 최적화)** */}
                <div className="flex items-center space-x-1 z-[55]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMinimize}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className={`text-white hover:bg-white/20 ${isMobile ? 'p-1 h-6 w-6' : 'p-1 h-7 w-7'} transition-all duration-200`}
                    title={isMinimized ? "확대" : "최소화"}
                  >
                    {isMinimized ? <Maximize2 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} /> : <Minimize2 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />}
                  </Button>
                  
                  {/* 🔥 **헤더 내부 닫기 버튼** */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className={`text-white hover:bg-red-500 bg-red-400/30 border border-white/30 ${isMobile ? 'p-1 h-6 w-6' : 'p-1 h-8 w-8'} transition-all duration-200 hover:scale-105`}
                    title="채팅창 닫기"
                  >
                    <X className={`${isMobile ? 'w-3 h-3' : 'w-5 h-5'} font-bold`} />
                  </Button>
                </div>
              </div>
              
              {/* 🚀 **드래그 중 강화된 상태 표시 (데스크톱만)** */}
              {isDragging && !isMobile && (
                <>
                  {/* 상단 드래그 인디케이터 */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium bg-white/20 px-2 py-1 rounded-full animate-pulse">
                    ↑↓ 위치 조정 중...
                  </div>
                  
                  {/* 좌측 방향 힌트 */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-14 bg-blue-600/95 text-white text-xs px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col space-y-1">
                        <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-white animate-bounce"></div>
                        <div className="w-0 h-0 border-l-2 border-r-2 border-t-3 border-transparent border-t-white animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                      <span className="font-medium whitespace-nowrap">드래그 중</span>
                    </div>
                  </div>
                </>
              )}
            </CardHeader>

            {/* 메시지 영역 (모바일 최적화) */}
            {!isMinimized && (
              <CardContent className="p-0 flex flex-col h-full pt-6">
                {/* 메시지 리스트 */}
                <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-2' : 'p-3'} space-y-3 ${isMobile ? 'max-h-72' : 'max-h-80'}`}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] ${isMobile ? 'p-2' : 'p-3'} rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* 타이핑 인디케이터 */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className={`bg-gray-100 ${isMobile ? 'p-2' : 'p-3'} rounded-lg`}>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 빠른 액션 버튼 (모바일 최적화) */}
                <div className={`${isMobile ? 'p-2' : 'p-3'} border-t bg-gray-50`}>
                  <div className={`grid grid-cols-3 gap-2 ${isMobile ? 'mb-2' : 'mb-3'}`}>
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={`${isMobile ? 'text-xs p-1 h-7' : 'text-xs p-2 h-8'}`}
                        onClick={() => handleQuickAction(action.action)}
                      >
                        <action.icon className={`${isMobile ? 'w-2 h-2 mr-1' : 'w-3 h-3 mr-1'}`} />
                        {action.text}
                      </Button>
                    ))}
                  </div>
                  
                  {/* 입력 영역 (모바일 최적화) */}
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="메시지를 입력하세요..."
                      className={`flex-1 ${isMobile ? 'text-sm h-9' : 'text-sm'}`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(inputValue);
                        }
                      }}
                      disabled={isTyping}
                    />
                    <Button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      className={`${isMobile ? 'px-3 h-9' : 'px-4'} bg-blue-500 hover:bg-blue-600 text-white`}
                    >
                      <Send className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  );
} 