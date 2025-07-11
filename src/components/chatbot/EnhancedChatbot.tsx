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
  Cpu, 
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
  Building2,
  Users,
  Globe
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getImagePath, getLogoPath } from '@/lib/utils';

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
    answerLevel?: 1 | 2 | 3 | 4 | 5;
    answerDescription?: string;
  };
}

interface ChatbotProps {
  className?: string;
  embedded?: boolean;
}

// 🎯 5단계 답변 시스템 테스트용 빠른 응답 버튼
const QUICK_RESPONSES = [
  {
    text: "안녕하세요", // 1단계 테스트
    icon: <Target className="w-4 h-4" />,
    category: "level1",
    expectedLevel: 1
  },
  {
    text: "AI 생산성 향상이 뭔가요?", // 2단계 테스트
    icon: <Cpu className="w-4 h-4" />,
    category: "level2",
    expectedLevel: 2
  },
  {
    text: "사업분석과 정책자금 지원을 자세히 알려주세요", // 3단계 테스트
    icon: <CheckCircle className="w-4 h-4" />,
    category: "level3",
    expectedLevel: 3
  },
  {
    text: "사업분석, AI생산성, 정책자금 서비스 비교해서 로드맵 알려주세요", // 4단계 테스트
    icon: <TrendingUp className="w-4 h-4" />,
    category: "level4",
    expectedLevel: 4
  },
  {
    text: "전체 서비스 통합 분석과 종합적인 실행 계획을 구체적으로 상세히 알려주세요", // 5단계 테스트
    icon: <Zap className="w-4 h-4" />,
    category: "level5",
    expectedLevel: 5
  },
  {
    text: "무료진단",
    icon: <Star className="w-4 h-4" />,
    category: "diagnosis"
  },
  {
    text: "상담신청",
    icon: <Phone className="w-4 h-4" />,
    category: "contact"
  },
  {
    text: "성공사례 보기",
    icon: <Award className="w-4 h-4" />,
    category: "success"
  }
];

// 🚀 서비스 제안 버튼 (5단계 업그레이드 버전)
const SERVICE_SUGGESTIONS = [
  {
    name: "1-2단계: 진단 & 솔루션 매칭",
    description: "현황 분석 → 맞춤 솔루션 제시",
    icon: <Target className="w-5 h-5" />,
    color: "bg-blue-500"
  },
  {
    name: "3-4단계: 타당성 검토 & 실행 계획", 
    description: "투자분석 → 체계적 실행 방안",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-purple-500"
  },
  {
    name: "5단계: 성과 모니터링",
    description: "실행 지원 → 지속 개선", 
    icon: <Lightbulb className="w-5 h-5" />,
    color: "bg-green-500"
  },
  {
    name: "검증된 성과 보장",
    description: "생산성 42% 향상 실제 증명",
    icon: <Award className="w-5 h-5" />,
    color: "bg-orange-500"
  }
];

// 🎯 5단계 답변 시스템 구현
interface AnswerLevel {
  level: 1 | 2 | 3 | 4 | 5;
  maxLength: number;
  description: string;
  serviceAreas: string[];
}

