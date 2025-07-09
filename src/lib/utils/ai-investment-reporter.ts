// AI 종합 평가 및 투자 추천 의견 작성 엔진
import { InvestmentResult, InvestmentInput } from './investment-analysis';

// 투자 지표별 평가 등급 정의
export interface MetricGrade {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  score: number; // 100점 만점
  description: string;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

// 전체 투자 평가 결과
export interface InvestmentEvaluation {
  overallGrade: MetricGrade;
  recommendation: '강력추천' | '추천' | '조건부추천' | '보류' | '비추천';
  confidence: number; // 신뢰도 (0-100)
  
  // 지표별 평가
  metrics: {
    npv: MetricGrade & { value: number; unit: string };
    irr: MetricGrade & { value: number; unit: string };
    dscr: MetricGrade & { value: number; unit: string };
    discountedPayback: MetricGrade & { value: number; unit: string };
    roi: MetricGrade & { value: number; unit: string };
    profitabilityIndex: MetricGrade & { value: number; unit: string };
    riskAdjustedReturn: MetricGrade & { value: number; unit: string };
    economicValueAdded: MetricGrade & { value: number; unit: string };
  };
  
  // 종합 의견
  summary: {
    strengths: string[]; // 강점
    weaknesses: string[]; // 약점
    risks: string[]; // 위험 요인
    opportunities: string[]; // 기회 요인
  };
  
  // 상세 분석 의견
  detailedAnalysis: string;
  
