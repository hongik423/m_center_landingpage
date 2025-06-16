'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  X, 
  Send, 
  MessageCircle,
  Phone,
  Calendar,
  FileText,
  HelpCircle
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const quickReplies = [
  { text: '서비스 문의', icon: HelpCircle },
  { text: '상담 신청', icon: Phone },
  { text: '진단하기', icon: FileText },
  { text: '일정 확인', icon: Calendar }
];

const initialMessages: Message[] = [
  {
    id: '1',
    content: '안녕하세요! 기업의별 경영지도센터 AI 상담사입니다. 어떤 도움이 필요하신가요?',
    sender: 'bot',
    timestamp: new Date()
  }
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
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

    // 간단한 자동 응답 시뮬레이션
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('상담') || input.includes('문의')) {
      return '상담 신청을 도와드리겠습니다. 전문가와 상담하시겠습니까? "상담 신청"을 클릭하시면 바로 예약 페이지로 이동합니다.';
    } else if (input.includes('진단')) {
      return 'AI 활용, 공장구매, 기술창업, 인증지원, 웹사이트 구축 중 어떤 분야의 진단을 원하시나요? 각 진단은 약 15분 정도 소요됩니다.';
    } else if (input.includes('서비스')) {
      return '저희는 5대 핵심 서비스를 제공합니다:\n\n• AI 활용 생산성향상 (업무 효율성 40% 향상)\n• 경매활용 공장구매 (투자비 40% 절약)\n• 기술사업화/기술창업 (평균 5억원 확보)\n• 인증지원 (연간 5천만원 세제혜택)\n• 웹사이트 구축 (매출 30% 증대)\n\n어느 서비스에 관심이 있으신가요?';
    } else if (input.includes('비용') || input.includes('가격')) {
      return '대부분의 서비스는 정부 지원을 통해 무료 또는 저렴한 비용으로 이용 가능합니다. 먼저 무료 진단을 받아보시고 맞춤형 견적을 확인해보세요.';
    } else if (input.includes('기업의별')) {
      return '기업의별 경영지도센터는 Business Model Zen 프레임워크를 기반으로 기업 성장의 5단계를 지원하는 전문 컨설팅 기업입니다. 어떤 서비스에 관심이 있으신가요?';
    } else {
      return '더 자세한 내용은 전문가와 상담을 통해 안내드릴 수 있습니다. 무료 상담 신청하시겠습니까?';
    }
  };

  const handleQuickReply = (text: string) => {
    if (text === '상담 신청') {
      window.location.href = '/consultation';
    } else if (text === '진단하기') {
      window.location.href = '/diagnosis';
    } else {
      handleSendMessage(text);
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg animate-pulse-slow lg:bottom-8 lg:right-8"
          size="icon"
        >
          <Bot className="w-6 h-6 text-white" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs">
            1
          </Badge>
        </Button>
      )}

      {/* 채팅 윈도우 */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 h-96 flex flex-col shadow-2xl lg:bottom-8 lg:right-8 lg:w-96 lg:h-[500px]">
          {/* 헤더 */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-purple-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-sm font-medium">AI 상담사</CardTitle>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-purple-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          {/* 메시지 영역 */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* 빠른 답변 버튼 */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="grid grid-cols-2 gap-2">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => handleQuickReply(reply.text)}
                  >
                    <reply.icon className="w-3 h-3 mr-1" />
                    {reply.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 입력 영역 */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
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
              />
              <Button
                size="icon"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
} 