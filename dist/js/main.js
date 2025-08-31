// Airtable 設定
const AIRTABLE_CONFIG = {
  // 🔑 請替換成您的 Airtable API Key
  // 取得方式：前往 https://airtable.com/account → API → Generate API key
  apiKey:
    'patqmy3J0VA0nHm87.bed450c15850e26960b3da0f0e91f1a9328c2c0831bf6577f69cf54194168823',

  // 🏠 請替換成您的 Base ID
  // 在您的 Airtable 網址中找到，格式如：appXXXXXXXXXXXXXX
  baseId: 'appV5HA6H7YDjyG2K',

  // 📊 請替換成您的 Table IDs
  // 在 Airtable 中點擊表單名稱旁的設定圖示 → API → Table ID
  tables: {
    products: 'tbllTAZHEmQ4axqeX', // 產品資料表 ID
    customers: 'tblS0U0cjh4Xc5zLU', // 客戶資料表 ID
    orders: 'tblOrders', // 訂單資料表 ID
    inventory: 'tblInventory', // 庫存資料表 ID
  },
};

// 全域變數
let currentData = {
  table1: null,
  table2: null,
};

let tableFields = {
  products: [],
  customers: [],
};

// DOM 元素
const elements = {
  row1Input: document.getElementById('row1'),
  fields1Checkboxes: document.getElementById('fields1Checkboxes'),
  row2Input: document.getElementById('row2'),
  fields2Checkboxes: document.getElementById('fields2Checkboxes'),
  fetchDataBtn: document.getElementById('fetchData'),
  printDataBtn: document.getElementById('printData'),
  previewDataBtn: document.getElementById('previewData'),
  tableBody: document.getElementById('tableBody'),
};

// 初始化
document.addEventListener('DOMContentLoaded', function () {
  initializeEventListeners();
  loadTableFields();
});

// 事件監聽器
function initializeEventListeners() {
  elements.fetchDataBtn.addEventListener('click', fetchData);
  elements.printDataBtn.addEventListener('click', printData);
  elements.previewDataBtn.addEventListener('click', previewTableStyle);
}

// 載入表單欄位
async function loadTableFields() {
  try {
    console.log('載入表單欄位...');

    // 載入產品表欄位
    const productsStructure = await checkTableStructure('products');
    if (productsStructure.fields) {
      tableFields.products = productsStructure.fields;
      renderFieldCheckboxes('products', elements.fields1Checkboxes);
    }

    // 載入客戶表欄位
    const customersStructure = await checkTableStructure('customers');
    if (customersStructure.fields) {
      tableFields.customers = customersStructure.fields;
      renderFieldCheckboxes('customers', elements.fields2Checkboxes);
    }
  } catch (error) {
    console.error('載入欄位時發生錯誤:', error);
    // 如果無法載入，使用預設欄位
    renderDefaultFields();
  }
}

// 渲染欄位 checkbox
function renderFieldCheckboxes(tableName, container) {
  const fields = tableFields[tableName] || [];

  if (fields.length === 0) {
    container.innerHTML = '<div class="loading-text">無法載入欄位</div>';
    return;
  }

  let html = '';
  fields.forEach((field) => {
    html += `
      <div class="field-item">
        <input type="checkbox" id="${tableName}_${field}" value="${field}">
        <label for="${tableName}_${field}">${field}</label>
      </div>
    `;
  });

  container.innerHTML = html;
}

// 渲染預設欄位（當無法載入時）
function renderDefaultFields() {
  const defaultProductsFields = ['Name', 'Price', 'Description'];
  const defaultCustomersFields = ['Name', 'Email', 'Phone'];

  let html1 = '';
  defaultProductsFields.forEach((field) => {
    html1 += `
      <div class="field-item">
        <input type="checkbox" id="products_${field}" value="${field}">
        <label for="products_${field}">${field}</label>
      </div>
    `;
  });

  let html2 = '';
  defaultCustomersFields.forEach((field) => {
    html2 += `
      <div class="field-item">
        <input type="checkbox" id="customers_${field}" value="${field}">
        <label for="customers_${field}">${field}</label>
      </div>
    `;
  });

  elements.fields1Checkboxes.innerHTML = html1;
  elements.fields2Checkboxes.innerHTML = html2;
}

