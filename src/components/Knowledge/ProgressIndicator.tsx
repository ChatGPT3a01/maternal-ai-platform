'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, BookOpen } from 'lucide-react';
import { getLearningProgress } from '@/lib/tracking/progress';
import type { LearningProgress } from '@/types';

interface ProgressIndicatorProps {
  variant?: 'compact' | 'detailed';
}

/**
 * 學習進度指示器
 * 顯示已完成章節數和進度百分比
 */
export function ProgressIndicator({ variant = 'compact' }: ProgressIndicatorProps) {
  const [progress, setProgress] = useState<LearningProgress | null>(null);

  useEffect(() => {
    // 初始載入進度
    const currentProgress = getLearningProgress();
    setProgress(currentProgress);

    // 監聽 localStorage 變化（跨 tab 同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'maternal-completed-sections') {
        const updatedProgress = getLearningProgress();
        setProgress(updatedProgress);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 定期更新進度（同一 tab 內的變化）
    const interval = setInterval(() => {
      const updatedProgress = getLearningProgress();
      setProgress(updatedProgress);
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!progress) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-muted-foreground">
            已完成 <span className="font-semibold text-foreground">{progress.completedSections.length}</span>
            /{progress.totalSections} 章節
          </span>
        </div>
        <div className="flex-1 min-w-[120px] max-w-[200px]">
          <Progress value={progress.progressPercentage} className="h-2" />
        </div>
        <span className="text-sm font-semibold">{progress.progressPercentage}%</span>
      </div>
    );
  }

  // detailed variant
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/30">
            <BookOpen className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">學習進度</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">已完成章節</span>
                <span className="font-semibold">
                  {progress.completedSections.length} / {progress.totalSections}
                </span>
              </div>
              <Progress value={progress.progressPercentage} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">完成度</span>
                <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {progress.progressPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
