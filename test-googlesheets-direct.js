/**
 * 구글시트 연동 직접 테스트 스크립트
 * 환경변수를 읽어서 실제 API 호출 테스트
 */

const https = require('https');
const fs = require('fs');

// 환경변수 로드
function loadEnvironmentVariables() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          envVars[key] = valueParts.join('=');
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ .env.local 파일을 읽을 수 없습니다:', error.message);
    return {};
  }
}

// 구글시트 API 호출 함수
async function callGoogleSheetsAPI(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          console.log('📡 HTTP 응답 상태:', res.statusCode);
          console.log('📄 원본 응답:', responseData);
          
          let parsedData;
          try {
            parsedData = JSON.parse(responseData);
          } catch (parseError) {
            // JSON 파싱 실패 시 텍스트 응답 분석
            if (responseData.includes('success') || responseData.includes('저장') || responseData.includes('완료')) {
              parsedData = { 
                success: true, 
                message: responseData.substring(0, 200),
                raw: responseData 
              };
            } else {
              parsedData = { 
                success: false, 
                error: responseData,
                raw: responseData 
              };
            }
          }
          
          resolve({
            statusCode: res.statusCode,
            data: parsedData,
            raw: responseData
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('요청 시간 초과 (10초)'));
    });

    req.write(postData);
    req.end();
  });
}

// 진단 데이터 테스트
async function testDiagnosisData(apiUrl) {
  const testData = {
    action: 'saveDiagnosis',
    제출일시: new Date().toLocaleString('ko-KR'),
    폼타입: 'AI_무료진단',
    회사명: `테스트기업_${Date.now()}`,
    업종: 'IT/소프트웨어',
    사업담당자: '김테스트',
    직원수: '10-50명',
    사업성장단계: '성장기',
    주요고민사항: '매출 성장 정체 및 디지털 전환 필요',
    예상혜택: '효율성 향상 및 경쟁력 강화',
    진행사업장: '서울특별시',
    담당자명: '테스트 담당자',
    연락처: '010-9251-9743',
    이메일: `test_diagnosis_${Date.now()}@mcenter.test`,
    개인정보동의: '동의'
  };

  console.log('\n🧪 === 진단 데이터 테스트 시작 ===');
  console.log('📋 테스트 데이터:', JSON.stringify(testData, null, 2));
  
  try {
    const result = await callGoogleSheetsAPI(apiUrl, testData);
    
    if (result.statusCode === 200 && result.data.success) {
      console.log('✅ 진단 데이터 저장 성공!');
      console.log('📊 결과:', result.data);
      return { success: true, result };
    } else {
      console.log('❌ 진단 데이터 저장 실패');
      console.log('📊 결과:', result);
      return { success: false, result };
    }
  } catch (error) {
    console.log('🔥 진단 데이터 테스트 오류:', error.message);
    return { success: false, error: error.message };
  }
}

// 상담 데이터 테스트
async function testConsultationData(apiUrl) {
  const testData = {
    action: 'saveConsultation',
    제출일시: new Date().toLocaleString('ko-KR'),
    폼타입: '상담신청',
    상담유형: 'phone',
    성명: '홍길동',
    연락처: '010-9251-9743',
    이메일: `test_consultation_${Date.now()}@mcenter.test`,
    회사명: `테스트상담기업_${Date.now()}`,
    직책: '대표이사',
    상담분야: 'business-analysis',
    문의내용: '비즈니스 분석 상담을 받고 싶습니다.',
    희망상담시간: 'morning',
    개인정보동의: '동의',
    진단연계여부: 'N',
    진단점수: '',
    추천서비스: ''
  };

  console.log('\n💬 === 상담 데이터 테스트 시작 ===');
  console.log('📋 테스트 데이터:', JSON.stringify(testData, null, 2));
  
  try {
    const result = await callGoogleSheetsAPI(apiUrl, testData);
    
    if (result.statusCode === 200 && result.data.success) {
      console.log('✅ 상담 데이터 저장 성공!');
      console.log('📊 결과:', result.data);
      return { success: true, result };
    } else {
      console.log('❌ 상담 데이터 저장 실패');
      console.log('📊 결과:', result);
      return { success: false, result };
    }
  } catch (error) {
    console.log('🔥 상담 데이터 테스트 오류:', error.message);
    return { success: false, error: error.message };
  }
}

