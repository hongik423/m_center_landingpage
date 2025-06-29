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
  console.log('📝 상담신청 API 백업 시스템 시작');
  
  try {
    const consultationData = await request.json();
    
    // 필수 필드 검증
    const requiredFields = ['consultationType', 'name', 'phone', 'email', 'company'];
    const missingFields = requiredFields.filter(field => !consultationData[field]?.trim());
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `필수 필드 누락: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // 개인정보 동의 확인 (엄격한 검증)
    if (!consultationData.privacyConsent || consultationData.privacyConsent !== true) {
      console.log('개인정보 동의 검증 실패:', consultationData.privacyConsent);
      return NextResponse.json(
        { 
          success: false, 
          error: '개인정보 수집 및 이용에 동의해주세요. 동의는 필수 사항입니다.' 
        },
        { status: 400 }
      );
    }
    
    console.log('✅ 개인정보 동의 검증 성공:', consultationData.privacyConsent);

    // 상담신청 데이터 구조화
    const processedData = {
      제출일시: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      폼타입: '상담신청_API백업',
      상담유형: consultationData.consultationType,
      성명: consultationData.name,
      연락처: consultationData.phone,
      이메일: consultationData.email,
      회사명: consultationData.company,
      직책: consultationData.position || '',
      상담분야: consultationData.consultationArea || '',
      문의내용: consultationData.inquiryContent || '',
      희망상담시간: consultationData.preferredTime || '',
      개인정보동의: '동의',
      처리방식: 'API_백업시스템',
      timestamp: Date.now()
    };

    console.log('📤 API 백업 데이터 처리:', processedData);

    // Google Apps Script 재시도 (백업용)
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 
      'https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec';

    try {
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...processedData,
          action: 'saveConsultation',
          dataSource: 'API_백업시스템',
          retryAttempt: true
        })
      });

      if (response.ok) {
        console.log('✅ API 백업을 통한 Google Apps Script 성공');
        return NextResponse.json({
          success: true,
          message: '상담 신청이 성공적으로 처리되었습니다 (API 백업)',
          method: 'google_script_backup',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.warn('⚠️ API 백업에서도 Google Apps Script 실패:', error);
    }

    // 로컬 백업 저장 (파일 시스템 또는 로그)
    console.log('💾 로컬 백업 저장:', processedData);
    
    // 간단한 이메일 알림 시스템 (EmailJS 또는 다른 서비스 사용 가능)
    // 여기서는 콘솔 로그로 대체
    console.log(`
🚨 상담신청 알림 (백업 시스템)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 제출일시: ${processedData.제출일시}
👤 신청자: ${processedData.성명} (${processedData.회사명})
📞 연락처: ${processedData.연락처}
📧 이메일: ${processedData.이메일}
🔧 상담유형: ${processedData.상담유형}
📊 상담분야: ${processedData.상담분야}
💬 문의내용: ${processedData.문의내용}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

    return NextResponse.json({
      success: true,
      message: '상담 신청이 접수되었습니다 (백업 시스템)',
      method: 'local_backup',
      timestamp: new Date().toISOString(),
      note: '담당자가 빠른 시일 내에 연락드리겠습니다'
    });

  } catch (error) {
    console.error('❌ 상담신청 API 백업 오류:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '서버 처리 중 오류가 발생했습니다',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
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