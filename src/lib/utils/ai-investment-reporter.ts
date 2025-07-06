import { InvestmentResult, InvestmentInput, ScenarioAnalysis, SensitivityAnalysis } from './investment-analysis';

export interface AIAnalysisReport {
  summary: string;
  investmentGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  keyFindings: string[];
  risks: RiskAssessment[];
  opportunities: string[];
  recommendations: string[];
  detailedAnalysis: {
    profitability: string;
    liquidity: string;
    stability: string;
    growth: string;
  };
}

export interface RiskAssessment {
  type: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  mitigation: string;
}

// 투자 등급 결정
function determineInvestmentGrade(result: InvestmentResult): 'A' | 'B' | 'C' | 'D' | 'F' {
  let score = 0;
  
  // NPV 평가 (30점)
  if (result.npv > 0) {
    if (result.npv > 10000000000) score += 30; // 100억 이상
    else if (result.npv > 5000000000) score += 25; // 50억 이상
    else if (result.npv > 1000000000) score += 20; // 10억 이상
    else score += 15;
  }
  
  // IRR 평가 (30점)
  if (result.irr > 25) score += 30;
  else if (result.irr > 20) score += 25;
  else if (result.irr > 15) score += 20;
  else if (result.irr > 10) score += 15;
  else if (result.irr > 5) score += 10;
  
  // 투자회수기간 평가 (20점)
  if (result.paybackPeriod > 0 && result.paybackPeriod < 3) score += 20;
  else if (result.paybackPeriod < 5) score += 15;
  else if (result.paybackPeriod < 7) score += 10;
  else if (result.paybackPeriod < 10) score += 5;
  
  // DSCR 평가 (20점)
  const avgDSCR = result.dscr.reduce((sum, val) => sum + val, 0) / result.dscr.length;
  if (avgDSCR > 2) score += 20;
  else if (avgDSCR > 1.5) score += 15;
  else if (avgDSCR > 1.25) score += 10;
  else if (avgDSCR > 1) score += 5;
  
  // 등급 결정
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

// 리스크 평가
function assessRisks(result: InvestmentResult, input: InvestmentInput): RiskAssessment[] {
  const risks: RiskAssessment[] = [];
  
  // 유동성 리스크
  const minDSCR = Math.min(...result.dscr);
  if (minDSCR < 1.25) {
    risks.push({
      type: '유동성 리스크',
      level: minDSCR < 1 ? 'high' : 'medium',
      description: `최저 DSCR이 ${minDSCR.toFixed(2)}로 부채상환능력이 ${minDSCR < 1 ? '부족' : '제한적'}합니다.`,
      mitigation: '운전자금 확보 및 매출 다변화를 통한 현금흐름 안정화가 필요합니다.'
    });
  }
  
  // 시장 리스크
  if (input.operatingCostRate > 70) {
    risks.push({
      type: '운영 효율성 리스크',
      level: 'medium',
      description: `운영비율이 ${input.operatingCostRate}%로 높아 수익성이 제한적입니다.`,
      mitigation: '원가절감 및 운영 효율화를 통한 수익성 개선이 필요합니다.'
    });
  }
  
  // 금리 리스크
  if (input.interestRate > 4) {
    risks.push({
      type: '금리 리스크',
      level: 'medium',
      description: `대출금리가 ${input.interestRate}%로 금리 변동에 민감할 수 있습니다.`,
      mitigation: '고정금리 전환 또는 금리 헤지 전략을 고려하세요.'
    });
  }
  
  // 투자회수 리스크
  if (result.paybackPeriod > 7 || result.paybackPeriod < 0) {
    risks.push({
      type: '투자회수 리스크',
      level: result.paybackPeriod < 0 ? 'high' : 'medium',
      description: result.paybackPeriod < 0 
        ? '분석기간 내 투자회수가 불가능합니다.'
        : `투자회수기간이 ${result.paybackPeriod.toFixed(1)}년으로 장기간 소요됩니다.`,
      mitigation: '초기 매출 증대 방안 및 비용 절감 전략 수립이 필요합니다.'
    });
  }
  
  return risks;
}

// 기회 요인 분석
function identifyOpportunities(result: InvestmentResult, input: InvestmentInput): string[] {
  const opportunities: string[] = [];
  
  if (result.npv > 5000000000) {
    opportunities.push(`높은 NPV (${(result.npv / 100000000).toFixed(0)}억원)로 우수한 투자 가치를 보입니다.`);
  }
  
  if (result.irr > 20) {
    opportunities.push(`${result.irr.toFixed(1)}%의 높은 내부수익률로 시장 평균을 상회합니다.`);
  }
  
  if (result.paybackPeriod > 0 && result.paybackPeriod < 5) {
    opportunities.push(`${result.paybackPeriod.toFixed(1)}년의 빠른 투자회수로 재투자 기회가 빠르게 확보됩니다.`);
  }
  
  if (input.interestRate < 3) {
    opportunities.push(`${input.interestRate}%의 낮은 정책자금 금리로 자금조달 비용이 절감됩니다.`);
  }
  
  const avgDSCR = result.dscr.reduce((sum, val) => sum + val, 0) / result.dscr.length;
  if (avgDSCR > 2) {
    opportunities.push(`평균 DSCR ${avgDSCR.toFixed(1)}배로 안정적인 부채상환능력을 보유합니다.`);
  }
  
  return opportunities;
}

// 추천사항 생성
function generateRecommendations(result: InvestmentResult, input: InvestmentInput, risks: RiskAssessment[]): string[] {
  const recommendations: string[] = [];
  const grade = determineInvestmentGrade(result);
  
  // 등급별 기본 추천
  if (grade === 'A' || grade === 'B') {
    recommendations.push('본 투자안은 우수한 수익성과 안정성을 보이므로 적극적으로 추진하시기를 권합니다.');
  } else if (grade === 'C') {
    recommendations.push('본 투자안은 적정 수준의 수익성을 보이나, 리스크 관리 방안을 보완하여 추진하시기를 권합니다.');
  } else {
    recommendations.push('본 투자안은 재검토가 필요하며, 사업계획의 전면적인 수정을 권합니다.');
  }
  
  // 구체적 추천사항
  if (result.paybackPeriod > 5) {
    recommendations.push('초기 3년간 매출 증대를 위한 마케팅 강화 및 판로 다변화 전략을 수립하세요.');
  }
  
  if (risks.some(r => r.type === '유동성 리스크')) {
    recommendations.push('운전자금 여유분을 최소 3개월 이상 확보하고, 긴급 자금조달 라인을 사전에 구축하세요.');
  }
  
  if (input.operatingCostRate > 60) {
    recommendations.push('운영비 절감을 위한 프로세스 개선 및 자동화 투자를 검토하세요.');
  }
  
  if (result.irr < 15) {
    recommendations.push('추가적인 수익원 개발 또는 고부가가치 서비스 도입을 통한 수익성 개선을 검토하세요.');
  }
  
  // 정책자금 활용 추천
  recommendations.push('정책자금의 거치기간을 최대한 활용하여 초기 현금흐름을 안정화하세요.');
  recommendations.push('정책자금 심사 시 본 분석 결과를 활용하여 사업성을 객관적으로 입증하세요.');
  
  return recommendations;
}

// 상세 분석 텍스트 생성
function generateDetailedAnalysis(result: InvestmentResult, input: InvestmentInput): {
  profitability: string;
  liquidity: string;
  stability: string;
  growth: string;
} {
  // 수익성 분석
  const profitability = `
    본 사업의 순현재가치(NPV)는 ${(result.npv / 100000000).toFixed(0)}억원으로 
    ${result.npv > 0 ? '양(+)의 값을 보여 투자가치가 있습니다' : '음(-)의 값으로 재검토가 필요합니다'}.
    내부수익률(IRR)은 ${result.irr.toFixed(1)}%로 할인율 ${input.discountRate}%를 
    ${result.irr > input.discountRate ? '상회하여 수익성이 양호합니다' : '하회하여 수익성이 부족합니다'}.
    투자수익률(ROI)은 ${result.roi.toFixed(0)}%로 
    ${result.roi > 100 ? '투자금 대비 우수한 수익을 기대할 수 있습니다' : '추가적인 수익성 개선이 필요합니다'}.
  `.trim();
  
  // 유동성 분석
  const avgDSCR = result.dscr.reduce((sum, val) => sum + val, 0) / result.dscr.length;
  const minDSCR = Math.min(...result.dscr);
  const liquidity = `
    평균 부채상환비율(DSCR)은 ${avgDSCR.toFixed(2)}배로 
    ${avgDSCR > 1.5 ? '안정적인 부채상환능력을 보입니다' : '부채상환에 주의가 필요합니다'}.
    최저 DSCR은 ${minDSCR.toFixed(2)}배로 발생하며, 
    ${minDSCR > 1.25 ? '최악의 경우에도 상환능력을 유지합니다' : '특정 시기에 유동성 압박이 예상됩니다'}.
    투자회수기간은 ${result.paybackPeriod > 0 ? `${result.paybackPeriod.toFixed(1)}년으로 
    ${result.paybackPeriod < 5 ? '빠른 자금회수가 가능합니다' : '중장기적 관점의 투자입니다'}` : '분석기간 내 회수가 어렵습니다'}.
  `.trim();
  
  // 안정성 분석
  const stability = `
    정책자금 ${(input.policyFundAmount / 100000000).toFixed(0)}억원을 ${input.interestRate}%의 저금리로 조달하여 
    금융비용 부담이 ${input.interestRate < 3 ? '매우 낮습니다' : '적정 수준입니다'}.
    거치기간 ${input.gracePeriod}년 동안 원금상환 부담 없이 사업 안정화에 집중할 수 있습니다.
    손익분기점은 ${result.breakEvenPoint > 0 ? `${result.breakEvenPoint.toFixed(1)}년으로 
    ${result.breakEvenPoint < 3 ? '빠른 흑자전환이 예상됩니다' : '중기적 관점의 수익실현이 예상됩니다'}` : '추가 분석이 필요합니다'}.
  `.trim();
  
  // 성장성 분석
  const revenueGrowth = input.annualRevenue.length > 1 
    ? ((input.annualRevenue[input.annualRevenue.length - 1] / input.annualRevenue[0] - 1) * 100 / input.annualRevenue.length)
    : 0;
  const growth = `
    연평균 매출성장률은 ${revenueGrowth.toFixed(1)}%로 
    ${revenueGrowth > 15 ? '높은 성장성을 보입니다' : revenueGrowth > 5 ? '안정적인 성장이 예상됩니다' : '보수적인 성장을 가정하고 있습니다'}.
    수익성지수(PI)는 ${result.profitabilityIndex.toFixed(2)}로 
    ${result.profitabilityIndex > 1.2 ? '투자 효율성이 우수합니다' : result.profitabilityIndex > 1 ? '적정 수준의 투자 효율성을 보입니다' : '투자 효율성 개선이 필요합니다'}.
    본 사업은 정책자금을 활용하여 ${input.analysisYears}년간 누적 ${(result.cashFlows[result.cashFlows.length - 1].cumulativeCashFlow / 100000000).toFixed(0)}억원의 
    현금흐름 창출이 예상됩니다.
  `.trim();
  
  return { profitability, liquidity, stability, growth };
}

// AI 분석 리포트 생성
export function generateAIAnalysisReport(
  result: InvestmentResult,
  input: InvestmentInput,
  scenarioAnalysis?: ScenarioAnalysis,
  sensitivityAnalysis?: SensitivityAnalysis[]
): AIAnalysisReport {
  const grade = determineInvestmentGrade(result);
  const risks = assessRisks(result, input);
  const opportunities = identifyOpportunities(result, input);
  const recommendations = generateRecommendations(result, input, risks);
  const detailedAnalysis = generateDetailedAnalysis(result, input);
  
  // 핵심 발견사항
  const keyFindings: string[] = [
    `투자 등급: ${grade}등급 (${grade === 'A' ? '매우 우수' : grade === 'B' ? '우수' : grade === 'C' ? '양호' : grade === 'D' ? '주의' : '재검토 필요'})`,
    `NPV ${(result.npv / 100000000).toFixed(0)}억원, IRR ${result.irr.toFixed(1)}%로 ${result.npv > 0 && result.irr > input.discountRate ? '투자가치 충분' : '신중한 검토 필요'}`,
    `투자회수기간 ${result.paybackPeriod > 0 ? result.paybackPeriod.toFixed(1) + '년' : '미회수'}로 ${result.paybackPeriod > 0 && result.paybackPeriod < 5 ? '양호한 회수 전망' : '장기 투자 관점 필요'}`,
    `평균 DSCR ${(result.dscr.reduce((sum, val) => sum + val, 0) / result.dscr.length).toFixed(1)}배로 ${result.dscr.reduce((sum, val) => sum + val, 0) / result.dscr.length > 1.5 ? '안정적 상환능력' : '유동성 관리 필요'}`
  ];
  
  // 시나리오 분석 결과 추가
  if (scenarioAnalysis) {
    keyFindings.push(
      `시나리오별 NPV: 보수적 ${(scenarioAnalysis.conservative.npv / 100000000).toFixed(0)}억원, ` +
      `기본 ${(scenarioAnalysis.base.npv / 100000000).toFixed(0)}억원, ` +
      `낙관적 ${(scenarioAnalysis.optimistic.npv / 100000000).toFixed(0)}억원`
    );
  }
  
  // 요약 생성
  const summary = `
    본 투자안은 초기투자 ${(input.initialInvestment / 100000000).toFixed(0)}억원과 
    정책자금 ${(input.policyFundAmount / 100000000).toFixed(0)}억원(금리 ${input.interestRate}%)을 활용하여 
    ${input.analysisYears}년간 운영 시 NPV ${(result.npv / 100000000).toFixed(0)}억원, 
    IRR ${result.irr.toFixed(1)}%의 수익성을 보입니다.
    투자등급은 ${grade}등급으로 평가되며, ${grade === 'A' || grade === 'B' ? '적극 추진을 권장합니다' : 
    grade === 'C' ? '조건부 추진을 권장합니다' : '재검토가 필요합니다'}.
  `.trim();
  
  return {
    summary,
    investmentGrade: grade,
    keyFindings,
    risks,
    opportunities,
    recommendations,
    detailedAnalysis
  };
}

// 민감도 분석 해석
export function interpretSensitivityAnalysis(analysis: SensitivityAnalysis[]): string[] {
  const interpretations: string[] = [];
  
  analysis.forEach(param => {
    const baseNPV = param.variations.find(v => v.change === 0)?.npv || 0;
    const negativeImpact = param.variations.find(v => v.change === -20);
    const positiveImpact = param.variations.find(v => v.change === 20);
    
    if (negativeImpact && positiveImpact) {
      const negativeChange = ((negativeImpact.npv - baseNPV) / baseNPV * 100).toFixed(1);
      const positiveChange = ((positiveImpact.npv - baseNPV) / baseNPV * 100).toFixed(1);
      
      interpretations.push(
        `${param.parameter}이 20% 감소 시 NPV는 ${negativeChange}% 변동하고, ` +
        `20% 증가 시 ${positiveChange}% 변동하여 ` +
        `${Math.abs(Number(negativeChange)) > 30 || Math.abs(Number(positiveChange)) > 30 ? '높은 민감도' : '보통 민감도'}를 보입니다.`
      );
    }
  });
  
  return interpretations;
}

// 투자 의사결정 지원
export function generateInvestmentDecision(report: AIAnalysisReport): {
  decision: 'proceed' | 'conditional' | 'reject';
  rationale: string;
  conditions?: string[];
} {
  const highRisks = report.risks.filter(r => r.level === 'high').length;
  const mediumRisks = report.risks.filter(r => r.level === 'medium').length;
  
  if (report.investmentGrade === 'A' || (report.investmentGrade === 'B' && highRisks === 0)) {
    return {
      decision: 'proceed',
      rationale: '우수한 수익성과 안정성을 바탕으로 즉시 추진 가능합니다.'
    };
  } else if (report.investmentGrade === 'B' || (report.investmentGrade === 'C' && highRisks === 0)) {
    return {
      decision: 'conditional',
      rationale: '기본적인 투자가치는 있으나 리스크 관리 방안 마련 후 추진하시기 바랍니다.',
      conditions: [
        ...report.risks.filter(r => r.level === 'high').map(r => r.mitigation),
        '분기별 성과 모니터링 체계 구축',
        '비상 계획(Contingency Plan) 수립'
      ]
    };
  } else {
    return {
      decision: 'reject',
      rationale: '현재 조건으로는 투자 리스크가 높아 사업계획 재검토를 권장합니다.',
      conditions: [
        '수익성 개선 방안 마련 (목표 IRR 15% 이상)',
        '초기 투자규모 축소 검토',
        '단계별 투자 전략으로 전환'
      ]
    };
  }
} 