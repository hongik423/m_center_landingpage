import jsPDF from 'jspdf';

// 한글 폰트 설정을 위한 유틸리티
const addKoreanSupport = (doc: jsPDF) => {
  // 기본 폰트 설정 (한글 지원)
  doc.setFont('helvetica');
};

// 공통 PDF 스타일 설정
const setPdfStyles = (doc: jsPDF) => {
  addKoreanSupport(doc);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
};

// 헤더 추가 함수
const addHeader = (doc: jsPDF, title: string) => {
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // blue-600
  doc.text(title, 20, 30);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('M-CENTER 경영지도센터', 20, 45);
  doc.text('Tel: 010-9251-9743 | Email: hongik423@gmail.com', 20, 55);
  
  // 구분선
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 65, 190, 65);
  
  return 75; // 다음 콘텐츠 시작 Y 위치
};

// 푸터 추가 함수
const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`© 2025 M-CENTER. All rights reserved. | Page ${i} of ${pageCount}`, 20, 285);
  }
};

// 1. 서비스 가이드북 PDF 생성
export const generateServiceGuideBook = () => {
  const doc = new jsPDF();
  setPdfStyles(doc);
  
  let yPos = addHeader(doc, 'M-CENTER 서비스 가이드북');
  
  // 목차
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('목차', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  const toc = [
    '1. M-CENTER 소개',
    '2. 6대 핵심 서비스',
    '3. 기업 성장 4단계 프레임워크',
    '4. 서비스 신청 방법',
    '5. 정부지원 프로그램',
    '6. 문의 및 상담'
  ];
  
  toc.forEach((item) => {
    doc.text(item, 25, yPos);
    yPos += 8;
  });
  
  yPos += 10;
  
  // 1. M-CENTER 소개
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('1. M-CENTER 소개', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const intro = [
    'M-CENTER 경영지도센터는 Business Model Zen 프레임워크를 기반으로',
    '기업의 성장 단계별 맞춤형 솔루션을 제공하는 전문 컨설팅 기관입니다.',
    '',
    '• 25년 실무 경험의 전문가 팀',
    '• AI 기술과 전통적 컨설팅의 융합',
    '• 정부지원 프로그램과의 완벽한 연계',
    '• 성과 보장 시스템 운영'
  ];
  
  intro.forEach((line) => {
    doc.text(line, 25, yPos);
    yPos += 8;
  });
  
  yPos += 10;
  
  // 2. 6대 핵심 서비스
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('2. 6대 핵심 서비스', 20, yPos);
  yPos += 15;
  
  const services = [
    {
      title: '프리미엄 사업분석',
      desc: '• 신규사업 성공률 95%\n• 매출 4배 증가 보장\n• BM ZEN 5단계 프레임워크 적용'
    },
    {
      title: 'AI 활용 생산성향상',
      desc: '• 업무 효율성 40% 향상\n• 정부 100% 지원 가능\n• 20주 집중 프로그램'
    },
    {
      title: '경매활용 공장구매',
      desc: '• 시장가 대비 40% 절약\n• 전문가 동행 서비스\n• 완전 위탁 진행'
    },
    {
      title: '기술사업화/창업',
      desc: '• 평균 5억원 자금 확보\n• 성공률 85%\n• 3년 사후관리'
    },
    {
      title: '프리미엄 인증지원',
      desc: '• 연간 5천만원 세제혜택\n• 벤처·ISO·ESG 통합 인증\n• 100% 취득 보장'
    },
    {
      title: '디지털 혁신',
      desc: '• 온라인 매출 30% 증대\n• 지능형 최적화\n• 무료 1년 관리'
    }
  ];
  
  services.forEach((service) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`[${service.title}]`, 25, yPos);
    yPos += 8;
    
    const lines = service.desc.split('\n');
    lines.forEach((line) => {
      doc.text(line, 30, yPos);
      yPos += 6;
    });
    yPos += 5;
  });
  
  // 새 페이지 - 성장 단계
  doc.addPage();
  yPos = 20;
  
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('3. 기업 성장 4단계 프레임워크', 20, yPos);
  yPos += 15;
  
  const stages = [
    {
      stage: 'Step 1 (1-3년): 기반 구축',
      services: '창업자금, 기본인증, 신뢰도 구축',
      effect: '안정적 사업 기반 마련'
    },
    {
      stage: 'Step 2 (3-7년): 성장 가속화',
      services: '조직확장, 기술고도화, 매출확대',
      effect: '본격적인 성장 궤도 진입'
    },
    {
      stage: 'Step 3 (7-10년): 시장 지배력',
      services: '혁신도입, 글로벌진출, 생태계구축',
      effect: '업계 리더십 확보'
    },
    {
      stage: 'Step 4 (10년+): 지속가능 혁신',
      services: '디지털전환, 사회적책임, 미래준비',
      effect: '지속가능한 가치 창출'
    }
  ];
  
  stages.forEach((stage) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(stage.stage, 25, yPos);
    yPos += 8;
    doc.text(`핵심 서비스: ${stage.services}`, 30, yPos);
    yPos += 6;
    doc.text(`기대 효과: ${stage.effect}`, 30, yPos);
    yPos += 15;
  });
  
  // 문의 정보
  yPos += 20;
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('6. 문의 및 상담', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('전화: 010-9251-9743', 25, yPos);
  yPos += 8;
  doc.text('이메일: hongik423@gmail.com', 25, yPos);
  yPos += 8;
  doc.text('웹사이트: https://m-center-landingpage.vercel.app', 25, yPos);
  
  addFooter(doc);
  doc.save('M-CENTER_서비스가이드북.pdf');
};

