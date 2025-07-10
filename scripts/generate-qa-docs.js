#!/usr/bin/env node

/**
 * M-CENTER Q&A 문서 생성 스크립트
 * FAQ 페이지의 데이터를 추출하여 체계적인 문서로 생성
 */

const fs = require('fs');
const path = require('path');

// FAQ 데이터 구조 (실제 FAQ 페이지에서 추출)
const faqData = {
  growth: {
    title: '성장기 스타트업',
    icon: '🚀',
    description: '기술창업, 투자유치, 정부지원',
    questions: [
      {
        id: 'growth-1',
        question: '레이저솔드링 기술로 창업을 준비 중인데, 정부지원 로드맵을 알고 싶어요',
        primaryService: '기술사업화',
        relatedServices: ['정책자금', 'BM ZEN 사업분석'],
        summary: 'ABC기업 성공사례 기반 4단계 성장 로드맵 제시 (총 87억원 확보)',
        keyPoints: ['특허출원', '예비벤처', 'TIPS선정', 'IPO준비'],
        roi: '2,174%'
      },
      {
        id: 'growth-2', 
        question: '우리 기술의 시장성과 사업성을 정확히 검증받고 싶어요',
        primaryService: 'BM ZEN 사업분석',
        relatedServices: ['기술사업화', '정책자금'],
        summary: 'BM ZEN 프레임워크로 과학적 검증 (K바이오텍 80억원 확보)',
        keyPoints: ['가치발견', '가치창출', '가치제공'],
        roi: '280%'
      },
      {
        id: 'growth-3',
        question: '투자유치를 위해 어떤 준비가 필요한가요?',
        primaryService: '기술사업화',
        relatedServices: ['BM ZEN 사업분석', '인증지원'],
        summary: '투자 단계별 맞춤 전략 (Pre-A부터 IPO까지)',
        keyPoints: ['MVP개발', '시장검증', '팀빌딩', '상장준비'],
        roi: '500억원 기업가치'
      },
      {
        id: 'growth-4',
        question: '정부 R&D 과제 선정 확률을 높이려면?',
        primaryService: '기술사업화',
        relatedServices: ['정책자금', '인증지원'],
        summary: '25년 R&D 전문가 노하우 (ABC기업 15억원 확보)',
        keyPoints: ['기술혁신성', '시장파급효과', '사업화가능성', '팀역량'],
        roi: '15억원 R&D 확보'
      },
      {
        id: 'growth-5',
        question: '해외진출을 위한 준비와 지원방안은?',
        primaryService: '기술사업화',
        relatedServices: ['정책자금', 'BM ZEN 사업분석'],
        summary: '글로벌 진출 3단계 전략 (해외시장진출지원사업 연계)',
        keyPoints: ['시장조사', '현지화전략', '파트너발굴', '브랜딩'],
        roi: '20억원 해외진출 지원'
      }
    ]
  },
  manufacturing: {
    title: '제조업 경영진',
    icon: '🏭',
    description: '전통 제조업, 고정비 부담, 생산성 이슈',
    questions: [
      {
        id: 'mfg-1',
        question: '공장 확장을 위한 대규모 정책자금 확보가 가능한가요?',
        primaryService: '정책자금',
        relatedServices: ['BM ZEN 사업분석', '인증지원'],
        summary: 'H관광개발 100억원 확보 사례 (연 1.8% 저금리)',
        keyPoints: ['시설자금', '운영자금', '기술개발자금'],
        roi: '3.2%p 금리절감'
      },
      {
        id: 'mfg-2',
        question: '스마트팩토리 구축을 위한 지원방안은?',
        primaryService: 'AI 생산성향상',
        relatedServices: ['정책자금', '인증지원'],
        summary: '4차 산업혁명 대응 스마트팩토리 4단계 구축',
        keyPoints: ['현황진단', 'IoT/AI도입', '데이터통합', '자율운영'],
        roi: '27억원 지원'
      },
      {
        id: 'mfg-3',
        question: '환경규제 대응과 친환경 전환 지원은?',
        primaryService: '인증지원',
        relatedServices: ['정책자금', 'BM ZEN 사업분석'],
        summary: 'ESG 경영과 탄소중립 대응 종합 솔루션',
        keyPoints: ['탄소배출측정', '친환경설비', '재생에너지', 'ISO인증'],
        roi: '60억원 그린뉴딜'
      },
      {
        id: 'mfg-4',
        question: '대기업 납품을 위한 인증과 품질관리는?',
        primaryService: '인증지원',
        relatedServices: ['BM ZEN 사업분석', 'AI 생산성향상'],
        summary: '대기업 협력사 등록 4단계 전략 (ABC기업 12개 인증)',
        keyPoints: ['ISO통합인증', '벤처/이노비즈', '품질시스템', '협력사등록'],
        roi: '납품단가 20% 상승'
      }
    ]
  },
  service: {
    title: '서비스업 소상공인',
    icon: '🏢',
    description: '직원 5-20명, 온라인 마케팅 필요',
    questions: [
      {
        id: 'svc-1',
        question: '온라인 매출을 늘리기 위한 종합 마케팅 전략은?',
        primaryService: '웹사이트 구축',
        relatedServices: ['BM ZEN 사업분석', 'AI 생산성향상'],
        summary: '디지털 마케팅 통합 솔루션 (G제조업 연 15억 웹매출)',
        keyPoints: ['SEO최적화', 'AI콘텐츠', '소셜미디어', '키워드광고'],
        roi: '매출 300% 증대'
      },
      {
        id: 'svc-2',
        question: '소상공인도 정부지원을 받을 수 있나요?',
        primaryService: '정책자금',
        relatedServices: ['웹사이트 구축', 'BM ZEN 사업분석'],
        summary: '소상공인 맞춤형 지원프로그램 (최대 5천만원)',
        keyPoints: ['창업자금', '경영개선', '디지털전환', '마케팅지원'],
        roi: '8천만원 지원'
      },
      {
        id: 'svc-3',
        question: '직원 교육과 인재 확보 방안은?',
        primaryService: 'BM ZEN 사업분석',
        relatedServices: ['정책자금', 'AI 생산성향상'],
        summary: '인적자원 개발과 우수인재 확보 4단계 전략',
        keyPoints: ['채용전략', '직업훈련', '복리후생', '성과관리'],
        roi: '월 110만원 지원'
      },
      {
        id: 'svc-4',
        question: '프랜차이즈 창업과 운영 노하우는?',
        primaryService: 'BM ZEN 사업분석',
        relatedServices: ['정책자금', '웹사이트 구축'],
        summary: '프랜차이즈 성공 5단계 체계적 가이드',
        keyPoints: ['브랜드선택', '입지선정', '자금조달', '운영시스템'],
        roi: '8억원 창업자금'
      }
    ]
  },
  policyFunding: {
    title: '정책자금 특별상담',
    icon: '💰',
    description: '대규모 정책자금 확보 실사례',
    questions: [
      {
        id: 'policy-1',
        question: '업종별 맞춤형 정책자금 종류와 조건은?',
        primaryService: '정책자금',
        relatedServices: ['BM ZEN 사업분석', '인증지원'],
        summary: '업종별 특성에 맞는 최적 정책자금 매칭',
        keyPoints: ['제조업50억', '서비스업10억', '기술기업100억'],
        roi: '연 1.0-3.0% 저금리'
      },
      {
        id: 'policy-2',
        question: '정책자금 신청부터 실행까지 전체 프로세스는?',
        primaryService: '정책자금',
        relatedServices: ['BM ZEN 사업분석'],
        summary: '정책자금 확보 8단계 완벽 대행 (평균 3-6개월)',
        keyPoints: ['기업진단', '자금매칭', '서류준비', '심사대응'],
        roi: '95% 성공률'
      },
      {
        id: 'policy-3',
        question: '정책자금과 은행대출의 차이점과 장점은?',
        primaryService: '정책자금',
        relatedServices: ['BM ZEN 사업분석'],
        summary: '정책자금 vs 시중은행 비교분석 (10억원 기준)',
        keyPoints: ['저금리1.5%', '저담보50%', '장기상환10년'],
        roi: '2.6억원 절약'
      }
    ]
  },
  strategy: {
    title: '성장전략 컨설팅',
    icon: '🎯',
    description: '매출 정체, 신사업 진출, 구조개선',
    questions: [
      {
        id: 'strategy-1',
        question: '매출 정체기 돌파를 위한 성장전략은?',
        primaryService: 'BM ZEN 사업분석',
        relatedServices: ['AI 생산성향상', '정책자금'],
        summary: 'BM ZEN 분석으로 새로운 성장동력 발굴 (J기업 200% 성장)',
        keyPoints: ['현황진단', '문제발굴', '전략수립', '실행계획'],
        roi: '매출 200% 성장'
      },
      {
        id: 'strategy-2',
        question: '디지털 전환과 AI 도입 전략은?',
        primaryService: 'AI 생산성향상',
        relatedServices: ['BM ZEN 사업분석', '웹사이트 구축'],
        summary: 'AI 시대 디지털 혁신 4단계 로드맵 (ABC기업 120% 생산성 향상)',
        keyPoints: ['데이터수집', '업무자동화', 'AI플랫폼', 'AI신사업'],
        roi: '생산성 120% 향상'
      }
    ]
  },
  comprehensive: {
    title: '종합 상담',
    icon: '🔄',
    description: '통합 솔루션, 맞춤형 포트폴리오',
    questions: [
      {
        id: 'comp-1',
        question: '우리 회사에 가장 적합한 서비스 조합은?',
        primaryService: '종합 컨설팅',
        relatedServices: ['모든 서비스'],
        summary: '기업 상황별 맞춤형 서비스 포트폴리오 제안',
        keyPoints: ['창업기조합', '성장기조합', '성숙기조합'],
        roi: '평균 400% ROI'
      },
      {
        id: 'comp-2',
        question: 'M-CENTER만의 차별화된 장점은?',
        primaryService: '종합 컨설팅',
        relatedServices: ['모든 서비스'],
        summary: '25년 축적된 전문성과 검증된 성과 (300건+ 성공사례)',
        keyPoints: ['검증된성과', '원스톱서비스', '전문가네트워크', '성과보장'],
        roi: '95% 성공률'
      }
    ]
  }
};

