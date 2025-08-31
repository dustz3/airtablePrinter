// 網頁應用整合 Google Apps Script
// 這個檔案可以加入到您現有的網頁應用中

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

/**
 * 從網頁應用呼叫 Google Apps Script 生成文件
 * @param {string} awbNumber - 單號
 * @returns {Promise} 生成結果
 */
async function generateDocumentFromWeb(awbNumber) {
  try {
    console.log(`開始生成文件: ${awbNumber}`);

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        awbNumber: awbNumber,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('文件生成成功:', result.documentUrl);

      // 開啟新視窗顯示文件
      window.open(result.documentUrl, '_blank');

      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('生成文件時發生錯誤:', error);
    alert(`生成文件失敗: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 整合到您現有的網頁應用
 */
function integrateWithExistingApp() {
  // 在您的 HTML 中加入這個按鈕
  const generateButton = document.createElement('button');
  generateButton.textContent = '生成 Airwaybill';
  generateButton.className = 'btn btn-primary';
  generateButton.onclick = async () => {
    const awbNumber = document.getElementById('awbNumberInput').value;
    if (!awbNumber) {
      alert('請輸入單號');
      return;
    }

    generateButton.disabled = true;
    generateButton.textContent = '生成中...';

    const result = await generateDocumentFromWeb(awbNumber);

    generateButton.disabled = false;
    generateButton.textContent = '生成 Airwaybill';

    if (result.success) {
      alert('文件生成成功！');
    }
  };

  // 將按鈕加入到您的頁面
  document.getElementById('actionButtons').appendChild(generateButton);
}

/**
 * 完整的網頁應用範例
 */
function createCompleteWebApp() {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Airwaybill 自動生成系統</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .btn { padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; }
        .btn-primary { background: #007bff; color: white; }
        .btn-primary:hover { background: #0056b3; }
        .btn-primary:disabled { background: #ccc; cursor: not-allowed; }
        .result { margin-top: 20px; padding: 15px; border-radius: 4px; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Airwaybill 自動生成系統</h1>
        
        <div class="form-group">
          <label for="awbNumber">單號 (AWB Number):</label>
          <input type="text" id="awbNumber" placeholder="例如: TM-111111">
        </div>
        
        <button id="generateBtn" class="btn btn-primary" onclick="generateDocument()">
          生成 Airwaybill
        </button>
        
        <div id="result"></div>
      </div>
      
      <script>
        async function generateDocument() {
          const awbNumber = document.getElementById('awbNumber').value;
          const generateBtn = document.getElementById('generateBtn');
          const resultDiv = document.getElementById('result');
          
          if (!awbNumber) {
            alert('請輸入單號');
            return;
          }
          
          generateBtn.disabled = true;
          generateBtn.textContent = '生成中...';
          
          try {
            const result = await generateDocumentFromWeb(awbNumber);
            
            if (result.success) {
              resultDiv.innerHTML = \`
                <div class="result success">
                  <h3>✅ 文件生成成功！</h3>
                  <p><strong>單號:</strong> \${awbNumber}</p>
                  <p><strong>文件連結:</strong> <a href="\${result.documentUrl}" target="_blank">點擊查看</a></p>
                  <p><strong>生成時間:</strong> \${new Date().toLocaleString()}</p>
                </div>
              \`;
            } else {
              resultDiv.innerHTML = \`
                <div class="result error">
                  <h3>❌ 生成失敗</h3>
                  <p><strong>錯誤訊息:</strong> \${result.error}</p>
                </div>
              \`;
            }
          } catch (error) {
            resultDiv.innerHTML = \`
              <div class="result error">
                <h3>❌ 系統錯誤</h3>
                <p><strong>錯誤訊息:</strong> \${error.message}</p>
              </div>
            \`;
          } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = '生成 Airwaybill';
          }
        }
        
        // 整合 Google Apps Script 函數
        async function generateDocumentFromWeb(awbNumber) {
          try {
            const response = await fetch('${GOOGLE_SCRIPT_URL}', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                awbNumber: awbNumber
              })
            });
            
            const result = await response.json();
            return result;
            
          } catch (error) {
            return { success: false, error: error.message };
          }
        }
      </script>
    </body>
    </html>
  `;

  return html;
}
