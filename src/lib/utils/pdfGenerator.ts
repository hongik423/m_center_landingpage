'use client';

import { CONSULTANT_INFO, CONTACT_INFO } from '@/lib/config/branding';

/**
 * PDF 생성 유틸리티 클래스
 * 한글 지원을 위한 HTML → Canvas → PDF 방식
 */
export class PDFGenerator {
  private static jsPDF: any = null;
  private static html2canvas: any = null;
  private static initialized = false;
  private static initializePromise: Promise<void> | null = null;

  /**
   * PDF 라이브러리 초기화 (한 번만 실행)
   */
  private static async initializeLibraries(): Promise<void> {
    // 이미 초기화 중이라면 기다림
    if (this.initializePromise) {
      return this.initializePromise;
    }

    if (this.initialized) return;

    this.initializePromise = this._doInitialize();
    return this.initializePromise;
  }

  private static async _doInitialize(): Promise<void> {
    try {
      console.log('🔄 PDF 라이브러리 초기화 시작...');

      // 클라이언트 사이드에서만 실행
      if (typeof window === 'undefined') {
        throw new Error('PDF 생성은 클라이언트 사이드에서만 가능합니다.');
      }

      // 단계별로 라이브러리 로드
      console.log('📦 jsPDF 로드 중...');
      const jsPDFModule = await import('jspdf');
      console.log('📦 html2canvas 로드 중...');
      const html2canvasModule = await import('html2canvas');

      // jsPDF v3 호환 처리 (여러 방식 시도)
      this.jsPDF = (jsPDFModule as any).jsPDF || 
                   ((jsPDFModule as any).default && (jsPDFModule as any).default.jsPDF) || 
                   (jsPDFModule as any).default || 
                   jsPDFModule;

      this.html2canvas = html2canvasModule.default || html2canvasModule;

      console.log('📚 라이브러리 로드 상태:', {
        jsPDFType: typeof this.jsPDF,
        jsPDFExists: !!this.jsPDF,
        jsPDFConstructor: this.jsPDF && typeof this.jsPDF === 'function',
        html2canvasType: typeof this.html2canvas,
        html2canvasExists: !!this.html2canvas,
        html2canvasFunction: this.html2canvas && typeof this.html2canvas === 'function'
      });

      // 초기화 검증
      if (!this.jsPDF || typeof this.jsPDF !== 'function') {
        throw new Error('jsPDF 라이브러리 초기화 실패');
      }

      if (!this.html2canvas || typeof this.html2canvas !== 'function') {
        throw new Error('html2canvas 라이브러리 초기화 실패');
      }

      // 간단한 테스트로 라이브러리 작동 확인
      try {
        const testPdf = new this.jsPDF();
        console.log('✅ jsPDF 테스트 성공');
      } catch (testError) {
        console.error('jsPDF 테스트 실패:', testError);
        throw new Error('jsPDF 라이브러리 작동 확인 실패');
      }

      this.initialized = true;
      console.log('✅ PDF 라이브러리 초기화 완료');

    } catch (error) {
      console.error('❌ PDF 라이브러리 초기화 실패:', error);
      this.initialized = false;
      this.initializePromise = null;
      throw new Error(`PDF 라이브러리 로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 종합 진단 결과 PDF 생성 (HTML → Canvas → PDF)
   */
  static async generateDiagnosisPDF(diagnosis: any, options: {
    title?: string;
    companyName?: string;
    includeDetails?: boolean;
  } = {}): Promise<void> {
    try {
      console.log('📄 PDF 생성 요청:', { diagnosis: !!diagnosis, options });

      // 라이브러리 초기화
      await this.initializeLibraries();

      const {
        title = 'AI 기반 종합 경영진단 결과',
        companyName = diagnosis.companyName || '기업명',
        includeDetails = true
      } = options;

      // HTML → Canvas → PDF 방식으로 한글 지원
      await this.generateHTMLToPDF(diagnosis, { title, companyName, includeDetails });

    } catch (error) {
      console.error('❌ PDF 생성 오류:', error);
      
      // 사용자 친화적 오류 메시지
      const errorMessage = this.getErrorMessage(error);
      
      // 대안 방법 제공
      const shouldTryAlternative = confirm(
        `PDF 생성 중 오류가 발생했습니다.\n\n${errorMessage}\n\n대신 텍스트 보고서를 다운로드하시겠습니까?`
      );
      
      if (shouldTryAlternative) {
        this.generateTextReport(diagnosis, options);
      }
      
      throw error;
    }
  }

  /**
   * HTML → Canvas → PDF 방식 (한글 완벽 지원)
   */
  private static async generateHTMLToPDF(diagnosis: any, options: {
    title: string;
    companyName: string;
    includeDetails: boolean;
  }): Promise<void> {
    const { title, companyName, includeDetails } = options;
    
    try {
      // HTML 콘텐츠 생성
      const htmlContent = this.generateKoreanHTMLContent(diagnosis, { title, companyName, includeDetails });
      
      // 임시 HTML 엘리먼트 생성
      const pdfElement = document.createElement('div');
      pdfElement.style.cssText = `
        width: 800px;
        padding: 20px;
        background: white;
        font-family: 'Malgun Gothic', 'Arial Unicode MS', '맑은 고딕', sans-serif;
        line-height: 1.6;
        position: absolute;
        left: -9999px;
        top: 0;
        color: #000;
        box-sizing: border-box;
        font-size: 14px;
      `;
      
      pdfElement.innerHTML = htmlContent;
      document.body.appendChild(pdfElement);

      try {
        console.log('🖼️ HTML을 캔버스로 변환 중...');
        
        // HTML을 캔버스로 변환 (한글 폰트 렌더링)
        const canvas = await this.html2canvas(pdfElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          allowTaint: true,
          foreignObjectRendering: true,
          logging: false,
          width: 800,
          height: pdfElement.scrollHeight,
          onclone: (clonedDoc: Document) => {
            // 클론된 문서에 한글 폰트 강제 적용
            const style = clonedDoc.createElement('style');
            style.textContent = `
              * {
                font-family: 'Malgun Gothic', 'Arial Unicode MS', '맑은 고딕', sans-serif !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        });

        console.log('📄 PDF 문서 생성 중...');
        
        // PDF 생성
        const pdf = new this.jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // 첫 페이지 추가
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // 여러 페이지 처리
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // 파일명 생성 및 저장
        const fileName = `M-CENTER_${companyName}_진단결과_${new Date().toLocaleDateString('ko-KR').replace(/\./g, '')}.pdf`;
        pdf.save(fileName);

        console.log('✅ HTML → PDF 생성 완료:', fileName);

        // 성공 알림
        setTimeout(() => {
          alert(`✅ PDF 다운로드 완료!\n파일명: ${fileName}\n\n다운로드 폴더를 확인해주세요.`);
        }, 500);

      } finally {
        // 임시 엘리먼트 제거
        document.body.removeChild(pdfElement);
      }

    } catch (error) {
      console.error('HTML → PDF 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 한글 지원 HTML 콘텐츠 생성
   */
  private static generateKoreanHTMLContent(diagnosis: any, options: {
    title: string;
    companyName: string;
    includeDetails: boolean;
  }): string {
    const { title, companyName, includeDetails } = options;
    const currentDate = new Date().toLocaleDateString('ko-KR');
    const score = diagnosis.overallScore || 75;
    const position = diagnosis.marketPosition || '양호';
    const growth = diagnosis.industryGrowth || '25%';

    return `
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; border-radius: 8px;">
        <h1 style="font-size: 24px; margin: 0 0 10px 0; font-weight: bold;">${title}</h1>
        <p style="margin: 5px 0; font-size: 16px;">M-CENTER 경영컨설팅</p>
        <p style="margin: 5px 0; font-size: 14px;">진단일시: ${currentDate}</p>
        <p style="margin: 5px 0; font-size: 14px;">기업명: ${companyName}</p>
        ${diagnosis.detailedAnalysis ? 
          '<div style="margin: 10px 0; padding: 5px 15px; background: rgba(255,255,255,0.2); border-radius: 15px; display: inline-block; font-size: 12px;">📊 상세분석 포함</div>' : ''}
      </div>

      <div style="margin-bottom: 30px; padding: 20px; border: 2px solid #3b82f6; border-radius: 8px; text-align: center;">
        <h2 style="color: #3b82f6; margin-bottom: 15px; font-size: 20px;">📊 종합 진단 점수</h2>
        <div style="font-size: 48px; font-weight: bold; color: ${score >= 80 ? '#16a34a' : score >= 70 ? '#3b82f6' : '#ea580c'}; margin-bottom: 10px;">
          ${score}점
        </div>
        <p style="font-size: 16px; color: #666; margin: 8px 0;">시장 위치: <strong>${position}</strong></p>
        <p style="font-size: 14px; color: #666;">업계 성장률: ${growth}</p>
      </div>

      ${includeDetails && diagnosis.quickAnalysis ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #3b82f6; margin-bottom: 15px; font-size: 18px;">🎯 핵심 분석</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
              <h3 style="color: #0ea5e9; margin-bottom: 10px; font-size: 14px;">💪 주요 강점</h3>
              ${(diagnosis.quickAnalysis.strengths || []).map((item: string) => 
                `<p style="margin: 5px 0; font-size: 13px;">• ${item}</p>`
              ).join('')}
            </div>
            <div style="padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h3 style="color: #f59e0b; margin-bottom: 10px; font-size: 14px;">🔧 개선 기회</h3>
              ${(diagnosis.quickAnalysis.improvements || []).map((item: string) => 
                `<p style="margin: 5px 0; font-size: 13px;">• ${item}</p>`
              ).join('')}
            </div>
            <div style="padding: 15px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="color: #3b82f6; margin-bottom: 10px; font-size: 14px;">🌟 성장 기회</h3>
              ${(diagnosis.quickAnalysis.opportunities || []).map((item: string) => 
                `<p style="margin: 5px 0; font-size: 13px;">• ${item}</p>`
              ).join('')}
            </div>
            <div style="padding: 15px; background: #f3f4f6; border-radius: 8px; border-left: 4px solid #6b7280;">
              <h3 style="color: #6b7280; margin-bottom: 10px; font-size: 14px;">⚠️ 주의사항</h3>
              <p style="margin: 5px 0; font-size: 13px;">• 시장 경쟁 심화</p>
              <p style="margin: 5px 0; font-size: 13px;">• 외부 환경 변화</p>
            </div>
          </div>
        </div>
      ` : ''}

      ${diagnosis.actionPlan ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #3b82f6; margin-bottom: 15px; font-size: 18px;">🚀 실행 액션 플랜</h2>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            ${diagnosis.actionPlan.map((action: string, index: number) => 
              `<p style="margin: 8px 0; padding: 8px; background: white; border-radius: 4px; font-size: 14px;">
                <strong>${index + 1}단계:</strong> ${action}
              </p>`
            ).join('')}
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 30px; padding: 20px; background: #16a34a; color: white; border-radius: 8px; text-align: center;">
        <h2 style="margin-bottom: 15px; font-size: 18px;">📞 전문가 상담 신청</h2>
        <p style="margin: 5px 0; font-size: 16px; font-weight: bold;">담당자: ${CONSULTANT_INFO.name}</p>
        <p style="margin: 5px 0; font-size: 16px; font-weight: bold;">연락처: ${CONTACT_INFO.mainPhone}</p>
        <p style="margin: 5px 0; font-size: 14px;">이메일: ${CONTACT_INFO.mainEmail}</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">첫 상담은 완전 무료입니다!</p>
      </div>
    `;
  }

  /**
   * 텍스트 보고서 대안 생성 (UTF-8 보장)
   */
  private static generateTextReport(diagnosis: any, options: any): void {
    const { companyName = diagnosis.companyName || '기업명' } = options;
    const currentDate = new Date().toLocaleDateString('ko-KR');
    
    const report = `
🎯 ${companyName} 종합 AI 진단결과 보고서
${'='.repeat(60)}
📊 상세 보고서 | 생성일: ${currentDate}

📊 종합 점수: ${diagnosis.overallScore || 75}점/100점
📈 시장 위치: ${diagnosis.marketPosition || '양호'}
🚀 업계 성장률: ${diagnosis.industryGrowth || '25%'}

💪 핵심 강점:
${(diagnosis.quickAnalysis?.strengths || ['기업 성장 의지', '시장 진입 타이밍']).map((s: string) => `• ${s}`).join('\n')}

🔧 개선 포인트:
${(diagnosis.quickAnalysis?.improvements || ['디지털 전환', '마케팅 강화']).map((i: string) => `• ${i}`).join('\n')}

🌟 성장 기회:
${(diagnosis.quickAnalysis?.opportunities || ['정부 지원 활용', '시장 확대']).map((o: string) => `• ${o}`).join('\n')}

📞 전담 컨설턴트 연락처
담당자: ${CONSULTANT_INFO.name}
전화: ${CONTACT_INFO.mainPhone}
이메일: ${CONTACT_INFO.mainEmail}

${'='.repeat(60)}
경기도경영지도센터 (M-CENTER)
`;

    // UTF-8 BOM 추가로 한글 인코딩 보장
    const BOM = '\uFEFF';
    const finalContent = BOM + report;

    // 텍스트 파일 다운로드
    const blob = new Blob([finalContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `M-CENTER_${companyName}_진단결과_${currentDate.replace(/\./g, '')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('📄 텍스트 보고서가 다운로드되었습니다!');
  }

  /**
   * 오류 메시지 변환
   */
  private static getErrorMessage(error: any): string {
    if (error instanceof Error) {
      if (error.message.includes('jsPDF')) {
        return '오류 내용: PDF 라이브러리 초기화 실패\n브라우저가 PDF 생성을 지원하지 않을 수 있습니다.';
      }
      if (error.message.includes('html2canvas')) {
        return '오류 내용: 화면 캡처 라이브러리 실패\n브라우저 보안 정책으로 인해 차단되었을 수 있습니다.';
      }
      if (error.message.includes('클라이언트')) {
        return '오류 내용: 서버 사이드 실행 오류\n페이지 새로고침이 필요합니다.';
      }
      return `오류 내용: ${error.message}`;
    }
    return '오류 내용: 알 수 없는 오류가 발생했습니다.';
  }

  /**
   * 라이브러리 상태 확인
   */
  static isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 라이브러리 재초기화
   */
  static async reinitialize(): Promise<void> {
    this.initialized = false;
    this.initializePromise = null;
    this.jsPDF = null;
    this.html2canvas = null;
    await this.initializeLibraries();
  }
} 