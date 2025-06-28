// Vercel 최적화 설정
export const dynamic = 'force-dynamic';
export const revalidate = false;
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

/**
 * 환경변수 설정 상태 확인 API
 * GET /api/test-env
 */
export async function GET(request: NextRequest) {
  try {
    // 정적 빌드에서는 환경변수 검증 대신 기본 응답 반환
    if (process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES === 'true') {
      return NextResponse.json({
        status: 'success',
        message: 'GitHub Pages 환경에서 실행 중',
        environment: 'github-pages',
        timestamp: new Date().toISOString(),
        staticBuild: true
      });
    }

    // 환경변수 검증 (개발/일반 서버 환경)
    const envCheck = {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      NEXT_PUBLIC_GOOGLE_SHEETS_ID: !!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
      NODE_ENV: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      status: 'success',
      message: '환경변수 검증 완료',
      environment: envCheck
    });

  } catch (error) {
    console.error('환경변수 테스트 오류:', error);
    
    return NextResponse.json({
      status: 'error',
      message: '환경변수 검증 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * POST 요청으로 Gemini API 연결 테스트
 * POST /api/test-env
 */
export async function POST(request: NextRequest) {
  try {
    const { testMessage = "안녕하세요, AI상담사 연결 테스트입니다." } = await request.json().catch(() => ({}));

    // Gemini API 키 확인
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not found',
        message: 'Gemini API 키가 환경변수에 설정되지 않았습니다.'
      }, { status: 400 });
    }

    // 🤖 Gemini API 연결 테스트
    try {
      // Google AI SDK를 동적으로 import
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `당신은 M-CENTER의 AI상담사입니다. 다음 메시지에 간단히 응답해주세요: "${testMessage}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({
        success: true,
        message: 'Gemini API 연결 성공',
        test: {
          input: testMessage,
          output: text,
          model: 'gemini-2.5-flash',
          timestamp: new Date().toISOString()
        },
        status: 'Gemini API가 정상적으로 작동하고 있습니다.'
      });

    } catch (apiError) {
      console.error('❌ Gemini API 연결 실패:', apiError);
      
      return NextResponse.json({
        success: false,
        error: 'Gemini API connection failed',
        message: apiError instanceof Error ? apiError.message : 'Gemini API 연결에 실패했습니다.',
        suggestions: [
          'API 키가 올바른지 확인하세요',
          'Gemini API 할당량을 확인하세요',
          'Google AI Studio에서 API 키 상태를 확인하세요'
        ]
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Gemini API 테스트 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Test request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { 
      status: 500 
    });
  }
} 