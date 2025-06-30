// HTML을 PDF로 변환하는 방식으로 한글 지원 개선
// jsPDF 대신 브라우저의 print 기능을 활용

// 공통 PDF 스타일 정의
const getPdfStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #333;
      background: white;
      padding: 20mm;
    }
    
    @page {
      size: A4;
      margin: 20mm;
    }
    
    @media print {
      body { -webkit-print-color-adjust: exact; }
      .page-break { page-break-before: always; }
      .no-break { page-break-inside: avoid; }
    }
    
    .header {
      text-align: center;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .header h1 {
      color: #3b82f6;
      font-size: 24pt;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .header .company {
      color: #666;
      font-size: 14pt;
      margin-bottom: 5px;
    }
    
    .header .contact {
      color: #666;
      font-size: 11pt;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      color: #3b82f6;
      font-size: 16pt;
      font-weight: 700;
      margin-bottom: 15px;
      border-left: 4px solid #3b82f6;
      padding-left: 10px;
    }
    
    .subsection-title {
      color: #1f2937;
      font-size: 14pt;
      font-weight: 600;
      margin: 20px 0 10px 0;
    }
    
    .content {
      margin-left: 20px;
      margin-bottom: 15px;
    }
    
    .content ul {
      margin-left: 20px;
    }
    
    .content li {
      margin-bottom: 5px;
    }
    
    .highlight {
      background-color: #f0f9ff;
      border-left: 3px solid #3b82f6;
      padding: 15px;
      margin: 15px 0;
    }
    
    .warning {
      background-color: #fef2f2;
      border-left: 3px solid #ef4444;
      padding: 15px;
      margin: 15px 0;
      color: #7f1d1d;
    }
    
    .success {
      background-color: #f0fdf4;
      border-left: 3px solid #22c55e;
      padding: 15px;
      margin: 15px 0;
      color: #14532d;
    }
    
    .toc {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .toc h3 {
      color: #1f2937;
      font-size: 14pt;
      margin-bottom: 15px;
    }
    
    .toc ul {
      list-style: none;
      margin-left: 0;
    }
    
    .toc li {
      padding: 5px 0;
      border-bottom: 1px dotted #cbd5e0;
    }
    
    .toc li:last-child {
      border-bottom: none;
    }
    
    .footer {
      position: fixed;
      bottom: 15mm;
      left: 20mm;
      right: 20mm;
      text-align: center;
      color: #9ca3af;
      font-size: 10pt;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
    }
    
    .service-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      background-color: #fafafa;
    }
    
    .service-title {
      color: #1f2937;
      font-weight: 600;
      font-size: 13pt;
      margin-bottom: 8px;
    }
    
    .step-box {
      background-color: #f1f5f9;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      padding: 12px;
      margin: 10px 0;
    }
    
    .emoji {
      font-size: 16pt;
      margin-right: 8px;
    }
  </style>
`;

// PDF 생성을 위한 HTML 템플릿 함수
const generatePdfFromHtml = (htmlContent: string, filename: string) => {
  // 새 창에서 PDF 생성
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('팝업이 차단되었습니다. 팝업을 허용해주세요.');
    return;
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${filename}</title>
      ${getPdfStyles()}
    </head>
    <body>
      ${htmlContent}
      <div class="footer">
        © 2025 M-CENTER 경영지도센터. All rights reserved. | Tel: 010-9251-9743 | Email: hongik423@gmail.com
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // 폰트가 로드된 후 인쇄 실행
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    
    // 인쇄 후 창 닫기 (사용자가 취소하는 경우도 고려)
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  }, 1000);
};

// 1. 서비스 가이드북 PDF 생성
export const generateServiceGuideBook = () => {
  const htmlContent = `
    <div class="header">
      <h1>🏢 M-CENTER 서비스 가이드북</h1>
      <div class="company">M-CENTER 경영지도센터</div>
      <div class="contact">Tel: 010-9251-9743 | Email: hongik423@gmail.com</div>
    </div>

    <div class="toc">
      <h3>📋 목차</h3>
      <ul>
        <li>1. M-CENTER 소개</li>
        <li>2. 6대 핵심 서비스</li>
        <li>3. 기업 성장 4단계 프레임워크</li>
        <li>4. 서비스 신청 방법</li>
        <li>5. 정부지원 프로그램</li>
        <li>6. 문의 및 상담</li>
      </ul>
    </div>

    <div class="section">
      <h2 class="section-title">1. 🚀 M-CENTER 소개</h2>
      <div class="content">
        <p><strong>M-CENTER 경영지도센터</strong>는 Business Model Zen 프레임워크를 기반으로 기업의 성장 단계별 맞춤형 솔루션을 제공하는 전문 컨설팅 기관입니다.</p>
        
        <div class="highlight">
          <h4>🎯 우리의 강점</h4>
          <ul>
            <li><strong>25년 실무 경험</strong>의 전문가 팀</li>
            <li><strong>AI 기술과 전통적 컨설팅</strong>의 완벽한 융합</li>
            <li><strong>정부지원 프로그램</strong>과의 완벽한 연계</li>
            <li><strong>성과 보장 시스템</strong> 운영</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">2. ⭐ 6대 핵심 서비스</h2>
      <div class="content">
        
        <div class="service-card">
          <div class="service-title">📊 프리미엄 사업분석</div>
          <ul>
            <li>신규사업 성공률 <strong>95%</strong></li>
            <li>매출 <strong>4배 증가</strong> 보장</li>
            <li>BM ZEN 5단계 프레임워크 적용</li>
          </ul>
        </div>

        <div class="service-card">
          <div class="service-title">🤖 AI 활용 생산성향상</div>
          <ul>
            <li>업무 효율성 <strong>40% 향상</strong></li>
            <li>정부 <strong>100% 지원</strong> 가능</li>
            <li><strong>20주 집중</strong> 프로그램</li>
          </ul>
        </div>

        <div class="service-card">
          <div class="service-title">🏭 경매활용 공장구매</div>
          <ul>
            <li>시장가 대비 <strong>40% 절약</strong></li>
            <li><strong>전문가 동행</strong> 서비스</li>
            <li><strong>완전 위탁</strong> 진행</li>
          </ul>
        </div>

        <div class="service-card">
          <div class="service-title">🚀 기술사업화/창업</div>
          <ul>
            <li>평균 <strong>5억원 자금</strong> 확보</li>
            <li>성공률 <strong>85%</strong></li>
            <li><strong>3년 사후관리</strong></li>
          </ul>
        </div>

        <div class="service-card">
          <div class="service-title">🏆 프리미엄 인증지원</div>
          <ul>
            <li>연간 <strong>5천만원 세제혜택</strong></li>
            <li><strong>벤처·ISO·ESG</strong> 통합 인증</li>
            <li><strong>100% 취득</strong> 보장</li>
          </ul>
        </div>

        <div class="service-card">
          <div class="service-title">🌐 디지털 혁신</div>
          <ul>
            <li>온라인 매출 <strong>30% 증대</strong></li>
            <li><strong>지능형 최적화</strong></li>
            <li><strong>무료 1년 관리</strong></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="page-break"></div>
    
    <div class="section">
      <h2 class="section-title">3. 📈 기업 성장 4단계 프레임워크</h2>
      <div class="content">
        
        <div class="step-box">
          <h4><span class="emoji">🌱</span>Step 1 (1-3년): 기반 구축</h4>
          <p><strong>핵심 서비스:</strong> 창업자금, 기본인증, 신뢰도 구축</p>
          <p><strong>기대 효과:</strong> 안정적 사업 기반 마련</p>
        </div>

        <div class="step-box">
          <h4><span class="emoji">🚀</span>Step 2 (3-7년): 성장 가속화</h4>
          <p><strong>핵심 서비스:</strong> 조직확장, 기술고도화, 매출확대</p>
          <p><strong>기대 효과:</strong> 본격적인 성장 궤도 진입</p>
        </div>

        <div class="step-box">
          <h4><span class="emoji">👑</span>Step 3 (7-10년): 시장 지배력</h4>
          <p><strong>핵심 서비스:</strong> 혁신도입, 글로벌진출, 생태계구축</p>
          <p><strong>기대 효과:</strong> 업계 리더십 확보</p>
        </div>

        <div class="step-box">
          <h4><span class="emoji">♻️</span>Step 4 (10년+): 지속가능 혁신</h4>
          <p><strong>핵심 서비스:</strong> 디지털전환, 사회적책임, 미래준비</p>
          <p><strong>기대 효과:</strong> 지속가능한 가치 창출</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">4. 📞 서비스 신청 방법</h2>
      <div class="content">
        <div class="success">
          <h4>🎯 간편한 3단계 신청</h4>
          <ol>
            <li><strong>온라인 상담신청:</strong> 웹사이트에서 간단한 정보 입력</li>
            <li><strong>전문가 상담:</strong> 24시간 내 전문가가 연락</li>
            <li><strong>맞춤 솔루션 제공:</strong> 기업 상황에 최적화된 서비스 진행</li>
          </ol>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">5. 💰 정부지원 프로그램</h2>
      <div class="content">
        <div class="highlight">
          <h4>🏛️ 주요 정부지원 프로그램</h4>
          <ul>
            <li><strong>AI 생산성향상:</strong> 정부 100% 지원</li>
            <li><strong>기술창업:</strong> 평균 5억원 자금지원</li>
            <li><strong>벤처확인:</strong> 연간 5천만원 세제혜택</li>
            <li><strong>R&D 과제:</strong> 최대 30억원 지원</li>
            <li><strong>수출지원:</strong> 해외진출 비용 80% 지원</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">6. 📞 문의 및 상담</h2>
      <div class="content">
        <div class="service-card">
          <h4>🔥 즉시 상담 가능</h4>
          <p><strong>전화:</strong> 010-9251-9743</p>
          <p><strong>이메일:</strong> hongik423@gmail.com</p>
          <p><strong>웹사이트:</strong> https://m-center-landingpage.vercel.app</p>
          <p><strong>상담시간:</strong> 평일 09:00-18:00 (긴급상담 24시간)</p>
        </div>
        
        <div class="warning">
          <h4>⚡ 특별혜택</h4>
          <p>첫 상담 시 <strong>무료 기업진단</strong> 및 <strong>맞춤형 성장전략</strong>을 제공해드립니다!</p>
        </div>
      </div>
    </div>
  `;
  
  generatePdfFromHtml(htmlContent, 'M-CENTER_서비스가이드북');
};

// 2. AI 활용 매뉴얼 PDF 생성
export const generateAIManual = () => {
  const htmlContent = `
    <div class="header">
      <h1>🤖 AI 활용 실무 매뉴얼</h1>
      <div class="company">M-CENTER 경영지도센터</div>
      <div class="contact">Tel: 010-9251-9743 | Email: hongik423@gmail.com</div>
    </div>

    <div class="toc">
      <h3>📋 목차</h3>
      <ul>
        <li>1. AI 도입 준비사항</li>
        <li>2. ChatGPT 업무 활용법</li>
        <li>3. 생산성 향상 도구</li>
        <li>4. 자동화 프로세스</li>
        <li>5. 실무 적용 사례</li>
        <li>6. 주의사항 및 보안</li>
      </ul>
    </div>

    <div class="section">
      <h2 class="section-title">1. ⚡ AI 도입 준비사항</h2>
      <div class="content">
        
        <h3 class="subsection-title">1.1 조직 준비도 체크리스트</h3>
        <div class="service-card">
          <ul>
            <li>✅ 경영진의 AI 도입 의지 확인</li>
            <li>✅ 직원들의 디지털 리터러시 수준 파악</li>
            <li>✅ 기존 업무 프로세스 문서화</li>
            <li>✅ 데이터 보안 정책 수립</li>
          </ul>
        </div>

        <h3 class="subsection-title">1.2 초기 투자 계획</h3>
        <div class="highlight">
          <ul>
            <li><strong>AI 도구 라이선스 비용:</strong> 월 10-50만원</li>
            <li><strong>직원 교육 비용:</strong> 1회 200-500만원</li>
            <li><strong>시스템 연동 비용:</strong> 500-2000만원</li>
            <li><strong>예상 ROI:</strong> 6개월 내 300% 이상</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">2. 💬 ChatGPT 업무 활용법</h2>
      <div class="content">
        
        <h3 class="subsection-title">2.1 문서 작성 자동화</h3>
        <div class="service-card">
          <ul>
            <li><strong>보고서 초안 작성:</strong> "다음 데이터를 바탕으로 월간 보고서 작성해줘"</li>
            <li><strong>이메일 템플릿:</strong> "고객 문의 응답 이메일 템플릿 만들어줘"</li>
            <li><strong>제안서 구성:</strong> "IT 솔루션 제안서 목차와 구성 제안해줘"</li>
          </ul>
        </div>

        <h3 class="subsection-title">2.2 데이터 분석 지원</h3>
        <div class="service-card">
          <ul>
            <li><strong>엑셀 함수 생성:</strong> "매출 증가율 계산하는 엑셀 함수 만들어줘"</li>
            <li><strong>차트 해석:</strong> "이 그래프가 의미하는 바를 분석해줘"</li>
            <li><strong>트렌드 예측:</strong> "이 데이터 패턴으로 다음 분기 예측해줘"</li>
          </ul>
        </div>

        <h3 class="subsection-title">2.3 창의적 업무 지원</h3>
        <div class="service-card">
          <ul>
            <li><strong>브레인스토밍:</strong> "신제품 아이디어 10가지 제안해줘"</li>
            <li><strong>마케팅 메시지:</strong> "20-30대 타겟 광고 문구 만들어줘"</li>
            <li><strong>문제 해결:</strong> "이런 상황에서 가능한 해결책들 제시해줘"</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="page-break"></div>

    <div class="section">
      <h2 class="section-title">3. 🛠️ 생산성 향상 도구</h2>
      <div class="content">
        
        <h3 class="subsection-title">3.1 필수 AI 도구 목록</h3>
        <div class="service-card">
          <ul>
            <li><strong>ChatGPT Plus (월 $20):</strong> 문서작성, 분석, 창작</li>
            <li><strong>Claude Pro (월 $20):</strong> 긴 문서 분석, 코딩 지원</li>
            <li><strong>Midjourney (월 $10):</strong> 이미지 생성, 디자인</li>
            <li><strong>Notion AI (월 $10):</strong> 문서 관리, 노트 정리</li>
          </ul>
        </div>

        <h3 class="subsection-title">3.2 업무별 최적 도구</h3>
        <div class="service-card">
          <ul>
            <li><strong>마케팅:</strong> ChatGPT + Canva AI + Copy.ai</li>
            <li><strong>재무/회계:</strong> ChatGPT + Excel Copilot</li>
            <li><strong>인사관리:</strong> ChatGPT + Calendly AI</li>
            <li><strong>고객서비스:</strong> ChatGPT + Zendesk AI</li>
          </ul>
        </div>

        <h3 class="subsection-title">3.3 도입 우선순위</h3>
        <div class="step-box">
          <ol>
            <li><strong>1순위:</strong> ChatGPT (모든 부서)</li>
            <li><strong>2순위:</strong> Excel/Google Sheets AI 기능</li>
            <li><strong>3순위:</strong> 부서별 전문 AI 도구</li>
            <li><strong>4순위:</strong> 자동화 플랫폼 연동</li>
          </ol>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">4. 🔄 자동화 프로세스</h2>
      <div class="content">
        
        <h3 class="subsection-title">4.1 업무 자동화 예시</h3>
        <div class="service-card">
          <ul>
            <li><strong>보고서 자동 생성:</strong> 데이터 입력 → AI 분석 → 자동 보고서 생성</li>
            <li><strong>고객 응답 자동화:</strong> 문의 접수 → AI 분석 → 자동 응답 또는 담당자 배정</li>
            <li><strong>일정 관리:</strong> 미팅 요청 → AI 최적 시간 제안 → 자동 예약</li>
          </ul>
        </div>

        <h3 class="subsection-title">4.2 예상 효과</h3>
        <div class="highlight">
          <ul>
            <li><strong>업무 시간 단축:</strong> 평균 40% 감소</li>
            <li><strong>오류 감소:</strong> 인적 오류 90% 감소</li>
            <li><strong>생산성 향상:</strong> 직원 1명당 월 50시간 절약</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">5. 💼 실무 적용 사례</h2>
      <div class="content">
        
        <div class="service-card">
          <h4>📊 A사 (제조업) - 생산관리 AI 도입</h4>
          <p><strong>적용 전:</strong> 수동 재고관리, 잦은 재고 부족/과잉</p>
          <p><strong>적용 후:</strong> AI 예측 기반 자동 발주, 재고 최적화 달성</p>
          <p><strong>결과:</strong> 재고비용 30% 절감, 생산 효율성 45% 향상</p>
        </div>

        <div class="service-card">
          <h4>💻 B사 (IT서비스) - 고객지원 AI 도입</h4>
          <p><strong>적용 전:</strong> 고객 문의 처리 시간 평균 2시간</p>
          <p><strong>적용 후:</strong> AI 1차 응답 + 복잡한 문의만 인력 처리</p>
          <p><strong>결과:</strong> 응답시간 80% 단축, 고객만족도 25% 향상</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">6. ⚠️ 주의사항 및 보안</h2>
      <div class="content">
        
        <div class="warning">
          <h4>🚫 절대 입력하면 안 되는 정보</h4>
          <ul>
            <li>개인정보 (주민번호, 신용카드 정보)</li>
            <li>기업 기밀 (매출액, 고객 리스트)</li>
            <li>비밀번호 및 인증 정보</li>
            <li>계약서 원본 내용</li>
          </ul>
        </div>

        <div class="success">
          <h4>✅ 안전한 활용법</h4>
          <ul>
            <li>일반적인 업무 패턴이나 템플릿 요청</li>
            <li>공개된 정보 기반 분석</li>
            <li>가상의 예시로 설명 요청</li>
            <li>업무 프로세스 개선 아이디어</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  
  generatePdfFromHtml(htmlContent, 'M-CENTER_AI활용매뉴얼');
};

// 3. 세금계산기 사용매뉴얼 PDF 생성
export const generateTaxCalculatorManual = () => {
  const htmlContent = `
    <div class="header">
      <h1>💰 세금계산기 사용 매뉴얼</h1>
      <div class="company">M-CENTER 경영지도센터</div>
      <div class="contact">Tel: 010-9251-9743 | Email: hongik423@gmail.com</div>
    </div>

    <div class="toc">
      <h3>📋 목차</h3>
      <ul>
        <li>1. 세금계산기 개요</li>
        <li>2. 지원하는 세금 유형</li>
        <li>3. 사용법 단계별 가이드</li>
        <li>4. 계산 결과 해석</li>
        <li>5. 주의사항</li>
        <li>6. 문의 및 지원</li>
      </ul>
    </div>

    <div class="section">
      <h2 class="section-title">1. 🎯 세금계산기 개요</h2>
      <div class="content">
        <p><strong>M-CENTER 세금계산기</strong>는 기업과 개인이 각종 세금을 쉽고 정확하게 계산할 수 있도록 개발된 전문 도구입니다.</p>
        
        <div class="highlight">
          <h4>✨ 주요 특징</h4>
          <ul>
            <li><strong>2024년 최신 세법</strong> 적용</li>
            <li><strong>실시간 계산</strong> 및 결과 제공</li>
            <li><strong>상세한 계산 과정</strong> 표시</li>
            <li><strong>PDF 결과 다운로드</strong> 지원</li>
            <li><strong>전문가 검증</strong> 완료</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">2. 📊 지원하는 세금 유형</h2>
      <div class="content">
        
        <h3 class="subsection-title">2.1 개인 관련 세금</h3>
        <div class="service-card">
          <ul>
            <li>💼 <strong>종합소득세 계산기</strong></li>
            <li>💰 <strong>근로소득세 계산기</strong></li>
            <li>🏠 <strong>양도소득세 계산기</strong></li>
            <li>👨‍👩‍👧‍👦 <strong>상속세 계산기</strong></li>
            <li>🎁 <strong>증여세 계산기</strong></li>
          </ul>
        </div>

        <h3 class="subsection-title">2.2 기업 관련 세금</h3>
        <div class="service-card">
          <ul>
            <li>🏢 <strong>법인세 계산기</strong></li>
            <li>🧾 <strong>부가가치세 계산기</strong></li>
            <li>📝 <strong>원천징수세 계산기</strong></li>
            <li>📈 <strong>주식양도소득세 계산기</strong></li>
            <li>🔄 <strong>사업승계 계산기</strong></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">3. 📋 사용법 단계별 가이드</h2>
      <div class="content">
        
        <h3 class="subsection-title">3.1 기본 사용법</h3>
        <div class="step-box">
          <ol>
            <li><strong>1단계:</strong> 메인 페이지에서 "세금계산기" 메뉴 클릭</li>
            <li><strong>2단계:</strong> 계산하고자 하는 세금 유형 선택</li>
            <li><strong>3단계:</strong> 필요한 정보 입력 (소득, 자산 등)</li>
            <li><strong>4단계:</strong> "계산하기" 버튼 클릭</li>
            <li><strong>5단계:</strong> 결과 확인 및 PDF 다운로드</li>
          </ol>
        </div>

        <h3 class="subsection-title">3.2 정확한 계산을 위한 팁</h3>
        <div class="success">
          <ul>
            <li>✅ 모든 필수 항목을 빠짐없이 입력</li>
            <li>✅ 금액은 원 단위까지 정확히 입력</li>
            <li>✅ 공제 항목은 증빙서류 기준으로 입력</li>
            <li>✅ 불확실한 내용은 전문가 상담 활용</li>
          </ul>
        </div>

        <h3 class="subsection-title">3.3 입력 정보 예시</h3>
        <div class="service-card">
          <ul>
            <li><strong>연봉:</strong> 실제 근로계약서상 금액</li>
            <li><strong>부양가족:</strong> 실제 부양하는 가족 수</li>
            <li><strong>공제액:</strong> 연말정산 시 적용된 공제액</li>
            <li><strong>기타소득:</strong> 강의료, 원고료 등 합계액</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="page-break"></div>

    <div class="section">
      <h2 class="section-title">4. 📈 계산 결과 해석</h2>
      <div class="content">
        
        <h3 class="subsection-title">4.1 결과 화면 구성</h3>
        <div class="service-card">
          <ul>
            <li><strong>세액 계산 과정:</strong> 단계별 계산 내역 표시</li>
            <li><strong>최종 납부세액:</strong> 실제 납부해야 할 세금</li>
            <li><strong>공제 혜택:</strong> 적용된 각종 공제 내역</li>
            <li><strong>절세 팁:</strong> 추가 절세 가능한 방법 제안</li>
          </ul>
        </div>

        <h3 class="subsection-title">4.2 주요 용어 설명</h3>
        <div class="service-card">
          <ul>
            <li><strong>과세표준:</strong> 실제 세금이 부과되는 소득금액</li>
            <li><strong>산출세액:</strong> 세율을 적용하여 계산된 세액</li>
            <li><strong>결정세액:</strong> 각종 공제를 적용한 최종 세액</li>
            <li><strong>납부할세액:</strong> 기납부세액을 차감한 실납부액</li>
          </ul>
        </div>

        <h3 class="subsection-title">4.3 결과 활용법</h3>
        <div class="highlight">
          <ul>
            <li>📝 세무신고 시 참고자료로 활용</li>
            <li>📊 재무계획 수립 시 세금 예상액 산정</li>
            <li>💡 절세 전략 수립의 기초 데이터로 활용</li>
            <li>👨‍💼 전문가 상담 시 사전 자료로 제공</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">5. ⚠️ 주의사항</h2>
      <div class="content">
        
        <div class="warning">
          <h4>🚨 중요한 주의사항</h4>
          <ul>
            <li>본 계산기는 <strong>참고용</strong>이며, 실제 세무신고와 차이가 있을 수 있습니다</li>
            <li>복잡한 사안은 반드시 <strong>세무 전문가와 상담</strong>하시기 바랍니다</li>
            <li>세법 개정으로 인한 변경사항은 <strong>실시간 반영</strong>됩니다</li>
            <li>계산 결과에 대한 <strong>법적 책임은 지지 않습니다</strong></li>
          </ul>
        </div>

        <div class="success">
          <h4>✅ 정확한 계산을 위해</h4>
          <ul>
            <li>최신 소득자료를 기준으로 입력</li>
            <li>모든 공제 항목을 빠짐없이 확인</li>
            <li>특수한 상황은 전문가 상담 필수</li>
            <li>정기적으로 계산 결과 업데이트</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">6. 💬 문의 및 지원</h2>
      <div class="content">
        <div class="service-card">
          <h4>🔥 전문가 상담</h4>
          <p><strong>전화:</strong> 010-9251-9743</p>
          <p><strong>이메일:</strong> hongik423@gmail.com</p>
          <p><strong>웹사이트:</strong> https://m-center-landingpage.vercel.app</p>
          <p><strong>상담시간:</strong> 평일 09:00-18:00</p>
        </div>
        
        <div class="highlight">
          <h4>🎁 무료 서비스</h4>
          <ul>
            <li><strong>세무 상담:</strong> 계산 결과 해석 및 절세 방안</li>
            <li><strong>신고 지원:</strong> 세무신고 과정 안내</li>
            <li><strong>업데이트:</strong> 세법 변경사항 안내</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  
  generatePdfFromHtml(htmlContent, 'M-CENTER_세금계산기_사용매뉴얼');
}; 