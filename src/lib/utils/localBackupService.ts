/**
 * 로컬 백업 서비스 - Google Apps Script 연결 실패 시 대안
 * 
 * 기능:
 * 1. 로컬스토리지에 데이터 임시 저장
 * 2. 관리자 이메일 알림 (EmailJS 사용)
 * 3. 데이터 내보내기 기능
 * 4. 수동 동기화 지원
 */

import { safeLocalStorageGet, safeLocalStorageSet } from './safeDataAccess';

export interface BackupData {
  id: string;
  type: 'diagnosis' | 'consultation';
  timestamp: string;
  data: any;
  status: 'pending' | 'sent' | 'failed';
  retryCount: number;
  lastRetry?: string;
}

export class LocalBackupService {
  private static readonly BACKUP_KEY = 'mcenter_backup_data';
  private static readonly MAX_RETRY = 3;

  /**
   * 진단 데이터 백업 저장
   */
  static saveDiagnosisBackup(data: any): string {
    const backupData: BackupData = {
      id: `diagnosis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'diagnosis',
      timestamp: new Date().toISOString(),
      data: this.sanitizeData(data),
      status: 'pending',
      retryCount: 0
    };

    this.addToBackupQueue(backupData);
    
    console.log('💾 진단 데이터 로컬 백업 저장:', backupData.id);
    
    // 관리자 알림 발송
    this.notifyAdmin('diagnosis', backupData);
    
    return backupData.id;
  }

  /**
   * 상담 데이터 백업 저장
   */
  static saveConsultationBackup(data: any): string {
    const backupData: BackupData = {
      id: `consultation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'consultation',
      timestamp: new Date().toISOString(),
      data: this.sanitizeData(data),
      status: 'pending',
      retryCount: 0
    };

    this.addToBackupQueue(backupData);
    
    console.log('💾 상담 데이터 로컬 백업 저장:', backupData.id);
    
    // 관리자 알림 발송
    this.notifyAdmin('consultation', backupData);
    
    return backupData.id;
  }

  /**
   * 백업 큐에 데이터 추가
   */
  private static addToBackupQueue(backupData: BackupData): void {
    const existingBackups = this.getAllBackups();
    existingBackups.push(backupData);
    
    // 최대 100개까지만 보관
    const limitedBackups = existingBackups.slice(-100);
    
    safeLocalStorageSet(this.BACKUP_KEY, limitedBackups);
  }

  /**
   * 모든 백업 데이터 조회
   */
  static getAllBackups(): BackupData[] {
    return safeLocalStorageGet(this.BACKUP_KEY, []);
  }

  /**
   * 대기 중인 백업 데이터 조회
   */
  static getPendingBackups(): BackupData[] {
    return this.getAllBackups().filter(backup => backup.status === 'pending');
  }

