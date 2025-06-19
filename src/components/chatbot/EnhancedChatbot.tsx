'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  MessageCircle, 
  Send, 
  User, 
  Zap, 
  Brain, 
  Clock, 
  Phone, 
  Mail,
  Star,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Target,
  Award,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Building2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action' | 'analysis';
  metadata?: {
    confidence?: number;
    services?: string[];
    intent?: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    userRating?: 'positive' | 'negative';
  };
}

interface ChatbotProps {
  className?: string;
  embedded?: boolean;
}

// 🎯 빠른 응답 버튼
const QUICK_RESPONSES = [
  {
    text: "M-CENTER는 어떤 회사인가요?",
    icon: <Building2 className="w-4 h-4" />,
    category: "company"
  },
  {
    text: "무료 진단을 받고 싶어요",
    icon: <CheckCircle className="w-4 h-4" />,
    category: "service"
  },
  {
    text: "BM ZEN이 뭔가요?",
    icon: <Target className="w-4 h-4" />,
    category: "service"
  },
  {
    text: "AI 도입 효과는?",
    icon: <Brain className="w-4 h-4" />,
    category: "service"
  },
  {
    text: "비용이 궁금해요",
    icon: <Badge className="w-4 h-4" />,
    category: "cost"
  },
  {
    text: "전문가 상담 신청",
    icon: <Phone className="w-4 h-4" />,
    category: "contact"
  }
];

// 🚀 서비스 제안 버튼
const SERVICE_SUGGESTIONS = [
  {
    name: "BM ZEN 사업분석",
    description: "매출 20-40% 증대",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-blue-500"
  },
  {
    name: "AI 생산성향상", 
    description: "업무효율 40-60% 향상",
    icon: <Brain className="w-5 h-5" />,
    color: "bg-purple-500"
  },
  {
    name: "경매활용 공장구매",
    description: "부동산비용 30-50% 절감", 
    icon: <Target className="w-5 h-5" />,
    color: "bg-green-500"
  }
];

