'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  Eye, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Bell,
  Pin,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Notice {
  id: number;
  title: string;
  category: '공지' | '안내' | '이벤트' | '보도자료';
  content: string;
  author: string;
  date: string;
  views: number;
  isPinned: boolean;
  hasAttachment: boolean;
  attachmentName?: string;
}

export default function NoticePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const itemsPerPage = 10;

  // 샘플 공지사항 데이터
  const notices: Notice[] = [
    {
      id: 1,
      title: '[중요] ESG 경영시스템 인증 심사 일정 안내',
      category: '공지',
      content: `안녕하세요, ESG 인증원입니다.

2024년 상반기 ESG 경영시스템 인증 심사 일정을 안내드립니다.

1. 신청 기간: 2024년 3월 1일 ~ 3월 31일
2. 심사 기간: 2024년 4월 ~ 6월
3. 대상: ESG 경영시스템 인증을 희망하는 모든 기업

심사 신청은 온라인으로만 접수 가능하며, 자세한 사항은 첨부 파일을 참고해 주시기 바랍니다.

감사합니다.`,
      author: '관리자',
      date: '2024-02-15',
      views: 342,
      isPinned: true,
      hasAttachment: true,
      attachmentName: 'ESG_심사일정_2024상반기.pdf'
    },
    {
      id: 2,
      title: 'ISO 9001:2015 전환 심사 마감 안내',
      category: '안내',
      content: `ISO 9001:2015 전환 심사 마감이 임박했습니다.

아직 전환 심사를 받지 않으신 기업은 서둘러 신청해 주시기 바랍니다.
전환 기한 이후에는 인증이 자동 취소되오니 유의하시기 바랍니다.`,
      author: '인증팀',
      date: '2024-02-14',
      views: 156,
      isPinned: true,
      hasAttachment: false
    },
    {
      id: 3,
      title: '2024년 ESG 경영시스템 내부심사원 양성과정 모집',
      category: '이벤트',
      content: `ESG 경영시스템 내부심사원 양성과정 교육생을 모집합니다.

- 교육 일정: 2024년 3월 18일 ~ 20일 (3일간)
- 교육 장소: ESG 인증원 교육장
- 모집 인원: 30명
- 교육비: 50만원 (교재 및 중식 포함)

신청 및 문의: education@esgrr.co.kr`,
      author: '교육팀',
      date: '2024-02-13',
      views: 287,
      isPinned: false,
      hasAttachment: true,
      attachmentName: '내부심사원_교육과정_안내.pdf'
    },
    {
      id: 4,
      title: 'KAB 정기 사무소 심사 결과 안내',
      category: '보도자료',
      content: `ESG 인증원이 한국인정지원센터(KAB) 정기 사무소 심사를 성공적으로 통과했습니다.

이번 심사에서는 품질경영시스템, 환경경영시스템, 안전보건경영시스템 전 분야에서 
우수한 평가를 받았습니다.`,
      author: '홍보팀',
      date: '2024-02-12',
      views: 98,
      isPinned: false,
      hasAttachment: false
    },
    {
      id: 5,
      title: '시스템 점검으로 인한 온라인 서비스 일시 중단 안내',
      category: '공지',
      content: `시스템 점검 작업으로 인해 아래와 같이 온라인 서비스가 일시 중단됩니다.

- 일시: 2024년 2월 20일(화) 02:00 ~ 06:00 (4시간)
- 대상: 온라인 인증 신청, 진행상황 조회 서비스

이용에 불편을 드려 죄송합니다.`,
      author: 'IT팀',
      date: '2024-02-10',
      views: 45,
      isPinned: false,
      hasAttachment: false
    },
    {
      id: 6,
      title: '2023년 고객만족도 조사 결과 발표',
      category: '보도자료',
      content: `2023년 고객만족도 조사 결과, ESG 인증원이 98.2%의 높은 만족도를 기록했습니다.

주요 평가 항목:
- 심사원 전문성: 98.5%
- 응대 서비스: 97.8%
- 처리 속도: 98.1%

앞으로도 더 나은 서비스를 제공하기 위해 노력하겠습니다.`,
      author: '품질관리팀',
      date: '2024-02-08',
      views: 123,
      isPinned: false,
      hasAttachment: true,
      attachmentName: '2023_고객만족도_조사결과.pdf'
    }
  ];

  // 필터링된 공지사항
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  // 카테고리별 색상
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '공지':
        return 'bg-red-100 text-red-700';
      case '안내':
        return 'bg-blue-100 text-blue-700';
      case '이벤트':
        return 'bg-green-100 text-green-700';
      case '보도자료':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-green-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              공지사항
            </h1>
            <p className="text-xl text-gray-100">
              ESG 인증원의 새로운 소식과 공지사항을 확인하세요
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {selectedNotice ? (
              // 상세보기
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedNotice(null)}
                  className="mb-6"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  목록으로
                </Button>

                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(selectedNotice.category)}>
                            {selectedNotice.category}
                          </Badge>
                          {selectedNotice.isPinned && (
                            <Badge variant="secondary">
                              <Pin className="h-3 w-3 mr-1" />
                              고정
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl">{selectedNotice.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{selectedNotice.author}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {selectedNotice.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              조회 {selectedNotice.views}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-700">
                        {selectedNotice.content}
                      </pre>
                    </div>

                    {selectedNotice.hasAttachment && (
                      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">첨부파일</h4>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          {selectedNotice.attachmentName}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 이전글/다음글 네비게이션 */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  {selectedNotice.id > 1 && (
                    <Card className="cursor-pointer hover:bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <ChevronLeft className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">이전글</p>
                            <p className="font-medium">
                              {notices.find(n => n.id === selectedNotice.id - 1)?.title}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {selectedNotice.id < notices.length && (
                    <Card className="cursor-pointer hover:bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-end text-right">
                          <div>
                            <p className="text-sm text-gray-500">다음글</p>
                            <p className="font-medium">
                              {notices.find(n => n.id === selectedNotice.id + 1)?.title}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 ml-2 text-gray-500" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              // 목록
              <>
                {/* 검색 및 필터 */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="제목 또는 내용으로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-[180px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          <SelectItem value="공지">공지</SelectItem>
                          <SelectItem value="안내">안내</SelectItem>
                          <SelectItem value="이벤트">이벤트</SelectItem>
                          <SelectItem value="보도자료">보도자료</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* 공지사항 목록 */}
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              번호
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              구분
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              제목
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              작성자
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              작성일
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              조회수
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentNotices.map((notice) => (
                            <tr
                              key={notice.id}
                              className="hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => setSelectedNotice(notice)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {notice.isPinned ? (
                                  <Pin className="h-4 w-4 text-gray-500" />
                                ) : (
                                  notice.id
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={getCategoryColor(notice.category)}>
                                  {notice.category}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">
                                    {notice.title}
                                  </span>
                                  {notice.hasAttachment && (
                                    <FileText className="h-4 w-4 ml-2 text-gray-400" />
                                  )}
                                  {/* 새 글 표시 (7일 이내) */}
                                  {new Date().getTime() - new Date(notice.date).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                                    <Badge variant="destructive" className="ml-2 text-xs">
                                      NEW
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {notice.author}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {notice.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {notice.views}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
} 