  /**
   * 백업 데이터를 CSV로 내보내기
   */
  static exportToCSV(): string {
    const backups = this.getAllBackups();
    
    if (backups.length === 0) {
      return '';
    }

    // CSV 헤더 생성
    const headers = [
      'ID', '타입', '타임스탬프', '상태', '재시도횟수',
      '회사명', '이메일', '연락처', '업종', '고민사항'
    ];

    // CSV 데이터 생성
    const csvRows = [headers.join(',')];
    
    backups.forEach(backup => {
      const data = backup.data;
      const row = [
        backup.id,
        backup.type,
        backup.timestamp,
        backup.status,
        backup.retryCount,
        this.csvEscape(data.companyName || data.회사명 || ''),
        this.csvEscape(data.contactEmail || data.이메일 || data.email || ''),
        this.csvEscape(data.contactPhone || data.연락처 || data.phone || ''),
        this.csvEscape(data.industry || data.업종 || ''),
        this.csvEscape(data.mainConcerns || data.주요고민사항 || data.inquiryContent || '')
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * CSV 다운로드 실행
   */
  static downloadBackupCSV(): void {
    const csvContent = this.exportToCSV();
    
    if (!csvContent) {
      alert('백업 데이터가 없습니다.');
      return;
    }

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `mcenter_backup_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('📥 백업 데이터 CSV 다운로드 완료');
  }

  /**
   * 백업 데이터 클리어 (관리자용)
   */
  static clearAllBackups(): boolean {
    try {
      localStorage.removeItem(this.BACKUP_KEY);
      console.log('🗑️ 모든 백업 데이터 삭제 완료');
      return true;
    } catch (error) {
      console.error('❌ 백업 데이터 삭제 실패:', error);
      return false;
    }
  }

  /**
   * 특정 백업 상태 업데이트
   */
  static updateBackupStatus(id: string, status: BackupData['status']): boolean {
    try {
      const backups = this.getAllBackups();
      const backup = backups.find(b => b.id === id);
      
      if (backup) {
        backup.status = status;
        backup.lastRetry = new Date().toISOString();
        if (status === 'failed') {
          backup.retryCount++;
        }
        
        safeLocalStorageSet(this.BACKUP_KEY, backups);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ 백업 상태 업데이트 실패:', error);
      return false;
    }
  }

  /**
   * 관리자 알림 발송 (EmailJS 사용)
   */
  private static async notifyAdmin(type: string, backupData: BackupData): Promise<void> {
    try {
      // EmailJS가 로드되어 있는지 확인
      if (typeof window === 'undefined' || !(window as any).emailjs) {
        console.warn('⚠️ EmailJS가 로드되지 않아 관리자 알림을 건너뜁니다.');
        return;
      }

      const emailData = {
        to_email: 'hongik423@gmail.com',
        subject: `[M-CENTER] ${type === 'diagnosis' ? '진단' : '상담'} 신청 백업 알림`,
        message: `
🚨 Google Apps Script 연결 실패로 로컬 백업이 생성되었습니다.

📋 백업 정보:
- ID: ${backupData.id}
- 타입: ${type === 'diagnosis' ? 'AI 진단 신청' : '상담 신청'}
- 시간: ${backupData.timestamp}

👤 신청자 정보:
- 회사명: ${backupData.data.companyName || backupData.data.회사명 || 'N/A'}
- 이메일: ${backupData.data.contactEmail || backupData.data.이메일 || backupData.data.email || 'N/A'}
- 연락처: ${backupData.data.contactPhone || backupData.data.연락처 || backupData.data.phone || 'N/A'}

🔧 조치 필요:
1. Google Apps Script 연결 상태 확인
2. 웹사이트에서 백업 데이터 CSV 다운로드
3. 수동으로 구글시트에 입력

📱 웹사이트: http://localhost:3001/test-googlesheets
        `,
        timestamp: new Date().toLocaleString('ko-KR')
      };

      await (window as any).emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        'template_backup_alert', // 템플릿 ID (실제 설정 필요)
        emailData,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      console.log('📧 관리자 백업 알림 발송 완료');
    } catch (error) {
      console.warn('⚠️ 관리자 알림 발송 실패:', error);
    }
  }

  /**
   * 데이터 정제 (민감한 정보 제거)
   */
  private static sanitizeData(data: any): any {
    const sanitized = { ...data };
    
    // 민감할 수 있는 필드 제거
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.apiKey;
    
    return sanitized;
  }

  /**
   * CSV 필드 이스케이프
   */
  private static csvEscape(value: string): string {
    if (!value) return '';
    
    const stringValue = String(value);
    
    // 쌍따옴표 포함 시 이스케이프
    if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  }

  /**
   * 백업 상태 요약
   */
  static getBackupSummary(): {
    total: number;
    pending: number;
    sent: number;
    failed: number;
    lastBackup?: string;
  } {
    const backups = this.getAllBackups();
    
    return {
      total: backups.length,
      pending: backups.filter(b => b.status === 'pending').length,
      sent: backups.filter(b => b.status === 'sent').length,
      failed: backups.filter(b => b.status === 'failed').length,
      lastBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : undefined
    };
  }
}

// 전역 함수 노출 (브라우저 콘솔에서 사용 가능)
if (typeof window !== 'undefined') {
  (window as any).MCenterBackup = LocalBackupService;
  console.log('🔧 LocalBackupService가 window.MCenterBackup으로 노출되었습니다.');
  console.log('💡 사용법: MCenterBackup.getAllBackups(), MCenterBackup.downloadBackupCSV() 등');
}

export default LocalBackupService; 