import { NextRequest, NextResponse } from 'next/server';

/**
 * 환경변수 설정 상태 확인 API
 * GET /api/test-env
 */
export async function GET(request: NextRequest) {
  try {
    // 🔍 환경변수 존재 여부 확인
    const envStatus = {
      // AI 관련
      geminiApiKey: !!process.env.GEMINI_API_KEY,
      geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
      
      // EmailJS 관련
      emailjsServiceId: !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      emailjsPublicKey: !!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      emailjsTemplateDiagnosis: !!process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_DIAGNOSIS,
      emailjsTemplateConsultation: !!process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONSULTATION,
      
      // Google Sheets 관련
      googleSheetsId: !!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
      googleScriptUrl: !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL,
      googleScriptId: !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_ID,
      
      // 기본 설정
      baseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      adminEmail: !!process.env.ADMIN_EMAIL,
      nodeEnv: process.env.NODE_ENV,
      
      // 기능 활성화 상태
      notificationEnabled: process.env.NOTIFICATION_ENABLED === 'true',
      autoReplyEnabled: process.env.AUTO_REPLY_ENABLED === 'true',
      
      // AI 상담사 설정
      aiAssistantName: process.env.NEXT_PUBLIC_AI_ASSISTANT_NAME || 'Default',
      aiAssistantDescription: !!process.env.NEXT_PUBLIC_AI_ASSISTANT_DESCRIPTION,
      
      // 시스템 정보
      timestamp: new Date().toISOString(),
      platform: process.platform,
      nodeVersion: process.version
    };

    // 🎯 전체 상태 요약
    const missingRequired = [];
    const warnings = [];

    // 필수 환경변수 검증
    if (!envStatus.geminiApiKey) missingRequired.push('GEMINI_API_KEY');
    if (!envStatus.emailjsServiceId) missingRequired.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
    if (!envStatus.googleSheetsId) missingRequired.push('NEXT_PUBLIC_GOOGLE_SHEETS_ID');
    if (!envStatus.adminEmail) missingRequired.push('ADMIN_EMAIL');

    // 경고 사항 검증
    if (envStatus.geminiKeyLength < 30) warnings.push('Gemini API key seems too short');
    if (envStatus.nodeEnv !== 'production' && envStatus.nodeEnv !== 'development') {
      warnings.push('NODE_ENV is not set properly');
    }

    const status = {
      success: missingRequired.length === 0,
      environment: envStatus,
      validation: {
        missingRequired,
        warnings,
        totalRequired: 4,
        foundRequired: 4 - missingRequired.length
      },
      features: {
        aiChatbot: envStatus.geminiApiKey,
        emailNotifications: envStatus.emailjsServiceId && envStatus.emailjsPublicKey,
        googleSheetsIntegration: envStatus.googleSheetsId && envStatus.googleScriptUrl,
        adminNotifications: envStatus.adminEmail
      }
    };

    // 🚨 보안: 실제 API 키 값은 노출하지 않음
    console.log('🔍 환경변수 상태 확인:', {
      success: status.success,
      missingCount: missingRequired.length,
      warningCount: warnings.length
    });

    return NextResponse.json(status, { 
      status: status.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ 환경변수 확인 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * POST 요청으로 Gemini API 연결 테스트
 * POST /api/test-env
 */
export async function POST(request: NextRequest) {
  try {
    const { testMessage = "안녕하세요, 별-AI상담사 연결 테스트입니다." } = await request.json().catch(() => ({}));

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
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `당신은 M-CENTER의 별-AI상담사입니다. 다음 메시지에 간단히 응답해주세요: "${testMessage}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({
        success: true,
        message: 'Gemini API 연결 성공',
        test: {
          input: testMessage,
          output: text,
          model: 'gemini-pro',
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