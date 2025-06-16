import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DiagnosisData {
  companyName: string;
  industry: string;
  companySize: string;
  establishedYear: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  position: string;
  businessModel: string;
  mainProducts: string;
  targetMarket: string;
  annualRevenue: string;
  mainChallenges: string[];
  urgentIssues: string;
  businessGoals: string[];
  expectedOutcome: string;
  hasCompetitorAnalysis: boolean;
  hasTechnologyInfrastructure: boolean;
  hasMarketingStrategy: boolean;
  additionalInfo?: string;
}

export interface DiagnosisResults {
  id: string;
  companyName: string;
  createdAt: string;
  overallScore: number;
  marketPosition: string;
  competitiveness: string;
  industryGrowth: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    category: string;
    priority: string;
    action: string;
    timeline: string;
  }>;
  detailedAnalysis: {
    businessModel: { score: number; feedback: string };
    market: { score: number; feedback: string };
    operation: { score: number; feedback: string };
  };
}

interface DiagnosisStore {
  // Current diagnosis session
  currentDiagnosis: DiagnosisData | null;
  currentResults: DiagnosisResults | null;
  
  // History of diagnoses
  diagnosisHistory: DiagnosisResults[];
  
  // UI state
  isProcessing: boolean;
  currentStep: number;
  
  // Actions
  setCurrentDiagnosis: (data: DiagnosisData) => void;
  setCurrentResults: (results: DiagnosisResults) => void;
  addToHistory: (results: DiagnosisResults) => void;
  clearCurrentSession: () => void;
  setProcessing: (isProcessing: boolean) => void;
  setCurrentStep: (step: number) => void;
  
  // Getters
  getHistoryByCompany: (companyName: string) => DiagnosisResults[];
  getLatestDiagnosis: () => DiagnosisResults | null;
}

export const useDiagnosisStore = create<DiagnosisStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentDiagnosis: null,
      currentResults: null,
      diagnosisHistory: [],
      isProcessing: false,
      currentStep: 0,
      
      // Actions
      setCurrentDiagnosis: (data: DiagnosisData) => {
        set({ currentDiagnosis: data });
      },
      
      setCurrentResults: (results: DiagnosisResults) => {
        set({ currentResults: results });
      },
      
      addToHistory: (results: DiagnosisResults) => {
        set((state) => ({
          diagnosisHistory: [results, ...state.diagnosisHistory].slice(0, 50) // Keep last 50 diagnoses
        }));
      },
      
      clearCurrentSession: () => {
        set({
          currentDiagnosis: null,
          currentResults: null,
          currentStep: 0,
          isProcessing: false
        });
      },
      
      setProcessing: (isProcessing: boolean) => {
        set({ isProcessing });
      },
      
      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },
      
      // Getters
      getHistoryByCompany: (companyName: string) => {
        return get().diagnosisHistory.filter(
          (diagnosis) => diagnosis.companyName.toLowerCase().includes(companyName.toLowerCase())
        );
      },
      
      getLatestDiagnosis: () => {
        const history = get().diagnosisHistory;
        return history.length > 0 ? history[0] : null;
      }
    }),
    {
      name: 'diagnosis-store',
      // Only persist diagnosis history, not current session
      partialize: (state) => ({
        diagnosisHistory: state.diagnosisHistory
      })
    }
  )
);

