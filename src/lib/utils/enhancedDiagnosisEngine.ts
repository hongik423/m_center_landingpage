/**
 * 🔮 M-CENTER 전문 진단 분석 시스템
 * 이후경 경영지도사의 28년 경험과 노하우를 체계화한 기업 진단 시스템
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiKey } from '@/lib/config/env';

// 전문 분석 시스템 초기화 (안전한 방식으로)
const getAnalysisClient = () => {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    console.warn('⚠️ 전문 분석 시스템 키가 설정되지 않았습니다. 기본 모드로 동작합니다.');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

// 📊 고도화된 진단 데이터 타입
export interface EnhancedDiagnosisInput {
  companyName: string;
  industry: string;
  contactManager: string;
  email: string;
  employeeCount: string;
  growthStage: string;
  businessLocation: string;
  mainConcerns: string;
  expectedBenefits: string;
  // 🆕 추가 진단 정보
  annualRevenue?: string;
  businessAge?: string;
  competitionLevel?: string;
  digitalMaturity?: string;
  currentChallenges?: string[];
  futureGoals?: string[];
  budget?: string;
  timeline?: string;
}

export interface ProfessionalAnalysisResult {
  // 기본 정보
  totalScore: number;
  reliabilityScore: number;
  processingTime: string;
  
  // 🏢 이후경 경영지도사 전문 분석 의견
  professionalInsights: {
    marketAnalysis: string;
    competitiveAnalysis: string;
    riskAssessment: string;
    opportunityMapping: string;
    strategicRecommendations: string;
  };
  
  // 📈 세부 지표 (6개 핵심 영역)
  detailedMetrics: {
    businessModel: number;
    marketPosition: number;
    operationalEfficiency: number;
    growthPotential: number;
    digitalReadiness: number;
    financialHealth: number;
  };
  
  // 🎯 SWOT 분석 (전문가 심화 분석)
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    strategicMatrix: string; // SWOT 매트릭스 분석
  };
  
  // 🚀 맞춤 서비스 추천 (경영지도사 전문 의견)
  serviceRecommendations: Array<{
    service: string;
    priority: 'high' | 'medium' | 'low';
    rationale: string;
    expectedROI: string;
    timeline: string;
    implementationSteps: string[];
    riskFactors: string[];
  }>;
  
  // 📅 단계별 실행 계획
  actionPlan: {
    immediate: string[]; // 즉시 실행 (1개월)
    shortTerm: string[]; // 단기 (3개월)
    mediumTerm: string[]; // 중기 (6개월)
    longTerm: string[]; // 장기 (1년+)
  };
  
  // 💰 투자 효과 예측
  investmentAnalysis: {
    estimatedInvestment: string;
    expectedReturn: string;
    paybackPeriod: string;
    riskLevel: string;
    successProbability: number;
  };
}

/**
 * 🚀 개선된 진단평가 엔진 v3.0
 * - 5점 척도 → 100점 기준 표준화
 * - 카테고리별 Gap 분석 체계
 * - 일관된 점수 계산 알고리즘
 * - 종합 진단 보고서 생성
 */

// ===== 📊 평가 카테고리 정의 =====
export interface EvaluationCategory {
  id: string;
  name: string;
  weight: number; // 가중치 (총합 1.0)
  targetScore: number; // 목표 점수 (5점 기준)
  benchmarkScore: number; // 업계 평균 (5점 기준)
  items: EvaluationItem[];
}

export interface EvaluationItem {
  id: string;
  name: string;
  question: string;
  currentScore: number | null; // 현재 점수 (1-5점)
  targetScore: number; // 목표 점수 (5점)
  importance: 'HIGH' | 'MEDIUM' | 'LOW'; // 중요도
}

