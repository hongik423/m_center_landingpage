'use client';

import { AIAnalysisReport } from '@/lib/utils/ai-investment-reporter';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  Shield,
  Target,
  Lightbulb,
  FileText
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIReportDisplayProps {
  report: AIAnalysisReport;
}

export default function AIReportDisplay({ report }: AIReportDisplayProps) {
  const getRiskIcon = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getRiskBadgeColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* 요약 섹션 */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">AI 분석 요약</h3>
            <p className="text-gray-600 leading-relaxed">{report.summary}</p>
          </div>
          <Badge 
            className={`text-xl px-4 py-2 ${
              report.investmentGrade === 'A' ? 'bg-green-500' :
              report.investmentGrade === 'B' ? 'bg-blue-500' :
              report.investmentGrade === 'C' ? 'bg-yellow-500' :
              'bg-red-500'
            } text-white`}
          >
            {report.investmentGrade}등급
          </Badge>
        </div>
      </Card>

      {/* 핵심 발견사항 */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          핵심 발견사항
        </h3>
        <div className="space-y-3">
          {report.keyFindings.map((finding, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-700">{finding}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 상세 분석 탭 */}
      <Tabs defaultValue="profitability" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="profitability">수익성</TabsTrigger>
          <TabsTrigger value="liquidity">유동성</TabsTrigger>
          <TabsTrigger value="stability">안정성</TabsTrigger>
          <TabsTrigger value="growth">성장성</TabsTrigger>
        </TabsList>

        <TabsContent value="profitability">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              수익성 분석
            </h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {report.detailedAnalysis.profitability}
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="liquidity">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              유동성 분석
            </h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {report.detailedAnalysis.liquidity}
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="stability">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              안정성 분석
            </h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {report.detailedAnalysis.stability}
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="growth">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              성장성 분석
            </h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {report.detailedAnalysis.growth}
            </p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 리스크 평가 */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          리스크 평가
        </h3>
        <div className="space-y-4">
          {report.risks.map((risk, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  {getRiskIcon(risk.level)}
                  <h4 className="font-semibold ml-2">{risk.type}</h4>
                </div>
                <Badge className={getRiskBadgeColor(risk.level)}>
                  {risk.level === 'high' ? '높음' : risk.level === 'medium' ? '중간' : '낮음'}
                </Badge>
              </div>
              <p className="text-gray-600 mb-2">{risk.description}</p>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-700">
                  <strong>대응방안:</strong> {risk.mitigation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 기회 요인 */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          기회 요인
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.opportunities.map((opportunity, index) => (
            <Alert key={index} className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {opportunity}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </Card>

      {/* 추천사항 */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          추천사항
        </h3>
        <div className="space-y-3">
          {report.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
              </div>
              <p className="text-gray-700 pt-1">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 