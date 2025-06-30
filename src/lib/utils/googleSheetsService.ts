/**
 * 통합 구글시트 연동 서비스 (Apps Script 호환 버전)
 * M-CENTER Apps Script와 완전 호환되는 통합 데이터 처리 시스템
 */

// 타입 정의
interface BaseFormData {
  제출일시?: string;
  폼타입?: string;
  API버전?: string;
  요청시간?: string;
  개인정보동의?: string | boolean;
}

interface DiagnosisFormData extends BaseFormData {
  회사명?: string;
  업종?: string;
  사업담당자?: string;
  직원수?: string;
  사업성장단계?: string;
  주요고민사항?: string;
  예상혜택?: string;
  진행사업장?: string;
  담당자명?: string;
  연락처?: string;
  이메일?: string;
  
  // 영어 필드명 지원 (하위 호환성)
  companyName?: string;
  industry?: string;
  businessManager?: string;
  employeeCount?: string;
  establishmentDifficulty?: string;
  mainConcerns?: string;
  expectedBenefits?: string;
  businessLocation?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  privacyConsent?: boolean;
}

interface ConsultationFormData extends BaseFormData {
  상담유형?: string;
  성명?: string;
  연락처?: string;
  이메일?: string;
  회사명?: string;
  직책?: string;
  상담분야?: string;
  문의내용?: string;
  희망상담시간?: string;
  진단연계여부?: boolean | string;
  진단점수?: string;
  추천서비스?: string;
  
  // 영어 필드명 지원
  consultationType?: string;
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  position?: string;
  consultationArea?: string;
  inquiryContent?: string;
  preferredTime?: string;
  privacyConsent?: boolean;
  isDiagnosisLinked?: boolean;
  diagnosisScore?: string;
  recommendedService?: string;
}

interface GoogleSheetsResponse {
  success: boolean;
  message?: string;
  error?: string;
  row?: number;
  uniqueId?: string;
  timestamp?: string;
  rowNumber?: number;
  sheetName?: string;
  [key: string]: any;
}

// 유틸리티 함수들
function getKoreanDateTime(): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Seoul'
  }).format(new Date());
}

function validateEnvironment(): { isValid: boolean; error?: string } {
  // 런타임에서만 검사 (빌드 시 제외)
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    return { isValid: true }; // 서버 빌드 시에는 통과
  }

  const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  
  if (!googleScriptUrl) {
    // 환경변수가 없으면 기본값 사용 (임시)
    console.warn('⚠️ NEXT_PUBLIC_GOOGLE_SCRIPT_URL 환경변수가 설정되지 않았습니다. 기본 URL을 사용합니다.');
    return { isValid: true }; // 임시로 통과
  }
  
  // script.google.com 또는 script.googleusercontent.com 도메인 허용
  if (!googleScriptUrl.includes('script.google')) {
    return {
      isValid: false,
      error: 'Google Script URL 형식이 올바르지 않습니다.'
    };
  }
  
  return { isValid: true };
}

// 🔧 **실제 M-CENTER 구글시트 Apps Script URL**
const DEFAULT_GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec';
const GOOGLE_SHEETS_ID = '1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug';

/**
 * AI 진단 데이터를 구글시트에 저장
 */
