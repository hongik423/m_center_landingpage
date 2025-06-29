/**
 * 🧪 Enhanced 진단평가 엔진 v3.0 테스트 스크립트
 * - 5점 척도 → 100점 환산 검증
 * - 카테고리별 Gap 분석 테스트
 * - 진단 보고서 생성 검증
 * - 일관된 점수 계산 알고리즘 확인
 */

const testData = {
  companyName: "테스트컴퍼니",
  industry: "electronics-manufacturing",
  contactManager: "홍길동",
  email: "test@company.com",
  employeeCount: "11-30명",
  businessLocation: "서울특별시",
  
  // 🔥 5점 척도 평가 데이터 (일부만 선택)
  planning_level: 4,
  differentiation_level: 5,
  pricing_level: 3,
  expertise_level: 4,
  quality_level: 5,
  
  customer_greeting: 3,
  customer_service: 4,
  complaint_management: 2,
  customer_retention: 3,
  
  marketing_planning: 4,
  online_marketing: 5,
  sales_strategy: 3,
  
  purchase_management: 3,
  inventory_management: 4,
  
  cleanliness: 5,
  work_flow: 4,
  
  mainConcerns: "온라인 마케팅 강화와 업무 효율성 개선이 필요합니다.",
  expectedBenefits: "매출 30% 증대와 생산성 50% 향상을 기대합니다.",
  privacyConsent: true
};

async function testEnhancedDiagnosisEngine() {
  console.log('🧪 Enhanced 진단평가 엔진 v3.0 테스트 시작\n');
  
  try {
    // API 호출 테스트
    const response = await fetch('http://localhost:3000/api/simplified-diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ API 호출 성공\n');
      
      // 진단 결과 분석
      const diagnosis = result.data.diagnosis;
      
      console.log('📊 Enhanced 진단 결과 분석:');
      console.log('='.repeat(50));
      console.log(`🏢 회사명: ${diagnosis.companyName}`);
      console.log(`🎯 총점: ${diagnosis.totalScore}/100점`);
      console.log(`📈 등급: ${diagnosis.enhancedAnalysis?.gradeInfo?.grade || 'N/A'} (${diagnosis.enhancedAnalysis?.gradeInfo?.description || 'N/A'})`);
      console.log(`📊 신뢰도: ${diagnosis.reliabilityScore}`);
      console.log(`📋 평가 항목: ${diagnosis.selectedItemsCount}/${diagnosis.totalItemsCount}개`);
      
      console.log('\n🔍 Gap 분석 결과:');
      console.log('-'.repeat(30));
      if (diagnosis.enhancedAnalysis?.gapAnalysis) {
        const gap = diagnosis.enhancedAnalysis.gapAnalysis;
        console.log(`📊 전체 Gap 점수: ${gap.overallGap}점`);
        console.log(`🚨 중요 개선사항: ${gap.criticalIssues.length}개`);
        console.log(`⚡ 빠른 개선가능: ${gap.quickWins.length}개`);
        
        console.log('\n📈 카테고리별 Gap:');
        gap.categoryGaps.forEach(catGap => {
          console.log(`  • ${catGap.categoryName}: Gap ${catGap.gap}점 (${catGap.priority} 우선순위, 개선가능성 ${catGap.improvementPotential}%)`);
        });
      }
      
      console.log('\n💡 추천 액션:');
      console.log('-'.repeat(20));
      if (diagnosis.enhancedAnalysis?.recommendedActions) {
        diagnosis.enhancedAnalysis.recommendedActions.slice(0, 3).forEach((action, idx) => {
          console.log(`${idx + 1}. ${action.title}`);
          console.log(`   - 우선순위: ${action.priority}`);
          console.log(`   - 기간: ${action.timeframe}`);
          console.log(`   - 예상효과: ${action.expectedImpact}`);
          console.log(`   - 비용: ${action.implementationCost}`);
        });
      }
      
      console.log('\n📊 업계 비교:');
      console.log('-'.repeat(20));
      if (diagnosis.enhancedAnalysis?.comparisonMetrics) {
        const metrics = diagnosis.enhancedAnalysis.comparisonMetrics;
        console.log(`🏆 업계 상위: ${metrics.industryPercentile}%`);
        console.log(`📈 경쟁 포지션: ${metrics.competitivePosition}`);
        console.log(`🚀 성장 잠재력: ${metrics.growthPotential}점`);
      }
      
      // 점수 계산 일관성 검증
      console.log('\n🔬 점수 계산 일관성 검증:');
      console.log('='.repeat(40));
      
      // 선택된 항목들의 실제 점수 확인
      const detailedScores = diagnosis.detailedScores;
      const selectedScores = Object.entries(detailedScores)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => ({ key, value }));
      
      console.log(`✅ 선택된 항목: ${selectedScores.length}개`);
      console.log('📋 선택된 점수들:');
      selectedScores.forEach(score => {
        console.log(`  • ${score.key}: ${score.value}점`);
      });
      
      // 카테고리별 점수 일관성 검증
      console.log('\n📊 카테고리별 점수 검증:');
      Object.entries(diagnosis.categoryScores).forEach(([key, category]) => {
        if (category.selectedCount > 0) {
          console.log(`  🔸 ${category.name}: ${category.score.toFixed(1)}/5.0 (${category.selectedCount}/${category.totalCount}개)`);
          console.log(`     - 가중치: ${category.weight}%`);
          console.log(`     - Gap: ${category.gapScore?.toFixed(1) || 'N/A'}점`);
        }
      });
      
      // 보고서 길이 및 품질 검증
      console.log('\n📄 보고서 품질 검증:');
      console.log('-'.repeat(30));
      const summaryReport = result.data.summaryReport || '';
      console.log(`📝 요약 보고서 길이: ${summaryReport.length}자`);
      console.log(`🎯 상세 보고서 타입: ${result.data.reportType || 'N/A'}`);
      
      // 처리 시간 확인
      console.log('\n⏱️ 성능 지표:');
      console.log('-'.repeat(20));
      console.log(`🚀 처리 시간: ${result.data.processingTime || 'N/A'}`);
      console.log(`📊 분석 엔진: ${result.data.analysisEngine || 'N/A'}`);
      
      // 경고/에러 확인
      if (result.data.warnings && result.data.warnings.length > 0) {
        console.log('\n⚠️ 경고사항:');
        result.data.warnings.forEach((warning, idx) => {
          console.log(`${idx + 1}. ${warning}`);
        });
      }
      
      if (result.data.errors && result.data.errors.length > 0) {
        console.log('\n❌ 에러사항:');
        result.data.errors.forEach((error, idx) => {
          console.log(`${idx + 1}. ${error}`);
        });
      }
      
      console.log('\n✅ Enhanced 진단평가 엔진 v3.0 테스트 완료!');
      
    } else {
      console.error('❌ API 호출 실패:', result.error);
    }
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.message);
  }
}

