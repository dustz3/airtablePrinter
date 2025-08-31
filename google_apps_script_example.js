// Google Apps Script - Airwaybill 自動生成系統
// 檔案：Code.gs

// Airtable 設定
const AIRTABLE_CONFIG = {
  apiKey:
    'patqmy3J0VA0nHm87.bed450c15850e26960b3da0f0e91f1a9328c2c0831bf6577f69cf54194168823',
  baseId: 'appV5HA6H7YDjyG2K',
  tableId: 'tbllTAZHEmQ4axqeX', // 您的 shipments 表單 ID
};

// Google Docs 模板設定
const TEMPLATE_CONFIG = {
  templateId: 'YOUR_TEMPLATE_DOCUMENT_ID', // 您的 Google Docs 模板 ID
  folderId: 'YOUR_FOLDER_ID', // 儲存生成文件的資料夾 ID
};

/**
 * 主要函數：根據單號生成 Airwaybill
 * @param {string} awbNumber - 單號 (例如: TM-111111)
 * @returns {string} 生成文件的 URL
 */
function generateAirwaybill(awbNumber) {
  try {
    console.log(`開始生成 Airwaybill: ${awbNumber}`);

    // 1. 從 Airtable 取得資料
    const shipmentData = getShipmentData(awbNumber);
    if (!shipmentData) {
      throw new Error(`找不到單號 ${awbNumber} 的資料`);
    }

    console.log('取得 Airtable 資料:', shipmentData);

    // 2. 複製模板文件
    const newDoc = copyTemplateDocument(awbNumber);

    // 3. 填入資料
    fillDocumentContent(newDoc.getId(), shipmentData);

    // 4. 返回文件 URL
    const docUrl = newDoc.getUrl();
    console.log(`文件生成完成: ${docUrl}`);

    return {
      success: true,
      documentUrl: docUrl,
      documentId: newDoc.getId(),
    };
  } catch (error) {
    console.error('生成文件時發生錯誤:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 從 Airtable 取得運單資料
 * @param {string} awbNumber - 單號
 * @returns {object} 運單資料
 */
function getShipmentData(awbNumber) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}?filterByFormula={AWB_Number}='${awbNumber}'`;

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
  };

  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());

  if (data.records && data.records.length > 0) {
    return data.records[0].fields;
  }

  return null;
}

/**
 * 複製模板文件
 * @param {string} awbNumber - 單號
 * @returns {File} 新的文件物件
 */
function copyTemplateDocument(awbNumber) {
  const template = DriveApp.getFileById(TEMPLATE_CONFIG.templateId);
  const newFileName = `Airwaybill_${awbNumber}_${
    new Date().toISOString().split('T')[0]
  }`;

  // 複製到指定資料夾
  const folder = DriveApp.getFolderById(TEMPLATE_CONFIG.folderId);
  const newDoc = template.makeCopy(newFileName, folder);

  console.log(`模板複製完成: ${newDoc.getName()}`);
  return newDoc;
}

/**
 * 填入文件內容
 * @param {string} documentId - 文件 ID
 * @param {object} data - 要填入的資料
 */
function fillDocumentContent(documentId, data) {
  const doc = DocumentApp.openById(documentId);
  const body = doc.getBody();

  // 定義欄位對應
  const fieldMappings = {
    '{{AWB_Number}}': data.AWB_Number || '',
    '{{Shipper_Company}}': data.Shipper_Company || '',
    '{{Shipper_Address}}': data.Shipper_Address || '',
    '{{Shipper_Contact}}': data.Shipper_Contact || '',
    '{{Shipper_Phone}}': data.Shipper_Phone || '',
    '{{Consignee_Company}}': data.Consignee_Company || '',
    '{{Consignee_Address}}': data.Consignee_Address || '',
    '{{Consignee_Contact}}': data.Consignee_Contact || '',
    '{{Consignee_Phone}}': data.Consignee_Phone || '',
    '{{Weight}}': data.Weight || '',
    '{{Dimensions}}': data.Dimensions || '',
    '{{Pieces}}': data.Pieces || '1',
    '{{Special_Instructions}}': data.Special_Instructions || '',
    '{{Delivery_Deadline}}': data.Delivery_Deadline || 'ASAP',
    '{{Pickup_Date}}': new Date().toLocaleDateString(),
    '{{Generated_Date}}': new Date().toLocaleDateString(),
  };

  // 替換所有欄位
  for (const [placeholder, value] of Object.entries(fieldMappings)) {
    body.replaceText(placeholder, value);
  }

  // 儲存文件
  doc.saveAndClose();

  console.log('文件內容填入完成');
}

/**
 * 建立 Web App 端點（供外部呼叫）
 * 這個函數可以從您的網頁應用呼叫
 */
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const awbNumber = requestData.awbNumber;

    if (!awbNumber) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: '缺少單號參數',
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const result = generateAirwaybill(awbNumber);

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.message,
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 測試函數
 */
function testGenerateAirwaybill() {
  const result = generateAirwaybill('TM-111111');
  console.log('測試結果:', result);
}

/**
 * 取得所有可用的模板
 */
function listTemplates() {
  const files = DriveApp.getFilesByName('Airwaybill Template');
  const templates = [];

  while (files.hasNext()) {
    const file = files.next();
    templates.push({
      id: file.getId(),
      name: file.getName(),
      url: file.getUrl(),
    });
  }

  console.log('可用模板:', templates);
  return templates;
}