// 연계 테스트 (진단 → 상담)
async function testLinkedData(apiUrl) {
  console.log('\n🔗 === 진단-상담 연계 테스트 시작 ===');
  
  // 1단계: 진단 데이터 저장
  const diagnosisResult = await testDiagnosisData(apiUrl);
  
  if (!diagnosisResult.success) {
    console.log('❌ 진단 데이터 저장 실패로 연계 테스트 중단');
    return { success: false, error: '진단 단계 실패' };
  }
  
  // 2단계: 연계된 상담 데이터 저장
  const linkedConsultationData = {
    action: 'saveConsultation',
    제출일시: new Date().toLocaleString('ko-KR'),
    폼타입: '상담신청',
    상담유형: 'phone',
    성명: '진단연계 테스트',
    연락처: '010-9251-9743',
    이메일: `linked_test_${Date.now()}@mcenter.test`,
    회사명: '연계테스트 기업',
    직책: '대표이사',
    상담분야: 'diagnosis',
    문의내용: '진단 결과에 대한 상담을 요청합니다.',
    희망상담시간: 'morning',
    개인정보동의: '동의',
    진단연계여부: 'Y',
    진단점수: '85',
    추천서비스: 'business-analysis'
  };

  console.log('📋 연계 상담 데이터:', JSON.stringify(linkedConsultationData, null, 2));
  
  try {
    const consultationResult = await callGoogleSheetsAPI(apiUrl, linkedConsultationData);
    
    if (consultationResult.statusCode === 200 && consultationResult.data.success) {
      console.log('✅ 진단-상담 연계 데이터 저장 성공!');
      console.log('📊 진단 결과:', diagnosisResult.result.data);
      console.log('📊 상담 결과:', consultationResult.data);
      return { 
        success: true, 
        diagnosisResult: diagnosisResult.result,
        consultationResult: consultationResult
      };
    } else {
      console.log('❌ 연계 상담 데이터 저장 실패');
      return { success: false, result: consultationResult };
    }
  } catch (error) {
    console.log('🔥 연계 테스트 오류:', error.message);
    return { success: false, error: error.message };
  }
}

// 메인 실행 함수
async function runTests() {
  console.log('🚀 === 구글시트 연동 직접 테스트 시작 ===\n');
  
  // 환경변수 로드
  const envVars = loadEnvironmentVariables();
  const apiUrl = envVars.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  
  if (!apiUrl) {
    console.error('❌ NEXT_PUBLIC_GOOGLE_SCRIPT_URL 환경변수가 설정되지 않았습니다.');
    console.error('💡 .env.local 파일에 다음을 추가하세요:');
    console.error('NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/...');
    return;
  }
  
  console.log('🔗 API URL:', apiUrl.substring(0, 60) + '...');
  console.log('📋 환경변수 상태:');
  console.log('  - GOOGLE_SCRIPT_URL:', !!envVars.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ? '✅' : '❌');
  console.log('  - GOOGLE_SHEETS_ID:', !!envVars.NEXT_PUBLIC_GOOGLE_SHEETS_ID ? '✅' : '❌');
  console.log('  - GOOGLE_SCRIPT_ID:', !!envVars.NEXT_PUBLIC_GOOGLE_SCRIPT_ID ? '✅' : '❌');
  console.log('  - DEPLOYMENT_ID:', !!envVars.NEXT_PUBLIC_GOOGLE_SCRIPT_DEPLOYMENT_ID ? '✅' : '❌');

  const results = {
    diagnosis: null,
    consultation: null,
    linked: null
  };

  // 1. 진단 데이터 테스트
  results.diagnosis = await testDiagnosisData(apiUrl);
  
  // 2. 상담 데이터 테스트
  results.consultation = await testConsultationData(apiUrl);
  
  // 3. 연계 테스트
  results.linked = await testLinkedData(apiUrl);

  // 최종 결과 요약
  console.log('\n📊 === 테스트 결과 요약 ===');
  console.log('진단 데이터 저장:', results.diagnosis.success ? '✅ 성공' : '❌ 실패');
  console.log('상담 데이터 저장:', results.consultation.success ? '✅ 성공' : '❌ 실패');
  console.log('연계 테스트:', results.linked.success ? '✅ 성공' : '❌ 실패');

  const allSuccess = results.diagnosis.success && results.consultation.success && results.linked.success;
  
  if (allSuccess) {
    console.log('\n🎉 모든 테스트 성공! 구글시트 연동이 정상적으로 작동합니다.');
    console.log('💡 이제 웹사이트에서 진단 신청과 상담 신청이 구글시트에 자동으로 저장됩니다.');
  } else {
    console.log('\n⚠️ 일부 테스트 실패. 다음을 확인해주세요:');
    console.log('1. 구글시트 Apps Script가 올바르게 배포되었는지');
    console.log('2. 환경변수가 정확한지');
    console.log('3. 구글시트 권한이 "모든 사용자"로 설정되었는지');
  }

  console.log('\n🔗 구글시트 확인하기:');
  if (envVars.NEXT_PUBLIC_GOOGLE_SHEETS_URL) {
    console.log(envVars.NEXT_PUBLIC_GOOGLE_SHEETS_URL);
  } else {
    console.log('https://docs.google.com/spreadsheets/d/' + (envVars.NEXT_PUBLIC_GOOGLE_SHEETS_ID || 'YOUR_SHEET_ID') + '/edit');
  }
}

// 스크립트 실행
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testDiagnosisData, testConsultationData, testLinkedData }; 