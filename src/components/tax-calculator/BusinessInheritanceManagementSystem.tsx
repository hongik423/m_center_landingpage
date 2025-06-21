'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  Shield,
  Users,
  Building2,
  Target,
  TrendingUp,
  Bell,
  BookOpen,
  Phone,
  Info,
  Zap
} from 'lucide-react';

interface RiskItem {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  impact: number; // 0-100
  actionRequired: boolean;
  deadline?: string;
  recommendations: string[];
}

interface ComplianceRequirement {
  id: string;
  category: string;
  requirement: string;
  status: 'compliant' | 'warning' | 'violation' | 'pending';
  description: string;
  dueDate?: string;
  documents: string[];
  penalty?: string;
  actionPlan?: string;
}

interface ManagementSchedule {
  id: string;
  year: number;
  quarter: string;
  tasks: ManagementTask[];
  deadlines: ScheduleDeadline[];
  status: 'upcoming' | 'due' | 'overdue' | 'completed';
}

interface ManagementTask {
  id: string;
  title: string;
  description: string;
  type: 'filing' | 'reporting' | 'compliance' | 'review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours: number;
  requiredDocuments: string[];
}

interface ScheduleDeadline {
  id: string;
  title: string;
  date: string;
  type: 'filing' | 'payment' | 'report' | 'review';
  status: 'upcoming' | 'due' | 'overdue' | 'completed';
  importance: 'normal' | 'important' | 'critical';
}

interface ExpertAdvice {
  category: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  recommendedAction: string;
  consultationNeeded: boolean;
}

interface BusinessInheritanceManagementSystemProps {
  businessData: {
    businessType: 'small' | 'medium';
    businessPeriod: number;
    employeeCount: number;
    annualRevenue: number;
    deductionAmount: number;
    managementStartDate: string;
  };
  onRiskAlert?: (risks: RiskItem[]) => void;
  onScheduleUpdate?: (schedule: ManagementSchedule[]) => void;
}

