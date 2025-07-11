import { NextRequest, NextResponse } from 'next/server';

// 📚 M-CENTER 종합 지식 베이스 (최신 업데이트 반영)
const MCENTER_COMPREHENSIVE_KNOWLEDGE = {
  // 🏢 기업 정보
  company: {
    name: 'M-CENTER (기업의별 경영지도센터)',
    leader: '이후경 경영지도사',
    experience: '28년 (현대그룹 8년, 삼성생명 10년, 컨설팅 10년)',
    achievements: '500개 기업 직접 지도, 95% 성공률, 평균 ROI 400%',
    specialization: '고용노동부 일터혁신 수행기관',
    contact: '010-9251-9743',
    email: 'hongik423@gmail.com',
    website: 'https://m-center.co.kr'
  },

  // 🎯 6대 핵심서비스 (최신 정보 반영)
  coreServices: {
    'business-analysis': {
      name: 'BM ZEN 사업분석',
      description: '국내 유일 독자적 비즈니스모델 분석 프레임워크',
      keyFeatures: [
        '5단계 전략 프레임워크로 매출 20-40% 증대',
        'Business Model Canvas 고도화 버전',
        '수익모델 다각화 및 최적화',
        '시장분석 기반 데이터 중심 접근',
        '단계별 실행계획 및 성과 측정'
      ],
      results: {
        averageGrowth: '35% 매출 증대',
        successRate: '96% 고객만족도',
        sustainability: '85% 이상 지속성장',
        roi: '평균 280% ROI'
      },
      casestudy: 'D기업: 매출 120억→480억(3년), 영업이익률 8%→15%',
      price: '컨설팅 비용 100% 정부지원 가능'
    },
    'ai-productivity': {
      name: 'AI 생산성향상',
      description: '2025년 일터혁신 상생컨설팅 - AI 활용 생산성향상',
      keyFeatures: [
        '업무효율 40% 향상 보장',
        'ChatGPT 기업 활용 마스터',
        '20주 집중 프로그램',
        '247개 기업 실제 지도',
        '24시간 AI 자동화 시스템'
      ],
      results: {
        productivity: '평균 42% 업무효율 향상',
        timeReduction: '평균 35% 업무시간 단축',
        costSaving: '연간 평균 8,500만원 절감',
        satisfaction: '94% AI 도구 활용 만족도'
      },
      casestudy: 'AAA에너지관리IT: 제안서 작성 50% 단축, 해외사업 확장 가속화',
      government: '고용노동부 100% 지원 (일터혁신 수행기관)',
      price: '정부지원 100% 무료'
    },
    'policy-funding': {
      name: '정책자금 확보',
      description: '맞춤형 정책자금 확보 및 투자 분석',
      keyFeatures: [
        '업종별 맞춤형 정책자금 매칭',
        '평균 확보금액 15억원',
        '8단계 완벽 대행 프로세스',
        '금리 1.5-2.5% (시중은행 대비 3-4%p 절감)',
        '사후관리 및 추가지원 연계'
      ],
      results: {
        averageAmount: '평균 15억원 확보',
        interestSaving: '68% 이자비용 절감',
        successRate: '95% 승인률',
        timeframe: '평균 3-6개월'
      },
      casestudy: 'H관광개발: 5년간 총 100억원 확보, 매출 650% 성장',
      types: [
        '제조업: 시설자금 50억원 (연 1.5%)',
        '서비스업: 창업자금 10억원 (연 2.5%)',
        '기술기업: R&D 자금 100억원 (연 1.0%)'
      ]
    },
    'tech-startup': {
      name: '기술창업 지원',
      description: '기술사업화 및 창업 전주기 지원',
      keyFeatures: [
        '평균 5억원 자금 확보',
        'R&D부터 사업화까지 원스톱',
        '투자유치 단계별 맞춤 전략',
        '특허 포트폴리오 구축',
        '3년 사후관리 지원'
      ],
      results: {
        funding: '평균 5억원 확보',
        rdSuccess: '87% R&D 과제 선정',
        patentPortfolio: '평균 특허 15건 확보',
        valuationGrowth: '기업가치 평균 500억원',
        roi: '평균 2,174% ROI'
      },
      casestudy: 'ABC기업: 총 87억원 확보, 기업가치 500억원 달성',
      roadmap: [
        '1단계: 특허출원+예비벤처+디딤돌과제 1.7억원',
        '2단계: 벤처확인+기술개발+정책자금 24.7억원',
        '3단계: TIPS선정+해외진출+VC투자 57억원',
        '4단계: 상장준비+글로벌확대'
      ]
    },
    'certification': {
      name: '인증지원',
      description: '기업 성장을 위한 전략적 인증',
      keyFeatures: [
        '연간 5천만원 세제혜택',
        '100% 취득 보장',
        '12개 인증 통합 관리',
        '대기업 협력사 등록 지원',
        'ESG 경영 및 탄소중립 대응'
      ],
      results: {
        taxBenefit: '연간 5천만원 세제혜택',
        successRate: '100% 취득 보장',
        certificationCount: '평균 12개 인증',
        partnerRegistration: '대기업 3개사 협력사 등록'
      },
      casestudy: 'ABC기업: 12개 인증 획득, 대기업 협력사 등록, 납품단가 20% 상승',
      types: [
        'ISO 9001/14001/45001 통합인증',
        '벤처기업/이노비즈 인증',
        'ESG 경영 및 탄소중립 인증',
        '품질경영시스템 고도화'
      ]
    },
    'website': {
      name: '웹사이트 구축',
      description: '디지털 혁신 - 온라인 매출 300% 증대',
      keyFeatures: [
        '온라인 매출 300% 증대',
        'SEO 최적화 및 모바일 퍼스트',
        'AI 기반 콘텐츠 마케팅',
        '무료 1년 사후관리',
        '브랜드 가치 극대화'
      ],
      results: {
        salesGrowth: '온라인 매출 300% 증대',
        roi: '1년차 ROI 1,667%',
        trafficIncrease: '월 방문자 15,000명 달성',
        inquiryIncrease: '온라인 문의 월 200건'
      },
      casestudy: 'G제조업: 웹사이트 구축 후 온라인 매출 연 15억원 달성',
      package: [
        '반응형 웹사이트 구축',
        'SEO 최적화',
        '콘텐츠 마케팅',
        '구글/네이버 광고',
        '성과 분석 및 최적화'
      ]
    },
    'esg-certification': {
      name: 'ESG 인증원',
      description: 'KAB 인정 ESG 경영시스템 시범 인증기관',
      keyFeatures: [
        'ISO 9001/14001/45001 통합인증',
        'ESG 경영시스템 인증',
        '평균 15일 이내 인증 완료',
        'KAB 인정 공신력',
        '전문 심사원 팀 보유'
      ],
      results: {
        certificationTime: '평균 15일 이내',
        successRate: '100% 인증 획득',
        customerSatisfaction: '98% 고객만족도',
        afterService: '3년 사후관리 지원'
      },
      casestudy: '중소제조업 A사: ISO 9001/14001 통합인증으로 대기업 협력사 등록',
      certificationTypes: [
        'ISO 9001 (품질경영시스템)',
        'ISO 14001 (환경경영시스템)',
        'ISO 45001 (안전보건경영시스템)',
        'ESG 경영시스템'
      ],
      process: [
        '1단계: 신청 및 계약 (1-2일)',
        '2단계: 문서 심사 (3-5일)',
        '3단계: 현장 심사 (2-3일)',
        '4단계: 인증서 발급 (5-7일)'
      ],
      benefits: [
        '공평성을 최고의 가치로 하는 인증 서비스',
        '인증의 전문성을 통한 프로세스 완전성',
        '신속한 인증 처리 (업계 최단)',
        '체계적인 사후관리 서비스'
      ],
      contact: {
        phone: '02-588-5114',
        email: 'ycpark55@naver.com',
        website: 'https://www.esgrr.co.kr'
      }
    }
  },

  // 📊 성공사례 데이터베이스
  successCases: {
    manufacturing: {
      company: '(주)스마트팩토리솔루션',
      industry: '자동차 부품 제조',
      employees: '67명',
      revenue: '145억원',
      aiResults: {
        proposalTime: '69% 단축 (8시간→2.5시간)',
        qualityAnalysis: '85% 단축 (주 20시간→3시간)',
        customerResponse: '87% 단축 (4시간→30분)',
        reportCreation: '80% 단축 (40시간→8시간)',
        designRevision: '75% 단축 (3일→6시간)'
      },
      economicImpact: '연간 5억 8천만원 경제적 효과',
      satisfaction: '92% 직원만족도'
    },
    service: {
      company: '(주)크리에이티브마케팅',
      industry: '종합 광고 대행',
      employees: '28명',
      revenue: '42억원→68억원 (61% 성장)',
      aiResults: {
        copywriting: '81% 시간 단축',
        design: '83% 시간 단축',
        videoEditing: '86% 시간 단축',
        strategy: '78% 시간 단축',
        proposal: '86% 시간 단축'
      },
      productivity: '프로젝트 처리량 125% 증가',
      creativity: '아이디어 다양성 300% 증가'
    },
    startup: {
      company: '(주)AI헬스케어테크',
      industry: 'AI 헬스케어',
      stage: '창업 3년차',
      revenue: '월 8억원',
      aiResults: {
        developmentTime: '66% 단축 (24개월→8개월)',
        mvpValidation: '67% 단축 (6개월→2개월)',
        investmentSuccess: '467% 향상 (15%→85%)',
        customerAcquisition: '900% 초과달성',
        revenueGrowth: '무한대 성장'
      },
      valuation: '기업가치 500억원',
      funding: '총 87억원 확보'
    }
  },

  // 🤖 AI 생산성 향상 상세 정보
  aiProductivity: {
    program: '20주 집중 프로그램',
    phases: [
      '현황진단 (2주): AI 활용 가능 영역 발굴',
      'AI도구선정 (3주): 맞춤형 도구 선정 및 도입',
      '실무적용 (16주): 실제 업무 적용 및 최적화',
      '성과측정 (2주): ROI 분석 및 확산 계획'
    ],
    tools: [
      'ChatGPT/Claude (문서작성, 전략수립)',
      'Midjourney/DALL-E (디자인, 시각자료)',
      'RunwayML (영상편집, 모션그래픽)',
      'Zapier/Make (업무자동화)',
      'Python/Excel (데이터분석)'
    ],
    results: {
      companies: '247개 기업 지도',
      efficiency: '평균 42% 업무효율 향상',
      timeSaving: '평균 35% 업무시간 단축',
      costReduction: '연간 평균 8,500만원 절감',
      satisfaction: '94% AI 도구 활용 만족도'
    },
    government: '고용노동부 일터혁신 수행기관 - 100% 무료 지원'
  },

  // 📋 Q&A 데이터베이스 (34개 질문)
  qaDatabase: {
    totalQuestions: 34,
    personas: [
      '성장형 중소기업 CEO',
      '성장기 스타트업',
      '제조업 경영진',
      '서비스업 소상공인',
      '정책자금 특별상담',
      '성장전략 컨설팅',
      '종합 상담'
    ],
    coverageAreas: [
      '매출 성장 전략',
      '정부지원 로드맵',
      '기술사업화',
      '투자유치',
      'AI 생산성향상',
      '스마트팩토리',
      '환경규제 대응',
      '대기업 납품',
      '온라인 마케팅',
      '디지털 전환',
      '세무회계 관리',
      '인사노무 관리'
    ]
  },

  // 💰 정책자금 상세 정보
  policyFunding: {
    types: {
      manufacturing: {
        facility: '시설자금 50억원 (연 1.5%, 10년 상환)',
        operating: '운영자금 30억원 (연 2.0%, 5년 상환)',
        tech: '기술개발 20억원 (연 1.0%, 5년 거치)'
      },
      service: {
        startup: '창업자금 10억원 (연 2.5%, 7년 상환)',
        digital: '디지털 전환 5억원 (연 1.8%, 5년 상환)',
        marketing: '마케팅 2억원 (연 3.0%, 3년 상환)'
      },
      tech: {
        rd: 'R&D 자금 100억원 (연 1.0%, 7년 거치)',
        commercialization: '사업화 50억원 (연 1.5%, 5년 상환)'
      }
    },
    process: [
      '1단계: 기업진단 (재무상태+사업계획 분석)',
      '2단계: 자금매칭 (최적 정책자금 선별)',
      '3단계: 서류준비 (사업계획서+재무계획 작성)',
      '4단계: 신청접수',
      '5단계: 심사대응',
      '6단계: 승인협상',
      '7단계: 자금집행',
      '8단계: 사후관리'
    ],
    benefits: '68% 이자비용 절감 (정책자금 vs 시중은행)',
    successCase: 'H관광개발: 5년간 총 100억원 확보, 매출 650% 성장'
  },

  // 📊 세금계산기 정보
  taxCalculator: {
    types: [
      '소득세 계산기',
      '법인세 계산기',
      '부가가치세 계산기',
      '상속세 계산기',
      '증여세 계산기',
      '양도소득세 계산기',
      '종합소득세 계산기',
      '원천징수세 계산기',
      '주식양도세 계산기',
      '사업승계세 계산기'
    ],
    features: [
      '2024년 최신 세율 적용',
      '실시간 세액 계산',
      '세금 절약 팁 제공',
      '상세 계산 과정 표시',
      'PDF 결과 다운로드'
    ],
    url: 'https://m-center.co.kr/tax-calculator'
  }
};