// 서비스별 상세 정보
const serviceDetails = {
  'BM ZEN 사업분석': {
    icon: '🎯',
    description: '비즈니스 모델 최적화를 통한 수익성 개선',
    effect: '매출 20-40% 증대',
    duration: '2-3개월',
    roi: '300-800%'
  },
  'AI 생산성향상': {
    icon: '🤖',
    description: 'ChatGPT 등 AI 도구 활용 업무 효율화',
    effect: '업무효율 40-60% 향상',
    duration: '1-2개월',
    roi: '400-1000%'
  },
  '정책자금': {
    icon: '💰',
    description: '정부 정책자금 활용한 사업 확장 및 투자',
    effect: '자금 조달 성공률 95%',
    duration: '2-6개월',
    roi: '200-800%'
  },
  '기술사업화': {
    icon: '🚀',
    description: '기술 기반 사업화 및 창업 지원',
    effect: '평균 5억원 자금 확보',
    duration: '6-12개월',
    roi: '500-2000%'
  },
  '인증지원': {
    icon: '🏆',
    description: '벤처/이노비즈/ISO 등 각종 인증 취득',
    effect: '연간 5,000만원 세제혜택',
    duration: '3-6개월',
    roi: '200-600%'
  },
  '웹사이트 구축': {
    icon: '🌐',
    description: 'SEO 최적화 웹사이트 구축으로 온라인 마케팅 강화',
    effect: '온라인 매출 30-50% 증대',
    duration: '2-4개월',
    roi: '150-400%'
  }
};

