import { NextRequest, NextResponse } from 'next/server';

// 🎯 질문 복잡도 분석 타입
type QuestionComplexity = 'consultation' | 'simple' | 'single-consulting' | 'complex-consulting';

// 🧠 고도화된 질문 분석 AI 엔진
class AdvancedQuestionAnalyzer {
  
  // 🔥 상담신청 관련 키워드 감지 (강화됨)
  static isConsultationRelated(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // 직접 상담 요청 키워드
    const directConsultationKeywords = [
      /상담.*신청|신청.*상담/i,
      /문의.*드리|드리.*문의/i,
      /도움.*필요|필요.*도움/i,
      /컨설팅.*받|받.*컨설팅/i,
      /진단.*받|받.*진단/i,
      /연락.*드리|전화.*드리/i
    ];
    
    // 서비스 관련 + 상담/문의 연결어
    const serviceWithConsultationKeywords = [
      /.*자세히.*설명.*해.*주세요/i,
      /.*어떻게.*진행.*되나요/i,
      /.*신청.*하려면|하려면.*신청/i,
      /.*받을.*수.*있나요|가능.*한가요/i,
      /.*궁금.*합니다|알고.*싶습니다/i,
      /.*문의.*드립니다|질문.*드립니다/i
    ];
    
    return directConsultationKeywords.some(pattern => pattern.test(lowerMessage)) ||
           serviceWithConsultationKeywords.some(pattern => pattern.test(lowerMessage));
  }
  
  // 🔍 단순 질문 감지 (더 정교해짐)
  static isSimpleQuestion(message: string): boolean {
    const trimmedMessage = message.trim();
    const lowerMessage = trimmedMessage.toLowerCase();
    
    // 🚨 컨설팅/서비스 관련 키워드가 있으면 단순 질문이 아님
    const consultingRelatedKeywords = [
      /ai.*생산성|생산성.*ai|일터혁신|업무.*효율/i,
      /bm.*zen|zen.*bm|사업.*분석|비즈니스.*모델/i,
      /경매.*활용|공장.*구매|부동산.*경매/i,
      /기술.*사업화|창업.*컨설팅|스타트업/i,
      /인증.*지원|iso.*인증|벤처.*인증/i,
      /웹사이트.*구축|홈페이지.*제작|디지털.*마케팅/i,
      /세금.*계산기|세무.*컨설팅|절세.*방법/i,
      /정부.*지원|지원금|보조금/i,
      /매출.*증대|마케팅.*전략|경영.*전략/i
    ];
    
    // 컨설팅 관련이면 단순 질문이 아님
    if (consultingRelatedKeywords.some(pattern => pattern.test(lowerMessage))) {
      return false;
    }
    
    // 진짜 단순한 인사/대화 패턴만 인식
    const genuineSimplePatterns = [
      /^(안녕|안녕하세요|hi|hello|헬로)$/i,
      /^(이름.*뭐|누구|누구.*세요|who.*are.*you)$/i,
      /^(감사|고마워|thank.*you|thanks)$/i,
      /^(좋은.*하루|잘.*부탁|화이팅)$/i,
      /^.{1,10}$/  // 10자 이하 매우 짧은 텍스트
    ];
    
    return genuineSimplePatterns.some(pattern => pattern.test(trimmedMessage));
  }
  
  // 🎯 단일 컨설팅 이슈 감지 (정교화됨)
  static isSingleConsultingIssue(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // 단일 서비스 영역 키워드
    const singleServiceKeywords = [
      /^.*bm.*zen.*(?!.*(?:ai|생산성|경매|창업|인증|웹사이트|세무))/i,
      /^.*ai.*생산성.*(?!.*(?:bm|zen|경매|창업|인증|웹사이트|세무))/i,
      /^.*경매.*(?!.*(?:ai|생산성|bm|zen|창업|인증|웹사이트|세무))/i,
      /^.*창업.*(?!.*(?:ai|생산성|bm|zen|경매|인증|웹사이트|세무))/i,
      /^.*인증.*(?!.*(?:ai|생산성|bm|zen|경매|창업|웹사이트|세무))/i,
      /^.*웹사이트.*(?!.*(?:ai|생산성|bm|zen|경매|창업|인증|세무))/i
    ];
    
    // 단일 이슈 키워드
    const singleIssueKeywords = [
      /비용|가격|견적|얼마/i,
      /기간|시간|소요|기한/i,
      /자격|조건|요건/i,
      /절차|과정|단계|프로세스/i,
      /효과|결과|성과/i
    ];
    
    const hasComplexIndicators = this.hasComplexIndicators(message);
    const hasSingleService = singleServiceKeywords.some(pattern => pattern.test(lowerMessage));
    const hasSingleIssue = singleIssueKeywords.some(pattern => pattern.test(lowerMessage));
    
    return (hasSingleService || hasSingleIssue) && !hasComplexIndicators;
  }
  
