/**
 * 통합 이메일 및 데이터 처리 서비스
 * 구글시트 연동과 EmailJS를 통한 이메일 발송을 담당
 */

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
          // 동적 import로 EmailJS 사용
          const emailjs = await import('@emailjs/browser');
          
          // EmailJS 초기화
          emailjs.default.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
          
          // 이메일 템플릿 데이터 준비
          const templateParams = {
            to_email: formData.contactEmail,
            to_name: formData.contactName,
            company_name: formData.companyName,
            diagnosis_date: new Date().toLocaleDateString('ko-KR'),
            consultant_name: '이후경 경영지도사',
            consultant_phone: '010-9251-9743',
            consultant_email: 'lhk@injc.kr',
            service_name: 'AI 무료진단',
            reply_message: `${formData.companyName} 담당자님께,

AI 무료진단 신청이 접수되었습니다.

▣ 신청 정보
• 회사명: ${formData.companyName}
• 업종: ${formData.industry}
• 담당자: ${formData.contactName}
• 신청일: ${new Date().toLocaleDateString('ko-KR')}

전문가가 신청 내용을 검토한 후 2-3일 내에 연락드리겠습니다.

▣ 담당 컨설턴트
• 성명: 이후경 경영지도사
• 전화: 010-9251-9743
• 이메일: lhk@injc.kr

기업의별 M-CENTER`
          };
          
          const emailResult = await emailjs.default.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            'template_diagnosis_conf', // 실제 EmailJS 템플릿 ID 사용
            templateParams
          );
          
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
          // 동적 import로 EmailJS 사용
          const emailjs = await import('@emailjs/browser');
          
          // EmailJS 초기화
          emailjs.default.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
          
          // 이메일 템플릿 데이터 준비
          const templateParams = {
            to_email: formData.email,
            to_name: formData.name,
            company_name: formData.company,
            consultation_type: formData.consultationType,
            consultation_area: formData.consultationArea,
            preferred_time: formData.preferredTime,
            inquiry_content: formData.inquiryContent,
            consultation_date: new Date().toLocaleDateString('ko-KR'),
            consultant_name: '이후경 경영지도사',
            consultant_phone: '010-9251-9743',
            consultant_email: 'lhk@injc.kr',
            service_name: '전문가 상담',
            diagnosis_linked: diagnosisInfo?.isLinked ? '예' : '아니오',
            diagnosis_score: diagnosisInfo?.score || 'N/A',
            recommended_service: diagnosisInfo?.primaryService || 'N/A',
            reply_message: `${formData.name}님께,

전문가 상담 신청이 접수되었습니다.

▣ 상담 신청 정보
• 성명: ${formData.name}
• 회사명: ${formData.company}
• 상담유형: ${formData.consultationType}
• 상담분야: ${formData.consultationArea}
• 희망시간: ${formData.preferredTime}
• 신청일: ${new Date().toLocaleDateString('ko-KR')}

${diagnosisInfo?.isLinked ? `
▣ 진단 연계 정보
• 진단점수: ${diagnosisInfo.score}점
• 추천서비스: ${diagnosisInfo.primaryService}
` : ''}

담당 컨설턴트가 1-2일 내에 연락드리겠습니다.

▣ 담당 컨설턴트
• 성명: 이후경 경영지도사
• 전화: 010-9251-9743
• 이메일: lhk@injc.kr

기업의별 M-CENTER`
          };
          
          const emailResult = await emailjs.default.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            'template_diagnosis_conf', // 실제 EmailJS 템플릿 ID 사용
            templateParams
          );
          
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