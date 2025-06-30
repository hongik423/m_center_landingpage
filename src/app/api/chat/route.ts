import { NextRequest, NextResponse } from 'next/server';
import { safeGet, validateApiResponse, collectErrorInfo } from '@/lib/utils/safeDataAccess';

// Vercel 최적화 설정
export const dynamic = 'force-dynamic';
export const revalidate = false;
export const runtime = 'nodejs';

// 🔧 CORS 설정을 위한 공통 헤더 함수
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
  };
}

// 🎯 이후경 경영지도사 직접 작성 응답 데이터베이스
const LEE_HUKYUNG_RESPONSES = {
  // 인사말 및 일반 응답
  greetings: [
    `안녕하세요! 이후경 경영지도사입니다.

    25년간 500개 이상 기업의 성장을 함께해온 경영 전문가로서 상담해드리겠습니다.
    
    저는 단순한 컨설팅이 아닌, 실제 검증된 성과로 기업의 성장을 책임집니다.
    
    🎯 25년 경험의 검증된 전문성:
    • 현대그룹, 삼성생명 대기업 실무 경험
    • 정부지원 프로그램 연계 전문 경영지도사
    • 95% 이상의 높은 성공률  
    • 실제 ROI 300% 이상 달성 사례 다수
    
    어떤 부분이 궁금하신지 편하게 말씀해주세요. 25년 경험을 바탕으로 정확하고 실용적인 답변을 드리겠습니다.
    
    📞 직접 상담: 010-9251-9743 (이후경 경영지도사)`
  ],

  // 서비스별 전문 응답
  'business-analysis': {
    responses: [
      `BM ZEN 사업분석에 대해 문의해주셨네요. 

      28년 컨설팅 경험을 집약한 저희만의 독자적 프레임워크입니다.
      
      🔥 실제 검증된 성과 (한국정밀기계 사례):
      • 생산성 42% 향상 (하루 100개 → 142개 생산)
      • 품질 불량률 78% 감소 (3.2% → 0.7%)  
      • 6개월 만에 ROI 290% 달성
      • AI 품질검사 정확도 96.8%
      
      💡 BM ZEN 5단계 프레임워크:
      1단계 - 가치 발견: 현재 비즈니스 모델 진단
      2단계 - 가치 창출: 새로운 수익원 발굴
      3단계 - 가치 제공: 고객 가치 전달 체계
      4단계 - 가치 포착: 수익성 최적화
      5단계 - 가치 교정: 지속적 개선 시스템
      
      다른 컨설팅과 차이점은 '추상적 이론'이 아닌 '실제 데이터 기반'으로 진행한다는 것입니다. 고객사의 실제 데이터를 분석해서 구체적인 개선안을 제시하죠.
      
      정확한 비용과 적용 방안은 기업 규모와 상황에 따라 달라지니, 직접 상담을 통해 맞춤형으로 안내해드리겠습니다.
      
      📞 무료 상담: 010-9251-9743`
    ]
  },

  'ai-productivity': {
    responses: [
      `AI 생산성향상에 관심을 가져주셔서 감사합니다.

      2025년 올해 정말 좋은 기회가 있습니다! 고용노동부 노사발전재단에서 주관하는 '일터혁신 상생컨설팅'이에요.
      
      🎁 20-99인 기업 100% 정부지원 (완전무료):
      • 업무 효율성 40% 향상 (정부 검증)
      • AI 기반 근로시간 관리 자동화
      • 인사평가제도 혁신 구축
      • 조직 소통 활성화 시스템
      
      💪 실제 적용 사례들:
      • 제조업체: 제안서 작성 시간 50% 단축
      • 서비스업: 고객 만족도 25% 향상  
      • 중소기업: 운영 비용 30% 절감
      
      특히 ChatGPT, Claude 같은 AI 도구들을 업무에 실제로 적용하는 방법을 단계별로 교육해드리고, 회사 전체 시스템으로 구축해드립니다.
      
      28년 경험상, AI 도입은 '선택'이 아닌 '필수'가 되었습니다. 지금 시작하지 않으면 2-3년 후 경쟁에서 뒤처질 수밖에 없어요.
      
      100% 정부지원이니 부담 없이 시작하실 수 있습니다. 신청 방법과 자격 요건 등 자세한 내용은 직접 상담으로 안내해드릴게요.
      
      📞 무료 상담: 010-9251-9743`
    ]
  },

  'factory-auction': {
    responses: [
      `경매를 통한 공장구매에 관심이 있으시군요. 

      25년간 부동산 경매 분야에서 쌓은 노하우로 많은 기업들이 큰 절약 효과를 보고 있습니다.
      
      💰 실제 절약 효과:
      • 시장가 대비 30-50% 절감 가능
      • 연간 임대료 부담 완전 해소
      • 자산 가치 상승으로 기업 가치 증대
      
      🏭 실제 성공 사례:
      • 제조업체 G사: 15억 공장을 9억에 낙찰 (40% 절약)
      • 물류업체 H사: 연간 임대료 3억원 → 자가 소유 전환
      • 식품업체 I사: 확장 이전비용 60% 절감
      
      ⚖️ 안전한 낙찰 보장 시스템:
      • 법무팀 연계로 권리관계 철저 검증
      • 95% 이상 안전 낙찰률 유지
      • 전국 공장 경매 정보 독점 네트워크
      • 투자 리스크 최소화 시스템 구축
      
      28년 경험상, 경매는 '리스크'가 아닌 '기회'입니다. 다만 전문가와 함께 해야 안전하고 확실한 결과를 얻을 수 있어요.
      
      지역, 업종, 예산 등에 따라 접근 방법이 달라지니, 구체적인 상황을 알려주시면 맞춤형 전략을 제시해드리겠습니다.
      
      📞 무료 상담: 010-9251-9743`
    ]
  },

  'tech-startup': {
    responses: [
      `기술사업화와 창업지원에 대해 문의해주셨네요.

      28년간 수많은 기술창업을 성공으로 이끌어온 경험을 바탕으로 체계적인 지원을 해드립니다.
      
      💎 검증된 성공 실적:
      • 평균 5억원 이상 정부지원 확보
      • 기술가치평가 3배 상승 효과
      • 투자유치 성공률 65%
      • 사업화 성공률 82%
      
      🚀 실제 성공 사례:
      • AI 스타트업 J사: 25억원 Series A 투자 유치
      • 바이오텍 K사: 정부과제 12억원 + 민간투자 8억원
      • 제조기술 L사: 특허 기반 연매출 50억 달성
      
      🎯 체계적 지원 프로세스:
      • 기술가치평가 및 IP 전략 수립
      • 정부 R&D 과제 기획 및 신청 (선정률 78%)
      • VC/액셀러레이터 네트워크 연결
      • 사업화 전략 및 시장 진출 지원
      
      특히 TIPS, 창업도약패키지, 기술보증기금 등과의 연계가 강점입니다. 정부 R&D 과제 선정률이 78%로 전국 평균(25%)보다 3배 높아요.
      
      28년 경험상, 기술창업의 성공 열쇠는 '좋은 기술'만으로는 부족하고, '전략적 실행'이 핵심입니다.
      
      보유하신 기술과 목표를 구체적으로 알려주시면, 맞춤형 사업화 전략을 제시해드리겠습니다.
      
      📞 무료 상담: 010-9251-9743`
    ]
  },

  'certification': {
    responses: [
      `인증지원 서비스에 관심을 가져주셔서 감사합니다.

      ISO, 벤처기업 확인, 기업부설연구소 등 다양한 인증을 통해 기업의 가치를 높이고 실질적인 혜택을 받으실 수 있도록 도와드립니다.
      
      💰 실제 혜택 (연간):
      • 세제혜택 5천만원 이상
      • 대기업 납품 자격 확보
      • B2B 신뢰도 300% 향상
      • 기업 가치 평가 상승
      
      🏆 검증된 성과:
      • 인증 취득률 92% (업계 최고)
      • 처리 시간 50% 단축
      • 사후 관리 서비스 포함
      
      💼 실제 성공 사례:
      • 중견기업 M사: ISO 인증으로 대기업 납품 계약 30억원
      • 벤처기업 N사: 벤처 인증으로 세액공제 8천만원
      • 연구소 O사: 기업부설연구소로 R&D 세액공제 3억원
      
      28년 경험상, 인증은 '비용'이 아닌 '투자'입니다. 제대로 된 인증 하나로 연간 수천만원의 혜택을 받을 수 있어요.
      
      기업 규모, 업종, 목표에 따라 적합한 인증이 다르니, 직접 상담을 통해 최적의 인증 전략을 제시해드리겠습니다.
      
      📞 무료 상담: 010-9251-9743`
    ]
  },

  'website': {
    responses: [
      `웹사이트 구축을 통한 매출 증대에 관심이 있으시군요.

      28년간 다양한 업종의 웹사이트 구축을 통해 실제 매출 증대 효과를 확인해왔습니다.
      
      📈 검증된 성과:
      • 온라인 문의 300-500% 증가
      • 매출 직접 연결율 85%
      • 구글 검색 상위 3페이지 진입 보장
      • 모바일 최적화 완벽 구현
      
      💻 실제 성공 사례:
      • 제조업체 P사: 월 문의 20건 → 150건 (7.5배)
      • 서비스업 Q사: 온라인 매출 월 2천만원 달성
      • 유통업체 R사: 브랜드 검색량 10배 증가
      
      🎯 차별화 포인트:
      • SEO 최적화 전문팀 (구글 상위노출 보장)
      • 전환율 최적화 (CVR) 전문성
      • 업종별 특화 디자인 템플릿
      • 마케팅 자동화 시스템 구축
      
      28년 경험상, '예쁜 홈페이지'보다는 '매출이 나오는 홈페이지'가 중요합니다. 방문자를 고객으로 전환시키는 것이 핵심이죠.
      
      업종과 타겟 고객에 따라 접근 방법이 달라지니, 구체적인 사업 내용을 알려주시면 맞춤형 전략을 제시해드리겠습니다.
      
      온라인 판로개척 지원사업, 디지털 바우처 등 정부지원도 연계 가능합니다.
      
      📞 무료 상담: 010-9251-9743`
    ]
  },

  'tax-calculator': {
    responses: [
      `세금계산기에 대해 문의해주셨네요.

      저희 M-CENTER에서는 11개 전문 세금계산기를 제공하고 있습니다. 2024년 최신 세법을 완벽하게 반영했어요.
      
      🧮 제공 계산기:
      • 종합소득세 계산기
      • 근로소득세 계산기  
      • 법인세 계산기
      • 부가가치세 계산기
      • 상속세 계산기
      • 증여세 계산기
      • 양도소득세 계산기
      • 원천징수세 계산기
      • 주식양도소득세 계산기
      • 가업상속 계산기
      • 사업승계 계산기
      
      💡 특징:
      • 100% 정확한 세금 계산 보장
      • 복잡한 세무 계산 3초 내 완료
      • 전문가 수준의 세무 분석 제공
      • 세금 절약 방안 자동 제안
      
      💰 실제 절세 사례:
      • 개인사업자 S님: 종합소득세 계산으로 200만원 절세
      • 중소기업 T사: 법인세 최적화로 연간 500만원 절약
      • 부동산 투자자 U님: 양도소득세 사전 계산으로 투자 결정
      
      28년 세무 경험상, 정확한 세금 계산은 '절세의 시작'입니다. 미리 계산해보고 계획을 세우는 것이 중요해요.
      
      복잡한 상황이나 전문적인 세무 상담이 필요하시면 언제든 연락주세요.
      
      📞 세무 상담: 010-9251-9743`
    ]
  },

  // 가격/비용 관련 질문
  pricing: [
    `비용에 대해 문의해주셨네요.

    28년 경험상, 각 기업의 규모, 업종, 현재 상황에 따라 적합한 서비스와 비용이 달라집니다.
    
    💡 비용 결정 요소:
    • 기업 규모 (직원 수, 매출액)
    • 업종 특성 및 현재 상황
    • 원하시는 서비스 범위
    • 정부지원 프로그램 활용 가능성
    
    🎁 정부지원 프로그램 활용:
    • AI 생산성향상: 20-99인 기업 100% 무료
    • 기술창업 지원: 평균 5억원 지원
    • 인증지원: 정부 바우처 활용 가능
    • 웹사이트 구축: 디지털 바우처 연계
    
    정확한 견적과 최적의 정부지원 프로그램을 찾아서 제안해드리려면, 직접 상담을 통해 구체적인 상황을 파악하는 것이 가장 좋겠습니다.
    
    첫 상담은 완전 무료이니 부담 없이 연락주세요.
    
    📞 무료 견적 상담: 010-9251-9743`
  ],

  // 정부지원 관련 질문
  government: [
    `정부지원에 대해 관심이 많으시군요. 

    28년간 정부지원 프로그램과 함께 성장해온 경험으로 말씀드리면, 지금이 정말 좋은 기회입니다.
    
    🎯 2025년 주요 정부지원:
    • 일터혁신 상생컨설팅: 20-99인 기업 100% 무료
    • 스마트공장 구축 지원: 최대 1억원
    • 기술창업 지원: 평균 5억원
    • 온라인 판로개척: 최대 3천만원
    • 디지털 전환 지원: 최대 2천만원
    
    💪 저희 강점:
    • 정부지원 전문 기관 지정
    • 높은 선정률 (평균 78% vs 전국 25%)
    • 신청부터 정산까지 원스톱 지원
    • 28년 노하우로 최적 프로그램 매칭
    
    중요한 것은 '신청 시기'와 '적합한 프로그램 선택'입니다. 놓치면 1년을 기다려야 하는 경우가 많아요.
    
    기업 상황을 알려주시면 지원 가능한 프로그램들을 정확하게 안내해드리겠습니다.
    
    📞 정부지원 상담: 010-9251-9743`
  ]
};

