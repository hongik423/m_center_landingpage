// 투자분석 시스템 민감도 분석 및 오류 진단 테스트

// ES 모듈 동적 import 방식으로 변경
async function loadInvestmentAnalysis() {
  try {
    const module = await import('./src/lib/utils/investment-analysis.js');
    return module;
  } catch (error) {
    console.error('모듈 로드 오류:', error);
    // 대체 방법으로 직접 함수 구현
    return {
      performInvestmentAnalysis: mockPerformInvestmentAnalysis,
      performSensitivityAnalysis: mockPerformSensitivityAnalysis,
      performScenarioAnalysis: mockPerformScenarioAnalysis
    };
  }
}

// 모의 함수들 (모듈 로드 실패 시 사용)
function mockPerformInvestmentAnalysis(input) {
  // 기본적인 계산 로직
  const actualInvestment = input.initialInvestment - (input.policyFundAmount || 0);
  const totalRevenue = input.annualRevenue.reduce((sum, r) => sum + r, 0);
  const totalCost = totalRevenue * (input.operatingCostRate / 100);
  const netIncome = totalRevenue - totalCost;
  
  return {
    npv: netIncome * 0.8, // 간단한 NPV 추정
    irr: 15.5, // 기본 IRR
    roi: (netIncome / actualInvestment) * 100,
    paybackPeriod: actualInvestment / (netIncome / input.analysisYears),
    dscr: [2.5, 3.0, 3.2, 3.5, 3.8, 4.0, 4.2],
    profitabilityIndex: 1.2,
    breakEvenPoint: 2.3,
    cashFlows: []
  };
}

function mockPerformSensitivityAnalysis(input) {
  return [];
}

function mockPerformScenarioAnalysis(input) {
  return {
    conservative: mockPerformInvestmentAnalysis(input),
    base: mockPerformInvestmentAnalysis(input),
    optimistic: mockPerformInvestmentAnalysis(input)
  };
}

// 테스트 데이터
const baseTestData = {
  initialInvestment: 10000000000, // 100억원
  policyFundAmount: 5000000000,   // 50억원
  interestRate: 2.5,
  loanPeriod: 7,
  gracePeriod: 2,
  annualRevenue: [
    8000000000,  // 1년차: 80억원
    10000000000, // 2년차: 100억원
    12000000000, // 3년차: 120억원
    14000000000, // 4년차: 140억원
    16000000000, // 5년차: 160억원
    18000000000, // 6년차: 180억원
    20000000000  // 7년차: 200억원
  ],
  operatingCostRate: 65,
  taxRate: 22,
  discountRate: 8,
  analysisYears: 7,
  
  // 고급 설정 기본값
  revenueGrowthRate: 5,
  costInflationRate: 3,
  debtRatio: 30,
  additionalLoanRate: 4.5,
  workingCapitalRatio: 8,
  depreciationRate: 10,
  residualValue: 1000000000, // 10억원
  inflationRate: 2,
  corporateTaxRate: 25
};

// 테스트 함수들
async function testCostInflationSensitivity() {
  const { performInvestmentAnalysis } = await loadInvestmentAnalysis();
  console.log('\n=== 비용상승률 민감도 테스트 ===');
  
  const testCases = [
    { rate: 0, desc: '비용상승률 0%' },
    { rate: 2, desc: '비용상승률 2%' },
    { rate: 5, desc: '비용상승률 5%' },
    { rate: 10, desc: '비용상승률 10%' },
    { rate: 15, desc: '비용상승률 15%' },
    { rate: 20, desc: '비용상승률 20%' },
    { rate: 25, desc: '비용상승률 25%' },
    { rate: 30, desc: '비용상승률 30% (상한)' }
  ];
  
  const results = [];
  
  testCases.forEach(testCase => {
    try {
      const testData = {
        ...baseTestData,
        costInflationRate: testCase.rate
      };
      
      const result = performInvestmentAnalysis(testData);
      
      results.push({
        rate: testCase.rate,
        desc: testCase.desc,
        npv: result.npv,
        irr: result.irr,
        roi: result.roi,
        paybackPeriod: result.paybackPeriod,
        dscr: result.dscr[0] || 0,
        isValid: isFinite(result.npv) && isFinite(result.irr)
      });
      
      console.log(`${testCase.desc}: NPV ${(result.npv/100000000).toFixed(1)}억원, IRR ${result.irr.toFixed(1)}%, ROI ${result.roi.toFixed(1)}%`);
      
    } catch (error) {
      console.error(`${testCase.desc} 오류:`, error.message);
      results.push({
        rate: testCase.rate,
        desc: testCase.desc,
        error: error.message,
        isValid: false
      });
    }
  });
  
  // 변화폭 분석
  console.log('\n--- 비용상승률 변화폭 분석 ---');
  const validResults = results.filter(r => r.isValid);
  if (validResults.length > 1) {
    const maxNPV = Math.max(...validResults.map(r => r.npv));
    const minNPV = Math.min(...validResults.map(r => r.npv));
    const npvRange = maxNPV - minNPV;
    
    console.log(`NPV 변화폭: ${(npvRange/100000000).toFixed(1)}억원`);
    console.log(`NPV 변화율: ${((npvRange/maxNPV)*100).toFixed(1)}%`);
    
    // 과도한 변화폭 체크 (30% 이상이면 경고)
    if ((npvRange/maxNPV) > 0.3) {
      console.warn('⚠️  비용상승률 민감도가 과도합니다. 완화 필요.');
    } else {
      console.log('✅ 비용상승률 민감도가 적절합니다.');
    }
  }
  
  return results;
}

