'use client';

import React from 'react';
import Header from '@/components/layout/header';
// AIFreeDiagnosis 컴포넌트가 새로운 간소화된 진단 시스템으로 교체되었습니다.
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CONSULTANT_INFO, CONTACT_INFO, COMPANY_INFO } from '@/lib/config/branding';

export default function WebsitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            매출증대 웹사이트 구축
          </h1>
          <h2 className="text-3xl font-semibold text-purple-600 mb-8">
            AI 챗봇 임베디드 포함 - 기업을 위한 디지털 혁신 솔루션
          </h2>
          <p className="text-2xl text-gray-700 font-bold mb-8">
            "AI 챗봇으로 24시간 고객 응대하며 온라인 매출 30-50% 증대를 실현합니다"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">30-50%</div>
              <div className="text-sm text-gray-600">온라인 매출 증대</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">AI 챗봇 자동 응대</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">8개월</div>
              <div className="text-sm text-gray-600">투자 회수 기간</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">문의 응답률</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI 무료진단기 섹션 */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🤖 AI 무료진단기로 먼저 확인해보세요!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              웹사이트 구축을 시작하기 전에 AI가 5분만에 귀하의 기업 디지털 성숙도와 
              온라인 매출 증대 가능성을 무료로 분석해드립니다
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <Button 
                onClick={() => window.location.href = '/services/diagnosis'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-xl text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                ⚡ 간소화 진단 시작하기
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                ⚡ 7개 정보 입력 → 2-3분 분석 → 2000자 요약 보고서 완성
              </p>
            </div>
        </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              🎯 더 정밀한 웹사이트 전략이 필요하시다면 전문가 상담을 받아보세요
            </p>
            <Button 
              className="btn-secondary"
              onClick={() => window.location.href = '/services/diagnosis'}
            >
              웹사이트 전문가 상담 신청
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 기존 vs AI 챗봇 임베디드 비교 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            기존 웹사이트 vs AI 챗봇 임베디드 웹사이트
          </h2>
          <div className="bg-gray-50 p-8 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-2">구분</th>
                    <th className="text-center py-4 px-2">기존 웹사이트</th>
                    <th className="text-center py-4 px-2 text-purple-600">AI 챗봇 임베디드</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-semibold">고객 응대</td>
                    <td className="py-4 px-2 text-center">업무시간에만 가능</td>
                    <td className="py-4 px-2 text-center font-bold text-purple-600">24시간 365일 자동 응대</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-semibold">매출 기여</td>
                    <td className="py-4 px-2 text-center">브로셔 수준 역할</td>
                    <td className="py-4 px-2 text-center font-bold text-purple-600">직접적인 매출 창출 채널</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-semibold">고객 관리</td>
                    <td className="py-4 px-2 text-center">수동 관리</td>
                    <td className="py-4 px-2 text-center font-bold text-purple-600">CRM 연동 자동 관리</td>
                  </tr>

                  <tr className="bg-purple-50">
                    <td className="py-4 px-2 font-semibold">투자 회수</td>
                    <td className="py-4 px-2 text-center">3-5년</td>
                    <td className="py-4 px-2 text-center font-bold text-purple-600 text-lg">12-18개월</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Zen 5단계 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Business Model Zen 5단계 웹사이트 전략
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1단계: 가치 발견</h3>
              <p className="text-sm text-gray-700">디지털 성숙도 진단</p>
              <ul className="text-sm text-gray-600 mt-3 text-left">
                <li>• 38개 질문 종합 진단</li>
                <li>• 온라인 존재감 분석</li>
                <li>• 고객 행동 패턴 분석</li>
                <li>• 매출 기회 발굴</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2단계: 가치 창출</h3>
              <p className="text-sm text-gray-700">성장 단계별 전략</p>
              <ul className="text-sm text-gray-600 mt-3 text-left">
                <li>• Step 1: 첫 고객 확보</li>
                <li>• Step 2: 매출 채널 다각화</li>
                <li>• Step 3: AI 기반 생태계</li>
                <li>• Step 4: 글로벌 플랫폼</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3단계: 가치 제공</h3>
              <p className="text-sm text-gray-700">완성도 높은 구축 프로세스</p>
              <ul className="text-sm text-gray-600 mt-3 text-left">
                <li>• 기획 및 설계 (2-4주)</li>
                <li>• 개발 및 구축 (8-12주)</li>
                <li>• 런칭 및 최적화 (4-6주)</li>
                <li>• 지속적 성과 관리</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">4단계: 가치 포착</h3>
              <p className="text-sm text-gray-700">매출 및 수익화 전략</p>
              <ul className="text-sm text-gray-600 mt-3 text-left">
                <li>• 온라인 매출 채널 확대</li>
                <li>• 전환율 최적화</li>
                <li>• 고객 생애가치 향상</li>
                <li>• 자동화를 통한 비용 절감</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">5단계: 가치 교정</h3>
              <p className="text-sm text-gray-700">6개월 사후관리</p>
              <ul className="text-sm text-gray-600 mt-3 text-left">
                <li>• 월별 성과 분석</li>
                <li>• 고객 피드백 반영</li>
                <li>• A/B 테스트 최적화</li>
                <li>• 지속적 기능 개선</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI 챗봇 핵심 기능 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            AI 챗봇 임베디드 시스템 핵심 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🧠</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">지능형 고객 상담</h3>
                  <p className="text-sm text-gray-600">24시간 전문 상담사 수준</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">95% 정확도</div>
                  <div className="text-sm text-gray-600">즉시 자동 응답</div>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• 일반 문의 즉시 응답</li>
                  <li>• 서비스 안내 + 브로셔 다운로드</li>
                  <li>• 자동 견적 산출 + 맞춤 제안</li>
                  <li>• 실시간 예약 시스템</li>
                  <li>• A/S 접수 및 문제 진단</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🔄</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">학습형 AI</h3>
                  <p className="text-sm text-gray-600">더 똑똑해지는 시스템</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-lg font-bold text-green-600">월 5% 향상</div>
                  <div className="text-sm text-gray-600">응답 정확도 지속 개선</div>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• 고객 대화 이력 학습</li>
                  <li>• 업종별 전문 용어 습득</li>
                  <li>• 지역별 고객 패턴 분석</li>
                  <li>• 계절별 문의 패턴 학습</li>
                  <li>• 성능 지표 실시간 모니터링</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 성장 단계별 전략 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            성장 단계별 웹사이트 전략
          </h2>
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🌱</div>
                <h3 className="text-2xl font-bold text-gray-900">Step 1 기업 (창업~3년): "첫 고객 확보 디지털 기반"</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">핵심 구성요소</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 신뢰도 중심 설계 (신뢰도 80% 향상)</li>
                    <li>• AI 챗봇 기본형 (FAQ 50개)</li>
                    <li>• 로컬 SEO 최적화 (지역 고객 300% 증가)</li>
                    <li>• 모바일 퍼스트 (전환율 5배 향상)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">투자 및 수익</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 초기 투자: 500-1,000만원</li>
                    <li>• 월 운영비: 50-100만원</li>
                    <li>• <strong className="text-purple-600">예상 매출: 월 300-500만원</strong></li>
                    <li>• <strong className="text-green-600">투자 회수: 12개월</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🔧</div>
                <h3 className="text-2xl font-bold text-gray-900">Step 2 기업 (3-7년): "매출 채널 다각화 플랫폼"</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">고급 기능</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• CRM 통합 (재구매율 40% 향상)</li>
                    <li>• AI 챗봇 고급형 (전환율 8-12%)</li>
                    <li>• 마케팅 자동화 (리드 너처링 60%)</li>
                    <li>• 결제 시스템 (매출 처리 자동화)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">투자 및 수익</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 시스템 고도화: 2,000-5,000만원</li>
                    <li>• 월 운영비: 200-300만원</li>
                    <li>• <strong className="text-blue-600">예상 매출: 월 1,500-3,000만원</strong></li>
                    <li>• <strong className="text-green-600">투자 회수: 18개월</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 성과 지표 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            고객 기업 성과 지표
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-purple-800 mb-6">정량적 효과 (6개월 기준)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">온라인 매출 비중</span>
                  <span className="text-2xl font-bold text-purple-600">기존 5% → 35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">신규 고객 확보</span>
                  <span className="text-2xl font-bold text-blue-600">월 5명 → 25명</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">고객 응대 시간</span>
                  <span className="text-2xl font-bold text-green-600">8시간 → 24시간</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">마케팅 비용</span>
                  <span className="text-2xl font-bold text-orange-600">75% 절감</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-blue-800 mb-6">AI 챗봇 특화 효과</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📞</div>
                  <div>
                    <div className="font-semibold text-gray-800">문의 응답률</div>
                    <div className="text-sm text-gray-600">30% → 95% (즉시 응답)</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📅</div>
                  <div>
                    <div className="font-semibold text-gray-800">상담 예약율</div>
                    <div className="text-sm text-gray-600">20% → 60% (자동 예약)</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">😊</div>
                  <div>
                    <div className="font-semibold text-gray-800">고객 만족도</div>
                    <div className="text-sm text-gray-600">70% → 90% (24시간 서비스)</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">⚡</div>
                  <div>
                    <div className="font-semibold text-gray-800">업무 효율성</div>
                    <div className="text-sm text-gray-600">반복 업무 80% 자동화</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 38단계 진단 시스템 */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            38단계 디지털 성숙도 진단
          </h2>
          <p className="text-xl text-gray-700 mb-12">
            "15분 투자로 온라인 매출 잠재력 발견"
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">7단계 구성</h3>
              <p className="text-sm text-gray-600">총 38개 질문으로 종합 분석</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">성숙도 점수</h3>
              <p className="text-sm text-gray-600">100점 만점 현재 수준 평가</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">매출 잠재력</h3>
              <p className="text-sm text-gray-600">12개월 시나리오 예측</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI 챗봇 효과</h3>
              <p className="text-sm text-gray-600">응답률, 전환율 시뮬레이션</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">진단 구성 요소</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 1</div>
                <div className="text-gray-600">기업 디지털 현황 (6문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 2</div>
                <div className="text-gray-600">기존 웹사이트 성능 (6문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 3</div>
                <div className="text-gray-600">고객 응대 현황 (5문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 4</div>
                <div className="text-gray-600">온라인 마케팅 역량 (5문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 5</div>
                <div className="text-gray-600">기술 수용 능력 (5문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 6</div>
                <div className="text-gray-600">경쟁사 벤치마킹 (5문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 7</div>
                <div className="text-gray-600">투자 계획 및 목표 (6문항)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">지금 바로 시작하세요!</h2>
          <p className="text-xl mb-12">AI 챗봇으로 24시간 매출 창출하는 웹사이트를 구축하세요!</p>
          
          <div className="bg-gray-800 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-bold mb-6">담당 컨설턴트</h3>
            <div className="grid grid-cols-1 gap-6 text-left">
              <div>
                <div className="font-semibold text-purple-400">담당자</div>
                <div className="text-lg">{CONSULTANT_INFO.name}</div>
              </div>
              <div>
                <div className="font-semibold text-purple-400">소속</div>
                <div className="text-lg">{COMPANY_INFO.name}</div>
              </div>
              <div>
                <div className="font-semibold text-purple-400">이메일</div>
                                  <div className="text-lg">{CONTACT_INFO.mainEmail}</div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition duration-300"
              onClick={() => window.location.href = '/services/diagnosis'}
            >
              무료 AI 진단 시작하기(상담신청)
            </button>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition duration-300"
              onClick={() => window.location.href = '/services/diagnosis'}
            >
              웹사이트 전문가 상담 신청
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-800 to-blue-800 p-6 rounded-xl">
            <h4 className="text-xl font-bold mb-4">🎁 얼리버드 특별 혜택 (선착순 20개사)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-purple-300">구축비 30% 할인</div>
                <div>1,000만원 → 700만원</div>
              </div>
              <div>
                <div className="font-semibold text-blue-300">6개월 운영비 무료</div>
                <div>900만원 상당</div>
              </div>
              <div>
                <div className="font-semibold text-green-300">성과 보장 제도</div>
                <div>목표 미달 시 보상</div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>모든 서비스는 Business Model Zen 5단계 프레임워크를 기반으로 하며,</p>
            <p>체계적인 프로세스를 통해 고객 기업의 온라인 매출 극대화와 디지털 혁신을 지원합니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
} 