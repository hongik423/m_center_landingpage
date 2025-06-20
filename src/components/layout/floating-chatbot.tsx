'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, MessageCircle, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

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

  // 환영 메시지 추가
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `🚀 안녕하세요! **기업의별 M-CENTER** AI상담사입니다.

✨ **GEMINI AI 기반 스마트 상담**으로 더욱 정확하고 개인화된 답변을 제공해드립니다!

🎯 **상담 가능한 분야:**
• 📈 매출 증대 전략 - BM ZEN 사업분석
• 🤖 AI 생산성향상 - ChatGPT 활용법  
• 🏭 공장/부동산 - 경매활용 구매전략
• 🚀 기술창업 - 사업화 및 정부지원

💬 궁금한 것을 자유롭게 물어보세요!
📞 **긴급상담: 010-9251-9743**`,
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          history: messages.slice(-5)
        }),
      });

      if (response.ok) {
        const data = await response.json();
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
      console.error('AI 응답 오류:', error);
      // 폴백 응답
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
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('매출') || lowerMessage.includes('수익')) {
      return `💰 **매출 증대 전문 컨설팅**

🏆 **BM ZEN 사업분석 서비스**
• 독자적 프레임워크로 95% 성공률
• 평균 20-40% 매출 증대 보장
• 3개월 내 가시적 성과

📊 **실제 성과:**
• 제조업체: 8개월 만에 45% 매출 증가
• IT서비스: 6개월 만에 수익률 60% 개선

📞 **무료 상담: 010-9251-9743**
🔗 [무료 AI진단 신청](/services/diagnosis)`;
    }

    if (lowerMessage.includes('ai') || lowerMessage.includes('효율')) {
      return `🤖 **AI 생산성향상 컨설팅**

✨ **ChatGPT 전문 활용법**
• 업무효율 40-60% 향상 보장
• 인건비 25% 절감 효과
• 실무진 1:1 맞춤 교육

🎯 **정부지원 연계:**
• AI 바우처 최대 2천만원 지원
• 100% 정부지원 가능

📞 **상담: 010-9251-9743**
🔗 [서비스 상세보기](/services/ai-productivity)`;
    }

    if (lowerMessage.includes('상담') || lowerMessage.includes('연락')) {
      return `💬 **전문가 무료 상담 안내**

📞 **즉시 상담:**
• 전화: 010-9251-9743 (이후경 경영지도사)
• 이메일: hongik423@gmail.com

⚡ **온라인 신청:**
• [무료 AI진단](/services/diagnosis)
• [전문가 상담](/consultation)

🏆 **25년 경험의 전문 컨설턴트가 직접 상담해드립니다!**`;
    }

    return `✨ **기업의별 M-CENTER**에서 도움드리겠습니다!

🎯 **맞춤형 솔루션 제공 분야:**

• 📈 **매출 증대** - BM ZEN 사업분석으로 20-40% 성장
• 🤖 **AI 생산성향상** - ChatGPT 활용으로 업무효율 60% 향상
• 🏭 **공장/부동산** - 경매활용으로 30-50% 비용절감
• 🚀 **기술창업** - 평균 5억원 정부지원 연계
• 📋 **인증지원** - 연간 5천만원 세제혜택
• 🌐 **웹사이트 구축** - 온라인 매출 30% 증대

더 구체적인 상담을 원하시면:
📞 **즉시 상담: 010-9251-9743**
🔗 **무료 진단: /services/diagnosis**`;
  };

  return (
    <React.Fragment>
      {/* 🎨 귀여운 플로팅 버튼 */}
      {!isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 cursor-pointer group transition-all duration-300 hover:scale-110 active:scale-95"
          onClick={() => setIsOpen(true)}
          data-floating-chatbot="true"
        >
          <div className="relative">
            {/* 메인 버튼 */}
            <div className="w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-4 border-white/20" style={{ backgroundColor: '#4285F4', boxShadow: '0 25px 50px -12px rgba(66, 133, 244, 0.4)' }}>
              {/* 새로운 별-AI상담사 아이콘 */}
              <img 
                src="/star-counselor-icon.svg" 
                alt="별-AI상담사" 
                className="w-12 h-12"
              />
              
              {/* 펄스 효과 */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#4285F4' }}></div>
              
              {/* 온라인 상태 표시 - 별 모양 */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                <span className="text-xs">⭐</span>
              </div>
            </div>
            
            {/* 호버 툴팁 */}
            <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900/95 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">⭐</span>
                <span>별-AI상담사와 채팅하기</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎨 단순하고 깔끔한 채팅창 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] z-50 transition-all duration-300">
          <Card className="h-full shadow-2xl border-0 bg-white rounded-3xl overflow-hidden">
            {/* 🎨 단순한 헤더 */}
            <CardHeader className="p-4 text-white relative" style={{ backgroundColor: '#4285F4' }}>
              {/* 단순한 닫기 버튼 - 이모지 사용 */}
              <button
                className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 text-lg"
                onClick={() => setIsOpen(false)}
                title="채팅창 닫기"
              >
                ✕
              </button>

              <div className="flex items-center space-x-3 pr-10">
                <div className="relative">
                  <img 
                    src="/star-counselor-icon.svg" 
                    alt="별-AI상담사" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">별-AI상담사</h3>
                  <div className="text-xs text-white/80 flex items-center space-x-1">
                    <span className="text-yellow-400">⭐</span>
                    <span>GEMINI AI 기반</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* 메시지 영역 */}
            <CardContent className="p-0 flex flex-col h-full">
              {/* 메시지 리스트 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl shadow-sm transition-all duration-200 ${
                        message.sender === 'user'
                          ? 'text-white rounded-br-md'
                          : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                      }`}
                      style={message.sender === 'user' ? { backgroundColor: '#4285F4' } : {}}
                    >
                      <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                      <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* 타이핑 인디케이터 */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#4285F4' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#4285F4', animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#4285F4', animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex space-x-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 text-sm rounded-full border-2 border-gray-200 bg-gray-50 transition-all duration-200"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4285F4';
                      e.target.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
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
                    className="px-4 text-white rounded-full shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                    style={{ 
                      backgroundColor: '#4285F4',
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = '#3367d6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = '#4285F4';
                      }
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </React.Fragment>
  );
} 