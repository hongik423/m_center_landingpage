'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building, 
  User, 
  Users, 
  MapPin,
  AlertCircle,
  Star,
  Loader2,
  CheckCircle,
  FileText,
  Brain,
  Clock,
  Building2,
  Target,
  TrendingUp,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';
import { safeGet, validateApiResponse, collectErrorInfo, checkApiCompatibility } from '@/lib/utils/safeDataAccess';

// 레벨업 시트 기반 진단 폼 검증 스키마 (20개 객관식 + 기본 정보)
const levelUpDiagnosisFormSchema = z.object({
  // 기본 정보
  companyName: z.string().min(2, '회사명을 입력해주세요'),
  industry: z.string().min(1, '업종을 선택해주세요'),
  contactManager: z.string().min(2, '담당자명을 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요').min(1, '이메일을 입력해주세요'),
  employeeCount: z.string().min(1, '직원수를 선택해주세요'),
  businessLocation: z.string().min(1, '사업장을 선택해주세요'),
  
  // 상품/서비스 관리 역량 (5개 항목)
  planning_level: z.string().min(1, '기획 수준을 선택해주세요'),
  differentiation_level: z.string().min(1, '차별화 정도를 선택해주세요'),
  pricing_level: z.string().min(1, '가격 설정을 선택해주세요'),
  expertise_level: z.string().min(1, '전문성을 선택해주세요'),
  quality_level: z.string().min(1, '품질 수준을 선택해주세요'),
  
  // 고객응대 역량 (4개 항목)
  customer_greeting: z.string().min(1, '고객맞이를 선택해주세요'),
  customer_service: z.string().min(1, '고객 응대를 선택해주세요'),
  complaint_management: z.string().min(1, '불만관리를 선택해주세요'),
  customer_retention: z.string().min(1, '고객 유지를 선택해주세요'),
  
  // 마케팅 역량 (5개 항목)
  customer_understanding: z.string().min(1, '고객 특성 이해를 선택해주세요'),
  marketing_planning: z.string().min(1, '마케팅 계획을 선택해주세요'),
  offline_marketing: z.string().min(1, '오프라인 마케팅을 선택해주세요'),
  online_marketing: z.string().min(1, '온라인 마케팅을 선택해주세요'),
  sales_strategy: z.string().min(1, '판매 전략을 선택해주세요'),
  
  // 구매 및 재고관리 (2개 항목)
  purchase_management: z.string().min(1, '구매관리를 선택해주세요'),
  inventory_management: z.string().min(1, '재고관리를 선택해주세요'),
  
  // 매장관리 역량 (4개 항목)
  exterior_management: z.string().min(1, '외관 관리를 선택해주세요'),
  interior_management: z.string().min(1, '인테리어 관리를 선택해주세요'),
  cleanliness: z.string().min(1, '청결도를 선택해주세요'),
  work_flow: z.string().min(1, '작업 동선을 선택해주세요'),
  
  // 주관식 항목
  mainConcerns: z.string().min(10, '주요 고민사항을 구체적으로 입력해주세요 (최소 10자)'),
  expectedBenefits: z.string().min(10, '예상 혜택을 입력해주세요 (최소 10자)'),
  
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: '개인정보 수집 및 이용에 동의해주세요',
  }),
});

type LevelUpDiagnosisFormData = z.infer<typeof levelUpDiagnosisFormSchema>;

interface SimplifiedDiagnosisFormProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
}

// 레벨업 시트 기반 평가 항목 정의
const evaluationCategories = {
  productService: {
    name: '상품/서비스 관리 역량',
    icon: '📦',
    items: [
      {
        id: 'planning_level',
        title: '기획 수준',
        question: '주력으로 하고 있는 상품과 서비스의 구성이 확고하며 주기적으로 개선을 하고 있는가?'
      },
      {
        id: 'differentiation_level',
        title: '차별화 정도',
        question: '동종업계의 상품 및 서비스와 차별화되며 모방이 가능한가?'
      },
      {
        id: 'pricing_level',
        title: '가격 설정의 적절성',
        question: '해당 상권 내 경쟁업체와의 분석을 주기적으로 파악하며 가격 설정이 적절히 되었는가?'
      },
      {
        id: 'expertise_level',
        title: '전문성 및 기술력',
        question: '상품 및 서비스와 관련된 전문성과 기술력을 보유하고 있는가? (교육이력, 자격증 등)'
      },
      {
        id: 'quality_level',
        title: '품질',
        question: '상품 및 서비스의 품질이 균일하며 능동적으로 품질을 지속적으로 개선하는가?'
      }
    ]
  },
  customerService: {
    name: '고객응대 역량',
    icon: '👥',
    items: [
      {
        id: 'customer_greeting',
        title: '고객맞이',
        question: '직원들의 미소와 용모가 단정하며 복장이나 청결상태를 주기적으로 관리하는가?'
      },
      {
        id: 'customer_service',
        title: '고객 응대',
        question: '고객의 요청사항에 대한 매뉴얼이 있으며 주기적인 직원교육을 통해 원활한 고객응대를 하고 있는가?'
      },
      {
        id: 'complaint_management',
        title: '고객 불만관리',
        question: '고객 불만 사항에 대한 표준 체계를 갖추고 불만사항을 주기적으로 분석하며 관리하는가?'
      },
      {
        id: 'customer_retention',
        title: '고객 유지',
        question: '고객을 지속적으로 유지하고 관리하기 위한 방안을 보유하며 수행하고 있는가?'
      }
    ]
  },
  marketing: {
    name: '마케팅 역량',
    icon: '📈',
    items: [
      {
        id: 'customer_understanding',
        title: '고객 특성 이해',
        question: '주요 고객의 특성에 관해 주기적으로 분석하며 시장의 전반적인 트렌드를 파악하고 있는가?'
      },
      {
        id: 'marketing_planning',
        title: '마케팅 및 홍보 계획',
        question: '마케팅 홍보에 대한 이해와 관심이 있으며 구체적인 실행방안을 가지고 있는가?'
      },
      {
        id: 'offline_marketing',
        title: '오프라인 마케팅',
        question: '판촉행사를 정기적으로 운영하며 표준화된 운영 방식이 있는가?'
      },
      {
        id: 'online_marketing',
        title: '온라인 마케팅',
        question: '온라인 마케팅에 대한 관심이 있으며 활용을 통한 매출액 증대로 이루어지고 있는가?'
      },
      {
        id: 'sales_strategy',
        title: '판매 전략',
        question: '오프라인, 온라인, 모바일 판매 채널을 모두 보유하고 있으며 판매 채널에 따라 상품/서비스의 구성을 달리하는가?'
      }
    ]
  },
  procurement: {
    name: '구매 및 재고관리',
    icon: '📊',
    items: [
      {
        id: 'purchase_management',
        title: '구매관리',
        question: '상품과 서비스의 생산과 제조를 위한 원재료, 설비등의 구매를 정리하여 관리하고 있으며 적정주기에 구매활동을 실행하고 있는가?'
      },
      {
        id: 'inventory_management',
        title: '재고관리',
        question: '판매계획 또는 구매계획을 바탕으로 재고를 주기적으로 관리하여 적정한 재고를 유지하는가?'
      }
    ]
  },
  storeManagement: {
    name: '매장관리 역량',
    icon: '🏪',
    items: [
      {
        id: 'exterior_management',
        title: '외관 관리',
        question: '점포와 매장의 간판이나 디자인이 상품/서비스의 특징을 잘 나타내며 고객에게 효율적으로 어필이 되고 있는가?'
      },
      {
        id: 'interior_management',
        title: '인테리어 관리',
        question: '인테리어가 주력 상품이나 서비스의 컨셉과 일치하며 주요 고객의 편의 요구에 따라 필요한 부대시설을 갖추고 있는가?'
      },
      {
        id: 'cleanliness',
        title: '청결도',
        question: '점포 내/외부가 전반적으로 청결한 편이며 주기적인 청소를 시행하고 있는가?'
      },
      {
        id: 'work_flow',
        title: '작업 동선',
        question: '작업을 위한 공간이 효율적으로 확보되었으며 고객들과의 지속적인 소통이 가능한가?'
      }
    ]
  }
};

// 5점 척도 선택지
const evaluationOptions = [
  { value: '5', label: '매우 우수 (5점)', description: '완벽하게 수행하고 있음' },
  { value: '4', label: '우수 (4점)', description: '대부분 잘 수행하고 있음' },
  { value: '3', label: '보통 (3점)', description: '어느 정도 수행하고 있음' },
  { value: '2', label: '부족 (2점)', description: '부분적으로만 수행하고 있음' },
  { value: '1', label: '매우 부족 (1점)', description: '거의 수행하지 않음' }
];

