'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, MessageCircle, Zap, Brain, Clock, Send, User } from 'lucide-react';
import { 
  safeGet, 
  validateApiResponse, 
  checkApiCompatibility,
  collectErrorInfo,
  getBrowserInfo 
} from '@/lib/utils/safeDataAccess';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: `안녕하세요! M-CENTER(기업의별 경영지도센터) 별-AI상담사입니다. 

🏆 **대한민국 최고 수준의 경영컨설팅 기관**
✅ 25년 검증된 전문성 | ✅ 95% 이상 성공률 | ✅ 정부지원 전문기관

🚀 **M-CENTER 독보적 우수성**
• **BM ZEN 사업분석** - 국내 유일 프레임워크, 매출 20-40% 증대
• **AI 활용 생산성향상** - 국내 TOP 3 전문성, 업무효율 40-60% 향상
• **경매활용 공장구매** - 25년 전문 노하우, 부동산비용 30-50% 절감
• **기술사업화/창업** - 정부과제 선정률 78%, 평균 5억원 이상 확보
• **인증지원** - 취득률 92% 업계 최고, 연간 세제혜택 5천만원
• **웹사이트 구축** - SEO 상위노출 보장, 온라인 문의 300-500% 증가
• **전문 세금계산기** - 11개 계산기 완비, 2024년 최신 세법 반영

💡 **차별화된 전문성으로 확실한 성과를 보장**합니다.
궁금한 점이나 상담이 필요하시면 언제든 말씀해 주세요!`,
    sender: 'bot',
    timestamp: new Date()
  }
];

