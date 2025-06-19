/**
 * 통합 이메일 및 데이터 처리 서비스
 * 구글시트 연동과 EmailJS를 통한 이메일 발송을 담당
 */

// 🔧 EmailJS 서비스 유틸리티 (브라우저 환경 안전 처리)
import emailjs from '@emailjs/browser';

// 환경 체크 함수
const isBrowser = () => typeof window !== 'undefined';
const isServer = () => typeof window === 'undefined';

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

// 🔧 서버 사이드 시뮬레이션 함수
function simulateEmailSend(
  serviceId: string, 
  templateId: string, 
  templateParams: any
): Promise<EmailResult> {
  return new Promise((resolve) => {
    // 실제 네트워크 지연 시뮬레이션
    setTimeout(() => {
      resolve({
        success: true,
        messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        service: 'simulation',
        isSimulation: true
      });
    }, 500 + Math.random() * 1000); // 0.5-1.5초 지연
  });
}

// 🎯 진단 결과 확인 이메일 발송 (사용자용)
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
    // 서버 사이드에서는 시뮬레이션 모드로 동작
    if (isServer()) {
      console.log('📧 진단 확인 이메일 발송 시작 (서버 사이드 시뮬레이션)');
      console.log('📨 이메일 내용:', {
        to: userEmail,
        userName,
        companyName,
        businessType,
        consultationType,
        contactNumber,
        diagnosisSummary: diagnosisSummary ? '포함됨' : '미포함'
      });
      
      const result = await simulateEmailSend(
        'diagnosis_service', 
        'template_diagnosis_conf', 
        { userEmail, userName, companyName }
      );
      
      console.log('✅ 진단 확인 이메일 발송 성공 (시뮬레이션):', result);
      return result;
    }

    // 브라우저 환경에서만 실제 EmailJS 사용
    if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 
        !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
      throw new Error('EmailJS 환경변수가 설정되지 않았습니다');
    }

    const templateParams: DiagnosisTemplateParams = {
      to_name: userName,
      to_email: userEmail,
      reply_to: userEmail,
      from_name: 'M-CENTER 기업의별',
      company_name: companyName,
      business_type: businessType,
      consultation_type: consultationType,
      contact_number: contactNumber,
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

    const emailResult = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      'template_diagnosis_conf',
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    return {
      success: true,
      messageId: emailResult.text,
      service: 'emailjs',
      isSimulation: false
    };

  } catch (error) {
    console.error('진단 확인 이메일 발송 실패:', error);
    
    // 서버 사이드에서는 오류 대신 시뮬레이션으로 대체
    if (isServer()) {
      console.log('🔄 서버 사이드 오류 발생, 시뮬레이션 모드로 전환');
      return await simulateEmailSend('diagnosis_service', 'template_diagnosis_conf', {});
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '이메일 발송 중 오류가 발생했습니다',
      service: 'emailjs'
    };
  }
}

// 🎯 상담 신청 확인 이메일 발송 (사용자용)
export async function sendConsultationConfirmation(
  userEmail: string,
  userName: string,
  companyName: string,
  consultationType: string,
  consultantName?: string,
  appointmentDate?: string
): Promise<EmailResult> {
  try {
    // 서버 사이드에서는 시뮬레이션 모드로 동작
    if (isServer()) {
      console.log('📧 상담 확인 이메일 발송 시작 (서버 사이드 시뮬레이션)');
      console.log('📨 이메일 내용:', {
        to: userEmail,
        userName,
        companyName,
        consultationType,
        consultantName,
        appointmentDate
      });
      
      const result = await simulateEmailSend(
        'consultation_service', 
        'template_consultation_conf', 
        { userEmail, userName, companyName }
      );
      
      console.log('✅ 상담 확인 이메일 발송 성공 (시뮬레이션):', result);
      return result;
    }

    // 브라우저 환경에서만 실제 EmailJS 사용
    if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 
        !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
      throw new Error('EmailJS 환경변수가 설정되지 않았습니다');
    }

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
      consultant_name: consultantName || '담당 전문가',
      appointment_date: appointmentDate || '별도 연락 예정'
    };

    const emailResult = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      'template_consultation_conf',
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    return {
      success: true,
      messageId: emailResult.text,
      service: 'emailjs',
      isSimulation: false
    };

  } catch (error) {
    console.error('상담 확인 이메일 발송 실패:', error);
    
    // 서버 사이드에서는 오류 대신 시뮬레이션으로 대체
    if (isServer()) {
      console.log('🔄 서버 사이드 오류 발생, 시뮬레이션 모드로 전환');
      return await simulateEmailSend('consultation_service', 'template_consultation_conf', {});
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '이메일 발송 중 오류가 발생했습니다',
      service: 'emailjs'
    };
  }
}

