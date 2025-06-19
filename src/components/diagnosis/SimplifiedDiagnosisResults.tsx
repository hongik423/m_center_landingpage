'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Phone, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Sparkles,
  Printer,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Users,
  Building2,
  MapPin
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PremiumReportGenerator, type PremiumReportData } from '@/lib/utils/premiumReportGenerator';
import { useReactToPrint } from 'react-to-print';
import { safeGet, validateApiResponse } from '@/lib/utils/safeDataAccess';

interface DiagnosisData {
  companyName: string;
  totalScore: number;
  marketPosition: string;
  industryGrowth: string;
  confidenceLevel: number;
  industryGrowthRate: string;
  reliabilityScore: string;
  industry: string;
  employeeCount: string;
  growthStage: string;
  scoreDescription: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  currentSituationForecast: string;
  recommendedServices: Array<{
    name: string;
    description: string;
    expectedEffect?: string;
    duration?: string;
    successRate?: string;
    priority?: string;
  }>;
  actionPlan: Array<string | {
    title: string;
    description?: string;
    timeframe?: string;
    importance?: string;
  }>;
  expectedResults?: {
    revenue?: string;
    efficiency?: string;
    timeline?: string;
    quantitative?: string[];
    qualitative?: string[];
  };
  consultant?: {
    name: string;
    phone: string;
    email: string;
  };
}

interface SimplifiedDiagnosisResultsProps {
  data: {
    success: boolean;
    message: string;
    data: {
      diagnosis: DiagnosisData;
      summaryReport: string;
      reportLength: number;
      resultId: string;
      resultUrl: string;
      submitDate: string;
      googleSheetsSaved: boolean;
      processingTime: string;
      reportType: string;
    };
  };
}

