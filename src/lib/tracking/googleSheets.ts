import type { TrackingDataRow } from '@/types';

// Google Apps Script Web App URL（將在 .env.local 中設定）
const WEBAPP_URL = process.env.NEXT_PUBLIC_GOOGLE_WEBAPP_URL || '';

export async function uploadToGoogleSheets(data: TrackingDataRow[]): Promise<void> {
  if (!WEBAPP_URL) {
    console.warn('⚠️ Google Sheets Web App URL 未設定，追蹤功能將不會運作');
    return;
  }

  if (data.length === 0) {
    return;
  }

  try {
    const response = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // Google Apps Script 需要
      },
      body: JSON.stringify(data),
      mode: 'no-cors', // Google Apps Script 需要
    });

    // 注意：no-cors 模式下無法讀取 response
    // 只能假設成功
    console.log('📤 已發送追蹤資料到 Google Sheets');
  } catch (error) {
    console.error('❌ Google Sheets 上傳錯誤:', error);
    throw error;
  }
}

/**
 * 測試 Google Sheets 連線
 */
export async function testGoogleSheetsConnection(): Promise<boolean> {
  if (!WEBAPP_URL) {
    return false;
  }

  try {
    await uploadToGoogleSheets([
      {
        userId: 'test_user',
        timestamp: new Date().toISOString(),
        eventType: 'page_view',
        page: 'test',
      },
    ]);
    return true;
  } catch (error) {
    return false;
  }
}
