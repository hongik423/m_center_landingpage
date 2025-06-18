import { NextRequest, NextResponse } from 'next/server';
import { saveToGoogleSheets } from '@/lib/utils/googleSheetsService';
import { processDiagnosisSubmission, type DiagnosisFormData } from '@/lib/utils/emailService';
import { CONSULTANT_INFO, CONTACT_INFO, COMPANY_INFO } from '@/lib/config/branding';

interface SimplifiedDiagnosisRequest {
  companyName: string;
  industry: string;
  contactManager: string;
  email: string;
  employeeCount: string;
  growthStage: string;
  businessLocation: string;
  mainConcerns: string;
  expectedBenefits: string;
  privacyConsent: boolean;
  submitDate: string;
}

// 업종별 기본 분석 데이터 (개선된 점수 체계)
const industryAnalysisMap: { [key: string]: any } = {
  'manufacturing': {
    marketGrowth: '12%',
    keyTrends: ['스마트팩토리', 'AI 품질관리', '탄소중립'],
    primaryServices: ['ai-productivity', 'factory-auction'],
    avgScore: 82,
    opportunities: ['정부 지원 확대', '디지털 전환', 'ESG 경영']
  },
  'it': {
    marketGrowth: '15%',
    keyTrends: ['생성형 AI', '클라우드', '사이버보안'],
    primaryServices: ['ai-productivity', 'tech-startup'],
    avgScore: 85,
    opportunities: ['AI 바우처', 'K-디지털', '벤처투자']
  },
  'service': {
    marketGrowth: '8%',
    keyTrends: ['O2O 융합', '구독경제', '개인화'],
    primaryServices: ['business-analysis', 'website'],
    avgScore: 78,
    opportunities: ['서비스 혁신', '디지털화', '플랫폼']
  },
  'retail': {
    marketGrowth: '10%',
    keyTrends: ['라이브커머스', '옴니채널', 'D2C'],
    primaryServices: ['website', 'business-analysis'],
    avgScore: 76,
    opportunities: ['온라인 진출', '브랜드화', 'CRM']
  },
  'construction': {
    marketGrowth: '9%',
    keyTrends: ['스마트건설', '친환경건축', 'BIM'],
    primaryServices: ['business-analysis', 'certification'],
    avgScore: 79,
    opportunities: ['그린뉴딜', '디지털 전환', '안전관리']
  },
  'food': {
    marketGrowth: '11%',
    keyTrends: ['푸드테크', '비건트렌드', '배달최적화'],
    primaryServices: ['website', 'business-analysis'],
    avgScore: 77,
    opportunities: ['온라인 진출', '브랜드화', '품질인증']
  },
  'healthcare': {
    marketGrowth: '14%',
    keyTrends: ['디지털헬스', '원격의료', 'AI진단'],
    primaryServices: ['ai-productivity', 'certification'],
    avgScore: 81,
    opportunities: ['정부지원', '기술혁신', '인증취득']
  },
  'education': {
    marketGrowth: '13%',
    keyTrends: ['에듀테크', '온라인교육', 'AI맞춤형'],
    primaryServices: ['ai-productivity', 'website'],
    avgScore: 80,
    opportunities: ['디지털교육', '콘텐츠개발', '플랫폼구축']
  },
  'finance': {
    marketGrowth: '7%',
    keyTrends: ['핀테크', '디지털뱅킹', 'AI금융'],
    primaryServices: ['ai-productivity', 'certification'],
    avgScore: 83,
    opportunities: ['디지털화', '규제대응', '신기술도입']
  },
  'other': {
    marketGrowth: '9%',
    keyTrends: ['디지털혁신', '고객중심', '효율화'],
    primaryServices: ['business-analysis', 'ai-productivity'],
    avgScore: 78,
    opportunities: ['디지털 전환', '프로세스 개선', '혁신성장']
  }
};

