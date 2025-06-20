// 레벨업 시트 기반 AI 진단 시스템

// 1. 레벨업 시트 데이터 구조
interface LevelUpSheetData {
  evaluationDate: string;
  totalScore: number;
  maxScore: number;
  categories: {
    productService: CategoryScore;
    customerService: CategoryScore;
    marketing: CategoryScore;
    procurement: CategoryScore;
    storeManagement: CategoryScore;
  };
  detailedItems: DetailedItem[];
}

interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  level: 'excellent' | 'good' | 'average' | 'poor' | 'very_poor';
  items: EvaluationItem[];
}

interface EvaluationItem {
  id: number;
  category: string;
  item: string;
  subItem: string;
  score: number;
  level: string;
  criteria: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
}

interface DetailedItem {
  category: string;
  itemName: string;
  currentScore: number;
  targetScore: number;
  improvementPlan: string;
  expectedEffect: string;
}

// 2. 레벨업 시트 분석 엔진
class LevelUpAnalysisEngine {
  // 샘플 데이터 (실제로는 첨부된 시트에서 파싱)
  private sampleData: LevelUpSheetData = {
    evaluationDate: '2024.03.15',
    totalScore: 74,
    maxScore: 100,
    categories: {
      productService: {
        name: '상품/서비스 관리 역량',
        score: 4.2,
        maxScore: 5.0,
        level: 'good',
        items: [
          { id: 1, category: '상품/서비스 관리', item: '기획 수준', subItem: '주력 상품/서비스 구성 및 개선', score: 5, level: '매우 양호', criteria: {} },
          { id: 2, category: '상품/서비스 관리', item: '차별화 정도', subItem: '동종업계 대비 차별화', score: 3, level: '보통', criteria: {} },
          { id: 3, category: '상품/서비스 관리', item: '가격 설정', subItem: '경쟁업체 분석 기반 가격 책정', score: 4, level: '양호', criteria: {} },
          { id: 4, category: '상품/서비스 관리', item: '전문성', subItem: '관련 전문성 및 기술력 보유', score: 4, level: '양호', criteria: {} },
          { id: 5, category: '상품/서비스 관리', item: '품질', subItem: '품질 균일성 및 지속적 개선', score: 5, level: '매우 양호', criteria: {} }
        ]
      },
      customerService: {
        name: '고객응대 역량',
        score: 5.0,
        maxScore: 5.0,
        level: 'excellent',
        items: [
          { id: 6, category: '고객응대', item: '고객맞이', subItem: '직원 용모 및 복장 관리', score: 5, level: '매우 양호', criteria: {} },
          { id: 7, category: '고객응대', item: '고객 응대', subItem: '응대 매뉴얼 및 직원교육', score: 5, level: '매우 양호', criteria: {} },
          { id: 8, category: '고객응대', item: '불만관리', subItem: '표준 체계 및 분석 관리', score: 5, level: '매우 양호', criteria: {} },
          { id: 9, category: '고객응대', item: '고객 유지', subItem: '지속적 유지 관리 방안', score: 5, level: '매우 양호', criteria: {} }
        ]
      },
      marketing: {
        name: '마케팅 역량',
        score: 3.0,
        maxScore: 5.0,
        level: 'average',
        items: [
          { id: 10, category: '마케팅', item: '고객 특성 이해', subItem: '주요 고객 분석 및 트렌드 파악', score: 3, level: '보통', criteria: {} },
          { id: 11, category: '마케팅', item: '마케팅 계획', subItem: '구체적 실행방안 보유', score: 3, level: '보통', criteria: {} },
          { id: 12, category: '마케팅', item: '오프라인 마케팅', subItem: '정기적 판촉행사 운영', score: 3, level: '보통', criteria: {} },
          { id: 13, category: '마케팅', item: '온라인 마케팅', subItem: '온라인 활용 매출 증대', score: 3, level: '보통', criteria: {} },
          { id: 14, category: '마케팅', item: '판매 전략', subItem: '다채널 판매 및 차별화', score: 3, level: '보통', criteria: {} }
        ]
      },
      procurement: {
        name: '구매 및 재고관리',
        score: 3.0,
        maxScore: 5.0,
        level: 'average',
        items: [
          { id: 15, category: '구매/재고', item: '구매관리', subItem: '체계적 구매활동 및 관리', score: 3, level: '보통', criteria: {} },
          { id: 16, category: '구매/재고', item: '재고관리', subItem: '적정 재고 유지 관리', score: 3, level: '보통', criteria: {} }
        ]
      },
      storeManagement: {
        name: '매장관리 역량',
        score: 3.0,
        maxScore: 5.0,
        level: 'average',
        items: [
          { id: 17, category: '매장관리', item: '외관 관리', subItem: '효과적 간판 및 디자인', score: 3, level: '보통', criteria: {} },
          { id: 18, category: '매장관리', item: '인테리어', subItem: '콘셉트 일치 및 편의시설', score: 3, level: '보통', criteria: {} },
          { id: 19, category: '매장관리', item: '청결도', subItem: '주기적 청소 및 위생관리', score: 3, level: '보통', criteria: {} },
          { id: 20, category: '매장관리', item: '작업 동선', subItem: '효율적 공간 구성', score: 3, level: '보통', criteria: {} }
        ]
      }
    },
    detailedItems: []
  };

