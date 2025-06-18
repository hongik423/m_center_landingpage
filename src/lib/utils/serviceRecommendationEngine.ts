// 🏛️ 정책자금 및 정부지원 활용 서비스 추천 엔진
// 경영지도센터 6개 서비스영역 중 가장 적합한 1개 추천 시스템

export interface DiagnosisProcessRequest {
  companyName: string;
  industry: string;
  businessManager: string;
  employeeCount: string;
  establishmentDifficulty: string;
  businessLocation: string;
  mainConcerns: string;
  expectedBenefits: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  privacyConsent: boolean;
}

// 경영지도센터 6개 서비스영역 정의
export interface MCenterService {
  id: string;
  name: string;
  description: string;
  targetCompanies: string[];
  expectedOutcome: string;
  timeframe: string;
  investment: string;
  roi: string;
  governmentSupport: string[];
  priority: number;
}

// 6개 핵심 서비스 정의
export const MCENTER_SERVICES: MCenterService[] = [
  {
    id: 'business-analysis',
    name: 'BM ZEN 사업분석',
    description: '비즈니스 모델 최적화를 통한 수익성 개선 및 성장전략 수립',
    targetCompanies: ['매출정체', '수익성부족', '사업모델혁신', '투자유치준비'],
    expectedOutcome: '매출 20-40% 증대, 수익성 30% 개선',
    timeframe: '2-3개월',
    investment: '300-500만원',
    roi: '300-800%',
    governmentSupport: ['사업재편지원', 'BM혁신지원', '투자연계지원'],
    priority: 1
  },
  {
    id: 'ai-productivity',
    name: 'AI 활용 생산성향상',
    description: 'ChatGPT, 업무자동화 도구를 활용한 생산성 혁신',
    targetCompanies: ['업무효율저하', '인력부족', 'AI도입필요', '디지털전환'],
    expectedOutcome: '업무효율 40-60% 향상, 인건비 25% 절감',
    timeframe: '1-2개월',
    investment: '200-400만원',
    roi: '400-1000%',
    governmentSupport: ['AI도입지원', '스마트워크지원', '디지털전환지원'],
    priority: 2
  },
  {
    id: 'factory-auction',
    name: '경매활용 공장구매',
    description: '부동산 경매를 통한 고정비 절감 및 자산 확보',
    targetCompanies: ['제조업', '공장확장필요', '임대료부담', '자산확보'],
    expectedOutcome: '부동산비용 30-50% 절감, 자산가치 상승',
    timeframe: '3-6개월',
    investment: '1000-3000만원',
    roi: '200-500%',
    governmentSupport: ['공장신축지원', '시설자금지원', '입지지원'],
    priority: 3
  },
  {
    id: 'tech-startup',
    name: '기술사업화/기술창업',
    description: '기술 기반 사업화 및 창업 지원으로 혁신 성장',
    targetCompanies: ['기술보유', '창업준비', 'R&D필요', '특허활용'],
    expectedOutcome: '평균 5억원 자금 확보, 기술사업화 성공',
    timeframe: '6-12개월',
    investment: '500-1000만원',
    roi: '500-2000%',
    governmentSupport: ['TIPS프로그램', 'R&D지원', '기술사업화지원'],
    priority: 4
  },
  {
    id: 'certification',
    name: '인증지원',
    description: '벤처/이노비즈 등 각종 인증 취득으로 시장 신뢰도 제고',
    targetCompanies: ['신뢰도부족', '대기업납품필요', '세제혜택필요', '투자유치'],
    expectedOutcome: '연간 5,000만원 세제혜택, 신용도 상승',
    timeframe: '3-6개월',
    investment: '400-800만원',
    roi: '200-600%',
    governmentSupport: ['벤처확인지원', '이노비즈지원', '메인비즈지원'],
    priority: 5
  },
  {
    id: 'website',
    name: '웹사이트 구축',
    description: '전문 웹사이트 구축으로 온라인 마케팅 강화',
    targetCompanies: ['온라인마케팅', '브랜딩필요', '고객접점확대', '영업강화'],
    expectedOutcome: '온라인 매출 30-50% 증대, 브랜드 인지도 향상',
    timeframe: '2-4개월',
    investment: '500-1200만원',
    roi: '150-400%',
    governmentSupport: ['온라인마케팅지원', '브랜딩지원', '쇼핑몰지원'],
    priority: 6
  }
];

