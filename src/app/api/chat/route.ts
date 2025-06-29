import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { safeGet, validateApiResponse, collectErrorInfo } from '@/lib/utils/safeDataAccess';
import { getGeminiKey, isDevelopment, maskApiKey } from '@/lib/config/env';

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

// Gemini 클라이언트 초기화 (보안 강화)
let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    try {
      const apiKey = getGeminiKey();
      
      if (isDevelopment()) {
        console.log('✅ Gemini API Key 설정 완료:', maskApiKey(apiKey));
      }
      
      geminiClient = new GoogleGenerativeAI(apiKey);
      
      if (isDevelopment()) {
        console.log('🤖 Gemini 클라이언트 초기화 완료:', {
          apiKeyMasked: maskApiKey(apiKey),
        });
      }
    } catch (error) {
      console.error('Gemini 클라이언트 초기화 실패:', error);
      throw new Error('Gemini API 설정을 확인해주세요');
    }
  }
  
  return geminiClient;
}

// M-CENTER 서비스별 차별화 포인트와 우수성 데이터베이스 (2025년 업데이트)
const mCenterExcellence = {
  'business-analysis': {
    name: 'BM ZEN 사업분석',
    differentiators: [
      '5단계 BM ZEN 프레임워크 (가치 발견→창출→제공→포착→교정)',
      '실제 기업 데이터 기반 진단 (추상적 이론 NO)',
      'AI 도구 직접 구현 및 운영 지원',
      '30일 내 가시적 결과, 6개월 ROI 300% 보장'
    ],
    excellence: [
      '생산성 42% 향상 (㈜한국정밀기계 실제 성과)',
      '품질 불량률 78% 감소 (3.2% → 0.7%)',
      '6개월 ROI 290-680% 달성',
      'AI 품질검사 정확도 96.8%'
    ],
    realResults: [
      '㈜한국정밀기계: 생산성 42% 향상, ROI 290% (자동차부품)',
      'IT 서비스 기업: 업무 효율성 87% 향상, 신규 수익원 창출',
      '중견 제조업: 의사결정 속도 60% 향상, 예측 정확도 90%'
    ],
    governmentLink: '스마트공장 구축 지원사업, 디지털 전환 지원 연계'
  },
  'ai-productivity': {
    name: '2025년 일터혁신 상생컨설팅 - AI 활용 생산성향상',
    differentiators: [
      '고용노동부 노사발전재단 주관 공식 인증 프로그램',
      '9개 분야 19개 요구사항 체계적 일터혁신',
      '20-99인 기업 100% 정부지원 (완전무료)',
      'AI 기술 융합 전통 인사제도 혁신'
    ],
    excellence: [
      '업무 효율성 40% 향상 (정부 검증)',
      '근로시간 관리 AI 자동화 구현',
      '인사평가제도 AI 기반 혁신',
      'AI 챗봇 소통 시스템 구축'
    ],
    realResults: [
      '제조업체: 제안서 작성 50% 단축',
      '서비스업: 고객 만족도 25% 향상',
      '중소기업: 운영 비용 30% 절감'
    ],
    governmentLink: '고용노동부 일터혁신 상생컨설팅 (20~99인 100% 무료)'
  },
  'factory-auction': {
    name: '경매활용 공장구매',
    differentiators: [
      '25년 부동산 경매 전문 노하우',
      '전국 공장 경매 정보 독점 네트워크',
      '법무팀 연계 안전한 낙찰 보장',
      '투자 리스크 최소화 시스템'
    ],
    excellence: [
      '부동산 비용 30-50% 절감',
      '평균 40% 저가 매입 성공',
      '95% 이상 안전 낙찰률',
      '투자 대비 200-500% ROI'
    ],
    realResults: [
      '제조업체 G: 15억 공장을 9억에 낙찰 (40% 절약)',
      '물류업체 H: 연간 임대료 3억 → 자가 소유로 전환',
      '식품업체 I: 확장 이전비용 60% 절감'
    ],
    governmentLink: '중소기업 시설자금 대출, 정책자금과 연계'
  },
  'tech-startup': {
    name: '기술사업화/기술창업',
    differentiators: [
      '정부 R&D 과제 선정률 78% (전국 평균 25%)',
      '특허 출원 전문팀 보유',
      '기술가치평가 전문 인력',
      'VC/액셀러레이터 네트워크 연결'
    ],
    excellence: [
      '평균 5억원 이상 정부지원 확보',
      '기술가치평가 3배 상승',
      '투자유치 성공률 65%',
      '사업화 성공률 82%'
    ],
    realResults: [
      'AI 스타트업 J: 25억원 Series A 투자 유치',
      '바이오텍 K: 정부과제 12억원 + 민간투자 8억원',
      '제조기술 L: 특허 기반 연매출 50억 달성'
    ],
    governmentLink: 'TIPS, 창업도약패키지, 기술보증기금 연계'
  },
  'certification': {
    name: '인증지원 (ISO/벤처/연구소)',
    differentiators: [
      '인증 취득률 92% (업계 최고)',
      '신속 인증 프로세스 (기존 대비 50% 단축)',
      '사후 관리 서비스 포함',
      '세제혜택 최대화 컨설팅'
    ],
    excellence: [
      '연간 세제혜택 5천만원 이상',
      '대기업 납품 자격 확보',
      'B2B 신뢰도 300% 향상',
      '기업 가치 평가 상승'
    ],
    realResults: [
      '중견기업 M: ISO 인증으로 대기업 납품 계약 30억',
      '벤처기업 N: 벤처 인증으로 세액공제 8천만원',
      '연구소 O: 기업부설연구소로 R&D 세액공제 3억'
    ],
    governmentLink: '벤처기업 확인, 연구소 설립 신고 지원'
  },
  'website': {
    name: '매출증대 웹사이트 구축',
    differentiators: [
      'SEO 최적화 전문팀 (구글 상위노출 보장)',
      '전환율 최적화 (CVR) 전문성',
      '업종별 특화 디자인 템플릿',
      '마케팅 자동화 시스템 구축'
    ],
    excellence: [
      '온라인 문의 300-500% 증가',
      '매출 직접 연결율 85%',
      '구글 검색 상위 3페이지 진입 보장',
      '모바일 최적화 완벽 구현'
    ],
    realResults: [
      '제조업체 P: 월 문의 20건 → 150건 (7.5배)',
      '서비스업 Q: 온라인 매출 월 2천만원 달성',
      '유통업체 R: 브랜드 검색량 10배 증가'
    ],
    governmentLink: '온라인 판로개척 지원사업, 디지털 바우처 연계'
  },
  'tax-calculator': {
    name: '전문 세금계산기 시스템',
    differentiators: [
      '11개 전문 세금계산기 통합 제공',
      '2024년 최신 세법 완벽 반영',
      '실시간 정확한 세금 계산',
      '개인/법인/전문세금 모든 분야 지원'
    ],
    excellence: [
      '100% 정확한 세금 계산 보장',
      '복잡한 세무 계산 3초 내 완료',
      '전문가 수준의 세무 분석 제공',
      '세금 절약 방안 자동 제안'
    ],
    realResults: [
      '개인사업자 S: 종합소득세 계산으로 200만원 절세',
      '중소기업 T: 법인세 최적화로 연간 500만원 절약',
      '부동산 투자자 U: 양도소득세 사전 계산으로 투자 결정'
    ],
    governmentLink: '세무 신고 지원 및 절세 컨설팅 연계 가능'
  }
};

