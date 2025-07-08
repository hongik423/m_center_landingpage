import { NextRequest, NextResponse } from 'next/server';

// 🎯 고도화된 질문 분류 시스템 (4개 그룹)
type QuestionCategory = 
  | 'simple-greeting'           // 단순인사
  | 'consultation-request'      // 정해진 상담신청 문의
  | 'single-service'           // 단순한 단일 서비스 문의  
  | 'complex-strategic';       // 복합적인 서비스문의/산업전문/전략 질문

// 🎭 이후경 경영지도사 전용 질문 분석기
class QuestionAnalyzer {
  
  // 🧠 고도화된 질문 분류 (4개 카테고리)
  static categorizeQuestion(message: string): QuestionCategory {
    const msg = message.toLowerCase().trim();
    
    // 1️⃣ 단순인사 (50-150자 응답)
    const greetingPatterns = [
      /^(안녕|하이|hi|hello|좋은|처음|시작)/,
      /^(감사|고마워|최고|훌륭|멋져|좋아|네|예|오케이|ok)/,
      /^(ㅋ|ㄷㄷ|ㅎㅎ|ㅇㅇ|맞|그래|알겠)/,
      /인사|처음뵙|만나서반가|반갑/
    ];
    
    if (greetingPatterns.some(pattern => pattern.test(msg)) || msg.length <= 15) {
      return 'simple-greeting';
    }
    
    // 2️⃣ 정해진 상담신청 문의 (800-1200자 응답)
    const consultationPatterns = [
      /상담.*신청|신청.*상담|상담.*받고싶|상담.*문의/,
      /전화.*상담|직접.*상담|면담|미팅/,
      /컨설팅.*받고싶|컨설팅.*신청|도움.*받고싶/,
      /연락.*드리고싶|연락처|전화번호/,
      /만나서.*이야기|직접.*만나/
    ];
    
    if (consultationPatterns.some(pattern => pattern.test(msg))) {
      return 'consultation-request';
    }
    
    // 4️⃣ 복합적인 서비스문의/산업전문/전략 질문 (2000-4000자 응답)
    const complexPatterns = [
      // 복합 서비스 조합
      /.*?(그리고|또한|또|추가로|더불어|아울러|동시에|같이|함께).*?(서비스|지원|컨설팅)/,
      
      // 전략적/산업전문 키워드
      /전략|로드맵|마스터플랜|통합.*방안|종합.*계획/,
      /산업.*전망|시장.*분석|업계.*동향|경쟁.*분석/,
      /디지털.*전환|디지털.*혁신|4차.*산업|스마트.*팩토리/,
      /비즈니스.*모델|수익.*구조|매출.*다각화/,
      
      // 복합적 문제 해결
      /.*?(문제|이슈|과제).*?(해결|개선|혁신|최적화)/,
      /.*?(효율|생산성|수익성).*?(향상|증대|개선)/,
      
      // 상세 설명 요청
      /자세히|상세히|구체적으로|완전히|전체적으로|포괄적으로/,
      /사례|경험|실적|성과|결과.*알고싶/,
      
      // 장문의 질문 (200자 이상)
    ];
    
    if (complexPatterns.some(pattern => pattern.test(msg)) || 
        msg.length > 200 ||
        (msg.split(/그리고|또한|또|추가로|더불어|아울러|동시에/).length > 2)) {
      return 'complex-strategic';
    }
    
    // 3️⃣ 단순한 단일 서비스 문의 (기본값, 1000-2000자 응답)
    return 'single-service';
  }
  