// 정책자금 및 정부지원 활용 매핑 규칙
export interface GovernmentSupportMapping {
  keyword: string;
  targetServices: string[];
  priority: number;
  reason: string;
}

// 정책자금 키워드별 서비스 매핑
export const GOVERNMENT_SUPPORT_MAPPINGS: GovernmentSupportMapping[] = [
  {
    keyword: '사업재편',
    targetServices: ['business-analysis', 'ai-productivity'],
    priority: 1,
    reason: '사업모델 혁신과 효율성 개선이 우선 필요'
  },
  {
    keyword: '디지털전환',
    targetServices: ['ai-productivity', 'website'],
    priority: 1,
    reason: 'AI 도입과 온라인 플랫폼 구축이 핵심'
  },
  {
    keyword: '기술혁신',
    targetServices: ['tech-startup', 'ai-productivity'],
    priority: 1,
    reason: '기술사업화와 AI 활용이 혁신 동력'
  },
  {
    keyword: '창업지원',
    targetServices: ['tech-startup', 'certification'],
    priority: 1,
    reason: '기술창업과 인증 취득이 성공 기반'
  },
  {
    keyword: '시설투자',
    targetServices: ['factory-auction', 'business-analysis'],
    priority: 1,
    reason: '공장구매와 투자계획 수립이 필수'
  },
  {
    keyword: '마케팅지원',
    targetServices: ['website', 'business-analysis'],
    priority: 1,
    reason: '온라인 마케팅과 비즈니스 전략이 중요'
  }
];

// 추천 결과 인터페이스
export interface ServiceRecommendation {
  primaryService: MCenterService;
  secondaryServices: MCenterService[];
  reasons: string[];
  actionPlan: ActionPlan;
  expectedResults: ExpectedResults;
  governmentSupports: GovernmentSupport[];
}

export interface ActionPlan {
  phase1: {
    period: string;
    tasks: string[];
    milestone: string;
  };
  phase2: {
    period: string;
    tasks: string[];
    milestone: string;
  };
  phase3: {
    period: string;
    tasks: string[];
    milestone: string;
  };
}

export interface ExpectedResults {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  quantitative: {
    salesIncrease: string;
    efficiencyGain: string;
    costReduction: string;
    roi: string;
  };
}

export interface GovernmentSupport {
  name: string;
  amount: string;
  duration: string;
  requirements: string[];
  successRate: string;
}

// 🚀 핵심 서비스 추천 엔진
export class ServiceRecommendationEngine {
  
  /**
   * "정책자금 및 정부지원 활용" 결과에 대한 최적 서비스 추천
   */
  static recommendForGovernmentSupport(data: DiagnosisProcessRequest): ServiceRecommendation {
    console.log('🎯 정책자금 활용 맞춤 서비스 추천 시작:', data.companyName);
    
    // 1. 기업 특성 분석
    const characteristics = this.analyzeCompanyCharacteristics(data);
    
    // 2. 정책자금 키워드 매칭
    const matchedMappings = this.matchGovernmentSupportKeywords(characteristics);
    
    // 3. 우선순위 기반 서비스 선정
    const primaryService = this.selectPrimaryService(characteristics, matchedMappings);
    const secondaryServices = this.selectSecondaryServices(primaryService, characteristics);
    
    // 4. 추천 이유 생성
    const reasons = this.generateRecommendationReasons(primaryService, characteristics);
    
    // 5. 액션플랜 생성
    const actionPlan = this.generateActionPlan(primaryService, characteristics);
    
    // 6. 예상 결과 생성
    const expectedResults = this.generateExpectedResults(primaryService, characteristics);
    
    // 7. 정부지원 프로그램 매칭
    const governmentSupports = this.matchGovernmentPrograms(primaryService, characteristics);
    
    return {
      primaryService,
      secondaryServices,
      reasons,
      actionPlan,
      expectedResults,
      governmentSupports
    };
  }
  