// ===== 📋 레벨업 시트 기반 평가 카테고리 구조 =====
export const EVALUATION_CATEGORIES: EvaluationCategory[] = [
  {
    id: 'productService',
    name: '상품/서비스 관리 역량',
    weight: 0.25, // 25%
    targetScore: 4.0,
    benchmarkScore: 3.2,
    items: [
      {
        id: 'planning_level',
        name: '기획 수준',
        question: '주력 상품과 서비스의 구성이 확고하며 주기적으로 개선하고 있는가?',
        currentScore: null,
        targetScore: 4.0,
        importance: 'HIGH'
      },
      {
        id: 'differentiation_level',
        name: '차별화 정도',
        question: '동종업계 대비 차별화되며 모방이 어려운가?',
        currentScore: null,
        targetScore: 4.0,
        importance: 'HIGH'
      },
      {
        id: 'pricing_level',
        name: '가격 설정의 적절성',
        question: '경쟁업체 분석을 통해 가격 설정이 적절히 되어 있는가?',
        currentScore: null,
        targetScore: 3.5,
        importance: 'MEDIUM'
      },
      {
        id: 'expertise_level',
        name: '전문성 및 기술력',
        question: '관련 전문성과 기술력을 보유하고 있는가?',
        currentScore: null,
        targetScore: 4.0,
        importance: 'HIGH'
      },
      {
        id: 'quality_level',
        name: '품질 관리',
        question: '품질이 균일하며 지속적으로 개선하고 있는가?',
        currentScore: null,
        targetScore: 4.5,
        importance: 'HIGH'
      }
    ]
  },
  {
    id: 'customerService',
    name: '고객응대 역량',
    weight: 0.20, // 20%
    targetScore: 3.8,
    benchmarkScore: 3.0,
    items: [
      {
        id: 'customer_greeting',
        name: '고객맞이',
        question: '직원들의 용모와 복장을 주기적으로 관리하는가?',
        currentScore: null,
        targetScore: 4.0,
        importance: 'MEDIUM'
      },
      {
        id: 'customer_service',
        name: '고객 응대',
        question: '매뉴얼과 교육을 통해 원활한 고객응대를 하는가?',
        currentScore: null,
        targetScore: 4.0,
        importance: 'HIGH'
      },
      {
        id: 'complaint_management',
        name: '고객 불만관리',
        question: '불만사항에 대한 체계적 관리 시스템이 있는가?',
        currentScore: null,
        targetScore: 3.5,
        importance: 'HIGH'
      },
      {
        id: 'customer_retention',
        name: '고객 유지',
        question: '고객 유지와 관리를 위한 방안을 수행하고 있는가?',
        currentScore: null,
        targetScore: 3.5,
        importance: 'HIGH'
      }
    ]
  },
  {
    id: 'marketing',
    name: '마케팅 역량',
    weight: 0.25, // 25%
    targetScore: 3.6,
    benchmarkScore: 2.8,
    items: [
      {
        id: 'customer_understanding',
        name: '고객 특성 이해',
        question: '고객 특성과 시장 트렌드를 주기적으로 파악하는가?',
        currentScore: null,
        targetScore: 4.0,
        importance: 'HIGH'
      },
      {
        id: 'marketing_planning',
        name: '마케팅 및 홍보 계획',
        question: '구체적인 마케팅 실행방안을 가지고 있는가?',
        currentScore: null,
        targetScore: 3.5,
        importance: 'HIGH'
      },
      {
        id: 'offline_marketing',
        name: '오프라인 마케팅',
        question: '판촉행사를 정기적으로 표준화하여 운영하는가?',
        currentScore: null,
        targetScore: 3.0,
        importance: 'MEDIUM'
      },
      {
        id: 'online_marketing',
        name: '온라인 마케팅',
        question: '온라인 마케팅을 통한 매출 증대가 이루어지는가?',
        currentScore: null,
        targetScore: 4.0,
        importance: 'HIGH'
      },
      {
        id: 'sales_strategy',
        name: '판매 전략',
        question: '다양한 판매 채널별 전략을 구성하고 있는가?',
        currentScore: null,
        targetScore: 3.5,
        importance: 'MEDIUM'
      }
    ]
  },
  {
    id: 'procurement',
    name: '구매 및 재고관리',
    weight: 0.15, // 15%
    targetScore: 3.5,
    benchmarkScore: 3.0,
    items: [
      {
        id: 'purchase_management',
        name: '구매관리',
        question: '원재료/설비 구매를 체계적으로 관리하는가?',
        currentScore: null,
        targetScore: 3.5,
        importance: 'MEDIUM'
      },
      {
        id: 'inventory_management',
        name: '재고관리',
        question: '계획을 바탕으로 적정 재고를 유지하는가?',
        currentScore: null,
        targetScore: 3.5,
        importance: 'MEDIUM'
      }
    ]
  },
  {
    id: 'storeManagement',
    name: '매장관리 역량',
    weight: 0.15, // 15%
    targetScore: 3.8,
    benchmarkScore: 3.2,
    items: [
      {
        id: 'exterior_management',
        name: '외관 관리',
        question: '매장 간판과 디자인이 효과적으로 어필하는가?',
        currentScore: null,
        targetScore: 3.5,
        importance: 'MEDIUM'
      },
      {
        id: 'interior_management',
        name: '인테리어 관리',
        question: '인테리어가 컨셉과 일치하며 편의시설을 갖추었는가?',
        currentScore: null,
        targetScore: 3.5,
        importance: 'MEDIUM'
      },
      {
        id: 'cleanliness',
        name: '청결도',
        question: '내/외부가 청결하며 주기적 청소를 하는가?',
        currentScore: null,
        targetScore: 4.0,
        importance: 'HIGH'
      },
      {
        id: 'work_flow',
        name: '작업 동선',
        question: '효율적 작업공간과 고객 소통이 가능한가?',
        currentScore: null,
        targetScore: 3.5,
        importance: 'MEDIUM'
      }
    ]
  }
];

