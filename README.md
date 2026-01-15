# 產婦 AI 問答平台 (Baby Landing)

一個整合待產知識學習與 AI 智慧問答的產婦衛教平台，提供完整的使用者學習追蹤功能。

## 專案特色

- 📚 **完整知識庫**：涵蓋待產注意事項、產兆辨識、產程進展、減痛方法等資訊
- 🤖 **AI 智慧問答**：每個知識點都能直接詢問 AI，獲得個人化解答
- 📊 **學習追蹤**：自動記錄閱讀進度、提問記錄、停留時間等資料
- 📝 **前後測問卷**：評估學習成效
- 🎨 **響應式設計**：支援桌面、平板、手機多種裝置

## 技術架構

- **前端框架**：Next.js 14 (App Router)
- **UI 組件**：shadcn/ui + Tailwind CSS
- **AI 整合**：支援 Gemini 和 OpenAI
- **資料追蹤**：Google Sheets + Apps Script
- **狀態管理**：React Hooks + localStorage

## 快速開始

### 1. 安裝相依套件

```bash
npm install
```

### 2. 設定環境變數

```bash
# 複製環境變數模板
cp .env.local.example .env.local

# 編輯 .env.local，填入您的設定值
```

### 3. 設定 Google Sheets 追蹤系統

詳細步驟請參考 [完整設置指南](docs/SETUP_GUIDE.md)

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 http://localhost:3000

## 專案結構

```
maternal-ai-platform/
├── src/
│   ├── app/                    # Next.js App Router 頁面
│   │   ├── page.tsx           # 首頁 (Baby Landing)
│   │   ├── labor-care/        # 待產注意事項
│   │   ├── labor-knowledge/   # 待產知識
│   │   ├── quiz/              # 測驗問卷
│   │   └── chat/              # AI 問答
│   ├── components/            # React 組件
│   │   ├── Knowledge/         # 知識展示組件
│   │   ├── Chat/              # 聊天介面組件
│   │   ├── Tracking/          # 追蹤組件
│   │   └── Layout/            # 佈局組件
│   ├── lib/                   # 工具函數
│   │   └── tracking/          # 追蹤系統
│   ├── hooks/                 # React Hooks
│   ├── data/                  # 知識庫 JSON
│   └── types/                 # TypeScript 型別定義
├── docs/                      # 文件
│   ├── SETUP_GUIDE.md        # 完整設置指南
│   └── google-apps-script.js # Google Apps Script 程式碼
└── public/                    # 靜態資源
```

## 主要功能

### 1. 知識學習

- **待產注意事項**：完整的待產準備指南
- **待產知識**：
  - 認識產兆
  - 產程進展
  - 減痛方法

### 2. AI 問答

- 支援自然語言提問
- 整合 Gemini 和 OpenAI 模型
- 知識點旁的「詢問 AI 更多」按鈕提供預設問題

### 3. 學習追蹤

自動追蹤以下資料並上傳至 Google Sheets：

- **頁面瀏覽**：記錄訪問的頁面和停留時間
- **閱讀記錄**：記錄滾動深度和閱讀時間
- **提問記錄**：記錄所有 AI 提問內容和來源
- **學習進度**：計算完成章節數和進度百分比

### 4. 測驗評估

- **前測問卷**：學習前的知識水平評估
- **後測問卷**：學習後的成效評估

## 追蹤系統架構

```
使用者行為
    ↓
React Hooks (usePageView, useReadingProgress, useTracking)
    ↓
Analytics Service (TrackingQueue)
    ↓
localStorage 暫存 (批次佇列)
    ↓
Google Apps Script Web App (API)
    ↓
Google Sheets (資料儲存)
```

### 追蹤機制特色

- ✅ 批次上傳（累積 10 筆或 30 秒）
- ✅ 失敗重試（最多 3 次）
- ✅ 離線暫存（localStorage）
- ✅ 匿名追蹤（UUID）
- ✅ 跨 tab 同步

## 部署

### Vercel 部署（推薦）

```bash
# 使用 Vercel CLI
vercel

# 或訪問 https://vercel.com/ 透過 UI 部署
```

記得在 Vercel 設定環境變數：
- `NEXT_PUBLIC_GOOGLE_WEBAPP_URL`
- `NEXT_PUBLIC_TRACKING_SHEET_ID`
- `NEXT_PUBLIC_PRETEST_URL`
- `NEXT_PUBLIC_POSTTEST_URL`

詳細部署步驟請參考 [完整設置指南](docs/SETUP_GUIDE.md#部署到-vercel)

## 文件

- 📖 [完整設置指南](docs/SETUP_GUIDE.md) - 詳細的環境設置和部署教學
- 📜 [Google Apps Script](docs/google-apps-script.js) - 追蹤系統後端程式碼

## 測試

### 本地測試

```bash
npm run dev
```

### 追蹤功能測試

1. 開啟瀏覽器開發者工具 (F12)
2. 瀏覽各個頁面
3. 觀察 Console 輸出
4. 檢查 localStorage 資料
5. 確認 Google Sheets 有新增資料

詳細測試清單請參考 [完整設置指南](docs/SETUP_GUIDE.md#測試追蹤功能)

## 環境變數

| 變數名稱 | 說明 | 必填 |
|---------|------|------|
| `NEXT_PUBLIC_GOOGLE_WEBAPP_URL` | Google Apps Script Web App URL | ✅ |
| `NEXT_PUBLIC_TRACKING_SHEET_ID` | Google Sheets ID | ⭕ |
| `NEXT_PUBLIC_PRETEST_URL` | 前測問卷連結 | ✅ |
| `NEXT_PUBLIC_POSTTEST_URL` | 後測問卷連結 | ✅ |

## 技術細節

### 閱讀完成判定

章節標記為「已完成」需同時滿足：
- 停留時間 ≥ 預估閱讀時間 × 50%
- 滾動深度 ≥ 80%

### 批次上傳機制

- 自動觸發條件：
  - 累積 10 筆追蹤資料
  - 或距離上次上傳超過 30 秒
- 失敗重試：最多 3 次
- 離線支援：暫存於 localStorage

### 匿名追蹤

- 自動生成 UUID：`user_${timestamp}_${random}`
- 儲存於 localStorage：`maternal-user-id`
- 不記錄任何個人識別資訊

## 常見問題

請參考 [完整設置指南 - 常見問題](docs/SETUP_GUIDE.md#常見問題)

## 免責聲明

本平台提供的資訊僅供參考，不能取代專業醫療診斷與治療。如有任何健康疑慮，請諮詢您的醫師或其他醫療專業人員。

## 授權

此專案僅供研究和教育用途使用。

## 聯絡資訊

如有任何問題或建議，歡迎透過 GitHub Issues 聯繫。

---

**更新日期**：2025-01-15
**版本**：1.0.0
**開發框架**：Next.js 14 + TypeScript
