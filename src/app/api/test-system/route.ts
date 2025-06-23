import { NextRequest, NextResponse } from 'next/server';
import { saveDiagnosisToGoogleSheets, saveConsultationToGoogleSheets } from '@/lib/utils/googleSheetsService';
import { sendDiagnosisConfirmation, sendConsultationConfirmation } from '@/lib/utils/emailService';
import { getClientEnv } from '@/lib/config/env';

export const dynamic = 'force-static';
export const revalidate = false;

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
        '✅ AI 진단신청 → 구글시트 자동 저장',
        '✅ 상담신청 → 구글시트 자동 저장', 
        '✅ 접수확인 이메일 실시간 발송 (Google Apps Script)',
        '✅ 관리자 알림 이메일 자동 발송',
        '✅ 통합 데이터 관리 시스템'
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
  try {
    const { testType } = await request.json();
    
    const results = {
      timestamp: new Date().toISOString(),
      testType: testType || 'full',
      results: {} as any
    };

    if (testType === 'googlesheets' || !testType) {
      // 구글시트 연동 테스트
      console.log('🔵 구글시트 연동 테스트 시작...');
      
      const testDiagnosisData = {
        companyName: '테스트회사',
        industry: 'IT',
        businessManager: '홍길동',
        contactName: '홍길동',
        contactPhone: '010-1234-5678',
        contactEmail: 'test@example.com',
        employeeCount: '11-30',
        establishmentDifficulty: 'growth',
        mainConcerns: '매출 증대 및 효율성 개선',
        expectedBenefits: '생산성 향상 및 비용 절감',
        businessLocation: '서울시 강남구',
        privacyConsent: true
      };

      const sheetResult = await saveDiagnosisToGoogleSheets(testDiagnosisData, '시스템_테스트');
      results.results.googleSheets = {
        success: sheetResult.success,
        message: sheetResult.message,
        error: sheetResult.error,
        platform: sheetResult.platform
      };
    }

    if (testType === 'email' || !testType) {
      // 이메일 발송 테스트
      console.log('📧 이메일 시스템 테스트 시작...');
      
      const testDiagnosisEmailData = {
        companyName: '테스트회사',
        name: '홍길동',
        phone: '010-1234-5678',
        email: 'test@example.com',
        businessType: 'IT',
        message: '시스템 테스트용 진단신청입니다.',
        privacyConsent: true
      };
      
      const emailResult = await sendDiagnosisConfirmation(testDiagnosisEmailData);

      results.results.emailService = {
        success: emailResult.success,
        message: emailResult.message,
        service: emailResult.service || 'Google Apps Script',
        features: emailResult.features || [],
        error: emailResult.success ? null : emailResult.message
      };
    }

    if (testType === 'consultation' || !testType) {
      // 상담신청 테스트
      console.log('🔵 상담신청 연동 테스트 시작...');
      
      const testConsultationData = {
        consultationType: '경영전략 상담',
        name: '김철수',
        phone: '010-9876-5432',
        email: 'consultation@example.com',
        company: '테스트상담회사',
        position: '대표',
        consultationArea: '사업계획',
        inquiryContent: '사업 확장에 대한 상담을 원합니다.',
        preferredTime: '평일 오후',
        privacyConsent: true
      };

      const consultationResult = await saveConsultationToGoogleSheets(
        testConsultationData,
        { isLinked: false, score: '', primaryService: '', resultUrl: '' }
      );
      
      results.results.consultation = {
        success: consultationResult.success,
        message: consultationResult.message,
        error: consultationResult.error,
        platform: consultationResult.platform
      };
    }

    // 전체 결과 평가
    const allTests = Object.values(results.results);
    const successCount = allTests.filter((test: any) => test.success).length;
    const totalCount = allTests.length;

    return NextResponse.json({
      success: successCount === totalCount,
      message: `시스템 테스트 완료: ${successCount}/${totalCount} 성공`,
      data: results,
      summary: {
        totalTests: totalCount,
        successfulTests: successCount,
        failedTests: totalCount - successCount,
        overallStatus: successCount === totalCount ? '✅ 모든 시스템 정상' : '⚠️ 일부 시스템 점검 필요'
      }
    });

  } catch (error) {
    console.error('❌ 시스템 테스트 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: '시스템 테스트 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
} 