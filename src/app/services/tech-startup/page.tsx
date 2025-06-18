'use client';

import React from 'react';
import Header from '@/components/layout/header';
// AIFreeDiagnosis 컴포넌트가 새로운 간소화된 진단 시스템으로 교체되었습니다.
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CONSULTANT_INFO, CONTACT_INFO, COMPANY_INFO } from '@/lib/config/branding';

export default function TechStartupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            기술사업화/기술창업 컨설팅
          </h1>
          <h2 className="text-3xl font-semibold text-blue-600 mb-8">
            Business Model Zen 프레임워크 기반 체계적 접근
          </h2>
          <p className="text-2xl text-gray-700 font-bold mb-8">
            "기술을 돈으로, 아이디어를 사업으로 - 평균 5억원 자금 확보 실현"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">5억원</div>
              <div className="text-sm text-gray-600">평균 자금 확보</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">사업화 성공률</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">18개월</div>
              <div className="text-sm text-gray-600">단축된 기간</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">300%</div>
              <div className="text-sm text-gray-600">평균 ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI 무료진단기 섹션 */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🤖 AI 무료진단기로 먼저 확인해보세요!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              기술사업화/기술창업 컨설팅을 시작하기 전에 AI가 5분만에 귀하의 기술과 
              사업화 가능성을 무료로 분석해드립니다
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
              🎯 더 정밀한 기술사업화 전략이 필요하시다면 전문가 상담을 받아보세요
            </p>
            <Button 
              className="btn-secondary"
              onClick={() => window.location.href = '/services/diagnosis'}
            >
              기술사업화 전문가 상담 신청
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* BM ZEN Framework */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Business Model Zen 5단계 프레임워크
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1단계: 가치 발견</h3>
              <p className="text-sm text-gray-700">기술 및 시장 진단</p>
              <ul className="text-sm text-gray-600 mt-3 text-left">
                <li>• 기술 역량 진단</li>
                <li>• 시장 기회 분석</li>
                <li>• TRL 평가</li>
                <li>• IP 경쟁력 분석</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2단계: 가치 창출</h3>
              <p className="text-sm text-gray-700">비즈니스 모델 설계</p>
              <ul className="text-xs text-gray-600 mt-3 text-left">
                <li>• 수익 모델 개발</li>
                <li>• MVP 전략</li>
                <li>• B2B/B2C 모델</li>
                <li>• 플랫폼 전략</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3단계: 가치 제공</h3>
              <p className="text-sm text-gray-700">시장 진입 전략</p>
              <ul className="text-xs text-gray-600 mt-3 text-left">
                <li>• Go-to-Market 전략</li>
                <li>• 마케팅 전략</li>
                <li>• 파트너십</li>
                <li>• 라이선싱</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">4단계: 가치 포착</h3>
              <p className="text-sm text-gray-700">수익화 및 성장</p>
              <ul className="text-xs text-gray-600 mt-3 text-left">
                <li>• 단계별 수익화</li>
                <li>• 투자유치 전략</li>
                <li>• 정부지원금</li>
                <li>• VC 투자</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">5단계: 가치 확산</h3>
              <p className="text-sm text-gray-700">확장 및 지속가능성</p>
              <ul className="text-xs text-gray-600 mt-3 text-left">
                <li>• 스케일업 전략</li>
                <li>• 글로벌 진출</li>
                <li>• M&A 전략</li>
                <li>• 시장 리더십</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Target Customers */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            최적 고객군
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">👨‍🔬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">기술보유 예비창업자</h3>
              <p className="text-sm text-gray-600">연구원, 교수, 엔지니어</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">초기 스타트업</h3>
              <p className="text-sm text-gray-600">설립 3년 이내 기술기반 기업</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">기존 기업 신기술</h3>
              <p className="text-sm text-gray-600">신기술 사업화 추진 조직</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">대학 연구성과</h3>
              <p className="text-sm text-gray-600">연구성과 활용 희망 연구진</p>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Stages */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            성장 단계별 전략
          </h2>
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🌱</div>
                <h3 className="text-2xl font-bold text-gray-900">Stage 1: 아이디어 단계 (Pre-Seed)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">주요 목표</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 기술 개념 검증 (PoC)</li>
                    <li>• 핵심 팀 구성</li>
                    <li>• 초기 시장 조사</li>
                    <li>• 기본 IP 확보</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">지원 프로그램</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 창업도약패키지: 최대 1억원</li>
                    <li>• TIPS: 최대 5억원</li>
                    <li>• 창업성장기술개발: 최대 3억원</li>
                    <li>• 중기부 창업지원</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🔧</div>
                <h3 className="text-2xl font-bold text-gray-900">Stage 2: 프로토타입 단계 (Seed)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">주요 목표</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• MVP 개발 완료</li>
                    <li>• 초기 고객 확보</li>
                    <li>• 비즈니스 모델 검증</li>
                    <li>• 투자 유치 준비</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">자금 조달 옵션</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 정부지원금: 2-5억원</li>
                    <li>• 엔젤 투자: 0.5-2억원</li>
                    <li>• 액셀러레이터: 0.1-1억원</li>
                    <li>• 크라우드펀딩: 0.1-0.5억원</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🚀</div>
                <h3 className="text-2xl font-bold text-gray-900">Stage 3: 상용화 단계 (Series A)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">주요 목표</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 정식 제품 출시</li>
                    <li>• 매출 확대</li>
                    <li>• 조직 체계화</li>
                    <li>• 다음 라운드 투자 준비</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">성장 지원 체계</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 스케일업 프로그램: 10-30억원</li>
                    <li>• 정책금융: 산업은행, 기보</li>
                    <li>• VC 투자: 5-50억원</li>
                    <li>• 해외진출 지원</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🌍</div>
                <h3 className="text-2xl font-bold text-gray-900">Stage 4: 확장 단계 (Series B+)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">주요 목표</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 시장 리더십 확보</li>
                    <li>• 글로벌 진출</li>
                    <li>• 신사업 영역 확장</li>
                    <li>• IPO 또는 M&A 준비</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">확장 전략</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 시장 지배력 확보</li>
                    <li>• 해외 시장 개척</li>
                    <li>• 전략적 M&A</li>
                    <li>• 글로벌 네트워크</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Cases */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            성공 사례 및 실증 데이터
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🏢</div>
                <h3 className="text-2xl font-bold text-gray-900">AI 솔루션 기업 S사</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">기업 개요</h4>
                  <p className="text-sm text-gray-600">AI 기반 제조 품질관리 솔루션 (2020년 교수 창업)</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">자금 조달 현황</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 정부지원금: 12억원 (3년간)</li>
                    <li>• 민간투자: 15억원 (Series A)</li>
                    <li>• 총 조달 금액: 27억원</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">사업 성과</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 매출 성장: 0억 → 25억원 (3년)</li>
                    <li>• 고객사: 국내 20개, 해외 5개</li>
                    <li>• 직원 수: 2명 → 45명</li>
                    <li>• 기업가치: 200억원</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🧬</div>
                <h3 className="text-2xl font-bold text-gray-900">바이오 헬스케어 B사</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">기업 개요</h4>
                  <p className="text-sm text-gray-600">개인 맞춤형 영양제 서비스 (2019년 연구원 창업)</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">자금 조달 현황</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 정부지원금: 8억원</li>
                    <li>• 민간투자: 20억원</li>
                    <li>• 크라우드펀딩: 2억원</li>
                    <li>• 총 조달 금액: 30억원</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">사업 성과</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 매출 성장: 0억 → 18억원 (3년)</li>
                    <li>• 누적 고객: 50만명</li>
                    <li>• 월 구독자: 8만명</li>
                    <li>• 기업가치: 150억원</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">성과 지표 종합</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">5.2억원</div>
                <div className="text-sm text-gray-600">정부지원금 평균</div>
                <div className="text-sm text-gray-500 mt-1">성공률 78%</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">1.8억원</div>
                <div className="text-sm text-gray-600">엔젤투자 평균</div>
                <div className="text-sm text-gray-500 mt-1">성공률 45%</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">12.5억원</div>
                <div className="text-sm text-gray-600">VC투자 평균</div>
                <div className="text-xs text-gray-500 mt-1">성공률 25%</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">85%</div>
                <div className="text-sm text-gray-600">전체 성공률</div>
                <div className="text-xs text-gray-500 mt-1">18개월 평균</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            서비스 패키지 및 요금
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">기본 패키지</h3>
              <div className="text-sm text-gray-600 mb-6">6개월 서비스</div>
              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                <li>• 정부사업 기획 및 신청 지원</li>
                <li>• 사업계획서 작성 및 검토</li>
                <li>• 월 2회 전문가 멘토링</li>
                <li>• 투자유치 IR 자료 제작</li>
                <li>• 성과 관리 및 리포팅</li>
              </ul>
              <div className="text-xs text-blue-600">정부지원금 확보 시 50% 할인</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border-2 border-green-200 transform scale-105 shadow-lg">
              <div className="text-center mb-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">인기</span>
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">프리미엄 패키지</h3>
              <div className="text-sm text-gray-600 mb-6">12개월 서비스</div>
              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                <li>• 기본 패키지 모든 서비스</li>
                <li>• 주 1회 전담 컨설턴트 상담</li>
                <li>• 투자자 네트워킹 및 IR 주선</li>
                <li>• 해외진출 지원</li>
                <li>• 법무/재무/세무 전문가 지원</li>
              </ul>
              <div className="text-xs text-green-600">목표 미달성 시 환불 보장</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">종합 패키지</h3>
              <div className="text-sm text-gray-600 mb-6">36개월 서비스</div>
              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                <li>• 프리미엄 패키지 모든 서비스</li>
                <li>• 3년 완전 관리형 서비스</li>
                <li>• IPO/M&A까지 종합 지원</li>
                <li>• 글로벌 진출 종합 컨설팅</li>
                <li>• 후속 투자 유치 완전 지원</li>
              </ul>
              <div className="text-xs text-purple-600">성공 수수료: 투자 유치액의 3-5%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">지금 바로 시작하세요!</h2>
          <p className="text-xl mb-8">기술을 가지고 있다면 지금이 창업의 골든타임입니다!</p>
          
          <div className="bg-gray-800 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-bold mb-6">담당 컨설턴트</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <div className="font-semibold text-blue-400">담당자</div>
                <div className="text-lg">{CONSULTANT_INFO.name}</div>
              </div>
              <div>
                <div className="font-semibold text-blue-400">소속</div>
                <div className="text-lg">{COMPANY_INFO.name}</div>
              </div>
              <div>
                <div className="font-semibold text-blue-400">이메일</div>
                                  <div className="text-lg">{CONTACT_INFO.mainEmail}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition duration-300"
              onClick={() => window.location.href = '/services/diagnosis'}
            >
              무료 AI 진단 시작하기(상담신청)
            </button>
            <button 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition duration-300"
              onClick={() => window.location.href = '/services/diagnosis'}
            >
              기술사업화 전문가 상담 신청
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>본 프로그램은 중소벤처기업부, 과학기술정보통신부 등 정부 지원사업과 연계하여 진행됩니다.</p>
            <p>정확한 지원 조건 및 절차는 각 기관의 공식 공고를 참조하시기 바랍니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
} 