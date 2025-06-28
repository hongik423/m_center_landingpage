/**
 * 🏢 M-CENTER 통합 이메일 서비스
 * Google Apps Script 기반 이메일 시스템 (EmailJS 제거됨)
 * 
 * ✅ 주요 기능:
 * 1. Google Apps Script 자동 이메일 발송 (관리자 + 신청자)
 * 2. 구글시트 데이터 저장과 동시 이메일 처리
 * 3. 안정적인 단일 시스템 운영
 */

import { appConfig } from '../config/env';

// 🔧 타입 정의
export interface DiagnosisFormData {
  company: string;
  name: string;
  phone: string;
  email: string;
  businessType: string;
  employees?: number;
  annualRevenue?: string;
  mainIssues?: string[];
  goals?: string[];
  urgency?: string;
  privacyConsent: boolean;
  [key: string]: any;
}

// 🔧 Google Apps Script 기반 통합 서비스
const GOOGLE_SCRIPT_CONFIG = {
  SHEETS_ID: appConfig.googleSheetsId,
  SCRIPT_URL: appConfig.googleScriptUrl,
  NOTIFICATION_EMAIL: appConfig.company.email,  // 관리자 이메일
};

// 🔍 환경 검사 헬퍼
function isServer() {
  return typeof window === 'undefined';
}

/**
 * 🎯 통합 진단 신청 처리 (Google Apps Script)
 * - 구글시트 저장
 * - 관리자 이메일 자동 발송
 * - 신청자 확인 이메일 자동 발송
 */