  // 개선 제안
  recommendations: string[];
}

// 지표 오류 진단 결과
export interface DiagnosticResult {
  hasErrors: boolean;
  errors: string[];
  warnings: string[];
  fixes: string[];
}

// NPV 평가 기준
function evaluateNPV(npv: number, initialInvestment: number): MetricGrade {
  const npvRatio = npv / initialInvestment;
  
  if (npvRatio >= 0.5) {
    return {
      grade: 'A+',
      score: 95,
      description: '매우 우수한 순현재가치로 투자 수익성이 탁월합니다.',
      status: 'excellent'
    };
  } else if (npvRatio >= 0.3) {
    return {
      grade: 'A',
      score: 85,
      description: '우수한 순현재가치로 투자 수익성이 양호합니다.',
      status: 'excellent'
    };
  } else if (npvRatio >= 0.1) {
    return {
      grade: 'B+',
      score: 75,
      description: '양호한 순현재가치로 투자 타당성이 인정됩니다.',
      status: 'good'
    };
  } else if (npvRatio >= 0) {
    return {
      grade: 'B',
      score: 65,
      description: '양의 순현재가치로 최소한의 투자 타당성이 있습니다.',
      status: 'good'
    };
  } else if (npvRatio >= -0.1) {
    return {
      grade: 'C+',
      score: 55,
      description: '소폭 음의 순현재가치로 투자 검토가 필요합니다.',
      status: 'fair'
    };
  } else if (npvRatio >= -0.3) {
    return {
      grade: 'C',
      score: 45,
      description: '음의 순현재가치로 투자 위험이 높습니다.',
      status: 'poor'
    };
  } else {
    return {
      grade: 'D',
      score: 25,
      description: '큰 손실이 예상되어 투자를 권하지 않습니다.',
      status: 'critical'
    };
  }
}

// IRR 평가 기준
function evaluateIRR(irr: number, discountRate: number): MetricGrade {
  const spread = irr - discountRate;
  
  if (spread >= 20) {
    return {
      grade: 'A+',
      score: 95,
      description: '매우 높은 내부수익률로 투자 수익성이 탁월합니다.',
      status: 'excellent'
    };
  } else if (spread >= 15) {
    return {
      grade: 'A',
      score: 85,
      description: '높은 내부수익률로 투자 수익성이 우수합니다.',
      status: 'excellent'
    };
  } else if (spread >= 10) {
    return {
      grade: 'B+',
      score: 75,
      description: '양호한 내부수익률로 투자 타당성이 인정됩니다.',
      status: 'good'
    };
  } else if (spread >= 5) {
    return {
      grade: 'B',
      score: 65,
      description: '적정한 내부수익률로 투자 검토가 가능합니다.',
      status: 'good'
    };
  } else if (spread >= 0) {
    return {
      grade: 'C+',
      score: 55,
      description: '할인율 수준의 내부수익률로 신중한 검토가 필요합니다.',
      status: 'fair'
    };
  } else if (spread >= -5) {
    return {
      grade: 'C',
      score: 45,
      description: '할인율 미달의 내부수익률로 투자 위험이 높습니다.',
      status: 'poor'
    };
  } else {
    return {
      grade: 'D',
      score: 25,
      description: '낮은 내부수익률로 투자를 권하지 않습니다.',
      status: 'critical'
    };
  }
}

// DSCR 평가 기준
function evaluateDSCR(avgDSCR: number): MetricGrade {
  if (avgDSCR >= 2.0) {
    return {
      grade: 'A+',
      score: 95,
      description: '매우 안정적인 부채상환능력으로 재무 안정성이 탁월합니다.',
      status: 'excellent'
    };
  } else if (avgDSCR >= 1.5) {
    return {
      grade: 'A',
      score: 85,
      description: '안정적인 부채상환능력으로 재무 안정성이 우수합니다.',
      status: 'excellent'
    };
  } else if (avgDSCR >= 1.25) {
    return {
      grade: 'B+',
      score: 75,
      description: '양호한 부채상환능력으로 재무 안정성이 인정됩니다.',
      status: 'good'
    };
  } else if (avgDSCR >= 1.0) {
    return {
      grade: 'B',
      score: 65,
      description: '최소한의 부채상환능력으로 신중한 관리가 필요합니다.',
      status: 'good'
    };
  } else if (avgDSCR >= 0.8) {
    return {
      grade: 'C+',
      score: 55,
      description: '부채상환능력 부족으로 재무구조 개선이 필요합니다.',
      status: 'fair'
    };
  } else if (avgDSCR >= 0.6) {
    return {
      grade: 'C',
      score: 45,
      description: '심각한 부채상환능력 부족으로 재무 위험이 높습니다.',
      status: 'poor'
    };
  } else {
    return {
      grade: 'D',
      score: 25,
      description: '부채상환 불가능 수준으로 투자를 권하지 않습니다.',
      status: 'critical'
    };
  }
}

// 할인회수기간 평가 기준
function evaluateDiscountedPayback(payback: number, analysisYears: number): MetricGrade {
  const paybackRatio = payback / analysisYears;
  
  if (payback <= 0 || payback > analysisYears) {
    return {
      grade: 'F',
      score: 0,
      description: '분석기간 내 투자금 회수가 불가능합니다.',
      status: 'critical'
    };
  } else if (paybackRatio <= 0.3) {
    return {
      grade: 'A+',
      score: 95,
      description: '매우 빠른 투자금 회수로 유동성이 탁월합니다.',
      status: 'excellent'
    };
  } else if (paybackRatio <= 0.4) {
    return {
      grade: 'A',
      score: 85,
      description: '빠른 투자금 회수로 유동성이 우수합니다.',
      status: 'excellent'
    };
  } else if (paybackRatio <= 0.5) {
    return {
      grade: 'B+',
      score: 75,
      description: '적절한 투자금 회수 기간으로 유동성이 양호합니다.',
      status: 'good'
    };
  } else if (paybackRatio <= 0.7) {
    return {
      grade: 'B',
      score: 65,
      description: '다소 긴 투자금 회수 기간으로 유동성 검토가 필요합니다.',
      status: 'good'
    };
  } else if (paybackRatio <= 0.8) {
    return {
      grade: 'C+',
      score: 55,
      description: '긴 투자금 회수 기간으로 유동성 위험이 있습니다.',
      status: 'fair'
    };
  } else {
    return {
      grade: 'C',
      score: 45,
      description: '매우 긴 투자금 회수 기간으로 유동성 위험이 높습니다.',
      status: 'poor'
    };
  }
}

// ROI 평가 기준
function evaluateROI(roi: number): MetricGrade {
  if (roi >= 50) {
    return {
      grade: 'A+',
      score: 95,
      description: '매우 높은 투자수익률로 수익성이 탁월합니다.',
      status: 'excellent'
    };
  } else if (roi >= 30) {
    return {
      grade: 'A',
      score: 85,
      description: '높은 투자수익률로 수익성이 우수합니다.',
      status: 'excellent'
    };
  } else if (roi >= 20) {
    return {
      grade: 'B+',
      score: 75,
      description: '양호한 투자수익률로 수익성이 인정됩니다.',
      status: 'good'
    };
  } else if (roi >= 10) {
    return {
      grade: 'B',
      score: 65,
      description: '적정한 투자수익률로 수익성이 있습니다.',
      status: 'good'
    };
  } else if (roi >= 0) {
    return {
      grade: 'C+',
      score: 55,
      description: '낮은 투자수익률로 수익성 개선이 필요합니다.',
      status: 'fair'
    };
  } else if (roi >= -10) {
    return {
      grade: 'C',
      score: 45,
      description: '음의 투자수익률로 손실이 예상됩니다.',
      status: 'poor'
    };
  } else {
    return {
      grade: 'D',
      score: 25,
      description: '큰 손실이 예상되어 투자를 권하지 않습니다.',
      status: 'critical'
    };
  }
}

// 수익성지수(PI) 평가 기준
function evaluateProfitabilityIndex(pi: number): MetricGrade {
  if (pi >= 1.5) {
    return {
      grade: 'A+',
      score: 95,
      description: '매우 높은 수익성지수로 투자 효율성이 탁월합니다.',
      status: 'excellent'
    };
  } else if (pi >= 1.3) {
    return {
      grade: 'A',
      score: 85,
      description: '높은 수익성지수로 투자 효율성이 우수합니다.',
      status: 'excellent'
    };
  } else if (pi >= 1.2) {
    return {
      grade: 'B+',
      score: 75,
      description: '양호한 수익성지수로 투자 효율성이 인정됩니다.',
      status: 'good'
    };
  } else if (pi >= 1.1) {
    return {
      grade: 'B',
      score: 65,
      description: '적정한 수익성지수로 투자 타당성이 있습니다.',
      status: 'good'
    };
  } else if (pi >= 1.0) {
    return {
      grade: 'C+',
      score: 55,
      description: '임계 수준의 수익성지수로 신중한 검토가 필요합니다.',
      status: 'fair'
    };
  } else if (pi >= 0.9) {
    return {
      grade: 'C',
      score: 45,
      description: '낮은 수익성지수로 투자 위험이 높습니다.',
      status: 'poor'
    };
  } else {
    return {
      grade: 'D',
      score: 25,
      description: '매우 낮은 수익성지수로 투자를 권하지 않습니다.',
      status: 'critical'
    };
  }
}

// 위험조정수익률 평가 기준
function evaluateRiskAdjustedReturn(riskAdjustedReturn: number): MetricGrade {
  if (riskAdjustedReturn >= 15) {
    return {
      grade: 'A+',
      score: 95,
      description: '매우 높은 위험조정수익률로 위험 대비 수익성이 탁월합니다.',
      status: 'excellent'
    };
  } else if (riskAdjustedReturn >= 10) {
    return {
      grade: 'A',
      score: 85,
      description: '높은 위험조정수익률로 위험 대비 수익성이 우수합니다.',
      status: 'excellent'
    };
  } else if (riskAdjustedReturn >= 5) {
    return {
      grade: 'B+',
      score: 75,
      description: '양호한 위험조정수익률로 위험 대비 수익성이 인정됩니다.',
      status: 'good'
    };
  } else if (riskAdjustedReturn >= 0) {
    return {
      grade: 'B',
      score: 65,
      description: '적정한 위험조정수익률로 위험 대비 수익성이 있습니다.',
      status: 'good'
    };
  } else if (riskAdjustedReturn >= -5) {
    return {
      grade: 'C+',
      score: 55,
      description: '낮은 위험조정수익률로 위험 대비 수익성이 부족합니다.',
      status: 'fair'
    };
  } else if (riskAdjustedReturn >= -10) {
    return {
      grade: 'C',
      score: 45,
      description: '음의 위험조정수익률로 위험 대비 손실이 예상됩니다.',
      status: 'poor'
    };
  } else {
    return {
      grade: 'D',
      score: 25,
      description: '매우 낮은 위험조정수익률로 투자를 권하지 않습니다.',
      status: 'critical'
    };
  }
}

// 경제부가가치(EVA) 평가 기준
function evaluateEconomicValueAdded(eva: number, initialInvestment: number): MetricGrade {
  const evaRatio = eva / initialInvestment;
  
  if (evaRatio >= 0.3) {
    return {
      grade: 'A+',
      score: 95,
      description: '매우 높은 경제부가가치로 기업가치 창출이 탁월합니다.',
      status: 'excellent'
    };
  } else if (evaRatio >= 0.2) {
    return {
      grade: 'A',
      score: 85,
      description: '높은 경제부가가치로 기업가치 창출이 우수합니다.',
      status: 'excellent'
    };
  } else if (evaRatio >= 0.1) {
    return {
      grade: 'B+',
      score: 75,
      description: '양호한 경제부가가치로 기업가치 창출이 인정됩니다.',
      status: 'good'
    };
  } else if (evaRatio >= 0) {
    return {
      grade: 'B',
      score: 65,
      description: '적정한 경제부가가치로 기업가치 창출이 있습니다.',
      status: 'good'
    };
  } else if (evaRatio >= -0.1) {
    return {
      grade: 'C+',
      score: 55,
      description: '낮은 경제부가가치로 기업가치 창출이 부족합니다.',
      status: 'fair'
    };
  } else if (evaRatio >= -0.2) {
    return {
      grade: 'C',
      score: 45,
      description: '음의 경제부가가치로 기업가치 파괴가 우려됩니다.',
      status: 'poor'
    };
  } else {
    return {
      grade: 'D',
      score: 25,
      description: '매우 낮은 경제부가가치로 투자를 권하지 않습니다.',
      status: 'critical'
    };
  }
}

// 전체 평가 등급 계산
function calculateOverallGrade(metricScores: number[]): MetricGrade {
  const avgScore = metricScores.reduce((sum, score) => sum + score, 0) / metricScores.length;
  
  if (avgScore >= 90) {
    return {
      grade: 'A+',
      score: Math.round(avgScore),
      description: '모든 지표가 우수하여 투자를 강력히 추천합니다.',
      status: 'excellent'
    };
  } else if (avgScore >= 80) {
    return {
      grade: 'A',
      score: Math.round(avgScore),
      description: '대부분의 지표가 우수하여 투자를 추천합니다.',
      status: 'excellent'
    };
  } else if (avgScore >= 70) {
    return {
      grade: 'B+',
      score: Math.round(avgScore),
      description: '주요 지표가 양호하여 투자를 추천합니다.',
      status: 'good'
    };
  } else if (avgScore >= 60) {
    return {
      grade: 'B',
      score: Math.round(avgScore),
      description: '전반적으로 양호하여 조건부 투자를 추천합니다.',
      status: 'good'
    };
  } else if (avgScore >= 50) {
    return {
      grade: 'C+',
      score: Math.round(avgScore),
      description: '일부 지표에 우려가 있어 신중한 검토가 필요합니다.',
      status: 'fair'
    };
  } else if (avgScore >= 40) {
    return {
      grade: 'C',
      score: Math.round(avgScore),
      description: '여러 지표에 문제가 있어 투자를 보류하는 것이 좋습니다.',
      status: 'poor'
    };
  } else {
    return {
      grade: 'D',
      score: Math.round(avgScore),
      description: '대부분의 지표가 부적절하여 투자를 권하지 않습니다.',
      status: 'critical'
    };
  }
}

// 투자 추천 결정
function determineRecommendation(overallGrade: MetricGrade, confidence: number): '강력추천' | '추천' | '조건부추천' | '보류' | '비추천' {
  if (overallGrade.grade === 'A+' && confidence >= 85) {
    return '강력추천';
  } else if (overallGrade.grade === 'A' || (overallGrade.grade === 'A+' && confidence >= 70)) {
    return '추천';
  } else if (overallGrade.grade === 'B+' || overallGrade.grade === 'B') {
    return '조건부추천';
  } else if (overallGrade.grade === 'C+' || overallGrade.grade === 'C') {
    return '보류';
  } else {
    return '비추천';
  }
}

// 신뢰도 계산
function calculateConfidence(result: InvestmentResult, input: InvestmentInput): number {
  let confidence = 70; // 기본 신뢰도
  
  // NPV 신뢰도 (양수일 때 가산)
  if (result.npv > 0) {
    confidence += Math.min(15, (result.npv / input.initialInvestment) * 100);
  }
  
  // IRR 신뢰도 (할인율 대비 높을 때 가산)
  if (result.irr > (input.discountRate || 10)) {
    confidence += Math.min(10, result.irr - (input.discountRate || 10));
  }
  
  // DSCR 신뢰도 (1.25 이상일 때 가산)
  const avgDSCR = result.dscr.reduce((sum, dscr) => sum + dscr, 0) / result.dscr.length;
  if (avgDSCR >= 1.25) {
    confidence += Math.min(10, (avgDSCR - 1.25) * 20);
  }
  
  // 회수기간 신뢰도 (짧을수록 가산)
  if (result.paybackPeriod > 0 && result.paybackPeriod <= (input.analysisYears || 10)) {
    confidence += Math.min(5, (1 - result.paybackPeriod / (input.analysisYears || 10)) * 10);
  }
  
  return Math.min(100, Math.max(0, confidence));
}

// 강점, 약점, 위험요인, 기회요인 분석
function analyzeSWOT(metrics: any): {
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  opportunities: string[];
} {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const risks: string[] = [];
  const opportunities: string[] = [];
  
  // 강점 분석
  if (metrics.npv.status === 'excellent') {
    strengths.push('높은 순현재가치로 투자 수익성이 확보됨');
  }
  if (metrics.irr.status === 'excellent') {
    strengths.push('우수한 내부수익률로 자본 효율성이 높음');
  }
  if (metrics.dscr.status === 'excellent') {
    strengths.push('안정적인 부채상환능력으로 재무 안정성 확보');
  }
  if (metrics.discountedPayback.status === 'excellent') {
    strengths.push('빠른 투자금 회수로 유동성 리스크 최소화');
  }
  if (metrics.roi.status === 'excellent') {
    strengths.push('높은 투자수익률로 수익성 우수');
  }
  if (metrics.profitabilityIndex.status === 'excellent') {
    strengths.push('우수한 수익성지수로 투자 효율성 높음');
  }
  
  // 약점 분석
  if (metrics.npv.status === 'poor' || metrics.npv.status === 'critical') {
    weaknesses.push('낮은 순현재가치로 투자 수익성 부족');
  }
  if (metrics.irr.status === 'poor' || metrics.irr.status === 'critical') {
    weaknesses.push('낮은 내부수익률로 자본 효율성 부족');
  }
  if (metrics.dscr.status === 'poor' || metrics.dscr.status === 'critical') {
    weaknesses.push('부족한 부채상환능력으로 재무 위험 존재');
  }
  if (metrics.discountedPayback.status === 'poor' || metrics.discountedPayback.status === 'critical') {
    weaknesses.push('긴 투자금 회수기간으로 유동성 위험 존재');
  }
  
  // 위험요인 분석
  if (metrics.dscr.value < 1.25) {
    risks.push('부채상환비율이 낮아 현금흐름 부족 위험');
  }
  if (metrics.riskAdjustedReturn.value < 0) {
    risks.push('위험조정수익률이 음수로 위험 대비 수익성 부족');
  }
  if (metrics.economicValueAdded.value < 0) {
    risks.push('경제부가가치가 음수로 기업가치 파괴 우려');
  }
  
  // 기회요인 분석
  if (metrics.profitabilityIndex.value > 1.2) {
    opportunities.push('높은 수익성지수로 추가 투자 확대 기회');
  }
  if (metrics.riskAdjustedReturn.value > 10) {
    opportunities.push('우수한 위험조정수익률로 포트폴리오 확장 기회');
  }
  if (metrics.roi.value > 30) {
    opportunities.push('높은 ROI로 사업 확장 및 규모 경제 달성 기회');
  }
  
  return { strengths, weaknesses, risks, opportunities };
}

// 상세 분석 의견 생성
function generateDetailedAnalysis(
  result: InvestmentResult,
  input: InvestmentInput,
  metrics: any,
  overallGrade: MetricGrade
): string {
  const analysisYears = input.analysisYears || 10;
  const initialInvestmentBillion = (input.initialInvestment / 100000000).toFixed(1);
  const npvBillion = (result.npv / 100000000).toFixed(1);
  const avgDSCR = result.dscr.reduce((sum, dscr) => sum + dscr, 0) / result.dscr.length;
  
  return `
본 투자안에 대한 ${analysisYears}년간의 재무타당성 분석 결과, 전체 평가등급은 ${overallGrade.grade}(${overallGrade.score}점)으로 평가되었습니다.

**핵심 지표 분석:**
- 순현재가치(NPV): ${npvBillion}억원으로 ${metrics.npv.description}
- 내부수익률(IRR): ${result.irr.toFixed(1)}%로 ${metrics.irr.description}
- 부채상환비율(DSCR): 평균 ${avgDSCR.toFixed(2)}배로 ${metrics.dscr.description}
- 할인회수기간: ${result.paybackPeriod > 0 ? result.paybackPeriod.toFixed(1) + '년' : '미회수'}으로 ${metrics.discountedPayback.description}

**수익성 분석:**
초기 투자액 ${initialInvestmentBillion}억원 대비 투자수익률(ROI) ${result.roi.toFixed(1)}%, 수익성지수(PI) ${result.profitabilityIndex.toFixed(2)}로 나타났습니다. 위험조정수익률은 ${result.riskAdjustedReturn.toFixed(1)}%로 ${metrics.riskAdjustedReturn.description}

**재무 안정성 평가:**
${avgDSCR >= 1.25 ? '부채상환능력이 안정적이며' : '부채상환능력에 주의가 필요하며'}, 경제부가가치(EVA)는 ${(result.economicValueAdded / 100000000).toFixed(1)}억원으로 ${metrics.economicValueAdded.description}

**종합 의견:**
${overallGrade.description} 특히 ${metrics.npv.status === 'excellent' ? 'NPV' : metrics.irr.status === 'excellent' ? 'IRR' : metrics.dscr.status === 'excellent' ? 'DSCR' : 'ROI'} 지표가 우수하여 투자 타당성이 ${overallGrade.status === 'excellent' ? '높게' : overallGrade.status === 'good' ? '양호하게' : '제한적으로'} 평가됩니다.
  `.trim();
}

// 개선 제안 생성
function generateRecommendations(metrics: any, result: InvestmentResult, input: InvestmentInput): string[] {
  const recommendations: string[] = [];
  
  if (metrics.npv.status === 'poor' || metrics.npv.status === 'critical') {
    recommendations.push('수익성 개선을 위한 매출 증대 방안 및 비용 절감 전략 수립');
  }
  
  if (metrics.irr.status === 'poor' || metrics.irr.status === 'critical') {
    recommendations.push('내부수익률 향상을 위한 투자 효율성 개선 및 고수익 사업 확대');
  }
  
  if (metrics.dscr.status === 'poor' || metrics.dscr.status === 'critical') {
    recommendations.push('부채상환능력 개선을 위한 현금흐름 관리 및 부채구조 최적화');
  }
  
  if (metrics.discountedPayback.status === 'poor' || metrics.discountedPayback.status === 'critical') {
    recommendations.push('투자회수기간 단축을 위한 초기 수익 창출 방안 마련');
  }
  
  if (metrics.roi.status === 'poor' || metrics.roi.status === 'critical') {
    recommendations.push('투자수익률 개선을 위한 고부가가치 사업 모델 도입');
  }
  
  if (metrics.profitabilityIndex.status === 'poor' || metrics.profitabilityIndex.status === 'critical') {
    recommendations.push('투자 효율성 향상을 위한 단계별 투자 전략 검토');
  }
  
  if (metrics.riskAdjustedReturn.status === 'poor' || metrics.riskAdjustedReturn.status === 'critical') {
    recommendations.push('위험 대비 수익성 개선을 위한 리스크 관리 체계 구축');
  }
  
  if (metrics.economicValueAdded.status === 'poor' || metrics.economicValueAdded.status === 'critical') {
    recommendations.push('경제부가가치 창출을 위한 자본 효율성 개선 방안 마련');
  }
  
  // 기본 추천사항
  recommendations.push('정책자금 활용을 통한 금융비용 절감 효과 극대화');
  recommendations.push('분기별 성과 모니터링을 통한 사업 진행 상황 점검');
  recommendations.push('시장 변화에 대응하는 유연한 사업 전략 수립');
  
  return recommendations;
}

// 지표 오류 진단
export function diagnoseInvestmentMetrics(result: InvestmentResult, input: InvestmentInput): DiagnosticResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fixes: string[] = [];
  