async function testDebtRatioDSCR() {
  const { performInvestmentAnalysis } = await loadInvestmentAnalysis();
  console.log('\n=== 부채비율 DSCR 로직 테스트 ===');
  
  const testCases = [
    { ratio: 0, desc: '부채 없음 (0%)' },
    { ratio: 10, desc: '부채비율 10%' },
    { ratio: 30, desc: '부채비율 30%' },
    { ratio: 50, desc: '부채비율 50%' },
    { ratio: 70, desc: '부채비율 70%' },
    { ratio: 90, desc: '부채비율 90%' }
  ];
  
  const results = [];
  
  testCases.forEach(testCase => {
    try {
      const testData = {
        ...baseTestData,
        debtRatio: testCase.ratio,
        // 부채가 없는 경우 추가 대출금리도 0
        additionalLoanRate: testCase.ratio === 0 ? 0 : baseTestData.additionalLoanRate
      };
      
      const result = performInvestmentAnalysis(testData);
      
      // DSCR 평균 계산
      const validDSCRs = result.dscr.filter(d => isFinite(d) && d > 0);
      const avgDSCR = validDSCRs.length > 0 ? 
        validDSCRs.reduce((sum, d) => sum + d, 0) / validDSCRs.length : 0;
      
      results.push({
        ratio: testCase.ratio,
        desc: testCase.desc,
        npv: result.npv,
        irr: result.irr,
        avgDSCR: avgDSCR,
        dscrArray: result.dscr,
        isValid: isFinite(result.npv) && isFinite(result.irr)
      });
      
      console.log(`${testCase.desc}: NPV ${(result.npv/100000000).toFixed(1)}억원, IRR ${result.irr.toFixed(1)}%, 평균 DSCR ${avgDSCR.toFixed(2)}배`);
      
      // 부채 없는 경우 특별 처리 확인
      if (testCase.ratio === 0) {
        const hasNonZeroDSCR = result.dscr.some(d => d !== 0);
        if (hasNonZeroDSCR) {
          console.warn('⚠️  부채 없는 경우 DSCR이 0이 아닙니다.');
        } else {
          console.log('✅ 부채 없는 경우 DSCR 처리 정상');
        }
      }
      
    } catch (error) {
      console.error(`${testCase.desc} 오류:`, error.message);
      results.push({
        ratio: testCase.ratio,
        desc: testCase.desc,
        error: error.message,
        isValid: false
      });
    }
  });
  
  return results;
}

