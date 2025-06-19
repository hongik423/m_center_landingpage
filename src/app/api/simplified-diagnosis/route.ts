import { NextRequest, NextResponse } from 'next/server';
import { saveToGoogleSheets } from '@/lib/utils/googleSheetsService';
import { processDiagnosisSubmission, type DiagnosisFormData } from '@/lib/utils/emailService';
import { CONSULTANT_INFO, CONTACT_INFO, COMPANY_INFO } from '@/lib/config/branding';

// GitHub Pages 정적 export 호환성
export const dynamic = 'force-static';
export const revalidate = false;

interface SimplifiedDiagnosisRequest {
  companyName: string;
  industry: string;
  contactManager: string;
  email: string;
  employeeCount: string;
  growthStage: string;
  businessLocation: string;
  mainConcerns: string;
  expectedBenefits: string;
  privacyConsent: boolean;
  submitDate: string;
}

// 📊 신뢰할 수 있는 다중 지표 평가 체계
interface DetailedScoreMetrics {
  businessModel: number;      // 비즈니스 모델 적합성 (25%)
  marketPosition: number;     // 시장 위치 및 경쟁력 (20%)
  operationalEfficiency: number; // 운영 효율성 (20%)
  growthPotential: number;    // 성장 잠재력 (15%)
  digitalReadiness: number;   // 디지털 준비도 (10%)
  financialHealth: number;    // 재무 건전성 (10%)
}

interface ScoreWeights {
  businessModel: 0.25;
  marketPosition: 0.20;
  operationalEfficiency: 0.20;
  growthPotential: 0.15;
  digitalReadiness: 0.10;
  financialHealth: 0.10;
}

