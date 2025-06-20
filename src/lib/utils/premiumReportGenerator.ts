/**
 * 🎨 프리미엄 진단보고서 생성기
 * chatbot_final_report.md 기반 고급 디자인
 */

// 🎨 전문적이고 신뢰감 있는 브랜딩 컬러 시스템
const BRAND_CONFIG = {
  // 주요 컬러 (전문성과 신뢰성 강조)
  primaryColor: '#1e3a8a',      // 진한 블루 (신뢰감, 전문성)
  secondaryColor: '#1e40af',    // 미디엄 블루 (안정감)
  accentColor: '#065f46',       // 차분한 그린 (성장, 안정)
  warningColor: '#c2410c',      // 차분한 오렌지 (주의)
  dangerColor: '#7f1d1d',       // 차분한 레드 (위험)
  
  // 중성 컬러 (가독성과 전문성)
  primaryGray: '#374151',       // 진한 그레이 (텍스트)
  secondaryGray: '#6b7280',     // 미디엄 그레이 (보조 텍스트)
  lightGray: '#f9fafb',         // 라이트 그레이 (배경)
  borderGray: '#e5e7eb',        // 보더 그레이
  
  // 전문적인 그라디언트
  gradients: {
    primary: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    success: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    neutral: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
  },
  
  // 성과 지표별 컬러
  scoreColors: {
    excellent: '#065f46',       // 진한 그린
    good: '#1e40af',           // 진한 블루  
    average: '#c2410c',        // 차분한 오렌지
    poor: '#7f1d1d'            // 차분한 레드
  }
};

export interface PremiumReportData {
  companyName: string;
  industry: string;
  employeeCount: string;
  establishmentStage: string;
  businessConcerns: string[];
  expectedBenefits: string[];
  totalScore: number;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    // 📊 세부 지표 추가 (신뢰할 수 있는 점수 체계)
    businessModel?: number;
    marketPosition?: number;
    operationalEfficiency?: number;
    growthPotential?: number;
    digitalReadiness?: number;
    financialHealth?: number;
  };
  recommendations: Array<{
    service: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    expectedROI: string;
    timeline: string;
  }>;
  processingTime: string;
  reliabilityScore: number;
}

