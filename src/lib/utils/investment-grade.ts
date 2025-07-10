import type { InvestmentResult } from './investment-analysis';

// 투자 등급 인터페이스
export interface InvestmentGrade {
  grade: string;
  score: number;
  recommendation: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gradeDesc: string;
  details: {
    npvScore: number;
    irrScore: number;
    dscrScore: number;
    paybackScore: number;
  };
  // 🚀 고도화 추가 필드 (5구간)
  investmentScale: 'mega' | 'large' | 'medium' | 'small' | 'micro';
  riskPremium: number;
  adjustedScore: number;
}

// 📊 투자규모별 분류 및 리스크 프리미엄 계산 (5구간 체계) - 🔥 사용자 요구사항 반영
export const getInvestmentScaleInfo = (initialInvestment: number) => {
  const investmentInBillion = initialInvestment;
  
  if (investmentInBillion >= 100) {
    return {
      scale: 'mega' as const,
      riskPremium: 0.12, // 🔥 12% 리스크 프리미엄 (사용자 요구사항)
      description: '메가 투자 (100억원 이상)',
      minIRR: 20, // 최소 IRR 20% 요구
      minDSCR: 3.0, // 최소 DSCR 3.0 요구
      maxPayback: 3.5 // 최대 회수기간 3.5년
    };
  } else if (investmentInBillion >= 75) {
    return {
      scale: 'large' as const,
      riskPremium: 0.08, // 🔥 8% 리스크 프리미엄 (사용자 요구사항)
      description: '대규모 투자 (75-100억원)',
      minIRR: 18, // 최소 IRR 18% 요구
      minDSCR: 2.5, // 최소 DSCR 2.5 요구
      maxPayback: 4 // 최대 회수기간 4년
    };
  } else if (investmentInBillion >= 50) {
    return {
      scale: 'medium' as const,
      riskPremium: 0.05, // 🔥 5% 리스크 프리미엄 (사용자 요구사항)
      description: '중규모 투자 (50-75억원)',
      minIRR: 15, // 최소 IRR 15% 요구
      minDSCR: 2.0, // 최소 DSCR 2.0 요구
      maxPayback: 5 // 최대 회수기간 5년
    };
  } else if (investmentInBillion >= 25) {
    return {
      scale: 'small' as const,
      riskPremium: 0.03, // 🔥 3% 리스크 프리미엄 (사용자 요구사항)
      description: '소규모 투자 (25-50억원)',
      minIRR: 12, // 최소 IRR 12% 요구
      minDSCR: 1.5, // 최소 DSCR 1.5 요구
      maxPayback: 6 // 최대 회수기간 6년
    };
  } else {
    return {
      scale: 'micro' as const,
      riskPremium: 0.02, // 🔥 2% 리스크 프리미엄 (사용자 요구사항)
      description: '마이크로 투자 (25억원 미만)',
      minIRR: 10, // 최소 IRR 10% 요구
      minDSCR: 1.25, // 최소 DSCR 1.25 요구
      maxPayback: 8 // 최대 회수기간 8년
    };
  }
};

// 📌 평균 DSCR 계산 헬퍼 (분석기간 총 영업이익 ÷ 총 부채상환액)
export const calculateAverageDSCR = (result: InvestmentResult | null): number => {
  if (!result) return 0;

  // dscrData 우선 사용 (연도별 원시데이터 보유) - 요구사항에 맞는 계산 방식
  if (result.dscrData && result.dscrData.length > 0) {
    const totalOperatingProfit = result.dscrData.reduce((acc, d) => acc + (d.operatingProfit || 0), 0);
    const totalDebtService = result.dscrData.reduce((acc, d) => acc + (d.totalDebtService || 0), 0);
    
    // 🔥 요구사항: 분석기간 전체 연도별 영업이익 합계 ÷ 분석기간 전체 연도별 부채상환액 합계
    const avgDSCR = totalDebtService > 0 ? totalOperatingProfit / totalDebtService : 0;
    
    return avgDSCR;
  }

  // 폴백: 기존 dscr 배열이 있으면 평균 사용 (비권장 - 요구사항과 다름)
  if (result.dscr && result.dscr.length > 0) {
    const simpleMean = result.dscr.reduce((a, b) => a + b, 0) / result.dscr.length;
    return simpleMean;
  }

  return 0;
};