// 문서 생성 함수들
function generateQAOverview() {
  const totalQuestions = Object.values(faqData).reduce((sum, persona) => sum + persona.questions.length, 0);
  
  return `# 📋 M-CENTER 고객지원 Q&A 시스템 분석

## 📊 전체 현황

- **총 질문 수**: ${totalQuestions}개
- **페르소나 수**: ${Object.keys(faqData).length}개
- **서비스 연계**: 6대 핵심서비스 완벽 연동
- **답변 기준**: 25년 전문가 경험 + 실제 성공사례

## 🎯 페르소나별 분포

${Object.entries(faqData).map(([key, persona]) => 
  `- **${persona.icon} ${persona.title}**: ${persona.questions.length}개 질문 (${persona.description})`
).join('\n')}

## 🏆 주요 성과 지표

${Object.values(faqData).flatMap(persona => 
  persona.questions.map(q => `- **${q.primaryService}**: ${q.roi || '높은 ROI'}`)
).slice(0, 10).join('\n')}

---
`;
}

function generatePersonaDetail(personaKey, persona) {
  return `## ${persona.icon} ${persona.title}

**특성**: ${persona.description}
**질문 수**: ${persona.questions.length}개

${persona.questions.map((q, index) => `
### Q${index + 1}. ${q.question}

**주요 서비스**: ${q.primaryService}
**연관 서비스**: ${q.relatedServices.join(', ')}
**핵심 내용**: ${q.summary}
**주요 포인트**: ${q.keyPoints.join(' • ')}
**기대 효과**: ${q.roi}

---
`).join('')}
`;
}