// 6개 핵심 서비스 정보
const mCenterServices = {
  'business-analysis': {
    name: 'BM ZEN 사업분석',
    description: '비즈니스 모델 최적화를 통한 수익성 개선',
    expectedEffect: '매출 20-40% 증대',
    duration: '2-3개월',
    successRate: '95%'
  },
  'ai-productivity': {
    name: 'AI실무활용 생산성향상',
    description: 'ChatGPT 등 AI 도구 활용 업무 효율화',
    expectedEffect: '업무효율 40-60% 향상',
    duration: '1-2개월',
    successRate: '98%'
  },
  'factory-auction': {
    name: '경매활용 공장구매',
    description: '부동산 경매를 통한 고정비 절감',
    expectedEffect: '부동산비용 30-50% 절감',
    duration: '3-6개월',
    successRate: '85%'
  },
  'tech-startup': {
    name: '기술사업화/기술창업',
    description: '기술을 활용한 사업화 및 창업 지원',
    expectedEffect: '기술가치 평가 상승',
    duration: '6-12개월',
    successRate: '78%'
  },
  'certification': {
    name: '인증지원',
    description: 'ISO, 벤처인증 등 각종 인증 취득',
    expectedEffect: '시장 신뢰도 향상',
    duration: '3-6개월',
    successRate: '92%'
  },
  'website': {
    name: '웹사이트 구축',
    description: 'SEO 최적화 웹사이트 구축',
    expectedEffect: '온라인 문의 300% 증가',
    duration: '1-2개월',
    successRate: '96%'
  }
};

