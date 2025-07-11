'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  User, 
  Bot,
  Sparkles,
  MessageCircle,
  Clock,
  CheckCircle,
  Zap,
  Search,
  Brain
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
  buttons?: Array<{
    text: string;
    url: string;
    style: string;
    icon: string;
  }>;
}

interface MCenterChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

const MCenterChatInterface: React.FC<MCenterChatInterfaceProps> = ({
  isOpen,
  onClose,
  onMinimize
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! 이후경입니다.\n\n28년간 현대그룹과 삼성생명에서 실무를 쌓고, 200여 개 기업을 직접 도우면서 얻은 경험에 최첨단 AI 기술을 접목해서 기업들이 실무에서 전략까지 정말 폭발적인 성장을 할 수 있도록 도와드리고 있어요.\n\n재무, 인사, 생산, 마케팅을 통합적으로 보면서 AI 검색 기술까지 결합한 차별화된 접근법이 저희만의 강점이에요. 어떤 도움이 필요하신지 편하게 말씀해주세요.\n\nBM ZEN 사업분석, AI 생산성혁신, 공장경매, 기술창업, 인증지원, 웹사이트구축 등 뭐든 물어보세요.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // 🌟 세계최고 이후경경영지도사 AI 상담 시스템 API 호출 함수
  const callMCenterAPI = async (userQuery: string): Promise<{ response: string; buttons?: Array<{ text: string; url: string; style: string; icon: string }> }> => {
    try {
      console.log('🧠 세계최고 이후경경영지도사 AI 호출 시작:', { 
        message: userQuery,
        messageLength: userQuery.length 
      });
      
      // 🎯 새로운 고도화된 이후경경영지도사 AI API 호출
      const response = await fetch('/api/chat-lee-hukyung', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userQuery,
          history: messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.sender === 'user' ? 'user' : 'bot',
            timestamp: msg.timestamp
          }))
        })
      });

      console.log('📡 이후경경영지도사 AI 응답 상태:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw new Error(`이후경경영지도사 AI Error: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('✅ 이후경경영지도사 AI 응답 성공:', { 
        complexity: data.complexity,
        responseLength: data.responseLength || data.response?.length || 0,
        hasButtons: !!data.buttons,
        buttonsCount: data.buttons?.length || 0
      });
      
      if (data.response) {
        return {
          response: data.response,
          buttons: data.buttons || []
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ 이후경경영지도사 AI 오류:', error);
      return {
        response: generateFallbackResponse(userQuery),
        buttons: []
      };
    }
  };

  // 🌟 개선된 폴백 응답 생성기
  const generateFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // 업데이트된 응답 데이터베이스
    const responses = {
      '상담': `안녕하세요! 이후경 경영지도사입니다.

상담 문의해주셔서 감사합니다! 28년간 500개 기업을 성공으로 이끈 경험을 바탕으로 실질적이고 성과 중심적인 솔루션을 제공해드리겠습니다.

🎯 **M-CENTER 6대 핵심서비스:**
• BM ZEN 사업분석 - 매출 20-40% 증대
• AI 생산성향상 - 업무효율 40% 향상 (정부 100% 지원)
• 정책자금 확보 - 평균 15억원 확보
• 기술창업 지원 - 평균 5억원 자금 확보
• 인증지원 - 연간 5천만원 세제혜택
• 웹사이트 구축 - 온라인 매출 300% 증대

📊 **검증된 성과:** 95% 성공률, 평균 ROI 400%

📞 **즉시 상담:** 010-9251-9743`,
      
      'AI': `AI 생산성 향상에 대해 문의해주셔서 감사합니다! 

🤖 **2025년 일터혁신 상생컨설팅 - AI 활용 생산성향상**

📊 **실제 성과 (247개 기업 평균):**
• 업무효율성 42% 향상
• 업무시간 35% 단축
• 연간 인건비 8,500만원 절감
• AI 도구 활용 만족도 94%

🏆 **성공사례: (주)스마트팩토리솔루션**
• 제안서 작성 시간 69% 단축 (8시간→2.5시간)
• 품질 데이터 분석 85% 단축 (주 20시간→3시간)
• 연간 경제적 효과 5억 8천만원

💰 **정부지원:** 고용노동부 일터혁신 수행기관으로서 100% 무료 지원

어떤 업무에 AI를 적용하고 싶으신지 구체적으로 알려주시면 맞춤형 로드맵을 제시해드리겠습니다.

📞 **AI 상담:** 010-9251-9743`,
      
      '정책자금': `정책자금에 대해 문의해주셔서 감사합니다!

💰 **업종별 정책자금 (최신 정보):**
🏭 제조업: 시설자금 50억원 (연 1.5%), 운영자금 30억원 (연 2.0%)
🏢 서비스업: 창업자금 10억원 (연 2.5%), 디지털전환 5억원 (연 1.8%)
🚀 기술기업: R&D 자금 100억원 (연 1.0%), 사업화 50억원 (연 1.5%)

💡 **절약효과:** 시중은행 대비 68% 이자비용 절감

🏆 **성공사례: H관광개발**
• 5년간 총 100억원 확보
• 매출 650% 성장 (20억→150억)

📋 **8단계 완벽 대행:** 진단→매칭→서류→신청→심사→승인→집행→사후관리

기업 규모와 자금 용도를 알려주시면 최적의 정책자금을 매칭해드리겠습니다.

📞 **정책자금 상담:** 010-9251-9743`,

      '창업': `기술창업에 대해 문의해주셔서 감사합니다!

🚀 **4단계 성장 로드맵:**
1단계: 특허출원+예비벤처+디딤돌과제 (1.7억원)
2단계: 벤처확인+기술개발+정책자금 (24.7억원)
3단계: TIPS선정+해외진출+VC투자 (57억원)
4단계: 상장준비+글로벌확대

🏆 **성공사례: ABC기업**
• 총 확보 실적: 87억원
• ROI: 2,174%
• 기업가치: 500억원

📊 **투자유치 성공률:** 업계 평균 15% → 실제 85%

현재 보유 기술과 창업 단계를 알려주시면 맞춤형 로드맵을 제시해드리겠습니다.

📞 **창업 상담:** 010-9251-9743`,

      '세금': `세금계산기에 대해 문의해주셔서 감사합니다!

🧮 **M-CENTER 세금계산기 (2024년 최신 세율):**
• 소득세, 법인세, 부가가치세, 상속세, 증여세
• 양도소득세, 종합소득세, 원천징수세 등

✨ **주요 기능:**
• 실시간 세액 계산
• 세금 절약 팁 제공
• PDF 결과 다운로드

🌐 **바로가기:** https://m-center.co.kr/tax-calculator

💡 **추가 서비스:** 절세 전략 수립, 세무 컨설팅

📞 **세무 상담:** 010-9251-9743`
    };

    // 키워드 매칭으로 적절한 응답 선택
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword) || lowerMessage.includes(keyword.toLowerCase())) {
        return response;
      }
    }

    // 기본 응답 (업데이트된 버전)
    return `안녕하세요! 이후경 경영지도사입니다.

"${userMessage}"에 대해 문의해주셔서 감사합니다! 28년간 현대그룹과 삼성생명에서 쌓은 실무 경험과 500개 기업을 직접 지도한 컨설팅 노하우를 바탕으로 실질적이고 성과 중심적인 솔루션을 제공해드리겠습니다.

🎯 **M-CENTER 6대 핵심서비스:**

1. **BM ZEN 사업분석** - 매출 20-40% 증대, 국내 유일 독자적 프레임워크
2. **AI 생산성향상** - 업무효율 40% 향상, 247개 기업 실제 지도 (정부 100% 지원)
3. **정책자금 확보** - 평균 15억원 확보, 68% 이자비용 절감
4. **기술창업 지원** - 평균 5억원 자금 확보, ROI 2,174%
5. **인증지원** - 연간 5천만원 세제혜택, 100% 취득 보장
6. **웹사이트 구축** - 온라인 매출 300% 증대, 1년차 ROI 1,667%

📊 **검증된 성과:**
• 95% 성공률
• 평균 ROI 400%
• 고객 만족도 96%
• 500개 기업 직접 지도

🏆 **대표 성공사례:**
• H관광개발: 5년간 100억원 확보, 매출 650% 성장
• 스마트팩토리솔루션: AI 도입으로 연간 5억 8천만원 효과
• ABC기업: 총 87억원 확보, 기업가치 500억원

구체적인 상황을 더 자세히 알려주시면 맞춤형 솔루션을 제시해드릴 수 있습니다.

📞 **직접 상담:** 010-9251-9743
🌐 **무료 진단:** https://m-center.co.kr/diagnosis
📧 **이메일:** hongik423@gmail.com`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // 🔥 이후경 경영지도사 직접 응답 API 호출
      const aiResponseData = await callMCenterAPI(currentInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseData.response,
        sender: 'ai',
        timestamp: new Date(),
        buttons: aiResponseData.buttons || []
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('M-CENTER Response Error:', error);
      // 에러 발생시 폴백 응답
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateFallbackResponse(currentInput),
        sender: 'ai',
        timestamp: new Date(),
        buttons: []
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[85vh]'
      }`}>
        
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/images/M-Center-leader.png"
                alt="M센터장 이후경 경영지도사"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">이후경 경영지도사</h3>
              <div className="flex items-center space-x-1 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>25년 경험 상담 중</span>
                <CheckCircle className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onMinimize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(85vh-140px)]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {/* 아바타 */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <img
                          src="/images/M-Center-leader.png"
                          alt="M센터장"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    {/* 메시지 버블 */}
                    <div className={`space-y-3 ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      
                      {/* 🔥 상담신청 버튼들 렌더링 */}
                      {message.sender === 'ai' && message.buttons && message.buttons.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.buttons.map((button, index) => (
                            <a
                              key={index}
                              href={button.url}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                                button.style === 'primary' 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                  : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                              }`}
                              onClick={(e) => {
                                // 진동 피드백 (모바일)
                                if (navigator.vibrate) {
                                  navigator.vibrate(50);
                                }
                              }}
                            >
                              <span className="text-base">{button.icon}</span>
                              <span>{button.text}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 로딩 메시지 */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center overflow-hidden">
                      <img
                        src="/images/M-Center-leader.png"
                        alt="M센터장"
                        className="w-full h-full object-cover animate-pulse"
                      />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <Search className="w-4 h-4 text-blue-500 animate-spin" />
                        <span className="text-sm text-gray-500">이후경 경영지도사 분석 중...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="이후경 경영지도사에게 상담 문의하세요... (25년 경험)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      size="sm"
                      className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white p-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* 빠른 응답 버튼들 */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  'BM ZEN 사업분석',
                  'AI 일터혁신',
                  '공장경매 투자',
                  '5억원 기술창업',
                  '5천만원 인증혜택',
                  '매출 300% 웹사이트'
                ].map((quickReply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(quickReply)}
                    className="text-xs px-3 py-1 rounded-full border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                    disabled={isLoading}
                  >
                    {quickReply}
                  </Button>
                ))}
              </div>
              
              {/* 🌟 세계최고 이후경경영지도사 AI 상태 표시 */}
              <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                <Brain className="w-3 h-3 mr-1 text-purple-500 animate-pulse" />
                <span>세계최고 이후경경영지도사 AI • 25년 경험 + 고도화 분석 시스템</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MCenterChatInterface; 