// 🚀 투자규모별 동적 점수 구간 생성 (5구간 체계) - 🔥 사용자 요구사항 반영
export const getDynamicGradingCriteria = (investmentScale: 'mega' | 'large' | 'medium' | 'small' | 'micro', discountRate: number = 10) => {
  const baseWeight = {
    npv: 30,
    irr: 25,
    dscr: 25,
    payback: 20
  };

  // 투자규모별 가중치 조정
  const scaleAdjustment = {
    mega: { npv: 1.3, irr: 1.2, dscr: 1.4, payback: 0.9 },   // 메가: NPV, DSCR 최대 중시
    large: { npv: 1.2, irr: 1.1, dscr: 1.3, payback: 1.0 },  // 대규모: NPV, DSCR 중시
    medium: { npv: 1.0, irr: 1.0, dscr: 1.0, payback: 1.0 }, // 중규모: 균형
    small: { npv: 0.8, irr: 1.2, dscr: 0.9, payback: 1.1 },  // 소규모: IRR, 회수기간 중시
    micro: { npv: 0.7, irr: 1.3, dscr: 0.8, payback: 1.2 }   // 마이크로: IRR, 회수기간 최대 중시
  };

  const adjustment = scaleAdjustment[investmentScale];
  
  return {
    npv: {
      title: 'NPV (순현재가치)',
      weight: Math.round(baseWeight.npv * adjustment.npv),
      ranges: investmentScale === 'mega' ? [
        { min: 200, max: 999, score: 40, desc: '200억원 이상 (40점)' },
        { min: 150, max: 200, score: 35, desc: '150~200억원 (35점)' },
        { min: 100, max: 150, score: 30, desc: '100~150억원 (30점)' },
        { min: 80, max: 100, score: 25, desc: '80~100억원 (25점)' },
        { min: 50, max: 80, score: 20, desc: '50~80억원 (20점)' },
        { min: -999, max: 50, score: 0, desc: '50억원 미만 (0점)' }
      ] : investmentScale === 'large' ? [
        { min: 120, max: 999, score: 36, desc: '120억원 이상 (36점)' },
        { min: 100, max: 120, score: 32, desc: '100~120억원 (32점)' },
        { min: 80, max: 100, score: 28, desc: '80~100억원 (28점)' },
        { min: 60, max: 80, score: 24, desc: '60~80억원 (24점)' },
        { min: 40, max: 60, score: 18, desc: '40~60억원 (18점)' },
        { min: -999, max: 40, score: 0, desc: '40억원 미만 (0점)' }
      ] : investmentScale === 'medium' ? [
        { min: 80, max: 999, score: 30, desc: '80억원 이상 (30점)' },
        { min: 60, max: 80, score: 26, desc: '60~80억원 (26점)' },
        { min: 40, max: 60, score: 22, desc: '40~60억원 (22점)' },
        { min: 30, max: 40, score: 18, desc: '30~40억원 (18점)' },
        { min: 20, max: 30, score: 12, desc: '20~30억원 (12점)' },
        { min: -999, max: 20, score: 0, desc: '20억원 미만 (0점)' }
      ] : investmentScale === 'small' ? [
        { min: 40, max: 999, score: 25, desc: '40억원 이상 (25점)' },
        { min: 30, max: 40, score: 22, desc: '30~40억원 (22점)' },
        { min: 20, max: 30, score: 18, desc: '20~30억원 (18점)' },
        { min: 15, max: 20, score: 15, desc: '15~20억원 (15점)' },
        { min: 10, max: 15, score: 10, desc: '10~15억원 (10점)' },
        { min: -999, max: 10, score: 0, desc: '10억원 미만 (0점)' }
      ] : [
        { min: 20, max: 999, score: 22, desc: '20억원 이상 (22점)' },
        { min: 15, max: 20, score: 19, desc: '15~20억원 (19점)' },
        { min: 10, max: 15, score: 16, desc: '10~15억원 (16점)' },
        { min: 8, max: 10, score: 12, desc: '8~10억원 (12점)' },
        { min: 5, max: 8, score: 8, desc: '5~8억원 (8점)' },
        { min: -999, max: 5, score: 0, desc: '5억원 미만 (0점)' }
      ]
    },
    irr: {
      title: 'IRR (내부수익률) - 할인율 대비 상대평가',
      weight: Math.round(baseWeight.irr * adjustment.irr),
      // 🔥 사용자 요구사항: IRR 점수체계를 할인율 대비 상대적 점수체계로 변경 (리스크프리미엄 제외)
      ranges: (() => {
        const baseDiscountRate = discountRate; // 할인율 기준 (리스크프리미엄 제외)
        const maxScore = Math.round(baseWeight.irr * adjustment.irr);
        
        return [
          { min: baseDiscountRate + 15, max: 999, score: maxScore, desc: `할인율+15%p 이상 (${maxScore}점)` },
          { min: baseDiscountRate + 10, max: baseDiscountRate + 15, score: Math.round(maxScore * 0.9), desc: `할인율+10~15%p (${Math.round(maxScore * 0.9)}점)` },
          { min: baseDiscountRate + 5, max: baseDiscountRate + 10, score: Math.round(maxScore * 0.75), desc: `할인율+5~10%p (${Math.round(maxScore * 0.75)}점)` },
          { min: baseDiscountRate + 2, max: baseDiscountRate + 5, score: Math.round(maxScore * 0.6), desc: `할인율+2~5%p (${Math.round(maxScore * 0.6)}점)` },
          { min: baseDiscountRate, max: baseDiscountRate + 2, score: Math.round(maxScore * 0.4), desc: `할인율~+2%p (${Math.round(maxScore * 0.4)}점)` },
          { min: 0, max: baseDiscountRate, score: 0, desc: `할인율 미만 (0점)` }
        ];
      })()
    },
    dscr: {
      title: 'DSCR (부채상환능력) - 1.25 중간점수 기준',
      weight: Math.round(baseWeight.dscr * adjustment.dscr),
      // 🔥 사용자 요구사항: DSCR 점수체계를 1.25 중간점수로 개선 (리스크프리미엄 제외)
      ranges: (() => {
        const maxScore = Math.round(baseWeight.dscr * adjustment.dscr);
        const midScore = Math.round(maxScore * 0.5); // 1.25에서 중간점수
        
        return [
          { min: 3.0, max: 999, score: maxScore, desc: `3.0 이상 (${maxScore}점) - 금융권 최우수` },
          { min: 2.5, max: 3.0, score: Math.round(maxScore * 0.9), desc: `2.5~3.0 (${Math.round(maxScore * 0.9)}점) - 금융권 우수` },
          { min: 2.0, max: 2.5, score: Math.round(maxScore * 0.8), desc: `2.0~2.5 (${Math.round(maxScore * 0.8)}점) - 금융권 양호` },
          { min: 1.5, max: 2.0, score: Math.round(maxScore * 0.7), desc: `1.5~2.0 (${Math.round(maxScore * 0.7)}점) - 금융권 보통` },
          { min: 1.25, max: 1.5, score: midScore, desc: `1.25~1.5 (${midScore}점) - 금융권 안정권 (중간점수)` },
          { min: 1.0, max: 1.25, score: Math.round(maxScore * 0.3), desc: `1.0~1.25 (${Math.round(maxScore * 0.3)}점) - 주의 필요` },
          { min: 0, max: 1.0, score: 0, desc: `1.0 미만 (0점) - 위험` }
        ];
      })()
    },
    payback: {
      title: '회수기간 (Payback Period) - 7~8년 기준',
      weight: Math.round(baseWeight.payback * adjustment.payback),
      // 🔥 사용자 요구사항: 투자회수기간을 7~8년 기준으로 조정
      ranges: (() => {
        const maxScore = Math.round(baseWeight.payback * adjustment.payback);
        const standardPeriod = 7.5; // 7~8년 중간값
        
        return [
          { min: 0, max: 3, score: maxScore, desc: `3년 이하 (${maxScore}점) - 매우 빠름` },
          { min: 3, max: 5, score: Math.round(maxScore * 0.9), desc: `3~5년 (${Math.round(maxScore * 0.9)}점) - 빠름` },
          { min: 5, max: 7, score: Math.round(maxScore * 0.8), desc: `5~7년 (${Math.round(maxScore * 0.8)}점) - 양호` },
          { min: 7, max: 8, score: Math.round(maxScore * 0.7), desc: `7~8년 (${Math.round(maxScore * 0.7)}점) - 보통 (기준)` },
          { min: 8, max: 10, score: Math.round(maxScore * 0.5), desc: `8~10년 (${Math.round(maxScore * 0.5)}점) - 느림` },
          { min: 10, max: 15, score: Math.round(maxScore * 0.3), desc: `10~15년 (${Math.round(maxScore * 0.3)}점) - 매우 느림` },
          { min: 15, max: 999, score: 0, desc: `15년 초과 (0점) - 부적합` }
        ];
      })()
    }
  };
};