// 取得選中的欄位
function getSelectedFields(tableName) {
  const checkboxes = document.querySelectorAll(
    `input[type="checkbox"][id^="${tableName}_"]:checked`
  );
  return Array.from(checkboxes).map((cb) => cb.value);
}

// 載入範例資料（模擬 Airtable 資料）
function loadSampleData() {
  // 這裡會顯示範例資料，實際使用時會從 Airtable API 取得
  console.log('載入範例資料...');
}

// 預覽表格樣式
function previewTableStyle() {
  // 使用範例資料來預覽表格樣式
  const sampleTable1Data = {
    name: 'iPhone 15 Pro',
    price: 'NT$ 35,900',
    description: '最新款 iPhone，搭載 A17 Pro 晶片',
  };

  const sampleTable2Data = {
    order_id: 'ORD-001',
    date: '2024-01-15',
    amount: 'NT$ 35,900',
  };

  displayData(sampleTable1Data, sampleTable2Data);
  elements.printDataBtn.disabled = false;

  // 顯示提示訊息
  alert(
    '預覽表格樣式已載入！您可以查看表格的呈現效果，並根據需要修改 CSS 樣式。'
  );
}

// 從 Airtable 取得資料
async function fetchData() {
  try {
    // 驗證輸入
    if (!validateInputs()) {
      return;
    }

    elements.fetchDataBtn.textContent = '載入中...';
    elements.fetchDataBtn.disabled = true;

    // 先檢查 Airtable 資料結構
    if (AIRTABLE_CONFIG.apiKey !== 'YOUR_API_KEY_HERE') {
      console.log('檢查 Airtable 資料結構...');

      // 檢查產品表結構
      const productsStructure = await checkTableStructure('products');
      console.log('產品表結構:', productsStructure);

      // 檢查客戶表結構
      const customersStructure = await checkTableStructure('customers');
      console.log('客戶表結構:', customersStructure);
    }

    console.log('開始取得表單 1 (Products) 資料...');
    // 模擬 API 呼叫（實際使用時會替換成真實的 Airtable API）
    const table1Data = await fetchTableData(
      'products', // 固定使用 'products' 表單
      parseInt(elements.row1Input.value),
      getSelectedFields('products')
    );
    console.log('表單 1 資料結果:', table1Data);

    console.log('開始取得表單 2 (Customers) 資料...');
    const table2Data = await fetchTableData(
      'customers', // 固定使用 'customers' 表單
      parseInt(elements.row2Input.value),
      getSelectedFields('customers')
    );
    console.log('表單 2 資料結果:', table2Data);

    // 儲存資料
    currentData.table1 = table1Data;
    currentData.table2 = table2Data;

    // 顯示資料
    displayData(table1Data, table2Data);

    // 啟用列印按鈕
    elements.printDataBtn.disabled = false;
  } catch (error) {
    console.error('取得資料時發生錯誤:', error);
    alert('取得資料時發生錯誤，請檢查您的設定。');
  } finally {
    elements.fetchDataBtn.textContent = '取得資料';
    elements.fetchDataBtn.disabled = false;
  }
}

// 驗證輸入
function validateInputs() {
  const required = [
    { element: elements.row1Input, name: '表單 1 列號' },
    { element: elements.row2Input, name: '表單 2 列號' },
  ];

  for (const field of required) {
    if (!field.element.value.trim()) {
      alert(`請填寫 ${field.name}`);
      field.element.focus();
      return false;
    }
  }

  // 檢查是否有選中欄位
  const selectedFields1 = getSelectedFields('products');
  const selectedFields2 = getSelectedFields('customers');

  if (selectedFields1.length === 0) {
    alert('請選擇表單 1 的欄位');
    return false;
  }

  if (selectedFields2.length === 0) {
    alert('請選擇表單 2 的欄位');
    return false;
  }

  return true;
}