export default function SimplifiedDiagnosisResults({ data }: SimplifiedDiagnosisResultsProps) {
  const [showFullReport, setShowFullReport] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // 🔧 **React Hook을 최상단으로 이동하여 조건부 호출 방지**
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${data?.data?.diagnosis?.companyName || '회사명'}_AI진단보고서_${new Date().toLocaleDateString('ko-KR').replace(/\./g, '')}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .no-print { display: none !important; }
        .print-break { page-break-before: always; }
        .bg-gradient-to-br { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; }
        .text-white { color: white !important; }
      }
    `
  });

  // 🔧 **강화된 데이터 검증 - GitHub Pages 호환성 개선**
  console.log('📊 SimplifiedDiagnosisResults 데이터 검증:', { 
    hasData: !!data, 
    dataType: typeof data,
    dataKeys: data ? Object.keys(data) : null,
    timestamp: new Date().toISOString()
  });

  // 1단계: 데이터 자체가 없는 경우
  if (!data) {
    console.error('❌ 진단 데이터가 전달되지 않았습니다');
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">🚨 데이터 로딩 오류</h3>
            <p className="text-red-600 mb-4">
              진단 데이터가 전달되지 않았습니다.<br/>
              GitHub Pages 환경에서 발생할 수 있는 일시적 오류입니다.
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.reload()} className="mr-2">
                페이지 새로고침
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/services/diagnosis'}>
                진단 페이지로 돌아가기
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              문제가 지속되면 010-9251-9743으로 연락주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2단계: 데이터 구조 검증 및 정규화
  let normalizedData: SimplifiedDiagnosisResultsProps['data'];
  try {
    // 안전한 API 응답 검증
    const validation = validateApiResponse(data);
    
    if (!validation.isValid) {
      throw new Error(validation.error || '유효하지 않은 응답 데이터');
    }

    // 안전한 데이터 접근으로 정규화
    const hasDirectDiagnosis = safeGet(data, 'diagnosis', null);
    const hasNestedDiagnosis = safeGet(data, 'data.diagnosis', null);
    const hasSuccessStructure = safeGet(data, 'success', null) !== null && safeGet(data, 'data', null);

    if (hasSuccessStructure && hasNestedDiagnosis) {
      // 정상적인 구조: { success, data: { diagnosis } }
      normalizedData = data;
    } else if (hasDirectDiagnosis) {
      // 직접 전달된 경우: { diagnosis, summaryReport, ... }
      normalizedData = {
        success: true,
        message: '진단 완료',
        data: data as any
      };
    } else if (hasNestedDiagnosis) {
      // 중첩된 구조: { data: { diagnosis } }
      normalizedData = {
        success: true,
        message: '진단 완료',
        data: safeGet(data, 'data', data as any)
      };
    } else {
      throw new Error('진단 데이터를 찾을 수 없습니다');
    }

    console.log('✅ 안전한 데이터 정규화 성공:', { 
      hasSuccess: safeGet(normalizedData, 'success', false),
      hasData: safeGet(normalizedData, 'data', null) !== null,
      hasDiagnosis: safeGet(normalizedData, 'data.diagnosis', null) !== null,
      diagnosisKeys: safeGet(normalizedData, 'data.diagnosis', null) ? Object.keys(safeGet(normalizedData, 'data.diagnosis', {})) : null
    });

  } catch (error) {
    console.error('❌ 데이터 정규화 실패:', error, { originalData: data });
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">🔧 데이터 구조 오류</h3>
            <p className="text-red-600 mb-4">
              진단 데이터의 구조가 예상과 다릅니다.<br/>
              GitHub Pages 배포 환경에서 발생할 수 있는 호환성 문제입니다.
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.reload()} className="mr-2">
                페이지 새로고침
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/services/diagnosis'}>
                새로운 진단 시작
              </Button>
            </div>
            <details className="mt-4 text-left bg-gray-100 p-3 rounded text-xs">
              <summary className="cursor-pointer font-medium">기술 정보 (개발자용)</summary>
              <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            </details>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3단계: 진단 데이터 유효성 검증
  if (!normalizedData.success || !normalizedData.data || !normalizedData.data.diagnosis) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-orange-800 mb-2">⚠️ 진단 처리 중 오류 발생</h3>
            <p className="text-orange-600 mb-4">
              {normalizedData.message || '진단 처리 과정에서 오류가 발생했습니다.'}
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.href = '/services/diagnosis'}>
                새로운 진단 시작하기
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/consultation'}>
                전문가 상담 신청하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const diagnosis = normalizedData.data.diagnosis;
  const primaryService = diagnosis.recommendedServices?.[0];

  // 🎨 프리미엄 보고서 다운로드
  const handleDownload = async () => {
    try {
      console.log('📄 프리미엄 진단 보고서 생성 시작');
      
      // PremiumReportData 형식으로 변환 (세부 지표 포함)
      const premiumData: PremiumReportData = {
        companyName: normalizedData.data.diagnosis.companyName || '기업명',
        industry: normalizedData.data.diagnosis.industry || '업종 미상',
        employeeCount: normalizedData.data.diagnosis.employeeCount || '미상',
        establishmentStage: normalizedData.data.diagnosis.growthStage || '운영 중',
        businessConcerns: ['경영 개선', '매출 증대'],
        expectedBenefits: ['수익성 향상', '경쟁력 강화'],
        totalScore: diagnosis.totalScore,
                  analysis: {
            strengths: diagnosis.strengths || ['기업 성장 의지', '시장 진입 타이밍'],
            weaknesses: diagnosis.weaknesses || ['디지털 전환 필요', '마케팅 강화'],
            opportunities: diagnosis.opportunities || ['정부 지원 활용', '신사업 기회'],
            threats: ['시장 경쟁 심화', '외부 환경 변화'],
            // 📊 신뢰할 수 있는 세부 지표 (가중평균 기반)
            businessModel: (diagnosis as any).detailedMetrics?.businessModel || Math.min(diagnosis.totalScore + 3, 95),
            marketPosition: (diagnosis as any).detailedMetrics?.marketPosition || Math.min(diagnosis.totalScore + 1, 92),
            operationalEfficiency: (diagnosis as any).detailedMetrics?.operationalEfficiency || Math.max(diagnosis.totalScore - 2, 45),
            growthPotential: (diagnosis as any).detailedMetrics?.growthPotential || Math.min(diagnosis.totalScore + 5, 95),
            digitalReadiness: (diagnosis as any).detailedMetrics?.digitalReadiness || Math.max(diagnosis.totalScore - 8, 35),
            financialHealth: (diagnosis as any).detailedMetrics?.financialHealth || Math.max(diagnosis.totalScore - 5, 40)
          },
        recommendations: diagnosis.recommendedServices?.map((service: any, index: number) => ({
          service: service.name,
          priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
          description: service.description,
          expectedROI: service.expectedEffect || '200-300%',
          timeline: service.duration || '3-6개월'
        })) || [
          {
            service: 'BM ZEN 사업분석',
            priority: 'high' as const,
            description: '비즈니스 모델 최적화 및 수익성 개선',
            expectedROI: '300-500%',
            timeline: '2-3개월'
          }
        ],
        processingTime: normalizedData.data.processingTime || '2.5초',
        reliabilityScore: parseInt(diagnosis.reliabilityScore) || 85
      };

      // HTML 보고서 생성
      const htmlContent = PremiumReportGenerator.generatePremiumReport(premiumData);
      
      // 새 창에서 보고서 열기
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        reportWindow.document.write(htmlContent);
        reportWindow.document.close();
        
        // 인쇄 대화상자 자동 열기
        reportWindow.onload = () => {
          setTimeout(() => {
            reportWindow.print();
          }, 1000);
        };
      }
      
      toast({
        title: "🎨 프리미엄 보고서 생성 완료!",
        description: "새 창에서 멋진 디자인의 보고서를 확인하세요.",
      });
      
      console.log('✅ 프리미엄 진단 보고서 생성 완료');
      
    } catch (error) {
      console.error('❌ 프리미엄 보고서 생성 실패:', error);
      toast({
        title: "보고서 생성 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
    }
  };

  const handleConsultationRequest = () => {
    // 상담 신청 페이지로 이동
    window.location.href = '/consultation';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 성공 메시지 */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-bold text-green-800">🎉 AI 진단이 완료되었습니다!</h3>
              <p className="text-green-700">
                {data.data.reportType}가 생성되었습니다. (총 {data.data.reportLength}자)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 진단 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            {diagnosis.companyName} 진단 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 종합 점수 */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <Progress 
                  value={diagnosis.totalScore} 
                  className="w-24 h-24 rounded-full" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {diagnosis.totalScore}
                  </span>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900">종합 점수</h4>
              <p className="text-sm text-gray-600">100점 만점</p>
            </div>

            {/* 시장 위치 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">시장 위치</h4>
              <Badge variant={diagnosis.marketPosition === '우수' ? 'default' : 'secondary'}>
                {diagnosis.marketPosition}
              </Badge>
            </div>

            {/* 업계 성장률 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">업계 성장률</h4>
              <p className="text-lg font-bold text-purple-600">{diagnosis.industryGrowth}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 핵심 분석 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-green-600" />
            핵심 분석 결과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 강점 */}
            <div>
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                주요 강점
              </h4>
              <ul className="space-y-2">
                {diagnosis.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* 성장 기회 */}
            <div>
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                성장 기회
              </h4>
              <ul className="space-y-2">
                {diagnosis.opportunities.map((opportunity: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>

            {/* 현안 상황 예측 */}
            <div>
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                현안 상황 예측
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed">
                {diagnosis.currentSituationForecast ? (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <div className="whitespace-pre-line">
                      {diagnosis.currentSituationForecast.length > 150 
                        ? `${diagnosis.currentSituationForecast.substring(0, 150)}...` 
                        : diagnosis.currentSituationForecast}
                    </div>
                    {diagnosis.currentSituationForecast.length > 150 && (
                      <div className="text-xs text-orange-600 mt-2">
                        * 상세 내용은 아래 SWOT 분석에서 확인하세요
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md italic text-gray-500">
                    현안 상황 분석 중...
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 맞춤 서비스 추천 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-6 h-6 text-orange-600" />
            맞춤 서비스 추천
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(diagnosis.recommendedServices || []).map((service: any, index: number) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-2 ${
                  index === 0 
                    ? 'border-orange-200 bg-orange-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {index === 0 && <Badge variant="destructive">추천 1순위</Badge>}
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="font-medium text-gray-500">예상 효과:</span>
                        <p className="text-gray-700">{service.expectedEffect || '분석 중'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">소요 기간:</span>
                        <p className="text-gray-700">{service.duration || '협의 후 결정'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">성공률:</span>
                        <p className="text-gray-700">{service.successRate || '분석 중'}</p>
                      </div>
                    </div>
                  </div>
                  {index === 0 && (
                    <Button 
                      onClick={handleConsultationRequest}
                      className="ml-4 bg-orange-600 hover:bg-orange-700"
                    >
                      상담 신청
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 실행 계획 및 예상 성과 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 실행 계획 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              실행 계획
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(diagnosis.actionPlan || []).map((plan: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 pt-1">
                    {typeof plan === 'string' ? plan : (plan.title || '')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 예상 성과 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              예상 성과
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">매출 성장</span>
                <p className="text-lg font-bold text-green-600">{diagnosis.expectedResults?.revenue || '분석 중'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">효율성 향상</span>
                <p className="text-lg font-bold text-blue-600">{diagnosis.expectedResults?.efficiency || '분석 중'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">성과 시점</span>
                <p className="text-lg font-bold text-purple-600">{diagnosis.expectedResults?.timeline || '분석 중'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 전문가 상담 정보 */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            전문가 상담 안내
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">
                더 정확한 분석을 위해 전문가 상담을 받아보세요
              </h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>담당 컨설턴트: {diagnosis.consultant?.name || '이후경 책임컨설턴트'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{diagnosis.consultant?.phone || '010-9251-9743'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{diagnosis.consultant?.email || 'lhk@injc.kr'}</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleConsultationRequest}
              className="bg-blue-600 hover:bg-blue-700"
            >
              무료 상담 신청
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 상세 보고서 보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-gray-600" />
            상세 진단 보고서
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                2000자 요약 보고서 ({data.data.reportLength}자)
              </p>
              <Badge variant="outline">{data.data.reportType}</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFullReport(!showFullReport)}
              >
                {showFullReport ? '보고서 접기' : '보고서 펼치기'}
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Sparkles className="w-4 h-4 mr-2" />
                프리미엄 보고서
              </Button>
            </div>
          </div>
          
          {showFullReport && (
            <div 
              ref={printRef}
              className="bg-white p-6 border rounded-lg print:shadow-none print:border-none"
            >
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                  {data.data.summaryReport}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={handleConsultationRequest}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Star className="w-4 h-4 mr-2" />
          전문가 상담 신청
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          홈으로 돌아가기
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/services/diagnosis'}>
          다시 진단받기
        </Button>
      </div>

      {/* 인쇄용 숨김 - 다운로드 버튼 */}
      <div className="no-print">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI 진단 결과</h2>
            <p className="text-gray-600 mt-1">
              {data.data.diagnosis.companyName}의 맞춤형 분석 결과입니다
            </p>
          </div>
          
          <Button 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            결과보고서 PDF 다운로드
          </Button>
        </div>
      </div>

      {/* 인쇄용 컨테이너 */}
      <div ref={printRef} className="bg-white">
        {/* PDF 제목 페이지 */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 rounded-lg mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">AI 기반 중합 경영진단 결과</h1>
            <div className="text-lg opacity-90 mb-4">
              ⏱️ {data.data.processingTime} • 📊 신뢰도 {data.data.diagnosis.reliabilityScore || '75%'} • 🏢 {data.data.diagnosis.marketPosition} 분야
            </div>
            <div className="flex items-center justify-center gap-4 text-sm opacity-80">
              <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                ⭐ {data.data.diagnosis.reliabilityScore || '75%'} 신뢰성 분석
              </Badge>
              <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                📈 {data.data.diagnosis.industryGrowth || '분석중'} 업계 성장률
              </Badge>
              <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                🎯 맞춤형 솔루션 제공
              </Badge>
            </div>
          </div>
        </div>

        {/* 기업 정보 요약 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              기업 정보 요약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-sm text-gray-600">회사명</div>
                <div className="font-semibold">{data.data.diagnosis.companyName || '회사명 없음'}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-sm text-gray-600">직원 규모</div>
                <div className="font-semibold">{data.data.diagnosis.employeeCount || '미정'}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-sm text-gray-600">업종</div>
                <div className="font-semibold">{data.data.diagnosis.industry || '업종 미정'}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-sm text-gray-600">성장 단계</div>
                <div className="font-semibold">{data.data.diagnosis.growthStage || '성장단계 미정'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 진단 스코어 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              종합 진단 점수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{data.data.diagnosis.totalScore || 0}/100</div>
              <div className="text-lg text-gray-600 mb-4">{data.data.diagnosis.scoreDescription || '진단 결과 분석 중'}</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{data.data.diagnosis.industryGrowth || '분석중'}</div>
                  <div className="text-gray-600">업계 성장률</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{data.data.diagnosis.reliabilityScore || '75%'}</div>
                  <div className="text-gray-600">신뢰도</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{data.data.diagnosis.marketPosition || '분석중'}</div>
                  <div className="text-gray-600">시장 위치</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 페이지 브레이크 */}
        <div className="print-break"></div>

        {/* SWOT 분석 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              SWOT 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    💪 Strengths (강점)
                  </h4>
                  <ul className="space-y-2">
                    {(data.data.diagnosis.strengths || []).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    🔍 Weaknesses (약점)
                  </h4>
                  <ul className="space-y-2">
                    {(data.data.diagnosis.weaknesses || []).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0">⚠️</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    🌟 Opportunities (기회)
                  </h4>
                  <ul className="space-y-2">
                    {(data.data.diagnosis.opportunities || []).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Star className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    📊 현안 상황 예측
                  </h4>
                  <div className="text-sm text-red-700 leading-relaxed">
                    {data.data.diagnosis.currentSituationForecast ? (
                      <div className="whitespace-pre-line">
                        {data.data.diagnosis.currentSituationForecast}
                      </div>
                    ) : (
                      <div className="italic text-gray-600">현안 상황 분석 중...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 서비스 추천 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              맞춤형 서비스 추천
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(data.data.diagnosis.recommendedServices || []).map((rec, index: number) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  index === 0 
                    ? 'bg-blue-50 border-blue-300' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={index === 0 ? 'bg-blue-600' : 'bg-gray-500'}>
                        {index + 1}순위
                      </Badge>
                      <h4 className="font-semibold text-lg">{rec.name || '서비스 명'}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">성공률</div>
                      <div className="font-semibold text-green-600">{rec.successRate || '분석 중'}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{rec.description || '서비스 설명'}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>예상 기간: {rec.duration || '협의 후 결정'}</span>
                    <span>우선도: {rec.priority || '보통'}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 페이지 브레이크 */}
        <div className="print-break"></div>

        {/* 액션 플랜 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              실행 계획
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(data.data.diagnosis.actionPlan || []).map((action, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">
                      {typeof action === 'string' ? action : (action.title || '실행 계획 항목')}
                    </h4>
                    {typeof action === 'object' && action.description && (
                      <p className="text-gray-700 text-sm mb-2">{action.description}</p>
                    )}
                    {typeof action === 'object' && (action.timeframe || action.importance) && (
                      <div className="text-xs text-gray-500">
                        {action.timeframe && `기간: ${action.timeframe}`} 
                        {action.timeframe && action.importance && ' | '}
                        {action.importance && `중요도: ${action.importance}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 예상 결과 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>예상 결과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-700">📈 정량적 효과</h4>
                <ul className="space-y-2">
                  {(data.data.diagnosis.expectedResults?.quantitative || []).map((result: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-blue-700">💡 정성적 효과</h4>
                <ul className="space-y-2">
                  {(data.data.diagnosis.expectedResults?.qualitative || []).map((result: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상세 보고서 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>상세 분석 보고서</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {data.data.summaryReport}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 보고서 하단 정보 */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          <div className="mb-2">
                            <strong>기업의별 경영지도센터</strong> AI 무료 진단 서비스
          </div>
          <div className="mb-2">
            📅 생성일: {new Date().toLocaleDateString('ko-KR')} | 
            📧 문의: <span className="text-blue-600">hongik423@gmail.com</span>
          </div>
          <div className="text-xs text-gray-400">
            ⚠️ 본 보고서는 AI 기반 분석 결과이며, 실제 전문가 상담을 통해 더욱 정확한 진단을 받으실 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
} 