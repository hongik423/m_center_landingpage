// Vercel 최적화 설정
export const dynamic = 'force-dynamic';
export const revalidate = false;
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveToGoogleSheets } from '@/lib/utils/googleSheetsService';
import { processDiagnosisSubmission, type DiagnosisFormData } from '@/lib/utils/emailService';
import { CONSULTANT_INFO, CONTACT_INFO, COMPANY_INFO } from '@/lib/config/branding';
import { getGeminiKey, isDevelopment, maskApiKey } from '@/lib/config/env';
import { EnhancedDiagnosisEngine, DiagnosisReportGenerator, validateDiagnosisData } from '@/lib/utils/enhancedDiagnosisEngine';

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
  
  // 🔥 **5점 척도 평가표 문항별 점수 (20개 항목) - REQUIRED**
  planning_level?: number;         // 기획수준 (1-5점)
  differentiation_level?: number;  // 차별화정도 (1-5점)
  pricing_level?: number;          // 가격설정 (1-5점)
  expertise_level?: number;        // 전문성 (1-5점)
  quality_level?: number;          // 품질 (1-5점)
  customer_greeting?: number;      // 고객맞이 (1-5점)
  customer_service?: number;       // 고객응대 (1-5점)
  complaint_management?: number;   // 불만관리 (1-5점)
  customer_retention?: number;     // 고객유지 (1-5점)
  customer_understanding?: number; // 고객이해 (1-5점)
  marketing_planning?: number;     // 마케팅계획 (1-5점)
  offline_marketing?: number;      // 오프라인마케팅 (1-5점)
  online_marketing?: number;       // 온라인마케팅 (1-5점)
  sales_strategy?: number;         // 판매전략 (1-5점)
  purchase_management?: number;    // 구매관리 (1-5점)
  inventory_management?: number;   // 재고관리 (1-5점)
  exterior_management?: number;    // 외관관리 (1-5점)
  interior_management?: number;    // 인테리어관리 (1-5점)
  cleanliness?: number;            // 청결도 (1-5점)
  work_flow?: number;              // 작업동선 (1-5점)
  
  // 진단 결과 정보 (프론트엔드에서 전송)
  diagnosisResults?: {
    totalScore: number;
    categoryScores: any;
    recommendedServices: any[];
    strengths: any[];
    weaknesses: any[];
    reportType: string;
  };
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

// 📊 업종 카테고리 매핑 (새로운 세분화된 업종을 기존 카테고리로 그룹화)
const industryMapping: Record<string, string> = {
  // 제조업 그룹
  'electronics-manufacturing': 'manufacturing',
  'automotive-manufacturing': 'manufacturing',
  'machinery-manufacturing': 'manufacturing',
  'chemical-manufacturing': 'manufacturing',
  'food-manufacturing': 'food',
  'textile-manufacturing': 'manufacturing',
  'steel-manufacturing': 'manufacturing',
  'medical-manufacturing': 'healthcare',
  'other-manufacturing': 'manufacturing',
  
  // IT/소프트웨어 그룹
  'software-development': 'it',
  'web-mobile-development': 'it',
  'system-integration': 'it',
  'game-development': 'it',
  'ai-bigdata': 'it',
  'cloud-infrastructure': 'it',
  'cybersecurity': 'it',
  'fintech': 'finance',
  
  // 전문서비스업 그룹
  'business-consulting': 'service',
  'accounting-tax': 'service',
  'legal-service': 'service',
  'marketing-advertising': 'service',
  'design-creative': 'service',
  'hr-consulting': 'service',
  
  // 유통/도소매 그룹
  'ecommerce': 'retail',
  'offline-retail': 'retail',
  'wholesale': 'retail',
  'franchise': 'retail',
  
  // 건설/부동산 그룹
  'architecture': 'construction',
  'real-estate': 'service',
  'interior-design': 'service',
  
  // 운송/물류 그룹
  'logistics': 'service',
  'transportation': 'service',
  'warehouse': 'service',
  
  // 식음료/외식 그룹
  'restaurant': 'food',
  'cafe': 'food',
  'food-service': 'food',
  
  // 의료/헬스케어 그룹
  'hospital-clinic': 'healthcare',
  'pharmacy': 'healthcare',
  'beauty-wellness': 'healthcare',
  'fitness': 'healthcare',
  
  // 교육 그룹
  'education-school': 'education',
  'private-academy': 'education',
  'online-education': 'education',
  'language-education': 'education',
  
  // 금융/보험 그룹
  'banking': 'finance',
  'insurance': 'finance',
  'investment': 'finance',
  
  // 문화/엔터테인먼트 그룹
  'entertainment': 'service',
  'tourism-travel': 'service',
  'sports': 'service',
  
  // 기타 서비스 그룹
  'cleaning-facility': 'service',
  'rental-lease': 'service',
  'repair-maintenance': 'service',
  'agriculture': 'other',
  'energy': 'other',
  
  // 기존 업종 (하위 호환성)
  'manufacturing': 'manufacturing',
  'it': 'it',
  'service': 'service',
  'retail': 'retail',
  'construction': 'construction',
  'food': 'food',
  'healthcare': 'healthcare',
  'education': 'education',
  'finance': 'finance',
  'other': 'other'
};

// 📊 세부 업종별 특화 정보 (추가 보너스 및 특성)
const detailedIndustryInfo: Record<string, {
  displayName: string;
  specialization: string[];
  keyMetrics: { focus: string; multiplier: number }[];
  trends: string[];
}> = {
  // 제조업 세분화
  'electronics-manufacturing': {
    displayName: '전자제품/반도체 제조업',
    specialization: ['고정밀 생산', '품질관리', '기술혁신'],
    keyMetrics: [{ focus: 'digitalReadiness', multiplier: 1.2 }, { focus: 'businessModel', multiplier: 1.1 }],
    trends: ['반도체 국산화', '스마트팩토리', 'ESG 경영']
  },
  'automotive-manufacturing': {
    displayName: '자동차/부품 제조업',
    specialization: ['자동화 생산', '공급망 관리', '품질 인증'],
    keyMetrics: [{ focus: 'operationalEfficiency', multiplier: 1.2 }, { focus: 'marketPosition', multiplier: 1.1 }],
    trends: ['전기차 전환', '자율주행', '친환경 부품']
  },
  'software-development': {
    displayName: '소프트웨어 개발',
    specialization: ['개발 역량', '기술 스택', '프로젝트 관리'],
    keyMetrics: [{ focus: 'digitalReadiness', multiplier: 1.3 }, { focus: 'growthPotential', multiplier: 1.2 }],
    trends: ['클라우드 네이티브', 'DevOps', 'AI 통합']
  },
  'ecommerce': {
    displayName: '온라인 쇼핑몰/이커머스',
    specialization: ['디지털 마케팅', '고객 데이터 분석', '물류 최적화'],
    keyMetrics: [{ focus: 'digitalReadiness', multiplier: 1.3 }, { focus: 'marketPosition', multiplier: 1.1 }],
    trends: ['라이브커머스', '개인화 추천', '옴니채널']
  },
  'restaurant': {
    displayName: '음식점/외식업',
    specialization: ['고객 서비스', '품질 관리', '비용 최적화'],
    keyMetrics: [{ focus: 'operationalEfficiency', multiplier: 1.2 }, { focus: 'marketPosition', multiplier: 1.1 }],
    trends: ['배달 플랫폼', '무인 서비스', '푸드테크']
  }
  // 필요시 더 추가 가능
};

// 업종별 세분화된 분석 데이터 (기존 확장)
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