// 📊 투자등급 점수 구간 상세 정보 (호환성 유지용)
export const getGradingCriteria = () => {
  return getDynamicGradingCriteria('medium'); // 기본값으로 중규모 기준 반환
};

// 🚀 고도화된 통합 투자 등급 계산 함수 - 🔥 사용자 요구사항 반영
export function calculateInvestmentGrade(result: InvestmentResult | null, initialInvestment: number = 35, discountRate: number = 10): InvestmentGrade {
  if (!result) {
    return {
      grade: 'D급',
      score: 0,
      recommendation: '분석 필요',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      gradeDesc: '투자 분석이 필요합니다',
      details: {
        npvScore: 0,
        irrScore: 0,
        dscrScore: 0,
        paybackScore: 0
      },
      investmentScale: 'micro',
      riskPremium: 0,
      adjustedScore: 0
    };
  }

  // 투자규모 정보 획득
  const scaleInfo = getInvestmentScaleInfo(initialInvestment);
  const criteria = getDynamicGradingCriteria(scaleInfo.scale, discountRate);

  let score = 0;
  let details = {
    npvScore: 0,
    irrScore: 0,
    dscrScore: 0,
    paybackScore: 0
  };
  
  // NPV 평가 - 투자규모별 동적 기준 적용
  const npvInBillion = result.npv / 100000000;
  const npvRanges = criteria.npv.ranges;
  for (const range of npvRanges) {
    if (npvInBillion >= range.min && npvInBillion < range.max) {
      details.npvScore = range.score;
      score += range.score;
      break;
    }
  }
  
  // 🔥 IRR 평가 - 할인율 대비 상대평가 (리스크프리미엄 제외)
  const irrRanges = criteria.irr.ranges;
  for (const range of irrRanges) {
    if (result.irr >= range.min && result.irr < range.max) {
      details.irrScore = range.score;
      score += range.score;
      break;
    }
  }
  
  // 🔥 DSCR 평가 - 1.25 중간점수 기준 (리스크프리미엄 제외)
  const avgDSCR = calculateAverageDSCR(result);
  const dscrRanges = criteria.dscr.ranges;
  for (const range of dscrRanges) {
    if (avgDSCR >= range.min && avgDSCR < range.max) {
      details.dscrScore = range.score;
      score += range.score;
      break;
    }
  }
  
  // 🔥 회수기간 평가 - 7~8년 기준
  const paybackRanges = criteria.payback.ranges;
  for (const range of paybackRanges) {
    if (result.paybackPeriod >= range.min && result.paybackPeriod < range.max) {
      details.paybackScore = range.score;
      score += range.score;
      break;
    }
  }

  // 🚀 리스크 프리미엄 적용한 조정 점수 계산 (사용자 요구사항 반영)
  const riskAdjustment = 1 - scaleInfo.riskPremium;
  const adjustedScore = Math.round(score * riskAdjustment);
  
  // 등급 결정 - 조정된 점수 기준
  let grade = 'D급';
  let color = 'text-red-600';
  let bgColor = 'bg-red-50';
  let borderColor = 'border-red-200';
  let gradeDesc = '';
  let recommendation = '';
  
  // 투자규모별 등급 기준 차등화 (5구간)
  const gradeThresholds = {
    mega: { AA: 98, A: 90, B: 80, C: 70 },    // 메가: 최고 엄격 기준
    large: { AA: 95, A: 85, B: 75, C: 65 },   // 대규모: 엄격 기준
    medium: { AA: 90, A: 80, B: 70, C: 60 },  // 중규모: 표준 기준
    small: { AA: 85, A: 75, B: 65, C: 55 },   // 소규모: 완화 기준
    micro: { AA: 80, A: 70, B: 60, C: 50 }    // 마이크로: 최대 완화 기준
  };
  
  const thresholds = gradeThresholds[scaleInfo.scale];
  
  if (adjustedScore >= thresholds.AA) { 
    grade = 'AA급'; 
    color = 'text-emerald-600'; 
    bgColor = 'bg-emerald-50'; 
    borderColor = 'border-emerald-200';
    gradeDesc = `최우수 ${scaleInfo.description} - 할인율 대비 우수한 IRR, DSCR 1.25 이상 안정권`;
    recommendation = '적극 투자 권장';
  }
  else if (adjustedScore >= thresholds.A) { 
    grade = 'A급'; 
    color = 'text-blue-600'; 
    bgColor = 'bg-blue-50'; 
    borderColor = 'border-blue-200';
    gradeDesc = `우수 ${scaleInfo.description} - 할인율 대비 양호한 IRR, DSCR 금융권 기준 충족`;
    recommendation = '투자 권장';
  }
  else if (adjustedScore >= thresholds.B) { 
    grade = 'B급'; 
    color = 'text-yellow-600'; 
    bgColor = 'bg-yellow-50'; 
    borderColor = 'border-yellow-200';
    gradeDesc = `보통 ${scaleInfo.description} - 할인율 근접 IRR, 회수기간 7-8년 기준 양호`;
    recommendation = '신중한 투자';
  }
  else if (adjustedScore >= thresholds.C) { 
    grade = 'C급'; 
    color = 'text-orange-600'; 
    bgColor = 'bg-orange-50'; 
    borderColor = 'border-orange-200';
    gradeDesc = `주의 ${scaleInfo.description} - 할인율 미달 IRR, DSCR 1.25 미만 위험권`;
    recommendation = '주의 필요';
  }
  else {
    gradeDesc = `투자 부적합 ${scaleInfo.description} - 모든 지표가 기준 미달, 사업계획 재검토 필요`;
    recommendation = '투자 비권장';
  }
  
  return {
    grade,
    score,
    recommendation,
    color,
    bgColor,
    borderColor,
    gradeDesc,
    details,
    investmentScale: scaleInfo.scale,
    riskPremium: scaleInfo.riskPremium,
    adjustedScore
  };
}

