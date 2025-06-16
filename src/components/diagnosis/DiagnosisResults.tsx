'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useDiagnosisStore, DiagnosisProcessor } from '@/lib/stores/diagnosisStore';
// import { ReportGenerator } from '@/lib/utils/reportGenerator';
import { 
  ArrowLeft,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Target,
  Lightbulb,
  BarChart3,
  PieChart,
  Star,
  Calendar,
  Mail,
  Phone,
  Send,
  FileType
} from 'lucide-react';

interface DiagnosisData {
  companyName: string;
  industry: string;
  companySize: string;
  establishedYear: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  position: string;
  businessModel: string;
  mainProducts: string;
  targetMarket: string;
  annualRevenue: string;
  mainChallenges: string[];
  urgentIssues: string;
  businessGoals: string[];
  expectedOutcome: string;
  hasCompetitorAnalysis: boolean;
  hasTechnologyInfrastructure: boolean;
  hasMarketingStrategy: boolean;
  additionalInfo?: string;
}

interface DiagnosisResultsProps {
  data: DiagnosisData;
  onBack: () => void;
  onNewDiagnosis: () => void;
}

export default function DiagnosisResults({ data, onBack, onNewDiagnosis }: DiagnosisResultsProps) {
  const [results, setResults] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    // 진단 결과 생성
    const diagnosisResults = DiagnosisProcessor.generateResults(data);
    setResults(diagnosisResults);
    
    // 클라이언트에서만 스토어 업데이트
    if (typeof window !== 'undefined') {
      const { addToHistory, setCurrentResults } = useDiagnosisStore.getState();
      setCurrentResults(diagnosisResults);
      addToHistory(diagnosisResults);
    }
  }, [data]);

  const handleDownloadReport = async (format: 'text' | 'html' = 'html') => {
    setIsGeneratingReport(true);
    
    try {
      // 간단한 보고서 다운로드 기능
      const reportContent = `
진단 보고서 - ${data.companyName}
생성일: ${new Date().toLocaleDateString()}

종합 점수: ${results?.overallScore || 0}/100
시장 위치: ${results?.marketPosition || 'N/A'}

강점:
${results?.strengths?.map((s: string) => `- ${s}`).join('\n') || '없음'}

개선사항:
${results?.weaknesses?.map((w: string) => `- ${w}`).join('\n') || '없음'}

추천사항:
${results?.recommendations?.map((r: any) => `- [${r.category}] ${r.action}`).join('\n') || '없음'}
      `;
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `진단보고서_${data.companyName}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    
    try {
      // 이메일 전송 기능은 향후 구현 예정
      alert(`${data.contactEmail}로 보고서 전송 기능이 곧 추가될 예정입니다.`);
    } catch (error) {
      console.error('Email sending failed:', error);
      alert('이메일 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">진단 결과를 분석 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">진단 결과</h1>
          <p className="text-gray-600 mt-2">{data.companyName}의 종합 진단 보고서</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            뒤로가기
          </Button>
          <Button
            variant="outline"
            onClick={onNewDiagnosis}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            새 진단
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDownloadReport('text')}
            disabled={isGeneratingReport}
            className="flex items-center gap-2"
          >
            <FileType className="h-4 w-4" />
            텍스트 다운로드
          </Button>
          <Button
            onClick={() => handleDownloadReport('html')}
            disabled={isGeneratingReport}
            className="flex items-center gap-2"
          >
            {isGeneratingReport ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                생성 중...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                HTML 보고서
              </>
            )}
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSendingEmail}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {isSendingEmail ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                전송 중...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                이메일 전송
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">종합 점수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {results.overallScore}
              <span className="text-lg text-gray-500">/100</span>
            </div>
            <Progress value={results.overallScore} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">시장 위치</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge 
              variant={results.marketPosition === '우수' ? 'default' : 
                      results.marketPosition === '양호' ? 'secondary' : 'destructive'}
              className="text-sm"
            >
              {results.marketPosition}
            </Badge>
            <p className="text-sm text-gray-600 mt-2">현재 시장에서의 위치</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">성장 잠재력</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{results.industryGrowth}%</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">업계 평균 대비</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">경쟁 강도</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge 
              variant={results.competitiveness === '높음' || results.competitiveness === '매우 높음' ? 'destructive' : 'secondary'}
            >
              {results.competitiveness}
            </Badge>
            <p className="text-sm text-gray-600 mt-2">시장 경쟁 수준</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">종합 분석</TabsTrigger>
          <TabsTrigger value="strengths">강점 & 약점</TabsTrigger>
          <TabsTrigger value="recommendations">추천 사항</TabsTrigger>
          <TabsTrigger value="details">상세 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  비즈니스 현황 요약
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">업종</Label>
                  <p className="text-base">{data.industry}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">비즈니스 모델</Label>
                  <p className="text-base">{data.businessModel}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">회사 규모</Label>
                  <p className="text-base">{data.companySize}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">연 매출</Label>
                  <p className="text-base">{data.annualRevenue}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  주요 도전과제
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(data.mainChallenges || []).map((challenge, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{challenge}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  주요 강점
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.strengths.map((strength: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-5 w-5" />
                  개선 필요 사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.weaknesses.map((weakness: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <p className="text-sm">{weakness}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                추천 액션 아이템
              </CardTitle>
              <CardDescription>
                진단 결과를 바탕으로 한 구체적인 실행 방안을 제시합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.recommendations.map((rec: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={rec.priority === '높음' ? 'destructive' : 'secondary'}>
                          {rec.priority}
                        </Badge>
                        <span className="font-semibold">{rec.category}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {rec.timeline}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{rec.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>상세 분석 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">비즈니스 모델 분석</h4>
                  <div className="flex items-center gap-4 mb-2">
                    <Progress value={results.detailedAnalysis.businessModel.score} className="flex-1" />
                    <span className="text-sm font-medium">{results.detailedAnalysis.businessModel.score}/100</span>
                  </div>
                  <p className="text-sm text-gray-600">{results.detailedAnalysis.businessModel.feedback}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">시장 이해도</h4>
                  <div className="flex items-center gap-4 mb-2">
                    <Progress value={results.detailedAnalysis.market.score} className="flex-1" />
                    <span className="text-sm font-medium">{results.detailedAnalysis.market.score}/100</span>
                  </div>
                  <p className="text-sm text-gray-600">{results.detailedAnalysis.market.feedback}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">운영 체계</h4>
                  <div className="flex items-center gap-4 mb-2">
                    <Progress value={results.detailedAnalysis.operation.score} className="flex-1" />
                    <span className="text-sm font-medium">{results.detailedAnalysis.operation.score}/100</span>
                  </div>
                  <p className="text-sm text-gray-600">{results.detailedAnalysis.operation.feedback}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            추가 상담 안내
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            더 자세한 분석이나 맞춤형 솔루션이 필요하시면 전문가 상담을 신청해주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              이메일 상담 신청
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              전화 상담 예약
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 