# Airtable API 設定指南

## 🔑 步驟 1：取得 API Key

1. 前往 [Airtable Account](https://airtable.com/account)
2. 點擊 "API" 標籤
3. 點擊 "Generate API key"
4. 複製生成的 API Key（格式如：`keyXXXXXXXXXXXXXX`）

## 🏠 步驟 2：取得 Base ID

1. 在您的 Airtable 網址中找到 Base ID
2. 格式如：`https://airtable.com/appXXXXXXXXXXXXXX/...`
3. 複製 `appXXXXXXXXXXXXXX` 部分

## 📊 步驟 3：取得 Table IDs

### 方法 A：從 Airtable 介面取得

1. 在 Airtable 中點擊表單名稱旁的設定圖示 ⚙️
2. 選擇 "API"
3. 複製 "Table ID"（格式如：`tblXXXXXXXXXXXXXX`）

### 方法 B：從網址取得

1. 在 Airtable 中點擊表單
2. 查看網址列，格式如：`https://airtable.com/appXXXXXXXXXXXXXX/tblYYYYYYYYYYYYYY/...`
3. 複製 `tblYYYYYYYYYYYYYY` 部分

## ⚙️ 步驟 4：更新程式碼

編輯 `src/js/main.js` 檔案，找到 `AIRTABLE_CONFIG` 區塊：

```javascript
const AIRTABLE_CONFIG = {
  // 🔑 請替換成您的 Airtable API Key
  apiKey: 'keyXXXXXXXXXXXXXX', // 您的 API Key

  // 🏠 請替換成您的 Base ID
  baseId: 'appXXXXXXXXXXXXXX', // 您的 Base ID

  // 📊 請替換成您的 Table IDs
  tables: {
    products: 'tblProducts', // 產品資料表 ID
    customers: 'tblCustomers', // 客戶資料表 ID
    orders: 'tblOrders', // 訂單資料表 ID
    inventory: 'tblInventory', // 庫存資料表 ID
  },
};
```

## 🧪 步驟 5：測試連接

1. 重新編譯專案：`npm run build`
2. 開啟瀏覽器：`http://127.0.0.1:8080`
3. 選擇表單和欄位
4. 點擊「取得資料」測試連接

## 🔍 常見問題

### Q: API Key 無效？

A: 確保 API Key 格式正確，以 `key` 開頭

### Q: Base ID 找不到？

A: 檢查網址是否正確，Base ID 以 `app` 開頭

### Q: Table ID 錯誤？

A: 確保 Table ID 以 `tbl` 開頭，並且表單名稱正確

### Q: 權限錯誤？

A: 確保 API Key 有讀取權限，在 Airtable 中檢查表單權限設定

## 📝 範例設定

假設您的 Airtable 資訊如下：

- API Key: `key1234567890abcdef`
- Base ID: `appABCDEFGHIJKLMN`
- 產品表 ID: `tblProducts123`
- 客戶表 ID: `tblCustomers456`

則設定應該是：

```javascript
const AIRTABLE_CONFIG = {
  apiKey: 'key1234567890abcdef',
  baseId: 'appABCDEFGHIJKLMN',
  tables: {
    products: 'tblProducts123',
    customers: 'tblCustomers456',
    orders: 'tblOrders789',
    inventory: 'tblInventory012',
  },
};
```