// ===== 📊 진단 결과 인터페이스 =====
export interface DiagnosisResult {
  totalScore: number; // 100점 기준 총점
  categoryResults: CategoryResult[];
  gapAnalysis: GapAnalysis;
  recommendedActions: RecommendedAction[];
  overallGrade: string; // S, A, B, C, D
  reliabilityScore: number; // 평가 신뢰도 (%)
  comparisonMetrics: ComparisonMetrics;
}

export interface CategoryResult {
  categoryId: string;
  categoryName: string;
  currentScore: number; // 5점 기준
  targetScore: number; // 5점 기준
  benchmarkScore: number; // 업계 평균 (5점 기준)
  score100: number; // 100점 기준 점수
  weight: number;
  itemResults: ItemResult[];
  strengths: string[];
  weaknesses: string[];
  gapScore: number; // 목표 대비 격차
}

export interface ItemResult {
  itemId: string;
  itemName: string;
  currentScore: number | null;
  targetScore: number;
  gap: number; // 목표 대비 격차
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
}

export interface GapAnalysis {
  overallGap: number; // 전체 격차 점수
  categoryGaps: Array<{
    categoryName: string;
    gap: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    improvementPotential: number; // 개선 가능성 (%)
  }>;
  criticalIssues: string[]; // 중요 개선 사항
  quickWins: string[]; // 빠른 개선 가능 항목
}

export interface RecommendedAction {
  title: string;
  description: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  timeframe: string; // "1-2개월", "3-6개월" 등
  expectedImpact: string; // "점수 향상 예상: +15점"
  implementationCost: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ComparisonMetrics {
  industryPercentile: number; // 업계 상위 몇 %
  competitivePosition: string; // "우수", "평균", "개선필요"
  growthPotential: number; // 성장 잠재력 점수
}

// ===== 🎯 핵심 진단평가 엔진 클래스 =====
export class EnhancedDiagnosisEngine {
  private categories: EvaluationCategory[];

  constructor() {
    this.categories = JSON.parse(JSON.stringify(EVALUATION_CATEGORIES)); // 깊은 복사
  }

