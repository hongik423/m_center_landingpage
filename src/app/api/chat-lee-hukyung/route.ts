import { NextRequest, NextResponse } from 'next/server';

// 🎯 질문 복잡도 분석 타입
type QuestionComplexity = 'consultation' | 'simple' | 'single-consulting' | 'complex-consulting';

// 🧠 질문 분석 AI 엔진
class QuestionAnalyzer {
  
  // 상담신청 관련 키워드 감지
  static isConsultationRelated(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return /상담|문의|도움|컨설팅|도와|해결|필요|신청|연락|전화|상세|자세히|알고싶|궁금|어떻게|방법|진단|점검|검토|분석|가능한지|할 수 있는지|해줄 수 있|처리|지원|추천|제안/i.test(lowerMessage);
  }
  
  // 단순 질문 감지
  static isSimpleQuestion(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    const simplePatterns = [
      /^(안녕|hi|hello|처음|시작)/i,
      /^(이름|누구|who)/i,
      /^(시간|몇시|when)/i,
      /^(어디|where)/i,
      /^(감사|고마워|thank)/i,
      /.{1,20}$/  // 20자 이하 짧은 질문
    ];
    return simplePatterns.some(pattern => pattern.test(message));
  }
  
  // 단일 컨설팅 이슈 감지
  static isSingleConsultingIssue(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    const singleIssueKeywords = [
      // 단일 서비스 영역
      /^(bm zen|사업분석|비즈니스모델)(?!.*[&+그리고및])/i,
      /^(ai.*생산성|생산성.*ai)(?!.*[&+그리고및])/i,
      /^(경매|공장구매)(?!.*[&+그리고및])/i,
      /^(기술사업화|창업)(?!.*[&+그리고및])/i,
      /^(인증|iso)(?!.*[&+그리고및])/i,
      /^(웹사이트|홈페이지)(?!.*[&+그리고및])/i,
      /^(세금계산기|세무)(?!.*[&+그리고및])/i,
      // 단일 이슈
      /비용|가격|견적/i,
      /정부지원|지원금/i,
      /기간|시간|스케줄/i
    ];
    return singleIssueKeywords.some(pattern => pattern.test(lowerMessage)) && !this.isComplexQuestion(message);
  }
  
  // 복합 컨설팅 영역 감지
  static isComplexQuestion(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // 복합 서비스 키워드 감지
    const multipleServices = [
      /bm zen.*ai.*생산성/i,
      /ai.*생산성.*경매/i,
      /창업.*인증.*웹사이트/i,
      /사업분석.*정부지원.*세무/i
    ];
    
    // 복합 연결어 감지
    const complexConnectors = [
      /그리고|및|와|과|또한|동시에|함께|통합/i,
      /[&+]/,
      /여러|다양한|종합적인|전체적인|통합적인/i
    ];
    
    // 전략적/복합적 키워드
    const strategicKeywords = [
      /전략|로드맵|계획|설계|구축|시스템|프로세스/i,
      /최적화|효율화|혁신|디지털전환/i,
      /성장전략|사업확장|M&A|투자유치/i,
      /조직개편|인사제도|경영진단/i
    ];
    
    return multipleServices.some(pattern => pattern.test(lowerMessage)) ||
           (complexConnectors.some(pattern => pattern.test(lowerMessage)) && message.length > 50) ||
           strategicKeywords.some(pattern => pattern.test(lowerMessage));
  }
  
  // 📊 종합 분석
  static analyzeQuestion(message: string): QuestionComplexity {
    if (this.isConsultationRelated(message)) {
      return 'consultation';
    } else if (this.isSimpleQuestion(message)) {
      return 'simple';
    } else if (this.isComplexQuestion(message)) {
      return 'complex-consulting';
    } else {
      return 'single-consulting';
    }
  }
}

// 🎭 이후경 경영지도사 톤앤매너 응답 생성기
class LeeHukyungResponseGenerator {
  