// 업종별 세분화된 분석 데이터 (신뢰도 향상)
const enhancedIndustryAnalysis = {
  'manufacturing': {
    marketGrowth: '7%',
    marketSize: '450조원',
    competitionLevel: '높음',
    digitalMaturity: '중간',
    keyMetrics: {
      averageROI: 12.5,
      marketShare: 'Top 30%',
      growthRate: 8.2,
      efficiency: 73
    },
    benchmarks: {
      excellent: 85,
      good: 75,
      average: 65,
      needsImprovement: 50
    },
    keyTrends: ['스마트팩토리', 'ESG경영', '탄소중립'],
    primaryServices: ['business-analysis', 'ai-productivity'],
    opportunities: ['정부 지원(스마트제조 혁신)', '수출 확대', '자동화 도입'],
    challenges: ['인력난', '원자재 가격 상승', '환경 규제 강화']
  },
  'it': {
    marketGrowth: '12%',
    marketSize: '220조원',
    competitionLevel: '매우높음',
    digitalMaturity: '높음',
    keyMetrics: {
      averageROI: 18.7,
      marketShare: 'Top 20%',
      growthRate: 15.3,
      efficiency: 81
    },
    benchmarks: {
      excellent: 88,
      good: 78,
      average: 68,
      needsImprovement: 55
    },
    keyTrends: ['생성형AI', '클라우드', 'SaaS'],
    primaryServices: ['ai-productivity', 'tech-startup'],
    opportunities: ['AI 기술 도입', '글로벌 진출', '정부 K-디지털'],
    challenges: ['기술 변화 속도', '인재 확보', '글로벌 경쟁']
  },
  'service': {
    marketGrowth: '6%',
    marketSize: '180조원',
    competitionLevel: '높음',
    digitalMaturity: '중간',
    keyMetrics: {
      averageROI: 14.2,
      marketShare: 'Top 25%',
      growthRate: 7.8,
      efficiency: 69
    },
    benchmarks: {
      excellent: 82,
      good: 72,
      average: 62,
      needsImprovement: 48
    },
    keyTrends: ['디지털 전환', '고객경험', '구독모델'],
    primaryServices: ['business-analysis', 'website'],
    opportunities: ['온라인 확장', '서비스 차별화', 'CRM 구축'],
    challenges: ['가격 경쟁', '고객 이탈', '디지털 역량 부족']
  },
  'retail': {
    marketGrowth: '5%',
    marketSize: '320조원',
    competitionLevel: '매우높음',
    digitalMaturity: '중간',
    keyMetrics: {
      averageROI: 11.8,
      marketShare: 'Top 35%',
      growthRate: 6.4,
      efficiency: 65
    },
    benchmarks: {
      excellent: 80,
      good: 70,
      average: 60,
      needsImprovement: 45
    },
    keyTrends: ['옴니채널', '라이브커머스', '개인화'],
    primaryServices: ['website', 'business-analysis'],
    opportunities: ['온라인 진출', '데이터 활용', '고객 세분화'],
    challenges: ['온라인 경쟁', '임대료 상승', '재고 관리']
  },
  'construction': {
    marketGrowth: '9%',
    marketSize: '120조원',
    competitionLevel: '보통',
    digitalMaturity: '낮음',
    keyMetrics: {
      averageROI: 10.5,
      marketShare: 'Top 30%',
      growthRate: 7.5,
      efficiency: 68
    },
    benchmarks: {
      excellent: 80,
      good: 70,
      average: 60,
      needsImprovement: 45
    },
    keyTrends: ['스마트건설', '친환경건축', 'BIM'],
    primaryServices: ['business-analysis', 'certification'],
    opportunities: ['그린뉴딜', '디지털 전환', '안전관리'],
    challenges: ['인력난', '원자재 가격 상승', '환경 규제 강화']
  },
  'food': {
    marketGrowth: '11%',
    marketSize: '100조원',
    competitionLevel: '보통',
    digitalMaturity: '낮음',
    keyMetrics: {
      averageROI: 11.2,
      marketShare: 'Top 35%',
      growthRate: 8.8,
      efficiency: 72
    },
    benchmarks: {
      excellent: 82,
      good: 72,
      average: 62,
      needsImprovement: 48
    },
    keyTrends: ['푸드테크', '비건트렌드', '배달최적화'],
    primaryServices: ['website', 'business-analysis'],
    opportunities: ['온라인 진출', '브랜드화', '품질인증'],
    challenges: ['가격 경쟁', '고객 이탈', '디지털 역량 부족']
  },
  'healthcare': {
    marketGrowth: '14%',
    marketSize: '180조원',
    competitionLevel: '보통',
    digitalMaturity: '중간',
    keyMetrics: {
      averageROI: 13.7,
      marketShare: 'Top 25%',
      growthRate: 12.3,
      efficiency: 78
    },
    benchmarks: {
      excellent: 85,
      good: 75,
      average: 65,
      needsImprovement: 50
    },
    keyTrends: ['디지털헬스', '원격의료', 'AI진단'],
    primaryServices: ['ai-productivity', 'certification'],
    opportunities: ['정부지원', '기술혁신', '인증취득'],
    challenges: ['인력난', '원자재 가격 상승', '환경 규제 강화']
  },
  'education': {
    marketGrowth: '13%',
    marketSize: '120조원',
    competitionLevel: '보통',
    digitalMaturity: '낮음',
    keyMetrics: {
      averageROI: 10.8,
      marketShare: 'Top 30%',
      growthRate: 7.8,
      efficiency: 68
    },
    benchmarks: {
      excellent: 80,
      good: 70,
      average: 60,
      needsImprovement: 45
    },
    keyTrends: ['에듀테크', '온라인교육', 'AI맞춤형'],
    primaryServices: ['ai-productivity', 'website'],
    opportunities: ['디지털교육', '콘텐츠개발', '플랫폼구축'],
    challenges: ['가격 경쟁', '고객 이탈', '디지털 역량 부족']
  },
  'finance': {
    marketGrowth: '7%',
    marketSize: '150조원',
    competitionLevel: '보통',
    digitalMaturity: '낮음',
    keyMetrics: {
      averageROI: 11.5,
      marketShare: 'Top 35%',
      growthRate: 6.5,
      efficiency: 67
    },
    benchmarks: {
      excellent: 80,
      good: 70,
      average: 60,
      needsImprovement: 45
    },
    keyTrends: ['핀테크', '디지털뱅킹', 'AI금융'],
    primaryServices: ['ai-productivity', 'certification'],
    opportunities: ['디지털화', '규제대응', '신기술도입'],
    challenges: ['인력난', '원자재 가격 상승', '환경 규제 강화']
  },
  'other': {
    marketGrowth: '8%',
    marketSize: '150조원',
    competitionLevel: '보통',
    digitalMaturity: '낮음',
    keyMetrics: {
      averageROI: 13.5,
      marketShare: 'Top 40%',
      growthRate: 9.1,
      efficiency: 71
    },
    benchmarks: {
      excellent: 83,
      good: 73,
      average: 63,
      needsImprovement: 50
    },
    keyTrends: ['디지털혁신', '고객중심', '효율화'],
    primaryServices: ['business-analysis', 'ai-productivity'],
    opportunities: ['디지털 전환', '프로세스 개선', '혁신성장'],
    challenges: ['변화 대응', '기술 격차', '인력 개발']
  }
};

