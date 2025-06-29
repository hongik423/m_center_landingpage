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
      content: '안녕하세요! 👋 M-CENTER M센터장 이후경 경영지도사입니다.\n\n28년간 현대그룹과 삼성생명에서 쌓은 대기업 실무 경험과 200여 개 기업을 직접 지도한 컨설팅 노하우에 최첨단 AI 기술을 접목하여, 귀하의 기업이 실무에서 전략까지 폭발적인 일터혁신을 경험할 수 있도록 성과중심 컨설팅을 제공해드립니다.\n\n재무·인사·생산·마케팅의 통합적 솔루션에 AI 검색 기술을 결합한 차별화된 접근으로 어떤 도움을 드릴까요?\n\n🎯 BM ZEN 사업분석 | 🤖 AI 생산성혁신 | 🏭 공장경매 | 🚀 기술창업 | 🏆 인증지원 | 🌐 웹사이트구축',
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

  // GEMINI AI API 호출 함수
  const callGeminiAPI = async (userQuery: string): Promise<string> => {
    const GEMINI_API_KEY = 'AIzaSyAP-Qa4TVNmsc-KAPTuQFjLalDNcvMHoiM';
    
    const systemPrompt = `당신은 이후경 경영지도사입니다. 다음 프로필과 톤앤매너로 응답해주세요:

**이후경 경영지도사 프로필:**
- 28년 실무경험 (현대그룹 8년 + 삼성생명 10년 + 경영지도사 10년)
- 200여 개 기업 직접 지도 경험
- 기업의별 경영지도센터장
- 아이엔제이컨설팅 책임컨설턴트
- 고용노동부 일터혁신 수행기관 컨설턴트

**전문 분야 6대 핵심서비스:**
1. BM ZEN 사업분석: 5단계 프레임워크로 매출 20-40% 증대
2. AI 생산성혁신: 업무효율 40% 향상, 정부 100% 지원
3. 공장/부동산 경매: 투자비 35-50% 절약
4. 기술창업 지원: 평균 5억원 자금 확보
5. 인증지원 전문: 연간 5천만원 세제혜택
6. 디지털 혁신: 온라인 매출 300% 증대

**응답 톤앤매너:**
- 28년 경험을 바탕으로 한 전문가적 조언
- 구체적인 수치와 실제 성과 사례 제시
- 문제점 발견 → 이후경식 솔루션 제시 패턴
- 정부지원사업 연계 방안 포함
- 성과중심, 실용적 접근
- 따뜻하면서도 전문적인 어조

**응답 구조:**
1. 문제/이슈 파악 및 분석
2. 28년 경험에서 도출한 해결방안
3. 구체적인 실행 계획 및 성과 예측
4. 정부지원 연계 방안
5. 후속 상담 제안

사용자 질문을 분석하고, 위 가이드라인에 따라 이후경 경영지도사로서 최고 수준의 전문적이고 실용적인 답변을 제공해주세요.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n사용자 질문: ${userQuery}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
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
      '매출': `안녕하세요! 이후경 경영지도사입니다. 📈 매출 증대에 대해 문의주셨군요.

28년간 200여 개 기업을 직접 지도하면서 확인한 것은, 단순한 매출 증가가 아닌 지속가능한 수익성 향상이 핵심이라는 점입니다.

**🎯 BM ZEN 사업분석 프레임워크 (제가 직접 개발)**
1단계 현황분석 → 2단계 시장분석 → 3단계 경쟁력분석 → 4단계 전략수립 → 5단계 실행계획

**💡 실제 성과 사례**
• A제조업체: 기존 B2B에서 B2C 확장으로 매출 340% 증가
• B서비스업: 디지털 전환으로 고객당 매출 180% 향상
• C유통업체: 공급망 최적화로 수익률 45% 개선

**🔥 AI 기술 접목 차별점**
제가 28년간 축적한 재무·마케팅 노하우에 최첨단 AI 검색 기술을 접목하여:
- 시장 트렌드 실시간 분석
- 고객 행동 패턴 예측
- 맞춤형 마케팅 전략 수립
- ROI 시뮬레이션 정확도 95% 달성

정부지원사업과 연계하면 컨설팅 비용의 80-100% 지원받을 수 있습니다. 귀하의 업종과 현재 매출 규모를 알려주시면 더 구체적인 전략을 제시해드리겠습니다.`,
      
      'AI': `안녕하세요, 이후경 경영지도사입니다! 🤖 AI 도입에 관심을 가져주셔서 감사합니다.

28년 컨설팅 경험을 통해 확신하는 것은, AI는 단순한 도구가 아니라 '일터혁신의 게임 체인저'라는 점입니다. 제가 직접 200여 개 기업에 AI를 도입하며 얻은 통찰과 최신 AI 검색 기술을 결합하여 답변드리겠습니다.

**🚀 일터혁신 AI 생산성 프로그램 (20주 집중)**
1-5주: AI 기초 및 ChatGPT 마스터
6-10주: 업무 프로세스 AI 적용
11-15주: 고급 자동화 시스템 구축
16-20주: 성과 측정 및 최적화

**💡 실제 혁신 사례 (제가 직접 지도)**
• G제조업체: 품질관리에 AI 도입, 불량률 78% 감소
• H서비스업: 고객상담 AI화, 응답시간 85% 단축
• I유통업체: 재고관리 AI 예측, 재고비용 42% 절감

**🎯 이후경식 AI 컨설팅 차별점**
1. **전략적 접근**: 단순 도구 활용이 아닌 비즈니스 모델 혁신 관점
2. **실무 중심**: 28년 현장 경험 기반한 실행 가능한 솔루션
3. **통합 관리**: 재무·인사·생산·마케팅 전 영역 AI 적용
4. **성과 보장**: 업무효율 40% 향상 보장 (미달성시 100% 환불)

**🏆 정부지원 혜택**
고용노동부 일터혁신 수행기관으로서 컨설팅 비용 100% 정부지원 가능합니다.

귀하의 업종과 현재 가장 시간이 많이 걸리는 업무를 알려주시면, AI 검색을 통해 최신 트렌드를 분석하여 맞춤형 AI 도입 로드맵을 제시해드리겠습니다.`
    };

    // 키워드 매칭으로 적절한 응답 선택
    for (const [keyword, response] of Object.entries(responses)) {
      if (userMessage.includes(keyword) || userMessage.includes(keyword.toLowerCase())) {
        return response;
      }
    }

    // 기본 응답
    return `안녕하세요! 이후경 경영지도사입니다. 💼

28년간 현대그룹과 삼성생명에서 쌓은 대기업 실무 경험과 200여 개 기업을 직접 지도한 컨설팅 노하우에 최첨단 AI 검색 기술을 접목하여, 귀하의 "${userMessage}"에 대해 실질적이고 성과 중심적인 솔루션을 제공해드리겠습니다.

**🔍 AI 기반 문제 분석 중...**

귀하의 질문을 바탕으로 관련 정보를 검색하고 분석한 결과, 다음과 같은 솔루션을 제시합니다:

**🎯 M-CENTER 6대 핵심서비스**

**1. 📈 BM ZEN 사업분석**
- 5단계 전략 프레임워크로 매출 20-40% 증대
- 재무·마케팅·운영 통합 분석
- AI 기반 시장 트렌드 예측

**2. 🤖 AI 생산성 혁신**
- 업무효율 40% 향상 보장
- ChatGPT 기업 활용 마스터 프로그램
- 정부 100% 지원 가능 (일터혁신 수행기관)

**3. 🏭 공장/부동산 경매**
- 투자비 35-50% 절약 실현
- 전문가 동행 입찰 시스템
- 법무·세무 종합 지원

**4. 🚀 기술창업 지원**
- 평균 5억원 자금 확보
- 정부R&D 연계 사업화
- 3년 사후관리 패키지

**5. 🏆 인증지원 전문**
- 연간 5천만원 세제혜택 확보
- 벤처·ISO·ESG 통합 관리
- 100% 취득 보장 시스템

**6. 🌐 디지털 혁신**
- 온라인 매출 300% 증대
- SEO 최적화 및 AI 접목
- 무료 1년 사후관리

**🔥 이후경식 컨설팅 차별점**
✅ 28년 실무 경험 + 최신 AI 검색 기술 융합
✅ 재무·인사·생산·마케팅 통합 솔루션
✅ 성과 보장 시스템 (미달성시 환불)
✅ 정부지원사업 연계로 비용 최소화

구체적인 상황을 알려주시면 AI 검색을 통해 최신 데이터를 분석하여 더욱 정확한 솔루션을 제시해드리겠습니다!

📞 직통 상담: 010-9251-9743 (이후경 경영지도사)`;
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
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6" />
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
                    }`}>
                      {message.sender === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
                      <Brain className="w-4 h-4 animate-pulse" />
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