// M-CENTER 서비스 정보
const MCENTER_SERVICES = {
  'business-analysis': {
    name: 'BM ZEN 사업분석',
    description: '국내 유일 비즈니스모델 전문 분석 프레임워크',
    benefits: ['매출 20-40% 증대', '수익구조 최적화', '시장경쟁력 강화']
  },
  'ai-productivity': {
    name: 'AI 활용 생산성향상',
    description: 'ChatGPT, Claude 등 AI 도구 활용 업무 자동화',
    benefits: ['업무효율 40-60% 향상', '인건비 절감', 'AI 전문 역량 확보']
  },
  'factory-auction': {
    name: '경매활용 공장구매',
    description: '25년 전문 노하우로 저렴한 공장부지 확보',
    benefits: ['부동산비용 30-50% 절감', '입지 조건 최적화', '투자 리스크 최소화']
  },
  'tech-startup': {
    name: '기술사업화/창업',
    description: '정부지원사업 선정 및 사업화 전 과정 지원',
    benefits: ['정부과제 선정률 78%', '평균 5억원 이상 확보', '사업화 성공률 85%']
  },
  'certification': {
    name: '인증지원',
    description: 'ISO, 벤처인증, 이노비즈 등 각종 인증 취득',
    benefits: ['취득률 92% 업계 최고', '연간 세제혜택 5천만원', '입찰 가점 확보']
  },
  'website': {
    name: '웹사이트 구축',
    description: 'SEO 최적화 및 온라인 마케팅 통합 솔루션',
    benefits: ['SEO 상위노출 보장', '온라인 문의 300-500% 증가', '브랜드 가치 상승']
  }
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connected');

  // 키워드 기반 응답 생성
  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // BM ZEN 관련 질문
    if (message.includes('bm zen') || message.includes('사업분석') || message.includes('비즈니스모델')) {
      return `🚀 **BM ZEN 사업분석 - M-CENTER 독점 프레임워크**

📊 **국내 유일한 비즈니스모델 전문 분석 시스템**
• 25년 컨설팅 노하우로 개발된 독자적 방법론
• 매출 20-40% 증대 실제 검증된 성과
• 수익구조 최적화 및 시장경쟁력 강화

✅ **BM ZEN 핵심 특징**
1. **Business Model Canvas 고도화** - 9개 핵심 요소 심층 분석
2. **수익모델 다각화** - 새로운 수익원 발굴 및 최적화
3. **시장분석 & 경쟁전략** - 데이터 기반 시장 진입 전략
4. **실행계획 수립** - 단계별 구체적 액션플랜 제시

💡 **실제 성과 사례**
• 제조업체 A사: 매출 35% 증가, 수익률 28% 개선
• 서비스업 B사: 신규 수익모델 개발로 연매출 15억 달성
• IT기업 C사: BM 최적화로 투자유치 30억원 성공

📞 **BM ZEN 무료 진단 신청**: 010-9251-9743
💻 **온라인 상담**: hongik423@gmail.com

**지금 신청하시면 첫 분석은 완전 무료입니다!**`;
    }
    
    // AI 생산성 관련 질문
    if (message.includes('ai') || message.includes('생산성') || message.includes('자동화') || message.includes('chatgpt')) {
      return `🤖 **AI 활용 생산성향상 - 국내 TOP 3 전문성**

🚀 **업무효율 40-60% 향상 보장**
• ChatGPT, Claude, Midjourney 등 AI 도구 전문 활용
• 업무 자동화 시스템 구축
• AI 도입 전략 수립 및 직원 교육

✅ **M-CENTER AI 전문성**
1. **문서 자동화** - 보고서, 제안서, 계약서 AI 생성
2. **고객응대 자동화** - 챗봇, 이메일 자동응답 시스템
3. **데이터 분석 자동화** - AI 기반 시장분석, 매출예측
4. **마케팅 자동화** - AI 콘텐츠 제작, SNS 관리

💡 **실제 도입 성과**
• 금융회사 D사: 문서작업 시간 60% 단축, 연간 인건비 2억 절감
• 제조업체 E사: 고객응대 자동화로 CS 효율 45% 향상
• 서비스업 F사: AI 마케팅으로 온라인 매출 250% 증가

🎯 **AI 도입 프로세스**
1. 현황 진단 및 AI 적용 분야 선정
2. 맞춤형 AI 솔루션 개발
3. 직원 교육 및 시스템 안착
4. 성과 측정 및 지속 개선

📞 **AI 무료 진단**: 010-9251-9743 (이후경 경영지도사)
**지금 문의하시면 AI 활용 가이드북을 무료로 드립니다!**`;
    }
    
    // 경매/공장 관련 질문
    if (message.includes('경매') || message.includes('공장') || message.includes('부동산') || message.includes('투자')) {
      return `🏭 **경매활용 공장구매 - 25년 전문 노하우**

💰 **부동산비용 30-50% 절감 보장**
• 25년간 200여 건 성공 경험
• 경매 전문 네트워크 및 정보력
• 리스크 제로 투자 전략 수립

✅ **M-CENTER 경매 전문성**
1. **물건 발굴** - 전국 우량 경매물건 선별
2. **가치 평가** - 정확한 시세 분석 및 투자 가치 산정
3. **법적 검토** - 권리분석, 명도 가능성 사전 검증
4. **사후 관리** - 명도, 등기, 시설 개선까지 원스톱

💡 **성공 사례**
• 제조업체 G사: 시가 대비 40% 저렴하게 공장 확보
• 물류업체 H사: 최적 입지 창고 30% 할인 매입
• 식품업체 I사: 경매를 통해 생산시설 확장비용 50% 절감

🎯 **경매 투자 프로세스**
1. **투자 목적 분석** - 사업 계획 및 입지 조건 검토
2. **물건 선별** - 수익성 높은 경매물건 발굴
3. **실사 및 평가** - 현장 조사 및 투자 가치 분석
4. **낙찰 지원** - 입찰 전략 수립 및 낙찰 지원
5. **사후 관리** - 명도, 인허가, 시설 개선 지원

📞 **경매 투자 상담**: 010-9251-9743
📧 **물건 정보 요청**: hongik423@gmail.com

**25년 노하우로 안전하고 수익성 높은 투자를 보장합니다!**`;
    }
    
    // 정부지원/창업 관련 질문
    if (message.includes('정부지원') || message.includes('창업') || message.includes('기술사업화') || message.includes('지원금')) {
      return `🎯 **기술사업화/창업 - 정부과제 선정률 78%**

💰 **평균 5억원 이상 정부지원금 확보**
• 25년간 정부사업 선정 노하우
• 과제 기획부터 사업화까지 통합 지원
• 사업화 성공률 85% 업계 최고

✅ **M-CENTER 정부지원 전문성**
1. **과제 발굴** - 기업 맞춤형 정부사업 매칭
2. **사업계획서 작성** - 선정률 극대화 전략적 기획
3. **선정 지원** - 발표 준비 및 심사 대응
4. **사업 수행** - 과제 관리 및 성과 창출 지원

💡 **주요 지원 사업**
• **중소벤처24** - 기술개발 (3-10억), 사업화 (5-20억)
• **산업부 사업** - R&D (5-50억), 실증 (10-100억)
• **과기부 사업** - 창업 (1-5억), 기술이전 (3-15억)
• **지자체 사업** - 지역특화 (1-10억), 글로벌 진출 (5-30억)

🏆 **실제 선정 성과**
• AI 스타트업 J사: 총 15억원 정부지원금 확보
• 바이오 벤처 K사: 연속 3개 과제 선정, 총 25억원
• 제조 중소기업 L사: 스마트공장 구축 10억원 지원

🎯 **지원 프로세스**
1. **기업 역량 진단** - 기술력, 사업화 가능성 평가
2. **과제 매칭** - 최적 정부사업 발굴 및 선정
3. **사업계획 수립** - 차별화된 기획서 작성
4. **선정 지원** - 발표 코칭 및 심사 대응
5. **사업 수행 지원** - 과제 관리 및 성과 극대화

📞 **정부지원 상담**: 010-9251-9743 (이후경 경영지도사)
**첫 상담 무료, 선정 시까지 책임 지원합니다!**`;
    }
    
    // 인증 관련 질문
    if (message.includes('인증') || message.includes('iso') || message.includes('벤처') || message.includes('이노비즈')) {
      return `🏅 **인증지원 - 취득률 92% 업계 최고**

💰 **연간 세제혜택 5천만원 이상**
• 25년간 1,000여 건 인증 성공
• 전 분야 인증 전문 노하우
• 사후 관리까지 완벽 지원

✅ **M-CENTER 인증 전문 분야**
1. **품질경영** - ISO 9001, ISO 14001, ISO 45001
2. **정보보안** - ISO 27001, ISMS-P, 개인정보보호
3. **기업 인증** - 벤처기업, 이노비즈, 메인비즈
4. **업종별 인증** - 의료기기(ISO 13485), 식품(HACCP)

💡 **인증 취득 혜택**
• **세제 혜택** - 법인세, 소득세 감면 (연간 최대 5천만원)
• **금융 혜택** - 대출 금리 우대, 보증료 할인
• **입찰 가점** - 공공 입찰 시 가점 획득
• **브랜드 가치** - 고객 신뢰도 및 시장 경쟁력 향상

🏆 **인증 취득 성과**
• 제조업체 M사: ISO 9001/14001 동시 취득, 연간 세제혜택 3천만원
• IT기업 N사: ISO 27001 취득, 보안 전문기업 도약
• 의료기기 O사: ISO 13485 취득, 해외 수출 확대 성공

🎯 **인증 프로세스**
1. **현황 진단** - 기업 현황 및 적용 인증 선별
2. **시스템 구축** - 맞춤형 경영시스템 설계
3. **문서화 지원** - 매뉴얼, 절차서 작성
4. **교육 및 훈련** - 직원 역량 강화 프로그램
5. **심사 대응** - 1차, 2차 심사 완벽 준비

📞 **인증 상담**: 010-9251-9743
📧 **인증 문의**: hongik423@gmail.com

**취득률 92% 검증된 노하우로 확실한 인증을 보장합니다!**`;
    }
    
    // 웹사이트 관련 질문
    if (message.includes('웹사이트') || message.includes('홈페이지') || message.includes('seo') || message.includes('온라인')) {
      return `💻 **웹사이트 구축 - SEO 상위노출 보장**

📈 **온라인 문의 300-500% 증가 실증**
• SEO 최적화 전문 노하우
• 통합 온라인 마케팅 솔루션
• 성과 측정 및 지속 개선

✅ **M-CENTER 웹사이트 전문성**
1. **SEO 최적화** - 검색엔진 상위노출 보장
2. **반응형 디자인** - 모바일 최적화 완벽 지원
3. **콘텐츠 마케팅** - 전문 콘텐츠 기획 및 제작
4. **온라인 광고** - 구글, 네이버 광고 통합 관리

💡 **웹사이트 구축 효과**
• **검색 노출** - 주요 키워드 상위 랭킹 달성
• **브랜드 강화** - 전문성 어필 및 신뢰도 향상
• **매출 증대** - 온라인 채널 통한 신규 고객 확보
• **업무 효율** - 자동화된 고객 관리 시스템

🏆 **구축 성과**
• 제조업체 P사: 검색 상위노출로 온라인 문의 400% 증가
• 서비스업 Q사: 웹사이트 리뉴얼 후 매출 60% 상승
• 전문 서비스 R사: SEO 최적화로 브랜드 인지도 300% 향상

🎯 **구축 프로세스**
1. **기획 및 설계** - 비즈니스 목표 기반 사이트 설계
2. **디자인** - 브랜드 아이덴티티 반영 UI/UX 디자인
3. **개발** - 최신 기술 기반 반응형 웹사이트 구축
4. **SEO 최적화** - 검색엔진 최적화 및 콘텐츠 전략
5. **런칭 및 마케팅** - 온라인 광고 및 지속 관리

📞 **웹사이트 상담**: 010-9251-9743
💻 **포트폴리오 확인**: hongik423@gmail.com

**SEO 상위노출 보장, 성과 없으면 100% 환불합니다!**`;
    }
    
    // 세금계산기 관련 질문
    if (message.includes('세금') || message.includes('세무') || message.includes('소득세') || message.includes('법인세') || message.includes('부가가치세') || message.includes('상속세') || message.includes('증여세') || message.includes('양도소득세') || message.includes('세금계산') || message.includes('세금계산기')) {
      return `🧮 **전문 세금계산기 시스템 - 11개 계산기 완비**

💯 **2024년 최신 세법 완벽 반영**
• 100% 정확한 세금 계산 보장
• 복잡한 세무 계산 3초 내 완료
• 전문가 수준의 세무 분석 제공
• 세금 절약 방안 자동 제안

🎯 **11개 전문 세금계산기**

**📊 개인세금 (5개)**
• **근로소득세 계산기** - 월급, 연봉 소득세 정확 계산
• **종합소득세 계산기** - 사업소득, 기타소득 통합 계산
• **양도소득세 계산기** - 부동산, 주식 양도 시 세금 계산
• **상속세 계산기** - 상속재산 세금 및 공제 계산
• **증여세 계산기** - 증여재산 세금 및 공제 계산

**🏢 법인세금 (3개)**
• **법인세 계산기** - 법인 소득세 및 지방소득세 계산
• **부가가치세 계산기** - 매출/매입 부가세 계산
• **원천징수세 계산기** - 급여, 사업소득 원천징수 계산

**⚡ 전문세금 (3개)**
• **가업상속세금 계산기** - 가업승계 시 세금 최적화
• **주식이동세금 계산기** - 주식 양도/증여 세금 계산
• **간이 종합 계산기** - 통합 세무 계산 및 비교

✅ **주요 특징**
• **실시간 계산** - 입력 즉시 정확한 결과 제공
• **절세 가이드** - 세금 절약 방법 자동 제안
• **면책조항** - 전문가 검토 권장 안내
• **사용법 가이드** - 단계별 상세 설명 제공

🔗 **세금계산기 바로가기**: [세금계산기 페이지](/tax-calculator)

📞 **세무 전문 상담**: 010-9251-9743 (이후경 경영지도사)
💡 **복잡한 세무는 전문가와 상담 후 신고하시기 바랍니다!**

⚠️ **면책조항**
• 본 계산기는 참고용이며, 실제 세무신고 시 전문가 검토 필수
• 개인별 특수 상황은 세무사와 상담 후 처리 권장
• 최종 세금 납부는 국세청 기준을 따르시기 바랍니다`;
    }
    
    // 무료 진단 관련 질문
    if (message.includes('무료') || message.includes('진단') || message.includes('상담')) {
      return `🆓 **M-CENTER 무료 진단 - 지금 즉시 신청**

✅ **완전 무료, 의무 없음**
• 25년 전문성으로 정확한 현황 진단
• 맞춤형 솔루션 제안
• 실행 계획 및 예상 효과 제시

🎯 **무료 진단 항목**
1. **사업 현황 분석** - 강점, 약점, 기회 요소 진단
2. **수익구조 진단** - 매출 증대 및 비용 절감 방안
3. **정부지원 가능성** - 신청 가능한 지원사업 매칭
4. **AI 도입 전략** - 생산성 향상 방안 제시
5. **인증 필요성** - 세제혜택 및 경쟁력 강화 방안
6. **온라인 전략** - 디지털 마케팅 개선 방안

💡 **진단 후 기대효과**
• **매출 증대** - 평균 20-40% 매출 향상 방안 제시
• **비용 절감** - 운영비 10-30% 절감 전략 수립
• **정부지원** - 평균 3-10억원 지원금 확보 가능성
• **경쟁력 강화** - 시장 우위 확보 전략 도출

🏆 **진단 프로세스**
1. **사전 상담** - 전화/화상 기본 현황 파악 (30분)
2. **현장 방문** - 전문가 직접 방문 진단 (2시간)
3. **분석 보고서** - 맞춤형 개선방안 제시 (1주일)
4. **결과 설명** - 구체적 실행계획 논의 (1시간)

📞 **무료 진단 신청**
• 전화: 010-9251-9743 (이후경 경영지도사)
• 이메일: hongik423@gmail.com
• 온라인: M-CENTER 웹사이트 신청폼

⚡ **특별 혜택**
• 첫 진단 완전 무료 (50만원 상당)
• 진단 후 컨설팅 신청 시 30% 할인
• 정부지원사업 기획서 무료 작성 (1회)

**지금 신청하세요! 확실한 성과를 보장합니다!**`;
    }
    
    // 연락처/상담 요청
    if (message.includes('연락') || message.includes('전화') || message.includes('상담') || message.includes('신청')) {
      return `📞 **M-CENTER 전문가 직접 상담**

🥇 **25년 경험 이후경 경영지도사**
• 경영지도사 자격 보유
• 25년 컨설팅 실무 경험
• 1,000여 기업 성공 지원

✅ **즉시 연락 가능**
• **전화**: 010-9251-9743
• **이메일**: hongik423@gmail.com
• **카카오톡**: M-CENTER 검색
• **사무실**: 서울시 강남구 (예약 후 방문)

🎯 **상담 가능 시간**
• **평일**: 오전 9시 - 오후 6시
• **토요일**: 오전 10시 - 오후 3시
• **일요일/공휴일**: 긴급 상담 가능

💡 **상담 방식**
1. **전화 상담** - 즉시 가능 (30분 무료)
2. **화상 상담** - Zoom, Teams 지원
3. **방문 상담** - 사무실 또는 현장 방문
4. **이메일 상담** - 24시간 내 답변

🏆 **첫 상담 특별 혜택**
• **완전 무료** - 첫 1시간 상담료 면제
• **맞춤 분석** - 현황 진단 및 개선방안 제시
• **실행계획** - 구체적 단계별 가이드
• **지속 지원** - 사후 관리 및 성과 모니터링

📋 **상담 전 준비사항**
• 회사 기본 정보 (업종, 규모, 매출 등)
• 주요 고민사항 또는 개선 희망 분야
• 예산 규모 (선택사항)

**🔥 지금 전화주세요! 010-9251-9743**
**확실한 성과를 위한 전문가 상담이 기다리고 있습니다!**`;
    }
    
    // 기타 질문에 대한 기본 응답
    return `💡 **M-CENTER 전문 상담사가 도와드리겠습니다!**

🔍 **말씀하신 내용과 관련하여 다음 서비스를 추천합니다:**

🎯 **맞춤형 서비스 안내**
• **사업 개선이 필요하다면** → BM ZEN 사업분석
• **업무 효율을 높이고 싶다면** → AI 생산성향상
• **공장/부동산 투자 계획이 있다면** → 경매활용 공장구매
• **정부지원금을 받고 싶다면** → 기술사업화/창업
• **세제혜택을 받고 싶다면** → 인증지원
• **온라인 매출을 늘리고 싶다면** → 웹사이트 구축
• **세금 계산이 필요하다면** → 전문 세금계산기 (11개)

🆓 **무료 서비스**
• **무료 현황 진단** - 맞춤형 개선방안 제시
• **무료 전문가 상담** - 25년 경험 이후경 경영지도사
• **무료 세금계산기** - 11개 전문 계산기 이용

📞 **더 자세한 상담을 원하시면**
• 전화: 010-9251-9743
• 이메일: hongik423@gmail.com
• 세금계산기: /tax-calculator

구체적으로 어떤 부분이 궁금하신지 말씀해 주시면 더 정확한 정보를 제공해드리겠습니다! 😊`;
  };

  // 🚀 **강화된 메시지 전송 함수 - Gemini API 연동**
  const handleSendMessage = useCallback(async (text: string) => {
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
    setConnectionStatus('connecting');

    console.log('🤖 Gemini AI 메시지 전송 시작:', { 
      message: text.substring(0, 50) + '...', 
      messageLength: text.length,
      timestamp: new Date().toISOString()
    });

    try {
      // 🔧 **API 호출 안전성 체크**
      const apiCompatibility = checkApiCompatibility('/api/chat');
      const browserInfo = getBrowserInfo();
      
      if (!apiCompatibility.canCall) {
        console.warn('⚠️ API 호출 불가:', apiCompatibility.recommendation);
        throw new Error(apiCompatibility.fallbackAction);
      }
      
      // 🎯 **우선 API 상태 확인**
      console.log('🔍 Gemini API 상태 확인 중...');
      
      try {
        const statusResponse = await fetch('/api/chat', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('✅ Gemini API 상태 확인 완료:', {
            configured: statusData.configured,
            environment: statusData.environment,
            supportedMethods: statusData.supportedMethods
          });
          
          if (!statusData.configured) {
            throw new Error('Gemini API 키가 설정되지 않았습니다');
          }
        } else {
          console.warn('⚠️ API 상태 확인 실패:', statusResponse.status);
        }
      } catch (statusError) {
        console.warn('⚠️ API 상태 확인 중 오류:', statusError);
        // 상태 확인 실패 시에도 계속 시도
      }
      
      // 🚀 **Gemini API 호출**
      console.log('🚀 Gemini API 호출 중...', { 
        isGitHubPages: browserInfo.isGitHubPages,
        userAgent: browserInfo.userAgent.substring(0, 50) + '...',
        messageLength: text.length
      });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 타임아웃 25초
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5), // 최근 5개 메시지만 포함
          context: 'chatbot-page' // 큰 챗봇 페이지 식별자
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      console.log('📡 Gemini API 응답 상태:', { 
        status: response.status, 
        ok: response.ok,
        headers: response.headers.get('content-type')
      });

      if (response.ok) {
        let rawData;
        
        try {
          const responseText = await response.text();
          if (!responseText.trim()) {
            throw new Error('Gemini API에서 빈 응답을 받았습니다');
          }
          
          rawData = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('⚠️ JSON 파싱 오류:', jsonError);
          throw new Error('API 응답 형식이 잘못되었습니다');
        }
        
        // 🔧 **안전한 데이터 검증 및 접근**
        const validationResult = validateApiResponse(rawData);
        
        if (!validationResult.isValid) {
          console.error('⚠️ API 응답 검증 실패:', validationResult.error);
          throw new Error(validationResult.error || 'API 응답이 유효하지 않습니다');
        }
        
        const data = validationResult.data;
        const responseContent = safeGet<string>(data, 'response', '');
        
        if (responseContent && typeof responseContent === 'string' && responseContent.trim()) {
          console.log('✅ Gemini API 응답 성공:', { 
            responseLength: responseContent.length,
            hasUsage: !!safeGet(data, 'usage'),
            services: safeGet(data, 'services', []),
            validationPassed: true
          });
          
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: responseContent,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botMessage]);
          setConnectionStatus('connected');
          return;
        } else {
          console.error('⚠️ 응답 내용이 유효하지 않음:', { 
            hasResponse: !!responseContent,
            responseType: typeof responseContent,
            responseLength: (responseContent as string)?.length || 0
          });
          throw new Error('API에서 유효한 응답 내용을 받지 못했습니다');
        }
      } else {
        let errorData = null;
        try {
          const errorText = await response.text();
          if (errorText.trim()) {
            errorData = JSON.parse(errorText);
          }
        } catch (parseError) {
          console.warn('⚠️ 오류 응답 파싱 실패:', parseError);
        }
        
        const errorMessage = safeGet(errorData, 'error', `HTTP ${response.status}: ${response.statusText}`);
        throw new Error(errorMessage);
      }
      
    } catch (error) {
      // 🔧 **강화된 오류 정보 수집**
      const errorInfo = collectErrorInfo(error, {
        messageLength: text.length,
        messageType: 'chatbot-page',
        apiUrl: '/api/chat',
        timestamp: new Date().toISOString()
      });
      
      console.warn('⚠️ Gemini API 오류, 클라이언트 응답 사용:', errorInfo);
      
      console.log('🤖 클라이언트 백업 응답 생성 중...');
      
      let clientResponse = generateResponse(text);
      
      const browserInfo = getBrowserInfo();
      
      // 개발 환경에서 디버그 정보 추가
      if (browserInfo.isBrowser && (
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('192.168') ||
        process.env.NODE_ENV === 'development'
      )) {
        const errorType = error instanceof Error && error.name === 'AbortError' ? 'Gemini API 타임아웃' : 'Gemini API 연결 오류';
        clientResponse += `\n\n🔧 **개발자 정보:** ${errorType} 발생`;
        
        if (browserInfo.isGitHubPages) {
          clientResponse += ` (GitHub Pages 환경)`;
        }
        
        clientResponse += `, 클라이언트 백업 응답으로 대체됨`;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: clientResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setConnectionStatus(error instanceof Error && error.name === 'AbortError' ? 'error' : 'connected');
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

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
                        <img 
                          src="/star-counselor-icon.svg" 
                          alt="별-AI상담사" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold">별-AI상담사</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-400">⭐</span>
                            <div className={`w-2 h-2 rounded-full ${
                              connectionStatus === 'connected' ? 'bg-green-400' :
                              connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                              'bg-red-400'
                            }`}></div>
                            <span className="text-sm opacity-90">
                              {connectionStatus === 'connected' ? '온라인' :
                               connectionStatus === 'connecting' ? '연결 중...' :
                               '오프라인'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {connectionStatus === 'connected' ? '실시간 상담' :
                         connectionStatus === 'connecting' ? '연결 중' :
                         '연결 오류'}
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