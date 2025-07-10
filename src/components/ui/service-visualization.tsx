'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Bot, 
  Factory, 
  Rocket, 
  Award, 
  Globe,
  TrendingUp,
  ArrowRight,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

// 서비스 아이콘 매핑
const serviceIcons = {
  'BM ZEN 사업분석': Target,
  'AI 생산성향상': Bot,
  '경매활용 공장구매': Factory,
  '기술사업화': Rocket,
  '인증지원': Award,
  '웹사이트 구축': Globe
};

// 서비스 색상 매핑
const serviceColors = {
  'BM ZEN 사업분석': 'blue',
  'AI 생산성향상': 'purple',
  '경매활용 공장구매': 'orange',
  '기술사업화': 'green',
  '인증지원': 'red',
  '웹사이트 구축': 'cyan'
};

// 1. 서비스 생태계 다이어그램
export const ServiceEcosystem = () => {
  const centerService = 'BM ZEN 사업분석';
  const connectedServices = [
    'AI 생산성향상',
    '웹사이트 구축',
    '인증지원'
  ];
  const supportServices = [
    '경매활용 공장구매',
    '기술사업화',
    '정부지원'
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          M-CENTER 서비스 생태계
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-80 flex items-center justify-center">
          {/* 중심 서비스 */}
          <div className="absolute z-10 bg-blue-100 border-2 border-blue-500 rounded-full p-4 w-32 h-32 flex items-center justify-center">
            <div className="text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-blue-900">BM ZEN</p>
              <p className="text-xs text-blue-700">사업분석</p>
            </div>
          </div>

          {/* 연결된 서비스들 */}
          {connectedServices.map((service, index) => {
            const Icon = serviceIcons[service as keyof typeof serviceIcons];
            const angle = (index * 120) - 90; // 120도씩 배치
            const radius = 120;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            return (
              <div
                key={service}
                className="absolute bg-white border-2 border-gray-300 rounded-lg p-3 w-24 h-24 flex items-center justify-center shadow-md"
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
              >
                <div className="text-center">
                  <Icon className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-800">{service.split(' ')[0]}</p>
                </div>
              </div>
            );
          })}

          {/* 연결선 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connectedServices.map((_, index) => {
              const angle = (index * 120) - 90;
              const radius = 120;
              const x1 = 50; // 중심점 (%)
              const y1 = 50;
              const x2 = 50 + (Math.cos(angle * Math.PI / 180) * radius / 3.2);
              const y2 = 50 + (Math.sin(angle * Math.PI / 180) * radius / 3.2);
              
              return (
                <line
                  key={index}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            BM ZEN 사업분석을 중심으로 한 통합 서비스 생태계
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// 2. ROI 비교 차트
export const ROIComparison = () => {
  const roiData = [
    { service: 'BM ZEN 사업분석', minROI: 300, maxROI: 800, color: 'bg-blue-500' },
    { service: 'AI 생산성향상', minROI: 400, maxROI: 1000, color: 'bg-purple-500' },
    { service: '경매활용 공장구매', minROI: 200, maxROI: 500, color: 'bg-orange-500' },
    { service: '기술사업화', minROI: 500, maxROI: 2000, color: 'bg-green-500' },
    { service: '인증지원', minROI: 200, maxROI: 600, color: 'bg-red-500' },
    { service: '웹사이트 구축', minROI: 150, maxROI: 400, color: 'bg-cyan-500' }
  ];

  const maxValue = Math.max(...roiData.map(item => item.maxROI));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          서비스별 투자 대비 수익률 (ROI)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roiData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {item.service}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.minROI}%-{item.maxROI}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${item.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${(item.maxROI / maxValue) * 100}%` }}
                  />
                </div>
                <div className="absolute top-0 left-0 h-3 bg-gray-400 rounded-full opacity-50"
                     style={{ width: `${(item.minROI / maxValue) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            💡 <strong>최고 ROI:</strong> 기술사업화 (최대 2000%)<br />
            📊 <strong>평균 ROI:</strong> 모든 서비스 300% 이상 보장
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// 3. 성장 단계별 서비스 매핑
export const GrowthStageMapping = () => {
  const stages = [
    {
      stage: '창업기',
      period: '1-3년',
      icon: '🌱',
      color: 'bg-green-100 border-green-300',
      services: ['기술사업화', '인증지원', '웹사이트 구축'],
      description: '기반 구축 및 자금 확보'
    },
    {
      stage: '성장기',
      period: '3-7년',
      icon: '🚀',
      color: 'bg-blue-100 border-blue-300',
      services: ['BM ZEN 사업분석', 'AI 생산성향상', '경매활용 공장구매'],
      description: '매출 증대 및 효율성 향상'
    },
    {
      stage: '확장기',
      period: '7-10년',
      icon: '👑',
      color: 'bg-purple-100 border-purple-300',
      services: ['통합 솔루션', '글로벌 진출', '디지털 전환'],
      description: '시장 지배력 확보'
    },
    {
      stage: '안정기',
      period: '10년+',
      icon: '♻️',
      color: 'bg-orange-100 border-orange-300',
      services: ['지속가능 혁신', 'ESG 경영', '차세대 준비'],
      description: '지속가능한 가치 창출'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="w-5 h-5 text-purple-600" />
          기업 성장 단계별 서비스 매핑
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stages.map((stage, index) => (
            <div key={index} className="relative">
              <div className={`border-2 rounded-lg p-4 ${stage.color}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{stage.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {stage.stage} ({stage.period})
                    </h3>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {stage.services.map((service, serviceIndex) => (
                    <Badge key={serviceIndex} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {index < stages.length - 1 && (
                <div className="flex justify-center mt-2">
                  <ArrowDown className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 4. 효과 비교 차트
export const EffectComparison = () => {
  const effectData = [
    {
      service: 'BM ZEN 사업분석',
      beforeValue: 100,
      afterValue: 135,
      metric: '매출 증대율',
      unit: '%'
    },
    {
      service: 'AI 생산성향상',
      beforeValue: 40,
      afterValue: 90,
      metric: '업무 효율성',
      unit: '%'
    },
    {
      service: '경매활용 공장구매',
      beforeValue: 100,
      afterValue: 65,
      metric: '부동산 비용',
      unit: '%'
    },
    {
      service: '웹사이트 구축',
      beforeValue: 50,
      afterValue: 200,
      metric: '온라인 문의',
      unit: '건'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          서비스 도입 전후 효과 비교
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {effectData.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{item.service}</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">도입 전</span>
                  <span className="text-lg font-semibold text-red-600">
                    {item.beforeValue}{item.unit}
                  </span>
                </div>
                
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">도입 후</span>
                  <span className="text-lg font-semibold text-green-600">
                    {item.afterValue}{item.unit}
                  </span>
                </div>
                
                <div className="mt-3 p-2 bg-blue-50 rounded">
                  <p className="text-xs text-blue-800 text-center">
                    {item.metric}: {
                      item.service === '경매활용 공장구매' 
                        ? `${item.beforeValue - item.afterValue}% 절감`
                        : `${Math.round((item.afterValue / item.beforeValue) * 100)}% 향상`
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 5. 종합 대시보드
export const ComprehensiveDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServiceEcosystem />
        <ROIComparison />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GrowthStageMapping />
        <EffectComparison />
      </div>
      
      {/* 요약 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">M-CENTER 성과 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600">성공 기업</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">성공률</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">35%</div>
              <div className="text-sm text-gray-600">평균 매출 증대</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">25년</div>
              <div className="text-sm text-gray-600">전문 경험</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 