// 질문 유형별 서비스 매칭 키워드 (2025년 업데이트)
const serviceKeywords = {
  'business-analysis': [
    'BM ZEN', '5단계', '프레임워크', '가치발견', '가치창출', '가치제공', '가치포착', '가치교정',
    '사업분석', '비즈니스모델', '생산성향상', '품질개선', 'ROI', '스마트생산', '실제검증',
    '사업전략', '수익성', '비즈니스', 'BM', '사업개선', '경영컨설팅', '한국정밀기계'
  ],
  'ai-productivity': [
    '일터혁신', '상생컨설팅', '고용노동부', '노사발전재단', '20인', '99인', '100%무료',
    'AI', '인공지능', '생산성', '효율성', '자동화', '근로시간관리', '인사평가제도',
    '디지털전환', '스마트워크', '업무효율', '조직문화', '소통활성화', '교육훈련'
  ],
  'factory-auction': [
    '경매', '공장구매', '부동산', '공장', '임대료', '자가', '투자',
    '부동산비용', '고정비', '사업장', '공장이전', '확장'
  ],
  'tech-startup': [
    '기술사업화', '창업', '스타트업', '특허', 'R&D', '기술개발',
    '투자유치', '정부과제', '기술창업', '사업화', 'VC', '액셀러레이터'
  ],
  'certification': [
    '인증', 'ISO', '벤처기업', '연구소', '세액공제', '세제혜택',
    '품질인증', '기업인증', '벤처확인', '연구소설립', '세금'
  ],
  'website': [
    '웹사이트', '홈페이지', '온라인', '마케팅', 'SEO', '검색',
    '온라인마케팅', '디지털마케팅', '인터넷', '온라인판매'
  ],
  'tax-calculator': [
    '세금계산기', '세금계산', '세무', '세금', '소득세', '법인세', '부가가치세',
    '상속세', '증여세', '양도소득세', '원천징수', '종합소득세', '근로소득세',
    '가업상속', '주식양도', '세무계산', '세금신고', '절세', '세무상담'
  ]
};