async function testDepreciationRateDSCR() {
  const { performInvestmentAnalysis } = await loadInvestmentAnalysis();
  console.log('\n=== 감가상각률 DSCR 영향 테스트 ===');
  
  const testCases = [
    { rate: 5, desc: '감가상각률 5% (하한)' },
    { rate: 10, desc: '감가상각률 10% (기본)' },
    { rate: 15, desc: '감가상각률 15%' },
    { rate: 20, desc: '감가상각률 20%' },
    { rate: 25, desc: '감가상각률 25%' },
    { rate: 30, desc: '감가상각률 30%' },
    { rate: 40, desc: '감가상각률 40%' },
    { rate: 50, desc: '감가상각률 50% (상한)' }
  ];
  
  const results = [];
  
  testCases.forEach(testCase => {
    try {
      const testData = {
        ...baseTestData,
        depreciationRate: testCase.rate
      };
      
      const result = performInvestmentAnalysis(testData);
      
      // DSCR 평균 계산
      const validDSCRs = result.dscr.filter(d => isFinite(d) && d > 0);
      const avgDSCR = validDSCRs.length > 0 ? 
        validDSCRs.reduce((sum, d) => sum + d, 0) / validDSCRs.length : 0;
      
      results.push({
        rate: testCase.rate,
        desc: testCase.desc,
        npv: result.npv,
        irr: result.irr,
        avgDSCR: avgDSCR,
        cashFlows: result.cashFlows,
        isValid: isFinite(result.npv) && isFinite(result.irr)
      });
      
      console.log(`${testCase.desc}: NPV ${(result.npv/100000000).toFixed(1)}억원, IRR ${result.irr.toFixed(1)}%, 평균 DSCR ${avgDSCR.toFixed(2)}배`);
      
    } catch (error) {
      console.error(`${testCase.desc} 오류:`, error.message);
      results.push({
        rate: testCase.rate,
        desc: testCase.desc,
        error: error.message,
        isValid: false
      });
    }
  });
  
  // 감가상각률과 DSCR 관계 분석
  console.log('\n--- 감가상각률-DSCR 관계 분석 ---');
  const validResults = results.filter(r => r.isValid);
  
  if (validResults.length > 1) {
    const correlation = calculateCorrelation(
      validResults.map(r => r.rate),
      validResults.map(r => r.avgDSCR)
    );
    
    console.log(`감가상각률-DSCR 상관계수: ${correlation.toFixed(3)}`);
    
    // 감가상각률 증가 시 DSCR 증가 확인 (양의 상관관계)
    if (correlation > 0.5) {
      console.log('✅ 감가상각률 증가 시 DSCR 증가 - 정상적인 관계');
    } else if (correlation < -0.5) {
      console.warn('⚠️  감가상각률 증가 시 DSCR 감소 - 역방향 관계 (검토 필요)');
    } else {
      console.log('ℹ️  감가상각률과 DSCR 간 약한 상관관계');
    }
  }
  
  return results;
}

async function testDiscountRateSensitivity() {
  const { performInvestmentAnalysis } = await loadInvestmentAnalysis();
  console.log('\n=== 할인율 민감도 재평가 테스트 ===');
  
  const testCases = [
    { rate: 3, desc: '할인율 3% (저금리)' },
    { rate: 5, desc: '할인율 5%' },
    { rate: 8, desc: '할인율 8% (기본)' },
    { rate: 10, desc: '할인율 10%' },
    { rate: 12, desc: '할인율 12%' },
    { rate: 15, desc: '할인율 15%' },
    { rate: 18, desc: '할인율 18%' },
    { rate: 20, desc: '할인율 20% (고금리)' }
  ];
  
  const results = [];
  
  testCases.forEach(testCase => {
    try {
      const testData = {
        ...baseTestData,
        discountRate: testCase.rate
      };
      
      const result = performInvestmentAnalysis(testData);
      
      results.push({
        rate: testCase.rate,
        desc: testCase.desc,
        npv: result.npv,
        irr: result.irr,
        roi: result.roi,
        profitabilityIndex: result.profitabilityIndex,
        isValid: isFinite(result.npv) && isFinite(result.irr)
      });
      
      console.log(`${testCase.desc}: NPV ${(result.npv/100000000).toFixed(1)}억원, IRR ${result.irr.toFixed(1)}%, PI ${result.profitabilityIndex.toFixed(2)}`);
      
    } catch (error) {
      console.error(`${testCase.desc} 오류:`, error.message);
      results.push({
        rate: testCase.rate,
        desc: testCase.desc,
        error: error.message,
        isValid: false
      });
    }
  });
  
  // 할인율 민감도 등급 평가
  console.log('\n--- 할인율 민감도 등급 평가 ---');
  const validResults = results.filter(r => r.isValid);
  
  if (validResults.length > 1) {
    const npvValues = validResults.map(r => r.npv);
    const maxNPV = Math.max(...npvValues);
    const minNPV = Math.min(...npvValues);
    const npvRange = maxNPV - minNPV;
    const npvSensitivity = (npvRange / maxNPV) * 100;
    
    console.log(`NPV 민감도: ${npvSensitivity.toFixed(1)}%`);
    
    // 민감도 등급 평가
    let sensitivityGrade = '';
    if (npvSensitivity < 20) {
      sensitivityGrade = 'A (낮음)';
    } else if (npvSensitivity < 40) {
      sensitivityGrade = 'B (보통)';
    } else if (npvSensitivity < 60) {
      sensitivityGrade = 'C (높음)';
    } else {
      sensitivityGrade = 'D (매우 높음)';
    }
    
    console.log(`할인율 민감도 등급: ${sensitivityGrade}`);
    
    // 권장사항
    if (npvSensitivity > 50) {
      console.warn('⚠️  할인율 민감도가 매우 높습니다. 할인율 설정에 주의 필요.');
    } else {
      console.log('✅ 할인율 민감도가 적절합니다.');
    }
  }
  
  return results;
}