export class PremiumReportGenerator {
  /**
   * 🎨 1500자 이상 고급 진단 보고서 생성
   */
  static generatePremiumReport(data: PremiumReportData): string {
    const currentDate = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M-CENTER AI 진단보고서 - ${data.companyName}</title>
    <style>
        ${this.generateEnhancedCSS()}
    </style>
</head>
<body>
    <div class="report-wrapper">
        ${this.generateHeaderSection(data, currentDate)}
        ${this.generateExecutiveSummarySection(data)}
        ${this.generateScoreSection(data)}
        ${this.generateDetailedMetricsSection(data)}
        ${this.generateIndustryBenchmarkSection(data)}
        ${this.generateSWOTSection(data)}
        ${this.generateMarketAnalysisSection(data)}
        ${this.generateRecommendationSection(data)}
        ${this.generateActionPlanSection(data)}
        ${this.generateRiskManagementSection(data)}
        ${this.generateROIProjectionSection(data)}
        ${this.generateFooterSection(data)}
    </div>
    <script>
        ${this.generateInteractiveJS()}
    </script>
</body>
</html>`;
  }

  /**
   * 🎨 고급 프리미엄 CSS 스타일 (업그레이드)
   */
  private static generateEnhancedCSS(): string {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', 'Malgun Gothic', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: ${BRAND_CONFIG.primaryGray};
            background: ${BRAND_CONFIG.gradients.background};
            min-height: 100vh;
            padding: 20px;
        }

        .report-wrapper {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
            overflow: hidden;
            animation: slideUp 0.8s ease-out;
            border: 1px solid ${BRAND_CONFIG.borderGray};
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* 헤더 섹션 */
        .header-section {
            background: ${BRAND_CONFIG.gradients.primary};
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.4;
        }

        .header-content {
            position: relative;
            z-index: 1;
        }

        .company-name {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .report-title {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }

        .report-meta {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 20px;
        }

        .meta-item {
            background: rgba(255, 255, 255, 0.2);
            padding: 10px 20px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
            font-size: 0.9rem;
        }

        /* 점수 섹션 */
        .score-section {
            padding: 40px;
            text-align: center;
            background: ${BRAND_CONFIG.lightGray};
            border-bottom: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .score-circle {
            width: 200px;
            height: 200px;
            margin: 0 auto 30px;
            position: relative;
            background: conic-gradient(from 0deg, ${BRAND_CONFIG.accentColor} 0deg, ${BRAND_CONFIG.accentColor} var(--score-deg), ${BRAND_CONFIG.borderGray} var(--score-deg));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px rgba(30, 58, 138, 0.12);
        }

        .score-circle::before {
            content: '';
            width: 150px;
            height: 150px;
            background: white;
            border-radius: 50%;
            position: absolute;
        }

        .score-value {
            font-size: 3rem;
            font-weight: 800;
            color: ${BRAND_CONFIG.primaryGray};
            z-index: 1;
        }

        .score-label {
            font-size: 1.1rem;
            color: ${BRAND_CONFIG.secondaryGray};
            margin-top: 10px;
        }

        .score-grade {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 15px;
        }

        /* 성과 지표 차트 */
        .performance-metrics {
            margin-top: 40px;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(30, 58, 138, 0.08);
            border: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .metrics-grid {
            display: grid;
            gap: 20px;
        }

        .metric-item {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .metric-label {
            width: 120px;
            font-weight: 600;
            color: ${BRAND_CONFIG.primaryGray};
            font-size: 0.9rem;
        }

        .metric-bar {
            flex: 1;
            height: 20px;
            background: ${BRAND_CONFIG.borderGray};
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }

        .metric-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 2s ease-in-out;
            position: relative;
            background: linear-gradient(90deg, currentColor 0%, color-mix(in srgb, currentColor 80%, white) 100%);
        }

        .metric-value {
            width: 60px;
            text-align: right;
            font-weight: 600;
            color: ${BRAND_CONFIG.primaryGray};
            font-size: 0.9rem;
        }

        /* 비교 차트 */
        .comparison-chart {
            margin-top: 30px;
            background: ${BRAND_CONFIG.lightGray};
            padding: 25px;
            border-radius: 12px;
            border: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .comparison-bars {
            display: grid;
            gap: 15px;
        }

        .comparison-item {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .comparison-label {
            width: 100px;
            font-weight: 600;
            color: ${BRAND_CONFIG.secondaryGray};
            font-size: 0.85rem;
        }

        .comparison-bar {
            flex: 1;
            height: 25px;
            background: ${BRAND_CONFIG.borderGray};
            border-radius: 12px;
            overflow: hidden;
            position: relative;
        }

        .comparison-fill {
            height: 100%;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 10px;
            color: white;
            font-weight: 600;
            font-size: 0.8rem;
            transition: width 2.5s ease-in-out;
        }

        .our-score {
            background: ${BRAND_CONFIG.gradients.success};
            box-shadow: 0 2px 8px rgba(6, 95, 70, 0.25);
        }

        .industry-average {
            background: linear-gradient(90deg, ${BRAND_CONFIG.secondaryGray} 0%, #9ca3af 100%);
        }

        .top-performers {
            background: linear-gradient(90deg, ${BRAND_CONFIG.warningColor} 0%, #ea580c 100%);
        }

        /* 경영진 요약 섹션 */
        .executive-summary-section {
            padding: 40px;
            background: white;
            border-bottom: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .summary-card {
            background: ${BRAND_CONFIG.lightGray};
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid ${BRAND_CONFIG.primaryColor};
            transition: all 0.3s ease;
        }

        .summary-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(30, 58, 138, 0.12);
        }

        .summary-card h3 {
            color: ${BRAND_CONFIG.primaryColor};
            margin-bottom: 10px;
            font-size: 1.1rem;
        }

        /* 세부 지표 분석 섹션 */
        .detailed-metrics-section {
            padding: 40px;
            background: ${BRAND_CONFIG.lightGray};
            border-bottom: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .metrics-breakdown {
            display: grid;
            gap: 20px;
            margin-top: 20px;
        }

        .metric-analysis {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 3px solid ${BRAND_CONFIG.accentColor};
        }

        .metric-analysis h4 {
            color: ${BRAND_CONFIG.primaryColor};
            margin-bottom: 10px;
        }

        /* 벤치마킹 섹션 */
        .benchmark-section {
            padding: 40px;
            background: white;
            border-bottom: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .benchmark-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .benchmark-item {
            text-align: center;
            padding: 20px;
            background: ${BRAND_CONFIG.lightGray};
            border-radius: 12px;
            border: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .benchmark-label {
            font-size: 0.9rem;
            color: ${BRAND_CONFIG.secondaryGray};
            margin-bottom: 10px;
        }

        .benchmark-value {
            font-size: 1.4rem;
            font-weight: bold;
            color: ${BRAND_CONFIG.primaryColor};
        }

        /* 시장 분석 섹션 */
        .market-analysis-section {
            padding: 40px;
            background: ${BRAND_CONFIG.lightGray};
            border-bottom: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .market-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .market-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(30, 58, 138, 0.08);
            border: 1px solid ${BRAND_CONFIG.borderGray};
            transition: all 0.3s ease;
        }

        .market-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(30, 58, 138, 0.15);
        }

        .market-card h4 {
            color: ${BRAND_CONFIG.primaryColor};
            margin-bottom: 15px;
            font-size: 1.1rem;
        }

        /* 위험 관리 섹션 */
        .risk-management-section {
            padding: 40px;
            background: white;
            border-bottom: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .risk-matrix {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .risk-category {
            padding: 20px;
            border-radius: 12px;
            border: 1px solid;
        }

        .risk-category.high-risk {
            background: #fef2f2;
            border-color: #fca5a5;
        }

        .risk-category.medium-risk {
            background: #fffbeb;
            border-color: #fbbf24;
        }

        .risk-category.low-risk {
            background: #f0fdf4;
            border-color: #86efac;
        }

        .risk-category h4 {
            margin-bottom: 15px;
        }

        .risk-category ul {
            list-style: none;
            padding: 0;
        }

        .risk-category li {
            padding: 5px 0;
            padding-left: 15px;
            position: relative;
        }

        .risk-category li::before {
            content: '▶';
            position: absolute;
            left: 0;
            color: ${BRAND_CONFIG.secondaryGray};
        }

        .mitigation-strategies {
            margin-top: 30px;
            padding: 20px;
            background: ${BRAND_CONFIG.lightGray};
            border-radius: 12px;
            border-left: 4px solid ${BRAND_CONFIG.accentColor};
        }

        /* ROI 예측 섹션 */
        .roi-projection-section {
            padding: 40px;
            background: ${BRAND_CONFIG.lightGray};
            border-bottom: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .roi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .roi-item {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(30, 58, 138, 0.08);
            border: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .roi-item h4 {
            color: ${BRAND_CONFIG.primaryColor};
            margin-bottom: 15px;
            font-size: 1.2rem;
        }

        .roi-details {
            display: grid;
            gap: 10px;
        }

        .roi-metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .roi-label {
            font-weight: 600;
            color: ${BRAND_CONFIG.secondaryGray};
        }

        .roi-value {
            font-weight: bold;
            color: ${BRAND_CONFIG.primaryColor};
        }

        .total-projection {
            margin-top: 30px;
            padding: 25px;
            background: white;
            border-radius: 12px;
            border-left: 4px solid ${BRAND_CONFIG.accentColor};
            text-align: center;
        }

        .total-projection h4 {
            color: ${BRAND_CONFIG.primaryColor};
            margin-bottom: 15px;
        }

        /* SWOT 섹션 */
        .swot-section {
            padding: 40px;
            background: white;
        }

        .section-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: ${BRAND_CONFIG.primaryColor};
            margin-bottom: 30px;
            text-align: center;
            position: relative;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: ${BRAND_CONFIG.gradients.primary};
            border-radius: 2px;
        }

        .swot-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .swot-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            border-left: 4px solid;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .swot-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 28px rgba(30, 58, 138, 0.15);
        }

        .swot-card.strengths { border-left-color: ${BRAND_CONFIG.accentColor}; }
        .swot-card.weaknesses { border-left-color: ${BRAND_CONFIG.warningColor}; }
        .swot-card.opportunities { border-left-color: ${BRAND_CONFIG.secondaryColor}; }
        .swot-card.threats { border-left-color: ${BRAND_CONFIG.dangerColor}; }

        .swot-card-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .swot-list {
            list-style: none;
        }

        .swot-list li {
            padding: 8px 0;
            padding-left: 20px;
            position: relative;
            color: #4b5563;
        }

        .swot-list li::before {
            content: '▶';
            position: absolute;
            left: 0;
            color: #6b7280;
        }

        /* 추천 섹션 */
        .recommendation-section {
            padding: 40px;
            background: ${BRAND_CONFIG.lightGray};
            border-top: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .recommendation-cards {
            display: grid;
            gap: 20px;
            margin-top: 30px;
        }

        .recommendation-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(30, 58, 138, 0.08);
            border: 1px solid ${BRAND_CONFIG.borderGray};
            transition: all 0.3s ease;
        }

        .recommendation-card:hover {
            border-color: ${BRAND_CONFIG.secondaryColor};
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(30, 58, 138, 0.15);
        }

        .recommendation-card.high-priority {
            border-left: 4px solid ${BRAND_CONFIG.dangerColor};
        }

        .recommendation-card.medium-priority {
            border-left: 4px solid ${BRAND_CONFIG.warningColor};
        }

        .recommendation-card.low-priority {
            border-left: 4px solid ${BRAND_CONFIG.accentColor};
        }

        .recommendation-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: ${BRAND_CONFIG.primaryColor};
            margin-bottom: 10px;
        }

        .priority-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 15px;
        }

        .priority-high { background: #fef2f2; color: ${BRAND_CONFIG.dangerColor}; }
        .priority-medium { background: #fef3c7; color: ${BRAND_CONFIG.warningColor}; }
        .priority-low { background: #f0fdf4; color: ${BRAND_CONFIG.accentColor}; }

        .recommendation-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }

        .detail-item {
            padding: 10px;
            background: ${BRAND_CONFIG.lightGray};
            border-radius: 8px;
        }

        .detail-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: ${BRAND_CONFIG.secondaryGray};
            text-transform: uppercase;
        }

        .detail-value {
            font-size: 1rem;
            color: ${BRAND_CONFIG.primaryGray};
            margin-top: 5px;
        }

        /* 액션 플랜 섹션 */
        .action-section {
            padding: 40px;
            background: white;
        }

        .timeline {
            position: relative;
            margin-top: 30px;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 30px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, ${BRAND_CONFIG.secondaryColor}, ${BRAND_CONFIG.accentColor});
        }

        .timeline-item {
            position: relative;
            margin-bottom: 30px;
            padding-left: 80px;
        }

        .timeline-marker {
            position: absolute;
            left: 20px;
            top: 10px;
            width: 20px;
            height: 20px;
            background: white;
            border: 3px solid ${BRAND_CONFIG.secondaryColor};
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(30, 58, 138, 0.15);
        }

        .timeline-content {
            background: white;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid ${BRAND_CONFIG.secondaryColor};
            border: 1px solid ${BRAND_CONFIG.borderGray};
        }

        .timeline-title {
            font-weight: 600;
            color: ${BRAND_CONFIG.primaryColor};
            margin-bottom: 8px;
        }

        /* 푸터 섹션 */
        .footer-section {
            background: ${BRAND_CONFIG.gradients.neutral};
            color: white;
            padding: 40px;
            text-align: center;
        }

        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }

        .contact-card {
            background: rgba(255, 255, 255, 0.12);
            padding: 20px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .contact-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .contact-details {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
            body { padding: 10px; }
            .report-wrapper { border-radius: 15px; }
            .header-section { padding: 30px 20px; }
            .company-name { font-size: 2rem; }
            .report-meta { gap: 15px; }
            .score-section { padding: 30px 20px; }
            .score-circle { width: 150px; height: 150px; }
            .score-value { font-size: 2.5rem; }
            .swot-section, .recommendation-section, .action-section { padding: 30px 20px; }
            .swot-grid { grid-template-columns: 1fr; }
            .recommendation-details { grid-template-columns: 1fr; }
            .timeline-item { padding-left: 60px; }
            .footer-section { padding: 30px 20px; }
            .contact-info { grid-template-columns: 1fr; }
        }

        /* 인쇄 스타일 */
        @media print {
            body { background: white; padding: 0; }
            .report-wrapper { box-shadow: none; border-radius: 0; }
            .swot-card:hover, .recommendation-card:hover { transform: none; }
        }
    `;
  }