  /**
   * 📊 진단 데이터 입력 및 점수 계산
   */
  public evaluate(inputData: Record<string, any>): DiagnosisResult {
    console.log('🚀 진단평가 엔진 시작 - Enhanced v3.0');
    console.log('📥 입력 데이터:', Object.keys(inputData).filter(key => 
      inputData[key] !== undefined && inputData[key] !== null && inputData[key] !== ''
    ).reduce((obj, key) => ({ ...obj, [key]: inputData[key] }), {}));
    
    // 1. 입력 데이터를 카테고리별로 매핑
    this.mapInputDataToCategories(inputData);
    
    // 2. 카테고리별 점수 계산
    const categoryResults = this.calculateCategoryResults();
    console.log('📊 카테고리별 점수 계산 결과:', categoryResults.map(cat => ({
      name: cat.categoryName,
      currentScore: cat.currentScore,
      score100: cat.score100,
      weight: cat.weight,
      validItems: cat.itemResults.filter(item => item.currentScore !== null).length,
      totalItems: cat.itemResults.length
    })));
    
    // 3. 전체 점수 계산 (가중평균)
    const totalScore = this.calculateTotalScore(categoryResults);
    console.log('🎯 전체 점수 계산:', {
      totalScore,
      validCategories: categoryResults.filter(c => 
        c.itemResults.some(item => item.currentScore !== null)
      ).length,
      calculation: categoryResults.filter(c => 
        c.itemResults.some(item => item.currentScore !== null)
      ).map(cat => ({
        name: cat.categoryName,
        score100: cat.score100,
        weight: cat.weight,
        contribution: cat.score100 * cat.weight
      }))
    });
    
    // 4. Gap 분석 수행
    const gapAnalysis = this.performGapAnalysis(categoryResults);
    
    // 5. 추천 액션 생성
    const recommendedActions = this.generateRecommendedActions(categoryResults, gapAnalysis);
    
    // 6. 비교 지표 계산
    const comparisonMetrics = this.calculateComparisonMetrics(totalScore, categoryResults);
    
    const result: DiagnosisResult = {
      totalScore: Math.round(totalScore),
      categoryResults,
      gapAnalysis,
      recommendedActions,
      overallGrade: this.calculateGrade(totalScore),
      reliabilityScore: this.calculateReliabilityScore(categoryResults),
      comparisonMetrics
    };

    console.log('✅ 진단평가 완료:', {
      totalScore: result.totalScore,
      grade: result.overallGrade,
      reliability: result.reliabilityScore,
      categoriesEvaluated: categoryResults.filter(c => c.itemResults.some(i => i.currentScore !== null)).length
    });

    return result;
  }

  /**
   * 📥 입력 데이터를 카테고리별 구조로 매핑
   */
  private mapInputDataToCategories(inputData: Record<string, any>): void {
    this.categories.forEach(category => {
      category.items.forEach(item => {
        const value = inputData[item.id];
        if (value !== undefined && value !== null && value !== '') {
          const numericValue = typeof value === 'string' ? parseInt(value) : value;
          if (numericValue >= 1 && numericValue <= 5) {
            item.currentScore = numericValue;
          }
        }
      });
    });
  }

  /**
   * 📊 카테고리별 결과 계산
   */
  private calculateCategoryResults(): CategoryResult[] {
    return this.categories.map(category => {
      const itemResults = this.calculateItemResults(category.items);
      const validItems = itemResults.filter(item => item.currentScore !== null);
      
      // 카테고리 평균 점수 (5점 기준)
      const currentScore = validItems.length > 0 
        ? validItems.reduce((sum, item) => sum + (item.currentScore || 0), 0) / validItems.length
        : 0;
      
      // 100점 기준 점수 (5점 만점을 100점으로 환산)
      const score100 = (currentScore / 5) * 100;
      
      // Gap 점수 (목표 대비 부족한 점수)
      const gapScore = Math.max(0, category.targetScore - currentScore);
      
      // 강점/약점 분석
      const strengths = this.identifyStrengths(itemResults, category.benchmarkScore);
      const weaknesses = this.identifyWeaknesses(itemResults, category.targetScore);

      return {
        categoryId: category.id,
        categoryName: category.name,
        currentScore: Math.round(currentScore * 10) / 10, // 소수점 1자리
        targetScore: category.targetScore,
        benchmarkScore: category.benchmarkScore,
        score100: Math.round(score100),
        weight: category.weight,
        itemResults,
        strengths,
        weaknesses,
        gapScore: Math.round(gapScore * 10) / 10
      };
    });
  }

  /**
   * 📝 개별 항목 결과 계산
   */
  private calculateItemResults(items: EvaluationItem[]): ItemResult[] {
    return items.map(item => {
      const gap = item.currentScore !== null 
        ? Math.max(0, item.targetScore - item.currentScore)
        : item.targetScore;
      
      const recommendation = this.generateItemRecommendation(item, gap);

      return {
        itemId: item.id,
        itemName: item.name,
        currentScore: item.currentScore,
        targetScore: item.targetScore,
        gap: Math.round(gap * 10) / 10,
        priority: this.calculateItemPriority(gap, item.importance),
        recommendation
      };
    });
  }