  /**
   * 기업 특성 분석
   */
  private static analyzeCompanyCharacteristics(data: DiagnosisProcessRequest) {
    const concerns = data.mainConcerns.toLowerCase();
    const benefits = data.expectedBenefits.toLowerCase();
    
    return {
      industry: data.industry,
      size: data.employeeCount,
      stage: data.establishmentDifficulty,
      concerns: this.extractConcernKeywords(concerns),
      benefits: this.extractBenefitKeywords(benefits),
      location: data.businessLocation
    };
  }
  
  /**
   * 주요 고민 키워드 추출
   */
  private static extractConcernKeywords(concerns: string): string[] {
    const keywords = [];
    
    if (concerns.includes('매출') || concerns.includes('수익')) keywords.push('매출정체');
    if (concerns.includes('인력') || concerns.includes('인재')) keywords.push('인력부족');
    if (concerns.includes('시설') || concerns.includes('공장')) keywords.push('시설투자');
    if (concerns.includes('마케팅') || concerns.includes('홍보')) keywords.push('마케팅부족');
    if (concerns.includes('기술') || concerns.includes('혁신')) keywords.push('기술혁신');
    if (concerns.includes('효율') || concerns.includes('생산성')) keywords.push('업무효율저하');
    if (concerns.includes('자금') || concerns.includes('투자')) keywords.push('자금부족');
    if (concerns.includes('인증') || concerns.includes('신뢰')) keywords.push('신뢰도부족');
    
    return keywords.length > 0 ? keywords : ['사업성장'];
  }
  
  /**
   * 기대 효과 키워드 추출
   */
  private static extractBenefitKeywords(benefits: string): string[] {
    const keywords = [];
    
    if (benefits.includes('매출') || benefits.includes('성장')) keywords.push('매출증대');
    if (benefits.includes('효율') || benefits.includes('생산성')) keywords.push('효율향상');
    if (benefits.includes('비용') || benefits.includes('절약')) keywords.push('비용절감');
    if (benefits.includes('확장') || benefits.includes('규모')) keywords.push('사업확장');
    if (benefits.includes('기술') || benefits.includes('혁신')) keywords.push('기술혁신');
    if (benefits.includes('고객') || benefits.includes('서비스')) keywords.push('고객확대');
    
    return keywords.length > 0 ? keywords : ['종합성장'];
  }
  
