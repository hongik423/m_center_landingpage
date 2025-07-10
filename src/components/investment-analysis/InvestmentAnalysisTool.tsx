'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  FileText, 
  BarChart3,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Download,
  Loader2,
  Shield,
  AlertTriangle,
  XCircle,
  Lightbulb,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  InvestmentInput,
  InvestmentResult,
  performInvestmentAnalysis,
  performScenarioAnalysis,
  performSensitivityAnalysis
} from '@/lib/utils/investment-analysis';
import { 
  generateAIAnalysisReport,
  generateInvestmentDecision,
  interpretSensitivityAnalysis,
  generateAIInvestmentEvaluation,
  diagnoseInvestmentMetrics
} from '@/lib/utils/ai-investment-reporter';
import { 
  calculateInvestmentGrade,
  generateDetailedRecommendation,
  getInvestmentScaleInfo,
  getDynamicGradingCriteria
} from '@/lib/utils/investment-grade';
import InvestmentInputForm from './InvestmentInputForm';
import InvestmentResultDisplay from './InvestmentResultDisplay';
import AIReportDisplay from './AIReportDisplay';
import { generatePDFReport } from '@/lib/utils/pdf-report-generator';
import { calculateDetailedNPV } from '@/lib/utils/npv-calculator';

export default function InvestmentAnalysisTool() {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [investmentInput, setInvestmentInput] = useState<InvestmentInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<InvestmentResult | null>(null);
  const [aiReport, setAiReport] = useState<any>(null);
  const [scenarioResults, setScenarioResults] = useState<any>(null);
  const [sensitivityResults, setSensitivityResults] = useState<any>(null);
  const [npvDetails, setNpvDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiEvaluation, setAIEvaluation] = useState<any>(null);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);

  const handleInputSubmit = async (input: InvestmentInput) => {
    setIsAnalyzing(true);
    setInvestmentInput(input);
    setError(null);
    
    console.log('🔍 투자분석 입력값:', input);

    try {
      // 기본 분석 수행
      const result = performInvestmentAnalysis(input);
      
      console.log('📊 투자분석 결과:', {
        npv: result.npv,
        irr: result.irr,
        paybackPeriod: result.paybackPeriod,
        cashFlows: result.cashFlows.length,
        firstCashFlow: result.cashFlows[0]
      });
      
      // NPV 상세 계산 추가
      const npvDetailsCalc = calculateDetailedNPV(
        input.annualRevenue[0] || 0,
        input.operatingProfitRate,
        input.taxRate,
        input.discountRate,
        input.analysisYears,
        input.initialInvestment - input.policyFundAmount,
        {
          principal: result.cashFlows.map(cf => cf.loanPrincipal),
          interest: result.cashFlows.map(cf => cf.loanInterest)
        },
        input.initialInvestment / 10, // 감가상각 (10년 정액법)
        input.revenueGrowthRate
      );
      
      console.log('📈 NPV 상세 계산:', npvDetailsCalc);
      
      // 결과에 NPV 상세 정보 추가하여 한 번에 설정
      const resultWithDetails = {
        ...result,
        npvDetails: npvDetailsCalc
      };
      
      setAnalysisResult(resultWithDetails);
      setNpvDetails(npvDetailsCalc);

      // 시나리오 분석
      const scenarios = performScenarioAnalysis(input);
      setScenarioResults(scenarios);

      // 민감도 분석
      const sensitivity = performSensitivityAnalysis(input);
      setSensitivityResults(sensitivity);

      // AI 리포트 생성
      const report = generateAIAnalysisReport(result, input, scenarios, sensitivity);
      setAiReport(report);

      // AI 평가 수행 - 🔥 새로운 점수체계 적용
      console.log('🤖 AI 평가 수행 중...');
      try {
        const evaluation = generateAIInvestmentEvaluation(result, input);
        console.log('✅ AI 평가 완료:', evaluation);
        console.log('🔍 AI 평가 상세:', {
          overallGrade: evaluation.overallGrade,
          recommendation: evaluation.recommendation,
          confidence: evaluation.confidence,
          metricsCount: Object.keys(evaluation.metrics).length
        });
        setAIEvaluation(evaluation);
      } catch (aiError) {
        console.error('❌ AI 평가 오류:', aiError);
        // AI 평가 오류가 발생해도 전체 분석을 중단하지 않음
        setAIEvaluation(null);
      }
      
      // 지표 오류 진단
      console.log('🔍 지표 오류 진단 중...');
      try {
        const diagnostic = diagnoseInvestmentMetrics(result, input);
        console.log('✅ 진단 완료:', diagnostic);
        setDiagnosticResults(diagnostic);
      } catch (diagnosticError) {
        console.error('❌ 진단 오류:', diagnosticError);
        // 진단 오류가 발생해도 전체 분석을 중단하지 않음
        setDiagnosticResults(null);
      }

      setStep(2);
    } catch (error) {
      console.error('❌ Analysis error:', error);
      setError(error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!analysisResult || !investmentInput || !aiReport) return;

    try {
      const pdfBlob = await generatePDFReport({
        input: investmentInput,
        result: analysisResult,
        aiReport,
        scenarioAnalysis: scenarioResults,
        sensitivityAnalysis: sensitivityResults
      });

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `정책자금_투자분석_리포트_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  };

  const resetAnalysis = () => {
    setStep(1);
    setInvestmentInput(null);
    setAnalysisResult(null);
    setAiReport(null);
    setScenarioResults(null);
    setSensitivityResults(null);
    setNpvDetails(null);
    setError(null);
    setAIEvaluation(null);
    setDiagnosticResults(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          정책자금 투자분석 도구
        </h1>
        <p className="text-base md:text-xl text-gray-600">
          NPV/IRR 계산과 AI 기반 투자 타당성 분석
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-6 md:mb-8">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 ${
              step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            }`}>
              <span className="text-sm md:text-base font-medium">1</span>
            </div>
            <span className="ml-2 font-medium text-sm md:text-base">투자정보 입력</span>
          </div>
          
          <div className="w-12 md:w-20 h-0.5 bg-gray-300">
            <div className={`h-full bg-blue-600 transition-all duration-500 ${
              step >= 2 ? 'w-full' : 'w-0'
            }`} />
          </div>
          
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 ${
              step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            }`}>
              <span className="text-sm md:text-base font-medium">2</span>
            </div>
            <span className="ml-2 font-medium text-sm md:text-base">분석 결과</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {step === 1 ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8">
            <InvestmentInputForm 
              onSubmit={handleInputSubmit}
              isLoading={isAnalyzing}
            />
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Analysis Results */}
          <Tabs defaultValue="ai-evaluation" className="space-y-4 md:space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="ai-evaluation" className="text-xs md:text-sm">🤖 AI 종합평가</TabsTrigger>
              <TabsTrigger value="financial" className="text-xs md:text-sm">💎 재무분석</TabsTrigger>
              <TabsTrigger value="summary" className="text-xs md:text-sm">📊 핵심지표</TabsTrigger>
              <TabsTrigger value="scenarios" className="text-xs md:text-sm">📈 시나리오</TabsTrigger>
              <TabsTrigger value="ai-report" className="text-xs md:text-sm">🧠 AI 리포트</TabsTrigger>
            </TabsList>

            {/* 오류 진단 및 성공 알림 */}
            {diagnosticResults && (
              <div className="space-y-2">
                {diagnosticResults.hasErrors ? (
                  <Alert className="border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="font-semibold mb-2">🚨 지표 계산 오류 발견:</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {diagnosticResults.errors.map((error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                      <div className="mt-2 font-semibold">🔧 수정 방안:</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {diagnosticResults.fixes.map((fix: string, index: number) => (
                          <li key={index}>{fix}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="font-semibold">✅ 지표 계산 오류 없음</div>
                      <div className="text-sm mt-1">모든 투자 지표가 정상적으로 계산되었습니다.</div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {diagnosticResults.warnings && diagnosticResults.warnings.length > 0 && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <div className="font-semibold mb-2">⚠️ 주의 사항:</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {diagnosticResults.warnings.map((warning: string, index: number) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <TabsContent value="financial">
              {analysisResult && (
                <InvestmentResultDisplay 
                  result={analysisResult}
                  input={investmentInput!}
                />
              )}
            </TabsContent>

            <TabsContent value="summary">
              {aiReport && (
                <div className="space-y-4 md:space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <Card className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">NPV</p>
                          <p className="text-lg md:text-2xl font-bold">
                            {(analysisResult!.npv / 100000000).toFixed(0)}억원
                          </p>
                        </div>
                        <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                      </div>
                    </Card>

                    <Card className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">IRR</p>
                          <p className="text-lg md:text-2xl font-bold">
                            {analysisResult!.irr.toFixed(1)}%
                          </p>
                        </div>
                        <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                      </div>
                    </Card>

                    <Card className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">개정 할인회수기간</p>
                          <p className="text-lg md:text-2xl font-bold">
                            {analysisResult!.paybackPeriod > 0 
                              ? `${analysisResult!.paybackPeriod.toFixed(1)}년`
                              : '미회수'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            정책자금 특성 반영
                          </p>
                        </div>
                        <Calculator className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                      </div>
                    </Card>

                    <Card className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">평균 DSCR</p>
                          <p className="text-lg md:text-2xl font-bold">
                            {(() => {
                              // 🔥 요구사항에 맞는 평균 DSCR 계산
                              if (analysisResult && analysisResult.dscrData && analysisResult.dscrData.length > 0) {
                                const totalOperatingProfit = analysisResult.dscrData.reduce((acc, d) => acc + (d.operatingProfit || 0), 0);
                                const totalDebtService = analysisResult.dscrData.reduce((acc, d) => acc + (d.totalDebtService || 0), 0);
                                const avgDSCR = totalDebtService > 0 ? totalOperatingProfit / totalDebtService : 0;
                                return avgDSCR.toFixed(2);
                              }
                              // 폴백: 기존 방식
                              return analysisResult 
                                ? (analysisResult.dscr.reduce((a, b) => a + b, 0) / analysisResult.dscr.length).toFixed(2)
                                : '0.00';
                            })()}배
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            분석기간 총 영업이익 ÷ 총 부채상환액
                          </p>
                        </div>
                        <Shield className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="scenarios">
              {scenarioResults && sensitivityResults && (
                <div className="space-y-6">
                  {/* Scenario Analysis */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">시나리오 분석</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['conservative', 'base', 'optimistic'].map((scenario) => (
                        <Card key={scenario} className="p-4">
                          <h4 className="font-semibold mb-2">
                            {scenario === 'conservative' ? '보수적' :
                             scenario === 'base' ? '기본' : '낙관적'} 시나리오
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">NPV</span>
                              <span className="font-medium">
                                {(scenarioResults[scenario].npv / 100000000).toFixed(0)}억원
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">IRR</span>
                              <span className="font-medium">
                                {scenarioResults[scenario].irr.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>

                  {/* Sensitivity Analysis */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">민감도 분석</h3>
                    <div className="space-y-4">
                      {interpretSensitivityAnalysis(sensitivityResults).map((interpretation, index) => (
                        <Alert key={index}>
                          <AlertDescription>{interpretation}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ai-report">
              {aiReport ? (
                <AIReportDisplay report={aiReport} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">AI 리포트 준비 중</h3>
                    <p className="text-gray-500">먼저 투자 정보를 입력하고 분석을 실행해 주세요.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="ai-evaluation">
              {aiEvaluation ? (
                <div className="space-y-6">
                  {/* 🚨 AI 평가 성공 알림 */}
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="font-semibold">✅ AI 종합 평가 완료</div>
                      <div className="text-sm mt-1">
                        기존 단순 평가표를 대체하여 8개 핵심 지표를 분석한 고도화된 AI 평가 시스템입니다.
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* AI 평가 요약 카드 */}
                  <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Brain className="h-8 w-8 text-purple-600" />
                          <div>
                            <h3 className="text-xl font-bold text-purple-900">AI 종합 평가 요약</h3>
                            <p className="text-purple-700">인공지능 기반 종합 투자 타당성 분석</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-purple-600">신뢰도</div>
                          <div className="text-2xl font-bold text-purple-900">{aiEvaluation.confidence}%</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <div className="text-sm text-gray-600 mb-2">종합 등급</div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-lg px-3 py-1 ${
                              aiEvaluation.overallGrade.grade === 'A+' ? 'bg-green-500' :
                              aiEvaluation.overallGrade.grade === 'A' ? 'bg-green-400' :
                              aiEvaluation.overallGrade.grade.startsWith('B') ? 'bg-blue-500' :
                              aiEvaluation.overallGrade.grade.startsWith('C') ? 'bg-yellow-500' :
                              'bg-red-500'
                            } text-white`}>
                              {aiEvaluation.overallGrade.grade}
                            </Badge>
                            <span className="font-semibold">{aiEvaluation.overallGrade.score}점</span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <div className="text-sm text-gray-600 mb-2">투자 추천</div>
                          <div className="flex items-center gap-2">
                            {aiEvaluation.recommendation === '강력추천' && <CheckCircle className="h-5 w-5 text-green-600" />}
                            {aiEvaluation.recommendation === '추천' && <TrendingUp className="h-5 w-5 text-blue-600" />}
                            {aiEvaluation.recommendation === '조건부추천' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                            {(aiEvaluation.recommendation === '보류' || aiEvaluation.recommendation === '비추천') && <XCircle className="h-5 w-5 text-red-600" />}
                            <span className="font-semibold text-lg">{aiEvaluation.recommendation}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* 지표별 평가 등급 */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                        지표별 평가 등급
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(aiEvaluation.metrics).map(([key, metric]: [string, any]) => (
                          <div key={key} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-gray-700">{key}</span>
                              <Badge className={`${
                                metric.grade === 'A+' ? 'bg-green-500' :
                                metric.grade === 'A' ? 'bg-green-400' :
                                metric.grade.startsWith('B') ? 'bg-blue-500' :
                                metric.grade.startsWith('C') ? 'bg-yellow-500' :
                                'bg-red-500'
                              } text-white`}>
                                {metric.grade}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              {metric.value} {metric.unit}
                            </div>
                            <div className="text-xs text-gray-500">
                              {metric.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* SWOT 분석 */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="h-6 w-6 text-green-600" />
                        SWOT 분석
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-2">강점 (Strengths)</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            {aiEvaluation.swotAnalysis.strengths.map((strength: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2">기회 (Opportunities)</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            {aiEvaluation.swotAnalysis.opportunities.map((opportunity: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {aiEvaluation.swotAnalysis.weaknesses.length > 0 && (
                          <div className="bg-yellow-50 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 mb-2">약점 (Weaknesses)</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                              {aiEvaluation.swotAnalysis.weaknesses.map((weakness: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {aiEvaluation.swotAnalysis.risks.length > 0 && (
                          <div className="bg-red-50 rounded-lg p-4">
                            <h4 className="font-semibold text-red-800 mb-2">위험 (Risks)</h4>
                            <ul className="text-sm text-red-700 space-y-1">
                              {aiEvaluation.swotAnalysis.risks.map((risk: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 개선 제안사항 */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-yellow-600" />
                        개선 제안사항
                      </h3>
                      <div className="space-y-3">
                        {aiEvaluation.improvementSuggestions.map((suggestion: string, index: number) => (
                          <div key={index} className="bg-yellow-50 rounded-lg p-4 flex items-start">
                            <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-sm text-yellow-800">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 상세 분석 의견 */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FileText className="h-6 w-6 text-purple-600" />
                        AI 상세 분석 의견
                      </h3>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-sm text-purple-800 leading-relaxed whitespace-pre-line">
                          {aiEvaluation.detailedAnalysis}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 🚨 AI 평가 실패 알림 */}
                  <Alert className="border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="font-semibold">❌ 고도화된 AI 평가 시스템 실행 실패</div>
                      <div className="text-sm mt-1">
                        기존 단순 평가표를 대체한 고도화된 AI 평가 시스템 실행 중 오류가 발생했습니다. 
                        브라우저 콘솔을 확인하거나 페이지를 새로고침한 후 다시 시도해주세요.
                      </div>
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardContent className="p-8 text-center">
                      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">고도화된 AI 종합 평가 준비 중</h3>
                      <p className="text-gray-500">기존 단순 평가표를 대체한 고도화된 AI 평가 시스템입니다. 먼저 투자 정보를 입력하고 분석을 실행해 주세요.</p>
                      
                      {/* 🔧 디버깅 정보 */}
                      <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                        <h4 className="font-semibold text-gray-700 mb-2">🔍 디버깅 정보:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• 투자분석 결과: {analysisResult ? '✅ 완료' : '❌ 없음'}</li>
                          <li>• 투자입력 데이터: {investmentInput ? '✅ 있음' : '❌ 없음'}</li>
                          <li>• AI 평가 상태: {aiEvaluation ? '✅ 완료' : '❌ 실패'}</li>
                          <li>• 진단 결과: {diagnosticResults ? '✅ 완료' : '❌ 없음'}</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mt-6 md:mt-8">
            <Button variant="outline" onClick={resetAnalysis} className="w-full md:w-auto">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              새로운 분석
            </Button>
            
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              {/* 🔥 모바일 전용 DSCR 바로가기 버튼 */}
              <Button 
                variant="outline"
                onClick={() => {
                  const dscrSection = document.querySelector('[data-dscr-section]');
                  if (dscrSection) {
                    dscrSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block md:hidden w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                📊 DSCR 상세분석 보기
              </Button>
              
              <Button onClick={handleDownloadReport} className="w-full md:w-auto">
                <Download className="w-4 h-4 mr-2" />
                PDF 리포트 다운로드
              </Button>
            </div>
          </div>
          
          {/* 🔥 모바일 전용 스크롤 가이드 */}
          <div className="block md:hidden mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">📱 모바일 이용 가이드</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 차트는 좌우로 스크롤하여 확인할 수 있습니다</li>
              <li>• 탭을 터치하여 다양한 분석 결과를 확인하세요</li>
              <li>• 접기/펼치기 버튼으로 상세 정보를 확인할 수 있습니다</li>
              <li>• DSCR 상세분석은 위 버튼을 통해 바로 이동 가능합니다</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
} 