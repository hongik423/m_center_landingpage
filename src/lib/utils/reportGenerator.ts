import { DiagnosisData, DiagnosisResults } from '../stores/diagnosisStore';

export interface ReportTemplate {
  title: string;
  sections: ReportSection[];
  footer: string;
}

export interface ReportSection {
  title: string;
  content: string[];
  charts?: ChartData[];
}

export interface ChartData {
  type: 'bar' | 'pie' | 'line';
  title: string;
  data: any;
}

export class ReportGenerator {
  // 메인 보고서 생성
  static generateComprehensiveReport(
    diagnosisData: DiagnosisData, 
    results: DiagnosisResults
  ): ReportTemplate {
    const currentDate = new Date().toLocaleDateString('ko-KR');
    
    return {
      title: `${diagnosisData.companyName} 종합 진단 보고서`,
      sections: [
        this.generateExecutiveSummary(diagnosisData, results),
        this.generateCompanyOverview(diagnosisData),
        this.generateDiagnosisResults(results),
        this.generateStrengthsWeaknesses(results),
        this.generateRecommendations(results),
        this.generateImplementationPlan(results),
        this.generateAppendix(diagnosisData)
      ],
      footer: `생성일: ${currentDate} | M-Center 진단 시스템`
    };
  }

  // 경영진 요약
  private static generateExecutiveSummary(
    data: DiagnosisData, 
    results: DiagnosisResults
  ): ReportSection {
    const keyInsights = [
      `${data.companyName}의 종합 진단 점수는 100점 만점에 ${results.overallScore}점으로 ${results.marketPosition} 수준입니다.`,
      `${data.industry} 업계 내 성장 잠재력은 ${results.industryGrowth}%로 평가됩니다.`,
      `주요 강점: ${results.strengths.slice(0, 3).join(', ')}`,
      `핵심 개선사항: ${results.weaknesses.slice(0, 3).join(', ')}`,
      `우선순위 추천사항: ${results.recommendations.filter(r => r.priority === '높음').length}개의 고우선순위 액션 아이템`
    ];

    return {
      title: '경영진 요약 (Executive Summary)',
      content: keyInsights
    };
  }

  // 회사 개요
  private static generateCompanyOverview(data: DiagnosisData): ReportSection {
    const overview = [
      `회사명: ${data.companyName}`,
      `업종: ${data.industry}`,
      `설립년도: ${data.establishedYear}`,
      `조직 규모: ${data.companySize}`,
      `비즈니스 모델: ${data.businessModel}`,
      `연 매출 규모: ${data.annualRevenue}`,
      '',
      '주요 제품/서비스:',
      data.mainProducts,
      '',
      '목표 시장:',
      data.targetMarket
    ];

    return {
      title: '회사 개요',
      content: overview
    };
  }

  // 진단 결과
  private static generateDiagnosisResults(results: DiagnosisResults): ReportSection {
    const diagnosticResults = [
      `종합 진단 점수: ${results.overallScore}/100`,
      `시장 위치: ${results.marketPosition}`,
      `업계 성장률: ${results.industryGrowth}%`,
      `경쟁 강도: ${results.competitiveness}`,
      '',
      '세부 분석 결과:',
      `• 비즈니스 모델 적합성: ${results.detailedAnalysis.businessModel.score}/100`,
      `  ${results.detailedAnalysis.businessModel.feedback}`,
      '',
      `• 시장 이해도: ${results.detailedAnalysis.market.score}/100`,
      `  ${results.detailedAnalysis.market.feedback}`,
      '',
      `• 운영 체계: ${results.detailedAnalysis.operation.score}/100`,
      `  ${results.detailedAnalysis.operation.feedback}`
    ];

    const chartData: ChartData[] = [
      {
        type: 'bar',
        title: '분야별 점수',
        data: {
          labels: ['비즈니스 모델', '시장 이해도', '운영 체계'],
          values: [
            results.detailedAnalysis.businessModel.score,
            results.detailedAnalysis.market.score,
            results.detailedAnalysis.operation.score
          ]
        }
      }
    ];

    return {
      title: '진단 결과 분석',
      content: diagnosticResults,
      charts: chartData
    };
  }