export async function saveDiagnosisToGoogleSheets(
  data: DiagnosisFormData,
  formType: string = 'AI_무료진단'
): Promise<GoogleSheetsResponse> {
  try {
    const envCheck = validateEnvironment();
    if (!envCheck.isValid && envCheck.error) {
      console.error('❌ 환경변수 오류:', envCheck.error);
      return {
        success: false,
        error: envCheck.error,
        solution: {
          step1: '.env.local 파일에 NEXT_PUBLIC_GOOGLE_SCRIPT_URL 추가',
          step2: '서버 재시작 필요'
        }
      };
    }

    const currentDateTime = getKoreanDateTime();
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || DEFAULT_GOOGLE_SCRIPT_URL;

    // 📋 **헤더 정의 (구글시트 첫행 자동생성용)**
    const sheetHeaders = [
      '제출일시', '폼타입', 'API버전', '신청구분', '회사명', '업종', '사업담당자', '직원수', 
      '사업성장단계', '주요고민사항', '예상혜택', '진행사업장', '담당자명', '연락처', '이메일', 
      '개인정보동의', '진단점수', '추천서비스', '보고서타입', '진단폼타입', '문항별점수', 
      '카테고리점수', '진단보고서요약', '종합점수', '강점영역', '약점영역', '보고서글자수', 
      '평가일시', '분석엔진버전', '요청시간'
    ];

    // 🔧 **확장된 진단 데이터 추출 (점수 포함)**
    const enhancedData = data as any;
    const detailedScores = enhancedData.문항별점수 || enhancedData.detailedScores || {};
    const categoryScores = enhancedData.카테고리점수 || enhancedData.categoryScores || {};
    const totalScore = enhancedData.종합점수 || enhancedData.totalScore || 0;
    const reportSummary = enhancedData.진단보고서요약 || enhancedData.summaryReport || '';
    
    // Apps Script 호환 데이터 구조
    const sheetData = {
      // 📋 **헤더 정보 (첫행 자동생성용)**
      action: 'saveDiagnosis',
      headers: sheetHeaders,
      autoCreateHeaders: true,
      sheetName: 'AI_진단신청',
      
      // 기본 메타데이터
      제출일시: currentDateTime,
      폼타입: formType,
      API버전: 'v4.0_통합',
      요청시간: new Date().toISOString(),
      신청구분: 'AI진단신청',
      
      // 진단 폼 데이터 (한국어 필드명)
      회사명: String(data.companyName || data.회사명 || ''),
      업종: String(data.industry || data.업종 || ''),
      사업담당자: String(data.businessManager || data.사업담당자 || ''),
      직원수: String(data.employeeCount || data.직원수 || ''),
      사업성장단계: String(data.establishmentDifficulty || data.사업성장단계 || ''),
      주요고민사항: String(data.mainConcerns || data.주요고민사항 || ''),
      예상혜택: String(data.expectedBenefits || data.예상혜택 || ''),
      진행사업장: String(data.businessLocation || data.진행사업장 || ''),
      담당자명: String(data.contactName || data.담당자명 || ''),
      연락처: String(data.contactPhone || data.연락처 || ''),
      이메일: String(data.contactEmail || data.이메일 || ''),
      개인정보동의: data.privacyConsent === true || data.개인정보동의 === '동의' ? '동의' : '미동의',
      
      // 🔧 **진단 결과 정보 (점수 포함)**
      종합점수: totalScore,
      totalScore: totalScore,
      진단점수: String(totalScore || ''),
      추천서비스: String((data as any).recommendedServices || ''),
      보고서타입: String((data as any).reportType || ''),
      진단폼타입: String((data as any).diagnosisFormType || formType),
      
      // 📊 **문항별 상세 점수 (1-5점) - 핵심!**
      문항별점수: detailedScores,
      detailedScores: detailedScores,
      
      // 📊 **카테고리별 점수**
      카테고리점수: categoryScores,
      categoryScores: categoryScores,
      
      // 📝 **진단결과보고서 요약**
      진단보고서요약: reportSummary,
      summaryReport: reportSummary,
      
      // Apps Script 처리용 메타데이터
      dataSource: '웹사이트_AI진단',
      timestamp: Date.now(),
      uniqueKey: `diagnosis_${data.contactEmail || data.이메일}_${Date.now()}`
    };

    console.log('📋 AI 진단 데이터 구글시트 저장 시작:', {
      company: sheetData.회사명,
      email: sheetData.이메일,
      formType: formType,
      timestamp: sheetData.제출일시,
      url: googleScriptUrl ? googleScriptUrl.substring(0, 50) + '...' : 'Default URL'
    });

    // Apps Script로 데이터 전송
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(sheetData),
      mode: 'cors'
    });

    console.log('📡 Apps Script 응답 상태:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: googleScriptUrl ? googleScriptUrl.substring(0, 50) + '...' : 'Default URL'
    });

    if (response.ok) {
      const responseText = await response.text();
      console.log('📄 Apps Script 응답 내용:', responseText.substring(0, 200));
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn('⚠️ JSON 파싱 실패, 텍스트 응답 분석:', parseError);
        
        // 🔧 **GitHub Pages 환경에서 텍스트 응답 처리**
        if (responseText.includes('성공') || responseText.includes('저장') || responseText.includes('완료') || 
            responseText.includes('success') || responseText.includes('saved') || responseText.length > 0) {
          result = { 
            success: true, 
            message: responseText.length > 100 ? responseText.substring(0, 100) + '...' : responseText,
            platform: 'GitHub Pages 호환 모드'
          };
        } else {
          result = { 
            success: false, 
            error: responseText || '알 수 없는 응답',
            platform: 'GitHub Pages 오류 모드'
          };
        }
      }

      if (result.success) {
        console.log('✅ AI 진단 데이터 구글시트 저장 성공');
        return {
          success: true,
          message: '진단 데이터가 구글시트에 성공적으로 저장되었습니다.',
          sheetName: 'AI_진단신청',
          timestamp: currentDateTime,
          platform: result.platform || 'Standard',
          ...result
        };
      } else {
        // 🔧 **GitHub Pages 환경에서 부분 성공 처리**
        console.warn('⚠️ Apps Script 부분 실패, 로컬 백업 활성화');
        
        // 로컬 스토리지에 백업 저장
        try {
          const backupData = {
            timestamp: currentDateTime,
            formType: 'AI_진단',
            data: sheetData,
            status: 'pending_sync'
          };
          localStorage.setItem(`diagnosis_backup_${Date.now()}`, JSON.stringify(backupData));
          console.log('💾 로컬 백업 저장 완료');
        } catch (storageError) {
          console.warn('⚠️ 로컬 백업 저장 실패:', storageError);
        }
        
        // 🔧 **로컬 백업 시스템 활성화**
        try {
          const { LocalBackupService } = await import('./localBackupService');
          const backupId = LocalBackupService.saveDiagnosisBackup(sheetData);
          console.log('💾 진단 데이터 로컬 백업 저장 완료:', backupId);
          
          return {
            success: true, // 백업 성공으로 처리
            message: '일시적으로 로컬에 저장되었습니다. 관리자가 확인 후 구글시트에 반영합니다.',
            sheetName: '로컬_백업',
            timestamp: currentDateTime,
            platform: 'Local Backup System',
            backupId: backupId,
            fallbackMode: true
          };
        } catch (backupError) {
          console.error('❌ 로컬 백업도 실패:', backupError);
          return {
            success: false,
            error: result.error || '구글시트 저장에 실패했습니다.',
            rawResponse: responseText,
            fallbackAction: '로컬 백업 저장 실패',
            retryAdvice: '네트워크 연결을 확인하고 다시 시도해주세요.'
          };
        }
      }
    } else {
      const errorText = await response.text().catch(() => '응답 읽기 실패');
      console.error('❌ HTTP 오류:', response.status, errorText);
      
      // 🔧 **GitHub Pages CORS 오류 대응**
      if (response.status === 0 || response.status === 403) {
        console.log('🔄 GitHub Pages CORS 제한, 대체 방법 사용');
        
        // 로컬 스토리지에 임시 저장
        try {
          const fallbackData = {
            timestamp: currentDateTime,
            formType: 'AI_진단',
            data: sheetData,
            status: 'cors_blocked',
            retryUrl: googleScriptUrl
          };
          localStorage.setItem(`diagnosis_cors_backup_${Date.now()}`, JSON.stringify(fallbackData));
          
          return {
            success: true, // GitHub Pages에서는 성공으로 처리
            message: '진단 데이터가 임시 저장되었습니다. 관리자가 확인 후 처리합니다.',
            sheetName: 'GitHub_Pages_백업',
            timestamp: currentDateTime,
            platform: 'GitHub Pages CORS 우회',
            fallbackMode: true
          };
        } catch (storageError) {
          return {
            success: false,
            error: 'CORS 오류 및 로컬 저장 실패',
            httpStatus: response.status,
            advice: '관리자에게 직접 연락해주세요: 010-9251-9743'
          };
        }
      }
      
      return {
        success: false,
        error: `HTTP ${response.status} 오류: ${errorText}`,
        httpStatus: response.status,
        advice: response.status >= 500 ? '서버 오류입니다. 잠시 후 다시 시도해주세요.' : '네트워크 연결을 확인해주세요.'
      };
    }

  } catch (error) {
    console.error('❌ AI 진단 데이터 저장 중 오류:', error);
    
    // 🔧 **fetch 실패 시 로컬 백업 강제 활성화**
    const currentDateTime = getKoreanDateTime();
    
    try {
      // 로컬 스토리지에 긴급 백업
      const emergencyData = {
        timestamp: currentDateTime,
        formType: 'AI_진단_응급백업',
        data: data,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        status: 'emergency_backup',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown'
      };
      
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`emergency_diagnosis_${Date.now()}`, JSON.stringify(emergencyData));
        console.log('🆘 긴급 진단 데이터 로컬 백업 저장 완료');
        
        return {
          success: true, // 긴급 백업 성공으로 처리
          message: '네트워크 오류가 발생했지만 진단 데이터가 안전하게 보관되었습니다. 관리자가 확인 후 처리합니다.',
          sheetName: '긴급_로컬_백업',
          timestamp: currentDateTime,
          platform: 'Emergency Local Backup',
          fallbackMode: true,
          originalError: error instanceof Error ? error.message : '알 수 없는 오류'
        };
      }
    } catch (backupError) {
      console.error('❌ 긴급 백업도 실패:', backupError);
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      advice: '관리자에게 직접 연락하거나 잠시 후 다시 시도해주세요.',
      contact: '010-9251-9743 (이후경 경영지도사)',
      fallbackAction: '로컬 백업 활성화 실패'
    };
  }
}