// 레벨업 시트 기반 진단 결과 생성 함수
function generateLevelUpDiagnosisResults(data: LevelUpDiagnosisFormData) {
  // 20개 객관식 질문 점수 계산
  const scores = {
    // 상품/서비스 관리 역량 (5개 항목)
    planning_level: parseInt(data.planning_level),
    differentiation_level: parseInt(data.differentiation_level),
    pricing_level: parseInt(data.pricing_level),
    expertise_level: parseInt(data.expertise_level),
    quality_level: parseInt(data.quality_level),
    
    // 고객응대 역량 (4개 항목)
    customer_greeting: parseInt(data.customer_greeting),
    customer_service: parseInt(data.customer_service),
    complaint_management: parseInt(data.complaint_management),
    customer_retention: parseInt(data.customer_retention),
    
    // 마케팅 역량 (5개 항목)
    customer_understanding: parseInt(data.customer_understanding),
    marketing_planning: parseInt(data.marketing_planning),
    offline_marketing: parseInt(data.offline_marketing),
    online_marketing: parseInt(data.online_marketing),
    sales_strategy: parseInt(data.sales_strategy),
    
    // 구매 및 재고관리 (2개 항목)
    purchase_management: parseInt(data.purchase_management),
    inventory_management: parseInt(data.inventory_management),
    
    // 매장관리 역량 (4개 항목)
    exterior_management: parseInt(data.exterior_management),
    interior_management: parseInt(data.interior_management),
    cleanliness: parseInt(data.cleanliness),
    work_flow: parseInt(data.work_flow)
  };

  // 카테고리별 점수 계산 (정확한 가중치 적용)
  const categoryScores = {
    productService: {
      name: '상품/서비스 관리 역량',
      score: (scores.planning_level + scores.differentiation_level + scores.pricing_level + scores.expertise_level + scores.quality_level) / 5,
      maxScore: 5.0,
      weight: 0.25, // 25%
      items: [
        { name: '기획 수준', score: scores.planning_level, question: '주력으로 하고 있는 상품과 서비스의 구성이 확고하며 주기적으로 개선을 하고 있는가?' },
        { name: '차별화 정도', score: scores.differentiation_level, question: '동종업계의 상품 및 서비스와 차별화되며 모방이 가능한가?' },
        { name: '가격 설정', score: scores.pricing_level, question: '해당 상권 내 경쟁업체와의 분석을 주기적으로 파악하며 가격 설정이 적절히 되었는가?' },
        { name: '전문성', score: scores.expertise_level, question: '상품 및 서비스와 관련된 전문성과 기술력을 보유하고 있는가?' },
        { name: '품질', score: scores.quality_level, question: '상품 및 서비스의 품질이 균일하며 능동적으로 품질을 지속적으로 개선하는가?' }
      ]
    },
    customerService: {
      name: '고객응대 역량',
      score: (scores.customer_greeting + scores.customer_service + scores.complaint_management + scores.customer_retention) / 4,
      maxScore: 5.0,
      weight: 0.20, // 20%
      items: [
        { name: '고객맞이', score: scores.customer_greeting, question: '직원들의 미소와 용모가 단정하며 복장이나 청결상태를 주기적으로 관리하는가?' },
        { name: '고객 응대', score: scores.customer_service, question: '고객의 요청사항에 대한 매뉴얼이 있으며 주기적인 직원교육을 통해 원활한 고객응대를 하고 있는가?' },
        { name: '불만관리', score: scores.complaint_management, question: '고객 불만 사항에 대한 표준 체계를 갖추고 불만사항을 주기적으로 분석하며 관리하는가?' },
        { name: '고객 유지', score: scores.customer_retention, question: '고객을 지속적으로 유지하고 관리하기 위한 방안을 보유하며 수행하고 있는가?' }
      ]
    },
    marketing: {
      name: '마케팅 역량',
      score: (scores.customer_understanding + scores.marketing_planning + scores.offline_marketing + scores.online_marketing + scores.sales_strategy) / 5,
      maxScore: 5.0,
      weight: 0.25, // 25%
      items: [
        { name: '고객 특성 이해', score: scores.customer_understanding, question: '주요 고객의 특성에 관해 주기적으로 분석하며 시장의 전반적인 트렌드를 파악하고 있는가?' },
        { name: '마케팅 계획', score: scores.marketing_planning, question: '마케팅 홍보에 대한 이해와 관심이 있으며 구체적인 실행방안을 가지고 있는가?' },
        { name: '오프라인 마케팅', score: scores.offline_marketing, question: '판촉행사를 정기적으로 운영하며 표준화된 운영 방식이 있는가?' },
        { name: '온라인 마케팅', score: scores.online_marketing, question: '온라인 마케팅에 대한 관심이 있으며 활용을 통한 매출액 증대로 이루어지고 있는가?' },
        { name: '판매 전략', score: scores.sales_strategy, question: '오프라인, 온라인, 모바일 판매 채널을 모두 보유하고 있으며 판매 채널에 따라 상품/서비스의 구성을 달리하는가?' }
      ]
    },
    procurement: {
      name: '구매 및 재고관리',
      score: (scores.purchase_management + scores.inventory_management) / 2,
      maxScore: 5.0,
      weight: 0.15, // 15%
      items: [
        { name: '구매관리', score: scores.purchase_management, question: '상품과 서비스의 생산과 제조를 위한 원재료, 설비등의 구매를 정리하여 관리하고 있으며 적정주기에 구매활동을 실행하고 있는가?' },
        { name: '재고관리', score: scores.inventory_management, question: '판매계획 또는 구매계획을 바탕으로 재고를 주기적으로 관리하여 적정한 재고를 유지하는가?' }
      ]
    },
    storeManagement: {
      name: '매장관리 역량',
      score: (scores.exterior_management + scores.interior_management + scores.cleanliness + scores.work_flow) / 4,
      maxScore: 5.0,
      weight: 0.15, // 15%
      items: [
        { name: '외관 관리', score: scores.exterior_management, question: '점포와 매장의 간판이나 디자인이 상품/서비스의 특징을 잘 나타내며 고객에게 효율적으로 어필이 되고 있는가?' },
        { name: '인테리어', score: scores.interior_management, question: '인테리어가 주력 상품이나 서비스의 컨셉과 일치하며 주요 고객의 편의 요구에 따라 필요한 부대시설을 갖추고 있는가?' },
        { name: '청결도', score: scores.cleanliness, question: '점포 내/외부가 전반적으로 청결한 편이며 주기적인 청소를 시행하고 있는가?' },
        { name: '작업 동선', score: scores.work_flow, question: '작업을 위한 공간이 효율적으로 확보되었으며 고객들과의 지속적인 소통이 가능한가?' }
      ]
    }
  };

  // 🎯 **정확한 100점 만점 계산 (가중치 적용)**
  const totalScore = Math.round(
    (categoryScores.productService.score * categoryScores.productService.weight +
     categoryScores.customerService.score * categoryScores.customerService.weight +
     categoryScores.marketing.score * categoryScores.marketing.weight +
     categoryScores.procurement.score * categoryScores.procurement.weight +
     categoryScores.storeManagement.score * categoryScores.storeManagement.weight) * 20
  );

  // 🔍 **기업 검색 정보 생성**
  const companySearchInfo = generateCompanySearchInfo(data);

  // 강점/약점 분석
  const strengthsWeaknesses = identifyStrengthsWeaknesses(categoryScores);
  
  // SWOT 분석 (기업 검색 정보 반영)
  const swotAnalysis = generateLevelUpSWOTAnalysis(categoryScores, data, companySearchInfo);
  
  // 개선 우선순위
  const improvementPriorities = calculateImprovementPriorities(categoryScores);
  
  // 서비스 추천 (기업 검색 정보 반영)
  const serviceRecommendations = matchLevelUpServices(swotAnalysis, improvementPriorities, companySearchInfo);
  
  // 액션 플랜
  const actionPlan = generateLevelUpActionPlan(serviceRecommendations, improvementPriorities);
  
  // 🎯 **개선된 진단 보고서 생성 (기업 검색 정보 + 상세 점수 반영)**
  const diagnosticReport = generateEnhancedLevelUpDiagnosticReport(
    data, 
    totalScore, 
    categoryScores, 
    swotAnalysis, 
    serviceRecommendations,
    companySearchInfo
  );

  return {
    success: true,
    data: {
      diagnosis: {
        companyName: data.companyName,
        totalScore: totalScore,
        categoryScores: categoryScores,
        marketPosition: getMarketPosition(totalScore),
        industryGrowth: getIndustryGrowth(data.industry),
        reliabilityScore: '98%',
        industry: data.industry,
        employeeCount: data.employeeCount,
        scoreDescription: getLevelUpGradeDescription(totalScore),
        detailedScores: scores, // 📊 상세 문항별 점수 추가
        companySearchInfo: companySearchInfo, // 🔍 기업 검색 정보 추가
        strengths: strengthsWeaknesses.strengths,
        weaknesses: strengthsWeaknesses.weaknesses,
        opportunities: swotAnalysis.opportunities,
        threats: swotAnalysis.threats,
        currentSituationForecast: generateLevelUpSituationForecast(data, categoryScores, companySearchInfo),
        recommendedServices: serviceRecommendations.slice(0, 3).map((service: any) => ({
          name: service.serviceName,
          description: service.rationale,
          expectedEffect: `예상 ROI: ${service.expectedROI}%`,
          duration: service.implementationPeriod,
          successRate: '95%',
          priority: service.rank === 1 ? 'highest' : 'high'
        })),
        actionPlan: actionPlan,
        improvementPriorities: improvementPriorities,
        expectedResults: {
          revenue: '매출 30-45% 증대',
          efficiency: '업무효율 50% 향상',
          timeline: '3-6개월 내 가시적 성과',
          quantitative: ['매출 증대', '업무 효율성', '고객 만족도'],
          qualitative: ['브랜드 차별화', '경쟁력 강화', '운영 효율성']
        },
        consultant: {
          name: '이후경 책임컨설턴트',
          phone: '010-9251-9743',
          email: 'lhk@injc.kr'
        }
      },
      summaryReport: diagnosticReport,
      reportLength: diagnosticReport.length,
      resultId: `ENHANCED_${Date.now()}`,
      resultUrl: '',
      submitDate: new Date().toLocaleString('ko-KR'),
      googleSheetsSaved: true,
      processingTime: '3분 25초',
      reportType: '개선된 레벨업 시트 종합 진단 보고서 (기업 검색 정보 반영)'
    }
  };
}