// 6개 핵심 서비스 정보
const mCenterServices = {
  'business-analysis': {
    name: 'BM ZEN 사업분석',
    description: '비즈니스 모델 최적화를 통한 수익성 개선',
    expectedEffect: '매출 20-40% 증대',
    duration: '2-3개월',
    successRate: '95%'
  },
  'ai-productivity': {
    name: 'AI실무활용 생산성향상',
    description: 'ChatGPT 등 AI 도구 활용 업무 효율화',
    expectedEffect: '업무효율 40-60% 향상',
    duration: '1-2개월',
    successRate: '98%'
  },
  'factory-auction': {
    name: '경매활용 공장구매',
    description: '부동산 경매를 통한 고정비 절감',
    expectedEffect: '부동산비용 30-50% 절감',
    duration: '3-6개월',
    successRate: '85%'
  },
  'tech-startup': {
    name: '기술사업화/기술창업',
    description: '기술을 활용한 사업화 및 창업 지원',
    expectedEffect: '기술가치 평가 상승',
    duration: '6-12개월',
    successRate: '78%'
  },
  'certification': {
    name: '인증지원',
    description: 'ISO, 벤처인증 등 각종 인증 취득',
    expectedEffect: '시장 신뢰도 향상',
    duration: '3-6개월',
    successRate: '92%'
  },
  'website': {
    name: '웹사이트 구축',
    description: 'SEO 최적화 웹사이트 구축',
    expectedEffect: '온라인 문의 300% 증가',
    duration: '1-2개월',
    successRate: '96%'
  }
};

