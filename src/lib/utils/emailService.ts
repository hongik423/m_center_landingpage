/**
 * 통합 이메일 및 데이터 처리 서비스
 * 구글시트 연동과 EmailJS를 통한 이메일 발송을 담당
 */

// 🔧 EmailJS 서비스 유틸리티 (브라우저 환경 안전 처리)
import emailjs from '@emailjs/browser';

// 환경 체크 함수
const isBrowser = () => typeof window !== 'undefined';
const isServer = () => typeof window === 'undefined';

// 🔧 EmailJS 환경변수 (기본값 포함)
const EMAIL_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_qd9eycz',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '268NPLwN54rPvEias',
  TEMPLATE_DIAGNOSIS: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_DIAGNOSIS || 'template_diagnosis_conf',
  TEMPLATE_CONSULTATION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONSULTATION || 'template_consultation_conf',
  TEMPLATE_ADMIN: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN || 'template_admin_notification'
};

// 템플릿 매개변수 타입 정의
interface BaseTemplateParams {
  to_name: string;
  to_email: string;
  reply_to: string;
  from_name: string;
  message: string;
  [key: string]: any; // 인덱스 시그니처 추가
}

interface DiagnosisTemplateParams extends BaseTemplateParams {
  company_name: string;
  business_type: string;
  consultation_type: string;
  contact_number: string;
  submission_date: string;
  diagnosis_summary?: string;
  next_steps?: string;
  [key: string]: any; // 인덱스 시그니처 추가
}

interface ConsultationTemplateParams extends BaseTemplateParams {
  company_name: string;
  consultation_type: string;
  submission_date: string;
  status: string;
  consultant_name?: string;
  appointment_date?: string;
  [key: string]: any; // 인덱스 시그니처 추가
}

interface AdminNotificationParams {
  to_email: string;
  type: 'consultation' | 'diagnosis';
  customer_name: string;
  company_name: string;
  service_type: string;
  submission_date: string;
  details: string;
  [key: string]: any; // 인덱스 시그니처 추가
}

// 🎯 이메일 발송 결과 타입
interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  service?: string;
  isSimulation?: boolean;
}

