export const RUNWAY_THRESHOLDS = {
  critical: 7, // < 7 hari
  warn: 21,    // 7 - 20 hari, >= 21 safe
} as const;

export const MAX_NUDGE_PER_DAY = 2;

export const CATEGORIES = [
  'Makanan & Minuman',
  'Transportasi',
  'Tagihan',
  'Pulsa & Internet',
  'Kuliah',
  'Hiburan',
  'Belanja',
  'Lainnya',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Profile {
  monthlyIncome: number;
  fixedBills: number;
  startingBalance: number;
  dailyBudget: number;
  consentGiven: boolean;
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  kind: 'expense' | 'income';
  amount: number;
  category: Category;
  note: string;
  source: 'text' | 'voice' | 'receipt' | 'dashboard';
}

export type ScenarioId = 'late_allowance' | 'broken_laptop' | 'freelance_cancelled' | 'custom';

export interface Scenario {
  id: ScenarioId;
  label: string;
  params: {
    delayDays?: number;
    oneOffExpense?: number;
    incomeLossPct?: number;
    customLabel?: string;
  };
}

export interface RunwayResult {
  days: number;
  status: 'safe' | 'warn' | 'critical';
  topCategory: Category;
  dailyBurn: number;
  effectiveBalance: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  timestamp: string; // e.g. "14:20" or ISO
  text?: string;
  type?: 'text' | 'voice' | 'receipt' | 'consent' | 'draft' | 'stress_test' | 'purchase_check' | 'weekly_summary' | 'dashboard_link';
  payload?: any;
}

export interface ReminderItem {
  id: string;
  item: string;
  amount: number;
  dateCreated: string;
  dueDate: string;
  status: 'pending' | 'resolved';
}
