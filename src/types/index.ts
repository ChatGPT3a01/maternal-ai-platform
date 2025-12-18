// AI Provider types
export type AIProvider = 'gemini' | 'openai';

export type GeminiModel = 'gemini-2.5-flash' | 'gemini-2.5-pro';
export type OpenAIModel = 'gpt-4o' | 'gpt-5.2';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: GeminiModel | OpenAIModel;
}

// Chat types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  images?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Pregnancy tracker types
export interface PregnancyInfo {
  dueDate?: string;
  lastPeriodDate?: string;
  currentWeek?: number;
  currentDay?: number;
}

// Baby record types
export interface BabyRecord {
  id: string;
  date: string;
  weight?: number; // kg
  height?: number; // cm
  headCircumference?: number; // cm
  notes?: string;
}

export interface FeedingRecord {
  id: string;
  date: string;
  time: string;
  type: 'breastfeed' | 'formula' | 'mixed';
  duration?: number; // minutes
  amount?: number; // ml
  side?: 'left' | 'right' | 'both';
  notes?: string;
}

export interface DiaperRecord {
  id: string;
  date: string;
  time: string;
  type: 'wet' | 'dirty' | 'both';
  notes?: string;
}

export interface VaccineRecord {
  id: string;
  name: string;
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
}

// Symptom types
export type SymptomCategory = 'pregnancy' | 'labor' | 'postpartum' | 'baby';

export type SymptomSeverity = 'normal' | 'attention' | 'urgent';

export interface Symptom {
  id: string;
  name: string;
  category: SymptomCategory;
  description?: string;
}

export interface SymptomCheck {
  symptoms: string[];
  category: SymptomCategory;
  timestamp: Date;
  aiResponse?: string;
}

// Knowledge base types
export interface KnowledgeSection {
  title: string;
  content: string;
  keywords: string[];
}

// Labor position images
export interface LaborPositionImage {
  id: string;
  name: string;
  category: string;
  path: string;
}