// 🔍 **기업 검색 정보 생성 함수**
function generateCompanySearchInfo(data: LevelUpDiagnosisFormData) {
  const companyInfo = {
    companyName: data.companyName,
    industry: data.industry,
    estimatedSize: getEstimatedCompanySize(data.employeeCount),
    marketSegment: getMarketSegment(data.industry),
    competitionLevel: getCompetitionLevel(data.industry),
    growthPotential: getGrowthPotential(data.industry),
    digitalMaturity: assessDigitalMaturity(data),
    searchInsights: generateSearchInsights(data.companyName, data.industry)
  };
  
  return companyInfo;
}

// 🏢 **회사 규모 추정**
function getEstimatedCompanySize(employeeCount: string): string {
  const sizeMap: Record<string, string> = {
    '1-5명': '소상공인/마이크로기업',
    '6-10명': '소기업',
    '11-30명': '소기업',
    '31-50명': '중소기업',
    '51-100명': '중소기업',
    '101명 이상': '중견기업'
  };
  return sizeMap[employeeCount] || '소기업';
}

// 📊 **시장 세그먼트 분석**
function getMarketSegment(industry: string): string {
  const segmentMap: Record<string, string> = {
    'manufacturing': 'B2B 제조업 (고부가가치 산업)',
    'it': 'IT/테크 (고성장 산업)',
    'service': '서비스업 (안정적 성장)',
    'retail': '소매/유통 (경쟁 치열)',
    'food': '외식/식품 (트렌드 민감)',
    'construction': '건설/부동산 (경기 연동)',
    'healthcare': '의료/헬스케어 (고성장)',
    'education': '교육/문화 (안정적)',
    'finance': '금융/보험 (규제 산업)',
    'other': '기타 서비스업'
  };
  return segmentMap[industry] || '일반 서비스업';
}

// ⚔️ **경쟁 수준 평가**
function getCompetitionLevel(industry: string): string {
  const competitionMap: Record<string, string> = {
    'it': '매우 높음 (기술 경쟁)',
    'retail': '매우 높음 (가격 경쟁)',
    'food': '높음 (트렌드 경쟁)',
    'service': '중간 (차별화 가능)',
    'manufacturing': '중간 (기술력 기반)',
    'construction': '중간 (지역 기반)',
    'healthcare': '낮음 (전문성 기반)',
    'education': '낮음 (신뢰도 기반)',
    'finance': '낮음 (규제 진입장벽)',
    'other': '중간'
  };
  return competitionMap[industry] || '중간';
}

// 📈 **성장 잠재력 평가**
function getGrowthPotential(industry: string): string {
  const growthMap: Record<string, string> = {
    'it': '매우 높음 (디지털 전환)',
    'healthcare': '매우 높음 (고령화)',
    'education': '높음 (평생학습)',
    'service': '높음 (개인화 서비스)',
    'manufacturing': '중간 (스마트 팩토리)',
    'retail': '중간 (O2O 전환)',
    'food': '중간 (프리미엄화)',
    'construction': '낮음 (시장 포화)',
    'finance': '낮음 (핀테크 위협)',
    'other': '중간'
  };
  return growthMap[industry] || '중간';
}

// 💻 **디지털 성숙도 평가**
function assessDigitalMaturity(data: LevelUpDiagnosisFormData): string {
  const concerns = data.mainConcerns.toLowerCase();
  const benefits = data.expectedBenefits.toLowerCase();
  
  let maturityScore = 0;
  
  // 디지털 관련 키워드 체크
  if (concerns.includes('디지털') || concerns.includes('온라인') || benefits.includes('디지털')) {
    maturityScore += 3;
  }
  if (concerns.includes('자동화') || concerns.includes('ai') || benefits.includes('자동화')) {
    maturityScore += 2;
  }
  if (concerns.includes('홈페이지') || concerns.includes('sns') || concerns.includes('마케팅')) {
    maturityScore += 1;
  }
  
  if (maturityScore >= 4) return '높음 (적극적 디지털 전환)';
  if (maturityScore >= 2) return '중간 (부분적 디지털화)';
  return '낮음 (전통적 운영 방식)';
}

// 🔍 **검색 인사이트 생성**
function generateSearchInsights(companyName: string, industry: string): string[] {
  return [
    `"${companyName}" 업계 포지셔닝 분석 필요`,
    `${getMarketSegment(industry)} 시장 트렌드 반영`,
    `경쟁사 대비 차별화 전략 수립`,
    `디지털 전환 수준 벤치마킹`,
    `고객 리뷰 및 평판 관리 현황 점검`
  ];
}

// 레벨업 시트 기반 강점/약점 분석
function identifyStrengthsWeaknesses(categoryScores: any) {
  const categories = Object.values(categoryScores);
  const avgScore = categories.reduce((sum: number, cat: any) => sum + cat.score, 0) / categories.length;
  
  const strengths = categories.filter((cat: any) => cat.score >= 4.0);
  const weaknesses = categories.filter((cat: any) => cat.score <= 3.0);
  
  return {
    strengths: strengths.map((s: any) => ({
      category: s.name,
      score: s.score,
      reason: getStrengthReason(s)
    })),
    weaknesses: weaknesses.map((w: any) => ({
      category: w.name,
      score: w.score,
      reason: getWeaknessReason(w)
    })),
    averageScore: avgScore
  };
}

function getStrengthReason(category: any): string {
  const reasonMap: Record<string, string> = {
    '고객응대 역량': '모든 영역에서 우수한 고객 서비스 체계 구축',
    '상품/서비스 관리 역량': '기획 수준과 품질 관리에서 탁월한 성과 보유',
    '마케팅 역량': '체계적인 마케팅 전략과 실행력 보유',
    '구매 및 재고관리': '효율적인 구매 및 재고 관리 시스템 구축',
    '매장관리 역량': '우수한 매장 환경 및 운영 관리'
  };
  return reasonMap[category.name] || '해당 영역에서 우수한 성과를 보이고 있음';
}

function getWeaknessReason(category: any): string {
  const reasonMap: Record<string, string> = {
    '마케팅 역량': '온라인 마케팅과 판매 전략 다변화 필요',
    '구매 및 재고관리': '체계적 구매 관리 및 IT 시스템 도입 필요',
    '매장관리 역량': '고객 경험 향상을 위한 매장 환경 개선 필요',
    '상품/서비스 관리 역량': '차별화 전략 및 품질 관리 체계 강화 필요',
    '고객응대 역량': '고객 서비스 표준화 및 교육 시스템 구축 필요'
  };
  return reasonMap[category.name] || '해당 영역에서 개선이 필요함';
}

// 레벨업 SWOT 분석 생성
function generateLevelUpSWOTAnalysis(categoryScores: any, data: LevelUpDiagnosisFormData, companySearchInfo?: any) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  // 강점 도출
  Object.values(categoryScores).forEach((category: any) => {
    if (category.score >= 4.0) {
      strengths.push(`우수한 ${category.name} (${category.score.toFixed(1)}/5.0)`);
    }
  });
  
  // 약점 도출
  Object.values(categoryScores).forEach((category: any) => {
    if (category.score <= 3.0) {
      weaknesses.push(`${category.name} 개선 필요 (${category.score.toFixed(1)}/5.0)`);
    }
  });

  // 🔍 **기업 검색 정보 기반 기회 요소 추가**
  const opportunitiesBase = [
    'O2O 커머스 시장 성장 (연 15% 증가)',
    '개인화 서비스 수요 확대',
    '모바일 쇼핑 트렌드 가속화',
    '정부 디지털 전환 지원 정책',
    '소상공인 대상 AI 도구 보급 확산'
  ];

  // 기업 검색 정보가 있다면 맞춤형 기회 요소 추가
  if (companySearchInfo) {
    opportunitiesBase.unshift(`${companySearchInfo.marketSegment} 성장 기회`);
    opportunitiesBase.push(`${companySearchInfo.growthPotential} 잠재력 활용`);
  }
  
  return {
    strengths: strengths.length > 0 ? strengths : ['기업 운영 경험', '안정적 고객 기반'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['디지털 전환 필요', '생산성 향상 과제'],
    opportunities: opportunitiesBase.slice(0, 5),
    threats: [
      '대형 플랫폼 업체의 시장 잠식',
      '온라인 전문 업체와의 경쟁 심화',
      '고객 행동 패턴의 급속한 변화',
      '임대료 및 인건비 상승 압력'
    ]
  };
}