// 🔍 질문 복잡도 분석 함수
function analyzeQuestionComplexity(question: string): AnswerLevel {
  const q = question.toLowerCase();
  
  // 서비스 영역 키워드 매핑
  const serviceKeywords = {
    '사업분석': ['사업', 'bm zen', '분석', '컨설팅', '진단', '전략'],
    'AI생산성': ['ai', '인공지능', '자동화', '생산성', '효율', '혁신'],
    '정책자금': ['정책', '자금', '대출', '지원금', '융자', '투자'],
    '기술창업': ['창업', '기술', '벤처', '스타트업', '사업화'],
    '인증지원': ['인증', 'iso', 'esg', '벤처인증', '품질'],
    '웹사이트': ['웹사이트', '홈페이지', '온라인', '마케팅', '웹']
  };

  // 매치된 서비스 영역 계산
  const matchedServices: string[] = [];
  Object.entries(serviceKeywords).forEach(([service, keywords]) => {
    if (keywords.some(keyword => q.includes(keyword))) {
      matchedServices.push(service);
    }
  });

  // 복잡도 키워드 체크
  const complexityIndicators = {
    simple: ['안녕', '반가', '안녕하세요', '하이', '헬로', '좋은 아침', '좋은 오후', '감사', '고마워'],
    detailed: ['자세히', '상세히', '구체적으로', '어떻게', '방법', '과정', '절차'],
    comprehensive: ['전체', '모든', '통합', '종합', '완전한', '포괄적'],
    comparison: ['비교', '차이', '장단점', '어떤게', '추천'],
    planning: ['계획', '로드맵', '단계별', '순서', '일정', '스케줄']
  };

  const simpleCount = complexityIndicators.simple.filter(word => q.includes(word)).length;
  const detailedCount = complexityIndicators.detailed.filter(word => q.includes(word)).length;
  const comprehensiveCount = complexityIndicators.comprehensive.filter(word => q.includes(word)).length;
  const comparisonCount = complexityIndicators.comparison.filter(word => q.includes(word)).length;
  const planningCount = complexityIndicators.planning.filter(word => q.includes(word)).length;

  // 질문 길이도 고려
  const questionLength = question.length;

  // 5단계 결정 로직
  if (simpleCount > 0 && matchedServices.length === 0 && questionLength < 20) {
    return {
      level: 1,
      maxLength: 500,
      description: "간단한 인사 및 기본 응답",
      serviceAreas: []
    };
  }

  if (matchedServices.length === 1 && detailedCount === 0 && comprehensiveCount === 0) {
    return {
      level: 2,
      maxLength: 1000,
      description: "단일 서비스 영역 기본 설명",
      serviceAreas: matchedServices
    };
  }

  if (matchedServices.length === 2 || (matchedServices.length === 1 && detailedCount > 0)) {
    return {
      level: 3,
      maxLength: 1500,
      description: "2개 서비스 영역 또는 상세 설명",
      serviceAreas: matchedServices
    };
  }

  if (matchedServices.length >= 3 || comparisonCount > 0 || (matchedServices.length >= 1 && planningCount > 0)) {
    return {
      level: 4,
      maxLength: 2000,
      description: "3개 이상 서비스 영역 또는 비교 분석",
      serviceAreas: matchedServices
    };
  }

  // 최고 난이도: 복합적 질문
  if (comprehensiveCount > 0 || questionLength > 50 || (detailedCount > 0 && planningCount > 0)) {
    return {
      level: 5,
      maxLength: 4000,
      description: "복합적 고도 분석 및 종합 답변",
      serviceAreas: matchedServices.length > 0 ? matchedServices : ['종합상담']
    };
  }

  // 기본값: 2단계
  return {
    level: 2,
    maxLength: 1000,
    description: "일반적인 질문 답변",
    serviceAreas: matchedServices.length > 0 ? matchedServices : ['일반상담']
  };
}

