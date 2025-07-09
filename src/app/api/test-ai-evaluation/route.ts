import { NextRequest, NextResponse } from 'next/server';
import { generateAIInvestmentEvaluation, diagnoseInvestmentMetrics } from '@/lib/utils/ai-investment-reporter';
import { performInvestmentAnalysis, InvestmentInput } from '@/lib/utils/investment-analysis';

export async function GET(request: NextRequest) {
  try {
    // 테스트 데이터 (로그에서 확인된 데이터 기반)
    const testInput: InvestmentInput = {
      initialInvestment: 35 * 100000000, // 35억원
      policyFundAmount: 10 * 100000000,  // 10억원
      interestRate: 2.5,
      loanPeriod: 7,
      gracePeriod: 2,
      repaymentPeriod: 5,
      annualRevenue: 100 * 100000000,    // 100억원
      operatingProfitRate: 17.5,
      discountRate: 10,
      analysisYears: 10,
      revenueGrowthRate: 5,
      taxRate: 22,
      otherDebtAmount: 30 * 100000000,   // 30억원
      otherDebtRate: 5.0,
      otherDebtGracePeriod: 0,
      otherDebtRepaymentPeriod: 10,
      corporateTaxRate: 22,
      workingCapitalRatio: 5,
      costInflationRate: 2,
      depreciationRate: 10,
      residualValue: 5 * 100000000,      // 5억원
      scenarioType: 'neutral',
      enableScenarioAnalysis: false,
      selectedScenario: 'neutral'
    };

    console.log('🚀 AI 종합 평가 엔진 테스트 시작');
    
    // 1. 투자분석 수행
    console.log('📊 1단계: 투자분석 수행 중...');
    const investmentResult = performInvestmentAnalysis(testInput);
    
    // 평균 DSCR 계산
    const avgDSCR = investmentResult.dscr.reduce((sum, dscr) => sum + dscr, 0) / investmentResult.dscr.length;
    
    const analysisResults = {
      npv: (investmentResult.npv / 100000000).toFixed(1) + '억원',
      irr: investmentResult.irr.toFixed(1) + '%',
      paybackPeriod: investmentResult.paybackPeriod > 0 ? investmentResult.paybackPeriod.toFixed(1) + '년' : '미회수',
      roi: investmentResult.roi.toFixed(1) + '%',
      profitabilityIndex: investmentResult.profitabilityIndex.toFixed(2),
      riskAdjustedReturn: investmentResult.riskAdjustedReturn.toFixed(1) + '%',
      economicValueAdded: (investmentResult.economicValueAdded / 100000000).toFixed(1) + '억원',
      avgDSCR: avgDSCR.toFixed(2) + '배'
    };
    
    console.log('✅ 투자분석 완료:', analysisResults);
    
    // 2. 오류 진단 수행
    console.log('🔍 2단계: 지표 오류 진단 중...');
    const diagnostics = diagnoseInvestmentMetrics(investmentResult, testInput);
    
    if (diagnostics.hasErrors) {
      console.log('❌ 오류 발견:', diagnostics.errors);
      console.log('🔧 수정 방안:', diagnostics.fixes);
    } else {
      console.log('✅ 지표 계산 오류 없음');
    }
    
    if (diagnostics.warnings.length > 0) {
      console.log('⚠️  경고사항:', diagnostics.warnings);
    }
    
    // 3. AI 평가 수행
    console.log('🤖 3단계: AI 종합 평가 수행 중...');
    const aiEvaluation = generateAIInvestmentEvaluation(investmentResult, testInput);
    
    const aiResults = {
      overallGrade: aiEvaluation.overallGrade.grade,
      overallScore: aiEvaluation.overallGrade.score,
      recommendation: aiEvaluation.recommendation,
      confidence: aiEvaluation.confidence
    };
    
    console.log('✅ AI 평가 완료:', aiResults);
    
    // 4. 지표별 평가 결과
    const metricResults: any = {};
    Object.entries(aiEvaluation.metrics).forEach(([key, metric]) => {
      const metricNames: { [key: string]: string } = {
        npv: 'NPV',
        irr: 'IRR',
        dscr: 'DSCR',
        discountedPayback: '할인회수기간',
        roi: 'ROI',
        profitabilityIndex: 'PI',
        riskAdjustedReturn: '위험조정수익률',
        economicValueAdded: 'EVA'
      };
      
      metricResults[metricNames[key]] = {
        grade: metric.grade,
        score: metric.score,
        description: metric.description
      };
    });
    
    console.log('📈 지표별 평가 결과:', metricResults);
    
    // 5. SWOT 분석 결과
    console.log('📋 SWOT 분석 결과:', {
      strengths: aiEvaluation.summary.strengths,
      opportunities: aiEvaluation.summary.opportunities,
      weaknesses: aiEvaluation.summary.weaknesses,
      risks: aiEvaluation.summary.risks
    });
    
    // 6. 개선 제안
    console.log('💡 개선 제안:', aiEvaluation.recommendations);
    
    // 7. 상세 분석 의견
    console.log('📝 상세 분석 의견:', aiEvaluation.detailedAnalysis);
    
    console.log('🎉 AI 종합 평가 엔진 테스트 완료!');
    
    // 응답 데이터 구성
    const responseData = {
      success: true,
      testResults: {
        step1_analysis: analysisResults,
        step2_diagnostics: {
          hasErrors: diagnostics.hasErrors,
          errors: diagnostics.errors,
          warnings: diagnostics.warnings,
          fixes: diagnostics.fixes
        },
        step3_ai_evaluation: aiResults,
        step4_metric_grades: metricResults,
        step5_swot_analysis: {
          strengths: aiEvaluation.summary.strengths,
          opportunities: aiEvaluation.summary.opportunities,
          weaknesses: aiEvaluation.summary.weaknesses,
          risks: aiEvaluation.summary.risks
        },
        step6_recommendations: aiEvaluation.recommendations,
        step7_detailed_analysis: aiEvaluation.detailedAnalysis
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error('❌ AI 평가 엔진 테스트 실행 중 오류 발생:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 