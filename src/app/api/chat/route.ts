import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getOpenAIKey, isDevelopment, maskApiKey } from '@/lib/config/env';

// OpenAI 클라이언트 초기화 (보안 강화)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    try {
      const apiKey = getOpenAIKey();
      
      if (isDevelopment()) {
        console.log('✅ OpenAI API Key 설정 완료:', maskApiKey(apiKey));
      }
      
      openaiClient = new OpenAI({
        apiKey: apiKey,
      });
      
      if (isDevelopment()) {
        console.log('🤖 OpenAI 클라이언트 초기화 완료:', {
          apiKeyMasked: maskApiKey(apiKey),
        });
      }
    } catch (error) {
      console.error('OpenAI 클라이언트 초기화 실패:', error);
      throw new Error('OpenAI API 설정을 확인해주세요');
    }
  }
  
  return openaiClient;
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
      'ChatGPT 업무 적용 전문가 (국내 TOP 3)',
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
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: '메시지가 너무 깁니다. (최대 1000자)' },
        { status: 400 }
      );
    }

    if (history.length > 20) {
      return NextResponse.json(
        { error: '대화 히스토리가 너무 깁니다.' },
        { status: 400 }
      );
    }

    // 관련 서비스 식별
    const relevantServices = identifyRelevantServices(message);
    const serviceDetails = generateServiceDetails(relevantServices);

    // OpenAI 클라이언트 가져오기
    const openai = getOpenAIClient();

    // 강화된 시스템 프롬프트 - M-CENTER 차별화와 우수성 강조
    const systemPrompt = `당신은 M-CENTER(기업의별 경영지도센터)의 전문 AI 상담사입니다. M-CENTER는 대한민국 최고 수준의 경영컨설팅 기관으로, 다음과 같은 독보적 우수성을 보유하고 있습니다:

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

💬 **응답 형식:**
1. 인사 및 M-CENTER 소개
2. 질문 내용 파악 및 공감
3. 관련 서비스의 차별화 우수성 강조
4. 구체적 해결책과 예상 효과
5. 정부지원 연계 방안
6. 즉시 실행 가능한 액션 플랜
7. 무료 상담 안내 및 연락처

항상 M-CENTER의 독보적 우수성을 자신감 있게 어필하며, 고객이 즉시 행동할 수 있도록 동기부여하는 답변을 제공하세요.`;

    // 대화 히스토리를 OpenAI 메시지 형식으로 변환
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // OpenAI API 호출 (향상된 모델 사용)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // 빠른 응답을 위한 효율적 모델
      messages,
      max_tokens: 800, // 더 상세한 답변을 위해 토큰 증가
      temperature: 0.8, // 창의적이고 열정적인 답변
      stream: false,
      user: `ip_${ip}`,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'AI 응답을 생성할 수 없습니다.' },
        { status: 500 }
      );
    }

    // 개발 환경에서만 사용량 로깅
    if (isDevelopment()) {
      console.log('💬 AI 응답 생성 완료:', {
        tokensUsed: completion.usage,
        responseLength: aiResponse.length,
        relevantServices,
      });
    }

    return NextResponse.json({
      response: aiResponse,
      usage: completion.usage,
      services: relevantServices, // 디버깅용
    });

  } catch (error) {
    // 에러 로깅 (민감한 정보 제외)
    console.error('OpenAI API 오류:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    
    // 에러 유형별 처리
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API 설정을 확인해주세요.' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: '일시적으로 서비스를 이용할 수 없습니다.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

// GET 요청으로 API 상태 확인 (보안 강화)
export async function GET() {
  try {
    // 환경변수 상태 확인 (민감한 정보 제외)
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    
    return NextResponse.json({
      status: 'M-CENTER AI 챗봇 API가 활성화되었습니다.',
      timestamp: new Date().toISOString(),
      configured: hasApiKey,
      environment: process.env.NODE_ENV,
      services: Object.keys(mCenterExcellence),
      // API 키는 노출하지 않고 존재 여부만 확인
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'API 설정 오류',
        timestamp: new Date().toISOString(),
        configured: false 
      },
      { status: 500 }
    );
  }
} 