// 📊 정교한 점수 계산 함수
function calculateDetailedScore(data: SimplifiedDiagnosisRequest): {
  metrics: DetailedScoreMetrics;
  totalScore: number;
  reliabilityScore: number;
  evaluationBasis: string[];
} {
  const industryData = enhancedIndustryAnalysis[data.industry as keyof typeof enhancedIndustryAnalysis] || enhancedIndustryAnalysis['other'];
  
  // 1. 비즈니스 모델 적합성 (25%)
  let businessModelScore = industryData.keyMetrics.averageROI * 4; // 기본 점수
  
  // 업종별 가산점
  if (data.industry === 'it' || data.industry === 'tech') businessModelScore += 5;
  if (data.industry === 'manufacturing') businessModelScore += 3;
  
  // 고민사항 분석 가산점
  const concerns = data.mainConcerns.toLowerCase();
  if (concerns.includes('수익') || concerns.includes('매출')) businessModelScore += 8;
  if (concerns.includes('비즈니스') || concerns.includes('모델')) businessModelScore += 5;
  
  businessModelScore = Math.min(95, Math.max(40, businessModelScore));

  // 2. 시장 위치 및 경쟁력 (20%)
  let marketPositionScore = 70; // 기본 점수
  
  // 업종 성장률 반영
  const growthRate = parseFloat(industryData.marketGrowth);
  if (growthRate >= 10) marketPositionScore += 8;
  else if (growthRate >= 7) marketPositionScore += 5;
  else if (growthRate >= 5) marketPositionScore += 2;
  
  // 기업 규모별 보정
  const sizeMultiplier: Record<string, number> = {
    '1-5': 0.85,
    '6-10': 0.92,
    '11-30': 1.0,
    '31-50': 1.05,
    '51-100': 1.08,
    '100+': 1.10
  };
  marketPositionScore *= sizeMultiplier[data.employeeCount] || 1.0;
  
  marketPositionScore = Math.min(95, Math.max(45, marketPositionScore));

  // 3. 운영 효율성 (20%)
  let operationalScore = industryData.keyMetrics.efficiency;
  
  // 성장단계별 보정
  const stageBonus: Record<string, number> = {
    'startup': -5,
    'early': 0,
    'growth': 8,
    'mature': 5,
    'expansion': 10
  };
  operationalScore += stageBonus[data.growthStage] || 0;
  
  // 효율성 관련 고민사항 반영
  if (concerns.includes('효율') || concerns.includes('생산성')) operationalScore += 6;
  if (concerns.includes('자동화') || concerns.includes('시스템')) operationalScore += 4;
  
  operationalScore = Math.min(95, Math.max(40, operationalScore));

  // 4. 성장 잠재력 (15%)
  let growthPotentialScore = industryData.keyMetrics.growthRate * 5;
  
  // 예상혜택 분석
  const benefits = data.expectedBenefits.toLowerCase();
  if (benefits.includes('성장') || benefits.includes('확장')) growthPotentialScore += 10;
  if (benefits.includes('혁신') || benefits.includes('개선')) growthPotentialScore += 7;
  
  // 성장단계별 가산점
  if (data.growthStage === 'growth' || data.growthStage === 'expansion') growthPotentialScore += 8;
  
  growthPotentialScore = Math.min(95, Math.max(45, growthPotentialScore));

  // 5. 디지털 준비도 (10%)
  let digitalScore = 60; // 기본 점수
  
  // 업종별 디지털 성숙도 반영
  const digitalMaturity: Record<string, number> = {
    '높음': 15,
    '중간': 8,
    '낮음': 0
  };
  digitalScore += digitalMaturity[industryData.digitalMaturity] || 5;
  
  // 디지털 관련 고민사항
  if (concerns.includes('디지털') || concerns.includes('ai') || concerns.includes('온라인')) {
    digitalScore += 12;
  }
  
  digitalScore = Math.min(95, Math.max(35, digitalScore));

  // 6. 재무 건전성 (10%)
  let financialScore = 65; // 기본 점수
  
  // 기업 규모별 재무 안정성 추정
  const financialStability: Record<string, number> = {
    '1-5': -8,
    '6-10': -3,
    '11-30': 2,
    '31-50': 7,
    '51-100': 12,
    '100+': 15
  };
  financialScore += financialStability[data.employeeCount] || 0;
  
  // 비용 관련 고민사항
  if (concerns.includes('비용') || concerns.includes('자금')) financialScore -= 5;
  if (benefits.includes('절감') || benefits.includes('효율')) financialScore += 8;
  
  financialScore = Math.min(95, Math.max(40, financialScore));

  // 최종 점수 계산 (가중평균)
  const weights: ScoreWeights = {
    businessModel: 0.25,
    marketPosition: 0.20,
    operationalEfficiency: 0.20,
    growthPotential: 0.15,
    digitalReadiness: 0.10,
    financialHealth: 0.10
  };

  const metrics: DetailedScoreMetrics = {
    businessModel: Math.round(businessModelScore),
    marketPosition: Math.round(marketPositionScore),
    operationalEfficiency: Math.round(operationalScore),
    growthPotential: Math.round(growthPotentialScore),
    digitalReadiness: Math.round(digitalScore),
    financialHealth: Math.round(financialScore)
  };

  const totalScore = Math.round(
    metrics.businessModel * weights.businessModel +
    metrics.marketPosition * weights.marketPosition +
    metrics.operationalEfficiency * weights.operationalEfficiency +
    metrics.growthPotential * weights.growthPotential +
    metrics.digitalReadiness * weights.digitalReadiness +
    metrics.financialHealth * weights.financialHealth
  );

  // 신뢰도 계산 (데이터 품질, 응답 완성도 등)
  let reliabilityScore = 75; // 기본 신뢰도
  
  // 응답 품질에 따른 신뢰도 조정
  if (data.mainConcerns.length > 100) reliabilityScore += 10;
  if (data.expectedBenefits.length > 50) reliabilityScore += 5;
  if (data.contactManager.length > 5) reliabilityScore += 5;
  
  // 업종 데이터 신뢰도
  if (industryData.marketSize !== '150조원') reliabilityScore += 5; // 구체적 데이터 있음
  
  reliabilityScore = Math.min(95, reliabilityScore);

  // 평가 근거 명시
  const evaluationBasis = [
    `업종별 벤치마크 기준 (${data.industry}: 우수 ${industryData.benchmarks.excellent}점)`,
    `6개 핵심 지표 가중평균 (비즈니스모델 25%, 시장위치 20%, 운영효율 20%, 성장잠재력 15%, 디지털준비도 10%, 재무건전성 10%)`,
    `기업규모별 보정계수 적용 (${data.employeeCount}명 기준)`,
    `성장단계별 평가기준 반영 (${data.growthStage} 단계)`,
    `업계 평균 대비 상대적 위치 평가`,
    `응답 품질 및 데이터 완성도 검증 (신뢰도 ${reliabilityScore}%)`
  ];

  return {
    metrics,
    totalScore,
    reliabilityScore,
    evaluationBasis
  };
}

