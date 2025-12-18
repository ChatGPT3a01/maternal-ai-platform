# 產婦 AI 問答平台

一個基於 Next.js 的智慧孕產諮詢平台，整合 AI 技術提供專業的孕產期衛教諮詢服務。

## 功能特色

### AI 智慧問答
- 支援 Google Gemini 與 OpenAI 兩種 AI 服務
- 內建完整的孕產期知識庫
- 即時串流回應，提供流暢的對話體驗
- 對話歷史自動保存

### 孕期追蹤
- 輸入預產期或末次月經日期
- 自動計算懷孕週數
- 顯示對應週數的發育里程碑
- 產檢項目追蹤

### 症狀自我檢查
- 分類症狀選擇（孕期/待產/產後/寶寶）
- AI 分析症狀嚴重程度
- 緊急就醫提醒
- 專業建議指引

### 寶寶成長紀錄
- 記錄身高、體重、頭圍
- 視覺化成長曲線圖表
- 餵奶與換尿布紀錄
- 疫苗接種時程提醒

## 技術架構

- **框架**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **圖表**: Recharts
- **AI**: Google Gemini API / OpenAI API
- **儲存**: 瀏覽器 localStorage（無後端）

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

### 建置部署

```bash
npm run build
npm start
```

## 使用說明

### 1. 設定 API Key

首次使用時，點擊「設定 API Key」按鈕，選擇您的 AI 服務提供商：

**Google Gemini（推薦）**
- 前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 取得 API Key
- 支援模型：gemini-2.5-flash、gemini-2.5-pro

**OpenAI**
- 前往 [OpenAI Platform](https://platform.openai.com/api-keys) 取得 API Key
- 支援模型：gpt-4o、gpt-5.2

### 2. 開始使用

設定完成後，即可使用以下功能：
- **AI 問答**: 詢問任何孕產期相關問題
- **孕期追蹤**: 追蹤您的懷孕進度
- **症狀檢查**: 快速評估症狀
- **寶寶紀錄**: 記錄寶寶成長

## API Key 安全說明

- API Key 僅儲存於您的瀏覽器 localStorage
- 不會傳送至任何第三方伺服器
- 您可以隨時清除瀏覽器資料以刪除 API Key
- 建議在 API 平台設定用量限制以控制費用

## 部署至 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/maternal-ai-platform)

1. Fork 此專案到您的 GitHub
2. 登入 [Vercel](https://vercel.com)
3. 點擊 "New Project"
4. 選擇您 Fork 的 Repository
5. 點擊 "Deploy"

## 專案結構

```
maternal-ai-platform/
├── public/
│   └── images/              # 衛教圖片資源
├── src/
│   ├── app/                 # Next.js App Router 頁面
│   │   ├── page.tsx         # 首頁
│   │   ├── chat/            # AI 問答頁面
│   │   ├── tracker/         # 孕期追蹤頁面
│   │   ├── symptoms/        # 症狀檢查頁面
│   │   └── baby/            # 寶寶紀錄頁面
│   ├── components/          # React 組件
│   │   ├── ui/              # shadcn/ui 基礎組件
│   │   ├── Chat/            # 聊天相關組件
│   │   └── Layout/          # 版面組件
│   ├── hooks/               # React Hooks
│   ├── lib/                 # 工具函式與 AI 整合
│   │   ├── ai/              # AI API 整合
│   │   ├── knowledge/       # 知識庫內容
│   │   └── utils/           # 工具函式
│   └── types/               # TypeScript 型別定義
├── package.json
└── README.md
```

## 知識庫來源

本平台整合以下衛教資源：
- 孕婦衛教手冊
- 待產知識指南
- 產後媽媽照護篇
- 新生兒照護篇

## 研究問卷

本平台整合前測與後測問卷，用於收集使用者回饋：
- [前測問卷](https://docs.google.com/forms/d/e/1FAIpQLSfemAG6blD0W_Utb_DjRFUTiWz9L-1kxioGbAD2Fll4cVtDwg/viewform) - 使用平台前填寫
- [後測問卷](https://docs.google.com/forms/d/e/1FAIpQLSfku_2HiZ0oFBvipzmIzhjlgCKeoDaTaqi-QFTHyKqktS74Hg/viewform) - 使用平台後填寫

## 免責聲明

本平台提供的資訊僅供參考，不能取代專業醫療診斷與治療。如有任何健康疑慮，請諮詢您的醫師或其他醫療專業人員。

## 授權條款

MIT License

## 貢獻指南

歡迎提交 Pull Request 或開立 Issue 來協助改善此專案。

---

如有任何問題或建議，請透過 GitHub Issues 與我們聯繫。