// 🎯 고급 질문 분석 시스템
class AdvancedQuestionAnalyzer {
  
  // 질문 카테고리 분석
  static analyzeQuestion(message: string): {
    category: string;
    intent: string;
    service: string;
    urgency: string;
    complexity: string;
    responseLength: { min: number; max: number };
  } {
    const lowerMessage = message.toLowerCase();
    
    // 서비스별 키워드 매칭
    const serviceKeywords = {
      'ai-productivity': ['ai', '생산성', '자동화', '업무효율', '일터혁신', '상생컨설팅'],
      'business-analysis': ['사업분석', '비즈니스모델', 'bm zen', '매출증대', '수익구조'],
      'policy-funding': ['정책자금', '지원금', '보조금', '정부지원', '자금확보'],
      'tech-startup': ['창업', '스타트업', '기술사업화', '투자유치', 'r&d'],
      'certification': ['인증', 'iso', '벤처기업', '세제혜택', '품질인증'],
      'website': ['웹사이트', '홈페이지', '온라인', '마케팅', '디지털'],
      'esg-certification': ['esg', 'iso 9001', 'iso 14001', 'iso 45001', '품질경영', '환경경영', '안전보건', '인증원', 'kab']
    };
    
    let detectedService = 'general';
    let maxMatches = 0;
    
    for (const [service, keywords] of Object.entries(serviceKeywords)) {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedService = service;
      }
    }
    
