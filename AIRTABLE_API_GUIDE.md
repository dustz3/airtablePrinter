# Airtable API 訪問方式指南

## 📊 API 訪問方式

### 1. **基本訪問（整個 Table）**

```javascript
// 訪問整個表單的所有記錄
const url = `https://api.airtable.com/v0/${baseId}/${tableId}?pageSize=100`;
```

### 2. **指定欄位訪問**

```javascript
// 只取得特定欄位
const url = `https://api.airtable.com/v0/${baseId}/${tableId}?fields[]=Name&fields[]=Price&fields[]=Description`;
```

### 3. **指定 View 訪問**

```javascript
// 訪問特定 Grid View
const url = `https://api.airtable.com/v0/${baseId}/${tableId}?view=viwXXXXXXXXXXXXXX`;
```

### 4. **組合使用**

```javascript
// 指定 View 和欄位
const url = `https://api.airtable.com/v0/${baseId}/${tableId}?view=viwXXXXXXXXXXXXXX&fields[]=Name&fields[]=Price`;
```

## 🔍 取得 View ID

### 方法 1：從 Airtable 介面

1. 在 Airtable 中點擊 View 名稱旁的設定圖示 ⚙️
2. 選擇 "API"
3. 複製 "View ID"（格式如：`viwXXXXXXXXXXXXXX`）

### 方法 2：從網址取得

1. 在 Airtable 中切換到想要的 View
2. 查看網址列，格式如：`https://airtable.com/appXXXXXXXXXXXXXX/tblYYYYYYYYYYYYYY/viwZZZZZZZZZZZZZZ`
3. 複製 `viwZZZZZZZZZZZZZZ` 部分

### 方法 3：程式自動取得

程式會自動嘗試取得所有可用的 Views，並在控制台顯示。

## 📋 API 參數說明

### 基本參數

- `pageSize`: 每頁記錄數（最大 100）
- `offset`: 分頁標記
- `maxRecords`: 最大記錄數

### 過濾參數

- `fields[]`: 指定要取得的欄位
- `view`: 指定要使用的 View
- `filterByFormula`: 使用公式過濾記錄

### 排序參數

- `sort[0][field]`: 排序欄位
- `sort[0][direction]`: 排序方向（asc/desc）

## 🎯 實際應用範例

### 範例 1：取得特定 View 的所有記錄

```javascript
const url = `https://api.airtable.com/v0/appV5HA6H7YDjyG2K/tbllTAZHEmQ4axqeX?view=viwProductsGrid`;
```

### 範例 2：取得特定欄位

```javascript
const url = `https://api.airtable.com/v0/appV5HA6H7YDjyG2K/tbllTAZHEmQ4axqeX?fields[]=Name&fields[]=Price`;
```

### 範例 3：組合使用

```javascript
const url = `https://api.airtable.com/v0/appV5HA6H7YDjyG2K/tbllTAZHEmQ4axqeX?view=viwProductsGrid&fields[]=Name&fields[]=Price&pageSize=50`;
```

## 🔧 程式功能

### 目前支援的功能

- ✅ 訪問整個 Table
- ✅ 指定特定欄位
- ✅ 指定特定 View
- ✅ 自動取得 Views 列表
- ✅ 詳細的除錯資訊

### 即將加入的功能

- 🔄 View 選擇介面
- 🔄 進階過濾選項
- 🔄 排序功能
- 🔄 分頁控制

## 📝 使用建議

### 效能考量

1. **使用欄位過濾**：只取得需要的欄位，減少資料傳輸
2. **使用 View 過濾**：利用 View 的預設過濾和排序
3. **合理設定 pageSize**：避免一次載入過多資料

### 權限考量

1. **API Key 權限**：確保有讀取權限
2. **View 權限**：確保可以訪問指定的 View
3. **欄位權限**：確保可以訪問指定的欄位

## 🚀 進階功能

### 公式過濾

```javascript
// 使用公式過濾記錄
const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula={Name}='iPhone 15 Pro'`;
```

### 排序

```javascript
// 按價格排序
const url = `https://api.airtable.com/v0/${baseId}/${tableId}?sort[0][field]=Price&sort[0][direction]=desc`;
```

### 分頁

```javascript
// 使用 offset 進行分頁
const url = `https://api.airtable.com/v0/${baseId}/${tableId}?pageSize=10&offset=recXXXXXXXXXXXXXX`;
```