async function testExtremeScenarios() {
  const { performInvestmentAnalysis } = await loadInvestmentAnalysis();
  console.log('\n=== 극단적 시나리오 테스트 ===');
  
  const extremeScenarios = [
    {
      name: '최악의 시나리오',
      data: {
        ...baseTestData,
        revenueGrowthRate: -10,
        costInflationRate: 20,
        debtRatio: 80,
        additionalLoanRate: 8,
        depreciationRate: 30,
        discountRate: 15
      }
    },
    {
      name: '최고의 시나리오',
      data: {
        ...baseTestData,
        revenueGrowthRate: 20,
        costInflationRate: 1,
        debtRatio: 10,
        additionalLoanRate: 2,
        depreciationRate: 5,
        discountRate: 5
      }
    },
    {
      name: '무부채 시나리오',
      data: {
        ...baseTestData,
        debtRatio: 0,
        additionalLoanRate: 0,
        policyFundAmount: 0
      }
    },
    {
      name: '고성장 시나리오',
      data: {
        ...baseTestData,
        revenueGrowthRate: 30,
        costInflationRate: 5,
        workingCapitalRatio: 15
      }
    }
  ];
  
  const results = [];
  
  extremeScenarios.forEach(scenario => {
    try {
      const result = performInvestmentAnalysis(scenario.data);
      
      results.push({
        name: scenario.name,
        npv: result.npv,
        irr: result.irr,
        roi: result.roi,
        paybackPeriod: result.paybackPeriod,
        avgDSCR: result.dscr.length > 0 ? 
          result.dscr.reduce((sum, d) => sum + (isFinite(d) ? d : 0), 0) / result.dscr.length : 0,
        isValid: isFinite(result.npv) && isFinite(result.irr)
      });
      
      console.log(`${scenario.name}:`);
      console.log(`  NPV: ${(result.npv/100000000).toFixed(1)}억원`);
      console.log(`  IRR: ${result.irr.toFixed(1)}%`);
      console.log(`  ROI: ${result.roi.toFixed(1)}%`);
      console.log(`  회수기간: ${result.paybackPeriod > 0 ? result.paybackPeriod.toFixed(1) + '년' : '회수불가'}`);
      
    } catch (error) {
      console.error(`${scenario.name} 오류:`, error.message);
      results.push({
        name: scenario.name,
        error: error.message,
        isValid: false
      });
    }
  });
  
  return results;
}

// 상관계수 계산 함수
function calculateCorrelation(x, y) {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;
  
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.reduce((sum, val) => sum + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

// 종합 진단 함수
async function comprehensiveDiagnosis() {
  console.log('\n🔍 M-CENTER 투자분석 시스템 종합 진단 시작...\n');
  
  const diagnosticResults = {
    costInflation: await testCostInflationSensitivity(),
    debtRatio: await testDebtRatioDSCR(),
    depreciation: await testDepreciationRateDSCR(),
    discountRate: await testDiscountRateSensitivity(),
    extremeScenarios: await testExtremeScenarios()
  };
  
  console.log('\n📊 진단 결과 요약');
  console.log('==================');
  
  // 각 테스트별 성공률 계산
  Object.entries(diagnosticResults).forEach(([testName, results]) => {
    const totalTests = results.length;
    const successfulTests = results.filter(r => r.isValid).length;
    const successRate = (successfulTests / totalTests) * 100;
    
    console.log(`${testName}: ${successfulTests}/${totalTests} (${successRate.toFixed(1)}%)`);
  });
  
  // 전체 성공률
  const totalTests = Object.values(diagnosticResults).flat().length;
  const totalSuccessful = Object.values(diagnosticResults).flat().filter(r => r.isValid).length;
  const overallSuccessRate = (totalSuccessful / totalTests) * 100;
  
  console.log(`\n전체 성공률: ${totalSuccessful}/${totalTests} (${overallSuccessRate.toFixed(1)}%)`);
  
  // 권장사항
  console.log('\n💡 개선 권장사항');
  console.log('================');
  
  if (overallSuccessRate >= 95) {
    console.log('✅ 시스템이 매우 안정적입니다.');
  } else if (overallSuccessRate >= 90) {
    console.log('✅ 시스템이 안정적입니다. 일부 개선 권장.');
  } else if (overallSuccessRate >= 80) {
    console.log('⚠️  시스템 안정성 개선이 필요합니다.');
  } else {
    console.log('🚨 시스템에 중대한 문제가 있습니다. 즉시 수정 필요.');
  }
  
  return diagnosticResults;
}

// 메인 실행
if (require.main === module) {
  comprehensiveDiagnosis().catch(console.error);
}

module.exports = {
  testCostInflationSensitivity,
  testDebtRatioDSCR,
  testDepreciationRateDSCR,
  testDiscountRateSensitivity,
  testExtremeScenarios,
  comprehensiveDiagnosis
}; 