// 간소화된 진단 분석 함수
function generateSimplifiedDiagnosis(data: SimplifiedDiagnosisRequest) {
  // 업종별 기본 데이터 가져오기
  const industryData = industryAnalysisMap[data.industry] || industryAnalysisMap['service'];
  
  // 기업 규모에 따른 점수 조정
  let sizeBonus = 0;
  if (data.employeeCount === '1-5') sizeBonus = -5;
  else if (data.employeeCount === '6-10') sizeBonus = 0;
  else if (data.employeeCount === '11-30') sizeBonus = 3;
  else if (data.employeeCount === '31-50') sizeBonus = 5;
  else if (data.employeeCount === '51-100') sizeBonus = 8;
  else sizeBonus = 10;

  // 성장단계에 따른 점수 조정
  let stageBonus = 0;
  if (data.growthStage === 'startup') stageBonus = -3;
  else if (data.growthStage === 'early') stageBonus = 2;
  else if (data.growthStage === 'growth') stageBonus = 8;
  else if (data.growthStage === 'mature') stageBonus = 5;
  else if (data.growthStage === 'expansion') stageBonus = 10;

  const totalScore = Math.min(95, industryData.avgScore + sizeBonus + stageBonus);

  // 고민사항 분석으로 추가 점수 보정
  const concerns = data.mainConcerns.toLowerCase();
  let concernsBonus = 0;
  
  // 구체적인 고민사항을 제시한 경우 가점
  if (data.mainConcerns.length > 50) concernsBonus += 2;
  if (concerns.includes('매출') || concerns.includes('수익') || concerns.includes('성장')) concernsBonus += 1;
  if (concerns.includes('효율') || concerns.includes('생산성') || concerns.includes('자동화')) concernsBonus += 1;
  if (concerns.includes('디지털') || concerns.includes('온라인') || concerns.includes('ai')) concernsBonus += 2;
  
  // 최종 점수 계산 (더 관대한 기준)
  const finalScore = Math.min(95, totalScore + concernsBonus);

  // 고민사항 기반 서비스 추천
  let recommendedServices = [...industryData.primaryServices];
  
  if (concerns.includes('매출') || concerns.includes('수익')) {
    recommendedServices.unshift('business-analysis');
  }
  if (concerns.includes('생산성') || concerns.includes('효율')) {
    recommendedServices.unshift('ai-productivity');
  }
  if (concerns.includes('웹사이트') || concerns.includes('온라인')) {
    recommendedServices.push('website');
  }
  if (concerns.includes('인증') || concerns.includes('iso')) {
    recommendedServices.push('certification');
  }

  // 중복 제거 및 상위 3개 선택
  recommendedServices = [...new Set(recommendedServices)].slice(0, 3);

  // 개선된 신뢰도 평가 기준
  let marketPosition = '양호';
  let reliabilityScore = '75%';
  
  if (finalScore >= 90) {
    marketPosition = '매우우수';
    reliabilityScore = '95%';
  } else if (finalScore >= 85) {
    marketPosition = '우수';
    reliabilityScore = '88%';
  } else if (finalScore >= 78) {
    marketPosition = '양호';
    reliabilityScore = '82%';
  } else if (finalScore >= 70) {
    marketPosition = '보통';
    reliabilityScore = '75%';
  } else if (finalScore >= 60) {
    marketPosition = '개선권장';
    reliabilityScore = '68%';
  } else {
    marketPosition = '개선필요';
    reliabilityScore = '60%';
  }

  // 현안상황예측 생성 (업종, 고민사항, 예상혜택 종합 분석)
  function generateCurrentSituationForecast(data: SimplifiedDiagnosisRequest, industryData: any): string {
    const concerns = data.mainConcerns.toLowerCase();
    const benefits = data.expectedBenefits.toLowerCase();
    const industry = data.industry;
    const employeeCount = data.employeeCount;
    const growthStage = data.growthStage;
    
    let forecast = '';
    
    // 업종별 기본 현안 분석
    const industryForecastMap: { [key: string]: string } = {
      'manufacturing': '제조업계는 스마트팩토리 전환과 ESG 경영이 핵심 이슈로 대두되고 있습니다. ',
      'it': 'IT업계는 생성형 AI와 클라우드 기술의 급속한 발전으로 기술 격차가 확대되고 있습니다. ',
      'service': '서비스업계는 디지털 전환과 고객 경험 개선이 생존의 핵심 요소가 되고 있습니다. ',
      'retail': '유통/소매업계는 온라인-오프라인 융합과 라이브커머스 등 새로운 판매 채널이 급성장하고 있습니다. ',
      'construction': '건설업계는 스마트 건설기술과 친환경 건축 수요 증가로 기술 혁신이 필수가 되고 있습니다. ',
      'food': '식품/외식업계는 푸드테크와 배달 서비스 최적화가 경쟁력의 핵심이 되고 있습니다. ',
      'healthcare': '의료/헬스케어업계는 디지털 헬스와 AI 진단 기술 도입이 가속화되고 있습니다. ',
      'education': '교육업계는 에듀테크와 개인 맞춤형 학습 시스템이 표준이 되어가고 있습니다. ',
      'finance': '금융업계는 핀테크와 디지털뱅킹으로 인한 금융 서비스 패러다임 변화가 진행되고 있습니다. ',
      'other': '전반적으로 모든 업계에서 디지털 혁신과 고객 중심의 서비스 개선이 필수가 되고 있습니다. '
    };
    
    forecast += industryForecastMap[industry] || industryForecastMap['other'];
    
    // 고민사항 기반 현안 분석
    if (concerns.includes('매출') || concerns.includes('수익') || concerns.includes('성장')) {
      forecast += '특히 매출 증대와 수익성 개선이 시급한 과제로 보이며, ';
      if (benefits.includes('증대') || benefits.includes('향상')) {
        forecast += '체계적인 비즈니스 모델 분석을 통한 수익 구조 개선이 필요한 시점입니다. ';
      }
    }
    
    if (concerns.includes('효율') || concerns.includes('생산성') || concerns.includes('자동화')) {
      forecast += '업무 효율성과 생산성 개선이 경쟁력 확보의 핵심 요소로 작용하고 있으며, ';
      if (benefits.includes('효율') || benefits.includes('자동화')) {
        forecast += 'AI 도구 활용을 통한 업무 프로세스 혁신이 시급한 상황입니다. ';
      }
    }
    
    if (concerns.includes('디지털') || concerns.includes('온라인') || concerns.includes('ai')) {
      forecast += '디지털 전환과 AI 기술 도입이 더 이상 선택이 아닌 필수가 된 상황에서, ';
      if (benefits.includes('디지털') || benefits.includes('온라인')) {
        forecast += '적극적인 디지털화 추진이 기업 생존의 열쇠가 될 것으로 예상됩니다. ';
      }
    }
    
    if (concerns.includes('인력') || concerns.includes('채용') || concerns.includes('관리')) {
      forecast += '인력 관리와 조직 운영의 효율화가 중요한 과제로 대두되고 있으며, ';
    }
    
    if (concerns.includes('비용') || concerns.includes('절감') || concerns.includes('원가')) {
      forecast += '비용 최적화와 원가 절감을 통한 경쟁력 확보가 필수적인 상황입니다. ';
    }
    
    // 기업 규모별 예측
    if (employeeCount === '1-5' || employeeCount === '6-10') {
      forecast += '소규모 기업으로서 선택과 집중을 통한 핵심 역량 강화가 중요하며, ';
    } else if (employeeCount === '11-30' || employeeCount === '31-50') {
      forecast += '중소기업으로서 조직 체계화와 시스템화가 성장의 발판이 될 것입니다. ';
    } else {
      forecast += '중견기업으로서 규모의 경제를 활용한 효율성 극대화가 관건입니다. ';
    }
    
    // 성장단계별 예측
    if (growthStage === 'startup' || growthStage === 'early') {
      forecast += '초기 단계 기업으로서 시장 검증과 비즈니스 모델 안정화가 우선 과제이며, ';
    } else if (growthStage === 'growth') {
      forecast += '성장기 기업으로서 확장 전략과 운영 효율화의 균형이 중요한 시점입니다. ';
    } else if (growthStage === 'mature') {
      forecast += '성숙기 기업으로서 혁신을 통한 재도약과 새로운 성장 동력 확보가 필요합니다. ';
    } else if (growthStage === 'expansion') {
      forecast += '확장기 기업으로서 지속가능한 성장을 위한 체계적인 관리 시스템 구축이 핵심입니다. ';
    }
    
    // 예상혜택 기반 결론
    if (benefits.includes('증대') || benefits.includes('성장')) {
      forecast += '현재 시점에서 적절한 전략적 접근을 통해 기대하는 성장 목표 달성이 충분히 가능할 것으로 판단됩니다.';
    } else if (benefits.includes('효율') || benefits.includes('개선')) {
      forecast += '체계적인 개선 방안 도입을 통해 목표하는 효율성 향상을 실현할 수 있을 것으로 예상됩니다.';
    } else if (benefits.includes('절감') || benefits.includes('최적화')) {
      forecast += '전문적인 분석과 최적화 방안을 통해 비용 절감 목표를 달성할 수 있을 것으로 보입니다.';
    } else {
      forecast += '현재 상황을 종합 분석할 때, 적절한 컨설팅을 통해 기업이 원하는 목표를 충분히 달성할 수 있을 것으로 판단됩니다.';
    }
    
    return forecast;
  }

  const currentSituationForecast = generateCurrentSituationForecast(data, industryData);

  return {
    // 기본 진단 정보
    companyName: data.companyName,
    industry: data.industry,
    employeeCount: data.employeeCount,
    growthStage: data.growthStage,
    totalScore: finalScore,
    marketPosition: marketPosition,
    reliabilityScore: reliabilityScore,
    scoreDescription: `${data.companyName}은(는) ${industryData.marketGrowth} 성장률을 보이는 ${data.industry} 업계에서 ${marketPosition} 수준의 경쟁력을 보유하고 있습니다.`,
    
    // 업계 분석
    industryGrowth: industryData.marketGrowth,
    industryGrowthRate: industryData.marketGrowth,
    keyTrends: industryData.keyTrends,
    
    // SWOT 간소화 분석
    strengths: [
      `${data.industry} 업계 전문성`,
      `${data.employeeCount} 규모의 조직 운영력`,
      '고객 니즈 이해도'
    ],
    weaknesses: [
      '디지털 역량 강화 필요',
      '마케팅 체계 개선',
      '업무 프로세스 최적화'
    ],
    opportunities: industryData.opportunities,
    threats: [
      '업계 경쟁 심화',
      '기술 변화 대응',
      '인력 확보 어려움'
    ],
    
    // 현안상황예측 (개선된 부분)
    currentSituationForecast: currentSituationForecast,
    
    // 맞춤 서비스 추천
    recommendedServices: recommendedServices.map(serviceId => ({
      id: serviceId,
      ...mCenterServices[serviceId as keyof typeof mCenterServices]
    })),
    
    // 액션 플랜
    actionPlan: [
      '7일 내: 무료 상담 예약 및 현황 점검',
      `30일 내: ${mCenterServices[recommendedServices[0] as keyof typeof mCenterServices].name} 착수`,
      '90일 내: 첫 번째 성과 측정 및 전략 조정'
    ],
    
    // 예상 성과
    expectedResults: {
      revenue: '매출 25-40% 증대',
      efficiency: '업무 효율성 30-50% 향상',
      timeline: '3-6개월 내 가시적 성과',
      quantitative: ['매출 증대 25-40%', '비용 절감 15-25%', '업무 효율성 30-50% 향상'],
      qualitative: ['시장 경쟁력 강화', '조직 역량 개선', '지속가능한 성장 기반 구축']
    },
    
    // 기타 정보
    consultant: {
      name: CONSULTANT_INFO.name,
      phone: CONTACT_INFO.mainPhone,
      email: CONTACT_INFO.mainEmail
    },
    generatedAt: new Date().toISOString(),
    resultId: `DIAG_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`.toUpperCase()
  };
}

