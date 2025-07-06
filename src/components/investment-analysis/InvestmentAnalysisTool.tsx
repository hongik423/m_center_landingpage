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
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  interpretSensitivityAnalysis
} from '@/lib/utils/ai-investment-reporter';
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
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputSubmit = async (input: InvestmentInput) => {
    setIsAnalyzing(true);
    setInvestmentInput(input);
    
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
      
      // 🔥 NPV 상세 계산 추가
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
    setIsGeneratingReport(false);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          정책자금 투자분석 도구
        </h1>
        <p className="text-xl text-gray-600">
          NPV/IRR 계산과 AI 기반 투자 타당성 분석
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium">투자정보 입력</span>
          </div>
          
          <div className="w-20 h-0.5 bg-gray-300">
            <div className={`h-full bg-blue-600 transition-all duration-500 ${
              step >= 2 ? 'w-full' : 'w-0'
            }`} />
          </div>
          
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">분석 결과</span>
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
          <Tabs defaultValue="financial" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="financial">💎 AI 완전분석</TabsTrigger>
              <TabsTrigger value="summary">📊 종합 요약</TabsTrigger>
              <TabsTrigger value="scenarios">📈 시나리오</TabsTrigger>
              <TabsTrigger value="ai-report">🤖 AI 리포트</TabsTrigger>
            </TabsList>

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
                <div className="space-y-6">
                  {/* Investment Grade */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">투자 등급</h3>
                      <Badge 
                        className={`text-2xl px-6 py-2 ${
                          aiReport.investmentGrade === 'A' ? 'bg-green-500' :
                          aiReport.investmentGrade === 'B' ? 'bg-blue-500' :
                          aiReport.investmentGrade === 'C' ? 'bg-yellow-500' :
                          'bg-red-500'
                        } text-white`}
                      >
                        {aiReport.investmentGrade}등급
                      </Badge>
                    </div>
                    <p className="text-gray-600">{aiReport.summary}</p>
                  </Card>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">NPV</p>
                          <p className="text-2xl font-bold">
                            {(analysisResult!.npv / 100000000).toFixed(0)}억원
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">IRR</p>
                          <p className="text-2xl font-bold">
                            {analysisResult!.irr.toFixed(1)}%
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-green-600" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">개정 할인회수기간</p>
                          <p className="text-2xl font-bold">
                            {analysisResult!.paybackPeriod > 0 
                              ? `${analysisResult!.paybackPeriod.toFixed(1)}년`
                              : '미회수'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            정책자금 특성 반영
                          </p>
                        </div>
                        <Calculator className="w-8 h-8 text-purple-600" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">평균 DSCR</p>
                          <p className="text-2xl font-bold">
                            {(analysisResult!.dscr.reduce((a, b) => a + b, 0) / analysisResult!.dscr.length).toFixed(1)}배
                          </p>
                        </div>
                        <Shield className="w-8 h-8 text-orange-600" />
                      </div>
                    </Card>
                  </div>

                  {/* Investment Decision */}
                  {aiReport && (
                    <Card className="p-6">
                      <h3 className="text-xl font-bold mb-4">투자 의사결정</h3>
                      {(() => {
                        const decision = generateInvestmentDecision(aiReport);
                        return (
                          <div className="space-y-4">
                            <Alert className={
                              decision.decision === 'proceed' ? 'border-green-500' :
                              decision.decision === 'conditional' ? 'border-yellow-500' :
                              'border-red-500'
                            }>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>
                                  {decision.decision === 'proceed' ? '추진 권장' :
                                   decision.decision === 'conditional' ? '조건부 추진' :
                                   '재검토 필요'}
                                </strong>
                                : {decision.rationale}
                              </AlertDescription>
                            </Alert>
                            
                            {decision.conditions && (
                              <div>
                                <h4 className="font-semibold mb-2">조건사항:</h4>
                                <ul className="space-y-1">
                                  {decision.conditions.map((condition, index) => (
                                    <li key={index} className="flex items-start">
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                      <span className="text-sm text-gray-600">{condition}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </Card>
                  )}
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
              {aiReport && (
                <AIReportDisplay report={aiReport} />
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={resetAnalysis}>
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              새로운 분석
            </Button>
            
            <Button onClick={handleDownloadReport}>
              <Download className="w-4 h-4 mr-2" />
              PDF 리포트 다운로드
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
} 