  /**
   * 🔍 강점 식별
   */
  private identifyStrengths(itemResults: ItemResult[], benchmarkScore: number): string[] {
    return itemResults
      .filter(item => item.currentScore !== null && item.currentScore >= benchmarkScore + 0.5)
      .map(item => `${item.itemName}: ${item.currentScore}점 (업계평균 대비 우수)`)
      .slice(0, 3); // 상위 3개만
  }

  /**
   * ⚠️ 약점 식별
   */
  private identifyWeaknesses(itemResults: ItemResult[], targetScore: number): string[] {
    return itemResults
      .filter(item => item.currentScore !== null && item.gap >= 1.0)
      .sort((a, b) => b.gap - a.gap)
      .map(item => `${item.itemName}: ${item.currentScore}점 (목표 ${item.targetScore}점 대비 -${item.gap}점)`)
      .slice(0, 3); // 상위 3개만
  }

  /**
   * 🎯 전체 점수 계산 (가중평균)
   */
  private calculateTotalScore(categoryResults: CategoryResult[]): number {
    const validCategories = categoryResults.filter(c => 
      c.itemResults.some(item => item.currentScore !== null)
    );
    
    if (validCategories.length === 0) return 0;
    
    // 선택된 카테고리들의 가중치 재계산
    const totalWeight = validCategories.reduce((sum, cat) => sum + cat.weight, 0);
    
    const weightedSum = validCategories.reduce((sum, cat) => {
      const normalizedWeight = cat.weight / totalWeight;
      return sum + (cat.score100 * normalizedWeight);
    }, 0);
    
    return weightedSum;
  }

  /**
   * 📈 Gap 분석 수행
   */
  private performGapAnalysis(categoryResults: CategoryResult[]): GapAnalysis {
    const categoryGaps = categoryResults.map(cat => ({
      categoryName: cat.categoryName,
      gap: cat.gapScore,
      priority: cat.gapScore >= 1.5 ? 'HIGH' : cat.gapScore >= 0.8 ? 'MEDIUM' : 'LOW' as 'HIGH' | 'MEDIUM' | 'LOW',
      improvementPotential: Math.min(100, Math.round((cat.gapScore / cat.targetScore) * 100))
    }));

    const overallGap = categoryGaps.reduce((sum, cat) => sum + cat.gap, 0) / categoryGaps.length;

    const criticalIssues = categoryResults
      .filter(cat => cat.gapScore >= 1.5)
      .map(cat => `${cat.categoryName}: 목표 대비 ${cat.gapScore}점 부족`)
      .slice(0, 3);

    const quickWins = categoryResults
      .flatMap(cat => cat.itemResults)
      .filter(item => item.gap > 0 && item.gap <= 1.0 && item.priority !== 'LOW')
      .map(item => `${item.itemName} 개선 (${item.gap}점 향상 가능)`)
      .slice(0, 3);

    return {
      overallGap: Math.round(overallGap * 10) / 10,
      categoryGaps,
      criticalIssues,
      quickWins
    };
  }

  /**
   * 💡 추천 액션 생성
   */
  private generateRecommendedActions(categoryResults: CategoryResult[], gapAnalysis: GapAnalysis): RecommendedAction[] {
    const actions: RecommendedAction[] = [];

    // 우선순위 높은 카테고리별 액션
    categoryResults
      .filter(cat => cat.gapScore >= 1.0)
      .sort((a, b) => b.gapScore - a.gapScore)
      .slice(0, 3)
      .forEach(cat => {
        const action = this.generateCategoryAction(cat);
        if (action) actions.push(action);
      });

    // 빠른 개선 가능 항목
    gapAnalysis.quickWins.forEach(quickWin => {
      actions.push({
        title: `빠른 개선: ${quickWin}`,
        description: '즉시 적용 가능한 개선 방안으로 단기간 내 성과 확인 가능',
        category: '즉시개선',
        priority: 'MEDIUM',
        timeframe: '1-2주',
        expectedImpact: '점수 향상 예상: +3-5점',
        implementationCost: 'LOW'
      });
    });

    return actions.slice(0, 5); // 최대 5개 액션
  }

