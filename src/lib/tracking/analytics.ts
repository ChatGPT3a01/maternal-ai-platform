import type { TrackingDataRow } from '@/types';
import { uploadToGoogleSheets } from './googleSheets';

// 匿名使用者 ID 生成
export function getUserId(): string {
  if (typeof window === 'undefined') return '';

  let userId = localStorage.getItem('maternal-user-id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('maternal-user-id', userId);
  }
  return userId;
}

// 追蹤佇列管理
export class TrackingQueue {
  private queue: TrackingDataRow[] = [];
  private readonly MAX_QUEUE_SIZE = 10;
  private readonly SYNC_INTERVAL = 30000; // 30秒
  private syncTimer: NodeJS.Timeout | null = null;
  private retryCount = 0;
  private readonly MAX_RETRIES = 3;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadQueue();
      this.startAutoSync();

      // 頁面離開時同步
      window.addEventListener('beforeunload', () => {
        this.syncNow();
      });
    }
  }

  add(record: TrackingDataRow) {
    this.queue.push(record);
    this.saveQueue();

    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      this.syncNow();
    }
  }

  async syncNow() {
    if (this.queue.length === 0) return;

    try {
      await uploadToGoogleSheets(this.queue);
      this.queue = [];
      this.retryCount = 0;
      this.saveQueue();
      console.log('✅ 追蹤資料已上傳');
    } catch (error) {
      console.error('❌ 追蹤同步失敗:', error);
      this.retryCount++;

      if (this.retryCount >= this.MAX_RETRIES) {
        console.error('已達最大重試次數，資料保留在本地');
        // 保留在 localStorage，下次瀏覽器開啟時再試
      }
    }
  }

  private loadQueue() {
    try {
      const saved = localStorage.getItem('maternal-tracking-queue');
      if (saved) {
        this.queue = JSON.parse(saved);
      }
    } catch (error) {
      console.error('載入追蹤佇列失敗:', error);
      this.queue = [];
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem('maternal-tracking-queue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('儲存追蹤佇列失敗:', error);
    }
  }

  private startAutoSync() {
    this.syncTimer = setInterval(() => {
      this.syncNow();
    }, this.SYNC_INTERVAL);
  }

  stop() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
}

// 單例模式
let trackingQueueInstance: TrackingQueue | null = null;

export function getTrackingQueue(): TrackingQueue {
  if (typeof window === 'undefined') {
    // SSR 環境返回空實作
    return {
      add: () => {},
      syncNow: async () => {},
      stop: () => {},
    } as any;
  }

  if (!trackingQueueInstance) {
    trackingQueueInstance = new TrackingQueue();
  }
  return trackingQueueInstance;
}

// 便利函式：記錄頁面瀏覽
export function trackPageView(page: string, duration?: number) {
  const queue = getTrackingQueue();
  queue.add({
    userId: getUserId(),
    timestamp: new Date().toISOString(),
    eventType: 'page_view',
    page,
    duration,
  });
}

// 便利函式：記錄閱讀
export function trackReading(
  sectionId: string,
  sectionTitle: string,
  duration: number,
  scrollDepth: number
) {
  const queue = getTrackingQueue();
  queue.add({
    userId: getUserId(),
    timestamp: new Date().toISOString(),
    eventType: 'reading',
    sectionId,
    sectionTitle,
    duration,
    scrollDepth,
  });
}

// 便利函式：記錄提問
export function trackQuestion(question: string, context?: string) {
  const queue = getTrackingQueue();
  queue.add({
    userId: getUserId(),
    timestamp: new Date().toISOString(),
    eventType: 'question',
    question,
    metadata: context ? JSON.stringify({ context }) : undefined,
  });
}

// 便利函式：記錄學習進度
export function trackProgress(percentage: number, metadata?: any) {
  const queue = getTrackingQueue();
  queue.add({
    userId: getUserId(),
    timestamp: new Date().toISOString(),
    eventType: 'progress',
    progressPercentage: percentage,
    metadata: metadata ? JSON.stringify(metadata) : undefined,
  });
}
