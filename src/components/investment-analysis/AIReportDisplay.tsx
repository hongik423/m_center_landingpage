'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Target,
  BarChart3,
  PieChart,
  Calculator,
  Shield
} from 'lucide-react';
import { InvestmentEvaluation, MetricGrade } from '@/lib/utils/ai-investment-reporter';

interface AIReportDisplayProps {
  evaluation: InvestmentEvaluation;
  className?: string;
}

// 등급별 색상 및 아이콘
const getGradeStyle = (grade: string) => {
  switch (grade) {
    case 'A+':
      return { color: 'bg-green-500', textColor: 'text-green-700', icon: CheckCircle };
    case 'A':
      return { color: 'bg-green-400', textColor: 'text-green-600', icon: CheckCircle };
    case 'B+':
      return { color: 'bg-blue-500', textColor: 'text-blue-700', icon: TrendingUp };
    case 'B':
      return { color: 'bg-blue-400', textColor: 'text-blue-600', icon: TrendingUp };
    case 'C+':
      return { color: 'bg-yellow-500', textColor: 'text-yellow-700', icon: AlertTriangle };
    case 'C':
      return { color: 'bg-yellow-400', textColor: 'text-yellow-600', icon: AlertTriangle };
    case 'D':
      return { color: 'bg-red-500', textColor: 'text-red-700', icon: XCircle };
    case 'F':
      return { color: 'bg-red-600', textColor: 'text-red-800', icon: XCircle };
    default:
      return { color: 'bg-gray-400', textColor: 'text-gray-600', icon: Target };
  }
};

// 추천 등급별 색상
const getRecommendationStyle = (recommendation: string) => {
  switch (recommendation) {
    case '강력추천':
      return { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle };
    case '추천':
      return { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: TrendingUp };
    case '조건부추천':
      return { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: AlertTriangle };
    case '보류':
      return { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: AlertTriangle };
    case '비추천':
      return { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle };
    default:
      return { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: Target };
  }
};

// 지표별 아이콘
const getMetricIcon = (metric: string) => {
  switch (metric) {
    case 'npv':
      return Calculator;
    case 'irr':
      return TrendingUp;
    case 'dscr':
      return Shield;
    case 'discountedPayback':
      return BarChart3;
    case 'roi':
      return PieChart;
    case 'profitabilityIndex':
      return Target;
    case 'riskAdjustedReturn':
      return TrendingDown;
    case 'economicValueAdded':
      return CheckCircle;
    default:
      return Calculator;
  }
};

// 지표 이름 매핑
const getMetricName = (metric: string) => {
  const names: { [key: string]: string } = {
    npv: '순현재가치(NPV)',
    irr: '내부수익률(IRR)',
    dscr: '부채상환비율(DSCR)',
    discountedPayback: '할인회수기간',
    roi: '투자수익률(ROI)',
    profitabilityIndex: '수익성지수(PI)',
    riskAdjustedReturn: '위험조정수익률',
    economicValueAdded: '경제부가가치(EVA)'
  };
  return names[metric] || metric;
};

// 값 포맷팅
const formatValue = (value: number, unit: string) => {
  if (unit === '원') {
    return `${(value / 100000000).toFixed(1)}억원`;
  } else if (unit === '%') {
    return `${value.toFixed(1)}%`;
  } else if (unit === '배') {
    return `${value.toFixed(2)}배`;
  } else if (unit === '년') {
    return value > 0 ? `${value.toFixed(1)}년` : '미회수';
  } else {
    return value.toFixed(2);
  }
};

const AIReportDisplay: React.FC<AIReportDisplayProps> = ({ evaluation, className = '' }) => {
  const overallStyle = getGradeStyle(evaluation.overallGrade.grade);
  const recommendationStyle = getRecommendationStyle(evaluation.recommendation);
  const OverallIcon = overallStyle.icon;
  const RecommendationIcon = recommendationStyle.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 종합 평가 헤더 */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-blue-900">
            <OverallIcon className="h-8 w-8 text-blue-600" />
            AI 종합 평가 및 투자 추천
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 종합 등급 및 추천 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">종합 등급</div>
              <Badge className={`${overallStyle.color} text-white text-lg px-4 py-2`}>
                {evaluation.overallGrade.grade}
              </Badge>
              <div className="text-2xl font-bold mt-2">{evaluation.overallGrade.score}점</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">투자 추천</div>
              <Badge className={`${recommendationStyle.color} text-lg px-4 py-2 border`}>
                <RecommendationIcon className="h-4 w-4 mr-1" />
                {evaluation.recommendation}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">신뢰도</div>
              <div className="space-y-2">
                <Progress value={evaluation.confidence} className="h-3" />
                <div className="text-lg font-semibold">{evaluation.confidence}%</div>
              </div>
            </div>
          </div>
          
          {/* 종합 의견 */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-blue-800 font-medium">
              {evaluation.overallGrade.description}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">지표별 평가</TabsTrigger>
          <TabsTrigger value="analysis">상세 분석</TabsTrigger>
          <TabsTrigger value="swot">SWOT 분석</TabsTrigger>
          <TabsTrigger value="recommendations">개선 제안</TabsTrigger>
        </TabsList>

        {/* 지표별 평가 */}
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                투자 지표별 상세 평가
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(evaluation.metrics).map(([key, metric]) => {
                  const style = getGradeStyle(metric.grade);
                  const Icon = getMetricIcon(key);
                  const MetricIcon = style.icon;
                  
                  return (
                    <div key={key} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <span className="font-semibold">{getMetricName(key)}</span>
                        </div>
                        <Badge className={`${style.color} text-white`}>
                          {metric.grade}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">값</span>
                          <span className="font-bold">{formatValue(metric.value, metric.unit)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">점수</span>
                          <span className="font-semibold">{metric.score}점</span>
                        </div>
                        
                        <Progress value={metric.score} className="h-2" />
                        
                        <div className="text-xs text-gray-600 mt-2">
                          {metric.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 상세 분석 */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                상세 분석 의견
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {evaluation.detailedAnalysis}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SWOT 분석 */}
        <TabsContent value="swot" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 강점 */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  강점 (Strengths)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {evaluation.summary.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                  {evaluation.summary.strengths.length === 0 && (
                    <li className="text-sm text-green-600">특별한 강점이 발견되지 않았습니다.</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* 기회 */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-5 w-5" />
                  기회 (Opportunities)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {evaluation.summary.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-700">
                      <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{opportunity}</span>
                    </li>
                  ))}
                  {evaluation.summary.opportunities.length === 0 && (
                    <li className="text-sm text-blue-600">특별한 기회 요인이 발견되지 않았습니다.</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* 약점 */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  약점 (Weaknesses)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {evaluation.summary.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2 text-yellow-700">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                  {evaluation.summary.weaknesses.length === 0 && (
                    <li className="text-sm text-yellow-600">특별한 약점이 발견되지 않았습니다.</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* 위험 */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <XCircle className="h-5 w-5" />
                  위험 (Threats)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {evaluation.summary.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-red-700">
                      <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                  {evaluation.summary.risks.length === 0 && (
                    <li className="text-sm text-red-600">특별한 위험 요인이 발견되지 않았습니다.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 개선 제안 */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                개선 제안 사항
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {evaluation.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-sm text-gray-700">{recommendation}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIReportDisplay; 