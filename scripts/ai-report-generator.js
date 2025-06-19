/**
 * 🤖 M-CENTER AI 자동 보고서 생성기
 * OpenAI GPT-4를 사용하여 주간 비즈니스 보고서 자동 생성
 */

const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
 * 🔍 시장 트렌드 분석 생성
 */
async function generateMarketTrends() {
  const prompt = `당신은 대한민국 경영컨설팅 전문가입니다. 

현재 주차의 주요 비즈니스 트렌드와 중소기업이 알아야 할 핵심 정보를 분석해주세요:

1. 정부 정책 변화 (중소기업 지원, 세제 혜택 등)
2. 업계별 성장 동향 (제조, IT, 서비스업 등)
3. AI 및 디지털 전환 트렌드
4. 투자 및 자금 조달 환경
5. 인증 및 규제 변화

각 항목당 2-3줄로 간결하고 실무적인 내용으로 작성해주세요.
M-CENTER 서비스와 연계 가능한 부분이 있다면 언급해주세요.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('시장 트렌드 분석 생성 실패:', error);
    return '시장 트렌드 분석을 생성하는 중 오류가 발생했습니다.';
  }
}

/**
 * 📈 성과 분석 보고서 생성
 */
async function generatePerformanceAnalysis() {
  const currentDate = new Date();
  const weekNumber = Math.ceil((currentDate.getDate()) / 7);
  
  // 모의 성과 데이터 생성 (실제로는 데이터베이스에서 가져와야 함)
  const performanceData = Object.entries(MCENTER_SERVICES).map(([key, service]) => {
    const variance = (Math.random() - 0.5) * 10; // -5% ~ +5% 변동
    return {
      service: service.name,
      currentWeek: Math.round(service.metrics.successRate + variance),
      target: service.metrics.successRate,
      customers: service.metrics.customerCount + Math.floor(Math.random() * 20) - 10
    };
  });

  const prompt = `다음은 M-CENTER의 ${currentDate.getMonth() + 1}월 ${weekNumber}주차 서비스별 성과 데이터입니다:

${performanceData.map(data => 
  `${data.service}: 성공률 ${data.currentWeek}% (목표: ${data.target}%), 고객수 ${data.customers}명`
).join('\n')}

이 데이터를 바탕으로 다음 내용으로 성과 분석 보고서를 작성해주세요:

1. 주요 성과 하이라이트 (3-4개)
2. 목표 대비 달성 현황 분석
3. 개선이 필요한 영역
4. 다음 주 중점 추진 방향

전문적이면서도 실무진이 이해하기 쉽게 작성해주세요.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.6,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('성과 분석 보고서 생성 실패:', error);
    return '성과 분석 보고서를 생성하는 중 오류가 발생했습니다.';
  }
}

/**
 * 💡 고객 맞춤 제안 생성
 */
