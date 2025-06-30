const https = require('http');

const testData = {
  companyName: "테스트제조회사",
  industry: "manufacturing",
  businessManager: "홍길동",
  employeeCount: "10-50명",
  establishmentDifficulty: "보통",
  businessLocation: "서울",
  mainConcerns: "디지털 전환 지연, 생산성 향상 필요",
  expectedBenefits: "자동화를 통한 효율성 개선, 디지털 혁신",
  contactName: "홍길동",
      contactPhone: "010-9251-9743",
  contactEmail: "test@example.com",
  privacyConsent: true
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/process-diagnosis',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🚀 AI 진단 시스템 업데이트 테스트 시작...\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      console.log('✅ 테스트 성공!\n');
      console.log('=== 핵심 확인사항 ===');
      
      if (result.success && result.data && result.data.diagnosis) {
        const diagnosis = result.data.diagnosis;
        
        console.log(`🎯 30일 핵심과제: ${diagnosis.actionPlan ? diagnosis.actionPlan[1] : 'N/A'}`);
        console.log(`📈 업종 성장률: ${diagnosis.industryGrowth || 'N/A'}`);
        console.log(`⭐ 시장 위치: ${diagnosis.marketPosition || 'N/A'}`);
        console.log(`📊 종합 점수: ${diagnosis.overallScore || 'N/A'}점`);
        
        if (diagnosis.swotAnalysis) {
          console.log('\n=== SWOT 분석 (OT 강화 확인) ===');
          console.log(`🌟 기회요인: ${diagnosis.swotAnalysis.opportunities?.slice(0,2).join(', ') || 'N/A'}`);
          console.log(`⚠️ 위협요인: ${diagnosis.swotAnalysis.threats?.slice(0,2).join(', ') || 'N/A'}`);
        }
        
        if (diagnosis.technologyTrends) {
          console.log('\n=== 기술 트렌드 (최신 사례 확인) ===');
          console.log(`🔥 신기술: ${diagnosis.technologyTrends.emerging?.slice(0,3).join(', ') || 'N/A'}`);
          console.log(`📈 도입률: ${diagnosis.technologyTrends.adoption || 'N/A'}`);
          if (diagnosis.technologyTrends.marketCases) {
            console.log(`🏆 성공사례: ${diagnosis.technologyTrends.marketCases.slice(0,2).join(' | ')}`);
          }
        }
        
        if (diagnosis.mcenterSolutions) {
          console.log('\n=== 경영지도센터 서비스 ===');
          console.log(`🏢 핵심서비스: ${diagnosis.mcenterSolutions.coreServices?.join(', ') || 'N/A'}`);
        }
        
        console.log('\n=== 최종 권고사항 ===');
        console.log(`💡 ${diagnosis.integratedOpinion?.finalRecommendation || diagnosis.finalRecommendation || 'N/A'}`);
        
        console.log(`\n⏱️ 처리 시간: ${result.data.processingTime}`);
        console.log(`🔧 최적화 적용: ${result.data.optimized ? '✅' : '❌'}`);
        
        // 정책자금 관련 내용이 삭제되었는지 확인
        const hasGovernmentSupport = JSON.stringify(result).includes('정책자금') || 
                                   JSON.stringify(result).includes('정부지원') ||
                                   JSON.stringify(result).includes('governmentSupport');
        console.log(`🚫 정책자금 내용 삭제 확인: ${!hasGovernmentSupport ? '✅ 삭제됨' : '❌ 아직 있음'}`);
        
      } else {
        console.log('❌ 진단 데이터 구조 오류');
        console.log('전체 응답:', JSON.stringify(result, null, 2));
      }
      
    } catch (error) {
      console.error('❌ JSON 파싱 오류:', error.message);
      console.log('Raw 응답:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('🚨 요청 오류:', error.message);
});

req.write(postData);
req.end(); 