// 📊 정교한 점수 계산 함수 (업종 매핑 활용)
function calculateDetailedScore(data: SimplifiedDiagnosisRequest): {
  metrics: DetailedScoreMetrics;
  totalScore: number;
  reliabilityScore: number;
  evaluationBasis: string[];
} {
  // 🔧 업종 매핑을 통해 기본 카테고리 결정
  const mappedIndustry = industryMapping[data.industry] || 'other';
  const industryData = enhancedIndustryAnalysis[mappedIndustry as keyof typeof enhancedIndustryAnalysis] || enhancedIndustryAnalysis['other'];
  
  // 🔧 세부 업종 정보 가져오기
  const detailedInfo = detailedIndustryInfo[data.industry];
  const industryDisplayName = detailedInfo?.displayName || data.industry;
  
  console.log(`📊 진단 대상: ${industryDisplayName} (매핑: ${data.industry} → ${mappedIndustry})`);
  
  // 1. 비즈니스 모델 적합성 (25%)
  let businessModelScore = industryData.keyMetrics.averageROI * 4; // 기본 점수
  
  // 업종별 가산점
  if (mappedIndustry === 'it' || data.industry.includes('development') || data.industry.includes('ai')) {
    businessModelScore += 8;
  }
  if (mappedIndustry === 'manufacturing') businessModelScore += 5;
  if (data.industry === 'ecommerce') businessModelScore += 6;
  
  // 세부 업종별 특화 보너스 적용
  if (detailedInfo) {
    const businessMetric = detailedInfo.keyMetrics.find(m => m.focus === 'businessModel');
    if (businessMetric) {
      businessModelScore *= businessMetric.multiplier;
    }
  }
  
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
  
  // 특정 업종별 시장 위치 보너스
  if (data.industry === 'ai-bigdata' || data.industry === 'cybersecurity') marketPositionScore += 10;
  if (data.industry === 'ecommerce' || data.industry === 'fintech') marketPositionScore += 8;
  
  // 세부 업종별 특화 보너스 적용
  if (detailedInfo) {
    const marketMetric = detailedInfo.keyMetrics.find(m => m.focus === 'marketPosition');
    if (marketMetric) {
      marketPositionScore *= marketMetric.multiplier;
    }
  }
  
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
  
  // 특정 업종별 운영 효율성 보너스
  if (data.industry === 'software-development' || data.industry === 'cloud-infrastructure') {
    operationalScore += 8;
  }
  if (data.industry.includes('manufacturing')) operationalScore += 5;
  
  // 세부 업종별 특화 보너스 적용
  if (detailedInfo) {
    const operationalMetric = detailedInfo.keyMetrics.find(m => m.focus === 'operationalEfficiency');
    if (operationalMetric) {
      operationalScore *= operationalMetric.multiplier;
    }
  }
  
  // 효율성 관련 고민사항 반영
  if (concerns.includes('효율') || concerns.includes('생산성')) operationalScore += 6;
  if (concerns.includes('자동화') || concerns.includes('시스템')) operationalScore += 4;
  
  operationalScore = Math.min(95, Math.max(40, operationalScore));

  // 4. 성장 잠재력 (15%)
  let growthPotentialScore = industryData.keyMetrics.growthRate * 5;
  
  // 신기술 업종 보너스
  if (data.industry === 'ai-bigdata' || data.industry === 'fintech' || 
      data.industry === 'game-development' || data.industry === 'cybersecurity') {
    growthPotentialScore += 12;
  }
  
  // 세부 업종별 특화 보너스 적용
  if (detailedInfo) {
    const growthMetric = detailedInfo.keyMetrics.find(m => m.focus === 'growthPotential');
    if (growthMetric) {
      growthPotentialScore *= growthMetric.multiplier;
    }
  }
  
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
  
  // IT/디지털 업종 특별 보너스
  if (mappedIndustry === 'it' || data.industry.includes('digital') || 
      data.industry === 'ecommerce' || data.industry === 'fintech') {
    digitalScore += 15;
  }
  
  // 세부 업종별 특화 보너스 적용
  if (detailedInfo) {
    const digitalMetric = detailedInfo.keyMetrics.find(m => m.focus === 'digitalReadiness');
    if (digitalMetric) {
      digitalScore *= digitalMetric.multiplier;
    }
  }
  
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
  
  // 고수익 업종 보너스
  if (data.industry === 'fintech' || data.industry === 'ai-bigdata' || 
      data.industry === 'investment' || data.industry === 'cybersecurity') {
    financialScore += 8;
  }
  
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
  
  // 세부 업종 선택 시 신뢰도 보너스
  if (detailedInfo) reliabilityScore += 5;
  
  // 업종 데이터 신뢰도
  if (industryData.marketSize !== '150조원') reliabilityScore += 5; // 구체적 데이터 있음
  
  reliabilityScore = Math.min(95, reliabilityScore);

  // 평가 근거 명시 (세부 업종 정보 포함)
  const evaluationBasis = [
    `업종별 벤치마크 기준 (${industryDisplayName}: 우수 ${industryData.benchmarks.excellent}점)`,
    `6개 핵심 지표 가중평균 (비즈니스모델 25%, 시장위치 20%, 운영효율 20%, 성장잠재력 15%, 디지털준비도 10%, 재무건전성 10%)`,
    `기업규모별 보정계수 적용 (${data.employeeCount}명 기준)`,
    `성장단계별 평가기준 반영 (${data.growthStage} 단계)`,
    `세부 업종별 특화 분석 적용 (${data.industry} 특성 반영)`,
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

// 📊 정교한 간소화된 진단 분석 함수 (업종 매핑 활용)
function generateSimplifiedDiagnosis(data: SimplifiedDiagnosisRequest) {
  // 🔧 업종 매핑을 통해 기본 카테고리 결정
  const mappedIndustry = industryMapping[data.industry] || 'other';
  const industryData = enhancedIndustryAnalysis[mappedIndustry as keyof typeof enhancedIndustryAnalysis] || enhancedIndustryAnalysis['other'];
  
  // 🔧 세부 업종 정보 가져오기
  const detailedInfo = detailedIndustryInfo[data.industry];
  const industryDisplayName = detailedInfo?.displayName || data.industry;
  
  // 🎯 새로운 정교한 점수 계산 시스템 사용
  const scoreResult = calculateDetailedScore(data);
  const finalScore = scoreResult.totalScore;

  // 고민사항 기반 서비스 추천 (세부 업종별 최적화)
  const concerns = data.mainConcerns.toLowerCase();
  let recommendedServices = [...industryData.primaryServices];
  
  // 🔧 세부 업종별 맞춤 서비스 추가
  if (data.industry === 'ecommerce' || data.industry === 'offline-retail') {
    recommendedServices.unshift('website');
  }
  if (data.industry.includes('manufacturing') || data.industry === 'logistics') {
    recommendedServices.unshift('factory-auction');
  }
  if (data.industry.includes('development') || data.industry === 'ai-bigdata') {
    recommendedServices.unshift('ai-productivity');
  }
  if (data.industry === 'fintech' || data.industry === 'banking') {
    recommendedServices.push('certification');
  }
  if (data.industry === 'restaurant' || data.industry === 'cafe') {
    recommendedServices.push('website');
  }
  
  // 기존 로직 유지
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
    marketPosition = `${industryDisplayName} 업계 최상위 (상위 10%)`;
  } else if (finalScore >= benchmarks.good) {
    marketPosition = `${industryDisplayName} 업계 상위권 (상위 25%)`;
  } else if (finalScore >= benchmarks.average) {
    marketPosition = `${industryDisplayName} 업계 평균 수준`;
  } else if (finalScore >= benchmarks.needsImprovement) {
    marketPosition = '개선 권장 영역';
  } else {
    marketPosition = '즉시 개선 필요';
  }

  const reliabilityScore = `${scoreResult.reliabilityScore}%`;

  // 현안상황예측 생성 (세부 업종별 맞춤화)
  function generateCurrentSituationForecast(data: SimplifiedDiagnosisRequest, industryData: any, detailedInfo: any): string {
    const concerns = data.mainConcerns.toLowerCase();
    const benefits = data.expectedBenefits.toLowerCase();
    const industry = data.industry;
    const employeeCount = data.employeeCount;
    const growthStage = data.growthStage;
    
    let forecast = '';
    
    // 🔧 세부 업종별 맞춤 현안 분석
    if (detailedInfo) {
      forecast += `${detailedInfo.displayName}은(는) `;
      
      // 세부 업종별 트렌드 반영
      if (detailedInfo.trends.length > 0) {
        forecast += `${detailedInfo.trends.slice(0, 2).join(', ')} 등의 핵심 트렌드가 급속히 발전하고 있는 분야입니다. `;
      }
      
      // 전문 분야 강조
      if (detailedInfo.specialization.length > 0) {
        forecast += `특히 ${detailedInfo.specialization.join(', ')} 역량이 경쟁력의 핵심 요소로 작용하고 있습니다. `;
      }
    } else {
      // 기본 업종별 현안 분석 (기존 로직 유지)
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
      
      const mappedIndustry = industryMapping[industry] || 'other';
      forecast += industryForecastMap[mappedIndustry] || industryForecastMap['other'];
    }
    
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
    
    // 기업 규모별 예측
    if (employeeCount === '1-5' || employeeCount === '6-10') {
      forecast += '소규모 기업으로서 선택과 집중을 통한 핵심 역량 강화가 중요하며, ';
    } else if (employeeCount === '11-30' || employeeCount === '31-50') {
      forecast += '중소기업으로서 조직 체계화와 시스템화가 성장의 발판이 될 것입니다. ';
    } else {
      forecast += '중견기업으로서 규모의 경제를 활용한 효율성 극대화가 관건입니다. ';
    }
    
    // 예상혜택 기반 결론
    if (benefits.includes('증대') || benefits.includes('성장')) {
      forecast += '현재 시점에서 적절한 전략적 접근을 통해 기대하는 성장 목표 달성이 충분히 가능할 것으로 판단됩니다.';
    } else if (benefits.includes('효율') || benefits.includes('개선')) {
      forecast += '체계적인 개선 방안 도입을 통해 목표하는 효율성 향상을 실현할 수 있을 것으로 예상됩니다.';
    } else {
      forecast += '현재 상황을 종합 분석할 때, 적절한 컨설팅을 통해 기업이 원하는 목표를 충분히 달성할 수 있을 것으로 판단됩니다.';
    }
    
    return forecast;
  }

  const currentSituationForecast = generateCurrentSituationForecast(data, industryData, detailedInfo);

  return {
    // 기본 진단 정보 (세부 업종 정보 포함)
    companyName: data.companyName,
    industry: industryDisplayName, // 세부 업종명 표시
    originalIndustryCode: data.industry, // 원본 업종 코드
    mappedCategory: mappedIndustry, // 매핑된 카테고리
    employeeCount: data.employeeCount,
    growthStage: data.growthStage,
    totalScore: finalScore,
    marketPosition: marketPosition,
    reliabilityScore: reliabilityScore,
    scoreDescription: `${data.companyName}은(는) ${industryData.marketGrowth} 성장률을 보이는 ${industryDisplayName} 분야에서 ${marketPosition}의 경쟁력을 보유하고 있습니다.`,
    
    // 📊 세부 지표 (업종별 특화 정보 포함)
    detailedMetrics: scoreResult.metrics,
    evaluationBasis: scoreResult.evaluationBasis,
    industryBenchmarks: industryData.benchmarks,
    specialization: detailedInfo?.specialization || [],
    industryTrends: detailedInfo?.trends || industryData.keyTrends,
    
    // 업계 분석 (확장)
    industryGrowth: industryData.marketGrowth,
    industryGrowthRate: industryData.marketGrowth,
    marketSize: industryData.marketSize,
    competitionLevel: industryData.competitionLevel,
    digitalMaturity: industryData.digitalMaturity,
    keyTrends: detailedInfo?.trends || industryData.keyTrends,
    industryChallenges: industryData.challenges,
    
    // SWOT 간소화 분석 (업종별 맞춤화)
    strengths: [
      `${industryDisplayName} 분야에서의 전문성과 경험`,
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
      `${industryDisplayName} 특화 트렌드 적극 활용`
    ],
    threats: [
      '업계 내 경쟁 심화 및 시장 포화',
      '급속한 기술 변화에 대한 대응 부담',
      '우수 인력 확보의 어려움',
      '외부 경제 환경 변화 리스크'
    ],
    
    // 현안상황예측 (세부 업종별 맞춤화)
    currentSituationForecast: currentSituationForecast,
    
    // 맞춤 서비스 추천 (세부 업종별 최적화)
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
      email: CONTACT_INFO.email
    },
    generatedAt: new Date().toISOString(),
    resultId: `DIAG_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`.toUpperCase()
  };
}