// 질문에서 관련 서비스 식별
function identifyRelevantServices(message: string): string[] {
  const relevantServices: string[] = [];
  const lowerMessage = message.toLowerCase();

  for (const [serviceKey, keywords] of Object.entries(serviceKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      relevantServices.push(serviceKey);
    }
  }

  return relevantServices.length > 0 ? relevantServices : ['general'];
}

// 서비스별 상세 정보 생성
function generateServiceDetails(serviceKeys: string[]): string {
  if (serviceKeys.includes('general') || serviceKeys.length === 0) {
    return `
🏢 **M-CENTER 경영지도센터 - 대한민국 최고의 경영컨설팅**

✨ **6대 핵심 서비스의 차별화된 우수성**

${Object.values(mCenterExcellence).map(service => `
🚀 **${service.name}**
${service.differentiators.map(diff => `  ✓ ${diff}`).join('\n')}
📊 **검증된 성과**: ${service.excellence.slice(0, 2).join(', ')}
`).join('')}

💎 **M-CENTER만의 특별한 강점**
• 25년 경험의 검증된 전문성
• 정부 지원사업 연계 전문기관 
• 95% 이상의 높은 성공률
• 맞춤형 통합 솔루션 제공`;
  }

  return serviceKeys.map(serviceKey => {
    const service = mCenterExcellence[serviceKey as keyof typeof mCenterExcellence];
    if (!service) return '';

    return `
🏆 **${service.name} - M-CENTER 차별화 우수성**

💡 **독보적 차별화 포인트**
${service.differentiators.map(diff => `• ${diff}`).join('\n')}

📈 **검증된 탁월한 성과**
${service.excellence.map(exc => `• ${exc}`).join('\n')}

🎯 **실제 성공 사례**
${service.realResults.map(result => `• ${result}`).join('\n')}

💰 **정부지원 연계**: ${service.governmentLink}

---`;
  }).join('\n');
}