// 질문 유형 식별 함수 (🔥 키워드 매칭 순서 최적화)
function identifyQuestionType(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // 인사말 패턴
  if (/^(안녕|안녕하세요|hi|hello|처음|시작)/i.test(message)) {
    return 'greeting';
  }
  
  // 🔥 서비스별 키워드 우선 매칭 (더 구체적인 키워드 먼저)
  if (/ai.*생산성|생산성.*ai|ai.*향상|향상.*ai|일터혁신|상생컨설팅|고용노동부|인공지능.*생산성|생산성.*인공지능|ai생산성|생산성ai/i.test(lowerMessage)) {
    return 'ai-productivity';
  }
  
  if (/bm zen|사업분석|비즈니스모델|품질개선/i.test(lowerMessage)) {
    return 'business-analysis';
  }
  
  if (/경매|공장구매|부동산|공장|임대료|자가|투자|부동산비용/i.test(lowerMessage)) {
    return 'factory-auction';
  }
  
  if (/기술사업화|창업|스타트업|특허|r&d|기술개발|투자유치/i.test(lowerMessage)) {
    return 'tech-startup';
  }
  
  if (/인증|iso|벤처기업|연구소|세액공제|세제혜택|품질인증/i.test(lowerMessage)) {
    return 'certification';
  }
  
  if (/웹사이트|홈페이지|온라인|마케팅|seo|검색|디지털마케팅/i.test(lowerMessage)) {
    return 'website';
  }
  
  if (/세금계산기|세금계산|세무|세금|소득세|법인세|부가가치세|상속세|증여세|양도소득세/i.test(lowerMessage)) {
    return 'tax-calculator';
  }
  
  if (/비용|가격|견적|돈|요금|수수료|예산/i.test(lowerMessage)) {
    return 'pricing';
  }
  
  if (/정부지원|정부|지원금|보조금|정책자금|정부사업/i.test(lowerMessage)) {
    return 'government';
  }
  
  // 🔥 상담신청 관련 키워드 감지 (가장 마지막에 체크)
  if (/상담|문의|도움|컨설팅|도와|해결|필요|신청|연락|전화|상세|자세히|알고싶|궁금|어떻게|방법|진단|점검|검토|분석|가능한지|할 수 있는지|해줄 수 있|처리|지원|추천|제안/i.test(lowerMessage)) {
    return 'consultation';
  }
  
  return 'general';
}

