'use client';

import { usePageView } from '@/hooks/usePageView';

interface PageTrackerProps {
  pageName: string;
  children: React.ReactNode;
}

/**
 * 頁面追蹤包裝器
 * 自動記錄頁面瀏覽和停留時間
 */
export function PageTracker({ pageName, children }: PageTrackerProps) {
  usePageView(pageName);

  return <>{children}</>;
}