// GEMINI API 키 안전한 가져오기
let GEMINI_API_KEY: string;
try {
  GEMINI_API_KEY = getGeminiKey();
} catch (error) {
  GEMINI_API_KEY = ''; // 키가 없으면 빈 문자열
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

    // GEMINI API 키가 없거나 비어있으면 폴백 응답
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      console.warn('API_KEY가 설정되지 않았습니다. 폴백 응답을 사용합니다.');
      console.info('.env.local 파일에 API_KEY를 설정하면 실제 AI 응답을 사용할 수 있습니다.');
      return NextResponse.json({
        response: generateEnhancedFallbackResponse(message),
        source: 'fallback_no_key',
        timestamp: new Date().toISOString(),
        note: 'AI 기능을 위해 API 키 설정이 필요합니다.'
      }, {
        headers: getCorsHeaders()
      });
    }

    // AI API 호출 (향상된 재시도 로직)
    console.log('AI API 호출 시작:', { messageLength: message.length, hasApiKey: !!GEMINI_API_KEY });
    
    const maxRetries = 3;
    let lastError: any = null;
    
    for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
      try {
        if (retryCount > 0) {
          console.log(`재시도 ${retryCount}/${maxRetries - 1}...`);
          // 재시도 시 잠시 대기 (1초 * 재시도 횟수)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }

        // Google SDK 사용으로 변경 (더 안정적)
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `안녕하세요! 저는 28년간 수많은 기업과 함께 성장해온 M-CENTER의 이후경 경영지도사를 대신하는 전문상담사입니다.

오랜 현장 경험으로 얻은 노하우와 실제 검증된 성과를 바탕으로 친근하고 따뜻하게 상담해드리겠습니다.

M-CENTER의 실제 검증된 2025년 핵심 서비스들:

1. BM ZEN 5단계 프레임워크
   생산성 42% 향상, ROI 290% 달성한 실제 사례가 있습니다. 한국정밀기계 고객사의 생생한 변화를 직접 목격했습니다.

2. 2025년 일터혁신 상생컨설팅
   고용노동부에서 20-99인 기업에 100% 무료로 지원해드립니다. 정말 좋은 기회라 많은 고객분들께 추천드리고 있어요.

3. 스마트 생산시스템 구축
   품질 불량률을 78%나 줄인 놀라운 결과를 봤습니다. 96.8% 정확도로 기업들이 정말 만족해하세요.

4. 경매활용 공장구매
   25년간 쌓아온 부동산 경매 노하우로 30-50% 비용을 절감해드립니다. 안전한 낙찰을 위해 법무팀과도 긴밀히 협력하고 있어요.

5. 기술사업화/창업 지원
   평균 5억원 정부지원금 연계해드립니다. 기업들의 꿈이 현실이 되는 모습을 보는 것이 가장 보람됩니다.

6. 인증지원 (ISO/벤처/연구소)
   연간 5천만원 세제혜택을 받으실 수 있어요. 복잡한 절차도 차근차근 도와드립니다.

7. 웹사이트 구축
   온라인 매출 300-500% 증대시킨 사례들이 정말 많습니다. 디지털 시대에 맞춰 고객사들이 성공하는 모습이 뿌듯해요.

8. 전문 세금계산기 11종
   2024년 최신 세법을 완벽하게 반영했습니다. 복잡한 세무계산도 쉽게 하실 수 있어요.

실제 성공 사례 (한국정밀기계):
- 생산성 42% 향상 (하루 100개 → 142개 생산)
- 품질 불량률 78% 감소 (3.2% → 0.7%)
- 6개월 만에 ROI 290% 달성

28년간 수많은 기업과 함께하며 느낀 것은, 각 기업마다 고유한 상황과 목표가 있다는 점입니다. 그래서 정확한 비용이나 견적은 직접 상담을 통해 맞춤형으로 안내해드리는 것이 가장 좋습니다.

언제든 편하게 연락주세요! 010-9251-9743 (이후경 경영지도사)

사용자 질문: ${message}

위의 내용을 바탕으로 이후경 경영지도사의 28년 경험과 따뜻한 마음이 느껴지도록 친근하고 전문적으로 답변해주세요. 구체적인 수치와 실제 사례를 들어 신뢰성 있게 설명하되, 가격 관련 질문에는 "직접 상담을 통해 정확하게 안내해드리겠습니다"라고 답변해주세요. 

중요: 답변할 때는 마크다운 문법(**, ##, - 등)을 사용하지 말고 자연스러운 문체로 답변해주세요.`;

        const result = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4000, // 2000자 한국어 답변을 위해 4000 토큰으로 확대
          },
        });

        const response = await result.response;
        const aiResponse = response.text();

        console.log('AI API 성공:', { 
          responseLength: aiResponse.length, 
          retryCount
        });
        
        return NextResponse.json({
          response: aiResponse,
          source: 'gemini-2.5-flash',
          timestamp: new Date().toISOString(),
          retryCount,
          usage: result.response.usageMetadata
        }, {
          headers: getCorsHeaders()
        });

      } catch (error) {
        lastError = error;
        console.error(`AI API 시도 ${retryCount + 1} 실패:`, error);
        
        // 마지막 재시도가 아니면 계속 시도
        if (retryCount < maxRetries - 1) {
          continue;
        }
      }
    }
    
    // 모든 재시도 실패 시 fallback 응답
    console.error('AI API 모든 재시도 실패, fallback 응답 사용');
    return NextResponse.json({
      response: generateEnhancedFallbackResponse(message),
      source: 'fallback_all_retries_failed',
      error: lastError?.message || '알 수 없는 오류',
      timestamp: new Date().toISOString(),
      note: 'AI 서버 연결 문제로 기본 응답을 제공합니다.'
    }, {
      headers: getCorsHeaders()
    });

  } catch (error) {
    console.error('❌ API 오류:', error);
    
    // body가 정의되지 않은 경우를 위한 안전장치
    const fallbackMessage = body?.message || '일반 상담';
    
    return NextResponse.json({
      response: generateEnhancedFallbackResponse(fallbackMessage),
      source: 'fallback_error',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString(),
      note: '일시적인 오류로 기본 응답을 제공합니다.'
    }, {
      headers: getCorsHeaders()
    });
  }
}

