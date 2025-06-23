// Vercel 최적화 설정
export const dynamic = 'force-dynamic';
export const revalidate = false;
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { processConsultationSubmission } from '@/lib/utils/emailService';

/**
 * 통합 상담신청 처리 API
 * POST /api/consultation
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    console.log('📋 상담신청 API 요청 받음:', {
      company: formData.company,
      name: formData.name,
      consultationType: formData.consultationType,
      timestamp: new Date().toISOString()
    });

    // 데이터 검증
    const requiredFields = ['consultationType', 'name', 'phone', 'email', 'company'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
        missingFields
      }, { status: 400 });
    }

    if (!formData.privacyConsent) {
      return NextResponse.json({
        success: false,
        error: '개인정보 수집 및 이용에 동의해야 합니다.'
      }, { status: 400 });
    }

    // 상담신청 처리 (구글시트 저장 + 이메일 발송)
    const result = await processConsultationSubmission(formData);

    console.log('✅ 상담신청 처리 완료:', {
      success: result.success,
      message: result.message,
      service: result.service,
      features: result.features?.length || 0
    });

    // 결과 반환
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          service: result.service,
          features: result.features,
          details: result.data
        },
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message || '상담신청 처리에 실패했습니다.',
        details: result.data
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ 상담신청 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: '상담신청 처리 중 서버 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
}

/**
 * 상담신청 상태 확인 API
 * GET /api/consultation
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: '상담신청 API가 정상 작동 중입니다.',
      endpoints: {
        post: '상담신청 처리',
        get: '상태 확인'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '상담신청 API 상태 확인 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
} 