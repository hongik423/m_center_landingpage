/**
 * 🤖 M-CENTER AI 자동 보고서 생성기
 * Google Gemini를 사용하여 주간 비즈니스 보고서 자동 생성
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');

// Gemini 클라이언트 초기화
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 📊 M-CENTER 서비스 데이터
const MCENTER_SERVICES = {
  'business-analysis': {
    name: 'BM ZEN 사업분석',
    metrics: { successRate: 95, avgIncrease: 35, customerCount: 250 }
  },
  'ai-productivity': {
    name: 'AI 생산성향상',
    metrics: { successRate: 98, avgIncrease: 50, customerCount: 180 }
  },
  'factory-auction': {
    name: '경매활용 공장구매',
    metrics: { successRate: 85, avgSaving: 40, customerCount: 95 }
  },
  'tech-startup': {
    name: '기술사업화/창업',
    metrics: { successRate: 78, avgFunding: 500000000, customerCount: 120 }
  },
  'certification': {
    name: '인증지원',
    metrics: { successRate: 92, avgBenefit: 50000000, customerCount: 300 }
  },
  'website': {
    name: '웹사이트 구축',
    metrics: { successRate: 96, avgIncrease: 400, customerCount: 220 }
  }
};

/**
 * 🧠 AI 기반 주간 시장 동향 분석
 */
async function generateMarketTrends() {
  const prompt = `2025년 한국 중소기업 시장의 주요 동향과 M-CENTER 서비스 연관성을 분석해주세요:

분석 영역:
1. 경영환경 변화와 중소기업 대응 전략
2. 정부 정책 및 지원사업 트렌드
3. AI/디지털 전환 가속화 현황
4. 경매 부동산 시장 동향
5. 기술사업화 및 창업 생태계 변화

각 영역별로 M-CENTER 서비스와의 연계점과 비즈니스 기회를 제시해주세요.
실제 데이터와 전문적 분석을 바탕으로 신뢰할 수 있는 인사이트를 제공해주세요.`;

  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('시장 동향 분석 실패:', error);
    return '시장 동향 분석을 완료할 수 없습니다.';
  }
}

/**
 * 📈 AI 기반 서비스 성과 리포트 생성
 */
async function generateServiceReport() {
  const serviceData = Object.entries(MCENTER_SERVICES).map(([key, service]) => {
    return `${service.name}: 성공률 ${service.metrics.successRate}%, 고객수 ${service.metrics.customerCount}명`;
  }).join('\n');

  const prompt = `M-CENTER의 6대 서비스 성과 데이터를 바탕으로 주간 성과 리포트를 작성해주세요:

서비스별 성과:
${serviceData}

포함 내용:
1. 서비스별 주요 성과 하이라이트
2. 전주 대비 성장률 분석
3. 고객 만족도 및 재이용률 트렌드
4. 시장 경쟁력 강화 포인트
5. 다음 주 집중 전략 및 목표

M-CENTER의 차별화된 우수성을 강조하고, 구체적인 수치와 실적을 바탕으로 신뢰성 있는 리포트를 작성해주세요.`;

  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1200,
        temperature: 0.6,
        topP: 0.9,
        topK: 40,
      },
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('서비스 리포트 생성 실패:', error);
    return '서비스 리포트를 생성할 수 없습니다.';
  }
}

/**
 * 🚀 AI 기반 다음 주 전략 수립
 */
async function generateNextWeekStrategy() {
  const prompt = `M-CENTER의 다음 주 비즈니스 전략을 수립해주세요:

고려 요소:
1. 현재 시장 상황 및 고객 니즈 변화
2. 계절적 요인 및 연초 효과
3. 정부 지원사업 일정 및 기회
4. 경쟁사 동향 및 차별화 포인트
5. 내부 역량 및 리소스 현황

전략 수립 영역:
- 마케팅 및 고객 확보 전략
- 서비스 품질 개선 방안
- 새로운 비즈니스 기회 발굴
- 팀 역량 강화 계획
- 성과 목표 및 KPI 설정

실행 가능하고 구체적인 액션 플랜을 제시해주세요.`;

  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
      },
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('전략 수립 실패:', error);
    return '전략 수립을 완료할 수 없습니다.';
  }
}

/**
 * 📊 종합 주간 보고서 생성
 */
