'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';
import { getImagePath } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 환영 메시지 추가
  useEffect(() => {
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
  }, []);

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

  const handleSendClick = () => {
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img 
                src={getImagePath('/star-counselor-icon.svg')}
                alt="별 AI 상담사" 
                className="w-12 h-12"
              />
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                별-AI상담사
                <span className="text-yellow-500">⭐</span>
              </h1>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-semibold">GEMINI AI</span>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full">● 온라인</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full">24시간 상담</span>
            </div>
          </div>

          {/* 채팅 영역 */}
          <Card className="shadow-lg h-[600px] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
              <CardTitle className="flex items-center gap-3">
                <Bot className="w-6 h-6" />
                <span>M-CENTER AI 상담센터</span>
                <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded-full">25년 전문 노하우</span>
              </CardTitle>
            </CardHeader>
            
            {/* 메시지 영역 */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-3 max-w-[80%]">
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`p-4 rounded-lg shadow-sm ${
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
                    
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* 입력 영역 */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="메시지를 입력하세요... (예: 우리 회사 매출을 늘리려면?)"
                  className="flex-1 rounded-full border-2 border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }
                  }}
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendClick}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full disabled:opacity-50 transition-all duration-200"
                  title="메시지 전송"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="mt-2 text-center text-xs text-gray-500">
                💡 **팁**: "매출 증대", "AI 활용", "공장구매", "기술창업" 등에 대해 물어보세요!
              </div>
            </div>
          </Card>

          {/* 빠른 질문 버튼들 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">💬 **빠른 질문 예시** (클릭하면 자동 입력)</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "우리 회사 매출을 늘리려면 어떻게 해야 하나요?",
                "AI 도입으로 업무 효율을 높이고 싶어요",
                "공장 구매를 저렴하게 하는 방법이 있나요?",
                "정부지원 사업은 어떤 것들이 있나요?",
                "ISO 인증 받으면 어떤 혜택이 있나요?",
                "웹사이트로 매출을 늘릴 수 있나요?"
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(question)}
                  className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {question.slice(0, 20)}...
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 