  /**
   * 정책자금 키워드 매칭
   */
  private static matchGovernmentSupportKeywords(characteristics: any): GovernmentSupportMapping[] {
    const matched = [];
    
    for (const mapping of GOVERNMENT_SUPPORT_MAPPINGS) {
      // 고민사항과 기대효과에서 키워드 매칭
      const concernMatch = characteristics.concerns.some((concern: string) => 
        concern.includes(mapping.keyword) || mapping.keyword.includes(concern.split('부족')[0])
      );
      
      const benefitMatch = characteristics.benefits.some((benefit: string) => 
        benefit.includes(mapping.keyword) || mapping.keyword.includes(benefit.split('증대')[0])
      );
      
      if (concernMatch || benefitMatch) {
        matched.push(mapping);
      }
    }
    
    // 기본 매핑 (매칭되는 것이 없을 경우)
    if (matched.length === 0) {
      matched.push({
        keyword: '종합지원',
        targetServices: ['business-analysis', 'ai-productivity'],
        priority: 1,
        reason: '종합적인 경영지도를 통한 체계적 성장 지원'
      });
    }
    
    return matched.sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * 1순위 서비스 선정
   */
  private static selectPrimaryService(
    characteristics: any, 
    mappings: GovernmentSupportMapping[]
  ): MCenterService {
    
    // 매핑된 서비스들의 점수 계산
    const serviceScores = new Map<string, number>();
    
    // 1. 정책자금 매핑 점수
    mappings.forEach(mapping => {
      mapping.targetServices.forEach(serviceId => {
        const currentScore = serviceScores.get(serviceId) || 0;
        serviceScores.set(serviceId, currentScore + (10 - mapping.priority) * 10);
      });
    });
    
    // 2. 업종별 추가 점수
    this.addIndustryBonus(serviceScores, characteristics.industry);
    
    // 3. 기업 규모별 추가 점수
    this.addSizeBonus(serviceScores, characteristics.size);
    
    // 4. 경영 단계별 추가 점수
    this.addStageBonus(serviceScores, characteristics.stage);
    
    // 가장 높은 점수의 서비스 선택
    let maxScore = 0;
    let selectedServiceId = 'business-analysis'; // 기본값
    
    serviceScores.forEach((score, serviceId) => {
      if (score > maxScore) {
        maxScore = score;
        selectedServiceId = serviceId;
      }
    });
    
    const selectedService = MCENTER_SERVICES.find(s => s.id === selectedServiceId);
    
    console.log('🏆 선정된 1순위 서비스:', {
      service: selectedService?.name,
      score: maxScore,
      allScores: Object.fromEntries(serviceScores)
    });
    
    return selectedService!;
  }
  
  /**
   * 업종별 보너스 점수
   */
  private static addIndustryBonus(scores: Map<string, number>, industry: string) {
    switch (industry.toLowerCase()) {
      case 'manufacturing':
      case '제조업':
        this.addScore(scores, 'factory-auction', 20);
        this.addScore(scores, 'ai-productivity', 15);
        break;
      case 'it':
      case '정보통신업':
        this.addScore(scores, 'ai-productivity', 25);
        this.addScore(scores, 'tech-startup', 20);
        this.addScore(scores, 'website', 15);
        break;
      case 'service':
      case '서비스업':
        this.addScore(scores, 'business-analysis', 20);
        this.addScore(scores, 'website', 18);
        this.addScore(scores, 'ai-productivity', 15);
        break;
      case 'construction':
      case '건설업':
        this.addScore(scores, 'factory-auction', 18);
        this.addScore(scores, 'business-analysis', 15);
        break;
      default:
        this.addScore(scores, 'business-analysis', 10);
    }
  }
  
  /**
   * 기업 규모별 보너스 점수
   */
  private static addSizeBonus(scores: Map<string, number>, size: string) {
    if (size.includes('10명 이하') || size.includes('소규모')) {
      this.addScore(scores, 'ai-productivity', 15);
      this.addScore(scores, 'website', 12);
    } else if (size.includes('50명 이하') || size.includes('중소규모')) {
      this.addScore(scores, 'business-analysis', 15);
      this.addScore(scores, 'certification', 12);
    } else {
      this.addScore(scores, 'factory-auction', 15);
      this.addScore(scores, 'tech-startup', 12);
    }
  }
  
  /**
   * 경영 단계별 보너스 점수
   */
  private static addStageBonus(scores: Map<string, number>, stage: string) {
    if (stage.includes('창업') || stage.includes('초기')) {
      this.addScore(scores, 'tech-startup', 20);
      this.addScore(scores, 'certification', 15);
      this.addScore(scores, 'website', 10);
    } else if (stage.includes('성장') || stage.includes('확장')) {
      this.addScore(scores, 'business-analysis', 20);
      this.addScore(scores, 'factory-auction', 15);
      this.addScore(scores, 'ai-productivity', 12);
    } else {
      this.addScore(scores, 'ai-productivity', 15);
      this.addScore(scores, 'business-analysis', 12);
    }
  }
  
  /**
   * 점수 추가 헬퍼 함수
   */
  private static addScore(scores: Map<string, number>, serviceId: string, bonus: number) {
    const currentScore = scores.get(serviceId) || 0;
    scores.set(serviceId, currentScore + bonus);
  }
  
  /**
   * 2-3순위 서비스 선정
   */
  private static selectSecondaryServices(
    primary: MCenterService, 
    characteristics: any
  ): MCenterService[] {
    
    const secondary = MCENTER_SERVICES
      .filter(service => service.id !== primary.id)
      .filter(service => {
        // 1순위 서비스와 시너지가 있는 서비스 우선 선택
        return this.hasSynergy(primary.id, service.id);
      })
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 2);
    
    return secondary;
  }
  