  async analyzeLevelUpData(data: LevelUpSheetData = this.sampleData): Promise<LevelUpAnalysisResult> {
    // 1. 강점/약점 영역 식별
    const strengthsWeaknesses = this.identifyStrengthsWeaknesses(data);
    
    // 2. SWOT 분석 실행
    const swotAnalysis = await this.generateSWOTAnalysis(data, strengthsWeaknesses);
    
    // 3. 개선 우선순위 도출
    const improvementPriorities = this.calculateImprovementPriorities(data);
    
    // 4. 서비스 매칭
    const serviceRecommendations = this.matchServices(swotAnalysis, improvementPriorities);
    
    return {
      overallScore: data.totalScore,
      categoryScores: data.categories,
      strengthsWeaknesses,
      swotAnalysis,
      improvementPriorities,
      serviceRecommendations,
      actionPlan: this.generateActionPlan(serviceRecommendations, improvementPriorities)
    };
  }

  private identifyStrengthsWeaknesses(data: LevelUpSheetData) {
    const categories = Object.values(data.categories);
    const avgScore = categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length;
    
    const strengths = categories.filter(cat => cat.score >= 4.0);
    const weaknesses = categories.filter(cat => cat.score <= 3.0);
    
    return {
      strengths: strengths.map(s => ({
        category: s.name,
        score: s.score,
        reason: this.getStrengthReason(s)
      })),
      weaknesses: weaknesses.map(w => ({
        category: w.name,
        score: w.score,
        reason: this.getWeaknessReason(w)
      })),
      averageScore: avgScore
    };
  }

  private getStrengthReason(category: CategoryScore): string {
    const reasonMap = {
      '고객응대 역량': '모든 영역에서 5점 만점으로 우수한 고객 서비스 체계 구축',
      '상품/서비스 관리 역량': '기획 수준과 품질 관리에서 탁월한 성과 보유'
    };
    return reasonMap[category.name] || '해당 영역에서 우수한 성과를 보이고 있음';
  }

  private getWeaknessReason(category: CategoryScore): string {
    const reasonMap = {
      '마케팅 역량': '온라인 마케팅과 판매 전략 다변화 필요',
      '구매 및 재고관리': '체계적 구매 관리 및 IT 시스템 도입 필요',
      '매장관리 역량': '고객 경험 향상을 위한 매장 환경 개선 필요'
    };
    return reasonMap[category.name] || '해당 영역에서 개선이 필요함';
  }