    // 질문 의도 분석
    let intent = 'inquiry';
    if (lowerMessage.includes('상담') || lowerMessage.includes('신청')) intent = 'consultation';
    else if (lowerMessage.includes('비용') || lowerMessage.includes('가격')) intent = 'pricing';
    else if (lowerMessage.includes('사례') || lowerMessage.includes('성과')) intent = 'case-study';
    else if (lowerMessage.includes('방법') || lowerMessage.includes('어떻게')) intent = 'how-to';
    
    // 복잡도 분석
    const complexity = message.length > 100 ? 'complex' : 
                      message.length > 50 ? 'medium' : 'simple';
    
    // 응답 길이 결정
    const responseLength = complexity === 'complex' ? { min: 800, max: 2000 } :
                          complexity === 'medium' ? { min: 400, max: 800 } :
                          { min: 100, max: 400 };
    
    return {
      category: detectedService,
      intent,
      service: detectedService,
      urgency: 'normal',
      complexity,
      responseLength
    };
  }
}

// 🎭 고도화된 이후경 응답 생성기
class EnhancedLeeHukyungGenerator {
  
  // 서비스별 맞춤형 응답 생성
  static generateServiceResponse(message: string, analysis: any): string {
    const service = MCENTER_COMPREHENSIVE_KNOWLEDGE.coreServices[analysis.service];
    
    if (!service) {
      return this.generateGeneralResponse(message);
    }
    
    let response = `안녕하세요! 이후경 경영지도사입니다.\n\n`;
    
    // 서비스 소개
    response += `"${message}"에 대해 문의해주셔서 감사합니다! `;
    response += `${service.name}은 M-CENTER의 6대 핵심서비스 중 하나로 `;
    response += `${service.description}입니다.\n\n`;
    
    // 핵심 특징
    response += `🎯 **주요 특징:**\n`;
    service.keyFeatures.forEach(feature => {
      response += `• ${feature}\n`;
    });
    response += `\n`;
    
    // 성과 정보
    if (service.results) {
      response += `📊 **검증된 성과:**\n`;
      Object.entries(service.results).forEach(([key, value]) => {
        response += `• ${value}\n`;
      });
      response += `\n`;
    }
    
    // 사례 소개
    if (service.casestudy) {
      response += `🏆 **성공사례:**\n`;
      response += `${service.casestudy}\n\n`;
    }
    
    // 정부지원 정보
    if (service.government) {
      response += `💰 **정부지원:**\n`;
      response += `${service.government}\n\n`;
    }
    
    // 행동 유도
    response += `구체적인 상황을 알려주시면 더 정확한 맞춤형 솔루션을 제안해드릴 수 있습니다.\n\n`;
    response += `📞 **즉시 상담:** 010-9251-9743\n`;
    response += `🌐 **온라인 상담:** https://m-center.co.kr/consultation`;
    
    return response;
  }
  
