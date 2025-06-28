import { NextRequest, NextResponse } from 'next/server';
import { submitBetaFeedbackToGoogle } from '@/lib/utils/emailService';

// Vercel 최적화 설정
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface BetaFeedbackData {
  제출일시: string;
  폼타입: string;
  계산기명: string;
  계산기유형: string;
  사용자이메일: string;
  연락선호방식: string;
  피드백유형: string;
  문제설명: string;
  기대동작?: string;
  실제동작?: string;
  재현단계?: string;
  심각도?: string;
  추가의견: string;
  브라우저정보: string;
  제출경로: string;
  타임스탬프: number;
  action: string;
  dataSource: string;
}

interface GoogleSheetsResponse {
  success: boolean;
  message?: string;
  error?: string;
  row?: number;
  uniqueId?: string;
  timestamp?: string;
}

// ✅ 베타 피드백 처리는 이제 emailService.ts의 submitBetaFeedbackToGoogle() 함수로 통합됨
// - 구글시트 자동 저장
// - 관리자 알림 이메일 자동 발송  
// - 피드백 제출자 접수 확인 이메일 자동 발송

/**
 * POST /api/beta-feedback
 * 베타테스트 피드백 접수 API
 */
export async function POST(request: NextRequest) {
  try {
    const feedbackData: BetaFeedbackData = await request.json();

    // 필수 필드 검증
    if (!feedbackData.사용자이메일 || !feedbackData.피드백유형 || !feedbackData.문제설명) {
      return NextResponse.json({
        success: false,
        error: '필수 필드가 누락되었습니다. (이메일, 피드백유형, 문제설명)'
      }, { status: 400 });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(feedbackData.사용자이메일)) {
      return NextResponse.json({
        success: false,
        error: '올바른 이메일 주소를 입력해주세요.'
      }, { status: 400 });
    }

    console.log('🔵 베타 피드백 접수 시작:', {
      calculator: feedbackData.계산기명,
      type: feedbackData.피드백유형,
      email: feedbackData.사용자이메일?.substring(0, 5) + '***',
      timestamp: feedbackData.제출일시
    });

    // 🎯 통합 서비스로 구글시트 저장 + 이메일 발송 처리
    const processResult = await submitBetaFeedbackToGoogle(feedbackData);

    if (processResult.success) {
      console.log('✅ 베타 피드백 통합 처리 완료 (구글시트 + 이메일)');
      
      return NextResponse.json({
        success: true,
        message: processResult.message,
        data: {
          feedbackId: `beta_${Date.now()}`,
          submittedAt: new Date().toISOString(),
          calculator: feedbackData.계산기명,
          type: feedbackData.피드백유형,
          status: '접수완료_이메일발송완료',
          emails: {
            adminNotified: '✅ 관리자 알림 이메일 발송',
            userConfirmed: '✅ 접수 확인 이메일 발송'
          }
        },
        features: processResult.features
      });
    } else {
      console.error('❌ 베타 피드백 통합 처리 실패:', processResult.message);
      
      return NextResponse.json({
        success: false,
        error: processResult.message || '피드백 처리 중 오류가 발생했습니다.',
        details: '통합 서비스 처리 실패 (구글시트 + 이메일)'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ 베타 피드백 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
}

/**
 * GET /api/beta-feedback
 * 베타 피드백 시스템 상태 확인
 */
export async function GET() {
  try {
    const systemStatus = {
      timestamp: new Date().toISOString(),
      status: '베타 피드백 시스템 정상 작동 중',
      
      // 시스템 정보
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      
      // 구글시트 연동 상태
      googleSheets: {
        configured: !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL,
        scriptUrl: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ? 
          process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL.substring(0, 50) + '...' : '미설정'
      },
      
      // 지원 기능
      features: [
        '✅ 베타테스트 피드백 접수',
        '✅ 구글시트 자동 저장',
        '✅ 관리자 알림 이메일 자동 발송',
        '✅ 피드백 제출자 접수 확인 이메일 자동 발송',
        '✅ 버그 신고 상세 정보 수집',
        '✅ 실시간 피드백 처리',
        '✅ 통합 이메일 서비스 연동'
      ],
      
      // 피드백 유형
      supportedFeedbackTypes: [
        '🐛 버그 신고',
        '💡 개선 제안', 
        '✨ 기능 요청',
        '💬 기타 의견'
      ]
    };

    return NextResponse.json({
      success: true,
      message: '베타 피드백 시스템 상태 확인 완료',
      data: systemStatus
    });

  } catch (error) {
    console.error('❌ 베타 피드백 시스템 상태 확인 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: '시스템 상태 확인 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
} 