// 📊 정교한 간소화된 진단 분석 함수 (신뢰도 향상)
function generateSimplifiedDiagnosis(data: SimplifiedDiagnosisRequest) {
  // 업종별 기본 데이터 가져오기
  const industryData = enhancedIndustryAnalysis[data.industry as keyof typeof enhancedIndustryAnalysis] || enhancedIndustryAnalysis['other'];
  
  // 🎯 새로운 정교한 점수 계산 시스템 사용
  const scoreResult = calculateDetailedScore(data);
  const finalScore = scoreResult.totalScore;

  // 고민사항 기반 서비스 추천
  const concerns = data.mainConcerns.toLowerCase();
  let recommendedServices = [...industryData.primaryServices];
  
  if (concerns.includes('매출') || concerns.includes('수익')) {
    recommendedServices.unshift('business-analysis');
  }
  if (concerns.includes('생산성') || concerns.includes('효율')) {
    recommendedServices.unshift('ai-productivity');
  }
  if (concerns.includes('웹사이트') || concerns.includes('온라인')) {
    recommendedServices.push('website');
  }
  if (concerns.includes('인증') || concerns.includes('iso')) {
    recommendedServices.push('certification');
  }

  // 중복 제거 및 상위 3개 선택
  recommendedServices = [...new Set(recommendedServices)].slice(0, 3);

  // 📊 정교한 신뢰도 평가 기준 (벤치마크 기반)
  let marketPosition = '보통';
  const benchmarks = industryData.benchmarks;
  
  if (finalScore >= benchmarks.excellent) {
    marketPosition = '업계 최상위 (상위 10%)';
  } else if (finalScore >= benchmarks.good) {
    marketPosition = '업계 상위권 (상위 25%)';
  } else if (finalScore >= benchmarks.average) {
    marketPosition = '업계 평균 수준';
  } else if (finalScore >= benchmarks.needsImprovement) {
    marketPosition = '개선 권장 영역';
  } else {
    marketPosition = '즉시 개선 필요';
  }

  const reliabilityScore = `${scoreResult.reliabilityScore}%`;

  // 현안상황예측 생성 (업종, 고민사항, 예상혜택 종합 분석)
  function generateCurrentSituationForecast(data: SimplifiedDiagnosisRequest, industryData: any): string {
    const concerns = data.mainConcerns.toLowerCase();
    const benefits = data.expectedBenefits.toLowerCase();
    const industry = data.industry;
    const employeeCount = data.employeeCount;
    const growthStage = data.growthStage;
    
    let forecast = '';
    
    // 업종별 기본 현안 분석
    const industryForecastMap: { [key: string]: string } = {
      'manufacturing': '제조업계는 스마트팩토리 전환과 ESG 경영이 핵심 이슈로 대두되고 있습니다. ',
      'it': 'IT업계는 생성형 AI와 클라우드 기술의 급속한 발전으로 기술 격차가 확대되고 있습니다. ',
      'service': '서비스업계는 디지털 전환과 고객 경험 개선이 생존의 핵심 요소가 되고 있습니다. ',
      'retail': '유통/소매업계는 온라인-오프라인 융합과 라이브커머스 등 새로운 판매 채널이 급성장하고 있습니다. ',
      'construction': '건설업계는 스마트 건설기술과 친환경 건축 수요 증가로 기술 혁신이 필수가 되고 있습니다. ',
      'food': '식품/외식업계는 푸드테크와 배달 서비스 최적화가 경쟁력의 핵심이 되고 있습니다. ',
      'healthcare': '의료/헬스케어업계는 디지털 헬스와 AI 진단 기술 도입이 가속화되고 있습니다. ',
      'education': '교육업계는 에듀테크와 개인 맞춤형 학습 시스템이 표준이 되어가고 있습니다. ',
      'finance': '금융업계는 핀테크와 디지털뱅킹으로 인한 금융 서비스 패러다임 변화가 진행되고 있습니다. ',
      'other': '전반적으로 모든 업계에서 디지털 혁신과 고객 중심의 서비스 개선이 필수가 되고 있습니다. '
    };
    
    forecast += industryForecastMap[industry] || industryForecastMap['other'];
    
    // 고민사항 기반 현안 분석
    if (concerns.includes('매출') || concerns.includes('수익') || concerns.includes('성장')) {
      forecast += '특히 매출 증대와 수익성 개선이 시급한 과제로 보이며, ';
      if (benefits.includes('증대') || benefits.includes('향상')) {
        forecast += '체계적인 비즈니스 모델 분석을 통한 수익 구조 개선이 필요한 시점입니다. ';
      }
    }
    
    if (concerns.includes('효율') || concerns.includes('생산성') || concerns.includes('자동화')) {
      forecast += '업무 효율성과 생산성 개선이 경쟁력 확보의 핵심 요소로 작용하고 있으며, ';
      if (benefits.includes('효율') || benefits.includes('자동화')) {
        forecast += 'AI 도구 활용을 통한 업무 프로세스 혁신이 시급한 상황입니다. ';
      }
    }
    
    if (concerns.includes('디지털') || concerns.includes('온라인') || concerns.includes('ai')) {
      forecast += '디지털 전환과 AI 기술 도입이 더 이상 선택이 아닌 필수가 된 상황에서, ';
      if (benefits.includes('디지털') || benefits.includes('온라인')) {
        forecast += '적극적인 디지털화 추진이 기업 생존의 열쇠가 될 것으로 예상됩니다. ';
      }
    }
    
    if (concerns.includes('인력') || concerns.includes('채용') || concerns.includes('관리')) {
      forecast += '인력 관리와 조직 운영의 효율화가 중요한 과제로 대두되고 있으며, ';
    }
    
    if (concerns.includes('비용') || concerns.includes('절감') || concerns.includes('원가')) {
      forecast += '비용 최적화와 원가 절감을 통한 경쟁력 확보가 필수적인 상황입니다. ';
    }
    
    // 기업 규모별 예측
    if (employeeCount === '1-5' || employeeCount === '6-10') {
      forecast += '소규모 기업으로서 선택과 집중을 통한 핵심 역량 강화가 중요하며, ';
    } else if (employeeCount === '11-30' || employeeCount === '31-50') {
      forecast += '중소기업으로서 조직 체계화와 시스템화가 성장의 발판이 될 것입니다. ';
    } else {
      forecast += '중견기업으로서 규모의 경제를 활용한 효율성 극대화가 관건입니다. ';
    }
    
    // 성장단계별 예측
    if (growthStage === 'startup' || growthStage === 'early') {
      forecast += '초기 단계 기업으로서 시장 검증과 비즈니스 모델 안정화가 우선 과제이며, ';
    } else if (growthStage === 'growth') {
      forecast += '성장기 기업으로서 확장 전략과 운영 효율화의 균형이 중요한 시점입니다. ';
    } else if (growthStage === 'mature') {
      forecast += '성숙기 기업으로서 혁신을 통한 재도약과 새로운 성장 동력 확보가 필요합니다. ';
    } else if (growthStage === 'expansion') {
      forecast += '확장기 기업으로서 지속가능한 성장을 위한 체계적인 관리 시스템 구축이 핵심입니다. ';
    }
    
    // 예상혜택 기반 결론
    if (benefits.includes('증대') || benefits.includes('성장')) {
      forecast += '현재 시점에서 적절한 전략적 접근을 통해 기대하는 성장 목표 달성이 충분히 가능할 것으로 판단됩니다.';
    } else if (benefits.includes('효율') || benefits.includes('개선')) {
      forecast += '체계적인 개선 방안 도입을 통해 목표하는 효율성 향상을 실현할 수 있을 것으로 예상됩니다.';
    } else if (benefits.includes('절감') || benefits.includes('최적화')) {
      forecast += '전문적인 분석과 최적화 방안을 통해 비용 절감 목표를 달성할 수 있을 것으로 보입니다.';
    } else {
      forecast += '현재 상황을 종합 분석할 때, 적절한 컨설팅을 통해 기업이 원하는 목표를 충분히 달성할 수 있을 것으로 판단됩니다.';
    }
    
    return forecast;
  }

  const currentSituationForecast = generateCurrentSituationForecast(data, industryData);

  return {
    // 기본 진단 정보
    companyName: data.companyName,
    industry: data.industry,
    employeeCount: data.employeeCount,
    growthStage: data.growthStage,
    totalScore: finalScore,
    marketPosition: marketPosition,
    reliabilityScore: reliabilityScore,
    scoreDescription: `${data.companyName}은(는) ${industryData.marketGrowth} 성장률을 보이는 ${data.industry} 업계에서 ${marketPosition}의 경쟁력을 보유하고 있습니다.`,
    
    // 📊 세부 지표 (신뢰도 향상)
    detailedMetrics: scoreResult.metrics,
    evaluationBasis: scoreResult.evaluationBasis,
    industryBenchmarks: industryData.benchmarks,
    
    // 업계 분석 (확장)
    industryGrowth: industryData.marketGrowth,
    industryGrowthRate: industryData.marketGrowth,
    marketSize: industryData.marketSize,
    competitionLevel: industryData.competitionLevel,
    digitalMaturity: industryData.digitalMaturity,
    keyTrends: industryData.keyTrends,
    industryChallenges: industryData.challenges,
    
    // SWOT 간소화 분석 (프리미엄 보고서 호환)
    strengths: [
      `${data.industry} 업계에서의 전문성과 경험`,
      `${data.employeeCount} 규모에 최적화된 조직 운영`,
      '시장 니즈에 대한 이해도',
      '기업 성장 의지와 개선 의욕'
    ],
    weaknesses: [
      '디지털 전환 및 AI 활용 역량 강화 필요',
      '온라인 마케팅 체계 개선 요구',
      '업무 프로세스 자동화 및 최적화',
      '데이터 기반 의사결정 체계 구축'
    ],
    opportunities: [
      ...industryData.opportunities,
      '정부 지원사업 및 정책자금 활용',
      'M-CENTER 전문 서비스를 통한 경쟁력 강화',
      '업계 디지털 전환 트렌드 적극 활용'
    ],
    threats: [
      '업계 내 경쟁 심화 및 시장 포화',
      '급속한 기술 변화에 대한 대응 부담',
      '우수 인력 확보의 어려움',
      '외부 경제 환경 변화 리스크'
    ],
    
    // 현안상황예측 (개선된 부분)
    currentSituationForecast: currentSituationForecast,
    
    // 맞춤 서비스 추천
    recommendedServices: recommendedServices.map(serviceId => ({
      id: serviceId,
      ...mCenterServices[serviceId as keyof typeof mCenterServices]
    })),
    
    // 액션 플랜
    actionPlan: [
      '7일 내: 무료 상담 예약 및 현황 점검',
      `30일 내: ${mCenterServices[recommendedServices[0] as keyof typeof mCenterServices].name} 착수`,
      '90일 내: 첫 번째 성과 측정 및 전략 조정'
    ],
    
    // 예상 성과
    expectedResults: {
      revenue: '매출 25-40% 증대',
      efficiency: '업무 효율성 30-50% 향상',
      timeline: '3-6개월 내 가시적 성과',
      quantitative: ['매출 증대 25-40%', '비용 절감 15-25%', '업무 효율성 30-50% 향상'],
      qualitative: ['시장 경쟁력 강화', '조직 역량 개선', '지속가능한 성장 기반 구축']
    },
    
    // 기타 정보
    consultant: {
      name: CONSULTANT_INFO.name,
      phone: CONTACT_INFO.mainPhone,
      email: CONTACT_INFO.mainEmail
    },
    generatedAt: new Date().toISOString(),
    resultId: `DIAG_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`.toUpperCase()
  };
}