// 🔍 점수 계산 알고리즘 직접 테스트
function testScoreCalculationAlgorithm() {
  console.log('\n🧮 점수 계산 알고리즘 직접 테스트');
  console.log('='.repeat(40));
  
  // 5점 척도 데이터
  const scoresData = {
    productService: [4, 5, 3, 4, 5], // 평균: 4.2
    customerService: [3, 4, 2, 3],   // 평균: 3.0
    marketing: [4, 5, 3],            // 평균: 4.0
    procurement: [3, 4],             // 평균: 3.5
    storeManagement: [5, 4]          // 평균: 4.5
  };
  
  const weights = {
    productService: 0.25,    // 25%
    customerService: 0.20,   // 20%
    marketing: 0.25,         // 25%
    procurement: 0.15,       // 15%
    storeManagement: 0.15    // 15%
  };
  
  // 카테고리별 평균 계산
  const categoryAverages = {};
  Object.keys(scoresData).forEach(category => {
    const scores = scoresData[category];
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    categoryAverages[category] = average;
    console.log(`📊 ${category}: ${average.toFixed(2)}/5.0 (${scores.length}개 항목)`);
  });
  
  // 가중평균 계산 (100점 기준)
  let weightedSum = 0;
  let totalWeight = 0;
  
  Object.keys(categoryAverages).forEach(category => {
    const score = categoryAverages[category];
    const weight = weights[category];
    weightedSum += score * weight;
    totalWeight += weight;
    console.log(`🔸 ${category}: ${score.toFixed(2)} × ${weight} = ${(score * weight).toFixed(3)}`);
  });
  
  const finalScore = Math.round((weightedSum / totalWeight) * 20); // 5점 만점을 100점으로 환산
  
  console.log(`\n🎯 계산 결과:`);
  console.log(`📊 가중합계: ${weightedSum.toFixed(3)}`);
  console.log(`📊 총 가중치: ${totalWeight}`);
  console.log(`📊 가중평균: ${(weightedSum / totalWeight).toFixed(3)}/5.0`);
  console.log(`🏆 최종 점수: ${finalScore}/100점`);
  
  // 등급 계산
  let grade = 'D';
  if (finalScore >= 90) grade = 'S';
  else if (finalScore >= 80) grade = 'A';
  else if (finalScore >= 70) grade = 'B';
  else if (finalScore >= 60) grade = 'C';
  
  console.log(`🏅 등급: ${grade}`);
}

// 실행
if (typeof window === 'undefined') {
  // Node.js 환경
  console.log('📋 Enhanced 진단평가 엔진 v3.0 종합 테스트');
  console.log('='.repeat(60));
  
  testScoreCalculationAlgorithm();
  
  console.log('\n🌐 웹 API 테스트를 위해서는 브라우저에서 실행하거나');
  console.log('   다음 명령을 사용하세요:');
  console.log('   node test-enhanced-diagnosis-engine.js');
  
} else {
  // 브라우저 환경
  testEnhancedDiagnosisEngine();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testEnhancedDiagnosisEngine,
    testScoreCalculationAlgorithm,
    testData
  };
} 