  /**
   * 🎯 헤더 섹션 생성
   */
  private static generateHeaderSection(data: PremiumReportData, currentDate: string): string {
    return `
        <div class="header-section">
            <div class="header-content">
                <h1 class="company-name">${data.companyName}</h1>
                <p class="report-title">🤖 AI 기반 종합 경영진단 보고서</p>
                <div class="report-meta">
                    <div class="meta-item">📅 ${currentDate}</div>
                    <div class="meta-item">🏢 ${data.industry}</div>
                    <div class="meta-item">👥 ${data.employeeCount}</div>
                    <div class="meta-item">⚡ ${data.processingTime}</div>
                    <div class="meta-item">🎯 신뢰도 ${data.reliabilityScore}%</div>
                </div>
            </div>
        </div>
    `;
  }

  /**
   * 📋 경영진 요약 섹션 생성
   */
  private static generateExecutiveSummarySection(data: PremiumReportData): string {
    const gradeText = data.totalScore >= 80 ? '우수' : data.totalScore >= 70 ? '양호' : data.totalScore >= 60 ? '보통' : '개선필요';
    
    return `
        <div class="executive-summary-section">
            <h2 class="section-title">📋 경영진 요약 (Executive Summary)</h2>
            <div class="summary-content">
                <div class="summary-grid">
                    <div class="summary-card">
                        <h3>🏢 기업 개요</h3>
                        <p><strong>${data.companyName}</strong>은(는) ${data.industry} 업계에서 활동하는 ${data.employeeCount} 규모의 ${data.establishmentStage} 단계 기업입니다.</p>
                    </div>
                    <div class="summary-card">
                        <h3>🎯 진단 결과</h3>
                        <p>AI 기반 종합 진단 결과 <strong>${data.totalScore}점</strong>(${gradeText})으로 평가되었으며, 신뢰도 ${data.reliabilityScore}%의 분석 결과입니다.</p>
                    </div>
                    <div class="summary-card">
                        <h3>💡 핵심 이슈</h3>
                        <p>${data.businessConcerns.slice(0, 2).join(', ')} 등의 과제가 확인되었으며, 체계적인 개선 방안이 필요합니다.</p>
                    </div>
                    <div class="summary-card">
                        <h3>🚀 성장 방향</h3>
                        <p>${data.expectedBenefits.slice(0, 2).join(', ')} 등의 효과를 기대할 수 있으며, 즉시 실행이 권장됩니다.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  /**
   * 📊 점수 섹션 생성 (차트 추가)
   */
  private static generateScoreSection(data: PremiumReportData): string {
    const scoreColor = data.totalScore >= 80 ? BRAND_CONFIG.scoreColors.excellent : 
                      data.totalScore >= 70 ? BRAND_CONFIG.scoreColors.good : 
                      data.totalScore >= 60 ? BRAND_CONFIG.scoreColors.average : 
                      BRAND_CONFIG.scoreColors.poor;
    const gradeText = data.totalScore >= 80 ? '업계 최상위' : data.totalScore >= 70 ? '업계 상위권' : data.totalScore >= 60 ? '업계 평균' : '개선 필요';
    const gradeClass = data.totalScore >= 80 ? 'score-excellent' : data.totalScore >= 70 ? 'score-good' : data.totalScore >= 60 ? 'score-average' : 'score-poor';

    return `
        <div class="score-section">
            <div class="score-circle" style="--score-deg: ${data.totalScore * 3.6}deg;">
                <div class="score-value">${data.totalScore}</div>
            </div>
            <div class="score-label">종합 진단 점수 (100점 만점)</div>
            <div class="score-grade ${gradeClass}" style="background-color: ${scoreColor}; color: white;">
                ${gradeText}
            </div>
            
            <!-- 📊 성과 지표 차트 -->
            <div class="performance-metrics">
                <h3 style="text-align: center; margin: 30px 0 20px 0; color: #1e40af;">📊 세부 평가 지표</h3>
                <div class="metrics-grid">
                    <div class="metric-item">
                        <div class="metric-label">비즈니스 모델 (25%)</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${data.analysis?.businessModel || data.totalScore}%; background: ${BRAND_CONFIG.accentColor};"></div>
                        </div>
                        <div class="metric-value">${data.analysis?.businessModel || data.totalScore}점</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">시장 위치 (20%)</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${data.analysis?.marketPosition || data.totalScore}%; background: ${BRAND_CONFIG.secondaryColor};"></div>
                        </div>
                        <div class="metric-value">${data.analysis?.marketPosition || data.totalScore}점</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">운영 효율성 (20%)</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${data.analysis?.operationalEfficiency || data.totalScore}%; background: ${BRAND_CONFIG.warningColor};"></div>
                        </div>
                        <div class="metric-value">${data.analysis?.operationalEfficiency || data.totalScore}점</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">성장 잠재력 (15%)</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${data.analysis?.growthPotential || data.totalScore}%; background: ${BRAND_CONFIG.primaryColor};"></div>
                        </div>
                        <div class="metric-value">${data.analysis?.growthPotential || data.totalScore}점</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">디지털 준비도 (10%)</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${data.analysis?.digitalReadiness || data.totalScore}%; background: ${BRAND_CONFIG.primaryColor};"></div>
                        </div>
                        <div class="metric-value">${data.analysis?.digitalReadiness || data.totalScore}점</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">재무 건전성 (10%)</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${data.analysis?.financialHealth || data.totalScore}%; background: ${BRAND_CONFIG.accentColor};"></div>
                        </div>
                        <div class="metric-value">${data.analysis?.financialHealth || data.totalScore}점</div>
                    </div>
                </div>
            </div>

            <!-- 🎯 비교 차트 -->
            <div class="comparison-chart">
                <h4 style="text-align: center; margin: 20px 0; color: #4b5563;">업계 평균 대비 비교</h4>
                <div class="comparison-bars">
                    <div class="comparison-item">
                        <span class="comparison-label">우리 기업</span>
                        <div class="comparison-bar">
                            <div class="comparison-fill our-score" style="width: ${data.totalScore}%;">${data.totalScore}점</div>
                        </div>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">업계 평균</span>
                        <div class="comparison-bar">
                            <div class="comparison-fill industry-average" style="width: 72%;">72점</div>
                        </div>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">상위 10%</span>
                        <div class="comparison-bar">
                            <div class="comparison-fill top-performers" style="width: 88%;">88점</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  /**
   * 🎯 SWOT 분석 섹션 생성
   */
  private static generateSWOTSection(data: PremiumReportData): string {
    return `
        <div class="swot-section">
            <h2 class="section-title">🔍 SWOT 분석</h2>
            <div class="swot-grid">
                <div class="swot-card strengths">
                    <h3 class="swot-card-title">💪 강점 (Strengths)</h3>
                    <ul class="swot-list">
                        ${data.analysis.strengths.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-card weaknesses">
                    <h3 class="swot-card-title">🔧 약점 (Weaknesses)</h3>
                    <ul class="swot-list">
                        ${data.analysis.weaknesses.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-card opportunities">
                    <h3 class="swot-card-title">🌟 기회 (Opportunities)</h3>
                    <ul class="swot-list">
                        ${data.analysis.opportunities.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-card threats">
                    <h3 class="swot-card-title">⚠️ 위협 (Threats)</h3>
                    <ul class="swot-list">
                        ${data.analysis.threats.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
  }

  /**
   * 🚀 추천 서비스 섹션 생성
   */
  private static generateRecommendationSection(data: PremiumReportData): string {
    return `
        <div class="recommendation-section">
            <h2 class="section-title">🚀 맞춤 서비스 추천</h2>
            <div class="recommendation-cards">
                ${data.recommendations.map(rec => `
                    <div class="recommendation-card ${rec.priority}-priority">
                        <h3 class="recommendation-title">${rec.service}</h3>
                        <span class="priority-badge priority-${rec.priority}">
                            ${rec.priority === 'high' ? '🔥 최우선' : rec.priority === 'medium' ? '⚡ 중요' : '📝 권장'}
                        </span>
                        <p style="color: #4b5563; margin-bottom: 15px;">${rec.description}</p>
                        <div class="recommendation-details">
                            <div class="detail-item">
                                <div class="detail-label">예상 ROI</div>
                                <div class="detail-value">${rec.expectedROI}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">실행 기간</div>
                                <div class="detail-value">${rec.timeline}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
  }

  /**
   * 📅 액션 플랜 섹션 생성
   */
  private static generateActionPlanSection(data: PremiumReportData): string {
    const actionItems = [
      { phase: "1개월 내", task: "우선순위 서비스 상담 예약 및 계약 체결" },
      { phase: "2개월 내", task: "1차 서비스 실행 및 중간 점검" },
      { phase: "3개월 내", task: "성과 측정 및 추가 서비스 검토" },
      { phase: "6개월 내", task: "종합 성과 평가 및 차년도 계획 수립" }
    ];

    return `
        <div class="action-section">
            <h2 class="section-title">📅 실행 로드맵</h2>
            <div class="timeline">
                ${actionItems.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="timeline-title">${item.phase}</div>
                            <div>${item.task}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
  }

  /**
   * 📞 푸터 섹션 생성
   */
  private static generateFooterSection(data: PremiumReportData): string {
    return `
        <div class="footer-section">
            <h2 style="margin-bottom: 20px;">🤝 전문가 상담 신청</h2>
            <p style="font-size: 1.1rem; margin-bottom: 30px;">
                더 자세한 분석과 맞춤형 솔루션을 원하시면 지금 바로 상담을 신청하세요!
            </p>
            <div class="contact-info">
                <div class="contact-card">
                    <div class="contact-title">📞 전화 상담</div>
                    <div class="contact-details">
                        010-9251-9743<br>
                        평일 09:00~18:00
                    </div>
                </div>
                <div class="contact-card">
                    <div class="contact-title">📧 이메일 상담</div>
                    <div class="contact-details">
                        hongik423@gmail.com<br>
                        24시간 접수 가능
                    </div>
                </div>
                <div class="contact-card">
                    <div class="contact-title">👨‍💼 담당 컨설턴트</div>
                    <div class="contact-details">
                        이후경 경영지도사<br>
                        25년 경력의 전문가
                    </div>
                </div>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); opacity: 0.8;">
                <p>© 2025 M-CENTER 경영지도센터 | AI 진단 시스템 v2.0</p>
                <p style="font-size: 0.9rem; margin-top: 5px;">
                    🎯 첫 상담 완전 무료 | ⚡ 즉시 예약 가능 | 🏆 95% 고객 만족도
                </p>
            </div>
        </div>
    `;
  }

  /**
   * 🎮 인터랙티브 JS 생성 (차트 애니메이션 추가)
   */
  private static generateInteractiveJS(): string {
    return `
        // 페이지 로드 완료 후 실행
        document.addEventListener('DOMContentLoaded', function() {
            initializeAnimations();
            initializeCharts();
            initializeInteractions();
        });

        // 🎬 애니메이션 초기화
        function initializeAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
                        
                        // 차트 애니메이션 트리거
                        if (entry.target.classList.contains('performance-metrics')) {
                            animateMetrics();
                        }
                        if (entry.target.classList.contains('comparison-chart')) {
                            animateComparison();
                        }
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.swot-card, .recommendation-card, .timeline-item, .performance-metrics, .comparison-chart').forEach(el => {
                observer.observe(el);
            });
        }

        // 📊 차트 애니메이션
        function initializeCharts() {
            // 점수 원형 차트 애니메이션
            const scoreCircle = document.querySelector('.score-circle');
            if (scoreCircle) {
                setTimeout(() => {
                    scoreCircle.style.transition = 'background 2s ease-in-out';
                }, 500);
            }

            // 2초 후 차트 애니메이션 시작
            setTimeout(() => {
                animateMetrics();
                setTimeout(() => animateComparison(), 500);
            }, 1000);
        }

        // 📈 성과 지표 애니메이션
        function animateMetrics() {
            const metricFills = document.querySelectorAll('.metric-fill');
            metricFills.forEach((fill, index) => {
                setTimeout(() => {
                    const targetWidth = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = targetWidth;
                    }, 100);
                }, index * 200);
            });
        }

        // 📊 비교 차트 애니메이션
        function animateComparison() {
            const comparisonFills = document.querySelectorAll('.comparison-fill');
            comparisonFills.forEach((fill, index) => {
                setTimeout(() => {
                    const targetWidth = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = targetWidth;
                    }, 100);
                }, index * 300);
            });
        }

        // 🎯 인터랙션 효과
        function initializeInteractions() {
            // 호버 효과 강화
            document.querySelectorAll('.swot-card, .recommendation-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.boxShadow = '';
                });
            });

            // 성과 지표 호버 효과
            document.querySelectorAll('.metric-item').forEach(item => {
                item.addEventListener('mouseenter', () => {
                    const fill = item.querySelector('.metric-fill');
                    if (fill) {
                        fill.style.transform = 'scaleY(1.2)';
                        fill.style.filter = 'brightness(1.1)';
                    }
                });
                
                item.addEventListener('mouseleave', () => {
                    const fill = item.querySelector('.metric-fill');
                    if (fill) {
                        fill.style.transform = 'scaleY(1)';
                        fill.style.filter = 'brightness(1)';
                    }
                });
            });

                         // 스크롤 진행률 표시
             const scrollProgress = document.createElement('div');
             scrollProgress.style.cssText = \`
                 position: fixed;
                 top: 0;
                 left: 0;
                 width: 0%;
                 height: 3px;
                 background: ${BRAND_CONFIG.gradients.primary};
                 z-index: 1000;
                 transition: width 0.3s ease;
             \`;
             document.body.appendChild(scrollProgress);

            window.addEventListener('scroll', () => {
                const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                scrollProgress.style.width = scrolled + '%';
            });
        }

        // 인쇄 최적화
        if (window.matchMedia) {
            window.matchMedia('print').addListener(() => {
                document.body.style.background = 'white';
                // 인쇄시 애니메이션 비활성화
                const style = document.createElement('style');
                style.textContent = '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }';
                document.head.appendChild(style);
            });
        }

        // 🎉 로딩 완료 이벤트
        window.addEventListener('load', () => {
            console.log('🎨 프리미엄 보고서 로딩 완료!');
            
            // 1초 후 성과 강조 효과
            setTimeout(() => {
                const scoreValue = document.querySelector('.score-value');
                if (scoreValue) {
                    scoreValue.style.animation = 'pulse 1s ease-in-out';
                }
            }, 1000);
        });

        // CSS 애니메이션 추가
        const additionalStyles = document.createElement('style');
        additionalStyles.textContent = \`
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .metric-fill {
                transition: all 0.3s ease;
            }
            
            .metric-fill:hover {
                filter: brightness(1.1) saturate(1.2);
            }
        \`;
        document.head.appendChild(additionalStyles);
    `;
  }

  /**
   * 📄 PDF 다운로드 기능
   */
  static async downloadPremiumPDF(data: PremiumReportData): Promise<void> {
    const htmlContent = this.generatePremiumReport(data);
    
    // 새 창에서 HTML 표시 후 인쇄 대화상자 열기
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // 로드 완료 후 인쇄
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    }
  }

  /**
   * 📈 세부 지표 분석 섹션
   */
  private static generateDetailedMetricsSection(data: PremiumReportData): string {
    const metrics = data.analysis;
    return `
        <div class="detailed-metrics-section">
            <h2 class="section-title">📈 세부 성과 지표 분석</h2>
            <div class="metrics-analysis">
                <p>각 핵심 영역별 상세 분석 결과를 통해 기업의 현재 상황과 개선 방향을 제시합니다.</p>
                <div class="metrics-breakdown">
                    <div class="metric-analysis">
                        <h4>🏗️ 비즈니스 모델 (${metrics.businessModel || data.totalScore}점)</h4>
                        <p>현재 수익 구조와 가치 창출 방식의 효과성을 평가한 결과입니다.</p>
                    </div>
                    <div class="metric-analysis">
                        <h4>🎯 시장 포지션 (${metrics.marketPosition || data.totalScore}점)</h4>
                        <p>업계 내 경쟁력과 시장 점유율 확대 가능성을 분석했습니다.</p>
                    </div>
                    <div class="metric-analysis">
                        <h4>⚙️ 운영 효율성 (${metrics.operationalEfficiency || data.totalScore}점)</h4>
                        <p>내부 프로세스와 자원 활용도의 최적화 수준을 측정했습니다.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  /**
   * 📊 업종별 벤치마킹 섹션
   */
  private static generateIndustryBenchmarkSection(data: PremiumReportData): string {
    return `
        <div class="benchmark-section">
            <h2 class="section-title">📊 업종별 벤치마킹</h2>
            <div class="benchmark-content">
                <p>${data.industry} 업계 대비 ${data.companyName}의 상대적 위치를 분석했습니다.</p>
                <div class="benchmark-grid">
                    <div class="benchmark-item">
                        <div class="benchmark-label">업계 평균 대비</div>
                        <div class="benchmark-value">${data.totalScore > 72 ? '+' : ''}${data.totalScore - 72}점</div>
                    </div>
                    <div class="benchmark-item">
                        <div class="benchmark-label">상위 25% 진입</div>
                        <div class="benchmark-value">${80 - data.totalScore}점 필요</div>
                    </div>
                    <div class="benchmark-item">
                        <div class="benchmark-label">동일 규모 대비</div>
                        <div class="benchmark-value">${data.totalScore >= 75 ? '상위권' : '중위권'}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  /**
   * 🌍 시장 분석 섹션
   */
  private static generateMarketAnalysisSection(data: PremiumReportData): string {
    return `
        <div class="market-analysis-section">
            <h2 class="section-title">🌍 시장 환경 분석</h2>
            <div class="market-content">
                <div class="market-grid">
                    <div class="market-card">
                        <h4>📈 시장 성장성</h4>
                        <p>${data.industry} 업계는 지속적인 성장세를 보이고 있으며, 새로운 기회 요소들이 확인됩니다.</p>
                    </div>
                    <div class="market-card">
                        <h4>🏆 경쟁 강도</h4>
                        <p>중간 수준의 경쟁 환경에서 차별화 전략을 통한 시장 점유율 확대가 가능합니다.</p>
                    </div>
                    <div class="market-card">
                        <h4>🎯 고객 니즈</h4>
                        <p>변화하는 고객 요구사항에 대응하기 위한 서비스 혁신이 필요한 시점입니다.</p>
                    </div>
                    <div class="market-card">
                        <h4>💡 기술 동향</h4>
                        <p>디지털 전환 가속화에 따른 기술 도입과 업무 프로세스 개선이 중요합니다.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  /**
   * ⚠️ 위험 관리 섹션
   */
  private static generateRiskManagementSection(data: PremiumReportData): string {
    return `
        <div class="risk-management-section">
            <h2 class="section-title">⚠️ 위험 요인 및 관리 방안</h2>
            <div class="risk-content">
                <div class="risk-matrix">
                    <div class="risk-category high-risk">
                        <h4>🔴 고위험 요소</h4>
                        <ul>
                            <li>급격한 시장 변화에 대한 대응 부족</li>
                            <li>핵심 인력 의존도 과다</li>
                        </ul>
                    </div>
                    <div class="risk-category medium-risk">
                        <h4>🟡 중위험 요소</h4>
                        <ul>
                            <li>디지털 전환 지연</li>
                            <li>자금 조달 어려움</li>
                        </ul>
                    </div>
                    <div class="risk-category low-risk">
                        <h4>🟢 저위험 요소</h4>
                        <ul>
                            <li>규제 변화 영향</li>
                            <li>공급망 불안정</li>
                        </ul>
                    </div>
                </div>
                <div class="mitigation-strategies">
                    <h4>🛡️ 위험 완화 전략</h4>
                    <p>M-CENTER의 전문 서비스를 통해 주요 위험 요소들을 체계적으로 관리하고 예방할 수 있습니다.</p>
                </div>
            </div>
        </div>
    `;
  }

  /**
   * 💰 ROI 예측 섹션
   */
  private static generateROIProjectionSection(data: PremiumReportData): string {
    return `
        <div class="roi-projection-section">
            <h2 class="section-title">💰 투자 수익률 예측 (ROI Projection)</h2>
            <div class="roi-content">
                <div class="roi-summary">
                    <p>권장 서비스 도입 시 예상되는 투자 대비 수익률을 분석했습니다.</p>
                </div>
                <div class="roi-grid">
                    ${data.recommendations.slice(0, 3).map(rec => `
                        <div class="roi-item">
                            <h4>${rec.service}</h4>
                            <div class="roi-details">
                                <div class="roi-metric">
                                    <span class="roi-label">예상 ROI</span>
                                    <span class="roi-value">${rec.expectedROI}</span>
                                </div>
                                <div class="roi-metric">
                                    <span class="roi-label">투자 회수 기간</span>
                                    <span class="roi-value">${rec.timeline}</span>
                                </div>
                                <div class="roi-metric">
                                    <span class="roi-label">위험도</span>
                                    <span class="roi-value">${rec.priority === 'high' ? '낮음' : '보통'}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="total-projection">
                    <h4>📊 종합 예측</h4>
                    <p>권장 서비스 전체 도입 시 <strong>12-18개월 내 투자비 회수</strong>가 가능하며, 
                    연간 <strong>25-40% 성과 개선</strong>을 기대할 수 있습니다.</p>
                </div>
            </div>
        </div>
    `;
  }

  /**
   * 📧 이메일 발송용 최적화
   */
  static generateEmailFriendlyReport(data: PremiumReportData): string {
    // 이메일용으로 간소화된 버전
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .score { font-size: 2rem; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
        .section { margin-bottom: 25px; padding: 15px; background: #f8fafc; border-radius: 8px; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.companyName} AI 진단결과</h1>
        <p>M-CENTER 경영지도센터</p>
    </div>
    <div class="content">
        <div class="score">${data.totalScore}점</div>
        <div class="section">
            <h3>💪 주요 강점</h3>
            ${data.analysis.strengths.map(s => `<p>• ${s}</p>`).join('')}
        </div>
        <div class="section">
            <h3>🚀 추천 서비스</h3>
            ${data.recommendations.slice(0, 2).map(r => `<p><strong>${r.service}</strong>: ${r.description}</p>`).join('')}
        </div>
    </div>
    <div class="footer">
        <p>📞 상담 문의: 010-9251-9743</p>
                        <p>📧 이메일: hongik423@gmail.com</p>
    </div>
</body>
</html>`;
  }
} 