async function generateCustomerRecommendations() {
  const prompt = `M-CENTER의 6가지 핵심 서비스를 바탕으로, 다양한 업종의 중소기업들에게 
이번 주에 특히 도움이 될 만한 맞춤형 제안을 생성해주세요:

서비스:
1. BM ZEN 사업분석 - 매출 20-40% 증대
2. AI 생산성향상 - 업무효율 40-60% 향상  
3. 경매활용 공장구매 - 부동산비용 30-50% 절감
4. 기술사업화/창업 - 평균 5억원 정부지원금
5. 인증지원 - 연간 세제혜택 5천만원
6. 웹사이트 구축 - 온라인 문의 300-500% 증가

업종별로 3-4개씩 실용적인 제안을 해주세요:
- 제조업
- IT/기술기업  
- 서비스업
- 유통/소매업

각 제안은 구체적인 효과와 실행 방법을 포함해주세요.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.8,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('고객 맞춤 제안 생성 실패:', error);
    return '고객 맞춤 제안을 생성하는 중 오류가 발생했습니다.';
  }
}

/**
 * 📊 HTML 보고서 생성
 */
function generateHTMLReport(marketTrends, performanceAnalysis, customerRecommendations) {
  const currentDate = new Date();
  const reportTitle = `M-CENTER 주간 비즈니스 리포트 - ${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
  
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportTitle}</title>
    <style>
        body {
            font-family: 'Malgun Gothic', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(30, 58, 138, 0.3);
        }
        .header h1 {
            margin: 0;
            font-size: 2rem;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        .section {
            background: white;
            margin-bottom: 25px;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border-left: 4px solid #1e40af;
        }
        .section h2 {
            color: #1e3a8a;
            margin-bottom: 20px;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section-content {
            white-space: pre-line;
            line-height: 1.8;
        }
        .footer {
            background: #1f2937;
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin-top: 30px;
        }
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .contact-card {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .icon {
            font-size: 1.2rem;
            margin-right: 8px;
        }
        @media print {
            body { background: white; }
            .header, .section { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 M-CENTER AI 주간 리포트</h1>
        <p>${currentDate.toLocaleDateString('ko-KR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        })}</p>
    </div>

    <div class="section">
        <h2><span class="icon">📈</span>시장 트렌드 분석</h2>
        <div class="section-content">${marketTrends}</div>
    </div>

    <div class="section">
        <h2><span class="icon">🎯</span>성과 분석 보고서</h2>
        <div class="section-content">${performanceAnalysis}</div>
    </div>

    <div class="section">
        <h2><span class="icon">💡</span>고객 맞춤 제안</h2>
        <div class="section-content">${customerRecommendations}</div>
    </div>

    <div class="footer">
        <h3>📞 M-CENTER 경영지도센터</h3>
        <p>대한민국 최고 수준의 경영컨설팅 전문기관 | 25년 검증된 노하우</p>
        <div class="contact-info">
            <div class="contact-card">
                <strong>📞 전화상담</strong><br>
                010-9251-9743<br>
                <small>평일 09:00-18:00</small>
            </div>
            <div class="contact-card">
                <strong>📧 이메일</strong><br>
                lhk@injc.kr<br>
                <small>24시간 접수</small>
            </div>
            <div class="contact-card">
                <strong>🏆 전문가</strong><br>
                이후경 경영지도사<br>
                <small>25년 경력</small>
            </div>
        </div>
        <p style="margin-top: 20px; opacity: 0.8;">
            © 2025 M-CENTER | AI 자동생성 보고서 | 
            생성시간: ${new Date().toLocaleString('ko-KR')}
        </p>
    </div>
</body>
</html>`;
}

/**
 * 📝 주간 보고서 생성 메인 함수
 */
async function generateWeeklyReport() {
  console.log('🤖 M-CENTER AI 주간 보고서 생성 시작...');
  
  try {
    // 보고서 디렉토리 생성
    const reportsDir = path.join(process.cwd(), 'reports');
    try {
      await fs.access(reportsDir);
    } catch {
      await fs.mkdir(reportsDir, { recursive: true });
    }

    // AI를 사용하여 각 섹션 생성
    console.log('📈 시장 트렌드 분석 생성 중...');
    const marketTrends = await generateMarketTrends();
    
    console.log('🎯 성과 분석 보고서 생성 중...');
    const performanceAnalysis = await generatePerformanceAnalysis();
    
    console.log('💡 고객 맞춤 제안 생성 중...');
    const customerRecommendations = await generateCustomerRecommendations();

    // HTML 보고서 생성
    const htmlReport = generateHTMLReport(marketTrends, performanceAnalysis, customerRecommendations);
    
    // 파일 저장
    const currentDate = new Date();
    const fileName = `weekly-report-${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}.html`;
    const filePath = path.join(reportsDir, fileName);
    
    await fs.writeFile(filePath, htmlReport, 'utf8');
    
    // 최신 보고서로 링크 생성
    const latestPath = path.join(reportsDir, 'latest-report.html');
    await fs.writeFile(latestPath, htmlReport, 'utf8');
    
    console.log(`✅ 주간 보고서 생성 완료: ${fileName}`);
    console.log(`📁 저장 위치: ${filePath}`);
    
    return {
      success: true,
      fileName,
      filePath,
      sections: {
        marketTrends: marketTrends.length,
        performanceAnalysis: performanceAnalysis.length,
        customerRecommendations: customerRecommendations.length
      }
    };
    
  } catch (error) {
    console.error('❌ 주간 보고서 생성 실패:', error);
    throw error;
  }
}

// 직접 실행 시
if (require.main === module) {
  generateWeeklyReport()
    .then(result => {
      console.log('🎉 보고서 생성 성공:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 보고서 생성 실패:', error);
      process.exit(1);
    });
}

module.exports = {
  generateWeeklyReport,
  generateMarketTrends,
  generatePerformanceAnalysis,
  generateCustomerRecommendations
}; 