// 🔧 **1. 역량테스트 상세 분석 함수**
function analyzeDetailedCapabilities(data: SimplifiedDiagnosisRequest, diagnosisData: any) {
  const capabilities = [
    { name: '리더십 역량', score: diagnosisData.capabilities?.leadership || Math.floor(diagnosisData.totalScore * 0.9) },
    { name: '전략 기획', score: diagnosisData.capabilities?.strategy || Math.floor(diagnosisData.totalScore * 0.85) },
    { name: '마케팅 역량', score: diagnosisData.capabilities?.marketing || Math.floor(diagnosisData.totalScore * 0.8) },
    { name: '재무 관리', score: diagnosisData.capabilities?.finance || Math.floor(diagnosisData.totalScore * 0.88) },
    { name: '인사 관리', score: diagnosisData.capabilities?.hr || Math.floor(diagnosisData.totalScore * 0.82) }
  ];

  const detailedAnalysis = capabilities.map((cap, i) => 
    `**${cap.name}**: ${cap.score}점 - ${getCapabilityInsight(cap.name, cap.score, data.industry)}`
  ).join('\n');

  return { capabilities, detailedAnalysis };
}

// 🏭 **2. 업종별 특화 분석 함수** 
function generateIndustrySpecificInsights(industry: string, diagnosisData: any) {
  const industryInsights: { [key: string]: any } = {
    '제조업': { 
      marketCharacteristics: '스마트팩토리 전환 가속화, 공급망 최적화 중요',
      digitalMaturity: '중급 (자동화 진행 중)',
      keySuccess: '품질관리, 원가절감, 납기준수',
      challenges: '인력 부족, 환경 규제, 원자재 가격 상승'
    },
    '도소매업': { 
      marketCharacteristics: '옴니채널 필수, 고객 데이터 활용 핵심',
      digitalMaturity: '고급 (디지털 전환 필수)',
      keySuccess: '고객 만족, 재고 최적화, 매출 증대',
      challenges: '온라인 경쟁, 임대료 상승, 소비 패턴 변화'
    },
    '서비스업': { 
      marketCharacteristics: '개인화 서비스, 디지털 고객 접점 확대',
      digitalMaturity: '중급 (서비스 디지털화)',
      keySuccess: '고객 경험, 서비스 품질, 브랜드 차별화',
      challenges: '인력 확보, 서비스 표준화, 고객 이탈'
    },
    '건설업': { 
      marketCharacteristics: '스마트 건설 도입, 안전 규제 강화',
      digitalMaturity: '초급 (전통적 업무 방식)',
      keySuccess: '안전 관리, 품질 확보, 공기 단축',
      challenges: '인력 고령화, 안전사고, 자재비 상승'
    },
    '음식업': { 
      marketCharacteristics: '배달 시장 확대, 위생 관리 중요성 증가',
      digitalMaturity: '중급 (배달 플랫폼 활용)',
      keySuccess: '맛과 품질, 위생 관리, 고객 서비스',
      challenges: '임대료 부담, 식자재 가격, 인력 부족'
    },
    '기타': { 
      marketCharacteristics: '디지털 혁신 필요, 틈새 시장 공략',
      digitalMaturity: '초급-중급 (업종별 차이)',
      keySuccess: '차별화 전략, 전문성 확보, 고객 관계',
      challenges: '시장 불확실성, 경쟁 심화, 규제 변화'
    }
  };

  return industryInsights[industry] || industryInsights['기타'];
}

// 💭 **3. 고민사항 해결책 매핑 함수**
function mapConcernsToSolutions(concerns: string, diagnosisData: any) {
  const solutionMap: { [key: string]: string[] } = {
    '매출': ['마케팅 강화', '신규 고객 확보', '상품/서비스 차별화'],
    '고객': ['고객 만족도 조사', 'CRM 시스템 도입', '고객 서비스 개선'],
    '인력': ['인사 관리 시스템', '교육 훈련 강화', '조직 문화 개선'],
    '자금': ['재무 관리 체계화', '정부 지원 활용', '투자 유치 준비'],
    '운영': ['업무 프로세스 개선', '디지털화 추진', '효율성 제고'],
    '마케팅': ['브랜드 강화', '온라인 마케팅', '고객 접점 확대'],
    '기술': ['기술 혁신', 'IT 인프라 구축', '디지털 전환'],
    '경쟁': ['차별화 전략', '핵심 역량 강화', '블루오션 탐색']
  };

  let matchedSolutions: string[] = [];
  let analysis = '';

  for (const [key, solutions] of Object.entries(solutionMap)) {
    if (concerns.toLowerCase().includes(key)) {
      matchedSolutions = [...matchedSolutions, ...solutions];
      analysis += `${key} 관련 고민 발견. `;
    }
  }

  if (matchedSolutions.length === 0) {
    matchedSolutions = ['종합적 경영 진단', '맞춤형 컨설팅', '전문가 상담'];
    analysis = '복합적 경영 이슈로 분석됨';
  }

  return {
    analysis: analysis || '핵심 경영 과제 식별됨',
    solutions: [...new Set(matchedSolutions)].slice(0, 3)
  };
}

// 🎯 **4. 기대효과 전략 수립 함수**
function alignStrategyToBenefits(benefits: string, diagnosisData: any) {
  const benefitStrategies: { [key: string]: any } = {
    '매출 증대': { feasibility: '높음', approach: '마케팅 최적화 + 고객 확보 전략' },
    '효율성 향상': { feasibility: '매우 높음', approach: '프로세스 개선 + 디지털 도구 활용' },
    '비용 절감': { feasibility: '높음', approach: '운영 최적화 + 자동화 도입' },
    '품질 개선': { feasibility: '높음', approach: '품질 관리 시스템 + 교육 강화' },
    '고객 만족': { feasibility: '높음', approach: 'CRM 구축 + 서비스 개선' },
    '브랜드 강화': { feasibility: '중간', approach: '마케팅 전략 + 브랜드 아이덴티티 구축' },
    '조직 역량': { feasibility: '높음', approach: '인재 개발 + 조직 문화 혁신' },
    '시장 확대': { feasibility: '중간', approach: '시장 조사 + 진출 전략 수립' }
  };

  for (const [key, strategy] of Object.entries(benefitStrategies)) {
    if (benefits.toLowerCase().includes(key.toLowerCase())) {
      return strategy;
    }
  }

  return { feasibility: '높음', approach: '종합적 경영 개선 + 맞춤형 솔루션' };
}