// 🎨 각 단계별 답변 템플릿 생성 함수
function generateAnswerByLevel(level: AnswerLevel, originalResponse: string, question: string): string {
  const baseResponse = originalResponse;
  
  // 공통 CTA 버튼 (모든 답변에 포함)
  const ctaButtons = `

🎯 **다음 단계 진행**
- 무료진단: 기업 현황을 정확히 분석해드립니다
- 상담신청: 전문가와 직접 상담받으세요

📞 **즉시 상담 가능**
- 전화: 010-9251-9743 (이후경 경영지도사)
- 이메일: hongik423@gmail.com`;

  switch (level.level) {
    case 1: // 간단한 인사 등 (500자 미만)
      return `안녕하세요! M-CENTER AI 전문상담사입니다! 👋

28년 경험의 이후경 M센터장과 함께 기업 성장을 도와드리고 있어요.

무엇을 도와드릴까요? 편하게 질문해주세요!

✨ **주요 서비스**
- 사업분석 컨설팅
- AI 생산성 향상  
- 정책자금 지원
- 기술창업 지원
- 인증지원 서비스
- 웹사이트 구축${ctaButtons}`;

    case 2: // 단일 서비스 영역 (1000자 미만)
      const truncatedResponse2 = baseResponse.length > 800 ? baseResponse.substring(0, 800) + "..." : baseResponse;
      return `${truncatedResponse2}

🎯 **${level.serviceAreas.join(', ')} 전문 서비스**

실제 검증된 성과:
- 생산성 42% 향상 달성
- 품질 불량률 78% 감소  
- 6개월 ROI 290% 달성

더 자세한 내용이 필요하시면 언제든 말씀해주세요!${ctaButtons}`;

    case 3: // 2개 서비스 영역 (1500자 미만)
      const truncatedResponse3 = baseResponse.length > 1200 ? baseResponse.substring(0, 1200) + "..." : baseResponse;
      return `${truncatedResponse3}

🔄 **연계 서비스 시너지**

${level.serviceAreas.join(' + ')} 통합 솔루션으로 더 큰 성과를 만들어드립니다.

✅ **통합 서비스 혜택**
- 30% 할인 혜택
- 우선 심사 지원
- 전담 매니저 배정
- 성과 보장 시스템

🚀 **실제 고객사 성과**
한국정밀기계: 생산성 42% 향상, 품질 불량률 78% 감소

각 서비스별 더 상세한 설명이 필요하시면 말씀해주세요!${ctaButtons}`;

    case 4: // 3개 이상 서비스 영역 (2000자 미만)
      const truncatedResponse4 = baseResponse.length > 1500 ? baseResponse.substring(0, 1500) + "..." : baseResponse;
      return `${truncatedResponse4}

🎯 **종합 솔루션 로드맵**

${level.serviceAreas.join(' → ')} 단계별 실행 계획

【1단계】 현황 진단 (1-2주)
- 기업 역량 분석
- 성장 가능성 평가
- 핵심 이슈 도출

【2단계】 솔루션 설계 (2-4주)
- 맞춤형 전략 수립
- 서비스 연계 방안
- 투자 계획 수립

【3단계】 실행 지원 (1-2개월)
- 단계별 실행 지원
- 정부지원 연계
- 성과 모니터링

🏆 **검증된 성과 사례**
- 한국정밀기계: 생산성 42% 향상
- 다수 고객사: 평균 투자 회수 기간 6개월

종합적인 실행 계획이 궁금하시면 상세 상담을 받아보세요!${ctaButtons}`;

    case 5: // 최고 난이도 복합 질문 (4000자 미만)
      return `${baseResponse}

🎯 **M-CENTER 종합 솔루션 체계**

28년 경험의 이후경 M센터장이 직접 설계한 통합 성장 시스템입니다.

🔥 **6대 핵심 서비스 통합 프레임워크**

【사업분석 컨설팅】
- BM ZEN 5단계 분석법
- 성공률 95% 검증된 방법론
- 세무사 신규사업 특화

【AI 생산성 향상】
- 20주 체계적 프로그램
- 업무 효율성 40% 향상
- 스마트 생산시스템 구축

【정책자금 지원】
- 평균 5억원 확보
- 투자분석 연계 서비스
- 95% 이상 선정 성공률

【기술창업 지원】
- 창업부터 성장까지
- 정부지원 프로그램 연계
- IP 개발 및 사업화

【인증지원 서비스】
- 벤처/ISO/ESG 인증
- 5천만원 세제혜택
- 기업 신뢰도 향상

【웹사이트 구축】
- 온라인 매출 300% 증대
- 디지털 마케팅 연계
- 브랜드 가치 제고

🚀 **실제 검증된 통합 성과**

한국정밀기계 통합 프로젝트:
✅ 생산성 42% 향상 (하루 100개 → 142개)
✅ 품질 불량률 78% 감소 (3.2% → 0.7%)
✅ 6개월 ROI 290% 달성
✅ 온라인 매출 300% 증대

🎯 **맞춤형 실행 로드맵**

【Phase 1】 종합 진단 (2-3주)
- 360도 기업 분석
- 성장 포텐셜 평가
- 우선순위 서비스 선정

【Phase 2】 통합 설계 (3-4주)
- 서비스 간 시너지 분석
- 투자 우선순위 결정
- 정부지원 연계 방안

【Phase 3】 순차 실행 (3-6개월)
- 고impact 서비스 우선
- 단계별 성과 측정
- 지속 개선 체계

【Phase 4】 성과 확산 (지속)
- 성공모델 정착
- 추가 성장 기회 발굴
- 장기 파트너십

💡 **차별화 포인트**

1. **검증된 방법론**: 28년 현장 경험 + 실제 성과 증명
2. **통합 서비스**: 6개 영역 시너지로 극대화된 효과
3. **성과 보장**: 단계별 성과 측정 및 개선 시스템
4. **전담 지원**: 프로젝트 매니저 + 분야별 전문가
5. **지속 관리**: 일회성이 아닌 지속적 성장 파트너

이 정도 수준의 종합적 분석과 솔루션이 필요하시다면, 직접 상담을 통해 더 구체적이고 맞춤화된 계획을 수립해드리겠습니다.${ctaButtons}`;

    default:
      return baseResponse + ctaButtons;
  }
}

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

  // 📝 초기 웰컴 메시지 (5단계 답변 시스템 소개)
  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateMessageId(),
      content: `🎯 M-CENTER 5단계 답변 시스템에 오신 것을 환영합니다!

저는 28년간 수많은 기업과 함께 성장해온 이후경 M센터장의 노하우를 바탕으로 질문의 복잡도에 따라 최적화된 답변을 제공하는 AI 전문상담사입니다.

🔥 혁신적인 5단계 답변 시스템

🟢 【1단계】 간단한 인사 및 기본 응답 (500자 미만)
- 간단한 인사말이나 기본적인 질문
- 빠르고 친근한 응답

🔵 【2단계】 단일 서비스 영역 설명 (1000자 미만)  
- 하나의 서비스에 대한 기본 설명
- 핵심 내용 위주의 명확한 답변

🟣 【3단계】 2개 서비스 영역 또는 상세 설명 (1500자 미만)
- 두 개 서비스 연계 또는 상세한 설명 요청
- 구체적인 방법론과 성과 제시

🟠 【4단계】 3개 이상 서비스 영역 또는 비교 분석 (2000자 미만)
- 복합 서비스 비교 분석 및 로드맵 제시
- 단계별 실행 계획 포함

🔴 【5단계】 복합적 고도 분석 및 종합 답변 (4000자 미만)
- 종합적이고 심층적인 분석 요청
- 전체 프레임워크와 상세 실행 계획

🚀 실제 검증된 성과

한국정밀기계 고객사 성공사례:
- 생산성 42% 향상 (하루 100개 → 142개 생산)
- 품질 불량률 78% 감소 (3.2% → 0.7%)
- 6개월 만에 ROI 290% 달성

💡 사용법: 질문의 복잡도와 필요한 정보의 깊이에 따라 자동으로 최적화된 답변을 받으실 수 있습니다.

아래 테스트 버튼을 클릭하거나 직접 질문해보세요!

🎯 **다음 단계 진행**
- 무료진단: 기업 현황을 정확히 분석해드립니다
- 상담신청: 전문가와 직접 상담받으세요

📞 **즉시 상담 가능**
- 전화: 010-9251-9743 (이후경 경영지도사)
- 이메일: hongik423@gmail.com`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      metadata: {
        confidence: 100,
        intent: 'welcome',
        sentiment: 'positive',
        answerLevel: 3,
        answerDescription: "5단계 시스템 소개 및 가이드"
      }
    };

    setMessages([welcomeMessage]);
  }, []);

  // 📜 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🤖 AI 메시지 전송 (5단계 시스템 적용)
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

      // 🎯 5단계 질문 복잡도 분석
      const answerLevel = analyzeQuestionComplexity(text);
      
      // API 호출
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10),
          sessionId: chatSession.id,
          answerLevel: answerLevel // 5단계 정보 전달
        }),
      });

      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }

      const data = await response.json();
      
      // 🎨 5단계 시스템에 맞는 답변 생성
      const processedResponse = generateAnswerByLevel(answerLevel, data.response, text);
      
      const botMessage: Message = {
        id: generateMessageId(),
        content: processedResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          confidence: 95,
          services: data.services || answerLevel.serviceAreas,
          intent: detectIntent(text),
          sentiment: 'positive',
          answerLevel: answerLevel.level,
          answerDescription: answerLevel.description
        }
      };
      
      setMessages(prev => [...prev, botMessage]);
      setConnectionStatus('connected');
      
      // 자동 음성 읽기 (옵션)
      if (isSpeaking) {
        speakText(processedResponse);
      }
      
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      setConnectionStatus('error');
      
      const errorMessage: Message = {
        id: generateMessageId(),
        content: `죄송합니다. 일시적으로 5단계 상담 시스템에 문제가 있어 답변을 드리지 못하고 있습니다.

이런 경우에는 직접 연락주시면 더 정확하고 빠르게 5단계 전문 상담을 받으실 수 있어요.

🎯 즉시 5단계 전문가 상담 가능합니다
- 전화: 010-9251-9743 (이후경 경영지도사)
- 이메일: hongik423@gmail.com

28년간의 경험과 체계적인 5단계 분석을 통해 고객님의 상황에 맞는 최적의 솔루션을 제안해드리겠습니다.

【1단계】 기업 현황 진단 → 【2단계】 솔루션 매칭 → 【3단계】 실행 가능성 검토 → 【4단계】 실행 계획 수립 → 【5단계】 성과 모니터링

🎯 **다음 단계 진행**
- 무료진단: 기업 현황을 정확히 분석해드립니다
- 상담신청: 전문가와 직접 상담받으세요

조금 있다가 다시 질문해보시거나, 위 연락처로 직접 상담받으세요!`,
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
        content: `🔄 새로운 5단계 상담을 시작합니다!

28년간의 경험으로 다양한 기업들과 함께 성장해온 노하우를 바탕으로 체계적인 5단계 분석을 통해 도움드리겠습니다.

🎯 5단계 체계적 상담 프로세스
【1단계】 기업 현황 진단 → 【2단계】 솔루션 매칭 → 【3단계】 실행 가능성 검토 → 【4단계】 실행 계획 수립 → 【5단계】 성과 모니터링

🚀 한국정밀기계 고객사와 함께 이뤄낸 실제 성과:
- 생산성 42% 향상 (하루 100개 → 142개 생산)
- 품질 불량률 78% 감소 (3.2% → 0.7%)
- 6개월 만에 ROI 290% 달성

어떤 것이든 편하게 말씀해주세요. 
5단계 체계적 분석을 통해 고객사의 상황에 맞는 최적의 솔루션을 정성껏 제안해드리겠습니다!`,
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
                <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ backgroundColor: '#4285F4' }}>
                  <img 
                    src={getImagePath('/star-counselor-icon.svg')} 
                    alt="전문상담사" 
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">M-CENTER 전문상담사</h2>
                  <p className="text-sm text-gray-600">⭐ 이후경 M센터장 28년 노하우</p>
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative" style={{ backgroundColor: '#4285F4' }}>
                    <img 
                      src={getImagePath('/star-counselor-icon.svg')} 
                      alt="전문상담사" 
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`p-4 rounded-lg ${
                      message.sender === 'user'
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    style={message.sender === 'user' ? { backgroundColor: '#4285F4' } : {}}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                    
                    {/* 메시지 메타데이터 */}
                    {message.metadata && message.sender === 'bot' && (
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {message.metadata.answerLevel && (
                            <Badge 
                              variant="default" 
                              className={`text-xs ${
                                message.metadata.answerLevel === 1 ? 'bg-green-500' :
                                message.metadata.answerLevel === 2 ? 'bg-blue-500' :
                                message.metadata.answerLevel === 3 ? 'bg-purple-500' :
                                message.metadata.answerLevel === 4 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                            >
                              {message.metadata.answerLevel}단계 답변
                            </Badge>
                          )}
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
                          {message.metadata.answerDescription && (
                            <Badge variant="outline" className="text-xs">
                              {message.metadata.answerDescription}
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4285F4' }}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center relative" style={{ backgroundColor: '#4285F4' }}>
                  <img 
                    src={getImagePath('/star-counselor-icon.svg')} 
                    alt="M센터장" 
                    className="w-8 h-8 rounded-full"
                  />
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
              <h4 className="text-sm font-semibold text-gray-700 mb-3">🎯 5단계 답변 시스템 테스트</h4>
              <p className="text-xs text-gray-600 mb-3">각 버튼을 클릭하여 답변 단계를 확인해보세요!</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {QUICK_RESPONSES.map((response, index) => {
                  // 단계별 색상 스타일 결정
                  const getButtonStyle = () => {
                    if (response.expectedLevel === 1) return "border-green-300 hover:bg-green-50 text-green-700";
                    if (response.expectedLevel === 2) return "border-blue-300 hover:bg-blue-50 text-blue-700";
                    if (response.expectedLevel === 3) return "border-purple-300 hover:bg-purple-50 text-purple-700";
                    if (response.expectedLevel === 4) return "border-orange-300 hover:bg-orange-50 text-orange-700";
                    if (response.expectedLevel === 5) return "border-red-300 hover:bg-red-50 text-red-700";
                    return "border-gray-300 hover:bg-gray-100 text-gray-700";
                  };

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={`justify-start text-left h-auto p-3 ${getButtonStyle()}`}
                      onClick={() => sendMessage(response.text)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {response.icon}
                        <div className="flex-1">
                          <span className="text-xs block">{response.text}</span>
                          {response.expectedLevel && (
                            <span className="text-xs opacity-60 block mt-1">
                              → {response.expectedLevel}단계 답변 예상
                            </span>
                          )}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <div className="flex flex-wrap gap-2">
                  <span className="text-green-600">🟢 1단계: 간단 인사</span>
                  <span className="text-blue-600">🔵 2단계: 단일 서비스</span>
                  <span className="text-purple-600">🟣 3단계: 2개 서비스</span>
                  <span className="text-orange-600">🟠 4단계: 3개+ 서비스</span>
                  <span className="text-red-600">🔴 5단계: 종합 분석</span>
                </div>
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
                  hongik423@gmail.com
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