  // AI 생산성 전용 응답
  static generateAIProductivityResponse(message: string): string {
    const aiData = MCENTER_COMPREHENSIVE_KNOWLEDGE.aiProductivity;
    
        return `안녕하세요! 이후경 경영지도사입니다.

AI 생산성 향상에 대해 문의해주셔서 정말 감사합니다! 28년 컨설팅 경험을 바탕으로 최근 2년간 247개 기업의 AI 도입을 직접 지도하면서 확신하게 된 것은, AI가 단순한 도구가 아니라 진정한 일터혁신의 게임체인저라는 것입니다.

🤖 **2025년 일터혁신 상생컨설팅 - AI 활용 생산성향상**

📊 **실제 성과 (247개 기업 평균):**
• 업무효율성 42% 향상
• 업무시간 35% 단축
• 연간 인건비 8,500만원 절감
• AI 도구 활용 만족도 94%

🎯 **20주 집중 프로그램:**
• 현황진단 (2주): AI 활용 가능 영역 발굴
• AI도구선정 (3주): 맞춤형 도구 선정 및 도입
• 실무적용 (16주): 실제 업무 적용 및 최적화
• 성과측정 (2주): ROI 분석 및 확산 계획

🏆 **성공사례: (주)스마트팩토리솔루션**
• 제안서 작성 시간 69% 단축 (8시간→2.5시간)
• 품질 데이터 분석 85% 단축 (주 20시간→3시간)
• 고객 문의 응답 87% 단축 (4시간→30분)
• 연간 경제적 효과 5억 8천만원

💰 **정부지원 혜택:**
고용노동부 일터혁신 수행기관으로서 컨설팅 비용 100% 정부지원 가능합니다.

구체적인 업종과 현재 가장 시간이 많이 걸리는 업무를 알려주시면, 맞춤형 AI 도입 로드맵을 제시해드리겠습니다.

📞 **직접 상담:** 010-9251-9743
🌐 **AI 진단:** https://m-center.co.kr/diagnosis`;
  }
  
