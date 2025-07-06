// 할인된 투자회수기간 상세 계산 테스트

console.log('📊 할인된 투자회수기간 상세 계산\n');

// 입력값
const initialInvestment = 9500000000; // 95억
const policyFund = 8000000000; // 80억  
const actualInvestment = initialInvestment - policyFund; // 15억
const baseRevenue = 12500000000; // 125억
const operatingProfitRate = 0.14; // 14%
const taxRate = 0.22; // 22%
const discountRate = 0.10; // 10%
const growthRate = 0.10; // 10% 성장

console.log('초기 투자금액:', (actualInvestment/100000000).toFixed(1) + '억원');
console.log('연간 매출:', (baseRevenue/100000000).toFixed(1) + '억원');
console.log('영업이익률:', (operatingProfitRate * 100) + '%');
console.log('할인율:', (discountRate * 100) + '%');
console.log('\n연도별 상세 계산:\n');

let cumulativePV = -actualInvestment;
let paybackYear = -1;

for (let year = 1; year <= 9; year++) {
  // 매출 (성장률 적용)
  const revenue = baseRevenue * Math.pow(1 + growthRate, year - 1);
  
  // 영업이익
  const operatingProfit = revenue * operatingProfitRate;
  
  // 세금
  const tax = operatingProfit * taxRate;
  
  // 순이익
  const netIncome = operatingProfit - tax;
  
  // 현금흐름 (간단히 순이익으로 가정)
  const cashFlow = netIncome;
  
  // 할인율 적용
  const discountFactor = Math.pow(1 + discountRate, year);
  const presentValue = cashFlow / discountFactor;
  
  // 이전 누적 PV 저장
  const previousCumulativePV = cumulativePV;
  
  // 누적 현재가치
  cumulativePV += presentValue;
  
  console.log(`${year}년차:`);
  console.log(`  매출: ${(revenue/100000000).toFixed(1)}억`);
  console.log(`  영업이익: ${(operatingProfit/100000000).toFixed(1)}억 (${(operatingProfitRate * 100)}%)`);
  console.log(`  세후순이익: ${(netIncome/100000000).toFixed(1)}억`);
  console.log(`  할인계수: 1/${discountFactor.toFixed(3)} = ${(1/discountFactor).toFixed(3)}`);
  console.log(`  현재가치: ${(presentValue/100000000).toFixed(2)}억`);
  console.log(`  누적 현재가치: ${(cumulativePV/100000000).toFixed(2)}억`);
  
  // 회수 시점 계산
  if (previousCumulativePV < 0 && cumulativePV >= 0 && paybackYear === -1) {
    const yearFraction = -previousCumulativePV / (cumulativePV - previousCumulativePV);
    paybackYear = (year - 1) + yearFraction;
    console.log(`\n✅ 할인 투자회수기간: ${paybackYear.toFixed(2)}년`);
    console.log(`   계산: ${year-1}년 + ${yearFraction.toFixed(3)} = ${paybackYear.toFixed(2)}년\n`);
  }
  
  console.log('');
}

console.log('\n요약:');
console.log('- 초기 투자: 15억원');
console.log('- 연간 영업이익: 17.5억원 (125억 × 14%)');
console.log('- 연간 순이익: 13.65억원 (17.5억 × (1-22%))');
console.log('- 단순 회수기간: 약 1.1년 (15억 ÷ 13.65억)');
console.log(`- 할인 회수기간: ${paybackYear.toFixed(2)}년 (할인율 10% 적용)`);
console.log('\n할인율을 적용하면 미래 현금흐름의 가치가 감소하므로');
console.log('실제 회수기간이 단순 계산보다 길어집니다.'); 