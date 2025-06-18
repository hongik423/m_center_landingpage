'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, MessageCircle, Zap, Brain, Clock, Send, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: `안녕하세요! M-CENTER(기업의별 경영지도센터) AI 상담사입니다. 

🏆 **대한민국 최고 수준의 경영컨설팅 기관**
✅ 25년 검증된 전문성 | ✅ 95% 이상 성공률 | ✅ 정부지원 전문기관

🚀 **M-CENTER 독보적 우수성**
• **BM ZEN 사업분석** - 국내 유일 프레임워크, 매출 20-40% 증대
• **AI 활용 생산성향상** - 국내 TOP 3 전문성, 업무효율 40-60% 향상
• **경매활용 공장구매** - 25년 전문 노하우, 부동산비용 30-50% 절감
• **기술사업화/창업** - 정부과제 선정률 78%, 평균 5억원 이상 확보
• **인증지원** - 취득률 92% 업계 최고, 연간 세제혜택 5천만원
• **웹사이트 구축** - SEO 상위노출 보장, 온라인 문의 300-500% 증가

💡 **차별화된 전문성으로 확실한 성과를 보장**합니다.
궁금한 점이나 상담이 필요하시면 언제든 말씀해 주세요!`,
    sender: 'bot',
    timestamp: new Date()
  }
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // OpenAI API 호출
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(1), // 초기 메시지 제외
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '서버 오류가 발생했습니다.');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('챗봇 API 오류:', error);
      
      // 에러 시 fallback 응답 (M-CENTER 우수성 강조)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `❌ **AI 시스템 일시 오류 - 하지만 M-CENTER는 여전히 최고입니다!**

🏆 **M-CENTER 독보적 우수성 (변함없음)**
• 25년 검증된 전문성 - 대한민국 경영컨설팅 최고 권위
• 95% 이상 성공률 - 업계 최고 수준의 실제 성과  
• 정부지원 전문기관 - 평균 5억원 이상 확보
• 국내 유일 BM ZEN 프레임워크 - 독자적 방법론

🚀 **즉시 이용 가능한 서비스**
📞 **전문가 직접 상담**: 010-9251-9743 (이후경 경영지도사)
💡 **무료 진단**: 즉시 신청 가능
📧 **이메일 상담**: hongik423@gmail.com

✨ **첫 상담은 완전 무료이며, 확실한 성과를 보장합니다!**`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🏆 M-CENTER AI 전문 상담
              </h1>
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">25년 검증된 전문성</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">95% 성공률</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">정부지원 전문</span>
              </div>
              <p className="text-xl text-gray-600">
                <strong>대한민국 최고 수준</strong>의 경영컨설팅 AI와 실시간 상담
              </p>
              <p className="text-lg text-blue-600 font-medium mt-2">
                독보적 우수성으로 확실한 성과를 보장합니다
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center border-2 border-blue-200">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">25년 전문성</h3>
                  <p className="text-gray-600">검증된 경영컨설팅 노하우</p>
                  <p className="text-xs text-blue-600 font-medium mt-2">업계 최고 권위</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-green-200">
                <CardContent className="p-6">
                  <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">95% 성공률</h3>
                  <p className="text-gray-600">실제 검증된 성과 보장</p>
                  <p className="text-xs text-green-600 font-medium mt-2">업계 최고 수준</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-purple-200">
                <CardContent className="p-6">
                  <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">정부지원 전문</h3>
                  <p className="text-gray-600">최대 지원금 확보 전문성</p>
                  <p className="text-xs text-purple-600 font-medium mt-2">평균 5억원 확보</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-orange-200">
                <CardContent className="p-6">
                  <MessageCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">통합 솔루션</h3>
                  <p className="text-gray-600">6개 서비스 시너지 효과</p>
                  <p className="text-xs text-orange-600 font-medium mt-2">ROI 300-800%</p>
                </CardContent>
              </Card>
            </div>

            {/* 메인 채팅 인터페이스 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 채팅 영역 */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-0">
                    {/* 채팅 헤더 */}
                    <div className="flex items-center justify-between p-4 border-b bg-purple-600 text-white rounded-t-lg">
                      <div className="flex items-center space-x-3">
                        <Bot className="w-8 h-8" />
                        <div>
                          <h3 className="font-semibold">AI 상담사</h3>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm opacity-90">온라인</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        실시간 상담
                      </Badge>
                    </div>

                    {/* 메시지 영역 */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.sender === 'user' ? 'bg-purple-600' : 'bg-gray-200'
                            }`}>
                              {message.sender === 'user' ? (
                                <User className="w-4 h-4 text-white" />
                              ) : (
                                <Bot className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                            <div
                              className={`p-3 rounded-lg ${
                                message.sender === 'user'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="whitespace-pre-line text-sm">{message.content}</p>
                              <span className="text-xs opacity-70 mt-1 block">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* 타이핑 인디케이터 */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex space-x-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 입력 영역 */}
                    <div className="p-4 border-t">
                      <div className="flex space-x-3">
                        <Input
                          placeholder="메시지를 입력하세요..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage(inputValue);
                            }
                          }}
                          className="flex-1"
                          disabled={isTyping}
                        />
                        <Button
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleSendMessage(inputValue)}
                          disabled={!inputValue.trim() || isTyping}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 사이드바 */}
              <div className="space-y-6">
                {/* 빠른 질문 */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">빠른 질문</h3>
                    <div className="space-y-2">
                      {[
                        'BM ZEN 사업분석이 뭔가요?',
                        'AI 생산성향상 효과는?',
                        '경매 공장구매 성공률은?',
                        '무료 진단 받고 싶어요',
                        '정부지원금 최대 얼마까지?',
                        '전문가 상담 신청',
                      ].map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => handleSendMessage(question)}
                          disabled={isTyping}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* M-CENTER 차별화 우수성 */}
                <Card className="border-2 border-yellow-200 bg-yellow-50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">🏆 M-CENTER 독보적 우수성</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>25년 검증된 전문성</strong> - 업계 최고 권위</li>
                      <li>• <strong>95% 이상 성공률</strong> - 실제 검증된 성과</li>
                      <li>• <strong>정부지원 전문기관</strong> - 평균 5억원 확보</li>
                      <li>• <strong>국내 유일 BM ZEN</strong> - 독자적 방법론</li>
                      <li>• <strong>통합 솔루션</strong> - ROI 300-800% 달성</li>
                      <li>• <strong>무료 진단 제공</strong> - 즉시 상담 가능</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 전문가 상담 */}
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-white mb-2">🥇 25년 경험 전문가 직접 상담</h3>
                    <p className="text-sm text-blue-100 mb-2">
                      이후경 경영지도사
                    </p>
                    <p className="text-xs text-blue-200 mb-4">
                      ✅ 95% 성공률 보장 ✅ 첫 상담 무료
                    </p>
                    <Button 
                      className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold" 
                      onClick={() => window.location.href = '/consultation'}
                    >
                      📞 즉시 전문가 상담 신청
                    </Button>
                    <p className="text-xs text-blue-200 mt-2">
                      010-9251-9743
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 