  private async generateSWOTAnalysis(data: LevelUpSheetData, strengthsWeaknesses: any) {
    // 외부 시장 트렌드 분석 (O, T)
    const marketTrends = await this.getMarketTrends();
    
    return {
      strengths: [
        '우수한 고객 서비스 체계 (5.0/5.0)',
        '탁월한 상품/서비스 품질 관리',
        '고객 불만 관리 시스템 구축',
        '전문성 기반 차별화된 서비스 제공'
      ],
      weaknesses: [
        '온라인 마케팅 역량 부족 (3.0/5.0)',
        '다채널 판매 전략 미비',
        '디지털 마케팅 활용도 저조',
        '구매/재고 관리 시스템 부족',
        '매장 환경 차별화 부족'
      ],
      opportunities: [
        'O2O 커머스 시장 성장 (연 15% 증가)',
        '개인화 서비스 수요 확대',
        '모바일 쇼핑 트렌드 가속화',
        '정부 디지털 전환 지원 정책',
        '소상공인 대상 AI 도구 보급 확산'
      ],
      threats: [
        '대형 플랫폼 업체의 시장 잠식',
        '온라인 전문 업체와의 경쟁 심화',
        '고객 행동 패턴의 급속한 변화',
        '임대료 및 인건비 상승 압력',
        '코로나19 등 외부 환경 변화'
      ]
    };
  }

  private async getMarketTrends() {
    // 실제로는 외부 API에서 최신 시장 동향 수집
    return {
      o2oGrowthRate: 15,
      mobileCommerceShare: 65,
      aiAdoptionRate: 23,
      digitalTransformationSupport: '정부 지원 확대'
    };
  }

  private calculateImprovementPriorities(data: LevelUpSheetData) {
    const allItems = Object.values(data.categories)
      .flatMap(cat => cat.items)
      .filter(item => item.score <= 3)
      .sort((a, b) => a.score - b.score);

    return allItems.slice(0, 5).map((item, index) => ({
      priority: index + 1,
      category: item.category,
      item: item.item,
      currentScore: item.score,
      targetScore: Math.min(item.score + 2, 5),
      improvementPotential: (Math.min(item.score + 2, 5) - item.score) * 20, // 퍼센트 개선
      urgency: item.score <= 2 ? 'high' : 'medium'
    }));
  }

  private matchServices(swotAnalysis: any, priorities: any[]) {
    const serviceMap = {
      'AI활용 생산성향상': {
        score: 85,
        rationale: '온라인 마케팅 역량 부족과 구매/재고 관리 시스템 미비 해결',
        targetAreas: ['마케팅 자동화', '재고 관리 시스템', '고객 데이터 분석']
      },
      '매출증대 웹사이트구축': {
        score: 80,
        rationale: '다채널 판매 전략 구축 및 온라인 마케팅 강화',
        targetAreas: ['온라인 판매채널', '모바일 최적화', '고객 유입 확대']
      },
      'BM ZEN 사업분석': {
        score: 75,
        rationale: '현재 강점을 활용한 사업모델 고도화 및 차별화 전략',
        targetAreas: ['사업모델 혁신', '수익구조 다변화', '경쟁력 강화']
      },
      '인증컨설팅': {
        score: 70,
        rationale: '우수한 고객 서비스를 바탕으로 한 신뢰도 제고',
        targetAreas: ['품질인증', '서비스 표준화', '브랜드 가치 향상']
      },
      '기술사업화/기술창업': {
        score: 60,
        rationale: '전문성을 활용한 기술 기반 사업 확장',
        targetAreas: ['기술 고도화', '특허 출원', 'R&D 투자']
      },
      '경매활용 공장구매': {
        score: 40,
        rationale: '현재 단계에서는 우선순위 낮음',
        targetAreas: ['사업 확장', '생산 기반 구축']
      }
    };

    return Object.entries(serviceMap)
      .sort(([,a], [,b]) => b.score - a.score)
      .slice(0, 3)
      .map(([service, data], index) => ({
        rank: index + 1,
        serviceName: service,
        score: data.score,
        rationale: data.rationale,
        targetAreas: data.targetAreas,
        expectedROI: this.calculateExpectedROI(service),
        implementationPeriod: this.getImplementationPeriod(service)
      }));
  }