// 2000자 요약 보고서 생성
function generateSummaryReport(diagnosisData: any): string {
  const report = `
# ${diagnosisData.companyName} AI 진단 보고서 (요약본)

## 📊 종합 평가
**진단 점수**: ${diagnosisData.totalScore}점 / 100점
**시장 위치**: ${diagnosisData.marketPosition}
**업계 성장률**: ${diagnosisData.industryGrowth}

## 🎯 핵심 분석

### 💪 주요 강점
${diagnosisData.strengths.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

### 🔧 개선 영역
${diagnosisData.weaknesses.map((w: string, i: number) => `${i + 1}. ${w}`).join('\n')}

### 🌟 성장 기회
${diagnosisData.opportunities.map((o: string, i: number) => `${i + 1}. ${o}`).join('\n')}

## 🚀 맞춤 서비스 추천

${diagnosisData.recommendedServices.map((service: any, i: number) => `
### ${i + 1}. ${service.name}
- **목적**: ${service.description}
- **예상 효과**: ${service.expectedEffect}
- **소요 기간**: ${service.duration}
- **성공률**: ${service.successRate}
`).join('')}

## 📅 실행 계획
${diagnosisData.actionPlan.map((plan: string, i: number) => `${i + 1}. ${plan}`).join('\n')}

## 📈 예상 성과
- **매출 성장**: ${diagnosisData.expectedResults.revenue}
- **효율성 향상**: ${diagnosisData.expectedResults.efficiency}
- **성과 시점**: ${diagnosisData.expectedResults.timeline}

## 🤝 전문가 상담
**담당 컨설턴트**: ${diagnosisData.consultant.name}
**연락처**: ${diagnosisData.consultant.phone}
**이메일**: ${diagnosisData.consultant.email}

---
*본 보고서는 AI 기반 분석을 통해 생성되었으며, 더 정확한 진단을 위해서는 전문가 상담을 권장합니다.*
`;

  return report.trim();
}

