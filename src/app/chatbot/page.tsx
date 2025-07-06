'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { Send, Bot, User, Sparkles, Shield, Clock, Zap, Cpu, Star, Users, CheckCircle2, ArrowLeft, X } from 'lucide-react';
import { getImagePath } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 환영 메시지 추가
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `🎯 안녕하세요! **기업의별 M-CENTER** M센터장입니다!

28년간 500개 이상 기업의 성장을 함께해온 **이후경 경영지도사**를 대표하여 상담해드리겠습니다.

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

  const quickQuestions = [
    "우리 회사 매출을 늘리려면 어떻게 해야 하나요?",
    "AI 도입으로 업무 효율을 높이고 싶어요",
    "공장 구매를 저렴하게 하는 방법이 있나요?",
    "정부지원 사업은 어떤 것들이 있나요?",
    "ISO 인증 받으면 어떤 혜택이 있나요?",
    "웹사이트로 매출을 늘릴 수 있나요?"
  ];

  const services = [
    {
      title: '사업타당성분석',
      description: 'BM ZEN 프레임워크를 활용한 체계적인 사업 분석',
      icon: '📊',
      gradient: 'from-blue-500 to-purple-600',
      features: ['시장 분석', '수익성 검토', '리스크 평가']
    },
    {
      title: 'AI 생산성향상',
      description: 'ChatGPT와 AI 도구를 활용한 업무 효율성 극대화',
      icon: '🤖',
      gradient: 'from-purple-500 to-pink-600',
      features: ['AI 활용법 교육', '자동화 구축', '맞춤형 솔루션']
    },
    {
      title: '기술창업 지원',
      description: 'R&D 정부지원사업 연계 및 기술사업화 전문 컨설팅',
      icon: '🚀',
      gradient: 'from-green-500 to-emerald-600',
      features: ['정부과제 기획', '투자유치', '사업화 전략']
    },
    {
      title: '인증 지원',
      description: '벤처기업, ISO, ESG 등 각종 인증 취득 지원',
      icon: '🏆',
      gradient: 'from-yellow-500 to-orange-600',
      features: ['벤처인증', 'ISO 인증', 'ESG 경영']
    }
  ];

  return (
    <div className="min-h-screen gradient-bg-hero">
      <Header />
      
      {/* 모바일 뒤로가기 버튼 */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:bg-gray-100 transition-colors duration-200 touch-target"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">뒤로가기</span>
            </Button>
            <div className="text-sm text-gray-600">
              AI 상담사와 채팅
            </div>
          </div>
        </div>
      </div>
      
      {/* 헤더 섹션 - 토스 스타일 */}
      <section className="section-padding relative overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-48 h-48 bg-purple-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-green-400 rounded-full blur-xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            {/* AI 상담사 아바타 */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 
                            rounded-3xl mb-8 shadow-xl animate-bounce-gentle">
              <img 
                src={getImagePath('/star-counselor-icon.svg')}
                alt="별 AI 상담사" 
                className="w-12 h-12"
              />
            </div>
            
            <div className="badge-primary mb-6 animate-scale-in">
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="font-semibold">GEMINI AI 기반 스마트 상담</span>
            </div>
            
            <h1 className="text-hero text-gray-900 mb-6 animate-slide-in">
              <Sparkles className="inline-block w-16 h-16 mr-4 text-yellow-500" />
              M센터장과 채팅
            </h1>
            
            <p className="text-body-lg text-gray-600 max-w-4xl mx-auto leading-relaxed animate-slide-in mb-8"
               style={{ animationDelay: '0.2s' }}>
              <strong className="text-blue-600">GEMINI AI</strong> 기반의 전문 상담사가 24시간 대기 중입니다.<br />
              기업 성장에 관한 모든 궁금증을 바로 해결해보세요!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-in"
                 style={{ animationDelay: '0.4s' }}>
              {[
                { icon: Cpu, text: 'GEMINI AI', color: 'bg-blue-100 text-blue-600' },
                { icon: Shield, text: '24시간 상담', color: 'bg-green-100 text-green-600' },
                { icon: Users, text: '전문가 지원', color: 'bg-purple-100 text-purple-600' },
                { icon: Zap, text: '즉시 응답', color: 'bg-orange-100 text-orange-600' }
              ].map((item, index) => (
                <div key={index} className={`badge-primary ${item.color}`}>
                  <item.icon className="w-4 h-4 mr-2" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="pb-8">
        <div className="container-custom">
          {/* 채팅 영역 - 토스 스타일 */}
          <Card className="result-card shadow-2xl max-w-6xl mx-auto animate-scale-in"
                style={{ animationDelay: '0.6s' }}>
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-3xl">
              <CardTitle className="flex items-center gap-4 text-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl font-bold">M-CENTER AI 상담센터</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm bg-white/20 px-2 py-1 rounded-full">25년 전문 노하우</span>
                    <span className="text-sm bg-green-500 px-2 py-1 rounded-full">● 온라인</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            
            {/* 메시지 영역 */}
            <CardContent className="p-0">
              <div className="h-[600px] overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-start gap-4 max-w-[85%]">
                      {message.sender === 'bot' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl 
                                        flex items-center justify-center shadow-lg flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`p-4 rounded-3xl shadow-sm transition-all duration-200 hover:shadow-md ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                        <div className={`text-xs mt-3 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl 
                                        flex items-center justify-center shadow-lg flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl 
                                      flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-200">
                        <div className="flex space-x-2">
                          {[0, 1, 2].map((index) => (
                            <div key={index} 
                                 className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                                 style={{ animationDelay: `${index * 0.1}s` }}>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 - 토스 스타일 */}
              <div className="p-6 bg-white border-t border-gray-100 rounded-b-3xl">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="메시지를 입력하세요... (예: 우리 회사 매출을 늘리려면?)"
                    className="form-input flex-1 text-base py-4 px-6 rounded-2xl border-2 border-gray-200 
                              focus:border-blue-400 focus:bg-blue-50 transition-all duration-200"
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
                    className="btn-primary bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                              px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    title="메시지 전송"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>24시간</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>무료</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>즉시 응답</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                    💡 **팁**: "매출 증대", "AI 활용", "기술창업" 등에 대해 물어보세요!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 빠른 질문 버튼들 - 토스 스타일 */}
          <div className="mt-12 text-center animate-slide-in" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-h3 text-gray-900 mb-6">💬 빠른 질문 예시</h3>
            <p className="text-gray-600 mb-6">클릭하면 자동으로 입력되어 상담을 시작할 수 있습니다</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => setInputValue(question)}
                  className="p-4 h-auto text-left hover:bg-blue-50 hover:border-blue-300 
                            transition-all duration-200 rounded-xl border-2 border-gray-200 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 
                                    group-hover:bg-blue-200 transition-colors duration-200">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 group-hover:text-blue-700 leading-relaxed">
                      {question}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* AI 상담사 특징 - 토스 스타일 */}
          <div className="mt-16 animate-slide-in" style={{ animationDelay: '1s' }}>
            <Card className="result-card">
              <CardContent className="p-10">
                <h3 className="text-h2 text-center text-gray-900 mb-8">
                  <Cpu className="inline-block w-8 h-8 mr-3 text-blue-600" />
                  AI 상담사의 전문 분야
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map((service, index) => (
                    <div key={index} className={`${service.gradient} p-6 rounded-3xl hover:shadow-lg transition-all duration-300 group`}>
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <h4 className="text-h4 text-gray-900 mb-4">{service.title}</h4>
                      <div className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 