export async function submitDiagnosisToGoogle(diagnosisData: any) {
  try {
    console.log('📊 Google Apps Script로 진단 신청 처리 시작');
    
    // Google Apps Script 엔드포인트로 데이터 전송
    const response = await fetch(GOOGLE_SCRIPT_CONFIG.SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveDiagnosis',
        ...diagnosisData,
        폼타입: 'AI_무료진단',
        제출일시: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script 오류: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ Google Apps Script 진단 신청 처리 완료:', result);
    
    return {
      success: true,
      message: '진단 신청이 완료되었습니다. 관리자 확인 후 연락드리겠습니다.',
      data: result,
      service: 'google-apps-script',
      features: [
        '✅ 구글시트 자동 저장',
        '✅ 관리자 알림 이메일 발송',
        '✅ 신청자 확인 이메일 발송',
      ]
    };

  } catch (error) {
    console.error('❌ Google Apps Script 진단 신청 처리 실패:', error);
    
    // 로컬 백업 저장 (오프라인 대비)
    await saveLocalBackup('diagnosis', diagnosisData);
    
    throw new Error(`진단 신청 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

/**
 * 🎯 통합 상담 신청 처리 (Google Apps Script)
 * - 구글시트 저장
 * - 관리자 이메일 자동 발송  
 * - 신청자 확인 이메일 자동 발송
 */
export async function submitConsultationToGoogle(consultationData: any) {
  try {
    console.log('💬 Google Apps Script로 상담 신청 처리 시작');
    
    // Google Apps Script 엔드포인트로 데이터 전송
    const response = await fetch(GOOGLE_SCRIPT_CONFIG.SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveConsultation',
        ...consultationData,
        폼타입: '상담신청',
        제출일시: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script 오류: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ Google Apps Script 상담 신청 처리 완료:', result);
    
    return {
      success: true,
      message: '상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.',
      data: result,
      service: 'google-apps-script',
      features: [
        '✅ 구글시트 자동 저장',
        '✅ 관리자 알림 이메일 발송',
        '✅ 신청자 확인 이메일 발송',
      ]
    };

  } catch (error) {
    console.error('❌ Google Apps Script 상담 신청 처리 실패:', error);
    
    // 로컬 백업 저장 (오프라인 대비)
    await saveLocalBackup('consultation', consultationData);
    
    throw new Error(`상담 신청 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

/**
 * 🔄 AI 진단 결과 업데이트 (Google Apps Script)
 */
export async function updateDiagnosisResultToGoogle(updateData: any) {
  try {
    console.log('🔄 Google Apps Script로 진단 결과 업데이트 시작');
    
    const response = await fetch(GOOGLE_SCRIPT_CONFIG.SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateDiagnosisResult',
        ...updateData,
        분석완료일시: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script 오류: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ Google Apps Script 진단 결과 업데이트 완료:', result);
    
    return {
      success: true,
      message: '진단 결과가 성공적으로 업데이트되었습니다.',
      data: result,
      service: 'google-apps-script'
    };

  } catch (error) {
    console.error('❌ Google Apps Script 진단 결과 업데이트 실패:', error);
    throw new Error(`진단 결과 업데이트 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

/**
 * 🎯 베타 피드백 처리 및 이메일 발송 (Google Apps Script)
 * - 구글시트 저장
 * - 관리자 알림 이메일 자동 발송
 * - 피드백 제출자 접수 확인 이메일 자동 발송
 */
export async function submitBetaFeedbackToGoogle(feedbackData: any) {
  try {
    console.log('🧪 Google Apps Script로 베타 피드백 및 이메일 처리 시작');
    
    // 🧪 베타 피드백 전용 데이터 구성 (기존 데이터와 충돌 방지)
    const betaFeedbackPayload = {
      // 🎯 최우선: action을 먼저 설정
      action: 'saveBetaFeedback',
      폼타입: '베타테스트_피드백',
      
      // 베타 피드백 전용 필드들
      계산기명: feedbackData.계산기명,
      피드백유형: feedbackData.피드백유형,
      사용자이메일: feedbackData.사용자이메일,
      문제설명: feedbackData.문제설명,
      기대동작: feedbackData.기대동작,
      실제동작: feedbackData.실제동작,
      재현단계: feedbackData.재현단계,
      심각도: feedbackData.심각도,
      추가의견: feedbackData.추가의견,
      브라우저정보: feedbackData.브라우저정보,
      제출경로: feedbackData.제출경로,
      
      // 메타데이터
      제출일시: new Date().toISOString(),
      타임스탬프: feedbackData.타임스탬프,
      dataSource: feedbackData.dataSource,
      
      // 이메일 발송 플래그
      sendAdminEmail: true,
      sendUserEmail: true,
      
      // 🚨 진단/상담 필드는 명시적으로 제외하여 분기 오류 방지
      debugInfo: {
        originalAction: feedbackData.action,
        processType: '베타피드백',
        timestamp: new Date().toISOString()
      }
    };

    console.log('🧪 베타 피드백 전용 페이로드 생성:', {
      action: betaFeedbackPayload.action,
      폼타입: betaFeedbackPayload.폼타입,
      계산기명: betaFeedbackPayload.계산기명,
      피드백유형: betaFeedbackPayload.피드백유형
    });

    // Google Apps Script 엔드포인트로 데이터 전송
    const response = await fetch(GOOGLE_SCRIPT_CONFIG.SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(betaFeedbackPayload),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script 오류: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ Google Apps Script 베타 피드백 처리 완료:', result);
    
    return {
      success: true,
      message: '베타 피드백이 접수되었습니다. 관리자 검토 후 이메일로 회신드리겠습니다.',
      data: result,
      service: 'google-apps-script',
      features: [
        '✅ 구글시트 자동 저장',
        '✅ 관리자 알림 이메일 발송',
        '✅ 피드백 제출자 접수 확인 이메일 발송',
        '✅ 베타테스트 피드백 전용 처리',
      ]
    };

  } catch (error) {
    console.error('❌ Google Apps Script 베타 피드백 처리 실패:', error);
    
    // 로컬 백업 저장 (오프라인 대비)
    await saveLocalBackup('beta-feedback', feedbackData);
    
    throw new Error(`베타 피드백 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

/**
 * 💾 로컬 백업 저장 (오프라인 대비)
 */
async function saveLocalBackup(type: 'diagnosis' | 'consultation' | 'beta-feedback', data: any) {
  try {
    if (isServer()) {
      // 서버 환경에서는 로그만 기록
      console.log(`📁 ${type} 백업 데이터:`, JSON.stringify(data, null, 2));
      return;
    }

    // 브라우저 환경에서는 localStorage에 백업
    const backupKey = `mcenter_backup_${type}_${Date.now()}`;
    const backupData = {
      type,
      data,
      timestamp: new Date().toISOString(),
      status: 'pending_sync'
    };
    
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    console.log(`💾 로컬 백업 저장 완료: ${backupKey}`);
    
  } catch (error) {
    console.error('💾 로컬 백업 저장 실패:', error);
  }
}

/**
 * 🔍 Google Apps Script 연결 상태 확인
 */
export async function checkGoogleScriptStatus() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_CONFIG.SCRIPT_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`연결 실패: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      status: 'connected',
      message: 'Google Apps Script 연결 정상',
      data: result,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Google Apps Script 연결 확인 실패:', error);
    
    return {
      success: false,
      status: 'disconnected',
      message: `Google Apps Script 연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * 📊 서비스 설정 정보 조회
 */
export function getEmailServiceConfig() {
  return {
    provider: 'Google Apps Script',
    features: [
      '구글시트 자동 저장',
      '관리자 알림 이메일',
      '신청자 확인 이메일',
      '실시간 데이터 동기화',
      '오프라인 백업 지원'
    ],
    config: {
      sheetsId: GOOGLE_SCRIPT_CONFIG.SHEETS_ID ? 
        `${GOOGLE_SCRIPT_CONFIG.SHEETS_ID.slice(0, 10)}...` : 'Not Set',
      scriptUrl: GOOGLE_SCRIPT_CONFIG.SCRIPT_URL ? 
        `${GOOGLE_SCRIPT_CONFIG.SCRIPT_URL.slice(0, 50)}...` : 'Not Set',
      notificationEmail: GOOGLE_SCRIPT_CONFIG.NOTIFICATION_EMAIL,
    },
    status: {
      hasConfig: !!(GOOGLE_SCRIPT_CONFIG.SHEETS_ID && GOOGLE_SCRIPT_CONFIG.SCRIPT_URL),
      isProduction: appConfig.isProduction,
      lastUpdated: new Date().toISOString()
    }
  };
}

// 🎯 레거시 함수들 (하위 호환성)
export const sendDiagnosisConfirmationEmail = submitDiagnosisToGoogle;
export const sendConsultationConfirmationEmail = submitConsultationToGoogle;

// 🎯 API 호환 함수들 (API 라우트에서 사용)
export const processConsultationSubmission = submitConsultationToGoogle;
export const processDiagnosisSubmission = submitDiagnosisToGoogle;
export const sendDiagnosisConfirmation = submitDiagnosisToGoogle;
export const sendConsultationConfirmation = submitConsultationToGoogle; 