function generateServiceMatrix() {
  const serviceCount = {};
  Object.values(faqData).forEach(persona => {
    persona.questions.forEach(q => {
      serviceCount[q.primaryService] = (serviceCount[q.primaryService] || 0) + 1;
      q.relatedServices.forEach(service => {
        serviceCount[service] = (serviceCount[service] || 0) + 0.5;
      });
    });
  });

  return `## 📊 서비스별 질문 분포

${Object.entries(serviceCount)
  .sort(([,a], [,b]) => b - a)
  .map(([service, count]) => `- **${service}**: ${count}회 언급`)
  .join('\n')}

## 🎯 서비스 상세 정보

${Object.entries(serviceDetails).map(([service, details]) => `
### ${details.icon} ${service}

- **설명**: ${details.description}
- **효과**: ${details.effect}
- **기간**: ${details.duration}
- **ROI**: ${details.roi}
`).join('')}
`;
}

function generateFullDocument() {
  const overview = generateQAOverview();
  const personas = Object.entries(faqData).map(([key, persona]) => 
    generatePersonaDetail(key, persona)
  ).join('\n');
  const serviceMatrix = generateServiceMatrix();

  return `${overview}

${personas}

${serviceMatrix}

## 📞 상담 신청

**즉시 상담**: 010-9251-9743
**이메일**: hongik423@gmail.com
**상담시간**: 평일 09:00-18:00

**🎁 무료 혜택**
- 기업진단 (30만원 상당)
- 맞춤형 성장전략 (50만원 상당)
- 정부지원 프로그램 안내

---

*본 문서는 M-CENTER FAQ 시스템에서 자동 생성되었습니다.*
*최종 업데이트: ${new Date().toLocaleString('ko-KR')}*
`;
}

// 메인 실행 함수
function generateQADocs() {
  try {
    // docs 디렉토리 생성
    const docsDir = path.join(__dirname, '..', 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // 전체 문서 생성
    const fullDoc = generateFullDocument();
    fs.writeFileSync(
      path.join(docsDir, 'M-CENTER_QA_시스템_분석.md'), 
      fullDoc, 
      'utf8'
    );

    // 페르소나별 개별 문서 생성
    Object.entries(faqData).forEach(([key, persona]) => {
      const personaDoc = generatePersonaDetail(key, persona);
      fs.writeFileSync(
        path.join(docsDir, `QA_${persona.title.replace(/\s+/g, '_')}.md`),
        personaDoc,
        'utf8'
      );
    });

    // JSON 데이터 파일 생성
    fs.writeFileSync(
      path.join(docsDir, 'qa-data.json'),
      JSON.stringify({ faqData, serviceDetails }, null, 2),
      'utf8'
    );

    console.log('✅ Q&A 문서 생성 완료!');
    console.log(`📁 생성된 파일:`);
    console.log(`   - M-CENTER_QA_시스템_분석.md (전체 분석)`);
    console.log(`   - QA_[페르소나명].md (개별 페르소나)`);
    console.log(`   - qa-data.json (JSON 데이터)`);
    
  } catch (error) {
    console.error('❌ 문서 생성 실패:', error.message);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  generateQADocs();
}

module.exports = { generateQADocs, faqData, serviceDetails }; 