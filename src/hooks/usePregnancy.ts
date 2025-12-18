'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getPregnancyInfo, setPregnancyInfo, removePregnancyInfo } from '@/lib/utils/storage';
import {
  calculateWeeksFromLMP,
  calculateWeeksFromDueDate,
  calculateDueDateFromLMP,
  calculateLMPFromDueDate,
  getPregnancyMilestone,
  getPrenatalCheckups,
  formatPregnancyWeek,
  getDaysUntilDue,
} from '@/lib/utils/pregnancy-calc';
import type { PregnancyInfo } from '@/types';

export function usePregnancy() {
  const [pregnancyInfo, setPregnancyInfoState] = useState<PregnancyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedInfo = getPregnancyInfo();
    setPregnancyInfoState(savedInfo);
    setIsLoading(false);
  }, []);

  const savePregnancyInfo = useCallback((info: PregnancyInfo) => {
    setPregnancyInfo(info);
    setPregnancyInfoState(info);
  }, []);

  const clearPregnancyInfo = useCallback(() => {
    removePregnancyInfo();
    setPregnancyInfoState(null);
  }, []);

  const setDueDate = useCallback((dueDate: string) => {
    const dueDateObj = new Date(dueDate);
    const lmpDate = calculateLMPFromDueDate(dueDateObj);
    const { weeks, days } = calculateWeeksFromDueDate(dueDateObj);

    const info: PregnancyInfo = {
      dueDate,
      lastPeriodDate: lmpDate.toISOString().split('T')[0],
      currentWeek: weeks,
      currentDay: days,
    };

    savePregnancyInfo(info);
  }, [savePregnancyInfo]);

  const setLastPeriodDate = useCallback((lmpDate: string) => {
    const lmpDateObj = new Date(lmpDate);
    const dueDate = calculateDueDateFromLMP(lmpDateObj);
    const { weeks, days } = calculateWeeksFromLMP(lmpDateObj);

    const info: PregnancyInfo = {
      dueDate: dueDate.toISOString().split('T')[0],
      lastPeriodDate: lmpDate,
      currentWeek: weeks,
      currentDay: days,
    };

    savePregnancyInfo(info);
  }, [savePregnancyInfo]);

  // Calculate current pregnancy status
  const currentStatus = useMemo(() => {
    if (!pregnancyInfo?.dueDate) return null;

    const dueDate = new Date(pregnancyInfo.dueDate);
    const { weeks, days } = calculateWeeksFromDueDate(dueDate);
    const milestone = getPregnancyMilestone(weeks);
    const checkups = getPrenatalCheckups(weeks);
    const daysUntilDue = getDaysUntilDue(dueDate);
    const formattedWeek = formatPregnancyWeek(weeks, days);

    return {
      weeks,
      days,
      formattedWeek,
      trimester: milestone.trimester,
      milestone: milestone.milestone,
      milestoneDescription: milestone.description,
      completedCheckups: checkups.completed,
      upcomingCheckups: checkups.upcoming,
      daysUntilDue,
      dueDate: pregnancyInfo.dueDate,
      lmpDate: pregnancyInfo.lastPeriodDate,
    };
  }, [pregnancyInfo]);

  return {
    pregnancyInfo,
    currentStatus,
    isLoading,
    setDueDate,
    setLastPeriodDate,
    clearPregnancyInfo,
  };
}