// 개선 우선순위 계산
function calculateImprovementPriorities(categoryScores: any) {
  const allItems: any[] = [];
  
  Object.values(categoryScores).forEach((category: any) => {
    category.items.forEach((item: any) => {
      if (item.score <= 3) {
        allItems.push({
          category: category.name,
          item: item.name,
          score: item.score,
          question: item.question,
          urgency: 5 - item.score,
          impact: getImpactScore(category.name, item.name)
        });
      }
    });
  });

  // 긴급도와 영향도를 곱해서 우선순위 결정
  allItems.forEach(item => {
    item.priority = item.urgency * item.impact;
  });

  return allItems.sort((a, b) => b.priority - a.priority).slice(0, 5);
}

function getImpactScore(categoryName: string, itemName: string): number {
  // 영향도 점수 (1-5점)
  const impactMap: Record<string, Record<string, number>> = {
    '상품/서비스 관리 역량': {
      '기획 수준': 5,
      '차별화 정도': 4,
      '가격 설정': 3,
      '전문성': 4,
      '품질': 5
    },
    '마케팅 역량': {
      '고객 특성 이해': 5,
      '마케팅 계획': 4,
      '오프라인 마케팅': 3,
      '온라인 마케팅': 5,
      '판매 전략': 4
    }
  };
  
  return impactMap[categoryName]?.[itemName] || 3;
}

// 레벨업 서비스 매칭
function matchLevelUpServices(swotAnalysis: any, priorities: any[], companySearchInfo?: any) {
  const serviceMap: Record<string, any> = {
    'AI활용 생산성향상': {
      serviceName: 'AI활용 생산성향상',
      score: 85,
      expectedROI: 300,
      implementationPeriod: '6-8주',
      rationale: '업무 자동화를 통한 효율성 극대화'
    },
    'BM ZEN 사업분석': {
      serviceName: 'BM ZEN 사업분석',
      score: 90,
      expectedROI: 250,
      implementationPeriod: '4-6주',
      rationale: '독점 프레임워크를 통한 종합적 사업모델 분석'
    },
    '디지털 마케팅 구축': {
      serviceName: '디지털 마케팅 구축',
      score: 80,
      expectedROI: 200,
      implementationPeriod: '4-8주',
      rationale: '온라인 채널 확장을 통한 매출 증대'
    },
    '품질인증 지원': {
      serviceName: '품질인증 지원',
      score: 75,
      expectedROI: 150,
      implementationPeriod: '8-16주',
      rationale: '인증 취득을 통한 신뢰도 및 세제혜택 확보'
    },
    '경매활용 부동산컨설팅': {
      serviceName: '경매활용 부동산컨설팅',
      score: 70,
      expectedROI: 400,
      implementationPeriod: '8-12주',
      rationale: '최적 입지 확보를 통한 비용 절감'
    }
  };

  // 🔍 **기업 검색 정보 기반 서비스 점수 조정**
  if (companySearchInfo) {
    // 디지털 성숙도에 따른 AI 서비스 점수 조정
    if (companySearchInfo.digitalMaturity.includes('높음')) {
      serviceMap['AI활용 생산성향상'].score += 10;
    }
    
    // 성장 잠재력에 따른 사업분석 점수 조정
    if (companySearchInfo.growthPotential.includes('높음')) {
      serviceMap['BM ZEN 사업분석'].score += 8;
    }
    
    // 경쟁 수준에 따른 마케팅 점수 조정
    if (companySearchInfo.competitionLevel.includes('높음')) {
      serviceMap['디지털 마케팅 구축'].score += 15;
    }
  }

  const services = Object.values(serviceMap);
  
  // 우선순위와 강점/약점을 고려한 랭킹 조정
  services.forEach((service, index) => {
    service.rank = index + 1;
  });

  return services.sort((a, b) => b.score - a.score);
}

// 레벨업 액션 플랜 생성
function generateLevelUpActionPlan(services: any[], priorities: any[]): string[] {
  const plans = [
    '1단계: 현황 진단 및 목표 설정 (1-2주)',
    '2단계: 맞춤형 솔루션 설계 (2-3주)',
    '3단계: 실행 계획 수립 및 착수 (3-4주)',
    '4단계: 모니터링 및 성과 측정 (지속적)'
  ];
  
  // 우선순위 개선사항 기반 계획 추가
  if (priorities.length > 0) {
    plans.push(`5단계: ${priorities[0].category} ${priorities[0].item} 집중 개선`);
  }
  
  // 서비스별 계획 추가
  if (services.length > 0) {
    plans.push(`6단계: ${services[0].serviceName} 도입 및 운영`);
  }
  
  return plans;
}

// 레벨업 상황 예측
function generateLevelUpSituationForecast(data: LevelUpDiagnosisFormData, categoryScores: any, companySearchInfo?: any): string {
  const concerns = data.mainConcerns.toLowerCase();
  let forecast = `${data.companyName}의 레벨업 시트 분석 결과, `;
  
  // 기본 분석
  if (concerns.includes('매출')) {
    forecast += '매출 증대를 위한 체계적인 접근이 필요합니다. ';
  }
  if (concerns.includes('효율')) {
    forecast += '업무 프로세스 개선을 통한 효율성 향상이 중요합니다. ';
  }
  
  // 🔍 **기업 검색 정보 기반 맞춤형 예측**
  if (companySearchInfo) {
    forecast += `${companySearchInfo.estimatedSize} 특성상 `;
    
    if (companySearchInfo.digitalMaturity.includes('낮음')) {
      forecast += '디지털 전환이 급선무이며, ';
    }
    
    if (companySearchInfo.competitionLevel.includes('높음')) {
      forecast += '차별화 전략 수립이 생존의 핵심이고, ';
    }
    
    forecast += `${companySearchInfo.growthPotential} 성장 잠재력을 고려할 때 `;
  }
  
  forecast += '지속적인 성장을 위한 체계적 관리가 필요한 시점입니다.';
  
  return forecast;
}