// 향상된 폴백 응답 생성 함수
function generateEnhancedFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  const relevantServices = identifyRelevantServices(message);
  
  // 서비스별 맞춤 응답
  if (relevantServices.length > 0 && !relevantServices.includes('general')) {
    const serviceDetails = generateServiceDetails(relevantServices);
    return `안녕하세요! M-CENTER 전문상담사입니다.

${serviceDetails}

전문가 직접 상담
이후경 경영지도사: 010-9251-9743
25년 경험의 검증된 전문성
95% 이상 성공률 보장

즉시 신청 가능한 서비스
무료 AI진단, 전문가 상담, 세금계산기

더 정확한 AI 응답을 원하시면 관리자에게 API 키 설정을 요청하세요!`;
  }
  
  // 일반적인 향상된 응답 (2025년 업데이트)
  return `안녕하세요! M-CENTER 전문상담사가 도움드리겠습니다!

대한민국 최고 수준의 경영컨설팅
25년 검증된 전문성, 실제 기업 성과 검증, 정부지원 전문기관

2025년 핵심 서비스 - 실제 검증 완료

1. BM ZEN 5단계 프레임워크 - 생산성 42% 향상, ROI 290% 달성
2. 2025년 일터혁신 상생컨설팅 - 20-99인 기업 100% 무료 (고용노동부)
3. 스마트 생산시스템 구축 - 품질 불량률 78% 감소, 정확도 96.8%
4. 기술창업 지원 - 평균 5억원 정부지원 연계
5. 각종 인증지원 - 연간 5천만원 세제혜택
6. 웹사이트 구축 - 온라인 매출 300-500% 증대
7. 전문 세금계산기 11종 - 2024년 최신 세법 완벽 반영

실제 기업 적용 사례 (한국정밀기계)
- 생산성 42% 향상 (100개 → 142개/일)
- 품질 불량률 78% 감소 (3.2% → 0.7%)
- 6개월 ROI 290% 달성

전문가 직접 상담
이후경 경영지도사: 010-9251-9743
차별화된 기술우위, 맞춤 솔루션, 성과 보장

온라인 서비스
무료 AI진단 - 3분 완료
전문가 상담 신청 - 24시간 접수
세금계산기 활용 - 즉시 계산

"${message}" 관련해서 더 구체적인 상담이 필요하시면 위 연락처로 직접 연락주세요!`;
}