export default function EnhancedChatbot({ className = "", embedded = false }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connected');
  const [showQuickResponses, setShowQuickResponses] = useState(true);
  const [chatSession, setChatSession] = useState({
    id: generateSessionId(),
    startTime: new Date(),
    messageCount: 0,
    userSatisfaction: null as number | null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speechRecognition = useRef<any>(null);

  // 🎤 음성 인식 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      speechRecognition.current = new (window as any).webkitSpeechRecognition();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
      speechRecognition.current.lang = 'ko-KR';
      
      speechRecognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      speechRecognition.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "음성 인식 오류",
          description: "음성 인식 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      };
    }
  }, []);

  // 🎵 텍스트 읽기 기능
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  // 📝 초기 웰컴 메시지
  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateMessageId(),
      content: `안녕하세요! 🤖 M-CENTER AI 상담사입니다.

🏆 **대한민국 최고 수준의 경영컨설팅 전문기관**
✅ 25년 검증된 전문성 | ✅ 95% 이상 성공률 | ✅ 정부지원 전문기관

🎯 **M-CENTER 독보적 우수성**
• **BM ZEN 사업분석** - 국내 유일 프레임워크, 매출 20-40% 증대
• **AI 활용 생산성향상** - 국내 TOP 3 전문성, 업무효율 40-60% 향상
• **경매활용 공장구매** - 25년 전문 노하우, 부동산비용 30-50% 절감

💡 **확실한 성과를 보장**하는 차별화된 전문성으로 도움드리겠습니다!
궁금한 점이나 상담이 필요하시면 언제든 말씀해 주세요! 😊`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      metadata: {
        confidence: 100,
        intent: 'welcome',
        sentiment: 'positive'
      }
    };

    setMessages([welcomeMessage]);
  }, []);

  // 📜 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🤖 AI 메시지 전송
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    try {
      setConnectionStatus('connecting');
      setShowQuickResponses(false);
      
      const userMessage: Message = {
        id: generateMessageId(),
        content: text,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);
      
      setChatSession(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1
      }));

      // API 호출
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10),
          sessionId: chatSession.id
        }),
      });

      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: generateMessageId(),
        content: data.response,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          confidence: 95,
          services: data.services || [],
          intent: detectIntent(text),
          sentiment: 'positive'
        }
      };
      
      setMessages(prev => [...prev, botMessage]);
      setConnectionStatus('connected');
      
      // 자동 음성 읽기 (옵션)
      if (isSpeaking) {
        speakText(data.response);
      }
      
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      setConnectionStatus('error');
      
      const errorMessage: Message = {
        id: generateMessageId(),
        content: `죄송합니다. 일시적인 오류가 발생했습니다. 

📞 **즉시 전문가 상담 가능**
• 전화: 010-9251-9743 (이후경 경영지도사)
• 이메일: lhk@injc.kr

다시 질문해주시거나 위 연락처로 직접 상담받으세요! 🙏`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          confidence: 0,
          intent: 'error',
          sentiment: 'neutral'
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "연결 오류",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  // 🎤 음성 입력 시작
  const startListening = () => {
    if (speechRecognition.current) {
      setIsListening(true);
      speechRecognition.current.start();
    } else {
      toast({
        title: "음성 인식 미지원",
        description: "브라우저에서 음성 인식을 지원하지 않습니다.",
        variant: "destructive"
      });
    }
  };

  // 🔄 대화 초기화
  const resetChat = () => {
    setMessages([]);
    setShowQuickResponses(true);
    setChatSession({
      id: generateSessionId(),
      startTime: new Date(),
      messageCount: 0,
      userSatisfaction: null
    });
    
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: generateMessageId(),
        content: `새로운 상담을 시작합니다! 🚀

어떤 도움이 필요하신지 말씀해주세요.
M-CENTER의 25년 전문 노하우로 최고의 솔루션을 제공해드리겠습니다! ✨`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }, 500);
  };

  // 📋 메시지 복사
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "복사 완료",
      description: "메시지가 클립보드에 복사되었습니다.",
    });
  };

  // 👍 메시지 평가
  const rateMessage = (messageId: string, rating: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, metadata: { ...msg.metadata, userRating: rating } }
        : msg
    ));
    
    toast({
      title: rating === 'positive' ? "👍 긍정적 평가" : "👎 부정적 평가",
      description: "피드백 감사합니다. 서비스 개선에 반영하겠습니다.",
    });
  };

  return (
    <div className={`flex flex-col h-full max-w-4xl mx-auto ${className}`}>
      {/* 헤더 */}
      {!embedded && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">M-CENTER AI 상담사</h2>
                <p className="text-sm text-gray-600">25년 경험의 전문 경영컨설턴트</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge 
                  variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
                  className="animate-pulse"
                >
                  {connectionStatus === 'connected' ? '🟢 온라인' : 
                   connectionStatus === 'connecting' ? '🟡 연결중' : '🔴 오류'}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* 메인 채팅 영역 */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`p-4 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                    
                    {/* 메시지 메타데이터 */}
                    {message.metadata && message.sender === 'bot' && (
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {message.metadata.confidence && (
                            <Badge variant="secondary" className="text-xs">
                              신뢰도 {message.metadata.confidence}%
                            </Badge>
                          )}
                          {message.metadata.services && message.metadata.services.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              관련 서비스: {message.metadata.services.join(', ')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => rateMessage(message.id, 'positive')}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-green-600"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => rateMessage(message.id, 'negative')}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                    <span>{message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                    {message.sender === 'bot' && message.metadata?.intent && (
                      <Badge variant="secondary" className="text-xs">
                        {message.metadata.intent}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="ml-2 text-sm text-gray-500">답변 생성 중...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 빠른 응답 버튼 */}
          {showQuickResponses && messages.length <= 1 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">💬 빠른 질문</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {QUICK_RESPONSES.map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-3"
                    onClick={() => sendMessage(response.text)}
                  >
                    <div className="flex items-center gap-2">
                      {response.icon}
                      <span className="text-xs">{response.text}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 서비스 제안 */}
          {messages.length > 2 && messages.length % 4 === 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                추천 서비스
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SERVICE_SUGGESTIONS.map((service, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                       onClick={() => sendMessage(`${service.name}에 대해 자세히 알려주세요`)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${service.color} rounded-lg flex items-center justify-center`}>
                        {service.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{service.name}</div>
                        <div className="text-xs text-gray-600">{service.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-4" />

          {/* 입력 영역 */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                placeholder="M-CENTER AI 상담사에게 질문해보세요..."
                className="pr-12"
                disabled={isTyping || connectionStatus === 'error'}
              />
              
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={startListening}
                disabled={isListening || isTyping}
              >
                {isListening ? 
                  <MicOff className="w-4 h-4 text-red-500 animate-pulse" /> : 
                  <Mic className="w-4 h-4 text-gray-400" />
                }
              </Button>
            </div>
            
            <Button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping || connectionStatus === 'error'}
              className="px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetChat}
              className="px-3"
              title="대화 초기화"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {/* 상태 표시 */}
          {isListening && (
            <div className="mt-2 text-center">
              <Badge variant="secondary" className="animate-pulse">
                🎤 음성 인식 중... 말씀해주세요
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 하단 정보 */}
      {!embedded && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>메시지: {chatSession.messageCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>세션 시작: {chatSession.startTime.toLocaleTimeString('ko-KR')}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Phone className="w-3 h-3 mr-1" />
                  010-9251-9743
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Mail className="w-3 h-3 mr-1" />
                  lhk@injc.kr
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 🔧 유틸리티 함수들
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function detectIntent(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes('가격') || msg.includes('비용') || msg.includes('돈')) return 'pricing';
  if (msg.includes('상담') || msg.includes('문의') || msg.includes('신청')) return 'consultation';
  if (msg.includes('서비스') || msg.includes('도움')) return 'service_inquiry';
  if (msg.includes('bm zen') || msg.includes('사업분석')) return 'business_analysis';
  if (msg.includes('ai') || msg.includes('인공지능') || msg.includes('자동화')) return 'ai_productivity';
  if (msg.includes('경매') || msg.includes('공장') || msg.includes('부동산')) return 'factory_auction';
  if (msg.includes('인증') || msg.includes('iso')) return 'certification';
  if (msg.includes('웹사이트') || msg.includes('홈페이지')) return 'website';
  if (msg.includes('정부지원') || msg.includes('창업')) return 'government_support';
  
  return 'general';
} 