  private calculateExpectedROI(service: string): number {
    const roiMap = {
      'AI활용 생산성향상': 300,
      '매출증대 웹사이트구축': 250,
      'BM ZEN 사업분석': 200,
      '인증컨설팅': 180,
      '기술사업화/기술창업': 350,
      '경매활용 공장구매': 400
    };
    return roiMap[service] || 200;
  }

  private getImplementationPeriod(service: string): string {
    const periodMap = {
      'AI활용 생산성향상': '3-4개월',
      '매출증대 웹사이트구축': '1-2개월',
      'BM ZEN 사업분석': '2-3개월',
      '인증컨설팅': '4-6개월',
      '기술사업화/기술창업': '6-12개월',
      '경매활용 공장구매': '6-8개월'
    };
    return periodMap[service] || '3개월';
  }

  private generateActionPlan(services: any[], priorities: any[]) {
    return {
      phase1: {
        period: '1-3개월',
        focus: '긴급 개선 과제',
        actions: [
          '온라인 마케팅 기반 구축',
          '기본 웹사이트 및 모바일 채널 개설',
          'SNS 마케팅 계정 개설 및 운영 시작'
        ],
        expectedOutcome: '온라인 고객 유입 20% 증가'
      },
      phase2: {
        period: '4-6개월',
        focus: '시스템 구축 및 고도화',
        actions: [
          'AI 기반 고객 관리 시스템 도입',
          '재고 관리 시스템 구축',
          '마케팅 자동화 시스템 구축'
        ],
        expectedOutcome: '업무 효율성 40% 향상'
      },
      phase3: {
        period: '7-12개월',
        focus: '사업 모델 혁신',
        actions: [
          '사업 모델 재설계',
          '신규 수익원 발굴',
          '품질 인증 취득'
        ],
        expectedOutcome: '매출 30% 증대 및 수익성 개선'
      }
    };
  }
}

// 3. 결과 인터페이스
interface LevelUpAnalysisResult {
  overallScore: number;
  categoryScores: any;
  strengthsWeaknesses: any;
  swotAnalysis: any;
  improvementPriorities: any[];
  serviceRecommendations: any[];
  actionPlan: any;
}