// 기존 폴백 응답 생성 함수
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('매출') || lowerMessage.includes('수익') || lowerMessage.includes('사업분석')) {
    return `💰 **매출 증대 전문 컨설팅**

🏆 **BM ZEN 사업분석 서비스**
• 독자적 프레임워크로 95% 성공률 보장
• 평균 20-40% 매출 증대 실현
• 3개월 내 가시적 성과 창출

📊 **실제 성공 사례:**
• A 제조업체: 8개월 만에 45% 매출 증가
• B IT서비스: 6개월 만에 수익률 60% 개선
• C 유통업체: 4개월 만에 30% 효율성 향상

📞 **무료 상담: 010-9251-9743**
🔗 [무료 AI진단 신청](/services/diagnosis)

💡 **지금 바로 상담받으시면 맞춤형 분석 리포트를 무료로 제공해드립니다!**`;
  }

  if (lowerMessage.includes('ai') || lowerMessage.includes('효율') || lowerMessage.includes('자동화') || lowerMessage.includes('생산성')) {
    return `🤖 **AI 생산성향상 컨설팅**

✨ **ChatGPT 전문 활용법**
• 업무효율 40-60% 향상 보장
• 인건비 25% 절감 효과
• 실무진 1:1 맞춤 교육

🎯 **정부지원 연계 서비스:**
• AI 바우처 최대 2천만원 지원
• 디지털 전환 100% 정부지원 가능

📊 **실제 성공 사례:**
• 건설업체: 견적서 작성 시간 80% 단축
• 마케팅업체: 콘텐츠 제작 효율 300% 향상
• 회계사무소: 업무처리 속도 5배 증가

📞 **무료 상담: 010-9251-9743**
🔗 [AI 생산성 진단 신청](/services/ai-productivity)
• 스마트팩토리 구축 지원

📈 **도입 효과:**
• 문서작업 시간 70% 단축
• 고객응대 품질 50% 향상
• 데이터 분석 속도 80% 개선

📞 **상담: 010-9251-9743**
🔗 [AI 생산성 서비스](/services/ai-productivity)`;
  }

  if (lowerMessage.includes('공장') || lowerMessage.includes('부동산') || lowerMessage.includes('경매') || lowerMessage.includes('임대')) {
    return `🏭 **경매활용 공장구매 컨설팅**

💎 **25년 경매 전문 노하우**
• 부동산비용 30-50% 절감 실현
• 평균 40% 저가 매입 성공률
• 95% 안전 낙찰률 보장

🎯 **실제 성공 사례:**
• 15억 공장을 9억에 낙찰 (40% 절약)
• 연간 임대료 3억 → 자가 소유 전환
• 물류창고 50% 비용절감 달성

🔍 **전문 서비스:**
• 경매물건 사전조사 및 분석
• 법적 리스크 완벽 검토
• 낙찰 후 등기까지 원스톱 지원

📞 **상담: 010-9251-9743**
🔗 [경매 컨설팅 상세정보](/services/factory-auction)`;
  }

  if (lowerMessage.includes('창업') || lowerMessage.includes('기술사업화') || lowerMessage.includes('정부지원')) {
    return `🚀 **기술창업 & 사업화 컨설팅**

💰 **정부지원 연계 서비스**
• 평균 5억원 정부지원 확보
• R&D 과제 기획부터 완료까지
• 사업화 성공률 85% 달성

🎯 **주요 지원 분야:**
• 기술개발 (R&D) 최대 10억원
• 사업화 자금 최대 5억원
• 마케팅 지원 최대 2억원
• 해외진출 최대 3억원

📋 **성공 프로세스:**
1. 기술 및 시장성 분석
2. 정부과제 매칭 및 기획
3. 사업계획서 작성 지원
4. 발표 및 심사 대비

📞 **상담: 010-9251-9743**
🔗 [기술창업 지원](/services/tech-startup)`;
  }

  if (lowerMessage.includes('상담') || lowerMessage.includes('연락') || lowerMessage.includes('문의')) {
    return `💬 **전문가 무료 상담 안내**

📞 **즉시 상담 (24시간):**
• 전화: 010-9251-9743 (이후경 경영지도사)
• 이메일: hongik423@gmail.com
• 카카오톡: M-CENTER 검색

⚡ **온라인 신청:**
• [무료 AI진단](/services/diagnosis) - 3분 완료
• [전문가 상담](/consultation) - 맞춤형 솔루션
• [서비스 상세보기](/services/business-analysis)

🏆 **상담 전문가 소개:**
• 이후경 경영지도사 (25년 경력)
• 중소벤처기업부 인증 컨설턴트
• 1,000+ 기업 성공 컨설팅 경험

💡 **상담 혜택:**
• 초기 상담 100% 무료
• 맞춤형 솔루션 제안
• 정부지원사업 연계 안내`;
  }

  if (lowerMessage.includes('세금') || lowerMessage.includes('세무') || lowerMessage.includes('소득세') || lowerMessage.includes('법인세') || lowerMessage.includes('부가가치세') || lowerMessage.includes('상속세') || lowerMessage.includes('증여세') || lowerMessage.includes('양도소득세') || lowerMessage.includes('세금계산')) {
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

🔗 **세금계산기 바로가기**: [/tax-calculator](/tax-calculator)

📞 **세무 전문 상담**: 010-9251-9743
💡 **복잡한 세무는 전문가와 상담 후 신고하시기 바랍니다!**`;
  }

  return `✨ **기업의별 M-CENTER**에서 도움드리겠습니다!

🎯 **맞춤형 솔루션 제공 분야:**

• 📈 **매출 증대 컨설팅** - BM ZEN 사업분석으로 20-40% 성장
• 🤖 **AI 생산성향상** - ChatGPT 활용으로 업무효율 60% 향상
• 🏭 **경매활용 공장구매** - 30-50% 부동산비용 절감
• 🚀 **기술창업 지원** - 평균 5억원 정부지원 연계
• 📋 **각종 인증지원** - 연간 5천만원 세제혜택
• 🌐 **웹사이트 구축** - 온라인 매출 30% 증대
• 🧮 **전문 세금계산기** - 11개 계산기로 정확한 세무 계산

🏆 **25년 경험의 검증된 노하우**
• 1,000+ 기업 성공 컨설팅
• 95% 고객 만족도
• 정부 인증 전문 컨설턴트

더 구체적인 상담을 원하시면:
📞 **즉시 상담: 010-9251-9743**
🔗 **무료 진단: /services/diagnosis**
💬 **온라인 상담: /consultation**
🧮 **세금계산기: /tax-calculator**`;
}

// 🔧 GET 요청 처리 (CORS 및 상태 확인)
export async function GET(request: NextRequest) {
  try {
    // 환경변수 상태 확인 (민감한 정보 제외)
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    const isDev = process.env.NODE_ENV === 'development';
    
    return NextResponse.json({
      status: 'M-CENTER 전문상담 API가 정상 작동 중입니다.',
      timestamp: new Date().toISOString(),
      configured: hasApiKey,
      environment: process.env.NODE_ENV,
      services: Object.keys(mCenterExcellence),
      supportedMethods: ['GET', 'POST', 'OPTIONS'],
      // 개발 환경에서만 추가 정보 제공
      ...(isDev && {
        debug: {
          apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
          nodeVersion: process.version,
        }
      }),
    }, {
      headers: getCorsHeaders()
    });
  } catch (error) {
    console.error('GET /api/chat 오류:', error);
    return NextResponse.json(
      { 
        status: 'API 설정 오류',
        timestamp: new Date().toISOString(),
        configured: false,
        error: isDevelopment() ? String(error) : '내부 서버 오류'
      },
      { 
        status: 500,
        headers: getCorsHeaders()
      }
    );
  }
}

// 🔧 OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

// 🔧 PUT 요청 처리 (향후 확장용)
export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'PUT 메서드는 지원되지 않습니다.',
      supportedMethods: ['GET', 'POST', 'OPTIONS']
    },
    { 
      status: 405,
      headers: getCorsHeaders()
    }
  );
}

// 🔧 DELETE 요청 처리 (향후 확장용)
export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'DELETE 메서드는 지원되지 않습니다.',
      supportedMethods: ['GET', 'POST', 'OPTIONS']
    },
    { 
      status: 405,
      headers: getCorsHeaders()
    }
  );
}

// 🔧 PATCH 요청 처리 (향후 확장용)
export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'PATCH 메서드는 지원되지 않습니다.',
      supportedMethods: ['GET', 'POST', 'OPTIONS']
    },
    { 
      status: 405,
      headers: getCorsHeaders()
    }
  );
}

// 🔧 HEAD 요청 처리 (상태 확인용)
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
} 