  /**
   * 🏢 카테고리별 액션 생성
   */
  private generateCategoryAction(categoryResult: CategoryResult): RecommendedAction | null {
    const actionMap: Record<string, RecommendedAction> = {
      productService: {
        title: '상품/서비스 전략 고도화',
        description: 'BM ZEN 사업분석을 통한 차별화 전략 수립 및 품질 시스템 구축',
        category: '상품/서비스',
        priority: 'HIGH',
        timeframe: '2-3개월',
        expectedImpact: `점수 향상 예상: +${Math.round(categoryResult.gapScore * 4)}점`,
        implementationCost: 'MEDIUM'
      },
      customerService: {
        title: '고객응대 시스템 구축',
        description: '고객 응대 매뉴얼 개발 및 직원 교육 프로그램 운영',
        category: '고객서비스',
        priority: 'HIGH',
        timeframe: '1-2개월',
        expectedImpact: `점수 향상 예상: +${Math.round(categoryResult.gapScore * 4)}점`,
        implementationCost: 'LOW'
      },
      marketing: {
        title: '마케팅 디지털화 전략',
        description: '온라인 마케팅 체계 구축 및 고객 데이터 분석 시스템 도입',
        category: '마케팅',
        priority: 'HIGH',
        timeframe: '2-4개월',
        expectedImpact: `점수 향상 예상: +${Math.round(categoryResult.gapScore * 4)}점`,
        implementationCost: 'MEDIUM'
      },
      procurement: {
        title: '구매/재고 최적화',
        description: '스마트 재고관리 시스템 도입 및 구매 프로세스 표준화',
        category: '운영관리',
        priority: 'MEDIUM',
        timeframe: '1-3개월',
        expectedImpact: `점수 향상 예상: +${Math.round(categoryResult.gapScore * 4)}점`,
        implementationCost: 'MEDIUM'
      },
      storeManagement: {
        title: '매장 환경 개선',
        description: '고객 경험 중심의 매장 레이아웃 개선 및 청결 관리 시스템 구축',
        category: '매장관리',
        priority: 'MEDIUM',
        timeframe: '1-2개월',
        expectedImpact: `점수 향상 예상: +${Math.round(categoryResult.gapScore * 4)}점`,
        implementationCost: 'LOW'
      }
    };

    return actionMap[categoryResult.categoryId] || null;
  }

  /**
   * 📝 개별 항목 추천사항 생성
   */
  private generateItemRecommendation(item: EvaluationItem, gap: number): string {
    if (gap <= 0.5) return '현재 수준 유지 및 지속적 모니터링 필요';
    if (gap <= 1.0) return '소폭 개선 필요 - 체크리스트 활용한 점검 체계 구축';
    if (gap <= 2.0) return '중간 수준 개선 필요 - 교육 및 시스템 도입 검토';
    return '대폭 개선 필요 - 전문 컨설팅 및 시스템 구축 권장';
  }

  /**
   * 🎯 항목별 우선순위 계산
   */
  private calculateItemPriority(gap: number, importance: string): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (importance === 'HIGH' && gap >= 1.5) return 'HIGH';
    if (importance === 'HIGH' && gap >= 1.0) return 'MEDIUM';
    if (gap >= 2.0) return 'HIGH';
    if (gap >= 1.0) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * 🏆 전체 등급 계산
   */
  private calculateGrade(totalScore: number): string {
    if (totalScore >= 90) return 'S';
    if (totalScore >= 80) return 'A';
    if (totalScore >= 70) return 'B';
    if (totalScore >= 60) return 'C';
    return 'D';
  }

  /**
   * 📊 평가 신뢰도 계산
   */
  private calculateReliabilityScore(categoryResults: CategoryResult[]): number {
    const totalItems = categoryResults.reduce((sum, cat) => sum + cat.itemResults.length, 0);
    const answeredItems = categoryResults.reduce((sum, cat) => 
      sum + cat.itemResults.filter(item => item.currentScore !== null).length, 0
    );
    
    const completionRate = (answeredItems / totalItems) * 100;
    
    // 완성도에 따른 신뢰도 조정
    if (completionRate >= 80) return Math.round(95 + (completionRate - 80) * 0.25);
    if (completionRate >= 60) return Math.round(85 + (completionRate - 60) * 0.5);
    if (completionRate >= 40) return Math.round(70 + (completionRate - 40) * 0.75);
    return Math.round(completionRate * 1.5);
  }

