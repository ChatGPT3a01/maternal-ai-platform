import type {
  AIConfig,
  ChatSession,
  PregnancyInfo,
  BabyRecord,
  FeedingRecord,
  DiaperRecord,
  VaccineRecord,
} from '@/types';

const STORAGE_KEYS = {
  AI_CONFIG: 'maternal-ai-config',
  CHAT_SESSIONS: 'maternal-chat-sessions',
  PREGNANCY_INFO: 'maternal-pregnancy-info',
  BABY_RECORDS: 'maternal-baby-records',
  FEEDING_RECORDS: 'maternal-feeding-records',
  DIAPER_RECORDS: 'maternal-diaper-records',
  VACCINE_RECORDS: 'maternal-vaccine-records',
  LOCALE: 'maternal-locale',
} as const;

// Generic storage functions
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

// AI Config
export function getAIConfig(): AIConfig | null {
  return getItem<AIConfig | null>(STORAGE_KEYS.AI_CONFIG, null);
}

export function setAIConfig(config: AIConfig): void {
  setItem(STORAGE_KEYS.AI_CONFIG, config);
}

export function removeAIConfig(): void {
  removeItem(STORAGE_KEYS.AI_CONFIG);
}

// Chat Sessions
export function getChatSessions(): ChatSession[] {
  return getItem<ChatSession[]>(STORAGE_KEYS.CHAT_SESSIONS, []);
}

export function saveChatSession(session: ChatSession): void {
  const sessions = getChatSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);

  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.unshift(session);
  }

  setItem(STORAGE_KEYS.CHAT_SESSIONS, sessions);
}

export function deleteChatSession(sessionId: string): void {
  const sessions = getChatSessions().filter(s => s.id !== sessionId);
  setItem(STORAGE_KEYS.CHAT_SESSIONS, sessions);
}

export function clearAllChatSessions(): void {
  setItem(STORAGE_KEYS.CHAT_SESSIONS, []);
}

// Pregnancy Info
export function getPregnancyInfo(): PregnancyInfo | null {
  return getItem<PregnancyInfo | null>(STORAGE_KEYS.PREGNANCY_INFO, null);
}

export function setPregnancyInfo(info: PregnancyInfo): void {
  setItem(STORAGE_KEYS.PREGNANCY_INFO, info);
}

export function removePregnancyInfo(): void {
  removeItem(STORAGE_KEYS.PREGNANCY_INFO);
}

// Baby Records
export function getBabyRecords(): BabyRecord[] {
  return getItem<BabyRecord[]>(STORAGE_KEYS.BABY_RECORDS, []);
}

export function saveBabyRecord(record: BabyRecord): void {
  const records = getBabyRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  // Sort by date
  records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  setItem(STORAGE_KEYS.BABY_RECORDS, records);
}

export function deleteBabyRecord(recordId: string): void {
  const records = getBabyRecords().filter(r => r.id !== recordId);
  setItem(STORAGE_KEYS.BABY_RECORDS, records);
}

// Feeding Records
export function getFeedingRecords(): FeedingRecord[] {
  return getItem<FeedingRecord[]>(STORAGE_KEYS.FEEDING_RECORDS, []);
}

export function saveFeedingRecord(record: FeedingRecord): void {
  const records = getFeedingRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  records.sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return b.time.localeCompare(a.time);
  });

  setItem(STORAGE_KEYS.FEEDING_RECORDS, records);
}

export function deleteFeedingRecord(recordId: string): void {
  const records = getFeedingRecords().filter(r => r.id !== recordId);
  setItem(STORAGE_KEYS.FEEDING_RECORDS, records);
}

// Diaper Records
export function getDiaperRecords(): DiaperRecord[] {
  return getItem<DiaperRecord[]>(STORAGE_KEYS.DIAPER_RECORDS, []);
}

export function saveDiaperRecord(record: DiaperRecord): void {
  const records = getDiaperRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  records.sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return b.time.localeCompare(a.time);
  });

  setItem(STORAGE_KEYS.DIAPER_RECORDS, records);
}

export function deleteDiaperRecord(recordId: string): void {
  const records = getDiaperRecords().filter(r => r.id !== recordId);
  setItem(STORAGE_KEYS.DIAPER_RECORDS, records);
}

// Vaccine Records
export function getVaccineRecords(): VaccineRecord[] {
  return getItem<VaccineRecord[]>(STORAGE_KEYS.VACCINE_RECORDS, []);
}

export function saveVaccineRecord(record: VaccineRecord): void {
  const records = getVaccineRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  setItem(STORAGE_KEYS.VACCINE_RECORDS, records);
}

export function deleteVaccineRecord(recordId: string): void {
  const records = getVaccineRecords().filter(r => r.id !== recordId);
  setItem(STORAGE_KEYS.VACCINE_RECORDS, records);
}

// Locale
export function getLocale(): string {
  return getItem<string>(STORAGE_KEYS.LOCALE, 'zh-TW');
}

export function setLocale(locale: string): void {
  setItem(STORAGE_KEYS.LOCALE, locale);
}