  // 📏 카테고리별 응답 길이 가이드라인 
  static getResponseGuidelines(category: QuestionCategory): {
    minLength: number;
    maxLength: number;
    tone: string;
    structure: string;
  } {
    switch (category) {
      case 'simple-greeting':
        return {
          minLength: 50,
          maxLength: 150,
          tone: '따뜻하고 친근한 인사, 간단한 자기소개',
          structure: '인사 → 간단한 M-CENTER 소개 → 친근한 마무리'
        };
        
      case 'consultation-request':
        return {
          minLength: 800,
          maxLength: 1200,
          tone: '환영하는 마음, 전문성 어필, 신뢰감 조성',
          structure: '환영인사 → 전문분야 소개 → 상담방법 안내 → 연락처 제공'
        };
        
      case 'single-service':
        return {
          minLength: 1000,
          maxLength: 2000,
          tone: '해박한 전문성, 실용적 조언, 명확한 방향 제시',
          structure: '공감 → 전문지식 설명 → 실제사례 → 구체적 방안 → 다음 액션'
        };
        
      case 'complex-strategic':
        return {
          minLength: 2000,
          maxLength: 4000,
          tone: '탁월한 통찰력, 전략적 사고, 체계적 접근, 깊이 있는 조언',
          structure: '문제 정확한 이해 → 다각도 분석 → 통합적 해결방안 → 단계별 실행계획 → 시너지 효과 → 맞춤 상담 제안'
        };
    }
  }
}

// 🎭 이후경 경영지도사 전용 응답 생성기
class LeeHukyungResponseGenerator {
  
  // 🎯 카테고리별 맞춤형 프롬프트 생성
  static createPrompt(message: string, category: QuestionCategory): string {
    const guidelines = QuestionAnalyzer.getResponseGuidelines(category);
    
    const basePersona = `당신은 28년 베테랑 이후경 경영지도사입니다. 
- 25년 대기업 실무경험 (현대그룹, 삼성생명)
- 500개 기업 직접 컨설팅 성공
- 탁월하고 해박한 전문성
- 선택과 집중이 가능한 직관적 판단력
- 따뜻하지만 명확한 소통 스타일
- 실용적이고 구체적인 솔루션 제시`;

    switch (category) {
      case 'simple-greeting':
        return `${basePersona}

🎯 응답 가이드 (${guidelines.minLength}-${guidelines.maxLength}자):
톤앤매너: ${guidelines.tone}
구조: ${guidelines.structure}

요구사항:
- 자연스럽고 따뜻한 인사
- 간단한 M-CENTER 소개
- 친근하지만 전문가다운 품격 유지
- 마크다운 기호 사용 금지

질문: "${message}"

이후경 경영지도사로서 따뜻하고 친근한 인사를 해주세요.`;

      case 'consultation-request':
        return `${basePersona}

🎯 응답 가이드 (${guidelines.minLength}-${guidelines.maxLength}자):
톤앤매너: ${guidelines.tone}
구조: ${guidelines.structure}

요구사항:
- 상담 신청에 대한 진심어린 감사와 환영
- 28년 경험의 전문성과 차별화 포인트 강조
- 6개 핵심 서비스 영역 간단 소개
- 구체적인 상담 방법과 절차 안내
- 연락처와 상담시간 정보 제공
- 신뢰감을 주는 전문적인 톤 유지

질문: "${message}"

상담 문의에 대해 전문적이고 신뢰감 있는 응답을 해주세요.`;

      case 'single-service':
        return `${basePersona}

🎯 응답 가이드 (${guidelines.minLength}-${guidelines.maxLength}자):
톤앤매너: ${guidelines.tone}
구조: ${guidelines.structure}

요구사항:
- 질문자의 고민에 대한 정확한 이해와 공감
- 해당 분야의 깊이 있는 전문 지식 설명
- 실제 성공 사례와 구체적 수치 제시
- 정부지원 프로그램이나 혜택 정보 포함
- 단계별 실행 방안 제시
- 추가 상담으로 자연스럽게 연결

질문: "${message}"

해당 분야에 대해 전문적이고 실용적인 조언을 해주세요.`;

      case 'complex-strategic':
        return `${basePersona}

🎯 응답 가이드 (${guidelines.minLength}-${guidelines.maxLength}자):
톤앤매너: ${guidelines.tone}
구조: ${guidelines.structure}

요구사항:
- 복합적 질문에 대한 정확한 문제 인식과 분석
- 28년 경험에서 우러나오는 통찰력 있는 관점 제시
- 여러 서비스 영역의 시너지 효과 설명
- 산업 동향과 전략적 관점 포함
- 단계별 통합 실행 로드맵 제시
- 실제 통합 컨설팅 성공 사례와 구체적 성과
- 복잡한 문제를 명쾌하게 정리하는 능력 발휘
- 맞춤형 직접 상담의 가치와 필요성 강조

질문: "${message}"

복합적이고 전략적인 질문에 대해 깊이 있고 통찰력 있는 답변을 해주세요.`;
    }
  }
  
