// 정책자금투자분석도구 종합 테스트 - NPV, IRR, 회수기간 검증

const { performInvestmentAnalysis } = require('./src/lib/utils/investment-analysis');

// 테스트 색상 코드
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// 포맷팅 헬퍼
function formatMoney(amount) {
  return (amount / 100000000).toFixed(2) + '억원';
}

function formatPercent(value) {
  return value.toFixed(2) + '%';
}

function formatYears(value) {
  if (value < 0) return '미회수';
  return value.toFixed(2) + '년';
}

// 1. 기본 테스트 케이스
function testBasicCalculations() {
  console.log('\n' + colors.blue + '=== 기본 NPV/IRR/회수기간 계산 테스트 ===' + colors.reset);
  
  const testCases = [
    {
      name: '표준 투자 케이스',
      input: {
        initialInvestment: 10000000000, // 100억
        policyFundAmount: 5000000000,   // 50억
        interestRate: 3.5,
        loanPeriod: 7,
        gracePeriod: 2,
        annualRevenue: [8000000000, 10000000000, 12000000000, 14000000000, 16000000000, 18000000000, 20000000000],
        operatingProfitRate: 15,
        taxRate: 22,
        discountRate: 10,
        analysisYears: 7,
        revenueGrowthRate: 10,
        marketPenetrationRate: 20,
        customerRetentionRate: 90,
        scenarioType: 'neutral',
        scenarioAdjustmentRate: 0,
        debtRatio: 30,
        workingCapitalRatio: 10
      }
    },
    {
      name: '고수익 급성장 케이스',
      input: {
        initialInvestment: 5000000000, // 50억
        policyFundAmount: 3000000000,  // 30억
        interestRate: 2.5,
        loanPeriod: 5,
        gracePeriod: 1,
        annualRevenue: [3000000000, 6000000000, 12000000000, 18000000000, 24000000000],
        operatingProfitRate: 25,
        taxRate: 22,
        discountRate: 12,
        analysisYears: 5,
        revenueGrowthRate: 50,
        marketPenetrationRate: 30,
        customerRetentionRate: 95,
        scenarioType: 'optimistic',
        scenarioAdjustmentRate: 10,
        debtRatio: 20,
        workingCapitalRatio: 15
      }
    },
    {
      name: '저수익 안정 케이스',
      input: {
        initialInvestment: 20000000000, // 200억
        policyFundAmount: 10000000000,  // 100억
        interestRate: 4.0,
        loanPeriod: 10,
        gracePeriod: 3,
        annualRevenue: Array(10).fill(15000000000), // 매년 150억
        operatingProfitRate: 8,
        taxRate: 22,
        discountRate: 8,
        analysisYears: 10,
        revenueGrowthRate: 2,
        marketPenetrationRate: 10,
        customerRetentionRate: 85,
        scenarioType: 'neutral',
        scenarioAdjustmentRate: 0,
        debtRatio: 40,
        workingCapitalRatio: 5
      }
    }
  ];

  const results = [];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n--- ${index + 1}. ${testCase.name} ---`);
    
    try {
      const startTime = Date.now();
      const result = performInvestmentAnalysis(testCase.input);
      const endTime = Date.now();
      
      console.log(`실행 시간: ${endTime - startTime}ms`);
      console.log(`초기 투자: ${formatMoney(testCase.input.initialInvestment)}`);
      console.log(`정책자금: ${formatMoney(testCase.input.policyFundAmount)}`);
      console.log(`실제 투자: ${formatMoney(testCase.input.initialInvestment - testCase.input.policyFundAmount)}`);
      console.log(`영업이익률: ${testCase.input.operatingProfitRate}%`);
      console.log(`할인율: ${testCase.input.discountRate}%`);
      
      console.log('\n📊 분석 결과:');
      console.log(`NPV: ${formatMoney(result.npv)} ${result.npv > 0 ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}`);
      console.log(`IRR: ${formatPercent(result.irr)} ${result.irr > testCase.input.discountRate ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}`);
      console.log(`단순 회수기간: ${formatYears(result.paybackPeriod)}`);
      console.log(`할인 회수기간: ${formatYears(result.discountedPaybackPeriod || -1)}`);
      console.log(`ROI: ${formatPercent(result.roi)}`);
      console.log(`수익성지수(PI): ${result.profitabilityIndex.toFixed(2)} ${result.profitabilityIndex > 1 ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}`);
      
      // 현금흐름 요약
      if (result.cashFlows && result.cashFlows.length > 0) {
        console.log('\n📈 현금흐름 요약:');
        const firstYear = result.cashFlows[0];
        const lastYear = result.cashFlows[result.cashFlows.length - 1];
        console.log(`1년차: 매출 ${formatMoney(firstYear.revenue)}, 순현금흐름 ${formatMoney(firstYear.netCashFlow)}`);
        console.log(`마지막년차: 매출 ${formatMoney(lastYear.revenue)}, 순현금흐름 ${formatMoney(lastYear.netCashFlow)}`);
        console.log(`누적현금흐름: ${formatMoney(lastYear.cumulativeCashFlow)}`);
      }
      
      results.push({
        name: testCase.name,
        npv: result.npv,
        irr: result.irr,
        paybackPeriod: result.paybackPeriod,
        discountedPaybackPeriod: result.discountedPaybackPeriod || -1,
        roi: result.roi,
        pi: result.profitabilityIndex,
        success: result.npv > 0 && result.irr > testCase.input.discountRate
      });
      
    } catch (error) {
      console.log(colors.red + `오류 발생: ${error.message}` + colors.reset);
      results.push({
        name: testCase.name,
        error: error.message
      });
    }
  });
  
  return results;
}

// 2. 회수기간 상세 검증
function testPaybackPeriodDetails() {
  console.log('\n' + colors.blue + '=== 회수기간 상세 검증 테스트 ===' + colors.reset);
  
  const testCase = {
    initialInvestment: 10000000000, // 100억
    policyFundAmount: 0,            // 정책자금 없음 (계산 단순화)
    annualRevenue: [4000000000, 5000000000, 6000000000, 7000000000, 8000000000], // 5년간
    operatingProfitRate: 20,
    taxRate: 22,
    discountRate: 10,
    analysisYears: 5,
    revenueGrowthRate: 0,
    marketPenetrationRate: 0,
    customerRetentionRate: 100,
    scenarioType: 'neutral',
    scenarioAdjustmentRate: 0,
    debtRatio: 0,
    workingCapitalRatio: 0
  };
  
  try {
    const result = performInvestmentAnalysis(testCase);
    
    console.log('\n연도별 현금흐름 분석:');
    console.log('년도 | 매출 | 영업이익 | 순이익 | 현금흐름 | 누적현금흐름 | 현재가치 | 누적현재가치');
    console.log('-'.repeat(100));
    
    // 초기 투자 표시
    console.log(`0    | - | - | - | ${formatMoney(-testCase.initialInvestment)} | ${formatMoney(-testCase.initialInvestment)} | ${formatMoney(-testCase.initialInvestment)} | ${formatMoney(-testCase.initialInvestment)}`);
    
    result.cashFlows.forEach(cf => {
      console.log(`${cf.year}    | ${formatMoney(cf.revenue)} | ${formatMoney(cf.ebit)} | ${formatMoney(cf.netIncome)} | ${formatMoney(cf.netCashFlow)} | ${formatMoney(cf.cumulativeCashFlow)} | ${formatMoney(cf.presentValue)} | ${formatMoney(cf.cumulativePV)}`);
    });
    
    console.log('\n회수기간 분석:');
    console.log(`단순 회수기간: ${formatYears(result.paybackPeriod)}`);
    console.log(`할인 회수기간: ${formatYears(result.discountedPaybackPeriod || -1)}`);
    
    // 수동 계산으로 검증
    let manualCumulative = -testCase.initialInvestment;
    let manualCumulativePV = -testCase.initialInvestment;
    let manualSimplePayback = -1;
    let manualDiscountedPayback = -1;
    
    for (let i = 0; i < result.cashFlows.length; i++) {
      const cf = result.cashFlows[i];
      manualCumulative += cf.netCashFlow;
      manualCumulativePV += cf.presentValue;
      
      if (manualSimplePayback < 0 && manualCumulative >= 0) {
        if (i === 0) {
          manualSimplePayback = 1;
        } else {
          const prevCumulative = manualCumulative - cf.netCashFlow;
          const fraction = -prevCumulative / cf.netCashFlow;
          manualSimplePayback = cf.year - 1 + fraction;
        }
      }
      
      if (manualDiscountedPayback < 0 && manualCumulativePV >= 0) {
        if (i === 0) {
          manualDiscountedPayback = 1;
        } else {
          const prevCumulativePV = manualCumulativePV - cf.presentValue;
          const fraction = -prevCumulativePV / cf.presentValue;
          manualDiscountedPayback = cf.year - 1 + fraction;
        }
      }
    }
    
    console.log('\n검증 결과:');
    console.log(`수동 계산 단순 회수기간: ${formatYears(manualSimplePayback)}`);
    console.log(`수동 계산 할인 회수기간: ${formatYears(manualDiscountedPayback)}`);
    
    const simpleMatch = Math.abs(result.paybackPeriod - manualSimplePayback) < 0.01;
    const discountedMatch = Math.abs((result.discountedPaybackPeriod || -1) - manualDiscountedPayback) < 0.01;
    
    console.log(`단순 회수기간 일치: ${simpleMatch ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}`);
    console.log(`할인 회수기간 일치: ${discountedMatch ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}`);
    
  } catch (error) {
    console.log(colors.red + `오류 발생: ${error.message}` + colors.reset);
  }
}

// 3. NPV/IRR 정확성 검증
function testNPVIRRAccuracy() {
  console.log('\n' + colors.blue + '=== NPV/IRR 정확성 검증 ===' + colors.reset);
  
  // 간단한 테스트 케이스 (수동 계산 가능)
  const simpleCase = {
    initialInvestment: 1000000000, // 10억
    policyFundAmount: 0,
    annualRevenue: [500000000, 500000000, 500000000], // 매년 5억
    operatingProfitRate: 40, // 40% 영업이익률
    taxRate: 0, // 세금 없음 (계산 단순화)
    discountRate: 10,
    analysisYears: 3,
    revenueGrowthRate: 0,
    marketPenetrationRate: 0,
    customerRetentionRate: 100,
    scenarioType: 'neutral',
    scenarioAdjustmentRate: 0,
    debtRatio: 0,
    workingCapitalRatio: 0,
    depreciationRate: 0
  };
  
  try {
    const result = performInvestmentAnalysis(simpleCase);
    
    // 수동 NPV 계산
    // 연간 현금흐름 = 500백만 * 40% = 200백만
    const annualCashFlow = 200000000;
    const manualNPV = -1000000000 + 
                      annualCashFlow / 1.1 + 
                      annualCashFlow / (1.1 * 1.1) + 
                      annualCashFlow / (1.1 * 1.1 * 1.1);
    
    console.log('테스트 케이스: 초기투자 10억, 매년 순현금흐름 2억, 할인율 10%, 3년');
    console.log(`시스템 계산 NPV: ${formatMoney(result.npv)}`);
    console.log(`수동 계산 NPV: ${formatMoney(manualNPV)}`);
    console.log(`차이: ${formatMoney(Math.abs(result.npv - manualNPV))}`);
    
    const npvMatch = Math.abs(result.npv - manualNPV) < 1000000; // 백만원 이내 오차
    console.log(`NPV 정확성: ${npvMatch ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}`);
    
    // IRR 검증 (NPV = 0이 되는 할인율)
    console.log(`\n시스템 계산 IRR: ${formatPercent(result.irr)}`);
    
    // IRR로 NPV 재계산
    const irrRate = result.irr / 100;
    const npvAtIRR = -1000000000 + 
                     annualCashFlow / (1 + irrRate) + 
                     annualCashFlow / Math.pow(1 + irrRate, 2) + 
                     annualCashFlow / Math.pow(1 + irrRate, 3);
    
    console.log(`IRR에서의 NPV: ${formatMoney(npvAtIRR)}`);
    const irrAccurate = Math.abs(npvAtIRR) < 1000000; // 백만원 이내 오차
    console.log(`IRR 정확성: ${irrAccurate ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}`);
    
  } catch (error) {
    console.log(colors.red + `오류 발생: ${error.message}` + colors.reset);
  }
}

// 4. 극한 상황 테스트
function testEdgeCases() {
  console.log('\n' + colors.blue + '=== 극한 상황 테스트 ===' + colors.reset);
  
  const edgeCases = [
    {
      name: '초기 투자 > 총 수익 (손실 프로젝트)',
      input: {
        initialInvestment: 10000000000,
        policyFundAmount: 0,
        annualRevenue: [1000000000, 1000000000, 1000000000],
        operatingProfitRate: 5,
        taxRate: 22,
        discountRate: 10,
        analysisYears: 3
      }
    },
    {
      name: '매우 높은 할인율',
      input: {
        initialInvestment: 10000000000,
        policyFundAmount: 5000000000,
        annualRevenue: [8000000000, 10000000000, 12000000000],
        operatingProfitRate: 20,
        taxRate: 22,
        discountRate: 50, // 50% 할인율
        analysisYears: 3
      }
    },
    {
      name: '음의 영업이익률',
      input: {
        initialInvestment: 5000000000,
        policyFundAmount: 2000000000,
        annualRevenue: [3000000000, 3000000000, 3000000000],
        operatingProfitRate: -10, // 손실
        taxRate: 22,
        discountRate: 10,
        analysisYears: 3
      }
    }
  ];
  
  edgeCases.forEach(testCase => {
    console.log(`\n--- ${testCase.name} ---`);
    
    try {
      // 기본값 설정
      const fullInput = {
        ...testCase.input,
        interestRate: 3.5,
        loanPeriod: 5,
        gracePeriod: 1,
        revenueGrowthRate: 0,
        marketPenetrationRate: 0,
        customerRetentionRate: 100,
        scenarioType: 'neutral',
        scenarioAdjustmentRate: 0,
        debtRatio: 0,
        workingCapitalRatio: 0
      };
      
      const result = performInvestmentAnalysis(fullInput);
      
      console.log(`NPV: ${formatMoney(result.npv)}`);
      console.log(`IRR: ${formatPercent(result.irr)}`);
      console.log(`단순 회수기간: ${formatYears(result.paybackPeriod)}`);
      console.log(`할인 회수기간: ${formatYears(result.discountedPaybackPeriod || -1)}`);
      
      // 결과 검증
      const isValid = isFinite(result.npv) && isFinite(result.irr);
      console.log(`계산 유효성: ${isValid ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}`);
      
    } catch (error) {
      console.log(colors.red + `오류 발생: ${error.message}` + colors.reset);
    }
  });
}

// 5. 성능 테스트
function testPerformance() {
  console.log('\n' + colors.blue + '=== 성능 테스트 ===' + colors.reset);
  
  const largeCase = {
    initialInvestment: 100000000000, // 1000억
    policyFundAmount: 50000000000,
    annualRevenue: Array(20).fill(0).map((_, i) => 10000000000 * (i + 1)), // 20년간 증가
    operatingProfitRate: 15,
    taxRate: 22,
    discountRate: 10,
    analysisYears: 20,
    interestRate: 3.5,
    loanPeriod: 10,
    gracePeriod: 3,
    revenueGrowthRate: 8,
    marketPenetrationRate: 25,
    customerRetentionRate: 92,
    scenarioType: 'neutral',
    scenarioAdjustmentRate: 0,
    debtRatio: 40,
    workingCapitalRatio: 12,
    depreciationRate: 10,
    residualValue: 10000000000,
    inflationRate: 2.5,
    corporateTaxRate: 25
  };
  
  const iterations = 100;
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    performInvestmentAnalysis(largeCase);
  }
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;
  
  console.log(`총 실행 횟수: ${iterations}회`);
  console.log(`총 소요 시간: ${totalTime}ms`);
  console.log(`평균 실행 시간: ${avgTime.toFixed(2)}ms`);
  console.log(`성능 평가: ${avgTime < 50 ? colors.green + '우수' : avgTime < 100 ? colors.yellow + '양호' : colors.red + '개선 필요'} ${colors.reset}`);
}

// 메인 실행 함수
function runAllTests() {
  console.log(colors.blue + '\n========================================');
  console.log('정책자금투자분석도구 종합 테스트 시작');
  console.log('========================================' + colors.reset);
  
  const startTime = Date.now();
  
  // 모든 테스트 실행
  const basicResults = testBasicCalculations();
  testPaybackPeriodDetails();
  testNPVIRRAccuracy();
  testEdgeCases();
  testPerformance();
  
  const endTime = Date.now();
  
  // 종합 결과
  console.log(colors.blue + '\n========================================');
  console.log('테스트 종합 결과');
  console.log('========================================' + colors.reset);
  
  const successCount = basicResults.filter(r => r.success).length;
  const totalCount = basicResults.length;
  
  console.log(`기본 테스트 성공률: ${successCount}/${totalCount} (${(successCount/totalCount*100).toFixed(1)}%)`);
  console.log(`전체 테스트 소요 시간: ${((endTime - startTime) / 1000).toFixed(2)}초`);
  
  console.log('\n투자 분석 주요 지표 설명:');
  console.log('- NPV (순현재가치): 0 이상이면 투자 타당');
  console.log('- IRR (내부수익률): 할인율보다 높으면 투자 타당');
  console.log('- 단순 회수기간: 할인하지 않은 현금흐름 기준 투자금 회수 기간');
  console.log('- 할인 회수기간: 할인된 현금흐름 기준 투자금 회수 기간');
  console.log('- PI (수익성지수): 1.0 이상이면 투자 타당');
  
  console.log(colors.green + '\n✅ 모든 테스트 완료!' + colors.reset);
}

// 테스트 실행
runAllTests(); 