// 🔧 서버 사이드에서 실제 EmailJS API 호출 (Node.js 환경)
async function sendEmailViaAPI(serviceId: string, templateId: string, templateParams: any, publicKey: string): Promise<EmailResult> {
  try {
    console.log('📧 EmailJS API 직접 호출 시도:', {
      serviceId: serviceId.substring(0, 8) + '...',
      templateId: templateId.substring(0, 12) + '...',
      publicKey: publicKey.substring(0, 8) + '...'
    });

    // 서버 사이드에서 EmailJS API 직접 호출
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams
      })
    });

    console.log('📡 EmailJS API 응답:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (response.ok) {
      const result = await response.text();
      console.log('✅ EmailJS API 호출 성공:', result);
      return {
        success: true,
        messageId: result || 'API_SUCCESS',
        service: 'emailjs-api'
      };
    } else {
      const errorText = await response.text();
      console.error('❌ EmailJS API 오류 응답:', errorText);
      throw new Error(`EmailJS API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (error) {
    console.error('EmailJS API 호출 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'API 호출 실패',
      service: 'emailjs-api'
    };
  }
}

// 🎯 진단 결과 확인 이메일 발송 (사용자용) - 직접 EmailJS 사용
export async function sendDiagnosisConfirmation(
  userEmail: string,
  userName: string,
  companyName: string,
  businessType: string,
  consultationType: string,
  contactNumber: string,
  diagnosisSummary?: string
): Promise<EmailResult> {
  try {
    console.log('📧 진단 확인 이메일 발송 시작 (직접 EmailJS 사용)');
    console.log('📨 이메일 내용:', {
      to: userEmail,
      userName,
      companyName,
      businessType,
      consultationType,
      contactNumber,
      diagnosisSummary: diagnosisSummary ? '포함됨' : '미포함'
    });

    const templateParams: DiagnosisTemplateParams = {
      to_name: userName,
      to_email: userEmail,
      reply_to: userEmail,
      from_name: 'M-CENTER 기업의별',
      company_name: companyName,
      business_type: businessType,
      consultation_type: consultationType,
      contact_number: contactNumber || '정보 없음',
      submission_date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      message: `안녕하세요 ${userName}님,\n\n${companyName}의 무료 경영진단 신청이 정상적으로 접수되었습니다.\n\n담당 전문가가 검토 후 24시간 내에 연락드리겠습니다.\n\n문의사항이 있으시면 언제든 연락주세요.\n\n감사합니다.\nM-CENTER 기업의별`,
      diagnosis_summary: diagnosisSummary || '상세 분석 결과는 담당자 상담을 통해 제공됩니다.',
      next_steps: '담당 전문가가 24시간 내에 연락드려 상세한 진단 결과를 안내해드리겠습니다.'
    };

    let emailResult: EmailResult;

    // 🔧 브라우저 환경을 우선으로 하고, 서버는 백업으로 사용
    if (isBrowser()) {
      try {
        // 브라우저에서 EmailJS SDK 사용 (가장 안정적)
        console.log('🌐 브라우저 환경에서 EmailJS SDK 사용');
        
        if (!EMAIL_CONFIG.SERVICE_ID || !EMAIL_CONFIG.PUBLIC_KEY) {
          throw new Error('EmailJS 환경변수가 설정되지 않았습니다');
        }

        // EmailJS 초기화 확인
        if (typeof emailjs === 'undefined' || !emailjs.send) {
          throw new Error('EmailJS SDK가 로드되지 않았습니다');
        }

        const result = await emailjs.send(
          EMAIL_CONFIG.SERVICE_ID,
          EMAIL_CONFIG.TEMPLATE_DIAGNOSIS,
          templateParams,
          EMAIL_CONFIG.PUBLIC_KEY
        );

        emailResult = {
          success: true,
          messageId: result.text,
          service: 'emailjs-browser'
        };
        
        console.log('✅ 브라우저 EmailJS 호출 성공:', emailResult);
      } catch (browserError) {
        console.warn('⚠️ 브라우저 EmailJS 실패, 서버 API 시도:', browserError);
        
        // 브라우저 실패 시 서버 API 백업 시도
        emailResult = await sendEmailViaAPI(
          EMAIL_CONFIG.SERVICE_ID,
          EMAIL_CONFIG.TEMPLATE_DIAGNOSIS,
          templateParams,
          EMAIL_CONFIG.PUBLIC_KEY
        );
      }
    } else {
      // 서버에서만 API 직접 호출 (브라우저 우선이므로 이 경우는 드물음)
      console.log('🖥️ 서버 환경에서 EmailJS API 호출');
      emailResult = await sendEmailViaAPI(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_DIAGNOSIS,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );
    }

    console.log('✅ 진단 확인 이메일 발송 성공:', emailResult);
    return emailResult;

  } catch (error) {
    console.error('❌ 진단 확인 이메일 발송 실패:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '이메일 발송 중 오류가 발생했습니다',
      service: isServer() ? 'emailjs-api' : 'emailjs-browser'
    };
  }
}

// 🎯 상담 신청 확인 이메일 발송 (사용자용) - 직접 EmailJS 사용
export async function sendConsultationConfirmation(
  userEmail: string,
  userName: string,
  companyName: string,
  consultationType: string,
  consultantName?: string,
  appointmentDate?: string
): Promise<EmailResult> {
  try {
    console.log('📧 상담 확인 이메일 발송 시작 (직접 EmailJS 사용)');
    console.log('📨 이메일 내용:', {
      to: userEmail,
      userName,
      companyName,
      consultationType,
      consultantName,
      appointmentDate
    });

    const templateParams: ConsultationTemplateParams = {
      to_name: userName,
      to_email: userEmail,
      reply_to: userEmail,
      from_name: 'M-CENTER 기업의별',
      company_name: companyName,
      consultation_type: consultationType,
      submission_date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: '접수 완료',
      message: `안녕하세요 ${userName}님,\n\n${companyName}의 ${consultationType} 상담 신청이 정상적으로 접수되었습니다.\n\n담당 전문가가 검토 후 24시간 내에 연락드리겠습니다.\n\n문의사항이 있으시면 언제든 연락주세요.\n\n감사합니다.\nM-CENTER 기업의별`,
      consultant_name: consultantName || '이후경 경영지도사',
      appointment_date: appointmentDate || '별도 연락 예정'
    };

    let emailResult: EmailResult;

    // 🔧 브라우저 환경을 우선으로 하고, 서버는 백업으로 사용
    if (isBrowser()) {
      try {
        // 브라우저에서 EmailJS SDK 사용 (가장 안정적)
        console.log('🌐 브라우저 환경에서 EmailJS SDK 사용');
        
        if (!EMAIL_CONFIG.SERVICE_ID || !EMAIL_CONFIG.PUBLIC_KEY) {
          throw new Error('EmailJS 환경변수가 설정되지 않았습니다');
        }

        // EmailJS 초기화 확인
        if (typeof emailjs === 'undefined' || !emailjs.send) {
          throw new Error('EmailJS SDK가 로드되지 않았습니다');
        }

        const result = await emailjs.send(
          EMAIL_CONFIG.SERVICE_ID,
          EMAIL_CONFIG.TEMPLATE_CONSULTATION,
          templateParams,
          EMAIL_CONFIG.PUBLIC_KEY
        );

        emailResult = {
          success: true,
          messageId: result.text,
          service: 'emailjs-browser'
        };
        
        console.log('✅ 브라우저 EmailJS 호출 성공:', emailResult);
      } catch (browserError) {
        console.warn('⚠️ 브라우저 EmailJS 실패, 서버 API 시도:', browserError);
        
        // 브라우저 실패 시 서버 API 백업 시도
        emailResult = await sendEmailViaAPI(
          EMAIL_CONFIG.SERVICE_ID,
          EMAIL_CONFIG.TEMPLATE_CONSULTATION,
          templateParams,
          EMAIL_CONFIG.PUBLIC_KEY
        );
      }
    } else {
      // 서버에서만 API 직접 호출 (브라우저 우선이므로 이 경우는 드물음)
      console.log('🖥️ 서버 환경에서 EmailJS API 호출');
      emailResult = await sendEmailViaAPI(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_CONSULTATION,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );
    }

    console.log('✅ 상담 확인 이메일 발송 성공:', emailResult);
    return emailResult;

  } catch (error) {
    console.error('❌ 상담 확인 이메일 발송 실패:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '이메일 발송 중 오류가 발생했습니다',
      service: isServer() ? 'emailjs-api' : 'emailjs-browser'
    };
  }
}

// 🎯 관리자 알림 이메일 발송 - 직접 EmailJS 사용
export async function sendAdminNotification(
  type: 'consultation' | 'diagnosis',
  customerName: string,
  companyName: string,
  serviceType: string,
  details: string,
  customerEmail?: string
): Promise<EmailResult> {
  try {
    const adminEmail = 'hongik423@gmail.com'; // M-CENTER 관리자 이메일
    
    console.log('📧 관리자 알림 이메일 발송 시작 (직접 EmailJS 사용)');
    console.log('📨 관리자 알림 내용:', {
      type,
      customerName,
      companyName,
      serviceType,
      customerEmail,
      details: details.substring(0, 100) + '...'
    });

    const templateParams: AdminNotificationParams = {
      to_email: adminEmail,
      type,
      customer_name: customerName,
      company_name: companyName,
      service_type: serviceType,
      submission_date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      details,
      customer_email: customerEmail || '정보 없음'
    };

    let emailResult: EmailResult;

    // 🔧 브라우저 환경을 우선으로 하고, 서버는 백업으로 사용
    if (isBrowser()) {
      try {
        // 브라우저에서 EmailJS SDK 사용 (가장 안정적)
        console.log('🌐 브라우저 환경에서 EmailJS SDK 사용');
        
        if (!EMAIL_CONFIG.SERVICE_ID || !EMAIL_CONFIG.PUBLIC_KEY) {
          throw new Error('EmailJS 환경변수가 설정되지 않았습니다');
        }

        // EmailJS 초기화 확인
        if (typeof emailjs === 'undefined' || !emailjs.send) {
          throw new Error('EmailJS SDK가 로드되지 않았습니다');
        }

        const result = await emailjs.send(
          EMAIL_CONFIG.SERVICE_ID,
          EMAIL_CONFIG.TEMPLATE_ADMIN,
          templateParams,
          EMAIL_CONFIG.PUBLIC_KEY
        );

        emailResult = {
          success: true,
          messageId: result.text,
          service: 'emailjs-browser'
        };
        
        console.log('✅ 브라우저 EmailJS 호출 성공:', emailResult);
      } catch (browserError) {
        console.warn('⚠️ 브라우저 EmailJS 실패, 서버 API 시도:', browserError);
        
        // 브라우저 실패 시 서버 API 백업 시도
        emailResult = await sendEmailViaAPI(
          EMAIL_CONFIG.SERVICE_ID,
          EMAIL_CONFIG.TEMPLATE_ADMIN,
          templateParams,
          EMAIL_CONFIG.PUBLIC_KEY
        );
      }
    } else {
      // 서버에서만 API 직접 호출 (브라우저 우선이므로 이 경우는 드물음)
      console.log('🖥️ 서버 환경에서 EmailJS API 호출');
      emailResult = await sendEmailViaAPI(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ADMIN,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );
    }

    console.log('✅ 관리자 알림 이메일 발송 성공:', emailResult);
    return emailResult;

  } catch (error) {
    console.error('❌ 관리자 알림 이메일 발송 실패:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '이메일 발송 중 오류가 발생했습니다',
      service: isServer() ? 'emailjs-api' : 'emailjs-browser'
    };
  }
}

// 🎯 이메일 서비스 상태 확인
export function getEmailServiceStatus(): {
  isConfigured: boolean;
  environment: 'browser' | 'server';
  canSendEmail: boolean;
  mode: 'production' | 'simulation';
} {
  const isConfigured = !!(EMAIL_CONFIG.SERVICE_ID && EMAIL_CONFIG.PUBLIC_KEY);
  const environment = isBrowser() ? 'browser' : 'server';
  const canSendEmail = isConfigured; // 서버/브라우저 모두 이메일 발송 가능
  const mode = canSendEmail ? 'production' : 'simulation';
  
  return {
    isConfigured,
    environment,
    canSendEmail,
    mode
  };
}

// 🔧 EmailJS 초기화 (브라우저 환경에서만)
export function initializeEmailJS(): boolean {
  if (isServer()) {
    console.log('🔄 서버 사이드 환경: EmailJS 초기화 건너뜀');
    return false;
  }
  
  try {
    if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
      console.log('✅ EmailJS 초기화 성공');
      return true;
    } else {
      console.warn('⚠️ EmailJS 공개키가 설정되지 않았습니다');
      return false;
    }
  } catch (error) {
    console.error('❌ EmailJS 초기화 실패:', error);
    return false;
  }
}

// 🎯 이메일 발송 통합 함수
export async function sendEmail(
  type: 'diagnosis_confirmation' | 'consultation_confirmation' | 'admin_notification',
  params: any
): Promise<EmailResult> {
  const status = getEmailServiceStatus();
  
  console.log('📧 이메일 발송 시작:', {
    type,
    environment: status.environment,
    mode: status.mode,
    canSendEmail: status.canSendEmail
  });
  
  switch (type) {
    case 'diagnosis_confirmation':
      return await sendDiagnosisConfirmation(
        params.userEmail,
        params.userName,
        params.companyName,
        params.businessType,
        params.consultationType,
        params.contactNumber,
        params.diagnosisSummary
      );
      
    case 'consultation_confirmation':
      return await sendConsultationConfirmation(
        params.userEmail,
        params.userName,
        params.companyName,
        params.consultationType,
        params.consultantName,
        params.appointmentDate
      );
      
    case 'admin_notification':
      return await sendAdminNotification(
        params.type,
        params.customerName,
        params.companyName,
        params.serviceType,
        params.details,
        params.customerEmail
      );
      
    default:
      throw new Error(`지원하지 않는 이메일 타입: ${type}`);
  }
}

// EmailJS 서비스 상태 확인 함수
export const checkEmailServiceStatus = () => {
  try {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    
    const configured = !!(publicKey && serviceId);
    const missing = [];
    
    if (!publicKey) missing.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');
    if (!serviceId) missing.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
    
    return {
      configured,
      missing,
      hasPublicKey: !!publicKey,
      hasServiceId: !!serviceId
    };
  } catch (error) {
    return {
      configured: false,
      missing: ['모든 환경변수'],
      error: error instanceof Error ? error.message : '상태 확인 실패'
    };
  }
};

// EmailJS 초기화 함수
export const initEmailJS = (): boolean => {
  try {
    // 클라이언트 환경에서만 실행
    if (typeof window === 'undefined') {
      console.log('📧 서버 환경에서는 EmailJS를 초기화하지 않습니다.');
      return false;
    }

    // 환경변수 확인
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;

    if (!publicKey || !serviceId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('💡 EmailJS 환경변수가 설정되지 않음 (개발환경에서는 이메일 기능을 시뮬레이션합니다)');
      }
      return false;
    }

    // EmailJS 초기화 (비동기 처리)
    console.log('📧 EmailJS 초기화 시도중...');
    
    // 동적 import로 EmailJS 초기화 (비동기)
    (async () => {
      try {
        const emailjs = await import('@emailjs/browser');
        emailjs.default.init(publicKey);
        console.log('✅ EmailJS 초기화 완료');
      } catch (error) {
        console.warn('⚠️ EmailJS 초기화 실패:', error);
      }
    })();

    return true; // 초기화 요청이 성공적으로 시작됨
    
  } catch (error) {
    console.warn('⚠️ EmailJS 초기화 중 오류:', error);
    return false;
  }
};

// 타입 정의
export interface DiagnosisFormData {
  companyName: string;
  industry: string;
  businessStage: string;
  employeeCount: string;
  establishedYear: string;
  mainConcerns: string;
  expectedBudget: string;
  urgency: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  privacyConsent: boolean;
  submitDate?: string;
  
  // 🔧 진단 결과 정보 추가
  diagnosisScore?: string | number;
  recommendedServices?: string;
  reportType?: string;
  diagnosisFormType?: string;
}

export interface ConsultationFormData {
  consultationType: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  consultationArea: string;
  inquiryContent: string;
  preferredTime: string;
  privacyConsent: boolean;
  submitDate?: string;
  
  // 진단 연계 정보 (선택사항)
  isDiagnosisLinked?: boolean;
  diagnosisScore?: string;
  recommendedService?: string;
  diagnosisResultUrl?: string;
}

interface ProcessingResult {
  sheetSaved: boolean;
  autoReplySent: boolean;
  adminNotified: boolean;
  errors: string[];
  warnings: string[];
  details: {
    sheetResult?: any;
    emailResult?: any;
    adminResult?: any;
  };
}

// 유틸리티 함수들
function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// 검증 함수들
function validateConsultationData(formData: ConsultationFormData): { isValid: boolean; error?: string } {
  const requiredFields: (keyof ConsultationFormData)[] = [
    'consultationType', 'name', 'phone', 'email', 'company'
  ];
  
  for (const field of requiredFields) {
    if (!formData[field]) {
      return {
        isValid: false,
        error: `필수 필드가 누락되었습니다: ${field}`
      };
    }
  }
  
  if (!formData.privacyConsent) {
    return {
      isValid: false,
      error: '개인정보 수집 및 이용에 동의해야 합니다.'
    };
  }
  
  return { isValid: true };
}

/**
 * 진단 데이터 제출 처리 함수
 */
export const processDiagnosisSubmission = async (
  formData: DiagnosisFormData
): Promise<ProcessingResult> => {
  console.log('🔄 진단 제출 통합 처리 시작');
  
  const result: ProcessingResult = {
    sheetSaved: false,
    autoReplySent: false,
    adminNotified: false,
    errors: [],
    warnings: [],
    details: {}
  };

  try {
    // 1단계: 구글시트 저장
    console.log('📊 1단계: 구글시트에 진단 데이터 저장 중...');
    
    const { saveDiagnosisToGoogleSheets } = await import('./googleSheetsService');
    const sheetResult = await saveDiagnosisToGoogleSheets({
      // 구글시트 서비스가 요구하는 형식으로 변환
      회사명: formData.companyName,
      업종: formData.industry || '기타',
      사업담당자: formData.contactName,
      직원수: formData.employeeCount,
      사업성장단계: formData.businessStage,
      주요고민사항: formData.mainConcerns,
      예상혜택: formData.expectedBudget || '미정',
      진행사업장: '정보없음',
      담당자명: formData.contactName,
      연락처: formData.contactPhone,
      이메일: formData.contactEmail,
      개인정보동의: formData.privacyConsent ? '동의' : '미동의',
      
      // 영어 필드명 (하위 호환성)
      companyName: formData.companyName,
      industry: formData.industry || '기타',
      businessManager: formData.contactName,
      employeeCount: formData.employeeCount,
      establishmentDifficulty: formData.businessStage,
      mainConcerns: formData.mainConcerns,
      expectedBenefits: formData.expectedBudget || '미정',
      businessLocation: '정보없음',
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      privacyConsent: formData.privacyConsent
    }, 'AI_무료진단');

    result.sheetSaved = sheetResult.success;
    result.details.sheetResult = sheetResult;

    if (!sheetResult.success) {
      result.errors.push(`구글시트 저장 실패: ${sheetResult.error}`);
    } else {
      console.log('✅ 구글시트 저장 성공');
    }

    // 2단계: 사용자 확인 이메일 발송
    console.log('📧 2단계: 사용자 확인 이메일 발송 중...');
    
    // 🔧 진단 결과 정보 포함한 확인 메일
    let diagnosisSummary = '진단 결과는 담당자 상담을 통해 제공됩니다.';
    
    if (formData.diagnosisScore && formData.recommendedServices) {
      diagnosisSummary = `
📊 AI 진단 결과 요약:
• 진단 점수: ${formData.diagnosisScore}점 (100점 만점)
• 추천 서비스: ${formData.recommendedServices}
• 보고서 유형: ${formData.reportType || 'AI 무료진단'}

담당 전문가가 상세한 분석 결과를 2-3일 내에 안내해드리겠습니다.
추가 문의사항이 있으시면 언제든 연락 주세요.
      `.trim();
    }
    
    const userEmailResult = await sendDiagnosisConfirmation(
      formData.contactEmail,
      formData.contactName,
      formData.companyName,
      formData.industry || '기타',
      '무료 경영진단',
      formData.contactPhone,
      diagnosisSummary
    );

    result.autoReplySent = userEmailResult.success;
    result.details.emailResult = userEmailResult;

    if (!userEmailResult.success) {
      result.errors.push(`사용자 이메일 발송 실패: ${userEmailResult.error}`);
    } else {
      console.log('✅ 사용자 확인 이메일 발송 성공');
    }

    // 3단계: 관리자 알림 이메일 발송
    console.log('📧 3단계: 관리자 알림 이메일 발송 중...');
    
    const adminDetails = `
[진단 신청 정보]
• 회사명: ${formData.companyName}
• 업종: ${formData.industry || '기타'}
• 담당자: ${formData.contactName}
• 연락처: ${formData.contactPhone}
• 이메일: ${formData.contactEmail}
• 직원수: ${formData.employeeCount}
• 성장단계: ${formData.businessStage}
• 주요고민: ${formData.mainConcerns}
• 예상예산: ${formData.expectedBudget || '미정'}
• 신청일시: ${formData.submitDate || new Date().toLocaleString('ko-KR')}

${formData.diagnosisScore && formData.recommendedServices ? `
[AI 진단 결과]
• 진단 점수: ${formData.diagnosisScore}점 (100점 만점)
• 추천 서비스: ${formData.recommendedServices}
• 보고서 유형: ${formData.reportType || 'AI 무료진단'}
• 진단 폼 유형: ${formData.diagnosisFormType || '일반진단'}

⚠️ 고객에게 상세 분석 결과 안내가 필요합니다.
` : ''}
    `.trim();

    const adminEmailResult = await sendAdminNotification(
      'diagnosis',
      formData.contactName,
      formData.companyName,
      '무료 경영진단',
      adminDetails,
      formData.contactEmail
    );

    result.adminNotified = adminEmailResult.success;
    result.details.adminResult = adminEmailResult;

    if (!adminEmailResult.success) {
      result.errors.push(`관리자 이메일 발송 실패: ${adminEmailResult.error}`);
    } else {
      console.log('✅ 관리자 알림 이메일 발송 성공');
    }

    // 처리 결과 종합
    const successCount = [result.sheetSaved, result.autoReplySent, result.adminNotified].filter(Boolean).length;
    
    console.log(`🎯 진단 제출 처리 완료: ${successCount}/3 성공`);
    
    if (successCount === 0) {
      result.errors.push('모든 처리 단계에서 실패했습니다.');
    } else if (successCount < 3) {
      result.warnings.push(`${3 - successCount}개 기능에서 부분적 실패가 발생했습니다.`);
    }

    return result;

  } catch (error) {
    console.error('❌ 진단 제출 처리 중 전체 오류:', error);
    result.errors.push(error instanceof Error ? error.message : '알 수 없는 오류');
    return result;
  }
};

/**
 * 통합 상담신청 처리 함수
 */
export const processConsultationSubmission = async (
  formData: ConsultationFormData,
  diagnosisInfo?: {
    isLinked?: boolean;
    score?: string;
    primaryService?: string;
    resultUrl?: string;
  }
): Promise<ProcessingResult> => {
  console.log('🔄 상담 신청 통합 처리 시작');
  
  const result: ProcessingResult = {
    sheetSaved: false,
    autoReplySent: false,
    adminNotified: false,
    errors: [],
    warnings: [],
    details: {}
  };

  try {
    // 1단계: 구글시트 저장
    console.log('📊 1단계: 구글시트에 상담 신청 데이터 저장 중...');
    
    const { saveConsultationToGoogleSheets } = await import('./googleSheetsService');
    const sheetResult = await saveConsultationToGoogleSheets({
      // 구글시트 서비스가 요구하는 형식으로 변환
      상담유형: formData.consultationType,
      성명: formData.name,
      연락처: formData.phone,
      이메일: formData.email,
      회사명: formData.company,
      직책: formData.position || '정보없음', 
      상담분야: formData.consultationArea || '종합상담',
      문의내용: formData.inquiryContent || '상담 요청',
      희망상담시간: formData.preferredTime || '협의',
      개인정보동의: formData.privacyConsent ? '동의' : '미동의',
      
      // 영어 필드명 (하위 호환성)
      consultationType: formData.consultationType,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      company: formData.company,
      position: formData.position,
      consultationArea: formData.consultationArea,
      inquiryContent: formData.inquiryContent,
      preferredTime: formData.preferredTime,
      privacyConsent: formData.privacyConsent,
      
      // 진단 연계 정보
      isDiagnosisLinked: diagnosisInfo?.isLinked,
      diagnosisScore: diagnosisInfo?.score,
      recommendedService: diagnosisInfo?.primaryService
    }, diagnosisInfo);

    result.sheetSaved = sheetResult.success;
    result.details.sheetResult = sheetResult;

    if (!sheetResult.success) {
      result.errors.push(`구글시트 저장 실패: ${sheetResult.error}`);
    } else {
      console.log('✅ 구글시트 저장 성공');
    }

    // 2단계: 사용자 확인 이메일 발송
    console.log('📧 2단계: 사용자 확인 이메일 발송 중...');
    
    const userEmailResult = await sendConsultationConfirmation(
      formData.email,
      formData.name,
      formData.company,
      formData.consultationType,
      '이후경 경영지도사',
      '24시간 내 연락 예정'
    );

    result.autoReplySent = userEmailResult.success;
    result.details.emailResult = userEmailResult;

    if (!userEmailResult.success) {
      result.errors.push(`사용자 이메일 발송 실패: ${userEmailResult.error}`);
    } else {
      console.log('✅ 사용자 확인 이메일 발송 성공');
    }

    // 3단계: 관리자 알림 이메일 발송
    console.log('📧 3단계: 관리자 알림 이메일 발송 중...');
    
    const adminDetails = `
[상담 신청 정보]
• 상담유형: ${formData.consultationType}
• 성명: ${formData.name}
• 연락처: ${formData.phone}
• 이메일: ${formData.email}
• 회사명: ${formData.company}
• 직책: ${formData.position || '정보없음'}
• 상담분야: ${formData.consultationArea || '종합상담'}
• 문의내용: ${formData.inquiryContent || '상담 요청'}
• 희망시간: ${formData.preferredTime || '협의'}
• 신청일시: ${formData.submitDate || new Date().toLocaleString('ko-KR')}

${diagnosisInfo?.isLinked ? `
[진단 연계 정보]
• 진단점수: ${diagnosisInfo.score}점
• 추천서비스: ${diagnosisInfo.primaryService}
• 결과URL: ${diagnosisInfo.resultUrl}
` : ''}
    `.trim();

    const adminEmailResult = await sendAdminNotification(
      'consultation',
      formData.name,
      formData.company,
      formData.consultationType,
      adminDetails,
      formData.email
    );

    result.adminNotified = adminEmailResult.success;
    result.details.adminResult = adminEmailResult;

    if (!adminEmailResult.success) {
      result.errors.push(`관리자 이메일 발송 실패: ${adminEmailResult.error}`);
    } else {
      console.log('✅ 관리자 알림 이메일 발송 성공');
    }

    // 처리 결과 종합
    const successCount = [result.sheetSaved, result.autoReplySent, result.adminNotified].filter(Boolean).length;
    
    console.log(`🎯 상담 신청 처리 완료: ${successCount}/3 성공`);
    
    if (successCount === 0) {
      result.errors.push('모든 처리 단계에서 실패했습니다.');
    } else if (successCount < 3) {
      result.warnings.push(`${3 - successCount}개 기능에서 부분적 실패가 발생했습니다.`);
    }

    return result;

  } catch (error) {
    console.error('❌ 상담 신청 처리 중 전체 오류:', error);
    result.errors.push(error instanceof Error ? error.message : '알 수 없는 오류');
    return result;
  }
};

// 하위 호환성을 위한 기존 함수들
export const saveConsultationToGoogleSheets = async (formData: ConsultationFormData): Promise<{ success: boolean; error?: string; formType?: string }> => {
  const result = await processConsultationSubmission(formData);
  return {
    success: result.sheetSaved,
    error: result.errors.length > 0 ? result.errors.join(', ') : undefined,
    formType: 'consultation'
  };
};

export const saveDiagnosisToGoogleSheets = async (formData: DiagnosisFormData): Promise<{ success: boolean; error?: string; formType?: string }> => {
  try {
    console.log('📊 진단 데이터 저장 요청:', formData.companyName);
    
    // 동적 import로 구글시트 서비스 사용
    const { saveDiagnosisToGoogleSheets } = await import('./googleSheetsService');
    const result = await saveDiagnosisToGoogleSheets({
      companyName: formData.companyName,
      industry: formData.industry,
      businessManager: formData.contactName,
      employeeCount: formData.employeeCount,
      establishmentDifficulty: formData.businessStage,
      mainConcerns: formData.mainConcerns,
      expectedBenefits: formData.expectedBudget,
      businessLocation: '',
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      privacyConsent: formData.privacyConsent
    }, 'AI_무료진단');
    
    return {
      success: result.success,
      error: result.error,
      formType: 'diagnosis'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '진단 데이터 저장 중 오류가 발생했습니다.',
      formType: 'diagnosis'
    };
  }
}; 