// 2000자 요약 보고서 생성
function generateSummaryReport(diagnosisData: any): string {
  const report = `
# ${diagnosisData.companyName} AI 진단 보고서 (요약본)

## 📊 종합 평가
**진단 점수**: ${diagnosisData.totalScore}점 / 100점
**시장 위치**: ${diagnosisData.marketPosition}
**업계 성장률**: ${diagnosisData.industryGrowth}

## 🎯 핵심 분석

### 💪 주요 강점
${diagnosisData.strengths.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

### 🔧 개선 영역
${diagnosisData.weaknesses.map((w: string, i: number) => `${i + 1}. ${w}`).join('\n')}

### 🌟 성장 기회
${diagnosisData.opportunities.map((o: string, i: number) => `${i + 1}. ${o}`).join('\n')}

## 🚀 맞춤 서비스 추천

${diagnosisData.recommendedServices.map((service: any, i: number) => `
### ${i + 1}. ${service.name}
- **목적**: ${service.description}
- **예상 효과**: ${service.expectedEffect}
- **소요 기간**: ${service.duration}
- **성공률**: ${service.successRate}
`).join('')}

## 📅 실행 계획
${diagnosisData.actionPlan.map((plan: string, i: number) => `${i + 1}. ${plan}`).join('\n')}

## 📈 예상 성과
- **매출 성장**: ${diagnosisData.expectedResults.revenue}
- **효율성 향상**: ${diagnosisData.expectedResults.efficiency}
- **성과 시점**: ${diagnosisData.expectedResults.timeline}

## 🤝 전문가 상담
**담당 컨설턴트**: ${diagnosisData.consultant.name}
**연락처**: ${diagnosisData.consultant.phone}
**이메일**: ${diagnosisData.consultant.email}

---
*본 보고서는 AI 기반 분석을 통해 생성되었으며, 더 정확한 진단을 위해서는 전문가 상담을 권장합니다.*
`;

  return report.trim();
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 간소화된 AI 진단 API 시작');
    
    const data: SimplifiedDiagnosisRequest = await request.json();
    
    // 입력 데이터 검증
    if (!data.companyName || !data.industry || !data.contactManager || !data.email) {
      return NextResponse.json({
        success: false,
        error: '필수 정보가 누락되었습니다.'
      }, { status: 400 });
    }

    // 개인정보 동의 확인
    if (!data.privacyConsent) {
      return NextResponse.json({
        success: false,
        error: '개인정보 수집 및 이용 동의가 필요합니다.'
      }, { status: 400 });
    }

    // 1단계: AI 진단 수행
    console.log('📊 간소화된 진단 분석 수행 중...');
    const diagnosisResult = generateSimplifiedDiagnosis(data);
    
    // 2단계: 2000자 요약 보고서 생성
    console.log('📋 2000자 요약 보고서 생성 중...');
    const summaryReport = generateSummaryReport(diagnosisResult);
    
    // 3단계: Google Sheets 저장 및 이메일 발송 (실패해도 진단 결과는 반환)
    let googleSheetsSaved = false;
    let emailSent = false;
    let warnings: string[] = [];
    
    try {
      console.log('💾 Google Sheets 저장 및 이메일 발송 시도...');
      
      // emailService에서 사용하는 DiagnosisFormData 형식으로 변환
      const diagnosisFormData: DiagnosisFormData = {
        submitDate: data.submitDate,
        companyName: data.companyName,
        industry: data.industry,
        businessStage: data.growthStage,
        employeeCount: data.employeeCount,
        establishedYear: '정보 없음', // 간소화 버전에서는 수집하지 않음
        mainConcerns: data.mainConcerns,
        expectedBudget: data.expectedBenefits, // expectedBenefits를 예산란으로 매핑
        urgency: '보통', // 기본값
        contactName: data.contactManager,
        contactPhone: '정보 없음', // 간소화 버전에서는 수집하지 않음
        contactEmail: data.email,
        privacyConsent: data.privacyConsent
      };
      
      // 통합 진단 신청 처리 (Google Sheets 저장 + 이메일 발송)
      const processResult = await processDiagnosisSubmission(diagnosisFormData);
      
      googleSheetsSaved = processResult.sheetSaved;
      emailSent = processResult.autoReplySent;
      warnings = processResult.warnings || [];
      
      if (googleSheetsSaved) {
        console.log('✅ Google Sheets 저장 성공');
      } else {
        console.warn('⚠️ Google Sheets 저장 실패:', processResult.errors);
        warnings.push('구글시트 저장에 실패했지만 진단 결과는 정상적으로 생성되었습니다.');
      }
      
      if (emailSent) {
        console.log('📧 신청 확인 이메일 발송 성공');
      } else {
        console.warn('⚠️ 이메일 발송 실패:', processResult.errors);
        warnings.push('이메일 발송에 실패했지만 진단 결과는 정상적으로 생성되었습니다.');
      }

    } catch (dataProcessingError) {
      console.warn('⚠️ 데이터 처리 중 오류 (진단 결과는 정상):', dataProcessingError);
      warnings.push('일부 기능(구글시트/이메일)에서 오류가 발생했지만 진단 결과는 정상적으로 생성되었습니다.');
    }

    // 4단계: 진단 결과 생성 및 반환 (항상 성공)
    console.log('📊 간소화된 AI 진단 완료');

    return NextResponse.json({
      success: true,
      message: '간소화된 AI 진단이 완료되었습니다.',
      data: {
        diagnosis: diagnosisResult,
        summaryReport: summaryReport,
        reportLength: summaryReport.length,
        resultId: diagnosisResult.resultId,
        resultUrl: `/diagnosis/results/${diagnosisResult.resultId}`,
        submitDate: new Date().toLocaleDateString('ko-KR', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        googleSheetsSaved,
        processingTime: '2-3초',
        reportType: '간소화된 AI 진단 보고서'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 간소화된 AI 진단 API 오류:', error);

    return NextResponse.json({
      success: false,
      error: '간소화된 AI 진단 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 