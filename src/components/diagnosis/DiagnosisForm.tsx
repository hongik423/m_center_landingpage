'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DiagnosisFormProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function DiagnosisForm({ onComplete, onBack }: DiagnosisFormProps) {
  const handleSubmit = () => {
    onComplete({
      companyName: "테스트 회사",
      industry: "technology",
      companySize: "11-50",
      establishedYear: "2020",
      contactName: "김테스트",
      contactEmail: "test@test.com",
      contactPhone: "010-1234-5678",
      position: "대표",
      businessModel: "saas",
      mainProducts: "AI 기반 솔루션",
      targetMarket: "중소기업",
      annualRevenue: "100m-1b",
      mainChallenges: ["매출 성장 정체", "고객 확보 어려움"],
      urgentIssues: "신규 고객 확보가 가장 시급한 상황",
      businessGoals: ["매출 성장 및 수익성 개선", "디지털 혁신 및 자동화"],
      expectedOutcome: "체계적인 성장 전략 수립",
      hasCompetitorAnalysis: true,
      hasTechnologyInfrastructure: true,
      hasMarketingStrategy: false,
      additionalInfo: "AI 기술을 활용한 혁신적 솔루션 개발 중"
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>진단 양식</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>진단 양식이 곧 로드됩니다...</p>
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              뒤로가기
            </Button>
            <Button onClick={handleSubmit}>
              테스트 진단 시작
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 