// 🔥 상담신청 버튼 생성 함수
function generateConsultationButtons(questionType: string, message: string): { buttons: Array<{ text: string; url: string; style: string; icon: string }> } | null {
  
  // 상담 관련 키워드나 특정 서비스 문의일 때 버튼 생성
  if (questionType === 'consultation' || 
      ['business-analysis', 'ai-productivity', 'factory-auction', 'tech-startup', 'certification', 'website', 'pricing', 'government'].includes(questionType)) {
    
    return {
      buttons: [
        {
          text: '📞 상담신청',
          url: '/consultation',
          style: 'primary',
          icon: '📞'
        },
        {
          text: '🎯 무료진단',
          url: '/diagnosis',
          style: 'secondary',
          icon: '🎯'
        }
      ]
    };
  }
  
  return null;
}

// 이후경 경영지도사 직접 작성 응답 생성
function generateDirectResponse(message: string): { response: string; buttons?: Array<{ text: string; url: string; style: string; icon: string }> } {
  const questionType = identifyQuestionType(message);
  const consultationButtons = generateConsultationButtons(questionType, message);
  
  let responseText: string;
  
  switch (questionType) {
    case 'consultation':
      responseText = `안녕하세요! 이후경 경영지도사입니다.

      "${message}"에 대해 상담 문의해주셔서 감사합니다! 💪
      
      25년간 500개 이상 기업의 성장을 함께해온 경영지도사로서 정확하고 실용적인 솔루션을 제공해드리겠습니다.
      
      🎯 전문 상담 분야:
      • BM ZEN 사업분석 (신규사업 성공률 95%)
      • AI 생산성향상 (20-99인 기업 100% 무료)
      • 경매활용 공장구매 (30-50% 절감)
      • 기술사업화/창업 (평균 5억원 지원)
      • 인증지원 (연간 5천만원 세제혜택)
      • 웹사이트 구축 (매출 300-500% 증대)
      
      💡 **즉시 상담을 원하신다면:**
      아래 버튼을 클릭하여 상담신청하시거나, 전화로 바로 연결하세요!
      
      📞 **긴급 상담:** 010-9251-9743 (이후경 경영지도사)
      ⏰ **상담시간:** 평일 09:00-18:00 (토요일 예약 가능)
      
      25년 현장 경험을 바탕으로 구체적이고 실행 가능한 해답을 드리겠습니다! 🚀`;
      break;
      
    case 'greeting':
      responseText = LEE_HUKYUNG_RESPONSES.greetings[0];
      break;
      
    case 'business-analysis':
      responseText = LEE_HUKYUNG_RESPONSES['business-analysis'].responses[0];
      break;
      
    case 'ai-productivity':
      responseText = LEE_HUKYUNG_RESPONSES['ai-productivity'].responses[0];
      break;
      
    case 'factory-auction':
      responseText = LEE_HUKYUNG_RESPONSES['factory-auction'].responses[0];
      break;
      
    case 'tech-startup':
      responseText = LEE_HUKYUNG_RESPONSES['tech-startup'].responses[0];
      break;
      
    case 'certification':
      responseText = LEE_HUKYUNG_RESPONSES['certification'].responses[0];
      break;
      
    case 'website':
      responseText = LEE_HUKYUNG_RESPONSES['website'].responses[0];
      break;
      
    case 'tax-calculator':
      responseText = LEE_HUKYUNG_RESPONSES['tax-calculator'].responses[0];
      break;
      
    case 'pricing':
      responseText = LEE_HUKYUNG_RESPONSES.pricing[0];
      break;
      
    case 'government':
      responseText = LEE_HUKYUNG_RESPONSES.government[0];
      break;
      
    default:
      responseText = `안녕하세요! 이후경 경영지도사입니다.

      "${message}"에 대해 문의해주셔서 감사합니다.
      
      25년간 500개 이상 기업의 성장을 함께해온 경영지도사로서 상담해드리겠습니다.
      
      🎯 M-CENTER 주요 서비스:
      • BM ZEN 사업분석 (신규사업 성공률 95%)
      • AI 생산성향상 (20-99인 기업 100% 무료)
      • 경매활용 공장구매 (30-50% 절감)
      • 기술사업화/창업 (평균 5억원 지원)
      • 인증지원 (연간 5천만원 세제혜택)
      • 웹사이트 구축 (매출 300-500% 증대)
      • 세금계산기 11종 (2024년 최신 세법)
      
      구체적인 상황을 알려주시면 더 정확한 답변을 드릴 수 있습니다.
      25년 경험을 바탕으로 실용적인 솔루션을 제시해드리겠습니다.
      
      📞 직접 상담: 010-9251-9743 (이후경 경영지도사)`;
  }
  
  // 버튼이 있는 경우 포함해서 반환
  if (consultationButtons) {
    return {
      response: responseText,
      buttons: consultationButtons.buttons
    };
  }
  
  return { response: responseText };
}