  // 🎭 응답 품질 향상 (이후경 경영지도사 톤앤매너 보장)
  static enhanceResponse(response: string, category: QuestionCategory): string {
    let enhanced = response;
    
    // 🏷️ 이후경 정체성 보장
    if (!enhanced.includes('이후경')) {
      enhanced = `안녕하세요! 이후경입니다.\n\n${enhanced}`;
    }
    
    // 📞 카테고리별 연락처 추가
    if (!enhanced.includes('010-9251-9743')) {
      switch (category) {
        case 'simple-greeting':
          enhanced += '\n\n더 궁금한 점이 있으시면 언제든 말씀해 주세요! 😊';
          break;
        case 'consultation-request':
          enhanced += '\n\n📞 직접 상담: 010-9251-9743\n⏰ 상담시간: 평일 09:00-18:00';
          break;
        case 'single-service':
          enhanced += '\n\n더 구체적인 맞춤형 방안은 직접 상담으로 안내해드리겠습니다.\n📞 전문 상담: 010-9251-9743';
          break;
        case 'complex-strategic':
          enhanced += '\n\n이런 전략적 이슈는 기업 상황에 맞는 맞춤형 접근이 필요합니다. 직접 상담을 통해 더 정밀한 분석과 실행 계획을 제시해드리겠습니다.\n📞 전략 상담: 010-9251-9743';
          break;
      }
    }
    
    // 📏 카테고리별 길이 조정
    const guidelines = QuestionAnalyzer.getResponseGuidelines(category);
    if (enhanced.length > guidelines.maxLength) {
      const cutPoint = guidelines.maxLength - 150;
      enhanced = enhanced.slice(0, cutPoint) + 
                 '\n\n더 자세한 내용은 직접 상담을 통해 말씀드리겠습니다.\n📞 010-9251-9743';
    }
    
    // 🎨 카테고리별 감정 표현 조정
    if (category === 'simple-greeting' && !enhanced.includes('😊')) {
      enhanced = enhanced.replace('이후경입니다.', '이후경입니다. 😊');
    }
    
    // 🎯 선택과 집중 표현 강화 (이후경 스타일)
    if (category === 'complex-strategic') {
      enhanced = enhanced.replace(
        /(\.)(\s*)(하지만|그런데|다만)/g, 
        '$1$2**핵심은 이겁니다.**$2$3'
      );
    }
    
    return enhanced;
  }
  
  // 🛡️ 카테고리별 고품질 폴백 응답
  static generateFallbackResponse(message: string, category: QuestionCategory): string {
    switch (category) {
      case 'simple-greeting':
        return `안녕하세요! 이후경입니다. 😊

28년간 500개 기업과 함께 성장해온 경영지도사로서 언제든 도움드릴 준비가 되어 있습니다.

더 궁금한 점이 있으시면 언제든 말씀해 주세요!`;

      case 'consultation-request':
        return `안녕하세요! 이후경 경영지도사입니다.

상담 문의해주셔서 진심으로 감사합니다! 28년간 500개 기업의 성장을 함께해온 경험으로 확실한 성과를 만들어드리겠습니다.

🎯 M-CENTER 전문 서비스:
• BM ZEN 사업분석 (신규사업 성공률 95%)
• AI 생산성향상 (20-99인 기업 100% 무료)
• 경매활용 공장구매 (30-50% 절감)
• 기술사업화/창업 (평균 5억원 지원)
• 인증지원 (연간 5천만원 세제혜택)
• 웹사이트 구축 (매출 300-500% 증대)

📞 직접 상담: 010-9251-9743
⏰ 상담시간: 평일 09:00-18:00`;

      case 'single-service':
        return `좋은 질문입니다!

28년 현장 경험으로 확신하는 건, 이런 이슈는 기업마다 상황이 다르기 때문에 맞춤형 접근이 필요하다는 것입니다.

구체적인 상황을 자세히 듣고 정확한 솔루션을 제시해드리겠습니다.

📞 전문 상담: 010-9251-9743`;

      case 'complex-strategic':
        return `정말 전략적이고 통찰력 있는 질문을 해주셨네요!

28년 경험상, 이런 복합적인 이슈들은 각 영역의 시너지 효과를 고려한 통합적 접근이 핵심입니다. 

단순히 개별 솔루션을 나열하는 게 아니라, 기업의 현재 상황과 목표에 맞는 전략적 로드맵을 설계해야 최적의 성과를 얻을 수 있습니다.

이런 전략적 이슈는 직접 상담을 통해 더 정밀한 분석과 맞춤형 실행 계획을 제시해드리겠습니다.

📞 전략 상담: 010-9251-9743`;
    }
  }
}

