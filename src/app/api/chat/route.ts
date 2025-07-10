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

// 🎯 업데이트된 이후경 경영지도사 응답 데이터베이스
const LEE_HUKYUNG_RESPONSES = {
  greetings: [
    `안녕하세요! 이후경 경영지도사입니다.

28년간 현대그룹과 삼성생명에서 쌓은 실무 경험과 500개 기업을 직접 지도한 컨설팅 노하우를 바탕으로 실질적이고 성과 중심적인 솔루션을 제공해드리겠습니다.

🎯 **M-CENTER 6대 핵심서비스:**
• BM ZEN 사업분석 - 매출 20-40% 증대
• AI 생산성향상 - 업무효율 40% 향상 (정부 100% 지원)
• 정책자금 확보 - 평균 15억원 확보
• 기술창업 지원 - 평균 5억원 자금 확보
• 인증지원 - 연간 5천만원 세제혜택
• 웹사이트 구축 - 온라인 매출 300% 증대

📊 **검증된 성과:** 95% 성공률, 평균 ROI 400%, 고객 만족도 96%

어떤 고민이 있으신지 구체적으로 말씀해주시면 맞춤형 솔루션을 제시해드리겠습니다.

📞 **직접 상담:** 010-9251-9743`
  ],

  'ai-productivity': {
    keyword: ['ai', '생산성', '자동화', '업무효율', '일터혁신', '상생컨설팅'],
    responses: [
      `AI 생산성 향상에 대해 문의해주셔서 감사합니다! 28년 컨설팅 경험을 바탕으로 최근 2년간 247개 기업의 AI 도입을 직접 지도한 노하우를 말씀드리겠습니다.

🤖 **2025년 일터혁신 상생컨설팅 - AI 활용 생산성향상**

📊 **실제 성과 (247개 기업 평균):**
• 업무효율성 42% 향상
• 업무시간 35% 단축
• 연간 인건비 8,500만원 절감
• AI 도구 활용 만족도 94%

🎯 **20주 집중 프로그램:**
• 현황진단 (2주): AI 활용 가능 영역 발굴
• AI도구선정 (3주): 맞춤형 도구 선정 및 도입
• 실무적용 (16주): 실제 업무 적용 및 최적화
• 성과측정 (2주): ROI 분석 및 확산 계획

🏆 **성공사례: (주)스마트팩토리솔루션**
• 제안서 작성 시간 69% 단축 (8시간→2.5시간)
• 품질 데이터 분석 85% 단축 (주 20시간→3시간)
• 고객 문의 응답 87% 단축 (4시간→30분)
• 연간 경제적 효과 5억 8천만원

💰 **정부지원 혜택:**
고용노동부 일터혁신 수행기관으로서 컨설팅 비용 100% 정부지원 가능합니다.

구체적인 업종과 현재 가장 시간이 많이 걸리는 업무를 알려주시면, 맞춤형 AI 도입 로드맵을 제시해드리겠습니다.

📞 **직접 상담:** 010-9251-9743`
    ]
  },

  'business-analysis': {
    keyword: ['사업분석', '비즈니스모델', 'bm zen', '매출증대', '수익구조'],
    responses: [
      `BM ZEN 사업분석에 대해 문의해주셔서 감사합니다! 국내 유일의 독자적 비즈니스모델 분석 프레임워크로, 25년간의 컨설팅 노하우를 집약한 M-CENTER만의 차별화된 서비스입니다.

🎯 **BM ZEN 사업분석 핵심 특징:**
• 5단계 전략 프레임워크로 매출 20-40% 증대
• Business Model Canvas 고도화 버전
• 수익모델 다각화 및 최적화
• 시장분석 기반 데이터 중심 접근
• 단계별 실행계획 및 성과 측정

📊 **검증된 성과:**
• 평균 매출 증대율: 35% (20-60% 범위)
• 수익성 개선: 평균 28%
• 고객만족도: 96%
• 사업 지속가능성: 85% 이상

🏆 **성공사례:**
• 제조업 A사: BM ZEN 적용 후 매출 45% 증가, 수익률 35% 개선
• IT 서비스 B사: 신규 수익모델 개발로 연매출 25억 달성
• 유통업 C사: 온오프라인 통합 BM으로 시장점유율 3배 확대

💡 **5단계 분석 과정:**
1. 현재 비즈니스모델 진단 및 분석
2. 시장환경 및 경쟁사 벤치마킹
3. 수익모델 재설계 및 최적화
4. 실행계획 수립 및 단계별 로드맵
5. 성과 모니터링 및 지속 개선

구체적인 업종과 현재 비즈니스 상황을 알려주시면 맞춤형 분석 방안을 제시해드리겠습니다.

📞 **직접 상담:** 010-9251-9743`
    ]
  },

  'policy-funding': {
    keyword: ['정책자금', '지원금', '보조금', '정부지원', '자금확보'],
    responses: [
      `정책자금에 대해 문의해주셔서 감사합니다! 28년간 500개 기업을 지도하면서 정책자금 확보에 있어 평균 15억원, 최대 100억원까지 성공적으로 확보한 노하우를 말씀드리겠습니다.

💰 **업종별 정책자금 종류:**

🏭 **제조업**
• 시설자금: 50억원 (연 1.5%, 10년 상환)
• 운영자금: 30억원 (연 2.0%, 5년 상환)
• 기술개발: 20억원 (연 1.0%, 5년 거치)

🏢 **서비스업**
• 창업자금: 10억원 (연 2.5%, 7년 상환)
• 디지털 전환: 5억원 (연 1.8%, 5년 상환)
• 마케팅: 2억원 (연 3.0%, 3년 상환)

🚀 **기술기업**
• R&D 자금: 100억원 (연 1.0%, 7년 거치)
• 사업화: 50억원 (연 1.5%, 5년 상환)

📋 **8단계 완벽 대행 프로세스:**
1. 기업진단 (재무상태+사업계획 분석)
2. 자금매칭 (최적 정책자금 선별)
3. 서류준비 (사업계획서+재무계획 작성)
4. 신청접수 → 5. 심사대응 → 6. 승인협상
7. 자금집행 → 8. 사후관리

💡 **정책자금 vs 시중은행 비교 (10억원 기준):**
• 정책자금: 총 이자비용 1.2억원
• 시중은행: 총 이자비용 3.8억원
• **절약효과: 2.6억원 (68% 절감)**

🏆 **성공사례: H관광개발**
• 5년간 총 100억원 확보
• 매출 20억→150억원 (650% 성장)
• 직원 15명→120명 (8배 증가)

기업 규모와 업종, 자금 용도를 알려주시면 최적의 정책자금을 매칭해드리겠습니다.

📞 **정책자금 상담:** 010-9251-9743`
    ]
  },

  'tech-startup': {
    keyword: ['창업', '스타트업', '기술사업화', '투자유치', 'r&d'],
    responses: [
      `기술창업에 대해 문의해주셔서 감사합니다! 25년간 R&D 전문가로 활동하면서 기술기반 스타트업의 성공 로드맵을 제시해드리겠습니다.

🚀 **기술창업 4단계 성장 로드맵:**

**1단계 (창업준비)**
• 특허출원 + 예비벤처 + 디딤돌과제
• 확보 가능 자금: 1.7억원

**2단계 (성장기)**
• 벤처확인 + 기술개발 + 정책자금 공장설립
• 확보 가능 자금: 24.7억원

**3단계 (확장기)**
• TIPS선정 + 해외진출 + VC투자
• 확보 가능 자금: 57억원

**4단계 (IPO준비)**
• 상장준비 + 글로벌확대
• 목표 매출: 120억원

📊 **투자유치 단계별 전략:**
• Pre-A: 사업타당성 검증 + MVP 개발 (5천만~2억)
• Series A: 시장검증 + 팀빌딩 + 특허확보 (5~20억)
• Series B: 매출성장 + 시장확대 (20~100억)
• IPO 준비: 글로벌진출 + 상장준비 (100억+)

🏆 **성공사례: ABC기업**
• 총 확보 실적: 87억원
• ROI: 2,174%
• 기업가치: 500억원 달성
• 연매출: 120억원 목표

💡 **R&D 과제 선정 4대 핵심요소:**
• 기술혁신성: 특허 3건 이상 + 차별화 기술
• 시장파급효과: 시장규모 1조원 이상 + 성장성 15%
• 사업화 가능성: 구체적 매출계획 + 고객확보 전략
• 팀 역량: 기술/사업/마케팅 전문가 구성

현재 보유 기술과 창업 단계를 알려주시면 맞춤형 로드맵을 제시해드리겠습니다.

📞 **기술창업 상담:** 010-9251-9743`
    ]
  },

  'certification': {
    keyword: ['인증', 'iso', '벤처기업', '세제혜택', '품질인증'],
    responses: [
      `인증지원에 대해 문의해주셔서 감사합니다! 기업 성장을 위한 전략적 인증으로 연간 5천만원 세제혜택을 확보하는 방법을 말씀드리겠습니다.

🏆 **인증지원 핵심 특징:**
• 연간 5천만원 세제혜택
• 100% 취득 보장
• 12개 인증 통합 관리
• 대기업 협력사 등록 지원
• ESG 경영 및 탄소중립 대응

📊 **주요 인증 종류:**
• ISO 9001/14001/45001 통합인증
• 벤처기업/이노비즈 인증
• ESG 경영 및 탄소중립 인증
• 품질경영시스템 고도화

🎯 **대기업 납품 4단계 전략:**
1. ISO 9001/14001/45001 통합인증
2. 벤처기업/이노비즈 인증
3. 품질경영시스템 고도화
4. 대기업 협력사 등록

🏆 **성공사례: ABC기업**
• 12개 인증 획득
• 대기업 3개사 협력사 등록
• 납품단가 20% 상승
• 연간 세제혜택 5천만원

💰 **세제혜택 상세:**
• 연구개발비 세액공제: 최대 40%
• 기술혁신형 중소기업 세액공제: 10%
• 벤처기업 세액공제: 20%
• 고용증대 세액공제: 1인당 770만원

🌱 **ESG/탄소중립 지원:**
• 친환경 전환 3단계 지원
• 그린뉴딜펀드 30억원
• 친환경 시설자금 20억원 (연 1.5%)
• 탄소중립 기술개발 10억원

현재 보유 인증과 목표 인증을 알려주시면 최적의 인증 로드맵을 제시해드리겠습니다.

📞 **인증 상담:** 010-9251-9743`
    ]
  },

  'website': {
    keyword: ['웹사이트', '홈페이지', '온라인', '마케팅', '디지털'],
    responses: [
      `웹사이트 구축에 대해 문의해주셔서 감사합니다! 디지털 혁신으로 온라인 매출 300% 증대를 실현하는 방법을 말씀드리겠습니다.

🌐 **웹사이트 구축 핵심 특징:**
• 온라인 매출 300% 증대
• SEO 최적화 및 모바일 퍼스트
• AI 기반 콘텐츠 마케팅
• 무료 1년 사후관리
• 브랜드 가치 극대화

📊 **검증된 성과:**
• 온라인 매출 300% 증대
• 1년차 ROI 1,667%
• 월 방문자 15,000명 달성
• 온라인 문의 월 200건

🎯 **온라인 브랜드 구축 5단계:**
1. 브랜드 전략 (아이덴티티 + 스토리텔링 + 차별화)
2. 웹사이트 구축 (반응형 디자인 + SEO 최적화)
3. 콘텐츠 마케팅 (블로그 + 영상 + SNS 통합)
4. 온라인 광고 (구글/네이버 검색광고 + 리타게팅)
5. 성과 분석 (애널리틱스 + 전환 추적 + ROI 분석)

🏆 **성공사례: G제조업**
• 기존 상황: 오프라인 영업 100%, 연매출 5억원
• 성과 결과: 온라인 매출 연 15억원 달성 (전체 매출의 75%)
• 투자 대비 효과: 1년차 ROI 1,667%

💡 **서비스 패키지:**
• 반응형 웹사이트 구축
• SEO 최적화
• 콘텐츠 마케팅
• 구글/네이버 광고
• 성과 분석 및 최적화

🤖 **AI 기반 디지털 마케팅:**
• AI 고객상담 챗봇 구축
• 24시간 자동 응답 시스템
• 개인화 마케팅 자동화
• 데이터 기반 고객 행동 분석

현재 비즈니스와 온라인 마케팅 목표를 알려주시면 맞춤형 디지털 전환 전략을 제시해드리겠습니다.

📞 **디지털 마케팅 상담:** 010-9251-9743`
    ]
  },

  'tax-calculator': {
    keyword: ['세금계산기', '세금계산', '세무', '세금', '소득세', '법인세'],
    responses: [
      `세금계산기에 대해 문의해주셔서 감사합니다! M-CENTER에서 제공하는 2024년 최신 세율 기반 세금계산기를 소개해드리겠습니다.

🧮 **제공 중인 세금계산기 종류:**
• 소득세 계산기
• 법인세 계산기
• 부가가치세 계산기
• 상속세 계산기
• 증여세 계산기
• 양도소득세 계산기
• 종합소득세 계산기
• 원천징수세 계산기
• 주식양도세 계산기
• 사업승계세 계산기

✨ **주요 기능:**
• 2024년 최신 세율 적용
• 실시간 세액 계산
• 세금 절약 팁 제공
• 상세 계산 과정 표시
• PDF 결과 다운로드

💡 **세무 최적화 서비스:**
• 절세 전략 수립
• 세무 신고 대행
• 세무 리스크 진단
• 세무 컨설팅

🌐 **세금계산기 바로가기:**
https://m-center.co.kr/tax-calculator

구체적인 세금 계산이나 절세 상담이 필요하시면 언제든 연락주세요.

📞 **세무 상담:** 010-9251-9743`
    ]
  },

  'pricing': {
    keyword: ['비용', '가격', '견적', '돈', '요금', '수수료', '예산'],
    responses: [
      `비용에 대해 문의해주셔서 감사합니다! M-CENTER의 6대 핵심서비스는 대부분 정부지원을 받아 비용 부담을 최소화할 수 있습니다.

💰 **정부지원 활용 가능 서비스:**

🤖 **AI 생산성향상**
• 고용노동부 일터혁신 100% 지원
• 기업 부담: 0원

🏭 **정책자금 확보**
• 컨설팅 비용 100% 정부지원
• 성공 수수료 방식 적용

🚀 **기술창업 지원**
• 정부 R&D 연계 지원
• 창업 지원금 활용

🏆 **인증지원**
• 인증 취득 비용 80% 지원
• 연간 5천만원 세제혜택으로 비용 회수

💡 **비용 대비 효과 분석:**
• 평균 ROI: 400%
• 정부지원 활용률: 85%
• 비용 회수 기간: 평균 6개월

🎯 **맞춤형 견적:**
기업 규모, 업종, 필요 서비스에 따라 맞춤형 견적을 제공해드립니다.

📞 **견적 상담:** 010-9251-9743

구체적인 서비스와 기업 상황을 알려주시면 정확한 비용과 정부지원 방안을 안내해드리겠습니다.`
    ]
  },

  'government': {
    keyword: ['정부지원', '정부', '지원금', '보조금', '정책자금', '정부사업'],
    responses: [
      `정부지원에 대해 문의해주셔서 감사합니다! M-CENTER는 고용노동부 일터혁신 수행기관으로서 다양한 정부지원사업을 연계하여 기업 성장을 지원하고 있습니다.

🎯 **M-CENTER 정부지원 연계 서비스:**

🤖 **AI 생산성향상**
• 고용노동부 일터혁신 상생컨설팅 100% 지원
• 지원 대상: 20-99인 기업
• 지원 내용: 컨설팅 비용 전액 지원

💰 **정책자금 확보**
• 업종별 맞춤형 정책자금 매칭
• 평균 확보 금액: 15억원
• 금리: 1.5-2.5% (시중은행 대비 3-4%p 절감)

🚀 **기술창업 지원**
• 정부 R&D 과제 연계 지원
• 평균 확보 금액: 5억원
• 성공률: 87%

🏆 **인증지원**
• 벤처기업/이노비즈 인증
• 연간 5천만원 세제혜택
• 100% 취득 보장

🌐 **디지털 전환 지원**
• AI바우처: 2천만원
• 디지털 전환 지원금: 1천만원
• 온라인 마케팅 지원

📊 **정부지원 활용 성과:**
• 정부지원 활용률: 95%
• 평균 지원금액: 15억원
• 기업 성장률: 평균 180%

구체적인 업종과 기업 규모를 알려주시면 최적의 정부지원사업을 매칭해드리겠습니다.

📞 **정부지원 상담:** 010-9251-9743`
    ]
  }
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