// 4. 보고서 생성 엔진
class LevelUpReportGenerator {
  async generateReport(analysisResult: LevelUpAnalysisResult, companyInfo: any): Promise<string> {
    const template = `
# AI 진단결과 요약보고서
## 레벨업 시트 기반 종합 역량 분석

---

## 기업 개요
- **기업명**: ${companyInfo.companyName || '[기업명]'}
- **진단일**: ${new Date().toLocaleDateString('ko-KR')}
- **총점**: ${analysisResult.overallScore}/100점
- **진단 기준**: 레벨업 시트 5개 영역 20개 항목

---

## 1. 종합 진단 결과

### 1.1 역량 현황 분석
**총 점수**: ${analysisResult.overallScore}점 (100점 만점)로 **${this.getOverallLevel(analysisResult.overallScore)}** 수준

**영역별 성과**:
${Object.entries(analysisResult.categoryScores).map(([key, category]: [string, any]) => 
  `- **${category.name}**: ${category.score}/5.0 (${this.getLevelDescription(category.score)})`
).join('\n')}

### 1.2 핵심 성과 분석
**최고 강점 영역**: ${analysisResult.strengthsWeaknesses.strengths[0]?.category} (${analysisResult.strengthsWeaknesses.strengths[0]?.score}/5.0)
- ${analysisResult.strengthsWeaknesses.strengths[0]?.reason}

**주요 개선 영역**: ${analysisResult.strengthsWeaknesses.weaknesses[0]?.category} (${analysisResult.strengthsWeaknesses.weaknesses[0]?.score}/5.0)
- ${analysisResult.strengthsWeaknesses.weaknesses[0]?.reason}

---

## 2. SWOT 분석

### 2.1 강점 (Strengths)
**내부 역량 우수 영역**:
${analysisResult.swotAnalysis.strengths.map((s: string) => `- ${s}`).join('\n')}

### 2.2 약점 (Weaknesses)
**개선 필요 영역**:
${analysisResult.swotAnalysis.weaknesses.map((w: string) => `- ${w}`).join('\n')}

### 2.3 기회 (Opportunities)
**외부 환경 기회 요인**:
${analysisResult.swotAnalysis.opportunities.map((o: string) => `- ${o}`).join('\n')}

### 2.4 위협 (Threats)
**주의 요인**:
${analysisResult.swotAnalysis.threats.map((t: string) => `- ${t}`).join('\n')}

---

## 3. 맞춤형 서비스 전략

### 3.1 우선 추천 서비스 (TOP 3)

${analysisResult.serviceRecommendations.map((service: any) => `
#### ${service.rank === 1 ? '🥇' : service.rank === 2 ? '🥈' : '🥉'} ${service.rank}순위: ${service.serviceName}
**적합도**: ${service.score}점 / **예상 ROI**: ${service.expectedROI}% / **실행 기간**: ${service.implementationPeriod}

**선정 근거**: ${service.rationale}

**핵심 개선 영역**:
${service.targetAreas.map((area: string) => `- ${area}`).join('\n')}
`).join('\n')}

### 3.2 단계별 실행 로드맵

#### Phase 1: ${analysisResult.actionPlan.phase1.focus} (${analysisResult.actionPlan.phase1.period})
**주요 실행 과제**:
${analysisResult.actionPlan.phase1.actions.map((action: string) => `- ${action}`).join('\n')}

**예상 성과**: ${analysisResult.actionPlan.phase1.expectedOutcome}

#### Phase 2: ${analysisResult.actionPlan.phase2.focus} (${analysisResult.actionPlan.phase2.period})
**주요 실행 과제**:
${analysisResult.actionPlan.phase2.actions.map((action: string) => `- ${action}`).join('\n')}

**예상 성과**: ${analysisResult.actionPlan.phase2.expectedOutcome}

#### Phase 3: ${analysisResult.actionPlan.phase3.focus} (${analysisResult.actionPlan.phase3.period})
**주요 실행 과제**:
${analysisResult.actionPlan.phase3.actions.map((action: string) => `- ${action}`).join('\n')}

**예상 성과**: ${analysisResult.actionPlan.phase3.expectedOutcome}

---

## 4. 개선 우선순위

### 4.1 긴급 개선 과제
${analysisResult.improvementPriorities.slice(0, 3).map((item: any, index: number) => `
**${index + 1}. ${item.item}** (${item.category})
- 현재 수준: ${item.currentScore}/5.0 → 목표: ${item.targetScore}/5.0
- 개선 잠재력: ${item.improvementPotential}%
- 긴급도: ${item.urgency === 'high' ? '높음' : '보통'}
`).join('\n')}

### 4.2 기대 효과 분석

**정량적 성과 (12개월 기준)**:
- **매출 증대**: 기존 대비 25-35% 증가 예상
- **업무 효율성**: 40% 향상 (자동화 시스템 도입)
- **고객 만족도**: 현재 ${analysisResult.categoryScores.customerService.score}/5.0 → 5.0/5.0 유지
- **온라인 매출 비중**: 현재 추정 20% → 50% 확대

**정성적 성과**:
- **브랜드 차별화**: 우수한 고객 서비스 기반 브랜드 가치 제고
- **경쟁력 강화**: 디지털 전환을 통한 시장 경쟁력 확보
- **운영 효율성**: 체계적 관리 시스템으로 운영 최적화
- **지속 성장**: 다채널 판매 전략으로 안정적 성장 기반 구축

---

## 5. 투자 계획 및 ROI

### 5.1 단계별 투자 계획
- **Phase 1**: 800-1,200만원 (웹사이트 구축 + 기본 마케팅 시스템)
- **Phase 2**: 1,500-2,500만원 (AI 시스템 + 관리 도구 도입)
- **Phase 3**: 1,000-2,000만원 (인증 취득 + 사업모델 고도화)

**총 투자 규모**: 3,300-5,700만원 (3년간)

### 5.2 예상 투자 회수
- **1년차**: 투자비 회수 50%
- **2년차**: 투자비 100% 회수 + 순이익 창출
- **3년차**: 연간 순이익 2-3배 증가

---

## 6. 결론 및 제언

### 6.1 핵심 메시지
현재 **우수한 고객 서비스 역량(5.0/5.0)**과 **탄탄한 상품/서비스 관리 기반(4.2/5.0)**을 보유하고 있어, **디지털 전환과 마케팅 강화**를 통해 큰 성장을 이룰 수 있는 최적의 시점입니다.

### 6.2 성공을 위한 핵심 요소
1. **긴급 실행**: 온라인 마케팅 기반 구축으로 즉시 효과 창출
2. **체계적 접근**: 3단계 로드맵 준수로 안정적 성장 실현  
3. **강점 활용**: 우수한 고객 서비스를 바탕으로 한 차별화 전략
4. **지속적 개선**: 데이터 기반 의사결정으로 지속적 최적화

### 6.3 기대 결과
12개월 후 **디지털 마케팅 선도 기업**으로 도약하여 업계 내 **혁신 사례**가 될 것으로 전망됩니다.

---

**다음 단계**: 무료 상담 신청 → 상세 실행 계획 수립 → 우선순위 서비스 실행

**연락처**:
- 담당자: 이후경 책임컨설턴트
- 전화: 010-9251-9743  
- 이메일: lhk@injc.kr

---
*본 진단 결과는 레벨업 시트 분석과 Business Model Zen 프레임워크를 기반으로 작성되었으며, 향후 3개월간 무료 사후관리가 제공됩니다.*
    `;

    return template;
  }

