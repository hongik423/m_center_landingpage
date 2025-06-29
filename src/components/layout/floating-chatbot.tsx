'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, MessageCircle, X, Bot, User } from 'lucide-react';
import { getImagePath } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 🔥 단순화된 드래그 시스템
  const [position, setPosition] = useState({ x: 20, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 20, y: 120 });
  
  // SSR 안전한 화면 크기 상태 관리
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 });
  const [isMobile, setIsMobile] = useState(false);

  // 환영 메시지 추가
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `안녕하세요! 기업의별 M-CENTER M센터장 이후경입니다!

28년간 500개 이상 기업의 성장을 함께해온 경험을 바탕으로 상담해드리겠습니다.

저희 M-CENTER에서 전문적으로 상담해드리는 분야들이에요.

BM ZEN 사업분석으로는 생산성을 42% 향상시키고 ROI를 290% 달성한 케이스들이 많아요. AI 생산성향상은 20-99인 기업이라면 정부에서 100% 지원해주니까 완전 무료로 받으실 수 있어요.

경매 활용해서 공장구매하는 건 25년 노하우로 30-50% 절감해드리고, 기술사업화나 창업 지원으로는 평균 5억원 정도 정부지원을 확보해드리고 있어요.

인증지원 쪽은 ISO, 벤처, 연구소 등을 통해 연간 5천만원 세제혜택을 받을 수 있게 도와드리고, 웹사이트 구축으로는 온라인 매출을 300-500% 증대시켜드려요.

세금계산기도 11종류나 준비해서 2024년 최신 세법을 완벽하게 반영했어요.

궁금한 것 있으시면 자유롭게 물어보세요! 직접 상담받으시려면 010-9251-9743으로 전화주셔도 돼요.

예를 들어 "BM ZEN 사업분석은 어떻게 진행되나요?", "일터혁신 상생컨설팅이 정말 무료인가요?", "경매로 공장을 안전하게 구매하는 방법은?" 이런 질문들 언제든 환영해요.`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ESC 키로 챗봇 창 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        // 모바일 진동 피드백
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 🔥 개선된 드래그 이벤트 핸들러들
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 모바일 진동 피드백
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({ x: position.x, y: position.y });
  }, [position.x, position.y]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    
    // 모바일 진동 피드백
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setInitialPosition({ x: position.x, y: position.y });
  }, [position.x, position.y]);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    let clientX, clientY;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    
    // 드래그 거리 계산
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    // 새 위치 계산 (right 기준이므로 X는 반대로)
    const newX = initialPosition.x - deltaX;
    const newY = initialPosition.y - deltaY;
    
    // 화면 경계 제한
    const buttonSize = isMobile ? 60 : 70;
    const minX = 10;
    const maxX = screenSize.width - buttonSize - 10;
    const minY = 10;
    const maxY = screenSize.height - buttonSize - 10;
    
    // 경계 내에서만 이동
    const finalX = Math.max(minX, Math.min(maxX, newX));
    const finalY = Math.max(minY, Math.min(maxY, newY));
    
    // 오류신고 버튼과의 충돌 방지 (우하단 100x100 영역)
    const errorButtonArea = {
      left: screenSize.width - 110,
      right: screenSize.width - 10,
      top: screenSize.height - 110,
      bottom: screenSize.height - 10
    };
    
    const chatbotArea = {
      left: screenSize.width - finalX - buttonSize,
      right: screenSize.width - finalX,
      top: screenSize.height - finalY - buttonSize,
      bottom: screenSize.height - finalY
    };
    
    // 충돌 감지 및 회피
    const isColliding = (
      chatbotArea.left < errorButtonArea.right &&
      chatbotArea.right > errorButtonArea.left &&
      chatbotArea.top < errorButtonArea.bottom &&
      chatbotArea.bottom > errorButtonArea.top
    );
    
    let adjustedX = finalX;
    let adjustedY = finalY;
    
    if (isColliding) {
      // 충돌 시 위쪽 또는 왼쪽으로 이동
      if (finalY > screenSize.height / 2) {
        adjustedY = Math.min(finalY, screenSize.height - 160);
      } else {
        adjustedX = Math.max(finalX, 120);
      }
    }
    
    setPosition({ x: adjustedX, y: adjustedY });
  }, [isDragging, dragStart, initialPosition, isMobile, screenSize]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // 모바일 진동 피드백
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    // 경계 재조정
    const buttonSize = isMobile ? 60 : 70;
    const minX = 10;
    const maxX = screenSize.width - buttonSize - 10;
    const minY = 10;
    const maxY = screenSize.height - buttonSize - 10;
    
    setPosition(prev => ({
      x: Math.max(minX, Math.min(maxX, prev.x)),
      y: Math.max(minY, Math.min(maxY, prev.y))
    }));
  }, [isDragging, isMobile, screenSize]);

  // 🔥 전역 마우스 및 터치 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      document.body.style.touchAction = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      document.body.style.touchAction = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 화면 크기 감지 (SSR 안전)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateScreenSize = () => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
        setIsMobile(window.innerWidth < 768);
      };

      // 초기 설정
      updateScreenSize();

      // 리사이즈 이벤트 리스너
      window.addEventListener('resize', updateScreenSize);
      return () => window.removeEventListener('resize', updateScreenSize);
    }
  }, []);

  // AI 메시지 전송
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      console.log('🚀 AI API 호출 시작:', { message: message.trim() });
      
      const response = await fetch('/api/chat-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim()
        }),
      });

      console.log('📡 API 응답 상태:', { status: response.status, ok: response.ok });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API 응답 성공:', { responseLength: data.response?.length || 0 });
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || '죄송합니다. 응답을 생성하는데 문제가 발생했습니다.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(`API 응답 실패: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ AI 응답 오류:', error);
      const fallbackResponse = generateFallbackResponse(message.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // 폴백 응답 생성
  const generateFallbackResponse = (message: string): string => {
    return `안녕하세요! 이후경입니다.

28년간 500개 이상 기업과 함께 일해온 경험을 바탕으로 답변드리겠습니다.

지금 AI 시스템에 일시적인 문제가 있지만, 괜찮아요. 제가 현장에서 직접 쌓은 노하우로 도와드릴 수 있거든요.

저희 M-CENTER에서 검증된 솔루션들이 있어요. BM ZEN 사업분석으로는 생산성을 42% 향상시키고 ROI를 290% 달성한 케이스들이 많아요. 

AI 생산성향상 쪽은 요즘 정말 인기가 많아요. 20-99인 기업은 정부에서 100% 지원해주거든요. 기업 입장에서는 완전 무료로 받을 수 있어요.

25년 넘게 해온 경매 활용 공장구매는 투자비를 30-50% 절감할 수 있어서 많은 분들이 찾아오시죠.

기술사업화나 창업 지원도 평균 5억원 정도 정부지원을 확보해드리고 있어요.

더 구체적인 상담이 필요하시면 010-9251-9743으로 직접 전화주세요. 또는 저희 홈페이지에서 무료 진단을 받아보시는 것도 좋을 것 같아요.

28년 현장 경험으로 확실한 성과를 만들어드릴 자신 있어요!`;
  };

  return (
    <>
      {/* 🔥 드래그 가능한 플로팅 챗봇 버튼 */}
      <div
        id="floating-chatbot-button"
        className={`${isOpen ? 'hidden' : 'block'} ${isDragging ? 'scale-110' : ''} touch-target mobile-optimized`}
        style={{
          position: 'fixed',
          bottom: `${position.y}px`,
          right: `${position.x}px`,
          width: isMobile ? '64px' : '70px',
          height: isMobile ? '64px' : '70px',
          backgroundColor: isDragging ? '#7B1FA2' : '#1976D2',
          borderRadius: '50%',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 999999,
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isDragging 
            ? '0 8px 32px rgba(123, 31, 162, 0.6), 0 0 0 4px rgba(123, 31, 162, 0.2)' 
            : '0 4px 20px rgba(25, 118, 210, 0.4)',
          border: '3px solid white',
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          userSelect: 'none',
          transform: isDragging ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
          filter: isDragging ? 'brightness(1.1)' : 'brightness(1)',
          minWidth: '44px',
          minHeight: '44px',
          touchAction: 'manipulation',
        }}
        onClick={(e) => {
          if (!isDragging) {
            setIsOpen(true);
            // 모바일 진동 피드백
            if (navigator.vibrate) {
              navigator.vibrate(100);
            }
          }
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={(e) => {
          if (!isDragging && !isMobile) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#7B1FA2';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging && !isMobile) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#1976D2';
          }
        }}
        data-floating-chatbot="true"
      >
        {/* M센터장 사진 */}
        <img
          src={getImagePath('/images/M-Center-leader.png')}
          alt="M센터장 이후경 경영지도사"
          style={{
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            borderRadius: '50%',
            objectFit: 'cover',
            pointerEvents: 'none',
            transition: 'all 0.3s ease',
            filter: isDragging ? 'brightness(1.2)' : 'brightness(1)'
          }}
        />
        
        {/* 드래그 인디케이터 */}
        {isDragging && (
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: '2px dashed rgba(255, 255, 255, 0.8)',
              animation: 'spin 2s linear infinite',
              pointerEvents: 'none'
            }}
          />
        )}
        
        {/* 펄스 애니메이션 */}
        {!isDragging && (
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(25, 118, 210, 0.3) 0%, transparent 70%)',
              animation: 'pulse 3s infinite',
              pointerEvents: 'none'
            }}
          />
        )}
        
        {/* 모바일 터치 가이드 */}
        {isDragging && isMobile && (
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 1000000
            }}
          >
            🔄 드래그 중...
          </div>
        )}
        
        {/* 데스크탑 툴팁 */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '0',
              backgroundColor: '#333',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none'
            }}
            className="tooltip"
          >
            {isDragging ? '🔄 드래그 중...' : '🔄 드래그로 이동'}
          </div>
        )}
      </div>

      {/* 채팅창 */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? '10px' : `${Math.min(position.y, screenSize.height - 520)}px`,
            right: isMobile ? '10px' : `${Math.min(position.x, screenSize.width - 400)}px`,
            left: isMobile ? '10px' : 'auto',
            width: isMobile ? 'calc(100vw - 20px)' : '380px',
            height: isMobile ? 'calc(100vh - 100px)' : '500px',
            maxHeight: isMobile ? '600px' : '500px',
            backgroundColor: 'white',
            borderRadius: isMobile ? '16px' : '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 999998,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* 헤더 - 시인성 개선 */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1976D2 0%, #7B1FA2 100%)',
              color: 'white',
              padding: isMobile ? '20px 16px' : '16px',
              borderRadius: isMobile ? '16px 16px 0 0' : '12px 12px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: isMobile ? '70px' : '60px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={getImagePath('/star-counselor-icon.svg')}
                alt="M센터장"
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  M센터장
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  GEMINI AI • 온라인
                </div>
              </div>
            </div>
            
            {/* 개선된 X 버튼 - 모바일 친화적 */}
            <button
              onClick={() => {
                setIsOpen(false);
                // 모바일 진동 피드백
                if (navigator.vibrate) {
                  navigator.vibrate(50);
                }
              }}
              style={{
                width: isMobile ? '36px' : '32px',
                height: isMobile ? '36px' : '32px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: isMobile ? '20px' : '18px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              title="채팅창 닫기"
            >
              ✕
            </button>
          </div>

          {/* 메시지 영역 - 시인성 개선 */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#ffffff',
              backgroundImage: 'linear-gradient(to bottom, #f8f9ff 0%, #ffffff 100%)'
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    backgroundColor: message.sender === 'user' 
                      ? 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)' 
                      : '#ffffff',
                    background: message.sender === 'user' 
                      ? 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)' 
                      : '#ffffff',
                    color: message.sender === 'user' ? '#ffffff' : '#1a1a1a',
                    fontSize: '14px',
                    fontWeight: message.sender === 'user' ? '500' : '400',
                    lineHeight: '1.5',
                    boxShadow: message.sender === 'user' 
                      ? '0 4px 12px rgba(25, 118, 210, 0.3)' 
                      : '0 2px 12px rgba(0, 0, 0, 0.08)',
                    border: message.sender === 'bot' ? '2px solid #f0f0f0' : 'none'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {message.content}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      marginTop: '8px',
                      opacity: message.sender === 'user' ? 0.8 : 0.6,
                      fontWeight: '400'
                    }}
                  >
                    {message.timestamp.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    border: '2px solid #f0f0f0'
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '10px', 
                      height: '10px', 
                      backgroundColor: '#1976D2', 
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite'
                    }}></div>
                    <div style={{ 
                      width: '10px', 
                      height: '10px', 
                      backgroundColor: '#1976D2', 
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite 0.2s'
                    }}></div>
                    <div style={{ 
                      width: '10px', 
                      height: '10px', 
                      backgroundColor: '#1976D2', 
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite 0.4s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 - 시인성 개선 */}
          <div
            style={{
              padding: isMobile ? '20px 16px' : '16px',
              borderTop: '2px solid #f0f0f0',
              backgroundColor: '#fafafa',
              borderRadius: isMobile ? '0 0 16px 16px' : '0 0 12px 12px',
              minHeight: isMobile ? '80px' : '60px'
            }}
          >
            <div style={{ display: 'flex', gap: isMobile ? '12px' : '8px' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isMobile ? "메시지 입력..." : "메시지를 입력하세요..."}
                style={{
                  flex: 1,
                  padding: isMobile ? '16px 20px' : '14px 18px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '25px',
                  fontSize: isMobile ? '16px' : '14px',
                  outline: 'none',
                  minHeight: isMobile ? '48px' : '44px',
                  backgroundColor: '#ffffff',
                  color: '#1a1a1a',
                  fontWeight: '400',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputValue.trim()) {
                      handleSendMessage(inputValue);
                    }
                  }
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976D2';
                  e.target.style.boxShadow = '0 2px 12px rgba(25, 118, 210, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8e8e8';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
                disabled={isTyping}
              />
              <button
                onClick={() => {
                  if (inputValue.trim()) {
                    handleSendMessage(inputValue);
                  }
                }}
                disabled={!inputValue.trim() || isTyping}
                style={{
                  width: isMobile ? '52px' : '48px',
                  height: isMobile ? '52px' : '48px',
                  backgroundColor: inputValue.trim() && !isTyping ? '#1976D2' : '#d0d0d0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '20px' : '18px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  boxShadow: inputValue.trim() && !isTyping 
                    ? '0 4px 12px rgba(25, 118, 210, 0.3)' 
                    : '0 2px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (inputValue.trim() && !isTyping) {
                    e.currentTarget.style.backgroundColor = '#1565C0';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (inputValue.trim() && !isTyping) {
                    e.currentTarget.style.backgroundColor = '#1976D2';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                title="메시지 전송"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS 애니메이션 */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        
        #floating-chatbot-button:hover .tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
} 