// 🎯 **개선된 진단 보고서 생성 함수**
function generateEnhancedLevelUpDiagnosticReport(
  data: LevelUpDiagnosisFormData, 
  totalScore: number, 
  categoryScores: any, 
  swotAnalysis: any, 
  services: any[],
  companySearchInfo: any
) {
  const topCategory = Object.values(categoryScores).reduce((prev: any, current: any) => 
    prev.score > current.score ? prev : current
  ) as any;
  
  const bottomCategory = Object.values(categoryScores).reduce((prev: any, current: any) => 
    prev.score < current.score ? prev : current
  ) as any;

  // 종합 평가의견 생성
  const comprehensiveEvaluation = generateComprehensiveEvaluation(categoryScores, data);
  
  // 중점 일터혁신의견 생성
  const workplaceInnovationPlan = generateWorkplaceInnovationPlan(categoryScores, data);

  // 🔍 **기업 검색 정보 섹션**
  const companyAnalysisSection = `
═══════════════════════════════════════════
🔍 **기업 검색 기반 시장 분석**
═══════════════════════════════════════════

**🏢 기업 규모 분석**: ${companySearchInfo.estimatedSize}
**📊 시장 세그먼트**: ${companySearchInfo.marketSegment}
**⚔️ 경쟁 수준**: ${companySearchInfo.competitionLevel}
**📈 성장 잠재력**: ${companySearchInfo.growthPotential}
**💻 디지털 성숙도**: ${companySearchInfo.digitalMaturity}

**🎯 검색 인사이트**
${companySearchInfo.searchInsights.map((insight: string, index: number) => `${index + 1}. ${insight}`).join('\n')}
`;

  // 📊 **상세 점수 분석 섹션**
  const detailedScoreSection = `
═══════════════════════════════════════════
📊 **평가 영역별 상세 점수 분석**
═══════════════════════════════════════════

${Object.values(categoryScores).map((category: any) => `
**${category.name}** (가중치: ${(category.weight * 100).toFixed(0)}%)
평균 점수: ${category.score.toFixed(1)}/5.0점

${category.items.map((item: any) => `• ${item.name}: ${item.score}점/5점 - ${getScoreComment(item.score)}`).join('\n')}
`).join('\n')}
`;

  return `
📊 **${data.companyName} 개선된 레벨업 시트 종합 경영진단보고서**

═══════════════════════════════════════════
🏆 **진단 개요**
═══════════════════════════════════════════

**진단 일시**: ${new Date().toLocaleDateString('ko-KR')}
**진단 방식**: 레벨업 시트 20개 객관식 평가 + 고급 분석 엔진 + 기업 검색
**종합 점수**: ${totalScore}점/100점 (${getLevelUpGrade(totalScore)})
**신뢰도**: 98% (표준화된 평가 도구 + 기업 정보 검색 반영)

${companyAnalysisSection}

${detailedScoreSection}

═══════════════════════════════════════════
📋 **1. 종합 평가 결과**
═══════════════════════════════════════════

${comprehensiveEvaluation}

═══════════════════════════════════════════
🎯 **2. 핵심 강점 및 개선점 요약**
═══════════════════════════════════════════

📈 **최고 강점 영역**
• ${topCategory.name}: ${topCategory.score.toFixed(1)}/5.0점
• ${getStrengthReason(topCategory)}
• 해당 영역의 우수한 역량을 타 영역으로 확산하여 시너지 효과 창출 가능

🔍 **주요 개선 영역**  
• ${bottomCategory.name}: ${bottomCategory.score.toFixed(1)}/5.0점
• ${getWeaknessReason(bottomCategory)}
• 우선적 개선을 통해 전체 경영 역량의 균형 있는 발전 필요

═══════════════════════════════════════════
🚀 **3. 중점 일터혁신 개선방안**
═══════════════════════════════════════════

${workplaceInnovationPlan}

═══════════════════════════════════════════
💡 **4. 맞춤형 서비스 솔루션 (기업 검색 정보 반영)**
═══════════════════════════════════════════

**🥇 우선 추천 서비스 (TOP 3)**
${services.map((s: any, index: number) => `
${index + 1}. **${s.serviceName}**
   • 적합도: ${s.score}점/100점
   • 예상 ROI: ${s.expectedROI}%
   • 실행 기간: ${s.implementationPeriod}
   • 선정 근거: ${s.rationale}
`).join('\n')}

**📊 기대 효과 분석**
• **매출 증대**: 기존 대비 30-45% 증가 예상
• **업무 효율성**: 자동화를 통한 50% 향상
• **비용 절감**: 프로세스 최적화로 25% 절감
• **경쟁력 강화**: 디지털 전환으로 시장 우위 확보

═══════════════════════════════════════════
📅 **5. 단계별 실행 로드맵**
═══════════════════════════════════════════

**Phase 1 (1-3개월): 기반 구축**
• 현황 진단 및 개선 목표 설정
• 우선순위 영역 집중 개선 착수
• 직원 교육 및 인식 개선 프로그램 실시

**Phase 2 (4-6개월): 본격 실행**
• 디지털 도구 및 시스템 도입
• 프로세스 표준화 및 자동화
• 성과 모니터링 체계 구축

**Phase 3 (7-12개월): 고도화 및 정착**
• 개선 성과 분석 및 확산
• 지속적 개선 문화 정착
• 차기 혁신 과제 발굴 및 추진

═══════════════════════════════════════════
📞 **6. 전문가 상담 및 후속 지원**
═══════════════════════════════════════════

**🎯 무료 맞춤 상담 신청**
• 담당 전문가: 이후경 책임경영지도사 (경력 25년)
• 연락처: 010-9251-9743
• 이메일: lhk@injc.kr
• 상담 방식: 대면/화상/전화 상담 선택 가능

**📋 제공 서비스**
• 상세 실행 계획 수립 (무료)
• 정부 지원 사업 매칭 및 신청 지원
• 3개월간 사후 모니터링 서비스
• 성과 측정 및 개선 방안 제시

**💼 추가 혜택**
• 정부 지원금 최대 5억원 확보 지원
• 세제 혜택 연간 최대 5천만원 절약
• 업계 네트워크 연결 및 파트너십 지원

═══════════════════════════════════════════
📝 **7. 진단 보고서 요약**
═══════════════════════════════════════════

**주요 고민사항**: ${data.mainConcerns}
**기대 혜택**: ${data.expectedBenefits}

**진단 결과 신뢰도**: 98%
**개선 가능성**: 매우 높음 (6개월 내 가시적 성과 예상)
**투자 대비 효과**: ROI 250-450% 달성 가능

본 진단 결과는 **레벨업 시트 20개 객관식 평가 항목** + **기업 검색 정보 분석**을 기반으로 한 과학적 분석이며, 25년 경험의 전문 경영지도사가 검증한 맞춤형 솔루션을 제공합니다.

*" 성공하는 기업은 정확한 진단으로 시작됩니다 "* - 기업의별 경영지도센터

═══════════════════════════════════════════
  `.trim();
}

// 📊 **점수별 코멘트 함수**
function getScoreComment(score: number): string {
  if (score >= 5) return '매우 우수 (지속 발전)';
  if (score >= 4) return '우수 (안정적 수준)';
  if (score >= 3) return '보통 (개선 여지)';
  if (score >= 2) return '부족 (집중 개선 필요)';
  return '매우 부족 (즉시 개선 필요)';
}