  // 👋 단순 질문 응답 (제한 없음)
  static generateSimpleResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (/^(안녕|hi|hello)/i.test(message)) {
      return `안녕하세요! 이후경입니다. 반갑습니다! 😊

25년간 500개 이상 기업과 함께 성장해온 경영지도사로서 언제든 도움 드릴 준비가 되어 있어요.

M-CENTER에서 어떤 도움이 필요하신지 편하게 말씀해 주세요!`;
    }
    
    if (/이름|누구/i.test(message)) {
      return `저는 이후경 경영지도사입니다! 🙋‍♂️

25년간 현장에서 500개 이상 기업의 성장을 함께해온 경험을 바탕으로 실무진들과 직접 소통하며 상담해드리고 있어요.

기업의별 M-CENTER를 통해 정말 실용적이고 검증된 솔루션들을 제공하고 있습니다!`;
    }
    
    if (/시간|몇시/i.test(message)) {
      return `상담 시간은 평일 오전 9시부터 오후 6시까지 운영하고 있어요! ⏰

긴급한 경우에는 토요일도 예약 상담 가능합니다.

직통 연락처는 010-9251-9743이니까 언제든 편하게 연락주세요!`;
    }
    
    return `네, 말씀해 주셔서 감사합니다! 

25년 현장 경험으로 더 구체적이고 실용적인 답변을 드릴 수 있도록 질문을 좀 더 자세히 해주시면 좋겠어요.

어떤 부분이 궁금하신지 편하게 말씀해 주세요! 😊`;
  }
  
  // 📋 단일 컨설팅 이슈 응답 (최대 2000자)
  static generateSingleConsultingResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // BM ZEN 사업분석
    if (/bm zen|사업분석|비즈니스모델/i.test(lowerMessage)) {
      return `BM ZEN 사업분석에 대해 문의해주셨네요! 정말 좋은 선택이에요. 💪

28년 컨설팅 경험을 집약한 저희만의 독자적 프레임워크입니다.

🔥 **실제 검증된 성과 (한국정밀기계 사례)**:
• 생산성 42% 향상 (하루 100개 → 142개 생산)
• 품질 불량률 78% 감소 (3.2% → 0.7%)  
• 6개월 만에 ROI 290% 달성
• AI 품질검사 정확도 96.8%

💡 **BM ZEN 5단계 프레임워크**:
**1단계 - 가치 발견**: 현재 비즈니스 모델 진단
**2단계 - 가치 창출**: 새로운 수익원 발굴
**3단계 - 가치 제공**: 고객 가치 전달 체계
**4단계 - 가치 포착**: 수익성 최적화
**5단계 - 가치 교정**: 지속적 개선 시스템

다른 컨설팅과 차이점은 '추상적 이론'이 아닌 '실제 데이터 기반'으로 진행한다는 것입니다. 고객사의 실제 데이터를 분석해서 구체적인 개선안을 제시하죠.

28년 경험상, 사업분석은 '진단'에서 끝나면 안 되고 '실행 가능한 솔루션'까지 제시해야 진짜 효과가 나타나요.

정확한 비용과 적용 방안은 기업 규모와 상황에 따라 달라지니, 직접 상담을 통해 맞춤형으로 안내해드리겠습니다.

📞 무료 상담: 010-9251-9743`.slice(0, 2000);
    }
    
    // AI 생산성향상
    if (/ai.*생산성|생산성.*ai|일터혁신/i.test(lowerMessage)) {
      return `AI 생산성향상! 정말 시의적절한 질문이에요. 2025년 올해가 정말 기회입니다! 🚀

고용노동부 노사발전재단에서 주관하는 '일터혁신 상생컨설팅'이 있어요.

🎁 **20-99인 기업 100% 정부지원 (완전무료)**:
• 업무 효율성 40% 향상 (정부 검증)
• AI 기반 근로시간 관리 자동화
• 인사평가제도 혁신 구축
• 조직 소통 활성화 시스템

💪 **실제 적용 사례들**:
• **제조업체**: 제안서 작성 시간 50% 단축
• **서비스업**: 고객 만족도 25% 향상  
• **중소기업**: 운영 비용 30% 절감

🤖 **구체적 AI 도구 활용**:
• ChatGPT, Claude 업무 적용 교육
• 회사 전체 AI 시스템 구축
• 부서별 맞춤형 AI 워크플로우 설계
• AI 기반 업무 자동화 시스템

28년 경험상, AI 도입은 '선택'이 아닌 '필수'가 되었습니다. 지금 시작하지 않으면 2-3년 후 경쟁에서 뒤처질 수밖에 없어요.

특히 ChatGPT, Claude 같은 AI 도구들을 업무에 실제로 적용하는 방법을 단계별로 교육해드리고, 회사 전체 시스템으로 구축해드립니다.

100% 정부지원이니 부담 없이 시작하실 수 있어요!

📞 무료 상담: 010-9251-9743`.slice(0, 2000);
    }
    
    // 기본 단일 이슈 응답
    return `좋은 질문이네요! 

28년 현장 경험을 바탕으로 말씀드리면, 이 부분은 기업마다 상황이 조금씩 다를 수 있어서 정확한 진단과 맞춤형 솔루션이 필요해요.

저희 M-CENTER에서는 이런 이슈들을 체계적으로 분석하고 실제 검증된 방법들로 해결해드리고 있습니다.

구체적인 상황을 알려주시면 더 정확하고 실용적인 답변을 드릴 수 있어요. 직접 상담을 통해 맞춤형으로 안내해드리겠습니다.

📞 무료 상담: 010-9251-9743`.slice(0, 2000);
  }
  
  // 🧠 복합 컨설팅 영역 응답 (최대 4000자)
  static generateComplexConsultingResponse(message: string): string {
    return `정말 포괄적이고 전략적인 질문을 해주셨네요! 👏

28년간 500개 이상 기업과 함께해온 경험으로 말씀드리면, 이런 복합적인 이슈들은 통합적인 접근이 필요해요.

🎯 **통합 컨설팅 접근법**

**1단계: 현황 진단 및 우선순위 설정**
• 기업 전체 비즈니스 모델 분석 (BM ZEN 프레임워크)
• 각 영역별 현재 수준 진단
• ROI 기준 우선순위 매트릭스 구성
• 단계별 실행 로드맵 수립

**2단계: 핵심 영역 통합 최적화**
• AI 생산성향상 + 사업분석 통합
• 정부지원 프로그램 전략적 활용
• 기술사업화와 인증 연계 전략
• 디지털 전환과 비즈니스 모델 혁신

**3단계: 시너지 효과 극대화**
• 각 영역별 상호 연관성 분석
• 통합 실행 시 상승 효과 창출
• 리스크 분산 및 안정성 확보
• 지속 가능한 성장 동력 구축

🔥 **실제 통합 컨설팅 성공 사례**

**중견 제조기업 H사 (직원 150명)**:
• **BM ZEN 사업분석** → 신규 사업 영역 3개 발굴
• **AI 생산성향상** → 전사 업무 효율 35% 증대
• **기술사업화 지원** → 정부 R&D 8억원 확보
• **인증 통합 전략** → ISO + 벤처인증 동시 취득
• **웹사이트 리뉴얼** → 온라인 매출 450% 증가
• **최종 결과**: 18개월 만에 연매출 68% 증가

**스타트업 I사 (직원 45명)**:
• **창업 → 성장 → 투자유치** 전체 프로세스 설계
• **AI 도입** → 개발 생산성 60% 향상
• **정부지원** → TIPS 15억 + 민간투자 25억 확보
• **최종 결과**: 3년 만에 유니콘 기업 도약

💡 **통합 컨설팅의 핵심 노하우**

**시너지 창출 전략**:
• 각 영역이 독립적이 아닌 유기적 연결
• 단계별 성과가 다음 단계 동력으로 활용
• 정부지원과 민간 투자의 전략적 조합
• 내부 역량과 외부 자원의 최적 배분

**리스크 관리**:
• 복합 프로젝트의 변수 관리 시스템
• 단계별 점검 및 조정 메커니즘
• 예상 문제점 사전 대응 방안
• 안정적 성과 확보를 위한 안전장치

**성과 극대화**:
• 각 영역별 KPI 설정 및 통합 관리
• 단기 성과와 중장기 전략의 균형
• 지속가능한 성장 동력 확보
• 기업 가치 전반의 상승 효과

28년 경험상, 이런 복합적인 이슈들은 '종합적 설계'와 '단계적 실행'이 핵심입니다. 

각 영역을 따로따로 접근하면 효과가 제한적이지만, 통합적으로 설계하고 실행하면 1+1이 3이 되는 시너지 효과를 만들 수 있어요.

다만 복합 컨설팅은 기업의 현재 상황, 규모, 목표, 자원 등을 정확히 파악한 후 맞춤형으로 설계해야 합니다.

구체적인 상황을 직접 상담을 통해 들어보고, 최적의 통합 전략을 제시해드리겠습니다.

📞 전문 상담: 010-9251-9743
💬 상세 논의를 위한 직접 미팅도 가능합니다.`.slice(0, 4000);
  }
}