  // 🚀 복합 컨설팅 영역 감지 (대폭 강화됨)
  static isComplexQuestion(message: string): boolean {
    return this.hasComplexIndicators(message);
  }
  
  // 🔍 복합성 지표 감지 (새로운 메서드)
  static hasComplexIndicators(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // 🎯 복수 서비스 조합 패턴
    const multipleServiceCombinations = [
      /bm.*zen.*ai.*생산성|ai.*생산성.*bm.*zen/i,
      /ai.*생산성.*경매|경매.*ai.*생산성/i,
      /창업.*인증.*웹사이트|웹사이트.*창업.*인증/i,
      /사업.*분석.*정부.*지원.*세무/i,
      /ai.*생산성.*창업.*컨설팅/i,
      /bm.*zen.*정부.*지원.*프로그램/i
    ];
    
    // 🔗 복합 연결어/접속사
    const complexConnectors = [
      /그리고.*또한|및.*그리고|와.*함께.*더불어/i,
      /동시에.*진행|함께.*받고.*싶|통합.*으로/i,
      /종합.*적으로|전체.*적으로|포괄.*적으로/i,
      /[&+]|,.*그리고|,.*및|,.*와|,.*과/i,
      /여러.*가지|다양.*한.*영역|복수.*의/i
    ];
    
    // 🧠 전략적/고도화 키워드
    const strategicComplexityKeywords = [
      /전략.*수립|로드맵.*구축|마스터.*플랜/i,
      /시너지.*효과|상승.*효과|복합.*효과/i,
      /통합.*시스템|종합.*솔루션|올.*인.*원/i,
      /디지털.*전환|혁신.*프로그램|트랜스포메이션/i,
      /성장.*전략|사업.*확장|스케일.*업/i,
      /조직.*개편|경영.*혁신|구조.*조정/i,
      /투자.*유치|m&a|기업.*인수/i,
      /최적화.*방안|효율화.*전략|경쟁력.*강화/i
    ];
    
    // 📊 복잡도 지표 계산
    const multipleServicesDetected = multipleServiceCombinations.some(pattern => pattern.test(lowerMessage));
    const complexConnectorsDetected = complexConnectors.some(pattern => pattern.test(lowerMessage));
    const strategicKeywordsDetected = strategicComplexityKeywords.some(pattern => pattern.test(lowerMessage));
    
    // 서비스 개수 카운트
    const serviceCount = this.countServices(message);
    
    // 복합성 판단 로직
    return multipleServicesDetected || 
           (complexConnectorsDetected && message.length > 30) ||
           strategicKeywordsDetected ||
           serviceCount >= 2;
  }
  
  // 📊 서비스 개수 카운트
  static countServices(message: string): number {
    const lowerMessage = message.toLowerCase();
    const serviceKeywords = [
      /bm.*zen|사업.*분석/i,
      /ai.*생산성|일터.*혁신/i,
      /경매.*활용|공장.*구매/i,
      /기술.*사업화|창업.*컨설팅/i,
      /인증.*지원|iso.*인증/i,
      /웹사이트.*구축|홈페이지.*제작/i,
      /세금.*계산기|세무.*컨설팅/i
    ];
    
    return serviceKeywords.filter(pattern => pattern.test(lowerMessage)).length;
  }
  
  // 📊 종합 분석 (고도화됨)
  static analyzeQuestion(message: string): QuestionComplexity {
    const trimmedMessage = message.trim();
    
    // 🎯 1순위: 상담신청 관련
    if (this.isConsultationRelated(trimmedMessage)) {
      return 'consultation';
    }
    
    // 🎯 2순위: 복합 컨설팅 (우선순위 상승)
    if (this.isComplexQuestion(trimmedMessage)) {
      return 'complex-consulting';
    }
    
    // 🎯 3순위: 단순 질문
    if (this.isSimpleQuestion(trimmedMessage)) {
      return 'simple';
    }
    
    // 🎯 4순위: 단일 컨설팅 (나머지)
    return 'single-consulting';
  }
}

