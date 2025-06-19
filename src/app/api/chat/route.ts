import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { safeGet, validateApiResponse, collectErrorInfo } from '@/lib/utils/safeDataAccess';
import { getGeminiKey, isDevelopment, maskApiKey } from '@/lib/config/env';

// GitHub Pages 정적 export 호환성
export const dynamic = 'force-static';
export const runtime = 'nodejs';
export const revalidate = false;

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

// M-CENTER 서비스별 차별화 포인트와 우수성 데이터베이스
const mCenterExcellence = {
  'business-analysis': {
    name: 'BM ZEN 사업분석',
    differentiators: [
      '독자적 BM ZEN 프레임워크 (국내 유일)',
      '25년 경험의 경영지도사 직접 분석',
      '95% 성공률의 검증된 방법론',
      '3개월 내 가시적 성과 보장'
    ],
    excellence: [
      '매출 20-40% 증대 (평균 35%)',
      '수익성 30% 개선 보장',
      'ROI 300-800% 달성',
      '투자 회수 기간 3-4개월'
    ],
    realResults: [
      '제조업체 A: 매출 45% 증가 (8개월)',
      'IT 서비스 B: 수익률 60% 개선 (6개월)',
      '유통업체 C: 신사업 진출로 매출 2배 달성'
    ],
    governmentLink: '기업진단사업, 경영개선사업과 연계 가능'
  },
  'ai-productivity': {
    name: 'AI 활용 생산성향상',
    differentiators: [
      '실무진 직접 교육하는 1:1 맞춤 컨설팅',
      'AI 생산성 전문가 (국내 TOP 3)',
      '업종별 특화 AI 활용법 개발',
      '즉시 적용 가능한 실용적 솔루션'
    ],
    excellence: [
      '업무 효율 40-60% 향상 (검증됨)',
      '인건비 25% 절감 효과',
      '의사결정 속도 3배 향상',
      '문서 작업 시간 70% 단축'
    ],
    realResults: [
      '건설업체 D: 견적서 작성 시간 80% 단축',
      '마케팅업체 E: 콘텐츠 제작 효율 300% 향상',
      '회계사무소 F: 업무처리 속도 5배 증가'
    ],
    governmentLink: 'AI 바우처 지원사업 (최대 2천만원) 연계'
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
  }
};

