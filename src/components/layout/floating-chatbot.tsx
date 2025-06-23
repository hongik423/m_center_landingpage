'use client';

import React, { useState, useEffect, useRef } from 'react';
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

  // 환영 메시지 추가
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `🌟 안녕하세요! **기업의별 M-CENTER** 별-AI상담사입니다!

✨ **GEMINI AI 기반 스마트 상담**으로 더욱 정확하고 개인화된 답변을 제공해드립니다!

🎯 **상담 가능한 분야:**
• 📈 **매출 증대 전략** - BM ZEN 사업분석 (성공률 95%)
• 🤖 **AI 생산성향상** - ChatGPT 활용법 (효율 40-60% 향상)
• 🏭 **공장/부동산** - 경매활용 구매전략 (30-50% 절감)
• 🚀 **기술창업** - 사업화 및 정부지원 (평균 5억원 확보)
• 🏆 **인증지원** - ISO/벤처/연구소 (연간 5천만원 세제혜택)
• 🌐 **웹사이트 구축** - SEO 전문 (매출 300-500% 증대)

💬 **궁금한 것을 자유롭게 물어보세요!**
📞 **긴급상담: 010-9251-9743 (이후경 경영지도사)**

---
💡 **예시 질문:**
"우리 회사 매출을 늘리려면 어떻게 해야 하나요?"
"AI 도입으로 업무 효율을 높이고 싶어요"
"공장 구매를 저렴하게 하는 방법이 있나요?"`,
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
      console.log('🚀 AI API 호출 시작:', { message: message.trim() });
      
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
    return `✨ **기업의별 M-CENTER**에서 도움드리겠습니다!

🎯 **맞춤형 솔루션 제공 분야:**
• 📈 **매출 증대** - BM ZEN 사업분석으로 20-40% 성장
• 🤖 **AI 생산성향상** - ChatGPT 활용으로 업무효율 60% 향상  
• 🏭 **공장/부동산** - 경매활용으로 30-50% 비용절감
• 🚀 **기술창업** - 평균 5억원 정부지원 연계

**더 구체적인 상담을 원하시면:**
📞 **즉시 상담: 010-9251-9743 (이후경 경영지도사)**
🔗 **무료 진단: /services/diagnosis**

💡 **25년 경험의 전문 컨설팅**으로 확실한 성과를 보장합니다!`;
  };

  return (
    <>
      {/* 🔥 강제로 보이는 플로팅 챗봇 버튼 */}
      <div
        id="floating-chatbot-button"
        className={`${isOpen ? 'hidden' : 'block'}`}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '70px',
          height: '70px',
          backgroundColor: '#4285F4',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 999999,
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(66, 133, 244, 0.4)',
          border: '3px solid white',
          transition: 'all 0.3s ease'
        }}
        onClick={() => setIsOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.backgroundColor = '#9C27B0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#4285F4';
        }}
      >
        {/* 별-AI상담사 아이콘 */}
        <img
          src={getImagePath('/star-counselor-icon.svg')}
          alt="별-AI상담사"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
        
        {/* 툴팁 */}
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
          별-AI상담사 클릭!
        </div>
      </div>

      {/* 채팅창 */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '380px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 999998,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              background: 'linear-gradient(135deg, #4285F4 0%, #9C27B0 100%)',
              color: 'white',
              padding: '16px',
              borderRadius: '12px 12px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <img
                 src={getImagePath('/star-counselor-icon.svg')}
                 alt="별-AI상담사"
                 style={{
                   width: '35px',
                   height: '35px',
                   borderRadius: '50%',
                   objectFit: 'cover'
                 }}
               />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  별-AI상담사
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  GEMINI AI • 온라인
                </div>
              </div>
            </div>
            
            {/* X 버튼 */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {/* 메시지 영역 */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#f8fafc'
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
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: message.sender === 'user' ? '#4285F4' : 'white',
                    color: message.sender === 'user' ? 'white' : '#333',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: message.sender === 'bot' ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {message.content}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      marginTop: '8px',
                      opacity: 0.7
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
                    padding: '12px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: '#4285F4', 
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite'
                    }}></div>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: '#4285F4', 
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite 0.2s'
                    }}></div>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: '#4285F4', 
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite 0.4s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div
            style={{
              padding: '16px',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: 'white',
              borderRadius: '0 0 12px 12px'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="메시지를 입력하세요..."
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '24px',
                  fontSize: '14px',
                  outline: 'none'
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
                  e.target.style.borderColor = '#4285F4';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
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
                  width: '45px',
                  height: '45px',
                  backgroundColor: inputValue.trim() && !isTyping ? '#4285F4' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
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
        
        #floating-chatbot-button:hover .tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
} 