// 2. AI 활용 매뉴얼 PDF 생성
export const generateAIManual = () => {
  const doc = new jsPDF();
  setPdfStyles(doc);
  
  let yPos = addHeader(doc, 'AI 활용 실무 매뉴얼');
  
  // 목차
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('목차', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  const toc = [
    '1. AI 도입 준비사항',
    '2. ChatGPT 업무 활용법',
    '3. 생산성 향상 도구',
    '4. 자동화 프로세스',
    '5. 실무 적용 사례',
    '6. 주의사항 및 보안'
  ];
  
  toc.forEach((item) => {
    doc.text(item, 25, yPos);
    yPos += 8;
  });
  
  yPos += 10;
  
  // 1. AI 도입 준비사항
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('1. AI 도입 준비사항', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const preparation = [
    '1.1 조직 준비도 체크리스트',
    '• 경영진의 AI 도입 의지 확인',
    '• 직원들의 디지털 리터러시 수준 파악',
    '• 기존 업무 프로세스 문서화',
    '• 데이터 보안 정책 수립',
    '',
    '1.2 초기 투자 계획',
    '• AI 도구 라이선스 비용: 월 10-50만원',
    '• 직원 교육 비용: 1회 200-500만원',
    '• 시스템 연동 비용: 500-2000만원',
    '• 예상 ROI: 6개월 내 300% 이상'
  ];
  
  preparation.forEach((line) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 25, yPos);
    yPos += 8;
  });
  
  yPos += 10;
  
  // 2. ChatGPT 업무 활용법
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('2. ChatGPT 업무 활용법', 20, yPos);
  yPos += 15;
  
  const chatgptUsage = [
    '2.1 문서 작성 자동화',
    '• 보고서 초안 작성: "다음 데이터를 바탕으로 월간 보고서 작성해줘"',
    '• 이메일 템플릿: "고객 문의 응답 이메일 템플릿 만들어줘"',
    '• 제안서 구성: "IT 솔루션 제안서 목차와 구성 제안해줘"',
    '',
    '2.2 데이터 분석 지원',
    '• 엑셀 함수 생성: "매출 증가율 계산하는 엑셀 함수 만들어줘"',
    '• 차트 해석: "이 그래프가 의미하는 바를 분석해줘"',
    '• 트렌드 예측: "이 데이터 패턴으로 다음 분기 예측해줘"',
    '',
    '2.3 창의적 업무 지원',
    '• 브레인스토밍: "신제품 아이디어 10가지 제안해줘"',
    '• 마케팅 메시지: "20-30대 타겟 광고 문구 만들어줘"',
    '• 문제 해결: "이런 상황에서 가능한 해결책들 제시해줘"'
  ];
  
  chatgptUsage.forEach((line) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 25, yPos);
    yPos += 7;
  });
  
  // 새 페이지 - 생산성 도구
  doc.addPage();
  yPos = 20;
  
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('3. 생산성 향상 도구', 20, yPos);
  yPos += 15;
  
  const productivityTools = [
    '3.1 필수 AI 도구 목록',
    '• ChatGPT Plus (월 $20): 문서작성, 분석, 창작',
    '• Claude Pro (월 $20): 긴 문서 분석, 코딩 지원',
    '• Midjourney (월 $10): 이미지 생성, 디자인',
    '• Notion AI (월 $10): 문서 관리, 노트 정리',
    '',
    '3.2 업무별 최적 도구',
    '• 마케팅: ChatGPT + Canva AI + Copy.ai',
    '• 재무/회계: ChatGPT + Excel Copilot',
    '• 인사관리: ChatGPT + Calendly AI',
    '• 고객서비스: ChatGPT + Zendesk AI',
    '',
    '3.3 도입 우선순위',
    '1순위: ChatGPT (모든 부서)',
    '2순위: Excel/Google Sheets AI 기능',
    '3순위: 부서별 전문 AI 도구',
    '4순위: 자동화 플랫폼 연동'
  ];
  
  productivityTools.forEach((line) => {
    doc.text(line, 25, yPos);
    yPos += 8;
  });
  
  yPos += 20;
  
  // 보안 주의사항
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 127); // pink-600
  doc.text('6. 주의사항 및 보안', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const security = [
    '⚠️ 절대 입력하면 안 되는 정보',
    '• 개인정보 (주민번호, 신용카드 정보)',
    '• 기업 기밀 (매출액, 고객 리스트)',
    '• 비밀번호 및 인증 정보',
    '• 계약서 원본 내용',
    '',
    '✅ 안전한 활용법',
    '• 일반적인 업무 패턴이나 템플릿 요청',
    '• 공개된 정보 기반 분석',
    '• 가상의 예시로 설명 요청',
    '• 업무 프로세스 개선 아이디어'
  ];
  
  security.forEach((line) => {
    doc.text(line, 25, yPos);
    yPos += 8;
  });
  
  addFooter(doc);
  doc.save('M-CENTER_AI활용매뉴얼.pdf');
};

