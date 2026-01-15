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

// Knowledge base types (擴充版)
export interface KnowledgeImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface KnowledgeSubsection {
  id: string;
  title: string;
  content: string;
  suggestedQuestions: string[];
  images?: KnowledgeImage[];
  order: number;
}

export interface KnowledgeSection {
  id: string;
  title: string;
  content: string;
  subsections?: KnowledgeSubsection[];
  suggestedQuestions: string[];
  images?: KnowledgeImage[];
  order: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: 'labor-care' | 'labor-knowledge';
  sections: KnowledgeSection[];
  metadata: {
    readTime: number; // 預估閱讀時間(分鐘)
    lastUpdated: string;
    source: string;
  };
}

// Labor position images
export interface LaborPositionImage {
  id: string;
  name: string;
  category: string;
  path: string;
}

// 使用追蹤類型
export interface ReadingRecord {
  userId: string; // 匿名 ID (UUID)
  sectionId: string;
  sectionTitle: string;
  timestamp: Date;
  duration: number; // 秒
  scrollDepth: number; // 0-100%
}

export interface QuestionRecord {
  userId: string;
  question: string;
  context?: string; // 從哪個知識點提問
  timestamp: Date;
  aiProvider: AIProvider;
  aiModel: string;
}

export interface LearningProgress {
  userId: string;
  totalSections: number;
  completedSections: string[]; // section IDs
  progressPercentage: number;
  lastUpdated: Date;
}

export interface PageViewRecord {
  userId: string;
  page: string;
  timestamp: Date;
  duration: number; // 秒
  exitTimestamp?: Date;
}

// Google Sheets 上傳格式
export interface TrackingDataRow {
  userId: string;
  timestamp: string; // ISO 8601 格式
  eventType: 'page_view' | 'reading' | 'question' | 'progress';
  page?: string;
  sectionId?: string;
  sectionTitle?: string;
  question?: string;
  duration?: number;
  scrollDepth?: number;
  progressPercentage?: number;
  metadata?: string; // JSON string
}
