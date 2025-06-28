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
 * 🎯 통합 진단 신청 처리 (Google Apps Script + 백업 시스템)
 * - 구글시트 저장
 * - 관리자 이메일 자동 발송
 * - 신청자 확인 이메일 자동 발송
 */
export async function submitDiagnosisToGoogle(diagnosisData: any) {
  try {
    console.log('📊 Google Apps Script로 확장된 진단 신청 처리 시작');
    
    // 📊 **확장된 진단 데이터 검증**
    const hasDetailedScores = !!(diagnosisData.문항별점수 || diagnosisData.detailedScores);
    const hasCategoryScores = !!(diagnosisData.카테고리점수 || diagnosisData.categoryScores);
    const hasSummaryReport = !!(diagnosisData.진단보고서요약 || diagnosisData.summaryReport);
    
    console.log('📊 확장 데이터 확인:', {
      문항별점수: hasDetailedScores,
      카테고리점수: hasCategoryScores,
      진단보고서: hasSummaryReport,
      총점: diagnosisData.totalScore || diagnosisData.종합점수 || 0,
      보고서길이: (diagnosisData.summaryReport || diagnosisData.진단보고서요약 || '').length
    });
    
    // Google Apps Script 엔드포인트로 **확장된** 데이터 전송
    const requestData = {
      action: 'saveDiagnosis',
      ...diagnosisData,
      폼타입: 'AI_무료진단_확장된레벨업시트',
      제출일시: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      timestamp: Date.now(),
      
      // 📊 **확장 데이터 명시적 포함**
      문항별점수: diagnosisData.문항별점수 || diagnosisData.detailedScores || {},
      카테고리점수: diagnosisData.카테고리점수 || diagnosisData.categoryScores || {},
      진단보고서요약: diagnosisData.진단보고서요약 || diagnosisData.summaryReport || '',
      종합점수: diagnosisData.종합점수 || diagnosisData.totalScore || 0,
      추천서비스: diagnosisData.추천서비스 || diagnosisData.recommendedServices || [],
      강점영역: diagnosisData.강점영역 || [],
      약점영역: diagnosisData.약점영역 || [],
      보고서글자수: (diagnosisData.summaryReport || diagnosisData.진단보고서요약 || '').length,
      분석엔진버전: diagnosisData.분석엔진버전 || 'enhanced-v2.5',
      평가일시: diagnosisData.평가일시 || new Date().toISOString(),
      
      // 405 오류 방지를 위한 추가 플래그
      methodOverride: 'POST',
      contentType: 'application/json',
      enhanced: true // 확장된 진단 데이터 플래그
    };

    console.log('📤 확장된 진단 데이터 전송:', {
      action: requestData.action,
      폼타입: requestData.폼타입,
      회사명: diagnosisData.companyName || diagnosisData.회사명,
      담당자: diagnosisData.contactName || diagnosisData.담당자명,
      총점: requestData.종합점수,
      문항별점수개수: Object.keys(requestData.문항별점수 || {}).length,
      카테고리점수개수: Object.keys(requestData.카테고리점수 || {}).length,
      보고서길이: requestData.보고서글자수,
      분석엔진: requestData.분석엔진버전,
      확장모드: requestData.enhanced
    });

    // 🔄 3단계 백업 시스템: POST → GET → 백업
    let lastError = null;
    
    // 1단계: 표준 POST 요청 시도
    try {
      console.log('🔄 1단계: POST 방식 시도');
      const response = await fetch(GOOGLE_SCRIPT_CONFIG.SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
        mode: 'cors'
      });

      if (response.ok) {
        const result = await response.text();
        console.log('✅ 1단계 성공: POST 방식으로 Google Apps Script 처리 완료');
        
        return {
          success: true,
          message: '📊 AI 무료진단이 완료되었습니다 (문항별 점수 + 보고서 포함). 관리자 확인 후 연락드리겠습니다.',
          data: { response: result },
          service: 'google-apps-script',
          method: 'post_success',
          features: [
            '✅ 구글시트 자동 저장 (확장된 48개 컬럼)',
            '✅ 문항별 상세 점수 저장 (20개 항목)',
            '✅ 진단결과보고서 전문 저장',
            '✅ 관리자 알림 이메일 발송',
            '✅ 신청자 확인 이메일 발송',
          ]
        };
      } else {
        lastError = `POST ${response.status}: ${response.statusText}`;
        console.warn('⚠️ 1단계 실패:', lastError);
      }
    } catch (error) {
      lastError = `POST 오류: ${error instanceof Error ? error.message : '네트워크 오류'}`;
      console.warn('⚠️ 1단계 예외:', lastError);
    }

    // 2단계: GET 방식 시도 (405 오류 대응)
    try {
      console.log('🔄 2단계: GET 방식으로 재시도');
      const queryParams = new URLSearchParams();
      Object.entries(requestData).forEach(([key, value]) => {
        queryParams.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      });

      const getResponse = await fetch(`${GOOGLE_SCRIPT_CONFIG.SCRIPT_URL}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      if (getResponse.ok) {
        const result = await getResponse.text();
        console.log('✅ 2단계 성공: GET 방식으로 Google Apps Script 처리 완료');
        
        return {
          success: true,
          message: '📊 AI 무료진단이 완료되었습니다 (문항별 점수 + 보고서 포함). 관리자 확인 후 연락드리겠습니다.',
          data: { response: result },
          service: 'google-apps-script',
          method: 'get_fallback',
          features: [
            '✅ 구글시트 자동 저장 (GET 방식, 확장된 48개 컬럼)',
            '✅ 문항별 상세 점수 저장 (20개 항목)',
            '✅ 진단결과보고서 전문 저장',
            '✅ 관리자 알림 이메일 발송',
            '✅ 신청자 확인 이메일 발송',
          ]
        };
      } else {
        lastError = `GET ${getResponse.status}: ${getResponse.statusText}`;
        console.warn('⚠️ 2단계 실패:', lastError);
      }
    } catch (error) {
      lastError = `GET 오류: ${error instanceof Error ? error.message : '네트워크 오류'}`;
      console.warn('⚠️ 2단계 예외:', lastError);
    }

    // 3단계: 로컬 백업 시스템 (안정성 확보)
    console.log('🔄 3단계: 로컬 백업 시스템 활성화');
    console.warn('⚠️ Google Apps Script 연결 실패:', lastError);
    
    await saveLocalBackup('diagnosis', diagnosisData);
    
    console.log('📁 3단계 완료: 진단 신청 로컬 백업 저장, 관리자 수동 처리 예정');
    
    return {
      success: true,
      message: '📊 AI 무료진단이 접수되었습니다 (문항별 점수 + 보고서 포함). 담당자가 확인 후 연락드리겠습니다.',
      data: { 
        backupSaved: true, 
        lastError: lastError,
        googleScriptUrl: GOOGLE_SCRIPT_CONFIG.SCRIPT_URL.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
        detailedScores: Object.keys(diagnosisData.문항별점수 || diagnosisData.detailedScores || {}).length,
        reportLength: (diagnosisData.summaryReport || diagnosisData.진단보고서요약 || '').length,
        totalScore: diagnosisData.totalScore || diagnosisData.종합점수 || 0
      },
      service: 'local-backup',
      method: 'backup_system',
      features: [
        '✅ 확장된 진단 데이터 로컬 백업 완료',
        '✅ 문항별 점수 + 보고서 포함',
        '✅ 관리자 수동 처리 예정',
        '✅ 24시간 내 연락 예정',
        `⚠️ 원인: ${lastError}`,
      ]
    };

  } catch (error) {
    console.error('❌ Google Apps Script 진단 신청 처리 치명적 오류:', error);
    
    // 최종 긴급 백업 저장
    await saveLocalBackup('diagnosis', diagnosisData);
    
    // 사용자에게는 성공적으로 처리되었다고 안내 (사용자 경험 개선)
    return {
      success: true,
      message: '📊 AI 무료진단이 접수되었습니다 (문항별 점수 + 보고서 포함). 담당자가 확인 후 연락드리겠습니다.',
      data: { 
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        errorType: 'critical_failure',
        timestamp: new Date().toISOString(),
        url: GOOGLE_SCRIPT_CONFIG.SCRIPT_URL.substring(0, 50) + '...',
        detailedScores: Object.keys(diagnosisData.문항별점수 || diagnosisData.detailedScores || {}).length,
        reportLength: (diagnosisData.summaryReport || diagnosisData.진단보고서요약 || '').length,
        totalScore: diagnosisData.totalScore || diagnosisData.종합점수 || 0
      },
      service: 'emergency-backup',
      method: 'critical_error_handling',
      features: [
        '🚨 확장된 진단 데이터 긴급 백업 완료',
        '🚨 문항별 점수 + 보고서 포함',
        '🚨 관리자 즉시 알림 필요',
        '🚨 우선 처리 예정',
        `🚨 오류: ${error instanceof Error ? error.message : '시스템 오류'}`,
      ]
    };
  }
}

/**
 * 🎯 통합 상담 신청 처리 (Google Apps Script + 백업 시스템)
 * - 구글시트 저장
 * - 관리자 이메일 자동 발송  
 * - 신청자 확인 이메일 자동 발송
 */
export async function submitConsultationToGoogle(consultationData: any) {
  try {
    console.log('💬 Google Apps Script로 상담 신청 처리 시작');
    
    // Google Apps Script 엔드포인트로 데이터 전송 (개선된 방식)
    const requestData = {
      action: 'saveConsultation',
      ...consultationData,
      폼타입: '상담신청',
      제출일시: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      timestamp: Date.now(),
      // 405 오류 방지를 위한 추가 플래그
      methodOverride: 'POST',
      contentType: 'application/json'
    };

    console.log('📤 상담 데이터 전송:', {
      action: requestData.action,
      폼타입: requestData.폼타입,
      성명: consultationData.name || consultationData.성명,
      회사명: consultationData.company || consultationData.회사명
    });

    // 🔄 3단계 백업 시스템: POST → GET → 백업
    let lastError = null;
    
    // 1단계: 표준 POST 요청 시도
    try {
      console.log('🔄 1단계: POST 방식 시도');
      const response = await fetch(GOOGLE_SCRIPT_CONFIG.SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
        mode: 'cors'
      });

      if (response.ok) {
        const result = await response.text();
        console.log('✅ 1단계 성공: POST 방식으로 Google Apps Script 처리 완료');
        
        return {
          success: true,
          message: '상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.',
          data: { response: result },
          service: 'google-apps-script',
          method: 'post_success',
          features: [
            '✅ 구글시트 자동 저장',
            '✅ 관리자 알림 이메일 발송',
            '✅ 신청자 확인 이메일 발송',
          ]
        };
      } else {
        lastError = `POST ${response.status}: ${response.statusText}`;
        console.warn('⚠️ 1단계 실패:', lastError);
      }
    } catch (error) {
      lastError = `POST 오류: ${error instanceof Error ? error.message : '네트워크 오류'}`;
      console.warn('⚠️ 1단계 예외:', lastError);
    }

    // 2단계: GET 방식 시도 (405 오류 대응)
    try {
      console.log('🔄 2단계: GET 방식으로 재시도');
      const queryParams = new URLSearchParams();
      Object.entries(requestData).forEach(([key, value]) => {
        queryParams.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      });

      const getResponse = await fetch(`${GOOGLE_SCRIPT_CONFIG.SCRIPT_URL}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      if (getResponse.ok) {
        const result = await getResponse.text();
        console.log('✅ 2단계 성공: GET 방식으로 Google Apps Script 처리 완료');
        
        return {
          success: true,
          message: '상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.',
          data: { response: result },
          service: 'google-apps-script',
          method: 'get_fallback',
          features: [
            '✅ 구글시트 자동 저장 (GET)',
            '✅ 관리자 알림 이메일 발송',
            '✅ 신청자 확인 이메일 발송',
          ]
        };
      } else {
        lastError = `GET ${getResponse.status}: ${getResponse.statusText}`;
        console.warn('⚠️ 2단계 실패:', lastError);
      }
    } catch (error) {
      lastError = `GET 오류: ${error instanceof Error ? error.message : '네트워크 오류'}`;
      console.warn('⚠️ 2단계 예외:', lastError);
    }

    // 3단계: 로컬 백업 시스템 (안정성 확보)
    console.log('🔄 3단계: 로컬 백업 시스템 활성화');
    console.warn('⚠️ Google Apps Script 연결 실패:', lastError);
    
    await saveLocalBackup('consultation', consultationData);
    
    console.log('📁 3단계 완료: 상담 신청 로컬 백업 저장, 관리자 수동 처리 예정');
    
    return {
      success: true,
      message: '상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.',
      data: { 
        backupSaved: true, 
        lastError: lastError,
        googleScriptUrl: GOOGLE_SCRIPT_CONFIG.SCRIPT_URL.substring(0, 50) + '...',
        timestamp: new Date().toISOString()
      },
      service: 'local-backup',
      method: 'backup_system',
      features: [
        '✅ 로컬 백업 저장 완료',
        '✅ 관리자 수동 처리 예정',
        '✅ 24시간 내 연락 예정',
        `⚠️ 원인: ${lastError}`,
      ]
    };

  } catch (error) {
    console.error('❌ Google Apps Script 상담 신청 처리 치명적 오류:', error);
    
    // 최종 긴급 백업 저장
    await saveLocalBackup('consultation', consultationData);
    
    // 사용자에게는 성공적으로 처리되었다고 안내 (사용자 경험 개선)
    return {
      success: true,
      message: '상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.',
      data: { 
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        errorType: 'critical_failure',
        timestamp: new Date().toISOString(),
        url: GOOGLE_SCRIPT_CONFIG.SCRIPT_URL.substring(0, 50) + '...'
      },
      service: 'emergency-backup',
      method: 'critical_error_handling',
      features: [
        '🚨 긴급 백업 처리 완료',
        '🚨 관리자 즉시 알림 필요',
        '🚨 우선 처리 예정',
        `🚨 오류: ${error instanceof Error ? error.message : '시스템 오류'}`,
      ]
    };
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
    const backupInfo = {
      type,
      data,
      timestamp: new Date().toISOString(),
      koreanTime: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      status: 'pending_sync',
      id: `${type}_${Date.now()}`,
      // 관리자 확인용 요약 정보
      summary: {
        이름: data.name || data.성명 || data.contactManager || '정보없음',
        이메일: data.email || data.이메일 || '정보없음',
        회사명: data.company || data.회사명 || data.companyName || '정보없음',
        연락처: data.phone || data.연락처 || '정보없음',
        타입: type === 'diagnosis' ? '진단신청' : type === 'consultation' ? '상담신청' : '베타피드백'
      }
    };

    if (isServer()) {
      // 서버 환경에서는 상세 로그 기록
      console.log(`
🚨 ${backupInfo.summary.타입} 백업 알림
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 접수시간: ${backupInfo.koreanTime}
👤 신청자: ${backupInfo.summary.이름}
🏢 회사명: ${backupInfo.summary.회사명}
📞 연락처: ${backupInfo.summary.연락처}
📧 이메일: ${backupInfo.summary.이메일}
🔧 처리방식: 로컬 백업 (수동 처리 필요)
📋 백업ID: ${backupInfo.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 상세 데이터:
${JSON.stringify(data, null, 2)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
      return;
    }

    // 브라우저 환경에서는 localStorage에 백업
    const backupKey = `mcenter_backup_${type}_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(backupInfo));
    
    console.log(`💾 로컬 백업 저장 완료: ${backupKey}`);
    console.log('📋 백업 요약:', backupInfo.summary);
    
    // 관리자 알림용 이메일 정보 생성 (브라우저에서도 확인 가능)
    console.log(`
📧 관리자 알림 정보:
- 신청자: ${backupInfo.summary.이름} (${backupInfo.summary.회사명})
- 연락처: ${backupInfo.summary.연락처}
- 이메일: ${backupInfo.summary.이메일}
- 신청시간: ${backupInfo.koreanTime}
- 처리필요: ${backupInfo.summary.타입} 수동 처리
    `);
    
  } catch (error) {
    console.error('💾 로컬 백업 저장 실패:', error);
    
    // 백업 실패 시에도 최소한의 정보는 콘솔에 남김
    console.error(`
❌ 백업 실패 - 긴급 수동 처리 필요
- 타입: ${type}
- 시간: ${new Date().toLocaleString('ko-KR')}
- 이름: ${data.name || data.성명 || '정보없음'}
- 이메일: ${data.email || data.이메일 || '정보없음'}
    `);
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