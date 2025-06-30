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

  // GEMINI AI API 호출 함수 (서버사이드 API 경유)
  const callGeminiAPI = async (userQuery: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userQuery
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.response) {
        return data.response;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('GEMINI API Error:', error);
      return generateFallbackResponse(userQuery);
    }
  };

  // 폴백 응답 (API 오류시)
  const generateFallbackResponse = (userMessage: string): string => {
    const responses = {
      '매출': `안녕하세요! 이후경입니다. 매출 증대에 대해 문의해주셨네요.

28년간 200여 개 기업을 직접 도우면서 깨달은 건, 단순히 매출만 늘리는 게 아니라 지속가능한 수익성을 높이는 게 정말 중요하다는 거예요.

제가 직접 개발한 BM ZEN 사업분석 프레임워크가 있어요. 현황분석부터 시장분석, 경쟁력분석, 전략수립, 실행계획까지 5단계로 체계적으로 접근하거든요.

실제 성과 사례들을 보면 정말 놀라워요. 한 제조업체는 기존 B2B에서 B2C로 확장해서 매출이 340% 증가했고, 서비스업체는 디지털 전환으로 고객당 매출이 180% 향상됐어요. 유통업체도 공급망을 최적화해서 수익률을 45% 개선했죠.

제가 28년간 쌓은 재무, 마케팅 노하우에 최첨단 AI 검색 기술을 접목하니까 시장 트렌드도 실시간으로 분석할 수 있고, 고객 행동 패턴 예측이나 맞춤형 마케팅 전략도 세울 수 있어요. ROI 시뮬레이션 정확도가 95%까지 나와요.

정부지원사업과 연계하면 컨설팅 비용의 80-100% 지원받을 수 있어요. 어떤 업종이신지, 현재 매출 규모가 어느 정도인지 알려주시면 더 구체적인 전략을 제시해드릴 수 있어요.`,
      
      'AI': `안녕하세요, 이후경입니다! AI 도입에 관심 가져주셔서 정말 감사해요.

28년 컨설팅 경험을 통해 확신하는 건, AI가 단순한 도구가 아니라 정말 일터혁신의 게임 체인저라는 거예요. 제가 직접 200여 개 기업에 AI를 도입하면서 얻은 통찰이랑 최신 AI 검색 기술을 결합해서 답변드릴게요.

일터혁신 AI 생산성 프로그램을 20주 과정으로 운영하고 있어요. 처음 5주는 AI 기초랑 ChatGPT 마스터하고, 6-10주는 업무 프로세스에 AI 적용하고, 11-15주는 고급 자동화 시스템 구축하고, 마지막 16-20주는 성과 측정하고 최적화하는 거죠.

실제 혁신 사례들이 정말 많아요. 제가 직접 지도한 제조업체는 품질관리에 AI 도입해서 불량률이 78% 감소했고, 서비스업체는 고객상담을 AI화해서 응답시간이 85% 단축됐어요. 유통업체는 재고관리를 AI로 예측해서 재고비용을 42% 절감했고요.

제가 하는 AI 컨설팅의 차별점은 전략적으로 접근한다는 거예요. 단순히 도구만 활용하는 게 아니라 비즈니스 모델 자체를 혁신하는 관점에서 봐요. 28년 현장 경험을 바탕으로 실행 가능한 솔루션을 제시하고, 재무, 인사, 생산, 마케팅 전 영역에 AI를 적용해요. 업무효율 40% 향상을 보장하고, 미달성시에는 100% 환불해드려요.

저희가 고용노동부 일터혁신 수행기관이라서 컨설팅 비용을 100% 정부지원받을 수 있어요.

어떤 업종이신지, 현재 가장 시간이 많이 걸리는 업무가 뭔지 알려주시면 AI 검색을 통해 최신 트렌드를 분석해서 맞춤형 AI 도입 로드맵을 제시해드릴게요.`
    };

    // 키워드 매칭으로 적절한 응답 선택
    for (const [keyword, response] of Object.entries(responses)) {
      if (userMessage.includes(keyword) || userMessage.includes(keyword.toLowerCase())) {
        return response;
      }
    }

    // 기본 응답
    return `안녕하세요! 이후경 경영지도사입니다.

25년간 현대그룹과 삼성생명에서 쌓은 대기업 실무 경험과 500개 기업을 직접 지도한 컨설팅 노하우에 최첨단 AI 검색 기술을 접목해서 "${userMessage}"에 대해 실질적이고 성과 중심적인 솔루션을 제공해드릴게요.

AI를 통해 관련 정보를 검색하고 분석한 결과를 바탕으로 말씀드리겠습니다.

M-CENTER에서는 6가지 핵심서비스로 기업들을 도와드리고 있어요.

첫 번째는 BM ZEN 사업분석이에요. 제가 직접 개발한 5단계 전략 프레임워크로 매출을 20-40% 증대시켜드려요. 재무, 마케팅, 운영을 통합적으로 분석하고 AI 기반으로 시장 트렌드도 예측해드리고요.

두 번째는 AI 생산성 혁신이에요. 업무효율을 40% 향상시키는 걸 보장해드리고, ChatGPT 기업 활용 마스터 프로그램도 운영해요. 일터혁신 수행기관으로서 정부에서 100% 지원해줘요.

세 번째는 공장이나 부동산 경매예요. 투자비를 35-50% 절약할 수 있어서 많이 찾아오시죠. 전문가가 직접 동행해서 입찰하고, 법무, 세무까지 종합적으로 지원해드려요.

네 번째는 기술창업 지원이에요. 평균 5억원 정도 자금을 확보해드리고, 정부R&D와 연계해서 사업화까지 이어가죠. 3년간 사후관리도 해드려요.

다섯 번째는 인증지원이에요. 벤처, ISO, ESG 등 각종 인증을 통합적으로 관리해서 연간 5천만원 정도 세제혜택을 확보해드려요. 100% 취득을 보장해드리고요.

여섯 번째는 디지털 혁신이에요. 온라인 매출을 300% 증대시키고, SEO 최적화랑 AI까지 접목해서 무료로 1년간 사후관리해드려요.

제가 하는 컨설팅의 차별점은 25년 실무 경험에 최신 AI 검색 기술을 융합한다는 거예요. 재무, 인사, 생산, 마케팅을 통합적으로 봐서 솔루션을 제시하고, 성과를 보장해드려요. 미달성시에는 환불도 해드리고요. 정부지원사업과 연계해서 비용도 최소화할 수 있어요.

구체적인 상황을 더 자세히 알려주시면 AI 검색을 통해 최신 데이터를 분석해서 더욱 정확한 솔루션을 제시해드릴 수 있어요!

직접 상담받으시려면 010-9251-9743으로 전화주세요.`;
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
      // GEMINI AI API 호출
      const aiResponse = await callGeminiAPI(currentInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Response Error:', error);
      // 에러 발생시 폴백 응답
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateFallbackResponse(currentInput),
        sender: 'ai',
        timestamp: new Date()
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
              <h3 className="font-semibold text-lg">M센터장 AI</h3>
              <div className="flex items-center space-x-1 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>AI 검색 활성화</span>
                <Search className="w-3 h-3 ml-1" />
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
                        <span className="text-sm text-gray-500">AI 검색 및 분석 중...</span>
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
                    placeholder="M센터장 AI에게 메시지를 보내세요... (AI 검색 활성화)"
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
              
              {/* AI 상태 표시 */}
              <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                <Brain className="w-3 h-3 mr-1" />
                <span>GEMINI AI 검색 기술로 최고 수준의 답변을 제공합니다</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MCenterChatInterface; 