// 🎭 고도화된 이후경 경영지도사 AI 응답 생성기
class EnhancedLeeHukyungAI {
  
  // 🧠 모든 답변에 AI 연계 (완전 AI 기반)
  static async generateSmartResponse(
    origin: string, 
    message: string, 
    complexity: QuestionComplexity
  ): Promise<{ response: string; shouldShowButtons: boolean }> {
    
    try {
      // 🎭 복잡도별 맞춤형 프롬프트 생성
      const prompt = this.createSmartPrompt(message, complexity);
      
      console.log(`🤖 AI 연계 호출 시작 (${complexity}):`, { messageLength: message.length });

      // 🚀 실제 AI API 호출
      const aiResponse = await fetch(`${origin}/api/chat-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: prompt,
          context: `이후경 경영지도사 25년 경험 ${complexity} 상담`
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        let response = aiData.response || '';
        
        console.log('✅ AI 연계 응답 성공:', { 
          originalLength: response.length,
          complexity 
        });
        
        // 📏 복잡도별 글자수 제한 및 품질 향상
        response = this.enhanceResponse(response, complexity);
        
        // 🔘 버튼 표시 여부 결정
        const shouldShowButtons = this.shouldShowConsultationButtons(message, complexity, response);
        
        console.log('🎭 고도화된 응답 생성 완료:', { 
          finalLength: response.length,
          shouldShowButtons
        });
        
        return { response, shouldShowButtons };
        
      } else {
        throw new Error(`AI API 응답 실패: ${aiResponse.status}`);
      }
      
    } catch (error) {
      console.error('❌ AI 연계 오류:', error);
      
      // 🛡️ 폴백: 고품질 정적 응답
      const fallbackResponse = this.generateFallbackResponse(message, complexity);
      const shouldShowButtons = complexity !== 'simple';
      
      return { response: fallbackResponse, shouldShowButtons };
    }
  }
  
  // 🧠 복잡도별 맞춤형 프롬프트 생성
  static createSmartPrompt(message: string, complexity: QuestionComplexity): string {
    const basePersona = `당신은 이후경 경영지도사입니다. 25년간 500개 이상 기업과 함께 성장해온 현장 경험이 풍부한 경영 전문가입니다.

🎯 당신의 정체성:
- 이름: 이후경 경영지도사
- 경험: 25년 현장 경험, 500개 기업 성공 지도
- 전문 분야: BM ZEN 사업분석, AI 생산성향상, 경매활용 공장구매, 기술사업화, 인증지원, 웹사이트 구축
- 성격: 친근하고 전문적이며, 실무 중심의 구체적 조언 제공
- 말투: "25년 경험상...", "실제로 제가 도운 기업에서는..." 같은 경험담 포함

💼 응답 스타일:
- 구체적인 수치와 실제 사례 제시 (예: "생산성 42% 향상", "매출 300% 증대")
- 실행 가능한 솔루션 중심의 조언
- 정부지원 프로그램 연계 안내
- 따뜻하고 친근하면서도 전문적인 톤앤매너`;

    // 복잡도별 맞춤형 프롬프트
    switch (complexity) {
      case 'simple':
        return `${basePersona}

📝 응답 가이드라인:
- 간단하지만 따뜻하고 친근한 인사/대화
- 자연스럽게 M-CENTER 소개 포함
- 100-200자 정도의 적절한 길이
- 마지막에 "더 궁금한 점이 있으시면 언제든 말씀해 주세요!" 추가

질문: "${message}"

위 질문에 대해 이후경 경영지도사로서 친근하고 따뜻한 응답을 해주세요.`;

      case 'single-consulting':
        return `${basePersona}

📝 응답 가이드라인:
- 해당 분야에 대한 전문적이고 구체적인 설명
- 실제 성공 사례와 구체적 수치 포함
- 정부지원 프로그램이나 혜택 안내
- 실행 가능한 실무 조언 제공
- 800-1500자 정도의 충분한 설명
- 자연스럽게 추가 상담 안내로 마무리

질문: "${message}"

위 질문에 대해 전문적이고 실용적인 답변을 해주세요.`;

      case 'complex-consulting':
        return `${basePersona}

📝 응답 가이드라인:
- 복합적/전략적 이슈에 대한 통합적 접근법 제시
- 여러 영역의 시너지 효과 설명
- 단계별 실행 로드맵 제시
- 실제 통합 컨설팅 성공 사례 포함
- 2000-3000자의 상세하고 체계적인 설명
- 복합 컨설팅의 가치와 효과 강조
- 맞춤형 직접 상담의 필요성 안내

질문: "${message}"

위 질문에 대해 종합적이고 전략적인 관점에서 답변해주세요.`;

      case 'consultation':
        return `${basePersona}

📝 응답 가이드라인:
- 상담 신청에 대한 환영과 감사 표현
- M-CENTER의 전문 서비스 영역 소개
- 25년 경험의 차별화 포인트 강조
- 구체적인 상담 진행 방법 안내
- 직접 연락처와 상담 시간 안내
- 600-800자 정도의 전문적인 상담 안내

질문: "${message}"

위 질문에 대해 전문 상담 안내를 해주세요.`;

      default:
        return `${basePersona}

질문: "${message}"

위 질문에 대해 이후경 경영지도사로서 전문적이고 친근한 답변을 해주세요.`;
    }
  }
  
  // 🎭 응답 품질 향상 및 톤앤매너 보장
  static enhanceResponse(response: string, complexity: QuestionComplexity): string {
    let enhanced = response;
    
    // 🎯 이후경 경영지도사 정체성 보장
    if (!enhanced.includes('이후경')) {
      enhanced = `안녕하세요! 이후경입니다.\n\n${enhanced}`;
    }
    
    // 📞 연락처 자연스럽게 추가
    if (!enhanced.includes('010-9251-9743')) {
      if (complexity === 'simple') {
        enhanced += '\n\n더 궁금한 점이 있으시면 언제든 말씀해 주세요! 😊';
      } else {
        enhanced += '\n\n📞 직접 상담: 010-9251-9743';
      }
    }
    
    // 📏 복잡도별 길이 조정
    const maxLengths = {
      'simple': 300,
      'single-consulting': 2000,
      'complex-consulting': 4000,
      'consultation': 1000
    };
    
    const maxLength = maxLengths[complexity] || 2000;
    if (enhanced.length > maxLength) {
      enhanced = enhanced.slice(0, maxLength - 150) + 
                 '\n\n더 자세한 내용은 직접 상담을 통해 안내해드리겠습니다.\n📞 010-9251-9743';
    }
    
    // 🎨 감정 표현 및 친근함 추가
    if (complexity === 'simple' && !enhanced.includes('😊') && !enhanced.includes('🙋')) {
      enhanced = enhanced.replace('안녕하세요! 이후경입니다.', '안녕하세요! 이후경입니다. 😊');
    }
    
    return enhanced;
  }
  
  // 🔘 상담 버튼 표시 여부 결정 (지능형)
  static shouldShowConsultationButtons(message: string, complexity: QuestionComplexity, response: string): boolean {
    // simple 질문은 버튼 없음
    if (complexity === 'simple') {
      return false;
    }
    
    // consultation은 항상 버튼 표시
    if (complexity === 'consultation') {
      return true;
    }
    
    // 전문 상담이 필요한 컨설팅 관련 질문들
    const consultingNeedIndicators = [
      /구체적.*상황|맞춤.*형|개별.*상담/i,
      /정확.*한.*진단|세부.*분석|심층.*검토/i,
      /직접.*상담|전문.*상담|1:1.*상담/i,
      /더.*자세.*한|상세.*한.*안내/i
    ];
    
    const responseIndicatesConsulting = consultingNeedIndicators.some(pattern => 
      pattern.test(response)
    );
    
    // single-consulting이나 complex-consulting에서 전문 상담 필요성이 언급되면 버튼 표시
    return responseIndicatesConsulting || 
           complexity === 'complex-consulting' ||
           (complexity === 'single-consulting' && message.length > 20);
  }
  
  // 🛡️ 고품질 폴백 응답 생성
  static generateFallbackResponse(message: string, complexity: QuestionComplexity): string {
    switch (complexity) {
      case 'simple':
        return `안녕하세요! 이후경입니다. 😊

25년간 500개 이상 기업과 함께 성장해온 경영지도사로서 언제든 도움 드릴 준비가 되어 있어요.

더 궁금한 점이 있으시면 언제든 말씀해 주세요!`;

      case 'consultation':
        return `안녕하세요! 이후경 경영지도사입니다.

상담 문의해주셔서 감사합니다! 25년간 500개 이상 기업의 성장을 함께해온 경험으로 정확하고 실용적인 솔루션을 제공해드리겠습니다.

🎯 전문 상담 분야:
• BM ZEN 사업분석 (신규사업 성공률 95%)
• AI 생산성향상 (20-99인 기업 100% 무료)
• 경매활용 공장구매 (30-50% 절감)
• 기술사업화/창업 (평균 5억원 지원)
• 인증지원 (연간 5천만원 세제혜택)
• 웹사이트 구축 (매출 300-500% 증대)

📞 직접 상담: 010-9251-9743
⏰ 상담시간: 평일 09:00-18:00 (토요일 예약 가능)`;

      case 'complex-consulting':
        return `정말 전략적이고 포괄적인 질문을 해주셨네요!

25년 경험상, 이런 복합적인 이슈들은 기업의 현재 상황과 목표를 정확히 파악한 후 통합적으로 접근해야 최적의 결과를 얻을 수 있습니다.

각 영역별 시너지 효과와 단계적 실행 로드맵을 맞춤형으로 설계해드리겠습니다.

📞 전문 상담: 010-9251-9743
더 구체적인 상황을 직접 상담을 통해 들어보고 최적의 통합 전략을 제시해드리겠습니다.`;

      default:
        return `좋은 질문이네요!

25년 현장 경험을 바탕으로 구체적이고 실용적인 답변을 드리기 위해 조금 더 자세한 상황을 알려주시면 좋겠어요.

📞 직접 상담: 010-9251-9743
더 정확한 맞춤형 솔루션을 제시해드리겠습니다.`;
    }
  }
}

// 🔘 상담신청 버튼 생성 (개선됨)
function generateConsultationButtons(): Array<{ text: string; url: string; style: string; icon: string }> {
  return [
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
  ];
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
    
    // 🧠 고도화된 질문 복잡도 분석
    const complexity = AdvancedQuestionAnalyzer.analyzeQuestion(message.trim());
    console.log('🔍 고도화된 이후경 경영지도사 AI 분석:', { 
      message: message.trim(), 
      complexity,
      messageLength: message.length,
      serviceCount: AdvancedQuestionAnalyzer.countServices(message.trim())
    });
    
    // 🚀 AI 기반 스마트 응답 생성
    const { response, shouldShowButtons } = await EnhancedLeeHukyungAI.generateSmartResponse(
      request.nextUrl.origin, 
      message.trim(), 
      complexity
    );
    
    // 🔘 버튼 생성 결정
    let buttons = null;
    if (shouldShowButtons) {
      buttons = generateConsultationButtons();
    }
    
    console.log('✅ 고도화된 이후경 경영지도사 AI 응답 완료:', { 
      complexity,
      responseLength: response.length,
      hasButtons: !!buttons,
      aiEnhanced: true
    });
    
    return NextResponse.json({
      response,
      ...(buttons && { buttons }),
      source: 'enhanced_lee_hukyung_ai_system',
      complexity,
      timestamp: new Date().toISOString(),
      consultant: '이후경 경영지도사',
      experience: '25년 현장 경험',
      responseLength: response.length,
      systemVersion: 'v2.0_enhanced'
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('❌ 고도화된 이후경 경영지도사 AI 오류:', error);
    
    return NextResponse.json({
      response: `안녕하세요! 이후경입니다. 😊

일시적으로 시스템에 문제가 있지만, 걱정하지 마세요.

25년 현장 경험으로 직접 상담해드릴 수 있으니까 편하게 전화주세요.

📞 직접 상담: 010-9251-9743

더 정확하고 실용적인 솔루션을 제시해드리겠습니다!`,
      source: 'enhanced_lee_hukyung_fallback',
      complexity: 'simple',
      timestamp: new Date().toISOString(),
      consultant: '이후경 경영지도사',
      experience: '25년 현장 경험',
      systemVersion: 'v2.0_enhanced_fallback'
    }, { status: 200 });
  }
} 