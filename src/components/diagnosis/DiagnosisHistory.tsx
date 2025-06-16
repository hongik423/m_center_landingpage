'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDiagnosisStore } from '@/lib/stores/diagnosisStore';
import { 
  Search,
  Calendar,
  TrendingUp,
  Building,
  Eye,
  Download,
  Trash2,
  Filter
} from 'lucide-react';

interface DiagnosisHistoryProps {
  onSelectDiagnosis?: (diagnosisId: string) => void;
}

export default function DiagnosisHistory({ onSelectDiagnosis }: DiagnosisHistoryProps) {
  const { diagnosisHistory, getHistoryByCompany } = useDiagnosisStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'company'>('date');

  // 검색 및 정렬된 히스토리
  const filteredHistory = React.useMemo(() => {
    let filtered = diagnosisHistory;

    // 검색 필터링
    if (searchTerm) {
      filtered = filtered.filter(diagnosis =>
        diagnosis.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagnosis.marketPosition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'score':
          return b.overallScore - a.overallScore;
        case 'company':
          return a.companyName.localeCompare(b.companyName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [diagnosisHistory, searchTerm, sortBy]);

  // 통계 계산
  const stats = React.useMemo(() => {
    if (diagnosisHistory.length === 0) {
      return { total: 0, avgScore: 0, topCompanies: [] };
    }

    const total = diagnosisHistory.length;
    const avgScore = Math.round(
      diagnosisHistory.reduce((sum, d) => sum + d.overallScore, 0) / total
    );
    
    const topCompanies = diagnosisHistory
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 3)
      .map(d => ({ name: d.companyName, score: d.overallScore }));

    return { total, avgScore, topCompanies };
  }, [diagnosisHistory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-orange-600';
  };

  const getPositionVariant = (position: string) => {
    switch (position) {
      case '우수': return 'default';
      case '양호': return 'secondary';
      default: return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      {/* 통계 대시보드 */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">총 진단 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-sm text-gray-600 mt-1">누적 진단 건수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">평균 점수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.avgScore}</div>
            <p className="text-sm text-gray-600 mt-1">전체 평균 점수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">이번 달 진단</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {diagnosisHistory.filter(d => 
                new Date(d.createdAt).getMonth() === new Date().getMonth()
              ).length}
            </div>
            <p className="text-sm text-gray-600 mt-1">이번 달 진단 수</p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            진단 히스토리 검색
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="회사명 또는 시장 위치로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'company')}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="date">날짜순</option>
                <option value="score">점수순</option>
                <option value="company">회사명순</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 진단 히스토리 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>진단 결과 목록</CardTitle>
          <CardDescription>
            {filteredHistory.length}개의 진단 결과가 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((diagnosis) => (
                <div
                  key={diagnosis.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{diagnosis.companyName}</h3>
                      <Badge variant={getPositionVariant(diagnosis.marketPosition)}>
                        {diagnosis.marketPosition}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {formatDate(diagnosis.createdAt)}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">종합 점수:</span>
                      <span className={`font-semibold ${getScoreColor(diagnosis.overallScore)}`}>
                        {diagnosis.overallScore}/100
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">성장률:</span>
                      <span className="font-medium">{diagnosis.industryGrowth}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">경쟁도:</span>
                      <span className="font-medium">{diagnosis.competitiveness}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">주요 강점 (상위 3개):</div>
                    <div className="flex flex-wrap gap-1">
                      {diagnosis.strengths.slice(0, 3).map((strength, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      추천사항: {diagnosis.recommendations.length}개
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectDiagnosis?.(diagnosis.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        상세보기
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // 보고서 다운로드 로직
                          console.log('Download report for', diagnosis.id);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        다운로드
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 상위 성과 기업 */}
      {stats.topCompanies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              상위 성과 기업
            </CardTitle>
            <CardDescription>
              진단 점수 기준 상위 3개 기업
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCompanies.map((company, index) => (
                <div key={company.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{company.name}</span>
                  </div>
                  <div className={`font-bold text-lg ${getScoreColor(company.score)}`}>
                    {company.score}점
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 