// 📏 **5. 기업 규모 분류 함수**
function getCompanySizeCategory(employeeCount: string): string {
  const count = parseInt(employeeCount.split('-')[0]) || 0;
  if (count <= 5) return '초소형기업';
  if (count <= 30) return '소기업';
  if (count <= 300) return '중기업';
  return '대기업';
}

// 📊 **6. 점수 기반 등급 함수**
function getGradeFromScore(score: number): string {
  if (score >= 90) return 'S급 (우수)';
  if (score >= 80) return 'A급 (양호)';
  if (score >= 70) return 'B급 (보통)';
  if (score >= 60) return 'C급 (개선필요)';
  return 'D급 (시급개선)';
}

// 💪 **7. 강점 활용 전략 함수**
function getStrengthUtilizationStrategy(strength: any, industry: string): string {
  const strengthName = typeof strength === 'object' ? strength.category || strength : strength;
  const strategies: { [key: string]: string } = {
    '리더십': '조직 비전 수립 및 직원 동기부여 활용',
    '마케팅': '브랜드 차별화 및 고객 확보 전략 강화',
    '재무관리': '투자 최적화 및 자금 운용 효율성 제고',
    '기술': '혁신 제품/서비스 개발 및 경쟁 우위 확보',
    '인력': '우수 인재 활용한 조직 역량 극대화',
    '고객관리': '고객 충성도 제고 및 신규 고객 확보',
    '품질': '품질 우위를 통한 프리미엄 포지셔닝'
  };

  return strategies[strengthName] || '핵심 역량으로 시장 경쟁력 강화';
}

// 🔧 **8. 약점 개선 계획 함수**
function getWeaknessImprovementPlan(weakness: any, concerns: string): string {
  const weaknessName = typeof weakness === 'object' ? weakness.category || weakness : weakness;
  const plans: { [key: string]: string } = {
    '마케팅': '디지털 마케팅 역량 강화 및 고객 데이터 분석 시스템 구축',
    '재무관리': '재무 관리 시스템 도입 및 전문가 자문',
    '인력관리': '인사 관리 체계 구축 및 직원 교육 강화',
    '기술': '기술 혁신 투자 및 외부 전문가 협력',
    '고객서비스': 'CRM 시스템 도입 및 서비스 프로세스 개선',
    '품질관리': '품질 관리 시스템 구축 및 지속적 개선 프로세스',
    '영업': '영업 전략 수립 및 영업 역량 강화 교육'
  };

  return plans[weaknessName] || '전문가 상담을 통한 맞춤형 개선 방안 수립';
}

// 🎯 **9. 서비스 선정 이유 함수**
function getServiceSelectionReason(service: any, data: SimplifiedDiagnosisRequest, diagnosisData: any): string {
  const serviceName = service.name || service;
  const reasons: { [key: string]: string } = {
    'AI 생산성 혁신': `${data.companyName}의 운영 효율성 향상과 "${data.mainConcerns}" 해결에 최적`,
    '비즈니스 모델 분석': `${data.industry} 업계 특성을 고려한 전략적 사업 모델 최적화 필요`,
    '팩토리 경매 컨설팅': `제조업 특성상 설비 최적화와 자산 관리 전문성 필요`,
    '기술 스타트업 컨설팅': `혁신 기술 도입과 성장 전략 수립으로 경쟁력 확보`,
    '인증 컨설팅': `품질 인증을 통한 신뢰성 확보와 시장 진출 기회 확대`,
    '웹사이트 개발': `디지털 마케팅 강화와 온라인 고객 접점 확대 필요`
  };

  return reasons[serviceName] || `${data.companyName}의 현재 상황과 가장 적합한 솔루션`;
}

// 💡 **10. 맞춤형 서비스 효과 함수**
function getCustomizedServiceBenefit(service: any, data: SimplifiedDiagnosisRequest): string {
  const serviceName = service.name || service;
  const benefits: { [key: string]: string } = {
    'AI 생산성 혁신': `${data.employeeCount} 규모에서 업무 효율성 30-50% 향상 기대`,
    '비즈니스 모델 분석': `${data.industry} 특화 전략으로 매출 20-40% 증대 가능`,
    '팩토리 경매 컨설팅': `설비 최적화로 운영비 10-20% 절감 및 생산성 향상`,
    '기술 스타트업 컨설팅': `혁신 기술 도입으로 시장 선점 기회 확보`,
    '인증 컨설팅': `인증 획득을 통한 시장 신뢰도 제고 및 매출 증대`,
    '웹사이트 개발': `온라인 마케팅 강화로 신규 고객 확보 및 브랜드 인지도 향상`
  };

  return benefits[serviceName] || `${data.companyName} 맞춤형 솔루션으로 지속 가능한 성장 동력 확보`;
}

// 🔍 **11. 역량별 세부 인사이트 함수**
function getCapabilityInsight(capabilityName: string, score: number, industry: string): string {
  const insights: { [key: string]: { [key: string]: string } } = {
    '리더십 역량': {
      '높음': '우수한 리더십으로 조직 동기부여 및 비전 제시 가능',
      '중간': '리더십 스킬 개발을 통한 조직 역량 강화 필요',
      '낮음': '리더십 교육 및 코칭을 통한 역량 개발 시급'
    },
    '전략 기획': {
      '높음': '체계적 전략 수립 능력으로 중장기 성장 동력 확보',
      '중간': '전략적 사고 강화 및 실행 계획 구체화 필요',
      '낮음': '전략 기획 프로세스 구축 및 전문가 지원 필요'
    },
    '마케팅 역량': {
      '높음': '마케팅 강점을 활용한 시장 확대 및 브랜드 강화',
      '중간': '디지털 마케팅 역량 강화 및 고객 데이터 활용',
      '낮음': '마케팅 전략 수립 및 실행 역량 개발 시급'
    },
    '재무 관리': {
      '높음': '안정적 재무 관리로 투자 및 성장 기반 확보',
      '중간': '재무 관리 시스템 고도화 및 분석 역량 강화',
      '낮음': '재무 관리 체계 구축 및 전문가 자문 필요'
    },
    '인사 관리': {
      '높음': '우수한 인재 관리로 조직 효율성 및 만족도 제고',
      '중간': '인사 관리 시스템 개선 및 조직 문화 발전',
      '낮음': '체계적 인사 관리 시스템 구축 및 교육 강화'
    }
  };

  const level = score >= 80 ? '높음' : score >= 60 ? '중간' : '낮음';
  return insights[capabilityName]?.[level] || '역량 개발을 통한 경쟁력 강화 필요';
}

