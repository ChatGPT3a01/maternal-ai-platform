import { getUserId } from './analytics';
import { trackProgress } from './analytics';
import type { LearningProgress } from '@/types';
import laborCareData from '@/data/knowledge/labor-care.json';
import laborKnowledgeData from '@/data/knowledge/labor-knowledge.json';

// 定義所有知識點 ID
function getAllSectionIds(): string[] {
  const ids: string[] = [];

  // 待產注意事項
  laborCareData.sections.forEach((section) => {
    ids.push(section.id);
    if (section.subsections) {
      section.subsections.forEach((sub) => ids.push(sub.id));
    }
  });

  // 待產知識
  laborKnowledgeData.sections.forEach((section) => {
    ids.push(section.id);
    if (section.subsections) {
      section.subsections.forEach((sub) => ids.push(sub.id));
    }
  });

  return ids;
}

const ALL_SECTIONS = getAllSectionIds();

/**
 * 判斷是否完成閱讀
 */
export function isCompletedReading(
  duration: number, // 秒
  scrollDepth: number, // 0-100%
  estimatedTime: number = 5 // 預估閱讀時間（分鐘）
): boolean {
  // 停留時間 >= 預估時間的 50% 且滾動深度 >= 80%
  return duration >= estimatedTime * 0.5 * 60 && scrollDepth >= 80;
}

/**
 * 取得已完成章節
 */
export function getCompletedSections(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem('maternal-completed-sections');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('讀取已完成章節失敗:', error);
    return [];
  }
}

/**
 * 標記章節為已完成
 */
export function markSectionCompleted(sectionId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const completed = getCompletedSections();
    if (!completed.includes(sectionId)) {
      completed.push(sectionId);
      localStorage.setItem('maternal-completed-sections', JSON.stringify(completed));

      // 更新學習進度
      const progress = calculateProgress();
      trackProgress(progress.progressPercentage, {
        completedCount: progress.completedSections.length,
        totalCount: progress.totalSections,
      });
    }
  } catch (error) {
    console.error('標記章節完成失敗:', error);
  }
}

/**
 * 計算學習進度
 */
export function calculateProgress(): LearningProgress {
  const completed = getCompletedSections();
  const percentage = Math.floor((completed.length / ALL_SECTIONS.length) * 100);

  return {
    userId: getUserId(),
    totalSections: ALL_SECTIONS.length,
    completedSections: completed,
    progressPercentage: percentage,
    lastUpdated: new Date(),
  };
}

/**
 * 取得學習進度
 */
export function getLearningProgress(): LearningProgress {
  return calculateProgress();
}

/**
 * 重置學習進度（用於測試）
 */
export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('maternal-completed-sections');
}

/**
 * 檢查章節是否已完成
 */
export function isSectionCompleted(sectionId: string): boolean {
  return getCompletedSections().includes(sectionId);
}
