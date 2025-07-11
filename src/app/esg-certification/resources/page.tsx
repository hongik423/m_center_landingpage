'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  Eye,
  Users,
  FolderOpen,
  File,
  Table,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [auditorSearchTerm, setAuditorSearchTerm] = useState('');

  const isoDocuments = [
    {
      id: 1,
      category: 'ISO 9001',
      title: 'ISO 9001:2015 품질경영시스템 요구사항 해설서',
      description: 'ISO 9001 규격의 상세한 해설과 적용 가이드',
      fileType: 'PDF',
      fileSize: '2.5MB',
      date: '2024-01-15',
      downloads: 342,
      views: 1250
    },
    {
      id: 2,
      category: 'ISO 9001',
      title: '품질매뉴얼 작성 가이드 및 템플릿',
      description: '품질매뉴얼 작성을 위한 단계별 가이드와 템플릿',
      fileType: 'DOCX',
      fileSize: '1.8MB',
      date: '2024-01-10',
      downloads: 287,
      views: 980
    },
    {
      id: 3,
      category: 'ISO 14001',
      title: 'ISO 14001:2015 환경경영시스템 구축 가이드',
      description: '환경경영시스템 구축을 위한 실무 가이드',
      fileType: 'PDF',
      fileSize: '3.2MB',
      date: '2024-01-08',
      downloads: 195,
      views: 756
    },
    {
      id: 4,
      category: 'ISO 14001',
      title: '환경측면 파악 및 평가 체크리스트',
      description: '환경측면 파악을 위한 체크리스트와 평가 양식',
      fileType: 'XLSX',
      fileSize: '450KB',
      date: '2024-01-05',
      downloads: 163,
      views: 623
    },
    {
      id: 5,
      category: 'ISO 45001',
      title: 'ISO 45001:2018 안전보건경영시스템 실무 매뉴얼',
      description: '안전보건경영시스템 구축 및 운영 실무 매뉴얼',
      fileType: 'PDF',
      fileSize: '4.1MB',
      date: '2023-12-28',
      downloads: 218,
      views: 892
    },
    {
      id: 6,
      category: 'ISO 45001',
      title: '위험성평가 절차서 및 양식',
      description: '위험성평가 수행을 위한 절차서와 평가 양식',
      fileType: 'DOCX',
      fileSize: '890KB',
      date: '2023-12-20',
      downloads: 174,
      views: 701
    },
    {
      id: 7,
      category: 'ESG',
      title: 'ESG 경영시스템 구축 가이드북',
      description: 'ESG 경영시스템 도입을 위한 종합 가이드북',
      fileType: 'PDF',
      fileSize: '5.3MB',
      date: '2024-02-01',
      downloads: 412,
      views: 1580
    },
    {
      id: 8,
      category: '통합',
      title: '통합경영시스템 문서관리 가이드',
      description: 'ISO 9001/14001/45001 통합 문서관리 가이드',
      fileType: 'PDF',
      fileSize: '2.8MB',
      date: '2024-01-25',
      downloads: 156,
      views: 534
    }
  ];

  const auditorList = [
    {
      id: 1,
      name: '김철수',
      qualification: '선임심사원',
      certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
      contractType: '전속',
      experience: '15년',
      specialization: '제조업, 건설업'
    },
    {
      id: 2,
      name: '이영희',
      qualification: '심사원',
      certifications: ['ISO 9001', 'ISO 14001'],
      contractType: '전속',
      experience: '8년',
      specialization: '서비스업, IT'
    },
    {
      id: 3,
      name: '박민수',
      qualification: '선임심사원',
      certifications: ['ISO 45001', 'ESG'],
      contractType: '계약',
      experience: '12년',
      specialization: '화학, 제약'
    },
    {
      id: 4,
      name: '정수진',
      qualification: '심사원',
      certifications: ['ISO 9001'],
      contractType: '전속',
      experience: '5년',
      specialization: '식품, 유통'
    },
    {
      id: 5,
      name: '최동욱',
      qualification: '선임심사원',
      certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ESG'],
      contractType: '전속',
      experience: '20년',
      specialization: '전 산업'
    },
    {
      id: 6,
      name: '한미경',
      qualification: '심사원',
      certifications: ['ISO 14001', 'ESG'],
      contractType: '계약',
      experience: '7년',
      specialization: '환경, 에너지'
    }
  ];

  const filteredDocuments = isoDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredAuditors = auditorList.filter(auditor => {
    return auditor.name.toLowerCase().includes(auditorSearchTerm.toLowerCase()) ||
           auditor.certifications.some(cert => 
             cert.toLowerCase().includes(auditorSearchTerm.toLowerCase())
           ) ||
           auditor.specialization.toLowerCase().includes(auditorSearchTerm.toLowerCase());
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return <File className="h-5 w-5 text-red-500" />;
      case 'DOCX':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'XLSX':
        return <Table className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              자료실
            </h1>
            <p className="text-xl text-gray-100">
              인증 관련 문서와 정보를 제공합니다<br />
              실무에 필요한 다양한 자료를 다운로드하세요
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="documents">ISO 자료</TabsTrigger>
                <TabsTrigger value="auditors">심사원 리스트</TabsTrigger>
              </TabsList>

              {/* ISO Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                {/* Search and Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle>자료 검색</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="search">검색어</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="search"
                            placeholder="자료명 또는 키워드 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="category">카테고리</Label>
                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">전체</SelectItem>
                            <SelectItem value="ISO 9001">ISO 9001</SelectItem>
                            <SelectItem value="ISO 14001">ISO 14001</SelectItem>
                            <SelectItem value="ISO 45001">ISO 45001</SelectItem>
                            <SelectItem value="ESG">ESG</SelectItem>
                            <SelectItem value="통합">통합</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document List */}
                <div className="grid gap-4">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getFileIcon(doc.fileType)}
                              <Badge variant="outline">{doc.category}</Badge>
                              <span className="text-sm text-gray-500">{doc.fileType}</span>
                              <span className="text-sm text-gray-500">{doc.fileSize}</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                              {doc.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {doc.description}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {doc.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                조회 {doc.views.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                다운로드 {doc.downloads.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Button className="ml-4">
                            <Download className="h-4 w-4 mr-2" />
                            다운로드
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredDocuments.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">검색 결과가 없습니다.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Auditor List Tab */}
              <TabsContent value="auditors" className="space-y-6">
                {/* Search */}
                <Card>
                  <CardHeader>
                    <CardTitle>심사원 검색</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="심사원명, 자격, 전문분야로 검색"
                        value={auditorSearchTerm}
                        onChange={(e) => setAuditorSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Auditor Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>등록 심사원 현황</CardTitle>
                    <CardDescription>
                      총 {filteredAuditors.length}명의 심사원이 등록되어 있습니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left py-3 px-4">성명</th>
                            <th className="text-left py-3 px-4">자격구분</th>
                            <th className="text-left py-3 px-4">심사자격</th>
                            <th className="text-left py-3 px-4">계약구분</th>
                            <th className="text-left py-3 px-4">경력</th>
                            <th className="text-left py-3 px-4">전문분야</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredAuditors.map((auditor) => (
                            <tr key={auditor.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">
                                {auditor.name}
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant={auditor.qualification === '선임심사원' ? 'default' : 'secondary'}>
                                  {auditor.qualification}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {auditor.certifications.map((cert, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`text-sm ${
                                  auditor.contractType === '전속' 
                                    ? 'text-green-600 font-medium' 
                                    : 'text-gray-600'
                                }`}>
                                  {auditor.contractType}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {auditor.experience}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {auditor.specialization}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredAuditors.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">검색 결과가 없습니다.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Download Button */}
                <div className="text-center">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    심사원 명단 엑셀 다운로드
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              더 많은 자료가 필요하신가요?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              회원가입 후 더 많은 자료를 이용하실 수 있습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-700 hover:bg-gray-100"
                asChild
              >
                <Link href="/signup">
                  회원가입 <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/esg-certification/contact">
                  자료 요청하기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 