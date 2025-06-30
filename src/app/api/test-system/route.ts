import { NextRequest, NextResponse } from 'next/server';
import { saveDiagnosisToGoogleSheets, saveConsultationToGoogleSheets } from '@/lib/utils/googleSheetsService';
import { sendDiagnosisConfirmation, sendConsultationConfirmation } from '@/lib/utils/emailService';
import { getClientEnv } from '@/lib/config/env';

// Vercel 최적화 설정
export const dynamic = 'force-dynamic';
export const revalidate = false;
export const runtime = 'nodejs';

/**
 * 시스템 연동 테스트 API
 * GET /api/test-system - 환경변수 및 설정 확인
 * POST /api/test-system - 실제 데이터 전송 테스트
 */

export async function GET() {
  try {
    const clientEnv = getClientEnv();
    
    // 환경변수 상태 확인
    const systemStatus = {
      timestamp: new Date().toISOString(),
      status: '시스템 상태 확인 완료',
      
      // 구글시트 설정
      googleSheets: {
        configured: !!clientEnv.googleScriptUrl,
        scriptUrl: clientEnv.googleScriptUrl ? 
          clientEnv.googleScriptUrl.substring(0, 50) + '...' : '미설정',
        sheetsId: clientEnv.googleSheetsId ? 
          clientEnv.googleSheetsId.substring(0, 10) + '...' : '미설정'
      },
      
      // 이메일 설정 (Google Apps Script 기반)
      emailService: {
        configured: !!clientEnv.googleScriptUrl,
        provider: 'Google Apps Script',
        isSimulation: false // Google Apps Script는 실제 이메일 발송
      },
      
      // 기본 설정
      baseConfig: {
        environment: clientEnv.nodeEnv,
        baseUrl: clientEnv.baseUrl
      },
      
      // 연동 가능한 기능들 (Google Apps Script 기반)
      availableFeatures: [
        'AI 진단신청 → 구글시트 자동 저장',
        '상담신청 → 구글시트 자동 저장', 
        '접수확인 이메일 실시간 발송 (Google Apps Script)',
        '관리자 알림 이메일 자동 발송',
        '통합 데이터 관리 시스템'
      ]
    };

    return NextResponse.json({
      success: true,
      message: 'M-CENTER 시스템 상태 확인 완료',
      data: systemStatus
    });

  } catch (error) {
    console.error('❌ 시스템 상태 확인 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: '시스템 상태 확인 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('🧪 이메일 시스템 테스트 API 시작');
  
  try {
    const { testType, data } = await request.json();
    
    console.log('📋 테스트 유형:', testType);
    console.log('📊 테스트 데이터:', data);

    switch (testType) {
      case 'google-script-connection':
        return await testGoogleScriptConnection();
      
      case 'consultation-email':
        return await testConsultationEmail(data);
      
      case 'diagnosis-email':
        return await testDiagnosisEmail(data);
      
      default:
        return NextResponse.json({
          success: false,
          error: '지원하지 않는 테스트 유형입니다.',
          supportedTypes: ['google-script-connection', 'consultation-email', 'diagnosis-email']
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ 테스트 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: '테스트 실행 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Google Apps Script 연결 테스트
async function testGoogleScriptConnection() {
  const startTime = Date.now();
  
  try {
    console.log('🔗 Google Apps Script 연결 테스트 시작');
    
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 
      'https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec';

    // 기본 ping 테스트
    const testData = {
      action: 'ping',
      testType: 'connection',
      timestamp: Date.now(),
      source: 'test-system-api'
    };

    console.log('📤 Google Apps Script 테스트 요청:', testData);

    // POST 방식 테스트
    let response;
    let responseText = '';
    let method = 'POST';

    try {
      response = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(testData),
        mode: 'cors'
      });

      if (response.ok) {
        responseText = await response.text();
        console.log('✅ POST 방식 성공:', responseText);
      } else if (response.status === 405) {
        console.warn('⚠️ POST 방식 405 오류, GET 방식으로 재시도');
        throw new Error('405_METHOD_NOT_ALLOWED');
      } else {
        throw new Error(`HTTP_${response.status}`);
      }
    } catch (fetchError) {
      console.warn('⚠️ POST 방식 실패, GET 방식 시도:', fetchError);
      
      // GET 방식 백업 테스트
      method = 'GET';
      const queryParams = new URLSearchParams();
      Object.entries(testData).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });

      response = await fetch(`${googleScriptUrl}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      if (response.ok) {
        responseText = await response.text();
        console.log('✅ GET 방식 성공:', responseText);
      } else {
        throw new Error(`GET_HTTP_${response.status}`);
      }
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: `Google Apps Script 연결 성공 (${method} 방식)`,
      data: {
        method: method,
        duration: `${duration}ms`,
        response: responseText,
        url: googleScriptUrl.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
        testType: 'connection'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ Google Apps Script 연결 테스트 실패:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Google Apps Script 연결 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      data: {
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
        testType: 'connection',
        details: '네트워크 또는 서버 연결 문제'
      },
      timestamp: new Date().toISOString()
    });
  }
}

// 상담신청 이메일 테스트
async function testConsultationEmail(testData: any) {
  const startTime = Date.now();
  
  try {
    console.log('📧 상담신청 이메일 테스트 시작');
    
    const { submitConsultationToGoogle } = await import('@/lib/utils/emailService');
    
    const consultationData = {
      name: testData.name || '테스트사용자',
      email: testData.email || 'test@example.com',
      phone: testData.phone || '010-9251-9743',
      company: testData.company || '테스트회사',
      consultationType: testData.consultationType || 'phone',
      consultationArea: 'test',
      inquiryContent: '이메일 발송 테스트입니다.',
      privacyConsent: true,
      submitDate: new Date().toISOString()
    };

    console.log('📤 상담신청 테스트 데이터:', consultationData);

    const result = await submitConsultationToGoogle(consultationData);
    const duration = Date.now() - startTime;

    console.log('✅ 상담신청 이메일 테스트 완료:', result);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: {
        ...result,
        duration: `${duration}ms`,
        testType: 'consultation-email'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ 상담신청 이메일 테스트 실패:', error);
    
    return NextResponse.json({
      success: false,
      message: '상담신청 이메일 테스트 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      data: {
        duration: `${duration}ms`,
        testType: 'consultation-email'
      },
      timestamp: new Date().toISOString()
    });
  }
}

// 진단 이메일 테스트
async function testDiagnosisEmail(testData: any) {
  const startTime = Date.now();
  
  try {
    console.log('🔬 진단 이메일 테스트 시작');
    
    const { submitDiagnosisToGoogle } = await import('@/lib/utils/emailService');
    
    const diagnosisData = {
      companyName: testData.company || '테스트회사',
      contactName: testData.name || '테스트사용자',
      contactEmail: testData.email || 'test@example.com',
      contactPhone: testData.phone || '010-9251-9743',
      industry: 'technology',
      employeeCount: '10-30',
      mainConcerns: '매출 증대',
      expectedBudget: '미정',
      urgency: '보통',
      privacyConsent: true,
      submitDate: new Date().toISOString(),
      diagnosisScore: 85,
      recommendedServices: '테스트 서비스',
      reportType: '테스트_진단',
      diagnosisFormType: '테스트_이메일'
    };

    console.log('📤 진단 테스트 데이터:', diagnosisData);

    const result = await submitDiagnosisToGoogle(diagnosisData);
    const duration = Date.now() - startTime;

    console.log('✅ 진단 이메일 테스트 완료:', result);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: {
        ...result,
        duration: `${duration}ms`,
        testType: 'diagnosis-email'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ 진단 이메일 테스트 실패:', error);
    
    return NextResponse.json({
      success: false,
      message: '진단 이메일 테스트 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      data: {
        duration: `${duration}ms`,
        testType: 'diagnosis-email'
      },
      timestamp: new Date().toISOString()
    });
  }
} 