export default function BusinessInheritanceManagementSystem({ 
  businessData, 
  onRiskAlert, 
  onScheduleUpdate 
}: BusinessInheritanceManagementSystemProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [riskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [complianceRequirements, setComplianceRequirements] = useState<ComplianceRequirement[]>([]);
  const [managementSchedule, setManagementSchedule] = useState<ManagementSchedule[]>([]);
  const [expertAdvices, setExpertAdvices] = useState<ExpertAdvice[]>([]);
  const [alertsCount, setAlertsCount] = useState(0);

  // 초기화 및 데이터 생성
  useEffect(() => {
    generateRiskAssessment();
    generateComplianceRequirements();
    generateManagementSchedule();
    generateExpertAdvices();
  }, [businessData]);

  // 리스크 평가 생성
  const generateRiskAssessment = () => {
    const risks: RiskItem[] = [
      {
        id: 'employment_risk',
        category: '고용유지',
        title: '고용유지 의무 위반 위험',
        description: '종업원 수가 80% 미만으로 감소할 위험',
        severity: businessData.employeeCount >= 10 ? 'high' : 'low',
        probability: businessData.employeeCount >= 10 ? 45 : 10,
        impact: 85,
        actionRequired: businessData.employeeCount >= 10,
        deadline: '매년 3월 31일',
        recommendations: [
          '4대보험 가입자 명단 정기 점검',
          '고용유지를 위한 인사정책 수립',
          '대체인력 확보 계획 마련'
        ]
      },
      {
        id: 'business_continuity_risk',
        category: '계속경영',
        title: '계속경영 의무 위반 위험',
        description: '사업 중단, 양도, 폐업 등의 위험',
        severity: 'critical',
        probability: 20,
        impact: 100,
        actionRequired: true,
        recommendations: [
          '사업 지속가능성 정기 검토',
          '경영승계 계획 수립',
          '위기 상황 대응 매뉴얼 작성'
        ]
      },
      {
        id: 'location_change_risk',
        category: '사업장 소재지',
        title: '사업장 이전 위험',
        description: '불가피한 사업장 이전으로 인한 공제 취소 위험',
        severity: 'medium',
        probability: 30,
        impact: 60,
        actionRequired: false,
        recommendations: [
          '임대차 계약 만료일 사전 관리',
          '이전 시 세무서 사전 승인 절차 숙지',
          '대체 사업장 확보 방안 검토'
        ]
      },
      {
        id: 'filing_delay_risk',
        category: '신고납부',
        title: '사후관리 신고 지연 위험',
        description: '매년 3월 31일 사후관리신고서 제출 지연',
        severity: 'high',
        probability: 25,
        impact: 70,
        actionRequired: true,
        deadline: '매년 3월 31일',
        recommendations: [
          '신고 일정 캘린더 등록 및 알림 설정',
          '필요 서류 사전 준비',
          '세무사 위임계약 체결'
        ]
      }
    ];

    setRiskItems(risks);
    
    // 높은 리스크 항목이 있으면 알림
    const highRisks = risks.filter(r => ['high', 'critical'].includes(r.severity));
    if (highRisks.length > 0 && onRiskAlert) {
      onRiskAlert(highRisks);
    }
  };

  // 컴플라이언스 요건 생성
  const generateComplianceRequirements = () => {
    const requirements: ComplianceRequirement[] = [
      {
        id: 'annual_filing',
        category: '신고의무',
        requirement: '사후관리신고서 제출',
        status: 'pending',
        description: '매년 상속개시일이 속하는 연도의 다음연도 3월 31일까지 제출',
        dueDate: '2025-03-31',
        documents: [
          '사후관리신고서',
          '4대보험 가입자명부',
          '사업자등록증 사본',
          '재무제표'
        ],
        penalty: '신고불이행 시 가산세 20% 부과',
        actionPlan: '매년 2월까지 필요서류 준비 및 세무사 검토'
      },
      {
        id: 'employment_maintenance',
        category: '고용유지',
        requirement: '종업원 수 80% 이상 유지',
        status: businessData.employeeCount >= 10 ? 'warning' : 'compliant',
        description: `최소 ${Math.floor(businessData.employeeCount * 0.8)}명 이상 유지 필요`,
        documents: [
          '4대보험 가입자명부',
          '급여대장',
          '고용보험 피보험자격 취득/상실 신고서'
        ],
        penalty: '고용유지 의무 위반 시 공제액의 20% 추징',
        actionPlan: '매월 고용현황 점검 및 인력관리 계획 수립'
      },
      {
        id: 'business_continuation',
        category: '계속경영',
        requirement: '사업 계속 경영',
        status: 'compliant',
        description: '10년간 해당 사업을 계속 경영해야 함',
        documents: [
          '사업자등록증',
          '법인등기부등본',
          '재무제표',
          '사업실적 증명서류'
        ],
        penalty: '계속경영 의무 위반 시 공제액 전액 추징',
        actionPlan: '사업 지속가능성 정기 검토 및 경영전략 수립'
      }
    ];

    setComplianceRequirements(requirements);
  };

  // 관리 일정 생성
  const generateManagementSchedule = () => {
    const currentYear = new Date().getFullYear();
    const schedule: ManagementSchedule[] = [];

    for (let year = 0; year < 10; year++) {
      const targetYear = currentYear + year;
      
      schedule.push({
        id: `year_${year + 1}`,
        year: year + 1,
        quarter: 'Q1',
        tasks: [
          {
            id: `filing_${year}`,
            title: '사후관리신고서 작성 및 제출',
            description: `${year + 1}차년도 사후관리 현황 신고`,
            type: 'filing',
            priority: 'urgent',
            estimatedHours: 8,
            requiredDocuments: [
              '사후관리신고서',
              '4대보험 가입자명부',
              '재무제표',
              '사업자등록증'
            ]
          },
          {
            id: `review_${year}`,
            title: '컴플라이언스 점검',
            description: '고용유지, 계속경영 등 의무사항 점검',
            type: 'review',
            priority: 'high',
            estimatedHours: 4,
            requiredDocuments: [
              '고용현황 자료',
              '사업실적 자료',
              '재무현황 자료'
            ]
          }
        ],
        deadlines: [
          {
            id: `deadline_${year}`,
            title: '사후관리신고서 제출 마감',
            date: `${targetYear}-03-31`,
            type: 'filing',
            status: year === 0 ? 'upcoming' : 'upcoming',
            importance: 'critical'
          }
        ],
        status: 'upcoming'
      });
    }

    setManagementSchedule(schedule);
    
    if (onScheduleUpdate) {
      onScheduleUpdate(schedule);
    }
  };

  // 전문가 조언 생성
  const generateExpertAdvices = () => {
    const advices: ExpertAdvice[] = [
      {
        category: '세무 전략',
        title: '사후관리 기간 중 추가 절세 방안',
        description: '가업상속공제 이외의 추가 절세 전략 검토',
        urgency: 'medium',
        recommendedAction: '세무전문가와 연간 세무계획 수립',
        consultationNeeded: true
      },
      {
        category: '경영 전략',
        title: '사업 확장 및 구조조정 시 고려사항',
        description: '사업 확장이나 구조조정이 가업상속공제에 미치는 영향',
        urgency: 'low',
        recommendedAction: '주요 경영 의사결정 전 세무 영향도 검토',
        consultationNeeded: true
      },
      {
        category: '리스크 관리',
        title: '사후관리 위반 시 대응 방안',
        description: '불가피한 상황 발생 시 손실 최소화 방안',
        urgency: 'high',
        recommendedAction: '비상 대응 계획 수립 및 전문가 상담',
        consultationNeeded: true
      }
    ];

    setExpertAdvices(advices);
  };

  // 위험도에 따른 색상 결정
  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  // 컴플라이언스 상태에 따른 색상 결정
  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'violation': return 'text-red-600';
      case 'pending': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">실무 관리 시스템</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">가업상속 사후관리 시스템</h2>
        <p className="text-gray-600">10년간의 사후관리 의무를 체계적으로 관리하세요</p>
      </div>

      {/* 대시보드 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {riskItems.filter(r => ['high', 'critical'].includes(r.severity)).length}
            </div>
            <div className="text-sm text-red-700">높은 위험 항목</div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">
              {complianceRequirements.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-700">대기 중인 작업</div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {complianceRequirements.filter(r => r.status === 'compliant').length}
            </div>
            <div className="text-sm text-green-700">준수 중인 요건</div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {managementSchedule.length}
            </div>
            <div className="text-sm text-blue-700">관리 연차</div>
          </CardContent>
        </Card>
      </div>

      {/* 메인 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">대시보드</TabsTrigger>
          <TabsTrigger value="risks">위험 관리</TabsTrigger>
          <TabsTrigger value="compliance">컴플라이언스</TabsTrigger>
          <TabsTrigger value="schedule">일정 관리</TabsTrigger>
          <TabsTrigger value="expert">전문가 조언</TabsTrigger>
        </TabsList>

        {/* 대시보드 탭 */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 현재 상태 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  현재 관리 상태
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">관리 경과 기간</span>
                    <Badge variant="outline">
                      {Math.floor((new Date().getTime() - new Date(businessData.managementStartDate).getTime()) / (1000 * 60 * 60 * 24 * 365))}년차
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">잔여 관리 기간</span>
                    <Badge variant="secondary">
                      {10 - Math.floor((new Date().getTime() - new Date(businessData.managementStartDate).getTime()) / (1000 * 60 * 60 * 24 * 365))}년
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">현재 종업원 수</span>
                    <Badge variant={businessData.employeeCount >= Math.floor(businessData.employeeCount * 0.8) ? "default" : "destructive"}>
                      {businessData.employeeCount}명
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">관리 진행률</span>
                    <span className="text-sm text-gray-600">
                      {Math.floor((new Date().getTime() - new Date(businessData.managementStartDate).getTime()) / (1000 * 60 * 60 * 24 * 365) * 10)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.floor((new Date().getTime() - new Date(businessData.managementStartDate).getTime()) / (1000 * 60 * 60 * 24 * 365) * 10)} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 최근 알림 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  최근 알림
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    다음 사후관리신고서 제출까지 45일 남았습니다.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    고용유지 현황을 정기적으로 점검해주세요.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    이번 분기 컴플라이언스 점검이 완료되었습니다.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 위험 관리 탭 */}
        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                리스크 평가 및 관리
              </CardTitle>
              <CardDescription>
                사후관리 기간 중 발생 가능한 위험요소들을 모니터링합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {riskItems.map((risk) => (
                <div key={risk.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{risk.title}</h4>
                        <Badge variant={getRiskColor(risk.severity)}>
                          {risk.severity === 'critical' ? '매우 높음' :
                           risk.severity === 'high' ? '높음' :
                           risk.severity === 'medium' ? '보통' : '낮음'}
                        </Badge>
                        {risk.actionRequired && (
                          <Badge variant="outline" className="text-xs">
                            조치 필요
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">발생 가능성</div>
                          <Progress value={risk.probability} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">{risk.probability}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">영향도</div>
                          <Progress value={risk.impact} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">{risk.impact}%</div>
                        </div>
                      </div>

                      {risk.deadline && (
                        <div className="text-xs text-blue-600 mb-2">
                          📅 관리 기한: {risk.deadline}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700">권장 조치사항:</div>
                        {risk.recommendations.map((rec, index) => (
                          <div key={index} className="text-sm text-gray-600 ml-2">
                            • {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 컴플라이언스 탭 */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                컴플라이언스 현황
              </CardTitle>
              <CardDescription>
                가업상속공제 유지를 위한 필수 요건들의 준수 현황입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {complianceRequirements.map((req) => (
                <div key={req.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{req.requirement}</h4>
                        <Badge variant="outline" className={getComplianceColor(req.status)}>
                          {req.status === 'compliant' ? '준수' :
                           req.status === 'warning' ? '주의' :
                           req.status === 'violation' ? '위반' : '대기'}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {req.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{req.description}</p>
                      
                      {req.dueDate && (
                        <div className="text-sm text-blue-600 mb-2">
                          📅 마감일: {req.dueDate}
                        </div>
                      )}

                      {req.penalty && (
                        <Alert className="mb-3">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            <strong>위반 시 처벌:</strong> {req.penalty}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">필요 서류:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {req.documents.map((doc, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {doc}
                            </div>
                          ))}
                        </div>
                      </div>

                      {req.actionPlan && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <div className="text-sm font-medium text-blue-800 mb-1">실행 계획:</div>
                          <div className="text-sm text-blue-700">{req.actionPlan}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 일정 관리 탭 */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                10년 사후관리 일정
              </CardTitle>
              <CardDescription>
                연도별 사후관리 업무 일정과 마감일을 관리합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {managementSchedule.slice(0, 3).map((schedule) => (
                <div key={schedule.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">
                      {schedule.year}년차 관리 업무
                    </h4>
                    <Badge variant={schedule.status === 'completed' ? 'default' : 'secondary'}>
                      {schedule.status === 'completed' ? '완료' : 
                       schedule.status === 'due' ? '진행중' : '예정'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">주요 업무</h5>
                      {schedule.tasks.map((task) => (
                        <div key={task.id} className="p-2 bg-gray-50 rounded mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {task.priority === 'urgent' ? '긴급' :
                               task.priority === 'high' ? '높음' :
                               task.priority === 'medium' ? '보통' : '낮음'}
                            </Badge>
                            <span className="font-medium text-sm">{task.title}</span>
                          </div>
                          <p className="text-xs text-gray-600">{task.description}</p>
                          <div className="text-xs text-blue-600 mt-1">
                            예상 소요시간: {task.estimatedHours}시간
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">주요 마감일</h5>
                      {schedule.deadlines.map((deadline) => (
                        <div key={deadline.id} className="p-2 bg-gray-50 rounded mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={
                              deadline.importance === 'critical' ? 'destructive' :
                              deadline.importance === 'important' ? 'default' : 'secondary'
                            } className="text-xs">
                              {deadline.importance === 'critical' ? '필수' :
                               deadline.importance === 'important' ? '중요' : '일반'}
                            </Badge>
                            <span className="font-medium text-sm">{deadline.title}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            📅 {deadline.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center">
                <Button variant="outline">
                  전체 10년 일정 보기
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 전문가 조언 탭 */}
        <TabsContent value="expert" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                전문가 조언 및 권고사항
              </CardTitle>
              <CardDescription>
                가업상속 사후관리를 위한 전문가의 조언과 권고사항입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {expertAdvices.map((advice, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{advice.title}</h4>
                        <Badge variant={
                          advice.urgency === 'high' ? 'destructive' :
                          advice.urgency === 'medium' ? 'default' : 'secondary'
                        }>
                          {advice.urgency === 'high' ? '긴급' : 
                           advice.urgency === 'medium' ? '중요' : '일반'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {advice.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{advice.description}</p>
                      
                      <div className="p-3 bg-blue-50 rounded-md mb-3">
                        <div className="text-sm font-medium text-blue-800 mb-1">권장 조치:</div>
                        <div className="text-sm text-blue-700">{advice.recommendedAction}</div>
                      </div>

                      {advice.consultationNeeded && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">전문가 상담 권장</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800">전문가 상담 연결</h4>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  복잡한 상황이나 전문적인 조언이 필요한 경우 전문가와 직접 상담하세요.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    세무사 연결
                  </Button>
                  <Button size="sm" variant="outline">
                    변호사 연결
                  </Button>
                  <Button size="sm" variant="outline">
                    회계사 연결
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 