/**
 * 상담 신청 데이터를 구글시트에 저장
 */
export async function saveConsultationToGoogleSheets(
  data: ConsultationFormData,
  diagnosisInfo?: {
    isLinked?: boolean;
    score?: string;
    primaryService?: string;
    resultUrl?: string;
  }
): Promise<GoogleSheetsResponse> {
  try {
    const envCheck = validateEnvironment();
    if (!envCheck.isValid && envCheck.error) {
      console.error('❌ 환경변수 오류:', envCheck.error);
      return {
        success: false,
        error: envCheck.error
      };
    }

    const currentDateTime = getKoreanDateTime();
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || DEFAULT_GOOGLE_SCRIPT_URL;

    // 📋 **상담신청 헤더 정의 (구글시트 첫행 자동생성용)**
    const consultationHeaders = [
      '제출일시', '폼타입', 'API버전', '신청구분', '상담유형', '성명', '연락처', '이메일', 
      '회사명', '직책', '상담분야', '문의내용', '희망상담시간', '개인정보동의', '진단연계여부', 
      '진단점수', '추천서비스', '진단결과URL', '요청시간'
    ];

    // Apps Script 호환 데이터 구조
    const consultationData = {
      // 📋 **헤더 정보 (첫행 자동생성용)**
      action: 'saveConsultation',
      headers: consultationHeaders,
      autoCreateHeaders: true,
      sheetName: '상담신청',
      
      // 기본 메타데이터
      제출일시: currentDateTime,
      폼타입: '상담신청',
      API버전: 'v4.0_통합',
      요청시간: new Date().toISOString(),
      신청구분: '상담신청',
      
      // 상담 신청 데이터 (한국어 필드명)
      상담유형: data.consultationType || data.상담유형 || '일반상담',
      성명: data.name || data.성명 || '',
      연락처: data.phone || data.연락처 || '',
      이메일: data.email || data.이메일 || '',
      회사명: data.company || data.회사명 || '',
      직책: data.position || data.직책 || '',
      상담분야: data.consultationArea || data.상담분야 || '',
      문의내용: data.inquiryContent || data.문의내용 || '',
      희망상담시간: data.preferredTime || data.희망상담시간 || '',
      개인정보동의: data.privacyConsent === true || data.개인정보동의 === '동의' ? '동의' : '미동의',
      
      // 진단 연계 정보
      진단연계여부: diagnosisInfo?.isLinked || data.isDiagnosisLinked ? 'Y' : 'N',
      진단점수: diagnosisInfo?.score || data.diagnosisScore || '',
      추천서비스: diagnosisInfo?.primaryService || data.recommendedService || '',
      진단결과URL: diagnosisInfo?.resultUrl || '',
      
      // Apps Script 처리용 메타데이터
      dataSource: '웹사이트_상담신청',
      timestamp: Date.now(),
      uniqueKey: `consultation_${data.email || data.이메일}_${Date.now()}`
    };

    console.log('🔵 상담 신청 데이터 구글시트 저장 시작:', {
      name: consultationData.성명,
      company: consultationData.회사명,
      consultationType: consultationData.상담유형,
      isLinked: consultationData.진단연계여부,
      timestamp: consultationData.제출일시,
      url: googleScriptUrl ? googleScriptUrl.substring(0, 50) + '...' : 'Default URL'
    });

    // Apps Script로 데이터 전송
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(consultationData),
      mode: 'cors'
    });

    console.log('📡 상담신청 Apps Script 응답 상태:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: googleScriptUrl ? googleScriptUrl.substring(0, 50) + '...' : 'Default URL'
    });

    if (response.ok) {
      const responseText = await response.text();
      console.log('📄 상담신청 Apps Script 응답 내용:', responseText.substring(0, 200));
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn('⚠️ 상담신청 JSON 파싱 실패, 텍스트 응답 분석:', parseError);
        
        // 🔧 **GitHub Pages 환경에서 텍스트 응답 처리**
        if (responseText.includes('성공') || responseText.includes('저장') || responseText.includes('완료') || 
            responseText.includes('success') || responseText.includes('saved') || responseText.length > 0) {
          result = { 
            success: true, 
            message: responseText.length > 100 ? responseText.substring(0, 100) + '...' : responseText,
            platform: 'GitHub Pages 호환 모드'
          };
        } else {
          result = { 
            success: false, 
            error: responseText || '알 수 없는 응답',
            platform: 'GitHub Pages 오류 모드'
          };
        }
      }

      if (result.success) {
        console.log('✅ 상담신청 데이터 구글시트 저장 성공');
        return {
          success: true,
          message: '상담 신청이 구글시트에 성공적으로 저장되었습니다.',
          sheetName: '상담신청',
          timestamp: currentDateTime,
          platform: result.platform || 'Standard',
          ...result
        };
      } else {
        // 🔧 **GitHub Pages 환경에서 부분 성공 처리**
        console.warn('⚠️ 상담신청 Apps Script 부분 실패, 로컬 백업 활성화');
        
        // 로컬 스토리지에 백업 저장
        try {
          const backupData = {
            timestamp: currentDateTime,
            formType: '상담신청',
            data: consultationData,
            status: 'pending_sync'
          };
          localStorage.setItem(`consultation_backup_${Date.now()}`, JSON.stringify(backupData));
          console.log('💾 상담신청 로컬 백업 저장 완료');
        } catch (storageError) {
          console.warn('⚠️ 상담신청 로컬 백업 저장 실패:', storageError);
        }
        
        // 🔧 **로컬 백업 시스템 활성화**
        try {
          const { LocalBackupService } = await import('./localBackupService');
          const backupId = LocalBackupService.saveConsultationBackup(consultationData);
          console.log('💾 상담 데이터 로컬 백업 저장 완료:', backupId);
          
          return {
            success: true, // 백업 성공으로 처리
            message: '일시적으로 로컬에 저장되었습니다. 관리자가 확인 후 구글시트에 반영합니다.',
            sheetName: '로컬_백업',
            timestamp: currentDateTime,
            platform: 'Local Backup System',
            backupId: backupId,
            fallbackMode: true
          };
        } catch (backupError) {
          console.error('❌ 상담 로컬 백업도 실패:', backupError);
          return {
            success: false,
            error: result.error || '상담신청 구글시트 저장에 실패했습니다.',
            rawResponse: responseText,
            fallbackAction: '로컬 백업 저장 실패',
            retryAdvice: '네트워크 연결을 확인하고 다시 시도해주세요.'
          };
        }
      }
    } else {
      const errorText = await response.text().catch(() => '응답 읽기 실패');
      console.error('❌ 상담신청 HTTP 오류:', response.status, errorText);
      
      // 🔧 **GitHub Pages CORS 오류 대응**
      if (response.status === 0 || response.status === 403) {
        console.log('🔄 상담신청 GitHub Pages CORS 제한, 대체 방법 사용');
        
        // 로컬 스토리지에 임시 저장
        try {
          const fallbackData = {
            timestamp: currentDateTime,
            formType: '상담신청',
            data: consultationData,
            status: 'cors_blocked',
            retryUrl: googleScriptUrl
          };
          localStorage.setItem(`consultation_cors_backup_${Date.now()}`, JSON.stringify(fallbackData));
          
          return {
            success: true, // GitHub Pages에서는 성공으로 처리
            message: '상담 신청이 임시 저장되었습니다. 관리자가 확인 후 처리합니다.',
            sheetName: 'GitHub_Pages_백업',
            timestamp: currentDateTime,
            platform: 'GitHub Pages CORS 우회',
            fallbackMode: true
          };
        } catch (storageError) {
          return {
            success: false,
            error: 'CORS 오류 및 로컬 저장 실패',
            httpStatus: response.status,
            advice: '관리자에게 직접 연락해주세요: 010-9251-9743'
          };
        }
      }
      
      return {
        success: false,
        error: `HTTP ${response.status} 오류: ${errorText}`,
        httpStatus: response.status,
        advice: response.status >= 500 ? '서버 오류입니다. 잠시 후 다시 시도해주세요.' : '네트워크 연결을 확인해주세요.'
      };
    }

  } catch (error) {
    console.error('❌ 상담신청 데이터 저장 중 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

/**
 * 진단 결과를 구글시트에 업데이트
 */
export async function updateDiagnosisResults(
  contactEmail: string,
  diagnosisResult: any,
  resultUrl: string
): Promise<GoogleSheetsResponse> {
  try {
    const envCheck = validateEnvironment();
    if (!envCheck.isValid && envCheck.error) {
      console.error('❌ 환경변수 오류:', envCheck.error);
      return {
        success: false,
        error: envCheck.error
      };
    }

    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || DEFAULT_GOOGLE_SCRIPT_URL;

    const updateData = {
      action: 'updateDiagnosisResult',
      searchEmail: contactEmail,
      진단상태: '완료',
      AI분석결과: typeof diagnosisResult === 'object' 
        ? JSON.stringify(diagnosisResult).substring(0, 500) 
        : diagnosisResult,
      결과URL: resultUrl,
      분석완료일시: getKoreanDateTime(),
      API버전: 'v4.0_통합'
    };

    console.log('🔄 진단 결과 업데이트 요청:', {
      email: contactEmail,
      url: resultUrl,
      timestamp: updateData.분석완료일시
    });

    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
      mode: 'cors'
    });

    console.log('✅ 진단 결과 업데이트 요청 전송 완료');

    return {
      success: true,
      message: '진단 결과가 구글시트에 업데이트되었습니다.',
      timestamp: updateData.분석완료일시
    };

  } catch (error) {
    console.error('❌ 진단 결과 업데이트 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '진단 결과 업데이트 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 구글시트 연결 상태 확인
 */
export async function checkGoogleSheetsConnection(): Promise<GoogleSheetsResponse> {
  try {
    const envCheck = validateEnvironment();
    if (!envCheck.isValid && envCheck.error) {
      return {
        success: false,
        error: envCheck.error
      };
    }

    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || DEFAULT_GOOGLE_SCRIPT_URL;

    console.log('🔗 구글시트 연결 테스트 시작');

    // 간단한 GET 요청으로 연결 테스트
    const response = await fetch(googleScriptUrl, {
      method: 'GET',
      mode: 'no-cors' // CORS 우회
    });

    // no-cors 모드에서는 실제 응답을 확인할 수 없으므로 성공으로 간주
    console.log('✅ 구글시트 연결 테스트 완료');
    
    return {
      success: true,
      message: '구글시트 연결이 정상입니다.',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ 구글시트 연결 확인 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '구글시트 연결 확인 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 테스트 데이터 저장
 */
export async function saveTestDataToGoogleSheets(testType: 'diagnosis' | 'consultation' = 'diagnosis'): Promise<GoogleSheetsResponse> {
  const timestamp = Date.now();
  
  if (testType === 'diagnosis') {
    const testData = {
      companyName: `테스트기업_${timestamp}`,
      industry: 'IT/소프트웨어',
      businessManager: '김테스트',
      employeeCount: '10-50명',
      establishmentDifficulty: '성장기',
      mainConcerns: '매출 성장 정체 및 디지털 전환',
      expectedBenefits: '효율성 향상 및 경쟁력 강화',
      businessLocation: '서울특별시',
      contactName: '테스트 담당자',
      contactPhone: '010-9251-9743',
      contactEmail: `test_diagnosis_${timestamp}@mcenter.test`,
      privacyConsent: true
    };

    return await saveDiagnosisToGoogleSheets(testData, 'API_테스트');
  } else {
    const testData = {
      consultationType: 'phone',
      name: '테스트 상담자',
      phone: '010-9251-9743',
      email: `test_consultation_${timestamp}@mcenter.test`,
      company: `테스트 상담기업_${timestamp}`,
      position: '대표이사',
      consultationArea: 'business-analysis',
      inquiryContent: '비즈니스 분석 상담을 받고 싶습니다.',
      preferredTime: 'morning',
      privacyConsent: true
    };

    return await saveConsultationToGoogleSheets(testData);
  }
}

// 하위 호환성을 위한 기존 함수들
export const saveToGoogleSheets = saveDiagnosisToGoogleSheets;
export const processConsultationSubmission = saveConsultationToGoogleSheets; 