  // 강점 및 약점 분석
  private static generateStrengthsWeaknesses(results: DiagnosisResults): ReportSection {
    const analysis = [
      '주요 강점:',
      ...results.strengths.map((strength, index) => `${index + 1}. ${strength}`),
      '',
      '개선 필요 사항:',
      ...results.weaknesses.map((weakness, index) => `${index + 1}. ${weakness}`)
    ];

    return {
      title: '강점 및 약점 분석',
      content: analysis
    };
  }

  // 추천사항
  private static generateRecommendations(results: DiagnosisResults): ReportSection {
    const recommendations = [
      '우선순위별 추천사항:',
      ''
    ];

    // 높은 우선순위 추천사항
    const highPriority = results.recommendations.filter(r => r.priority === '높음');
    if (highPriority.length > 0) {
      recommendations.push('🔴 높은 우선순위:');
      highPriority.forEach((rec, index) => {
        recommendations.push(`${index + 1}. [${rec.category}] ${rec.action}`);
        recommendations.push(`   실행 기간: ${rec.timeline}`);
        recommendations.push('');
      });
    }

    // 보통 우선순위 추천사항
    const mediumPriority = results.recommendations.filter(r => r.priority === '보통');
    if (mediumPriority.length > 0) {
      recommendations.push('🟡 보통 우선순위:');
      mediumPriority.forEach((rec, index) => {
        recommendations.push(`${index + 1}. [${rec.category}] ${rec.action}`);
        recommendations.push(`   실행 기간: ${rec.timeline}`);
        recommendations.push('');
      });
    }

    return {
      title: '추천사항',
      content: recommendations
    };
  }

  // 실행 계획
  private static generateImplementationPlan(results: DiagnosisResults): ReportSection {
    const plan = [
      '실행 로드맵:',
      '',
      '1개월 내 착수 항목:',
      ...results.recommendations
        .filter(r => r.timeline.includes('1개월'))
        .map(r => `• ${r.category}: ${r.action}`),
      '',
      '3개월 내 완료 항목:',
      ...results.recommendations
        .filter(r => r.timeline.includes('3개월'))
        .map(r => `• ${r.category}: ${r.action}`),
      '',
      '6개월 내 완료 항목:',
      ...results.recommendations
        .filter(r => r.timeline.includes('6개월'))
        .map(r => `• ${r.category}: ${r.action}`),
      '',
      '성공 지표 (KPI):',
      '• 매출 성장률: 전년 대비 20% 증가',
      '• 고객 만족도: 85% 이상 유지',
      '• 운영 효율성: 프로세스 자동화율 70% 달성',
      '• 디지털 전환율: 핵심 업무 80% 디지털화'
    ];

    return {
      title: '실행 계획',
      content: plan
    };
  }

  // 부록
  private static generateAppendix(data: DiagnosisData): ReportSection {
    const appendix = [
      '담당자 정보:',
      `• 성명: ${data.contactName}`,
      `• 직책: ${data.position}`,
      `• 이메일: ${data.contactEmail}`,
      `• 연락처: ${data.contactPhone}`,
      '',
      '주요 도전과제:',
      ...data.mainChallenges.map((challenge, index) => `${index + 1}. ${challenge}`),
      '',
      '비즈니스 목표:',
      ...data.businessGoals.map((goal, index) => `${index + 1}. ${goal}`),
      '',
      '시급한 해결 과제:',
      data.urgentIssues,
      '',
      '기대하는 결과:',
      data.expectedOutcome
    ];

    if (data.additionalInfo) {
      appendix.push('', '추가 정보:', data.additionalInfo);
    }

    return {
      title: '부록',
      content: appendix
    };
  }

  // 텍스트 보고서 생성
  static generateTextReport(template: ReportTemplate): string {
    let report = `${template.title}\n`;
    report += '='.repeat(template.title.length) + '\n\n';

    template.sections.forEach((section, index) => {
      report += `${index + 1}. ${section.title}\n`;
      report += '-'.repeat(section.title.length + 3) + '\n';
      
      section.content.forEach(line => {
        report += line + '\n';
      });
      
      report += '\n';
    });

    report += '\n' + template.footer + '\n';
    
    return report;
  }