  // 정책자금 전용 응답
  static generatePolicyFundingResponse(message: string): string {
    const policyData = MCENTER_COMPREHENSIVE_KNOWLEDGE.policyFunding;
    
    return `안녕하세요! 이후경 경영지도사입니다.

정책자금에 대해 문의해주셔서 감사합니다! 28년간 500개 기업을 지도하면서 정책자금 확보에 있어 평균 15억원, 최대 100억원까지 성공적으로 확보한 노하우를 바탕으로 말씀드리겠습니다.

💰 **업종별 정책자금 종류:**

🏭 **제조업**
• 시설자금: 50억원 (연 1.5%, 10년 상환)
• 운영자금: 30억원 (연 2.0%, 5년 상환)
• 기술개발: 20억원 (연 1.0%, 5년 거치)

🏢 **서비스업**
• 창업자금: 10억원 (연 2.5%, 7년 상환)
• 디지털 전환: 5억원 (연 1.8%, 5년 상환)
• 마케팅: 2억원 (연 3.0%, 3년 상환)

🚀 **기술기업**
• R&D 자금: 100억원 (연 1.0%, 7년 거치)
• 사업화: 50억원 (연 1.5%, 5년 상환)

📋 **8단계 완벽 대행 프로세스:**
1. 기업진단 (재무상태+사업계획 분석)
2. 자금매칭 (최적 정책자금 선별)
3. 서류준비 (사업계획서+재무계획 작성)
4. 신청접수 → 5. 심사대응 → 6. 승인협상
7. 자금집행 → 8. 사후관리

💡 **정책자금 vs 시중은행 비교 (10억원 기준):**
• 정책자금: 총 이자비용 1.2억원
• 시중은행: 총 이자비용 3.8억원
• **절약효과: 2.6억원 (68% 절감)**

🏆 **성공사례: H관광개발**
• 5년간 총 100억원 확보
• 매출 20억→150억원 (650% 성장)
• 직원 15명→120명 (8배 증가)

기업 규모와 업종, 자금 용도를 알려주시면 최적의 정책자금을 매칭해드리겠습니다.

📞 **정책자금 상담:** 010-9251-9743
🌐 **온라인 신청:** https://m-center.co.kr/services/policy-funding`;
  }
  