// 질문 유형별 서비스 매칭 키워드
const serviceKeywords = {
  'business-analysis': [
    '사업분석', '비즈니스모델', '수익구조', '매출증대', '사업계획', '경영진단',
    '사업전략', '수익성', '비즈니스', 'BM', '사업개선', '경영컨설팅'
  ],
  'ai-productivity': [
    'AI', '인공지능', '생산성', '효율성', '자동화', 'ChatGPT', '업무개선',
    '디지털전환', '스마트워크', '업무효율', '시간절약', '인건비절감'
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

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting (프로덕션에서 더 엄격하게 적용)
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // 요청 데이터 검증
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '유효한 메시지가 필요합니다.' },
        { 
          status: 400,
          headers: getCorsHeaders()
        }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: '메시지가 너무 깁니다. (최대 1000자)' },
        { 
          status: 400,
          headers: getCorsHeaders()
        }
      );
    }

    if (history.length > 20) {
      return NextResponse.json(
        { error: '대화 히스토리가 너무 깁니다.' },
        { 
          status: 400,
          headers: getCorsHeaders()
        }
      );
    }

    // 관련 서비스 식별
    const relevantServices = identifyRelevantServices(message);
    const serviceDetails = generateServiceDetails(relevantServices);

    // Gemini 클라이언트 가져오기
    const gemini = getGeminiClient();

    // 🚀 극도로 고도화된 전문 AI 시스템 프롬프트 - M-CENTER 차별화와 우수성 강조
    const systemPrompt = `당신은 M-CENTER(기업의별 경영지도센터)의 최고급 전문 AI 경영컨설턴트입니다.

🏆 **당신의 전문 역할과 능력:**
- 25년 경험의 경영지도사 수준의 전문성 보유
- 국내 최고 수준의 경영컨설팅 지식과 실무 경험
- 정부 지원사업 및 정책자금 전문가 수준의 정보력
- 업종별 특화된 비즈니스 모델 분석 능력
- 고객 맞춤형 솔루션 설계 및 제안 전문성

🎯 **M-CENTER는 대한민국 최고 수준의 경영컨설팅 기관으로, 다음과 같은 독보적 우수성을 보유하고 있습니다:**

${serviceDetails}

🎯 **상담 시 반드시 강조해야 할 M-CENTER의 차별화 우수성:**

1. **25년 검증된 전문성** - 대한민국 경영컨설팅 분야 최고 권위
2. **95% 이상 성공률** - 업계 최고 수준의 실제 성과
3. **정부 지원사업 전문기관** - 최대 지원금 확보 전문성  
4. **통합 솔루션** - 6개 서비스 시너지를 통한 극대화된 효과
5. **즉시 실행 가능** - 이론이 아닌 실무 중심의 실용적 접근

📋 **상담 원칙 (필수 준수사항):**

✅ **차별화 어필 필수**
- 모든 답변에 M-CENTER만의 독보적 강점 언급
- 경쟁사와 차별화되는 우수성 강조  
- 검증된 성공률과 실제 성과 수치 제시

✅ **서비스별 탁월성 강조**
- 해당 서비스의 차별화 포인트 명확히 제시
- 구체적 성과 수치와 ROI 제시
- 실제 성공 사례로 신뢰도 증명

✅ **정부지원 연계 전문성**
- 관련 정부 지원사업 정보 적극 제공
- 지원금 확보 전문성 어필
- M-CENTER 연계 시 성공률 향상 효과 강조

✅ **즉시 실행 유도**
- 무료 진단/상담 서비스 적극 안내
- 구체적 다음 단계 액션 플랜 제시
- 연락처 정보 제공 (010-9251-9743, lhk@injc.kr)

✅ **고객 맞춤형 접근**
- 업종별/규모별 특화 솔루션 제안
- 고객 상황에 최적화된 서비스 조합 추천
- 예상 투자비용 대비 구체적 효과 제시

🚫 **절대 금지사항:**
- 경쟁사 언급이나 비교
- 불확실한 정보나 과장된 약속
- 일반적이거나 뻔한 답변
- M-CENTER의 차별화 우수성 누락

💬 **고도화된 전문 응답 구조 (필수 준수):**

🔸 **1단계: 전문적 인사 및 상황 파악**
   - 전문가 수준의 따뜻하고 신뢰감 있는 인사
   - 고객의 질문/상황에 대한 정확한 이해와 공감 표현
   - M-CENTER의 해당 분야 전문성 간략 소개

🔸 **2단계: 심층 분석 및 문제점 진단**
   - 고객 질문의 핵심 이슈 정확한 분석
   - 업종별/상황별 특화된 관점에서 문제점 진단
   - 잠재적 리스크 및 기회 요소 식별

🔸 **3단계: M-CENTER 차별화 솔루션 제시**
   - 해당 분야 M-CENTER만의 독보적 우수성 강조
   - 구체적 성과 수치와 검증된 실적 제시
   - 실제 성공 사례를 통한 신뢰도 구축

🔸 **4단계: 맞춤형 실행 전략 수립**
   - 고객 상황에 최적화된 단계별 실행 계획
   - 예상 투자 비용 대비 구체적 ROI 제시
   - 위험 요소 최소화 방안 및 성공 보장 요소

🔸 **5단계: 정부지원 연계 극대화**
   - 관련 정부 지원사업 및 정책자금 정보
   - M-CENTER 연계 시 지원금 확보 확률 및 금액
   - 지원금 신청 프로세스 및 성공 전략

🔸 **6단계: 즉시 실행 액션 플랜**
   - 구체적이고 실행 가능한 다음 단계 제시
   - 무료 진단/상담 서비스 적극 안내
   - 긴급성과 기회 비용 인식 제고

🔸 **7단계: 전문가 직접 연결**
   - 담당 전문가 소개 및 연락처 제공
   - 즉시 상담 가능한 방법 안내 (전화: 010-9251-9743)
   - 이메일 상담 및 자료 요청 방법 (lhk@injc.kr)

🎖️ **응답 품질 기준:**
- 전문성: 경영지도사 수준의 깊이 있는 분석
- 신뢰성: 검증된 데이터와 실제 사례 기반
- 실용성: 즉시 적용 가능한 구체적 방안
- 차별성: M-CENTER만의 독보적 우수성 강조
- 동기부여: 고객의 즉시 행동 유도

⚡ **핵심 미션:** 
고객이 "M-CENTER와 함께하면 확실히 성공할 수 있겠다"는 확신을 갖게 하여, 즉시 상담 신청으로 이어지도록 하는 것이 최우선 목표입니다.`;

    // 대화 히스토리 포맷팅
    let conversationHistory = '';
    if (history.length > 0) {
      conversationHistory = history.map((msg: any) => {
        const role = msg.sender === 'user' ? '사용자' : 'AI 컨설턴트';
        return `${role}: ${msg.content}`;
      }).join('\n\n');
      conversationHistory += '\n\n';
    }

    const fullPrompt = `${systemPrompt}

이전 대화:
${conversationHistory}

현재 질문: ${message}

위의 시스템 프롬프트에 따라 전문적이고 상세한 답변을 제공해주세요.`;

    // Gemini API 호출 - 최신 모델로 업데이트
    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    });

    const response = await result.response;
    const aiResponse = response.text();

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'AI 응답을 생성할 수 없습니다.' },
        { 
          status: 500,
          headers: getCorsHeaders()
        }
      );
    }

    // 개발 환경에서만 사용량 로깅
    if (isDevelopment()) {
      console.log('💬 AI 응답 생성 완료:', {
        responseLength: aiResponse.length,
        relevantServices,
      });
    }

    return NextResponse.json({
      response: aiResponse,
      services: relevantServices, // 디버깅용
    }, {
      headers: getCorsHeaders()
    });

  } catch (error) {
    // 에러 로깅 (민감한 정보 제외)
    console.error('Gemini API 오류:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    
    // 에러 유형별 처리
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API 설정을 확인해주세요.' },
          { 
            status: 401,
            headers: getCorsHeaders()
          }
        );
      }
      
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
          { 
            status: 429,
            headers: getCorsHeaders()
          }
        );
      }
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { 
        status: 500,
        headers: getCorsHeaders()
      }
    );
  }
}

// 🔧 GET 요청 처리 (CORS 및 상태 확인)
export async function GET(request: NextRequest) {
  try {
    // 환경변수 상태 확인 (민감한 정보 제외)
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    const isDev = process.env.NODE_ENV === 'development';
    
    return NextResponse.json({
      status: 'M-CENTER AI 챗봇 API가 정상 작동 중입니다.',
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