// Diagnosis processing utility functions
export class DiagnosisProcessor {
  static generateResults(data: DiagnosisData): DiagnosisResults {
    const id = `diagnosis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    
    // 방어적 코딩: undefined 배열 필드들을 빈 배열로 초기화
    const safeData = {
      ...data,
      mainChallenges: data.mainChallenges || [],
      businessGoals: data.businessGoals || []
    };
    
    // Industry-specific insights
    const industryInsights = this.getIndustryInsights(safeData.industry);
    const companySizeScore = this.getCompanySizeScore(safeData.companySize);
    const revenueScore = this.getRevenueScore(safeData.annualRevenue);
    
    // Calculate overall score
    const overallScore = Math.round(
      (industryInsights.growthPotential * 0.3 + 
       companySizeScore * 0.25 + 
       revenueScore * 0.25 + 
       (safeData.hasCompetitorAnalysis ? 80 : 60) * 0.1 +
       (safeData.hasTechnologyInfrastructure ? 85 : 65) * 0.1) * 
      (safeData.mainChallenges.length <= 3 ? 1 : 0.9)
    );
    
    // Analyze strengths and weaknesses
    const { strengths, weaknesses } = this.analyzeStrengthsWeaknesses(safeData, {
      companySizeScore,
      revenueScore
    });
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(safeData);
    
    return {
      id,
      companyName: safeData.companyName,
      createdAt,
      overallScore,
      marketPosition: overallScore >= 80 ? '우수' : overallScore >= 60 ? '양호' : '개선 필요',
      competitiveness: industryInsights.competitionLevel,
      industryGrowth: industryInsights.growthPotential,
      strengths,
      weaknesses,
      recommendations,
      detailedAnalysis: {
        businessModel: {
          score: safeData.businessModel === 'saas' ? 85 : safeData.businessModel === 'marketplace' ? 80 : 70,
          feedback: '현재 비즈니스 모델은 시장 트렌드에 적합하며 확장 가능성이 높습니다.'
        },
        market: {
          score: 75,
          feedback: '목표 시장에 대한 이해도가 높으며 성장 가능성이 확인됩니다.'
        },
        operation: {
          score: companySizeScore,
          feedback: '조직 규모와 운영 체계가 현재 사업 단계에 적합합니다.'
        }
      }
    };
  }
  
  private static getIndustryInsights(industry: string) {
    const insights: Record<string, any> = {
      'manufacturing': {
        growthPotential: 75,
        competitionLevel: '높음',
        keyFactors: ['자동화', '품질관리', '공급망 최적화']
      },
      'technology': {
        growthPotential: 85,
        competitionLevel: '매우 높음',
        keyFactors: ['혁신', '스케일링', '사용자 경험']
      },
      'retail': {
        growthPotential: 60,
        competitionLevel: '높음',
        keyFactors: ['옴니채널', '고객 서비스', '재고 관리']
      },
      'healthcare': {
        growthPotential: 80,
        competitionLevel: '보통',
        keyFactors: ['규제 준수', '혁신', '환자 중심']
      },
      'finance': {
        growthPotential: 70,
        competitionLevel: '높음',
        keyFactors: ['디지털화', '보안', '고객 신뢰']
      },
      'education': {
        growthPotential: 75,
        competitionLevel: '보통',
        keyFactors: ['디지털 전환', '콘텐츠 품질', '접근성']
      },
      'consulting': {
        growthPotential: 65,
        competitionLevel: '높음',
        keyFactors: ['전문성', '네트워크', '결과 중심']
      }
    };
    return insights[industry] || {
      growthPotential: 65,
      competitionLevel: '보통',
      keyFactors: ['운영 효율성', '고객 만족', '혁신']
    };
  }
  
  private static getCompanySizeScore(size: string): number {
    const sizeScores: Record<string, number> = {
      '1-10': 60,
      '11-50': 70,
      '51-200': 80,
      '201-1000': 85,
      '1000+': 90
    };
    return sizeScores[size] || 65;
  }
  
  private static getRevenueScore(revenue: string): number {
    const revenueScores: Record<string, number> = {
      'startup': 40,
      'under-100m': 50,
      '100m-1b': 65,
      '1b-10b': 75,
      '10b-100b': 85,
      'over-100b': 90
    };
    return revenueScores[revenue] || 60;
  }
  
  private static analyzeStrengthsWeaknesses(
    data: DiagnosisData, 
    scores: { companySizeScore: number; revenueScore: number }
  ) {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // 방어적 코딩: 배열 필드들을 안전하게 처리
    const mainChallenges = data.mainChallenges || [];
    const businessGoals = data.businessGoals || [];
    
    // Strengths analysis
    if (scores.revenueScore >= 75) strengths.push('안정적인 매출 기반 구축');
    if (scores.companySizeScore >= 80) strengths.push('효율적인 조직 규모');
    if (data.hasCompetitorAnalysis) strengths.push('체계적인 경쟁 분석 역량');
    if (data.hasTechnologyInfrastructure) strengths.push('견고한 기술 인프라');
    if (data.hasMarketingStrategy) strengths.push('전략적 마케팅 계획');
    
    // Add more sophisticated strengths based on business goals
    if (businessGoals.includes('매출 성장 및 수익성 개선')) {
      strengths.push('명확한 성장 목표 설정');
    }
    if (businessGoals.includes('디지털 혁신 및 자동화')) {
      strengths.push('디지털 전환에 대한 높은 의지');
    }
    
    // Weaknesses analysis
    if (mainChallenges.includes('매출 성장 정체')) weaknesses.push('매출 성장 동력 부족');
    if (mainChallenges.includes('고객 확보 어려움')) weaknesses.push('신규 고객 확보 전략 미흡');
    if (mainChallenges.includes('디지털 전환 필요')) weaknesses.push('디지털 전환 지연');
    if (mainChallenges.includes('경쟁사 대비 경쟁력 부족')) weaknesses.push('차별화 전략 부족');
    if (!data.hasCompetitorAnalysis) weaknesses.push('경쟁 환경 분석 부족');
    if (!data.hasTechnologyInfrastructure) weaknesses.push('기술 인프라 투자 필요');
    if (!data.hasMarketingStrategy) weaknesses.push('통합 마케팅 전략 부재');
    
    return { strengths, weaknesses };
  }
  
  private static generateRecommendations(data: DiagnosisData) {
    const recommendations: Array<{
      category: string;
      priority: string;
      action: string;
      timeline: string;
    }> = [];
    
    // 방어적 코딩: 배열 필드들을 안전하게 처리
    const mainChallenges = data.mainChallenges || [];
    
    // Revenue growth recommendations
    if (mainChallenges.includes('매출 성장 정체')) {
      recommendations.push({
        category: '매출 성장',
        priority: '높음',
        action: '신규 시장 진출 및 기존 고객 심화 전략 수립, 업셀링/크로스셀링 프로세스 구축',
        timeline: '3개월'
      });
    }
    
    // Digital transformation recommendations
    if (mainChallenges.includes('디지털 전환 필요')) {
      recommendations.push({
        category: '디지털 전환',
        priority: '높음',
        action: '핵심 업무 프로세스 디지털화, 고객 접점 디지털 채널 구축, 데이터 분석 시스템 도입',
        timeline: '6개월'
      });
    }
    
    // Customer acquisition recommendations
    if (mainChallenges.includes('고객 확보 어려움')) {
      recommendations.push({
        category: '고객 확보',
        priority: '높음',
        action: '타겟 고객 페르소나 재정의, 맞춤형 마케팅 캠페인 실행, 고객 추천 시스템 구축',
        timeline: '4개월'
      });
    }
    
    // Marketing strategy recommendations
    if (!data.hasMarketingStrategy) {
      recommendations.push({
        category: '마케팅 전략',
        priority: '보통',
        action: '브랜드 포지셔닝 재정립, 통합 마케팅 커뮤니케이션 전략 수립, 성과 측정 KPI 설정',
        timeline: '2개월'
      });
    }
    
    // Competitive analysis recommendations
    if (!data.hasCompetitorAnalysis) {
      recommendations.push({
        category: '경쟁 분석',
        priority: '보통',
        action: '주요 경쟁사 벤치마킹, 시장 내 포지셔닝 분석, 차별화 요소 발굴 및 강화',
        timeline: '1개월'
      });
    }
    
    // Technology infrastructure recommendations
    if (!data.hasTechnologyInfrastructure) {
      recommendations.push({
        category: '기술 인프라',
        priority: '보통',
        action: '클라우드 기반 시스템 구축, 보안 체계 강화, 확장 가능한 아키텍처 설계',
        timeline: '5개월'
      });
    }
    
    // Operational efficiency recommendations
    if (mainChallenges.includes('운영 효율성 개선 필요')) {
      recommendations.push({
        category: '운영 최적화',
        priority: '보통',
        action: '업무 프로세스 표준화, 자동화 도구 도입, 성과 관리 체계 구축',
        timeline: '4개월'
      });
    }
    
    return recommendations;
  }
} 