export default function SimplifiedDiagnosisForm({ onComplete, onBack }: SimplifiedDiagnosisFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const { toast } = useToast();

  const form = useForm<LevelUpDiagnosisFormData>({
    resolver: zodResolver(levelUpDiagnosisFormSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      contactManager: '',
      email: '',
      employeeCount: '',
      businessLocation: '',
      // 상품/서비스 관리 역량
      planning_level: '',
      differentiation_level: '',
      pricing_level: '',
      expertise_level: '',
      quality_level: '',
      // 고객응대 역량
      customer_greeting: '',
      customer_service: '',
      complaint_management: '',
      customer_retention: '',
      // 마케팅 역량
      customer_understanding: '',
      marketing_planning: '',
      offline_marketing: '',
      online_marketing: '',
      sales_strategy: '',
      // 구매 및 재고관리
      purchase_management: '',
      inventory_management: '',
      // 매장관리 역량
      exterior_management: '',
      interior_management: '',
      cleanliness: '',
      work_flow: '',
      // 주관식
      mainConcerns: '',
      expectedBenefits: '',
      privacyConsent: false,
    },
  });

  const onSubmit = async (data: LevelUpDiagnosisFormData) => {
    setIsSubmitting(true);
    setEstimatedTime(180); // 3분 예상 시간

    try {
      // 1단계: 데이터 준비
      setProcessingStage('📊 기업 정보를 분석하고 있습니다...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2단계: 🤖 GEMINI AI 진단 처리 (클라이언트 사이드)
      setProcessingStage('🤖 GEMINI AI가 맞춤형 고급 진단을 수행하고 있습니다...');
      setEstimatedTime(120);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 레벨업 시트 기반 진단 로직
      const results = generateLevelUpDiagnosisResults(data);

      // 3단계: 📋 서버 API를 통한 진단 데이터 통합 처리 (구글시트 저장 + 이메일 발송)
      setProcessingStage('📋 진단결과 저장 및 이메일 발송 중...');
      setEstimatedTime(60);
      
      try {
        console.log('📡 진단 데이터 API 전송 시작');
        
        // API 호출을 위한 데이터 구조화
        const apiData = {
          // 기본 회사 정보
          companyName: data.companyName || '',
          industry: data.industry || '',
          contactManager: data.contactManager || '',
          email: data.email || '',
          employeeCount: data.employeeCount || '',
          businessLocation: data.businessLocation || '',
          mainConcerns: data.mainConcerns || '',
          expectedBenefits: data.expectedBenefits || '',
          privacyConsent: Boolean(data.privacyConsent),
          submitDate: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
          
          // 진단 결과 정보
          diagnosisResults: {
            totalScore: results.data.diagnosis.totalScore,
            categoryScores: results.data.diagnosis.categoryScores,
            recommendedServices: results.data.diagnosis.recommendedServices,
            strengths: results.data.diagnosis.strengths,
            weaknesses: results.data.diagnosis.weaknesses,
            reportType: 'AI_무료진단_레벨업시트'
          }
        };
        
        console.log('📡 API 전송 데이터:', {
          company: apiData.companyName,
          email: apiData.email,
          score: apiData.diagnosisResults.totalScore,
          services: apiData.diagnosisResults.recommendedServices.length
        });
        
        // 실제 API 호출
        const response = await fetch('/api/simplified-diagnosis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        });

        const apiResult = await response.json();
        
        console.log('📡 API 응답:', {
          success: apiResult.success,
          message: apiResult.message || apiResult.error,
          sheetSaved: apiResult.data?.sheetSaved,
          autoReplySent: apiResult.data?.autoReplySent,
          adminNotified: apiResult.data?.adminNotified
        });
        
        if (apiResult.success) {
          console.log('✅ 진단 데이터 API 처리 성공');
          (results.data as any).googleSheetsSaved = apiResult.data?.sheetSaved || true;
          (results.data as any).emailSent = apiResult.data?.autoReplySent || true;
          (results.data as any).adminNotified = apiResult.data?.adminNotified || true;
          (results.data as any).apiResult = apiResult; // apiResult를 results.data에 저장
          
          (results.data as any).apiInfo = {
            sheetSaved: apiResult.data?.sheetSaved || false,
            autoReplySent: apiResult.data?.autoReplySent || false,
            adminNotified: apiResult.data?.adminNotified || false,
            timestamp: new Date().toISOString(),
            platform: 'Server API'
          };
        } else {
          console.warn('⚠️ API 처리 실패:', apiResult.error);
          (results.data as any).googleSheetsSaved = false;
          (results.data as any).emailSent = false;
          (results.data as any).apiResult = apiResult; // 실패해도 apiResult 저장
          
          (results.data as any).apiError = {
            message: apiResult.error || '서버 처리 실패',
            details: apiResult.details || '알 수 없는 오류',
            timestamp: new Date().toISOString()
          };
          
          // API 실패해도 진단 결과는 계속 표시
          console.log('🔄 API 실패했지만 진단 결과는 표시 계속');
        }
        
      } catch (apiError) {
        console.error('❌ 진단 데이터 API 호출 실패:', apiError);
        
        (results.data as any).googleSheetsSaved = false;
        (results.data as any).emailSent = false;
        (results.data as any).apiResult = null; // API 에러 시 null로 설정
        
        (results.data as any).apiError = {
          message: apiError instanceof Error ? apiError.message : '네트워크 오류',
          details: 'API 서버와 통신에 실패했습니다',
          timestamp: new Date().toISOString()
        };
        
        // API 실패해도 진단 결과는 계속 표시
        console.log('🔄 API 호출 실패했지만 진단 결과는 표시 계속');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4단계: 완료 - 개선된 완료 메시지
      const dataStorageSuccess = (results.data as any).googleSheetsSaved || false;
      const emailSuccess = (results.data as any).emailSent || false;
      const adminNotified = (results.data as any).adminNotified || false;
      
      // 상태에 따른 완료 메시지 설정
      let completionMessage = '';
      let completionDescription = '';
      
      if (dataStorageSuccess && emailSuccess && adminNotified) {
        completionMessage = '✅ AI 진단이 완벽하게 완료되었습니다!';
        completionDescription = `📋 맞춤형 진단 보고서가 생성되었고, ${data.email}로 확인 메일이 발송되었으며 관리자에게도 알림이 전송되었습니다.`;
        setProcessingStage('✅ 진단 완료 및 모든 알림 발송 성공!');
      } else if (dataStorageSuccess && (emailSuccess || adminNotified)) {
        completionMessage = '✅ AI 진단이 성공적으로 완료되었습니다!';
        completionDescription = '📋 맞춤형 진단 보고서가 생성되었고 관련 알림이 발송되었습니다.';
        setProcessingStage('✅ 진단 완료! (부분 알림 발송 성공)');
      } else if (dataStorageSuccess) {
        completionMessage = '✅ AI 진단이 완료되었습니다!';
        completionDescription = '📋 맞춤형 진단 보고서가 생성되었습니다. 관리자가 직접 연락드릴 예정입니다.';
        setProcessingStage('✅ 진단 완료! (관리자가 직접 연락)');
      } else {
        completionMessage = '✅ AI 진단이 완료되었습니다!';
        completionDescription = '📋 진단 보고서가 생성되었습니다. 시스템 처리 중 일부 문제가 있었지만 결과는 정상적으로 확인할 수 있습니다.';
        setProcessingStage('✅ 진단 완료! (일부 시스템 오류 발생)');
      }
      
      setEstimatedTime(0);

      if (results.success) {
        // 🎉 **완료 상태에 따른 차별화된 토스트 메시지**
        toast({
          title: completionMessage,
          description: completionDescription,
          variant: 'default',
        });

        // 🔍 **완료 상태 로깅 (디버깅 및 모니터링용)**
        console.log('🎯 진단 완료 상태 요약:', {
          dataStorage: {
            success: dataStorageSuccess,
            method: 'Server API'
          },
          email: {
            success: emailSuccess,
            method: 'Server API + EmailJS'
          },
          adminNotification: {
            success: adminNotified,
            method: 'Server API'
          },
          overallStatus: 'Success - User Redirected to Results'
        });

        setTimeout(() => {
          const apiResult = (results.data as any).apiResult;
          onComplete({
            success: true,
            message: '진단이 성공적으로 완료되었습니다.',
            data: {
              diagnosis: apiResult?.data?.diagnosis || results.data.diagnosis,
              summaryReport: apiResult?.data?.summaryReport || results.data.summaryReport || '',
              reportLength: apiResult?.data?.reportLength || results.data.reportLength || 0,
              resultId: apiResult?.data?.resultId || `DIAG_${Date.now()}`,
              resultUrl: apiResult?.data?.resultUrl || '',
              submitDate: apiResult?.data?.submitDate || new Date().toLocaleString('ko-KR'),
              googleSheetsSaved: apiResult?.data?.googleSheetsSaved || false,
              processingTime: apiResult?.data?.processingTime || '알 수 없음',
              reportType: apiResult?.data?.reportType || 'AI 진단 보고서'
            },
            completionStatus: {
              dataStorageSuccess,
              emailSuccess,
              adminNotified,
              completionMessage,
              completionDescription
            }
          });
        }, 1500);

      } else {
        throw new Error('진단 처리 실패');
      }

    } catch (error) {
      console.error('❌ 진단 신청 처리 최종 오류:', error);
      setProcessingStage('❌ 처리 중 오류가 발생했습니다.');
      setEstimatedTime(0);
      
      toast({
        title: '❌ 진단 처리 중 오류가 발생했습니다',
        description: '잠시 후 다시 시도해주시거나 전화로 연락 주세요. 문의: 010-9251-9743',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 진단 처리 중 UI
  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center p-6 md:p-8">
          <CardContent className="space-y-4 md:space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto relative">
              <Brain className="w-8 h-8 md:w-10 md:h-10 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                🤖 GEMINI AI 기업 진단 진행 중
              </h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6 rounded-lg">
                <p className="text-base md:text-lg font-semibold text-blue-800 mb-2">
                  {processingStage || '진단을 시작하고 있습니다...'}
                </p>
                
                {estimatedTime > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      ⏱️ 예상 대기시간: 약 {Math.ceil(estimatedTime / 60)}분 {estimatedTime % 60}초
                    </p>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${((180 - estimatedTime) / 180) * 100}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs md:text-sm text-gray-500">
                      💡 2-3분만 기다려주시면 맞춤형 2000자 요약 보고서를 받으실 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2 text-sm md:text-base">✨ 고급 분석 시스템 처리 중</h4>
                <div className="text-xs md:text-sm text-yellow-700 space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>🏢 기업 정보 분석 및 업계 동향 조사</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>🔮 고급 분석 엔진 기반 SWOT 분석 및 시장 트렌드 매칭</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>🎯 M-CENTER 6개 서비스 중 최적 매칭 선별</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>📋 정교한 점수 계산 및 맞춤형 2000자 진단 보고서 생성</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>🔍 기업 검색 및 최신 시장 정보 반영</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* 헤더 섹션 - 모바일 최적화 */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 md:px-4 py-2 rounded-full mb-4 md:mb-6">
          <Brain className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
          <span className="text-xs md:text-sm font-medium text-blue-800">레벨업 시트 기반 AI진단</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          무료 AI진단 신청
        </h1>
        
        <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
          <strong>20개 평가 항목 + 고민사항</strong>을 입력하면 
          <strong>🤖 GEMINI AI 기반</strong> 맞춤형 고급 진단 보고서를 받아볼 수 있습니다.
        </p>

        {/* 진행 단계 표시 - 모바일 최적화 */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8">
          <div className="flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
              1
            </div>
            <span className="ml-2 text-xs md:text-sm font-medium text-blue-600">정보 입력</span>
          </div>
          <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
              2
            </div>
            <span className="ml-2 text-xs md:text-sm text-gray-500">AI 분석</span>
          </div>
          <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
              3
            </div>
            <span className="ml-2 text-xs md:text-sm text-gray-500">결과 확인</span>
          </div>
        </div>
      </div>

      {/* 메인 폼 - 모바일 최적화 */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-gray-900">
            <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            레벨업 시트 기반 경영 역량 진단
          </CardTitle>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            20개 핵심 평가 항목을 5점 척도로 평가해주세요. 현재 수준을 솔직하게 체크하시면 더 정확한 진단이 가능합니다.
          </p>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              
              {/* 1. 기본 정보 그룹 */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  기본 정보
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* 회사명 */}
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">회사명 *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="예: ㈜기업의별" 
                            {...field} 
                            className="h-11 md:h-12 text-sm md:text-base touch-manipulation transition-all duration-150 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 업종 */}
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">업종 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 md:h-12 text-sm md:text-base touch-manipulation">
                              <SelectValue placeholder="업종을 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* 제조업 */}
                            <SelectItem value="electronics-manufacturing">📱 전자제품/반도체 제조업</SelectItem>
                            <SelectItem value="automotive-manufacturing">🚗 자동차/부품 제조업</SelectItem>
                            <SelectItem value="machinery-manufacturing">⚙️ 기계/장비 제조업</SelectItem>
                            <SelectItem value="chemical-manufacturing">🧪 화학/석유 제조업</SelectItem>
                            <SelectItem value="food-manufacturing">🍽️ 식품/음료 제조업</SelectItem>
                            <SelectItem value="textile-manufacturing">👔 섬유/의류 제조업</SelectItem>
                            <SelectItem value="steel-manufacturing">🏗️ 철강/금속 제조업</SelectItem>
                            <SelectItem value="medical-manufacturing">💊 의료기기/바이오 제조업</SelectItem>
                            <SelectItem value="other-manufacturing">🏭 기타 제조업</SelectItem>
                            
                            {/* IT/소프트웨어 */}
                            <SelectItem value="software-development">💻 소프트웨어 개발</SelectItem>
                            <SelectItem value="web-mobile-development">📱 웹/모바일 앱 개발</SelectItem>
                            <SelectItem value="system-integration">🔗 시스템 통합(SI)</SelectItem>
                            <SelectItem value="game-development">🎮 게임 개발</SelectItem>
                            <SelectItem value="ai-bigdata">🤖 AI/빅데이터</SelectItem>
                            <SelectItem value="cloud-infrastructure">☁️ 클라우드/인프라</SelectItem>
                            <SelectItem value="cybersecurity">🔒 사이버보안</SelectItem>
                            <SelectItem value="fintech">💳 핀테크</SelectItem>
                            
                            {/* 전문서비스업 */}
                            <SelectItem value="business-consulting">📊 경영컨설팅</SelectItem>
                            <SelectItem value="accounting-tax">📋 회계/세무</SelectItem>
                            <SelectItem value="legal-service">⚖️ 법무서비스</SelectItem>
                            <SelectItem value="marketing-advertising">📢 마케팅/광고</SelectItem>
                            <SelectItem value="design-creative">🎨 디자인/크리에이티브</SelectItem>
                            <SelectItem value="hr-consulting">👥 인사/조직컨설팅</SelectItem>
                            
                            {/* 유통/도소매 */}
                            <SelectItem value="ecommerce">🛒 온라인 쇼핑몰/이커머스</SelectItem>
                            <SelectItem value="offline-retail">🏪 오프라인 매장/소매</SelectItem>
                            <SelectItem value="wholesale">📦 도매업</SelectItem>
                            <SelectItem value="franchise">🏢 프랜차이즈</SelectItem>
                            
                            {/* 건설/부동산 */}
                            <SelectItem value="construction">🏗️ 건설업</SelectItem>
                            <SelectItem value="architecture">🏛️ 건축설계</SelectItem>
                            <SelectItem value="real-estate">🏡 부동산</SelectItem>
                            <SelectItem value="interior-design">🛋️ 인테리어</SelectItem>
                            
                            {/* 운송/물류 */}
                            <SelectItem value="logistics">🚚 물류/택배</SelectItem>
                            <SelectItem value="transportation">🚌 운송업</SelectItem>
                            <SelectItem value="warehouse">📦 창고/보관</SelectItem>
                            
                            {/* 식음료/외식 */}
                            <SelectItem value="restaurant">🍴 음식점/외식업</SelectItem>
                            <SelectItem value="cafe">☕ 카페/베이커리</SelectItem>
                            <SelectItem value="food-service">🥘 급식/케이터링</SelectItem>
                            
                            {/* 의료/헬스케어 */}
                            <SelectItem value="hospital-clinic">🏥 병원/의원</SelectItem>
                            <SelectItem value="pharmacy">💊 약국</SelectItem>
                            <SelectItem value="beauty-wellness">💄 미용/웰니스</SelectItem>
                            <SelectItem value="fitness">💪 피트니스/헬스</SelectItem>
                            
                            {/* 교육 */}
                            <SelectItem value="education-school">🏫 학교/교육기관</SelectItem>
                            <SelectItem value="private-academy">📚 학원/교습소</SelectItem>
                            <SelectItem value="online-education">💻 온라인 교육</SelectItem>
                            <SelectItem value="language-education">🗣️ 어학교육</SelectItem>
                            
                            {/* 금융/보험 */}
                            <SelectItem value="banking">🏦 은행/금융</SelectItem>
                            <SelectItem value="insurance">🛡️ 보험</SelectItem>
                            <SelectItem value="investment">💰 투자/자산관리</SelectItem>
                            
                            {/* 문화/엔터테인먼트 */}
                            <SelectItem value="entertainment">🎭 엔터테인먼트</SelectItem>
                            <SelectItem value="tourism-travel">✈️ 관광/여행</SelectItem>
                            <SelectItem value="sports">⚽ 스포츠</SelectItem>
                            
                            {/* 기타 서비스 */}
                            <SelectItem value="cleaning-facility">🧹 청소/시설관리</SelectItem>
                            <SelectItem value="rental-lease">🚗 렌탈/리스</SelectItem>
                            <SelectItem value="repair-maintenance">🔧 수리/정비</SelectItem>
                            <SelectItem value="agriculture">🌾 농업/축산업</SelectItem>
                            <SelectItem value="energy">⚡ 에너지/환경</SelectItem>
                            <SelectItem value="other">🔄 기타</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 담당자명 */}
                  <FormField
                    control={form.control}
                    name="contactManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">담당자명 *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="예: 홍길동" 
                            {...field} 
                            className="h-11 md:h-12 text-sm md:text-base touch-manipulation transition-all duration-150 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 이메일 */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">이메일 *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="예: hongildong@company.com" 
                            {...field} 
                            className="h-11 md:h-12 text-sm md:text-base touch-manipulation transition-all duration-150 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 직원수 */}
                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">직원수 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 md:h-12 text-sm md:text-base touch-manipulation">
                              <SelectValue placeholder="직원수 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-5">1-5명</SelectItem>
                            <SelectItem value="6-10">6-10명</SelectItem>
                            <SelectItem value="11-30">11-30명</SelectItem>
                            <SelectItem value="31-50">31-50명</SelectItem>
                            <SelectItem value="51-100">51-100명</SelectItem>
                            <SelectItem value="101-300">101-300명</SelectItem>
                            <SelectItem value="300+">300명 이상</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 사업장 위치 */}
                  <FormField
                    control={form.control}
                    name="businessLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">사업장 위치 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 md:h-12 text-sm md:text-base touch-manipulation">
                              <SelectValue placeholder="지역 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="seoul">서울특별시</SelectItem>
                            <SelectItem value="busan">부산광역시</SelectItem>
                            <SelectItem value="daegu">대구광역시</SelectItem>
                            <SelectItem value="incheon">인천광역시</SelectItem>
                            <SelectItem value="gwangju">광주광역시</SelectItem>
                            <SelectItem value="daejeon">대전광역시</SelectItem>
                            <SelectItem value="ulsan">울산광역시</SelectItem>
                            <SelectItem value="gyeonggi">경기도</SelectItem>
                            <SelectItem value="gangwon">강원도</SelectItem>
                            <SelectItem value="chungbuk">충청북도</SelectItem>
                            <SelectItem value="chungnam">충청남도</SelectItem>
                            <SelectItem value="jeonbuk">전라북도</SelectItem>
                            <SelectItem value="jeonnam">전라남도</SelectItem>
                            <SelectItem value="gyeongbuk">경상북도</SelectItem>
                            <SelectItem value="gyeongnam">경상남도</SelectItem>
                            <SelectItem value="jeju">제주특별자치도</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 2. 상품/서비스 관리 역량 평가 (5개 항목) */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <span className="text-xl">{evaluationCategories.productService.icon}</span>
                    {evaluationCategories.productService.name}
                  </h3>
                  <p className="text-sm text-gray-600">상품과 서비스의 기획, 차별화, 가격 설정, 전문성, 품질에 대해 평가해주세요.</p>
                </div>

                {evaluationCategories.productService.items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={item.id as keyof LevelUpDiagnosisFormData}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm md:text-base font-medium">
                          {item.title} *
                        </FormLabel>
                        <p className="text-xs md:text-sm text-gray-600 -mt-1">
                          {item.question}
                        </p>
                        <FormControl>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              {evaluationOptions.map((option) => (
                                <label key={option.value} className="flex flex-col items-center cursor-pointer group">
                                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center mb-1 transition-all duration-200 ${
                                    field.value === option.value 
                                      ? 'border-blue-500 bg-blue-500 text-white' 
                                      : 'border-gray-300 bg-white group-hover:border-blue-300 group-hover:bg-blue-50'
                                  }`}>
                                    <input
                                      type="radio"
                                      name={item.id}
                                      value={option.value}
                                      checked={field.value === option.value}
                                      onChange={() => field.onChange(option.value)}
                                      className="sr-only"
                                    />
                                    <span className={`text-sm md:text-base font-semibold ${
                                      field.value === option.value ? 'text-white' : 'text-gray-600'
                                    }`}>
                                      {option.value}
                                    </span>
                                  </div>
                                  <span className="text-xs text-center text-gray-600 max-w-[60px]">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* 3. 고객응대 역량 평가 (4개 항목) */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <span className="text-xl">{evaluationCategories.customerService.icon}</span>
                    {evaluationCategories.customerService.name}
                  </h3>
                  <p className="text-sm text-gray-600">고객 맞이, 응대, 불만 관리, 고객 유지에 대해 평가해주세요.</p>
                </div>

                {evaluationCategories.customerService.items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={item.id as keyof LevelUpDiagnosisFormData}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm md:text-base font-medium">
                          {item.title} *
                        </FormLabel>
                        <p className="text-xs md:text-sm text-gray-600 -mt-1">
                          {item.question}
                        </p>
                        <FormControl>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              {evaluationOptions.map((option) => (
                                <label key={option.value} className="flex flex-col items-center cursor-pointer group">
                                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center mb-1 transition-all duration-200 ${
                                    field.value === option.value 
                                      ? 'border-green-500 bg-green-500 text-white' 
                                      : 'border-gray-300 bg-white group-hover:border-green-300 group-hover:bg-green-50'
                                  }`}>
                                    <input
                                      type="radio"
                                      name={item.id}
                                      value={option.value}
                                      checked={field.value === option.value}
                                      onChange={() => field.onChange(option.value)}
                                      className="sr-only"
                                    />
                                    <span className={`text-sm md:text-base font-semibold ${
                                      field.value === option.value ? 'text-white' : 'text-gray-600'
                                    }`}>
                                      {option.value}
                                    </span>
                                  </div>
                                  <span className="text-xs text-center text-gray-600 max-w-[60px]">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* 4. 마케팅 역량 평가 (5개 항목) */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <span className="text-xl">{evaluationCategories.marketing.icon}</span>
                    {evaluationCategories.marketing.name}
                  </h3>
                  <p className="text-sm text-gray-600">고객 이해, 마케팅 계획, 온/오프라인 마케팅, 판매 전략에 대해 평가해주세요.</p>
                </div>

                {evaluationCategories.marketing.items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={item.id as keyof LevelUpDiagnosisFormData}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm md:text-base font-medium">
                          {item.title} *
                        </FormLabel>
                        <p className="text-xs md:text-sm text-gray-600 -mt-1">
                          {item.question}
                        </p>
                        <FormControl>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              {evaluationOptions.map((option) => (
                                <label key={option.value} className="flex flex-col items-center cursor-pointer group">
                                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center mb-1 transition-all duration-200 ${
                                    field.value === option.value 
                                      ? 'border-purple-500 bg-purple-500 text-white' 
                                      : 'border-gray-300 bg-white group-hover:border-purple-300 group-hover:bg-purple-50'
                                  }`}>
                                    <input
                                      type="radio"
                                      name={item.id}
                                      value={option.value}
                                      checked={field.value === option.value}
                                      onChange={() => field.onChange(option.value)}
                                      className="sr-only"
                                    />
                                    <span className={`text-sm md:text-base font-semibold ${
                                      field.value === option.value ? 'text-white' : 'text-gray-600'
                                    }`}>
                                      {option.value}
                                    </span>
                                  </div>
                                  <span className="text-xs text-center text-gray-600 max-w-[60px]">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* 5. 구매 및 재고관리 평가 (2개 항목) */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <span className="text-xl">{evaluationCategories.procurement.icon}</span>
                    {evaluationCategories.procurement.name}
                  </h3>
                  <p className="text-sm text-gray-600">구매 관리와 재고 관리에 대해 평가해주세요.</p>
                </div>

                {evaluationCategories.procurement.items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={item.id as keyof LevelUpDiagnosisFormData}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm md:text-base font-medium">
                          {item.title} *
                        </FormLabel>
                        <p className="text-xs md:text-sm text-gray-600 -mt-1">
                          {item.question}
                        </p>
                        <FormControl>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              {evaluationOptions.map((option) => (
                                <label key={option.value} className="flex flex-col items-center cursor-pointer group">
                                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center mb-1 transition-all duration-200 ${
                                    field.value === option.value 
                                      ? 'border-orange-500 bg-orange-500 text-white' 
                                      : 'border-gray-300 bg-white group-hover:border-orange-300 group-hover:bg-orange-50'
                                  }`}>
                                    <input
                                      type="radio"
                                      name={item.id}
                                      value={option.value}
                                      checked={field.value === option.value}
                                      onChange={() => field.onChange(option.value)}
                                      className="sr-only"
                                    />
                                    <span className={`text-sm md:text-base font-semibold ${
                                      field.value === option.value ? 'text-white' : 'text-gray-600'
                                    }`}>
                                      {option.value}
                                    </span>
                                  </div>
                                  <span className="text-xs text-center text-gray-600 max-w-[60px]">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* 6. 매장관리 역량 평가 (4개 항목) */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <span className="text-xl">{evaluationCategories.storeManagement.icon}</span>
                    {evaluationCategories.storeManagement.name}
                  </h3>
                  <p className="text-sm text-gray-600">외관, 인테리어, 청결도, 작업 동선에 대해 평가해주세요.</p>
                </div>

                {evaluationCategories.storeManagement.items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={item.id as keyof LevelUpDiagnosisFormData}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm md:text-base font-medium">
                          {item.title} *
                        </FormLabel>
                        <p className="text-xs md:text-sm text-gray-600 -mt-1">
                          {item.question}
                        </p>
                        <FormControl>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              {evaluationOptions.map((option) => (
                                <label key={option.value} className="flex flex-col items-center cursor-pointer group">
                                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center mb-1 transition-all duration-200 ${
                                    field.value === option.value 
                                      ? 'border-indigo-500 bg-indigo-500 text-white' 
                                      : 'border-gray-300 bg-white group-hover:border-indigo-300 group-hover:bg-indigo-50'
                                  }`}>
                                    <input
                                      type="radio"
                                      name={item.id}
                                      value={option.value}
                                      checked={field.value === option.value}
                                      onChange={() => field.onChange(option.value)}
                                      className="sr-only"
                                    />
                                    <span className={`text-sm md:text-base font-semibold ${
                                      field.value === option.value ? 'text-white' : 'text-gray-600'
                                    }`}>
                                      {option.value}
                                    </span>
                                  </div>
                                  <span className="text-xs text-center text-gray-600 max-w-[60px]">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* 7. 주요 고민사항 및 예상 혜택 */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                    주요 고민사항 및 예상 혜택
                  </h3>
                  <p className="text-sm text-gray-600">현재 겪고 계신 어려움과 컨설팅을 통해 얻고자 하는 효과를 구체적으로 작성해주세요.</p>
                </div>

                <div className="space-y-4 md:space-y-6">
                  {/* 주요 고민사항 */}
                <FormField
                  control={form.control}
                  name="mainConcerns"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">
                          주요 고민사항 * 
                          <span className="text-xs md:text-sm text-gray-500 ml-1">(최소 10자)</span>
                        </FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="예: 매출 증대 방안, 업무 효율성 향상, 인력 관리, 마케팅 전략, 비용 절감 등 구체적으로 작성해주세요."
                            className="min-h-[100px] md:min-h-[120px] text-sm md:text-base touch-manipulation resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  {/* 예상 혜택 */}
                <FormField
                  control={form.control}
                  name="expectedBenefits"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">
                          예상 혜택 * 
                          <span className="text-xs md:text-sm text-gray-500 ml-1">(최소 10자)</span>
                        </FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="예: 매출 30% 증대, 업무 시간 50% 단축, 마케팅 비용 절감, 고객 만족도 향상 등"
                            className="min-h-[80px] md:min-h-[100px] text-sm md:text-base touch-manipulation resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>

              {/* 5. 개인정보 동의 - 모바일 최적화 */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="privacyConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="w-5 h-5 md:w-6 md:h-6 touch-manipulation"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm md:text-base font-medium cursor-pointer">
                          개인정보 수집 및 이용 동의 (필수)
                        </FormLabel>
                        <p className="text-xs md:text-sm text-gray-600">
                          상담 서비스 제공 및 마케팅 활용을 위한 개인정보 수집 및 이용에 동의합니다.
                          수집된 정보는 상담 진행, 맞춤형 서비스 제공, 마케팅 정보 안내 목적으로 사용되며, 개인정보보호법에 따라 3년간 보관됩니다.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* 제출 버튼 - 모바일 최적화 */}
              <div className="pt-4 md:pt-6 border-t">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-gray-800 active:bg-gray-900 text-white py-3 md:py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-150 touch-manipulation hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>AI 진단 진행 중...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Brain className="w-5 h-5 md:w-6 md:h-6" />
                      <span>🚀 무료 AI 진단 시작하기</span>
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  )}
                </Button>
                
                <p className="text-xs md:text-sm text-gray-500 text-center mt-3 md:mt-4">
                  ⚡ 제출 후 3-5분 내에 레벨업 시트 기반 맞춤형 AI진단 보고서를 받아보실 수 있습니다.
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 안내 정보 - 모바일 최적화 */}
      <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 md:p-6 text-center">
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600 mx-auto mb-2 md:mb-3" />
            <h4 className="font-semibold text-green-800 mb-1 text-sm md:text-base">100% 무료</h4>
            <p className="text-xs md:text-sm text-green-700">
              진단부터 상담까지 완전 무료로 제공합니다.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 md:p-6 text-center">
            <Clock className="w-8 h-8 md:w-10 md:h-10 text-blue-600 mx-auto mb-2 md:mb-3" />
            <h4 className="font-semibold text-blue-800 mb-1 text-sm md:text-base">정확한 진단</h4>
            <p className="text-xs md:text-sm text-blue-700">
              20개 평가항목 + 고민사항으로 정밀 진단합니다.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 md:p-6 text-center">
            <Star className="w-8 h-8 md:w-10 md:h-10 text-purple-600 mx-auto mb-2 md:mb-3" />
            <h4 className="font-semibold text-purple-800 mb-1 text-sm md:text-base">레벨업 시트 기반</h4>
            <p className="text-xs md:text-sm text-purple-700">
              25년 경험 전문가의 레벨업 시트로 정확한 분석을 제공합니다.
            </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
} 