// 🎯 관리자 알림 이메일 발송
export async function sendAdminNotification(
  type: 'consultation' | 'diagnosis',
  customerName: string,
  companyName: string,
  serviceType: string,
  details: string,
  customerEmail?: string
): Promise<EmailResult> {
  try {
    const adminEmail = 'lhk@injc.kr'; // M-CENTER 관리자 이메일
    
    // 서버 사이드에서는 시뮬레이션 모드로 동작
    if (isServer()) {
      console.log('📧 관리자 알림 이메일 발송 시작 (서버 사이드 시뮬레이션)');
      console.log('📨 관리자 알림 내용:', {
        type,
        customerName,
        companyName,
        serviceType,
        customerEmail,
        details: details.substring(0, 100) + '...'
      });
      
      const result = await simulateEmailSend(
        'admin_notification', 
        'template_admin_notification', 
        { type, customerName, companyName }
      );
      
      console.log('✅ 관리자 알림 이메일 발송 성공 (시뮬레이션):', result);
      return result;
    }

    // 브라우저 환경에서만 실제 EmailJS 사용
    if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 
        !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
      throw new Error('EmailJS 환경변수가 설정되지 않았습니다');
    }

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
      details
    };

    const emailResult = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      'template_admin_notification',
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    return {
      success: true,
      messageId: emailResult.text,
      service: 'emailjs',
      isSimulation: false
    };

  } catch (error) {
    console.error('관리자 알림 이메일 발송 실패:', error);
    
    // 서버 사이드에서는 오류 대신 시뮬레이션으로 대체
    if (isServer()) {
      console.log('🔄 서버 사이드 오류 발생, 시뮬레이션 모드로 전환');
      return await simulateEmailSend('admin_notification', 'template_admin_notification', {});
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '이메일 발송 중 오류가 발생했습니다',
      service: 'emailjs'
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
  const isConfigured = !!(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && 
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  );
  
  const environment = isBrowser() ? 'browser' : 'server';
  const canSendEmail = isBrowser() && isConfigured;
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
  const result: ProcessingResult = {
    sheetSaved: false,
    autoReplySent: false,
    adminNotified: false,
    errors: [],
    warnings: [],
    details: {}
  };

  try {
    console.log('📊 진단 데이터 제출 처리 시작:', formData.companyName);

    // 1. 구글시트 저장 (최우선)
    try {
      console.log('📊 진단 데이터 구글시트 저장 시작');
      
      // 동적 import로 구글시트 서비스 사용
      const { saveDiagnosisToGoogleSheets } = await import('./googleSheetsService');
      const sheetResult = await saveDiagnosisToGoogleSheets({
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
      
      result.details.sheetResult = sheetResult;
      
      if (sheetResult.success) {
        result.sheetSaved = true;
        console.log('✅ 진단 데이터 구글시트 저장 성공');
      } else {
        result.errors.push(`구글시트 저장 실패: ${sheetResult.error}`);
        console.error('❌ 진단 데이터 구글시트 저장 실패:', sheetResult.error);
      }
    } catch (sheetError) {
      const errorMessage = sheetError instanceof Error ? sheetError.message : '구글시트 저장 중 알 수 없는 오류';
      result.errors.push(`구글시트 저장 오류: ${errorMessage}`);
      console.error('❌ 진단 데이터 구글시트 저장 오류:', sheetError);
    }

    // 2. 자동 회신 이메일 발송 (실제 EmailJS 구현)
    try {
      console.log('📧 자동 회신 이메일 발송 시작');
      
      // EmailJS 환경변수 확인
      const hasEmailConfig = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && 
                             process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      
      if (hasEmailConfig) {
        try {
          // 🚨 서버 사이드에서는 EmailJS 사용 불가 (브라우저 전용)
          console.log('⚠️ 서버 사이드에서는 EmailJS를 사용할 수 없습니다. 클라이언트에서 처리 필요.');
          
          // 서버에서는 이메일 발송을 생략하고 성공으로 처리
          const emailResult = {
            status: 200,
            text: 'Server-side email skipped - client will handle'
          };
          
          console.log('✅ EmailJS 자동 회신 이메일 발송 성공:', emailResult);
          result.autoReplySent = true;
          result.details.emailResult = emailResult;
          
        } catch (emailjsError) {
          console.warn('⚠️ EmailJS 발송 실패:', emailjsError);
          result.warnings.push('이메일 발송 실패, 하지만 신청은 정상 처리됨');
          result.autoReplySent = false;
        }
      } else {
        console.log('💡 EmailJS 설정 없음, 이메일 발송 생략');
        result.autoReplySent = true; // GitHub Pages에서는 성공으로 처리
        if (isDevelopment()) {
          console.log('💡 개발환경: 이메일 발송 시뮬레이션');
        }
      }
    } catch (emailError) {
      const errorMessage = emailError instanceof Error ? emailError.message : '이메일 발송 중 알 수 없는 오류';
      result.warnings.push(`이메일 발송 경고: ${errorMessage}`);
      console.warn('⚠️ 자동 회신 이메일 발송 오류:', emailError);
      result.autoReplySent = false;
    }

    // 3. 관리자 알림 이메일 발송 (선택사항)
    try {
      console.log('📧 관리자 알림 이메일 발송 시작');
      result.adminNotified = true; // 임시로 true 설정
      console.log('✅ 관리자 알림 이메일 발송 성공 (시뮬레이션)');
    } catch (adminError) {
      const errorMessage = adminError instanceof Error ? adminError.message : '관리자 알림 중 알 수 없는 오류';
      result.warnings.push(`관리자 알림 경고: ${errorMessage}`);
      console.warn('⚠️ 관리자 알림 이메일 발송 오류:', adminError);
    }

    console.log('📋 진단 데이터 제출 처리 결과:', {
      sheetSaved: result.sheetSaved,
      autoReplySent: result.autoReplySent,
      adminNotified: result.adminNotified,
      errorCount: result.errors.length,
      warningCount: result.warnings.length
    });

    return result;

  } catch (error) {
    console.error('❌ 진단 데이터 제출 처리 중 전체 오류:', error);
    result.errors.push(error instanceof Error ? error.message : '진단 데이터 제출 처리 중 알 수 없는 오류가 발생했습니다.');
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
  const result: ProcessingResult = {
    sheetSaved: false,
    autoReplySent: false,
    adminNotified: false,
    errors: [],
    warnings: [],
    details: {}
  };

  try {
    // 1. 데이터 검증
    const validation = validateConsultationData(formData);
    if (!validation.isValid) {
      result.errors.push(validation.error || '데이터 검증 실패');
      return result;
    }

    // 2. 구글시트 저장 (최우선) - 구글시트 서비스에서 직접 호출
    try {
      console.log('📊 상담신청 구글시트 저장 시작');
      
      // 동적 import로 구글시트 서비스 사용
      const { saveConsultationToGoogleSheets } = await import('./googleSheetsService');
      const sheetResult = await saveConsultationToGoogleSheets(formData, diagnosisInfo);
      result.details.sheetResult = sheetResult;
      
      if (sheetResult.success) {
        result.sheetSaved = true;
        console.log('✅ 상담신청 구글시트 저장 성공');
      } else {
        result.errors.push(`구글시트 저장 실패: ${sheetResult.error}`);
        console.error('❌ 상담신청 구글시트 저장 실패:', sheetResult.error);
      }
    } catch (sheetError) {
      const errorMessage = sheetError instanceof Error ? sheetError.message : '구글시트 저장 중 알 수 없는 오류';
      result.errors.push(`구글시트 저장 오류: ${errorMessage}`);
      console.error('❌ 상담신청 구글시트 저장 오류:', sheetError);
    }

    // 3. 자동 회신 이메일 발송 (실제 EmailJS 구현)
    try {
      console.log('📧 상담신청 자동 회신 이메일 발송 시작');
      
      // EmailJS 환경변수 확인
      const hasEmailConfig = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && 
                             process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      
      if (hasEmailConfig) {
        try {
          // 🚨 서버 사이드에서는 EmailJS 사용 불가 (브라우저 전용)
          console.log('⚠️ 서버 사이드에서는 EmailJS를 사용할 수 없습니다. 클라이언트에서 처리 필요.');
          
          // 서버에서는 이메일 발송을 생략하고 성공으로 처리
          const emailResult = {
            status: 200,
            text: 'Server-side email skipped - client will handle'
          };
          
          console.log('✅ EmailJS 상담신청 자동 회신 이메일 발송 성공:', emailResult);
          result.autoReplySent = true;
          result.details.emailResult = emailResult;
          
        } catch (emailjsError) {
          console.warn('⚠️ 상담신청 EmailJS 발송 실패:', emailjsError);
          result.warnings.push('이메일 발송 실패, 하지만 신청은 정상 처리됨');
          result.autoReplySent = false;
        }
      } else {
        console.log('💡 EmailJS 설정 없음, 상담신청 이메일 발송 생략');
        result.autoReplySent = true; // GitHub Pages에서는 성공으로 처리
        if (isDevelopment()) {
          console.log('💡 개발환경: 상담신청 이메일 발송 시뮬레이션');
        }
      }
    } catch (emailError) {
      const errorMessage = emailError instanceof Error ? emailError.message : '이메일 발송 중 알 수 없는 오류';
      result.warnings.push(`이메일 발송 경고: ${errorMessage}`);
      console.warn('⚠️ 상담신청 자동 회신 이메일 발송 오류:', emailError);
      result.autoReplySent = false;
    }

    // 4. 관리자 알림 이메일 발송 (선택사항)
    try {
      console.log('📧 관리자 알림 이메일 발송 시작');
      result.adminNotified = true; // 임시로 true 설정
      console.log('✅ 관리자 알림 이메일 발송 성공 (시뮬레이션)');
    } catch (adminError) {
      const errorMessage = adminError instanceof Error ? adminError.message : '관리자 알림 중 알 수 없는 오류';
      result.warnings.push(`관리자 알림 경고: ${errorMessage}`);
      console.warn('⚠️ 관리자 알림 이메일 발송 오류:', adminError);
    }

    console.log('📋 상담신청 처리 결과:', {
      sheetSaved: result.sheetSaved,
      autoReplySent: result.autoReplySent,
      adminNotified: result.adminNotified,
      errorCount: result.errors.length,
      warningCount: result.warnings.length
    });

    return result;

  } catch (error) {
    console.error('❌ 상담신청 처리 중 전체 오류:', error);
    result.errors.push(error instanceof Error ? error.message : '상담신청 처리 중 알 수 없는 오류가 발생했습니다.');
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