// 🤖 고급 진단 보고서 생성 (신비감 유지 + 기업 검색 기능 추가)
async function generateAIEnhancedReport(data: SimplifiedDiagnosisRequest, diagnosisData: any): Promise<string> {
  try {
    console.log('🚀 고급 진단 보고서 생성 시작:', { 
      company: data.companyName, 
      industry: data.industry 
    });

    const apiKey = getGeminiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 🔍 **1단계: 기업 검색 및 정보 수집 (Gemini 2.5 Flash 검색 기능 활용)**
    const companySearchPrompt = `다음 기업에 대한 최신 정보를 검색하여 종합 분석해주세요:

기업명: "${data.companyName}"
업종: "${data.industry}"
지역: "${data.businessLocation || '전국'}"

검색 및 분석 항목:
1. 기업 규모 및 업계 내 위치
2. 최근 사업 동향 및 뉴스 (2024년 기준)
3. 업계 내 평판 및 경쟁력
4. 성장 가능성 및 시장 전망
5. 디지털 전환 수준 및 온라인 존재감
6. 유사 업종 성공 사례 및 트렌드

검색 결과가 없더라도 업종별 일반적인 시장 분석을 제공해주세요.
답변은 간결하고 구체적으로 200자 이내로 요약해주세요.`;

    let companySearchResult = '';
    try {
      const searchResponse = await model.generateContent(companySearchPrompt);
      companySearchResult = searchResponse.response.text() || '업종별 일반 분석 적용';
      console.log('🔍 기업 검색 완료:', companySearchResult.substring(0, 100) + '...');
    } catch (error) {
      console.warn('⚠️ 기업 검색 실패, 일반 분석 적용:', error);
      companySearchResult = `${data.industry} 업종의 일반적인 시장 특성을 반영한 분석`;
    }

    // 📊 **2단계: 상세 점수 분석 및 피드백 생성**
    const detailedScoreAnalysis = analyzeDetailedScores(diagnosisData);
    
    // 📊 **3단계: GAP 분석 및 컨설팅 제안 생성**
    const gapAnalysis = generateGAPAnalysis(diagnosisData, data);
    const consultingProposal = generateConsultingProposal(diagnosisData, data, gapAnalysis);
    
    // 🎯 **4단계: AI 일터혁신 중심 진단 보고서 생성 (5000자 이내)**
    const enhancedReportPrompt = `다음 기업의 레벨업 시트 진단 결과를 바탕으로 **AI 실무도입을 통한 일터혁신과 고몰입조직 구축** 중심의 GAP 분석 기반 경영진단보고서를 작성해주세요:

기업명: ${data.companyName}
업종: ${data.industry}
담당자: ${data.contactManager}
직원수: ${data.employeeCount}

=== 검색된 기업 정보 ===
${companySearchResult}

=== 상세 평가 점수 (20개 항목) ===
${detailedScoreAnalysis.scoreBreakdown}

=== 종합 진단 결과 ===
• 총점: ${diagnosisData.totalScore || 0}점/100점 (${getGradeFromScore(diagnosisData.totalScore || 0)}급)
• 평가 신뢰도: ${diagnosisData.reliabilityScore || 0}%
• 강점 영역: ${diagnosisData.strengths?.join(', ') || '미확인'}
• 약점 영역: ${diagnosisData.weaknesses?.join(', ') || '미확인'}

=== GAP 분석 결과 ===
${gapAnalysis.summary}

=== 기업 현황 및 전략적 목표 ===
• 주요 고민: ${data.mainConcerns}
• 기대 효과: ${data.expectedBenefits}

🎯 **핵심 작성 방향**:
이 보고서는 **AI 실무도입을 통한 일터혁신으로 고몰입조직을 구축**하여 조직의 전략적 목표 달성을 지원하는 것을 목표로 합니다.

⚠️ **중요 제약 조건**:
1. 전체 보고서는 반드시 **5000자 이내**로 작성 (답변이 잘리지 않도록 핵심 요약)
2. GAP 분석 기반으로 AI 실무도입과 프로세스 효율화 방법론 중심 제안
3. 고몰입조직 구축을 위한 일터혁신 전략에 집중
4. 조직의 전략적 목표와 ALIGNED된 실행 방안 제시
5. 경영지도사 수준의 전문적이고 신뢰성 있는 톤앤매너 유지

📋 **이후경 경영지도사 스타일 보고서 구성 (5000자 이내):**

보고서 구성:

1. 조직 현황 진단 및 AI 도입 준비도 평가
   - 총점 기반 조직 성숙도 및 업종 내 위치 분석
   - AI 실무도입을 위한 조직 준비도 평가
   - 검색된 시장 동향과 AI 전환 필요성 연계

2. 강점 기반 AI 활용 전략 및 고몰입 요소 발굴
   - 4점 이상 영역을 활용한 AI 도입 우선순위 설정
   - 기존 강점과 AI 기술의 시너지 효과 분석
   - 고몰입조직 구축을 위한 강점 영역 활용 방안

3. GAP 분석 기반 일터혁신 우선순위 및 AI 솔루션
   - 3점 이하 영역의 AI 기반 해결 방안 제시
   - 프로세스 효율화를 위한 단계별 AI 도입 전략
   - 일터혁신을 통한 조직 역량 강화 로드맵

4. AI 실무도입 액션플랜 및 고몰입조직 구축 방법론
   - 구체적 실무 적용 방안 (업무 자동화, 데이터 분석 등)
   - 직원 참여도 향상을 위한 AI 교육 및 변화관리 전략
   - 성과 기반 몰입도 제고 시스템 구축 방안

5. 전략적 목표 달성을 위한 AI 기반 성과 관리 체계
   - 조직의 전략적 목표와 연계된 AI KPI 설계
   - 실시간 성과 모니터링 및 피드백 시스템
   - 지속적 개선을 위한 AI 기반 의사결정 체계

6. 통합 실행 로드맵 및 성과 예측
   - 3단계(도입/정착/확산) AI 일터혁신 실행 계획
   - 단계별 몰입도 향상 지표 및 성과 측정 방법

🔧 작성 가이드라인:
- 이후경 경영지도사 톤앤매너: 전문적이면서도 친근하고 실무적인 조언 스타일
- 마크다운 표시(##, **, 등) 일체 사용 금지 - 자연스러운 보고서 형식
- 글자수 표기나 기술적 용어 표기 금지
- "GEMINI", "ChatGPT" 등 브랜드명 직접 언급 금지 - "AI 도구", "생성형 AI" 등으로 대체
- 28년 경영지도 경험을 바탕으로 한 실무적이고 친근한 조언 톤
- 실무진이 바로 적용 가능한 구체적 방법론 제시
- GAP 분석을 활용한 단계적 접근으로 논리적 일관성 확보
- 고몰입조직 구축을 위한 인사/조직 전략과 AI 기술의 융합
- 5000자 한도 내에서 압축적이면서도 실용적인 핵심 내용 집중
- 조직의 전략적 목표 달성에 직결되는 실행 가능한 방안 중심

중요한 포맷 지침:
- 제목은 자연스럽게 "상세 분석 보고서"로 시작
- 섹션 제목은 "1. 조직 현황 진단 및 AI 도입 준비도 평가" 형식으로 숫자와 함께 자연스럽게 표기
- 마크다운 문법(##, **, 등) 절대 사용하지 말고 일반 텍스트로 작성
- 경영지도사가 직접 작성한 것처럼 자연스럽고 전문적인 문체 사용
- 글자수나 기술적 표기는 일체 포함하지 않음

반드시 5000자 이내로 작성하되, AI 실무도입을 통한 일터혁신으로 고몰입조직을 구축하여 조직의 전략적 목표를 달성할 수 있는 구체적이고 실행 가능한 방법론을 제시해주세요.`;

    const reportResponse = await model.generateContent(enhancedReportPrompt);
    let aiReport = reportResponse.response.text() || '분석 시스템 처리 중 오류가 발생했습니다.';

    // 📝 **글자수 제한 5000자로 확대**
    if (aiReport.length > 5000) {
      console.log(`⚠️ 보고서 길이 초과 (${aiReport.length}자), 5000자로 압축`);
      aiReport = aiReport.substring(0, 4950) + '\n\n[AI 일터혁신 진단보고서 완료]';
    }

    console.log('✅ 고급 진단 보고서 생성 완료:', {
      length: aiReport.length,
      company: data.companyName,
      searchApplied: companySearchResult.length > 50
    });

    return aiReport;

  } catch (error) {
    console.error('❌ 고급 진단 보고서 생성 실패:', error);
    
    // 🔄 **폴백 보고서 생성**
    return generateFallbackReport(data, diagnosisData);
  }
}

// 📊 **상세 점수 분석 함수**
function analyzeDetailedScores(diagnosisData: any): { scoreBreakdown: string, priorities: string[] } {
  const categories = diagnosisData.categoryScores || {};
  let scoreBreakdown = '';
  const priorities: string[] = [];

  // 카테고리별 상세 분석
  Object.values(categories).forEach((category: any) => {
    if (category.items && Array.isArray(category.items)) {
      scoreBreakdown += `\n${category.name}: 평균 ${category.score?.toFixed(1) || '0.0'}/5.0점\n`;
      
      category.items.forEach((item: any) => {
        const scoreText = getScoreLevel(item.score);
        scoreBreakdown += `  - ${item.name}: ${item.score}점 (${scoreText})\n`;
        
        // 개선 우선순위 항목 수집 (3점 이하)
        if (item.score <= 3) {
          priorities.push(`${category.name} > ${item.name} (${item.score}점)`);
        }
      });
    }
  });

  return { scoreBreakdown, priorities };
}

// 📈 **점수 수준 평가**
function getScoreLevel(score: number): string {
  if (score >= 5) return '매우 우수';
  if (score >= 4) return '우수';
  if (score >= 3) return '보통';
  if (score >= 2) return '개선 필요';
  return '시급 개선';
}

