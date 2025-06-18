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
  
  // 🔥 **오른쪽 고정, 수직 드래그만 가능한 상태**
  const [position, setPosition] = useState<Position>({ x: 0, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  
  // 🚀 **드래그 로그 최적화를 위한 throttle**
  const [lastLogTime, setLastLogTime] = useState(0);
  const LOG_THROTTLE_MS = 500; // 0.5초마다 한번만 로그

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // 🔵 **오른쪽 끝에 고정된 초기 위치 설정 (원형 버튼 크기 반영)**
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updatePosition = () => {
        setPosition(prev => ({
          x: window.innerWidth - (isOpen ? 420 : 84), // 원형(64px) + 여백(20px) = 84px
          y: prev.y
        }));
      };
      
      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isOpen]);

  // 🔥 **수직 드래그 시작 (X축 고정)**
  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY - position.y
    });
    
    // 🚀 시작시에만 로그
    console.log('🎯 수직 드래그 시작:', { y: position.y });
  };

  // 🔥 **수직 드래그 이벤트 처리 (X축 고정) + 로그 최적화**
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newY = e.clientY - dragStart.y;
      
      // Y축 경계 체크 (상단 10px ~ 하단 10px, 원형 버튼 높이 64px 반영)
      const maxY = window.innerHeight - (isOpen ? (isMinimized ? 80 : 520) : 64) - 10;
      const boundedY = Math.max(10, Math.min(newY, maxY));
      
      // X축은 항상 오른쪽 끝에 고정 (원형 버튼 크기 반영)
      const fixedX = window.innerWidth - (isOpen ? 420 : 84);
      
      setPosition({
        x: fixedX,
        y: boundedY
      });
      
      // 🚀 **로그 throttling으로 스팸 방지**
      const now = Date.now();
      if (now - lastLogTime > LOG_THROTTLE_MS) {
        console.log('🚀 수직 드래그 중:', { y: boundedY, throttled: true });
        setLastLogTime(now);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        console.log('✅ 드래그 종료 - 최종 위치:', { y: position.y });
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragStart, isOpen, isMinimized, lastLogTime, position.y]);

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
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `❌ 연결 오류가 발생했습니다.\n\n📞 **즉시 상담: 010-9251-9743**\n📧 **이메일: hongik423@gmail.com**`,
        sender: 'bot',
        timestamp: new Date()
      };
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  }, [messages, addMessage]);

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
      {/* 🔵 **원형 플로팅 챗봇 버튼** */}
      {!isOpen && (
        <div 
          className={`fixed z-50 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            transition: isDragging ? 'none' : 'all 0.2s ease'
          }}
          onMouseDown={startDrag}
          onClick={handleToggle}
        >
          {/* 🔵 **원형 버튼** */}
          <div className={`relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group ${isDragging ? 'scale-110 shadow-2xl ring-4 ring-blue-300/50' : 'hover:scale-110'}`}>
            
            {/* 메인 AI 아이콘 */}
            <Bot className="w-8 h-8 text-white" />
            
            {/* 온라인 상태 표시 */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
            
            {/* 🎯 **드래그 힌트 도트들 (원형에 맞게)** */}
            {isDragging && (
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/60 animate-spin-slow">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
              </div>
            )}
            
            {/* 드래그 중 수직 인디케이터 */}
            {isDragging && (
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
            
            {/* 호버 툴팁 */}
            {!isDragging && (
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

      {/* 🎯 **오른쪽 고정 채팅창** */}
      {isOpen && (
        <div 
          className="fixed z-50"
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            width: '400px',
            height: isMinimized ? '60px' : '520px',
            transition: isDragging ? 'none' : 'all 0.2s ease'
          }}
        >
          <Card className={`h-full shadow-2xl border-2 bg-white rounded-lg overflow-hidden ${isDragging ? 'border-blue-500 shadow-2xl' : 'border-gray-300'}`}>
            {/* 🟦 **확장된 채팅창 드래그 헤더** */}
            <CardHeader 
              className={`p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white select-none relative transition-all duration-200 ${isDragging ? 'cursor-grabbing bg-blue-600 shadow-2xl' : 'cursor-move hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700'}`}
              onMouseDown={startDrag}
              title="헤더를 드래그해서 위아래로 이동하세요"
            >
              {/* 🔥 **최상위 닫기 버튼 (절대 위치)** */}
              <div
                className="absolute -top-2 -right-2 z-[60] cursor-pointer"
                onClick={handleClose}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <X className="w-4 h-4 text-white font-bold" />
                </div>
              </div>

              {/* 🎯 **드래그 핸들 바 (상단)** */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                <div className="flex space-x-1">
                  <div className="w-8 h-1 bg-white/40 rounded-full"></div>
                  <div className="w-8 h-1 bg-white/40 rounded-full"></div>
                  <div className="w-8 h-1 bg-white/40 rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bot className="w-5 h-5" />
                  <span className="font-semibold text-sm">기업의별 AI상담사</span>
                  
                  {/* 🎯 **강화된 드래그 가이드** */}
                  <div className={`flex items-center space-x-2 text-xs px-3 py-1 rounded-full transition-all duration-200 ${isDragging ? 'bg-white/30 scale-105' : 'bg-white/10 hover:bg-white/20'}`}>
                    <GripVertical className={`w-3 h-3 ${isDragging ? 'animate-pulse' : ''}`} />
                    <span className="font-medium">드래그 이동</span>
                    <div className="flex flex-col space-y-0.5">
                      <div className="w-0 h-0 border-l-1.5 border-r-1.5 border-b-2 border-transparent border-b-white/80"></div>
                      <div className="w-0 h-0 border-l-1.5 border-r-1.5 border-t-2 border-transparent border-t-white/80"></div>
                    </div>
                  </div>
                </div>
                
                {/* 🔥 **강화된 컨트롤 버튼들** */}
                <div className="flex items-center space-x-1 z-[55]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMinimize}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="text-white hover:bg-white/20 p-1 h-7 w-7 transition-all duration-200"
                    title={isMinimized ? "확대" : "최소화"}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  
                  {/* 🔥 **헤더 내부 닫기 버튼** */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="text-white hover:bg-red-500 bg-red-400/30 border border-white/30 p-1 h-8 w-8 transition-all duration-200 hover:scale-105"
                    title="채팅창 닫기"
                  >
                    <X className="w-5 h-5 font-bold" />
                  </Button>
                </div>
              </div>
              
              {/* 🚀 **드래그 중 강화된 상태 표시** */}
              {isDragging && (
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
              
              {/* 🎯 **호버 시 드래그 힌트** */}
              {!isDragging && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="text-xs text-white/80 bg-black/30 px-2 py-1 rounded-full whitespace-nowrap">
                    헤더를 클릭하고 드래그하세요
                  </div>
                </div>
              )}
            </CardHeader>

            {/* 🔥 **추가 상단 닫기 바** */}
            <div className="relative bg-white">
              <div className="absolute top-0 right-4 z-[55]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-gray-600 hover:text-red-500 hover:bg-red-50 p-1 h-6 w-6 transition-all duration-200"
                  title="닫기 ×"
                >
                  <X className="w-4 h-4 font-bold" />
                </Button>
              </div>
            </div>

            {/* 메시지 영역 */}
            {!isMinimized && (
              <CardContent className="p-0 flex flex-col h-full pt-6">
                {/* 메시지 리스트 */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-80">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-3 rounded-lg text-sm ${
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
                      <div className="bg-gray-100 p-3 rounded-lg">
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

                {/* 빠른 액션 버튼 */}
                <div className="p-3 border-t bg-gray-50">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs p-2 h-8"
                        onClick={() => handleQuickAction(action.action)}
                      >
                        <action.icon className="w-3 h-3 mr-1" />
                        {action.text}
                      </Button>
                    ))}
                  </div>
                  
                  {/* 입력 영역 */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="메시지를 입력하세요..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage(inputValue);
                        }
                      }}
                      className="flex-1 text-sm h-9"
                      disabled={isTyping}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      className="h-9 w-9 p-0"
                    >
                      <Send className="w-4 h-4" />
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