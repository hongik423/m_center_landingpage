import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const GEMINI_API_KEY = 'AIzaSyAP-Qa4TVNmsc-KAPTuQFjLalDNcvMHoiM';
    
    const systemPrompt = `당신은 이후경 경영지도사입니다. 다음 프로필과 톤앤매너로 응답해주세요:

**이후경 경영지도사 프로필:**
- 28년 실무경험 (현대그룹 8년 + 삼성생명 10년 + 경영지도사 10년)
- 200여 개 기업 직접 지도 경험
- 기업의별 경영지도센터장
- 아이엔제이컨설팅 책임컨설턴트
- 고용노동부 일터혁신 수행기관 컨설턴트

**전문 분야 6대 핵심서비스:**
1. BM ZEN 사업분석: 5단계 프레임워크로 매출 20-40% 증대
2. AI 생산성혁신: 업무효율 40% 향상, 정부 100% 지원
3. 공장/부동산 경매: 투자비 35-50% 절약
4. 기술창업 지원: 평균 5억원 자금 확보
5. 인증지원 전문: 연간 5천만원 세제혜택
6. 디지털 혁신: 온라인 매출 300% 증대

**응답 톤앤매너:**
- 28년 경험을 바탕으로 한 전문가적 조언
- 구체적인 수치와 실제 성과 사례 제시
- 문제점 발견 → 이후경식 솔루션 제시 패턴
- 정부지원사업 연계 방안 포함
- 성과중심, 실용적 접근
- 따뜻하면서도 전문적인 어조

**응답 구조:**
1. 문제/이슈 파악 및 분석
2. 28년 경험에서 도출한 해결방안
3. 구체적인 실행 계획 및 성과 예측
4. 정부지원 연계 방안
5. 후속 상담 제안

사용자 질문을 분석하고, 위 가이드라인에 따라 이후경 경영지도사로서 최고 수준의 전문적이고 실용적인 답변을 제공해주세요.`;

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
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
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
      return NextResponse.json({ response: aiResponse });
    } else {
      throw new Error('Invalid response format from GEMINI API');
    }

  } catch (error) {
    console.error('Chat AI API Error:', error);
    
    // 폴백 응답
    const fallbackResponse = `안녕하세요! 이후경 경영지도사입니다. 💼

현재 AI 시스템에 일시적인 문제가 발생했지만, 28년간 현대그룹과 삼성생명에서 쌓은 대기업 실무 경험과 200여 개 기업을 직접 지도한 컨설팅 노하우를 바탕으로 답변드리겠습니다.

**🎯 M-CENTER 6대 핵심서비스**

**1. 📈 BM ZEN 사업분석**
- 5단계 전략 프레임워크로 매출 20-40% 증대
- 재무·마케팅·운영 통합 분석

**2. 🤖 AI 생산성 혁신**
- 업무효율 40% 향상 보장
- 정부 100% 지원 가능 (일터혁신 수행기관)

**3. 🏭 공장/부동산 경매**
- 투자비 35-50% 절약 실현
- 전문가 동행 입찰 시스템

**4. 🚀 기술창업 지원**
- 평균 5억원 자금 확보
- 3년 사후관리 패키지

**5. 🏆 인증지원 전문**
- 연간 5천만원 세제혜택 확보
- 100% 취득 보장 시스템

**6. 🌐 디지털 혁신**
- 온라인 매출 300% 증대
- 무료 1년 사후관리

구체적인 상황을 알려주시면 더욱 정확한 솔루션을 제시해드리겠습니다!

📞 직통 상담: 010-9251-9743 (이후경 경영지도사)`;

    return NextResponse.json({ response: fallbackResponse });
  }
} 