  /**
   * 서비스 간 시너지 확인
   */
  private static hasSynergy(primaryId: string, secondaryId: string): boolean {
    const synergyMap: { [key: string]: string[] } = {
      'business-analysis': ['ai-productivity', 'certification', 'website'],
      'ai-productivity': ['business-analysis', 'website', 'tech-startup'],
      'factory-auction': ['business-analysis', 'certification', 'ai-productivity'],
      'tech-startup': ['certification', 'ai-productivity', 'website'],
      'certification': ['business-analysis', 'tech-startup', 'factory-auction'],
      'website': ['business-analysis', 'ai-productivity', 'certification']
    };
    
    return synergyMap[primaryId]?.includes(secondaryId) || false;
  }
  
  /**
   * 추천 이유 생성
   */
  private static generateRecommendationReasons(
    service: MCenterService, 
    characteristics: any
  ): string[] {
    const reasons = [];
    
    // 기본 추천 이유
    reasons.push(`${characteristics.industry} 업종에서 ${service.name}는 즉시 적용 가능한 핵심 서비스입니다.`);
    
    // 기업 특성 기반 이유
    if (characteristics.concerns.includes('매출정체')) {
      reasons.push(`매출 정체 상황에서 ${service.expectedOutcome}를 통해 빠른 성과 창출이 가능합니다.`);
    }
    
    if (characteristics.size.includes('소규모') || characteristics.size.includes('10명 이하')) {
      reasons.push(`소규모 기업의 특성을 고려할 때 ${service.timeframe} 내 실행 가능한 최적의 솔루션입니다.`);
    }
    
    // 정부지원 연계 이유
    reasons.push(`${service.governmentSupport.join(', ')} 등 정부지원 프로그램과 직접 연계 가능합니다.`);
    
    // ROI 기반 이유
    reasons.push(`투자 대비 ${service.roi}의 높은 투자수익률로 경제적 효과가 검증되었습니다.`);
    
    return reasons;
  }
  
  /**
   * 30일 액션플랜 생성 (사용자 요구사항 반영)
   */
  private static generateActionPlan(
    service: MCenterService, 
    characteristics: any
  ): ActionPlan {
    
    return {
      phase1: {
        period: '1-10일 (즉시 실행)',
        tasks: [
          '전문가 무료 상담 신청 및 현황 진단',
          `${service.name} 서비스 상세 설명 및 계약 검토`,
          '정부지원 프로그램 신청 조건 확인',
          '내부 실행 팀 구성 및 역할 분담'
        ],
        milestone: '서비스 착수 준비 완료'
      },
      phase2: {
        period: '11-30일 (핵심 과제 - 사용자 요구사항)',
        tasks: [
          `🎯 경영지도센터 6개 서비스영역 중 ${service.name} 1개 최종 선택`,
          '선택된 서비스에 대한 구체적 실행계획 수립',
          '정부지원 신청서 작성 및 제출',
          '프로젝트 킥오프 및 본격 실행 시작'
        ],
        milestone: '30일 내 핵심 과제 완료 - 최적 서비스 선택 및 착수'
      },
      phase3: {
        period: '31-90일 (성과 창출)',
        tasks: [
          `${service.name} 프로젝트 본격 실행`,
          '중간 성과 점검 및 개선사항 도출',
          '추가 서비스 연계 필요성 검토',
          '첫 번째 가시적 성과 측정 및 보고'
        ],
        milestone: service.expectedOutcome
      }
    };
  }
  