  /**
   * 📈 비교 지표 계산
   */
  private calculateComparisonMetrics(totalScore: number, categoryResults: CategoryResult[]): ComparisonMetrics {
    // 업계 백분위 계산 (정규분포 가정)
    const industryPercentile = Math.min(99, Math.max(1, 
      Math.round(50 + (totalScore - 65) * 1.5)
    ));
    
    // 경쟁 포지션
    let competitivePosition = '개선필요';
    if (totalScore >= 80) competitivePosition = '우수';
    else if (totalScore >= 65) competitivePosition = '평균';
    
    // 성장 잠재력 (Gap 점수 기반)
    const avgGap = categoryResults.reduce((sum, cat) => sum + cat.gapScore, 0) / categoryResults.length;
    const growthPotential = Math.min(100, Math.round((avgGap / 2) * 40 + 60));

    return {
      industryPercentile,
      competitivePosition,
      growthPotential
    };
  }
}

// ===== 📋 진단 보고서 생성 유틸리티 =====
export class DiagnosisReportGenerator {
  /**
   * 📄 종합 진단 보고서 생성
   */
  static generateComprehensiveReport(result: DiagnosisResult, companyInfo: any): string {
    const { companyName, industry, employeeCount, businessLocation } = companyInfo;
    
    const report = `
# 🏢 ${companyName} 경영역량 진단 보고서

## 📊 진단 개요
- **회사명**: ${companyName}
- **업종**: ${industry}
- **직원수**: ${employeeCount}
- **위치**: ${businessLocation}
- **진단일**: ${new Date().toLocaleDateString('ko-KR')}

## 🎯 종합 평가 결과

### 총점: ${result.totalScore}점 (100점 기준) | 등급: ${result.overallGrade}
**신뢰도**: ${result.reliabilityScore}% | **업계 상위**: ${result.comparisonMetrics.industryPercentile}%

${this.generateScoreInterpretation(result.totalScore, result.overallGrade)}

## 📈 카테고리별 세부 분석

${result.categoryResults.map(cat => this.generateCategorySection(cat)).join('\n\n')}

## 🔍 Gap 분석 결과

### 전체 Gap 점수: ${result.gapAnalysis.overallGap}점
${this.generateGapAnalysisSection(result.gapAnalysis)}

## 💡 우선 개선 권장사항

${result.recommendedActions.map((action, idx) => 
  `### ${idx + 1}. ${action.title} (${action.priority} 우선순위)
**기간**: ${action.timeframe} | **비용**: ${action.implementationCost} | **예상효과**: ${action.expectedImpact}

${action.description}`
).join('\n\n')}

## 🚀 향후 발전 방향

### 경쟁 우위 확보 전략
- **현재 포지션**: ${result.comparisonMetrics.competitivePosition}
- **성장 잠재력**: ${result.comparisonMetrics.growthPotential}점

### 즉시 실행 가능한 개선사항
${result.gapAnalysis.quickWins.map(win => `- ${win}`).join('\n')}

### 중장기 발전 목표
${result.gapAnalysis.criticalIssues.map(issue => `- ${issue} 해결 추진`).join('\n')}

---
*본 진단은 이후경 경영지도사의 28년 노하우가 체계화된 전문 진단시스템으로 작성되었습니다.*
`;

    return report;
  }

  /**
   * 📊 점수 해석 생성
   */
  private static generateScoreInterpretation(totalScore: number, grade: string): string {
    const interpretations: Record<string, string> = {
      'S': '🏆 **우수한 경영역량**을 보유하고 있습니다. 현재 수준을 유지하며 세부적인 최적화에 집중하세요.',
      'A': '✅ **양호한 경영역량**을 갖추고 있습니다. 몇 가지 핵심 영역의 보완으로 더욱 발전할 수 있습니다.',
      'B': '🔄 **보통 수준의 경영역량**입니다. 체계적인 개선을 통해 경쟁우위를 확보할 수 있습니다.',
      'C': '⚠️ **개선이 필요한 경영역량**입니다. 우선순위를 정해 단계별 개선이 필요합니다.',
      'D': '🚨 **전면적인 개선이 필요**합니다. 전문가의 도움을 받아 체계적인 개선 계획을 수립하세요.'
    };
    
    return interpretations[grade] || '평가 등급을 확인할 수 없습니다.';
  }

