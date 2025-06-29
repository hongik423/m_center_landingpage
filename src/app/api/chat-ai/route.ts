import { NextRequest, NextResponse } from 'next/server';

// 질문 분석 및 답변 길이 결정 함수
function analyzeQuestionAndDetermineLength(message: string): {
  minLength: number;
  maxLength: number;
  complexity: 'simple' | 'medium' | 'complex';
  responseType: 'brief' | 'standard' | 'detailed' | 'comprehensive';
  lengthGuideline: string;
} {
  const msg = message.toLowerCase().trim();
  
  // 간단한 인사나 짧은 질문들
  const simplePatterns = [
    /^안녕/, /^하이/, /^hi/, /^hello/, /^네$/, /^예$/, /^감사/, /^고마/, /^좋/, /^최고/, /^훌륭/,
    /^ㅋ/, /^ㄷㄷ/, /^ㅎㅎ/, /^ㅇㅇ/, /^맞/, /^그래/, /^오케이/, /^ok$/, /^okay$/
  ];
  
  // 매우 간단한 답변이 필요한 경우 (1-50자)
  if (simplePatterns.some(pattern => pattern.test(msg)) || msg.length <= 10) {
    return {
      minLength: 1,
      maxLength: 50,
      complexity: 'simple',
      responseType: 'brief',
      lengthGuideline: '매우 간단하고 친근한 인사말이나 짧은 확인 답변으로 1-50자 이내로 응답하세요.'
    };
  }
  
  // 단순 문의 (50-200자)
  const basicInquiryPatterns = [
    /전화번호/, /연락처/, /주소/, /위치/, /시간/, /언제/, /얼마/, /비용/, /가격/, /요금/,
    /어디/, /몇시/, /몇일/, /언제까지/, /빨리/, /간단히/, /짧게/
  ];
  
  if (basicInquiryPatterns.some(pattern => pattern.test(msg)) || msg.length <= 30) {
    return {
      minLength: 50,
      maxLength: 200,
      complexity: 'simple',
      responseType: 'brief',
      lengthGuideline: '핵심 정보만 간단명료하게 50-200자로 답변하세요. 불필요한 설명은 제외하고 요청한 정보만 제공하세요.'
    };
  }
  
  // 일반적인 상담 문의 (200-800자)
  const standardInquiryPatterns = [
    /어떻게/, /방법/, /절차/, /과정/, /진행/, /신청/, /지원/, /서비스/, /상담/, /문의/,
    /궁금/, /알고싶/, /설명/, /도움/, /추천/, /제안/
  ];
  
  if (standardInquiryPatterns.some(pattern => pattern.test(msg)) && msg.length <= 100) {
    return {
      minLength: 200,
      maxLength: 800,
      complexity: 'medium',
      responseType: 'standard',
      lengthGuideline: '적절한 설명과 구체적인 정보를 포함하여 200-800자로 답변하세요. 핵심 내용과 실용적인 조언을 균형있게 제공하세요.'
    };
  }
  
  // 전문적인 컨설팅 문의 (800-2000자)
  const consultingPatterns = [
    /사업분석/, /경영지도/, /컨설팅/, /전략/, /개선/, /혁신/, /성장/, /발전/, /진단/,
    /매출증대/, /비용절감/, /효율/, /생산성/, /인증/, /창업/, /투자/, /경매/, /ai/, /디지털/,
    /bmzen/, /일터혁신/, /정부지원/, /세제혜택/, /자금확보/
  ];
  
  if (consultingPatterns.some(pattern => pattern.test(msg)) || msg.length <= 200) {
    return {
      minLength: 800,
      maxLength: 2000,
      complexity: 'medium',
      responseType: 'detailed',
      lengthGuideline: '전문적인 컨설팅 관점에서 상세한 설명, 실제 사례, 구체적인 절차와 혜택을 포함하여 800-2000자로 답변하세요. 28년 경험을 바탕으로 실용적인 조언을 제공하세요.'
    };
  }
  
  // 복합적이고 복잡한 문의 (2000-4000자)
  const complexPatterns = [
    /.*?(그리고|또한|또|추가로|더불어|아울러|동시에).*?/, // 복합 질문
    /.*?(케이스|사례|경험|실적|성과|결과).*?/, // 사례 요청
    /.*?(자세히|상세히|구체적으로|완전히|전체적으로).*?/, // 상세 설명 요청
  ];
  
  if (complexPatterns.some(pattern => pattern.test(msg)) || msg.length > 200) {
    return {
      minLength: 2000,
      maxLength: 4000,
      complexity: 'complex',
      responseType: 'comprehensive',
      lengthGuideline: '매우 상세하고 포괄적인 답변을 2000-4000자로 제공하세요. 실제 성과 사례, 단계별 프로세스, 구체적인 수치, 다양한 옵션과 대안, 실용적인 팁을 모두 포함하여 완전한 솔루션을 제시하세요.'
    };
  }
  
  // 기본값 (표준 답변 길이)
  return {
    minLength: 800,
    maxLength: 1500,
    complexity: 'medium',
    responseType: 'standard',
    lengthGuideline: '균형잡힌 설명으로 800-1500자 정도로 답변하세요. 핵심 정보와 실용적인 조언을 적절히 조합하여 제공하세요.'
  };
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 질문 분석 및 답변 길이 결정
    const analysisResult = analyzeQuestionAndDetermineLength(message);
    
    const GEMINI_API_KEY = 'AIzaSyAP-Qa4TVNmsc-KAPTuQFjLalDNcvMHoiM';
    
    const systemPrompt = `당신은 28년 베테랑 컨설턴트 이후경 경영지도사입니다. 마치 사무실에서 기업 대표와 직접 마주앉아 상담하는 것처럼 자연스럽고 친근하면서도 핵심을 짚어주는 대화체로 답변해주세요.

🎯 **답변 길이 조절 지침 (매우 중요!)**
${analysisResult.lengthGuideline}

📊 **현재 질문 분석**
- 복잡도: ${analysisResult.complexity}
- 답변 유형: ${analysisResult.responseType}
- 목표 길이: ${analysisResult.minLength}-${analysisResult.maxLength}자
- 질문의 맥락에 따라 이 범위 내에서 가장 적절한 길이로 답변하세요.

이후경 경영지도사 소개:
현대그룹에서 8년, 삼성생명에서 10년, 그리고 10년간 200여 개 기업을 직접 지도해온 베테랑 컨설턴트입니다. 기업의별 경영지도센터장이자 아이엔제이컨설팅 책임컨설턴트로 활동하며, 고용노동부 일터혁신 수행기관에서 실질적인 성과를 만들어내고 있습니다.

전문 분야:
- BM ZEN 사업분석으로 매출 20-40% 증대
- AI 생산성혁신으로 업무효율 40% 향상 (정부 100% 지원)
- 공장/부동산 경매로 투자비 35-50% 절약
- 기술창업 지원으로 평균 5억원 자금 확보
- 인증지원으로 연간 5천만원 세제혜택
- 디지털 혁신으로 온라인 매출 300% 증대

답변 톤앤매너:
28년간 쌓은 경험을 바탕으로 상대방 기업의 상황을 정확히 파악하고, 마치 오랜 선배가 후배에게 조언하듯 따뜻하면서도 핵심을 찌르는 이야기를 자연스럽게 풀어가세요. 복잡한 경영 이론보다는 "제가 직접 해봤는데요", "이런 케이스가 있었어요" 같은 실제 경험담을 들려주면서 실용적인 해결책을 제시하세요.

답변 방식 (길이에 따라 조절):
${analysisResult.responseType === 'brief' 
  ? '1. 핵심만 간단명료하게\n2. 필요시 연락처 정도만 추가'
  : analysisResult.responseType === 'standard'
  ? '1. 상대방의 고민 공감\n2. 핵심 해결 방안\n3. 구체적인 다음 행동 제안'
  : analysisResult.responseType === 'detailed'
  ? '1. 상대방의 고민을 정확히 이해했다는 공감부터 시작\n2. 비슷한 케이스의 실제 경험담 소개\n3. 단계별로 쉽게 설명하는 해결 방안\n4. 정부지원 등 실질적 혜택 정보\n5. 구체적인 다음 행동 제안'
  : '1. 상대방의 고민을 정확히 이해했다는 공감부터 시작\n2. 다양한 케이스의 실제 경험담과 성과 수치 소개\n3. 상세한 단계별 해결 방안과 프로세스\n4. 정부지원, 세제혜택 등 모든 실질적 정보\n5. 여러 옵션과 대안 제시\n6. 구체적인 다음 행동 제안과 연락 방법'
}

중요 지침:
- 마크다운 기호(###, **, 등)는 절대 사용하지 마세요
- 자연스러운 대화체로 답변하세요
- 딱딱한 전문용어보다는 쉽고 친근한 표현 사용
- 실제 성과 수치와 구체적인 사례를 포함
- 따뜻하지만 확신에 찬 어조 유지
- 질문의 성격에 맞는 적절한 길이로 답변하되, 지정된 범위(${analysisResult.minLength}-${analysisResult.maxLength}자)를 준수하세요

질문 기업의 상황을 28년 베테랑 컨설턴트의 시각으로 분석하고, 마치 직접 만나서 상담하는 것처럼 자연스럽고 맥락에 맞는 적절한 길이의 조언을 제공해주세요.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n사용자 질문: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: analysisResult.maxLength > 2000 ? 8192 : 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('GEMINI API Error:', response.status, response.statusText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // 응답 길이 검증 및 로깅
      const responseLength = aiResponse.length;
      console.log(`📏 답변 길이 분석: 목표 ${analysisResult.minLength}-${analysisResult.maxLength}자, 실제 ${responseLength}자`);
      
      return NextResponse.json({ 
        response: aiResponse,
        analysisInfo: {
          complexity: analysisResult.complexity,
          responseType: analysisResult.responseType,
          targetLength: `${analysisResult.minLength}-${analysisResult.maxLength}`,
          actualLength: responseLength
        }
      });
    } else {
      throw new Error('Invalid response format from GEMINI API');
    }

  } catch (error) {
    console.error('Chat AI API Error:', error);
    
    // 폴백 응답도 길이 조절 적용
    const analysisResult = analyzeQuestionAndDetermineLength(message || '');
    
    let fallbackResponse = '';
    
    if (analysisResult.responseType === 'brief') {
      fallbackResponse = `안녕하세요! 이후경입니다. 잠시 기술적 문제가 있네요. 010-9251-9743으로 직접 연락주세요.`;
    } else if (analysisResult.responseType === 'standard') {
      fallbackResponse = `안녕하세요! 이후경입니다.

지금 AI 시스템에 일시적인 문제가 생겼지만 괜찮아요. 28년간 현장에서 쌓은 경험으로 도와드릴 수 있거든요.

BM ZEN 사업분석, AI 생산성혁신, 공장경매, 기술창업, 인증지원, 웹사이트구축 등 어떤 도움이 필요하신지 010-9251-9743으로 직접 전화주세요. 확실한 성과를 만들어드릴 자신 있어요!`;
    } else {
      fallbackResponse = `안녕하세요! 이후경입니다.

지금 AI 시스템에 일시적인 문제가 생겼네요. 하지만 괜찮습니다. 제가 현대그룹에서 8년, 삼성생명에서 10년, 그리고 지난 10년간 200여 개 기업을 직접 도우면서 쌓은 경험으로 답변을 드릴 수 있거든요.

28년간 현장에서 뛰면서 정말 많은 기업들을 봤어요. 어떤 문제든 해결할 방법은 있다는 게 제 확신입니다.

저희 M-CENTER에서는 6가지 핵심 서비스로 기업들을 돕고 있어요.

먼저 BM ZEN 사업분석이라는 게 있어요. 제가 직접 개발한 5단계 프레임워크인데요, 이걸로 매출을 20-40% 올린 케이스들이 정말 많습니다. 재무, 마케팅, 운영을 통합적으로 분석해서 정확한 진단과 처방을 내리는 거죠.

요즘 가장 핫한 게 AI 생산성 혁신이에요. 업무효율을 40% 이상 높여드리는데, 무엇보다 좋은 건 정부에서 100% 지원해준다는 거예요. 저희가 고용노동부 일터혁신 수행기관이거든요. 기업 입장에서는 공짜로 컨설팅 받는 셈이죠.

공장이나 부동산 경매 쪽도 25년 넘게 해왔어요. 투자비를 35-50% 절약할 수 있어서 많은 기업들이 찾아오시죠. 전문가가 직접 동행해서 입찰까지 도와드려요.

기술창업 지원은 제가 특히 자신 있는 분야예요. 평균 5억원 정도 자금을 확보해드리고 있고, 3년간 사후관리까지 해드려요. 정부R&D와 연계해서 사업화까지 이어지는 케이스들이 많아요.

인증지원도 빼놓을 수 없죠. 벤처, ISO, ESG 등등 각종 인증을 받으면 연간 5천만원 정도 세제혜택을 받을 수 있거든요. 100% 취득 보장해드려요.

디지털 혁신 쪽은 온라인 매출을 300% 이상 늘려드리는 게 목표예요. 요즘 시대에 디지털 전환 안 하면 뒤처지잖아요. 무료로 1년간 사후관리까지 해드려요.

어떤 고민이 있으신지 구체적으로 말씀해주시면, 제 경험을 바탕으로 더 정확한 해결책을 제시해드릴 수 있어요. 28년간 현장에서 뛰면서 쌓은 노하우가 분명 도움이 될 거라고 확신합니다.

직접 전화로 상담하시려면 010-9251-9743으로 연락주세요. 언제든 환영입니다.`;
    }

    return NextResponse.json({ response: fallbackResponse });
  }
} 