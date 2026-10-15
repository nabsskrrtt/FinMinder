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

export interface CategoryStyle {
  hex: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  'Makanan & Minuman': {
    hex: '#14B8A6',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    dot: 'bg-teal-500',
  },
  'Transportasi': {
    hex: '#0284C7',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
  },
  'Tagihan': {
    hex: '#6366F1',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
  },
  'Pulsa & Internet': {
    hex: '#8B5CF6',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
  },
  'Kuliah': {
    hex: '#EC4899',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    dot: 'bg-pink-500',
  },
  'Hiburan': {
    hex: '#F59E0B',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  'Belanja': {
    hex: '#10B981',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  'Lainnya': {
    hex: '#94A3B8',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-500',
  },
};

export const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_STYLES).map(([cat, style]) => [cat, style.hex])
);

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
