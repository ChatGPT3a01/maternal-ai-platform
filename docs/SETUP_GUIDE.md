# 產婦 AI 問答平台 - 完整設置指南

本指南將協助您完成平台的部署和 Google Sheets 追蹤系統設置。

## 目錄

1. [環境需求](#環境需求)
2. [Google Sheets 設置](#google-sheets-設置)
3. [環境變數設定](#環境變數設定)
4. [本地開發](#本地開發)
5. [部署到 Vercel](#部署到-vercel)
6. [測試追蹤功能](#測試追蹤功能)
7. [常見問題](#常見問題)

---

## 環境需求

- Node.js 18.17 或更高版本
- npm 或 yarn
- Google 帳號
- Gemini API Key 或 OpenAI API Key（用於 AI 問答功能）

---

## Google Sheets 設置

### 步驟 1：準備 Google Sheets

1. 開啟您的 Google Sheets：
   https://docs.google.com/spreadsheets/d/1x49JHHsD_pSXQ9v8J2KLugcstJxz1Y5koj3on8x5Fks/edit

2. 確認您有該試算表的編輯權限

### 步驟 2：建立 Google Apps Script

1. 在 Google Sheets 中，點選頂部選單：**擴充功能** → **Apps Script**

2. 刪除預設的程式碼，複製 `docs/google-apps-script.js` 的完整內容貼上

3. 確認程式碼中的 `SHEET_ID` 正確：
   ```javascript
   const SHEET_ID = '1x49JHHsD_pSXQ9v8J2KLugcstJxz1Y5koj3on8x5Fks';
   ```

4. 點選上方的**儲存**按鈕（磁碟圖示）

5. 為專案命名（例如：「產婦平台追蹤系統」）

### 步驟 3：測試 Apps Script

在部署前先測試程式碼是否正常運作：

1. 在 Apps Script 編輯器中，從頂部函數選單選擇 `testInsert`

2. 點選**執行**按鈕（播放圖示）

3. 第一次執行時會要求授權：
   - 點選「檢閱權限」
   - 選擇您的 Google 帳號
   - 點選「進階」→「前往 [專案名稱]（不安全）」
   - 點選「允許」

4. 執行完成後，檢查您的 Google Sheets：
   - 應該會自動建立一個名為「追蹤資料」的工作表
   - 工作表應該有表頭和一筆測試資料

5. 如果測試成功，可以執行 `clearAllData` 函數清除測試資料

### 步驟 4：部署為 Web App

1. 在 Apps Script 編輯器中，點選右上角的**部署** → **新增部署作業**

2. 點選「選取類型」旁的齒輪圖示，選擇**網頁應用程式**

3. 填寫部署資訊：
   - **說明**：輸入版本說明（例如：「初始版本」）
   - **執行身分**：選擇「我」
   - **具有存取權的使用者**：選擇「所有人」

   ⚠️ **重要**：必須選擇「所有人」，否則前端無法匿名上傳資料

4. 點選**部署**

5. 複製產生的 **Web App URL**（格式如：`https://script.google.com/macros/s/XXXXX/exec`）

   ⚠️ **重要**：這個 URL 非常重要，請妥善保存

### 步驟 5：測試 Web App

使用以下方式測試 Web App 是否正常運作：

#### 方法 1：瀏覽器測試（GET 請求）

直接在瀏覽器開啟 Web App URL，應該會看到類似以下的回應：
```json
{
  "success": true,
  "message": "Google Apps Script is running",
  "timestamp": "2025-01-15T12:00:00.000Z"
}
```

#### 方法 2：使用 curl 測試（POST 請求）

```bash
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '[{"userId":"test_001","timestamp":"2025-01-15T12:00:00.000Z","eventType":"page_view","page":"測試"}]'
```

執行後檢查 Google Sheets 是否有新增資料。

---

## 環境變數設定

### 本地開發環境

在專案根目錄建立 `.env.local` 檔案：

```bash
# Google Sheets 追蹤系統
NEXT_PUBLIC_GOOGLE_WEBAPP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_TRACKING_SHEET_ID=1x49JHHsD_pSXQ9v8J2KLugcstJxz1Y5koj3on8x5Fks

# Google Forms 問卷連結
NEXT_PUBLIC_PRETEST_URL=https://docs.google.com/forms/d/1pWj9TwGCWUt0cZGmtGdVg2iITi7bbpKc6dXhwyi3qRw/viewform
NEXT_PUBLIC_POSTTEST_URL=https://docs.google.com/forms/d/1dwJhVsQFOEuR18w3wKZn8Z3Nu4td4OXuPnC_HMFQVZc/viewform
```

⚠️ **重要**：請將 `YOUR_SCRIPT_ID` 替換為您在步驟 4 取得的實際 Web App URL

### 檔案說明

| 環境變數 | 說明 | 必填 |
|---------|------|------|
| `NEXT_PUBLIC_GOOGLE_WEBAPP_URL` | Google Apps Script Web App URL | ✅ 是 |
| `NEXT_PUBLIC_TRACKING_SHEET_ID` | Google Sheets ID（用於顯示） | ⭕ 選填 |
| `NEXT_PUBLIC_PRETEST_URL` | 前測問卷連結 | ✅ 是 |
| `NEXT_PUBLIC_POSTTEST_URL` | 後測問卷連結 | ✅ 是 |

---

## 本地開發

### 1. 安裝相依套件

```bash
npm install
# 或
yarn install
```

### 2. 啟動開發伺服器

```bash
npm run dev
# 或
yarn dev
```

### 3. 開啟瀏覽器

訪問 http://localhost:3000

### 4. 測試追蹤功能

1. 開啟瀏覽器的開發者工具（F12）→ Console 標籤

2. 瀏覽各個頁面，觀察 Console 輸出：
   - 應該會看到類似「📤 已發送追蹤資料到 Google Sheets」的訊息

3. 檢查 localStorage：
   - 在 Console 中輸入：`localStorage.getItem('maternal-user-id')`
   - 應該會看到一個自動生成的使用者 ID

4. 等待 30 秒或執行 10 個以上的操作後，檢查 Google Sheets：
   - 應該會有新的追蹤資料寫入

### 5. 手動觸發同步（測試用）

在瀏覽器 Console 中執行：

```javascript
// 取得追蹤佇列
const queue = JSON.parse(localStorage.getItem('maternal-tracking-queue') || '[]');
console.log('目前佇列中有', queue.length, '筆資料');

// 手動觸發同步（需要在有使用 useTracking hook 的頁面執行）
// 例如在 Chat 頁面的 Console 中執行
```

---

## 部署到 Vercel

### 方法 1：使用 Vercel CLI

1. 安裝 Vercel CLI：
   ```bash
   npm install -g vercel
   ```

2. 登入 Vercel：
   ```bash
   vercel login
   ```

3. 部署專案：
   ```bash
   vercel
   ```

4. 設定環境變數：
   ```bash
   vercel env add NEXT_PUBLIC_GOOGLE_WEBAPP_URL
   vercel env add NEXT_PUBLIC_TRACKING_SHEET_ID
   vercel env add NEXT_PUBLIC_PRETEST_URL
   vercel env add NEXT_PUBLIC_POSTTEST_URL
   ```

5. 重新部署以套用環境變數：
   ```bash
   vercel --prod
   ```

### 方法 2：使用 Vercel Dashboard

1. 訪問 https://vercel.com/

2. 點選「Add New...」→「Project」

3. 從 GitHub 匯入專案（需先將程式碼推送到 GitHub）

4. 在「Environment Variables」區塊加入環境變數：
   - `NEXT_PUBLIC_GOOGLE_WEBAPP_URL`
   - `NEXT_PUBLIC_TRACKING_SHEET_ID`
   - `NEXT_PUBLIC_PRETEST_URL`
   - `NEXT_PUBLIC_POSTTEST_URL`

5. 點選「Deploy」

6. 部署完成後，訪問提供的 URL 測試功能

---

## 測試追蹤功能

### 測試清單

完成部署後，請依序測試以下功能：

#### ✅ 頁面瀏覽追蹤

- [ ] 訪問「待產注意事項」頁面
- [ ] 停留 10 秒後離開
- [ ] 檢查 Google Sheets 是否有 `page_view` 事件記錄

#### ✅ 閱讀進度追蹤

- [ ] 訪問「待產知識 - 認識產兆」頁面
- [ ] 完整滾動頁面到底部
- [ ] 停留至少 2 分鐘
- [ ] 檢查 Google Sheets 是否有 `reading` 事件記錄
- [ ] 檢查 localStorage 是否標記該章節為已完成

#### ✅ 提問記錄追蹤

- [ ] 在知識頁面點選「詢問 AI 更多」按鈕
- [ ] 選擇一個預設問題
- [ ] 檢查 Google Sheets 是否有 `question` 事件記錄
- [ ] 檢查 metadata 是否包含來源資訊

#### ✅ 學習進度追蹤

- [ ] 訪問首頁
- [ ] 檢查是否顯示學習進度卡片
- [ ] 完成幾個章節的閱讀後，重新載入首頁
- [ ] 確認進度百分比有更新
- [ ] 檢查 Google Sheets 是否有 `progress` 事件記錄

#### ✅ 批次上傳機制

- [ ] 在 10 秒內快速瀏覽多個頁面（超過 10 個操作）
- [ ] 觀察 Console 是否出現批次上傳訊息
- [ ] 檢查 Google Sheets 是否一次寫入多筆資料

#### ✅ 離線暫存機制

- [ ] 開啟開發者工具 → Network 標籤
- [ ] 勾選 "Offline" 模擬離線狀態
- [ ] 瀏覽幾個頁面
- [ ] 檢查 localStorage 中的 `maternal-tracking-queue` 是否累積資料
- [ ] 取消 Offline 模式
- [ ] 等待 30 秒，確認資料自動同步到 Google Sheets

---

## 常見問題

### Q1：追蹤資料沒有寫入 Google Sheets

**可能原因與解決方法：**

1. **Web App URL 錯誤**
   - 檢查 `.env.local` 中的 URL 是否正確
   - 確認 URL 結尾是 `/exec`

2. **Apps Script 權限不足**
   - 重新執行 Apps Script 中的 `testInsert` 函數
   - 重新授權權限

3. **CORS 問題**
   - 確認 Apps Script 部署時選擇「所有人」可存取
   - 前端使用 `mode: 'no-cors'` 無法讀取回應內容（這是正常的）

4. **批次佇列未觸發**
   - 檢查是否累積 10 筆資料或等待 30 秒
   - 可在 Console 手動執行同步（參考「本地開發」章節）

### Q2：學習進度沒有更新

**可能原因與解決方法：**

1. **閱讀時間不足**
   - 確認停留時間 ≥ 預估時間的 50%
   - 預設預估時間為 5 分鐘，即需停留 2.5 分鐘以上

2. **滾動深度不足**
   - 確認滾動深度 ≥ 80%
   - 需要滾動到接近頁面底部

3. **localStorage 被清除**
   - 檢查瀏覽器是否啟用隱私模式
   - 檢查是否有瀏覽器擴充套件清除了 localStorage

### Q3：首頁彈出視窗重複出現

**解決方法：**

檢查 localStorage：
```javascript
localStorage.getItem('maternal-show-pretest-dialog')
```

如果值為 `null`，表示尚未設定。點選「稍後填寫」或「前往填寫問卷」後應該會設定為 `'seen'`。

手動設定（測試用）：
```javascript
localStorage.setItem('maternal-show-pretest-dialog', 'seen')
```

### Q4：如何重置學習進度（測試用）

在瀏覽器 Console 執行：

```javascript
// 清除已完成章節
localStorage.removeItem('maternal-completed-sections');

// 清除追蹤佇列
localStorage.removeItem('maternal-tracking-queue');

// 清除使用者 ID（會重新生成）
localStorage.removeItem('maternal-user-id');

// 清除前測彈窗狀態
localStorage.removeItem('maternal-show-pretest-dialog');

// 重新載入頁面
location.reload();
```

### Q5：如何查看追蹤資料統計

建議在 Google Sheets 中使用以下方式分析資料：

#### 使用者活躍度統計
```
=COUNTUNIQUE(A2:A)  // 總使用者數
```

#### 各事件類型統計
```
=COUNTIF(C2:C,"page_view")    // 頁面瀏覽次數
=COUNTIF(C2:C,"reading")      // 閱讀記錄次數
=COUNTIF(C2:C,"question")     // 提問次數
=COUNTIF(C2:C,"progress")     // 進度更新次數
```

#### 平均閱讀時間
```
=AVERAGE(H2:H)  // 平均停留時間（秒）
```

#### 平均滾動深度
```
=AVERAGE(I2:I)  // 平均滾動深度（%）
```

### Q6：如何更新 Apps Script

當需要修改追蹤邏輯時：

1. 在 Apps Script 編輯器中修改程式碼
2. 儲存變更
3. 點選「部署」→「管理部署作業」
4. 點選現有部署旁的鉛筆圖示
5. 在「版本」下拉選單選擇「新版本」
6. 輸入版本說明
7. 點選「部署」

⚠️ **注意**：Web App URL 不會改變，無需更新前端設定

---

## 資料備份建議

### 定期備份 Google Sheets

建議每週或每月備份追蹤資料：

1. **方法 1：手動備份**
   - 點選「檔案」→「下載」→「Microsoft Excel (.xlsx)」
   - 或「逗號分隔值 (.csv)」

2. **方法 2：自動備份（Google Drive）**
   - 在 Apps Script 中新增定時觸發器
   - 每週自動複製一份備份到指定資料夾

### 範例：自動備份程式碼

在 Apps Script 中新增以下函數：

```javascript
function createWeeklyBackup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const backupFolder = DriveApp.getFolderById('YOUR_BACKUP_FOLDER_ID');

  const timestamp = Utilities.formatDate(new Date(), 'GMT+8', 'yyyy-MM-dd');
  const backupName = `追蹤資料備份_${timestamp}`;

  ss.copy(backupName).moveTo(backupFolder);
  Logger.log(`已建立備份：${backupName}`);
}
```

設定觸發器：
1. 點選左側「觸發條件」（時鐘圖示）
2. 點選「新增觸發條件」
3. 選擇 `createWeeklyBackup` 函數
4. 選擇「時間驅動」→「週計時器」
5. 選擇執行時間（例如：每週一上午 9-10 點）

---

## 支援與聯繫

如有任何問題或需要協助，請透過以下方式聯繫：

- GitHub Issues
- 專案維護者 Email

---

## 附錄：追蹤資料結構說明

### TrackingDataRow 欄位說明

| 欄位 | 型別 | 說明 | 範例 |
|-----|------|------|------|
| `userId` | string | 匿名使用者 ID | `user_1705305600000_abc123` |
| `timestamp` | string | 事件時間戳記（ISO 8601） | `2025-01-15T12:30:00.000Z` |
| `eventType` | string | 事件類型 | `page_view`, `reading`, `question`, `progress` |
| `page` | string | 頁面名稱 | `待產注意事項` |
| `sectionId` | string | 章節 ID | `labor-signs` |
| `sectionTitle` | string | 章節標題 | `認識產兆` |
| `question` | string | 提問內容 | `什麼是真陣痛？` |
| `duration` | number | 停留時間（秒） | `180` |
| `scrollDepth` | number | 滾動深度（%） | `85` |
| `progressPercentage` | number | 學習進度（%） | `50` |
| `metadata` | string | 額外資訊（JSON） | `{"context":"認識產兆"}` |

### 事件類型說明

- **page_view**: 頁面瀏覽事件，記錄使用者進入和離開頁面
- **reading**: 閱讀事件，記錄使用者閱讀知識內容的行為
- **question**: 提問事件，記錄使用者向 AI 提出的問題
- **progress**: 進度更新事件，記錄學習進度變化

---

**更新日期：2025-01-15**
**文件版本：1.0.0**