  // 일반 응답 생성
  static generateGeneralResponse(message: string): string {
    const company = MCENTER_COMPREHENSIVE_KNOWLEDGE.company;
    
    return `안녕하세요! ${company.name} ${company.leader}입니다.

"${message}"에 대해 문의해주셔서 감사합니다! 

28년간 현대그룹과 삼성생명에서 쌓은 대기업 실무 경험과 500개 기업을 직접 지도한 컨설팅 노하우를 바탕으로 실질적이고 성과 중심적인 솔루션을 제공해드리겠습니다.

🎯 **M-CENTER 6대 핵심서비스:**

1. **BM ZEN 사업분석** - 매출 20-40% 증대
2. **AI 생산성향상** - 업무효율 40% 향상 (정부 100% 지원)
3. **정책자금 확보** - 평균 15억원 확보
4. **기술창업 지원** - 평균 5억원 자금 확보
5. **인증지원** - 연간 5천만원 세제혜택
6. **웹사이트 구축** - 온라인 매출 300% 증대

📊 **검증된 성과:**
• 95% 성공률
• 평균 ROI 400%
• 500개 기업 직접 지도
• 고객 만족도 96%

구체적인 상황을 더 자세히 알려주시면 맞춤형 솔루션을 제시해드릴 수 있습니다.

📞 **직접 상담:** 010-9251-9743
🌐 **무료 진단:** https://m-center.co.kr/diagnosis
📧 **이메일:** hongik423@gmail.com`;
  }
}

