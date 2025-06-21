'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

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
• �� 기술창업 - 사업화 및 정부지원
• 🧮 세금계산기 - 11개 전문 계산기 제공

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
    return `✨ **기업의별 M-CENTER**에서 도움드리겠습니다!

🎯 **맞춤형 솔루션 제공 분야:**
• 📈 **매출 증대** - BM ZEN 사업분석으로 20-40% 성장
• 🤖 **AI 생산성향상** - ChatGPT 활용으로 업무효율 60% 향상
• 🏭 **공장/부동산** - 경매활용으로 30-50% 비용절감
• 🚀 **기술창업** - 평균 5억원 정부지원 연계

더 구체적인 상담을 원하시면:
📞 **즉시 상담: 010-9251-9743**
🔗 **무료 진단: /services/diagnosis**`;
  };

  return (
    <>
      {/* 원형 플로팅 버튼 */}
      {!isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 cursor-pointer group transition-all duration-300 hover:scale-110 active:scale-95"
          onClick={() => setIsOpen(true)}
          data-floating-chatbot="true"
        >
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-4 border-white/20" 
              style={{ backgroundColor: '#4285F4', boxShadow: '0 25px 50px -12px rgba(66, 133, 244, 0.4)' }}
            >
              <img 
                src="/star-counselor-icon.svg" 
                alt="별-AI상담사" 
                className="w-12 h-12"
              />
              <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#4285F4' }}></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                <span className="text-xs">⭐</span>
              </div>
            </div>
            
            <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900/95 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">⭐</span>
                <span>별-AI상담사와 채팅하기</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 새로운 간단한 채팅창 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] z-50">
          <div className="h-full bg-white rounded-lg shadow-2xl border border-gray-300 flex flex-col">
            
            {/* 🔥 헤더 - X 버튼 포함 */}
            <div className="bg-gray-100 p-4 rounded-t-lg border-b border-gray-300 relative">
              
              {/* ⭐ 100% 확실한 X 버튼 ⭐ */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-black text-white rounded-full hover:bg-gray-800 flex items-center justify-center font-bold text-lg"
                style={{ 
                  zIndex: 10000,
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                ×
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
                  <h3 className="font-bold text-lg text-gray-800">별-AI상담사</h3>
                  <div className="text-xs text-gray-600 flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span>GEMINI AI 기반</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                    <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="p-4 bg-white border-t border-gray-300 rounded-b-lg">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 text-sm rounded-full border-2 border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }
                  }}
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 