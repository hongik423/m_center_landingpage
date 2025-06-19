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
import { 
  safeGet, 
  validateApiResponse, 
  checkApiCompatibility,
  collectErrorInfo,
  getBrowserInfo 
} from '@/lib/utils/safeDataAccess';

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
const getWelcomeMessage = (): Message => {
  // 개발 환경 디버깅 정보
  const isLocalhost = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('192.168'));
  
  const debugInfo = isLocalhost ? `\n\n🔧 **디버그 모드:** localhost:${window.location.port}` : '';
  
  return {
    id: '1',
    content: `👋 **기업의별 AI상담사**입니다!

💡 **빠른 도움받기:**
• 실시간 상담 가능
• 정부지원사업 안내  
• 무료 기업진단

궁금한 점을 메시지로 보내거나 아래 버튼을 눌러보세요! ⚡${debugInfo}`,
    sender: 'bot',
    timestamp: new Date()
  };
};

export default function FloatingChatbot() {
  // 기본 상태
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // 🔵 **향상된 드래그 상태 관리**
  const [position, setPosition] = useState<Position>({ x: 0, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [dragStartTime, setDragStartTime] = useState(0);
  const [lastTouchY, setLastTouchY] = useState(0);
  const [dragVelocity, setDragVelocity] = useState(0);
  const [isSnapAnimating, setIsSnapAnimating] = useState(false);
  
  // 🚀 **드래그 로그 최적화를 위한 throttle**
  const [lastLogTime, setLastLogTime] = useState(0);
  const LOG_THROTTLE_MS = 500; // 0.5초마다 한번만 로그

  // 🔵 **모바일 감지 및 드래그 설정**
  const [isMobile, setIsMobile] = useState(false);
  const [dragSensitivity, setDragSensitivity] = useState(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 **향상된 모바일 감지 및 드래그 설정**
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
                           /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      
      // 모바일에서 더 민감한 드래그 설정
      setDragSensitivity(isMobileDevice ? 1.2 : 1.0);
      
      if (isMobileDevice) {
        console.log('📱 모바일 최적화 드래그 모드 활성화');
      }
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

  // 🔥 **향상된 수직 드래그 시작 (모바일 최적화)**
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 스냅 애니메이션 중단
    setIsSnapAnimating(false);
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // 모바일에서 지연 시간 후 드래그 시작 (실수 터치 방지)
    if (isMobile) {
      dragTimeoutRef.current = setTimeout(() => {
        setIsDragging(true);
        
        // 햅틱 피드백 시뮬레이션 (진동)
        if ('vibrate' in navigator) {
          navigator.vibrate(20);
        }
        
        console.log('📱 모바일 터치 드래그 시작:', { 
          y: position.y, 
          sensitivity: dragSensitivity,
          touchPoint: clientY 
        });
      }, 100); // 100ms 지연
    } else {
      setIsDragging(true);
      console.log('🖱️ 데스크톱 마우스 드래그 시작:', { y: position.y });
    }
    
    setDragStartTime(Date.now());
    setLastTouchY(clientY);
    setDragVelocity(0);
    
    setDragStart({
      x: clientX,
      y: clientY - position.y
    });
  };

  // 🔥 **향상된 수직 드래그 이벤트 처리 (모바일 최적화)**
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const rawY = (clientY - dragStart.y) * dragSensitivity;
      
      // 속도 계산 (모바일 던지기 효과용)
      const currentTime = Date.now();
      const timeDelta = currentTime - dragStartTime;
      if (timeDelta > 0) {
        const yDelta = clientY - lastTouchY;
        setDragVelocity(yDelta / timeDelta * 1000); // px/second
        setLastTouchY(clientY);
      }
      
      // Y축 경계 체크 (모바일 최적화)
      const mobileOffset = isMobile ? 8 : 20;
      const buttonHeight = isMobile ? 60 : 64;
      const chatHeight = isOpen ? (isMinimized ? 80 : (isMobile ? 480 : 520)) : buttonHeight;
      const maxY = window.innerHeight - chatHeight - mobileOffset;
      const minY = mobileOffset;
      
      // 경계에서 저항 효과 (모바일 스크롤 느낌)
      let boundedY = rawY;
      if (rawY < minY) {
        const resistance = isMobile ? 0.3 : 0.1;
        boundedY = minY + (rawY - minY) * resistance;
      } else if (rawY > maxY) {
        const resistance = isMobile ? 0.3 : 0.1;
        boundedY = maxY + (rawY - maxY) * resistance;
      }
      
      // X축은 항상 오른쪽 끝에 고정 (모바일 최적화)
      const chatWidth = isMobile ? Math.min(window.innerWidth - 20, 380) : 420;
      const buttonSize = isMobile ? 60 : 64;
      const sideOffset = isMobile ? 8 : 20;
      const fixedX = window.innerWidth - (isOpen ? chatWidth + 10 : buttonSize + sideOffset);
      
      setPosition({
        x: fixedX,
        y: boundedY
      });
      
      // 🚀 **로그 throttling으로 스팸 방지**
      const now = Date.now();
      if (now - lastLogTime > LOG_THROTTLE_MS) {
        console.log('🚀 수직 드래그 중:', { 
          y: boundedY, 
          velocity: dragVelocity.toFixed(1), 
          isMobile, 
          throttled: true 
        });
        setLastLogTime(now);
      }
    };

    // 스냅 기능이 포함된 드래그 종료 처리
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        
        // 모바일에서 스냅 기능
        if (isMobile) {
          performSmartSnap();
        }
        
        // 드래그 종료 햅틱 피드백
        if (isMobile && 'vibrate' in navigator) {
          navigator.vibrate(10);
        }
        
        console.log('✅ 드래그 종료:', { 
          y: position.y, 
          velocity: dragVelocity.toFixed(1),
          isMobile 
        });
      }
      
      // 타임아웃 정리
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
        dragTimeoutRef.current = null;
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
      }, [isDragging, dragStart, isOpen, isMinimized, lastLogTime, position.y, isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // 🧹 **컴포넌트 언마운트 시 정리 작업**
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  // 🚀 **강화된 메시지 전송 함수 - AI API 안정성 개선**
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

    console.log('🤖 AI 메시지 전송 시작:', { 
      message: text.substring(0, 50) + '...', 
      messageLength: text.length,
      timestamp: new Date().toISOString()
    });

    try {
      // 🔧 **API 호출 안전성 체크 (GitHub Pages 호환)**
      const apiCompatibility = checkApiCompatibility('/api/chat');
      const browserInfo = getBrowserInfo();
      
      if (!apiCompatibility.canCall) {
        console.warn('⚠️ API 호출 불가:', apiCompatibility.recommendation);
        throw new Error(apiCompatibility.fallbackAction);
      }
      
      // 🎯 **우선 API 상태 확인**
      console.log('🔍 API 상태 확인 중...');
      
      try {
        const statusResponse = await fetch('/api/chat', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('✅ API 상태 확인 완료:', {
            configured: statusData.configured,
            environment: statusData.environment,
            supportedMethods: statusData.supportedMethods
          });
          
          if (!statusData.configured) {
            throw new Error('OpenAI API 키가 설정되지 않았습니다');
          }
        } else {
          console.warn('⚠️ API 상태 확인 실패:', statusResponse.status);
        }
      } catch (statusError) {
        console.warn('⚠️ API 상태 확인 중 오류:', statusError);
        // 상태 확인 실패 시에도 계속 시도
      }
      
      // 🚀 **OpenAI API 호출 (안정성 개선)**
      console.log('🚀 OpenAI API 호출 중...', { 
        isGitHubPages: browserInfo.isGitHubPages,
        userAgent: browserInfo.userAgent.substring(0, 50) + '...',
        messageLength: text.length
      });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 타임아웃 20초로 증가
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5)
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      console.log('📡 API 응답 상태:', { 
        status: response.status, 
        ok: response.ok,
        headers: response.headers.get('content-type')
      });

      if (response.ok) {
        let rawData;
        
        try {
          const responseText = await response.text();
          if (!responseText.trim()) {
            throw new Error('API에서 빈 응답을 받았습니다');
          }
          
          rawData = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('⚠️ JSON 파싱 오류:', jsonError);
          throw new Error('API 응답 형식이 잘못되었습니다');
        }
        
        // 🔧 **안전한 데이터 검증 및 접근**
        const validationResult = validateApiResponse(rawData);
        
        if (!validationResult.isValid) {
          console.error('⚠️ API 응답 검증 실패:', validationResult.error);
          throw new Error(validationResult.error || 'API 응답이 유효하지 않습니다');
        }
        
        const data = validationResult.data;
        const responseContent = safeGet<string>(data, 'response', '');
        
        if (responseContent && typeof responseContent === 'string' && responseContent.trim()) {
          console.log('✅ OpenAI API 응답 성공:', { 
            responseLength: responseContent.length,
            hasUsage: !!safeGet(data, 'usage'),
            services: safeGet(data, 'services', []),
            validationPassed: true
          });
          
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: responseContent,
            sender: 'bot',
            timestamp: new Date()
          };
          
          addMessage(botMessage);
          return;
                  } else {
            console.error('⚠️ 응답 내용이 유효하지 않음:', { 
              hasResponse: !!responseContent,
              responseType: typeof responseContent,
              responseLength: (responseContent as string)?.length || 0
            });
          throw new Error('API에서 유효한 응답 내용을 받지 못했습니다');
        }
      } else {
        let errorData = null;
        try {
          const errorText = await response.text();
          if (errorText.trim()) {
            errorData = JSON.parse(errorText);
          }
        } catch (parseError) {
          console.warn('⚠️ 오류 응답 파싱 실패:', parseError);
        }
        
        const errorMessage = safeGet(errorData, 'error', `HTTP ${response.status}: ${response.statusText}`);
        throw new Error(errorMessage);
      }
      
    } catch (error) {
      // 🔧 **강화된 오류 정보 수집 (GitHub Pages 호환)**
      const errorInfo = collectErrorInfo(error, {
        messageLength: text.length,
        messageType: 'chat',
        apiUrl: '/api/chat',
        timestamp: new Date().toISOString()
      });
      
      console.warn('⚠️ OpenAI API 오류, 클라이언트 응답 사용:', errorInfo);
      
      console.log('🤖 클라이언트 응답 생성 중...');
      
      let clientResponse = generateClientResponse(text);
      
      const browserInfo = getBrowserInfo();
      
      // 개발 환경 또는 localhost에서 디버그 정보 추가
      if (browserInfo.isBrowser && (
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('192.168') ||
        process.env.NODE_ENV === 'development'
      )) {
        const errorType = error instanceof Error && error.name === 'AbortError' ? 'API 타임아웃' : 'API 연결 오류';
        clientResponse += `\n\n🔧 **개발자 정보:** ${errorType} 발생`;
        
        if (browserInfo.isGitHubPages) {
          clientResponse += ` (GitHub Pages 환경)`;
        }
        
        clientResponse += `, 클라이언트 응답으로 대체됨`;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: clientResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      addMessage(botMessage);
      
    } finally {
      setIsTyping(false);
      console.log('🏁 메시지 전송 완료:', { timestamp: new Date().toISOString() });
    }
  }, [messages, addMessage]);

  // 🎯 **스마트 스냅 기능 (모바일 최적화)**
  const performSmartSnap = useCallback(() => {
    if (!isMobile) return;
    
    setIsSnapAnimating(true);
    const screenHeight = window.innerHeight;
    const currentY = position.y;
    const chatHeight = isOpen ? (isMinimized ? 80 : 480) : 60;
    const mobileOffset = 8;
    
    // 스냅 영역 정의
    const topZone = screenHeight * 0.15; // 상위 15%
    const bottomZone = screenHeight * 0.85; // 하위 15%
    const centerY = (screenHeight - chatHeight) / 2;
    
    let targetY = currentY;
    let snapType = 'none';
    
    // 속도 기반 스냅 (던지기 효과)
    if (Math.abs(dragVelocity) > 500) {
      if (dragVelocity < 0) {
        // 위로 던짐
        targetY = mobileOffset;
        snapType = 'top-velocity';
      } else {
        // 아래로 던짐
        targetY = screenHeight - chatHeight - mobileOffset;
        snapType = 'bottom-velocity';
      }
    } else {
      // 위치 기반 스냅
      if (currentY < topZone) {
        targetY = mobileOffset;
        snapType = 'top-position';
      } else if (currentY > bottomZone) {
        targetY = screenHeight - chatHeight - mobileOffset;
        snapType = 'bottom-position';
      } else {
        targetY = centerY;
        snapType = 'center';
      }
    }
    
    console.log('🎯 스마트 스냅 실행:', {
      from: currentY.toFixed(1),
      to: targetY.toFixed(1),
      velocity: dragVelocity.toFixed(1),
      type: snapType
    });
    
    // 스냅 애니메이션
    const startY = currentY;
    const distance = targetY - startY;
    const duration = Math.min(Math.max(Math.abs(distance) * 2, 200), 600); // 200ms ~ 600ms
    const startTime = Date.now();
    
    const animateSnap = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutCubic 이징 함수
      const eased = 1 - Math.pow(1 - progress, 3);
      const newY = startY + distance * eased;
      
      // X축 업데이트
      const chatWidth = Math.min(window.innerWidth - 20, 380);
      const buttonSize = 60;
      const sideOffset = 8;
      const fixedX = window.innerWidth - (isOpen ? chatWidth + 10 : buttonSize + sideOffset);
      
      setPosition({ x: fixedX, y: newY });
      
      if (progress < 1) {
        requestAnimationFrame(animateSnap);
      } else {
        setIsSnapAnimating(false);
        
        // 스냅 완료 햅틱 피드백
        if ('vibrate' in navigator) {
          navigator.vibrate(15);
        }
        
        console.log('✅ 스냅 완료:', { finalY: targetY.toFixed(1), type: snapType });
      }
    };
    
    requestAnimationFrame(animateSnap);
  }, [position.y, dragVelocity, isMobile, isOpen, isMinimized]);

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

  // 🎯 **드래그 및 애니메이션 중 클릭 방지**
  const handleToggle = (e: React.MouseEvent) => {
    if (isDragging || isSnapAnimating) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsOpen(true);
  };

  // 🔥 **확실한 닫기 기능 (애니메이션 강화)**
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔴 채팅창 닫기 → 원형 버튼으로 돌아가기');
    
    // 📱 모바일에서 햅틱 피드백
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]); // 3번 짧은 진동
    }
    
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
          <div className={`relative ${isMobile ? 'w-14 h-14' : 'w-16 h-16'} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group ${isDragging ? 'scale-110 shadow-2xl ring-4 ring-blue-300/50' : isSnapAnimating ? 'scale-105 shadow-xl ring-2 ring-green-400/50' : 'hover:scale-110'}`}>
            
            {/* 메인 AI 아이콘 */}
            <Bot className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} text-white`} />
            
            {/* 온라인 상태 표시 */}
            <div className={`absolute -top-1 -right-1 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'} bg-green-400 rounded-full border-2 border-white animate-pulse shadow-sm`}></div>
            
            {/* 🔥 **모바일 최적화 드래그 힌트** */}
            {isDragging && (
              <>
                {isMobile ? (
                  // 모바일 전용 드래그 힌트
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/80 animate-pulse">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    
                    {/* 수직 이동 인디케이터 */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="flex flex-col items-center space-y-0.5">
                        <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-white animate-ping"></div>
                        <div className="text-white text-xs font-bold">↕</div>
                        <div className="w-0 h-0 border-l-2 border-r-2 border-t-3 border-transparent border-t-white animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 데스크톱 드래그 힌트
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/60 animate-spin-slow">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  </div>
                )}
              </>
            )}
            
            {/* 🎯 **스냅 애니메이션 중 표시 (모바일 전용)** */}
            {isSnapAnimating && isMobile && (
              <div className="absolute inset-0 rounded-full border-2 border-solid border-green-400/80 animate-ping">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-400 text-lg animate-pulse">
                  🎯
                </div>
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
            
            {/* 🎯 **강화된 호버 툴팁 (데스크톱만)** */}
            {!isDragging && !isMobile && (
              <div className="absolute bottom-full right-0 mb-3 px-4 py-3 bg-gradient-to-r from-blue-600/95 to-purple-600/95 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl backdrop-blur-sm border border-white/20">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 animate-pulse" />
                  <span className="font-bold text-white">🤖 AI 전문상담사</span>
                </div>
                <div className="text-xs text-blue-100 mt-2 flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>클릭하여 상담 시작</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GripVertical className="w-3 h-3" />
                    <span>드래그 이동</span>
                  </div>
                </div>
                {/* 툴팁 화살표 */}
                <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600/95"></div>
                
                {/* 반짝이는 효과 */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent opacity-50 animate-pulse"></div>
              </div>
            )}
            
            {/* 🌟 **강화된 펄스 효과와 텍스트 애니메이션** */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 animate-ping"></div>
            
            {/* 📱 **모바일 전용 간단한 상담 시작 텍스트** */}
            {isMobile && !isDragging && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-blue-600/95 text-white text-xs px-3 py-1 rounded-full shadow-lg border border-white/20 animate-pulse">
                  <span className="font-medium">💬 AI 상담 시작</span>
                </div>
              </div>
            )}
            
            {/* 🎯 **데스크톱용 상담 시작 유도 애니메이션** */}
            {!isMobile && !isDragging && (
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce">
                <div className="bg-gradient-to-r from-blue-600/95 to-purple-600/95 text-white text-sm px-4 py-2 rounded-full shadow-xl border border-white/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span className="font-bold">클릭하여 AI 상담 시작!</span>
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
                {/* 화살표 */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-600/95"></div>
              </div>
            )}
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
          <Card className={`h-full shadow-2xl border-2 bg-white rounded-lg overflow-hidden transition-all duration-200 ${isDragging ? 'border-blue-500 shadow-2xl' : isSnapAnimating ? 'border-green-400 shadow-xl' : 'border-gray-300'}`}>
            {/* 🟦 **확장된 채팅창 드래그 헤더 (모바일 최적화)** */}
                          <CardHeader 
              className={`${isMobile ? 'p-2' : 'p-3'} bg-gradient-to-r from-blue-500 to-purple-600 text-white select-none relative transition-all duration-200 ${isDragging ? 'cursor-grabbing bg-blue-600 shadow-2xl' : isSnapAnimating ? 'bg-green-500 cursor-default' : 'cursor-move hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700'}`}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              title={isMobile ? "헤더 터치로 이동" : "헤더를 드래그해서 위아래로 이동하세요"}
            >
              {/* 🚨 **극대형 슈퍼 닫기 버튼 - 절대 놓칠 수 없는 크기!** */}
              <div
                className="absolute -top-6 -right-6 z-[999] cursor-pointer group"
                onClick={handleClose}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                title="🔴 AI 상담창 닫기"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 rounded-full shadow-2xl border-4 border-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 relative overflow-hidden">
                  {/* 메인 X 아이콘 */}
                  <X className="w-10 h-10 text-white font-black stroke-[4] drop-shadow-lg relative z-10" />
                  
                  {/* 강력한 애니메이션 효과들 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/50 to-red-700/50 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 scale-90 animate-ping"></div>
                  <div className="absolute -inset-2 rounded-full border-3 border-red-300/60 animate-spin-slow"></div>
                  
                  {/* 반짝이는 하이라이트 */}
                  <div className="absolute top-2 left-4 w-3 h-3 bg-white/70 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute bottom-3 right-5 w-2 h-2 bg-white/50 rounded-full blur-sm animate-bounce"></div>
                </div>
                
                {/* 🎯 **극대형 툴팁** */}
                <div className="absolute bottom-full right-0 mb-4 px-6 py-4 bg-red-600/95 text-white text-lg font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl backdrop-blur-sm border-2 border-red-400/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <X className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-black">채팅창 닫기</div>
                      <div className="text-sm text-red-100 font-normal">원형 버튼으로 돌아가기</div>
                    </div>
                  </div>
                  {/* 큰 화살표 */}
                  <div className="absolute top-full right-8 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-red-600/95"></div>
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
                  
                  {/* 🎯 **플랫폼별 드래그 가이드** */}
                  {isMobile ? (
                    // 모바일 전용 드래그 가이드
                    <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full transition-all duration-200 ${isDragging ? 'bg-white/40 scale-105 animate-pulse' : isSnapAnimating ? 'bg-green-400/30' : 'bg-white/10'}`}>
                      {isDragging ? (
                        <>
                          <div className="flex flex-col items-center">
                            <div className="w-0 h-0 border-l-1 border-r-1 border-b-2 border-transparent border-b-white animate-bounce"></div>
                            <div className="w-0 h-0 border-l-1 border-r-1 border-t-2 border-transparent border-t-white animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                          </div>
                          <span className="font-bold text-white">↕ 터치 이동</span>
                        </>
                      ) : isSnapAnimating ? (
                        <>
                          <span className="text-lg animate-spin">🎯</span>
                          <span className="font-medium text-white">위치 조정</span>
                        </>
                      ) : (
                        <>
                          <GripVertical className="w-3 h-3" />
                          <span className="font-medium">터치 이동</span>
                        </>
                      )}
                    </div>
                  ) : (
                    // 데스크톱 드래그 가이드
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
                  
                  {/* 🚨 **헤더 내부 극대형 닫기 버튼** */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="text-white hover:bg-red-500 bg-red-600/80 border-4 border-white w-16 h-16 transition-all duration-300 hover:scale-125 active:scale-95 hover:border-yellow-300 hover:shadow-2xl group relative rounded-full p-0"
                    title="🔴 AI 상담창 완전히 닫기"
                  >
                    <X className="w-9 h-9 text-white font-black stroke-[4] group-hover:rotate-180 transition-transform duration-500 drop-shadow-lg" />
                    
                    {/* 극강 시각 효과 */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/40 to-red-700/40 animate-pulse"></div>
                    <div className="absolute -inset-2 rounded-full border-3 border-yellow-300/60 opacity-0 group-hover:opacity-100 animate-ping"></div>
                    <div className="absolute -inset-1 rounded-full border-2 border-red-300/80 animate-spin-slow"></div>
                    
                    {/* 반짝이는 포인트들 */}
                    <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                    <div className="absolute bottom-2 left-1 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
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