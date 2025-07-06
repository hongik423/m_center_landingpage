/**
 * 🏢 브랜딩 및 연락처 정보 중앙 관리
 * 
 * 모든 브랜딩 관련 정보를 이 파일에서 중앙 관리합니다.
 * 변경 시 이 파일만 수정하면 전체 시스템에 적용됩니다.
 */

// 🏢 기업 정보
export const COMPANY_INFO = {
  name: '기업의별 경영지도센터',
  shortName: 'M-CENTER',
  businessNumber: '123-45-67890',
  ceoName: '이후경',
  address: '서울특별시 강남구 테헤란로 123',
  foundedYear: '2020',
  description: 'AI 기반 비즈니스 혁신 전문 컨설팅',
  slogan: 'AI 시대의 성장 파트너',
  vision: '모든 기업이 AI로 성장하는 세상',
  coreValues: [
    '💫 혁신 (Innovation)',
    '🤝 신뢰 (Trust)', 
    '🎯 성과 (Performance)',
    '🌟 탁월함 (Excellence)'
  ],
  website: 'https://m-center-landingpage.vercel.app',
  email: 'hongik423@gmail.com'
} as const;

// 👨‍💼 담당자 정보
export const CONSULTANT_INFO = {
  name: '이후경',
  title: '경영지도사',
  fullTitle: '이후경 경영지도사',
  phone: '010-9251-9743',
  email: 'hongik423@gmail.com',
  experience: '25년',
  specialization: '기업 경영 혁신 및 성장 전략',
  certification: '중소벤처기업부 경영지도사',
  company: '기업의별 M-CENTER',
  description: '25년간 500개 이상 기업의 경영 혁신을 이끌어온 경영지도사',
  background: '현대그룹, 삼성생명 대기업 실무 경험 + 200개사 컨설팅 노하우'
} as const;

// 📞 연락처 정보
export const CONTACT_INFO = {
  mainPhone: '010-9251-9743',
  emergencyPhone: '010-9251-9743',
  mainEmail: 'hongik423@gmail.com',
  email: 'hongik423@gmail.com',
  kakaoTalk: '@mcenter',
  businessHours: '평일 09:00-18:00',
  consultationHours: '평일/주말 09:00-21:00',
  responseTime: '24시간 이내 연락',
  visitConsultation: '무료 현장 방문 상담 가능',
  websiteUrl: 'https://m-center.vercel.app',
  
  // 상담 관련 정보 (하위 호환성)
  consultationInfo: {
    freeConsultation: '첫 상담은 완전 무료입니다!',
    consultationTime: '30분',
    availableTime: '평일/주말 09:00-21:00',
    responseMethod: '전화 또는 이메일'
  }
} as const;

// 🌐 웹사이트 정보
export const WEBSITE_INFO = {
  domain: 'business-consulting-center.com',
  title: '기업의별 경영지도센터',
  description: 'AI 기반 기업 진단 및 전문 컨설팅 서비스',
  
  // SEO 관련
  keywords: [
    '경영지도센터',
    '기업컨설팅',
    'AI 진단',
    '사업분석',
    '정부지원사업',
    '중소기업 지원'
  ],
  
  // 소셜미디어
  social: {
    // 추후 필요시 추가
  }
} as const;

// 📧 이메일 템플릿 정보
export const EMAIL_TEMPLATES = {
  // 발신자 정보
  sender: {
    name: COMPANY_INFO.name,
    email: CONTACT_INFO.mainEmail,
    replyTo: CONTACT_INFO.mainEmail
  },
  
  // 공통 서명
  signature: `
${COMPANY_INFO.name}
${CONSULTANT_INFO.name}
📞 ${CONTACT_INFO.mainPhone}
📧 ${CONTACT_INFO.mainEmail}

${CONTACT_INFO.consultationInfo.freeConsultation}
  `.trim(),
  
  // 공통 푸터
  footer: `
---
🏢 ${COMPANY_INFO.name}
${COMPANY_INFO.slogan}
📞 ${CONTACT_INFO.mainPhone} | 📧 ${CONTACT_INFO.mainEmail}
  `.trim()
} as const;

// 🎯 M센터장 설정
export const CHATBOT_CONFIG = {
  name: `M센터장`,
  greeting: `안녕하세요! 🎯 ${CONSULTANT_INFO.fullTitle}입니다.`,
  
  systemMessage: `저는 ${CONSULTANT_INFO.fullTitle}로, 25년간 현대그룹과 삼성생명에서 쌓은 대기업 실무 경험과 500개 기업 컨설팅 노하우를 바탕으로 전문 상담을 진행합니다.`,
  
  contactInfo: {
    consultant: CONSULTANT_INFO.fullTitle,
    phone: CONTACT_INFO.mainPhone,
    email: CONTACT_INFO.mainEmail
  },
  
  character: {
    identity: '이후경 경영지도사',
    expertise: '25년 경영 컨설팅 전문가',
    tone: '전문적이면서도 친근한',
    focus: '실무 중심의 구체적 솔루션 제시'
  }
} as const;

// 🔧 환경 변수 (레거시 호환)
export const LEGACY_MAPPING = {
  // 기존 M-CENTER -> 새 브랜드명
  'M-CENTER': COMPANY_INFO.name,
  'M-Center': COMPANY_INFO.name,
  'm-center': COMPANY_INFO.shortName,
  
  // 기존 담당자 -> 새 담당자
  '이후경 책임컨설턴트': CONSULTANT_INFO.name,
  
  // 기존 이메일 -> 새 이메일
  'mcenter@example.com': CONTACT_INFO.mainEmail,
  'lhk@injc.kr': CONTACT_INFO.mainEmail
} as const;

// 🚀 내보내기 (편의 함수)
export const getBrandName = () => COMPANY_INFO.name;
export const getConsultantName = () => CONSULTANT_INFO.name;
export const getMainEmail = () => CONTACT_INFO.mainEmail;
export const getMainPhone = () => CONTACT_INFO.mainPhone;

// 전체 설정 객체
export const BRANDING_CONFIG = {
  company: COMPANY_INFO,
  consultant: CONSULTANT_INFO,
  contact: CONTACT_INFO,
  website: WEBSITE_INFO,
  email: EMAIL_TEMPLATES,
  chatbot: CHATBOT_CONFIG,
  legacy: LEGACY_MAPPING
} as const;

export default BRANDING_CONFIG; 