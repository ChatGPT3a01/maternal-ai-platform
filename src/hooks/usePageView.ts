import { useEffect, useRef } from 'react';
import { trackPageView } from '@/lib/tracking/analytics';

/**
 * 頁面瀏覽追蹤 Hook
 * 自動記錄頁面進入和離開時間
 */
export function usePageView(pageName: string) {
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // 記錄進入時間
    startTimeRef.current = Date.now();

    // 記錄進入事件
    trackPageView(pageName);

    // 離開時記錄停留時間
    return () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      trackPageView(pageName, duration);
    };
  }, [pageName]);
}