  /**
   * 예상 결과 생성
   */
  private static generateExpectedResults(
    service: MCenterService, 
    characteristics: any
  ): ExpectedResults {
    
    return {
      immediate: [
        '전문가 컨설팅을 통한 현황 정확한 파악',
        '정부지원 프로그램 연계를 통한 비용 부담 최소화',
        '체계적인 실행계획 수립으로 방향성 명확화'
      ],
      shortTerm: [
        service.expectedOutcome,
        `${service.timeframe} 내 가시적 성과 창출`,
        '기업 운영 체계의 전반적 개선',
        '직원들의 업무 역량 및 만족도 향상'
      ],
      longTerm: [
        `${characteristics.industry} 업계 내 경쟁우위 확보`,
        '지속가능한 성장 기반 구축',
        '추가 정부지원 사업 연계를 통한 지속 성장',
        '업계 선도기업으로의 도약 기반 마련'
      ],
      quantitative: {
        salesIncrease: service.expectedOutcome.includes('매출') ? 
          service.expectedOutcome.match(/(\d+%-?\d*%)/)?.[0] || '20-30%' : '15-25%',
        efficiencyGain: service.id === 'ai-productivity' ? '40-60%' : '20-35%',
        costReduction: service.id === 'factory-auction' ? '30-50%' : '15-25%',
        roi: service.roi
      }
    };
  }
  
  /**
   * 정부지원 프로그램 매칭
   */
  private static matchGovernmentPrograms(
    service: MCenterService, 
    characteristics: any
  ): GovernmentSupport[] {
    
    const programs: GovernmentSupport[] = [];
    
    // 서비스별 주요 지원 프로그램
    service.governmentSupport.forEach(supportName => {
      programs.push(this.getGovernmentProgramDetails(supportName, characteristics));
    });
    
    // 공통 지원 프로그램
    programs.push({
      name: '중소기업 경영지도 지원사업',
      amount: '최대 2,000만원 (70% 지원)',
      duration: '6개월',
      requirements: ['중소기업', '3년 이상 운영', '전년도 매출 5억원 이상'],
      successRate: '85%'
    });
    
    return programs;
  }
  
  /**
   * 정부지원 프로그램 상세 정보
   */
  private static getGovernmentProgramDetails(
    supportName: string, 
    characteristics: any
  ): GovernmentSupport {
    
    const programMap: { [key: string]: Omit<GovernmentSupport, 'name'> } = {
      'AI도입지원': {
        amount: '최대 3,000만원 (80% 지원)',
        duration: '6개월',
        requirements: ['AI 도입 계획', '직원 10명 이상', '제조업/서비스업'],
        successRate: '92%'
      },
      '사업재편지원': {
        amount: '최대 5,000만원 (70% 지원)',
        duration: '12개월',
        requirements: ['사업 재편 계획', '3년 이상 운영', '매출 감소 증빙'],
        successRate: '78%'
      },
      'BM혁신지원': {
        amount: '최대 3,000만원 (70% 지원)',
        duration: '9개월',
        requirements: ['혁신 계획서', '중소기업', '신규 사업모델'],
        successRate: '82%'
      },
      '기본지원': {
        amount: '최대 2,000만원 (70% 지원)',
        duration: '6개월',
        requirements: ['중소기업', '사업계획서'],
        successRate: '75%'
      }
    };
    
    const details = programMap[supportName] || programMap['기본지원'];
    
    return {
      name: supportName,
      ...details
    };
  }
}

// 보고서 생성을 위한 헬퍼 함수들
export class GovernmentSupportReportGenerator {
  
