'use client';

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import InvestmentAnalysisTool from '@/components/investment-analysis/InvestmentAnalysisTool'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, FileText, BarChart3, TrendingUp, Loader2 } from 'lucide-react'
import Link from 'next/link'

function InvestmentAnalysisContent() {
  const searchParams = useSearchParams()
  const [initialValues, setInitialValues] = useState({
    initialInvestment: 500000000,
    annualRevenue: 1200000000,
    interestRate: 5,
    operatingCostRate: 70
  })

  useEffect(() => {
    // URL 파라미터에서 초기값 가져오기
    const investment = searchParams.get('investment')
    const revenue = searchParams.get('revenue')
    const rate = searchParams.get('rate')
    const cost = searchParams.get('cost')

    if (investment) {
      setInitialValues({
        initialInvestment: parseFloat(investment) * 100000000,
        annualRevenue: parseFloat(revenue || '1200') * 100000000,
        interestRate: parseFloat(rate || '5'),
        operatingCostRate: parseFloat(cost || '70')
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/services/policy-funding" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>정책자금 서비스로 돌아가기</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF 다운로드
              </Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                <FileText className="h-4 w-4 mr-2" />
                상담 신청
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI 기반 정책자금 투자분석
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              정교한 NPV/IRR 계산과 시나리오 분석으로 최적의 투자 의사결정을 지원합니다
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Quick Stats */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4">빠른 분석 지표</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">NPV</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">계산 대기</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">IRR</span>
                  </div>
                  <p className="text-xl font-bold text-green-600">계산 대기</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">투자 등급</p>
                  <div className="text-2xl font-bold text-center py-2 bg-gray-100 rounded">
                    -
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Analysis Tool */}
          <div className="lg:col-span-3">
            <InvestmentAnalysisTool />
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            전문가 상담이 필요하신가요?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            AI 분석 결과를 바탕으로 전문가가 맞춤형 컨설팅을 제공합니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/consultation">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                무료 상담 신청하기
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              전화 상담: 1588-1234
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>투자분석 도구를 불러오는 중...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InvestmentAnalysisPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InvestmentAnalysisContent />
    </Suspense>
  )
} 