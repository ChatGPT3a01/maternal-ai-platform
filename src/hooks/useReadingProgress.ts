import { useEffect, useState, useRef } from 'react';
import { trackReading } from '@/lib/tracking/analytics';
import { markSectionCompleted, isCompletedReading } from '@/lib/tracking/progress';

interface UseReadingProgressOptions {
  sectionId: string;
  sectionTitle: string;
  estimatedReadTime?: number; // 預估閱讀時間（分鐘）
}

/**
 * 閱讀進度追蹤 Hook
 * 自動追蹤滾動深度和停留時間
 */
export function useReadingProgress({
  sectionId,
  sectionTitle,
  estimatedReadTime = 5,
}: UseReadingProgressOptions) {
  const [scrollDepth, setScrollDepth] = useState(0);
  const startTimeRef = useRef<number>(0);
  const maxScrollDepthRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();

    // 監聽滾動事件
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const depth = Math.floor(
        (scrollTop / (documentHeight - windowHeight)) * 100
      );

      const validDepth = Math.max(0, Math.min(100, depth));
      setScrollDepth(validDepth);
      maxScrollDepthRef.current = Math.max(maxScrollDepthRef.current, validDepth);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始計算

    return () => {
      window.removeEventListener('scroll', handleScroll);

      // 記錄閱讀事件
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const finalScrollDepth = maxScrollDepthRef.current;

      trackReading(sectionId, sectionTitle, duration, finalScrollDepth);

      // 判斷是否完成閱讀
      if (isCompletedReading(duration, finalScrollDepth, estimatedReadTime)) {
        markSectionCompleted(sectionId);
        console.log(`✅ 完成閱讀: ${sectionTitle}`);
      }
    };
  }, [sectionId, sectionTitle, estimatedReadTime]);

  return { scrollDepth };
}