  /**
   * 정책자금 활용 전용 보고서 생성
   */
  static generateGovernmentSupportReport(
    data: DiagnosisProcessRequest,
    recommendation: ServiceRecommendation
  ): string {
    
    const companyName = data.companyName;
    const serviceName = recommendation.primaryService.name;
    
    return `
# 🏛️ ${companyName} 정책자금 및 정부지원 활용 전략 보고서

## 📋 진단 개요
- **분석 대상**: ${companyName} (${data.industry})
- **기업 규모**: ${data.employeeCount}  
- **경영 단계**: ${data.establishmentDifficulty}
- **주요 고민**: ${data.mainConcerns}
- **기대 효과**: ${data.expectedBenefits}

## 🎯 **경영지도센터 6개 서비스영역 중 최적 추천**

### 🥇 **1순위 추천: ${serviceName}**

**추천 근거:**
${recommendation.reasons.map(reason => `• ${reason}`).join('\n')}

**예상 효과:**
- ${recommendation.primaryService.expectedOutcome}
- 투자 대비 효과: ${recommendation.primaryService.roi}
- 실행 기간: ${recommendation.primaryService.timeframe}

### 📊 **6개 서비스영역 비교 분석**

| 순위 | 서비스명 | 적합도 | 예상 효과 | 실행 기간 |
|------|----------|--------|-----------|-----------|
| 🥇 | **${recommendation.primaryService.name}** | **최적** | **${recommendation.primaryService.expectedOutcome}** | **${recommendation.primaryService.timeframe}** |
${recommendation.secondaryServices.map((service, index) => 
  `| ${index + 2}순위 | ${service.name} | 적합 | ${service.expectedOutcome} | ${service.timeframe} |`
).join('\n')}

## ⚡ **30일 내 핵심 과제 액션플랜**

### 🗓️ **Phase 1: ${recommendation.actionPlan.phase1.period}**
${recommendation.actionPlan.phase1.tasks.map(task => `✅ ${task}`).join('\n')}
**목표:** ${recommendation.actionPlan.phase1.milestone}

### 🎯 **Phase 2: ${recommendation.actionPlan.phase2.period}** ⭐ **핵심 과제**
${recommendation.actionPlan.phase2.tasks.map(task => `🔥 ${task}`).join('\n')}
**핵심 목표:** ${recommendation.actionPlan.phase2.milestone}

### 🚀 **Phase 3: ${recommendation.actionPlan.phase3.period}**
${recommendation.actionPlan.phase3.tasks.map(task => `📈 ${task}`).join('\n')}
**최종 목표:** ${recommendation.actionPlan.phase3.milestone}

## 💰 **정부지원 프로그램 연계 방안**

${recommendation.governmentSupports.map(program => `
### 📋 ${program.name}
- **지원 규모**: ${program.amount}
- **지원 기간**: ${program.duration}  
- **신청 조건**: ${program.requirements.join(', ')}
- **성공률**: ${program.successRate}
`).join('\n')}

## 📈 **예상 성과 및 효과**

### 즉시 효과 (1개월 내)
${recommendation.expectedResults.immediate.map(result => `• ${result}`).join('\n')}

### 단기 효과 (3-6개월)
${recommendation.expectedResults.shortTerm.map(result => `• ${result}`).join('\n')}

### 장기 효과 (1년 이상)
${recommendation.expectedResults.longTerm.map(result => `• ${result}`).join('\n')}

### 정량적 효과
- **매출 증가**: ${recommendation.expectedResults.quantitative.salesIncrease}
- **효율성 개선**: ${recommendation.expectedResults.quantitative.efficiencyGain}
- **비용 절감**: ${recommendation.expectedResults.quantitative.costReduction}
- **투자수익률**: ${recommendation.expectedResults.quantitative.roi}

## 🏁 **최종 결론 및 권고사항**

### ✅ **핵심 권고사항**
1. **즉시 실행**: ${serviceName} 서비스 우선 착수
2. **정부지원 활용**: ${recommendation.governmentSupports[0].name} 즉시 신청
3. **단계적 확장**: 성과 확인 후 2순위 서비스 연계
4. **성과 모니터링**: 30일, 90일 단위 정기 점검

### 🎯 **성공 확률 및 기대 효과**
- **성공 확률**: 85% 이상 (전문가 지원 + 정부지원 연계)
- **핵심 성과**: ${recommendation.primaryService.expectedOutcome}
- **추가 효과**: 경쟁력 강화, 신뢰도 향상, 지속 성장 기반 구축

---

**📞 즉시 상담 신청**: 전담 컨설턴트를 통한 맞춤형 실행계획 수립
**⏰ 상담 가능 시간**: 평일 09:00-18:00
**🎁 특별 혜택**: 첫 상담 무료 + 정부지원 신청 지원

*본 보고서는 ${companyName}의 현재 상황을 종합 분석하여 가장 효과적인 정책자금 활용 방안을 제시합니다.*
    `.trim();
  }
} 