  // NPV 오류 진단
  if (isNaN(result.npv) || !isFinite(result.npv)) {
    errors.push('NPV 계산에서 무한값 또는 NaN 발생');
    fixes.push('현금흐름 데이터 및 할인율 설정 재검토');
  }
  
  // IRR 오류 진단
  if (isNaN(result.irr) || !isFinite(result.irr)) {
    errors.push('IRR 계산에서 무한값 또는 NaN 발생');
    fixes.push('현금흐름 패턴 및 초기 투자금액 재검토');
  } else if (result.irr > 1000) {
    warnings.push('IRR이 비현실적으로 높음 (1000% 초과)');
  }
  
  // ROI 오류 진단
  if (isNaN(result.roi) || !isFinite(result.roi)) {
    errors.push('ROI 계산에서 무한값 또는 NaN 발생');
    fixes.push('총 수익 및 초기 투자금액 데이터 재검토');
  }
  
  // PI 오류 진단
  if (isNaN(result.profitabilityIndex) || !isFinite(result.profitabilityIndex)) {
    errors.push('수익성지수(PI) 계산에서 무한값 또는 NaN 발생');
    fixes.push('현재가치 및 초기 투자금액 계산 재검토');
  }
  
  // 위험조정수익률 오류 진단
  if (isNaN(result.riskAdjustedReturn) || !isFinite(result.riskAdjustedReturn)) {
    errors.push('위험조정수익률 계산에서 무한값 또는 NaN 발생');
    fixes.push('위험프리미엄 및 수익률 계산 로직 재검토');
  }
  