interface ChatMessage {
  message: string;
  history?: Array<{
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }>;
}

export async function POST(request: NextRequest) {
  let body: ChatMessage | undefined;
  
  try {
    // request body를 한 번만 읽기
    body = await request.json();
    
    if (!body) {
      return NextResponse.json(
        { error: '요청 본문이 비어있습니다.' },
        { 
          status: 400,
          headers: getCorsHeaders()
        }
      );
    }

    const { message, history = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: '메시지가 비어있습니다.' },
        { 
          status: 400,
          headers: getCorsHeaders()
        }
      );
    }

    // 이후경 경영지도사 직접 작성 응답 생성
    console.log('이후경 경영지도사 직접 응답 생성 시작:', { messageLength: message.length });
    
    const directResponse = generateDirectResponse(message);

    console.log('이후경 경영지도사 직접 응답 완료:', { 
      responseLength: directResponse.response.length,
      hasButtons: !!directResponse.buttons
    });
    
    return NextResponse.json({
      response: directResponse.response,
      buttons: directResponse.buttons || [],
      source: 'lee_hukyung_direct_response',
      timestamp: new Date().toISOString(),
      consultant: '이후경 경영지도사',
      experience: '25년 현장 경험',
      timestamp_force_update: new Date().toISOString(),
      deployment_version: 'v0.1.2_final_fix'
    }, {
      headers: {
        ...getCorsHeaders(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('❌ 응답 생성 오류:', error);
    
    // body가 정의되지 않은 경우를 위한 안전장치
    const fallbackMessage = body?.message || '일반 상담';
    
    return NextResponse.json({
      response: generateDirectResponse(fallbackMessage).response,
      source: 'lee_hukyung_fallback',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString(),
      consultant: '이후경 경영지도사'
    }, {
      headers: getCorsHeaders()
    });
  }
}

// GET 요청 처리 (헬스 체크)
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'ok',
      message: 'M센터장 상담 시스템이 정상 작동 중입니다.',
      consultant: '이후경 경영지도사',
      experience: '28년 현장 경험',
      timestamp: new Date().toISOString(),
      services: [
        'BM ZEN 사업분석',
        'AI 생산성향상', 
        '경매활용 공장구매',
        '기술사업화/창업',
        '인증지원',
        '웹사이트 구축',
        '세금계산기'
      ]
    }, {
      headers: getCorsHeaders()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: '시스템 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, {
      status: 500,
      headers: getCorsHeaders()
    });
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders()
  });
} 