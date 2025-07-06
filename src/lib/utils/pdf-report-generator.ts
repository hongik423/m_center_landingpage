import { InvestmentInput, InvestmentResult, ScenarioAnalysis, SensitivityAnalysis } from './investment-analysis';
import { AIAnalysisReport } from './ai-investment-reporter';

export interface PDFReportData {
  input: InvestmentInput;
  result: InvestmentResult;
  aiReport: AIAnalysisReport;
  scenarioAnalysis?: ScenarioAnalysis;
  sensitivityAnalysis?: SensitivityAnalysis[];
}

// PDF 생성 함수 (실제 구현은 jsPDF 등의 라이브러리 필요)
export async function generatePDFReport(data: PDFReportData): Promise<Blob> {
  // 임시 구현 - 실제로는 jsPDF 또는 다른 PDF 라이브러리를 사용해야 합니다
  console.log('PDF 리포트 생성 중...', data);
  
  // HTML to PDF 변환 또는 직접 PDF 생성 로직이 들어갈 자리
  // 예시:
  // const doc = new jsPDF();
  // doc.text('정책자금 투자분석 리포트', 10, 10);
  // ... 데이터 추가
  // return doc.output('blob');
  
  // 임시로 빈 Blob 반환
  return new Blob(['PDF 리포트 내용'], { type: 'application/pdf' });
}

// 리포트 템플릿 생성
export function generateReportHTML(data: PDFReportData): string {
  const { input, result, aiReport } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>정책자금 투자분석 리포트</title>
      <style>
        body { font-family: 'Noto Sans KR', sans-serif; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .grade { font-size: 24px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>정책자금 투자분석 리포트</h1>
        <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
      </div>
      
      <div class="section">
        <h2>투자 개요</h2>
        <p>초기 투자금: ${(input.initialInvestment / 100000000).toFixed(0)}억원</p>
        <p>정책자금: ${(input.policyFundAmount / 100000000).toFixed(0)}억원 (금리 ${input.interestRate}%)</p>
      </div>
      
      <div class="section">
        <h2>분석 결과</h2>
        <p class="grade">투자등급: ${aiReport.investmentGrade}등급</p>
        <p>NPV: ${(result.npv / 100000000).toFixed(0)}억원</p>
        <p>IRR: ${result.irr.toFixed(1)}%</p>
        <p>투자회수기간: ${result.paybackPeriod.toFixed(1)}년</p>
      </div>
      
      <div class="section">
        <h2>AI 분석 요약</h2>
        <p>${aiReport.summary}</p>
      </div>
      
      <!-- 추가 섹션들... -->
    </body>
    </html>
  `;
} 