export async function POST(request: NextRequest) {
  const startTime = Date.now(); // 프리미엄 보고서용 처리 시간 측정
  
  try {
    console.log('🔄 간소화된 AI 진단 API 시작');
    
    const data: SimplifiedDiagnosisRequest = await request.json();
    
    // 입력 데이터 검증
    if (!data.companyName || !data.industry || !data.contactManager || !data.email) {
      return NextResponse.json({
        success: false,
        error: '필수 정보가 누락되었습니다.'
      }, { status: 400 });
    }

    // 개인정보 동의 확인
    if (!data.privacyConsent) {
      return NextResponse.json({
        success: false,
        error: '개인정보 수집 및 이용 동의가 필요합니다.'
      }, { status: 400 });
    }

    // 1단계: AI 진단 수행
    console.log('📊 간소화된 진단 분석 수행 중...');
    const diagnosisResult = generateSimplifiedDiagnosis(data);
    
    // 2단계: 2000자 요약 보고서 생성
    console.log('📋 2000자 요약 보고서 생성 중...');
    const summaryReport = generateSummaryReport(diagnosisResult);
    
    // 3단계: Google Sheets 저장 및 이메일 발송 (실패해도 진단 결과는 반환)
    let googleSheetsSaved = false;
    let emailSent = false;
    let warnings: string[] = [];
    
    try {
      console.log('💾 Google Sheets 저장 및 이메일 발송 시도...');
      
      // emailService에서 사용하는 DiagnosisFormData 형식으로 변환
      const diagnosisFormData: DiagnosisFormData = {
        submitDate: data.submitDate,
        companyName: data.companyName,
        industry: data.industry,
        businessStage: data.growthStage,
        employeeCount: data.employeeCount,
        establishedYear: '정보 없음', // 간소화 버전에서는 수집하지 않음
        mainConcerns: data.mainConcerns,
        expectedBudget: data.expectedBenefits, // expectedBenefits를 예산란으로 매핑
        urgency: '보통', // 기본값
        contactName: data.contactManager,
        contactPhone: '정보 없음', // 간소화 버전에서는 수집하지 않음
        contactEmail: data.email,
        privacyConsent: data.privacyConsent
      };
      
      // 통합 진단 신청 처리 (Google Sheets 저장 + 이메일 발송)
      const processResult = await processDiagnosisSubmission(diagnosisFormData);
      
      googleSheetsSaved = processResult.sheetSaved;
      emailSent = processResult.autoReplySent;
      warnings = processResult.warnings || [];
      
      if (googleSheetsSaved) {
        console.log('✅ Google Sheets 저장 성공');
      } else {
        console.warn('⚠️ Google Sheets 저장 실패:', processResult.errors);
        warnings.push('구글시트 저장에 실패했지만 진단 결과는 정상적으로 생성되었습니다.');
      }
      
      if (emailSent) {
        console.log('📧 신청 확인 이메일 발송 성공');
      } else {
        console.warn('⚠️ 이메일 발송 실패:', processResult.errors);
        warnings.push('이메일 발송에 실패했지만 진단 결과는 정상적으로 생성되었습니다.');
      }

    } catch (dataProcessingError) {
      console.warn('⚠️ 데이터 처리 중 오류 (진단 결과는 정상):', dataProcessingError);
      warnings.push('일부 기능(구글시트/이메일)에서 오류가 발생했지만 진단 결과는 정상적으로 생성되었습니다.');
    }

    // 4단계: 진단 결과 생성 및 반환 (항상 성공)
    const processingTimeMs = Date.now() - startTime;
    const processingTimeSeconds = (processingTimeMs / 1000).toFixed(1);
    
    console.log(`📊 간소화된 AI 진단 완료 (${processingTimeSeconds}초)`);

    return NextResponse.json({
      success: true,
      message: '간소화된 AI 진단이 완료되었습니다.',
      data: {
        diagnosis: diagnosisResult,
        summaryReport: summaryReport,
        reportLength: summaryReport.length,
        resultId: diagnosisResult.resultId,
        resultUrl: `/diagnosis/results/${diagnosisResult.resultId}`,
        submitDate: new Date().toLocaleDateString('ko-KR', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        googleSheetsSaved,
        processingTime: `${processingTimeSeconds}초`,
        reportType: '🎨 프리미엄 AI 진단 보고서',
        warnings: warnings.length > 0 ? warnings : undefined
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 간소화된 AI 진단 API 오류:', error);

    return NextResponse.json({
      success: false,
      error: '간소화된 AI 진단 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 