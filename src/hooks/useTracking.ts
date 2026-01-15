import { useCallback } from 'react';
import { trackQuestion, trackProgress, getTrackingQueue } from '@/lib/tracking/analytics';
import { getLearningProgress } from '@/lib/tracking/progress';
import type { LearningProgress } from '@/types';

/**
 * 追蹤功能整合 Hook
 * 提供各種追蹤功能的便利介面
 */
export function useTracking() {
  // 記錄提問
  const recordQuestion = useCallback((question: string, context?: string) => {
    trackQuestion(question, context);
  }, []);

  // 記錄學習進度
  const recordProgress = useCallback((percentage: number, metadata?: any) => {
    trackProgress(percentage, metadata);
  }, []);

  // 取得學習進度
  const getProgress = useCallback((): LearningProgress => {
    return getLearningProgress();
  }, []);

  // 立即同步資料到 Google Sheets
  const syncNow = useCallback(async () => {
    const queue = getTrackingQueue();
    await queue.syncNow();
  }, []);

  return {
    recordQuestion,
    recordProgress,
    getProgress,
    syncNow,
  };
}