// 3. 세금계산기 사용매뉴얼 PDF 생성
export const generateTaxCalculatorManual = () => {
  const doc = new jsPDF();
  setPdfStyles(doc);
  
  let yPos = addHeader(doc, '세금계산기 사용 매뉴얼');
  
  // 목차
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('목차', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  const toc = [
    '1. 세금계산기 개요',
    '2. 지원하는 세금 유형',
    '3. 사용법 단계별 가이드',
    '4. 계산 결과 해석',
    '5. 주의사항',
    '6. 문의 및 지원'
  ];
  
  toc.forEach((item) => {
    doc.text(item, 25, yPos);
    yPos += 8;
  });
  
  yPos += 10;
  
  // 1. 개요
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('1. 세금계산기 개요', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const overview = [
    'M-CENTER 세금계산기는 기업과 개인이 각종 세금을 쉽고 정확하게',
    '계산할 수 있도록 개발된 전문 도구입니다.',
    '',
    '특징:',
    '• 2024년 최신 세법 적용',
    '• 실시간 계산 및 결과 제공',
    '• 상세한 계산 과정 표시',
    '• PDF 결과 다운로드 지원',
    '• 전문가 검증 완료'
  ];
  
  overview.forEach((line) => {
    doc.text(line, 25, yPos);
    yPos += 8;
  });
  
  yPos += 10;
  
  // 2. 지원하는 세금 유형
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('2. 지원하는 세금 유형', 20, yPos);
  yPos += 15;
  
  const taxTypes = [
    '2.1 개인 관련 세금',
    '• 종합소득세 계산기',
    '• 근로소득세 계산기',
    '• 양도소득세 계산기',
    '• 상속세 계산기',
    '• 증여세 계산기',
    '',
    '2.2 기업 관련 세금',
    '• 법인세 계산기',
    '• 부가가치세 계산기',
    '• 원천징수세 계산기',
    '• 주식양도소득세 계산기',
    '• 사업승계 계산기'
  ];
  
  taxTypes.forEach((line) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 25, yPos);
    yPos += 8;
  });
  
  yPos += 10;
  
  // 3. 사용법 가이드
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('3. 사용법 단계별 가이드', 20, yPos);
  yPos += 15;
  
  const userGuide = [
    '3.1 기본 사용법',
    '1단계: 메인 페이지에서 "세금계산기" 메뉴 클릭',
    '2단계: 계산하고자 하는 세금 유형 선택',
    '3단계: 필요한 정보 입력 (소득, 자산 등)',
    '4단계: "계산하기" 버튼 클릭',
    '5단계: 결과 확인 및 PDF 다운로드',
    '',
    '3.2 정확한 계산을 위한 팁',
    '• 모든 필수 항목을 빠짐없이 입력',
    '• 금액은 원 단위까지 정확히 입력',
    '• 공제 항목은 증빙서류 기준으로 입력',
    '• 불확실한 내용은 전문가 상담 활용',
    '',
    '3.3 입력 정보 예시',
    '• 연봉: 실제 근로계약서상 금액',
    '• 부양가족: 실제 부양하는 가족 수',
    '• 공제액: 연말정산 시 적용된 공제액',
    '• 기타소득: 강의료, 원고료 등 합계액'
  ];
  
  userGuide.forEach((line) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 25, yPos);
    yPos += 7;
  });
  
  // 새 페이지 - 결과 해석
  doc.addPage();
  yPos = 20;
  
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('4. 계산 결과 해석', 20, yPos);
  yPos += 15;
  
  const resultInterpretation = [
    '4.1 결과 화면 구성',
    '• 세액 계산 과정: 단계별 계산 내역 표시',
    '• 최종 납부세액: 실제 납부해야 할 세금',
    '• 공제 혜택: 적용된 각종 공제 내역',
    '• 절세 팁: 추가 절세 가능한 방법 제안',
    '',
    '4.2 주요 용어 설명',
    '• 과세표준: 실제 세금이 부과되는 소득금액',
    '• 산출세액: 세율을 적용하여 계산된 세액',
    '• 결정세액: 각종 공제를 적용한 최종 세액',
    '• 납부할세액: 기납부세액을 차감한 실납부액',
    '',
    '4.3 결과 활용법',
    '• 세무신고 시 참고자료로 활용',
    '• 재무계획 수립 시 세금 예상액 산정',
    '• 절세 전략 수립의 기초 데이터로 활용',
    '• 전문가 상담 시 사전 자료로 제공'
  ];
  
  resultInterpretation.forEach((line) => {
    doc.text(line, 25, yPos);
    yPos += 8;
  });
  
  yPos += 20;
  
  // 주의사항
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 127); // pink-600
  doc.text('5. 주의사항', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const warnings = [
    '⚠️ 중요한 주의사항',
    '• 본 계산기는 참고용이며, 실제 세무신고와 차이가 있을 수 있습니다',
    '• 복잡한 사안은 반드시 세무 전문가와 상담하시기 바랍니다',
    '• 세법 개정으로 인한 변경사항은 실시간 반영됩니다',
    '• 계산 결과에 대한 법적 책임은 지지 않습니다',
    '',
    '✅ 정확한 계산을 위해',
    '• 최신 소득자료를 기준으로 입력',
    '• 모든 공제 항목을 빠짐없이 확인',
    '• 특수한 상황은 전문가 상담 필수',
    '• 정기적으로 계산 결과 업데이트'
  ];
  
  warnings.forEach((line) => {
    doc.text(line, 25, yPos);
    yPos += 8;
  });
  
  addFooter(doc);
  doc.save('M-CENTER_세금계산기_사용매뉴얼.pdf');
}; 