  /**
   * 📊 카테고리별 섹션 생성
   */
  private static generateCategorySection(category: CategoryResult): string {
    const validItems = category.itemResults.filter(item => item.currentScore !== null);
    
    return `### ${category.categoryName}
**현재 점수**: ${category.currentScore}/5.0 (${category.score100}점) | **목표**: ${category.targetScore}/5.0 | **Gap**: ${category.gapScore}점

#### 💪 강점 항목
${category.strengths.length > 0 ? category.strengths.map(s => `- ${s}`).join('\n') : '- 분석할 강점 항목이 부족합니다.'}

#### ⚠️ 개선 필요 항목  
${category.weaknesses.length > 0 ? category.weaknesses.map(w => `- ${w}`).join('\n') : '- 특별한 개선점이 발견되지 않았습니다.'}

#### 📋 세부 항목별 현황
${validItems.map(item => 
  `- **${item.itemName}**: ${item.currentScore}점 (목표: ${item.targetScore}점, Gap: ${item.gap}점) - ${item.recommendation}`
).join('\n')}`;
  }

  /**
   * 🔍 Gap 분석 섹션 생성
   */
  private static generateGapAnalysisSection(gapAnalysis: GapAnalysis): string {
    return `
#### 🚨 중요 개선 사항
${gapAnalysis.criticalIssues.length > 0 ? 
  gapAnalysis.criticalIssues.map(issue => `- ${issue}`).join('\n') : 
  '- 중요한 개선 사항이 발견되지 않았습니다.'}

#### ⚡ 빠른 개선 가능 항목
${gapAnalysis.quickWins.length > 0 ? 
  gapAnalysis.quickWins.map(win => `- ${win}`).join('\n') : 
  '- 즉시 개선 가능한 항목이 제한적입니다.'}

#### 📊 카테고리별 개선 우선순위
${gapAnalysis.categoryGaps
  .sort((a, b) => b.gap - a.gap)
  .map(cat => `- **${cat.categoryName}**: Gap ${cat.gap}점 (${cat.priority} 우선순위, 개선가능성 ${cat.improvementPotential}%)`)
  .join('\n')}`;
  }
}

// ===== 🔧 유틸리티 함수들 =====

/**
 * 진단 데이터 검증
 */
export function validateDiagnosisData(data: Record<string, any>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields = ['companyName', 'industry', 'contactManager', 'email'];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field].trim() === '') {
      errors.push(`${field}는 필수 입력 항목입니다.`);
    }
  });
  
  // 최소 5개 항목 평가 필요
  const evaluatedItems = EVALUATION_CATEGORIES
    .flatMap(cat => cat.items)
    .filter(item => data[item.id] && parseInt(data[item.id]) >= 1 && parseInt(data[item.id]) <= 5);
  
  if (evaluatedItems.length < 5) {
    errors.push('신뢰할 수 있는 진단을 위해 최소 5개 항목을 평가해주세요.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 점수 등급 변환
 */
export function getScoreGrade(score: number): { grade: string; description: string; color: string } {
  if (score >= 90) return { grade: 'S', description: '최우수', color: '#FFD700' };
  if (score >= 80) return { grade: 'A', description: '우수', color: '#32CD32' };
  if (score >= 70) return { grade: 'B', description: '양호', color: '#1E90FF' };
  if (score >= 60) return { grade: 'C', description: '보통', color: '#FFA500' };
  return { grade: 'D', description: '개선필요', color: '#FF6B6B' };
}

/**
 * 업종별 벤치마크 조정
 */
export function adjustBenchmarkByIndustry(industry: string): Record<string, number> {
  const industryAdjustments: Record<string, Record<string, number>> = {
    'manufacturing': {
      productService: 3.4,
      customerService: 2.8,
      marketing: 2.6,
      procurement: 3.2,
      storeManagement: 3.0
    },
    'it': {
      productService: 3.6,
      customerService: 3.2,
      marketing: 3.4,
      procurement: 2.8,
      storeManagement: 2.6
    },
    'service': {
      productService: 3.2,
      customerService: 3.6,
      marketing: 3.0,
      procurement: 2.6,
      storeManagement: 3.4
    },
    'retail': {
      productService: 3.0,
      customerService: 3.4,
      marketing: 3.2,
      procurement: 3.0,
      storeManagement: 3.8
    }
  };
  
  return industryAdjustments[industry] || {
    productService: 3.2,
    customerService: 3.0,
    marketing: 2.8,
    procurement: 3.0,
    storeManagement: 3.2
  };
} 