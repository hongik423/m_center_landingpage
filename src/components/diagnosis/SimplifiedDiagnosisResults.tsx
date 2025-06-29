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
import { PDFGenerator } from '@/lib/utils/pdfGenerator';

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
  
  // 📊 **문항별 점수 및 카테고리별 점수 인터페이스 추가**
  categoryScores?: {
    productService?: {
      name: string;
      score: number;
      maxScore: number;
      weight: number;
      items: Array<{
        name: string;
        score: number;
        question: string;
      }>;
    };
    customerService?: {
      name: string;
      score: number;
      maxScore: number;
      weight: number;
      items: Array<{
        name: string;
        score: number;
        question: string;
      }>;
    };
    marketing?: {
      name: string;
      score: number;
      maxScore: number;
      weight: number;
      items: Array<{
        name: string;
        score: number;
        question: string;
      }>;
    };
    procurement?: {
      name: string;
      score: number;
      maxScore: number;
      weight: number;
      items: Array<{
        name: string;
        score: number;
        question: string;
      }>;
    };
    storeManagement?: {
      name: string;
      score: number;
      maxScore: number;
      weight: number;
      items: Array<{
        name: string;
        score: number;
        question: string;
      }>;
    };
  };
  
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
  const [isLoading, setIsLoading] = useState(false);
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

  // 2단계: 안전한 데이터 정규화 (여러 형태의 응답 구조 지원)
  let normalizedData: any = {};
  
  try {
    console.log('🔄 데이터 정규화 시작, 원본 구조:', {
      hasSuccess: typeof data.success,
      hasData: typeof data.data,
      dataKeys: data.data ? Object.keys(data.data) : null,
      hasDiagnosis: data.data?.diagnosis ? 'true' : 'false'
    });

    // 🔧 다양한 API 응답 형태에 대응
    if (data.success && data.data) {
      // 정상적인 API 응답 구조
      if (data.data.diagnosis) {
        normalizedData = {
          success: true,
          message: data.message || '진단이 완료되었습니다.',
          data: {
            diagnosis: data.data.diagnosis,
            summaryReport: data.data.summaryReport || '',
            reportLength: data.data.reportLength || 0,
            resultId: data.data.resultId || `DIAG_${Date.now()}`,
            resultUrl: data.data.resultUrl || '',
            submitDate: data.data.submitDate || new Date().toLocaleString('ko-KR'),
            googleSheetsSaved: data.data.googleSheetsSaved || false,
            processingTime: data.data.processingTime || '알 수 없음',
            reportType: data.data.reportType || 'AI 진단 보고서'
          }
        };
      }
      // 백업: data 안에 직접 진단 정보가 있는 경우
      else if ((data.data as any).companyName || (data.data as any).totalScore) {
        normalizedData = {
          success: true,
          message: data.message || '진단이 완료되었습니다.',
          data: {
            diagnosis: data.data as any,
            summaryReport: (data.data as any).summaryReport || '',
            reportLength: (data.data as any).reportLength || 0,
            resultId: (data.data as any).resultId || `DIAG_${Date.now()}`,
            resultUrl: (data.data as any).resultUrl || '',
            submitDate: (data.data as any).submitDate || new Date().toLocaleString('ko-KR'),
            googleSheetsSaved: (data.data as any).googleSheetsSaved || false,
            processingTime: (data.data as any).processingTime || '알 수 없음',
            reportType: (data.data as any).reportType || 'AI 진단 보고서'
          }
        };
      }
      // 추가 백업: 중첩된 data 구조인 경우
      else if ((data.data as any).data && (data.data as any).data.diagnosis) {
        normalizedData = {
          success: true,
          message: data.message || '진단이 완료되었습니다.',
          data: (data.data as any).data
        };
      }
      else {
        throw new Error('지원되지 않는 데이터 구조입니다.');
      }
    } else {
      throw new Error('API 응답 구조가 올바르지 않습니다.');
    }

    console.log('✅ 안전한 데이터 정규화 성공:', { 
      hasSuccess: safeGet(normalizedData, 'success', false),
      hasData: safeGet(normalizedData, 'data', null) !== null,
      hasDiagnosis: safeGet(normalizedData, 'data.diagnosis', null) !== null,
      diagnosisKeys: safeGet(normalizedData, 'data.diagnosis', null) ? Object.keys(safeGet(normalizedData, 'data.diagnosis', {})) : null,
      companyName: safeGet(normalizedData, 'data.diagnosis.companyName', 'Unknown'),
      totalScore: safeGet(normalizedData, 'data.diagnosis.totalScore', 0)
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
              API 응답 형식 문제일 수 있습니다.
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

  // 🎨 완전한 AI 기반 종합 경영진단 결과 보고서 생성 및 다운로드
  const handleDownload = async () => {
    try {
      console.log('📄 완전한 AI 기반 종합 경영진단 결과 보고서 생성 시작');
      setIsLoading(true);
      
      // 📊 완전한 진단 결과 데이터 구성
      const completeDiagnosisData = {
        // 기본 정보
        companyInfo: {
          name: diagnosis.companyName || '기업명',
          industry: diagnosis.industry || '업종 미상',
          employeeCount: diagnosis.employeeCount || '미상',
          growthStage: diagnosis.growthStage || '운영 중',
          processingTime: data.data.processingTime || '2.5초',
          reportLength: data.data.reportLength || 2000,
          reportType: data.data.reportType || 'AI 기반 종합 진단'
        },
        
        // 종합 점수 및 핵심 지표
        summary: {
          totalScore: diagnosis.totalScore || 75,
          marketPosition: diagnosis.marketPosition || '양호',
          industryGrowth: diagnosis.industryGrowth || '성장 중',
          reliabilityScore: diagnosis.reliabilityScore || '85%',
          confidenceLevel: diagnosis.confidenceLevel || 85
        },
        
        // 핵심 분석 결과
        analysis: {
          strengths: diagnosis.strengths || ['기업 성장 의지', '시장 적응력'],
          weaknesses: diagnosis.weaknesses || ['디지털 전환 필요', '마케팅 강화'],
          opportunities: diagnosis.opportunities || ['정부 지원 활용', '신사업 기회'],
          currentSituationForecast: diagnosis.currentSituationForecast || '지속적인 성장이 예상되며, 디지털 전환을 통한 경쟁력 강화가 필요합니다.'
        },
        
        // 서비스 추천
        recommendations: diagnosis.recommendedServices || [
          {
            name: 'BM ZEN 사업분석',
            description: '비즈니스 모델 최적화 및 수익성 개선',
            expectedEffect: '매출 20-40% 증대',
            duration: '2-3개월',
            successRate: '95%',
            priority: 'high'
          }
        ],
        
        // 실행 계획
        actionPlan: diagnosis.actionPlan || [
          '7일 내: 무료 상담 신청 및 현황 진단',
          '30일 내: 우선순위 서비스 선택 및 착수',
          '90일 내: 첫 번째 성과 측정 및 전략 조정'
        ],
        
        // 예상 성과
        expectedResults: {
          revenue: diagnosis.expectedResults?.revenue || '매출 20-30% 증대',
          efficiency: diagnosis.expectedResults?.efficiency || '업무효율 40-50% 향상',
          timeline: diagnosis.expectedResults?.timeline || '6개월 내 가시적 성과',
          quantitative: diagnosis.expectedResults?.quantitative || [
            '매출 20-30% 증대',
            '업무효율 40-50% 향상',
            '비용 15-25% 절감'
          ],
          qualitative: diagnosis.expectedResults?.qualitative || [
            '조직 역량 강화',
            '시장 경쟁력 향상',
            '지속가능한 성장 기반 구축'
          ]
        },
        
        // 상세 보고서 내용
        detailedReport: data.data.summaryReport || '상세 분석 결과를 포함한 종합적인 진단 내용입니다.',
        
        // 전문가 정보
        consultant: diagnosis.consultant || {
          name: '이후경 경영지도사',
          phone: '010-9251-9743',
          email: 'hongik423@gmail.com',
          title: '책임컨설턴트',
          experience: '25년 경영컨설팅 전문가'
        }
      };

      // 🎨 완전한 HTML 보고서 생성
      const htmlContent = generateCompleteHTMLReport(completeDiagnosisData);
      
      // 📥 HTML 파일로 다운로드
      const companyName = completeDiagnosisData.companyInfo.name.replace(/[^\w가-힣]/g, '_');
      const currentDate = new Date().toISOString().slice(0, 10);
      const fileName = `M-CENTER_${companyName}_AI기반종합경영진단결과_${currentDate}.html`;
      
      // UTF-8 BOM 추가로 한글 인코딩 보장
      const BOM = '\uFEFF';
      const finalHtmlContent = BOM + htmlContent;
      
      // HTML 파일 다운로드
      const blob = new Blob([finalHtmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "📄 AI 기반 종합 경영진단 결과 다운로드 완료!",
        description: `완전한 진단 결과 보고서를 HTML 파일로 다운로드했습니다. (${completeDiagnosisData.companyInfo.reportLength}자)`,
        duration: 5000,
      });
      
      console.log('✅ 완전한 AI 기반 종합 경영진단 결과 보고서 생성 완료');
      
    } catch (error) {
      console.error('❌ 완전한 보고서 생성 실패:', error);
      
      toast({
        title: "보고서 생성 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🎨 완전한 HTML 보고서 생성 함수
  const generateCompleteHTMLReport = (data: any): string => {
    const currentDate = new Date().toLocaleDateString('ko-KR');
    const currentTime = new Date().toLocaleTimeString('ko-KR');
    
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M-CENTER AI 기반 종합 경영진단 결과 - ${data.companyInfo.name}</title>
    <style>
        body { 
            font-family: 'Malgun Gothic', 'Arial Unicode MS', '맑은 고딕', sans-serif; 
            line-height: 1.8; 
            max-width: 1000px; 
            margin: 0 auto; 
            padding: 30px;
            background: #f8fafc;
            color: #1a202c;
        }
        .report-container {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 16px;
            margin-bottom: 40px;
        }
        .company-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .report-subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        .meta-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        .meta-item {
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
        }
        .section {
            margin-bottom: 40px;
            padding: 30px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 6px solid #3b82f6;
        }
        .section-title {
            font-size: 1.5rem;
            color: #1e40af;
            margin-bottom: 20px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .score-section {
            text-align: center;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 40px;
            border-radius: 16px;
            margin-bottom: 40px;
            border: 2px solid #0ea5e9;
        }
        .score-number {
            font-size: 4rem;
            font-weight: bold;
            color: #0ea5e9;
            margin-bottom: 10px;
        }
        .score-description {
            font-size: 1.2rem;
            color: #0369a1;
            margin-bottom: 20px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .metric-item {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        .metric-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 5px;
        }
        .metric-label {
            color: #64748b;
            font-size: 0.9rem;
        }
        .analysis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }
        .analysis-card {
            padding: 25px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        .analysis-card.strengths {
            border-left: 6px solid #16a34a;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        }
        .analysis-card.opportunities {
            border-left: 6px solid #3b82f6;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        }
        .analysis-card.forecast {
            border-left: 6px solid #f59e0b;
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        }
        .analysis-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .analysis-list {
            list-style: none;
            padding: 0;
        }
        .analysis-list li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        .analysis-list li::before {
            content: "▶";
            position: absolute;
            left: 0;
            color: #3b82f6;
        }
        .recommendation-card {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        .recommendation-card.priority-high {
            border-color: #f59e0b;
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        }
        .recommendation-title {
            font-size: 1.3rem;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .recommendation-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
        }
        .meta-detail {
            text-align: center;
        }
        .meta-detail-value {
            font-weight: bold;
            color: #16a34a;
            font-size: 1.1rem;
        }
        .meta-detail-label {
            color: #64748b;
            font-size: 0.8rem;
        }
        .action-timeline {
            background: white;
            border-radius: 12px;
            padding: 25px;
        }
        .action-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }
        .action-number {
            background: #3b82f6;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }
        .results-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        .results-section {
            background: white;
            padding: 25px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        .results-section.quantitative {
            border-left: 6px solid #16a34a;
        }
        .results-section.qualitative {
            border-left: 6px solid #3b82f6;
        }
        .detailed-report {
            background: white;
            padding: 30px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            line-height: 1.8;
        }
        .consultant-section {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            padding: 30px;
            border-radius: 16px;
            text-align: center;
        }
        .consultant-title {
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .consultant-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .consultant-detail {
            background: rgba(255,255,255,0.2);
            padding: 15px;
            border-radius: 8px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 30px;
            background: #1e293b;
            color: white;
            border-radius: 12px;
        }
        .footer-logo {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .print-page-break {
            page-break-before: always;
        }
        @media print {
            body { background: white; }
            .report-container { box-shadow: none; }
            .print-page-break { break-before: page; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <!-- 보고서 헤더 -->
        <div class="header">
            <div class="company-title">${data.companyInfo.name}</div>
            <div class="report-subtitle">🤖 AI 기반 종합 경영진단 결과</div>
            <div class="meta-info">
                <div class="meta-item">📅 ${currentDate}</div>
                <div class="meta-item">⏰ ${currentTime}</div>
                <div class="meta-item">📊 ${data.companyInfo.reportType}</div>
                <div class="meta-item">📝 ${data.companyInfo.reportLength}자</div>
                <div class="meta-item">⚡ ${data.companyInfo.processingTime}</div>
            </div>
        </div>

        <!-- 기업 기본 정보 -->
        <div class="section">
            <div class="section-title">🏢 기업 기본 정보</div>
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-value">${data.companyInfo.name}</div>
                    <div class="metric-label">회사명</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${data.companyInfo.industry}</div>
                    <div class="metric-label">업종</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${data.companyInfo.employeeCount}</div>
                    <div class="metric-label">직원 규모</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${data.companyInfo.growthStage}</div>
                    <div class="metric-label">성장 단계</div>
                </div>
            </div>
        </div>

        <!-- 종합 진단 점수 -->
        <div class="score-section">
            <div class="score-number">${data.summary.totalScore}<span style="font-size: 2rem;">/100</span></div>
            <div class="score-description">AI 기반 종합 경영진단 점수</div>
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-value">${data.summary.marketPosition}</div>
                    <div class="metric-label">시장 위치</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${data.summary.industryGrowth}</div>
                    <div class="metric-label">업계 성장률</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${data.summary.reliabilityScore}</div>
                    <div class="metric-label">신뢰도</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${data.summary.confidenceLevel}%</div>
                    <div class="metric-label">신뢰성 분석</div>
                </div>
            </div>
        </div>

        <!-- 핵심 분석 결과 -->
        <div class="section">
            <div class="section-title">🎯 핵심 분석 결과</div>
            <div class="analysis-grid">
                <div class="analysis-card strengths">
                    <div class="analysis-title">💪 주요 강점</div>
                    <ul class="analysis-list">
                        ${data.analysis.strengths.map((item: string) => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="analysis-card opportunities">
                    <div class="analysis-title">🌟 성장 기회</div>
                    <ul class="analysis-list">
                        ${data.analysis.opportunities.map((item: string) => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="analysis-card forecast">
                    <div class="analysis-title">📊 현안 상황 예측</div>
                    <div style="padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px; margin-top: 10px;">
                        ${data.analysis.currentSituationForecast}
                    </div>
                </div>
            </div>
        </div>

        <!-- 페이지 브레이크 -->
        <div class="print-page-break"></div>

        <!-- 맞춤 서비스 추천 -->
        <div class="section">
            <div class="section-title">🚀 맞춤 서비스 추천</div>
            ${data.recommendations.map((rec: any, index: number) => `
                <div class="recommendation-card ${index === 0 ? 'priority-high' : ''}">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 15px;">
                        <div class="recommendation-title">${index + 1}순위: ${rec.name}</div>
                        ${index === 0 ? '<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold;">🥇 추천 1순위</span>' : ''}
                    </div>
                    <div style="color: #4b5563; margin-bottom: 15px; line-height: 1.6;">
                        ${rec.description}
                    </div>
                    <div class="recommendation-meta">
                        <div class="meta-detail">
                            <div class="meta-detail-value">${rec.expectedEffect || '분석 중'}</div>
                            <div class="meta-detail-label">예상 효과</div>
                        </div>
                        <div class="meta-detail">
                            <div class="meta-detail-value">${rec.duration || '협의 후 결정'}</div>
                            <div class="meta-detail-label">소요 기간</div>
                        </div>
                        <div class="meta-detail">
                            <div class="meta-detail-value">${rec.successRate || '분석 중'}</div>
                            <div class="meta-detail-label">성공률</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- 실행 계획 -->
        <div class="section">
            <div class="section-title">⚡ 실행 계획</div>
            <div class="action-timeline">
                ${data.actionPlan.map((plan: string, index: number) => `
                    <div class="action-item">
                        <div class="action-number">${index + 1}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: #1e40af; margin-bottom: 5px;">
                                ${index + 1}단계
                            </div>
                            <div style="color: #4b5563;">
                                ${plan}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- 예상 성과 -->
        <div class="section">
            <div class="section-title">📈 예상 성과</div>
            <div class="results-grid">
                <div class="results-section quantitative">
                    <div style="font-size: 1.2rem; font-weight: bold; color: #16a34a; margin-bottom: 15px;">
                        💰 정량적 효과
                    </div>
                    <ul class="analysis-list">
                        ${data.expectedResults.quantitative.map((item: string) => `<li>${item}</li>`).join('')}
                    </ul>
                    <div style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-radius: 8px;">
                        <div style="font-weight: bold; color: #15803d;">핵심 지표</div>
                        <div style="margin-top: 8px; color: #166534;">
                            • 매출: ${data.expectedResults.revenue}<br>
                            • 효율성: ${data.expectedResults.efficiency}<br>
                            • 달성 시점: ${data.expectedResults.timeline}
                        </div>
                    </div>
                </div>
                <div class="results-section qualitative">
                    <div style="font-size: 1.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 15px;">
                        💡 정성적 효과
                    </div>
                    <ul class="analysis-list">
                        ${data.expectedResults.qualitative.map((item: string) => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <!-- 페이지 브레이크 -->
        <div class="print-page-break"></div>

        <!-- 상세 분석 보고서 -->
        <div class="section">
            <div class="section-title">📋 상세 분석 보고서</div>
            <div class="detailed-report">
                <div style="white-space: pre-line; line-height: 1.8; color: #374151; font-size: 14px;">
                    ${data.detailedReport}
                </div>
            </div>
        </div>

        <!-- 전문가 상담 정보 -->
        <div class="consultant-section">
            <div class="consultant-title">📞 전담 전문가 상담</div>
            <div style="font-size: 1.1rem; margin-bottom: 20px; opacity: 0.9;">
                더 정확한 분석과 맞춤형 컨설팅을 원하시면 전문가와 상담하세요
            </div>
            <div class="consultant-info">
                <div class="consultant-detail">
                    <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 5px;">
                        👨‍💼 ${data.consultant.name}
                    </div>
                    <div style="opacity: 0.8;">
                        ${data.consultant.title || '책임컨설턴트'}
                    </div>
                </div>
                <div class="consultant-detail">
                    <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 5px;">
                        📱 ${data.consultant.phone}
                    </div>
                    <div style="opacity: 0.8;">
                        직통 전화
                    </div>
                </div>
                <div class="consultant-detail">
                    <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 5px;">
                        📧 ${data.consultant.email}
                    </div>
                    <div style="opacity: 0.8;">
                        이메일 상담
                    </div>
                </div>
                <div class="consultant-detail">
                    <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 5px;">
                        🎓 ${data.consultant.experience || '25년 경력'}
                    </div>
                    <div style="opacity: 0.8;">
                        전문 경력
                    </div>
                </div>
            </div>
            <div style="margin-top: 25px; padding: 20px; background: rgba(255,255,255,0.2); border-radius: 12px;">
                <div style="font-weight: bold; margin-bottom: 10px;">🆓 무료 서비스</div>
                <div style="opacity: 0.9; line-height: 1.6;">
                    • 첫 상담 (30분) - 완전 무료<br>
                    • 현황 진단 및 우선순위 도출<br>
                    • 정부 지원 프로그램 안내<br>
                    • 맞춤형 실행 계획 제안
                </div>
            </div>
        </div>

        <!-- 보고서 하단 정보 -->
        <div class="footer">
            <div class="footer-logo">🏢 M-CENTER (기업의별)</div>
            <div style="margin: 15px 0; opacity: 0.8;">
                🤖 AI 기반 종합 경영진단 시스템 | 📅 생성일: ${currentDate} ${currentTime}
            </div>
            <div style="font-size: 0.9rem; opacity: 0.7; line-height: 1.6;">
                📧 hongik423@gmail.com | 📞 010-9251-9743 | 🌐 https://m-center.co.kr<br>
                "중소기업의 성장 파트너, M-CENTER와 함께 성공하세요!"
            </div>
            <div style="margin-top: 20px; font-size: 0.8rem; opacity: 0.6;">
                ⚠️ 본 보고서는 AI 기반 분석 결과이며, 전문가 상담을 통해 더욱 정확한 진단을 받으실 수 있습니다.
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  // 📄 강화된 PDF 다운로드 기능
  const handlePDFDownload = async () => {
    try {
      console.log('📄 PDF 다운로드 시작');
      setIsLoading(true);
      
      toast({
        title: "PDF 생성 중...",
        description: "잠시만 기다려주세요. PDF 파일을 생성하고 있습니다.",
        duration: 3000,
      });

      // 🔧 데이터 안전 변환 함수
      const safeExtractText = (item: any): string => {
        if (typeof item === 'string') return item;
        if (item?.category) return item.category;
        if (item?.reason) return item.reason;
        if (item?.title) return item.title;
        if (item?.description) return item.description;
        if (typeof item === 'object') return JSON.stringify(item);
        return String(item || '데이터 없음');
      };

      // 진단 데이터를 PDFGenerator에 맞는 형태로 안전하게 변환
      const pdfDiagnosisData = {
        companyName: diagnosis.companyName || 'Unknown Company',
        overallScore: diagnosis.totalScore || 75,
        marketPosition: diagnosis.marketPosition || '양호',
        industryGrowth: diagnosis.industryGrowth || '성장 중',
        detailedAnalysis: true,
        quickAnalysis: {
          strengths: (diagnosis.strengths || []).map(safeExtractText).filter(Boolean),
          improvements: (diagnosis.weaknesses || []).map(safeExtractText).filter(Boolean),
          opportunities: (diagnosis.opportunities || []).map(safeExtractText).filter(Boolean)
        },
        actionPlan: (diagnosis.actionPlan || []).map(safeExtractText).filter(Boolean),
        // 추가 정보
        currentSituationForecast: diagnosis.currentSituationForecast || '상황 분석 중',
        expectedResults: diagnosis.expectedResults,
        consultant: diagnosis.consultant || {
          name: '이후경 경영지도사',
          phone: '010-9251-9743',
          email: 'hongik423@gmail.com'
        }
      };

      console.log('📊 PDF 변환 데이터:', pdfDiagnosisData);

      // 📦 동적 PDFGenerator 로드
      const { PDFGenerator } = await import('@/lib/utils/pdfGenerator');
      
      // 📄 PDF 생성
      await PDFGenerator.generateDiagnosisPDF(pdfDiagnosisData, {
        title: 'M-CENTER AI 기반 종합 경영진단 결과',
        companyName: diagnosis.companyName || 'Unknown Company',
        includeDetails: true
      });

      toast({
        title: "✅ PDF 다운로드 완료!",
        description: "진단 결과 PDF 파일이 다운로드되었습니다. 다운로드 폴더를 확인해주세요.",
        duration: 5000,
      });

      console.log('✅ PDF 다운로드 성공');

    } catch (error) {
      console.error('❌ PDF 다운로드 오류:', error);
      
      // 🔧 상세 오류 분석 및 사용자 친화적 메시지
      let errorMessage = "PDF 생성 중 오류가 발생했습니다.";
      let suggestion = "다시 시도해주세요.";
      
      if (error instanceof Error) {
        const errorText = error.message.toLowerCase();
        if (errorText.includes('jspdf')) {
          errorMessage = "PDF 라이브러리 초기화 실패";
          suggestion = "브라우저를 새로고침하고 다시 시도해주세요.";
        } else if (errorText.includes('html2canvas')) {
          errorMessage = "화면 캡처 기능 오류";
          suggestion = "브라우저의 하드웨어 가속을 확인해주세요.";
        } else if (errorText.includes('클라이언트')) {
          errorMessage = "클라이언트 환경 오류";
          suggestion = "페이지를 새로고침하고 다시 시도해주세요.";
        } else if (errorText.includes('import')) {
          errorMessage = "모듈 로드 실패";
          suggestion = "네트워크 연결을 확인하고 다시 시도해주세요.";
        }
      }
      
      toast({
        title: "PDF 생성 실패",
        description: `${errorMessage} ${suggestion}`,
        variant: "destructive",
        duration: 7000,
      });

      // 🔄 대안 제안
      const shouldTryAlternative = confirm(
        `PDF 다운로드에 실패했습니다.\n\n오류: ${errorMessage}\n\n대안을 선택해주세요:\n\n1. OK: 텍스트 보고서 다운로드\n2. 취소: HTML 보고서 새 창으로 열기`
      );

      if (shouldTryAlternative) {
                 // 📄 텍스트 보고서 대안
         try {
           // 텍스트 보고서용 간단한 데이터 재구성
           const safeExtract = (item: any): string => {
             if (typeof item === 'string') return item;
             if (item?.category) return item.category;
             if (item?.reason) return item.reason;
             if (item?.title) return item.title;
             if (item?.description) return item.description;
             return String(item || '데이터 없음');
           };
           
           const textReportData = {
             companyName: diagnosis.companyName || 'Unknown Company',
             overallScore: diagnosis.totalScore || 75,
             marketPosition: diagnosis.marketPosition || '양호',
             industryGrowth: diagnosis.industryGrowth || '성장 중',
             quickAnalysis: {
               strengths: (diagnosis.strengths || []).map(safeExtract).filter(Boolean),
               improvements: (diagnosis.weaknesses || []).map(safeExtract).filter(Boolean),
               opportunities: (diagnosis.opportunities || []).map(safeExtract).filter(Boolean)
             },
             actionPlan: (diagnosis.actionPlan || []).map(safeExtract).filter(Boolean)
           };
           
           const { OptimizedReportGenerator } = await import('@/lib/utils/reportGenerator');
           OptimizedReportGenerator.downloadQuickReport(textReportData, 'text');
          
          toast({
            title: "✅ 텍스트 보고서 다운로드 완료",
            description: "PDF 대신 텍스트 형태의 보고서를 다운로드했습니다.",
            duration: 5000,
          });
        } catch (textError) {
          console.error('텍스트 보고서 다운로드 실패:', textError);
          toast({
            title: "텍스트 다운로드 실패",
            description: "텍스트 보고서 다운로드도 실패했습니다. HTML 보고서를 시도해보세요.",
            variant: "destructive",
            duration: 5000,
          });
        }
      } else {
        // 📄 HTML 보고서 대안
        try {
          handleDownload();
          toast({
            title: "HTML 보고서 생성",
            description: "대신 HTML 형태의 상세 보고서를 새 창에서 열었습니다.",
            duration: 5000,
          });
        } catch (htmlError) {
          console.error('HTML 보고서 실패:', htmlError);
          toast({
            title: "모든 다운로드 실패",
            description: "모든 다운로드 방법이 실패했습니다. 관리자에게 문의해주세요.",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsultationRequest = () => {
    // 상담 신청 페이지로 이동
    window.location.href = '/consultation';
  };

  // 📝 **이후경 경영지도사 스타일로 보고서 포맷 개선**
  const formatReportForDisplay = (rawReport: string): string => {
    return rawReport
      // 마크다운 헤더 제거 (## → 빈 줄로 변경)
      .replace(/#{1,6}\s+/g, '')
      // 볼드 표시 제거 (**text** → text)
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // 이탤릭 표시 제거 (*text* → text)  
      .replace(/\*(.*?)\*/g, '$1')
      // 글자수 표기 제거 (598자) 등
      .replace(/\(\d+자\)/g, '')
      // GEMINI, ChatGPT 등 브랜드명 제거
      .replace(/GEMINI|ChatGPT|Gemini/gi, 'AI 도구')
      // 기술적 용어 자연스럽게 변경
      .replace(/생성형 AI/gi, 'AI 기술')
      // 마크다운 리스트 자연스럽게 변경 (- → •)
      .replace(/^-\s+/gm, '• ')
      // 여러 줄바꿈을 적절히 조정
      .replace(/\n{3,}/g, '\n\n')
      // 섹션 구분을 자연스럽게
      .replace(/^(\d+)\.\s*\*\*(.*?)\*\*/gm, '$1. $2')
      // 자연스러운 문단 구분
      .trim();
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
                {data.data.reportType}가 생성되었습니다.
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

      {/* 📊 **5점 척도 평가표 결과 - 카테고리별 및 문항별 점수** */}
      {diagnosis.categoryScores && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              📊 레벨업 시트 평가 결과 (5점 척도)
            </CardTitle>
            <p className="text-sm text-gray-600">
              20개 문항을 5개 카테고리로 분류하여 100점 만점으로 환산한 결과입니다.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {/* 카테고리별 점수 그리드 - Enhanced 진단평가 엔진 결과 안전 처리 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {(() => {
                // Enhanced 진단평가 엔진 결과 안전 검증
                console.log('🔍 카테고리 점수 표시 - 데이터 검증:', {
                  hasCategoryScores: !!diagnosis.categoryScores,
                  categoryScoresType: typeof diagnosis.categoryScores,
                  categoryScoresKeys: diagnosis.categoryScores ? Object.keys(diagnosis.categoryScores) : null,
                  sampleData: diagnosis.categoryScores ? Object.values(diagnosis.categoryScores)[0] : null
                });
                
                if (!diagnosis.categoryScores || typeof diagnosis.categoryScores !== 'object') {
                  console.warn('⚠️ 카테고리 점수 데이터가 없습니다:', diagnosis.categoryScores);
                  return (
                    <div className="col-span-5 text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p>카테고리별 점수 데이터를 불러오는 중입니다...</p>
                      <p className="text-sm mt-2">진단 엔진에서 결과를 처리하고 있습니다.</p>
                    </div>
                  );
                }
                
                return Object.entries(diagnosis.categoryScores).map(([categoryKey, category]) => {
                  // 안전한 데이터 처리
                  if (!category || typeof category !== 'object') {
                    console.warn(`⚠️ 카테고리 데이터 오류: ${categoryKey}`, category);
                    return null;
                  }
                  
                  // Enhanced 엔진 결과에서 안전하게 점수 추출
                  const safeScore = typeof category.score === 'number' ? category.score : 0;
                  const safeMaxScore = typeof category.maxScore === 'number' ? category.maxScore : 5;
                  const safeName = category.name || categoryKey;
                  const safeWeight = typeof category.weight === 'number' ? category.weight : 0;
                  
                  // 5점 기준을 100점으로 환산
                  const score100 = Math.round((safeScore / safeMaxScore) * 100);
                  
                  const getScoreColor = (score: number) => {
                    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
                    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
                    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
                    return 'text-red-600 bg-red-50 border-red-200';
                  };
                  
                  const getScoreGrade = (score: number) => {
                    if (score >= 80) return 'A급';
                    if (score >= 60) return 'B급';
                    if (score >= 40) return 'C급';
                    return 'D급';
                  };

                  return (
                    <div key={categoryKey} className={`border-2 rounded-lg p-4 text-center ${getScoreColor(score100)}`}>
                      <div className="text-2xl font-bold mb-1">
                        {score100}점
                      </div>
                      <div className="text-xs font-medium mb-2">
                        {getScoreGrade(score100)} ({safeScore.toFixed(1)}/5.0)
                      </div>
                      <div className="text-sm font-medium mb-1">
                        {safeName}
                      </div>
                      <div className="text-xs opacity-75">
                        가중치: {Math.round(safeWeight * 100)}%
                      </div>
                      {/* 프로그레스 바 */}
                      <div className="mt-3">
                        <Progress 
                          value={score100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* 문항별 상세 점수 */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                📝 문항별 상세 점수 (20개 항목)
              </h4>
              
              {(() => {
                // Enhanced 진단평가 엔진 결과에서 문항별 점수 안전 처리
                console.log('🔍 문항별 점수 표시 - 데이터 검증:', {
                  hasCategoryScores: !!diagnosis.categoryScores,
                  categoryCount: diagnosis.categoryScores ? Object.keys(diagnosis.categoryScores).length : 0
                });
                
                if (!diagnosis.categoryScores || typeof diagnosis.categoryScores !== 'object') {
                  return (
                    <div className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p>문항별 점수 데이터를 불러오는 중입니다...</p>
                    </div>
                  );
                }
                
                return Object.entries(diagnosis.categoryScores).map(([categoryKey, category]) => {
                  // 안전한 데이터 처리
                  if (!category || typeof category !== 'object') {
                    console.warn(`⚠️ 카테고리 데이터 오류: ${categoryKey}`, category);
                    return null;
                  }
                  
                  // Enhanced 엔진 결과에서 안전하게 추출
                  const safeItems = Array.isArray(category.items) ? category.items : [];
                  const safeName = category.name || categoryKey;
                  const safeScore = typeof category.score === 'number' ? category.score : 0;
                  
                  if (safeItems.length === 0) {
                    console.warn(`⚠️ 카테고리 ${categoryKey}에 항목이 없습니다:`, category);
                    return null;
                  }
                  
                  const categoryIcons: Record<string, string> = {
                    'productService': '📦',
                    'customerService': '👥', 
                    'marketing': '📈',
                    'procurement': '📊',
                    'storeManagement': '🏪'
                  };

                  return (
                    <div key={categoryKey} className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-lg">{categoryIcons[categoryKey] || '📋'}</span>
                        {safeName} ({safeItems.length}개 문항)
                        <Badge variant="outline" className="ml-auto">
                          평균 {safeScore.toFixed(1)}점
                        </Badge>
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {safeItems.map((item, index) => {
                          // 항목별 안전한 데이터 처리
                          const safeItemScore = typeof item.score === 'number' ? item.score : 0;
                          const safeItemName = item.name || `항목 ${index + 1}`;
                          const safeItemQuestion = item.question || '질문 내용을 불러오는 중...';
                          
                          const getItemScoreColor = (score: number) => {
                            if (score >= 4) return 'text-green-600';
                            if (score >= 3) return 'text-blue-600';
                            if (score >= 2) return 'text-orange-600';
                            return 'text-red-600';
                          };
                          
                          const getItemScoreLabel = (score: number) => {
                            if (score >= 5) return '매우 우수';
                            if (score >= 4) return '우수';
                            if (score >= 3) return '보통';
                            if (score >= 2) return '부족';
                            return '매우 부족';
                          };

                          return (
                            <div key={index} className="bg-white border rounded-md p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm text-gray-900">
                                  {safeItemName}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold ${getItemScoreColor(safeItemScore)}`}>
                                    {safeItemScore}점
                                  </span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getItemScoreColor(safeItemScore)}`}
                                  >
                                    {getItemScoreLabel(safeItemScore)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 mb-2">
                                {safeItemQuestion.length > 80 
                                  ? `${safeItemQuestion.substring(0, 80)}...` 
                                  : safeItemQuestion}
                              </div>
                              {/* 5점 척도 시각화 */}
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((point) => (
                                  <div
                                    key={point}
                                    className={`w-4 h-2 rounded-sm ${
                                      point <= safeItemScore 
                                        ? getItemScoreColor(safeItemScore).includes('green') 
                                          ? 'bg-green-500' 
                                          : getItemScoreColor(safeItemScore).includes('blue')
                                          ? 'bg-blue-500'
                                          : getItemScoreColor(safeItemScore).includes('orange')
                                          ? 'bg-orange-500'
                                          : 'bg-red-500'
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* 점수 분석 요약 */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                💡 평가 결과 요약
              </h5>
              <div className="text-sm text-blue-800 leading-relaxed">
                <p className="mb-2">
                  <strong>종합 점수 {diagnosis.totalScore}점</strong>은 5점 척도 평가표 20개 문항을 가중치 적용하여 100점 만점으로 환산한 결과입니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="font-medium">🏆 우수 영역:</span>
                    <span className="ml-2">
                      {diagnosis.categoryScores && Object.values(diagnosis.categoryScores).filter(cat => cat && (cat.score / cat.maxScore) >= 0.8).map(cat => cat?.name).join(', ') || '균형적 발전'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">⚠️ 개선 영역:</span>
                    <span className="ml-2">
                      {diagnosis.categoryScores && Object.values(diagnosis.categoryScores).filter(cat => cat && (cat.score / cat.maxScore) < 0.6).map(cat => cat?.name).join(', ') || '지속적 성장'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                {diagnosis.strengths.map((strength: any, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {typeof strength === 'string' ? strength : strength.category || strength.reason || JSON.stringify(strength)}
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

      {/* GAP 분석 및 개선 방향 */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-red-600" />
            GAP 분석 및 우선 개선 과제
          </CardTitle>
          <p className="text-sm text-red-700 mt-1">
            현재 수준 vs 목표 수준의 격차 분석 및 개선 우선순위
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 취약점 분석 */}
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                ⚠️ 우선 개선 영역 (3점 이하)
              </h4>
              <div className="space-y-3">
                {Object.values(diagnosis.categoryScores || {}).map((category: any, catIndex: number) => {
                  const weakItems = category.items?.filter((item: any) => item.score <= 3) || [];
                  if (weakItems.length === 0) return null;
                  
                  return (
                    <div key={catIndex} className="border-l-4 border-red-400 pl-3">
                      <h5 className="font-medium text-red-700 text-sm">{category.name}</h5>
                      {weakItems.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="mt-1 text-xs text-red-600">
                          <div className="flex justify-between items-center">
                            <span>{item.name}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-red-500 font-medium">{item.score}점</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-blue-600 font-medium">4점 목표</span>
                              <span className="text-xs bg-red-100 text-red-700 px-1 rounded">
                                GAP {(4 - item.score).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 강점 활용 방안 */}
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                💪 강점 활용 방안 (4점 이상)
              </h4>
              <div className="space-y-3">
                {Object.values(diagnosis.categoryScores || {}).map((category: any, catIndex: number) => {
                  const strongItems = category.items?.filter((item: any) => item.score >= 4) || [];
                  if (strongItems.length === 0) return null;
                  
                  return (
                    <div key={catIndex} className="border-l-4 border-green-400 pl-3">
                      <h5 className="font-medium text-green-700 text-sm">{category.name}</h5>
                      {strongItems.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="mt-1 text-xs text-green-600">
                          <div className="flex justify-between items-center">
                            <span>{item.name}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-green-600 font-medium">{item.score}점</span>
                              <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                                {item.score >= 5 ? '최고' : '우수'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* GAP 개선 로드맵 */}
          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              📅 GAP 개선 로드맵
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-lg font-bold text-red-600 mb-1">1-3개월</div>
                <div className="text-xs text-red-700">긴급 개선 과제</div>
                <div className="text-xs text-gray-600 mt-1">
                  2점 이하 항목 우선 해결
                </div>
              </div>
              <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-lg font-bold text-orange-600 mb-1">4-6개월</div>
                <div className="text-xs text-orange-700">중기 개선 목표</div>
                <div className="text-xs text-gray-600 mt-1">
                  3점 이하 항목 4점 달성
                </div>
              </div>
              <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-lg font-bold text-blue-600 mb-1">7-12개월</div>
                <div className="text-xs text-blue-700">장기 성장 목표</div>
                <div className="text-xs text-gray-600 mt-1">
                  전체 항목 4점 이상 달성
                </div>
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
                  <span>{diagnosis.consultant?.email || 'hongik423@gmail.com'}</span>
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
                상세분석보고서 - GAP 분석 포함
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
              <Button 
                onClick={handleDownload}
                disabled={isLoading}
                className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                style={{ backgroundColor: '#4285F4' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#3367d6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#4285F4';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                    보고서 생성 중...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    결과보고서다운로드
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {showFullReport && (
            <div 
              ref={printRef}
              className="bg-white p-6 border rounded-lg print:shadow-none print:border-none"
            >
              <div className="prose max-w-none">
                <div className="whitespace-pre-line font-sans text-sm leading-relaxed text-gray-700">
                  {formatReportForDisplay(data.data.summaryReport)}
                </div>
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
            disabled={isLoading}
            className="text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            style={{ backgroundColor: '#4285F4' }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = '#3367d6';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = '#4285F4';
              }
            }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                보고서 생성 중...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                결과보고서다운로드
              </>
            )}
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
            <h1 className="text-3xl font-bold mb-2">AI 기반 종합 경영진단 결과</h1>
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
                    {(data.data.diagnosis.strengths || []).map((item: any, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{typeof item === 'string' ? item : item?.category || item?.reason || JSON.stringify(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    🔍 Weaknesses (약점)
                  </h4>
                  <ul className="space-y-2">
                    {(data.data.diagnosis.weaknesses || []).map((item: any, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0">⚠️</span>
                        <span>{typeof item === 'string' ? item : item?.category || item?.reason || JSON.stringify(item)}</span>
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
                    {(data.data.diagnosis.opportunities || []).map((item: any, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Star className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{typeof item === 'string' ? item : item?.category || item?.reason || JSON.stringify(item)}</span>
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
              {(data.data.diagnosis.actionPlan || []).map((action: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">
                      {typeof action === 'string' ? action : (action?.title || action?.category || action?.reason || '실행 계획 항목')}
                    </h4>
                    {typeof action === 'object' && action?.description && (
                      <p className="text-gray-700 text-sm mb-2">{action.description}</p>
                    )}
                    {typeof action === 'object' && (action?.timeframe || action?.importance) && (
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
                  {(data.data.diagnosis.expectedResults?.quantitative || []).map((item: any, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{typeof item === 'string' ? item : item?.category || item?.reason || JSON.stringify(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-blue-700">💡 정성적 효과</h4>
                <ul className="space-y-2">
                  {(data.data.diagnosis.expectedResults?.qualitative || []).map((item: any, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{typeof item === 'string' ? item : item?.category || item?.reason || JSON.stringify(item)}</span>
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
                {formatReportForDisplay(data.data.summaryReport)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 보고서 하단 정보 */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          <div className="mb-2">
            <strong>기업의별 경영지도센터</strong> 
            {(data.data as any).enhanced ? (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                🔮 고급 종합 진단
              </span>
            ) : (
              <span className="ml-2">무료 진단 서비스</span>
            )}
          </div>
          <div className="mb-2">
            📅 생성일: {new Date().toLocaleDateString('ko-KR')} | 
            📧 문의: <span className="text-blue-600">hongik423@gmail.com</span>
            {(data.data as any).analysisEngine && (
              <span className="ml-2 text-xs text-purple-600">
                (분석 엔진: {(data.data as any).analysisEngine})
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            {(data.data as any).enhanced ? (
              <>
                🔮 <strong>고급 분석 시스템 기반</strong> 정교한 진단 결과이며, 전문가 상담을 통해 더욱 정확한 분석을 받으실 수 있습니다.
              </>
            ) : (
              <>
                ⚠️ 본 보고서는 고급 분석 시스템 기반 결과이며, 실제 전문가 상담을 통해 더욱 정확한 진단을 받으실 수 있습니다.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 