async function generateWeeklyReport() {
  console.log('📊 M-CENTER 주간 보고서 생성 시작...');
  
  try {
    // 병렬로 AI 분석 실행
    const [marketTrends, serviceReport, nextWeekStrategy] = await Promise.all([
      generateMarketTrends(),
      generateServiceReport(),
      generateNextWeekStrategy()
    ]);

    const currentDate = new Date();
    const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const report = {
      title: 'M-CENTER 주간 비즈니스 보고서',
      period: `${weekStart.toLocaleDateString('ko-KR')} ~ ${weekEnd.toLocaleDateString('ko-KR')}`,
      generatedAt: new Date().toISOString(),
      
      executiveSummary: {
        totalCustomers: Object.values(MCENTER_SERVICES).reduce((sum, service) => sum + service.metrics.customerCount, 0),
        avgSuccessRate: Math.round(Object.values(MCENTER_SERVICES).reduce((sum, service) => sum + service.metrics.successRate, 0) / Object.keys(MCENTER_SERVICES).length),
        activeServices: Object.keys(MCENTER_SERVICES).length,
        keyAchievements: [
          'AI 생산성향상 서비스 성공률 98% 달성',
          'BM ZEN 사업분석 고객 250명 돌파',
          '전체 서비스 평균 성공률 90% 이상 유지'
        ]
      },
      
      marketAnalysis: {
        trends: marketTrends,
        insights: [
          '중소기업 디지털 전환 수요 급증',
          '정부 지원사업 활용도 증가',
          '경매 부동산 시장 활성화'
        ]
      },
      
      servicePerformance: {
        overview: serviceReport,
        topPerformers: [
          'AI 생산성향상: 98% 성공률',
          '웹사이트 구축: 96% 성공률',
          'BM ZEN 사업분석: 95% 성공률'
        ],
        services: MCENTER_SERVICES
      },
      
      strategicDirection: {
        nextWeekFocus: nextWeekStrategy,
        priorities: [
          '신규 고객 확보 강화',
          '서비스 품질 지속 개선',
          '정부 지원사업 연계 확대'
        ],
        kpis: {
          newCustomers: 50,
          conversionRate: 25,
          customerSatisfaction: 95
        }
      },
      
      recommendations: [
        'AI 생산성향상 서비스 마케팅 집중 투자',
        '경매 공장구매 서비스 홍보 강화',
        '기술사업화 분야 전문성 확대',
        '고객 성공 사례 콘텐츠 제작 확대'
      ]
    };

    console.log('✅ 주간 보고서 생성 완료');
    return report;

  } catch (error) {
    console.error('❌ 주간 보고서 생성 실패:', error);
    throw error;
  }
}

/**
 * 💾 보고서 파일 저장
 */
async function saveReport(report) {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `m-center-weekly-report-${timestamp}.json`;
    const filepath = path.join(__dirname, '../docs', filename);
    
    await fs.writeFile(filepath, JSON.stringify(report, null, 2), 'utf8');
    
    console.log(`📁 보고서 저장 완료: ${filename}`);
    console.log(`📊 보고서 위치: ${filepath}`);
    
    return filepath;
  } catch (error) {
    console.error('❌ 보고서 저장 실패:', error);
    throw error;
  }
}

/**
 * 📧 보고서 요약 이메일 생성
 */
async function generateEmailSummary(report) {
  const prompt = `다음 주간 보고서를 바탕으로 경영진용 이메일 요약을 작성해주세요:

보고서 요약:
- 기간: ${report.period}
- 전체 고객수: ${report.executiveSummary.totalCustomers}명
- 평균 성공률: ${report.executiveSummary.avgSuccessRate}%
- 주요 성과: ${report.executiveSummary.keyAchievements.join(', ')}

이메일 형식:
- 제목: 간결하고 임팩트 있는 제목
- 본문: 핵심 성과와 다음 주 전략 중심
- 톤: 전문적이면서도 성과에 대한 자신감 표현
- 길이: 3-4개 문단으로 간결하게

경영진이 한눈에 파악할 수 있도록 핵심 포인트를 강조해주세요.`;

  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.6,
        topP: 0.9,
        topK: 40,
      },
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('이메일 요약 생성 실패:', error);
    return '이메일 요약을 생성할 수 없습니다.';
  }
}

/**
 * 🚀 메인 실행 함수
 */
async function main() {
  try {
    console.log('🤖 M-CENTER AI 보고서 생성 시스템 시작');
    console.log('⏰ 시작 시간:', new Date().toISOString());
    
    // 1. 주간 보고서 생성
    const report = await generateWeeklyReport();
    
    // 2. 보고서 파일 저장
    const filepath = await saveReport(report);
    
    // 3. 이메일 요약 생성
    const emailSummary = await generateEmailSummary(report);
    
    // 4. 이메일 요약 저장
    const emailFilename = `email-summary-${new Date().toISOString().split('T')[0]}.txt`;
    const emailFilepath = path.join(__dirname, '../docs', emailFilename);
    await fs.writeFile(emailFilepath, emailSummary, 'utf8');
    
    console.log('✅ M-CENTER AI 보고서 생성 완료');
    console.log('📊 생성된 보고서:', filepath);
    console.log('📧 이메일 요약:', emailFilepath);
    console.log('⏰ 완료 시간:', new Date().toISOString());
    
    return {
      success: true,
      report: report,
      files: {
        report: filepath,
        emailSummary: emailFilepath
      }
    };
    
  } catch (error) {
    console.error('❌ AI 보고서 생성 실패:', error);
    process.exit(1);
  }
}

// 스크립트 직접 실행 시 메인 함수 호출
if (require.main === module) {
  main();
}

module.exports = {
  generateWeeklyReport,
  generateMarketTrends,
  generateServiceReport,
  generateNextWeekStrategy,
  saveReport,
  generateEmailSummary,
  MCENTER_SERVICES
}; 