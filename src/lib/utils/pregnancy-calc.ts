import { differenceInDays, addDays, addWeeks, format } from 'date-fns';

/**
 * Calculate pregnancy weeks from last menstrual period (LMP)
 */
export function calculateWeeksFromLMP(lmpDate: Date): { weeks: number; days: number } {
  const today = new Date();
  const totalDays = differenceInDays(today, lmpDate);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  return { weeks, days };
}

/**
 * Calculate pregnancy weeks from due date
 */
export function calculateWeeksFromDueDate(dueDate: Date): { weeks: number; days: number } {
  const today = new Date();
  const daysUntilDue = differenceInDays(dueDate, today);
  const totalPregnancyDays = 280; // 40 weeks
  const daysPassed = totalPregnancyDays - daysUntilDue;
  const weeks = Math.floor(daysPassed / 7);
  const days = daysPassed % 7;
  return { weeks: Math.max(0, weeks), days: Math.max(0, days) };
}

/**
 * Calculate due date from last menstrual period
 * Uses Naegele's rule: LMP + 280 days (40 weeks)
 */
export function calculateDueDateFromLMP(lmpDate: Date): Date {
  return addDays(lmpDate, 280);
}

/**
 * Calculate LMP from due date
 */
export function calculateLMPFromDueDate(dueDate: Date): Date {
  return addDays(dueDate, -280);
}

/**
 * Get trimester based on weeks
 */
export function getTrimester(weeks: number): 1 | 2 | 3 {
  if (weeks < 13) return 1;
  if (weeks < 27) return 2;
  return 3;
}

/**
 * Get pregnancy milestone information
 */
export function getPregnancyMilestone(weeks: number): {
  trimester: number;
  milestone: string;
  description: string;
} {
  const trimester = getTrimester(weeks);

  const milestones: Record<number, { milestone: string; description: string }> = {
    4: { milestone: '著床完成', description: '受精卵已著床於子宮內膜' },
    8: { milestone: '胚胎成形', description: '主要器官開始發育，心臟開始跳動' },
    12: { milestone: '第一孕期結束', description: '流產風險大幅降低，可以開始告訴親友好消息' },
    16: { milestone: '感受胎動', description: '部分媽媽開始感受到胎動' },
    20: { milestone: '高層次超音波', description: '可進行詳細的胎兒結構檢查' },
    24: { milestone: '妊娠糖尿病篩檢', description: '建議進行妊娠糖尿病篩檢' },
    28: { milestone: '第三孕期開始', description: '寶寶快速成長，媽媽可能感到更疲累' },
    32: { milestone: '胎位檢查', description: '確認寶寶胎位，為生產做準備' },
    36: { milestone: '足月在即', description: '寶寶已接近足月，隨時可能生產' },
    37: { milestone: '足月', description: '寶寶已足月，可以安全出生' },
    40: { milestone: '預產期', description: '預產期到了！隨時準備迎接寶寶' },
  };

  // Find the closest milestone
  const milestoneWeeks = Object.keys(milestones).map(Number).sort((a, b) => a - b);
  let closestMilestone = milestoneWeeks[0];

  for (const mw of milestoneWeeks) {
    if (weeks >= mw) {
      closestMilestone = mw;
    }
  }

  return {
    trimester,
    ...milestones[closestMilestone],
  };
}

/**
 * Get recommended prenatal checkup schedule
 */
export function getPrenatalCheckups(weeks: number): {
  completed: string[];
  upcoming: string[];
} {
  const checkups = [
    { week: 8, name: '第一次產檢、超音波確認' },
    { week: 12, name: '唐氏症篩檢（第一孕期）' },
    { week: 16, name: '唐氏症篩檢（第二孕期）、羊膜穿刺（如需要）' },
    { week: 20, name: '高層次超音波' },
    { week: 24, name: '妊娠糖尿病篩檢' },
    { week: 28, name: '例行產檢' },
    { week: 30, name: '例行產檢' },
    { week: 32, name: '胎位檢查' },
    { week: 34, name: '例行產檢、乙型鏈球菌篩檢' },
    { week: 36, name: '每週產檢開始' },
    { week: 38, name: '例行產檢' },
    { week: 40, name: '預產期評估' },
  ];

  const completed = checkups
    .filter(c => c.week <= weeks)
    .map(c => `第 ${c.week} 週：${c.name}`);

  const upcoming = checkups
    .filter(c => c.week > weeks)
    .slice(0, 3)
    .map(c => `第 ${c.week} 週：${c.name}`);

  return { completed, upcoming };
}

/**
 * Format pregnancy week display
 */
export function formatPregnancyWeek(weeks: number, days: number): string {
  if (days === 0) {
    return `${weeks} 週`;
  }
  return `${weeks} 週 ${days} 天`;
}

/**
 * Get days until due date
 */
export function getDaysUntilDue(dueDate: Date): number {
  const today = new Date();
  return differenceInDays(dueDate, today);
}
