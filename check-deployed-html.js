const https = require('https');
const fs = require('fs');

console.log('🔍 배포된 사이트 HTML 상세 분석...\n');

function analyzeDeployedSite() {
  return new Promise((resolve) => {
    const req = https.get('https://m-center-landingpage.vercel.app/tax-calculator', (res) => {
      console.log(`📡 응답 상태: ${res.statusCode}`);
      console.log(`📄 Content-Type: ${res.headers['content-type']}`);
      console.log(`📏 Content-Length: ${res.headers['content-length']}`);
      
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 HTML 크기: ${data.length} bytes\n`);
        
        // HTML 파일로 저장
        fs.writeFileSync('deployed-site.html', data);
        console.log('💾 HTML 파일 저장: deployed-site.html\n');
        
        // 주요 패턴 분석
        console.log('🔍 주요 패턴 분석:');
        console.log('=' * 40);
        
        // 1. autoCalculatedValues 오류 확인
        if (data.includes('autoCalculatedValues is not defined')) {
          console.log('❌ autoCalculatedValues 오류 발견!');
        } else {
          console.log('✅ autoCalculatedValues 오류 없음');
        }
        
        // 2. React 에러 경계 확인
        if (data.includes('Error Boundary')) {
          console.log('⚠️  Error Boundary 감지');
        } else {
          console.log('✅ Error Boundary 없음');
        }
        
        // 3. JavaScript 오류 패턴 확인
        const errorPatterns = [
          'ReferenceError',
          'TypeError',
          'SyntaxError',
          'is not defined',
          'Cannot read property',
          'Cannot access before initialization'
        ];
        
        let foundErrors = [];
        errorPatterns.forEach(pattern => {
          if (data.includes(pattern)) {
            foundErrors.push(pattern);
          }
        });
        
        if (foundErrors.length > 0) {
          console.log('🚨 발견된 JavaScript 오류 패턴:');
          foundErrors.forEach(error => console.log(`   - ${error}`));
        } else {
          console.log('✅ JavaScript 오류 패턴 없음');
        }
        
        // 4. Next.js 관련 확인
        if (data.includes('__NEXT_DATA__')) {
          console.log('✅ Next.js 데이터 존재');
        } else {
          console.log('⚠️  Next.js 데이터 누락');
        }
        
        // 5. React 관련 확인
        if (data.includes('react')) {
          console.log('✅ React 스크립트 로드됨');
        } else {
          console.log('❌ React 스크립트 누락');
        }
        
        // 6. 세금계산기 컴포넌트 확인
        if (data.includes('근로소득세 계산기') || data.includes('EarnedIncomeTax')) {
          console.log('✅ 세금계산기 컴포넌트 존재');
        } else {
          console.log('❌ 세금계산기 컴포넌트 누락');
        }
        
        // 7. CSS/스타일 확인
        if (data.includes('tailwind') || data.includes('css')) {
          console.log('✅ 스타일시트 로드됨');
        } else {
          console.log('⚠️  스타일시트 확인 필요');
        }
        
        // 8. 스크립트 태그 개수 확인
        const scriptMatches = data.match(/<script[^>]*>/g);
        if (scriptMatches) {
          console.log(`📜 스크립트 태그 개수: ${scriptMatches.length}`);
        }
        
        // 9. 환경변수 확인 (public)
        if (data.includes('NEXT_PUBLIC_')) {
          console.log('✅ 환경변수 정상 로드');
        } else {
          console.log('⚠️  환경변수 확인 필요');
        }
        
        // 10. 메타 태그 확인
        if (data.includes('<title>')) {
          const titleMatch = data.match(/<title>(.*?)<\/title>/);
          if (titleMatch) {
            console.log(`📝 페이지 제목: ${titleMatch[1]}`);
          }
        }
        
        console.log('\n📋 분석 완료!');
        console.log('💡 deployed-site.html 파일을 열어서 더 자세히 확인할 수 있습니다.');
        
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ 요청 오류: ${err.message}`);
      resolve();
    });
    
    req.setTimeout(15000, () => {
      console.log('❌ 요청 타임아웃');
      req.destroy();
      resolve();
    });
  });
}

analyzeDeployedSite(); 