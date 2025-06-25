'use client';

import Header from '@/components/layout/header';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

const notices = [
  {
    id: 1,
    title: '2024년 신규 AI 생산성향상 지원사업 안내',
    content: '정부의 AI 생산성향상 지원사업이 새롭게 시작됩니다. 100% 정부지원으로 진행되는 이번 사업에 많은 관심 부탁드립니다.',
    date: '2024-01-15',
    important: true,
    category: '정부지원'
  },
  {
    id: 2,
    title: '설 연휴 고객지원 운영 안내',
    content: '설 연휴 기간(2024년 2월 9일~12일) 고객지원 운영시간이 변경됩니다.',
    date: '2024-02-05',
    important: false,
    category: '운영안내'
  },
  {
    id: 3,
    title: 'BM ZEN 2.0 업데이트 출시',
    content: '더욱 향상된 분석 기능과 새로운 산업별 템플릿이 추가된 BM ZEN 2.0이 출시되었습니다.',
    date: '2024-01-20',
    important: true,
    category: '서비스'
  },
  {
    id: 4,
    title: '무료 온라인 세미나 개최 안내',
    content: '"2024년 기업 성장 전략"을 주제로 한 무료 온라인 세미나를 개최합니다.',
    date: '2024-01-10',
    important: false,
    category: '이벤트'
  }
];

export default function NoticesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              공지사항
            </h1>
            <p className="text-xl text-gray-600">
              M-CENTER의 최신 소식과 공지사항을 확인하세요.
            </p>
          </div>

          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Bell className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">최신 공지</h2>
            </div>
            
            <div className="space-y-4">
              {notices.map((notice) => (
                <Card key={notice.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {notice.important && (
                            <Badge className="bg-red-100 text-red-800">
                              중요
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {notice.category}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {notice.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {notice.content}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notice.date}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 