// 從 Airtable 取得資料
async function fetchTableData(tableName, rowNumber, fields) {
  // 檢查是否已設定 API Key
  if (AIRTABLE_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
    // 如果還沒設定 API Key，使用模擬資料
    console.log('使用模擬資料（請先設定 Airtable API Key）');
    return await fetchMockData(tableName, rowNumber, fields);
  }

  try {
    // 使用真實的 Airtable API
    const tableId = AIRTABLE_CONFIG.tables[tableName];
    if (!tableId) {
      throw new Error(`找不到表單 ${tableName} 的設定`);
    }

    // 直接取得指定記錄（Airtable 的記錄是從 0 開始索引）
    const recordIndex = rowNumber - 1; // 轉換為 0-based 索引
    const data = await fetchFromAirtableByIndex(tableId, recordIndex, fields);

    return data;
  } catch (error) {
    console.error('Airtable API 錯誤:', error);
    // 如果 API 失敗，回退到模擬資料
    console.log('回退到模擬資料');
    return await fetchMockData(tableName, rowNumber, fields);
  }
}

// 根據索引取得 Airtable 記錄（支援 View 和欄位過濾）
async function fetchFromAirtableByIndex(tableId, recordIndex, fields, viewId = null) {
  let url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${tableId}?pageSize=100`;
  
  // 如果指定了 View
  if (viewId) {
    url += `&view=${viewId}`;
  }
  
  // 如果指定了欄位，加入欄位過濾
  if (fields && fields.length > 0) {
    fields.forEach(field => {
      url += `&fields[]=${encodeURIComponent(field)}`;
    });
  }

  console.log(`正在取得 ${tableId} 的資料...`);
  console.log(`記錄索引: ${recordIndex}`);
  console.log(`請求欄位: ${fields ? fields.join(', ') : '全部'}`);
  console.log(`使用 View: ${viewId || '預設'}`);
  console.log(`API URL: ${url}`);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`取得記錄列表失敗: ${response.status}`);
  }

  const data = await response.json();
  console.log(`總記錄數: ${data.records ? data.records.length : 0}`);

  if (data.records && data.records.length > recordIndex) {
    const record = data.records[recordIndex];
    console.log(`第 ${recordIndex + 1} 筆記錄的完整資料:`, record.fields);

    const result = {};

    // 只回傳指定的欄位
    if (fields && fields.length > 0) {
      for (const field of fields) {
        if (record.fields[field] !== undefined) {
          result[field] = record.fields[field];
          console.log(`找到欄位 "${field}": ${record.fields[field]}`);
        } else {
          console.log(`欄位 "${field}" 不存在於記錄中`);
          console.log(`可用的欄位: ${Object.keys(record.fields).join(', ')}`);
        }
      }
    } else {
      // 如果沒有指定欄位，回傳所有欄位
      result = record.fields;
    }

    console.log(`取得 ${tableId} 第 ${recordIndex + 1} 筆記錄:`, result);
    return result;
  } else {
    throw new Error(
      `找不到第 ${recordIndex + 1} 筆記錄，總共只有 ${
        data.records ? data.records.length : 0
      } 筆記錄`
    );
  }
}

// 模擬資料（當 API 未設定或失敗時使用）
async function fetchMockData(tableName, rowNumber, fields) {
  // 模擬 API 延遲
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 範例資料（實際使用時會從 Airtable API 取得）
  const sampleData = {
    products: {
      1: {
        name: 'iPhone 15 Pro',
        price: 'NT$ 35,900',
        description: '最新款 iPhone，搭載 A17 Pro 晶片',
      },
      2: {
        name: 'MacBook Air M2',
        price: 'NT$ 32,900',
        description: '輕薄筆電，搭載 M2 晶片',
      },
      3: {
        name: 'iPad Pro 12.9',
        price: 'NT$ 28,900',
        description: '專業級平板電腦',
      },
    },
    customers: {
      1: { name: '張小明', email: 'ming@example.com', phone: '0912-345-678' },
      2: { name: '李小華', email: 'hua@example.com', phone: '0923-456-789' },
      3: { name: '王小美', email: 'mei@example.com', phone: '0934-567-890' },
    },
    orders: {
      1: { order_id: 'ORD-001', date: '2024-01-15', amount: 'NT$ 35,900' },
      2: { order_id: 'ORD-002', date: '2024-01-16', amount: 'NT$ 32,900' },
      3: { order_id: 'ORD-003', date: '2024-01-17', amount: 'NT$ 28,900' },
    },
    inventory: {
      1: { product_id: 'P001', stock: '50', location: '台北倉庫' },
      2: { product_id: 'P002', stock: '30', location: '台中倉庫' },
      3: { product_id: 'P003', stock: '25', location: '高雄倉庫' },
    },
  };

  const tableData = sampleData[tableName];
  if (!tableData || !tableData[rowNumber]) {
    throw new Error(`找不到 ${tableName} 的第 ${rowNumber} 筆資料`);
  }

  const rowData = tableData[rowNumber];
  const result = {};

  // 只回傳指定的欄位
  for (const field of fields) {
    if (rowData[field] !== undefined) {
      result[field] = rowData[field];
    }
  }

  return result;
}

// 根據列號取得記錄 ID
async function getRecordIdByRowNumber(tableId, rowNumber) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${tableId}?pageSize=100`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`取得記錄列表失敗: ${response.status}`);
  }

  const data = await response.json();

  if (data.records && data.records.length >= rowNumber) {
    return data.records[rowNumber - 1].id;
  } else {
    throw new Error(`找不到第 ${rowNumber} 筆記錄`);
  }
}