// 🚀 투자등급별 상세 권고의견 생성 함수 (리스크 프리미엄 반영)
export function generateDetailedRecommendation(
  result: InvestmentResult | null, 
  grade: InvestmentGrade,
  initialInvestment: number = 35
): {
  positiveFactors: string[];
  riskFactors: string[];
  recommendation: string;
  actionPlan: string[];
  scaleAnalysis: string;
} {
  if (!result) {
    return {
      positiveFactors: ['분석 데이터 부족'],
      riskFactors: ['투자 분석 필요'],
      recommendation: '투자 정보를 입력하여 정밀 분석을 진행하시기 바랍니다.',
      actionPlan: ['투자 정보 입력', '분석 실행'],
      scaleAnalysis: '투자규모 분석 불가'
    };
  }

  const scaleInfo = getInvestmentScaleInfo(initialInvestment);
  const avgDSCR = calculateAverageDSCR(result);

  const scaleAnalysis = `
    📊 투자규모 분석: ${scaleInfo.description}
    • 리스크 프리미엄: ${(scaleInfo.riskPremium * 100).toFixed(1)}%
    • 최소 IRR 요구: ${scaleInfo.minIRR}%
    • 최소 DSCR 요구: ${scaleInfo.minDSCR}
    • 최대 회수기간: ${scaleInfo.maxPayback}년
    • 조정 전 점수: ${grade.score}점 → 조정 후 점수: ${grade.adjustedScore}점
  `;

  switch (grade.grade) {
    case 'AA급':
      return {
        positiveFactors: [
          `NPV ${(result.npv / 100000000).toFixed(1)}억원으로 ${scaleInfo.scale === 'large' ? '대규모' : scaleInfo.scale === 'medium' ? '중규모' : '소규모'} 투자 대비 매우 우수한 수익성`,
          `IRR ${result.irr.toFixed(1)}%로 ${scaleInfo.description} 최소 요구 수준(${scaleInfo.minIRR}%) 크게 상회`,
          `DSCR ${avgDSCR.toFixed(2)}로 ${scaleInfo.description} 최소 요구 수준(${scaleInfo.minDSCR}) 초과 달성`,
          `${result.paybackPeriod.toFixed(1)}년의 빠른 투자회수로 ${scaleInfo.description} 기준 완벽 충족`,
          `리스크 프리미엄 ${(scaleInfo.riskPremium * 100).toFixed(1)}% 적용 후에도 최상위 등급 유지`
        ],
        riskFactors: [
          `${scaleInfo.scale === 'large' ? '대규모 투자 특성상 시장 변동성에 높은 민감도' : ''}`,
          '과도한 낙관적 전망에 따른 계획 수정 가능성',
          '시장 변화에 따른 수익성 변동 리스크',
          '경쟁사 진입에 따른 시장점유율 감소 우려'
        ].filter(Boolean),
        recommendation: `AA급 최우수 ${scaleInfo.description} 투자안으로 즉시 투자 실행을 강력 권장합니다. 리스크 프리미엄을 감안한 조정 후에도 모든 재무지표가 최상위권을 기록하고 있습니다.`,
        actionPlan: [
          '즉시 투자 실행 및 정책자금 신청',
          `${scaleInfo.scale === 'large' ? '대규모 투자 전담 TF 구성' : '프로젝트 관리체계 구축'}`,
          '분기별 성과 모니터링 시스템 도입',
          '추가 투자 기회 발굴을 위한 시장 조사',
          `${scaleInfo.scale === 'large' ? '리스크 관리 전문팀 운영' : '리스크 관리 계획 수립'}`
        ],
        scaleAnalysis
      };

    case 'A급':
      return {
        positiveFactors: [
          `NPV ${(result.npv / 100000000).toFixed(1)}억원으로 ${scaleInfo.description} 대비 우수한 투자 수익성`,
          `IRR ${result.irr.toFixed(1)}%로 ${scaleInfo.description} 최소 기준(${scaleInfo.minIRR}%) 상회`,
          `DSCR ${avgDSCR.toFixed(2)}로 ${scaleInfo.description} 요구 수준 충족`,
          `${result.paybackPeriod.toFixed(1)}년의 합리적인 투자회수기간`,
          `리스크 프리미엄 ${(scaleInfo.riskPremium * 100).toFixed(1)}% 반영 후에도 우수 등급 유지`
        ],
        riskFactors: [
          `${scaleInfo.scale === 'large' ? '대규모 투자 리스크 관리 필요' : ''}`,
          '매출 성장률 둔화에 따른 수익성 하락 가능성',
          'DSCR 변동에 따른 현금흐름 관리 필요',
          '원자재 가격 상승 등 비용 인상 요인'
        ].filter(Boolean),
        recommendation: `A급 우량 ${scaleInfo.description} 투자안으로 적극적인 투자를 권장합니다. 투자규모별 리스크 프리미엄을 고려한 평가에서도 견고한 재무구조를 보여줍니다.`,
        actionPlan: [
          '투자 승인 및 정책자금 신청 진행',
          `${scaleInfo.scale === 'large' ? '대규모 투자 리스크 관리 체계 구축' : '리스크 관리 계획 수립'}`,
          '월별 재무성과 모니터링',
          '비용 관리 체계 강화',
          `${scaleInfo.scale === 'small' ? '소규모 투자 효율성 극대화 방안 수립' : ''}`
        ].filter(Boolean),
        scaleAnalysis
      };

    case 'B급':
      return {
        positiveFactors: [
          `NPV ${(result.npv / 100000000).toFixed(1)}억원으로 ${scaleInfo.description} 기준 양의 투자가치`,
          `IRR ${result.irr.toFixed(1)}%로 ${scaleInfo.description} 최소 기준 근접`,
          `${result.paybackPeriod.toFixed(1)}년의 투자회수 가능성`,
          '정책자금 활용으로 금융비용 절감 효과'
        ],
        riskFactors: [
          `${scaleInfo.scale === 'large' ? '대규모 투자 대비 상대적으로 낮은 수익성' : ''}`,
          `DSCR ${avgDSCR.toFixed(2)}로 ${scaleInfo.description} 요구 수준(${scaleInfo.minDSCR}) 미달`,
          '시장 변동에 따른 수익성 민감도 높음',
          '운전자본 관리 및 현금흐름 최적화 필요',
          `리스크 프리미엄 ${(scaleInfo.riskPremium * 100).toFixed(1)}% 적용 시 등급 하락 위험`
        ].filter(Boolean),
        recommendation: `B급 신중검토 ${scaleInfo.description} 투자안으로 리스크 관리 방안을 마련한 후 투자를 권장합니다. 투자규모별 리스크를 고려할 때 세밀한 실행계획이 필요합니다.`,
        actionPlan: [
          `${scaleInfo.scale === 'large' ? '대규모 투자 타당성 재검토' : '리스크 평가 및 대응방안 수립'}`,
          '현금흐름 관리 계획 강화',
          '시나리오별 대응전략 마련',
          '분기별 성과 점검 및 계획 조정',
          `${scaleInfo.scale === 'small' ? '소규모 투자 장점 극대화 방안 모색' : ''}`
        ].filter(Boolean),
        scaleAnalysis
      };

    case 'C급':
      return {
        positiveFactors: [
          `IRR ${result.irr.toFixed(1)}%로 최소 수익성 확보`,
          '정책자금 지원을 통한 자금조달 가능',
          `${scaleInfo.scale === 'small' ? '소규모 투자 특성상 상대적 리스크 완화' : '장기적 관점에서 투자가치 잠재력 보유'}`
        ],
        riskFactors: [
          `NPV ${(result.npv / 100000000).toFixed(1)}억원으로 ${scaleInfo.description} 대비 낮은 투자수익성`,
          `DSCR ${avgDSCR.toFixed(2)}로 ${scaleInfo.description} 요구 수준 크게 미달`,
          `${result.paybackPeriod.toFixed(1)}년으로 ${scaleInfo.description} 최대 기준(${scaleInfo.maxPayback}년) 초과`,
          `리스크 프리미엄 ${(scaleInfo.riskPremium * 100).toFixed(1)}% 적용 시 투자 매력도 크게 감소`,
          '현금흐름 관리의 어려움 예상'
        ],
        recommendation: `C급 주의필요 ${scaleInfo.description} 투자안으로 투자 조건 개선 후 재검토를 권장합니다. 투자규모별 리스크를 고려할 때 현재 상태로는 투자 리스크가 높습니다.`,
        actionPlan: [
          '사업계획 전면 재검토 및 수정',
          `${scaleInfo.scale === 'large' ? '투자 규모 축소 검토' : '수익성 개선 방안 도출'}`,
          '자금조달 구조 최적화',
          '단계적 투자 검토',
          `${scaleInfo.scale === 'small' ? '소규모 투자 최적화 전략 수립' : ''}`
        ].filter(Boolean),
        scaleAnalysis
      };

    case 'D급':
      return {
        positiveFactors: [
          '정책자금 지원 가능성',
          `${scaleInfo.scale === 'small' ? '소규모 투자 특성상 손실 규모 제한적' : '장기적 시장 성장 가능성'}`
        ],
        riskFactors: [
          `NPV ${(result.npv / 100000000).toFixed(1)}억원으로 ${scaleInfo.description} 투자가치 심각히 미흡`,
          `IRR ${result.irr.toFixed(1)}%로 ${scaleInfo.description} 최소 기준(${scaleInfo.minIRR}%) 크게 미달`,
          `DSCR ${avgDSCR.toFixed(2)}로 부채상환 위험 매우 높음`,
          `리스크 프리미엄 ${(scaleInfo.riskPremium * 100).toFixed(1)}% 적용 시 투자 부적합 확정`,
          '투자 손실 가능성 매우 높음'
        ],
        recommendation: `D급 투자부적합 ${scaleInfo.description} 판정으로 현 상태에서는 투자를 권하지 않습니다. 투자규모별 리스크를 고려할 때 사업모델 전면 재구성이 필요합니다.`,
        actionPlan: [
          '사업모델 전면 재검토',
          `${scaleInfo.scale === 'large' ? '투자 규모 대폭 축소 또는 단계적 접근' : '투자 조건 근본적 개선'}`,
          '대안 투자 기회 탐색',
          '전문가 컨설팅 실시',
          `${scaleInfo.scale === 'small' ? '소규모 시범 사업 검토' : '투자 철회 고려'}`
        ].filter(Boolean),
        scaleAnalysis
      };

    default:
      return {
        positiveFactors: ['분석 진행 중'],
        riskFactors: ['추가 분석 필요'],
        recommendation: '투자등급 분석을 완료한 후 상세한 권고의견을 제공하겠습니다.',
        actionPlan: ['분석 완료 대기'],
        scaleAnalysis
      };
  }
} 