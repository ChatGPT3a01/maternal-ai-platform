/**
 * 產婦 AI 問答平台 - Google Apps Script
 * 用於接收前端追蹤資料並寫入 Google Sheets
 *
 * 使用說明：
 * 1. 在 Google Sheets 中點選「擴充功能」→「Apps Script」
 * 2. 複製此程式碼到編輯器中
 * 3. 點選「部署」→「新增部署作業」
 * 4. 選擇類型：「網頁應用程式」
 * 5. 執行身分：選擇「我」
 * 6. 具有存取權的使用者：選擇「所有人」
 * 7. 複製部署的 Web App URL 到前端 .env.local 檔案
 */

// ==================== 設定區 ====================

// 您的 Google Sheets ID（從 URL 取得）
// 例如：https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
const SHEET_ID = '1x49JHHsD_pSXQ9v8J2KLugcstJxz1Y5koj3on8x5Fks';

// 工作表名稱（如果不存在會自動建立）
const SHEET_NAME = '追蹤資料';

// ==================== 主要功能 ====================

/**
 * 處理 POST 請求
 * 接收前端傳來的追蹤資料
 */
function doPost(e) {
  try {
    // 解析請求資料
    const requestData = JSON.parse(e.postData.contents);

    // 取得或建立工作表
    const sheet = getOrCreateSheet();

    // 批次寫入資料
    if (Array.isArray(requestData)) {
      writeDataBatch(sheet, requestData);

      return createResponse({
        success: true,
        message: `成功寫入 ${requestData.length} 筆資料`,
        count: requestData.length
      });
    } else {
      // 單筆資料
      writeDataSingle(sheet, requestData);

      return createResponse({
        success: true,
        message: '成功寫入 1 筆資料',
        count: 1
      });
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());

    return createResponse({
      success: false,
      error: error.toString()
    }, 500);
  }
}

/**
 * 處理 GET 請求（用於測試）
 */
function doGet(e) {
  return createResponse({
    success: true,
    message: 'Google Apps Script is running',
    timestamp: new Date().toISOString()
  });
}

// ==================== 工作表操作 ====================

/**
 * 取得或建立工作表
 */
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  // 如果工作表不存在，建立新的
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);

    // 設定表頭
    const headers = [
      'userId',
      'timestamp',
      'eventType',
      'page',
      'sectionId',
      'sectionTitle',
      'question',
      'duration',
      'scrollDepth',
      'progressPercentage',
      'metadata'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // 格式化表頭
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f3f3f3');
    headerRange.setHorizontalAlignment('center');

    // 凍結表頭
    sheet.setFrozenRows(1);

    // 自動調整欄寬
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  return sheet;
}

/**
 * 批次寫入資料
 */
function writeDataBatch(sheet, dataArray) {
  if (dataArray.length === 0) return;

  // 準備資料列
  const rows = dataArray.map(item => [
    item.userId || '',
    item.timestamp || new Date().toISOString(),
    item.eventType || '',
    item.page || '',
    item.sectionId || '',
    item.sectionTitle || '',
    item.question || '',
    item.duration || '',
    item.scrollDepth || '',
    item.progressPercentage || '',
    item.metadata || ''
  ]);

  // 寫入資料
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, rows.length, 11).setValues(rows);

  Logger.log(`成功批次寫入 ${rows.length} 筆資料`);
}

/**
 * 單筆寫入資料
 */
function writeDataSingle(sheet, item) {
  const row = [
    item.userId || '',
    item.timestamp || new Date().toISOString(),
    item.eventType || '',
    item.page || '',
    item.sectionId || '',
    item.sectionTitle || '',
    item.question || '',
    item.duration || '',
    item.scrollDepth || '',
    item.progressPercentage || '',
    item.metadata || ''
  ];

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, 1, 11).setValues([row]);

  Logger.log('成功寫入 1 筆資料');
}

// ==================== 輔助函數 ====================

/**
 * 建立 JSON 回應
 */
function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);

  // 注意：由於前端使用 no-cors 模式，回應內容無法被讀取
  // 但伺服器端仍會正常處理請求
  return output;
}

/**
 * 測試函數：手動插入測試資料
 */
function testInsert() {
  const sheet = getOrCreateSheet();

  const testData = {
    userId: 'test_user_' + Date.now(),
    timestamp: new Date().toISOString(),
    eventType: 'page_view',
    page: '測試頁面',
    sectionId: 'test_section',
    sectionTitle: '測試章節',
    question: '',
    duration: 30,
    scrollDepth: 75,
    progressPercentage: 50,
    metadata: JSON.stringify({ test: true })
  };

  writeDataSingle(sheet, testData);
  Logger.log('測試資料已插入');
}

/**
 * 測試函數：批次插入測試資料
 */
function testBatchInsert() {
  const sheet = getOrCreateSheet();

  const testDataArray = [
    {
      userId: 'test_user_001',
      timestamp: new Date().toISOString(),
      eventType: 'page_view',
      page: '待產注意事項',
      duration: 120
    },
    {
      userId: 'test_user_001',
      timestamp: new Date().toISOString(),
      eventType: 'reading',
      sectionId: 'labor-signs',
      sectionTitle: '認識產兆',
      duration: 180,
      scrollDepth: 85
    },
    {
      userId: 'test_user_001',
      timestamp: new Date().toISOString(),
      eventType: 'question',
      question: '什麼是真陣痛？',
      metadata: JSON.stringify({ context: '認識產兆' })
    }
  ];

  writeDataBatch(sheet, testDataArray);
  Logger.log('批次測試資料已插入');
}

/**
 * 清除所有資料（保留表頭）
 */
function clearAllData() {
  const sheet = getOrCreateSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
    Logger.log(`已清除 ${lastRow - 1} 筆資料`);
  } else {
    Logger.log('沒有資料需要清除');
  }
}