// 🎯 상담신청 버튼 생성
function generateConsultationButtons(): { buttons: Array<{ text: string; url: string; style: string; icon: string }> } | null {
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

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message?.trim()) {
      return NextResponse.json(
        { error: '메시지가 비어있습니다.' },
        { status: 400 }
      );
    }
    
    // 🧠 질문 복잡도 분석
    const complexity = QuestionAnalyzer.analyzeQuestion(message.trim());
    console.log('🔍 이후경 경영지도사 AI 분석:', { 
      message: message.trim(), 
      complexity,
      messageLength: message.length
    });
    
    let response: string;
    let buttons = null;
    
    // 📊 복잡도별 응답 생성
    switch (complexity) {
      case 'consultation':
        // 상담신청 관련 → 기존 /api/chat 활용
        const consultationResponse = await fetch(`${request.nextUrl.origin}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: message.trim() }),
        });
        
        if (consultationResponse.ok) {
          const data = await consultationResponse.json();
          response = data.response;
          buttons = data.buttons;
        } else {
          response = '상담 문의해주셔서 감사합니다. 직접 전화로 연락 주시면 더 정확한 상담을 받으실 수 있어요. 📞 010-9251-9743';
          buttons = generateConsultationButtons()?.buttons;
        }
        break;
        
      case 'simple':
        response = LeeHukyungResponseGenerator.generateSimpleResponse(message.trim());
        break;
        
      case 'single-consulting':
        response = LeeHukyungResponseGenerator.generateSingleConsultingResponse(message.trim());
        break;
        
      case 'complex-consulting':
        response = LeeHukyungResponseGenerator.generateComplexConsultingResponse(message.trim());
        break;
        
      default:
        response = LeeHukyungResponseGenerator.generateSingleConsultingResponse(message.trim());
    }
    
    console.log('✅ 이후경 경영지도사 AI 응답 완료:', { 
      complexity,
      responseLength: response.length,
      hasButtons: !!buttons
    });
    
    return NextResponse.json({
      response,
      ...(buttons && { buttons }),
      source: 'lee_hukyung_ai_advanced',
      complexity,
      timestamp: new Date().toISOString(),
      consultant: '이후경 경영지도사',
      experience: '25년 현장 경험',
      responseLength: response.length
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('❌ 이후경 경영지도사 AI 오류:', error);
    
    return NextResponse.json({
      response: `안녕하세요! 이후경입니다.

일시적으로 시스템에 문제가 있지만, 걱정하지 마세요. 

28년 현장 경험으로 직접 상담해드릴 수 있으니까 편하게 전화주세요.

📞 직접 상담: 010-9251-9743

더 정확하고 실용적인 솔루션을 제시해드리겠습니다! 😊`,
      source: 'lee_hukyung_fallback',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString(),
      consultant: '이후경 경영지도사'
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
} 