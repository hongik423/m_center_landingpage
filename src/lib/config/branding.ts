/**
 * 🏢 브랜딩 및 연락처 정보 중앙 관리
 * 
 * 모든 브랜딩 관련 정보를 이 파일에서 중앙 관리합니다.
 * 변경 시 이 파일만 수정하면 전체 시스템에 적용됩니다.
 */

// 🏢 기업 정보
export const COMPANY_INFO = {
  name: 'ESG 인증원',
  shortName: 'ESG인증원',
  businessNumber: '123-45-67890',
  ceoName: '박윤철',
  address: '서울특별시 강남구',
  foundedYear: '2020',
  description: 'KAB 인정 ESG 경영시스템 시범 인증기관',
  slogan: '신뢰와 전문성으로 함께하는 ESG 인증원',
  vision: '아시아 최고의 ESG 경영시스템 인증기관',
  coreValues: [
    '🌱 공평성 (Impartiality)',
    '🔬 전문성 (Expertise)', 
    '🛡️ 신뢰성 (Reliability)',
    '💡 혁신성 (Innovation)'
  ],
  website: 'https://esgrr.co.kr',
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
  specialization: 'ESG 경영시스템 인증 및 컨설팅',
  certification: '중소벤처기업부 경영지도사',
  company: 'ESG 인증원',
  description: '25년간 500개 이상 기업의 ESG 인증을 지원한 전문가',
  background: 'ESG 경영시스템 전문가 + 500개사 인증 노하우'
} as const;

// 📞 연락처 정보
export const CONTACT_INFO = {
  mainPhone: '010-9251-9743',
  emergencyPhone: '010-9251-9743',
  mainEmail: 'hongik423@gmail.com',
  email: 'hongik423@gmail.com',
  kakaoTalk: '@esgrr',
  businessHours: '평일 09:00-18:00',
  consultationHours: '평일/주말 09:00-21:00',
  responseTime: '24시간 이내 연락',
  visitConsultation: '무료 ESG 인증 상담 가능',
  websiteUrl: 'https://esgrr.co.kr',
  
  // 상담 관련 정보 (하위 호환성)
  consultationInfo: {
    freeConsultation: 'ESG 인증 상담은 무료입니다!',
    consultationTime: '1시간',
    availableTime: '평일 09:00-18:00',
    responseMethod: '전화 또는 이메일'
  }
} as const;

// 🌐 웹사이트 정보
export const WEBSITE_INFO = {
  domain: 'esgrr.co.kr',
  title: 'ESG 인증원',
  description: 'KAB 인정 ESG 경영시스템 시범 인증기관',
  
  // SEO 관련
  keywords: [
    'ESG 인증',
    'ESG 경영시스템',
    'ISO 인증',
    '환경경영',
    '지속가능경영',
    'KAB 인정기관'
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

// 🎯 ESG 인증원 설정
export const CHATBOT_CONFIG = {
  name: `ESG 인증 전문가`,
  greeting: `안녕하세요! 🌱 ${CONSULTANT_INFO.fullTitle}입니다.`,
  
  systemMessage: `저는 ${CONSULTANT_INFO.fullTitle}로, ESG 인증원에서 25년간 500개 이상 기업의 ESG 인증을 지원한 전문가로서 ESG 인증 전문 상담을 진행합니다.`,
  
  contactInfo: {
    consultant: CONSULTANT_INFO.fullTitle,
    phone: CONTACT_INFO.mainPhone,
    email: CONTACT_INFO.mainEmail
  },
  
  character: {
    identity: '이후경 경영지도사',
    expertise: 'ESG 경영시스템 인증 전문가',
    tone: '전문적이면서도 친근한',
    focus: 'ESG 인증 중심의 실무적 솔루션 제시'
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