// 🔘 기본 상담 버튼 생성 함수
function generateDefaultButtons(category: QuestionCategory): Array<{ 
  text: string; 
  url: string; 
  style: string; 
  icon: string 
}> {
  // 카테고리별로 버튼 표시 여부 결정
  const shouldShowButtons = category !== 'simple-greeting';
  
  if (!shouldShowButtons) {
    return [];
  }
  
  return [
    {
      text: '🎯 무료진단 받기',
      url: '/diagnosis',
      style: 'primary',
      icon: '🎯'
    },
    {
      text: '📞 상담신청 하기',
      url: '/consultation', 
      style: 'secondary',
      icon: '📞'
    }
  ];
}

// 🚀 메인 API 핸들러
export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // 🎯 고도화된 질문 분석
    const category = QuestionAnalyzer.categorizeQuestion(message);
    const guidelines = QuestionAnalyzer.getResponseGuidelines(category);
    
    console.log(`🎭 이후경 AI 분석: ${category} (${guidelines.minLength}-${guidelines.maxLength}자)`);
    
    try {
      // 🤖 AI 기반 응답 생성
      const origin = new URL(request.url).origin;
      const prompt = LeeHukyungResponseGenerator.createPrompt(message, category);
      
      const aiResponse = await fetch(`${origin}/api/chat-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: prompt,
          maxTokens: category === 'complex-strategic' ? 8192 : 4096
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        let response = aiData.response || '';
        
        // 🎭 이후경 스타일 품질 향상
        response = LeeHukyungResponseGenerator.enhanceResponse(response, category);
        
        console.log(`✅ 고도화 완료: ${response.length}자 (목표: ${guidelines.minLength}-${guidelines.maxLength}자)`);
        
                 // 🔘 기본 버튼 생성 (무료진단 & 상담신청)
         const defaultButtons = generateDefaultButtons(category);
         
         return NextResponse.json({
           response,
           category,
           complexity: category,
           responseLength: response.length,
           guidelines: `${guidelines.minLength}-${guidelines.maxLength}자`,
           tone: guidelines.tone,
           buttons: defaultButtons
         });
      }
    } catch (aiError) {
      console.error('❌ AI 연계 오류:', aiError);
    }
    
         // 🛡️ 폴백 응답 (카테고리별 고품질)
     const fallbackResponse = LeeHukyungResponseGenerator.generateFallbackResponse(message, category);
     const fallbackButtons = generateDefaultButtons(category);
     
     return NextResponse.json({
       response: fallbackResponse,
       category,
       complexity: category,
       responseLength: fallbackResponse.length,
       source: 'fallback',
       buttons: fallbackButtons
     });
    
  } catch (error) {
    console.error('❌ API 오류:', error);
    
         const errorButtons = [
       {
         text: '🎯 무료진단 받기',
         url: '/diagnosis',
         style: 'primary',
         icon: '🎯'
       },
       {
         text: '📞 상담신청 하기',
         url: '/consultation', 
         style: 'secondary',
         icon: '📞'
       }
     ];
     
     return NextResponse.json({
       response: `안녕하세요! 이후경입니다.

잠시 기술적 문제가 있지만 괜찮습니다. 28년 현장 경험으로 언제든 도움 드릴 수 있어요.

📞 직접 상담: 010-9251-9743`,
       error: true,
       buttons: errorButtons
     }, { status: 200 });
  }
} 