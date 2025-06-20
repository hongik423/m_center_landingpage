/**
 * 🏢 브랜딩 및 연락처 정보 중앙 관리
 * 
 * 모든 브랜딩 관련 정보를 이 파일에서 중앙 관리합니다.
 * 변경 시 이 파일만 수정하면 전체 시스템에 적용됩니다.
 */

// 🏢 기업 정보
export const COMPANY_INFO = {
  // 기업명 및 브랜드
  name: '기업의별 경영지도센터',
  brandName: '기업의별 경영지도센터',
  shortName: '기업의별',
  englishName: 'Business Consulting Center',
  
  // 슬로건
  slogan: '기업의별, 성공을 설계하다',
  tagline: '기업성장의 든든한 파트너',
  
  // 기업 설명
  description: 'AI 기반 기업 진단 및 컨설팅 서비스를 제공하는 전문 경영지도센터',
  mission: '중소기업의 지속가능한 성장과 혁신을 통한 경쟁력 강화 지원'
} as const;

// 👨‍💼 담당자 정보
export const CONSULTANT_INFO = {
  // 담당자 기본 정보
  name: '이후경 경영지도센터장',
  title: '경영지도센터장',
  position: '책임컨설턴트',
  experience: '25년 경영지도 경험',
  
  // 연락처 정보
  phone: '010-9251-9743',
  email: 'hongik423@gmail.com',
  
  // 전문 분야
  expertise: [
    'BM ZEN 사업분석',
    'AI 활용 생산성향상',
    '정부지원사업 연계',
    '기업진단 및 컨설팅'
  ],
  
  // 소개문
  introduction: '25년간 축적된 경영지도 노하우로 기업의 성장과 혁신을 지원하는 전문 컨설턴트입니다.'
} as const;

// 📞 연락처 정보
export const CONTACT_INFO = {
  // 주요 연락처
  mainEmail: 'hongik423@gmail.com',
  mainPhone: '010-9251-9743',
  
  // 업무 시간
  businessHours: '평일 09:00-18:00',
  responseTime: '24시간 이내 답변',
  
  // 상담 관련
  consultationInfo: {
    freeConsultation: '첫 상담은 완전 무료입니다!',
    consultationTime: '30분',
    availableTime: '평일 09:00-18:00',
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

// 🤖 AI 챗봇 설정
export const CHATBOT_CONFIG = {
  name: `별-AI상담사`,
  greeting: `안녕하세요! ⭐ ${COMPANY_INFO.name} 별-AI상담사입니다.`,
  
  systemMessage: `당신은 ${COMPANY_INFO.name}의 전문 별-AI상담사입니다. ${CONSULTANT_INFO.name}을 대표하여 친절하고 전문적으로 상담을 진행합니다.`,
  
  contactInfo: {
    consultant: CONSULTANT_INFO.name,
    phone: CONTACT_INFO.mainPhone,
    email: CONTACT_INFO.mainEmail
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