// 🚀 메인 API 핸들러
export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // 고급 질문 분석
    const analysis = AdvancedQuestionAnalyzer.analyzeQuestion(message);
    
    console.log(`🎯 고도화된 질문 분석: ${analysis.category} (${analysis.complexity})`);
    
    let response = '';
    
    // 서비스별 맞춤형 응답 생성
    if (analysis.service === 'ai-productivity') {
      response = EnhancedLeeHukyungGenerator.generateAIProductivityResponse(message);
    } else if (analysis.service === 'policy-funding') {
      response = EnhancedLeeHukyungGenerator.generatePolicyFundingResponse(message);
    } else if (analysis.service !== 'general') {
      response = EnhancedLeeHukyungGenerator.generateServiceResponse(message, analysis);
    } else {
      response = EnhancedLeeHukyungGenerator.generateGeneralResponse(message);
    }
    
    // AI 기반 응답 고도화 시도
    try {
      const origin = new URL(request.url).origin;
      const enhancedPrompt = `당신은 28년 베테랑 이후경 경영지도사입니다. 다음 기본 응답을 더욱 전문적이고 신뢰감 있게 개선해주세요:

${response}

개선 가이드:
- 28년 경험의 전문성 강조
- 구체적인 성과 수치 활용
- 실제 사례 언급
- 따뜻하면서도 확신에 찬 어조
- 실용적인 다음 단계 제안
- 마크다운 기호 사용 금지
- 자연스러운 대화체 유지

질문: "${message}"`;
      
      const aiResponse = await fetch(`${origin}/api/chat-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: enhancedPrompt }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        if (aiData.response) {
          response = aiData.response;
        }
      }
    } catch (aiError) {
      console.log('AI 고도화 실패, 기본 응답 사용:', aiError);
    }
    
    // 버튼 생성
    const buttons = [
      {
        text: '🎯 무료 진단 받기',
        url: '/diagnosis',
        style: 'primary',
        icon: '🎯'
      },
      {
        text: '📞 상담 신청하기',
        url: '/consultation',
        style: 'secondary',
        icon: '📞'
      }
    ];
    
    // 서비스별 맞춤 버튼 추가
    if (analysis.service === 'ai-productivity') {
      buttons.push({
        text: '🤖 AI 생산성 자세히 보기',
        url: '/services/ai-productivity',
        style: 'outline',
        icon: '🤖'
      });
    } else if (analysis.service === 'policy-funding') {
      buttons.push({
        text: '💰 정책자금 자세히 보기',
        url: '/services/policy-funding',
        style: 'outline',
        icon: '💰'
      });
    }
     
     return NextResponse.json({
      response,
      category: analysis.category,
      service: analysis.service,
      intent: analysis.intent,
      complexity: analysis.complexity,
      responseLength: response.length,
      buttons,
      consultant: '이후경 경영지도사 (28년 경험)',
      timestamp: new Date().toISOString()
     });
    
  } catch (error) {
    console.error('❌ 고도화된 API 오류:', error);
    
    const fallbackButtons = [
       {
        text: '🎯 무료 진단 받기',
         url: '/diagnosis',
         style: 'primary',
         icon: '🎯'
       },
       {
        text: '📞 직접 상담하기',
        url: 'tel:010-9251-9743',
         style: 'secondary',
         icon: '📞'
       }
     ];
     
     return NextResponse.json({
      response: `안녕하세요! 이후경 경영지도사입니다.

잠시 시스템 문제가 있지만 괜찮습니다. 28년 현장 경험으로 언제든 직접 도움드릴 수 있어요.

M-CENTER는 6대 핵심서비스(BM ZEN 사업분석, AI 생산성향상, 정책자금 확보, 기술창업 지원, 인증지원, 웹사이트 구축)로 500개 기업을 성공으로 이끌어왔습니다.

📞 **직접 상담:** 010-9251-9743
🌐 **웹사이트:** https://m-center.co.kr

어떤 고민이든 함께 해결해나가겠습니다!`,
       error: true,
      buttons: fallbackButtons,
      consultant: '이후경 경영지도사 (28년 경험)'
     }, { status: 200 });
  }
} 