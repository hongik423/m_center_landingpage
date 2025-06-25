'use client';

import Header from '@/components/layout/header';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Video } from 'lucide-react';

const supportResources = [
  {
    title: '서비스 가이드북',
    description: '6대 핵심서비스 상세 안내서',
    icon: FileText,
    type: 'PDF',
    size: '2.5MB'
  },
  {
    title: 'AI 활용 매뉴얼',
    description: '기업용 AI 도구 활용 가이드',
    icon: FileText,
    type: 'PDF',
    size: '3.2MB'
  },
  {
    title: '정부지원 신청 가이드',
    description: '정부지원 프로그램 신청 방법',
    icon: FileText,
    type: 'PDF',
    size: '1.8MB'
  },
  {
    title: '온라인 세미나 영상',
    description: 'BM ZEN 프레임워크 소개',
    icon: Video,
    type: 'Video',
    size: '45분'
  },
  {
    title: 'BM ZEN 템플릿',
    description: '사업분석 템플릿 모음',
    icon: FileText,
    type: 'Excel',
    size: '1.2MB'
  },
  {
    title: 'AI 도구 비교표',
    description: '업무별 AI 도구 추천',
    icon: FileText,
    type: 'PDF',
    size: '900KB'
  }
];

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              자료실
            </h1>
            <p className="text-xl text-gray-600">
              M-CENTER의 다양한 자료를 다운로드하실 수 있습니다.
            </p>
          </div>

          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Download className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">다운로드 자료</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportResources.map((resource, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6 text-center">
                    <resource.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {resource.description}
                    </p>
                    <div className="text-xs text-gray-500 mb-4">
                      {resource.type} • {resource.size}
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      다운로드
                    </Button>
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