// 📊 **GAP 분석 생성 함수 (신규)**
function generateGAPAnalysis(diagnosisData: any, data: SimplifiedDiagnosisRequest): {
  summary: string;
  weakAreas: Array<{ category: string; item: string; currentScore: number; targetScore: number; gap: number; priority: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  strongAreas: Array<{ category: string; item: string; score: number; advantage: string }>;
  recommendations: string[];
} {
  const categories = diagnosisData.categoryScores || {};
  const weakAreas: any[] = [];
  const strongAreas: any[] = [];
  const recommendations: string[] = [];

  // 📊 **카테고리별 GAP 분석**
  Object.values(categories).forEach((category: any) => {
    if (category.items && Array.isArray(category.items)) {
      category.items.forEach((item: any) => {
        if (item.score <= 3) {
          // 취약 영역 (3점 이하)
          const targetScore = 4; // 목표 점수
          const gap = targetScore - item.score;
          const priority = item.score <= 2 ? 'HIGH' : (item.score <= 2.5 ? 'MEDIUM' : 'LOW');
          
          weakAreas.push({
            category: category.name,
            item: item.name,
            currentScore: item.score,
            targetScore: targetScore,
            gap: gap,
            priority: priority
          });
        } else if (item.score >= 4) {
          // 강점 영역 (4점 이상)
          strongAreas.push({
            category: category.name,
            item: item.name,
            score: item.score,
            advantage: getAdvantageDescription(item.name, item.score)
          });
        }
      });
    }
  });

  // 📋 **GAP 분석 요약 생성**
  const summary = `
📊 GAP 분석 요약
• 강점 영역: ${strongAreas.length}개 항목 (평균 4.0점 이상)
• 개선 영역: ${weakAreas.length}개 항목 (3.0점 이하)
• 우선 개선: ${weakAreas.filter(w => w.priority === 'HIGH').length}개 항목 (시급)
• 중기 개선: ${weakAreas.filter(w => w.priority === 'MEDIUM').length}개 항목 (6개월 내)

🎯 핵심 GAP
${weakAreas
  .filter(w => w.priority === 'HIGH')
  .slice(0, 3)
  .map(w => `• ${w.category} > ${w.item}: ${w.currentScore}점 → ${w.targetScore}점 목표 (GAP: ${w.gap.toFixed(1)}점)`)
  .join('\n')}

💪 활용 가능 강점
${strongAreas
  .slice(0, 3)
  .map(s => `• ${s.category} > ${s.item}: ${s.score}점 (${s.advantage})`)
  .join('\n')}
`.trim();

  // 📋 **GAP 기반 추천사항 생성**
  if (weakAreas.length > 0) {
    recommendations.push(`1. 우선 개선 영역: ${weakAreas.filter(w => w.priority === 'HIGH').map(w => w.item).join(', ')}`);
    recommendations.push(`2. 3개월 집중 목표: 핵심 취약점 1-2개 영역 4점 달성`);
    recommendations.push(`3. 강점 활용 전략: ${strongAreas.slice(0, 2).map(s => s.item).join(', ')} 차별화 극대화`);
  }

  return { summary, weakAreas, strongAreas, recommendations };
}

// 🎯 **맞춤형 컨설팅 제안 생성 함수 (신규)**
function generateConsultingProposal(diagnosisData: any, data: SimplifiedDiagnosisRequest, gapAnalysis: any): {
  summary: string;
  proposals: Array<{ title: string; description: string; duration: string; expectedROI: string; priority: number }>;
  roadmap: string;
} {
  const totalScore = diagnosisData.totalScore || 0;
  const proposals: any[] = [];

  // 📊 **점수 구간별 맞춤형 제안**
  if (totalScore < 60) {
    // 60점 미만: 기초 역량 강화 집중
    proposals.push({
      title: "기초 경영 시스템 구축",
      description: "기본적인 업무 프로세스 정립 및 고객 응대 역량 강화",
      duration: "3-6개월",
      expectedROI: "업무 효율성 30% 향상",
      priority: 1
    });
    
    proposals.push({
      title: "핵심 취약점 집중 개선",
      description: gapAnalysis.weakAreas.filter((w: any) => w.priority === 'HIGH').map((w: any) => w.item).join(', ') + " 영역 맞춤 컨설팅",
      duration: "2-4개월",
      expectedROI: "문제 영역 점수 2점 이상 향상",
      priority: 2
    });
  } else if (totalScore < 80) {
    // 60-80점: 차별화 및 성장 동력 확보
    proposals.push({
      title: "디지털 전환 및 마케팅 강화",
      description: "온라인 채널 구축 및 데이터 기반 고객 관리 시스템 도입",
      duration: "4-8개월",
      expectedROI: "매출 20% 증가, 고객만족도 향상",
      priority: 1
    });
    
    proposals.push({
      title: "운영 효율성 최적화",
      description: "업무 프로세스 개선 및 재고/구매 관리 시스템 고도화",
      duration: "3-6개월",
      expectedROI: "운영비용 15% 절감",
      priority: 2
    });
  } else {
    // 80점 이상: 시장 리더십 강화
    proposals.push({
      title: "시장 리더십 확보 전략",
      description: "브랜드 차별화 및 시장 확장을 위한 고급 전략 컨설팅",
      duration: "6-12개월",
      expectedROI: "시장 점유율 확대, 브랜드 가치 향상",
      priority: 1
    });
    
    proposals.push({
      title: "지속 성장 동력 구축",
      description: "신사업 발굴 및 조직 역량 고도화 컨설팅",
      duration: "8-12개월",
      expectedROI: "신규 수익원 창출, 조직 경쟁력 강화",
      priority: 2
    });
  }

  // 📊 **산업별 특화 제안 추가**
  if (data.industry.includes('retail') || data.industry.includes('food')) {
    proposals.push({
      title: "고객 경험 혁신 프로그램",
      description: "매장 환경 개선 및 고객 응대 서비스 고도화",
      duration: "2-4개월",
      expectedROI: "고객 재방문율 25% 향상",
      priority: 3
    });
  }

  // 📋 **컨설팅 제안 요약**
  const summary = `
🎯 맞춤형 컨설팅 제안 (총점 ${totalScore}점 기준)

우선 추천 솔루션:
${proposals.slice(0, 2).map((p, i) => `${i + 1}. ${p.title} (${p.duration})
   • ${p.description}
   • 기대효과: ${p.expectedROI}`).join('\n\n')}

📈 예상 성과:
• 3개월 후: 핵심 취약점 개선으로 총점 ${Math.min(totalScore + 10, 100)}점 달성
• 6개월 후: 체계적 개선으로 ${Math.min(totalScore + 20, 100)}점 수준 도달
• 1년 후: 지속적 성장 기반 구축으로 업종 상위 10% 진입
`.trim();

  // 📅 **실행 로드맵**
  const roadmap = `
📅 3단계 실행 로드맵:
1단계 (1-3개월): 긴급 개선 과제 해결 및 기초 시스템 구축
2단계 (4-6개월): 운영 효율성 향상 및 차별화 요소 강화  
3단계 (7-12개월): 지속 성장 동력 확보 및 시장 경쟁력 강화
`.trim();

  return { summary, proposals, roadmap };
}

// 🔍 **강점 설명 생성 함수**
function getAdvantageDescription(itemName: string, score: number): string {
  const descriptions: Record<string, string> = {
    '기획수준': '체계적인 상품 기획력',
    '차별화정도': '독특한 경쟁 우위',
    '가격설정': '합리적 가격 정책',
    '전문성': '높은 업무 전문성',
    '품질': '우수한 품질 관리',
    '고객맞이': '친절한 서비스',
    '고객응대': '탁월한 응대 능력',
    '불만관리': '효과적인 CS',
    '고객유지': '우수한 고객 관리',
    '고객이해': '정확한 고객 분석',
    '마케팅계획': '체계적인 마케팅',
    '오프라인마케팅': '효과적인 오프라인 홍보',
    '온라인마케팅': '디지털 마케팅 역량',
    '판매전략': '전략적 영업력',
    '구매관리': '효율적인 구매',
    '재고관리': '최적화된 재고 운영',
    '외관관리': '매력적인 매장 외관',
    '인테리어관리': '세련된 매장 환경',
    '청결도': '청결한 매장 관리',
    '작업동선': '효율적인 업무 flow'
  };
  
  return descriptions[itemName] || '우수한 역량';
}

// 📝 **300자 미만 핵심요약 보고서 생성** (구글시트 전송용)
function generateCoreReportSummary(data: SimplifiedDiagnosisRequest, diagnosisData: any, fullReport: string): string {
  const totalScore = diagnosisData.totalScore || 0;
  const grade = getGradeFromScore(totalScore);
  
  // 주요 강점과 약점 추출 (최대 2개씩)
  const strengths = (diagnosisData.strengths || []).slice(0, 2);
  const weaknesses = (diagnosisData.weaknesses || []).slice(0, 2);
  
  // 추천 서비스 추출 (최대 2개)
  const recommendedServices = (diagnosisData.recommendedServices || []).slice(0, 2);
  
  let summary = `${data.companyName} 진단결과: ${totalScore}점(${grade}급). `;
  
  // 강점 추가 (간단히)
  if (strengths.length > 0) {
    summary += `강점: ${strengths.map((s: any) => typeof s === 'string' ? s.split(':')[0] : s).join(', ')}. `;
  }
  
  // 약점 추가 (간단히)
  if (weaknesses.length > 0) {
    summary += `개선필요: ${weaknesses.map((w: any) => typeof w === 'string' ? w.split(':')[0] : w).join(', ')}. `;
  }
  
  // 추천 서비스 추가
  if (recommendedServices.length > 0) {
    const serviceNames = recommendedServices.map((s: any) => s.name || s.id || s).join(', ');
    summary += `추천서비스: ${serviceNames}. `;
  }
  
  // 주요 고민사항 반영
  if (data.mainConcerns) {
    const concerns = data.mainConcerns.substring(0, 50);
    summary += `고민: ${concerns}${data.mainConcerns.length > 50 ? '...' : ''}. `;
  }
  
  // 300자 제한
  if (summary.length > 300) {
    summary = summary.substring(0, 297) + '...';
  }
  
  return summary;
}

// 🔄 **폴백 보고서 생성**
function generateFallbackReport(data: SimplifiedDiagnosisRequest, diagnosisData: any): string {
  const totalScore = diagnosisData.totalScore || 0;
  const grade = getGradeFromScore(totalScore);
  
  return `
📊 ${data.companyName} 레벨업 시트 진단 보고서

🏆 종합 평가: ${totalScore}점/100점 (${grade}급)

📈 현황 분석
${data.companyName}은 ${data.industry} 업종에서 ${data.employeeCount} 규모로 운영되고 있으며, 레벨업 시트 20개 항목 평가 결과 종합 ${totalScore}점을 기록했습니다.

🎯 핵심 개선 과제
• 주요 고민: ${data.mainConcerns.substring(0, 100)}...
• 기대 효과: ${data.expectedBenefits.substring(0, 100)}...

💡 우선 추천 방안
1. 디지털 도구 활용을 통한 업무 효율성 개선
2. 고객 응대 역량 강화를 통한 만족도 제고
3. 체계적인 마케팅 전략 수립 및 실행

📞 전문가 상담
더 자세한 분석과 맞춤형 솔루션을 원하시면 전문가 상담을 신청하세요.
연락처: 010-9251-9743 (이후경 경영지도사)

*본 보고서는 레벨업 시트 표준 평가 도구를 활용한 과학적 분석 결과입니다.*
`.trim();
}

// 📊 **삭제됨: 기존 함수를 Enhanced 진단평가 엔진으로 완전 대체**
// function calculateLevelUpScores - Enhanced 진단평가 엔진 v3.0으로 통합됨

// 🔧 헬퍼 함수들 (기존 코드와의 호환성 유지)
function getCategoryKeyFromName(categoryName: string): string {
  const mapping: Record<string, string> = {
    '상품/서비스 관리 역량': 'productService',
    '고객응대 역량': 'customerService',
    '마케팅 역량': 'marketing',
    '구매 및 재고관리': 'procurement',
    '매장관리 역량': 'storeManagement'
  };
  return mapping[categoryName] || 'unknown';
}

function getItemDisplayName(itemId: string): string {
  const mapping: Record<string, string> = {
    'planning_level': '기획수준',
    'differentiation_level': '차별화정도',
    'pricing_level': '가격설정',
    'expertise_level': '전문성',
    'quality_level': '품질',
    'customer_greeting': '고객맞이',
    'customer_service': '고객응대',
    'complaint_management': '불만관리',
    'customer_retention': '고객유지',
    'customer_understanding': '고객이해',
    'marketing_planning': '마케팅계획',
    'offline_marketing': '오프라인마케팅',
    'online_marketing': '온라인마케팅',
    'sales_strategy': '판매전략',
    'purchase_management': '구매관리',
    'inventory_management': '재고관리',
    'exterior_management': '외관관리',
    'interior_management': '인테리어관리',
    'cleanliness': '청결도',
    'work_flow': '작업동선'
  };
  return mapping[itemId] || itemId;
}

function getKoreanKeyFromItemId(itemId: string): string {
  return getItemDisplayName(itemId); // 동일한 매핑 사용
}

function getItemQuestion(itemId: string): string {
  const questions: Record<string, string> = {
    'planning_level': '상품/서비스 기획 수준이 어느 정도인가요?',
    'differentiation_level': '경쟁업체 대비 차별화 정도는?',
    'pricing_level': '가격 설정의 합리성은?',
    'expertise_level': '업무 전문성 수준은?',
    'quality_level': '상품/서비스 품질 수준은?',
    'customer_greeting': '고객 맞이의 친절함은?',
    'customer_service': '고객 응대 능력은?',
    'complaint_management': '고객 불만 처리 능력은?',
    'customer_retention': '고객 유지 관리 능력은?',
    'customer_understanding': '고객 특성 이해도는?',
    'marketing_planning': '마케팅 계획 수립 능력은?',
    'offline_marketing': '오프라인 마케팅 실행 능력은?',
    'online_marketing': '온라인 마케팅 활용 능력은?',
    'sales_strategy': '판매 전략 수립 및 실행 능력은?',
    'purchase_management': '구매 관리의 체계성은?',
    'inventory_management': '재고 관리의 효율성은?',
    'exterior_management': '매장 외관 관리 상태는?',
    'interior_management': '내부 인테리어 관리 상태는?',
    'cleanliness': '매장 청결도는?',
    'work_flow': '작업 동선의 효율성은?'
  };
  return questions[itemId] || `${itemId}에 대한 평가`;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔄 고급 진단 시스템 시작');
    
    const data: SimplifiedDiagnosisRequest = await request.json();
    
    // 입력 데이터 검증
    if (!data.companyName || !data.industry || !data.contactManager || !data.email) {
      return NextResponse.json({
        success: false,
        error: '필수 정보가 누락되었습니다.'
      }, { status: 400 });
    }

    // 개인정보 동의 확인 (엄격한 검증)
    if (!data.privacyConsent || data.privacyConsent !== true) {
      console.log('개인정보 동의 검증 실패:', data.privacyConsent);
      return NextResponse.json({
        success: false,
        error: '개인정보 수집 및 이용에 동의해주세요. 동의는 필수 사항입니다.'
      }, { status: 400 });
    }
    
    console.log('✅ 개인정보 동의 검증 성공:', data.privacyConsent);

    // 📊 **디버깅: 받은 점수 데이터 확인**
    console.log('📊 API에서 받은 점수 데이터:', {
      planning_level: data.planning_level,
      differentiation_level: data.differentiation_level,
      pricing_level: data.pricing_level,
      customer_greeting: data.customer_greeting,
      customer_service: data.customer_service,
      marketing_planning: data.marketing_planning,
      purchase_management: data.purchase_management,
      exterior_management: data.exterior_management,
      총점수개수: [
        data.planning_level, data.differentiation_level, data.pricing_level, data.expertise_level, data.quality_level,
        data.customer_greeting, data.customer_service, data.complaint_management, data.customer_retention,
        data.customer_understanding, data.marketing_planning, data.offline_marketing, data.online_marketing, data.sales_strategy,
        data.purchase_management, data.inventory_management,
        data.exterior_management, data.interior_management, data.cleanliness, data.work_flow
      ].filter(score => score && score > 0).length + '/20개'
    });

    // 1단계: Enhanced 진단평가 엔진 v3.0 사용
    console.log('🚀 Enhanced 진단평가 엔진 v3.0 시작');
    const diagnosisEngine = new EnhancedDiagnosisEngine();
    
    // 데이터 유효성 검증
    const validation = validateDiagnosisData(data);
    if (!validation.isValid) {
      console.warn('⚠️ 데이터 유효성 검증 실패:', validation.errors);
    }
    
    // Enhanced 진단 실행
    const enhancedResult = diagnosisEngine.evaluate(data);
    console.log('✅ Enhanced 진단 완료:', {
      totalScore: enhancedResult.totalScore,
      grade: enhancedResult.overallGrade,
      reliability: enhancedResult.reliabilityScore,
      categoriesEvaluated: enhancedResult.categoryResults.filter(c => 
        c.itemResults.some(i => i.currentScore !== null)
      ).length
    });
    
    // 2단계: 기존 진단 로직과 통합 (하위 호환성)
    console.log('📊 기존 시스템과 통합 중...');
    const diagnosisResult = generateSimplifiedDiagnosis(data);
    
         // 3단계: Enhanced 결과로 기존 진단 결과 업데이트
     (diagnosisResult as any).totalScore = enhancedResult.totalScore;
     
     // 카테고리별 점수 변환 (기존 형식 유지)
     const legacyCategoryScores = enhancedResult.categoryResults.reduce((acc, cat) => {
       const validItems = cat.itemResults.filter(item => item.currentScore !== null);
       
       acc[getCategoryKeyFromName(cat.categoryName)] = {
         name: cat.categoryName,
         score: cat.currentScore,
         maxScore: 5.0,
         weight: Math.round(cat.weight * 100),
         selectedCount: validItems.length,
         totalCount: cat.itemResults.length,
         gapScore: cat.gapScore,
         items: cat.itemResults.map(item => ({
           name: getItemDisplayName(item.itemId),
           score: item.currentScore,
           selected: item.currentScore !== null,
           question: getItemQuestion(item.itemId),
           gap: item.gap,
           priority: item.priority,
           recommendation: item.recommendation
         }))
       };
       return acc;
     }, {} as any);
     
     // 상세 점수 변환 (기존 키 형식 유지)
     const legacyDetailedScores = enhancedResult.categoryResults
       .flatMap(cat => cat.itemResults)
       .reduce((acc, item) => {
         acc[getKoreanKeyFromItemId(item.itemId)] = item.currentScore;
         return acc;
       }, {} as Record<string, number | null>);
     
     (diagnosisResult as any).categoryScores = legacyCategoryScores;
     (diagnosisResult as any).detailedScores = legacyDetailedScores;
     (diagnosisResult as any).enhancedAnalysis = {
       gapAnalysis: enhancedResult.gapAnalysis,
       recommendedActions: enhancedResult.recommendedActions,
       comparisonMetrics: enhancedResult.comparisonMetrics,
       gradeInfo: {
         grade: enhancedResult.overallGrade,
         description: getGradeFromScore(enhancedResult.totalScore)
       }
     };
     (diagnosisResult as any).reliabilityScore = enhancedResult.reliabilityScore.toString();
    
    // 2단계: 🔮 고급 진단 보고서 생성 (2000자 미만)
    console.log('🔮 고급 보고서 생성 중...');
    const summaryReport = await generateAIEnhancedReport(data, diagnosisResult);
    
    // 3단계: 통합 데이터 처리
    let processingResult = {
      googleSheetsSaved: false,
      userEmailSent: false,
      adminEmailSent: false,
      errors: [] as string[],
      warnings: [] as string[]
    };

    try {
      console.log('🔄 통합 데이터 처리 시작 (구글시트 + 이메일)...');
      
              // 📊 **Enhanced 결과를 Google Apps Script 형식으로 변환**
        const detailedScores: any = {};
        const categoryScores = (diagnosisResult as any).categoryScores || {};
      
      // Enhanced 진단평가 엔진의 결과를 Google Apps Script 형식으로 변환
      Object.values(categoryScores).forEach((category: any) => {
        if (category.items && Array.isArray(category.items)) {
          category.items.forEach((item: any) => {
            // 각 항목의 영문 키로 매핑
            const keyMapping = {
              '기획수준': 'planning_level',
              '차별화정도': 'differentiation_level', 
              '가격설정': 'pricing_level',
              '전문성': 'expertise_level',
              '품질': 'quality_level',
              '고객맞이': 'customer_greeting',
              '고객응대': 'customer_service',
              '불만관리': 'complaint_management',
              '고객유지': 'customer_retention',
              '고객이해': 'customer_understanding',
              '마케팅계획': 'marketing_planning',
              '오프라인마케팅': 'offline_marketing',
              '온라인마케팅': 'online_marketing',
              '판매전략': 'sales_strategy',
              '구매관리': 'purchase_management',
              '재고관리': 'inventory_management',
              '외관관리': 'exterior_management',
              '인테리어관리': 'interior_management',
              '청결도': 'cleanliness',
              '작업동선': 'work_flow'
            };
            
            const englishKey = keyMapping[item.name as keyof typeof keyMapping];
            if (englishKey) {
              detailedScores[englishKey] = item.score || 0;
            }
          });
        }
      });

      // 진단 데이터 처리를 위한 **확장된** 폼 데이터 생성
      const diagnosisFormData = {
        // 기본 진단 정보
        companyName: data.companyName,
        industry: data.industry, 
        businessStage: data.growthStage,
        employeeCount: data.employeeCount,
        establishedYear: new Date().getFullYear().toString(),
        mainConcerns: data.mainConcerns,
        expectedBudget: '미정',
        urgency: '보통',
        contactName: data.contactManager,
        contactPhone: '정보없음',
        contactEmail: data.email,
        privacyConsent: data.privacyConsent,
        submitDate: new Date().toLocaleString('ko-KR'),
        
        // 🔧 진단 결과 정보 추가 (구글시트 저장용)
        diagnosisScore: data.diagnosisResults?.totalScore || diagnosisResult.totalScore,
        recommendedServices: (() => {
          if (data.diagnosisResults?.recommendedServices && Array.isArray(data.diagnosisResults.recommendedServices)) {
            return data.diagnosisResults.recommendedServices.map(s => s.name || s.id || s).join(', ');
          }
          if (diagnosisResult.recommendedServices && Array.isArray(diagnosisResult.recommendedServices)) {
            return diagnosisResult.recommendedServices.map(s => s.name || s.id || s).join(', ');
          }
          return '추천서비스 정보 확인 중';
        })(),
        reportType: data.diagnosisResults?.reportType || '간소화된_AI진단',
        diagnosisFormType: 'AI_무료진단_레벨업시트', // 폼 타입 명시
        
        // 📊 **NEW: 문항별 상세 점수 (20개 항목)**
        문항별점수: detailedScores,
        detailedScores: detailedScores,
        
        // 📊 **NEW: 카테고리별 점수 (5개 영역)**
        카테고리점수: categoryScores,
        categoryScores: categoryScores,
        
        // 📝 **NEW: 진단결과보고서 요약 (300자 미만 핵심요약)**
        진단보고서요약: generateCoreReportSummary(data, diagnosisResult, summaryReport),
        summaryReport: generateCoreReportSummary(data, diagnosisResult, summaryReport),
        
        // 🎯 **NEW: 종합 점수 및 메타 정보**
        종합점수: diagnosisResult.totalScore,
        totalScore: diagnosisResult.totalScore,
        추천서비스목록: diagnosisResult.recommendedServices,
        강점영역: diagnosisResult.strengths || [],
        약점영역: diagnosisResult.weaknesses || [],
        
        // 📈 **NEW: 추가 메타 정보**
        보고서글자수: summaryReport.length,
        평가일시: new Date().toISOString(),
        분석엔진버전: 'enhanced-v2.5',
        신비감유지: true // AI 기술 노출 방지 플래그
      };

      // processDiagnosisSubmission 사용하여 통합 처리
      const { processDiagnosisSubmission } = await import('@/lib/utils/emailService');
      const result = await processDiagnosisSubmission(diagnosisFormData);
      
      processingResult = {
        googleSheetsSaved: result.success || false,
        userEmailSent: result.success || false,
        adminEmailSent: result.success || false,
        errors: result.success ? [] : [result.message || '처리 중 오류 발생'],
        warnings: []
      };

      console.log('✅ 통합 데이터 처리 완료:', {
        성공여부: result.success,
        서비스: result.service,
        메시지: result.message,
        진단점수: diagnosisFormData.diagnosisScore,
        추천서비스: (() => {
          const services = diagnosisFormData.recommendedServices;
          if (typeof services === 'string') {
            return services.substring(0, 50) + (services.length > 50 ? '...' : '');
          }
          return '추천서비스 정보 확인 중';
        })()
      });

      // 일부 실패하더라도 경고로 처리 (진단은 성공)
      if (!result.success) {
        processingResult.warnings.push(`일부 기능에서 오류 발생: ${result.message}`);
      }

    } catch (dataProcessingError) {
      console.error('⚠️ 데이터 처리 중 오류 (진단 결과는 정상):', dataProcessingError);
      processingResult.errors.push('데이터 저장/이메일 발송 중 오류가 발생했습니다.');
      processingResult.warnings.push('진단 결과는 정상적으로 생성되었으나 일부 기능에서 문제가 발생했습니다.');
    }

    // 4단계: 진단 결과 생성 및 반환 (항상 성공)
    const processingTimeMs = Date.now() - startTime;
    const processingTimeSeconds = (processingTimeMs / 1000).toFixed(1);
    
    console.log(`📊 고급 진단 완료 (${processingTimeSeconds}초)`);

    return NextResponse.json({
      success: true,
      message: '🔮 고급 진단이 완료되었습니다.',
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
        // 처리 결과 상세 정보 (신비감 유지)
        googleSheetsSaved: processingResult.googleSheetsSaved,
        userEmailSent: processingResult.userEmailSent,
        adminEmailSent: processingResult.adminEmailSent,
        processingTime: `${processingTimeSeconds}초`,
        reportType: '🔮 고급 종합 진단 보고서',
        enhanced: true,
        analysisEngine: 'advanced-v2.5',
        warnings: processingResult.warnings.length > 0 ? processingResult.warnings : undefined,
        errors: processingResult.errors.length > 0 ? processingResult.errors : undefined
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 고급 진단 시스템 오류:', error);

    return NextResponse.json({
      success: false,
      error: '고급 진단 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 