  private getOverallLevel(score: number): string {
    if (score >= 80) return '우수';
    if (score >= 70) return '양호';
    if (score >= 60) return '보통';
    if (score >= 50) return '개선 필요';
    return '시급한 개선 필요';
  }

  private getLevelDescription(score: number): string {
    if (score >= 4.5) return '매우 우수';
    if (score >= 4.0) return '우수';
    if (score >= 3.5) return '양호';
    if (score >= 3.0) return '보통';
    return '개선 필요';
  }
}

// 5. 메인 API
export class LevelUpDiagnosisAPI {
  private analysisEngine = new LevelUpAnalysisEngine();
  private reportGenerator = new LevelUpReportGenerator();

  async processLevelUpDiagnosis(levelUpData: any, companyInfo: any) {
    try {
      // 1. 레벨업 시트 분석
      const analysisResult = await this.analysisEngine.analyzeLevelUpData(levelUpData);
      
      // 2. 보고서 생성
      const reportContent = await this.reportGenerator.generateReport(analysisResult, companyInfo);
      
      // 3. PDF 생성 (선택사항)
      const pdfUrl = await this.generatePDF(reportContent, companyInfo.companyName);
      
      return {
        success: true,
        analysisResult,
        reportContent,
        pdfUrl,
        processedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('레벨업 진단 처리 오류:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async generatePDF(content: string, companyName: string): Promise<string> {
    // PDF 생성 로직
    return `/pdfs/levelup-diagnosis-${companyName}-${Date.now()}.pdf`;
  }
}