  // HTML 보고서 생성
  static generateHTMLReport(template: ReportTemplate): string {
    let html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f5f5f5;
        }
        .report-container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #2563eb; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 10px;
            text-align: center;
        }
        h2 { 
            color: #1e40af; 
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .section { 
            margin-bottom: 30px; 
            padding: 20px;
            background: #f8fafc;
            border-left: 4px solid #3b82f6;
            border-radius: 4px;
        }
        .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
        }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
        .highlight { 
            background-color: #dbeafe; 
            padding: 15px; 
            border-radius: 4px; 
            margin: 10px 0;
        }
        .priority-high { color: #dc2626; font-weight: bold; }
        .priority-medium { color: #d97706; font-weight: bold; }
    </style>
</head>
<body>
    <div class="report-container">
        <h1>${template.title}</h1>
`;

    template.sections.forEach(section => {
      html += `        <div class="section">
            <h2>${section.title}</h2>
`;
      
      section.content.forEach(line => {
        if (line.trim() === '') {
          html += '            <br>\n';
        } else if (line.includes('🔴')) {
          html += `            <p class="priority-high">${line}</p>\n`;
        } else if (line.includes('🟡')) {
          html += `            <p class="priority-medium">${line}</p>\n`;
        } else if (line.includes(':') && !line.includes('•')) {
          html += `            <p><strong>${line}</strong></p>\n`;
        } else {
          html += `            <p>${line}</p>\n`;
        }
      });
      
      html += '        </div>\n';
    });

    html += `        <div class="footer">
            <p>${template.footer}</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  // 파일 다운로드 함수
  static downloadReport(content: string, filename: string, type: 'text' | 'html' = 'text') {
    const mimeType = type === 'html' ? 'text/html' : 'text/plain';
    const extension = type === 'html' ? '.html' : '.txt';
    
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename + extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 이메일로 보고서 전송 (시뮬레이션)
  static async sendReportByEmail(
    reportContent: string,
    recipientEmail: string,
    companyName: string
  ): Promise<boolean> {
    try {
      // 실제 구현에서는 이메일 서비스 API 호출
      console.log(`Sending report to ${recipientEmail} for ${companyName}`);
      
      // 이메일 전송 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 성공적으로 전송됨을 시뮬레이션
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}

// 보고서 템플릿 관리
export class ReportTemplateManager {
  private static templates: Map<string, Partial<ReportTemplate>> = new Map();

  // 커스텀 템플릿 등록
  static registerTemplate(name: string, template: Partial<ReportTemplate>) {
    this.templates.set(name, template);
  }

  // 업종별 맞춤 템플릿
  static getIndustryTemplate(industry: string): Partial<ReportTemplate> {
    const industryTemplates: Record<string, Partial<ReportTemplate>> = {
      'technology': {
        title: 'IT/기술 기업 진단 보고서',
        sections: [
          {
            title: '기술 혁신 분석',
            content: [
              '현재 기술 스택의 경쟁력을 평가합니다.',
              'R&D 투자 현황과 혁신 역량을 분석합니다.',
              '기술 트렌드 대응 능력을 진단합니다.'
            ]
          }
        ]
      },
      'manufacturing': {
        title: '제조업 진단 보고서',
        sections: [
          {
            title: '생산 효율성 분석',
            content: [
              '생산 공정의 효율성을 평가합니다.',
              '품질 관리 시스템을 진단합니다.',
              '공급망 최적화 방안을 제시합니다.'
            ]
          }
        ]
      },
      'retail': {
        title: '소매업 진단 보고서',
        sections: [
          {
            title: '고객 경험 분석',
            content: [
              '옴니채널 전략의 효과성을 평가합니다.',
              '고객 서비스 품질을 진단합니다.',
              '재고 관리 효율성을 분석합니다.'
            ]
          }
        ]
      }
    };

    return industryTemplates[industry] || {};
  }
} 