  // EVA 오류 진단
  if (isNaN(result.economicValueAdded) || !isFinite(result.economicValueAdded)) {
    errors.push('경제부가가치(EVA) 계산에서 무한값 또는 NaN 발생');
    fixes.push('NOPAT 및 자본비용 계산 재검토');
  }
  
  // DSCR 오류 진단
  if (result.dscr.some(dscr => isNaN(dscr) || !isFinite(dscr))) {
    errors.push('DSCR 계산에서 무한값 또는 NaN 발생');
    fixes.push('영업이익 및 부채상환액 데이터 재검토');
  }
  
  // 할인회수기간 경고
  if (result.paybackPeriod <= 0 || result.paybackPeriod > (input.analysisYears || 10)) {
    warnings.push('할인회수기간이 분석기간을 초과하거나 계산되지 않음');
  }
  
  return {
    hasErrors: errors.length > 0,
    errors,
    warnings,
    fixes
  };
}

// AI 종합 평가 엔진 메인 함수
export function generateAIInvestmentEvaluation(result: InvestmentResult, input: InvestmentInput): InvestmentEvaluation {
  // 평균 DSCR 계산
  const avgDSCR = result.dscr.reduce((sum, dscr) => sum + dscr, 0) / result.dscr.length;
  
  // 지표별 평가
  const npvGrade = evaluateNPV(result.npv, input.initialInvestment);
  const irrGrade = evaluateIRR(result.irr, input.discountRate || 10);
  const dscrGrade = evaluateDSCR(avgDSCR);
  const paybackGrade = evaluateDiscountedPayback(result.paybackPeriod, input.analysisYears || 10);
  const roiGrade = evaluateROI(result.roi);
  const piGrade = evaluateProfitabilityIndex(result.profitabilityIndex);
  const riskAdjustedGrade = evaluateRiskAdjustedReturn(result.riskAdjustedReturn);
  const evaGrade = evaluateEconomicValueAdded(result.economicValueAdded, input.initialInvestment);
  
  // 지표별 데이터 구성
  const metrics = {
    npv: { ...npvGrade, value: result.npv / 100000000, unit: '억원' },
    irr: { ...irrGrade, value: result.irr, unit: '%' },
    dscr: { ...dscrGrade, value: avgDSCR, unit: '배' },
    discountedPayback: { ...paybackGrade, value: result.paybackPeriod, unit: '년' },
    roi: { ...roiGrade, value: result.roi, unit: '%' },
    profitabilityIndex: { ...piGrade, value: result.profitabilityIndex, unit: '' },
    riskAdjustedReturn: { ...riskAdjustedGrade, value: result.riskAdjustedReturn, unit: '%' },
    economicValueAdded: { ...evaGrade, value: result.economicValueAdded / 100000000, unit: '억원' }
  };
  
  // 전체 등급 계산
  const metricScores = [
    npvGrade.score, irrGrade.score, dscrGrade.score, paybackGrade.score,
    roiGrade.score, piGrade.score, riskAdjustedGrade.score, evaGrade.score
  ];
  const overallGrade = calculateOverallGrade(metricScores);
  
  // 신뢰도 계산
  const confidence = calculateConfidence(result, input);
  
  // 투자 추천 결정
  const recommendation = determineRecommendation(overallGrade, confidence);
  
  // SWOT 분석
  const swotAnalysis = analyzeSWOT(metrics);
  
  // 상세 분석 의견
  const detailedAnalysis = generateDetailedAnalysis(result, input, metrics, overallGrade);
  
  // 개선 제안
  const recommendations = generateRecommendations(metrics, result, input);
  
  return {
    overallGrade,
    recommendation,
    confidence,
    metrics,
    summary: swotAnalysis,
    detailedAnalysis,
    recommendations
  };
} 