// 實際的 Airtable API 整合（需要替換成您的 API Key 和 Base ID）
async function fetchFromAirtable(tableId, recordId, fields) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${tableId}/${recordId}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Airtable API 錯誤: ${response.status}`);
  }

  const data = await response.json();
  return data.fields;
}

// 檢查表單結構
async function checkTableStructure(tableName) {
  try {
    const tableId = AIRTABLE_CONFIG.tables[tableName];
    if (!tableId) {
      return { error: `找不到表單 ${tableName} 的設定` };
    }

    // 先取得表單的基本資訊
    const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${tableId}?pageSize=3`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { error: `API 錯誤: ${response.status}` };
    }

    const data = await response.json();
    
    // 取得 Views 資訊
    const viewsInfo = await getTableViews(tableId);
    
    return {
      tableId: tableId,
      recordCount: data.records ? data.records.length : 0,
      fields:
        data.records && data.records.length > 0
          ? Object.keys(data.records[0].fields)
          : [],
      firstRecord:
        data.records && data.records.length > 0 ? data.records[0] : null,
      allRecords: data.records || [],
      views: viewsInfo.views || [],
    };
  } catch (error) {
    return { error: error.message };
  }
}

// 取得表單的 Views
async function getTableViews(tableId) {
  try {
    // 注意：Views API 需要不同的端點
    const url = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_CONFIG.baseId}/tables/${tableId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('無法取得 Views 資訊，使用預設設定');
      return { views: [] };
    }

    const data = await response.json();
    console.log('Views 資訊:', data);
    
    return {
      views: data.views || []
    };
  } catch (error) {
    console.log('取得 Views 時發生錯誤:', error);
    return { views: [] };
  }
}

// 顯示資料
function displayData(table1Data, table2Data) {
  const tbody = elements.tableBody;
  tbody.innerHTML = '';

  // 取得所有欄位名稱
  const allFields = new Set([
    ...Object.keys(table1Data),
    ...Object.keys(table2Data),
  ]);

  // 為每個欄位建立一列
  for (const field of allFields) {
    const row = document.createElement('tr');

    const fieldCell = document.createElement('td');
    fieldCell.textContent = field;
    fieldCell.style.fontWeight = 'bold';

    const table1Cell = document.createElement('td');
    table1Cell.textContent = table1Data[field] || '-';

    const table2Cell = document.createElement('td');
    table2Cell.textContent = table2Data[field] || '-';

    row.appendChild(fieldCell);
    row.appendChild(table1Cell);
    row.appendChild(table2Cell);

    tbody.appendChild(row);
  }
}

// 列印功能
function printData() {
  if (!currentData.table1 && !currentData.table2) {
    alert('沒有資料可以列印');
    return;
  }

  // 建立列印視窗
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Airtable 資料列印</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
        .header { text-align: center; margin-bottom: 20px; }
        .timestamp { font-size: 12px; color: #666; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Airtable 資料列印</h1>
        <div class="timestamp">列印時間: ${new Date().toLocaleString(
          'zh-TW'
        )}</div>
      </div>
      ${document.getElementById('dataTable').outerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}
