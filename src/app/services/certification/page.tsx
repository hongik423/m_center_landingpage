'use client';

import React from 'react';
import Header from '@/components/layout/header';

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            인증지원 서비스
          </h1>
          <h2 className="text-3xl font-semibold text-emerald-600 mb-8">
            벤처·ISO·ESG 통합 인증으로 세무사 고객의 기업가치 극대화
          </h2>
          <p className="text-2xl text-gray-700 font-bold mb-8">
            "세무 서비스를 넘어 기업 성장의 전략적 파트너가 되십시오"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-emerald-600 mb-2">5천만원</div>
              <div className="text-sm text-gray-600">연간 세제혜택</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">3-5년</div>
              <div className="text-sm text-gray-600">장기 파트너십</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">5대 영역</div>
              <div className="text-sm text-gray-600">통합 인증 체계</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">283%</div>
              <div className="text-sm text-gray-600">수익 증가율</div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Zen Framework */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Business Model Zen 5단계 인증 전략
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1단계: 가치 발견</h3>
              <p className="text-sm text-gray-700">종합 인증 로드맵 진단</p>
              <ul className="text-xs text-gray-600 mt-3 text-left">
                <li>• 42개 질문 종합 진단</li>
                <li>• 보유 인증 현황 분석</li>
                <li>• 세제혜택 기회 발굴</li>
                <li>• 투자 우선순위 설정</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2단계: 가치 창출</h3>
              <p className="text-sm text-gray-700">성장 단계별 인증 전략</p>
              <ul className="text-xs text-gray-600 mt-3 text-left">
                <li>• Step 1: 벤처기업확인</li>
                <li>• Step 2: ISO 인증 체계</li>
                <li>• Step 3: ESG 경영 기반</li>
                <li>• Step 4: 글로벌 진출</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3단계: 가치 제공</h3>
              <p className="text-sm text-gray-700">세무사 통합 프로세스</p>
              <ul className="text-xs text-gray-600 mt-3 text-left">
                <li>• 사전 준비 (2-4주)</li>
                <li>• 인증 준비 (6-12주)</li>
                <li>• 사후 관리 (지속)</li>
                <li>• 성과 측정 및 보고</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">4단계: 가치 포착</h3>
              <p className="text-sm text-gray-700">명확한 수익 모델</p>
              <ul className="text-xs text-gray-600 mt-3 text-left">
                <li>• 기본 수수료</li>
                <li>• 인증 컨설팅비</li>
                <li>• 성공 보너스</li>
                <li>• 장기 계약 혜택</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">5단계: 가치 교정</h3>
              <p className="text-sm text-gray-700">지속적 관계 강화</p>
              <ul className="text-xs text-gray-600 mt-3 text-left">
                <li>• 6개월 종합 관리</li>
                <li>• 정기 성과 리뷰</li>
                <li>• 세무사 지원 강화</li>
                <li>• 신규 정책 브리핑</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5대 핵심 인증 서비스 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            5대 핵심 인증 서비스
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🚀</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">벤처기업확인</h3>
                  <p className="text-sm text-gray-600">창업 초기 필수 인증</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="text-lg font-bold text-emerald-600">연간 2,000만원</div>
                  <div className="text-sm text-gray-600">세제혜택</div>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• 소요 기간: 2-3개월</li>
                  <li>• 투자 비용: 500만원</li>
                  <li>• 스톡옵션 비과세 5억원 한도</li>
                  <li>• 투자소득공제 개인 3천만원</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🔬</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">기업부설연구소</h3>
                  <p className="text-sm text-gray-600">연구개발비 세액공제</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">연간 3,000만원</div>
                  <div className="text-sm text-gray-600">절세 효과</div>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• 소요 기간: 1-2개월</li>
                  <li>• 투자 비용: 300만원</li>
                  <li>• 연구개발비 세액공제 최대 40%</li>
                  <li>• 연구인력 인건비 추가 공제</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🏆</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">이노비즈/메인비즈</h3>
                  <p className="text-sm text-gray-600">혁신 기업 인증</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">연간 500만원+</div>
                  <div className="text-sm text-gray-600">세제혜택</div>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• 소요 기간: 4-6개월</li>
                  <li>• 투자 비용: 800-1,000만원</li>
                  <li>• 정부지원 프로그램 우대</li>
                  <li>• 금융 우대 혜택</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🌐</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">ISO 인증 시리즈</h3>
                  <p className="text-sm text-gray-600">글로벌 표준 인증</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">매출 20-30%</div>
                  <div className="text-sm text-gray-600">증가 효과</div>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• ISO 9001 (품질경영)</li>
                  <li>• ISO 14001 (환경경영)</li>
                  <li>• ISO 45001 (안전보건)</li>
                  <li>• ISO 27001 (정보보안)</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🌱</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">ESG 인증</h3>
                  <p className="text-sm text-gray-600">지속가능경영 체계</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-lg font-bold text-green-600">미래 필수</div>
                  <div className="text-sm text-gray-600">인증 체계</div>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• 탄소배출권 거래</li>
                  <li>• 친환경 투자 세액공제</li>
                  <li>• 상생협력 세액공제</li>
                  <li>• 고용창출 세액공제</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 성장 단계별 전략 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            성장 단계별 인증 전략
          </h2>
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🌱</div>
                <h3 className="text-2xl font-bold text-gray-900">Step 1 기업 (창업~3년): "신뢰받는 기업의 첫 걸음"</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">우선 인증 목표</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 벤처기업확인 (2-3개월)</li>
                    <li>• 기업부설연구소 (1-2개월)</li>
                    <li>• 이노비즈 준비 (6개월)</li>
                    <li>• 세제혜택 극대화 + 정부지원 기반</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">투자 및 효과</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 총 투자: 1,600만원</li>
                    <li>• 연간 절세: 5,500만원</li>
                    <li>• <strong className="text-green-600">ROI: 344%</strong></li>
                    <li>• 소요 기간: 6개월</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🔧</div>
                <h3 className="text-2xl font-bold text-gray-900">Step 2 기업 (3-7년): "경쟁력 강화 종합 인증 체계"</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">확장 인증 목표</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• ISO 9001 (품질경영, 6-8개월)</li>
                    <li>• 메인비즈 (4-6개월)</li>
                    <li>• ISO 14001 (환경경영, 4-6개월)</li>
                    <li>• 시장 신뢰도 확보 + 대기업 납품</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">투자 및 효과</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 총 투자: 3,700만원</li>
                    <li>• 매출 증가: 20% 이상</li>
                    <li>• 금융 우대 혜택</li>
                    <li>• 소요 기간: 12개월</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🌍</div>
                <h3 className="text-2xl font-bold text-gray-900">Step 3-4 기업 (7년 이상): "글로벌 진출 국제 인증"</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">글로벌 인증 목표</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• ISO 45001 (안전보건)</li>
                    <li>• ISO 27001 (정보보안)</li>
                    <li>• ESG 경영 고도화</li>
                    <li>• 해외 진출 기반 구축</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">전략적 효과</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 글로벌 시장 진입</li>
                    <li>• 대기업 파트너십</li>
                    <li>• ESG 투자 유치</li>
                    <li>• 지속가능한 성장</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 세무사 수익 모델 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            세무사를 위한 명확한 수익 모델
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-2">수익원</th>
                    <th className="text-center py-4 px-2">기존 세무업무</th>
                    <th className="text-center py-4 px-2">인증 통합 서비스</th>
                    <th className="text-center py-4 px-2">증가율</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-semibold">기본 수수료</td>
                    <td className="py-4 px-2 text-center">월 50만원 × 12개월</td>
                    <td className="py-4 px-2 text-center">월 50만원 × 12개월</td>
                    <td className="py-4 px-2 text-center text-gray-600">유지</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-semibold">인증 컨설팅</td>
                    <td className="py-4 px-2 text-center">-</td>
                    <td className="py-4 px-2 text-center font-bold text-emerald-600">월 100만원 × 12개월</td>
                    <td className="py-4 px-2 text-center text-emerald-600 font-bold">+1,200만원</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-semibold">성공 보너스</td>
                    <td className="py-4 px-2 text-center">-</td>
                    <td className="py-4 px-2 text-center font-bold text-blue-600">인증 취득 시 500만원</td>
                    <td className="py-4 px-2 text-center text-blue-600 font-bold">+500만원</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-semibold">장기 계약</td>
                    <td className="py-4 px-2 text-center">1년 계약</td>
                    <td className="py-4 px-2 text-center font-bold text-purple-600">3년 장기 계약</td>
                    <td className="py-4 px-2 text-center text-purple-600 font-bold">+200%</td>
                  </tr>
                  <tr className="bg-gray-50 font-bold">
                    <td className="py-4 px-2">연간 총 수익</td>
                    <td className="py-4 px-2 text-center">600만원</td>
                    <td className="py-4 px-2 text-center text-green-600 text-lg">2,300만원</td>
                    <td className="py-4 px-2 text-center text-green-600 text-lg">+283%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 고객 성과 지표 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            고객 기업 성과 지표
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-emerald-800 mb-6">정량적 효과</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">연간 세제혜택</span>
                  <span className="text-2xl font-bold text-emerald-600">평균 5,000만원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">정부지원 연계</span>
                  <span className="text-2xl font-bold text-blue-600">평균 3억원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">매출 증대</span>
                  <span className="text-2xl font-bold text-purple-600">평균 30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">자금 절약</span>
                  <span className="text-2xl font-bold text-orange-600">연간 1,000만원</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-blue-800 mb-6">정성적 효과</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🏆</div>
                  <div>
                    <div className="font-semibold text-gray-800">브랜드 가치</div>
                    <div className="text-sm text-gray-600">신뢰할 수 있는 기업 이미지 구축</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">👥</div>
                  <div>
                    <div className="font-semibold text-gray-800">인재 유치</div>
                    <div className="text-sm text-gray-600">우수 인력 채용 및 이직률 감소</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🤝</div>
                  <div>
                    <div className="font-semibold text-gray-800">파트너십</div>
                    <div className="text-sm text-gray-600">대기업·정부기관과의 협력 기회</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🌍</div>
                  <div>
                    <div className="font-semibold text-gray-800">글로벌 진출</div>
                    <div className="text-sm text-gray-600">해외 시장 진입을 위한 기본 자격</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 42단계 종합 진단 */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            42단계 종합 진단 시스템
          </h2>
          <p className="text-xl text-gray-700 mb-12">
            "15분 투자로 3년 로드맵 완성"
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">7단계 구성</h3>
              <p className="text-sm text-gray-600">총 42개 질문으로 종합 분석</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">자동 리포트</h3>
              <p className="text-sm text-gray-600">개인화된 인증 로드맵 생성</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">비용 시뮬레이션</h3>
              <p className="text-sm text-gray-600">5년간 투자 및 효과 분석</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">정부지원 매칭</h3>
              <p className="text-sm text-gray-600">신청 가능 프로그램 목록</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">진단 구성 요소</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 1</div>
                <div className="text-gray-600">기업 기본 정보 (6문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 2</div>
                <div className="text-gray-600">현재 인증 보유 현황 (6문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 3</div>
                <div className="text-gray-600">재무 및 세무 현황 (6문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 4</div>
                <div className="text-gray-600">기술 및 R&D 역량 (6문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 5</div>
                <div className="text-gray-600">조직 및 인력 현황 (6문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 6</div>
                <div className="text-gray-600">미래 성장 계획 (6문항)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Step 7</div>
                <div className="text-gray-600">투자 의향 및 우선순위 (6문항)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">지금 바로 시작하세요!</h2>
          <p className="text-xl mb-12">세무 서비스를 넘어 기업 성장의 전략적 파트너가 되십시오!</p>
          
          <div className="bg-gray-800 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-bold mb-6">담당 컨설턴트</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <div className="font-semibold text-emerald-400">담당자</div>
                <div className="text-lg">이후경 책임컨설턴트</div>
              </div>
              <div>
                <div className="font-semibold text-emerald-400">소속</div>
                <div className="text-lg">기업의별 경영지도센터</div>
              </div>
              <div>
                <div className="font-semibold text-emerald-400">이메일</div>
                <div className="text-lg">hongik423@gmail.com</div>
              </div>
              <div>
                <div className="font-semibold text-emerald-400">휴대폰</div>
                <div className="text-lg">010-9251-9743</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition duration-300">
              42단계 무료 진단
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition duration-300">
              전문가 상담 예약
            </button>
          </div>

          <div className="bg-gradient-to-r from-emerald-800 to-blue-800 p-6 rounded-xl">
            <h4 className="text-xl font-bold mb-4">🎁 런칭 기념 특별 혜택</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-emerald-300">선착순 10개사 한정</div>
                <div>진단 + 상담 완전 무료</div>
              </div>
              <div>
                <div className="font-semibold text-blue-300">7월 계약 체결</div>
                <div>서비스 비용 30% 할인</div>
              </div>
              <div>
                <div className="font-semibold text-purple-300">세무사 동반 신청</div>
                <div>추가 10% 할인 제공</div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>모든 서비스는 Business Model Zen 5단계 프레임워크를 기반으로 하며,</p>
            <p>세무사와의 협업을 통해 고객 기업의 세제혜택 극대화와 지속가능한 성장을 지원합니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
} 